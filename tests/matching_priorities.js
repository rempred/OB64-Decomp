'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { ROOT } = require('../tools/lib/phase7_conventional');
const { loadWorkbenchModel, resolveTarget } = require('../tools/lib/matching/target_model');

async function run() {
  const actual = loadWorkbenchModel();
  const config = JSON.parse(fs.readFileSync(path.join(ROOT, 'config/matching-priorities.json'), 'utf8'));
  assert(config.targets.length > 0);
  for (const priority of config.targets) {
    resolveTarget(actual, priority.symbol);
    assert(fs.existsSync(path.join(ROOT, priority.evidence)), `${priority.symbol} evidence is missing`);
  }

  // Exercise the public ranker with deterministic absent history and caller data.
  // Large calling/FP bodies deliberately have poor mechanical matchability.
  const compiler = require('../tools/lib/matching/compiler');
  const store = require('../tools/lib/matching/store');
  const context = require('../tools/lib/matching/context');
  const originals = [compiler.syncTargets, store.requestStore, context.buildContextIndex,
    compiler.prepareCompilerSession, store.initializeStore];
  let forbidOptionalWork = false;
  compiler.syncTargets = () => { assert(!forbidOptionalWork, 'priority lookup synchronized SQLite'); };
  store.requestStore = () => { assert(!forbidOptionalWork, 'priority lookup read SQLite'); return []; };
  compiler.prepareCompilerSession = () => { throw new Error('priority lookup prepared a compiler session'); };
  store.initializeStore = () => { assert(!forbidOptionalWork, 'priority lookup initialized SQLite'); };
  context.buildContextIndex = () => ({ callersByTarget: new Map() });
  const rankPath = require.resolve('../tools/lib/matching/rank');
  delete require.cache[rankPath];
  try {
    const { rankTargets } = require(rankPath);
    const targets = config.targets.map(priority => {
      const original = resolveTarget(actual, priority.symbol);
      const expectedBytes = Buffer.alloc(1600);
      for (let offset = 0; offset < expectedBytes.length - 8; offset += 4) {
        expectedBytes.writeUInt32BE(offset % 8 ? 0x0C000400 : 0x46000000, offset);
      }
      expectedBytes.writeUInt32BE(0x03E00008, expectedBytes.length - 8);
      const { activeMatchingSource, activeMatchingProducer, ...metadata } = original;
      return { ...metadata, bytes: expectedBytes.length, expectedBytes, symbolByteOffset: 8 };
    });
    const workbench = {
      targets,
      bySymbol: new Map(targets.map(target => [target.symbol.toLowerCase(), target])),
      modelId: 'priority-test',
      config: { limits: { defaultRows: targets.length + 1 } },
    };
    const result = rankTargets(workbench, {
      lane: 'leverage', skipFamilies: true,
      comparisonCurrentFingerprint: 'test-current', comparisonEnvironmentId: 'test-environment',
    });
    assert.equal(result.entries.length, config.targets.length);
    for (const entry of result.entries) {
      assert.equal(entry.staticCallers, 0);
      assert(entry.matchability < 35, 'fixture must exercise the previous difficulty exclusion');
      assert.equal(entry.lane, 'leverage');
      assert(entry.missingEvidence.some(message => /runtime reach/.test(message)));
      assert.equal(entry.manual.symbol, entry.symbol);
    }
    const active = { ...targets[0], activeMatchingSource: 'src/fixture/accepted.c' };
    const withActive = {
      ...workbench,
      targets: [active, ...targets.slice(1)],
      bySymbol: new Map([active, ...targets.slice(1)].map(target => [target.symbol.toLowerCase(), target])),
    };
    const options = {
      lane: 'leverage', skipFamilies: true,
      comparisonCurrentFingerprint: 'test-current', comparisonEnvironmentId: 'test-environment',
    };
    const pending = rankTargets(withActive, options);
    assert(!pending.entries.some(entry => entry.symbol === active.symbol));
    assert.equal(pending.entries.length, targets.length - 1);
    const includingSolved = rankTargets(withActive, { ...options, includeSolved: true });
    assert(includingSolved.entries.some(entry => entry.symbol === active.symbol));
    assert.equal(includingSolved.entries.length, targets.length);

    forbidOptionalWork = true;
    const unannotated = { ...targets[0], symbol: 'fixture_unannotated', targetId: 'fixture-unannotated' };
    const fastWorkbench = {
      ...withActive,
      targets: [...withActive.targets, unannotated],
      bySymbol: new Map([...withActive.targets, unannotated].map(target => [target.symbol.toLowerCase(), target])),
    };
    const fast = rankTargets(fastWorkbench, { prioritiesOnly: true });
    assert.deepEqual(fast.entries.map(entry => entry.symbol), pending.entries.map(entry => entry.symbol));
    assert.equal(fast.coverage.candidateHistory, 'omitted');
    assert.equal(fast.coverage.familyEvidence, 'omitted');
    assert.match(fast.coverage.matchingAcceptance, /not evaluated/);
    assert(fast.entries.every(entry => entry.latestCandidate === null && entry.family === null));
    const fastIncludingSolved = rankTargets(fastWorkbench, { prioritiesOnly: true, includeSolved: true });
    assert.deepEqual(fastIncludingSolved.entries.map(entry => entry.symbol), includingSolved.entries.map(entry => entry.symbol));
    assert(!fastIncludingSolved.entries.some(entry => entry.symbol === unannotated.symbol));

    const model = require('../tools/lib/matching/target_model');
    const originalLoad = model.loadWorkbenchModel;
    const commandPath = require.resolve('../tools/match');
    model.loadWorkbenchModel = () => fastWorkbench;
    delete require.cache[commandPath];
    try {
      const { executeCommand, parseArgs } = require(commandPath);
      const parsed = parseArgs([
        '--priorities-only', '--include-solved', '--limit', String(fastWorkbench.targets.length), '--json',
      ]);
      let report;
      await executeCommand('rank', parsed, null, value => { report = value; });
      assert.deepEqual(report, fastIncludingSolved);
      await executeCommand('rank', {
        positional: [], options: { 'priorities-only': true, explain: active.symbol },
      }, null, value => { report = value; });
      assert.equal(report.symbol, active.symbol);
      assert.equal(report.coverage.candidateHistory, 'omitted');
      await assert.rejects(executeCommand('inspect', parsed), /requires rank/);
    } finally {
      model.loadWorkbenchModel = originalLoad;
      delete require.cache[commandPath];
    }
  } finally {
    [compiler.syncTargets, store.requestStore, context.buildContextIndex,
      compiler.prepareCompilerSession, store.initializeStore] = originals;
    delete require.cache[rankPath];
  }
  console.log('Matching priorities tests: PASS');
}

if (require.main === module) run().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
module.exports = { run };
