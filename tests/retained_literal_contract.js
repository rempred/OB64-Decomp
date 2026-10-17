'use strict';
const assert=require('assert'),fs=require('fs'),path=require('path');
const p7=require('../tools/lib/phase7_conventional'),p8=require('../tools/lib/phase8_matching_c');
const literals=require('../tools/lib/retained_literal_references'),groups=require('../tools/lib/compilation_groups'),text=require('../tools/lib/text_contract');
function main(model=p8.loadPhase8Model(),outputParent=path.join(p7.ROOT,'build/tests')){
  runLiteralRunBranchTests();
  const policy=require('../tools/lib/source_policy'),native=require('../tools/lib/real_mips_toolchain');
  const selected=model.targets.filter(t=>t.retainedLiteralReferences||t.compilationGroup?.retainedLiteralReferences||t.nativeTextTail?.schemaVersion===2);
  assert.throws(()=>literals.normalize({schemaVersion:1}));
  assert.throws(()=>text.normalizeNativeTextTail({schemaVersion:2},'fixture'));
  if(!selected.length)return {status:'pass',activeProducers:0,negativeControls:2};
  const classifications=policy.classifyTargetSources(selected),toolchain=native.assertToolchainAvailable(native.loadToolchainConfig()),compiler=JSON.parse(fs.readFileSync(path.join(p7.ROOT,'config/local-tools.json'))).compiler;
  p8.verifyCompiler(model,compiler);const parent=outputParent;fs.mkdirSync(parent,{recursive:true});const output=fs.mkdtempSync(path.join(parent,'retained-literals-')),seen=new Set();let rejected=2;
  for(const target of selected){
    const classification=classifications.targets.find(c=>c.symbol===target.symbol);assert.equal(classification.class,'PURE_C');
    p8.compileTarget(model,target,output,compiler,toolchain.assemblerAbs,toolchain.objcopyAbs,{classification});
    const group=target.compilationGroup,producer=group?literals.groupTarget(group):target,key=group?.id||target.symbol;if(seen.has(key))continue;seen.add(key);
    if(producer.retainedLiteralReferences){
      const file=path.join(output,groups.objectPath(target,'.assembler-object.o')),raw=fs.readFileSync(file),elf=p7.parseElf32BigEndian(raw),section=elf.sections.find(s=>s.name==='.rodata');
      assert(section);const bad=Buffer.from(raw);bad[section.offset]^=1;assert.throws(()=>literals.projectComplete(bad,producer),/literal payload/);rejected++;
      assert.throws(()=>literals.projectComplete(raw,{...producer}),/authority/);rejected++;
      const projection=literals.project(raw,producer),neutral=p7.parseElf32BigEndian(projection.buffer).sections[section.index];
      assert.equal(neutral.name,'');assert.equal(projection.buffer.readUInt32BE(section.headerOffset),0);assert.equal(neutral.type,0);assert.equal(neutral.size,0);
      const named=Buffer.from(projection.buffer);named.writeUInt32BE(raw.readUInt32BE(section.headerOffset),section.headerOffset);
      assert.throws(()=>literals.splitAuthority(named,[],projection.token),/projection split authority/);rejected++;
      const pair=projection.evidence.groups[0],rel=elf.sections[pair.records[0].relocationSectionIndex],records=[];
      for(let i=0;i<rel.size;i+=8)records.push(Buffer.from(raw.subarray(rel.offset+i,rel.offset+i+8)));
      const ordinary=records.findIndex(r=>(r.readUInt32BE(4)&255)===4);assert(ordinary>=0);
      const moved=records.splice(ordinary,1)[0],hi=records.findIndex(r=>r.readUInt32BE(0)===pair.hi);records.splice(hi+1,0,moved);
      const interleaved=Buffer.from(raw);Buffer.concat(records).copy(interleaved,rel.offset);
      assert.throws(()=>literals.projectComplete(interleaved,producer),/interleaved literal REL set/);rejected++;


    }
    if(target.nativeTextTail?.schemaVersion===2){
      const raw=fs.readFileSync(path.join(output,groups.objectPath(target,'.source-object.o'))),elf=p7.parseElf32BigEndian(raw),section=elf.sections.find(s=>s.name==='.text'),bad=Buffer.from(raw);bad[section.offset+target.nativeTextTail.functionBytes]=1;
      assert.throws(()=>text.nativeSingleOwnerCensus(p7.parseElf32BigEndian(bad),target),/nonzero tail/);rejected++;
    }
  }
  return {status:'pass',activeProducers:seen.size,negativeControls:rejected,output};
}
if(require.main===module)console.log(JSON.stringify(main()));module.exports={main};

