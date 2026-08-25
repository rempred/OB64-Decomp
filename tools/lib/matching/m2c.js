'use strict';

const childProcess = require('child_process');
const crypto = require('crypto');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { ROOT } = require('../phase7_conventional');
const { resolveLocalTools } = require('../local_tools');
const { emitM2cAssembly } = require('./assembly');
const { MATCHING_ROOT, compileCandidate, recordCandidate, syncTargets } = require('./compiler');
const { renderM2cContext, storeTargetContext } = require('./context');

const M2C_ADAPTER_VERSION = 11;
const M2C_SNAPSHOT_PREFIX = 'ob64-m2c-snapshot-';

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
  for (const [name, expansion] of expansions) {
    while (new RegExp(`\\b${name}\\s*\\(`).test(result)) result = expandMacro(result, name, expansion);
  }
  return result.replace(/\bM2C_CARRY\b/g, '0');
}

function stripCComments(source) {
  let result = '';
  let state = 'code';
  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];
    const next = source[index + 1];
    if (state === 'code') {
      if (char === '"') {
        state = 'string';
        result += char;
      } else if (char === "'") {
        state = 'character';
        result += char;
      } else if (char === '/' && next === '*') {
        state = 'block-comment';
        result += '  ';
        index += 1;
      } else if (char === '/' && next === '/') {
        state = 'line-comment';
        result += '  ';
        index += 1;
      } else {
        result += char;
      }
      continue;
    }
    if (state === 'string' || state === 'character') {
      result += char;
      if (char === '\\' && next !== undefined) {
        result += next;
        index += 1;
      } else if ((state === 'string' && char === '"') || (state === 'character' && char === "'")) {
        state = 'code';
      }
      continue;
    }
    if (state === 'block-comment') {
      if (char === '*' && next === '/') {
        result += '  ';
        index += 1;
        state = 'code';
      } else {
        result += char === '\r' || char === '\n' ? char : ' ';
      }
      continue;
    }
    if (char === '\r' || char === '\n') {
      result += char;
      state = 'code';
    } else {
      result += ' ';
    }
  }
  return result;
}

function compilableM2cSource(source) {
  // cc1 is invoked directly by the accepted build contract, so its input must
  // already be preprocessed: even a C89 comment emitted by the adapter is a
  // parse error. m2c warnings are diagnostics rather than source and are kept
  // in the generation result, so remove those lines from the compilable view.
  const withoutWarnings = source.replace(/^Warning:\s*.*(?:\r?\n|$)/gm, '');
  const preprocessed = stripCComments(withoutWarnings.replace(/^\uFEFF/, ''));
  const expanded = expandValidSyntaxMacros(preprocessed);
  // m2c uses a dereferenced `void *` for pointer-valued unknown memory words.
  // Dereferencing void is invalid C; retaining the pointer-sized value requires
  // a `void **` lvalue and does not change the emitted 32-bit load/store width.
  const typedVoidDereferences = expanded.replace(/\*\(\s*void\s*\*\s*\)/g, '*(void **)');
  return `${TYPE_PRELUDE}${typedVoidDereferences.replace(/\bNULL\b/g, '0')}`;
}

