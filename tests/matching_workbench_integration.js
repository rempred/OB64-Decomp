#!/usr/bin/env node
'use strict';

const { loadWorkbenchModel, resolveTarget } = require('../tools/lib/matching/target_model');
const { prepareAndCompile } = require('../tools/lib/matching/m2c');
const { prepareCompilerSession, syncTargets } = require('../tools/lib/matching/compiler');
const { buildContextIndex } = require('../tools/lib/matching/context');
const { requestStore } = require('../tools/lib/matching/store');

function main() {
  const workbench = loadWorkbenchModel();
  const target = resolveTarget(workbench, 'memcpy_bytewise');
  const ruleSetNames = [
    'structured',
    'structured-abi-gaps',
    'structured-load-first',
    'structured-return-flow',
    'structured-cursor-steps',
    'structured-masked-local',
  ];
  const variants = workbench.config.m2c.variants.filter((variant) => ruleSetNames.includes(variant.name));
  const compilerSession = prepareCompilerSession();
  const contextIndex = buildContextIndex(workbench);
  syncTargets(workbench);
  const result = prepareAndCompile(workbench, target, {
    variants,
    compilerSession,
    contextIndex,
    syncTargets: false,
  });
  const compilations = result.compilations.map((row) => row.result);
  if (compilations.length !== ruleSetNames.length || compilations.some((compilation) => {
    const comparison = compilation?.comparison?.details || compilation?.comparison;
    return !compilation || compilation.compile.status !== 'compiled' || !comparison?.exactBytes;
  })) {
    throw new Error(`matching workbench integration fixture did not compile exact: ${JSON.stringify(result.compilations)}`);
  }
  if (new Set(compilations.map((compilation) => compilation.candidate.candidateId)).size !== 1) {
    throw new Error('identical ruleset source did not retain one exact candidate identity');
  }
  if (result.results.some((generation) => generation.sharedGenerationVariants.join(',') !== ruleSetNames.join(','))) {
    throw new Error('identical ruleset inputs did not share one m2c generation');
  }
  if (result.compilations.slice(1).some((row) => row.result.sharedCompileVariant !== 'structured')) {
    throw new Error('identical ruleset source did not share the baseline compile');
  }
  const candidateId = compilations[0].candidate.candidateId;
  const observations = requestStore({ action: 'query', name: 'candidate_observations', args: { candidateId, limit: 200 } });
  const observedVariants = new Set(observations.map((observation) => observation.variant));
  if (ruleSetNames.some((name) => !observedVariants.has(name))) {
    throw new Error('shared candidate compile lost ruleset provenance');
  }
  const repeated = prepareAndCompile(workbench, target, {
    variants,
    compilerSession,
    contextIndex,
    syncTargets: false,
  }).compilations.map((row) => row.result);
  if (repeated.some((compilation) => !compilation?.cached || compilation.candidate.candidateId !== candidateId)) {
    throw new Error('identical generated target/source did not reuse its exact compile result');
  }
  console.log(`Matching workbench integration: PASS (${target.symbol}, ${target.bytes} exact bytes, six rulesets, one generation/compile, repeat cached)`);
}

if (require.main === module) main();

module.exports = { main };
