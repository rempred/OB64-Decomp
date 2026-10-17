'use strict';
const fs = require('fs'), path = require('path');
const { ROOT, fail, sha256Buffer: hash, sha256File, parseElf32BigEndian: parse } = require('./phase7_conventional');
const { assembleWordAsmText } = require('./word_asm');
const bindings = new WeakMap(), projections = new WeakMap(), splits = new WeakMap(), groupTargets = new WeakMap(), groupProofs = new WeakMap(), groupIdentities = new WeakMap();
const bad = message => fail('retained literal references: ' + message);
const same = (a,b) => JSON.stringify(a) === JSON.stringify(b);
const digest = value => hash(Buffer.from(JSON.stringify(value)));
const frozen = value => { if(value && typeof value==='object'){Object.values(value).forEach(frozen);Object.freeze(value);} return value; };
function normalize(value) {
  if (value === undefined) return null;
  const keys=['schemaVersion','compilerSection','bytes','alignment','expectedPayloadSha256','ownerRowIndex','romStart'];
  if (!value || !same(Object.keys(value).sort(),keys.sort()) || ![1,2].includes(value.schemaVersion) || value.compilerSection!=='.rodata'
      || !(value.schemaVersion===2?value.bytes===32:[16,64].includes(value.bytes)) || value.alignment!==16 || !/^[A-F0-9]{64}$/.test(value.expectedPayloadSha256)
      || !Number.isSafeInteger(value.ownerRowIndex) || value.ownerRowIndex<0 || !Number.isSafeInteger(value.romStart)
      || value.romStart<0 || value.romStart%16) bad('contract schema');
  return {...value};
}
function bind(target, allTargets, model, rom, readSource) {
  const c=normalize(target.retainedLiteralReferences); if(!c)return;
  if((c.bytes!==16||c.schemaVersion!==1)&&!target.literalGroup)bad('standalone literal size');
  if(c.schemaVersion===2&&!require('./compilation_groups').literalRun(target.literalGroup))bad('literal run mode required');
  if(target.literalGroup&&groupTargets.get(target.literalGroup)!==target)bad('literal group binding authority');
  if(rom.length!==model.config.rom.bytes||hash(rom)!==model.config.rom.sha256)bad('ROM identity');
  if(target.compilationGroup || target.compilationGroupId || target.auxiliaryProjection || target.atomicText
      || target.auxiliarySections.length || target.row.retainedPadding)bad('incompatible producer');
  const row=model.rows.find(r=>r.index===c.ownerRowIndex),end=c.romStart+c.bytes;
  if(!row?.part || row.inputKind!=='tracked-assembly' || row.slices.length!==1)bad('retained row');
  const s=row.slices[0],slabs=model.nonDescriptorLoadSlabs.filter(s=>s.kind==='boot-initialized-data'
    && c.romStart>=s.romStart && end<=s.romEndExclusive);
  if(slabs.length!==1 || s.loadSlabId!==slabs[0].id || s.placementKind!=='non-descriptor-load-slab'
      || s.executable || c.romStart<row.romStart || end>row.romEndExclusive)bad('unique boot initial image');
  const slab=slabs[0],base=s.vramStart+c.romStart-s.romStart;
  if(base!==slab.vramStart+c.romStart-slab.romStart || base%16 || end>rom.length)bad('literal placement');
  const source=readSource(row.part.file,row.part.sha256),original=assembleWordAsmText(source).bytes;
  if(hash(Buffer.from(source))!==row.part.sha256 || original.length!==row.bytes
      || !original.equals(rom.subarray(row.romStart,row.romEndExclusive)))bad('retained original source');
  const payload=rom.subarray(c.romStart,end);if(hash(payload)!==c.expectedPayloadSha256)bad('payload hash');
  const aux=allTargets.flatMap(t=>t.auxiliarySections||[]).filter(a=>a.outputSection===s.sectionName);
  if(allTargets.some(t=>t.textOwners.some(o=>o.rowIndex===row.index)))bad('text-owned storage');
  const ranges=[];
  for(const a of aux){
    if(c.romStart<a.romEndNumber&&end>a.romStartNumber)bad('C-owned literal interval');
    for(const r of [a.preservedPrefix,a.preservedTail,a.preservedInteriorBefore].filter(Boolean)){
      if(c.romStart>=r.romStartNumber&&end<=r.romEndNumber)ranges.push(r);
    }
  }
  if(aux.length&&ranges.length!==1)bad('unique retained partition');
  const partition=aux.length?ranges[0]:{inputSection:s.sectionName,romStartNumber:row.romStart,romEndNumber:row.romEndExclusive,
    vramStartNumber:s.vramStart,vramEndNumber:s.vramEndExclusive,expectedSha256:hash(original),ownerOriginalAssembly:row.part.file,ownerOriginalAssemblySha256:row.part.sha256};
  if(partition.ownerOriginalAssembly!==row.part.file || partition.ownerOriginalAssemblySha256!==row.part.sha256
      || partition.vramStartNumber+c.romStart-partition.romStartNumber!==base
      || hash(rom.subarray(partition.romStartNumber,partition.romEndNumber))!==partition.expectedSha256)bad('retained partition identity');
  const evidence=frozen({contract:c,base,ownerSource:row.part.file,ownerHash:row.part.sha256,partition:structuredClone(partition),
    modelIdentity:digest({slab,row,aux}),payloadHash:hash(payload),sourceHash:target.sourceSha256});
  bindings.set(target,{evidence,contract:digest(c),rom,model,allTargets,readSource});
  target.retainedLiteralBinding=structuredClone(evidence);
}
function binding(target){
  const b=bindings.get(target);if(!b||b.contract!==digest(target.retainedLiteralReferences)
    || !same(b.evidence,target.retainedLiteralBinding)||b.evidence.sourceHash!==target.sourceSha256)bad('binding authority');
  if(require('./compilation_groups').literalRun(target.literalGroup))require('./compilation_groups').authenticateLiteralRun(target.literalGroup);
  const c=b.evidence.contract,row=b.model.rows.find(r=>r.index===c.ownerRowIndex),slab=b.model.nonDescriptorLoadSlabs.find(s=>s.id===row?.slices[0]?.loadSlabId),aux=b.allTargets.flatMap(t=>t.auxiliarySections||[]).filter(a=>a.outputSection===row?.slices[0]?.sectionName);
  if(target.model!==b.model||digest({slab,row,aux})!==b.evidence.modelIdentity||hash(b.rom)!==b.model.config.rom.sha256
    ||sha256File(path.join(ROOT,b.evidence.ownerSource))!==b.evidence.ownerHash
    ||sha256File(path.join(ROOT,target.source))!==b.evidence.sourceHash
    ||b.allTargets.some(t=>t.textOwners.some(o=>o.rowIndex===row.index)))bad('changed binding inputs');
  return b;
}
function census(input){const e=parse(input);return {sha256:hash(input),bytes:input.length,header:e.header,sections:e.sections,symbols:e.symbols,
  sectionPayloads:e.sections.map(s=>({index:s.index,name:s.name,offset:s.offset,bytes:s.size,sha256:s.type===8?null:hash(input.subarray(s.offset,s.offset+s.size))})),
  relocationSections:e.sections.filter(s=>[4,9].includes(s.type)).map(s=>({index:s.index,link:s.link,info:s.info,entrySize:s.entrySize,bytes:s.size,payloadHex:input.subarray(s.offset,s.offset+s.size).toString('hex')}))};}
