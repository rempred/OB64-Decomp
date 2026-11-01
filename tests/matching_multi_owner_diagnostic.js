'use strict';
// The installed and staged invocations use this same entrypoint and native APIs.
const assert = require('assert/strict');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const ROOT = path.resolve(__dirname,'..');
const diagnostic = require('../tools/lib/matching/diagnostic_context');
const compiler = require('../tools/lib/matching/compiler');
const inputSet = require('../tools/lib/matching/input_set');
const policy = require('../tools/lib/source_policy');
const privateInputs = require('../tools/lib/matching/private_inputs');
const comparison = require('../tools/lib/matching/diagnostic_link');
const p7 = require('../tools/lib/phase7_conventional');
const textContract = require('../tools/lib/text_contract');
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex').toUpperCase();
const clone = value => JSON.parse(JSON.stringify(value));
const relative = file => path.relative(ROOT,file).replace(/\\/g,'/');

function geometry(sizes, functionSizes) {
  let cursor=0;
  const rows=sizes.map((bytes,index)=>{
    const start=cursor;cursor+=bytes;
    return {index,romStart:start,romEndExclusive:cursor,bytes,inputKind:'tracked-assembly',ownerKind:'tracked-assembly-part',primaryClass:'code',ambiguous:false,
      part:{name:'f'+index,romStartNumber:start,romEndNumber:cursor,bytes},
      slices:[{romStart:start,romEndExclusive:cursor,bytes,vramStart:0x80000000+start,vramEndExclusive:0x80000000+cursor,
        executable:true,placementKind:'overlay',overlayDescriptorId:12,loadSlabId:null,overlaySection:'text',ordinal:index}]};
  });
  cursor=0;
  const bodies=functionSizes.map((bytes,index)=>{const start=cursor;cursor+=bytes;return {symbol:index?'secondary':'f0',romStart:start,romEndExclusive:cursor};});
  return {rows,bodies};
}
function pure() {
  let checks=0;
  for(const [physical,functions] of [[[60,28],[88]],[[160,624],[784]],[[108,1028],[104,1032]]]) {
    const g=geometry(physical,functions),c=diagnostic.completeOwnerClosure(g.rows,g.bodies,g.rows[0],'f0');
    assert.equal(c.owners.length,2);assert.equal(c.bodies.length,functions.length);assert.equal(c.romEndExclusive,physical.reduce((a,b)=>a+b));checks++;
  }
  // Zero-width markers cannot satisfy or disrupt positive body coverage.
  const marker=geometry([108,1028],[104,1032]);marker.bodies.push({symbol:'f1',romStart:108,romEndExclusive:108});
  assert.equal(diagnostic.completeOwnerClosure(marker.rows,marker.bodies,marker.rows[0],'f0').bodies.length,2);checks++;
  const mutations=[
    g=>g.rows.reverse(),g=>g.rows[1].index++,g=>g.rows[1].romStart++,g=>g.rows[1].slices[0].ordinal++,
    g=>g.rows[1].slices[0].vramStart+=4,g=>g.rows[1].slices[0].overlayDescriptorId++,g=>g.rows[1].slices[0].executable=false,
    g=>g.rows[1].ambiguous=true,g=>g.rows[1].part.bytes--,g=>g.rows[1].slices.push({...g.rows[1].slices[0]}),
    g=>g.bodies[1].romStart++,g=>g.bodies[1].romEndExclusive--,g=>g.bodies.push({...g.bodies[1]}),
    g=>g.bodies[1].symbol='f1',g=>g.rows.pop(),
  ];
  for(const mutate of mutations){const g=geometry([108,1028],[104,1032]),first=g.rows[0];mutate(g);assert.throws(()=>diagnostic.completeOwnerClosure(g.rows,g.bodies,first,'f0'));checks++;}
  const g=geometry([108,1028],[104,1032]);assert.throws(()=>diagnostic.completeOwnerClosure(g.rows,g.bodies,g.rows[0],'f1'));checks++;
  assert.throws(()=>diagnostic.completeOwnerExpectation({}, {completeOwnerDiagnostic:{}}));checks++;
  assert.equal(diagnostic.completeOwnerExpectation({},{}),null);checks++;
  const f=(name,offset,bytes,binding)=>({name,value:offset,size:bytes,binding,visibility:0,symbolType:2});
  const expected=[{symbol:'a'},{symbol:'b'}];
  assert.equal(compiler.validateLogicalFunctionCensus([f('b',108,1028,0),f('a',0,108,1)],expected,1136,['GLOBAL','LOCAL']),1136);checks++;
  for(const actual of [[f('a',0,104,1),f('b',104,1032,1)],[f('a',0,104,1),f('b',108,1028,0)],[f('a',0,104,1),f('wrong',104,1032,0)]]) {
    assert.throws(()=>compiler.validateLogicalFunctionCensus(actual,expected,1136,['GLOBAL','LOCAL']));checks++;
  }
  return checks;
}

