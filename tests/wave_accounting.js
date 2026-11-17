'use strict';

const assert = require('assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const test = require('node:test');
const accounting = require('../tools/lib/wave_accounting');
const retention = require('../tools/lib/scratch_retention');
const cli = require('../tools/wave-accounting');

const root = fs.mkdtempSync(path.join(os.tmpdir(), 'ob64-wave-accounting-'));
const stamp = seconds => new Date(Date.UTC(2026, 10, 9, 0, 0, seconds)).toISOString();
const manifest = () => ({ schemaVersion: 1, wave: 'fixture', window: { startedAt: stamp(0), finishedAt: stamp(60) } });
let nextFile = 0;
function json(value) {
  const file = path.join(root, `${nextFile++}.json`);
  fs.writeFileSync(file, JSON.stringify(value));
  return file;
}
function profile(start, end) {
  return json({ schemaVersion: 1, status: 'pass', startedAt: stamp(start), finishedAt: stamp(end),
    totalMs: (end - start) * 1000, childProcessMs: 1000, stages: [], childProcesses: [] });
}
function snapshot() {
  return retention.census(root).files.map(entry => ({ path: entry.path, bytes: entry.bytes,
    hash: crypto.createHash('sha256').update(fs.readFileSync(path.join(root, entry.path))).digest('hex') }));
}

test.after(() => {
  const census = retention.census(root);
  assert.deepEqual(census.issues, []);
  retention.plain(root, 'directory');
  fs.rmSync(root, { recursive: true });
});

test('overlapping commands, worker activity, and uncovered time are not double-counted', () => {
  const input = { ...manifest(), workers: ['worker', 'missing'], profiles: [
    { path: profile(0, 20), worker: 'worker' }, { path: profile(10, 30), worker: 'worker' },
  ], activities: [
    { worker: 'worker', kind: 'tooling-wait', startedAt: stamp(0), finishedAt: stamp(30), evidence: 'fixture observation' },
    { worker: 'worker', kind: 'matching', startedAt: stamp(40), finishedAt: stamp(50), evidence: 'fixture observation' },
  ] };
  const before = snapshot(), result = accounting.report(input), worker = result.timing.byWorker.find(row => row.worker === 'worker');
  assert.equal(worker.observedMs, 40000);
  assert.equal(worker.unobservedMs, 20000);
  assert.equal(worker.byKindMs['tool-command'], 30000);
  assert.equal(worker.byKindMs['tooling-wait'], 30000);
  assert.equal(worker.simultaneousMs, 30000);
  assert.equal(worker.ambiguousActivityMs, 0);
  assert.equal(result.timing.byWorker.find(row => row.worker === 'missing').unobservedMs, 60000);
  assert.deepEqual(snapshot(), before, 'reporting changed its inputs');
});

test('different workers can overlap and contradictory activity for one worker remains explicit', () => {
  const activity = (worker, kind) => ({ worker, kind, startedAt: stamp(5), finishedAt: stamp(15), evidence: 'recorded fixture' });
  const result = accounting.report({ ...manifest(), activities: [activity('a', 'matching'), activity('b', 'matching')] });
  assert.equal(result.timing.calendarCoverage.ambiguousActivityMs, 0);
  assert.equal(result.timing.calendarCoverage.observedMs, 10000);
  const ambiguous = accounting.report({ ...manifest(), activities: [activity('a', 'matching'), activity('a', 'service-wait')] });
  assert.equal(ambiguous.timing.byWorker[0].ambiguousActivityMs, 10000);
});

test('diagnostic duration subsets cannot manufacture a reasoning or waiting timeline', () => {
  const file = json({ timings: { childProcessElapsedMs: 2800, nativeCompilerMs: 24, nativeAssemblerMs: 25, childElapsedMs: 2300 } });
  const result = accounting.report({ ...manifest(), diagnostics: [{ path: file, worker: 'a' }] });
  assert.equal(result.timing.diagnosticSums.childProcessElapsedMs, 2800);
  assert.equal(result.timing.diagnosticSums.measuredNativeCompilerMs, 24);
  assert.equal(result.timing.byWorker[0].unobservedMs, 60000);
  assert.equal(result.timing.calendarCoverage.observedMs, 0);
  const failed = json({ timings: { childProcessElapsedMs: 3100 } });
  const partial = accounting.report({ ...manifest(), diagnostics: [{ path: failed, worker: 'a' }] });
  assert.equal(partial.timing.diagnosticSums.childProcessElapsedMs, 3100);
  assert.equal(partial.timing.diagnosticSums.nativeCompilerMeasurements, 0);
  assert.equal(partial.timing.diagnostics[0].nativeCompilerMs, null);
});

test('missing and invalid timing files remain incomplete, and partial intervals are clipped', () => {
  const result = accounting.report({ ...manifest(), profiles: [
    { path: path.join(root, 'missing'), worker: 'a' },
    { path: profile(-5, 5), worker: 'a' },
    { path: json({ schemaVersion: 1 }), worker: 'a' },
  ] });
  assert.equal(result.inputsComplete, false);
  assert.equal(result.inputIssues.length, 2);
  assert.equal(result.timing.profiles[0].selectedCompletely, false);
  assert.equal(result.timing.profiles[0].selectedCalendarMs, 5000);
  assert.equal(result.timing.byWorker[0].unobservedMs, 55000);
  const missing = accounting.report({ ...manifest(), profiles: [{ path: path.join(root, 'absent'), worker: 'missing-worker' }] });
  assert.equal(missing.timing.byWorker[0].worker, 'missing-worker');
  assert.equal(missing.timing.byWorker[0].unobservedMs, 60000);
});

test('completed scratch records are distinguished from other files while legacy runs stay unclassified', () => {
  const diff = path.join(root, 'diff');
  fs.mkdirSync(diff);
  const output = path.join(diff, 'func_test-1794182400000-abcdef');
  const config = { maxRuns: 32, maxBytes: 10000000, maxRecordBytes: 10000000, floorBytes: 1, peakBytes: 1 };
  const handle = retention.begin({ root: diff, output, config, readSpace: () => 10000000 });
  const source = Buffer.from('int test(void) { return 1; }\n');
  const identity = { bytes: source.length, sha256: crypto.createHash('sha256').update(source).digest('hex').toUpperCase() };
  fs.mkdirSync(path.join(root, 'src'));
  fs.writeFileSync(path.join(root, 'src/test.c'), source);
  const classification = { source: 'src/test.c', sourceBytes: source.length, sourceSha256: identity.sha256, compilationInput: identity, digest: 'fixture' };
  const capture = retention.captureSource(handle, root, classification, source);
  fs.mkdirSync(path.join(output, 'src'));
  fs.writeFileSync(path.join(output, 'src/test.c'), source);
  fs.writeFileSync(path.join(output, 'object.bin'), Buffer.alloc(800));
  retention.captureReport(handle, capture, { symbol: 'func_test', output, source: 'src/test.c', sourcePolicyDigest: 'fixture',
    compilationInput: identity, object: { compilationInput: { path: 'src/test.c', ...identity } }, comparison: { exact: true } });
  handle.release('complete');
  const legacy = path.join(diff, 'legacy');
  fs.mkdirSync(legacy);
  fs.writeFileSync(path.join(legacy, 'unknown.bin'), Buffer.alloc(53));
  const before = snapshot(), result = accounting.report({ ...manifest(), diffRoots: [diff] }), storage = result.storage.roots[0];
  assert.equal(storage.byteCensusComplete, true);
  assert.equal(storage.referenceInventoryComplete, false);
  assert.equal(storage.suppliedReferenceInputsComplete, true);
  assert.equal(result.inputsComplete, true);
  assert.equal(storage.unclassifiedMeasuredBytes, 53);
  assert(storage.retainedRecordBytes > 0);
  assert(storage.otherRunBytes >= 800);
  assert.equal(storage.measuredBytes, storage.retainedRecordBytes + storage.otherRunBytes + 53);
  assert(storage.runs.every(run => run.wouldDelete === false));
  assert.deepEqual(snapshot(), before);
});

test('a supplied missing reference is reported as incomplete and returns the failure exit status', () => {
  const diff = path.join(root, 'empty-diff');
  fs.mkdirSync(diff);
  const file = json({ ...manifest(), diffRoots: [diff], references: { docs: [path.join(root, 'missing-docs')] } });
  const log = console.log, priorExitCode = process.exitCode;
  console.log = () => {};
  try {
    const result = cli.main(['--manifest', file]);
    assert.equal(result.inputsComplete, false);
    assert.equal(result.storage.byteCensusComplete, true);
    assert.equal(result.storage.referenceInventoryComplete, false);
    assert.equal(result.storage.roots[0].suppliedReferenceInputsComplete, false);
    assert.match(result.inputIssues[0], /missing-docs/);
    assert.equal(process.exitCode, 2);
  } finally {
    console.log = log;
    process.exitCode = priorExitCode;
  }
});

test('unsafe ancestry, duplicate roots and timestamps without zones cannot silently pass', () => {
  assert.throws(() => accounting.report({ ...manifest(), profiles: [{ path: 'relative.json', worker: 'a' }] }), /absolute/);
  assert.throws(() => accounting.report({ ...manifest(), diffRoots: [root, path.join(root, 'nested')] }), /overlap/);
  assert.throws(() => accounting.report({ ...manifest(), window: { startedAt: '2026-11-09T00:00:00', finishedAt: stamp(30) } }), /timezones/);
  assert.throws(() => accounting.report({ ...manifest(), activities: [{ worker: 'a', kind: 'made-up', startedAt: stamp(1), finishedAt: stamp(2), evidence: 'x' }] }), /supported kind/);
  assert.throws(() => accounting.report({ ...manifest(), workers: 'a' }), /array/);
  const file = profile(0, 1);
  assert.throws(() => accounting.report({ ...manifest(), profiles: [{ path: file, worker: 'a' }, { path: file, worker: 'a' }] }), /duplicate/);
  assert.throws(() => cli.main(['--apply']), /manifest/);
  assert.throws(() => cli.main(['--manifest', 'relative']), /absolute/);
});

test('linked roots are refused without traversing their targets', () => {
  const target = path.join(root, 'link-target'), link = path.join(root, 'linked-root');
  fs.mkdirSync(target);
  fs.writeFileSync(path.join(target, 'sentinel.txt'), 'preserve');
  fs.symlinkSync(target, link, process.platform === 'win32' ? 'junction' : 'dir');
  try {
    const result = accounting.report({ ...manifest(), diffRoots: [link] });
    assert.equal(result.storage.byteCensusComplete, false);
    assert.equal(result.inputsComplete, false);
    assert.match(result.inputIssues[0], /linked\/reparse/);
    assert.equal(fs.readFileSync(path.join(target, 'sentinel.txt'), 'utf8'), 'preserve');
  } finally {
    fs.unlinkSync(link);
  }
});
