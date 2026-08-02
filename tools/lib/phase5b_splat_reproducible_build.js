'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

function sha256(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex').toUpperCase();
}

function requireHash(file, expected, label) {
  if (!file || !expected || !fs.existsSync(file) || sha256(file) !== expected) {
    throw new Error(`${label} drift`);
  }
}

function validateReproducibleBuild(provenance) {
  const local = provenance?.localBuilds?.pylibyaml;
  const reference = local?.reproducibleBuild;
  if (!reference || reference.route !== 'A') throw new Error('reproducible pylibyaml route missing');
  requireHash(reference.manifest, reference.manifestSha256, 'reproducible build manifest');
  const manifest = JSON.parse(fs.readFileSync(reference.manifest, 'utf8'));
  if (manifest.schemaVersion !== 1 || manifest.route !== 'A' || manifest.status !== 'complete') throw new Error('reproducible build manifest schema drift');
  requireHash(manifest.source.path, manifest.source.sha256, 'reproducible build source');
  if (manifest.source.sha256 !== local.sourceSha256) throw new Error('reproducible build source identity drift');
  requireHash(manifest.reproducibilityTools.timestampHook.path, manifest.reproducibilityTools.timestampHook.sha256, 'reproducible timestamp hook');
  requireHash(manifest.reproducibilityTools.identityVerifier.path, manifest.reproducibilityTools.identityVerifier.sha256, 'wheel identity verifier');
  requireHash(manifest.runtime.baseInterpreter, manifest.runtime.baseInterpreterSha256, 'base interpreter');
  requireHash(manifest.runtime.pythonDll, manifest.runtime.pythonDllSha256, 'Python runtime DLL');
  requireHash(manifest.runtime.pipBootstrapWheel, manifest.runtime.pipBootstrapWheelSha256, 'pip bootstrap wheel');
  requireHash(manifest.runtime.setuptoolsBootstrapWheel, manifest.runtime.setuptoolsBootstrapWheelSha256, 'setuptools bootstrap wheel');
  if (manifest.runtime.operatingSystem !== 'Windows 10.0.26200' ||
      manifest.runtime.architecture !== 'AMD64' ||
      !manifest.runtime.interpreterVersion.startsWith('3.11.15 ') ||
      manifest.runtime.pipVersion !== '24.0' ||
      manifest.runtime.setuptoolsVersion !== '79.0.1' ||
      manifest.runtime.vendoredWheelVersion !== '0.45.1' ||
      manifest.runtime.externalWheelDistribution !== 'not installed' ||
      manifest.runtime.zlibCompileVersion !== '1.3.2' ||
      manifest.runtime.zlibRuntimeVersion !== '1.3.2') {
    throw new Error('reproducible build runtime drift');
  }
  const expectedEnvironment = {
    PIP_CONFIG_FILE: 'NUL',
    PIP_NO_INDEX: '1',
    PIP_NO_CACHE_DIR: '1',
    PIP_DISABLE_PIP_VERSION_CHECK: '1',
    PYTHONNOUSERSITE: '1',
    PYTHONDONTWRITEBYTECODE: '1',
    PYTHONUTF8: '1',
    PYTHONHASHSEED: '0',
    TZ: 'UTC',
    LC_ALL: 'C',
    LANG: 'C',
    OB64_R7_REPRODUCE_R4_WHEEL: '1',
    PYTHONPATH: path.dirname(manifest.reproducibilityTools.timestampHook.path),
    SOURCE_DATE_EPOCH: null,
    PYTHONHOME: null,
    TEMP: 'root-specific and recorded below',
    TMP: 'root-specific and recorded below',
  };
  if (JSON.stringify(manifest.environment) !== JSON.stringify(expectedEnvironment)) throw new Error('reproducible build environment drift');
  if (manifest.reproducibilityTools.timestampHook.sourceArchiveMaximumMtime !== 1600676850 ||
      manifest.reproducibilityTools.timestampHook.r4GeneratedMemberEpoch !== 1785567830 ||
      manifest.reproducibilityTools.timestampHook.r4GeneratedMemberTimestampUtc !== '2026-08-01T07:03:50Z') {
    throw new Error('reproducible timestamp authority drift');
  }
  if (!Array.isArray(manifest.builds) || manifest.builds.length !== 2 || new Set(manifest.builds.map((row) => row.root)).size !== 2) throw new Error('two independent reproducible builds are required');
  const expectedIds = ['final-build-a', 'final-build-b'];
  for (const [index, build] of manifest.builds.entries()) {
    if (build.id !== expectedIds[index] || build.root !== path.dirname(build.temporaryDirectory) || build.temporaryDirectory !== path.join(build.root, 'tmp')) throw new Error(`${build.id} root identity drift`);
    const environmentConfig = path.join(build.root, 'venv', 'pyvenv.cfg');
    const interpreter = path.join(build.root, 'venv', 'Scripts', 'python.exe');
    const setuptoolsRecord = path.join(build.root, 'venv', 'Lib', 'site-packages', 'setuptools-79.0.1.dist-info', 'RECORD');
    requireHash(environmentConfig, build.venvConfigSha256, `${build.id} environment`);
    requireHash(interpreter, build.venvPythonSha256, `${build.id} interpreter`);
    requireHash(setuptoolsRecord, build.setuptoolsRecordSha256, `${build.id} setuptools`);
    requireHash(build.prebuildLog, build.prebuildLogSha256, `${build.id} prebuild record`);
    requireHash(build.buildLog, build.buildLogSha256, `${build.id} build log`);
    requireHash(build.wheel, build.wheelSha256, `${build.id} wheel`);
    const wheelDirectory = path.dirname(build.wheel);
    const expectedCommand = `${interpreter} -m pip wheel --no-index --no-deps --no-cache-dir --no-build-isolation --wheel-dir ${wheelDirectory} ${manifest.source.path}`;
    if (build.wheelSha256 !== local.wheelSha256 || build.command !== expectedCommand) {
      throw new Error(`${build.id} command or output identity drift`);
    }
  }
  requireHash(manifest.comparison.report, manifest.comparison.reportSha256, 'wheel identity comparison');
  const comparison = JSON.parse(fs.readFileSync(manifest.comparison.report, 'utf8'));
  if (!manifest.comparison.finalBuildsByteIdentical || !manifest.comparison.recordValidForEveryComparedWheel || manifest.comparison.finalWheelSha256 !== local.wheelSha256) throw new Error('final wheel identity drift');
  if (!Array.isArray(comparison.inventories) || comparison.inventories.some((row) => row.recordValid !== true)) throw new Error('wheel RECORD validation drift');
  const finalPaths = new Set(manifest.builds.map((row) => path.resolve(row.wheel).toLowerCase()));
  const finalInventories = comparison.inventories.filter((row) => finalPaths.has(path.resolve(row.path).toLowerCase()));
  if (finalInventories.length !== 2 || finalInventories.some((row) => row.sha256 !== local.wheelSha256)) throw new Error('final wheel comparison drift');
  return manifest;
}

module.exports = { validateReproducibleBuild };
