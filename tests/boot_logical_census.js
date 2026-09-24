'use strict';
// Static coverage regression: no compiler, linker, ROM build, or runtime capture.
const assert = require('assert');
const targetModel = require('../tools/lib/matching/target_model');
const logical = require('../tools/lib/logical_functions');
const { emitM2cAssembly } = require('../tools/lib/matching/assembly');
const { validateLogicalFunctionCensus } = require('../tools/lib/matching/compiler');
const { sha256Buffer } = require('../tools/lib/phase7_conventional');
const workbench = targetModel.loadWorkbenchModel();
const { model, baserom, logicalRegistry } = workbench;
let negativeControls = 0;
const definitions = [
  [0x43D4, 0x46F4, [0x43D4, 0x4450, 0x4480, 0x44F0, 0x45A8, 0x462C]],
  [0xA510, 0xAF7C, [0xA510, 0xABE0, 0xAC0C, 0xAF30]],
  [0xF5A0, 0xF618, [0xF5A0, 0xF5F8]],
  [0xF618, 0xF734, [0xF618, 0xF634, 0xF714]],
  [0xF734, 0xF808, [0xF734]],
];
function ownerRow(start, end) {
  const row = model.rows.find(value => value.romStart === start);
  assert(row, `missing physical owner ${start.toString(16)}`);
  assert.equal(row.romEndExclusive, end);
  return row;
}
function rejectSelection(target) {
  assert.equal(targetModel.scratchCapability(workbench, target).code, 'incomplete-logical-coverage');
  assert.throws(() => targetModel.assertScratchCapability(workbench, target), /resolved logical coverage/);
  negativeControls++;
}
for (const [start, end, starts] of definitions) {
  ownerRow(start, end);
  const intervals = starts.map((value, index) => [value, starts[index + 1] || end]);
  const coverage = logical.coverage(logicalRegistry, start, end, baserom);
  assert.deepEqual(coverage.map(piece => [piece.romStart, piece.romEndExclusive]), intervals);
  assert(coverage.every(piece => piece.kind === 'function'));
  const target = workbench.targets.find(value => value.romStart === start);
  assert(target);
  // A registry alias must not silently turn a complete multi-body owner into its first body.
  assert.equal(target.romEndExclusive, end, `owner ${start.toString(16)} was shortened by logical selection`);
  assert.equal(target.bytes, end - start);
  assert.equal(target.logicalCoverageComplete, true);
  assert.deepEqual(target.logicalFunctions.map(body => [body.romStart, body.romEndExclusive]), intervals);
  targetModel.assertScratchCapability(workbench, target);
  const assembly = emitM2cAssembly(target, workbench);
  const labels = [...assembly.matchAll(/^glabel (\S+)$/gm)].map(match => match[1]).filter(name => !name.startsWith('jtbl_'));
  assert.deepEqual(labels, target.logicalFunctions.map(body => body.symbol));
  const functions = target.logicalFunctions.map(body => ({ name: body.symbol, value: body.offset,
    size: body.bytes, binding: 1, visibility: 0, symbolType: 2 }));
  assert.equal(validateLogicalFunctionCensus(functions, target.logicalFunctions, target.bytes), target.bytes);
  if (functions.length > 1) {
    assert.throws(() => validateLogicalFunctionCensus(functions.slice(0, 1), target.logicalFunctions, target.bytes), /census|malformed/);
    negativeControls++;
    const missing = structuredClone(target);
    missing.logicalFunctions.pop();
    rejectSelection(missing);
    const gap = structuredClone(target);
    gap.logicalCoverage[1].romStart += 4;
    rejectSelection(gap);
  }
  const unknown = structuredClone(target);
  unknown.logicalCoverage[0].kind = 'unknown';
  unknown.logicalCoverageComplete = true;
  rejectSelection(unknown);
}
assert.deepEqual(logicalRegistry.bodies.filter(body => body.romStart >= 0xAC0C && body.romStart < 0xAF7C)
  .map(body => body.romEndExclusive - body.romStart), [804, 76]);

