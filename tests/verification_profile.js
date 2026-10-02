#!/usr/bin/env node
'use strict';

const assert = require('assert');
const childProcess = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { withVerificationProfile, measure, targetStage } = require('../tools/lib/verification_profile');
const { parseArgs: verifyArgs } = require('../tools/verify');
const { parseArgs: auditArgs } = require('../tools/audit');

const root = fs.mkdtempSync(path.join(os.tmpdir(), 'ob64-verification-profile-'));
const originalSpawn = childProcess.spawnSync;
const originalExitCode = process.exitCode;
try {
  process.exitCode = undefined;
  assert.strictEqual(verifyArgs([]).profile, false);
  assert.strictEqual(verifyArgs(['--profile', '--target', 'func_test', '--require-pure']).profile, true);
  assert.throws(() => verifyArgs(['--profile', '--profile']), /unknown argument/);
  assert.strictEqual(auditArgs([]).profile, false);
  assert.strictEqual(auditArgs(['--profile']).profile, true);
  assert.throws(() => auditArgs(['--profile', '--profile']), /invalid argument/);
  const value = { exact: true, arbitraryEvidence: [1, 2, 3] };
  const before = JSON.stringify(value);
  assert.strictEqual(withVerificationProfile(false, 'disabled', (profile) => {
    assert.strictEqual(profile, null);
    return measure(profile, 'check', () => value);
  }, { root }), value);
  assert.strictEqual(fs.readdirSync(root).length, 0, 'disabled profiling writes no files');
  const logs = [];
  assert.strictEqual(withVerificationProfile(true, 'verify-fixture', (profile) => (
    measure(profile, 'validation', () => measure(profile, targetStage('verify-target', 'func_0002CD70'), () => value))
  ), { root, log: line => logs.push(line) }), value);
  assert.strictEqual(JSON.stringify(value), before, 'timing must not alter accepted evidence');
  assert.strictEqual(childProcess.spawnSync, originalSpawn);
  const dir = path.join(root, 'build', 'verification-profile');
  const report = JSON.parse(fs.readFileSync(path.join(dir, fs.readdirSync(dir)[0]), 'utf8'));
  assert.strictEqual(report.status, 'pass');
  assert.strictEqual(report.metadata.command, 'verify-fixture');
  assert.strictEqual(report.stages.find(stage => stage.name === 'validation').count, 1);
  assert.strictEqual(report.stages.find(stage => stage.name === 'verify-target-func-0002cd70').count, 1);
  const error = new Error('rejected verification input');
  assert.throws(() => withVerificationProfile(true, 'reject-fixture', profile => (
    measure(profile, 'reject-input', () => { throw error; })
  ), { root, log: () => {} }), actual => actual === error);
  assert.strictEqual(childProcess.spawnSync, originalSpawn, 'exception restores process observer');
  const rejectedFile = fs.readdirSync(dir).find(file => file.startsWith('reject_fixture-'));
  const rejected = JSON.parse(fs.readFileSync(path.join(dir, rejectedFile), 'utf8'));
  assert.strictEqual(rejected.status, 'error');
  assert.strictEqual(rejected.stages.find(stage => stage.name === 'reject-input').failures, 1);
  process.exitCode = 1;
  withVerificationProfile(true, 'policy-fixture', () => value, { root, log: () => {} });
  const policyFile = fs.readdirSync(dir).find(file => file.startsWith('policy_fixture-'));
  assert.strictEqual(JSON.parse(fs.readFileSync(path.join(dir, policyFile), 'utf8')).status, 'error');
  process.exitCode = undefined;
  const blockedRoot = path.join(root, 'regular-file');
  fs.writeFileSync(blockedRoot, 'not a directory');
  assert.throws(() => withVerificationProfile(true, 'io-fixture', () => { throw error; },
    { root: blockedRoot, log: () => {} }), actual => actual === error,
  'sidecar write failure preserves original verification failure');
  assert.strictEqual(childProcess.spawnSync, originalSpawn);
  assert.strictEqual(withVerificationProfile(true, 'logger-fixture', () => value,
    { root, log: () => { throw new Error('broken logging sink'); } }), value);
  assert.throws(() => withVerificationProfile(true, 'finish-fixture', profile => {
    profile.finish = () => { throw new Error('broken timing sink'); };
    throw error;
  }, { root, log: () => { throw new Error('broken logging sink'); } }), actual => actual === error);
  assert.strictEqual(childProcess.spawnSync, originalSpawn, 'broken diagnostics restore process observer');
  console.log('Verification profile: PASS (evidence unchanged, failure preserved, observer restored)');
} finally {
  process.exitCode = originalExitCode;
  childProcess.spawnSync = originalSpawn;
  assert(path.resolve(root).startsWith(path.resolve(os.tmpdir()) + path.sep + 'ob64-verification-profile-'));
  fs.rmSync(root, { recursive: true, force: true });
}
