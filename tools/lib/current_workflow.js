'use strict';

const childProcess = require('child_process');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const inputSet = require('./matching/input_set');
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
// Only this executing controller can attest a newly launched empty build.
// Serialized reports, timestamps and caller-supplied tokens cannot seed it.
const freshBuilds = new WeakMap();
function executionReportSha256(execution, kind) {
  const matches = [...execution.stdout.matchAll(new RegExp('^' + kind + ' report SHA-256: ([A-F0-9]{64})\\r?$', 'gm'))];
  if (matches.length !== 1) throw new Error(`${kind} execution did not bind its report`);
  return matches[0][1];
}
function outputSeal(directory) {
  for (let current = path.resolve(directory); ; current = path.dirname(current)) {
    if (fs.lstatSync(current).isSymbolicLink()) throw new Error('fresh output has an aliased ancestor');
    if (path.dirname(current) === current) break;
  }
  const files = [];
  function visit(relative) {
    const file = path.join(directory, relative), stat = fs.lstatSync(file);
    if (stat.isSymbolicLink()) throw new Error('fresh output contains a filesystem alias');
    if (stat.isDirectory()) {
      for (const name of fs.readdirSync(file).sort()) visit(path.join(relative, name));
    } else if (stat.isFile()) files.push(confinedArtifactIdentity(directory, relative.replace(/\\/g, '/'), 'fresh output'));
    else throw new Error('fresh output contains a nonregular artifact');
  }
  visit('');
  return files;
}

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

function ensureCanonicalBaserom(localTools, inputs, readOnly = false) {
  const config = readJson(inputSet.resolve(inputs, path.join(ROOT, 'config', 'phase7', 'conventional-build.json')));
  const output = path.join(ROOT, 'build', 'baserom.us_rev0.z64');
  if (fs.existsSync(output) && fs.statSync(output).size === config.rom.bytes && sha256File(output) === config.rom.sha256) {
    if (inputs) inputs.resolve(output);
    return { path: output, bytes: config.rom.bytes, sha256: config.rom.sha256, generated: false };
  }
  if (inputs || readOnly) throw new Error('read-only preparation requires the authenticated normalized baserom; setup is forbidden');
  const args = [];
  if (localTools.romInput) args.push('--input', localTools.romInput);
  runNode('verify_baserom.js', args, 'baserom normalization');
  if (!fs.existsSync(output) || fs.statSync(output).size !== config.rom.bytes || sha256File(output) !== config.rom.sha256) {
    throw new Error('canonical normalized baserom was not produced with the accepted identity');
  }
  return { path: output, bytes: config.rom.bytes, sha256: config.rom.sha256, generated: true };
}

function hashFiles(relativeFiles, inputs) {
  return relativeFiles.map((relative) => {
    const file = inputSet.resolve(inputs, path.join(ROOT, ...relative.split('/')));
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
      'tools/lib/boot_initialized_data.js',
      'tools/lib/word_asm.js',
      'tools/lib/matching/input_set.js',
    ], inputSet.context(phase8)),
  });
}

function currentFingerprint(phase8, baseline, localTools, sourcePolicy) {
  const inputs = inputSet.context(phase8);
  if (!sourcePolicy || sourcePolicy.schemaVersion !== 2 || sourcePolicy.status !== 'pass'
      || !Array.isArray(sourcePolicy.targets) || sourcePolicy.targets.length !== phase8.targets.length) {
    throw new Error('CURRENT fingerprint source-policy census is malformed');
  }
  const classificationBySymbol = new Map(sourcePolicy.targets.map((record) => [record.symbol, record]));
  return sha256Value({
    schemaVersion: 10,
    baseline,
    compilerSha256: sha256File(localTools.compiler),
    activeConfigSha256: sha256File(path.join(ROOT, 'config', 'matching-c-targets.json'), inputs),
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
      configSha256: sha256File(path.join(ROOT, 'config', 'source-policy.json'), inputs),
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
      'tools/lib/retained_literal_references.js',
      'tools/lib/prepared_link_view.js',
      'tools/lib/elf_text_split.js',
      'tools/lib/atomic_owner_union.js',
      'tools/lib/compilation_groups.js',
      'tools/lib/current_workflow.js',
      'tools/lib/source_policy.js',
      'tools/verify.js',
      'tools/lib/verification_profile.js',
      'tools/lib/diff_profile.js',
      'tools/lib/matching/input_set.js',
    ], inputs),
  });
}

