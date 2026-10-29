'use strict';
const assert = require('assert/strict'), fs = require('fs'), path = require('path'), crypto = require('crypto'), test = require('node:test');
const retention = require('../tools/lib/scratch_retention');
const diff = require('../tools/diff');
const base = path.resolve(__dirname, '../build/tests/diff-batch'); fs.mkdirSync(base, { recursive: true });
const config = { maxRuns: 100, maxBytes: 1e8, maxRecordBytes: 1e8, floorBytes: 20, peakBytes: 10 };
const identity = b => ({ bytes: b.length, sha256: crypto.createHash('sha256').update(b).digest('hex').toUpperCase() });
let id = 0;
function fixture() { const root = fs.mkdtempSync(path.join(base, 'run-')); fs.mkdirSync(path.join(root, 'diff')); return root; }
function start(root, claimed, groups = []) { return retention.begin({ root: path.join(root, 'diff'),
  output: path.join(root, 'diff', `${claimed[0]}-1791818961866-${(++id).toString(16).padStart(6,'0')}`), claimedSymbols: claimed, producerGroups: groups, config, readSpace: () => 1e9 }); }
function source(root, handle, symbol, ordinal, members = [symbol]) {
  const bytes = Buffer.from(`int ${symbol}(void) { return 1; }\n`), relative = `src/${symbol}.c`;
  fs.mkdirSync(path.join(root, 'src'), { recursive: true }); fs.writeFileSync(path.join(root, relative), bytes);
  fs.mkdirSync(path.join(handle.output, 'src'), { recursive: true }); fs.writeFileSync(path.join(handle.output, relative), bytes);
  const classification = { source: relative, sourceBytes: bytes.length, sourceSha256: identity(bytes).sha256,
    compilationInput: identity(bytes), digest: `policy-${symbol}` };
  const captured = retention.captureBatchSource(handle, root, classification, bytes, ordinal, members);
  const report = name => ({ symbol: name, source: relative, output: handle.output, sourcePolicyDigest: classification.digest,
    compilationInput: identity(bytes), object: { compilationInput: { path: relative, ...identity(bytes) } }, comparison: { exact: name !== 'b' } });
  return { captured, report };
}
test('explicit batch CLI and preprocessing requests preserve singleton compatibility', () => {
  assert.deepEqual(diff.parseArguments(['a']), { command: 'diff', profile: false, symbol: 'a' });
  assert.deepEqual(diff.parseArguments(['--batch','--profile','a','b']).symbols, ['a','b']);
  for (const args of [['--batch'], ['a','b'], ['--batch','a','A'], ['--batch','--batch','a']]) assert.throws(() => diff.parseArguments(args));
  assert.deepEqual(diff.prepareContextOptions(['a','b']), { allowMissingRelocationContracts: ['a','b'], diffPreprocessSymbols: ['a','b'] });
});
test('claims cover batch/single, batch/batch, case aliases and group members, one build charge', () => {
  const root = fixture(), a = start(root,['a','b']);
  assert.equal(a.check('one-build').requiredBytes, 30);
  assert.throws(() => start(root,['b']), /overlap/);
  assert.throws(() => start(root,['c','B']), /overlap/);
  const c = start(root,['c','d']); assert.equal(c.check('two-builds').requiredBytes, 40); c.release('failed'); a.release('complete');
  const group = start(root,['leader','member'],[['leader','member']]);
  assert.throws(() => start(root,['member'],[['leader','member']]), /incomplete producer/);
  assert.throws(() => start(root,['member','leader'],[['leader','member']]), /overlap/); group.release('failed');
  const legacy = start(root,['leader']);
  const file = path.join(legacy.meta,'claim.json'), claim = JSON.parse(fs.readFileSync(file)); claim.schemaVersion = 2; delete claim.claimedSymbols; fs.writeFileSync(file,JSON.stringify(claim));
  assert.throws(() => start(root,['member','leader'],[['leader','member']]), /overlap/); legacy.release('failed');
});
test('all producer inputs and member diagnostics remain recoverable without duplicate build copies', () => {
  const root = fixture(), h = start(root,['a','b','c']), a = source(root,h,'a',0,['a','c']), b = source(root,h,'b',1);
  const result = retention.captureBatchReport(h,[a.captured,b.captured],['a','b','c'],[a.report('a'),b.report('b'),a.report('c')],1e6);
  assert.equal(result.manifest.allExact,false); assert.equal(result.manifest.status,'complete'); h.release('complete');
  const summary = JSON.parse(fs.readFileSync(path.join(h.meta,'summary.json')));
  assert.equal(retention.readBatch(h.output,summary).sources.length,2);
  assert.equal(fs.readdirSync(h.meta).filter(n=>n.endsWith('authored.c')).length,2);
  assert.equal(retention.accounting(path.join(root,'diff'),config).unknownRuns,0);
  fs.appendFileSync(path.join(h.meta,'producer-1-input.c'),'drift');
  assert.throws(()=>retention.readBatch(h.output,summary),/identity/);
});
test('incomplete batch retains captured inputs and completed diagnostics; missing members explicit', () => {
  const root = fixture(), h=start(root,['a','b']), a=source(root,h,'a',0), b=source(root,h,'b',1);
  const result=retention.captureBatchReport(h,[a.captured,b.captured],['a','b'],[a.report('a')],1e6,new Error('second comparison failed'));
  assert.equal(result.manifest.allExact,false); assert.deepEqual(result.manifest.unavailable,['b']);
  const partial=JSON.parse(fs.readFileSync(path.join(h.meta,'target-0-report.json')));
  assert.equal(partial.incompleteBatch,true); assert.equal(partial.sharedIdentitySealed,false); h.release('failed');
  const root2=fixture(), h2=start(root2,['a','b']), a2=source(root2,h2,'a',0);
  assert.throws(()=>retention.captureBatchReport(h2,[a2.captured],['a','b'],[a2.report('a')],1e6),/missing retained/);
  assert.throws(()=>retention.captureBatchReport(h2,[a2.captured],['a'],[a2.report('a')],1),/allowance/);
  assert(!fs.existsSync(path.join(h2.meta,'target-0-report.json'))); h2.release('failed');
});

