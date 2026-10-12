'use strict';
const assert = require('assert/strict');
const p7 = require('../tools/lib/phase7_conventional');

const CASES = [
  { row: 2381, start: 0x127154, end: 0x127830, tail: 0x127828, vma: 0x801D2A14,
    id: 'func-00127154-retained-tail', entry: 0x27BDFFC8, delay: 0x27BD0038, next: 0x27BDFF78,
    bodyHash: '01C1F9CEE66366B5AEAB6555B426A8746958E8C678CB2B2766112ABD5BCC6CD6',
    ownerHash: '2C3EA363DFD5037F1063FE41E336AE426B908A128219E3F5E064A1F3CE90A247' },
  { row: 2317, start: 0x119454, end: 0x11A540, tail: 0x11A538, vma: 0x801C4D14,
    id: 'func-00119454-retained-tail', entry: 0x27BDFFB0, delay: 0x27BD0050, next: 0x27BDFFC8,
    bodyHash: '56D90B69CBEE9E68A4B9E9BCDB7D8EBD509F89650AADB9267DFB940CFAF23B8E',
    ownerHash: 'A5DCBA64F8708B23FD6A527E159EB818AEE5570C7CE95093778F60DF90708324' },
];
function directTarget(word, pc) {
  const op = word >>> 26, rs = (word >>> 21) & 31, rt = (word >>> 16) & 31;
  if (op === 1 && ![0, 1, 2, 3, 16, 17, 18, 19].includes(rt)) {
    assert.ok([8, 9, 10, 11, 12, 14].includes(rt), 'Q7 reserved REGIMM');
    return null;
  }
  if ([16, 17, 18].includes(op) && rs === 8) {
    assert.ok(rt <= 3, 'Q7 reserved coprocessor selector');
    return (pc + 4 + ((word << 16) >> 16) * 4) >>> 0;
  }
  if ([6, 7, 22, 23].includes(op)) assert.equal(rt, 0, 'Q7 reserved integer selector');
  assert.notEqual(op, 19, 'Q7 reserved opcode');
  if ([2, 3].includes(op)) return (((pc + 4) & 0xF0000000) | ((word & 0x03FFFFFF) << 2)) >>> 0;
  if ([1, 4, 5, 6, 7, 20, 21, 22, 23].includes(op)) return (pc + 4 + ((word << 16) >> 16) * 4) >>> 0;
  return null;
}
function boundary(model, bytes, c) {
  const row = model.rows[c.row], body = c.tail - c.start, tailVma = c.vma + body;
  assert.deepEqual([row.romStart, row.romEndExclusive, row.bytes, model.rows[c.row + 1].romStart],
    [c.start, c.end, body + 8, c.end], 'Q7 original owner/successor drift');
  const fields = ['sectionName', 'romStart', 'romEndExclusive', 'vramStart', 'vramEndExclusive',
    'bytes', 'executable', 'nonExecutableRangeId', 'overlayDescriptorId', 'overlaySection'];
  assert.deepEqual(row.slices.map(s => fields.map(k => s[k])), [
    [`.ob64.r${c.row}.s0`, c.start, c.tail, c.vma, tailVma, body, true, null, 7, 'text'],
    [`.ob64.r${c.row}.s1`, c.tail, c.end, tailVma, tailVma + 8, 8, false, c.id, 7, 'text'],
  ], 'Q7 slice contract drift');
  assert.deepEqual([c.start, c.tail - 8, c.tail - 4, c.tail, c.tail + 4, c.end].map(a => bytes.readUInt32BE(a)),
    [c.entry, 0x03E00008, c.delay, 0, 0, c.next], 'Q7 entry/return/delay/tails/successor drift');
  assert.equal(p7.sha256Buffer(bytes.subarray(c.start, c.tail)), c.bodyHash, 'Q7 body hash drift');
  assert.equal(p7.sha256Buffer(bytes.subarray(c.start, c.end)), c.ownerHash, 'Q7 owner hash drift');
}
function scan(model, bytes) {
  const d = model.overlays.find(d => d.descriptor_id === 7);
  assert.deepEqual([d.rom_start, d.text_rom_end_exclusive, d.vram_start],
    [0x101CE0, 0x13C4A0, 0x801AD5A0], 'Q7 descriptor mapping drift');
  const tails = CASES.flatMap(c => [c.vma + c.tail - c.start, c.vma + c.tail - c.start + 4]);
  const counts = { words: 0, direct: 0, indirect: 0 };
  // No executable-slice filter: sources inside either retained tail are scanned.
  for (let a = d.rom_start; a < d.text_rom_end_exclusive; a += 4) {
    const w = bytes.readUInt32BE(a), target = directTarget(w, d.vram_start + a - d.rom_start);
    counts.words++;
    if (target !== null) counts.direct++;
    if (w >>> 26 === 0 && [8, 9].includes(w & 63)) counts.indirect++;
    assert.ok(!tails.includes(target), 'Q7 direct edge enters retained tail');
  }
  return counts;
}
function pointers(bytes) {
  const tails = new Set(CASES.flatMap(c => [c.vma + c.tail - c.start, c.vma + c.tail - c.start + 4]));
  for (let a = 0; a < bytes.length; a += 4) assert.ok(!tails.has(bytes.readUInt32BE(a)), 'Q7 aligned pointer enters retained tail');
}
function runTests(model, rom, elfBytes) {
  const results = [];
  function reject(name, pattern, fn) {
    assert.throws(fn, pattern, name);
    results.push({ name, status: 'rejected' });
  }
  CASES.forEach(c => boundary(model, rom, c));
  for (const c of CASES) {
    const index = model.config.fixedOverlayNonExecutableRanges.findIndex(r => r.id === c.id);
    assert.ok(index >= 0);
    for (const [label, mutate, pattern] of [
      ['misalignment', r => { r.romStart++; }, /aligned integer/],
      ['wrong descriptor', r => { r.overlayDescriptorId = 10; }, /outside its descriptor/],
      ['duplicate ID', r => { r.id = model.config.fixedOverlayNonExecutableRanges[0].id; }, /ID is invalid or repeated/],
    ]) {
      const config = { ...model.config, fixedOverlayNonExecutableRanges: model.config.fixedOverlayNonExecutableRanges.map(r => ({ ...r })) };
      mutate(config.fixedOverlayNonExecutableRanges[index]);
      reject(`Q7 range ${c.row} ${label}`, pattern, () => p7.validateFixedOverlayNonExecutableRanges(config, model.overlays));
    }
    const config = { ...model.config, expected: { ...model.config.expected, fixedOverlayNonExecutableRanges: 5 },
      fixedOverlayNonExecutableRanges: [...model.config.fixedOverlayNonExecutableRanges, { ...model.config.fixedOverlayNonExecutableRanges[index], id: c.id + '-overlap', romStart: c.tail + 4 }] };
    reject(`Q7 range ${c.row} overlap`, /ranges overlap/, () => p7.validateFixedOverlayNonExecutableRanges(config, model.overlays));
  }
  assert.deepEqual(scan(model, rom), { words: 59888, direct: 8048, indirect: 357 });
  pointers(rom);
  for (const c of CASES) {
    for (const a of [c.start, c.tail - 8, c.tail - 4, c.tail, c.tail + 4, c.end]) {
      const changed = Buffer.from(rom); changed[a] ^= 1;
      reject(`Q7 boundary word ${a.toString(16)}`, /Q7 entry\/return\/delay\/tails\/successor drift/, () => boundary(model, changed, c));
    }
    for (const offset of [0, 4]) {
      const v = c.vma + c.tail - c.start + offset;
      const forms = [
        ...[4, 5, 6, 7, 20, 21, 22, 23].map(op => op * 0x4000000),
        ...[0, 1, 2, 3, 16, 17, 18, 19].map(rt => 0x04000000 + rt * 0x10000),
        ...[16, 17, 18].flatMap(op => [0, 1, 2, 3].map(rt => op * 0x4000000 + 8 * 0x200000 + rt * 0x10000)),
        ...[2, 3].map(op => op * 0x4000000 + ((v >>> 2) & 0x03FFFFFF)),
      ];
      assert.equal(forms.length, 30);
      forms.forEach(w => assert.equal(directTarget(w, v - 4), v));
      for (const source of [c.start, ...CASES.map(other => other.tail)]) {
        const changed = Buffer.from(rom); changed.writeUInt32BE((0x08000000 | ((v >>> 2) & 0x03FFFFFF)) >>> 0, source);
        reject(`Q7 raw edge ${source.toString(16)} to ${v.toString(16)}`, /Q7 direct edge enters retained tail/, () => scan(model, changed));
      }
      const changed = Buffer.from(rom); changed.writeUInt32BE(v, 0);
      reject(`Q7 pointer ${v.toString(16)}`, /Q7 aligned pointer enters retained tail/, () => pointers(changed));
    }
    for (const [field, value] of [['romStart', c.tail + 4], ['romStart', c.tail - 4], ['romEndExclusive', c.end + 4],
      ['nonExecutableRangeId', 'wrong-range'], ['overlayDescriptorId', 10], ['vramStart', c.tail], ['executable', true]]) {
      const changed = { ...model, rows: model.rows.slice() };
      changed.rows[c.row] = { ...model.rows[c.row], slices: model.rows[c.row].slices.map(s => ({ ...s })) };
      changed.rows[c.row].slices[1][field] = value;
      reject(`Q7 slice ${field}`, /Q7 slice contract drift/, () => boundary(changed, rom, c));
    }
    const successor = { ...model, rows: model.rows.slice() };
    successor.rows[c.row + 1] = { ...model.rows[c.row + 1], romStart: c.end + 4 };
    reject('Q7 successor boundary', /Q7 original owner\/successor drift/, () => boundary(successor, rom, c));
  }
  reject('Q7 reserved REGIMM', /reserved REGIMM/, () => directTarget(0x04040000, 0x80000000));
  reject('Q7 reserved COP selector', /reserved coprocessor/, () => directTarget(0x41040000, 0x80000000));
  assert.equal(directTarget(0x04080000, 0x80000000), null);
  assert.equal(directTarget(0x1000FFFF, 0x80001000), 0x80001000);
  assert.equal(directTarget(0x08000000, 0x8FFFFFFC), 0x90000000);
  if (elfBytes) {
    const elf = p7.parseElf32BigEndian(elfBytes);
    for (const c of CASES) {
      const s = elf.sections.find(s => s.name === `.ob64.r${c.row}.s1`);
      assert.ok(s); assert.equal(s.flags, 2); assert.equal(s.size, 8);
      assert.equal(p7.sha256Buffer(p7.elfSectionBytes(elf, s)), 'AF5570F5A1810B7AF78CAF4BC70A660F0DF51E42BAF91D4DE5B2328DE0E83DFC');
      for (const [field, value, pattern] of [[8, 6, /execution flag/], [12, s.address + 4, /VRAM placement/], [20, 12, /section size/]]) {
        const changed = Buffer.from(elfBytes); changed.writeUInt32BE(value, s.headerOffset + field);
        reject(`Q7 ELF ${c.row}/${field}`, pattern, () => p7.verifyElfAgainstModel(model, p7.parseElf32BigEndian(changed)));
      }
      const headers = elf.programHeaders.filter(h => h.type === 1 && h.vaddr === s.address && h.paddr === c.tail && h.fileSize === 8);
      assert.equal(headers.length, 1); assert.equal(headers[0].flags, 4);
      for (const [field, value, pattern] of [[24, 5, /execution flag/], [12, c.tail + 4, /load address/]]) {
        const changed = Buffer.from(elfBytes); changed.writeUInt32BE(value, elf.header.phoff + headers[0].index * elf.header.phentsize + field);
        reject(`Q7 LOAD ${c.row}/${field}`, pattern, () => p7.verifyElfAgainstModel(model, p7.parseElf32BigEndian(changed)));
      }
    }
  }
  return results;
}
module.exports = { CASES, runTests };
