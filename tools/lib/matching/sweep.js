'use strict';

const path = require('path');
const { Worker } = require('worker_threads');
const { prepareCompilerSession, syncTargets } = require('./compiler');
const {
  M2C_ADAPTER_VERSION,
  createM2cSnapshot,
  prepareAndCompile,
  removeM2cSnapshot,
  resolveM2c,
  validateM2cSnapshot,
} = require('./m2c');
const { targetMetrics } = require('./mips_analysis');
const {
  WORKBENCH_COMPARISON_CONTRACT,
  comparisonAlgorithmIdentity,
  loadDiagnosticEnvironment,
} = require('./diagnostic_link');
const { digest, loadWorkbenchModel } = require('./target_model');
const { requestStore } = require('./store');
const { buildContextIndex } = require('./context');
const { resolveLocalTools } = require('../local_tools');

const SWEEP_WORKER = path.join(__dirname, 'sweep_worker.js');

function selectSweepTargets(workbench, selector = {}) {
  let targets = workbench.targets.filter((target) => target.symbolByteOffset === 0);
  if (!selector.includeSolved && selector.set !== 'smallest-leaves-200') {
    targets = targets.filter((target) => !target.activeMatchingSource);
  }
  const metrics = new Map(targets.map((target) => [target.targetId, targetMetrics(target.expectedBytes, target.vramStart)]));
  if (selector.leafOnly) targets = targets.filter((target) => metrics.get(target.targetId).leaf);
  if (selector.maxSize) targets = targets.filter((target) => target.bytes <= selector.maxSize);
  targets.sort((left, right) => left.bytes - right.bytes || left.romStart - right.romStart);
  if (selector.set === 'smallest-leaves-200') {
    targets = targets.filter((target) => metrics.get(target.targetId).leaf).slice(0, 200);
  } else if (selector.symbols && selector.symbols.length) {
    const wanted = new Set(selector.symbols.map((symbol) => symbol.toLowerCase()));
    targets = targets.filter((target) => wanted.has(target.symbol.toLowerCase()));
  }
  if (selector.limit) targets = targets.slice(0, selector.limit);
  return targets;
}

function summarizeTarget(result) {
  const variants = result.compilations.map((compilation) => {
    const comparison = compilation.result?.comparison?.details || compilation.result?.comparison || null;
    return {
      variant: compilation.variant,
      generated: compilation.generated,
      status: compilation.result?.compile?.status || compilation.status || 'not-compiled',
      candidateId: compilation.result?.candidate?.candidateId || compilation.candidateId || null,
      cached: compilation.result?.cached || false,
      sharedCompileVariant: compilation.result?.sharedCompileVariant || null,
      primaryClass: comparison?.primaryClass || null,
      score: comparison?.score ?? null,
      exactBytes: comparison?.exactBytes === true,
      rawObjectExactBytes: comparison?.rawExactBytes ?? comparison?.exactBytes ?? false,
      diagnosticExactBytes: comparison?.diagnosticExactBytes ?? null,
      relocationMaskedExact: comparison?.relocationMaskedExact || false,
      evidenceMode: comparison?.evidenceMode || null,
      acceptanceEligible: comparison?.acceptanceEligible === true,
      error: compilation.error || compilation.result?.compile?.stderr || null,
    };
  });
  return { variants };
}

function normalizeSweepJobs(value = 1) {
  const jobs = Number(value);
  if (!Number.isInteger(jobs) || jobs <= 0) throw new Error('sweep jobs must be a positive integer');
  if (jobs > 32) throw new Error('sweep jobs must not exceed 32');
  return jobs;
}

function selectSweepVariants(workbench, names = null) {
  if (!names || !names.length) return workbench.config.m2c.variants;
  const requested = new Set(names);
  const variants = workbench.config.m2c.variants.filter((variant) => requested.has(variant.name));
  if (variants.length !== requested.size) {
    const known = new Set(variants.map((variant) => variant.name));
    const unknown = [...requested].filter((name) => !known.has(name));
    throw new Error(`sweep selected unknown m2c variant: ${unknown.join(', ')}`);
  }
  return variants;
}

