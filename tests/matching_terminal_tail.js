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
  const unlabeledStart=checks;
  const unlabeled=(originalWords=[0x24020001,0x03E00008,0,0])=>{
    const f=fixture(0xABC,'func_00000AbC',originalWords);
    f.rewrite(f.source.replace('func_00000AbC:\n',''));
    f.source=fs.readFileSync(f.file,'utf8');
    f.row.part.hasOwnerLabel=false;
    return f;
  };
  // No preexisting canonical C provider is needed for an ASM-owned private
  // candidate; one staged provider is permitted and duplicates still reject.
  pass(unlabeled());
  const uStaged=unlabeled();uStaged.session.context.phase8.targets=[{symbol:uStaged.target.symbol,romStartNumber:uStaged.row.romStart,romEndNumber:uStaged.row.romEndExclusive,compilerTextFunctions:[{symbol:uStaged.target.symbol}]}];pass(uStaged);
  const uDuplicate=unlabeled();uDuplicate.session.context.phase8.targets=[0,1].map(()=>({symbol:uDuplicate.target.symbol,romStartNumber:uDuplicate.row.romStart,romEndNumber:uDuplicate.row.romEndExclusive}));no(uDuplicate,/duplicate provider/);
  for(const suffixBytes of [4,8,12]) {
    const f=unlabeled([0x24020001,0x03E00008,0,...Array(suffixBytes/4).fill(0)]);
    assert.equal(tail.originalOwner(f.session,f.target,12).tailBytes,suffixBytes);checks++;
  }
  const uComment=unlabeled();uComment.rewrite(uComment.source.replace('.set noat\n.set noreorder\n.text','.text\n/* labels and globals in comments are not entries\nother: .globl other */\n.set noreorder\n.set noat'));pass(uComment);
  for(const change of [s=>s+'.Llocal:\n',s=>s+'1:\n',s=>s+'other:\n',s=>s.replace('.text','.text\nother:'),
    s=>s.replace('.word 0x03e00008','other:\n.word 0x03e00008'),s=>s.replace('.word 0x24020001','other: .word 0x24020001'),
    s=>s.replace('.text','.text\n.globl other'),s=>s.replace('.text','.text\n.globl other\n.globl other'),
    s=>s.replace('.text','.text\n.globl func_00000AbC'),s=>s+'.text\n',s=>s.replace('.text',''),
    s=>s+'.set noat\n',s=>s.replace('.set noat','.set reorder'),s=>s+'.set alias,func_00000abc\n',s=>s+'alias = 0\n',
    s=>s+'.include "x"\n',s=>s+'.macro x\n.endm\n',s=>s+'.byte 0\n',s=>s+'.space 0\n',s=>s+'.align 2\n',s=>s+'.data\n',
    s=>s.replace('.word 0x24020001','.word (0x24020001)'),s=>s.replace('.word 0x24020001','.word external'),
    s=>s.replace('.word 0x24020001','.word 0x124020001'),s=>s.replace('.word 0x24020001','.word 0x24020001,0'),
    s=>s+'/* unterminated',s=>s+'*/',s=>s+'# .word 0x00000000\n',
    s=>s.replace('.word 0x24020001','/* .word 0x24020001 */')]) {
    const f=unlabeled();f.rewrite(change(f.source));no(f,/original entry|complete original word|differs from ROM/);
  }
  for(const mutate of [f=>{f.row.part.hasOwnerLabel=true;},f=>{delete f.row.part.hasOwnerLabel;},
    f=>{f.row.part.textBytes++;},f=>{f.row.part.symbolByteOffset=4;},f=>{f.row.romStart++;},
    f=>{f.target.symbol='arbitrary';f.row.part.name='arbitrary';},f=>{f.target.symbol=f.row.part.name='func_00000abd';},f=>{f.row.part.name='different';},
    f=>{f.row.retainedPadding={};},f=>{f.row.slices.push({...f.row.slices[0]});},f=>{f.row.ambiguous=true;},
    f=>{f.row.processorClass='rsp';},f=>{f.row.slices[0].placementKind='rom-only';},f=>{f.row.slices[0].executable=false;}]) {
    const f=unlabeled();mutate(f);no(f,/unlabeled original entry|physical owner|owner ROM-address|original-name owner|differs from ROM/);
  }
  const uOwner=unlabeled();uOwner.other('func_00000ABC');no(uOwner,/owner collision/);
  const uSameRom=unlabeled();uSameRom.other().row.romStart=uSameRom.row.romStart;no(uSameRom,/owner collision/);
  const uSameName=unlabeled();uSameName.other(uSameName.target.symbol);no(uSameName,/unique original-name owner/);
  for(const source of ['func_00000ABC:\n.word 0\n','.word 0; func_00000ABC:\n','.globl func_00000ABC\n','.globl unrelated,func_00000ABC\n','unrelated:func_00000ABC:\n','.set alias,func_00000ABC\n']) {const f=unlabeled();f.other('other',source);no(f,/source collision/);}
  const uDrift=unlabeled();fs.appendFileSync(uDrift.other().file,'# drift');no(uDrift,/source drift/);
  for(const producer of [{symbol:'func_00000ABC'},{symbol:'other',compilerTextFunctions:[{symbol:'func_00000ABC'}]}]) {const f=unlabeled();f.session.context.phase8.targets=[{...producer,romStartNumber:0x3000,romEndNumber:0x3010}];no(f,/producer collision/);}
  const uGroup=unlabeled();uGroup.session.context.phase8.compilationGroups=[{fixedBindings:[{symbol:'func_00000ABC'}]}];no(uGroup,/group collision/);
  const uMode=unlabeled();uMode.session.context.phase8.targets=[{symbol:uMode.target.symbol,romStartNumber:uMode.row.romStart,romEndNumber:uMode.row.romEndExclusive,atomicText:{}}];no(uMode,/unsupported producer/);
  const uSha=unlabeled();fs.appendFileSync(uSha.file,'# changed');no(uSha,/assembly identity drift/);
  const uRom=unlabeled();uRom.rom[0]^=1;fs.writeFileSync(uRom.romFile,uRom.rom);no(uRom,/ROM SHA/);
  const uWord=unlabeled();uWord.rewrite(uWord.source.replace('0x24020001','0x24020002'));no(uWord,/differs from ROM/);
  const uShort=unlabeled();uShort.rewrite(uShort.source.replace('.word 0x24020001\n',''));no(uShort,/word census/);
  const uSuffix=unlabeled([0x24020001,0x03E00008,0,1]);no(uSuffix,/nonzero original suffix/);
  const uReturn=unlabeled([0x24020001,0,0,0]);no(uReturn,/complete return/);
  const uBody=unlabeled([0x03E00008,0,0x24020001,0x03E00008,0,0]);no(uBody,/uncovered/);
  for(const collidingSelected of [false,true]) {
    const f=unlabeled(),record=f.other('other',collidingSelected?'func_00000ABC:\n':'unrelated:\n');
    const saved=path.join(f.base,'selected.s');fs.copyFileSync(record.file,saved);f.replacements.set(record.file,saved);
    fs.writeFileSync(record.file,collidingSelected?'unrelated:\n':'func_00000ABC:\n');
    if(collidingSelected) no(f,/source collision/);else pass(f);
  }
  const uSelectedOwner=unlabeled(),uSaved=path.join(uSelectedOwner.base,'selected-owner.s');fs.copyFileSync(uSelectedOwner.file,uSaved);uSelectedOwner.replacements.set(uSelectedOwner.file,uSaved);fs.writeFileSync(uSelectedOwner.file,'wrong:\n');pass(uSelectedOwner);
  for(const corruptSelected of [false,true]) {
    const f=unlabeled(),saved=path.join(f.base,'selected-rom.bin');fs.copyFileSync(f.romFile,saved);f.replacements.set(f.romFile,saved);
    const corrupt=Buffer.from(f.rom);corrupt[0]^=1;fs.writeFileSync(corruptSelected?saved:f.romFile,corrupt);
    if(corruptSelected) no(f,/ROM SHA/);else pass(f);
  }
  // Hash-bound real word-only source is evidence for this generic branch, not
  // a production whitelist. Synthetic ROM/model remain diagnostic fixtures.
  const uSource=fs.readFileSync(path.join(p7.ROOT,'asm/original/rev0/lib/func_0025CD38.s'),'utf8');
  assert.equal(p7.sha256Buffer(Buffer.from(uSource)),'C79D101FCCA039ACD55BBE8B4AFECEBBB7A5E3A0212E1F2D07983EBAB7FFAAD7');
  const uOriginal=asm.assembleWordAsmText(uSource).bytes;
  assert.equal(uOriginal.length,124);assert.equal(p7.sha256Buffer(uOriginal),'A8A06AA61913DA31D19C5F0CDF23B7D7CDDC4A19D3E32AEF5ED415FEDC4AFE36');
  const uReal=fixture(0x25CD38,'unused',Array.from({length:31},(_,i)=>uOriginal.readUInt32BE(i*4)));
  uReal.target.symbol=uReal.row.part.name='func_0025CD38';uReal.row.part.hasOwnerLabel=false;uReal.rewrite(uSource);
  uReal.row.slices[0].vramStart=0x80208178;uReal.row.slices[0].vramEndExclusive=0x802081F4;uReal.row.slices[0].overlayDescriptorId=11;
  for(const part of parts.filter(part=>part.file!=='asm/original/rev0/lib/func_0025CD38.s')) uReal.model.rows.push({index:uReal.model.rows.length,romStart:Number(part.romStart),romEndExclusive:Number(part.romEndExclusive),part});
  assert.equal(tail.originalOwner(uReal.session,uReal.target,120).tailBytes,4);checks++;

  // Inert original labels do not create callable bodies. Keep the existing
  // actual-control tests separate from these symbolic-interface checks.
  const interiorStart=checks;
  const interior=(primary='exact',offset=4)=>{
    const f=fixture(0xABC,primary==='exact'?'func_00000abc':'func_00000AbC');
    let source=f.source;
    if(primary==='absent') source=source.replace('func_00000AbC:\n','');
    const lines=source.split('\n');let words=0;
    for(let i=0;i<lines.length;i++) if(lines[i].startsWith('.word')) {
      if(words*4===offset){lines.splice(i,0,'func_'+(0xABC+offset).toString(16).padStart(8,'0')+':');break;}
      words++;
    }
    f.rewrite(lines.join('\n'));f.source=lines.join('\n');f.row.part.hasOwnerLabel=primary==='exact';
    f.session.context.phase8.linkageConfig={symbols:[],targets:[]};
    return f;
  };
  for(const primary of ['exact','case','absent']) pass(interior(primary));
  pass(interior('exact',8)); // inert final delay-slot label, not a control edge
  for(const change of [
    f=>{f.row.part.hasOwnerLabel=false;},f=>{delete f.row.part.hasOwnerLabel;},
    f=>{f.rewrite(f.source.replace('func_00000ac0:','func_00000ac4:'));},
    f=>{f.rewrite(f.source.replace('func_00000ac0:','func_00000ac0:\nfunc_00000AC0:'));},
    f=>{f.rewrite(f.source.replace('.text','.text\n.globl func_00000ac0'));},
    f=>{f.rewrite(f.source.replace('func_00000ac0:','arbitrary:'));},
    f=>{f.rewrite(f.source+'func_00000acc:\n');},
    f=>{f.rewrite(f.source.replace('func_00000ac0:\n','').replace('.word 0x00000000\n','.word 0x00000000\nfunc_00000ac8:\n'));},
  ]) {const f=interior();change(f);no(f,/interior original entry/);}
  const absentGlobal=interior('absent');absentGlobal.rewrite(absentGlobal.source.replace('.text','.text\n.globl func_00000abc'));no(absentGlobal,/interior original entry/);
  const caseFlag=interior('case');caseFlag.row.part.hasOwnerLabel=true;no(caseFlag,/interior original entry/);
  for(const field of ['linkSymbols','linkageConfig','compilationGroups']) {const f=interior();delete f.session.context.phase8[field];no(f,/canonical views/);}
  for(const field of ['symbols','targets']) {const f=interior();delete f.session.context.phase8.linkageConfig[field];no(f,/canonical views/);}
  for(const source of ['func_00000AC0:\n.word 0\n','.word func_00000ac0\n','.set alias,func_00000ac0\n','.globl func_00000ac0\n']) {
    const f=interior();f.other('unrelated',source);no(f,/source collision/);
  }
  const namedOwner=interior();namedOwner.other('func_00000AC0');no(namedOwner,/owner collision/);
  const overlap=interior();overlap.other().row.romStart=0xAC0;no(overlap,/owner collision/);
  const sameFile=interior();const other=sameFile.other();other.row.part={...sameFile.row.part,name:'different'};no(sameFile,/source collision/);
  const selectedInterior=interior(),selectedRecord=selectedInterior.other('other','func_00000ac0:\n');
  const selectedPath=path.join(selectedInterior.base,'selected-interior.s');fs.copyFileSync(selectedRecord.file,selectedPath);
  selectedInterior.replacements.set(selectedRecord.file,selectedPath);fs.writeFileSync(selectedRecord.file,'unrelated:\n');no(selectedInterior,/source collision/);
  const unrelatedRam=interior();unrelatedRam.session.context.phase8.linkSymbols.unrelated=0x80000004;pass(unrelatedRam);
  for(const mutate of [
    p=>{p.linkSymbols.func_00000AC0=0x12345678;},
    p=>{p.linkageConfig.symbols.push({name:'func_00000AC0',address:'0x12345678'});},
    p=>{p.linkageConfig.targets.push({symbol:'other',expectedRelocations:[{symbol:'func_00000AC0'}]});},
    p=>{p.targets.push({symbol:'func_00000AC0',romStartNumber:0x3000,romEndNumber:0x3010});},
    p=>{p.targets.push({symbol:'other',romStartNumber:0x3000,romEndNumber:0x3010,compilerTextFunctions:[{symbol:'func_00000AC0'}]});},
    p=>{p.compilationGroups.push({fixedBindings:[{symbol:'func_00000AC0',address:0x12345678}]});},
    p=>{p.compilationGroups.push({expectedRelocations:[{symbol:'func_00000AC0'}]});},
  ]) {const f=interior();mutate(f.session.context.phase8);no(f,/interior entry .*collision/);}
  const insideProvider=interior();insideProvider.session.context.phase8.targets.push({symbol:'different',romStartNumber:0xAC0,romEndNumber:0xAC4});no(insideProvider,/unsupported producer/);
  const driftInterior=interior();fs.appendFileSync(driftInterior.other().file,'# changed');no(driftInterior,/source drift/);

  for(const collision of ['alias','symbol']) {
    const f=interior(),other=f.other('unrelated','.word 0x24020001\n'),row=other.row;
    row.bytes=4;row.slices=[{executable:true,placementKind:'overlay',overlayDescriptorId:2,romStart:row.romStart,romEndExclusive:row.romEndExclusive,vramStart:0x80001000,sectionName:'.test.other'}];
    const rom=Buffer.alloc(row.romEndExclusive);f.rom.copy(rom);rom.writeUInt32BE(0x24020001,row.romStart);fs.writeFileSync(f.romFile,rom);
    Object.assign(f.model.config.rom,{bytes:rom.length,sha256:p7.sha256Buffer(rom),codeRegionEndExclusive:rom.length,codeRegionSha256:p7.sha256Buffer(rom.subarray(f.row.romStart))});
    const logical=require('../tools/lib/logical_functions');
    const registered={...registry,bodies:[{romStart:row.romStart,romEndExclusive:row.romEndExclusive,
      symbol:collision==='symbol'?'func_00000ac0':'other_body',aliases:collision==='alias'?['func_00000AC0']:[],
      expectedBytesSha256:p7.sha256Buffer(rom.subarray(row.romStart)),fragments:logical.intersections(f.model,row.romStart,row.romEndExclusive),
      evidence:{status:'known-entry-or-ownership',rationale:'test disjoint symbolic claim'}}]};
    fs.writeFileSync(path.join(f.base,'registry.json'),JSON.stringify(registered));
    // Establish the disjoint registry itself is valid before its name collides.
    logical.loadRegistry(f.model,rom,registered);
    no(f,/interior entry logical registry collision/);
  }

  {
    const f=interior(),logical=require('../tools/lib/logical_functions');
    const first=f.other('envelope_owner','.word 0x24020001\n.word 0x24030002\n');
    first.row.bytes=8;first.row.romEndExclusive=first.row.romStart+8;
    const next=f.other('following_owner','.word 0x24040003\n');
    next.row.romStart=first.row.romEndExclusive;next.row.romEndExclusive=next.row.romStart+4;next.row.bytes=4;
    for(const item of [first,next]) item.row.slices=[{executable:true,placementKind:'overlay',overlayDescriptorId:2,
      romStart:item.row.romStart,romEndExclusive:item.row.romEndExclusive,
      vramStart:0x80001000+item.row.romStart-first.row.romStart,sectionName:'.test.disjoint'+item.row.index}];
    const rom=Buffer.alloc(next.row.romEndExclusive);f.rom.copy(rom);
    rom.writeUInt32BE(0x24020001,first.row.romStart);rom.writeUInt32BE(0x24030002,first.row.romStart+4);rom.writeUInt32BE(0x24040003,next.row.romStart);
    fs.writeFileSync(f.romFile,rom);
    Object.assign(f.model.config.rom,{bytes:rom.length,sha256:p7.sha256Buffer(rom),codeRegionEndExclusive:rom.length,
      codeRegionSha256:p7.sha256Buffer(rom.subarray(f.row.romStart))});
    const bodyStart=first.row.romStart+4,bodyEnd=next.row.romEndExclusive;
    const preserved={symbol:'preserved_primary',evidence:'test valid disjoint producer',
      fragments:[{rowIndex:first.row.index,romStart:first.row.romStart,romEndExclusive:first.row.romEndExclusive,
        file:first.row.part.file,sha256:first.row.part.sha256}],
      compilerTextFunctions:[{symbol:'preserved_primary',offset:'0x0',offsetNumber:0,bytes:4,binding:'GLOBAL',entryEvidence:'owner'},
        {symbol:'preserved_secondary',offset:'0x4',offsetNumber:4,bytes:4,binding:'LOCAL',entryEvidence:'reviewed-local-body'}]};
    const registered={...registry,bodies:[{romStart:bodyStart,romEndExclusive:bodyEnd,symbol:'crossing_body',aliases:[],
      expectedBytesSha256:p7.sha256Buffer(rom.subarray(bodyStart,bodyEnd)),fragments:logical.intersections(f.model,bodyStart,bodyEnd),
      evidence:{status:'known-entry-or-ownership',rationale:'test body crosses preserved terminal edge'}}],preservedProductionEnvelopes:[preserved]};
    const save=()=>fs.writeFileSync(path.join(f.base,'registry.json'),JSON.stringify(registered));
    save();logical.loadRegistry(f.model,rom,registered);pass(f);
    preserved.compilerTextFunctions[1].symbol='func_00000AC0';
    save();logical.loadRegistry(f.model,rom,registered); // still valid; only the independent name guard must fail
    no(f,/interior entry logical registry collision/);
  }
  {
    const f=interior(),producer={symbol:'unrelated',romStartNumber:0x3000,romEndNumber:0x3010,
      compilerTextFunctions:[{symbol:'unrelated'}],expectedRelocations:[]};
    for(const key of ['model','row','rows','evidence']) Object.defineProperty(producer,key,{enumerable:true,get(){throw Error('unbounded producer graph read');}});
    f.session.context.phase8.targets.push(producer);pass(f);
    const group={functions:[{symbol:'other'}],members:[{symbol:'other',functionSymbols:['other']}],relocations:[]};
    Object.defineProperty(group,'evidence',{enumerable:true,get(){throw Error('unbounded group evidence read');}});
    f.session.context.phase8.compilationGroups.push(group);pass(f);
    group.relocations.push({symbol:'func_00000AC0'});no(f,/interior entry group collision/);
  }
  // Authentic source-format controls only; synthetic ROMs are not acceptance.
  const realEntries=[{"symbol":"func_002638D0","source":"asm/original/rev0/lib/func_002638D0.s","sha":"0FFC1956667FDC2512ECF56DC3276F39E3055A36E9D07A1F95ADF7E251F61E86","rom":2504912,"vram":2149641504,"body":264,"labels":[{"name":"func_002638D0","offset":0},{"name":"func_00263904","offset":52}]},{"symbol":"func_00263E10","source":"asm/original/rev0/lib/func_00263E10.s","sha":"4D693FC5D957EB545A1D7BB8C7D4B70ADD8C05DC5CF12115154C539DEE1132AC","rom":2506256,"vram":2149642848,"body":300,"labels":[{"name":"func_00263E10","offset":0}]},{"symbol":"func_00263F40","source":"asm/original/rev0/lib/func_00263F40.s","sha":"D6B055062CCD268EE9ED4FC2206C4EE4753BB345CE80B61A31D068F0522AE192","rom":2506560,"vram":2149643152,"body":616,"labels":[{"name":"func_00263F40","offset":0}]},{"symbol":"func_002641B0","source":"asm/original/rev0/lib/func_002641B0.s","sha":"9F508FAC3427EA3EA57DAAAA96E2EECF1CDC3254BE29FFF0A3E7E493BE6433AA","rom":2507184,"vram":2149643776,"body":728,"labels":[{"name":"func_002641B0","offset":0}]},{"symbol":"func_00264490","source":"asm/original/rev0/lib/func_00264490.s","sha":"37C9C4F44D2D35766B3DF7346EBE5BF01792E707ABA8FBE17800A115B1DECE91","rom":2507920,"vram":2149644512,"body":728,"labels":[{"name":"func_00264490","offset":0}]},{"symbol":"func_00264b50","source":"asm/original/rev0/lib/func_00264b50.s","sha":"3CCBDFDAAEB586F322A13638E548064E8B4F5906B939F31E57E97E334B790046","rom":2509648,"vram":2149646240,"body":92,"labels":[{"name":"func_00264B50","offset":0}]},{"symbol":"func_00264f58","source":"asm/original/rev0/lib/func_00264f58.s","sha":"BB20124E907A9B55F400C4C236FD836CD670B30EBD9F9FED59B1A6E095E20078","rom":2510680,"vram":2149647272,"body":92,"labels":[{"name":"func_00264F58","offset":0}]},{"symbol":"func_00266484","source":"asm/original/rev0/lib/func_00266484.s","sha":"12D785CBE10E653531EA553D53204AC98C8C5A45C8BD73A73A523FFCEB445CCD","rom":2516100,"vram":2149652692,"body":32,"labels":[{"name":"func_00266484","offset":0}]},{"symbol":"func_002673C4","source":"asm/original/rev0/lib/func_002673C4.s","sha":"7947884C3502B0C0CE4508D56FE37B012FBDCB61546EB633752937E7E67AF1BD","rom":2520004,"vram":2149656596,"body":32,"labels":[{"name":"func_002673C4","offset":0}]},{"symbol":"func_00267668","source":"asm/original/rev0/lib/func_00267668.s","sha":"A6B985419C2980F99DDA7D219F0D32B6A278507EB3BF0945F601D39DA882FEE4","rom":2520680,"vram":2149657272,"body":220,"labels":[{"name":"func_00267670","offset":8}]},{"symbol":"func_00275EE0","source":"asm/original/rev0/lib/func_00275EE0.s","sha":"F6FEC93D858622210065C804338679C4EB82952ADC6FC33AFC3A07097A93BFAA","rom":2580192,"vram":2149717840,"body":264,"labels":[{"name":"func_00275EE0","offset":0}]},{"symbol":"func_00277EBC","source":"asm/original/rev0/lib/func_00277EBC.s","sha":"E40494FB6A65A87EC51AE5E8DA9A07EB491B10E89C443B64DECF7E59969A87FF","rom":2588348,"vram":2149725996,"body":200,"labels":[{"name":"func_00277EBC","offset":0}]},{"symbol":"func_00278D5C","source":"asm/original/rev0/lib/func_00278D5C.s","sha":"4DC912800B9E4572CF30A1639B5EF3464888858D925FB8E2C4DE082737D98968","rom":2592092,"vram":2149729740,"body":604,"labels":[{"name":"func_00278D5C","offset":0}]},{"symbol":"func_00279810","source":"asm/original/rev0/lib/func_00279810.s","sha":"38686E041D558793CCBAB1BAF2288EB7A2CD0045C30004665A43D7240CE6344D","rom":2594832,"vram":2149732480,"body":268,"labels":[{"name":"func_00279810","offset":0}]}];
  for(const entry of realEntries) {
    const source=fs.readFileSync(path.join(p7.ROOT,entry.source),'utf8');assert.equal(p7.sha256Buffer(Buffer.from(source)),entry.sha);
    const original=asm.assembleWordAsmText(source).bytes;
    const f=fixture(entry.rom,'unused',Array.from({length:original.length/4},(_,i)=>original.readUInt32BE(i*4)));
    f.target.symbol=f.row.part.name=entry.symbol;f.row.part.hasOwnerLabel=entry.labels.some(label=>label.name===entry.symbol&&label.offset===0);
    f.rewrite(source);f.session.context.phase8.linkageConfig={symbols:[],targets:[]};
    f.row.slices[0].vramStart=entry.vram;f.row.slices[0].vramEndExclusive=entry.vram+original.length;
    assert.equal(tail.originalOwner(f.session,f.target,entry.body).tailBytes,original.length-entry.body);checks++;
  }
  return {checks,interiorChecks:checks-interiorStart,unlabeledChecks:checks-unlabeledStart,p04Static:'pass',p05Static:'pass',selectedInputs:'pass',exactPathNoScan:'pass'};
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
  rejects(()=>cli.validatePrivateOptions('tail-admit',{inputs:'old', 'scratch-root':'worker'}),/--inputs supports guarded intake, history, best, watch --source and probe --source/);
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

