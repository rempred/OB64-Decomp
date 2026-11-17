#!/usr/bin/env node
'use strict';

const crypto = require('crypto');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const { isDeepStrictEqual } = require('util');

const ROOT = path.resolve(__dirname, '..');
const HASH = /^[A-F0-9]{64}$/;
const sha256 = bytes => crypto.createHash('sha256').update(bytes).digest('hex').toUpperCase();

function repositoryPath(value) {
  if (typeof value !== 'string' || !value || /[\x00-\x1F\\:]/.test(value)
      || path.posix.isAbsolute(value) || path.posix.normalize(value) !== value
      || value === '..' || value.startsWith('../') || value === '.') {
    throw new Error(`Invalid repository path ${JSON.stringify(value)}`);
  }
  return value;
}

function readRetainedClaims(stateFile) {
  const stateBytes = fs.readFileSync(stateFile);
  const state = JSON.parse(stateBytes);
  if (state.schemaVersion !== 7 || state.status !== 'verified' || !state.verifiedAt
      || !HASH.test(state.fingerprint) || !HASH.test(state.baselineFingerprint)
      || !Number.isSafeInteger(state.buildReport?.bytes) || state.buildReport.bytes <= 0) {
    throw new Error('Retained state has no supported verified build identity');
  }
  const readReport = (file, hash, length) => {
    if (typeof file !== 'string' || !HASH.test(hash)) throw new Error('Retained report identity is missing');
    const bytes = fs.readFileSync(file);
    if (sha256(bytes) !== hash || length !== undefined && bytes.length !== length) {
      throw new Error(`Retained report identity mismatch ${file}`);
    }
    return JSON.parse(bytes);
  };
  const build = readReport(state.report, state.buildReport.sha256, state.buildReport.bytes);
  const fresh = readReport(state.freshCompilationReport, state.freshCompilationSha256);
  const verified = readReport(state.verificationReport, state.verificationSha256);
  if (build.schemaVersion !== 8 || build.status !== 'constructed'
      || fresh.schemaVersion !== 7 || fresh.status !== 'pass'
      || verified.schemaVersion !== 7 || verified.status !== 'pass'
      || verified.verification?.schemaVersion !== 7 || verified.verification.status !== 'pass'
      || fresh.inputFingerprint !== state.fingerprint || fresh.baselineFingerprint !== state.baselineFingerprint
      || !isDeepStrictEqual(fresh.buildReport, state.buildReport)
      || !isDeepStrictEqual(verified.buildReport, state.buildReport)
      || build.sourcePolicy?.schemaVersion !== 2 || build.sourcePolicy.status !== 'pass'
      || !Array.isArray(build.sourcePolicy.targets) || !build.sourcePolicy.targets.length
      || !Array.isArray(fresh.targets) || !Array.isArray(build.targetReplacements)) {
    throw new Error('Retained reports do not bind one supported accepted input set');
  }
  const uniqueTargets = (targets, label) => {
    const result = new Map();
    for (const target of targets) {
      if (typeof target.symbol !== 'string' || !target.symbol || result.has(target.symbol)) {
        throw new Error(`Malformed or duplicated ${label} target`);
      }
      result.set(target.symbol, target);
    }
    return result;
  };
  const policy = uniqueTargets(build.sourcePolicy.targets, 'source-policy');
  const compiled = uniqueTargets(fresh.targets, 'fresh-compilation');
  const replacements = uniqueTargets(build.targetReplacements, 'build');
  if (policy.size !== compiled.size || policy.size !== replacements.size) throw new Error('Retained target census mismatch');
  const files = new Map();
  const addFile = (name, bytes, hash) => {
    repositoryPath(name);
    if (!Number.isSafeInteger(bytes) || bytes < 0 || !HASH.test(hash)) throw new Error(`Malformed source identity ${name}`);
    const identity = { path: name, bytes, sha256: hash };
    if (files.has(name) && !isDeepStrictEqual(files.get(name), identity)) throw new Error(`Conflicting source identities ${name}`);
    files.set(name, identity);
  };
  for (const target of policy.values()) {
    const produced = compiled.get(target.symbol), replacement = replacements.get(target.symbol);
    if (!['PURE_C', 'HYBRID_C'].includes(target.class) || !HASH.test(target.digest)
        || !Array.isArray(target.dependencies)
        || [produced, replacement].some(record => !record || record.source !== target.source
          || record.sourceSha256 !== target.sourceSha256 || record.sourceClass !== target.class
          || record.sourcePolicyDigest !== target.digest)) {
      throw new Error(`Retained source proof mismatch ${target.symbol}`);
    }
    addFile(target.source, target.sourceBytes, target.sourceSha256);
    for (const dependency of target.dependencies) addFile(dependency.path, dependency.bytes, dependency.sha256);
  }
  if (!stateBytes.equals(fs.readFileSync(stateFile))) throw new Error('Retained state changed during inspection');
  return { fingerprint: state.fingerprint, verifiedAt: state.verifiedAt, files: [...files.values()].sort((a, b) => a.path.localeCompare(b.path)) };
}

