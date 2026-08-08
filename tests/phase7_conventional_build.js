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
  assert.strictEqual(model.counts.nonDescriptorLoadSlabs, 1, 'accepted load-slab count drift');
  assert.deepStrictEqual(model.nonDescriptorLoadSlabs, [{
    id: 'scenario-loader-00195410',
    kind: 'loader-dma',
    romStart: 0x00195410,
    romEndExclusive: 0x001977E0,
    vramStart: 0x80214F80,
    vramEndExclusive: 0x80217350,
  }], 'accepted load-slab record drift');

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

  const layout = JSON.parse(fs.readFileSync(path.join(output, 'layout.json'), 'utf8'));
  assert.deepStrictEqual(layout.nonDescriptorLoadSlabs, model.nonDescriptorLoadSlabs, 'layout load-slab summary drift');
  for (const expected of expectedOwners) {
    assert.strictEqual(layout.owners[expected.rowIndex].slices[0].loadSlabId, 'scenario-loader-00195410', `layout load-slab ID drift: p${expected.rowIndex}`);
  }

  const linkerScript = renderLinkerScript(model);
  assert.ok(linkerScript.includes('.ob64.r3063 0x802150BC : AT(0x0019554C)'), 'p3063 linker VMA/LMA relationship drift');
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

  console.log(JSON.stringify({ status: 'pass', baseline: 'verified', mutations: results }, null, 2));
}

main();
