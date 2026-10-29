'use strict';
// Explicit native fixture only: no retail acceptance, no operational capture,
// and no mutation of the production config/source/include or accepted outputs.
const fs=require('fs'),path=require('path'),assert=require('assert/strict'),cp=require('child_process');
const {ROOT}=require('../tools/lib/phase7_conventional');
const set=require('../tools/lib/matching/input_set');
const guard=require('../tools/lib/matching/private_workspace');
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function waitFor(predicate){const end=Date.now()+30000;while(!predicate()){if(Date.now()>end)throw Error('native fixture coordination timeout');await sleep(25);}}

async function child(control,worker){
  const manifest=path.join(control,'set/manifest.json');
  const workspace=guard.resolvePrivateWorkspace({root:ROOT,scratchRoot:`build/matching/${worker}`});
  const inputs=set.openInputSet(manifest,{privateRoot:workspace.matchingRoot});
  await guard.withPrivateWorkspace(workspace,{native:true,python:inputs.resolve(inputs.manifest.runtime.splatPython)},async()=>{
    fs.writeFileSync(path.join(control,worker+'.ready'),'ready');
    await waitFor(()=>fs.existsSync(path.join(control,'go')));
    assert.equal(fs.readFileSync(inputs.resolve(path.join(control,'live/config.json')),'utf8'),'original-config');
    assert.equal(fs.readFileSync(inputs.resolve(path.join(control,'live/source.c')),'utf8'),'original-source');
    const legacy=JSON.parse(fs.readFileSync(inputs.resolve(path.join(ROOT,'config/phase8/matching-c.json'))));
    const reproduction=JSON.parse(fs.readFileSync(inputs.resolve(path.join(ROOT,legacy.compiler.manifest))));
    const target={symbol:'func_00000000',targetId:set.digest(Buffer.from(inputs.id)),placementKind:'early-boot-linear',bytes:8,
      romStart:0,romEndExclusive:8,vramStart:0x80000000,expectedBytes:Buffer.alloc(8),symbolByteOffset:0};
    const context={phase8:{config:{compiler:legacy.compiler},phase6Manifest:reproduction,targets:[]},localTools:{compiler:inputs.manifest.runtime.compiler}};
    set.bind(context, inputs);
    const sourcePath=path.join(workspace.matchingRoot,'candidate.c'),source=fs.readFileSync(sourcePath,'utf8');
    const read=fs.readFileSync;
    let report;
    try{
      fs.readFileSync=function(file,...args){
        if(typeof file==='string'&&['config','src','include'].some(dir=>path.resolve(file).toLowerCase().startsWith(path.join(ROOT,dir).toLowerCase()+path.sep)))throw Error('native fixture attempted live mutable read: '+file);
        return read.call(fs,file,...args);
      };
      const options={context,inputs,matchingRoot:workspace.matchingRoot,privateWorkspace:true,sourcePath,passes:['rtl'],assertPrivateInputs:()=>inputs.assertUnchanged()};
      const probe=require('../tools/lib/matching/probe');
      report=probe.runProbe({},target,source,options);assert.equal(report.status,'complete');
      const cached=probe.runProbe({},target,source,options);assert.equal(cached.cached,true);
      assert.equal(report.identity.inputSetId,inputs.id);
    }finally{fs.readFileSync=read;}
    inputs.assertUnchanged();
    fs.writeFileSync(path.join(control,worker+'.result.json'),JSON.stringify({status:'pass',probeId:report.probeId,
      assemblySha256:set.identity(path.join(ROOT,report.assembly)).sha256,inputSetId:inputs.id,report:report.assembly,cached:true,acceptance:false}));
  });
}

