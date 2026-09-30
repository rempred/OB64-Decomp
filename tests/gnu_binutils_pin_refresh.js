#!/usr/bin/env node
'use strict';

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const { refresh, buildCommands } = require('../tools/refresh_gnu_binutils_pins');
const repo = path.resolve(__dirname, '..');
const hash = b => crypto.createHash('sha256').update(b).digest('hex').toUpperCase();
const norm = p => p.replace(/\\/g, '/');
const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'ob64-pin-refresh-'));
const primary = JSON.parse(fs.readFileSync(path.join(repo, 'config/gnu-binutils-2.6-build.json')));
const toolchain = JSON.parse(fs.readFileSync(path.join(repo, 'config/toolchain.json')));
const phase7 = JSON.parse(fs.readFileSync(path.join(repo, 'config/phase7/conventional-build.json')));
const patchKeys = ['buildPatch', 'structuralLinkerPatch', 'binaryLmaPatch', 'hi16PairingPatch'];
let sequence = 0;
function fixture() {
  const root = path.join(temporary, String(sequence++));
  function put(name, value) {
    const file = path.join(root, name);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, typeof value === 'string' ? value : JSON.stringify(value, null, 2) + '\n');
  }
  const c = structuredClone(primary);
  put(c.buildScript.path, 'mock authenticated recipe\n');
  c.buildScript.sha256 = hash(fs.readFileSync(path.join(root, c.buildScript.path)));
  for (const key of patchKeys) {
    put(c[key].path, `mock ${key}\n`);
    c[key].sha256 = hash(fs.readFileSync(path.join(root, c[key].path)));
  }
  for (const name of Object.keys(c.outputs)) {
    const bytes = Buffer.from(`mock ${name}\n`);
    c.outputs[name] = { bytes: bytes.length, sha256: hash(bytes) };
    put(`a/${name}`, bytes.toString());
    put(`b/${name}`, bytes.toString());
  }
  put('config/toolchain.json', toolchain);
  put('config/gnu-binutils-2.6-build.json', c);
  put('config/phase7/conventional-build.json', phase7);
  put('config/matching-c-targets.json', '{\n  "toolchain": ' + JSON.stringify({
    manifest: 'config/toolchain.json', manifestSha256: '0'.repeat(64),
    buildProvenance: 'config/gnu-binutils-2.6-build.json', buildProvenanceSha256: '0'.repeat(64),
  }) + ',\n  "targets": [{ "symbol": "keep", "source": "src/keep.c" }],\n  "extra": {"untouched": true}\n}\n');
  for (const name of ['a', 'b']) {
    const work = path.join(root, `${name}-work`);
    fs.mkdirSync(work);
    const source = norm(path.join(root, 'source'));
    const bash = norm(path.join(root, 'host/usr/bin/bash.exe'));
    const report = {
      schemaVersion: 1, status: 'pass', source: { path: source, commit: c.source.commit },
      work: norm(work), output: norm(path.join(root, name)),
      buildHost: {
        bash, gcc: `gcc (GCC) ${c.buildHost.packages.find(p => p.name === 'gcc').version.replace(/-[^-]+$/, '')}`,
        make: `GNU Make ${c.buildHost.packages.find(p => p.name === 'make').version.replace(/-[^-]+$/, '')}`,
        runner: c.outputs['bin/msys-2.0.dll'],
        packages: c.buildHost.packages.map(p => ({ name: p.name, version: p.version, archive: `${p.name}-${p.version}-x86_64.pkg.tar.zst`, bytes: 100, sha256: p.archiveSha256 })),
      },
      patches: patchKeys.map(k => c[k]), versions: c.versions, outputs: c.outputs,
      commands: [
        ['git', 'clone', '--no-hardlinks', '--no-checkout', source, norm(path.join(work, 'source'))],
        ['git', 'checkout', '--detach', c.source.commit],
        ...patchKeys.map(k => ['git', 'apply', norm(path.join(root, c[k].path))]),
        ...buildCommands(c).map(command => [bash, '-lc', command]),
      ],
    };
    put(`${name}/build-report.json`, report);
  }
  return { root, bundle: path.join(root, 'a'), secondBundle: path.join(root, 'b'), put };
}
function mutate(f, name, fn) {
  const value = JSON.parse(fs.readFileSync(path.join(f.root, name)));
  fn(value);
  f.put(name, value);
}
function reject(change, pattern = /Pin refresh:|ENOENT/) {
  const f = fixture();
  const before = ['config/phase7/conventional-build.json', 'config/matching-c-targets.json'].map(n => fs.readFileSync(path.join(f.root, n)));
  change(f);
  assert.throws(() => refresh({ ...f, write: true }), pattern);
  ['config/phase7/conventional-build.json', 'config/matching-c-targets.json'].forEach((n, i) => assert.deepStrictEqual(fs.readFileSync(path.join(f.root, n)), before[i], 'rejection wrote dependent config'));
}
try {
  const f = fixture();
  const p7 = fs.readFileSync(path.join(f.root, 'config/phase7/conventional-build.json'), 'utf8');
  const targets = fs.readFileSync(path.join(f.root, 'config/matching-c-targets.json'), 'utf8');
  const beforePrimary = fs.readFileSync(path.join(f.root, 'config/gnu-binutils-2.6-build.json'));
  const plan = refresh(f);
  assert.strictEqual(plan.mode, 'check');
  assert.deepStrictEqual(plan.updatedFiles, []);
  assert.strictEqual(fs.readFileSync(path.join(f.root, 'config/phase7/conventional-build.json'), 'utf8'), p7);
  assert.strictEqual(fs.readFileSync(path.join(f.root, 'config/matching-c-targets.json'), 'utf8'), targets);
  assert(plan.changes.length > 0);
  const result = refresh({ ...f, write: true });
  assert.deepStrictEqual(result.changes, plan.changes);
  const expected7 = JSON.parse(p7), expectedTargets = JSON.parse(targets);
  for (const change of plan.changes) {
    const allowed7 = change.file === 'config/phase7/conventional-build.json'
      && ((change.path[0] === 'acceptedInputSha256' && ['config/toolchain.json', 'config/gnu-binutils-2.6-build.json', ...patchKeys.map(k => primary[k].path)].includes(change.path[1]))
      || (change.path[0] === 'binutils' && change.path[1] === 'tools' && Object.keys(primary.outputs).map(p => path.basename(p)).includes(change.path[2])));
    const allowedTargets = change.file === 'config/matching-c-targets.json' && change.path[0] === 'toolchain'
      && ['manifestSha256', 'buildProvenanceSha256'].includes(change.path[1]);
    assert(allowed7 || allowedTargets, 'unexpected delta');
  }
  for (const name of ['config/toolchain.json', 'config/gnu-binutils-2.6-build.json', ...patchKeys.map(k => primary[k].path)]) {
    expected7.acceptedInputSha256[name] = hash(fs.readFileSync(path.join(f.root, name)));
  }
  for (const name of Object.keys(primary.outputs)) {
    expected7.binutils.tools[path.basename(name)] = hash(fs.readFileSync(path.join(f.bundle, name)));
  }
  expectedTargets.toolchain.manifestSha256 = hash(fs.readFileSync(path.join(f.root, 'config/toolchain.json')));
  expectedTargets.toolchain.buildProvenanceSha256 = hash(fs.readFileSync(path.join(f.root, 'config/gnu-binutils-2.6-build.json')));
  assert.deepStrictEqual(JSON.parse(fs.readFileSync(path.join(f.root, 'config/phase7/conventional-build.json'))), expected7);
  assert.deepStrictEqual(JSON.parse(fs.readFileSync(path.join(f.root, 'config/matching-c-targets.json'))), expectedTargets);
  assert.strictEqual(fs.readFileSync(path.join(f.root, 'config/matching-c-targets.json'), 'utf8').replace(/[0-9A-F]{64}/g, 'HASH'), targets.replace(/[0-9A-F]{64}/g, 'HASH'), 'formatting changed');
  assert.deepStrictEqual(fs.readFileSync(path.join(f.root, 'config/gnu-binutils-2.6-build.json')), beforePrimary);
  assert.deepStrictEqual(refresh(f).changes, [], 'not idempotent');

  reject(x => { x.secondBundle = x.bundle; });
  reject(x => x.put('b/bin/mips-kmc-elf-as.exe', 'tampered'));
  reject(x => {
    x.put('b/bin/mips-kmc-elf-as.exe', 'new binary');
    mutate(x, 'b/build-report.json', r => { r.outputs['bin/mips-kmc-elf-as.exe'] = { bytes: 10, sha256: hash('new binary') }; });
  });
  reject(x => fs.unlinkSync(path.join(x.root, 'b/build-report.json')));
  reject(x => x.put('b/build-report.json', fs.readFileSync(path.join(x.root, 'a/build-report.json'), 'utf8')));
  reject(x => x.put('b/bin/extra.exe', 'unexpected'));
  reject(x => x.put(primary.buildScript.path, 'recipe drift'));
  reject(x => x.put(primary.buildPatch.path, 'patch drift'));
  for (const change of [
    r => { r.schemaVersion = 0; }, r => { r.status = 'fail'; },
    r => { r.source.commit = 'stale'; }, r => { r.versions.assembler = 'stale'; },
    r => { delete r.outputs['bin/msys-2.0.dll']; }, r => { r.outputs['bin/mips-kmc-elf-as.exe'].bytes++; },
    r => { r.buildHost.runner.sha256 = '0'.repeat(64); },
    r => { r.buildHost.packages[0].sha256 = '0'.repeat(64); },
    r => { r.buildHost.packages.pop(); }, r => { r.buildHost.gcc = 'other gcc'; },
    r => { r.patches.pop(); }, r => { r.commands.pop(); },
    r => { r.commands[6][2] += ' --changed'; }, r => { r.commands[2][2] = '../unsafe.patch'; },
  ]) reject(x => mutate(x, 'b/build-report.json', change));
  reject(x => mutate(x, 'config/gnu-binutils-2.6-build.json', c => { c.outputs['../escape'] = c.outputs['bin/msys-2.0.dll']; }));
  reject(x => mutate(x, 'config/toolchain.json', t => { t.tools.assembler = '../escape'; }));
  reject(x => mutate(x, 'b/build-report.json', r => {
    r.work = norm(path.join(x.root, 'a-work'));
    r.commands[0][5] = norm(path.join(x.root, 'a-work/source'));
  }));
  const linked = fixture();
  const link = path.join(linked.root, 'bundle-link');
  fs.symlinkSync(linked.bundle, link, process.platform === 'win32' ? 'junction' : 'dir');
  assert.throws(() => refresh({ ...linked, secondBundle: link }), /symlink\/reparse/);
  console.log('gnu_binutils_pin_refresh: PASS (isolated fixtures only)');
} finally {
  // One known absolute mkdtemp root, never a computed repository path.
  assert(path.dirname(temporary) === path.resolve(os.tmpdir()) && path.basename(temporary).startsWith('ob64-pin-refresh-'));
  fs.rmSync(temporary, { recursive: true, force: true });
}
