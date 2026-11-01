"use strict";
const assert=require('assert/strict'), fs=require('fs'), path=require('path'), crypto=require('crypto'), cp=require('child_process');
const inputs=require('../tools/lib/matching/input_set');
const ROOT=path.resolve(__dirname,'..'), parent=path.join(ROOT,'build/tests');fs.mkdirSync(parent,{recursive:true});
const root=fs.mkdtempSync(path.join(parent,'candidate-dependencies-')),privateRoot=path.join(root,'private');fs.mkdirSync(privateRoot);
const hash=bytes=>crypto.createHash('sha256').update(bytes).digest('hex').toUpperCase();
const used=path.join(root,'used.h'), unused=path.join(root,'unused.h'), manifestFile=path.join(root,'selection','manifest.json');
fs.writeFileSync(used,'used');fs.writeFileSync(unused,'unused');fs.mkdirSync(path.dirname(manifestFile));
const logical=file=>path.relative(ROOT,file).split(path.sep).join('/');
function manifest(){return {schemaVersion:1,kind:'ob64-private-inputs',repository:ROOT,accepted:{fingerprint:'A'.repeat(64)},runtime:{},directories:[],files:[used,unused].map(file=>({logical:logical(file),storage:'reference',path:file,bytes:fs.statSync(file).size,sha256:hash(fs.readFileSync(file))}))};}
function open(){fs.writeFileSync(manifestFile,JSON.stringify(manifest()));return inputs.openDiagnosticInputs(manifestFile,{privateRoot});}
(async()=>{
 let checks=0;
 let session=open();assert.equal(session.read(used).toString(),'used');fs.writeFileSync(unused,'unrelated growth');await session.closeResearch();assert.equal(session.provenance().consumedFiles,1);checks++;
 session=open();session.read(used);fs.writeFileSync(used,'Used');await assert.rejects(session.closeResearch(),/content drift/);fs.writeFileSync(used,'used');checks++;
 session=open();session.read(used);fs.appendFileSync(manifestFile,' ');await assert.rejects(session.closeResearch(),/manifest changed/);checks++;
 session=open();const key='CODEX_TOOL_CALL_ID',old=process.env[key];process.env[key]='different-for-diagnostic-close';try{await assert.rejects(session.closeResearch(),/environment drift/);}finally{if(old===undefined)delete process.env[key];else process.env[key]=old;}checks++;
 session=open();assert.throws(()=>session.read(path.join(root,'unenrolled.h')),/unenrolled/);checks++;
 const alias=path.join(root,'alias.h');fs.linkSync(used,alias);try{session=open();assert.throws(()=>session.read(used),/multiply linked/);}finally{fs.unlinkSync(alias);}checks++;
 session=open();assert.throws(()=>require('../tools/lib/current_workflow').prepareContext({inputs:session}),/diagnostic inputs cannot construct canonical/);checks++;
 // Execute the actual query boundary against a genuine diagnostic reader.
 // Only model/store/guard collaborators are isolated; close rehashes real files
 // and compares the real process environment. Returning rows must not print them
 // when the consumed inputs drift while the store query runs.
 const querySource=fs.readFileSync(path.join(ROOT,'tools/match.js'),'utf8');
 const queryFunction=querySource.slice(querySource.indexOf('async function executePrivateDiagnosticQuery('),querySource.indexOf('async function executePrivateDiagnostic('));
 for(const command of ['history','best'])for(const drift of ['none','content','environment']) {
  const reader=open(),published=[],environmentKey='CODEX_TOOL_CALL_ID',prior=process.env[environmentKey];
  const query=require('vm').runInNewContext('('+queryFunction.trim()+')',{
   ROOT,path,process,resolveTarget:()=>({symbol:'f'}),historicalSymbols:()=>['f'],numeric:()=>20,
   prepareCompilerSession:()=>({}),comparisonAlgorithmIdentity:()=> 'algorithm',loadDiagnosticEnvironment:()=>({identity:'environment'}),
   requestStore:()=>{if(drift==='content')fs.writeFileSync(used,'Used');if(drift==='environment')process.env[environmentKey]='query-close-drift';return [{candidate_id:'result'}];},
   print:value=>published.push(value),
   require:name=>name==='./lib/matching/input_set'?{...inputs,openDiagnosticInputs:()=>reader,authenticateRuntime:()=>''}:
    name==='./lib/matching/diagnostic_context'?{authenticateCode(){},load(){reader.read(used);return {workbench:{modelId:'model'}};},baselineFingerprint:()=> 'historical'}:
    name==='./lib/matching/private_workspace'?{async withPrivateWorkspace(_workspace,_options,callback){await callback();}}:require(name),
  });
  try {
   const run=query(command,{positional:['f'],options:{}},{matchingRoot:privateRoot,storeOptions:{}});
   if(drift==='none'){await run;assert.equal(published.length,1);assert.equal(reader.provenance().counters.closingReads,1);}
   else {await assert.rejects(run,drift==='content'?/content drift/:/environment drift/);assert.equal(published.length,0);}
  }finally{fs.writeFileSync(used,'used');if(prior===undefined)delete process.env[environmentKey];else process.env[environmentKey]=prior;}
  checks++;
 }
 const policy=require('../tools/lib/source_policy'),privateInputs=require('../tools/lib/matching/private_inputs');
 const source=path.join(privateRoot,'candidate.c');fs.writeFileSync(source,'#include "common/types.h"\nint f(u32 value) { return value; }\n');
 const preprocessor=policy.resolvePreprocessor();const before=policy.classifySource(source,{preprocessor});assert.equal(before.class,'PURE_C');
 fs.mkdirSync(path.join(privateRoot,'common'));fs.copyFileSync(path.join(ROOT,'include/common/types.h'),path.join(privateRoot,'common/types.h'));
 const after=policy.classifySource(source,{preprocessor});assert.equal(after.class,'PURE_C');assert(policy.compilationInputBytes(before).equals(policy.compilationInputBytes(after)));assert.notDeepEqual(before.dependencies,after.dependencies);
 assert.throws(()=>privateInputs.equalExpandedInputs(before,after,policy),/preprocessing differs/);checks++;
 fs.appendFileSync(path.join(privateRoot,'common/types.h'),'\n/* changed used dependency */\n');assert.throws(()=>policy.verifyClassificationInputs(after),/drift|changed/);checks++;
 const fakeCompiler=path.join(root,'compiler.exe');fs.writeFileSync(fakeCompiler,'not pinned compiler');assert.throws(()=>require('../tools/lib/phase8_matching_c').verifyCompiler({config:{compiler:{executableSha256:'F'.repeat(64)}}},fakeCompiler),/SHA-256 drift/);checks++;
 const hybrid=path.join(privateRoot,'hybrid.c');fs.writeFileSync(hybrid,'int f(void) { __asm__("nop"); return 0; }');assert.equal(policy.classifySource(hybrid,{preprocessor}).class,'HYBRID_C');checks++;
 const validate=require('../tools/lib/matching/diagnostic_context').validateHistoricalReports;
 const fingerprint='A'.repeat(64),baseline='B'.repeat(64),rom={bytes:8,sha256:'C'.repeat(64)},buildIdentity={bytes:100,sha256:'D'.repeat(64)};
 const records=[{symbol:'one'},{symbol:'two'}],manifest={path:'objects/manifest.json',bytes:1,sha256:'E'.repeat(64)};
 const verification={schemaVersion:7,status:'pass',outputs:{rom},targets:records,sourceObjectEvidence:{targets:records},elfRomBinding:{status:'pass',bytes:8},decodedDiagnostics:{status:'not-run',reason:'raw-exact-with-elf-rom-binding'}};
 const good={config:{profile:'fixture',rom},state:{schemaVersion:7,fingerprint,baselineFingerprint:baseline,buildReport:buildIdentity,rom},
   build:{schemaVersion:8,status:'constructed',outputs:{rom},targetReplacements:records,compiler:{sha256:'F'.repeat(64)},objects:{manifest}},
   fresh:{schemaVersion:7,status:'pass',buildReport:buildIdentity,mode:'single-isolated-build',emptyOutputAtLaunch:true,inputFingerprint:fingerprint,baselineFingerprint:baseline,outputSealSha256:'1'.repeat(64),compilerSha256:'F'.repeat(64),linkerInputs:manifest,producers:1,targets:records},
   verified:{schemaVersion:7,status:'pass',output:'.',buildReport:buildIdentity,verification},minimal:{schemaVersion:3,profile:'fixture',targets:records.map(r=>({...r,compilationGroup:'whole-group'}))}};
 assert.deepEqual(validate(good),{construction:true,count:2,producerCount:1});checks++;
 for(const mutate of [
  v=>v.fresh.producers=2,v=>v.fresh.targets.pop(),v=>v.verified.verification.targets.push({symbol:'one'}),
  v=>v.verified.verification.sourceObjectEvidence.targets[0].symbol='other',v=>v.fresh.inputFingerprint='0'.repeat(64),
  v=>v.fresh.baselineFingerprint='0'.repeat(64),v=>v.verified.buildReport.sha256='0'.repeat(64),v=>v.verified.verification.outputs.rom.sha256='0'.repeat(64),
  v=>v.verified.verification.elfRomBinding.bytes--,v=>v.fresh.emptyOutputAtLaunch=false,v=>v.fresh.compilerSha256='0'.repeat(64),
  v=>v.fresh.linkerInputs.sha256='0'.repeat(64),v=>v.verified.output='elsewhere',v=>v.fresh.schemaVersion=6]) {
   const value=JSON.parse(JSON.stringify(good));mutate(value);assert.throws(()=>validate(value));checks++;
 }
 // Exercise the minimal tail selector with an unreadable global model: the
 // diagnostic path must stop before the unrelated original-source census.
 const tailSource=fs.readFileSync(path.join(process.cwd(),'tools/lib/matching/terminal_tail.js'),'utf8');
 const tailFunction=tailSource.slice(tailSource.indexOf('function originalEntryFallback('),tailSource.indexOf('function originalOwner('));
 const marker={};
 const fallback=require('vm').runInNewContext('('+tailFunction.trim()+')',{diagnosticContext:{isDiagnosticContext:x=>x===marker},fail:message=>{throw Error(message);}});
 assert.throws(()=>fallback({context:marker},{},null),/fallback unavailable/);checks++;
 assert.throws(()=>fallback({context:{}},{symbol:'bad'},{}),/original entry is not owner ROM-address identity/);checks++;
 const canonical={phase8:{targets:['canonical']}};
 assert.equal(require('../tools/lib/matching/diagnostic_context').producerModel(canonical),canonical.phase8);checks++;
 console.log(JSON.stringify({status:'pass',checks,root,scope:'consumed input drift, full environment, native CPP same-bytes shadow, compiler/classification and canonical exclusion'}));
})().catch(error=>{console.error(error);process.exitCode=1;});
