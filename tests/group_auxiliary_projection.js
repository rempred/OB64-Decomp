#!/usr/bin/env node
'use strict';
const assert = require('assert/strict');
const fs = require('fs'), path = require('path');
const p7 = require('../tools/lib/phase7_conventional'), p8 = require('../tools/lib/phase8_matching_c');
const active = require('../tools/lib/active_targets'), groups = require('../tools/lib/compilation_groups');
const auxiliary = require('../tools/lib/auxiliary_projection'), policy = require('../tools/lib/source_policy');
const cache = require('../tools/lib/diff_object_cache'), tc = require('../tools/lib/text_contract');
const { assertToolchainAvailable, loadToolchainConfig, runTool } = require('../tools/lib/real_mips_toolchain');
const { ROOT, hex, sha256Buffer: hash } = p7;
const phase8 = active.loadActiveTargetModel();
const local = JSON.parse(fs.readFileSync(path.join(ROOT, 'config/local-tools.json')));
const verifiedCompiler = p8.verifyCompiler(phase8, local.compiler);
const tools = assertToolchainAvailable(loadToolchainConfig());
fs.mkdirSync(path.join(ROOT, 'build/tests'), { recursive: true });
const root = fs.mkdtempSync(path.join(ROOT, 'build/tests/group-auxiliary-'));
const sourceFile = path.join(root, 'producer.c');
const source = 'extern int external_call(int);\nint group_prefix(int x) { return external_call(x+1)+1; }\n'
  + 'int group_tables(int x, int y) { int a;\n'
  + 'switch(x) { case 0:a=external_call(11);break; case 1:a=external_call(23);break; case 2:a=external_call(37);break; case 3:a=external_call(41);break; case 4:a=external_call(59);break; default:a=3; }\n'
  + 'switch(y) { case 0:a+=external_call(61);break; case 1:a+=external_call(73);break; case 2:a+=external_call(89);break; case 3:a+=external_call(97);break; case 4:a+=external_call(101);break; case 5:a+=external_call(113);break; case 6:a+=external_call(127);break; default:a+=5; } return a; }\n'
  + 'int group_suffix(int x) { return group_tables(x,1)+7; }\n';
fs.writeFileSync(sourceFile, source);
const relative = path.relative(ROOT, sourceFile).replace(/\\/g, '/');
const preliminary = policy.classifyTargetSources([{ symbol: 'group_prefix', source: relative, bytes: 4 }]);
assert.equal(preliminary.targets[0].class, 'PURE_C');
fs.writeFileSync(path.join(root, 'input.c'), policy.compilationInputBytes(preliminary.targets[0]));
p7.run(local.compiler, [...phase8.config.compiler.compileFlags, '-o', path.join(root, 'compiler.s'), path.join(root, 'input.c')]);
policy.verifyClassificationInputs(preliminary.targets[0]);
runTool(tools.assemblerAbs, [...tools.compilerAssemblerFlags, '-o', path.join(root, 'native.o'), path.join(root, 'compiler.s')]);
const raw = p7.parseElfFile(path.join(root, 'native.o'));
const text = raw.sections.find(value => value.name === '.text'), ro = raw.sections.find(value => value.name === '.rodata');
const rawRo = Buffer.from(p7.elfSectionBytes(raw, ro));
const functions = raw.symbols.filter(value => value.symbolType === 2).map(value => ({ symbol: value.name, offset: value.value,
  bytes: value.size, binding: value.binding, symbolType: value.symbolType, visibility: value.visibility })).sort((a,b) => a.offset-b.offset);
