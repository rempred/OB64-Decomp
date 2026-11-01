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
  publicationChecks(workbench,root,check,query,options,source,observation);
  check('no compile rows or compiler invocation',()=>{const after=query({action:'query',name:'status',args:{modelId:workbench.modelId}});assert.equal(after.compilations,before.compilations);assert.equal(codegen,0);});
 } finally {cp.spawnSync=spawn;if(preserved)for(const field of ['source','dossier','observation']){const file=path.resolve(ROOT,preserved[field]);assert(file.startsWith(path.join(ROOT,'docs')+path.sep));fs.unlinkSync(file);}}
 const result={checks,codegen,seconds:(Date.now()-started)/1000,root};fs.writeFileSync(path.join(root,'results.json'),JSON.stringify(result,null,2));return result;
}
if(require.main===module)console.log(JSON.stringify(run(),null,2));module.exports={run};

// Use the same bounded VM/module substitution pattern as matching_private_routing.
// Real canonical loading is performed by the test opening above; the fixture reuses
// that model to inject deterministic opening/closing drift without touching inputs.
function publicationChecks(workbench,root,check,query,options,source,observation) {
 const vm=require('vm'),{createRequire}=require('module');
 const modelModule=require('../tools/lib/matching/target_model');
 const inputSet=require('../tools/lib/matching/input_set');
 const active=[...workbench.activeTargetsBySymbol.values()].find(value=>{
  if(!value.multiOwnerContract || value.compilationGroup || value.atomicText || value.auxiliarySections.length || value.auxiliaryProjection || value.nativeTextTail || value.retainedLiteralReferences)return false;
  const t=resolveTarget(workbench,value.symbol);
  return t.romStart===value.romStartNumber&&t.romEndExclusive===value.romEndNumber&&modelModule.scratchCapability(workbench,t).code==='physical-producer-required';
 });
 assert(active,'fixture needs an existing full-envelope active standalone multi-owner producer');
 const target=resolveTarget(workbench,active.symbol),clone=x=>JSON.parse(JSON.stringify(x));
 query({action:'upsert_targets',records:[targetRecord(target)]});
 const code=fs.readFileSync(path.join(ROOT,'tools/lib/matching/research.js'),'utf8');
 const realRequire=createRequire(path.join(ROOT,'tools/lib/matching/research.js'));
 function fixture({opening=workbench,closing,classification,diagnostic}={}) {
  let loads=0;const module={exports:{}};
  const requireMock=name=>name==='./target_model'?{...modelModule,loadWorkbenchModel:()=>{loads++;return loads===2&&closing?closing():opening;}}:
   name==='../source_policy'&&classification?{...policy,classifySource:classification}:
   name==='./input_set'&&diagnostic?{...inputSet,context:value=>value===diagnostic?'fixture-diagnostic':inputSet.context(value),isDiagnostic:value=>value==='fixture-diagnostic'||inputSet.isDiagnostic(value)}:realRequire(name);
  vm.runInNewContext(code,{module,require:requireMock,Buffer},{filename:'research.js'});
  return {api:module.exports,loads:()=>loads};
 }
 const f=fixture(),imported=f.api.importResearch(workbench,target,source,observation,options);
 check('bound historical source differs, no compilation, two resolutions',()=>{
  assert.notEqual(imported.sourceSha256,active.sourceSha256);assert.equal(imported.compiled,false);assert.equal(imported.acceptanceEligible,false);assert.equal(f.loads(),2);
 });
 check('bound idempotence and metadata round trip',()=>{
  assert.deepEqual(fixture().api.importResearch(workbench,target,source,observation,options),imported);
  const row=query({action:'query',name:'research_observations',args:{targetId:target.targetId,observationId:imported.observationId,limit:1}})[0];
  assert.equal(row.metadata.publicationProducer.sourceSha256,active.sourceSha256);assert.equal(row.metadata.publicationProducer.owners.length,active.textOwners.length);
 });
 const saved=[];
 try {
  const p=fixture().api.preserveResearch(workbench,imported.candidateId,imported.observationId,'Historical fixture.',options);saved.push(p);
  check('bound preservation and fresh archive re-import',()=>{
   const e=JSON.parse(fs.readFileSync(path.join(ROOT,p.observation)));assert.deepEqual(e.authored,observation);assert.equal(e.observationId,imported.observationId);assert.equal(e.publicationProducer,undefined);
   assert(fs.readFileSync(path.join(ROOT,p.source)).equals(fs.readFileSync(source)));
   const again=fixture().api.importResearch(workbench,target,path.join(ROOT,p.source),e.authored,options);assert.equal(again.candidateId,imported.candidateId);assert.notEqual(again.observationId,imported.observationId);
  });
  const childSource=path.join(root,'producer-child.c');fs.writeFileSync(childSource,fs.readFileSync(source,'utf8').replace('v + 7','v + 9'));
  const cc=policy.classifySource(childSource),child={...observation,label:'producer-child',parentCandidateId:imported.candidateId,relatedCandidateIds:[imported.candidateId],expected:{sourceSha256:cc.sourceSha256,expandedSha256:cc.compilationInput.sha256,dependencies:cc.dependencies}};
  const ci=fixture().api.importResearch(workbench,target,childSource,child,options);
  const childArchive=fixture().api.preserveResearch(workbench,ci.candidateId,ci.observationId,'Bound child.',options);saved.push(childArchive);
  check('bound same-target parent and child re-import',()=>{
   const again=fixture().api.importResearch(workbench,target,path.join(ROOT,childArchive.source),child,options);assert.equal(again.candidateId,ci.candidateId);
   const row=query({action:'query',name:'research_observations',args:{targetId:target.targetId,observationId:again.observationId,limit:1}})[0];assert.equal(row.parent_candidate_id,imported.candidateId);
  });
 } finally {for(const p of saved)for(const key of ['source','dossier','observation'])fs.unlinkSync(path.join(ROOT,p[key]));}
 for(const mutate of [t=>{t.romEndExclusive-=4;},t=>{t.expectedBytesSha256='0'.repeat(64);},t=>{t.targetId='0'.repeat(64);},t=>{t.logicalFragments=[...t.logicalFragments].reverse();},t=>{t.logicalFragments=clone(t.logicalFragments);t.logicalFragments[0].bytes-=4;}]) {
  check('bound selection/fragment drift rejects',()=>{const bad={...target};mutate(bad);assert.throws(()=>fixture().api.importResearch(workbench,bad,source,observation,options),/identity drift/);});
 }
 check('supplied producer owner forgery rejects',()=>{
  const bad={...workbench,activeTargetsBySymbol:new Map(workbench.activeTargetsBySymbol)};bad.activeTargetsBySymbol.set(active.symbol.toLowerCase(),{...active,textOwners:[...active.textOwners].reverse()});
  assert.throws(()=>fixture().api.importResearch(bad,target,source,observation,options),/supplied producer identity drift/);
 });
 check('diagnostic-bound target rejects',()=>assert.throws(()=>fixture({diagnostic:target}).api.importResearch(workbench,target,source,observation,options),/current production inputs/));
 check('buffered historical bytes must match classified hash',()=>{
  // Only emulate the read/classify race; the normal classification input verifier
  // sees an otherwise real authenticated record whose source hash is supplied here.
  const file=path.join(root,'other-bytes.c');fs.writeFileSync(file,fs.readFileSync(source,'utf8').replace('v + 7','v + 11'));
  const other=policy.classifySource(file),authored={...observation,expected:{sourceSha256:other.sourceSha256,expandedSha256:other.compilationInput.sha256,dependencies:other.dependencies}};
  assert.throws(()=>fixture({classification:()=>other}).api.importResearch(workbench,target,source,authored,options),/buffered source identity drift/);
 });
 const drift=()=>{const changed={...workbench,activeTargetsBySymbol:new Map(workbench.activeTargetsBySymbol)};changed.activeTargetsBySymbol.set(active.symbol.toLowerCase(),{...active,sourceSha256:'0'.repeat(64)});return changed;};
 check('closing import drift precedes insertion',()=>{
  let inserted=0;assert.throws(()=>fixture({closing:drift}).api.importResearch(workbench,target,source,observation,{...options,storeRequest:r=>{if(r.action==='put_candidate')inserted++;return query(r);}}),/producer.*drift|producer changed/);assert.equal(inserted,0);
 });
 check('closing preserve drift rolls staged source back',()=>{
  const expected=path.join(ROOT,`docs/archive/matching-c-candidates/${new Date().toISOString().slice(0,10)}-${target.symbol}-${imported.candidateId.slice(0,10).toLowerCase()}.c`);
  assert.throws(()=>fixture({closing:drift}).api.preserveResearch(workbench,imported.candidateId,imported.observationId,'Closing drift.',options),/producer.*drift|producer changed/);assert(!fs.existsSync(expected));
 });
 check('altered selected-observation binding rejects',()=>{
  const rows=query({action:'query',name:'research_observations',args:{targetId:target.targetId,observationId:imported.observationId,limit:1}}),metadata=clone(rows[0].metadata);metadata.publicationProducer.sourceSha256='0'.repeat(64);
  const bad=candidateRecord(target,fs.readFileSync(source,'utf8'),{origin:'research-import',variant:observation.label,metadata});query({action:'put_candidate',record:bad});
  assert.throws(()=>fixture().api.preserveResearch(workbench,bad.candidateId,bad.observationId,'Altered.',options),/stored producer binding drift/);
 });
 check('binding does not fall back after capability becomes supported',()=>{
  const absent={...workbench,activeTargetsBySymbol:new Map(workbench.activeTargetsBySymbol)};absent.activeTargetsBySymbol.delete(active.symbol.toLowerCase());
  // Opening is changed here; closing callback would be too late to prove dispatch.
  const changedCode=code;const module={exports:{}};
  vm.runInNewContext(changedCode,{module,Buffer,require:name=>name==='./target_model'?{...modelModule,loadWorkbenchModel:()=>absent}:realRequire(name)});
  assert.throws(()=>module.exports.preserveResearch(absent,imported.candidateId,imported.observationId,'Removed.',options),/current complete multi-owner producer/);
 });
 for(const mode of [{compilationGroup:{id:'unsupported'}},{atomicText:{}},{auxiliarySections:[{}]},{auxiliaryProjection:{}}]) {
  check('unsupported current producer mode rejects',()=>{
   const changed={...workbench,activeTargetsBySymbol:new Map(workbench.activeTargetsBySymbol)};changed.activeTargetsBySymbol.set(active.symbol.toLowerCase(),{...active,...mode});
   assert.throws(()=>fixture({opening:changed}).api.importResearch(workbench,target,source,observation,options),/current complete multi-owner producer|full standalone/);
  });
 }
 check('absent binding cannot retrospectively admit preserve',()=>{
  const rows=query({action:'query',name:'research_observations',args:{targetId:target.targetId,observationId:imported.observationId,limit:1}}),metadata=clone(rows[0].metadata);delete metadata.publicationProducer;
  const bad=candidateRecord(target,fs.readFileSync(source,'utf8'),{origin:'research-import',variant:observation.label,metadata});query({action:'put_candidate',record:bad});
  assert.throws(()=>fixture().api.preserveResearch(workbench,bad.candidateId,bad.observationId,'Unbound.',options),/physical producer/);
 });
 check('deferred source publication does not insert an observation',()=>{
  let inserted=0;
  const result=fixture().api.importResearch(workbench,target,source,observation,{...options,deferCompletion:true,storeRequest:r=>{if(r.action==='put_candidate')inserted++;return query(r);}});
  assert.equal(inserted,0);assert.equal(result.candidateId,imported.candidateId);
 });
 check('ordinary scratch recording and compile guards remain closed',()=>{
  assert.throws(()=>require('../tools/lib/matching/compiler').recordCandidate(workbench,target,'int x;',options),/physical producer/);
  assert.throws(()=>modelModule.assertScratchCapability(workbench,target),/physical producer/);
 });
}
