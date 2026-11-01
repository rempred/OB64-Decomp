'use strict';
const assert=require('assert/strict'),fs=require('fs'),path=require('path'),vm=require('vm'),crypto=require('crypto'),test=require('node:test');
const ROOT=process.cwd();
fs.mkdirSync(path.join(ROOT,'build/tests'),{recursive:true});
const hash=x=>crypto.createHash('sha256').update(x).digest('hex');
function fixture(){
 const root=fs.mkdtempSync(path.join(ROOT,'build/tests/watch-scope-')),scratch='build/matching/w1',matchingRoot=path.join(root,scratch);
 fs.mkdirSync(matchingRoot,{recursive:true});fs.mkdirSync(path.join(root,'tools'));fs.writeFileSync(path.join(matchingRoot,'candidate.c'),'int x;');
 let walks=0;const io={...fs,readdirSync(file,...args){if(path.resolve(file)===matchingRoot)walks++;return fs.readdirSync(file,...args);}};
 const p={pid:41,ppid:42,platform:'win32',execPath:process.execPath,argv:[process.execPath,path.join(root,'tools/match.js'),'watch','f','--source',path.join(matchingRoot,'candidate.c'),'--scratch-root',scratch],env:{}};
 const module={exports:{}};
 vm.runInNewContext(fs.readFileSync(path.join(ROOT,'tools/lib/matching/private_workspace.js'),'utf8'),{module,process:p,require:name=>name==='fs'?io:name==='child_process'?{spawn(){throw Error('unexpected spawn');}}:require(name)});
 const api=module.exports,w=api.resolvePrivateWorkspace({root,scratchRoot:scratch,command:'watch'}),inputs={id:'fixture'};
 const key=hash(matchingRoot.toLowerCase());p.env.OB64_PRIVATE_GUARD=key;
 const valid={pid:41,supervisorPid:42,rootKey:key,native:false,admission:'strict-watch-v1',commandSha256:hash(JSON.stringify([p.execPath,...p.argv.slice(1)]))};
 const ticket=value=>fs.writeFileSync(path.join(matchingRoot,'.private-guard.json'),JSON.stringify(value));ticket(valid);
 const check=(workspace=w,i=inputs,r=root,m=matchingRoot)=>api.requireActiveWatchWorkspace(workspace,i,r,m);
 return {root,matchingRoot,api,w,inputs,p,valid,ticket,check,get walks(){return walks;},run:callback=>api.withPrivateWorkspace(w,{native:true,inputs},callback)};
}
test('watch bounded admission and callback reuse have one full closing census',async()=>{
 const f=fixture();assert.equal(f.walks,0);assert.throws(()=>f.check(),/scope mismatch/);
 const result=await f.run(()=>{for(let i=0;i<4;i++)assert.equal(f.check(),f.w);assert.equal(f.walks,0);return 'sealed';});
 assert.equal(result,'sealed');assert.equal(f.walks,1);assert.throws(()=>f.check(),/scope mismatch/);
});
test('exact ticket/command identity is required before entering callback',async()=>{
 for(const key of ['pid','supervisorPid','rootKey','native','admission','commandSha256']){
  const f=fixture();f.ticket({...f.valid,[key]:'wrong'});let calls=0;
  await assert.rejects(f.run(()=>calls++),/identity mismatch/);assert.equal(calls,0);assert.equal(f.walks,0);
 }
 for(const mutate of [f=>f.p.argv[2]='probe',f=>f.p.argv.push('--source','extra.c'),f=>f.p.argv.push('--native-concurrency','serial')]){
  const f=fixture();mutate(f);await assert.rejects(f.run(()=>assert.fail('callback admitted')));assert.equal(f.walks,0);
 }
});
test('scope rejects copied/replaced inputs, roots, database and mode; revokes on failure',async()=>{
 const f=fixture();await f.run(()=>{
  assert.throws(()=>f.check({...f.w}),/scope mismatch/);assert.throws(()=>f.check(f.w,{id:'fixture'}),/scope mismatch/);
  assert.throws(()=>f.check(f.w,f.inputs,f.root+'x'),/scope mismatch/);assert.throws(()=>f.check(f.w,f.inputs,f.root,f.root),/scope mismatch/);
  for(const [obj,key,value] of [[f.w,'root',f.root+'x'],[f.w,'matchingRoot',f.root],[f.w,'nativeConcurrency','serial'],[f.w.storeOptions,'database',path.join(f.root,'bad')]]){
   const previous=obj[key];obj[key]=value;assert.throws(()=>f.check(),/scope mismatch/);obj[key]=previous;
  }
 });assert.equal(f.walks,1);
 const g=fixture(),primary=Object.assign(Error('primary selected drift'),{code:'OB64_INPUT_SET_DRIFT'});
 await assert.rejects(g.run(()=>{throw primary;}),e=>e===primary);assert.equal(g.walks,1);assert.throws(()=>g.check(),/scope mismatch/);
});
test('unrelated close hazard suppresses success and preserves meaningful primary',async()=>{
 for(const withPrimary of [false,true]){
  const f=fixture(),sentinel=path.join(f.root,'sentinel'),primary=Object.assign(Error('primary selected drift'),{code:'OB64_INPUT_SET_DRIFT'});fs.writeFileSync(sentinel,'outside');
  await assert.rejects(f.run(()=>{fs.linkSync(sentinel,path.join(f.matchingRoot,'unrelated'));if(withPrimary)throw primary;return 'must not escape';}),error=>{
   assert.match(error.message,/hardlinks/);if(withPrimary){assert.equal(error.cause,primary);assert.equal(error.code,primary.code);}return true;
  });assert.equal(f.walks,1);assert.equal(fs.readFileSync(sentinel,'utf8'),'outside');assert.throws(()=>f.check(),/scope mismatch/);
 }
});
test('bounded close failure still attempts full census',async()=>{
 const f=fixture(),sentinel=path.join(f.root,'sentinel');fs.writeFileSync(sentinel,'outside');
 await assert.rejects(f.run(()=>fs.linkSync(sentinel,path.join(f.matchingRoot,'workbench.sqlite-wal'))),/hardlinks/);
 // Full census entry validates ancestors, then descends exactly once.
 assert.equal(f.walks,1);
});
function preparation(f,finish=()=>{}){
 const module={exports:{}};let calls=0,finished=0;
 const targets=[{symbol:'f',source:'src/f.c'},{symbol:'g',source:'src/g.c'}],context={phase8:{targets}};
 const modules={'../phase7_conventional':{ROOT:f.root},'./private_workspace':f.api,'./input_set':{context:()=>f.inputs},
 '../diff_profile':{createDiffProfiler:()=>({finish:()=>({status:'pass'})})},
 '../diff_preprocess_cache':{createDiffPreprocessCache(){calls++;return{stats:{},preprocess(){},finish(){finished++;finish();}};}},
 '../current_workflow':{prepareContext(options){const hook=options.contextPreprocessFactory(targets);hook.finish();return context;}}};
 vm.runInNewContext(fs.readFileSync(path.join(ROOT,'tools/lib/matching/private_preparation.js'),'utf8'),{module,require:name=>modules[name]||require(name)});
 const options={privateWorkspace:true,watchWorkspace:f.w,matchingRoot:f.matchingRoot,inputs:f.inputs,privateTarget:targets[0],privatePreparation:{}};
 return {api:module.exports,options,context,get calls(){return calls;},get finished(){return finished;}};
}
test('real active preparation uses bounded checks and retains producer/context identity',async()=>{
 const f=fixture(),p=preparation(f);assert.throws(()=>p.api.preparePrivateContext(p.options),/scope mismatch/);
 await f.run(()=>{
  assert.equal(p.api.preparePrivateContext(p.options),p.context);assert.equal(p.api.preparePrivateContext(p.options),p.context);
  assert.equal(p.calls,1);assert.equal(p.finished,1);assert.equal(f.walks,0);
  assert.throws(()=>p.api.preparePrivateContext({...p.options,privateTarget:{symbol:'g'}}),/fresh producer/);
  assert.throws(()=>p.api.preparePrivateContext({...p.options,inputs:{}}),/scope mismatch/);
  p.options.privatePreparation.matchingRoot='changed';assert.throws(()=>p.api.preparePrivateContext(p.options),/fresh producer/);
 });assert.equal(f.walks,1);
});
test('preparation failure preserves primary and bounded postcheck; context never escapes',async()=>{
 const f=fixture(),primary=Object.assign(Error('input drift'),{code:'OB64_INPUT_SET_DRIFT'}),sentinel=path.join(f.root,'outside');fs.writeFileSync(sentinel,'safe');
 const p=preparation(f,()=>{fs.linkSync(sentinel,path.join(f.matchingRoot,'workbench.sqlite-shm'));throw primary;});let later=0;
 await assert.rejects(f.run(()=>{p.api.preparePrivateContext(p.options);later++;}),error=>{
  assert.match(error.message,/input drift/);assert.match(error.message,/hardlinks/);assert.equal(error.code,primary.code);return true;
 });assert.equal(later,0);assert.equal(p.options.privatePreparation.context,undefined);assert.equal(p.finished,1);assert.equal(f.walks,1);
});

test('failed scope mutation closes original admitted root without scanning replacement',async()=>{
 const f=fixture(),other=path.join(f.root,'other');fs.mkdirSync(other);let visits=0;const read=fs.readdirSync;
 fs.readdirSync=function(file,...args){if(path.resolve(file)===other)visits++;return read.call(this,file,...args);};
 try{await assert.rejects(f.run(()=>{f.w.matchingRoot=other;}),/scope mismatch/);}finally{fs.readdirSync=read;}
 assert.equal(f.walks,1);assert.equal(visits,0);
});
