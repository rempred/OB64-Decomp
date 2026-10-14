'use strict';
// Production PURE_C path exercised in isolated fixture output; not wave acceptance.
const fs=require('fs'),path=require('path'),assert=require('assert');
const p7=require('../tools/lib/phase7_conventional'),p=require('../tools/lib/phase8_matching_c'),native=require('../tools/lib/real_mips_toolchain'),text=require('../tools/lib/text_contract');
function main(){
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
if(require.main===module)main();module.exports={main};

