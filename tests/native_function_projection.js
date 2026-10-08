#!/usr/bin/env node
'use strict';
// Independently derived tracked source fixture, no activation. Links private
// objects only; it never builds CURRENT or edits the accepted configuration.
const assert = require('assert/strict'), fs = require('fs'), path = require('path');
const p7 = require('../tools/lib/phase7_conventional'), p8 = require('../tools/lib/phase8_matching_c');
const active = require('../tools/lib/active_targets'), projection = require('../tools/lib/auxiliary_projection');
const logical = require('../tools/lib/logical_functions');
const { assertToolchainAvailable, loadToolchainConfig, runTool } = require('../tools/lib/real_mips_toolchain');
const clone = value => JSON.parse(JSON.stringify(value)), hex = p7.hex, hash = p7.sha256Buffer;
const policy = require('../tools/lib/source_policy');
const context = active.loadActiveTargetModel(), model = context.model;
const local = JSON.parse(fs.readFileSync(path.join(p7.ROOT, 'config/local-tools.json')));
const verifiedCompiler = p8.verifyCompiler(context, local.compiler);
const tools = assertToolchainAvailable(loadToolchainConfig());
fs.mkdirSync(path.join(p7.ROOT, 'build/tests'), { recursive: true });
const root = fs.mkdtempSync(path.join(p7.ROOT, 'build/tests/native-function-projection-'));
const fixture = fs.readFileSync(path.join(__dirname, 'fixtures/native_function_projection_131828.c'), 'utf8');
assert.equal(hash(Buffer.from(fixture)), 'D7609C410A3C86954014F864B4484CCFCE0C844861C9F97FBA462F73538034B6');
const last = fixture.lastIndexOf('static s32 func_001319F0(RuntimeUnit *unit)');
assert(last > 0);
const control = fixture.slice(0,last) + 'static s32 func_001319F0(RuntimeUnit *unit)\n{\n    if (FIELD(unit, u32, 0x00) & 8)\n        return FIELD(unit, u8, 0x04) >= 30;\n    return 0;\n}\n';
function compile(name, source) {
  const file=path.join(root,name+'.c'),input=path.join(root,name+'.input.c'),assembly=path.join(root,name+'.s'),object=path.join(root,name+'.raw.o');
  fs.writeFileSync(file,source);
  const classifications=policy.classifyTargetSources([{symbol:'func_00131828',source:path.relative(p7.ROOT,file).replace(/\\/g,'/'),bytes:492}]);
  const classification=classifications.targets[0];
  assert.equal(classification.class,'PURE_C');fs.writeFileSync(input,policy.compilationInputBytes(classification));
  p7.run(local.compiler,[...context.config.compiler.compileFlags,'-o',assembly,input]);policy.verifyClassificationInputs(classification);
  runTool(tools.assemblerAbs,[...tools.compilerAssemblerFlags,'-o',object,assembly]);policy.verifyClassificationInputs(classification);
  fs.writeFileSync(path.join(root,name+'.classification.json'),JSON.stringify(classification,null,2));
  return { object:fs.readFileSync(object),assembly:fs.readFileSync(assembly),classification,classifications,file };
}
const positive=compile('exact',fixture), negative=compile('control',control);
const exact=positive.object,nonmatching=negative.object,compiler=positive.assembly;
fs.writeFileSync(path.join(root,'tool-identities.json'),JSON.stringify({compiler:verifiedCompiler,assemblerSha256:p7.sha256File(tools.assemblerAbs)},null,2));
const rom = fs.readFileSync(path.join(p7.ROOT, 'build/baserom.us_rev0.z64'));
const registry = logical.loadRegistry(model, rom);
const row = model.rows.find(row => row.romStart === 0x131828);
const slice = row.slices[0];
const functions = registry.bodies.filter(b => b.romStart >= row.romStart && b.romEndExclusive <= row.romEndExclusive).map((b,i) => ({
  symbol:b.symbol, offset:hex(b.romStart-row.romStart), offsetNumber:b.romStart-row.romStart,
  bytes:b.romEndExclusive-b.romStart, binding:i?'LOCAL':'GLOBAL', entryEvidence:i?'reviewed-local-body':'owner' }));
const target = { symbol:functions[0].symbol, model, row, rows:[row], bytes:row.bytes, rowIndex:row.index,
  romStartNumber:row.romStart,romEndNumber:row.romEndExclusive,vramStartNumber:slice.vramStart,
  sectionName:slice.sectionName, compilerTextFunctions:functions, compilerTextFunctionsExplicit:true,
  reviewedLocalBodyRegistryIdentity:registry.identity,
  textOwners:[{ownerIndex:0,logicalOffset:0,logicalEnd:row.bytes,bytes:row.bytes,sectionName:slice.sectionName,symbol:functions[0].symbol,
    rowIndex:row.index,romStartNumber:row.romStart,romEndNumber:row.romEndExclusive,vramStartNumber:slice.vramStart,vramEndNumber:slice.vramEndExclusive}] };
