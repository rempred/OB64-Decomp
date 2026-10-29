'use strict';
const assert = require('assert/strict');
const fs = require('fs'), path = require('path'), vm = require('vm');
const inputSet = require('../tools/lib/matching/input_set');
const { ROOT } = require('../tools/lib/phase7_conventional');
const { validatePrivateOptions } = require('../tools/match');
const output = fs.mkdtempSync(path.join(ROOT, 'build/tests/input-set-'));

function fixture(root, destination, copies, references = []) {
  fs.mkdirSync(destination, {recursive:true});
  const files = [], directories = [];
  function visit(file, storage) {
    const relative = path.relative(root, file).replace(/\\/g, '/');
    const logical = relative && !relative.startsWith('..') && !path.isAbsolute(relative) ? relative : null;
    const stat = fs.lstatSync(file);
    if (stat.isDirectory()) {
      const members = fs.readdirSync(file).sort();
      directories.push({...(logical?{logical}:{}),storage,...(storage==='reference'?{path:file}:{}),members});
      if(storage==='copy')fs.mkdirSync(path.join(destination,'data',logical),{recursive:true});
      for(const name of members)visit(path.join(file,name),storage);
    } else {
      if(files.some(record=>(record.logical?path.resolve(root,record.logical):record.path)===file))return;
      files.push({...(logical?{logical}:{}),storage,...(storage==='reference'?{path:file}:{}),...inputSet.identity(file)});
      if(storage==='copy'){const target=path.join(destination,'data',logical);fs.mkdirSync(path.dirname(target),{recursive:true});fs.copyFileSync(file,target);}
    }
  }
  for(const file of copies)visit(path.resolve(root,file),'copy');
  for(const file of references)visit(path.resolve(root,file),'reference');
  const manifest={schemaVersion:1,kind:'ob64-private-inputs',repository:root,accepted:{fingerprint:'F'.repeat(64)},files,directories};
  const file=path.join(destination,'manifest.json');fs.writeFileSync(file,JSON.stringify(manifest));
  return {file,manifest,destination};
}

const root=path.join(output,'repository');fs.mkdirSync(path.join(root,'include'),{recursive:true});
fs.mkdirSync(path.join(root,'src'));fs.writeFileSync(path.join(root,'include/a.h'),'#define X 1\n');
fs.writeFileSync(path.join(root,'src/a.c'),'int a(void){return 1;}\n');fs.writeFileSync(path.join(root,'pin'),'pinned');
const f=fixture(root,path.join(output,'set'),['include','src'],['pin']);
const inputs=inputSet.openInputSet(f.file,{root});
const bound = inputSet.bind({}, inputs);
inputSet.assertContext(bound, inputs);
inputSet.assertContext({}, undefined);
for (const [value, selected] of [[{}, inputs], [bound, undefined], [bound, {}]])
  assert.throws(() => inputSet.assertContext(value, selected), error => error.code === 'OB64_SELECTED_INPUT');
