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

function fixture({ drift = false, guardDrift = false, selectedDrift = false, entryArgs = null, compileHandler, storeHandler, activeHandler, initHandler, syncHandler, scratchHandler } = {}) {
  const calls = [], output = [], errors = [];
  const record = { candidate: { candidate_id: 'candidate', target_id: 'target', source_text: 'void f(void){}', metadata: { sourcePath: path.relative(ROOT, SOURCE) } }, observations: [], runs: [] };
  const comparison = { rawExactBytes: false, rawRelocationMaskedExact: null, diagnosticExactBytes: null, evidenceMode: 'symbolic-object', diagnostic: { status: 'unavailable', reason: 'inactive owner' }, relocationEvidence: { expected: { available: false }, actual: { available: true, count: 1 } } };
  const run = { run_id: 'run', status: 'compiled', source_class: 'PURE_C', object_text: Buffer.alloc(4).toString('base64'), relocations: [{ type: 'R_MIPS_32' }], details: comparison };
  record.runs = [run];
  const target = { symbol: 'func_80000000', targetId: 'target', expectedBytes: Buffer.alloc(4), vramStart: 0x80000000 };
  const workbench = { targets: [target], modelId: 'model' };
  const log = (name, result) => (...args) => { calls.push({ name, args }); return typeof result === 'function' ? result(...args) : result; };
  let researchInputs=false, liveInputs=false;
  const inputs = { id:'selected-id',manifest:{accepted:{fingerprint:'accepted-fingerprint'},runtime:{splatPython:'selected-python'}},
    resolve:file=>file, has:()=>false,
    read:log('readResearchMetadata',()=>Buffer.from(JSON.stringify({chunks:[]}))),
    prefetch:log('prefetchResearch',async()=>{}),
    provenance:()=>({scope:liveInputs?'live-research-consumed-inputs-v1':'research-consumed-inputs-v1',acceptedFingerprintRole:liveInputs?'not-selected':'historical-selection',fullSelectedClosureCertified:false,currentAcceptanceCertified:false}),
    closeResearch:log('researchPostcheck',async()=>{if(selectedDrift)throw Error('selected input drift');}),
    assertUnchanged:log('selectedPostcheck',()=>{if(selectedDrift)throw Error('selected input drift');}) };
  let researchSourceClosed = false;
  const classifyResearchSource = log('researchClassify', (_source, options) => {
    assert.equal(options.inputs, inputs);
    assert.equal(researchInputs, true);
    assert.equal(researchSourceClosed, false);
    return { class: 'PURE_C' };
  });
  const modules = {
    './lib/phase7_conventional': { ROOT },
    './lib/matching/target_model': { loadWorkbenchModel: log('model', workbench), resolveTarget: () => target, publicTarget: x => x, historicalSymbols: () => [target.symbol], assertScratchCapability: log('scratchGuard', scratchHandler || (() => {})) },
    './lib/matching/store': {
      initializeStore: log('init', initHandler || {}),
      requestStore: log('store', storeHandler || (request => request.name === 'candidate' ? record.candidate : request.name === 'candidate_runs' ? record.runs : [])),
    },
    './lib/matching/compiler': { syncTargets: log('sync', syncHandler || {}), prepareCompilerSession: log('session', { context: { currentFingerprint: 'current' } }), compileCandidate: log('compile', compileHandler || { candidate: { candidateId: 'candidate' }, compile: run, comparison }) },
    './lib/matching/scratch_assembly': require('../tools/lib/matching/scratch_assembly'),
    './lib/matching/diagnostic_link': { comparisonAlgorithmIdentity: () => 'algorithm', loadDiagnosticEnvironment: () => ({ identity: 'environment' }) },
    './lib/matching/mips_analysis': { targetMetrics: () => ({}), compareMips: log('compare', comparison) },
    './lib/matching/research': { importResearch: log('import', {}), observations: log('observations', []), preserveResearch: log('preserve', {}), captureIdentities: log('capture', {}) },
    './lib/matching/intake': { loadIntakeModel: log('intakeModel', workbench), presentation: log('intake', (_symbol, options) => {
      if (options.classifyResearchSource) {
        assert.equal(options.classifyResearchSource, classifyResearchSource);
        options.classifyResearchSource(SOURCE, { inputs });
      }
      return {};
    }), formatHuman: () => '' },
    './lib/matching/research_source': {
      createResearchSourceSession: log('researchSourceSession', boundInputs => {
        assert.equal(boundInputs, inputs);
        assert.equal(researchInputs, true);
        return { classifySource: classifyResearchSource, close: log('researchSourceClose', async () => {
          assert.equal(researchSourceClosed, false);
          researchSourceClosed = true;
          await inputs.closeResearch();
        }) };
      }),
    },
    './lib/matching/input_set': {
      openInputSet:log('openInputs',inputs),
      openDiagnosticInputs:log('openDiagnosticInputs',inputs),
      openResearchInputSet:log('openResearchInputs',()=>{researchInputs=true;return inputs;}),
      openLiveResearchInputs:log('openLiveResearchInputs',()=>{researchInputs=true;liveInputs=true;return inputs;}),
      isResearch:value=>value===inputs&&researchInputs,
      isLiveResearch:value=>value===inputs&&liveInputs,
      authenticateRuntime:log('runtimePins','selected-python'),
      authenticateResearchRuntime:log('researchRuntimePins','selected-python'),
    },
    './lib/matching/diagnostic_context': {authenticateCode:log('diagnosticCode'),load:log('diagnosticContext',{workbench}),baselineFingerprint:()=> 'current'},
    './lib/matching/knowledge': { validateOptions: x => x },
    './lib/matching/probe': { runProbe: log('probe', { status: 'complete' }), compareProbes: log('probeCompare', {}) },
    './lib/matching/private_inputs': { capturePrivateInputs: log('inputSeal', () => ({ assertUnchanged: log('inputPostcheck', undefined) })) },
    './lib/matching/private_workspace': {
      resolvePrivateWorkspace: log('resolveWorkspace', options => {
        assert(options.command === undefined || ['intake','watch','probe'].includes(options.command));
        return { ...workspace, nativeConcurrency: options.nativeConcurrency,
          admission: options.command === 'intake' ? 'research-intake' : options.command === 'watch' ? 'strict-watch-v1' : 'strict' };
      }),
      withPrivateWorkspace: log('guard', async (_workspace, _options, callback) => { await callback(); if (guardDrift) throw Error('guard postcheck failed'); }),
      assertPrivateControls: log('watchControls', () => { if (drift) throw Error('workspace drift'); }),
      requireActiveWatchWorkspace: log('activeWatch', activeHandler || (value => value)),
      combinePrivateErrors: (first, second) => first ? Object.assign(new AggregateError([first,second],first.message+'; '+second.message,{cause:first}),{code:first.code}) : second,
      assertPrivateWorkspace: log('postcheck', () => { if (drift) throw Error('workspace drift'); }),
      assertPrivatePath: log('privatePath', (_workspace, file) => { if (!file.startsWith(PRIVATE + path.sep)) throw Error('outside private root'); return file; }),
    },
  };
  const module = { exports: {} };
  const requireMock = name => name === 'fs' ? { ...fs, readFileSync: () => '{}' } : name === 'path' ? path : modules[name] || {};
  if (entryArgs) requireMock.main = module;
  const processMock = { argv: ['node', 'match.js', ...(entryArgs || [])], env:{}, exitCode: 0 };
  vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'tools/match.js'), 'utf8'), { module, require: requireMock, Buffer, process: processMock, console: { log: x => output.push(x), error: x => errors.push(x) } }, { filename: 'match.js' });
  return { cli: module.exports, calls, output, errors, inputs, classifyResearchSource, process: processMock };
}

