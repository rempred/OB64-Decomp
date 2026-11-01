'use strict';
const assert = require('assert/strict');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const test = require('node:test');
const ROOT = process.cwd();
const FIXTURES = path.join(ROOT, 'build/private-preparation-tests');
fs.mkdirSync(FIXTURES, { recursive: true });
const policy = require(path.join(ROOT, 'tools/lib/source_policy'));
const { createDiffPreprocessCache } = require(path.join(ROOT, 'tools/lib/diff_preprocess_cache'));
function load(name, modules, processOverride = process) {
  const module = { exports: {} };
  const req = key => modules[key] || (key === './diagnostic_context' ? require('../tools/lib/matching/diagnostic_context') : key === './scratch_assembly' ? require('../tools/lib/matching/scratch_assembly')
    : ['./input_set', './matching/input_set'].includes(key) ? require('../tools/lib/matching/input_set')
    : ['fs', 'path', 'crypto', 'util', 'child_process'].includes(key) ? require(key) : {});
  const file = path.join(ROOT, name === 'current_workflow.js' ? 'tools/lib' : 'tools/lib/matching', name);
  req.resolve = require('node:module').createRequire(file).resolve;
  vm.runInNewContext(fs.readFileSync(file, 'utf8'), { module, require: req, Buffer, process: processOverride, __filename: file });
  return module.exports;
}
const relative = file => path.relative(ROOT, file).replace(/\\/g, '/');
const identity = file => ({ path: relative(file), bytes: fs.statSync(file).size, sha256: policy.sha256File(file) });
function fixture(watch = false) {
  const root = fs.mkdtempSync(path.join(FIXTURES, 'fixture-'));
  const sourceRoot = path.join(root, 'sources'), includeRoot = path.join(root, 'include'), matchingRoot = path.join(root, 'w1');
  for (const p of [sourceRoot, includeRoot, matchingRoot]) fs.mkdirSync(p);
  const source = path.join(sourceRoot, 'sibling.c'), requested = path.join(sourceRoot, 'producer.c'), header = path.join(includeRoot, 'unit.h');
  const cpp = path.join(root, 'cpp'), config = path.join(root, 'config.json'), manifest = path.join(root, 'manifest.json'), implementation = path.join(root, 'implementation.js');
  fs.writeFileSync(source, '#include "unit.h"\nword sibling(void) { return 1; }\n');
  fs.writeFileSync(requested, 'int producer(void) { return 2; }\n');
  fs.writeFileSync(header, 'typedef int word;\n');
  fs.writeFileSync(cpp, 'fake cpp'); fs.writeFileSync(manifest, '{}'); fs.writeFileSync(implementation, 'fake implementation');
  fs.writeFileSync(config, JSON.stringify({ matchingCompiler: { manifest: relative(manifest) } }));
  const preprocessor = () => ({ path: cpp, sha256: policy.sha256File(cpp), version: 'fixture', executables: [{ ...identity(cpp), role: 'driver', version: 'fixture' }], flags: ['-P', '-undef', '-nostdinc'], includeDirectories: [includeRoot], dependencyRoot: ROOT, dependencyMode: 'authenticated-depfile', dependencyTarget: 'ob64-compilation-input', configIdentity: identity(config), matchingCompiler: { manifestSha256: policy.sha256File(manifest), executableSha256: 'A'.repeat(64), preprocessingMode: 'authenticated-external-companion' } });
  const calls = [], caches = [], environment = { FIXTURE: 'stable' };
  let classificationFailure = false, drift = null;
  const group = { id: 'group' };
  const targets = [{ symbol: 'sibling', source: relative(source), bytes: 4 }, { symbol: 'leader', source: relative(requested), bytes: 4, compilationGroup: group }, { symbol: 'member', source: relative(requested), bytes: 4, compilationGroup: group }];
  const fresh = (file, pp, extra) => {
    calls.push(path.resolve(file));
    const sourceText = fs.readFileSync(file, 'utf8');
    const dependencies = policy.dependencyIdentities(sourceText.includes('#include') ? [file, header] : [file], file);
    const bytes = Buffer.from(sourceText.replace('#include "unit.h"', fs.readFileSync(header, 'utf8')));
    const includes = [...new Set([path.dirname(file), ...pp.includeDirectories, ...extra].map(relative))];
    return { ok: true, bytes, text: bytes.toString(), stderr: '', args: [...pp.flags, '-MD', '-MF', path.join(root, 'unused.d'), '-MT', pp.dependencyTarget, ...includes.flatMap(p => ['-I', p]), relative(file)], source: dependencies.find(d => d.path === relative(file)), dependencies };
  };
  const work = load('current_workflow.js', {
    './phase7_conventional': { ROOT },
    './verification_profile': { measure(_profile, name, callback) {
      if (name === 'prepare.local-tools') return {};
      if (name === 'prepare.baserom') return {};
      if (name === 'prepare.active-target-model') return { model: {}, targets };
      if (name === 'prepare.baseline-fingerprint') return 'baseline';
      if (name === 'prepare.current-fingerprint') { if (drift) drift(); return 'current'; }
      return callback();
    } },
    './source_policy': { classifyTargetSources(rows, options) {
      if (classificationFailure) throw Error('classification failed');
      return policy.classifyTargetSources(rows, { ...options, preprocessor: preprocessor(), preprocess: options.preprocess || fresh });
    } },
    './diff_preprocess_cache': { createDiffPreprocessCache() { throw Error('shared diff cache used'); } },
  });
  let watchApi, watchWorkspace;
  if (watch) {
    const crypto = require('crypto'), key = crypto.createHash('sha256').update(matchingRoot.toLowerCase()).digest('hex');
    const processStub = {pid: 101, ppid: 102, execPath: process.execPath, env:{OB64_PRIVATE_GUARD:key},
      argv:[process.execPath,path.join(ROOT,'tools/match.js'),'watch','member','--source',path.join(matchingRoot,'candidate.c'),'--scratch-root',matchingRoot]};
    watchApi = load('private_workspace.js', {}, processStub);
    watchWorkspace = {root:ROOT, matchingRoot, storeOptions:{database:path.join(matchingRoot,'workbench.sqlite')},nativeConcurrency:'parallel',admission:'strict-watch-v1'};
    fs.writeFileSync(path.join(matchingRoot,'.private-guard.json'),JSON.stringify({pid:101,supervisorPid:102,rootKey:key,native:false,admission:'strict-watch-v1',
      commandSha256:crypto.createHash('sha256').update(JSON.stringify([processStub.execPath,...processStub.argv.slice(1)])).digest('hex')}));
  }
  const helper = load('private_preparation.js', {
    '../phase7_conventional': { ROOT }, '../current_workflow': work,
    '../diff_profile': require(path.join(ROOT, 'tools/lib/diff_profile')),
    './private_workspace': watchApi || {
      resolvePrivateWorkspace(options) { assert.equal(options.root, ROOT); return { matchingRoot: options.scratchRoot }; },
      assertPrivatePath(workspace, file) { assert.equal(file, path.join(workspace.matchingRoot, 'preprocess')); return file; },
      assertPrivateWorkspace() {},
    },
    '../diff_preprocess_cache': { createDiffPreprocessCache(options) {
      assert.ok(options.cacheRoot.startsWith(root + path.sep), 'cache must stay in the fixture private root');
      const cache = createDiffPreprocessCache({ ...options, preprocessSource: fresh, resolvePreprocessor: preprocessor, implementationFiles: [implementation], getEnvironment: () => environment });
      const finish = cache.finish; let finished = false;
      cache.finish = () => { finished = true; return finish(); };
      caches.push({ cache, options, get finished() { return finished; } }); return cache;
    } },
  });
  const options = { privateWorkspace: true, matchingRoot, privateTarget: { symbol: 'member', activeMatchingSource: relative(requested) },...(watch ? {watchWorkspace} : {}) };
  return { root, source, requested, header, cpp, implementation, environment, calls, caches, work, helper, options,
    setFailure(value) { classificationFailure = value; }, setDrift(value) { drift = value; },
    guarded: callback => watchApi.withPrivateWorkspace(watchWorkspace,{native:true,inputs:undefined},callback) };
}