const source=path.join(root,'src/a.c'),saved=fs.readFileSync(inputs.resolve(source));
fs.writeFileSync(source,'unrelated live edit');fs.writeFileSync(path.join(root,'include/new.h'),'live header');
assert.deepEqual(fs.readFileSync(inputs.resolve(source)),saved);
assert.deepEqual(fs.readdirSync(inputs.resolve(path.join(root,'include'))),['a.h']);
inputs.assertUnchanged();
assert.throws(()=>inputs.resolve(path.join(root,'missing')),/unenrolled/);
assert.throws(()=>inputs.research(path.join(root,'missing')),/research reference unavailable/);
assert.throws(()=>inputs.authenticate({}),/selected inputs:/,'a manifest alone is never accepted proof');
assert.throws(()=>{inputs.manifest.accepted.fingerprint='A'.repeat(64);},TypeError);
const header=path.join(f.destination,'data/include/a.h'),headerBytes=fs.readFileSync(header),headerStat=fs.statSync(header);
fs.writeFileSync(header,'#define X 2\n');fs.utimesSync(header,headerStat.atime,headerStat.mtime);
assert.throws(()=>inputs.resolve(path.join(root,'include/a.h')),/content drift/);fs.writeFileSync(header,headerBytes);
fs.renameSync(header,header+'.saved');assert.throws(()=>inputs.resolve(path.join(root,'include/a.h')),/missing path/);fs.renameSync(header+'.saved',header);
fs.writeFileSync(path.join(f.destination,'data/include/new.h'),'shadow');assert.throws(()=>inputs.assertUnchanged(),/membership drift/);fs.unlinkSync(path.join(f.destination,'data/include/new.h'));
fs.writeFileSync(path.join(root,'pin'),'drift!');assert.throws(()=>inputs.assertUnchanged(),/content drift/);fs.writeFileSync(path.join(root,'pin'),'pinned');
const identical=fixture(root,path.join(output,'second-set'),['include','src'],['pin']);
assert.notEqual(inputs.id,inputSet.openInputSet(identical.file,{root}).id);
for(const change of [m=>m.files.push({...m.files[0]}),m=>m.files[0].logical='../escape',m=>m.files[0].sha256='x',m=>m.directories[0].members.push('a.h'),m=>m.repository+='wrong',m=>m.extra=true]){
 const value=structuredClone(f.manifest);change(value);fs.writeFileSync(f.file,JSON.stringify(value));assert.throws(()=>inputSet.openInputSet(f.file,{root}),/selected inputs:/);
}
fs.writeFileSync(f.file,JSON.stringify(f.manifest));
const alias=path.join(output,'hardlink');fs.linkSync(header,alias);assert.throws(()=>inputs.assertUnchanged(),/multiply linked/);fs.unlinkSync(alias);
assert.throws(()=>inputSet.openInputSet(f.file,{root,privateRoot:f.destination}),/overlaps selected data/);
assert.throws(()=>inputSet.captureInputSet(output),/already exists/);
assert.throws(()=>inputSet.openInputSet(path.join(output,'interrupted-manifest.json'),{root}),/missing path/);
const include=path.dirname(header),realInclude=include+'-real';fs.renameSync(include,realInclude);
try{fs.symlinkSync(realInclude,include,'junction');assert.throws(()=>inputs.assertUnchanged(),/redirected/);fs.unlinkSync(include);}
finally{if(!fs.existsSync(include))fs.renameSync(realInclude,include);}
for(const command of ['best','history','preserve','compare','classify','capture-inputs'])assert.throws(()=>validatePrivateOptions(command,{inputs:f.file,'scratch-root':'build/private'}),/--inputs/);
for(const extra of [{candidate:'x'},{'research-compiler':'x'},{'source-origin':'x'},{runtime:true}])assert.throws(()=>validatePrivateOptions('probe',{inputs:f.file,'scratch-root':'build/private',source:'candidate.c',...extra}),/--inputs/);
for(const command of ['intake','watch','probe'])validatePrivateOptions(command,{inputs:f.file,'scratch-root':'build/private',...(command==='intake'?{}:{source:'candidate.c'})});

