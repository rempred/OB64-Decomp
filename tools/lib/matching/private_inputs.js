'use strict';

// A command-local drift check, not an acceptance cache. No persistent seal is saved.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { ROOT } = require('../phase7_conventional');

function regular(file, directory = false) {
  const resolved = path.resolve(file);
  for (let current = resolved; ; current = path.dirname(current)) {
    if (fs.existsSync(current) && fs.lstatSync(current).isSymbolicLink()) {
      throw new Error(`private input is redirected: ${current}`);
    }
    if (path.dirname(current) === current) break;
  }
  const stat = fs.lstatSync(resolved);
  if (!(directory ? stat.isDirectory() : stat.isFile())) throw new Error(`private input is not regular: ${resolved}`);
  if (path.normalize(fs.realpathSync.native(resolved)).toLowerCase() !== path.normalize(resolved).toLowerCase()) {
    throw new Error(`private input has an aliased real path: ${resolved}`);
  }
  return resolved;
}

function fileIdentity(file) {
  regular(file);
  const bytes = fs.readFileSync(file);
  return { bytes: bytes.length, sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
}

function capturePrivateInputs(options = {}) {
  const root = path.resolve(options.root || ROOT);
  const directories = options.directories || ['config', 'include', 'src', 'tools/lib'];
  const files = options.files || ['tools/match.js', 'tools/matching_workbench/store.py',
    'tools/matching_workbench/schema.sql', 'tools/matching_workbench/private_guard.py',
    'build/current/state.json', 'build/current/baseline-state.json',
    'build/current/verification.json', 'build/current/fresh-compilation.json'];
  const capture = () => {
    const records = {};
    const visit = (file, relative) => {
      if (!fs.existsSync(file)) { records[relative] = null; return; }
      const stat = fs.lstatSync(file);
      if (stat.isDirectory()) {
        regular(file, true);
        records[`${relative}/`] = 'directory';
        for (const name of fs.readdirSync(file).sort()) visit(path.join(file, name), `${relative}/${name}`);
      } else records[relative] = fileIdentity(file);
    };
    for (const relative of [...directories, ...files]) {
      if (path.isAbsolute(relative) || relative.split(/[\\/]/).includes('..')) throw new Error('private input path escapes repository');
      visit(path.join(root, relative), relative.replace(/\\/g, '/'));
    }
    if (!options.directories && !options.files) {
      const read = relative => JSON.parse(fs.readFileSync(path.join(root, relative), 'utf8'));
      const expectedRom = read('config/phase7/conventional-build.json').rom;
      const normalizedRom = fileIdentity(path.join(root, 'build/baserom.us_rev0.z64'));
      if (normalizedRom.bytes !== expectedRom.bytes
          || normalizedRom.sha256.toUpperCase() !== expectedRom.sha256.toUpperCase()) {
        throw new Error('private commands require an already-normalized canonical baserom; only the production owner performs setup');
      }
      records['baserom'] = normalizedRom;
      const pin = (name, file) => {
        if (typeof file !== 'string' || !file) throw new Error(`private input tool path is missing: ${name}`);
        const resolved = path.resolve(root, file);
        records[`tool:${name}`] = {path: resolved, ...fileIdentity(resolved)};
      };
      const local = read('config/local-tools.json'), policy = read('config/source-policy.json');
      pin('compiler', local.compiler);
      pin('preprocessor', policy.preprocessor.path);
      pin('compiler-manifest', policy.matchingCompiler.manifest);
      for (const tool of policy.preprocessor.requiredExecutables) pin(`preprocessor-${tool.role}`, tool.path);
      const toolchain = read('config/toolchain.json');
      for (const [name, relative] of Object.entries(toolchain.tools)) pin(name, path.join(toolchain.localRoot, relative));
    }
    return records;
  };
  const before = capture();
  return { assertUnchanged() {
    const after = capture();
    for (const file of new Set([...Object.keys(before), ...Object.keys(after)])) {
      if (JSON.stringify(before[file]) !== JSON.stringify(after[file])) {
        throw new Error(`private command shared input changed: ${file}`);
      }
    }
  } };
}

function assertPrivateClassification(classification, root = ROOT) {
  if (!classification || !['PURE_C', 'HYBRID_C'].includes(classification.class)
      || !Array.isArray(classification.dependencies)) throw new Error('private candidate classification is unavailable');
  for (const dependency of classification.dependencies) {
    // V1 deliberately supports repository headers, not source-local include copies.
    if (typeof dependency.path !== 'string' || !dependency.path.startsWith('include/')
        || dependency.path.includes('\\') || dependency.path.split('/').includes('..')) {
      throw new Error(`private candidates require approved include/ headers: ${dependency.path}`);
    }
    regular(path.join(root, dependency.path));
  }
}

function equalExpandedInputs(authored, snapshot, policy) {
  const comparable = value => ({class: value.class, sourceSha256: value.sourceSha256,
    compilationInput: value.compilationInput, dependencies: value.dependencies,
    preprocessor: value.preprocessor});
  if (JSON.stringify(comparable(authored)) !== JSON.stringify(comparable(snapshot))
      || !policy.compilationInputBytes(authored).equals(policy.compilationInputBytes(snapshot))) {
    throw new Error('private authored/snapshot preprocessing differs; source-local or location-sensitive input is unsupported');
  }
}

module.exports = { capturePrivateInputs, assertPrivateClassification, equalExpandedInputs, regular, fileIdentity };