test('private preparation reuses sibling CPP only; grouped requested producer and classification stay fresh', () => {
  const f = fixture(), a = f.helper.preparePrivateContext(f.options), b = f.helper.preparePrivateContext(f.options);
  assert.equal(f.calls.filter(p => p === f.source).length, 1);
  assert.equal(f.calls.filter(p => p === f.requested).length, 2);
  assert.equal(f.caches[1].cache.stats.hits, 1); assert.equal(f.caches[1].cache.stats.requested, 1);
  assert.ok(f.caches.every(c => c.finished));
  assert.equal(JSON.stringify(a.sourcePolicy), JSON.stringify(b.sourcePolicy));
  assert.notEqual(a.sourcePolicy, b.sourcePolicy);
  assert.equal(f.caches[0].options.cacheRoot, path.join(f.options.matchingRoot, 'preprocess'));
  const w2 = path.join(f.root, 'w2'); fs.mkdirSync(w2);
  f.helper.preparePrivateContext({ ...f.options, matchingRoot: w2 });
  assert.equal(f.caches[2].cache.stats.hits, 0); assert.equal(f.calls.filter(p => p === f.source).length, 2);
});

test('same-size header/source edits and environment/tool changes invalidate private sibling CPP', () => {
  const f = fixture(); f.helper.preparePrivateContext(f.options);
  for (const change of [() => fs.writeFileSync(f.header, 'typedef int WORD;\n'), () => fs.writeFileSync(f.source, fs.readFileSync(f.source, 'utf8').replace('return 1', 'return 3')), () => { f.environment.FIXTURE = 'changed'; }, () => fs.writeFileSync(f.cpp, 'fake CPp')]) {
    change(); f.helper.preparePrivateContext(f.options); assert.equal(f.caches.at(-1).cache.stats.hits, 0);
  }
});