function references(input,e,text,anchor){
  const records=[];
  for(const r of e.sections.filter(s=>s.type===9||s.type===4)){
    if(r.type!==9||r.entrySize!==8||r.size%8)bad('REL census');
    for(let i=0;i<r.size;i+=8){const at=r.offset+i,place=input.readUInt32BE(at),info=input.readUInt32BE(at+4);
      if((info>>>8)!==anchor.symbolIndex||r.link!==anchor.symbolTableIndex)continue;
      if(r.info!==text.index||place%4||place+4>text.size||![5,6].includes(info&255))bad('literal reference owner/type');
      records.push({place,info,type:info&255,relocationSectionIndex:r.index,recordOffset:i,word:input.readUInt32BE(text.offset+place)});
    }
  }
  if(!records.length||new Set(records.map(r=>r.place)).size!==records.length)bad('literal reference census');return records;
}
function project(input,target){
  const b=binding(target),c=b.evidence.contract,e=parse(input),r=e.sections.filter(s=>s.name===c.compilerSection);
  if(r.length!==1||r[0].type!==1||r[0].flags!==1||r[0].size!==c.bytes||r[0].alignment!==16)bad('native literal section');
  const literal=r[0],anchors=e.symbols.filter(s=>s.sectionIndex===literal.index);
  if(anchors.length!==1)bad('named/extra literal symbol');const a=anchors[0];
  if(a.name!==''||a.symbolType!==3||a.binding!==0||a.value||a.size||a.visibility)bad('native section anchor');
  if(e.sections.some(s=>s.size&&s.index!==literal.index&&s.name!=='.text'&&s.name!==target.sectionName
    &&!['.rel.text','.rel'+target.sectionName,'.reginfo','.note','.comment','.shstrtab','.symtab','.strtab'].includes(s.name)))bad('extra native storage');
  if(e.sections.some(s=>(s.type===9||s.type===4)&&s.info===literal.index))bad('relocated literal storage');
  const payload=input.subarray(literal.offset,literal.offset+c.bytes);if(hash(payload)!==c.expectedPayloadSha256
    ||!payload.equals(b.rom.subarray(c.romStart,c.romStart+c.bytes)))bad('literal payload');
  const texts=e.sections.filter(s=>s.name===(target.nativeTextTail||target.literalGroup?'.text':target.sectionName));if(texts.length!==1)bad('native text');const text=texts[0];
  const refs=references(input,e,text,a),groups=[],coverage=Buffer.alloc(c.bytes);
  for(let i=0;i<refs.length;){const hi=refs[i++],lo=refs[i++];
    if(!lo||hi.type!==5||lo.type!==6||(hi.word>>>16)!==0x3c01||lo.place!==hi.place+4||(lo.word>>>21&31)!==1)bad('literal load grammar');
    const op=lo.word>>>26,los=[lo];if(op===35){const next=refs[i++];if(!next||next.type!==6||next.place!==hi.place+8||next.word>>>26!==35
      ||(next.word>>>21&31)!==1||(next.word>>>16&31)!==(lo.word>>>16&31)+1||(next.word&65535)!==(lo.word&65535)+4)bad('double-word load grammar');los.push(next)}else if(op!==53)bad('unsupported literal load');
    if(los.some((lo,j)=>lo.relocationSectionIndex!==hi.relocationSectionIndex||lo.recordOffset!==hi.recordOffset+8*(j+1)))bad('interleaved literal REL set');
    const addends=los.map(l=>(((hi.word&65535)<<16)+(l.word<<16>>16))>>>0),start=addends[0];
    if(start%8||start+8>c.bytes||coverage.subarray(start,start+8).some(v=>v))bad('literal coverage/alignment');coverage.fill(1,start,start+8);
    const highs=new Set();for(let j=0;j<los.length;j++){const l=los[j],addend=addends[j],at=target.romStartNumber;
      const oh=b.rom.readUInt32BE(at+hi.place),ol=b.rom.readUInt32BE(at+l.place),address=(((oh&65535)<<16)+(ol<<16>>16))>>>0;
      if((oh>>>16)!==(hi.word>>>16)||(ol>>>16)!==(l.word>>>16)||address!==b.evidence.base+addend)bad('original literal address');
      highs.add(((address+0x8000)>>>16)&65535);
    }
    if(highs.size!==1)bad('shared-HI carry straddle');groups.push({hi:hi.place,los:los.map(l=>l.place),anchorIndex:a.symbolIndex,records:[hi,...los]});
  }
  if(coverage.some(v=>v!==1))bad('unexplained literal bytes');
  const output=Buffer.from(input),at=e.sections[a.symbolTableIndex].offset+a.symbolIndex*16;
  output.writeUInt32BE(b.evidence.base,at+4);output[at+12]=0;output.writeUInt16BE(0xfff1,at+14);output.fill(0,literal.headerOffset,literal.headerOffset+40);
  const run=require('./compilation_groups').literalRun(target.literalGroup);
  if(run){const g=target.literalGroup;require('./compilation_groups').authenticateLiteralRun(g);if(text.size!==g.text.bytes||hash(input.subarray(text.offset,text.offset+text.size))!==g.text.sha256||!input.subarray(text.offset+g.tail.offset,text.offset+text.size).equals(Buffer.alloc(4)))bad('literal run native text');require('./compilation_groups').literalRunBranchCensus(input.subarray(text.offset,text.offset+text.size),g);output.writeUInt32BE(g.tail.offset,text.headerOffset+20);output.writeUInt32BE(4,text.headerOffset+32);runNative.set(g,Buffer.from(input));}
  const proof=frozen({binding:b.evidence,raw:census(input),projected:census(output),anchorIndex:a.symbolIndex,anchorTable:a.symbolTableIndex,textHash:hash(input.subarray(text.offset,text.offset+(run?target.literalGroup.tail.offset:text.size))),groups});
  const token=Object.freeze({});projections.set(token,{hash:hash(output),proof,target});return {buffer:output,evidence:proof,token};
}
function splitAuthority(input,owners,projection){
  const p=projections.get(projection);if(!p||hash(input)!==p.hash)bad('projection split authority');
  const token=Object.freeze({}),record=frozen({hash:p.hash,owners:JSON.stringify(owners),groups:p.proof.groups});splits.set(token,record);return token;
}
function validateSplit(input,owners,token){
  const r=splits.get(token);if(!r||hash(input)!==r.hash||JSON.stringify(owners)!==r.owners)bad('stale/copied split authority');
  let end=0;const ranges=owners.map(o=>{const s=end;end+=o.bytes;return {start:s,end}});
  for(const g of r.groups)if(!ranges.some(r=>[g.hi,...g.los].every(p=>p>=r.start&&p+4<=r.end)))bad('literal set crosses physical owner');
  return r.groups;
}
module.exports={normalize,bind,project,splitAuthority,validateSplit,census};

