#!/usr/bin/env node
'use strict';
// Unrelated PURE_C fixture; no production activation or full-ROM operation.
const assert = require('assert/strict');
const fs = require('fs');
const path = require('path');
const p7 = require('../tools/lib/phase7_conventional');
const p8 = require('../tools/lib/phase8_matching_c');
const active = require('../tools/lib/active_targets');
const projection = require('../tools/lib/auxiliary_projection');
const policy = require('../tools/lib/source_policy');
const tc = require('../tools/lib/text_contract');
const cache = require('../tools/lib/diff_object_cache');
const { assertToolchainAvailable, loadToolchainConfig, runTool } = require('../tools/lib/real_mips_toolchain');
const { ROOT, hex, sha256Buffer: hash } = p7;
const phase8 = active.loadActiveTargetModel();
const local = JSON.parse(fs.readFileSync(path.join(ROOT, 'config/local-tools.json')));
const verifiedCompiler = p8.verifyCompiler(phase8, local.compiler);
const tools = assertToolchainAvailable(loadToolchainConfig());
fs.mkdirSync(path.join(ROOT, 'build/tests'), { recursive: true });
const root = fs.mkdtempSync(path.join(ROOT, 'build/tests/auxiliary-projection-'));
const file = path.join(root, 'fixture.c');
const source = 'extern int external_call(int);\nint projection_fixture(int x, int y) { int a;\n'
  + 'switch(x) { case 0:a=external_call(11);break; case 1:a=external_call(23);break; case 2:a=external_call(37);break; case 3:a=external_call(41);break; case 4:a=external_call(59);break; default:a=3; }\n'
  + 'switch(y) { case 0:a+=external_call(61);break; case 1:a+=external_call(73);break; case 2:a+=external_call(89);break; case 3:a+=external_call(97);break; case 4:a+=external_call(101);break; case 5:a+=external_call(113);break; case 6:a+=external_call(127);break; default:a+=5; } return a; }\n';
fs.writeFileSync(file, source);
const relative = path.relative(ROOT, file).replace(/\\/g, '/');
const classification = policy.classifyTargetSources([{ symbol: 'projection_fixture', source: relative, bytes: 4 }]).targets[0];
assert.equal(classification.class, 'PURE_C');
fs.writeFileSync(path.join(root, 'input.c'), policy.compilationInputBytes(classification));
p7.run(local.compiler, [...phase8.config.compiler.compileFlags, '-o', path.join(root, 'compiler.s'), path.join(root, 'input.c')]);
policy.verifyClassificationInputs(classification);
const compiler = fs.readFileSync(path.join(root, 'compiler.s'));
const assembly = p8.adjustSectionAssembly(compiler, '.ob64.r0001', { allowAuxiliaryReadOnlySections: true });
fs.writeFileSync(path.join(root, 'raw.s'), assembly.toString().replace(/\.section\s+\.rodata/g, '.section .ob64.r0002,"a",@progbits'));
runTool(tools.assemblerAbs, [...tools.compilerAssemblerFlags, '-o', path.join(root, 'raw.o'), path.join(root, 'raw.s')]);
const raw = p7.parseElfFile(path.join(root, 'raw.o'));
const text = raw.sections.find(section => section.name === '.ob64.r0001');
const rodata = raw.sections.find(section => section.name === '.ob64.r0002');
const rawData = Buffer.from(p7.elfSectionBytes(raw, rodata));
const blocks = [...compiler.toString().matchAll(/\.section\s+\.rodata([^]*?)\s\.text/g)];
assert.equal(blocks.length, 2, 'unrelated source must emit two native tables');
let cursor = 0;
const segments = [];
for (const [index, block] of blocks.entries()) {
  const directives = [...block[1].matchAll(/\.align\s+(\d+)/g)].map(match => Number(match[1]));
  const aligned = Math.ceil(cursor / rodata.alignment) * rodata.alignment;
  if (aligned > cursor) segments.push({ kind: 'zero', offset: cursor, bytes: aligned - cursor,
    ownerSection: '.ob64.r' + String(index * 2 + 1).padStart(4, '0'), ownerOffset: 0, ownerBytes: aligned - cursor, expectedOwnerSha256: hash(Buffer.alloc(aligned - cursor)) });
  const bytes = [...block[1].matchAll(/\.word\s+\.L\d+/g)].length * 4;
  segments.push({ kind: 'payload', offset: aligned, bytes, outputSection: '.ob64.r' + String(index * 2 + 2).padStart(4, '0'),
    label: /(?:^|\n)(\.L\d+):/.exec(block[1])[1], alignmentDirectives: directives });
  cursor = aligned + bytes;
}
assert(rodata.size > cursor, 'fixture terminal padding');
segments.push({ kind: 'zero', offset: cursor, bytes: rodata.size - cursor, ownerSection: '.ob64.r0005', ownerOffset: 0,
  ownerBytes: rodata.size - cursor + 8, expectedOwnerSha256: hash(Buffer.alloc(rodata.size - cursor + 8)) });
