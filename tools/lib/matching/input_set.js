'use strict';

// Explicit data reader for one private invocation. ROOT and all output paths stay
// in the real checkout; this module does not intercept filesystem operations.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const execution = require('../execution_paths');
const { ROOT } = execution;
const contexts = new WeakMap();
const RESEARCH_VALUE = Symbol("research-only-value");
const researchContexts = new WeakSet();
const diagnosticContexts = new WeakSet();
const DIAGNOSTIC = Symbol("candidate-diagnostic");
const LIVE_DIAGNOSTIC = Symbol("live-candidate-diagnostic");
function isDiagnostic(inputs) { return diagnosticContexts.has(inputs); }
function openDiagnosticInputs(manifestFile, options = {}) {
  return openInputSetInternal(manifestFile || null, options, manifestFile ? DIAGNOSTIC : LIVE_DIAGNOSTIC);
}
const RESEARCH = Symbol("research-read-scope");
const LIVE_RESEARCH = Symbol("live-research-read-scope");
const liveResearchContexts = new WeakSet();
function isLiveResearch(inputs) { return liveResearchContexts.has(inputs); }
function isResearch(inputs) { return researchContexts.has(inputs); }
function assertProduction(inputs) { if (isResearch(inputs)) fail("research-only input context cannot certify compilation or acceptance"); }
const digest = bytes => crypto.createHash('sha256').update(bytes).digest('hex').toUpperCase();
const fail = message => { const error = new Error(`selected inputs: ${message}`); error.code = 'OB64_SELECTED_INPUT'; throw error; };
const key = file => path.resolve(file).toLowerCase();
const keys = (value, allowed) => value && typeof value === 'object' && !Array.isArray(value) && Object.keys(value).every(name => allowed.includes(name));
function freeze(value) { if (value && typeof value === 'object') { for (const child of Object.values(value)) freeze(child); Object.freeze(value); } return value; }

function regular(file, directory = false, ancestors) {
  const absolute = path.resolve(file);
  for (let current = absolute; ; current = path.dirname(current)) {
    if (ancestors && current !== absolute && ancestors.has(key(current))) break;
    let stat;
    try { stat = fs.lstatSync(current); } catch (_) { fail(`missing path ${current}`); }
    if (stat.isSymbolicLink()) fail(`redirected path ${current}`);
    if (current === absolute && (directory ? !stat.isDirectory() : !stat.isFile() || stat.nlink !== 1)) fail(`nonregular or multiply linked path ${current}`);
    if (ancestors && stat.isDirectory()) ancestors.add(key(current));
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
    if (context(value) && context(value) !== inputs) fail('input context replacement');
    if (context(value.model) && context(value.model) !== inputs) fail('mixed model input context');
    contexts.set(value, inputs);
    if (isResearch(inputs) && Object.isExtensible(value) && !Object.hasOwn(value, RESEARCH_VALUE)) Object.defineProperty(value, RESEARCH_VALUE, {value: inputs, enumerable: true});
  }
  return value;
}
function context(value) { return value && (contexts.get(value) || (isResearch(value[RESEARCH_VALUE]) ? value[RESEARCH_VALUE] : undefined)); }
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

function authenticateResearchRuntime(inputs) {
  if (!isResearch(inputs)) fail('research runtime requires research context');
  const python = authenticateRuntime(inputs);
  const conventional = require("../phase7_conventional");
  if (JSON.stringify(conventional.readJson(conventional.CONFIG_PATH, inputs).rom) !== JSON.stringify(conventional.readJson(conventional.CONFIG_PATH).rom)) fail("research canonical ROM contract differs from trusted shared contract");
  // Installed shared code is execution authority. A selected manifest may bind
  // that code, but may not redirect it to copied or alternative implementation.
  const library = execution.codePath('tools/lib');
  inputs.directoryClosure(library);
  const visit = directory => { for (const name of fs.readdirSync(directory)) {
    const file = path.join(directory,name);
    if (fs.lstatSync(file).isDirectory()) visit(file); else inputs.sharedImplementation(file);
  } };
  visit(library);
  for (const file of ['tools/match.js', 'tools/matching_workbench/private_guard.py', 'tools/matching_workbench/store.py', 'tools/matching_workbench/schema.sql']) inputs.sharedImplementation(execution.codePath(file));
  return python;
}

