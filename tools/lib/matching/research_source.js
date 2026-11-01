'use strict';

// Intake-only preprocessing. Authenticate consumed results, not every unused
// descendant of the authored-source directory. This grants no native capability.
const fs = require('fs');
const path = require('path');
const os = require('os');
const childProcess = require('child_process');
const inputSet = require('./input_set');
const policy = require('../source_policy');

function fail(message) {
  const error = new Error(`research preprocessing: ${message}`);
  error.code = 'OB64_SELECTED_INPUT';
  throw error;
}

function createResearchSourceSession(inputs) {
  if (!inputSet.isResearch(inputs)) fail('requires a research-only input context');
  const records = [];
  let closed = false;

  function preprocess(sourceFile, preprocessor, extraDirectories = []) {
    inputSet.assertContext(preprocessor, inputs);
    const sourcePath = inputs.source(sourceFile);
    const raw = inputs.readResearch(sourceFile);
    const source = { path: inputs.logical(sourcePath), bytes: raw.length, sha256: policy.sha256Buffer(raw) };
    const directories = [...new Set([path.dirname(sourcePath), ...preprocessor.includeDirectories, ...extraDirectories]
      .map(directory => path.resolve(directory)))];
    // resolvePreprocessor retains configured include-directory closure. Here the
    // potentially large authored-source directory needs path authentication only.
    for (const directory of directories) inputs.logicalDirectory(directory);
    const scratch = fs.mkdtempSync(path.join(path.resolve(os.tmpdir()), 'ob64-research-source-'));
    const dependencyFile = path.join(scratch, 'dependencies.d');
    const args = [...preprocessor.flags, '-MD', '-MF', dependencyFile,
      '-MT', preprocessor.dependencyTarget, ...directories.flatMap(directory => ['-I', directory]), sourcePath];
    try {
      const result = childProcess.spawnSync(preprocessor.path, args, {
        cwd: policy.ROOT, windowsHide: true, maxBuffer: 64 * 1024 * 1024,
      });
      if (result.status !== 0 || result.error || !fs.existsSync(dependencyFile)) {
        return { ok: false, args, error: result.error ? String(result.error)
          : Buffer.concat([result.stderr || Buffer.alloc(0), result.stdout || Buffer.alloc(0)]).toString('utf8').trim()
            || `exit ${result.status}` };
      }
      const bytes = Buffer.from(result.stdout || Buffer.alloc(0));
      if (!bytes.length) return { ok: false, args, error: 'preprocessor produced an empty compilation input' };
      inputSet.regular(dependencyFile);
      const dependencies = policy.dependencyIdentities(
        policy.parseDependencyFile(fs.readFileSync(dependencyFile, 'utf8'), preprocessor.dependencyTarget), sourcePath, inputs);
      // Enroll every actual dependency in the retained-byte and closing seal,
      // including any dependency newly selected by the closing replay.
      for (const dependency of dependencies) {
        const retained = inputs.readResearch(path.resolve(policy.ROOT, dependency.path));
        if (retained.length !== dependency.bytes || policy.sha256Buffer(retained) !== dependency.sha256) {
          fail(`dependency differs from retained input: ${dependency.path}`);
        }
      }
      const currentSource = dependencies.find(record => record.path.toLowerCase() === source.path.toLowerCase());
      if (!currentSource || currentSource.bytes !== source.bytes || currentSource.sha256 !== source.sha256) {
        fail('authored source changed during preprocessing');
      }
      return { ok: true, bytes, text: bytes.toString('utf8'), stderr: Buffer.from(result.stderr || Buffer.alloc(0)).toString('utf8'),
        args, source, dependencies };
    } finally {
      // Only the one known output and its owned directory are removed; no
      // recursive cleanup or traversal of unexpected descendants is permitted.
      const stat = fs.lstatSync(scratch);
      if (stat.isSymbolicLink() || !stat.isDirectory()
          || fs.realpathSync.native(scratch).toLowerCase() !== scratch.toLowerCase()) fail('temporary directory redirected');
      try { fs.unlinkSync(dependencyFile); } catch (error) { if (error.code !== 'ENOENT') throw error; }
      fs.rmdirSync(scratch);
    }
  }

  return Object.freeze({
    classifySource(sourceFile, options = {}) {
      if (closed || options.inputs !== inputs) fail('closed or mismatched research source session');
      return policy.classifySource(sourceFile, { inputs, preprocess(source, preprocessor, extraDirectories) {
        const result = preprocess(source, preprocessor, extraDirectories);
        if (result.ok) records.push({ source, preprocessor, extraDirectories, result });
        return result;
      } });
    },
    async close() {
      if (closed) fail('research source session already closed');
      closed = true;
      for (const record of records) {
        // Re-authenticate executable pins before another real CPP invocation.
        const preprocessor = policy.resolvePreprocessor(undefined, inputs);
        if (JSON.stringify(policy.preprocessorIdentity(preprocessor)) !== JSON.stringify(policy.preprocessorIdentity(record.preprocessor))) {
          fail('preprocessor contract changed');
        }
        const replay = preprocess(record.source, preprocessor, record.extraDirectories);
        if (!replay.ok) fail(`closing replay failed: ${replay.error}`);
        if (!replay.bytes.equals(record.result.bytes)
            || JSON.stringify(replay.source) !== JSON.stringify(record.result.source)
            || JSON.stringify(replay.dependencies) !== JSON.stringify(record.result.dependencies)) {
          fail('closing expansion/source/dependency identity drift');
        }
      }
      await inputs.closeResearch();
    },
  });
}

module.exports = { createResearchSourceSession };