function objectReferences(input,target){
  const e=parse(input),owners=target.textOwners,records=[],text=[];
  for(const owner of owners){const name=target.nativeTextTail?'.text':owner.sectionName,s=e.sections.filter(s=>s.name===name);
    if(s.length!==1||s[0].size!==owner.bytes)bad('stage text owner');text.push(input.subarray(s[0].offset,s[0].offset+s[0].size));
    for(const r of e.sections.filter(r=>[4,9].includes(r.type)&&r.info===s[0].index)){
      if(r.type!==9||r.entrySize!==8||r.size%8)bad('stage REL shape');
      for(let i=0;i<r.size;i+=8){const at=r.offset+i,place=input.readUInt32BE(at),info=input.readUInt32BE(at+4),symbol=e.symbols.find(a=>a.symbolTableIndex===r.link&&a.symbolIndex===(info>>>8));
        if(!symbol||place%4||place+4>s[0].size)bad('stage REL place/symbol');records.push({place:place+owner.logicalOffset,type:info&255,word:input.readUInt32BE(s[0].offset+place),symbol});
      }
    }
  }
  return {e,text:Buffer.concat(text),records};
}
function stageAnchor(input,target,proof,type){
  const s=objectReferences(input,target),expected=proof.groups.flatMap(g=>g.records),actual=[];
  for(const r of expected){const hits=s.records.filter(q=>q.place===r.place);if(hits.length!==1||hits[0].type!==r.type||hits[0].word!==r.word)bad('literal reference drift');actual.push(hits[0]);}
  const anchor=actual[0]?.symbol;if(!anchor||anchor.name!==''||anchor.binding!==0||anchor.symbolType!==type||anchor.sectionIndex!==0xfff1
    ||anchor.value!==proof.binding.base||anchor.size||anchor.visibility||actual.some(r=>r.symbol.symbolIndex!==anchor.symbolIndex||r.symbol.symbolTableIndex!==anchor.symbolTableIndex))bad('stage reference anchor');
  if(s.e.symbols.filter(a=>a.sectionIndex===0xfff1&&a.value===anchor.value).length!==1)bad('duplicate anchor');
  const incoming=[];for(const rel of s.e.sections.filter(r=>[4,9].includes(r.type))){if(rel.type!==9||rel.entrySize!==8||rel.size%8)bad('stage relocation census');
    for(let i=0;i<rel.size;i+=8){const info=input.readUInt32BE(rel.offset+i+4);if(rel.link===anchor.symbolTableIndex&&(info>>>8)===anchor.symbolIndex)incoming.push(rel.name+':'+input.readUInt32BE(rel.offset+i));}}
  if(incoming.length!==expected.length)bad('unexplained anchor reference');
  if(hash(s.text)!==proof.textHash)bad('stage text bytes');return {...s,anchor};
}
function projectComplete(input,target){
  const p=project(input,target);let buffer=p.buffer,splitResult=null;
  if(target.literalGroup){const owners=target.literalGroup.owners.map(o=>({sectionName:o.sectionName,bytes:o.bytes}));splitResult=require('./elf_text_split').projectNativeTextOwners(buffer,owners,null,splitAuthority(buffer,owners,p.token));buffer=splitResult.buffer;}
  else if(target.textOwners.length>1){const owners=target.textOwners.map(o=>({sectionName:o.sectionName,bytes:o.bytes,symbol:o.symbol,symbolSize:o.ownerIndex===0?target.compilerTextFunctions[0].bytes:0}));
    splitResult=require('./elf_text_split').splitRelocatableTextSection(buffer,target.sectionName,owners,target.compilerTextFunctions.length>1?target.compilerTextFunctions:null,splitAuthority(buffer,owners,p.token));buffer=splitResult.buffer;
  }
  stageAnchor(buffer,target,p.evidence,0);return {...p,buffer,splitResult,referenceProjected:p.buffer};
}
function correctStrip(pre,intermediate,target,proof){
  const before=stageAnchor(pre,target,proof,0),after=stageAnchor(intermediate,target,proof,1);
  const semantic=r=>({place:r.place,type:r.type,word:r.word,name:r.symbol.name,value:r.symbol.value,binding:r.symbol.binding,size:r.symbol.size,visibility:r.symbol.visibility,
    kind:r.symbol.symbolIndex===before.anchor.symbolIndex&&r.symbol.symbolTableIndex===before.anchor.symbolTableIndex?'literal':r.symbol.symbolType});
  const expected=before.records.map(semantic),actual=after.records.map(r=>({...semantic(r),kind:r.symbol.symbolIndex===after.anchor.symbolIndex&&r.symbol.symbolTableIndex===after.anchor.symbolTableIndex?'literal':r.symbol.symbolType}));
  if(!same(expected,actual))bad('stripping changed ordinary/literal references');
  if(require('./compilation_groups').literalRun(target.literalGroup))literalRunStripCensus(before.e,after.e,target,1);
  const output=Buffer.from(intermediate),at=after.e.sections[after.anchor.symbolTableIndex].offset+after.anchor.symbolIndex*16+12;
  if(output[at]!==1)bad('unexpected strip anchor byte');output[at]=0;stageAnchor(output,target,proof,0);
  return {buffer:output,evidence:{intermediate:census(intermediate),final:census(output),correction:{fileOffset:at,old:1,new:0,symbolTableIndex:after.anchor.symbolTableIndex,symbolIndex:after.anchor.symbolIndex},
    lineage:{projectedSymbolIndex:proof.anchorIndex,preStripSymbolIndex:before.anchor.symbolIndex,postStripSymbolIndex:after.anchor.symbolIndex},unusedAnchorRule:'one complete producer object; unique actual reference anchor preserved through authenticated symbol lineage'}};
}
function derive(target,root,files=null){
  const stem='objects/c/'+(target.literalGroup?'groups/'+target.literalGroup.id:target.symbol);
  const paths={native:stem+'.assembler-object.o',reference:stem+'.literal-projected.o',source:stem+'.source-object.o',intermediate:stem+'.strip-intermediate.o',final:stem+'.o'};
  const get=role=>files?files[role]:path.join(root,paths[role]);
  const bytes=Object.fromEntries(Object.keys(paths).map(role=>[role,fs.readFileSync(get(role))]));
  const nativeCensus=target.nativeTextTail?.schemaVersion===2 ? Object.fromEntries(Object.entries(bytes).map(([role,data])=>[role,require('./text_contract').nativeSingleOwnerCensus(parse(data),target)])) : null;
  if(nativeCensus && Object.values(nativeCensus).some(v=>!same(v,nativeCensus.native)))bad('native function/text/tail stage drift');
  const p=projectComplete(bytes.native,target);
  if(!p.referenceProjected.equals(bytes.reference)||!p.buffer.equals(bytes.source))bad('projection reconstruction');
  // An independent pinned strip run authenticates the entire intermediate,
  // including symbol/string/section-index changes outside the corrected byte.
  const toolchain=JSON.parse(fs.readFileSync(path.join(ROOT,'config/toolchain.json'),'utf8')),
    exe=path.resolve(ROOT,toolchain.localRoot,'bin/mips-kmc-elf-objcopy.exe'),expected=target.model.config.binutils.tools['mips-kmc-elf-objcopy.exe'];
  if(sha256File(exe)!==expected)bad('strip executable identity');
  // GNU 2.6 cannot reliably open nested cache paths on Windows. Reproduce
  // from the already captured bytes under short temporary paths; the actual
  // artifacts are re-read below before this evidence is returned.
  const tempRoot=fs.mkdtempSync(path.join(require('os').tmpdir(),'ob64-lit-')),
    input=path.join(tempRoot,'input.o'),temp=path.join(tempRoot,'recheck.o');
  fs.writeFileSync(input,bytes.source);
  require('./phase7_conventional').run(exe,['--remove-section=.reginfo','--remove-section=.pdr','--remove-section=.comment','--remove-section=.note',input,temp]);
  if(!fs.readFileSync(input).equals(bytes.source)||!fs.readFileSync(temp).equals(bytes.intermediate))bad('strip intermediate not reproduced');
  for(const role of Object.keys(paths))if(!fs.readFileSync(get(role)).equals(bytes[role]))bad('artifact changed during derivation');
  const corrected=correctStrip(bytes.source,bytes.intermediate,target,p.evidence);if(!corrected.buffer.equals(bytes.final))bad('final anchor rederivation');
  const artifacts=Object.fromEntries(Object.keys(paths).map(role=>[role,{path:paths[role],bytes:bytes[role].length,sha256:hash(bytes[role])}]));
  return {schemaVersion:require('./compilation_groups').literalRun(target.literalGroup)?2:1,...(nativeCensus?{nativeSingleOwner:nativeCensus}:{}),binding:target.retainedLiteralBinding,projection:p.evidence,strip:corrected.evidence,artifacts,implementationSha256:sha256File(__filename)};
}
Object.assign(module.exports,{projectComplete,correctStrip,stageAnchor,derive});

