#!/usr/bin/env node
'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const {
  fail,
  loadAcceptedModel,
  parseElf32BigEndian,
  renderLinkerScript,
  sha256Buffer,
  validateFixedOverlayNonExecutableRanges,
  validateNonDescriptorLoadSlabs,
  verifyElfAgainstModel,
  verifyMap,
  verifyRom,
} = require('../tools/lib/phase7_conventional');

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

function slabFixture(slabs, expectedCount = slabs.length) {
  return {
    rom: { bytes: 0x10000 },
    expected: { nonDescriptorLoadSlabs: expectedCount },
    nonDescriptorLoadSlabs: slabs,
  };
}

function validTestSlab(overrides = {}) {
  return {
    id: 'test-slab',
    kind: 'loader-dma',
    romStart: 0x1000,
    romEndExclusive: 0x1100,
    vramStart: 0x80100000,
    vramEndExclusive: 0x80100100,
    ...overrides,
  };
}

function overlayRangeFixture(ranges, expectedCount = ranges.length) {
  return {
    rom: { bytes: 0x10000 },
    expected: { fixedOverlayNonExecutableRanges: expectedCount },
    fixedOverlayNonExecutableRanges: ranges,
  };
}

function validTestOverlay(overrides = {}) {
  return {
    descriptor_id: 3,
    rom_start: 0x2000,
    rom_end_exclusive: 0x2200,
    text_rom_end_exclusive: 0x2180,
    data_rodata_rom_start: 0x2180,
    data_rodata_rom_end_exclusive: 0x2200,
    ...overrides,
  };
}

function validOverlayNonExecutableRange(overrides = {}) {
  return {
    id: 'overlay-padding-range',
    overlayDescriptorId: 3,
    overlaySection: 'text',
    romStart: 0x2100,
    romEndExclusive: 0x2110,
    ...overrides,
  };
}

function rangesIntersect(startA, endA, startB, endB) {
  return startA < endB && endA > startB;
}

function directControlTarget(word, pc) {
  const opcode = word >>> 26;
  if (opcode === 2 || opcode === 3) {
    return (((pc + 4) & 0xF0000000) | ((word & 0x03FFFFFF) << 2)) >>> 0;
  }
  if (opcode === 1 || (opcode >= 4 && opcode <= 7) || (opcode >= 20 && opcode <= 23)
      || (opcode === 17 && ((word >>> 21) & 0x1F) === 8)) {
    return (pc + 4 + ((word << 16) >> 16) * 4) >>> 0;
  }
  return null;
}

