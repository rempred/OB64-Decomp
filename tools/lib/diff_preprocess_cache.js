'use strict';

// Development diff only. Cache CPP bytes, never a source classification or proof.
// Tier A has no directives/includes or reserved macro identifiers. Tier B binds
// a conservative literal-include closure and names/types directory inventories.
// Unsupported inputs stay fresh; final verification never uses this cache.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const policy = require('./source_policy');
const ROOT = policy.ROOT;
const SHA = /^[A-F0-9]{64}$/;
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex').toUpperCase();
const json = value => JSON.stringify(value);
const equal = (a, b) => json(a) === json(b);
function fail(message) { throw new Error('diff preprocessing cache: ' + message); }
function keys(value, names) { return value && typeof value === 'object' && !Array.isArray(value)
  && equal(Object.keys(value).sort(), [...names].sort()); }
function canonicalPath(file) { const resolved = path.resolve(file); return process.platform === 'win32' ? resolved.toLowerCase() : resolved; }
function regular(file) {
  const stat = fs.lstatSync(file);
  if (!stat.isFile() || stat.isSymbolicLink()) fail('not a regular file: ' + file);
  const bytes = fs.readFileSync(file);
  return { path: path.resolve(file), bytes: bytes.length, sha256: hash(bytes) };
}
function directory(file) {
  const absolute = path.resolve(file), stat = fs.lstatSync(absolute);
  if (!stat.isDirectory() || stat.isSymbolicLink() || canonicalPath(fs.realpathSync.native(absolute)) !== canonicalPath(absolute)) fail('nonregular directory: ' + absolute);
  return absolute;
}
function confined(root, file) {
  const relative = path.relative(root, file);
  if (!relative || relative === '..' || relative.startsWith('..' + path.sep) || path.isAbsolute(relative)) fail('path escapes root');
  if (canonicalPath(fs.realpathSync.native(file)) !== canonicalPath(file)) fail('indirect path');
}
function eligible(bytes) {
  // Raw scanning intentionally also excludes suspect spellings in comments and
  // strings. That lowers coverage without changing source-policy admissibility.
  const text = bytes.toString('utf8');
  return bytes.length > 0 && !/[^\x09\x0A\x0D\x20-\x7E]/.test(text)
    && !/#|\\[ \t]*[\r\n]|\\[uU]|\?\?|<:|:>|<%|%>|%:/.test(text)
    && !/\b(?:__[A-Za-z0-9_]*|_[A-Z][A-Za-z0-9_]*|_Pragma)\b/.test(text);
}
function eligibility(bytes) {
  if (eligible(bytes)) return { tier: 'A', includes: [] };
  const text = bytes.toString('utf8');
  if (!bytes.length || /[^\x09\x0A\x0D\x20-\x7E]|\\[ \t]*[\r\n]|\\[uU]|\?\?|<:|:>|<%|%>|%:/.test(text)) fail('ineligible:lexical');
  const tokens = policy.tokenizeC(text), lines = new Map(), includes = [];
  const volatile = /^(?:__DATE__|__TIME__|__TIMESTAMP__|__COUNTER__|__INCLUDE_LEVEL__|__BASE_FILE__|__has_.*|__is_.*|_Pragma)$/;
  for (const token of tokens) {
    if (token.kind === 'identifier' && volatile.test(token.value)) fail('ineligible:volatile-or-probe');
    if ((token.kind === 'string' || token.kind === 'character') && /[\r\n]/.test(token.value)) fail('ineligible:multiline-literal');
    if (!lines.has(token.line)) lines.set(token.line, []);
    lines.get(token.line).push(token);
  }
  const directives = new Set(['define', 'undef', 'if', 'ifdef', 'ifndef', 'elif', 'else', 'endif', 'include', 'error']);
  for (const line of lines.values()) {
    const hashes = line.filter(token => token.kind === 'punctuator' && token.value === '#');
    if (!hashes.length) continue;
    if (hashes.length !== 1 || hashes[0] !== line[0] || line[1]?.kind !== 'identifier' || !directives.has(line[1].value)) fail('ineligible:directive');
    if (line[1].value !== 'include') continue;
    const body = line.slice(2); let name, quote;
    if (body.length === 1 && body[0].kind === 'string') { name = body[0].value.slice(1, -1); quote = true; }
    else if (body[0]?.value === '<' && body.at(-1)?.value === '>') {
      // No lexer-elided comments or whitespace inside an angle header name.
      for (let i = 1; i < body.length; i++) if (body[i].column !== body[i - 1].column + body[i - 1].value.length) fail('ineligible:include-spelling');
      name = body.slice(1, -1).map(token => token.value).join(''); quote = false;
    } else fail('ineligible:nonliteral-include');
    if (!/^[A-Za-z0-9_.-]+(?:\/[A-Za-z0-9_.-]+)*$/.test(name) || name.split('/').some(part => part === '.' || part === '..')) fail('ineligible:include-path');
    includes.push({ name, quote });
  }
  return { tier: 'B', includes };
}
function measure(options, name, callback) { return options?.profile ? options.profile.measure('diff-preprocess-cache.' + name, callback) : callback(); }
function environmentHash(environment) {
  const entries = Object.entries(environment).map(([name, value]) => [process.platform === 'win32' ? name.toUpperCase() : name, String(value)]);
  entries.sort((a, b) => a[0].localeCompare(b[0]) || a[1].localeCompare(b[1]));
  return hash(Buffer.from(json(entries)));
}
function createDiffPreprocessCache(options = {}) {
  const fallback = options.preprocessSource || policy.preprocessSource;
  const resolvePreprocessor = options.resolvePreprocessor || policy.resolvePreprocessor;
  const getEnvironment = options.getEnvironment || (() => process.env);
  const implementationFiles = options.implementationFiles || [__filename, require.resolve('./source_policy')];
  const cacheRoot = path.resolve(options.cacheRoot || path.join(ROOT, 'build/cache/diff-preprocess'));
  const requested = new Set((options.requestedSources || []).map(file => canonicalPath(path.resolve(ROOT, file))));
  const tools = new Map(), used = new Map(), roots = new Set(), inventories = new Map();
  const counters = { hits: 0, misses: 0, fresh: 0, requested: 0, ineligible: 0, invalid: 0, published: 0, writeFailures: 0,
    publishSkipped: 0, unpublishable: 0, firstIneligibleReason: null };
  let active = true, implementation = null, environment = null, deferredDrift = null;
  function live() { if (!active) fail('invocation already finished'); }
  function remember(file, identity) {
    if (used.has(file) && !equal(used.get(file), identity)) fail('source/dependency changed between uses');
    used.set(file, { ...identity });
  }
  function authenticate(preprocessor) {
    const identity = policy.preprocessorIdentity(preprocessor);
    const driver = canonicalPath(preprocessor.path), dependencyRoot = canonicalPath(preprocessor.dependencyRoot);
    const id = json({ identity, driver, dependencyRoot });
    if (tools.has(id)) return tools.get(id);
    const actual = resolvePreprocessor();
    if (!equal(policy.preprocessorIdentity(actual), identity) || driver !== canonicalPath(actual.path)
        || dependencyRoot !== canonicalPath(actual.dependencyRoot)) fail('preprocessor identity differs from authenticated pins');
    const configFile = path.resolve(ROOT, preprocessor.configIdentity.path);
    const config = JSON.parse(fs.readFileSync(configFile, 'utf8'));
    const manifestFile = path.resolve(ROOT, config.matchingCompiler.manifest);
    const records = [regular(configFile), regular(manifestFile), ...preprocessor.executables.map(record => {
      const current = regular(path.resolve(ROOT, record.path));
      if (current.bytes !== record.bytes || current.sha256 !== record.sha256) fail('preprocessor executable drift');
      return current;
    })];
    if (records[0].bytes !== preprocessor.configIdentity.bytes || records[0].sha256 !== preprocessor.configIdentity.sha256
        || records[1].sha256 !== preprocessor.matchingCompiler.manifestSha256) fail('preprocessor configuration drift');
    const value = { identity, records }; tools.set(id, value); return value;
  }
  function includeRoots(sourceFile, preprocessor, extra) {
    return [...new Set([path.dirname(sourceFile), ...preprocessor.includeDirectories, ...extra].map(file => directory(file)))].map(file => {
      confined(directory(ROOT), file); roots.add(file); return path.relative(ROOT, file).replace(/\\/g, '/');
    });
  }
  function inventory(root) {
    directory(root); const nodes = [];
    function visit(dir) {
      for (const name of fs.readdirSync(dir).sort()) {
        const file = path.join(dir, name), stat = fs.lstatSync(file), relative = path.relative(root, file).replace(/\\/g, '/');
        if (stat.isSymbolicLink() || (!stat.isDirectory() && !stat.isFile())) fail('ineligible:include-tree-node');
        confined(root, file); nodes.push([relative, stat.isDirectory() ? 'directory' : 'file']);
        if (stat.isDirectory()) visit(file);
      }
    }
    visit(root); return { root: path.relative(ROOT, root).replace(/\\/g, '/'), sha256: hash(Buffer.from(json(nodes))) };
  }
  function closure(sourceFile, includeDirectories) {
    const search = includeDirectories.map(dir => path.resolve(ROOT, dir));
    const treeIdentities = search.map(root => {
      if (!inventories.has(root)) inventories.set(root, inventory(root));
      return inventories.get(root);
    });
    const files = new Map();
    function visit(file) {
      const canonical = canonicalPath(file); if (files.has(canonical)) return;
      if (!search.some(root => { const relative = path.relative(root, file); return relative && relative !== '..' && !relative.startsWith('..' + path.sep) && !path.isAbsolute(relative); })) fail('ineligible:closure-outside-roots');
      const identity = policy.dependencyIdentities([file], file)[0], bytes = fs.readFileSync(file);
      if (hash(bytes) !== identity.sha256) fail('ineligible:closure-read-drift');
      const parsed = eligibility(bytes); files.set(canonical, identity);
      for (const include of parsed.includes) {
        const directories = [...new Set([...(include.quote ? [path.dirname(file)] : []), ...search])];
        let resolved = null;
        for (const dir of directories) {
          const candidate = path.join(dir, ...include.name.split('/'));
          if (!fs.existsSync(candidate)) continue;
          regular(candidate); confined(dir, candidate); resolved = candidate; break;
        }
        if (!resolved) fail('ineligible:unresolved-include');
        visit(resolved);
      }
    }
    visit(sourceFile);
    return { closure: [...files.values()].sort((a, b) => a.path.localeCompare(b.path)), inventories: treeIdentities };
  }
  function baseline(preprocessor) {
    const pin = authenticate(preprocessor);
    const currentImplementation = implementationFiles.map(regular), currentEnvironment = environmentHash(getEnvironment());
    if (implementation && !equal(implementation, currentImplementation)) fail('implementation changed during invocation');
    if (environment && environment !== currentEnvironment) fail('environment changed during invocation');
    implementation = currentImplementation; environment = currentEnvironment;
    return pin;
  }
  function input(sourceFile, preprocessor, extra) {
    const dependencies = policy.dependencyIdentities([sourceFile], sourceFile), source = dependencies[0];
    const bytes = fs.readFileSync(sourceFile);
    if (bytes.length !== source.bytes || hash(bytes) !== source.sha256) fail('source changed during read');
    if (!equal(preprocessor.flags, ['-P', '-undef', '-nostdinc'])) fail('ineligible:flags');
    const parsed = eligibility(bytes);
    if (parsed.tier === 'B' && Object.entries(getEnvironment()).some(([name, value]) => value !== undefined && value !== ''
        && /^(?:CPATH|C_INCLUDE_PATH|CPLUS_INCLUDE_PATH|OBJC_INCLUDE_PATH|DEPENDENCIES_OUTPUT|SUNPRO_DEPENDENCIES|GCC_EXEC_PREFIX|COMPILER_PATH|CPPFLAGS|CFLAGS)$/i.test(name))) fail('ineligible:include-environment');
    const pin = baseline(preprocessor);
    const includeDirectories = includeRoots(sourceFile, preprocessor, extra);
    return { schemaVersion: 2, tier: parsed.tier, source, sourceFile: canonicalPath(sourceFile), preprocessor: pin.identity,
      cwd: canonicalPath(ROOT), includeDirectories,
      ...(parsed.tier === 'B' ? closure(sourceFile, includeDirectories) : { closure: [source], inventories: [] }),
      implementation, environmentSha256: environment };
  }
  function dependenciesValid(dependencies, key) {
    if (!Array.isArray(dependencies) || !dependencies.length || !dependencies.some(record => equal(record, key.source))) return false;
    const paths = new Set();
    for (const record of dependencies) {
      if (!keys(record, ['path', 'bytes', 'sha256']) || paths.has(String(record.path).toLowerCase()) || !key.closure.some(value => equal(value, record))) return false;
      paths.add(record.path.toLowerCase());
    }
    return equal([...dependencies].sort((a, b) => a.path.localeCompare(b.path)), dependencies);
  }
  function resultArgsValid(args, key) {
    const flags = key.preprocessor.flags;
    return Array.isArray(args) && args.every(arg => typeof arg === 'string')
      && args.length === flags.length + 5 + 2 * key.includeDirectories.length + 1
      && equal(args.slice(0, flags.length), flags) && args[flags.length] === '-MD' && args[flags.length + 1] === '-MF'
      && path.isAbsolute(args[flags.length + 2]) && args[flags.length + 3] === '-MT'
      && args[flags.length + 4] === key.preprocessor.dependencyTarget
      && equal(args.slice(flags.length + 5), [...key.includeDirectories.flatMap(file => ['-I', file]), key.source.path]);
  }
  function readEntry(entry, key) {
    directory(cacheRoot); directory(entry); confined(cacheRoot, entry);
    if (!equal(fs.readdirSync(entry).sort(), ['bytes.bin', 'metadata.json'])) fail('entry file census');
    for (const name of ['bytes.bin', 'metadata.json']) confined(entry, path.join(entry, name));
    regular(path.join(entry, 'metadata.json'));
    const metadataBytes = fs.readFileSync(path.join(entry, 'metadata.json')), metadata = JSON.parse(metadataBytes);
    if (!keys(metadata, ['schemaVersion', 'key', 'keySha256', 'output', 'dependencies', 'args', 'stderr'])
        || metadata.schemaVersion !== 1 || !equal(metadata.key, key) || metadata.keySha256 !== hash(Buffer.from(json(key)))
        || !keys(metadata.output, ['bytes', 'sha256']) || !Number.isSafeInteger(metadata.output.bytes) || metadata.output.bytes <= 0
        || !SHA.test(metadata.output.sha256) || !dependenciesValid(metadata.dependencies, key)
        || typeof metadata.stderr !== 'string' || !resultArgsValid(metadata.args, key)
        || !metadataBytes.equals(Buffer.from(json(metadata) + '\n'))) fail('entry metadata contract');
    const identity = regular(path.join(entry, 'bytes.bin')), bytes = fs.readFileSync(path.join(entry, 'bytes.bin'));
    if (identity.bytes !== metadata.output.bytes || identity.sha256 !== metadata.output.sha256 || hash(bytes) !== identity.sha256) fail('entry byte identity');
    return { ok: true, bytes, text: bytes.toString('utf8'), stderr: metadata.stderr, args: [...metadata.args],
      source: { ...key.source }, dependencies: metadata.dependencies.map(record => ({ ...record })) };
  }
  function publish(entry, key, result) {
    if (fs.existsSync(entry)) { counters.publishSkipped++; return; } // Unknown/corrupt entries are never clobbered.
    fs.mkdirSync(cacheRoot, { recursive: true }); directory(cacheRoot);
    const stage = fs.mkdtempSync(path.join(cacheRoot, '.stage-'));
    try {
      const metadata = { schemaVersion: 1, key, keySha256: hash(Buffer.from(json(key))),
        output: { bytes: result.bytes.length, sha256: hash(result.bytes) }, dependencies: result.dependencies, args: result.args, stderr: result.stderr };
      fs.writeFileSync(path.join(stage, 'bytes.bin'), result.bytes, { flag: 'wx' });
      fs.writeFileSync(path.join(stage, 'metadata.json'), json(metadata) + '\n', { flag: 'wx' });
      readEntry(stage, key);
      try { fs.renameSync(stage, entry); counters.published++; }
      catch (error) {
        if (!fs.existsSync(entry)) throw error;
        const winner = readEntry(entry, key);
        if (!winner.bytes.equals(result.bytes)) fail('atomic winner differs from fresh preprocessing');
      }
    } finally {
      if (fs.existsSync(stage)) {
        directory(stage); confined(cacheRoot, stage);
        // Only these two files were created here; never recursively delete.
        for (const name of ['bytes.bin', 'metadata.json']) if (fs.existsSync(path.join(stage, name))) fs.unlinkSync(path.join(stage, name));
        fs.rmdirSync(stage);
      }
    }
  }
  function fresh(sourceFile, preprocessor, extra, preprocessOptions) {
    try { baseline(preprocessor); } catch (error) { deferredDrift = error; }
    counters.fresh++;
    const result = measure(preprocessOptions, 'fresh', () => fallback(sourceFile, preprocessor, extra, preprocessOptions));
    if (result.ok) {
      const identities = policy.dependencyIdentities(result.dependencies.map(record => record.path), sourceFile);
      if (!equal(identities, result.dependencies)) fail('fresh dependency identities drift');
      for (const identity of identities) remember(path.resolve(ROOT, identity.path), identity);
    }
    return result;
  }
  function preprocess(sourceFile, preprocessor, extraIncludeDirectories = [], preprocessOptions = {}) {
    live(); sourceFile = path.resolve(sourceFile);
    if (requested.has(canonicalPath(sourceFile))) { counters.requested++; return fresh(sourceFile, preprocessor, extraIncludeDirectories, preprocessOptions); }
    let key;
    try { key = measure(preprocessOptions, 'input', () => input(sourceFile, preprocessor, extraIncludeDirectories)); }
    catch (error) {
      counters.ineligible++;
      if (!counters.firstIneligibleReason) counters.firstIneligibleReason = /^diff preprocessing cache: ineligible:[a-z-]+$/.test(error.message)
        ? error.message.split('ineligible:')[1] : 'input-authentication';
      return fresh(sourceFile, preprocessor, extraIncludeDirectories, preprocessOptions);
    }
    const entry = path.join(cacheRoot, hash(Buffer.from(json(key))));
    let result;
    if (fs.existsSync(entry)) {
      try { result = measure(preprocessOptions, 'read', () => readEntry(entry, key)); counters.hits++; }
      catch (_) { counters.invalid++; }
    }
    if (!result) {
      counters.misses++; result = fresh(sourceFile, preprocessor, extraIncludeDirectories, preprocessOptions);
      if (!result.ok || !Buffer.isBuffer(result.bytes) || !result.bytes.length || result.text !== result.bytes.toString('utf8')
          || !equal(result.source, key.source) || !dependenciesValid(result.dependencies, key) || !resultArgsValid(result.args, key)
          || typeof result.stderr !== 'string') { counters.unpublishable++; return result; }
      if (!equal(policy.dependencyIdentities([sourceFile], sourceFile), [key.source])) fail('source drift after preprocessing');
      try { measure(preprocessOptions, 'publish', () => publish(entry, key, result)); } catch (_) { counters.writeFailures++; /* Retain independently fresh bytes. */ }
    }
    for (const identity of key.closure) remember(path.resolve(ROOT, identity.path), identity);
    return { ...result, bytes: Buffer.from(result.bytes), source: { ...result.source }, dependencies: result.dependencies.map(record => ({ ...record })), args: [...result.args] };
  }
  function finish() {
    live(); active = false;
    if (deferredDrift) throw deferredDrift;
    if (implementation && !equal(implementationFiles.map(regular), implementation)) fail('implementation drift at finish');
    if (environment && environmentHash(getEnvironment()) !== environment) fail('environment drift at finish');
    for (const value of tools.values()) for (const record of value.records) if (!equal(regular(record.path), record)) fail('tool/configuration drift at finish');
    for (const [file, identity] of used) if (!equal(policy.dependencyIdentities([file], file), [identity])) fail('source drift at finish');
    for (const root of roots) { directory(root); confined(directory(ROOT), root); }
    for (const [root, identity] of inventories) if (!equal(inventory(root), identity)) fail('include tree inventory drift at finish');
  }
  return { preprocess, finish, get stats() { return { ...counters }; } };
}
module.exports = { createDiffPreprocessCache };
