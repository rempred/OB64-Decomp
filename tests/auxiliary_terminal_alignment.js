'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { ROOT, loadAcceptedModel, sha256Buffer: hash, parseElf32BigEndian, elfSectionBytes } = require('../tools/lib/phase7_conventional');
const { assembleWordAsmText } = require('../tools/lib/word_asm');
const { normalizeAuxiliarySectionContracts: normalize, resolveAuxiliarySectionContracts: resolve,
  validateAuxiliaryOwnerGroups } = require('../tools/lib/active_targets');
const { verifyAuxiliarySourceObjectSection: verifySource, selectAuxiliarySourceObjectPrefixes: select,
  verifyAuxiliaryLinkedObjectSection: verifyLinked, adjustSectionAssembly,
  validateSourceObjectProofBytes } = require('../tools/lib/phase8_matching_c');
const hex = n => `0x${n.toString(16).toUpperCase().padStart(8, '0')}`;
const zeroHash = hash(Buffer.alloc(4));

function fixture(model) {
  const row = model.rows[789];
  const rom = Buffer.alloc(0x229DB0);
  const loadRow = owner => assembleWordAsmText(fs.readFileSync(path.join(ROOT, owner.part.file), 'utf8')).bytes.copy(rom, owner.romStart);
  loadRow(row);
  const target = suffix => {
    const owner = model.rows.find(r => r.part && r.part.file.endsWith(suffix));
    const s = owner.slices[0];
    return { symbol: owner.part.name, sectionName: s.sectionName, row: owner,
      bytes: owner.bytes, vramStartNumber: s.vramStart, chunkIndex: owner.part.chunkIndex };
  };
  const retained = (kind, start, end) => ({ inputSection: `.ob64.r0789.${kind}`,
    sectionType: 'SHT_PROGBITS', sectionFlags: ['SHF_ALLOC'], alignment: 1,
    romStart: hex(start), romEndExclusive: hex(end), vramStart: hex(start + 0x8006FC00),
    vramEndExclusive: hex(end + 0x8006FC00), bytes: end - start,
    expectedSha256: hash(rom.subarray(start, end)), ownerOriginalAssembly: row.part.file,
    ownerOriginalAssemblySha256: row.part.sha256 });
  function contract(t, start, entries, label) {
    const end = start + entries * 4, object = Buffer.alloc(entries * 4);
    const expectedRelocations = Array.from({ length: entries }, (_, i) => {
      const addend = rom.readUInt32BE(start + i * 4) - t.vramStartNumber;
      object.writeUInt32BE(addend, i * 4);
      return { offset: hex(i * 4), type: 'R_MIPS_32', symbol: '.text', addend: hex(addend), section: '.rel.rodata' };
    });
    return { kind: 'switch-table', compilerSection: '.rodata', outputSection: '.ob64.r0789',
      sectionType: 'SHT_PROGBITS', sectionFlags: ['SHF_ALLOC'], alignment: 8,
      romStart: hex(start), romEndExclusive: hex(end), vramStart: hex(start + 0x8006FC00),
      vramEndExclusive: hex(end + 0x8006FC00), bytes: object.length, entries,
      expectedObjectSha256: hash(object), expectedLinkedSha256: hash(rom.subarray(start, end)),
      compilerOccurrences: [{ label, offset: hex(0), bytes: object.length, entries, alignment: 8,
        alignmentDirectives: [3, 2], expectedObjectSha256: hash(object), expectedLinkedSha256: hash(rom.subarray(start, end)) }],
      sourceObjectPrefix: { discardedTerminalAlignment: true, sectionType: 'SHT_PROGBITS', sectionFlags: ['SHF_ALLOC'],
        alignment: 8, bytes: object.length + 4, expectedSha256: hash(Buffer.concat([object, Buffer.alloc(4)])),
        prefixOffset: hex(0), prefixBytes: object.length, expectedPrefixSha256: hash(object),
        trailingPaddingOffset: hex(object.length), trailingPaddingBytes: 4, expectedTrailingPaddingSha256: zeroHash },
      preservedTail: null, expectedRelocations };
  }
  const tag = target('/boot_resource_tag_record_decode.s'), op = target('/boot_resource_op_dispatch.s');
  const tagRaw = contract(tag, 0x3E528, 85, '.L144'), opRaw = contract(op, 0x3E6E8, 9, '.L14');
  tagRaw.preservedPrefix = retained('prefix', 0x3DDC0, 0x3E528);
  opRaw.preservedInteriorBefore = { ...retained('interior_0003E67C', 0x3E67C, 0x3E6E8), expectedRelocations: [] };
  opRaw.preservedTail = retained('tail', 0x3E70C, 0x3F1B0);
  const resolveAll = () => {
    tag.auxiliarySections = resolve(model, rom, tag, normalize([tagRaw], tag.symbol, 'terminal alignment tag'));
    op.auxiliarySections = resolve(model, rom, op, normalize([opRaw], op.symbol, 'terminal alignment op'));
    validateAuxiliaryOwnerGroups([tag, op]);
    return [tag, op];
  };
  return { model, rom, row, tag, op, tagRaw, opRaw, resolveAll, loadRow };
}

