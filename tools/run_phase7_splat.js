#!/usr/bin/env node
'use strict';

const childProcess = require('child_process');
const fs = require('fs');
const path = require('path');
const {
  ROOT,
  ensureDir,
  fail,
  loadAcceptedModel,
  normalizePath,
  run,
  sha256File,
  writeJson,
} = require('./lib/phase7_conventional');

const SPLAT_ALIAS = [
  '"""Compatibility alias for the authenticated source-layout split.py."""',
  'from splat import scripts',
  '',
].join('\n');

function value(flag) {
  const index = process.argv.indexOf(flag);
  if (index < 0 || !process.argv[index + 1]) fail(`missing ${flag}`);
  return path.resolve(process.argv[index + 1]);
}

function main() {
  const output = value('--output');
  const python = value('--python');
  const split = value('--split');
  const snapshotRoot = value('--snapshot-root');
  const model = loadAcceptedModel();
  const rootLower = ROOT.toLowerCase();
  if (output.toLowerCase() === rootLower || output.toLowerCase().startsWith(`${rootLower}${path.sep}`)) fail('Phase 7 Splat output must remain outside the integration repository');
  if (!split.toLowerCase().startsWith(`${snapshotRoot.toLowerCase()}${path.sep}`)) fail('split.py must remain inside the declared authenticated snapshot');
  if (sha256File(python) !== model.config.splat.pythonExeSha256) fail('Splat Python executable SHA-256 drift');
  if (sha256File(split) !== model.config.splat.splitPySha256) fail('Splat split.py SHA-256 drift');
  if (fs.existsSync(output) && fs.readdirSync(output).length !== 0) fail('Phase 7 Splat output directory must be absent or empty');
  ensureDir(output);

  const configFile = path.join(output, 'phase7-splat.yaml');
  const romFile = path.join(output, 'baserom.us_rev0.z64');
  fs.copyFileSync(path.join(ROOT, 'config', 'splat', 'us_rev0.yaml'), configFile);
  fs.copyFileSync(path.join(ROOT, 'build', 'baserom.us_rev0.z64'), romFile);

  const compatRoot = path.join(output, 'compat');
  const compatPackage = path.join(compatRoot, 'src');
  ensureDir(compatPackage);
  fs.writeFileSync(path.join(compatPackage, '__init__.py'), '"""Generated compatibility package."""\n');
  fs.writeFileSync(path.join(compatPackage, 'splat.py'), SPLAT_ALIAS);
  const version = run(python, ['-B', '-c', 'import splat; print(splat.__version__)'], {
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  }).stdout.trim();
  if (version !== model.config.splat.version) fail(`Splat version drift: ${version}`);

  const command = [python, '-B', split, configFile];
  const startedAt = new Date().toISOString();
  const result = childProcess.spawnSync(command[0], command.slice(1), {
    cwd: output,
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
    env: { ...process.env, PYTHONPATH: compatRoot, PYTHONDONTWRITEBYTECODE: '1' },
  });
  const record = {
    schemaVersion: 1,
    startedAt,
    completedAt: new Date().toISOString(),
    command: [python, '-B', split, path.basename(configFile)],
    cwd: '.',
    environment: { PYTHONPATH: normalizePath(path.relative(output, compatRoot)), PYTHONDONTWRITEBYTECODE: '1' },
    identities: {
      pythonSha256: sha256File(python),
      splitPySha256: sha256File(split),
      configSha256: sha256File(configFile),
      romSha256: sha256File(romFile),
      splatVersion: version,
      compatibilityAliasSha256: sha256File(path.join(compatPackage, 'splat.py')),
    },
    compatibilityReason: 'The authenticated source-layout split.py imports src.splat, while the authenticated wheel exposes splat.',
    exitCode: result.status,
    signal: result.signal,
    error: result.error ? String(result.error) : null,
    stdout: result.stdout,
    stderr: result.stderr,
  };
  writeJson(path.join(output, 'splat-command.json'), record);
  if (result.status !== 0) fail(`Splat execution failed: ${result.stderr || result.stdout}`);
  const linker = path.join(output, 'build', 'ob64_us_rev0_phase5b.ld');
  if (!fs.existsSync(linker)) fail('Splat did not produce the expected linker input');
  console.log(`Phase 7 Splat execution: PASS (${linker})`);
}

main();