test('selected intake/watch/probe transport one input set and pinned Python through the guard', async()=>{
  for(const command of ['intake','watch','probe']){
    const f=fixture();
    await f.cli.main([command,'func_80000000','--scratch-root','build/matching/w1','--inputs','manifest.json','--json',...(command==='intake'?[]:['--source',SOURCE])]);
    assert.equal(f.calls.find(call=>call.name==='guard').args[1].python,'selected-python');
    const pinName=command==='intake'?'researchRuntimePins':'runtimePins';
    assert(f.calls.findIndex(call=>call.name===pinName) < f.calls.findIndex(call=>call.name==='guard'));
    assert.equal(f.calls.filter(call=>call.name===(command==='intake'?'openResearchInputs':'openInputs')).length,1);
    assert.equal(f.calls.filter(call=>call.name===(command==='intake'?'researchPostcheck':'selectedPostcheck')).length,1);
    assert.equal(f.calls.some(call=>call.name===(command==='intake'?'selectedPostcheck':'researchPostcheck')),false);
    assert.equal(f.calls.find(call=>call.name==='guard').args[1].isolatedPython,command==='intake');
    assert.equal(f.calls.find(call=>call.name==='resolveWorkspace').args[0].command,['intake','watch','probe'].includes(command)?command:undefined);
    assert.equal(f.calls.find(call=>call.name==='guard').args[0].admission,command==='intake'?'research-intake':command==='watch'?'strict-watch-v1':'strict');
    for(const name of ['researchSourceSession','researchSourceClose','researchClassify'])assert.equal(f.calls.filter(call=>call.name===name).length,command==='intake'?1:0);
    if(command==='intake')assert.equal(f.calls.find(call=>call.name==='intake').args[1].classifyResearchSource,f.classifyResearchSource);
    assert.equal(f.calls.find(call=>call.name===(command==='intake'?'intakeModel':'model')).args[0].inputs,f.inputs);
    assert.equal(f.calls.some(call=>call.name==='inputSeal'),false);
    const result=JSON.parse(f.output[0]);assert.equal(result.inputSetId,'selected-id');assert.equal(result.acceptedFingerprint,'accepted-fingerprint');
    if(command==='intake'){
      assert.equal(result.inputAuthentication.acceptedFingerprintRole,'historical-selection');
      assert.equal(result.inputAuthentication.currentAcceptanceCertified,false);
      assert(f.calls.findIndex(call=>call.name==='prefetchResearch') < f.calls.findIndex(call=>call.name==='intakeModel'));
    }
    if(command!=='intake'){
      const options=f.calls.find(call=>call.name===(command==='watch'?'compile':'probe')).args[3];
      assert.equal(options.inputs,f.inputs);assert.equal(options.storeOptions.python,'selected-python');
    }
  }
});
test('selected postcheck failure publishes no successful output',async()=>{
  const f=fixture({selectedDrift:true});
  await assert.rejects(f.cli.main(['intake','func_80000000','--scratch-root','build/matching/w1','--inputs','manifest.json','--json']),/selected input drift/);
  assert.equal(f.output.length,0);
  assert.equal(f.calls.filter(call=>call.name==='researchSourceClose').length,1);
  assert.equal(f.calls.filter(call=>call.name==='researchPostcheck').length,1);
});
test('selected probe compare is rejected before any model or input IO',async()=>{
  const f=fixture();await assert.rejects(f.cli.main(['probe','compare','left','right','--source',SOURCE,'--scratch-root','build/matching/w1','--inputs','manifest.json']),/probe comparison is unsupported/);
  assert.equal(f.calls.length,0);
});

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
      assert.equal(f.calls.find(x => x.name === 'resolveWorkspace').args[0].command, command);
      assert.equal(f.calls.some(x => ['researchSourceSession','researchSourceClose','researchClassify'].includes(x.name)), false);
    }
  }
});

