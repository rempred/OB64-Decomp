#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const textContract = require('../tools/lib/text_contract');
const {
  ROOT,
  elfSectionBytes,
  parseElf32BigEndian,
  parseElfFile,
  sha256Buffer,
  sha256File,
  verifyElfAgainstModel,
  verifyMap,
  verifyRom,
} = require('../tools/lib/phase7_conventional');
const {
  adjustSectionAssembly,
  auxiliaryRelocationRecords,
  compareLinkedAuxiliaryBytes,
  compareLinkedTargetBytes,
  copyPhase7Objects,
  fail,
  loadCanonicalBaserom,
  loadPhase8Model,
  renderPhase8LinkerScript,
  sameCompilerOccurrenceEvidence,
  targetTextOwners,
  validateAuxiliaryPrefixObject,
  validateAuxiliaryTailObject,
  validateRecordedPhase8Build,
  validateSourceObjectProofBytes,
  verifyCompilerTextFunctions,
  verifySourceObjectProofs,
  verifyAuxiliaryLinkedObjectSection,
  verifyAuxiliaryMapOwner,
  verifyAuxiliarySourceObjectSection,
  verifyObjectManifest,
  verifyPhase8Layout,
  verifyTargetMapOwner,
  writeLayout,
  writeObjectManifest,
} = require('../tools/lib/phase8_matching_c');
const {
  SOURCE_CLASSES,
  classifySource,
  classifyTargetSources,
  compilationInputBytes,
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

function reverseObjectKeyOrder(value) {
  if (Array.isArray(value)) return value.map(reverseObjectKeyOrder);
  if (!value || typeof value !== 'object') return value;
  return Object.keys(value).reverse().reduce((result, key) => {
    result[key] = reverseObjectKeyOrder(value[key]);
    return result;
  }, {});
}

function b894OccurrenceEvidence(report) {
  const symbol = 'func_0021B894';
  const outputSection = '.ob64.r4156';
  const replacement = report.targetReplacements.find((record) => record.symbol === symbol);
  const verifiedTarget = report.verification.targets.find((record) => record.symbol === symbol);
  const compiled = replacement && replacement.auxiliarySections.find((record) => (
    record.outputSection === outputSection
  ));
  const verified = verifiedTarget && verifiedTarget.auxiliarySections.find((record) => (
    record.outputSection === outputSection
  ));
  if (!compiled || !verified
      || !Array.isArray(compiled.compilerOccurrences) || compiled.compilerOccurrences.length !== 1
      || !Array.isArray(verified.compilerOccurrences) || verified.compilerOccurrences.length !== 1
      || !Array.isArray(verified.compilerOccurrences[0].loadRelevantRelocationsNormalized)
      || verified.compilerOccurrences[0].loadRelevantRelocationsNormalized.length !== 11) {
    fail('active B894 recorded compiler-occurrence canary is missing');
  }
  return { compiled, verified };
}

function verifyRecordedCompilerOccurrenceEquality(phase8, output, buildReport) {
  if (!phase8.targets.some((target) => target.symbol === 'func_0021B894')) {
    // Exercise the same production comparison without promoting an unfinished
    // source merely to populate its historical recorded-build canary.
    const expected = [0, 1].map((index) => ({ label: `.L${index}`, bytes: 8,
      linkedSha256: String(index).repeat(64), rawLinkedBytesExact: true,
      loadRelevantRelocationsNormalized: [0, 4].map((offset) => ({
        offset, type: 'R_MIPS_32', symbol: '.text', addend: offset + index * 8,
      })) }));
    if (!sameCompilerOccurrenceEvidence(reverseObjectKeyOrder(expected), expected)) {
      fail('equivalent compiler-occurrence object-key order rejected');
    }
    const mutations = [
      ['missing field', (value) => { delete value[0].bytes; }],
      ['extra field', (value) => { value[0].extra = true; }],
      ['wrong type', (value) => { value[0].bytes = '8'; }],
      ['wrong hash', (value) => { value[0].linkedSha256 = 'F'.repeat(64); }],
      ['wrong exactness', (value) => { value[0].rawLinkedBytesExact = false; }],
      ['relocation order', (value) => value[0].loadRelevantRelocationsNormalized.reverse()],
      ['occurrence order', (value) => value.reverse()],
      ['extra occurrence', (value) => value.push(value[0])],
    ].map(([name, mutate]) => {
      const value = JSON.parse(JSON.stringify(expected)); mutate(value);
      if (sameCompilerOccurrenceEvidence(value, expected)) fail(`compiler-occurrence ${name} drift accepted`);
      return { name, status: 'rejected' };
    });
    return { scope: 'isolated production comparator; no B894 activation',
      equivalentObjectKeyOrder: 'accepted', mutations };
  }
  const validate = (report) => validateRecordedPhase8Build(phase8, {
    output,
    buildReport: report,
    verification: report.verification,
    compilerSha256: report.compiler.sha256,
  });
  const clone = () => JSON.parse(JSON.stringify(buildReport));
  const rejection = /recorded Phase 8 auxiliary provenance drift: func_0021B894 \.ob64\.r4156/;

  const reordered = clone();
  const reorderedEvidence = b894OccurrenceEvidence(reordered);
  const originalCompiledJson = JSON.stringify(reorderedEvidence.compiled.compilerOccurrences);
  const originalVerifiedJson = JSON.stringify(reorderedEvidence.verified.compilerOccurrences);
  reorderedEvidence.compiled.compilerOccurrences = reorderedEvidence.compiled.compilerOccurrences
    .map(reverseObjectKeyOrder);
  reorderedEvidence.verified.compilerOccurrences = reorderedEvidence.verified.compilerOccurrences
    .map(reverseObjectKeyOrder);
  if (JSON.stringify(reorderedEvidence.compiled.compilerOccurrences) === originalCompiledJson
      || JSON.stringify(reorderedEvidence.verified.compilerOccurrences) === originalVerifiedJson) {
    fail('B894 compiler-occurrence key-order regression was a no-op');
  }
  validate(reordered);

  const materialDrift = clone();
  const materialOccurrence = b894OccurrenceEvidence(materialDrift).verified.compilerOccurrences[0];
  materialOccurrence.linkedSha256 = `${materialOccurrence.linkedSha256[0] === '0' ? '1' : '0'}${materialOccurrence.linkedSha256.slice(1)}`;
  const materialRejection = expectRejection('B894 compiler-occurrence material value', rejection, () => {
    validate(materialDrift);
  });

  const relocationOrderDrift = clone();
  const orderedRelocations = b894OccurrenceEvidence(relocationOrderDrift).verified
    .compilerOccurrences[0].loadRelevantRelocationsNormalized;
  const originalRelocationJson = JSON.stringify(orderedRelocations);
  orderedRelocations.reverse();
  if (JSON.stringify(orderedRelocations) === originalRelocationJson) {
    fail('B894 compiler-occurrence relocation-order regression was a no-op');
  }
  const relocationOrderRejection = expectRejection(
    'B894 compiler-occurrence relocation order',
    rejection,
    () => validate(relocationOrderDrift),
  );

  return {
    symbol: 'func_0021B894',
    outputSection: '.ob64.r4156',
    occurrences: 1,
    orderedRelocations: 11,
    equivalentObjectKeyOrder: 'accepted',
    mutations: [materialRejection, relocationOrderRejection],
  };
}

function verifySyntheticPrefixExtraction(phase8, output) {
  const firstSource = phase8.targets.find((target) => target.symbol === 'func_00283E14');
  const secondSource = phase8.targets.find((target) => target.symbol === 'func_002861C8');
  if (!firstSource || !secondSource
      || firstSource.auxiliarySections[0].outputSection !== secondSource.auxiliarySections[0].outputSection) {
    fail('synthetic retained-prefix extraction canaries are missing');
  }
  const first = JSON.parse(JSON.stringify(firstSource));
  const second = JSON.parse(JSON.stringify(secondSource));
  const auxiliary = first.auxiliarySections[0];
  const prefixBytes = 4;
  const canonicalBaserom = loadCanonicalBaserom(phase8);
  const expectedPrefix = Buffer.from(canonicalBaserom.subarray(
    auxiliary.ownerRomStartNumber,
    auxiliary.ownerRomStartNumber + prefixBytes,
  ));
  auxiliary.preservedPrefix = { authenticated: true };
  auxiliary.ownerPrefixSection = auxiliary.outputSection + '.prefix';
  auxiliary.ownerPrefixAlignment = 1;
  auxiliary.ownerPrefixBytes = prefixBytes;
  auxiliary.ownerPrefixSha256 = sha256Buffer(expectedPrefix);
  auxiliary.ownerPrefixRomStartNumber = auxiliary.ownerRomStartNumber;
  auxiliary.ownerPrefixRomEndNumber = auxiliary.ownerRomStartNumber + prefixBytes;
  auxiliary.ownerPrefixVramStartNumber = auxiliary.ownerVramStartNumber;
  auxiliary.ownerPrefixVramEndNumber = auxiliary.ownerVramStartNumber + prefixBytes;
  auxiliary.romStartNumber += prefixBytes;
  auxiliary.vramStartNumber += prefixBytes;
  auxiliary.romStart = `0x${auxiliary.romStartNumber.toString(16).toUpperCase().padStart(8, '0')}`;
  auxiliary.vramStart = `0x${auxiliary.vramStartNumber.toString(16).toUpperCase().padStart(8, '0')}`;
  auxiliary.bytes -= prefixBytes;
  auxiliary.entries -= prefixBytes / 4;
  auxiliary.entryBytes -= prefixBytes;
  auxiliary.expectedRelocations = auxiliary.expectedRelocations.slice(prefixBytes / 4).map((relocation, index) => ({
    ...relocation,
    offset: `0x${(index * 4).toString(16).toUpperCase().padStart(8, '0')}`,
  }));
  auxiliary.expectedLinkedSha256 = sha256Buffer(canonicalBaserom.subarray(
    auxiliary.romStartNumber,
    auxiliary.romEndNumber,
  ));

  const scratchRoot = path.join(__dirname, '..', 'build', 'tests');
  fs.mkdirSync(scratchRoot, { recursive: true });
  const scratch = fs.mkdtempSync(path.join(scratchRoot, 'phase8-prefix-extraction-'));
  try {
    const phase7Objects = path.join(scratch, 'phase7', 'objects');
    const sourceObject = path.join(output, 'comparison', 'original', 'chunk_040.o');
    const copiedSource = path.join(phase7Objects, 'assembly', 'chunk_040.o');
    fs.mkdirSync(path.dirname(copiedSource), { recursive: true });
    fs.copyFileSync(sourceObject, copiedSource);
    const phase7 = {
      files: { objectManifest: path.join(phase7Objects, 'manifest.json') },
      objectManifest: {
        objects: [{
          path: 'objects/assembly/chunk_040.o',
          bytes: fs.statSync(copiedSource).size,
          sha256: sha256File(copiedSource),
        }],
      },
    };
    const syntheticPhase8 = { ...phase8, targets: [first, second] };
    const syntheticOutput = path.join(scratch, 'phase8');
    fs.mkdirSync(syntheticOutput, { recursive: true });
    const objcopy = path.join(
      ROOT,
      '.toolchains',
      'gnu-binutils-2.6-mips-kmc-elf-msys2',
      'bin',
      'mips-kmc-elf-objcopy.exe',
    );
    const copied = copyPhase7Objects(syntheticPhase8, phase7, syntheticOutput, objcopy);
    const replacement = copied.replacements.get(40);
    const prefix = replacement && replacement.auxiliaryPrefixes.find((record) => (
      record.symbol === first.symbol && record.outputSection === auxiliary.outputSection
    ));
    if (!prefix || prefix.prefixBytes !== prefixBytes || !prefix.objectRelative
        || prefix.prefixSha256 !== sha256Buffer(expectedPrefix)) {
      fail('synthetic retained-prefix extraction record drift');
    }
    const prefixObject = parseElfFile(path.join(syntheticOutput, ...prefix.objectRelative.split('/')));
    validateAuxiliaryPrefixObject(prefixObject, auxiliary, expectedPrefix);
    const compiled = new Map();
    for (const target of syntheticPhase8.targets) {
      // The combined manifest authenticates ordinary text provenance too.
      // Preserve real producer artifacts for these unchanged text owners.
      for (const relative of [target.source,
        `generated/c/${target.symbol}.compiler.s`, `generated/c/${target.symbol}.s`]) {
        const destination = path.join(syntheticOutput, relative);
        fs.mkdirSync(path.dirname(destination), { recursive: true });
        fs.copyFileSync(path.join(output, relative), destination);
      }
      const objectRelative = `objects/c/${target.symbol}.o`;
      const objectFile = path.join(syntheticOutput, ...objectRelative.split('/'));
      const proofObjectRelative = `objects/c/${target.symbol}.source-object.o`;
      const proofObjectFile = path.join(syntheticOutput, ...proofObjectRelative.split('/'));
      fs.mkdirSync(path.dirname(objectFile), { recursive: true });
      fs.copyFileSync(path.join(output, ...objectRelative.split('/')), objectFile);
      fs.copyFileSync(path.join(output, ...proofObjectRelative.split('/')), proofObjectFile);
      compiled.set(target.symbol, {
        objectRelative,
        objectSha256: sha256File(objectFile),
        proofObjectRelative,
        proofObjectSha256: sha256File(proofObjectFile),
        ...textContract.recordsForTarget(target, syntheticOutput),
      });
    }
    const manifest = writeObjectManifest(
      syntheticOutput,
      copied.linkedObjects,
      syntheticPhase8,
      copied.replacements,
      compiled,
    );
    const verifiedManifest = verifyObjectManifest(syntheticOutput, syntheticPhase8);
    const prefixOwner = verifiedManifest.manifest.linkedObjects.find((record) => (
      record.ownerKind === 'accepted-assembly-auxiliary-prefix'
    ));
    if (!prefixOwner || prefixOwner.path !== prefix.objectRelative
        || prefixOwner.prefixBytes !== prefixBytes
        || manifest.sha256 !== verifiedManifest.sha256) {
      fail('synthetic retained-prefix ownership manifest drift');
    }
    const manifestFile = path.join(syntheticOutput, 'objects', 'manifest.json');
    const manifestBytes = fs.readFileSync(manifestFile);
    const mutatedManifest = JSON.parse(manifestBytes);
    mutatedManifest.linkedObjects.find(record => record.ownerKind === 'accepted-assembly-auxiliary-prefix').prefixBytes += 4;
    fs.writeFileSync(manifestFile, JSON.stringify(mutatedManifest));
    const manifestMutation = expectRejection('retained prefix manifest extent',
      /prefix|manifest/, () => verifyObjectManifest(syntheticOutput, syntheticPhase8));
    fs.writeFileSync(manifestFile, manifestBytes);
    const linkerText = renderPhase8LinkerScript(syntheticPhase8, manifest);
    const prefixSelector = `    ${prefix.objectRelative}(${prefix.inputSection})`;
    const logicalSelector = `    *(${auxiliary.outputSection})`;
    const prefixSelectorIndex = linkerText.indexOf(prefixSelector);
    const logicalSelectorIndex = linkerText.indexOf(logicalSelector);
    if (prefixSelectorIndex < 0 || logicalSelectorIndex < 0
        || prefixSelectorIndex >= logicalSelectorIndex
        || linkerText.indexOf(prefixSelector, prefixSelectorIndex + 1) >= 0
        || linkerText.indexOf(logicalSelector, logicalSelectorIndex + 1) >= 0) {
      fail('synthetic retained-prefix linker ordering drift');
    }
    const baseLayout = readJson(path.join(output, 'layout.json'));
    for (const target of syntheticPhase8.targets) {
      for (const ownerContract of targetTextOwners(target)) {
        const owner = baseLayout.owners.find((record) => record.index === ownerContract.rowIndex);
        if (!owner) fail('synthetic retained-prefix base layout owner is missing');
        owner.inputKind = 'tracked-assembly';
        for (const field of [
          'baseInputKind',
          'source',
          'originalAssemblyFallback',
          'matchingCSymbol',
          'matchingCLogicalOffset',
        ]) delete owner[field];
      }
    }
    const baseLayoutFile = path.join(scratch, 'phase7', 'layout.json');
    fs.writeFileSync(baseLayoutFile, `${JSON.stringify(baseLayout, null, 2)}\n`);
    phase7.files.layout = baseLayoutFile;
    // Layout text evidence uses the real unchanged linked text sections.
    // The synthetic auxiliary model is checked separately below.
    for (const relative of ['phase8.elf', 'phase8.map']) {
      fs.copyFileSync(path.join(output, relative), path.join(syntheticOutput, relative));
    }
    writeLayout(syntheticPhase8, phase7, syntheticOutput, copied.replacements);
    const writtenLayout = readJson(path.join(syntheticOutput, 'layout.json'));
    const verifiedLayout = verifyPhase8Layout(
      syntheticPhase8,
      writtenLayout,
      copied.replacements,
    );
    const layoutPrefix = verifiedLayout.phase8AuxiliarySections.find((record) => (
      record.symbol === first.symbol && record.outputSection === auxiliary.outputSection
    ));
    if (!layoutPrefix || layoutPrefix.acceptedAssemblyPrefixBytes !== prefixBytes
        || layoutPrefix.acceptedAssemblyPrefixObject !== prefix.objectRelative
        || layoutPrefix.acceptedAssemblyPrefixSha256 !== sha256Buffer(expectedPrefix)) {
      fail('synthetic retained-prefix layout evidence drift');
    }
    const mutatedLayout = JSON.parse(JSON.stringify(writtenLayout));
    mutatedLayout.phase8AuxiliarySections.find((record) => (
      record.symbol === first.symbol && record.outputSection === auxiliary.outputSection
    )).acceptedAssemblyPrefixBytes += 4;
    const layoutMutation = expectRejection(
      'retained prefix layout extent',
      /external layout auxiliary drift/,
      () => verifyPhase8Layout(syntheticPhase8, mutatedLayout, copied.replacements),
    );
    const invalidPrefixGrammar = expectRejection('invented source prefix without compiler grammar',
      /source-object prefix compiler grammar is missing/, () => adjustSectionAssembly(
        fs.readFileSync(path.join(output, 'generated/c', first.symbol + '.compiler.s')),
        first.sectionName, { auxiliarySections: [{ ...auxiliary, sourceObjectPrefix: {} }] }));
    return {
      scope: 'retained assembly prefix; source-object prefix producer covered by real switch-table fixture',
      bytes: prefix.prefixBytes,
      sha256: prefix.prefixSha256,
      binarySha256: prefix.binarySha256,
      objectSha256: prefix.objectSha256,
      manifestSha256: manifest.sha256,
      linkerScriptSha256: sha256Buffer(Buffer.from(linkerText, 'utf8')),
      layoutPrefixObject: layoutPrefix.acceptedAssemblyPrefixObject,
      mutations: [manifestMutation, layoutMutation, invalidPrefixGrammar],
    };
  } finally {
    if (path.dirname(path.resolve(scratch)) !== path.resolve(scratchRoot)) {
      fail('synthetic retained-prefix scratch escaped its test root');
    }
    fs.rmSync(scratch, { recursive: true, force: true });
  }
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
  if (buildReport.schemaVersion !== 5 || buildReport.status !== 'pass'
      || buildReport.verification.schemaVersion !== 5 || buildReport.verification.status !== 'pass') {
    fail('Phase 8 source-to-object report schema drift');
  }
  const objectManifest = verifyObjectManifest(output, phase8).manifest;
  const recordedCompilerOccurrenceEquality = verifyRecordedCompilerOccurrenceEquality(
    phase8,
    output,
    buildReport,
  );
  const syntheticPrefixExtraction = verifySyntheticPrefixExtraction(phase8, output);
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

  const replacedRows = new Set(phase8.targets.flatMap((target) => targetTextOwners(target).map((owner) => owner.rowIndex)));
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
    const textOwners = targetTextOwners(target);
    const sourceText = Buffer.concat(textOwners.map((textOwner) => sectionBytes(sourceObject, textContract.inputSection(target, textOwner.sectionName))));
    const linkedObjectText = Buffer.concat(textOwners.map((textOwner) => sectionBytes(linkedObject, textContract.inputSection(target, textOwner.sectionName))));
    const sourceTextSection = sourceObject.sections.find((section) => section.name === textContract.inputSection(target, target.sectionName));
    const linkedTextSection = linkedElf.sections.find((section) => section.name === target.sectionName);
    const compilerTextFunctions = verifyCompilerTextFunctions(sourceObject, target, sourceTextSection);
    const linkedCompilerTextFunctions = verifyCompilerTextFunctions(linkedElf, target, linkedTextSection, true);
    const ownerArtifacts = textOwners.map((textOwner) => {
      const replacementOwner = replacement.owners.find((record) => record.rowIndex === textOwner.rowIndex);
      if (!replacementOwner) fail(`target replacement owner census drift: ${target.symbol} ${textOwner.sectionName}`);
      const fallback = parseElfFile(path.join(output, ...replacementOwner.fallbackObject.split('/')));
      const pruned = parseElfFile(path.join(output, ...replacementOwner.prunedAssemblyObject.split('/')));
      return {
        textOwner,
        fallback,
        pruned,
        fallbackText: sectionBytes(fallback, textOwner.sectionName),
      };
    });
    const fallbackText = Buffer.concat(ownerArtifacts.map((record) => record.fallbackText));
    if (!rawComparison.rawBytesExact || !rawComparison.linkedBytes.equals(fallbackText)
        || !sourceText.equals(linkedObjectText) || sourceText.length !== target.bytes
        || JSON.stringify(replacement.compilerTextFunctions) !== JSON.stringify(compilerTextFunctions)
        || JSON.stringify(verifiedTarget.compilerTextFunctions) !== JSON.stringify(linkedCompilerTextFunctions)
        || owner.owners.length !== textOwners.length
        || owner.owners.some((record) => record.linkedOwner !== replacement.cObject)
        || ownerArtifacts.some((record) => (
          record.pruned.sections.some((section) => section.name === record.textOwner.sectionName)
          || record.pruned.symbols.some((symbol) => symbol.name === record.textOwner.symbol)
        ))) {
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
    const auxiliaryChecks = [];
    for (const auxiliary of target.auxiliarySections) {
      const sourceSections = sourceObject.sections.filter((section) => section.name === auxiliary.outputSection);
      const linkedSections = linkedObject.sections.filter((section) => section.name === auxiliary.outputSection);
      const auxiliaryFallbackObject = parseElfFile(path.join(output, 'comparison', 'original', `chunk_${String(auxiliary.ownerChunkIndex).padStart(3, '0')}.o`));
      const auxiliaryPrunedObject = parseElfFile(path.join(output, 'objects', 'assembly', `chunk_${String(auxiliary.ownerChunkIndex).padStart(3, '0')}.o`));
      const fallbackSections = auxiliaryFallbackObject.sections.filter((section) => section.name === auxiliary.outputSection);
      const prefixOwner = objectManifest.linkedObjects.find((record) => (
        record.ownerKind === 'accepted-assembly-auxiliary-prefix'
        && record.targetSymbol === target.symbol
        && record.outputSection === auxiliary.outputSection
      ));
      const prefix = prefixOwner ? { ...prefixOwner, objectRelative: prefixOwner.path } : null;
      const tail = replacement.auxiliaryTails.find((record) => record.outputSection === auxiliary.outputSection);
      if (sourceSections.length !== 1 || linkedSections.length !== 1 || fallbackSections.length !== 1
          || (auxiliary.ownerPrefixBytes > 0 && !prefix) || !tail) {
        fail(`auxiliary object census drift: ${target.symbol} ${auxiliary.outputSection}`);
      }
      const linkedObjectAuxiliary = Buffer.from(elfSectionBytes(linkedObject, linkedSections[0]));
      const fallbackOwner = Buffer.from(elfSectionBytes(auxiliaryFallbackObject, fallbackSections[0]));
      const fallbackOffset = auxiliary.romStartNumber - auxiliary.ownerRomStartNumber;
      const fallbackFragment = fallbackOwner.subarray(fallbackOffset, fallbackOffset + auxiliary.bytes);
      const fallbackTailOffset = auxiliary.ownerTailRomStartNumber - auxiliary.ownerRomStartNumber;
      const fallbackTail = fallbackOwner.subarray(
        fallbackTailOffset,
        fallbackTailOffset + auxiliary.ownerTailBytes,
      );
      const linkedComparison = compareLinkedAuxiliaryBytes(target, auxiliary, linkedElf, canonicalBaserom);
      const mapOwner = verifyAuxiliaryMapOwner(target, auxiliary, tail, mapText, prefix);
      const sourceEvidence = verifyAuxiliarySourceObjectSection(
        sourceObject,
        target,
        auxiliary,
        `${target.symbol} ${auxiliary.outputSection} test source object`,
      );
      const linkedObjectEvidence = verifyAuxiliaryLinkedObjectSection(
        linkedObject,
        target,
        auxiliary,
        `${target.symbol} ${auxiliary.outputSection} test linked object`,
      );
      const selectedSourceAuxiliary = sourceEvidence.selectedBytes;
      const relocations = sourceEvidence.relocations;
      const expectedSourceObjectPrefix = sourceEvidence.sourceObjectPrefix || undefined;
      const compiledAuxiliary = replacement.auxiliarySections.find((record) => (
        record.outputSection === auxiliary.outputSection
      ));
      const verifiedAuxiliary = verifiedTarget.auxiliarySections.find((record) => (
        record.outputSection === auxiliary.outputSection
      ));
      if (!selectedSourceAuxiliary.equals(linkedObjectEvidence.bytes)
          || !linkedObjectEvidence.bytes.equals(linkedObjectAuxiliary)
          || sha256Buffer(selectedSourceAuxiliary) !== auxiliary.expectedObjectSha256
          || fallbackOwner.length !== auxiliary.ownerSectionBytes
          || sha256Buffer(fallbackFragment) !== auxiliary.expectedLinkedSha256
          || !linkedComparison.rawBytesExact
          || linkedComparison.linkedSha256 !== auxiliary.expectedLinkedSha256
          || mapOwner.linkedOwner !== replacement.cObject
          || auxiliaryPrunedObject.sections.some((section) => section.name === auxiliary.outputSection)
          || JSON.stringify(relocations) !== JSON.stringify(auxiliary.expectedRelocations)
          || !compiledAuxiliary || !verifiedAuxiliary
          || JSON.stringify(compiledAuxiliary.sourceObjectPrefix) !== JSON.stringify(expectedSourceObjectPrefix)
          || JSON.stringify(verifiedAuxiliary.sourceObjectPrefix) !== JSON.stringify(expectedSourceObjectPrefix)) {
        fail(`auxiliary placement, bytes, owner, or relocation drift: ${target.symbol} ${auxiliary.outputSection}`);
      }
      if (tail.tailBytes > 0) {
        const tailObject = parseElfFile(path.join(output, ...tail.objectRelative.split('/')));
        validateAuxiliaryTailObject(tailObject, auxiliary, fallbackTail);
      }
      auxiliaryChecks.push({
        auxiliary,
        linkedComparison,
        mapOwner,
        relocations,
        sourceEvidence,
        linkedObjectEvidence,
      });
    }

    const compilerAssembly = fs.readFileSync(path.join(output, ...replacement.compilerAssembly.split('/')));
    const linkedAssembly = fs.readFileSync(path.join(output, ...replacement.linkedAssembly.split('/')));
    if (replacement.compilerAssemblyRewritten !== false
        || !textContract.assemblerInput(compilerAssembly, target, adjustSectionAssembly, {
          auxiliarySections: target.auxiliarySections,
        }).equals(linkedAssembly)) {
      fail(`untouched KMC assembly contract drift: ${target.symbol}`);
    }
    const proofFile = path.join(output, ...replacement.sourceObjectProof.path.split('/'));
    const proofBytes = fs.readFileSync(proofFile);
    const proof = readJson(proofFile);
    const compilerInput = fs.readFileSync(path.join(output, ...replacement.compilationInput.path.split('/')));
    const expectedSourceObjectPrefixSelections = target.auxiliarySections.filter((auxiliary) => (
      auxiliary.sourceObjectPrefix
    )).length;
    const hasSourceObjectPrefixSelections = Object.prototype.hasOwnProperty.call(
      proof.assemblyContract,
      'sourceObjectPrefixSelections',
    );
    if (proof.schemaVersion !== 4 || proof.kind !== 'ob64-source-to-object-load-evidence'
        || proof.target.symbol !== target.symbol || proof.target.sourceClass !== classification.class
        || proof.target.sourcePolicyDigest !== classification.digest
        || JSON.stringify(proof.target.compilationInput) !== JSON.stringify(classification.compilationInput)
        || JSON.stringify(proof.target.dependencies) !== JSON.stringify(classification.dependencies)
        || proof.target.relocationContractSource !== target.relocationContractSource
        || proof.assemblyContract.compilerAssemblyRewritten !== false
        || proof.assemblyContract.classifiedBytesAreCompilerInput !== true
        || proof.assemblyContract.auxiliarySectionCount !== target.auxiliarySections.length
        || (expectedSourceObjectPrefixSelections === 0
          ? hasSourceObjectPrefixSelections
          : (!hasSourceObjectPrefixSelections
            || proof.assemblyContract.sourceObjectPrefixSelections !== expectedSourceObjectPrefixSelections
            || !proof.assemblyContract.permittedAdjustment.includes('zero-offset prefix for linkage')))
        || !Array.isArray(proof.finalObject.auxiliarySections)
        || proof.finalObject.auxiliarySections.length !== target.auxiliarySections.length
        || !Array.isArray(proof.finalTarget.auxiliarySections)
        || proof.finalTarget.auxiliarySections.length !== target.auxiliarySections.length
        || Object.prototype.hasOwnProperty.call(proof.assemblyContract, 'adapterApplied')
        || proof.artifacts.compilerAssembly.sha256 !== sha256Buffer(compilerAssembly)
        || proof.artifacts.compilationInput.sha256 !== sha256Buffer(compilerInput)
        || !compilerInput.equals(compilationInputBytes(classification))
        || proof.artifacts.sectionAdjustedAssembly.sha256 !== sha256Buffer(linkedAssembly)
        || proof.finalObject.textSha256 !== sha256Buffer(sourceText)
        || JSON.stringify(proof.finalObject.compilerTextFunctions) !== JSON.stringify(compilerTextFunctions)
        || JSON.stringify(proof.finalObject.loadRelevantRelocationsNormalized) !== JSON.stringify(target.expectedRelocations)
        || JSON.stringify(proof.finalObject.legacyPdrRelocationsRetired) !== JSON.stringify(target.legacyAncillaryRelocations)
        || proof.finalTarget.rawBytesExact !== true
        || proof.finalTarget.linkedSha256 !== rawComparison.linkedTargetSha256
        || JSON.stringify(proof.finalTarget.compilerTextFunctions) !== JSON.stringify(linkedCompilerTextFunctions)
        || replacement.sourceObjectProof.sha256 !== sha256Buffer(proofBytes)) {
      fail(`source-to-object proof field or artifact drift: ${target.symbol}`);
    }
    for (const check of auxiliaryChecks) {
      const objectProof = proof.finalObject.auxiliarySections.find((record) => record.outputSection === check.auxiliary.outputSection);
      const targetProof = proof.finalTarget.auxiliarySections.find((record) => record.outputSection === check.auxiliary.outputSection);
      const expectedSourceObjectPrefix = check.sourceEvidence.sourceObjectPrefix || undefined;
      const expectedLinkedObjectSection = expectedSourceObjectPrefix ? {
        sectionType: check.auxiliary.sectionType,
        sectionFlags: check.auxiliary.sectionFlags,
        alignment: check.linkedObjectEvidence.section.alignment,
        bytes: check.linkedObjectEvidence.bytes.length,
        sha256: sha256Buffer(check.linkedObjectEvidence.bytes),
        loadRelevantRelocationsNormalized: check.linkedObjectEvidence.relocations,
      } : undefined;
      if (!objectProof || !targetProof
          || objectProof.sectionType !== 'SHT_PROGBITS'
          || JSON.stringify(objectProof.sectionFlags) !== JSON.stringify(['SHF_ALLOC'])
          || objectProof.alignment !== check.auxiliary.alignment
          || objectProof.objectSha256 !== check.auxiliary.expectedObjectSha256
          || JSON.stringify(objectProof.loadRelevantRelocationsNormalized) !== JSON.stringify(check.auxiliary.expectedRelocations)
          || JSON.stringify(objectProof.sourceObjectPrefix) !== JSON.stringify(expectedSourceObjectPrefix)
          || JSON.stringify(objectProof.linkedObjectSection) !== JSON.stringify(expectedLinkedObjectSection)
          || targetProof.romStart !== check.auxiliary.romStart
          || targetProof.vramStart !== check.auxiliary.vramStart
          || targetProof.linkedSha256 !== check.auxiliary.expectedLinkedSha256
          || targetProof.rawBytesExact !== true) {
        fail(`auxiliary source-object proof drift: ${target.symbol} ${check.auxiliary.outputSection}`);
      }
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
    if (['func_001957D0', 'func_001960A8'].includes(target.symbol) && classification.class !== SOURCE_CLASSES.PURE_C) {
      fail('accepted Squad migrated targets must remain exact PURE_C');
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
  const auxiliaryCanary = phase8.targets.find((target) => (
    target.auxiliarySections.some((candidate) => candidate.ownerTailBytes > 0 && !candidate.sourceObjectPrefix)
  ));
  const auxiliary = auxiliaryCanary && auxiliaryCanary.auxiliarySections.find((candidate) => (
    candidate.ownerTailBytes > 0 && !candidate.sourceObjectPrefix
  ));
  const auxiliaryReplacement = auxiliaryCanary
    ? buildReport.targetReplacements.find((record) => record.symbol === auxiliaryCanary.symbol)
    : null;
  if (!auxiliaryCanary || !auxiliary || !auxiliaryReplacement) fail('auxiliary mutation canary is missing');
  const auxiliaryPrefixOwner = objectManifest.linkedObjects.find((record) => (
    record.ownerKind === 'accepted-assembly-auxiliary-prefix'
    && record.targetSymbol === auxiliaryCanary.symbol
    && record.outputSection === auxiliary.outputSection
  ));
  const auxiliaryPrefix = auxiliaryPrefixOwner
    ? { ...auxiliaryPrefixOwner, objectRelative: auxiliaryPrefixOwner.path }
    : null;
  if (auxiliary.ownerPrefixBytes > 0 && !auxiliaryPrefix) {
    fail('auxiliary prefix mutation canary is missing');
  }
  const auxiliarySection = linkedElf.sections.find((section) => section.name === auxiliary.outputSection);
  if (!auxiliarySection) fail('linked auxiliary mutation section is missing');
  const writableAuxiliary = Buffer.from(fs.readFileSync(elfFile));
  writableAuxiliary.writeUInt32BE(3, auxiliarySection.headerOffset + 8);
  mutations.push(expectRejection('writable linked auxiliary section', /section shape drift/, () => {
    compareLinkedAuxiliaryBytes(auxiliaryCanary, auxiliary, parseElf32BigEndian(writableAuxiliary), canonicalBaserom);
  }));
  const alignmentDrift = Buffer.from(fs.readFileSync(elfFile));
  alignmentDrift.writeUInt32BE(auxiliary.alignment / 2, auxiliarySection.headerOffset + 32);
  mutations.push(expectRejection('linked auxiliary alignment', /section shape drift/, () => {
    compareLinkedAuxiliaryBytes(auxiliaryCanary, auxiliary, parseElf32BigEndian(alignmentDrift), canonicalBaserom);
  }));
  const auxiliaryByteDrift = Buffer.from(fs.readFileSync(elfFile));
  const auxiliaryOffsetInOwner = auxiliary.vramStartNumber - auxiliary.ownerVramStartNumber;
  auxiliaryByteDrift[auxiliarySection.offset + auxiliaryOffsetInOwner] ^= 0x01;
  mutations.push(expectRejection('linked auxiliary byte', /bytes are not exact/, () => {
    const comparison = compareLinkedAuxiliaryBytes(
      auxiliaryCanary,
      auxiliary,
      parseElf32BigEndian(auxiliaryByteDrift),
      canonicalBaserom,
    );
    if (!comparison.rawBytesExact) throw new Error('linked auxiliary bytes are not exact');
  }));
  const auxiliaryTail = auxiliaryReplacement.auxiliaryTails.find((record) => record.outputSection === auxiliary.outputSection);
  const auxiliaryTailObjectFile = path.join(output, ...auxiliaryTail.objectRelative.split('/'));
  const auxiliaryTailObjectBytes = Buffer.from(fs.readFileSync(auxiliaryTailObjectFile));
  const auxiliaryTailObject = parseElf32BigEndian(auxiliaryTailObjectBytes);
  const auxiliaryTailSection = auxiliaryTailObject.sections.find((section) => section.name === auxiliary.ownerTailSection);
  const expectedTailBytes = Buffer.from(canonicalBaserom.subarray(
    auxiliary.ownerTailRomStartNumber,
    auxiliary.ownerTailRomEndNumber,
  ));
  validateAuxiliaryTailObject(auxiliaryTailObject, auxiliary, expectedTailBytes);
  const syntheticPrefixAuxiliary = {
    ...auxiliary,
    preservedPrefix: { authenticated: true },
    ownerPrefixSection: auxiliary.outputSection + '.prefix',
    ownerPrefixAlignment: auxiliary.ownerTailAlignment,
    ownerPrefixBytes: expectedTailBytes.length,
    ownerPrefixSha256: sha256Buffer(expectedTailBytes),
    ownerPrefixRomStartNumber: auxiliary.ownerRomStartNumber,
    ownerPrefixRomEndNumber: auxiliary.ownerRomStartNumber + expectedTailBytes.length,
    ownerPrefixVramStartNumber: auxiliary.ownerVramStartNumber,
    ownerPrefixVramEndNumber: auxiliary.ownerVramStartNumber + expectedTailBytes.length,
  };
  const syntheticPrefixObject = {
    ...auxiliaryTailObject,
    sections: auxiliaryTailObject.sections.map((section) => section === auxiliaryTailSection
      ? { ...section, name: syntheticPrefixAuxiliary.ownerPrefixSection }
      : section),
  };
  validateAuxiliaryPrefixObject(syntheticPrefixObject, syntheticPrefixAuxiliary, expectedTailBytes);
  const malformedPrefixObject = {
    ...syntheticPrefixObject,
    sections: [
      ...syntheticPrefixObject.sections,
      { ...syntheticPrefixObject.sections.find((section) => section.name === syntheticPrefixAuxiliary.ownerPrefixSection), name: '.mystery-prefix' },
    ],
  };
  mutations.push(expectRejection('unknown allocated prefix vessel', /preserved-prefix object shape drift/, () => {
    validateAuxiliaryPrefixObject(malformedPrefixObject, syntheticPrefixAuxiliary, expectedTailBytes);
  }));

  const syntheticMapAuxiliary = {
    outputSection: '.ob64.r9998',
    vramStartNumber: 0x80001004,
    vramEndNumber: 0x80001008,
    bytes: 4,
    romStartNumber: 0x00001004,
    romEndNumber: 0x00001008,
    ownerOriginalAssembly: 'asm/original/rev0/lib/fixture.s',
    ownerOriginalAssemblySha256: 'A'.repeat(64),
    ownerPrefixSection: '.ob64.r9998.prefix',
    ownerPrefixAlignment: 1,
    ownerPrefixBytes: 4,
    ownerPrefixSha256: 'B'.repeat(64),
    ownerPrefixRomStartNumber: 0x00001000,
    ownerPrefixRomEndNumber: 0x00001004,
    ownerPrefixVramStartNumber: 0x80001000,
    ownerPrefixVramEndNumber: 0x80001004,
    ownerTailSection: '.ob64.r9998.tail',
    ownerTailAlignment: 1,
    ownerTailBytes: 4,
    ownerTailSha256: 'C'.repeat(64),
    ownerTailRomStartNumber: 0x00001008,
    ownerTailRomEndNumber: 0x0000100C,
    ownerTailVramStartNumber: 0x80001008,
    ownerTailVramEndNumber: 0x8000100C,
  };
  const syntheticPrefixRecord = {
    inputSection: syntheticMapAuxiliary.ownerPrefixSection,
    sectionType: 'SHT_PROGBITS',
    sectionFlags: ['SHF_ALLOC'],
    alignment: 1,
    prefixBytes: 4,
    prefixSha256: syntheticMapAuxiliary.ownerPrefixSha256,
    romStart: syntheticMapAuxiliary.ownerPrefixRomStartNumber,
    romEndExclusive: syntheticMapAuxiliary.ownerPrefixRomEndNumber,
    vramStart: syntheticMapAuxiliary.ownerPrefixVramStartNumber,
    vramEndExclusive: syntheticMapAuxiliary.ownerPrefixVramEndNumber,
    ownerOriginalAssembly: syntheticMapAuxiliary.ownerOriginalAssembly,
    ownerOriginalAssemblySha256: syntheticMapAuxiliary.ownerOriginalAssemblySha256,
    objectRelative: 'objects/assembly/auxiliary/fixture_prefix.o',
  };
  const syntheticTailRecord = {
    inputSection: syntheticMapAuxiliary.ownerTailSection,
    sectionType: 'SHT_PROGBITS',
    sectionFlags: ['SHF_ALLOC'],
    alignment: 1,
    tailBytes: 4,
    tailSha256: syntheticMapAuxiliary.ownerTailSha256,
    romStart: syntheticMapAuxiliary.ownerTailRomStartNumber,
    romEndExclusive: syntheticMapAuxiliary.ownerTailRomEndNumber,
    vramStart: syntheticMapAuxiliary.ownerTailVramStartNumber,
    vramEndExclusive: syntheticMapAuxiliary.ownerTailVramEndNumber,
    ownerOriginalAssembly: syntheticMapAuxiliary.ownerOriginalAssembly,
    ownerOriginalAssemblySha256: syntheticMapAuxiliary.ownerOriginalAssemblySha256,
    objectRelative: 'objects/assembly/auxiliary/fixture_tail.o',
  };
  const syntheticMap = [
    '.ob64.r9998 0x80001000 0xc',
    '    .ob64.r9998.prefix 0x80001000 0x4 objects/assembly/auxiliary/fixture_prefix.o',
    '    .ob64.r9998 0x80001004 0x4 objects/c/fixture_prefix_target.o',
    '    .ob64.r9998.tail 0x80001008 0x4 objects/assembly/auxiliary/fixture_tail.o',
    '.ob64.r9999 0x8000100c 0x4',
  ].join('\n');
  const syntheticMapOwner = verifyAuxiliaryMapOwner(
    { symbol: 'fixture_prefix_target' },
    syntheticMapAuxiliary,
    syntheticTailRecord,
    syntheticMap,
    syntheticPrefixRecord,
  );
  if (!syntheticMapOwner.prefixContribution || !syntheticMapOwner.tailContribution) {
    fail('synthetic retained prefix/tail map ownership drift');
  }
  mutations.push(expectRejection('preserved prefix placement', /prefix placement drift/, () => {
    verifyAuxiliaryMapOwner(
      { symbol: 'fixture_prefix_target' },
      syntheticMapAuxiliary,
      syntheticTailRecord,
      syntheticMap.replace('0x80001000 0x4 objects/assembly/auxiliary/fixture_prefix.o',
        '0x80000ffc 0x4 objects/assembly/auxiliary/fixture_prefix.o'),
      syntheticPrefixRecord,
    );
  }));
  const conventionalDataTail = {
    ...auxiliaryTailObject,
    sections: auxiliaryTailObject.sections.map((section) => section === auxiliaryTailSection
      ? { ...section, name: '.data' }
      : section),
  };
  mutations.push(expectRejection('conventional data tail vessel', /forbidden conventional data section/, () => {
    validateAuxiliaryTailObject(conventionalDataTail, auxiliary, expectedTailBytes);
  }));
  const bssTail = {
    ...auxiliaryTailObject,
    sections: auxiliaryTailObject.sections.map((section) => section === auxiliaryTailSection
      ? { ...section, name: '.bss', type: 8 }
      : section),
  };
  mutations.push(expectRejection('bss tail vessel', /forbidden conventional data section/, () => {
    validateAuxiliaryTailObject(bssTail, auxiliary, expectedTailBytes);
  }));
  const writableTail = {
    ...auxiliaryTailObject,
    sections: auxiliaryTailObject.sections.map((section) => section === auxiliaryTailSection
      ? { ...section, flags: section.flags | 1 }
      : section),
  };
  mutations.push(expectRejection('writable tail vessel', /object shape drift/, () => {
    validateAuxiliaryTailObject(writableTail, auxiliary, expectedTailBytes);
  }));
  const executableTail = {
    ...auxiliaryTailObject,
    sections: auxiliaryTailObject.sections.map((section) => section === auxiliaryTailSection
      ? { ...section, flags: section.flags | 4 }
      : section),
  };
  mutations.push(expectRejection('executable tail vessel', /object shape drift/, () => {
    validateAuxiliaryTailObject(executableTail, auxiliary, expectedTailBytes);
  }));
  const unknownAllocatedTail = {
    ...auxiliaryTailObject,
    sections: [
      ...auxiliaryTailObject.sections,
      { ...auxiliaryTailSection, name: '.mystery-tail' },
    ],
  };
  mutations.push(expectRejection('unknown allocated tail vessel', /object shape drift/, () => {
    validateAuxiliaryTailObject(unknownAllocatedTail, auxiliary, expectedTailBytes);
  }));
  const auxiliaryTailByteDrift = Buffer.from(auxiliaryTailObjectBytes);
  auxiliaryTailByteDrift[auxiliaryTailSection.offset] ^= 0x01;
  mutations.push(expectRejection('preserved tail byte', /object bytes drift/, () => {
    validateAuxiliaryTailObject(parseElf32BigEndian(auxiliaryTailByteDrift), auxiliary, expectedTailBytes);
  }));
  const acceptedTailMap = verifyAuxiliaryMapOwner(
    auxiliaryCanary,
    auxiliary,
    auxiliaryTail,
    mapText,
    auxiliaryPrefix,
  );
  const tailAddress = auxiliary.ownerTailVramStartNumber.toString(16);
  const driftedTailContribution = acceptedTailMap.tailContribution.replace(
    new RegExp(tailAddress, 'i'),
    (auxiliary.ownerTailVramStartNumber + 4).toString(16),
  );
  mutations.push(expectRejection('preserved tail placement', /tail placement drift/, () => {
    verifyAuxiliaryMapOwner(
      auxiliaryCanary,
      auxiliary,
      auxiliaryTail,
      mapText.replace(acceptedTailMap.tailContribution, driftedTailContribution),
      auxiliaryPrefix,
    );
  }));
  mutations.push(expectRejection('preserved tail data map contribution', /tail placement drift|forbidden conventional data section/, () => {
    verifyAuxiliaryMapOwner(
      auxiliaryCanary,
      auxiliary,
      auxiliaryTail,
      mapText.replace(
        acceptedTailMap.tailContribution,
        acceptedTailMap.tailContribution.replace(auxiliaryTail.inputSection, '.data'),
      ),
      auxiliaryPrefix,
    );
  }));
  mutations.push(expectRejection('preserved tail owner collision', /preserved-tail ownership collision/, () => {
    verifyAuxiliaryMapOwner(
      auxiliaryCanary,
      auxiliary,
      auxiliaryTail,
      mapText.replace(
        acceptedTailMap.tailContribution,
        `${acceptedTailMap.tailContribution}\n    ${acceptedTailMap.tailContribution.replace(auxiliaryTail.objectRelative, wrongOwner)}`,
      ),
      auxiliaryPrefix,
    );
  }));
  mutations.push(expectRejection('auxiliary map owner', /accepted matching C object|ownership collision/, () => {
    verifyAuxiliaryMapOwner(
      auxiliaryCanary,
      auxiliary,
      auxiliaryTail,
      mapText.split(auxiliaryReplacement.cObject).join(wrongOwner),
      auxiliaryPrefix,
    );
  }));
  const auxiliarySourceObjectFile = path.join(output, ...auxiliaryReplacement.sourceObject.split('/'));
  const auxiliarySourceObjectBytes = Buffer.from(fs.readFileSync(auxiliarySourceObjectFile));
  const auxiliarySourceObject = parseElf32BigEndian(auxiliarySourceObjectBytes);
  const auxiliaryObjectSection = auxiliarySourceObject.sections.find((section) => section.name === auxiliary.outputSection);
  auxiliarySourceObjectBytes.writeUInt32BE(0x00000100, auxiliaryObjectSection.offset);
  mutations.push(expectRejection('auxiliary relocation addend', /relocations differ/, () => {
    const records = auxiliaryRelocationRecords(parseElf32BigEndian(auxiliarySourceObjectBytes), auxiliaryCanary, auxiliary);
    if (JSON.stringify(records) !== JSON.stringify(auxiliary.expectedRelocations)) {
      throw new Error('auxiliary relocations differ after addend drift');
    }
  }));
  const auxiliaryRelocationTypeBytes = Buffer.from(fs.readFileSync(auxiliarySourceObjectFile));
  const auxiliaryRelocationElf = parseElf32BigEndian(auxiliaryRelocationTypeBytes);
  const auxiliaryRelocationSection = auxiliaryRelocationElf.sections.find((section) => section.name === '.rel' + auxiliary.outputSection);
  const relocationInfo = auxiliaryRelocationTypeBytes.readUInt32BE(auxiliaryRelocationSection.offset + 4);
  auxiliaryRelocationTypeBytes.writeUInt32BE((relocationInfo & 0xFFFFFF00) | 4, auxiliaryRelocationSection.offset + 4);
  mutations.push(expectRejection('auxiliary relocation type', /local-label relocation drift/, () => {
    auxiliaryRelocationRecords(parseElf32BigEndian(auxiliaryRelocationTypeBytes), auxiliaryCanary, auxiliary);
  }));
  const selectedProofFile = path.join(output, ...auxiliaryReplacement.sourceObjectProof.path.split('/'));
  const selectedProof = readJson(selectedProofFile);
  const selectedProofAuxiliary = selectedProof.finalObject.auxiliarySections.find((record) => (
    record.outputSection === auxiliary.outputSection
  ));
  if (!selectedProofAuxiliary
      || Object.prototype.hasOwnProperty.call(selectedProof.assemblyContract, 'sourceObjectPrefixSelections')) {
    fail('source-object prefix proof schema canary drift');
  }
  const proofTrailingSha256 = sha256Buffer(Buffer.alloc(4));
  selectedProofAuxiliary.sourceObjectPrefix = {
    sectionType: selectedProofAuxiliary.sectionType,
    sectionFlags: selectedProofAuxiliary.sectionFlags,
    alignment: selectedProofAuxiliary.alignment,
    bytes: selectedProofAuxiliary.objectBytes + 4,
    sha256: 'A'.repeat(64),
    acceptedSha256: 'A'.repeat(64),
    prefixOffset: '0x00000000',
    prefixBytes: selectedProofAuxiliary.objectBytes,
    prefixSha256: selectedProofAuxiliary.objectSha256,
    acceptedPrefixSha256: selectedProofAuxiliary.acceptedObjectSha256,
    trailingPaddingOffset: `0x${selectedProofAuxiliary.objectBytes.toString(16).toUpperCase().padStart(8, '0')}`,
    trailingPaddingBytes: 4,
    trailingPaddingSha256: proofTrailingSha256,
    acceptedTrailingPaddingSha256: proofTrailingSha256,
    relocationSection: '.rel' + auxiliary.outputSection,
    relocationCount: selectedProofAuxiliary.loadRelevantRelocationsNormalized.length,
    relocationsWithinPrefix: true,
  };
  selectedProofAuxiliary.linkedObjectSection = {
    sectionType: selectedProofAuxiliary.sectionType,
    sectionFlags: selectedProofAuxiliary.sectionFlags,
    alignment: selectedProofAuxiliary.alignment,
    bytes: selectedProofAuxiliary.objectBytes,
    sha256: selectedProofAuxiliary.objectSha256,
    loadRelevantRelocationsNormalized: selectedProofAuxiliary.loadRelevantRelocationsNormalized,
  };
  selectedProof.assemblyContract.sourceObjectPrefixSelections = 1;
  selectedProof.assemblyContract.permittedAdjustment += '; select the authenticated zero-offset prefix for linkage';
  const selectedProofBytes = Buffer.from(`${JSON.stringify(selectedProof, null, 2)}\n`);
  validateSourceObjectProofBytes(selectedProofBytes, selectedProofBytes);
  const missingSelectionCountProof = JSON.parse(selectedProofBytes.toString('utf8'));
  delete missingSelectionCountProof.assemblyContract.sourceObjectPrefixSelections;
  mutations.push(expectRejection('missing source-object prefix proof count', /prefix-selection schema drift/, () => {
    const bytes = Buffer.from(`${JSON.stringify(missingSelectionCountProof, null, 2)}\n`);
    validateSourceObjectProofBytes(bytes, bytes);
  }));
  const wrongLinkedPrefixProof = JSON.parse(selectedProofBytes.toString('utf8'));
  wrongLinkedPrefixProof.finalObject.auxiliarySections.find((record) => (
    record.outputSection === auxiliary.outputSection
  )).linkedObjectSection.bytes += 4;
  mutations.push(expectRejection('source-object prefix proof linked extent', /prefix-selection schema drift/, () => {
    const bytes = Buffer.from(`${JSON.stringify(wrongLinkedPrefixProof, null, 2)}\n`);
    validateSourceObjectProofBytes(bytes, bytes);
  }));
  const syntheticSourceObjectPrefixProof = {
    sourceBytes: selectedProofAuxiliary.sourceObjectPrefix.bytes,
    prefixBytes: selectedProofAuxiliary.sourceObjectPrefix.prefixBytes,
    trailingPaddingBytes: selectedProofAuxiliary.sourceObjectPrefix.trailingPaddingBytes,
    relocationCount: selectedProofAuxiliary.sourceObjectPrefix.relocationCount,
  };
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
    recordedCompilerOccurrenceEquality,
    syntheticPrefixExtraction,
    syntheticSourceObjectPrefixProof,
    targetProofs,
    mutations,
  }, null, 2));
}

main();