function validateProof(proof){
  const group=proof?.textContract?.producer,contract=proof?.target?.retainedLiteralReferences||group?.retainedLiteralReferences,evidence=proof?.objectEvidence?.retainedLiteralReferences;
  if(!contract&&!evidence&&![18,19,22].includes(proof?.objectEvidence?.schemaVersion))return;
  const run=require('./compilation_groups').literalRun(group);
  if(!contract||!evidence||proof.objectEvidence.schemaVersion!==(run?22:group?19:18)||evidence.schemaVersion!==(run?2:1)||(!run&&(contract.schemaVersion!==1||group?.retainedNativeAlignment))
    ||!same(normalize(contract),evidence.binding?.contract)||!same(contract,proof.textContract?.retainedLiteralReferences)
    ||!same(evidence.binding,proof.textContract?.retainedLiteralBinding)
    ||evidence.binding.sourceHash!==proof.target.sourceSha256
    ||evidence.implementationSha256!==proof.textContract.literalImplementationSha256
    ||!same(evidence.projection?.binding,evidence.binding))bad('proof binding schema');
  const linked=proof.linkEvidence?.retainedLiteralReferences;
  if(!linked||linked.schemaVersion!==1||!same(linked.binding,evidence.binding)||linked.allReferencesExact!==true
    ||linked.linkedAnchor?.symbolType!==0||linked.linkedAnchor.binding!==0||linked.linkedAnchor.sectionIndex!==0xfff1
    ||linked.linkedAnchor.value!==evidence.binding.base||linked.linkedAnchor.size||linked.linkedAnchor.visibility)bad('proof linked custody');
  const roles={native:'unsplitAssemblerObject',reference:'literalProjectedObject',source:'rawObject',intermediate:'stripIntermediateObject',final:'strippedObject'};
  for(const [role,objectRole] of Object.entries(roles))if(!same(evidence.artifacts?.[role],proof.objectEvidence.artifacts?.[objectRole]))bad('proof artifact role');
  if(evidence.projection.raw.sha256!==evidence.artifacts.native.sha256
    ||evidence.projection.projected.sha256!==evidence.artifacts.reference.sha256
    ||evidence.strip.intermediate.sha256!==evidence.artifacts.intermediate.sha256
    ||evidence.strip.final.sha256!==evidence.artifacts.final.sha256
    ||evidence.strip.correction.old!==1||evidence.strip.correction.new!==0
    ||!Number.isSafeInteger(evidence.strip.correction.fileOffset)
    ||evidence.strip.correction.fileOffset<0||evidence.strip.correction.fileOffset>=evidence.artifacts.final.bytes)bad('proof stage identity');
}
module.exports.validateProof=validateProof;
function linkedEvidence(target,root,context,objectEvidence){
  const b=binding(target);return linkedBoundEvidence(target,root,context,objectEvidence,b,b.evidence.contract,b.evidence.partition);
}
function linkedBoundEvidence(target,root,context,objectEvidence,b,c,p){
  const row=b.model.rows.find(r=>r.index===c.ownerRowIndex),slice=row.slices[0],elf=context.elf;
  const sections=elf.sections.filter(s=>s.name===slice.sectionName);if(sections.length!==1)bad('linked retained section census');const s=sections[0];
  if(s.type!==1||s.flags!==2||s.address!==slice.vramStart||s.size!==row.bytes
    ||!elf.buffer.subarray(s.offset,s.offset+s.size).equals(b.rom.subarray(row.romStart,row.romEndExclusive)))bad('linked retained row bytes');
  const loads=elf.programHeaders.filter(l=>l.type===1&&l.vaddr===slice.vramStart&&l.paddr===row.romStart&&l.fileSize===row.bytes&&l.memorySize===row.bytes&&l.flags===4);
  if(loads.length!==1||loads[0].offset!==s.offset||s.offset+s.size>elf.buffer.length
    ||elf.programHeaders.filter(l=>l.type===1&&l.fileSize>0&&l.offset<s.offset+s.size&&s.offset<l.offset+l.fileSize).length!==1)bad('linked retained load slab');
  let objectPath='objects/assembly/chunk_'+String(row.part.chunkIndex).padStart(3,'0')+'.o';
  const matches=[];for(const t of b.allTargets)for(const a of t.auxiliarySections||[]){
    for(const [key,kind] of [['preservedPrefix','prefix'],['preservedTail','tail'],['preservedInteriorBefore','interior']])if(a[key]&&same(a[key],p)){
      const suffix=a.outputSection.replace(/^\.ob64\./,'').replace(/\./g,'_');
      matches.push(kind==='interior'?require('./auxiliary_interior').interiorRecord(t,a).objectRelative:'objects/assembly/auxiliary/chunk_'+String(a.ownerChunkIndex).padStart(3,'0')+'_'+suffix+'_'+kind+'.o');
    }
  }
  if(matches.length>1)bad('linked partition authority');if(matches.length===1)objectPath=matches[0];
  const original=parse(fs.readFileSync(path.join(root,objectPath))),parts=original.sections.filter(s=>s.name===p.inputSection),length=p.romEndNumber-p.romStartNumber;
  if(parts.length!==1)bad('retained ASM input census');const part=parts[0];
  if(part.type!==1||part.flags!==2||part.address||part.size!==length||hash(original.buffer.subarray(part.offset,part.offset+part.size))!==p.expectedSha256
    ||original.sections.some(r=>[4,9].includes(r.type)&&r.info===part.index&&r.size))bad('retained ASM input bytes/relocations');
  const map=context.mapText,lines=map.split(/\r?\n/),heads=lines.map((line,i)=>line.startsWith(slice.sectionName+' ')?i:-1).filter(i=>i>=0);
  if(heads.length!==1)bad('retained map heading');let end=heads[0]+1;while(end<lines.length&&!/^(?:\.[A-Za-z0-9_.]+|\/DISCARD\/)\s/.test(lines[end]))end++;
  const block=lines.slice(heads[0]+1,end),contributions=block.map(line=>{
    const m=/^\s+(\.[\w.]+)\s+(?:0x)?([0-9a-f]+)\s+(?:0x)?([0-9a-f]+)\s+[0-9a-f]+\s+2\*\*\d+\s+elf32-bigmips\s+(\S+)\(overhead \d+ bytes\)$/i.exec(line);
    return m?{inputSection:m[1],address:parseInt(m[2],16),bytes:parseInt(m[3],16),object:m[4].replace(/\\/g,'/')}:null;
  }).filter(Boolean);
  const covering=contributions.filter(r=>r.address<p.vramEndNumber&&r.address+r.bytes>p.vramStartNumber);
  if(covering.length!==1||covering[0].inputSection!==p.inputSection||covering[0].address!==p.vramStartNumber||covering[0].bytes!==length||covering[0].object!==objectPath||block.some(line=>/\*fill\*/.test(line)))bad('retained sole ASM map custody');
  const proof=objectEvidence.retainedLiteralReferences,anchors=elf.symbols.filter(a=>a.sectionIndex===0xfff1&&a.value===b.evidence.base&&a.name==='');
  if(anchors.length!==1||anchors[0].binding||anchors[0].symbolType||anchors[0].size||anchors[0].visibility)bad('linked anchor metadata');
  for(const group of proof.projection.groups){const high=new Set();for(const off of group.los){
    const owner=target.textOwners.find(o=>group.hi>=o.logicalOffset&&off+4<=o.logicalOffset+o.bytes),sec=owner&&elf.sections.find(s=>s.name===owner.sectionName);
    if(!sec)bad('linked literal pair owner');const hi=elf.buffer.readUInt32BE(sec.offset+group.hi-owner.logicalOffset),lo=elf.buffer.readUInt32BE(sec.offset+off-owner.logicalOffset),raw=group.records.find(r=>r.place===off),rh=group.records[0];
    const addend=(((rh.word&65535)<<16)+(raw.word<<16>>16))>>>0,address=(((hi&65535)<<16)+(lo<<16>>16))>>>0;
    if((hi>>>16)!==(rh.word>>>16)||(lo>>>16)!==(raw.word>>>16)||address!==b.evidence.base+addend)bad('linked literal reference');high.add(hi&65535);
  }if(high.size!==1)bad('linked shared-HI conservation');}
  return {schemaVersion:1,binding:b.evidence,objectPath,objectSha256:sha256File(path.join(root,objectPath)),partitionSha256:p.expectedSha256,loadIndex:loads[0].index,mapContribution:covering[0],linkedAnchor:anchors[0],allReferencesExact:true};
}
module.exports.linkedEvidence=linkedEvidence;
function registryGroups(group){
  if(!group.retainedLiteralReferences)return [];
  const c=normalize(group.retainedLiteralReferences);
  const run=require('./compilation_groups').literalRun(group);
  if((run?(c.schemaVersion!==2||group.members.length<2||group.functions.length!==group.members.length):(c.schemaVersion!==1||group.mode!=='native-text-owner-projection'||group.members.length!==2||group.functions.length!==2))||group.auxiliary||group.interiorRun)bad('literal group mode');
  const refs=group.relocations.map((r,index)=>({...r,index})).filter(r=>r.symbolSection==='.rodata'),sets=[],coverage=Buffer.alloc(c.bytes);
  for(let i=0;i<refs.length;){const hi=refs[i++],lo=refs[i++];
    if(!lo||hi.type!==5||lo.type!==6||hi.symbol!=='.rodata'||lo.symbol!=='.rodata'||hi.symbolValue||lo.symbolValue
      ||hi.word>>>16!==0x3c01||lo.offset!==hi.offset+4||(lo.word>>>21&31)!==1||lo.index!==hi.index+1)bad('group literal pair grammar/order');
    const los=[lo];if(lo.word>>>26===35){const next=refs[i++];if(!next||next.type!==6||next.symbol!=='.rodata'||next.symbolValue||next.index!==lo.index+1
      ||next.offset!==hi.offset+8||next.word>>>26!==35||(next.word>>>21&31)!==1||(next.word>>>16&31)!==(lo.word>>>16&31)+1||(next.word&65535)!==(lo.word&65535)+4)bad('group shared-HI grammar');los.push(next);}else if(lo.word>>>26!==53)bad('group literal load grammar');
    const addend=(((hi.word&65535)<<16)+(lo.word<<16>>16))>>>0;
    if(addend%8||addend+8>c.bytes||coverage.subarray(addend,addend+8).some(v=>v))bad('group literal payload coverage');coverage.fill(1,addend,addend+8);
    const fn=group.functions.find(f=>[hi,...los].every(r=>r.offset>=f.offset&&r.offset+4<=f.offset+f.bytes));if(!fn)bad('group literal set crosses function');
    sets.push({hi:hi.offset,los:los.map(r=>r.offset),indices:[hi,...los].map(r=>r.index),functionSymbol:fn.symbol});
  }
  if(!sets.length||coverage.some(v=>v!==1))bad('group literal full coverage');return frozen(sets);
}
function bindGroups(targets,model,rom,readSource){
  const groups=[...new Set(targets.map(t=>t.compilationGroup).filter(g=>g?.retainedLiteralReferences))];
  for(const group of groups){registryGroups(group);const members=group.members.map(m=>targets.find(t=>t.symbol===m.symbol&&t.compilationGroup===group));
    if(members.some(t=>!t)||new Set(members.map(t=>t.sourceSha256)).size!==1)bad('group literal source identity');
    const first=members[0],producer={...first,compilationGroup:null,compilationGroupId:null,literalGroup:group,retainedLiteralReferences:group.retainedLiteralReferences,
      bytes:group.text.bytes,romEndNumber:group.romStart+group.text.bytes,textOwners:group.owners.map(o=>({...o,logicalOffset:o.groupOffset})),
      compilerTextFunctions:group.functions.map(f=>({...f,offsetNumber:f.offset})),auxiliarySections:[]};
    groupTargets.set(group,producer);bind(producer,targets,model,rom,readSource);
    group.retainedLiteralBinding=structuredClone(producer.retainedLiteralBinding);groupIdentities.set(group,digest(group));
  }
}
function groupTarget(group){require('./compilation_groups').authenticateLiteralRun(group);const target=groupTargets.get(group);if(!target||target.literalGroup!==group||groupIdentities.get(group)!==digest(group)||!same(group.retainedLiteralBinding,target.retainedLiteralBinding))bad('group literal authority');const b=binding(target);for(const member of group.members){const matches=b.allTargets.filter(t=>t.symbol===member.symbol&&t.compilationGroup===group);if(matches.length!==1||matches[0].sourceSha256!==target.sourceSha256||matches[0].source!==group.source)bad('group source binding changed');}return target;}
function groupProject(input,group){const result=projectComplete(input,groupTarget(group));groupProofs.set(group,result.evidence);return result;}
function groupStage(input,group,stage){
  const target=groupTarget(group);let proof,anchor;
  if(stage==='raw'){const projected=project(input,target);proof=projected.evidence;groupProofs.set(group,proof);anchor={symbolIndex:proof.anchorIndex,symbolTableIndex:proof.anchorTable};}
  else {proof=groupProofs.get(group);if(!proof)bad('group stage missing native authority');if(require('./compilation_groups').literalRun(group)){const native=runNative.get(group);if(!native)bad('literal run native authority');const expected=projectComplete(native,target).buffer;if(stage==='projected'&&!expected.equals(input))bad('literal run split replay');if(stage==='stripped')literalRunStripCensus(parse(expected),parse(input),target,0);}anchor=stageAnchor(input,target,proof,0).anchor;}
  const expected=registryGroups(group),actual=proof.groups.map(g=>({hi:g.hi,los:g.los}));
  if(!same(expected.map(g=>({hi:g.hi,los:g.los})),actual))bad('group native pair registry drift');
  return {proof,anchor,places:new Set(proof.groups.flatMap(g=>[g.hi,...g.los]))};
}
Object.assign(module.exports,{registryGroups,bindGroups,groupTarget,groupProject,groupStage});