// Exercise the real companion routing boundary with a spy at the existing
// validator. Its actual source/proof adversarial semantics have their own suite.
// This fixture cannot establish retail acceptance.
{
 const proofRoot=path.join(output,'proof-repository'),live=path.join(proofRoot,'build/current'),acceptedOutput=path.join(proofRoot,'accepted');
 fs.mkdirSync(live,{recursive:true});fs.mkdirSync(acceptedOutput);
 const rom=Buffer.from([1,2,3,4]),build={fixture:'build'},fresh={fixture:'fresh'},verified={fixture:'verified'};
 for(const [name,value]of [['fresh.json',fresh],['verified.json',verified]])fs.writeFileSync(path.join(live,name),JSON.stringify(value));
 fs.writeFileSync(path.join(acceptedOutput,'build-report.json'),JSON.stringify(build));fs.writeFileSync(path.join(acceptedOutput,'phase8.us_rev0.z64'),rom);
 const accepted={fingerprint:'F'.repeat(64),baselineFingerprint:'B'.repeat(64),output:acceptedOutput,buildReport:inputSet.identity(path.join(acceptedOutput,'build-report.json')),
   verificationSha256:inputSet.identity(path.join(live,'verified.json')).sha256,freshCompilationSha256:inputSet.identity(path.join(live,'fresh.json')).sha256};
 const state={schemaVersion:6,verifiedAt:'fixture',...accepted,verificationReport:path.join(live,'verified.json'),freshCompilationReport:path.join(live,'fresh.json')};
 fs.writeFileSync(path.join(live,'state.json'),JSON.stringify(state));
 const fixtureData=fixture(proofRoot,path.join(output,'proof-set'),['build/current'],['accepted']);fixtureData.manifest.accepted=accepted;fs.writeFileSync(fixtureData.file,JSON.stringify(fixtureData.manifest));
 let checks=0,implementationDrift=false;
 const module={exports:{}};
 vm.runInNewContext(fs.readFileSync(require.resolve('../tools/lib/matching/input_set'),'utf8'),{module,Buffer,__dirname:path.join(ROOT,'tools/lib/matching'),
  require:name=>name==='../current_workflow'?{validateVerifiedCompanions(b,f,v,out){checks++;assert.equal(JSON.stringify(b),JSON.stringify(build));assert.equal(JSON.stringify(f),JSON.stringify(fresh));assert.equal(JSON.stringify(v),JSON.stringify(verified));assert.equal(out,acceptedOutput);if(implementationDrift)throw Error('implementation drift');}}:require(name)});
 const api=module.exports,selected=api.openInputSet(fixtureData.file,{root:proofRoot});
 const model=api.bind({model:{config:{rom:{bytes:rom.length,sha256:inputSet.digest(rom)}}}},selected);
 for(const name of ['state.json','fresh.json','verified.json'])fs.writeFileSync(path.join(live,name),'unreadable live pointer');
 selected.authenticate(model);assert.equal(checks,1);
 implementationDrift=true;assert.throws(()=>selected.authenticate(model),/implementation drift/);implementationDrift=false;
 const copiedFresh=path.join(fixtureData.destination,'data/build/current/fresh.json');fs.renameSync(copiedFresh,copiedFresh+'.missing');assert.throws(()=>selected.authenticate(model),/missing path/);fs.renameSync(copiedFresh+'.missing',copiedFresh);
 const wrong=api.bind({model:{config:{rom:{bytes:rom.length,sha256:'0'.repeat(64)}}}},selected);assert.throws(()=>selected.authenticate(wrong),/full-ROM identity drift/);
 assert.throws(()=>selected.authenticate({model:model.model}),/different input set/);
}

// Research readers select copied lesson/dossier bytes and propagate enrolled drift.
{
 const live=path.join(output,'research-live');fs.mkdirSync(live);
 const rel=file=>path.relative(ROOT,file).replace(/\\/g,'/');
 const note=path.join(live,'note.md'),index=path.join(live,'index.json'),metadata=path.join(live,'example.observation.json');
 fs.writeFileSync(note,'# Selected note\nCaptured research.\n');
 fs.writeFileSync(metadata,JSON.stringify({symbol:'fixture',value:'captured'}));
 fs.writeFileSync(index,JSON.stringify({schemaVersion:1,lessons:[{id:'selected',symptoms:['register-allocation'],applicability:'Fixture.',note:rel(note)+'#selected-note',references:[],observations:[]}]}));
 const captured=fixture(ROOT,path.join(output,'research-set'),[live]),selected=inputSet.openInputSet(captured.file);
 const knowledge=require('../tools/lib/matching/knowledge');
 fs.writeFileSync(index,'unrelated integration');fs.writeFileSync(note,'unrelated integration');fs.writeFileSync(metadata,'unrelated integration');
 assert.equal(knowledge.loadLessons(index,selected).status,'available');
 assert.equal(knowledge.catalog(live,selected).records[0].envelope.value,'captured');
 const stored=selected.resolve(note),bytes=fs.readFileSync(stored);fs.writeFileSync(stored,'changed');
 assert.throws(()=>knowledge.loadLessons(index,selected),error=>error.code==='OB64_SELECTED_INPUT');fs.writeFileSync(stored,bytes);
 assert.equal(knowledge.catalog(path.join(live,'uncaptured'),selected).diagnostics[0].validity,'unavailable');
 selected.assertUnchanged();
}

