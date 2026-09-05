#!/usr/bin/env node
'use strict';

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const {
  createDiffProfiler,
  executableName,
  profileOutputPath,
  writeProfileReport,
} = require('../tools/lib/diff_profile');
const { parseArguments, prepareContextOptions } = require('../tools/diff');

function main() {
  let now = 0;
  const originalSpawnSync = () => {
    now += 5;
    return { status: 0, error: null };
  };
  const spawnModule = { spawnSync: originalSpawnSync };
  const profiler = createDiffProfiler({
    clock: () => now,
    spawnModule,
    startedAt: '2026-09-04T01:02:03.004Z',
    finishedAt: '2026-09-04T01:02:04.004Z',
  });

  profiler.installChildProcessObserver();
  profiler.measure('outer', () => {
    now += 2;
    profiler.measure('inner', () => {
      now += 3;
      spawnModule.spawnSync('C:\\fixture\\compiler.exe', ['fixture.c']);
      now += 2;
    });
    now += 4;
  });
  profiler.measure('outer', () => { now += 1; });
  assert.throws(() => profiler.measure('failing', () => {
    now += 2;
    throw new Error('fixture failure');
  }), /fixture failure/);
  now += 1;

  const report = profiler.finish({ status: 'pass', fixture: true });
  assert.strictEqual(spawnModule.spawnSync, originalSpawnSync, 'spawnSync observer was not restored');
  assert.strictEqual(report.totalMs, 20);
  assert.strictEqual(report.topLevelStageMs, 19);
  assert.strictEqual(report.unattributedMs, 1);
  assert.strictEqual(report.childProcessMs, 5);
  assert.deepStrictEqual(report.stages, [
    {
      name: 'inner', parent: 'outer', count: 1, totalMs: 10, exclusiveMs: 10,
      minMs: 10, maxMs: 10, failures: 0,
    },
    {
      name: 'outer', parent: null, count: 2, totalMs: 17, exclusiveMs: 7,
      minMs: 1, maxMs: 16, failures: 0,
    },
    {
      name: 'failing', parent: null, count: 1, totalMs: 2, exclusiveMs: 2,
      minMs: 2, maxMs: 2, failures: 1,
    },
  ]);
  assert.deepStrictEqual(report.childProcesses, [{
    stage: 'inner', executable: 'compiler.exe', count: 1, totalMs: 5,
    exclusiveMs: 5, minMs: 5, maxMs: 5, failures: 0,
  }]);
  assert.throws(() => profiler.measure('late', () => {}), /cannot measure after finish/);
  assert.strictEqual(executableName('/fixture/bin/tool.exe'), 'tool.exe');

  let terminatedNow = 0;
  const terminatedOriginalSpawnSync = () => {
    terminatedNow += 7;
    return { status: null, signal: 'SIGTERM', error: null };
  };
  const terminatedSpawnModule = { spawnSync: terminatedOriginalSpawnSync };
  const terminatedProfiler = createDiffProfiler({
    clock: () => terminatedNow,
    spawnModule: terminatedSpawnModule,
    startedAt: '2026-09-04T01:03:03.004Z',
    finishedAt: '2026-09-04T01:03:04.004Z',
  });
  terminatedProfiler.installChildProcessObserver();
  const terminated = terminatedProfiler.measure('signal-child', () => (
    terminatedSpawnModule.spawnSync('C:\\fixture\\terminated.exe', [])
  ));
  assert.strictEqual(terminated.status, null);
  assert.strictEqual(terminated.signal, 'SIGTERM');
  const terminatedReport = terminatedProfiler.finish({ status: 'error', fixture: true });
  assert.strictEqual(
    terminatedSpawnModule.spawnSync,
    terminatedOriginalSpawnSync,
    'signal fixture spawnSync observer was not restored',
  );
  assert.deepStrictEqual(terminatedReport.childProcesses, [{
    stage: 'signal-child', executable: 'terminated.exe', count: 1, totalMs: 7,
    exclusiveMs: 7, minMs: 7, maxMs: 7, failures: 1,
  }]);
  assert.strictEqual(terminatedReport.stages[0].failures, 0, 'observer changed command behavior');

  assert.deepStrictEqual(parseArguments(['func_fixture']), {
    command: 'diff', profile: false, symbol: 'func_fixture',
  });
  assert.deepStrictEqual(parseArguments(['--profile', 'func_fixture']), {
    command: 'diff', profile: true, symbol: 'func_fixture',
  });
  assert.deepStrictEqual(parseArguments(['func_fixture', '--profile']), {
    command: 'diff', profile: true, symbol: 'func_fixture',
  });
  assert.deepStrictEqual(parseArguments(['--help']), { command: 'help' });
  assert.throws(() => parseArguments([]), /one target symbol is required/);
  assert.throws(() => parseArguments(['--profile', '--profile', 'func_fixture']), /only once/);
  assert.throws(() => parseArguments(['--unknown', 'func_fixture']), /unknown option/);

  const contextProfiler = { measure() {} };
  assert.deepStrictEqual(prepareContextOptions('func_fixture'), {
    allowMissingRelocationContracts: ['func_fixture'],
  }, 'ordinary diff context options changed');
  const profiledContextOptions = prepareContextOptions('func_fixture', contextProfiler);
  assert.deepStrictEqual(profiledContextOptions.allowMissingRelocationContracts, ['func_fixture']);
  assert.strictEqual(profiledContextOptions.profile, contextProfiler, 'diff profiler was not forwarded to context preparation');

  const scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'ob64-diff-profile-'));
  try {
    const output = profileOutputPath(scratch, 'func_fixture', profiler.startedAt, 42);
    assert.strictEqual(
      path.basename(output),
      'func_fixture-20260904010203004-42.json',
      'profile filename identity drift',
    );
    writeProfileReport(output, report);
    assert.deepStrictEqual(JSON.parse(fs.readFileSync(output, 'utf8')), report);
  } finally {
    fs.rmSync(scratch, { recursive: true, force: true });
  }

  console.log(JSON.stringify({
    status: 'pass',
    totalMs: report.totalMs,
    topLevelStageMs: report.topLevelStageMs,
    childProcessMs: report.childProcessMs,
    spawnObserverRestored: true,
    signalTerminationCountedAsFailure: true,
    argumentModes: ['normal', 'profile'],
    preparationProfilerForwarded: true,
  }, null, 2));
}

main();
