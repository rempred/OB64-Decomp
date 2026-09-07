#!/usr/bin/env node
'use strict';
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const g = require('../tools/lib/compilation_groups');
const p7 = require('../tools/lib/phase7_conventional');
const p8 = require('../tools/lib/phase8_matching_c');
const policy = require('../tools/lib/source_policy');
const { loadActiveTargetModel } = require('../tools/lib/active_targets');
const { loadToolchainConfig, assertToolchainAvailable, runTool } = require('../tools/lib/real_mips_toolchain');
const { same } = require('../tools/lib/text_contract');
function main() {
  const phase8 = loadActiveTargetModel();
  assert.equal(phase8.compilationGroups.length, 0, 'this tooling fixture must not activate production groups');
  const local = JSON.parse(fs.readFileSync(path.join(p7.ROOT, 'config/local-tools.json')));
  const compiler = p8.verifyCompiler(phase8, local.compiler);
  const tools = assertToolchainAvailable(loadToolchainConfig());
  const evidenceRoot = path.join(p7.ROOT, 'build/compilation-groups-implementation-r1');
  fs.mkdirSync(evidenceRoot, { recursive: true });
  const root = fs.mkdtempSync(path.join(evidenceRoot, 'focused-'));
  const cases = [];
  function fixture(name, source) {
    const dir = path.join(root, name); fs.mkdirSync(dir);
    const file = path.join(dir, 'unit.c'); fs.writeFileSync(file, source);
    const relative = path.relative(p7.ROOT, file).replace(/\\/g, '/');
    const classification = policy.classifyTargetSources([{symbol:'fixture',source:relative,bytes:4}]).targets[0];
    assert.equal(classification.class, 'PURE_C');
    const input = path.join(dir, 'input.c'), assembly = path.join(dir, 'compiler.s'), rawFile = path.join(dir, 'raw.o');
    fs.writeFileSync(input, policy.compilationInputBytes(classification));
    p7.run(local.compiler, [...phase8.config.compiler.compileFlags, '-o', assembly, input]);
    policy.verifyClassificationInputs(classification);
    p8.adjustSectionAssembly(fs.readFileSync(assembly), '.ob64.r0001', {});
    runTool(tools.assemblerAbs, [...tools.compilerAssemblerFlags, '-o', rawFile, assembly]);
    const raw = p7.parseElfFile(rawFile), text = raw.sections.find(s=>s.name === '.text');
    const functions = raw.symbols.filter(s=>s.symbolType===2).map(s=>({symbol:s.name,offset:s.value,bytes:s.size,binding:s.binding,symbolType:s.symbolType,visibility:s.visibility})).sort((a,b)=>a.offset-b.offset);
    const end = functions.at(-1).offset + functions.at(-1).bytes;
    const group = {id:name,source:relative,mode:'native-text-owner-projection',members:functions.map((f,i)=>({symbol:f.symbol,ownerRowIndex:i})),
      text:{section:'.text',bytes:text.size,alignment:text.alignment,type:1,flags:6,sha256:p7.sha256Buffer(p7.elfSectionBytes(raw,text))},functions,
      tail:{offset:end,bytes:text.size-end,sha256:p7.sha256Buffer(p7.elfSectionBytes(raw,text).subarray(end)),origin:'native-assembler-section-alignment'},
      relocations:g.relocations(raw).filter(r=>r.owner.name === '.text').map(r=>({offset:r.place,type:r.type,symbol:r.symbol.symbolType===3?'.text':r.symbol.name,
        symbolValue:r.symbol.value,symbolSection:r.symbol.sectionIndex===0?'UND':'.text',word:raw.buffer.readUInt32BE(r.owner.offset+r.place)}))};
    g.registry({schemaVersion:1,profile:'us-rev0',groups:[group]},'us-rev0');
    group.owners=functions.map((f,i)=>({sectionName:'.ob64.r'+String(i+1).padStart(4,'0'),groupOffset:f.offset,bytes:f.bytes+(i===functions.length-1?group.tail.bytes:0),alignment:g.alignment(group,f.offset)}));
    const projected = g.project(raw.buffer,group), projectedFile=path.join(dir,'projected.o'), strippedFile=path.join(dir,'stripped.o'), nativeInput=path.join(dir,'native-input.o');
    fs.writeFileSync(projectedFile,projected.buffer);
    const strip=file=>['--remove-section=.reginfo','--remove-section=.pdr','--remove-section=.comment','--remove-section=.note',file];
    runTool(tools.objcopyAbs,[...strip(projectedFile),strippedFile]);
    runTool(tools.objcopyAbs,[...strip(rawFile),nativeInput]);
    const a=g.validateObject(raw,group,'raw'),b=g.validateObject(p7.parseElfFile(projectedFile),group,'projected'),c=g.validateObject(p7.parseElfFile(strippedFile),group,'stripped');
    assert(same(a.metadata,b.metadata));assert.equal(c.metadata,null);
    for(const base of [0x80230000,0x80340000]) {
      const results=[];
      for(const [mode,inputObject] of [['native',nativeInput],['projected',strippedFile]]) {
        const ld=path.join(dir,mode+'-'+base+'.ld'),elf=path.join(dir,mode+'-'+base+'.elf');
        const sections=mode==='native'? [{sectionName:'.text',groupOffset:0}]:group.owners;
        fs.writeFileSync(ld,'SECTIONS {\n'+sections.map(owner=>owner.sectionName+' 0x'+(base+owner.groupOffset).toString(16)+' : AT(0x'+(0x1000+owner.groupOffset).toString(16)+') { *('+owner.sectionName+') }').join('\n')+'\n}\nexternal_call = 0x80001234;\nexternal_word = 0x8012fedc;\n');
        runTool(tools.toolsAbs.linker,['-T',ld,'-o',elf,inputObject]);
        const e=p7.parseElfFile(elf);
        results.push({bytes:Buffer.concat(sections.map(owner=>p7.elfSectionBytes(e,e.sections.find(s=>s.name===owner.sectionName)))),functions:e.symbols.filter(s=>s.symbolType===2).map(s=>({name:s.name,value:s.value,size:s.size,binding:s.binding})).sort((a,b)=>a.name.localeCompare(b.name))});
      }
      assert(results[0].bytes.equals(results[1].bytes));assert.deepEqual(results[0].functions,results[1].functions);
    }
    let rejections=0;
    function rejects(mutate,stage='raw',buffer=raw.buffer) {const copy=Buffer.from(buffer);mutate(copy);assert.throws(()=>g.validateObject(g.parseBuffer(copy),group,stage),/compilation group:/);rejections++;}
    const reg=raw.sections.find(s=>s.name==='.reginfo');
    for(const [field,offset] of [['type',4],['flags',8],['address',12],['size',20],['link',24],['info',28],['alignment',32],['entrySize',36]]) {
      rejects(bytes=>bytes.writeUInt32BE(bytes.readUInt32BE(reg.headerOffset+offset)+1,reg.headerOffset+offset));
    }
    rejects(bytes=>bytes[text.offset]^=1);
    if(group.tail.bytes) rejects(bytes=>bytes[text.offset+group.tail.offset]=1);
    assert.throws(()=>g.validateObject(raw,group,'stripped'),/compilation group:/);rejections++;
    const extra=raw.sections.find(s=>s.name==='.data');rejects(bytes=>bytes.writeUInt32BE(4,extra.headerOffset+20));
    const changed=structuredClone(group);changed.functions[0].binding=0;assert.throws(()=>g.project(raw.buffer,changed));rejections++;
    const duplicateSection=g.parseBuffer(raw.buffer);duplicateSection.sections.push({...reg});
    assert.throws(()=>g.validateObject(duplicateSection,group,'raw'),/duplicate section/);rejections++;
    const missingSection=g.parseBuffer(raw.buffer);missingSection.sections=missingSection.sections.filter(s=>s.name!=='.reginfo');
    assert.throws(()=>g.validateObject(missingSection,group,'raw'),/reginfo shape/);rejections++;
    const symbolMutation=g.parseBuffer(raw.buffer);symbolMutation.symbols.find(s=>s.sectionIndex===reg.index).name='forbidden_alias';
    assert.throws(()=>g.validateObject(symbolMutation,group,'raw'),/reginfo symbols/);rejections++;
    const loadRel=raw.sections.find(s=>s.name==='.rel.text');
    if(loadRel && loadRel.size){
      rejects(bytes=>bytes.writeUInt32BE(reg.index,loadRel.headerOffset+28));
      const regSymbol=raw.symbols.find(s=>s.sectionIndex===reg.index);
      rejects(bytes=>bytes.writeUInt32BE((regSymbol.symbolIndex<<8)|4,loadRel.offset+4));
      rejects(bytes=>bytes.writeUInt32BE(group.tail.offset,loadRel.offset));
      rejects(bytes=>bytes[text.offset+group.relocations[0].offset+3]^=1);
      const badAnchor=g.parseBuffer(projected.buffer),anchor=badAnchor.symbols.find(s=>s.symbolType===3&&s.sectionIndex===badAnchor.sections.find(s=>s.name===group.owners[0].sectionName).index);
      anchor.value=4;assert.throws(()=>g.validateObject(badAnchor,group,'projected'),/symbol|anchor/);rejections++;
    }
    const registryCopy=()=>{const copy=structuredClone(group);delete copy.owners;return {schemaVersion:1,profile:'us-rev0',groups:[copy]};};
    for(const mutate of [v=>v.groups[0].members.pop(),v=>v.groups[0].members.reverse(),v=>v.groups[0].members[1].symbol=v.groups[0].members[0].symbol,
      v=>v.groups[0].source='../escape.c',v=>v.groups[0].tail.bytes++,v=>v.schemaVersion=0]) {
      const value=registryCopy();mutate(value);assert.throws(()=>g.registry(value,'us-rev0'));rejections++;
    }
    const targets = group.owners.map((owner,index)=>({symbol:functions[index].symbol,source:relative,sourceSha256:p7.sha256File(file),
      compilationGroup:group,groupMemberIndex:index,bytes:owner.bytes,sectionName:owner.sectionName,
      rowIndex:index,primaryId:'fixture:'+index,romStartNumber:0x1000+owner.groupOffset,romEndNumber:0x1000+owner.groupOffset+owner.bytes,
      vramStartNumber:0x80230000+owner.groupOffset,vramEndNumber:0x80230000+owner.groupOffset+owner.bytes,
      expectedTextSha256:'0'.repeat(64),originalAssemblySha256:'0'.repeat(64),auxiliarySections:[],
      compilerTextFunctions:[{symbol:functions[index].symbol,offset:'0x00000000',offsetNumber:0,bytes:functions[index].bytes,binding:'GLOBAL',entryEvidence:'owner'}]}));
    const classifications=policy.classifyTargetSources(targets);
    const productionOutput=path.join(dir,'production');fs.mkdirSync(productionOutput);
    for(const [index,target] of targets.entries()) {
      const compiled=p8.compileTarget({...phase8,targets},target,productionOutput,local.compiler,tools.assemblerAbs,tools.objcopyAbs,{classification:classifications.targets[index]});
      const files=require('../tools/lib/diff_object_cache').outputArtifactFiles(productionOutput,target);
      const inspected=require('../tools/lib/diff_object_cache').inspectCompiledTargetArtifacts({phase8,target,classification:classifications.targets[index],files});
      assert(same(compiled,inspected),'compiled/cache member evidence');
    }
    assert.equal(fs.readdirSync(path.join(productionOutput,'objects/c/groups')).filter(name=>name.endsWith('.assembler-object.o')).length,1);
    const objectFile=path.join(productionOutput,g.objectPath(targets[0]));
    const memberRecords=targets.map(target=>({ownerKind:'matching-c-target',targetSymbol:target.symbol,
      path:g.objectPath(target),bytes:fs.statSync(objectFile).size,sha256:p7.sha256File(objectFile)}));
    const groupedManifest=g.collapseManifest(memberRecords,{targets});
    assert.equal(groupedManifest.length,1);assert.equal(g.manifestMembers(groupedManifest,{targets}).length,2);
    assert.throws(()=>g.collapseManifest(memberRecords.slice(1),{targets}),/member census/);rejections++;
    assert.throws(()=>g.collapseManifest([...memberRecords,memberRecords[0]],{targets}),/member census/);rejections++;
    for(const mutate of [v=>v[0].members.pop(),v=>v[0].members.reverse(),v=>v[0].members[1].sha256='0'.repeat(64),v=>v.push(v[0])]) {
      const forged=structuredClone(groupedManifest);mutate(forged);
      assert.throws(()=>g.manifestMembers(forged,{targets}),/compilation group:/);rejections++;
    }
    const cache=require('../tools/lib/diff_object_cache');
    const cacheOptions={phase8:{...phase8,targets},compiler:local.compiler,verifiedCompiler:compiler,
      assembler:{bytes:fs.statSync(tools.assemblerAbs).size,sha256:p7.sha256File(tools.assemblerAbs)},
      objcopy:{bytes:fs.statSync(tools.objcopyAbs).size,sha256:p7.sha256File(tools.objcopyAbs)},
      assemblerPath:tools.assemblerAbs,objcopyPath:tools.objcopyAbs,preprocessor:classifications.preprocessor,
      classificationBySymbol:new Map(classifications.targets.map(record=>[record.symbol,record])),cacheRoot:path.join(dir,'cache')};
    const diffOutput=path.join(dir,'diff');fs.mkdirSync(diffOutput);
    const diff=cache.compileDiffTargets({...cacheOptions,requestedTarget:targets[1],output:diffOutput});
    assert.equal(diff.cache.compilerInvocations,1);assert.equal(diff.compiled.size,2);
    const leader=targets[0],leaderPolicy=classifications.targets[0];
    const missOutput=path.join(dir,'cache-miss');fs.mkdirSync(missOutput);
    const miss=cache.compileOrReuseTarget({...cacheOptions,target:leader,classification:leaderPolicy,output:missOutput});
    assert.equal(miss.cache.status,'miss');
    const hitOutput=path.join(dir,'cache-hit');fs.mkdirSync(hitOutput);
    const hit=cache.compileOrReuseTarget({...cacheOptions,target:leader,classification:leaderPolicy,output:hitOutput});
    assert.equal(hit.cache.status,'hit');assert(same(miss.compiled,hit.compiled));
    assert(same(g.compiledMember(targets[1],hitOutput,classifications.targets[1]),g.compiledMember(targets[1],missOutput,classifications.targets[1])));
    const target=targets[0],groupEvidence=tcEvidence(target,productionOutput);
    for(const key of ['raw','projected','stripped']) {
      const forged=structuredClone(groupEvidence);delete forged.producerStages[key];
      assert.throws(()=>require('../tools/lib/text_contract').validateRecords({objectEvidence:forged},{objectEvidence:groupEvidence},'group fixture'));rejections++;
    }
    const rawPath=path.join(productionOutput,g.objectPath(target,'.assembler-object.o'));
    const saved=fs.readFileSync(rawPath),parsed=p7.parseElfFile(rawPath),metadataSection=parsed.sections.find(s=>s.name==='.reginfo');
    try {const corrupt=Buffer.from(saved);corrupt[metadataSection.offset]^=1;fs.writeFileSync(rawPath,corrupt);
      assert.throws(()=>tcEvidence(target,productionOutput),/metadata drift/);rejections++;
    } finally {fs.writeFileSync(rawPath,saved);}
    const result={name,sourceClass:classification.class,functions:functions.length,bytes:text.size,tailBytes:group.tail.bytes,relocations:group.relocations.length,rejections,rawSha256:p7.sha256Buffer(raw.buffer),metadata:a.metadata};cases.push(result);
    return {group,dir,raw,classification,source:relative};
  }
  fixture('calls', 'extern int external_call(int); extern int external_word;\nint group_first(int x) { return external_call(x) + external_word; }\nint group_second(int x) { return group_first(x) + 7; }\n');
  fixture('zero_tail', 'int group_zero_a(void) { return 0; }\nint group_zero_b(void) { return 1; }\n');
  assert(cases.some(c=>c.tailBytes===0));
  fs.writeFileSync(path.join(root,'report.json'),JSON.stringify({status:'pass',compiler,cases},null,2));
  console.log(JSON.stringify({status:'pass',root,cases},null,2));
}
function tcEvidence(target,output){return require('../tools/lib/text_contract').deriveObjectEvidence(target,output);}
main();