const callbacks = [0xF5A0, 0xF5F8, 0xF618, 0xF634, 0xF714, 0xF734];
for (const [index, start] of callbacks.entries()) {
  assert.equal(baserom.readUInt32BE(0x38BB4 + 4 * index), 0x8006FC00 + start);
  const body = logicalRegistry.bodies.find(value => value.romStart === start);
  assert(body);
  assert.equal(baserom.readUInt32BE(body.romEndExclusive - 8), 0x03E00008);
}
// Pin the consumer evidence as well as the pointer words: method*12, copied triple, indirect calls.
for (const [address, word] of [[0xC354, 0x00031040], [0xC358, 0x00431021], [0xC374, 0x00021080],
  [0xC398, 0x8C84876C], [0xC3A4, 0x8CA58770], [0xC3B0, 0x8CC68774],
  [0xC3B4, 0xAE240000], [0xC3B8, 0xAE250004], [0xC3BC, 0xAE260008],
  [0xC410, 0x0040F809], [0xC458, 0x0040F809], [0xC4E4, 0x0040F809]]) {
  assert.equal(baserom.readUInt32BE(address), word, `callback consumer ${address.toString(16)}`);
}
for (const [symbol, start, end] of [['func_0000F5F8', 0xF5A0, 0xF618],
  ['func_0000F634', 0xF618, 0xF734], ['func_0000F714', 0xF618, 0xF734]]) {
  assert.throws(() => logical.assertActivationCompatible(logicalRegistry, symbol, [ownerRow(start, end)]), /partial logical-body/);
  negativeControls++;
}

const encoderRow = ownerRow(0x4894, 0x4AC8);
const encoderCoverage = logical.coverage(logicalRegistry, 0x4894, 0x4AC8, baserom);
assert.deepEqual(encoderCoverage.map(piece => [piece.kind, piece.romStart, piece.romEndExclusive]),
  [['function', 0x4894, 0x4AB8], ['unknown', 0x4AB8, 0x4AC8]]);
assert(!logicalRegistry.bodies.some(body => body.romStart < 0x4AC8 && body.romEndExclusive > 0x4AB8));
assert(!logicalRegistry.padding.some(piece => piece.romStart < 0x4AC8 && piece.romEndExclusive > 0x4AB8));
const encoder = targetModel.resolveTarget(workbench, 'func_00004894');
assert.equal(encoder.selectionKind, 'logical-body');
assert.equal(encoder.romStart, 0x4894);
assert.equal(encoder.romEndExclusive, 0x4AB8);
assert.equal(encoder.bytes, 548);
targetModel.assertScratchCapability(workbench, encoder);
// Construct the physical envelope for its capability check. Alias resolution above is intentionally scratch-only.
const fullEncoder = { ...encoder, selectionKind: 'physical-owner-envelope', romEndExclusive: 0x4AC8,
  bytes: 564, logicalCoverage: encoderCoverage, logicalCoverageComplete: false,
  expectedBytes: baserom.subarray(0x4894, 0x4AC8), expectedBytesSha256: sha256Buffer(baserom.subarray(0x4894, 0x4AC8)) };
rejectSelection(fullEncoder);
// Whole-owner activation name compatibility is a separate rule; it does not certify partial coverage or bytes.
assert.doesNotThrow(() => logical.assertActivationCompatible(logicalRegistry, encoderRow.part.name, [encoderRow]));
for (const [address, word] of [[0x48C4, 0x11800055], [0x48C8, 0x27BDFFF8],
  [0x4AB0, 0x03E00008], [0x4AB4, 0x27BD0008], [0x4AB8, 0], [0x4ABC, 0], [0x4AC0, 0x03E00008], [0x4AC4, 0]]) {
  assert.equal(baserom.readUInt32BE(address), word);
}
console.log(`boot logical census: five complete envelopes, six callbacks, unresolved encoder tail and ${negativeControls} negative controls pass`);
