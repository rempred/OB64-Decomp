#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { ROOT } = require('../tools/lib/phase7_conventional');
const { loadWorkbenchModel, resolveTarget } = require('../tools/lib/matching/target_model');
const { prepareAndCompile } = require('../tools/lib/matching/m2c');
const { compileCandidate, prepareCompilerSession, syncTargets } = require('../tools/lib/matching/compiler');
const { buildContextIndex } = require('../tools/lib/matching/context');
const { requestStore } = require('../tools/lib/matching/store');

function requireCondition(condition, message) {
  if (!condition) throw new Error(message);
}

function compileReport(compilation) {
  const relative = compilation.compile.artifact_dir;
  const file = path.join(ROOT, ...relative.split('/'), 'workbench-report.json');
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function comparisonDetails(compilation) {
  return compilation?.comparison?.details || compilation?.comparison;
}

function assertLengthCandidate(compilation, target, relation, label) {
  const comparison = comparisonDetails(compilation);
  requireCondition(compilation.compile.status === 'compiled', `${label} scratch candidate did not compile`);
  requireCondition(compilation.compile.source_class === 'PURE_C', `${label} scratch candidate lost PURE_C classification`);
  requireCondition(comparison?.primaryClass === 'length-mismatch', `${label} scratch candidate was not scored as a length mismatch`);
  const actualBytes = Buffer.from(compilation.compile.object_text, 'base64').length;
  requireCondition(actualBytes === comparison.actualBytes, `${label} scratch comparison did not use the emitted symbol size`);
  requireCondition(relation(actualBytes, target.bytes), `${label} scratch candidate length was not on the expected side of the accepted owner`);
  const report = compileReport(compilation);
  requireCondition(report.scratchContract?.primarySymbol?.bytes === actualBytes,
    `${label} scratch report did not record the emitted symbol size`);
  requireCondition(report.scratchContract.textSection.functionBytes === actualBytes,
    `${label} scratch report did not slice text to the primary symbol`);
  requireCondition(report.scratchContract.textSection.trailingAlignmentBytes <= 12,
    `${label} scratch report exceeded the bounded alignment tail`);
}

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
  const baselineReport = compileReport(compilations[0]);
  requireCondition(baselineReport.scratchContract?.kind === 'single-function-scratch-object',
    'exact integration compile did not record the scratch compiler contract');
  requireCondition(baselineReport.scratchContract.primarySymbol.name === target.symbol
    && baselineReport.scratchContract.primarySymbol.bytes === target.bytes
    && baselineReport.scratchContract.primarySymbol.binding === 'GLOBAL'
    && baselineReport.scratchContract.primarySymbol.visibility === 'DEFAULT',
  'exact integration compile recorded malformed primary-symbol evidence');
  requireCondition(baselineReport.scratchContract.textSection.functionBytes === target.bytes
    && baselineReport.scratchContract.textSection.trailingAlignmentBytes <= 12,
  'exact integration compile did not isolate the emitted function extent');

  const shorterSource = `
void *memcpy_bytewise(void *destination, const void *source, unsigned int bytes)
{
    (void)source;
    (void)bytes;
    return destination;
}
`;
  const longerSource = `
typedef unsigned char u8;

void *memcpy_bytewise(void *destination, const void *source, unsigned int bytes)
{
    volatile u8 *output;
    const u8 *input;
    unsigned int index;

    output = (volatile u8 *)destination;
    input = (const u8 *)source;
    for (index = 0; index < bytes; index++) {
        output[index] = input[index];
    }
    output[0] = (u8)(output[0] ^ 0x11);
    output[1] = (u8)(output[1] ^ 0x22);
    output[2] = (u8)(output[2] ^ 0x33);
    output[3] = (u8)(output[3] ^ 0x44);
    output[4] = (u8)(output[4] ^ 0x55);
    output[5] = (u8)(output[5] ^ 0x66);
    output[6] = (u8)(output[6] ^ 0x77);
    output[7] = (u8)(output[7] ^ 0x88);
    return destination;
}
`;
  const wrongSymbolSource = `
int scratch_wrong_symbol(int value)
{
    return value + 1;
}
`;
  const readOnlyDataSource = `
extern int scratch_case_0(void);
extern int scratch_case_1(void);
extern int scratch_case_2(void);
extern int scratch_case_3(void);
extern int scratch_case_4(void);
extern int scratch_case_5(void);
extern int scratch_case_6(void);
extern int scratch_case_7(void);

int memcpy_bytewise(int value)
{
    switch (value) {
    case 0: return scratch_case_0();
    case 1: return scratch_case_1();
    case 2: return scratch_case_2();
    case 3: return scratch_case_3();
    case 4: return scratch_case_4();
    case 5: return scratch_case_5();
    case 6: return scratch_case_6();
    case 7: return scratch_case_7();
    default: return -1;
    }
}
`;
  const secondaryFunctionSource = `
void *memcpy_bytewise(void *destination, const void *source, unsigned int bytes)
{
    (void)source;
    (void)bytes;
    return destination;
}

int scratch_secondary_function(int value)
{
    return value + 1;
}
`;
  const compileScratchFixture = (source, variant) => compileCandidate(workbench, target, source, {
    origin: 'matching-workbench-integration',
    variant,
    session: compilerSession,
    syncTargets: false,
  });
  const shorter = compileScratchFixture(shorterSource, 'scratch-shorter');
  const longer = compileScratchFixture(longerSource, 'scratch-longer');
  assertLengthCandidate(shorter, target, (actual, accepted) => actual < accepted, 'shorter');
  assertLengthCandidate(longer, target, (actual, accepted) => actual > accepted, 'longer');

  const readOnlyData = compileScratchFixture(readOnlyDataSource, 'scratch-read-only-data');
  const readOnlyReport = compileReport(readOnlyData);
  requireCondition(readOnlyData.compile.status === 'compiled'
    && readOnlyData.compile.relocations.some((relocation) => relocation.symbol === '.rodata')
    && readOnlyReport.scratchContract.readOnlyData?.bytes > 0
    && readOnlyReport.scratchContract.textRelocations.length === readOnlyData.compile.relocations.length,
  'scratch compiler did not preserve diagnostic .rodata and normalized text relocations');

  const wrongSymbol = compileScratchFixture(wrongSymbolSource, 'scratch-wrong-symbol');
  requireCondition(wrongSymbol.compile.status === 'failed'
    && /requested global function symbol is malformed/.test(wrongSymbol.compile.stderr),
  'scratch compiler accepted a missing/wrong requested symbol');
  const secondaryFunction = compileScratchFixture(secondaryFunctionSource, 'scratch-secondary-function');
  requireCondition(secondaryFunction.compile.status === 'failed'
    && /must contain exactly one function symbol/.test(secondaryFunction.compile.stderr),
  'scratch compiler accepted an unexpected secondary function');

  const repeated = prepareAndCompile(workbench, target, {
    variants,
    compilerSession,
    contextIndex,
    syncTargets: false,
  }).compilations.map((row) => row.result);
  if (repeated.some((compilation) => !compilation?.cached || compilation.candidate.candidateId !== candidateId)) {
    throw new Error('identical generated target/source did not reuse its exact compile result');
  }
  console.log(`Matching workbench integration: PASS (${target.symbol}, ${target.bytes} exact bytes, six rulesets, one generation/compile, shorter/longer scored, .rodata relocations preserved, malformed symbols rejected, repeat cached)`);
}

if (require.main === module) main();

module.exports = { main };