function sourceEntryControls(context) {
  let rejections=0;
  const sources=[];
  for(const index of [4676,4677,4753,4754,4774,4775]) {
    const owner=context.workbench.model.rows[index],source=context.read(owner.part.file);
    const expected=context.rom.subarray(owner.romStart,owner.romEndExclusive);
    const inspected=diagnostic.inspectCompleteOwnerSource(owner,source,expected);
    assert.equal(inspected.symbolByteOffset,0);
    assert.equal(inspected.hasOwnerLabel,index===4775);
    sources.push({rowIndex:index,file:owner.part.file,sourceSha256:hash(source),bytes:expected.length,entryEvidence:inspected.entryEvidence});
    function fixture(text=source.toString('utf8')) {
      const row=clone(owner),bytes=Buffer.from(text);
      row.part.textBytes=bytes.length;row.part.sha256=hash(bytes);
      delete row.part.symbolByteOffset;delete row.part.hasOwnerLabel;
      return {row,bytes};
    }
    const text=source.toString('utf8'),lines=text.split(/\r?\n/);
    // Existing word reader, not an anchored bare-.word approximation.
    const assemble=require('../tools/lib/word_asm').assembleWordAsmText;
    const firstWord=lines.findIndex(line=>assemble(line).words>0);assert(firstWord>=0);
    const unlabeled=lines.filter(line=>line.trim()!==owner.part.name+':');
    const wordIndex=unlabeled.findIndex(line=>assemble(line).words>0);
    const interior=[...unlabeled];interior.splice(wordIndex+1,0,owner.part.name+':');
    const inside=fixture(interior.join('\n'));
    assert.throws(()=>diagnostic.inspectCompleteOwnerSource(inside.row,inside.bytes,expected),/nonzero\/conflicting/);rejections++;
    const duplicate=fixture([owner.part.name+':',owner.part.name+':',...unlabeled].join('\n'));
    assert.throws(()=>diagnostic.inspectCompleteOwnerSource(duplicate.row,duplicate.bytes,expected),/ambiguous.*labels/);rejections++;
    const inlineDuplicate=fixture([owner.part.name+': '+owner.part.name+':',...unlabeled].join('\n'));
    assert.throws(()=>diagnostic.inspectCompleteOwnerSource(inlineDuplicate.row,inlineDuplicate.bytes,expected),/ambiguous.*labels/);rejections++;
    const metadata=fixture();metadata.row.part.symbolByteOffset=4;
    assert.throws(()=>diagnostic.inspectCompleteOwnerSource(metadata.row,metadata.bytes,expected),/nonzero\/conflicting/);rejections++;
    const flag=fixture();flag.row.part.hasOwnerLabel=!inspected.hasOwnerLabel;
    assert.throws(()=>diagnostic.inspectCompleteOwnerSource(flag.row,flag.bytes,expected),/nonzero\/conflicting/);rejections++;
    const extent=fixture();extent.row.part.bytes+=4;
    assert.throws(()=>diagnostic.inspectCompleteOwnerSource(extent.row,extent.bytes,expected),/metadata extent/);rejections++;
    const wrongHash=fixture();wrongHash.row.part.sha256='0'.repeat(64);
    assert.throws(()=>diagnostic.inspectCompleteOwnerSource(wrongHash.row,wrongHash.bytes,expected),/source identity/);rejections++;
    const wrongSourceSize=fixture();wrongSourceSize.row.part.textBytes++;
    assert.throws(()=>diagnostic.inspectCompleteOwnerSource(wrongSourceSize.row,wrongSourceSize.bytes,expected),/source identity/);rejections++;
    const wrongRom=Buffer.from(expected);wrongRom[0]^=1;
    assert.throws(()=>diagnostic.inspectCompleteOwnerSource(owner,source,wrongRom),/original owner bytes/);rejections++;
  }
  // Bare directives use the same existing assembler reader too; an interior
  // label cannot slip through merely by changing comment/directive formatting.
  const text='.text\n.word 0\nf:\n.word 0\n',bytes=Buffer.from(text);
  const row={romStart:0,romEndExclusive:8,bytes:8,part:{name:'f',romStartNumber:0,romEndNumber:8,bytes:8,textBytes:bytes.length,sha256:hash(bytes)}};
  assert.throws(()=>diagnostic.inspectCompleteOwnerSource(row,bytes,Buffer.alloc(8)),/nonzero\/conflicting/);rejections++;
  return {positive:sources.length,rejections,sources,sourceMutation:false};
}

