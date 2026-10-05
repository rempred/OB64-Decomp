'use strict';
// No native tools or real stores are loaded: these are command-routing contracts.
const assert = require('assert/strict');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const test = require('node:test');
const ROOT = process.cwd();
const PRIVATE = path.join(ROOT, 'build', 'matching', 'w1');
const SOURCE = path.join(PRIVATE, 'candidate.c');
const workspace = { root: ROOT, matchingRoot: PRIVATE, storeOptions: { database: path.join(PRIVATE, 'workbench.sqlite') }, nativeConcurrency: 'parallel' };

function fixture({ drift = false, guardDrift = false, entryArgs = null } = {}) {
  const calls = [], output = [], errors = [];
  const record = { candidate: { candidate_id: 'candidate', target_id: 'target', source_text: 'void f(void){}', metadata: { sourcePath: path.relative(ROOT, SOURCE) } }, observations: [], runs: [] };
  const comparison = { rawExactBytes: false, rawRelocationMaskedExact: null, diagnosticExactBytes: null, evidenceMode: 'symbolic-object', diagnostic: { status: 'unavailable', reason: 'inactive owner' }, relocationEvidence: { expected: { available: false }, actual: { available: true, count: 1 } } };
  const run = { run_id: 'run', status: 'compiled', source_class: 'PURE_C', object_text: Buffer.alloc(4).toString('base64'), relocations: [{ type: 'R_MIPS_32' }], details: comparison };
  record.runs = [run];
  const target = { symbol: 'func_80000000', targetId: 'target', expectedBytes: Buffer.alloc(4), vramStart: 0x80000000 };
  const workbench = { targets: [target], modelId: 'model' };
  const log = (name, result) => (...args) => { calls.push({ name, args }); return typeof result === 'function' ? result(...args) : result; };
  const modules = {
    './lib/phase7_conventional': { ROOT },
    './lib/matching/target_model': { loadWorkbenchModel: log('model', workbench), resolveTarget: () => target, publicTarget: x => x, historicalSymbols: () => [target.symbol], assertScratchCapability: () => {} },
    './lib/matching/store': {
      initializeStore: log('init', {}),
      requestStore: log('store', request => request.name === 'candidate' ? record.candidate : request.name === 'candidate_runs' ? record.runs : []),
    },
    './lib/matching/compiler': { syncTargets: log('sync', {}), prepareCompilerSession: log('session', { context: { currentFingerprint: 'current' } }), compileCandidate: log('compile', { candidate: { candidateId: 'candidate' }, compile: run, comparison }) },
    './lib/matching/scratch_assembly': require('../tools/lib/matching/scratch_assembly'),
    './lib/matching/diagnostic_link': { comparisonAlgorithmIdentity: () => 'algorithm', loadDiagnosticEnvironment: () => ({ identity: 'environment' }) },
    './lib/matching/mips_analysis': { targetMetrics: () => ({}), compareMips: log('compare', comparison) },
    './lib/matching/research': { importResearch: log('import', {}), observations: log('observations', []), preserveResearch: log('preserve', {}), captureIdentities: log('capture', {}) },
    './lib/matching/intake': { loadIntakeModel: () => workbench, presentation: log('intake', {}), formatHuman: () => '' },
    './lib/matching/knowledge': { validateOptions: x => x },
    './lib/matching/probe': { runProbe: log('probe', { status: 'complete' }), compareProbes: log('probeCompare', {}) },
    './lib/matching/private_inputs': { capturePrivateInputs: log('inputSeal', () => ({ assertUnchanged: log('inputPostcheck', undefined) })) },
    './lib/matching/private_workspace': {
      resolvePrivateWorkspace: log('resolveWorkspace', options => ({...workspace, nativeConcurrency: options.nativeConcurrency})),
      withPrivateWorkspace: log('guard', async (_workspace, _options, callback) => { await callback(); if (guardDrift) throw Error('guard postcheck failed'); }),
      assertPrivateWorkspace: log('postcheck', () => { if (drift) throw Error('workspace drift'); }),
      assertPrivatePath: log('privatePath', (_workspace, file) => { if (!file.startsWith(PRIVATE + path.sep)) throw Error('outside private root'); return file; }),
    },
  };
  const module = { exports: {} };
  const requireMock = name => name === 'fs' ? { ...fs, readFileSync: () => '{}' } : name === 'path' ? path : modules[name] || {};
  if (entryArgs) requireMock.main = module;
  const processMock = { argv: ['node', 'match.js', ...(entryArgs || [])], exitCode: 0 };
  vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'tools/match.js'), 'utf8'), { module, require: requireMock, Buffer, process: processMock, console: { log: x => output.push(x), error: x => errors.push(x) } }, { filename: 'match.js' });
  return { cli: module.exports, calls, output, errors, process: processMock };
}

