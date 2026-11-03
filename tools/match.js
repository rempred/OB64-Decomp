#!/usr/bin/env node
'use strict';
require('./lib/matching/tool_bundle_runtime').initialize(__filename,process.argv.slice(2));
const { assertScratchCapability } = require('./lib/matching/target_model');

const fs = require('fs');
const path = require('path');
const { ROOT } = require('./lib/phase7_conventional');
const {
  loadWorkbenchModel,
  publicTarget,
  resolveTarget,
  historicalSymbols,
} = require('./lib/matching/target_model');
const {
  initializeStore,
  requestStore,
} = require('./lib/matching/store');
const {
  compileCandidate,
  prepareCompilerSession,
  syncTargets,
} = require('./lib/matching/compiler');
const { compareMips, targetMetrics } = require('./lib/matching/mips_analysis');
const {
  comparisonAlgorithmIdentity,
  loadDiagnosticEnvironment,
} = require('./lib/matching/diagnostic_link');
const {
  assertCandidateComparisonInputs,
  assertCandidateComparisonResult,
  compareCaseCfg,
  resolveCandidateComparisonContract,
} = require('./lib/matching/case_cfg');
const { prepareAndCompile, resolveM2c } = require('./lib/matching/m2c');
const { runSweep, summarizeEnsemble } = require('./lib/matching/sweep');
const { buildFamilyAtlas } = require('./lib/matching/family');
const { buildContextIndex, storeTargetContext } = require('./lib/matching/context');
const { rankTargets } = require('./lib/matching/rank');
const { compareProbes, runProbe } = require('./lib/matching/probe');
const { importResearch, observations: researchObservations, preserveResearch, captureIdentities } = require('./lib/matching/research');
const { presentation: researchPresentation, loadIntakeModel, formatHuman } = require('./lib/matching/intake');
const { validateOptions: validateKnowledgeOptions } = require('./lib/matching/knowledge');

const VALUE_OPTIONS = new Set([
  'limit', 'source', 'candidate', 'variant', 'm2c-root', 'set', 'max-size',
  'lane', 'note', 'research-compiler', 'passes', 'jobs', 'case-map', 'source-origin',
  'tool-bundle', 'reviewed-patch-sha256', 'scratch-root', 'inputs', 'native-concurrency', 'actual-dispatch', 'actual-body', 'output', 'actual-tail', 'observation', 'effect', 'cross-limit', 'symptom',
]);
const PRIVATE_COMMANDS = new Set(['preflight','intake', 'watch', 'classify', 'compare', 'inspect', 'history', 'best', 'observations', 'import', 'preserve', 'probe']);
const REPEAT_OPTIONS = new Set(['variant', 'actual-tail']);
let comparisonQueryProvenanceCache = null;

function comparisonQueryProvenance(preparationOptions = {}) {
  if (!comparisonQueryProvenanceCache) {
    const session = prepareCompilerSession(preparationOptions);
    comparisonQueryProvenanceCache = {
      comparisonAlgorithmId: comparisonAlgorithmIdentity(),
      diagnosticCurrentFingerprint: session.context.currentFingerprint,
      diagnosticEnvironmentId: loadDiagnosticEnvironment(session).identity,
    };
  }
  return comparisonQueryProvenanceCache;
}

function usage() {
  console.log(`Usage: node tools/match.js <command> [arguments]

Core:
  publish-tools --reviewed-patch-sha256 <SHA256>
  capture-inputs --output <new ignored build directory> [--tool-bundle <version>]
  preflight <symbols...> --inputs <manifest> --scratch-root <root> --output <new report>
  refresh-inputs --from <manifest.json> --from-sha256 <SHA256>
                 --replace <logical-tool-path=SHA256>... --output <new sibling.json>
  doctor [--m2c-root <path>]
  inspect <symbol> [--limit N]
  history <symbol> [--limit N] [--include-details]
  best <symbol> [--limit N] [--include-details]
  watch <symbol> --source <candidate.c>
  tail-admit <symbol>... [--apply]  Integrator-only provisional current-source registration
  classify <candidate-id> [--include-details] [--include-source]
  compare <candidate-id> <candidate-id>
  case-cfg <candidate-id> --case-map <map.json> --actual-dispatch <offset> --actual-body <offset>
           --actual-tail <name=offset>... [--output <report.json>]
  import <symbol> --source <candidate.c> --observation <curated.json> [--capture-identities]
  observations <symbol> [--effect <tag>] [--limit N]
  intake <symbol> [--limit N] [--cross-limit 0..3] [--symptom LABEL] [--include-details]
  preserve <candidate-id> --note <reason> [--observation <observation-id>]

Generation:
  prepare <symbol> [--variant <ruleset>]... [--with-context|--no-context] [--runtime] [--no-compile] [--m2c-root <path>]
  sweep [--set <name>] [--variant <ruleset>]... [--max-size N] [--leaf-only] [--limit N] [--jobs N]
        [--include-solved] [--with-context|--no-context] [--runtime] [--no-compile] [--m2c-root <path>]
  sweep-status [--limit N] [--include-targets]

Research:
  family build
  family <symbol> [--limit N] [--include-members]
  family list [--tier <tier>] [--limit N] [--include-members]
  context <symbol> [--runtime] [--include-context]
  rank [--lane leverage|batch|hard-tail] [--limit N] [--skip-families]
  rank --explain <symbol>
  probe <symbol> [--source <file> | --candidate <id>] [--passes a,b] [--research-compiler <file>]
  probe compare <left-report.json> <right-report.json>

Private research commands accept --scratch-root build/matching/<worker>.
This routes the database, source snapshots, compile artifacts and probes privately.
Only intake/watch/classify/compare/inspect/history/best/observations/import/preserve/probe
are supported. --native-concurrency serial|parallel requires --scratch-root; parallel
is the default across distinct roots. One command per root; serial is a host-contention
fallback. preserve is explicit Sol-owned tracked publication.

Routine generated outputs stay under build/matching; preserve is the explicit
tracked candidate/dossier export. Add --json for structured output.
Use explicit --include-details, --include-members, --include-context, or
--include-targets when the bounded default is not enough.
For intake/prepare/watch, --include-details renders full JSON; --json always
retains the full research object under the explicit --limit/truncation rules.

prepare and sweep use the complete configured ruleset ensemble when --variant is
omitted; repeat --variant to select a subset. Bare sweep selects every currently
unsolved ordinary target, so normally provide --set, --max-size, or --limit.
The fixed set name is smallest-leaves-200. Context is generated by default but
is passed to m2c only with --with-context.`);
}

function parseArgs(argv) {
  const positional = [];
  const options = {};
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (!arg.startsWith('--')) { positional.push(arg); continue; }
    const name = arg.slice(2);
    if (VALUE_OPTIONS.has(name) || name === 'tier' || name === 'explain') {
      const value = argv[++index];
      if (!value || value.startsWith('--')) throw new Error(`--${name} requires a value`);
      if (REPEAT_OPTIONS.has(name)) {
        options[name] = options[name] || [];
        options[name].push(value);
      } else {
        if (['scratch-root', 'native-concurrency', 'case-map', 'actual-dispatch', 'actual-body', 'output'].includes(name)
            && Object.prototype.hasOwnProperty.call(options, name)) {
          throw new Error(`--${name} may not be repeated`);
        }
        options[name] = value;
      }
    } else if ([
      'apply', 'json', 'no-context', 'with-context', 'no-compile', 'leaf-only', 'runtime', 'skip-families',
      'include-targets', 'include-details', 'include-source', 'include-members', 'include-context', 'include-solved', 'capture-identities',
    ].includes(name)) {
      options[name] = true;
    } else throw new Error(`unknown option: --${name}`);
  }
  return { positional, options };
}

function numeric(value, label, defaultValue = null) {
  if (value === undefined || value === null) return defaultValue;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) throw new Error(`${label} must be a positive integer`);
  return parsed;
}

function nonnegativeInteger(value, label) {
  if (Number.isSafeInteger(value) && value >= 0) return value;
  if (typeof value === 'string' && /^(?:0x[0-9a-f]+|[0-9]+)$/i.test(value.trim())) {
    const parsed = Number.parseInt(value, 0);
    if (Number.isSafeInteger(parsed) && parsed >= 0) return parsed;
  }
  throw new Error(`${label} must be a nonnegative integer`);
}

function actualTailMap(values) {
  const grouped = new Map();
  for (const value of values || []) {
    const match = /^([^=]+)=(0x[0-9a-f]+|[0-9]+)$/i.exec(value);
    if (!match) throw new Error('--actual-tail requires name=offset');
    const name = match[1].trim();
    if (!name) throw new Error('--actual-tail name is empty');
    if (!grouped.has(name)) grouped.set(name, []);
    grouped.get(name).push(nonnegativeInteger(match[2], '--actual-tail offset'));
  }
  return [...grouped].map(([name, offsets]) => ({ name, offsets }));
}

function print(value, options = {}) {
  require('./lib/execution_paths').bundle()?.close();
  if (options.json) {
    console.log(JSON.stringify(value, null, 2));
    return;
  }
  if (!options['include-details'] && value?.researchIntake) {
    const {researchIntake,...rest}=value;
    console.log(JSON.stringify(rest,null,2)+'\n'+formatHuman(researchIntake));return;
  }
  if (!options['include-details'] && value?.observations && value?.boundary) {
    console.log(formatHuman(value));return;
  }
  if (typeof value === 'string') console.log(value);
  else console.log(JSON.stringify(value, null, 2));
}

