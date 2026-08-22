#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const {
  elfSectionBytes,
  parseElfFile,
  sha256Buffer,
  verifyElfAgainstModel,
  verifyMap,
  verifyRom,
} = require('../tools/lib/phase7_conventional');
const {
  adjustSectionAssembly,
  compareLinkedTargetBytes,
  fail,
  loadCanonicalBaserom,
  loadPhase8Model,
  validateSourceObjectProofBytes,
  verifySourceObjectProofs,
  verifyTargetMapOwner,
} = require('../tools/lib/phase8_matching_c');
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
  const sections = elf.sections.filter((section) => section.name === name);
  if (sections.length !== 1) fail(`test section does not resolve uniquely: ${name}`);
  return Buffer.from(elfSectionBytes(elf, sections[0]));
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function main() {
  if (process.argv.includes('--help') || process.argv.includes('-h')) {
    usage();
    process.exit(0);
  }
  const output = value('--output');
  const phase8 = loadPhase8Model();
  const canonicalBaserom = loadCanonicalBaserom(phase8);
  const elfFile = path.join(output, 'phase8.elf');
  const romFile = path.join(output, 'phase8.us_rev0.z64');
  const mapFile = path.join(output, 'phase8.map');
  const linkedElf = parseElfFile(elfFile);
  const romBytes = fs.readFileSync(romFile);
  const mapText = fs.readFileSync(mapFile, 'utf8');
  const buildReport = readJson(path.join(output, 'build-report.json'));
  if (buildReport.schemaVersion !== 3 || buildReport.status !== 'pass'
      || buildReport.verification.schemaVersion !== 3 || buildReport.verification.status !== 'pass') {
    fail('Phase 8 source-to-object report schema drift');
  }
  const linkageInput = buildReport.acceptedInputs && buildReport.acceptedInputs.linkageConfig;
  if (!linkageInput || linkageInput.path !== phase8.linkageConfigIdentity.path
      || linkageInput.bytes !== phase8.linkageConfigIdentity.bytes
      || linkageInput.sha256 !== phase8.linkageConfigIdentity.sha256) {
    fail('reviewed matching-C linkage input drift');
  }
  if (JSON.stringify(buildReport).includes('adapterApplications')
      || JSON.stringify(buildReport).includes('dialectProof')
      || JSON.stringify(buildReport).includes('dialectAssembly')) {
    fail('retired compiler-assembly adapter evidence returned');
  }

  const replacedRows = new Set(phase8.targets.map((target) => target.rowIndex));
  const verificationModel = {
    ...phase8.model,
    rows: phase8.model.rows.map((row) => replacedRows.has(row.index) ? { ...row, inputKind: 'matching-c' } : row),
  };
  verifyElfAgainstModel(verificationModel, linkedElf);
  verifyRom(phase8.model, romBytes);
  verifyMap(phase8.model, mapText);
  if (!romBytes.equals(canonicalBaserom) || sha256Buffer(romBytes) !== '571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A') {
    fail('complete Rev 0 ROM is not exact');
  }

  const classifications = classifyTargetSources(phase8.targets);
  const classificationBySymbol = new Map(classifications.targets.map((record) => [record.symbol, record]));
  const independentEvidence = verifySourceObjectProofs(phase8, { output, linkedElf, canonicalBaserom });
  if (JSON.stringify(buildReport.sourceObjectEvidence) !== JSON.stringify(independentEvidence)
      || JSON.stringify(buildReport.verification.sourceObjectEvidence) !== JSON.stringify(independentEvidence)
      || independentEvidence.counts.proofTargets !== phase8.targets.length
      || independentEvidence.counts.pureTargets !== classifications.counts.PURE_C
      || independentEvidence.counts.hybridTargets !== classifications.counts.HYBRID_C
      || independentEvidence.counts.compilerAssemblyRewrites !== 0
      || independentEvidence.counts.retiredPdrRelocations !== 38) {
    fail('source-to-object evidence aggregate drift');
  }

  const rewrittenHybrids = new Set([
    'func_0002CD70', 'func_0000BC8C', 'func_0015DF10',
    'func_0002DE10', 'func_00269798', 'func_0000B29C',
  ]);
  const targetProofs = [];
  for (const target of phase8.targets) {
    const replacement = buildReport.targetReplacements.find((record) => record.symbol === target.symbol);
    const verifiedTarget = buildReport.verification.targets.find((record) => record.symbol === target.symbol);
    const classification = classificationBySymbol.get(target.symbol);
    const evidence = independentEvidence.targets.find((record) => record.symbol === target.symbol);
    if (!replacement || !verifiedTarget || !classification || !evidence) fail(`target census drift: ${target.symbol}`);
    const owner = verifyTargetMapOwner(target, mapText);
    const sourceObject = parseElfFile(path.join(output, ...replacement.sourceObject.split('/')));
    const linkedObject = parseElfFile(path.join(output, ...replacement.cObject.split('/')));
    const fallbackObject = parseElfFile(path.join(output, ...replacement.fallbackObject.split('/')));
    const prunedObject = parseElfFile(path.join(output, ...replacement.prunedAssemblyObject.split('/')));
    const rawComparison = compareLinkedTargetBytes(target, linkedElf, canonicalBaserom);
    const sourceText = sectionBytes(sourceObject, target.sectionName);
    const linkedObjectText = sectionBytes(linkedObject, target.sectionName);
    const fallbackText = sectionBytes(fallbackObject, target.sectionName);
    if (!rawComparison.rawBytesExact || !rawComparison.linkedBytes.equals(fallbackText)
        || !sourceText.equals(linkedObjectText) || sourceText.length !== target.bytes
        || owner.linkedOwner !== replacement.cObject
        || prunedObject.sections.some((section) => section.name === target.sectionName)
        || prunedObject.symbols.some((symbol) => symbol.name === target.symbol)) {
      fail(`target byte, owner, or fallback exclusion drift: ${target.symbol}`);
    }
    if (sourceObject.sections.some((section) => section.name === '.pdr')
        || linkedObject.sections.some((section) => ['.pdr', '.reginfo', '.comment', '.note'].includes(section.name))) {
      fail(`discarded ancillary section entered active ownership: ${target.symbol}`);
    }
    if (target.expectedRelocations.some((record) => record.section === '.rel.pdr')
        || !target.legacyAncillaryRelocations.every((record) => record.section === '.rel.pdr')
        || JSON.stringify(replacement.relocations) !== JSON.stringify(target.expectedRelocations)) {
      fail(`load-relevant/retired relocation policy drift: ${target.symbol}`);
    }

    const compilerAssembly = fs.readFileSync(path.join(output, ...replacement.compilerAssembly.split('/')));
    const linkedAssembly = fs.readFileSync(path.join(output, ...replacement.linkedAssembly.split('/')));
    if (replacement.compilerAssemblyRewritten !== false
        || !adjustSectionAssembly(compilerAssembly, target.sectionName).equals(linkedAssembly)) {
      fail(`untouched KMC assembly contract drift: ${target.symbol}`);
    }
    const proofFile = path.join(output, ...replacement.sourceObjectProof.path.split('/'));
    const proofBytes = fs.readFileSync(proofFile);
    const proof = readJson(proofFile);
    if (proof.schemaVersion !== 1 || proof.kind !== 'ob64-source-to-object-load-evidence'
        || proof.target.symbol !== target.symbol || proof.target.sourceClass !== classification.class
        || proof.target.sourcePolicyDigest !== classification.digest
        || proof.target.relocationContractSource !== target.relocationContractSource
        || proof.assemblyContract.compilerAssemblyRewritten !== false
        || Object.prototype.hasOwnProperty.call(proof.assemblyContract, 'adapterApplied')
        || proof.artifacts.compilerAssembly.sha256 !== sha256Buffer(compilerAssembly)
        || proof.artifacts.sectionAdjustedAssembly.sha256 !== sha256Buffer(linkedAssembly)
        || proof.finalObject.textSha256 !== sha256Buffer(sourceText)
        || JSON.stringify(proof.finalObject.loadRelevantRelocationsNormalized) !== JSON.stringify(target.expectedRelocations)
        || JSON.stringify(proof.finalObject.legacyPdrRelocationsRetired) !== JSON.stringify(target.legacyAncillaryRelocations)
        || proof.finalTarget.rawBytesExact !== true
        || proof.finalTarget.linkedSha256 !== rawComparison.linkedTargetSha256
        || replacement.sourceObjectProof.sha256 !== sha256Buffer(proofBytes)) {
      fail(`source-to-object proof field or artifact drift: ${target.symbol}`);
    }
    if (![SOURCE_CLASSES.PURE_C, SOURCE_CLASSES.HYBRID_C].includes(classification.class)) {
      fail(`unexpected active source class: ${target.symbol}`);
    }
    if (rewrittenHybrids.has(target.symbol) && classification.class !== SOURCE_CLASSES.HYBRID_C) {
      fail(`GNU 2.6 hybrid rewrite changed source class: ${target.symbol}`);
    }
    if (target.symbol === 'func_0002CD70'
        && (sourceText.readUInt32BE(0x004) !== 0x00801025 || sourceText.readUInt32BE(0x028) !== 0x00801025
          || rawComparison.linkedTargetSha256 !== '9842231309587A8F054CE82E257F9DC0FD864608CF90266F53AFF570E37E1ADF')) {
      fail('func_0002CD70 explicit retail OR regression drift');
    }
    if (target.symbol === 'func_0019554C'
        && (classification.class !== SOURCE_CLASSES.PURE_C
          || rawComparison.linkedTargetSha256 !== '5985A5DFC866D4EFFB58C0E412AA76A8E0AE8DA0EF19BB8E44A6BF278C2A5E2B')) {
      fail('p3063 GNU 2.6 PURE_C regression drift');
    }
    if (target.symbol === 'func_001957D0' && classification.class !== SOURCE_CLASSES.HYBRID_C) {
      fail('p3064 must remain exact HYBRID_C');
    }
    targetProofs.push({
      symbol: target.symbol,
      sourceClass: classification.class,
      bytes: target.bytes,
      linkedTargetSha256: rawComparison.linkedTargetSha256,
      soleCOwner: true,
      originalAssemblyExcluded: true,
      compilerAssemblyRewritten: false,
      relocationContractSource: target.relocationContractSource,
      loadRelevantRelocations: target.expectedRelocations.length,
      retiredPdrRelocations: target.legacyAncillaryRelocations.length,
      sourceObjectProofSha256: replacement.sourceObjectProof.sha256,
    });
  }
  if (![...rewrittenHybrids].every((symbol) => targetProofs.some((record) => record.symbol === symbol))) {
    fail('GNU 2.6 hybrid rewrite census was not exercised');
  }
  if (!buildReport.verification.asmDiffer.every((record) => record.exact && record.rawBytesExact && record.asmDifferPairwiseExact)) {
    fail('asm-differ/raw target comparison drift');
  }

  const mutations = [];
  mutations.push(expectRejection('ROM padding', /linked ROM size drift/, () => {
    verifyRom(phase8.model, Buffer.concat([romBytes, Buffer.from([0])]));
  }));
  const linkedSection = linkedElf.sections.find((section) => section.name === phase8.target.sectionName);
  const sizeDrift = Buffer.from(fs.readFileSync(elfFile));
  sizeDrift.writeUInt32BE(linkedSection.size + 4, linkedSection.headerOffset + 20);
  mutations.push(expectRejection('target ELF section size', /ELF section size drift/, () => {
    verifyElfAgainstModel(verificationModel, require('../tools/lib/phase7_conventional').parseElf32BigEndian(sizeDrift));
  }));
  const expectedOwner = `objects/c/${phase8.target.symbol}.o`;
  const wrongOwner = `objects/assembly/chunk_${String(phase8.target.chunkIndex).padStart(3, '0')}.o`;
  const fakeSource = classifySource(path.join(__dirname, 'fixtures', 'source-policy', 'ordinary.c'), { preprocessor: resolvePreprocessor() });
  if (fakeSource.class !== SOURCE_CLASSES.PURE_C) fail('ownership falsifier source fixture is not PURE_C');
  mutations.push(expectRejection('target map owner', /sole matching C object/, () => {
    verifyTargetMapOwner(phase8.target, mapText.split(expectedOwner).join(wrongOwner));
  }));
  const firstProofFile = path.join(output, ...buildReport.targetReplacements[0].sourceObjectProof.path.split('/'));
  const firstProofBytes = fs.readFileSync(firstProofFile);
  const staleProof = JSON.parse(firstProofBytes.toString('utf8'));
  staleProof.schemaVersion = 0;
  mutations.push(expectRejection('stale source-to-object proof', /schema drift/, () => {
    validateSourceObjectProofBytes(Buffer.from(`${JSON.stringify(staleProof, null, 2)}\n`), firstProofBytes);
  }));
  const adapterProof = JSON.parse(firstProofBytes.toString('utf8'));
  adapterProof.assemblyContract.adapterApplied = false;
  mutations.push(expectRejection('retired adapter field', /schema drift/, () => {
    validateSourceObjectProofBytes(Buffer.from(`${JSON.stringify(adapterProof, null, 2)}\n`), firstProofBytes);
  }));

  console.log(JSON.stringify({
    status: 'pass',
    romSha256: sha256Buffer(romBytes),
    targets: targetProofs.length,
    counts: classifications.counts,
    rewrittenHybrids: [...rewrittenHybrids],
    sourceObjectEvidence: independentEvidence.counts,
    targetProofs,
    mutations,
  }, null, 2));
}

main();
