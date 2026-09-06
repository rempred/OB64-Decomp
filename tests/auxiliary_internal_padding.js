#!/usr/bin/env node
'use strict';

// Synthetic structural fixture, not a retail D14C contract or matching claim.
const assert = require('assert/strict');
const fs = require('fs');
const path = require('path');
const {
  normalizeAuxiliarySectionContracts, resolveAuxiliarySectionContracts,
} = require('../tools/lib/active_targets');
const { ROOT, hex, parseElfFile, sha256Buffer, sha256File } = require('../tools/lib/phase7_conventional');
const {
  adjustSectionAssembly, verifyAuxiliaryPaddingBytes, verifyAuxiliaryCompilerOccurrences,
  verifyAuxiliarySourceObjectSection, auxiliaryRelocationRecords, validateSourceObjectProofBytes,
} = require('../tools/lib/phase8_matching_c');
const {
  artifactSpecifications, cacheEntryPath, defaultImplementationIdentities, projectTargetContract,
  publishCacheEntry, sha256Value, validateCacheEntry,
} = require('../tools/lib/diff_object_cache');
const { assertToolchainAvailable, loadToolchainConfig, runTool } = require('../tools/lib/real_mips_toolchain');

fs.mkdirSync(path.join(ROOT, 'build', 'tests'), { recursive: true });
const scratch = fs.mkdtempSync(path.join(ROOT, 'build', 'tests', 'internal-padding-'));
const mutations = [];
function reject(name, callback) {
  assert.throws(callback, undefined, name);
  mutations.push(name);
}
const offsets = [0, 4, 8, 12, 16, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60];
const raw = Buffer.alloc(64);
const linked = Buffer.alloc(64);
const relocations = offsets.map((offset, index) => {
  const addend = (index % 4) * 4;
  raw.writeUInt32BE(addend, offset);
  linked.writeUInt32BE(0x80000000 + addend, offset);
  return { offset: hex(offset), type: 'R_MIPS_32', symbol: '.text', addend: hex(addend), section: '.rel.rodata' };
});
const occurrences = [[0, 20, '.L10'], [24, 40, '.L113']].map(([offset, bytes, label]) => ({
  label, offset: hex(offset), bytes, entries: bytes / 4, alignment: 8, alignmentDirectives: [3, 2],
  expectedObjectSha256: sha256Buffer(raw.subarray(offset, offset + bytes)),
  expectedLinkedSha256: sha256Buffer(linked.subarray(offset, offset + bytes)),
  ...(offset ? { paddingBefore: { offset: hex(20), bytes: 4, expectedSha256: sha256Buffer(Buffer.alloc(4)) } } : {}),
}));
const contract = {
  kind: 'switch-table', compilerSection: '.rodata', outputSection: '.ob64.r2',
  sectionType: 'SHT_PROGBITS', sectionFlags: ['SHF_ALLOC'], alignment: 8,
  romStart: hex(16), romEndExclusive: hex(80), vramStart: hex(0x80000010), vramEndExclusive: hex(0x80000050),
  bytes: 64, entries: 15, expectedObjectSha256: sha256Buffer(raw), expectedLinkedSha256: sha256Buffer(linked),
  preservedTail: null, expectedRelocations: relocations, compilerOccurrences: occurrences,
};
const normalize = (value) => normalizeAuxiliarySectionContracts([value], 'padding_fixture', 'padding fixture')[0];
const auxiliary = normalize(contract);
assert.equal(auxiliary.entryBytes, 60);
assert.equal(auxiliary.bytes, 64);
for (const [name, edit] of [
  ['missing padding', (c) => { delete c.compilerOccurrences[1].paddingBefore; }],
  ['wrong padding offset', (c) => { c.compilerOccurrences[1].paddingBefore.offset = hex(16); }],
  ['wrong padding size', (c) => { c.compilerOccurrences[1].paddingBefore.bytes = 8; }],
  ['nonzero padding hash', (c) => { c.compilerOccurrences[1].paddingBefore.expectedSha256 = sha256Buffer(Buffer.from([1, 0, 0, 0])); }],
  ['unknown padding key', (c) => { c.compilerOccurrences[1].paddingBefore.entries = 1; }],
  ['first occurrence padding', (c) => { c.compilerOccurrences[0].paddingBefore = { ...c.compilerOccurrences[1].paddingBefore }; }],
  ['unclaimed gap', (c) => { c.compilerOccurrences[1].offset = hex(32); }],
  ['overlap', (c) => { c.compilerOccurrences[1].offset = hex(16); }],
  ['alignment drift', (c) => { c.compilerOccurrences[1].alignmentDirectives = [2]; }],
  ['extra trailing extent', (c) => { c.bytes += 8; c.romEndExclusive = hex(88); c.vramEndExclusive = hex(0x80000058); }],
  ['duplicate occurrence identity', (c) => { c.compilerOccurrences[1].label = '.L10'; }],
  ['missing relocation', (c) => { c.expectedRelocations.pop(); }],
  ['padding relocation replaces entry', (c) => { c.expectedRelocations[5].offset = hex(20); }],
  ['padding invented as entry', (c) => { c.entries++; c.expectedRelocations.splice(5, 0, { ...relocations[5], offset: hex(20) }); }],
  ['missing occurrences', (c) => { delete c.compilerOccurrences; }],
]) {
  const copy = structuredClone(contract);
  edit(copy);
  reject(name, () => normalize(copy));
}
verifyAuxiliaryPaddingBytes(raw, auxiliary, 'fixture raw');
const evidence = verifyAuxiliaryCompilerOccurrences(raw, relocations, auxiliary, 'fixture', linked);
assert.deepEqual(evidence[1].paddingBefore, contract.compilerOccurrences[1].paddingBefore);
for (const position of [20, 21, 22, 23]) {
  const corrupt = Buffer.from(raw); corrupt[position] = 1;
  reject(`raw padding corruption ${position}`, () => verifyAuxiliaryCompilerOccurrences(corrupt, relocations, auxiliary, 'corrupt'));
  const corruptLinked = Buffer.from(linked); corruptLinked[position] = 1;
  reject(`linked padding corruption ${position}`, () => verifyAuxiliaryCompilerOccurrences(raw, relocations, auxiliary, 'corrupt', corruptLinked));
}
reject('extra real relocation in padding', () => verifyAuxiliaryCompilerOccurrences(raw,
  [...relocations, { ...relocations[0], offset: hex(20) }], auxiliary, 'extra relocation'));
