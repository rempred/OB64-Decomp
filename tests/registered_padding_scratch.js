'use strict';
// Synthetic compiler plumbing fixture, not a retail match or acceptance proof.
const assert=require('assert'),fs=require('fs'),path=require('path'),crypto=require('crypto');
const p7=require('../tools/lib/phase7_conventional'),p8=require('../tools/lib/phase8_matching_c');
const tm=require('../tools/lib/matching/target_model'),compiler=require('../tools/lib/matching/compiler');
const {classifySource}=require('../tools/lib/source_policy');
function main(){
 const phase8=p8.loadPhase8Model(),wb=tm.loadWorkbenchModel(),target=tm.resolveTarget(wb,'func_000065E4');
 const session=compiler.prepareCompilerSession({context:{phase8,localTools:JSON.parse(fs.readFileSync(path.join(p7.ROOT,'config/local-tools.json'),'utf8'))}});
 const matchingRoot=fs.mkdtempSync(path.join(p7.ROOT,'build/ep-')),runId=crypto.randomBytes(32).toString('hex').toUpperCase(),artifactDir=path.join(matchingRoot,'runs',runId);
 fs.mkdirSync(artifactDir,{recursive:true});const sourceFile=path.join(matchingRoot,'unit.c');
 fs.writeFileSync(sourceFile,'static int func_00006724(int);\nstatic int func_00006830(int);\nint func_000065E4(int x){return func_00006724(x)+func_00006830(x);}\nstatic int func_00006724(int x){if(x>1)return func_00006724(x-1)+2;return x;}\nstatic int func_00006830(int x){if(x>1)return func_00006830(x-1)*3;return x;}\n');
 const rel=p=>path.relative(p7.ROOT,p).replace(/\\/g,'/');
 const classification=classifySource(rel(sourceFile),{preprocessor:session.preprocessor});assert.equal(classification.class,'PURE_C');
 const result=compiler.compileScratchCandidate({session,target,sourceFile,artifactDir,classification});
 assert.deepEqual(result.scratchContract.logicalFunctions.map(fn=>fn.binding),['GLOBAL','LOCAL','LOCAL']);
 const candidate={candidateId:'synthetic-binding-fixture'},tool={...session.tool,candidateSourcePolicy:classification};
 const run={run_id:runId,cache_key:runId,artifact_dir:rel(artifactDir),object_text:result.objectText.toString('base64'),relocations:result.relocations,tool};
 const report={schemaVersion:3,target:{targetId:target.targetId,comparisonScope:tm.executablePrefixComparisonScope(target),originalOwnerComparison:tm.originalOwnerComparison(target)},candidate,sourcePolicy:classification,compile:{runId,cacheKey:runId,candidateId:candidate.candidateId,status:'compiled',objectText:run.object_text,relocations:run.relocations,tool},scratchContract:result.scratchContract};
 const file=path.join(artifactDir,'workbench-report.json'),save=()=>fs.writeFileSync(file,JSON.stringify(report));save();
 const warm=()=>compiler.cachedCandidateArtifact(run,candidate,target,matchingRoot,wb);warm();
 report.scratchContract.logicalFunctions[1].binding='GLOBAL';save();assert.throws(warm,/binding evidence drift/);
 delete report.scratchContract.logicalFunctions[1].binding;save();assert.throws(warm,/binding evidence drift/);
 report.scratchContract.logicalFunctions[1].binding='LOCAL';save();warm();
 const forged=JSON.parse(JSON.stringify(target));forged.logicalFunctions[1].binding='GLOBAL';
 assert.throws(()=>compiler.cachedCandidateArtifact(run,candidate,forged,matchingRoot,wb));
 const evidence={status:'pass',controls:6,sourceClass:classification.class,bindings:result.scratchContract.logicalFunctions,objectSha256:result.scratchContract.artifacts.objectSha256,artifactDir:rel(artifactDir),acceptance:false};
 fs.writeFileSync(path.join(matchingRoot,'fixture-result.json'),JSON.stringify(evidence,null,2)+'\n');console.log(JSON.stringify(evidence));return evidence;
}
if(require.main===module)main();module.exports={main};