function openInputSet(manifestFile, options = {}) { return openInputSetInternal(manifestFile, options); }
function openResearchInputSet(manifestFile, options = {}) { return openInputSetInternal(manifestFile, options, RESEARCH); }
function openLiveResearchInputs(options = {}) { return openInputSetInternal(null, options, LIVE_RESEARCH); }
function openInputSetInternal(manifestFile, options = {}, scope) {
  const diagnostic = scope === DIAGNOSTIC || scope === LIVE_DIAGNOSTIC;
  const live = scope === LIVE_RESEARCH || scope === LIVE_DIAGNOSTIC;
  const research = scope === RESEARCH || live || diagnostic;
  const invocationEnvironment = JSON.stringify(Object.entries(process.env).sort(([a],[b]) => a.localeCompare(b)));
  const counters = { fileReads: 0, fileBytes: 0, closingReads: 0, directoryMembershipReads: 0 };
  const validatedFiles = new Set();
  const consumedFiles = new Set(), consumedDirectories = new Set(), retainedBytes = new Map();
  const privateFiles = new Map(), privateDirectories = new Map();
  const checkPrivateDirectory = directory => {
    regular(directory, true);
    const members = fs.readdirSync(directory).sort();
    if (privateDirectories.has(directory) && JSON.stringify(privateDirectories.get(directory)) !== JSON.stringify(members)) fail("private include directory membership drift: " + directory);
    privateDirectories.set(directory, members);
    return members;
  };
  let retainedSize = 0;
  const retain = (entry, bytes) => {
    if (retainedBytes.has(entry)) return;
    if (retainedSize + bytes.length > 512 * 1024 * 1024) fail("research retained-byte budget exceeded");
    retainedSize += bytes.length; retainedBytes.set(entry, bytes);
  };
  const root = path.resolve(options.root || ROOT);
  const manifestPath = live ? null : regular(manifestFile);
  const directory = live ? root : path.dirname(manifestPath);
  const privateRoot = options.privateRoot && path.resolve(options.privateRoot);
  if (!live && privateRoot && (key(directory) === key(privateRoot) || key(directory).startsWith(key(privateRoot)+path.sep)
      || key(privateRoot).startsWith(key(directory)+path.sep))) fail('private output root overlaps selected data');
  const isPrivate = file => privateRoot && key(file).startsWith(key(privateRoot) + path.sep);
  const manifestBytes = live ? null : fs.readFileSync(manifestPath);
  let manifest;
  try { manifest = live ? { schemaVersion: 1, kind: "ob64-live-research", repository: root, accepted: { fingerprint: null }, runtime: require("../local_tools").resolveLocalTools({readOnly:true}), files: [], directories: [] } : JSON.parse(manifestBytes); } catch (_) { fail("malformed manifest or live runtime configuration"); }
  if (!live && (!keys(manifest,['schemaVersion','kind','repository','accepted','runtime','files','directories','unavailableResearchReferences','bundle'])
      || ![1,2].includes(manifest.schemaVersion) || manifest.schemaVersion===1 && manifest.bundle!==undefined || manifest.kind !== 'ob64-private-inputs'
      || manifest.repository !== root || !Array.isArray(manifest.files) || !Array.isArray(manifest.directories)
      || !manifest.accepted || !/^[A-F0-9]{64}$/.test(manifest.accepted.fingerprint || ''))) fail('manifest schema/repository identity');
  let selectedBundle=null;
  if (!live && manifest.schemaVersion===2) {
    if (!execution.bundled) fail('v2 selected inputs require bundled execution');
    selectedBundle=require('./tool_bundle').validateDataOnly(manifest,manifest.bundle.version);
    if(selectedBundle.id!==execution.bundle().id)fail('selected tool version differs from executing bundle');
  } else if(execution.bundled) fail('bundle execution requires explicit v2 inputs');
  const bundledEntries=selectedBundle?require('./tool_bundle').entries(selectedBundle):{files:[],directories:[]};
  const files = new Map(), directories = new Map(), physical = new Map();
  for (const record of [...manifest.files,...bundledEntries.files]) {
    if (!keys(record,['logical','storage','path','bytes','sha256']) || !['copy', 'reference'].includes(record.storage) || !Number.isSafeInteger(record.bytes) || record.bytes < 0
        || !/^[A-F0-9]{64}$/.test(record.sha256 || '')) fail('malformed file identity');
    const logical = record.logical ? path.resolve(root, logicalPath(record.logical)) : null;
    if (record.storage === 'copy' && Object.hasOwn(record,'path') || record.storage === 'reference' && !path.isAbsolute(record.path || '')) fail('file storage binding malformed');
    if (!logical && (record.storage !== 'reference' || !path.isAbsolute(record.path || ''))) fail('invalid external reference');
    const original = logical || path.resolve(record.path);
    const stored = record.storage === 'copy' ? path.join(directory, 'data', logicalPath(record.logical)) : path.resolve(record.path || logical);
    if (record.storage === 'reference' && logical && key(stored) !== key(logical) && !bundledEntries.files.includes(record)) fail('reference logical/physical mismatch');
    if (files.has(key(original)) || physical.has(key(stored))) fail('duplicate file or physical alias');
    const entry = { ...record, original, stored };
    files.set(key(original), entry); physical.set(key(stored), entry);
  }
  for (const record of [...manifest.directories,...bundledEntries.directories]) {
    if (!keys(record,['logical','storage','path','members'])) fail('malformed directory entry');
    const logical = record.logical && logicalPath(record.logical);
    if (record.storage === 'copy' && Object.hasOwn(record,'path') || record.storage === 'reference' && !path.isAbsolute(record.path || '')) fail('directory storage binding malformed');
    if (!['copy', 'reference'].includes(record.storage) || (!logical && (record.storage !== 'reference' || !path.isAbsolute(record.path || '')))) fail('malformed directory storage');
    if (!Array.isArray(record.members) || record.members.some(name => typeof name !== 'string' || !name || /[\\/:]/.test(name) || name === '.' || name === '..')
        || new Set(record.members.map(name => name.toLowerCase())).size !== record.members.length) fail('malformed directory membership');
    const original = logical ? path.resolve(root, logical) : path.resolve(record.path);
    const stored = record.storage === 'copy' ? path.join(directory, 'data', logical) : path.resolve(record.path || original);
    if (record.storage === 'reference' && key(stored) !== key(original) && !bundledEntries.directories.includes(record)) fail('directory reference alias');
    if (directories.has(key(original)) || files.has(key(original)) || physical.has(key(stored))) fail('duplicate directory/file identity');
    directories.set(key(original), { ...record, original, stored });
  }
  function liveFile(file) {
    const original = path.resolve(root, file), k = key(original);
    if (!files.has(k)) {
      const relative = path.relative(root, original).replace(/\\/g, '/');
      const entry = { logical: relative && !relative.startsWith('..') && !path.isAbsolute(relative) ? relative : null,
        storage: 'reference', path: original, original, stored: original, bytes: null, sha256: null };
      files.set(k, entry); physical.set(k, entry);
    }
    return files.get(k);
  }
  function liveDirectory(file) {
    const original = path.resolve(root, file), k = key(original);
    if (directories.has(k)) return directories.get(k);
    regular(original, true);
    const members = fs.readdirSync(original).sort();
    const entry = { logical: path.relative(root, original).replace(/\\/g, '/'), storage: 'reference', path: original, original, stored: original, members };
    directories.set(k, entry);
    return entry;
  }
  function acceptIdentity(entry, bytes) {
    const sha256 = digest(bytes);
    if (live && entry.sha256 === null) { entry.bytes = bytes.length; entry.sha256 = sha256; }
    if (bytes.length !== entry.bytes || sha256 !== entry.sha256) fail('content drift ' + (entry.logical || entry.original));
  }
  const checkFile = (entry, ancestors) => {
    if (diagnostic && validatedFiles.has(entry)) return entry.stored;
    consumedFiles.add(entry);
    regular(entry.stored, false, ancestors);
    const bytes = fs.readFileSync(entry.stored), actual = { bytes: bytes.length, sha256: digest(bytes) };
    if (live && entry.sha256 === null) { entry.bytes = actual.bytes; entry.sha256 = actual.sha256; }
    if (actual.bytes !== entry.bytes || actual.sha256 !== entry.sha256) fail(`content drift ${entry.logical || entry.original}`);
    if (diagnostic) { validatedFiles.add(entry); counters.fileReads++; counters.fileBytes += bytes.length; }
    return entry.stored;
  };
  const checkDirectory = entry => {
    consumedDirectories.add(entry);
    regular(entry.stored, true);
    if (diagnostic) return entry.stored;
    counters.directoryMembershipReads++;
    const members = fs.readdirSync(entry.stored).sort();
    if (JSON.stringify(members) !== JSON.stringify([...entry.members].sort())) fail(`directory membership drift ${entry.logical}`);
    for (const name of members) {
      const child = key(path.join(entry.original, name));
      let record=files.get(child)||directories.get(child);
      if (live && !record) {
        const original = path.join(entry.original,name);
        record = fs.lstatSync(original).isDirectory() ? liveDirectory(original) : liveFile(original);
      }
      if (!record || key(record.stored)!==key(path.join(entry.stored,name))) fail(`unenrolled or redirected directory member ${entry.logical}/${name}`);
    }
    return entry.stored;
  };
  async function concurrent(items, action) {
    let next = 0;
    // A failure does not leave unobserved filesystem work running after close.
    const outcomes = await Promise.allSettled(Array.from({length: Math.min(16, items.length)}, async () => {
      while (next < items.length) await action(items[next++]);
    }));
    const failed = outcomes.find(result => result.status === 'rejected');
    if (failed) throw failed.reason;
  }
  async function checkedBytes(entry, ancestry) {
    const file = path.resolve(entry.stored);
    async function directory(current) {
      const k = key(current);
      if (!ancestry.has(k)) ancestry.set(k, (async () => {
        const stat = await fs.promises.lstat(current);
        if (stat.isSymbolicLink() || !stat.isDirectory()) fail('redirected/non-directory ancestor ' + current);
        if (path.dirname(current) !== current) await directory(path.dirname(current));
        if (key(await fs.promises.realpath(current)) !== key(current)) fail('aliased directory ' + current);
        return diagnostic ? null : new Set((await fs.promises.readdir(current)).map(name => name.toLowerCase()));
      })());
      return ancestry.get(k);
    }
    try {
      const members = await directory(path.dirname(file));
      if (members && !members.has(path.basename(file).toLowerCase())) fail('aliased or missing file name ' + file);
      const stat = await fs.promises.lstat(file);
      if (!stat.isFile() || stat.isSymbolicLink() || stat.nlink !== 1) fail('nonregular or multiply linked path ' + file);
      if (diagnostic && key(await fs.promises.realpath(file)) !== key(file)) fail("aliased input " + file);
      const bytes = await fs.promises.readFile(file);
      acceptIdentity(entry, bytes);
      return bytes;
    } catch (error) { error.code = 'OB64_SELECTED_INPUT'; throw error; }
  }
  const inputs = {
    id: live ? null : digest(Buffer.from(JSON.stringify({ manifestSha256: digest(manifestBytes), path: manifestPath }))),
    manifestPath, manifest, root,
    consumedPaths() { if(!diagnostic) fail('diagnostic consumed paths required'); return [...consumedFiles].map(entry=>entry.stored); },
    capturePrivateArtifact(file) {
      if(!diagnostic || !isPrivate(file)) fail('diagnostic artifact escapes private root');
      const absolute=regular(file), actual=identity(absolute);
      const entry={original:absolute,stored:absolute,...actual};consumedFiles.add(entry);
    },
    installedContract(file) {
      const absolute=path.resolve(root,file);
      if(!diagnostic || !['config/phase7/conventional-build.json','config/source-policy.json'].some(relative=>key(path.join(root,relative))===key(absolute)))fail('unsupported installed contract');
      const bytes=fs.readFileSync(regular(absolute));
      const entry={original:absolute,stored:absolute,...identity(absolute)};
      if(digest(bytes)!==entry.sha256)fail('installed contract changed during read');
      consumedFiles.add(entry);return bytes;
    },
    sharedImplementation(file) {
      if(selectedBundle) {
        const absolute=path.resolve(root,file);
        const logical=absolute.startsWith(execution.CODE_ROOT+path.sep)?execution.logicalCode(absolute):path.relative(ROOT,absolute).replace(/\\/g,'/');
        return execution.bundle().verify(execution.codePath(logical));
      }
      const absolute = path.resolve(root,file), entry = files.get(key(absolute)) || (live ? liveFile(absolute) : null);
      if (!entry || entry.storage !== "reference" || key(entry.stored) !== key(absolute)) fail("required shared implementation is not enrolled: " + absolute);
      return inputs.resolve(absolute);
    },
    readResearch(file) {
      if (inputs.has(file) || isPrivate(file)) return inputs.read(file);
      const error = new Error(`selected research reference unavailable: ${file}`); error.code = "OB64_SELECTED_RESEARCH_UNAVAILABLE"; throw error;
    },
    read(file) {
      if (!research) return fs.readFileSync(inputs.resolve(file));
      const absolute = path.resolve(root, file);
      let entry = files.get(key(absolute)) || physical.get(key(absolute)) || privateFiles.get(key(absolute)) || (live ? liveFile(absolute) : null);
      if (!entry && isPrivate(absolute)) {
        const actual = identity(absolute);
        entry = { original: absolute, stored: absolute, ...actual }; privateFiles.set(key(absolute), entry);
      }
      if (!entry) fail(`unenrolled content input ${absolute}`);
      if (!retainedBytes.has(entry)) {
        regular(entry.stored);
        const bytes = fs.readFileSync(entry.stored);
        if (diagnostic) { counters.fileReads++; counters.fileBytes += bytes.length; }
        acceptIdentity(entry, bytes);
        consumedFiles.add(entry); retain(entry, bytes);
      }
      return Buffer.from(retainedBytes.get(entry));
    },
    async prefetch(filesToRead) {
      if (!research || !Array.isArray(filesToRead)) fail('research prefetch context');
      const entries = [...new Set(filesToRead.map(file => {
        const absolute = path.resolve(root, file), entry = files.get(key(absolute)) || physical.get(key(absolute)) || (live ? liveFile(absolute) : null);
        if (!entry) fail('unenrolled prefetch input ' + absolute);
        return entry;
      }))];
      const ancestors = new Map();
      await concurrent(entries, async entry => {
        if (retainedBytes.has(entry)) return;
        const bytes = await checkedBytes(entry, ancestors);
        consumedFiles.add(entry); retain(entry, bytes);
      });
    },
    async closeResearch() {
      execution.bundle()?.close();
      if (!research) fail('research close requires research input context');
      if (diagnostic && JSON.stringify(Object.entries(process.env).sort(([a],[b]) => a.localeCompare(b))) !== invocationEnvironment) fail("invocation environment drift");
      counters.closingReads += consumedFiles.size;
      if (!live && !fs.readFileSync(regular(manifestPath)).equals(manifestBytes)) fail('manifest changed');
      for (const entry of consumedDirectories) checkDirectory(entry);
      for (const directory of privateDirectories.keys()) checkPrivateDirectory(directory);
      const ancestors = new Map();
      await concurrent([...consumedFiles], entry => checkedBytes(entry, ancestors));
      if (!live && !fs.readFileSync(regular(manifestPath)).equals(manifestBytes)) fail('manifest changed');
    },
    directoryClosure(file) {
      if (diagnostic) return inputs.resolve(file);
      if (!research) return inputs.resolve(file);
      const requested = path.resolve(root,file), physicalDirectory = [...directories.values()].find(entry => key(entry.stored) === key(requested));
      const resolved = physicalDirectory ? physicalDirectory.original : requested;
      if (!live && (isPrivate(resolved) || privateRoot && key(resolved) === key(privateRoot))) {
        const visit = directory => { for (const name of checkPrivateDirectory(directory)) { const child = path.join(directory,name), stat = fs.lstatSync(child); if (stat.isSymbolicLink() || stat.isFile() && stat.nlink !== 1) fail("redirected private include input: " + child); if (stat.isDirectory()) visit(child); } };
        visit(resolved); return resolved;
      }
      const absolute = key(resolved), prefix = absolute + path.sep;
      if (live) {
        const visit = current => { const entry = liveDirectory(current); checkDirectory(entry); for (const name of entry.members) { const child = path.join(current,name); if (fs.lstatSync(child).isDirectory()) visit(child); } };
        visit(path.resolve(root,file));
      }
      const selected = [...directories.values()].filter(entry => key(entry.original) === absolute || key(entry.original).startsWith(prefix));
      if (!selected.some(entry => key(entry.original) === absolute)) fail('unenrolled include directory ' + file);
      for (const entry of selected) checkDirectory(entry);
      return inputs.resolve(file);
    },
    declared(file) {
      if (!research) fail("declared identity is only research metadata");
      const entry = files.get(key(path.resolve(root, file))) || (live ? liveFile(file) : null);
      if (!entry) fail(`unenrolled declared input ${file}`);
      return Object.freeze({ bytes: entry.bytes, sha256: entry.sha256, status: "declared-not-read" });
    },
    provenance() { return diagnostic ? { scope: "candidate-consumed-inputs-v1", bundleId:execution.bundle()?.id||null, consumedInputIdentity: digest(Buffer.from(JSON.stringify([...consumedFiles].map(entry=>({path:entry.logical||entry.stored,bytes:entry.bytes,sha256:entry.sha256})).sort((a,b)=>a.path.localeCompare(b.path))))), acceptedFingerprintRole: "historical-selection", fullSelectedClosureCertified: false, currentAcceptanceCertified: false, consumedFiles: consumedFiles.size, consumedDirectories: consumedDirectories.size, counters: { ...counters } } : research ? { scope: live ? "live-research-consumed-inputs-v1" : "research-consumed-inputs-v1", acceptedFingerprintRole: live ? "not-selected" : "historical-selection", fullSelectedClosureCertified: false, currentAcceptanceCertified: false, consumedFiles: consumedFiles.size, consumedDirectories: consumedDirectories.size + privateDirectories.size } : { scope: "full-selected-inputs" }; },
    research(file) {
      if (inputs.has(file)) return inputs.resolve(file);
      if (isPrivate(file)) {
        if (research && fs.lstatSync(file).isDirectory()) { inputs.directoryClosure(file); return regular(file, true); }
        if (research) inputs.read(file); return regular(file);
      }
      const error = new Error(`selected research reference unavailable: ${file}`); error.code = 'OB64_SELECTED_RESEARCH_UNAVAILABLE'; throw error;
    },
    source(file) { return files.has(key(file)) || physical.has(key(file)) ? inputs.resolve(file) : isPrivate(file) ? regular(file) : inputs.resolve(file); },
    resolve(file) {
      const absolute = path.resolve(root, file);
      if (live && !files.has(key(absolute)) && !directories.has(key(absolute))) {
        if (fs.lstatSync(absolute).isDirectory()) liveDirectory(absolute); else liveFile(absolute);
      }
      const entry = files.get(key(absolute)) || physical.get(key(absolute));
      if (entry) return checkFile(entry);
      const directoryEntry = directories.get(key(absolute)) || [...directories.values()].find(item => key(item.stored) === key(absolute));
      if (directoryEntry) return checkDirectory(directoryEntry);
      fail(`unenrolled input ${absolute}`);
    },
    logical(file) {
      const entry = physical.get(key(file)) || (live ? liveFile(file) : null);
      if (!entry) {
        if (isPrivate(file)) { regular(file); return path.relative(root, file).replace(/\\/g, '/'); }
        fail(`unrepresented physical dependency ${file}`);
      }
      checkFile(entry);
      return entry.logical || entry.original;
    },
    logicalDirectory(file) {
      const entry = [...directories.values()].find(item => key(item.stored) === key(file)) || (live ? liveDirectory(file) : null);
      if (entry) { checkDirectory(entry); return entry.logical; }
      if (isPrivate(file) || privateRoot && key(file) === key(privateRoot)) { regular(file, true); return path.relative(root, file).replace(/\\/g, '/'); }
      fail(`unrepresented include directory ${file}`);
    },
    has(file) { return live ? fs.existsSync(path.resolve(root,file)) : files.has(key(path.resolve(root, file))) || directories.has(key(path.resolve(root, file))); },
    authenticate(phase8) {
      assertProduction(inputs);
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
      execution.bundle()?.close();
      if (!live && !fs.readFileSync(regular(manifestPath)).equals(manifestBytes)) fail('manifest changed');
      for (const entry of research ? consumedDirectories : directories.values()) checkDirectory(entry);
      const ancestors = research ? new Set() : undefined;
      for (const entry of research ? consumedFiles : files.values()) checkFile(entry, ancestors);
    },
  };
  if (live) liveResearchContexts.add(inputs);
  if (diagnostic) diagnosticContexts.add(inputs);
  else if (research) researchContexts.add(inputs);
  else inputs.assertUnchanged();
  freeze(manifest);
  return Object.freeze(inputs);
}

