'use strict';
// Real capture/enrollment/copied files/manifest/selected readers/companion logic.
// Only the unrelated native acceptance oracle uses a synthetic four-byte ROM.
const fs=require('fs'),path=require('path'),assert=require('assert');
const main=process.env.OB64_INTERFACE_TEST_ROOT||path.resolve(__dirname,'..'),staged=path.resolve(__dirname,'..');
const checker=require('../tools/lib/c_interfaces'),companion=require('../tools/lib/c_interface_companion');
const config=JSON.parse(fs.readFileSync(process.env.OB64_INTERFACE_TEST_CONFIG||path.join(main,'config/c-interface-frontend.json')));
const original=checker.authenticate(main,config);
async function mainTest(){
const base=fs.mkdtempSync(path.join(process.env.OB64_INTERFACE_TEST_SCRATCH||path.join(main,'build'),'selected-interface-')),fixture=path.join(base,'repository');
for(const dir of ['config','src','include','docs/dossiers','docs/matching-c','docs/archive/matching-c-candidates','asm/original/rev0','tools/lib','tools/matching_workbench','build/current','runtime/powershell','runtime/asm-differ'])fs.mkdirSync(path.join(fixture,dir),{recursive:true});
function write(file,value){const absolute=path.resolve(fixture,file);fs.mkdirSync(path.dirname(absolute),{recursive:true});const bytes=Buffer.isBuffer(value)?value:Buffer.from(typeof value==='string'?value:JSON.stringify(value,null,2)+'\n');fs.writeFileSync(absolute,bytes);return{path:file,bytes:bytes.length,sha256:checker.digest(bytes)};}
const local={compiler:path.join(fixture,'runtime/compiler'),splatPython:path.join(fixture,'runtime/python'),splatSplit:path.join(fixture,'runtime/split'),asmDifferRoot:path.join(fixture,'runtime/asm-differ'),powershellRuntimeRoot:path.join(fixture,'runtime/powershell')};
for(const file of ['compiler','python','split','cpp','compiler-manifest','asm-differ/diff.py','asm-differ/pyproject.toml','asm-differ/LICENSE','powershell/pin'])write('runtime/'+file,'fixture pin');
for(const file of ['store.py','schema.sql','private_guard.py'])write('tools/matching_workbench/'+file,'fixture shared code');
write('tools/match.js','fixture code');write('tools/lib/pin.js','fixture code');
write('config/matching-c-targets.json',{targets:[]});write('config/matching-c-compilation-groups.json',{groups:[]});write('docs/matching-c/compiler-lessons.json',{lessons:[]});
write('config/local-tools.json',local);write('config/toolchain.json',{localRoot:'runtime',tools:{}});
const policy=JSON.parse(fs.readFileSync(path.join(main,'config/source-policy.json')));policy.preprocessor.path='runtime/cpp';policy.matchingCompiler.manifest='runtime/compiler-manifest';policy.preprocessor.requiredExecutables.forEach((e,i)=>{e.path='runtime/engine-'+i;write(e.path,'fixture engine');});write('config/source-policy.json',policy);
const rom=write('build/baserom.us_rev0.z64',Buffer.from([1,2,3,4]));write('config/phase7/conventional-build.json',{rom:{bytes:rom.bytes,sha256:rom.sha256}});
const front={...config,executable:{...config.executable,path:'runtime/clang.exe'}};fs.copyFileSync(original,path.join(fixture,front.executable.path));const frontend=write('config/c-interface-frontend.json',front);
const inside=process.env.OB64_INTERFACE_INSIDE_ROOT==='1',output=inside?path.join(fixture,'build/accepted/build'):path.join(base,'accepted/build');fs.mkdirSync(output,{recursive:true});
const build={fixture:'accepted shape only'},buildIdentity=write(path.join(output,'build-report.json'),build);
write(path.join(output,'phase8.us_rev0.z64'),Buffer.from([1,2,3,4]));
let fresh={fixture:'fresh'},verified={fixture:'verified'};
const state={schemaVersion:7,status:'verified',verifiedAt:'fixture',fingerprint:'F'.repeat(64),baselineFingerprint:'B'.repeat(64),output,buildReport:{bytes:buildIdentity.bytes,sha256:buildIdentity.sha256},verificationReport:path.join(output,'verification.json'),freshCompilationReport:path.join(output,'fresh-compilation.json')};
const report={schemaVersion:1,frontend:checker.digest(front),verdict:{pass:true},acceptanceBinding:{inputFingerprint:state.fingerprint,baselineFingerprint:state.baselineFingerprint,buildReport:state.buildReport}};
Object.assign(state,companion.create(state,report,fs.readFileSync(path.join(fixture,frontend.path))));fresh.cInterfaceEvidence=companion.binding(state);
write(state.cInterfaceReport,report);
function publish(){state.verificationSha256=write(state.verificationReport,verified).sha256;state.freshCompilationSha256=write(state.freshCompilationReport,fresh).sha256;write('build/current/state.json',state);write('build/current/baseline-state.json',{});}
publish();
const prepared={phase8:{targets:[]},model:{config:{acceptedInputSha256:{}}},sourcePolicy:{targets:[]},localTools:local};
const fakeWorkflow={prepareContext:()=>prepared,currentVerificationState:()=>({exact:true,state}),validateVerifiedCompanions:(b,f,v)=>{assert.deepStrictEqual(b,build);assert.deepStrictEqual(f,fresh);assert.deepStrictEqual(v,verified);}};
const loader=require('./c_interface_test_loader')(main,staged,{'tools/lib/execution_paths.js':{ROOT:fixture,CODE_ROOT:fixture,bundled:false,assertCanonical(){},bundle:()=>null},'tools/lib/phase7_conventional.js':{ROOT:fixture},'tools/lib/current_workflow.js':fakeWorkflow});
const api=loader.load('tools/lib/matching/input_set.js'),privateApi=loader.load('tools/lib/matching/private_inputs.js'),diagnostic=loader.load('tools/lib/matching/diagnostic_context.js');
let checks=0;
const capture=api.captureInputSet(path.join(fixture,'build/selected'));
const manifest=JSON.parse(fs.readFileSync(capture.manifest));
const reportRecord=manifest.files.find(f=>f.path===state.cInterfaceReport||f.logical==='build/accepted/c-interface-report.json');
assert(reportRecord&&reportRecord.storage===(inside?'copy':'reference'));checks++;
assert(manifest.files.some(f=>f.logical==='runtime/clang.exe'&&f.storage==='reference'));checks++;
assert.deepStrictEqual(companion.binding(manifest.accepted),companion.binding(state));checks++;
function selectedValidate(file=capture.manifest) {
  const inputs=api.openInputSet(file,{root:fixture}),model=api.bind({model:{config:{rom:{bytes:rom.bytes,sha256:rom.sha256}}}},inputs);
  inputs.authenticate(model);inputs.assertUnchanged();
  const reader=api.openDiagnosticInputs(file,{root:fixture}),s=JSON.parse(reader.read(path.join(fixture,'build/current/state.json'))),f=JSON.parse(reader.read(s.freshCompilationReport));
  const result=diagnostic.validateInterfaceEvidence(reader,s,f,reader.manifest.accepted);return{inputs,reader,result};
}
assert.strictEqual(selectedValidate().result.version,1);checks++;
// Live source data cannot substitute for the copied companion.
const captured=reportRecord.storage==='copy'?path.join(path.dirname(capture.manifest),'data',reportRecord.logical):state.cInterfaceReport,saved=fs.readFileSync(captured);
write('build/current/state.json',{live:'changed'});assert.strictEqual(selectedValidate().result.version,1);checks++;write('build/current/state.json',state);
fs.appendFileSync(captured,' ');assert.throws(()=>selectedValidate(),/content drift|raw companion/);checks++;fs.writeFileSync(captured,saved);
const rawManifest=fs.readFileSync(capture.manifest);
fs.appendFileSync(captured,' ');const resigned=JSON.parse(rawManifest);Object.assign(resigned.files.find(f=>f.path===state.cInterfaceReport||reportRecord.logical&&f.logical===reportRecord.logical),api.identity(captured));fs.writeFileSync(capture.manifest,JSON.stringify(resigned));
assert.throws(()=>selectedValidate(),/raw companion identity/);checks++;fs.writeFileSync(captured,saved);fs.writeFileSync(capture.manifest,rawManifest);
fs.renameSync(captured,captured+'.saved');assert.throws(()=>selectedValidate(),/missing path/);checks++;fs.renameSync(captured+'.saved',captured);
const copiedState=path.join(path.dirname(capture.manifest),'data/build/current/state.json'),stateBytes=fs.readFileSync(copiedState),manifestBytes=fs.readFileSync(capture.manifest);
function mutateState(change,mutateFresh=false){const s=JSON.parse(stateBytes);change(s);fs.writeFileSync(copiedState,JSON.stringify(s));const m=JSON.parse(manifestBytes);const record=m.files.find(f=>f.logical==='build/current/state.json');Object.assign(record,api.identity(copiedState));fs.writeFileSync(capture.manifest,JSON.stringify(m));assert.throws(()=>selectedValidate(),/binding|path|contract|identity/);checks++;fs.writeFileSync(copiedState,stateBytes);fs.writeFileSync(capture.manifest,manifestBytes);}
mutateState(s=>{s.cInterfaceReport=path.join(fixture,'foreign.json');});
mutateState(s=>{delete s.cInterfaceReport;});
mutateState(s=>{s.cInterfaceReportSha256='0'.repeat(64);});
mutateState(s=>{for(const key of companion.FIELDS)delete s[key];});
const enrolled=JSON.parse(manifestBytes);enrolled.files=enrolled.files.filter(f=>f.logical!=='runtime/clang.exe');fs.writeFileSync(capture.manifest,JSON.stringify(enrolled));assert.throws(()=>selectedValidate(),/unenrolled/);checks++;fs.writeFileSync(capture.manifest,manifestBytes);
const noReport=JSON.parse(manifestBytes);noReport.files=noReport.files.filter(f=>f.path!==state.cInterfaceReport&&(!reportRecord.logical||f.logical!==reportRecord.logical));fs.writeFileSync(capture.manifest,JSON.stringify(noReport));
const missingReader=api.openDiagnosticInputs(capture.manifest,{root:fixture}),missingState=JSON.parse(missingReader.read(path.join(fixture,'build/current/state.json'))),missingFresh=JSON.parse(missingReader.read(missingState.freshCompilationReport));
assert.throws(()=>diagnostic.validateInterfaceEvidence(missingReader,missingState,missingFresh,missingReader.manifest.accepted),/unenrolled unretained/);checks++;fs.writeFileSync(capture.manifest,manifestBytes);
assert(selectedValidate().reader.readUnretained(state.cInterfaceReport).equals(saved));checks++;
const executable=path.join(fixture,front.executable.path);fs.renameSync(executable,executable+'.saved');assert.throws(()=>selectedValidate(),/missing path/);checks++;fs.renameSync(executable+'.saved',executable);
const liveFrontend=path.join(fixture,frontend.path),liveFrontendBytes=fs.readFileSync(liveFrontend);write(liveFrontend,{...front,version:'changed'});assert.throws(()=>selectedValidate(),/installed shared pin/);checks++;fs.writeFileSync(liveFrontend,liveFrontendBytes);
const seal=privateApi.capturePrivateInputs();fs.appendFileSync(state.cInterfaceReport,' ');assert.throws(()=>seal.assertUnchanged(),/raw companion|changed/);checks++;write(state.cInterfaceReport,report);
for(const changed of [captured,path.join(fixture,front.executable.path),liveFrontend,path.join(path.dirname(capture.manifest),'data/config/c-interface-frontend.json')]) {
  const opened=selectedValidate(),before=fs.readFileSync(changed);fs.appendFileSync(changed,' ');
  await assert.rejects(()=>opened.reader.closeResearch(),/content drift/);checks++;fs.writeFileSync(changed,before);
}
// A self-consistent manifest cannot waive the state's JSON-value or acceptance binding.
const savedFresh=fs.readFileSync(state.freshCompilationReport);
for(const kind of ['value-digest','foreign-build']) {
  const s=JSON.parse(stateBytes),f=JSON.parse(savedFresh),r=JSON.parse(saved),m=JSON.parse(manifestBytes);
  if(kind==='value-digest')s.cInterfaceReportSha256='0'.repeat(64);
  else {r.acceptanceBinding.inputFingerprint='0'.repeat(64);Object.assign(s,companion.create(s,r,fs.readFileSync(path.join(fixture,frontend.path))));write(captured,r);}
  f.cInterfaceEvidence=companion.binding(s);s.freshCompilationSha256=write(s.freshCompilationReport,f).sha256;
  fs.writeFileSync(copiedState,JSON.stringify(s));Object.assign(m.accepted,companion.binding(s),{freshCompilationSha256:s.freshCompilationSha256});
  for(const [file,match]of [[copiedState,x=>x.logical==='build/current/state.json'],[s.freshCompilationReport,x=>x.path===s.freshCompilationReport],[captured,x=>x.path===state.cInterfaceReport||reportRecord.logical&&x.logical===reportRecord.logical]])Object.assign(m.files.find(match),api.identity(file));
  fs.writeFileSync(capture.manifest,JSON.stringify(m));assert.throws(()=>selectedValidate(),kind==='value-digest'?/companion value/:/foreign acceptance binding/);checks++;
  fs.writeFileSync(captured,saved);fs.writeFileSync(state.freshCompilationReport,savedFresh);fs.writeFileSync(copiedState,stateBytes);fs.writeFileSync(capture.manifest,manifestBytes);
}
// Historical states retain the old contract: neither frontend nor interface report is consumed.
for(const key of companion.FIELDS)delete state[key];fresh={fixture:'fresh'};publish();
const old=api.captureInputSet(path.join(fixture,'build/historical-selected'));
assert.strictEqual(selectedValidate(old.manifest).result.version,0);checks++;
const oldManifest=JSON.parse(fs.readFileSync(old.manifest));assert(!oldManifest.files.some(f=>f.logical==='runtime/clang.exe'));checks++;
state.schemaVersion=6;publish();const legacy=api.captureInputSet(path.join(fixture,'build/historical-v6'));assert.strictEqual(selectedValidate(legacy.manifest).result.version,0);checks++;
console.log(JSON.stringify({status:'pass',checks,inside,fixture,capture:capture.manifest,historical:old.manifest,scope:'real disk capture/selected authentication/replay; synthetic native acceptance oracle only'}));
}
mainTest().catch(e=>{console.error(e.stack);process.exitCode=1;});
