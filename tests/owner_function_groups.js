#!/usr/bin/env node
'use strict';
// Native fixtures only. The real producer requires the jointly integrated,
// reviewed logical metadata; it does not repair or activate canonical inputs.
const assert=require('assert/strict'),fs=require('fs'),path=require('path');
const p7=require('../tools/lib/phase7_conventional'),p8=require('../tools/lib/phase8_matching_c');
const active=require('../tools/lib/active_targets'),groups=require('../tools/lib/compilation_groups');
const logical=require('../tools/lib/logical_functions'),policy=require('../tools/lib/source_policy'),cache=require('../tools/lib/diff_object_cache');
const tc=require('../tools/lib/text_contract');
const {assertToolchainAvailable,loadToolchainConfig,runTool}=require('../tools/lib/real_mips_toolchain');
const {ROOT,hex,sha256Buffer:hash}=p7,context=active.loadActiveTargetModel();
const local=JSON.parse(fs.readFileSync(path.join(ROOT,'config/local-tools.json'))),verifiedCompiler=p8.verifyCompiler(context,local.compiler);
const tools=assertToolchainAvailable(loadToolchainConfig()),retail=fs.readFileSync(path.join(ROOT,'build/baserom.us_rev0.z64'));
fs.mkdirSync(path.join(ROOT,'build/tests'),{recursive:true});const root=fs.mkdtempSync(path.join(ROOT,'build/tests/owner-functions-')),results=[];
function compile(dir,file,name){const relative=path.relative(ROOT,file).replace(/\\/g,'/'),classification=policy.classifyTargetSources([{symbol:name,source:relative,bytes:4}]).targets[0];
 assert.equal(classification.class,'PURE_C');const input=path.join(dir,'input.c'),assembly=path.join(dir,'compiler.s'),object=path.join(dir,'native.o');fs.writeFileSync(input,policy.compilationInputBytes(classification));
 p7.run(local.compiler,[...context.config.compiler.compileFlags,'-o',assembly,input]);policy.verifyClassificationInputs(classification);runTool(tools.assemblerAbs,[...tools.compilerAssemblerFlags,'-o',object,assembly]);policy.verifyClassificationInputs(classification);
 return {relative,classification,raw:p7.parseElfFile(object)};}
