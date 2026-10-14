'use strict';
// Native assembly fixtures test ownership/metadata, never PURE_C acceptance.
const assert=require('assert'),fs=require('fs'),path=require('path');
const p7=require('../tools/lib/phase7_conventional'),p8=require('../tools/lib/phase8_matching_c');
const {transformTrackedPartSource}=require('../tools/build_phase7_conventional');
function main(toolRepo=p7.ROOT){
 const native=require(path.join(toolRepo,'tools/lib/real_mips_toolchain'));const tc=native.assertToolchainAvailable(native.loadToolchainConfig());
 const root=fs.mkdtempSync(path.join((fs.mkdirSync(path.join(p7.ROOT,'build/registered-padding-native'),{recursive:true}),path.join(p7.ROOT,'build/registered-padding-native')),'case-'));
 let controls=0;const results=[];
 for(const edge of ['leading','terminal']){
  const dir=path.join(root,edge);fs.mkdirSync(dir);for(const name of ['objects/assembly','objects/c'])fs.mkdirSync(path.join(dir,name),{recursive:true});
  const index=edge==='leading'?9001:9002,lead=edge==='leading'?4:0,tail=edge==='terminal'?8:0;
  const physical=edge==='leading'?'fixture_physical':'fixture_entry';
  const funcs=edge==='leading'?[{symbol:'fixture_entry',offsetNumber:0,bytes:8,binding:'GLOBAL',entryEvidence:'owner'}]:[{symbol:'fixture_entry',offsetNumber:0,bytes:8,binding:'GLOBAL',entryEvidence:'owner'},{symbol:'fixture_local_a',offsetNumber:8,bytes:8,binding:'LOCAL',entryEvidence:'internal-call-only'},{symbol:'fixture_local_b',offsetNumber:16,bytes:8,binding:'LOCAL',entryEvidence:'internal-call-only'}];
  const n=funcs.length*8,romStart=0x100,vram=0x80001000,bodyStart=romStart+lead,words=[...Array(lead/4).fill(0),...funcs.flatMap(()=>[0x03e00008,0]),...Array(tail/4).fill(0)];
  const source=['.set noat','.set noreorder','.text',physical+':'];
  words.forEach((word,i)=>{if(edge==='leading'&&i===2)source.push('fixture_unused_marker:');if(edge==='terminal'&&[2,4].includes(i))source.push(funcs[i/2].symbol+':');source.push('/* 0x'+(romStart+i*4).toString(16).padStart(8,'0')+' 0x'+(vram+i*4).toString(16)+' 0x'+word.toString(16).padStart(8,'0')+' */ .word 0x'+word.toString(16));});
  const buf=Buffer.from(source.join('\n')+'\n'),padStart=edge==='leading'?romStart:romStart+n,padEnd=edge==='leading'?bodyStart:romStart+n+tail;
  const row={index,primaryId:'fixture:'+index,name:'fixture_row',romStart,romEndExclusive:romStart+words.length*4,bytes:words.length*4,inputKind:'tracked-assembly',part:{name:physical,file:'fixture.s',sha256:p7.sha256Buffer(buf),textBytes:buf.length,symbolByteOffset:0,chunkIndex:0}};
  row.retainedPadding={id:'fixture-'+edge,rowIndex:index,romStart:padStart,romEndExclusive:padEnd,edge,compilerFunctions:funcs.map(({symbol,binding,entryEvidence})=>({symbol,binding,entryEvidence})),sourceSha256:row.part.sha256,expectedSha256:p7.sha256Buffer(Buffer.alloc(lead+tail))};
  const cut=edge==='leading'?bodyStart:romStart+n;row.slices=[[romStart,cut],[cut,row.romEndExclusive]].map(([a,b],i)=>({rowIndex:index,sectionName:'.ob64.r'+index+'.s'+i,sliceIndex:i,romStart:a,romEndExclusive:b,bytes:b-a,vramStart:vram+a-romStart,vramEndExclusive:vram+b-romStart,executable:true,nonExecutableRangeId:null,executableRangeId:null,placementKind:'early-boot-linear',overlayDescriptorId:null,overlaySection:null,loadSlabId:null,...(a===padStart?{retainedPaddingId:row.retainedPadding.id}:{})}));
  const binding=p7.retainedPaddingSlices(row),body=binding.body;
  const write=(f,t)=>fs.writeFileSync(path.join(dir,f),t),run=(exe,args)=>native.runTool(exe,args,{cwd:dir});
  write('original.s',transformTrackedPartSource(row,buf));
  run(tc.assemblerAbs,[...tc.assemblerFlags,'-o','original.raw.o','original.s']);
  const strip=['--remove-section=.reginfo','--remove-section=.pdr','--remove-section=.comment','--remove-section=.note'];
  run(tc.objcopyAbs,[...strip,...row.slices.flatMap(s=>['--set-section-flags',s.sectionName+'=alloc,load,code,readonly,data,contents']),'original.raw.o','original.o']);
  const nativeSource=['.set noat','.set noreorder','.section '+body.sectionName+',"ax",@progbits','.align 2',...funcs.flatMap(f=>[...(f.binding==='GLOBAL'?['.globl '+f.symbol]:[]),'.type '+f.symbol+',@function',f.symbol+':','jr $31','nop','.size '+f.symbol+',.-'+f.symbol])].join('\n')+'\n';
  write('body.s',nativeSource);run(tc.assemblerAbs,[...tc.compilerAssemblerFlags,'-o','body.raw.o','body.s']);run(tc.objcopyAbs,[...strip,'body.raw.o','objects/c/fixture_entry.o']);
  run(tc.objcopyAbs,['--remove-section='+body.sectionName,...(edge==='terminal'?['--strip-symbol='+physical]:[]),'original.o','objects/assembly/chunk_000.o']);
  const original=p7.parseElfFile(path.join(dir,'original.o')),cfile=path.join(dir,'objects/c/fixture_entry.o'),c=p7.parseElfFile(cfile),pruned=p7.parseElfFile(path.join(dir,'objects/assembly/chunk_000.o'));
  const target={symbol:'fixture_entry',row,rows:[row],source:'fixture.c',rowIndex:index,primaryId:row.primaryId,chunkIndex:0,originalAssembly:row.part.file,originalAssemblySha256:row.part.sha256,sectionName:body.sectionName,bytes:n,vramStartNumber:body.vramStart,romStartNumber:body.romStart,romEndNumber:body.romEndExclusive,compilerTextFunctions:funcs,compilerTextFunctionsExplicit:funcs.length>1,auxiliarySections:[],textOwners:[{ownerIndex:0,logicalOffset:0,logicalEnd:n,rowIndex:index,row,primaryId:row.primaryId,chunkIndex:0,sectionName:body.sectionName,symbol:physical,originalAssembly:row.part.file,originalAssemblySha256:row.part.sha256,bytes:n,romStartNumber:body.romStart,romEndNumber:body.romEndExclusive,vramStartNumber:body.vramStart,vramEndNumber:body.vramEndExclusive}]};
  const model={rows:[row],slices:row.slices,overlays:[],nonDescriptorLoadSlabs:[],config:{rom:{bytes:row.romEndExclusive}}};
  const script=p8.renderPhase8LinkerScript({targets:[target],model,linkSymbols:{}},{linkedObjects:[]});write('link.ld',script);
  assert(!script.includes('*('+body.sectionName+')'));const before=p7.sha256File(cfile);
  run(tc.toolsAbs.linker,['-EB','-m','elf32bmip','-T','link.ld','-Map=link.map','-o','linked.elf','objects/assembly/chunk_000.o','objects/c/fixture_entry.o']);
  assert.equal(p7.sha256File(cfile),before);
  const linked=p7.parseElfFile(path.join(dir,'linked.elf')),rom=Buffer.alloc(row.romEndExclusive);words.forEach((w,i)=>rom.writeUInt32BE(w,romStart+i*4));
  const proof=p8.verifyEdgePhysicalOwner(target,original,pruned,c,linked,rom);assert.equal(proof.bytes,row.bytes);
  assert.equal(proof.omittedLocalSymbols.length,edge==='leading'?1:0);assert(!c.symbols.some(s=>s.name==='fixture_unused_marker'));
  p8.verifyCompilerTextFunctions(linked,target,linked.sections.find(s=>s.name===body.sectionName),true);
  p8.verifyEdgeMap(target,fs.readFileSync(path.join(dir,'link.map'),'utf8'));
  fs.mkdirSync(path.join(dir,'comparison/original'),{recursive:true});fs.mkdirSync(path.join(dir,'linker'),{recursive:true});
  fs.copyFileSync(path.join(dir,'original.o'),path.join(dir,'comparison/original/chunk_000.o'));
  fs.copyFileSync(path.join(dir,'linked.elf'),path.join(dir,'phase8.elf'));fs.copyFileSync(path.join(dir,'link.map'),path.join(dir,'phase8.map'));write('linker/phase8.ld',script);
  const phase8={targets:[target],model,linkSymbols:{}},verification={targets:[{symbol:target.symbol,physicalOwnerEvidence:proof}]};
  p8.verifyRecordedEdgePadding(phase8,dir,verification,{elf:linked,baserom:rom});
  p8.verifyRecordedEdgePadding(phase8,dir,verification,{elf:linked,baserom:rom});
  assert.throws(()=>p8.verifyRecordedEdgePadding(phase8,dir,{targets:[{symbol:target.symbol}]},{elf:linked,baserom:rom}),/proof drift/);controls++;
  // Exercise actual on-disk changes through fresh proof, recorded reuse and the
  // parsed-ELF context used by CURRENT. Restore every artifact after each case.
  const prunedPath=path.join(dir,'objects/assembly/chunk_000.o'),linkedPath=path.join(dir,'phase8.elf');
  const falsifiers=[];
  const rejectArtifact=(name,file,change,pattern)=>{
   const saved=fs.readFileSync(file),changed=Buffer.from(saved);change(changed);fs.writeFileSync(file,changed);
   try {
    const readLinked=()=>p7.parseElfFile(linkedPath),readPruned=()=>p7.parseElfFile(prunedPath);
    assert.throws(()=>p8.verifyEdgePhysicalOwner(target,original,readPruned(),c,readLinked(),rom),pattern,name+' fresh');
    assert.throws(()=>p8.verifyRecordedEdgePadding(phase8,dir,verification,{baserom:rom}),pattern,name+' recorded');
    assert.throws(()=>p8.verifyRecordedEdgePadding(phase8,dir,verification,{elf:readLinked(),baserom:rom}),pattern,name+' CURRENT helper');
    controls+=3;falsifiers.push({name,freshRejected:true,recordedRejected:true,currentHelperRejected:true});
   } finally {fs.writeFileSync(file,saved);}
  };
  const retainedSh=pruned.sections.find(s=>s.name===binding.retained.sectionName);
  rejectArtifact('retained payload',prunedPath,b=>{b[retainedSh.offset]^=1;},/pruned payload/);
  const retainedSymbol=pruned.symbols.find(s=>s.sectionIndex===retainedSh.index&&s.symbolType!==3);
  assert(retainedSymbol,'retained physical/generated marker required');
  const symtab=pruned.sections[retainedSymbol.symbolTableIndex],symOffset=symtab.offset+retainedSymbol.symbolIndex*16;
  rejectArtifact('retained symbol binding',prunedPath,b=>{b[symOffset+12]^=0x10;},/symbol provenance/);
  rejectArtifact('retained symbol value',prunedPath,b=>b.writeUInt32BE(retainedSymbol.value+4,symOffset+4),/symbol provenance/);
  rejectArtifact('introduced relocation section',prunedPath,b=>b.writeUInt32BE(9,symtab.headerOffset+4),/pruned relocations/);
  const retainedLinked=linked.sections.find(s=>s.name===binding.retained.sectionName);
  rejectArtifact('retained section VMA',linkedPath,b=>b.writeUInt32BE(retainedLinked.address+4,retainedLinked.headerOffset+12),/load mapping/);
  const load=linked.programHeaders.find(h=>h.type===1&&h.vaddr===binding.retained.vramStart),ph=linked.header.phoff+load.index*linked.header.phentsize;
  for(const [name,offset,value] of [['type',0,0],['offset',4,load.offset+4],['VMA',8,load.vaddr+4],['LMA',12,load.paddr+4],['filesz',16,load.fileSize+4],['memsz',20,load.memorySize+4],['flags',24,4]]){
   rejectArtifact('retained load '+name,linkedPath,b=>b.writeUInt32BE(value,ph+offset),/load mapping/);
  }
  const otherLoad=linked.programHeaders.find(h=>h.type===1&&h.index!==load.index),otherPh=linked.header.phoff+otherLoad.index*linked.header.phentsize;
  rejectArtifact('duplicate retained load',linkedPath,b=>b.copy(b,otherPh,ph,ph+linked.header.phentsize),/load mapping|load containment/);
  // Unchanged artifacts must remain usable after the rejection controls.
  p8.verifyRecordedEdgePadding(phase8,dir,verification,{baserom:rom});
  p8.verifyEdgePhysicalOwner(target,original,p7.parseElfFile(prunedPath),c,p7.parseElfFile(linkedPath),rom);
  fs.writeFileSync(path.join(dir,'falsifiers.json'),JSON.stringify(falsifiers,null,2)+'\n');

  write('linker/phase8.ld',script.replace('objects/c/fixture_entry.o('+body.sectionName+')','*('+body.sectionName+')'));
  assert.throws(()=>p8.verifyRecordedEdgePadding(phase8,dir,verification,{elf:linked,baserom:rom}),/selector drift/);controls++;write('linker/phase8.ld',script);
  for(const slice of row.slices){const sh=linked.sections.find(s=>s.name===slice.sectionName);assert.equal(sh.address,slice.vramStart);assert.equal(sh.flags,6);assert.equal(linked.programHeaders.filter(h=>h.type===1&&h.vaddr===slice.vramStart&&h.paddr===slice.romStart&&h.fileSize===slice.bytes&&h.flags===5).length,1);}
  if(edge==='leading'){
   assert.throws(()=>p8.verifyEdgeFallback(target,original,['fixture_unused_marker']),/significant/);controls++;
   const mutate=fn=>{const x=p7.parseElfFile(path.join(dir,'original.o'));fn(x.symbols.find(s=>s.name==='fixture_unused_marker'));assert.throws(()=>p8.verifyEdgeFallback(target,x),/significant/);controls++;};
   mutate(s=>s.size=4);mutate(s=>s.binding=1);mutate(s=>s.symbolType=2);
  }
  const map=fs.readFileSync(path.join(dir,'link.map'),'utf8');assert.throws(()=>p8.verifyEdgeMap(target,map.replace(' from objects/c/fixture_entry.o',' *fill*\n from objects/c/fixture_entry.o')),/fill/);controls++;
  results.push({edge,proof,objectSha256:before,linkedSha256:p7.sha256File(path.join(dir,'linked.elf'))});
 }
 const report={status:'pass',scope:'pinned native assembly ownership fixtures, not PURE_C or production acceptance',controls,results};fs.writeFileSync(path.join(root,'report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify({status:'pass',root,controls,cases:results.length}));return report;
}
if(require.main===module)main(process.argv[2]);module.exports={main};