function sweepGenerationContract(workbench, variants, options, m2c) {
  const configured = workbench.config.m2c;
  if (String(m2c.commit).toLowerCase() !== String(configured.commit).toLowerCase()
      || String(m2c.tree).toLowerCase() !== String(configured.tree).toLowerCase()) {
    throw new Error('resolved m2c identity does not match the workbench generation contract');
  }
  if (options.compile !== false
      && (typeof options.comparisonCurrentFingerprint !== 'string'
        || !options.comparisonCurrentFingerprint
        || typeof options.comparisonEnvironmentId !== 'string'
        || !options.comparisonEnvironmentId)) {
    throw new Error('compile-enabled sweep identity lacks current diagnostic provenance');
  }
  return {
    schemaVersion: 2,
    adapterVersion: M2C_ADAPTER_VERSION,
    m2c: {
      repository: configured.repository,
      commit: configured.commit,
      tree: configured.tree,
      target: configured.target,
    },
    variants: variants.map((variant) => JSON.parse(JSON.stringify(variant))),
    context: {
      generate: options.generateContext !== false,
      use: options.useContext === true,
      runtime: options.runtimeContext === true,
    },
    maximumCapturedOutputBytes: workbench.config.limits.maximumCapturedOutputBytes,
    comparison: {
      contract: WORKBENCH_COMPARISON_CONTRACT,
      algorithmId: comparisonAlgorithmIdentity(),
      currentFingerprint: options.compile === false ? null : options.comparisonCurrentFingerprint,
      environmentId: options.compile === false ? null : options.comparisonEnvironmentId,
    },
  };
}

function buildSweepIdentity(workbench, selector, targets, variants, options, m2c) {
  const generationContract = sweepGenerationContract(workbench, variants, options, m2c);
  const normalizedSelector = {
    ...selector,
    targetCount: targets.length,
    targetSetDigest: digest(targets.map((target) => target.targetId)),
    variants: variants.map((variant) => variant.name),
    compile: options.compile !== false,
    generateContext: options.generateContext !== false,
    useContext: options.useContext === true,
    runtimeContext: options.runtimeContext === true,
    generationContract,
    summaryContract: 5,
  };
  return {
    normalizedSelector,
    generationContractId: digest(generationContract),
    sweepId: digest({ schemaVersion: 1, modelId: workbench.modelId, selector: normalizedSelector }),
  };
}

function assertSweepGenerationContract(workbench, variants, options, m2c, expectedId) {
  const observedId = digest(sweepGenerationContract(workbench, variants, options, m2c));
  if (observedId !== expectedId) {
    const error = new Error(`sweep generation contract drift: expected ${expectedId}, observed ${observedId}`);
    error.code = 'SWEEP_INPUT_DRIFT';
    throw error;
  }
}

function addTargetSummary(summary, targetSummary, variants, targetOrder = null) {
  summary.targets.push(targetSummary);
  if (targetSummary.error) {
    summary.failed += variants.length;
  } else {
    for (const variant of targetSummary.variants || []) {
      if (variant.generated) summary.generated += 1;
      if (variant.status === 'compiled') summary.compileSucceeded += 1;
      if (variant.exactBytes) summary.exactBytes += 1;
      if (variant.relocationMaskedExact && !variant.exactBytes) summary.relocationMaskedExact += 1;
      if (variant.primaryClass) {
        summary.classifications[variant.primaryClass] = (summary.classifications[variant.primaryClass] || 0) + 1;
      }
      if (!variant.generated || variant.status === 'failed') summary.failed += 1;
    }
  }
  if (targetOrder) {
    summary.targets.sort((left, right) => (
      (targetOrder.get(left.symbol) ?? Number.MAX_SAFE_INTEGER)
      - (targetOrder.get(right.symbol) ?? Number.MAX_SAFE_INTEGER)
    ));
  }
  summary.processed = summary.targets.length;
  summary.ensemble = summarizeEnsemble(summary.targets, variants);
  return summary;
}

