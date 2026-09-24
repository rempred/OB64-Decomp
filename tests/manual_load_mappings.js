'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const fixtures = require('./fixtures/manual-load-mappings.json');
const { ROOT, loadAcceptedModel } = require('../tools/lib/phase7_conventional');

// These are direct retail instruction/table witnesses, independent of the
// configured slab geometry. No speculative control-flow propagation is used.
function readImmediatePair(rom, address, register) {
  const upper = rom.readUInt32BE(address);
  const lower = rom.readUInt32BE(address + 4);
  assert.strictEqual(upper >>> 16, 0x3C00 | register, 'loader LUI provenance drift');
  assert.strictEqual(lower >>> 16, 0x2400 | (register << 5) | register, 'loader ADDIU provenance drift');
  return (((upper & 0xFFFF) << 16) + ((lower << 16) >> 16)) >>> 0;
}

function assertWords(rom, start, words, label) {
  words.forEach((word, index) => assert.strictEqual(rom.readUInt32BE(start + index * 4), word, `${label} instruction drift`));
}

function verifyCompletedMappings(model, rom) {
  assert.strictEqual(fixtures.length, 23, 'manual-load evidence census drift');
  const expected = fixtures.map(record => ({
    id: record.id, kind: 'loader-dma',
    romStart: Number(record.romStart), romEndExclusive: Number(record.romEndExclusive),
    vramStart: Number(record.vramStart),
    vramEndExclusive: Number(record.vramStart) + Number(record.romEndExclusive) - Number(record.romStart),
    executableRanges: [], nonExecutableRanges: [],
  }));
  assert.deepStrictEqual(model.nonDescriptorLoadSlabs.slice(6), expected, 'completed manual-load slab geometry drift');

  // The table base is in accepted descriptor18. The loader uses byte index*40,
  // reads destination+0 and ROM endpoints+8/+12, and subtracts in the call slot.
  const tableSlice = model.slices.filter(slice => slice.overlayDescriptorId === 18
    && slice.romStart <= 0x1C2ECC && slice.romEndExclusive >= 0x1C2F44);
  assert.strictEqual(tableSlice.length, 1, 'table placement must be unique');
  assert.strictEqual(tableSlice[0].vramStart + 0x1C2ECC - tableSlice[0].romStart, 0x80229DBC, 'table runtime address drift');
  assertWords(rom, 0x1BAED0, [0x3C038019, 0x906336E0, 0x00031080, 0x00431021, 0x000210C0,
    0x3C038023, 0x24639DBC, 0x00438021, 0x8E030000], 'table index');
  assertWords(rom, 0x1BAF2C, [0x8E040008, 0x8E06000C, 0x8E050000, 0x0C027694, 0x00C43023], 'table loader');

  for (const [index, record] of fixtures.entries()) {
    const mapping = expected[index];
    let start, end, destination;
    if (record.callRom) {
      const call = Number(record.callRom);
      start = readImmediatePair(rom, call - 24, 4);
      destination = readImmediatePair(rom, call - 16, 5);
      end = readImmediatePair(rom, call - 8, 6);
      assertWords(rom, call, [0x0C027694, 0x00C43023], record.id);
    } else {
      const table = Number(record.tableRom);
      assert.ok([0x1C2EF4, 0x1C2F1C].includes(table), 'unreviewed descriptor row');
      destination = rom.readUInt32BE(table);
      start = rom.readUInt32BE(table + 8);
      end = rom.readUInt32BE(table + 12);
    }
    assert.deepStrictEqual([start, end, destination], [mapping.romStart, mapping.romEndExclusive, mapping.vramStart],
      `retail loader operands disagree: ${record.id}`);
    assert.strictEqual((end - start) % 2, 0, 'raw DMA even-length rounding changes the transfer');
    const inside = model.slices.filter(slice => slice.romStart >= start && slice.romEndExclusive <= end);
    let cursor = start;
    for (const slice of inside) {
      assert.strictEqual(slice.romStart, cursor, `gap in slab ${record.id}`);
      assert.strictEqual(slice.loadSlabId, record.id, `slab ownership drift: ${record.id}`);
      assert.strictEqual(slice.vramStart, destination + slice.romStart - start, `slice VMA drift: ${record.id}`);
      assert.strictEqual(slice.vramEndExclusive, destination + slice.romEndExclusive - start, `slice end drift: ${record.id}`);
      cursor = slice.romEndExclusive;
    }
    assert.strictEqual(cursor, end, `incomplete slab ${record.id}`);
    for (const slice of model.slices.filter(slice => slice.loadSlabId === record.id)) {
      assert.ok(slice.romStart >= start && slice.romEndExclusive <= end, `slice escaped loader endpoints: ${record.id}`);
    }
  }

  const newIds = new Set(expected.map(slab => slab.id));
  const executable = model.slices.filter(slice => newIds.has(slice.loadSlabId) && slice.executable);
  assert.strictEqual(executable.length, 864, 'executable-slice conservation drift');
  assert.strictEqual(executable.reduce((sum, slice) => sum + slice.bytes, 0), 570736, 'executable-byte conservation drift');
  assert.strictEqual(model.slices.filter(slice => slice.executable && slice.placementKind === 'rom-only').length, 0,
    'executable owner still lacks qualified placement');
  const crossing = model.rows[3413];
  assert.deepStrictEqual([crossing.romStart, crossing.romEndExclusive], [0x1C904C, 0x1C9074], 'physical owner changed');
  assert.deepStrictEqual(crossing.slices.map(s => [s.romStart, s.romEndExclusive, s.vramStart, s.executable]), [
    [0x1C904C, 0x1C9050, 0x8023058C, true], [0x1C9050, 0x1C9074, 0x8022A840, true],
  ], 'cross-load owner must retain two placements and its execution flags');
  const dataTail = model.rows[5621];
  assert.strictEqual(dataTail.part.name, 'data_002B89C0');
  assert.strictEqual(dataTail.slices.length, 2, 'last load must stop inside the preserved data owner');
  assert.strictEqual(dataTail.slices[0].romEndExclusive, 0x2B8BA0);
  assert.strictEqual(dataTail.slices[1].romStart, 0x2B8BA0);
  assert.strictEqual(dataTail.slices[1].placementKind, 'rom-only');
  return { mappings: 23, newlyPlacedExecutableBytes: 570736, remainingUnplacedExecutableSlices: 0 };
}