function portableSourcePath(file) {
  const relative = path.relative(ROOT, file);
  if (relative && relative !== '..' && !relative.startsWith(`..${path.sep}`)) return relative.replace(/\\/g, '/');
  return `<external>/${path.basename(file)}`;
}

function boundedSweepResult(result, includeTargets = false, targetLimit = 20) {
  if (!result?.summary) return result;
  const hasTargets = Array.isArray(result.summary.targets);
  const targets = hasTargets ? result.summary.targets : [];
  const sampleLimit = Math.min(targetLimit, 3);
  const ruleSetNames = result.selector?.variants || result.summary.ensemble?.ruleSets?.map((row) => row.name) || [];
  const ensemble = result.summary.ensemble || summarizeEnsemble(targets, ruleSetNames);
  const complete = { ...result, summary: { ...result.summary, ensemble } };
  if (includeTargets) return complete;
  function boundedRows(rows, limit = sampleLimit) {
    const values = Array.isArray(rows) ? rows : [];
    return { samples: values.slice(0, limit), omitted: Math.max(0, values.length - limit) };
  }
  function compactTarget(target) {
    return {
      symbol: target.symbol,
      bytes: target.bytes,
      hasError: Boolean(target.error),
      variants: (target.variants || []).map((variant) => ({
        variant: variant.variant,
        status: variant.status,
        ...(variant.exactBytes ? { exactBytes: true, candidateId: variant.candidateId } : {}),
        ...(variant.error ? { hasError: true } : {}),
      })),
    };
  }
  const boundedEnsemble = {
    schemaVersion: ensemble.schemaVersion,
    baselineRuleSet: ensemble.baselineRuleSet,
    exactTargetCount: ensemble.exactTargetCount,
    exactSymbols: boundedRows(ensemble.exactSymbols),
    functionMembership: boundedRows(ensemble.functionMembership),
    ruleSets: ensemble.ruleSets.map((ruleSet) => ({
      name: ruleSet.name,
      exactCount: ruleSet.exactCount,
      matches: boundedRows(ruleSet.matches, 1),
      gainedVsBaseline: boundedRows(ruleSet.gainedVsBaseline, 1),
      lostVsBaseline: boundedRows(ruleSet.lostVsBaseline, 1),
      uniqueToRuleSet: boundedRows(ruleSet.uniqueToRuleSet, 1),
    })),
  };
  const selectorSymbols = Array.isArray(complete.selector?.symbols) ? complete.selector.symbols : null;
  const boundedSelector = selectorSymbols ? {
    ...complete.selector,
    symbols: undefined,
    symbolSamples: selectorSymbols.slice(0, sampleLimit),
    symbolsOmitted: Math.max(0, selectorSymbols.length - sampleLimit),
  } : complete.selector;
  const priorTargetSamples = Array.isArray(result.summary.targetSamples) ? result.summary.targetSamples : [];
  const targetSampleSource = hasTargets ? targets : priorTargetSamples;
  return {
    ...complete,
    selector: boundedSelector,
    summary: {
      ...complete.summary,
      ensemble: boundedEnsemble,
      targets: undefined,
      targetSamples: targetSampleSource.slice(0, sampleLimit).map(compactTarget),
      targetsOmitted: hasTargets
        ? Math.max(0, targets.length - sampleLimit)
        : (result.summary.targetsOmitted || 0) + Math.max(0, priorTargetSamples.length - sampleLimit),
    },
  };
}

function boundedContext(context, includeContext = false, rowLimit = 5) {
  if (includeContext) return context;
  function sample(name) {
    const rows = Array.isArray(context[name]) ? context[name] : [];
    return { rows: rows.slice(0, rowLimit), omitted: Math.max(0, rows.length - rowLimit) };
  }
  const runtime = context.runtime && {
    requested: context.runtime.requested,
    available: context.runtime.available,
    reviewState: context.runtime.reviewState || null,
    error: context.runtime.error || null,
    payloadOmitted: Boolean(context.runtime.payload),
  };
  return {
    schemaVersion: context.schemaVersion,
    contextId: context.contextId,
    target: context.target,
    summary: context.summary,
    arguments: context.arguments,
    fields: sample('fields'),
    callers: sample('callers'),
    callees: sample('callees'),
    returnWrites: sample('returnWrites'),
    runtime,
    evidenceBoundary: context.evidenceBoundary,
  };
}

function boundedEvidence(value, depth = 0) {
  if (Array.isArray(value)) {
    return {
      samples: value.slice(0, 3).map((item) => boundedEvidence(item, depth + 1)),
      omitted: Math.max(0, value.length - 3),
    };
  }
  if (!value || typeof value !== 'object') return value;
  if (depth >= 4) return '<nested evidence omitted>';
  return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, boundedEvidence(item, depth + 1)]));
}

function compactFrame(frame) {
  const offsets = Array.isArray(frame?.stackOffsets) ? frame.stackOffsets : [];
  return {
    frameSize: frame?.frameSize ?? null,
    stackOffsetCount: offsets.length,
    stackOffsetSamples: offsets.slice(0, 5),
    stackOffsetsOmitted: Math.max(0, offsets.length - 5),
  };
}

function compactMismatchLabel(label) {
  return {
    category: label.category,
    likelihood: label.likelihood,
    interpretation: label.interpretation,
    evidence: boundedEvidence(label.evidence),
    searchFamilies: (label.searchFamilies || []).slice(0, 4),
    avoidUntilResolved: (label.avoidUntilResolved || []).slice(0, 3),
  };
}

function compactRelocationEvidence(evidence) {
  if (!evidence) return null;
  function sourceSummary(source) {
    if (!source) return null;
    return {
      available: source.available,
      count: source.count,
      complete: source.complete,
      unavailableReason: source.unavailableReason || null,
      unknownKinds: (source.unknownKinds || []).slice(0, 4),
      unmaskableKnownKinds: (source.unmaskableKnownKinds || []).slice(0, 4),
      invalidRecordCount: (source.invalidRecords || []).length + (source.invalidRecordsOmitted || 0),
    };
  }
  const mismatch = evidence.mismatch && {
    expectedOnlyCount: evidence.mismatch.expectedOnlyCount,
    actualOnlyCount: evidence.mismatch.actualOnlyCount,
    identityMismatchCount: evidence.mismatch.identityMismatchCount,
    expectedOnlySamples: (evidence.mismatch.expectedOnlySamples || []).slice(0, 2),
    actualOnlySamples: (evidence.mismatch.actualOnlySamples || []).slice(0, 2),
    identityMismatchSamples: (evidence.mismatch.identityMismatchSamples || []).slice(0, 2),
  };
  return {
    expected: sourceSummary(evidence.expected),
    actual: sourceSummary(evidence.actual),
    comparisonAvailable: evidence.comparisonAvailable,
    recordsExact: evidence.recordsExact,
    addendIdentity: evidence.addendIdentity || null,
    mask: evidence.mask,
    mismatch,
  };
}

function compactMismatchEvidence(comparison) {
  const labels = Array.isArray(comparison?.labels) ? comparison.labels : [];
  return {
    differingInstructions: comparison?.differingInstructions ?? null,
    differingBytes: comparison?.differingBytes ?? null,
    mismatchCounts: comparison?.mismatchCounts || null,
    topLabels: labels.slice(0, 3).map(compactMismatchLabel),
    labelsOmitted: Math.max(0, labels.length - 3),
    relocationEvidence: compactRelocationEvidence(comparison?.relocationEvidence),
  };
}

function compactDiagnosticEvidence(comparison) {
  const raw = comparison?.rawObjectComparison;
  const diagnostic = comparison?.diagnostic;
  return {
    comparisonContract: comparison?.comparisonContract ?? null,
    textContract: comparison?.textContract || diagnostic?.candidate?.textContract || null,
    functionComparison: comparison?.functionComparison || null,
    fullOwnerComparison: comparison?.fullOwnerComparison || null,
    evidenceMode: comparison?.evidenceMode || null,
    acceptanceEligible: comparison?.acceptanceEligible === true,
    rawExactBytes: comparison?.rawExactBytes ?? raw?.exactBytes ?? null,
    rawRelocationMaskedExact: comparison?.rawRelocationMaskedExact ?? raw?.relocationMaskedExact ?? null,
    rawObjectExactBytes: comparison?.rawExactBytes ?? raw?.exactBytes ?? null,
    rawObjectRelocationMaskedExact: comparison?.rawRelocationMaskedExact
      ?? raw?.relocationMaskedExact ?? null,
    diagnosticExactBytes: comparison?.diagnosticExactBytes ?? null,
    diagnosticRelocationMaskedExact: comparison?.diagnosticRelocationMaskedExact ?? null,
    rawObject: raw ? {
      primaryClass: raw.primaryClass,
      score: raw.score,
      cfgExact: raw.cfgExact,
      firstDifference: raw.firstDifference,
    } : null,
    diagnostic: diagnostic ? {
      status: diagnostic.status,
      mode: diagnostic.mode,
      code: diagnostic.code || null,
      reason: diagnostic.reason || null,
      control: diagnostic.control ? {
        linkedBytesSha256: diagnostic.control.linkedBytesSha256,
        durationMs: diagnostic.control.durationMs,
      } : null,
      candidate: diagnostic.candidate ? {
        linkedBytesSha256: diagnostic.candidate.linkedBytesSha256,
        fullOwner: diagnostic.candidate.fullOwner || null,
        durationMs: diagnostic.candidate.durationMs,
      } : null,
    } : null,
  };
}