assert.equal(functions.length, 3); assert(functions[1].offset > 0);
const end = functions.at(-1).offset + functions.at(-1).bytes;
assert(text.size > end, 'real native terminal alignment required');
const compiler = fs.readFileSync(path.join(root, 'compiler.s'));
const blocks = [...compiler.toString().matchAll(/\.section\s+\.rodata([^]*?)\s\.text/g)];
assert.equal(blocks.length, 2);
let cursor = 0;
const segments = [];
for (const [index, block] of blocks.entries()) {
  const offset = Math.ceil(cursor / ro.alignment) * ro.alignment;
  if (offset > cursor) segments.push({ kind: 'zero', offset: cursor, bytes: offset-cursor, ownerSection: '.ob64.r0011',
    ownerOffset: 0, ownerBytes: offset-cursor, expectedOwnerSha256: hash(Buffer.alloc(offset-cursor)) });
  const bytes = [...block[1].matchAll(/\.word\s+\.L\d+/g)].length * 4;
  segments.push({ kind: 'payload', offset, bytes, outputSection: index ? '.ob64.r0012' : '.ob64.r0010',
    label: /(?:^|\n)(\.L\d+):/.exec(block[1])[1], alignmentDirectives: [...block[1].matchAll(/\.align\s+(\d+)/g)].map(value => Number(value[1])) });
  cursor = offset + bytes;
}
segments.push({ kind: 'zero', offset: cursor, bytes: ro.size-cursor, ownerSection: '.ob64.r0013', ownerOffset: 0,
  ownerBytes: ro.size-cursor+8, expectedOwnerSha256: hash(Buffer.alloc(ro.size-cursor+8)) });
const projection = { schemaVersion: 1, mode: 'fixed-row-readonly-projection', compilerSection: '.rodata', bytes: ro.size,
  alignment: ro.alignment, expectedObjectSha256: hash(rawRo), segments };
const base = 0x80230000, textRom = 0x100, tableBase = 0x80240000, tableRom = 0x1000;
fs.writeFileSync(path.join(root, 'native.ld'), 'SECTIONS { .text '+hex(base)+' : { *(.text) } .rodata '+hex(tableBase)
  +' : { *(.rodata) } /DISCARD/ : { *(.reginfo) *(.pdr) *(.comment) *(.note) } }\nexternal_call = 0x80001234;\n');
runTool(tools.toolsAbs.linker, ['-T',path.join(root,'native.ld'),'-o',path.join(root,'native.elf'),path.join(root,'native.o')]);
const native = p7.parseElfFile(path.join(root,'native.elf'));
const linkedText = Buffer.from(p7.elfSectionBytes(native,native.sections.find(value=>value.name==='.text')));
const linkedRo = Buffer.from(p7.elfSectionBytes(native,native.sections.find(value=>value.name==='.rodata')));
const rom = Buffer.alloc(tableRom+ro.size+8); linkedText.copy(rom,textRom);linkedRo.copy(rom,tableRom);
const original = path.join(root,'original.s');
fs.writeFileSync(original,segments.filter(value=>value.kind==='zero').map(value=>'.section '+value.ownerSection+',"a",@progbits\n'
  +Array(value.ownerBytes/4).fill('.word 0').join('\n')).join('\n')+'\n');
const originalRelative=path.relative(ROOT,original).replace(/\\/g,'/');
const sections=segments.filter(value=>value.kind==='payload').map(value=>({kind:'switch-table',compilerSection:'.rodata',outputSection:value.outputSection,
  sectionType:'SHT_PROGBITS',sectionFlags:['SHF_ALLOC'],alignment:ro.alignment,romStart:hex(tableRom+value.offset),
  romEndExclusive:hex(tableRom+value.offset+value.bytes),vramStart:hex(tableBase+value.offset),vramEndExclusive:hex(tableBase+value.offset+value.bytes),
  bytes:value.bytes,entries:value.bytes/4,expectedObjectSha256:hash(rawRo.subarray(value.offset,value.offset+value.bytes)),
  expectedLinkedSha256:hash(linkedRo.subarray(value.offset,value.offset+value.bytes)),preservedTail:null,
  expectedRelocations:Array.from({length:value.bytes/4},(_,index)=>({offset:hex(index*4),type:'R_MIPS_32',symbol:'.text',
    addend:hex(rawRo.readUInt32BE(value.offset+index*4)),section:'.rel.rodata'}))}));