function gitRun(repo, args, options = {}) {
  const result = spawnSync('git', ['-c', 'core.fsmonitor=false', '-C', repo, ...args], {
    input: options.input, env: options.env, encoding: null, windowsHide: true, maxBuffer: 64 * 1024 * 1024,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`Git ${args[0]} failed: ${result.stderr.toString('utf8').trim().slice(0, 1200)}`);
  return result.stdout;
}

function stagedEntries(bytes) {
  const result = new Map();
  for (const record of bytes.toString('utf8').split('\0').filter(Boolean)) {
    const match = /^(\d{6}) ([a-f0-9]+) ([0-3])\t(.+)$/.exec(record);
    if (!match) throw new Error('Malformed staged-index entry');
    const [, mode, oid, stage, name] = match;
    repositoryPath(name);
    if (stage !== '0' || result.has(name)) throw new Error(`Unmerged or duplicated staged-index path ${name}`);
    result.set(name, { mode, oid, path: name });
  }
  return result;
}

function newlineCounts(bytes) {
  const text = bytes.toString('latin1');
  const crlf = (text.match(/\r\n/g) || []).length;
  return { crlf, bareLf: (text.match(/\n/g) || []).length - crlf, bareCr: (text.match(/\r/g) || []).length - crlf };
}

function removeTemporaryDirectory(directory) {
  if (path.dirname(directory) !== path.resolve(os.tmpdir()) || !path.basename(directory).startsWith('ob64-source-checkout-')) {
    throw new Error('Temporary checkout escaped its owned root');
  }
  for (let ancestor = directory; ; ancestor = path.dirname(ancestor)) {
    if (fs.lstatSync(ancestor).isSymbolicLink()) throw new Error(`Temporary checkout has an aliased ancestor ${ancestor}`);
    if (path.dirname(ancestor) === ancestor) break;
  }
  const visit = file => {
    const stat = fs.lstatSync(file);
    if (stat.isSymbolicLink()) throw new Error(`Temporary checkout contains a filesystem alias ${file}`);
    if (stat.isDirectory()) for (const name of fs.readdirSync(file)) visit(path.join(file, name));
  };
  visit(directory);
  fs.rmSync(directory, { recursive: true });
}

function checkSourceCheckout(repo, stateFile) {
  const claims = readRetainedClaims(stateFile);
  const temporary = fs.mkdtempSync(path.join(path.resolve(os.tmpdir()), 'ob64-source-checkout-'));
  try {
    const emptyConfig = path.join(temporary, 'empty-config');
    fs.writeFileSync(emptyConfig, '');
    const env = Object.fromEntries(Object.entries(process.env).filter(([name]) => !name.toUpperCase().startsWith('GIT_')));
    Object.assign(env, { GIT_CONFIG_NOSYSTEM: '1', GIT_CONFIG_GLOBAL: emptyConfig, GIT_ATTR_NOSYSTEM: '1', GIT_NO_LAZY_FETCH: '1', GIT_NO_REPLACE_OBJECTS: '1', GIT_TERMINAL_PROMPT: '0' });
    const indexBefore = gitRun(repo, ['ls-files', '--stage', '-z'], { env });
    const entries = stagedEntries(indexBefore);
    const selected = new Map();
    for (const claim of claims.files) {
      const entry = entries.get(claim.path);
      if (!entry) throw new Error(`Required source/header is absent from the staged index ${claim.path}`);
      selected.set(entry.path, entry);
      let directory = path.posix.dirname(entry.path);
      while (true) {
        const attributePath = directory === '.' ? '.gitattributes' : `${directory}/.gitattributes`;
        if (entries.has(attributePath)) selected.set(attributePath, entries.get(attributePath));
        if (directory === '.') break;
        directory = path.posix.dirname(directory);
      }
    }
    for (const entry of selected.values()) {
      if (!['100644', '100755'].includes(entry.mode)) throw new Error(`Source/header or attribute entry is not a regular blob ${entry.path}`);
    }
    const blobChecks = gitRun(repo, ['cat-file', '--batch-check'], { input: [...selected.values()].map(entry => entry.oid).join('\n') + '\n', env }).toString('utf8').trim().split('\n');
    if (blobChecks.length !== selected.size || blobChecks.some(line => !/^[a-f0-9]+ blob \d+$/.test(line))) throw new Error('A required staged-index blob is missing or has an invalid object type');
    const objectFormat = gitRun(repo, ['rev-parse', '--show-object-format'], { env }).toString('utf8').trim();
    if (!['sha1', 'sha256'].includes(objectFormat)) throw new Error('Unsupported Git object format');
    const objects = gitRun(repo, ['rev-parse', '--path-format=absolute', '--git-path', 'objects'], { env }).toString('utf8').trim();
    const gitDirectory = path.join(temporary, 'index.git'), worktree = path.join(temporary, 'checkout');
    gitRun(temporary, ['init', '--quiet', '--bare', '--template=', `--object-format=${objectFormat}`, gitDirectory], { env });
    fs.mkdirSync(worktree);
    const isolatedEnv = { ...env, GIT_ALTERNATE_OBJECT_DIRECTORIES: objects };
    const command = ['--git-dir=' + gitDirectory, '--work-tree=' + worktree, '-c', 'core.autocrlf=false', '-c', 'core.eol=lf', '-c', 'core.attributesFile=' + emptyConfig];
    const stagedInput = [...selected.values()].map(entry => `${entry.mode} ${entry.oid}\t${entry.path}\0`).join('');
    gitRun(temporary, [...command, 'update-index', '-z', '--index-info'], { input: stagedInput, env: isolatedEnv });
    // Place staged attributes first, so worktree attribute lookup cannot read unstaged files.
    for (const entry of selected.values()) {
      if (path.posix.basename(entry.path) !== '.gitattributes') continue;
      const destination = path.join(worktree, ...entry.path.split('/'));
      fs.mkdirSync(path.dirname(destination), { recursive: true });
      fs.writeFileSync(destination, gitRun(repo, ['cat-file', 'blob', entry.oid], { env }));
    }
    const paths = claims.files.map(file => file.path).join('\0') + '\0';
    const attributes = gitRun(temporary, [...command, 'check-attr', '--cached', '-z', '--stdin', 'filter'], { input: paths, env: isolatedEnv }).toString('utf8').split('\0');
    for (let index = 0; index + 2 < attributes.length; index += 3) {
      if (!['unspecified', 'unset'].includes(attributes[index + 2])) throw new Error(`External filter attribute is unsupported ${attributes[index]} (${attributes[index + 2]})`);
    }
    gitRun(temporary, [...command, 'checkout-index', '--force', '-z', '--stdin', '--prefix=' + worktree.replace(/\\/g, '/') + '/'], { input: paths, env: isolatedEnv });
    const mismatches = [];
    for (const claim of claims.files) {
      const bytes = fs.readFileSync(path.join(worktree, ...claim.path.split('/')));
      const actual = { bytes: bytes.length, sha256: sha256(bytes) };
      if (actual.bytes !== claim.bytes || actual.sha256 !== claim.sha256) mismatches.push({ path: claim.path, expected: { bytes: claim.bytes, sha256: claim.sha256 }, actual, checkoutNewlines: newlineCounts(bytes) });
    }
    if (!indexBefore.equals(gitRun(repo, ['ls-files', '--stage', '-z'], { env }))) throw new Error('Staged index changed during checkout inspection');
    return { status: mismatches.length ? 'fail' : 'pass', scope: 'Staged Git checkout bytes compared with retained accepted source/header identities', fingerprint: claims.fingerprint, verifiedAt: claims.verifiedAt, files: claims.files.length, checkout: { attributes: 'staged repository attributes', coreAutocrlf: false, coreEol: 'lf', externalFilters: 'rejected' }, mismatches };
  } finally {
    removeTemporaryDirectory(temporary);
  }
}

function main(args = process.argv.slice(2)) {
  let repo = ROOT, stateFile;
  for (let index = 0; index < args.length; index += 1) {
    if (args[index] === '--help') {
      console.log('Usage: node tools/check_source_checkout.js [--repo <repository>] [--state <retained-state.json>]');
      console.log('Checks staged checkout source/header bytes against retained proof. This diagnostic grants no source acceptance.');
      return 0;
    }
    if (!['--repo', '--state'].includes(args[index]) || !args[index + 1]) throw new Error('Expected --repo <path> or --state <path>');
    const option = args[index], value = path.resolve(args[++index]);
    if (option === '--repo') repo = value;
    else stateFile = value;
  }
  const result = checkSourceCheckout(repo, stateFile || path.join(repo, 'build/current/state.json'));
  console.log(JSON.stringify(result, null, 2));
  return result.status === 'pass' ? 0 : 1;
}

if (require.main === module) {
  try { process.exitCode = main(); }
  catch (error) { console.error(`Source checkout check failed: ${error.message}`); process.exitCode = 1; }
}
module.exports = { checkSourceCheckout, readRetainedClaims, repositoryPath };