test('intake stays read-only and selects private DB plus existing dossier presentation', async () => {
  const f = fixture(); await f.cli.main(['intake', 'func_80000000', '--scratch-root', 'build/matching/w1']);
  const intake = f.calls.find(x => x.name === 'intake'); assert.equal(intake.args[1].database, workspace.storeOptions.database);
  assert.equal(f.calls.some(x => x.name === 'init' || x.name === 'sync' || x.name === 'store'), false);
  assert.equal(f.calls.find(x => x.name === 'guard').args[1].native, false);
  assert.equal(f.calls.find(x => x.name === 'resolveWorkspace').args[0].command, 'intake');
  assert.equal(f.calls.find(x => x.name === 'guard').args[0].admission, 'research-intake');
  assert.equal(intake.args[1].classifyResearchSource, f.classifyResearchSource);
  assert.equal(f.calls.filter(x => x.name === 'researchSourceClose').length, 1);
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
  for (const value of [f,g]) {
    assert.equal(value.calls.filter(x => x.name === 'researchSourceClose').length, 1);
    assert.equal(value.calls.filter(x => x.name === 'researchPostcheck').length, 1);
    assert.equal(value.calls.find(x => x.name === 'intake').args[1].classifyResearchSource, value.classifyResearchSource);
  }
});

test('default watch preserves existing routing and avoids private guard', async () => {
  const f = fixture(); await f.cli.main(['watch', 'func_80000000', '--source', SOURCE]);
  const options = f.calls.find(x => x.name === 'compile').args[3]; assert.equal(options.matchingRoot, undefined); assert.equal(options.sourcePath, undefined); assert.equal(f.calls.some(x => x.name === 'guard'), false);
  assert.equal(f.calls.some(x => ['researchSourceSession','researchSourceClose','researchClassify'].includes(x.name)), false);
});