const group={id:'composed_fixture',source:relative,mode:'native-text-readonly-owner-projection',
  members:functions.map((value,index)=>({symbol:value.symbol,ownerRowIndex:index+1})),
  text:{section:'.text',bytes:text.size,alignment:text.alignment,type:1,flags:6,sha256:hash(p7.elfSectionBytes(raw,text))},functions,
  tail:{offset:end,bytes:text.size-end,sha256:hash(Buffer.alloc(text.size-end)),origin:'native-assembler-section-alignment'},
  relocations:groups.relocations(raw).filter(value=>value.owner.name==='.text').map(value=>({offset:value.place,type:value.type,
    symbol:value.symbol.symbolType===3?raw.sections[value.symbol.sectionIndex].name:value.symbol.name,symbolValue:value.symbol.value,
    symbolSection:value.symbol.sectionIndex===0?'UND':raw.sections[value.symbol.sectionIndex].name,word:raw.buffer.readUInt32BE(text.offset+value.place)})),
  auxiliary:{memberSymbol:'group_tables',sections,projection}};
groups.registry({schemaVersion:1,profile:'fixture',groups:[group]},'fixture');
function row(index, start, bytes, vram, executable) {return {index,primaryId:'fixture:'+index,primaryClass:executable?'code':'data',ambiguous:false,
  inputKind:'tracked-assembly',romStart:start,romEndExclusive:start+bytes,bytes,
  part:{file:originalRelative,sha256:p7.sha256File(original),chunkIndex:0,name:'fixture_owner_'+index,symbolByteOffset:0},
  slices:[{sectionName:'.ob64.r'+String(index).padStart(4,'0'),executable,bytes,romStart:start,romEndExclusive:start+bytes,
    vramStart:vram,vramEndExclusive:vram+bytes,placementKind:'overlay',overlayDescriptorId:99,overlaySection:executable?'text':'data-rodata',loadSlabId:null}]};}
const model={overlays:[],rows:[...functions.map((value,index)=>row(index+1,textRom+value.offset,value.bytes+(index===2?group.tail.bytes:0),base+value.offset,true)),
  ...segments.map(value=>row(Number((value.outputSection||value.ownerSection).slice(7)),tableRom+value.offset,value.kind==='payload'?value.bytes:value.ownerBytes,tableBase+value.offset,false))]};
model.slices=model.rows.flatMap(value=>value.slices);
const targets=functions.map((fun,index)=>{const r=model.rows[index],s=r.slices[0];const owner={ownerIndex:0,sectionName:s.sectionName,symbol:fun.symbol,rowIndex:r.index,
  primaryId:r.primaryId,chunkIndex:0,logicalOffset:0,logicalEnd:r.bytes,bytes:r.bytes,romStartNumber:r.romStart,romEndNumber:r.romEndExclusive,
  vramStartNumber:s.vramStart,vramEndNumber:s.vramEndExclusive,expectedTextSha256:hash(rom.subarray(r.romStart,r.romEndExclusive)),
  originalAssembly:originalRelative,originalAssemblySha256:r.part.sha256,row:r};return {...owner,symbol:fun.symbol,source:relative,sourceSha256:p7.sha256File(sourceFile),
  compilationGroupId:group.id,textOwners:[owner],compilerTextFunctions:[],compilerTextFunctionsExplicit:false,auxiliarySections:[],model,row:r,rows:[r],
  overlayDescriptorId:99,descriptorRawSha256:'0'.repeat(64),legacyAncillaryRelocations:[],relocationContractSource:'compilation-group'};});
groups.bind([group],targets,{model,baserom:rom});
const bound=targets[0].compilationGroup, attribution=targets[1];
active.validateAuxiliaryOwnerGroups(targets);auxiliary.validateCensus(targets);
const result=groups.project(raw.buffer,bound);
assert.deepEqual(auxiliary.conservedOutsideReadonly(p7.parseElf32BigEndian(result.intermediate),bound),
  auxiliary.conservedOutsideReadonly(p7.parseElf32BigEndian(result.buffer),bound));
const rejected=[];
function reject(name,callback,pattern){assert.throws(callback,pattern,name);rejected.push(name);}
function rawReject(name,mutate,pattern){const bytes=Buffer.from(raw.buffer),contract=structuredClone(bound);mutate(bytes,contract);
  reject(name,()=>auxiliary.groupCensus(p7.parseElf32BigEndian(bytes),contract,'raw'),pattern);}
