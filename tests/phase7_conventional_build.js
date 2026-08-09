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

function rangesIntersect(startA, endA, startB, endB) {
  return startA < endB && endA > startB;
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
  assert.strictEqual(model.counts.nonDescriptorLoadSlabs, 2, 'accepted load-slab count drift');
  assert.strictEqual(model.slices.length, 7252, 'accepted link-slice count drift');
  assert.strictEqual(model.counts.splitOwners, 10, 'accepted split-owner count drift');
  assert.strictEqual(model.overlays.length, 19, 'fixed-descriptor count drift');
  assert.deepStrictEqual(model.nonDescriptorLoadSlabs, [{
    id: 'scenario-loader-00195410',
    kind: 'loader-dma',
    romStart: 0x00195410,
    romEndExclusive: 0x001977E0,
    vramStart: 0x80214F80,
    vramEndExclusive: 0x80217350,
    executableRanges: [],
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
  }], 'accepted load-slab record drift');

  const coldBootSlab = model.nonDescriptorLoadSlabs.find((slab) => slab.id === 'cold-boot-loader-00040e80');
  assert.ok(coldBootSlab, 'cold-boot load slab is missing');
  assert.strictEqual(coldBootSlab.romEndExclusive - coldBootSlab.romStart, 0x25F90, 'cold-boot ROM length drift');
  assert.strictEqual(coldBootSlab.vramEndExclusive - coldBootSlab.vramStart, 0x25F90, 'cold-boot VRAM length drift');
  assert.strictEqual(coldBootSlab.vramStart - coldBootSlab.romStart, 0x8012A100, 'cold-boot start delta drift');
  assert.strictEqual(coldBootSlab.vramEndExclusive - coldBootSlab.romEndExclusive, 0x8012A100, 'cold-boot end delta drift');

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
  assert.deepStrictEqual(layout.nonDescriptorLoadSlabs, model.nonDescriptorLoadSlabs, 'layout load-slab summary drift');
  for (const expected of expectedOwners) {
    assert.strictEqual(layout.owners[expected.rowIndex].slices[0].loadSlabId, 'scenario-loader-00195410', `layout load-slab ID drift: p${expected.rowIndex}`);
  }
  assert.strictEqual(layout.owners[810].primaryId, 'primary:4b3693504d495f021786', 'layout changed p0810 source ownership');
  assert.strictEqual(layout.owners[810].slices.length, 2, 'layout p0810 placement slice count drift');
  assert.strictEqual(layout.owners[810].slices[1].executableRangeId, 'cold-boot-entry-stubs-00040e80', 'layout lost p0810 tail executable treatment');
  assert.strictEqual(layout.owners[910].inputKind, 'tracked-assembly', 'layout activated p0910 C');

  const linkerScript = renderLinkerScript(model);
  assert.ok(linkerScript.includes('.ob64.r0810.s0 0x00040638 : AT(0x00040638)'), 'p0810 head linker placement drift');
  assert.ok(linkerScript.includes('.ob64.r0810.s1 0x8016AF80 : AT(0x00040E80)'), 'p0810 tail linker VMA/LMA relationship drift');
  assert.ok(linkerScript.includes('.ob64.r0910 0x8016F11C : AT(0x0004501C)'), 'p0910 linker VMA/LMA relationship drift');
  assert.ok(linkerScript.includes('.ob64.r1289 0x80197B70 : AT(0x00066E10)'), 'p1289 descriptor-0 linker placement drift');
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

  console.log(JSON.stringify({ status: 'pass', baseline: 'verified', mutations: results }, null, 2));
}

main();