const source = Buffer.from([
  '\t.set\tnoreorder', '\t.text', '\t.globl\tpadding_fixture', '\t.type\tpadding_fixture,@function',
  'padding_fixture:', ...[0, 1, 2, 3].flatMap((i) => [`.L${200 + i}:`, '\tnop']),
  '\t.size\tpadding_fixture,.-padding_fixture',
  ...occurrences.flatMap((o) => [
    '\t.section\t.rodata', '\t.align\t3', '\t.align\t2', `${o.label}:`,
    ...relocations.filter((r) => parseInt(r.offset, 16) >= parseInt(o.offset, 16)
      && parseInt(r.offset, 16) < parseInt(o.offset, 16) + o.bytes)
      .map((r) => `\t.word\t.L${200 + parseInt(r.addend, 16) / 4}`), '\t.text',
  ]), '',
].join('\n'));
const adjusted = adjustSectionAssembly(source, '.ob64.r1', { auxiliarySections: [auxiliary] });
for (const [name, text] of [
  ['explicit gap word', source.toString().replace('.L113:', '\t.word\t0\n.L113:')],
  ['explicit gap space', source.toString().replace('.L113:', '\t.space\t4\n.L113:')],
  ['compiler align removal', source.toString().replace('\t.align\t3\n\t.align\t2\n.L113:', '\t.align\t2\n.L113:')],
  ['compiler label drift', source.toString().replace('.L113:', '.L114:')],
]) reject(name, () => adjustSectionAssembly(Buffer.from(text), '.ob64.r1', { auxiliarySections: [auxiliary] }));

const toolchain = assertToolchainAvailable(loadToolchainConfig());
const assemblyFile = path.join(scratch, 'fixture.s');
const objectFile = path.join(scratch, 'fixture.o');
fs.writeFileSync(assemblyFile, adjusted);
runTool(toolchain.assemblerAbs, [...toolchain.compilerAssemblerFlags, '-o', objectFile, assemblyFile], { cwd: scratch });
const target = { symbol: 'padding_fixture', source: 'src/padding_fixture.c', sourceSha256: sha256Buffer(source),
  sectionName: '.ob64.r1', bytes: 16, romStartNumber: 0, vramStartNumber: 0x80000000, auxiliarySections: [auxiliary] };
const elf = parseElfFile(objectFile);
const objectEvidence = verifyAuxiliarySourceObjectSection(elf, target, auxiliary, 'assembled fixture');
assert.deepEqual(objectEvidence.selectedBytes, raw);
assert.deepEqual(objectEvidence.relocations, relocations);
const relSection = elf.sections.find((s) => s.name === '.rel.ob64.r2');
const corruptElf = { ...elf, buffer: Buffer.from(elf.buffer) };
corruptElf.buffer.writeUInt32BE(20, relSection.offset + 5 * 8);
reject('actual ELF relocation in padding', () => auxiliaryRelocationRecords(corruptElf, target, auxiliary));

