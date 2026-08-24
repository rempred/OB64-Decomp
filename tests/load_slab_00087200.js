#!/usr/bin/env node
'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const {
  ROOT,
  loadAcceptedModel,
  renderLinkerScript,
} = require('../tools/lib/phase7_conventional');

function main() {
  const model = loadAcceptedModel();
  const slab = model.nonDescriptorLoadSlabs.find((candidate) => candidate.id === 'loader-dma-00087200');
  assert.deepStrictEqual(slab, {
    id: 'loader-dma-00087200',
    kind: 'loader-dma',
    romStart: 0x00087200,
    romEndExclusive: 0x000DDF60,
    vramStart: 0x8019A7A0,
    vramEndExclusive: 0x801F1500,
    executableRanges: [],
  }, 'accepted runtime load-slab record drift');

  assert.strictEqual(slab.romEndExclusive - slab.romStart, 0x56D60, 'ROM length drift');
  assert.strictEqual(slab.vramEndExclusive - slab.vramStart, 0x56D60, 'VRAM length drift');
  assert.strictEqual(slab.vramStart - slab.romStart, 0x801135A0, 'start delta drift');
  assert.strictEqual(slab.vramEndExclusive - slab.romEndExclusive, 0x801135A0, 'end delta drift');

  const rows = model.rows.filter((row) => (
    row.romStart < slab.romEndExclusive
    && row.romEndExclusive > slab.romStart
  ));
  assert.strictEqual(rows.length, 435, 'contained owner count drift');
  assert.strictEqual(rows[0].index, 1503, 'first contained owner drift');
  assert.strictEqual(rows[0].romStart, slab.romStart, 'first ROM boundary drift');
  assert.strictEqual(rows.at(-1).index, 1937, 'final contained owner drift');
  assert.strictEqual(rows.at(-1).romEndExclusive, slab.romEndExclusive, 'final ROM boundary drift');
  for (const row of rows) {
    assert.strictEqual(row.slices.length, 1, `contained owner was unexpectedly split: p${row.index}`);
    const [slice] = row.slices;
    assert.strictEqual(slice.loadSlabId, slab.id, `load-slab identity drift: p${row.index}`);
    assert.strictEqual(slice.placementKind, 'non-descriptor-load-slab', `placement-kind drift: p${row.index}`);
    assert.strictEqual(slice.vramStart, slice.romStart + 0x801135A0, `VMA start drift: p${row.index}`);
    assert.strictEqual(slice.vramEndExclusive, slice.romEndExclusive + 0x801135A0, `VMA end drift: p${row.index}`);
  }
  for (const rowIndex of [1502, 1938]) {
    const row = model.rows[rowIndex];
    assert.ok(row.slices.every((slice) => slice.loadSlabId !== slab.id), `p${rowIndex} crossed a slab endpoint`);
  }

  const affected = [
    { rowIndex: 1745, romStart: 0x000BBD50, vramStart: 0x801CF2F0 },
    { rowIndex: 1746, romStart: 0x000BBD80, vramStart: 0x801CF320 },
    { rowIndex: 1752, romStart: 0x000BC684, vramStart: 0x801CFC24 },
    { rowIndex: 1767, romStart: 0x000BD26C, vramStart: 0x801D080C },
  ];
  for (const expected of affected) {
    const row = model.rows[expected.rowIndex];
    assert.strictEqual(row.romStart, expected.romStart, `affected ROM start drift: p${expected.rowIndex}`);
    assert.strictEqual(row.slices[0].vramStart, expected.vramStart, `affected VMA drift: p${expected.rowIndex}`);
    assert.strictEqual(row.slices[0].loadSlabId, slab.id, `affected slab identity drift: p${expected.rowIndex}`);
  }

  const linkerScript = renderLinkerScript(model);
  for (const expected of affected) {
    const section = `.ob64.r${String(expected.rowIndex).padStart(4, '0')}`;
    const vram = `0x${expected.vramStart.toString(16).toUpperCase().padStart(8, '0')}`;
    const rom = `0x${expected.romStart.toString(16).toUpperCase().padStart(8, '0')}`;
    assert.ok(linkerScript.includes(`${section} ${vram} : AT(${rom})`), `linker VMA/LMA drift: p${expected.rowIndex}`);
  }

  const assembly = fs.readFileSync(path.join(ROOT, 'asm', 'original', 'rev0', 'lib', 'func_000bd26c.s'), 'utf8');
  const jumpMatch = assembly.match(/\/\* 0x000BD2D0\b[^\n]*\*\/ \.word (0x[0-9A-Fa-f]+)/);
  assert.ok(jumpMatch, 'func_000BD26C retail local-jump word is missing');
  const jumpWord = Number.parseInt(jumpMatch[1], 16) >>> 0;
  assert.strictEqual(jumpWord, 0x0807421F, 'func_000BD26C retail local-jump word drift');
  const jumpTarget = (0x80000000 | ((jumpWord & 0x03FFFFFF) << 2)) >>> 0;
  assert.strictEqual(jumpTarget, 0x801D087C, 'func_000BD26C retail local-jump target drift');
  assert.strictEqual(jumpTarget, slab.vramStart + (0x000BD2DC - slab.romStart), 'retail local jump disagrees with slab VMA');

  console.log(JSON.stringify({
    status: 'pass',
    slabId: slab.id,
    ownerCount: rows.length,
    affectedOwners: affected.length,
    localJumpTarget: `0x${jumpTarget.toString(16).toUpperCase()}`,
  }, null, 2));
}

main();
