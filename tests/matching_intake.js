'use strict';
const fs=require('fs'),path=require('path'),assert=require('assert'),cp=require('child_process');
const {ROOT,sha256File}=require('../tools/lib/phase7_conventional');
const {loadWorkbenchModel,resolveTarget,targetRecord}=require('../tools/lib/matching/target_model');
const {candidateRecord}=require('../tools/lib/matching/compiler');
const {requestStore}=require('../tools/lib/matching/store');
const {captureIdentities}=require('../tools/lib/matching/research');
const {intake,assess,presentation,formatHuman}=require('../tools/lib/matching/intake');
const policy=require('../tools/lib/source_policy');
function run(){
 const start=Date.now(),base=path.join(ROOT,'build/research-intake-rollout-r1');fs.mkdirSync(base,{recursive:true});const root=fs.mkdtempSync(path.join(base,'tests-')),archive=path.join(root,'archives'),database=path.join(root,'absent','store.sqlite');fs.mkdirSync(archive);
 const w=loadWorkbenchModel(),a=resolveTarget(w,'resource_arena_init'),b=resolveTarget(w,'func_0020BFF8');
 const source=path.join(root,'authored.c');fs.writeFileSync(source,'#include "game/combat_types.h"\nu32 fixture(u32 v) { return v+1; }\n');
 const claims={schemaVersion:1,label:'fixture',role:'effect-example',context:'Independent research context.',sourceChange:'Authored fixture.',effects:['fixture-effect'],observedEffect:'An authored claim.',remainingFailure:'No matching acceptance.',selectedBest:false,parentCandidateId:null,relatedCandidateIds:[],references:[{path:'docs/Plans/task-logs/combat-draw-wave8-r7.md'}]};
 const observation=captureIdentities(source,claims),c=policy.classifySource(source),authenticated={sourceSha256:c.sourceSha256,expanded:c.compilationInput,dependencies:c.dependencies,sourceClass:c.class,preprocessor:c.preprocessor};
 const envelope=t=>({schemaVersion:1,symbol:t.symbol,candidateId:candidateRecord(t,fs.readFileSync(source,'utf8')).candidateId,observationId:'A'.repeat(64),source:path.relative(ROOT,source).replace(/\\/g,'/'),authored:observation,authenticated});
 const first=envelope(a),second=envelope(b),options={archiveDirectory:archive,database};
 const write=(name,value)=>fs.writeFileSync(path.join(archive,name),JSON.stringify(value));write(a.symbol+'-fixture.observation.json',first);write(b.symbol+'-fixture.observation.json',second);
 let count=0;const check=(name,fn)=>{fn();count++;},clone=x=>JSON.parse(JSON.stringify(x));
 const spawn=cp.spawnSync,compiler=JSON.parse(fs.readFileSync(path.join(ROOT,'config/local-tools.json'))).compiler;let codegen=0;
 cp.spawnSync=function(exe,...args){if(path.resolve(exe).toLowerCase()===path.resolve(compiler).toLowerCase()){codegen++;throw Error('intake invoked KMC');}return spawn.call(this,exe,...args);};
 try{
  check('two independently resolved target families',()=>{assert.equal(intake(w,a,options).counts.valid,1);assert.equal(intake(w,b,options).counts.valid,1);assert.notEqual(first.candidateId,second.candidateId);});
  check('missing store remains absent',()=>{assert.equal(intake(w,a,options).store.status,'missing');assert(!fs.existsSync(path.dirname(database)));});
  check('non-W8 empty history',()=>assert.equal(intake(w,resolveTarget(w,'resource_arena_register'),options).status,'none'));
  check('malformed metadata',()=>{const bad=clone(first);delete bad.authored.expected;assert.equal(assess(a,{origin:'archive',envelope:bad}).validity,'malformed');});
  check('stale expanded',()=>{const bad=clone(first);bad.authored.expected.expandedSha256='0'.repeat(64);assert.equal(assess(a,{origin:'archive',envelope:bad}).validity,'stale');});
  check('stale reference',()=>{const bad=clone(first);bad.authored.references[0].sha256='0'.repeat(64);assert.equal(assess(a,{origin:'archive',envelope:bad}).validity,'stale');});
  check('stale header identity',()=>{const bad=clone(first);bad.authored.expected.dependencies[0].sha256='0'.repeat(64);assert.equal(assess(a,{origin:'archive',envelope:bad}).validity,'stale');});
  check('stale preprocessor identity',()=>{const bad=clone(first);bad.authenticated.preprocessor.sha256='0'.repeat(64);assert.equal(assess(a,{origin:'archive',envelope:bad}).validity,'stale');});
  check('exact target mismatch',()=>{const bad=clone(first);bad.candidateId=second.candidateId;assert.equal(assess(a,{origin:'archive',envelope:bad}).validity,'target-mismatch');});
  check('malformed file is visible',()=>{fs.writeFileSync(path.join(archive,a.symbol+'-bad.observation.json'),'{');assert.equal(intake(w,a,options).discovery[0].validity,'malformed');});
  check('capture rejects supplied computed fields',()=>{assert.throws(()=>captureIdentities(source,{...claims,expected:observation.expected}),/without computed/);assert.throws(()=>captureIdentities(source,{...claims,references:observation.references}),/cannot be replaced/);});
  check('preprocessor unavailable explicit',()=>{const classify=policy.classifySource;policy.classifySource=()=>({class:'UNKNOWN',error:'fixture missing preprocessor'});try{assert.equal(assess(a,{origin:'archive',envelope:first}).validity,'unavailable');}finally{policy.classifySource=classify;}});
  check('read-only store refuses creation and mutation',()=>{assert.throws(()=>requestStore({action:'query',name:'status'},{database,readOnly:true}));assert(!fs.existsSync(path.dirname(database)));assert.throws(()=>requestStore({action:'init'},{database,readOnly:true}),/only permits/);});
  const db=path.join(root,'store.sqlite');requestStore({action:'init'},{database:db});requestStore({action:'upsert_targets',records:[targetRecord(a)]},{database:db});
  const metadata={sourcePath:first.source,research:{schemaVersion:1,authored:observation,authenticated}};const record=candidateRecord(a,fs.readFileSync(source,'utf8'),{origin:'research-import',variant:observation.label,metadata});requestStore({action:'put_candidate',record},{database:db});
  const census=file=>Object.fromEntries(['','-wal','-shm','-journal'].map(s=>[s,fs.existsSync(file+s)?{bytes:fs.statSync(file+s).size,sha256:sha256File(file+s)}:null]));
  check('clean immutable read preserves full main/sidecar census',()=>{const before=census(db);assert.equal(before['-wal'],null);assert.equal(before['-shm'],null);const r=intake(w,a,{...options,database:db});assert.equal(r.store.status,'available');assert.equal(r.counts.valid,1);assert.deepEqual(census(db),before);});
  check('quiescent existing SHM and zero WAL stay untouched',()=>{const file=path.join(root,'quiescent.sqlite');fs.copyFileSync(db,file);fs.writeFileSync(file+'-shm',Buffer.alloc(32768,7));fs.writeFileSync(file+'-wal','');const before=census(file);assert.equal(intake(w,a,{...options,database:file}).store.status,'available');assert.deepEqual(census(file),before);});
  check('nonempty WAL or journal unavailable without writes',()=>{for(const suffix of ['-wal','-journal']){const file=path.join(root,suffix.slice(1)+'.sqlite');fs.copyFileSync(db,file);fs.writeFileSync(file+suffix,'pending transaction');const before=census(file),r=intake(w,a,{...options,database:file});assert.equal(r.store.status,'error');assert.match(r.store.reason,/nonempty WAL or rollback journal/);assert.equal(r.counts.valid,1);assert.deepEqual(census(file),before);}});
  check('concurrent writable handle unavailable without writes',()=>{const before=census(db),handle=fs.openSync(db,'r+');try{const r=intake(w,a,{...options,database:db});assert.equal(r.store.status,'error');assert.match(r.store.reason,/quiescent read guard/);}finally{fs.closeSync(handle);}assert.deepEqual(census(db),before);});
  check('corrupt store visible even without observations',()=>{const bad=path.join(root,'broken.sqlite');fs.writeFileSync(bad,'broken');assert.equal(intake(w,a,{...options,database:bad}).store.status,'error');assert.equal(intake(w,resolveTarget(w,'resource_arena_register'),{...options,database:bad}).status,'unavailable');});
  check('tracked W8 records retain old model identity without deduplicating stale observations',()=>{const r=intake(w,resolveTarget(w,'func_001F3C00'),{database});assert.equal(r.counts['target-mismatch'],13);assert.equal(r.counts.valid,undefined);assert.equal(r.store.status,'missing');});
  check('real archived IDs without ROM binding remain reference-only',()=>{const noRom=loadWorkbenchModel({requireBaserom:false}),r=intake(noRom,resolveTarget(noRom,'func_001F3C00'),{database});assert.equal(r.targetId,null);assert.equal(r.counts['reference-only'],13);assert(!r.counts['target-mismatch']);});
  check('grouped read allowed without mutation capability',()=>{const t={...a,compilationGroup:{id:'fixture'}};const r=intake(w,t,options);assert.equal(r.counts.valid,1);assert.match(r.historyApplicability,/grouped/);});
  check('foreign and missing relations explicitly qualified',()=>{const file=a.symbol+'-relation.observation.json',bad=clone(first);bad.authored.relatedCandidateIds=[second.candidateId,'B'.repeat(64)];write(file,bad);const r=intake(w,a,{...options,limit:1});assert(r.total>1);const all=intake(w,a,options).observations.find(x=>x.relatedCandidateIds?.length);assert.equal(all.relations.status,'invalid');assert.deepEqual(all.relations.items.map(x=>x.status),['invalid','unverified']);fs.unlinkSync(path.join(archive,file));});
  check('compact human retains census and relation warnings beyond JSON limit',()=>{const bad=clone(first);bad.authored.relatedCandidateIds=[second.candidateId];write(a.symbol+'-compact.observation.json',bad);const r=intake(w,a,{...options,limit:1});assert.equal(r.observations.length,1);assert(r.presentation.displayed>1);assert(r.presentation.observations.some(x=>x.relations==='invalid'));assert.match(formatHuman(r),/relations: invalid/);assert.equal(r.knowledge.status,'disabled');assert.deepEqual(JSON.parse(formatHuman(r,{includeDetails:true})),JSON.parse(JSON.stringify(r)));fs.unlinkSync(path.join(archive,a.symbol+'-compact.observation.json'));});
  check('no-ROM duplicated ID uses per-row source identity',()=>{
   const different=path.join(root,'different.c');fs.writeFileSync(different,fs.readFileSync(source,'utf8').replace('v+1','v+2'));
   const other=clone(first),cls=policy.classifySource(different);other.source=path.relative(ROOT,different).replace(/\\/g,'/');other.authored=captureIdentities(different,claims);other.authenticated={sourceSha256:cls.sourceSha256,expanded:cls.compilationInput,dependencies:cls.dependencies,sourceClass:cls.class,preprocessor:cls.preprocessor};
   const file=a.symbol+'-different.observation.json';write(file,other);const result=intake(w,{...a,expectedBytesSha256:null,activeMatchingSource:first.source},options);
   assert.equal(result.observations.find(x=>x.source===other.source).matchesCurrentSource,false);assert.equal(result.observations.find(x=>x.source===first.source).matchesCurrentSource,true);fs.unlinkSync(path.join(archive,file));
  });
  check('presentation errors remain optional',()=>assert.equal(presentation('missing_target',{workbench:w}).status,'unavailable'));
  assert.equal(codegen,0);
 }finally{cp.spawnSync=spawn;}
 const result={checks:count,codegen,wallMs:Date.now()-start,root};fs.writeFileSync(path.join(root,'results.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result));return result;
}
async function runCli(){
 const vm=require('vm'),{createRequire}=require('module'),file=path.join(ROOT,'tools/match.js'),localRequire=createRequire(file),w=loadWorkbenchModel();
 const root=path.join(ROOT,'build/research-intake-rollout-r1');fs.mkdirSync(root,{recursive:true});const source=path.join(root,'cli-source.c');fs.writeFileSync(source,'int only_explicit_watch_input;\n');
 let history={status:'found',observations:[{source:'must-not-compile-this.c'}]},watchCalls=0,prepareCalls=0,initialized=0,intakeOptions;
 const result={candidate:{candidateId:'fixture'},compile:{status:'compiled',sourceClass:'PURE_C'},comparison:null};
 const mocks={
  './lib/matching/target_model':{...localRequire('./lib/matching/target_model'),loadWorkbenchModel:()=>w},
  './lib/matching/store':{...localRequire('./lib/matching/store'),initializeStore:()=>{initialized++;return {}; }},
  './lib/matching/compiler':{...localRequire('./lib/matching/compiler'),syncTargets:()=>({}),compileCandidate:(_w,t,text)=>{assert.equal(t.symbol,'func_0020BFF8');assert.equal(text,'int only_explicit_watch_input;\n');watchCalls++;return result;}},
  './lib/matching/m2c':{...localRequire('./lib/matching/m2c'),prepareAndCompile:(_w,t,options)=>{assert.equal(t.symbol,'func_0020BFF8');assert.equal(options.compile,false);assert(!Object.hasOwn(options,'researchIntake'));prepareCalls++;return {assemblyFile:source,contextFile:null,results:[],compilations:[]};}},
  './lib/matching/intake':{...localRequire('./lib/matching/intake'),presentation:(_symbol,options)=>{intakeOptions=options;return history;}}
 };
 const module={exports:{}};vm.runInThisContext('(function(require,module,exports,__filename,__dirname){'+fs.readFileSync(file,'utf8').replace(/^#![^\n]*/, '')+'\n})',{filename:file})(name=>mocks[name]||localRequire(name),module,module.exports,file,path.dirname(file));
 const log=console.log,oldExit=process.exitCode,printed=[];console.log=text=>printed.push(JSON.parse(text));
 try{
  await module.exports.main(['prepare','func_0020BFF8','--no-context','--no-compile','--json']);assert.equal(printed.at(-1).researchIntake.status,'found');
  const before=structuredClone(printed.at(-1));
  await module.exports.main(['prepare','func_0020BFF8','--no-context','--no-compile','--include-details','--json','--cross-limit','0']);assert.deepEqual(printed.at(-1),before);assert.equal(intakeOptions.crossLimit,0);
  history={status:'unavailable',reason:'optional discovery fixture',observations:[]};
  await module.exports.main(['watch','func_0020BFF8','--source',source,'--json']);assert.equal(printed.at(-1).status,'compiled');assert.equal(printed.at(-1).researchIntake.status,'unavailable');assert.equal(process.exitCode,oldExit);
  await assert.rejects(()=>module.exports.main(['intake','func_0020BFF8','--symptom','not-a-symptom','--json']),/unknown symptom/);
  assert.equal(watchCalls,1);assert.equal(prepareCalls,2);assert.equal(initialized,3);
 }finally{console.log=log;process.exitCode=oldExit;}
 console.log('Intake prepare/watch output wiring: PASS');
}
if(require.main===module){run();runCli().catch(error=>{console.error(error);process.exitCode=1;});}module.exports={run,runCli};