test('live intake uses bounded reader, isolated runtime and closing seal without selected identity',async()=>{
  for(const suffix of [[],['--scratch-root','build/matching/w1']]){
    const f=fixture();await f.cli.main(['intake','func_80000000',...suffix,'--json']);
    assert.equal(f.calls.filter(call=>call.name==='openLiveResearchInputs').length,1);
    assert.equal(f.calls.filter(call=>call.name==='researchRuntimePins').length,1);
    for(const name of ['researchSourceSession','researchSourceClose','researchClassify'])assert.equal(f.calls.filter(call=>call.name===name).length,1);
    assert.equal(f.calls.find(call=>call.name==='intake').args[1].classifyResearchSource,f.classifyResearchSource);
    if(suffix.length){assert.equal(f.calls.find(call=>call.name==='resolveWorkspace').args[0].command,'intake');assert.equal(f.calls.find(call=>call.name==='guard').args[0].admission,'research-intake');}
    assert.equal(f.calls.filter(call=>call.name==='researchPostcheck').length,1);
    assert.equal(f.calls.some(call=>['openInputs','openResearchInputs','selectedPostcheck','inputSeal','init','sync','store'].includes(call.name)),false);
    assert.equal(f.calls.some(call=>call.name==='guard'),suffix.length>0);
    const report=JSON.parse(f.output[0]);assert.equal(report.inputSetId,undefined);assert.equal(report.acceptedFingerprint,undefined);
    assert.equal(report.inputAuthentication.acceptedFingerprintRole,'not-selected');
  }
});
test('live research close failure suppresses success before publication',async()=>{
  const f=fixture({selectedDrift:true});await assert.rejects(f.cli.main(['intake','func_80000000','--json']),/selected input drift/);assert.equal(f.output.length,0);
  assert.equal(f.calls.filter(call=>call.name==='researchSourceClose').length,1);
  assert.equal(f.calls.filter(call=>call.name==='researchPostcheck').length,1);
});

