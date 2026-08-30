#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const {
  ROOT,
  loadAcceptedModel,
  sha256Buffer,
} = require('../tools/lib/phase7_conventional');
const {
  MULTI_OWNER_CONFIG_PATH,
  validateMultiOwnerConfig,
} = require('../tools/lib/active_targets');

const ROM_START = 0x002A0EF0;
const ROM_SEAM = 0x002A1000;
const ROM_END = 0x002A135C;
const VRAM_START = 0x802316C0;
const VRAM_SEAM = 0x802317D0;
const VRAM_END = 0x80231B2C;

function signExtend16(value) {
  return (value & 0x8000) !== 0 ? value - 0x10000 : value;
}

function decodeControl(word, pc) {
  const opcode = word >>> 26;
  const cop1Rs = (word >>> 21) & 0x1f;
  if ([1, 4, 5, 6, 7, 20, 21, 22, 23].includes(opcode)
      || (opcode === 17 && cop1Rs === 8)) {
    return { kind: 'branch', target: (pc + 4 + (signExtend16(word & 0xffff) << 2)) >>> 0 };
  }
  if (opcode === 2 || opcode === 3) {
    return {
      kind: opcode === 3 ? 'jal' : 'jump',
      target: (((pc + 4) & 0xf0000000) | ((word & 0x03ffffff) << 2)) >>> 0,
    };
  }
  if (opcode === 0 && (word & 0x3f) === 8) return { kind: 'jr', target: null };
  return null;
}