const contract = { schemaVersion: 1, mode: 'fixed-row-readonly-projection', compilerSection: '.rodata',
  bytes: rodata.size, alignment: rodata.alignment, expectedObjectSha256: hash(rawData), segments };
const base = 0x80230000, tableBase = 0x80240000, tableRom = 0x1000;
fs.writeFileSync(path.join(root, 'native.ld'), 'SECTIONS { .ob64.r0001 ' + hex(base) + ' : { *(.ob64.r0001) }\n .ob64.r0002 '
  + hex(tableBase) + ' : { *(.ob64.r0002) } /DISCARD/ : { *(.reginfo) *(.pdr) *(.comment) *(.note) } }\nexternal_call = 0x80001234;\n');
runTool(tools.toolsAbs.linker, ['-T', path.join(root, 'native.ld'), '-o', path.join(root, 'native.elf'), path.join(root, 'raw.o')]);
const native = p7.parseElfFile(path.join(root, 'native.elf'));
const linkedText = Buffer.from(p7.elfSectionBytes(native, native.sections.find(section => section.name === '.ob64.r0001')));
const linkedData = Buffer.from(p7.elfSectionBytes(native, native.sections.find(section => section.name === '.ob64.r0002')));
const auxContracts = segments.filter(segment => segment.kind === 'payload').map(segment => ({
  kind: 'switch-table', compilerSection: '.rodata', outputSection: segment.outputSection,
  sectionType: 'SHT_PROGBITS', sectionFlags: ['SHF_ALLOC'], alignment: rodata.alignment,
  romStart: hex(tableRom + segment.offset), romEndExclusive: hex(tableRom + segment.offset + segment.bytes),
  vramStart: hex(tableBase + segment.offset), vramEndExclusive: hex(tableBase + segment.offset + segment.bytes),
  bytes: segment.bytes, entries: segment.bytes / 4,
  expectedObjectSha256: hash(rawData.subarray(segment.offset, segment.offset + segment.bytes)),
  expectedLinkedSha256: hash(linkedData.subarray(segment.offset, segment.offset + segment.bytes)), preservedTail: null,
  expectedRelocations: Array.from({ length: segment.bytes / 4 }, (_, index) => ({ offset: hex(index * 4), type: 'R_MIPS_32',
    symbol: '.text', addend: hex(rawData.readUInt32BE(segment.offset + index * 4)), section: '.rel.rodata' })),
}));
const normalized = active.normalizeAuxiliarySectionContracts(auxContracts, 'projection_fixture', 'fixture', contract);
projection.normalize(contract, normalized);
const rom = Buffer.alloc(tableRom + rodata.size + 8); linkedText.copy(rom); linkedData.copy(rom, tableRom);
const originalFile = path.join(root, 'original.s'); fs.writeFileSync(originalFile, segments.filter(segment => segment.kind === 'zero').map(segment =>
  '.section ' + segment.ownerSection + ',"a",@progbits\n' + Array(segment.ownerBytes / 4).fill('.word 0').join('\n')).join('\n') + '\n');
