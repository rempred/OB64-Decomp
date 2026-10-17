#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const textContract = require('../tools/lib/text_contract');
const compilationGroups = require('../tools/lib/compilation_groups');
const atomic = require('../tools/lib/atomic_owner_union');
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
  phase8VerificationModel,
  renderPhase8LinkerScript,
  sameCompilerOccurrenceEvidence,
  targetTextOwners,
  validateAuxiliaryPrefixObject,
  validateAuxiliaryTailObject,
  validateRecordedPhase8Build,
  validateSourceObjectProofBytes,
  verifyCompilerTextFunctions,
  physicalInterface,
  verifyPhysicalInterface,
  verifySourceObjectProofs,
  verifyAuxiliaryLinkedObjectSection,
  verifyAuxiliaryMapOwner,
  verifyAuxiliarySourceObjectSection,
  verifyObjectManifest,
  verifyPhase8Layout,
  verifySharedAuxiliaryScript,
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
    // Shared auxiliaries use explicit, ordered C object selectors.
    const logicalSelectors = syntheticPhase8.targets.map((target) => (
      `    ${compilationGroups.objectPath(target)}(${auxiliary.outputSection})`
    ));
    const selectors = [prefixSelector, ...logicalSelectors];
    const selectorLines = linkerText.replace(/\r\n/g, '\n').split('\n');
    let previousSelectorIndex = -1;
    for (const selector of selectors) {
      const index = selectorLines.indexOf(selector);
      if (index <= previousSelectorIndex
          || selectorLines.indexOf(selector, index + 1) >= 0) {
        fail('synthetic retained-prefix linker ordering drift');
      }
      previousSelectorIndex = index;
    }
    const wildcardSelector = `    *(${auxiliary.outputSection})`;
    if (selectorLines.includes(wildcardSelector)) {
      fail('synthetic retained-prefix wildcard linker selector drift');
    }
    const linkerMutations = selectors.flatMap((selector, index) => [
      expectRejection(`retained prefix contributor ${index} missing`,
        /shared auxiliary/, () => verifySharedAuxiliaryScript(
          syntheticPhase8, linkerText.replace(selector, ''))),
      expectRejection(`retained prefix contributor ${index} duplicated`,
        /shared auxiliary/, () => verifySharedAuxiliaryScript(
          syntheticPhase8, linkerText.replace(selector, selector + '\n' + selector))),
    ]);
    linkerMutations.push(
      expectRejection('retained prefix after first C contributor', /shared auxiliary/,
        () => verifySharedAuxiliaryScript(syntheticPhase8,
          linkerText.replace(prefixSelector, '').replace(
            logicalSelectors[0], logicalSelectors[0] + '\n' + prefixSelector))),
      expectRejection('retained prefix C contributors reversed', /shared auxiliary/,
        () => verifySharedAuxiliaryScript(syntheticPhase8,
          selectorLines.map((line) => (
            line === logicalSelectors[0] ? logicalSelectors[1]
              : line === logicalSelectors[1] ? logicalSelectors[0] : line
          )).join('\n'))),
      expectRejection('retained prefix wildcard C contributor', /shared auxiliary/,
        () => verifySharedAuxiliaryScript(syntheticPhase8,
          linkerText.replace(logicalSelectors[0], wildcardSelector))),
    );
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
      mutations: [manifestMutation, layoutMutation, invalidPrefixGrammar, ...linkerMutations],
    };
  } finally {
    if (path.dirname(path.resolve(scratch)) !== path.resolve(scratchRoot)) {
      fail('synthetic retained-prefix scratch escaped its test root');
    }
    fs.rmSync(scratch, { recursive: true, force: true });
  }
}

