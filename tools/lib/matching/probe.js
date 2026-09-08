'use strict';

const childProcess = require('child_process');
const fs = require('fs');
const path = require('path');
const { ROOT, sha256File } = require('../phase7_conventional');
const { verifyCompiler } = require('../phase8_matching_c');
const { prepareContext, writeJson } = require('../current_workflow');
const { canonicalJson, digest, assertScratchCapability } = require('./target_model');
const { MATCHING_ROOT } = require('./compiler');
const { classifySource, compilationInputBytes, verifyClassificationInputs, resolvePreprocessor, preprocessorIdentity } = require('../source_policy');

const PASSES = Object.freeze([
  ['rtl', '-dr', '.rtl'], ['jump', '-dj', '.jump'], ['cse', '-ds', '.cse'],
  ['loop', '-dL', '.loop'], ['cse2', '-dt', '.cse2'], ['flow', '-df', '.flow'],
  ['combine', '-dc', '.combine'], ['schedule1', '-dS', '.sched'],
  ['local-allocation', '-dl', '.lreg'], ['global-allocation', '-dg', '.greg'],
  ['schedule2', '-dR', '.sched2'], ['late-jump', '-dJ', '.jump2'], ['delay-slots', '-dd', '.dbr'],
]);
const SCHEMA = 3;
const IMPLEMENTATIONS = [__filename, path.join(ROOT, 'tools/match.js'),
  path.join(ROOT, 'tools/lib/source_policy.js'), path.join(ROOT, 'tools/lib/matching/target_model.js')];
const portable = file => path.relative(ROOT, file).replace(/\\/g, '/');
const same = (a, b) => canonicalJson(a) === canonicalJson(b);

function plainPath(file, directory = false) {
  const resolved = path.resolve(file);
  for (let current = resolved; ; current = path.dirname(current)) {
    if (fs.existsSync(current) && fs.lstatSync(current).isSymbolicLink()) throw new Error(`probe path is a symlink: ${current}`);
    if (path.dirname(current) === current) break;
  }
  if (!fs.existsSync(resolved) || !(directory ? fs.statSync(resolved).isDirectory() : fs.statSync(resolved).isFile())) {
    throw new Error(`probe ${directory ? 'directory' : 'file'} is missing or not regular: ${resolved}`);
  }
  return resolved;
}

function ensureDirectory(directory) {
  let existing = path.resolve(directory);
  while (!fs.existsSync(existing)) existing = path.dirname(existing);
  plainPath(existing, true);
  fs.mkdirSync(directory, { recursive: true });
  return plainPath(directory, true);
}

function repositoryPath(file, directory = false) {
  const resolved = plainPath(file, directory), relative = path.relative(ROOT, resolved);
  if (!relative || relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) throw new Error('probe source provenance must be inside the repository');
  return resolved;
}

function artifact(directory, name) {
  if (typeof name !== 'string' || path.basename(name) !== name || name.includes('\\') || name === '.' || name === '..') throw new Error('probe artifact name is malformed');
  const file = plainPath(path.join(directory, name)), bytes = fs.statSync(file).size;
  if (!bytes) throw new Error(`probe artifact is empty: ${name}`);
  return { name, bytes, sha256: sha256File(file) };
}

function writeExact(file, bytes) {
  if (fs.existsSync(file)) {
    plainPath(file);
    if (!fs.readFileSync(file).equals(bytes)) throw new Error(`probe input identity conflict: ${file}`);
  } else fs.writeFileSync(file, bytes, { flag: 'wx' });
}

function selectedPasses(names) {
  if (names != null && (!Array.isArray(names) || names.some(name => typeof name !== 'string'))) throw new Error('compiler probe passes are malformed');
  const selected = names?.length ? names : PASSES.map(([name]) => name);
  if (new Set(selected).size !== selected.length) throw new Error('compiler probe passes must be unique');
  if (selected.some(name => !PASSES.some(([known]) => name === known))) throw new Error('unknown compiler probe pass');
  return PASSES.filter(([name]) => selected.includes(name)).map(([name, flag, suffix]) => ({ name, flag, suffix }));
}

