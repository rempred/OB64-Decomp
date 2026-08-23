'use strict';

const childProcess = require('child_process');
const fs = require('fs');
const path = require('path');
const { ROOT } = require('../phase7_conventional');
const { resolveLocalTools } = require('../local_tools');
const { emitM2cAssembly } = require('./assembly');
const { MATCHING_ROOT, compileCandidate, recordCandidate, syncTargets } = require('./compiler');
const { renderM2cContext, storeTargetContext } = require('./context');

const M2C_ADAPTER_VERSION = 5;

const TYPE_PRELUDE = [
  'typedef signed char s8;',
  'typedef unsigned char u8;',
  'typedef signed short s16;',
  'typedef unsigned short u16;',
  'typedef signed int s32;',
  'typedef unsigned int u32;',
  'typedef signed long long s64;',
  'typedef unsigned long long u64;',
  'typedef float f32;',
  'typedef double f64;',
  'typedef s32 M2C_UNK;',
  'typedef s8 M2C_UNK8;',
  'typedef s16 M2C_UNK16;',
  'typedef s32 M2C_UNK32;',
  'typedef s64 M2C_UNK64;',
  '',
].join('\n');

function macroArguments(source, open) {
  let depth = 0;
  let start = open + 1;
  const args = [];
  for (let index = open + 1; index < source.length; index += 1) {
    const char = source[index];
    if (char === '(') depth += 1;
    else if (char === ')') {
      if (depth === 0) {
        args.push(source.slice(start, index).trim());
        return { args, end: index + 1 };
      }
      depth -= 1;
    } else if (char === ',' && depth === 0) {
      args.push(source.slice(start, index).trim());
      start = index + 1;
    }
  }
  throw new Error('unterminated m2c valid-syntax macro');
}

function expandMacro(source, name, expand) {
  let cursor = 0;
  let result = '';
  const pattern = new RegExp(`\\b${name}\\s*\\(`, 'g');
  while (true) {
    pattern.lastIndex = cursor;
    const match = pattern.exec(source);
    if (!match) return result + source.slice(cursor);
    const open = source.indexOf('(', match.index + name.length);
    const parsed = macroArguments(source, open);
    result += source.slice(cursor, match.index) + expand(parsed.args);
    cursor = parsed.end;
  }
}

function expandValidSyntaxMacros(source) {
  const expansions = [
    ['M2C_FIELD', (args) => `(*(${args[1]})((s8 *)(${args[0]}) + (${args[2]})))`],
    ['M2C_BITWISE', (args) => `((${args[0]})(${args[1]}))`],
    ['M2C_LWL', (args) => `(${args[0]})`],
    ['M2C_FIRST3BYTES', (args) => `(${args[0]})`],
    ['M2C_UNALIGNED32', (args) => `(${args[0]})`],
    ['M2C_ERROR', () => '(0)'],
    ['M2C_TRAP_IF', () => '(0)'],
    ['M2C_BREAK', () => '(0)'],
    ['M2C_SYNC', () => '(0)'],
    ['GLUE_F64', () => '(0.0)'],
    ['MULT_HI', () => '(0)'],
    ['MULTU_HI', () => '(0)'],
    ['DMULT_HI', () => '(0)'],
    ['DMULTU_HI', () => '(0)'],
    ['CLZ', () => '(0)'],
    ['REVERSE_BITS', () => '(0)'],
    ['ROTATE_RIGHT', () => '(0)'],
    ['M2C_OVERFLOW', () => '(0)'],
  ];
  let result = source;
  for (const [name, expansion] of expansions) result = expandMacro(result, name, expansion);
  return result.replace(/\bM2C_CARRY\b/g, '0');
}

function compilableM2cSource(source) {
  // cc1 is invoked directly by the accepted build contract, so its input must
  // already be preprocessed: even a C89 comment emitted by the adapter is a
  // parse error. m2c warnings are diagnostics rather than source and are kept
  // in the generation result, so remove those lines from the compilable view.
  const withoutWarnings = source.replace(/^Warning:\s*.*(?:\r?\n|$)/gm, '');
  return `${TYPE_PRELUDE}${expandValidSyntaxMacros(withoutWarnings.replace(/^\uFEFF/, ''))}`;
}

