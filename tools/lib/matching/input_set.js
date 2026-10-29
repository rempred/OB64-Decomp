'use strict';

// Explicit data reader for one private invocation. ROOT and all output paths stay
// in the real checkout; this module does not intercept filesystem operations.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const ROOT = path.resolve(__dirname, '../../..');
const contexts = new WeakMap();
const digest = bytes => crypto.createHash('sha256').update(bytes).digest('hex').toUpperCase();
const fail = message => { const error = new Error(`selected inputs: ${message}`); error.code = 'OB64_SELECTED_INPUT'; throw error; };
const key = file => path.resolve(file).toLowerCase();
const keys = (value, allowed) => value && typeof value === 'object' && !Array.isArray(value) && Object.keys(value).every(name => allowed.includes(name));
function freeze(value) { if (value && typeof value === 'object') { for (const child of Object.values(value)) freeze(child); Object.freeze(value); } return value; }

function regular(file, directory = false) {
  const absolute = path.resolve(file);
  for (let current = absolute; ; current = path.dirname(current)) {
    let stat;
    try { stat = fs.lstatSync(current); } catch (_) { fail(`missing path ${current}`); }
    if (stat.isSymbolicLink()) fail(`redirected path ${current}`);
    if (current === absolute && (directory ? !stat.isDirectory() : !stat.isFile() || stat.nlink !== 1)) fail(`nonregular or multiply linked path ${current}`);
    if (current === path.dirname(current)) break;
  }
  if (key(fs.realpathSync.native(absolute)) !== key(absolute)) fail(`aliased path ${absolute}`);
  return absolute;
}

function identity(file) {
  regular(file);
  const bytes = fs.readFileSync(file);
  return { bytes: bytes.length, sha256: digest(bytes) };
}

