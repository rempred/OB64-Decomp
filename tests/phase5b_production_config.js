#!/usr/bin/env node
'use strict';

const assert = require('assert');
const childProcess = require('child_process');
const crypto = require('crypto');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { directInventory } = require('../tools/lib/phase5b_splat_dependencies');

const ROOT = path.resolve(__dirname, '..');
const productIndex = process.argv.indexOf('--phase5a-root');
if (productIndex < 0 || !process.argv[productIndex + 1]) throw new Error('Missing --phase5a-root');
const PRODUCT = path.resolve(process.argv[productIndex + 1]);
const scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'ob64-phase5b-config-'));
function run(args) { return childProcess.spawnSync(process.execPath, args, { cwd: ROOT, encoding: 'utf8' }); }
function productionArgs(root) { return [path.join(ROOT, 'tools', 'verify_phase5b_production_config.js'), '--config-root', root, '--phase5a-root', PRODUCT]; }
function sha256(file) { return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex').toUpperCase(); }
function copyConfig() { const target = path.join(scratch, `config-${fs.readdirSync(scratch).length}`); fs.mkdirSync(path.join(target, 'config'), { recursive: true }); fs.cpSync(path.join(ROOT, 'config', 'splat'), path.join(target, 'config', 'splat'), { recursive: true }); fs.cpSync(path.join(ROOT, 'config', 'segments'), path.join(target, 'config', 'segments'), { recursive: true }); return target; }
function rejected(result, label) { assert.notStrictEqual(result.status, 0, `${label} unexpectedly passed`); }
function copyPhase5a() {
  const target = path.join(scratch, `phase5a-${fs.readdirSync(scratch).length}`);
  const manifest = JSON.parse(fs.readFileSync(path.join(PRODUCT, 'verification', 'product-manifest.json'), 'utf8'));
  for (const row of manifest.files) { const out = path.join(target, row.path); fs.mkdirSync(path.dirname(out), { recursive: true }); fs.copyFileSync(path.join(PRODUCT, row.path), out); fs.chmodSync(out, 0o666); }
  fs.mkdirSync(path.join(target, 'verification'), { recursive: true });
  fs.copyFileSync(path.join(PRODUCT, 'verification', 'product-manifest.json'), path.join(target, 'verification', 'product-manifest.json'));
  return target;
}
function lockCopy() { const file = path.join(scratch, `lock-${fs.readdirSync(scratch).length}.json`); fs.copyFileSync(path.join(ROOT, 'config', 'splat', 'splat64-0.34.0.lock.json'), file); return file; }
function lockRejected(mutate, label) { const file = lockCopy(); const lock = JSON.parse(fs.readFileSync(file, 'utf8')); mutate(lock); fs.writeFileSync(file, `${JSON.stringify(lock, null, 2)}\n`); rejected(run([path.join(ROOT, 'tools', 'verify_phase5b_splat_lock.js'), '--lock', file, '--artifact-root', lock.artifactRoot]), label); }
function lockRejectedBoth(mutate, label) { const root = copyConfig(); const file = path.join(root, 'config', 'splat', 'splat64-0.34.0.lock.json'); const lock = JSON.parse(fs.readFileSync(file, 'utf8')); mutate(lock); fs.writeFileSync(file, `${JSON.stringify(lock, null, 2)}\n`); rejected(run([path.join(ROOT, 'tools', 'verify_phase5b_splat_lock.js'), '--lock', file, '--artifact-root', lock.artifactRoot]), `${label} direct`); rejected(run(productionArgs(root)), `${label} production`); }
function provenanceRejectedBoth(mutate, label) {
  const root = copyConfig();
  const lockFile = path.join(root, 'config', 'splat', 'splat64-0.34.0.lock.json');
  const provenanceFile = path.join(root, 'config', 'splat', 'splat64-0.34.0.provenance.json');
  const provenance = JSON.parse(fs.readFileSync(provenanceFile, 'utf8'));
  const manifest = JSON.parse(fs.readFileSync(provenance.localBuilds.pylibyaml.reproducibleBuild.manifest, 'utf8'));
  mutate(manifest, root);
  const manifestFile = path.join(root, 'reproducible-build-manifest.json');
  fs.writeFileSync(manifestFile, `${JSON.stringify(manifest, null, 2)}\n`);
  provenance.localBuilds.pylibyaml.reproducibleBuild.manifest = manifestFile;
  provenance.localBuilds.pylibyaml.reproducibleBuild.manifestSha256 = sha256(manifestFile);
  fs.writeFileSync(provenanceFile, `${JSON.stringify(provenance, null, 2)}\n`);
  const lock = JSON.parse(fs.readFileSync(lockFile, 'utf8'));
  rejected(run([path.join(ROOT, 'tools', 'verify_phase5b_splat_lock.js'), '--lock', lockFile, '--provenance', provenanceFile, '--artifact-root', lock.artifactRoot]), `${label} direct`);
  rejected(run(productionArgs(root)), `${label} production`);
}
try {
  const pyproject = 'C:\\Users\\Joe\\.codex\\phase5b-splat-20260801-third-review-correction-r2\\snapshot\\pyproject.toml';
  const python = 'C:\\Users\\Joe\\.codex\\phase5b-splat-20260801-r4\\venv\\Scripts\\python.exe';
  const movedToml = path.join(scratch, 'moved.toml');
  fs.writeFileSync(movedToml, fs.readFileSync(pyproject, 'utf8').replace('    "pylibyaml",', '').replace('mips = [', 'mips = [\n    "pylibyaml", # preserved literal moved structurally'));
  assert.strictEqual(directInventory(python, movedToml).find((row) => row.name === 'pylibyaml').group, 'mips', 'structural group move was not parsed');
  const omittedToml = path.join(scratch, 'omitted.toml');
  fs.writeFileSync(omittedToml, fs.readFileSync(pyproject, 'utf8').replace('    "pylibyaml",', '    # pylibyaml remains only in this comment,'));
  assert.strictEqual(directInventory(python, omittedToml).some((row) => row.name === 'pylibyaml'), false, 'comment restored omitted dependency');
  const baseline = run([path.join(ROOT, 'tools', 'verify_phase5b_production_config.js'), '--phase5a-root', PRODUCT]);
  assert.strictEqual(baseline.status, 0, `baseline production verification failed: ${baseline.stderr || baseline.stdout}`);
  let root = copyConfig(); let file = path.join(root, 'config', 'splat', 'us_rev0.semantic.json'); let semantic = JSON.parse(fs.readFileSync(file, 'utf8')); semantic.rows[1].romStart += 1; fs.writeFileSync(file, `${JSON.stringify(semantic, null, 2)}\n`); rejected(run(productionArgs(root)), 'non-contiguous primary row control');
  root = copyConfig(); file = path.join(root, 'config', 'splat', 'us_rev0.semantic.json'); semantic = JSON.parse(fs.readFileSync(file, 'utf8')); semantic.rows[0].segmentType = 'asm'; fs.writeFileSync(file, `${JSON.stringify(semantic, null, 2)}\n`); rejected(run(productionArgs(root)), 'unaccepted VRAM-bearing segment control');
  root = copyConfig(); fs.appendFileSync(path.join(root, 'config', 'splat', 'us_rev0.yaml'), '\n# C:\\Users\\unaccepted-checkout\n'); rejected(run(productionArgs(root)), 'absolute checkout path control');
  root = copyConfig(); file = path.join(root, 'config', 'splat', 'us_rev0.overlay-linker-inputs.json'); let inputs = JSON.parse(fs.readFileSync(file, 'utf8')); inputs.overlayReservations.pop(); fs.writeFileSync(file, `${JSON.stringify(inputs, null, 2)}\n`); rejected(run(productionArgs(root)), 'overlay reservation loss control');
  const phase5a = copyPhase5a(); file = path.join(phase5a, 'full-rom-primary-ledger.jsonl'); const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/); const first = JSON.parse(lines[0]); first.primary_class = 'hijs_external_alias'; lines[0] = JSON.stringify(first); fs.writeFileSync(file, lines.join('\n')); rejected(run([path.join(ROOT, 'tools', 'generate_phase5b_production_config.js'), '--check', '--phase5a-root', phase5a]), 'accepted-input external-name generator control'); rejected(run([path.join(ROOT, 'tools', 'verify_phase5b_production_config.js'), '--phase5a-root', phase5a]), 'accepted-input external-name verifier control');
  lockRejected((lock) => lock.artifacts.pop(), 'missing artifact control');
  lockRejected((lock) => { lock.artifacts[0].sha256 = '0'.repeat(64); }, 'changed artifact hash control');
  lockRejected((lock) => lock.artifacts.push({ ...lock.artifacts[0] }), 'duplicate artifact control');
  lockRejected((lock) => { lock.packages.find((pkg) => pkg.name === 'black').artifactFiles = []; }, 'missing package-link control');
  lockRejected((lock) => { lock.artifacts[0].origin = 'altered-origin'; }, 'altered origin control');
  lockRejected((lock) => { lock.artifacts[0].dependencyClass = 'altered-class'; }, 'altered class control');
  lockRejectedBoth((lock) => { lock.packages.find((pkg) => pkg.name === 'black').artifactFiles.push('does-not-exist.whl'); }, 'stale package-link control');
  lockRejectedBoth((lock) => { const pkg = lock.packages.find((row) => row.name === 'black'); pkg.version = '0.0.0'; lock.artifacts.find((row) => row.package === 'black').version = '0.0.0'; }, 'consistent version drift control');
  lockRejectedBoth((lock) => { const pkg = lock.packages.find((row) => row.name === 'black'); pkg.origin = 'https://changed.example/black'; lock.artifacts.find((row) => row.package === 'black').origin = 'https://changed.example/black'; }, 'consistent origin drift control');
  lockRejectedBoth((lock) => { const pkg = lock.packages.find((row) => row.name === 'black'); pkg.dependencyClass = 'resolved-transitive'; lock.artifacts.find((row) => row.package === 'black').dependencyClass = 'resolved-transitive'; }, 'consistent class drift control');
  lockRejectedBoth((lock) => { const pkg = lock.packages.find((row) => row.name === 'black'); pkg.declaredGroupOrParent = { transitiveParent: 'changed' }; lock.artifacts.find((row) => row.package === 'black').declaredGroupOrParent = { transitiveParent: 'changed' }; }, 'consistent group-parent drift control');
  lockRejectedBoth((lock) => { lock.packages.find((row) => row.name === 'pip').bootstrapOrigin = 'ordinary-global-install'; }, 'false bootstrap origin control');
  lockRejectedBoth((lock) => { lock.artifacts.find((row) => row.file === 'pylibyaml-0.1.0-py3-none-any.whl').sha256 = 'D00EE73032DA40E52314BB48401BDABE70D7FEAD0DFE4622F2468B4913FEAC42'; }, 'historical pylibyaml wheel control');
  lockRejectedBoth((lock) => { lock.artifacts.find((row) => row.file === 'pylibyaml-0.1.0-py3-none-any.whl').sha256 = '545D40F5EDABD59C305361BD6C7A4CCC9113139B36A7D66CA5E049193B1C1108'; }, 'R6 pylibyaml wheel control');
  provenanceRejectedBoth((manifest, root) => { const changed = path.join(root, 'changed-source.tar.gz'); fs.copyFileSync(manifest.source.path, changed); fs.appendFileSync(changed, 'changed'); manifest.source.path = changed; }, 'changed reproducible source control');
  provenanceRejectedBoth((manifest, root) => { const changed = path.join(root, 'changed-sitecustomize.py'); fs.copyFileSync(manifest.reproducibilityTools.timestampHook.path, changed); fs.appendFileSync(changed, '\n# changed\n'); manifest.reproducibilityTools.timestampHook.path = changed; }, 'changed reproducible build hook control');
  provenanceRejectedBoth((manifest) => { manifest.environment.TZ = 'America/New_York'; }, 'changed reproducible environment control');
  provenanceRejectedBoth((manifest) => { manifest.builds[0].command = manifest.builds[0].command.replace(' --no-cache-dir', ''); }, 'changed reproducible command control');
  console.log('phase5b_production_config: PASS');
} finally { fs.rmSync(scratch, { recursive: true, force: true }); }
