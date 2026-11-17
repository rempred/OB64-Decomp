'use strict';

const assert = require('assert/strict');
const crypto = require('crypto');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const { main, retainedSnapshot } = require('../tools/status');

const digest = bytes => crypto.createHash('sha256').update(bytes).digest('hex').toUpperCase();
const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'ob64-status-command-'));
const write = (name, value) => {
  const file = path.join(directory, name);
  const bytes = Buffer.from(JSON.stringify(value));
  fs.writeFileSync(file, bytes);
  return { file, bytes: bytes.length, sha256: digest(bytes) };
};

try {
  const target = { symbol: 'example', source: 'src/example.c', sourceSha256: 'A'.repeat(64), sourceClass: 'PURE_C' };
  const build = write('build.json', { schemaVersion: 8, status: 'constructed', targetReplacements: [target] });
  const buildIdentity = { bytes: build.bytes, sha256: build.sha256 };
  const freshValue = {
    schemaVersion: 7, status: 'pass', inputFingerprint: 'B'.repeat(64),
    baselineFingerprint: 'C'.repeat(64), buildReport: buildIdentity, targets: [target],
  };
  const fresh = write('fresh.json', freshValue);
  const verified = write('verified.json', {
    schemaVersion: 7, status: 'pass', buildReport: buildIdentity, verification: { status: 'pass' },
  });
  const romFile = path.join(directory, 'rom.bin');
  const romBytes = Buffer.from([1, 2, 3, 4]);
  fs.writeFileSync(romFile, romBytes);
  const config = write('config.json', { rom: { bytes: romBytes.length, sha256: digest(romBytes) } });
  const stateValue = {
    schemaVersion: 7, status: 'verified', verifiedAt: '2026-11-10T21:32:53.139Z',
    fingerprint: freshValue.inputFingerprint, baselineFingerprint: freshValue.baselineFingerprint,
    report: build.file, buildReport: buildIdentity,
    freshCompilationReport: fresh.file, freshCompilationSha256: fresh.sha256,
    verificationReport: verified.file, verificationSha256: verified.sha256,
    rom: { path: romFile, bytes: romBytes.length, sha256: digest(romBytes) },
  };
  const state = write('state.json', stateValue);
  const snapshot = () => retainedSnapshot(state.file, config.file);
  assert.equal(snapshot().status, 'pass');
  assert.deepEqual(snapshot().counts, { PURE_C: 1, HYBRID_C: 0 });
  const before = new Map(fs.readdirSync(directory).map(name => [name, fs.readFileSync(path.join(directory, name))]));
  let preparations = 0;
  let checks = 0;
  const context = {
    sourcePolicy: { counts: { PURE_C: 2, HYBRID_C: 1, UNKNOWN: 0 }, bytes: { PURE_C: 16, HYBRID_C: 8 } },
    model: {}, phase8: { targets: [{ symbol: 'a' }, { symbol: 'b' }, { symbol: 'c' }] },
  };
  const lines = [];
  const services = {
    log: line => lines.push(line), retainedSnapshot: snapshot,
    prepareContext: options => { assert.deepEqual(options, { readOnly: true }); preparations += 1; return context; },
    currentVerificationState: received => { assert.equal(received, context); checks += 1; return { exact: true }; },
    summarizeAcceptedOwnership: () => ({ assembly: { owners: 4, bytes: 32 }, otherData: { owners: 1, bytes: 8 } }),
  };
  assert.equal(main([], services), 0);
  assert.equal(preparations, 1);
  assert.equal(checks, 1);
  assert(lines.some(line => line.includes('2 targets / 16 bytes')));
  services.currentVerificationState = () => ({ exact: false });
  lines.length = 0;
  main([], services);
  assert(lines.some(line => line.includes('UNVERIFIED for these inputs')));
  assert(lines.some(line => line.includes('Recorded PURE_C targets') && line.endsWith(' 1')));
  assert(lines.some(line => line.includes('Exact PURE_C targets') && line.includes('0 targets')));
  services.prepareContext = () => { throw new Error('snapshot must not prepare current sources'); };
  lines.length = 0;
  assert.equal(main(['--snapshot'], services), 0);
  assert(lines.some(line => line.includes('Current sources') && line.includes('NOT CHECKED')));
  for (const [name, bytes] of before) assert(fs.readFileSync(path.join(directory, name)).equals(bytes));

  fs.appendFileSync(fresh.file, ' ');
  assert.match(snapshot().reason, /recorded hash/);
  fs.writeFileSync(fresh.file, before.get('fresh.json'));
  fs.writeFileSync(romFile, Buffer.from([4, 3, 2, 1]));
  assert.match(snapshot().reason, /canonical Rev 0/);
  fs.writeFileSync(romFile, romBytes);
  const wrongFresh = write('fresh.json', { ...freshValue, inputFingerprint: 'D'.repeat(64) });
  write('state.json', { ...stateValue, freshCompilationSha256: wrongFresh.sha256 });
  assert.match(snapshot().reason, /same accepted build/);
  const wrongClass = write('fresh.json', { ...freshValue, targets: [{ ...target, sourceClass: 'HYBRID_C' }] });
  write('state.json', { ...stateValue, freshCompilationSha256: wrongClass.sha256 });
  assert.match(snapshot().reason, /target census/);
  assert.equal(retainedSnapshot(path.join(directory, 'missing.json'), config.file).status, 'unavailable');
  assert.throws(() => main(['--unknown'], services), /Usage/);

  if (process.platform === 'win32') {
    const toolsRoot = path.join(directory, 'tools');
    const configRoot = path.join(directory, 'config/phase7');
    const nodeRoot = path.join(directory, '.toolchains/node-v0.0.0-win-x64');
    for (const folder of [toolsRoot, configRoot, nodeRoot]) fs.mkdirSync(folder, { recursive: true });
    fs.copyFileSync(path.join(__dirname, '../tools/status.ps1'), path.join(toolsRoot, 'status.ps1'));
    fs.writeFileSync(path.join(configRoot, 'conventional-build.json'), JSON.stringify({ host: { nodeVersion: 'v0.0.0', nodeExeSha256: 'F'.repeat(64) } }));
    fs.writeFileSync(path.join(nodeRoot, 'node.exe'), 'untrusted executable');
    const rejected = spawnSync('powershell.exe', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', path.join(toolsRoot, 'status.ps1'), '--snapshot'], { encoding: 'utf8' });
    assert.notEqual(rejected.status, 0);
    assert.match(rejected.stderr, /does not match the configured identity/);
  }
  console.log('Status command tests passed: current/stale separation, retained hashes, read-only inspection, and runtime rejection.');
} finally {
  assert(path.resolve(directory).startsWith(path.resolve(os.tmpdir()) + path.sep));
  fs.rmSync(directory, { recursive: true });
}
