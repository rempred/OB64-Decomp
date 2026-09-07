#!/usr/bin/env node
'use strict';
const fs=require('fs'),path=require('path'),assert=require('assert');
const p7=require('../tools/lib/phase7_conventional'),p8=require('../tools/lib/phase8_matching_c');
const g=require('../tools/lib/compilation_groups'),tc=require('../tools/lib/text_contract');
const {prepareContext,ensureBaseline}=require('../tools/lib/current_workflow');
const {resolveAcceptedRow}=require('../tools/lib/active_targets');
const {classifyTargetSources}=require('../tools/lib/source_policy');
const {prepareCompilerSession}=require('../tools/lib/matching/compiler');
function main(){
 const context=prepareContext(),baseline=ensureBaseline(context),session=prepareCompilerSession({context});
 const evidenceRoot=path.join(p7.ROOT,'build/compilation-groups-implementation-r1');fs.mkdirSync(evidenceRoot,{recursive:true});
 const root=fs.mkdtempSync(path.join(evidenceRoot,'pose-'));
 const workRoot='C:/Users/Joe/.codex/ob64-compilation-groups-implementation-20260906-r1';fs.mkdirSync(workRoot,{recursive:true});
 const output=fs.mkdtempSync(path.join(workRoot,'pose-'));
 const research='C:/Users/Joe/.codex/ob64-pose-split-research-20260906-r1';
 const sourceFile=path.join(root,'group.c');fs.copyFileSync(path.join(research,'group.c'),sourceFile);
 const source=path.relative(p7.ROOT,sourceFile).replace(/\\/g,'/');
 const raw=p7.parseElfFile(path.join(research,'group.native.o')),text=raw.sections.find(s=>s.name==='.text');
 const functions=raw.symbols.filter(s=>s.symbolType===2).map(s=>({symbol:s.name,offset:s.value,bytes:s.size,binding:s.binding,symbolType:s.symbolType,visibility:s.visibility})).sort((a,b)=>a.offset-b.offset);
 const rom=fs.readFileSync(context.baserom.path);
 const targets=functions.map(fun=>{
  const row=resolveAcceptedRow(context.phase8.model,fun.symbol),slice=row.slices[0];
  const target={symbol:fun.symbol,compilationGroupId:'pose_fixture',source,sourceSha256:p7.sha256File(sourceFile),
   primaryId:row.primaryId,rowIndex:row.index,chunkIndex:row.part.chunkIndex,originalAssembly:row.part.file,originalAssemblySha256:row.part.sha256,
   romStart:p7.hex(row.romStart),romEndExclusive:p7.hex(row.romEndExclusive),romStartNumber:row.romStart,romEndNumber:row.romEndExclusive,
   vramStart:p7.hex(slice.vramStart),vramEndExclusive:p7.hex(slice.vramEndExclusive),vramStartNumber:slice.vramStart,vramEndNumber:slice.vramEndExclusive,
   bytes:row.bytes,sectionName:slice.sectionName,overlayDescriptorId:slice.overlayDescriptorId,descriptorRawSha256:null,
   expectedTextSha256:p7.sha256Buffer(rom.subarray(row.romStart,row.romEndExclusive)),expectedRelocations:[],nativeTextTail:null,
   compilerTextFunctionsExplicit:false,compilerTextFunctions:[],auxiliarySections:[],legacyAncillaryRelocations:[],
   relocationContractSource:'compilation-group',row,rows:[row],model:context.phase8.model};
  target.textOwners=p8.targetTextOwners(target);return target;
 });
 const group={id:'pose_fixture',source,mode:'native-text-owner-projection',members:targets.map(t=>({symbol:t.symbol,ownerRowIndex:t.rowIndex})),
  text:{section:'.text',bytes:text.size,alignment:text.alignment,type:1,flags:6,sha256:p7.sha256Buffer(p7.elfSectionBytes(raw,text))},functions,
  tail:{offset:824,bytes:8,sha256:p7.sha256Buffer(Buffer.alloc(8)),origin:'native-assembler-section-alignment'},
  relocations:g.relocations(raw).filter(r=>r.owner.name==='.text').map(r=>({offset:r.place,type:r.type,symbol:r.symbol.symbolType===3?'.text':r.symbol.name,symbolValue:r.symbol.value,symbolSection:r.symbol.sectionIndex===0?'UND':'.text',word:raw.buffer.readUInt32BE(r.owner.offset+r.place)}))};
 g.registry({schemaVersion:1,profile:'us-rev0',groups:[group]},'us-rev0');g.bind([group],targets);
 const art={...context.phase8.targets.find(target=>target.nativeTextTail)};
 const active=[art,...targets];
 const phase8={...context.phase8,targets:active,target:targets[0],compilationGroups:[group],compatibility:[]};
 for(const target of active)target.nativeEmptyBssObjects=[g.objectPath(art),g.objectPath(targets[0])];
 const policy=classifyTargetSources(active);assert.equal(policy.counts.PURE_C,6);
 const phase7=p8.verifyPhase7Input(phase8,baseline.phase7Output),runtime=session.runtime;
 const replacement=p8.copyPhase7Objects(phase8,phase7,output,runtime.tools['mips-kmc-elf-objcopy.exe'].path);
 const compiled=new Map(active.map((target,index)=>[target.symbol,p8.compileTarget(phase8,target,output,context.localTools.compiler,
  runtime.tools['mips-kmc-elf-as.exe'].path,runtime.tools['mips-kmc-elf-objcopy.exe'].path,{classification:policy.targets[index]})]));
 const manifest=p8.writeObjectManifest(output,replacement.linkedObjects,phase8,replacement.replacements,compiled);
 assert.equal(manifest.linkedObjects.filter(record=>record.ownerKind==='matching-c-group').length,1);
 p8.linkPhase8(phase8,output,manifest,runtime.tools);
 p8.writeLayout(phase8,phase7,output,replacement.replacements);
 p8.writeSourceObjectProofs(phase8,{output,compiled,sourcePolicy:policy});
 const verification=p8.verifyPhase8Output(phase8,{output,asmDifferRoot:context.localTools.asmDifferRoot,splatPython:context.localTools.splatPython,
  objdump:runtime.tools['mips-kmc-elf-objdump.exe'].path,objcopy:runtime.tools['mips-kmc-elf-objcopy.exe'].path,replacements:replacement.replacements});
 assert(fs.readFileSync(path.join(output,'phase8.us_rev0.z64')).equals(rom));
 assert.equal(verification.targets.length,6);
 const result={status:'pass',output,sourceClass:policy.counts,targets:verification.targets.map(t=>({symbol:t.symbol,bytes:t.bytes})),producerObjects:1};
 fs.writeFileSync(path.join(root,'report.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
}
main();