function actualCompiler(){
 const source=fs.readFileSync(path.join(ROOT,'tools/lib/matching/compiler.js'),'utf8');
 const body=source.slice(source.indexOf('function recordCandidate('),source.indexOf('\nfunction acceptedExpectedRelocationEvidence'))+'\n'+source.slice(source.indexOf('function compileCandidate('),source.indexOf('\nmodule.exports ='));
 const classification={class:'PURE_C',source:'source.c',sourceSha256:'hash',symbol:'func_80000000',bytes:undefined};
 const session={preprocessor:{},tool:{},context:{phase8:{targets:[]}}};
 const sandbox={Buffer,path,Date,JSON,diagnosticContext:require('../tools/lib/matching/diagnostic_context'),MATCHING_ROOT:'private',fs:{readFileSync:()=>Buffer.from('{}')},
  require:name=>name==='./input_set'?{assertContext(){},rethrow(){}}:name==='./terminal_tail'?{diagnose:()=>({})}:{regular:x=>x,assertPrivateClassification(){},equalExpandedInputs(){}},
  assertScratchEnvironment(){},assertScratchCapability(){},candidateRecord:()=>({candidateId:'candidate',sourceSha256:'hash'}),sourceSnapshot:()=> 'source.c',syncTargets(){throw Error('compile must not sync targets');},requestStore(){throw Error('store hook bypassed');},
  prepareCompilerSession:()=>session,textContract:{bindWorkbenchTarget:(_session,value)=>value},relative:x=>x,classifySource:()=>({...classification}),verifyClassificationInputs(){},compilationInputBytes:()=>Buffer.from('{}'),
  acceptedExpectedRelocationEvidence:()=>({}),prepareTargetDiagnostic:()=>({}),candidateCompileCacheKey:()=> 'key',canonicalJson:JSON.stringify,
  resolveRunArtifactDirectory:()=> 'artifacts',cachedCandidateArtifact:()=>({}),diagnosticPreparedForCandidate:()=>({}),comparisonIsCurrent:()=>false,
  compareCandidateDiagnostic:()=>({}),makeComparisonRecord:()=>({}),ensurePlainChildDirectory:()=> 'reports',writeUniqueRunJson(){},compileAttemptIdentity:()=> 'run',authenticateFreshRunArtifactDirectory:()=> 'artifacts',
  compileScratchCandidate:()=>({objectText:Buffer.alloc(4),relocations:[]}),candidateArtifactFromScratch:()=>({}),writeJson(){},
  executablePrefixComparisonScope:()=>null,originalOwnerComparison:()=>null,compilePublicationRequiresReauthentication:stored=>!!stored.race};
 vm.createContext(sandbox);vm.runInContext(body+'\nthis.execute=compileCandidate;',sandbox);
 return {execute:sandbox.execute,classification};
}
const watchArgs=['watch','func_80000000','--source',SOURCE,'--scratch-root','build/matching/w1','--json'];
test('real compiler fresh/cached/cache-race paths keep every store call inside watch adapter',async()=>{
 for(const mode of ['fresh','cached','race']){
  const actual=actualCompiler();let queries=0;
  const f=fixture({compileHandler:actual.execute,storeHandler(request){
   if(request.name==='compile_by_cache'){queries++;return mode==='cached'||mode==='race'&&queries>1?{candidate_id:'candidate',run_id:'run',status:'compiled',object_text:'',relocations:[],tool:{candidateSourcePolicy:actual.classification}}:null;}
   if(request.name==='comparison_for_run')return {};
   if(request.action==='put_compile_result')return {run:{status:'compiled'},comparison:{},cached:false,race:mode==='race'};
   return {};
  }});
  await f.cli.main(watchArgs);
  const calls=f.calls;for(let i=0;i<calls.length;i++)if(['init','sync','store','intake'].includes(calls[i].name)){
   assert.equal(calls[i-1].name,'activeWatch',mode+': pre '+calls[i].name);assert.equal(calls[i+1].name,'activeWatch',mode+': post '+calls[i].name);
  }
  const actions=calls.filter(x=>x.name==='store').map(x=>x.args[0].name||x.args[0].action);
  assert(actions.includes('put_candidate'));assert(actions.includes('compile_by_cache'));
  if(mode!=='cached')assert(actions.includes('put_compile_result'));
  if(mode!=='fresh'){assert(actions.includes('comparison_for_run'));assert(actions.includes('replace_comparison'));}
  if(mode==='race'){assert.equal(actions.filter(x=>x==='put_candidate').length,2);assert.equal(queries,2);}
  assert.equal(f.output.length,1);
 }
});
test('store adapter rejects missing or changed effective database before raw IO',async()=>{
 for(const storeOptions of [undefined,{}, {database:path.join(ROOT,'shared.sqlite')}]){
  const f=fixture({compileHandler(_w,_t,_s,options){options.storeRequest({action:'put_candidate'},storeOptions);}});
  await assert.rejects(f.cli.main(watchArgs),/store (options|database)/);assert.equal(f.calls.some(x=>x.name==='store'),false);assert.equal(f.output.length,0);
 }
});
test('store and startup primary errors retain additional postcheck failure and suppress output',async()=>{
 for(const boundary of ['init','sync','store']){
  let failed=false;const primary=Object.assign(Error('primary operation'),{code:'OB64_INPUT_SET_DRIFT'});
  const explode=()=>{failed=true;throw primary;};
  const f=fixture({activeHandler(value){if(failed)throw Error('postcheck path failure');return value;},
   ...(boundary==='init'?{initHandler:explode}:boundary==='sync'?{syncHandler:explode}:{storeHandler:explode,compileHandler(_w,_t,_s,options){options.storeRequest({action:'put_candidate'},options.storeOptions);}})});
  await assert.rejects(f.cli.main(watchArgs),error=>{assert.equal(error.cause,primary);assert.equal(error.code,primary.code);assert.match(error.message,/postcheck path failure/);return true;});assert.equal(f.output.length,0);
 }
});

test('selected diagnostic best closes inputs before printing and preserves private DB', async () => {
  const f=fixture({selectedDrift:true});
  await assert.rejects(f.cli.main(['best','func_80000000','--inputs','selected.json','--scratch-root','build/matching/w1']),/selected input drift/);
  assert.equal(f.output.length,0);
});

test('source-only import delegates admission; native scratch commands retain precheck',async()=>{
 const reject=()=>{throw Error('physical producer required');};
 const imported=fixture({scratchHandler:reject});
 await imported.cli.main(['import','func_80000000','--source',SOURCE,'--observation','fixture.json','--json']);
 assert.equal(imported.calls.filter(c=>c.name==='scratchGuard').length,0);
 assert.equal(imported.calls.filter(c=>c.name==='import').length,1);
 for(const command of ['prepare','watch','probe']){
  const f=fixture({scratchHandler:reject});
  await assert.rejects(f.cli.main([command,'func_80000000','--source',SOURCE,'--json']),/physical producer required/);
  assert.equal(f.calls.some(c=>['compile','probe'].includes(c.name)),false);
 }
});