function runParallelTargets(targets, jobs, workerData, onTarget, runtime = {}) {
  if (!targets.length) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const workers = [];
    const workerStates = new Map();
    const createWorker = runtime.createWorker || ((data) => new Worker(SWEEP_WORKER, { workerData: data }));
    const workerCount = Math.min(jobs, targets.length);
    let cursor = 0;
    let completed = 0;
    let settled = false;

    async function stop(error = null) {
      if (settled) return;
      settled = true;
      await Promise.all(workers.map((worker) => worker.terminate().catch(() => undefined)));
      if (error) reject(error);
      else resolve();
    }

    function dispatch(worker) {
      const state = workerStates.get(worker);
      if (!state || state.inFlight || state.shuttingDown) {
        void stop(new Error('sweep worker dispatch state is invalid'));
        return;
      }
      if (cursor >= targets.length) {
        state.shuttingDown = true;
        worker.postMessage({ type: 'shutdown' });
        return;
      }
      const target = targets[cursor++];
      state.inFlight = target;
      worker.postMessage({ type: 'target', targetId: target.targetId, symbol: target.symbol });
    }

    for (let index = 0; index < workerCount; index += 1) {
      const worker = createWorker(workerData, index);
      workers.push(worker);
      workerStates.set(worker, {
        ready: false,
        inFlight: null,
        shuttingDown: false,
        shutdownAcknowledged: false,
      });
      worker.on('message', (message) => {
        if (settled) return;
        const state = workerStates.get(worker);
        if (message?.type === 'ready') {
          if (state.ready || state.inFlight || state.shuttingDown) {
            void stop(new Error('sweep worker sent an invalid ready message'));
            return;
          }
          state.ready = true;
          dispatch(worker);
          return;
        }
        if (message?.type === 'shutdown-complete') {
          if (!state.shuttingDown || state.inFlight) {
            void stop(new Error('sweep worker sent an invalid shutdown acknowledgement'));
            return;
          }
          state.shutdownAcknowledged = true;
          return;
        }
        if (message?.type === 'fatal') {
          const error = new Error(`sweep worker initialization failed: ${message.error}`);
          if (message.code) error.code = message.code;
          void stop(error);
          return;
        }
        if (message?.type === 'target-error') {
          const symbol = state.inFlight?.symbol || message.symbol || '<unknown>';
          void stop(new Error(`sweep worker failed while processing ${symbol}: ${message.error}`));
          return;
        }
        if (message?.type !== 'result' || !message.target) {
          void stop(new Error('sweep worker returned an invalid message'));
          return;
        }
        if (!state.inFlight || message.target.symbol !== state.inFlight.symbol) {
          void stop(new Error('sweep worker result did not match its assigned target'));
          return;
        }
        try {
          onTarget(message.target);
        } catch (error) {
          void stop(error);
          return;
        }
        state.inFlight = null;
        completed += 1;
        if (completed === targets.length) void stop();
        else dispatch(worker);
      });
      worker.on('error', (error) => void stop(error));
      worker.on('exit', (code) => {
        if (settled) return;
        const state = workerStates.get(worker);
        if (code !== 0) {
          void stop(new Error(`sweep worker exited with code ${code}`));
        } else if (!state.shutdownAcknowledged) {
          const suffix = state.inFlight ? ` while processing ${state.inFlight.symbol}` : '';
          void stop(new Error(`sweep worker exited cleanly without a shutdown acknowledgement${suffix}`));
        }
      });
    }
  });
}

function summarizeEnsemble(targets = [], requestedRuleSets = []) {
  const ruleSetNames = [];
  const seenRuleSets = new Set();
  function addRuleSet(name) {
    if (!name || seenRuleSets.has(name)) return;
    seenRuleSets.add(name);
    ruleSetNames.push(name);
  }
  requestedRuleSets.forEach((ruleSet) => addRuleSet(typeof ruleSet === 'string' ? ruleSet : ruleSet?.name));
  for (const target of targets) {
    for (const variant of target.variants || []) addRuleSet(variant.variant);
  }

  const exactByRuleSet = new Map(ruleSetNames.map((name) => [name, new Map()]));
  for (const target of targets) {
    for (const variant of target.variants || []) {
      if (!variant.exactBytes || !variant.variant) continue;
      if (!exactByRuleSet.has(variant.variant)) exactByRuleSet.set(variant.variant, new Map());
      exactByRuleSet.get(variant.variant).set(target.symbol, variant.candidateId || null);
    }
  }

  const allSymbols = [...new Set(
    [...exactByRuleSet.values()].flatMap((matches) => [...matches.keys()]),
  )].sort();
  const functionMembership = allSymbols.map((symbol) => ({
    symbol,
    matches: ruleSetNames
      .filter((ruleSet) => exactByRuleSet.get(ruleSet)?.has(symbol))
      .map((ruleSet) => ({ ruleSet, candidateId: exactByRuleSet.get(ruleSet).get(symbol) })),
  }));
  const membershipCount = new Map(functionMembership.map((row) => [row.symbol, row.matches.length]));
  const baselineRuleSet = ruleSetNames[0] || null;
  const baselineMatches = baselineRuleSet ? exactByRuleSet.get(baselineRuleSet) : new Map();
  const ruleSets = ruleSetNames.map((name) => {
    const exact = exactByRuleSet.get(name) || new Map();
    const exactSymbols = [...exact.keys()].sort();
    return {
      name,
      exactCount: exactSymbols.length,
      exactSymbols,
      matches: exactSymbols.map((symbol) => ({ symbol, candidateId: exact.get(symbol) })),
      gainedVsBaseline: exactSymbols
        .filter((symbol) => !baselineMatches.has(symbol))
        .map((symbol) => ({ symbol, candidateId: exact.get(symbol) })),
      lostVsBaseline: [...baselineMatches.keys()].filter((symbol) => !exact.has(symbol)).sort(),
      uniqueToRuleSet: exactSymbols
        .filter((symbol) => membershipCount.get(symbol) === 1)
        .map((symbol) => ({ symbol, candidateId: exact.get(symbol) })),
    };
  });
  return {
    schemaVersion: 1,
    baselineRuleSet,
    exactTargetCount: allSymbols.length,
    exactSymbols: allSymbols,
    functionMembership,
    ruleSets,
  };
}