function escapedPattern(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function functionDefinition(source, symbol) {
  const pattern = new RegExp(`\\b${escapedPattern(symbol)}\\s*\\(`, 'g');
  while (true) {
    const match = pattern.exec(source);
    if (!match) return null;
    const parameterOpen = source.indexOf('(', match.index + symbol.length);
    const parameters = macroArguments(source, parameterOpen);
    let bodyOpen = parameters.end;
    while (/\s/.test(source[bodyOpen] || '')) bodyOpen += 1;
    if (source[bodyOpen] !== '{') continue;
    let depth = 1;
    for (let index = bodyOpen + 1; index < source.length; index += 1) {
      if (source[index] === '{') depth += 1;
      else if (source[index] === '}') {
        depth -= 1;
        if (depth === 0) {
          return {
            parameterOpen,
            parameterEnd: parameters.end - 1,
            parameters: parameters.args,
            bodyOpen,
            bodyEnd: index,
          };
        }
      }
    }
    throw new Error(`unterminated generated function body: ${symbol}`);
  }
}

function preserveGprArgumentGaps(source, symbol) {
  const definition = functionDefinition(source, symbol);
  if (!definition || definition.parameters.length === 0) return { source, applied: false };
  if (definition.parameters.length === 1 && definition.parameters[0] === 'void') return { source, applied: false };
  const parameters = [];
  for (const declaration of definition.parameters) {
    const name = declaration.match(/\barg([0-9]+)\b(?=\s*(?:\[[^\]]*\])?\s*$)/);
    if (!name) return { source, applied: false };
    const index = Number(name[1]);
    const type = declaration.slice(0, name.index);
    if (!Number.isInteger(index) || index < 0 || index > 3) return { source, applied: false };
    if (/\b(?:f32|f64|float|double|s64|u64)\b|long\s+long/i.test(type)) return { source, applied: false };
    parameters.push({ declaration: declaration.trim(), index });
  }
  if (parameters.some((parameter, index) => index > 0 && parameter.index <= parameters[index - 1].index)) {
    return { source, applied: false };
  }
  const byIndex = new Map(parameters.map((parameter) => [parameter.index, parameter.declaration]));
  const highest = parameters[parameters.length - 1].index;
  const missing = [];
  const expanded = [];
  for (let index = 0; index <= highest; index += 1) {
    if (byIndex.has(index)) expanded.push(byIndex.get(index));
    else {
      missing.push(index);
      expanded.push(`s32 m2c_unused_arg${index}`);
    }
  }
  if (!missing.length) return { source, applied: false };
  return {
    source: source.slice(0, definition.parameterOpen + 1)
      + expanded.join(', ')
      + source.slice(definition.parameterEnd),
    applied: true,
    details: { insertedGprArguments: missing },
  };
}

function preloadByteBeforeZeroStore(source, symbol) {
  const definition = functionDefinition(source, symbol);
  if (!definition) return { source, applied: false };
  const body = source.slice(definition.bodyOpen + 1, definition.bodyEnd).replace(/\r\n/g, '\n');
  const lines = body.split('\n');
  const statements = lines
    .map((line, index) => ({ index, indent: (line.match(/^\s*/) || [''])[0], text: line.trim() }))
    .filter((line) => line.text);
  if (statements.length !== 3) return { source, applied: false };
  const zeroStore = statements[0].text.match(/^(.+?)\s*=\s*0;$/);
  const byteStore = statements[1].text.match(/^(.+?)\s*=\s*((?:\([A-Za-z_][A-Za-z0-9_]*\)\s*)?)\*(arg[0-9]+);$/);
  const returnedCursor = statements[2].text.match(/^return\s+(arg[0-9]+)\s*\+\s*1;$/);
  if (!zeroStore || !byteStore || !returnedCursor || byteStore[3] !== returnedCursor[1]) {
    return { source, applied: false };
  }
  if (!zeroStore[1].startsWith('(*(') || !byteStore[1].startsWith('(*(')) return { source, applied: false };
  const cursor = byteStore[3];
  if (zeroStore[1].includes(cursor) || byteStore[1].includes(cursor)) return { source, applied: false };
  const firstBases = [...zeroStore[1].matchAll(/\barg[0-9]+\b/g)].map((match) => match[0]);
  const secondBases = [...byteStore[1].matchAll(/\barg[0-9]+\b/g)].map((match) => match[0]);
  if (new Set(firstBases).size !== 1 || new Set(secondBases).size !== 1 || firstBases[0] !== secondBases[0]) {
    return { source, applied: false };
  }
  const signature = source.slice(definition.parameterOpen + 1, definition.parameterEnd);
  if (!new RegExp(`\\bu8\\s*\\*\\s*${escapedPattern(cursor)}\\b`).test(signature)) return { source, applied: false };
  const loadedName = 'm2c_loaded_byte';
  if (new RegExp(`\\b${loadedName}\\b`).test(source)) return { source, applied: false };
  lines.splice(statements[0].index, 0, `${statements[0].indent}u8 ${loadedName} = *${cursor};`);
  const adjustedByteStoreIndex = statements[1].index + 1;
  lines[adjustedByteStoreIndex] = `${statements[1].indent}${byteStore[1]} = ${byteStore[2]}${loadedName};`;
  const transformedBody = lines.join('\n');
  return {
    source: source.slice(0, definition.bodyOpen + 1)
      + transformedBody
      + source.slice(definition.bodyEnd),
    applied: true,
    details: { cursorArgument: cursor },
  };
}

