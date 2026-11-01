'use strict';
const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const root=path.resolve(__dirname,'..');
fs.mkdirSync(path.join(root,'build/tests'),{recursive:true});
const base=process.env.OB64_TEST_SOURCE_ROOT||fs.mkdtempSync(path.join(root,'build/tests/intake-source-'));
if(process.env.OB64_TEST_SOURCE_ROOT){assert(!fs.existsSync(base));fs.mkdirSync(base);}
const out=base;
const api=require(path.join(root,'tools/lib/matching/input_set')),policy=require(path.join(root,'tools/lib/source_policy'));
const {createResearchSourceSession}=require(path.join(root,'tools/lib/matching/research_source'));
const results=[];let serial=0;
// A small copied-header selection with shared authenticated executable pins.
// No baserom, accepted output or toolchain binary is copied into this fixture.
const selected=path.join(base,'selection');fs.mkdirSync(selected);
const files=[],directories=[];
function enroll(relative,storage){
 const original=path.join(root,relative),stored=storage==='copy'?path.join(selected,'data',relative):original;
 const stat=fs.lstatSync(original);assert(!stat.isSymbolicLink());
 if(stat.isDirectory()){
  const members=fs.readdirSync(original).sort();
  if(storage==='copy')fs.mkdirSync(stored,{recursive:true});
  directories.push({logical:relative,storage,...(storage==='reference'?{path:original}:{}),members});
  for(const name of members)enroll(relative+'/'+name,storage);
 }else{
  if(storage==='copy'){fs.mkdirSync(path.dirname(stored),{recursive:true});fs.copyFileSync(original,stored);}
  files.push({logical:relative,storage,...(storage==='reference'?{path:original}:{}),...api.identity(stored)});
 }
}
const configured=policy.loadPolicyConfig();
enroll('config/source-policy.json','copy');enroll('include','copy');
for(const relative of [configured.matchingCompiler.manifest,configured.preprocessor.path,...configured.preprocessor.requiredExecutables.map(x=>x.path)])enroll(relative,'reference');
const manifestFile=path.join(selected,'manifest.json');
fs.writeFileSync(manifestFile,JSON.stringify({schemaVersion:1,kind:'ob64-private-inputs',repository:root,accepted:{fingerprint:'A'.repeat(64)},files,directories}));
function open(directory,live){return live?api.openLiveResearchInputs({privateRoot:directory}):api.openResearchInputSet(manifestFile,{privateRoot:directory});}
function fixture(){const directory=path.join(base,'case-'+serial++);fs.mkdirSync(directory);fs.mkdirSync(path.join(directory,'nested'));fs.mkdirSync(path.join(directory,'unused'));fs.mkdirSync(path.join(directory,'unused/deep'));fs.writeFileSync(path.join(directory,'nested/a.h'),'#include "b.h"\n');fs.writeFileSync(path.join(directory,'nested/b.h'),'#define VALUE 1\n');const source=path.join(directory,'source.c');fs.writeFileSync(source,'#define HEADER "nested/a.h"\n#include HEADER\n#include <common/types.h>\nu32 value(void){return VALUE;}\n');return {directory,source};}
async function check(live,name,setup,change,reject=true){const f=fixture();if(setup)setup(f);const inputs=open(f.directory,live),session=createResearchSourceSession(inputs);const result=session.classifySource(f.source,{inputs});assert.equal(result.class,'PURE_C');if(change)change(f);if(reject)await assert.rejects(()=>session.close());else await session.close();results.push({mode:live?'live':'selected',name,result:reject?'rejected':'passed'});}
(async()=>{
 for(const live of [false,true]){
  const f=fixture(),baselineInputs=open(f.directory,live),baseline=policy.classifySource(f.source,{inputs:baselineInputs});await baselineInputs.closeResearch();
  const inputs=open(f.directory,live),session=createResearchSourceSession(inputs),value=session.classifySource(f.source,{inputs});
  assert.deepEqual(JSON.parse(JSON.stringify(value)),JSON.parse(JSON.stringify(baseline)));assert(policy.compilationInputBytes(value).equals(policy.compilationInputBytes(baseline)));assert.equal(api.context(value),inputs);assert.throws(()=>api.assertProduction(inputs),/research-only/);assert.throws(()=>api.assertProduction(api.context({...value})),/research-only/);await session.close();assert.throws(()=>session.classifySource(f.source,{inputs}),/closed/);results.push({mode:live?'live':'selected',name:'nested macro angle include full classification/bytes/context',result:'passed'});
  await check(live,'same-size/mtime header drift',null,f=>{const file=path.join(f.directory,'nested/b.h'),stat=fs.statSync(file);fs.writeFileSync(file,'#define VALUE 2\n');fs.utimesSync(file,stat.atime,stat.mtime);});
  await check(live,'same-path header drift with unchanged expansion',f=>fs.appendFileSync(path.join(f.directory,'nested/b.h'),'/* first */\n'),f=>fs.writeFileSync(path.join(f.directory,'nested/b.h'),'#define VALUE 1\n/* other */\n'));
  await check(live,'authored source drift',null,f=>fs.appendFileSync(f.source,'/* changed */\n'));
  await check(live,'same-byte earlier nested include shadow',f=>fs.writeFileSync(f.source,'#include "common/types.h"\nu32 value(void){return 1;}\n'),f=>{fs.mkdirSync(path.join(f.directory,'common'));fs.copyFileSync(path.join(root,'include/common/types.h'),path.join(f.directory,'common/types.h'));});
  await check(live,'consumed header hardlink',null,f=>fs.linkSync(path.join(f.directory,'nested/b.h'),path.join(f.directory,'alias.h')));
  await check(live,'output-affecting availability drift',f=>fs.writeFileSync(f.source,'#if __has_include("unused/deep/optional.h")\nint value(void){return 1;}\n#else\nint value(void){return 2;}\n#endif\n'),f=>fs.writeFileSync(path.join(f.directory,'unused/deep/optional.h'),'/* optional */\n'));
  await check(live,'output-identical unconsumed availability allowed',f=>fs.writeFileSync(f.source,'#if __has_include("unused/deep/optional.h")\nint value(void){return 1;}\n#else\nint value(void){return 1;}\n#endif\n'),f=>fs.writeFileSync(path.join(f.directory,'unused/deep/optional.h'),'/* optional */\n'),false);
  await check(live,'unused descendant membership allowed',null,f=>fs.writeFileSync(path.join(f.directory,'unused/deep/irrelevant'),'unread'),false);
  const alias=fixture(),target=path.join(alias.directory,'actual');fs.mkdirSync(target);fs.writeFileSync(path.join(target,'value.h'),'#define VALUE 1\n');fs.symlinkSync(target,path.join(alias.directory,'redirect'),'junction');fs.writeFileSync(alias.source,'#include "redirect/value.h"\nint value(void){return VALUE;}\n');const aliasInputs=open(alias.directory,live),aliasSession=createResearchSourceSession(aliasInputs);assert.throws(()=>aliasSession.classifySource(alias.source,{inputs:aliasInputs}));results.push({mode:live?'live':'selected',name:'consumed reparse ancestor',result:'rejected'});
 }
 const outside=path.join(base,'unenrolled.h');fs.writeFileSync(outside,'#define VALUE 1\n');const f=fixture();fs.writeFileSync(f.source,'#include "'+outside.replace(/\\/g,'/')+'"\nint value(void){return VALUE;}\n');const inputs=open(f.directory,false);assert.throws(()=>createResearchSourceSession(inputs).classifySource(f.source,{inputs}));results.push({mode:'selected',name:'unenrolled actual dependency',result:'rejected'});
 assert.throws(()=>createResearchSourceSession({}),/research-only/);results.push({name:'strict/unbranded context refuses helper',result:'rejected'});
 for(const live of [false,true]){
  const f=fixture(),note=path.join(f.directory,'note.txt');fs.writeFileSync(note,'first');
  const inputs=open(f.directory,live),session=createResearchSourceSession(inputs);inputs.readResearch(note);session.classifySource(f.source,{inputs});fs.writeFileSync(note,'other');await assert.rejects(()=>session.close());results.push({mode:live?'live':'selected',name:'consumed reference closing drift',result:'rejected'});
 }
 {
  const f=fixture(),inputs=open(f.directory,false),session=createResearchSourceSession(inputs),before=fs.readFileSync(manifestFile);
  session.classifySource(f.source,{inputs});fs.appendFileSync(manifestFile,'\n');try{await assert.rejects(()=>session.close());}finally{fs.writeFileSync(manifestFile,before);}results.push({name:'manifest closing drift',result:'rejected'});
 }
 {
  const f=fixture(),inputs=open(f.directory,false),session=createResearchSourceSession(inputs),added=path.join(selected,'data/include/new-shadow.h');
  session.classifySource(f.source,{inputs});fs.writeFileSync(added,'/* added */');try{await assert.rejects(()=>session.close());}finally{fs.unlinkSync(added);}results.push({name:'configured copied include closure retained',result:'rejected'});
 }
 {
  const f=fixture(),inputs=open(f.directory,false),config=policy.loadPolicyConfig();config.preprocessor={...config.preprocessor,version:'untrusted'};
  assert.throws(()=>policy.resolvePreprocessor(config,inputs),/trusted shared contract/);results.push({name:'preprocessor contract mismatch',result:'rejected'});
 }
 const record={status:'pass',scope:'Scratch postimage helper; actual pinned CPP; no native compiler/acceptance; link fixtures retained for no-follow cleanup',checks:results.length,results};fs.writeFileSync(path.join(out,'source-controls.json'),JSON.stringify(record,null,2));
 if(process.platform==='win32'){
  const python=require('../tools/lib/local_tools').resolveLocalTools({readOnly:true}).splatPython;
  const script=process.env.OB64_TEST_GUARD_SCRIPT||path.join(root,'tests/matching_intake_guard.py');
  const guard=require('child_process').spawnSync(python,['-I','-S',script],{cwd:root,windowsHide:true,encoding:'utf8',maxBuffer:4*1024*1024});
  assert.equal(guard.status,0,guard.stderr);record.guard=JSON.parse(guard.stdout);
 }
 console.log(JSON.stringify(record));
})().catch(e=>{console.error(e.stack);process.exitCode=1;});
