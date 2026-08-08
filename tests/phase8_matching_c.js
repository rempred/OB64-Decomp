#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const {
  elfSectionBytes,
  parseElf32BigEndian,
  sha256Buffer,
  verifyElfAgainstModel,
  verifyMap,
  verifyRom,
} = require('../tools/lib/phase7_conventional');
const {
  compareLinkedTargetBytes,
  fail,
  loadCanonicalBaserom,
  loadPhase8Model,
  verifyDialectProofs,
  verifyTargetMapOwner,
} = require('../tools/lib/phase8_matching_c');
const { adjustSectionAssembly } = require('../tools/lib/compiler_assembly_dialect');
const {
  SOURCE_CLASSES,
  classifySource,
  classifyTargetSources,
  resolvePreprocessor,
} = require('../tools/lib/source_policy');

function usage() {
  console.log('Usage: node tests/phase8_matching_c.js --output <phase8-output>');
}

function value(flag) {
  const index = process.argv.indexOf(flag);
  if (index < 0 || !process.argv[index + 1]) fail(`missing ${flag}`);
  return path.resolve(process.argv[index + 1]);
}

function expectRejection(name, pattern, callback) {
  try {
    callback();
  } catch (error) {
    if (!pattern.test(error.message)) throw error;
    return { name, status: 'rejected', message: error.message };
  }
  fail(`${name} mutation was accepted`);
}

function sectionBytes(elf, name) {
  const section = elf.sections.find((candidate) => candidate.name === name);
  if (!section) fail(`test section is missing: ${name}`);
  return Buffer.from(elfSectionBytes(elf, section));
}