function driver(failAt = null, exact = false) {
  const root=fixture(), events=[], targets=['a','b'].map(symbol=>({symbol,source:`src/${symbol}.c`,expectedRelocations:[],relocationContractSource:'accepted'}));
  fs.mkdirSync(path.join(root,'src')); fs.mkdirSync(path.join(root,'build'));
  const bytes=Buffer.from('int f(void){return 1;}\n');
  const classifications=targets.map(t=>{fs.writeFileSync(path.join(root,t.source),bytes);return{symbol:t.symbol,source:t.source,sourceBytes:bytes.length,sourceSha256:identity(bytes).sha256,compilationInput:identity(bytes),digest:`policy-${t.symbol}`,class:'PURE_C'};});
  const phase=name=>{events.push(name);if(failAt===name)throw Error(`fixture ${name} failure`);};
  const context={phase8:{targets,toolchain:{identity:{}}},sourcePolicy:{targets:classifications},localTools:{workRoot:root},diffPreprocess:{finish:()=>phase('seal-source'),stats:{}}};
  const runtime={tools:Object.fromEntries(['as','objcopy','objdump'].map(n=>[`mips-kmc-elf-${n}.exe`,{path:n}]))};
  const mocks={
    './lib/scratch_retention':{...retention,settings:()=>config,begin:options=>retention.begin({...options,readSpace:()=>1e9}),publishLatest(...args){phase('publish-'+args[1]);return retention.publishLatest(...args);}},
    './lib/source_policy':{compilationInputBytes:()=>bytes},
    './lib/text_contract':{withObjectEvidenceMemo:cb=>cb(),recordsForTarget:()=>({}),linkContext:()=>({canonicalBaserom:Buffer.alloc(4)}),finishLinkContext:()=>phase('seal-link')},
    './lib/current_workflow':{prepareContext:()=>context,ensureBaseline:()=>({phase7Output:root})},
    './lib/diff_object_cache':{IMPLEMENTATION_FILES:[],projectTargetContract:t=>t,compileDiffTargets({output,requestedTargets}){phase('compile');assert.equal(requestedTargets.length,2);fs.mkdirSync(path.join(output,'src'));return{compiled:new Map(targets.map(t=>{fs.writeFileSync(path.join(output,t.source),bytes);return[t.symbol,{relocations:[],compilationInput:{path:t.source,...identity(bytes)}}];})),cache:{}};}},
    './lib/diff_profile':{},
    './lib/phase8_matching_c':{ROOT:root,assertBuildOutputLocation(){},assertBuildPathSeparation(){},verifyRuntimeTools:()=>runtime,verifyCompiler:()=>({}),verifyPhase7Input:()=>({}),
      copyPhase7Objects:()=>{phase('copy');return{linkedObjects:[],replacements:[]};},writeObjectManifest:()=>({}),linkPhase8:()=>phase('link'),writeLayout(){},loadCanonicalBaserom:()=>Buffer.alloc(4),
      runTargetAsmDiffer:(_p,t)=>{phase('compare-'+t.symbol);return{exact:exact||t.symbol==='a',asmDifferPairwiseExact:exact||t.symbol==='a',rawBytesExact:exact||t.symbol==='a'};}}
  };
  const module={exports:{}};require('vm').runInNewContext(fs.readFileSync(path.join(__dirname,'../tools/diff.js'),'utf8'),{module,require:n=>mocks[n]||require(n),console:{log(){},warn(){}},process,Buffer});
  return{root,events,run:()=>module.exports.main(['--batch','a','b'])};
}
test('driver links once and publishes complete mixed results only after retention/seals',()=>{
  const d=driver(),result=d.run();assert.equal(result.allExact,false);assert.equal(result.reports.length,2);
  assert.equal(d.events.filter(e=>e==='link').length,1);assert.equal(d.events.filter(e=>e==='copy').length,1);
  assert(d.events.indexOf('publish-a')>d.events.indexOf('seal-source'));
  for(const name of ['a','b']){const r=JSON.parse(fs.readFileSync(path.join(d.root,'build/diff',name+'.json')));assert.equal(r.batch.allExact,false);assert(fs.existsSync(r.batch.manifest));}
});
test('driver keeps failures off latest, retains partial diagnostics and source captures',()=>{
  for(const failAt of ['compile','link','compare-b','seal-link','seal-source']){
    const d=driver(failAt);assert.throws(d.run,/fixture/);assert(!d.events.some(e=>e.startsWith('publish-')));
    const run=fs.readdirSync(path.join(d.root,'diff'))[0],meta=path.join(d.root,'diff',run,'.scratch-retention');
    assert.equal(JSON.parse(fs.readFileSync(path.join(meta,'release.json'))).status,'failed');
    assert.equal(fs.readdirSync(meta).filter(n=>n.endsWith('-authored.c')).length,2);
    const batch=JSON.parse(fs.readFileSync(path.join(meta,'batch.json')));assert.equal(batch.status,'incomplete');assert.equal(batch.allExact,false);
    assert.equal(batch.reports.length,failAt==='compare-b'?1:failAt.startsWith('seal-')?2:0);
  }
  const d=driver('publish-b',true);assert.throws(d.run,/fixture/);
  const first=JSON.parse(fs.readFileSync(path.join(d.root,'build/diff/a.json')));
  assert.equal(JSON.parse(fs.readFileSync(first.batch.manifest)).status,'complete');
  assert(!fs.existsSync(path.join(d.root,'build/diff/b.json')));
});

