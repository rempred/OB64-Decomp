'use strict';
const assert=require('assert');
const fs=require('fs');
const path=require('path');
const {comparePeControls,compareCoffControls}=require('../tools/matching_studies/late_jump_provenance');

// Fixtures are constructed independently from format fields, not copied from
// parser output or proprietary executables. No compiler or linker is invoked.
function pe(newer=false) {
  const b=Buffer.alloc(3072),nt=newer?208:192,o=nt+24;
  b.write('MZ');b.writeUInt32LE(nt,60);
  const entries=newer?[[260,100,1],[260,101,1],[258,101,1]]:[[260,100,2],[258,100,1]];
  const rotate=(v,n)=>((v<<(n%32))|(v>>>((32-n)%32)))>>>0;
  let key=128;for(let i=0;i<128;i++)if(i<60||i>=64)key=(key+rotate(b[i],i))>>>0;
  for(const [p,v,c] of entries)key=(key+rotate(p*65536+v,c))>>>0;
  b.writeUInt32LE((0x536e6144^key)>>>0,128);for(let p=132;p<144;p+=4)b.writeUInt32LE(key,p);
  for(let i=0;i<entries.length;i++){let [p,v,c]=entries[i];b.writeUInt32LE(((p*65536+v)^key)>>>0,144+i*8);b.writeUInt32LE((c^key)>>>0,148+i*8);}
  let rich=144+entries.length*8;b.write('Rich',rich);b.writeUInt32LE(key,rich+4);
  b.write('PE\0\0',nt);b.writeUInt16LE(0x14c,nt+4);b.writeUInt16LE(3,nt+6);b.writeUInt32LE(newer?2:1,nt+8);b.writeUInt16LE(224,nt+20);b.writeUInt16LE(0x102,nt+22);
  b.writeUInt16LE(0x10b,o);b.writeUInt32LE(0x1000,o+16);b.writeUInt32LE(0x400000,o+28);b.writeUInt32LE(4096,o+32);b.writeUInt32LE(512,o+36);b.writeUInt32LE(16384,o+56);b.writeUInt32LE(1024,o+60);b.writeUInt32LE(16,o+92);
  b.writeUInt32LE(0x2000,o+144);b.writeUInt32LE(56,o+148);b.writeUInt32LE(0x2000+920,o+104);b.writeUInt32LE(8,o+108);
  const secs=[['.text',512,4096,1024,0x60000020],['.rdata',1024,8192,1536,0x40000040],['.reloc',512,12288,2560,0x42000040]];
  secs.forEach(([n,size,va,off,flags],i)=>{let p=nt+248+i*40;b.write(n,p);b.writeUInt32LE(size,p+8);b.writeUInt32LE(va,p+12);b.writeUInt32LE(size,p+16);b.writeUInt32LE(off,p+20);b.writeUInt32LE(flags,p+36);});
  b[1024]=0xc3;b[2560]=0x31;b[1536+900]=0x44;
  for(let i=0;i<2;i++){let p=1536+i*28,offset=i?800:64;b.writeUInt32LE(newer?2:1,p+4);b.writeUInt32LE(i?16:13,p+12);b.writeUInt32LE(i?36:732,p+16);b.writeUInt32LE(8192+offset,p+20);b.writeUInt32LE(1536+offset,p+24);}
  b.writeUInt32LE(32,2336);b.fill(newer?0xbb:0xaa,2340,2372);return b;
}
function coff(newer=false) {
  const build=newer?101:100,objpath=Buffer.from((newer?'C:\\longer\\jump.obj':'C:\\jump.obj')+'\0');
  const obj=Buffer.alloc(8+objpath.length);obj.writeUInt16LE(obj.length-2);obj.writeUInt16LE(0x1101,2);objpath.copy(obj,8);
  const version=Buffer.from('Microsoft (R) Optimizing Compiler\0'),compile=Buffer.alloc(26+version.length);compile.writeUInt16LE(compile.length-2);compile.writeUInt16LE(0x113c,2);compile.writeUInt32LE(0x2200,4);compile.writeUInt16LE(7,8);compile.writeUInt16LE(19,10);compile.writeUInt16LE(51,12);compile.writeUInt16LE(build,14);compile.writeUInt16LE(19,18);compile.writeUInt16LE(51,20);compile.writeUInt16LE(build,22);version.copy(compile,26);
  const n=obj.length+compile.length,debug=Buffer.alloc(12+Math.ceil(n/4)*4);debug.writeUInt32LE(4);debug.writeUInt32LE(0xf1,4);debug.writeUInt32LE(n,8);obj.copy(debug,12);compile.copy(debug,12+obj.length);
  const chk=Buffer.alloc(40);chk.fill(1,0,8);chk.fill(newer?3:2,8,16);chk.fill(4,16,24);
  const data=[Buffer.from('/DEFAULTLIB:test '),debug,Buffer.from([0xe8,0,0,0,0,0xc3]),Buffer.alloc(0),chk];
  const sizes=data.map(x=>x.length);sizes[3]=28;
  const names=['.drectve','.debug$S','.text$mn','.bss','.chks64'],flags=[0x100a00,0x42100040,0x60500020,0xc0300080,0xa00];
  const nc=13,len=220+data.reduce((x,y)=>x+y.length,0)+10+nc*18+4,b=Buffer.alloc(len);b.writeUInt16LE(0x14c);b.writeUInt16LE(5,2);b.writeUInt32LE(newer?2:1,4);b.writeUInt32LE(nc,12);
  let next=220;for(let i=0;i<5;i++){let p=20+i*40;b.write(names[i],p);b.writeUInt32LE(sizes[i],p+16);b.writeUInt32LE(flags[i],p+36);if(i!==3){b.writeUInt32LE(next,p+20);data[i].copy(b,next);next+=data[i].length;}if(i===2){b.writeUInt32LE(next,p+24);b.writeUInt16LE(1,p+32);b.writeUInt32LE(1,next);b.writeUInt32LE(11,next+4);b.writeUInt16LE(6,next+8);next+=10;}}
  b.writeUInt32LE(next,8);let sp=next;function sym(n,value,sec,storage,aux=0){b.write(n,next);b.writeUInt32LE(value>>>0,next+8);b.writeInt16LE(sec,next+12);b[next+16]=storage;b[next+17]=aux;next+=18;}
  sym('@comp.id',0x01040000+build,-1,3);for(let i=0;i<5;i++){sym(names[i],0,i+1,3,1);b.writeUInt32LE(sizes[i],next);b.writeUInt16LE(i===2?1:0,next+4);next+=18;}sym('func',0,3,2);sym('datum',0,4,2);assert.equal(next,sp+nc*18);b.writeUInt32LE(4,next);return b;
}
let checks=0;function rejects(label,original,make,fn){const changed=Buffer.from(original);make(changed);assert.throws(()=>fn(original,changed),/provenance:/,label);checks++;}
const p=pe(),q=pe(true),c=coff(),e=coff(true);assert(!comparePeControls(p,q).rawIdentical);assert(!compareCoffControls(c,e).rawIdentical);assert(comparePeControls(p,p).rawIdentical);assert(compareCoffControls(c,c).rawIdentical);checks+=4;
for(const [label,off] of [['code',1024],['ordinary rdata',2436],['relocation bytes',2560],['import bytes',2456],['DOS stub',80],['padding',900],['type13 payload',1600]])rejects(label,p,b=>b[off]^=1,comparePeControls);
for(const [label,off,value] of [['entrypoint',216+16,4097],['import directory',216+104,8192+921],['debug type',1536+12,16],['debug shape',1536+44,35],['raw overlap',192+248+40+20,1024],['virtual overlap',192+248+40+12,4096],['header extent',216+60,512]])rejects(label,p,b=>b.writeUInt32LE(value,off),comparePeControls);
assert.throws(()=>comparePeControls(p,Buffer.concat([p,Buffer.from([0])])),/provenance:/);checks++;
const sp=c.readUInt32LE(8),text=c.readUInt32LE(120),rp=c.readUInt32LE(124),dp=c.readUInt32LE(80),chk=c.readUInt32LE(200);
for(const [label,off] of [['COFF code',text],['COFF relocation',rp+4],['function symbol',sp+11*18+8],['data symbol',sp+12*18+8],['bss extent',156],['drectve',220],['nondebug checksum',chk+16],['C13 flags',dp+12+(c.readUInt16LE(dp+12)+2)+4]])rejects(label,c,b=>b[off]^=1,compareCoffControls);
rejects('COFF overlap',c,b=>b.writeUInt32LE(220,120),compareCoffControls);rejects('C13 kind',c,b=>b.writeUInt16LE(0x1102,dp+14),compareCoffControls);rejects('chks64 no longer linker removed',c,b=>b.writeUInt32LE(0x200,216),compareCoffControls);
assert.throws(()=>compareCoffControls(c,Buffer.concat([c,Buffer.from([0])])),/provenance:/);checks++;
// Both operands malformed must also fail, even though their bytes are identical.
const overlap=Buffer.from(p);overlap.writeUInt32LE(1024,192+248+40+20);assert.throws(()=>comparePeControls(overlap,overlap),/provenance:/);checks++;
const out=path.resolve('build/late-jump-trace/provenance-tests');fs.mkdirSync(out,{recursive:true});
const report={checks,synthetic:'passed'};
if(process.argv.includes('--actual')){const original='C:/Users/Joe/.codex/ob64-phase6-kmc-20260801/clean-d/source/mips-gcc-2.7.2/',root='build/late-jump-trace/compiler-7457FAA5607D/';const read=f=>fs.readFileSync(f);report.actual={untouchedRelink:comparePeControls(read(original+'cc1.exe'),read(root+'control-relink.exe')),rebuiltExecutable:comparePeControls(read(original+'cc1.exe'),read(root+'cc1.exe')),rebuiltObject:compareCoffControls(read(root+'control-original-jump.obj'),read(root+'jump.obj'))};}
fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2)+'\n');console.log(`late_jump_provenance: ${checks} checks passed${report.actual?', three actual control comparisons passed':''}`);