function main() {
  if (process.argv.includes('--help') || process.argv.includes('-h')) {
    usage();
    process.exit(0);
  }
  const output = value('--output');
  const phase8 = loadPhase8Model();
  const canonicalBaserom = loadCanonicalBaserom(phase8);
  const elfBytes = fs.readFileSync(path.join(output, 'phase8.elf'));
  const romBytes = fs.readFileSync(path.join(output, 'phase8.us_rev0.z64'));
  const mapText = fs.readFileSync(path.join(output, 'phase8.map'), 'utf8');
  const buildReport = JSON.parse(fs.readFileSync(path.join(output, 'build-report.json'), 'utf8'));
  if (buildReport.schemaVersion !== 2 || buildReport.verification.schemaVersion !== 2) fail('Phase 8 dialect report schema drift');
  const linkedElf = parseElf32BigEndian(elfBytes);
  const replacedRows = new Set(phase8.targets.map((target) => target.rowIndex));
  const verificationModel = {
    ...phase8.model,
    rows: phase8.model.rows.map((row) => replacedRows.has(row.index) ? { ...row, inputKind: 'matching-c' } : row),
  };
  verifyElfAgainstModel(verificationModel, linkedElf);
  verifyRom(phase8.model, romBytes);
  verifyMap(phase8.model, mapText);
  const classifications = classifyTargetSources(phase8.targets);
  const classificationBySymbol = new Map(classifications.targets.map((record) => [record.symbol, record]));
  const dialectVerification = verifyDialectProofs(phase8, { output, linkedElf, canonicalBaserom });
  if (dialectVerification.counts.proofTargets !== 36
      || dialectVerification.counts.pureTargets !== 3
      || dialectVerification.counts.hybridTargets !== 33
      || dialectVerification.counts.transformedTargets !== 0
      || dialectVerification.counts.transformations !== 0
      || dialectVerification.counts.hybridByteIdenticalTargets !== 33
      || dialectVerification.counts.hybridTransformations !== 0) {
    fail('Phase 2 dialect aggregate gate drift');
  }
  const targetProofs = [];
  let func2cd70Seen = false;
  for (const target of phase8.targets) {
    verifyTargetMapOwner(target, mapText);
    const cObject = parseElf32BigEndian(fs.readFileSync(path.join(output, 'objects', 'c', `${target.symbol}.o`)));
    const fallbackObject = parseElf32BigEndian(fs.readFileSync(path.join(output, 'comparison', 'original', `chunk_${String(target.chunkIndex).padStart(3, '0')}.o`)));
    const prunedObject = parseElf32BigEndian(fs.readFileSync(path.join(output, 'objects', 'assembly', `chunk_${String(target.chunkIndex).padStart(3, '0')}.o`)));
    const rawComparison = compareLinkedTargetBytes(target, linkedElf, canonicalBaserom);
    if (!rawComparison.rawBytesExact) fail(`raw linked target comparison is not exact: ${target.symbol}`);
    const linkedText = rawComparison.linkedBytes;
    const cText = sectionBytes(cObject, target.sectionName);
    const fallbackText = sectionBytes(fallbackObject, target.sectionName);
    if (!linkedText.equals(fallbackText)) fail(`linked/original target comparison is not exact: ${target.symbol}`);
    if (cText.length !== target.bytes) fail(`C object target size drift: ${target.symbol}`);
    if (prunedObject.sections.some((section) => section.name === target.sectionName)) fail(`original assembly target remains linked: ${target.symbol}`);
    const compilerAssembly = fs.readFileSync(path.join(output, 'generated', 'c', `${target.symbol}.compiler.s`));
    const dialectAssembly = fs.readFileSync(path.join(output, 'generated', 'c', `${target.symbol}.dialect.s`));
    const sectionAssembly = fs.readFileSync(path.join(output, 'generated', 'c', `${target.symbol}.s`));
    const proofFile = path.join(output, 'generated', 'c', `${target.symbol}.dialect-proof.json`);
    const proofBytes = fs.readFileSync(proofFile);
    const proof = JSON.parse(proofBytes.toString('utf8'));
    const classification = classificationBySymbol.get(target.symbol);
    const verifiedDialectTarget = dialectVerification.targets.find((record) => record.symbol === target.symbol);
    if (!classification || !verifiedDialectTarget || proof.schemaVersion !== 1 || proof.target !== target.symbol
        || proof.sourcePolicy.class !== classification.class || proof.sourcePolicy.digest !== classification.digest
        || proof.dialect.manifestSha256 !== phase8.dialect.identity.manifestSha256
        || proof.dialect.implementationSha256 !== phase8.dialect.identity.implementationSha256
        || proof.artifacts.compilerAssembly.sha256 !== sha256Buffer(compilerAssembly)
        || proof.artifacts.dialectAssembly.sha256 !== sha256Buffer(dialectAssembly)
        || proof.artifacts.sectionAdjustedAssembly.sha256 !== sha256Buffer(sectionAssembly)
        || proof.counts.transformationCount !== verifiedDialectTarget.transformationCount
        || verifiedDialectTarget.proof.sha256 !== sha256Buffer(proofBytes)) {
      fail(`dialect proof field or artifact drift: ${target.symbol}`);
    }
    if (!adjustSectionAssembly(dialectAssembly, target.sectionName).equals(sectionAssembly)) {
      fail(`section-adjusted assembly derivation drift: ${target.symbol}`);
    }
    if (classification.class === SOURCE_CLASSES.HYBRID_C) {
      if (proof.eligibility.eligible || proof.eligibility.action !== 'byte-identical-passthrough'
          || !proof.eligibility.bypassReason || proof.counts.transformationCount !== 0
          || !proof.artifacts.rawAndAdaptedByteIdentical || !compilerAssembly.equals(dialectAssembly)
          || proof.artifacts.compilerAssembly.sha256 !== proof.artifacts.dialectAssembly.sha256) {
        fail(`hybrid dialect passthrough drift: ${target.symbol}`);
      }
    } else if (classification.class === SOURCE_CLASSES.PURE_C) {
      if (!proof.eligibility.eligible || proof.counts.transformationCount !== 0) fail(`Phase 2 pure dialect gate drift: ${target.symbol}`);
    } else {
      fail(`unexpected active target source class: ${target.symbol}`);
    }
    if (target.symbol === 'func_0002CD70') {
      func2cd70Seen = true;
      if (classification.class !== SOURCE_CLASSES.HYBRID_C
          || cText.readUInt32BE(0x004) !== 0x00801025 || cText.readUInt32BE(0x028) !== 0x00801025
          || linkedText.readUInt32BE(0x004) !== 0x00801025 || linkedText.readUInt32BE(0x028) !== 0x00801025
          || rawComparison.linkedTargetSha256 !== '9842231309587A8F054CE82E257F9DC0FD864608CF90266F53AFF570E37E1ADF') {
        fail('func_0002CD70 dialect or instruction-word gate drift');
      }
    }
    targetProofs.push({
      symbol: target.symbol,
      bytes: linkedText.length,
      rawBytesExact: rawComparison.rawBytesExact,
      linkedTargetSha256: rawComparison.linkedTargetSha256,
      expectedTargetSha256: rawComparison.expectedTargetSha256,
      originalExcluded: true,
      soleCOwner: true,
      sourceClass: classification.class,
      transformationCount: proof.counts.transformationCount,
      compilerAssemblySha256: proof.artifacts.compilerAssembly.sha256,
      dialectAssemblySha256: proof.artifacts.dialectAssembly.sha256,
      sectionAdjustedAssemblySha256: proof.artifacts.sectionAdjustedAssembly.sha256,
      dialectProofSha256: sha256Buffer(proofBytes),
    });
  }
  if (!func2cd70Seen) fail('func_0002CD70 dialect regression was not exercised');
  if (JSON.stringify(buildReport.verification.dialect) !== JSON.stringify(dialectVerification)) {
    fail('build-wide dialect verification differs from independent recomputation');
  }

  const mutations = [];
  mutations.push(expectRejection('ROM padding', /linked ROM size drift/, () => {
    verifyRom(phase8.model, Buffer.concat([romBytes, Buffer.from([0])]));
  }));

  const linkedSection = linkedElf.sections.find((section) => section.name === phase8.target.sectionName);
  const sizeDrift = Buffer.from(elfBytes);
  sizeDrift.writeUInt32BE(linkedSection.size + 4, linkedSection.headerOffset + 20);
  mutations.push(expectRejection('target ELF section size', /ELF section size drift/, () => {
    verifyElfAgainstModel(phase8.model, parseElf32BigEndian(sizeDrift));
  }));

  const expectedOwner = `objects/c/${phase8.target.symbol}.o`;
  const wrongOwner = `objects/assembly/chunk_${String(phase8.target.chunkIndex).padStart(3, '0')}.o`;
  const fakeSource = classifySource(path.join(__dirname, 'fixtures', 'source-policy', 'ordinary.c'), { preprocessor: resolvePreprocessor() });
  if (fakeSource.class !== SOURCE_CLASSES.PURE_C) fail('ownership falsifier source fixture is not PURE_C');
  verifyRom(phase8.model, romBytes);
  mutations.push(expectRejection('target map owner', /sole matching C object/, () => {
    verifyTargetMapOwner(phase8.target, mapText.split(expectedOwner).join(wrongOwner));
  }));

  console.log(JSON.stringify({
    status: 'pass',
    baseline: { targets: targetProofs.length, targetProofs },
    ownershipFalsifier: {
      fakeSourceClass: fakeSource.class,
      romRemainedExact: true,
      wrongOwnerRejected: true,
    },
    mutations,
  }, null, 2));
}

main();