function fixture(real){const dir=path.join(root,real?'checksum':'unrelated');fs.mkdirSync(dir);
 const file=real?path.join(__dirname,'fixtures/checksum_owner_functions/checksum-chain-ready.c'):path.join(dir,'unrelated.c');
 if(real)assert.equal(p7.sha256File(file),'F4A864C75D8F2546490002E0C56A02ED566E5130BD3DB8D4DB6C509CA05FE234');else fs.writeFileSync(file,'int unrelated_first(void){return 1;}\nint unrelated_second(void){return 2;}\nint unrelated_third(void){return 3;}\n');
 const capture=compile(dir,file,real?'func_00005760':'unrelated_first'),{raw}=capture,text=raw.sections.find(s=>s.name==='.text');
 const functions=raw.symbols.filter(s=>s.symbolType===2).map(s=>({symbol:s.name,offset:s.value,bytes:s.size,binding:s.binding,symbolType:s.symbolType,visibility:s.visibility})).sort((a,b)=>a.offset-b.offset),end=functions.at(-1).offset+functions.at(-1).bytes;
 assert.equal(functions.length,real?12:3);assert(functions.every(f=>f.binding===1));assert(text.size>end);
 if(real){assert.equal(text.size,2144);assert.equal(end,2140);assert.deepEqual(functions.map(f=>f.bytes),[188,348,272,260,204,164,160,232,64,60,96,92]);assert.equal(hash(p7.elfSectionBytes(raw,text)),'EED5CF845ECF018AC62FE5CC14C41AF5B6FCB5310CDEE0DA7AC81E6AF1E48DA1');}
 const firstVram=real?0x80075360:0x80230000,firstRom=real?0x5760:0x100;
 let rows,model,rom,registry;
 if(real){rows=context.model.rows.filter(r=>r.index>=48&&r.index<=55);for(const row of rows)assert.equal(active.resolveAcceptedRow(context.model,'func_'+row.romStart.toString(16).padStart(8,'0')).index,row.index);model={...context.model,overlays:[],rows,slices:rows.flatMap(r=>r.slices)};rom=retail;registry=logical.loadRegistry(context.model,rom);}
 else {
  rom=Buffer.alloc(0x1000);p7.elfSectionBytes(raw,text).copy(rom,firstRom);
  const original=path.join(dir,'original.s');fs.writeFileSync(original,functions.map(f=>f.symbol+':\n'+Array.from({length:f.bytes/4},(_,i)=>'.word '+hex(rom.readUInt32BE(firstRom+f.offset+i*4))).join('\n')).join('\n')+'\n'+Array((text.size-end)/4).fill('.word 0').join('\n'));
  const part={file:path.relative(ROOT,original).replace(/\\/g,'/'),sha256:p7.sha256File(original),textBytes:fs.statSync(original).size,chunkIndex:0,symbolByteOffset:0};
  rows=[0,1].map((i)=>{const offset=i?functions[1].offset:0,bytes=i?text.size-offset:functions[0].bytes;return {index:i,primaryId:'fixture:'+i,primaryClass:'code',ambiguous:false,inputKind:'tracked-assembly',romStart:firstRom+offset,romEndExclusive:firstRom+offset+bytes,bytes,part:{...part,name:functions[i].symbol},slices:[{sectionName:'.ob64.r'+String(i).padStart(4,'0'),executable:true,bytes,romStart:firstRom+offset,romEndExclusive:firstRom+offset+bytes,vramStart:firstVram+offset,vramEndExclusive:firstVram+offset+bytes,placementKind:'early-boot-linear',overlayDescriptorId:null,overlaySection:null,loadSlabId:null}]};});
  model={config:{profile:context.model.config.profile,rom:{bytes:rom.length,sha256:hash(rom)}},rows,slices:rows.flatMap(r=>r.slices),overlays:[]};
  const config=JSON.parse(fs.readFileSync(logical.CONFIG_PATH));config.bodies=functions.slice(1).map(f=>({symbol:f.symbol,aliases:[],romStart:firstRom+f.offset,romEndExclusive:firstRom+f.offset+f.bytes,expectedBytesSha256:hash(rom.subarray(firstRom+f.offset,firstRom+f.offset+f.bytes)),fragments:logical.intersections(model,firstRom+f.offset,firstRom+f.offset+f.bytes),evidence:{status:'independent-entry-supported',caseId:'native-fixture:'+f.symbol,rationale:'Independently authored test function with its own return; fixture only.'}}));
  config.padding=[{romStart:firstRom+end,romEndExclusive:firstRom+text.size,expectedBytesSha256:hash(Buffer.alloc(text.size-end)),evidence:'Authenticated actual native terminal zeros; fixture only.'}];config.unavailableBodies=[];config.preservedProductionEnvelopes=[];registry=logical.loadRegistry(model,rom,config);
 }
 const group={id:real?'checksum_fixture':'unrelated_functions',source:capture.relative,mode:'native-text-owner-functions-projection',
  members:rows.map(r=>({symbol:functions.find(f=>firstRom+f.offset===r.romStart).symbol,ownerRowIndex:r.index,functionSymbols:functions.filter(f=>firstRom+f.offset>=r.romStart&&firstRom+f.offset<r.romEndExclusive).map(f=>f.symbol)})),
  text:{section:'.text',bytes:text.size,alignment:text.alignment,type:1,flags:6,sha256:hash(p7.elfSectionBytes(raw,text))},functions,tail:{offset:end,bytes:text.size-end,sha256:hash(Buffer.alloc(text.size-end)),origin:'native-assembler-section-alignment'},
  relocations:groups.relocations(raw).filter(r=>r.owner.name==='.text').map(r=>({offset:r.place,type:r.type,symbol:r.symbol.symbolType===3?raw.sections[r.symbol.sectionIndex].name:r.symbol.name,symbolValue:r.symbol.value,symbolSection:r.symbol.sectionIndex===0?'UND':r.symbol.sectionIndex===0xfff1?'ABS':raw.sections[r.symbol.sectionIndex].name,word:raw.buffer.readUInt32BE(text.offset+r.place)}))};
 if(real)assert.equal(group.relocations.length,106);
 groups.registry({schemaVersion:1,profile:'fixture',groups:[group]},'fixture');
 const targets=rows.map((r,i)=>{const slice=r.slices[0],owner={ownerIndex:0,logicalOffset:0,logicalEnd:r.bytes,bytes:r.bytes,sectionName:slice.sectionName,symbol:group.members[i].symbol,rowIndex:r.index,primaryId:r.primaryId,chunkIndex:r.part.chunkIndex,romStartNumber:r.romStart,romEndNumber:r.romEndExclusive,vramStartNumber:slice.vramStart,vramEndNumber:slice.vramEndExclusive,originalAssembly:r.part.file,originalAssemblySha256:r.part.sha256,expectedTextSha256:hash(rom.subarray(r.romStart,r.romEndExclusive)),row:r};
 return {...owner,symbol:group.members[i].symbol,source:capture.relative,sourceSha256:p7.sha256File(file),compilationGroupId:group.id,textOwners:[owner],compilerTextFunctions:[],compilerTextFunctionsExplicit:false,auxiliarySections:[],row:r,rows:[r],model,overlayDescriptorId:null,descriptorRawSha256:null,legacyAncillaryRelocations:[],relocationContractSource:'compilation-group'};});
 const symbols=real?{...context.linkSymbols}:{unrelated_first:hex(firstVram),unrelated_third:hex(firstVram+functions[2].offset)};
 // Private subset bindings cover actual references only; production exports stay unchanged.
 function bindExternalEntries(table,entries){for(const rel of groups.relocations(raw)){const symbol=rel.symbol;
  if(symbol.sectionIndex!==0||Object.hasOwn(table,symbol.name))continue;
  const matches=entries.filter(t=>t.symbol===symbol.name);
  assert.equal(matches.length,1,'unique accepted external entry '+symbol.name);
  const entry=matches[0];assert(!rows.some(r=>entry.romStartNumber>=r.romStart&&entry.romStartNumber<r.romEndExclusive),'external overlaps selected group');
  table[symbol.name]=hex(entry.vramStartNumber);
 }}
 if(real){const missing=groups.relocations(raw).find(r=>r.symbol.sectionIndex===0&&!Object.hasOwn(symbols,r.symbol.name));assert(missing);
  const entry=context.targets.find(t=>t.symbol===missing.symbol.name);assert(entry);
  assert.throws(()=>bindExternalEntries({...symbols},context.targets.filter(t=>t!==entry)),/unique accepted external entry/);
  assert.throws(()=>bindExternalEntries({...symbols},[...context.targets,entry]),/unique accepted external entry/);
  assert.throws(()=>bindExternalEntries({...symbols},context.targets.map(t=>t===entry?{...t,romStartNumber:rows[0].romStart}:t)),/external overlaps selected group/);
  bindExternalEntries(symbols,context.targets);
 }
 groups.bind([group],targets,{model,baserom:rom,logicalRegistry:registry,linkSymbols:symbols});active.validateNoActiveLinkSymbolShadows(targets,symbols);
 const bound=targets[0].compilationGroup,projected=groups.project(raw.buffer,bound);groups.validateObject(p7.parseElf32BigEndian(projected.buffer),bound,'projected');
 const rejected=[];function reject(name,fn,diagnostic){assert.throws(fn,diagnostic,name);rejected.push(name);}function regReject(name,change,diagnostic){const copy=structuredClone(group);change(copy);reject(name,()=>groups.registry({schemaVersion:1,profile:'fixture',groups:[copy]},'fixture'),diagnostic);}
 for(const [name,change]of [['omitted function',g=>g.members.at(-1).functionSymbols.pop()],['reordered functions',g=>g.members.at(-1).functionSymbols.reverse()],['LOCAL secondary',g=>g.functions.at(-1).binding=0],['function crosses owner',g=>g.functions[0].bytes+=4],['fake tail',g=>g.tail.bytes+=4],['duplicate owner',g=>g.members[1].ownerRowIndex=g.members[0].ownerRowIndex],['auxiliary extension',g=>g.auxiliary={}],['duplicate function',g=>g.functions.at(-1).symbol=g.functions[0].symbol],['missing owner',g=>g.members.pop()],['reordered owners',g=>g.members.reverse()],['partial owner function name',g=>g.members.at(-1).functionSymbols[1]='missing_body']])regReject(name,change);
 const collapsed=structuredClone(bound),last=collapsed.members.at(-1),removed=new Set(last.functionSymbols.slice(1));
 const primary=collapsed.functions.find(f=>f.symbol===last.symbol);
 primary.bytes=collapsed.functions.filter(f=>last.functionSymbols.includes(f.symbol)).reduce((sum,f)=>sum+f.bytes,0);
 last.functionSymbols=[last.symbol];collapsed.functions=collapsed.functions.filter(f=>!removed.has(f.symbol));
 assert.equal(primary.offset+primary.bytes,collapsed.tail.offset);
 reject('coordinated singleton collapse preserves owner extent and tail',()=>logical.assertNativeGroupBodies(registry,rows,collapsed),/native group complete logical body census/);
 reject('missing authenticated group context',()=>groups.validateObject(raw,{...bound,logicalBinding:null},'raw'));
 reject('duplicate active native definition',()=>active.validateNoActiveLinkSymbolShadows([...targets,targets[0]],symbols));
 const wrongAlias={...symbols,[group.functions[0].symbol]:hex(firstVram+4)};reject('wrong fixed alias address',()=>groups.fixedBindingRecords(bound,wrongAlias));
 const badPadding=Buffer.from(raw.buffer);badPadding[text.offset+end]=1;reject('nonzero owned native tail',()=>groups.validateObject(p7.parseElf32BigEndian(badPadding),bound,'raw'));
 const outside=structuredClone(bound);outside.functions.at(-1).bytes+=4;reject('invented executable tail',()=>groups.project(raw.buffer,outside));
 if(real){
  const missingConfig=JSON.parse(fs.readFileSync(logical.CONFIG_PATH));missingConfig.bodies=missingConfig.bodies.filter(b=>Number(b.romStart)!==0x5EC4);
  const missingRegistry=logical.loadRegistry(context.model,rom,missingConfig);reject('omitted reviewed body',()=>logical.assertNativeGroupBodies(missingRegistry,rows,bound));
  for(const status of ['known-entry-or-ownership','supplemental-reviewed-body','supported-logical-continuation','accepted-primary-before-reviewed-secondary']){const config=JSON.parse(fs.readFileSync(logical.CONFIG_PATH));config.bodies.find(b=>Number(b.romStart)===0x5EC4).evidence.status=status;const reg=logical.loadRegistry(context.model,rom,config);reject('wrong GLOBAL body status '+status,()=>logical.assertNativeGroupBodies(reg,rows,bound));}
  regReject('same-owner different-function HI/LO',g=>{const f=g.functions[7],next=g.functions[8];g.relocations=[{offset:f.offset,type:5,symbol:'external',symbolValue:0,symbolSection:'UND',word:0x3c020000},{offset:next.offset,type:6,symbol:'external',symbolValue:0,symbolSection:'UND',word:0x24420000}];},/native cross-function HI16\/LO16 pair/);
  regReject('native reference into owned tail',g=>{g.relocations=[{offset:0,type:4,symbol:g.functions[0].symbol,symbolValue:0,symbolSection:'.text',word:(0x0c000000|(g.tail.offset/4))>>>0}];});
  regReject('duplicate REL place',g=>g.relocations[1].offset=g.relocations[0].offset);regReject('native function blocks reordered with pairs intact',g=>{
   const blocks=g.functions.map(f=>g.relocations.filter(r=>r.offset>=f.offset&&r.offset<f.offset+f.bytes)).filter(b=>b.length);
   assert(blocks.length>1);g.relocations=blocks.reverse().flat();
  },/native relocation function interleaving/);
  regReject('same-owner function order with intact HI/LO pairs',g=>{
   const block=f=>[{offset:f.offset,type:5,symbol:'external',symbolValue:0,symbolSection:'UND',word:0x3c020000},
    {offset:f.offset+4,type:6,symbol:'external',symbolValue:0,symbolSection:'UND',word:0x24420000}];
   g.relocations=[...block(g.functions[8]),...block(g.functions[7])];
  },/native relocation function interleaving/);
  const hi=group.relocations.find(r=>r.type===5),lo=group.relocations.find(r=>r.type===6&&r.symbol===hi.symbol);assert(hi&&lo);
  regReject('missing HI',g=>g.relocations=g.relocations.filter(r=>r.type!==5||r.symbol!==lo.symbol));
  const clone=structuredClone(bound);clone.relocations.sort((a,b)=>a.offset-b.offset);if(JSON.stringify(clone.relocations)!==JSON.stringify(bound.relocations))reject('sorted native REL contract',()=>groups.validateObject(raw,clone,'raw'));
 }
 const output=path.join(dir,'compiled');fs.mkdirSync(output);const classifications=policy.classifyTargetSources(targets);
 for(const [i,target]of targets.entries()){const compiled=p8.compileTarget({...context,targets},target,output,local.compiler,tools.assemblerAbs,tools.objcopyAbs,{classification:classifications.targets[i]});assert.deepEqual(compiled,cache.inspectCompiledTargetArtifacts({phase8:context,target,classification:classifications.targets[i],files:cache.outputArtifactFiles(output,target)}));}
 const referencedSymbols=new Set(groups.relocations(raw).map(r=>r.symbol));
 const unresolved=raw.symbols.filter(s=>s.name&&s.sectionIndex===0&&referencedSymbols.has(s));for(const s of unresolved)assert(Object.hasOwn(symbols,s.name),'missing normal external binding '+s.name);
 const linkContext={...context,model,targets,linkSymbols:symbols};
 const linker=p8.renderPhase8LinkerScript(linkContext,{linkedObjects:[]});let caller=null,callerLinker=null;
 for(const record of bound.fixedBindings)assert.equal(linker.includes(record.symbol+' = '),record.kind==='fixed-address');
 if(real){const names=['func_00005B8C','func_00005C58','func_00005CFC','func_00005C60','func_00005D04'];
  for(const name of names)assert(bound.fixedBindings.some(b=>b.symbol===name&&b.kind==='fixed-address'));
  const callerDir=path.join(dir,'old-callers');fs.mkdirSync(callerDir);const file=path.join(callerDir,'caller.c');
  fs.writeFileSync(file,names.map(n=>'extern int '+n+'(void);').join('\n')+'\nint fixture_old_callers(void){return '+names.map(n=>n+'()').join('+')+';}\n');
  caller=compile(callerDir,file,'fixture_old_callers');fs.copyFileSync(path.join(callerDir,'native.o'),path.join(output,'old-callers.o'));
  callerLinker=linker.replace('  /DISCARD/ :','  .caller 0x80200000 : { old-callers.o(.text) }\n  .caller_bss 0 (NOLOAD) : { old-callers.o(.bss) }\n  /DISCARD/ :');
 }
 fs.writeFileSync(path.join(output,'fixture.ld'),linker);
 runTool(tools.toolsAbs.linker,['-T','fixture.ld','-Map','phase8.map','-o','phase8.elf',groups.objectPath(targets[0])],{cwd:output});const linked=p7.parseElfFile(path.join(output,'phase8.elf'));

 for(const r of rows)assert(p7.elfSectionBytes(linked,linked.sections.find(s=>s.name===r.slices[0].sectionName)).equals(rom.subarray(r.romStart,r.romEndExclusive)),'entire physical owner retail equality');
 for(const target of targets)groups.verifyFixedBindings(target,linked);
 const proofs=targets.map((target,i)=>p8.deriveSourceObjectProof(context,target,output,classifications.targets[i],linked,rom));for(const proof of proofs)p8.validateSourceObjectProofBytes(proof.proofBytes,proof.proofBytes);
 if(caller){fs.writeFileSync(path.join(output,'callers.ld'),callerLinker);
  runTool(tools.toolsAbs.linker,['-T','callers.ld','-o','callers.elf',groups.objectPath(targets[0]),'old-callers.o'],{cwd:output});
  const callerLinked=p7.parseElfFile(path.join(output,'callers.elf'));for(const target of targets)groups.verifyFixedBindings(target,callerLinked);
  const section=callerLinked.sections.find(s=>s.name==='.caller'),records=groups.relocations(caller.raw).filter(r=>r.owner.name==='.text'&&r.type===4);
  assert.equal(records.length,5);for(const r of records){const before=caller.raw.buffer.readUInt32BE(r.owner.offset+r.place),after=callerLinked.buffer.readUInt32BE(section.offset+r.place);
   assert.equal(after>>>26,before>>>26);assert.equal((after&0x03ffffff)*4,Number(symbols[r.symbol.name])&0x0fffffff);}
 }

 for(const change of [p=>p.objectEvidence.producerStages.raw.functions.pop(),p=>p.objectEvidence.producerStages.projected.functions.pop(),p=>p.linkEvidence.fixedBindings.pop(),p=>p.objectEvidence.schemaVersion=3,p=>p.objectEvidence.tail.offset+=4,p=>p.objectEvidence.producerStages.raw.completeCensus.symbols.pop(),p=>p.objectEvidence.producerStages.raw.completeCensus.header.flags^=1]){const proof=structuredClone(proofs.at(-1).proof);change(proof);const bytes=Buffer.from(JSON.stringify(proof));reject('self-compared stale/forged proof',()=>p8.validateSourceObjectProofBytes(bytes,bytes));}
 const nativeBinding=bound.fixedBindings.find(r=>r.kind==='native-global');assert(nativeBinding);for(const [name,change]of [['LOCAL',s=>s.binding=0],['wrong section',s=>s.sectionIndex=0xfff1],['wrong address',s=>s.value+=4]]){const copy=p7.parseElf32BigEndian(Buffer.from(linked.buffer));change(copy.symbols.find(s=>s.name===nativeBinding.symbol));reject('actual linked native binding '+name,()=>groups.verifyFixedBindings(targets[0],copy));}
 const duplicateLinked=p7.parseElf32BigEndian(Buffer.from(linked.buffer));duplicateLinked.symbols.push({...duplicateLinked.symbols.find(s=>s.name===nativeBinding.symbol),sectionIndex:0});reject('duplicate undefined/native alias name',()=>groups.verifyFixedBindings(targets[0],duplicateLinked));
 const forgedTarget=structuredClone(targets.at(-1));forgedTarget.compilationGroup.members.at(-1).functionSymbols.pop();reject('cache omitted member function',()=>cache.inspectCompiledTargetArtifacts({phase8:context,target:forgedTarget,classification:classifications.targets.at(-1),files:cache.outputArtifactFiles(output,targets.at(-1))}));
 const options={phase8:{...context,targets},compiler:local.compiler,verifiedCompiler,assembler:{bytes:fs.statSync(tools.assemblerAbs).size,sha256:p7.sha256File(tools.assemblerAbs)},objcopy:{bytes:fs.statSync(tools.objcopyAbs).size,sha256:p7.sha256File(tools.objcopyAbs)},assemblerPath:tools.assemblerAbs,objcopyPath:tools.objcopyAbs,preprocessor:classifications.preprocessor,cacheRoot:path.join(dir,'cache')};
 let key;for(const state of ['miss','hit']){const dest=path.join(dir,state);fs.mkdirSync(dest);const result=cache.compileOrReuseTarget({...options,target:targets[0],classification:classifications.targets[0],output:dest});assert.equal(result.cache.status,state);key=result.cache.key;}
 const metadataFile=path.join(cache.cacheEntryPath(options.cacheRoot,targets[0],key),'metadata.json'),metadata=JSON.parse(fs.readFileSync(metadataFile));const changed=structuredClone(metadata);changed.compiled.objectEvidence.schemaVersion=3;fs.writeFileSync(metadataFile,JSON.stringify(changed));reject('warm legacy schema',()=>cache.validateCacheEntry({...options,target:targets[0],classification:classifications.targets[0],keyMaterial:metadata.keyMaterial}));fs.writeFileSync(metadataFile,JSON.stringify(metadata));
 // The negative is independently compiled from a changed real return expression.
 const negativeDir=path.join(dir,'negative');fs.mkdirSync(negativeDir);let negativeFile;
 if(real){const fixtureDir=path.dirname(file);for(const name of fs.readdirSync(fixtureDir))fs.copyFileSync(path.join(fixtureDir,name),path.join(negativeDir,name));negativeFile=path.join(negativeDir,path.basename(file));
  let main=fs.readFileSync(negativeFile,'utf8');main=main.replace(/\.\.\/\.\.\/\.\.\/src\//g,path.relative(negativeDir,path.join(ROOT,'src')).replace(/\\/g,'/')+'/');fs.writeFileSync(negativeFile,main);
  const leaf=path.join(negativeDir,'checksum-chain-ready-five.c');let source=fs.readFileSync(leaf,'utf8');assert(source.includes('return (total + seed) & 0xFFFFU;'));source=source.replace('return (total + seed) & 0xFFFFU;','return (total + seed) & 0xFFFEU;');fs.writeFileSync(leaf,source);
 }else {negativeFile=path.join(negativeDir,'unrelated.c');fs.writeFileSync(negativeFile,fs.readFileSync(file,'utf8').replace('return 3','return 4'));}
 const negative=compile(negativeDir,negativeFile,functions[0].symbol);reject('genuinely compiled nonmatch',()=>groups.validateObject(negative.raw,bound,'raw'));
 results.push({real,rawSha256:hash(raw.buffer),sourceSha256:p7.sha256File(file),functions:group.functions,tail:group.tail,relocations:group.relocations.length,fixedBindings:bound.fixedBindings,rejected});
}
fixture(true);fixture(false);fs.writeFileSync(path.join(root,'report.json'),JSON.stringify({status:'pass',results},null,2));console.log(JSON.stringify({status:'pass',root,results},null,2));
