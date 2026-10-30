'use strict';
const assert = require('assert/strict');
const fs = require('fs'), path = require('path');
const tail = require('../tools/lib/matching/terminal_tail');
const words = values => { const b = Buffer.alloc(values.length * 4); values.forEach((w,i)=>b.writeUInt32BE(w>>>0,i*4)); return b; };
const body = words([0x24020001, 0x03E00008, 0]);
const rejects = (fn, pattern) => assert.throws(fn, pattern);

function entryIdentityTests(dir) {
  const p7 = require('../tools/lib/phase7_conventional');
  const inputs = require('../tools/lib/matching/input_set');
  const asm = require('../tools/lib/word_asm');
  let serial=0, checks=0;
  const registry={schemaVersion:1,profile:'test',bodies:[],padding:[],unavailableBodies:[],preservedProductionEnvelopes:[]};
  const fixture = (address=0xABC, name='func_00000AbC', originalWords=[0x24020001,0x03E00008,0,0]) => {
    const base=path.join(dir,'entry-'+serial++); fs.mkdirSync(base);
    const symbol='func_'+address.toString(16).padStart(8,'0');
    const source='.set noat\n.set noreorder\n.text\n'+name+':\n'+originalWords.map(w=>'.word 0x'+w.toString(16).padStart(8,'0')).join('\n')+'\n';
    const file=path.join(base,'original.s'), romFile=path.join(base,'rom.bin'), configFile=path.join(base,'registry.json');
    fs.writeFileSync(file,source); fs.writeFileSync(configFile,JSON.stringify(registry));
    const original=words(originalWords), rom=Buffer.alloc(address+original.length); original.copy(rom,address);fs.writeFileSync(romFile,rom);
    const row={index:0,romStart:address,romEndExclusive:address+original.length,bytes:original.length,primaryClass:'code',processorClass:'cpu',ambiguous:false,
      part:{name:symbol,file:path.relative(p7.ROOT,file),symbolByteOffset:0,textBytes:Buffer.byteLength(source),sha256:p7.sha256Buffer(Buffer.from(source))},
      slices:[{executable:true,placementKind:'overlay',overlayDescriptorId:1,executableRangeId:null,nonExecutableRangeId:null,vramStart:0x80000000,vramEndExclusive:0x80000000+original.length}]};
    const model={config:{profile:'test',rom:{bytes:rom.length,sha256:p7.sha256Buffer(rom),codeRegionStart:address,codeRegionEndExclusive:rom.length,codeRegionSha256:p7.sha256Buffer(original)}},rows:[row]};
    const session={context:{phase8:{model,targets:[],compilationGroups:[],linkSymbols:{}},baserom:{path:romFile}}};
    const reads=[]; const replacements=new Map();
    const selected={resolve(file){ reads.push(file);return replacements.get(file) || (file===path.join(p7.ROOT,'config/logical-functions.json') ? configFile:file); }};
    inputs.bind(session.context,selected);inputs.bind(model,selected);
    const target={symbol};
    const rewrite = value => {fs.writeFileSync(file,value);row.part.sha256=p7.sha256Buffer(Buffer.from(value));row.part.textBytes=Buffer.byteLength(value);};
    const check=()=>tail.originalOwner(session,target,original.length-4);
    const other=(name='unrelated',source='unrelated:\n.word 0x00000000\n')=>{
      const file2=path.join(base,'other-'+model.rows.length+'.s');fs.writeFileSync(file2,source);
      const value={index:model.rows.length,romStart:address+0x100,romEndExclusive:address+0x104,part:{name,file:path.relative(p7.ROOT,file2),textBytes:Buffer.byteLength(source),sha256:p7.sha256Buffer(Buffer.from(source))},slices:[{vramStart:0x80000000,overlayDescriptorId:2}]};
      model.rows.push(value);return {row:value,file:file2};
    };
    return {base,source,file,row,model,session,target,rom,romFile,check,rewrite,other,reads,replacements};
  };
  const pass=f=>{assert.equal(f.check().row,f.row);checks++;};
  const no=(f,pattern)=>{rejects(f.check,pattern);checks++;};
  pass(fixture());pass(fixture(0xDEF,'func_00000DEF'));
  const staged=fixture();staged.session.context.phase8.targets=[{symbol:staged.target.symbol,romStartNumber:staged.row.romStart,romEndNumber:staged.row.romEndExclusive,compilerTextFunctions:[{symbol:staged.target.symbol}]}];pass(staged);
  const exact=fixture(0xABC,'func_00000abc');const neverRead=exact.other();fs.unlinkSync(neverRead.file);pass(exact);assert(!exact.reads.includes(neverRead.file));
  for(const bad of ['FUNC_00000ABC','func_00000ABD','arbitrary','func_000000ABC']) { const f=fixture(0xABC,bad);no(f,/original entry/); }
  for(const change of [s=>s.replace('func_00000AbC:', 'func_00000AbC:\nfunc_00000AbC:'),s=>s+'other:\n',s=>s+'1:\n',s=>s+'.Llocal:\n',
    s=>s.replace('func_00000AbC:', 'func_00000AbC:\n.globl other'),s=>s.replace('.text','.text\n.byte 0'),s=>s+'.space 0\n',s=>s+'.include "x"\n',
    s=>s+'.macro x\n.endm\n',s=>s+'alias = 0\n',s=>s.replace('.word 0x24020001',' .word external'),s=>s+'/* unterminated',s=>s+'*/',
    s=>s.replace('func_00000AbC:\n.word 0x24020001','.word 0x24020001\nfunc_00000AbC:'),s=>s.replace('func_00000AbC:', 'func_00000AbC: .word 0x0'),
    s=>s+'.text\n',s=>s.replace('.text','.text\n.globl func_00000AbC\n.globl func_00000AbC')]) {const f=fixture();f.rewrite(change(f.source));no(f,/original entry|complete original word/);}
  const comment=fixture();comment.rewrite(comment.source.replace('.text','/* ignored: fake label\nother: */\n.text\n.globl func_00000AbC'));pass(comment);
  const owner=fixture();owner.other('func_00000ABC');no(owner,/owner collision/);
  const sameRom=fixture();sameRom.other().row.romStart=sameRom.row.romStart;no(sameRom,/owner collision/);
  for(const source of ['func_00000ABC:\n.word 0\n','.word 0; func_00000ABC:\n','.globl func_00000ABC\n','.globl unrelated,func_00000ABC\n','unrelated:func_00000ABC:\n','.set alias,func_00000ABC\n']) {const f=fixture();f.other('other',source);no(f,/source collision/);}
  const drift=fixture();const changed=drift.other();fs.appendFileSync(changed.file,'# drift');no(drift,/source drift/);
  for(const producer of [{symbol:'func_00000ABC'},{symbol:'other',compilerTextFunctions:[{symbol:'func_00000ABC'}]}]) {const f=fixture();f.session.context.phase8.targets=[{...producer,romStartNumber:0x3000,romEndNumber:0x3010}];no(f,/producer collision/);}
  const group=fixture();group.session.context.phase8.compilationGroups=[{fixedBindings:[{symbol:'func_00000ABC'}]}];no(group,/group collision/);
  const duplicate=fixture();duplicate.session.context.phase8.targets=[0,1].map(()=>({symbol:duplicate.target.symbol,romStartNumber:duplicate.row.romStart,romEndNumber:duplicate.row.romEndExclusive}));no(duplicate,/duplicate provider/);
  for (const mutate of [f=>{f.row.retainedPadding={};},f=>{f.row.slices.push({...f.row.slices[0]});},f=>{f.row.part.symbolByteOffset=4;},f=>{f.row.ambiguous=true;},f=>{f.row.slices[0].executable=false;}]) {const f=fixture();mutate(f);no(f,/physical owner/);}
  const producerMode=fixture();producerMode.session.context.phase8.targets=[{symbol:producerMode.target.symbol,romStartNumber:producerMode.row.romStart,romEndNumber:producerMode.row.romEndExclusive,atomicText:{}}];no(producerMode,/unsupported producer/);
  const extent=fixture();rejects(()=>tail.originalOwner(extent.session,extent.target,16),/4, 8 or 12/);checks++;
  const wrongSha=fixture();fs.appendFileSync(wrongSha.file,'# changed');no(wrongSha,/assembly identity drift/);
  const changedRom=fixture();changedRom.rom[0]^=1;fs.writeFileSync(changedRom.romFile,changedRom.rom);no(changedRom,/ROM SHA/);
  const changedWord=fixture();changedWord.rewrite(changedWord.source.replace('0x24020001','0x24020002'));no(changedWord,/differs from ROM/);
  const short=fixture();short.rewrite(short.source.replace('.word 0x24020001\n',''));no(short,/word census/);
  const suffix=fixture(0xABC,'func_00000AbC',[0x24020001,0x03E00008,0,1]);no(suffix,/nonzero original suffix/);
  const returnBad=fixture(0xABC,'func_00000AbC',[0x24020001,0,0,0]);no(returnBad,/complete return/);
  const extraBody=fixture(0xABC,'func_00000AbC',[0x03E00008,0,0x24020001,0x03E00008,0,0]);no(extraBody,/uncovered/);
  const selected=fixture();const record=selected.other();const selectedFile=path.join(selected.base,'selected.s');fs.copyFileSync(record.file,selectedFile);selected.replacements.set(record.file,selectedFile);fs.writeFileSync(record.file,'func_00000ABC:\n');pass(selected);
  const selectedBad=fixture();const recordBad=selectedBad.other('other','func_00000ABC:\n');const badFile=path.join(selectedBad.base,'selected.s');fs.copyFileSync(recordBad.file,badFile);selectedBad.replacements.set(recordBad.file,badFile);fs.writeFileSync(recordBad.file,'unrelated:\n');no(selectedBad,/source collision/);
  const selectedOwner=fixture();const saved=path.join(selectedOwner.base,'selected-owner.s');fs.copyFileSync(selectedOwner.file,saved);selectedOwner.replacements.set(selectedOwner.file,saved);fs.writeFileSync(selectedOwner.file,'wrong:\n');pass(selectedOwner);
  // Static real-source case exercises all originalOwner checks with the original
  // bytes in a synthetic ROM. It is not a baserom/native/linked acceptance test.
  const source=fs.readFileSync(path.join(p7.ROOT,'asm/original/rev0/lib/func_00276e48.s'),'utf8');
  assert.equal(p7.sha256Buffer(Buffer.from(source)),'E52D0EE3A9BDBC14540AC337E081BD9053ED0BB3F729DBAC1CF6BF8A38C7AE78');
  const original=asm.assembleWordAsmText(source).bytes;
  assert.equal(original.length,408);assert.equal(p7.sha256Buffer(original),'E8A2866051451CFB27F3B36547CE83F233268BF1FD3ED9DD754CE1013890028E');
  const real=fixture(0x276E48,'func_00276E48',Array.from({length:102},(_,i)=>original.readUInt32BE(i*4)));real.rewrite(source);real.row.slices[0].vramStart=0x802226B8;real.row.slices[0].vramEndExclusive=0x80222850;real.row.slices[0].overlayDescriptorId=13;
  // Include the existing authenticated original manifest census, not directory
  // discovery; each other source SHA is checked by the fallback itself.
  const manifest=JSON.parse(fs.readFileSync(path.join(p7.ROOT,'asm/original/rev0/manifest.json'),'utf8'));
  const parts=manifest.chunks.flatMap(chunk=>chunk.parts);
  for (const part of parts.filter(part=>part.file!=='asm/original/rev0/lib/func_00276e48.s')) {
    real.model.rows.push({index:real.model.rows.length,romStart:Number(part.romStart),romEndExclusive:Number(part.romEndExclusive),part});
  }
  assert.equal(tail.originalOwner(real.session,real.target,400).tailBytes,8);checks++;
  return {checks,p04Static:'pass',selectedInputs:'pass',exactPathNoScan:'pass'};
}


