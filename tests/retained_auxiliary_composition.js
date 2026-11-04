'use strict';
const assert=require('assert'),fs=require('fs'),path=require('path');
const p7=require('../tools/lib/phase7_conventional'),p8=require('../tools/lib/phase8_matching_c'),a=require('../tools/lib/active_targets'),policy=require('../tools/lib/source_policy'),n=require('../tools/lib/real_mips_toolchain');
function main(options){
if(options===undefined)return {status:'pass',cases:[main({}),main({loader:true}),main({loader:true,padded:true})]};
let restoreOriginal=()=>{};try{
const w=p8.loadPhase8Model(),tc=n.assertToolchainAvailable(n.loadToolchainConfig()),local=JSON.parse(fs.readFileSync(path.join(p7.ROOT,'config/local-tools.json')));
fs.mkdirSync(path.join(p7.ROOT,'build/tests'),{recursive:true});const out=fs.mkdtempSync(path.join(p7.ROOT,'build/tests/ra-'));
const write=(f,t)=>{fs.mkdirSync(path.dirname(path.join(out,f)),{recursive:true});fs.writeFileSync(path.join(out,f),t)},run=(e,args,cwd=out)=>n.runTool(e,args,{cwd});
const textVram=0x80230000,tableVram=options.loader?textVram+0x2000-0x100:0x80248010;
const symbol='unrelated_dispatch',section='.ob64.r9001.s0';let source='extern int external_call(int);\nint unrelated_dispatch(int x){switch(x){case 0:return external_call(11);case 1:return external_call(23);case 2:return external_call(37);case 3:return external_call(41);case 4:return external_call(59);case 5:return external_call(61);case 6:return external_call(73);case 7:return external_call(89);default:return 3;}}\n';
if(options.padded)source=source.replace('case 7:return external_call(89);','');
write('s.c',source);const relative=path.relative(p7.ROOT,path.join(out,'s.c')).replace(/\\/g,'/');let classifications=policy.classifyTargetSources([{symbol,source:relative,bytes:4}]),classification=classifications.targets[0];assert.equal(classification.class,'PURE_C');
write('i.c',policy.compilationInputBytes(classification));run(local.compiler,[...w.config.compiler.compileFlags,'-o','c.s','i.c']);write('a.s',p8.adjustSectionAssembly(fs.readFileSync(path.join(out,'c.s')),section,{allowAuxiliaryReadOnlySections:true}));run(tc.assemblerAbs,[...tc.compilerAssemblerFlags,'-o','n.o','a.s']);
const raw=p7.parseElfFile(path.join(out,'n.o')),text=raw.sections.find(s=>s.name===section),ro=raw.sections.find(s=>s.name==='.rodata'),fn=raw.symbols.find(s=>s.name===symbol);assert.equal(text.size,fn.size);assert.equal(ro.size,32);
write('n.ld','OUTPUT_ARCH(mips)\nSECTIONS { '+section+' 0x80230000 : { *('+section+') } .rodata '+p7.hex(tableVram+(options.loader?48:options.shared?8:0))+' : { *(.rodata) } /DISCARD/ : { *(.reginfo) *(.pdr) *(.comment) *(.note) } }\nexternal_call = 0x80001234;\n');run(tc.toolsAbs.linker,['-T','n.ld','-o','n.elf','n.o']);const initial=p7.parseElfFile(path.join(out,'n.elf')),rom=Buffer.alloc(0x4000),bodyBytes=p7.elfSectionBytes(initial,initial.sections.find(s=>s.name===section)),tableBytes=p7.elfSectionBytes(initial,initial.sections.find(s=>s.name==='.rodata'));bodyBytes.copy(rom,0x100);tableBytes.copy(rom,options.loader?0x2030:options.shared?0x2008:0x2000);

let otherNative=null;
if(options.shared){
  const otherSymbol='neighbor_dispatch',otherSection='.ob64.r9003.s0';
  write('other.c',source.replaceAll(symbol,otherSymbol));
  const otherSource=path.relative(p7.ROOT,path.join(out,'other.c')).replace(/\\/g,'/');
  const cl=policy.classifyTargetSources([{symbol:otherSymbol,source:otherSource,bytes:4}]).targets[0];
  assert.equal(cl.class,'PURE_C');write('other.i.c',policy.compilationInputBytes(cl));
  run(local.compiler,[...w.config.compiler.compileFlags,'-o','other.compiler.s','other.i.c']);
  write('other.s',p8.adjustSectionAssembly(fs.readFileSync(path.join(out,'other.compiler.s')),otherSection,{allowAuxiliaryReadOnlySections:true}));
  run(tc.assemblerAbs,[...tc.compilerAssemblerFlags,'-o','other.o','other.s']);
  write('other.ld','OUTPUT_ARCH(mips)\nSECTIONS { '+otherSection+' 0x80231000 : { *('+otherSection+') } .rodata 0x80248040 : { *(.rodata) } /DISCARD/ : { *(.reginfo) *(.pdr) *(.comment) *(.note) } }\nexternal_call = 0x80001234;\n');
  run(tc.toolsAbs.linker,['-T','other.ld','-o','other.elf','other.o']);
  const elf=p7.parseElfFile(path.join(out,'other.elf')),obj=p7.parseElfFile(path.join(out,'other.o'));
  const textSection=elf.sections.find(s=>s.name===otherSection),dataSection=elf.sections.find(s=>s.name==='.rodata');
  p7.elfSectionBytes(elf,textSection).copy(rom,0x1000);p7.elfSectionBytes(elf,dataSection).copy(rom,0x2030);
  otherNative={symbol:otherSymbol,section:otherSection,source:otherSource,elf:obj,bytes:textSection.size,
    data:p7.elfSectionBytes(obj,obj.sections.find(s=>s.name==='.rodata')),linkedData:p7.elfSectionBytes(elf,dataSection)};
  rom.fill(0xA5,0x2000,0x2008);rom.fill(0x5A,0x2028,0x2030);rom.fill(0xC3,0x2050,0x2064);
}

function row(index,start,bytes,vram,executable,name){const file=index+'.s',words=[];for(let i=0;i<bytes;i+=4)words.push('/* '+p7.hex(start+i)+' '+p7.hex(vram+i)+' '+p7.hex(rom.readUInt32BE(start+i))+' */ .word '+p7.hex(rom.readUInt32BE(start+i)));const original=Buffer.from('.set noat\n.set noreorder\n.text\n'+name+':\n'+words.join('\n')+'\n');write(file,original);return {index,primaryId:'fixture:'+index,primaryClass:executable?'code':'data',ambiguous:false,inputKind:'tracked-assembly',romStart:start,romEndExclusive:start+bytes,bytes,part:{name,file:path.relative(p7.ROOT,path.join(out,file)).replace(/\\/g,'/'),sha256:p7.sha256Buffer(original),textBytes:original.length,symbolByteOffset:0,chunkIndex:executable?16:20},slices:[{ordinal:index,rowIndex:index,sectionName:'.ob64.r'+index,phdrName:'p'+index,sliceIndex:0,sliceCount:1,romStart:start,romEndExclusive:start+bytes,bytes,vramStart:vram,vramEndExclusive:vram+bytes,executable,placementKind:options.loader?'non-descriptor-load-slab':'overlay',overlayDescriptorId:options.loader?null:99,overlaySection:options.loader?null:executable?'text':'data-rodata',loadSlabId:options.loader?'fixture-loader':null,nonExecutableRangeId:null,executableRangeId:null}]};}
const body=row(9001,0x100,text.size+4,0x80230000,true,symbol),table=row(9002,0x2000,options.loader?1352:options.shared?100:ro.size,tableVram,false,'fixture_table'),s=body.slices[0];
if(options.shared||options.loader){
  // One synthetic original-row identity, confined to this fixture process.
  // Production path rules remain unchanged; no write is redirected.
  const identity='asm/original/__retained_auxiliary_fixture__.s';
  const reserved=path.resolve(p7.ROOT,identity),privateFile=path.resolve(p7.ROOT,table.part.file),expected=table.part.sha256;
  const originals=Object.fromEntries(['readFileSync','existsSync','statSync','lstatSync'].map(key=>[key,fs[key]]));

  write('synthetic-rom.z64',rom);
  const realRom=path.resolve(p7.ROOT,'build/baserom.us_rev0.z64'),privateRom=path.join(out,'synthetic-rom.z64');
  const realRomHash=p7.sha256Buffer(originals.readFileSync(realRom));
  const mappings=new Map([[reserved,{file:privateFile,hash:expected}],[realRom,{file:privateRom,hash:p7.sha256Buffer(rom)}]]);
  const authenticate=record=>{
    const stat=originals.lstatSync(record.file);assert(stat.isFile()&&!stat.isSymbolicLink());
    assert.equal(p7.sha256Buffer(originals.readFileSync(record.file)),record.hash);
  };
  const assertAbsent=file=>assert.equal(originals.existsSync(file),false,'reserved synthetic original identity must not collide');
  assertAbsent(reserved);assert.throws(()=>assertAbsent(privateFile),/must not collide/);
  for(const record of mappings.values())authenticate(record);
  for(const key of Object.keys(originals))fs[key]=function(file,...args){const record=typeof file==='string'?mappings.get(path.resolve(file)):null;if(record){authenticate(record);return originals[key].call(fs,record.file,...args);}return originals[key].call(fs,file,...args);};
  restoreOriginal=()=>{for(const [key,value]of Object.entries(originals))fs[key]=value;assert.equal(p7.sha256Buffer(originals.readFileSync(realRom)),realRomHash,'real ROM unchanged');};
  table.part.file=identity;
}

body.retainedPadding={id:'fixture-terminal',rowIndex:9001,romStart:0x100+text.size,romEndExclusive:body.romEndExclusive,edge:'terminal',sourceSha256:body.part.sha256,expectedSha256:p7.sha256Buffer(Buffer.alloc(4)),compilerFunctions:[{symbol,binding:'GLOBAL',entryEvidence:'owner'}]};
body.slices=[{...s,sectionName:section,phdrName:'p9001s0',romEndExclusive:0x100+text.size,vramEndExclusive:0x80230000+text.size,bytes:text.size,sliceCount:2},{...s,sectionName:'.ob64.r9001.s1',phdrName:'p9001s1',romStart:0x100+text.size,vramStart:0x80230000+text.size,bytes:4,sliceIndex:1,sliceCount:2,retainedPaddingId:'fixture-terminal'}];
const model={...w.model,...((options.shared||options.loader)?{config:{...w.model.config,rom:{...w.model.config.rom,bytes:rom.length,sha256:p7.sha256Buffer(rom)}}}:{}),rows:[body,table],slices:[...body.slices,...table.slices],overlays:[],nonDescriptorLoadSlabs:[]},owner={ownerIndex:0,logicalOffset:0,logicalEnd:text.size,rowIndex:9001,row:body,primaryId:body.primaryId,chunkIndex:16,sectionName:section,symbol,originalAssembly:body.part.file,originalAssemblySha256:body.part.sha256,bytes:text.size,romStartNumber:body.romStart,romEndNumber:body.romStart+text.size,vramStartNumber:0x80230000,vramEndNumber:0x80230000+text.size,expectedTextSha256:p7.sha256Buffer(bodyBytes)};
if(options.loader){
  model.config={...model.config,expected:{...model.config.expected,nonDescriptorLoadSlabs:1},nonDescriptorLoadSlabs:[{id:'fixture-loader',kind:'loader-dma',romStart:0x100,romEndExclusive:0x3000,vramStart:textVram,vramEndExclusive:textVram+0x2f00}]};
  model.nonDescriptorLoadSlabs=p7.validateNonDescriptorLoadSlabs(model.config,model.overlays);
}
const target={...owner,source:relative,sourceSha256:p7.sha256File(path.join(out,'s.c')),rows:[body],model,textOwners:[owner],multiOwner:false,compilerTextFunctions:[{symbol,offset:'0x00000000',offsetNumber:0,bytes:text.size,binding:'GLOBAL',entryEvidence:'owner'}],compilerTextFunctionsExplicit:false,auxiliarySections:[],legacyAncillaryRelocations:[]},rt=p7.elfSectionBytes(raw,ro),ts=table.slices[0];
const contract={kind:'switch-table',compilerSection:'.rodata',outputSection:ts.sectionName,sectionType:'SHT_PROGBITS',sectionFlags:['SHF_ALLOC'],alignment:ro.alignment,romStart:p7.hex(table.romStart),romEndExclusive:p7.hex(table.romEndExclusive),vramStart:p7.hex(ts.vramStart),vramEndExclusive:p7.hex(ts.vramEndExclusive),bytes:ro.size,entries:options.padded?7:8,...(options.padded?{trailingPaddingBytes:4,expectedTrailingPaddingSha256:p7.sha256Buffer(Buffer.alloc(4))}:{}),expectedObjectSha256:p7.sha256Buffer(rt),expectedLinkedSha256:p7.sha256Buffer(tableBytes),preservedTail:null,expectedRelocations:Array.from({length:options.padded?7:8},(_,i)=>({offset:p7.hex(i*4),type:'R_MIPS_32',symbol:'.text',addend:p7.hex(rt.readUInt32BE(i*4)),section:'.rel.rodata'}))};

let otherTarget=null,otherBody=null,sentinel=null;
function retained(kind,start,end){return {inputSection:ts.sectionName+'.'+kind,sectionType:'SHT_PROGBITS',sectionFlags:['SHF_ALLOC'],alignment:1,
  romStart:p7.hex(start),romEndExclusive:p7.hex(end),vramStart:p7.hex(ts.vramStart+start-0x2000),vramEndExclusive:p7.hex(ts.vramStart+end-0x2000),
  bytes:end-start,expectedSha256:p7.sha256Buffer(rom.subarray(start,end)),ownerOriginalAssembly:table.part.file,ownerOriginalAssemblySha256:table.part.sha256};}
if(options.loader){
  contract.romStart=p7.hex(0x2030);contract.romEndExclusive=p7.hex(0x2050);
  contract.vramStart=p7.hex(tableVram+48);contract.vramEndExclusive=p7.hex(tableVram+80);
  contract.preservedPrefix=retained('prefix',0x2000,0x2030);
  contract.preservedTail=retained('tail',0x2050,table.romEndExclusive);
}
if(options.shared){
  contract.romStart=p7.hex(0x2008);contract.romEndExclusive=p7.hex(0x2028);contract.vramStart=p7.hex(0x80248018);contract.vramEndExclusive=p7.hex(0x80248038);
  contract.preservedPrefix=retained('prefix',0x2000,0x2008);
  otherBody=row(9003,0x1000,otherNative.bytes,0x80231000,true,otherNative.symbol);otherBody.slices[0].sectionName=otherNative.section;
  sentinel=row(9004,0x3000,4,0x80250000,false,'fixture_sentinel');model.rows.push(otherBody,sentinel);model.slices.push(...otherBody.slices,...sentinel.slices);
  const secondOwner={...owner,row:otherBody,rowIndex:9003,primaryId:otherBody.primaryId,chunkIndex:16,symbol:otherNative.symbol,
    sectionName:otherNative.section,originalAssembly:otherBody.part.file,originalAssemblySha256:otherBody.part.sha256,bytes:otherNative.bytes,
    romStartNumber:0x1000,romEndNumber:0x1000+otherNative.bytes,vramStartNumber:0x80231000,vramEndNumber:0x80231000+otherNative.bytes,
    logicalEnd:otherNative.bytes,expectedTextSha256:p7.sha256Buffer(rom.subarray(0x1000,0x1000+otherNative.bytes))};
  otherTarget={...target,...secondOwner,source:otherNative.source,sourceSha256:p7.sha256File(path.join(p7.ROOT,otherNative.source)),rows:[otherBody],
    textOwners:[secondOwner],compilerTextFunctions:[{...target.compilerTextFunctions[0],symbol:otherNative.symbol,bytes:otherNative.bytes}],auxiliarySections:[]};
  const secondContract={...contract,romStart:p7.hex(0x2030),romEndExclusive:p7.hex(0x2050),vramStart:p7.hex(0x80248040),vramEndExclusive:p7.hex(0x80248060),
    expectedObjectSha256:p7.sha256Buffer(otherNative.data),expectedLinkedSha256:p7.sha256Buffer(otherNative.linkedData),
    expectedRelocations:contract.expectedRelocations.map((r,i)=>({...r,addend:p7.hex(otherNative.data.readUInt32BE(i*4))})),
    preservedInteriorBefore:{...retained('interior_00002028',0x2028,0x2030),expectedRelocations:[]},preservedTail:retained('tail',0x2050,0x2064)};
  delete secondContract.preservedPrefix;
  otherTarget.expectedRelocations=p8.relocationRecords(otherNative.elf,otherTarget).map(r=>({...r,symbol:r.symbol||'.rodata'}));
  otherTarget.auxiliarySections=a.resolveAuxiliarySectionContracts(model,rom,otherTarget,a.normalizeAuxiliarySectionContracts([secondContract],otherTarget.symbol,'neighbor'));
}
target.expectedRelocations=p8.relocationRecords(raw,target).map(r=>({...r,symbol:r.symbol||'.rodata'}));target.auxiliarySections=a.resolveAuxiliarySectionContracts(model,rom,target,a.normalizeAuxiliarySectionContracts([contract],symbol,'fixture'));a.validateRetainedAuxiliaryComposition(target);const targets=otherTarget?[target,otherTarget]:[target];a.validateAuxiliaryOwnerGroups(targets,model);
const phase8={...w,targets,model,linkSymbols:{external_call:'0x80001234'}},strip=['--remove-section=.reginfo','--remove-section=.pdr','--remove-section=.comment','--remove-section=.note'],objects=[];

const originalGroups=otherBody?[[body,otherBody],[table,sentinel]]:[[body],[table]];
for(const rows of originalGroups){
  const name='chunk_'+String(rows[0].part.chunkIndex).padStart(3,'0');
  write(name+'.s',Buffer.concat(rows.map(r=>Buffer.from(require('../tools/build_phase7_conventional').transformTrackedPartSource(r,fs.readFileSync(path.join(p7.ROOT,r.part.file)))))));
  run(tc.assemblerAbs,[...tc.assemblerFlags,'-o',name+'.raw.o',name+'.s']);fs.mkdirSync(path.join(out,'p7/objects/assembly'),{recursive:true});
  const rel='objects/assembly/'+name+'.o';run(tc.objcopyAbs,[...strip,...rows.flatMap(r=>r.slices.filter(s=>s.executable)).flatMap(s=>['--set-section-flags',s.sectionName+'=alloc,load,code,readonly,data,contents']),name+'.raw.o','p7/'+rel]);
  const f=path.join(out,'p7',rel);objects.push({path:rel,bytes:fs.statSync(f).size,sha256:p7.sha256File(f)});
}

classifications=policy.classifyTargetSources([target]);classification=classifications.targets[0];
if(options.shared||options.loader){assert.deepEqual(p8.loadCanonicalBaserom(phase8),rom);assert.throws(()=>p8.loadCanonicalBaserom({...phase8,model:{...model,config:{...model.config,rom:{...model.config.rom,sha256:'0'.repeat(64)}}}}),/identity drift/);assert.throws(()=>p8.loadCanonicalBaserom({...phase8,model:{...model,config:{...model.config,rom:{...model.config.rom,bytes:rom.length+4}}}}),/identity drift/);}
const dest=path.join(out,'p8');fs.mkdirSync(dest);const copied=p8.copyPhase7Objects(phase8,{files:{objectManifest:path.join(out,'p7/objects/manifest.json')},objectManifest:{objects}},dest,tc.objcopyAbs);p8.compileTarget(phase8,target,dest,local.compiler,tc.assemblerAbs,tc.objcopyAbs,{classification});if(otherTarget)p8.compileTarget(phase8,otherTarget,dest,local.compiler,tc.assemblerAbs,tc.objcopyAbs,{classification:policy.classifyTargetSources([otherTarget]).targets[0]});

const manifest={linkedObjects:targets.map(t=>({path:'objects/c/'+t.symbol+'.o',ownerKind:'matching-c-target',targetSymbol:t.symbol}))};
if(options.shared||options.loader)for(const replacement of copied.replacements.values()){
  for(const prefix of replacement.auxiliaryPrefixes||[])if(prefix.objectRelative)manifest.linkedObjects.push({path:prefix.objectRelative,ownerKind:'accepted-assembly-auxiliary-prefix',targetSymbol:prefix.symbol,...prefix});
  for(const interior of replacement.auxiliaryInteriors||[])manifest.linkedObjects.push({path:interior.objectRelative,ownerKind:'accepted-assembly-auxiliary-interior',targetSymbol:interior.symbol,retainedInterior:interior});
  for(const tail of replacement.auxiliaryTails||[])if(tail.objectRelative)manifest.linkedObjects.push({path:tail.objectRelative,ownerKind:'accepted-assembly-auxiliary-tail',targetSymbol:tail.symbol,...tail});
}
const script=p8.renderPhase8LinkerScript(phase8,manifest);fs.mkdirSync(path.join(dest,'linker'));fs.writeFileSync(path.join(dest,'linker/phase8.ld'),script);run(tc.toolsAbs.linker,[...tc.linkerFlags,'-T','linker/phase8.ld','-Map=phase8.map','-o','phase8.elf','objects/assembly/chunk_016.o','objects/assembly/chunk_020.o','objects/c/'+symbol+'.o',...((otherTarget||options.loader)?manifest.linkedObjects.filter(r=>r.path!=='objects/c/'+symbol+'.o').map(r=>r.path):[])],dest);
const linked=p7.parseElfFile(path.join(dest,'phase8.elf')),fallback=p7.parseElfFile(path.join(dest,'comparison/original/chunk_016.o')),pruned=p7.parseElfFile(path.join(dest,'objects/assembly/chunk_016.o')),c=p7.parseElfFile(path.join(dest,'objects/c/'+symbol+'.o')),proof=p8.verifyEdgePhysicalOwner(target,fallback,pruned,c,linked,rom);p8.verifyEdgeMap(target,fs.readFileSync(path.join(dest,'phase8.map'),'utf8'));p8.deriveSourceObjectProof(phase8,target,dest,classification,linked,rom);p8.verifyRecordedEdgePadding(phase8,dest,{targets:[{symbol,physicalOwnerEvidence:proof}]},{baserom:rom});
const cache=require('../tools/lib/diff_object_cache'),optionsForCache={phase8,compiler:local.compiler,verifiedCompiler:p8.verifyCompiler(w,local.compiler),assembler:{bytes:fs.statSync(tc.assemblerAbs).size,sha256:p7.sha256File(tc.assemblerAbs)},objcopy:{bytes:fs.statSync(tc.objcopyAbs).size,sha256:p7.sha256File(tc.objcopyAbs)},assemblerPath:tc.assemblerAbs,objcopyPath:tc.objcopyAbs,preprocessor:classifications.preprocessor,cacheRoot:path.join(out,'cache')};for(const expected of ['miss','hit']){const output=path.join(out,expected);fs.mkdirSync(output);assert.equal(cache.compileOrReuseTarget({...optionsForCache,target,classification,output}).cache.status,expected);}
if(options.inspect)options.inspect({out,run,tc,proof,otherTarget,targets,model,target,phase8,classification,raw,c,linked,dest,rom,script,manifest,copied,contract,cache,cacheOptions:optionsForCache,compilerBytes:fs.readFileSync(path.join(out,'c.s'))});
if(options.shared){const report={status:'pass',out,padded:!!options.padded,contributors:2,retained:[8,8,20],scope:'real-native synthetic shared-row fixture only'};write('result.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));return report;}
const rejections=[];const reject=(name,fn)=>{assert.throws(fn);rejections.push(name)};
for(const [name,mutate] of [['leading edge',t=>t.row.retainedPadding.edge='leading'],['LOCAL compiler body',t=>t.compilerTextFunctions[0].binding='LOCAL'],['second compiler body',t=>t.compilerTextFunctions.push({...t.compilerTextFunctions[0]})],['missing preamble',t=>t.compilerTextFunctions[0].offsetNumber=8],['missing return delay slot',t=>t.compilerTextFunctions[0].bytes-=4],['two tables',t=>t.auxiliarySections.push({...t.auxiliarySections[0]})],['different descriptor',t=>t.model.rows[1].slices[0].overlayDescriptorId=100],['body-end table destination',t=>t.auxiliarySections[0].expectedRelocations[0].addend=p7.hex(t.bytes)],['native tail',t=>t.nativeTextTail={}],['group',t=>t.compilationGroupId='group'],['union',t=>t.atomicText={}],['projection',t=>t.auxiliaryProjection={}],['derived interface',t=>t.symbol='other'],['native table selection',t=>t.auxiliarySections[0].sourceObjectPrefix={}],['multiple occurrences',t=>t.auxiliarySections[0].compilerOccurrences=[]]]){const t=structuredClone(target);mutate(t);reject(name,()=>a.validateRetainedAuxiliaryComposition(t));}
if(options.loader){
  const normalize=t=>{t.model.nonDescriptorLoadSlabs=p7.validateNonDescriptorLoadSlabs(t.model.config,t.model.overlays);};
  const mutations=[
    ['missing model',t=>delete t.model],['missing config',t=>delete t.model.config],
    ['malformed overlays',t=>t.model.overlays=null],['malformed rows',t=>t.model.rows=null],
    ['missing overlay reservation bounds',t=>t.model.overlays=[{}]],
    ['array overlay reservation',t=>t.model.overlays=[[]]],
    ['reversed overlay reservation',t=>t.model.overlays=[{descriptor_id:0,rom_start:0x3000,rom_end_exclusive:0x2000}]],
    ['missing normalized slabs',t=>delete t.model.nonDescriptorLoadSlabs],
    ['config/model mismatch',t=>t.model.nonDescriptorLoadSlabs[0].vramStart+=4],
    ['duplicate configured slab',t=>{t.model.config.nonDescriptorLoadSlabs.push({...t.model.config.nonDescriptorLoadSlabs[0]});t.model.config.expected.nonDescriptorLoadSlabs++;}],
    ['duplicate accepted row',t=>t.model.rows.push(t.row)],
    ['lookalike accepted row',t=>t.model.rows[0]=structuredClone(t.row)],
    ['wrong text primary',t=>t.primaryId='other'],['wrong text symbol',t=>t.symbol='other'],
    ['wrong text assembly',t=>t.originalAssembly='other'],['wrong text hash',t=>t.originalAssemblySha256='0'.repeat(64)],
    ['wrong text chunk',t=>t.chunkIndex++],['wrong text index',t=>t.rowIndex++],
    ['wrong table primary',t=>t.auxiliarySections[0].ownerPrimaryId='other'],
    ['wrong table assembly',t=>t.auxiliarySections[0].ownerOriginalAssembly='other'],
    ['wrong table hash',t=>t.auxiliarySections[0].ownerOriginalAssemblySha256='0'.repeat(64)],
    ['wrong table chunk',t=>t.auxiliarySections[0].ownerChunkIndex++],
    ['wrong table symbol',t=>t.auxiliarySections[0].ownerSymbol='other'],
    ['wrong table extent',t=>t.auxiliarySections[0].ownerSectionBytes-=4],
    ['wrong table address',t=>t.auxiliarySections[0].ownerSymbolVram+=4],
    ['boot slab',t=>{t.model.config.nonDescriptorLoadSlabs[0].kind='boot-initialized-data';normalize(t);}],
    ['unknown slab',t=>{t.model.config.nonDescriptorLoadSlabs[0].kind='unknown';normalize(t);}],
    ['wrong slab ID',t=>t.model.rows[1].slices[0].loadSlabId='other'],
    ['null slab ID',t=>t.row.slices[0].loadSlabId=null],
    ['overlay mixing',t=>t.row.slices[1].overlaySection='text'],
    ['nonexecutable suffix',t=>t.row.slices[1].executable=false],
    ['executable table',t=>t.model.rows[1].slices[0].executable=true],
    ['body affine drift',t=>{t.row.slices[0].vramStart+=4;t.row.slices[0].vramEndExclusive+=4;}],
    ['table affine drift',t=>{const slab=t.model.config.nonDescriptorLoadSlabs[0];slab.vramStart+=4;slab.vramEndExclusive+=4;normalize(t);}],
    ['table owner coverage',t=>t.model.rows[1].romEndExclusive+=4],
    ['table slice byte extent',t=>t.model.rows[1].slices[0].bytes-=4],
    // Fragment fits; surrounding original bytes of the complete physical owner do not.
    ['fragment-only containment',t=>{const slab=t.model.config.nonDescriptorLoadSlabs[0];slab.romEndExclusive=0x2050;slab.vramEndExclusive=slab.vramStart+slab.romEndExclusive-slab.romStart;normalize(t);}],
    // Move the data owner before the text owner so only the original suffix exceeds the slab.
    ['body-only containment',t=>{
      const data=t.model.rows[1],aux=t.auxiliarySections[0],delta=-0x2000;
      data.romStart+=delta;data.romEndExclusive+=delta;
      for(const key of ['romStart','romEndExclusive','vramStart','vramEndExclusive'])data.slices[0][key]+=delta;
      for(const key of ['romStartNumber','romEndNumber','vramStartNumber','vramEndNumber','ownerRomStartNumber','ownerRomEndNumber','ownerVramStartNumber','ownerVramEndNumber','ownerSymbolVram'])aux[key]+=delta;
      const slab=t.model.config.nonDescriptorLoadSlabs[0];
      // Shift the text later than the complete data row, retaining all relative addresses.
      const move=0x2000;
      t.row.romStart+=move;t.row.romEndExclusive+=move;
      t.row.retainedPadding.romStart+=move;t.row.retainedPadding.romEndExclusive+=move;
      for(const part of t.row.slices)for(const key of ['romStart','romEndExclusive','vramStart','vramEndExclusive'])part[key]+=move;
      slab.romStart=0;slab.vramStart=textVram-0x100;
      slab.romEndExclusive=t.row.romEndExclusive;slab.vramEndExclusive=slab.vramStart+slab.romEndExclusive;normalize(t);
      a.validateRetainedAuxiliaryComposition(t);
      slab.romEndExclusive-=4;slab.vramEndExclusive-=4;normalize(t);
    }],
  ];
  for(const [name,mutate]of mutations){const t=structuredClone(target);mutate(t);reject(name,()=>a.validateRetainedAuxiliaryComposition(t));}
}
for(const sh of [...body.slices,table.slices[0]]){const owner=sh.retainedPaddingId?'objects/assembly/chunk_016.o':'objects/c/'+symbol+'.o';reject('wildcard '+sh.sectionName,()=>p8.verifySharedAuxiliaryScript(phase8,script.replace(owner+'('+sh.sectionName+')','*('+sh.sectionName+')')));}
// A real instruction-changing C source remains nonexact through the same linker.
write('n.c',source.replace('external_call(11)','external_call(12)'));
const nonmatch={...target,source:path.relative(p7.ROOT,path.join(out,'n.c')).replace(/\\/g,'/'),sourceSha256:p7.sha256File(path.join(out,'n.c'))},nc=policy.classifyTargetSources([nonmatch]).targets[0],nd=path.join(out,'n');fs.mkdirSync(nd);assert.equal(nc.class,'PURE_C');
p8.copyPhase7Objects({...phase8,targets:[nonmatch]},{files:{objectManifest:path.join(out,'p7/objects/manifest.json')},objectManifest:{objects}},nd,tc.objcopyAbs);p8.compileTarget(phase8,nonmatch,nd,local.compiler,tc.assemblerAbs,tc.objcopyAbs,{classification:nc});fs.mkdirSync(path.join(nd,'linker'));fs.writeFileSync(path.join(nd,'linker/phase8.ld'),script);run(tc.toolsAbs.linker,[...tc.linkerFlags,'-T','linker/phase8.ld','-Map=phase8.map','-o','phase8.elf','objects/assembly/chunk_016.o','objects/assembly/chunk_020.o','objects/c/'+symbol+'.o',...(options.loader?manifest.linkedObjects.filter(r=>r.path!=='objects/c/'+symbol+'.o').map(r=>r.path):[])],nd);
const negativeLinked=p7.parseElfFile(path.join(nd,'phase8.elf'));assert.equal(p8.deriveSourceObjectProof(phase8,nonmatch,nd,nc,negativeLinked,rom).proof.finalTarget.rawBytesExact,false);reject('real PURE_C changed instruction',()=>p8.verifyEdgePhysicalOwner(nonmatch,fallback,pruned,p7.parseElfFile(path.join(nd,'objects/c/'+symbol+'.o')),negativeLinked,rom));
const report={rejections,status:'pass',out,loader:!!options.loader,padded:!!options.padded,sourceClass:classification.class,bodyBytes:text.size,originalAsmBytes:4,tableBytes:ro.size,cache:['miss','hit'],scope:'synthetic original fixture from real native switch; no retail acceptance'};write('result.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));return report;
}finally{restoreOriginal();}
}
if(require.main===module)main();module.exports={main};