function registryReject(name,mutate){const copy=structuredClone(group);mutate(copy);reject(name,()=>groups.registry({schemaVersion:1,profile:'fixture',groups:[copy]},'fixture'));}
registryReject('missing auxiliary bundle',value=>delete value.auxiliary);
registryReject('ordinary mode with auxiliary bundle',value=>value.mode='native-text-owner-projection');
registryReject('unknown attribution member',value=>value.auxiliary.memberSymbol='unknown');
registryReject('missing table payload',value=>value.auxiliary.sections.pop());
registryReject('reordered table payloads',value=>value.auxiliary.sections.reverse());
registryReject('unexpected composed capability',value=>value.auxiliary.extra=true);
registryReject('legacy source-prefix combination',value=>value.auxiliary.sections[0].sourceObjectPrefix={});
const badPlacement=structuredClone(model);badPlacement.rows.find(value=>value.index===12).slices[0].overlayDescriptorId++;
reject('same spacing different auxiliary overlay',()=>auxiliary.retainedBindings(attribution,badPlacement,rom));
const badRom=Buffer.from(rom);badRom[badRom.length-1]=1;
reject('retained final eight original bytes',()=>auxiliary.retainedBindings(attribution,model,badRom));
const duplicateClaim=structuredClone(targets);duplicateClaim[0].auxiliarySections=duplicateClaim[1].auxiliarySections;
reject('duplicate member auxiliary attribution',()=>auxiliary.validateCensus(duplicateClaim));
reject('check-only row claimed by another C owner',()=>auxiliary.validateCensus([...targets,{auxiliarySections:[{outputSection:'.ob64.r0011'}]}]));
const relText=raw.sections.find(value=>value.name==='.rel.text'), relRo=raw.sections.find(value=>value.name==='.rel.rodata');
const symbolTable=raw.sections.find(value=>value.type===2), marker=raw.symbols.find(value=>value.name==='gcc2_compiled.');
const roSymbol=raw.symbols.find(value=>value.symbolType===3&&value.sectionIndex===ro.index);
const textSymbol=raw.symbols.find(value=>value.symbolType===3&&value.sectionIndex===text.index);
const relEntries=Array.from({length:relText.size/8},(_,index)=>relText.offset+index*8);
const roHigh=relEntries.find(offset=>(raw.buffer.readUInt32BE(offset+4)>>>8)===roSymbol.symbolIndex&&(raw.buffer.readUInt32BE(offset+4)&255)===5);
const roLow=relEntries.find(offset=>(raw.buffer.readUInt32BE(offset+4)>>>8)===roSymbol.symbolIndex&&(raw.buffer.readUInt32BE(offset+4)&255)===6);
const call=relEntries.find(offset=>(raw.buffer.readUInt32BE(offset+4)&255)===4);
assert(roHigh!==undefined&&roLow!==undefined&&call!==undefined);
for(const [name,offset,value] of [['visibility',13,2],['reserved st_other',13,0x80],['binding',12,0x11],['section-type marker',12,3]])
  rawReject('native marker '+name,bytes=>{bytes[symbolTable.offset+marker.symbolIndex*16+offset]=value;},/marker/);
rawReject('native marker incoming relocation',bytes=>bytes.writeUInt32BE((marker.symbolIndex<<8)|4,call+4),/marker/);
rawReject('cross-member HI16 LO16',bytes=>bytes.writeUInt32BE(0,roHigh),/cross-owner/);
rawReject('other-member auxiliary reference',bytes=>{
  const highPlace=raw.buffer.readUInt32BE(roHigh),lowPlace=raw.buffer.readUInt32BE(roLow);
  bytes.writeUInt32BE(raw.buffer.readUInt32BE(text.offset+highPlace),text.offset);
  bytes.writeUInt32BE(raw.buffer.readUInt32BE(text.offset+lowPlace),text.offset+4);
  bytes.writeUInt32BE(0,roHigh);bytes.writeUInt32BE(4,roLow);
},/attribution/);
rawReject('auxiliary padding reference',bytes=>{const place=bytes.readUInt32BE(roLow),word=bytes.readUInt32BE(text.offset+place);
  bytes.writeUInt32BE(((word&0xffff0000)|20)>>>0,text.offset+place);},/padding/);
