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
function runFixture(multipleMembers, interiorRun = false) {
fs.mkdirSync(path.join(ROOT, 'build/tests'), { recursive: true });
const root = fs.mkdtempSync(path.join(ROOT, 'build/tests/group-auxiliary-'));
const sourceFile = path.join(root, 'producer.c');
const prefixCases=multipleMembers?6:5, suffixCases=multipleMembers?6:5;
const switchSource=(name,count)=>'int '+name+'(int x) { switch(x) {'+Array.from({length:count},(_,i)=>'case '+i+':return external_call('+(211+i*13)+');').join('')+'default:return external_call(x)'+(interiorRun&&multipleMembers&&name==='group_suffix'?'*2':'')+'+3;} }\n';
const source = 'extern int external_call(int);\n'+switchSource('group_prefix',prefixCases)
  + 'int group_tables(int x, int y) { int a;\n'
  + 'switch(x) { case 0:a=external_call(11);break; case 1:a=external_call(23);break; case 2:a=external_call(37);break; case 3:a=external_call(41);break; case 4:a=external_call(59);break; default:a=3; }\n'
  + 'switch(y) { case 0:a+=external_call(61);break; case 1:a+=external_call(73);break; case 2:a+=external_call(89);break; case 3:a+=external_call(97);break; case 4:a+=external_call(101);break; case 5:a+=external_call(113);break; case 6:a+=external_call(127);break; default:a+=5; } return a; }\n'
  + switchSource('group_suffix',suffixCases);
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
if(interiorRun&&multipleMembers)assert.equal(text.size-end,0,'actual zero text tail fixture');
if (!multipleMembers) assert(text.size > end, 'real native terminal alignment required');
const compiler = fs.readFileSync(path.join(root, 'compiler.s'));
const blocks = [...compiler.toString().matchAll(/\.section\s+\.rodata([^]*?)\s\.text/g)];
assert.equal(blocks.length,4);
let cursor=0;
const occurrences=blocks.map((block,index)=>{
  const alignmentDirectives=[...block[1].matchAll(/\.align\s+(\d+)/g)].map(v=>Number(v[1]));
  for(const power of alignmentDirectives)cursor=Math.ceil(cursor/2**power)*2**power;
  const value={label:/(?:^|\n)(\.L\d+):/.exec(block[1])[1],memberSymbol:index===0?'group_prefix':index===3?'group_suffix':'group_tables',
    offset:cursor,bytes:[...block[1].matchAll(/\.word\s+\.L\d+/g)].length*4,alignmentDirectives};
  cursor+=value.bytes;return value;
});
const segments=[];
for(const [index,items] of [occurrences.slice(0,2),occurrences.slice(2)].entries()){
  const offset=items[0].offset, previous=segments.length?segments.at(-1).offset+segments.at(-1).bytes:0;
  if(offset>previous)segments.push({kind:'zero',offset:previous,bytes:offset-previous,ownerSection:'.ob64.r'+String(9+index*2).padStart(4,'0'),ownerOffset:0,ownerBytes:offset-previous,expectedOwnerSha256:hash(Buffer.alloc(offset-previous))});
  segments.push({kind:'payload',offset,bytes:items.at(-1).offset+items.at(-1).bytes-offset,outputSection:'.ob64.r'+String(10+index*2).padStart(4,'0'),occurrences:items});
}
if(ro.size>cursor)segments.push({kind:'zero',offset:cursor,bytes:ro.size-cursor,ownerSection:'.ob64.r0015',ownerOffset:0,ownerBytes:ro.size-cursor+8,expectedOwnerSha256:hash(Buffer.alloc(ro.size-cursor+8))});
const projection={schemaVersion:5,mode:'fixed-row-readonly-projection',compilerSection:'.rodata',bytes:ro.size,alignment:ro.alignment,expectedObjectSha256:hash(rawRo),segments};
const base = (multipleMembers?0x80238000:0x80230000)+(interiorRun?(multipleMembers?12:8):0), textRom = 0x400, tableBase = multipleMembers?0x80248000:0x80240000, tableRom = 0x1000;
fs.writeFileSync(path.join(root, 'native.ld'), 'SECTIONS { .text '+hex(base)+' : { *(.text) } .rodata '+hex(tableBase)
  +' : { *(.rodata) } /DISCARD/ : { *(.reginfo) *(.pdr) *(.comment) *(.note) } }\nexternal_call = 0x80001234;\n');
let referenceObject=path.join(root,'native.o');
if(interiorRun){const reference=Buffer.from(raw.buffer);reference.writeUInt32BE(4,raw.header.shoff+text.index*40+32);referenceObject=path.join(root,'reference-placement.o');fs.writeFileSync(referenceObject,reference);}
runTool(tools.toolsAbs.linker, ['-T',path.join(root,'native.ld'),'-o',path.join(root,'native.elf'),referenceObject]);
const native = p7.parseElfFile(path.join(root,'native.elf'));
const linkedText = Buffer.from(p7.elfSectionBytes(native,native.sections.find(value=>value.name==='.text')));
const linkedRo = Buffer.from(p7.elfSectionBytes(native,native.sections.find(value=>value.name==='.rodata')));
const rom = Buffer.alloc(tableRom+ro.size+8); linkedText.copy(rom,textRom);linkedRo.copy(rom,tableRom);
const original = path.join(root,'original.s');
fs.writeFileSync(original,segments.filter(value=>value.kind==='zero').map(value=>'.section '+value.ownerSection+',"a",@progbits\n'
  +Array(value.ownerBytes/4).fill('.word 0').join('\n')).join('\n')+'\n');
const originalRelative=path.relative(ROOT,original).replace(/\\/g,'/');
const sections=segments.filter(value=>value.kind==='payload').map((value,index)=>({kind:'switch-table',compilerSection:'.rodata',outputSection:value.outputSection,
  sectionType:'SHT_PROGBITS',sectionFlags:['SHF_ALLOC'],alignment:ro.alignment,romStart:hex(tableRom+value.offset),
  romEndExclusive:hex(tableRom+value.offset+value.bytes),vramStart:hex(tableBase+value.offset),vramEndExclusive:hex(tableBase+value.offset+value.bytes),
  bytes:value.bytes,entries:value.occurrences.reduce((n,o)=>n+o.bytes/4,0),expectedObjectSha256:hash(rawRo.subarray(value.offset,value.offset+value.bytes)),
  expectedLinkedSha256:hash(linkedRo.subarray(value.offset,value.offset+value.bytes)),preservedTail:null,
  expectedRelocations:value.occurrences.flatMap(o=>Array.from({length:o.bytes/4},(_,index)=>({offset:hex(o.offset-value.offset+index*4),type:'R_MIPS_32',symbol:'.text',addend:hex(rawRo.readUInt32BE(o.offset+index*4)),section:'.rel.rodata'})))}));
const group={id:'composed_fixture',source:relative,mode:interiorRun?'native-text-readonly-interior-run-projection':'native-text-readonly-owner-projection',
  ...(interiorRun?{interiorRun:{schemaVersion:1,mode:'accepted-interior-member-run',outputAlignment:4,precedingOwnerRowIndex:50,followingOwnerRowIndex:51,expectedProjectedTextSha256:hash(Buffer.from(p7.elfSectionBytes(raw,text)).subarray(0,end))}}:{}),
  members:functions.map((value,index)=>({symbol:value.symbol,ownerRowIndex:index+1})),
  text:{section:'.text',bytes:text.size,alignment:text.alignment,type:1,flags:6,sha256:hash(p7.elfSectionBytes(raw,text))},functions,
  tail:{offset:end,bytes:text.size-end,sha256:hash(Buffer.alloc(text.size-end)),origin:interiorRun?'native-subset-artifact':'native-assembler-section-alignment'},
  relocations:groups.relocations(raw).filter(value=>value.owner.name==='.text').map(value=>({offset:value.place,type:value.type,
    symbol:value.symbol.symbolType===3?raw.sections[value.symbol.sectionIndex].name:value.symbol.name,symbolValue:value.symbol.value,
    symbolSection:value.symbol.sectionIndex===0?'UND':raw.sections[value.symbol.sectionIndex].name,word:raw.buffer.readUInt32BE(text.offset+value.place)})),
  auxiliary:{sections,projection}};
groups.registry({schemaVersion:1,profile:'fixture',groups:[group]},'fixture');
function row(index, start, bytes, vram, executable) {return {index,primaryId:'fixture:'+index,primaryClass:executable?'code':'data',ambiguous:false,
  inputKind:'tracked-assembly',romStart:start,romEndExclusive:start+bytes,bytes,
  part:{file:originalRelative,sha256:p7.sha256File(original),chunkIndex:0,name:'fixture_owner_'+index,symbolByteOffset:0},
  slices:[{sectionName:'.ob64.r'+String(index).padStart(4,'0'),executable,bytes,romStart:start,romEndExclusive:start+bytes,
    vramStart:vram,vramEndExclusive:vram+bytes,placementKind:'overlay',overlayDescriptorId:99,overlaySection:executable?'text':'data-rodata',loadSlabId:null}]};}
const model={config:{rom:{bytes:rom.length},expected:{nonDescriptorLoadSlabs:0},nonDescriptorLoadSlabs:[]},
  nonDescriptorLoadSlabs:[],overlays:[],rows:[...functions.map((value,index)=>row(index+1,textRom+value.offset,value.bytes+(index===2&&!interiorRun?group.tail.bytes:0),base+value.offset,true)),
  ...segments.map(value=>row(Number((value.outputSection||value.ownerSection).slice(7)),tableRom+value.offset,value.kind==='payload'?value.bytes:value.ownerBytes,tableBase+value.offset,false))]};
if(interiorRun){
  // Adjacent rows use complete authentic compiler functions, without their
  // standalone terminal alignment. They remain original-ASM fixture owners.
  const before=linkedText.subarray(0,functions[0].bytes),after=linkedText.subarray(functions[2].offset,functions[2].offset+functions[2].bytes);
  before.copy(rom,textRom-before.length);after.copy(rom,textRom+end);
  model.rows.push(row(50,textRom-before.length,before.length,base-before.length,true),row(51,textRom+end,after.length,base+end,true));
  const wordSource=r=>'.section '+r.slices[0].sectionName+',"'+(r.slices[0].executable?'ax':'a')+'",@progbits\n'
    +Array.from({length:r.bytes/4},(_,i)=>'/* '+hex(r.romStart+i*4)+' */ .word '+hex(rom.readUInt32BE(r.romStart+i*4))).join('\n')+'\n';
  const originalSources=path.join(root,'original-sources.s');
  fs.writeFileSync(originalSources,model.rows.map(wordSource).join('\n'));
  fs.writeFileSync(original,model.rows.filter(r=>r.index>=50||segments.some(s=>s.kind==='zero'&&Number(s.ownerSection.slice(7))===r.index)).map(wordSource).join('\n'));
  for(const r of model.rows){r.part.file=path.relative(ROOT,originalSources).replaceAll('\\','/');r.part.sha256=p7.sha256File(originalSources);}
}
model.slices=model.rows.flatMap(value=>value.slices);
functions.forEach((fun,index)=>{model.rows[index].part.name=fun.symbol;});
const targets=functions.map((fun,index)=>{const r=model.rows[index],s=r.slices[0];const owner={ownerIndex:0,sectionName:s.sectionName,symbol:fun.symbol,rowIndex:r.index,
  primaryId:r.primaryId,chunkIndex:0,logicalOffset:0,logicalEnd:r.bytes,bytes:r.bytes,romStartNumber:r.romStart,romEndNumber:r.romEndExclusive,
  vramStartNumber:s.vramStart,vramEndNumber:s.vramEndExclusive,expectedTextSha256:hash(rom.subarray(r.romStart,r.romEndExclusive)),
  originalAssembly:r.part.file,originalAssemblySha256:r.part.sha256,row:r};return {...owner,symbol:fun.symbol,source:relative,sourceSha256:p7.sha256File(sourceFile),
  compilationGroupId:group.id,textOwners:[owner],compilerTextFunctions:[],compilerTextFunctionsExplicit:false,auxiliarySections:[],model,row:r,rows:[r],
  overlayDescriptorId:99,descriptorRawSha256:'0'.repeat(64),legacyAncillaryRelocations:[],relocationContractSource:'compilation-group'};});
groups.bind([group],targets,{model,baserom:rom});
const bound=targets[0].compilationGroup, attribution=targets[1];
active.validateAuxiliaryOwnerGroups(targets, model);auxiliary.validateCensus(targets);
const result=groups.project(raw.buffer,bound);
assert.deepEqual(auxiliary.conservedOutsideReadonly(p7.parseElf32BigEndian(result.intermediate),bound),
  auxiliary.conservedOutsideReadonly(p7.parseElf32BigEndian(result.buffer),bound));
const rejected=[];
function reject(name,callback,pattern){assert.throws(callback,pattern,name);rejected.push(name);}
const output=path.join(root,'compiled');fs.mkdirSync(output);
const classifications=policy.classifyTargetSources(targets);
// Independent oracle: compiler.s blocks and actual native bytes/relocations, not the helper under test.
const rawTableRelocations=groups.relocations(raw).filter(r=>r.owner.name==='.rodata');
const expectedOccurrences=section=>{
  const payload=segments.find(s=>s.kind==='payload'&&s.outputSection===section.outputSection);assert(payload);
  let end=0;
  return payload.occurrences.map(o=>{
    const offset=o.offset-payload.offset,bytes=rawRo.subarray(o.offset,o.offset+o.bytes);
    const rels=rawTableRelocations.filter(r=>r.place>=o.offset&&r.place<o.offset+o.bytes).map(r=>{
      assert.equal(r.type,2);assert.equal(raw.sections[r.symbol.sectionIndex].name,'.text');
      return {offset:hex(r.place-payload.offset),type:'R_MIPS_32',symbol:'.text',addend:hex(rawRo.readUInt32BE(r.place)),section:'.rel.rodata'};
    });
    assert.equal(rels.length,o.bytes/4);
    const padding=rawRo.subarray(payload.offset+end,o.offset);assert(padding.every(b=>b===0));
    const expected={label:o.label,offset:hex(offset),bytes:o.bytes,entries:o.bytes/4,alignment:ro.alignment,
      alignmentDirectives:o.alignmentDirectives,
      ...(offset>end?{paddingBefore:{offset:hex(end),bytes:offset-end,expectedSha256:hash(padding)}}:{}),
      objectSha256:hash(bytes),acceptedObjectSha256:hash(bytes),expectedLinkedSha256:hash(linkedRo.subarray(o.offset,o.offset+o.bytes)),
      loadRelevantRelocationsNormalized:rels};end=offset+o.bytes;return expected;
  });
};
assert(targets.some(t=>t.auxiliarySections.some(s=>Array.isArray(s.compilerOccurrences)&&s.compilerOccurrences.length>=2)), 'nonvacuous grouped occurrence contract');
if(!multipleMembers)assert(targets.some(t=>t.auxiliarySections.some(s=>expectedOccurrences(s).some(o=>o.paddingBefore))), 'real internal padding fixture');
function assertOccurrenceRecords(record,target){
  for(const value of [record,JSON.parse(JSON.stringify(record))]){
    assert.equal(value.auxiliarySections.length,target.auxiliarySections.length);
    for(const section of target.auxiliarySections){
      const actual=value.auxiliarySections.find(a=>a.outputSection===section.outputSection);assert(actual);
      assert(Object.hasOwn(actual,'compilerOccurrences'),'required compiled occurrence field');
      assert.deepEqual(actual.compilerOccurrences,expectedOccurrences(section));
    }
  }
}
const compiled=[];
for(const [index,target] of targets.entries()){
  const record=p8.compileTarget({...phase8,targets},target,output,local.compiler,tools.assemblerAbs,tools.objcopyAbs,{classification:classifications.targets[index]});
  const inspected=cache.inspectCompiledTargetArtifacts({phase8,target,classification:classifications.targets[index],files:cache.outputArtifactFiles(output,target)});
  assertOccurrenceRecords(record,target);assertOccurrenceRecords(inspected,target);
  assert.deepEqual(record,inspected);compiled.push(record);
}
fs.mkdirSync(path.join(output,'objects/assembly'),{recursive:true});
runTool(tools.assemblerAbs,[...tools.compilerAssemblerFlags,'-o',path.join(output,'objects/assembly/chunk_000.raw.o'),original]);
runTool(tools.objcopyAbs,['--remove-section=.reginfo',path.join(output,'objects/assembly/chunk_000.raw.o'),path.join(output,'objects/assembly/chunk_000.o')]);
const script='OUTPUT_ARCH(mips)\nSECTIONS {\n'+model.rows.map(value=>value.slices[0].sectionName+' '+hex(value.slices[0].vramStart)
  +' : AT('+hex(value.romStart)+') { *('+value.slices[0].sectionName+') }').join('\n')
  +'\n.bss 0 (NOLOAD) : { objects/c/groups/composed_fixture.o(.bss) }\n/DISCARD/ : { *(.reginfo) *(.pdr) *(.comment) *(.note) } }\nexternal_call = 0x80001234;\n'
  +bound.auxiliary.sections.map(value=>value.ownerSymbol+' = '+hex(value.ownerSymbolVram)+';').join('\n');
fs.writeFileSync(path.join(output,'fixture.ld'),script);
runTool(tools.toolsAbs.linker,['-T','fixture.ld','-Map','phase8.map','-o','phase8.elf',groups.objectPath(targets[0]),'objects/assembly/chunk_000.o'],{cwd:output});
const linked=p7.parseElfFile(path.join(output,'phase8.elf'));
for(const target of targets)assert(p7.elfSectionBytes(linked,linked.sections.find(value=>value.name===target.sectionName)).equals(rom.subarray(target.romStartNumber,target.romEndNumber)));
for(const target of targets)for(const section of target.auxiliarySections)assert(p8.compareLinkedAuxiliaryBytes(target,section,linked,rom).rawBytesExact);
const proofs=targets.map((target,index)=>p8.deriveSourceObjectProof(phase8,target,output,classifications.targets[index],linked,rom));
const sharedLink=require('../tools/lib/text_contract').linkContext(output,rom,linked);
for(const [index,target] of targets.entries()){
  const prepared=p8.deriveSourceObjectProof(phase8,target,output,classifications.targets[index],linked,rom,sharedLink);
  assert(prepared.proofBytes.equals(proofs[index].proofBytes),'prepared and standalone proof bytes differ');
}
require('../tools/lib/text_contract').finishLinkContext(sharedLink);
for(const proof of proofs)p8.validateSourceObjectProofBytes(proof.proofBytes,proof.proofBytes);

assert.equal(targets[2].auxiliarySections.length,0,'suffix has tables without row custody');
assert.equal(proofs[2].proof.textContract.memberOccurrences.length,1);
function registryReject(name,mutate){const copy=structuredClone(group);mutate(copy);reject(name,()=>groups.registry({schemaVersion:1,profile:'fixture',groups:[copy]},'fixture'));}
for(const [name,mutate] of [
 ['legacy v1 substitution',g=>g.auxiliary.projection.schemaVersion=1],['atomic v4 substitution',g=>g.auxiliary.projection.schemaVersion=4],
 ['single-owner mode substitution',g=>g.mode='native-text-readonly-single-owner-projection'],
 ['missing member',g=>delete g.auxiliary.projection.segments[0].occurrences[0].memberSymbol],
 ['unknown member',g=>g.auxiliary.projection.segments[0].occurrences[0].memberSymbol='unknown'],
 ['row-wide attribution',g=>g.auxiliary.sections[0].memberSymbol='group_prefix'],
 ['duplicate occurrence',g=>g.auxiliary.projection.segments[0].occurrences.push(g.auxiliary.projection.segments[0].occurrences[0])],
 ['missing pointer',g=>g.auxiliary.sections[0].expectedRelocations.pop()],
 ['crossing row boundary',g=>g.auxiliary.projection.segments[0].occurrences[0].bytes+=32],
 ['nonminimal gap',g=>g.auxiliary.projection.segments[0].occurrences[1].offset+=8]
])registryReject(name,mutate);
const relro=raw.sections.find(s=>s.name==='.rel.rodata');
for(const [name,mutate] of [
 ['wrong member', (bytes,g)=>g.auxiliary.projection.segments[0].occurrences[0].memberSymbol='group_suffix'],
 ['duplicate place',(bytes,g)=>bytes.writeUInt32BE(bytes.readUInt32BE(relro.offset+8),relro.offset)],
 ['padding relocation',(bytes,g)=>bytes.writeUInt32BE(auxiliary.bundlePadding(g)[0].offset,relro.offset)],
 ['padding changed',(bytes,g)=>{bytes[ro.offset+auxiliary.bundlePadding(g)[0].offset]=1;g.auxiliary.projection.expectedObjectSha256=hash(bytes.subarray(ro.offset,ro.offset+ro.size));}]
]){const bytes=Buffer.from(raw.buffer),g=structuredClone(bound);mutate(bytes,g);reject(name,()=>groups.validateObject(p7.parseElf32BigEndian(bytes),g,'raw'));}
const proofReject=(name,mutate)=>{const p=structuredClone(proofs[2].proof);mutate(p);const b=Buffer.from(JSON.stringify(p));reject(name,()=>p8.validateSourceObjectProofBytes(b,b));};
for(const [name,mutate] of [
 ['member occurrence omitted',p=>p.textContract.memberOccurrences=[]], ['old text schema',p=>p.textContract.schemaVersion=4],
 ['old object schema',p=>p.objectEvidence.schemaVersion=7],['old composition schema',p=>p.objectEvidence.composition.schemaVersion=2],
 ['missing intermediate',p=>delete p.objectEvidence.artifacts.textProjectedObject],['missing retained row',p=>p.linkEvidence.auxiliaryProjectionRetained=[]]
]){if(name==='missing retained row'&&!bound.auxiliary.retained.length)continue;proofReject(name,mutate);}
for(const stage of ['raw','textProjected','projected','stripped']){
 for(const field of ['occurrenceEvidence','paddingEvidence'])proofReject(stage+' missing '+field,p=>delete p.objectEvidence.producerStages[stage].auxiliary[field]);
 proofReject(stage+' attribution forged',p=>p.objectEvidence.producerStages[stage].auxiliary.occurrenceEvidence[0].memberSymbol='group_suffix');
 proofReject(stage+' occurrence relocation dropped',p=>p.objectEvidence.producerStages[stage].auxiliary.occurrenceEvidence[0].relocations.pop());
}

// Public entry points must independently reject stale or broadened claims.
const missingMember=structuredClone(targets);missingMember[2].auxiliarySections=missingMember[0].auxiliarySections;
reject('duplicate reporting custody',()=>auxiliary.validateCensus(missingMember));
reject('incomplete active group',()=>auxiliary.validateCensus(targets.slice(1)));
reject('standalone cannot admit group-only projection',()=>auxiliary.normalize(group.auxiliary.projection,group.auxiliary.sections));
const contributorModel=structuredClone(model),contributor=contributorModel.rows.find(r=>r.index===3);
contributor.slices[0].overlayDescriptorId++;
reject('noncustodian contributor placement forged',()=>active.resolveAuxiliarySectionContracts(contributorModel,rom,targets[1],targets[1].auxiliarySections));
const contributorGroup=structuredClone(bound),contributorModel2=structuredClone(model),contributor2=contributorModel2.rows.find(r=>r.index===3);
contributor2.part.chunkIndex++;contributorGroup.owners[2].chunkIndex++;
reject('cross-chunk text contributor requires accepted loader slab',()=>active.resolveAuxiliarySectionContracts(contributorModel2,rom,{...targets[1],compilationGroup:contributorGroup},targets[1].auxiliarySections));
const strippedFile=path.join(output,groups.objectPath(targets[0])),savedLinked=fs.readFileSync(path.join(output,'phase8.elf'));
for(const [name,file,position] of [
 ['on-disk native artifact changed',path.join(output,groups.objectPath(targets[0],'.assembler-object.o')),raw.sections.find(s=>s.name==='.text').offset],
 ['on-disk projected artifact changed',path.join(output,groups.objectPath(targets[0],'.source-object.o')),p7.parseElfFile(path.join(output,groups.objectPath(targets[0],'.source-object.o'))).sections.find(s=>s.name===targets[2].sectionName).offset],
 ['on-disk linked bytes changed',path.join(output,'phase8.elf'),linked.sections.find(s=>s.name===targets[2].sectionName).offset]
]){const old=fs.readFileSync(file);try{const changed=Buffer.from(old);changed[position]^=1;fs.writeFileSync(file,changed);reject(name,()=>p8.validateSourceObjectProofBytes(proofs[2].proofBytes,proofs[2].proofBytes));}finally{fs.writeFileSync(file,old);}}
const mapFile=path.join(output,'phase8.map'),oldMap=fs.readFileSync(mapFile);
try{fs.writeFileSync(mapFile,oldMap.toString().replaceAll(groups.objectPath(targets[0]),'forged.o'));reject('on-disk sole-owner map changed',()=>p8.validateSourceObjectProofBytes(proofs[2].proofBytes,proofs[2].proofBytes));}finally{fs.writeFileSync(mapFile,oldMap);}
proofReject('fully rehashed report cannot invent table attribution',p=>{
 p.textContract.producer.auxiliary.projection.segments[0].occurrences[0].memberSymbol='group_suffix';
 const id=tc.hash(p.textContract.producer);p.objectEvidence.composition.groupSha256=id;p.objectEvidence.composition.auxiliaryContract=structuredClone(p.textContract.producer.auxiliary);
 for(const st of Object.values(p.objectEvidence.producerStages))st.groupSha256=id;
 p.objectEvidence.textContractSha256=tc.hash(p.textContract);p.linkEvidence.textContractSha256=tc.hash(p.textContract);
});
if(interiorRun){
 for(const [name,mutate] of [
  ['old mode cannot borrow interior contract',g=>g.mode='native-text-readonly-owner-projection'],
  ['native alignment lowered',g=>g.text.alignment=4], ['output alignment broadened',g=>g.interiorRun.outputAlignment=8],
  ['nonminimal native tail',g=>g.tail.bytes+=4], ['native tail given original origin',g=>g.tail.origin='native-assembler-section-alignment'],
  ['extra interior capability',g=>g.interiorRun.allowPadding=true]
 ])registryReject(name,mutate);
 for(const [name,mutate] of [
  ['terminal return replaced by fallthrough',(b,g)=>b.writeUInt32BE(0, text.offset+g.tail.offset-8)],
  ['branch into omitted tail',(b,g)=>{const r=g.relocations.find(r=>r.type===4&&r.symbolSection==='.text');assert(r);b.writeUInt32BE((b.readUInt32BE(text.offset+r.offset)&0xfc000000)|(g.tail.offset>>>2),text.offset+r.offset);}],
  ['branch enters final delay then falls through',(b,g)=>{let pc=0;while((b.readUInt32BE(text.offset+pc)>>>26)!==4)pc+=4;const dest=g.functions[0].offset+g.functions[0].bytes-4;b.writeUInt32BE((b.readUInt32BE(text.offset+pc)&0xffff0000)|(((dest-pc-4)/4)&65535),text.offset+pc);}],
  ['unproven indirect register control',(b,g)=>{let pc=0;while(b.readUInt32BE(text.offset+pc)!==0x00400008)pc+=4;b.writeUInt32BE(0x00600008,text.offset+pc);}],
  ['dispatch bounds widened',(b,g)=>{let pc=0;while((b.readUInt32BE(text.offset+pc)>>>26)!==11)pc+=4;b.writeUInt32BE(b.readUInt32BE(text.offset+pc)+1,text.offset+pc);}],
  ['dispatch default enters unchecked jump',(b,g)=>{const d=groups.interiorObject(raw,g,'raw').dispatches[0];let pc=d.boundPlace+4;while((b.readUInt32BE(text.offset+pc)>>>26)!==4)pc+=4;b.writeUInt32BE((b.readUInt32BE(text.offset+pc)&0xffff0000)|(((d.place-pc-4)/4)&65535),text.offset+pc);}],
  ['unsupported indirect call',(b,g)=>b.writeUInt32BE(0x0040f809,text.offset)],
  ...(group.tail.bytes?[['nonzero omitted native tail',(b,g)=>b[text.offset+g.tail.offset]=1]]:[])
 ]){const b=Buffer.from(raw.buffer),g=structuredClone(bound);mutate(b,g);g.interiorRun.expectedProjectedTextSha256=hash(b.subarray(text.offset,text.offset+g.tail.offset));
    reject(name,()=>groups.interiorObject(p7.parseElf32BigEndian(b),g,'raw'));}
 const symsec=raw.sections.find(s=>s.type===2),marker=raw.symbols.find(s=>s.name==='gcc2_compiled.');
 {const b=Buffer.from(raw.buffer);b.writeUInt32BE(group.tail.offset,symsec.offset+marker.symbolIndex*16+4);reject('named symbol in omitted tail',()=>groups.validateObject(p7.parseElf32BigEndian(b),bound,'raw'));}
 reject('actual compiler entry align changed',()=>auxiliary.groupGrammar(Buffer.from(compiler.toString().replace(/\.align\s+2/,'.align 3')),bound,p8.adjustSectionAssembly));
 const freshTargets=()=>targets.map(t=>({...t,compilationGroup:undefined,compilerTextFunctions:[],compilerTextFunctionsExplicit:false,auxiliarySections:[]}));
 const neighbourModel=structuredClone(model);neighbourModel.rows.find(r=>r.index===50).romEndExclusive-=4;
 reject('accepted predecessor gap',()=>groups.bind([structuredClone(group)],freshTargets(),{model:neighbourModel,baserom:rom}));
 const nextModel=structuredClone(model);nextModel.rows.find(r=>r.index===51).slices[0].vramStart+=4;
 reject('accepted successor gap',()=>groups.bind([structuredClone(group)],freshTargets(),{model:nextModel,baserom:rom}));

 for(const neighbourId of [50,51]){
   const changedModel=structuredClone(model),neighbour=changedModel.rows.find(r=>r.index===neighbourId),changedRom=Buffer.from(rom);
   const address=neighbourId===50?neighbour.romEndExclusive-4:neighbour.romStart;
   const old=fs.readFileSync(path.join(ROOT,neighbour.part.file),'utf8'),needle='/* '+hex(address)+' */ .word '+hex(rom.readUInt32BE(address));assert(old.includes(needle));
   const file=path.join(root,'padding-boundary-'+neighbourId+'.s');fs.writeFileSync(file,old.replace(needle,'/* '+hex(address)+' */ .word 0x00000000'));changedRom.writeUInt32BE(0,address);
   neighbour.part.file=path.relative(ROOT,file).replaceAll('\\','/');neighbour.part.sha256=p7.sha256File(file);
   reject('ROM-authenticated original padding boundary '+neighbourId,()=>groups.bind([structuredClone(group)],freshTargets(),{model:changedModel,baserom:changedRom}),/original boundary/);
 }
 const oldSource=fs.readFileSync(path.join(ROOT,model.rows[0].part.file));
 try{fs.appendFileSync(path.join(ROOT,model.rows[0].part.file),'# modified original\n');reject('original neighbour source changed',()=>groups.validateObject(raw,bound,'raw'));}finally{fs.writeFileSync(path.join(ROOT,model.rows[0].part.file),oldSource);}
 for(const st of ['raw','textProjected','projected','stripped'])proofReject(st+' missing interior nonaddressability',p=>delete p.objectEvidence.producerStages[st].interiorText);
 proofReject('omitted native tail attributed as original owner',p=>p.objectEvidence.tail=p.textContract.producer.tail);
}
const accounting=require('../tools/lib/status_accounting').summarizeAcceptedOwnership(model,targets);
const payloadBytes=sections.reduce((sum,section)=>sum+section.bytes,0),retainedBytes=segments.filter(s=>s.kind==='zero').reduce((sum,s)=>sum+s.ownerBytes,0);
assert.equal(accounting.replacements.bytes,(interiorRun?end:text.size)+payloadBytes);assert.equal(accounting.assembly.bytes,retainedBytes+(interiorRun?functions[0].bytes+functions[2].bytes:0));
const options={phase8:{...phase8,targets},compiler:local.compiler,verifiedCompiler,
  assembler:{bytes:fs.statSync(tools.assemblerAbs).size,sha256:p7.sha256File(tools.assemblerAbs)},
  objcopy:{bytes:fs.statSync(tools.objcopyAbs).size,sha256:p7.sha256File(tools.objcopyAbs)},assemblerPath:tools.assemblerAbs,objcopyPath:tools.objcopyAbs,
  preprocessor:classifications.preprocessor,cacheRoot:path.join(root,'cache')};
let cacheKey;
for(const expected of ['miss','hit']){const dest=path.join(root,'cache-'+expected);fs.mkdirSync(dest);
  const value=cache.compileOrReuseTarget({...options,target:targets[0],classification:classifications.targets[0],output:dest});assert.equal(value.cache.status,expected);cacheKey=value.cache.key;
  assertOccurrenceRecords(value.compiled,targets[0]);
  for(const [index,target] of targets.entries())assertOccurrenceRecords(groups.compiledMember(target,dest,classifications.targets[index]),target);}
const metadataFile=path.join(cache.cacheEntryPath(options.cacheRoot,targets[0],cacheKey),'metadata.json');
const metadata=JSON.parse(fs.readFileSync(metadataFile));
// Omitted old-producer records and forged metadata must fail the unchanged cache consumer.
const contracted=metadata.compiled.auxiliarySections.find(a=>a.compilerOccurrences);assert(contracted,'cache leader owns an occurrence contract');
const occurrenceMutations=[['deleted',a=>delete a.compilerOccurrences],['null',a=>a.compilerOccurrences=null],['empty',a=>a.compilerOccurrences=[]],
 ['duplicate',a=>a.compilerOccurrences.push(a.compilerOccurrences[0])],['reordered',a=>a.compilerOccurrences.reverse()],
 ['extra',a=>a.compilerOccurrences.push({...a.compilerOccurrences[0],label:'.L999999'})]];
for(const key of ['label','offset','bytes','entries','alignment','alignmentDirectives','paddingBefore','objectSha256','acceptedObjectSha256','expectedLinkedSha256','loadRelevantRelocationsNormalized','linkedSha256','rawLinkedBytesExact']){
  occurrenceMutations.push([key,a=>{a.compilerOccurrences[0][key]=key==='rawLinkedBytesExact'?true:'forged';}]);
}
for(const [name,mutate] of occurrenceMutations){
  const changed=structuredClone(metadata);mutate(changed.compiled.auxiliarySections.find(a=>a.outputSection===contracted.outputSection));
  fs.writeFileSync(metadataFile,JSON.stringify(changed));
  reject('occurrence metadata '+name,()=>cache.validateCacheEntry({...options,target:targets[0],classification:classifications.targets[0],keyMaterial:metadata.keyMaterial}),/compiled metadata drift/);
}
fs.writeFileSync(metadataFile,JSON.stringify(metadata));
const staleKey=structuredClone(metadata.keyMaterial);
const mutateIdentity=value=>{if(Array.isArray(value)){for(const v of value)if(mutateIdentity(v))return true;}else if(value&&typeof value==='object'){
  if(value.path==='tools/lib/compilation_groups.js'){value.sha256='0'.repeat(64);return true;}
  for(const v of Object.values(value))if(mutateIdentity(v))return true;
}return false;};
assert(mutateIdentity(staleKey),'group implementation belongs to key');
assert.notEqual(cache.sha256Value(staleKey),cacheKey,'old implementation cannot address current entry');
assert.equal(cache.tryCacheEntry({...options,target:targets[0],classification:classifications.targets[0],keyMaterial:staleKey}).hit,false);
// Producer helper negatives: mutate measured data or checked contract fields, never demand
// that this helper independently reconstruct labels/directives/linked hashes from bytes.
for(const target of targets)for(const section of target.auxiliarySections){
  const payload=segments.find(s=>s.kind==='payload'&&s.outputSection===section.outputSection);
  const bytes=rawRo.subarray(payload.offset,payload.offset+payload.bytes),rels=expectedOccurrences(section).flatMap(o=>o.loadRelevantRelocationsNormalized);
  for(const [name,mutate] of [
    ['null',a=>a.compilerOccurrences=null],['empty',a=>a.compilerOccurrences=[]],['single',a=>a.compilerOccurrences=a.compilerOccurrences.slice(0,1)],
    ['object hash',a=>a.compilerOccurrences[0].expectedObjectSha256='0'.repeat(64)],
    ['duplicate label',a=>a.compilerOccurrences[1].label=a.compilerOccurrences[0].label],
    ['gap',a=>a.compilerOccurrences[1].offsetNumber+=4],['extent',a=>a.compilerOccurrences[0].bytes+=4],
    ['entry count',a=>a.compilerOccurrences[0].entries++],['order',a=>a.compilerOccurrences.reverse()],
    ['extra',a=>a.compilerOccurrences.push({...a.compilerOccurrences[0]})]]){
    const bad=structuredClone(section);mutate(bad);reject('occurrence contract '+name,()=>p8.verifyAuxiliaryCompilerOccurrences(bytes,rels,bad,'fixture mutation'));
  }
  for(const [name,bad] of [['missing',rels.slice(1)],['duplicate',[...rels,rels[0]]],['order',[...rels].reverse()],['moved',[{...rels[0],offset:hex(bytes.length)},...rels.slice(1)]]]){
    reject('occurrence relocation '+name,()=>p8.verifyAuxiliaryCompilerOccurrences(bytes,bad,section,'fixture mutation'));
  }
  const corrupt=Buffer.from(bytes);corrupt[0]^=1;
  reject('occurrence payload bytes',()=>p8.verifyAuxiliaryCompilerOccurrences(corrupt,rels,section,'fixture mutation'));
  const padded=section.compilerOccurrences.find(o=>o.paddingBefore);
  if(padded){const bad=structuredClone(section);bad.compilerOccurrences.find(o=>o.paddingBefore).paddingBefore.bytes++;
    reject('occurrence padding contract',()=>p8.verifyAuxiliaryCompilerOccurrences(bytes,rels,bad,'fixture mutation'));
    const corruptPadding=Buffer.from(bytes);corruptPadding[Number(padded.paddingBefore.offset)]=1;
    reject('occurrence padding bytes',()=>p8.verifyAuxiliaryCompilerOccurrences(corruptPadding,rels,section,'fixture mutation'));
  }
}
const materializedOutput=path.join(root,'group-materialized');fs.mkdirSync(materializedOutput);
const materialized=cache.compileDiffTargets({...options,output:materializedOutput,requestedTarget:targets[1],
  classificationBySymbol:new Map(classifications.targets.map(c=>[c.symbol,c]))});
for(const target of targets)assertOccurrenceRecords(materialized.compiled.get(target.symbol),target);
for(const key of ['nativeObjectSha256','textProjectedObjectSha256','auxiliaryContract']){
  const changed=structuredClone(metadata);delete changed.compiled.objectEvidence.composition[key];fs.writeFileSync(metadataFile,JSON.stringify(changed));
  reject('stale cache omitted composition '+key,()=>cache.validateCacheEntry({...options,target:targets[0],classification:classifications.targets[0],keyMaterial:metadata.keyMaterial}));
}
fs.writeFileSync(metadataFile,JSON.stringify(metadata));
const files=cache.outputArtifactFiles(output,targets[0]);
for(const field of ['textContract','objectEvidence']){
  const changed=structuredClone(metadata);
  if(field==='textContract')changed.compiled.textContract.schemaVersion=3;
  else changed.compiled.objectEvidence.schemaVersion=5;
  fs.writeFileSync(metadataFile,JSON.stringify(changed));
  reject('stale cache '+field,()=>cache.validateCacheEntry({...options,target:targets[0],classification:classifications.targets[0],keyMaterial:metadata.keyMaterial}));
}
fs.writeFileSync(metadataFile,JSON.stringify(metadata));
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
try{
  fs.writeFileSync(sourceFile,source.replace('external_call(11)','external_call(12)'));
  const changed=targets.map(target=>({...target,sourceSha256:p7.sha256File(sourceFile)}));
  const classified=policy.classifyTargetSources(changed);assert(classified.targets.every(target=>target.class==='PURE_C'));
  reject('authentic changed PURE_C source nonmatch',()=>p8.compileTarget({...phase8,targets:changed},changed[0],path.join(root,'nonmatch'),
    local.compiler,tools.assemblerAbs,tools.objcopyAbs,{classification:classified.targets[0]}),/raw text hash/);
}finally{fs.writeFileSync(sourceFile,source);}
const report={status:'pass',scope:'isolated composed producer fixture',multipleMembers,sourceClass:classifications.targets[0].class,
  interiorRun,textBytes:text.size,functions,tail:group.tail,payloadBytes,nativeReadOnlyBytes:ro.size,retainedASMBytes:retainedBytes,rejections:rejected,output:root};
fs.writeFileSync(path.join(root,'report.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
}
runFixture(false);
runFixture(true);

runFixture(false,true);
runFixture(true,true);