// A small relocation container fixture, not compiled C or matching evidence.
// It lets unit tests falsify ELF symbols/relocation places/section shape without
// a native tool invocation. Saved real compiler objects are exercised separately.
function objectFixture(target, auxiliary) {
  const data = Buffer.alloc(auxiliary.sourceObjectPrefix.bytes);
  const rel = Buffer.alloc(auxiliary.expectedRelocations.length * 8);
  auxiliary.expectedRelocations.forEach((r, i) => {
    data.writeUInt32BE(Number(r.addend), Number(r.offset));
    rel.writeUInt32BE(Number(r.offset), i * 8); rel.writeUInt32BE(0x102, i * 8 + 4);
  });
  const symbols = Buffer.alloc(48);
  symbols[16 + 12] = 3; symbols.writeUInt16BE(1, 16 + 14);
  symbols[32 + 12] = 3; symbols.writeUInt16BE(2, 32 + 14);
  const names = ['', target.sectionName, auxiliary.outputSection, '.rel' + auxiliary.outputSection, '.symtab', '.strtab', '.shstrtab'];
  const strings = Buffer.from(names.join('\0') + '\0');
  const contents = [Buffer.alloc(0), Buffer.alloc(target.bytes), data, rel, symbols, Buffer.from('\0named\0'), strings];
  const alignment = [0, 4, 8, 4, 4, 1, 1], offsets = [], nameOffsets = [];
  let offset = 52, nameOffset = 0;
  contents.forEach((b, i) => { offset = Math.ceil(offset / (alignment[i] || 1)) * (alignment[i] || 1); offsets.push(offset); offset += b.length; nameOffsets.push(nameOffset); nameOffset += names[i].length + 1; });
  const shoff = Math.ceil(offset / 4) * 4, out = Buffer.alloc(shoff + names.length * 40);
  out.writeUInt32BE(0x7F454C46, 0); out[4] = 1; out[5] = 2; out[6] = 1;
  out.writeUInt16BE(1, 16); out.writeUInt16BE(8, 18); out.writeUInt32BE(1, 20);
  out.writeUInt32BE(shoff, 32); out.writeUInt16BE(52, 40); out.writeUInt16BE(40, 46);
  out.writeUInt16BE(names.length, 48); out.writeUInt16BE(6, 50);
  contents.forEach((b, i) => {
    if (!i) return;
    b.copy(out, offsets[i]); const h = shoff + i * 40;
    const fields = [nameOffsets[i], [0, 1, 1, 9, 2, 3, 3][i], [0, 6, 2, 0, 0, 0, 0][i], 0, offsets[i], b.length,
      i === 3 ? 4 : i === 4 ? 5 : 0, i === 3 ? 2 : i === 4 ? 3 : 0, alignment[i], i === 3 ? 8 : i === 4 ? 16 : 0];
    fields.forEach((v, j) => out.writeUInt32BE(v, h + j * 4));
  });
  return out;
}