test('direct CLI startup can query candidates before the module finishes exporting', async () => {
  for (const suffix of [[], ['--scratch-root', 'build/matching/w1']]) {
    for (const args of [['classify', 'candidate'], ['compare', 'left', 'right'], ['probe', 'func_80000000', '--candidate', 'candidate']]) {
      const f = fixture({ entryArgs: [...args, ...suffix, '--json'] });
      await new Promise(resolve => setImmediate(resolve));
      assert.equal(f.process.exitCode, 0, f.errors.join('\n'));
      assert.equal(f.errors.length, 0);
      assert.equal(f.output.length, 1);
      const queries = f.calls.filter(call => call.name === 'store');
      assert(queries.some(call => call.args[0].name === 'candidate'));
      for (const query of queries) assert.equal(query.args[1]?.database, suffix.length ? workspace.storeOptions.database : undefined);
    }
  }
});

test('private options reject duplicate roots, unsupported commands and invalid native mode before model IO', async () => {
  for (const args of [ ['watch', '--scratch-root', 'a', '--scratch-root', 'b'], ['prepare', '--scratch-root', 'build/matching/w1'], ['watch', '--native-concurrency', 'serial'], ['watch', '--scratch-root', 'build/matching/w1', '--native-concurrency', 'unsafe'] ]) {
    const f = fixture(); await assert.rejects(f.cli.main(args)); assert.equal(f.calls.length, 0);
  }
});

test('private watch and probe default to parallel and report explicit serial fallback', async () => {
  for (const mode of [null, 'parallel', 'serial']) {
    for (const command of ['watch', 'probe']) {
      const f = fixture();
      await f.cli.main([command, 'func_80000000', '--source', SOURCE, '--scratch-root', 'build/matching/w1',
        ...(mode ? ['--native-concurrency', mode] : []), '--json']);
      assert.equal(f.calls.find(x => x.name === 'resolveWorkspace').args[0].nativeConcurrency, mode || 'parallel');
      assert.equal(JSON.parse(f.output[0]).nativeConcurrency, mode || 'parallel');
      assert.equal(f.calls.find(x => x.name === 'guard').args[1].native, true);
    }
  }
});

test('intake stays read-only and selects private DB plus existing dossier presentation', async () => {
  const f = fixture(); await f.cli.main(['intake', 'func_80000000', '--scratch-root', 'build/matching/w1']);
  const intake = f.calls.find(x => x.name === 'intake'); assert.equal(intake.args[1].database, workspace.storeOptions.database);
  assert.equal(f.calls.some(x => x.name === 'init' || x.name === 'sync' || x.name === 'store'), false);
  assert.equal(f.calls.find(x => x.name === 'guard').args[1].native, false);
});

test('watch routes startup, source, compiler, intake and explicit raw evidence', async () => {
  const f = fixture(); await f.cli.main(['watch', 'func_80000000', '--source', SOURCE, '--scratch-root', 'build/matching/w1', '--json']);
  assert.equal(f.calls.find(x => x.name === 'init').args[0].database, workspace.storeOptions.database);
  assert.equal(f.calls.find(x => x.name === 'sync').args[1].database, workspace.storeOptions.database);
  const options = f.calls.find(x => x.name === 'compile').args[3]; assert.equal(options.matchingRoot, PRIVATE); assert.equal(options.sourcePath, SOURCE); assert.equal(options.privateWorkspace, true); assert.equal(options.storeOptions.database, workspace.storeOptions.database);
  assert.equal(f.calls.find(x => x.name === 'intake').args[1].database, workspace.storeOptions.database);
  assert.equal(f.calls.find(x => x.name === 'guard').args[1].native, true);
  const output = JSON.parse(f.output[0]); assert.equal(output.rawExactBytes, false); assert.equal(output.rawRelocationMaskedExact, null); assert.equal(output.diagnosticExactBytes, null); assert.equal(output.diagnostic.status, 'unavailable'); assert.equal(output.actualRelocations.length, 1);
});

