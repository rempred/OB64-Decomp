'use strict';

const path = require('path');
const { ROOT } = require('../phase7_conventional');
const { prepareContext } = require('../current_workflow');
const { createDiffPreprocessCache } = require('../diff_preprocess_cache');
const { createDiffProfiler } = require('../diff_profile');
const { resolvePrivateWorkspace, assertPrivatePath, assertPrivateWorkspace } = require('./private_workspace');

function preparePrivateContext(options = {}) {
  if (options.privateWorkspace !== true || !options.matchingRoot) throw new Error('private context preparation requires an explicit private root');
  const workspace = resolvePrivateWorkspace({ root: ROOT, scratchRoot: options.matchingRoot });
  const cacheRoot = assertPrivatePath(workspace, path.join(workspace.matchingRoot, 'preprocess'), { mustExist: false, regularFile: false });
  const target = options.privateTarget;
  const activeSource = target?.activeMatchingSource || target?.activeMatchingProducer?.source;
  const state = options.privatePreparation;
  if (state?.context) {
    const sources = state.context.phase8.targets.filter(item => item.symbol.toLowerCase() === target?.symbol?.toLowerCase()).map(item => item.source);
    if (activeSource) sources.push(activeSource);
    if (state.matchingRoot !== workspace.matchingRoot || sources.some(source => !state.requestedSources.includes(source))) throw new Error('private prepared context does not cover requested fresh producer');
    return state.context;
  }
  const profile = createDiffProfiler();
  let cache, requestedSources, context;
  try { context = prepareContext({
    profile,
    contextPreprocessFactory(targets) {
      const symbolMatches = target ? targets.filter(item => item.symbol.toLowerCase() === target.symbol.toLowerCase()) : [];
      if (symbolMatches.length > 1) throw new Error('private preprocessing target is ambiguous');
      if (activeSource && !targets.some(item => item.source === activeSource)) throw new Error('private preprocessing producer is absent from active model');
      // A group shares the producer source, so every member remains fresh.
      requestedSources = [...new Set([...symbolMatches.map(item => item.source), ...(activeSource ? [activeSource] : [])])];
      cache = createDiffPreprocessCache({ cacheRoot, requestedSources });
      return {
        preprocess: cache.preprocess,
        finish() {
          try { cache.finish(); }
          finally { assertPrivateWorkspace(workspace); }
        },
      };
    },
  }); } finally {
    const contextPreparation = profile.finish({ command: 'private-context', status: context ? 'pass' : 'error' });
    if (state) Object.assign(state, { preprocessCache: cache?.stats || null, contextPreparation });
  }
  if (state) Object.assign(state, { context, matchingRoot: workspace.matchingRoot, requestedSources });
  return context;
}

module.exports = { preparePrivateContext };