const native = p7.parseElf32BigEndian(exact), ro = native.sections.find(s=>s.name==='.rodata');
const rawRo = Buffer.from(p7.elfSectionBytes(native,ro));
const blocks = [...compiler.toString().matchAll(/\.section\s+\.rodata([^]*?)\s\.text/g)];
assert.equal(blocks.length,3);
const starts=[0x143180,0x143208,0x143268], offsets=[0,136,232], sizes=[132,92,96];
const segments=[], auxiliary=[];
for(let i=0;i<3;i++) {
  const owner=model.rows.find(r=>r.romStart===starts[i]), s=owner.slices[0];
  if(i) {const gap=model.rows.find(r=>r.romStart===starts[i]-4);segments.push({kind:'zero',offset:offsets[i]-4,bytes:4,ownerSection:gap.slices[0].sectionName,ownerOffset:0,ownerBytes:4,expectedOwnerSha256:hash(rom.subarray(gap.romStart,gap.romEndExclusive))});}
  segments.push({kind:'payload',offset:offsets[i],bytes:sizes[i],outputSection:s.sectionName,
    label:/(?:^|\n)(\.L\d+):/.exec(blocks[i][1])[1],alignmentDirectives:[...blocks[i][1].matchAll(/\.align\s+(\d+)/g)].map(m=>Number(m[1])),dispatchSymbol:functions[i+1].symbol});
  auxiliary.push({kind:'switch-table',compilerSection:'.rodata',outputSection:s.sectionName,sectionType:'SHT_PROGBITS',sectionFlags:['SHF_ALLOC'],alignment:8,
    romStart:hex(owner.romStart),romEndExclusive:hex(owner.romEndExclusive),vramStart:hex(s.vramStart),vramEndExclusive:hex(s.vramEndExclusive),bytes:sizes[i],entries:sizes[i]/4,
    expectedObjectSha256:hash(rawRo.subarray(offsets[i],offsets[i]+sizes[i])),expectedLinkedSha256:hash(rom.subarray(owner.romStart,owner.romEndExclusive)),preservedTail:null,
    expectedRelocations:Array.from({length:sizes[i]/4},(_,n)=>({offset:hex(n*4),type:'R_MIPS_32',symbol:'.text',addend:hex(rawRo.readUInt32BE(offsets[i]+n*4)),section:'.rel.rodata'}))});
}
target.auxiliaryProjection={schemaVersion:3,mode:'fixed-row-readonly-projection',compilerSection:'.rodata',bytes:328,alignment:8,expectedObjectSha256:hash(rawRo),segments,
  nativeText:{bytes:496,alignment:16,outputAlignment:4,terminal:{offset:492,bytes:4,sha256:hash(Buffer.alloc(4)),origin:'native-assembler-section-alignment'}}};
