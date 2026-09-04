'use strict';

const { parentPort, workerData } = require('worker_threads');
const { prepareCompilerSession } = require('./compiler');
const { loadDiagnosticEnvironment } = require('./diagnostic_link');
const { buildContextIndex } = require('./context');
const { prepareAndCompile, validateM2cSnapshot } = require('./m2c');
const { loadWorkbenchModel } = require('./target_model');
const { resolveLocalTools } = require('../local_tools');
const {
  assertSweepGenerationContract,
  selectSweepVariants,
  summarizeTarget,
} = require('./sweep');

function initialize() {
  const workbench = loadWorkbenchModel();
  if (workbench.modelId !== workerData.modelId) {
    const error = new Error(`accepted target model changed: ${workbench.modelId}`);
    error.code = 'SWEEP_INPUT_DRIFT';
    throw error;
  }
  const variants = selectSweepVariants(workbench, workerData.variantNames);
  try {
    validateM2cSnapshot(workerData.m2c);
  } catch (error) {
    error.code = 'SWEEP_INPUT_DRIFT';
    throw error;
  }
  assertSweepGenerationContract(workbench, variants, workerData, workerData.m2c, workerData.generationContractId);
  const compilerSession = workerData.compile ? prepareCompilerSession() : null;
  if (compilerSession
      && compilerSession.context.currentFingerprint !== workerData.comparisonCurrentFingerprint) {
    const error = new Error('parallel sweep worker CURRENT provenance differs from the parent sweep contract');
    error.code = 'SWEEP_INPUT_DRIFT';
    throw error;
  }
  if (compilerSession
      && loadDiagnosticEnvironment(compilerSession).identity !== workerData.comparisonEnvironmentId) {
    const error = new Error('parallel sweep worker diagnostic environment differs from the parent sweep contract');
    error.code = 'SWEEP_INPUT_DRIFT';
    throw error;
  }
  const contextIndex = workerData.generateContext ? buildContextIndex(workbench) : null;
  const localTools = compilerSession?.context.localTools || resolveLocalTools();
  const targets = new Map(workbench.targets.map((target) => [target.targetId, target]));
  return { workbench, variants, compilerSession, contextIndex, localTools, targets };
}

let state;
try {
  state = initialize();
  parentPort.postMessage({ type: 'ready' });
} catch (error) {
  parentPort.postMessage({ type: 'fatal', error: error.message, code: error.code || null });
}

parentPort.on('message', (message) => {
  if (message?.type === 'shutdown') {
    parentPort.postMessage({ type: 'shutdown-complete' });
    parentPort.close();
    return;
  }
  if (message?.type !== 'target' || !state) return;
  const target = state.targets.get(message.targetId);
  if (!target || target.symbol !== message.symbol) {
    parentPort.postMessage({
      type: 'target-error',
      symbol: message.symbol || '<unknown>',
      error: 'parallel sweep target identity did not resolve',
    });
    return;
  }
  try {
    const result = prepareAndCompile(state.workbench, target, {
      variants: state.variants,
      compile: workerData.compile,
      generateContext: workerData.generateContext,
      useContext: workerData.useContext,
      runtimeContext: workerData.runtimeContext,
      compilerSession: state.compilerSession,
      contextIndex: state.contextIndex,
      localTools: state.localTools,
      m2c: workerData.m2c,
      storeOptions: workerData.storeOptions || {},
      syncTargets: false,
    });
    parentPort.postMessage({
      type: 'result',
      target: { symbol: target.symbol, bytes: target.bytes, ...summarizeTarget(result) },
    });
  } catch (error) {
    parentPort.postMessage({
      type: 'target-error',
      symbol: target.symbol,
      error: error.message,
    });
  }
});
