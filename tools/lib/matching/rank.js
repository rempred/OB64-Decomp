'use strict';

const fs = require('fs');
const path = require('path');
const { ROOT } = require('../phase7_conventional');
const { targetMetrics } = require('./mips_analysis');
const { requestStore } = require('./store');
const { syncTargets } = require('./compiler');
const { buildContextIndex } = require('./context');

const PRIORITIES_PATH = path.join(ROOT, 'config', 'matching-priorities.json');

function clamp(value, minimum = 0, maximum = 100) {
  return Math.max(minimum, Math.min(maximum, value));
}

function loadPriorities() {
  const config = JSON.parse(fs.readFileSync(PRIORITIES_PATH, 'utf8'));
  if (config.schemaVersion !== 1 || config.profile !== 'us-rev0' || !Array.isArray(config.targets) || !Array.isArray(config.subsystems)) {
    throw new Error('matching priority configuration schema drift');
  }
  const subsystemIds = new Set();
  for (const subsystem of config.subsystems) {
    if (!subsystem || typeof subsystem.id !== 'string' || !subsystem.id || subsystemIds.has(subsystem.id)
        || !Number.isFinite(subsystem.value) || subsystem.value < 0) {
      throw new Error('matching priority subsystem record is malformed or duplicated');
    }
    subsystemIds.add(subsystem.id);
  }
  const targetSymbols = new Set();
  for (const target of config.targets) {
    const symbol = String(target?.symbol || '').toLowerCase();
    if (!symbol || targetSymbols.has(symbol)
        || (target.value !== undefined && (!Number.isFinite(target.value) || target.value < 0))
        || (target.runtimeReach !== undefined && (!Number.isFinite(target.runtimeReach) || target.runtimeReach < 0))
        || (target.subsystem && !subsystemIds.has(target.subsystem))) {
      throw new Error('matching priority target record is malformed, duplicated, or references an unknown subsystem');
    }
    targetSymbols.add(symbol);
  }
  return config;
}

function latestByTarget(rows) {
  const result = new Map();
  for (const row of rows) if (row.origin && !result.has(row.target_id)) result.set(row.target_id, row);
  return result;
}

function familyFacts(workbench, storeOptions) {
  const result = new Map();
  const rows = requestStore({ action: 'query', name: 'family_summaries', args: { modelId: workbench.modelId } }, storeOptions);
  for (const family of rows) {
    const selected = result.get(family.target_id) || [];
    selected.push(family);
    result.set(family.target_id, selected);
  }
  return result;
}