function m2cDiagnostics(source) {
  return [...source.matchAll(/^Warning:\s*(.*)$/gm)].map((match) => ({
    level: 'warning',
    message: match[1].trim(),
  }));
}

function m2cFailure(source) {
  const match = source.match(/Decompilation failure in function[\s\S]*?(?=\*\/|$)/);
  return match ? match[0].trim() : null;
}

function portableM2cArguments(argumentsList, m2c) {
  return argumentsList.map((argument) => {
    if (!path.isAbsolute(argument)) return argument;
    const repoRelative = path.relative(ROOT, argument);
    if (repoRelative && repoRelative !== '..' && !repoRelative.startsWith(`..${path.sep}`)) {
      return `<repo>/${repoRelative.replace(/\\/g, '/')}`;
    }
    const m2cRelative = path.relative(m2c.root, argument);
    if (m2cRelative && m2cRelative !== '..' && !m2cRelative.startsWith(`..${path.sep}`)) {
      return `<m2c>/${m2cRelative.replace(/\\/g, '/')}`;
    }
    return `<external>/${path.basename(argument)}`;
  });
}

function resolveM2c(workbench, options = {}) {
  const root = path.resolve(options.m2cRoot || process.env.OB64_M2C_ROOT || path.resolve(ROOT, workbench.config.m2c.defaultRoot));
  const script = path.join(root, 'm2c.py');
  if (!fs.existsSync(script)) throw new Error(`m2c checkout is missing: ${script}`);
  const revision = childProcess.spawnSync('git', ['-C', root, 'rev-parse', 'HEAD'], { encoding: 'utf8', windowsHide: true });
  const commit = String(revision.stdout || '').trim();
  if (revision.status !== 0 || commit.toLowerCase() !== workbench.config.m2c.commit.toLowerCase()) {
    throw new Error(`m2c checkout identity drift: ${commit || '<unavailable>'}`);
  }
  const treeResult = childProcess.spawnSync('git', ['-C', root, 'rev-parse', 'HEAD^{tree}'], { encoding: 'utf8', windowsHide: true });
  const tree = String(treeResult.stdout || '').trim();
  if (treeResult.status !== 0 || tree.toLowerCase() !== workbench.config.m2c.tree.toLowerCase()) {
    throw new Error(`m2c tree identity drift: ${tree || '<unavailable>'}`);
  }
  const statusResult = childProcess.spawnSync('git', ['-C', root, 'status', '--porcelain', '--untracked-files=all'], { encoding: 'utf8', windowsHide: true });
  if (statusResult.status !== 0) throw new Error('m2c checkout status cannot be established');
  const statusLines = String(statusResult.stdout || '').split(/\r?\n/).filter(Boolean);
  const trackedChanges = statusLines.filter((line) => !line.startsWith('?? '));
  if (trackedChanges.length) throw new Error(`m2c tracked checkout is dirty: ${trackedChanges[0]}`);
  const unsafeUntracked = statusLines.filter((line) => line.startsWith('?? ') && /\.(?:py|pyc|pyd|pth)$/i.test(line.slice(3)));
  if (unsafeUntracked.length) throw new Error(`m2c checkout has untracked executable Python input: ${unsafeUntracked[0].slice(3)}`);
  return { root, script, commit, tree, untracked: statusLines.filter((line) => line.startsWith('?? ')).map((line) => line.slice(3)) };
}

