'use strict';

const fs = require('fs');
const path = require('path');
const {
  ROOT,
  elfSectionBytes,
  parseElfFile,
  sha256Buffer,
  sha256File,
} = require('../phase7_conventional');
const {
  compileTarget,
  verifyCompiler,
  verifyRuntimeTools,
} = require('../phase8_matching_c');
const {
  classifySource,
  resolvePreprocessor,
} = require('../source_policy');
const { prepareContext, writeJson } = require('../current_workflow');
const { compareMips } = require('./mips_analysis');
const { canonicalJson, digest, targetRecord } = require('./target_model');
const { requestStore } = require('./store');

const MATCHING_ROOT = path.join(ROOT, 'build', 'matching');

function compileArtifactDirectory(runId) {
  // Keep transient compiler paths independent of the target symbol. The
  // accepted legacy Windows cc1 cannot create outputs beyond MAX_PATH, and a
  // target-symbol directory plus a symbol-named assembly file duplicated long
  // names in the old build/matching/targets/<symbol>/runs/<run> layout.
  return path.join(MATCHING_ROOT, 'runs', runId);
}

function relative(file) {
  const value = path.relative(ROOT, file).replace(/\\/g, '/');
  if (!value || value === '..' || value.startsWith('../')) throw new Error(`matching candidate escapes repository: ${file}`);
  return value;
}

function ensureDirectory(directory) {
  fs.mkdirSync(directory, { recursive: true });
}

function sourceSnapshot(target, sourceText, candidateId) {
  const directory = path.join(MATCHING_ROOT, 'targets', target.symbol, 'candidates');
  ensureDirectory(directory);
  const file = path.join(directory, `${candidateId}.c`);
  if (fs.existsSync(file) && fs.readFileSync(file, 'utf8') !== sourceText) throw new Error(`candidate snapshot identity conflict: ${file}`);
  if (!fs.existsSync(file)) fs.writeFileSync(file, sourceText, 'utf8');
  return file;
}

function candidateRecord(target, sourceText, options = {}) {
  const sourceSha256 = sha256Buffer(Buffer.from(sourceText, 'utf8'));
  const candidateIdentity = {
    schemaVersion: 2,
    targetId: target.targetId,
    sourceSha256,
    sourceText,
  };
  const candidateId = digest(candidateIdentity);
  const observationIdentity = {
    schemaVersion: 1,
    candidateId,
    origin: options.origin || 'manual-scratch',
    variant: options.variant || null,
    parentCandidateId: options.parentCandidateId || null,
    metadata: options.metadata || {},
  };
  return {
    candidateId,
    observationId: digest(observationIdentity),
    targetId: target.targetId,
    sourceSha256,
    sourceText,
    origin: observationIdentity.origin,
    variant: observationIdentity.variant,
    parentCandidateId: observationIdentity.parentCandidateId,
    metadata: observationIdentity.metadata,
    createdAt: options.createdAt || new Date().toISOString(),
  };
}

function syncTargets(workbench, storeOptions = {}, options = {}) {
  const observedAt = new Date().toISOString();
  return requestStore({
    action: 'sync_targets',
    modelId: workbench.modelId,
    modelManifest: workbench.modelManifest,
    targetCount: workbench.targets.length,
    force: options.force === true,
    records: workbench.targets.map((target) => targetRecord(target, observedAt)),
  }, storeOptions);
}

function prepareCompilerSession(options = {}) {
  const context = options.context || prepareContext();
  const runtimeOptions = {
    powershellRuntimeRoot: context.localTools.powershellRuntimeRoot,
    splatPython: context.localTools.splatPython,
    splatSplit: context.localTools.splatSplit,
    asmDifferRoot: context.localTools.asmDifferRoot,
  };
  const runtime = verifyRuntimeTools(context.phase8.model, runtimeOptions);
  verifyCompiler(context.phase8, context.localTools.compiler);
  const preprocessor = resolvePreprocessor();
  const tool = {
    schemaVersion: 1,
    compilerSha256: sha256File(context.localTools.compiler),
    compilerFlags: context.phase8.config.compiler.compileFlags,
    assembler: context.phase8.toolchain.identity,
    sourcePolicyPreprocessorSha256: preprocessor.sha256,
    workbenchCompilerContract: 2,
  };
  return { context, runtime, preprocessor, tool, toolId: digest(tool) };
}

function recordCandidate(workbench, target, sourceText, options = {}) {
  const storeOptions = options.storeOptions || {};
  if (options.syncTargets !== false) syncTargets(workbench, storeOptions);
  const candidate = candidateRecord(target, sourceText, options);
  requestStore({ action: 'put_candidate', record: candidate }, storeOptions);
  const sourceFile = sourceSnapshot(target, sourceText, candidate.candidateId);
  return { candidate, sourceFile };
}