const partFile = path.relative(ROOT, originalFile).replace(/\\/g, '/');
function row(index, start, bytes, vram, executable) {
  return { index, primaryId: 'fixture:' + index, primaryClass: executable ? 'code' : 'data', inputKind: 'tracked-assembly',
    romStart: start, romEndExclusive: start + bytes, bytes,
    part: { file: partFile, sha256: p7.sha256File(originalFile), chunkIndex: 0, name: 'fixture_owner_' + index, symbolByteOffset: 0 },
    slices: [{ sectionName: '.ob64.r' + String(index).padStart(4, '0'), executable, bytes, romStart: start, romEndExclusive: start + bytes,
      vramStart: vram, vramEndExclusive: vram + bytes, placementKind: 'overlay', overlayDescriptorId: 99,
      overlaySection: executable ? 'text' : 'data-rodata', loadSlabId: null }] };
}
const model = { rows: [row(1, 0, text.size, base, true), ...segments.map(segment => row(
  Number((segment.outputSection || segment.ownerSection).slice(7)), tableRom + segment.offset,
  segment.kind === 'payload' ? segment.bytes : segment.ownerBytes, tableBase + segment.offset, false))] };
const owner = { ownerIndex: 0, sectionName: '.ob64.r0001', symbol: 'projection_fixture', rowIndex: 1, primaryId: 'fixture:1', chunkIndex: 0,
  logicalOffset: 0, logicalEnd: text.size, bytes: text.size, romStartNumber: 0, romEndNumber: text.size,
  vramStartNumber: base, vramEndNumber: base + text.size, expectedTextSha256: hash(linkedText),
  originalAssembly: partFile, originalAssemblySha256: p7.sha256File(originalFile), row: model.rows[0] };
const target = { symbol: 'projection_fixture', source: relative, sourceSha256: p7.sha256File(file), sectionName: '.ob64.r0001',
  bytes: text.size, romStartNumber: 0, romEndNumber: text.size, vramStartNumber: base, vramEndNumber: base + text.size,
  rowIndex: 1, primaryId: 'fixture:1', chunkIndex: 0, expectedTextSha256: hash(linkedText),
  originalAssembly: partFile, originalAssemblySha256: p7.sha256File(originalFile), model, row: model.rows[0], rows: [model.rows[0]],
  textOwners: [owner], compilerTextFunctions: [{ symbol: 'projection_fixture', offset: hex(0), offsetNumber: 0, bytes: text.size, binding: 'GLOBAL', entryEvidence: 'owner' }],
  auxiliarySections: [], auxiliaryProjection: contract, legacyAncillaryRelocations: [], relocationContractSource: 'canonical' };
target.auxiliarySections = active.resolveAuxiliarySectionContracts(model, rom, target, normalized);
target.auxiliaryProjectionRetained = projection.retainedBindings(target, model, rom);
active.validateAuxiliaryOwnerGroups([target]);
const projected = projection.project(raw.buffer, target);
fs.writeFileSync(path.join(root, 'projected.o'), projected.buffer);
const projectedElf = p7.parseElf32BigEndian(projected.buffer);
target.expectedRelocations = p8.relocationRecords(projectedElf, target);
assert.deepEqual(tc.assemblerInput(compiler, target, p8.adjustSectionAssembly), fs.readFileSync(path.join(root, 'raw.s')));
assert(projected.evidence.references.some(reference => reference.addend === segments.find(segment => segment.outputSection === '.ob64.r0004').offset));
for (const auxiliary of target.auxiliarySections) p8.verifyAuxiliarySourceObjectSection(projectedElf, target, auxiliary, 'fixture');
const linkage = { schemaVersion: 4, profile: 'fixture', symbols: [], targets: [{ symbol: target.symbol,
  expectedRelocations: target.expectedRelocations, auxiliarySections: auxContracts, auxiliaryProjection: contract }] };