function localControlTests() {
  const p7=require('../tools/lib/phase7_conventional'),p8=require('../tools/lib/phase8_matching_c');
  let checks=0;
  const build=(values=[0x08000002,0,0x03E00008,0],sites=[{offset:0,type:4,symbol:1}],options={})=>{
    const native=options.native===true,start=options.start===undefined?0x81234000:options.start;
    const name=native?'.text':'.ob64.r9999',symbol='genericLocalJump',tailBytes=options.tail||0;
    const payload=Buffer.concat([words(values),Buffer.alloc(tailBytes)]);
    const sections=[{name:'',type:0,data:Buffer.alloc(0)},{name, type:1,flags:6,alignment:4,data:payload}];
    if(options.shift)sections.splice(1,0,{name:'.unused',type:1,data:Buffer.alloc(0)});
    const ti=sections.findIndex(s=>s.name===name),ri=sections.length,si=ri+1,sti=ri+2,shi=ri+3;
    const strings=Buffer.from('\0gcc2_compiled.\0genericLocalJump\0external\0named\0');
    const sym=Buffer.alloc(5*16);const put=(i,n,value,size,binding,type,section)=>{const o=i*16;sym.writeUInt32BE(n?strings.indexOf(n):0,o);sym.writeUInt32BE(value,o+4);sym.writeUInt32BE(size,o+8);sym[o+12]=(binding<<4)|type;sym.writeUInt16BE(section,o+14);};
    put(1,'',0,0,0,3,ti);put(2,'gcc2_compiled.',0,0,0,1,ti);put(3,symbol,0,values.length*4,1,2,ti);put(4,'external',0,0,1,0,0);
    const rel=Buffer.alloc(sites.length*8);sites.forEach((r,i)=>{rel.writeUInt32BE(r.offset,i*8);rel.writeUInt32BE((r.symbol<<8)|r.type,i*8+4);});
    sections.push({name:'.rel'+name,type:9,link:si,info:ti,alignment:4,entrySize:8,data:rel},{name:'.symtab',type:2,link:sti,info:3,alignment:4,entrySize:16,data:sym},{name:'.strtab',type:3,data:strings},{name:'.shstrtab',type:3,data:null});
    const names=Buffer.from('\0'+sections.slice(1).map(s=>s.name).join('\0')+'\0');sections[shi].data=names;
    let length=52+sections.length*40;for(const s of sections){s.offset=length;length+=s.data.length;}
    const buffer=Buffer.alloc(length);buffer.writeUInt32BE(0x7F454C46);buffer[4]=1;buffer[5]=2;buffer[6]=1;buffer.writeUInt16BE(1,16);buffer.writeUInt16BE(8,18);buffer.writeUInt32BE(1,20);buffer.writeUInt32BE(52,32);buffer.writeUInt16BE(52,40);buffer.writeUInt16BE(40,46);buffer.writeUInt16BE(sections.length,48);buffer.writeUInt16BE(shi,50);
    sections.forEach((s,i)=>{const at=52+i*40;[s.name?names.indexOf(s.name):0,s.type,s.flags||0,0,s.offset,s.data.length,s.link||0,s.info||0,s.alignment||1,s.entrySize||0].forEach((v,j)=>buffer.writeUInt32BE(v,at+j*4));s.data.copy(buffer,s.offset);});
    const original=words(values);sites.filter(r=>r.type===4&&(values[r.offset/4]>>>26)===2).forEach(r=>{const off=(values[r.offset/4]&0x3ffffff)*4;original.writeUInt32BE((0x08000000|(((start+off)>>>2)&0x3ffffff))>>>0,r.offset);});
    const object={buffer,sectionName:name,symbol,original,assigned:!native};
    const normalized=()=>p8.relocationRecords(p7.parseElf32BigEndian(buffer),{symbol,bytes:values.length*4,sectionName:name});
    const run=(relocations=normalized(),obj=object)=>tail.coverage(p7.elfSectionBytes(p7.parseElf32BigEndian(buffer),p7.parseElf32BigEndian(buffer).sections[ti]).subarray(0,values.length*4),start,relocations,values.length*4+8,obj);
    return {buffer,object,normalized,run,sections,ti,ri,si,sti,start,values,wordOffset:o=>sections[ti].offset+o,relOffset:o=>sections[ri].offset+o,symOffset:i=>sections[si].offset+i*16,headerOffset:i=>52+i*40};
  };
  const pass=f=>{const result=f.run();checks++;return result;};
  const no=(f,pattern=/local jump|relocated|control|delay|uncovered|aligned|ELF|census|symbol|body|native|label/)=>{rejects(()=>f.run(),pattern);checks++;};
  const first=build(),proof=pass(first);assert.equal(proof[0].targetOffset,8);
  const native=build(undefined,undefined,{native:true,shift:true,start:0x81234000});assert.deepEqual(pass(native),proof);
  const multiWords=[0x10800003,0,0x08000006,0,0x08000008,0,0x24020001,0,0x03E00008,0],multiSites=[{offset:8,type:4,symbol:1},{offset:16,type:4,symbol:1}];
  const multi=build(multiWords,multiSites,{start:0x92345000});assert.deepEqual(pass(multi).map(r=>r.targetOffset),[24,32]);
  const nativeMulti=build(multiWords,multiSites,{native:true,shift:true,start:0x92345000,tail:8});assert.deepEqual(pass(nativeMulti),multi.run());
  pass(build([0x0C000100,0,0x03E00008,0],[{offset:0,type:4,symbol:4}]));
  pass(build([0x0C000100,0,0x03E00008,0],[{offset:0,type:4,symbol:4}],{native:true}));
  rejects(()=>first.run(first.normalized(),null),/relocated noncall/);checks++;
  rejects(()=>first.run(first.normalized(),{...first.object,edges:proof}),/object evidence/);checks++;
  rejects(()=>first.run([],first.object),/relocation list disagreement/);checks++;
  rejects(()=>first.run([...first.normalized(),...first.normalized()],first.object),/relocation list disagreement/);checks++;
  // Per-site destinations must agree, not just the set of targets.
  const permutation=build(multiWords,multiSites,{start:0x92345000});const a=permutation.object.original.readUInt32BE(8),b=permutation.object.original.readUInt32BE(16);permutation.object.original.writeUInt32BE(b,8);permutation.object.original.writeUInt32BE(a,16);no(permutation,/destination disagreement/);
  const permNative=build(multiWords,multiSites,{native:true,start:0x92345000});permNative.buffer.writeUInt32BE(multiWords[4],permNative.wordOffset(8));permNative.buffer.writeUInt32BE(multiWords[2],permNative.wordOffset(16));no(permNative,/destination disagreement/);
  for(const mutate of [f=>f.buffer.writeUInt32BE(f.sections[f.sti].data.indexOf('named'),f.symOffset(1)),f=>f.buffer[f.symOffset(1)+12]=0x13,f=>f.buffer[f.symOffset(1)+12]=0x23,f=>f.buffer[f.symOffset(1)+12]=0,
    f=>f.buffer.writeUInt32BE(4,f.symOffset(1)+4),f=>f.buffer.writeUInt32BE(4,f.symOffset(1)+8),f=>f.buffer[f.symOffset(1)+13]=1,f=>f.buffer.writeUInt16BE(0,f.symOffset(1)+14),f=>f.buffer.writeUInt16BE(0xfff1,f.symOffset(1)+14),f=>f.buffer.writeUInt16BE(f.sti,f.symOffset(1)+14)]) {const f=build();mutate(f);no(f);}
  // R2: empty parsed names are insufficient. Both out-of-table offsets and
  // an in-table terminating NUL must fail the raw canonical st_name==0 rule.
  for (const native of [false,true]) for (const value of [0xFFFFFFFF,0x10000,43]) {
    const f=build(undefined,undefined,{native});
    const nameOffset=value===43?f.sections[f.sti].data.length-1:value;
    const before=f.normalized();f.buffer.writeUInt32BE(nameOffset,f.symOffset(1));
    assert.deepEqual(f.normalized(),before);no(f,/raw symbol name\/bounds authority/);
  }
  // A GLOBAL function normalizes to .text just like the true section symbol.
  const functionNative=build(undefined,undefined,{native:true});const before=functionNative.normalized();functionNative.buffer.writeUInt32BE((3<<8)|4,functionNative.relOffset(4));assert.deepEqual(functionNative.normalized(),before);no(functionNative,/raw symbol name\/bounds authority/);
  const foreignNative=build(undefined,undefined,{native:true});const normalForeign=foreignNative.normalized();
  const nameOffset=foreignNative.sections[foreignNative.sti].data.indexOf('external');
  foreignNative.buffer.write('.text\0',foreignNative.sections[foreignNative.sti].offset+nameOffset,'ascii');
  foreignNative.buffer.writeUInt32BE(nameOffset,foreignNative.symOffset(1));foreignNative.buffer.writeUInt16BE(foreignNative.sti,foreignNative.symOffset(1)+14);
  assert.deepEqual(foreignNative.normalized(),normalForeign);no(foreignNative,/label|raw symbol name\/bounds authority/);
  no(build(undefined,[]),/control escapes/);no(build(undefined,[],{native:true}),/control escapes/);
  for(const mutate of [f=>f.buffer.writeUInt32BE(0,f.headerOffset(f.ri)+28),f=>f.buffer.writeUInt32BE(f.sti,f.headerOffset(f.ri)+24),f=>f.buffer.writeUInt32BE(4,f.headerOffset(f.ri)+4),
    f=>f.buffer.writeUInt32BE(4,f.headerOffset(f.ri)+36),f=>f.buffer.writeUInt32BE(7,f.headerOffset(f.ri)+20),f=>f.buffer.writeUInt32BE(2,f.headerOffset(f.ri)+8),f=>f.buffer.writeUInt32BE(1,f.headerOffset(f.ri)+12),
    f=>f.buffer.writeUInt32BE(8,f.headerOffset(f.ri)+32),f=>f.buffer.writeUInt32BE(0xffffff04,f.relOffset(4)),f=>f.buffer.writeUInt32BE(2,f.relOffset(0)),f=>f.buffer.writeUInt32BE(16,f.relOffset(0))]) {const f=build();mutate(f);no(f);}
  no(build(undefined,[{offset:0,type:4,symbol:1},{offset:0,type:4,symbol:1}]),/duplicate/);
  no(build(undefined,[{offset:0,type:4,symbol:1},{offset:0,type:5,symbol:1}]),/duplicate/);
  for(const type of [2,5,6])no(build(undefined,[{offset:0,type,symbol:1}]),/noncall identity/);
  const badOriginal=build();badOriginal.object.original.writeUInt32BE(0x0C48D002,0);no(badOriginal,/destination disagreement/);
  for(const target of [4,12,16,20,0x1000]) {const f=build([0x08000000|(target/4),0,0x03e00008,0]);no(f);}
  no(build(undefined,undefined,{start:0x8FFFFFF8}),/object\/body|destination/);
  no(build(undefined,undefined,{start:0xFFFFFFF8}),/object\/body/);
  no(build([0x08000000,0,0x03E00008,0]),/uncovered/);
  no(build([0x08000002,0x03E00008,0x03E00008,0]),/delay/);
  no(build([0x08000002,0,0x03E00008,0x08000002]),/delay/);
  // Missing and extra raw proof sites cannot be supplied by normalized metadata.
  const missing=build(multiWords,multiSites);const recorded=missing.normalized();missing.buffer.writeUInt32BE(8,missing.headerOffset(missing.ri)+20);rejects(()=>missing.run(recorded),/relocation list disagreement/);checks++;
  const extra=build([0x08000003,0,0x08000003,0,0x03E00008,0],[{offset:0,type:4,symbol:1},{offset:8,type:4,symbol:1}]);rejects(()=>extra.run(extra.normalized().slice(0,1)),/relocation list disagreement/);checks++;
  for(const [word,type] of [[0x0C000002,4],[0x3C020000,5],[0x24420008,6],[0x8C420000,2]]) {const f=build([word,0,0x03E00008,0],[{offset:0,type,symbol:1}],{native:true});no(f,/unproven local/);}
  // A proved local J must not authorize even one additional defined reference.
  for (const [word,type] of [[0x3C020000,5],[0x24420008,6],[0x8C420000,2]]) {
    no(build([0x08000002,0,word,0x03E00008,0],[{offset:0,type:4,symbol:1},{offset:8,type,symbol:1}],{native:true}),/unproven local/);
  }
  no(build([0x08000002,0,0x0C000000,0,0x03E00008,0],[{offset:0,type:4,symbol:1},{offset:8,type:4,symbol:1}],{native:true}),/unproven local/);
  const ownerEnd=build();ownerEnd.object.original.writeUInt32BE(0x0848D004,0);no(ownerEnd,/destination disagreement/);
  const sectionBytes=build();sectionBytes.buffer.writeUInt32BE(0x24020000,sectionBytes.wordOffset(8));no(sectionBytes,/complete return/);
  // A native instruction/REL drift remains distinct from display-name equality.
  const nativeMismatch=build(undefined,undefined,{native:true});nativeMismatch.object.original.writeUInt32BE(0x0848D003,0);no(nativeMismatch,/destination disagreement/);
  const rawData=build(undefined,undefined,{native:true});rawData.buffer.writeUInt16BE(rawData.sti,rawData.symOffset(1)+14);no(rawData);
  // Saved live artifact: assigned proof/coverage only, never fabricated native evidence.
  const saved='build/matching/p04-qual/runs/C58DAA532516E6B060DD3E91B770516029B071A98534337497D1E8406E059A5E/candidate.o';
  const savedFile=path.join(p7.ROOT,saved);
  if(fs.existsSync(savedFile)) {
    const buffer=fs.readFileSync(savedFile);assert.equal(p7.sha256Buffer(buffer),'19C745FBB564BF65A32166CE3D972D9F840707A887DFAE39AA6A4C2C2998F455');
    const elf=p7.parseElf32BigEndian(buffer),c=tail.census(elf,'.ob64.r4956','func_00276e48',true),original=require('../tools/lib/word_asm').assembleWordAsmFile(path.join(p7.ROOT,'asm/original/rev0/lib/func_00276e48.s')).bytes;
    const rel=p8.relocationRecords(elf,{symbol:'func_00276e48',bytes:400,sectionName:'.ob64.r4956'});
    rejects(()=>tail.coverage(c.bytes,0x802226B8,rel,408),/relocated noncall/);checks++;
    const edges=tail.coverage(c.bytes,0x802226B8,rel,408,{buffer,sectionName:'.ob64.r4956',symbol:'func_00276e48',original,assigned:true});assert.equal(edges.length,9);assert(edges.every(e=>e.targetOffset===384));checks++;
  }
  return {checks,syntheticNative:'pass',savedAssigned:fs.existsSync(savedFile)?'pass (coverage only)':'unavailable',freshNative:'not run'};
}