// Focused controls for the explicit raw/owned/neighbor contract; no native compile.
function runLiteralRunControls({target,native,projection,root,classification,persistRegistryFixture}){
 const group=target.compilationGroup,results=[],reject=(name,fn)=>{assert.throws(fn,undefined,name);results.push(name);};assert(groups.literalRun(group));groups.authenticateLiteralRun(group);
 const valid=()=>groups.validateObject(groups.parseBuffer(native),group,'raw');valid();
 for(const n of [0,8,12]){const saved=group.tail.bytes;try{group.tail.bytes=n;reject('omission '+n,()=>groups.authenticateLiteralRun(group));}finally{group.tail.bytes=saved;}}
 for(const [name,object,key,value]of [['tail charged to last member',group.owners.at(-1),'bytes',group.owners.at(-1).bytes+4],['shortened final body',group.functions.at(-1),'bytes',group.functions.at(-1).bytes-4],['shifted first body',group.functions[0],'offset',4],['wrong alignment origin',group.tail,'origin','invented'],['neighbor gap',group.retainedNativeAlignment,'romStart',group.retainedNativeAlignment.romStart+4]]){const saved=object[key];try{object[key]=value;reject(name,()=>groups.authenticateLiteralRun(group));}finally{object[key]=saved;}}
 assert.equal(typeof persistRegistryFixture,'function','explicit confined registry fixture sink required');const logical=require('../tools/lib/logical_functions'),saved=fs.readFileSync(logical.CONFIG_PATH),config=JSON.parse(saved),start=group.retainedNativeAlignment.romStart;
 for(const [name,mutate]of [['missing neighbor padding',c=>c.padding.splice(c.padding.findIndex(p=>p.romStart===start),1)],['duplicate neighbor padding',c=>c.padding.push({...c.padding.find(p=>p.romStart===start)})],['shifted neighbor padding',c=>c.padding.find(p=>p.romStart===start).romStart+=4]]){const c=structuredClone(config);mutate(c);try{persistRegistryFixture(Buffer.from(JSON.stringify(c)));reject(name,()=>groups.authenticateLiteralRun(group));}finally{persistRegistryFixture(saved);}}
 const ctx=groups.authenticateLiteralRun(group),neighbor=ctx.model.rows.find(r=>r.index===group.retainedNativeAlignment.ownerRowIndex);assert(!groups.functionOwners(group));const previous=neighbor.part.sha256;try{neighbor.part.sha256='0'.repeat(64);reject('neighbor source identity',()=>groups.authenticateLiteralRun(group));}finally{neighbor.part.sha256=previous;}const extra={textOwners:[{rowIndex:neighbor.index,romStartNumber:neighbor.romStart,romEndNumber:neighbor.romEndExclusive}],auxiliarySections:[]};ctx.targets.push(extra);try{reject('active C neighbor custody',()=>groups.authenticateLiteralRun(group));}finally{ctx.targets.pop();}ctx.targets.push({textOwners:[],auxiliarySections:[{ownerRowIndex:neighbor.index,romStartNumber:neighbor.romStart,romEndNumber:neighbor.romEndExclusive}]});try{reject('active auxiliary neighbor custody',()=>groups.authenticateLiteralRun(group));}finally{ctx.targets.pop();}const token=literals.project(native,literals.groupTarget(group));reject('raw object split authority',()=>literals.splitAuthority(native,group.owners,token.token));
 const b=group.retainedNeighborBinding,original=path.join(p7.ROOT,b.source),bytes=fs.readFileSync(original); // Read only when the original belongs to the canonical tree.
 const e=groups.parseBuffer(native),txt=e.sections.find(s=>s.name==='.text'),bad=Buffer.from(native);bad[txt.offset+txt.size-1]=1;reject('nonzero native alignment',()=>groups.validateObject(groups.parseBuffer(bad),group,'raw'));valid();
 const final=fs.readFileSync(path.join(root,groups.objectPath(target))),parsed=groups.parseBuffer(final);for(const [name,mutate]of [['generated symbol type',b=>{const x=parsed.symbols.find(s=>s.symbolType===3&&s.sectionIndex===parsed.sections.find(x=>x.name==='.symtab').index);assert(x);b[parsed.sections[x.symbolTableIndex].offset+x.symbolIndex*16+12]=0;}],['anchor symbol index',b=>{const r=groups.relocations(parsed)[0],section=parsed.sections.find(s=>s.type===9&&s.info===r.owner.index);b.writeUInt32BE((b.readUInt32BE(section.offset+4)+256)>>>0,section.offset+4);} ]]){const v=Buffer.from(final);mutate(v);reject(name,()=>groups.validateObject(groups.parseBuffer(v),group,'stripped'));}
 groups.authenticateLiteralRun(group);assert.equal(group.text.bytes,group.tail.offset+4);assert.equal(group.owners.reduce((n,o)=>n+o.bytes,0),group.tail.offset);assert.equal(b.romEndExclusive-b.romStart,20);return{status:'PASS',results,rawBytes:group.text.bytes,ownedBytes:group.tail.offset,neighborBytes:20};
}
module.exports.runLiteralRunControls=runLiteralRunControls;

