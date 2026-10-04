'use strict';

// Diagnostic host-control comparisons only. This module does not establish the
// pinned compiler identity and must not be used by matching acceptance tools.
const crypto = require('crypto');
function need(ok, why) { if (!ok) throw new Error(`provenance: ${why}`); }
function eq(a, b, why) { need(a.equals(b), why); }
function sha(b) { return crypto.createHash('sha256').update(b).digest('hex').toUpperCase(); }
function bounded(b, p, n) { need(Number.isSafeInteger(p) && Number.isSafeInteger(n) && p >= 0 && n >= 0 && p + n <= b.length, 'out-of-range field'); return b.subarray(p, p + n); }
function u32(b, p) { bounded(b, p, 4); return b.readUInt32LE(p); }
function u16(b, p) { bounded(b, p, 2); return b.readUInt16LE(p); }
function zeros(b, why) { need(b.every(x => x === 0), why); }
function name(b) { const i = b.indexOf(0); if (i >= 0) zeros(b.subarray(i), 'nonzero name suffix'); return b.subarray(0, i < 0 ? b.length : i).toString('ascii'); }
function account(b) {
  need(Buffer.isBuffer(b), 'Buffer required'); const ranges = [];
  return { take(p, n, label) { bounded(b, p, n); if (n) { need(!ranges.some(r => p < r.p + r.n && r.p < p + n), `overlapping ${label}`); ranges.push({p,n,label}); } return b.subarray(p,p+n); },
    finish(allowZeroGaps = false) { ranges.sort((a,c) => a.p-c.p); let p=0; for(const r of ranges) { if(r.p!==p) { need(allowZeroGaps, `unaccounted bytes at ${p}`); zeros(b.subarray(p,r.p),'nonzero padding'); } p=r.p+r.n; } need(p===b.length,'trailing/unaccounted bytes'); } };
}
function result(a,b,differences,facts) { return {schemaVersion:1, diagnosticOnly:true, originalSha256:sha(a), controlSha256:sha(b), rawIdentical:a.equals(b), differences, facts}; }
function change(d,field,a,b) { if(JSON.stringify(a)!==JSON.stringify(b)) d.push({field,original:a,control:b}); }
function rich(b, nt) {
  // This deliberately supports only the observed DOS stub / Rich layout.
  need(nt>=160 && nt%16===0,'unsupported PE header position');
  const p=b.indexOf(Buffer.from('Rich'),128); need(p>=144 && p+8<=nt && (p-144)%8===0,'Rich shape');
  const key=u32(b,p+4); need((u32(b,128)^key)>>>0 === 0x536e6144,'Rich DanS signature');
  for(let x=132;x<144;x+=4) need(u32(b,x)===key,'Rich reserved words');
  zeros(b.subarray(p+8,nt),'Rich tail padding');
  const entries=[]; const seen=new Set();
  for(let x=144;x<p;x+=8) { const id=(u32(b,x)^key)>>>0,count=(u32(b,x+4)^key)>>>0; need(count>0&&!seen.has(id),'Rich duplicate/empty producer'); seen.add(id); entries.push({product:id>>>16,build:id&65535,count}); }
  const rol=(v,n)=>((v<<(n&31))|(v>>>((32-n)&31)))>>>0;
  let sum=128; for(let x=0;x<128;x++) if(x<60||x>=64) sum=(sum+rol(b[x],x))>>>0;
  for(const e of entries) sum=(sum+rol(((e.product<<16)|e.build)>>>0,e.count))>>>0;
  need(sum===key,'Rich checksum'); return {entries,key};
}
function parsePe(b) {
  const a=account(b); need(b.length>=512&&b.toString('ascii',0,2)==='MZ','PE DOS header'); const nt=u32(b,60),r=rich(b,nt);
  a.take(0,nt,'DOS/Rich'); eq(a.take(nt,4,'PE signature'),Buffer.from([80,69,0,0]),'PE signature');
  const h=a.take(nt+4,20,'COFF header'); need(u16(h,0)===0x14c&&u32(h,8)===0&&u32(h,12)===0&&u16(h,16)===224,'unsupported PE COFF header');
  const count=u16(h,2); need(count>0&&count<32,'PE section count'); const opt=a.take(nt+24,224,'optional header'); need(u16(opt,0)===0x10b&&u32(opt,92)===16,'PE32 optional header');
  need(u32(opt,128)===0&&u32(opt,132)===0,'certificate table unsupported');
  const sections=[],names=new Set(); const table=a.take(nt+248,count*40,'section table');
  for(let i=0;i<count;i++) { const s=table.subarray(i*40,i*40+40),nm=name(s.subarray(0,8)),size=u32(s,16),offset=u32(s,20),va=u32(s,12),virtualSize=u32(s,8);
    need(nm&&!names.has(nm)&&size>0&&offset>=u32(opt,60)&&offset%512===0&&size%512===0&&va%4096===0,'PE section layout'); names.add(nm);
    need(u32(s,24)===0&&u32(s,28)===0&&u32(s,32)===0,'PE section relocation/line tables');
    need(!sections.some(t=>va<t.va+Math.max(t.size,t.virtualSize)&&t.va<va+Math.max(size,virtualSize)),'overlapping virtual sections');
    sections.push({name:nm,size,offset,va,virtualSize,bytes:a.take(offset,size,nm)});
  }
  need(u32(opt,36)===512&&u32(opt,32)===4096&&u32(opt,60)%512===0&&nt+248+count*40<=u32(opt,60),'PE alignment/header extent');
  a.finish(true); const rva=(v,n)=>{const found=sections.filter(s=>v>=s.va&&v+n<=s.va+Math.min(s.size,s.virtualSize)); need(found.length===1,'unmapped/ambiguous RVA');return found[0].offset+v-found[0].va;};
  const debugRva=u32(opt,144),debugSize=u32(opt,148); need(debugSize===56,'unsupported debug directory shape'); const dp=rva(debugRva,debugSize),debug=[];
  for(let i=0;i<2;i++) {const p=dp+28*i,kind=u32(b,p+12),size=u32(b,p+16),offset=u32(b,p+24); need(u32(b,p)===0&&u32(b,p+8)===0&&kind===[13,16][i],'debug kind/header'); need(offset===rva(u32(b,p+20),size),'debug RVA/file disagreement'); need(offset>=dp+debugSize,'overlapping debug payload');
    const owner=sections.find(s=>offset>=s.offset&&offset+size<=s.offset+s.size); need(owner&&owner.name==='.rdata','debug payload outside rdata');
    need(u32(table,sections.indexOf(owner)*40+36)===0x40000040,'debug rdata must be read-only initialized data');
    if(i===1) {need(size===36&&u32(b,offset)===32,'REPRO payload shape'); need(offset>=debug[0].offset+debug[0].size,'overlapping debug payloads');}
    else need(size===732,'unsupported type13 payload shape');
    debug.push({p,kind,size,offset,timestamp:u32(b,p+4)});
  }
  for(let i=0;i<16;i++) {const v=u32(opt,96+8*i),n=u32(opt,100+8*i);need((v===0)===(n===0),'partial data directory');if(v&&i!==6){const p=rva(v,n);need(!debug.some(x=>p<x.offset+x.size&&x.offset<p+n)&&!(p<dp+debugSize&&dp<p+n),'directory overlaps debug metadata');}}
  return {nt,rich:r,header:h,optional:opt,table,sections,debug};
}
function comparePeControls(original,control) {
  const a=parsePe(original),b=parsePe(control),d=[]; need(original.length===control.length,'PE file length');
  eq(original.subarray(0,60),control.subarray(0,60),'DOS header changed'); eq(original.subarray(64,128),control.subarray(64,128),'DOS stub changed');
  change(d,'e_lfanew',a.nt,b.nt); change(d,'Rich',a.rich,b.rich);
  // Producer versions may split a producer into two records. Product totals stay fixed.
  const totals=r=>Object.entries(r.entries.reduce((m,e)=>(m[e.product]=(m[e.product]||0)+e.count,m),{})).sort();
  need(JSON.stringify(totals(a.rich))===JSON.stringify(totals(b.rich)),'Rich product/count totals changed');
  eq(a.header.subarray(0,4),b.header.subarray(0,4),'PE architecture/section count'); eq(a.header.subarray(8),b.header.subarray(8),'PE COFF contract'); change(d,'COFF timestamp',u32(a.header,4),u32(b.header,4));
  eq(a.optional,b.optional,'PE optional header/directories changed'); eq(a.table,b.table,'PE section table changed');
  const ac=Buffer.from(original),bc=Buffer.from(control);
  for(let i=0;i<a.debug.length;i++) { const x=a.debug[i],y=b.debug[i]; need(x.p===y.p&&x.offset===y.offset&&x.size===y.size&&x.kind===y.kind,'debug layout changed'); change(d,`debug[${i}].timestamp`,x.timestamp,y.timestamp); ac.fill(0,x.p+4,x.p+8); bc.fill(0,y.p+4,y.p+8);
    if(x.kind===16) {change(d,'REPRO sha256',original.subarray(x.offset+4,x.offset+36).toString('hex'),control.subarray(y.offset+4,y.offset+36).toString('hex')); ac.fill(0,x.offset+4,x.offset+36);bc.fill(0,y.offset+4,y.offset+36);}
  }
  for(let i=0;i<a.sections.length;i++){const s=a.sections[i];eq(ac.subarray(s.offset,s.offset+s.size),bc.subarray(s.offset,s.offset+s.size),`PE section ${s.name} contains functional/unaccounted change`);}
  return result(original,control,d,{format:'PE32-i386',allBytesAccounted:true,optionalHeaderExact:true,sectionTableExact:true,sections:a.sections.map(s=>({name:s.name,bytes:s.size})),nonMetadataSectionBytesExact:true});
}
function parseC13(b) {
  need(u32(b,0)===4&&u32(b,4)===0xf1,'unsupported C13 subsection');const n=u32(b,8);need(b.length===12+((n+3)&~3),'C13 length/padding');zeros(b.subarray(12+n),'C13 padding');
  let p=12;const records=[];while(p<12+n){const len=u16(b,p);need(len>=2&&p+2+len<=12+n,'C13 record length'); records.push(b.subarray(p,p+2+len));p+=2+len;}need(p===12+n&&records.length===2,'C13 records');
  const [obj,compile]=records; need(u16(obj,2)===0x1101&&u32(obj,4)===0,'S_OBJNAME shape');const path=obj.subarray(8);need(path.length>1&&path[path.length-1]===0&&path.subarray(0,-1).every(x=>x>=32&&x<127),'S_OBJNAME path');
  need(u16(compile,2)===0x113c&&compile.length>=27,'S_COMPILE3 shape'); const version=compile.subarray(26);need(version[version.length-1]===0&&version.subarray(0,-1).every(x=>x>=32&&x<127),'S_COMPILE3 version');
  return {path:path.subarray(0,-1).toString(),compile,frontBuild:u16(compile,14),backBuild:u16(compile,22)};
}
function parseCoff(b) {
  const a=account(b),h=a.take(0,20,'COFF header'); need(u16(h,0)===0x14c&&u16(h,16)===0&&u16(h,18)===0,'unsupported COFF');const count=u16(h,2);need(count===5,'unsupported COFF section count');const table=a.take(20,count*40,'section headers'),sections=[];
  const expected=['.drectve','.debug$S','.text$mn','.bss','.chks64'];
  for(let i=0;i<count;i++){const s=table.subarray(i*40,i*40+40),nm=name(s.subarray(0,8)),size=u32(s,16),ptr=u32(s,20),rp=u32(s,24),nr=u16(s,32);need(nm===expected[i]&&u32(s,8)===0&&u32(s,12)===0&&u32(s,28)===0&&u16(s,34)===0,'COFF section contract');
    need((nm==='.bss')===(ptr===0),'COFF raw pointer');need((nr===0)===(rp===0),'COFF relocation pointer');const bytes=ptr?a.take(ptr,size,nm):Buffer.alloc(0),relocs=nr?a.take(rp,nr*10,`${nm} relocations`):Buffer.alloc(0);sections.push({name:nm,header:s,size,ptr,rp,nr,bytes,relocs});}
  let next=20+count*40;for(const s of sections){if(s.ptr){need(s.ptr===next,'nonderived COFF section offset');next+=s.size;}if(s.rp){need(s.rp===next,'nonderived COFF relocation offset');next+=s.nr*10;}}
  const sp=u32(h,8),nc=u32(h,12);need(sp===next,'nonderived symbol offset');need(nc>0&&nc<100000,'COFF symbol count');const syms=a.take(sp,nc*18,'symbols'),strp=sp+nc*18,strsize=u32(b,strp);need(strsize>=4,'string table length');const strings=a.take(strp,strsize,'strings');a.finish();
  const symbols=[];for(let i=0;i<nc;){const s=syms.subarray(i*18,(i+1)*18),aux=s[17];need(i+1+aux<=nc,'aux symbol bounds');let nm;if(u32(s,0)===0){const off=u32(s,4);need(off>=4&&off<strings.length&&strings.indexOf(0,off)>=0,'symbol string');nm=strings.toString('ascii',off,strings.indexOf(0,off));}else nm=name(s.subarray(0,8));symbols.push({name:nm,index:i,bytes:syms.subarray(i*18,(i+1+aux)*18)});i+=1+aux;}
  for(const s of sections)for(let p=0;p<s.relocs.length;p+=10)need(u32(s.relocs,p)<s.size&&u32(s.relocs,p+4)<nc,'relocation bounds');
  const debug=parseC13(sections[1].bytes);need(sections[4].size===40&&u32(sections[4].header,36)===0xa00&&sections[4].nr===0,'chks64 must be five linker-removed checksum slots');zeros(sections[4].bytes.subarray(24),'chks64 bss/self slots');return {header:h,sections,symbols,strings,debug};
}
function compareCoffControls(original,control) {
  const a=parseCoff(original),b=parseCoff(control),d=[];eq(a.header.subarray(0,4),b.header.subarray(0,4),'COFF kind');eq(a.header.subarray(12),b.header.subarray(12),'COFF symbol count/flags');change(d,'COFF timestamp',u32(a.header,4),u32(b.header,4));change(d,'derived symbol pointer',u32(a.header,8),u32(b.header,8));eq(a.strings,b.strings,'COFF string table changed');
  for(let i=0;i<5;i++){const x=a.sections[i],y=b.sections[i];eq(x.header.subarray(0,16),y.header.subarray(0,16),'COFF section identity');eq(x.header.subarray(28),y.header.subarray(28),'COFF section flags/count');eq(x.relocs,y.relocs,`${x.name} relocations changed`);if(i!==1)need(x.size===y.size,`${x.name} extent changed`);change(d,`${x.name} derived offsets`,[x.ptr,x.rp],[y.ptr,y.rp]);
    if(i===1){need(x.nr===0,'debug relocations unsupported');change(d,'C13 object path',a.debug.path,b.debug.path);change(d,'C13 compiler builds',[a.debug.frontBuild,a.debug.backBuild],[b.debug.frontBuild,b.debug.backBuild]);const ac=Buffer.from(a.debug.compile),bc=Buffer.from(b.debug.compile);ac.fill(0,14,16);ac.fill(0,22,24);bc.fill(0,14,16);bc.fill(0,22,24);eq(ac,bc,'S_COMPILE3 non-build change');change(d,'derived C13 section length',x.size,y.size);}
    else if(i===4){eq(x.bytes.subarray(0,8),y.bytes.subarray(0,8),'drectve checksum changed');eq(x.bytes.subarray(16),y.bytes.subarray(16),'nondebug checksum changed');if(a.sections[1].bytes.equals(b.sections[1].bytes))eq(x.bytes,y.bytes,'checksum changed without debug metadata change');change(d,'linker-removed chks64 debug checksum',x.bytes.subarray(8,16).toString('hex'),y.bytes.subarray(8,16).toString('hex'));}
    else eq(x.bytes,y.bytes,`${x.name} bytes changed`);
  }
  need(a.symbols.length===b.symbols.length,'COFF symbol shape');let comp=0,debugAux=0;for(let i=0;i<a.symbols.length;i++){const x=a.symbols[i],y=b.symbols[i];need(x.name===y.name&&x.index===y.index,'COFF symbol identity');const ac=Buffer.from(x.bytes),bc=Buffer.from(y.bytes);
    if(x.name==='@comp.id'){comp++;need(ac.length===18&&u16(ac,12)===65535&&u16(bc,12)===65535&&ac[16]===3&&bc[16]===3,'comp.id shape');need(u16(ac,8)===a.debug.backBuild&&u16(bc,8)===b.debug.backBuild,'comp.id/build disagreement');change(d,'@comp.id build',u16(ac,8),u16(bc,8));ac.fill(0,8,10);bc.fill(0,8,10);}
    if(x.name==='.debug$S'){debugAux++;need(ac.length===36&&u16(ac,12)===2&&u16(bc,12)===2&&ac[16]===3&&bc[16]===3&&u32(ac,18)===a.sections[1].size&&u32(bc,18)===b.sections[1].size,'debug section auxiliary shape');ac.fill(0,18,22);bc.fill(0,18,22);}
    eq(ac,bc,`COFF symbol ${x.name} changed`);
  }need(comp===1&&debugAux===1,'metadata symbols not unique');
  return result(original,control,d,{format:'COFF-i386',allBytesAccounted:true,codeDataRelocationsExact:true,functionDataSymbolsExact:true,bssExtentExact:true,linkerRemovedChecksums:true});
}
module.exports={comparePeControls,compareCoffControls,parsePe,parseCoff};