function synthetic() {
  for (const size of [4,8,12]) assert.equal(tail.terminalSuffix(Buffer.concat([body,Buffer.alloc(size)]),body.length),size);
  rejects(()=>tail.terminalSuffix(Buffer.concat([body,Buffer.alloc(16)]),body.length),/4, 8 or 12/);
  rejects(()=>tail.terminalSuffix(Buffer.concat([body,words([1])]),body.length),/nonzero/);
  // Equal RAM is not an owner-qualified entry across overlays. This exact E07
  // overlap stays visible as an unresolved provider hint, never absence proof.
  assert.deepEqual(tail.addressHints({func_8021533C:'0x8021533C'},{vramStart:0x80215288,vramEndExclusive:0x80215350}),
    [{symbol:'func_8021533C',address:'0x8021533C'}]);
  tail.coverage(body, 0x80000000);
  tail.coverage(words([0x0C000100,0,0x03E00008,0]),0x80000000,[{offset:'0x00000000',type:'R_MIPS_26'}]);
  rejects(()=>tail.coverage(body.subarray(0,8),0x80000000),/return/);
  rejects(()=>tail.coverage(words([0x03E00008,0,0x24020001,0x03E00008,0]),0x80000000),/uncovered/);
  rejects(()=>tail.coverage(words([0x10000004,0,0x03E00008,0]),0x80000000),/escapes/);
  rejects(()=>tail.coverage(words([0x03E00008,0x08000000]),0x80000000),/delay/);
  rejects(()=>tail.coverage(words([0x01000008,0,0x03E00008,0]),0x80000000),/indirect/);
  rejects(()=>tail.coverage(words([0x42000018,0x03E00008,0]),0x80000000),/unsupported/);
  rejects(()=>tail.coverage(words([0x49000003,0,0x03E00008,0]),0x80000000),/unsupported/);
  rejects(()=>tail.coverage(words([0x0C000004,0,0x03E00008,0]),0x80000000,[],28),/suffix/);
  // Independent FF6899F6 review falsifiers: none may qualify as complete C.
  rejects(()=>tail.coverage(words([0x10800003,0,0x24020001,0x03E00008,0]),0x80000000,[],32),/alternate entry/);
  rejects(()=>tail.coverage(words([0x01000009,0,0x03E00008,0]),0x80000000,[],28),/indirect call/);
  rejects(()=>tail.coverage(words([0x10000002,0,0x24020001,0x03E00008,0]),0x80000000,[],32),/uncovered/);
  // Ordinary ra-linking JALR and a branch whose only successor is the return.
  tail.coverage(words([0x0100F809,0,0x03E00008,0]),0x80000000);
  tail.coverage(words([0x10000001,0,0x03E00008,0]),0x80000000);
  for (const always of [0x10210002,0x18000002,0x04010002,0x50210002,0x58000002,0x04030002]) {
    rejects(()=>tail.coverage(words([always,0,0x24020001,0x03E00008,0]),0x80000000),/uncovered/);
  }
  for (const never of [0x14210003,0x1C000003,0x04000003]) {
    rejects(()=>tail.coverage(words([never,0,0x03E00008,0,0x24020001,0x03E00008,0]),0x80000000),/uncovered/);
  }
  for (const neverLikely of [0x54210001,0x5C000001,0x04020001]) {
    rejects(()=>tail.coverage(words([neverLikely,0,0x03E00008,0]),0x80000000),/uncovered/);
  }
  tail.coverage(words([0x50800001,0,0x03E00008,0]),0x80000000);
  rejects(()=>tail.coverage(words([0x01008009,0,0x03E00008,0]),0x80000000),/indirect call/);
  rejects(()=>tail.coverage(words([0x04110001,0,0x03E00008,0]),0x80000000),/unsupported/);
  // R2 review: decoder mnemonics are not an encoding whitelist. Reject explicit
  // traps and unknown forms everywhere, including the final return delay slot.
  for (const invalid of [0x00000034,0x00000001,0x0000000C,0x0000000D,0x0000000F,
    ...Array.from({length:8},(_,i)=>0x30+i),0x00000005,0x0000000A,0x0000000B,0x00000028,0x00000029,
    0x00200000,0x00000044,0x00200010,0x00000818,0x00000061,0x18210001,0x3C210000,
    0x70000000,0xC8000000,0xBC000000,0x44000001,0x44C00000,0x45040001,0x45800000,
    0x46000010,0x46000020,0x46800000,0x46010006,0x46000070]) {
    rejects(()=>tail.coverage(words([invalid,0x03E00008,0]),0x80000000),/unsupported/);
    rejects(()=>tail.coverage(words([0x24020001,0x03E00008,invalid]),0x80000000),/unsupported|control delay/);
  }
  for (let rt=4;rt<32;rt++) {
    const invalid=(0x04000000|(rt<<16))>>>0;
    rejects(()=>tail.coverage(words([invalid,0x03E00008,0]),0x80000000),/unsupported/);
    rejects(()=>tail.coverage(words([0x24020001,0x03E00008,invalid]),0x80000000),/unsupported|control delay/);
  }
  // Ordinary integer/transfer/FP forms remain eligible, with reserved fields zero.
  for (const ordinary of [0x00431021,0x00021880,0x00431804,0x00430018,0x00001012,0x3C028000,
    0x8FA20010,0xAFA20010,0x44020000,0x44820000,0x4442F800,0x44C2F800,0x46020800,
    0x46000806,0x46020832,0x46000821,0x46200820,0x46800820,0x46000824,0xC7A00000]) {
    tail.coverage(words([ordinary,0x03E00008,0]),0x80000000);
  }
  const section={index:1,name:'.text',type:1,flags:6,address:0,size:16,alignment:16,offset:0};
  const fn={name:'test',symbolType:2,sectionIndex:1,binding:1,visibility:0,value:0,size:12};
  const marker={name:'gcc2_compiled.',symbolType:1,sectionIndex:1,binding:0,visibility:0,value:0,size:0};
  const elf={sections:[{index:0,name:'',size:0,flags:0},section],symbols:[fn,marker],buffer:Buffer.concat([body,Buffer.alloc(4)])};
  assert.equal(tail.census(elf,'.text','test').fn.size,12);
  rejects(()=>tail.census(elf,'.text','test',true),/extent/);
  rejects(()=>tail.census({...elf,symbols:[fn,marker,{...fn,name:'other'}]},'.text','test'),/census/);
  rejects(()=>tail.census({...elf,buffer:Buffer.concat([body,words([1])])},'.text','test'),/tail/);
  rejects(()=>tail.census({...elf,sections:[...elf.sections,{index:2,name:'.data',size:4,flags:3}]},'.text','test'),/allocated|writable/);
  rejects(()=>tail.census({...elf,symbols:[...elf.symbols,{name:'common',size:4,sectionIndex:0xFFF2}]},'.text','test'),/COMMON/);
  rejects(()=>tail.census({...elf,symbols:[fn,marker,{...marker,name:'entry',value:4}]},'.text','test'),/label/);
  const row={index:1,part:{name:'test'},slices:[{sectionName:'.ob64.r0001'}]};
  const native=tail.census(elf,'.text','test');
  assert.equal(tail.descriptor(row,12,native).tail.bytes,4);
  rejects(()=>tail.descriptor(row,8,native),/descriptor/);
  rejects(()=>tail.descriptor(row,12,{...native,section:{...section,alignment:4}}),/descriptor/);
  // Mutation writer tests stay in a temporary directory, never canonical config.
  const root=process.env.OB64_TERMINAL_TAIL_TEST_ROOT || path.join(require('../tools/lib/phase7_conventional').ROOT,'build/tests');
  fs.mkdirSync(root,{recursive:true});
  const dir=fs.mkdtempSync(path.join(root,'ob64-tail-'));
  const files=[path.join(dir,'a.json'),path.join(dir,'b.json')];
  const before=[Buffer.from('{"a":1}\n'),Buffer.from('{"unrelated":2}\n')];
  const after=[Buffer.from('{"a":1,"new":3}\n'),before[1]];
  files.forEach((f,i)=>fs.writeFileSync(f,before[i]));
  tail.writeBatch(files,before,after,()=>{});
  assert.deepEqual(files.map(f=>fs.readFileSync(f)),after);
  rejects(()=>tail.writeBatch(files,before,after,()=>{}),/stale/);
  rejects(()=>tail.writeBatch(files,after,before,()=>{throw new Error('seal changed');}),/seal changed/);
  assert.deepEqual(files.map(f=>fs.readFileSync(f)),after);
  rejects(()=>tail.admit(['x','X']),/unique/);
  rejects(()=>tail.admit(['x'],{inputs:'historical'}),/only/);
  rejects(()=>tail.admit(['x'],{'scratch-root':'worker'}),/only/);
  const cli = require('../tools/match');
  assert.deepEqual(cli.parseArgs(['x','y','--apply','--json']),{positional:['x','y'],options:{apply:true,json:true}});
  rejects(()=>cli.validatePrivateOptions('watch',{apply:true}),/requires tail-admit/);
  rejects(()=>cli.validatePrivateOptions('tail-admit',{'scratch-root':'worker'}),/unsupported/);
  rejects(()=>cli.validatePrivateOptions('tail-admit',{inputs:'old', 'scratch-root':'worker'}),/only guarded/);
  // A failure on the second rename must restore only this writer's first file.
  files.forEach((f,i)=>fs.writeFileSync(f,before[i]));
  const rename=fs.renameSync;
  try {
    fs.renameSync=(a,b)=>{if(b===files[1])throw new Error('injected second write failure');return rename(a,b);};
    rejects(()=>tail.writeBatch(files,before,[after[0],Buffer.from('{"new":4}\n')],()=>{}),/injected/);
  } finally {fs.renameSync=rename;}
  assert.deepEqual(files.map(f=>fs.readFileSync(f)),before);
  return {status:'pass',suite:'matching-terminal-tail',temporary:dir,entryIdentity:entryIdentityTests(dir),localControl:localControlTests()};
}

async function run() {
  const result=synthetic(),cli=require('../tools/match'),original=tail.admit;
  let called=null,printed=null;
  try {
    tail.admit=(symbols,options)=>{called={symbols,options};return {status:'configuration-staged'};};
    await cli.executeCommand('tail-admit',{positional:['func_12345678'],options:{apply:true,json:true}},null,value=>{printed=value;});
    assert.deepEqual(called,{symbols:['func_12345678'],options:{apply:true,json:true}});
    assert.equal(printed.status,'configuration-staged');
  } finally {tail.admit=original;}
  return {...result,cliRouting:'pass'};
}
if(require.main===module)run().then(value=>console.log(JSON.stringify(value))).catch(error=>{console.error(error);process.exitCode=1;});
module.exports={synthetic};