// Native fixture: full inspect positives and separately labelled direct guard
// negatives. Never intercept readers, parsers, runtime tools or inspect calls.
async function nativeFixture(options) {
  const p7=require('../tools/lib/phase7_conventional'),p8=require('../tools/lib/phase8_matching_c');
  const workflow=require('../tools/lib/current_workflow'),compiler=require('../tools/lib/matching/compiler');
  const policy=require('../tools/lib/source_policy'),inputSet=require('../tools/lib/matching/input_set');
  const {capturePrivateInputs}=require('../tools/lib/matching/private_inputs');
  const root=p7.ROOT,output=options.output;
  const digest=bytes=>require('crypto').createHash('sha256').update(bytes).digest('hex').toUpperCase();
  const fileRecord=file=>({path:path.relative(root,file).replace(/\\/g,'/'),bytes:fs.statSync(file).size,sha256:digest(fs.readFileSync(file))});
  const records=[],selections=[];
  const record=value=>{records.push(value);fs.writeFileSync(path.join(output,'progress.json'),JSON.stringify(records,null,2)+'\n');};
  const readyFile=path.resolve(root,options.readiness),readyBytes=fs.readFileSync(readyFile);
  assert.equal(digest(readyBytes),options.readinessSha256);
  const ready=JSON.parse(readyBytes);
  assert.equal(ready.status,'actual-full-e05-context-ready-hold-stable-for-reviewed-fixtures');
  const authenticateReady=()=>{
    assert.equal(digest(fs.readFileSync(readyFile)),options.readinessSha256);
    for(const entry of [...ready.inputs,...ready.tools,ready.acceptedP06State,ready.selectedMi16]) {
      const file=path.resolve(root,entry.path);inputSet.regular(file);
      assert.equal(fs.statSync(file).size,entry.bytes);assert.equal(digest(fs.readFileSync(file)),entry.sha256);
    }
  };
  authenticateReady();
  const seal=capturePrivateInputs();
  let failure;
  const originalRecords=[];
  try {
    const context=workflow.prepareContext({readOnly:true});
    assert.equal(context.currentFingerprint,ready.stagedCurrentFingerprint);
    assert.equal(context.baselineFingerprint,ready.stagedBaselineFingerprint);
    const session=compiler.prepareCompilerSession({context});
    const positives=[];
    for(const [index,symbol] of ['func_002638D0','func_00267668'].entries()) {
      const matches=context.phase8.targets.filter(t=>t.symbol===symbol);assert.equal(matches.length,1);
      const target=matches[0],artifactDir=path.join(output,'e'+index);fs.mkdirSync(artifactDir);
      const sourceFile=path.join(root,target.source),classification=policy.classifySource(target.source,{preprocessor:session.preprocessor});
      assert.equal(classification.class,'PURE_C');
      const expected=ready.sourcePolicy.find(value=>value.symbol===symbol);assert(expected);
      assert.equal(classification.sourceSha256,expected.sourceSha256);
      assert.equal(classification.compilationInput.sha256,expected.compilationInput.sha256);
      compiler.compileScratchCandidate({session,target,sourceFile,artifactDir,classification});
      const proposal=tail.inspect({session,target,classification,artifactDir});
      assert.equal(proposal.bodyBytes,index===0?264:220);assert.equal(proposal.tailBytes,index===0?8:12);
      assert.equal(proposal.interiorNames.length,1);assert.equal(proposal.interiorNames[0].offset,index===0?52:8);
      assert.equal(proposal.diagnostic.linkedQualified,false);
      positives.push({target,classification,artifactDir,proposal});
      record({kind:'full-inspect-positive',symbol,diagnostic:proposal.diagnostic,interiorNames:proposal.interiorNames});
      // Real existing original emitter, unchanged source and actual pinned ASM.
      const original=fs.readFileSync(path.join(root,proposal.row.part.file));
      const emitter=require('../tools/build_phase7_conventional');
      const generated=emitter.transformTrackedPartSource(proposal.row,original);
      const asmFile=path.join(artifactDir,'original.s'),objFile=path.join(artifactDir,'original.o');
      fs.writeFileSync(asmFile,generated);
      p7.run(session.runtime.tools['mips-kmc-elf-as.exe'].path,[...context.phase8.model.config.binutils.assemblerFlags,'-o',objFile,asmFile],{cwd:artifactDir});
      const elf=p7.parseElfFile(objFile),section=elf.sections.find(s=>s.name===target.sectionName);assert(section);
      assert(p7.elfSectionBytes(elf,section).equals(proposal.original));
      const raw=p8.rawRelocationRecords(elf),originalSymbols=[];
      for(const name of proposal.interiorNames) {
        const symbols=elf.symbols.filter(s=>s.name===name.name);assert.equal(symbols.length,1);
        const symbol=symbols[0];assert.equal(symbol.binding,0);assert.equal(symbol.visibility,0);
        assert.equal(symbol.symbolType,1);assert.equal(symbol.size,0);assert.equal(symbol.value,name.offset);assert.equal(symbol.sectionIndex,section.index);
        originalSymbols.push({name:symbol.name,binding:symbol.binding,symbolType:symbol.symbolType,visibility:symbol.visibility,size:symbol.size,value:symbol.value,sectionIndex:symbol.sectionIndex,symbolIndex:symbol.symbolIndex,symbolTableIndex:symbol.symbolTableIndex});
        assert(!raw.some(r=>r.symbol===symbol.name));
        // Prove no serialized REL record references this exact table/index.
        for(const rel of elf.sections.filter(s=>s.type===9)) {
          assert.equal(rel.entrySize,8);assert.equal(rel.size%8,0);
          for(let i=0;i<rel.size;i+=8)assert(!(rel.link===symbol.symbolTableIndex && (elf.buffer.readUInt32BE(rel.offset+i+4)>>>8)===symbol.symbolIndex));
        }
      }
      const conformance={kind:'original-emitter-conformance',symbol,source:fileRecord(path.join(root,proposal.row.part.file)),
        emitter:fileRecord(path.join(root,'tools/build_phase7_conventional.js')),assembler:fileRecord(session.runtime.tools['mips-kmc-elf-as.exe'].path),
        generated:fileRecord(asmFile),object:fileRecord(objFile),interiors:proposal.interiorNames,originalSymbols,relocations:raw};
      originalRecords.push(conformance);record(conformance);
      guardControls({proposal,artifactDir,target,p7,p8,record,fileRecord,output});
    }
    // Genuine nonexact E05 C input: same live context, same public/header ABI.
    const control=positives[0],badDir=path.join(output,'bad');fs.mkdirSync(badDir);
    const originalSource=fs.readFileSync(path.join(root,control.target.source),'utf8');
    assert.equal((originalSource.match(/120\.0f/g)||[]).length,2);
    const changed=originalSource.replace(/120\.0f/g,'121.0f'),badSource=path.join(badDir,'candidate.c');fs.writeFileSync(badSource,changed);
    const badClass=policy.classifySource(path.relative(root,badSource),{preprocessor:session.preprocessor});assert.equal(badClass.class,'PURE_C');
    compiler.compileScratchCandidate({session,target:control.target,sourceFile:badSource,artifactDir:badDir,classification:badClass});
    const badElf=p7.parseElfFile(path.join(badDir,'candidate.o'));
    const badCensus=tail.census(badElf,control.target.sectionName,control.target.symbol,true);
    // Establish valid census/owner and name prerequisites before comparison fails.
    const badOwner=tail.originalOwner(session,control.target,badCensus.fn.size);
    tail.rejectInteriorObjectClaims(badOwner.interiorNames,badElf,p8.rawRelocationRecords(badElf));
    assert.throws(()=>tail.inspect({session,target:control.target,classification:badClass,artifactDir:badDir}),/ordinary body mismatch/);
    record({kind:'real-nonexact-C-negative',source:fileRecord(badSource),object:fileRecord(path.join(badDir,'candidate.o')),expectedRejection:'ordinary body mismatch'});
    // P06 is accepted in live context. Use one complete authentic pre-admission
    // selection for its ordinary tail control; never remove live tail metadata.
    const p06Dir=path.join(output,'p06');fs.mkdirSync(p06Dir);
    const sourceReference=path.join(root,'build/matching/ae-p06/func_00275EE0.c');
    assert.equal(digest(fs.readFileSync(sourceReference)),'DD0C55D5D61311F634D438A134EF65568DE75140A204C4545B4C4E51CF36DD42');
    const p06Source=path.join(p06Dir,'candidate.c');fs.copyFileSync(sourceReference,p06Source);
    const selected=inputSet.openInputSet(path.resolve(root,ready.selectedMi16.path),{privateRoot:output});selections.push(selected);
    const selectedContext=workflow.prepareContext({readOnly:true,inputs:selected});
    const selectedSession=compiler.prepareCompilerSession({context:selectedContext,inputs:selected});
    const workbench=require('../tools/lib/matching/target_model').loadWorkbenchModel({inputs:selected});
    const p06Target=require('../tools/lib/matching/target_model').resolveTarget(workbench,'func_00275EE0');
    const p06Class=policy.classifySource(path.relative(root,p06Source),{preprocessor:selectedSession.preprocessor});assert.equal(p06Class.class,'PURE_C');
    compiler.compileScratchCandidate({session:selectedSession,target:p06Target,sourceFile:p06Source,artifactDir:p06Dir,classification:p06Class});
    const p06=tail.inspect({session:selectedSession,target:p06Target,classification:p06Class,artifactDir:p06Dir});
    assert.equal(p06.bodyBytes,264);assert.equal(p06.tailBytes,8);assert.equal(p06.interiorNames.length,0);
    assert.equal(p06.diagnostic.representation,'nativeTextTail');
    record({kind:'ordinary-P06-selected-control',selection:ready.selectedMi16,contextFingerprint:selectedContext.currentFingerprint,source:fileRecord(p06Source),diagnostic:p06.diagnostic});
  } catch(error) {failure=error;record({kind:'failure',message:error.message,stack:error.stack});}
  // Normal closing authentication precedes the staged module closing seals.
  try {for(const selected of selections)selected.assertUnchanged();seal.assertUnchanged();authenticateReady();
    for(const conformance of originalRecords)for(const field of ['source','emitter','assembler','generated','object']) {
      const expected=conformance[field],actual=fileRecord(path.resolve(root,expected.path));assert.deepEqual(actual,expected);
    }
    for(const item of records.filter(item=>item.diagnostic))for(const field of ['compilerAssembly','assignedObject','nativeObject']) {
      const expected=item.diagnostic[field];assert.deepEqual(fileRecord(path.resolve(root,expected.path)),expected);
    }
  }
  catch(error) {record({kind:'closing-seal-failure',message:error.message,stack:error.stack});failure??=error;}
  if(failure)throw failure;
  return {status:'pass',scope:'native-fixture-diagnostic-only',readinessSha256:options.readinessSha256,
    currentFingerprint:ready.stagedCurrentFingerprint,records,originalConformance:originalRecords,
    normalClosingSeals:'pass',acceptance:'No linked, CURRENT or full-ROM matching acceptance'};
}