const normalized=active.normalizeAuxiliarySectionContracts(auxiliary,target.symbol,'capture',target.auxiliaryProjection);
target.auxiliarySections=active.resolveAuxiliarySectionContracts(model,rom,target,normalized);
target.auxiliaryProjectionRetained=projection.retainedBindings(target,model,rom);
assert(projection.assembly(compiler,target,p8.adjustSectionAssembly).equals(compiler));
const output=projection.project(exact,target);
const other=projection.project(nonmatching,target);
const projected=p7.parseElf32BigEndian(output.buffer);
const outText=projected.sections.find(s=>s.name===target.sectionName);
assert.equal(outText.size,492);assert.equal(outText.alignment,4);
assert.deepEqual(Buffer.from(p7.elfSectionBytes(projected,outText)),Buffer.from(p7.elfSectionBytes(native,native.sections.find(s=>s.name==='.text'))).subarray(0,492));
assert.equal(output.evidence.nativeText.terminal.bytes,4);
assert.notDeepEqual(other.buffer,output.buffer,'genuine compiled nonmatching source must remain distinguishable');
let rejected=0;
function rejects(label,change) {const t=clone(target),b=Buffer.from(exact);change(t,b);assert.throws(()=>projection.project(b,t),undefined,label);rejected++;}
rejects('swapped attribution',t=>{[t.auxiliaryProjection.segments[0].dispatchSymbol,t.auxiliaryProjection.segments[2].dispatchSymbol]=[t.auxiliaryProjection.segments[2].dispatchSymbol,t.auxiliaryProjection.segments[0].dispatchSymbol];});
rejects('unknown dispatch',t=>{t.auxiliaryProjection.segments[0].dispatchSymbol='unknown';});
rejects('case alias',t=>{t.compilerTextFunctions[1].symbol=t.compilerTextFunctions[1].symbol.replace(/^func_/, 'FUNC_');});
rejects('legacy tags without reviewed registry marker',t=>{t.compilerTextFunctions.slice(1).forEach(fn=>{fn.entryEvidence='fixed-address-call';});});
rejects('missing registry context',t=>{delete t.model;});
rejects('GLOBAL helper',t=>{t.compilerTextFunctions[1].binding='GLOBAL';});
rejects('stale registry',t=>{t.reviewedLocalBodyRegistryIdentity.sha256='0'.repeat(64);});
rejects('missing function',t=>{t.compilerTextFunctions.pop();});
rejects('false terminal size',t=>{t.auxiliaryProjection.nativeText.terminal.bytes=8;});
rejects('nonzero terminal',(t,b)=>{b[native.sections.find(s=>s.name==='.text').offset+492]=1;});
rejects('changed retained ownership',t=>{t.auxiliaryProjectionRetained[0].ownerBytes+=4;});
rejects('multi-owner combination',t=>{t.textOwners.push(clone(t.textOwners[0]));});
rejects('compilation group combination',t=>{t.compilationGroupId='invented';});
// Mutate bytes and corresponding rodata hashes/addends together: interval tests
// must reject independently of the ordinary whole-section hash protection.
for(const addend of [348,337,492]) rejects('next-body/misaligned/terminal target '+addend,(t,b)=>{
 b.writeUInt32BE(addend,ro.offset);t.auxiliarySections[0].expectedRelocations[0].addend=hex(addend);
 t.auxiliaryProjection.expectedObjectSha256=hash(b.subarray(ro.offset,ro.offset+ro.size));
});
const relRo=native.sections.find(s=>s.name==='.rel.rodata');
rejects('relocation into gap',(t,b)=>b.writeUInt32BE(132,relRo.offset));
const relText=native.sections.find(s=>s.name==='.rel.text');
const textSection=native.sections.find(s=>s.name==='.text');
const textEntries=Array.from({length:relText.size/8},(_,i)=>({record:relText.offset+i*8,place:exact.readUInt32BE(relText.offset+i*8),info:exact.readUInt32BE(relText.offset+i*8+4)}));
const anchorHigh=textEntries.find(r=>(r.info&255)===5&&native.symbols[r.info>>>8].sectionIndex===ro.index);
assert(anchorHigh);
rejects('table HI source outside attributed body',(t,b)=>{
 b.writeUInt32BE(0,anchorHigh.record);b.writeUInt32BE(exact.readUInt32BE(textSection.offset+anchorHigh.place),textSection.offset);
});
const named=native.symbols.find(s=>s.name===functions[1].symbol);
for(const type of [2,4]) rejects('named-function-relative terminal '+type,(t,b)=>{
 const record=textEntries.find(r=>(r.info&255)===4);assert(record);
 b.writeUInt32BE((named.symbolIndex<<8)|type,record.record+4);
 const addend=492-named.value;b.writeUInt32BE(type===2?addend:0x0c000000|(addend/4),textSection.offset+record.place);
});
rejects('relocation in terminal',(t,b)=>b.writeUInt32BE(492,relText.offset));
const textSymbol=native.symbols.find(s=>s.symbolType===3&&native.sections[s.sectionIndex]?.name==='.text');
const table=native.sections[textSymbol.symbolTableIndex];
rejects('nonzero text section symbol',(t,b)=>b.writeUInt32BE(4,table.offset+textSymbol.symbolIndex*16+4));
// Links use fixed original data owners for the retained gaps. No source owner is
// activated; the private scripts compare native and projected representations.
fs.writeFileSync(path.join(root,'exact.o'),exact);fs.writeFileSync(path.join(root,'projected.o'),output.buffer);fs.writeFileSync(path.join(root,'nonmatching.o'),other.buffer);
const gaps=target.auxiliaryProjectionRetained.map((g,i)=>{
 const source=fs.readFileSync(path.join(p7.ROOT,g.originalAssembly),'utf8');assert.equal(p7.sha256File(path.join(p7.ROOT,g.originalAssembly)),g.originalAssemblySha256);
 const file=path.join(root,'gap'+i+'.s'),object=path.join(root,'gap'+i+'.o');
 fs.writeFileSync(file,source.replace(/^\.text\r?$/m,`.section ${g.ownerSection},"a",@progbits`));
 runTool(tools.assemblerAbs,[...tools.compilerAssemblerFlags,'-o',object,file]);return object;
});
const externs=native.symbols.filter(s=>s.sectionIndex===0&&s.name).map(s=>{
 let value;if(/^D_[0-9A-Fa-f]{8}$/.test(s.name))value=parseInt(s.name.slice(2),16);
 else {const start=parseInt(s.name.slice(5),16),r=model.rows.find(r=>r.romStart===start);assert(r&&r.slices.length===1,s.name);value=r.slices[0].vramStart;}
 return `${s.name} = ${hex(value)};`;
}).join('\n');
const linked=[];
const comparisonBase=Math.ceil(slice.vramStart/16)*16;
for(const mode of ['exact','projected','nonmatching']) {
 const nativeMode=mode==='exact';const entries=nativeMode?[['.text',comparisonBase],['.rodata',target.auxiliarySections[0].vramStartNumber]]:
 [[target.sectionName,comparisonBase],...target.auxiliarySections.map(s=>[s.outputSection,s.vramStartNumber]),...target.auxiliaryProjectionRetained.map(s=>[s.ownerSection,s.vramStart])];
 const script=path.join(root,mode+'.ld'),file=path.join(root,mode+'.elf');
 fs.writeFileSync(script,'SECTIONS {\n'+entries.sort((a,b)=>a[1]-b[1]).map(([s,v])=>`${s} ${hex(v)} : { *(${s}) }`).join('\n')+'\n.bss 0 (NOLOAD) : { *(.bss) }\n/DISCARD/ : { *(.reginfo) *(.pdr) *(.comment) *(.note) }\n}\n'+externs+'\n');
 runTool(tools.toolsAbs.linker,['-T',script,'-o',file,path.join(root,mode+'.o'),...(nativeMode?[]:gaps)]);
 const e=p7.parseElfFile(file),s=e.sections.find(s=>s.name===(nativeMode?'.text':target.sectionName));
 linked.push(Buffer.from(p7.elfSectionBytes(e,s)).subarray(0,492));
 if(!nativeMode)for(const a of target.auxiliarySections){
  const actual=Buffer.from(p7.elfSectionBytes(e,e.sections.find(s=>s.name===a.outputSection)));
  const expected=Buffer.from(rom.subarray(a.romStartNumber,a.romEndNumber));
  for(let offset=0;offset<expected.length;offset+=4)expected.writeUInt32BE(expected.readUInt32BE(offset)+comparisonBase-slice.vramStart,offset);
  assert(actual.equals(expected));
 }
}
assert(linked[0].equals(linked[1]),'projection must preserve linked native instructions');
// Full retail equality is checked below at the actual owner VMA, without native leading alignment.
assert(!linked[2].equals(linked[1]),'genuine nonmatching control must fail byte equality');
// Exercise production object/proof/cache APIs with an explicit private fixture
// target. No canonical target/config is changed and no full-ROM link occurs.
const tc=require('../tools/lib/text_contract'),cache=require('../tools/lib/diff_object_cache');
Object.assign(target,{source:path.relative(p7.ROOT,positive.file).replace(/\\/g,'/'),sourceSha256:p7.sha256File(positive.file),
  primaryId:row.primaryId,chunkIndex:row.part.chunkIndex,vramEndNumber:slice.vramEndExclusive,
  originalAssembly:row.part.file,originalAssemblySha256:row.part.sha256,expectedTextSha256:hash(rom.subarray(row.romStart,row.romEndExclusive)),
  legacyAncillaryRelocations:[],relocationContractSource:'canonical'});
