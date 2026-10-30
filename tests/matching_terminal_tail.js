'use strict';
const assert = require('assert/strict');
const fs = require('fs'), path = require('path');
const tail = require('../tools/lib/matching/terminal_tail');
const words = values => { const b = Buffer.alloc(values.length * 4); values.forEach((w,i)=>b.writeUInt32BE(w>>>0,i*4)); return b; };
const body = words([0x24020001, 0x03E00008, 0]);
const rejects = (fn, pattern) => assert.throws(fn, pattern);

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
  return {status:'pass',suite:'matching-terminal-tail',temporary:dir};
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
