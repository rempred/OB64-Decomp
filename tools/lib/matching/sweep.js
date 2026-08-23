'use strict';

const { prepareCompilerSession, syncTargets } = require('./compiler');
const { M2C_ADAPTER_VERSION, prepareAndCompile, resolveM2c } = require('./m2c');
const { targetMetrics } = require('./mips_analysis');
const { digest } = require('./target_model');
const { requestStore } = require('./store');
const { buildContextIndex } = require('./context');

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
      primaryClass: comparison?.primaryClass || null,
      score: comparison?.score ?? null,
      exactBytes: comparison?.exactBytes || false,
      relocationMaskedExact: comparison?.relocationMaskedExact || false,
      error: compilation.error || compilation.result?.compile?.stderr || null,
    };
  });
  return { variants };
}

function runSweep(workbench, selector = {}, options = {}) {
  const storeOptions = options.storeOptions || {};
  syncTargets(workbench, storeOptions);
  const m2c = resolveM2c(workbench, options);
  const targets = selectSweepTargets(workbench, selector);
  const variants = options.variantNames && options.variantNames.length
    ? workbench.config.m2c.variants.filter((variant) => options.variantNames.includes(variant.name))
    : workbench.config.m2c.variants;
  if (!variants.length) throw new Error('sweep selected no m2c variants');
  const normalizedSelector = {
    ...selector,
    targetCount: targets.length,
    variants: variants.map((variant) => variant.name),
    compile: options.compile !== false,
    generateContext: options.generateContext !== false,
    useContext: options.useContext === true,
    adapterVersion: M2C_ADAPTER_VERSION,
    summaryContract: 2,
    m2cCommit: m2c.commit,
  };
  const sweepId = digest({ schemaVersion: 1, modelId: workbench.modelId, selector: normalizedSelector, m2cCommit: m2c.commit });
  const existing = requestStore({ action: 'query', name: 'sweep_by_id', args: { sweepId } }, storeOptions);
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
  const startedAt = existing?.started_at || new Date().toISOString();
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
  };
  const summary = existing?.summary || emptySummary;
  summary.classifications = summary.classifications || {};
  summary.targets = summary.targets || [];
  const completedSymbols = new Set(summary.targets.map((target) => target.symbol));
  requestStore({ action: 'put_sweep', record: { sweepId, modelId: workbench.modelId, selector: normalizedSelector, status: 'running', summary, startedAt } }, storeOptions);
  const compilerSession = options.compile === false ? null : prepareCompilerSession(options);
  const contextIndex = options.generateContext === false ? null : buildContextIndex(workbench);
  for (const target of targets) {
    if (completedSymbols.has(target.symbol)) continue;
    let result;
    try {
      result = prepareAndCompile(workbench, target, {
        ...options,
        variants,
        compilerSession,
        contextIndex,
        syncTargets: false,
      });
      const targetSummary = { symbol: target.symbol, bytes: target.bytes, ...summarizeTarget(result) };
      summary.targets.push(targetSummary);
      for (const variant of targetSummary.variants) {
        if (variant.generated) summary.generated += 1;
        if (variant.status === 'compiled') summary.compileSucceeded += 1;
        if (variant.exactBytes) summary.exactBytes += 1;
        if (variant.relocationMaskedExact && !variant.exactBytes) summary.relocationMaskedExact += 1;
        if (variant.primaryClass) {
          summary.classifications[variant.primaryClass] = (summary.classifications[variant.primaryClass] || 0) + 1;
        }
        if (!variant.generated || variant.status === 'failed') summary.failed += 1;
      }
    } catch (error) {
      summary.targets.push({ symbol: target.symbol, bytes: target.bytes, error: error.message, variants: [] });
      summary.failed += variants.length;
    }
    summary.processed += 1;
    if (options.onProgress) options.onProgress({ ...summary, targets: undefined, current: target.symbol });
    requestStore({ action: 'put_sweep', record: { sweepId, modelId: workbench.modelId, selector: normalizedSelector, status: 'running', summary, startedAt } }, storeOptions);
  }
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
    resumed: Boolean(existing),
    cached: false,
  };
}

module.exports = { runSweep, selectSweepTargets };
