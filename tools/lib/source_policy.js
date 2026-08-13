'use strict';

const childProcess = require('child_process');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const POLICY_CONFIG_PATH = path.join(ROOT, 'config', 'source-policy.json');
const SOURCE_CLASSES = Object.freeze({
  PURE_C: 'PURE_C',
  HYBRID_C: 'HYBRID_C',
  ASM: 'ASM',
  UNKNOWN: 'UNKNOWN',
});

function sha256Buffer(value) {
  return crypto.createHash('sha256').update(value).digest('hex').toUpperCase();
}

function sha256File(file) {
  return sha256Buffer(fs.readFileSync(file));
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function normalizePath(value) {
  return value.replace(/\\/g, '/');
}

function displayPath(file) {
  const relative = path.relative(ROOT, file);
  if (relative && !relative.startsWith('..') && !path.isAbsolute(relative)) return normalizePath(relative);
  return path.resolve(file);
}

function validPinnedExecutable(record, requireDriverProgram = false) {
  return record
    && typeof record.role === 'string'
    && record.role.length > 0
    && typeof record.path === 'string'
    && record.path.length > 0
    && Number.isInteger(record.bytes)
    && record.bytes > 0
    && typeof record.sha256 === 'string'
    && /^[0-9A-F]{64}$/.test(record.sha256)
    && (!requireDriverProgram || (typeof record.driverProgram === 'string' && /^[A-Za-z0-9_.+-]+$/.test(record.driverProgram)));
}

function loadPolicyConfig() {
  const config = readJson(POLICY_CONFIG_PATH);
  const preprocessor = config.preprocessor;
  const requiredExecutables = preprocessor && preprocessor.requiredExecutables;
  if (config.schemaVersion !== 2 || !config.matchingCompiler || !preprocessor
      || typeof preprocessor.path !== 'string' || preprocessor.path.length === 0
      || !Number.isInteger(preprocessor.bytes) || preprocessor.bytes <= 0
      || typeof preprocessor.sha256 !== 'string' || !/^[0-9A-F]{64}$/.test(preprocessor.sha256)
      || typeof preprocessor.version !== 'string' || preprocessor.version.length === 0
      || !Array.isArray(requiredExecutables) || requiredExecutables.length === 0
      || requiredExecutables.some((record) => !validPinnedExecutable(record, true))
      || !Array.isArray(preprocessor.flags) || !preprocessor.flags.every((item) => typeof item === 'string')
      || !Array.isArray(preprocessor.includeDirectories)
      || !preprocessor.includeDirectories.every((item) => typeof item === 'string')) {
    throw new Error('source-policy configuration schema drift');
  }
  const roles = ['driver', ...requiredExecutables.map((record) => record.role)];
  const paths = [preprocessor.path, ...requiredExecutables.map((record) => record.path)].map((item) => normalizePath(item).toLowerCase());
  if (new Set(roles).size !== roles.length || new Set(paths).size !== paths.length
      || !requiredExecutables.some((record) => record.role === 'preprocessing-engine' && record.driverProgram === 'cc1')) {
    throw new Error('source-policy executable closure schema drift');
  }
  return config;
}

function resolvePinnedExecutable(record) {
  const file = path.resolve(ROOT, record.path);
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) {
    throw new Error(`source-policy ${record.role} is missing: ${file}`);
  }
  const bytes = fs.statSync(file).size;
  if (bytes !== record.bytes) {
    throw new Error(`source-policy ${record.role} byte-size drift: ${bytes}`);
  }
  const actualSha256 = sha256File(file);
  if (actualSha256 !== record.sha256) {
    throw new Error(`source-policy ${record.role} SHA-256 drift: ${actualSha256}`);
  }
  return {
    absolutePath: file,
    identity: {
      role: record.role,
      path: displayPath(file),
      bytes,
      sha256: actualSha256,
    },
  };
}

function sameExecutablePath(left, right) {
  const normalize = (file) => fs.realpathSync.native(path.resolve(file)).toLowerCase();
  return normalize(left) === normalize(right);
}

function preprocessorIdentity(preprocessor) {
  return {
    sha256: preprocessor.sha256,
    version: preprocessor.version,
    executables: preprocessor.executables.map((record) => ({ ...record })),
    matchingCompiler: { ...preprocessor.matchingCompiler },
  };
}

