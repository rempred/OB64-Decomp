#!/usr/bin/env node
'use strict';
// Unrelated PURE_C fixture; no production activation or full-ROM operation.
const assert = require('assert/strict');
const fs = require('fs');
const path = require('path');
const p7 = require('../tools/lib/phase7_conventional');
const p8 = require('../tools/lib/phase8_matching_c');
const active = require('../tools/lib/active_targets');
const projection = require('../tools/lib/auxiliary_projection');
const policy = require('../tools/lib/source_policy');
const tc = require('../tools/lib/text_contract');
const cache = require('../tools/lib/diff_object_cache');
const { assertToolchainAvailable, loadToolchainConfig, runTool } = require('../tools/lib/real_mips_toolchain');
const { ROOT, hex, sha256Buffer: hash } = p7;
const phase8 = active.loadActiveTargetModel();
const local = JSON.parse(fs.readFileSync(path.join(ROOT, 'config/local-tools.json')));
const verifiedCompiler = p8.verifyCompiler(phase8, local.compiler);
const tools = assertToolchainAvailable(loadToolchainConfig());
function exercise(tableBase) {

fs.mkdirSync(path.join(ROOT, 'build/tests'), { recursive: true });
const root = fs.mkdtempSync(path.join(ROOT, 'build/tests/auxiliary-occurrence-'));
const file = path.join(root, 'fixture.c');
const source = 'extern int external_call(int);\nint projection_fixture(int x, int y) { int a;\n'
  + 'switch(x) { case 0:a=external_call(11);break; case 1:a=external_call(23);break; case 2:a=external_call(37);break; case 3:a=external_call(41);break; case 4:a=external_call(59);break; case 5:a=external_call(151);break; default:a=3; }\n'
  + 'switch(y) { case 0:a+=external_call(61);break; case 1:a+=external_call(73);break; case 2:a+=external_call(89);break; case 3:a+=external_call(97);break; case 4:a+=external_call(101);break; case 5:a+=external_call(113);break; case 6:a+=external_call(127);break; case 7:a+=external_call(137);break; default:a+=5; } return a; }\n';
fs.writeFileSync(file, source);
const relative = path.relative(ROOT, file).replace(/\\/g, '/');
const classification = policy.classifyTargetSources([{ symbol: 'projection_fixture', source: relative, bytes: 4 }]).targets[0];
assert.equal(classification.class, 'PURE_C');
fs.writeFileSync(path.join(root, 'input.c'), policy.compilationInputBytes(classification));
p7.run(local.compiler, [...phase8.config.compiler.compileFlags, '-o', path.join(root, 'compiler.s'), path.join(root, 'input.c')]);
policy.verifyClassificationInputs(classification);
const compiler = fs.readFileSync(path.join(root, 'compiler.s'));
const assembly = p8.adjustSectionAssembly(compiler, '.ob64.r0001', { allowAuxiliaryReadOnlySections: true });
fs.writeFileSync(path.join(root, 'raw.s'), assembly.toString().replace(/\.section\s+\.rodata/g, '.section .ob64.r0002,"a",@progbits'));
runTool(tools.assemblerAbs, [...tools.compilerAssemblerFlags, '-o', path.join(root, 'raw.o'), path.join(root, 'raw.s')]);
const raw = p7.parseElfFile(path.join(root, 'raw.o'));
const text = raw.sections.find(section => section.name === '.ob64.r0001');
const rodata = raw.sections.find(section => section.name === '.ob64.r0002');
const rawData = Buffer.from(p7.elfSectionBytes(raw, rodata));
const blocks = [...compiler.toString().matchAll(/\.section\s+\.rodata([^]*?)\s\.text/g)];
assert.equal(blocks.length, 2, 'unrelated source must emit two native tables');
let cursor = 0;
const segments = [];
for (const [index, block] of blocks.entries()) {
  const directives = [...block[1].matchAll(/\.align\s+(\d+)/g)].map(match => Number(match[1]));
  const aligned = Math.ceil(cursor / rodata.alignment) * rodata.alignment;
  if (aligned > cursor) segments.push({ kind: 'zero', offset: cursor, bytes: aligned - cursor,
    ownerSection: '.ob64.r' + String(index * 2 + 1).padStart(4, '0'), ownerOffset: 0, ownerBytes: aligned - cursor, expectedOwnerSha256: hash(Buffer.alloc(aligned - cursor)) });
  const bytes = [...block[1].matchAll(/\.word\s+\.L\d+/g)].length * 4;
  segments.push({ kind: 'payload', offset: aligned, bytes, outputSection: '.ob64.r' + String(index * 2 + 2).padStart(4, '0'),
    label: /(?:^|\n)(\.L\d+):/.exec(block[1])[1], alignmentDirectives: directives });
  cursor = aligned + bytes;
}
assert.equal(rodata.size,cursor); assert.deepEqual(segments.map(s=>s.bytes),[24,32]);
const gapBytes=Buffer.from('0102030405060708','hex'),tailBytes=Buffer.alloc(16,0xa5);
const retainedRows=[{offset:24,ownerSection:'.ob64.r0003',ownerBytes:8,expectedOwnerSha256:hash(gapBytes)}];
const contract = { schemaVersion: 6, mode: 'native-occurrence-readonly-projection', compilerSection: '.rodata',
  bytes: rodata.size, alignment: rodata.alignment, expectedObjectSha256: hash(rawData), segments, retainedRows };
const base = 0x80230000, tableRom = 0x1000;
fs.writeFileSync(path.join(root, 'native.ld'), 'SECTIONS { .ob64.r0001 ' + hex(base) + ' : { *(.ob64.r0001) }\n .ob64.r0002 '
  + hex(tableBase) + ' : { *(.ob64.r0002) } /DISCARD/ : { *(.reginfo) *(.pdr) *(.comment) *(.note) } }\nexternal_call = 0x80001234;\n');
runTool(tools.toolsAbs.linker, ['-T', path.join(root, 'native.ld'), '-o', path.join(root, 'native.elf'), path.join(root, 'raw.o')]);
const native = p7.parseElfFile(path.join(root, 'native.elf'));
const linkedText = Buffer.from(p7.elfSectionBytes(native, native.sections.find(section => section.name === '.ob64.r0001')));
// Independent link oracle: native table2 address plus exactly the retained row.
const nativeRefs=p8.rawRelocationRecords(raw).filter(r=>r.symbolSectionIndex===rodata.index&&["R_MIPS_HI16","R_MIPS_LO16"].includes(r.type));
let pending=[];
for(const r of nativeRefs){const place=parseInt(r.offset,16),word=raw.buffer.readUInt32BE(text.offset+place);
 if(r.type==='R_MIPS_HI16'){pending.push({place,immediate:word&65535});continue;}
 for(const h of pending){const addend=(((h.immediate<<16)+((word<<16)>>16))>>>0);if(addend<24)continue;
 const address=tableBase+addend+8;
 linkedText.writeUInt32BE(((linkedText.readUInt32BE(h.place)&0xffff0000)|((address+0x8000)>>>16))>>>0,h.place);
 linkedText.writeUInt32BE(((linkedText.readUInt32BE(place)&0xffff0000)|(address&65535))>>>0,place);
 }pending=[];
}
const linkedData = Buffer.from(p7.elfSectionBytes(native, native.sections.find(section => section.name === '.ob64.r0002')));
const auxContracts = segments.filter(segment => segment.kind === 'payload').map(segment => ({
  kind: 'switch-table', compilerSection: '.rodata', outputSection: segment.outputSection,
  sectionType: 'SHT_PROGBITS', sectionFlags: ['SHF_ALLOC'], alignment: rodata.alignment,
  romStart: hex(tableRom + segment.offset + (segment.offset ? 8 : 0)), romEndExclusive: hex(tableRom + segment.offset + (segment.offset ? 8 : 0) + segment.bytes),
  vramStart: hex(tableBase + segment.offset + (segment.offset ? 8 : 0)), vramEndExclusive: hex(tableBase + segment.offset + (segment.offset ? 8 : 0) + segment.bytes),
  bytes: segment.bytes, entries: (segment.offset === 0 ? 24 : 32) / 4,
  expectedObjectSha256: hash(rawData.subarray(segment.offset, segment.offset + segment.bytes)),
  expectedLinkedSha256: hash(linkedData.subarray(segment.offset, segment.offset + segment.bytes)), preservedTail: null,
  expectedRelocations: Array.from({ length: (segment.offset === 0 ? 24 : 32) / 4 }, (_, index) => ({ offset: hex(index * 4), type: 'R_MIPS_32',
    symbol: '.text', addend: hex(rawData.readUInt32BE(segment.offset + index * 4)), section: '.rel.rodata' })),
}));
const rom = Buffer.alloc(tableRom + rodata.size + 8 + tailBytes.length); linkedText.copy(rom); rawData.copy(rom,tableRom);
linkedData.subarray(0,24).copy(rom,tableRom);gapBytes.copy(rom,tableRom+24);linkedData.subarray(24).copy(rom,tableRom+32);tailBytes.copy(rom,tableRom+64);
const originalFile=path.join(root,'original.s');
fs.writeFileSync(originalFile,'.section .ob64.r0003,"a",@progbits\n.byte '+[...gapBytes].join(',')+'\n.section .ob64.r0004,"a",@progbits\n.byte '+[...Buffer.concat([linkedData.subarray(24),tailBytes])].join(',')+'\n');
const partFile=path.relative(ROOT,originalFile).replace(/\\/g,'/');
auxContracts[1].preservedTail={inputSection:'.ob64.r0004.tail',sectionType:'SHT_PROGBITS',sectionFlags:['SHF_ALLOC'],alignment:1,
 romStart:hex(tableRom+64),romEndExclusive:hex(tableRom+80),vramStart:hex(tableBase+64),vramEndExclusive:hex(tableBase+80),bytes:16,
 expectedSha256:hash(tailBytes),ownerOriginalAssembly:partFile,ownerOriginalAssemblySha256:p7.sha256File(originalFile)};
const normalized=active.normalizeAuxiliarySectionContracts(auxContracts,'projection_fixture','fixture',contract);
projection.normalize(contract,normalized);
function row(index, start, bytes, vram, executable) {
  return { index, primaryId: 'fixture:' + index, primaryClass: executable ? 'code' : 'data', inputKind: 'tracked-assembly',
    romStart: start, romEndExclusive: start + bytes, bytes,
    part: { file: partFile, sha256: p7.sha256File(originalFile), chunkIndex: 0, name: 'fixture_owner_' + index, symbolByteOffset: 0 },
    slices: [{ sectionName: '.ob64.r' + String(index).padStart(4, '0'), executable, bytes, romStart: start, romEndExclusive: start + bytes,
      vramStart: vram, vramEndExclusive: vram + bytes, placementKind: 'overlay', overlayDescriptorId: 99,
      overlaySection: executable ? 'text' : 'data-rodata', loadSlabId: null }] };
}
const model = { config: { rom: { bytes: rom.length }, expected: { nonDescriptorLoadSlabs: 0 }, nonDescriptorLoadSlabs: [] },
  nonDescriptorLoadSlabs: [], rows: [row(1,0,text.size,base,true),row(2,tableRom,24,tableBase,false),row(3,tableRom+24,8,tableBase+24,false),row(4,tableRom+32,48,tableBase+32,false)] };
model.rows[0].part.name = 'projection_fixture';
const owner = { ownerIndex: 0, sectionName: '.ob64.r0001', symbol: 'projection_fixture', rowIndex: 1, primaryId: 'fixture:1', chunkIndex: 0,
  logicalOffset: 0, logicalEnd: text.size, bytes: text.size, romStartNumber: 0, romEndNumber: text.size,
  vramStartNumber: base, vramEndNumber: base + text.size, expectedTextSha256: hash(linkedText),
  originalAssembly: partFile, originalAssemblySha256: p7.sha256File(originalFile), row: model.rows[0] };
const target = { symbol: 'projection_fixture', source: relative, sourceSha256: p7.sha256File(file), sectionName: '.ob64.r0001',
  bytes: text.size, romStartNumber: 0, romEndNumber: text.size, vramStartNumber: base, vramEndNumber: base + text.size,
  rowIndex: 1, primaryId: 'fixture:1', chunkIndex: 0, expectedTextSha256: hash(linkedText),
  originalAssembly: partFile, originalAssemblySha256: p7.sha256File(originalFile), model, row: model.rows[0], rows: [model.rows[0]],
  textOwners: [owner], compilerTextFunctions: [{ symbol: 'projection_fixture', offset: hex(0), offsetNumber: 0, bytes: text.size, binding: 'GLOBAL', entryEvidence: 'owner' }],
  auxiliarySections: [], auxiliaryProjection: contract, legacyAncillaryRelocations: [], relocationContractSource: 'canonical' };
target.auxiliarySections = active.resolveAuxiliarySectionContracts(model, rom, target, normalized);
target.auxiliaryProjectionRetained = projection.retainedBindings(target, model, rom);
active.validateAuxiliaryOwnerGroups([target], model);
const projected = projection.project(raw.buffer, target);
fs.writeFileSync(path.join(root, 'projected.o'), projected.buffer);
const projectedElf = p7.parseElf32BigEndian(projected.buffer);
target.expectedRelocations = p8.relocationRecords(projectedElf, target);
assert.deepEqual(tc.assemblerInput(compiler, target, p8.adjustSectionAssembly), fs.readFileSync(path.join(root, 'raw.s')));
assert(projected.evidence.references.some(reference => reference.addend === segments.find(segment => segment.outputSection === '.ob64.r0004').offset));
for (const auxiliary of target.auxiliarySections) p8.verifyAuxiliarySourceObjectSection(projectedElf, target, auxiliary, 'fixture');
const linkage = { schemaVersion: 4, profile: 'fixture', symbols: [], targets: [{ symbol: target.symbol,
  expectedRelocations: target.expectedRelocations, auxiliarySections: auxContracts, auxiliaryProjection: contract }] };
active.validateLinkageConfig(linkage, 'fixture');

assert.equal(projected.evidence.occurrence.anchors[0].value,8);
assert.equal(projected.evidence.nativeRelocations.length,14);
const before=Buffer.from(p7.elfSectionBytes(raw,text));
assert.deepEqual(p7.elfSectionBytes(projectedElf,projectedElf.sections.find(s=>s.name===text.name)),before);
assert(projected.evidence.references.some(r=>r.addend===24));
// Actual pinned linker, with all payloads and the nonzero retained gap/tail.
const gapFile=path.join(root,'gap.s');fs.writeFileSync(gapFile,'.section .ob64.r0003,"a",@progbits\n.byte '+[...gapBytes].join(',')+'\n.section .ob64.r0004.tail,"a",@progbits\n.byte '+[...tailBytes].join(',')+'\n');
runTool(tools.assemblerAbs,[...tools.compilerAssemblerFlags,'-o',path.join(root,'gap.o'),gapFile]);
const script='OUTPUT_ARCH(mips)\nSECTIONS { .ob64.r0001 '+hex(base)+' : AT(0) { *(.ob64.r0001) }\n.ob64.r0002 '+hex(tableBase)+' : AT(0x1000) { *(.ob64.r0002) }\n.ob64.r0003 '+hex(tableBase+24)+' : AT(0x1018) { *(.ob64.r0003) }\n.ob64.r0004 '+hex(tableBase+32)+' : AT(0x1020) { *(.ob64.r0004) *(.ob64.r0004.tail) }\n/DISCARD/ : { *(.reginfo) *(.pdr) *(.comment) *(.note) } }\nexternal_call = 0x80001234;\n';
fs.writeFileSync(path.join(root,'projected.ld'),script);
runTool(tools.toolsAbs.linker,['-T',path.join(root,'projected.ld'),'-o',path.join(root,'projected.elf'),path.join(root,'projected.o'),path.join(root,'gap.o')]);
const linked=p7.parseElfFile(path.join(root,'projected.elf')),linkedBytes=Buffer.from(p7.elfSectionBytes(linked,linked.sections.find(s=>s.name===text.name)));
for(const ref of projected.evidence.occurrence.pairs){const high=linkedBytes.readUInt32BE(ref.highPlace)&65535,low=(linkedBytes.readUInt32BE(ref.lowPlace)<<16)>>16;assert.equal(((high<<16)+low)>>>0,ref.effectiveAddress);}
assert(p7.elfSectionBytes(linked,linked.sections.find(s=>s.name==='.ob64.r0003')).equals(gapBytes));
assert(p7.elfSectionBytes(linked,linked.sections.find(s=>s.name==='.ob64.r0004')).subarray(32).equals(tailBytes));
// Canonical compiler caller under test-only overlay, not installed acceptance.
const output=path.join(root,'compiled');fs.mkdirSync(output);
const classified=policy.classifyTargetSources([target]).targets[0];
const compiled=p8.compileTarget(phase8,target,output,local.compiler,tools.assemblerAbs,tools.objcopyAbs,{classification:classified});
const files=cache.outputArtifactFiles(output,target);
assert.deepEqual(cache.inspectCompiledTargetArtifacts({phase8,target,classification:classified,files}),compiled);

const classifications=policy.classifyTargetSources([target]);
// Build fixture-only complete original-gap and retained-tail inputs at canonical paths.
fs.mkdirSync(path.join(output,'objects/assembly/auxiliary'),{recursive:true});
const gapOnly=path.join(root,'gap-only.s');fs.writeFileSync(gapOnly,'.section .ob64.r0003,"a",@progbits\n.byte '+[...gapBytes].join(',')+'\n');
runTool(tools.assemblerAbs,[...tools.compilerAssemblerFlags,'-o',path.join(output,'objects/assembly/chunk_000.o'),gapOnly]);
const tailName='objects/assembly/auxiliary/chunk_000_r0004_tail.o',tailBin='objects/assembly/auxiliary/chunk_000_r0004_tail.bin';
fs.writeFileSync(path.join(output,tailBin),tailBytes);fs.copyFileSync(path.join(output,'objects/assembly/chunk_000.o'),path.join(output,tailName));
runTool(tools.objcopyAbs,['--strip-all','--remove-section=.text','--remove-section=.data','--remove-section=.bss','--remove-section=.reginfo','--remove-section=.ob64.r0003',tailName],{cwd:output});
runTool(tools.objcopyAbs,['--add-section=.ob64.r0004.tail='+tailBin,'--set-section-flags=.ob64.r0004.tail=alloc,load,readonly,data,contents',tailName],{cwd:output});
p8.validateAuxiliaryTailObject(p7.parseElfFile(path.join(output,tailName)),target.auxiliarySections[1],tailBytes);
const aliases=target.auxiliarySections.map(a=>a.ownerSymbol+' = '+hex(a.ownerSymbolVram)+';').join('\n');
fs.writeFileSync(path.join(output,'fixture.ld'),script+aliases+'\n');
runTool(tools.toolsAbs.linker,['-T','fixture.ld','-Map','phase8.map','-o','phase8.elf','objects/c/projection_fixture.o','objects/assembly/chunk_000.o',tailName],{cwd:output});
const finalElf=p7.parseElfFile(path.join(output,'phase8.elf'));
assert(p7.elfSectionBytes(finalElf,finalElf.sections.find(s=>s.name===text.name)).equals(linkedText));
const proof=p8.deriveSourceObjectProof(phase8,target,output,classified,finalElf,rom);
p8.validateSourceObjectProofBytes(proof.proofBytes,proof.proofBytes);
assert.equal(proof.proof.objectEvidence.schemaVersion,17);
const context=tc.linkContext(output,rom,finalElf);
assert.equal(projection.linkedEvidence(target,output,context)[0].ownerBytes,8);
const accounting=require('../tools/lib/status_accounting').summarizeAcceptedOwnership(model,[target]);
assert.equal(accounting.assembly.bytes,24);assert.equal(accounting.replacements.bytes,text.size+56);

const rejected=[];function reject(name,fn){assert.throws(fn,undefined,name);rejected.push(name)}
function contractReject(name,mutate){const t=structuredClone(target);mutate(t);reject(name,()=>projection.project(raw.buffer,t))}
for(const [name,mutate] of [
 ['legacy mode',t=>{t.auxiliaryProjection.schemaVersion=1;t.auxiliaryProjection.mode='fixed-row-readonly-projection';delete t.auxiliaryProjection.retainedRows;}],
 ['missing retained row',t=>t.auxiliaryProjection.retainedRows=[]],
 ['wrong displacement',t=>t.auxiliarySections[1].vramStartNumber+=4],
 ['anchor outside first',t=>t.auxiliarySections[1].romStartNumber+=32],
 ['missing tail',t=>t.auxiliarySections[1].preservedTail=null],
 ['missing binding',t=>t.auxiliaryProjectionRetained=[]],
 ['group leakage',t=>t.compilationGroup={}],
 ['atomic leakage',t=>t.atomicText={}],
 ['retained text padding leakage',t=>t.rows[0].retainedPadding={}],
 ['wrong payload count',t=>t.auxiliaryProjection.segments.pop()],
 ['extra row',t=>t.auxiliaryProjection.retainedRows.push({...t.auxiliaryProjection.retainedRows[0],offset:80})],
 ['native padding',t=>t.auxiliaryProjection.segments[1].kind='zero']])contractReject(name,mutate);
const tr=raw.sections.find(s=>s.name==='.rel'+text.name),rr=raw.sections.find(s=>s.name==='.rel'+rodata.name);
function rawReject(name,mutate){const b=Buffer.from(raw.buffer);mutate(b);reject(name,()=>projection.project(b,target));}
const pair=projected.evidence.references.find(r=>r.addend===24);
rawReject('unaligned destination',b=>b.writeUInt32BE(0x8c220019,text.offset+pair.lowPlace));
rawReject('outside destination',b=>b.writeUInt32BE(0x8c220038,text.offset+pair.lowPlace));
const relpos=Array.from({length:tr.size/8},(_,i)=>tr.offset+i*8).find(o=>raw.buffer.readUInt32BE(o)===pair.highPlace);
rawReject('unpaired low',b=>b.writeUInt32BE((b.readUInt32BE(relpos+4)&~255)|6,relpos+4));
rawReject('missing R32',b=>b.writeUInt32BE(4,rr.offset));
rawReject('wrong R32 type',b=>b.writeUInt32BE((b.readUInt32BE(rr.offset+4)&~255)|4,rr.offset+4));
const corrupt=Buffer.from(rom);corrupt[tableRom+24]^=1;reject('retained bytes changed',()=>projection.retainedBindings(target,model,corrupt));
reject('dual owner',()=>projection.validateCensus([target,{auxiliarySections:[{outputSection:'.ob64.r0003'}]}]));

function proofReject(name,mutate){const value=structuredClone(proof.proof);mutate(value);const b=Buffer.from(JSON.stringify(value));reject(name,()=>p8.validateSourceObjectProofBytes(b,b));}
proofReject('stale occurrence schema',p=>p.objectEvidence.schemaVersion=4);
proofReject('forged index mapping',p=>p.objectEvidence.auxiliaryProjection.occurrence.symbolMap[0].newIndex=1);
proofReject('forged pair attribution',p=>p.objectEvidence.auxiliaryProjection.occurrence.pairs[0].anchorDelta=4);
proofReject('missing occurrence proof',p=>delete p.objectEvidence.auxiliaryProjection.occurrence);
for(const [field,value] of [['value',9],['symbolType',0],['binding',1],['size',4],['visibility',2]]) {
 const copy=structuredClone(projectedElf);copy.symbols.find(s=>s.name.startsWith('__ob64_readonly_anchor_'))[field]=value;
 reject('derived anchor '+field,()=>projection.validateOccurrenceObject(copy,target));
}
const cached={phase8:{...phase8,targets:[target]},target,classification:classified,compiler:local.compiler,verifiedCompiler,
 assembler:{bytes:fs.statSync(tools.assemblerAbs).size,sha256:p7.sha256File(tools.assemblerAbs)},objcopy:{bytes:fs.statSync(tools.objcopyAbs).size,sha256:p7.sha256File(tools.objcopyAbs)},
 assemblerPath:tools.assemblerAbs,objcopyPath:tools.objcopyAbs,preprocessor:classifications.preprocessor,cacheRoot:path.join(root,'cache')};
let cacheKey;
for(const status of ['miss','hit']){const out=path.join(root,'cache-'+status);fs.mkdirSync(out);const result=cache.compileOrReuseTarget({...cached,output:out});assert.equal(result.cache.status,status);cacheKey=result.cache.key;}
const metadataFile=path.join(cache.cacheEntryPath(cached.cacheRoot,target,cacheKey),'metadata.json'),metadata=JSON.parse(fs.readFileSync(metadataFile));
for(const field of ['anchors','symbolMap','pairs']){const bad=structuredClone(metadata);delete bad.compiled.objectEvidence.auxiliaryProjection.occurrence[field];fs.writeFileSync(metadataFile,JSON.stringify(bad));reject('cached occurrence '+field,()=>cache.validateCacheEntry({...cached,keyMaterial:metadata.keyMaterial}));}fs.writeFileSync(metadataFile,JSON.stringify(metadata));
const retainedLine=context.mapText.split(/\r?\n/).find(l=>l.trim().startsWith('.ob64.r0003 ')&&l.includes('objects/assembly/'));
assert(retainedLine);reject('duplicated retained map',()=>projection.linkedEvidence(target,output,{...context,mapText:context.mapText.replace(retainedLine,retainedLine+'\n'+retainedLine)}));
tc.finishLinkContext(context);
const saved=fs.readFileSync(files['source-object.o']);
try {const bad=Buffer.from(saved),elf=p7.parseElf32BigEndian(bad),anchor=elf.symbols.find(s=>s.name.startsWith('__ob64_readonly_anchor_')),st=elf.sections.find(s=>s.type===2);bad.writeUInt32BE(12,st.offset+anchor.symbolIndex*16+4);fs.writeFileSync(files['source-object.o'],bad);
reject('on-disk projected symbol tamper',()=>cache.inspectCompiledTargetArtifacts({phase8,target,classification:classified,files}));}finally{fs.writeFileSync(files['source-object.o'],saved);}


// A real source change must remain nonexact after the identical representation.
const nonmatch=path.join(root,'nonmatch');fs.mkdirSync(nonmatch);
try {
 fs.writeFileSync(file,source.replace('external_call(11)','external_call(12)'));
 const changed={...target,sourceSha256:p7.sha256File(file)},changedClass=policy.classifyTargetSources([changed]).targets[0];assert.equal(changedClass.class,'PURE_C');
 p8.compileTarget(phase8,changed,nonmatch,local.compiler,tools.assemblerAbs,tools.objcopyAbs,{classification:changedClass});
 fs.writeFileSync(path.join(nonmatch,'fixture.ld'),script+aliases+'\n');
 runTool(tools.toolsAbs.linker,['-T',path.join(nonmatch,'fixture.ld'),'-o',path.join(nonmatch,'phase8.elf'),path.join(nonmatch,'objects/c/projection_fixture.o'),path.join(output,'objects/assembly/chunk_000.o'),path.join(output,tailName)]);
 assert.equal(p8.compareLinkedTargetBytes(changed,p7.parseElfFile(path.join(nonmatch,'phase8.elf')),rom).rawBytesExact,false);
}finally{fs.writeFileSync(file,source);}

console.log(JSON.stringify({status:'pass',mode:'staged-overlay-native',tableBase:hex(tableBase),root:path.relative(ROOT,root),rejected}));
}
exercise(0x80240000);exercise(0x80247ff0);

