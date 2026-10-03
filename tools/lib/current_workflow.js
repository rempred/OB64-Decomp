'use strict';

const childProcess = require('child_process');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { isDeepStrictEqual } = require('util');
const { interiorRecords, buildInteriorObject } = require('./auxiliary_interior');
const textContract = require('./text_contract');
const compilationGroups = require('./compilation_groups');
const { measure, targetStage } = require('./verification_profile');
const {
  ROOT,
  sha256File,
} = require('./phase7_conventional');
const { loadActiveTargetModelForContext, finishActiveTargetModelSources } = require('./active_targets');
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
const SHA256 = /^[0-9A-F]{64}$/;

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

function canonicalArtifactPath(relative, label) {
  if (typeof relative !== 'string' || !relative || path.isAbsolute(relative)) {
    throw new Error(`${label} path is malformed`);
  }
  const shown = relative.replace(/\\/g, '/');
  const normalized = path.posix.normalize(shown);
  if (normalized !== shown || normalized === '.' || normalized === '..'
      || normalized.startsWith('../') || path.posix.isAbsolute(normalized)) {
    throw new Error(`${label} path is malformed`);
  }
  return normalized;
}

function confinedArtifactContents(root, relative, label) {
  const resolvedRoot = path.resolve(root);
  if (!fs.existsSync(resolvedRoot) || !fs.statSync(resolvedRoot).isDirectory()) {
    throw new Error(`${label} root is missing or not a directory`);
  }
  const shown = canonicalArtifactPath(relative, label);
  const file = path.resolve(resolvedRoot, ...shown.split('/'));
  const lexicalRelative = path.relative(resolvedRoot, file);
  if (!lexicalRelative || lexicalRelative === '..' || lexicalRelative.startsWith(`..${path.sep}`)
      || path.isAbsolute(lexicalRelative)) {
    throw new Error(`${label} escapes its root`);
  }
  if (!fs.existsSync(file)) throw new Error(`${label} is missing`);
  const status = fs.lstatSync(file);
  if (!status.isFile() || status.isSymbolicLink()) {
    throw new Error(`${label} is not a regular nonsymlink file`);
  }
  const realRoot = fs.realpathSync.native(resolvedRoot);
  const realFile = fs.realpathSync.native(file);
  const canonicalRelative = path.relative(realRoot, realFile);
  if (!canonicalRelative || canonicalRelative === '..' || canonicalRelative.startsWith(`..${path.sep}`)
      || path.isAbsolute(canonicalRelative)) {
    throw new Error(`${label} resolves outside its root`);
  }
  const contents = fs.readFileSync(file);
  if (contents.length !== status.size) throw new Error(`${label} changed while reading`);
  return {
    path: shown,
    file,
    bytes: status.size,
    sha256: require('./phase7_conventional').sha256Buffer(contents),
    contents,
  };
}

function confinedArtifactIdentity(root, relative, label) {
  const { contents, ...identity } = confinedArtifactContents(root, relative, label);
  return identity;
}

function acceptedCompilationInputIdentity(target, sourcePolicyTarget, label) {
  if (!target || !sourcePolicyTarget || typeof target.symbol !== 'string'
      || typeof target.source !== 'string' || typeof target.sourceSha256 !== 'string'
      || sourcePolicyTarget.symbol !== target.symbol || sourcePolicyTarget.source !== target.source
      || sourcePolicyTarget.sourceSha256 !== target.sourceSha256
      || !sourcePolicyTarget.compilationInput
      || !Number.isInteger(sourcePolicyTarget.compilationInput.bytes)
      || sourcePolicyTarget.compilationInput.bytes <= 0
      || typeof sourcePolicyTarget.compilationInput.sha256 !== 'string'
      || !SHA256.test(sourcePolicyTarget.compilationInput.sha256)) {
    throw new Error(`${label} accepted target/source-policy identity is malformed or inconsistent`);
  }
  return {
    path: target.source,
    bytes: sourcePolicyTarget.compilationInput.bytes,
    sha256: sourcePolicyTarget.compilationInput.sha256,
  };
}