function guardControls({proposal,artifactDir,target,p7,p8,record,fileRecord,output}) {
  const names=proposal.interiorNames;
  const interior=names[0].name,caseName='func_'+interior.slice(5).toLowerCase();
  const equivalent=caseName===interior?'func_'+interior.slice(5).toUpperCase():caseName;
  const stages=[['assigned',path.join(artifactDir,'candidate.o'),target.sectionName,true],
    ['native',path.resolve(p7.ROOT,proposal.diagnostic.nativeObject.path),'.text',false]];
  for(const [stage,file,sectionName,assigned] of stages) {
    const clean=p7.parseElfFile(file),census=tail.census(clean,sectionName,target.symbol,assigned),raw=p8.rawRelocationRecords(clean);
    tail.rejectInteriorObjectClaims(names,clean,raw);
    record({kind:'clean-direct-guard',stage,symbol:target.symbol,object:fileRecord(file)});
    const undef=clean.symbols.find(s=>s.sectionIndex===0&&s.symbolIndex>0&&raw.some(r=>r.symbol===s.name));assert(undef,'real referenced undefined symbol required');
    const fileSymbol=clean.symbols.find(s=>s.symbolType===4);assert(fileSymbol,'real FILE symbol required');
    const nontext=clean.sections.find(s=>s.index>0&&s.name!==sectionName&&s.name==='.reginfo');assert(nontext,'real ancillary section required');
    const variants=[
      ['unused-undefined',null,interior,{binding:1,type:0,section:0},true],
      ['unused-case-undefined',null,equivalent,{binding:1,type:0,section:0},true],
      ['referenced-undefined',undef,interior,null,true],
      ['referenced-case-undefined',undef,equivalent,null,true],
      ['FILE-name',fileSymbol,interior,null,true],
      ['ABS-name',null,interior,{binding:1,type:0,section:0xfff1},false],
      ['nontext-name',null,interior,{binding:1,type:0,section:nontext.index},false],
    ];
    if(equivalent===interior)record({kind:'case-variant-not-applicable',stage,symbol:target.symbol,reason:'Authentic interior ROM spelling contains no hexadecimal letters; lexical case folding is covered by the pure controls.'});
    for(const [label,replace,name,append,validCensus] of variants) {
      if(label.includes('case')&&equivalent===interior)continue;
      const bytes=mutateElfSymbol(clean,replace,name,append),mutated=p7.parseElf32BigEndian(bytes);
      const rel=p8.rawRelocationRecords(mutated),section=mutated.sections.find(s=>s.name===sectionName);
      assert(p7.elfSectionBytes(mutated,section).equals(census.bytes));
      const changed=mutated.symbols.filter(s=>s.name===name);assert.equal(changed.length,1);
      if(replace)assert.equal(changed[0].symbolIndex,replace.symbolIndex);
      else {assert.equal(changed[0].sectionIndex,append.section);assert.equal(changed[0].binding,append.binding);}
      if(label.startsWith('referenced'))assert(rel.some(r=>r.symbol===name));
      else assert(!rel.some(r=>r.symbol===name));
      if(validCensus)tail.census(mutated,sectionName,target.symbol,assigned);
      else assert.throws(()=>tail.census(mutated,sectionName,target.symbol,assigned),/extra text entry or data label/);
      assert.throws(()=>tail.rejectInteriorObjectClaims(names,mutated,rel),/interior entry actual object symbol or REL collision/);
      const mutationFile=path.join(artifactDir,stage+'-'+label+'.o');fs.writeFileSync(mutationFile,bytes);
      record({kind:'direct-guard-negative',stage,label,symbol:target.symbol,mutation:fileRecord(mutationFile),
        census:validCensus?'pass':'rejects-earlier-extra-defined-symbol',fullInspectReplay:false});
    }
    // Raw REL-only predicate falsifier is deliberately an inconsistent supplied
    // record list, not a valid ELF or a production-admission replay.
    assert(raw.length);const inconsistent=raw.map((r,i)=>i?{...r}:{...r,symbol:interior});
    assert.throws(()=>tail.rejectInteriorObjectClaims(names,clean,inconsistent),/actual object symbol or REL collision/);
    record({kind:'direct-guard-inconsistent-rawREL-negative',stage,symbol:target.symbol,fullInspectReplay:false});
    const safeBytes=mutateElfSymbol(clean,null,'unrelated_overlay_name',{binding:1,type:0,section:0xfff1,value:proposal.row.slices[0].vramStart+names[0].offset});
    const safe=p7.parseElf32BigEndian(safeBytes);
    assert.throws(()=>tail.census(safe,sectionName,target.symbol,assigned),/extra text entry or data label/);
    tail.rejectInteriorObjectClaims(names,safe,p8.rawRelocationRecords(safe));
    record({kind:'direct-guard-unrelated-equal-RAM-control',stage,symbol:target.symbol,census:'rejects-earlier-extra-defined-symbol',fullInspectReplay:false});
    // Real-object malformed ELF REL index: preserve the independent parser gate.
    const carrier=clean.sections.find(s=>s.type===9&&s.size);assert(carrier);
    const malformed=Buffer.from(clean.buffer),old=malformed.readUInt32BE(carrier.offset+4);
    malformed.writeUInt32BE((0xffffff00|(old&255))>>>0,carrier.offset+4);
    const malformedFile=path.join(artifactDir,stage+'-bad-rel-index.o');fs.writeFileSync(malformedFile,malformed);
    assert.throws(()=>p8.rawRelocationRecords(p7.parseElf32BigEndian(malformed)),/unsupported ELF relocation entry/);
    record({kind:'malformed-real-REL-negative',stage,symbol:target.symbol,mutation:fileRecord(malformedFile)});
  }
}

