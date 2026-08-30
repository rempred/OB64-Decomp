#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { loadActiveTargetModel, resolveAcceptedRow } = require('../tools/lib/active_targets');
const { ROOT, sha256Buffer } = require('../tools/lib/phase7_conventional');

const OWNER_ROM_START = 0x002861C8;
const OWNER_ROM_END = 0x00286444;
const OWNER_VRAM_START = 0x8022A1F8;
const OWNER_VRAM_END = 0x8022A474;
const INTERNAL_ENTRY = 0x8022A32C;
const FIXED_ADDRESS_ENTRY = 0x8022A428;

function fail(message) {
  throw new Error(`func_002861C8 structural audit failure: ${message}`);
}

function sameJson(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function wordOffsets(bytes, word) {
  const offsets = [];
  for (let offset = 0; offset + 4 <= bytes.length; offset += 4) {
    if (bytes.readUInt32BE(offset) === word) offsets.push(offset);
  }
  return offsets;
}

function verifyDirectReferenceCensus(bytes) {
  const expected = [
    { label: 'primary call', word: 0x0C08A87E, offsets: [0x0028616C] },
    { label: 'primary direct jump', word: 0x0808A87E, offsets: [] },
    { label: 'internal +0x134 call', word: 0x0C08A8CB, offsets: [0x002862D0] },
    { label: 'internal +0x134 direct jump', word: 0x0808A8CB, offsets: [] },
    { label: 'fixed-address +0x230 call', word: 0x0C08A90A, offsets: [0x002854D0] },
    { label: 'fixed-address +0x230 direct jump', word: 0x0808A90A, offsets: [] },
    { label: 'internal +0x134 pointer', word: INTERNAL_ENTRY, offsets: [] },
  ];
  for (const record of expected) {
    const actual = wordOffsets(bytes, record.word);
    if (!sameJson(actual, record.offsets)) fail(`${record.label} census drift: ${JSON.stringify(actual)}`);
  }
  return expected.map((record) => ({
    label: record.label,
    word: `0x${record.word.toString(16).toUpperCase().padStart(8, '0')}`,
    romOffsets: record.offsets.map((offset) => `0x${offset.toString(16).toUpperCase().padStart(8, '0')}`),
  }));
}

function controlTransfers(bytes) {
  const result = [];
  for (let rom = OWNER_ROM_START; rom < OWNER_ROM_END; rom += 4) {
    const word = bytes.readUInt32BE(rom);
    const opcode = word >>> 26;
    const pc = (OWNER_VRAM_START + rom - OWNER_ROM_START) >>> 0;
    let record = null;
    if (opcode === 2 || opcode === 3) {
      const target = (((((pc + 4) >>> 0) & 0xF0000000) | ((word & 0x03FFFFFF) << 2)) >>> 0);
      record = { rom: `0x${rom.toString(16).toUpperCase()}`, kind: opcode === 2 ? 'j' : 'jal', target: `0x${target.toString(16).toUpperCase()}` };
    } else if ([1, 4, 5, 6, 7, 0x14, 0x15, 0x16, 0x17].includes(opcode)) {
      let immediate = word & 0xFFFF;
      if ((immediate & 0x8000) !== 0) immediate -= 0x10000;
      const target = (pc + 4 + (immediate << 2)) >>> 0;
      record = { rom: `0x${rom.toString(16).toUpperCase()}`, kind: 'branch', target: `0x${target.toString(16).toUpperCase()}` };
    } else if (opcode === 0 && (word & 0x3F) === 8) {
      record = { rom: `0x${rom.toString(16).toUpperCase()}`, kind: 'jr', register: (word >>> 21) & 31 };
    }
    if (record) result.push(record);
  }
  return result;
}

const EXPECTED_CONTROL_TRANSFERS = [
  { rom: '0x2861FC', kind: 'branch', target: '0x8022A2F0' },
  { rom: '0x286214', kind: 'jr', register: 2 },
  { rom: '0x286228', kind: 'branch', target: '0x8022A2F0' },
  { rom: '0x286230', kind: 'j', target: '0x8022A2F0' },
  { rom: '0x286244', kind: 'branch', target: '0x8022A2F0' },
  { rom: '0x28624C', kind: 'j', target: '0x8022A2F0' },
  { rom: '0x286264', kind: 'branch', target: '0x8022A2F0' },
  { rom: '0x28626C', kind: 'j', target: '0x8022A2F0' },
  { rom: '0x286284', kind: 'branch', target: '0x8022A2F0' },
  { rom: '0x28628C', kind: 'j', target: '0x8022A2F0' },
  { rom: '0x2862A0', kind: 'j', target: '0x8022A2E8' },
  { rom: '0x2862B8', kind: 'branch', target: '0x8022A2F0' },
  { rom: '0x2862C0', kind: 'branch', target: '0x8022A318' },
  { rom: '0x2862D0', kind: 'jal', target: '0x8022A32C' },
  { rom: '0x2862E0', kind: 'j', target: '0x8022A31C' },
  { rom: '0x2862F4', kind: 'jr', register: 31 },
  { rom: '0x286300', kind: 'branch', target: '0x8022A38C' },
  { rom: '0x286318', kind: 'branch', target: '0x8022A420' },
  { rom: '0x28633C', kind: 'branch', target: '0x8022A420' },
  { rom: '0x28634C', kind: 'branch', target: '0x8022A368' },
  { rom: '0x286354', kind: 'j', target: '0x8022A420' },
  { rom: '0x28636C', kind: 'branch', target: '0x8022A420' },
  { rom: '0x286394', kind: 'branch', target: '0x8022A40C' },
  { rom: '0x2863A0', kind: 'branch', target: '0x8022A420' },
  { rom: '0x2863B0', kind: 'branch', target: '0x8022A3F8' },
  { rom: '0x2863BC', kind: 'branch', target: '0x8022A420' },
  { rom: '0x2863CC', kind: 'branch', target: '0x8022A3DC' },
  { rom: '0x2863D4', kind: 'j', target: '0x8022A420' },
  { rom: '0x2863E4', kind: 'branch', target: '0x8022A3C0' },
  { rom: '0x2863F0', kind: 'jr', register: 31 },
  { rom: '0x286410', kind: 'branch', target: '0x8022A45C' },
  { rom: '0x28641C', kind: 'branch', target: '0x8022A45C' },
  { rom: '0x286424', kind: 'j', target: '0x8022A46C' },
  { rom: '0x286430', kind: 'branch', target: '0x8022A43C' },
  { rom: '0x28643C', kind: 'jr', register: 31 },
];

function verifyFunc002861C8Structure(options = {}) {
  const active = options.active || loadActiveTargetModel();
  const baserom = options.baserom || fs.readFileSync(path.join(ROOT, 'build', 'baserom.us_rev0.z64'));
  const owner = resolveAcceptedRow(active.model, 'func_002861C8');
  const executable = owner.slices.filter((slice) => slice.executable);
  if (owner.index !== 5116 || owner.inputKind !== 'tracked-assembly' || owner.primaryClass !== 'code'
      || owner.romStart !== OWNER_ROM_START || owner.romEndExclusive !== OWNER_ROM_END || owner.bytes !== 0x27C
      || executable.length !== 1 || executable[0].vramStart !== OWNER_VRAM_START
      || executable[0].vramEndExclusive !== OWNER_VRAM_END || executable[0].overlayDescriptorId !== 14) {
    fail('accepted text owner identity or extent drift');
  }
  const ownerBytes = Buffer.from(baserom.subarray(OWNER_ROM_START, OWNER_ROM_END));
  if (sha256Buffer(ownerBytes) !== '8540ED2F81174D5C9FBFADF6B739539E4EFC4D563677CCDD816603DF88719801') {
    fail('accepted text owner bytes drift');
  }
  const entries = [
    { offset: 0x000, bytes: 0x134, live: OWNER_VRAM_START, evidence: 'owner' },
    { offset: 0x134, bytes: 0x0FC, live: INTERNAL_ENTRY, evidence: 'internal-call-only' },
    { offset: 0x230, bytes: 0x04C, live: FIXED_ADDRESS_ENTRY, evidence: 'fixed-address-call' },
  ];
  if (entries[0].offset !== 0
      || entries.some((entry, index) => index > 0 && entry.offset !== entries[index - 1].offset + entries[index - 1].bytes)
      || entries[entries.length - 1].offset + entries[entries.length - 1].bytes !== owner.bytes) {
    fail('entry/body partition does not exactly cover accepted owner');
  }
  const references = verifyDirectReferenceCensus(baserom);
  const transfers = controlTransfers(baserom);
  if (!sameJson(transfers, EXPECTED_CONTROL_TRANSFERS)) fail('complete control-transfer census drift');

  const auxiliaryOwner = active.model.rows.find((row) => row.index === 5131);
  const auxiliarySlices = auxiliaryOwner && auxiliaryOwner.slices.filter((slice) => slice.sectionName === '.ob64.r5131');
  if (!auxiliaryOwner || auxiliaryOwner.inputKind !== 'tracked-assembly' || auxiliaryOwner.primaryClass !== 'data'
      || auxiliaryOwner.romStart !== 0x00286B90 || auxiliaryOwner.romEndExclusive !== 0x00286BD0
      || !auxiliaryOwner.part || auxiliaryOwner.part.file !== 'asm/original/rev0/lib/table_00286B90.s'
      || !Array.isArray(auxiliarySlices) || auxiliarySlices.length !== 1 || auxiliarySlices[0].executable
      || auxiliarySlices[0].vramStart !== 0x8022ABC0 || auxiliarySlices[0].vramEndExclusive !== 0x8022AC00) {
    fail('accepted auxiliary owner identity or extent drift');
  }
  const linkedTable = Buffer.from(baserom.subarray(0x00286BB0, 0x00286BC8));
  const linkedWords = Array.from({ length: 6 }, (_, index) => linkedTable.readUInt32BE(index * 4));
  const expectedLinkedWords = [0x8022A24C, 0x8022A268, 0x8022A284, 0x8022A2A4, 0x8022A2C4, 0x8022A2D8];
  const objectTable = Buffer.alloc(24);
  for (const [index, word] of linkedWords.entries()) objectTable.writeUInt32BE((word - OWNER_VRAM_START) >>> 0, index * 4);
  const tail = Buffer.from(baserom.subarray(0x00286BC8, 0x00286BD0));
  if (!sameJson(linkedWords, expectedLinkedWords)
      || sha256Buffer(linkedTable) !== '8BB46E4A653E8091810D96866D3A5D0CBCECF798DEAE3A6200901709D8642D17'
      || sha256Buffer(objectTable) !== 'A9135899EECACABBA7D375B9AAF0F702020116739459D10E049FF5C6FB884EE5'
      || tail.some((byte) => byte !== 0)
      || sha256Buffer(tail) !== 'AF5570F5A1810B7AF78CAF4BC70A660F0DF51E42BAF91D4DE5B2328DE0E83DFC'
      || linkedTable.length % 8 !== 0) {
    fail('six-entry compiler table or final assembly tail drift');
  }

  const mutations = [];
  if (options.runMutations !== false) {
    const expectMutationRejection = (name, mutate) => {
      const changed = Buffer.from(baserom);
      mutate(changed);
      try {
        verifyDirectReferenceCensus(changed);
      } catch (error) {
        mutations.push({ name, status: 'rejected', message: error.message });
        return;
      }
      fail(`${name} mutation was accepted`);
    };
    expectMutationRejection('second external +0x134 call', (changed) => changed.writeUInt32BE(0x0C08A8CB, 0x1000));
    expectMutationRejection('external +0x134 direct jump', (changed) => changed.writeUInt32BE(0x0808A8CB, 0x1000));
    expectMutationRejection('materialized +0x134 pointer', (changed) => changed.writeUInt32BE(INTERNAL_ENTRY, 0x1000));
    expectMutationRejection('missing fixed-address +0x230 call', (changed) => changed.writeUInt32BE(0, 0x002854D0));
    const expectTransferMutationRejection = (name, rom) => {
      const changed = Buffer.from(baserom);
      changed.writeUInt32BE(0, rom);
      const actual = controlTransfers(changed);
      if (sameJson(actual, EXPECTED_CONTROL_TRANSFERS)) fail(`${name} mutation was accepted`);
      mutations.push({
        name,
        status: 'rejected',
        message: 'complete control-transfer census drift',
      });
    };
    for (const rom of [0x002862B8, 0x002863B0, 0x00286410, 0x0028641C]) {
      expectTransferMutationRejection(`missing branch-likely at 0x${rom.toString(16).toUpperCase()}`, rom);
    }
  }
  return {
    status: 'pass',
    owner: {
      romStart: '0x002861C8',
      romEndExclusive: '0x00286444',
      vramStart: '0x8022A1F8',
      vramEndExclusive: '0x8022A474',
      bytes: owner.bytes,
      sha256: sha256Buffer(ownerBytes),
      entries,
      controlTransfers: transfers.length,
    },
    references,
    auxiliary: {
      ownerRowIndex: auxiliaryOwner.index,
      compilerTableRomStart: '0x00286BB0',
      compilerTableBytes: linkedTable.length,
      linkedSha256: sha256Buffer(linkedTable),
      objectSha256: sha256Buffer(objectTable),
      finalAssemblyTailBytes: tail.length,
      finalAssemblyTailSha256: sha256Buffer(tail),
    },
    mutations,
  };
}

if (require.main === module) {
  console.log(JSON.stringify(verifyFunc002861C8Structure(), null, 2));
}

module.exports = { verifyDirectReferenceCensus, verifyFunc002861C8Structure };