Object.assign(target.textOwners[0],{primaryId:row.primaryId,chunkIndex:row.part.chunkIndex,row,originalAssembly:row.part.file,
  originalAssemblySha256:row.part.sha256,expectedTextSha256:target.expectedTextSha256});
target.expectedRelocations=p8.relocationRecords(projected,target);
const proofRoot=path.join(root,'proof');fs.mkdirSync(proofRoot);
const compiled=p8.compileTarget(context,target,proofRoot,local.compiler,tools.assemblerAbs,tools.objcopyAbs,{classification:positive.classification});
assert.deepEqual(cache.inspectCompiledTargetArtifacts({phase8:context,target,classification:positive.classification,files:cache.outputArtifactFiles(proofRoot,target)}),compiled);
fs.mkdirSync(path.join(proofRoot,'objects/assembly'),{recursive:true});
const chunks=new Map();
for(const g of target.auxiliaryProjectionRetained){
 if(!chunks.has(g.chunkIndex))chunks.set(g.chunkIndex,[]);
 chunks.get(g.chunkIndex).push(fs.readFileSync(path.join(p7.ROOT,g.originalAssembly),'utf8').replace(/^\.text\r?$/m,`.section ${g.ownerSection},"a",@progbits`));
}
const originalObjects=[];
for(const [chunk,sources] of chunks){
 const file=path.join(proofRoot,'chunk'+chunk+'.s'),obj='objects/assembly/chunk_'+String(chunk).padStart(3,'0')+'.o';
 fs.writeFileSync(file,sources.join('\n'));runTool(tools.assemblerAbs,[...tools.compilerAssemblerFlags,'-o',path.join(proofRoot,obj),file]);originalObjects.push(obj);
}
const sections=[[target.sectionName,target.vramStartNumber,target.romStartNumber],...target.auxiliarySections.map(a=>[a.outputSection,a.vramStartNumber,a.romStartNumber]),...target.auxiliaryProjectionRetained.map(g=>[g.ownerSection,g.vramStart,g.romStart])];
fs.writeFileSync(path.join(proofRoot,'fixture.ld'),'OUTPUT_ARCH(mips)\nSECTIONS {\n'+sections.sort((a,b)=>a[1]-b[1]).map(([s,v,r])=>s+' '+hex(v)+' : AT('+hex(r)+') { *('+s+') }').join('\n')+'\n.bss 0 (NOLOAD) : { *(.bss) }\n/DISCARD/ : { *(.reginfo) *(.pdr) *(.comment) *(.note) } }\n'+externs+'\n'+target.auxiliarySections.map(a=>a.ownerSymbol+' = '+hex(a.ownerSymbolVram)+';').join('\n')+'\n');
runTool(tools.toolsAbs.linker,['-T','fixture.ld','-Map','phase8.map','-o','phase8.elf','objects/c/'+target.symbol+'.o',...originalObjects],{cwd:proofRoot});
const linkedElf=p7.parseElfFile(path.join(proofRoot,'phase8.elf'));
const proof=p8.deriveSourceObjectProof(context,target,proofRoot,positive.classification,linkedElf,rom);
assert.equal(proof.proof.objectEvidence.schemaVersion,8);
assert.equal(proof.proof.finalTarget.rawBytesExact,true,'complete492 bytes at accepted VMA');
p8.validateSourceObjectProofBytes(proof.proofBytes,proof.proofBytes);
for(const field of ['terminal','functions','tableAttribution','nativeSha256','projectedSha256']){
 const bad=clone(proof.proof);delete bad.objectEvidence.auxiliaryProjection.nativeText[field];
 const bytes=Buffer.from(JSON.stringify(bad));assert.throws(()=>p8.validateSourceObjectProofBytes(bytes,bytes));rejected++;
}
const cached={phase8:context,target,classification:positive.classification,compiler:local.compiler,verifiedCompiler,
 assembler:{bytes:fs.statSync(tools.assemblerAbs).size,sha256:p7.sha256File(tools.assemblerAbs)},
 objcopy:{bytes:fs.statSync(tools.objcopyAbs).size,sha256:p7.sha256File(tools.objcopyAbs)},
 assemblerPath:tools.assemblerAbs,objcopyPath:tools.objcopyAbs,preprocessor:positive.classifications.preprocessor,cacheRoot:path.join(root,'cache')};
let key;
for(const expected of ['miss','hit']){const out=path.join(root,'cache-'+expected);fs.mkdirSync(out);const result=cache.compileOrReuseTarget({...cached,output:out});assert.equal(result.cache.status,expected);key=result.cache.key;}
const metadataFile=path.join(cache.cacheEntryPath(cached.cacheRoot,target,key),'metadata.json'),metadata=JSON.parse(fs.readFileSync(metadataFile));
for(const field of ['terminal','tableAttribution','functions']){
 const bad=clone(metadata);delete bad.compiled.objectEvidence.auxiliaryProjection.nativeText[field];fs.writeFileSync(metadataFile,JSON.stringify(bad));
 const out=path.join(root,'cache-rebuild-'+field);fs.mkdirSync(out);const result=cache.compileOrReuseTarget({...cached,output:out});assert.equal(result.cache.status,'rebuilt');rejected++;
}
const accounting=require('../tools/lib/status_accounting').summarizeAcceptedOwnership(model,[target]);
assert.equal(accounting.replacements.bytes,812,'492 text plus320 table bytes; native terminal and ASM gaps are not C');
console.log(JSON.stringify({status:'pass',rejected,root,linkedExact:true,nonmatchingRejected:true,acceptanceEligible:false}));