const mixedBindings=new WeakMap();
function bindMixed(group,targets,model,rom){
  const aux=require('./auxiliary_projection'),c=aux.mixedContract(group),table=group.auxiliary.sections[0];
  if(hash(rom)!==model.config.rom.sha256||rom.length!==model.config.rom.bytes)bad('mixed ROM identity');
  const row=model.rows.find(r=>r.index===table.ownerRowIndex),slice=row?.slices?.[0];
  if(!row?.part||row.inputKind!=='tracked-assembly'||row.slices.length!==1||slice.executable||slice.placementKind!=='non-descriptor-load-slab')bad('mixed retained row');
  const slabs=model.nonDescriptorLoadSlabs.filter(s=>s.id===slice.loadSlabId&&s.kind==='boot-initialized-data');if(slabs.length!==1)bad('mixed boot storage');
  const base=table.vramStartNumber-c.native.tableOffset,romStart=table.romStartNumber-c.native.tableOffset,end=romStart+c.native.bytes;
  if(romStart<row.romStart||end>row.romEndExclusive||romStart<slabs[0].romStart||end>slabs[0].romEndExclusive||base%16
    ||base!==slice.vramStart+romStart-row.romStart||base!==slabs[0].vramStart+romStart-slabs[0].romStart)bad('mixed storage equation');
  const source=fs.readFileSync(path.join(ROOT,row.part.file));if(hash(source)!==row.part.sha256)bad('mixed original source hash');
  const original=assembleWordAsmText(source.toString()).bytes;if(original.length!==row.bytes||!original.equals(rom.subarray(row.romStart,row.romEndExclusive)))bad('mixed original source bytes');
  const owners=targets.flatMap(t=>t.auxiliarySections||[]).filter(a=>a.outputSection===slice.sectionName);
  if(targets.some(t=>t.textOwners.some(o=>o.rowIndex===row.index)))bad('mixed text-owned storage');
  const retained=c.intervals.filter(s=>s.kind!=='table').map(s=>{const start=romStart+s.offset,finish=start+s.bytes;
    if(owners.some(a=>start<a.romEndNumber&&finish>a.romStartNumber))bad('mixed C-owned retained interval');
    const parts=owners.flatMap(a=>[a.preservedPrefix,a.preservedTail,a.preservedInteriorBefore].filter(Boolean)).filter(p=>start>=p.romStartNumber&&finish<=p.romEndNumber);
    if(parts.length!==1)bad('mixed unique retained partition');const p=parts[0];
    if(p.ownerOriginalAssembly!==row.part.file||p.ownerOriginalAssemblySha256!==row.part.sha256||p.vramStartNumber+start-p.romStartNumber!==base+s.offset
      ||hash(rom.subarray(p.romStartNumber,p.romEndNumber))!==p.expectedSha256||hash(rom.subarray(start,finish))!==s.expectedSha256)bad('mixed retained source/partition');
    return{...s,romStart:start,vramStart:base+s.offset,partition:structuredClone(p)};
  });
  const members=targets.filter(t=>t.compilationGroup===group);if(members.length!==group.members.length||new Set(members.map(t=>t.sourceSha256)).size!==1||members.some(t=>t.source!==group.source))bad('mixed source membership');
  const evidence=frozen({base,romStart,ownerRowIndex:row.index,ownerSource:row.part.file,ownerHash:row.part.sha256,sourceHash:members[0].sourceSha256,retained,modelIdentity:digest({row,slab:slabs[0],owners})});
  mixedBindings.set(group,{evidence,rom,model,allTargets:targets,identity:digest(group)});return evidence;
}
function mixedBinding(group){const b=mixedBindings.get(group);if(!b||b.identity!==digest(group)||hash(b.rom)!==b.model.config.rom.sha256)bad('mixed binding authority');
  const row=b.model.rows.find(r=>r.index===b.evidence.ownerRowIndex),slab=b.model.nonDescriptorLoadSlabs.find(s=>s.id===row?.slices[0]?.loadSlabId),owners=b.allTargets.flatMap(t=>t.auxiliarySections||[]).filter(a=>a.outputSection===row?.slices[0]?.sectionName);
  if(digest({row,slab,owners})!==b.evidence.modelIdentity||sha256File(path.join(ROOT,b.evidence.ownerSource))!==b.evidence.ownerHash||sha256File(path.join(ROOT,group.source))!==b.evidence.sourceHash
    ||b.allTargets.filter(t=>t.compilationGroup===group).length!==group.members.length)bad('mixed changed binding input');return b;}