function replaceFunctionBody(source, definition, body) {
  return source.slice(0, definition.bodyOpen + 1) + body + source.slice(definition.bodyEnd);
}

function widenNarrowReturns(source, symbol) {
  const definition = functionDefinition(source, symbol);
  if (!definition) return { source, applied: false };
  const symbolIndex = source.lastIndexOf(symbol, definition.parameterOpen);
  const headerStart = source.lastIndexOf('\n', symbolIndex) + 1;
  const header = source.slice(headerStart, symbolIndex);
  const returnType = header.match(/\b(s8|u8|s16|u16)\s*$/);
  if (!returnType) return { source, applied: false };
  const body = source.slice(definition.bodyOpen + 1, definition.bodyEnd);
  const returned = body.match(/\breturn\s+([A-Za-z_][A-Za-z0-9_]*)\s*;\s*$/);
  if (!returned) return { source, applied: false };
  const widenedLocals = [];
  const widenedBody = body.replace(/^(\s*)(s8|u8|s16|u16)(\s+)([A-Za-z_][A-Za-z0-9_]*)(\s*;)\s*$/gm,
    (line, indent, type, spacing, name, suffix) => {
      widenedLocals.push({ name, from: type });
      return `${indent}s32${spacing}${name}${suffix}`;
    });
  if (!widenedLocals.some((local) => local.name === returned[1])) return { source, applied: false };
  const typeStart = headerStart + returnType.index;
  const withReturn = source.slice(0, typeStart) + 's32' + source.slice(typeStart + returnType[1].length);
  const adjustedDefinition = functionDefinition(withReturn, symbol);
  return {
    source: replaceFunctionBody(withReturn, adjustedDefinition, widenedBody),
    applied: true,
    details: { returnType: returnType[1], widenedLocals },
  };
}

function directConditionalReturns(source, symbol) {
  const definition = functionDefinition(source, symbol);
  if (!definition) return { source, applied: false };
  const body = source.slice(definition.bodyOpen + 1, definition.bodyEnd).replace(/\r\n/g, '\n');
  const returned = body.match(/\breturn\s+([A-Za-z_][A-Za-z0-9_]*)\s*;\s*$/);
  if (!returned) return { source, applied: false };
  const resultName = returned[1];
  const name = escapedPattern(resultName);
  const sequence = new RegExp(`\\n([ \\t]*)${name}\\s*=\\s*([^;\\n]+);\\s*if\\s*\\(([^\\n]+)\\)\\s*\\{\\s*${name}\\s*=\\s*([^;\\n]+);\\s*\\}\\s*return\\s+${name}\\s*;\\s*$`);
  const match = body.match(sequence);
  if (!match || match[2].includes(resultName) || match[4].includes(resultName)) return { source, applied: false };
  let prefix = body.slice(0, match.index + 1);
  const declaration = new RegExp(`^[ \\t]*(?:s8|u8|s16|u16|s32|u32|s64|u64|f32|f64|M2C_UNK(?:8|16|32|64)?)\\s+${name}\\s*;[ \\t]*(?:\\n|$)`, 'm');
  if (!declaration.test(prefix)) return { source, applied: false };
  prefix = prefix.replace(declaration, '');
  const indent = match[1];
  const replacement = [
    `${indent}if (!(${match[3].trim()})) {`,
    `${indent}    return ${match[2].trim()};`,
    `${indent}}`,
    `${indent}return ${match[4].trim()};`,
    '',
  ].join('\n');
  return {
    source: replaceFunctionBody(source, definition, prefix + replacement),
    applied: true,
    details: { resultVariable: resultName },
  };
}

