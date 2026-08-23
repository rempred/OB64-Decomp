#!/usr/bin/env node
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const {
  bufferFromWords,
  compareMips,
  targetMetrics,
} = require('../tools/lib/matching/mips_analysis');
const {
  loadWorkbenchModel,
  resolveTarget,
  targetRecord,
} = require('../tools/lib/matching/target_model');
const { collisionSafeGroups } = require('../tools/lib/matching/family');
const { buildTargetContext } = require('../tools/lib/matching/context');
const { compilableM2cSource, m2cDiagnostics, m2cFailure, portableM2cArguments } = require('../tools/lib/matching/m2c');
const { ROOT } = require('../tools/lib/phase7_conventional');
const { requestStore } = require('../tools/lib/matching/store');
const { candidateRecord } = require('../tools/lib/matching/compiler');
const { compareProbes } = require('../tools/lib/matching/probe');

function fail(message) {
  throw new Error(`matching workbench test failure: ${message}`);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function rType(rs, rt, rd, funct) {
  return ((rs << 21) | (rt << 16) | (rd << 11) | funct) >>> 0;
}

function iType(op, rs, rt, immediate) {
  return ((op << 26) | (rs << 21) | (rt << 16) | (immediate & 0xFFFF)) >>> 0;
}

function expectError(pattern, callback) {
  try { callback(); } catch (error) {
    if (!pattern.test(error.message)) throw error;
    return;
  }
  fail(`expected error was not raised: ${pattern}`);
}

function classifierTests() {
  const jrRa = rType(31, 0, 0, 0x08);
  const nop = 0;
  const exact = bufferFromWords([rType(4, 5, 2, 0x21), jrRa, nop]);
  assert(compareMips(exact, Buffer.from(exact), { start: 0x80000000 }).primaryClass === 'exact-bytes', 'exact bytes were not exact');

  const renamed = bufferFromWords([rType(4, 5, 3, 0x21), jrRa, nop]);
  assert(compareMips(exact, renamed, { start: 0x80000000 }).primaryClass === 'register-allocation-only', 'register-only difference was misclassified');

  const immediateA = bufferFromWords([iType(0x09, 4, 2, 1), jrRa, nop]);
  const immediateB = bufferFromWords([iType(0x09, 4, 2, 2), jrRa, nop]);
  assert(compareMips(immediateA, immediateB, { start: 0x80000000 }).primaryClass === 'immediate-or-signedness', 'immediate difference was misclassified');
  assert(compareMips(immediateA, immediateB, { start: 0x80000000, relocations: [{ offset: 0, type: 'R_MIPS_UNKNOWN' }] }).primaryClass !== 'relocation-only', 'unknown relocation suppressed a real difference');

  const jumpA = bufferFromWords([0x0C000001, nop]);
  const jumpB = bufferFromWords([0x0C000002, nop]);
  assert(compareMips(jumpA, jumpB, { start: 0x80000000, relocations: [{ offset: 0, type: 'R_MIPS_26' }] }).primaryClass === 'relocation-only', 'supported jump relocation was not isolated');

  const branchA = bufferFromWords([iType(0x04, 4, 0, 1), nop, jrRa, nop]);
  const branchB = bufferFromWords([iType(0x04, 4, 0, 2), nop, jrRa, nop]);
  assert(compareMips(branchA, branchB, { start: 0x80000000 }).primaryClass === 'cfg-mismatch', 'CFG difference was misclassified');

  const scheduleA = bufferFromWords([iType(0x09, 4, 2, 1), iType(0x09, 5, 3, 2), jrRa, nop]);
  const scheduleB = bufferFromWords([iType(0x09, 5, 3, 2), iType(0x09, 4, 2, 1), jrRa, nop]);
  assert(compareMips(scheduleA, scheduleB, { start: 0x80000000 }).primaryClass === 'scheduling-or-block-order', 'scheduling difference was misclassified');

  const stackA = bufferFromWords([iType(0x09, 29, 29, -16), iType(0x2B, 29, 31, 12), jrRa, iType(0x09, 29, 29, 16)]);
  const stackB = bufferFromWords([iType(0x09, 29, 29, -24), iType(0x2B, 29, 31, 20), jrRa, iType(0x09, 29, 29, 24)]);
  assert(compareMips(stackA, stackB, { start: 0x80000000 }).primaryClass === 'stack-layout', 'stack-layout difference was misclassified');

  const expressionA = bufferFromWords([iType(0x09, 4, 2, 1), jrRa, nop]);
  const expressionB = bufferFromWords([iType(0x0D, 4, 2, 1), jrRa, nop]);
  assert(compareMips(expressionA, expressionB, { start: 0x80000000 }).primaryClass === 'opcode-or-expression', 'opcode/expression difference was misclassified');

  assert(compareMips(exact, exact.subarray(0, 8), { start: 0x80000000 }).primaryClass === 'length-mismatch', 'length difference was misclassified');
  assert(targetMetrics(exact, 0x80000000).leaf, 'simple return fixture was not a leaf');
}

function familyTests() {
  const items = [
    { targetId: 'A', symbol: 'a', romStart: 0, bytes: 4, value: 'same' },
    { targetId: 'B', symbol: 'b', romStart: 4, bytes: 4, value: 'same' },
    { targetId: 'C', symbol: 'c', romStart: 8, bytes: 4, value: 'different' },
    { targetId: 'D', symbol: 'd', romStart: 12, bytes: 4, value: 'different' },
  ];
  const groups = collisionSafeGroups(items, 'fixture', (item) => item.value, () => 'FORCED-COLLISION');
  assert(groups.length === 2, 'forced index collision merged unequal exact representations');
  assert(groups.every((group) => group.members.length === 2), 'collision-safe groups lost exact peers');
}

function m2cAdapterTests() {
  const source = compilableM2cSource([
    'Warning: missing "jr $ra" in final block',
    'f32 fixture(void) {',
    '    return M2C_BITWISE(f32, 0x3F800000U);',
    '}',
    '',
  ].join('\n'));
  assert(source.includes('typedef float f32;'), 'm2c adapter omitted the floating-point type prelude');
  assert(!source.includes('Warning:'), 'm2c warning leaked into direct cc1 input');
  assert(!source.includes('/*'), 'm2c adapter emitted a comment into direct cc1 input');
  assert(!source.includes('M2C_BITWISE'), 'm2c valid-syntax macro was not expanded');
  const diagnostics = m2cDiagnostics('Warning: missing return\nvoid fixture(void) {}\n');
  assert(diagnostics.length === 1 && diagnostics[0].message === 'missing return', 'm2c warning was not retained as a diagnostic');
  assert(m2cFailure('/*\nDecompilation failure in function fixture:\n\nCannot find branch target\n*/')?.includes('Cannot find branch target'), 'm2c generation failure detail was discarded');
  const portable = portableM2cArguments([path.join(ROOT, 'build', 'matching', 'fixture.s')], { root: path.resolve(ROOT, '..', 'tools', 'm2c') });
  assert(portable[0] === '<repo>/build/matching/fixture.s', 'm2c candidate provenance retained a machine-local repository path');
}

function candidateIdentityTests() {
  const target = { targetId: 'TARGET-FIXTURE' };
  const first = candidateRecord(target, 'void fixture(void) {}\n', { origin: 'm2c', metadata: { pass: 1 } });
  const second = candidateRecord(target, 'void fixture(void) {}\n', { origin: 'manual', metadata: { pass: 2 } });
  assert(first.candidateId === second.candidateId, 'identical target and source were split by provenance');
  assert(first.observationId !== second.observationId, 'distinct candidate provenance observations were collapsed');
}

function probeComparisonTests() {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'ob64-match-probe-'));
  const left = path.join(directory, 'left');
  const right = path.join(directory, 'right');
  fs.mkdirSync(left);
  fs.mkdirSync(right);
  try {
    const report = { schemaVersion: 1, probeId: 'PROBE', dumps: [{ name: 'fixture.rtl' }] };
    fs.writeFileSync(path.join(left, 'probe-report.json'), JSON.stringify({ ...report, probeId: 'LEFT' }));
    fs.writeFileSync(path.join(right, 'probe-report.json'), JSON.stringify({ ...report, probeId: 'RIGHT' }));
    fs.writeFileSync(path.join(left, 'fixture.rtl'), 'same\n');
    fs.writeFileSync(path.join(right, 'fixture.rtl'), 'same\n');
    assert(compareProbes(path.join(left, 'probe-report.json'), path.join(right, 'probe-report.json')).firstDivergentPass === null, 'equal compiler probes diverged');
    fs.writeFileSync(path.join(right, 'fixture.rtl'), 'different\n');
    assert(compareProbes(path.join(left, 'probe-report.json'), path.join(right, 'probe-report.json')).firstDivergentPass === 'rtl', 'first compiler probe divergence was not identified');
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
}

