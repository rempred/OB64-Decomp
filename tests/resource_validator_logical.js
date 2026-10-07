#!/usr/bin/env node
'use strict';

// Static metadata/selection regression. No compiler, linker, database or build.
const assert = require('assert');
const fs = require('fs');
const logical = require('../tools/lib/logical_functions');
const targets = require('../tools/lib/matching/target_model');
const { emitM2cAssembly } = require('../tools/lib/matching/assembly');
const { validateLogicalFunctionCensus } = require('../tools/lib/matching/compiler');
const { sha256Buffer } = require('../tools/lib/phase7_conventional');

const workbench = targets.loadWorkbenchModel();
const config = JSON.parse(fs.readFileSync(logical.CONFIG_PATH, 'utf8'));
const spans = [[0x18D4, 0x1A34], [0x1A34, 0x1A3C], [0x1A3C, 0x1A44]];
const symbols = ['func_000018D4', 'func_00001A34', 'func_00001A3C'];
const hashes = [
  'E91BCEF48D54C26C82E01D5EA998CA8B2FAF5359E409862777C9B977EFA734C9',
  '13D278A82C57269D4F5A34A2ACE2BB1F08227DA62A48F056A215836EAC8B9BFE',
  '648CBC77D024F6D08BC8FF4E3BDF1CEBF2A933937EE1CEBEF4690D015808BD9C',
];
const owner = workbench.model.rows.find(row => row.index === 9);
assert.equal(owner.romStart, 0x18D4);
assert.equal(owner.romEndExclusive, 0x1A44);
assert.equal(owner.bytes, 368);
assert.equal(owner.part.file, 'asm/original/rev0/boot/resource_ptr_validate.s');
assert.equal(owner.part.sha256, '685AB9FA8FBE96C5F5732C20A14199E4E4C53CFD7295D066F282BF74ACEE81CC');
assert.equal(owner.slices.length, 1);
assert.equal(owner.slices[0].sectionName, '.ob64.r0009');

const records = config.bodies.filter(body => body.romStart >= 0x18D4 && body.romStart < 0x1A44);
assert.equal(records.length, 3);
for (const [index, record] of records.entries()) {
  const [start, end] = spans[index];
  assert.equal(record.symbol, symbols[index]);
  assert.deepEqual(record.aliases, []); // Aliases must not shorten the owner selection.
  assert.equal(record.evidence.status, 'supplemental-reviewed-body');
  assert.deepEqual([record.romStart, record.romEndExclusive], [start, end]);
  assert.equal(record.expectedBytesSha256, hashes[index]);
  assert.equal(sha256Buffer(workbench.baserom.subarray(start, end)), hashes[index]);
  assert.deepEqual(record.fragments, logical.intersections(workbench.model, start, end));
  assert.equal(record.fragments.length, 1);
  assert.equal(record.fragments[0].rowIndex, 9);
  assert.equal(record.fragments[0].ownerOffset, start - 0x18D4);
  assert.equal(record.fragments[0].vramStart, start + 0x8006FC00);
}
assert.deepEqual([0x1A2C, 0x1A30, 0x1A34, 0x1A38, 0x1A3C, 0x1A40]
  .map(offset => workbench.baserom.readUInt32BE(offset)),
  [0x03E00008, 0x27BD0018, 0x03E00008, 0x8C82FFF4, 0x03E00008, 0x00001021]);

const target = targets.resolveTarget(workbench, 'resource_ptr_validate');
assert.equal(target.bytes, 368);
assert.equal(target.romStart, 0x18D4);
assert.equal(target.romEndExclusive, 0x1A44);
assert.equal(target.selectionKind, 'physical-owner-envelope');
assert.equal(target.logicalCoverageComplete, true);
assert.deepEqual(target.logicalFunctions.map(fn => [fn.romStart, fn.romEndExclusive]), spans);
assert.deepEqual(target.logicalFunctions.map(fn => fn.symbol),
  ['resource_ptr_validate', 'func_00001A34', 'func_00001A3C']);
targets.assertScratchCapability(workbench, target);
assert.equal(targets.resolveTarget(workbench, 'func_000018D4').targetId, target.targetId);
const assembly = emitM2cAssembly(target, workbench);
assert.deepEqual([...assembly.matchAll(/^glabel (\S+)$/gm)].map(match => match[1]),
  ['resource_ptr_validate', 'func_00001A34', 'func_00001A3C']);
for (const symbol of symbols.slice(1)) {
  const body = targets.resolveTarget(workbench, symbol);
  assert.equal(body.bytes, 8);
  assert.equal(body.selectionKind, 'logical-body');
  assert.throws(() => logical.assertActivationCompatible(workbench.logicalRegistry, symbol, [owner]),
    /partial logical-body activation/);
}

let negativeControls = 2;
function rejects(mutator, pattern) {
  const changed = structuredClone(config);
  const selected = changed.bodies.filter(body => body.romStart >= 0x18D4 && body.romStart < 0x1A44);
  mutator(changed, selected);
  assert.throws(() => logical.loadRegistry(workbench.model, workbench.baserom, changed), pattern);
  negativeControls++;
}
rejects((c, r) => { r[1].fragments[0].ownerOffset++; }, /fragment/);
rejects((c, r) => { r[1].expectedBytesSha256 = '0'.repeat(64); }, /hash drift/);
rejects((c, r) => { r[1].romStart = r[0].romStart; }, /overlapping/);
rejects((c, r) => { r[1].aliases.push(r[0].symbol); }, /alias collision/);
rejects((c, r) => { r[1].evidence.status = 'probable-unreferenced-function'; }, /malformed/);
rejects((c, r) => {
  c.bodies.splice(c.bodies.indexOf(r[2]), 1);
  c.padding.push({ romStart: 0x1A3C, romEndExclusive: 0x1A44,
    expectedBytesSha256: hashes[2], evidence: 'Invalid executable-as-padding control' });
  c.padding.sort((a, b) => a.romStart - b.romStart);
}, /padding hash/);

const missing = structuredClone(config);
missing.bodies = missing.bodies.filter(body => body.romStart !== 0x1A34);
const incomplete = logical.loadRegistry(workbench.model, workbench.baserom, missing);
const coverage = logical.coverage(incomplete, 0x18D4, 0x1A44, workbench.baserom);
assert(coverage.some(piece => piece.kind === 'unknown'));
assert.throws(() => targets.assertScratchCapability(workbench, { ...target,
  logicalCoverage: coverage, logicalCoverageComplete: false }), /resolved logical coverage/);
negativeControls++;

// GLOBAL is the scratch-only census; it grants no production secondary exports.
const functions = target.logicalFunctions.map(fn => ({ name: fn.symbol, value: fn.offset,
  size: fn.bytes, binding: 1, symbolType: 2, visibility: 0 }));
assert.equal(validateLogicalFunctionCensus(functions, target.logicalFunctions, 368), 368);
for (const changed of [functions.slice(0, 1),
  [...functions, { name: 'invented_fourth_body', value: 368, size: 8,
    binding: 1, symbolType: 2, visibility: 0 }],
  functions.map((fn, i) => ({ ...fn, value: i === 1 ? 348 : fn.value })),
  functions.map((fn, i) => ({ ...fn, binding: i === 1 ? 0 : fn.binding }))]) {
  assert.throws(() => validateLogicalFunctionCensus(changed, target.logicalFunctions, 368),
    /census|malformed/);
  negativeControls++;
}
console.log(`resource validator logical bodies: full368-byte owner, three bodies, ${negativeControls} negative controls PASS`);
