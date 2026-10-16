#!/usr/bin/env node
'use strict';
// Private native regression producers; neither fixture activates a retail owner.
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
const root=fs.mkdtempSync(path.join(ROOT,'build/tests/paired-owner-projection-'));
const retail=fs.readFileSync(path.join(ROOT,'build/baserom.us_rev0.z64'));
const externalRegistry=require('../tools/lib/logical_functions').loadRegistry(context.model,retail);
const {resolveExternalEntry}=require('./accepted_external_entry');
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
 const source=spec.fixture?fs.readFileSync(path.join(__dirname,'fixtures',spec.fixture)):Buffer.from(spec.source);
 if(spec.sha256)assert.equal(hash(source),spec.sha256,'tracked source bytes');
 const capture=compile(dir,source,spec.symbol),{raw}=capture;
 const text=raw.sections.find(s=>s.name==='.text'),ro=raw.sections.find(s=>s.name==='.rodata');
 const functions=raw.symbols.filter(s=>s.symbolType===2).map(s=>({symbol:s.name,offset:s.value,bytes:s.size,binding:s.binding,symbolType:s.symbolType,visibility:s.visibility})).sort((a,b)=>a.offset-b.offset);
 assert.equal(functions.length,2);assert(functions.every(f=>f.binding===1));
 const end=functions.at(-1).offset+functions.at(-1).bytes;
 if(spec.sizes)assert.deepEqual(functions.map(f=>f.bytes),spec.sizes);
 if(spec.textBytes)assert.equal(text.size,spec.textBytes);
 if(spec.tailBytes!==undefined)assert.equal(text.size-end,spec.tailBytes);
 const rels=groups.relocations(raw).filter(r=>r.owner.name==='.text');
 if(spec.relocationCount)assert.equal(rels.length,spec.relocationCount);
 const group={id:spec.id,source:capture.relative,mode:spec.table?'native-text-readonly-owner-projection':'native-text-owner-projection',
  members:[],text:{section:'.text',bytes:text.size,alignment:text.alignment,type:1,flags:6,sha256:hash(p7.elfSectionBytes(raw,text))},functions,
  tail:{offset:end,bytes:text.size-end,sha256:hash(Buffer.alloc(text.size-end)),origin:'native-assembler-section-alignment'},
  relocations:rels.map(r=>({offset:r.place,type:r.type,symbol:r.symbol.symbolType===3?raw.sections[r.symbol.sectionIndex].name:r.symbol.name,
   symbolValue:r.symbol.value,symbolSection:r.symbol.sectionIndex===0?'UND':r.symbol.sectionIndex===0xfff1?'ABS':raw.sections[r.symbol.sectionIndex].name,word:raw.buffer.readUInt32BE(text.offset+r.place)}))};
 const original=path.join(dir,'original.s');fs.writeFileSync(original,'.text\n');
 const originalRelative=path.relative(ROOT,original).replace(/\\/g,'/');
 function syntheticRow(index,start,bytes,vram,executable){return {index,primaryId:'fixture:'+index,primaryClass:executable?'code':'data',ambiguous:false,inputKind:'tracked-assembly',romStart:start,romEndExclusive:start+bytes,bytes,
  part:{file:originalRelative,sha256:p7.sha256File(original),chunkIndex:0,name:'fixture_owner_'+index,symbolByteOffset:0},
  slices:[{sectionName:'.ob64.r'+String(index).padStart(4,'0'),executable,bytes,romStart:start,romEndExclusive:start+bytes,vramStart:vram,vramEndExclusive:vram+bytes,placementKind:'overlay',overlayDescriptorId:99,overlaySection:executable?'text':'data-rodata',loadSlabId:null}]};}
 const rows=spec.fixture?functions.map(f=>active.resolveAcceptedRow(context.model,f.symbol)):functions.map((f,i)=>syntheticRow(i+1,0x100+f.offset,f.bytes+(i===1?group.tail.bytes:0),0x80230000+f.offset,true));
 const tableRow=spec.table?(spec.fixture?context.model.rows.find(r=>r.romStart===0x142810):syntheticRow(10,0x1000,ro.size,0x80240000,false)):null;
 if(spec.table){assert(ro);assert.equal(ro.size,spec.tableBytes);assert.equal(tableRow.bytes,ro.size);}else assert(!ro||!ro.size);
 // Private link census contains exactly these unchanged authenticated owner rows.
 const model={overlays:[],rows:[...rows,tableRow].filter(Boolean)};model.slices=model.rows.flatMap(r=>r.slices);
 group.members=functions.map((f,i)=>({symbol:f.symbol,ownerRowIndex:rows[i].index}));
 const base=rows[0].slices[0].vramStart;
 const assignments=new Map();
 for(const symbol of raw.symbols.filter(s=>s.sectionIndex===0&&s.name)){
  let address=context.linkSymbols[symbol.name];
  if(address===undefined){
   // VRAM-labelled externs encode their address, ROM-labelled functions resolve
   // through accepted rows. Never apply a linear ROM-to-RAM approximation.
   const literal=/^(?:func|D)_(8[0-9A-Fa-f]{7})$/.exec(symbol.name);
   if(literal)address=parseInt(literal[1],16);
   else if(symbol.name==='external_call'&&!spec.fixture)address=0x80001234;
   else address=resolveExternalEntry(context,externalRegistry,symbol.name);
  }
  assignments.set(symbol.name,typeof address==='string'?parseInt(address,16):address);
 }
 const externs=[...assignments].map(([name,value])=>name+' = '+hex(value)+';').join('\n');
 const nativeScript='OUTPUT_ARCH(mips)\nSECTIONS { .text '+hex(base)+' : { *(.text) } '+(ro?'.rodata '+hex(tableRow.slices[0].vramStart)+' : { *(.rodata) } ':'')+' .bss 0 (NOLOAD) : { *(.bss) } /DISCARD/ : { *(.reginfo) *(.pdr) *(.comment) *(.note) } }\n'+externs;
 fs.writeFileSync(path.join(dir,'native.ld'),nativeScript);
 runTool(tools.toolsAbs.linker,['-T',path.join(dir,'native.ld'),'-o',path.join(dir,'native.elf'),path.join(dir,'native.o')]);
 const native=p7.parseElfFile(path.join(dir,'native.elf'));
 const nativeText=p7.elfSectionBytes(native,native.sections.find(s=>s.name==='.text'));
 const rom=spec.fixture?retail:Buffer.alloc(0x2000);
 if(!spec.fixture){nativeText.copy(rom,rows[0].romStart);if(ro)p7.elfSectionBytes(native,native.sections.find(s=>s.name==='.rodata')).copy(rom,tableRow.romStart);}
 assert(nativeText.equals(rom.subarray(rows[0].romStart,rows.at(-1).romEndExclusive)),'entire native owner pair, including owned tail, differs');
 if(spec.table){
  const rawRo=p7.elfSectionBytes(raw,ro),slice=tableRow.slices[0];
  const blocks=[...capture.assembly.toString().matchAll(/\.section\s+\.rodata([^]*?)\s\.text/g)];assert.equal(blocks.length,1);
  const linkedRo=p7.elfSectionBytes(native,native.sections.find(s=>s.name==='.rodata'));
  assert(linkedRo.equals(rom.subarray(tableRow.romStart,tableRow.romEndExclusive)));
  const section={memberSymbol:functions[1].symbol,kind:'switch-table',compilerSection:'.rodata',outputSection:slice.sectionName,sectionType:'SHT_PROGBITS',sectionFlags:['SHF_ALLOC'],alignment:ro.alignment,
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
 const rejected=[];function reject(name,fn){assert.throws(fn,undefined,name);rejected.push(name);}
 function registryReject(name,mutate){const c=structuredClone(group);mutate(c);reject(name,()=>groups.registry({schemaVersion:1,profile:'fixture',groups:[c]},'fixture'));}
 for(const [name,mutate] of [
  ['duplicate place',g=>{g.relocations[1].offset=g.relocations[0].offset;}],['invalid type',g=>{g.relocations[0].type=2;}],
  ['unaligned place',g=>{g.relocations[0].offset++;}],['tail place',g=>{g.relocations[0].offset=end;}],
  ['unknown section',g=>{g.relocations[0].symbolSection='.unknown';}],['missing owner',g=>{g.members.pop();}],
  ['duplicate owner',g=>{g.members[1]=g.members[0];}],['owned tail fabrication',g=>{g.tail.bytes+=4;}],
  ['missing HI',g=>{const lo=g.relocations.find(r=>r.type===6);assert(lo);g.relocations=g.relocations.filter(r=>!(r.type===5&&r.symbol===lo.symbol&&r.symbolSection===lo.symbolSection&&r.symbolValue===lo.symbolValue));}],
  ['member interleaving',g=>{const index=g.relocations.findIndex(r=>r.offset>=functions[1].offset);g.relocations.push(g.relocations.shift());assert(index>0);}],
 ])registryReject(name,mutate);
 registryReject('same-symbol cross-owner HI/LO',g=>{
  const high=g.relocations.find(r=>r.type===5&&r.offset>=functions[1].offset);assert(high);
  let place=0;while(g.relocations.some(r=>r.offset===place))place+=4;assert(place<functions[1].offset);
  high.offset=place;g.relocations.splice(g.relocations.indexOf(high),1);g.relocations.unshift(high);
 });
 const missing=structuredClone(targets);reject('indivisible activation',()=>groups.bind([group],missing.slice(1),{model,baserom:rom}));
 function objectReject(name,bytes,stage='raw',contract=bound){reject(name,()=>groups.validateObject(p7.parseElf32BigEndian(bytes),contract,stage));}
 if(group.tail.bytes){const nonzero=Buffer.from(raw.buffer);nonzero[text.offset+end]=1;objectReject('owned tail nonzero',nonzero);}
 const relSection=raw.sections.find(s=>s.name==='.rel.text');
 const badSymbol=Buffer.from(raw.buffer);badSymbol.writeUInt32BE(0xffffff04,relSection.offset+4);objectReject('unknown symbol',badSymbol);
 const descending=group.relocations.some((r,i)=>i&&r.offset<group.relocations[i-1].offset);
 if(spec.descent)assert(descending,'fixture must exercise actual native order descent');
 if(descending){
  const sorted=structuredClone(bound);sorted.relocations.sort((a,b)=>a.offset-b.offset);
  reject('hostile sorted contract',()=>groups.validateObject(raw,sorted,'raw'));
  const projected=p7.parseElf32BigEndian(result.buffer),bytes=Buffer.from(result.buffer);
  for(const s of projected.sections.filter(s=>s.type===9&&bound.owners.some(o=>o.sectionName===projected.sections[s.info].name))){
   const records=Array.from({length:s.size/8},(_,i)=>Buffer.from(bytes.subarray(s.offset+i*8,s.offset+i*8+8))).sort((a,b)=>a.readUInt32BE()-b.readUInt32BE());Buffer.concat(records).copy(bytes,s.offset);
  }
  objectReject('hostile sorted projected native REL stream',bytes,'projected');
 }
 if(spec.table){
  const standalone=group.auxiliary.sections.map(({memberSymbol,...s})=>s);
  reject('standalone one payload stays unsupported',()=>auxiliary.normalize(group.auxiliary.projection,standalone));
  const segment=group.auxiliary.projection.segments[0];
  const occurrence={label:segment.label,offset:hex(0),bytes:ro.size,entries:ro.size/4,alignment:ro.alignment,alignmentDirectives:segment.alignmentDirectives};
  const grammar={auxiliarySections:[{compilerSection:'.rodata',outputSection:segment.outputSection,bytes:ro.size,compilerOccurrences:[occurrence]}]};
  reject('standalone one occurrence stays unsupported',()=>p8.adjustSectionAssembly(capture.assembly,targets[0].sectionName,grammar));
  reject('malformed composed grammar context',()=>p8.adjustSectionAssembly(capture.assembly,targets[0].sectionName,{...grammar,composedGroup:{...bound,members:[]}}));
  const occurrenceContract={...standalone[0],compilerOccurrences:[occurrence]};
  reject('standalone normalized one occurrence',()=>active.normalizeAuxiliarySectionContracts([occurrenceContract],group.id,'fixture',group.auxiliary.projection));
  // Group payload contracts do not contain transient compiler occurrences.
  const normalized=active.normalizeAuxiliarySectionContracts(standalone,group.id,'fixture',group.auxiliary.projection,group);
  assert.equal(normalized.length,1);assert.equal(normalized[0].outputSection,standalone[0].outputSection);
  reject('mismatched composed normalization context',()=>active.normalizeAuxiliarySectionContracts([occurrenceContract],group.id,'fixture',group.auxiliary.projection,bound));
  registryReject('ordinary mode rejects rodata',g=>{delete g.auxiliary;g.mode='native-text-owner-projection';});
  registryReject('unknown dispatch member',g=>{g.auxiliary.sections[0].memberSymbol='unknown';});
  const wrong=structuredClone(bound);wrong.auxiliary.sections[0].memberSymbol=functions[0].symbol;
  reject('wrong dispatch member',()=>groups.validateObject(raw,wrong,'raw'));
  for(const value of [0,end,functions[1].offset+functions[1].bytes,functions[1].offset+1]){
   const c=structuredClone(bound),bytes=Buffer.from(raw.buffer);bytes.writeUInt32BE(value,ro.offset);
   c.auxiliary.projection.expectedObjectSha256=hash(bytes.subarray(ro.offset,ro.offset+ro.size));c.auxiliary.sections[0].expectedObjectSha256=c.auxiliary.projection.expectedObjectSha256;c.auxiliary.sections[0].expectedRelocations[0].addend=hex(value);
   objectReject('wrong dispatch destination '+value,bytes,'raw',c);
  }
  const hi=rels.find(r=>r.type===5&&r.symbol.symbolType===3&&r.symbol.sectionIndex===ro.index),lo=rels.find(r=>r.type===6&&r.symbol.symbolType===3&&r.symbol.sectionIndex===ro.index);
  assert(hi&&lo);
  const bytes=Buffer.from(raw.buffer);
  for(const [rel,place] of [[hi,0],[lo,4]]){bytes.writeUInt32BE(raw.buffer.readUInt32BE(text.offset+rel.place),text.offset+place);const index=rels.indexOf(rel);bytes.writeUInt32BE(place,relSection.offset+index*8);}
  reject('other member table reference',()=>auxiliary.groupCensus(p7.parseElf32BigEndian(bytes),bound,'raw'));
 }
 if(spec.table){
  const altered=structuredClone(model);altered.rows.find(r=>r.index===tableRow.index).part.sha256='0'.repeat(64);
  const unbound=targets.map(t=>({...structuredClone(t),auxiliarySections:[],compilerTextFunctionsExplicit:false}));
  reject('table original source authentication',()=>groups.bind([group],unbound,{model:altered,baserom:rom}));
  const changed=structuredClone(model);changed.rows.find(r=>r.index===tableRow.index).slices[0].overlayDescriptorId++;
  reject('table placement ownership',()=>groups.bind([group],unbound,{model:changed,baserom:rom}));
 }
 const output=path.join(dir,'compiled');fs.mkdirSync(output);
 const classifications=policy.classifyTargetSources(targets);
 for(const [i,target] of targets.entries()){
  const compiled=p8.compileTarget({...context,targets},target,output,local.compiler,tools.assemblerAbs,tools.objcopyAbs,{classification:classifications.targets[i]});
  assert.deepEqual(compiled,cache.inspectCompiledTargetArtifacts({phase8:context,target,classification:classifications.targets[i],files:cache.outputArtifactFiles(output,target)}));
 }
 const outputRows=[...rows,...(tableRow?[tableRow]:[])].sort((a,b)=>a.slices[0].vramStart-b.slices[0].vramStart);
 const ld='OUTPUT_ARCH(mips)\nSECTIONS {\n'+outputRows.map(r=>r.slices[0].sectionName+' '+hex(r.slices[0].vramStart)+' : AT('+hex(r.romStart)+') { *('+r.slices[0].sectionName+') }').join('\n')+'\n.bss 0 (NOLOAD) : { '+groups.objectPath(targets[0])+'(.bss) } /DISCARD/ : { *(.reginfo) *(.pdr) *(.comment) *(.note) } }\n'+externs+'\n'+(bound.auxiliary?.sections||[]).map(s=>s.ownerSymbol+' = '+hex(s.ownerSymbolVram)+';').join('\n');
 fs.writeFileSync(path.join(output,'fixture.ld'),ld);
 runTool(tools.toolsAbs.linker,['-T','fixture.ld','-Map','phase8.map','-o','phase8.elf',groups.objectPath(targets[0])],{cwd:output});
 const linked=p7.parseElfFile(path.join(output,'phase8.elf'));
 for(const r of outputRows)assert(p7.elfSectionBytes(linked,linked.sections.find(s=>s.name===r.slices[0].sectionName)).equals(rom.subarray(r.romStart,r.romEndExclusive)),'projected/stripped/private-linked full row');
 const proofs=targets.map((target,i)=>p8.deriveSourceObjectProof(context,target,output,classifications.targets[i],linked,rom));
 for(const p of proofs)p8.validateSourceObjectProofBytes(p.proofBytes,p.proofBytes);
 if(spec.table){
  // Rebind every earlier contract/hash check so this reaches the instruction
  // alignment guard, rather than failing merely on stale proof metadata.
  const misaligned=structuredClone(proofs[0].proof),producer=misaligned.textContract.producer;
  const roBytes=Buffer.from(p7.elfSectionBytes(raw,ro)),destination=functions[1].offset+1;
  roBytes.writeUInt32BE(destination,0);
  producer.auxiliary.projection.expectedObjectSha256=hash(roBytes);
  producer.auxiliary.sections[0].expectedObjectSha256=hash(roBytes);
  producer.auxiliary.sections[0].expectedRelocations[0].addend=hex(destination);
  const tableName=producer.auxiliary.sections[0].outputSection;
  for(const stage of Object.values(misaligned.objectEvidence.producerStages)){
   stage.auxiliary.nativeSha256=hash(roBytes);stage.auxiliary.tableRelocations[0].word=destination;
   for(const section of stage.completeCensus.sections)if(section.name==='.rodata'||section.name===tableName)section.sha256=hash(roBytes);
   for(const relocation of stage.completeCensus.relocations)if((relocation.owner==='.rodata'||relocation.owner===tableName)&&relocation.place===0)relocation.word=destination;
   stage.groupSha256=tc.hash(producer);
  }
  misaligned.objectEvidence.composition.groupSha256=tc.hash(producer);
  misaligned.objectEvidence.composition.auxiliaryContract=structuredClone(producer.auxiliary);
  misaligned.objectEvidence.textContractSha256=tc.hash(misaligned.textContract);
  misaligned.linkEvidence.textContractSha256=tc.hash(misaligned.textContract);
  const misalignedBytes=Buffer.from(JSON.stringify(misaligned));
  assert.throws(()=>p8.validateSourceObjectProofBytes(misalignedBytes,misalignedBytes),/composed table instruction destination alignment/);
  rejected.push('self-compared rehashed misaligned table instruction destination');
  for(const [name,mutate] of [
   ['native order',p=>p.objectEvidence.producerStages.raw.relocations.reverse()],
   ['table attribution',p=>{p.textContract.producer.auxiliary.sections[0].memberSymbol=functions[0].symbol;}],
   ['missing table',p=>{p.textContract.producer.auxiliary.sections=[];}],
  ]){const proof=structuredClone(proofs[0].proof);mutate(proof);const producer=proof.textContract.producer,identity=tc.hash(producer);
   proof.objectEvidence.composition.groupSha256=identity;proof.objectEvidence.composition.auxiliaryContract=structuredClone(producer.auxiliary);
   for(const stage of Object.values(proof.objectEvidence.producerStages))stage.groupSha256=identity;
   proof.objectEvidence.textContractSha256=tc.hash(proof.textContract);proof.linkEvidence.textContractSha256=tc.hash(proof.textContract);
   const bytes=Buffer.from(JSON.stringify(proof));reject('self-compared rehashed proof '+name,()=>p8.validateSourceObjectProofBytes(bytes,bytes));
  }
 }
 const options={phase8:{...context,targets},compiler:local.compiler,verifiedCompiler,assembler:{bytes:fs.statSync(tools.assemblerAbs).size,sha256:p7.sha256File(tools.assemblerAbs)},objcopy:{bytes:fs.statSync(tools.objcopyAbs).size,sha256:p7.sha256File(tools.objcopyAbs)},assemblerPath:tools.assemblerAbs,objcopyPath:tools.objcopyAbs,preprocessor:classifications.preprocessor,cacheRoot:path.join(dir,'cache')};
 let key;
 for(const expected of ['miss','hit']){const dest=path.join(dir,'cache-'+expected);fs.mkdirSync(dest);const value=cache.compileOrReuseTarget({...options,target:targets[0],classification:classifications.targets[0],output:dest});assert.equal(value.cache.status,expected);key=value.cache.key;}
 const metadataFile=path.join(cache.cacheEntryPath(options.cacheRoot,targets[0],key),'metadata.json'),metadata=JSON.parse(fs.readFileSync(metadataFile));
 const mutations=[['owned tail',g=>{g.tail.bytes+=4;}],['native order',g=>{g.relocations.reverse();}],...(spec.table?[['dispatch attribution',g=>{g.auxiliary.sections[0].memberSymbol=functions[0].symbol;}]]:[])];
 for(const [name,mutate] of mutations){const target=structuredClone(targets[0]);mutate(target.compilationGroup);
  reject('warm artifacts '+name,()=>cache.inspectCompiledTargetArtifacts({phase8:context,target,classification:classifications.targets[0],files:cache.outputArtifactFiles(output,targets[0])}));
  reject('fresh proof '+name,()=>p8.deriveSourceObjectProof(context,target,output,classifications.targets[0],linked,rom));
 }
 const corrupt=structuredClone(metadata);corrupt.compiled.objectEvidence.producerStages.raw.relocations.reverse();fs.writeFileSync(metadataFile,JSON.stringify(corrupt));
 reject('warm serialized order metadata',()=>cache.validateCacheEntry({...options,target:targets[0],classification:classifications.targets[0],keyMaterial:metadata.keyMaterial}));fs.writeFileSync(metadataFile,JSON.stringify(metadata));
 const changedSource=source.toString().replace(spec.nonmatchFrom,spec.nonmatchTo);assert.notEqual(changedSource,source.toString());
 const negative=compile(dir,changedSource,spec.symbol,'nonmatching');assert.notEqual(hash(negative.raw.buffer),hash(raw.buffer));reject('genuinely compiled nonmatch',()=>groups.validateObject(negative.raw,bound,'raw'));
 report.push({id:spec.id,sourceSha256:hash(source),rawSha256:hash(raw.buffer),functions,textBytes:text.size,tailBytes:group.tail.bytes,relocations:rels.length,descent:descending,tableBytes:ro?.size||0,rejections:rejected,retail:!!spec.fixture,sourceClass:capture.classification.class});
}
exercise({id:'paired_order',symbol:'func_00125460',fixture:'paired_owner_125460_125f84.c',sha256:'BDB7E616AEC19A47974ACD712C0470982DADCF648369FCE0534103CEE7ECCD73',sizes:[2852,2024],textBytes:4880,tailBytes:4,relocationCount:139,descent:true,nonmatchFrom:'FIELD(unit, s32, 0x6C) = 1;',nonmatchTo:'FIELD(unit, s32, 0x6C) = 2;'});
exercise({id:'paired_table',symbol:'func_00107D60',fixture:'paired_owner_107d60_107e38.c',sha256:'C692B3D3B04F995C321D08B06B9C58D448E46E61929C130D21DDB43D97C8794F',sizes:[216,1728],textBytes:1952,tailBytes:8,relocationCount:31,table:true,tableBytes:32,nonmatchFrom:'0x5A',nonmatchTo:'0x5B'});
exercise({id:'unrelated_one_table',symbol:'unrelated_prefix',table:true,tableBytes:32,
 source:'extern int external_call(int);\nint unrelated_prefix(int x) { return external_call(x+1)+1; }\nint unrelated_dispatch(int x) { switch(x) { case 0:return external_call(11);case 1:return external_call(23);case 2:return external_call(37);case 3:return external_call(41);case 4:return external_call(59);case 5:return external_call(61);case 6:return external_call(73);case 7:return external_call(89);default:return 3; } }\n',nonmatchFrom:'external_call(11)',nonmatchTo:'external_call(12)'});
fs.writeFileSync(path.join(root,'report.json'),JSON.stringify({status:'pass',verifiedCompiler,report},null,2));console.log(JSON.stringify({status:'pass',root,report},null,2));
