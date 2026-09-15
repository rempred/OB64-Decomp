'use strict';
const assert=require('assert'),fs=require('fs'),path=require('path');
const {loadWorkbenchModel,resolveTarget}=require('../tools/lib/matching/target_model');
const {prepareCompilerSession,compileCandidate,compileScratchCandidate,cachedCandidateArtifact}=require('../tools/lib/matching/compiler');
const {runM2c}=require('../tools/lib/matching/m2c');
const workbench=loadWorkbenchModel();
const root=fs.mkdtempSync(path.resolve('build/logical-functions-native-'));
const storeOptions={database:path.join(root,'store.sqlite')};
const session=prepareCompilerSession();
const target=resolveTarget(workbench,'func_000488CC');
const results=[];
for(const [name,source] of [
 ['missing',`int ${target.symbol}(int a){return a;}`],
 ['extra',`int ${target.symbol}(int a){return a;} int func_0004890C(int a){return a+1;} int extra(int a){return a+2;}`],
 ['reordered',`int func_0004890C(int a){return a+1;} int ${target.symbol}(int a){return a;}`],
]) {
 const result=compileCandidate(workbench,target,source,{matchingRoot:root,storeOptions,session,variant:name});
 assert.equal(result.compile.status,'failed');assert.match(result.compile.stderr,/census|reordered/);
 results.push({name,status:result.compile.status,error:result.compile.stderr});
}
const helper=resolveTarget(workbench,'func_0000780C');
const generated=runM2c(workbench,helper,{matchingRoot:root,storeOptions,generateContext:false,variants:workbench.config.m2c.variants.filter(v=>v.name==='structured')});
assert(generated.results[0].ok);
const result=compileCandidate(workbench,helper,generated.results[0].source,{matchingRoot:root,storeOptions,session,variant:'helper'});
assert.equal(result.compile.status,'compiled');
const reused=compileCandidate(workbench,helper,generated.results[0].source,{matchingRoot:root,storeOptions,session,variant:'helper'});
assert(reused.cached);
const scratchFile=path.join(root,'padding.c');
// An explicit assembly alignment fixture exercises compiler-emitted terminal
// padding. It is HYBRID_C research input and cannot establish matching C.
fs.writeFileSync(scratchFile,`int ${helper.symbol}(int a){ return a+1; }\nasm(".align 4");\n`);
const paddingClass=require('../tools/lib/source_policy').classifySource(scratchFile).class;
assert.equal(paddingClass,'HYBRID_C');
const artifactDir=path.join(root,'padding');fs.mkdirSync(artifactDir);
const padding=compileScratchCandidate({session,target:helper,sourceFile:scratchFile,artifactDir});
assert.equal(padding.objectText.length,padding.scratchContract.fullOwner.bytes);
assert.equal(padding.scratchContract.textSection.comparedBytes,padding.objectText.length);
assert(padding.scratchContract.textSection.trailingAlignmentBytes > 0);
fs.writeFileSync(path.join(root,'results.json'),JSON.stringify({results,helper:result,paddingSourceClass:paddingClass,padding:padding.scratchContract},null,2));
console.log(JSON.stringify({status:'pass',root,negativeSources:results.length,helperCompiledBytes:Buffer.from(result.compile.object_text,'base64').length,
  cacheReused:reused.cached,paddingComparedBytes:padding.objectText.length,paddingBytes:padding.scratchContract.textSection.trailingAlignmentBytes}));

// Run the public consumers against the real isolated SQLite store. Only store
// routing is injected; command, comparison and preservation logic are unchanged.
async function publicHelperConsumers() {
  const store=require('../tools/lib/matching/store');
  const compiler=require('../tools/lib/matching/compiler');
  const originals={request:store.requestStore,initialize:store.initializeStore,sync:compiler.syncTargets};
  store.requestStore=(request,options={})=>originals.request(request,{...options,...storeOptions});
  store.initializeStore=()=>originals.initialize(storeOptions);
  compiler.syncTargets=(model,options,extra)=>originals.sync(model,storeOptions,extra);
  const output=[];const log=console.log;
  let preserved=null;
  try {
    const cli=require('../tools/match');
    console.log=(value)=>output.push(String(value));
    await cli.main(['classify',result.candidate.candidateId,'--json']);
    await cli.main(['compare',result.candidate.candidateId,result.candidate.candidateId,'--json']);
    preserved=cli.preserveCandidate(workbench,result.candidate.candidateId,'Isolated helper-consumer test; not matching acceptance.');
    assert(fs.readFileSync(path.resolve(preserved.source),'utf8')===generated.results[0].source);
    assert(fs.readFileSync(path.resolve(preserved.dossier),'utf8').includes(helper.symbol));
    const comparison=JSON.parse(output[1]);assert(comparison.comparison);
    fs.writeFileSync(path.join(root,'public-helper-consumers.json'),JSON.stringify({output:output.map(text=>JSON.parse(text)),preserved,
      retainedFixtureArtifacts:Object.values(preserved).map(file=>path.join(root,path.basename(file)))},null,2));
  } finally {
    console.log=log;store.requestStore=originals.request;store.initializeStore=originals.initialize;compiler.syncTargets=originals.sync;
    // Preserve the new fixture artifacts in its ignored evidence directory.
    // Existing archives are never opened for replacement or removed.
    if(preserved)for(const relative of Object.values(preserved)) {
      const file=path.resolve(relative);
      assert(file.startsWith(path.resolve('docs')+path.sep));
      fs.renameSync(file,path.join(root,path.basename(file)));
    }
  }
  console.log('Public helper classify, compare and preserve: PASS');
}
publicHelperConsumers().catch(error=>{console.error(error.stack);process.exitCode=1;});