function storeTests() {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'ob64-match-store-'));
  const database = path.join(directory, 'workbench.sqlite');
  const options = { database, python: process.env.OB64_MATCH_PYTHON || 'python' };
  try {
    const target = {
      targetId: 'TARGET-A', modelId: 'MODEL-A', symbol: 'fixture',
      metadata: { romStart: 0, bytes: 4 }, expectedBytes: Buffer.from([0, 0, 0, 0]).toString('base64'),
      observedAt: '2026-08-22T00:00:00.000Z',
    };
    assert(requestStore({ action: 'init' }, options).schemaVersion === 2, 'store schema was not initialized');
    assert(requestStore({ action: 'upsert_targets', records: [target] }, options).inserted === 1, 'target was not inserted');
    assert(requestStore({ action: 'upsert_targets', records: [target] }, options).inserted === 0, 'identical target insertion was not idempotent');
    expectError(/conflicting target identity/, () => requestStore({ action: 'upsert_targets', records: [{ ...target, expectedBytes: Buffer.from([1, 0, 0, 0]).toString('base64') }] }, options));
    const status = requestStore({ action: 'query', name: 'status', args: { modelId: 'MODEL-A' } }, options);
    assert(status.targets === 1, 'conflicting target altered the persistent store');
    const synced = requestStore({
      action: 'sync_targets', modelId: 'MODEL-A', modelManifest: { profile: 'fixture' }, targetCount: 1, records: [target],
    }, options);
    assert(!synced.skipped, 'first exact model sync did not validate target rows');
    const skippedSync = requestStore({
      action: 'sync_targets', modelId: 'MODEL-A', modelManifest: { profile: 'fixture' }, targetCount: 1, records: [target],
    }, options);
    assert(skippedSync.skipped, 'unchanged exact model sync did not take the fast path');
    expectError(/conflicting exact target model identity/, () => requestStore({
      action: 'sync_targets', modelId: 'MODEL-A', modelManifest: { profile: 'collision' }, targetCount: 1, records: [target],
    }, options));
    requestStore({ action: 'replace_families', modelId: 'MODEL-A', groups: [{ groupId: 'G1', tier: 'exact', representation: 'x', metadata: {}, members: ['TARGET-A'] }] }, options);
    expectError(/FOREIGN KEY constraint failed/, () => requestStore({ action: 'replace_families', modelId: 'MODEL-A', groups: [{ groupId: 'G2', tier: 'exact', representation: 'y', metadata: {}, members: ['MISSING'] }] }, options));
    const families = requestStore({ action: 'query', name: 'families_for_target', args: { targetId: 'TARGET-A', limit: 20 } }, options);
    assert(families.length === 1 && families[0].group_id === 'G1', 'failed family replacement partially altered the store');

    const failedCompile = {
      runId: 'RUN-FAILED', candidateId: 'CANDIDATE-A', cacheKey: 'CACHE-A', status: 'failed',
      artifactDir: 'build/failure', durationMs: 1, tool: {}, createdAt: '2026-08-22T00:00:01.000Z',
    };
    requestStore({ action: 'put_candidate', record: {
      candidateId: 'CANDIDATE-A', observationId: 'OBSERVATION-A', targetId: 'TARGET-A', sourceSha256: 'SOURCE-A', sourceText: 'void fixture(void) {}',
      origin: 'fixture', metadata: {}, createdAt: '2026-08-22T00:00:01.000Z',
    } }, options);
    requestStore({ action: 'put_candidate', record: {
      candidateId: 'CANDIDATE-A', observationId: 'OBSERVATION-A2', targetId: 'TARGET-A', sourceSha256: 'SOURCE-A', sourceText: 'void fixture(void) {}',
      origin: 'second-path', metadata: { portable: true }, createdAt: '2026-08-22T00:00:01.500Z',
    } }, options);
    assert(requestStore({ action: 'query', name: 'candidate_observations', args: { candidateId: 'CANDIDATE-A', limit: 20 } }, options).length === 2, 'identical source did not retain distinct provenance observations');
    expectError(/conflicting candidate identity/, () => requestStore({ action: 'put_candidate', record: {
      candidateId: 'CANDIDATE-A', observationId: 'OBSERVATION-COLLISION', targetId: 'TARGET-A', sourceSha256: 'SOURCE-COLLISION', sourceText: 'void different(void) {}',
      origin: 'fixture', metadata: {}, createdAt: '2026-08-22T00:00:01.750Z',
    } }, options));
    requestStore({ action: 'put_compile', record: failedCompile }, options);
    const successfulRetry = requestStore({ action: 'put_compile', record: {
      ...failedCompile, runId: 'RUN-PASS', status: 'compiled', objectText: Buffer.alloc(4).toString('base64'), createdAt: '2026-08-22T00:00:02.000Z',
    } }, options);
    assert(!successfulRetry.cached && successfulRetry.run.status === 'compiled', 'failed compile cache prevented a repaired retry');
    assert(requestStore({ action: 'query', name: 'candidate_runs', args: { candidateId: 'CANDIDATE-A', limit: 20 } }, options).length === 2, 'compile retry did not retain the failed attempt');
    requestStore({ action: 'put_candidate', record: {
      candidateId: 'CANDIDATE-B', observationId: 'OBSERVATION-B', targetId: 'TARGET-A', sourceSha256: 'SOURCE-B', sourceText: 'void fixture(void) { int value; }',
      origin: 'fixture', metadata: {}, createdAt: '2026-08-22T00:00:03.000Z',
    } }, options);
    expectError(/conflicting compile cache identity/, () => requestStore({ action: 'put_compile', record: {
      ...failedCompile, runId: 'RUN-COLLISION', candidateId: 'CANDIDATE-B', status: 'compiled',
      objectText: Buffer.alloc(4).toString('base64'), createdAt: '2026-08-22T00:00:04.000Z',
    } }, options));
    requestStore({ action: 'put_candidate', record: {
      candidateId: 'CANDIDATE-C', observationId: 'OBSERVATION-C', targetId: 'TARGET-A', sourceSha256: 'SOURCE-C', sourceText: 'void atomic(void) {}',
      origin: 'fixture', metadata: {}, createdAt: '2026-08-22T00:00:05.000Z',
    } }, options);
    expectError(/record is missing required keys/, () => requestStore({
      action: 'put_compile_result',
      compile: {
        runId: 'RUN-ATOMIC', candidateId: 'CANDIDATE-C', cacheKey: 'CACHE-ATOMIC', status: 'compiled',
        objectText: Buffer.alloc(4).toString('base64'), artifactDir: 'build/atomic', durationMs: 1, tool: {}, createdAt: '2026-08-22T00:00:06.000Z',
      },
      comparison: { comparisonId: 'COMPARISON-ATOMIC', runId: 'RUN-ATOMIC' },
    }, options));
    assert(requestStore({ action: 'query', name: 'compile_by_cache', args: { cacheKey: 'CACHE-ATOMIC' } }, options) === null, 'invalid comparison partially committed its compile run');

    const staleTarget = { ...target, targetId: 'TARGET-OLD', modelId: 'MODEL-OLD', observedAt: '2026-08-21T00:00:00.000Z' };
    requestStore({ action: 'upsert_targets', records: [staleTarget] }, options);
    requestStore({ action: 'put_candidate', record: {
      candidateId: 'CANDIDATE-OLD', observationId: 'OBSERVATION-OLD', targetId: 'TARGET-OLD', sourceSha256: 'SOURCE-OLD', sourceText: 'void fixture(void) { }',
      origin: 'fixture', metadata: {}, createdAt: '2026-08-21T00:00:01.000Z',
    } }, options);
    requestStore({ action: 'put_compile', record: {
      runId: 'RUN-OLD', candidateId: 'CANDIDATE-OLD', cacheKey: 'CACHE-OLD', status: 'failed',
      artifactDir: 'build/old', durationMs: 1, tool: {}, createdAt: '2026-08-21T00:00:02.000Z',
    } }, options);
    const history = requestStore({ action: 'query', name: 'history', args: { modelId: 'MODEL-A', symbol: 'fixture', limit: 20 } }, options);
    assert(history.some((row) => row.model_id === 'MODEL-OLD' && row.is_stale === 1), 'stale model history was not retained or labeled');
    const best = requestStore({ action: 'query', name: 'best', args: { modelId: 'MODEL-A', symbol: 'fixture', limit: 20 } }, options);
    assert(best.every((row) => row.model_id === 'MODEL-A' && row.is_stale === 0), 'stale experiment influenced current best results');
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
}