function sweepInputDrift(message, cause = null) {
  const error = new Error(message);
  error.code = 'SWEEP_INPUT_DRIFT';
  if (cause) error.cause = cause;
  return error;
}

function validateSweepCompletion(expected, selector, options, m2c) {
  try {
    validateM2cSnapshot(m2c);
    const current = loadWorkbenchModel();
    if (current.modelId !== expected.modelId) {
      throw new Error(`accepted target model changed from ${expected.modelId} to ${current.modelId}`);
    }
    const targets = selectSweepTargets(current, selector);
    const variants = selectSweepVariants(current, options.variantNames);
    let completionOptions;
    if (options.compile === false) {
      completionOptions = {
        ...options,
        comparisonCurrentFingerprint: null,
        comparisonEnvironmentId: null,
      };
    } else {
      const completionSession = prepareCompilerSession(options);
      completionOptions = {
        ...options,
        comparisonCurrentFingerprint: completionSession.context.currentFingerprint,
        comparisonEnvironmentId: loadDiagnosticEnvironment(completionSession).identity,
      };
    }
    const observed = buildSweepIdentity(current, selector, targets, variants, completionOptions, m2c);
    if (observed.sweepId !== expected.sweepId) {
      throw new Error(`sweep identity changed from ${expected.sweepId} to ${observed.sweepId}`);
    }
  } catch (error) {
    if (error.code === 'SWEEP_INPUT_DRIFT') throw error;
    throw sweepInputDrift(`sweep inputs drifted before completion: ${error.message}`, error);
  }
}