function publicCandidateRecord(record, options = {}) {
  const candidate = {
    candidateId: record.candidate.candidate_id,
    targetId: record.candidate.target_id,
    sourceSha256: record.candidate.source_sha256,
    origin: record.candidate.origin,
    variant: record.candidate.variant,
    parentCandidateId: record.candidate.parent_candidate_id,
    metadata: record.candidate.metadata,
    createdAt: record.candidate.created_at,
  };
  if (options.includeSource) candidate.source = record.candidate.source_text;
  const runs = record.runs.map((run) => {
    const details = run.details || null;
    return {
      runId: run.run_id,
      status: run.status,
      sourceClass: run.source_class,
      primaryClass: run.primary_class,
      exactBytes: Boolean(run.exact_bytes),
      relocationMaskedExact: Boolean(run.relocation_masked_exact),
      score: run.score,
      durationMs: run.duration_ms,
      artifactDir: run.artifact_dir,
      createdAt: run.created_at,
      comparisonStale: Boolean(run.comparison_stale),
      actualRelocationCount: Array.isArray(run.relocations) ? run.relocations.length : null,
      ...(options.includeDetails ? { actualRelocations: run.relocations ?? null } : {}),
      ...(details ? compactMismatchEvidence(details) : {}),
      ...(details ? compactDiagnosticEvidence(details) : {}),
      ...(options.includeDetails ? { details, tool: run.tool, stderr: run.stderr } : {}),
    };
  });
  const observations = record.observations.map((observation) => ({
    observationId: observation.observation_id,
    origin: observation.origin,
    variant: observation.variant,
    parentCandidateId: observation.parent_candidate_id,
    metadata: observation.metadata,
    createdAt: observation.created_at,
  }));
  return { candidate, observations, runs, latestRun: runs[0] || null };
}

function compactComparison(comparison, includeDetails = false) {
  if (includeDetails) return comparison;
  return {
    schemaVersion: comparison.schemaVersion,
    ...compactDiagnosticEvidence(comparison),
    primaryClass: comparison.primaryClass,
    recommendation: comparison.recommendation,
    exactBytes: comparison.exactBytes,
    relocationMaskedExact: comparison.relocationMaskedExact,
    registerNormalizedExact: comparison.registerNormalizedExact,
    cfgExact: comparison.cfgExact,
    sameLength: comparison.sameLength,
    score: comparison.score,
    expectedBytes: comparison.expectedBytes,
    actualBytes: comparison.actualBytes,
    differingInstructions: comparison.differingInstructions,
    differingBytes: comparison.differingBytes,
    mismatchCounts: comparison.mismatchCounts,
    topLabels: (comparison.labels || []).slice(0, 3).map(compactMismatchLabel),
    labelsOmitted: Math.max(0, (comparison.labels || []).length - 3),
    relocationEvidence: compactRelocationEvidence(comparison.relocationEvidence),
    opcodeMatches: comparison.opcodeMatches,
    firstDifference: comparison.firstDifference,
    expectedFrame: compactFrame(comparison.expectedFrame),
    actualFrame: compactFrame(comparison.actualFrame),
  };
}

function initialize(workbench, options = {}, watchCall) {
  const call = watchCall || (callback => callback());
  const store = call(() => initializeStore(options.storeOptions || {}), options.storeOptions);
  const targets = call(() => syncTargets(workbench, options.storeOptions || {}, { force: options.forceTargetSync === true }), options.storeOptions);
  return { store, targets };
}

function comparisonSummary(result) {
  const comparison = result.comparison?.details || result.comparison;
  return {
    candidateId: result.candidate.candidateId,
    cached: result.cached,
    terminalTail: result.terminalTail ?? comparison?.terminalTail ?? null,
    comparisonRefreshed: result.comparisonRefreshed === true,
    status: result.compile.status,
    sourceClass: result.compile.source_class || result.compile.sourceClass,
    primaryClass: comparison?.primaryClass || result.comparison?.primary_class || null,
    score: comparison?.score ?? result.comparison?.score ?? null,
    exactScratchBytes: comparison?.exactBytes ?? Boolean(result.comparison?.exact_bytes),
    ...compactDiagnosticEvidence(comparison),
    actualRelocations: result.compile.relocations ?? null,
    diagnosticExactBytes: comparison?.diagnosticExactBytes ?? null,
    evidenceMode: comparison?.evidenceMode || null,
    rawObjectExactBytes: comparison?.rawExactBytes ?? comparison?.rawObjectComparison?.exactBytes ?? null,
    relocationMaskedExact: comparison?.relocationMaskedExact ?? Boolean(result.comparison?.relocation_masked_exact),
    ...compactMismatchEvidence(comparison),
    firstDifference: comparison?.firstDifference || null,
    recommendation: comparison?.recommendation || null,
    artifactDir: result.compile.artifact_dir || result.compile.artifactDir,
    acceptanceBoundary: 'Scratch results are research only; canonical linked target and full-ROM verification remain required.',
  };
}

function variantSelection(workbench, names) {
  if (!names || !names.length) return workbench.config.m2c.variants;
  const selected = workbench.config.m2c.variants.filter((variant) => names.includes(variant.name));
  const missing = names.filter((name) => !selected.some((variant) => variant.name === name));
  if (missing.length) throw new Error(`unknown m2c variant: ${missing.join(', ')}`);
  return selected;
}

function latestCandidateRun(candidateId, storeOptions = {}, preparationOptions = {}) {
  const query = (request) => requestStore(request, storeOptions);
  const candidate = query({ action: 'query', name: 'candidate', args: { candidateId } });
  if (!candidate) throw new Error(`candidate does not exist: ${candidateId}`);
  const privateTarget = preparationOptions.privateWorkbench
    ? [...preparationOptions.privateWorkbench.targets, ...(preparationOptions.privateWorkbench.logicalTargets || [])]
      .find(target => target.targetId === candidate.target_id) : undefined;
  const runs = query({ action: 'query', name: 'candidate_runs', args: {
    candidateId,
    limit: 20,
    ...comparisonQueryProvenance({ ...preparationOptions, privateTarget }),
  } });
  const observations = query({ action: 'query', name: 'candidate_observations', args: { candidateId, limit: 20 } });
  return { candidate, observations, runs, run: runs.find((item) => item.status === 'compiled') || runs[0] || null };
}

function preserveCandidate(workbench, candidateId, note, observationId, routing = {}) {
  if (observationId) return preserveResearch(workbench, candidateId, observationId, note, routing);
  if (!note) throw new Error('preserve requires --note describing why the candidate is useful');
  const { candidate, run } = latestCandidateRun(candidateId, routing.storeOptions, routing);
  const target = [...workbench.targets, ...(workbench.logicalTargets || [])].find((item) => item.targetId === candidate.target_id);
  if (!target) throw new Error('candidate belongs to a stale or unknown target model');
  const date = new Date().toISOString().slice(0, 10);
  const short = candidateId.slice(0, 10).toLowerCase();
  const sourceRelative = `docs/archive/matching-c-candidates/${date}-${target.symbol}-${short}.c`;
  const dossierRelative = `docs/dossiers/${target.symbol}-${short}.md`;
  const sourceFile = path.join(ROOT, ...sourceRelative.split('/'));
  const dossierFile = path.join(ROOT, ...dossierRelative.split('/'));
  if (fs.existsSync(sourceFile) || fs.existsSync(dossierFile)) throw new Error('preserved candidate output already exists');
  fs.mkdirSync(path.dirname(sourceFile), { recursive: true });
  fs.mkdirSync(path.dirname(dossierFile), { recursive: true });
  fs.writeFileSync(sourceFile, candidate.source_text, 'utf8');
  const comparison = run?.details || null;
  const lines = [
    `# ${target.symbol}: Preserved Matching-Workbench Candidate`,
    '',
    '## Status',
    '',
    'This source is a research candidate. Preservation does not change current source ownership or establish matching acceptance.',
    '',
    `- Candidate: \`${candidateId}\``,
    `- Target: \`${target.symbol}\` at ROM \`0x${target.romStart.toString(16).toUpperCase()}\``,
    `- Source: \`${sourceRelative}\``,
    `- Source SHA-256: \`${candidate.source_sha256}\``,
    `- Latest scratch class: \`${run?.primary_class || 'not compiled'}\``,
    `- Latest scratch score: \`${run?.score ?? 'not available'}\``,
    '',
    '## Preservation reason',
    '',
    note,
    '',
    '## Evidence boundary',
    '',
    'Scratch object comparison does not prove canonical linker ownership, relocation resolution, target bytes, or full-ROM identity. Resume through the normal diff and verification workflow.',
    '',
  ];
  if (comparison?.firstDifference) lines.push('## First recorded difference', '', '```json', JSON.stringify(comparison.firstDifference, null, 2), '```', '');
  fs.writeFileSync(dossierFile, lines.join('\n'), 'utf8');
  return { source: sourceRelative, dossier: dossierRelative };
}