function compileCandidate(workbench, target, sourceText, options = {}) {
  const storeOptions = options.storeOptions || {};
  const { candidate, sourceFile } = recordCandidate(workbench, target, sourceText, options);
  const session = options.session || prepareCompilerSession(options);
  const cacheKey = digest({
    schemaVersion: 1,
    candidateId: candidate.candidateId,
    targetId: target.targetId,
    toolId: session.toolId,
  });
  const cached = requestStore({ action: 'query', name: 'compile_by_cache', args: { cacheKey } }, storeOptions);
  if (cached && (cached.candidate_id !== candidate.candidateId || canonicalJson(cached.tool) !== canonicalJson(session.tool))) {
    throw new Error(`compile cache digest collision for ${candidate.candidateId}`);
  }
  if (cached && cached.status === 'compiled') {
    const comparison = requestStore({ action: 'query', name: 'comparison_for_run', args: { runId: cached.run_id } }, storeOptions);
    if (!comparison) throw new Error(`compiled cache entry is incomplete: ${cached.run_id}`);
    return { candidate, compile: cached, comparison, cached: true };
  }
  // Successful work is reused by cache key. Failed attempts are retried and
  // retain distinct run identities so a repaired host/tool path is not pinned
  // to an old environmental failure.
  const attemptStartedAt = new Date().toISOString();
  const runId = digest({ cacheKey, kind: 'compile-run', attemptStartedAt });
  const artifactDir = compileArtifactDirectory(runId);
  ensureDirectory(artifactDir);
  const started = Date.now();
  const targetForCompile = {
    symbol: target.symbol,
    source: relative(sourceFile),
    sourceSha256: candidate.sourceSha256,
    bytes: target.bytes,
    sectionName: target.sectionName,
    expectedRelocations: [],
  };
  const classification = {
    symbol: target.symbol,
    bytes: target.bytes,
    ...classifySource(targetForCompile.source, { preprocessor: session.preprocessor }),
  };
  let compileRecord;
  let comparisonRecord = null;
  try {
    const phase8 = { ...session.context.phase8, targets: [targetForCompile] };
    const result = compileTarget(
      phase8,
      targetForCompile,
      artifactDir,
      session.context.localTools.compiler,
      session.runtime.tools['mips-kmc-elf-as.exe'].path,
      session.runtime.tools['mips-kmc-elf-objcopy.exe'].path,
      {
        enforceAcceptedContract: false,
        allowAuxiliaryReadOnlySections: true,
        legalizeCop1BinaryInstructions: true,
        classification,
      },
    );
    const proofObject = path.join(artifactDir, ...result.proofObjectRelative.split('/'));
    const elf = parseElfFile(proofObject);
    const section = elf.sections.find((item) => item.name === target.sectionName);
    if (!section) throw new Error('scratch object target section is missing');
    const objectText = Buffer.from(elfSectionBytes(elf, section));
    compileRecord = {
      runId,
      candidateId: candidate.candidateId,
      cacheKey,
      status: 'compiled',
      sourceClass: classification.class,
      objectText: objectText.toString('base64'),
      relocations: result.relocations,
      artifactDir: relative(artifactDir),
      stdout: '',
      stderr: '',
      durationMs: Date.now() - started,
      tool: session.tool,
      createdAt: attemptStartedAt,
    };
    const comparison = compareMips(target.expectedBytes, objectText, {
      start: target.vramStart,
      relocations: result.relocations,
    });
    comparisonRecord = {
      comparisonId: digest({ runId, comparison }),
      runId,
      primaryClass: comparison.primaryClass,
      exactBytes: comparison.exactBytes,
      relocationMaskedExact: comparison.relocationMaskedExact,
      score: comparison.score,
      details: comparison,
      createdAt: new Date().toISOString(),
    };
    writeJson(path.join(artifactDir, 'workbench-report.json'), {
      schemaVersion: 1,
      target: { symbol: target.symbol, targetId: target.targetId, expectedBytesSha256: target.expectedBytesSha256 },
      candidate: { ...candidate, sourceText: undefined },
      compile: compileRecord,
      comparison,
      caveat: result.relocations.length > 0
        ? 'Relocation-bearing scratch objects are diagnostic only; canonical linking is required for exactness.'
        : 'Exact scratch bytes still require canonical ownership and full-ROM verification.',
    });
  } catch (error) {
    compileRecord = {
      runId,
      candidateId: candidate.candidateId,
      cacheKey,
      status: 'failed',
      sourceClass: classification.class,
      objectText: null,
      relocations: null,
      artifactDir: relative(artifactDir),
      stdout: '',
      stderr: error.message,
      durationMs: Date.now() - started,
      tool: session.tool,
      createdAt: attemptStartedAt,
    };
    writeJson(path.join(artifactDir, 'workbench-report.json'), {
      schemaVersion: 1,
      target: { symbol: target.symbol, targetId: target.targetId },
      candidate: { ...candidate, sourceText: undefined },
      compile: compileRecord,
    });
  }
  const stored = requestStore({
    action: 'put_compile_result',
    compile: compileRecord,
    comparison: comparisonRecord,
  }, storeOptions);
  return { candidate, compile: stored.run, comparison: stored.comparison, cached: stored.cached };
}

module.exports = {
  MATCHING_ROOT,
  candidateRecord,
  compileArtifactDirectory,
  compileCandidate,
  prepareCompilerSession,
  recordCandidate,
  sourceSnapshot,
  syncTargets,
};