async function runSweep(workbench, selector = {}, options = {}) {
  const storeOptions = options.storeOptions || {};
  const jobs = normalizeSweepJobs(options.jobs || 1);
  if (jobs > 1 && options.generateContext !== false) {
    throw new Error('parallel sweeps require --no-context so workers do not duplicate the context index');
  }
  syncTargets(workbench, storeOptions);
  const diagnosticCompilerSession = options.compile === false ? null : prepareCompilerSession(options);
  const effectiveOptions = {
    ...options,
    comparisonCurrentFingerprint: diagnosticCompilerSession?.context.currentFingerprint || null,
    comparisonEnvironmentId: diagnosticCompilerSession
      ? loadDiagnosticEnvironment(diagnosticCompilerSession).identity : null,
  };
  const authenticatedM2c = resolveM2c(workbench, options);
  const targets = selectSweepTargets(workbench, selector);
  const variants = selectSweepVariants(workbench, options.variantNames);
  if (!variants.length) throw new Error('sweep selected no m2c variants');
  const identity = buildSweepIdentity(workbench, selector, targets, variants, effectiveOptions, authenticatedM2c);
  const { normalizedSelector, sweepId } = identity;
  const existing = requestStore({ action: 'query', name: 'sweep_by_id', args: {
    sweepId,
    comparisonAlgorithmId: comparisonAlgorithmIdentity(),
    diagnosticCurrentFingerprint: effectiveOptions.comparisonCurrentFingerprint,
    diagnosticEnvironmentId: effectiveOptions.comparisonEnvironmentId,
  } }, storeOptions);
  if (existing?.status === 'complete') {
    return {
      schemaVersion: 1,
      sweepId,
      modelId: workbench.modelId,
      selector: existing.selector,
      startedAt: existing.started_at,
      finishedAt: existing.finished_at,
      summary: existing.summary,
      resumed: false,
      cached: true,
    };
  }
  const resumable = existing?.status === 'running' ? existing : null;
  const startedAt = resumable?.started_at || new Date().toISOString();
  const emptySummary = {
    selected: targets.length,
    processed: 0,
    generated: 0,
    compileSucceeded: 0,
    exactBytes: 0,
    relocationMaskedExact: 0,
    failed: 0,
    classifications: {},
    targets: [],
    ensemble: summarizeEnsemble([], variants),
  };
  const summary = resumable?.summary || emptySummary;
  summary.classifications = summary.classifications || {};
  summary.targets = summary.targets || [];
  summary.execution = { jobs, parallel: jobs > 1 };
  const completedSymbols = new Set(summary.targets.map((target) => target.symbol));
  const targetOrder = new Map(targets.map((target, index) => [target.symbol, index]));
  requestStore({ action: 'put_sweep', record: { sweepId, modelId: workbench.modelId, selector: normalizedSelector, status: 'running', summary, startedAt } }, storeOptions);
  const pendingTargets = targets.filter((target) => !completedSymbols.has(target.symbol));

  function checkpoint(targetSummary) {
    addTargetSummary(summary, targetSummary, variants, targetOrder);
    if (options.onProgress) options.onProgress({ ...summary, targets: undefined, current: targetSummary.symbol });
    requestStore({ action: 'put_sweep', record: { sweepId, modelId: workbench.modelId, selector: normalizedSelector, status: 'running', summary, startedAt } }, storeOptions);
  }

  let m2c = null;
  let primaryError = null;
  try {
    m2c = createM2cSnapshot(workbench, authenticatedM2c);
    if (jobs > 1) {
      await runParallelTargets(pendingTargets, jobs, {
        modelId: workbench.modelId,
        generationContractId: identity.generationContractId,
        variantNames: variants.map((variant) => variant.name),
        compile: options.compile !== false,
        generateContext: false,
        useContext: false,
        runtimeContext: false,
        comparisonCurrentFingerprint: effectiveOptions.comparisonCurrentFingerprint,
        comparisonEnvironmentId: effectiveOptions.comparisonEnvironmentId,
        m2c,
        storeOptions,
      }, checkpoint);
    } else {
      validateM2cSnapshot(m2c);
      const compilerSession = diagnosticCompilerSession;
      const contextIndex = options.generateContext === false ? null : buildContextIndex(workbench);
      const localTools = compilerSession?.context.localTools || resolveLocalTools();
      for (const target of pendingTargets) {
        const result = prepareAndCompile(workbench, target, {
          ...options,
          variants,
          compilerSession,
          contextIndex,
          localTools,
          m2c,
          syncTargets: false,
        });
        checkpoint({ symbol: target.symbol, bytes: target.bytes, ...summarizeTarget(result) });
      }
    }
    validateSweepCompletion({ modelId: workbench.modelId, sweepId }, selector, effectiveOptions, m2c);
    const finishedAt = new Date().toISOString();
    summary.durationMs = Date.parse(finishedAt) - Date.parse(startedAt);
    requestStore({ action: 'put_sweep', record: { sweepId, modelId: workbench.modelId, selector: normalizedSelector, status: 'complete', summary, startedAt, finishedAt } }, storeOptions);
    return {
      schemaVersion: 1,
      sweepId,
      modelId: workbench.modelId,
      selector: normalizedSelector,
      startedAt,
      finishedAt,
      summary,
      resumed: Boolean(resumable),
      cached: false,
    };
  } catch (error) {
    primaryError = error;
    if (m2c && primaryError.code !== 'SWEEP_INPUT_DRIFT') {
      try {
        validateM2cSnapshot(m2c);
      } catch (snapshotError) {
        primaryError = sweepInputDrift(`m2c sweep snapshot drifted during a failed attempt: ${snapshotError.message}`, snapshotError);
      }
    }
    if (primaryError.code === 'SWEEP_INPUT_DRIFT') {
      summary.invalidation = { at: new Date().toISOString(), error: primaryError.message };
      requestStore({ action: 'put_sweep', record: {
        sweepId,
        modelId: workbench.modelId,
        selector: normalizedSelector,
        status: 'invalid',
        summary,
        startedAt,
        finishedAt: summary.invalidation.at,
      } }, storeOptions);
    }
    throw primaryError;
  } finally {
    if (m2c) {
      try {
        removeM2cSnapshot(m2c);
      } catch (cleanupError) {
        const context = primaryError ? ` after: ${primaryError.message}` : '';
        process.emitWarning(`m2c sweep snapshot cleanup failed${context}: ${cleanupError.message}`, {
          code: 'OB64_M2C_SNAPSHOT_CLEANUP',
        });
      }
    }
  }
}

module.exports = {
  addTargetSummary,
  assertSweepGenerationContract,
  buildSweepIdentity,
  normalizeSweepJobs,
  runParallelTargets,
  runSweep,
  selectSweepTargets,
  selectSweepVariants,
  sweepGenerationContract,
  summarizeEnsemble,
  summarizeTarget,
};
