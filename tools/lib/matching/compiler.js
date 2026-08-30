'use strict';

const fs = require('fs');
const path = require('path');
const {
  ROOT,
  elfSectionBytes,
  parseElfFile,
  run,
  sha256Buffer,
  sha256File,
} = require('../phase7_conventional');
const {
  adjustSectionAssembly,
  relocationRecords,
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
const SCRATCH_TEXT_TAIL_ALIGNMENT_LIMIT = 12;

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
    workbenchCompilerContract: 4,
  };
  return { context, runtime, preprocessor, tool, toolId: digest(tool) };
}

function scratchSectionEvidence(section) {
  return {
    name: section.name,
    index: section.index,
    type: section.type,
    flags: section.flags,
    alignment: section.alignment,
    bytes: section.size,
  };
}

function compileScratchCandidate({ session, target, sourceFile, artifactDir }) {
  if (!session || !session.context || !session.runtime || !target
      || typeof target.symbol !== 'string' || typeof target.sectionName !== 'string'
      || typeof sourceFile !== 'string' || typeof artifactDir !== 'string') {
    throw new Error('scratch candidate compiler inputs are malformed');
  }
  ensureDirectory(artifactDir);
  const compilerAssembly = path.join(artifactDir, 'candidate.compiler.s');
  const adjustedAssembly = path.join(artifactDir, 'candidate.s');
  const objectFile = path.join(artifactDir, 'candidate.o');
  const compilerArgs = [
    ...session.context.phase8.config.compiler.compileFlags,
    '-o',
    compilerAssembly,
    relative(sourceFile),
  ];
  const compilerResult = run(session.context.localTools.compiler, compilerArgs, { cwd: ROOT });
  const compilerBytes = fs.readFileSync(compilerAssembly);
  const adjustedBytes = adjustSectionAssembly(compilerBytes, target.sectionName, {
    allowAuxiliaryReadOnlySections: true,
    legalizeCop1BinaryInstructions: true,
  });
  fs.writeFileSync(adjustedAssembly, adjustedBytes);
  const assembler = session.runtime.tools['mips-kmc-elf-as.exe'].path;
  const assemblerArgs = [
    ...session.context.phase8.model.config.binutils.compilerAssemblerFlags,
    '-o',
    objectFile,
    adjustedAssembly,
  ];
  const assemblerResult = run(assembler, assemblerArgs, { cwd: artifactDir });
  const elf = parseElfFile(objectFile);

  const textSections = elf.sections.filter((section) => section.name === target.sectionName);
  if (textSections.length !== 1) throw new Error('scratch object target section count is not one');
  const textSection = textSections[0];
  if (textSection.type !== 1 || (textSection.flags & 6) !== 6 || (textSection.flags & 1) !== 0) {
    throw new Error('scratch object target section is not executable nonwritable PROGBITS');
  }
  const executableSections = elf.sections.filter((section) => section.size > 0 && (section.flags & 4) !== 0);
  if (executableSections.length !== 1 || executableSections[0].index !== textSection.index) {
    throw new Error('scratch object must own exactly one nonempty executable section');
  }
  const sectionFunctions = elf.symbols.filter((symbol) => (
    symbol.sectionIndex === textSection.index && symbol.symbolType === 2
  ));
  if (sectionFunctions.length !== 1) {
    throw new Error(`scratch object target section must contain exactly one function symbol; found ${sectionFunctions.length}`);
  }
  const primary = sectionFunctions[0];
  if (primary.name !== target.symbol || primary.value !== 0 || primary.binding !== 1
      || primary.visibility !== 0 || !Number.isInteger(primary.size) || primary.size <= 0
      || primary.size % 4 !== 0 || primary.size > textSection.size) {
    throw new Error(`scratch object requested global function symbol is malformed: ${target.symbol}`);
  }

  const textSectionBytes = Buffer.from(elfSectionBytes(elf, textSection));
  const objectText = Buffer.from(textSectionBytes.subarray(0, primary.size));
  const tail = Buffer.from(textSectionBytes.subarray(primary.size));
  if (tail.length % 4 !== 0 || tail.length > SCRATCH_TEXT_TAIL_ALIGNMENT_LIMIT || tail.some((byte) => byte !== 0)) {
    throw new Error(`scratch object owns executable bytes outside the primary function: ${target.symbol}`);
  }

  const writableSections = elf.sections.filter((section) => section.size > 0 && (section.flags & 1) !== 0);
  if (writableSections.length > 0) {
    throw new Error(`scratch object unexpectedly owns writable bytes: ${writableSections[0].name}`);
  }
  for (const name of ['.data', '.bss', '.sdata', '.sbss']) {
    const owned = elf.sections.filter((section) => section.name === name && section.size > 0);
    if (owned.length > 0) throw new Error(`scratch object unexpectedly owns ${name} bytes: ${target.symbol}`);
  }
  const rodataSections = elf.sections.filter((section) => section.name === '.rodata' && section.size > 0);
  if (rodataSections.length > 1) throw new Error('scratch object has multiple .rodata sections');
  if (rodataSections.some((section) => section.type !== 1 || section.flags !== 2)) {
    throw new Error('scratch object .rodata is not read-only allocated PROGBITS');
  }
  const reginfoSections = elf.sections.filter((section) => section.name === '.reginfo' && section.size > 0);
  if (reginfoSections.length > 1
      || reginfoSections.some((section) => section.type !== 0x70000006 || section.flags !== 2)) {
    throw new Error('scratch object .reginfo shape is malformed');
  }
  const allowedAllocatedIndexes = new Set([
    textSection.index,
    ...rodataSections.map((section) => section.index),
    ...reginfoSections.map((section) => section.index),
  ]);
  const unexpectedAllocated = elf.sections.filter((section) => (
    section.size > 0 && (section.flags & 2) !== 0 && !allowedAllocatedIndexes.has(section.index)
  ));
  if (unexpectedAllocated.length > 0) {
    throw new Error(`scratch object owns an unexpected allocated section: ${unexpectedAllocated[0].name}`);
  }

  const relocationTarget = {
    symbol: target.symbol,
    bytes: primary.size,
    sectionName: target.sectionName,
    compilerTextFunctions: [{ symbol: target.symbol, offsetNumber: 0 }],
    auxiliarySections: rodataSections.length === 1
      ? [{ compilerSection: '.rodata', outputSection: '.rodata' }]
      : [],
  };
  const relocations = relocationRecords(elf, relocationTarget);
  for (const relocation of relocations) {
    const offset = typeof relocation.offset === 'string'
      ? Number.parseInt(relocation.offset, 16)
      : relocation.offset;
    if (!Number.isInteger(offset) || offset < 0 || offset % 4 !== 0 || offset + 4 > primary.size) {
      throw new Error(`scratch object relocation escapes the primary function: ${target.symbol}`);
    }
  }
  const rodata = rodataSections.length === 1 ? rodataSections[0] : null;
  const rodataRelocationSection = rodata
    ? elf.sections.find((section) => section.name === '.rel.rodata')
    : null;
  const scratchContract = {
    schemaVersion: 1,
    kind: 'single-function-scratch-object',
    primarySymbol: {
      name: primary.name,
      value: primary.value,
      bytes: primary.size,
      binding: 'GLOBAL',
      visibility: 'DEFAULT',
      symbolType: 'STT_FUNC',
    },
    textSection: {
      ...scratchSectionEvidence(textSection),
      functionBytes: objectText.length,
      functionSha256: sha256Buffer(objectText),
      trailingAlignmentBytes: tail.length,
      trailingAlignmentSha256: sha256Buffer(tail),
      trailingAlignmentLimit: SCRATCH_TEXT_TAIL_ALIGNMENT_LIMIT,
    },
    readOnlyData: rodata ? {
      ...scratchSectionEvidence(rodata),
      sha256: sha256Buffer(Buffer.from(elfSectionBytes(elf, rodata))),
      relocationEntries: rodataRelocationSection ? rodataRelocationSection.size / 8 : 0,
    } : null,
    allocatedSections: elf.sections
      .filter((section) => section.size > 0 && (section.flags & 2) !== 0)
      .map(scratchSectionEvidence),
    textRelocations: relocations,
    commands: {
      compiler: { executable: session.context.localTools.compiler, args: compilerArgs, cwd: ROOT },
      assembler: { executable: assembler, args: assemblerArgs, cwd: artifactDir },
    },
    artifacts: {
      compilerAssembly: relative(compilerAssembly),
      adjustedAssembly: relative(adjustedAssembly),
      object: relative(objectFile),
      objectSha256: sha256File(objectFile),
    },
  };
  return {
    objectText,
    relocations,
    scratchContract,
    stdout: [compilerResult.stdout, assemblerResult.stdout].filter(Boolean).join('\n'),
    stderr: [compilerResult.stderr, assemblerResult.stderr].filter(Boolean).join('\n'),
  };
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
    const result = compileScratchCandidate({ session, target, sourceFile, artifactDir });
    const objectText = result.objectText;
    compileRecord = {
      runId,
      candidateId: candidate.candidateId,
      cacheKey,
      status: 'compiled',
      sourceClass: classification.class,
      objectText: objectText.toString('base64'),
      relocations: result.relocations,
      artifactDir: relative(artifactDir),
      stdout: result.stdout,
      stderr: result.stderr,
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
      scratchContract: result.scratchContract,
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
  compileScratchCandidate,
  prepareCompilerSession,
  recordCandidate,
  sourceSnapshot,
  syncTargets,
};