function runM2c(workbench, target, options = {}) {
  const m2c = resolveM2c(workbench, options);
  const localTools = options.localTools || resolveLocalTools();
  const targetRoot = path.join(MATCHING_ROOT, 'targets', target.symbol, 'prepare');
  fs.mkdirSync(targetRoot, { recursive: true });
  const assemblyFile = path.join(targetRoot, `${target.symbol}.s`);
  const assembly = emitM2cAssembly(target, workbench);
  fs.writeFileSync(assemblyFile, assembly, 'utf8');
  let contextFile = options.contextFile || null;
  let context = null;
  if (!contextFile && options.generateContext !== false) {
    context = storeTargetContext(workbench, target, {
      index: options.contextIndex,
      runtime: options.runtimeContext === true,
      storeOptions: options.storeOptions,
      syncTargets: false,
    });
    contextFile = path.join(targetRoot, `${target.symbol}.context.c`);
    fs.writeFileSync(contextFile, renderM2cContext(context), 'utf8');
  }
  const selectedVariants = options.variants || workbench.config.m2c.variants;
  const results = [];
  for (const variant of selectedVariants) {
    const argumentsList = [
      m2c.script,
      '--target', workbench.config.m2c.target,
      '--function', target.symbol,
      '--globals', 'used',
      ...variant.arguments,
    ];
    if (contextFile && (options.useContext === true || options.contextFile)) argumentsList.push('--context', path.resolve(contextFile));
    argumentsList.push(assemblyFile);
    const started = Date.now();
    const processResult = childProcess.spawnSync(localTools.splatPython, argumentsList, {
      cwd: m2c.root,
      encoding: 'utf8',
      windowsHide: true,
      maxBuffer: workbench.config.limits.maximumCapturedOutputBytes,
    });
    const rawSource = String(processResult.stdout || '');
    const diagnostics = m2cDiagnostics(rawSource);
    const failure = m2cFailure(rawSource);
    const source = rawSource.trim() ? compilableM2cSource(rawSource) : rawSource;
    const sourceFile = path.join(targetRoot, `${target.symbol}.${variant.name}.c`);
    fs.writeFileSync(sourceFile, source, 'utf8');
    const ok = processResult.status === 0 && source.trim().length > 0 && !source.includes('Decompilation failure');
    results.push({
      variant: variant.name,
      arguments: portableM2cArguments(argumentsList.slice(1), m2c),
      ok,
      source,
      sourceFile,
      stderr: String(processResult.stderr || ''),
      exitCode: processResult.status,
      durationMs: Date.now() - started,
      diagnostics,
      failure,
      m2c,
    });
  }
  return { assembly, assemblyFile, context, contextFile, results, m2c };
}

function prepareAndCompile(workbench, target, options = {}) {
  if (options.syncTargets !== false) syncTargets(workbench, options.storeOptions || {});
  const generated = runM2c(workbench, target, options);
  const compilations = [];
  for (const result of generated.results) {
    if (!result.ok) {
      compilations.push({ variant: result.variant, generated: false, error: result.failure || result.stderr || 'm2c decompilation failed' });
      continue;
    }
    const metadata = {
      m2cAdapterVersion: M2C_ADAPTER_VERSION,
      m2cCommit: generated.m2c.commit,
      m2cTree: generated.m2c.tree,
      arguments: result.arguments,
    };
    if (options.compile === false) {
      const recorded = recordCandidate(workbench, target, result.source, {
        origin: 'm2c',
        variant: result.variant,
        metadata,
        storeOptions: options.storeOptions,
        syncTargets: false,
      });
      compilations.push({
        variant: result.variant,
        generated: true,
        status: 'not-compiled',
        candidateId: recorded.candidate.candidateId,
      });
      continue;
    }
    compilations.push({
      variant: result.variant,
      generated: true,
      result: compileCandidate(workbench, target, result.source, {
        origin: 'm2c',
        variant: result.variant,
        metadata,
        session: options.compilerSession,
        storeOptions: options.storeOptions,
        syncTargets: false,
      }),
    });
  }
  return { ...generated, compilations };
}

module.exports = {
  M2C_ADAPTER_VERSION,
  compilableM2cSource,
  expandValidSyntaxMacros,
  m2cDiagnostics,
  m2cFailure,
  portableM2cArguments,
  prepareAndCompile,
  resolveM2c,
  runM2c,
};
