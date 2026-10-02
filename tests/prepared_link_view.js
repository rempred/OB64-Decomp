#!/usr/bin/env node
'use strict';
const assert = require('assert/strict');
const fs = require('fs');
const path = require('path');
const view = require('../tools/lib/prepared_link_view');
const p7 = require('../tools/lib/phase7_conventional');
const p8 = require('../tools/lib/phase8_matching_c');
// Independent serial reference: retain the old full split/find/forward scan.
function reference(text, name, mode, spaceOnly = false) {
  const lines = text.split(/\r?\n/);
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const start = lines.findIndex(line => spaceOnly ? line.startsWith(name + ' ') : new RegExp('^' + escaped + '\\s').test(line));
  if (start < 0) return null;
  const endPattern = { strict: /^\.ob64\.r\d{4}(?:\.s\d+)?\s/, loose: /^\.ob64\.r\d/, any: /^\S/ }[mode];
  let end = start + 1;
  while (end < lines.length && !endPattern.test(lines[end])) end++;
  return lines.slice(start, end);
}
const map = ['.ob64.r0001\tfirst', '  first-body', '.ob64.r00010 prefix', '  prefix-body',
  '.ob64.r0001 second', '  second-body', '.ob64.r0002.s0 next', '  *fill*',
  '/DISCARD/ 0', '  discarded', '.bss 0 0 0 2**4 alloc', '  from object(.bss)', '.tail end', '  EOF'].join('\r\n');
let equivalences = 0;
for (const text of [map, map.replace(/\r/g, ''), map + '\n', '.ob64.r0001 final']) {
  const prepared = view.prepareMap(text);
  for (const name of ['.ob64.r0001', '.ob64.r00010', '.ob64.r0002.s0', '.missing', '.bss', '/DISCARD/'])
    for (const mode of ['strict', 'loose', 'any']) for (const spaceOnly of [false, true]) {
      assert.deepEqual(view.mapBlock(prepared, name, mode, spaceOnly), reference(text, name, mode, spaceOnly)); equivalences++;
    }
}
assert.throws(() => view.mapBlock(view.prepareMap(map + '\n.bss again'), '.bss', 'any', false, true), /duplicate/);
assert.throws(() => view.mapBlock({}, '.text'), /invalid/);
const block = view.mapBlock(view.prepareMap(map), '.ob64.r0001'); block[0] = 'changed';
assert.equal(view.mapBlock(view.prepareMap(map), '.ob64.r0001')[0], '.ob64.r0001\tfirst');
function owner(index) {
  const sectionName = '.ob64.r' + String(index).padStart(4, '0'), start = index * 16;
  const value = { rowIndex: index, primaryId: 'row' + index, chunkIndex: 0, sectionName, bytes: 16,
    originalAssembly: 'original.s', originalAssemblySha256: 'A'.repeat(64), romStartNumber: start, romEndNumber: start + 16,
    vramStartNumber: start, vramEndNumber: start + 16 };
  value.row = { index, primaryId: value.primaryId, inputKind: 'tracked-assembly', part: { chunkIndex: 0, file: 'original.s', sha256: value.originalAssemblySha256 },
    slices: [{ sectionName, executable: true, romStart: start, romEndExclusive: start + 16, vramStart: start, vramEndExclusive: start + 16, bytes: 16 }] };
  return value;
}
let ownershipCases = 0;
for (const group of [false, true]) {
  const target = { symbol: 'fixture', textOwners: [owner(1), owner(2)], ...(group ? { compilationGroup: { id: 'fixture' } } : {}) };
  const object = group ? 'objects/c/groups/fixture.o' : 'objects/c/fixture.o';
  const text = target.textOwners.map(o => `${o.sectionName} heading\n ${o.sectionName} 10 10 10 2**4 ${object}\n 10 fixture`).join('\n');
  for (const modified of [text, text + '\n' + text, text.replace(object, 'objects/c/wrong.o'), text.replace('.ob64.r0002 heading', '.missing heading'),
    text.replace(' 10 fixture', ' objects/assembly/chunk_000.o\n 10 fixture'), text.replace(' 10 fixture', ' *fill*\n 10 fixture')]) {
    const attempt = input => { try { return { result: p8.verifyTargetMapOwner(target, input) }; } catch (error) { return { error: error.message }; } };
    assert.deepEqual(attempt(view.prepareMap(modified)), attempt(modified)); ownershipCases++;
  }
}
// Minimal valid ELF container, sufficient for preparation identity tests only.
const bytes = Buffer.alloc(93); bytes.write('7f454c46', 0, 'hex'); bytes[4] = 1; bytes[5] = 2;
bytes.writeUInt16BE(1, 16); bytes.writeUInt16BE(8, 18); bytes.writeUInt32BE(52, 32);
bytes.writeUInt16BE(52, 40); bytes.writeUInt16BE(40, 46); bytes.writeUInt16BE(1, 48);
bytes.writeUInt32BE(92, 52 + 16); bytes.writeUInt32BE(1, 52 + 20);
fs.mkdirSync(path.join(p7.ROOT, 'build/tests'), { recursive: true });
const root = fs.mkdtempSync(path.join(p7.ROOT, 'build/tests/prepared-link-'));
const elfFile = path.join(root, 'phase8.elf'), mapFile = path.join(root, 'phase8.map');
const reset = () => { fs.writeFileSync(elfFile, bytes); fs.writeFileSync(mapFile, map); };
reset();
let context = view.linkContext(root, Buffer.alloc(0));
assert.equal(context.elfSha256, p7.sha256Buffer(context.elf.buffer));
assert.throws(() => { context.elf.header.flags = 1; }, TypeError);
view.assertContext(context, root); view.finishLinkContext(context);
assert.throws(() => view.assertContext(context, root), /inactive/);
assert.throws(() => view.finishLinkContext(context), /inactive/);
for (const mutate of [() => fs.appendFileSync(elfFile, 'x'), () => fs.appendFileSync(mapFile, 'x'), () => { context.elf.buffer[36] ^= 1; }]) {
  reset(); context = view.linkContext(root, Buffer.alloc(0)); mutate(); assert.throws(() => view.finishLinkContext(context), /changed/);
}
reset(); const parsed = p7.parseElfFile(elfFile); fs.appendFileSync(elfFile, 'x');
assert.throws(() => view.linkContext(root, Buffer.alloc(0), parsed), /differs/);
reset(); const forged = p7.parseElfFile(elfFile); forged.header.flags ^= 1;
assert.throws(() => view.linkContext(root, Buffer.alloc(0), forged), /metadata differs/);
reset(); const shallow = Object.freeze(p7.parseElfFile(elfFile));
context = view.linkContext(root, Buffer.alloc(0), shallow);
assert(Object.isFrozen(context.elf.header));
assert(Object.isFrozen(context.elf.sections));
assert(Object.isFrozen(context.elf.sections[0]));
assert.throws(() => { context.elf.header.flags ^= 1; }, TypeError);
assert.throws(() => { context.elf.sections[0].size++; }, TypeError);
assert.throws(() => { context.elf.sections.push({}); }, TypeError);
view.finishLinkContext(context);
reset(); context = view.linkContext(root, Buffer.alloc(0));
assert.throws(() => view.assertContext(context, path.join(root, 'wrong')), /foreign/); view.finishLinkContext(context);
console.log(JSON.stringify({ status: 'pass', equivalences, ownershipCases, driftControls: 7, shallowFrozenMetadataControls: 3, output: root }, null, 2));