// Integrator-only metadata construction. Review and preimage installation remain
// external responsibilities; unchanged expectations are retained, not certified.
async function refreshInputs(argv) {
  const options = {}, allowed = new Set(['from', 'from-sha256', 'replace', 'output', 'json']);
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index], name = argument.slice(2);
    if (!argument.startsWith('--') || !allowed.has(name)) throw new Error('refresh-inputs accepts only --from, --from-sha256, --replace, --output and --json');
    if (name !== 'replace' && Object.hasOwn(options, name)) throw new Error(`--${name} may not be repeated`);
    if (name === 'json') { options.json = true; continue; }
    const value = argv[++index];
    if (!value || value.startsWith('--')) throw new Error(`--${name} requires a value`);
    if (name === 'replace') (options.replace ||= []).push(value);
    else options[name] = value;
  }
  if (!options.from || !options['from-sha256'] || !options.output || !options.replace?.length) throw new Error('refresh-inputs requires --from, --from-sha256, --replace and --output');
  const api = require('./lib/matching/input_set');
  const fail = message => { throw new Error('refresh-inputs: ' + message); };
  const hash = value => {
    if (!/^[a-f0-9]{64}$/i.test(value)) fail('expected SHA-256');
    return value.toUpperCase();
  };
  const samePath = (left, right) => path.resolve(left).toLowerCase() === path.resolve(right).toLowerCase();
  const manifestPath = value => {
    // Reject alternate spellings, traversal and Windows stream/device aliases.
    const parts = value.replace(/^[A-Za-z]:/, '').split(/[\\/]/).filter(Boolean);
    if (!parts.length || parts.some(part => part === '.' || part === '..' || /[. :]/.test(part.slice(-1))
        || part.includes(':') || /^(?:con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(part))) fail('invalid manifest path');
    const absolute = path.resolve(value), relative = path.relative(path.join(ROOT, 'build'), absolute);
    if (!relative || relative === '..' || relative.startsWith('..' + path.sep) || path.isAbsolute(relative)
        || relative.toLowerCase() === 'readme.md') fail('manifest must be under ignored build/');
    return absolute;
  };
  const parentPath = manifestPath(options.from), output = manifestPath(options.output);
  if (samePath(parentPath, output) || !samePath(path.dirname(parentPath), path.dirname(output))) fail('output must be a new sibling manifest');
  api.regular(path.dirname(output), true);
  api.regular(parentPath);
  const parentBytes = fs.readFileSync(parentPath), parentSha256 = hash(options['from-sha256']);
  if (api.digest(parentBytes) !== parentSha256) fail('parent SHA-256 differs');
  const parent = api.openResearchInputSet(parentPath);
  if (JSON.stringify(JSON.parse(parentBytes)) !== JSON.stringify(parent.manifest)) fail('parent changed while opening');
  const recordFor = (logical, storage) => {
    const records = parent.manifest.files.filter(record => record.logical === logical);
    if (records.length !== 1 || records[0].storage !== storage
        || storage === 'reference' && !samePath(records[0].path, path.join(ROOT, logical))) fail('required ' + storage + ' record: ' + logical);
    return records[0];
  };
  for (const logical of ['tools/lib/matching/input_set.js', 'tools/lib/current_workflow.js', 'tools/lib/source_policy.js']) {
    recordFor(logical, 'reference');
    parent.read(path.join(ROOT, logical));
  }
  const stateLogical = 'build/current/state.json', stateRecord = recordFor(stateLogical, 'copy');
  const state = JSON.parse(parent.read(path.join(ROOT, stateLogical))), accepted = parent.manifest.accepted;
  const acceptedFields = ['fingerprint', 'baselineFingerprint', 'output', 'buildReport', 'verificationSha256', 'freshCompilationSha256'];
  if (state.schemaVersion !== 7 || state.status !== 'verified' || !state.verifiedAt
      || acceptedFields.some(field => state[field] === undefined || accepted[field] === undefined
        || JSON.stringify(state[field]) !== JSON.stringify(accepted[field]))) fail('accepted state binding differs');
  const checkIdentity = (file, expected, label) => {
    const actual = api.identity(file);
    if (actual.bytes !== expected.bytes || actual.sha256 !== expected.sha256) fail(label + ' identity differs');
  };
  const checkLiveState = () => checkIdentity(path.join(ROOT, stateLogical), stateRecord, 'live CURRENT state');
  checkLiveState();
  const eligible = new Set(['tools/lib/diff_preprocess_cache.js', 'tools/match.js']), seen = new Set(), delta = [];
  const successor = JSON.parse(JSON.stringify(parent.manifest));
  for (const replacement of options.replace) {
    const separator = replacement.indexOf('='), logical = replacement.slice(0, separator);
    if (separator < 1 || !eligible.has(logical)) fail('ineligible replacement path');
    if (seen.has(logical)) fail('duplicate replacement path');
    seen.add(logical);
    const sha256 = hash(replacement.slice(separator + 1)), record = recordFor(logical, 'reference');
    const actual = api.identity(path.join(ROOT, logical));
    if (actual.sha256 !== sha256) fail('reviewed postimage differs: ' + logical);
    if (actual.bytes === record.bytes && actual.sha256 === record.sha256) fail('replacement is unchanged: ' + logical);
    const next = successor.files.find(item => item.logical === logical);
    next.bytes = actual.bytes; next.sha256 = actual.sha256;
    delta.push({ logical, before: { bytes: record.bytes, sha256: record.sha256 }, after: actual });
  }
  const bytes = Buffer.from(JSON.stringify(successor, null, 2) + '\n');
  await parent.closeResearch();
  if (!fs.readFileSync(api.regular(parentPath)).equals(parentBytes)) fail('parent changed before publication');
  checkLiveState();
  for (const change of delta) checkIdentity(path.join(ROOT, change.logical), change.after, 'replacement ' + change.logical);
  api.regular(path.dirname(output), true);
  // Exclusive creation retains failed/interrupted evidence. A complete unreported
  // artifact may be valid; ordinary consumers, not a publication marker, decide.
  fs.writeFileSync(output, bytes, { flag: 'wx' });
  const result = api.openResearchInputSet(api.regular(output));
  if (!fs.readFileSync(api.regular(output)).equals(bytes)
      || JSON.stringify(result.manifest) !== JSON.stringify(successor)) fail('successor readback differs');
  await result.closeResearch(); // Bind the returned ID to the exact readback bytes.
  print({ scope: 'successor-manifest-only', fullSelectedClosureCertified: false, currentAcceptanceCertified: false,
    manifest: output, id: result.id, parent: parentPath, parentSha256,
    acceptedFingerprint: accepted.fingerprint, delta }, options);
}


async function main(argv = process.argv.slice(2)) {
  if (!argv.length) { usage(); return; }
  if (argv[0] === '--help' || argv[0] === '-h') {
    validatePrivateOptions('help', parseArgs(argv.slice(1)).options);
    usage(); return;
  }
  const command = argv[0];
  if(command==='publish-tools'){const p=parseArgs(argv.slice(1));if(p.positional.length||Object.keys(p.options).some(k=>!['reviewed-patch-sha256','source','json'].includes(k)))throw Error('publish-tools options');print(require('./lib/matching/tool_bundle').publish(p.options['reviewed-patch-sha256'],p.options.source?path.resolve(p.options.source):undefined),p.options);return;}
  if (command === 'refresh-inputs') return refreshInputs(argv.slice(1));
  const parsed = parseArgs(argv.slice(1));
  validatePrivateOptions(command, parsed.options);
  if (parsed.options.inputs && command!=='preflight' && (parsed.positional.length !== 1 || command === 'probe' && parsed.positional[0] === 'compare')) throw new Error('--inputs requires one target; probe comparison is unsupported');
  if (command === 'capture-inputs') {
    if (parsed.positional.length || !parsed.options.output || Object.keys(parsed.options).some(key => !['output', 'json','tool-bundle'].includes(key))) throw new Error('capture-inputs requires only --output <new build directory>');
    print(require('./lib/matching/input_set').captureInputSet(parsed.options.output,{toolBundle:parsed.options['tool-bundle']}), parsed.options);
    return;
  }
  if (command === 'watch' || (command === 'probe' && parsed.positional[0] !== 'compare')
      || command === 'doctor' || (['prepare', 'sweep'].includes(command) && !parsed.options['no-compile'])) {
    require('./lib/matching/scratch_assembly').assertScratchEnvironment();
  }
  comparisonQueryProvenanceCache = null;
  if (!parsed.options['scratch-root']) {
    if (command !== 'intake') return executeCommand(command, parsed);
    const api = require('./lib/matching/input_set'), inputs = api.openLiveResearchInputs();
    api.authenticateResearchRuntime(inputs);
    const outputs = [];
    const researchSources = require('./lib/matching/research_source').createResearchSourceSession(inputs);
    await executeCommand(command, parsed, null, (value, options) => outputs.push([value, options]), undefined, inputs, researchSources);
    await researchSources.close();
    for (const [value, options] of outputs) print(value, options);
    return;
  }
  const { resolvePrivateWorkspace, withPrivateWorkspace, assertPrivateWorkspace, assertPrivateControls } = require('./lib/matching/private_workspace');
  const workspace = resolvePrivateWorkspace({ root: ROOT, scratchRoot: parsed.options['scratch-root'], nativeConcurrency: parsed.options['native-concurrency'] || 'parallel', diagnostic: ['watch','probe'].includes(command) && Boolean(parsed.options.source) && !parsed.options['research-compiler'], ...(['intake', 'watch', 'probe'].includes(command) ? { command } : {}) });
  if(command==='preflight'){const result=await require('./lib/matching/preflight').run(parsed.positional,parsed.options,workspace);if(result)print(result,parsed.options);return;}
  if (workspace.admission==='candidate-diagnostic-v1') return executePrivateDiagnostic(command, parsed, workspace);
  if (command === 'history' || command === 'best') return executePrivateDiagnosticQuery(command, parsed, workspace);
  const inputs = parsed.options.inputs ? require('./lib/matching/input_set')[command === 'intake' ? 'openResearchInputSet' : 'openInputSet'](parsed.options.inputs, { privateRoot: workspace.matchingRoot }) : command === 'intake' ? require('./lib/matching/input_set').openLiveResearchInputs({privateRoot: workspace.matchingRoot}) : undefined;
  const selectedPython = inputs ? require('./lib/matching/input_set')[command === 'intake' ? 'authenticateResearchRuntime' : 'authenticateRuntime'](inputs) : undefined;
  if (inputs && process.env.OB64_MATCH_PYTHON && path.resolve(process.env.OB64_MATCH_PYTHON) !== selectedPython) throw new Error('selected input Python override differs');
  if (inputs) workspace.storeOptions = { ...workspace.storeOptions, python: selectedPython, ...(command === "intake" ? { isolatedPython: true } : {}) };
  const outputs = [];
  await withPrivateWorkspace(workspace, { python: selectedPython, isolatedPython: command === "intake", native: command === 'watch' || (command === 'probe' && parsed.positional[0] !== 'compare'), ...(command === 'watch' ? { inputs } : {}) }, async () => {
    const inputSeal = inputs || require('./lib/matching/private_inputs').capturePrivateInputs();
    const researchSources = require('./lib/matching/input_set').isResearch(inputs) ? require('./lib/matching/research_source').createResearchSourceSession(inputs) : undefined;
    await executeCommand(command, parsed, workspace, (value, options) => outputs.push([value, options]), () => inputSeal.assertUnchanged(), inputs, researchSources);
    if (researchSources) await researchSources.close();
    else inputSeal.assertUnchanged();
    if (workspace.admission === 'strict-watch-v1') assertPrivateControls(workspace);
    else assertPrivateWorkspace(workspace);
  });
  // Only the supervised child ran the callback. Publish after wrapper postchecks;
  // the supervisor process has an empty buffer and only forwards child output.
  for (const [value, options] of outputs) print(value, options);
}

