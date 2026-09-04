'use strict';

const childProcess = require('child_process');
const fs = require('fs');
const path = require('path');

const PROFILE_SCHEMA_VERSION = 1;
const STAGE_NAME = /^[a-z0-9][a-z0-9.-]*$/;

function fail(message) {
  throw new Error(`diff profile: ${message}`);
}

function roundMilliseconds(value) {
  return Math.round(value * 1000) / 1000;
}

function executableName(value) {
  const text = String(value || '');
  return path.win32.basename(text.replace(/\//g, '\\')) || '<unknown>';
}

function addAggregate(map, key, values) {
  let record = map.get(key);
  if (!record) {
    record = {
      ...values.identity,
      count: 0,
      totalMs: 0,
      exclusiveMs: 0,
      minMs: Number.POSITIVE_INFINITY,
      maxMs: 0,
      failures: 0,
      order: map.size,
    };
    map.set(key, record);
  }
  record.count += 1;
  record.totalMs += values.durationMs;
  record.exclusiveMs += values.exclusiveMs === undefined ? values.durationMs : values.exclusiveMs;
  record.minMs = Math.min(record.minMs, values.durationMs);
  record.maxMs = Math.max(record.maxMs, values.durationMs);
  if (values.failed) record.failures += 1;
}

function formatAggregate(record) {
  const result = { ...record };
  delete result.order;
  result.totalMs = roundMilliseconds(result.totalMs);
  result.exclusiveMs = roundMilliseconds(result.exclusiveMs);
  result.minMs = roundMilliseconds(result.minMs);
  result.maxMs = roundMilliseconds(result.maxMs);
  return result;
}

function createDiffProfiler(options = {}) {
  const clock = options.clock || (() => Number(process.hrtime.bigint()) / 1e6);
  const spawnModule = options.spawnModule || childProcess;
  if (typeof clock !== 'function' || !spawnModule || typeof spawnModule.spawnSync !== 'function') {
    fail('profiler dependencies are malformed');
  }
  const startedAt = options.startedAt || new Date().toISOString();
  const startedMs = clock();
  const stageStack = [];
  const stages = new Map();
  const children = new Map();
  let originalSpawnSync = null;
  let finished = false;

  function measure(name, callback) {
    if (finished) fail('cannot measure after finish');
    if (typeof name !== 'string' || !STAGE_NAME.test(name) || typeof callback !== 'function') {
      fail('stage measurement is malformed');
    }
    const parent = stageStack.length ? stageStack[stageStack.length - 1] : null;
    const frame = { name, parent: parent ? parent.name : null, startedMs: clock(), childMs: 0 };
    stageStack.push(frame);
    let failed = false;
    try {
      return callback();
    } catch (error) {
      failed = true;
      throw error;
    } finally {
      const durationMs = clock() - frame.startedMs;
      if (stageStack.pop() !== frame) fail('stage stack drift');
      if (parent) parent.childMs += durationMs;
      addAggregate(stages, `${frame.parent || '<root>'}\0${name}`, {
        identity: { name, parent: frame.parent },
        durationMs,
        exclusiveMs: Math.max(0, durationMs - frame.childMs),
        failed,
      });
    }
  }

  function installChildProcessObserver() {
    if (finished || originalSpawnSync) fail('child-process observer lifecycle drift');
    originalSpawnSync = spawnModule.spawnSync;
    spawnModule.spawnSync = function profiledSpawnSync(...args) {
      const stage = stageStack.length ? stageStack[stageStack.length - 1].name : '<unattributed>';
      const executable = executableName(args[0]);
      const childStartedMs = clock();
      let result;
      let failed = false;
      try {
        result = originalSpawnSync.apply(this, args);
        failed = Boolean(result && (result.error || (result.status !== null && result.status !== 0)));
        return result;
      } catch (error) {
        failed = true;
        throw error;
      } finally {
        addAggregate(children, `${stage}\0${executable.toLowerCase()}`, {
          identity: { stage, executable },
          durationMs: clock() - childStartedMs,
          failed,
        });
      }
    };
  }

  function restoreChildProcessObserver() {
    if (!originalSpawnSync) return;
    spawnModule.spawnSync = originalSpawnSync;
    originalSpawnSync = null;
  }

  function finish(metadata = {}) {
    if (finished || stageStack.length !== 0) fail('profiler finish lifecycle drift');
    restoreChildProcessObserver();
    finished = true;
    const totalMs = clock() - startedMs;
    const stageRecords = [...stages.values()].sort((left, right) => left.order - right.order).map(formatAggregate);
    const childRecords = [...children.values()].sort((left, right) => left.order - right.order).map(formatAggregate);
    const topLevelMs = stageRecords.filter((record) => record.parent === null)
      .reduce((sum, record) => sum + record.totalMs, 0);
    const childProcessMs = childRecords.reduce((sum, record) => sum + record.totalMs, 0);
    return {
      schemaVersion: PROFILE_SCHEMA_VERSION,
      status: metadata.status || 'pass',
      startedAt,
      finishedAt: options.finishedAt || new Date().toISOString(),
      totalMs: roundMilliseconds(totalMs),
      topLevelStageMs: roundMilliseconds(topLevelMs),
      unattributedMs: roundMilliseconds(Math.max(0, totalMs - topLevelMs)),
      childProcessMs: roundMilliseconds(childProcessMs),
      stages: stageRecords,
      childProcesses: childRecords,
      metadata,
    };
  }

  return {
    startedAt,
    finish,
    installChildProcessObserver,
    measure,
    restoreChildProcessObserver,
  };
}

function profileOutputPath(root, symbol, startedAt, processId = process.pid) {
  if (typeof symbol !== 'string' || !/^[A-Za-z_.$][A-Za-z0-9_.$]*$/.test(symbol)) {
    fail('profile target symbol is malformed');
  }
  const stamp = String(startedAt).replace(/[^0-9]/g, '').slice(0, 17);
  if (!stamp) fail('profile timestamp is malformed');
  return path.join(root, 'build', 'warm-diff-profile', `${symbol}-${stamp}-${processId}.json`);
}

function writeProfileReport(file, report) {
  const directory = path.dirname(file);
  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(report, null, 2)}\n`);
  return file;
}

module.exports = {
  PROFILE_SCHEMA_VERSION,
  createDiffProfiler,
  executableName,
  profileOutputPath,
  roundMilliseconds,
  writeProfileReport,
};
