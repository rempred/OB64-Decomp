'use strict';
// Transaction tests for the actual capture implementation, with its existing
// acceptance gate replaced by an explicit fixture. No retail proof is invented.
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert/strict');
const set=require('../tools/lib/matching/input_set'),privateInputs=require('../tools/lib/matching/private_inputs');
const repo=path.resolve(__dirname,'..'),root=fs.mkdtempSync(path.join(repo,'build/tests/capture-fixture-'));
const write=(relative,text)=>{const file=path.join(root,relative);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,text);return file;};
const json=(relative,value)=>write(relative,JSON.stringify(value));
json('config/matching-c-targets.json',{targets:[{source:'src/a.c'}]});json('config/matching-c-compilation-groups.json',{groups:[]});
json('config/toolchain.json',{localRoot:'.runtime',tools:{as:'bin/as.exe'}});
write('src/a.c','int a(void){return 1;}\n');write('include/a.h','int a(void);\n');
for(const dir of ['docs/dossiers','docs/archive/matching-c-candidates'])fs.mkdirSync(path.join(root,dir),{recursive:true});
json('docs/matching-c/compiler-lessons.json',{lessons:[]});json('asm/original/rev0/manifest.json',{});write('asm/original/rev0/a.s','.word 1');
write('tools/lib/matching/input_set.js','fixture-shared-code');for(const name of ['store.py','schema.sql','private_guard.py'])write('tools/matching_workbench/'+name,'fixture');
const compiler=write('.runtime/compiler.exe','compiler'),python=write('.runtime/python.exe','python'),node=write('.runtime/node.exe','node');
write('.runtime/cpp.exe','cpp');write('.runtime/cc1.exe','cc1');write('.runtime/bin/as.exe','assembler');write('.runtime/powershell/powershell.exe','powershell');
const split=write('.runtime/split.py','split');for(const name of ['diff.py','pyproject.toml','LICENSE'])write('.runtime/differ/'+name,name);
write('build/baserom.us_rev0.z64','fixture-rom');json('compiler-manifest.json',{});
const output=path.join(root,'build/accepted');json('build/accepted/build-report.json',{fixture:true});write('build/accepted/phase8.us_rev0.z64','fixture-rom');
const fresh=json('build/current/fresh.json',{fixture:'fresh'}),verified=json('build/current/verified.json',{fixture:'verified'});
const state={schemaVersion:6,fingerprint:'F'.repeat(64),baselineFingerprint:'B'.repeat(64),verifiedAt:'fixture',output,
  buildReport:set.identity(path.join(output,'build-report.json')),verificationReport:verified,freshCompilationReport:fresh,
  verificationSha256:set.identity(verified).sha256,freshCompilationSha256:set.identity(fresh).sha256};
json('build/current/state.json',state);json('build/current/baseline-state.json',{});
let mode='normal',exact=true,gateCalls=0;
const originalSource=fs.readFileSync(path.join(root,'src/a.c'));
const prepared=()=>({model:{config:{acceptedInputSha256:{}}},phase8:{targets:[{source:'src/a.c'}]},
  sourcePolicy:{targets:[{source:'src/a.c',sourceBytes:originalSource.length,sourceSha256:set.digest(originalSource),dependencies:[]}]},
  localTools:{compiler,splatPython:python,splatSplit:split,powershellRuntimeRoot:path.join(root,'.runtime/powershell'),asmDifferRoot:path.join(root,'.runtime/differ')}});
const moduleFixture={exports:{}};
vm.runInNewContext(fs.readFileSync(require.resolve('../tools/lib/matching/input_set'),'utf8'),{module:moduleFixture,Buffer,
  __dirname:path.join(root,'tools/lib/matching'),process:{execPath:node,env:{}},require:name=>{
    if(name==='../execution_paths') {
      const execution={exports:{}};
      vm.runInNewContext(fs.readFileSync(require.resolve('../tools/lib/execution_paths'),'utf8'),{
        module:execution,require,__dirname:path.join(root,'tools/lib')
      });
      return execution.exports;
    }
    if(name==='../current_workflow')return{prepareContext(options){assert.equal(options.readOnly,true);gateCalls++;return prepared();},currentVerificationState(){return{exact,state};}};
    if(name==='./private_inputs')return{capturePrivateInputs(options){return privateInputs.capturePrivateInputs({root,directories:['config','src','include','tools/lib'],files:['build/current/state.json'],extraDirectories:options.extraDirectories});}};
    if(name==='../source_policy')return{loadPolicyConfig(){return{matchingCompiler:{manifest:'compiler-manifest.json'},preprocessor:{path:'.runtime/cpp.exe',requiredExecutables:[{path:'.runtime/cc1.exe'}]}};}};
    if(name==='fs')return{...fs,copyFileSync(source,target,flags){if(source===path.join(root,'src/a.c')&&mode==='interrupt')throw Error('fixture interrupted copy');fs.copyFileSync(source,target,flags);if(source===path.join(root,'src/a.c')&&mode==='drift')fs.writeFileSync(source,'int a(void){return 2;}\n');}};
    return require(name);
  }});
const api=moduleFixture.exports;
exact=false;assert.throws(()=>api.captureInputSet(path.join(root,'build/unaccepted')),/currently verified/);assert(!fs.existsSync(path.join(root,'build/unaccepted')));exact=true;
mode='interrupt';assert.throws(()=>api.captureInputSet(path.join(root,'build/interrupted')),/interrupted copy/);assert(!fs.existsSync(path.join(root,'build/interrupted/manifest.json')));
mode='drift';assert.throws(()=>api.captureInputSet(path.join(root,'build/drifted')),/changed|differs/);assert(!fs.existsSync(path.join(root,'build/drifted/manifest.json')));fs.writeFileSync(path.join(root,'src/a.c'),originalSource);
mode='normal';const captured=api.captureInputSet(path.join(root,'build/complete'));assert(captured.copiedBytes>0);assert(captured.referencedBytes>0);
const manifest=JSON.parse(fs.readFileSync(captured.manifest));assert.equal(manifest.files.find(file=>file.logical==='src/a.c').storage,'copy');assert.equal(manifest.files.find(file=>file.logical==='asm/original/rev0/a.s').storage,'reference');
assert.throws(()=>api.captureInputSet(path.join(root,'build/complete')),/already exists/);assert.equal(gateCalls,4);
console.log(JSON.stringify({status:'pass',root,fixtureOnly:true,retailAcceptance:false,controls:['requires existing acceptance','interrupted capture unpublished','source mutation unpublished','exclusive publication','copy/reference roles','read-only preparation']},null,2));