test('finish rejects dependency, environment and implementation drift before prepared context returns', () => {
  for (const kind of ['header', 'environment', 'implementation']) {
    const f = fixture(); f.helper.preparePrivateContext(f.options);
    f.setDrift(() => { if (kind === 'environment') f.environment.FIXTURE = 'changed'; else fs.appendFileSync(f[kind], ' changed'); });
    assert.throws(() => f.helper.preparePrivateContext(f.options), /drift/);
    assert.equal(f.caches.at(-1).finished, true);
  }
});

test('execution tag reuses sibling CPP across invocations while requested producer stays fresh', () => {
  const f = fixture(); f.environment.CODEX_TOOL_CALL_ID = 'tag-A';
  const first = f.helper.preparePrivateContext(f.options);
  f.environment.CODEX_TOOL_CALL_ID = 'tag-B';
  const second = f.helper.preparePrivateContext(f.options);
  assert.equal(f.caches[1].cache.stats.hits, 1);
  assert.equal(f.calls.filter(file => file === f.source).length, 1);
  assert.equal(f.calls.filter(file => file === f.requested).length, 2);
  assert.equal(JSON.stringify(first.sourcePolicy), JSON.stringify(second.sourcePolicy));
  assert.ok(f.caches.every(record => record.finished));
});

test('tag-only finish drift cannot escape real private preparation to later native/store work', async () => {
  for (const warm of [false, true]) for (const mutation of ['change', 'add', 'remove', 'empty']) {
    const f = fixture(true);
    if (mutation !== 'add') f.environment.CODEX_TOOL_CALL_ID = 'tag-A';
    if (warm) await f.guarded(() => f.helper.preparePrivateContext(f.options));
    f.setDrift(() => {
      if (mutation === 'remove') delete f.environment.CODEX_TOOL_CALL_ID;
      else f.environment.CODEX_TOOL_CALL_ID = mutation === 'empty' ? '' : 'tag-B';
    });
    let laterNativeOrStore = 0;
    await assert.rejects(f.guarded(() => {
      f.helper.preparePrivateContext(f.options); laterNativeOrStore++;
    }), /environment drift at finish/);
    assert.equal(laterNativeOrStore, 0);
    assert.equal(f.caches.at(-1).finished, true);
    assert.equal(f.caches.at(-1).cache.stats.hits, warm ? 1 : 0);
  }
});

test('preparation failures still finish the private cache and cannot return a context', () => {
  const f = fixture(); f.setFailure(true);
  assert.throws(() => f.helper.preparePrivateContext(f.options), /classification failed/); assert.equal(f.caches[0].finished, true);
  assert.throws(() => f.helper.preparePrivateContext({}), /explicit private root/);
  assert.throws(() => f.helper.preparePrivateContext({ ...f.options, privateTarget: { symbol: 'missing', activeMatchingSource: 'src/missing.c' } }), /absent from active model/);
});

test('ordinary prepareContext remains fresh and never creates or finishes a private cache', () => {
  const f = fixture(); const a = f.work.prepareContext(), b = f.work.prepareContext();
  assert.equal(f.caches.length, 0); assert.equal(f.calls.filter(p => p === f.source).length, 2);
  assert.equal(JSON.stringify(a.sourcePolicy), JSON.stringify(b.sourcePolicy));
  assert.throws(() => f.work.prepareContext({ contextPreprocessFactory: () => ({}), diffPreprocessSymbol: 'sibling' }), /conflicts/);
});