async function parent(){
  const root=fs.mkdtempSync(path.join(ROOT,'build/tests/input-native-')),data=path.join(root,'set/data');
  fs.mkdirSync(data,{recursive:true});fs.mkdirSync(path.join(root,'live'));
  fs.writeFileSync(path.join(root,'live/config.json'),'original-config');fs.writeFileSync(path.join(root,'live/source.c'),'original-source');
  fs.writeFileSync(path.join(root,'live/header.h'),'#define VALUE 7\n');
  const config=JSON.parse(fs.readFileSync(path.join(ROOT,'config/source-policy.json')));
  const local=require('../tools/lib/local_tools').resolveLocalTools({readOnly:true});
  const files=[],directories=[];
  function file(original,storage,bytes){
    original=path.resolve(ROOT,original);const logical=path.relative(ROOT,original).replace(/\\/g,'/');
    const inside=!logical.startsWith('..')&&!path.isAbsolute(logical);
    if(storage==='copy'){const target=path.join(data,logical);fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,bytes||fs.readFileSync(original));files.push({logical,storage,...set.identity(target)});}
    else files.push({...(inside?{logical}:{}),storage,path:original,...set.identity(original)});
  }
  for(const relative of ['config/source-policy.json','config/phase8/matching-c.json'])file(relative,'copy');
  for(const relative of [path.join(root,'live/config.json'),path.join(root,'live/source.c')])file(relative,'copy');
  file('include/isolation_fixture.h','copy',fs.readFileSync(path.join(root,'live/header.h')));
  directories.push({logical:'include',storage:'copy',members:['isolation_fixture.h']});
  for(const relative of [config.matchingCompiler.manifest,config.preprocessor.path,...config.preprocessor.requiredExecutables.map(item=>item.path),local.compiler,local.splatPython])file(relative,'reference');
  const manifest={schemaVersion:1,kind:'ob64-private-inputs',repository:ROOT,runtime:{compiler:local.compiler,splatPython:local.splatPython},
    accepted:{fingerprint:'F'.repeat(64)},files,directories};
  fs.writeFileSync(path.join(root,'set/manifest.json'),JSON.stringify(manifest));
  const suffix=path.basename(root).slice(-6).toLowerCase(),workers=[`iso-${suffix}-a`,`iso-${suffix}-b`];
  const children=workers.map(worker=>{
    const privateRoot=path.join(ROOT,'build/matching',worker);fs.mkdirSync(privateRoot);
    fs.writeFileSync(path.join(privateRoot,'candidate.c'),'#include "isolation_fixture.h"\nint func_00000000(void) { return VALUE; }\n');
    const log=fs.openSync(path.join(root,worker+'.log'),'wx');
    const process=cp.spawn(global.process.execPath,[__filename,'--child',root,worker],{cwd:ROOT,stdio:['ignore',log,log],windowsHide:true});
    return {worker,process,log,done:new Promise(resolve=>process.once('exit',(code,signal)=>resolve({code,signal})))};
  });
  await waitFor(()=>workers.every(worker=>fs.existsSync(path.join(root,worker+'.ready'))));
  // Both guarded commands hold the same selected set while only this synthetic
  // live fixture changes. A production input is never edited by this control.
  for(const [name,text]of [['config.json','changed-config'],['source.c','changed-source'],['header.h','#define VALUE 99\n']])fs.writeFileSync(path.join(root,'live',name),text);
  fs.writeFileSync(path.join(root,'go'),'go');
  const exits=await Promise.all(children.map(child=>child.done));for(const child of children)fs.closeSync(child.log);
  assert(exits.every(exit=>exit.code===0),JSON.stringify({root,exits}));
  const results=workers.map(worker=>JSON.parse(fs.readFileSync(path.join(root,worker+'.result.json'))));
  assert.equal(results[0].assemblySha256,results[1].assemblySha256);assert.equal(results[0].inputSetId,results[1].inputSetId);
  const result={status:'pass',fixtureOnly:true,acceptance:false,root,workers,exits,results,controls:['two guarded roots overlap','selected mutable data survive fixture integration','live config/src/include reads prohibited','pinned compiler fresh in each root','selected probe cache reuse','same selected header yields same assembly']};
  fs.writeFileSync(path.join(root,'result.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
}
(process.argv[2]==='--child'?child(process.argv[3],process.argv[4]):parent()).catch(error=>{console.error(error);process.exitCode=1;});