function advanceDirectByteCursor(source, symbol) {
  const definition = functionDefinition(source, symbol);
  if (!definition) return null;
  const body = source.slice(definition.bodyOpen + 1, definition.bodyEnd).replace(/\r\n/g, '\n');
  const lines = body.split('\n');
  for (let index = 0; index < lines.length; index += 1) {
    const load = lines[index].match(/^(\s*)([A-Za-z_][A-Za-z0-9_]*)\s*=\s*\*(arg[0-9]+)\s*;\s*$/);
    if (!load) continue;
    const cursor = load[3];
    const returnIndex = lines.findIndex((line) => new RegExp(`^\\s*return\\s+${escapedPattern(cursor)}\\s*\\+\\s*1\\s*;\\s*$`).test(line));
    if (returnIndex <= index) continue;
    const signature = source.slice(definition.parameterOpen + 1, definition.parameterEnd);
    if (!new RegExp(`\\bu8\\s*\\*\\s*${escapedPattern(cursor)}\\b`).test(signature)) continue;
    const dereferences = [...body.matchAll(new RegExp(`\\*\\s*${escapedPattern(cursor)}\\b`, 'g'))];
    const mutations = [...body.matchAll(new RegExp(`\\b${escapedPattern(cursor)}\\s*(?:\\+\\+|--|[+\\-*/]?=)`, 'g'))];
    if (dereferences.length !== 1 || mutations.length !== 0) continue;
    lines.splice(index + 1, 0, `${load[1]}${cursor} += 1;`);
    lines[returnIndex + 1] = lines[returnIndex + 1].replace(/return\s+[^;]+;/, `return ${cursor};`);
    return {
      source: replaceFunctionBody(source, definition, lines.join('\n')),
      details: { pattern: 'direct-byte', cursorArgument: cursor },
    };
  }
  return null;
}

function advancePackedWordCursor(source, symbol) {
  const definition = functionDefinition(source, symbol);
  if (!definition) return null;
  const body = source.slice(definition.bodyOpen + 1, definition.bodyEnd).replace(/\r\n/g, '\n');
  const statements = body.split('\n')
    .map((line) => ({ indent: (line.match(/^\s*/) || [''])[0], text: line.trim() }))
    .filter((line) => line.text);
  if (statements.length !== 3) return null;
  const returned = statements[2].text.match(/^return\s+(arg[0-9]+)\s*\+\s*1\s*\+\s*1\s*;$/);
  if (!returned || !statements[0].text.endsWith('= 0;')) return null;
  const cursor = returned[1];
  const signature = source.slice(definition.parameterOpen + 1, definition.parameterEnd);
  if (!new RegExp(`\\b(?:u8|void)\\s*\\*\\s*${escapedPattern(cursor)}\\b`).test(signature)) return null;
  const highExpression = `(*(u8 *)((s8 *)(${cursor}) + (0)))`;
  const lowExpression = `(*(u8 *)((s8 *)(${cursor}) + (1)))`;
  if (statements[1].text.split(highExpression).length !== 2 || statements[1].text.split(lowExpression).length !== 2) return null;
  const highName = 'm2c_high_byte';
  const lowName = 'm2c_low_byte';
  if (source.includes(highName) || source.includes(lowName)) return null;
  const rewrittenStore = statements[1].text.replace(highExpression, highName).replace(lowExpression, lowName);
  const indent = statements[0].indent;
  const rewritten = [
    '',
    `${indent}u8 ${highName};`,
    `${indent}u8 ${lowName};`,
    '',
    `${indent}${highName} = *${cursor};`,
    `${indent}${cursor} += 1;`,
    `${indent}${lowName} = *${cursor};`,
    `${indent}${cursor} += 1;`,
    `${indent}${statements[0].text}`,
    `${indent}${rewrittenStore}`,
    `${indent}return ${cursor};`,
    '',
  ].join('\n');
  let transformedSource = replaceFunctionBody(source, definition, rewritten);
  const transformedDefinition = functionDefinition(transformedSource, symbol);
  const parameters = transformedSource.slice(transformedDefinition.parameterOpen + 1, transformedDefinition.parameterEnd);
  const voidCursor = new RegExp(`\\bvoid\\s*\\*\\s*${escapedPattern(cursor)}\\b`);
  if (voidCursor.test(parameters)) {
    const rewrittenParameters = parameters.replace(voidCursor, `u8 *${cursor}`);
    transformedSource = transformedSource.slice(0, transformedDefinition.parameterOpen + 1)
      + rewrittenParameters
      + transformedSource.slice(transformedDefinition.parameterEnd);
  }
  return {
    source: transformedSource,
    details: { pattern: 'packed-word', cursorArgument: cursor },
  };
}

