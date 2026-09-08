'use strict';
const assert = require('assert');

// Analysis-only ELF32 BE. Only exact accepted byte intervals become PT_LOADs.
function makeElf(symbol, chunks) {
  assert(/^[A-Za-z_][A-Za-z0-9_]*$/.test(symbol));
  assert(chunks.length && chunks[0].executable);
  for (const [i, c] of chunks.entries()) {
    assert(Number.isInteger(c.address) && c.address >= 0 && c.address + c.bytes.length <= 0x100000000);
    assert(c.bytes.length > 0 && c.address % 4 === 0);
    for (const d of chunks.slice(0, i)) assert(c.address + c.bytes.length <= d.address || d.address + d.bytes.length <= c.address, 'overlapping load intervals');
  }
  let data = Buffer.alloc(52 + chunks.length * 32);
  let names = Buffer.from([0]);
  const sections = [Array(10).fill(0)], loads = [];
  const add = (name, type, flags, address, bytes, link = 0, info = 0, alignment = 4, entrySize = 0) => {
    data = Buffer.concat([data, Buffer.alloc((alignment - data.length % alignment) % alignment)]);
    const offset = data.length, nameOffset = names.length;
    data = Buffer.concat([data, bytes]); names = Buffer.concat([names, Buffer.from(name + '\0')]);
    sections.push([nameOffset, type, flags, address, offset, bytes.length, link, info, alignment, entrySize]);
    return offset;
  };
  for (const [i, c] of chunks.entries()) {
    const offset = add(i ? '.rodata' + i : '.text', 1, c.executable ? 6 : 2, c.address, c.bytes);
    loads.push([1, offset, c.address, c.address, c.bytes.length, c.bytes.length, c.executable ? 5 : 4, 4]);
  }
  const strings = sections.length;
  add('.strtab', 3, 0, 0, Buffer.from('\0' + symbol + '\0'), 0, 0, 1);
  const symbols = Buffer.alloc(32);
  symbols.writeUInt32BE(1, 16); symbols.writeUInt32BE(chunks[0].address, 20); symbols.writeUInt32BE(chunks[0].bytes.length, 24);
  symbols[28] = 0x12; symbols.writeUInt16BE(1, 30);
  add('.symtab', 2, 0, 0, symbols, strings, 1, 4, 16);
  const shstr = sections.length;
  add('.shstrtab', 3, 0, 0, Buffer.concat([names, Buffer.from('.shstrtab\0')]), 0, 0, 1);
  data = Buffer.concat([data, Buffer.alloc((4 - data.length % 4) % 4)]);
  const shoff = data.length, sh = Buffer.alloc(sections.length * 40);
  sections.flat().forEach((x, i) => sh.writeUInt32BE(x, i * 4)); data = Buffer.concat([data, sh]);
  Buffer.from('7f454c46010201', 'hex').copy(data);
  [[16, 2], [18, 8], [40, 52], [42, 32], [44, loads.length], [46, 40], [48, sections.length], [50, shstr]].forEach(([o, x]) => data.writeUInt16BE(x, o));
  [[20, 1], [24, chunks[0].address], [28, 52], [32, shoff], [36, 0x20001001]].forEach(([o, x]) => data.writeUInt32BE(x, o));
  loads.flat().forEach((x, i) => data.writeUInt32BE(x, 52 + i * 4));
  validateElf(data, chunks);
  return data;
}

function validateElf(elf, chunks) {
  assert.equal(elf.subarray(0, 7).toString('hex'), '7f454c46010201');
  assert.equal(elf.readUInt16BE(18), 8); assert.equal(elf.readUInt32BE(24), chunks[0].address);
  assert.equal(elf.readUInt16BE(44), chunks.length);
  const start = elf.readUInt32BE(28);
  chunks.forEach((c, i) => {
    const p = start + 32 * i, offset = elf.readUInt32BE(p + 4);
    assert.equal(elf.readUInt32BE(p), 1); assert.equal(elf.readUInt32BE(p + 8), c.address);
    assert.equal(elf.readUInt32BE(p + 16), c.bytes.length); assert.equal(elf.readUInt32BE(p + 20), c.bytes.length);
    assert.equal(elf.readUInt32BE(p + 24), c.executable ? 5 : 4);
    assert.deepEqual(elf.subarray(offset, offset + c.bytes.length), c.bytes);
  });
}
module.exports = { makeElf, validateElf };
