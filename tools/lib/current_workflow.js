'use strict';

const childProcess = require('child_process');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const {
  ROOT,
  loadAcceptedModel,
  sha256File,
} = require('./phase7_conventional');
const { loadActiveTargetModel } = require('./active_targets');
const { resolveLocalTools } = require('./local_tools');
const {
  compileTarget,
  verifyCompiler,
  verifyRuntimeTools,
} = require('./phase8_matching_c');
const {
  classifyTargetSources,
  resolvePreprocessor,
} = require('./source_policy');

const STATE_ROOT = path.join(ROOT, 'build', 'current');
const BASELINE_STATE_PATH = path.join(STATE_ROOT, 'baseline-state.json');
const CURRENT_STATE_PATH = path.join(STATE_ROOT, 'state.json');
const VERIFICATION_REPORT_PATH = path.join(STATE_ROOT, 'verification.json');
const SOURCE_POLICY_REPORT_PATH = path.join(ROOT, 'build', 'source-policy', 'report.json');

function ensureDir(directory) {
  fs.mkdirSync(directory, { recursive: true });
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function writeJson(file, value) {
  ensureDir(path.dirname(file));
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function sha256Value(value) {
  return crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex').toUpperCase();
}

function existingState(file) {
  if (!fs.existsSync(file)) return null;
  try {
    return readJson(file);
  } catch (_) {
    return null;
  }
}

function runNode(script, args, label) {
  const command = [path.join(ROOT, 'tools', script), ...args];
  const result = childProcess.spawnSync(process.execPath, command, {
    cwd: ROOT,
    encoding: 'utf8',
    windowsHide: true,
    maxBuffer: 256 * 1024 * 1024,
  });
  if (result.status !== 0 || result.error) {
    const detail = [result.stdout, result.stderr, result.error ? String(result.error) : ''].filter(Boolean).join('\n').trim();
    throw new Error(`${label} failed${detail ? `:\n${detail}` : ''}`);
  }
  return { stdout: result.stdout, stderr: result.stderr };
}

function ensureCanonicalBaserom(localTools) {
  const config = readJson(path.join(ROOT, 'config', 'phase7', 'conventional-build.json'));
  const output = path.join(ROOT, 'build', 'baserom.us_rev0.z64');
  if (fs.existsSync(output) && fs.statSync(output).size === config.rom.bytes && sha256File(output) === config.rom.sha256) {
    return { path: output, bytes: config.rom.bytes, sha256: config.rom.sha256, generated: false };
  }
  const args = [];
  if (localTools.romInput) args.push('--input', localTools.romInput);
  runNode('verify_baserom.js', args, 'baserom normalization');
  if (!fs.existsSync(output) || fs.statSync(output).size !== config.rom.bytes || sha256File(output) !== config.rom.sha256) {
    throw new Error('canonical normalized baserom was not produced with the accepted identity');
  }
  return { path: output, bytes: config.rom.bytes, sha256: config.rom.sha256, generated: true };
}

function hashFiles(relativeFiles) {
  return relativeFiles.map((relative) => {
    const file = path.join(ROOT, ...relative.split('/'));
    if (!fs.existsSync(file)) throw new Error(`workflow implementation file is missing: ${relative}`);
    return { path: relative, sha256: sha256File(file) };
  });
}

function acceptedAssemblyIdentities(model) {
  const identities = [];
  const seen = new Set();
  for (const row of model.rows) {
    if (row.inputKind !== 'tracked-assembly' || !row.part || seen.has(row.part.file)) continue;
    seen.add(row.part.file);
    const file = path.join(ROOT, ...row.part.file.split('/'));
    if (!fs.existsSync(file) || sha256File(file) !== row.part.sha256) {
      throw new Error(`accepted assembly source identity drift: ${row.part.file}`);
    }
    identities.push({ path: row.part.file, sha256: row.part.sha256 });
  }
  identities.sort((left, right) => left.path.localeCompare(right.path));
  return identities;
}

function baselineFingerprint(model, baserom) {
  return sha256Value({
    schemaVersion: 1,
    baserom: { bytes: baserom.bytes, sha256: baserom.sha256 },
    acceptedInputs: model.inputFiles,
    assemblySources: acceptedAssemblyIdentities(model),
    implementation: hashFiles([
      'config/phase7/conventional-build.json',
      'tools/run_phase7_splat.js',
      'tools/build_phase7_conventional.js',
      'tools/verify_phase7_conventional.js',
      'tools/lib/phase7_conventional.js',
    ]),
  });
}

function currentFingerprint(phase8, baseline, localTools) {
  return sha256Value({
    schemaVersion: 4,
    baseline,
    compilerSha256: sha256File(localTools.compiler),
    activeConfigSha256: sha256File(path.join(ROOT, 'config', 'matching-c-targets.json')),
    linkageConfig: phase8.linkageConfigIdentity,
    multiOwnerConfig: phase8.multiOwnerConfigIdentity,
    compatibilityBridge: {
      compiler: phase8.config.compiler,
      targets: phase8.targets.map((target) => ({
        symbol: target.symbol,
        relocationContractSource: target.relocationContractSource,
        expectedRelocations: target.expectedRelocations,
      })),
    },
    sourcePolicyConfigSha256: sha256File(path.join(ROOT, 'config', 'source-policy.json')),
    gnuBinutils26: phase8.toolchain.identity,
    targets: phase8.targets.map((target) => ({
      symbol: target.symbol,
      source: target.source,
      sourceSha256: target.sourceSha256,
      textOwners: target.textOwners.map((owner) => ({
        rowIndex: owner.rowIndex,
        chunkIndex: owner.chunkIndex,
        sectionName: owner.sectionName,
        logicalOffset: owner.logicalOffset,
        bytes: owner.bytes,
        originalAssemblySha256: owner.originalAssemblySha256,
      })),
    })),
    implementation: hashFiles([
      'tools/build_phase8_matching_c.js',
      'tools/verify_phase8_matching_c.js',
      'tools/lib/phase8_matching_c.js',
      'tools/lib/active_targets.js',
      'tools/lib/elf_text_split.js',
      'tools/lib/current_workflow.js',
      'tools/lib/source_policy.js',
      'tools/verify.js',
    ]),
  });
}

function completeBaseline(directory) {
  return ['phase7.elf', 'phase7.elf-report.json', 'phase7.map', 'phase7.us_rev0.z64', 'layout.json', 'build-report.json', 'objects/manifest.json']
    .every((relative) => fs.existsSync(path.join(directory, ...relative.split('/'))));
}

function completeCurrent(directory, phase8) {
  const required = ['phase8.elf', 'phase8.elf-report.json', 'phase8.map', 'phase8.us_rev0.z64', 'layout.json', 'build-report.json', 'objects/manifest.json'];
  if (!required.every((relative) => fs.existsSync(path.join(directory, ...relative.split('/'))))) return false;
  let report;
  try {
    report = readJson(path.join(directory, 'build-report.json'));
  } catch (_) {
    return false;
  }
  if (!phase8 || report.schemaVersion !== 3 || report.status !== 'pass'
      || !Array.isArray(report.targetReplacements) || report.targetReplacements.length !== phase8.targets.length) return false;
  for (const target of phase8.targets) {
    const record = report.targetReplacements.find((candidate) => candidate.symbol === target.symbol);
    const identities = record && [
      { path: record.compilerAssembly, sha256: record.compilerAssemblySha256 },
      { path: record.linkedAssembly, sha256: record.linkedAssemblySha256 },
      { path: record.cObject, sha256: record.cObjectSha256 },
      ...(record.assemblerObject ? [{ path: record.assemblerObject, sha256: record.assemblerObjectSha256 }] : []),
      record.sourceObjectProof,
    ];
    if (!record || identities.some((identity) => {
      if (!identity || typeof identity.path !== 'string' || typeof identity.sha256 !== 'string') return true;
      const file = path.join(directory, ...identity.path.split('/'));
      return !fs.existsSync(file) || !fs.statSync(file).isFile() || sha256File(file) !== identity.sha256;
    })) return false;
  }
  return true;
}

function retryRoot(preferred) {
  if (!fs.existsSync(preferred) || fs.readdirSync(preferred).length === 0) return preferred;
  return `${preferred}-retry-${Date.now()}`;
}

function reusableCurrentState(context, state) {
  return Boolean(state && state.schemaVersion === 3
    && state.fingerprint === context.currentFingerprint
    && state.baselineFingerprint === context.baselineFingerprint
    && completeCurrent(state.output, context.phase8));
}

function runtimeArgs(localTools) {
  return [
    '--powershell-runtime-root', localTools.powershellRuntimeRoot,
    '--splat-python', localTools.splatPython,
    '--splat-split', localTools.splatSplit,
    '--asm-differ', localTools.asmDifferRoot,
  ];
}

function prepareContext(options = {}) {
  const localTools = resolveLocalTools({ audit: options.audit === true });
  const baserom = ensureCanonicalBaserom(localTools);
  const model = loadAcceptedModel();
  const baseline = baselineFingerprint(model, baserom);
  const phase8 = loadActiveTargetModel({
    allowMissingRelocationContracts: options.allowMissingRelocationContracts || [],
  });
  const current = currentFingerprint(phase8, baseline, localTools);
  return { baserom, baselineFingerprint: baseline, currentFingerprint: current, localTools, model, phase8 };
}

function ensureBaseline(context, options = {}) {
  const onStep = options.onStep || (() => {});
  const recorded = existingState(BASELINE_STATE_PATH);
  if (recorded && recorded.schemaVersion === 1 && recorded.fingerprint === context.baselineFingerprint
      && completeBaseline(recorded.phase7Output)) {
    return { ...recorded, reused: true };
  }
  const root = retryRoot(path.join(context.localTools.workRoot, 'baseline', context.baselineFingerprint.slice(0, 24).toLowerCase()));
  const splatOutput = path.join(root, 'splat');
  const phase7Output = path.join(root, 'phase7');
  ensureDir(root);
  onStep('Preparing accepted structural baseline');
  runNode('run_phase7_splat.js', [
    '--output', splatOutput,
    '--python', context.localTools.splatPython,
    '--split', context.localTools.splatSplit,
    '--snapshot-root', context.localTools.splatSnapshotRoot,
  ], 'structural split');
  runNode('build_phase7_conventional.js', [
    '--output', phase7Output,
    '--splat-output', splatOutput,
    ...runtimeArgs(context.localTools),
  ], 'structural baseline build');
  runNode('verify_phase7_conventional.js', [
    '--output', phase7Output,
    ...runtimeArgs(context.localTools),
  ], 'structural baseline verification');
  const state = {
    schemaVersion: 1,
    fingerprint: context.baselineFingerprint,
    createdAt: new Date().toISOString(),
    root,
    splatOutput,
    phase7Output,
    rom: { path: path.join(phase7Output, 'phase7.us_rev0.z64'), sha256: sha256File(path.join(phase7Output, 'phase7.us_rev0.z64')) },
  };
  writeJson(BASELINE_STATE_PATH, state);
  return { ...state, reused: false };
}

function ensureCurrentBuild(context, options = {}) {
  const onStep = options.onStep || (() => {});
  const baseline = ensureBaseline(context, { onStep });
  const recorded = existingState(CURRENT_STATE_PATH);
  if (reusableCurrentState(context, recorded)) {
    return { ...recorded, baseline, reused: true };
  }
  const root = retryRoot(path.join(context.localTools.workRoot, 'current', context.currentFingerprint.slice(0, 24).toLowerCase()));
  const output = path.join(root, 'build');
  ensureDir(root);
  onStep('Compiling and linking CURRENT');
  runNode('build_phase8_matching_c.js', [
    '--output', output,
    '--phase7-output', baseline.phase7Output,
    '--compiler', context.localTools.compiler,
    ...runtimeArgs(context.localTools),
  ], 'CURRENT build');
  const report = readJson(path.join(output, 'build-report.json'));
  const state = {
    schemaVersion: 3,
    fingerprint: context.currentFingerprint,
    baselineFingerprint: context.baselineFingerprint,
    createdAt: new Date().toISOString(),
    output,
    report: path.join(output, 'build-report.json'),
    rom: {
      path: path.join(output, 'phase8.us_rev0.z64'),
      bytes: report.verification.outputs.rom.bytes,
      sha256: report.verification.outputs.rom.sha256,
    },
  };
  writeJson(CURRENT_STATE_PATH, state);
  return { ...state, baseline, reused: false };
}

function classifyActiveTargets(phase8) {
  const preprocessor = resolvePreprocessor();
  const classification = classifyTargetSources(phase8.targets, { preprocessor });
  const report = {
    ...classification,
    generatedAt: new Date().toISOString(),
    preprocessor: {
      ...classification.preprocessor,
      path: preprocessor.path,
    },
  };
  writeJson(SOURCE_POLICY_REPORT_PATH, report);
  return report;
}

function verifyFreshCompilation(context, build) {
  const output = path.join(
    context.localTools.workRoot,
    'verification',
    `${context.currentFingerprint.slice(0, 24).toLowerCase()}-${Date.now()}`,
  );
  ensureDir(output);
  const runtime = verifyRuntimeTools(context.phase8.model, {
    powershellRuntimeRoot: context.localTools.powershellRuntimeRoot,
    splatPython: context.localTools.splatPython,
    splatSplit: context.localTools.splatSplit,
    asmDifferRoot: context.localTools.asmDifferRoot,
  });
  verifyCompiler(context.phase8, context.localTools.compiler);
  const sourcePolicy = classifyTargetSources(context.phase8.targets);
  const classificationBySymbol = new Map(sourcePolicy.targets.map((record) => [record.symbol, record]));
  const builtReport = readJson(build.report);
  if (builtReport.schemaVersion !== 3 || !Array.isArray(builtReport.targetReplacements)) {
    throw new Error('CURRENT build report lacks source-to-object provenance');
  }
  const targets = [];
  for (const target of context.phase8.targets) {
    const compiled = compileTarget(
      context.phase8,
      target,
      output,
      context.localTools.compiler,
      runtime.tools['mips-kmc-elf-as.exe'].path,
      runtime.tools['mips-kmc-elf-objcopy.exe'].path,
      { classification: classificationBySymbol.get(target.symbol) },
    );
    const builtTarget = builtReport.targetReplacements.find((record) => record.symbol === target.symbol);
    const builtObject = path.join(build.output, 'objects', 'c', `${target.symbol}.o`);
    if (!builtTarget || !fs.existsSync(builtObject) || sha256File(builtObject) !== compiled.objectSha256
        || builtTarget.compilerAssemblySha256 !== compiled.compilerAssemblySha256
        || builtTarget.linkedAssemblySha256 !== compiled.linkedAssemblySha256
        || builtTarget.sourceClass !== compiled.sourceClass
        || builtTarget.sourcePolicyDigest !== compiled.sourcePolicyDigest
        || builtTarget.compilerAssemblyRewritten !== false) {
      throw new Error(`freshly compiled object differs from CURRENT build: ${target.symbol}`);
    }
    targets.push({
      symbol: target.symbol,
      source: target.source,
      sourceSha256: target.sourceSha256,
      objectSha256: compiled.objectSha256,
      compilerAssemblySha256: compiled.compilerAssemblySha256,
      sectionAdjustedAssemblySha256: compiled.linkedAssemblySha256,
      sourceClass: compiled.sourceClass,
      sourcePolicyDigest: compiled.sourcePolicyDigest,
      compilerAssemblyRewritten: false,
      relocations: compiled.relocations,
    });
  }
  const report = {
    schemaVersion: 3,
    status: 'pass',
    generatedAt: new Date().toISOString(),
    compilerSha256: sha256File(context.localTools.compiler),
    toolchain: context.phase8.toolchain.identity,
    sourcePolicy: { counts: sourcePolicy.counts, bytes: sourcePolicy.bytes },
    output,
    targets,
  };
  const reportFile = path.join(STATE_ROOT, 'fresh-compilation.json');
  writeJson(reportFile, report);
  return { report, reportFile };
}

function verifyCurrent(context, options = {}) {
  const build = ensureCurrentBuild(context, options);
  const onStep = options.onStep || (() => {});
  onStep('Verifying ownership, placement, relocations, and exact bytes');
  runNode('verify_phase8_matching_c.js', [
    '--output', build.output,
    '--compiler', context.localTools.compiler,
    ...runtimeArgs(context.localTools),
    '--report', VERIFICATION_REPORT_PATH,
  ], 'CURRENT verification');
  onStep('Recompiling active sources for source-to-object identity');
  const freshCompilation = verifyFreshCompilation(context, build);
  const sourcePolicy = classifyActiveTargets(context.phase8);
  const verification = readJson(VERIFICATION_REPORT_PATH);
  const state = {
    ...existingState(CURRENT_STATE_PATH),
    verifiedAt: new Date().toISOString(),
    verificationReport: VERIFICATION_REPORT_PATH,
    freshCompilationReport: freshCompilation.reportFile,
    sourcePolicyReport: SOURCE_POLICY_REPORT_PATH,
  };
  writeJson(CURRENT_STATE_PATH, state);
  return { build, freshCompilation, sourcePolicy, verification };
}

function currentVerificationState(context) {
  const state = existingState(CURRENT_STATE_PATH);
  if (!reusableCurrentState(context, state) || !state.verifiedAt) {
    return { exact: false, state };
  }
  const rom = path.join(state.output, 'phase8.us_rev0.z64');
  const exact = fs.existsSync(rom) && fs.statSync(rom).size === context.model.config.rom.bytes
    && sha256File(rom) === context.model.config.rom.sha256;
  return { exact, state };
}

module.exports = {
  BASELINE_STATE_PATH,
  CURRENT_STATE_PATH,
  SOURCE_POLICY_REPORT_PATH,
  STATE_ROOT,
  VERIFICATION_REPORT_PATH,
  classifyActiveTargets,
  currentVerificationState,
  ensureBaseline,
  ensureCanonicalBaserom,
  ensureCurrentBuild,
  prepareContext,
  readJson,
  reusableCurrentState,
  runNode,
  runtimeArgs,
  sha256Value,
  verifyCurrent,
  verifyFreshCompilation,
  writeJson,
};