function explicitByteCursorSteps(source, symbol) {
  const result = advanceDirectByteCursor(source, symbol) || advancePackedWordCursor(source, symbol);
  return result ? { ...result, applied: true } : { source, applied: false };
}

function materializeMaskedComparison(source, symbol) {
  const definition = functionDefinition(source, symbol);
  if (!definition) return { source, applied: false };
  const body = source.slice(definition.bodyOpen + 1, definition.bodyEnd).replace(/\r\n/g, '\n');
  const lines = body.split('\n');
  const matches = [];
  for (let index = 0; index < lines.length; index += 1) {
    const match = lines[index].match(/^(\s*)([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.+&\s*0x[0-9A-Fa-f]+\)*)\s*==\s*0\s*;\s*$/);
    if (match) matches.push({ index, match });
  }
  if (matches.length !== 1 || source.includes('m2c_masked_value')) return { source, applied: false };
  const selected = matches[0];
  if (!new RegExp(`\\breturn\\s+${escapedPattern(selected.match[2])}\\s*;`).test(body)) return { source, applied: false };
  const indent = selected.match[1];
  lines.splice(selected.index, 1,
    `${indent}m2c_masked_value = ${selected.match[3].trim()};`,
    `${indent}${selected.match[2]} = m2c_masked_value == 0;`);
  const declarationIndent = '    ';
  lines.splice(1, 0, `${declarationIndent}s32 m2c_masked_value;`);
  return {
    source: replaceFunctionBody(source, definition, lines.join('\n')),
    applied: true,
    details: { resultVariable: selected.match[2] },
  };
}

function applyGenerationTransforms(source, transforms, options = {}) {
  let current = source;
  const applied = [];
  for (const name of transforms || []) {
    let result;
    if (name === 'preserve-gpr-argument-gaps') result = preserveGprArgumentGaps(current, options.symbol);
    else if (name === 'preload-byte-before-zero-store') result = preloadByteBeforeZeroStore(current, options.symbol);
    else if (name === 'widen-narrow-returns') result = widenNarrowReturns(current, options.symbol);
    else if (name === 'direct-conditional-returns') result = directConditionalReturns(current, options.symbol);
    else if (name === 'explicit-byte-cursor-steps') result = explicitByteCursorSteps(current, options.symbol);
    else if (name === 'materialize-masked-comparison') result = materializeMaskedComparison(current, options.symbol);
    else throw new Error(`unknown m2c generation transform: ${name}`);
    current = result.source;
    if (result.applied) applied.push({ name, details: result.details || {} });
  }
  return { source: current, applied };
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

function m2cSnapshotContentSha256(root) {
  const resolvedRoot = path.resolve(root);
  const hash = crypto.createHash('sha256');
  function visit(directory) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true }).sort((left, right) => left.name.localeCompare(right.name))) {
      const absolute = path.join(directory, entry.name);
      const relative = path.relative(resolvedRoot, absolute).replace(/\\/g, '/');
      if (entry.isDirectory()) {
        hash.update(`directory\0${relative}\0`);
        visit(absolute);
      } else if (entry.isSymbolicLink()) {
        hash.update(`symlink\0${relative}\0${fs.readlinkSync(absolute)}\0`);
      } else if (entry.isFile()) {
        hash.update(`file\0${relative}\0`);
        hash.update(fs.readFileSync(absolute));
        hash.update('\0');
      } else {
        throw new Error(`m2c snapshot contains an unsupported entry: ${relative}`);
      }
    }
  }
  visit(resolvedRoot);
  return hash.digest('hex').toUpperCase();
}

