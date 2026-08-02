'use strict';

const assert = require('assert');
const childProcess = require('child_process');
const crypto = require('crypto');
const fs = require('fs');
const os = require('os');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CAPTURE = path.join(ROOT, 'tools', 'capture_phase5b_splat_lock.js');
const LOCK = path.join(ROOT, 'config', 'splat', 'splat64-0.34.0.lock.json');
const PROVENANCE = path.join(ROOT, 'config', 'splat', 'splat64-0.34.0.provenance.json');
const SUPERSEDED = {
  historical: {
    path: 'C:\\Users\\Joe\\.codex\\phase5b-splat-20260801-r4\\historical\\pylibyaml-0.1.0-frozen-py3-none-any.whl',
    sha256: 'D00EE73032DA40E52314BB48401BDABE70D7FEAD0DFE4622F2468B4913FEAC42',
  },
  r6: {
    path: 'C:\\Users\\Joe\\.codex\\phase5b-splat-20260801-r6\\build\\pylibyaml-0.1.0-py3-none-any.whl',
    sha256: '545D40F5EDABD59C305361BD6C7A4CCC9113139B36A7D66CA5E049193B1C1108',
  },
};

function sha256(file) { return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex').toUpperCase(); }
function argument(flag) { const index = process.argv.indexOf(flag); return index < 0 ? null : path.resolve(process.argv[index + 1]); }
function run(artifactRoot, lockFile, python, pyproject) {
  return childProcess.spawnSync(process.execPath, [CAPTURE, '--artifact-root', artifactRoot, '--python', python, '--pyproject', pyproject, '--lock', lockFile], { cwd: ROOT, encoding: 'utf8' });
}

function main() {
  const reportFile = argument('--report');
  const lock = JSON.parse(fs.readFileSync(LOCK, 'utf8'));
  const provenance = JSON.parse(fs.readFileSync(PROVENANCE, 'utf8'));
  const scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'ob64-phase5b-capture-binding-'));
  const trackedBefore = sha256(LOCK);
  const controls = [];
  try {
    for (const [name, superseded] of Object.entries(SUPERSEDED)) {
      assert.strictEqual(sha256(superseded.path), superseded.sha256, `${name} control wheel identity drift`);
      const artifactRoot = path.join(scratch, `${name}-artifacts`);
      fs.mkdirSync(artifactRoot);
      for (const file of fs.readdirSync(lock.artifactRoot)) fs.copyFileSync(path.join(lock.artifactRoot, file), path.join(artifactRoot, file));
      fs.copyFileSync(superseded.path, path.join(artifactRoot, provenance.localBuilds.pylibyaml.wheel));
      const destination = path.join(scratch, `${name}.lock.json`);
      fs.copyFileSync(LOCK, destination);
      const before = sha256(destination);
      const result = run(artifactRoot, destination, lock.isolatedEnvironment.interpreter, provenance.splatSnapshot.pyproject);
      const after = sha256(destination);
      assert.notStrictEqual(result.status, 0, `${name} superseded wheel unexpectedly captured`);
      assert.strictEqual(after, before, `${name} rejection changed the destination lock`);
      assert.match(`${result.stderr}${result.stdout}`, /Authenticated local build output drift: pylibyaml/, `${name} rejection did not name local build output drift`);
      controls.push({ name, selectedWheelSha256: superseded.sha256, exitCode: result.status, destinationBeforeSha256: before, destinationAfterSha256: after, destinationUnchanged: before === after });
    }
    const acceptedDestination = path.join(scratch, 'accepted.lock.json');
    fs.copyFileSync(LOCK, acceptedDestination);
    const accepted = run(lock.artifactRoot, acceptedDestination, lock.isolatedEnvironment.interpreter, provenance.splatSnapshot.pyproject);
    assert.strictEqual(accepted.status, 0, accepted.stderr || accepted.stdout);
    assert.strictEqual(sha256(acceptedDestination), sha256(LOCK), 'accepted capture changed the frozen lock');
    assert.strictEqual(sha256(LOCK), trackedBefore, 'focused controls changed the tracked valid lock');
    const report = {
      schemaVersion: 1,
      status: 'pass',
      captureSha256: sha256(CAPTURE),
      accepted: { exitCode: accepted.status, lockSha256: sha256(acceptedDestination), artifactCount: lock.artifacts.length, distributionCount: lock.packages.length, finalWheelSha256: provenance.localBuilds.pylibyaml.wheelSha256 },
      rejected: controls,
      trackedLockBeforeSha256: trackedBefore,
      trackedLockAfterSha256: sha256(LOCK),
      trackedLockUnchanged: trackedBefore === sha256(LOCK),
    };
    if (reportFile) { fs.mkdirSync(path.dirname(reportFile), { recursive: true }); fs.writeFileSync(reportFile, `${JSON.stringify(report, null, 2)}\n`); }
    console.log(JSON.stringify(report));
  } finally {
    fs.rmSync(scratch, { recursive: true, force: true });
  }
}

main();
