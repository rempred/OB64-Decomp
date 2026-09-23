#!/usr/bin/env node
'use strict';

// Output parity for the research-only oracle compiler (research only).
//
//   node parity.js [--trace] [--list inputs.txt] [input.c ...]
//
// Compiles every given preprocessed compiler input (default: every
// build/**/*.input.c outside build/regalloc-oracle) with the pinned production
// cc1 from config/local-tools.json and with build/regalloc-oracle/gcc/
// cc1-oracle.exe, using the production flags, and requires byte-identical
// assembly.  --trace also enables OB64_RA_TRACE for the oracle, which must not
// change its output.  Inputs that fail identically under both compilers are
// reported separately.  Any difference exits 1.

const childProcess = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const ROOT = path.resolve(__dirname, '../../..');
const ORACLE = path.join(ROOT, 'build', 'regalloc-oracle', 'gcc', 'cc1-oracle.exe');

function inputs(args) {
  if (args.length) return args.map((a) => path.resolve(a));
  const out = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) { if (full !== path.join(ROOT, 'build', 'regalloc-oracle')) walk(full); }
      else if (entry.name.endsWith('.input.c')) out.push(full);
    }
  };
  walk(path.join(ROOT, 'build'));
  return out;
}

function compileOnce(cc1, flags, input, env) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ob64-parity-'));
  try {
    const out = path.join(dir, 'out.s');
    const r = childProcess.spawnSync(cc1, [...flags, '-o', out, input], { encoding: 'utf8', windowsHide: true, env });
    return { status: r.status, stderr: r.stderr || '', asm: r.status === 0 ? fs.readFileSync(out) : null };
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
}

function main() {
  const args = process.argv.slice(2);
  const trace = args.includes('--trace');
  const listIndex = args.indexOf('--list');
  const listed = listIndex >= 0
    ? fs.readFileSync(args[listIndex + 1], 'utf8').split(/\r?\n/).map((l) => l.trim()).filter(Boolean)
    : [];
  const files = inputs([...listed, ...args.filter((a, i) => !a.startsWith('--') && (listIndex < 0 || i !== listIndex + 1))]);
  const local = JSON.parse(fs.readFileSync(path.join(ROOT, 'config', 'local-tools.json'), 'utf8'));
  const flags = JSON.parse(fs.readFileSync(path.join(ROOT, 'config', 'phase8', 'matching-c.json'), 'utf8')).compiler.compileFlags;
  if (!fs.existsSync(ORACLE)) throw new Error('oracle compiler missing: run patch_gcc.js first');
  const traceDir = trace ? fs.mkdtempSync(path.join(os.tmpdir(), 'ob64-parity-trace-')) : null;
  const tally = { same: 0, sameFailure: 0, differ: [] };
  files.forEach((input, i) => {
    const base = { ...process.env };
    for (const k of ['OB64_RA_TRACE', 'OB64_RA_FORCE', 'OB64_RA_DP']) delete base[k];
    const a = compileOnce(local.compiler, flags, input, base);
    const b = compileOnce(ORACLE, flags, input, trace ? { ...base, OB64_RA_TRACE: path.join(traceDir, `${i}.txt`) } : base);
    if (a.status !== b.status) tally.differ.push({ input, reason: `exit ${a.status} vs ${b.status}` });
    else if (a.status !== 0) { if (a.stderr === b.stderr) tally.sameFailure++; else tally.differ.push({ input, reason: 'different failure' }); }
    else if (a.asm.equals(b.asm)) tally.same++;
    else tally.differ.push({ input, reason: 'assembly differs' });
  });
  if (traceDir) fs.rmSync(traceDir, { recursive: true, force: true });
  console.log(JSON.stringify({ inputs: files.length, trace, same: tally.same, sameFailure: tally.sameFailure, differ: tally.differ }, null, 2));
  if (tally.differ.length) process.exitCode = 1;
}

main();