let equivalentTargets;
if(process.argv.includes('--model')){
 const config=JSON.parse(fs.readFileSync(path.join(ROOT,'config/phase7/conventional-build.json')));
 const refs=[...Object.keys(config.acceptedInputSha256).filter(p=>!p.startsWith('config/')),'asm/original/rev0','tools/lib','build/baserom.us_rev0.z64'];
 const active=JSON.parse(fs.readFileSync(path.join(ROOT,'config/matching-c-targets.json')));
 const groups=JSON.parse(fs.readFileSync(path.join(ROOT,'config/matching-c-compilation-groups.json')));
 const extraSources=[...new Set(active.targets.map(t=>t.source||groups.groups.find(g=>g.id===t.compilationGroup)?.source).filter(p=>p&&!p.startsWith('src/')).map(p=>path.dirname(p)))];
 const modelFixture=fixture(ROOT,path.join(output,'model-set'),['config','src','include',...extraSources],refs);
 const selected=inputSet.openInputSet(modelFixture.file);
 const methods=['readFileSync','statSync','existsSync','lstatSync','readdirSync'],original=Object.fromEntries(methods.map(name=>[name,fs[name]]));
 let denied=0;
 try{
  for(const name of methods)fs[name]=function(file,...args){if(typeof file==='string'&&['config','src','include',...extraSources].some(dir=>path.resolve(file).toLowerCase().startsWith(path.join(ROOT,dir).toLowerCase()+path.sep))){denied++;throw new Error('live mutable input read: '+file);}return original[name].call(fs,file,...args);};
  const model=require('../tools/lib/active_targets').loadActiveTargetModel({inputs:selected});
  assert.equal(model.targets.length,1198);assert.equal(denied,0);
 }finally{for(const name of methods)fs[name]=original[name];}
 selected.assertUnchanged();
 // Synthetic fixture has no accepted companions: bypass only that absent proof,
 // while exercising actual raw model/target/candidate identity algorithms.
 const tm=require('../tools/lib/matching/target_model'),compiler=require('../tools/lib/matching/compiler');
 const first=tm.loadWorkbenchModel({inputs:{...selected,id:'A'.repeat(64),authenticate(){}}});
 const second=tm.loadWorkbenchModel({inputs:{...selected,id:'B'.repeat(64),authenticate(){}}});
 const targets=[tm.resolveTarget(first,'func_0026CD1C'),tm.resolveTarget(second,'func_0026CD1C')];
 assert.equal(first.modelId,second.modelId);assert.equal(targets[0].targetId,targets[1].targetId);
 const candidates=targets.map(target=>compiler.candidateRecord(target,'int fixture(void){return 1;}'));
 for(const field of ['candidateId','observationId','targetId','sourceSha256'])assert.equal(candidates[0][field],candidates[1][field]);
 equivalentTargets=targets;
}
if(process.argv.includes('--cpp')){
 const policy=require('../tools/lib/source_policy'),config=policy.loadPolicyConfig();
 const reference=path.join(output,'reference.txt');fs.writeFileSync(reference,'captured report reference');
 const referencePath=path.relative(ROOT,reference).replace(/\\/g,'/'),referenceHash=inputSet.identity(reference).sha256;
 const cpp=fixture(ROOT,path.join(output,'cpp-set'),['config/source-policy.json','include',reference],
  [config.matchingCompiler.manifest,config.preprocessor.path,...config.preprocessor.requiredExecutables.map(item=>item.path)]);
 const privateRoot=path.join(output,'private');fs.mkdirSync(privateRoot);
 fs.mkdirSync(path.join(privateRoot,'sources'));
 const source=path.join(privateRoot,'sources/candidate.c'),snapshot=path.join(privateRoot,'sources/snapshot.c');
 fs.writeFileSync(source,'#include "common/types.h"\ns32 fixture(s32 value) { return value + 1; }\n');fs.copyFileSync(source,snapshot);
 const selected=inputSet.openInputSet(cpp.file,{privateRoot});
 const preprocessor=policy.resolvePreprocessor(undefined,selected);
 const a=policy.classifySource(source,{preprocessor}),b=policy.classifySource(snapshot,{preprocessor});
 assert.equal(a.class,'PURE_C');assert.equal(b.class,'PURE_C');
 assert.deepEqual(policy.compilationInputBytes(a),policy.compilationInputBytes(b));
 assert(a.dependencies.every(dep=>dep.path.startsWith('include/')));
 const authored={references:[{path:referencePath,sha256:referenceHash}],expected:{sourceSha256:a.sourceSha256,expandedSha256:a.compilationInput.sha256,dependencies:a.dependencies}};
 const authenticated={sourceSha256:a.sourceSha256,expanded:a.compilationInput,dependencies:a.dependencies,sourceClass:a.class,preprocessor:a.preprocessor};
 fs.writeFileSync(reference,'unrelated live report');
 const research=require('../tools/lib/matching/research');research.authenticateEvidence(a,authored,authenticated);
 const copiedReference=selected.resolve(reference),referenceBytes=fs.readFileSync(copiedReference);fs.writeFileSync(copiedReference,'changed');
 assert.throws(()=>research.authenticateEvidence(a,authored,authenticated),error=>error.code==='OB64_SELECTED_INPUT');fs.writeFileSync(copiedReference,referenceBytes);
 policy.verifyClassificationInputs(a);require('../tools/lib/matching/private_inputs').assertPrivateClassification(a);
 const cacheOptions={inputs:selected,cacheRoot:path.join(privateRoot,'cache')};
 let cache=require('../tools/lib/diff_preprocess_cache').createDiffPreprocessCache(cacheOptions);
 const cold=policy.classifySource(source,{preprocessor,preprocess:cache.preprocess});cache.finish();
 cache=require('../tools/lib/diff_preprocess_cache').createDiffPreprocessCache(cacheOptions);
 const warm=policy.classifySource(source,{preprocessor,preprocess:cache.preprocess});cache.finish();
 assert.deepEqual(policy.compilationInputBytes(cold),policy.compilationInputBytes(warm));assert.equal(cache.stats.hits,1);
 const second=fixture(ROOT,path.join(output,'cpp-second'),['config/source-policy.json','include',reference],
  [config.matchingCompiler.manifest,config.preprocessor.path,...config.preprocessor.requiredExecutables.map(item=>item.path)]);
 const secondInputs=inputSet.openInputSet(second.file,{privateRoot});
 cache=require('../tools/lib/diff_preprocess_cache').createDiffPreprocessCache({...cacheOptions,inputs:secondInputs});
 const refreshed=policy.classifySource(source,{preprocessor:policy.resolvePreprocessor(undefined,secondInputs),preprocess:cache.preprocess});cache.finish();
 assert.equal(refreshed.class,'PURE_C');assert.equal(cache.stats.hits,0,'another physical set cannot reuse preprocessing entries');
 const locationSource='const char *fixture(void) { return __FILE__; }\n';fs.writeFileSync(source,locationSource);fs.writeFileSync(snapshot,locationSource);
 const locatedA=policy.classifySource(source,{preprocessor}),locatedB=policy.classifySource(snapshot,{preprocessor});
 assert.notDeepEqual(policy.compilationInputBytes(locatedA),policy.compilationInputBytes(locatedB),'location-sensitive expansion must not be relabeled equal');
 fs.writeFileSync(source,'#include "common/types.h"\ns32 fixture(s32 value) { return value + 1; }\n');
 // Captured header substitution must abort, never turn into an UNKNOWN/cache hit.
 const header=selected.resolve(path.join(ROOT,a.dependencies[0].path)),bytes=fs.readFileSync(header);
 fs.writeFileSync(header,Buffer.alloc(bytes.length,32));assert.throws(()=>policy.classifySource(source,{preprocessor}),/selected inputs:/);fs.writeFileSync(header,bytes);
 selected.assertUnchanged();
}
// Raw research candidates and parent/related intake survive physical-set refresh.
if(equivalentTargets && process.argv.includes('--cpp')) {
 const policy=require('../tools/lib/source_policy'),research=require('../tools/lib/matching/research'),compiler=require('../tools/lib/matching/compiler');
 const live=path.join(output,'history-live'),archive=path.join(live,'archive');fs.mkdirSync(archive,{recursive:true});
 const reference=path.join(live,'reference.txt');fs.writeFileSync(reference,'history reference');
 const rel=file=>path.relative(ROOT,file).replace(/\\/g,'/'),ids=[];
 for(const [index,value]of [7,8].entries()){
  const file=path.join(live,'source'+index+'.c'),source='int fixture(void) { return '+value+'; }\n';fs.writeFileSync(file,source);
  const classification=policy.classifySource(file),candidate=compiler.candidateRecord(equivalentTargets[0],source);ids.push(candidate.candidateId);
  const authored={schemaVersion:1,label:'fixture-'+index,role:'effect-example',context:'Raw identity refresh fixture.',sourceChange:'Change returned value.',effects:['generic'],observedEffect:'Authored diagnostic observation.',remainingFailure:'No retail acceptance.',selectedBest:false,parentCandidateId:index?ids[0]:null,relatedCandidateIds:index?[ids[0]]:[],references:[{path:rel(reference),sha256:inputSet.identity(reference).sha256}],expected:{sourceSha256:classification.sourceSha256,expandedSha256:classification.compilationInput.sha256,dependencies:classification.dependencies}};
  research.validateObservation(authored);
  fs.writeFileSync(path.join(archive,equivalentTargets[0].symbol+'-'+index+'.observation.json'),JSON.stringify({schemaVersion:1,symbol:equivalentTargets[0].symbol,candidateId:candidate.candidateId,observationId:candidate.observationId,source:rel(file),authored,authenticated:{sourceSha256:classification.sourceSha256,expanded:classification.compilationInput,dependencies:classification.dependencies,sourceClass:classification.class,preprocessor:classification.preprocessor}}));
 }
 const config=policy.loadPolicyConfig(),python=require('../tools/lib/local_tools').resolveLocalTools({readOnly:true}).splatPython;
 for(const [index,target]of equivalentTargets.entries()){
  const captured=fixture(ROOT,path.join(output,'history-set-'+index),['config/source-policy.json','include',live],[config.matchingCompiler.manifest,config.preprocessor.path,...config.preprocessor.requiredExecutables.map(item=>item.path),python]);
  captured.manifest.runtime={splatPython:python};fs.writeFileSync(captured.file,JSON.stringify(captured.manifest));const selected=inputSet.openInputSet(captured.file);
  const workbench={targets:[target],bySymbol:new Map([[target.symbol.toLowerCase(),target]]),activeTargetsBySymbol:new Map()};
  const report=require('../tools/lib/matching/intake').intake(workbench,{...target,activeMatchingSource:null,activeMatchingProducer:null},{inputs:selected,archiveDirectory:archive,database:path.join(output,'absent.sqlite')});
  assert.equal(report.counts.valid,2);const child=report.observations.find(item=>item.candidateId===ids[1]);assert.equal(child.parentCandidateId,ids[0]);assert.deepEqual(child.relatedCandidateIds,[ids[0]]);assert.equal(child.relations.status,'verified');
 }
}
console.log(JSON.stringify({status:'pass',output,model:process.argv.includes('--model'),cpp:process.argv.includes('--cpp'),companionRouting:true,retailAcceptance:false,controls:['copied data independence','directory membership','same-size/mtime replacement','reference drift','cross-set identity','malformed/duplicate/escaping manifest','hardlink/junction rejection','unsupported branches','no manifest-only acceptance','copied companion routing and mandatory validation']},null,2));