// Query the same bounded model identity used by ordinary private candidates.
// Historical records remain visible; scores require current comparison provenance.
async function executePrivateDiagnosticQuery(command, parsed, workspace) {
  const { positional, options } = parsed;
  if (positional.length !== 1) throw new Error(`${command} requires one symbol`);
  const api = require('./lib/matching/input_set');
  const diagnostic = require('./lib/matching/diagnostic_context');
  const scope = require('./lib/matching/private_workspace');
  const inputs = api.openDiagnosticInputs(options.inputs, {privateRoot: workspace.matchingRoot});
  const python = api.authenticateRuntime(inputs);
  if (process.env.OB64_MATCH_PYTHON && path.resolve(process.env.OB64_MATCH_PYTHON) !== python) throw new Error('selected diagnostic Python override differs');
  workspace.storeOptions = {...workspace.storeOptions, python, isolatedPython: true};
  diagnostic.authenticateCode(inputs);
  let output;
  await scope.withPrivateWorkspace(workspace, {python, isolatedPython: true, native: false}, async () => {
    const {context,workbench,target,session}=require('./lib/matching/private_target').prepare(inputs,positional[0],workspace.matchingRoot);
    const rows = requestStore({action: 'query', name: command, args: {
      modelId: workbench.modelId, symbol: target.symbol, symbols: historicalSymbols(target),
      limit: numeric(options.limit, '--limit', 20), includeDetails: true,
      comparisonAlgorithmId: comparisonAlgorithmIdentity(),
      diagnosticCurrentFingerprint: diagnostic.baselineFingerprint(context),
      diagnosticEnvironmentId: loadDiagnosticEnvironment(session).identity,
    }}, workspace.storeOptions).map(row => {
      if (!row.details) return row;
      const {details, ...summary} = row;
      return {...summary, ...compactMismatchEvidence(details), ...compactDiagnosticEvidence(details),
        ...(options['include-details'] ? {details} : {})};
    });
    diagnostic.authenticateCode(inputs);
    await inputs.closeResearch();
    output = {symbol: target.symbol, count: rows.length, rows, diagnosticOnly: true};
  });
  if (output !== undefined) print(output, options);
}

async function executePrivateDiagnostic(command, parsed, workspace) {
  const inputApi=require('./lib/matching/input_set');
  const diagnostic=require('./lib/matching/diagnostic_context');
  const scope=require('./lib/matching/private_workspace');
  const { positional,options }=parsed;
  if(positional.length!==1 || command==='probe'&&positional[0]==='compare')throw new Error('candidate diagnostic requires one target');
  const openingStarted=performance.now();
  const inputs=inputApi.openDiagnosticInputs(options.inputs,{privateRoot:workspace.matchingRoot});
  const python=inputApi.authenticateRuntime(inputs);
  if(process.env.OB64_MATCH_PYTHON && path.resolve(process.env.OB64_MATCH_PYTHON)!==python)throw new Error('selected diagnostic Python override differs');
  workspace.storeOptions={...workspace.storeOptions,python,isolatedPython:true};
  diagnostic.authenticateCode(inputs);
  const started=performance.now(),timings={openingAndRuntimeMs:performance.now()-openingStarted};
  const measure=(name,fn)=>{const start=performance.now();try{return fn();}finally{timings[name]=(timings[name]||0)+performance.now()-start;}};
  await scope.withPrivateWorkspace(workspace,{python,isolatedPython:true,native:true,inputs},async()=>{
    const preparedTarget=measure('targetPreparationMs',()=>require('./lib/matching/private_target').prepare(inputs,positional[0],workspace.matchingRoot));
    const {context,workbench,target}=preparedTarget;
    const source=scope.assertPrivatePath(workspace,path.resolve(options.source));
    const closingChecks=[];
    const storeRequest=(request,storeOptions)=>{
      scope.requireActiveWatchWorkspace(workspace,inputs,ROOT,workspace.matchingRoot);
      return require('./lib/matching/store').requestStore(request,storeOptions);
    };
    const routing={context,inputs,matchingRoot:workspace.matchingRoot,storeOptions:workspace.storeOptions,storeRequest,
      privateWorkspace:true,sourcePath:source,syncTargets:false,deferCompletion:true,closingChecks};
    measure('storePreparationMs',()=>{
      initializeStore(workspace.storeOptions);
      // A scoped record is never advertised as the complete accepted model.
      storeRequest({action:'upsert_targets',records:[require('./lib/matching/target_model').targetRecord(target)]},workspace.storeOptions);
    });
    diagnostic.authenticateCode(inputs);
    const sourceText=fs.readFileSync(source,'utf8');
    let pending;
    if(command==='watch') {
      const session=preparedTarget.session;
      session.measure=measure;
      pending=measure('candidateAndComparisonMs',()=>compileCandidate(workbench,target,sourceText,{...routing,session,origin:'manual-watch',metadata:{sourcePath:portableSourcePath(source)}}));
    } else pending=measure('probeMs',()=>runProbe(workbench,target,sourceText,{...routing,passes:options.passes ? options.passes.split(',').map(s=>s.trim()).filter(Boolean) : null}));
    // Inspect only this invocation's fresh output directory, not historical runs.
    const artifactDirectory=path.dirname(pending.completion.completionReports[0].file);
    let artifactCount=0;
    const collect=directory=>{
      scope.assertPrivatePath(workspace,directory,{regularFile:false});
      for(const name of fs.readdirSync(directory)) {
        if(++artifactCount>256)throw new Error('candidate output artifact bound exceeded');
        const file=scope.assertPrivatePath(workspace,path.join(directory,name),{regularFile:false});
        if(fs.lstatSync(file).isDirectory())collect(file);else inputs.capturePrivateArtifact(file);
      }
    };
    measure('artifactClosingPreparationMs',()=>{
      collect(artifactDirectory);inputs.capturePrivateArtifact(source);
      if(command==='watch')inputs.capturePrivateArtifact(path.join(ROOT,pending.completion.completionReports[0].value.sourcePolicy.source));
    });
    measure('candidateClosingMs',()=>{for(const check of closingChecks)check();});
    diagnostic.authenticateCode(inputs);
    const closeStart=performance.now();await inputs.closeResearch();timings.inputClosingMs=performance.now()-closeStart;
    scope.assertPrivateControls(workspace);
    pending.completion.completionInputs=inputs.consumedPaths();
    const completedReport=pending.completion.completionReports[0].value;
    completedReport.inputAuthentication=inputs.provenance();completedReport.diagnosticOnly=true;completedReport.acceptedFingerprint=context.acceptedFingerprint;
    if(command==='probe')completedReport.reportSha256=require('./lib/matching/probe').reportDigest(completedReport);
    Object.assign(timings,workspace.guardTimings||{});
    return ()=>{
      // Store verifies paths/DB companions while completion can still roll back.
      const stored=measure('completionMs',()=>require('./lib/matching/store').requestStore(pending.completion,workspace.storeOptions));
      const result=command==='watch'?{...comparisonSummary({...pending,compile:stored.run,comparison:stored.comparison}),researchIntake:{available:false,reason:'Use match.js intake for research retrieval; this command checks candidate dependencies.'}}:stored;
      timings.childElapsedMs=performance.now()-started;
      timings.childProcessElapsedMs=process.uptime()*1000;
      print({...result,diagnosticOnly:true,acceptedFingerprint:context.acceptedFingerprint,inputSetId:inputs.id,
        inputAuthentication:inputs.provenance(),nativeConcurrency:workspace.nativeConcurrency,timings},options);
      if(command==='watch'&&stored.run.status!=='compiled' || command==='probe'&&stored.status!=='complete')process.exitCode=2;
    };
  });
}