rawReject('text-tail reference',bytes=>{const place=bytes.readUInt32BE(call),word=bytes.readUInt32BE(text.offset+place);
  bytes.writeUInt32BE((textSymbol.symbolIndex<<8)|4,call+4);bytes.writeUInt32BE(((word&0xfc000000)|(end/4))>>>0,text.offset+place);},/tail/);
for(const [name,value] of [['other-member table target',0],['native text-tail table target',end]]) rawReject(name,(bytes,contract)=>{
  bytes.writeUInt32BE(value,ro.offset);contract.auxiliary.projection.expectedObjectSha256=hash(bytes.subarray(ro.offset,ro.offset+ro.size));
  contract.auxiliary.sections[0].expectedRelocations[0].addend=hex(value);
},/attributed function/);
rawReject('table relocation on padding',bytes=>bytes.writeUInt32BE(20,relRo.offset),/place/);
rawReject('crossing table relocation',bytes=>bytes.writeUInt32BE(18,relRo.offset),/place/);
rawReject('unmapped table relocation',bytes=>bytes.writeUInt32BE(ro.size,relRo.offset),/place/);
rawReject('duplicate table relocation',bytes=>bytes.writeUInt32BE(4,relRo.offset),/place/);
rawReject('wrong table relocation anchor',bytes=>bytes.writeUInt32BE((roSymbol.symbolIndex<<8)|2,relRo.offset+4),/anchor/);
rawReject('nonzero native RO padding',(bytes,contract)=>{bytes[ro.offset+20]=1;contract.auxiliary.projection.expectedObjectSha256=hash(bytes.subarray(ro.offset,ro.offset+ro.size));},/padding/);
const intermediate=p7.parseElf32BigEndian(result.intermediate);
for(const [name,mutate] of [
  ['changed prior text byte',bytes=>{bytes[intermediate.sections.find(value=>value.name===targets[0].sectionName).offset]^=1;}],
  ['changed prior relocation info',bytes=>{const section=intermediate.sections.find(value=>value.name==='.rel'+targets[0].sectionName);bytes[section.offset+7]^=1;}],
  ['changed prior marker metadata',bytes=>{const table=intermediate.sections.find(value=>value.type===2);bytes[table.offset+marker.symbolIndex*16+13]=2;}],
]){const bytes=Buffer.from(result.intermediate);mutate(bytes);reject(name,()=>auxiliary.projectGroupReadonly(bytes,bound));}
const changedReg=p7.parseElf32BigEndian(Buffer.from(result.buffer));changedReg.buffer[changedReg.sections.find(value=>value.name==='.reginfo').offset]^=1;
reject('RO stage metadata conservation',()=>assert.deepEqual(auxiliary.conservedOutsideReadonly(intermediate,bound),auxiliary.conservedOutsideReadonly(changedReg,bound)));
const output=path.join(root,'compiled');fs.mkdirSync(output);
const classifications=policy.classifyTargetSources(targets);
const compiled=[];
for(const [index,target] of targets.entries()){
  const record=p8.compileTarget({...phase8,targets},target,output,local.compiler,tools.assemblerAbs,tools.objcopyAbs,{classification:classifications.targets[index]});
  const inspected=cache.inspectCompiledTargetArtifacts({phase8,target,classification:classifications.targets[index],files:cache.outputArtifactFiles(output,target)});
  assert.deepEqual(record,inspected);compiled.push(record);
}
fs.mkdirSync(path.join(output,'objects/assembly'),{recursive:true});
runTool(tools.assemblerAbs,[...tools.compilerAssemblerFlags,'-o',path.join(output,'objects/assembly/chunk_000.raw.o'),original]);
runTool(tools.objcopyAbs,['--remove-section=.reginfo',path.join(output,'objects/assembly/chunk_000.raw.o'),path.join(output,'objects/assembly/chunk_000.o')]);
const script='OUTPUT_ARCH(mips)\nSECTIONS {\n'+model.rows.map(value=>value.slices[0].sectionName+' '+hex(value.slices[0].vramStart)
  +' : AT('+hex(value.romStart)+') { *('+value.slices[0].sectionName+') }').join('\n')
  +'\n.bss 0 (NOLOAD) : { objects/c/groups/composed_fixture.o(.bss) }\n/DISCARD/ : { *(.reginfo) *(.pdr) *(.comment) *(.note) } }\nexternal_call = 0x80001234;\n'
  +attribution.auxiliarySections.map(value=>value.ownerSymbol+' = '+hex(value.ownerSymbolVram)+';').join('\n');