// Production-owner operation. This only copies data and authenticates a CURRENT
// already accepted by the installed implementation; it never builds or repairs it.
function captureInputSet(output, options = {}) {
  execution.assertCanonical();
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
  let manifest = { schemaVersion: 1, kind: 'ob64-private-inputs', repository: ROOT, runtime: prepared.localTools,
    accepted: { fingerprint: state.fingerprint, baselineFingerprint: state.baselineFingerprint, buildReport: state.buildReport,
      verificationSha256: state.verificationSha256, freshCompilationSha256: state.freshCompilationSha256, output: state.output },
    files: [...files.values()], directories: [...directories.values()], unavailableResearchReferences: [...new Set(unavailableResearchReferences)].sort() };
  if(options.toolBundle) manifest=require('./tool_bundle').bindManifest(manifest,options.toolBundle,destination);
  const manifestPath = path.join(destination, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n', { flag: 'wx' });
  const inputs = options.toolBundle ? (require('./tool_bundle').validateDataOnly(manifest,options.toolBundle),{id:digest(Buffer.from(JSON.stringify({manifestSha256:digest(fs.readFileSync(manifestPath)),path:manifestPath})))}) : openInputSet(manifestPath);
  return { manifest: manifestPath, id: inputs.id, acceptedFingerprint: state.fingerprint,
    copiedBytes: manifest.files.filter(file => file.storage === 'copy').reduce((n, file) => n + file.bytes, 0),
    referencedBytes: manifest.files.filter(file => file.storage === 'reference').reduce((n, file) => n + file.bytes, 0) };
}

function researchRead(inputs, file) { return isResearch(inputs) ? inputs.readResearch(file) : fs.readFileSync(inputs ? inputs.research(file) : file); }
function read(inputs, file) { return isResearch(inputs) ? inputs.read(file) : fs.readFileSync(resolve(inputs, file)); }

module.exports = { isDiagnostic, openDiagnosticInputs, openLiveResearchInputs, isLiveResearch, researchRead, authenticateResearchRuntime, isResearch, assertProduction, openResearchInputSet, read, bind, context, assertContext, authenticateRuntime, resolve, rethrow, openInputSet, captureInputSet, identity, regular, logicalPath, digest };