function reportDigest(report) {
  const { reportSha256, ...body } = report;
  return digest(body);
}

const isHash = value => typeof value === 'string' && /^[A-F0-9]{64}$/.test(value);
const isText = value => typeof value === 'string' && value.length > 0 && !value.includes('\0');
const isSize = (value, minimum = 0) => Number.isSafeInteger(value) && value >= minimum;
function keys(value, required, optional = []) {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    && required.every(key => Object.hasOwn(value, key))
    && Object.keys(value).every(key => required.includes(key) || optional.includes(key));
}
function relativePath(value) {
  return isText(value) && !value.includes('\\') && !value.includes(':')
    && !path.posix.isAbsolute(value) && value !== '.' && value !== '..'
    && !value.startsWith('../') && path.posix.normalize(value) === value;
}
function fileIdentity(value, minimum = 0) {
  return keys(value, ['path', 'bytes', 'sha256']) && relativePath(value.path)
    && isSize(value.bytes, minimum) && isHash(value.sha256);
}
function absolutePath(value) {
  if (!isText(value)) return false;
  const flavor = /^[A-Za-z]:|^\\\\/.test(value) ? path.win32 : path.posix;
  return flavor.isAbsolute(value) && flavor.normalize(value) === value;
}
function strings(value, nonempty = false) {
  return Array.isArray(value) && (!nonempty || value.length > 0) && value.every(isText);
}
function validPreprocessor(value) {
  if (!keys(value, ['config', 'sha256', 'version', 'executables', 'flags', 'includeDirectories',
    'dependencyMode', 'dependencyRoot', 'dependencyTarget', 'matchingCompiler'])
    || !fileIdentity(value.config, 1) || !isHash(value.sha256) || !isText(value.version)
    || !Array.isArray(value.executables) || !value.executables.length
    || !strings(value.flags, true) || !Array.isArray(value.includeDirectories) || !value.includeDirectories.every(relativePath)
    || value.dependencyMode !== 'authenticated-depfile' || value.dependencyRoot !== '.'
    || !isText(value.dependencyTarget) || !/^[A-Za-z_][A-Za-z0-9_.-]*$/.test(value.dependencyTarget)
    || !keys(value.matchingCompiler, ['executableSha256', 'manifestSha256', 'preprocessingMode'])
    || !isHash(value.matchingCompiler.executableSha256) || !isHash(value.matchingCompiler.manifestSha256)
    || value.matchingCompiler.preprocessingMode !== 'authenticated-external-companion') return false;
  const roles = new Set(), paths = new Set();
  for (const executable of value.executables) {
    if (!keys(executable, ['role', 'path', 'bytes', 'sha256'], ['version'])
      || !isText(executable.role) || !relativePath(executable.path) || !isSize(executable.bytes, 1) || !isHash(executable.sha256)
      || (Object.hasOwn(executable, 'version') && !isText(executable.version))
      || roles.has(executable.role) || paths.has(executable.path.toLowerCase())) return false;
    roles.add(executable.role); paths.add(executable.path.toLowerCase());
  }
  const driver = value.executables.find(executable => executable.role === 'driver');
  return Boolean(driver && driver.sha256 === value.sha256 && driver.version === value.version);
}
function validSourcePolicy(value) {
  if (!keys(value, ['class', 'source', 'sourceBytes', 'sourceSha256', 'preprocessedSha256',
    'compilationInput', 'dependencies', 'reasons', 'preprocessor', 'digest'], ['error'])
    || !['PURE_C', 'HYBRID_C'].includes(value.class) || !relativePath(value.source) || path.posix.extname(value.source).toLowerCase() !== '.c'
    || !isSize(value.sourceBytes, 1) || !isHash(value.sourceSha256) || !isHash(value.preprocessedSha256)
    || !keys(value.compilationInput, ['bytes', 'sha256']) || !isSize(value.compilationInput.bytes, 1)
    || value.compilationInput.sha256 !== value.preprocessedSha256 || !isHash(value.digest)
    || !Array.isArray(value.dependencies) || !Array.isArray(value.reasons) || !validPreprocessor(value.preprocessor)
    || (Object.hasOwn(value, 'error') && value.error !== null)) return false;
  const paths = new Set([value.source.toLowerCase()]);
  for (const dependency of value.dependencies) {
    if (!fileIdentity(dependency) || paths.has(dependency.path.toLowerCase())) return false;
    paths.add(dependency.path.toLowerCase());
  }
  if ((value.class === 'PURE_C') !== (value.reasons.length === 0)) return false;
  for (const reason of value.reasons) {
    if (!keys(reason, ['stage', 'code', 'token', 'line', 'column']) || !['raw', 'preprocessed'].includes(reason.stage)
      || !['assembler-keyword', 'executable-injection-attribute', 'assembler-source-include', 'executable-injection-pragma'].includes(reason.code)
      || !isText(reason.token) || !isSize(reason.line, 1) || !isSize(reason.column, 1)) return false;
  }
  // The source-policy digest uses this ordered JSON projection (not canonicalJson).
  // Validate the retained contract without rereading historical source dependencies.
  return value.digest === digest(JSON.stringify({ class: value.class, source: value.source,
    sourceBytes: value.sourceBytes, sourceSha256: value.sourceSha256, preprocessedSha256: value.preprocessedSha256,
    compilationInput: value.compilationInput, dependencies: value.dependencies, reasons: value.reasons,
    error: null, preprocessorIdentity: value.preprocessor }));
}
function validIdentity(id) {
  if (!keys(id, ['schemaVersion', 'targetId', 'symbol', 'sourceOrigin', 'sourcePolicy', 'runtimePreprocessor', 'compiler', 'flags', 'passes', 'implementation'])
    || id.schemaVersion !== SCHEMA || !isHash(id.targetId) || !isText(id.symbol) || !/^[A-Za-z_][A-Za-z0-9_]*$/.test(id.symbol)
    || (id.sourceOrigin !== null && !relativePath(id.sourceOrigin)) || !strings(id.flags, true)
    || !strings(id.passes, true) || !validSourcePolicy(id.sourcePolicy) || !validPreprocessor(id.runtimePreprocessor)
    || !keys(id.compiler, ['path', 'sha256', 'acceptanceCompiler']) || !absolutePath(id.compiler.path)
    || !isHash(id.compiler.sha256) || typeof id.compiler.acceptanceCompiler !== 'boolean'
    || !Array.isArray(id.implementation) || id.implementation.length !== IMPLEMENTATIONS.length) return false;
  if (id.implementation.some((record, i) => !keys(record, ['path', 'sha256'])
    || record.path !== portable(IMPLEMENTATIONS[i]) || !isHash(record.sha256))) return false;
  const expectedPreprocessor = id.sourceOrigin !== null && id.sourceOrigin !== id.sourcePolicy.source
    ? { ...id.runtimePreprocessor, includeDirectories: [id.sourceOrigin, ...id.runtimePreprocessor.includeDirectories] }
    : id.runtimePreprocessor;
  return same(id.sourcePolicy.preprocessor, expectedPreprocessor)
    && (!id.compiler.acceptanceCompiler || id.compiler.sha256 === id.runtimePreprocessor.matchingCompiler.executableSha256);
}

