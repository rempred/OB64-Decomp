'use strict';
const assert=require('assert'),fs=require('fs'),path=require('path'),cp=require('child_process');
const {ROOT,sha256File}=require('../tools/lib/phase7_conventional');
const {loadWorkbenchModel,resolveTarget,targetRecord,digest}=require('../tools/lib/matching/target_model');
const {requestStore}=require('../tools/lib/matching/store');
const {candidateRecord}=require('../tools/lib/matching/compiler');
const policy=require('../tools/lib/source_policy');
const research=require('../tools/lib/matching/research');
function run() {
 const started=Date.now(),base=path.join(ROOT,'build/w8-reuse-pilot-r1');fs.mkdirSync(base,{recursive:true});const root=fs.mkdtempSync(path.join(base,'tests-'));
 const workbench=loadWorkbenchModel(),target=resolveTarget(workbench,'func_001F3C00');
 const options={syncTargets:false,matchingRoot:path.join(root,'matching'),storeOptions:{database:path.join(root,'store.sqlite')}};
 const query=request=>requestStore(request,options.storeOptions);query({action:'init'});query({action:'upsert_targets',records:[targetRecord(target)]});
 const source=path.join(root,'fixture.c');fs.writeFileSync(source,`/* ${path.basename(root)} */\n#include "game/combat_types.h"\nu32 func_001F3C00(u32 v) { return v + 7; }\n`);
 const c=policy.classifySource(source);assert.equal(c.class,'PURE_C');
 const reference='docs/MATCHING_WORKBENCH.md';
 const observation={schemaVersion:1,label:'fixture',role:'pair-baseline',context:'Independent test context.',sourceChange:'Original control.',effects:['fixture-effect'],observedEffect:'Authored fixture claim, not acceptance.',remainingFailure:'Not a retail replacement.',selectedBest:false,parentCandidateId:null,relatedCandidateIds:[],references:[{path:reference,sha256:sha256File(path.join(ROOT,reference))}],expected:{sourceSha256:c.sourceSha256,expandedSha256:c.compilationInput.sha256,dependencies:c.dependencies}};
 let checks=0,preserved;const check=(name,fn)=>{fn();checks++;};const clone=value=>JSON.parse(JSON.stringify(value));
 const compiler=JSON.parse(fs.readFileSync(path.join(ROOT,'config/local-tools.json'))).compiler;
 const spawn=cp.spawnSync;let codegen=0;cp.spawnSync=function(exe,...args){if(path.resolve(exe).toLowerCase()===path.resolve(compiler).toLowerCase()){codegen++;throw new Error('import/export attempted code generation');}return spawn.call(this,exe,...args);};
 try {
  const before=query({action:'query',name:'status',args:{modelId:workbench.modelId}});
  const imported=research.importResearch(workbench,target,source,observation,options);
  check('import without codegen',()=>{assert.equal(imported.compiled,false);assert.equal(imported.sourceSha256,c.sourceSha256);});
  check('repeat import idempotent',()=>assert.deepEqual(research.importResearch(workbench,target,source,observation,options),imported));
  check('bounded tagged query',()=>{assert.equal(research.observations(target,'fixture-effect',1,options).length,1);assert.equal(research.observations(target,'other-effect',1,options).length,0);assert.throws(()=>research.observations(target,'bad tag',1,options),/malformed/);assert.throws(()=>research.observations(target,undefined,201,options),/1\.\.200/);});
  check('malformed metadata',()=>{const bad=clone(observation);bad.authenticated={};assert.throws(()=>research.importResearch(workbench,target,source,bad,options),/malformed/);});
  check('NUL prose and note reject',()=>{const bad=clone(observation);bad.label='bad\0label';assert.throws(()=>research.importResearch(workbench,target,source,bad,options),/malformed/);assert.throws(()=>research.preserveResearch(workbench,imported.candidateId,imported.observationId,'bad\0note',options),/needs candidate/);});
  for(const field of ['sourceSha256','expandedSha256'])check('wrong '+field,()=>{const bad=clone(observation);bad.expected[field]='0'.repeat(64);assert.throws(()=>research.importResearch(workbench,target,source,bad,options),/identity drift/);});
  check('wrong header hash',()=>{const bad=clone(observation);bad.expected.dependencies[0].sha256='0'.repeat(64);assert.throws(()=>research.importResearch(workbench,target,source,bad,options),/identity drift/);});
  check('wrong report hash',()=>{const bad=clone(observation);bad.references[0].sha256='0'.repeat(64);assert.throws(()=>research.importResearch(workbench,target,source,bad,options),/reference identity drift/);});
  check('missing parent',()=>{const bad=clone(observation);bad.parentCandidateId='0'.repeat(64);assert.throws(()=>research.importResearch(workbench,target,source,bad,options),/existing candidate/);});
  const second=resolveTarget(workbench,'func_001F6098');query({action:'upsert_targets',records:[targetRecord(second)]});
  const foreign=candidateRecord(second,'int x;');query({action:'put_candidate',record:foreign});
  check('foreign parent',()=>{const bad=clone(observation);bad.parentCandidateId=foreign.candidateId;assert.throws(()=>research.importResearch(workbench,target,source,bad,options),/same target/);});
  check('self-parent and self-related reject',()=>{const bad=clone(observation);bad.parentCandidateId=imported.candidateId;assert.throws(()=>research.importResearch(workbench,target,source,bad,options),/reference itself/);bad.parentCandidateId=null;bad.relatedCandidateIds=[imported.candidateId];assert.throws(()=>research.importResearch(workbench,target,source,bad,options),/reference itself/);});
  check('distinct same-target parent and related relations',()=>{const child=clone(observation),file=path.join(root,'child.c');fs.writeFileSync(file,fs.readFileSync(source,'utf8').replace('v + 7','v + 8'));const cls=policy.classifySource(file);child.expected={sourceSha256:cls.sourceSha256,expandedSha256:cls.compilationInput.sha256,dependencies:cls.dependencies};child.parentCandidateId=imported.candidateId;child.relatedCandidateIds=[imported.candidateId];child.label='child-context';const result=research.importResearch(workbench,target,file,child,options);assert.notEqual(result.candidateId,imported.candidateId);});
  const stored=query({action:'query',name:'candidate',args:{candidateId:imported.candidateId}});
  check('rehashed variant-label mismatch rejects',()=>{
   const bad=candidateRecord(target,stored.source_text,{origin:'research-import',variant:'mismatched-label',metadata:clone(stored.metadata)});query({action:'put_candidate',record:bad});
   assert.throws(()=>research.preserveResearch(workbench,imported.candidateId,bad.observationId,'test',options),/provenance mismatch/);
  });
  check('tampered authenticated preprocessor rejects',()=>{
   const metadata=clone(stored.metadata);metadata.research.authenticated.preprocessor.sha256='0'.repeat(64);
   const bad=candidateRecord(target,stored.source_text,{origin:'research-import',variant:metadata.research.authored.label,metadata});query({action:'put_candidate',record:bad});
   assert.throws(()=>research.preserveResearch(workbench,imported.candidateId,bad.observationId,'test',options),/preprocessor identity drift/);
  });
  check('foreign observation rejects',()=>assert.throws(()=>research.preserveResearch(workbench,imported.candidateId,foreign.observationId,'test',options),/does not belong/));
  check('preservation rechecks newly grouped target',()=>{const grouped={...workbench,activeTargetsBySymbol:new Map([[target.symbol.toLowerCase(),{compilationGroup:{id:'test'}}]])};assert.throws(()=>research.preserveResearch(grouped,imported.candidateId,imported.observationId,'test',options),/complete group candidate/);});
  check('preserve exact source and selected observation',()=>{preserved=research.preserveResearch(workbench,imported.candidateId,imported.observationId,'Test preservation.',options);assert(fs.readFileSync(path.join(ROOT,preserved.source)).equals(fs.readFileSync(source)));const exported=JSON.parse(fs.readFileSync(path.join(ROOT,preserved.observation)));assert.deepEqual(exported.authored,observation);assert.match(fs.readFileSync(path.join(ROOT,preserved.dossier),'utf8'),/does not change current source ownership/);assert(!fs.readFileSync(path.join(ROOT,preserved.dossier),'utf8').includes('assembly remains the accepted owner'));});
  check('existing export does not overwrite',()=>assert.throws(()=>research.preserveResearch(workbench,imported.candidateId,imported.observationId,'test',options),/already exists/));
  check('snapshot shadow blocks preserve',()=>{const dir=path.join(options.matchingRoot,'research-preserve',imported.observationId);fs.writeFileSync(path.join(dir,'shadow.h'),'extra');assert.throws(()=>research.preserveResearch(workbench,imported.candidateId,imported.observationId,'test',options),/snapshot census/);fs.unlinkSync(path.join(dir,'shadow.h'));});
  if(process.platform==='win32')check('differently cased root terminates',()=>{const alternate=ROOT.toUpperCase()+source.slice(ROOT.length);const result=research.importResearch(workbench,target,alternate,observation,options);assert.equal(result.candidateId,imported.candidateId);});
  check('no compile rows or compiler invocation',()=>{const after=query({action:'query',name:'status',args:{modelId:workbench.modelId}});assert.equal(after.compilations,before.compilations);assert.equal(codegen,0);});
 } finally {cp.spawnSync=spawn;if(preserved)for(const field of ['source','dossier','observation']){const file=path.resolve(ROOT,preserved[field]);assert(file.startsWith(path.join(ROOT,'docs')+path.sep));fs.unlinkSync(file);}}
 const result={checks,codegen,seconds:(Date.now()-started)/1000,root};fs.writeFileSync(path.join(root,'results.json'),JSON.stringify(result,null,2));return result;
}
if(require.main===module)console.log(JSON.stringify(run(),null,2));module.exports={run};