function resolvePreprocessor(config = loadPolicyConfig()) {
  const compilerManifest = path.resolve(ROOT, config.matchingCompiler.manifest);
  if (!fs.existsSync(compilerManifest) || sha256File(compilerManifest) !== config.matchingCompiler.manifestSha256) {
    throw new Error('source-policy matching compiler manifest drift');
  }
  const compiler = readJson(compilerManifest);
  if (compiler.schemaVersion !== 1 || !compiler.compiler
      || compiler.compiler.executableSha256 !== config.matchingCompiler.executableSha256
      || config.matchingCompiler.preprocessingMode !== 'authenticated-external-companion') {
    throw new Error('source-policy matching compiler contract drift');
  }
  const driver = resolvePinnedExecutable({
    role: 'driver',
    path: config.preprocessor.path,
    bytes: config.preprocessor.bytes,
    sha256: config.preprocessor.sha256,
  });
  const dependencies = config.preprocessor.requiredExecutables.map((record) => ({
    config: record,
    resolved: resolvePinnedExecutable(record),
  }));
  for (const dependency of dependencies) {
    const probe = childProcess.spawnSync(driver.absolutePath, [`-print-prog-name=${dependency.config.driverProgram}`], {
      cwd: ROOT,
      encoding: 'utf8',
      windowsHide: true,
    });
    const reported = String(probe.stdout || '').split(/\r?\n/).find((line) => line.trim()) || '';
    const reportedPath = path.isAbsolute(reported.trim())
      ? path.resolve(reported.trim())
      : path.resolve(path.dirname(driver.absolutePath), reported.trim());
    if (probe.status !== 0 || probe.error || !reported.trim() || !fs.existsSync(reportedPath)
        || !sameExecutablePath(reportedPath, dependency.resolved.absolutePath)) {
      throw new Error(`source-policy ${dependency.config.role} dependency closure drift: ${reported.trim() || '<not resolved>'}`);
    }
  }
  const versionResult = childProcess.spawnSync(driver.absolutePath, ['--version'], {
    cwd: ROOT,
    encoding: 'utf8',
    windowsHide: true,
  });
  const version = String(versionResult.stdout || versionResult.stderr || '').split(/\r?\n/, 1)[0].trim();
  if (versionResult.status !== 0 || version !== config.preprocessor.version) {
    throw new Error(`source-policy preprocessor version drift: ${version || '<no version>'}`);
  }
  return {
    path: driver.absolutePath,
    sha256: driver.identity.sha256,
    version,
    executables: [
      { ...driver.identity, version },
      ...dependencies.map((dependency) => ({ ...dependency.resolved.identity })),
    ],
    flags: [...config.preprocessor.flags],
    includeDirectories: config.preprocessor.includeDirectories.map((item) => path.resolve(ROOT, item)),
    matchingCompiler: {
      executableSha256: compiler.compiler.executableSha256,
      manifestSha256: config.matchingCompiler.manifestSha256,
      preprocessingMode: config.matchingCompiler.preprocessingMode,
    },
  };
}

function isIdentifierStart(char) {
  return /[A-Za-z_$]/.test(char);
}

function isIdentifierPart(char) {
  return /[A-Za-z0-9_$]/.test(char);
}