active.validateLinkageConfig(linkage, 'fixture');
const rejected = [];
function reject(name, callback) { assert.throws(callback, undefined, name); rejected.push(name); }
function contractReject(name, change) { const copy = structuredClone(target); change(copy); reject(name, () => projection.project(raw.buffer, copy)); }
for (const [name, mutate] of [
  ['huge owner extent', value => value.auxiliaryProjection.segments[1].ownerBytes = 0xfffffffc],
  ['missing segment', value => value.auxiliaryProjection.segments.pop()],
  ['reordered segments', value => value.auxiliaryProjection.segments.reverse()],
  ['duplicate payload', value => value.auxiliaryProjection.segments[2].outputSection = '.ob64.r0002'],
  ['truncated payload', value => value.auxiliaryProjection.segments[0].bytes -= 4],
  ['wrong ROM spacing', value => value.auxiliarySections[1].romStartNumber += 4],
  ['wrong RAM spacing', value => value.auxiliarySections[1].vramStartNumber += 4],
  ['legacy prefix', value => value.auxiliarySections[0].sourceObjectPrefix = {}],
  ['missing retained bindings', value => delete value.auxiliaryProjectionRetained],
  ['multi-text owner', value => value.textOwners.push(value.textOwners[0])],
  ['group producer', value => value.compilationGroup = {}],
  ['stale raw hash', value => value.auxiliaryProjection.expectedObjectSha256 = '0'.repeat(64)],
]) contractReject(name, mutate);
for (const [name, change] of [
  ['missing explicit mode', value => delete value.targets[0].auxiliaryProjection],
  ['null explicit mode', value => value.targets[0].auxiliaryProjection = null],
  ['stale explicit mode schema', value => value.targets[0].auxiliaryProjection.schemaVersion = 0],
  ['extra projection key', value => value.targets[0].auxiliaryProjection.bypass = true],
]) { const copy = structuredClone(linkage); change(copy); reject(name, () => active.validateLinkageConfig(copy, 'fixture')); }
const badModel = structuredClone(model); badModel.rows.find(value => value.index === 4).slices[0].overlayDescriptorId++;
reject('same spacing different overlay', () => projection.retainedBindings(target, badModel, rom));
const corruptRom = Buffer.from(rom); corruptRom[corruptRom.length - 1] = 1;
reject('unproduced final eight original bytes', () => projection.retainedBindings(target, model, corruptRom));
reject('dual C/ASM row', () => projection.validateCensus([target, { auxiliarySections: [{ outputSection: '.ob64.r0003' }] }]));
const rel = raw.sections.find(section => section.name === '.rel.ob64.r0002');
const symtab = raw.sections.find(section => section.type === 2);
const anchor = raw.symbols.find(symbol => symbol.sectionIndex === rodata.index);
function rawReject(name, mutate, rehash = false) {
  const bytes = Buffer.from(raw.buffer), copy = structuredClone(target); mutate(bytes);
  if (rehash) copy.auxiliaryProjection.expectedObjectSha256 = hash(bytes.subarray(rodata.offset, rodata.offset + rodata.size));
  reject(name, () => projection.project(bytes, copy));
}
rawReject('nonzero padding even with updated hash', bytes => bytes[rodata.offset + segments[1].offset] = 1, true);
rawReject('relocation in padding', bytes => bytes.writeUInt32BE(segments[1].offset, rel.offset));
rawReject('crossing relocation', bytes => bytes.writeUInt32BE(segments[0].bytes - 2, rel.offset));
rawReject('unmapped relocation', bytes => bytes.writeUInt32BE(rodata.size, rel.offset));
rawReject('duplicate relocation', bytes => bytes.writeUInt32BE(4, rel.offset));
rawReject('wrong relocation type', bytes => bytes.writeUInt32BE((bytes.readUInt32BE(rel.offset + 4) & ~255) | 4, rel.offset + 4));
rawReject('wrong section anchor value', bytes => bytes.writeUInt32BE(4, symtab.offset + anchor.symbolIndex * 16 + 4));
rawReject('allocated named symbol', bytes => bytes[symtab.offset + anchor.symbolIndex * 16 + 12] = 0x11);
rawReject('changed payload addend despite rehash', bytes => bytes.writeUInt32BE(0, rodata.offset), true);
const secondReference = projected.evidence.references.find(reference => reference.addend > 0);
rawReject('text reference into padding', bytes => {
  const offset = text.offset + secondReference.lowPlace;
  bytes.writeUInt32BE(((bytes.readUInt32BE(offset) & 0xffff0000) | segments[1].offset) >>> 0, offset);
});
const marker = raw.symbols.find(symbol => symbol.name === 'gcc2_compiled.');
for (const [name, offset, value] of [['value',4,4],['size',8,4]]) rawReject('compiler marker ' + name,
  bytes => bytes.writeUInt32BE(value, symtab.offset + marker.symbolIndex * 16 + offset));