// Historical comparisons authenticate retained artifacts, not today's mutable
// source/header/tool files. runProbe separately rechecks its live input closure.
function readProbe(reportFile) {
  const file = repositoryPath(reportFile), directory = repositoryPath(path.dirname(file), true);
  const report = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (!report || report.schemaVersion !== SCHEMA) throw new Error('legacy or unsupported probe report; regenerate with the current probe');
  if (report.status !== 'complete') throw new Error('probe report is incomplete or failed; preserve it and regenerate in a clean cache location');
  if (!isHash(report.reportSha256) || report.reportSha256 !== reportDigest(report)
      || !isHash(report.probeId) || !report.identity || report.probeId !== digest(report.identity)) throw new Error('probe report identity drift');
  const id = report.identity;
  if (!validIdentity(id)) throw new Error('probe report provenance is malformed');
  if (path.basename(file) !== 'probe-report.json' || path.basename(directory) !== report.probeId
      || report.source !== portable(path.join(directory, 'authored.c'))
      || report.expandedSource !== portable(path.join(directory, 'input.c'))
      || report.assembly !== portable(path.join(directory, 'output.s'))) throw new Error('probe report artifact location/key mismatch');
  if (report.error !== null || typeof report.stdout !== 'string' || typeof report.stderr !== 'string'
      || !Number.isFinite(report.durationMs) || report.durationMs < 0 || !isText(report.acceptanceBoundary)) throw new Error('probe completion metadata is malformed');
  const passes = selectedPasses(id.passes);
  if (!same(passes.map(p => p.name), id.passes) || !same(report.passes, passes)
      || !same(report.target, { symbol: id.symbol, targetId: id.targetId })
      || !same(report.compiler, id.compiler) || report.acceptanceEligible !== false
      || !same(report.commandArguments, [...id.flags, ...passes.map(p => p.flag), '-o', 'output.s', 'input.c'])) throw new Error('probe report contract mismatch');
  const names = ['authored.c', 'input.c', 'output.s', ...passes.map(p => `input.c${p.suffix}`)];
  if (!Array.isArray(report.artifacts) || !same(report.artifacts.map(a => a.name), names)) throw new Error('probe artifact census mismatch');
  for (const recorded of report.artifacts) if (!same(artifact(directory, recorded.name), recorded)) throw new Error(`probe artifact identity drift: ${recorded.name}`);
  const [authored, input] = report.artifacts;
  if (authored.sha256 !== id.sourcePolicy.sourceSha256 || authored.bytes !== id.sourcePolicy.sourceBytes
      || input.sha256 !== id.sourcePolicy.compilationInput?.sha256 || input.bytes !== id.sourcePolicy.compilationInput?.bytes
      || !same(report.dumps, report.artifacts.slice(3))) throw new Error('probe compilation-input binding mismatch');
  if (id.sourceOrigin !== id.sourcePolicy.source) {
    const sourceBytes = fs.readFileSync(path.join(directory, 'authored.c'));
    const sourceText = sourceBytes.toString('utf8');
    const snapshotKey = digest({ sourceText, sourceOrigin: id.sourceOrigin });
    if (!Buffer.from(sourceText, 'utf8').equals(sourceBytes)
        || !id.sourcePolicy.source.endsWith(`/targets/${id.symbol}/probes/inputs/${snapshotKey}/authored.c`)) throw new Error('probe source-origin snapshot binding mismatch');
  }
  if (!same(fs.readdirSync(directory).sort(), [...names, path.basename(file)].sort())) throw new Error('probe directory artifact census mismatch');
  return report;
}

