#!/usr/bin/env node
'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');
const { normalize, directInventory, parentEdges } = require('./lib/phase5b_splat_dependencies');
const { validateReproducibleBuild } = require('./lib/phase5b_splat_reproducible_build');
const ROOT = path.resolve(__dirname, '..');
function value(flag, fallback = null) { const i = process.argv.indexOf(flag); if (i < 0) return fallback; if (!process.argv[i + 1]) throw new Error(`Missing ${flag}`); return path.resolve(process.argv[i + 1]); }
function sha256(file) { return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex').toUpperCase(); }
function fail(message) { throw new Error(`Phase 5B Splat lock failure: ${message}`); }
function main() {
  const lockFile = value('--lock', path.join(ROOT, 'config', 'splat', 'splat64-0.34.0.lock.json'));
  const lock = JSON.parse(fs.readFileSync(lockFile, 'utf8'));
  const provenanceFile = value('--provenance', path.join(ROOT, 'config', 'splat', 'splat64-0.34.0.provenance.json'));
  const provenance = JSON.parse(fs.readFileSync(provenanceFile, 'utf8'));
  const artifactRoot = value('--artifact-root', lock.artifactRoot);
  const pyproject = value('--pyproject', provenance.splatSnapshot.pyproject);
  const python = value('--python');
  if (provenance.schemaVersion !== 1 || sha256(provenance.machineAcquisition.summary) !== provenance.machineAcquisition.summarySha256) fail('authenticated acquisition manifest drift');
  if (sha256(provenance.localBuilds.pylibyaml.buildLog) !== provenance.localBuilds.pylibyaml.buildLogSha256 || sha256(provenance.localBuilds.splat64.buildLog) !== provenance.localBuilds.splat64.buildLogSha256) fail('authenticated build record drift');
  try { validateReproducibleBuild(provenance); } catch (error) { fail(error.message); }
  if (sha256(provenance.bootstrap.environmentConfig) !== provenance.bootstrap.environmentConfigSha256 || provenance.bootstrap.mechanism !== 'CPython venv ensurepip') fail('isolated bootstrap record drift');
  const declared = directInventory(python || lock.isolatedEnvironment.interpreter, pyproject);
  if (declared.length !== 16) fail('authenticated direct dependency inventory drift');
  const parents = parentEdges(python || lock.isolatedEnvironment.interpreter, lock.packages.filter((row) => !declared.some((entry) => entry.name === row.name) && !['pip', 'setuptools'].includes(row.name)).map((row) => row.name));
  const acquisitionByFile = new Map(JSON.parse(fs.readFileSync(provenance.machineAcquisition.summary, 'utf8')).map((row) => [row.file, row]));
  if (lock.schemaVersion !== 3 || !artifactRoot || !Array.isArray(lock.artifacts) || !Array.isArray(lock.packages)) fail('schema or required tables missing');
  const files = fs.readdirSync(artifactRoot).filter((name) => fs.statSync(path.join(artifactRoot, name)).isFile()).sort();
  const artifactNames = lock.artifacts.map((row) => row.file);
  if (new Set(artifactNames).size !== artifactNames.length || JSON.stringify([...artifactNames].sort()) !== JSON.stringify(files)) fail('artifact root has missing, extra, or duplicate records');
  const packages = new Map();
  const pyprojectText = fs.readFileSync(pyproject, 'utf8');
  if (sha256(pyproject) !== lock.splat.pyprojectSha256) fail('authenticated pyproject hash drift');
  for (const pkg of lock.packages) {
    if (!pkg.name || !pkg.version || !pkg.origin || !pkg.dependencyClass || !pkg.installedIdentity || !Array.isArray(pkg.artifactFiles)) fail('incomplete package record');
    if (packages.has(pkg.name)) fail(`duplicate package: ${pkg.name}`);
    packages.set(pkg.name, pkg);
    const declaredEntry = declared.find((entry) => entry.name === pkg.name);
    const expectedClass = ['pip', 'setuptools'].includes(pkg.name) ? 'environment-bootstrap' : (declaredEntry ? 'declared-direct-or-build' : 'resolved-transitive');
    const expectedGroup = ['pip', 'setuptools'].includes(pkg.name) ? null : (declaredEntry ? { group: declaredEntry.group, requirement: declaredEntry.requirement } : { transitiveParent: parents[pkg.name] });
    const expectedOrigin = ['pip', 'setuptools'].includes(pkg.name) ? 'venv-ensurepip' : (pkg.name === 'splat64' ? 'local-git-archive:999c792fdda1002f29926717d2b7197bb90480a9' : `https://pypi.org/simple/${pkg.name}`);
    if (pkg.dependencyClass !== expectedClass || JSON.stringify(pkg.declaredGroupOrParent) !== JSON.stringify(expectedGroup) || pkg.origin !== expectedOrigin) fail(`package provenance drift: ${pkg.name}`);
    if (pkg.dependencyClass === 'environment-bootstrap') {
      if (pkg.bootstrapOrigin !== provenance.bootstrap.mechanism || pkg.artifactFiles.length !== 0) fail(`invalid bootstrap record: ${pkg.name}`);
    } else if (!pkg.declaredGroupOrParent || pkg.artifactFiles.length === 0) fail(`missing dependency parent or artifact link: ${pkg.name}`);
  }
  const artifactsByFile = new Map(lock.artifacts.map((row) => [row.file, row]));
  for (const pkg of packages.values()) {
    if (new Set(pkg.artifactFiles).size !== pkg.artifactFiles.length) fail(`duplicate package artifact link: ${pkg.name}`);
    const owned = lock.artifacts.filter((row) => row.package === pkg.name).map((row) => row.file).sort();
    if (JSON.stringify([...pkg.artifactFiles].sort()) !== JSON.stringify(owned)) fail(`package artifact set is not bidirectionally exact: ${pkg.name}`);
    for (const file of pkg.artifactFiles) {
      const artifact = artifactsByFile.get(file);
      if (!artifact || artifact.package !== pkg.name || !fs.existsSync(path.join(artifactRoot, file))) fail(`stale or cross-package artifact link: ${pkg.name}/${file}`);
    }
  }
  for (const artifact of lock.artifacts) {
    if (!artifact.package || !artifact.version || !artifact.file || !/^[0-9A-F]{64}$/.test(artifact.sha256 || '') || !artifact.origin || !artifact.dependencyClass || !artifact.declaredGroupOrParent) fail(`incomplete artifact record: ${artifact.file}`);
    const pkg = packages.get(artifact.package);
    if (!pkg || pkg.version !== artifact.version || !pkg.artifactFiles.includes(artifact.file)) fail(`unmapped artifact: ${artifact.file}`);
    if (JSON.stringify(artifact.declaredGroupOrParent) !== JSON.stringify(pkg.declaredGroupOrParent)) fail(`artifact dependency-parent drift: ${artifact.file}`);
    const normalizedPrefix = `${artifact.package.replace(/-/g, '_')}-${artifact.version}`;
    const alternatePrefix = `${artifact.package}-${artifact.version}`;
    if (artifact.file !== 'splat-999c792f.zip' && !artifact.file.toLowerCase().startsWith(normalizedPrefix) && !artifact.file.toLowerCase().startsWith(alternatePrefix)) fail(`artifact filename identity drift: ${artifact.file}`);
    if (artifact.file === 'splat-999c792f.zip' && (artifact.package !== 'splat64' || artifact.version !== '0.34.0')) fail('source archive identity drift');
    const expectedOrigin = artifact.file === 'splat-999c792f.zip'
      ? 'local-git-archive:999c792fdda1002f29926717d2b7197bb90480a9'
      : artifact.file === 'splat64-0.34.0-py3-none-any.whl'
        ? 'locally-built-from:splat-999c792f.zip'
        : artifact.file === 'pylibyaml-0.1.0-py3-none-any.whl'
          ? 'locally-built-from:pylibyaml-0.1.0.tar.gz'
          : acquisitionByFile.get(artifact.file)?.url;
    const expectedClass = artifact.file === 'splat-999c792f.zip' ? 'authenticated-source-snapshot' : pkg.dependencyClass;
    if (artifact.origin !== expectedOrigin || artifact.dependencyClass !== expectedClass) fail(`artifact origin or class drift: ${artifact.file}`);
    if (sha256(path.join(artifactRoot, artifact.file)) !== artifact.sha256) fail(`artifact SHA-256 drift: ${artifact.file}`);
  }
  if (!lock.artifacts.some((row) => row.file === 'splat-999c792f.zip' && row.package === 'splat64')) fail('authenticated Splat archive is absent');
  const rebuilt = artifactsByFile.get(provenance.localBuilds.pylibyaml.wheel);
  if (!rebuilt || rebuilt.sha256 !== provenance.localBuilds.pylibyaml.wheelSha256) fail('authenticated rebuilt pylibyaml wheel is absent');
  for (const name of ['pip', 'setuptools']) if (!packages.has(name) || packages.get(name).dependencyClass !== 'environment-bootstrap') fail(`missing bootstrap distribution: ${name}`);
  if (python) {
    const listed = childProcess.spawnSync(python, ['-m', 'pip', 'list', '--format=json'], { encoding: 'utf8' });
    if (listed.status !== 0) fail(`cannot read installed inventory: ${listed.stderr}`);
    const installed = JSON.parse(listed.stdout).map((row) => ({ name: normalize(row.name), version: row.version })).sort((a, b) => a.name.localeCompare(b.name));
    const locked = [...packages.values()].map((row) => ({ name: row.name, version: row.version })).sort((a, b) => a.name.localeCompare(b.name));
    if (JSON.stringify(installed) !== JSON.stringify(locked)) fail('installed inventory differs from lock');
  }
  console.log(`Phase 5B Splat lock: PASS (${lock.packages.length} installed distributions, ${lock.artifacts.length} artifacts)`);
}
main();
