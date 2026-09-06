#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const tc = require('../tools/lib/text_contract');
const p8 = require('../tools/lib/phase8_matching_c');
const { ROOT, sha256File, sha256Buffer, parseElfFile, run } = require('../tools/lib/phase7_conventional');
const { prepareContext, ensureBaseline } = require('../tools/lib/current_workflow');
const { validateLinkageConfig, resolveAcceptedRow, resolveCompilerTextFunctions } = require('../tools/lib/active_targets');
const { classifyTargetSources } = require('../tools/lib/source_policy');
const { prepareCompilerSession, compileScratchCandidate, verifyNativeScratchProvenance } = require('../tools/lib/matching/compiler');
const diagnostic = require('../tools/lib/matching/diagnostic_link');
const diffCache = require('../tools/lib/diff_object_cache');

function main() {
  const context = prepareContext();
  // This fixture replaces the native entry only in its isolated model.
  // Accepted production source and linkage remain untouched.
  const baseline = ensureBaseline(context);
  const rom = fs.readFileSync(context.baserom.path);
  const row = resolveAcceptedRow(context.phase8.model, tc.NATIVE_SYMBOL);
  const slice = row.slices[0];
  const sourceRoot = fs.mkdtempSync(path.join(ROOT, 'build', 'tests', 'native-text-'));
  const output = fs.mkdtempSync(path.join(context.localTools.workRoot, 'nt-'));
  const sourceFile = path.join(sourceRoot, 'exact.c');
  const assembly = ['.text', '.set noreorder', '.align 4', `.globl ${tc.NATIVE_SYMBOL}`,
    `.ent ${tc.NATIVE_SYMBOL}`, `.type ${tc.NATIVE_SYMBOL},@function`, `${tc.NATIVE_SYMBOL}:`];
  for (let offset = 0; offset < 1132; offset += 4) assembly.push(`.word 0x${rom.readUInt32BE(row.romStart + offset).toString(16)}`);
  assembly.push(`.size ${tc.NATIVE_SYMBOL},.-${tc.NATIVE_SYMBOL}`, `.end ${tc.NATIVE_SYMBOL}`);
  fs.writeFileSync(sourceFile, `asm(${JSON.stringify(assembly.join('\n') + '\n')});\n`);
  const descriptor = tc.nativeDescriptor();
  validateLinkageConfig({ ...context.phase8.linkageConfig, targets: [...context.phase8.linkageConfig.targets.filter(value => value.symbol !== tc.NATIVE_SYMBOL),
    { symbol: tc.NATIVE_SYMBOL, expectedRelocations: [], nativeTextTail: descriptor }] }, context.phase8.linkageConfig.profile);
  const target = {
    symbol: tc.NATIVE_SYMBOL, source: path.relative(ROOT, sourceFile).replace(/\\/g, '/'), sourceSha256: sha256File(sourceFile),
    targetIndex: 0, primaryId: row.primaryId, rowIndex: row.index, chunkIndex: row.part.chunkIndex,
    originalAssembly: row.part.file, originalAssemblySha256: row.part.sha256,
    romStartNumber: row.romStart, romEndNumber: row.romEndExclusive, vramStartNumber: slice.vramStart,
    vramEndNumber: slice.vramEndExclusive, bytes: 1136, sectionName: slice.sectionName,
    overlayDescriptorId: slice.overlayDescriptorId, descriptorRawSha256: null,
    expectedTextSha256: sha256Buffer(rom.subarray(row.romStart, row.romEndExclusive)), expectedRelocations: [],
    nativeTextTail: descriptor, compilerTextFunctionsExplicit: true, compilerTextFunctions: [], auxiliarySections: [],
    legacyAncillaryRelocations: [], relocationContractSource: 'isolated-authenticated-test-fixture', row, rows: [row], model: context.phase8.model,
  };
  target.textOwners = p8.targetTextOwners(target);
  target.compilerTextFunctions = resolveCompilerTextFunctions(target, []);
  const ordinary = context.phase8.targets.find(value => value.symbol === 'func_00203664');
  assert(ordinary);
  const phase8 = { ...context.phase8, targets: [ordinary, target], target, compatibility: [] };
  const session = prepareCompilerSession({ context: { ...context, phase8 } });
  const runtime = session.runtime;
  const policy = classifyTargetSources(phase8.targets);
  assert.equal(policy.targets[1].class, 'HYBRID_C');
  const phase7 = p8.verifyPhase7Input(phase8, baseline.phase7Output);
  const replacement = p8.copyPhase7Objects(phase8, phase7, output, runtime.tools['mips-kmc-elf-objcopy.exe'].path);
  const compile = (current, out, classification, enforceAcceptedContract = true) => p8.compileTarget(
    phase8, current, out, context.localTools.compiler, runtime.tools['mips-kmc-elf-as.exe'].path,
    runtime.tools['mips-kmc-elf-objcopy.exe'].path, { classification, enforceAcceptedContract });
  const compiled = new Map(phase8.targets.map((value, index) => [value.symbol, compile(value, output, policy.targets[index])]));
  const commonRejections = [];
  function rejectCommon(source, label) {
    const commonSource = path.join(sourceRoot, label + '.c');
    fs.writeFileSync(commonSource, 'int reviewer_native_common;\n' + fs.readFileSync(source, 'utf8'));
    const common = { ...target, source: path.relative(ROOT, commonSource).replace(/\\/g, '/'), sourceSha256: sha256File(commonSource) };
    const classification = classifyTargetSources([common]).targets[0];
    const commonOutput = fs.mkdtempSync(path.join(context.localTools.workRoot, 'nt-com-'));
    assert.throws(() => compile(common, commonOutput, classification, label === 'common'), /native nonzero COMMON storage/);
    const commonRaw = path.join(commonOutput, 'objects/c', target.symbol + '.source-object.o');
    const commonObject = path.join(commonOutput, 'objects/c', target.symbol + '.o');
    const commonElf = parseElfFile(commonRaw);
    const global = commonElf.symbols.find(symbol => symbol.name === 'reviewer_native_common');
    assert.equal(global.sectionIndex, 0xFFF2); assert.equal(global.size, 4);
    assert(!fs.existsSync(commonObject), 'compile must reject before producing a link object');
    // Replay the review's previously admitted object at downstream artifact boundaries.
    run(runtime.tools['mips-kmc-elf-objcopy.exe'].path, ['--remove-section=.reginfo', '--remove-section=.pdr',
      '--remove-section=.comment', '--remove-section=.note', commonRaw, commonObject], { cwd: ROOT });
    assert.throws(() => tc.deriveObjectEvidence(common, commonOutput), /native nonzero COMMON storage/);
    assert.throws(() => diffCache.inspectCompiledTargetArtifacts({ phase8, target: common, classification,
      files: diffCache.outputArtifactFiles(commonOutput, common) }), /COMMON/);
    const rawBytes = fs.readFileSync(commonRaw);
    try {
      fs.copyFileSync(path.join(output, 'objects/c', target.symbol + '.source-object.o'), commonRaw);
      assert.throws(() => tc.deriveObjectEvidence(common, commonOutput), /native nonzero COMMON storage/);
      assert.throws(() => diffCache.inspectCompiledTargetArtifacts({ phase8, target: common, classification,
        files: diffCache.outputArtifactFiles(commonOutput, common) }), /COMMON/);
    } finally { fs.writeFileSync(commonRaw, rawBytes); }
    assert.throws(() => p8.writeObjectManifest(commonOutput, [], { ...phase8, targets: [common] }, new Map(), compiled), /COMMON/);
    for (const file of ['objects/manifest.json', 'layout.json', `generated/c/${target.symbol}.source-object-proof.json`]) {
      assert(!fs.existsSync(path.join(commonOutput, file)), 'rejected COMMON input published ' + file);
    }
    const scratchDir = path.join(sourceRoot, label + '-scratch');
    const scratchTarget = { ...target, targetId: 'native-fixture', romStart: target.romStartNumber, vramStart: target.vramStartNumber };
    assert.throws(() => compileScratchCandidate({ session, target: scratchTarget, sourceFile: commonSource, artifactDir: scratchDir }), /COMMON/);
    assert.throws(() => diagnostic.objectEvidence(commonRaw, scratchTarget), /COMMON/);
    assert.throws(() => diagnostic.objectEvidence(commonObject, scratchTarget), /COMMON/);
    commonRejections.push({ label, output: commonOutput, source: common.source, sourceSha256: common.sourceSha256,
      sourceClass: classification.class, commonSymbol: { name: global.name, sectionIndex: global.sectionIndex, bytes: global.size },
      rawSha256: sha256File(commonRaw), strippedSha256: sha256File(commonObject),
      rejected: ['compile-before-link-object', 'raw-evidence', 'stripped-evidence', 'raw-diff-cache', 'stripped-diff-cache',
        'manifest-before-publication', 'scratch', 'raw-diagnostic', 'stripped-diagnostic'] });
    return { commonRaw, commonObject, scratchTarget, scratchDir };
  }
  const commonFixture = rejectCommon(sourceFile, 'common');
  const manifest = p8.writeObjectManifest(output, replacement.linkedObjects, phase8, replacement.replacements, compiled);
  p8.linkPhase8(phase8, output, manifest, runtime.tools);
  p8.writeLayout(phase8, phase7, output, replacement.replacements);
  p8.writeSourceObjectProofs(phase8, { output, compiled, sourcePolicy: policy });
  const verification = p8.verifyPhase8Output(phase8, { output, replacements: replacement.replacements,
    asmDifferRoot: context.localTools.asmDifferRoot, splatPython: context.localTools.splatPython,
    objdump: runtime.tools['mips-kmc-elf-objdump.exe'].path, objcopy: runtime.tools['mips-kmc-elf-objcopy.exe'].path });
  assert(fs.readFileSync(path.join(output, 'phase8.us_rev0.z64')).equals(rom));
  const records = tc.recordsForTarget(target, output, rom);
  assert(records.linkEvidence.fullOwnerExact);
  assert.equal(records.objectEvidence.schemaVersion, 2);
  assert.equal(records.linkEvidence.schemaVersion, 2);
  assert.equal(records.linkEvidence.allocation.unexpectedAllocationCount, 0);
  assert.equal(records.linkEvidence.allocation.unexpectedLoadCount, 0);
  const commonLinkOutput = fs.mkdtempSync(path.join(context.localTools.workRoot, 'nt-cl-'));
  fs.cpSync(output, commonLinkOutput, { recursive: true });
  fs.copyFileSync(commonFixture.commonRaw, path.join(commonLinkOutput, 'objects/c', target.symbol + '.source-object.o'));
  fs.copyFileSync(commonFixture.commonObject, path.join(commonLinkOutput, 'objects/c', target.symbol + '.o'));
  // Reproduce the link from the admitted pre-correction artifact; no new manifest is accepted.
  p8.linkPhase8(phase8, commonLinkOutput, manifest, runtime.tools);
  // Keep linked output bad while restoring admissible objects to isolate the linked gate.
  for (const suffix of ['.source-object.o', '.o']) {
    fs.copyFileSync(path.join(output, 'objects/c', target.symbol + suffix), path.join(commonLinkOutput, 'objects/c', target.symbol + suffix));
  }
  fs.unlinkSync(path.join(commonLinkOutput, 'layout.json'));
  for (const value of phase8.targets) fs.unlinkSync(path.join(commonLinkOutput, 'generated/c', value.symbol + '.source-object-proof.json'));
  assert.throws(() => tc.deriveLinkEvidence(target, commonLinkOutput, rom), /native unexpected writable or allocated output/);
  assert.throws(() => p8.writeLayout(phase8, phase7, commonLinkOutput, replacement.replacements), /native unexpected writable or allocated output/);
  assert.throws(() => p8.writeSourceObjectProofs(phase8, { output: commonLinkOutput, compiled, sourcePolicy: policy }), /native unexpected writable or allocated output/);
  assert(!fs.existsSync(path.join(commonLinkOutput, 'layout.json')));
  for (const value of phase8.targets) assert(!fs.existsSync(path.join(commonLinkOutput, 'generated/c', value.symbol + '.source-object-proof.json')));
  commonRejections.push({ label: 'admitted-object-linked-replay', output: commonLinkOutput,
    elfSha256: sha256File(path.join(commonLinkOutput, 'phase8.elf')), mapSha256: sha256File(path.join(commonLinkOutput, 'phase8.map')),
    rejected: ['link-evidence', 'layout-before-publication', 'all-proofs-before-publication'] });
  const mutations = [];
  for (const key of ['textContract', 'objectEvidence', 'linkEvidence']) {
    for (const change of [value => { delete value[key]; }, value => { value[key].extra = true; }, value => { value[key].schemaVersion = 0; }]) {
      const value = JSON.parse(JSON.stringify(records)); change(value);
      assert.throws(() => tc.validateRecords(value, records, 'fixture')); mutations.push(`${key} malformed`);
    }
  }
  const rawPath = path.join(output, 'objects/c', target.symbol + '.source-object.o');
  const raw = fs.readFileSync(rawPath), elf = parseElfFile(rawPath), section = elf.sections.find(value => value.name === '.text');
  try {
    const changed = Buffer.from(raw); changed[section.offset + 1132] = 1; fs.writeFileSync(rawPath, changed);
    assert.throws(() => tc.deriveObjectEvidence(target, output)); mutations.push('nonzero raw tail');
  } finally { fs.writeFileSync(rawPath, raw); }
  for (const [name, mutate] of [
    ['raw alignment', bytes => bytes.writeUInt32BE(4, section.headerOffset + 32)],
    ['writable raw text', bytes => bytes.writeUInt32BE(7, section.headerOffset + 8)],
    ['raw extent', bytes => bytes.writeUInt32BE(1132, section.headerOffset + 20)],
    ['raw section type', bytes => bytes.writeUInt32BE(8, section.headerOffset + 4)],
  ]) {
    try {
      const changed = Buffer.from(raw); mutate(changed); fs.writeFileSync(rawPath, changed);
      assert.throws(() => tc.deriveObjectEvidence(target, output)); mutations.push(name);
    } finally { fs.writeFileSync(rawPath, raw); }
  }
  assert.throws(() => tc.tailEvidence(records.textContract, [{ bytes: Buffer.alloc(1136) }], [{ offset: '0x0000046C' }]));
  mutations.push('tail relocation');
  const mapFile = path.join(output, 'phase8.map'), map = fs.readFileSync(mapFile, 'utf8');
  const linkedContext = tc.linkContext(output, rom);
  for (const [name, mutate] of [
    ['extra load', value => value.programHeaders.push({ ...value.programHeaders.find(load => load.type === 1) })],
    ['writable text output', value => { value.sections.find(section => section.name === target.sectionName).flags |= 1; }],
    ['nonempty BSS output', value => { value.sections.find(section => section.name === '.bss').size = 4; }],
  ]) {
    const changed = { ...linkedContext.elf, sections: linkedContext.elf.sections.map(value => ({ ...value })),
      programHeaders: linkedContext.elf.programHeaders.map(value => ({ ...value })) };
    mutate(changed);
    assert.throws(() => tc.nativeLinkedAllocationEvidence(target, changed, map)); mutations.push(name);
  }
  assert.throws(() => tc.nativeLinkedAllocationEvidence(target, linkedContext.elf,
    map.replace(`from objects/c/${target.symbol}.o(.bss)`, 'from *(.bss)')), /native empty BSS object selector/);
  mutations.push('empty BSS wildcard selector');
  for (const [name, changed] of [
    ['map fallback owner', map.replaceAll(`objects/c/${target.symbol}.o`, 'objects/assembly/chunk_032.o')],
    ['map fill', map.replace(` from objects/c/${target.symbol}.o(.text)`, ` *fill* 4\n from objects/c/${target.symbol}.o(.text)`)],
  ]) {
    try {
      fs.writeFileSync(mapFile, changed); assert.throws(() => tc.deriveLinkEvidence(target, output, rom)); mutations.push(name);
    } finally { fs.writeFileSync(mapFile, map); }
  }
  const scratchTarget = { ...target, targetId: 'native-fixture', romStart: target.romStartNumber, vramStart: target.vramStartNumber };
  const scratch = compileScratchCandidate({ session, target: scratchTarget, sourceFile, artifactDir: path.join(sourceRoot, 'scratch') });
  assert.equal(scratch.objectText.length, 1132);
  assert.equal(scratch.scratchContract.fullOwner.bytes, 1136);
  verifyNativeScratchProvenance(scratch.scratchContract, scratchTarget, path.join(sourceRoot, 'scratch'));
  const commonCached = JSON.parse(JSON.stringify(scratch.scratchContract));
  for (const [role, file] of [['compilerAssembly', 'candidate.compiler.s'], ['assemblerInput', 'candidate.s']]) {
    commonCached.assemblyProvenance[role] = { ...tc.artifact(commonFixture.scratchDir, file),
      path: path.relative(ROOT, path.join(commonFixture.scratchDir, file)).replace(/\\/g, '/') };
  }
  commonCached.artifacts.rawObject = { ...tc.artifact(commonFixture.scratchDir, 'candidate.o'),
    path: path.relative(ROOT, path.join(commonFixture.scratchDir, 'candidate.o')).replace(/\\/g, '/') };
  assert.throws(() => verifyNativeScratchProvenance(commonCached, scratchTarget, commonFixture.scratchDir), /COMMON/);
  commonRejections[0].rejected.push('cached-scratch-object');
  const cachedAssemblyFile = path.join(sourceRoot, 'scratch', 'candidate.s');
  const cachedAssembly = fs.readFileSync(cachedAssemblyFile);
  try {
    fs.appendFileSync(cachedAssemblyFile, '\n');
    assert.throws(() => verifyNativeScratchProvenance(scratch.scratchContract, scratchTarget, path.join(sourceRoot, 'scratch')));
    mutations.push('cached native assembly drift');
  } finally { fs.writeFileSync(cachedAssemblyFile, cachedAssembly); }
  const diagnosticEnvironment = { acceptedElfSha256: sha256File(path.join(output, 'phase8.elf')),
    symbols: diagnostic.acceptedSymbolIndex(parseElfFile(path.join(output, 'phase8.elf'))) };
  const diagnosticObject = diagnostic.objectEvidence(path.join(sourceRoot, 'scratch', 'candidate.o'), scratchTarget);
  const diagnosticLink = diagnostic.linkOne(session, scratchTarget, diagnosticObject, diagnosticEnvironment,
    path.join(sourceRoot, 'scratch', 'diag'), 'native');
  assert(diagnosticLink.bytes.equals(rom.subarray(target.romStartNumber, target.romEndNumber)));
  let negative = null;
  const candidateIndex = process.argv.indexOf('--candidate');
  if (candidateIndex !== -1) {
    const candidateFile = path.resolve(process.argv[candidateIndex + 1]);
    assert.equal(sha256File(candidateFile), '8BFE21A404999AD76DA7271EE67A682FB2D227038991EAF507B6561A64F3BB04');
    rejectCommon(candidateFile, 'pure-common');
    const candidateSource = path.join(sourceRoot, 'retained.c');
    fs.copyFileSync(candidateFile, candidateSource);
    const candidate = { ...target, source: path.relative(ROOT, candidateSource).replace(/\\/g, '/'), sourceSha256: sha256File(candidateSource) };
    const candidatePolicy = classifyTargetSources([candidate]);
    assert.equal(candidatePolicy.targets[0].class, 'PURE_C');
    const candidateOutput = fs.mkdtempSync(path.join(context.localTools.workRoot, 'nt-neg-'));
    fs.cpSync(output, candidateOutput, { recursive: true });
    const candidateCompiled = compile(candidate, candidateOutput, candidatePolicy.targets[0], false);
    compiled.set(candidate.symbol, candidateCompiled);
    const candidateModel = { ...phase8, targets: [ordinary, candidate], target: candidate };
    const candidateManifest = p8.writeObjectManifest(candidateOutput, replacement.linkedObjects, candidateModel, replacement.replacements, compiled);
    p8.linkPhase8(candidateModel, candidateOutput, candidateManifest, runtime.tools);
    const candidateElf = parseElfFile(path.join(candidateOutput, 'phase8.elf'));
    const comparison = p8.compareLinkedTargetBytes(candidate, candidateElf, rom);
    assert.equal(comparison.rawBytesExact, false);
    let differingWords = 0;
    for (let offset = 0; offset < target.bytes; offset += 4) {
      if (comparison.linkedBytes.readUInt32BE(offset) !== rom.readUInt32BE(target.romStartNumber + offset)) differingWords++;
    }
    assert.equal(differingWords, 68);
    assert.throws(() => p8.verifyPhase8Output(candidateModel, { output: candidateOutput }), /ROM|rom/);
    const candidateScratch = compileScratchCandidate({ session, target: scratchTarget, sourceFile: candidateSource,
      artifactDir: path.join(sourceRoot, 'retained-scratch') });
    assert.equal(candidateScratch.objectText.length, 1132);
    assert.equal(candidateScratch.scratchContract.fullOwner.bytes, 1136);
    const candidateDiagnosticObject = diagnostic.objectEvidence(path.join(sourceRoot, 'retained-scratch', 'candidate.o'), scratchTarget);
    const candidateDiagnosticLink = diagnostic.linkOne(session, scratchTarget, candidateDiagnosticObject, diagnosticEnvironment,
      path.join(sourceRoot, 'retained-scratch', 'diag'), 'native');
    assert(candidateDiagnosticLink.bytes.equals(comparison.linkedBytes));
    negative = { output: candidateOutput, sourceSha256: candidate.sourceSha256, sourceClass: 'PURE_C', differingWords,
      records: tc.recordsForTarget(candidate, candidateOutput, rom), fullRomRejected: true, scratch: candidateScratch.scratchContract,
      diagnosticLink: candidateDiagnosticLink.evidence };
  }
  const report = { schemaVersion: 1, status: 'pass', output, source: target.source, sourceSha256: target.sourceSha256,
    fixtureClass: 'HYBRID_C', acceptanceEligible: false, exactRom: true, mutations, records, verification, negative,
    diagnosticLink: diagnosticLink.evidence, commonRejections };
  fs.writeFileSync(path.join(output, 'native-text-test-report.json'), JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify({ status: 'pass', output, mutations, exactRom: true }));
}
if (require.main === module) main();
module.exports = { main };