function callerFalsifiers(context, body) {
  // Explicit evidence values for the evidence-only inspector. No production
  // reader, module, filesystem operation or context eligibility is replaced.
  const output=context.environment.output;
  const originalReplacement=context.build.targetReplacements.find(r=>r.symbol==='func_00269F00');
  assert(originalReplacement);
  const selectedProof=JSON.parse(context.read(path.join(output,originalReplacement.sourceObjectProof.path)));
  const selectedFiles=new Map();
  for(const descriptor of Object.values(selectedProof.objectEvidence.artifacts).filter(Boolean)) {
    selectedFiles.set(path.resolve(output,descriptor.path),context.read(path.join(output,descriptor.path)));
  }
  selectedFiles.set(path.resolve(ROOT,originalReplacement.originalAssemblyFallback),context.read(originalReplacement.originalAssemblyFallback));
  const selectedLinkage=JSON.parse(context.read('config/matching-c-linkage.json'));
  const selectedRow=context.workbench.model.rows[originalReplacement.rowIndex];
  const selectedSection=context.environment.acceptedElf.sections.find(s=>s.name===originalReplacement.sectionName);
  const selectedSymbols=context.environment.acceptedElf.symbols.filter(s=>s.name===body.symbol&&s.sectionIndex!==0);
  const selectedWordBytes=context.environment.acceptedElf.buffer.subarray(selectedSection.offset,selectedSection.offset+selectedSection.size);
  function fixture() {
    const replacement=clone(originalReplacement),proof=clone(selectedProof);
    const vr=clone(context.verified.verification.targets.find(t=>t.symbol===replacement.symbol));
    const fr=clone(context.fresh.targets.find(t=>t.symbol===replacement.symbol));
    const rows=[];rows[replacement.rowIndex]=clone(selectedRow);
    const files=new Map([...selectedFiles].map(([name,bytes])=>[name,Buffer.from(bytes)]));
    const env={linkage:{symbols:clone(selectedLinkage.symbols.filter(s=>s.name===body.symbol))},
      build:{targetReplacements:[replacement]},verified:{verification:{targets:[vr]}},fresh:{targets:[fr]},output,rows,
      rom:context.rom,elf:{sections:[{...selectedSection,offset:0}],symbols:clone(selectedSymbols),buffer:Buffer.from(selectedWordBytes)},
      expect(file,expected) {
        const bytes=files.get(path.resolve(ROOT,file));assert(bytes,'fixture evidence file missing');
        assert.equal(bytes.length,expected.bytes);assert.equal(hash(bytes),expected.sha256);return Buffer.from(bytes);
      }};
    const state={env,body:clone(body),proof,replacement,vr,fr,files};
    state.rawFile=path.resolve(output,proof.objectEvidence.artifacts.rawObject.path);
    state.raw=files.get(state.rawFile);
    state.object=p7.parseElf32BigEndian(state.raw);
    state.rel=state.object.sections.find(s=>s.type===9&&s.name==='.rel.ob64.r4816');
    state.section=state.object.sections.find(s=>s.name===replacement.sectionName);
    state.originalWord=function(word) {
      const file=path.resolve(ROOT,replacement.originalAssemblyFallback),old=files.get(file).toString('utf8');
      const changed=old.replace(/(\.word\s+)0x0C084B78/i,(_,prefix)=>prefix+'0x'+word.toString(16).toUpperCase().padStart(8,'0'));assert.notEqual(changed,old);
      files.set(file,Buffer.from(changed));const row=rows[replacement.rowIndex];row.part.sha256=hash(files.get(file));row.part.textBytes=files.get(file).length;
      replacement.originalAssemblySha256=row.part.sha256;
      const words=require('../tools/lib/word_asm').assembleWordAsmText(changed).bytes;
      env.rom=Buffer.from(context.rom);words.copy(env.rom,row.romStart);vr.expectedTargetSha256=hash(words);env.elf.buffer=Buffer.from(words);
    };
    state.seal=function() {
      // Rebind synthetic fixture reports so malformed actual evidence reaches
      // the semantic guard under test, rather than merely a hash mismatch.
      const raw=proof.objectEvidence.artifacts.rawObject;raw.bytes=state.raw.length;raw.sha256=hash(state.raw);
      replacement.sourceObjectSha256=raw.sha256;
      vr.representationSha256=textContract.representationDigest(proof);fr.freshRepresentationSha256=textContract.representationDigest(proof,false);
      const bytes=Buffer.from(JSON.stringify(proof)),descriptor={...replacement.sourceObjectProof,bytes:bytes.length,sha256:hash(bytes)};
      replacement.sourceObjectProof=descriptor;vr.sourceObjectEvidence.proof=clone(descriptor);fr.sourceObjectProof=clone(descriptor);
      files.set(path.resolve(output,descriptor.path),bytes);
    };
    return state;
  }
  const positive=fixture();positive.seal();assert.equal(diagnostic.fixedEntryCallerEvidence(positive.body,positive.env).entry,0x80212de0);
  const cases=[
    ['missing-provider',s=>s.env.linkage.symbols=[],/provider/],
    ['duplicate-provider',s=>s.env.linkage.symbols.push({...s.env.linkage.symbols[0]}),/provider/],
    ['wrong-provider',s=>s.env.linkage.symbols[0].address='0x80212DE4',/provider/],
    ['missing-caller',s=>s.env.build.targetReplacements=[],/caller missing/],
    ['ambiguous-caller',s=>s.replacement.relocations.push({...s.replacement.relocations[0]}),/caller missing\/ambiguous/],
    ['partial-caller',s=>s.replacement.owners.push({...s.replacement.owners[0]}),/unsupported.*caller/],
    ['missing-raw-artifact',s=>s.files.delete(s.rawFile),/file missing/],
    ['wrong-actual-rel-type',s=>s.raw.writeUInt32BE((s.raw.readUInt32BE(s.rel.offset+4)&~255)|5,s.rel.offset+4),/actual R_MIPS_26/],
    ['missing-actual-rel',s=>s.raw.writeUInt32BE(0xe0,s.rel.offset),/actual R_MIPS_26/],
    ['wrong-actual-rel-symbol',s=>s.raw.writeUInt32BE(4,s.rel.offset+4),/relocation symbol/],
    ['raw-not-jal',s=>s.raw.writeUInt32BE(0x08000000,s.section.offset+0xe4),/not JAL/],
    ['nonzero-addend',s=>s.raw.writeUInt32BE(0x0c000001,s.section.offset+0xe4),/addend\/original mapped JAL/],
    ['original-not-jal',s=>s.originalWord(0x08084b78),/addend\/original mapped JAL/],
    ['original-wrong-destination',s=>s.originalWord(0x0c084b79),/addend\/original mapped JAL/],
    ['wrong-mapped-pc-region',s=>{s.env.rows[s.replacement.rowIndex].slices[0].vramStart+=0x10000000;s.vr.vramStart+=0x10000000;},/addend\/original mapped JAL/],
    ['wrong-logical-entry',s=>{s.body.fragments[0].vramStart+=4;s.env.linkage.symbols[0].address='0x80212DE4';},/addend\/original mapped JAL/],
    ['wrong-caller-placement',s=>s.env.rows[s.replacement.rowIndex].slices[0].overlayDescriptorId++,/mapped placement/],
    ['missing-linked-provider',s=>s.env.elf.symbols=[],/accepted fixed provider/],
    ['duplicate-linked-provider',s=>s.env.elf.symbols.push({...s.env.elf.symbols[0]}),/accepted fixed provider/],
    ['wrong-linked-provider',s=>s.env.elf.symbols[0].value++,/accepted fixed provider/],
    ['wrong-linked-call',s=>s.env.elf.buffer.writeUInt32BE(0,s.section?0xe4:0),/accepted linked bytes/],
    ['proof-wrong-raw-word',s=>s.proof.linkEvidence.relocations[0].rawWord++,/proof relocation words/],
    ['proof-wrong-linked-word',s=>s.proof.linkEvidence.relocations[0].linkedWord++,/proof relocation words/],
    ['proof-wrong-symbol',s=>s.proof.linkEvidence.relocations[0].symbol='wrong',/proof relocation words/],
    ['proof-not-full-owner',s=>s.proof.linkEvidence.fullOwnerExact=false,/representation lineage/],
    ['companion-source-drift',s=>s.fr.sourceSha256='0'.repeat(64),/companion contract/],
  ];
  for(const [name,mutate,pattern] of cases){const s=fixture();mutate(s);s.seal();assert.throws(()=>diagnostic.fixedEntryCallerEvidence(s.body,s.env),pattern,name);}
  const badProof=fixture();badProof.seal();badProof.vr.representationSha256='0'.repeat(64);
  assert.throws(()=>diagnostic.fixedEntryCallerEvidence(badProof.body,badProof.env),/representation lineage/);
  const missingProof=fixture();missingProof.seal();missingProof.files.delete(path.resolve(output,missingProof.replacement.sourceObjectProof.path));
  assert.throws(()=>diagnostic.fixedEntryCallerEvidence(missingProof.body,missingProof.env),/file missing/);
  const badCompanion=fixture();badCompanion.seal();badCompanion.fr.sourceObjectProof.sha256='0'.repeat(64);
  assert.throws(()=>diagnostic.fixedEntryCallerEvidence(badCompanion.body,badCompanion.env),/companion contract/);
  return {positive:1,rejections:cases.length+3,authorityGranted:false};
}