function tokenizeC(source) {
  const tokens = [];
  let index = 0;
  let line = 1;
  let column = 1;

  function advance() {
    const char = source[index++];
    if (char === '\n') {
      line += 1;
      column = 1;
    } else {
      column += 1;
    }
    return char;
  }

  while (index < source.length) {
    const char = source[index];
    const next = source[index + 1];
    if (/\s/.test(char)) {
      advance();
      continue;
    }
    if (char === '/' && next === '/') {
      advance();
      advance();
      while (index < source.length && source[index] !== '\n') advance();
      continue;
    }
    if (char === '/' && next === '*') {
      const startLine = line;
      advance();
      advance();
      let closed = false;
      while (index < source.length) {
        if (source[index] === '*' && source[index + 1] === '/') {
          advance();
          advance();
          closed = true;
          break;
        }
        advance();
      }
      if (!closed) throw new Error(`unterminated block comment at line ${startLine}`);
      continue;
    }
    if (char === '"' || char === "'") {
      const quote = char;
      const start = index;
      const startLine = line;
      const startColumn = column;
      advance();
      let closed = false;
      while (index < source.length) {
        if (source[index] === '\\') {
          advance();
          if (index < source.length) advance();
          continue;
        }
        if (source[index] === quote) {
          advance();
          closed = true;
          break;
        }
        advance();
      }
      if (!closed) throw new Error(`unterminated literal at line ${startLine}`);
      tokens.push({ kind: quote === '"' ? 'string' : 'character', value: source.slice(start, index), line: startLine, column: startColumn });
      continue;
    }
    if (isIdentifierStart(char)) {
      const start = index;
      const startLine = line;
      const startColumn = column;
      advance();
      while (index < source.length && isIdentifierPart(source[index])) advance();
      tokens.push({ kind: 'identifier', value: source.slice(start, index), line: startLine, column: startColumn });
      continue;
    }
    tokens.push({ kind: 'punctuator', value: char, line, column });
    advance();
  }
  return tokens;
}

function stripComments(source) {
  let result = '';
  let index = 0;
  let state = 'normal';
  while (index < source.length) {
    const char = source[index];
    const next = source[index + 1];
    if (state === 'normal' && char === '/' && next === '/') {
      result += '  ';
      index += 2;
      state = 'line-comment';
      continue;
    }
    if (state === 'normal' && char === '/' && next === '*') {
      result += '  ';
      index += 2;
      state = 'block-comment';
      continue;
    }
    if (state === 'line-comment') {
      if (char === '\n') {
        result += '\n';
        state = 'normal';
      } else {
        result += ' ';
      }
      index += 1;
      continue;
    }
    if (state === 'block-comment') {
      if (char === '*' && next === '/') {
        result += '  ';
        index += 2;
        state = 'normal';
      } else {
        result += char === '\n' ? '\n' : ' ';
        index += 1;
      }
      continue;
    }
    if (state === 'string' || state === 'character') {
      result += char;
      index += 1;
      if (char === '\\' && index < source.length) {
        result += source[index++];
      } else if ((state === 'string' && char === '"') || (state === 'character' && char === "'")) {
        state = 'normal';
      }
      continue;
    }
    result += char;
    index += 1;
    if (char === '"') state = 'string';
    if (char === "'") state = 'character';
  }
  return result;
}

function attributeIdentifiers(tokens, startIndex) {
  let cursor = startIndex + 1;
  while (cursor < tokens.length && tokens[cursor].value !== '(') cursor += 1;
  if (cursor >= tokens.length) return [];
  let depth = 0;
  const identifiers = [];
  for (; cursor < tokens.length; cursor += 1) {
    const token = tokens[cursor];
    if (token.value === '(') depth += 1;
    if (token.value === ')') {
      depth -= 1;
      if (depth === 0) break;
    }
    if (depth > 0 && token.kind === 'identifier') identifiers.push(token.value.toLowerCase());
  }
  return identifiers;
}

function scanSource(source, stage) {
  const tokens = tokenizeC(source);
  const reasons = [];
  const asmKeywords = new Set(['asm', '__asm', '__asm__']);
  const attributeKeywords = new Set(['__attribute', '__attribute__', '__declspec']);
  const injectionAttributes = new Set(['naked', 'section', 'alias', 'code_seg', 'allocate']);

  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];
    if (token.kind !== 'identifier') continue;
    const lowered = token.value.toLowerCase();
    if (asmKeywords.has(lowered)) {
      reasons.push({ stage, code: 'assembler-keyword', token: token.value, line: token.line, column: token.column });
      continue;
    }
    if (attributeKeywords.has(lowered)) {
      const identifiers = attributeIdentifiers(tokens, index);
      const prohibited = identifiers.find((item) => injectionAttributes.has(item));
      if (prohibited) {
        reasons.push({ stage, code: 'executable-injection-attribute', token: prohibited, line: token.line, column: token.column });
      }
    }
  }

  const withoutComments = stripComments(source);
  const includePattern = /^\s*#\s*include\s*[<"]([^>"]+)[>"]/gmi;
  for (const match of withoutComments.matchAll(includePattern)) {
    if (/(?:^|[\\/])[^\\/]+\.(?:s|asm|inc)(?:\.[A-Za-z0-9_]+)?$/i.test(match[1])) {
      const line = withoutComments.slice(0, match.index).split('\n').length;
      reasons.push({ stage, code: 'assembler-source-include', token: match[1], line, column: 1 });
    }
  }
  const pragmaPattern = /^\s*#\s*pragma\s+.*\b(?:code_seg|section|naked)\b/gmi;
  for (const match of withoutComments.matchAll(pragmaPattern)) {
    const line = withoutComments.slice(0, match.index).split('\n').length;
    reasons.push({ stage, code: 'executable-injection-pragma', token: match[0].trim(), line, column: 1 });
  }
  return reasons;
}

