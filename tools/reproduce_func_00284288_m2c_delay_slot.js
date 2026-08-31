#!/usr/bin/env node
'use strict';

const childProcess = require('child_process');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { ROOT } = require('./lib/phase7_conventional');
const { emitM2cAssembly } = require('./lib/matching/assembly');
const { m2cFailure, resolveM2c } = require('./lib/matching/m2c');
const { loadWorkbenchModel, resolveTarget } = require('./lib/matching/target_model');
const { resolveLocalTools } = require('./lib/local_tools');

const SYMBOL = 'func_00284288';
const GUARD = 'nop # m2c analysis guard: keep an IDO likely-branch rewrite out of a call delay slot';

function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex').toUpperCase();
}

function run(label, assemblyFile, m2c, python, outputDirectory) {
  const args = [
    m2c.script,
    '--target', 'mips-gcc-c',
    '--function', SYMBOL,
    '--globals', 'used',
    '--valid-syntax',
    '--deterministic-vars',
    assemblyFile,
  ];
  const started = Date.now();
  const result = childProcess.spawnSync(python, args, {
    cwd: m2c.root,
    encoding: 'utf8',
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
    windowsHide: true,
    maxBuffer: 128 * 1024 * 1024,
  });
  const stdout = String(result.stdout || '');
  const stderr = String(result.stderr || '');
  fs.writeFileSync(path.join(outputDirectory, `${label}.stdout.txt`), stdout);
  fs.writeFileSync(path.join(outputDirectory, `${label}.stderr.txt`), stderr);
  return {
    label,
    exitCode: result.status,
    durationMs: Date.now() - started,
    failure: m2cFailure(stdout),
    stdoutBytes: Buffer.byteLength(stdout),
    stdoutSha256: sha256(stdout),
    stderrBytes: Buffer.byteLength(stderr),
    stderrSha256: sha256(stderr),
  };
}

function main() {
  const rootIndex = process.argv.indexOf('--m2c-root');
  const m2cRoot = rootIndex >= 0 ? process.argv[rootIndex + 1] : null;
  if (!m2cRoot) throw new Error('usage: node tools/reproduce_func_00284288_m2c_delay_slot.js --m2c-root <pinned-m2c-checkout>');
  const workbench = loadWorkbenchModel();
  const target = resolveTarget(workbench, SYMBOL);
  const m2c = resolveM2c(workbench, { m2cRoot });
  const python = resolveLocalTools().splatPython;
  const outputDirectory = path.join(ROOT, 'build', 'matching', 'targets', SYMBOL, 'research', 'm2c-delay-slot');
  fs.mkdirSync(outputDirectory, { recursive: true });
  const guarded = emitM2cAssembly(target, workbench);
  const guardPattern = new RegExp(`^${GUARD.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\r?\\n`, 'gm');
  const guardCount = [...guarded.matchAll(new RegExp(guardPattern.source, 'gm'))].length;
  if (guardCount !== 4) throw new Error(`expected four target-specific delay-slot guards, found ${guardCount}`);
  const unguarded = guarded.replace(guardPattern, '');
  const guardedFile = path.join(outputDirectory, `${SYMBOL}.guarded.s`);
  const unguardedFile = path.join(outputDirectory, `${SYMBOL}.unguarded.s`);
  fs.writeFileSync(guardedFile, guarded);
  fs.writeFileSync(unguardedFile, unguarded);
  const results = [
    run('unguarded', unguardedFile, m2c, python, outputDirectory),
    run('guarded', guardedFile, m2c, python, outputDirectory),
  ];
  const report = {
    schemaVersion: 1,
    symbol: SYMBOL,
    m2c: { commit: m2c.commit, tree: m2c.tree, target: workbench.config.m2c.target },
    fixture: {
      guardCount,
      guardedAssemblySha256: sha256(guarded),
      unguardedAssemblySha256: sha256(unguarded),
      guardedLabels: [...guarded.matchAll(new RegExp(`${GUARD.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\r?\\n(\\.L_[0-9A-F]+):`, 'g'))]
        .map((match) => match[1]),
    },
    results,
    evidenceBoundary: 'This reproduces an upstream analysis failure and validates the narrow assembly-input guard. It does not alter retail bytes or candidate source.',
  };
  const reportPath = path.join(outputDirectory, 'report.json');
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify({ report: path.relative(ROOT, reportPath).replace(/\\/g, '/'), ...report }, null, 2));
}

main();