function validatePrivateOptions(command, options) {
  if(command==='preflight'){
    if(!options.inputs||!options['scratch-root']||!options.output||Object.keys(options).some(k=>!['inputs','scratch-root','output','json'].includes(k)))throw Error('preflight requires only inputs, scratch-root, output and optional json');
    return;
  }
  if (options.apply && command !== 'tail-admit') throw new Error('--apply requires tail-admit');
  if (options.inputs) {
    if (!options['scratch-root'] || !['intake', 'watch', 'probe', 'history', 'best'].includes(command)
        || ['watch', 'probe'].includes(command) && !options.source) throw new Error('--inputs supports guarded intake, history, best, watch --source and probe --source');
    const allowed = new Set(['inputs', 'scratch-root', 'native-concurrency', 'json', 'include-details',
      ...(command === 'intake' ? ['limit', 'cross-limit', 'symptom'] : ['history','best'].includes(command) ? ['limit'] : command === 'watch' ? ['source', 'cross-limit', 'symptom'] : ['source', 'passes'])]);
    for (const key of Object.keys(options)) if (!allowed.has(key)) throw new Error('--inputs does not support --' + key);
  }
  if (options['scratch-root'] && !PRIVATE_COMMANDS.has(command)) throw new Error('--scratch-root is unsupported for ' + command);
  if (options['native-concurrency'] && !options['scratch-root']) throw new Error('--native-concurrency requires --scratch-root');
  if (options['native-concurrency'] && !['serial', 'parallel'].includes(options['native-concurrency'])) throw new Error('--native-concurrency must be serial or parallel');
}

