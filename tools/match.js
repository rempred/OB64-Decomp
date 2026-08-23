#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { ROOT } = require('./lib/phase7_conventional');
const {
  loadWorkbenchModel,
  publicTarget,
  resolveTarget,
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
const { prepareAndCompile, resolveM2c } = require('./lib/matching/m2c');
const { runSweep } = require('./lib/matching/sweep');
const { buildFamilyAtlas } = require('./lib/matching/family');
const { buildContextIndex, storeTargetContext } = require('./lib/matching/context');
const { rankTargets } = require('./lib/matching/rank');
const { compareProbes, runProbe } = require('./lib/matching/probe');

const VALUE_OPTIONS = new Set([
  'limit', 'source', 'candidate', 'variant', 'm2c-root', 'set', 'max-size',
  'lane', 'note', 'research-compiler', 'passes',
]);
const REPEAT_OPTIONS = new Set(['variant']);

function usage() {
  console.log(`Usage: node tools/match.js <command> [arguments]

Core:
  doctor
  inspect <symbol>
  history <symbol> [--limit N] [--include-details]
  best <symbol> [--limit N] [--include-details]
  watch <symbol> --source <candidate.c>
  classify <candidate-id> [--include-details] [--include-source]
  compare <candidate-id> <candidate-id>
  preserve <candidate-id> --note <reason>

Generation:
  prepare <symbol> [--variant structured|gotos|stack] [--with-context] [--no-context] [--no-compile]
  sweep [--set smallest-leaves-200] [--max-size N] [--leaf-only] [--limit N] [--include-solved]
  sweep-status [--limit N] [--include-targets]

Research:
  family build | family <symbol> | family list [--tier <tier>] [--include-members]
  context <symbol> [--runtime] [--include-context]
  rank [--lane leverage|batch|hard-tail] [--limit N]
  rank --explain <symbol>
  probe <symbol> (--source <file> | --candidate <id>) [--passes a,b] [--research-compiler <file>]
  probe compare <left-report.json> <right-report.json>

All generated outputs stay under build/matching. Add --json for structured output.
Use explicit --include-details, --include-members, --include-context, or
--include-targets when the bounded default is not enough.`);
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
      } else options[name] = value;
    } else if ([
      'json', 'no-context', 'with-context', 'no-compile', 'leaf-only', 'runtime', 'skip-families',
      'include-targets', 'include-details', 'include-source', 'include-members', 'include-context', 'include-solved',
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

function print(value, options = {}) {
  if (options.json) {
    console.log(JSON.stringify(value, null, 2));
    return;
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
  if (includeTargets || !Array.isArray(result?.summary?.targets)) return result;
  const targets = result.summary.targets;
  return {
    ...result,
    summary: {
      ...result.summary,
      targets: undefined,
      targetSamples: targets.slice(0, targetLimit),
      targetsOmitted: Math.max(0, targets.length - targetLimit),
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
  const runs = record.runs.map((run) => ({
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
    ...(options.includeDetails ? { details: run.details, tool: run.tool, stderr: run.stderr } : {}),
  }));
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
    opcodeMatches: comparison.opcodeMatches,
    firstDifference: comparison.firstDifference,
    expectedFrame: comparison.expectedFrame,
    actualFrame: comparison.actualFrame,
  };
}

function initialize(workbench, options = {}) {
  const store = initializeStore();
  const targets = syncTargets(workbench, {}, { force: options.forceTargetSync === true });
  return { store, targets };
}

function comparisonSummary(result) {
  const comparison = result.comparison?.details || result.comparison;
  return {
    candidateId: result.candidate.candidateId,
    cached: result.cached,
    status: result.compile.status,
    sourceClass: result.compile.source_class || result.compile.sourceClass,
    primaryClass: comparison?.primaryClass || result.comparison?.primary_class || null,
    score: comparison?.score ?? result.comparison?.score ?? null,
    exactScratchBytes: comparison?.exactBytes ?? Boolean(result.comparison?.exact_bytes),
    relocationMaskedExact: comparison?.relocationMaskedExact ?? Boolean(result.comparison?.relocation_masked_exact),
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

function latestCandidateRun(candidateId) {
  const candidate = requestStore({ action: 'query', name: 'candidate', args: { candidateId } });
  if (!candidate) throw new Error(`candidate does not exist: ${candidateId}`);
  const runs = requestStore({ action: 'query', name: 'candidate_runs', args: { candidateId, limit: 20 } });
  const observations = requestStore({ action: 'query', name: 'candidate_observations', args: { candidateId, limit: 20 } });
  return { candidate, observations, runs, run: runs.find((item) => item.status === 'compiled') || runs[0] || null };
}

function preserveCandidate(workbench, candidateId, note) {
  if (!note) throw new Error('preserve requires --note describing why the candidate is useful');
  const { candidate, run } = latestCandidateRun(candidateId);
  const target = workbench.targets.find((item) => item.targetId === candidate.target_id);
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
    'This source is a research candidate. The original assembly remains the accepted owner.',
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

function main(argv = process.argv.slice(2)) {
  if (!argv.length || argv[0] === '--help' || argv[0] === '-h') { usage(); return; }
  const command = argv[0];
  const parsed = parseArgs(argv.slice(1));
  const { positional, options } = parsed;
  const workbench = loadWorkbenchModel();
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
  initialize(workbench);
  if (command === 'inspect') {
    if (positional.length !== 1) throw new Error('inspect requires one symbol');
    const target = resolveTarget(workbench, positional[0]);
    const families = requestStore({ action: 'query', name: 'families_for_target', args: { targetId: target.targetId, limit: numeric(options.limit, '--limit', 20) } });
    const history = requestStore({ action: 'query', name: 'history', args: { modelId: workbench.modelId, symbol: target.symbol, limit: 5 } });
    print({ target: publicTarget(target), metrics: targetMetrics(target.expectedBytes, target.vramStart), families, recentExperiments: history }, options);
    return;
  }
  if (command === 'history' || command === 'best') {
    if (positional.length !== 1) throw new Error(`${command} requires one symbol`);
    const target = resolveTarget(workbench, positional[0]);
    const rows = requestStore({ action: 'query', name: command, args: {
      modelId: workbench.modelId,
      symbol: target.symbol,
      limit: numeric(options.limit, '--limit', 20),
      includeDetails: options['include-details'] === true,
    } });
    print({ symbol: target.symbol, count: rows.length, rows }, options);
    return;
  }
  if (command === 'watch') {
    if (positional.length !== 1 || !options.source) throw new Error('watch requires <symbol> --source <candidate.c>');
    const target = resolveTarget(workbench, positional[0]);
    const sourceFile = path.resolve(options.source);
    const result = compileCandidate(workbench, target, fs.readFileSync(sourceFile, 'utf8'), {
      origin: 'manual-watch',
      metadata: { sourcePath: portableSourcePath(sourceFile) },
      syncTargets: false,
    });
    print(comparisonSummary(result), options);
    if (result.compile.status !== 'compiled') process.exitCode = 2;
    return;
  }
  if (command === 'classify') {
    if (positional.length !== 1) throw new Error('classify requires one candidate id');
    const record = latestCandidateRun(positional[0]);
    print(publicCandidateRecord(record, { includeSource: options['include-source'], includeDetails: options['include-details'] }), options);
    return;
  }
  if (command === 'compare') {
    if (positional.length !== 2) throw new Error('compare requires two candidate ids');
    const left = latestCandidateRun(positional[0]);
    const right = latestCandidateRun(positional[1]);
    if (!left.run?.object_text || !right.run?.object_text) throw new Error('both candidates require successful object compilations');
    if (left.candidate.target_id !== right.candidate.target_id) throw new Error('candidate comparison requires the same exact target identity');
    const target = workbench.targets.find((item) => item.targetId === left.candidate.target_id);
    if (!target) throw new Error('candidate comparison requires a target in the currently accepted model');
    const comparison = compareMips(Buffer.from(left.run.object_text, 'base64'), Buffer.from(right.run.object_text, 'base64'), { start: target.vramStart });
    print({
      left: { candidateId: positional[0], runId: left.run.run_id, createdAt: left.run.created_at, compilerSha256: left.run.tool?.compilerSha256 },
      right: { candidateId: positional[1], runId: right.run.run_id, createdAt: right.run.created_at, compilerSha256: right.run.tool?.compilerSha256 },
      comparison: compactComparison(comparison, options['include-details']),
    }, options);
    return;
  }
  if (command === 'preserve') {
    if (positional.length !== 1) throw new Error('preserve requires one candidate id');
    print(preserveCandidate(workbench, positional[0], options.note), options);
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
    const result = runSweep(workbench, selector, {
      variantNames: options.variant,
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
    print({
      modelId: workbench.modelId,
      sweeps: requestStore({
        action: 'query',
        name: 'sweeps',
        args: {
          modelId: workbench.modelId,
          limit: numeric(options.limit, '--limit', 20),
          includeTargets: options['include-targets'] === true,
          targetLimit: 5,
        },
      }),
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
      print(compareProbes(positional[1], positional[2]), options);
      return;
    }
    if (positional.length !== 1) throw new Error('probe requires one symbol');
    const target = resolveTarget(workbench, positional[0]);
    let sourceText;
    if (options.source) sourceText = fs.readFileSync(path.resolve(options.source), 'utf8');
    else if (options.candidate) sourceText = latestCandidateRun(options.candidate).candidate.source_text;
    else if (target.activeMatchingSource) sourceText = fs.readFileSync(path.join(ROOT, ...target.activeMatchingSource.split('/')), 'utf8');
    else throw new Error('probe requires --source or --candidate for a target without active matching C');
    const passes = options.passes ? options.passes.split(',').map((item) => item.trim()).filter(Boolean) : null;
    print(runProbe(workbench, target, sourceText, { passes, researchCompiler: options['research-compiler'] }), options);
    return;
  }
  throw new Error(`unknown matching workbench command: ${command}`);
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(`Matching workbench failed: ${error.message}`);
    process.exitCode = 1;
  }
}

module.exports = {
  boundedContext,
  boundedSweepResult,
  compactComparison,
  comparisonSummary,
  main,
  parseArgs,
  portableSourcePath,
  preserveCandidate,
  publicCandidateRecord,
};