function preprocessSource(sourceFile, preprocessor, extraIncludeDirectories = []) {
  const includeDirectories = [path.dirname(sourceFile), ...preprocessor.includeDirectories, ...extraIncludeDirectories];
  const args = [
    ...preprocessor.flags,
    ...[...new Set(includeDirectories.map((item) => path.resolve(item)))].flatMap((item) => ['-I', item]),
    sourceFile,
  ];
  const result = childProcess.spawnSync(preprocessor.path, args, {
    cwd: ROOT,
    encoding: 'utf8',
    windowsHide: true,
    maxBuffer: 64 * 1024 * 1024,
  });
  if (result.status !== 0 || result.error) {
    return {
      ok: false,
      error: result.error ? String(result.error) : String(result.stderr || result.stdout || `exit ${result.status}`).trim(),
      args,
    };
  }
  return { ok: true, text: result.stdout, stderr: result.stderr, args };
}

function resultDigest(result) {
  const stable = {
    class: result.class,
    source: result.source,
    sourceSha256: result.sourceSha256 || null,
    preprocessedSha256: result.preprocessedSha256 || null,
    reasons: result.reasons || [],
    error: result.error || null,
    preprocessorIdentity: result.preprocessor ? preprocessorIdentity(result.preprocessor) : null,
  };
  return sha256Buffer(Buffer.from(JSON.stringify(stable), 'utf8'));
}

function classifySource(source, options = {}) {
  const sourceFile = path.resolve(options.root || ROOT, source);
  const shownSource = displayPath(sourceFile);
  const extension = path.extname(sourceFile).toLowerCase();
  if (['.s', '.asm'].includes(extension)) {
    const result = { class: SOURCE_CLASSES.ASM, source: shownSource, reasons: [] };
    result.digest = resultDigest(result);
    return result;
  }
  if (extension !== '.c') {
    const result = { class: SOURCE_CLASSES.UNKNOWN, source: shownSource, reasons: [], error: `unsupported source extension: ${extension || '<none>'}` };
    result.digest = resultDigest(result);
    return result;
  }
  if (!fs.existsSync(sourceFile) || !fs.statSync(sourceFile).isFile()) {
    const result = { class: SOURCE_CLASSES.UNKNOWN, source: shownSource, reasons: [], error: 'source file is missing' };
    result.digest = resultDigest(result);
    return result;
  }

  let preprocessor;
  try {
    preprocessor = options.preprocessor || resolvePreprocessor(options.config);
  } catch (error) {
    const result = { class: SOURCE_CLASSES.UNKNOWN, source: shownSource, reasons: [], error: error.message };
    result.digest = resultDigest(result);
    return result;
  }

  const rawText = fs.readFileSync(sourceFile, 'utf8');
  let rawReasons;
  try {
    rawReasons = scanSource(rawText, 'raw');
  } catch (error) {
    const result = {
      class: SOURCE_CLASSES.UNKNOWN,
      source: shownSource,
      sourceSha256: sha256Buffer(Buffer.from(rawText, 'utf8')),
      reasons: [],
      error: `raw source classification failed: ${error.message}`,
      preprocessor: preprocessorIdentity(preprocessor),
    };
    result.digest = resultDigest(result);
    return result;
  }

  const preprocessed = preprocessSource(sourceFile, preprocessor, options.includeDirectories || []);
  if (!preprocessed.ok) {
    const result = {
      class: rawReasons.length > 0 ? SOURCE_CLASSES.HYBRID_C : SOURCE_CLASSES.UNKNOWN,
      source: shownSource,
      sourceSha256: sha256Buffer(Buffer.from(rawText, 'utf8')),
      reasons: rawReasons,
      error: `preprocessing failed: ${preprocessed.error}`,
      preprocessor: preprocessorIdentity(preprocessor),
    };
    result.digest = resultDigest(result);
    return result;
  }

  let preprocessedReasons;
  try {
    preprocessedReasons = scanSource(preprocessed.text, 'preprocessed');
  } catch (error) {
    const result = {
      class: SOURCE_CLASSES.UNKNOWN,
      source: shownSource,
      sourceSha256: sha256Buffer(Buffer.from(rawText, 'utf8')),
      preprocessedSha256: sha256Buffer(Buffer.from(preprocessed.text, 'utf8')),
      reasons: rawReasons,
      error: `preprocessed source classification failed: ${error.message}`,
      preprocessor: preprocessorIdentity(preprocessor),
    };
    result.digest = resultDigest(result);
    return result;
  }
  const reasons = [...rawReasons, ...preprocessedReasons];
  const result = {
    class: reasons.length > 0 ? SOURCE_CLASSES.HYBRID_C : SOURCE_CLASSES.PURE_C,
    source: shownSource,
    sourceSha256: sha256Buffer(Buffer.from(rawText, 'utf8')),
    preprocessedSha256: sha256Buffer(Buffer.from(preprocessed.text, 'utf8')),
    reasons,
    preprocessor: preprocessorIdentity(preprocessor),
  };
  result.digest = resultDigest(result);
  return result;
}