function mixedLinkedEvidence(target,root,context,objectEvidence){const group=target.compilationGroup,b=mixedBinding(group),sets=require('./auxiliary_projection').mixedReferenceSets(group),producer={...target,textOwners:group.owners.map(o=>({...o,logicalOffset:o.groupOffset}))};
  const groups=sets.map(s=>({hi:s.hi,los:[s.lo],records:[s.hi,s.lo].map(place=>({...group.relocations.find(r=>r.offset===place),place}))}));
  const partitions=[...new Map(b.evidence.retained.map(s=>[digest(s.partition),s.partition])).values()];
  return{schemaVersion:1,binding:b.evidence,partitions:partitions.map(p=>linkedBoundEvidence(producer,root,context,{retainedLiteralReferences:{projection:{groups}}},b,{ownerRowIndex:b.evidence.ownerRowIndex},p))};
}
Object.assign(module.exports,{bindMixed,mixedBinding,mixedLinkedEvidence});

const runNative=new WeakMap();
function literalRunStripCensus(before,after,target,anchorType){
  const base=binding(target).evidence.base,removed=new Set(['.reginfo','.pdr','.note','.comment']),cg=require('./compilation_groups');
  const name=(e,s)=>s.sectionIndex===0?'UND':s.sectionIndex===0xfff1?'ABS':e.sections[s.sectionIndex]?.name;
  const key=(e,s)=>({name:s.name,value:s.value,size:s.size,binding:s.binding,type:s.sectionIndex===0xfff1&&s.value===base?0:s.symbolType,visibility:s.visibility,section:name(e,s)});
  const abs=after.symbols.filter(s=>s.sectionIndex===0xfff1&&s.value===base);if(abs.length!==1||abs[0].symbolType!==anchorType)bad('literal run strip anchor');
  const mapped=new Set(),mapping=[];for(const s of before.symbols){if(removed.has(name(before,s))){if(cg.relocations(before).some(r=>r.symbol===s))bad('literal run removed referenced metadata');mapping.push({oldIndex:s.symbolIndex,newIndex:null});continue;}const hit=after.symbols.filter(t=>same(key(before,s),key(after,t)));if(hit.length!==1||mapped.has(hit[0].symbolIndex))bad('literal run symbol mapping');mapped.add(hit[0].symbolIndex);mapping.push({oldIndex:s.symbolIndex,newIndex:hit[0].symbolIndex});}
  const added=after.symbols.filter(s=>!mapped.has(s.symbolIndex)),expected=['.symtab',...target.literalGroup.owners.slice(1).map(o=>o.sectionName)];
  if(!same(added.map(s=>name(after,s)),expected))bad('literal run generated section symbol census');
  for(const s of added)if(s.name||s.binding||s.symbolType!==3||s.value||s.size||s.visibility||cg.relocations(after).some(r=>r.symbol===s))bad('literal run generated symbol reference/shape');
  const rel=(e,r)=>({owner:r.owner.name,place:r.place,type:r.type,symbol:key(e,r.symbol),word:e.buffer.readUInt32BE(r.owner.offset+r.place)});if(!same(cg.relocations(before).map(r=>rel(before,r)),cg.relocations(after).map(r=>rel(after,r))))bad('literal run strip REL conservation');
  const sections=before.sections.filter(s=>s.index&&s.type!==0&&!removed.has(s.name)&&!['.symtab','.strtab','.shstrtab'].includes(s.name));
  if(!same(after.sections.filter(s=>s.index&&s.type!==0&&!['.symtab','.strtab','.shstrtab'].includes(s.name)).map(s=>s.name).sort(),sections.map(s=>s.name).sort()))bad('literal run strip section census');
  for(const s of sections){const t=after.sections.find(t=>t.name===s.name);for(const k of ['type','flags','address','size','alignment','entrySize'])if(t[k]!==s[k])bad('literal run strip section shape');if(s.type!==9&&!before.buffer.subarray(s.offset,s.offset+s.size).equals(after.buffer.subarray(t.offset,t.offset+t.size)))bad('literal run strip payload');}
  return{mapping,added:added.map(s=>({...s,section:name(after,s)}))};
}
module.exports.literalRunStripCensus=literalRunStripCensus;
