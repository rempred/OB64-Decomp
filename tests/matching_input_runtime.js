'use strict';
// Actual CLI admission with guard intercepted before spawn. No alternate executable runs.
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert/strict'),{createRequire}=require('module');
const {ROOT}=require('../tools/lib/phase7_conventional'),api=require('../tools/lib/matching/input_set');
const root=fs.mkdtempSync(path.join(ROOT,'build/tests/input-runtime-'));
const local=require('../tools/lib/local_tools').resolveLocalTools({readOnly:true});
function manifest(name,{fake=false,missing=false,alterPins=false,omitExecution=null,copyExecution=null}={}) {
 const dir=path.join(root,name);fs.mkdirSync(path.join(dir,'data/config/phase7'),{recursive:true});
 const python=fake?path.join(root,'unaccepted-python.exe'):local.splatPython;
 if(fake)fs.writeFileSync(python,'fixture only; NEVER EXECUTED');
 const files=[process.execPath,python].map(file=>({storage:'reference',path:file,...api.identity(file)})),directories=[];
 // Enumerate the actual mandatory repository execution closure; a positive
 // fixture may not omit the directories or helpers that admission authenticates.
 function enroll(file){
  const logical=path.relative(ROOT,file).replace(/\\/g,'/'),stat=fs.lstatSync(file);
  if(stat.isDirectory()){
   const members=fs.readdirSync(file).sort();directories.push({logical,storage:'reference',path:file,members});
   for(const member of members)enroll(path.join(file,member));
  }else files.push({logical,storage:'reference',path:file,...api.identity(file)});
 }
 enroll(path.join(ROOT,'tools/lib'));
 for(const relative of ['tools/match.js','tools/matching_workbench/private_guard.py','tools/matching_workbench/store.py','tools/matching_workbench/schema.sql'])enroll(path.join(ROOT,relative));
 if(omitExecution){const index=files.findIndex(record=>record.logical===omitExecution);assert(index>=0);files.splice(index,1);}
 if(copyExecution){const record=files.find(record=>record.logical===copyExecution);assert(record);const destination=path.join(dir,'data',copyExecution);fs.mkdirSync(path.dirname(destination),{recursive:true});fs.copyFileSync(record.path,destination);record.storage='copy';delete record.path;}
 if(!missing)for(const logical of ['config/local-tools.json','config/phase7/conventional-build.json']) {
  const value=JSON.parse(fs.readFileSync(path.join(ROOT,logical)));
  if(logical.endsWith('local-tools.json'))value.splatPython=python;
  if(alterPins&&logical.endsWith('conventional-build.json'))value.splat.pythonExeSha256=api.identity(python).sha256;
  const file=path.join(dir,'data',logical);fs.writeFileSync(file,JSON.stringify(value));files.push({logical,storage:'copy',...api.identity(file)});
 }
 const file=path.join(dir,'manifest.json');fs.writeFileSync(file,JSON.stringify({schemaVersion:1,kind:'ob64-private-inputs',repository:ROOT,accepted:{fingerprint:'F'.repeat(64)},runtime:{...local,splatPython:python},files,directories}));return file;
}
function cli(runtimeApi=api, enterGuard=false) {
 const file=path.join(ROOT,'tools/match.js'),mod={exports:{}},req=createRequire(file),events=[];
 vm.runInNewContext(fs.readFileSync(file,'utf8'),{module:mod,Buffer,console,__filename:file,__dirname:path.dirname(file),process:{...process,env:{...process.env,OB64_MATCH_PYTHON:undefined}},require:name=>name==='./lib/matching/input_set'?runtimeApi:name==='./lib/matching/private_workspace'?{
  resolvePrivateWorkspace(){return {matchingRoot:path.join(root,'private'),storeOptions:{database:path.join(root,'unused.sqlite')}};},
  async withPrivateWorkspace(workspace,options,callback){events.push({python:options.python});if(enterGuard)await callback();},assertPrivateWorkspace(){}}
  :name==='./lib/matching/store'?{requestStore(){throw Error('unexpected store spawn');}}:req(name)});
 return {api:mod.exports,events};
}
(async()=>{
 let checks=0;
 for(const command of ['intake','watch','probe']) {
  const args=[command,'func_00042dc4','--scratch-root','build/matching/runtime-fixture',...(command==='intake'?[]:['--source',path.join(root,'candidate.c')])];
  for(const [name,options]of [['missing',{fake:true,missing:true}],['unpinned',{fake:true}],['self-pinned',{fake:true,alterPins:true}]]){
   const f=cli();await assert.rejects(f.api.main([...args,'--inputs',manifest(command+name,options)]),/selected inputs:|Python executable SHA-256 drift/);assert.equal(f.events.length,0);checks++;
  }
  const f=cli(),file=manifest(command+'positive');await f.api.main([...args,'--inputs',file]);assert.deepEqual(f.events,[{python:local.splatPython}]);checks++;
 }
 // Positively enrolled code remains mandatory even if the supplied manifest
 // omits it or presents byte-identical copied code instead of shared code.
 for(const omitted of ['tools/matching_workbench/private_guard.py','tools/matching_workbench/store.py','tools/matching_workbench/schema.sql','tools/lib/matching/store.js']){
  const f=cli();await assert.rejects(f.api.main(['intake','func_00042dc4','--scratch-root','build/matching/runtime-fixture','--inputs',manifest('omitted-'+checks,{omitExecution:omitted})]),/selected inputs:/);assert.equal(f.events.length,0);checks++;
 }
 const copied=cli();await assert.rejects(copied.api.main(['intake','func_00042dc4','--scratch-root','build/matching/runtime-fixture','--inputs',manifest('copied-guard',{copyExecution:'tools/matching_workbench/private_guard.py'})]),/required shared implementation is not enrolled/);assert.equal(copied.events.length,0);checks++;
 // Real runtime admission does not accept missing selected model/proof inputs.
 const incomplete=cli(api,true);await assert.rejects(incomplete.api.main(['intake','func_00042dc4','--scratch-root','build/matching/runtime-fixture','--inputs',manifest('incomplete-proof')]),/selected inputs:/);assert.equal(incomplete.events.length,1);checks++;
 // The same actual entry path must also reject an unpinned executing Node.
 // A VM process fixture represents execPath; that text file is never executed.
 const conventionalFile=path.join(ROOT,'tools/lib/phase7_conventional.js'),nodeFile=path.join(root,'unaccepted-node.exe');fs.writeFileSync(nodeFile,'not executable');
 const c={exports:{}};vm.runInNewContext(fs.readFileSync(conventionalFile,'utf8'),{module:c,require:createRequire(conventionalFile),Buffer,__dirname:path.dirname(conventionalFile),__filename:conventionalFile,process:{...process,execPath:nodeFile},console});
 const inputFile=path.join(ROOT,'tools/lib/matching/input_set.js'),m={exports:{}},req=createRequire(inputFile);
 vm.runInNewContext(fs.readFileSync(inputFile,'utf8'),{module:m,require:name=>name==='../phase7_conventional'?c.exports:req(name),Buffer,__dirname:path.dirname(inputFile),process,console});
 const f=cli(m.exports);await assert.rejects(f.api.main(['intake','func_00042dc4','--scratch-root','build/matching/runtime-fixture','--inputs',manifest('wrong-node')]),/Node executable SHA-256 drift/);assert.equal(f.events.length,0);checks++;
 console.log(JSON.stringify({status:'pass',checks,root,acceptance:false,scope:'actual CLI/parser/runtime-pin functions; guard intercepted before spawn; no unaccepted executable launched'}));
})().catch(error=>{console.error(error);process.exitCode=1;});