for (const [name, value] of [['binding',0x11],['type',2],['section type',3]]) rawReject('compiler marker ' + name,
  bytes => { bytes[symtab.offset + marker.symbolIndex * 16 + 12] = value; });
rawReject('compiler marker section', bytes => bytes.writeUInt16BE(text.index, symtab.offset + marker.symbolIndex * 16 + 14));
for (const [name, value] of [['hidden visibility',2],['reserved st_other bits',0x80]]) rawReject('compiler marker ' + name,
  bytes => { bytes[symtab.offset + marker.symbolIndex * 16 + 13] = value; });
const textRelocations = raw.sections.find(section => section.name === '.rel' + text.name);
const externalCall = Array.from({ length: textRelocations.size / 8 }, (_, index) => textRelocations.offset + index * 8)
  .find(offset => (raw.buffer.readUInt32BE(offset + 4) & 255) === 4
    && raw.symbols[raw.buffer.readUInt32BE(offset + 4) >>> 8].name === 'external_call');
assert.notEqual(externalCall, undefined);
rawReject('incoming call relocation to compiler marker', bytes => bytes.writeUInt32BE((marker.symbolIndex << 8) | 4, externalCall + 4));
const writable = raw.sections.find(section => section.name === '.data');
rawReject('unexpected writable allocation', bytes => bytes.writeUInt32BE(4, writable.headerOffset + 20));
const output = path.join(root, 'compiled'); fs.mkdirSync(output);
const classifications = policy.classifyTargetSources([target]);
const classified = classifications.targets[0];
const compiled = p8.compileTarget(phase8, target, output, local.compiler, tools.assemblerAbs, tools.objcopyAbs, { classification: classified });
const files = cache.outputArtifactFiles(output, target);
const inspected = cache.inspectCompiledTargetArtifacts({ phase8, target, classification: classified, files });
assert.deepEqual(inspected, compiled, 'compiler and cache independent artifact reconstruction');
fs.mkdirSync(path.join(output, 'objects/assembly'), { recursive: true });
runTool(tools.assemblerAbs, [...tools.compilerAssemblerFlags, '-o', path.join(output, 'objects/assembly/chunk_000.o'), originalFile]);
const sectionRows = model.rows;
const script = 'OUTPUT_ARCH(mips)\nSECTIONS {\n' + sectionRows.map(value => value.slices[0].sectionName + ' ' + hex(value.slices[0].vramStart)
    + ' : AT(' + hex(value.romStart) + ') { *(' + value.slices[0].sectionName + ') }').join('\n')
  + '\n/DISCARD/ : { *(.reginfo) *(.pdr) *(.comment) *(.note) } }\nexternal_call = 0x80001234;\n';