test('one private command reuses one sealed context and exposes existing profiler/cache counters', () => {
  const f = fixture(), privatePreparation = {};
  const options = { ...f.options, privatePreparation };
  const first = f.helper.preparePrivateContext(options), second = f.helper.preparePrivateContext(options);
  assert.equal(first, second); assert.equal(f.caches.length, 1); assert.equal(f.caches[0].finished, true);
  assert.equal(privatePreparation.preprocessCache.requested, 1);
  assert.equal(privatePreparation.contextPreparation.status, 'pass');
  assert.equal(typeof privatePreparation.contextPreparation.totalMs, 'number');
  assert.throws(() => f.helper.preparePrivateContext({ ...options, privateTarget: { symbol: 'sibling' } }), /fresh producer/);
  const inactive = fixture();
  inactive.helper.preparePrivateContext({ ...inactive.options, privateTarget: { symbol: 'inactive' } });
  assert.equal(inactive.caches[0].options.requestedSources.length, 0);
});

test('actual compiler session entry dispatches private helper only with explicit private mode', () => {
  const context = { localTools: { compiler: __filename }, phase8: { model: {}, config: { compiler: { compileFlags: [] } }, toolchain: { identity: 'toolchain' } } };
  const calls = [];
  const compiler = load('compiler.js', {
    '../phase7_conventional': { ROOT, sha256File: policy.sha256File },
    '../current_workflow': { prepareContext() { calls.push('default'); return context; } },
    './private_preparation': { preparePrivateContext(options) { calls.push(options); return context; } },
    '../phase8_matching_c': { verifyRuntimeTools: () => ({}), verifyCompiler() {} },
    '../source_policy': { resolvePreprocessor: () => ({}), preprocessorIdentity: () => ({}) },
    './target_model': { digest: () => 'digest' },
  });
  const sessions = [compiler.prepareCompilerSession(),
    compiler.prepareCompilerSession({ privateWorkspace: true, matchingRoot: 'private', privateTarget: { symbol: 'member' } }),
    compiler.prepareCompilerSession({ privateWorkspace: true, context })];
  for (const session of sessions) {
    assert.equal(session.tool.compilerSha256, policy.sha256File(__filename));
    assert.equal(session.tool.terminalTailImplementation, policy.sha256File(path.join(ROOT, 'tools/lib/matching/terminal_tail.js')));
  }
  assert.equal(calls.length, 2); assert.equal(calls[0], 'default'); assert.equal(calls[1].matchingRoot, 'private'); assert.equal(calls[1].privateTarget.symbol, 'member');
});

test('actual probe entry routes private target preparation without reaching any native operation', () => {
  const calls = [], stop = new Error('stop after preparation');
  const probe = load('probe.js', {
    '../phase7_conventional': { ROOT },
    '../current_workflow': { prepareContext() { calls.push('default'); throw stop; } },
    './private_preparation': { preparePrivateContext(options) { calls.push(options); throw stop; } },
    './target_model': { assertScratchCapability() {} },
  });
  const target = { symbol: 'member', targetId: 'A'.repeat(64) };
  assert.throws(() => probe.runProbe({}, target, 'int x;', {}), e => e === stop);
  assert.throws(() => probe.runProbe({}, target, 'int x;', { privateWorkspace: true, matchingRoot: 'private' }), e => e === stop);
  assert.equal(calls[0], 'default'); assert.equal(calls[1].privateTarget, target); assert.equal(calls[1].matchingRoot, 'private');
});

test('real workflow, private preparation and cache reject unsafe read/finish before later native or store work',async()=>{
 for(const timing of ['read','finish'])for(const name of ['metadata.json','bytes.bin']){
  const f=fixture(true);f.environment.CODEX_TOOL_CALL_ID='tag-A';await f.guarded(()=>f.helper.preparePrivateContext(f.options));
  f.environment.CODEX_TOOL_CALL_ID='tag-B'; // Cross-invocation reuse must retain every entry-safety gate.
  const cacheRoot=path.join(f.options.matchingRoot,'preprocess');const entry=path.join(cacheRoot,fs.readdirSync(cacheRoot).find(name=>/^[A-F0-9]{64}$/.test(name)));
  const file=path.join(entry,name),outside=path.join(f.root,'sentinel'),bytes=fs.readFileSync(file);fs.copyFileSync(file,outside);
  const unsafe=()=>{fs.unlinkSync(file);fs.linkSync(outside,file);};let laterNativeOrStore=0;
  await assert.rejects(f.guarded(()=>{
   if(timing==='read')unsafe();else f.setDrift(unsafe);
   f.helper.preparePrivateContext(f.options);laterNativeOrStore++;
  }),/unsafe entry.*hardlink/);
  assert.equal(laterNativeOrStore,0);assert.equal(f.caches.at(-1).finished,true);assert.deepEqual(fs.readFileSync(outside),bytes);
  if(timing==='read'){assert.equal(f.caches.at(-1).cache.stats.invalid,1);assert.equal(f.caches.at(-1).cache.stats.publishSkipped,1);}
  else assert.equal(f.caches.at(-1).cache.stats.hits,1);
 }
});