// A synthetic owner/ROM exercises the canonical resolver without touching active config.
const relativeAssembly = path.relative(ROOT, assemblyFile).replace(/\\/g, '/');
const slab = { placementKind: 'non-descriptor-load-slab', loadSlabId: 'synthetic-padding' };
const model = { rows: [
  { slices: [{ ...slab, sectionName: target.sectionName }] },
  { index: 2, primaryClass: 'data', inputKind: 'tracked-assembly', romStart: 16, romEndExclusive: 80,
    part: { file: relativeAssembly, sha256: sha256File(assemblyFile) },
    slices: [{ ...slab, sectionName: auxiliary.outputSection, executable: false, vramStart: 0x80000010, vramEndExclusive: 0x80000050 }] },
] };
const rom = Buffer.concat([Buffer.alloc(16), linked]);
resolveAuxiliarySectionContracts(model, rom, target, [auxiliary]);
const corruptRom = Buffer.from(rom); corruptRom[16 + 20] = 1;
reject('synthetic retail padding corruption', () => resolveAuxiliarySectionContracts(model, corruptRom, target, [auxiliary]));

// The production byte gate compares against independently reconstructed occurrence evidence.
const proof = { schemaVersion: 4, kind: 'ob64-source-to-object-load-evidence',
  textContract: {}, objectEvidence: {}, linkEvidence: {},
  target: { compilationInput: {}, dependencies: [], ownerSections: [] }, toolchain: { preprocessor: {} },
  assemblyContract: { compilerAssemblyRewritten: false, classifiedBytesAreCompilerInput: true,
    auxiliarySectionCount: 1, relocatableContainerSplit: false, splitInstructionBytesRewritten: false },
  artifacts: { compilationInput: {} }, finalObject: { textOwners: [], auxiliarySections: [{ compilerOccurrences: evidence }] },
  finalTarget: { textOwners: [], auxiliarySections: [] } };
const proofBytes = Buffer.from(JSON.stringify(proof));
validateSourceObjectProofBytes(proofBytes, proofBytes);
for (const [name, edit] of [
  ['omitted padding proof', (p) => { delete p[1].paddingBefore; }],
  ['stale padding extent proof', (p) => { p[1].paddingBefore.bytes = 8; }],
  ['stale padding hash proof', (p) => { p[1].paddingBefore.expectedSha256 = '0'.repeat(64); }],
]) {
  const stale = structuredClone(proof); edit(stale.finalObject.auxiliarySections[0].compilerOccurrences);
  reject(name, () => validateSourceObjectProofBytes(Buffer.from(JSON.stringify(stale)), proofBytes));
}

// Real cache metadata/identity gates; the injected inspection is intentionally scoped
// to real assembled auxiliary bytes plus the production occurrence verifier.
const inspectArtifacts = ({ files }) => {
  const actual = verifyAuxiliarySourceObjectSection(parseElfFile(files['source-object.o']), target, auxiliary, 'cached fixture');
  return { compilerOccurrences: verifyAuxiliaryCompilerOccurrences(actual.selectedBytes, actual.relocations, auxiliary, 'cache') };
};
const sourceFiles = Object.fromEntries(artifactSpecifications(target).map((s) => [s.name, objectFile]));
const keyMaterial = { contract: projectTargetContract(target), implementation: defaultImplementationIdentities() };
const compiled = inspectArtifacts({ files: sourceFiles });
const cacheOptions = { cacheRoot: path.join(scratch, 'cache'), target, keyMaterial, sourceFiles, compiled, inspectArtifacts };
publishCacheEntry(cacheOptions);
validateCacheEntry(cacheOptions);
const entry = cacheEntryPath(cacheOptions.cacheRoot, target, sha256Value(keyMaterial));
const metadataFile = path.join(entry, 'metadata.json');
const metadata = JSON.parse(fs.readFileSync(metadataFile));
delete metadata.compiled.compilerOccurrences[1].paddingBefore;
fs.writeFileSync(metadataFile, `${JSON.stringify(metadata, null, 2)}\n`);
reject('stale cache omitted padding evidence', () => validateCacheEntry(cacheOptions));
const staleTarget = structuredClone(target); delete staleTarget.auxiliarySections[0].compilerOccurrences[1].paddingBefore;
assert.notEqual(sha256Value(projectTargetContract(staleTarget)), sha256Value(projectTargetContract(target)));
assert(keyMaterial.implementation.some((i) => i.path === 'tools/lib/active_targets.js'));
assert(keyMaterial.implementation.some((i) => i.path === 'tools/lib/phase8_matching_c.js'));
console.log(JSON.stringify({ status: 'pass', synthetic: true, entryBytes: 60, paddingBytes: 4,
  sectionBytes: 64, actualRelocations: relocations.length, mutations, scratch }, null, 2));