fs.writeFileSync(path.join(output,'fixture.ld'),script);
runTool(tools.toolsAbs.linker,['-T','fixture.ld','-Map','phase8.map','-o','phase8.elf',groups.objectPath(targets[0]),'objects/assembly/chunk_000.o'],{cwd:output});
const linked=p7.parseElfFile(path.join(output,'phase8.elf'));
for(const target of targets)assert(p7.elfSectionBytes(linked,linked.sections.find(value=>value.name===target.sectionName)).equals(rom.subarray(target.romStartNumber,target.romEndNumber)));
for(const section of attribution.auxiliarySections)assert(p8.compareLinkedAuxiliaryBytes(attribution,section,linked,rom).rawBytesExact);
const proofs=targets.map((target,index)=>p8.deriveSourceObjectProof(phase8,target,output,classifications.targets[index],linked,rom));
const sharedLink=require('../tools/lib/text_contract').linkContext(output,rom,linked);
for(const [index,target] of targets.entries()){
  const prepared=p8.deriveSourceObjectProof(phase8,target,output,classifications.targets[index],linked,rom,sharedLink);
  assert(prepared.proofBytes.equals(proofs[index].proofBytes),'prepared and standalone proof bytes differ');
}
require('../tools/lib/text_contract').finishLinkContext(sharedLink);
for(const proof of proofs)p8.validateSourceObjectProofBytes(proof.proofBytes,proof.proofBytes);
const stripped=p7.parseElfFile(path.join(output,groups.objectPath(targets[0])));
const strippedSymbols=stripped.sections.find(value=>value.type===2);
const secondRO=stripped.sections.find(value=>value.name===attribution.auxiliarySections[1].outputSection);
const addedSymbol=stripped.symbols.find(value=>value.sectionIndex===secondRO.index&&value.symbolType===3);
assert(addedSymbol);
for(const [name,offset,value,width] of [['value',4,4,4],['size',8,4,4],['binding',12,0x13,1],['type',12,1,1],
  ['visibility',13,2,1],['reserved st_other',13,0x80,1],['wrong section',14,stripped.sections.find(value=>value.name==='.data').index,2]]){
  const bytes=Buffer.from(stripped.buffer),position=strippedSymbols.offset+addedSymbol.symbolIndex*16+offset;
  if(width===4)bytes.writeUInt32BE(value,position);else if(width===2)bytes.writeUInt16BE(value,position);else bytes[position]=value;
  reject('stripped added section symbol '+name,()=>auxiliary.groupCensus(p7.parseElf32BigEndian(bytes),bound,'stripped'),/anchor\/symbol/);
}
const stripRel=stripped.sections.find(value=>value.name==='.rel'+targets[0].sectionName);
const stripCall=Array.from({length:stripRel.size/8},(_,index)=>stripRel.offset+index*8).find(offset=>(stripped.buffer.readUInt32BE(offset+4)&255)===4);
assert.notEqual(stripCall,undefined);
const addedReference=Buffer.from(stripped.buffer);addedReference.writeUInt32BE((addedSymbol.symbolIndex<<8)|4,stripCall+4);
reject('stripped added section symbol incoming reference',()=>auxiliary.groupCensus(p7.parseElf32BigEndian(addedReference),bound,'stripped'),/non-first/);
for(const field of Object.keys(proofs[1].proof.objectEvidence.composition)){
  const copy=structuredClone(proofs[1].proof);delete copy.objectEvidence.composition[field];const bytes=Buffer.from(JSON.stringify(copy));
  reject('self-compared missing composition '+field,()=>p8.validateSourceObjectProofBytes(bytes,bytes));
}
for(const field of ['nativeObjectSha256','textProjectedObjectSha256','projectedObjectSha256','strippedObjectSha256']){
  for(const value of ['not-a-hash','0'.repeat(64)]){const copy=structuredClone(proofs[1].proof);copy.objectEvidence.composition[field]=value;
    const bytes=Buffer.from(JSON.stringify(copy));reject('self-compared invalid/binding '+field+' '+value.slice(0,8),()=>p8.validateSourceObjectProofBytes(bytes,bytes));}
}
for(const stage of ['raw','textProjected','projected','stripped']){
  const copy=structuredClone(proofs[1].proof);delete copy.objectEvidence.producerStages[stage].completeCensus;const bytes=Buffer.from(JSON.stringify(copy));
  reject('self-compared missing stage census '+stage,()=>p8.validateSourceObjectProofBytes(bytes,bytes));
}
const extraProof=structuredClone(proofs[1].proof);extraProof.objectEvidence.composition.extra=true;
const proofReject=(name,mutate)=>{const copy=structuredClone(proofs[1].proof);mutate(copy);const bytes=Buffer.from(JSON.stringify(copy));
  reject('self-compared '+name,()=>p8.validateSourceObjectProofBytes(bytes,bytes));};