function classifyTargetSources(targets, options = {}) {
  if (!Array.isArray(targets) || targets.length === 0) throw new Error('active target source list is missing');
  const preprocessor = options.preprocessor || resolvePreprocessor(options.config);
  const symbols = new Set();
  const records = targets.map((target) => {
    if (!target || typeof target.symbol !== 'string' || typeof target.source !== 'string'
        || !Number.isInteger(target.bytes) || target.bytes <= 0) {
      throw new Error('active target source metadata is malformed');
    }
    const resolvedSource = path.resolve(ROOT, target.source);
    const relativeSource = path.relative(ROOT, resolvedSource);
    if (path.isAbsolute(target.source) || !relativeSource || relativeSource === '..'
        || relativeSource.startsWith(`..${path.sep}`) || path.isAbsolute(relativeSource)) {
      throw new Error(`active target source escapes the repository: ${target.source}`);
    }
    const key = target.symbol.toLowerCase();
    if (symbols.has(key)) throw new Error(`active target source is duplicated: ${target.symbol}`);
    symbols.add(key);
    return {
      symbol: target.symbol,
      bytes: target.bytes,
      ...classifySource(target.source, { preprocessor }),
    };
  });
  const counts = {};
  const bytes = {};
  for (const name of Object.values(SOURCE_CLASSES)) {
    const selected = records.filter((target) => target.class === name);
    counts[name] = selected.length;
    bytes[name] = selected.reduce((sum, target) => sum + target.bytes, 0);
  }
  const unknown = records.filter((target) => target.class === SOURCE_CLASSES.UNKNOWN);
  if (unknown.length > 0) {
    throw new Error(`active target source classification is UNKNOWN: ${unknown.map((target) => target.symbol).join(', ')}`);
  }
  const assembly = records.filter((target) => target.class === SOURCE_CLASSES.ASM);
  if (assembly.length > 0) {
    throw new Error(`active C target has ASM source class: ${assembly.map((target) => target.symbol).join(', ')}`);
  }
  return {
    schemaVersion: 1,
    status: 'pass',
    preprocessor: preprocessorIdentity(preprocessor),
    counts,
    bytes,
    targets: records,
  };
}

module.exports = {
  POLICY_CONFIG_PATH,
  ROOT,
  SOURCE_CLASSES,
  classifySource,
  classifyTargetSources,
  loadPolicyConfig,
  preprocessorIdentity,
  preprocessSource,
  resolvePreprocessor,
  scanSource,
  sha256Buffer,
  sha256File,
  tokenizeC,
};