function logicalPath(value) {
  if (typeof value !== 'string' || !value || value.includes('\\') || path.isAbsolute(value)
      || value.split('/').some(part => !part || part === '.' || part === '..' || /[. ]$/.test(part)
        || /^(?:con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(part)) || value.includes(':')) fail('invalid logical path');
  return value;
}

function bind(value, inputs) {
  if (inputs && value && typeof value === 'object') {
    if (contexts.has(value) && contexts.get(value) !== inputs) fail('input context replacement');
    contexts.set(value, inputs);
  }
  return value;
}
function context(value) { return value && contexts.get(value); }
function assertContext(value, inputs) {
  if (context(value) !== inputs) fail('mixed selected input context');
}
function resolve(inputs, file) { return inputs ? inputs.resolve(file) : file; }
function rethrow(error, inputs) {
  if (inputs) error.code = 'OB64_SELECTED_INPUT';
  if (error?.code === 'OB64_SELECTED_INPUT') throw error;
}

// Runtime execution is authorized by the canonical shared runtime contract,
// never by a self-consistent manifest supplied to --inputs. Source integration
// may change layout configuration, but replacing these shared pins drains users.
function authenticateRuntime(inputs) {
  const conventional = require('../phase7_conventional');
  const local = require('../local_tools').resolveLocalTools({ inputs, readOnly: true });
  const trusted = conventional.readJson(conventional.CONFIG_PATH);
  const selected = conventional.readJson(conventional.CONFIG_PATH, inputs);
  for (const name of ['host', 'splat'])
    if (JSON.stringify(selected[name]) !== JSON.stringify(trusted[name])) fail('selected runtime contract differs: ' + name);
  inputs.resolve(process.execPath);
  const python = inputs.resolve(local.splatPython);
  conventional.verifyRuntimeExecutables(trusted, { splatPython: python });
  return python;
}

function openInputSet(manifestFile, options = {}) {
  const root = path.resolve(options.root || ROOT);
  const manifestPath = regular(manifestFile);
  const directory = path.dirname(manifestPath);
  const privateRoot = options.privateRoot && path.resolve(options.privateRoot);
  if (privateRoot && (key(directory) === key(privateRoot) || key(directory).startsWith(key(privateRoot)+path.sep)
      || key(privateRoot).startsWith(key(directory)+path.sep))) fail('private output root overlaps selected data');
  const isPrivate = file => privateRoot && key(file).startsWith(key(privateRoot) + path.sep);
  const manifestBytes = fs.readFileSync(manifestPath);
  let manifest;
  try { manifest = JSON.parse(manifestBytes); } catch (_) { fail('malformed manifest'); }
  if (!keys(manifest,['schemaVersion','kind','repository','accepted','runtime','files','directories','unavailableResearchReferences'])
      || manifest.schemaVersion !== 1 || manifest.kind !== 'ob64-private-inputs'
      || manifest.repository !== root || !Array.isArray(manifest.files) || !Array.isArray(manifest.directories)
      || !manifest.accepted || !/^[A-F0-9]{64}$/.test(manifest.accepted.fingerprint || '')) fail('manifest schema/repository identity');
  const files = new Map(), directories = new Map(), physical = new Map();
  for (const record of manifest.files) {
    if (!keys(record,['logical','storage','path','bytes','sha256']) || !['copy', 'reference'].includes(record.storage) || !Number.isSafeInteger(record.bytes) || record.bytes < 0
        || !/^[A-F0-9]{64}$/.test(record.sha256 || '')) fail('malformed file identity');
    const logical = record.logical ? path.resolve(root, logicalPath(record.logical)) : null;
    if (record.storage === 'copy' && Object.hasOwn(record,'path') || record.storage === 'reference' && !path.isAbsolute(record.path || '')) fail('file storage binding malformed');
    if (!logical && (record.storage !== 'reference' || !path.isAbsolute(record.path || ''))) fail('invalid external reference');
    const original = logical || path.resolve(record.path);
    const stored = record.storage === 'copy' ? path.join(directory, 'data', logicalPath(record.logical)) : path.resolve(record.path || logical);
    if (record.storage === 'reference' && logical && key(stored) !== key(logical)) fail('reference logical/physical mismatch');
    if (files.has(key(original)) || physical.has(key(stored))) fail('duplicate file or physical alias');
    const entry = { ...record, original, stored };
    files.set(key(original), entry); physical.set(key(stored), entry);
  }
  for (const record of manifest.directories) {
    if (!keys(record,['logical','storage','path','members'])) fail('malformed directory entry');
    const logical = record.logical && logicalPath(record.logical);
    if (record.storage === 'copy' && Object.hasOwn(record,'path') || record.storage === 'reference' && !path.isAbsolute(record.path || '')) fail('directory storage binding malformed');
    if (!['copy', 'reference'].includes(record.storage) || (!logical && (record.storage !== 'reference' || !path.isAbsolute(record.path || '')))) fail('malformed directory storage');
    if (!Array.isArray(record.members) || record.members.some(name => typeof name !== 'string' || !name || /[\\/:]/.test(name) || name === '.' || name === '..')
        || new Set(record.members.map(name => name.toLowerCase())).size !== record.members.length) fail('malformed directory membership');
    const original = logical ? path.resolve(root, logical) : path.resolve(record.path);
    const stored = record.storage === 'copy' ? path.join(directory, 'data', logical) : path.resolve(record.path || original);
    if (record.storage === 'reference' && key(stored) !== key(original)) fail('directory reference alias');
    if (directories.has(key(original)) || files.has(key(original)) || physical.has(key(stored))) fail('duplicate directory/file identity');
    directories.set(key(original), { ...record, original, stored });
  }
  const checkFile = entry => {
    const actual = identity(entry.stored);
    if (actual.bytes !== entry.bytes || actual.sha256 !== entry.sha256) fail(`content drift ${entry.logical || entry.original}`);
    return entry.stored;
  };
  const checkDirectory = entry => {
    regular(entry.stored, true);
    const members = fs.readdirSync(entry.stored).sort();
    if (JSON.stringify(members) !== JSON.stringify([...entry.members].sort())) fail(`directory membership drift ${entry.logical}`);
    for (const name of members) {
      const child = key(path.join(entry.original, name));
      const record=files.get(child)||directories.get(child);
      if (!record || key(record.stored)!==key(path.join(entry.stored,name))) fail(`unenrolled or redirected directory member ${entry.logical}/${name}`);
    }
    return entry.stored;
  };
  const inputs = {
    id: digest(Buffer.from(JSON.stringify({ manifestSha256: digest(manifestBytes), path: manifestPath }))),
    manifestPath, manifest, root,
    research(file) {
      if (inputs.has(file)) return inputs.resolve(file);
      if (isPrivate(file)) return regular(file);
      const error = new Error(`selected research reference unavailable: ${file}`); error.code = 'OB64_SELECTED_RESEARCH_UNAVAILABLE'; throw error;
    },
    source(file) { return files.has(key(file)) || physical.has(key(file)) ? inputs.resolve(file) : isPrivate(file) ? regular(file) : inputs.resolve(file); },
    resolve(file) {
      const absolute = path.resolve(root, file), entry = files.get(key(absolute)) || physical.get(key(absolute));
      if (entry) return checkFile(entry);
      const directoryEntry = directories.get(key(absolute)) || [...directories.values()].find(item => key(item.stored) === key(absolute));
      if (directoryEntry) return checkDirectory(directoryEntry);
      fail(`unenrolled input ${absolute}`);
    },
    logical(file) {
      const entry = physical.get(key(file));
      if (!entry) {
        if (isPrivate(file)) { regular(file); return path.relative(root, file).replace(/\\/g, '/'); }
        fail(`unrepresented physical dependency ${file}`);
      }
      checkFile(entry);
      return entry.logical || entry.original;
    },
    logicalDirectory(file) {
      const entry = [...directories.values()].find(item => key(item.stored) === key(file));
      if (entry) { checkDirectory(entry); return entry.logical; }
      if (isPrivate(file) || privateRoot && key(file) === key(privateRoot)) { regular(file, true); return path.relative(root, file).replace(/\\/g, '/'); }
      fail(`unrepresented include directory ${file}`);
    },
    has(file) { return files.has(key(path.resolve(root, file))) || directories.has(key(path.resolve(root, file))); },
    authenticate(phase8) {
      if (context(phase8) !== inputs) fail('accepted model belongs to a different input set');
      const read = file => JSON.parse(fs.readFileSync(inputs.resolve(file), 'utf8'));
      const state = read('build/current/state.json'), accepted = manifest.accepted;
      if (!directories.has(key(state.output || root)) || directories.get(key(state.output)).storage !== 'reference') fail('accepted output reference census missing');
      inputs.resolve(state.output);
      if (![6, 7].includes(state.schemaVersion) || state.schemaVersion === 7 && state.status !== 'verified'
          || !state.verifiedAt || state.fingerprint !== accepted.fingerprint
          || state.baselineFingerprint !== accepted.baselineFingerprint || state.output !== accepted.output
          || JSON.stringify(state.buildReport) !== JSON.stringify(accepted.buildReport)
          || state.verificationSha256 !== accepted.verificationSha256 || state.freshCompilationSha256 !== accepted.freshCompilationSha256) fail('accepted state binding drift');
      for (const [file, sha256] of [[state.verificationReport, state.verificationSha256], [state.freshCompilationReport, state.freshCompilationSha256]]) {
        if (identity(inputs.resolve(file)).sha256 !== sha256) fail('accepted companion identity drift');
      }
      const build = read(path.join(state.output, 'build-report.json'));
      require('../current_workflow').validateVerifiedCompanions(build, read(state.freshCompilationReport), read(state.verificationReport), state.output, phase8);
      const rom = identity(inputs.resolve(path.join(state.output, 'phase8.us_rev0.z64')));
      if (rom.bytes !== phase8.model.config.rom.bytes || rom.sha256 !== phase8.model.config.rom.sha256) fail('accepted full-ROM identity drift');
    },
    assertUnchanged() {
      if (!fs.readFileSync(regular(manifestPath)).equals(manifestBytes)) fail('manifest changed');
      for (const entry of directories.values()) checkDirectory(entry);
      for (const entry of files.values()) checkFile(entry);
    },
  };
  inputs.assertUnchanged();
  freeze(manifest);
  return Object.freeze(inputs);
}

// Production-owner operation. This only copies data and authenticates a CURRENT
// already accepted by the installed implementation; it never builds or repairs it.
function captureInputSet(output) {
  const destination = path.resolve(output);
  if (!destination.startsWith(path.join(ROOT, 'build') + path.sep)) fail('capture output must be under ignored build/');
  regular(path.dirname(destination), true);
  if (fs.existsSync(destination)) fail('capture output already exists');
  const workflow = require('../current_workflow');
  const targetFiles=['config/matching-c-targets.json','config/matching-c-compilation-groups.json'];
  const targetBytes=targetFiles.map(file=>fs.readFileSync(path.join(ROOT,file)));
  const [active,groups]=targetBytes.map(bytes=>JSON.parse(bytes));
  const extraDirectories=[...new Set(active.targets.map(target=>target.source||groups.groups.find(group=>group.id===target.compilationGroup)?.source)
    .map(source=>logicalPath(path.posix.dirname(logicalPath(source)))).filter(directory=>directory!=='src'&&!directory.startsWith('src/')))];
  const seal = require('./private_inputs').capturePrivateInputs({extraDirectories});
  targetFiles.forEach((file,index)=>{if(!fs.readFileSync(path.join(ROOT,file)).equals(targetBytes[index]))fail('source membership changed before capture');});
  const prepared = workflow.prepareContext({readOnly:true});
  const current = workflow.currentVerificationState(prepared);
  if (!current.exact || !current.state?.verifiedAt) fail('capture requires currently verified exact CURRENT');
  const state = current.state;
  fs.mkdirSync(destination); // Exclusive publication directory; failures retain partial evidence.
  const files = new Map(), directories = new Map();
  const shown = file => {
    const relative = path.relative(ROOT, file);
    return relative && !relative.startsWith('..') && !path.isAbsolute(relative) ? relative.replace(/\\/g, '/') : null;
  };
  function enroll(file, storage) {
    file = path.resolve(file);
    const stat = fs.lstatSync(file), logical = shown(file);
    regular(file, stat.isDirectory());
    if (storage === 'copy' && !logical) fail('copied data must have repository identity');
    if (stat.isDirectory()) {
      if (directories.has(key(file))) return;
      const members = fs.readdirSync(file).sort();
      directories.set(key(file), { ...(logical ? { logical } : {}), storage, ...(storage === 'reference' ? { path: file } : {}), members });
      if (storage === 'copy') fs.mkdirSync(path.join(destination, 'data', logical), { recursive: true });
      for (const name of members) enroll(path.join(file, name), storage);
    } else {
      if (files.has(key(file))) {
        if (files.get(key(file)).storage !== storage) fail(`conflicting capture role ${file}`);
        return;
      }
      const before = identity(file);
      files.set(key(file), { ...(logical ? { logical } : {}), storage, ...(storage === 'reference' ? { path: file } : {}), ...before });
      if (storage === 'copy') {
        const target = path.join(destination, 'data', logical);
        fs.mkdirSync(path.dirname(target), { recursive: true });
        fs.copyFileSync(file, target, fs.constants.COPYFILE_EXCL);
        if (JSON.stringify(identity(target)) !== JSON.stringify(before)) fail(`copy drift ${file}`);
      }
    }
  }
  for (const directory of ['config', 'src', 'include', 'docs/dossiers', 'docs/matching-c', 'docs/archive/matching-c-candidates']) enroll(path.join(ROOT, directory), 'copy');
  for (const target of prepared.phase8.targets) if (!files.has(key(path.resolve(ROOT, target.source)))) enroll(path.dirname(path.resolve(ROOT, target.source)), 'copy');
  for (const file of ['build/current/state.json', 'build/current/baseline-state.json', state.verificationReport, state.freshCompilationReport]) {
    const absolute = path.resolve(ROOT, file);
    enroll(absolute, shown(absolute) ? 'copy' : 'reference');
  }
  for (const directory of ['asm/original/rev0', 'tools/lib']) enroll(path.join(ROOT, directory), 'reference');
  for (const file of ['store.py','schema.sql','private_guard.py']) enroll(path.join(ROOT,'tools/matching_workbench',file),'reference');
  for (const name of fs.readdirSync(path.join(ROOT, 'tools'))) if (/\.(js|py)$/.test(name)) enroll(path.join(ROOT, 'tools', name), 'reference');
  for (const file of Object.keys(prepared.model.config.acceptedInputSha256)) {
    const absolute = path.resolve(ROOT, file);
    if (!files.has(key(absolute))) enroll(absolute, 'reference');
  }
  const policy = require('../source_policy').loadPolicyConfig();
  const toolchain = JSON.parse(fs.readFileSync(path.join(ROOT, 'config/toolchain.json')));
  for (const file of [process.execPath, prepared.localTools.compiler, prepared.localTools.splatPython, prepared.localTools.splatSplit,
    policy.matchingCompiler.manifest, policy.preprocessor.path, ...policy.preprocessor.requiredExecutables.map(item => item.path),
    ...Object.values(toolchain.tools).map(file => path.join(toolchain.localRoot, file)),
    ...['diff.py', 'pyproject.toml', 'LICENSE'].map(file => path.join(prepared.localTools.asmDifferRoot, file)),
    'build/baserom.us_rev0.z64']) if (!files.has(key(path.resolve(ROOT, file)))) enroll(path.resolve(ROOT, file), 'reference');
  // The existing runtime manifest is an authenticated shared reference; its
  // directory members remain fixed until affected users are drained.
  enroll(prepared.localTools.powershellRuntimeRoot, 'reference');
  enroll(state.output, 'reference');
  // Lesson links are bounded prose/source inputs. Missing historical references
  // remain unavailable; selected readers must never fall back to live bytes.
  const index = JSON.parse(fs.readFileSync(path.join(ROOT, 'docs/matching-c/compiler-lessons.json')));
  const unavailableResearchReferences = [];
  const researchFile = relative => {
    const file = path.resolve(ROOT, logicalPath(relative.split('#')[0]));
    if (!files.has(key(file))) {
      if (fs.existsSync(file)) enroll(file, 'copy');
      else unavailableResearchReferences.push(relative);
    }
  };
  for (const lesson of index.lessons) for (const link of [lesson.note, ...lesson.references, ...lesson.observations.map(item => item.path)]) {
    researchFile(link);
  }
  for (const relative of new Set(index.lessons.flatMap(lesson => lesson.observations.map(item => item.path)))) {
    const file=path.resolve(ROOT,relative);
    if (!fs.existsSync(file)) continue;
    const envelope=JSON.parse(fs.readFileSync(file,'utf8'));
    researchFile(envelope.source);
    for (const reference of envelope.authored.references) researchFile(reference.path);
  }
  for (const [file, record] of files) {
    const original = record.logical ? path.resolve(ROOT, record.logical) : record.path;
    const actual = identity(original);
    if (actual.bytes !== record.bytes || actual.sha256 !== record.sha256) fail(`input changed while capturing ${file}`);
  }
  for (const record of directories.values()) {
    const original = record.logical ? path.resolve(ROOT, record.logical) : record.path;
    if (JSON.stringify(fs.readdirSync(regular(original, true)).sort()) !== JSON.stringify(record.members)) fail('directory changed while capturing');
  }
  for (const target of prepared.sourcePolicy.targets) for (const expected of [
    {path:target.source,bytes:target.sourceBytes,sha256:target.sourceSha256}, ...target.dependencies]) {
    const actual=files.get(key(path.resolve(ROOT,expected.path)));
    if (!actual || actual.bytes!==expected.bytes || actual.sha256!==expected.sha256) fail('captured source/preprocessing dependency differs from accepted preparation');
  }
  seal.assertUnchanged();
  const manifest = { schemaVersion: 1, kind: 'ob64-private-inputs', repository: ROOT, runtime: prepared.localTools,
    accepted: { fingerprint: state.fingerprint, baselineFingerprint: state.baselineFingerprint, buildReport: state.buildReport,
      verificationSha256: state.verificationSha256, freshCompilationSha256: state.freshCompilationSha256, output: state.output },
    files: [...files.values()], directories: [...directories.values()], unavailableResearchReferences: [...new Set(unavailableResearchReferences)].sort() };
  const manifestPath = path.join(destination, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n', { flag: 'wx' });
  const inputs = openInputSet(manifestPath);
  return { manifest: manifestPath, id: inputs.id, acceptedFingerprint: state.fingerprint,
    copiedBytes: manifest.files.filter(file => file.storage === 'copy').reduce((n, file) => n + file.bytes, 0),
    referencedBytes: manifest.files.filter(file => file.storage === 'reference').reduce((n, file) => n + file.bytes, 0) };
}

module.exports = { bind, context, assertContext, authenticateRuntime, resolve, rethrow, openInputSet, captureInputSet, identity, regular, logicalPath, digest };