function main() {
  const output = value('--output');
  const model = loadAcceptedModel();
  const elfBytes = fs.readFileSync(path.join(output, 'phase7.elf'));
  const romBytes = fs.readFileSync(path.join(output, 'phase7.us_rev0.z64'));
  const mapText = fs.readFileSync(path.join(output, 'phase7.map'), 'utf8');
  const baselineElf = parseElf32BigEndian(elfBytes);
  verifyElfAgainstModel(model, baselineElf);
  verifyRom(model, romBytes);
  verifyMap(model, mapText);

  const results = [];
  assert.strictEqual(model.counts.nonDescriptorLoadSlabs, 5, 'accepted load-slab count drift');
  assert.strictEqual(model.counts.fixedOverlayNonExecutableRanges, 1, 'accepted fixed-overlay non-executable-range count drift');
  assert.strictEqual(model.slices.length, 7254, 'accepted link-slice count drift');
  assert.strictEqual(model.counts.splitOwners, 12, 'accepted split-owner count drift');
  assert.strictEqual(model.overlays.length, 19, 'fixed-descriptor count drift');
  assert.deepStrictEqual(model.fixedOverlayNonExecutableRanges, [{
    id: 'func-002013d0-alignment-padding',
    overlayDescriptorId: 10,
    overlaySection: 'text',
    romStart: 0x00201424,
    romEndExclusive: 0x00201430,
  }], 'accepted fixed-overlay non-executable-range record drift');
  assert.deepStrictEqual(model.nonDescriptorLoadSlabs, [{
    id: 'scenario-loader-00195410',
    kind: 'loader-dma',
    romStart: 0x00195410,
    romEndExclusive: 0x001977E0,
    vramStart: 0x80214F80,
    vramEndExclusive: 0x80217350,
    executableRanges: [],
    nonExecutableRanges: [],
  }, {
    id: 'cold-boot-loader-00040e80',
    kind: 'loader-dma',
    romStart: 0x00040E80,
    romEndExclusive: 0x00066E10,
    vramStart: 0x8016AF80,
    vramEndExclusive: 0x80190F10,
    executableRanges: [{
      id: 'cold-boot-entry-stubs-00040e80',
      romStart: 0x00040E80,
      romEndExclusive: 0x00040E90,
    }],
    nonExecutableRanges: [],
  }, {
    id: 'loader-dma-00087200',
    kind: 'loader-dma',
    romStart: 0x00087200,
    romEndExclusive: 0x000DDF60,
    vramStart: 0x8019A7A0,
    vramEndExclusive: 0x801F1500,
    executableRanges: [],
    nonExecutableRanges: [],
  }, {
    id: 'loader-dma-0029a4c0',
    kind: 'loader-dma',
    romStart: 0x0029A4C0,
    romEndExclusive: 0x002A8D20,
    vramStart: 0x8022AC90,
    vramEndExclusive: 0x802394F0,
    executableRanges: [],
    nonExecutableRanges: [],
  }, {
    id: 'resource-loader-00213b10',
    kind: 'loader-dma',
    romStart: 0x00213B10,
    romEndExclusive: 0x0022A280,
    vramStart: 0x801D0840,
    vramEndExclusive: 0x801E6FB0,
    executableRanges: [],
    nonExecutableRanges: [{
      id: 'func-0021c8dc-alignment-padding',
      romStart: 0x0021C968,
      romEndExclusive: 0x0021C970,
    }],
  }], 'accepted load-slab record drift');

  const actionStreamSlab = model.nonDescriptorLoadSlabs.find((slab) => slab.id === 'resource-loader-00213b10');
  assert.ok(actionStreamSlab, 'action-stream resource load slab is missing');
  assert.strictEqual(actionStreamSlab.romEndExclusive - actionStreamSlab.romStart, 0x16770, 'action-stream slab ROM length drift');
  assert.strictEqual(actionStreamSlab.vramEndExclusive - actionStreamSlab.vramStart, 0x16770, 'action-stream slab VRAM length drift');
  assert.strictEqual(actionStreamSlab.vramStart - actionStreamSlab.romStart, 0x7FFBCD30, 'action-stream slab start delta drift');
  assert.strictEqual(actionStreamSlab.vramEndExclusive - actionStreamSlab.romEndExclusive, 0x7FFBCD30, 'action-stream slab end delta drift');
  const actionStreamRows = model.rows.filter((row) => (
    row.romStart < actionStreamSlab.romEndExclusive
    && row.romEndExclusive > actionStreamSlab.romStart
  ));
  assert.strictEqual(actionStreamRows.length, 178, 'action-stream slab owner count drift');
  assert.strictEqual(actionStreamRows[0].index, 3988, 'action-stream slab first owner drift');
  assert.strictEqual(actionStreamRows[0].romStart, actionStreamSlab.romStart, 'action-stream slab first boundary drift');
  assert.strictEqual(actionStreamRows.at(-1).index, 4165, 'action-stream slab final owner drift');
  assert.strictEqual(actionStreamRows.at(-1).romEndExclusive, actionStreamSlab.romEndExclusive, 'action-stream slab final boundary drift');
  for (const row of actionStreamRows) {
    for (const slice of row.slices) {
      assert.strictEqual(slice.placementKind, 'non-descriptor-load-slab', `action-stream slab placement drift: ${slice.sectionName}`);
      assert.strictEqual(slice.loadSlabId, actionStreamSlab.id, `action-stream slab identity drift: ${slice.sectionName}`);
      assert.strictEqual(slice.overlayDescriptorId, null, `fixed descriptor leaked into action-stream slab: ${slice.sectionName}`);
      assert.strictEqual(slice.vramStart, slice.romStart + 0x7FFBCD30, `action-stream slab VMA start drift: ${slice.sectionName}`);
      assert.strictEqual(slice.vramEndExclusive, slice.romEndExclusive + 0x7FFBCD30, `action-stream slab VMA end drift: ${slice.sectionName}`);
    }
  }
  for (const rowIndex of [3987, 4166]) {
    const row = model.rows[rowIndex];
    assert.ok(row && row.slices.every((slice) => slice.loadSlabId !== actionStreamSlab.id), `p${rowIndex} crossed an action-stream slab endpoint`);
  }

  const actionStreamLoaderWords = new Map([
    [0x0004E62C, 0x3C04801D], [0x0004E630, 0x24840840],
    [0x0004E634, 0x3C05801E], [0x0004E638, 0x24A55AA0],
    [0x0004E644, 0x3C04801E], [0x0004E648, 0x24845AA0],
    [0x0004E64C, 0x3C05801E], [0x0004E650, 0x24A56FB0],
    [0x0004E65C, 0x3C040021], [0x0004E660, 0x24843B10],
    [0x0004E664, 0x3C05801D], [0x0004E668, 0x24A50840],
    [0x0004E66C, 0x3C060023], [0x0004E670, 0x24C6A280],
    [0x0004E674, 0x0C027694], [0x0004E678, 0x00C43023],
    [0x0004E6CC, 0x3C040023], [0x0004E6D0, 0x2484A280],
    [0x0004E6D4, 0x3C05801E], [0x0004E6D8, 0x24A56FB0],
  ]);
  for (const [romAddress, word] of actionStreamLoaderWords) {
    assert.strictEqual(romBytes.readUInt32BE(romAddress), word, `action-stream loader operand drift at 0x${romAddress.toString(16)}`);
  }

  const wave1Targets = [
    { rowIndex: 4034, romStart: 0x0021C970, romEndExclusive: 0x0021CA18, vramStart: 0x801D96A0, vramEndExclusive: 0x801D9748 },
    { rowIndex: 4036, romStart: 0x0021CA88, romEndExclusive: 0x0021CB30, vramStart: 0x801D97B8, vramEndExclusive: 0x801D9860 },
    { rowIndex: 4038, romStart: 0x0021CBC4, romEndExclusive: 0x0021D1CC, vramStart: 0x801D98F4, vramEndExclusive: 0x801D9EFC },
    { rowIndex: 4047, romStart: 0x0021D374, romEndExclusive: 0x0021D3BC, vramStart: 0x801DA0A4, vramEndExclusive: 0x801DA0EC },
    { rowIndex: 4048, romStart: 0x0021D3BC, romEndExclusive: 0x0021D450, vramStart: 0x801DA0EC, vramEndExclusive: 0x801DA180 },
    { rowIndex: 4158, romStart: 0x00229DF0, romEndExclusive: 0x00229EF8, vramStart: 0x801E6B20, vramEndExclusive: 0x801E6C28 },
  ];
  for (const expected of wave1Targets) {
    const row = model.rows[expected.rowIndex];
    assert.ok(row, `Wave 1 structural owner is missing: p${expected.rowIndex}`);
    assert.strictEqual(row.romStart, expected.romStart, `Wave 1 owner ROM start drift: p${expected.rowIndex}`);
    assert.strictEqual(row.romEndExclusive, expected.romEndExclusive, `Wave 1 owner ROM end drift: p${expected.rowIndex}`);
    assert.strictEqual(row.slices[0].vramStart, expected.vramStart, `Wave 1 owner VMA start drift: p${expected.rowIndex}`);
    assert.strictEqual(row.slices.at(-1).vramEndExclusive, expected.vramEndExclusive, `Wave 1 owner VMA end drift: p${expected.rowIndex}`);
    assert.ok(row.slices.every((slice) => slice.loadSlabId === actionStreamSlab.id), `Wave 1 owner slab drift: p${expected.rowIndex}`);
  }

  const wrapperOwner = model.rows[3758];
  assert.deepStrictEqual(wrapperOwner.slices.map((slice) => ({
    sectionName: slice.sectionName,
    romStart: slice.romStart,
    romEndExclusive: slice.romEndExclusive,
    vramStart: slice.vramStart,
    vramEndExclusive: slice.vramEndExclusive,
    placementKind: slice.placementKind,
    overlayDescriptorId: slice.overlayDescriptorId,
    overlaySection: slice.overlaySection,
    executable: slice.executable,
    nonExecutableRangeId: slice.nonExecutableRangeId,
  })), [{
    sectionName: '.ob64.r3758.s0',
    romStart: 0x002013D0,
    romEndExclusive: 0x00201424,
    vramStart: 0x801BDF40,
    vramEndExclusive: 0x801BDF94,
    placementKind: 'overlay',
    overlayDescriptorId: 10,
    overlaySection: 'text',
    executable: true,
    nonExecutableRangeId: null,
  }, {
    sectionName: '.ob64.r3758.s1',
    romStart: 0x00201424,
    romEndExclusive: 0x00201430,
    vramStart: 0x801BDF94,
    vramEndExclusive: 0x801BDFA0,
    placementKind: 'overlay',
    overlayDescriptorId: 10,
    overlaySection: 'text',
    executable: false,
    nonExecutableRangeId: 'func-002013d0-alignment-padding',
  }], 'func_002013D0 function/padding slice contract drift');
  assert.strictEqual(wrapperOwner.slices[0].bytes + wrapperOwner.slices[1].bytes, wrapperOwner.bytes,
    'func_002013D0 split-row byte conservation drift');
  assert.strictEqual(wrapperOwner.slices[0].romEndExclusive, wrapperOwner.slices[1].romStart,
    'func_002013D0 split-row ROM gap or overlap');
  assert.strictEqual(wrapperOwner.slices[0].vramEndExclusive, wrapperOwner.slices[1].vramStart,
    'func_002013D0 split-row VMA gap or overlap');
  assert.strictEqual(model.rows[3759].romStart, 0x00201430, 'func_002013D0 successor boundary drift');
  assert.deepStrictEqual([
    romBytes.readUInt32BE(0x0020141C),
    romBytes.readUInt32BE(0x00201420),
    romBytes.readUInt32BE(0x00201424),
    romBytes.readUInt32BE(0x00201428),
    romBytes.readUInt32BE(0x0020142C),
  ], [0x03E00008, 0x27BD0018, 0x00000000, 0x00000000, 0x00000000],
  'func_002013D0 return, delay slot, or alignment-padding evidence drift');
  assert.strictEqual(
    sha256Buffer(romBytes.subarray(0x002013D0, 0x00201424)),
    '18ACA89C612392942718624B1792D58238FAB2AC1FE6F3F95D6777D6AF2E11B1',
    'func_002013D0 executable-body hash drift',
  );
  assert.strictEqual(
    sha256Buffer(romBytes.subarray(0x00201424, 0x00201430)),
    '15EC7BF0B50732B49F8228E07D24365338F9E3AB994B00AF08E5A3BFFE55FD8B',
    'func_002013D0 alignment-padding hash drift',
  );
  const wrapperCallRom = 0x00200170;
  const wrapperCallSlice = model.slices.find((slice) => (
    slice.executable && wrapperCallRom >= slice.romStart && wrapperCallRom < slice.romEndExclusive
  ));
  assert.ok(wrapperCallSlice && wrapperCallSlice.overlayDescriptorId === 10,
    'func_002013D0 accepted call-site placement drift');
  const wrapperCallPc = wrapperCallSlice.vramStart + (wrapperCallRom - wrapperCallSlice.romStart);
  assert.strictEqual(romBytes.readUInt32BE(wrapperCallRom), 0x0C06F7D0,
    'func_002013D0 accepted call instruction drift');
  assert.strictEqual(directControlTarget(romBytes.readUInt32BE(wrapperCallRom), wrapperCallPc),
    wrapperOwner.slices[0].vramStart, 'func_002013D0 accepted entry target drift');
  const wrapperPaddingTargets = [];
  for (const slice of model.slices.filter((candidate) => (
    candidate.executable && candidate.overlayDescriptorId === 10 && candidate.overlaySection === 'text'
  ))) {
    for (let romAddress = slice.romStart; romAddress < slice.romEndExclusive; romAddress += 4) {
      const pc = slice.vramStart + (romAddress - slice.romStart);
      const target = directControlTarget(romBytes.readUInt32BE(romAddress), pc);
      if (target !== null && target >= wrapperOwner.slices[1].vramStart
          && target < wrapperOwner.slices[1].vramEndExclusive) {
        wrapperPaddingTargets.push(romAddress);
      }
    }
  }
  assert.deepStrictEqual(wrapperPaddingTargets, [],
    'accepted descriptor-10 direct control flow enters func_002013D0 alignment padding');

  const comparatorOwner = model.rows[4033];
  assert.deepStrictEqual(comparatorOwner.slices.map((slice) => ({
    sectionName: slice.sectionName,
    romStart: slice.romStart,
    romEndExclusive: slice.romEndExclusive,
    vramStart: slice.vramStart,
    vramEndExclusive: slice.vramEndExclusive,
    executable: slice.executable,
    nonExecutableRangeId: slice.nonExecutableRangeId,
  })), [{
    sectionName: '.ob64.r4033.s0',
    romStart: 0x0021C8DC,
    romEndExclusive: 0x0021C968,
    vramStart: 0x801D960C,
    vramEndExclusive: 0x801D9698,
    executable: true,
    nonExecutableRangeId: null,
  }, {
    sectionName: '.ob64.r4033.s1',
    romStart: 0x0021C968,
    romEndExclusive: 0x0021C970,
    vramStart: 0x801D9698,
    vramEndExclusive: 0x801D96A0,
    executable: false,
    nonExecutableRangeId: 'func-0021c8dc-alignment-padding',
  }], 'func_0021C8DC function/padding slice contract drift');
  assert.deepStrictEqual([
    romBytes.readUInt32BE(0x0021C960),
    romBytes.readUInt32BE(0x0021C964),
    romBytes.readUInt32BE(0x0021C968),
    romBytes.readUInt32BE(0x0021C96C),
  ], [0x03E00008, 0x00000000, 0x00000000, 0x00000000], 'func_0021C8DC return or alignment-padding evidence drift');
  assert.strictEqual(
    sha256Buffer(romBytes.subarray(0x0021C968, 0x0021C970)),
    'AF5570F5A1810B7AF78CAF4BC70A660F0DF51E42BAF91D4DE5B2328DE0E83DFC',
    'func_0021C8DC alignment-padding hash drift',
  );
  const comparatorPaddingTargets = [];
  for (const slice of model.slices.filter((candidate) => (
    candidate.executable && candidate.loadSlabId === actionStreamSlab.id
  ))) {
    for (let romAddress = slice.romStart; romAddress < slice.romEndExclusive; romAddress += 4) {
      const pc = slice.vramStart + (romAddress - slice.romStart);
      const target = directControlTarget(romBytes.readUInt32BE(romAddress), pc);
      if (target !== null && target >= 0x801D9698 && target < 0x801D96A0) comparatorPaddingTargets.push(romAddress);
    }
  }
  assert.deepStrictEqual(comparatorPaddingTargets, [], 'direct control flow enters func_0021C8DC alignment padding');

  const directJumpEncodings = (target) => [
    0x08000000 | ((target >>> 2) & 0x03FFFFFF),
    0x0C000000 | ((target >>> 2) & 0x03FFFFFF),
  ];
  const executableWordHits = (words) => model.slices.filter((slice) => slice.executable).flatMap((slice) => {
    const hits = [];
    for (let romAddress = slice.romStart; romAddress < slice.romEndExclusive; romAddress += 4) {
      if (words.includes(romBytes.readUInt32BE(romAddress))) hits.push(romAddress);
    }
    return hits;
  });
  assert.deepStrictEqual(executableWordHits(directJumpEncodings(0x801DA0A4)), [], 'func_0021D374 has an unexpected direct J/JAL entry');
  assert.deepStrictEqual(executableWordHits(directJumpEncodings(0x801DA0EC)), [0x0021D39C], 'func_0021D3BC shared-tail entry census drift');
  assert.deepStrictEqual(executableWordHits(directJumpEncodings(0x801DA108)), [0x0021D3A8, 0x0021D3B4], 'func_0021D3BC internal-entry census drift');
  assert.strictEqual(romBytes.readUInt32BE(0x0021D384), 0x90680011, 'func_0021D374 $t0 definition drift');
  assert.strictEqual(romBytes.readUInt32BE(0x0021D444), 0x00681821, 'func_0021D3BC $t0 consumption drift');

  assert.deepStrictEqual([
    romBytes.readUInt32BE(0x0021CE00),
    romBytes.readUInt32BE(0x0021CE04),
    romBytes.readUInt32BE(0x0021CE08),
  ], [0x3C01801E, 0x00220821, 0x8C226B20], 'func_0021CBC4 switch-table address materialization drift');
  const actionTable = romBytes.subarray(0x00229DF0, 0x00229EF8);
  assert.strictEqual(actionTable.length, 0x108, 'func_0021CBC4 switch-table owner size drift');
  assert.strictEqual(actionTable.readUInt32BE(0x104), 0, 'func_0021CBC4 switch-table padding drift');
  for (let offset = 0; offset < 0x104; offset += 4) {
    const entry = actionTable.readUInt32BE(offset);
    assert.ok(entry >= 0x801D98F4 && entry < 0x801D9EFC && entry % 4 === 0,
      `func_0021CBC4 switch-table entry escaped its accepted text owner at +0x${offset.toString(16)}`);
  }
  assert.strictEqual(sha256Buffer(actionTable), 'D88942BC72126CDB2EAC36D63BCF8B262C671FFFA53ADD17DEBAC7BB6A02D112',
    'func_0021CBC4 switch-table linked-byte identity drift');

  const coldBootSlab = model.nonDescriptorLoadSlabs.find((slab) => slab.id === 'cold-boot-loader-00040e80');
  assert.ok(coldBootSlab, 'cold-boot load slab is missing');
  assert.strictEqual(coldBootSlab.romEndExclusive - coldBootSlab.romStart, 0x25F90, 'cold-boot ROM length drift');
  assert.strictEqual(coldBootSlab.vramEndExclusive - coldBootSlab.vramStart, 0x25F90, 'cold-boot VRAM length drift');
  assert.strictEqual(coldBootSlab.vramStart - coldBootSlab.romStart, 0x8012A100, 'cold-boot start delta drift');
  assert.strictEqual(coldBootSlab.vramEndExclusive - coldBootSlab.romEndExclusive, 0x8012A100, 'cold-boot end delta drift');

  const runtimeSlab = model.nonDescriptorLoadSlabs.find((slab) => slab.id === 'loader-dma-00087200');
  assert.ok(runtimeSlab, 'runtime load slab is missing');
  assert.strictEqual(runtimeSlab.romEndExclusive - runtimeSlab.romStart, 0x56D60, 'runtime-slab ROM length drift');
  assert.strictEqual(runtimeSlab.vramEndExclusive - runtimeSlab.vramStart, 0x56D60, 'runtime-slab VRAM length drift');
  assert.strictEqual(runtimeSlab.vramStart - runtimeSlab.romStart, 0x801135A0, 'runtime-slab start delta drift');
  assert.strictEqual(runtimeSlab.vramEndExclusive - runtimeSlab.romEndExclusive, 0x801135A0, 'runtime-slab end delta drift');

  const runtimeSlabRows = model.rows.filter((row) => (
    row.romStart < runtimeSlab.romEndExclusive
    && row.romEndExclusive > runtimeSlab.romStart
  ));
  assert.strictEqual(runtimeSlabRows.length, 435, 'runtime-slab owner count drift');
  assert.strictEqual(runtimeSlabRows[0].index, 1503, 'runtime-slab first owner drift');
  assert.strictEqual(runtimeSlabRows[0].romStart, runtimeSlab.romStart, 'runtime-slab first boundary drift');
  assert.strictEqual(runtimeSlabRows.at(-1).index, 1937, 'runtime-slab final owner drift');
  assert.strictEqual(runtimeSlabRows.at(-1).romEndExclusive, runtimeSlab.romEndExclusive, 'runtime-slab final boundary drift');
  for (const row of runtimeSlabRows) {
    assert.strictEqual(row.slices.length, 1, `runtime-slab owner was unexpectedly split: p${row.index}`);
    const [slice] = row.slices;
    assert.strictEqual(slice.placementKind, 'non-descriptor-load-slab', `runtime-slab placement drift: p${row.index}`);
    assert.strictEqual(slice.loadSlabId, 'loader-dma-00087200', `runtime-slab identity drift: p${row.index}`);
    assert.strictEqual(slice.vramStart, slice.romStart + 0x801135A0, `runtime-slab VMA start drift: p${row.index}`);
    assert.strictEqual(slice.vramEndExclusive, slice.romEndExclusive + 0x801135A0, `runtime-slab VMA end drift: p${row.index}`);
  }
  for (const rowIndex of [1502, 1938]) {
    const row = model.rows[rowIndex];
    assert.ok(row && row.slices.every((slice) => slice.loadSlabId !== 'loader-dma-00087200'), `p${rowIndex} crossed a runtime-slab endpoint`);
  }

  const cutsceneSlab = model.nonDescriptorLoadSlabs.find((slab) => slab.id === 'loader-dma-0029a4c0');
  assert.ok(cutsceneSlab, 'cutscene load slab is missing');
  assert.strictEqual(cutsceneSlab.romEndExclusive - cutsceneSlab.romStart, 0xE860, 'cutscene-slab ROM length drift');
  assert.strictEqual(cutsceneSlab.vramEndExclusive - cutsceneSlab.vramStart, 0xE860, 'cutscene-slab VRAM length drift');
  assert.strictEqual(cutsceneSlab.vramStart - cutsceneSlab.romStart, 0x7FF907D0, 'cutscene-slab start delta drift');
  assert.strictEqual(cutsceneSlab.vramEndExclusive - cutsceneSlab.romEndExclusive, 0x7FF907D0, 'cutscene-slab end delta drift');

  const cutsceneSlabRows = model.rows.filter((row) => (
    row.romStart < cutsceneSlab.romEndExclusive
    && row.romEndExclusive > cutsceneSlab.romStart
  ));
  assert.strictEqual(cutsceneSlabRows.length, 163, 'cutscene-slab owner count drift');
  assert.strictEqual(cutsceneSlabRows[0].index, 5293, 'cutscene-slab first owner drift');
  assert.strictEqual(cutsceneSlabRows[0].romStart, cutsceneSlab.romStart, 'cutscene-slab first boundary drift');
  assert.strictEqual(cutsceneSlabRows.at(-1).index, 5455, 'cutscene-slab final owner drift');
  assert.strictEqual(cutsceneSlabRows.at(-1).romEndExclusive, cutsceneSlab.romEndExclusive, 'cutscene-slab final boundary drift');
  for (const row of cutsceneSlabRows) {
    assert.strictEqual(row.slices.length, 1, `cutscene-slab owner was unexpectedly split: p${row.index}`);
    const [slice] = row.slices;
    assert.strictEqual(slice.placementKind, 'non-descriptor-load-slab', `cutscene-slab placement drift: p${row.index}`);
    assert.strictEqual(slice.loadSlabId, cutsceneSlab.id, `cutscene-slab identity drift: p${row.index}`);
    assert.strictEqual(slice.overlayDescriptorId, null, `fixed descriptor leaked into cutscene-slab owner p${row.index}`);
    assert.strictEqual(slice.vramStart, slice.romStart + 0x7FF907D0, `cutscene-slab VMA start drift: p${row.index}`);
    assert.strictEqual(slice.vramEndExclusive, slice.romEndExclusive + 0x7FF907D0, `cutscene-slab VMA end drift: p${row.index}`);
  }
  for (const rowIndex of [5292, 5456]) {
    const row = model.rows[rowIndex];
    assert.ok(row && row.slices.every((slice) => slice.loadSlabId !== cutsceneSlab.id), `p${rowIndex} crossed a cutscene-slab endpoint`);
  }

  const cutsceneTargets = [
    { rowIndex: 5359, romStart: 0x002A05EC, romEndExclusive: 0x002A0680, vramStart: 0x80230DBC, vramEndExclusive: 0x80230E50 },
    { rowIndex: 5371, romStart: 0x002A13EC, romEndExclusive: 0x002A1484, vramStart: 0x80231BBC, vramEndExclusive: 0x80231C54 },
    { rowIndex: 5397, romStart: 0x002A3198, romEndExclusive: 0x002A3310, vramStart: 0x80233968, vramEndExclusive: 0x80233AE0 },
    { rowIndex: 5364, romStart: 0x002A0B14, romEndExclusive: 0x002A0E2C, vramStart: 0x802312E4, vramEndExclusive: 0x802315FC },
    { rowIndex: 5366, romStart: 0x002A0EF0, romEndExclusive: 0x002A1000, vramStart: 0x802316C0, vramEndExclusive: 0x802317D0 },
    { rowIndex: 5367, romStart: 0x002A1000, romEndExclusive: 0x002A135C, vramStart: 0x802317D0, vramEndExclusive: 0x80231B2C },
  ];
  for (const expected of cutsceneTargets) {
    const row = model.rows[expected.rowIndex];
    assert.ok(row, `cutscene target owner is missing: p${expected.rowIndex}`);
    assert.strictEqual(row.romStart, expected.romStart, `cutscene target ROM start drift: p${expected.rowIndex}`);
    assert.strictEqual(row.romEndExclusive, expected.romEndExclusive, `cutscene target ROM end drift: p${expected.rowIndex}`);
    assert.strictEqual(row.slices.length, 1, `cutscene target owner slice drift: p${expected.rowIndex}`);
    assert.strictEqual(row.slices[0].vramStart, expected.vramStart, `cutscene target VMA start drift: p${expected.rowIndex}`);
    assert.strictEqual(row.slices[0].vramEndExclusive, expected.vramEndExclusive, `cutscene target VMA end drift: p${expected.rowIndex}`);
    assert.strictEqual(row.slices[0].loadSlabId, cutsceneSlab.id, `cutscene target slab drift: p${expected.rowIndex}`);
  }

  const cutsceneLoaderWords = new Map([
    [0x00282868, 0x3C048023], [0x0028286C, 0x2484AC90],
    [0x00282880, 0x3C048024], [0x00282884, 0x24848A90],
    [0x00282888, 0x3C058024], [0x0028288C, 0x24A594F0],
    [0x00282898, 0x3C04002A], [0x0028289C, 0x2484A4C0],
    [0x002828A0, 0x3C058023], [0x002828A4, 0x24A5AC90],
    [0x002828A8, 0x3C06002B], [0x002828AC, 0x24C68D20],
    [0x002828B0, 0x0C027694], [0x002828B4, 0x00C43023],
    [0x002828B8, 0x3C048024], [0x002828BC, 0x248494F0],
    [0x002828C0, 0x3C058024], [0x002828C4, 0x24A595C0],
  ]);
  for (const [romAddress, word] of cutsceneLoaderWords) {
    assert.strictEqual(romBytes.readUInt32BE(romAddress), word, `cutscene loader operand drift at 0x${romAddress.toString(16)}`);
  }

  const localJumpChecks = [
    { romAddress: 0x002A060C, expectedWord: 0x0808C37A, targetRom: 0x002A0618 },
    { romAddress: 0x002A1458, expectedWord: 0x0808C713, targetRom: 0x002A147C },
    { romAddress: 0x002A31E4, expectedWord: 0x0808CE70, targetRom: 0x002A31F0 },
    { romAddress: 0x002A323C, expectedWord: 0x0808CEA3, targetRom: 0x002A32BC },
    { romAddress: 0x002A324C, expectedWord: 0x0808CEA3, targetRom: 0x002A32BC },
    { romAddress: 0x002A3260, expectedWord: 0x0808CEA3, targetRom: 0x002A32BC },
    { romAddress: 0x002A3284, expectedWord: 0x0808CEA3, targetRom: 0x002A32BC },
    { romAddress: 0x002A32BC, expectedWord: 0x0808CEAE, targetRom: 0x002A32E8 },
  ];
  for (const expected of localJumpChecks) {
    const word = romBytes.readUInt32BE(expected.romAddress);
    assert.strictEqual(word, expected.expectedWord, `cutscene local-jump word drift at 0x${expected.romAddress.toString(16)}`);
    const livePc = expected.romAddress + 0x7FF907D0;
    const liveTarget = (((livePc + 4) & 0xF0000000) | ((word & 0x03FFFFFF) << 2)) >>> 0;
    assert.strictEqual(liveTarget, expected.targetRom + 0x7FF907D0, `cutscene local jump disagrees with slab VMA at 0x${expected.romAddress.toString(16)}`);
  }

  const poseLookupOwner = model.rows[5397];
  const poseLookupSuccessor = model.rows[5398];
  assert.strictEqual(poseLookupOwner.bytes, 376, 'func_002a3198 accepted owner length drift');
  assert.strictEqual(poseLookupOwner.romEndExclusive, 0x002A3310, 'func_002a3198 accepted owner end drift');
  assert.strictEqual(poseLookupSuccessor.romStart, 0x002A3310, 'func_002a3198 successor boundary drift');
  assert.deepStrictEqual([
    romBytes.readUInt32BE(0x002A3300),
    romBytes.readUInt32BE(0x002A3304),
    romBytes.readUInt32BE(0x002A3308),
    romBytes.readUInt32BE(0x002A330C),
  ], [0x03E00008, 0x27BD0030, 0x00000000, 0x00000000], 'func_002a3198 return or trailing-zero evidence drift');
  const poseLookupPaddingStart = 0x80233AD8;
  const poseLookupPaddingEnd = 0x80233AE0;
  for (let romAddress = poseLookupOwner.romStart; romAddress < 0x002A3308; romAddress += 4) {
    const word = romBytes.readUInt32BE(romAddress);
    const opcode = word >>> 26;
    const livePc = romAddress + 0x7FF907D0;
    let directTarget = null;
    if (opcode === 2 || opcode === 3) {
      directTarget = (((livePc + 4) & 0xF0000000) | ((word & 0x03FFFFFF) << 2)) >>> 0;
    } else if (opcode === 1 || (opcode >= 4 && opcode <= 7) || (opcode >= 20 && opcode <= 23)
        || (opcode === 17 && ((word >>> 21) & 0x1F) === 8)) {
      const immediate = (word << 16) >> 16;
      directTarget = (livePc + 4 + immediate * 4) >>> 0;
    }
    assert.ok(directTarget === null || directTarget < poseLookupPaddingStart || directTarget >= poseLookupPaddingEnd,
      `func_002a3198 direct control flow enters trailing zero words at 0x${romAddress.toString(16)}`);
  }

  const affectedRuntimeOwners = [
    { rowIndex: 1745, romStart: 0x000BBD50, vramStart: 0x801CF2F0 },
    { rowIndex: 1746, romStart: 0x000BBD80, vramStart: 0x801CF320 },
    { rowIndex: 1752, romStart: 0x000BC684, vramStart: 0x801CFC24 },
    { rowIndex: 1767, romStart: 0x000BD26C, vramStart: 0x801D080C },
  ];
  for (const expected of affectedRuntimeOwners) {
    const row = model.rows[expected.rowIndex];
    assert.ok(row, `affected runtime owner is missing: p${expected.rowIndex}`);
    assert.strictEqual(row.romStart, expected.romStart, `affected runtime owner ROM drift: p${expected.rowIndex}`);
    assert.strictEqual(row.slices.length, 1, `affected runtime owner slice drift: p${expected.rowIndex}`);
    assert.strictEqual(row.slices[0].vramStart, expected.vramStart, `affected runtime owner VMA drift: p${expected.rowIndex}`);
    assert.strictEqual(row.slices[0].loadSlabId, 'loader-dma-00087200', `affected runtime owner slab drift: p${expected.rowIndex}`);
  }

  const localJumpWord = romBytes.readUInt32BE(0x000BD2D0);
  assert.strictEqual(localJumpWord, 0x0807421F, 'func_000BD26C retail local-jump word drift');
  const localJumpTarget = 0x80000000 | ((localJumpWord & 0x03FFFFFF) << 2);
  assert.strictEqual(localJumpTarget >>> 0, 0x801D087C, 'func_000BD26C retail local-jump target drift');
  assert.strictEqual(localJumpTarget >>> 0, runtimeSlab.vramStart + (0x000BD2DC - runtimeSlab.romStart), 'func_000BD26C local jump does not agree with the runtime slab');

  for (let leftIndex = 0; leftIndex < model.nonDescriptorLoadSlabs.length; leftIndex += 1) {
    const left = model.nonDescriptorLoadSlabs[leftIndex];
    for (let rightIndex = leftIndex + 1; rightIndex < model.nonDescriptorLoadSlabs.length; rightIndex += 1) {
      const right = model.nonDescriptorLoadSlabs[rightIndex];
      assert.ok(!rangesIntersect(left.romStart, left.romEndExclusive, right.romStart, right.romEndExclusive), `load-slab ROM overlap: ${left.id}, ${right.id}`);
    }
    for (const overlay of model.overlays) {
      assert.ok(!rangesIntersect(left.romStart, left.romEndExclusive, overlay.rom_start, overlay.rom_end_exclusive), `load slab overlaps descriptor ROM source: ${left.id}, ${overlay.descriptor_id}`);
      if (left.id === 'cold-boot-loader-00040e80') {
        assert.ok(!rangesIntersect(left.vramStart, left.vramEndExclusive, overlay.vram_start, overlay.vram_end_exclusive), `cold-boot load slab overlaps descriptor runtime reservation: ${overlay.descriptor_id}`);
      }
    }
  }

  const expectedOwners = [
    { rowIndex: 3062, romStart: 0x00195410, romEndExclusive: 0x0019554C, vramStart: 0x80214F80, vramEndExclusive: 0x802150BC, primaryClass: 'code', executable: true },
    { rowIndex: 3063, romStart: 0x0019554C, romEndExclusive: 0x001957D0, vramStart: 0x802150BC, vramEndExclusive: 0x80215340, primaryClass: 'code', executable: true },
    { rowIndex: 3064, romStart: 0x001957D0, romEndExclusive: 0x00195D9C, vramStart: 0x80215340, vramEndExclusive: 0x8021590C, primaryClass: 'code', executable: true },
    { rowIndex: 3065, romStart: 0x00195D9C, romEndExclusive: 0x001960A8, vramStart: 0x8021590C, vramEndExclusive: 0x80215C18, primaryClass: 'code', executable: true },
    { rowIndex: 3066, romStart: 0x001960A8, romEndExclusive: 0x00197738, vramStart: 0x80215C18, vramEndExclusive: 0x802172A8, primaryClass: 'code', executable: true },
    { rowIndex: 3067, romStart: 0x00197738, romEndExclusive: 0x001977E0, vramStart: 0x802172A8, vramEndExclusive: 0x80217350, primaryClass: 'data', executable: false },
  ];
  for (const expected of expectedOwners) {
    const row = model.rows[expected.rowIndex];
    assert.ok(row, `accepted slab owner is missing: p${expected.rowIndex}`);
    assert.strictEqual(row.slices.length, 1, `accepted slab owner was unexpectedly split: p${expected.rowIndex}`);
    assert.strictEqual(row.primaryClass, expected.primaryClass, `primary class drift: p${expected.rowIndex}`);
    const slice = row.slices[0];
    assert.strictEqual(slice.sectionName, `.ob64.r${expected.rowIndex}`, `section name drift: p${expected.rowIndex}`);
    for (const field of ['romStart', 'romEndExclusive', 'vramStart', 'vramEndExclusive', 'executable']) {
      assert.strictEqual(slice[field], expected[field], `${field} drift: p${expected.rowIndex}`);
    }
    assert.strictEqual(slice.placementKind, 'non-descriptor-load-slab', `placement kind drift: p${expected.rowIndex}`);
    assert.strictEqual(slice.loadSlabId, 'scenario-loader-00195410', `load-slab ID drift: p${expected.rowIndex}`);
    assert.strictEqual(slice.overlayDescriptorId, null, `fixed-overlay identity leaked into p${expected.rowIndex}`);

    const loadHeaderForSlice = baselineElf.programHeaders.filter((candidate) => (
      candidate.type === 1
      && candidate.vaddr === expected.vramStart
      && candidate.paddr === expected.romStart
      && candidate.fileSize === expected.romEndExclusive - expected.romStart
      && candidate.memorySize === expected.romEndExclusive - expected.romStart
    ));
    assert.strictEqual(loadHeaderForSlice.length, 1, `VMA/LMA load header drift: p${expected.rowIndex}`);
  }
  assert.strictEqual(expectedOwners.reduce((sum, owner) => sum + owner.romEndExclusive - owner.romStart, 0), 0x23D0, 'load-slab owner coverage drift');
  for (const rowIndex of [3061, 3068]) {
    const row = model.rows[rowIndex];
    assert.ok(row && row.slices.every((slice) => slice.loadSlabId === null && slice.placementKind !== 'non-descriptor-load-slab'), `p${rowIndex} entered the load slab`);
  }

  const p0810 = model.rows[810];
  assert.strictEqual(p0810.primaryId, 'primary:4b3693504d495f021786', 'p0810 accepted primary owner drift');
  assert.strictEqual(p0810.romStart, 0x00040638, 'p0810 owner start drift');
  assert.strictEqual(p0810.romEndExclusive, 0x00040E90, 'p0810 owner end drift');
  assert.strictEqual(p0810.primaryClass, 'data', 'p0810 source classification drift');
  assert.strictEqual(p0810.inputKind, 'tracked-assembly', 'p0810 source ownership kind drift');
  assert.strictEqual(p0810.part.name, 'data_00040638', 'p0810 assembly owner drift');
  assert.strictEqual(p0810.slices.length, 2, 'p0810 placement slice count drift');
  const [p0810Head, p0810Tail] = p0810.slices;
  assert.deepStrictEqual({
    sectionName: p0810Head.sectionName,
    romStart: p0810Head.romStart,
    romEndExclusive: p0810Head.romEndExclusive,
    vramStart: p0810Head.vramStart,
    vramEndExclusive: p0810Head.vramEndExclusive,
    placementKind: p0810Head.placementKind,
    loadSlabId: p0810Head.loadSlabId,
    executable: p0810Head.executable,
    executableRangeId: p0810Head.executableRangeId,
  }, {
    sectionName: '.ob64.r0810.s0',
    romStart: 0x00040638,
    romEndExclusive: 0x00040E80,
    vramStart: 0x00040638,
    vramEndExclusive: 0x00040E80,
    placementKind: 'rom-only',
    loadSlabId: null,
    executable: false,
    executableRangeId: null,
  }, 'p0810 head placement drift');
  assert.deepStrictEqual({
    sectionName: p0810Tail.sectionName,
    romStart: p0810Tail.romStart,
    romEndExclusive: p0810Tail.romEndExclusive,
    vramStart: p0810Tail.vramStart,
    vramEndExclusive: p0810Tail.vramEndExclusive,
    placementKind: p0810Tail.placementKind,
    loadSlabId: p0810Tail.loadSlabId,
    executable: p0810Tail.executable,
    executableRangeId: p0810Tail.executableRangeId,
  }, {
    sectionName: '.ob64.r0810.s1',
    romStart: 0x00040E80,
    romEndExclusive: 0x00040E90,
    vramStart: 0x8016AF80,
    vramEndExclusive: 0x8016AF90,
    placementKind: 'non-descriptor-load-slab',
    loadSlabId: 'cold-boot-loader-00040e80',
    executable: true,
    executableRangeId: 'cold-boot-entry-stubs-00040e80',
  }, 'p0810 tail placement or executable treatment drift');
  assert.strictEqual(p0810Head.bytes + p0810Tail.bytes, p0810.bytes, 'p0810 slice byte conservation drift');
  assert.strictEqual(p0810Head.romEndExclusive, p0810Tail.romStart, 'p0810 slices overlap or leave a gap');

  const p0810HeadSection = baselineElf.sections.find((candidate) => candidate.name === p0810Head.sectionName);
  const p0810TailSection = baselineElf.sections.find((candidate) => candidate.name === p0810Tail.sectionName);
  assert.ok(p0810HeadSection && (p0810HeadSection.flags & 4) === 0, 'p0810 head ELF execution flag drift');
  assert.ok(p0810TailSection && (p0810TailSection.flags & 4) !== 0, 'p0810 tail ELF execution flag drift');
  const p0810HeadHeaders = baselineElf.programHeaders.filter((candidate) => candidate.type === 1 && candidate.vaddr === p0810Head.vramStart && candidate.paddr === p0810Head.romStart && candidate.fileSize === p0810Head.bytes && candidate.memorySize === p0810Head.bytes && candidate.flags === 4);
  const p0810TailHeaders = baselineElf.programHeaders.filter((candidate) => candidate.type === 1 && candidate.vaddr === p0810Tail.vramStart && candidate.paddr === p0810Tail.romStart && candidate.fileSize === p0810Tail.bytes && candidate.memorySize === p0810Tail.bytes && candidate.flags === 5);
  assert.strictEqual(p0810HeadHeaders.length, 1, 'p0810 head PT_LOAD treatment drift');
  assert.strictEqual(p0810TailHeaders.length, 1, 'p0810 tail executable PT_LOAD treatment drift');

  assert.deepStrictEqual([
    romBytes.readUInt32BE(0x00040E80),
    romBytes.readUInt32BE(0x00040E84),
    romBytes.readUInt32BE(0x00040E88),
    romBytes.readUInt32BE(0x00040E8C),
  ], [0x03E00008, 0x00000000, 0x03E00008, 0x00000000], 'p0810 tail entry-stub words drift');
  const runtimeEntryPointers = [
    romBytes.readUInt32BE(0x0003864C),
    romBytes.readUInt32BE(0x00038650),
    romBytes.readUInt32BE(0x00038654),
  ];
  assert.deepStrictEqual(runtimeEntryPointers, [0x8016AF80, 0x8016AF88, 0x8016AF90], 'cold-boot runtime entry-pointer evidence drift');
  assert.strictEqual(runtimeEntryPointers[0], p0810Tail.vramStart, 'first p0810 tail stub pointer does not match placement');
  assert.strictEqual(runtimeEntryPointers[1], p0810Tail.vramStart + 8, 'second p0810 tail stub pointer does not match placement');

  const loaderWords = new Map([
    [0x000023F4, 0x3C168017], [0x000023F8, 0x26D6AF80],
    [0x00002404, 0x3C140004], [0x00002408, 0x26940E80],
    [0x0000240C, 0x3C118019], [0x00002410, 0x26310F10],
    [0x00002414, 0x3C128019], [0x00002418, 0x26527B70],
    [0x0000245C, 0x02802021], [0x00002460, 0x3C058017],
    [0x00002464, 0x24A5AF80], [0x00002468, 0x3C060006],
    [0x0000246C, 0x24C66E10], [0x00002470, 0x0C027694],
    [0x00002474, 0x00D43023],
  ]);
  for (const [romAddress, word] of loaderWords) {
    assert.strictEqual(romBytes.readUInt32BE(romAddress), word, `cold-boot loader operand drift at 0x${romAddress.toString(16)}`);
  }
  const loaderSource = 0x00040E80;
  const loaderDestination = 0x8016AF80;
  const loaderEnd = 0x00066E10;
  const loaderLength = loaderEnd - loaderSource;
  assert.strictEqual(loaderLength, 0x25F90, 'cold-boot loader delay-slot length drift');
  assert.strictEqual(loaderDestination - loaderSource, 0x8012A100, 'cold-boot loader operand delta drift');
  assert.strictEqual((loaderLength + 1) & ~1, loaderLength, 'cold-boot helper would round the transfer length');
  assert.strictEqual(Math.floor(loaderLength / 0x200), 303, 'cold-boot full transfer chunk count drift');
  assert.strictEqual(loaderLength % 0x200, 0x190, 'cold-boot final transfer chunk drift');
  assert.strictEqual(romBytes.readUInt32BE(0x0002DEC4), 0x26020001, 'resource-read length increment drift');
  assert.strictEqual(romBytes.readUInt32BE(0x0002DEC8), 0x2406FFFE, 'resource-read even-length mask drift');
  assert.strictEqual(romBytes.readUInt32BE(0x0002DED0), 0x00463024, 'resource-read rounded-length delay slot drift');
  assert.strictEqual(romBytes.readUInt32BE(0x0001A3D0), 0x2E220201, 'lower transfer chunk comparison drift');
  assert.strictEqual(romBytes.readUInt32BE(0x0001A3DC), 0x24100200, 'lower transfer chunk cap drift');

  const whollyContainedColdBootOwners = model.rows.slice(811, 1289);
  assert.strictEqual(whollyContainedColdBootOwners.length, 478, 'cold-boot wholly contained owner count drift');
  assert.strictEqual(whollyContainedColdBootOwners.filter((row) => row.primaryClass === 'code').length, 456, 'cold-boot code-owner count drift');
  assert.strictEqual(whollyContainedColdBootOwners.filter((row) => row.primaryClass === 'data').length, 22, 'cold-boot data-owner count drift');
  assert.strictEqual(whollyContainedColdBootOwners.reduce((sum, row) => sum + row.bytes, 0), 0x25F80, 'cold-boot wholly contained owner byte count drift');
  for (const row of whollyContainedColdBootOwners) {
    assert.strictEqual(row.slices.length, 1, `cold-boot owner was unexpectedly split: p${row.index}`);
    const slice = row.slices[0];
    assert.strictEqual(slice.placementKind, 'non-descriptor-load-slab', `cold-boot placement kind drift: p${row.index}`);
    assert.strictEqual(slice.loadSlabId, 'cold-boot-loader-00040e80', `cold-boot slab identity drift: p${row.index}`);
    assert.strictEqual(slice.overlayDescriptorId, null, `fixed descriptor leaked into cold-boot owner p${row.index}`);
    assert.strictEqual(slice.vramStart, row.romStart + 0x8012A100, `cold-boot VMA drift: p${row.index}`);
    assert.strictEqual(slice.vramEndExclusive, row.romEndExclusive + 0x8012A100, `cold-boot VMA end drift: p${row.index}`);
    assert.strictEqual(slice.executable, row.primaryClass === 'code' && row.processorClass !== 'rsp', `cold-boot source-class executable treatment drift: p${row.index}`);
    assert.strictEqual(slice.executableRangeId, null, `unexpected executable-range treatment: p${row.index}`);
  }
  assert.strictEqual(runtimeEntryPointers[2], model.rows[811].slices[0].vramStart, 'p0811 entry pointer does not match slab placement');

  const acceptedCodeOwners = model.rows.slice(811, 1267);
  const wordByRom = new Map();
  let parsedCodeWords = 0;
  let duplicateCodeWords = 0;
  for (const row of acceptedCodeOwners) {
    assert.strictEqual(row.primaryClass, 'code', `non-code owner entered cold-boot control-flow scan: p${row.index}`);
    const source = fs.readFileSync(path.join(__dirname, '..', row.part.file), 'utf8');
    const wordPattern = /\/\*\s*0x([0-9A-Fa-f]{8})\s+0x[0-9A-Fa-f]{8}\s+0x([0-9A-Fa-f]{8})\s*\*\/\s*\.word\s+0x([0-9A-Fa-f]{8})/g;
    let ownerWords = 0;
    for (const match of source.matchAll(wordPattern)) {
      const romAddress = Number.parseInt(match[1], 16);
      if (romAddress < row.romStart || romAddress >= row.romEndExclusive) continue;
      const commentWord = Number.parseInt(match[2], 16) >>> 0;
      const directiveWord = Number.parseInt(match[3], 16) >>> 0;
      assert.strictEqual(directiveWord, commentWord, `accepted assembly word/comment drift: p${row.index}`);
      if (wordByRom.has(romAddress)) duplicateCodeWords += 1;
      wordByRom.set(romAddress, directiveWord);
      ownerWords += 1;
      parsedCodeWords += 1;
    }
    assert.strictEqual(ownerWords * 4, row.bytes, `accepted assembly word coverage drift: p${row.index}`);
  }
  assert.strictEqual(acceptedCodeOwners.length, 456, 'cold-boot control-flow owner count drift');
  assert.strictEqual(acceptedCodeOwners.reduce((sum, row) => sum + row.bytes, 0), 0x1B378, 'cold-boot control-flow byte count drift');
  assert.strictEqual(parsedCodeWords, 27870, 'cold-boot parsed control-flow word count drift');
  assert.strictEqual(wordByRom.size, 27870, 'cold-boot unique control-flow word count drift');
  assert.strictEqual(duplicateCodeWords, 0, 'cold-boot control-flow word ownership overlaps');

  const controlFlowCounts = { j: 0, jal: 0, internalJ: 0, internalJal: 0, externalJ: 0, externalJal: 0 };
  const codeRomStart = acceptedCodeOwners[0].romStart;
  const codeRomEndExclusive = acceptedCodeOwners[acceptedCodeOwners.length - 1].romEndExclusive;
  for (const [romAddress, word] of wordByRom) {
    const opcode = word >>> 26;
    if (opcode !== 2 && opcode !== 3) continue;
    const kind = opcode === 2 ? 'j' : 'jal';
    controlFlowCounts[kind] += 1;
    const livePc = (romAddress + 0x8012A100) >>> 0;
    const target = ((((livePc + 4) >>> 0) & 0xF0000000) | ((word & 0x03FFFFFF) << 2)) >>> 0;
    const targetRom = target - 0x8012A100;
    const internal = targetRom >= codeRomStart && targetRom < codeRomEndExclusive;
    if (internal) {
      controlFlowCounts[opcode === 2 ? 'internalJ' : 'internalJal'] += 1;
      assert.strictEqual(target & 3, 0, `unaligned cold-boot internal control target at 0x${romAddress.toString(16)}`);
      assert.ok(wordByRom.has(targetRom), `missing cold-boot internal target word at 0x${targetRom.toString(16)}`);
      const owner = acceptedCodeOwners.find((row) => targetRom >= row.romStart && targetRom < row.romEndExclusive);
      assert.ok(owner && owner.primaryClass === 'code', `cold-boot internal target entered data at 0x${targetRom.toString(16)}`);
    } else {
      controlFlowCounts[opcode === 2 ? 'externalJ' : 'externalJal'] += 1;
    }
  }
  assert.deepStrictEqual(controlFlowCounts, {
    j: 746,
    jal: 697,
    internalJ: 746,
    internalJal: 266,
    externalJ: 0,
    externalJal: 431,
  }, 'cold-boot raw J/JAL census drift');

  const p0910 = model.rows[910];
  assert.strictEqual(p0910.primaryId, 'primary:b49f88930cedbd2ef423', 'p0910 accepted primary owner drift');
  assert.strictEqual(p0910.inputKind, 'tracked-assembly', 'p0910 accepted assembly ownership drift');
  assert.strictEqual(p0910.part.name, 'func_0004501c', 'p0910 accepted assembly symbol drift');
  assert.strictEqual(p0910.slices[0].vramStart, 0x8016F11C, 'p0910 runtime VMA drift');
  assert.strictEqual(p0910.slices[0].romStart, 0x0004501C, 'p0910 ROM LMA drift');

  const p1289 = model.rows[1289];
  assert.strictEqual(p1289.romStart, 0x00066E10, 'p1289 start drift');
  assert.strictEqual(p1289.slices.length, 1, 'p1289 slice count drift');
  assert.strictEqual(p1289.slices[0].placementKind, 'overlay', 'p1289 did not remain in a fixed descriptor');
  assert.strictEqual(p1289.slices[0].overlayDescriptorId, 0, 'p1289 fixed descriptor drift');
  assert.strictEqual(p1289.slices[0].loadSlabId, null, 'p1289 entered the cold-boot load slab');
  assert.strictEqual(p1289.slices[0].vramStart, 0x80197B70, 'p1289 descriptor-0 VMA drift');

  const p0910MapInputs = mapText.split(/\r?\n/).filter((line) => /^\s+\.ob64\.r0910\s/.test(line));
  assert.strictEqual(p0910MapInputs.length, 1, 'p0910 linked input ownership is not unique');
  assert.ok(p0910MapInputs[0].includes('objects/assembly/chunk_004.o'), 'p0910 is not linked from accepted assembly chunk 4');

  const layout = JSON.parse(fs.readFileSync(path.join(output, 'layout.json'), 'utf8'));
  assert.deepStrictEqual(layout.fixedOverlayNonExecutableRanges, model.fixedOverlayNonExecutableRanges,
    'layout fixed-overlay non-executable-range summary drift');
  assert.deepStrictEqual(layout.nonDescriptorLoadSlabs, model.nonDescriptorLoadSlabs, 'layout load-slab summary drift');
  for (const expected of expectedOwners) {
    assert.strictEqual(layout.owners[expected.rowIndex].slices[0].loadSlabId, 'scenario-loader-00195410', `layout load-slab ID drift: p${expected.rowIndex}`);
  }
  assert.strictEqual(layout.owners[810].primaryId, 'primary:4b3693504d495f021786', 'layout changed p0810 source ownership');
  assert.strictEqual(layout.owners[810].slices.length, 2, 'layout p0810 placement slice count drift');
  assert.strictEqual(layout.owners[810].slices[1].executableRangeId, 'cold-boot-entry-stubs-00040e80', 'layout lost p0810 tail executable treatment');
  assert.strictEqual(layout.owners[3758].slices.length, 2, 'layout lost func_002013D0 function/padding split');
  assert.strictEqual(layout.owners[3758].slices[0].nonExecutableRangeId, null, 'layout marked func_002013D0 instructions non-executable');
  assert.strictEqual(layout.owners[3758].slices[1].nonExecutableRangeId, 'func-002013d0-alignment-padding', 'layout lost func_002013D0 padding treatment');
  assert.strictEqual(layout.owners[4033].slices.length, 2, 'layout lost func_0021C8DC function/padding split');
  assert.strictEqual(layout.owners[4033].slices[0].nonExecutableRangeId, null, 'layout marked func_0021C8DC instructions non-executable');
  assert.strictEqual(layout.owners[4033].slices[1].nonExecutableRangeId, 'func-0021c8dc-alignment-padding', 'layout lost func_0021C8DC padding treatment');
  assert.strictEqual(layout.owners[910].inputKind, 'tracked-assembly', 'layout activated p0910 C');

  const linkerScript = renderLinkerScript(model);
  assert.ok(linkerScript.includes('.ob64.r0810.s0 0x00040638 : AT(0x00040638)'), 'p0810 head linker placement drift');
  assert.ok(linkerScript.includes('.ob64.r0810.s1 0x8016AF80 : AT(0x00040E80)'), 'p0810 tail linker VMA/LMA relationship drift');
  assert.ok(linkerScript.includes('.ob64.r0910 0x8016F11C : AT(0x0004501C)'), 'p0910 linker VMA/LMA relationship drift');
  assert.ok(linkerScript.includes('.ob64.r1289 0x80197B70 : AT(0x00066E10)'), 'p1289 descriptor-0 linker placement drift');
  assert.ok(linkerScript.includes('.ob64.r3063 0x802150BC : AT(0x0019554C)'), 'p3063 linker VMA/LMA relationship drift');
  assert.ok(linkerScript.includes('.ob64.r3758.s0 0x801BDF40 : AT(0x002013D0)'), 'func_002013D0 instruction linker placement drift');
  assert.ok(linkerScript.includes('.ob64.r3758.s1 0x801BDF94 : AT(0x00201424)'), 'func_002013D0 padding linker placement drift');
  assert.ok(linkerScript.includes('.ob64.r4033.s0 0x801D960C : AT(0x0021C8DC)'), 'func_0021C8DC instruction linker placement drift');
  assert.ok(linkerScript.includes('.ob64.r4033.s1 0x801D9698 : AT(0x0021C968)'), 'func_0021C8DC padding linker placement drift');
  assert.ok(linkerScript.includes('.ob64.r4158 0x801E6B20 : AT(0x00229DF0)'), 'func_0021CBC4 auxiliary-owner linker placement drift');
  const retailJumpRomAddress = 0x001955B0;
  const retailJumpRuntimeAddress = 0x80215120;
  const retailJumpWord = romBytes.readUInt32BE(retailJumpRomAddress);
  assert.strictEqual(retailJumpWord, 0x0808544F, 'p3063 internal retail jump word drift');
  const retailJumpTarget = (((retailJumpRuntimeAddress + 4) & 0xF0000000) | ((retailJumpWord & 0x03FFFFFF) << 2)) >>> 0;
  assert.strictEqual(retailJumpTarget, 0x8021513C, 'p3063 + 0x80 runtime jump target drift');

  results.push(expectRejection('ROM padding', /linked ROM size drift/, () => {
    verifyRom(model, Buffer.concat([romBytes, Buffer.from([0])]));
  }));

  const representative = model.config.representativeSymbols[0];
  const representativeSlice = model.rows[representative.rowIndex].slices[0];
  const section = baselineElf.sections.find((candidate) => candidate.name === representativeSlice.sectionName);
  if (!section) fail(`baseline test section is missing: ${representativeSlice.sectionName}`);
  const sizeDrift = Buffer.from(elfBytes);
  sizeDrift.writeUInt32BE(section.size + 4, section.headerOffset + 20);
  results.push(expectRejection('ELF section size', /ELF section size drift/, () => {
    verifyElfAgainstModel(model, parseElf32BigEndian(sizeDrift));
  }));

  const loadHeader = baselineElf.programHeaders.find((candidate) => (
    candidate.type === 1
    && candidate.vaddr === representativeSlice.vramStart
    && candidate.paddr === representativeSlice.romStart
    && candidate.fileSize === representativeSlice.bytes
  ));
  if (!loadHeader) fail(`baseline test load header is missing: ${representativeSlice.sectionName}`);
  const placementDrift = Buffer.from(elfBytes);
  const programHeaderOffset = baselineElf.header.phoff + loadHeader.index * baselineElf.header.phentsize;
  placementDrift.writeUInt32BE(loadHeader.paddr + 4, programHeaderOffset + 12);
  results.push(expectRejection('ELF load placement', /ELF load address drift/, () => {
    verifyElfAgainstModel(model, parseElf32BigEndian(placementDrift));
  }));

  const coldBootVmaDrift = Buffer.from(elfBytes);
  coldBootVmaDrift.writeUInt32BE(p0810TailSection.address + 4, p0810TailSection.headerOffset + 12);
  results.push(expectRejection('cold-boot slab VMA placement', /ELF section VRAM placement drift/, () => {
    verifyElfAgainstModel(model, parseElf32BigEndian(coldBootVmaDrift));
  }));

  const coldBootLoadHeader = p0810TailHeaders[0];
  const coldBootLmaDrift = Buffer.from(elfBytes);
  const coldBootProgramHeaderOffset = baselineElf.header.phoff + coldBootLoadHeader.index * baselineElf.header.phentsize;
  coldBootLmaDrift.writeUInt32BE(coldBootLoadHeader.paddr + 4, coldBootProgramHeaderOffset + 12);
  results.push(expectRejection('cold-boot slab ROM LMA placement', /ELF load address drift/, () => {
    verifyElfAgainstModel(model, parseElf32BigEndian(coldBootLmaDrift));
  }));

  const coldBootExecutionDrift = Buffer.from(elfBytes);
  coldBootExecutionDrift.writeUInt32BE(p0810TailSection.flags & ~4, p0810TailSection.headerOffset + 8);
  results.push(expectRejection('cold-boot entry-stub executable treatment', /ELF section execution flag drift/, () => {
    verifyElfAgainstModel(model, parseElf32BigEndian(coldBootExecutionDrift));
  }));

  const coldBootTailProgramHeaderExecutionDrift = Buffer.from(elfBytes);
  coldBootTailProgramHeaderExecutionDrift.writeUInt32BE(4, coldBootProgramHeaderOffset + 24);
  results.push(expectRejection('cold-boot entry-stub PT_LOAD executable treatment', /ELF program-header execution flag drift: \.ob64\.r0810\.s1/, () => {
    verifyElfAgainstModel(model, parseElf32BigEndian(coldBootTailProgramHeaderExecutionDrift));
  }));

  const coldBootHeadLoadHeader = p0810HeadHeaders[0];
  const coldBootHeadProgramHeaderExecutionDrift = Buffer.from(elfBytes);
  const coldBootHeadProgramHeaderOffset = baselineElf.header.phoff + coldBootHeadLoadHeader.index * baselineElf.header.phentsize;
  coldBootHeadProgramHeaderExecutionDrift.writeUInt32BE(5, coldBootHeadProgramHeaderOffset + 24);
  results.push(expectRejection('cold-boot head PT_LOAD non-executable treatment', /ELF program-header execution flag drift: \.ob64\.r0810\.s0/, () => {
    verifyElfAgainstModel(model, parseElf32BigEndian(coldBootHeadProgramHeaderExecutionDrift));
  }));

  const wrapperTextSlice = wrapperOwner.slices[0];
  const wrapperPaddingSlice = wrapperOwner.slices[1];
  const wrapperTextSection = baselineElf.sections.find((candidate) => candidate.name === wrapperTextSlice.sectionName);
  const wrapperPaddingSection = baselineElf.sections.find((candidate) => candidate.name === wrapperPaddingSlice.sectionName);
  if (!wrapperTextSection || !wrapperPaddingSection) fail('func_002013D0 function/padding ELF sections are missing');
  assert.ok((wrapperTextSection.flags & 4) !== 0, 'func_002013D0 instruction section is not executable');
  assert.strictEqual(wrapperPaddingSection.flags & 4, 0, 'func_002013D0 alignment padding is executable');
  const wrapperPaddingExecutionDrift = Buffer.from(elfBytes);
  wrapperPaddingExecutionDrift.writeUInt32BE(wrapperPaddingSection.flags | 4, wrapperPaddingSection.headerOffset + 8);
  results.push(expectRejection('func_002013D0 executable padding section', /ELF section execution flag drift/, () => {
    verifyElfAgainstModel(model, parseElf32BigEndian(wrapperPaddingExecutionDrift));
  }));
  const wrapperPaddingPlacementDrift = Buffer.from(elfBytes);
  wrapperPaddingPlacementDrift.writeUInt32BE(wrapperPaddingSection.address + 4, wrapperPaddingSection.headerOffset + 12);
  results.push(expectRejection('func_002013D0 padding VMA placement', /ELF section VRAM placement drift/, () => {
    verifyElfAgainstModel(model, parseElf32BigEndian(wrapperPaddingPlacementDrift));
  }));
  const wrapperPaddingLoadHeader = baselineElf.programHeaders.find((candidate) => (
    candidate.type === 1
    && candidate.vaddr === wrapperPaddingSlice.vramStart
    && candidate.paddr === wrapperPaddingSlice.romStart
    && candidate.fileSize === wrapperPaddingSlice.bytes
  ));
  if (!wrapperPaddingLoadHeader) fail('func_002013D0 padding load header is missing');
  const wrapperPaddingProgramHeaderOffset = baselineElf.header.phoff
    + wrapperPaddingLoadHeader.index * baselineElf.header.phentsize;
  const wrapperPaddingProgramHeaderExecutionDrift = Buffer.from(elfBytes);
  wrapperPaddingProgramHeaderExecutionDrift.writeUInt32BE(5, wrapperPaddingProgramHeaderOffset + 24);
  results.push(expectRejection('func_002013D0 executable padding PT_LOAD', /ELF program-header execution flag drift: \.ob64\.r3758\.s1/, () => {
    verifyElfAgainstModel(model, parseElf32BigEndian(wrapperPaddingProgramHeaderExecutionDrift));
  }));
  const wrapperPaddingLmaDrift = Buffer.from(elfBytes);
  wrapperPaddingLmaDrift.writeUInt32BE(wrapperPaddingLoadHeader.paddr + 4, wrapperPaddingProgramHeaderOffset + 12);
  results.push(expectRejection('func_002013D0 padding ROM placement', /ELF load address drift/, () => {
    verifyElfAgainstModel(model, parseElf32BigEndian(wrapperPaddingLmaDrift));
  }));

  const comparatorTextSlice = comparatorOwner.slices[0];
  const comparatorPaddingSlice = comparatorOwner.slices[1];
  const comparatorTextSection = baselineElf.sections.find((candidate) => candidate.name === comparatorTextSlice.sectionName);
  const comparatorPaddingSection = baselineElf.sections.find((candidate) => candidate.name === comparatorPaddingSlice.sectionName);
  if (!comparatorTextSection || !comparatorPaddingSection) fail('func_0021C8DC function/padding ELF sections are missing');
  assert.ok((comparatorTextSection.flags & 4) !== 0, 'func_0021C8DC instruction section is not executable');
  assert.strictEqual(comparatorPaddingSection.flags & 4, 0, 'func_0021C8DC alignment padding is executable');
  const comparatorPaddingExecutionDrift = Buffer.from(elfBytes);
  comparatorPaddingExecutionDrift.writeUInt32BE(comparatorPaddingSection.flags | 4, comparatorPaddingSection.headerOffset + 8);
  results.push(expectRejection('func_0021C8DC executable padding section', /ELF section execution flag drift/, () => {
    verifyElfAgainstModel(model, parseElf32BigEndian(comparatorPaddingExecutionDrift));
  }));
  const comparatorPaddingLoadHeader = baselineElf.programHeaders.find((candidate) => (
    candidate.type === 1
    && candidate.vaddr === comparatorPaddingSlice.vramStart
    && candidate.paddr === comparatorPaddingSlice.romStart
    && candidate.fileSize === comparatorPaddingSlice.bytes
  ));
  if (!comparatorPaddingLoadHeader) fail('func_0021C8DC padding load header is missing');
  const comparatorPaddingProgramHeaderDrift = Buffer.from(elfBytes);
  const comparatorPaddingProgramHeaderOffset = baselineElf.header.phoff
    + comparatorPaddingLoadHeader.index * baselineElf.header.phentsize;
  comparatorPaddingProgramHeaderDrift.writeUInt32BE(5, comparatorPaddingProgramHeaderOffset + 24);
  results.push(expectRejection('func_0021C8DC executable padding PT_LOAD', /ELF program-header execution flag drift: \.ob64\.r4033\.s1/, () => {
    verifyElfAgainstModel(model, parseElf32BigEndian(comparatorPaddingProgramHeaderDrift));
  }));

  const slabSlice = model.rows[3063].slices[0];
  const slabSection = baselineElf.sections.find((candidate) => candidate.name === slabSlice.sectionName);
  if (!slabSection) fail(`baseline slab section is missing: ${slabSlice.sectionName}`);
  const slabVmaDrift = Buffer.from(elfBytes);
  slabVmaDrift.writeUInt32BE(slabSection.address + 4, slabSection.headerOffset + 12);
  results.push(expectRejection('load-slab VMA placement', /ELF section VRAM placement drift/, () => {
    verifyElfAgainstModel(model, parseElf32BigEndian(slabVmaDrift));
  }));

  const slabLoadHeader = baselineElf.programHeaders.find((candidate) => (
    candidate.type === 1
    && candidate.vaddr === slabSlice.vramStart
    && candidate.paddr === slabSlice.romStart
    && candidate.fileSize === slabSlice.bytes
  ));
  if (!slabLoadHeader) fail(`baseline slab load header is missing: ${slabSlice.sectionName}`);
  const slabLmaDrift = Buffer.from(elfBytes);
  const slabProgramHeaderOffset = baselineElf.header.phoff + slabLoadHeader.index * baselineElf.header.phentsize;
  slabLmaDrift.writeUInt32BE(slabLoadHeader.paddr + 4, slabProgramHeaderOffset + 12);
  results.push(expectRejection('load-slab ROM LMA placement', /ELF load address drift/, () => {
    verifyElfAgainstModel(model, parseElf32BigEndian(slabLmaDrift));
  }));

  results.push(expectRejection('fixed-overlay non-executable-range count', /count drift/, () => {
    validateFixedOverlayNonExecutableRanges(
      overlayRangeFixture([validOverlayNonExecutableRange()], 2),
      [validTestOverlay()],
    );
  }));
  results.push(expectRejection('malformed fixed-overlay non-executable-range list', /count drift/, () => {
    validateFixedOverlayNonExecutableRanges({
      rom: { bytes: 0x10000 },
      expected: { fixedOverlayNonExecutableRanges: 1 },
      fixedOverlayNonExecutableRanges: {},
    }, [validTestOverlay()]);
  }));
  results.push(expectRejection('fixed-overlay non-executable-range unexpected field', /is malformed/, () => {
    validateFixedOverlayNonExecutableRanges(
      overlayRangeFixture([validOverlayNonExecutableRange({ permissive: true })]),
      [validTestOverlay()],
    );
  }));
  results.push(expectRejection('fixed-overlay non-executable-range reserved ID', /invalid or repeated/, () => {
    validateFixedOverlayNonExecutableRanges(
      overlayRangeFixture([validOverlayNonExecutableRange()]),
      [validTestOverlay()],
      ['overlay-padding-range'],
    );
  }));
  results.push(expectRejection('fixed-overlay non-executable-range alignment', /safe aligned integer/, () => {
    validateFixedOverlayNonExecutableRanges(
      overlayRangeFixture([validOverlayNonExecutableRange({ romStart: 0x2102 })]),
      [validTestOverlay()],
    );
  }));
  results.push(expectRejection('fixed-overlay non-executable-range descriptor', /outside its descriptor/, () => {
    validateFixedOverlayNonExecutableRanges(
      overlayRangeFixture([validOverlayNonExecutableRange({ overlayDescriptorId: 4 })]),
      [validTestOverlay()],
    );
  }));
  results.push(expectRejection('fixed-overlay non-executable-range section', /placement is malformed/, () => {
    validateFixedOverlayNonExecutableRanges(
      overlayRangeFixture([validOverlayNonExecutableRange({ overlaySection: 'data-rodata' })]),
      [validTestOverlay()],
    );
  }));
  results.push(expectRejection('fixed-overlay non-executable-range escaped text', /escaped overlay text/, () => {
    validateFixedOverlayNonExecutableRanges(
      overlayRangeFixture([validOverlayNonExecutableRange({ romStart: 0x217C, romEndExclusive: 0x2184 })]),
      [validTestOverlay()],
    );
  }));
  results.push(expectRejection('overlapping fixed-overlay non-executable ranges', /ranges overlap/, () => {
    validateFixedOverlayNonExecutableRanges(overlayRangeFixture([
      validOverlayNonExecutableRange(),
      validOverlayNonExecutableRange({ id: 'second-overlay-padding-range', romStart: 0x2108, romEndExclusive: 0x2118 }),
    ]), [validTestOverlay()]);
  }));

  results.push(expectRejection('malformed load-slab endpoint', /safe aligned integer/, () => {
    validateNonDescriptorLoadSlabs(slabFixture([validTestSlab({ romStart: 0x1002 })]));
  }));
  results.push(expectRejection('duplicate load-slab ID', /ID is invalid or repeated/, () => {
    validateNonDescriptorLoadSlabs(slabFixture([
      validTestSlab(),
      validTestSlab({ romStart: 0x1200, romEndExclusive: 0x1300, vramStart: 0x80200000, vramEndExclusive: 0x80200100 }),
    ]));
  }));
  results.push(expectRejection('overlapping load-slab ROM ranges', /ROM containment is not unique/, () => {
    validateNonDescriptorLoadSlabs(slabFixture([
      validTestSlab(),
      validTestSlab({ id: 'test-slab-two', romStart: 0x1080, romEndExclusive: 0x1180, vramStart: 0x80200000, vramEndExclusive: 0x80200100 }),
    ]));
  }));
  results.push(expectRejection('ambiguous fixed-overlay and load-slab ROM range', /overlaps fixed descriptor ROM mapping/, () => {
    validateNonDescriptorLoadSlabs(slabFixture([validTestSlab()]), [{
      descriptor_id: 99,
      rom_start: 0x1080,
      rom_end_exclusive: 0x1200,
    }]);
  }));
  results.push(expectRejection('unequal load-slab ROM and VRAM lengths', /ROM and VRAM lengths differ/, () => {
    validateNonDescriptorLoadSlabs(slabFixture([validTestSlab({ vramEndExclusive: 0x80100104 })]));
  }));
  results.push(expectRejection('load-slab count', /load-slab count drift/, () => {
    validateNonDescriptorLoadSlabs(slabFixture([validTestSlab()], 2));
  }));
  results.push(expectRejection('malformed executable-range list', /executable ranges are malformed/, () => {
    validateNonDescriptorLoadSlabs(slabFixture([validTestSlab({ executableRanges: {} })]));
  }));
  results.push(expectRejection('malformed executable-range endpoint', /executable-range endpoint is not a safe aligned integer/, () => {
    validateNonDescriptorLoadSlabs(slabFixture([validTestSlab({ executableRanges: [{ id: 'stub-range', romStart: 0x1002, romEndExclusive: 0x1010 }] })]));
  }));
  results.push(expectRejection('executable range outside load slab', /executable range is outside its slab/, () => {
    validateNonDescriptorLoadSlabs(slabFixture([validTestSlab({ executableRanges: [{ id: 'stub-range', romStart: 0x0FF0, romEndExclusive: 0x1010 }] })]));
  }));
  results.push(expectRejection('duplicate executable-range ID', /executable-range ID is invalid or repeated/, () => {
    validateNonDescriptorLoadSlabs(slabFixture([validTestSlab({ executableRanges: [
      { id: 'stub-range', romStart: 0x1000, romEndExclusive: 0x1010 },
      { id: 'stub-range', romStart: 0x1020, romEndExclusive: 0x1030 },
    ] })]));
  }));
  results.push(expectRejection('overlapping executable ranges', /executable ranges overlap/, () => {
    validateNonDescriptorLoadSlabs(slabFixture([validTestSlab({ executableRanges: [
      { id: 'stub-range-one', romStart: 0x1000, romEndExclusive: 0x1020 },
      { id: 'stub-range-two', romStart: 0x1010, romEndExclusive: 0x1030 },
    ] })]));
  }));
  results.push(expectRejection('malformed non-executable-range list', /non-executable ranges are malformed/, () => {
    validateNonDescriptorLoadSlabs(slabFixture([validTestSlab({ nonExecutableRanges: {} })]));
  }));
  results.push(expectRejection('malformed non-executable-range endpoint', /non-executable-range endpoint is not a safe aligned integer/, () => {
    validateNonDescriptorLoadSlabs(slabFixture([validTestSlab({ nonExecutableRanges: [{ id: 'padding-range', romStart: 0x1002, romEndExclusive: 0x1010 }] })]));
  }));
  results.push(expectRejection('non-executable range outside load slab', /non-executable range is outside its slab/, () => {
    validateNonDescriptorLoadSlabs(slabFixture([validTestSlab({ nonExecutableRanges: [{ id: 'padding-range', romStart: 0x0FF0, romEndExclusive: 0x1010 }] })]));
  }));
  results.push(expectRejection('duplicate non-executable-range ID', /non-executable-range ID is invalid or repeated/, () => {
    validateNonDescriptorLoadSlabs(slabFixture([validTestSlab({ nonExecutableRanges: [
      { id: 'padding-range', romStart: 0x1000, romEndExclusive: 0x1010 },
      { id: 'padding-range', romStart: 0x1020, romEndExclusive: 0x1030 },
    ] })]));
  }));
  results.push(expectRejection('overlapping non-executable ranges', /non-executable ranges overlap/, () => {
    validateNonDescriptorLoadSlabs(slabFixture([validTestSlab({ nonExecutableRanges: [
      { id: 'padding-range-one', romStart: 0x1000, romEndExclusive: 0x1020 },
      { id: 'padding-range-two', romStart: 0x1010, romEndExclusive: 0x1030 },
    ] })]));
  }));
  results.push(expectRejection('overlapping executable and non-executable ranges', /executable and non-executable ranges overlap/, () => {
    validateNonDescriptorLoadSlabs(slabFixture([validTestSlab({
      executableRanges: [{ id: 'stub-range', romStart: 0x1000, romEndExclusive: 0x1020 }],
      nonExecutableRanges: [{ id: 'padding-range', romStart: 0x1010, romEndExclusive: 0x1030 }],
    })]));
  }));

  console.log(JSON.stringify({ status: 'pass', baseline: 'verified', mutations: results }, null, 2));
}

main();
