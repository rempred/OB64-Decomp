'use strict';
const assert = require('assert'), fs = require('fs'), path = require('path'), cp = require('child_process');
const { ROOT } = require('../tools/lib/phase7_conventional');
const { loadWorkbenchModel, resolveTarget, targetRecord, digest } = require('../tools/lib/matching/target_model');
const { candidateRecord } = require('../tools/lib/matching/compiler');
const { captureIdentities } = require('../tools/lib/matching/research');
const policy = require('../tools/lib/source_policy');
const { assess, intake, compactSummary, formatHuman } = require('../tools/lib/matching/intake');
const k = require('../tools/lib/matching/knowledge');
function run() {
  const base=path.join(ROOT,'build/knowledge-intake-tests');fs.mkdirSync(base,{recursive:true});
  const root=fs.mkdtempSync(path.join(base,'run-')),archive=path.join(root,'archive');fs.mkdirSync(archive);
  const rel=p=>path.relative(ROOT,p).replace(/\\/g,'/');
  let checks=0;const check=(name,fn)=>{fn();checks++;};
  const source=path.join(root,'donor.c'),header=path.join(root,'fixture.h');
  fs.writeFileSync(header,'typedef unsigned int fixture_u32;\n');
  fs.writeFileSync(source,'#include "fixture.h"\nfixture_u32 fixture(fixture_u32 v) { return v+1; }\n');
  const real=loadWorkbenchModel(),own=resolveTarget(real,'resource_arena_init');
  const donor={...own,symbol:'fixture_donor',logicalAliases:[],romStart:own.romStart+0x1000,romEndExclusive:own.romEndExclusive+0x1000,targetId:'fixture-donor',activeMatchingSource:null,activeMatchingProducer:null};
  const w={...real,targets:[own,donor],bySymbol:new Map([[own.symbol.toLowerCase(),own],['fixture_donor',donor]]),activeTargetsBySymbol:new Map()};
  const claims={schemaVersion:1,label:'useful-failed-candidate',role:'effect-example',context:'Fixture source and target context.',sourceChange:'Change one expression.',effects:['generic'],observedEffect:'Authored nonmatching observation.',remainingFailure:'Full target remains nonmatching.',selectedBest:false,parentCandidateId:null,relatedCandidateIds:[],references:[{path:'docs/KMC_GCC_MATCHING_NOTES.md'}]};
  // Reuse an allowed existing role; tests must respect the unchanged observation schema.
  claims.role='effect-example';
  const authored=captureIdentities(source,claims),classification=policy.classifySource(source);
  const envelope={schemaVersion:1,symbol:donor.symbol,candidateId:candidateRecord(donor,fs.readFileSync(source,'utf8')).candidateId,observationId:'A'.repeat(64),source:rel(source),authored,
    authenticated:{sourceSha256:classification.sourceSha256,expanded:classification.compilationInput,dependencies:classification.dependencies,sourceClass:classification.class,preprocessor:classification.preprocessor}};
  const metadata=path.join(archive,'fixture_donor-example.observation.json');fs.writeFileSync(metadata,JSON.stringify(envelope));
  const opts={crossLimit:3,archiveDirectory:archive},select=()=>k.selectKnowledge(w,own,opts,assess);
  const spawn=cp.spawnSync;let codegen=0;
  const compiler=JSON.parse(fs.readFileSync(path.join(ROOT,'config/local-tools.json'),'utf8')).compiler;
  cp.spawnSync=function(exe,...args){if(path.resolve(String(exe)).toLowerCase()===path.resolve(compiler).toLowerCase()){codegen++;throw Error('knowledge invoked KMC');}return spawn.call(this,exe,...args);};
  try {
    check('bounded explicit options',()=>{assert.deepEqual(k.validateOptions({crossLimit:0}),{crossLimit:0,symptom:undefined});assert.throws(()=>k.validateOptions({crossLimit:4}));assert.throws(()=>k.validateOptions({symptom:'made-up'}));assert.equal(k.selectKnowledge(w,own,{},assess).status,'disabled');});
    check('own-target donor authentication and measured failed-candidate fields retained',()=>{const r=select();assert.equal(r.siblings.length,1);assert.equal(r.siblings[0].observation.validity,'valid');assert.equal(r.siblings[0].observation.remainingFailure,claims.remainingFailure);assert.equal(r.siblings[0].applicability.status,'reference-only');assert.equal(assess(own,{envelope}).validity,'malformed');});
    check('changed donor source rejects',()=>{const original=fs.readFileSync(source);try{fs.appendFileSync(source,'\nint changed;\n');assert.equal(select().siblings[0].validity,'stale');}finally{fs.writeFileSync(source,original);}});
    check('historical selected-best precedes path order without skipping stale evidence',()=>{const file=path.join(archive,'fixture_donor-zz-best.observation.json'),best=structuredClone(envelope);best.authored.selectedBest=true;best.authored.role='emitted-best';best.authored.expected.sourceSha256='0'.repeat(64);fs.writeFileSync(file,JSON.stringify(best));try{const row=select().siblings[0];assert.equal(row.observation.metadata,rel(file));assert.equal(row.validity,'stale');assert.match(row.selection,/Historical selected-best/);}finally{fs.unlinkSync(file);}});
    check('changed donor include rejects',()=>{const original=fs.readFileSync(header);try{fs.writeFileSync(header,'typedef signed int fixture_u32;\n');assert.equal(select().siblings[0].validity,'stale');}finally{fs.writeFileSync(header,original);}});
    check('changed recorded preprocessor rejects',()=>{const bad=structuredClone(envelope);bad.authenticated.preprocessor.sha256='0'.repeat(64);fs.writeFileSync(metadata,JSON.stringify(bad));assert.equal(select().siblings[0].validity,'stale');fs.writeFileSync(metadata,JSON.stringify(envelope));});
    check('foreign target envelope cannot gain validity',()=>{const bad={...envelope,symbol:own.symbol};fs.writeFileSync(metadata,JSON.stringify(bad));const index=path.join(root,'foreign.json');fs.writeFileSync(index,JSON.stringify({schemaVersion:1,lessons:[{id:'foreign',symptoms:['register-allocation'],applicability:'Fixture.',note:'docs/KMC_GCC_MATCHING_NOTES.md#register-allocation-observations',references:[],observations:[{symbol:donor.symbol,path:rel(metadata)}]}]}));const r=k.selectKnowledge(w,own,{crossLimit:0,symptom:'register-allocation',indexPath:index},assess);assert.equal(r.lessons[0].observations[0].validity,'malformed');fs.writeFileSync(metadata,JSON.stringify(envelope));});
    check('malformed metadata remains visible',()=>{fs.writeFileSync(path.join(archive,'bad.observation.json'),'{');assert.equal(select().diagnostics[0].validity,'malformed');});
    check('active sources are examples even when pure',()=>{donor.activeMatchingSource=rel(source);const row=select().siblings[0];assert.equal(row.validity,'source-example');assert.equal(row.sourceClass,'PURE_C');assert.equal(row.acceptance,'not-assessed');donor.activeMatchingSource=null;});
    check('hybrid source example remains hybrid',()=>{const hybrid=path.join(root,'hybrid.c');fs.writeFileSync(hybrid,'int f(void) { asm("nop"); return 1; }\n');donor.activeMatchingSource=rel(hybrid);assert.equal(select().siblings[0].sourceClass,'HYBRID_C');donor.activeMatchingSource=null;});
    check('missing source remains unavailable',()=>{donor.activeMatchingSource=rel(path.join(root,'missing.c'));assert.equal(select().siblings[0].validity,'unavailable');donor.activeMatchingSource=null;});
    check('grouped receiver and donor stay reference only',()=>{donor.compilationGroup={id:'test'};const row=select().siblings[0];assert.match(row.applicability.reason,/complete group candidate/);assert.equal(row.observation.validity,'valid');delete donor.compilationGroup;const result=k.selectKnowledge(w,{...own,compilationGroup:{id:'test'}},opts,assess);assert.match(result.siblings[0].applicability.reason,/complete group candidate/);});
    check('alias and same physical interval never suggest self',()=>{const records=k.catalog(archive).records;const alias={...donor,symbol:'alias',logicalAliases:[own.symbol]};assert.equal(k.selectFamilyCandidates(own,[alias],records).length,0);assert.equal(k.selectFamilyCandidates(own,[{...donor,romStart:own.romStart,romEndExclusive:own.romEndExclusive}],records).length,0);});
    check('deterministic tier and tie ordering',()=>{const records=k.catalog(archive).records,other={...donor,symbol:'fixture_other',romStart:donor.romStart+100,activeMatchingSource:rel(source)};assert.deepEqual(k.selectFamilyCandidates(own,[other,donor],records).map(x=>x.target.symbol),[donor.symbol,other.symbol]);});
    check('different field offsets are structural leads, never exactness or transfer proof',()=>{const target={...own,expectedBytes:Buffer.from('8ca4000403e0000800000000','hex'),expectedBytesSha256:'fixture-target'},other={...donor,expectedBytes:Buffer.from('8ca4001403e0000800000000','hex'),expectedBytesSha256:'fixture-donor',activeMatchingSource:rel(source)};const rows=k.selectFamilyCandidates(target,[other]);assert.equal(rows.length,1);assert.equal(rows[0].tier,'structural');assert(!Object.hasOwn(rows[0],'validity'));assert(!Object.hasOwn(rows[0],'acceptance'));const result=k.selectKnowledge({...w,targets:[target,other]},target,opts,assess);assert.equal(result.siblings[0].acceptance,'not-assessed');assert.equal(result.siblings[0].applicability.status,'reference-only');assert.match(result.siblings[0].normalizationLimit,/offsets and constants/);});
    check('recorded preprocessing executable identity mismatch rejects',()=>{const bad=structuredClone(envelope);bad.authenticated.preprocessor.executables[0].sha256='0'.repeat(64);fs.writeFileSync(metadata,JSON.stringify(bad));assert.equal(select().siblings[0].validity,'stale');fs.writeFileSync(metadata,JSON.stringify(envelope));});
    check('current source failure stays visible in compact human view',()=>assert.match(formatHuman({symbol:'fixture',status:'unavailable',currentSource:{path:'missing.c',status:'unavailable',reason:'missing source fixture'},observations:[]}),/Current-source issue: missing source fixture/));
    check('no ROM has explicit reference limits and no family inference',()=>{const t={...own,expectedBytes:null,expectedBytesSha256:null};const r=k.selectKnowledge(w,t,opts,assess);assert.equal(r.siblings.length,0);assert(r.diagnostics.some(d=>d.validity==='reference-only'));assert.equal(assess({...donor,expectedBytesSha256:null},{envelope}).validity,'reference-only');});
    check('unknown symptoms and duplicate authored evidence rejected in index',()=>{const index=path.join(root,'index.json'),valid=JSON.parse(fs.readFileSync(k.INDEX,'utf8'));for(const mutate of [x=>x.lessons[0].symptoms=['bad'],x=>x.lessons[0].observedEffect='invented measurement',x=>x.lessons[0].evidenceLabel='REPRODUCED',x=>x.lessons.push(x.lessons[0]),x=>x.lessons[0].note+='-missing']){const value=structuredClone(valid);mutate(value);fs.writeFileSync(index,JSON.stringify(value));assert.equal(k.loadLessons(index).status,'unavailable');}});
    check('tracked index valid; symptom selection bounded',()=>{
      const index=k.loadLessons();assert.equal(index.status,'available');
      const r=k.selectKnowledge(w,own,{symptom:'stack-layout-or-offset-family'},assess);
      assert(r.lessons.length>0&&r.lessons.length<=3);
      assert(r.lessons.every(row=>row.symptoms.includes('stack-layout-or-offset-family')));
      // Catalog additions can legitimately change the first lesson and result count.
      // A fixed fixture checks filtering, ordering and the three-lesson budget.
      const fixture={schemaVersion:1,lessons:Array.from({length:5},(_,i)=>({
        ...structuredClone(index.lessons[0]),id:`fixture-stack-${i}`,observations:[],
        symptoms:[i===0?'register-allocation':'stack-layout-or-offset-family'],
      }))};
      const indexPath=path.join(root,'bounded-lessons.json');fs.writeFileSync(indexPath,JSON.stringify(fixture));
      const bounded=k.selectKnowledge(w,own,{symptom:'stack-layout-or-offset-family',indexPath},assess);
      assert.deepEqual(bounded.lessons.map(row=>row.id),['fixture-stack-1','fixture-stack-2','fixture-stack-3']);
      assert.equal(bounded.lessonsOmitted,1);
    });
    function assertCuratedReferences(index){
      assert.equal(index.status,'available');let count=0;
      for(const lesson of index.lessons)for(const ref of lesson.observations){
        const target=resolveTarget(real,ref.symbol),record={origin:'archive',metadataPath:ref.path,envelope:JSON.parse(fs.readFileSync(path.join(ROOT,ref.path),'utf8'))};
        // Historical IDs bind the model at observation time. Authenticate the
        // entire source/header/preprocessor/reference closure independently,
        // then preserve the CURRENT binding result rather than rewriting history.
        const closure=assess({...target,expectedBytes:null,expectedBytesSha256:null},record);
        assert.equal(closure.validity,'reference-only',`${lesson.id}: ${closure.reason||closure.validity}`);
        const current=assess(target,record);
        assert(['valid','target-mismatch'].includes(current.validity),`${lesson.id}: ${current.reason||current.validity}`);
        assert.equal(current.targetBinding,'exact');
        if(current.validity==='target-mismatch')assert.equal(current.reason,'candidate identity does not bind to current accepted target and exact source');
        count++;
      }
      return count;
    }
    check('curated closure authenticates; historical candidate IDs retain explicit CURRENT binding status',()=>{assert(assertCuratedReferences(k.loadLessons())>=1);});
    check('current curated-reference check rejects a wrong-target index entry',()=>{const index=structuredClone(k.loadLessons()),lesson=index.lessons.find(x=>x.observations.length);lesson.observations[0].symbol=own.symbol;assert.throws(()=>assertCuratedReferences(index),/malformed research envelope identity/);});
    check('genuine model drift stays target-mismatch in knowledge JSON and human output',()=>{
      const {expectedBytesSha256,...targetMetadata}=targetRecord(donor).metadata;
      const original={...donor,targetId:digest({modelId:donor.modelId,metadata:targetMetadata,expectedBytesSha256})};
      const historical={...envelope,candidateId:candidateRecord(original,fs.readFileSync(source,'utf8')).candidateId};
      const modelId=digest({previousModel:donor.modelId,fixture:'changed accepted model'});
      const drifted={...donor,modelId,targetId:digest({modelId,metadata:targetMetadata,expectedBytesSha256})};
      assert.notEqual(drifted.targetId,original.targetId);
      assert.equal(assess(original,{envelope:historical}).validity,'valid');
      assert.equal(assess(drifted,{envelope:historical}).validity,'target-mismatch');
      const historicalPath=path.join(root,'fixture_donor-model-drift.observation.json');fs.writeFileSync(historicalPath,JSON.stringify(historical));
      const indexPath=path.join(root,'model-drift-lessons.json');
      fs.writeFileSync(indexPath,JSON.stringify({schemaVersion:1,lessons:[{...k.loadLessons().lessons[0],id:'model-drift-fixture',
        symptoms:['register-allocation'],observations:[{symbol:donor.symbol,path:rel(historicalPath)}]}]}));
      const driftedWorkbench={...w,targets:[own,drifted],bySymbol:new Map([[own.symbol.toLowerCase(),own],[drifted.symbol.toLowerCase(),drifted]])};
      const knowledge=k.selectKnowledge(driftedWorkbench,own,{crossLimit:0,symptom:'register-allocation',indexPath},assess);
      assert.equal(JSON.parse(JSON.stringify(knowledge)).lessons[0].observations[0].validity,'target-mismatch');
      const human=formatHuman({symbol:own.symbol,status:'found',observations:[],knowledge});
      assert.match(human,/target-mismatch:.*fixture_donor-model-drift\.observation\.json/);
      assert.match(human,/candidate identity does not bind/);
    });
    check('changed candidate ID cannot become a current-valid historical observation',()=>{
      const altered=structuredClone(envelope);altered.candidateId='F'.repeat(64);
      assert.notEqual(altered.candidateId,envelope.candidateId);
      assert.equal(assess(donor,{envelope:altered}).validity,'target-mismatch');
    });
    check('compact selection assessed before explicit JSON limit',()=>{const rows=Array.from({length:9},(_,i)=>({source:`source${i}.c`,candidateId:String(i),label:String(i),validity:i===8?'stale':'valid',matchesCurrentSource:i===7,relatedCandidateIds:i===7?['8']:[],selectedBest:i===0}));const summary=compactSummary({symbol:'test',total:9},rows);assert.equal(summary.displayed,5);assert.equal(summary.omitted,4);assert.equal(summary.observations[0].label,'7');assert(summary.observations.some(r=>r.label==='8'));assert.match(formatHuman({symbol:'test',status:'found',total:9,counts:{valid:8,stale:1},presentation:summary,observations:rows.slice(0,1),truncated:true}),/stale=1/);});
    check('packet flags and full API rendering',()=>{const {parse,formatResult}=require('../tools/analysis_packet/cli');assert.equal(parse(['prepare','fixture','--cross-limit','0','--json']).options.intakeOptions.crossLimit,0);assert.throws(()=>parse(['prepare','fixture','--symptom','unknown']));const r={status:'partial',researchIntake:{symbol:'fixture',status:'found',observations:[{label:'complete'}]}};assert.deepEqual(JSON.parse(formatResult(r,{json:true})),r);assert.deepEqual(JSON.parse(formatResult(r,{'include-details':true})),r);assert.match(formatResult(r),/Research intake/);});
    assert.equal(codegen,0);
  } finally {cp.spawnSync=spawn;}
  const result={checks,codegen,root};fs.writeFileSync(path.join(root,'results.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result));return result;
}
if(require.main===module)run();module.exports={run};