function acceptedModelTests() {
  const workbench = loadWorkbenchModel();
  assert(workbench.targets.length === 4883, 'accepted function census drift');
  assert(workbench.targets.filter((target) => target.symbolByteOffset === 0).length === 4878, 'ordinary target census drift');
  const memcpy = resolveTarget(workbench, 'memcpy_bytewise');
  const context = buildTargetContext(workbench, memcpy);
  assert(context.summary.argumentRegistersReadBeforeWrite.join(',') === '$a0,$a1,$a2', 'memcpy argument context drift');
  assert(context.fields.some((field) => field.baseArgument === 0 && field.access === 'store' && field.width === 1), 'memcpy destination-byte fact missing');
  const targetSnapshot = targetRecord(memcpy, '2026-08-22T00:00:00.000Z');
  const promotedSnapshot = targetRecord({ ...memcpy, activeMatchingSource: 'src/changed.c' }, '2026-08-22T00:00:00.000Z');
  assert(targetSnapshot.targetId === promotedSnapshot.targetId && JSON.stringify(targetSnapshot.metadata) === JSON.stringify(promotedSnapshot.metadata), 'workflow promotion state changed exact machine target identity');
  const first = resolveTarget(workbench, 'func_000E5938');
  const second = resolveTarget(workbench, 'func_0013466C');
  assert(first.expectedBytes.equals(second.expectedBytes), 'known exact clone fixture drift');
}

function main() {
  classifierTests();
  familyTests();
  m2cAdapterTests();
  candidateIdentityTests();
  probeComparisonTests();
  storeTests();
  acceptedModelTests();
  console.log('Matching workbench tests: PASS');
}

if (require.main === module) main();

module.exports = { main };