for(const name of ['raw','textProjected','projected','stripped']){
  for(const field of Object.keys(proofs[1].proof.objectEvidence.producerStages[name]))
    proofReject(name+' omitted '+field,p=>{delete p.objectEvidence.producerStages[name][field];});
  for(const field of Object.keys(proofs[1].proof.objectEvidence.producerStages[name].auxiliary))
    proofReject(name+' omitted auxiliary '+field,p=>{delete p.objectEvidence.producerStages[name].auxiliary[field];});
  for(const [label,mutate] of [
    ['stage version',s=>{s.schemaVersion=999;}],['stage extra',s=>{s.extra=true;}],
    ['stage bytes',s=>{s.bytes++;}],['text relocations empty',s=>{s.relocations=[];}],
    ['text relocation word',s=>{s.relocations[0].word^=1;}],['references empty',s=>{s.auxiliary.references=[];}],
    ['reference addend',s=>{s.auxiliary.references[0].addend++;}],['auxiliary extra',s=>{s.auxiliary.extra=true;}],
    ['payload bytes',s=>{s.auxiliary.payloadBytes++;}],['marker section',s=>{s.auxiliary.marker.section='.wrong';}],
    ['census sections empty',s=>{s.completeCensus.sections=[];}],['census symbols empty',s=>{s.completeCensus.symbols=[];}],
    ['census relocations empty',s=>{s.completeCensus.relocations=[];}],['census header omitted',s=>{delete s.completeCensus.header;}],
    ['header section count',s=>{s.completeCensus.header.shnum++;}],['header artifact extent',s=>{s.completeCensus.header.shoff=0xffffffff;}],
    ['section hash malformed',s=>{s.completeCensus.sections[1].sha256='invalid';}],
    ['section size',s=>{s.completeCensus.sections[1].size++;}],['symbol omission',s=>{s.completeCensus.symbols.pop();}],
    ['unexpected allocated section',s=>{s.completeCensus.sections.find(v=>v.name==='.strtab').flags=2;}],
    ['read-only symbol visibility',s=>{const names=['.rodata',...bound.auxiliary.sections.map(v=>v.outputSection)];
      s.completeCensus.symbols.find(v=>names.includes(s.completeCensus.sections[v.sectionIndex]?.name)).visibility=2;}],
    ['relocation census word',s=>{s.completeCensus.relocations[0].word^=1;}],
    ['relocation section identity',s=>{s.completeCensus.sections.find(v=>v.type===9).sha256='0'.repeat(64);}]
  ])proofReject(name+' '+label,p=>mutate(p.objectEvidence.producerStages[name]));
}
proofReject('retained rows empty',p=>{p.linkEvidence.auxiliaryProjectionRetained=[];});
proofReject('retained row missing',p=>{p.linkEvidence.auxiliaryProjectionRetained.pop();});
proofReject('retained rows reordered',p=>{p.linkEvidence.auxiliaryProjectionRetained.reverse();});
for(const field of Object.keys(proofs[1].proof.linkEvidence.auxiliaryProjectionRetained[0]))
  proofReject('retained omitted '+field,p=>{delete p.linkEvidence.auxiliaryProjectionRetained[0][field];});