// Preserve every old payload byte/index; append replacement STRTAB/SYMTAB and
// update only their existing section headers. These are negative test artifacts.
function mutateElfSymbol(elf,replace,name,append) {
  const table=replace?elf.sections[replace.symbolTableIndex]:elf.sections.find(s=>s.type===2);
  assert(table&&table.entrySize===16&&table.size%16===0);
  const strings=elf.sections[table.link];assert(strings&&strings.type===3);
  const oldStrings=elf.buffer.subarray(strings.offset,strings.offset+strings.size);
  const newStrings=Buffer.concat([oldStrings,Buffer.from(name+'\0')]);
  const oldSymbols=elf.buffer.subarray(table.offset,table.offset+table.size);
  const newSymbols=Buffer.concat([oldSymbols,append?Buffer.alloc(16):Buffer.alloc(0)]);
  const index=replace?replace.symbolIndex:table.size/16,off=index*16;newSymbols.writeUInt32BE(oldStrings.length,off);
  if(append){newSymbols.writeUInt32BE(append.value||0,off+4);newSymbols[off+12]=(append.binding<<4)|append.type;newSymbols.writeUInt16BE(append.section,off+14);}
  const strOffset=(elf.buffer.length+3)&~3,symOffset=(strOffset+newStrings.length+3)&~3;
  const result=Buffer.alloc(symOffset+newSymbols.length);elf.buffer.copy(result);newStrings.copy(result,strOffset);newSymbols.copy(result,symOffset);
  const headers=result.readUInt32BE(32),entrySize=result.readUInt16BE(46);assert.equal(entrySize,40);
  for(const [section,offset,size] of [[strings,strOffset,newStrings.length],[table,symOffset,newSymbols.length]]) {
    const h=headers+section.index*entrySize;result.writeUInt32BE(offset,h+16);result.writeUInt32BE(size,h+20);
  }
  return result;
}
module.exports.nativeFixture=nativeFixture;