function validateM2cSnapshot(m2c) {
  if (!m2c?.snapshot || !m2c.snapshotRoot || !m2c.snapshotContentSha256) {
    throw new Error('m2c sweep snapshot provenance is incomplete');
  }
  const script = path.join(path.resolve(m2c.root), 'm2c.py');
  if (path.resolve(m2c.script) !== script || !fs.existsSync(script)) {
    throw new Error('m2c sweep snapshot script is missing');
  }
  const observed = m2cSnapshotContentSha256(m2c.root);
  if (observed !== m2c.snapshotContentSha256) {
    throw new Error(`m2c sweep snapshot content drift: ${observed}`);
  }
  return m2c;
}

function setM2cSnapshotWritable(root, writable) {
  function visit(directory) {
    if (writable) fs.chmodSync(directory, 0o755);
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const absolute = path.join(directory, entry.name);
      if (entry.isDirectory()) visit(absolute);
      else if (entry.isFile()) fs.chmodSync(absolute, writable ? 0o644 : 0o444);
    }
    if (!writable) fs.chmodSync(directory, 0o555);
  }
  visit(path.resolve(root));
}

function removeM2cSnapshot(m2c) {
  if (!m2c?.snapshotRoot) return;
  const temporaryRoot = path.resolve(os.tmpdir());
  const snapshotRoot = path.resolve(m2c.snapshotRoot);
  const relative = path.relative(temporaryRoot, snapshotRoot);
  if (!relative || relative.startsWith('..') || path.isAbsolute(relative)
      || !path.basename(snapshotRoot).startsWith(M2C_SNAPSHOT_PREFIX)) {
    throw new Error(`refusing to remove unsafe m2c snapshot path: ${snapshotRoot}`);
  }
  if (!fs.existsSync(snapshotRoot)) return;
  setM2cSnapshotWritable(snapshotRoot, true);
  fs.rmSync(snapshotRoot, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 });
}

function createM2cSnapshot(workbench, authenticatedM2c) {
  const source = resolveM2c(workbench, { m2cRoot: authenticatedM2c.root });
  const snapshotRoot = fs.mkdtempSync(path.join(os.tmpdir(), M2C_SNAPSHOT_PREFIX));
  const archive = path.join(snapshotRoot, 'source.tar');
  const root = path.join(snapshotRoot, 'tree');
  fs.mkdirSync(root);
  try {
    const archived = childProcess.spawnSync('git', [
      '-C', source.root, 'archive', '--format=tar', `--output=${archive}`, source.commit,
    ], { encoding: 'utf8', windowsHide: true });
    if (archived.status !== 0 || archived.error) {
      throw new Error(`m2c snapshot archive failed: ${String(archived.stderr || archived.error || '').trim() || 'unknown git error'}`);
    }
    const extracted = childProcess.spawnSync('tar', ['-xf', archive, '-C', root], { encoding: 'utf8', windowsHide: true });
    if (extracted.status !== 0 || extracted.error) {
      throw new Error(`m2c snapshot extraction failed: ${String(extracted.stderr || extracted.error || '').trim() || 'unknown tar error'}`);
    }
    fs.unlinkSync(archive);
    const snapshot = {
      ...source,
      root,
      script: path.join(root, 'm2c.py'),
      snapshot: true,
      snapshotRoot,
      snapshotContentSha256: m2cSnapshotContentSha256(root),
    };
    setM2cSnapshotWritable(root, false);
    return validateM2cSnapshot(snapshot);
  } catch (error) {
    removeM2cSnapshot({ snapshotRoot });
    throw error;
  }
}

function groupGenerationVariants(variants) {
  const groups = [];
  const byArguments = new Map();
  for (const variant of variants) {
    const key = JSON.stringify(variant.arguments || []);
    if (!byArguments.has(key)) {
      const group = { arguments: variant.arguments || [], variants: [] };
      byArguments.set(key, group);
      groups.push(group);
    }
    byArguments.get(key).variants.push(variant);
  }
  return groups;
}

