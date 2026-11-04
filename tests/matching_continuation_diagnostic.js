'use strict';
const assert=require('assert/strict'),fs=require('fs'),path=require('path'),crypto=require('crypto');
const diagnostic=require('../tools/lib/matching/diagnostic_context');
const targetModel=require('../tools/lib/matching/target_model');
const compiler=require('../tools/lib/matching/compiler');
const comparison=require('../tools/lib/matching/diagnostic_link');
const inputSet=require('../tools/lib/matching/input_set');
const policy=require('../tools/lib/source_policy');
const privateInputs=require('../tools/lib/matching/private_inputs');
const p7=require('../tools/lib/phase7_conventional');
const prior=require('./matching_multi_owner_diagnostic');
const ROOT=path.resolve(__dirname,'..'),hash=b=>crypto.createHash('sha256').update(b).digest('hex').toUpperCase();
const clone=x=>JSON.parse(JSON.stringify(x)),relative=f=>path.relative(ROOT,f).replace(/\\/g,'/');

function fixture(start=0x40ff4,sizes=[12,152]) {
  const stem='func_'+start.toString(16).padStart(8,'0'),symbol=stem.toUpperCase().replace('FUNC','func');
  const rom=Buffer.alloc(start+sizes[0]+sizes[1]);
  const sources=new Map();let at=start;
  const rows=sizes.map((bytes,i)=>{
    const name=stem+'_chunk'+(i+3)+(i?'tail':'head'),file='original/'+name+'.s';
    const source=Buffer.from('.text\n'+name+':\n'+Array.from({length:bytes/4},()=> '/* original */ .word 0x00000000').join('\n')+'\n');
    const row={index:80+i,romStart:at,romEndExclusive:at+bytes,bytes,inputKind:'tracked-assembly',ownerKind:'tracked-assembly-part',primaryClass:'code',ambiguous:false,
      part:{name,file,bytes,romStartNumber:at,romEndNumber:at+bytes,textBytes:source.length,sha256:hash(source)},
      slices:[{romStart:at,romEndExclusive:at+bytes,bytes,vramStart:0x80100000+at,vramEndExclusive:0x80100000+at+bytes,sectionName:'.owner'+i,executable:true,placementKind:'early-boot-linear',overlaySection:'text'}]};
    at+=bytes;sources.set(file,source);return row;
  });
  const env={rows,rom,logicalConfig:{bodies:[],padding:[],unavailableBodies:[],preservedProductionEnvelopes:[]},config:{},multi:{targets:[]},groupConfig:{groups:[]},minimal:{targets:[]},build:{targetReplacements:[]},linkage:{targets:[]},
    expect(file,id){const bytes=sources.get(file);assert(bytes,'missing source');assert.equal(bytes.length,id.bytes);assert.equal(hash(bytes),id.sha256);return bytes;}};
  return {rows,symbol,env,sources};
}
function admit(f){const pair=diagnostic.continuationSelection(f.rows,f.env.logicalConfig,f.symbol);return diagnostic.hydrateContinuation(pair,f.env);}
function pure() {
  let negatives=0;
  for(const f of [fixture(),fixture(0x12340,[20,44])]) {
    const c=admit(f);assert.deepEqual(c.owners.map(o=>o.bytes),f.rows.map(r=>r.bytes));assert.deepEqual(c.functions,[{symbol:f.symbol,binding:'GLOBAL',offset:0,bytes:c.romEndExclusive-c.romStart}]);
    assert.deepEqual(c.markers,f.rows.map(r=>r.part.name));assert.equal(c.caller,null);
    // Existing intake offset checks stay enabled; diagnostic composition alone grants no eligibility.
    assert.throws(()=>targetModel.compositeFunctionRows({rows:f.rows}));
    f.rows.forEach(r=>r.part.symbolByteOffset=0);
    assert.equal(targetModel.compositeFunctionRows({rows:f.rows}).pairs[0].symbol,f.symbol);
    for(const request of [f.rows[0].part.name,f.rows[1].part.name,f.symbol.toLowerCase()]) {
      // Some numeric-only stems have no case variant.
      if(request===f.symbol)continue;
      assert.throws(()=>diagnostic.continuationSelection(f.rows,f.env.logicalConfig,request));negatives++;
    }
    for(const request of [f.symbol.slice(0,-1),f.symbol+'suffix'])assert.equal(diagnostic.continuationSelection(f.rows,f.env.logicalConfig,request),null);
  }
  const cases=[
    f=>f.rows[1].part.name='func_00099999_chunk4tail',
    f=>f.rows.reverse(),f=>f.rows[1].index++,f=>f.rows[1].romStart+=4,
    f=>f.rows[1].slices[0].vramStart+=4,f=>f.rows[1].slices[0].placementKind='rom-only',
    f=>f.rows[1].slices.push({...f.rows[1].slices[0]}),f=>f.rows[1].slices[0].overlaySection='data',
    f=>f.rows[1].slices[0].overlayDescriptorId=2,f=>f.rows[1].slices[0].loadSlabId=2,
    f=>f.rows[1].slices[0].bytes-=4,f=>f.rows[1].part.bytes-=4,f=>f.rows[1].ambiguous=true,
    f=>f.rows.forEach(r=>r.slices[0].placementKind='unqualified'),f=>f.rows[1].slices[0].sectionName=f.rows[0].slices[0].sectionName,
    f=>f.rows[1].part.romEndNumber-=4,f=>f.rows[1].part.sha256='0'.repeat(64),
    f=>f.rows[1].part.textBytes++,f=>f.env.rom[f.rows[1].romStart]^=1,
    f=>f.rows[1].part.symbolByteOffset=4,f=>f.rows[1].part.hasOwnerLabel=false,
    f=>f.env.logicalConfig.bodies.push({symbol:'other',aliases:[],romStart:f.rows[1].romStart,romEndExclusive:f.rows[1].romEndExclusive}),
    f=>f.env.logicalConfig.bodies.push({symbol:'other',aliases:[f.rows[1].part.name],romStart:0,romEndExclusive:4}),
    f=>f.env.logicalConfig.padding.push(f.rows[1]),f=>f.env.logicalConfig.unavailableBodies.push(f.rows[1]),
    f=>f.env.logicalConfig.preservedProductionEnvelopes.push({fragments:[f.rows[1]]}),
    f=>f.env.config.retainedPaddingCuts=[{rowIndex:f.rows[1].index}],
    f=>f.env.multi.targets.push({ownerRows:[f.rows[1].index]}),
    f=>f.env.groupConfig.groups.push({members:[{ownerRowIndex:f.rows[1].index}]}),
    f=>f.env.minimal.targets.push({symbol:f.rows[1].part.name,compilationGroup:'bad'}),
    f=>f.env.build.targetReplacements.push({symbol:'other',owners:[{rowIndex:f.rows[1].index}]}),
    f=>f.env.build.targetReplacements.push({symbol:f.symbol,owners:[]}),
    f=>f.env.linkage.targets.push({symbol:f.rows[1].part.name,atomicText:{}}),
    f=>f.env.linkage.targets.push({symbol:f.symbol,auxiliarySections:[{}]}),
    f=>f.rows.push({...clone(f.rows[0]),part:{...f.rows[0].part,name:f.symbol}}),
    f=>f.env.logicalConfig.bodies.push({symbol:f.symbol,aliases:[],romStart:0,romEndExclusive:4}),
    f=>f.rows.push(...clone(f.rows)),
    f=>{const third=clone(f.rows[1]);third.index++;f.rows.push(third);},
    f=>{const r=f.rows[1];const b=Buffer.from('.word 0\n'+f.sources.get(r.part.file));f.sources.set(r.part.file,b);r.part.textBytes=b.length;r.part.sha256=hash(b);},
    f=>{const r=f.rows[1];const b=Buffer.from(r.part.name+':\n'+f.sources.get(r.part.file));f.sources.set(r.part.file,b);r.part.textBytes=b.length;r.part.sha256=hash(b);},
    f=>{const r=f.rows[1];const b=Buffer.from(f.sources.get(r.part.file).toString().replace('0x00000000','0x00000001'));f.sources.set(r.part.file,b);r.part.textBytes=b.length;r.part.sha256=hash(b);},
  ];
  for(const [i,change] of cases.entries()){const f=fixture();change(f);assert.throws(()=>admit(f),undefined,'continuation rejection '+i);negatives++;}
  // Missing continuation cannot resolve a logical target; no physical or registry fallback.
  const missing=fixture();missing.rows.pop();assert.throws(()=>diagnostic.continuationSelection(missing.rows,missing.env.logicalConfig,missing.symbol));
  assert.throws(()=>diagnostic.continuationSelection(missing.rows,missing.env.logicalConfig,missing.rows[0].part.name));negatives+=2;
  const f=fixture();for(const field of ['auxiliaryProjection','retainedLiteralReferences','nativeTextTail','compilerTextFunctions']) {
    const g=fixture();g.env.linkage.targets.push({symbol:g.rows[1].part.name,[field]:field==='compilerTextFunctions'?[{}]:{}});assert.throws(()=>admit(g));negatives++;
  }
  return {positivePairs:2,rejections:negatives,priorPureChecks:prior.pure()};
}