// A surviving physical label is not a surviving C body. Bind the exception to
// the loaded registry and actual original/pruned/linked retained interval.
function verifyFallbackExclusion(context) {
  const { phase8, registry, baserom, target, record, cObject, linkedElf } = context;
  const { textOwner: owner, replacementOwner, fallback, pruned } = record;
  const reject = reason => fail(`fallback exclusion ${reason}: ${target.symbol}`);
  const chunk = String(owner.chunkIndex).padStart(3, '0');
  if (replacementOwner.fallbackObject !== `comparison/original/chunk_${chunk}.o`
      || replacementOwner.prunedAssemblyObject !== `objects/assembly/chunk_${chunk}.o`) reject('owner paths');
  if (pruned.sections.some(section => section.name === owner.sectionName)) reject('body section survived');
  const names = pruned.symbols.filter(symbol => symbol.name === owner.symbol);
  const registeredEdge = phase8.model.config.retainedPaddingCuts.some(cut => cut.rowIndex === owner.rowIndex);
  if (registeredEdge !== Boolean(target.row.retainedPadding)
      || registeredEdge !== target.row.slices.some(slice => Boolean(slice.retainedPaddingId))) reject('edge registry binding');
  if (!registeredEdge) {
    if (names.length) reject('body symbol survived');
    return 'ordinary';
  }
  const owners = targetTextOwners(target), rows = phase8.model.rows.filter(row => row.index === target.row.index);
  if (owners.length !== 1 || owners[0] !== owner || owner.row !== target.row
      || rows.length !== 1 || rows[0] !== target.row) reject('row identity');
  const edge = require('../tools/lib/logical_functions').assertRetainedPaddingProducer(
    registry, target.row, target.symbol, target.compilerTextFunctions,
  );
  if (owner.rowIndex !== target.row.index || owner.sectionName !== edge.body.sectionName
      || owner.symbol !== target.row.part.name || owner.chunkIndex !== target.row.part.chunkIndex) reject('body binding');
  const physical = physicalInterface(target); // Lookup/authority errors must reject.
  if (physical) {
    if (names.length) reject('interface symbol survived');
    verifyPhysicalInterface(cObject, target);
    verifyPhysicalInterface(linkedElf, target, true);
    return 'interface';
  }
  const address = target.row.romStart + target.row.part.symbolByteOffset;
  const kept = edge.retained, offset = address - kept.romStart;
  if (target.symbol === owner.symbol || address < kept.romStart || address >= kept.romEndExclusive
      || address >= edge.body.romStart && address < edge.body.romEndExclusive) {
    if (names.length) reject('body symbol survived');
    return 'stripped';
  }
  const section = (elf, linked = false) => {
    const found = elf.sections.filter(value => value.name === kept.sectionName);
    if (found.length !== 1 || found[0].type !== 1 || found[0].flags !== 6
        || found[0].size !== kept.bytes || linked && found[0].address !== kept.vramStart) reject('retained section');
    return found[0];
  };
  const originalSection = section(fallback), retainedSection = section(pruned), linkedSection = section(linkedElf, true);
  if (retainedSection.alignment !== originalSection.alignment) reject('retained alignment');
  const originalBytes = Buffer.from(elfSectionBytes(fallback, originalSection));
  const prunedBytes = Buffer.from(elfSectionBytes(pruned, retainedSection));
  const expectedBytes = baserom.subarray(kept.romStart, kept.romEndExclusive);
  if (!originalBytes.equals(expectedBytes) || !prunedBytes.equals(expectedBytes)
      || sha256Buffer(originalBytes) !== edge.record.expectedSha256
      || sha256Buffer(prunedBytes) !== edge.record.expectedSha256) reject('retained bytes');
  const label = (elf, keptSection, value) => {
    const matches = elf.symbols.filter(symbol => symbol.name === owner.symbol);
    if (matches.length !== 1 || matches[0].sectionIndex !== keptSection.index
        || matches[0].value !== value || matches[0].size !== 0 || matches[0].binding !== 1
        || matches[0].symbolType !== 2 || matches[0].visibility !== 0) reject('physical label');
  };
  if (!Number.isInteger(offset) || offset < 0 || offset >= kept.bytes) reject('physical offset');
  label(fallback, originalSection, offset);
  label(pruned, retainedSection, offset);
  label(linkedElf, linkedSection, kept.vramStart + offset);
  const census = (elf, keptSection) => elf.symbols.filter(symbol => symbol.sectionIndex === keptSection.index).map(symbol => ({
    name: symbol.name, value: symbol.value, size: symbol.size, binding: symbol.binding,
    symbolType: symbol.symbolType, visibility: symbol.visibility, section: keptSection.name,
  })).sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
  const originalCensus = census(fallback, originalSection), retainedCensus = census(pruned, retainedSection);
  if (JSON.stringify(originalCensus) !== JSON.stringify(retainedCensus)
      || retainedCensus.some(symbol => target.compilerTextFunctions.some(fn => fn.symbol === symbol.name))) reject('retained symbol census');
  return 'retained-label';
}