function rankTargets(workbench, options = {}) {
  const storeOptions = options.storeOptions || {};
  syncTargets(workbench, storeOptions);
  const priorities = loadPriorities();
  for (const record of priorities.targets) {
    if (!workbench.bySymbol.has(record.symbol.toLowerCase())) {
      throw new Error(`matching priority target is not in the accepted model: ${record.symbol}`);
    }
  }
  const overrides = new Map(priorities.targets.map((record) => [record.symbol.toLowerCase(), record]));
  const subsystemById = new Map(priorities.subsystems.map((record) => [record.id, record]));
  const compilations = latestByTarget(requestStore({ action: 'query', name: 'compilation_summaries', args: { modelId: workbench.modelId } }, storeOptions));
  const families = options.skipFamilies ? new Map() : familyFacts(workbench, storeOptions);
  const contextIndex = buildContextIndex(workbench);
  const activeByName = new Map(workbench.targets.map((target) => [target.symbol.toLowerCase(), Boolean(target.activeMatchingSource)]));
  const entries = workbench.targets.filter((target) => options.includeSolved || !target.activeMatchingSource).map((target) => {
    const metrics = targetMetrics(target.expectedBytes, target.vramStart);
    const manual = overrides.get(target.symbol.toLowerCase()) || null;
    const targetFamilies = families.get(target.targetId) || [];
    const exactFamily = targetFamilies.find((family) => family.tier === 'exact');
    const structuralFamily = targetFamilies.find((family) => family.tier === 'structural');
    const compile = compilations.get(target.targetId) || null;
    const uniqueCallers = new Set((contextIndex.callersByTarget.get(target.targetId) || []).map((caller) => caller.callerTargetId));
    const valueReasons = [];
    let value = 10;
    if (manual && Number.isFinite(manual.value)) { value += manual.value; valueReasons.push(`manual priority +${manual.value}`); }
    const exactFamilyHasSolvedExemplar = exactFamily && (exactFamily.metadata?.symbols || []).some((symbol) => activeByName.get(symbol.toLowerCase()));
    if (exactFamily) { const gain = Math.min(10, (exactFamily.member_count - 1) * 2); value += gain; valueReasons.push(`exact family +${gain}`); }
    else if (structuralFamily) { const gain = Math.min(8, structuralFamily.member_count - 1); value += gain; valueReasons.push(`structural family +${gain}`); }
    if (manual?.subsystem) {
      const subsystem = subsystemById.get(manual.subsystem);
      value += subsystem.value;
      valueReasons.push(`reviewed subsystem ${subsystem.id} +${subsystem.value}`);
    }
    if (manual?.runtimeReach !== undefined) {
      const gain = Math.min(15, Math.ceil(Math.log2(manual.runtimeReach + 1) * 3));
      value += gain;
      valueReasons.push(`reviewed runtime reach ${manual.runtimeReach} +${gain}`);
    }
    if (uniqueCallers.size) {
      const gain = Math.min(20, Math.ceil(Math.log2(uniqueCallers.size + 1) * 4));
      value += gain;
      valueReasons.push(`${uniqueCallers.size} static caller${uniqueCallers.size === 1 ? '' : 's'} +${gain}`);
    }
    const matchReasons = [];
    let matchability = 100;
    const sizePenalty = Math.min(55, Math.max(0, (target.bytes - 32) / 16));
    matchability -= sizePenalty; matchReasons.push(`size -${sizePenalty.toFixed(1)}`);
    const blockPenalty = Math.min(20, Math.max(0, metrics.blocks - 2) * 2);
    matchability -= blockPenalty; if (blockPenalty) matchReasons.push(`CFG -${blockPenalty}`);
    if (!metrics.leaf) { matchability -= 8; matchReasons.push('calls -8'); }
    if (metrics.indirectJumps) { matchability -= 20; matchReasons.push('indirect control flow -20'); }
    if (metrics.floatingPoint) { matchability -= 8; matchReasons.push('floating point -8'); }
    if (target.symbolByteOffset !== 0) { matchability -= 30; matchReasons.push('pre-label owner prefix -30'); }
    if (exactFamilyHasSolvedExemplar) { matchability += 30; matchReasons.push('matched exact sibling +30'); }
    else if (exactFamily) { matchability += 15; matchReasons.push('exact family +15'); }
    if (compile?.exact_bytes) { matchability += 30; matchReasons.push('scratch exact +30'); }
    else if (compile?.score !== null && compile?.score !== undefined) {
      const gain = Math.round(Number(compile.score) / 10);
      matchability += gain; matchReasons.push(`candidate score +${gain}`);
    }
    value = clamp(value);
    matchability = clamp(matchability);
    let lane = 'hard-tail';
    const reviewedLeverage = Boolean(manual?.subsystem) || Number(manual?.value || 0) >= 20 || uniqueCallers.size >= 8;
    if (reviewedLeverage && value >= 25 && matchability >= 35) lane = 'leverage';
    else if (matchability >= 65) lane = 'batch';
    const displayedMetrics = options.includeDetails ? metrics : {
      instructions: metrics.instructions,
      blocks: metrics.blocks,
      edges: metrics.edges,
      calls: metrics.calls,
      indirectCalls: metrics.indirectCalls,
      indirectJumps: metrics.indirectJumps,
      branches: metrics.branches,
      memoryOperations: metrics.memoryOperations,
      floatingPoint: metrics.floatingPoint,
      leaf: metrics.leaf,
      frameSize: metrics.frameSize,
    };
    return {
      symbol: target.symbol,
      targetId: target.targetId,
      bytes: target.bytes,
      value: Math.round(value * 10) / 10,
      matchability: Math.round(matchability * 10) / 10,
      lane,
      metrics: displayedMetrics,
      staticCallers: uniqueCallers.size,
      manual,
      latestCandidate: compile,
      family: exactFamily ? { tier: 'exact', members: exactFamily.member_count } : structuralFamily ? { tier: 'structural', members: structuralFamily.member_count } : null,
      explanation: { value: valueReasons, matchability: matchReasons },
      missingEvidence: manual?.runtimeReach !== undefined ? [] : ['runtime reach is not scored unless reviewed priority data supplies it'],
    };
  });
  const selected = options.lane ? entries.filter((entry) => entry.lane === options.lane) : entries;
  selected.sort((left, right) => right.value - left.value || right.matchability - left.matchability || left.bytes - right.bytes || left.symbol.localeCompare(right.symbol));
  return { schemaVersion: 1, modelId: workbench.modelId, lane: options.lane || null, total: selected.length, entries: selected.slice(0, options.limit || workbench.config.limits.defaultRows) };
}

module.exports = { PRIORITIES_PATH, loadPriorities, rankTargets };