function verifyCompilationInputArtifact(root, recorded, expected, label) {
  if (!recorded || !expected || recorded.path !== expected.path
      || recorded.bytes !== expected.bytes || recorded.sha256 !== expected.sha256) {
    throw new Error(`${label} identity differs from the accepted target/source-policy input`);
  }
  const artifact = confinedArtifactIdentity(root, recorded.path, label);
  if (artifact.bytes !== recorded.bytes || artifact.sha256 !== recorded.sha256) {
    throw new Error(`${label} recorded byte identity drift`);
  }
  return artifact;
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

function baselineFingerprint(phase8, baserom) {
  // Consume the loader's private source bracket here: a complete fresh sweep
  // authenticates the exact bytes used for symbol resolution and this identity.
  const assemblySources = finishActiveTargetModelSources(phase8);
  return sha256Value({
    schemaVersion: 1,
    baserom: { bytes: baserom.bytes, sha256: baserom.sha256 },
    acceptedInputs: phase8.model.inputFiles,
    assemblySources,
    implementation: hashFiles([
      'config/phase7/conventional-build.json',
      'tools/run_phase7_splat.js',
      'tools/build_phase7_conventional.js',
      'tools/verify_phase7_conventional.js',
      'tools/lib/phase7_conventional.js',
    ]),
  });
}

function currentFingerprint(phase8, baseline, localTools, sourcePolicy) {
  if (!sourcePolicy || sourcePolicy.schemaVersion !== 2 || sourcePolicy.status !== 'pass'
      || !Array.isArray(sourcePolicy.targets) || sourcePolicy.targets.length !== phase8.targets.length) {
    throw new Error('CURRENT fingerprint source-policy census is malformed');
  }
  const classificationBySymbol = new Map(sourcePolicy.targets.map((record) => [record.symbol, record]));
  return sha256Value({
    schemaVersion: 8,
    baseline,
    compilerSha256: sha256File(localTools.compiler),
    activeConfigSha256: sha256File(path.join(ROOT, 'config', 'matching-c-targets.json')),
    linkageConfig: phase8.linkageConfigIdentity,
    multiOwnerConfig: phase8.multiOwnerConfigIdentity,
    compilationGroupConfig: phase8.groupConfigIdentity,
    logicalFunctionConfig: phase8.logicalFunctionConfigIdentity,
    compatibilityBridge: {
      compiler: phase8.config.compiler,
      targets: phase8.targets.map((target) => ({
        symbol: target.symbol,
        relocationContractSource: target.relocationContractSource,
        expectedRelocations: target.expectedRelocations,
      })),
    },
    sourcePolicy: {
      configSha256: sha256File(path.join(ROOT, 'config', 'source-policy.json')),
      preprocessor: sourcePolicy.preprocessor,
    },
    gnuBinutils26: phase8.toolchain.identity,
    targets: phase8.targets.map((target) => {
      const classification = classificationBySymbol.get(target.symbol);
      if (!classification || classification.source !== target.source
          || classification.sourceSha256 !== target.sourceSha256) {
        throw new Error(`CURRENT fingerprint source-policy target drift: ${target.symbol}`);
      }
      return {
        symbol: target.symbol,
        source: target.source,
        sourceBytes: classification.sourceBytes,
        sourceSha256: target.sourceSha256,
        sourcePolicyDigest: classification.digest,
        compilationInput: classification.compilationInput,
        dependencies: classification.dependencies,
        textContract: textContract.resolveTextContract(target),
        textOwners: target.textOwners.map((owner) => ({
          rowIndex: owner.rowIndex,
          chunkIndex: owner.chunkIndex,
          sectionName: owner.sectionName,
          logicalOffset: owner.logicalOffset,
          bytes: owner.bytes,
          originalAssemblySha256: owner.originalAssemblySha256,
        })),
      };
    }),
    implementation: hashFiles([
      'tools/build_phase8_matching_c.js',
      'tools/verify_phase8_matching_c.js',
      'tools/lib/phase8_matching_c.js',
      'tools/lib/active_targets.js',
      'tools/lib/logical_functions.js',
      'tools/lib/auxiliary_interior.js',
      'tools/lib/auxiliary_projection.js',
      'tools/lib/text_contract.js',
      'tools/lib/prepared_link_view.js',
      'tools/lib/elf_text_split.js',
      'tools/lib/compilation_groups.js',
      'tools/lib/current_workflow.js',
      'tools/lib/source_policy.js',
      'tools/verify.js',
      'tools/lib/verification_profile.js',
      'tools/lib/diff_profile.js',
    ]),
  });
}

function completeBaseline(directory) {
  return ['phase7.elf', 'phase7.elf-report.json', 'phase7.map', 'phase7.us_rev0.z64', 'layout.json', 'build-report.json', 'objects/manifest.json']
    .every((relative) => fs.existsSync(path.join(directory, ...relative.split('/'))));
}

function completeCurrent(directory, phase8, sourcePolicy) {
  const required = ['phase8.elf', 'phase8.elf-report.json', 'phase8.map', 'phase8.us_rev0.z64', 'layout.json', 'build-report.json', 'objects/manifest.json'];
  if (!required.every((relative) => fs.existsSync(path.join(directory, ...relative.split('/'))))) return false;
  let report;
  try {
    report = readJson(path.join(directory, 'build-report.json'));
  } catch (_) {
    return false;
  }
  if (!phase8 || !sourcePolicy || sourcePolicy.schemaVersion !== 2 || sourcePolicy.status !== 'pass'
      || !Array.isArray(sourcePolicy.targets) || sourcePolicy.targets.length !== phase8.targets.length
      || report.schemaVersion !== 6 || report.status !== 'pass'
      || !isDeepStrictEqual(report.acceptedInputs?.logicalFunctionConfig, phase8.logicalFunctionConfigIdentity)
      || !Array.isArray(report.targetReplacements) || report.targetReplacements.length !== phase8.targets.length) return false;
  let textLinkContext;
  try { textLinkContext = textContract.linkContext(directory, require('./phase8_matching_c').loadCanonicalBaserom(phase8)); } catch (_) { return false; }
  let layout, manifestMembers, metadataInputs;
  try {
    metadataInputs = ['layout.json', 'objects/manifest.json'].map(relative =>
      confinedArtifactContents(directory, relative, `CURRENT ${relative}`));
    layout = JSON.parse(metadataInputs[0].contents);
    const manifest = JSON.parse(metadataInputs[1].contents);
    if (layout.schemaVersion !== 2 || manifest.schemaVersion !== 5) return false;
    manifestMembers = compilationGroups.manifestMembers(manifest.linkedObjects, phase8);
    // Retain identities, not a second copy of the large parsed inputs. Recheck
    // exact contents at the end; this is only invocation-local parse reuse.
    metadataInputs = metadataInputs.map(({ contents, ...identity }) => identity);
  } catch (_) { return false; }
  for (const target of phase8.targets) {
    const record = report.targetReplacements.find((candidate) => candidate.symbol === target.symbol);
    const policyMatches = sourcePolicy.targets.filter((candidate) => candidate.symbol === target.symbol);
    const identities = record && [
      { path: record.compilerAssembly, sha256: record.compilerAssemblySha256 },
      { path: record.linkedAssembly, sha256: record.linkedAssemblySha256 },
      { path: record.cObject, sha256: record.cObjectSha256 },
      ...(record.assemblerObject ? [{ path: record.assemblerObject, sha256: record.assemblerObjectSha256 }] : []),
      record.sourceObjectProof,
    ];
    if (!record || record.source !== target.source || record.sourceSha256 !== target.sourceSha256
        || policyMatches.length !== 1 || record.sourceClass !== policyMatches[0].class) return false;
    try {
      const representation = textContract.recordsForTarget(target, directory, textLinkContext);
      if (representation.linkEvidence.fullOwnerExact !== true) return false;
      textContract.validateRecords(record, representation, 'CURRENT');
      const proof = readJson(path.join(directory, record.sourceObjectProof.path));
      if (proof.schemaVersion !== 4) return false;
      textContract.validateRecords(proof, representation, 'CURRENT proof');
      textContract.validateRecords(layout.phase8MatchingCTargets?.find((r) => r.symbol === target.symbol), representation, 'CURRENT layout');
      textContract.validateRecords(manifestMembers.find((r) => r.targetSymbol === target.symbol && r.ownerKind === 'matching-c-target'),
        { textContract: representation.textContract, objectEvidence: representation.objectEvidence }, 'CURRENT manifest');
      const expectedInteriors = interiorRecords([target]);
      if (expectedInteriors.length > 0 || record.auxiliaryInteriors !== undefined) {
        if (!Array.isArray(record.auxiliaryInteriors) || record.auxiliaryInteriors.length !== expectedInteriors.length) return false;
        for (const expected of expectedInteriors) {
          const matches = record.auxiliaryInteriors.filter((item) => item.inputSection === expected.inputSection);
          if (matches.length !== 1 || !Object.entries(expected).every(([key, value]) => isDeepStrictEqual(matches[0][key], value))) return false;
          for (const kind of ['binary', 'object']) {
            const artifact = confinedArtifactIdentity(directory, matches[0][`${kind}Relative`], `CURRENT retained interior ${kind}`);
            if (artifact.sha256 !== matches[0][`${kind}Sha256`]) return false;
          }
        }
      }
      const expectedInput = acceptedCompilationInputIdentity(target, policyMatches[0], `CURRENT ${target.symbol} compilation input`);
      verifyCompilationInputArtifact(directory, record.compilationInput, expectedInput, `CURRENT ${target.symbol} compilation input`);
      for (const identity of identities) {
        if (!identity || typeof identity.path !== 'string' || typeof identity.sha256 !== 'string') return false;
        const artifact = confinedArtifactIdentity(directory, identity.path, `CURRENT ${target.symbol} artifact`);
        if (artifact.sha256 !== identity.sha256) return false;
      }
    } catch (_) {
      return false;
    }
  }
  try {
    textContract.finishLinkContext(textLinkContext);
    for (const expected of metadataInputs) {
      const actual = confinedArtifactIdentity(directory, expected.path, `CURRENT ${expected.path}`);
      if (actual.bytes !== expected.bytes || actual.sha256 !== expected.sha256) return false;
    }
    if (!required.every(relative => fs.existsSync(path.join(directory, ...relative.split('/'))))) return false;
  } catch (_) { return false; }
  return true;
}

function retryRoot(preferred) {
  if (!fs.existsSync(preferred) || fs.readdirSync(preferred).length === 0) return preferred;
  return `${preferred}-retry-${Date.now()}`;
}

function validateVerifiedCompanions(build, fresh, verified, output) {
  if (build.schemaVersion !== 6 || build.status !== 'pass' || fresh.schemaVersion !== 5 || fresh.status !== 'pass'
      || verified.schemaVersion !== 5 || verified.status !== 'pass' || verified.output !== '.'
      || verified.verification?.schemaVersion !== 5 || verified.verification?.status !== 'pass'
      || !Array.isArray(build.targetReplacements) || !Array.isArray(fresh.targets)
      || !Array.isArray(verified.verification.targets) || fresh.targets.length !== build.targetReplacements.length
      || verified.verification.targets.length !== build.targetReplacements.length) throw new Error('verified companion census or schema drift');
  for (const target of build.targetReplacements) {
    const freshMatches = fresh.targets.filter(record => record.symbol === target.symbol);
    const verifiedMatches = verified.verification.targets.filter(record => record.symbol === target.symbol);
    if (freshMatches.length !== 1 || verifiedMatches.length !== 1 || target.linkEvidence?.fullOwnerExact !== true
        || freshMatches[0].sourceClass !== target.sourceClass || freshMatches[0].sourceSha256 !== target.sourceSha256) {
      throw new Error('verified companion target identity drift');
    }
    textContract.validateRecords(freshMatches[0], { textContract: target.textContract, objectEvidence: target.objectEvidence }, 'fresh companion');
    textContract.validateRecords(verifiedMatches[0], { textContract: target.textContract, objectEvidence: target.objectEvidence,
      linkEvidence: target.linkEvidence }, 'verification companion');
  }
}
function reusableCurrentState(context, state) {
  if (state?.verifiedAt) {
    try {
      for (const [file, expected] of [[state.verificationReport, state.verificationSha256], [state.freshCompilationReport, state.freshCompilationSha256]]) {
        if (!file || !expected || sha256File(file) !== expected || readJson(file).schemaVersion !== 5 || readJson(file).status !== 'pass') return false;
      }
      validateVerifiedCompanions(readJson(path.join(state.output, 'build-report.json')), readJson(state.freshCompilationReport), readJson(state.verificationReport), state.output);
    } catch (_) { return false; }
  }
  return Boolean(state && state.schemaVersion === 5
    && state.fingerprint === context.currentFingerprint
    && state.baselineFingerprint === context.baselineFingerprint
    && completeCurrent(state.output, context.phase8, context.sourcePolicy));
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
  const profile = options.profile;
  const localTools = measure(profile, 'prepare.local-tools', () => resolveLocalTools({ audit: options.audit === true }));
  const baserom = measure(profile, 'prepare.baserom', () => ensureCanonicalBaserom(localTools));
  const phase8 = measure(profile, 'prepare.active-target-model', () => loadActiveTargetModelForContext({
    allowMissingRelocationContracts: options.allowMissingRelocationContracts || [],
  }));
  // The active model already performs a fresh complete accepted-model load.
  // Use that very object rather than parsing/authenticating a second copy.
  const model = phase8.model;
  const baseline = measure(profile, 'prepare.baseline-fingerprint', () => baselineFingerprint(phase8, baserom));
  if (options.contextPreprocessFactory !== undefined && (typeof options.contextPreprocessFactory !== 'function'
      || options.diffPreprocessSymbol !== undefined)) throw new Error('context preprocessing hook is invalid or conflicts with diff preprocessing');
  const contextPreprocess = options.contextPreprocessFactory?.(phase8.targets);
  if (options.contextPreprocessFactory && (!contextPreprocess || typeof contextPreprocess.preprocess !== 'function'
      || typeof contextPreprocess.finish !== 'function')) throw new Error('context preprocessing hook requires preprocess and finish');
  let diffPreprocess = null;
  if (options.diffPreprocessSymbol !== undefined) {
    const requested = phase8.targets.filter(target => target.symbol.toLowerCase() === String(options.diffPreprocessSymbol).toLowerCase());
    if (requested.length !== 1) throw new Error('diff preprocessing target does not resolve uniquely');
    // All members of a compilation group share this source; the whole producer
    // therefore stays fresh even when a nonleader member was requested.
    diffPreprocess = require('./diff_preprocess_cache').createDiffPreprocessCache({ requestedSources: [requested[0].source] });
  }
  let sourcePolicy, current;
  try {
    sourcePolicy = classifyTargetSources(phase8.targets, {
      profile: options.profile, preprocess: contextPreprocess?.preprocess || diffPreprocess?.preprocess,
    });
    current = measure(profile, 'prepare.current-fingerprint', () => currentFingerprint(phase8, baseline, localTools, sourcePolicy));
  } finally {
    // Private research may reuse authenticated CPP bytes, never classifications.
    // Seal their complete inputs before any prepared context escapes, on errors too.
    contextPreprocess?.finish();
  }
  return {
    baserom,
    baselineFingerprint: baseline,
    currentFingerprint: current,
    localTools,
    model,
    phase8,
    sourcePolicy,
    ...(diffPreprocess ? { diffPreprocess } : {}),
  };
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
    schemaVersion: 5,
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

function classifyActiveTargets(phase8, preparedClassification = null) {
  const preprocessor = resolvePreprocessor();
  const classification = preparedClassification || classifyTargetSources(phase8.targets, { preprocessor });
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

function verifyFreshCompilation(context, build, options = {}) {
  const profile = options.profile;
  const output = path.join(
    context.localTools.workRoot,
    'verification',
    `${context.currentFingerprint.slice(0, 24).toLowerCase()}-${Date.now()}`,
  );
  ensureDir(output);
  const runtime = measure(profile, 'fresh-authenticate-runtime', () => verifyRuntimeTools(context.phase8.model, {
    powershellRuntimeRoot: context.localTools.powershellRuntimeRoot,
    splatPython: context.localTools.splatPython,
    splatSplit: context.localTools.splatSplit,
    asmDifferRoot: context.localTools.asmDifferRoot,
  }));
  measure(profile, 'fresh-authenticate-compiler', () => verifyCompiler(context.phase8, context.localTools.compiler));
  const sourcePolicy = context.sourcePolicy || classifyTargetSources(context.phase8.targets, { profile });
  const classificationBySymbol = new Map(sourcePolicy.targets.map((record) => [record.symbol, record]));
  const builtReport = readJson(build.report);
  if (builtReport.schemaVersion !== 6 || !Array.isArray(builtReport.targetReplacements)) {
    throw new Error('CURRENT build report lacks source-to-object provenance');
  }
  const targets = [];
  for (const target of context.phase8.targets) {
    const compiled = measure(profile, targetStage('fresh-compile', target.symbol), () => compileTarget(
      context.phase8,
      target,
      output,
      context.localTools.compiler,
      runtime.tools['mips-kmc-elf-as.exe'].path,
      runtime.tools['mips-kmc-elf-objcopy.exe'].path,
      { classification: classificationBySymbol.get(target.symbol) },
    ));
    const builtTarget = builtReport.targetReplacements.find((record) => record.symbol === target.symbol);
    textContract.validateRecords(builtTarget, { textContract: compiled.textContract, objectEvidence: compiled.objectEvidence }, 'fresh compilation');
    const builtObject = path.join(build.output, compilationGroups.objectPath(target));
    if (!builtTarget || !fs.existsSync(builtObject) || sha256File(builtObject) !== compiled.objectSha256
        || builtTarget.compilerAssemblySha256 !== compiled.compilerAssemblySha256
        || builtTarget.linkedAssemblySha256 !== compiled.linkedAssemblySha256
        || JSON.stringify(builtTarget.compilationInput) !== JSON.stringify(compiled.compilationInput)
        || builtTarget.sourceClass !== compiled.sourceClass
        || builtTarget.sourcePolicyDigest !== compiled.sourcePolicyDigest
        || builtTarget.compilerAssemblyRewritten !== false) {
      throw new Error(`freshly compiled object differs from CURRENT build: ${target.symbol}`);
    }
    const retainedInteriors = (target.auxiliarySections || []).filter((auxiliary) => auxiliary.preservedInteriorBefore).map((auxiliary) => {
      const fallback = path.join(build.output, 'comparison', 'original', `chunk_${String(auxiliary.ownerChunkIndex).padStart(3, '0')}.o`);
      const regenerated = buildInteriorObject(target, auxiliary, output, fallback,
        runtime.tools['mips-kmc-elf-objcopy.exe'].path, fs.readFileSync(context.baserom.path));
      const matches = builtTarget.auxiliaryInteriors?.filter((item) => item.inputSection === regenerated.inputSection);
      if (!matches || matches.length !== 1 || !isDeepStrictEqual(matches[0], regenerated)
          || sha256File(path.join(build.output, regenerated.objectRelative)) !== regenerated.objectSha256) {
        throw new Error(`freshly reconstructed retained interior differs from CURRENT: ${target.symbol}`);
      }
      return regenerated;
    });
    targets.push({
      textContract: compiled.textContract,
      objectEvidence: compiled.objectEvidence,
      symbol: target.symbol,
      source: target.source,
      sourceSha256: target.sourceSha256,
      objectSha256: compiled.objectSha256,
      compilerAssemblySha256: compiled.compilerAssemblySha256,
      sectionAdjustedAssemblySha256: compiled.linkedAssemblySha256,
      sourceClass: compiled.sourceClass,
      sourcePolicyDigest: compiled.sourcePolicyDigest,
      compilationInput: compiled.compilationInput,
      dependencies: classificationBySymbol.get(target.symbol).dependencies,
      compilerAssemblyRewritten: false,
      relocations: compiled.relocations,
      retainedInteriors,
    });
  }
  const report = {
    schemaVersion: 5,
    status: 'pass',
    generatedAt: new Date().toISOString(),
    compilerSha256: sha256File(context.localTools.compiler),
    toolchain: context.phase8.toolchain.identity,
    sourcePolicy: {
      schemaVersion: sourcePolicy.schemaVersion,
      preprocessor: sourcePolicy.preprocessor,
      counts: sourcePolicy.counts,
      bytes: sourcePolicy.bytes,
    },
    output,
    targets,
  };
  const reportFile = path.join(STATE_ROOT, 'fresh-compilation.json');
  writeJson(reportFile, report);
  return { report, reportFile };
}

function verifyCurrent(context, options = {}) {
  const profile = options.profile;
  const build = measure(profile, 'ensure-current', () => ensureCurrentBuild(context, options));
  const onStep = options.onStep || (() => {});
  onStep('Verifying ownership, placement, relocations, and exact bytes');
  measure(profile, 'verify-current-output', () => runNode('verify_phase8_matching_c.js', [
    '--output', build.output,
    '--compiler', context.localTools.compiler,
    ...runtimeArgs(context.localTools),
    '--report', VERIFICATION_REPORT_PATH,
    ...(profile ? ['--profile'] : []),
  ], 'CURRENT verification'));
  onStep('Recompiling active sources for source-to-object identity');
  const freshCompilation = measure(profile, 'fresh-compilation', () => verifyFreshCompilation(context, build, { profile }));
  const sourcePolicy = measure(profile, 'source-policy-report', () => classifyActiveTargets(context.phase8, context.sourcePolicy));
  const verification = readJson(VERIFICATION_REPORT_PATH);
  const state = {
    ...existingState(CURRENT_STATE_PATH),
    verifiedAt: new Date().toISOString(),
    verificationReport: VERIFICATION_REPORT_PATH,
    freshCompilationReport: freshCompilation.reportFile,
    freshCompilationSha256: sha256File(freshCompilation.reportFile),
    verificationSha256: sha256File(VERIFICATION_REPORT_PATH),
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
  try {
    for (const [file, expected] of [[state.verificationReport, state.verificationSha256], [state.freshCompilationReport, state.freshCompilationSha256]]) {
      if (!file || !expected || sha256File(file) !== expected || readJson(file).schemaVersion !== 5) return { exact: false, state };
    }
  } catch (_) { return { exact: false, state }; }
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
  acceptedCompilationInputIdentity,
  classifyActiveTargets,
  completeCurrent,
  confinedArtifactIdentity,
  confinedArtifactContents,
  currentFingerprint,
  currentVerificationState,
  ensureBaseline,
  ensureCanonicalBaserom,
  ensureCurrentBuild,
  prepareContext,
  readJson,
  reusableCurrentState,
  validateVerifiedCompanions,
  runNode,
  runtimeArgs,
  sha256Value,
  verifyCurrent,
  verifyCompilationInputArtifact,
  verifyFreshCompilation,
  writeJson,
};
