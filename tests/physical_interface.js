'use strict';
// Production PURE_C path exercised in isolated fixture output; not wave acceptance.
const fs=require('fs'),path=require('path'),assert=require('assert');
const p7=require('../tools/lib/phase7_conventional'),p=require('../tools/lib/phase8_matching_c'),native=require('../tools/lib/real_mips_toolchain'),text=require('../tools/lib/text_contract');
function retainedScenario(){
const root=p7.ROOT,whole=p.loadPhase8Model(),target=whole.targets.find(t=>t.symbol==='func_000065E4');
assert(target&&p.physicalInterface(target),'registered different-name terminal fixture must be active');
const row=target.row,tools=native.assertToolchainAvailable(native.loadToolchainConfig()),local=JSON.parse(fs.readFileSync(path.join(root,'config/local-tools.json')));
p.verifyCompiler(whole,local.compiler);const classification=require('../tools/lib/source_policy').classifyTargetSources([target]).targets[0];assert.equal(classification.class,'PURE_C');
const out=fs.mkdtempSync(path.join(root,'build/pi-'));

const run=(exe,args)=>native.runTool(exe,args,{cwd:out}),write=(f,v)=>{fs.mkdirSync(path.dirname(path.join(out,f)),{recursive:true});fs.writeFileSync(path.join(out,f),v);};
write('original.s',require(root+'/tools/build_phase7_conventional').transformTrackedPartSource(row,fs.readFileSync(path.join(root,row.part.file))));
const strip=['--remove-section=.reginfo','--remove-section=.pdr','--remove-section=.comment','--remove-section=.note'];
run(tools.assemblerAbs,[...tools.assemblerFlags,'-o','original.raw.o','original.s']);fs.mkdirSync(path.join(out,'phase7/objects/assembly'),{recursive:true});
run(tools.objcopyAbs,[...strip,...row.slices.flatMap(s=>['--set-section-flags',s.sectionName+'=alloc,load,code,readonly,data,contents']),'original.raw.o','phase7/objects/assembly/chunk_000.o']);
const originalFile=path.join(out,'phase7/objects/assembly/chunk_000.o'),minimal={...whole,targets:[target],model:{...whole.model,rows:[row],slices:row.slices,overlays:[],nonDescriptorLoadSlabs:[]}};
for(const name of ['func_0002de50','resource_arena_register']){const owner=whole.model.rows.find(r=>r.part?.name===name);assert(owner);minimal.linkSymbols={...minimal.linkSymbols,[name]:p7.hex(owner.slices[0].vramStart+owner.part.symbolByteOffset)};}
const phase7={files:{objectManifest:path.join(out,'phase7/objects/manifest.json')},objectManifest:{objects:[{path:'objects/assembly/chunk_000.o',bytes:fs.statSync(originalFile).size,sha256:p7.sha256File(originalFile)}]}};
p.copyPhase7Objects(minimal,phase7,out,tools.objcopyAbs);
const compiled=p.compileTarget(whole,target,out,local.compiler,tools.assemblerAbs,tools.objcopyAbs,{classification});
write('caller.s','.set noat\n.set noreorder\n.section .ob64.r9000,"ax",@progbits\n.align 2\n.globl fixture_caller\n.type fixture_caller,@function\nfixture_caller:\njal '+row.part.name+'\nnop\njr $31\nnop\n.size fixture_caller,.-fixture_caller\n');
run(tools.assemblerAbs,[...tools.compilerAssemblerFlags,'-o','caller.raw.o','caller.s']);run(tools.objcopyAbs,[...strip,'caller.raw.o','objects/assembly/caller.o']);
const callerSlice={ordinal:2,rowIndex:9000,sectionName:'.ob64.r9000',phdrName:'p9000',sliceIndex:0,sliceCount:1,romStart:0x9000,romEndExclusive:0x9010,bytes:16,vramStart:0x80079000,vramEndExclusive:0x80079010,executable:true};minimal.model={...minimal.model,slices:[...row.slices,callerSlice]};
let script=p.renderPhase8LinkerScript(minimal,{linkedObjects:[]});script=script.replace('    *(.ob64.r9000)','    objects/assembly/caller.o(.ob64.r9000)');write('linker/phase8.ld',script);
run(tools.toolsAbs.linker,[...whole.model.config.binutils.linkerFlags,'-T','linker/phase8.ld','-Map=phase8.map','-o','phase8.elf','objects/assembly/chunk_000.o','objects/assembly/caller.o','objects/c/'+target.symbol+'.o']);
const linked=p7.parseElfFile(path.join(out,'phase8.elf')),rom=fs.readFileSync(path.join(root,'build/baserom.us_rev0.z64'));
const artifact=suffix=>p7.parseElfFile(path.join(out,'objects/c/'+target.symbol+suffix)),nativeObject=artifact('.assembler-object.o'),derived=artifact('.source-object.o'),stripped=artifact('.o');
const body=e=>e.sections.find(s=>s.name===target.sectionName),census=e=>text.functionCensus(e,[body(e)],e===linked);
assert.deepEqual(census(nativeObject).map(f=>f.bytes),[320,268,168]);assert.equal(census(derived).length,4);assert.equal(census(stripped).length,4);assert.equal(census(linked).length,4);
const fallback=p7.parseElfFile(path.join(out,'comparison/original/chunk_000.o')),pruned=p7.parseElfFile(path.join(out,'objects/assembly/chunk_000.o'));
const proof=p.verifyEdgePhysicalOwner(target,fallback,pruned,stripped,linked,rom);p.verifyEdgeMap(target,fs.readFileSync(path.join(out,'phase8.map'),'utf8'));
const evidence=p.deriveSourceObjectProof(minimal,target,out,classification,linked,rom);p.validateSourceObjectProofBytes(evidence.proofBytes,evidence.proofBytes);
const verification={targets:[{symbol:target.symbol,physicalOwnerEvidence:proof}]};p.verifyRecordedEdgePadding(minimal,out,verification,{baserom:rom});p.verifyRecordedEdgePadding(minimal,out,verification,{elf:linked,baserom:rom});
const context=text.linkContext(out,rom,linked);const records=text.recordsForTarget(target,out,context);text.validateRecords(evidence.proof,records,'fixture CURRENT');text.finishLinkContext(context);
const caller=p7.elfSectionBytes(linked,linked.sections.find(s=>s.name===callerSlice.sectionName)).readUInt32BE(0),resolved=((callerSlice.vramStart&0xf0000000)|((caller&0x3ffffff)<<2))>>>0;assert.equal(resolved,target.vramStartNumber);
write('physical-interface-e2e.json',JSON.stringify({status:'pass',sourceClass:classification.class,native:census(nativeObject),derived:census(derived),stripped:census(stripped),linked:census(linked),nativeObjectSha256:p7.sha256Buffer(nativeObject.buffer),derivedObjectSha256:p7.sha256Buffer(derived.buffer),relocations:p.relocationRecords(nativeObject,target),proof,callerResolved:resolved,sourceProof:evidence.proof},null,2));



let controls=0;const rejected=(fn,re=/physical interface|interface|artifact|changed|drift|missing|census|symbol|table|relocation|provenance|reproducible|reconstruction|ENOENT/)=>{assert.throws(fn,re);controls++;};
const split=require('../tools/lib/elf_text_split'),descriptor=p.physicalInterface(target),bytes=Buffer.from(nativeObject.buffer);
const mutated=(fn)=>{const b=Buffer.from(bytes);fn(b);rejected(()=>split.appendPhysicalInterface(b,descriptor));};
const table=nativeObject.sections.find(s=>s.type===2),strings=nativeObject.sections[table.link],rel=nativeObject.sections.find(s=>s.type===9),primary=nativeObject.symbols.find(s=>s.name===target.symbol);
const at=table.offset+primary.symbolIndex*16;
const nonalloc=nativeObject.sections.find(s=>s.name==='.comment');assert(nonalloc);
// Exercise the production wrapper, including a known payload type forged into
// a table consumer: rejecting unknown types alone is insufficient.
for(const kind of ['hash','unknown','payload-consumer']){
 const b=Buffer.from(bytes);
 b.writeUInt32BE(kind==='hash'?5:kind==='unknown'?0x70000042:1,nonalloc.headerOffset+4);
 if(kind!=='unknown')b.writeUInt32BE(table.index,nonalloc.headerOffset+24);
 rejected(()=>p.projectPhysicalInterface(b,target));
}
mutated(b=>b.writeUInt32BE(nativeObject.header.shstrndx,table.headerOffset+24));
mutated(b=>b.writeUInt32BE(table.info+1,table.headerOffset+28));
mutated(b=>b.writeUInt32BE(11,strings.headerOffset+4));
mutated(b=>b.writeUInt32BE(2,strings.headerOffset+4));
mutated(b=>b.writeUInt32BE(0x70000005,strings.headerOffset+4));
mutated(b=>b.writeUInt32BE(18,strings.headerOffset+4));
mutated(b=>b.writeUInt32BE(strings.index,rel.headerOffset+24));
{const b=Buffer.from(bytes);b.writeUInt32BE(table.index,rel.headerOffset+28);rejected(()=>p.projectPhysicalInterface(b,target));}
mutated(b=>b.writeUInt32BE(0xffffffff,rel.offset+4));
mutated(b=>{b[at+12]=2;});
mutated(b=>b.writeUInt32BE(4,at+4));
mutated(b=>b.writeUInt32BE(0,at+8));
for(const field of ['binding','symbolType','visibility','bytes','offset','schemaVersion'])rejected(()=>split.appendPhysicalInterface(bytes,{...descriptor,[field]:99}));
rejected(()=>split.appendPhysicalInterface(bytes,{...descriptor,symbol:target.symbol}));
rejected(()=>split.appendPhysicalInterface(bytes,{...descriptor,symbol:nativeObject.symbols.find(s=>s.sectionIndex===0&&s.name).name}));
rejected(()=>split.appendPhysicalInterface(derived.buffer,descriptor));
rejected(()=>p.physicalInterface({...target,physicalInterface:{...descriptor,symbol:'forged'}}));
rejected(()=>p.physicalInterface({...target,physicalInterface:undefined}));
rejected(()=>p.physicalInterface({...target,row:{...target.row}}));
const cache=require('../tools/lib/diff_object_cache'),files=cache.outputArtifactFiles(out,target);
const lostAdmission={...target,row:{...target.row},physicalInterface:undefined};
rejected(()=>p.physicalInterface(lostAdmission));
rejected(()=>text.resolveTextContract(lostAdmission));
rejected(()=>cache.artifactSpecifications(lostAdmission));
assert.equal(p.physicalInterface({...lostAdmission,compilerTextFunctions:undefined}),null);
const nativeParsed=split.parseRelocatable(bytes),derivedBytes=fs.readFileSync(files['source-object.o']),derivedParsed=split.parseRelocatable(derivedBytes);
assert.equal(derivedParsed.sectionOffset,nativeParsed.sectionOffset);assert.equal(derivedParsed.sections.length,nativeParsed.sections.length);
for(const sh of nativeParsed.sections) {
 const after=derivedParsed.sections[sh.index];assert.equal(after.name,sh.name);
 if(![table.index,strings.index].includes(sh.index)) {assert.deepEqual(after,sh);assert(split.sectionBytes(bytes,sh).equals(split.sectionBytes(derivedBytes,after)));}
}
assert(derivedBytes.subarray(derivedParsed.sections[table.index].offset,derivedParsed.sections[table.index].offset+table.size).equals(bytes.subarray(table.offset,table.offset+table.size)));
assert.equal(derivedParsed.sections[table.index].info,table.info);
const identity=file=>({bytes:fs.statSync(file).size,sha256:p7.sha256File(file)});
const cacheOptions={phase8:whole,target,classification,compiler:local.compiler,verifiedCompiler:p.verifyCompiler(whole,local.compiler),assemblerPath:tools.assemblerAbs,objcopyPath:tools.objcopyAbs,assembler:identity(tools.assemblerAbs),objcopy:identity(tools.objcopyAbs),preprocessor:classification.preprocessor,cacheRoot:path.join(out,'cache')};
const cold=cache.compileOrReuseTarget({...cacheOptions,output:path.join(out,'cold')});assert.equal(cold.cache.status,'miss');
const warm=cache.compileOrReuseTarget({...cacheOptions,output:path.join(out,'warm')});assert.equal(warm.cache.status,'hit');controls+=2;
assert.equal(warm.compiled.objectEvidence.schemaVersion,16);assert(warm.compiled.assemblerObjectRelative);
const inspect=()=>cache.inspectCompiledTargetArtifacts({phase8:whole,target,classification,files});inspect();
const missing={...files};delete missing['assembler-object.o'];rejected(()=>cache.inspectCompiledTargetArtifacts({phase8:whole,target,classification,files:missing}));
const nativePath=files['assembler-object.o'],derivedPath=files['source-object.o'],linkedPath=path.join(out,'phase8.elf');
fs.renameSync(nativePath,nativePath+'.hidden');try{rejected(()=>p.deriveSourceObjectProof(minimal,target,out,classification,linked,rom));rejected(()=>p.verifyRecordedEdgePadding(minimal,out,verification,{baserom:rom}));rejected(()=>text.recordsForTarget(target,out,text.linkContext(out,rom)));rejected(inspect);}finally{fs.renameSync(nativePath+'.hidden',nativePath);}
const onDisk=(name,file,change,linkedOnly=false)=>{const saved=fs.readFileSync(file),bad=Buffer.from(saved);change(bad);fs.writeFileSync(file,bad);
 try{
   rejected(()=>p.deriveSourceObjectProof(minimal,target,out,classification,p7.parseElfFile(linkedPath),rom));
   rejected(()=>p.verifyRecordedEdgePadding(minimal,out,verification,{baserom:rom}));
   rejected(()=>text.recordsForTarget(target,out,text.linkContext(out,rom)));
   if(!linkedOnly)rejected(inspect);
 }finally{fs.writeFileSync(file,saved);}
};
const derivedMarker=derived.symbols.find(s=>s.name===descriptor.symbol),derivedTab=derived.sections[derivedMarker.symbolTableIndex];
for(const [name,offset,size,value]of [['type',12,1,0x11],['binding',12,1,0x02],['visibility',13,1,2],['size',8,4,4],['value',4,4,4],['section',14,2,0xfff1]]){
 const o=derivedTab.offset+derivedMarker.symbolIndex*16+offset;
 onDisk('derived '+name,derivedPath,b=>{if(size===1)b[o]=value;else if(size===2)b.writeUInt16BE(value,o);else b.writeUInt32BE(value,o);});
}
onDisk('native secondary binding',nativePath,b=>{const f=nativeObject.symbols.find(s=>s.name==='func_00006724');b[table.offset+f.symbolIndex*16+12]=0x12;});
onDisk('native REL index',nativePath,b=>b.writeUInt32BE(0xffffffff,rel.offset+4));
const linkedMarker=linked.symbols.find(s=>s.name===descriptor.symbol),linkedTab=linked.sections[linkedMarker.symbolTableIndex];
onDisk('linked size',linkedPath,b=>b.writeUInt32BE(4,linkedTab.offset+linkedMarker.symbolIndex*16+8),true);
onDisk('linked type',linkedPath,b=>{b[linkedTab.offset+linkedMarker.symbolIndex*16+12]=0x11;},true);
// Rehashed forged evidence cannot authorize bytes that the native input cannot derive.
const savedDerived=fs.readFileSync(derivedPath),bad=Buffer.from(savedDerived);bad[body(derived).offset]^=1;fs.writeFileSync(derivedPath,bad);
try{const forged=JSON.parse(JSON.stringify(records));forged.objectEvidence.artifacts.rawObject.sha256=p7.sha256Buffer(bad);forged.objectEvidence.physicalInterface.derivedObjectSha256=p7.sha256Buffer(bad);
 rejected(()=>text.validateRecords(forged,text.recordsForTarget(target,out,text.linkContext(out,rom)),'forged updated hashes'));}finally{fs.writeFileSync(derivedPath,savedDerived);}
const fallbackPath=path.join(out,'comparison/original/chunk_000.o'),physicalOriginal=fallback.symbols.find(s=>s.name===descriptor.symbol),originalTab=fallback.sections[physicalOriginal.symbolTableIndex];
for(const [offset,size,value]of [[4,4,4],[8,4,4],[12,1,0x02],[12,1,0x11],[13,1,2],[14,2,fallback.sections.find(s=>s.name===row.slices[1].sectionName).index]]){
 const saved=fs.readFileSync(fallbackPath),bad=Buffer.from(saved),at=originalTab.offset+physicalOriginal.symbolIndex*16+offset;
 if(size===1)bad[at]=value;else if(size===2)bad.writeUInt16BE(value,at);else bad.writeUInt32BE(value,at);fs.writeFileSync(fallbackPath,bad);
 try{rejected(()=>p.verifyEdgePhysicalOwner(target,p7.parseElfFile(fallbackPath),pruned,stripped,linked,rom));rejected(()=>p.verifyRecordedEdgePadding(minimal,out,verification,{baserom:rom}));rejected(()=>p.verifyRecordedEdgePadding(minimal,out,verification,{elf:linked,baserom:rom}));}finally{fs.writeFileSync(fallbackPath,saved);}
}
const old=JSON.parse(JSON.stringify(records));old.objectEvidence.schemaVersion=1;delete old.objectEvidence.physicalInterface;
rejected(()=>text.validateRecords(old,records,'stale pre-interface evidence'));
inspect();p.verifyRecordedEdgePadding(minimal,out,verification,{baserom:rom});
const summary={status:'pass',controls,out,nativeFunctions:3,derivedFunctions:4,relocations:p.relocationRecords(nativeObject,target).length,sourceClass:classification.class,fullOwnerExact:records.linkEvidence.fullOwnerExact};write('test-result.json',JSON.stringify(summary,null,2)+'\n');console.log(JSON.stringify(summary));return summary;
}
function main(){ return {status:'pass',retained:retainedScenario(),multiOwner:multiOwnerScenario()}; }
if(require.main===module)main();module.exports={main,multiOwnerScenario};