fs.writeFileSync(path.join(output, 'fixture.ld'), script + target.auxiliarySections.map(auxiliary => auxiliary.ownerSymbol + ' = ' + hex(auxiliary.ownerSymbolVram) + ';').join('\n') + '\n');
runTool(tools.toolsAbs.linker, ['-T', 'fixture.ld', '-Map', 'phase8.map', '-o', 'phase8.elf',
  'objects/c/projection_fixture.o', 'objects/assembly/chunk_000.o'], { cwd: output });
const linkedElf = p7.parseElfFile(path.join(output, 'phase8.elf'));
assert(p7.elfSectionBytes(linkedElf, linkedElf.sections.find(section => section.name === target.sectionName)).equals(linkedText));
for (const auxiliary of target.auxiliarySections) assert(p8.compareLinkedAuxiliaryBytes(target, auxiliary, linkedElf, rom).rawBytesExact);
const linkContext = tc.linkContext(output, rom, linkedElf);
const retainedLink = projection.linkedEvidence(target, output, linkContext);
assert.equal(retainedLink.reduce((sum, value) => sum + value.ownerBytes, 0), 16);
const proof = p8.deriveSourceObjectProof(phase8, target, output, classified, linkedElf, rom);
p8.validateSourceObjectProofBytes(proof.proofBytes, proof.proofBytes);
for (const field of ['nativeRelocations', 'references', 'retained', 'contract', 'nativeSections', 'nativeSymbols', 'nativeRelocationSections', 'implementationSha256']) {
  const copy = structuredClone(proof.proof); delete copy.objectEvidence.auxiliaryProjection[field];
  const forged = Buffer.from(JSON.stringify(copy));
  reject('self-compared omitted projection proof ' + field, () => p8.validateSourceObjectProofBytes(forged, forged));
}
for (const field of ['nativeObjectSha256', 'projectedObjectSha256', 'nativeSectionSha256']) {
  for (const [name, mutate] of [
    ['omitted', value => { delete value[field]; }],
    ['malformed', value => { value[field] = 'not-a-sha256'; }],
    ['wrong type', value => { value[field] = 123; }],
    ['inconsistent valid hash', value => { value[field] = value[field] === '0'.repeat(64) ? '1'.repeat(64) : '0'.repeat(64); }],
  ]) {
    const copy = structuredClone(proof.proof); mutate(copy.objectEvidence.auxiliaryProjection);
    const forged = Buffer.from(JSON.stringify(copy));
    reject('self-compared projection hash ' + name + ' ' + field, () => p8.validateSourceObjectProofBytes(forged, forged));
  }
}
const extraProjectionField = structuredClone(proof.proof);
extraProjectionField.objectEvidence.auxiliaryProjection.unknown = true;
const extraProjectionBytes = Buffer.from(JSON.stringify(extraProjectionField));
reject('self-compared unknown projection evidence field', () => p8.validateSourceObjectProofBytes(extraProjectionBytes, extraProjectionBytes));
for (const role of ['unsplitAssemblerObject', 'rawObject']) {
  const copy = structuredClone(proof.proof); copy.objectEvidence.artifacts[role].sha256 = '0'.repeat(64);
  const forged = Buffer.from(JSON.stringify(copy));
  reject('self-compared inconsistent projection artifact ' + role, () => p8.validateSourceObjectProofBytes(forged, forged));
}
const accounting = require('../tools/lib/status_accounting').summarizeAcceptedOwnership(model, [target]);
assert.equal(accounting.assembly.bytes, 16);
assert.equal(accounting.replacements.bytes, text.size + 48);
const retainedLine = linkContext.mapText.split(/\r?\n/).find(line => line.trim().startsWith('.ob64.r0003 ') && line.includes('objects/assembly/'));
assert(retainedLine);
reject('duplicate retained map ownership', () => projection.linkedEvidence(target, output,
  { ...linkContext, mapText: linkContext.mapText.replace(retainedLine, retainedLine + '\n' + retainedLine) }));