function runNativePaddingControls({model,rom,group}){
 const logical=require('../tools/lib/logical_functions'),config=JSON.parse(fs.readFileSync(logical.CONFIG_PATH)),rows=group.members.map(m=>model.rows.find(r=>r.index===m.ownerRowIndex)),start=group.romStart+group.tail.offset,end=start+group.tail.bytes,results=[];
 assert([4,8].includes(group.tail.bytes));const check=c=>logical.assertNativeGroupBodies(logical.loadRegistry(model,rom,c),rows,group);check(config);
 for(const [name,mutate]of [['missing terminal record',c=>c.padding.splice(c.padding.findIndex(p=>p.romStart===start),1)],['duplicate terminal record',c=>c.padding.push({...c.padding.find(p=>p.romStart===start)})],['changed terminal hash',c=>c.padding.find(p=>p.romStart===start).expectedBytesSha256='0'.repeat(64)],['shifted terminal record',c=>{const p=c.padding.find(p=>p.romStart===start);p.romStart-=4;p.romEndExclusive-=4;}],['terminal overlap',c=>c.padding.find(p=>p.romStart===start).romStart-=4]]){const bad=structuredClone(config);mutate(bad);assert.throws(()=>check(bad));results.push(name);}check(config);return{status:'PASS',start,end,results};
}
module.exports.runNativePaddingControls=runNativePaddingControls;