async function native(inputsFile,output,stagedIdentity) {
  fs.mkdirSync(output);const privateRoot=path.join(output,'candidate');fs.mkdirSync(privateRoot);
  const inputs=inputSet.openDiagnosticInputs(inputsFile,{privateRoot});diagnostic.authenticateCode(inputs);
  const context=diagnostic.load({inputs,symbol:'func_00040FF4'}),target=context.workbench.targets[0];
  const expectation=diagnostic.completeOwnerExpectation(context,target);
  assert.equal(targetModel.resolveTarget(context.workbench,target.symbol),target);
  assert.equal(target.bytes,164);assert.deepEqual(expectation.owners.map(o=>o.bytes),[12,152]);
  assert.deepEqual(expectation.markers,['func_00040ff4_chunk3head','func_00040ff4_chunk4tail']);
  assert.deepEqual(expectation.functions,[{symbol:'func_00040FF4',binding:'GLOBAL',offset:0,bytes:164}]);
  assert(target.logicalCoverageComplete);assert.equal(target.logicalFunctions.length,1);
  assert.deepEqual(context.workbench.modelManifest.continuationImplementation.map(x=>x.path),['tools/lib/matching/target_model.js','tools/lib/word_asm.js']);
  assert.throws(()=>diagnostic.assertCanonicalContext(context));
  for(const other of [{...target},clone(target)])assert.throws(()=>diagnostic.completeOwnerExpectation(context,other));
  for(const other of [{...context},{}])assert.throws(()=>diagnostic.completeOwnerExpectation(other,target));
  const saved=clone(target.completeOwnerDiagnostic);
  for(const mutate of [t=>t.owners.reverse(),t=>t.expectedFunctions[0].bytes=12,t=>t.expectedFunctions[0].binding='LOCAL',t=>t.caller={},t=>t.owners.pop()]) {
    mutate(target.completeOwnerDiagnostic);assert.throws(()=>diagnostic.completeOwnerExpectation(context,target));target.completeOwnerDiagnostic=clone(saved);
  }
  const context2=diagnostic.load({inputs,symbol:'func_00040FF4'});assert.throws(()=>diagnostic.completeOwnerExpectation(context2,target));
  for(const symbol of ['func_00040ff4_chunk3head','func_00040ff4_chunk4tail','func_00040ff4','func_00040FF','func_00040FF4suffix']) assert.throws(()=>diagnostic.load({inputs,symbol}));
  const ordinary=diagnostic.load({inputs,symbol:'func_00041098'});assert.equal(ordinary.workbench.targets[0].bytes,1380);assert.equal(diagnostic.completeOwnerExpectation(ordinary,ordinary.workbench.targets[0]),null);
  const session=compiler.prepareCompilerSession({context,inputs,matchingRoot:privateRoot});
  // Independently authored deliberately nonmatching fixture. Worker candidate is untouched.
  const source='int func_00040FF4(int x) { return x+1; }\n',authored=path.join(privateRoot,'authored.c'),snapshot=path.join(privateRoot,'snapshot.c');
  fs.writeFileSync(authored,source,{flag:'wx'});fs.writeFileSync(snapshot,source,{flag:'wx'});
  const a=policy.classifySource(relative(authored),{preprocessor:session.preprocessor}),classification=policy.classifySource(relative(snapshot),{preprocessor:session.preprocessor});
  privateInputs.assertPrivateClassification(a);privateInputs.assertPrivateClassification(classification);assert.equal(classification.class,'PURE_C');
  privateInputs.equalExpandedInputs(a,classification,{compilationInputBytes:policy.compilationInputBytes});
  const runId=hash(Buffer.from('continuation-fixture')),directory=compiler.authenticateFreshRunArtifactDirectory(runId,privateRoot);
  const result=compiler.compileScratchCandidate({session,target,sourceFile:snapshot,artifactDir:directory,classification});
  assert.equal(result.scratchContract.completeOwnerCensus.admissible,true);assert.equal(result.scratchContract.completeOwnerCensus.exact,false);
  const artifact=compiler.candidateArtifactFromScratch(result),expectedRelocationEvidence={available:false,reason:'inactive continuation fixture'};
  const prepared=comparison.prepareTargetDiagnostic(session,target,expectedRelocationEvidence);assert.equal(prepared.code,'complete-owner-symbolic-only');
  const compared=comparison.compareCandidateDiagnostic({session,target,objectText:result.objectText,actualRelocations:result.relocations,expectedRelocationEvidence,candidateArtifact:artifact,artifactDir:directory,prepared});
  assert.equal(compared.producerExact,false);assert.equal(compared.exactBytes,false);
  // Census-only falsifiers never change native output or claim compiled exactness.
  const object=p7.parseElf32BigEndian(fs.readFileSync(artifact.objectFile)),section=object.sections.find(s=>s.name===target.sectionName);
  for(const size of [12,152,160,168]) {
    const obj={...object,symbols:object.symbols.map(s=>s.symbolType===2?{...s,size}:s)};
    assert.equal(compiler.admittedFunctionCensus(context,target,obj,{...section,size}).exact,false);
  }
  for(const marker of expectation.markers)for(const binding of [0,1]) {
    const obj={...object,symbols:[...object.symbols,{name:marker,value:0,size:4,binding,visibility:0,symbolType:2,sectionIndex:section.index}]};
    assert.throws(()=>compiler.admittedFunctionCensus(context,target,obj,section));
  }
  // Raw algorithm controls are disposable buffers, never candidate artifacts or claimed native bytes.
  const {compareMips}=require('../tools/lib/matching/mips_analysis');
  for(const offset of [11,12,163]) {const bytes=Buffer.from(target.expectedBytes);bytes[offset]^=1;assert.equal(compareMips(target.expectedBytes,bytes,{start:target.vramStart}).exactBytes,false);}
  const candidate=compiler.candidateRecord(target,source),cacheKey=hash(Buffer.from('continuation-cache')),tool={...session.tool,candidateSourcePolicy:classification};
  const record={runId,candidateId:candidate.candidateId,cacheKey,status:'compiled',objectText:result.objectText.toString('base64'),relocations:result.relocations,tool};
  const report={schemaVersion:3,target:{symbol:target.symbol,targetId:target.targetId},candidate,compile:record,sourcePolicy:classification,scratchContract:result.scratchContract};
  const reportFile=path.join(directory,'workbench-report.json');fs.writeFileSync(reportFile,JSON.stringify(report));
  const run={run_id:runId,candidate_id:candidate.candidateId,cache_key:cacheKey,artifact_dir:relative(directory),object_text:record.objectText,relocations:record.relocations,tool};
  compiler.cachedCandidateArtifact(run,candidate,target,privateRoot,context.workbench,context);
  for(const mutate of [r=>delete r.scratchContract.completeOwnerCensus,r=>r.scratchContract.completeOwnerCensus.expected[0].bytes=12,r=>r.scratchContract.logicalFunctions[0].binding='LOCAL']) {
    const bad=clone(report);mutate(bad);fs.writeFileSync(reportFile,JSON.stringify(bad));assert.throws(()=>compiler.cachedCandidateArtifact(run,candidate,target,privateRoot,context.workbench,context),/census drift/);
  }
  fs.writeFileSync(reportFile,JSON.stringify(report));
  policy.verifyClassificationInputs(a);policy.verifyClassificationInputs(classification);
  const fresh=policy.classifySource(relative(snapshot),{preprocessor:session.preprocessor});privateInputs.equalExpandedInputs(classification,fresh,{compilationInputBytes:policy.compilationInputBytes});
  for(const name of fs.readdirSync(directory))inputs.capturePrivateArtifact(path.join(directory,name));
  inputs.capturePrivateArtifact(authored);inputs.capturePrivateArtifact(snapshot);diagnostic.authenticateCode(inputs);
  const sourceControls=prior.sourceEntryControls(context);
  // The old native fixture's former inactive targets are now accepted multi-owner C.
  // Preserve their current rejection rather than alter selected data to resurrect old eligibility.
  for(const symbol of ['func_00261D24','func_002664b0','func_00267928']) assert.throws(()=>diagnostic.load({inputs,symbol}),/complete multi-owner producer required/);
  await inputs.closeResearch();
  return {status:'pass',expectedBytes:164,owners:expectation.owners,expectedFunctions:expectation.functions,census:result.scratchContract.completeOwnerCensus,sourceControls,
    comparison:{primaryClass:compared.primaryClass,producerExact:compared.producerExact,exactBytes:compared.exactBytes},inputAuthentication:inputs.provenance(),stagedIdentity,
    supportedWatchLineage:false,currentAcceptanceCertified:false};
}
async function main(argv=process.argv.slice(2),stagedIdentity=null,options={}) {
  const checks=pure();let result={status:'pass',checks,native:'not-run'};
  let outputFile;
  if(argv.includes('--native')) {
    const option=name=>argv[argv.indexOf(name)+1],output=path.resolve(option('--output'));
    if(!output.startsWith(path.join(ROOT,'build')+path.sep)||fs.existsSync(output))throw Error('new ignored output required');
    result={status:'pass',checks,continuation:await native(option('--inputs'),output,stagedIdentity)};
    result.registered={pureChecks:checks.priorPureChecks,currentFormerFixtureTargets:'all three reject as accepted multi-owner producers',historicalNativeFixture:'not applicable to current selected membership'};
    outputFile=path.join(output,'continuation-results.json');
  }
  return prior.finalizeFixture({report:result,outputFile},options.beforePublish);
}
if(require.main===module)main().then(r=>console.log(JSON.stringify(r))).catch(e=>{console.error(e);process.exitCode=1;});
module.exports={main,pure};