reject('retained map C owner', () => projection.linkedEvidence(target, output,
  { ...linkContext, mapText: linkContext.mapText.replace(retainedLine, retainedLine.replace('objects/assembly/chunk_000.o', 'objects/c/projection_fixture.o')) }));
const wrongLinked = { ...linkedElf, buffer: Buffer.from(linkedElf.buffer) };
const terminal = linkedElf.sections.find(section => section.name === '.ob64.r0005');
wrongLinked.buffer[terminal.offset + terminal.size - 1] = 1;
reject('changed final retained linked byte', () => projection.linkedEvidence(target, output, { ...linkContext, elf: wrongLinked }));

for (const key of ['contract', 'nativeRelocations', 'references', 'retained']) {
  const forged = structuredClone(compiled.objectEvidence); delete forged.auxiliaryProjection[key];
  reject('omitted proof field ' + key, () => tc.validateRecords({ objectEvidence: forged }, { objectEvidence: compiled.objectEvidence }, 'fixture'));
}
const cached = { phase8: { ...phase8, targets: [target] }, target, classification: classified, compiler: local.compiler, verifiedCompiler,
  assembler: { bytes: fs.statSync(tools.assemblerAbs).size, sha256: p7.sha256File(tools.assemblerAbs) },
  objcopy: { bytes: fs.statSync(tools.objcopyAbs).size, sha256: p7.sha256File(tools.objcopyAbs) },
  assemblerPath: tools.assemblerAbs, objcopyPath: tools.objcopyAbs, preprocessor: classifications.preprocessor,
  cacheRoot: path.join(root, 'cache') };
let cacheKey;
for (const expected of ['miss', 'hit']) {
  const out = path.join(root, 'cache-' + expected); fs.mkdirSync(out);
  const result = cache.compileOrReuseTarget({ ...cached, output: out });
  assert.equal(result.cache.status, expected);
  cacheKey = result.cache.key;
}
const metadataFile = path.join(cache.cacheEntryPath(cached.cacheRoot, target, cacheKey), 'metadata.json');
const metadata = JSON.parse(fs.readFileSync(metadataFile));
const validation = { ...cached, keyMaterial: metadata.keyMaterial };
for (const field of ['contract', 'nativeSymbols', 'nativeRelocations', 'retained']) {
  const corrupt = structuredClone(metadata); delete corrupt.compiled.objectEvidence.auxiliaryProjection[field];
  fs.writeFileSync(metadataFile, JSON.stringify(corrupt));
  reject('stale cached projection ' + field, () => cache.validateCacheEntry(validation));
}
fs.writeFileSync(metadataFile, JSON.stringify(metadata));
const saved = fs.readFileSync(files['assembler-object.o']);
try {
  const damaged = Buffer.from(saved); damaged[rodata.offset] ^= 1; fs.writeFileSync(files['assembler-object.o'], damaged);
  reject('raw object tamper independent of reported evidence', () => cache.inspectCompiledTargetArtifacts({ phase8, target, classification: classified, files }));
} finally { fs.writeFileSync(files['assembler-object.o'], saved); }
const report = { sourceClass: classified.class, payloadBytes: projected.evidence.payloadBytes,
  nativeBytes: rodata.size, checkOnlyBytes: projected.evidence.checkOnlyBytes,
  retainedOriginalBytes: target.auxiliaryProjectionRetained.reduce((sum, value) => sum + value.ownerBytes, 0),
  actualRelocations: projected.evidence.nativeRelocations.length, textAnchorReferences: projected.evidence.references,
  rejections: rejected, output: path.relative(ROOT, root).replace(/\\/g, '/') };
fs.writeFileSync(path.join(root, 'report.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