test('a nonleader member reference protects the entire shared batch output',()=>{
  const root=fixture(),h=start(root,['a','b']),a=source(root,h,'a',0),b=source(root,h,'b',1);
  retention.captureBatchReport(h,[a.captured,b.captured],['a','b'],[a.report('a'),b.report('b')],1e6);h.release('complete');
  const suffix=path.basename(h.output).split('-').at(-1),refs=path.join(root,'references');fs.mkdirSync(refs);fs.writeFileSync(path.join(refs,'note.md'),`Keep b ${suffix}`);
  const inventory=retention.inventory(path.join(root,'diff'),{docs:[refs],memory:[refs],mail:[refs]},config);
  assert(inventory.runs[0].protection.includes('referenced: preserve complete dependency closure'));
  assert.equal(inventory.runs[0].wouldDelete,false);
});
test('own reservation mutation or early release cannot silently pass a heavy-phase check',()=>{
  for(const kind of ['symbols','token','release']){
    const root=fixture(),h=start(root,['a','b']),file=path.join(h.meta,'claim.json'),claim=JSON.parse(fs.readFileSync(file));
    if(kind==='symbols'){claim.claimedSymbols=['a'];fs.writeFileSync(file,JSON.stringify(claim));}
    else if(kind==='token'){claim.token='0'.repeat(32);fs.writeFileSync(file,JSON.stringify(claim));}
    else h.release('failed');
    assert.throws(()=>h.check('compile'),/identity|released/);
  }
});

test('self-consistent manifest hashes cannot hide a mismatched member report body',()=>{
  const root=fixture(),h=start(root,['a']),a=source(root,h,'a',0);
  retention.captureBatchReport(h,[a.captured],['a'],[a.report('a')],1e6);h.release('complete');
  const summaryFile=path.join(h.meta,'summary.json'),manifestFile=path.join(h.meta,'batch.json');
  const summary=JSON.parse(fs.readFileSync(summaryFile)),manifest=JSON.parse(fs.readFileSync(manifestFile)),file=path.join(h.meta,manifest.reports[0].path);
  const body=JSON.parse(fs.readFileSync(file));body.symbol='foreign';const bytes=Buffer.from(JSON.stringify(body));fs.writeFileSync(file,bytes);Object.assign(manifest.reports[0],identity(bytes));
  const encoded=Buffer.from(JSON.stringify(manifest));fs.writeFileSync(manifestFile,encoded);summary.manifest=identity(encoded);
  assert.throws(()=>retention.readBatch(h.output,summary),/binding/);
});
