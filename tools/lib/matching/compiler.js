'use strict';

const crypto = require('crypto');
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
const {
  compareCandidateDiagnostic,
  comparisonIsCurrent,
  prepareTargetDiagnostic,
} = require('./diagnostic_link');
const { canonicalJson, digest, targetRecord } = require('./target_model');
const { requestStore } = require('./store');

const MATCHING_ROOT = path.join(ROOT, 'build', 'matching');
const SCRATCH_TEXT_TAIL_ALIGNMENT_LIMIT = 12;

function compileArtifactDirectory(runId, matchingRoot = MATCHING_ROOT) {
  // Keep transient compiler paths independent of the target symbol. The
  // accepted legacy Windows cc1 cannot create outputs beyond MAX_PATH, and a
  // target-symbol directory plus a symbol-named assembly file duplicated long
  // names in the old build/matching/targets/<symbol>/runs/<run> layout.
  return path.join(matchingRoot, 'runs', runId);
}

function relative(file) {
  const value = path.relative(ROOT, file).replace(/\\/g, '/');
  if (!value || value === '..' || value.startsWith('../')) throw new Error(`matching candidate escapes repository: ${file}`);
  return value;
}

function ensureDirectory(directory) {
  fs.mkdirSync(directory, { recursive: true });
}

function sourceSnapshot(target, sourceText, candidateId, matchingRoot = MATCHING_ROOT) {
  if (typeof target.symbol !== 'string' || target.symbol === '.' || target.symbol === '..'
      || !/^[A-Za-z0-9_.$]+$/.test(target.symbol)
      || typeof candidateId !== 'string' || !/^[A-F0-9]{64}$/i.test(candidateId)) {
    throw new Error('candidate snapshot identity is unsafe');
  }
  const root = ensurePlainMatchingRoot(matchingRoot);
  const targets = ensurePlainChildDirectory(root, 'targets', 'matching targets directory');
  const symbol = ensurePlainChildDirectory(targets, target.symbol, 'matching target directory');
  const directory = ensurePlainChildDirectory(symbol, 'candidates', 'matching candidates directory');
  const file = path.join(directory, `${candidateId}.c`);
  if (fs.existsSync(file)) {
    assertPlainChildFile(file, directory, 'candidate snapshot');
    if (fs.readFileSync(file, 'utf8') !== sourceText) throw new Error(`candidate snapshot identity conflict: ${file}`);
  } else {
    try {
      fs.writeFileSync(file, sourceText, { encoding: 'utf8', flag: 'wx' });
    } catch (error) {
      if (error.code !== 'EEXIST') throw error;
      assertPlainChildFile(file, directory, 'candidate snapshot');
      if (fs.readFileSync(file, 'utf8') !== sourceText) throw new Error(`candidate snapshot identity conflict: ${file}`);
    }
    assertPlainChildFile(file, directory, 'candidate snapshot');
  }
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
    workbenchCompilerContract: 6,
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

function scratchSymbolEvidence(symbol, elf) {
  const specialSection = {
    0: 'SHN_UNDEF',
    0xFFF1: 'SHN_ABS',
    0xFFF2: 'SHN_COMMON',
  }[symbol.sectionIndex];
  return {
    name: symbol.name,
    value: symbol.value,
    bytes: symbol.size,
    binding: symbol.binding,
    symbolType: symbol.symbolType,
    visibility: symbol.visibility,
    sectionIndex: symbol.sectionIndex,
    section: specialSection || elf.sections[symbol.sectionIndex]?.name || '<invalid-section>',
  };
}

function validateScratchSymbolOwnership(elf, textSection, rodataSections, reginfoSections, primary) {
  const rodataIndexes = new Set(rodataSections.map((section) => section.index));
  const allowedSectionIndexes = new Set([
    textSection.index,
    ...rodataIndexes,
    ...reginfoSections.map((section) => section.index),
  ]);
  const owned = [];
  for (const symbol of elf.symbols) {
    if (symbol === primary || symbol.sectionIndex === 0) continue;
    const evidence = scratchSymbolEvidence(symbol, elf);
    if (symbol.symbolType === 4 && symbol.binding === 0 && symbol.sectionIndex === 0xFFF1) {
      continue;
    }
    const referencedSection = elf.sections[symbol.sectionIndex];
    if (symbol.symbolType === 3 && symbol.binding === 0
        && (allowedSectionIndexes.has(symbol.sectionIndex) || referencedSection?.size === 0
          || (referencedSection && (referencedSection.flags & 2) === 0))) {
      continue;
    }
    if (symbol.sectionIndex === textSection.index && symbol.binding === 0 && symbol.symbolType === 0
        && symbol.size === 0 && symbol.value >= 0 && symbol.value <= textSection.size) {
      owned.push(evidence);
      continue;
    }
    const markerSection = elf.sections[symbol.sectionIndex];
    if (symbol.name === 'gcc2_compiled.' && markerSection?.name === '.text'
        && markerSection.type === 1 && markerSection.flags === 6 && markerSection.size === 0
        && symbol.binding === 0 && symbol.symbolType === 1 && symbol.size === 0 && symbol.value === 0) {
      owned.push(evidence);
      continue;
    }
    const rodata = rodataSections.find((section) => section.index === symbol.sectionIndex);
    if (rodata && symbol.binding === 0 && (symbol.symbolType === 0 || symbol.symbolType === 1)
        && symbol.value >= 0 && symbol.size >= 0 && symbol.value + symbol.size <= rodata.size) {
      owned.push(evidence);
      continue;
    }
    throw new Error(`scratch object has unexpected symbol ownership: ${symbol.name || '<anonymous>'} (${evidence.section})`);
  }
  return owned;
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
  const ownedDataAndLabels = validateScratchSymbolOwnership(
    elf,
    textSection,
    rodataSections,
    reginfoSections,
    primary,
  );

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
    ownedDataAndLabels: {
      count: ownedDataAndLabels.length,
      samples: ownedDataAndLabels.slice(0, 16),
      omitted: Math.max(0, ownedDataAndLabels.length - 16),
    },
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
  (options.storeRequest || requestStore)({ action: 'put_candidate', record: candidate }, storeOptions);
  const sourceFile = sourceSnapshot(target, sourceText, candidate.candidateId, options.matchingRoot || MATCHING_ROOT);
  return { candidate, sourceFile };
}

function acceptedExpectedRelocationEvidence(session, target) {
  const acceptedTargets = session?.context?.phase8?.targets;
  if (!Array.isArray(acceptedTargets)) {
    return { available: false, records: null, reason: 'accepted phase8 target census is unavailable' };
  }
  const symbolMatches = acceptedTargets.filter((candidate) => (
    typeof candidate.symbol === 'string'
      && candidate.symbol.toLowerCase() === target.symbol.toLowerCase()
  ));
  const identityMatches = symbolMatches.filter((candidate) => (
    candidate.bytes === target.bytes
      && candidate.romStartNumber === target.romStart
      && candidate.vramStartNumber === target.vramStart
  ));
  if (identityMatches.length !== 1) {
    const reason = symbolMatches.length === 0
      ? 'target is not an accepted phase8 C target'
      : `accepted phase8 target identity is ${identityMatches.length === 0 ? 'incompatible' : 'ambiguous'}`;
    return { available: false, records: null, reason };
  }
  if (!Array.isArray(identityMatches[0].expectedRelocations)) {
    return { available: false, records: null, reason: 'accepted phase8 relocation contract is malformed' };
  }
  return {
    available: true,
    records: identityMatches[0].expectedRelocations,
    reason: null,
  };
}

function makeComparisonRecord(runId, comparison) {
  return {
    comparisonId: digest({ runId, comparison }),
    runId,
    primaryClass: comparison.primaryClass,
    exactBytes: comparison.exactBytes,
    relocationMaskedExact: comparison.relocationMaskedExact,
    score: comparison.score,
    details: comparison,
    createdAt: new Date().toISOString(),
  };
}

function compileAttemptIdentity(cacheKey, attemptStartedAt, nonce = crypto.randomBytes(32).toString('hex')) {
  return digest({ cacheKey, kind: 'compile-run', attemptStartedAt, nonce });
}

function plainDirectory(directory, label) {
  const stat = fs.lstatSync(directory);
  if (!stat.isDirectory() || stat.isSymbolicLink()) {
    throw new Error(`${label} is not a plain directory`);
  }
}

function realRepositoryContained(candidate, label, allowRoot = false) {
  const realRepository = fs.realpathSync(ROOT);
  const realCandidate = fs.realpathSync(candidate);
  const relation = path.relative(realRepository, realCandidate);
  if ((!allowRoot && !relation) || relation === '..' || relation.startsWith(`..${path.sep}`)
      || path.isAbsolute(relation)) {
    throw new Error(`${label} escapes the real repository root`);
  }
  return realCandidate;
}

function ensurePlainMatchingRoot(matchingRoot, create = true) {
  const root = path.resolve(matchingRoot);
  if (!fs.existsSync(root)) {
    if (!create) throw new Error('matching artifact root is missing');
    const parent = path.dirname(root);
    plainDirectory(parent, 'matching artifact parent');
    realRepositoryContained(parent, 'matching artifact parent', true);
    fs.mkdirSync(root);
  }
  plainDirectory(root, 'matching artifact root');
  realRepositoryContained(root, 'matching artifact root');
  return root;
}

function ensurePlainChildDirectory(parent, name, label) {
  plainDirectory(parent, `${label} parent`);
  const directory = path.join(parent, name);
  if (!fs.existsSync(directory)) {
    try {
      fs.mkdirSync(directory);
    } catch (error) {
      if (error.code !== 'EEXIST') throw error;
    }
  }
  plainDirectory(directory, label);
  if (path.dirname(fs.realpathSync(directory)) !== fs.realpathSync(parent)) {
    throw new Error(`${label} escapes its real parent`);
  }
  return directory;
}

function assertPlainChildFile(file, parent, label) {
  const stat = fs.lstatSync(file);
  if (!stat.isFile() || stat.isSymbolicLink() || stat.nlink !== 1
      || path.dirname(fs.realpathSync(file)) !== fs.realpathSync(parent)) {
    throw new Error(`${label} is not a plain contained file`);
  }
}

function resolveRunArtifactDirectory(run, matchingRoot = MATCHING_ROOT) {
  const relativeDirectory = run.artifact_dir || run.artifactDir;
  if (typeof relativeDirectory !== 'string' || !relativeDirectory || path.isAbsolute(relativeDirectory)) {
    throw new Error('cached compilation artifact directory is malformed');
  }
  if (typeof run.run_id !== 'string' || !/^[A-F0-9]{64}$/i.test(run.run_id)) {
    throw new Error('cached compilation run identity is malformed');
  }
  const directory = path.resolve(ROOT, ...relativeDirectory.replace(/\\/g, '/').split('/'));
  const root = ensurePlainMatchingRoot(matchingRoot, false);
  const expected = path.resolve(compileArtifactDirectory(run.run_id, root));
  if (directory !== expected) {
    throw new Error('cached compilation artifact directory is not the authenticated run directory');
  }
  plainDirectory(path.join(root, 'runs'), 'matching runs directory');
  plainDirectory(directory, 'cached compilation artifact directory');
  const realRoot = fs.realpathSync(root);
  const realDirectory = fs.realpathSync(directory);
  if (path.relative(realRoot, realDirectory) !== path.join('runs', run.run_id)) {
    throw new Error('cached compilation artifact directory escapes its real matching root');
  }
  return directory;
}

function authenticateFreshRunArtifactDirectory(runId, matchingRoot = MATCHING_ROOT) {
  if (typeof runId !== 'string' || !/^[A-F0-9]{64}$/i.test(runId)) {
    throw new Error('fresh compilation run identity is malformed');
  }
  const root = ensurePlainMatchingRoot(matchingRoot);
  const runs = ensurePlainChildDirectory(root, 'runs', 'matching runs directory');
  const directory = path.join(runs, runId);
  try {
    fs.mkdirSync(directory);
  } catch (error) {
    if (error.code === 'EEXIST') {
      throw new Error(`fresh compilation artifact directory already exists: ${runId}`);
    }
    throw error;
  }
  plainDirectory(directory, 'fresh compilation artifact directory');
  if (path.dirname(fs.realpathSync(directory)) !== fs.realpathSync(runs)) {
    throw new Error('fresh compilation artifact directory escapes its real runs directory');
  }
  return resolveRunArtifactDirectory({
    run_id: runId,
    artifact_dir: relative(directory),
  }, root);
}

function assertPlainRunOutput(file, directory) {
  if (!fs.existsSync(file)) return;
  const stat = fs.lstatSync(file);
  if (!stat.isFile() || stat.isSymbolicLink() || stat.nlink !== 1
      || path.dirname(fs.realpathSync(file)) !== fs.realpathSync(directory)) {
    throw new Error('cached diagnostic report is not a plain run artifact');
  }
}

function writeUniqueRunJson(file, value, directory) {
  const encoded = `${JSON.stringify(value, null, 2)}\n`;
  try {
    fs.writeFileSync(file, encoded, { encoding: 'utf8', flag: 'wx' });
  } catch (error) {
    if (error.code !== 'EEXIST') throw error;
    assertPlainRunOutput(file, directory);
    if (fs.readFileSync(file, 'utf8') !== encoded) {
      throw new Error(`conflicting diagnostic report identity: ${file}`);
    }
  }
  assertPlainRunOutput(file, directory);
}

function candidateArtifactFromScratch(result) {
  const record = result?.scratchContract?.artifacts;
  if (!record || typeof record.object !== 'string' || typeof record.objectSha256 !== 'string') {
    throw new Error('fresh scratch compilation omitted object provenance');
  }
  return { objectFile: path.resolve(ROOT, ...record.object.split('/')), objectSha256: record.objectSha256 };
}

function cachedCandidateArtifact(run, candidate, target, matchingRoot = MATCHING_ROOT) {
  const directory = resolveRunArtifactDirectory(run, matchingRoot);
  const reportFile = path.join(directory, 'workbench-report.json');
  if (!fs.existsSync(reportFile)) throw new Error('cached compilation report is missing');
  const reportStat = fs.lstatSync(reportFile);
  if (!reportStat.isFile() || reportStat.isSymbolicLink()
      || path.dirname(fs.realpathSync(reportFile)) !== fs.realpathSync(directory)) {
    throw new Error('cached compilation report is not a plain run artifact');
  }
  const report = JSON.parse(fs.readFileSync(reportFile, 'utf8'));
  if (report.schemaVersion !== 1 || report.target?.targetId !== target.targetId
      || report.candidate?.candidateId !== candidate.candidateId
      || report.compile?.runId !== run.run_id || report.compile?.cacheKey !== run.cache_key
      || report.compile?.candidateId !== candidate.candidateId
      || report.compile?.status !== 'compiled'
      || report.compile?.objectText !== run.object_text
      || canonicalJson(report.compile?.relocations) !== canonicalJson(run.relocations)
      || canonicalJson(report.compile?.tool) !== canonicalJson(run.tool)) {
    throw new Error('cached compilation report provenance is stale or malformed');
  }
  const record = report.scratchContract?.artifacts;
  if (!record || typeof record.object !== 'string' || typeof record.objectSha256 !== 'string') {
    throw new Error('cached compilation report omitted object provenance');
  }
  const objectFile = path.resolve(ROOT, ...record.object.split('/'));
  if (objectFile !== path.join(directory, 'candidate.o')) {
    throw new Error('cached object artifact is not the authenticated candidate object');
  }
  if (!fs.existsSync(objectFile)) throw new Error('cached object artifact is missing');
  const objectStat = fs.lstatSync(objectFile);
  if (!objectStat.isFile() || objectStat.isSymbolicLink()
      || path.dirname(fs.realpathSync(objectFile)) !== fs.realpathSync(directory)) {
    throw new Error('cached object artifact escapes its real run directory');
  }
  if (sha256File(objectFile) !== record.objectSha256) {
    throw new Error('cached object artifact identity drift');
  }
  return { objectFile, objectSha256: record.objectSha256 };
}

function diagnosticPreparedForCandidate(prepared, artifact) {
  if (!prepared.available) return prepared;
  return {
    ...prepared,
    inputId: digest({
      schemaVersion: 1,
      targetDiagnosticInputId: prepared.inputId,
      candidateObjectSha256: artifact.objectSha256,
    }),
  };
}

function compilePublicationRequiresReauthentication(stored) {
  return stored?.cached === true && stored.run?.status === 'compiled';
}

function compileCandidate(workbench, target, sourceText, options = {}) {
  const storeOptions = options.storeOptions || {};
  const storeRequest = options.storeRequest || requestStore;
  const { candidate, sourceFile } = recordCandidate(workbench, target, sourceText, options);
  const session = options.session || prepareCompilerSession(options);
  const expectedRelocationEvidence = acceptedExpectedRelocationEvidence(session, target);
  const preparedDiagnostic = prepareTargetDiagnostic(
    session,
    target,
    expectedRelocationEvidence,
    options.diagnosticOptions || {},
  );
  const cacheKey = digest({
    schemaVersion: 2,
    candidateId: candidate.candidateId,
    targetId: target.targetId,
    toolId: session.toolId,
    expectedRelocationEvidence,
  });
  const cached = storeRequest({ action: 'query', name: 'compile_by_cache', args: { cacheKey } }, storeOptions);
  if (cached && (cached.candidate_id !== candidate.candidateId || canonicalJson(cached.tool) !== canonicalJson(session.tool))) {
    throw new Error(`compile cache digest collision for ${candidate.candidateId}`);
  }
  if (cached && cached.status === 'compiled') {
    const storedComparison = storeRequest({ action: 'query', name: 'comparison_for_run', args: { runId: cached.run_id } }, storeOptions);
    if (!storedComparison) throw new Error(`compiled cache entry is incomplete: ${cached.run_id}`);
    const cachedArtifactDirectory = resolveRunArtifactDirectory(
      cached,
      options.matchingRoot || MATCHING_ROOT,
    );
    if (typeof cached.object_text !== 'string' || !Array.isArray(cached.relocations)) {
      throw new Error(`compiled cache entry lacks reusable object evidence: ${cached.run_id}`);
    }
    const candidateArtifact = cachedCandidateArtifact(
      cached,
      candidate,
      target,
      options.matchingRoot || MATCHING_ROOT,
    );
    const candidatePrepared = diagnosticPreparedForCandidate(
      preparedDiagnostic,
      candidateArtifact,
    );
    if (comparisonIsCurrent(storedComparison, candidatePrepared)) {
      return { candidate, compile: cached, comparison: storedComparison, cached: true, comparisonRefreshed: false };
    }
    const comparison = compareCandidateDiagnostic({
      session,
      target,
      objectText: Buffer.from(cached.object_text, 'base64'),
      actualRelocations: cached.relocations,
      expectedRelocationEvidence,
      candidateArtifact,
      artifactDir: cachedArtifactDirectory,
      prepared: candidatePrepared,
    });
    const refreshedRecord = makeComparisonRecord(cached.run_id, comparison);
    const diagnosticReports = ensurePlainChildDirectory(
      cachedArtifactDirectory,
      'diagnostic-reports',
      'cached diagnostic reports directory',
    );
    const diagnosticReportFile = path.join(diagnosticReports, `${refreshedRecord.comparisonId}.json`);
    writeUniqueRunJson(diagnosticReportFile, {
      schemaVersion: 1,
      target: { symbol: target.symbol, targetId: target.targetId, expectedBytesSha256: target.expectedBytesSha256 },
      candidate: { candidateId: candidate.candidateId, sourceSha256: candidate.sourceSha256 },
      compile: { runId: cached.run_id, cacheKey: cached.cache_key, reused: true },
      comparison,
    }, diagnosticReports);
    const refreshed = storeRequest({ action: 'replace_comparison', record: refreshedRecord }, storeOptions);
    return { candidate, compile: cached, comparison: refreshed, cached: true, comparisonRefreshed: true };
  }
  // Successful work is reused by cache key. Failed attempts are retried and
  // retain distinct run identities so a repaired host/tool path is not pinned
  // to an old environmental failure.
  const attemptStartedAt = new Date().toISOString();
  const runId = compileAttemptIdentity(cacheKey, attemptStartedAt);
  const artifactDir = authenticateFreshRunArtifactDirectory(
    runId,
    options.matchingRoot || MATCHING_ROOT,
  );
  const started = Date.now();
  const targetForCompile = {
    symbol: target.symbol,
    source: relative(sourceFile),
    sourceSha256: candidate.sourceSha256,
    bytes: target.bytes,
    sectionName: target.sectionName,
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
    const candidateArtifact = candidateArtifactFromScratch(result);
    const comparison = compareCandidateDiagnostic({
      session,
      target,
      objectText,
      actualRelocations: result.relocations,
      expectedRelocationEvidence,
      candidateArtifact,
      artifactDir,
      prepared: diagnosticPreparedForCandidate(preparedDiagnostic, candidateArtifact),
    });
    comparisonRecord = makeComparisonRecord(runId, comparison);
    writeJson(path.join(artifactDir, 'workbench-report.json'), {
      schemaVersion: 1,
      target: { symbol: target.symbol, targetId: target.targetId, expectedBytesSha256: target.expectedBytesSha256 },
      candidate: { ...candidate, sourceText: undefined },
      compile: compileRecord,
      scratchContract: result.scratchContract,
      comparison,
      caveat: 'Workbench comparison evidence is diagnostic only; canonical ownership, target bytes, and full-ROM verification remain required.',
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
  const stored = storeRequest({
    action: 'put_compile_result',
    compile: compileRecord,
    comparison: comparisonRecord,
  }, storeOptions);
  if (compilePublicationRequiresReauthentication(stored)) {
    // Another process won the stable compile-key race. Its object is reusable,
    // but its comparison may have been produced under a different algorithm or
    // CURRENT provenance, so re-enter the authenticated cache path before any
    // caller observes its score.
    return compileCandidate(workbench, target, sourceText, {
      ...options,
      session,
      syncTargets: false,
    });
  }
  return {
    candidate,
    compile: stored.run,
    comparison: stored.comparison,
    cached: stored.cached,
    comparisonRefreshed: false,
  };
}

module.exports = {
  MATCHING_ROOT,
  candidateRecord,
  compileArtifactDirectory,
  compileCandidate,
  compileScratchCandidate,
  cachedCandidateArtifact,
  candidateArtifactFromScratch,
  compileAttemptIdentity,
  authenticateFreshRunArtifactDirectory,
  compilePublicationRequiresReauthentication,
  resolveRunArtifactDirectory,
  prepareCompilerSession,
  recordCandidate,
  sourceSnapshot,
  syncTargets,
};