function runLiteralRunBranchTests(){
 const hash=p7.sha256Buffer,group={mode:'native-text-owner-retained-literal-run-projection',retainedLiteralReferences:{schemaVersion:2,bytes:32},vramStart:0x8007fc00,text:{bytes:96,alignment:16},functions:[{bytes:28},{bytes:28},{bytes:36}],tail:{offset:92,bytes:4,origin:'native-assembler-section-alignment'},retainedNativeAlignment:{ownerRowIndex:4,romStart:92,romEndExclusive:96,expectedSha256:hash(Buffer.alloc(4))}},native=Buffer.alloc(96),results=[],check=b=>groups.literalRunBranchCensus(b,group);
 check(native);for(const [name,opcode]of [['BEQ',0x10000000],['BNE',0x14000000],['BLEZ',0x18000000],['BGTZ',0x1c000000],['BEQL',0x50000000],['BNEL',0x54000000],['BLEZL',0x58000000],['BGTZL',0x5c000000],['BLTZ',0x04000000],['BGEZ',0x04010000],['BLTZL',0x04020000],['BGEZL',0x04030000],['BLTZAL',0x04100000],['BGEZAL',0x04110000],['BLTZALL',0x04120000],['BGEZALL',0x04130000],['BC0',0x41000000],['BC1',0x45010000],['BC1 likely',0x45030000],['BC2',0x49000000]]){const b=Buffer.from(native);b.writeUInt32BE((opcode|8)>>>0,56);assert.throws(()=>check(b),/branch into omitted native suffix/);results.push(name);}
 const owned=Buffer.from(native);owned.writeUInt32BE(0x10000005,56);assert.equal(check(owned)[0].to,80);const cross=Buffer.from(native);cross.writeUInt32BE(0x10000006,0);assert.equal(check(cross)[0].to,28);const indirect=Buffer.from(native);indirect.writeUInt32BE(0x0040f809,56);assert.equal(check(indirect).length,0);check(native.subarray(0,92));
 for(const [name,op] of [['J',0x08000000],['JAL',0x0c000000]]){
  const word=to=>(op|((group.vramStart+to)>>>2)&0x3ffffff)>>>0,b=Buffer.from(native);b.writeUInt32BE(word(92),56);
  assert.throws(()=>check(b),new RegExp(name+' into omitted native suffix'));assert.throws(()=>groups.literalRunBranchCensus(b.subarray(0,92),group,true),/omitted native suffix/);results.push(name+' raw/projected/linked suffix');
  for(const to of [28,80,96,4096]){b.writeUInt32BE(word(to),56);assert.equal(check(b)[0].to,to);}
  const rel={offset:56,type:4,symbol:'.text',symbolValue:28,symbolSection:'.text',word:op|16},g={...group,relocations:[rel]};b.writeUInt32BE(rel.word,56);assert.throws(()=>groups.literalRunBranchCensus(b,g),/omitted native suffix/);results.push(name+' R26 text symbol plus addend');
  g.relocations=[{...rel,symbol:'absolute',symbolSection:'ABS',symbolValue:group.vramStart+28}];assert.throws(()=>groups.literalRunBranchCensus(b,g),/omitted native suffix/);results.push(name+' R26 ABS plus addend');
  // Same encoded bits resolve externally when the R26 symbol changes.
  g.relocations=[{...rel,symbol:'absolute',symbolSection:'ABS',symbolValue:0x80090000}];assert.equal(groups.literalRunBranchCensus(b,g)[0].to,0x80090040-group.vramStart);
 }
 const boundary=Buffer.from(native);boundary.writeUInt32BE(0x08000007,60);assert.throws(()=>groups.literalRunBranchCensus(boundary,{...group,vramStart:0x8fffffc0}),/J into omitted native suffix/);results.push('J actual PC+4 region boundary');
 const pair=Buffer.from(native);pair.writeUInt32BE(0x3c020000,0);pair.writeUInt32BE(0x24420040,4);const rels=[{offset:0,type:5,symbol:'.text',symbolValue:28,symbolSection:'.text'},{offset:4,type:6,symbol:'.text',symbolValue:28,symbolSection:'.text'}];assert.throws(()=>groups.literalRunBranchCensus(pair,{...group,relocations:rels}),/HI16\/LO16 into omitted native suffix/);results.push('HI16/LO16 text symbol plus signed addend');
 pair.writeUInt32BE(0x3c028008,0);pair.writeUInt32BE(0x2442fc5c,4);assert.throws(()=>groups.literalRunBranchCensus(pair.subarray(0,92),{...group,relocations:rels},true),/omitted native suffix/);results.push('linked HI16/LO16 carry and signed low');
 return{status:'PASS',synthetic:true,results,positives:['pristine','owned-body branch','cross-owner owned-body branch','JALR','owned projected extent','J and JAL owned/external targets','R26 same bits with external symbol']};
}
module.exports.runLiteralRunBranchTests=runLiteralRunBranchTests;