function runProbe(workbench, target, sourceText, options = {}) {
  assertScratchCapability(workbench, target, options.context?.phase8?.targets);
  if (typeof sourceText !== 'string' || !sourceText.length || !/^[A-Za-z_][A-Za-z0-9_]*$/.test(target.symbol)
      || !isHash(target.targetId)) throw new Error('compiler probe source or target is malformed');
  const context = options.context || prepareContext();
  assertScratchCapability(workbench, target, context.phase8?.targets);
  if (!strings(context.phase8.config.compiler.compileFlags, true)) throw new Error('probe compiler flags are malformed');
  const passes = selectedPasses(options.passes);
  const compiler = plainPath(path.resolve(options.researchCompiler || context.localTools.compiler));
  if (!options.researchCompiler) verifyCompiler(context.phase8, compiler);
  const compilerIdentity = { path: compiler, sha256: sha256File(compiler), acceptanceCompiler: !options.researchCompiler };
  const flags = [...context.phase8.config.compiler.compileFlags];
  const bytes = Buffer.from(sourceText, 'utf8');
  const base = ensureDirectory(path.join(MATCHING_ROOT, 'targets', target.symbol, 'probes'));
  let sourceFile, sourceOrigin = null, snapshotDirectory = null;
  if (options.sourcePath) {
    sourceFile = repositoryPath(path.resolve(options.sourcePath));
    if (!fs.readFileSync(sourceFile).equals(bytes)) throw new Error('probe authored source changed before preprocessing');
    sourceOrigin = portable(sourceFile);
  } else {
    // Candidate text must not be replaced by a possibly newer origin file. A known
    // directory supplies quoted-include lookup for the immutable text snapshot.
    if (options.sourceOrigin) sourceOrigin = portable(repositoryPath(path.dirname(path.resolve(options.sourceOrigin)), true));
    snapshotDirectory = ensureDirectory(path.join(base, 'inputs', digest({ sourceText, sourceOrigin })));
    sourceFile = path.join(snapshotDirectory, 'authored.c');
    writeExact(sourceFile, bytes);
  }
  const authenticateSnapshot = () => {
    if (snapshotDirectory) {
      plainPath(snapshotDirectory, true);
      if (!same(fs.readdirSync(snapshotDirectory), ['authored.c'])) throw new Error('probe source snapshot census mismatch; quoted includes could be shadowed');
      plainPath(sourceFile);
      if (!fs.readFileSync(sourceFile).equals(bytes)) throw new Error('probe source snapshot identity drift');
    }
  };
  authenticateSnapshot();
  const preprocessor = resolvePreprocessor();
  const runtimePreprocessor = preprocessorIdentity(preprocessor);
  const effectivePreprocessor = !options.sourcePath && sourceOrigin
    ? { ...preprocessor, includeDirectories: [path.join(ROOT, sourceOrigin), ...preprocessor.includeDirectories] }
    : preprocessor;
  const classification = classifySource(sourceFile, { preprocessor: effectivePreprocessor });
  if (!['PURE_C', 'HYBRID_C'].includes(classification.class)) throw new Error(`probe source classification is ${classification.class}: ${classification.error || ''}`);
  verifyClassificationInputs(classification);
  if (classification.sourceSha256 !== digest(bytes)) throw new Error('probe authored source identity drift');
  const input = compilationInputBytes(classification);
  const identity = { schemaVersion: SCHEMA, targetId: target.targetId, symbol: target.symbol,
    sourceOrigin, sourcePolicy: JSON.parse(JSON.stringify(classification)), runtimePreprocessor, compiler: compilerIdentity,
    flags, passes: passes.map(p => p.name), implementation: IMPLEMENTATIONS.map(file => ({ path: portable(file), sha256: sha256File(file) })) };
  const authenticateLive = () => {
    authenticateSnapshot();
    verifyClassificationInputs(classification);
    if (sha256File(compiler) !== compilerIdentity.sha256 || !same(preprocessorIdentity(resolvePreprocessor()), runtimePreprocessor)
        || identity.implementation.some(record => sha256File(path.join(ROOT, record.path)) !== record.sha256)) throw new Error('probe tool/input closure changed during execution');
  };
  const probeId = digest(identity), directory = path.join(base, probeId), reportFile = path.join(directory, 'probe-report.json');
  if (fs.existsSync(reportFile)) {
    const existing = readProbe(reportFile);
    if (!same(existing.identity, identity)) throw new Error('compiler probe digest collision');
    authenticateLive();
    return { ...existing, cached: true };
  }
  if (fs.existsSync(directory)) throw new Error('incomplete probe cache directory; preserve it before retrying');
  authenticateLive();
  ensureDirectory(directory);
  fs.writeFileSync(path.join(directory, 'authored.c'), bytes, { flag: 'wx' });
  fs.writeFileSync(path.join(directory, 'input.c'), input, { flag: 'wx' });
  const args = [...flags, ...passes.map(p => p.flag), '-o', 'output.s', 'input.c'];
  const started = Date.now();
  const result = childProcess.spawnSync(compiler, args, { cwd: directory, encoding: 'utf8', windowsHide: true, maxBuffer: 64 * 1024 * 1024 });
  let failure = result.error ? String(result.error) : result.status !== 0 ? `compiler exit ${result.status}` : null;
  let artifacts = [];
  try {
    authenticateLive();
    artifacts = ['authored.c', 'input.c', 'output.s', ...passes.map(p => `input.c${p.suffix}`)].map(name => artifact(directory, name));
  } catch (error) { failure = failure || error.message; }
  const report = { schemaVersion: SCHEMA, probeId, identity, target: { symbol: target.symbol, targetId: target.targetId },
    compiler: compilerIdentity, acceptanceEligible: false,
    acceptanceBoundary: 'Compiler dumps are research only; ordinary linked-target and full-ROM gates remain required. Research compiler output cannot enter matching acceptance.',
    passes, commandArguments: args, status: failure ? 'failed' : 'complete', error: failure,
    stdout: String(result.stdout || ''), stderr: String(result.stderr || ''), durationMs: Date.now() - started,
    source: portable(path.join(directory, 'authored.c')), expandedSource: portable(path.join(directory, 'input.c')),
    assembly: portable(path.join(directory, 'output.s')), artifacts, dumps: artifacts.slice(3) };
  report.reportSha256 = reportDigest(report);
  writeJson(reportFile, report);
  if (failure) return report;
  return readProbe(reportFile);
}

