'use strict';
const assert=require('assert'),fs=require('fs'),path=require('path');
const p7=require('../tools/lib/phase7_conventional'),p8=require('../tools/lib/phase8_matching_c');
const literals=require('../tools/lib/retained_literal_references'),groups=require('../tools/lib/compilation_groups'),text=require('../tools/lib/text_contract');
function main(model=p8.loadPhase8Model(),outputParent=path.join(p7.ROOT,'build/tests')){
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
