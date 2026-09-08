'use strict';
// Bounded W8 research study, not a general reducer or matching acceptance path.
const fs=require('fs'),path=require('path'),cp=require('child_process'),assert=require('assert');
const {ROOT,sha256File,sha256Buffer}=require('../lib/phase7_conventional');
const policy=require('../lib/source_policy');
const ARCHIVE='docs/archive/matching-c-candidates/2026-09-08-func_001F3C00-';
const INPUTS={left:ARCHIVE+'7e434ec440.c',right:ARCHIVE+'cd8cffb3cd.c',short:ARCHIVE+'7fa66212d4.c'};
const COMPILERS={pinned:['build/combat-db10-allocation-trace-r1/compiler/cc1.exe','F3F1C99A322F5B3D8C108C2A44AF1D6D084DD27575C5D60BF0F0D33FFF34B1C6'],trace:['build/combat-db10-allocation-trace-r1/compiler/cc1-trace.exe','457429BD4F33D7E841961AA1E76F238BB58117B8D0AEB7B1CA14908D2B7113A6']};
const FLAGS=['-quiet','-O2','-meb','-mips3','-mgp32','-mfp32','-G','0','-fno-PIC','-mno-abicalls','-fno-builtin','-funsigned-char'];
const CORE_START='        strip = (short)capacity;',CORE_END='rows_done:\n        PAIR(0xD8380002, 0x40);';
const normalized=text=>text.replace(/\r\n/g,'\n');
function region(source){const start=source.indexOf(CORE_START),end=source.indexOf(CORE_END);assert(start>=0&&end>start);assert.equal(source.indexOf(CORE_START,start+1),-1);return source.slice(start,end+CORE_END.length);}
function remove(source,start,end){const a=source.indexOf(start),b=source.indexOf(end,a+start.length);assert(a>=0&&b>a,'deletion anchors missing');assert.equal(source.indexOf(start,a+1),-1,'ambiguous deletion');return source.slice(0,a)+source.slice(b);}
const DELETIONS=[
 ['matrix-setup','    if (setup) {','    PAIR(0xDE000000, (u32)D_801CE930);'],
 ['leading-packets','    PAIR(0xE7000000, 0);','    PAIR(0xDE000000, (u32)D_801CE930);'],
 ['optional-preload','    if (optional) {\n        int counter','    if (WORD(actor, 0xA0)) {'],
 ['color-mask','    if (firstId == 0x100) colorMask','    blend.red = blend.green = blend.blue = 0.0f;'],
 ['per-item-color','        if (!WORD(actor, 0xA0)) {','        PAIR(0xFA000000,'],
 ['scale-adjustment','        if (func_00043d1c(','        accumulated = 0;'],
 ['scale-command','        guScale(MATRIX_CURSOR,','        strip = (short)capacity;'],
 ['final-packets','    PAIR(0xD8380002, 0x40);\n    PAIR(0xE7000000, 0);','    return 0;']
];
function nodes(text){return normalized(text).split(/\n(?=\()/).filter(x=>/^\((?:insn|jump_insn|call_insn)\b/.test(x));}
function iorUses(node,pseudo){
 const reference=new RegExp('\\(reg(?:/[^: ]+)?:SI '+pseudo+'\\)');
 for(let start=node.indexOf('(ior:SI');start>=0;start=node.indexOf('(ior:SI',start+1)){
  let depth=0,end=start;
  do{if(node[end]==='(')depth++;if(node[end]===')')depth--;end++;}while(end<node.length&&depth>0);
  if(depth===0&&reference.test(node.slice(start,end)))return true;
 }
 return false;
}
function endpoint(initial){
 const ns=nodes(initial),masked=new Map();
 for(const n of ns){const m=n.match(/\(set \(reg\/v:SI (\d+)\)\s+\(and:SI \(reg[^)]*\)\s+\(const_int 4095\)\)\)/);if(m)masked.set(m[1],(masked.get(m[1])||0)+1);}
 const candidates=[];
 for(const [pseudo,count] of masked){if(count!==2)continue;const copy=ns.filter(n=>new RegExp('\\(set \\(reg/v:SI (\\d+)\\)\\s+\\(reg/v:SI '+pseudo+'\\)\\)').test(n));if(copy.length!==1)continue;
  const copied=copy[0].match(/\(set \(reg\/v:SI (\d+)\)/)[1];
  const consumers=ns.filter(n=>iorUses(n,pseudo));
  const copiedConsumers=ns.filter(n=>iorUses(n,copied));
  if(consumers.length&&copiedConsumers.length)candidates.push({pseudo:Number(pseudo),copied:Number(copied),maskAssignments:count,copy:copy[0],consumers,copiedConsumers});
 }
 return candidates.length===1?{unique:true,...candidates[0]}:{unique:false,candidates};
}
function allocation(initial,lreg,stderr,assembly){
 const mapped=endpoint(initial);if(!mapped.unique)return {endpoint:mapped,home:null,accesses:[],realConsumers:false};
 const homes=[];let pending=null;
 for(const line of normalized(stderr).split('\n')){
  if(line.startsWith('HOME ')){assert(!pending);pending={event:line,pseudo:Number(line.match(/pseudo=(\d+)/)[1])};}
  else if(pending){const off=line.match(/\(const_int (\d+)\)/);if(off)pending.offset=Number(off[1]);if(line.startsWith('HOME_RESULT ')){assert.equal(Number(line.match(/pseudo=(\d+)/)[1]),pending.pseudo);assert(Number.isInteger(pending.offset));homes.push(pending);pending=null;}}
 }
 assert(!pending);const selected=homes.filter(h=>h.pseudo===mapped.pseudo);assert(selected.length<=1);
 const home=selected[0]||null;
 const consumers=nodes(lreg).filter(n=>iorUses(n,mapped.pseudo));
 let accesses=[];
 if(home){assert.equal(homes.filter(h=>h.offset===home.offset).length,1,'ambiguous home offset');accesses=normalized(assembly).split('\n').filter(line=>new RegExp('^\\s*(?:lw|sw)\\s+[^,]+,\\s*'+home.offset+'\\(\\$sp\\)').test(line));}
 return {endpoint:mapped,home,accesses,realConsumers:consumers.length>0,lregConsumers:consumers,homeCount:homes.length};
}
function predicate(left,right){return left.allocation.endpoint.unique&&right.allocation.endpoint.unique&&left.allocation.realConsumers&&right.allocation.realConsumers&&!!left.allocation.home&&!right.allocation.home&&left.allocation.accesses.some(x=>/^\s*lw\s/.test(x))&&left.allocation.accesses.some(x=>/^\s*sw\s/.test(x));}
function main(){
 const started=Date.now(),destination=process.argv[2]||'build/w8-paired-reduction-r1/run';
 const root=path.resolve(ROOT,destination),rel=path.relative(path.join(ROOT,'build/w8-paired-reduction-r1'),root);assert(rel&&!rel.startsWith('..')&&!path.isAbsolute(rel),'use a new child of ignored study root');assert(!fs.existsSync(root),'preserve previous evidence; choose a fresh directory');
 for(const [file,hash] of Object.values(COMPILERS))assert.equal(sha256File(path.join(ROOT,file)),hash);
 const expectedInputs={};
 const originals=Object.fromEntries(Object.entries(INPUTS).map(([key,file])=>{
  const metadata=JSON.parse(fs.readFileSync(path.join(ROOT,'docs/dossiers/func_001F3C00-'+file.slice(-12,-2)+'.observation.json')));
  assert.equal(sha256File(path.join(ROOT,file)),metadata.authored.expected.sourceSha256);
  expectedInputs[key]=metadata.authored.expected;
  const source=fs.readFileSync(path.join(ROOT,file),'utf8');assert.equal(source,normalized(source),'study requires the archived LF byte form');
  return [key,source];
 }));
 const preserved=JSON.parse(fs.readFileSync(path.join(ROOT,'build/combat-draw-wave8-r8/terminal-current-inputs.json'))),protectedInputs=[...preserved.targets,...preserved.otherInputs];
 const authenticate=()=>{for(const r of protectedInputs)assert.equal(sha256File(path.join(ROOT,r.path)),r.sha256);};authenticate();
 const core={left:region(originals.left),right:region(originals.right)};
 fs.mkdirSync(root,{recursive:true});const results=[],preparationMs=Date.now()-started;let compilerMs=0;
 function compile(name,source,side){
  if(side)assert.equal(region(source),core[side]);const dir=path.join(root,name);fs.mkdirSync(dir);const authored=path.join(dir,'authored.c');fs.writeFileSync(authored,source);
  const classification=policy.classifySource(authored);assert.equal(classification.class,'PURE_C',classification.error);
  assert.deepEqual(classification.dependencies,expectedInputs.left.dependencies,'preserved header closure changed');
  const originalKey=Object.keys(originals).find(k=>source===originals[k]);if(originalKey)assert.equal(classification.compilationInput.sha256,expectedInputs[originalKey].expandedSha256);
  const input=policy.compilationInputBytes(classification);fs.writeFileSync(path.join(dir,'candidate.c'),input);
  const commands=[];for(const [label,[file,hash]] of Object.entries(COMPILERS)) {assert.equal(sha256File(path.join(ROOT,file)),hash);const args=[...FLAGS,...(label==='trace'?['-da']:[]),'-o',label+'.s','candidate.c'],begin=Date.now();const r=cp.spawnSync(path.join(ROOT,file),args,{cwd:dir,encoding:'utf8',windowsHide:true,maxBuffer:64*1024*1024});const wallMs=Date.now()-begin;compilerMs+=wallMs;commands.push({label,sha256:hash,args,status:r.status,wallMs});fs.writeFileSync(path.join(dir,label+'.stderr'),r.stderr||'');assert.equal(r.status,0,r.stderr);}
  policy.verifyClassificationInputs(classification);const asm=fs.readFileSync(path.join(dir,'pinned.s'),'utf8'),trace=fs.readFileSync(path.join(dir,'trace.s'),'utf8');assert.equal(asm,trace.replace(/ # -funsigned-char -da -o(\r?\n)/,' # -funsigned-char -o$1'),'tracer changes emission');
  const a=allocation(fs.readFileSync(path.join(dir,'candidate.c.rtl'),'utf8'),fs.readFileSync(path.join(dir,'candidate.c.lreg'),'utf8'),fs.readFileSync(path.join(dir,'trace.stderr'),'utf8'),asm);
  const result={name,source:path.relative(ROOT,authored).replace(/\\/g,'/'),sourceSha256:sha256File(authored),classification,coreSha256:side?sha256Buffer(Buffer.from(region(source))):null,pinnedSha256:sha256Buffer(Buffer.from(asm)),diagnosticAgreement:true,frame:Number(asm.match(/\.frame\s+\$sp,(\d+),\$31/)[1]),allocation:a,commands};fs.writeFileSync(path.join(dir,'analysis.json'),JSON.stringify(result,null,2));return result;
 }
 const baseline={left:compile('baseline-left',originals.left,'left'),right:compile('baseline-right',originals.right,'right')};assert(predicate(baseline.left,baseline.right),'original effect missing');
 const short=compile('negative-short',originals.short);assert(!predicate(baseline.left,baseline.left));assert(!predicate(baseline.right,baseline.left));assert(!short.allocation.endpoint.unique);assert(!predicate(baseline.left,short));
 let selected={left:originals.left,right:originals.right},selectedResults=baseline;const accepted=[];
 for(const [name,start,end] of DELETIONS){
  // Leading packets are exactly four consecutive statements, independent of a
  // prior matrix deletion being selected or rejected.
  const apply=source=>name==='leading-packets'?source.replace('    PAIR(0xE7000000, 0);\n    PAIR(0xE7000000, 0);\n    PAIR(0xE3000A01, 0x00100000);\n    PAIR(0xE7000000, 0);\n',''):remove(source,start,end);
  const pair={left:apply(selected.left),right:apply(selected.right)};assert(pair.left!==selected.left&&pair.right!==selected.right);const measured={left:compile(name+'-left',pair.left,'left'),right:compile(name+'-right',pair.right,'right')};const retained=predicate(measured.left,measured.right);const row={name,retained,...measured};assert(row.left.source&&row.right.source&&!row.left.left&&!row.right.right,'flat pair report required');results.push(row);if(retained){selected=pair;selectedResults=measured;accepted.push(name);}console.log(JSON.stringify({name,retained,left:{frame:measured.left.frame,pseudo:measured.left.allocation.endpoint.pseudo,home:measured.left.allocation.home?.offset},right:{frame:measured.right.frame,pseudo:measured.right.allocation.endpoint.pseudo,home:measured.right.allocation.home?.offset}}));
 }
 const final={left:compile('restored-left',originals.left,'left'),right:compile('restored-right',originals.right,'right')};assert(predicate(final.left,final.right));for(const side of ['left','right'])assert.equal(final[side].pinnedSha256,baseline[side].pinnedSha256);authenticate();
 const report={schemaVersion:1,inputs:INPUTS,preparationMs,compilerMs,wallMs:Date.now()-started,coreHashes:Object.fromEntries(Object.entries(core).map(([k,v])=>[k,sha256Buffer(Buffer.from(v))])),baseline,short,negativeControls:{samePair:false,reversed:false,short:false},results,accepted,selected:selectedResults,restored:final,protectedInputsUnchanged:protectedInputs.length};fs.writeFileSync(path.join(root,'study.json'),JSON.stringify(report,null,2));console.log(JSON.stringify({accepted,preparationMs,compilerMs,wallMs:report.wallMs}));
}
if(require.main===module)main();
module.exports={endpoint,allocation,predicate,region};