function normalizedDump(text) {
  return text.replace(/\\/g, '/').replace(/[A-Za-z]:\/[^\s:)]+/g, '<path>').replace(/\r\n/g, '\n');
}

function compareProbes(leftReportFile, rightReportFile) {
  const left = readProbe(leftReportFile), right = readProbe(rightReportFile);
  const comparisons = [];
  for (const [name, , suffix] of PASSES) {
    const l = left.dumps.find(d => d.name.endsWith(suffix)), r = right.dumps.find(d => d.name.endsWith(suffix));
    if (!l && !r) continue;
    if (!l || !r) comparisons.push({ pass: name, equal: false, left: l?.name || null, right: r?.name || null, reason: 'pass not requested by one probe' });
    else comparisons.push({ pass: name,
      equal: normalizedDump(fs.readFileSync(path.join(path.dirname(path.resolve(leftReportFile)), l.name), 'utf8')) === normalizedDump(fs.readFileSync(path.join(path.dirname(path.resolve(rightReportFile)), r.name), 'utf8')),
      left: l.name, right: r.name });
  }
  const provenanceDifferences = Object.keys(left.identity).filter(key => !same(left.identity[key], right.identity[key]))
    .map(field => ({ field, left: left.identity[field], right: right.identity[field] }));
  const firstTextualDivergence = comparisons.find(item => !item.equal && !item.reason)?.pass || null;
  return { schemaVersion: SCHEMA, left: left.probeId, right: right.probeId,
    firstTextualDivergence, firstDivergentPass: firstTextualDivergence,
    interpretation: 'The compatibility alias firstDivergentPass is textual. Pseudo/UID identities are preserved; differences do not establish the cause of emitted-code changes. Missing pass coverage is separate.',
    provenanceDifferences, comparisons };
}

module.exports = { PASSES, compareProbes, runProbe, readProbe };
