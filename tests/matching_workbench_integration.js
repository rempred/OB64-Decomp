#!/usr/bin/env node
'use strict';

const { loadWorkbenchModel, resolveTarget } = require('../tools/lib/matching/target_model');
const { prepareAndCompile } = require('../tools/lib/matching/m2c');
const { prepareCompilerSession, syncTargets } = require('../tools/lib/matching/compiler');
const { buildContextIndex } = require('../tools/lib/matching/context');

function main() {
  const workbench = loadWorkbenchModel();
  const target = resolveTarget(workbench, 'memcpy_bytewise');
  syncTargets(workbench);
  const result = prepareAndCompile(workbench, target, {
    variants: [workbench.config.m2c.variants.find((variant) => variant.name === 'structured')],
    compilerSession: prepareCompilerSession(),
    contextIndex: buildContextIndex(workbench),
    syncTargets: false,
  });
  const compilation = result.compilations[0]?.result;
  const comparison = compilation?.comparison?.details || compilation?.comparison;
  if (!compilation || compilation.compile.status !== 'compiled' || !comparison || !comparison.exactBytes) {
    throw new Error(`matching workbench integration fixture did not compile exact: ${JSON.stringify(result.compilations)}`);
  }
  const repeated = prepareAndCompile(workbench, target, {
    variants: [workbench.config.m2c.variants.find((variant) => variant.name === 'structured')],
    compilerSession: prepareCompilerSession(),
    contextIndex: buildContextIndex(workbench),
    syncTargets: false,
  }).compilations[0]?.result;
  if (!repeated?.cached || repeated.candidate.candidateId !== compilation.candidate.candidateId) {
    throw new Error('identical generated target/source did not reuse its exact compile result');
  }
  console.log(`Matching workbench integration: PASS (${target.symbol}, ${target.bytes} exact bytes, repeat cached)`);
}

if (require.main === module) main();

module.exports = { main };
