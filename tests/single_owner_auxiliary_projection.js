#!/usr/bin/env node
'use strict';
// Explicit single-owner native fixtures; no canonical owner is activated.
const assert=require('assert/strict'),fs=require('fs'),path=require('path');
const p7=require('../tools/lib/phase7_conventional'),p8=require('../tools/lib/phase8_matching_c');
const active=require('../tools/lib/active_targets'),groups=require('../tools/lib/compilation_groups');
const auxiliary=require('../tools/lib/auxiliary_projection'),policy=require('../tools/lib/source_policy');
const cache=require('../tools/lib/diff_object_cache'),tc=require('../tools/lib/text_contract');
const {assertToolchainAvailable,loadToolchainConfig,runTool}=require('../tools/lib/real_mips_toolchain');
const {ROOT,hex,sha256Buffer:hash}=p7,context=active.loadActiveTargetModel();
const local=JSON.parse(fs.readFileSync(path.join(ROOT,'config/local-tools.json')));
const verifiedCompiler=p8.verifyCompiler(context,local.compiler),tools=assertToolchainAvailable(loadToolchainConfig());
fs.mkdirSync(path.join(ROOT,'build/tests'),{recursive:true});
const root=fs.mkdtempSync(path.join(ROOT,'build/tests/single-owner-auxiliary-'));
const retail=fs.readFileSync(path.join(ROOT,'build/baserom.us_rev0.z64'));
const report=[];
function compile(dir,source,symbol,name='native'){
 const file=path.join(dir,name+'.c');fs.writeFileSync(file,source);
 const relative=path.relative(ROOT,file).replace(/\\/g,'/');
 const classified=policy.classifyTargetSources([{symbol,source:relative,bytes:4}]);
 const classification=classified.targets[0];assert.equal(classification.class,'PURE_C');
 const input=path.join(dir,name+'.input.c'),assembly=path.join(dir,name+'.s'),object=path.join(dir,name+'.o');
 fs.writeFileSync(input,policy.compilationInputBytes(classification));
 p7.run(local.compiler,[...context.config.compiler.compileFlags,'-o',assembly,input]);policy.verifyClassificationInputs(classification);
 runTool(tools.assemblerAbs,[...tools.compilerAssemblerFlags,'-o',object,assembly]);policy.verifyClassificationInputs(classification);
 return {file,relative,classified,classification,assembly:fs.readFileSync(assembly),raw:p7.parseElfFile(object)};
}
function exercise(spec){
 const dir=path.join(root,spec.id);fs.mkdirSync(dir);
 const source=spec.sourcePath?fs.readFileSync(path.join(ROOT,spec.sourcePath)):spec.fixture?fs.readFileSync(path.join(__dirname,'fixtures',spec.fixture)):Buffer.from(spec.source);
 if(spec.sha256)assert.equal(hash(source),spec.sha256,'tracked source bytes');
 const capture=compile(dir,source,spec.symbol),{raw}=capture;
 const text=raw.sections.find(s=>s.name==='.text'),ro=raw.sections.find(s=>s.name==='.rodata');
 const functions=raw.symbols.filter(s=>s.symbolType===2).map(s=>({symbol:s.name,offset:s.value,bytes:s.size,binding:s.binding,symbolType:s.symbolType,visibility:s.visibility})).sort((a,b)=>a.offset-b.offset);
 assert.equal(functions.length,1);assert(functions.every(f=>f.binding===1));
 const end=functions.at(-1).offset+functions.at(-1).bytes;
 if(spec.sizes)assert.deepEqual(functions.map(f=>f.bytes),spec.sizes);
 if(spec.textBytes)assert.equal(text.size,spec.textBytes);
 if(spec.tailBytes!==undefined)assert.equal(text.size-end,spec.tailBytes);
 const rels=groups.relocations(raw).filter(r=>r.owner.name==='.text');
 if(spec.relocationCount)assert.equal(rels.length,spec.relocationCount);
 const group={id:spec.id,source:capture.relative,mode:'native-text-readonly-single-owner-projection',
  members:[],text:{section:'.text',bytes:text.size,alignment:text.alignment,type:1,flags:6,sha256:hash(p7.elfSectionBytes(raw,text))},functions,
  tail:{offset:end,bytes:text.size-end,sha256:hash(Buffer.alloc(text.size-end)),origin:'native-assembler-section-alignment'},
  relocations:rels.map(r=>({offset:r.place,type:r.type,symbol:r.symbol.symbolType===3?raw.sections[r.symbol.sectionIndex].name:r.symbol.name,
   symbolValue:r.symbol.value,symbolSection:r.symbol.sectionIndex===0?'UND':r.symbol.sectionIndex===0xfff1?'ABS':raw.sections[r.symbol.sectionIndex].name,word:raw.buffer.readUInt32BE(text.offset+r.place)}))};
 const original=path.join(dir,'original.s');fs.writeFileSync(original,'.text\n');
 const originalRelative=path.relative(ROOT,original).replace(/\\/g,'/');
 function syntheticRow(index,start,bytes,vram,executable){return {index,primaryId:'fixture:'+index,primaryClass:executable?'code':'data',ambiguous:false,inputKind:'tracked-assembly',romStart:start,romEndExclusive:start+bytes,bytes,
  part:{file:originalRelative,sha256:p7.sha256File(original),chunkIndex:0,name:'fixture_owner_'+index,symbolByteOffset:0},
  slices:[{sectionName:'.ob64.r'+String(index).padStart(4,'0'),executable,bytes,romStart:start,romEndExclusive:start+bytes,vramStart:vram,vramEndExclusive:vram+bytes,placementKind:'overlay',overlayDescriptorId:99,overlaySection:executable?'text':'data-rodata',loadSlabId:null}]};}
 const rows=spec.real?functions.map(f=>active.resolveAcceptedRow(context.model,f.symbol)):functions.map((f,i)=>syntheticRow(i+1,0x100+f.offset,f.bytes+(i===0?group.tail.bytes:0),spec.placement+f.offset,true));
 let realTableRow;
 if(spec.real){
  const pair=rels.filter(r=>r.symbol.symbolType===3&&r.symbol.sectionIndex===ro.index);
  assert.equal(pair.length,2);const high=pair.find(r=>r.type===5),low=pair.find(r=>r.type===6);assert(high&&low);
  const hi=retail.readUInt32BE(rows[0].romStart+high.place),lo=retail.readUInt32BE(rows[0].romStart+low.place);
  const address=(((hi&65535)<<16)+((lo<<16)>>16))>>>0;
  const matching=context.model.rows.filter(r=>r.primaryClass==='data'&&r.slices.length===1&&r.slices[0].vramStart===address&&r.bytes===ro.size);
  assert.equal(matching.length,1,'unique complete real table row');realTableRow=matching[0];
 }
 const tableRow=spec.table?(spec.real?realTableRow:syntheticRow(10,0x1000,ro.size,spec.placement+0x10000,false)):null;
 if(spec.table){assert(ro);assert.equal(ro.size,spec.tableBytes);assert.equal(tableRow.bytes,ro.size);}else assert(!ro||!ro.size);
 // Private link census contains exactly these unchanged authenticated owner rows.
 const model={overlays:[],rows:[...rows,tableRow].filter(Boolean)};model.slices=model.rows.flatMap(r=>r.slices);
 group.members=functions.map((f,i)=>({symbol:f.symbol,ownerRowIndex:rows[i].index}));
 const base=rows[0].slices[0].vramStart;
 const assignments=new Map();
 for(const symbol of raw.symbols.filter(s=>s.sectionIndex===0&&s.name)){
  let address=context.linkSymbols[symbol.name];
  if(spec.real&&address===undefined){
   const calls=rels.filter(r=>r.symbol.name===symbol.name&&r.type===4);
   if(calls.length){const addresses=calls.map(r=>(((base+r.place+4)&0xf0000000)|((retail.readUInt32BE(rows[0].romStart+r.place)&0x03ffffff)*4))>>>0);
    assert(addresses.every(a=>a===addresses[0]),'source-bound private call alias');address=addresses[0];}
  }
  if(address===undefined){
   // VRAM-labelled externs encode their address, ROM-labelled functions resolve
   // through accepted rows. Never apply a linear ROM-to-RAM approximation.
   const literal=/^(?:func|D)_(8[0-9A-Fa-f]{7})$/.exec(symbol.name);
   if(literal)address=parseInt(literal[1],16);
   else if(symbol.name==='external_call'&&!spec.fixture)address=0x80001234;
   else {const row=active.resolveAcceptedRow(context.model,symbol.name);assert.equal(row.slices.length,1);address=row.slices[0].vramStart;}
  }
  assignments.set(symbol.name,typeof address==='string'?parseInt(address,16):address);
 }
 const externs=[...assignments].map(([name,value])=>name+' = '+hex(value)+';').join('\n');
 const nativeScript='OUTPUT_ARCH(mips)\nSECTIONS { .text '+hex(base)+' : { *(.text) } '+(ro?'.rodata '+hex(tableRow.slices[0].vramStart)+' : { *(.rodata) } ':'')+' .bss 0 (NOLOAD) : { *(.bss) } /DISCARD/ : { *(.reginfo) *(.pdr) *(.comment) *(.note) } }\n'+externs;
 fs.writeFileSync(path.join(dir,'native.ld'),nativeScript);
 runTool(tools.toolsAbs.linker,['-T',path.join(dir,'native.ld'),'-o',path.join(dir,'native.elf'),path.join(dir,'native.o')]);
 const native=p7.parseElfFile(path.join(dir,'native.elf'));
 const nativeText=p7.elfSectionBytes(native,native.sections.find(s=>s.name==='.text'));
 const rom=spec.real?retail:Buffer.alloc(0x2000);
 if(!spec.real){nativeText.copy(rom,rows[0].romStart);if(ro)p7.elfSectionBytes(native,native.sections.find(s=>s.name==='.rodata')).copy(rom,tableRow.romStart);}
 assert.equal(nativeText.equals(rom.subarray(rows[0].romStart,rows.at(-1).romEndExclusive)),!spec.real,'native owner match/nonmatch');
 if(spec.table){
  const rawRo=p7.elfSectionBytes(raw,ro),slice=tableRow.slices[0];
  const blocks=[...capture.assembly.toString().matchAll(/\.section\s+\.rodata([^]*?)\s\.text/g)];assert.equal(blocks.length,1);
  const linkedRo=p7.elfSectionBytes(native,native.sections.find(s=>s.name==='.rodata'));
  assert(linkedRo.equals(rom.subarray(tableRow.romStart,tableRow.romEndExclusive)));
  const section={memberSymbol:functions[0].symbol,kind:'switch-table',compilerSection:'.rodata',outputSection:slice.sectionName,sectionType:'SHT_PROGBITS',sectionFlags:['SHF_ALLOC'],alignment:ro.alignment,
   romStart:hex(tableRow.romStart),romEndExclusive:hex(tableRow.romEndExclusive),vramStart:hex(slice.vramStart),vramEndExclusive:hex(slice.vramEndExclusive),bytes:ro.size,entries:ro.size/4,
   expectedObjectSha256:hash(rawRo),expectedLinkedSha256:hash(linkedRo),preservedTail:null,
   expectedRelocations:Array.from({length:ro.size/4},(_,i)=>({offset:hex(i*4),type:'R_MIPS_32',symbol:'.text',addend:hex(rawRo.readUInt32BE(i*4)),section:'.rel.rodata'}))};
  const segment={kind:'payload',offset:0,bytes:ro.size,outputSection:slice.sectionName,label:/(?:^|\n)(\.L\d+):/.exec(blocks[0][1])[1],alignmentDirectives:[...blocks[0][1].matchAll(/\.align\s+(\d+)/g)].map(m=>Number(m[1]))};
  assert.equal([...blocks[0][1].matchAll(/\.word\s+\.L\d+/g)].length*4,ro.size,'one complete payload, no invented padding');
  group.auxiliary={sections:[section],projection:{schemaVersion:1,mode:'fixed-row-readonly-projection',compilerSection:'.rodata',bytes:ro.size,alignment:ro.alignment,expectedObjectSha256:hash(rawRo),segments:[segment]}};
 }
 groups.registry({schemaVersion:1,profile:'fixture',groups:[group]},'fixture');
 const targets=functions.map((f,i)=>{const r=rows[i],s=r.slices[0];assert.equal(r.slices.length,1);assert.equal(p7.sha256File(path.join(ROOT,r.part.file)),r.part.sha256);
  const owner={ownerIndex:0,sectionName:s.sectionName,symbol:f.symbol,rowIndex:r.index,primaryId:r.primaryId,chunkIndex:r.part.chunkIndex,logicalOffset:0,logicalEnd:r.bytes,bytes:r.bytes,
   romStartNumber:r.romStart,romEndNumber:r.romEndExclusive,vramStartNumber:s.vramStart,vramEndNumber:s.vramEndExclusive,expectedTextSha256:hash(rom.subarray(r.romStart,r.romEndExclusive)),originalAssembly:r.part.file,originalAssemblySha256:r.part.sha256,row:r};
  return {...owner,symbol:f.symbol,source:capture.relative,sourceSha256:p7.sha256File(capture.file),compilationGroupId:group.id,textOwners:[owner],compilerTextFunctions:[],compilerTextFunctionsExplicit:false,auxiliarySections:[],model,row:r,rows:[r],overlayDescriptorId:s.overlayDescriptorId,descriptorRawSha256:'0'.repeat(64),legacyAncillaryRelocations:[],relocationContractSource:'compilation-group'};});
 groups.bind([group],targets,{model,baserom:rom});const bound=targets[0].compilationGroup;
 if(spec.table)auxiliary.groupGrammar(capture.assembly,bound,p8.adjustSectionAssembly);else p8.adjustSectionAssembly(capture.assembly,targets[0].sectionName,{});
 const result=groups.project(raw.buffer,bound);groups.validateObject(p7.parseElf32BigEndian(result.buffer),bound,'projected');
 if(spec.real){
  const output=path.join(dir,'compiled');fs.mkdirSync(output);
  const classifications=policy.classifyTargetSources(targets),target=targets[0],classification=classifications.targets[0];
  p8.compileTarget({...context,targets},target,output,local.compiler,tools.assemblerAbs,tools.objcopyAbs,{classification});
  const ld='OUTPUT_ARCH(mips)\nSECTIONS {\n'+[...rows,tableRow].map(r=>r.slices[0].sectionName+' '+hex(r.slices[0].vramStart)+' : AT('+hex(r.romStart)+') { *('+r.slices[0].sectionName+') }').join('\n')+'\n.bss 0 (NOLOAD) : { '+groups.objectPath(target)+'(.bss) } /DISCARD/ : { *(.reginfo) *(.pdr) *(.comment) *(.note) } }\n'+externs+'\n'+bound.auxiliary.sections.map(s=>s.ownerSymbol+' = '+hex(s.ownerSymbolVram)+';').join('\n');
  fs.writeFileSync(path.join(output,'fixture.ld'),ld);runTool(tools.toolsAbs.linker,['-T','fixture.ld','-Map','phase8.map','-o','phase8.elf',groups.objectPath(target)],{cwd:output});
  const linked=p7.parseElfFile(path.join(output,'phase8.elf')),bytes=p7.elfSectionBytes(linked,linked.sections.find(s=>s.name===target.sectionName));
  assert(bytes.equals(nativeText),'projection conserves actual nonexact bytes');
  const differences=[];for(let offset=0;offset<bytes.length;offset+=4)if(bytes.readUInt32BE(offset)!==rom.readUInt32BE(rows[0].romStart+offset))differences.push(offset);
  assert.deepEqual(differences,[0x64],'retained ORI/ADDIU mismatch must remain');
  assert.equal(bytes.readUInt32BE(0x64),0x36f73cb8);assert.equal(rom.readUInt32BE(rows[0].romStart+0x64),0x26f73cb8);
  const negativeProof=p8.deriveSourceObjectProof(context,target,output,classification,linked,rom);
  assert.equal(negativeProof.proof.finalTarget.rawBytesExact,false);assert.equal(negativeProof.proof.linkEvidence.fullOwnerExact,false);
  assert(negativeProof.proof.finalTarget.auxiliarySections.every(s=>s.rawBytesExact));
  report.push({id:spec.id,sourceSha256:hash(source),sourceClass:classification.class,tailBytes:group.tail.bytes,textBytes:text.size,tableBytes:ro.size,tableRow:tableRow.index,differences,matchingAccepted:false});return;
 }
 const rejected=[];
 function reject(name,fn){assert.throws(fn,undefined,name);rejected.push(name);}
 function registryReject(name,mutate){const g=structuredClone(group);mutate(g);reject(name,()=>groups.registry({schemaVersion:1,profile:'fixture',groups:[g]},'fixture'));}
 for(const [name,mutate] of [
  ['legacy composed single owner',g=>{g.mode='native-text-readonly-owner-projection';}],
  ['legacy text-only single owner',g=>{g.mode='native-text-owner-projection';delete g.auxiliary;}],
  ['new mode multiple members',g=>{g.members.push({...g.members[0],symbol:'extra'});}],
  ['extra function',g=>{g.functions.push({...g.functions[0],symbol:'extra'});}],
  ['local function',g=>{g.functions[0].binding=0;}],['function gap',g=>{g.functions[0].offset=4;}],
  ['partial function',g=>{g.functions[0].bytes-=4;}],['alignment',g=>{g.text.alignment=3;}],
  ['tail excess',g=>{g.tail.bytes+=16;g.text.bytes+=16;}],['tail hash',g=>{g.tail.sha256='0'.repeat(64);}],
  ['missing table',g=>{g.auxiliary.sections=[];}],['foreign table',g=>{g.auxiliary.sections[0].memberSymbol='other';}],
  ['v2 table',g=>{g.auxiliary.projection.schemaVersion=2;}],
  ['duplicate relocation',g=>{g.relocations.push(g.relocations[0]);}],
  ['relocation in tail',g=>{g.relocations[0].offset=end;}],
  ['relocation unknown section',g=>{g.relocations[0].symbolSection='.unknown';}],
 ])registryReject(name,mutate);
 const split=require('../tools/lib/elf_text_split');
 assert.throws(()=>split.splitRelocatableTextSection(result.buffer,targets[0].sectionName,[{sectionName:targets[0].sectionName,bytes:text.size}]),/owner list must contain at least two/);
 rejected.push('legacy splitter single owner');
 reject('native projector default single owner',()=>split.projectNativeTextOwners(raw.buffer,[{sectionName:'.ob64.r0001',bytes:text.size}]));
 reject('native projector unknown admission',()=>split.projectNativeTextOwners(raw.buffer,[{sectionName:'.ob64.r0001',bytes:text.size}],'relaxed'));
 const standalone=group.auxiliary.sections.map(({memberSymbol,...section})=>section);
 reject('standalone one payload minimum',()=>auxiliary.normalize(group.auxiliary.projection,standalone));
 const capability=require('../tools/lib/matching/target_model').scratchCapability({activeTargetsBySymbol:new Map([[spec.symbol.toLowerCase(),targets[0]]])},targets[0]);
 assert.equal(capability.code,'complete-group-candidate-required');assert.equal(capability.supported,false);
 function objectReject(name,mutate){const bytes=Buffer.from(raw.buffer),g=structuredClone(bound);mutate(bytes,g);reject(name,()=>groups.validateObject(p7.parseElf32BigEndian(bytes),g,'raw'));}
 const shoff=raw.header.shoff;
 for(const name of ['.data','.bss'])objectReject('nonempty '+name,(b)=>b.writeUInt32BE(4,shoff+raw.sections.find(s=>s.name===name).index*40+20));
 objectReject('writable rodata',b=>b.writeUInt32BE(3,shoff+ro.index*40+8));
 objectReject('extra allocation',b=>b.writeUInt32BE(2,shoff+raw.sections.find(s=>s.name==='.strtab').index*40+8));
 objectReject('unallocated executable bytes',b=>b.writeUInt32BE(4,shoff+raw.sections.find(s=>s.name==='.strtab').index*40+8));
 const marker=raw.symbols.find(s=>s.name==='gcc2_compiled.'),symtab=raw.sections[marker.symbolTableIndex];
 objectReject('named tail',b=>b.writeUInt32BE(end,symtab.offset+marker.symbolIndex*16+4));
 objectReject('COMMON',b=>{b.writeUInt16BE(0xfff2,symtab.offset+marker.symbolIndex*16+14);b.writeUInt32BE(4,symtab.offset+marker.symbolIndex*16+8);});
 if(group.tail.bytes)objectReject('nonzero authentic tail',(b,g)=>{b[text.offset+end]=1;g.text.sha256=hash(b.subarray(text.offset,text.offset+text.size));});
 for(const destination of [end,end+4,1,0xfffffffc])objectReject('table destination '+destination,(b,g)=>{
  b.writeUInt32BE(destination,ro.offset);const h=hash(b.subarray(ro.offset,ro.offset+ro.size));
  g.auxiliary.projection.expectedObjectSha256=h;g.auxiliary.sections[0].expectedObjectSha256=h;g.auxiliary.sections[0].expectedRelocations[0].addend=hex(destination);
 });
 const textAnchor=raw.symbols.find(s=>s.symbolType===3&&s.sectionIndex===text.index);
 objectReject('nonzero text section anchor',b=>b.writeUInt32BE(4,raw.sections[textAnchor.symbolTableIndex].offset+textAnchor.symbolIndex*16+4));
 const rro=raw.sections.find(s=>s.name==='.rel.rodata');
 objectReject('missing table relocation',b=>b.writeUInt32BE(rro.size-8,shoff+rro.index*40+20));
 objectReject('duplicate table place',b=>b.writeUInt32BE(0,rro.offset+8));
 objectReject('wrong table relocation type',b=>b.writeUInt32BE((b.readUInt32BE(rro.offset+4)&0xffffff00)|4,rro.offset+4));
 const unbound=()=>targets.map(t=>({...structuredClone(t),auxiliarySections:[],compilerTextFunctionsExplicit:false}));
 for(const [name,mutate] of [
  ['physical text extent',m=>{m.rows[0].bytes-=4;}],
  ['table source identity',m=>{m.rows[1].part.sha256='0'.repeat(64);}],
  ['table overlay',m=>{m.rows[1].slices[0].overlayDescriptorId++;}],
 ]){const m=structuredClone(model);mutate(m);const ts=unbound();if(name==='physical text extent')ts[0].bytes-=4;
  reject(name,()=>groups.bind([group],ts,{model:m,baserom:rom}));}
 const output=path.join(dir,'compiled');fs.mkdirSync(output);
 const classifications=policy.classifyTargetSources(targets),target=targets[0],classification=classifications.targets[0];
 const compiled=p8.compileTarget({...context,targets},target,output,local.compiler,tools.assemblerAbs,tools.objcopyAbs,{classification});
 assert.deepEqual(compiled,cache.inspectCompiledTargetArtifacts({phase8:context,target,classification,files:cache.outputArtifactFiles(output,target)}));
 const outputRows=[...rows,tableRow].sort((a,b)=>a.slices[0].vramStart-b.slices[0].vramStart);
 const ld='OUTPUT_ARCH(mips)\nSECTIONS {\n'+outputRows.map(r=>r.slices[0].sectionName+' '+hex(r.slices[0].vramStart)+' : AT('+hex(r.romStart)+') { *('+r.slices[0].sectionName+') }').join('\n')+'\n.bss 0 (NOLOAD) : { '+groups.objectPath(target)+'(.bss) } /DISCARD/ : { *(.reginfo) *(.pdr) *(.comment) *(.note) } }\n'+externs+'\n'+bound.auxiliary.sections.map(s=>s.ownerSymbol+' = '+hex(s.ownerSymbolVram)+';').join('\n');
 fs.writeFileSync(path.join(output,'fixture.ld'),ld);
 runTool(tools.toolsAbs.linker,['-T','fixture.ld','-Map','phase8.map','-o','phase8.elf',groups.objectPath(target)],{cwd:output});
 const linked=p7.parseElfFile(path.join(output,'phase8.elf'));
 for(const r of outputRows)assert(p7.elfSectionBytes(linked,linked.sections.find(s=>s.name===r.slices[0].sectionName)).equals(rom.subarray(r.romStart,r.romEndExclusive)),'native versus projected linked full owner');
 const proof=p8.deriveSourceObjectProof(context,target,output,classification,linked,rom);
 p8.validateSourceObjectProofBytes(proof.proofBytes,proof.proofBytes);
 assert.equal(proof.proof.textContract.schemaVersion,6);assert.equal(proof.proof.objectEvidence.schemaVersion,10);assert.equal(proof.proof.objectEvidence.composition.schemaVersion,3);
 function proofReject(name,mutate){const p=structuredClone(proof.proof);mutate(p);const bytes=Buffer.from(JSON.stringify(p));reject('self-compared proof '+name,()=>p8.validateSourceObjectProofBytes(bytes,bytes));}
 for(const [name,mutate] of [
  ['old text schema',p=>{p.textContract.schemaVersion=4;}],['old object schema',p=>{p.objectEvidence.schemaVersion=7;}],
  ['old composition schema',p=>{p.objectEvidence.composition.schemaVersion=2;}],
  ['mode substitution',p=>{p.textContract.producer.mode='native-text-readonly-owner-projection';}],
  ['assembly mode',p=>{p.objectEvidence.assemblyMode='section-assigned';}],
  ['assembly identity',p=>{p.objectEvidence.artifacts.assemblerInput.sha256='0'.repeat(64);}],
  ['implementation identity',p=>{p.objectEvidence.composition.implementationSha256='0'.repeat(64);}],
  ['linked tail',p=>{p.linkEvidence.tail.bytes++;}],['linked function',p=>{p.linkEvidence.functions[0].bytes-=4;}],
  ['linked hash',p=>{p.objectEvidence.composition.strippedObjectSha256='0'.repeat(64);}],
 ])proofReject(name,mutate);
 for(const stage of ['raw','textProjected','projected','stripped']){
  for(const key of Object.keys(proof.proof.objectEvidence.producerStages[stage]))proofReject(stage+' omitted '+key,p=>{delete p.objectEvidence.producerStages[stage][key];});
  for(const [name,mutate] of [
   ['section allocation',s=>{s.completeCensus.sections.find(v=>v.name==='.strtab').flags=2;}],
   ['unallocated executable bytes',s=>{s.completeCensus.sections.find(v=>v.name==='.strtab').flags=4;}],
   ['function visibility',s=>{s.completeCensus.symbols.find(v=>v.symbolType===2).visibility=2;}],
   ['named tail',s=>{s.completeCensus.symbols.find(v=>v.name==='gcc2_compiled.').value=end;}],
   ['table relocation word',s=>{s.auxiliary.tableRelocations[0].word=end;}],
   ['table relocation removal',s=>{s.completeCensus.relocations.pop();}],
   ['section anchor',s=>{s.completeCensus.symbols.find(v=>v.symbolType===3).value=4;}],
  ])proofReject(stage+' '+name,p=>mutate(p.objectEvidence.producerStages[stage]));
 }
 // Rehash all envelope bindings: malformed function/tail shape must fail even
 // when a proof is compared with itself and every outer digest was recomputed.
 for(const [name,mutate] of [['excessive tail',g=>{g.tail.bytes+=16;g.text.bytes+=16;}],['function gap',g=>{g.functions[0].offset=4;}],['owner extent',g=>{g.owners[0].bytes-=4;}]])proofReject('rehashed '+name,p=>{
  mutate(p.textContract.producer);const g=p.textContract.producer;
  p.objectEvidence.composition.groupSha256=tc.hash(g);for(const s of Object.values(p.objectEvidence.producerStages))s.groupSha256=tc.hash(g);
  p.objectEvidence.textContractSha256=tc.hash(p.textContract);p.linkEvidence.textContractSha256=tc.hash(p.textContract);
 });
 const options={phase8:{...context,targets},compiler:local.compiler,verifiedCompiler,assembler:{bytes:fs.statSync(tools.assemblerAbs).size,sha256:p7.sha256File(tools.assemblerAbs)},objcopy:{bytes:fs.statSync(tools.objcopyAbs).size,sha256:p7.sha256File(tools.objcopyAbs)},assemblerPath:tools.assemblerAbs,objcopyPath:tools.objcopyAbs,preprocessor:classifications.preprocessor,cacheRoot:path.join(dir,'cache')};
 let key;
 for(const expected of ['miss','hit']){const dest=path.join(dir,'cache-'+expected);fs.mkdirSync(dest);const value=cache.compileOrReuseTarget({...options,target,classification,output:dest});assert.equal(value.cache.status,expected);key=value.cache.key;}
 const metadataFile=path.join(cache.cacheEntryPath(options.cacheRoot,target,key),'metadata.json'),metadata=JSON.parse(fs.readFileSync(metadataFile));
 for(const [name,mutate] of [['old schema',m=>{m.compiled.objectEvidence.schemaVersion=7;}],['missing intermediate',m=>{delete m.compiled.objectEvidence.artifacts.textProjectedObject;}],['missing tail',m=>{delete m.compiled.objectEvidence.tail;}]]){
  const m=structuredClone(metadata);mutate(m);fs.writeFileSync(metadataFile,JSON.stringify(m));reject('stale cache '+name,()=>cache.validateCacheEntry({...options,target,classification,keyMaterial:metadata.keyMaterial}));
 }
 fs.writeFileSync(metadataFile,JSON.stringify(metadata));
 const files=cache.outputArtifactFiles(output,target),missing={...files};delete missing['text-projected.o'];
 reject('cache missing intermediate artifact',()=>cache.inspectCompiledTargetArtifacts({phase8:context,target,classification,files:missing}));
 const changedSource=source.toString().replace(spec.nonmatchFrom,spec.nonmatchTo);assert.notEqual(changedSource,source.toString());
 const negative=compile(dir,changedSource,spec.symbol,'nonmatching');reject('compiled PURE_C nonmatch',()=>groups.validateObject(negative.raw,bound,'raw'));
 report.push({id:spec.id,placement:spec.placement,textBytes:text.size,tailBytes:group.tail.bytes,tableBytes:ro.size,sourceClass:classification.class,rejections:rejected});
}
const dispatch='extern int external_call(int);\nint unrelated_dispatch(int x) { switch(x) { case 0:return external_call(11);case 1:return external_call(23);case 2:return external_call(37);case 3:return external_call(41);case 4:return external_call(59);case 5:return external_call(61);case 6:return external_call(73);case 7:return external_call(89);default:return 3; } }\n';
for(const placement of [0x80230000,0x80350000])exercise({id:'single_'+placement.toString(16),symbol:'unrelated_dispatch',placement,table:true,tableBytes:32,source:dispatch,nonmatchFrom:'external_call(11)',nonmatchTo:'external_call(12)'});
const second='extern int external_call(int);\nint accumulated_dispatch(int x) { int result; switch(x) { case 0:result=external_call(7);break;case 1:result=external_call(19);break;case 2:result=external_call(31);break;case 3:result=external_call(43);break;case 4:result=external_call(57);break;case 5:result=external_call(67);break;case 6:result=external_call(79);break;case 7:result=external_call(97);break;default:result=5; } return result+x+9; }\n';
exercise({id:'single_accumulated',symbol:'accumulated_dispatch',placement:0x80460000,table:true,tableBytes:32,source:second,nonmatchFrom:'external_call(7)',nonmatchTo:'external_call(8)'});
exercise({id:'single_zero_tail',symbol:'accumulated_dispatch',placement:0x80560000,table:true,tableBytes:32,source:second.replace('result+x+9','result*3+x+9'),tailBytes:0,nonmatchFrom:'external_call(7)',nonmatchTo:'external_call(8)'});
if(process.argv.includes('--real-candidate'))exercise({id:'real_2215d0_negative',symbol:'func_002215D0',real:true,table:true,tableBytes:240,textBytes:3008,tailBytes:8,sizes:[3000],sourcePath:'docs/archive/matching-c-candidates/2026-10-10-func_002215D0-d685d8db29.c',sha256:'50E3BA0EA89EA8967638B07FB17436E9395112D0D27B0D9FDF7BB95143CFF1E4'});
assert(report.some(r=>r.tailBytes>0),'positive native tail required');
fs.writeFileSync(path.join(root,'report.json'),JSON.stringify({status:'pass',verifiedCompiler,report},null,2));console.log(JSON.stringify({status:'pass',root,report},null,2));