function verifyFallbackControls(contexts) {
  const results = [], retained = contexts.find(c => c.branch === 'retained-label');
  const ordinary = contexts.find(c => c.branch === 'ordinary');
  if (!retained || !ordinary) fail('fallback exclusion control branches missing');
  const check = context => verifyFallbackExclusion(context);
  const reject = (name, context, pattern, change, changed) => {
    const altered = change(context);
    if (!changed(context, altered)) fail(`fallback exclusion mutation was a no-op: ${name}`);
    results.push(expectRejection(name, pattern, () => check(altered)));
    if (check(context) !== context.branch) fail('fallback exclusion restored branch drift');
  };
  const mutate = (context, role, change) => {
    const original = role === 'linkedElf' || role === 'cObject' ? context[role] : context.record[role];
    const bytes = Buffer.from(original.buffer);
    change(bytes, original);
    const elf = parseElf32BigEndian(bytes);
    return role === 'linkedElf' || role === 'cObject' ? { ...context, [role]: elf }
      : { ...context, record: { ...context.record, [role]: elf } };
  };
  const label = (elf, context) => elf.symbols.find(symbol => symbol.name === context.record.textOwner.symbol);
  const symbolOffset = (elf, symbol) => elf.sections[symbol.symbolTableIndex].offset + symbol.symbolIndex * 16;
  for (const role of ['fallback', 'pruned', 'linkedElf']) {
    for (const [field, relative, width, value] of [
      ['size', 8, 4, 4], ['value', 4, 4, role === 'linkedElf' ? retained.target.row.slices[0].vramEndExclusive : 4],
      ['binding', 12, 1, 2], ['symbolType', 12, 1, 0x11], ['visibility', 13, 1, 2],
      ['undefined', 14, 2, 0], ['absolute', 14, 2, 0xFFF1],
    ]) {
      const get = c => role === 'linkedElf' ? c.linkedElf : c.record[role];
      reject(`${role} retained label ${field}`, retained, /fallback exclusion physical label/, c => mutate(c, role, (bytes, elf) => {
        const at = symbolOffset(elf, label(elf, c)) + relative;
        if (width === 4) bytes.writeUInt32BE(value, at);
        else if (width === 2) bytes.writeUInt16BE(value, at);
        else bytes.writeUInt8(value, at);
      }), (before, after) => JSON.stringify(label(get(before), before)) !== JSON.stringify(label(get(after), after)));
    }
  }
  for (const role of ['fallback', 'pruned', 'linkedElf']) {
    const get=c=>role==='linkedElf'?c.linkedElf:c.record[role];
    for(const kind of ['missing','duplicate','wrong section']) {
      reject(`${role} retained label ${kind}`,retained,/fallback exclusion physical label/,c=>mutate(c,role,(bytes,elf)=>{
        const sym=label(elf,c),at=symbolOffset(elf,sym);
        if(kind==='missing')bytes.writeUInt32BE(0,at);
        else if(kind==='wrong section')bytes.writeUInt16BE(elf.sections.find(s=>s.index>0&&s.index!==sym.sectionIndex&&s.type===1).index,at+14);
        else {const other=elf.symbols.find(s=>s.symbolTableIndex===sym.symbolTableIndex&&s.symbolIndex!==sym.symbolIndex&&s.symbolIndex!==0);bytes.copy(bytes,symbolOffset(elf,other),at,at+16);}
      }),(a,b)=>JSON.stringify(get(a).symbols)!==JSON.stringify(get(b).symbols));
    }
  }
  reject('extra retained symbol',retained,/fallback exclusion retained symbol census/,c=>mutate(c,'pruned',(bytes,elf)=>{
    const sym=label(elf,c),other=elf.symbols.find(s=>s.name&&s.name!==sym.name&&s.sectionIndex!==sym.sectionIndex&&s.symbolIndex>0);
    const at=symbolOffset(elf,other);bytes.writeUInt32BE(0,at+4);bytes.writeUInt16BE(sym.sectionIndex,at+14);
  }),(a,b)=>JSON.stringify(a.record.pruned.symbols)!==JSON.stringify(b.record.pruned.symbols));
  for(const kind of ['missing','duplicate'])reject(`retained section ${kind}`,retained,/fallback exclusion retained section/,c=>mutate(c,'pruned',(bytes,elf)=>{
    const sh=elf.sections.find(s=>s.name===c.target.row.slices[0].sectionName);
    if(kind==='missing')bytes.writeUInt32BE(0,sh.headerOffset);
    else {const other=elf.sections.find(s=>s.index>0&&s.index!==sh.index&&s.type===1);bytes.writeUInt32BE(sh.nameOffset,other.headerOffset);}
  }),(a,b)=>JSON.stringify(a.record.pruned.sections)!==JSON.stringify(b.record.pruned.sections));

  reject('extra C-entry label in retained section',retained,/fallback exclusion retained symbol census/,c=>mutate(c,'pruned',(bytes,elf)=>{
    const sym=label(elf,c),other=elf.symbols.find(s=>/^func_[0-9a-fA-F]{8}$/.test(s.name)&&s.name!==sym.name&&s.sectionIndex!==sym.sectionIndex);
    const at=symbolOffset(elf,other),strings=elf.sections[elf.sections[other.symbolTableIndex].link];
    if(other.name.length!==c.target.symbol.length)fail('extra C label fixture extent');
    bytes.write(c.target.symbol,strings.offset+bytes.readUInt32BE(at),'ascii');
    bytes.writeUInt32BE(0,at+4);bytes.writeUInt32BE(0,at+8);bytes.writeUInt16BE(sym.sectionIndex,at+14);
  }),(a,b)=>!a.record.pruned.symbols.some(s=>s.name===a.target.symbol)&&b.record.pruned.symbols.some(s=>s.name===b.target.symbol));
  reject('extra original body label in retained section',retained,/fallback exclusion retained symbol census/,c=>mutate(c,'fallback',(bytes,elf)=>{
    const sym=label(elf,c),body=elf.sections.find(s=>s.name===c.record.textOwner.sectionName),other=elf.symbols.find(s=>s.name&&s.sectionIndex===body.index);
    const at=symbolOffset(elf,other);bytes.writeUInt32BE(0,at+4);bytes.writeUInt16BE(sym.sectionIndex,at+14);
  }),(a,b)=>JSON.stringify(a.record.fallback.symbols)!==JSON.stringify(b.record.fallback.symbols));

  for (const [field, relative, value] of [['size',20,8],['flags',8,2],['alignment',32,8]]) {
    reject(`retained section ${field}`, retained, /fallback exclusion retained (section|alignment)/,
      c => mutate(c,'pruned',(bytes,elf)=>{const sh=elf.sections.find(s=>s.name===c.target.row.slices[0].sectionName);bytes.writeUInt32BE(value,sh.headerOffset+relative);}),
      (a,b)=>JSON.stringify(a.record.pruned.sections)!==JSON.stringify(b.record.pruned.sections));
  }
  for (const role of ['fallback','pruned']) {
    reject(`${role} retained byte`,retained,/fallback exclusion retained bytes/,
      c=>mutate(c,role,(bytes,elf)=>{const sh=elf.sections.find(s=>s.name===c.target.row.slices[0].sectionName);bytes[sh.offset]^=1;}),
      (a,b)=>!a.record[role].buffer.equals(b.record[role].buffer));
  }
  for (const [name, transform, pattern] of [
    ['real original body', c=>({...c,record:{...c.record,pruned:parseElf32BigEndian(Buffer.from(c.record.fallback.buffer))}}), /fallback exclusion body section survived/],
    ['real original symbol without body section name', c=>{const elf=c.record.fallback;const sh=elf.sections.find(s=>s.name===c.record.textOwner.sectionName);const bytes=Buffer.from(elf.buffer);bytes.writeUInt32BE(0,sh.headerOffset);return {...c,record:{...c.record,pruned:parseElf32BigEndian(bytes)}};}, /fallback exclusion body symbol survived/],
  ]) reject(name,ordinary,pattern,transform,(a,b)=>!a.record.pruned.buffer.equals(b.record.pruned.buffer));
  reject('crossed owner path',retained,/fallback exclusion owner paths/,c=>({...c,record:{...c.record,replacementOwner:{...c.record.replacementOwner,fallbackObject:'comparison/original/chunk_000.o'}}}),(a,b)=>a.record.replacementOwner.fallbackObject!==b.record.replacementOwner.fallbackObject);
  reject('cloned row',retained,/fallback exclusion row identity/,c=>({...c,target:{...c.target,row:JSON.parse(JSON.stringify(c.target.row))}}),(a,b)=>a.target.row!==b.target.row);
  reject('crossed owner row',retained,/fallback exclusion row identity/,c=>({...c,record:{...c.record,textOwner:{...c.record.textOwner,row:ordinary.target.row}}}),(a,b)=>a.record.textOwner.row!==b.record.textOwner.row);
  reject('owner count',retained,/fallback exclusion row identity/,c=>({...c,target:{...c.target,textOwners:[...c.target.textOwners,...c.target.textOwners]}}),(a,b)=>a.target.textOwners.length!==b.target.textOwners.length);
  reject('coherent cloned row and owner',retained,/fallback exclusion row identity/,c=>{const row=JSON.parse(JSON.stringify(c.target.row)),owner={...c.record.textOwner,row};return {...c,target:{...c.target,row,textOwners:[owner]},record:{...c.record,textOwner:owner}};},(a,b)=>a.target.row!==b.target.row);
  reject('wrong pruned path',retained,/fallback exclusion owner paths/,c=>({...c,record:{...c.record,replacementOwner:{...c.record.replacementOwner,prunedAssemblyObject:'objects/assembly/chunk_000.o'}}}),(a,b)=>a.record.replacementOwner.prunedAssemblyObject!==b.record.replacementOwner.prunedAssemblyObject);
  for(const c of contexts.filter(c=>c.branch==='interface')) {
    for(const role of ['cObject','linkedElf'])reject(role+' interface size '+c.target.symbol,c,/derived physical interface metadata/,value=>mutate(value,role,(bytes,elf)=>{
      bytes.writeUInt32BE(4,symbolOffset(elf,label(elf,value))+8);
    }),(a,b)=>label(a[role],a).size!==label(b[role],b).size);
    reject('missing interface descriptor '+c.target.symbol,c,/physical interface descriptor missing/,value=>({...value,target:{...value.target,physicalInterface:undefined}}),(a,b)=>a.target.physicalInterface!==b.target.physicalInterface);
  }
  for(const kind of ['missing','duplicate'])reject(kind+' model row',retained,/fallback exclusion row identity/,c=>({...c,phase8:{...c.phase8,model:{...c.phase8.model,rows:kind==='missing'?c.phase8.model.rows.filter(row=>row!==c.target.row):[...c.phase8.model.rows,c.target.row]}}}),(a,b)=>a.phase8.model.rows.length!==b.phase8.model.rows.length);
  const row=retained.target.row, original=row.retainedPadding.expectedSha256;
  try { row.retainedPadding.expectedSha256='0'.repeat(64);
    if(row.retainedPadding.expectedSha256===original)fail('fallback registry mutation no-op');
    results.push(expectRejection('in-place registry drift',/unchanged ROM-authenticated registry/,()=>check(retained)));
  } finally { row.retainedPadding.expectedSha256=original; }
  check(retained);
  const savedPadding=row.retainedPadding;
  try { delete row.retainedPadding;
    if(Object.hasOwn(row,'retainedPadding'))fail('fallback registry deletion no-op');
    results.push(expectRejection('missing in-place retained authority',/fallback exclusion edge registry binding/,()=>check(retained)));
  } finally { row.retainedPadding=savedPadding; }
  check(retained);
  return results;
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
  if (buildReport.schemaVersion !== 7 || buildReport.status !== 'pass'
      || buildReport.verification.schemaVersion !== 6 || buildReport.verification.status !== 'pass') {
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

  // Restore the complete target census on shared phase8.model after the synthetic renderer; text_contract reads that census implicitly.
  const verificationModel = phase8VerificationModel({
    ...phase8,
    model: atomic.outputModel(phase8.model, phase8.targets),
  });
  verifyElfAgainstModel(verificationModel, linkedElf);
  verifyRom(phase8.model, romBytes);
  verifyMap(verificationModel, mapText);
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

  // Retain all historical GNU 2.6 cases under their current mechanical classes.
  const gnu26RegressionClasses = new Map([
    ['func_0002CD70', SOURCE_CLASSES.HYBRID_C],
    ['func_0000BC8C', SOURCE_CLASSES.PURE_C],
    ['func_0015DF10', SOURCE_CLASSES.HYBRID_C],
    ['func_0002DE10', SOURCE_CLASSES.HYBRID_C],
    ['func_00269798', SOURCE_CLASSES.HYBRID_C],
    ['func_0000B29C', SOURCE_CLASSES.PURE_C],
  ]);
  const targetProofs = [];
  const fallbackRegistry = require('../tools/lib/logical_functions').loadRegistry(phase8.model, canonicalBaserom);
  const fallbackBranches = {}, fallbackControlContexts = [];
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
    const objectText = (elf) => Buffer.concat(textOwners.map((textOwner) => (
      target.atomicText
        ? atomic.ownerBytes(elf, target, textOwner)
        : sectionBytes(elf, textContract.inputSection(target, textOwner.sectionName))
    )));
    const sourceText = objectText(sourceObject);
    const linkedObjectText = objectText(linkedObject);
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
        replacementOwner,
        fallback,
        pruned,
        fallbackText: sectionBytes(fallback, textOwner.sectionName),
      };
    });
    const fallbackText = Buffer.concat(ownerArtifacts.map((record) => record.fallbackText));
    for (const record of ownerArtifacts) {
      const context = { phase8, registry: fallbackRegistry, baserom: canonicalBaserom, target, record, cObject: linkedObject, linkedElf };
      const branch = verifyFallbackExclusion(context);
      fallbackBranches[branch] = (fallbackBranches[branch] || 0) + 1;
      if (target.row.retainedPadding || !fallbackControlContexts.some(value => value.branch === 'ordinary')) {
        fallbackControlContexts.push({ ...context, branch });
      }
    }
    if (!rawComparison.rawBytesExact || !rawComparison.linkedBytes.equals(fallbackText)
        || !sourceText.equals(linkedObjectText) || sourceText.length !== target.bytes
        || JSON.stringify(replacement.compilerTextFunctions) !== JSON.stringify(compilerTextFunctions)
        || JSON.stringify(verifiedTarget.compilerTextFunctions) !== JSON.stringify(linkedCompilerTextFunctions)
        || owner.owners.length !== textOwners.length
        || owner.owners.some((record) => record.linkedOwner !== replacement.cObject)) {
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
    if (gnu26RegressionClasses.has(target.symbol)
        && classification.class !== gnu26RegressionClasses.get(target.symbol)) {
      fail(`GNU 2.6 regression source class drift: ${target.symbol}`);
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
  if (![...gnu26RegressionClasses.keys()].every((symbol) => targetProofs.some((record) => record.symbol === symbol))) {
    fail('GNU 2.6 regression target census was not exercised');
  }
  if (!buildReport.verification.asmDiffer.every((record) => record.exact && record.rawBytesExact && record.asmDifferPairwiseExact)) {
    fail('asm-differ/raw target comparison drift');
  }

  const fallbackMutations = verifyFallbackControls(fallbackControlContexts);
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
    gnu26RegressionTargets: [...gnu26RegressionClasses].map(([symbol, sourceClass]) => ({ symbol, sourceClass })),
    sourceObjectEvidence: independentEvidence.counts,
    recordedCompilerOccurrenceEquality,
    syntheticPrefixExtraction,
    syntheticSourceObjectPrefixProof,
    targetProofs,
    fallbackBranches,
    fallbackMutations,
    mutations,
  }, null, 2));
}

main();