function runTests(model = loadAcceptedModel()) {
  const f = fixture(model); f.resolveAll();
  let rejected = 0;
  const rejects = fn => { assert.throws(fn); rejected++; };
  function mutate(object, key, value, validate = f.resolveAll) {
    validate(); const old = object[key], had = Object.prototype.hasOwnProperty.call(object, key); object[key] = value;
    try { rejects(validate); } finally { if (had) object[key] = old; else delete object[key]; }
    validate();
  }
  for (const value of [false, null, 1, 'true']) mutate(f.tagRaw.sourceObjectPrefix, 'discardedTerminalAlignment', value);
  mutate(f.tagRaw.sourceObjectPrefix, 'unexpectedMode', true);
  const mode = f.tagRaw.sourceObjectPrefix.discardedTerminalAlignment;
  delete f.tagRaw.sourceObjectPrefix.discardedTerminalAlignment;
  try { rejects(f.resolveAll); } finally { f.tagRaw.sourceObjectPrefix.discardedTerminalAlignment = mode; }
  f.resolveAll();
  for (const [key, value] of [['alignment', 4], ['prefixBytes', 336], ['bytes', 348], ['trailingPaddingBytes', 8],
    ['expectedPrefixSha256', '0'.repeat(64)], ['expectedSha256', '0'.repeat(64)], ['expectedTrailingPaddingSha256', '0'.repeat(64)]]) {
    mutate(f.tagRaw.sourceObjectPrefix, key, value);
  }
  mutate(f.tagRaw, 'trailingPaddingBytes', 4);
  f.tagRaw.trailingPaddingBytes = 4; f.tagRaw.expectedTrailingPaddingSha256 = zeroHash;
  try { rejects(f.resolveAll); } finally { delete f.tagRaw.trailingPaddingBytes; delete f.tagRaw.expectedTrailingPaddingSha256; }
  f.resolveAll();
  mutate(f.opRaw, 'preservedTail', null);
  mutate(f.opRaw.preservedTail, 'expectedSha256', '0'.repeat(64));
  mutate(f.opRaw.preservedInteriorBefore, 'expectedSha256', '0'.repeat(64));
  mutate(f.opRaw.preservedInteriorBefore, 'romStart', '0x0003E680');
  mutate(f.opRaw.preservedInteriorBefore, 'romStart', '0x0003E678');
  const interior = f.opRaw.preservedInteriorBefore; delete f.opRaw.preservedInteriorBefore;
  try { rejects(f.resolveAll); } finally { f.opRaw.preservedInteriorBefore = interior; }
  f.resolveAll();
  for (const start of [0x3E678, 0x3E680]) {
    f.opRaw.preservedInteriorBefore = { ...interior, romStart: hex(start), vramStart: hex(start + 0x8006FC00),
      inputSection: '.ob64.r0789.interior_' + hex(start).slice(2),
      bytes: 0x3E6E8 - start, expectedSha256: hash(f.rom.subarray(start, 0x3E6E8)) };
    // Independently valid retained interval, rejected by complete-row conservation.
    resolve(model, f.rom, f.op, normalize([f.opRaw], f.op.symbol, 'coherent gap/overlap interval'));
    try { rejects(f.resolveAll); } finally { f.opRaw.preservedInteriorBefore = interior; }
    f.resolveAll();
  }
  // Four original nonzero bytes are legitimate ASM, regardless of equal extent
  // to source padding. This is a shape fixture, not a shortened retail owner.
  const fourByteTail = structuredClone(f.tagRaw);
  fourByteTail.preservedTail = { ...f.opRaw.preservedTail, romStart: '0x0003E67C', romEndExclusive: '0x0003E680',
    vramStart: hex(0x3E67C + 0x8006FC00), vramEndExclusive: hex(0x3E680 + 0x8006FC00),
    bytes: 4, expectedSha256: hash(f.rom.subarray(0x3E67C, 0x3E680)) };
  assert.notStrictEqual(fourByteTail.preservedTail.expectedSha256, zeroHash);
  const four = normalize([fourByteTail], f.tag.symbol, 'independent nonzero four-byte ASM tail')[0];
  verifySource(parseElf32BigEndian(objectFixture(f.tag, four)), f.tag, four, 'independent nonzero four-byte ASM tail');

  for (const target of f.resolveAll()) {
    const auxiliary = target.auxiliarySections[0], input = objectFixture(target, auxiliary);
    const elf = parseElf32BigEndian(input), section = elf.sections.find(s => s.name === auxiliary.outputSection);
    const verify = () => verifySource(elf, target, auxiliary, 'terminal alignment fixture');
    const evidence = verify();
    assert.strictEqual(evidence.sourceObjectPrefix.discardedTerminalAlignment, true);
    assert.strictEqual(evidence.sourceObjectPrefix.trailingPaddingBytes, 4);
    const selected = select(input, target);
    const linked = verifyLinked(parseElf32BigEndian(selected.buffer), target, auxiliary, 'selected fixture');
    assert.strictEqual(linked.bytes.length, auxiliary.bytes);
    assert.deepStrictEqual(linked.relocations, evidence.relocations);
    assert.strictEqual(selected.selections[0].sourceObjectPrefix.discardedTerminalAlignment, true);
    const project = require('../tools/lib/diff_object_cache').projectTargetContract;
    const cacheTarget = { ...target, source: 'src/fixture.c', sourceSha256: 'A'.repeat(64) };
    const fullCache = JSON.stringify(project(cacheTarget));
    delete auxiliary.sourceObjectPrefix.discardedTerminalAlignment;
    assert.notStrictEqual(JSON.stringify(project(cacheTarget)), fullCache, 'cache key omitted discard mode');
    auxiliary.sourceObjectPrefix.discardedTerminalAlignment = true;
    // Minimal proof-schema fixture: fresh native/link evidence is verified above;
    // this specifically falsifies mode metadata loss during report serialization.
    const proof = { schemaVersion: 4, kind: 'ob64-source-to-object-load-evidence', textContract: {},
      objectEvidence: {}, linkEvidence: {}, target: { compilationInput: {}, dependencies: [], ownerSections: [] },
      toolchain: { preprocessor: {} }, artifacts: { compilationInput: {} },
      assemblyContract: { compilerAssemblyRewritten: false, classifiedBytesAreCompilerInput: true,
        auxiliarySectionCount: 1, sourceObjectPrefixSelections: 1, relocatableContainerSplit: false,
        splitInstructionBytesRewritten: false },
      finalObject: { textOwners: [], auxiliarySections: [{ objectBytes: auxiliary.bytes,
        objectSha256: auxiliary.expectedObjectSha256, sourceObjectPrefix: evidence.sourceObjectPrefix,
        linkedObjectSection: { bytes: auxiliary.bytes, sha256: auxiliary.expectedObjectSha256 } }] },
      finalTarget: { textOwners: [], auxiliarySections: [] } };
    const proofBytes = Buffer.from(JSON.stringify(proof));
    validateSourceObjectProofBytes(proofBytes, proofBytes);
    const modeEvidence = proof.finalObject.auxiliarySections[0].sourceObjectPrefix;
    delete modeEvidence.discardedTerminalAlignment;
    rejects(() => validateSourceObjectProofBytes(Buffer.from(JSON.stringify(proof)), proofBytes));
    modeEvidence.discardedTerminalAlignment = false;
    rejects(() => { const bytes = Buffer.from(JSON.stringify(proof)); validateSourceObjectProofBytes(bytes, bytes); });
    modeEvidence.discardedTerminalAlignment = true;
    proof.finalObject.auxiliarySections[0].sourceObjectPrefix = JSON.parse(proofBytes).finalObject.auxiliarySections[0].sourceObjectPrefix;
    validateSourceObjectProofBytes(Buffer.from(JSON.stringify(proof)), proofBytes);
    mutate(auxiliary.sourceObjectPrefix, 'discardedTerminalAlignment', false, verify);
    mutate(auxiliary.sourceObjectPrefix, 'bytes', auxiliary.sourceObjectPrefix.bytes + 4, verify);
    mutate(auxiliary.sourceObjectPrefix, 'trailingPaddingBytes', 8, verify);
    mutate(auxiliary.sourceObjectPrefix, 'expectedPrefixSha256', '0'.repeat(64), verify);
    mutate(auxiliary.sourceObjectPrefix, 'expectedSha256', '0'.repeat(64), verify);
    const oversized = structuredClone(auxiliary);
    oversized.sourceObjectPrefix.trailingPaddingBytes = 12;
    oversized.sourceObjectPrefix.bytes = oversized.bytes + 12;
    oversized.sourceObjectPrefix.expectedTrailingPaddingSha256 = hash(Buffer.alloc(12));
    const oversizedObject = objectFixture(target, oversized), oversizedElf = parseElf32BigEndian(oversizedObject);
    oversized.sourceObjectPrefix.expectedSha256 = hash(elfSectionBytes(oversizedElf,
      oversizedElf.sections.find(s => s.name === oversized.outputSection)));
    rejects(() => verifySource(oversizedElf, target, oversized, 'coherently extended zero tail'));
    mutate(section, 'alignment', 4, verify);
    mutate(section, 'flags', 3, verify);
    mutate(section, 'link', 1, verify);
    mutate(section, 'info', 1, verify);
    mutate(section, 'entrySize', 4, verify);
    const padOffset = section.offset + auxiliary.bytes, oldByte = elf.buffer[padOffset];
    elf.buffer[padOffset] = 1;
    const oldFull = auxiliary.sourceObjectPrefix.expectedSha256, oldPad = auxiliary.sourceObjectPrefix.expectedTrailingPaddingSha256;
    auxiliary.sourceObjectPrefix.expectedSha256 = hash(elfSectionBytes(elf, section));
    auxiliary.sourceObjectPrefix.expectedTrailingPaddingSha256 = hash(elf.buffer.subarray(padOffset, padOffset + 4));
    try { rejects(verify); } finally { elf.buffer[padOffset] = oldByte; auxiliary.sourceObjectPrefix.expectedSha256 = oldFull; auxiliary.sourceObjectPrefix.expectedTrailingPaddingSha256 = oldPad; }
    verify();
    elf.symbols.push({ name: 'hidden_data', sectionIndex: section.index, value: auxiliary.bytes, size: 4 });
    try { rejects(verify); } finally { elf.symbols.pop(); }
    elf.symbols.push({ name: 'overlapping_data', sectionIndex: section.index, value: auxiliary.bytes - 4, size: 8 });
    try { rejects(verify); } finally { elf.symbols.pop(); }
    const namedObject = Buffer.from(input), symtab = elf.sections.find(s => s.name === '.symtab');
    namedObject.writeUInt32BE(1, symtab.offset + 32);
    namedObject.writeUInt32BE(auxiliary.bytes, symtab.offset + 36);
    namedObject.writeUInt32BE(4, symtab.offset + 40);
    namedObject[symtab.offset + 44] = 1;
    rejects(() => select(namedObject, target));
    elf.sections.push({ name: '.rela.extra', type: 4, info: section.index, size: 12 });
    try { rejects(verify); } finally { elf.sections.pop(); }
    const rel = elf.sections.find(s => s.name === '.rel' + auxiliary.outputSection), offset = elf.buffer.readUInt32BE(rel.offset);
    elf.buffer.writeUInt32BE(auxiliary.bytes, rel.offset);
    try { rejects(verify); } finally { elf.buffer.writeUInt32BE(offset, rel.offset); }
    verify();
    const occurrence = auxiliary.compilerOccurrences[0];
    const assembly = `\t.text\n\t.section\t.rodata\n\t.align\t3\n\t.align\t2\n${occurrence.label}:\n`
      + Array.from({ length: auxiliary.entries }, () => '\t.word\t.L100\n').join('') + '\t.text\n';
    const grammar = text => adjustSectionAssembly(Buffer.from(text), target.sectionName, { auxiliarySections: [auxiliary] });
    grammar(assembly);
    for (const suffix of ['\t.word\t0\n', 'hidden_data:\n', '\t.space\t4\n', '\t.align\t3\n']) {
      rejects(() => grammar(assembly.replace(/\t.text\n$/, suffix + '\t.text\n')));
    }
  }
  const legacyRaw = JSON.parse(fs.readFileSync(path.join(ROOT, 'config/matching-c-linkage.json'))).targets
    .find(t => t.symbol === 'func_0021B894').auxiliarySections[0];
  assert.ok(!Object.prototype.hasOwnProperty.call(legacyRaw.sourceObjectPrefix, 'discardedTerminalAlignment'));
  const legacyRow = model.rows.find(r => r.part && r.part.name === 'func_0021B894');
  const legacy = { symbol: 'func_0021B894', bytes: legacyRow.bytes, row: legacyRow,
    sectionName: legacyRow.slices[0].sectionName, vramStartNumber: legacyRow.slices[0].vramStart };
  f.loadRow(model.rows.find(r => r.slices.some(s => s.sectionName === legacyRaw.outputSection)));
  legacy.auxiliarySections = resolve(model, f.rom, legacy, normalize([legacyRaw], legacy.symbol, 'unchanged legacy B894'));
  const legacyAux = legacy.auxiliarySections[0];
  const legacyEvidence = verifySource(parseElf32BigEndian(objectFixture(legacy, legacyAux)), legacy, legacyAux, 'legacy B894');
  assert.strictEqual(legacyEvidence.sourceObjectPrefix.prefixBytes, 44);
  assert.strictEqual(legacyEvidence.sourceObjectPrefix.trailingPaddingBytes, 4);
  assert.ok(!Object.prototype.hasOwnProperty.call(legacyEvidence.sourceObjectPrefix, 'discardedTerminalAlignment'));
  mutate(legacyAux, 'ownerTailBytes', 8, () => verifySource(parseElf32BigEndian(objectFixture(legacy, legacyAux)), legacy, legacyAux, 'legacy tail remains coupled'));
  return { discardedAlignmentNegativeControls: rejected, retailCoverage: [1896, 340, 108, 36, 2724], legacyB894Unchanged: true };
}

if (require.main === module) console.log(JSON.stringify(runTests()));
module.exports = { runTests, fixture, objectFixture };
