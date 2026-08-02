#!/usr/bin/env node
'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');
const { normalize, directInventory, parentEdges } = require('./lib/phase5b_splat_dependencies');
const { validateReproducibleBuild } = require('./lib/phase5b_splat_reproducible_build');
const ROOT = path.resolve(__dirname, '..');
function value(flag, fallback = null) { const i = process.argv.indexOf(flag); if (i < 0) { if (fallback) return path.resolve(fallback); throw new Error(`Missing ${flag}`); } if (!process.argv[i + 1]) throw new Error(`Missing ${flag}`); return path.resolve(process.argv[i + 1]); }
function sha256(file) { return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex').toUpperCase(); }
function artifactFor(name, version, files) {
  const prefix = `${name.replace(/-/g, '_')}-${version}`;
  const alt = `${name}-${version}`;
  return files.filter((file) => file === 'splat-999c792f.zip' ? name === 'splat64' : file.toLowerCase().startsWith(prefix) || file.toLowerCase().startsWith(alt));
}
function localBuildArtifacts(provenance, artifactRoot) {
  const records = new Map();
  for (const [packageName, build] of Object.entries(provenance.localBuilds || {})) {
    if (!build.source || !build.sourceSha256 || !build.wheel || !build.wheelSha256 || !build.buildLog || !build.buildLogSha256) throw new Error(`Incomplete authenticated local build record: ${packageName}`);
    if (records.has(build.wheel)) throw new Error(`Duplicate authenticated local build output: ${build.wheel}`);
    const source = path.join(artifactRoot, build.source);
    const wheel = path.join(artifactRoot, build.wheel);
    if (!fs.existsSync(source) || sha256(source) !== build.sourceSha256) throw new Error(`Authenticated local build source drift: ${packageName}`);
    if (!fs.existsSync(build.buildLog) || sha256(build.buildLog) !== build.buildLogSha256) throw new Error(`Authenticated local build inputs drift: ${packageName}`);
    if (!fs.existsSync(wheel) || sha256(wheel) !== build.wheelSha256) throw new Error(`Authenticated local build output drift: ${packageName}`);
    records.set(build.wheel, { packageName: normalize(packageName), source: build.source });
  }
  const splat = provenance.localBuilds?.splat64;
  if (!splat || splat.source !== provenance.splatSnapshot.sourceArchive || splat.sourceSha256 !== provenance.splatSnapshot.sourceArchiveSha256 || splat.wheel !== provenance.splatSnapshot.wheel || splat.wheelSha256 !== provenance.splatSnapshot.wheelSha256) throw new Error('Authenticated Splat build record drift');
  return records;
}
function main() {
  const artifactRoot = value('--artifact-root');
  const python = value('--python');
  const pyproject = value('--pyproject');
  const lockFile = value('--lock', path.join(ROOT, 'config', 'splat', 'splat64-0.34.0.lock.json'));
  const provenance = JSON.parse(fs.readFileSync(path.join(ROOT, 'config', 'splat', 'splat64-0.34.0.provenance.json'), 'utf8'));
  if (provenance.schemaVersion !== 1 || provenance.splatSnapshot.pyprojectSha256 !== sha256(pyproject)) throw new Error('Authenticated provenance manifest or pyproject drift');
  if (sha256(provenance.machineAcquisition.summary) !== provenance.machineAcquisition.summarySha256) throw new Error('Machine acquisition record drift');
  validateReproducibleBuild(provenance);
  const acquisitionByFile = new Map(JSON.parse(fs.readFileSync(provenance.machineAcquisition.summary, 'utf8')).map((row) => [row.file, row]));
  const declared = directInventory(python, pyproject);
  if (declared.length !== 16) throw new Error('Authenticated pyproject direct inventory drift');
  const files = fs.readdirSync(artifactRoot).filter((name) => fs.statSync(path.join(artifactRoot, name)).isFile()).sort();
  if (!files.includes('splat-999c792f.zip')) throw new Error('Missing authenticated Splat source archive');
  const localBuildByWheel = localBuildArtifacts(provenance, artifactRoot);
  const listed = childProcess.spawnSync(python, ['-m', 'pip', 'list', '--format=json'], { encoding: 'utf8' });
  if (listed.status !== 0) throw new Error(listed.stderr);
  const installed = JSON.parse(listed.stdout).map((item) => ({ name: normalize(item.name), version: item.version })).sort((a, b) => a.name.localeCompare(b.name));
  const parents = parentEdges(python, installed.map((item) => item.name).filter((name) => !declared.some((item) => item.name === name) && !['pip', 'setuptools'].includes(name)));
  const packages = installed.map((item) => {
    const declaredEntry = declared.find((entry) => entry.name === item.name);
    const bootstrap = ['pip', 'setuptools'].includes(item.name);
    const artifactFiles = bootstrap ? [] : artifactFor(item.name, item.version, files);
    if (!bootstrap && !artifactFiles.length) throw new Error(`No artifact maps to installed ${item.name}@${item.version}`);
    return {
      name: item.name, version: item.version,
      installedIdentity: `${item.name}==${item.version}`,
      origin: bootstrap ? 'venv-ensurepip' : (item.name === 'splat64' ? 'local-git-archive:999c792fdda1002f29926717d2b7197bb90480a9' : `https://pypi.org/simple/${item.name}`),
      dependencyClass: bootstrap ? 'environment-bootstrap' : (declaredEntry ? 'declared-direct-or-build' : 'resolved-transitive'),
      declaredGroupOrParent: bootstrap ? null : (declaredEntry ? { group: declaredEntry.group, requirement: declaredEntry.requirement } : { transitiveParent: parents[item.name] }),
      bootstrapOrigin: bootstrap ? 'CPython venv ensurepip' : null,
      artifactFiles,
    };
  });
  const byName = new Map(packages.map((item) => [item.name, item]));
  const artifacts = files.map((file) => {
    const owner = packages.find((pkg) => pkg.artifactFiles.includes(file));
    if (!owner) throw new Error(`No installed package owns artifact: ${file}`);
    const isSource = file === 'splat-999c792f.zip';
    const localBuild = localBuildByWheel.get(file);
    const isBuilt = Boolean(localBuild);
    const acquired = acquisitionByFile.get(file);
    if (!isSource && !isBuilt && (!acquired || acquired.computedSha256 !== sha256(path.join(artifactRoot, file)))) throw new Error(`Machine acquisition evidence drift: ${file}`);
    if (localBuild && localBuild.packageName !== owner.name) throw new Error(`Authenticated local build package drift: ${file}`);
    return { package: owner.name, version: owner.version, file, sha256: sha256(path.join(artifactRoot, file)), origin: isSource ? 'local-git-archive:999c792fdda1002f29926717d2b7197bb90480a9' : (isBuilt ? `locally-built-from:${localBuild.source}` : acquired.url), dependencyClass: isSource ? 'authenticated-source-snapshot' : owner.dependencyClass, declaredGroupOrParent: owner.declaredGroupOrParent || { group: 'authenticated-source', requirement: 'git archive at required commit' } };
  });
  const version = childProcess.spawnSync(python, ['--version'], { encoding: 'utf8' });
  const pip = childProcess.spawnSync(python, ['-m', 'pip', '--version'], { encoding: 'utf8' });
  const lock = { schemaVersion: 3, artifactRoot, splat: { version: '0.34.0', commit: '999c792fdda1002f29926717d2b7197bb90480a9', license: 'MIT', pyprojectSha256: sha256(pyproject), sourceArchiveSha256: sha256(path.join(artifactRoot, 'splat-999c792f.zip')) }, isolatedEnvironment: { interpreter: python, pythonVersion: version.stdout.trim(), installerVersion: pip.stdout.trim() }, declaredDependencyInventory: { entries: declared, inactiveEnvironmentMarkers: [] }, packages, artifacts };
  fs.writeFileSync(lockFile, `${JSON.stringify(lock, null, 2)}\n`);
  console.log(`Captured Phase 5B Splat lock: ${packages.length} installed distributions, ${artifacts.length} artifacts`);
}
main();