function runM2c(workbench, target, options = {}) {
  // Sweeps authenticate m2c once before dispatching targets. Reuse that
  // immutable identity instead of spawning three git probes for every target.
  const m2c = options.m2c || resolveM2c(workbench, options);
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
  const results = new Map();
  for (const group of groupGenerationVariants(selectedVariants)) {
    const argumentsList = [
      m2c.script,
      '--target', workbench.config.m2c.target,
      '--function', target.symbol,
      '--globals', 'used',
      ...group.arguments,
    ];
    if (contextFile && (options.useContext === true || options.contextFile)) argumentsList.push('--context', path.resolve(contextFile));
    argumentsList.push(assemblyFile);
    const started = Date.now();
    const processResult = childProcess.spawnSync(localTools.splatPython, argumentsList, {
      cwd: m2c.root,
      encoding: 'utf8',
      env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
      windowsHide: true,
      maxBuffer: workbench.config.limits.maximumCapturedOutputBytes,
    });
    const rawSource = String(processResult.stdout || '');
    const diagnostics = m2cDiagnostics(rawSource);
    const failure = m2cFailure(rawSource);
    const compilableSource = rawSource.trim() ? compilableM2cSource(rawSource) : rawSource;
    const durationMs = Date.now() - started;
    for (const variant of group.variants) {
      const transformed = applyGenerationTransforms(compilableSource, variant.transforms || [], { symbol: target.symbol });
      const source = transformed.source;
      const sourceFile = path.join(targetRoot, `${target.symbol}.${variant.name}.c`);
      fs.writeFileSync(sourceFile, source, 'utf8');
      const ok = processResult.status === 0 && !failure && source.trim().length > TYPE_PRELUDE.trim().length;
      results.set(variant.name, {
        variant: variant.name,
        arguments: portableM2cArguments(argumentsList.slice(1), m2c),
        ok,
        source,
        sourceFile,
        stderr: String(processResult.stderr || ''),
        exitCode: processResult.status,
        durationMs,
        sharedGenerationVariants: group.variants.map((item) => item.name),
        diagnostics,
        failure,
        transforms: {
          requested: variant.transforms || [],
          applied: transformed.applied,
        },
        m2c,
      });
    }
  }
  return {
    assembly,
    assemblyFile,
    context,
    contextFile,
    results: selectedVariants.map((variant) => results.get(variant.name)),
    m2c,
  };
}

function prepareAndCompile(workbench, target, options = {}) {
  if (options.syncTargets !== false) syncTargets(workbench, options.storeOptions || {});
  const generated = runM2c(workbench, target, options);
  const compilations = [];
  const compiledSources = new Map();
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
      transforms: result.transforms,
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
    if (compiledSources.has(result.source)) {
      const recorded = recordCandidate(workbench, target, result.source, {
        origin: 'm2c',
        variant: result.variant,
        metadata,
        storeOptions: options.storeOptions,
        syncTargets: false,
      });
      const shared = compiledSources.get(result.source);
      compilations.push({
        variant: result.variant,
        generated: true,
        result: {
          ...shared.result,
          candidate: recorded.candidate,
          sharedCompile: true,
          sharedCompileVariant: shared.variant,
        },
      });
      continue;
    }
    const compiled = compileCandidate(workbench, target, result.source, {
      origin: 'm2c',
      variant: result.variant,
      metadata,
      session: options.compilerSession,
      storeOptions: options.storeOptions,
      syncTargets: false,
    });
    compiledSources.set(result.source, { variant: result.variant, result: compiled });
    compilations.push({
      variant: result.variant,
      generated: true,
      result: compiled,
    });
  }
  return { ...generated, compilations };
}

module.exports = {
  M2C_ADAPTER_VERSION,
  applyGenerationTransforms,
  compilableM2cSource,
  createM2cSnapshot,
  expandValidSyntaxMacros,
  m2cDiagnostics,
  m2cFailure,
  portableM2cArguments,
  preloadByteBeforeZeroStore,
  directConditionalReturns,
  explicitByteCursorSteps,
  groupGenerationVariants,
  materializeMaskedComparison,
  prepareAndCompile,
  preserveGprArgumentGaps,
  removeM2cSnapshot,
  resolveM2c,
  runM2c,
  validateM2cSnapshot,
  widenNarrowReturns,
};
