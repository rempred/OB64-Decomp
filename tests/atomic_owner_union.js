#!/usr/bin/env node
'use strict';
const assert=require('assert/strict'),fs=require('fs'),path=require('path');
const p7=require('../tools/lib/phase7_conventional'),p8=require('../tools/lib/phase8_matching_c');
const active=require('../tools/lib/active_targets'),atomic=require('../tools/lib/atomic_owner_union');
const logical=require('../tools/lib/logical_functions'),aux=require('../tools/lib/auxiliary_projection');
const policy=require('../tools/lib/source_policy'),cache=require('../tools/lib/diff_object_cache');
const groups=require('../tools/lib/compilation_groups'),split=require('../tools/lib/elf_text_split');
const {assertToolchainAvailable,loadToolchainConfig,runTool}=require('../tools/lib/real_mips_toolchain');
const {ROOT,hex,sha256Buffer:hash}=p7,context=active.loadActiveTargetModel();
const local=JSON.parse(fs.readFileSync(path.join(ROOT,'config/local-tools.json')));
const verifiedCompiler=p8.verifyCompiler(context,local.compiler),tools=assertToolchainAvailable(loadToolchainConfig());
const root=fs.mkdtempSync(path.join(ROOT,'build/tests/atomic-owner-'));
const report=[];
function cases(n,m){return Array.from({length:n},(_,i)=>`case ${i}: result += external_call(${i*m+11}); break;`).join('\n');}
const source=`extern int external_call(int); extern int external_state;\nint atomic_fixture(int a,int b,int c) { int result=external_state; switch(a) {${cases(8,3)} default:result+=1;} result+=external_state; switch(b) {${cases(7,7)} default:result+=2;} switch(c) {${cases(5,11)} default:result+=3;} return result+external_state+1; }\n`;
function exercise(base,external){
 const roBase=Math.ceil(base/8)*8+0x10000;
 const dir=path.join(root,base.toString(16));fs.mkdirSync(dir);
 const sourceFile=path.join(dir,'fixture.c');fs.writeFileSync(sourceFile,source);
 const sourceRelative=path.relative(ROOT,sourceFile).replace(/\\/g,'/');
 let classifications=policy.classifyTargetSources([{symbol:'atomic_fixture',source:sourceRelative,bytes:4}]),classification=classifications.targets[0];assert.equal(classification.class,'PURE_C');
 const input=path.join(dir,'input.c'),compilerFile=path.join(dir,'compiler.s');fs.writeFileSync(input,policy.compilationInputBytes(classification));
 p7.run(local.compiler,[...context.config.compiler.compileFlags,'-o',compilerFile,input]);
 const compiler=fs.readFileSync(compilerFile),adjusted=p8.adjustSectionAssembly(compiler,'.ob64.r0001',{allowAuxiliaryReadOnlySections:true});
 const assembly=path.join(dir,'assembler.s'),object=path.join(dir,'assembler.o');fs.writeFileSync(assembly,adjusted);
 runTool(tools.assemblerAbs,[...tools.compilerAssemblerFlags,'-o',object,assembly]);
 const elf=p7.parseElfFile(object),text=elf.sections.find(s=>s.name==='.ob64.r0001'),ro=elf.sections.find(s=>s.name==='.rodata');
 const fn=elf.symbols.filter(s=>s.symbolType===2);assert.equal(fn.length,1);assert.equal(fn[0].size,text.size);assert.equal(text.alignment,4);
 const rels=groups.relocations(elf),textRels=rels.filter(r=>r.owner.index===text.index);
 const low=textRels.find((r,i)=>r.type===6&&textRels[i-1]?.type===5&&textRels[i-1].symbol.name===r.symbol.name&&textRels[i-1].place+4===r.place&&r.symbol.name==='external_state'&&r.place>text.size/4&&r.place<text.size*3/4);
 assert(low,'actual adjacent HI/LO pair');const cut=low.place;
 const occurrences=[...compiler.toString().matchAll(/\.section\s+\.rodata([^]*?)\s\.text/g)].map(m=>({label:/(\.L\d+):/.exec(m[1])[1],bytes:[...m[1].matchAll(/\.word/g)].length*4,alignmentDirectives:[...m[1].matchAll(/\.align\s+(\d+)/g)].map(m=>Number(m[1]))}));
 assert.deepEqual(occurrences.map(o=>o.bytes),[32,28,20]);let cursor=0;for(const o of occurrences){cursor=Math.ceil(cursor/8)*8;o.offset=cursor;cursor+=o.bytes;}
 assert.equal(ro.size,88);assert.equal(ro.alignment,8);
 const externs=`external_call = ${hex(base-0x1000)};\nexternal_state = ${hex(external)};\n`;
 const nativeLd=`OUTPUT_ARCH(mips)\nSECTIONS { .ob64.r0001 ${hex(base)} : AT(0x100) { *(.ob64.r0001) } .rodata ${hex(roBase)} : AT(0x1000) { *(.rodata) } /DISCARD/ : { *(.reginfo) *(.pdr) *(.comment) *(.note) } }\n`+externs;
 fs.writeFileSync(path.join(dir,'native.ld'),nativeLd);runTool(tools.toolsAbs.linker,['-T',path.join(dir,'native.ld'),'-o',path.join(dir,'native.elf'),object]);
 const native=p7.parseElfFile(path.join(dir,'native.elf')),rom=Buffer.alloc(0x2000);
 p7.elfSectionBytes(native,native.sections.find(s=>s.name==='.ob64.r0001')).copy(rom,0x100);
 p7.elfSectionBytes(native,native.sections.find(s=>s.name==='.rodata')).copy(rom,0x1000);
 function row(index,start,bytes,vram,code,name){const file=path.join(dir,'original-'+index+'.s');fs.writeFileSync(file,`.text\n.globl ${name}\n${name}:\n`+Array.from({length:bytes/4},(_,i)=>'.word '+hex(rom.readUInt32BE(start+i*4))).join('\n')+'\n');const relative=path.relative(ROOT,file).replace(/\\/g,'/');return {index,primaryId:'fixture:'+index,primaryClass:code?'code':'data',ambiguous:false,inputKind:'tracked-assembly',romStart:start,romEndExclusive:start+bytes,bytes,
  part:{file:relative,sha256:p7.sha256File(file),textBytes:fs.statSync(file).size,chunkIndex:index,name,symbolByteOffset:0},slices:[{sectionName:'.ob64.r'+String(index).padStart(4,'0'),executable:code,bytes,romStart:start,romEndExclusive:start+bytes,vramStart:vram,vramEndExclusive:vram+bytes,placementKind:'overlay',overlayDescriptorId:99,overlaySection:code?'text':'data-rodata',loadSlabId:null}]};}
 const rows=[row(1,0x100,cut,base,true,'atomic_fixture'),row(2,0x100+cut,text.size-cut,base+cut,true,'physical_continuation')];
 const data=[row(10,0x1000,64,roBase,false,'table_one'),row(11,0x1040,24,roBase+64,false,'table_two')];
 const model={config:{profile:'fixture',rom:{bytes:rom.length,sha256:hash(rom)}},rows:[...rows,...data],overlays:[]};model.slices=model.rows.flatMap(r=>r.slices);
 const originalBody={symbol:'atomic_fixture',aliases:[],romStart:0x100,romEndExclusive:0x100+text.size,expectedBytesSha256:hash(rom.subarray(0x100,0x100+text.size)),fragments:logical.intersections(model,0x100,0x100+text.size),evidence:{status:'supported-logical-continuation',rationale:'Independent fixture original image owns one complete original body across archival row cut; fixture authority only.'}};
 const registry=logical.loadRegistry(model,rom,{schemaVersion:1,profile:'fixture',bodies:[originalBody],padding:[],unavailableBodies:[],preservedProductionEnvelopes:[]});
 const owners=rows.map((r,i)=>({ownerIndex:i,sectionName:r.slices[0].sectionName,symbol:r.part.name,rowIndex:r.index,primaryId:r.primaryId,chunkIndex:r.part.chunkIndex,logicalOffset:r.romStart-0x100,logicalEnd:r.romEndExclusive-0x100,bytes:r.bytes,romStartNumber:r.romStart,romEndNumber:r.romEndExclusive,vramStartNumber:r.slices[0].vramStart,vramEndNumber:r.slices[0].vramEndExclusive,expectedTextSha256:hash(rom.subarray(r.romStart,r.romEndExclusive)),originalAssembly:r.part.file,originalAssemblySha256:r.part.sha256,row:r}));
 const rawRo=p7.elfSectionBytes(elf,ro),sections=data.map((r,i)=>{const offset=i?64:0,entries=i?5:15,bytes=r.bytes,raw=rawRo.subarray(offset,offset+bytes),s=r.slices[0];return {kind:'switch-table',compilerSection:'.rodata',outputSection:s.sectionName,sectionType:'SHT_PROGBITS',sectionFlags:['SHF_ALLOC'],alignment:8,romStart:hex(r.romStart),romEndExclusive:hex(r.romEndExclusive),vramStart:hex(s.vramStart),vramEndExclusive:hex(s.vramEndExclusive),bytes,entries,expectedObjectSha256:hash(raw),expectedLinkedSha256:hash(rom.subarray(r.romStart,r.romEndExclusive)),preservedTail:null,trailingPaddingBytes:4,expectedTrailingPaddingSha256:hash(Buffer.alloc(4)),expectedRelocations:Array.from({length:entries},(_,j)=>({offset:hex(j*4),type:'R_MIPS_32',symbol:'.text',addend:hex(raw.readUInt32BE(j*4)),section:'.rel.rodata'}))};});
 const projection={schemaVersion:4,mode:'fixed-row-readonly-projection',compilerSection:'.rodata',bytes:88,alignment:8,expectedObjectSha256:hash(rawRo),segments:data.map((r,i)=>({kind:'payload',offset:i?64:0,bytes:r.bytes,outputSection:r.slices[0].sectionName,occurrences:i?[occurrences[2]]:occurrences.slice(0,2)}))};
 const target={...owners[0],symbol:'atomic_fixture',source:sourceRelative,sourceSha256:p7.sha256File(sourceFile),bytes:text.size,romEndNumber:0x100+text.size,vramEndNumber:base+text.size,expectedTextSha256:originalBody.expectedBytesSha256,textOwners:owners,multiOwner:true,rows,row:rows[0],model,atomicText:{schemaVersion:1,mode:atomic.MODE,alignment:4},auxiliaryProjection:projection,auxiliarySections:[],compilerTextFunctionsExplicit:true,compilerTextFunctions:[{symbol:'atomic_fixture',offset:hex(0),offsetNumber:0,bytes:text.size,binding:'GLOBAL',entryEvidence:'owner'}],legacyAncillaryRelocations:[],expectedRelocations:[],overlayDescriptorId:99,descriptorRawSha256:'0'.repeat(64)};
 atomic.bind(target,registry);target.auxiliarySections=active.resolveAuxiliarySectionContracts(model,rom,target,active.normalizeAuxiliarySectionContracts(sections,target.symbol,'fixture',projection));target.auxiliaryProjectionRetained=aux.retainedBindings(target,model,rom);
 const productionInput=aux.assembly(compiler,target,p8.adjustSectionAssembly),productionAsm=path.join(dir,'production.s'),productionObj=path.join(dir,'production.o');fs.writeFileSync(productionAsm,productionInput);runTool(tools.assemblerAbs,[...tools.compilerAssemblerFlags,'-o',productionObj,productionAsm]);
 const production=p7.parseElfFile(productionObj),projected=atomic.project(production.buffer,target),projectedElf=p7.parseElf32BigEndian(projected.buffer);
 target.expectedRelocations=p8.relocationRecords(projectedElf,target);
 assert.throws(()=>split.splitRelocatableTextSection(production.buffer,target.sectionName,owners.map(o=>({sectionName:o.sectionName,bytes:o.bytes,symbol:o.symbol,symbolSize:o.ownerIndex?0:text.size}))),/pairing crosses/);
 classifications=policy.classifyTargetSources([target]);classification=classifications.targets[0];
 const output=path.join(dir,'compiled');fs.mkdirSync(output);
 const compiled=p8.compileTarget({...context,targets:[target]},target,output,local.compiler,tools.assemblerAbs,tools.objcopyAbs,{classification});
 assert.deepEqual(compiled,cache.inspectCompiledTargetArtifacts({phase8:context,target,classification,files:cache.outputArtifactFiles(output,target)}));
 const outputModel=atomic.outputModel(model,[target]);assert.equal(outputModel.slices.length,3);assert.equal(model.slices.length,4);
 const ld='OUTPUT_ARCH(mips)\nSECTIONS {\n'+outputModel.slices.map(s=>s.sectionName+' '+hex(s.vramStart)+' : AT('+hex(s.romStart)+') { *('+s.sectionName+') }').join('\n')+'\n/DISCARD/ : { *(.reginfo) *(.pdr) *(.comment) *(.note) } }\n'+externs+target.auxiliarySections.map(s=>s.ownerSymbol+' = '+hex(s.ownerSymbolVram)+';').join('\n');
 fs.writeFileSync(path.join(output,'fixture.ld'),ld);runTool(tools.toolsAbs.linker,['-T','fixture.ld','-Map','phase8.map','-o','phase8.elf','objects/c/atomic_fixture.o'],{cwd:output});
 const linked=p7.parseElfFile(path.join(output,'phase8.elf'));assert(p8.compareLinkedTargetBytes(target,linked,rom).rawBytesExact);
 assert(p8.runTargetAsmDiffer(context,target,{output,canonicalBaserom:rom,python:local.splatPython,asmDifferRoot:local.asmDifferRoot,objdump:tools.toolsAbs.objdump}).exact);
 const tableOffsets=Array.from({length:15},(_,i)=>rawRo.readUInt32BE(i*4)).concat(Array.from({length:5},(_,i)=>rawRo.readUInt32BE(64+i*4)));
 assert(tableOffsets.some(value=>value<cut)&&tableOffsets.some(value=>value>=cut),'table destinations span both physical rows');
 const proof=p8.deriveSourceObjectProof(context,target,output,classification,linked,rom);p8.validateSourceObjectProofBytes(proof.proofBytes,proof.proofBytes);
 const rejected=[];function reject(name,fn){assert.throws(fn,undefined,name);rejected.push(name);}
 assert.notEqual(text.size%16,0,'non-multiple16 function');assert.notEqual(base%16,0,'unaligned-to16 placement');
 const empty=logical.loadRegistry(model,rom,{schemaVersion:1,profile:'fixture',bodies:[],padding:[],unavailableBodies:[],preservedProductionEnvelopes:[]});
 reject('missing original body',()=>atomic.bind({...target},empty));
 const splitBodies=[{...originalBody,romEndExclusive:0x100+cut},{...originalBody,symbol:'unrelated_body',romStart:0x100+cut}].map(b=>({...b,expectedBytesSha256:hash(rom.subarray(b.romStart,b.romEndExclusive)),fragments:logical.intersections(model,b.romStart,b.romEndExclusive)}));
 const unrelated=logical.loadRegistry(model,rom,{schemaVersion:1,profile:'fixture',bodies:splitBodies,padding:[],unavailableBodies:[],preservedProductionEnvelopes:[]});
 reject('merging unrelated original functions',()=>atomic.bind({...target},unrelated));
 reject('unauthenticated registry copy',()=>atomic.bind({...target},structuredClone(registry)));
 reject('head-only activation',()=>logical.assertActivationCompatible(registry,target.symbol,[rows[0]],target.compilerTextFunctions));
 reject('tail-only activation',()=>logical.assertActivationCompatible(registry,rows[1].part.name,[rows[1]],target.compilerTextFunctions));
 for(const [name,mutate] of [
  ['partial owners',t=>{t.textOwners=t.textOwners.slice(0,1);}],['partial rows',t=>{t.rows=t.rows.slice(1);}],
  ['zero text tail',t=>{t.atomicText.tail={bytes:0};}],['native alignment16',t=>{t.atomicText.alignment=16;}],
  ['extra compiler function',t=>{t.compilerTextFunctions.push({...t.compilerTextFunctions[0],symbol:'second'});}],
  ['truncated compiler function',t=>{t.compilerTextFunctions[0].bytes-=4;}],
  ['owner gap',t=>{t.textOwners[1].logicalOffset+=4;}],
  ['shifted original start',t=>{t.romStartNumber+=4;}],['shifted original end',t=>{t.romEndNumber+=4;}],
  ['shifted runtime start',t=>{t.vramStartNumber+=4;}],['shifted runtime end',t=>{t.vramEndNumber+=4;}],
  ['wrong contribution section',t=>{t.sectionName='.ob64.r9999';}],
 ]){const t=structuredClone(target);mutate(t);reject(name,()=>atomic.bind(t,registry));}
 for(const [name,mutate] of [
  ['compiler body drift',t=>{t.compilerTextFunctions[0].bytes-=4;}],
  ['tail added after binding',t=>{t.nativeTextTail={bytes:0};}],
  ['section changed after binding',t=>{t.sectionName='.ob64.r9999';}],
 ]){const t=structuredClone(target);mutate(t);reject(name,()=>atomic.authenticate(t));}
 reject('subset activation',()=>atomic.assertCensus([target,{symbol:'partial',romStartNumber:target.romStartNumber,romEndNumber:target.romStartNumber+4}]));
 reject('containing conflicting activation',()=>atomic.assertCensus([target,{symbol:'larger',romStartNumber:target.romStartNumber-4,romEndNumber:target.romEndNumber+4}]));
 for(const [name,mutate] of [
  ['legacy bundled payload',p=>{p.schemaVersion=2;}],['occurrence label',p=>{p.segments[0].occurrences[1].label=p.segments[0].occurrences[0].label;}],
  ['occurrence gap',p=>{p.segments[0].occurrences[1].offset+=4;}],['missing occurrence',p=>{p.segments[0].occurrences.pop();}],
  ['forged directive',p=>{p.segments[1].occurrences[0].alignmentDirectives=[2];}],['row extent',p=>{p.segments[0].bytes+=8;}],
 ]){const p=structuredClone(projection);mutate(p);reject(name,()=>aux.normalize(p,target.auxiliarySections));}
 function objectReject(name,mutate){const b=Buffer.from(production.buffer);mutate(b);reject(name,()=>atomic.project(b,target));}
 const productionRo=production.sections.find(s=>s.name==='.ob64.r0010');
 objectReject('internal zeros nonzero',b=>{b[productionRo.offset+60]=1;});objectReject('terminal zeros nonzero',b=>{b[productionRo.offset+84]=1;});
 const roRel=production.sections.find(s=>s.name==='.rel.ob64.r0010'),textRel=production.sections.find(s=>s.name==='.rel.ob64.r0001');
 objectReject('table relocation in padding',b=>b.writeUInt32BE(60,roRel.offset));
 objectReject('duplicate table relocation',b=>b.writeUInt32BE(4,roRel.offset));
 objectReject('table wrong relocation type',b=>b.writeUInt32BE((b.readUInt32BE(roRel.offset+4)&0xffffff00)|4,roRel.offset+4));
 objectReject('text relocation past function',b=>b.writeUInt32BE(text.size,textRel.offset));
 objectReject('table outside function',b=>b.writeUInt32BE(text.size,productionRo.offset));
 objectReject('unaligned table destination',b=>b.writeUInt32BE(3,productionRo.offset));
 assert(p7.elfSectionBytes(production,production.sections.find(s=>s.name===target.sectionName)).equals(p7.elfSectionBytes(projectedElf,projectedElf.sections.find(s=>s.name===target.sectionName))),'projection preserves all executable bytes');
 assert(p7.elfSectionBytes(production,textRel).equals(p7.elfSectionBytes(projectedElf,projectedElf.sections.find(s=>s.name===textRel.name))),'projection preserves serialized atomic text relocations');
 const projectedSym=projectedElf.symbols.find(s=>s.name==='physical_continuation'),symtab=projectedElf.sections[projectedSym.symbolTableIndex];
 for(const [name,mutate] of [['callable boundary',b=>{b[symtab.offset+projectedSym.symbolIndex*16+12]=0x12;}],['nonzero boundary size',b=>{b.writeUInt32BE(4,symtab.offset+projectedSym.symbolIndex*16+8);}]]){
  const b=Buffer.from(projected.buffer);mutate(b);reject(name,()=>atomic.validateObject(p7.parseElf32BigEndian(b),target,'projected'));
 }
 const map=fs.readFileSync(path.join(output,'phase8.map'),'utf8');
 reject('first fallback contribution',()=>atomic.mapEvidence(target,map.replaceAll('objects/c/atomic_fixture.o','objects/assembly/chunk_001.o')));
 reject('second fallback contribution',()=>atomic.mapEvidence(target,map+'\n.ob64.r0002 80230018 4\n from objects/assembly/chunk_002.o(.ob64.r0002)\n'));
 reject('prepadding contribution',()=>atomic.mapEvidence(target,map.replace(' from *(.ob64.r0001)',' *fill* 4\n from *(.ob64.r0001)')));
 function proofReject(name,mutate){const p=structuredClone(proof.proof);mutate(p);const b=Buffer.from(JSON.stringify(p));reject('self-compared '+name,()=>p8.validateSourceObjectProofBytes(b,b));}
 for(const [name,mutate] of [
  ['old text schema',p=>{p.textContract.schemaVersion=1;}],['old object schema',p=>{p.objectEvidence.schemaVersion=8;}],
  ['old auxiliary schema',p=>{p.objectEvidence.auxiliaryProjection.schemaVersion=2;}],
  ['all atomic schema sentinels removed',p=>{p.textContract.schemaVersion=1;p.objectEvidence.schemaVersion=6;delete p.objectEvidence.atomicUnion;p.target.auxiliaryProjection.schemaVersion=2;p.objectEvidence.auxiliaryProjection.schemaVersion=2;}],
  ['source class',p=>{p.target.sourceClass='HYBRID_C';}],['source digest',p=>{p.target.sourcePolicyDigest='0'.repeat(64);}],
  ['forged logical body',p=>{p.textContract.logicalBinding.body.romStart+=4;}],
  ['text tail',p=>{p.textContract.tail={bytes:0};}],['physical owner omission',p=>{p.textContract.physicalOwners.pop();}],
  ['linked interval hash',p=>{p.linkEvidence.atomicPhysicalOwners[1].sha256='0'.repeat(64);}],
  ['linked census',p=>{p.linkEvidence.atomicLinkedCensus.symbols.pop();}],
  ['raw relocation order',p=>{p.objectEvidence.atomicUnion.stages.assembler.census.relocations.reverse();}],
  ['stripped symbols',p=>{p.objectEvidence.atomicUnion.stages.stripped.census.symbols.pop();}],
  ['whole claimed exactness',p=>{p.finalTarget.linkedSha256='0'.repeat(64);}],
 ])proofReject(name,mutate);
 for(const stage of ['assembler','projected','stripped'])for(const key of Object.keys(proof.proof.objectEvidence.atomicUnion.stages[stage]))proofReject(stage+' missing '+key,p=>{delete p.objectEvidence.atomicUnion.stages[stage][key];});
 for(const [name,file] of [['stale on-disk compiler artifact',path.join(output,'generated/c/atomic_fixture.compiler.s')],['stale original fallback',path.join(ROOT,rows[1].part.file)]]){
  const saved=fs.readFileSync(file);try{fs.appendFileSync(file,'\n# changed identity\n');reject(name,()=>p8.validateSourceObjectProofBytes(proof.proofBytes,proof.proofBytes));}finally{fs.writeFileSync(file,saved);}
 }
 const options={phase8:{...context,targets:[target]},compiler:local.compiler,verifiedCompiler,assembler:{bytes:fs.statSync(tools.assemblerAbs).size,sha256:p7.sha256File(tools.assemblerAbs)},objcopy:{bytes:fs.statSync(tools.objcopyAbs).size,sha256:p7.sha256File(tools.objcopyAbs)},assemblerPath:tools.assemblerAbs,objcopyPath:tools.objcopyAbs,preprocessor:classifications.preprocessor,cacheRoot:path.join(dir,'cache')};
 let key;for(const expected of ['miss','hit']){const dest=path.join(dir,'cache-'+expected);fs.mkdirSync(dest);const value=cache.compileOrReuseTarget({...options,target,classification,output:dest});assert.equal(value.cache.status,expected);key=value.cache.key;
  fs.writeFileSync(path.join(dest,'fixture.ld'),ld);runTool(tools.toolsAbs.linker,['-T','fixture.ld','-Map','phase8.map','-o','phase8.elf','objects/c/atomic_fixture.o'],{cwd:dest});
  const restored=p8.deriveSourceObjectProof(context,target,dest,classification,p7.parseElfFile(path.join(dest,'phase8.elf')),rom);p8.validateSourceObjectProofBytes(restored.proofBytes,restored.proofBytes);
 }
 const metadataFile=path.join(cache.cacheEntryPath(options.cacheRoot,target,key),'metadata.json'),metadata=JSON.parse(fs.readFileSync(metadataFile));
 for(const [name,mutate] of [['old object schema',m=>{m.compiled.objectEvidence.schemaVersion=8;}],['missing raw census',m=>{delete m.compiled.objectEvidence.atomicUnion.stages.assembler;}],['forged original binding',m=>{m.compiled.textContract.logicalBinding.body.expectedBytesSha256='0'.repeat(64);}]]){
  const m=structuredClone(metadata);mutate(m);fs.writeFileSync(metadataFile,JSON.stringify(m));reject('warm cache '+name,()=>cache.validateCacheEntry({...options,target,classification,keyMaterial:metadata.keyMaterial}));
 }fs.writeFileSync(metadataFile,JSON.stringify(metadata));
 const accounting=require('../tools/lib/status_accounting').summarizeAcceptedOwnership(model,[target]);assert.equal(accounting.replacements.bytes,text.size+88);assert.equal(accounting.replacements.textOwners,2);
 assert.equal(require('../tools/lib/matching/target_model').scratchCapability({},target).supported,false);
 for(const selectionKind of ['logical-body','physical-owner-envelope'])for(const privateSession of [false,true]){
  const alias={symbol:'continuation_alias',selectionKind,romStart:rows[1].romStart,romEndExclusive:rows[1].romEndExclusive};
  const workbench=privateSession?{}:{activeTargetsBySymbol:new Map([[target.symbol,target]])};
  assert.equal(require('../tools/lib/matching/target_model').scratchCapability(workbench,alias,privateSession?[target]:[]).code,'atomic-owner-candidate-required');
 }
 const producer=path.join(output,'objects/c/atomic_fixture.o');
 function boundaryCaller(kind){const name=path.join(dir,kind),asm=kind==='data'?'.section .reference,"a",@progbits\n.word physical_continuation\n':'.text\n.set noreorder\njal physical_continuation\nnop\n';fs.writeFileSync(name+'.s',asm);runTool(tools.assemblerAbs,[...tools.compilerAssemblerFlags,'-o',name+'.o',name+'.s']);return name+'.o';}
 const addressCaller=boundaryCaller('data');atomic.verifyInputReferences(target,[producer,addressCaller],producer);
 const addressLd=ld.replace('/DISCARD/',`.reference ${hex(roBase+0x1000)} : AT(0x1800) { *(.reference) }\n/DISCARD/`);
 fs.writeFileSync(path.join(output,'address.ld'),addressLd);runTool(tools.toolsAbs.linker,['-T','address.ld','-o','address.elf',producer,addressCaller],{cwd:output});
 const addressElf=p7.parseElfFile(path.join(output,'address.elf'));assert.equal(p7.elfSectionBytes(addressElf,addressElf.sections.find(s=>s.name==='.reference')).readUInt32BE(0),base+cut);
 reject('external callable boundary',()=>atomic.verifyInputReferences(target,[producer,boundaryCaller('call')],producer));
 for(const [kind,addend,complete] of [['pair',0,true],['pair-addend',4,true],['pair-incomplete',0,false]]){
  const file=path.join(dir,kind),expression='physical_continuation'+(addend?'+'+addend:'');
  fs.writeFileSync(file+'.s','.text\n.set noreorder\nlui $2,%hi('+expression+')\n'+(complete?'addiu $2,$2,%lo('+expression+')\n':''));
  runTool(tools.assemblerAbs,[...tools.compilerAssemblerFlags,'-o',file+'.o',file+'.s']);
  if(kind==='pair')atomic.verifyInputReferences(target,[producer,file+'.o'],producer);
  else reject('boundary '+kind,()=>atomic.verifyInputReferences(target,[producer,file+'.o'],producer));
 }
 reject('original text fallback input',()=>atomic.verifyInputReferences(target,[producer,productionObj],producer));
 const changed=source.replace('external_call(11)','external_call(12)'),changedSource=path.join(dir,'changed.c');fs.writeFileSync(changedSource,changed);assert.notEqual(changed,source);
 const changedTarget={...target,source:path.relative(ROOT,changedSource).replace(/\\/g,'/'),sourceSha256:p7.sha256File(changedSource)},changedClass=policy.classifyTargetSources([changedTarget]).targets[0],changedOutput=path.join(dir,'nonmatch');fs.mkdirSync(changedOutput);
 p8.compileTarget({...context,targets:[changedTarget]},changedTarget,changedOutput,local.compiler,tools.assemblerAbs,tools.objcopyAbs,{classification:changedClass});
 fs.writeFileSync(path.join(changedOutput,'fixture.ld'),ld);runTool(tools.toolsAbs.linker,['-T','fixture.ld','-Map','phase8.map','-o','phase8.elf','objects/c/atomic_fixture.o'],{cwd:changedOutput});
 assert.equal(p8.compareLinkedTargetBytes(changedTarget,p7.parseElfFile(path.join(changedOutput,'phase8.elf')),rom).rawBytesExact,false);
 report.push({base,external,bytes:text.size,cut,bodyHash:originalBody.expectedBytesSha256,proof:proof.proof.objectEvidence.schemaVersion,rejected});
}
exercise(0x8023000c,0x80018000);exercise(0x80350004,0x80017ffc);
fs.writeFileSync(path.join(root,'report.json'),JSON.stringify({status:'pass',report},null,2));console.log(JSON.stringify({status:'pass',root,report},null,2));