async function native(inputsFile, outputRoot, stagedIdentity) {
  // No worker ticket or supported watch lineage is manufactured. These are direct
  // fixture consumers of exported production APIs with their normal checks.
  if(!inputsFile || !outputRoot)throw Error('native fixture requires --inputs and --output');
  const output=path.resolve(outputRoot),build=path.join(ROOT,'build');
  if(!output.startsWith(build+path.sep)||fs.existsSync(output))throw Error('fixture output must be new under build');
  inputSet.regular(path.dirname(output),true);fs.mkdirSync(output);
  const cases=[['func_00261D24',88,[60,28]],['func_002664b0',784,[160,624]],['func_00267928',1136,[108,1028]]];
  const results=[];
  for(const [index,[symbol,expectedBytes,owners]] of cases.entries()) {
    const privateRoot=path.join(output,String(index));fs.mkdirSync(privateRoot);
    const inputs=inputSet.openDiagnosticInputs(inputsFile,{privateRoot});
    diagnostic.authenticateCode(inputs);
    const context=diagnostic.load({inputs,symbol}),target=context.workbench.targets[0];
    const sourceControls=index===0?sourceEntryControls(context):null;
    const expectation=diagnostic.completeOwnerExpectation(context,target);
    assert.equal(target.bytes,expectedBytes);assert.deepEqual(expectation.owners.map(o=>o.bytes),owners);
    assert.equal(expectation.functions.length,index===2?2:1);
    assert(Object.isFrozen(expectation)&&Object.isFrozen(expectation.functions[0]));
    assert.throws(()=>diagnostic.completeOwnerExpectation(context,{...target}));
    const prior=target.bytes;target.bytes++;assert.throws(()=>diagnostic.completeOwnerExpectation(context,target));target.bytes=prior;
    const bodySize=target.logicalFunctions[0].bytes;target.logicalFunctions[0].bytes++;
    assert.throws(()=>diagnostic.completeOwnerExpectation(context,target));target.logicalFunctions[0].bytes=bodySize;
    target.expectedBytes[0]^=1;assert.throws(()=>diagnostic.completeOwnerExpectation(context,target));target.expectedBytes[0]^=1;
    assert.throws(()=>{expectation.functions[0].bytes++;},TypeError);
    assert.throws(()=>diagnostic.completeOwnerExpectation({},target));
    let callerControls=null;
    if(index===2){assert.equal(expectation.functions[1].offset,104);assert.equal(expectation.caller.entry,0x80212de0);assert.equal(expectation.caller.addend,0);
      callerControls=callerFalsifiers(context,context.producerModel.diagnosticMetadata.logicalConfig.bodies.find(b=>b.symbol==='func_00267990'));
    }
    const session=compiler.prepareCompilerSession({context,inputs,matchingRoot:privateRoot});
    const source=index===2
      ? 'static int func_00267990(int x);\nint func_00267928(int x) { return func_00267990(x)+1; }\nstatic int func_00267990(int x) { if (x==0) return 7; return func_00267990(x-1)+x; }\n'
      : `int ${symbol}(int x) { return x+1; }\n`;
    const authored=path.join(privateRoot,'authored.c'),snapshot=path.join(privateRoot,'snapshot.c');
    fs.writeFileSync(authored,source,{flag:'wx'});fs.writeFileSync(snapshot,source,{flag:'wx'});
    const a=policy.classifySource(relative(authored),{preprocessor:session.preprocessor});
    const classification=policy.classifySource(relative(snapshot),{preprocessor:session.preprocessor});
    assert.equal(a.class,'PURE_C');assert.equal(classification.class,'PURE_C');
    privateInputs.assertPrivateClassification(a);privateInputs.assertPrivateClassification(classification);
    privateInputs.equalExpandedInputs(a,classification,{compilationInputBytes:policy.compilationInputBytes});
    const runId=hash(Buffer.from(symbol)),directory=compiler.authenticateFreshRunArtifactDirectory(runId,privateRoot);
    const result=compiler.compileScratchCandidate({session,target,sourceFile:snapshot,artifactDir:directory,classification});
    assert.equal(result.scratchContract.completeOwnerCensus.admissible,true);
    assert.equal(result.scratchContract.completeOwnerCensus.exact,false);
    assert.deepEqual(result.scratchContract.logicalFunctions.map(f=>f.binding),index===2?['GLOBAL','LOCAL']:['GLOBAL']);
    if(index===2) {
      const object=p7.parseElf32BigEndian(fs.readFileSync(path.join(directory,'candidate.o')));
      const section=object.sections.find(s=>s.name===target.sectionName);
      const metadata={...object,symbols:object.symbols.map(s=>({...s})),sections:object.sections.map(s=>({...s}))};
      const testSection={...section,size:target.bytes};
      for(const expected of expectation.functions) {
        const symbolRecord=metadata.symbols.find(s=>s.symbolType===2&&s.name===expected.symbol);
        symbolRecord.value=expected.offset;symbolRecord.size=expected.bytes;
      }
      assert.equal(compiler.admittedFunctionCensus(context,target,metadata,testSection).exact,true);
      const ordered=metadata.symbols.filter(s=>s.symbolType===2).sort((a,b)=>a.value-b.value);
      ordered[0].size+=4;ordered[1].value+=4;ordered[1].size-=4;
      const shifted=compiler.admittedFunctionCensus(context,target,metadata,testSection);
      assert.equal(shifted.admissible,true);assert.equal(shifted.exact,false);
      // These are census-only metadata controls, never fabricated native bytes
      // or an exact compilation claim. The observed native object is untouched.
    }
    const artifact=compiler.candidateArtifactFromScratch(result),expectedRelocationEvidence={available:false,reason:'inactive ASM fixture'};
    const prepared=comparison.prepareTargetDiagnostic(session,target,expectedRelocationEvidence);
    assert.equal(prepared.code,'complete-owner-symbolic-only');
    const compared=comparison.compareCandidateDiagnostic({session,target,objectText:result.objectText,actualRelocations:result.relocations,
      expectedRelocationEvidence,candidateArtifact:artifact,artifactDir:directory,prepared});
    assert.equal(compared.producerExact,false);assert.equal(compared.primaryClass,'producer-census-mismatch');
    assert.equal(compared.exactBytes,false);
    const candidate=compiler.candidateRecord(target,source),cacheKey=hash(Buffer.from('fixture'+symbol)),tool={...session.tool,candidateSourcePolicy:classification};
    const record={runId,candidateId:candidate.candidateId,cacheKey,status:'compiled',objectText:result.objectText.toString('base64'),relocations:result.relocations,tool};
    const report={schemaVersion:3,target:{symbol:target.symbol,targetId:target.targetId},candidate,compile:record,sourcePolicy:classification,scratchContract:result.scratchContract};
    const reportFile=path.join(directory,'workbench-report.json');fs.writeFileSync(reportFile,JSON.stringify(report));
    const run={run_id:runId,candidate_id:candidate.candidateId,cache_key:cacheKey,artifact_dir:relative(directory),object_text:record.objectText,relocations:record.relocations,tool};
    compiler.cachedCandidateArtifact(run,candidate,target,privateRoot,context.workbench,context);
    const saved=fs.readFileSync(reportFile),wrong=clone(report);wrong.scratchContract.logicalFunctions[0].bytes+=4;
    fs.writeFileSync(reportFile,JSON.stringify(wrong));assert.throws(()=>compiler.cachedCandidateArtifact(run,candidate,target,privateRoot,context.workbench,context),/census drift/);fs.writeFileSync(reportFile,saved);
    const objectSaved=fs.readFileSync(artifact.objectFile);fs.appendFileSync(artifact.objectFile,Buffer.from([0]));
    assert.throws(()=>compiler.cachedCandidateArtifact(run,candidate,target,privateRoot,context.workbench,context),/object artifact identity/);fs.writeFileSync(artifact.objectFile,objectSaved);
    // Actual extent changes remain parseable evidence rather than a trimmed view.
    assert.equal(result.objectText.length,result.scratchContract.fullOwner.bytes);
    policy.verifyClassificationInputs(a);policy.verifyClassificationInputs(classification);
    const freshA=policy.classifySource(relative(authored),{preprocessor:session.preprocessor});
    const freshS=policy.classifySource(relative(snapshot),{preprocessor:session.preprocessor});
    privateInputs.equalExpandedInputs(a,freshA,{compilationInputBytes:policy.compilationInputBytes});
    privateInputs.equalExpandedInputs(classification,freshS,{compilationInputBytes:policy.compilationInputBytes});
    for(const name of fs.readdirSync(directory)) inputs.capturePrivateArtifact(path.join(directory,name));
    inputs.capturePrivateArtifact(authored);inputs.capturePrivateArtifact(snapshot);
    diagnostic.authenticateCode(inputs);
    if(index===2) {
      const consumed=new Set(inputs.consumedPaths().map(file=>path.resolve(file).toLowerCase()));
      for(const file of [path.join(context.environment.output,expectation.caller.sourceObject.path),
        path.join(context.environment.output,expectation.caller.proof.path),path.join(ROOT,expectation.caller.original.file)]) {
        assert(consumed.has(path.resolve(file).toLowerCase()),'caller evidence must participate in normal closing checks');
      }
      // Exercise the common consumed-file closing gate on disposable fixture
      // bytes, without mutating any selected caller artifact or worker input.
      const closingProbe=path.join(privateRoot,'closing.txt');fs.writeFileSync(closingProbe,'before');inputs.capturePrivateArtifact(closingProbe);
      fs.writeFileSync(closingProbe,'after');await assert.rejects(inputs.closeResearch(),/content drift/);
      assert.equal(fs.existsSync(path.join(output,'fixture-results.json')),false);
      fs.writeFileSync(closingProbe,'before');
    }
    await inputs.closeResearch();
    results.push({symbol,owners,sourceControls,callerControls,census:result.scratchContract.completeOwnerCensus,comparison:{rawExactBytes:compared.rawExactBytes,producerExact:compared.producerExact,primaryClass:compared.primaryClass},inputAuthentication:inputs.provenance()});
  }
  const report={status:'pass',scope:stagedIdentity?'staged-module-fixture-behavior':'installed-module-fixture-behavior',stagedIdentity:stagedIdentity||null,
    supportedWatchLineage:false,currentAcceptanceCertified:false,results};
  return {report,outputFile:path.join(output,'fixture-results.json')};
}