function runMutations(model, rom) {
  let rejected = 0;
  function badModel(change) { const altered = structuredClone(model); change(altered);
    assert.throws(() => verifyCompletedMappings(altered, rom)); rejected++; }
  badModel(m => { m.nonDescriptorLoadSlabs[6].vramStart += 4; m.nonDescriptorLoadSlabs[6].vramEndExclusive += 4; });
  badModel(m => { m.nonDescriptorLoadSlabs[6].romEndExclusive -= 4; m.nonDescriptorLoadSlabs[6].vramEndExclusive -= 4; });
  badModel(m => m.nonDescriptorLoadSlabs.pop());
  badModel(m => { m.rows[3413].slices[0].executable = false; });
  badModel(m => { m.slices.find(s => s.loadSlabId === fixtures[0].id).vramStart += 4; });
  for (const address of [Number(fixtures[0].callRom) - 20, 0x1C2EFC, 0x1BAF30]) {
    const altered = Buffer.from(rom); altered[address + 3] ^= 4;
    assert.throws(() => verifyCompletedMappings(model, altered)); rejected++;
  }
  return rejected;
}

if (require.main === module) {
  const model = loadAcceptedModel();
  const rom = fs.readFileSync(path.join(ROOT, 'build/baserom.us_rev0.z64'));
  const result = verifyCompletedMappings(model, rom);
  console.log(JSON.stringify({ ...result, negativeControls: runMutations(model, rom) }));
}
module.exports = { verifyCompletedMappings, runMutations };
