'use strict';

// Shared helpers for the research-only register-allocation oracle.
// Compiles through the repository's own scratch pipeline (section
// adjustment, assembler, ELF checks) with the compiler executable swapped
// for build/regalloc-oracle/gcc/cc1-oracle.exe.  Hooks are driven by
// environment variables, so an unset environment is the parity baseline.

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../../..');
const { compileScratchCandidate, prepareCompilerSession } = require('../../lib/matching/compiler');
const { loadWorkbenchModel, resolveTarget } = require('../../lib/matching/target_model');

const ORACLE_ROOT = path.join(ROOT, 'build', 'regalloc-oracle');
const ORACLE_CC1 = path.join(ORACLE_ROOT, 'gcc', 'cc1-oracle.exe');

let cached = null;
function context() {
  if (!cached) {
    const session = prepareCompilerSession();
    const workbench = loadWorkbenchModel();
    const oracleSession = {
      ...session,
      context: { ...session.context, localTools: { ...session.context.localTools, compiler: ORACLE_CC1 } },
    };
    cached = { session, oracleSession, workbench };
  }
  return cached;
}

function target(symbol) {
  return resolveTarget(context().workbench, symbol);
}

const HOOK_VARS = ['OB64_RA_TRACE', 'OB64_RA_FORCE', 'OB64_RA_DP'];

// Compile `sourceFile` (repository-relative or absolute path inside the repo)
// for `symbol`.  options.oracle selects cc1-oracle; options.env sets hooks.
function compile(symbol, sourceFile, options = {}) {
  const { session, oracleSession } = context();
  const tgt = target(symbol);
  const absolute = path.resolve(ROOT, sourceFile);
  const key = crypto.createHash('sha256')
    .update(JSON.stringify([symbol, fs.readFileSync(absolute, 'utf8'), !!options.oracle, options.env || {}, options.tag || '']))
    .digest('hex').slice(0, 16);
  const artifactDir = path.join(ORACLE_ROOT, 'runs', `${symbol}-${key}`);
  fs.rmSync(artifactDir, { recursive: true, force: true });
  const saved = {};
  for (const name of HOOK_VARS) { saved[name] = process.env[name]; delete process.env[name]; }
  try {
    for (const [name, value] of Object.entries(options.env || {})) process.env[name] = value;
    const result = compileScratchCandidate({
      session: options.oracle ? oracleSession : session,
      target: tgt,
      sourceFile: absolute,
      artifactDir,
    });
    const expected = tgt.expectedBytes;
    const actual = result.objectText;
    return {
      symbol,
      artifactDir,
      target: tgt,
      expected,
      actual,
      exact: !!expected && expected.equals(actual),
      sameLength: !!expected && expected.length === actual.length,
      compilerAssembly: path.join(artifactDir, 'candidate.compiler.s'),
      adjustedAssembly: path.join(artifactDir, 'candidate.s'),
      object: path.join(artifactDir, 'candidate.o'),
      relocations: result.relocations,
    };
  } finally {
    for (const name of HOOK_VARS) {
      if (saved[name] === undefined) delete process.env[name]; else process.env[name] = saved[name];
    }
  }
}

function words(buffer) {
  const out = [];
  for (let i = 0; i + 4 <= buffer.length; i += 4) out.push(buffer.readUInt32BE(i));
  return out;
}

module.exports = { ROOT, ORACLE_ROOT, ORACLE_CC1, context, target, compile, words };