test('every stored query for classify, compare, inspect, history and best uses private database', async () => {
  for (const [command, args] of [['classify', ['candidate']], ['compare', ['left', 'right']], ['inspect', ['func_80000000']], ['history', ['func_80000000']], ['best', ['func_80000000']]]) {
    const f = fixture(); await f.cli.main([command, ...args, '--scratch-root', 'build/matching/w1']);
    const queries = f.calls.filter(x => x.name === 'store'); assert.ok(queries.length); for (const query of queries) assert.equal(query.args[1].database, workspace.storeOptions.database);
    const sessions = f.calls.filter(x => x.name === 'session'); assert.equal(sessions.length, 1);
    assert.equal(sessions[0].args[0].matchingRoot, PRIVATE); assert.equal(sessions[0].args[0].privateTarget.targetId, 'target');
  }
});

test('research import, observation and explicit preservation use private routes', async () => {
  for (const [command, args, name, optionIndex] of [['import', ['func_80000000', '--source', SOURCE, '--observation', path.join(PRIVATE, 'claims.json')], 'import', 4], ['observations', ['func_80000000'], 'observations', 3], ['preserve', ['candidate', '--observation', 'observation', '--note', 'selected evidence'], 'preserve', 4]]) {
    const f = fixture(); await f.cli.main([command, ...args, '--scratch-root', 'build/matching/w1']);
    const options = f.calls.find(x => x.name === name).args[optionIndex]; assert.equal(options.storeOptions.database, workspace.storeOptions.database); assert.equal(options.matchingRoot, PRIVATE);
  }
});

test('probe source and candidate use private output root and candidate database; compare rejects cross-root reports', async () => {
  for (const args of [['--source', SOURCE], ['--candidate', 'candidate']]) {
    const f = fixture(); await f.cli.main(['probe', 'func_80000000', ...args, '--scratch-root', 'build/matching/w1']);
    const options = f.calls.find(x => x.name === 'probe').args[3]; assert.equal(options.matchingRoot, workspace.matchingRoot); assert.equal(options.storeOptions.database, workspace.storeOptions.database);
    if (args[0] === '--candidate') {
      assert.equal(options.sourceOrigin, SOURCE);
      const preparationOptions = f.calls.find(x => x.name === 'session').args[0];
      assert.equal(preparationOptions.privatePreparation, options.privatePreparation);
      assert.equal(preparationOptions.assertPrivateInputs, options.assertPrivateInputs);
      assert.equal(typeof options.assertPrivateInputs, 'function');
    }
  }
  const f = fixture(); await assert.rejects(f.cli.main(['probe', 'compare', path.join(PRIVATE, 'a.json'), path.join(ROOT, 'build/matching/w2/b.json'), '--scratch-root', 'build/matching/w1']), /outside private root/); assert.equal(f.calls.some(x => x.name === 'probeCompare'), false);
});

test('post-command rejection suppresses buffered success report', async () => {
  const f = fixture({ drift: true }); await assert.rejects(f.cli.main(['intake', 'func_80000000', '--scratch-root', 'build/matching/w1']), /workspace drift/); assert.equal(f.output.length, 0);
  const g = fixture({ guardDrift: true }); await assert.rejects(g.cli.main(['intake', 'func_80000000', '--scratch-root', 'build/matching/w1']), /guard postcheck failed/); assert.equal(g.output.length, 0);
});

test('default watch preserves existing routing and avoids private guard', async () => {
  const f = fixture(); await f.cli.main(['watch', 'func_80000000', '--source', SOURCE]);
  const options = f.calls.find(x => x.name === 'compile').args[3]; assert.equal(options.matchingRoot, undefined); assert.equal(options.sourcePath, undefined); assert.equal(f.calls.some(x => x.name === 'guard'), false);
});