function multiOwnerScenario() {
  const whole = p.loadPhase8Model();
  const candidates = whole.targets.filter(t => t.multiOwner && t.textOwners[0].symbol !== t.symbol
    && t.compilerTextFunctions.length === 1 && !t.compilationGroup && !t.atomicText && !t.nativeTextTail
    && !t.auxiliaryProjection && !t.retainedLiteralReferences && !t.rows.some(row => row.retainedPadding));
  assert(candidates.length > 0, 'integrated different-name multi-owner producer must be present');
  const target = candidates[0], descriptor = p.multiOwnerPhysicalInterface(target);
  assert(descriptor); assert.equal(p.physicalInterface(target), null);
  const tc = native.assertToolchainAvailable(native.loadToolchainConfig());
  const local = JSON.parse(fs.readFileSync(path.join(p7.ROOT, 'config/local-tools.json')));
  const sourcePolicy = require('../tools/lib/source_policy').classifyTargetSources([target]);
  const classification = sourcePolicy.targets[0];
  assert.equal(classification.class, 'PURE_C');
  const out = fs.mkdtempSync(path.join(p7.ROOT, 'build/pi-multi-'));
  const write = (name, data) => { const file = path.join(out, name); fs.mkdirSync(path.dirname(file), {recursive:true}); fs.writeFileSync(file, data); };
  const run = (exe, args) => native.runTool(exe, args, {cwd:out});
  const strip = ['--remove-section=.reginfo','--remove-section=.pdr','--remove-section=.comment','--remove-section=.note'];
  const objects = [], chunks = [...new Set(target.rows.map(row => row.part.chunkIndex))];
  for (const chunk of chunks) {
    const name = 'chunk_' + String(chunk).padStart(3, '0');
    const rows = target.rows.filter(row => row.part.chunkIndex === chunk);
    write(name + '.s', rows.map(row => require('../tools/build_phase7_conventional').transformTrackedPartSource(row, fs.readFileSync(path.join(p7.ROOT, row.part.file)))).join('\n'));
    run(tc.assemblerAbs, [...tc.assemblerFlags, '-o', name+'.raw.o', name+'.s']);
    const relative = 'objects/assembly/'+name+'.o';
    fs.mkdirSync(path.join(out, 'phase7/objects/assembly'), {recursive:true});
    run(tc.objcopyAbs, [...strip, ...rows.flatMap(row => row.slices.flatMap(s => ['--set-section-flags', s.sectionName+'=alloc,load,code,readonly,data,contents'])), name+'.raw.o', 'phase7/'+relative]);
    const file = path.join(out, 'phase7', relative);
    objects.push({path:relative,bytes:fs.statSync(file).size,sha256:p7.sha256File(file)});
  }
  const minimal = {...whole, targets:[target], model:{...whole.model, rows:target.rows,
    slices:target.rows.flatMap(row => row.slices), overlays:[], nonDescriptorLoadSlabs:[]}};
  const phase7 = {files:{objectManifest:path.join(out,'phase7/objects/manifest.json')},objectManifest:{objects}};
  const copied = p.copyPhase7Objects(minimal, phase7, out, tc.objcopyAbs);
  const compiled = p.compileTarget(whole, target, out, local.compiler, tc.assemblerAbs, tc.objcopyAbs, {classification});
  const read = suffix => p7.parseElfFile(path.join(out, 'objects/c/'+target.symbol+suffix));
  const raw = read('.assembler-object.o'), derived = read('.source-object.o'), stripped = read('.o');
  const projected = p.projectMultiOwnerPhysicalInterface(raw.buffer, target);
  assert(projected.buffer.equals(derived.buffer));
  const split = p7.parseElf32BigEndian(projected.splitResult.buffer);
  const stage = (elf, linked=false) => {
    const first = elf.sections.find(s => s.name === target.sectionName);
    const functions = p.verifyCompilerTextFunctions(elf, target, first, linked);
    assert.equal(functions.length, 1);
    return p.verifyMultiOwnerPhysicalInterface(elf, target, linked);
  };
  assert.equal(raw.symbols.filter(s => s.symbolType === 2 && s.sectionIndex !== 0).length, 1);
  assert(!split.symbols.some(s => s.name === descriptor.symbol));
  stage(derived); stage(stripped);
  for (const owner of target.textOwners) {
    const name = 'chunk_'+String(owner.chunkIndex).padStart(3,'0')+'.o';
    const fallback = p7.parseElfFile(path.join(out,'comparison/original',name));
    const pruned = p7.parseElfFile(path.join(out,'objects/assembly',name));
    const symbol = fallback.symbols.find(s => s.name === owner.symbol);
    assert(symbol && symbol.size === 0 && symbol.binding === 1 && symbol.symbolType === 2);
    assert(!pruned.symbols.some(s => s.name === owner.symbol && s.sectionIndex !== 0));
  }
  const callerName = 'fixture_multi_owner_caller', callerSection = '.ob64.r9000';
  write('caller.s', '.set noat\n.set noreorder\n.section '+callerSection+',"ax",@progbits\n.align 2\n.globl '+callerName+'\n.type '+callerName+',@function\n'+callerName+':\n'+target.textOwners.map(owner=>'jal '+owner.symbol+'\nnop\n').join('')+'jr $31\nnop\n.size '+callerName+',.-'+callerName+'\n');
  run(tc.assemblerAbs,[...tc.compilerAssemblerFlags,'-o','caller.raw.o','caller.s']);
  run(tc.objcopyAbs,[...strip,'caller.raw.o','objects/assembly/caller.o']);
  const callerBytes = (target.textOwners.length+1)*8;
  const callerSlice = {ordinal:9000,rowIndex:9000,sectionName:callerSection,phdrName:'p9000',sliceIndex:0,sliceCount:1,
    romStart:0x1000,romEndExclusive:0x1000+callerBytes,bytes:callerBytes,vramStart:0x80001000,vramEndExclusive:0x80001000+callerBytes,executable:true};
  minimal.model = {...minimal.model,slices:[...minimal.model.slices,callerSlice]};
  let script = p.renderPhase8LinkerScript(minimal,{linkedObjects:[{path:'objects/c/'+target.symbol+'.o',ownerKind:'matching-c-target',targetSymbol:target.symbol}]});
  script = script.replace('    *('+callerSection+')','    objects/assembly/caller.o('+callerSection+')');
  write('linker/phase8.ld',script);
  const linkArgs = [...tc.linkerFlags,'-T','linker/phase8.ld','-Map=phase8.map','-o','phase8.elf',...objects.map(o=>o.path),'objects/assembly/caller.o','objects/c/'+target.symbol+'.o'];
  run(tc.toolsAbs.linker,linkArgs);
  const rom=fs.readFileSync(path.join(p7.ROOT,'build/baserom.us_rev0.z64'));
  const linked=p7.parseElfFile(path.join(out,'phase8.elf'));stage(linked,true);
  const caller=p7.elfSectionBytes(linked,linked.sections.find(s=>s.name===callerSection));
  target.textOwners.forEach((owner,i)=>assert.equal(((callerSlice.vramStart&0xf0000000)|((caller.readUInt32BE(i*8)&0x3ffffff)<<2))>>>0,owner.vramStartNumber));
  // Use the complete authenticated model/registries for the real proof consumer.
  // Only its target set is bounded; the linked fixture remains diagnostic.
  const proofModel = {...whole, targets:[target]}, compiledBySymbol = new Map([[target.symbol,compiled]]);
  write('phase7/layout.json',JSON.stringify({owners:target.rows}));
  p.writeLayout(proofModel,{...phase7,files:{...phase7.files,layout:path.join(out,'phase7/layout.json')}},out,copied.replacements,{compiledBySymbol});
  p.writeObjectManifest(out,[...copied.linkedObjects,'objects/assembly/caller.o'],proofModel,copied.replacements,compiledBySymbol);
  p.writeSourceObjectProofs(proofModel,{output:out,sourcePolicy,compiled:compiledBySymbol});
  const proof=p.deriveSourceObjectProof(proofModel,target,out,classification,linked,rom);
  p.validateSourceObjectProofBytes(proof.proofBytes,proof.proofBytes);
  const proofRelative='generated/c/'+target.symbol+'.source-object-proof.json';
  assert(fs.readFileSync(path.join(out,proofRelative)).equals(proof.proofBytes));
  const verifyProof=()=>p.verifySourceObjectProofs(proofModel,{output:out});
  const verifiedProof=verifyProof();
  assert.equal(verifiedProof.targets.length,1);
  assert.equal(verifiedProof.targets[0].proof.sha256,p7.sha256Buffer(proof.proofBytes));
  const recorded=()=>{const context=text.linkContext(out,rom);try{return text.recordsForTarget(target,out,context);}finally{text.finishLinkContext(context);}};
  const records=recorded();text.validateRecords(proof.proof,records,'multi-owner recorded evidence');
  assert(records.linkEvidence.fullOwnerExact);
  assert.equal(records.objectEvidence.schemaVersion,24);
  assert.equal(records.objectEvidence.multiOwnerPhysicalInterface.splitIntermediateSha256,p7.sha256Buffer(projected.splitResult.buffer));
  let controls=0;
  const reject=fn=>{assert.throws(fn);controls++;};
  const proofConsumerRejections=[];
  const rejectProof=(name,fn,expected)=>{assert.throws(fn,error=>{assert.match(error.message,expected);proofConsumerRejections.push({name,error:error.message});return true;});controls++;};
  const staleProof=structuredClone(proof.proof);staleProof.objectEvidence.schemaVersion=19;
  const staleBytes=Buffer.from(JSON.stringify(staleProof));
  assert.throws(()=>p.validateSourceObjectProofBytes(staleBytes,staleBytes),/retained literal references: proof binding schema/);
  controls++;
  // Rehash the recorded representation too: a forged report cannot authorize it.
  const alterProofRecords=(alter,check)=>{
    const paths=[proofRelative,'layout.json','objects/manifest.json'];
    const saved=paths.map(name=>fs.readFileSync(path.join(out,name)));
    const value=JSON.parse(saved[0]),layout=JSON.parse(saved[1]),manifest=JSON.parse(saved[2]);
    alter(value);
    Object.assign(layout.phase8MatchingCTargets.find(r=>r.symbol===target.symbol),{textContract:value.textContract,objectEvidence:value.objectEvidence,linkEvidence:value.linkEvidence});
    Object.assign(manifest.linkedObjects.find(r=>r.targetSymbol===target.symbol&&r.ownerKind==='matching-c-target'),{textContract:value.textContract,objectEvidence:value.objectEvidence});
    try{[value,layout,manifest].forEach((record,i)=>write(paths[i],JSON.stringify(record,null,2)+'\n'));check();}
    finally{paths.forEach((name,i)=>write(name,saved[i]));}
  };
  alterProofRecords(value=>{value.objectEvidence.schemaVersion=16;},()=>rejectProof('crossed head schema16',verifyProof,/layout objectEvidence drift/));
  alterProofRecords(value=>{value.objectEvidence.multiOwnerPhysicalInterface.splitIntermediateSha256='0'.repeat(64);},()=>rejectProof('forged split-intermediate hash',verifyProof,/layout objectEvidence drift/));
  for(const suffix of ['.assembler-object.o','.source-object.o']){
    const file=path.join(out,'objects/c/'+target.symbol+suffix);
    fs.renameSync(file,file+'.hidden');
    try{rejectProof('missing '+suffix,verifyProof,suffix==='.assembler-object.o'?/unsplit assembler object is missing/:/matching C object is missing/);}finally{fs.renameSync(file+'.hidden',file);}
  }
  const tamperedPath=path.join(out,'objects/c/'+target.symbol+'.source-object.o'),originalDerived=fs.readFileSync(tamperedPath),tampered=Buffer.from(originalDerived);
  tampered[derived.sections.find(s=>s.name===target.sectionName).offset]^=1;
  fs.writeFileSync(tamperedPath,tampered);
  try{alterProofRecords(value=>{
    const hash=p7.sha256Buffer(tampered);
    value.artifacts.object.sha256=hash;
    value.objectEvidence.artifacts.rawObject.sha256=hash;
    value.objectEvidence.multiOwnerPhysicalInterface.derivedObjectSha256=hash;
  },()=>rejectProof('rehashed derived-object tamper',verifyProof,/accepted-owner split is not independently reproducible/));}
  finally{fs.writeFileSync(tamperedPath,originalDerived);}
  assert.equal(verifyProof().targets[0].proof.sha256,verifiedProof.targets[0].proof.sha256);
  const authority=require('../tools/lib/logical_functions');
  reject(()=>authority.bindMultiOwnerPhysicalInterfaces(whole));
  for(const forged of [{...target},{...target,multiOwnerPhysicalInterface:undefined},{...target,multiOwnerContract:{...target.multiOwnerContract}},structuredClone(target)]) reject(()=>p.multiOwnerPhysicalInterface(forged));
  reject(()=>p.multiOwnerPhysicalInterface({...target,multiOwnerPhysicalInterface:undefined,multiOwner:false,multiOwnerContract:null,
    textOwners:target.textOwners.map((owner,i)=>i===0?{...owner,symbol:target.symbol}:owner)}));
  for(const key of ['multiOwnerPhysicalInterface','multiOwnerContract','rows','textOwners','compilerTextFunctions']) {
    const old=target[key];target[key]=key==='multiOwnerPhysicalInterface'?undefined:structuredClone(old);
    if(key==='compilerTextFunctions')target[key][0].bytes-=4;
    try{reject(()=>p.multiOwnerPhysicalInterface(target));}finally{target[key]=old;}
  }
  const oldBytes=target.textOwners[0].bytes;target.textOwners[0].bytes+=4;
  try{reject(()=>p.multiOwnerPhysicalInterface(target));}finally{target.textOwners[0].bytes=oldBytes;}
  const change = (object,key,value,check) => {const old=object[key];object[key]=value;try{reject(check);}finally{object[key]=old;}};
  change(target.multiOwnerPhysicalInterface,'symbol','forged_head',()=>p.multiOwnerPhysicalInterface(target));
  change(target.multiOwnerContract,'bytes',target.bytes+4,()=>p.multiOwnerPhysicalInterface(target));
  change(target.rows[1],'romEndExclusive',target.rows[1].romEndExclusive+4,()=>p.multiOwnerPhysicalInterface(target));
  change(whole.multiOwnerConfigIdentity,'sha256','0'.repeat(64),()=>p.multiOwnerPhysicalInterface(target));
  const plain=whole.targets.find(t=>t.multiOwner&&t.textOwners[0].symbol===t.symbol);assert(plain);
  assert.equal(p.multiOwnerPhysicalInterface(plain),null);
  reject(()=>text.resolveTextContract({...plain,multiOwnerPhysicalInterface:descriptor}));
  const elfSplit=require('../tools/lib/elf_text_split');
  for(const name of [...target.textOwners.map(o=>o.symbol),'fixture_unknown_function']) {
    const bad=elfSplit.appendPhysicalInterface(raw.buffer,{schemaVersion:1,kind:'registered-primary-physical-interface',symbol:name,primary:target.symbol,sectionName:target.sectionName,offset:0,bytes:0,binding:1,symbolType:2,visibility:0}).buffer;
    reject(()=>p.projectMultiOwnerPhysicalInterface(bad,target));
    const parsed=p7.parseElf32BigEndian(bad),marker=parsed.symbols.find(s=>s.name===name);
    for(const info of name==='fixture_unknown_function'?[]:[0x00,0x20,0x11]){const altered=Buffer.from(bad);altered[parsed.sections[marker.symbolTableIndex].offset+marker.symbolIndex*16+12]=info;reject(()=>p.projectMultiOwnerPhysicalInterface(altered,target));}
  }
  const fn=raw.symbols.find(s=>s.name===target.symbol),tab=raw.sections[fn.symbolTableIndex],at=tab.offset+fn.symbolIndex*16;
  for(const [offset,size,value]of [[4,4,4],[8,4,target.bytes-4],[12,1,0x02],[12,1,0x11],[13,1,2],[14,2,0xfff1]]) {
    const bad=Buffer.from(raw.buffer);if(size===1)bad[at+offset]=value;else if(size===2)bad.writeUInt16BE(value,at+offset);else bad.writeUInt32BE(value,at+offset);
    reject(()=>p.projectMultiOwnerPhysicalInterface(bad,target));
  }
  const rel=raw.sections.find(s=>s.name==='.rel'+target.sectionName);assert(rel);
  const badRel=Buffer.from(raw.buffer);badRel.writeUInt32BE(0xffffff05,rel.offset+4);reject(()=>p.projectMultiOwnerPhysicalInterface(badRel,target));
  const cache=require('../tools/lib/diff_object_cache'),identity=file=>({bytes:fs.statSync(file).size,sha256:p7.sha256File(file)});
  const options={phase8:whole,target,classification,compiler:local.compiler,verifiedCompiler:p.verifyCompiler(whole,local.compiler),assemblerPath:tc.assemblerAbs,objcopyPath:tc.objcopyAbs,assembler:identity(tc.assemblerAbs),objcopy:identity(tc.objcopyAbs),preprocessor:classification.preprocessor,cacheRoot:path.join(out,'cache')};
  for(const status of ['miss','hit']) assert.equal(cache.compileOrReuseTarget({...options,output:path.join(out,status)}).cache.status,status);
  const files=cache.outputArtifactFiles(out,target),inspect=()=>cache.inspectCompiledTargetArtifacts({phase8:whole,target,classification,files});inspect();
  const artifactChange=(file,alter,checks)=>{const saved=fs.readFileSync(file),bad=Buffer.from(saved);alter(bad);fs.writeFileSync(file,bad);try{for(const check of checks)reject(check);}finally{fs.writeFileSync(file,saved);}};
  const marker=derived.symbols.find(s=>s.name===descriptor.symbol),markerAt=derived.sections[marker.symbolTableIndex].offset+marker.symbolIndex*16;
  for(const [offset,size,value]of [[4,4,4],[8,4,4],[12,1,0x02],[12,1,0x11],[13,1,2],[14,2,0xfff1]]){
    artifactChange(files['source-object.o'],b=>{if(size===1)b[markerAt+offset]=value;else if(size===2)b.writeUInt16BE(value,markerAt+offset);else b.writeUInt32BE(value,markerAt+offset);},[inspect,recorded]);
  }
  const linkedMarker=linked.symbols.find(s=>s.name===descriptor.symbol),linkedAt=linked.sections[linkedMarker.symbolTableIndex].offset+linkedMarker.symbolIndex*16;
  artifactChange(path.join(out,'phase8.elf'),b=>b.writeUInt16BE(0xfff1,linkedAt+14),[recorded]);
  for(const [i,owner] of target.textOwners.entries()){
    const object=objects.find(o=>o.path.endsWith('chunk_'+String(owner.chunkIndex).padStart(3,'0')+'.o'));
    const file=path.join(out,'phase7',object.path),original=p7.parseElfFile(file),symbol=original.symbols.find(s=>s.name===owner.symbol);
    artifactChange(file,b=>b.writeUInt32BE(4,original.sections[symbol.symbolTableIndex].offset+symbol.symbolIndex*16+8),[()=>{
      const manifest={...phase7,objectManifest:{objects:objects.map(o=>({...o,sha256:p7.sha256File(path.join(out,'phase7',o.path))}))}};
      p.copyPhase7Objects(minimal,manifest,path.join(out,'bad-fallback-'+i),tc.objcopyAbs);
    }]);
  }
  const derivedPath=files['source-object.o'],saved=fs.readFileSync(derivedPath),bad=Buffer.from(saved);
  bad[derived.sections.find(s=>s.name===target.sectionName).offset]^=1;fs.writeFileSync(derivedPath,bad);
  try{reject(inspect);reject(recorded);reject(()=>p.deriveSourceObjectProof(minimal,target,out,classification,linked,rom));
    const forged=structuredClone(records);forged.objectEvidence.artifacts.rawObject.sha256=p7.sha256Buffer(bad);
    forged.objectEvidence.multiOwnerPhysicalInterface.derivedObjectSha256=p7.sha256Buffer(bad);
    reject(()=>text.validateRecords(forged,recorded(),'rehashed derived evidence'));
  }finally{fs.writeFileSync(derivedPath,saved);}
  const stale=structuredClone(records);delete stale.objectEvidence.multiOwnerPhysicalInterface;stale.objectEvidence.schemaVersion=1;
  reject(()=>text.validateRecords(stale,recorded(),'old plain multi-owner evidence'));
  const staleIntermediate=structuredClone(records);staleIntermediate.objectEvidence.multiOwnerPhysicalInterface.splitIntermediateSha256='0'.repeat(64);
  reject(()=>text.validateRecords(staleIntermediate,recorded(),'forged split intermediate'));
  // Compile a real altered C source independently; it cannot borrow canonical authority.
  const source=fs.readFileSync(path.join(p7.ROOT,target.source),'utf8');
  const entry=new RegExp('\\b'+target.symbol+'\\s*\\([^)]*\\)\\s*\\{').exec(source);assert(entry);
  const bodyStart=entry.index+entry[0].length,number=/\b[1-9][0-9]*[uUlL]*\b/.exec(source.slice(bodyStart));assert(number);
  const numberStart=bodyStart+number.index;
  write('nonmatch.c',source.slice(0,numberStart)+String(parseInt(number[0],10)+1)+number[0].replace(/[0-9]/g,'')+source.slice(numberStart+number[0].length));
  const nonmatchSource=path.relative(p7.ROOT,path.join(out,'nonmatch.c')).replace(/\\/g,'/');
  const nonmatch=require('../tools/lib/source_policy').classifyTargetSources([{symbol:target.symbol,source:nonmatchSource,bytes:target.bytes}]).targets[0];assert.equal(nonmatch.class,'PURE_C');
  write('nonmatch.i.c',require('../tools/lib/source_policy').compilationInputBytes(nonmatch));
  run(local.compiler,[...whole.config.compiler.compileFlags,'-o','nonmatch.compiler.s','nonmatch.i.c']);
  write('nonmatch.s',p.adjustSectionAssembly(fs.readFileSync(path.join(out,'nonmatch.compiler.s')),target.sectionName));
  run(tc.assemblerAbs,[...tc.compilerAssemblerFlags,'-o','nonmatch.raw.o','nonmatch.s']);
  const altered=p7.parseElfFile(path.join(out,'nonmatch.raw.o'));
  assert(!p7.elfSectionBytes(altered,altered.sections.find(s=>s.name===target.sectionName)).equals(p7.elfSectionBytes(raw,raw.sections.find(s=>s.name===target.sectionName))));
  let nonmatchProjection;
  try{nonmatchProjection=p.projectMultiOwnerPhysicalInterface(altered.buffer,target);}catch(error){assert.match(error.message,/raw compiler census|relocation contract drift/);controls++;}
  if(nonmatchProjection){
    write('nonmatch.projected.o',nonmatchProjection.buffer);run(tc.objcopyAbs,[...strip,'nonmatch.projected.o','nonmatch.o']);
    const objectPath=path.join(out,'objects/c/'+target.symbol+'.o'),original=fs.readFileSync(objectPath);fs.copyFileSync(path.join(out,'nonmatch.o'),objectPath);
    try{run(tc.toolsAbs.linker,linkArgs.map(arg=>arg==='phase8.elf'?'nonmatch.elf':arg==='-Map=phase8.map'?'-Map=nonmatch.map':arg));
      const changed=p7.parseElfFile(path.join(out,'nonmatch.elf'));
      assert(target.textOwners.some(owner=>!p7.elfSectionBytes(changed,changed.sections.find(s=>s.name===owner.sectionName)).equals(rom.subarray(owner.romStartNumber,owner.romEndNumber))));controls++;
    }finally{fs.writeFileSync(objectPath,original);}
  }
  inspect();
  const summary={status:'pass',out,controls,sourceClass:classification.class,logicalBytes:target.bytes,physicalOwnerBytes:target.textOwners.map(o=>o.bytes),splitIntermediateSha256:projected.splitIntermediateSha256,fullOwnerExact:records.linkEvidence.fullOwnerExact,cache:['miss','hit'],objectEvidenceSchema:24,proofConsumer:{directByteValidation:true,independentVerification:true,proof:verifiedProof.targets[0].proof,stale19Rejected:true,rejections:proofConsumerRejections}};
  write('multi-owner-interface-result.json',JSON.stringify({summary,compiled,records},null,2)+'\n');
  console.log(JSON.stringify(summary));return summary;
}