// One publisher for installed and staged runs. Native input close has already
// succeeded; the staged caller supplies its package/executable close here.
async function finalizeFixture(pending, beforePublish=async()=>{}) {
  await beforePublish();
  if(pending.outputFile) {
    inputSet.regular(path.dirname(pending.outputFile),true);
    fs.writeFileSync(pending.outputFile,JSON.stringify(pending.report,null,2)+'\n',{flag:'wx'});
  }
  return pending.report;
}
async function publicationChecks(parent) {
  const directory=path.join(parent,'publication-'+crypto.randomUUID());fs.mkdirSync(directory);
  const file=path.join(directory,'fixture-results.json');let closed=false;
  await assert.rejects(finalizeFixture({report:{status:'pass'},outputFile:file},async()=>{
    closed=true;throw Error('intentional staged package closing drift');
  }),/intentional staged package closing drift/);
  assert(closed);assert.equal(fs.existsSync(file),false,'failed staged close must leave no PASS artifact');
  const positive=path.join(directory,'publisher-control.json');
  await finalizeFixture({report:{kind:'publisher-control'},outputFile:positive},async()=>{
    assert.equal(fs.existsSync(positive),false);
  });
  assert.equal(JSON.parse(fs.readFileSync(positive)).kind,'publisher-control');
  return {failedClosePublishesPass:false,commonPublisherChecks:2};
}

async function main(argv=process.argv.slice(2),stagedIdentity=null,options={}) {
  const checks=pure();
  if(!argv.includes('--native'))return finalizeFixture({report:{status:'pass',pureChecks:checks,native:'not-run'}},options.beforePublish);
  const option=name=>argv[argv.indexOf(name)+1];
  const pending=await native(option('--inputs'),option('--output'),stagedIdentity);
  pending.report.pureChecks=checks;
  pending.report.publicationChecks=await publicationChecks(path.dirname(pending.outputFile));
  return finalizeFixture(pending,options.beforePublish);
}
if(require.main===module)main().then(value=>console.log(JSON.stringify(value))).catch(error=>{console.error(error);process.exitCode=1;});
module.exports={main,pure,sourceEntryControls,callerFalsifiers,finalizeFixture,publicationChecks};