function completeBaseline(directory) {
  return ['phase7.elf', 'phase7.elf-report.json', 'phase7.map', 'phase7.us_rev0.z64', 'layout.json', 'build-report.json', 'objects/manifest.json']
    .every((relative) => fs.existsSync(path.join(directory, ...relative.split('/'))));
}

function completeCurrent(directory, phase8, sourcePolicy) {
  const required = ['phase8.elf', 'phase8.elf-report.json', 'phase8.map', 'phase8.us_rev0.z64', 'layout.json', 'build-report.json', 'objects/manifest.json'];
  if (!required.every((relative) => fs.existsSync(path.join(directory, ...relative.split('/'))))) return false;
  let report, reportIdentity, verification;
  try {
    ({ report, identity: reportIdentity } = textContract.readCompactReport(directory));
    if (report.schemaVersion === 8) {
      const companion = textContract.readCompactReport(directory, 'verification.json').report;
      if (!isDeepStrictEqual(companion.buildReport, reportIdentity) || companion.schemaVersion !== 7 || companion.status !== 'pass') return false;
      verification = companion.verification;
    } else verification = report.verification;
  } catch (_) {
    return false;
  }
  if (!phase8 || !sourcePolicy || sourcePolicy.schemaVersion !== 2 || sourcePolicy.status !== 'pass'
      || !Array.isArray(sourcePolicy.targets) || sourcePolicy.targets.length !== phase8.targets.length
      || !(report.schemaVersion === 7 && report.status === 'pass' || report.schemaVersion === 8 && report.status === 'constructed')
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
    require('./phase8_matching_c').verifyRecordedEdgePadding(phase8, directory, verification, textLinkContext);
    manifestMembers = compilationGroups.manifestMembers(manifest.linkedObjects, phase8);
    if (phase8.targets.some(target => (target.auxiliarySections || []).length)) {
      const sharedInputs = ['linker/phase8.ld', 'phase8.map'].map(relative =>
        confinedArtifactContents(directory, relative, `CURRENT shared auxiliary ${relative}`));
      const auxiliaryVerification = require('./phase8_matching_c');
      auxiliaryVerification.verifyRecordedSharedAuxiliaryScript(phase8, directory);
      auxiliaryVerification.verifyInteriorGroupMapOwners(phase8, textLinkContext.mapText);
      metadataInputs.push(...sharedInputs);
    }
    // Retain identities, not a second copy of the large parsed inputs. Recheck
    // exact contents at the end; this is only invocation-local parse reuse.
    metadataInputs = metadataInputs.map(({ contents, ...identity }) => identity);
  } catch (_) { return false; }
  for (const target of phase8.targets) {
    let record, verifiedRecord;
    try { ({ replacement: record, verified: verifiedRecord } = textContract.buildTargetRecords(report, target, phase8.targets.length, verification)); } catch (_) { return false; }
    const policyMatches = sourcePolicy.targets.filter((candidate) => candidate.symbol === target.symbol);
    const identities = record && [
      { path: record.compilerAssembly, sha256: record.compilerAssemblySha256 },
      { path: record.linkedAssembly, sha256: record.linkedAssemblySha256 },
      { path: record.cObject, sha256: record.cObjectSha256 },
      ...(record.assemblerObject ? [{ path: record.assemblerObject, sha256: record.assemblerObjectSha256 }] : []),
    ];
    if (!record || record.source !== target.source || record.sourceSha256 !== target.sourceSha256
        || policyMatches.length !== 1 || record.sourceClass !== policyMatches[0].class
        || record.sourcePolicyDigest !== policyMatches[0].digest) return false;
    try {
      const representation = textContract.recordsForTarget(target, directory, textLinkContext);
      if (representation.linkEvidence.fullOwnerExact !== true) return false;
      textContract.withSourceObjectProof(directory, target, record, proof => {
        textContract.validateRecords(proof, representation, 'CURRENT proof');
        if (verifiedRecord.representationSha256 !== textContract.representationDigest(proof)) throw new Error('CURRENT representation digest drift');
      });
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
    if (!isDeepStrictEqual(reportIdentity, textContract.readCompactReport(directory).identity)) return false;
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

function validateVerifiedCompanions(build, fresh, verified, output, phase8) {
  const actual = textContract.readCompactReport(output);
  const construction = build?.schemaVersion === 8 && build.status === 'constructed';
  const schema = construction ? 7 : 6;
  if (!phase8 || !isDeepStrictEqual(build, actual.report)
      || !(construction || build.schemaVersion === 7 && build.status === 'pass') || fresh.schemaVersion !== schema || fresh.status !== 'pass'
      || verified.schemaVersion !== schema || verified.status !== 'pass' || verified.output !== '.'
      || verified.verification?.schemaVersion !== schema || verified.verification.status !== 'pass'
      || !isDeepStrictEqual(fresh.buildReport, actual.identity) || !isDeepStrictEqual(verified.buildReport, actual.identity)
      || !construction && !isDeepStrictEqual(build.verification, verified.verification)
      || construction && (build.verification !== undefined || fresh.mode !== 'single-isolated-build'
        || fresh.emptyOutputAtLaunch !== true || !SHA256.test(fresh.inputFingerprint) || !SHA256.test(fresh.baselineFingerprint)
        || !SHA256.test(fresh.outputSealSha256) || fresh.compilerSha256 !== build.compiler.sha256
        || !isDeepStrictEqual(fresh.linkerInputs, build.objects.manifest)
        || fresh.producers !== new Set(phase8.targets.map(target => target.compilationGroup?.id || target.symbol)).size
        || verified.verification.elfRomBinding?.status !== 'pass'
        || verified.verification.elfRomBinding.bytes !== phase8.model.config.rom.bytes
        || !isDeepStrictEqual(verified.verification.decodedDiagnostics, { status: 'not-run', reason: 'raw-exact-with-elf-rom-binding' }))) throw new Error('verified companion schema or build identity drift');
  for (const target of phase8.targets) {
    const count = phase8.targets.length;
    const { replacement, verified: embedded } = textContract.buildTargetRecords(build, target, count, verified.verification);
    const freshRecord = textContract.uniqueReportTarget(fresh.targets, target.symbol, count);
    const verifiedRecord = textContract.uniqueReportTarget(verified.verification.targets, target.symbol, count);
    if (freshRecord.source !== target.source || freshRecord.sourceClass !== replacement.sourceClass || freshRecord.sourceSha256 !== target.sourceSha256
        || freshRecord.sourcePolicyDigest !== replacement.sourcePolicyDigest
        || !isDeepStrictEqual(freshRecord.compilationInput, replacement.compilationInput)
        || !isDeepStrictEqual(textContract.proofDescriptor(freshRecord), textContract.proofDescriptor(replacement))
        || !isDeepStrictEqual(verifiedRecord, embedded)
        || typeof freshRecord.freshRepresentationSha256 !== 'string') throw new Error('verified companion target identity drift');
    textContract.withSourceObjectProof(output, target, replacement, proof => {
      if (proof.linkEvidence.fullOwnerExact !== true
          || verifiedRecord.representationSha256 !== textContract.representationDigest(proof)
          || freshRecord.freshRepresentationSha256 !== textContract.representationDigest(proof, false)) throw new Error('verified companion representation drift');
    });
  }
}
function reusableCurrentState(context, state) {
  const inputs = inputSet.context(context);
  const readJson = file => require('./phase7_conventional').readJson(file, inputs);
  const sha256File = file => require('./phase7_conventional').sha256File(file, inputs);
  try {
    if (![6, 7].includes(state?.schemaVersion) || state.schemaVersion === 7 && state.status !== 'verified'
        || !isDeepStrictEqual(state.buildReport, textContract.readCompactReport(state.output).identity)) return false;
  } catch (_) { return false; }
  if (state?.verifiedAt) {
    try {
      for (const [file, expected] of [[state.verificationReport, state.verificationSha256], [state.freshCompilationReport, state.freshCompilationSha256]]) {
        if (!file || !expected || sha256File(file) !== expected || readJson(file).schemaVersion !== state.schemaVersion || readJson(file).status !== 'pass') return false;
      }
      validateVerifiedCompanions(readJson(path.join(state.output, 'build-report.json')), readJson(state.freshCompilationReport), readJson(state.verificationReport), state.output, context.phase8);
      if (state.schemaVersion === 7 && (readJson(state.freshCompilationReport).inputFingerprint !== state.fingerprint
          || readJson(state.freshCompilationReport).baselineFingerprint !== state.baselineFingerprint)) return false;
    } catch (_) { return false; }
  }
  return Boolean(state && [6, 7].includes(state.schemaVersion)
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
  const inputs = options.inputs;
  const localTools = measure(profile, 'prepare.local-tools', () => resolveLocalTools({ audit: options.audit === true, inputs, readOnly: options.readOnly }));
  const baserom = measure(profile, 'prepare.baserom', () => ensureCanonicalBaserom(localTools, inputs, options.readOnly));
  const phase8 = measure(profile, 'prepare.active-target-model', () => loadActiveTargetModelForContext({
    allowMissingRelocationContracts: options.allowMissingRelocationContracts || [],
    inputs,
  }));
  // The active model already performs a fresh complete accepted-model load.
  // Use that very object rather than parsing/authenticating a second copy.
  const model = phase8.model;
  const baseline = measure(profile, 'prepare.baseline-fingerprint', () => baselineFingerprint(phase8, baserom));
  if (options.contextPreprocessFactory !== undefined && (typeof options.contextPreprocessFactory !== 'function'
      || options.diffPreprocessSymbol !== undefined || options.diffPreprocessSymbols !== undefined)) throw new Error('context preprocessing hook is invalid or conflicts with diff preprocessing');
  const contextPreprocess = options.contextPreprocessFactory?.(phase8.targets);
  if (options.contextPreprocessFactory && (!contextPreprocess || typeof contextPreprocess.preprocess !== 'function'
      || typeof contextPreprocess.finish !== 'function')) throw new Error('context preprocessing hook requires preprocess and finish');
  let diffPreprocess = null;
  if (options.diffPreprocessSymbol !== undefined || options.diffPreprocessSymbols !== undefined) {
    if (options.diffPreprocessSymbol !== undefined && options.diffPreprocessSymbols !== undefined) throw new Error('conflicting diff preprocessing targets');
    const symbols = options.diffPreprocessSymbols || [options.diffPreprocessSymbol];
    if (!Array.isArray(symbols) || !symbols.length || new Set(symbols.map(s => String(s).toLowerCase())).size !== symbols.length) throw new Error('invalid diff preprocessing targets');
    const requested = symbols.map(symbol => {
      const matches = phase8.targets.filter(target => target.symbol.toLowerCase() === String(symbol).toLowerCase());
      if (matches.length !== 1) throw new Error('diff preprocessing target does not resolve uniquely');
      return matches[0];
    });
    // All members of a compilation group share this source; the whole producer
    // therefore stays fresh even when a nonleader member was requested.
    diffPreprocess = require('./diff_preprocess_cache').createDiffPreprocessCache({ requestedSources: [...new Set(requested.map(target => target.source))] });
  }
  let sourcePolicy, current;
  try {
    sourcePolicy = classifyTargetSources(phase8.targets, {
      profile: options.profile, preprocess: contextPreprocess?.preprocess || diffPreprocess?.preprocess, inputs,
    });
    current = measure(profile, 'prepare.current-fingerprint', () => currentFingerprint(phase8, baseline, localTools, sourcePolicy));
  } finally {
    // Private research may reuse authenticated CPP bytes, never classifications.
    // Seal their complete inputs before any prepared context escapes, on errors too.
    contextPreprocess?.finish();
  }
  return inputSet.bind({
    baserom,
    baselineFingerprint: baseline,
    currentFingerprint: current,
    localTools,
    model,
    phase8,
    sourcePolicy,
    ...(diffPreprocess ? { diffPreprocess } : {}),
  }, inputs);
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
  if (!options.forceFresh && reusableCurrentState(context, recorded) && recorded.verifiedAt) {
    return { ...recorded, baseline, reused: true };
  }
  const root = retryRoot(path.join(context.localTools.workRoot, 'current', context.currentFingerprint.slice(0, 24).toLowerCase()));
  const output = path.join(root, 'build');
  ensureDir(root);
  onStep('Compiling and linking CURRENT');
  const execution = runNode('build_phase8_matching_c.js', [
    '--output', output,
    '--phase7-output', baseline.phase7Output,
    '--compiler', context.localTools.compiler,
    ...runtimeArgs(context.localTools),
    ...(options.profile ? ['--profile'] : []),
  ], 'CURRENT build');
  const { report, identity: buildReport } = textContract.readCompactReport(output);
  if (buildReport.sha256 !== executionReportSha256(execution, 'Construction')) throw new Error('construction report differs from executed builder result');
  if (report.schemaVersion !== 8 || report.status !== 'constructed' || report.verification !== undefined) throw new Error('builder did not emit construction-only output');
  const state = {
    schemaVersion: 7,
    status: 'constructed',
    buildReport,
    fingerprint: context.currentFingerprint,
    baselineFingerprint: context.baselineFingerprint,
    createdAt: new Date().toISOString(),
    output,
    report: path.join(output, 'build-report.json'),
    rom: {
      path: path.join(output, 'phase8.us_rev0.z64'),
      bytes: report.outputs.rom.bytes,
      sha256: report.outputs.rom.sha256,
    },
  };
  const result = { ...state, baseline, reused: false };
  freshBuilds.set(result, { buildReport, outputs: outputSeal(output), fingerprint: context.currentFingerprint });
  return result;
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
  const { report: builtReport, identity: buildReportIdentity } = textContract.readCompactReport(build.output);
  if (builtReport.schemaVersion !== 7 || !Array.isArray(builtReport.targetReplacements)) {
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
    const { replacement: builtTarget } = textContract.buildTargetRecords(builtReport, target, context.phase8.targets.length);
    const freshRepresentation = { textContract: compiled.textContract, objectEvidence: compiled.objectEvidence };
    textContract.withSourceObjectProof(build.output, target, builtTarget, proof => {
      textContract.validateRecords(proof, freshRepresentation, 'fresh compilation');
    });
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
      freshRepresentationSha256: textContract.representationDigest(freshRepresentation, false),
      sourceObjectProof: builtTarget.sourceObjectProof,
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
    schemaVersion: 6,
    buildReport: buildReportIdentity,
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
  if (!isDeepStrictEqual(textContract.readCompactReport(build.output).identity, buildReportIdentity)) throw new Error('build report changed during fresh compilation');
  textContract.publishCompactReport(reportFile, report);
  return { report, reportFile };
}

function verifyCurrent(context, options = {}) {
  const profile = options.profile;
  // A verification request needs executing-controller freshness. Build/status
  // may read unchanged acceptance, but disk companions cannot mint a fresh run.
  const build = measure(profile, 'ensure-current', () => ensureCurrentBuild(context, { ...options, forceFresh: true }));
  const session = freshBuilds.get(build);
  if (!session || session.fingerprint !== context.currentFingerprint) throw new Error('fresh build execution is not owned by this controller');
  const reportFile = path.join(path.dirname(build.output), 'verification.json');
  const onStep = options.onStep || (() => {});
  onStep('Verifying ownership, placement, relocations, and exact bytes');
  const verificationExecution = measure(profile, 'verify-current-output', () => runNode('verify_phase8_matching_c.js', [
    '--output', build.output,
    '--compiler', context.localTools.compiler,
    ...runtimeArgs(context.localTools),
    '--report', reportFile,
    ...(profile ? ['--profile'] : []),
  ], 'CURRENT verification'));
  const verifiedReportSha256 = executionReportSha256(verificationExecution, 'Verification');
  const receivedVerification = textContract.readCompactReport(path.dirname(reportFile), path.basename(reportFile));
  if (receivedVerification.identity.sha256 !== verifiedReportSha256) throw new Error('verification report differs from executed verifier result');
  const verification = receivedVerification.report;
  const actualBuild = textContract.readCompactReport(build.output);
  const targets = context.phase8.targets.map(target => {
    const { replacement } = textContract.buildTargetRecords(actualBuild.report, target, context.phase8.targets.length, verification.verification);
    let freshRepresentationSha256;
    textContract.withSourceObjectProof(build.output, target, replacement, proof => {
      freshRepresentationSha256 = textContract.representationDigest(proof, false);
    });
    return { symbol: target.symbol, source: target.source, sourceSha256: target.sourceSha256,
      sourceClass: replacement.sourceClass, sourcePolicyDigest: replacement.sourcePolicyDigest,
      compilationInput: replacement.compilationInput, sourceObjectProof: replacement.sourceObjectProof,
      freshRepresentationSha256, objectSha256: replacement.cObjectSha256,
      compilerAssemblySha256: replacement.compilerAssemblySha256, compilerAssemblyRewritten: false };
  });
  const freshReport = { schemaVersion: 7, status: 'pass', mode: 'single-isolated-build',
    buildReport: actualBuild.identity, compilerSha256: context.phase8.config.compiler.executableSha256,
    inputFingerprint: context.currentFingerprint, baselineFingerprint: context.baselineFingerprint,
    outputSealSha256: sha256Value(session.outputs), emptyOutputAtLaunch: true,
    linkerInputs: actualBuild.report.objects.manifest,
    producers: new Set(context.phase8.targets.map(target => target.compilationGroup?.id || target.symbol)).size,
    targets };
  const freshFile = path.join(path.dirname(build.output), 'fresh-compilation.json');
  const freshCompilation = { report: freshReport, reportFile: freshFile };
  validateVerifiedCompanions(actualBuild.report, freshCompilation.report, verification, build.output, context.phase8);
  if (!isDeepStrictEqual(session.buildReport, actualBuild.identity)) throw new Error('fresh construction changed before verified state');
  const finalContext = measure(profile, 'final-input-seal', () => prepareContext());
  if (finalContext.currentFingerprint !== context.currentFingerprint || finalContext.baselineFingerprint !== context.baselineFingerprint) throw new Error('fresh build inputs changed before publication');
  measure(profile, 'final-tool-authentication', () => verifyRuntimeTools(context.phase8.model, context.localTools));
  if (!isDeepStrictEqual(session.outputs, measure(profile, 'final-output-seal', () => outputSeal(build.output)))) throw new Error('fresh output changed before verified state');
  freshBuilds.delete(build);
  textContract.publishCompactReport(freshFile, freshReport);
  textContract.publishCompactReport(path.join(build.output, 'verification.json'), verification);
  textContract.publishCompactReport(path.join(build.output, 'fresh-compilation.json'), freshReport);
  freshCompilation.reportFile = path.join(build.output, 'fresh-compilation.json');
  const publishedFresh = textContract.readCompactReport(build.output, 'fresh-compilation.json');
  if (!isDeepStrictEqual(publishedFresh.report, freshReport)
      || textContract.readCompactReport(build.output, 'verification.json').identity.sha256 !== verifiedReportSha256) throw new Error('verified companion changed before publication');
  const sourcePolicy = measure(profile, 'source-policy-report', () => classifyActiveTargets(context.phase8, context.sourcePolicy));
  const state = {
    ...build,
    schemaVersion: 7,
    status: 'verified',
    buildReport: actualBuild.identity,
    verifiedAt: new Date().toISOString(),
    verificationReport: path.join(build.output, 'verification.json'),
    freshCompilationReport: path.join(build.output, 'fresh-compilation.json'),
    freshCompilationSha256: publishedFresh.identity.sha256,
    verificationSha256: verifiedReportSha256,
    sourcePolicyReport: SOURCE_POLICY_REPORT_PATH,
  };
  textContract.publishCompactReport(CURRENT_STATE_PATH, state);
  return { build, freshCompilation, sourcePolicy, verification };
}

function currentVerificationState(context) {
  const inputs = inputSet.context(context);
  const readJson = file => require('./phase7_conventional').readJson(file, inputs);
  const sha256File = file => require('./phase7_conventional').sha256File(file, inputs);
  const state = inputs ? readJson(CURRENT_STATE_PATH) : existingState(CURRENT_STATE_PATH);
  if (!reusableCurrentState(context, state) || !state.verifiedAt) {
    if (inputs) throw new Error('selected accepted CURRENT/companions are not current for these inputs');
    return { exact: false, state };
  }
  try {
    for (const [file, expected] of [[state.verificationReport, state.verificationSha256], [state.freshCompilationReport, state.freshCompilationSha256]]) {
      if (!file || !expected || sha256File(file) !== expected || readJson(file).schemaVersion !== state.schemaVersion) return { exact: false, state };
    }
  } catch (error) { inputSet.rethrow(error, inputs); return { exact: false, state }; }
  const rom = path.join(state.output, 'phase8.us_rev0.z64');
  const exact = fs.existsSync(rom) && fs.statSync(rom).size === context.model.config.rom.bytes
    && sha256File(rom) === context.model.config.rom.sha256;
  if (inputs && !exact) throw new Error('selected accepted ROM is not exact');
  return { exact, state };
}

module.exports = {
  executionReportSha256,
  outputSeal,
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