async function executeCommand(command, parsed, workspace = null, emit = print, assertPrivateInputs = undefined, inputs = undefined, researchSources = undefined) {
  const { positional, options } = parsed;
  const routing = workspace ? { matchingRoot: workspace.matchingRoot, storeOptions: workspace.storeOptions, privateWorkspace: true, privatePreparation: {}, assertPrivateInputs, inputs } : {};
  let watchCall;
  if (workspace?.admission === 'strict-watch-v1') {
    const scope = require('./lib/matching/private_workspace');
    const check = storeOptions => {
      scope.requireActiveWatchWorkspace(workspace, inputs, ROOT, routing.matchingRoot);
      if (storeOptions && path.resolve(storeOptions.database || '') !== path.resolve(workspace.storeOptions.database)) throw new Error('private watch store database differs');
    };
    watchCall = (callback, storeOptions) => {
      check(storeOptions);
      let result, failure;
      try { result = callback(); } catch (error) { failure = error || new Error('private watch operation failed', { cause: error }); }
      try { check(storeOptions); } catch (error) { failure = scope.combinePrivateErrors(failure, error); }
      if (failure) throw failure;
      return result;
    };
    routing.watchWorkspace = workspace;
    routing.storeRequest = (request, storeOptions) => {
      if (!storeOptions) throw new Error('private watch store options are required');
      return watchCall(() => require('./lib/matching/store').requestStore(request, storeOptions), storeOptions);
    };
  }
  const requestStore = (request) => require('./lib/matching/store').requestStore(request, routing.storeOptions || {});
  const loadCandidateRun = (id) => latestCandidateRun(id, routing.storeOptions, { ...routing, privateWorkbench: workbench });
  const print = (value, options) => emit(inputs ? { ...value, ...(require("./lib/matching/input_set").isLiveResearch(inputs) ? {} : { inputSetId: inputs.id, acceptedFingerprint: inputs.manifest.accepted.fingerprint }), ...(require("./lib/matching/input_set").isResearch(inputs) ? { inputAuthentication: inputs.provenance() } : {}) } : value, options);
  const intakeRouting = { ...(workspace ? { database: workspace.storeOptions.database, inputs } : {}), ...(researchSources ? { classifyResearchSource: researchSources.classifySource } : {}) };
  const privateFile = (file) => workspace ? require('./lib/matching/private_workspace').assertPrivatePath(workspace, path.resolve(file), { mustExist: true, regularFile: true }) : path.resolve(file);
  const researchOptions=validateKnowledgeOptions({crossLimit:options['cross-limit']===undefined?0:nonnegativeInteger(options['cross-limit'],'--cross-limit'),
    ...(options.symptom===undefined?{}:{symptom:options.symptom})});
  if(command==='intake'){
    if(positional.length!==1)throw new Error('intake requires one symbol');
    if (require('./lib/matching/input_set').isResearch(inputs)) {
      const manifest = JSON.parse(inputs.read('asm/original/rev0/manifest.json'));
      const archive = path.join(ROOT, "docs/dossiers");
      const records = inputs.has(archive) ? fs.readdirSync(inputs.resolve(archive)).filter(name => name.endsWith(".observation.json")).map(name => path.join(archive, name)) : [];
      await inputs.prefetch([...manifest.chunks.flatMap(chunk => chunk.parts.map(part => part.file)), ...records]);
    }
    const model=loadIntakeModel({inputs}),target=resolveTarget(model,positional[0]);
    print(researchPresentation(target.symbol,{workbench:model,limit:numeric(options.limit,'--limit',20),...researchOptions,...intakeRouting}),options);return;
  }
  if (command === 'tail-admit') {
    print(require('./lib/matching/terminal_tail').admit(positional, options), options); return;
  }
  const workbench = loadWorkbenchModel({inputs});
  if (['prepare', 'watch', 'probe'].includes(command) && positional[0]
      && !(command === 'probe' && positional[0] === 'compare')) {
    assertScratchCapability(workbench, resolveTarget(workbench, positional[0]));
  }
  if (options['no-context'] && options['with-context']) throw new Error('--no-context and --with-context cannot be combined');
  if (options['no-context'] && options.runtime) throw new Error('--runtime requires context generation');
  if (command === 'doctor') {
    if (positional.length) throw new Error('doctor takes no positional arguments');
    const initialized = initialize(workbench, { forceTargetSync: true });
    const m2c = resolveM2c(workbench, { m2cRoot: options['m2c-root'] });
    const compiler = prepareCompilerSession();
    print({
      schemaVersion: 1,
      status: 'pass',
      modelId: workbench.modelId,
      acceptedFunctionTargets: workbench.targets.length,
      ordinaryTargets: workbench.targets.filter((target) => target.symbolByteOffset === 0).length,
      store: initialized,
      m2c: { root: m2c.root, commit: m2c.commit, tree: m2c.tree, untracked: m2c.untracked, target: workbench.config.m2c.target },
      compiler: compiler.tool,
      evidenceBoundary: 'The workbench prepares research candidates; canonical verification is unchanged.',
    }, options);
    return;
  }
  initialize(workbench, routing, watchCall);
  if (command === 'import') {
    if (positional.length !== 1 || !options.source || !options.observation) throw new Error('import requires <symbol> --source <candidate.c> --observation <curated.json>');
    const target = resolveTarget(workbench, positional[0]);
    const claims=JSON.parse(fs.readFileSync(privateFile(options.observation),'utf8'));
    const authored=options['capture-identities']?captureIdentities(privateFile(options.source),claims):claims;
    print(importResearch(workbench, target, privateFile(options.source), authored, { ...routing, syncTargets: false }), options);
    return;
  }
  if (command === 'observations') {
    if (positional.length !== 1) throw new Error('observations requires one symbol');
    const target = resolveTarget(workbench, positional[0]);
    print({symbol:target.symbol, observations:researchObservations(target, options.effect, numeric(options.limit, '--limit', 20), routing)}, options);
    return;
  }
  if (command === 'inspect') {
    if (positional.length !== 1) throw new Error('inspect requires one symbol');
    const target = resolveTarget(workbench, positional[0]);
    const families = requestStore({ action: 'query', name: 'families_for_target', args: { targetId: target.targetId, limit: numeric(options.limit, '--limit', 20) } });
    const history = requestStore({ action: 'query', name: 'history', args: {
      modelId: workbench.modelId,
      symbol: target.symbol,
      symbols: historicalSymbols(target),
      limit: 5,
      ...comparisonQueryProvenance({ ...routing, privateTarget: target }),
    } });
    print({ target: publicTarget(target), metrics: targetMetrics(target.expectedBytes, target.vramStart), families, recentExperiments: history }, options);
    return;
  }
  if (command === 'history' || command === 'best') {
    if (positional.length !== 1) throw new Error(`${command} requires one symbol`);
    const target = resolveTarget(workbench, positional[0]);
    const storedRows = requestStore({ action: 'query', name: command, args: {
      modelId: workbench.modelId,
      symbol: target.symbol,
      symbols: historicalSymbols(target),
      limit: numeric(options.limit, '--limit', 20),
      includeDetails: true,
      ...comparisonQueryProvenance({ ...routing, privateTarget: target }),
    } });
    const rows = storedRows.map((row) => {
      if (!row.details) return row;
      const { details, ...summary } = row;
      return {
        ...summary,
        ...compactMismatchEvidence(details),
        ...compactDiagnosticEvidence(details),
        ...(options['include-details'] ? { details } : {}),
      };
    });
    print({ symbol: target.symbol, count: rows.length, rows }, options);
    return;
  }
  if (command === 'watch') {
    if (positional.length !== 1 || !options.source) throw new Error('watch requires <symbol> --source <candidate.c>');
    const target = resolveTarget(workbench, positional[0]);
    const sourceFile = privateFile(options.source);
    const result = compileCandidate(workbench, target, fs.readFileSync(sourceFile, 'utf8'), {
      ...routing,
      ...(workspace ? { sourcePath: sourceFile } : {}),
      origin: 'manual-watch',
      metadata: { sourcePath: portableSourcePath(sourceFile) },
      syncTargets: false,
    });
    const presentResearch = () => researchPresentation(target.symbol,{workbench,...researchOptions,...intakeRouting});
    print({...comparisonSummary(result),researchIntake:watchCall ? watchCall(presentResearch) : presentResearch(),
      ...(workspace ? { nativeConcurrency: workspace.nativeConcurrency, preprocessCache: routing.privatePreparation.preprocessCache, contextPreparation: routing.privatePreparation.contextPreparation } : {})}, options);
    if (result.compile.status !== 'compiled') process.exitCode = 2;
    return;
  }
  if (command === 'classify') {
    if (positional.length !== 1) throw new Error('classify requires one candidate id');
    const record = loadCandidateRun(positional[0]);
    print(publicCandidateRecord(record, { includeSource: options['include-source'], includeDetails: options['include-details'] }), options);
    return;
  }
  if (command === 'compare') {
    if (positional.length !== 2) throw new Error('compare requires two candidate ids');
    const left = loadCandidateRun(positional[0]);
    const right = loadCandidateRun(positional[1]);
    if (!left.run?.object_text || !right.run?.object_text) throw new Error('both candidates require successful object compilations');
    if (left.candidate.target_id !== right.candidate.target_id) throw new Error('candidate comparison requires the same exact target identity');
    const target = [...workbench.targets, ...(workbench.logicalTargets || [])].find((item) => item.targetId === left.candidate.target_id);
    if (!target) throw new Error('candidate comparison requires a target in the currently accepted model');
    const leftRelocationsAvailable = Array.isArray(left.run.relocations);
    const rightRelocationsAvailable = Array.isArray(right.run.relocations);
    const comparison = compareMips(Buffer.from(left.run.object_text, 'base64'), Buffer.from(right.run.object_text, 'base64'), {
      start: target.vramStart,
      expectedRelocations: left.run.relocations,
      expectedRelocationsAvailable: leftRelocationsAvailable,
      expectedRelocationsUnavailableReason: leftRelocationsAvailable ? undefined : 'left candidate relocation evidence is unavailable',
      actualRelocations: right.run.relocations,
      actualRelocationsAvailable: rightRelocationsAvailable,
      actualRelocationsUnavailableReason: rightRelocationsAvailable ? undefined : 'right candidate relocation evidence is unavailable',
      symbolicControlFlow: true,
      symbolicExpectedControlFlow: true,
    });
    print({
      left: { candidateId: positional[0], runId: left.run.run_id, createdAt: left.run.created_at, compilerSha256: left.run.tool?.compilerSha256 },
      right: { candidateId: positional[1], runId: right.run.run_id, createdAt: right.run.created_at, compilerSha256: right.run.tool?.compilerSha256 },
      comparison: compactComparison(comparison, options['include-details']),
      evidenceBoundary: 'Candidate comparison uses raw objects plus symbolic relocation-aware CFG evidence; it does not prove linked addresses or matching acceptance.',
    }, options);
    return;
  }
  if (command === 'case-cfg') {
    if (positional.length !== 1 || !options['case-map']) {
      throw new Error('case-cfg requires <candidate-id> --case-map <map.json>');
    }
    if (options['actual-dispatch'] === undefined || options['actual-body'] === undefined) {
      throw new Error('case-cfg requires --actual-dispatch and --actual-body');
    }
    const record = loadCandidateRun(positional[0]);
    if (!record.run?.object_text) throw new Error('case-cfg requires a successfully compiled candidate');
    const target = [...workbench.targets, ...(workbench.logicalTargets || [])].find((item) => item.targetId === record.candidate.target_id);
    if (!target) throw new Error('case-cfg candidate target is stale or absent from the accepted model');
    const mapFile = path.resolve(options['case-map']);
    const map = JSON.parse(fs.readFileSync(mapFile, 'utf8'));
    if (![1, 2].includes(map.schemaVersion) || map.symbol !== target.symbol || !Array.isArray(map.commands)) {
      throw new Error('case-cfg map does not match the candidate target or supported schema');
    }
    const candidateContract = resolveCandidateComparisonContract(map, positional[0]);
    if (candidateContract?.sourceSha256
        && candidateContract.sourceSha256.toUpperCase() !== String(record.candidate.source_sha256 || '').toUpperCase()) {
      throw new Error(`case-cfg candidate source identity differs from tracked contract for ${positional[0]}`);
    }
    if (candidateContract?.sourceClass && candidateContract.sourceClass !== record.run.source_class) {
      throw new Error(`case-cfg candidate source class differs from tracked contract for ${positional[0]}`);
    }
    const actualTails = actualTailMap(options['actual-tail']);
    if (!actualTails.length) throw new Error('case-cfg requires at least one --actual-tail name=offset mapping');
    const actualBuffer = Buffer.from(record.run.object_text, 'base64');
    const trackedActualDispatch = candidateContract?.actualDispatch || {};
    const actualDispatch = {
      dispatchOffset: nonnegativeInteger(options['actual-dispatch'], '--actual-dispatch'),
      bodyOffset: nonnegativeInteger(options['actual-body'], '--actual-body'),
      valueRegister: nonnegativeInteger(
        trackedActualDispatch.valueRegister ?? map.actualValueRegister ?? map.expectedDispatch.valueRegister,
        'actual value register'),
      initialRegisters: trackedActualDispatch.initialRegisters
        || map.actualInitialRegisters || map.expectedDispatch.initialRegisters,
      localJumpMode: trackedActualDispatch.localJumpMode || 'section-relative',
      ...(trackedActualDispatch.maximumSteps === undefined ? {} : { maximumSteps: trackedActualDispatch.maximumSteps }),
    };
    assertCandidateComparisonInputs(candidateContract, actualDispatch, actualTails, actualBuffer.length);
    const symbolForAddress = (address) => {
      const matches = workbench.targets.filter((item) => item.entryVram === (address >>> 0));
      if (matches.length === 1) return matches[0].symbol;
      return `func_${(address >>> 0).toString(16).toUpperCase().padStart(8, '0')}`;
    };
    const report = compareCaseCfg(target.expectedBytes, actualBuffer, {
      start: target.vramStart,
      symbol: target.symbol,
      commands: map.commands,
      expectedDispatch: map.expectedDispatch,
      actualDispatch,
      expectedTails: map.expectedTails,
      actualTails,
      actualRelocations: record.run.relocations || [],
      symbolForAddress,
      candidate: {
        candidateId: positional[0],
        runId: record.run.run_id,
        sourceClass: record.run.source_class,
      },
    });
    assertCandidateComparisonResult(candidateContract, report);
    report.caseMap = path.relative(ROOT, mapFile).replace(/\\/g, '/');
    const defaultOutput = path.join(ROOT, 'build', 'matching', 'case-cfg', target.symbol, `${positional[0].slice(0, 12)}.json`);
    const outputFile = options.output ? path.resolve(options.output) : defaultOutput;
    fs.mkdirSync(path.dirname(outputFile), { recursive: true });
    fs.writeFileSync(outputFile, `${JSON.stringify(report, null, 2)}\n`);
    print(options['include-details'] ? report : {
      schemaVersion: report.schemaVersion,
      target: report.target,
      candidate: report.candidate,
      comparisonContract: report.comparisonContract,
      commandCount: report.commandCount,
      summary: report.summary,
      resultDigest: report.resultDigest,
      mismatchedCommands: report.commands.filter((row) => !Object.values(row.parity).every(Boolean)).slice(0, 30)
        .map((row) => ({ command: row.command, expectedBlocks: row.expected.blockCount, actualBlocks: row.actual.blockCount, parity: row.parity })),
      mismatchedCommandsOmitted: Math.max(0, report.commandCount - report.summary.exactStructuralCommands - 30),
      report: path.relative(ROOT, outputFile).replace(/\\/g, '/'),
      evidenceBoundary: report.evidenceBoundary,
    }, options);
    return;
  }
  if (command === 'preserve') {
    if (positional.length !== 1) throw new Error('preserve requires one candidate id');
    print(preserveCandidate(workbench, positional[0], options.note, options.observation, { ...routing, privateWorkbench: workbench }), options);
    return;
  }
  if (command === 'prepare') {
    if (positional.length !== 1) throw new Error('prepare requires one symbol');
    const target = resolveTarget(workbench, positional[0]);
    const compilerSession = options['no-compile'] ? null : prepareCompilerSession();
    const contextIndex = options['no-context'] ? null : buildContextIndex(workbench);
    const result = prepareAndCompile(workbench, target, {
      variants: variantSelection(workbench, options.variant),
      compile: !options['no-compile'],
      generateContext: !options['no-context'],
      useContext: options['with-context'] === true,
      runtimeContext: options.runtime,
      contextIndex,
      compilerSession,
      m2cRoot: options['m2c-root'],
      syncTargets: false,
    });
    print({
      symbol: target.symbol,
      assemblyFile: path.relative(ROOT, result.assemblyFile).replace(/\\/g, '/'),
      researchIntake:researchPresentation(target.symbol,{workbench,...researchOptions}),
      contextFile: result.contextFile ? path.relative(ROOT, result.contextFile).replace(/\\/g, '/') : null,
      generation: result.results.map((item) => ({
        variant: item.variant,
        ok: item.ok,
        durationMs: item.durationMs,
        sourceFile: path.relative(ROOT, item.sourceFile).replace(/\\/g, '/'),
        diagnostics: item.diagnostics,
        failure: item.failure,
        stderr: item.stderr,
      })),
      compilations: result.compilations.map((item) => item.result ? { variant: item.variant, ...comparisonSummary(item.result) } : item),
    }, options);
    return;
  }
  if (command === 'sweep') {
    if (positional.length) throw new Error('sweep uses options rather than positional targets');
    const selector = {
      set: options.set || null,
      maxSize: numeric(options['max-size'], '--max-size'),
      leafOnly: Boolean(options['leaf-only']),
      ...(options['include-solved'] ? { includeSolved: true } : {}),
      limit: numeric(options.limit, '--limit'),
    };
    const result = await runSweep(workbench, selector, {
      variantNames: options.variant,
      jobs: numeric(options.jobs, '--jobs', 1),
      compile: !options['no-compile'],
      generateContext: !options['no-context'],
      useContext: options['with-context'] === true,
      runtimeContext: options.runtime,
      m2cRoot: options['m2c-root'],
      onProgress: options.json ? null : (status) => console.log(`[${status.processed}/${status.selected}] ${status.current}: exact=${status.exactBytes} compiled=${status.compileSucceeded} failed=${status.failed}`),
    });
    print(boundedSweepResult(result, options['include-targets'] === true), options);
    return;
  }
  if (command === 'sweep-status') {
    if (positional.length) throw new Error('sweep-status takes no positional arguments');
    const includeTargets = options['include-targets'] === true;
    const sweepProvenance = comparisonQueryProvenance();
    const storedSweeps = requestStore({
      action: 'query',
      name: 'sweeps',
      args: {
        modelId: workbench.modelId,
        limit: numeric(options.limit, '--limit', 20),
        includeTargets,
        targetLimit: 5,
        ...sweepProvenance,
      },
    });
    const sweeps = storedSweeps.map((sweep) => {
      if (includeTargets || sweep.summary?.ensemble) return boundedSweepResult(sweep, includeTargets, 5);
      const complete = requestStore({ action: 'query', name: 'sweep_by_id', args: {
        sweepId: sweep.sweep_id,
        ...sweepProvenance,
      } });
      return boundedSweepResult(complete, false, 5);
    });
    print({
      modelId: workbench.modelId,
      sweeps,
    }, options);
    return;
  }
  if (command === 'family') {
    if (positional[0] === 'build') {
      if (positional.length !== 1) throw new Error('family build takes no other positional arguments');
      const result = buildFamilyAtlas(workbench);
      print({ modelId: result.modelId, counts: result.counts, stored: result.stored }, options);
      return;
    }
    if (positional[0] === 'list') {
      const rows = requestStore({ action: 'query', name: 'family_list', args: {
        modelId: workbench.modelId,
        tier: options.tier || null,
        limit: numeric(options.limit, '--limit', 20),
        includeMembers: options['include-members'] === true,
        memberLimit: 5,
      } });
      print({ modelId: workbench.modelId, count: rows.length, rows }, options);
      return;
    }
    if (positional.length !== 1) throw new Error('family requires build, list, or one symbol');
    const target = resolveTarget(workbench, positional[0]);
    const families = requestStore({ action: 'query', name: 'families_for_target', args: {
      targetId: target.targetId,
      limit: numeric(options.limit, '--limit', 20),
      includeMembers: options['include-members'] === true,
      memberLimit: 5,
    } });
    print({ symbol: target.symbol, targetId: target.targetId, families }, options);
    return;
  }
  if (command === 'context') {
    if (positional.length !== 1) throw new Error('context requires one symbol');
    const target = resolveTarget(workbench, positional[0]);
    const context = storeTargetContext(workbench, target, { runtime: options.runtime, syncTargets: false });
    print(boundedContext(context, options['include-context'] === true), options);
    return;
  }
  if (command === 'rank') {
    if (positional.length) throw new Error('rank uses --lane or --explain');
    if (options.lane && !['leverage', 'batch', 'hard-tail'].includes(options.lane)) throw new Error('unknown rank lane');
    const report = rankTargets(workbench, {
      lane: options.lane || null,
      limit: options.explain ? workbench.targets.length : numeric(options.limit, '--limit', 20),
      skipFamilies: options['skip-families'],
      includeDetails: Boolean(options.explain),
      includeSolved: Boolean(options['include-solved'] || options.explain),
      comparisonCurrentFingerprint: comparisonQueryProvenance().diagnosticCurrentFingerprint,
      comparisonEnvironmentId: comparisonQueryProvenance().diagnosticEnvironmentId,
    });
    if (options.explain) {
      const selected = report.entries.find((item) => item.symbol.toLowerCase() === options.explain.toLowerCase());
      if (!selected) throw new Error(`rank target does not resolve: ${options.explain}`);
      print(selected, options);
    } else print(report, options);
    return;
  }
  if (command === 'probe') {
    if (positional[0] === 'compare') {
      if (positional.length !== 3) throw new Error('probe compare requires two probe report paths');
      print(compareProbes(privateFile(positional[1]), privateFile(positional[2])), options);
      return;
    }
    if (positional.length !== 1) throw new Error('probe requires one symbol');
    const target = resolveTarget(workbench, positional[0]);
    if (options.source && options.candidate) throw new Error('probe --source and --candidate cannot be combined');
    let sourceText, sourcePath, sourceOrigin;
    if (options.source) {
      sourcePath = privateFile(options.source);
      sourceText = fs.readFileSync(sourcePath, 'utf8');
    } else if (options.candidate) {
      const record = loadCandidateRun(options.candidate);
      if (record.candidate.target_id !== target.targetId) throw new Error('probe candidate belongs to a different target');
      sourceText = record.candidate.source_text;
      const origins = [...new Set([record.candidate.metadata?.sourcePath,
        ...record.observations.map(item => item.metadata?.sourcePath)]
        .filter(Boolean).map(item => path.dirname(path.resolve(ROOT, item))))];
      if (!options['source-origin'] && origins.length > 1) throw new Error('probe candidate has multiple source directories; specify --source-origin <original.c>');
      sourceOrigin = options['source-origin'] || (origins.length ? path.join(origins[0], 'candidate.c') : undefined);
      if (workspace && !options['source-origin']) {
        const paths = [...new Set([record.candidate.metadata?.sourcePath,
          ...record.observations.map(item => item.metadata?.sourcePath)].filter(Boolean))];
        if (paths.length !== 1) throw new Error('private candidate probe needs one source path or explicit --source-origin');
        sourceOrigin = paths[0];
      }
      if (sourceOrigin) sourceOrigin = privateFile(path.resolve(ROOT, sourceOrigin));
      if (workspace && !sourceOrigin) throw new Error('private candidate probe requires an authenticated private source origin');
    } else if (target.activeMatchingSource && !workspace) {
      sourcePath = path.join(ROOT, ...target.activeMatchingSource.split('/'));
      sourceText = fs.readFileSync(sourcePath, 'utf8');
    }
    else throw new Error('probe requires --source or --candidate for a target without active matching C');
    if (options['source-origin'] && !options.candidate) throw new Error('probe --source-origin is only for --candidate text');
    const passes = options.passes ? options.passes.split(',').map((item) => item.trim()).filter(Boolean) : null;
    const report = runProbe(workbench, target, sourceText, { ...routing, passes, sourcePath, sourceOrigin, researchCompiler: options['research-compiler'] });
    print({ ...report, ...(workspace ? { nativeConcurrency: workspace.nativeConcurrency, preprocessCache: routing.privatePreparation.preprocessCache, contextPreparation: routing.privatePreparation.contextPreparation } : {}) }, options);
    if (report.status !== 'complete') process.exitCode = 2;
    return;
  }
  throw new Error(`unknown matching workbench command: ${command}`);
}

if (require.main === module) {
  main().catch((error) => {
    console.error(`Matching workbench failed: ${error.message}`);
    process.exitCode = 1;
  });
}

module.exports = {
  boundedContext,
  boundedSweepResult,
  compactComparison,
  compactMismatchEvidence,
  compactRelocationEvidence,
  comparisonSummary,
  main,
  executeCommand,
  latestCandidateRun,
  validatePrivateOptions,
  parseArgs,
  portableSourcePath,
  preserveCandidate,
  publicCandidateRecord,
};