function sameJson(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function main() {
  const model = loadAcceptedModel();
  const baserom = fs.readFileSync(path.join(ROOT, 'build', 'baserom.us_rev0.z64'));
  const config = JSON.parse(fs.readFileSync(MULTI_OWNER_CONFIG_PATH, 'utf8'));
  const contracts = validateMultiOwnerConfig(config, model.config.profile, model, baserom);
  const contract = contracts.get('func_002a0ef0');
  if (!contract || contract.romStartNumber !== ROM_START || contract.romEndNumber !== ROM_END
      || contract.vramStartNumber !== VRAM_START || contract.vramEndNumber !== VRAM_END
      || contract.bytes !== ROM_END - ROM_START
      || !sameJson(contract.rows.map((row) => row.index), [5366, 5367])) {
    throw new Error('accepted logical function extent drift');
  }

  const targetBytes = Buffer.from(baserom.subarray(ROM_START, ROM_END));
  if (targetBytes.length !== 1132
      || sha256Buffer(targetBytes) !== contract.expectedTextSha256
      || targetBytes.readUInt32BE(0) !== 0x27BDFFD0
      || baserom.readUInt32BE(0x002A1354) !== 0x03E00008
      || baserom.readUInt32BE(0x002A1358) !== 0x27BD0030) {
    throw new Error('prologue, epilogue, return, or logical byte identity drift');
  }

  const transfers = [];
  for (let rom = ROM_START; rom < ROM_END; rom += 4) {
    const pc = VRAM_START + (rom - ROM_START);
    const word = baserom.readUInt32BE(rom);
    const decoded = decodeControl(word, pc);
    if (decoded) transfers.push({ rom, pc, word, ...decoded });
  }
  const returns = transfers.filter((record) => record.kind === 'jr');
  if (returns.length !== 1 || returns[0].rom !== 0x002A1354) {
    throw new Error('logical function exit census drift');
  }
  const nonCallEscapes = transfers.filter((record) => (
    record.target !== null
    && record.kind !== 'jal'
    && (record.target < VRAM_START || record.target >= VRAM_END)
  ));
  const calls = transfers.filter((record) => record.kind === 'jal');
  if (nonCallEscapes.length !== 0 || calls.length !== 7
      || calls.some((record) => record.target >= VRAM_START && record.target < VRAM_END)) {
    throw new Error('logical function internal-flow or call/exit classification drift');
  }

  const crossBoundaryEdges = transfers.filter((record) => (
    record.target !== null
    && record.target >= VRAM_START && record.target < VRAM_END
    && ((record.pc < VRAM_SEAM) !== (record.target < VRAM_SEAM))
  )).map((record) => ({ rom: record.rom, target: record.target }));
  const expectedCrossBoundaryEdges = [
    { rom: 0x002A0F30, target: 0x80231960 },
    { rom: 0x002A0F40, target: 0x80231820 },
    { rom: 0x002A0F54, target: 0x80231820 },
    { rom: 0x002A0FEC, target: 0x802317D8 },
    { rom: 0x002A1198, target: 0x802316E8 },
  ];
  if (!sameJson(crossBoundaryEdges, expectedCrossBoundaryEdges)) {
    throw new Error('cross-owner control-flow edge census drift');
  }
  const seamBranch = transfers.find((record) => record.rom === 0x002A0FFC);
  if (!seamBranch || seamBranch.kind !== 'branch' || seamBranch.target !== 0x80231734
      || seamBranch.word !== 0x1440FFD9
      || baserom.readUInt32BE(ROM_SEAM) !== 0x00061400
      || transfers.some((record) => record.target === VRAM_SEAM)) {
    throw new Error('preserved branch/delay-slot owner seam drift');
  }

  const incoming = [];
  for (const slice of model.slices.filter((candidate) => candidate.executable)) {
    for (let rom = slice.romStart; rom < slice.romEndExclusive; rom += 4) {
      const pc = slice.vramStart + (rom - slice.romStart);
      const decoded = decodeControl(baserom.readUInt32BE(rom), pc);
      if (!decoded || decoded.target === null
          || decoded.target < VRAM_START || decoded.target >= VRAM_END
          || (rom >= ROM_START && rom < ROM_END)) continue;
      incoming.push({ rowIndex: slice.rowIndex, rom, pc, kind: decoded.kind, target: decoded.target });
    }
  }
  const expectedIncoming = [{
    rowIndex: 5360,
    rom: 0x002A0728,
    pc: 0x80230EF8,
    kind: 'jal',
    target: VRAM_START,
  }];
  if (!sameJson(incoming, expectedIncoming)
      || incoming.some((record) => record.target !== VRAM_START)
      || baserom.readUInt32BE(ROM_END) !== 0x3C028023) {
    throw new Error('logical entry or successor-boundary census drift');
  }

  const report = {
    schemaVersion: 1,
    status: 'pass',
    symbol: 'func_002A0EF0',
    extent: {
      romStart: ROM_START,
      romSeam: ROM_SEAM,
      romEndExclusive: ROM_END,
      vramStart: VRAM_START,
      vramSeam: VRAM_SEAM,
      vramEndExclusive: VRAM_END,
      bytes: targetBytes.length,
      instructions: targetBytes.length / 4,
      sha256: sha256Buffer(targetBytes),
      owners: contract.owners.map((owner) => ({
        rowIndex: owner.rowIndex,
        chunkIndex: owner.chunkIndex,
        sectionName: owner.sectionName,
        bytes: owner.bytes,
        originalAssembly: owner.originalAssembly,
      })),
    },
    entries: incoming,
    returns: returns.map((record) => ({ rom: record.rom, pc: record.pc })),
    calls: calls.map((record) => ({ rom: record.rom, pc: record.pc, target: record.target })),
    crossBoundaryEdges,
    seam: {
      branchRom: seamBranch.rom,
      branchPc: seamBranch.pc,
      branchTarget: seamBranch.target,
      delaySlotRom: ROM_SEAM,
      delaySlotPc: VRAM_SEAM,
      delaySlotWord: baserom.readUInt32BE(ROM_SEAM),
      directBranchTargetsAtSeam: 0,
    },
    nonCallEscapes: nonCallEscapes.length,
    successorFirstWord: baserom.readUInt32BE(ROM_END),
  };
  const output = path.join(ROOT, 'build', 'multi-owner-text-test', 'func_002A0EF0-structure.json');
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify(report, null, 2));
}

main();