for(const [field,value] of [['ownerBytes',1],['objectPath','wrong.o'],['objectSha256','invalid'],['loadIndex',-1],['contributionCount',2],['fullRowExact',false]])
  proofReject('retained inconsistent '+field,p=>{p.linkEvidence.auxiliaryProjectionRetained[0][field]=value;});
const extraBytes=Buffer.from(JSON.stringify(extraProof));reject('unknown composed proof field',()=>p8.validateSourceObjectProofBytes(extraBytes,extraBytes));
const accounting=require('../tools/lib/status_accounting').summarizeAcceptedOwnership(model,targets);
assert.equal(accounting.replacements.bytes,text.size+48);assert.equal(accounting.assembly.bytes,16);
const options={phase8:{...phase8,targets},compiler:local.compiler,verifiedCompiler,
  assembler:{bytes:fs.statSync(tools.assemblerAbs).size,sha256:p7.sha256File(tools.assemblerAbs)},
  objcopy:{bytes:fs.statSync(tools.objcopyAbs).size,sha256:p7.sha256File(tools.objcopyAbs)},assemblerPath:tools.assemblerAbs,objcopyPath:tools.objcopyAbs,
  preprocessor:classifications.preprocessor,cacheRoot:path.join(root,'cache')};
let cacheKey;
for(const expected of ['miss','hit']){const dest=path.join(root,'cache-'+expected);fs.mkdirSync(dest);
  const value=cache.compileOrReuseTarget({...options,target:targets[0],classification:classifications.targets[0],output:dest});assert.equal(value.cache.status,expected);cacheKey=value.cache.key;}
const metadataFile=path.join(cache.cacheEntryPath(options.cacheRoot,targets[0],cacheKey),'metadata.json');
const metadata=JSON.parse(fs.readFileSync(metadataFile));
for(const key of ['nativeObjectSha256','textProjectedObjectSha256','auxiliaryContract']){
  const changed=structuredClone(metadata);delete changed.compiled.objectEvidence.composition[key];fs.writeFileSync(metadataFile,JSON.stringify(changed));
  reject('stale cache omitted composition '+key,()=>cache.validateCacheEntry({...options,target:targets[0],classification:classifications.targets[0],keyMaterial:metadata.keyMaterial}));
}
fs.writeFileSync(metadataFile,JSON.stringify(metadata));
const files=cache.outputArtifactFiles(output,targets[0]);
const missingIntermediate={...files};delete missingIntermediate['text-projected.o'];
reject('cache missing intermediate artifact',()=>cache.inspectCompiledTargetArtifacts({phase8,target:targets[0],classification:classifications.targets[0],files:missingIntermediate}));
const savedProjected=fs.readFileSync(files['source-object.o']);
try{const bytes=Buffer.from(savedProjected),elf=p7.parseElf32BigEndian(bytes),other=elf.sections.find(value=>value.name===targets[2].sectionName);
  bytes[other.offset]^=1;fs.writeFileSync(files['source-object.o'],bytes);
  reject('member-only reuse omits changed sibling',()=>cache.inspectCompiledTargetArtifacts({phase8,target:targets[0],classification:classifications.targets[0],files}));
}finally{fs.writeFileSync(files['source-object.o'],savedProjected);}
const objectFile=path.join(output,groups.objectPath(targets[0]));
const records=targets.map(target=>({ownerKind:'matching-c-target',targetSymbol:target.symbol,path:groups.objectPath(target),bytes:fs.statSync(objectFile).size,sha256:p7.sha256File(objectFile)}));
assert.equal(groups.collapseManifest(records,{targets}).length,1);
reject('incomplete producer manifest',()=>groups.collapseManifest(records.slice(1),{targets}));
const report={status:'pass',scope:'isolated composed producer fixture',sourceClass:classifications.targets[0].class,
  textBytes:text.size,functions,tail:group.tail,payloadBytes:48,nativeReadOnlyBytes:ro.size,retainedASMBytes:16,rejections:rejected,output:root};
fs.writeFileSync(path.join(root,'report.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
