'use strict';
const assert=require('assert/strict'),fs=require('fs'),path=require('path');
const p7=require('../tools/lib/phase7_conventional'),p8=require('../tools/lib/phase8_matching_c');
function sharedChecks(ctx,checks){
  const {targets,target,otherTarget,model,phase8,classification,dest,rom,linked,script,manifest,cache,cacheOptions,proof}=ctx;
  const aux=target.auxiliarySections[0],other=otherTarget.auxiliarySections[0];
  const a=require('../tools/lib/active_targets'),interior=require('../tools/lib/auxiliary_interior');
  const reject=(name,fn)=>{assert.throws(fn,undefined,name);checks.push(name);};
  const ro=linked.sections.find(s=>s.name===aux.outputSection);
  assert.deepEqual(p7.elfSectionBytes(linked,ro),rom.subarray(aux.ownerRomStartNumber,aux.ownerRomEndNumber));
  const otherClass=require('../tools/lib/source_policy').classifyTargetSources([otherTarget]).targets[0];
  assert.equal(otherClass.class,'PURE_C');p8.deriveSourceObjectProof(phase8,otherTarget,dest,otherClass,linked,rom);
  const map=fs.readFileSync(path.join(dest,'phase8.map'),'utf8');p8.verifyInteriorGroupMapOwners(phase8,map);
  const first='objects/c/'+target.symbol+'.o('+aux.outputSection+')',second='objects/c/'+otherTarget.symbol+'.o('+aux.outputSection+')';
  const changes={missing:s=>s.replace('    '+first+'\n',''),extra:s=>s.replace(first,first+'\n    '+first),wildcard:s=>s.replace(first,'*('+aux.outputSection+')'),
    'wrong owner':s=>s.replace(first,'objects/c/wrong.o('+aux.outputSection+')'),reordered:s=>s.replace(first,'SWAP').replace(second,first).replace('SWAP',second)};
  for(const [name,change]of Object.entries(changes)){
    const changed=change(script);assert.notEqual(changed,script);reject('shared '+name+' selector',()=>p8.verifySharedAuxiliaryScript(phase8,changed));
    fs.writeFileSync(path.join(dest,'linker/phase8.ld'),changed);
    try{reject('recorded shared '+name,()=>p8.verifyRecordedEdgePadding(phase8,dest,{targets:[{symbol:target.symbol,physicalOwnerEvidence:proof}]},{baserom:rom}));}
    finally{fs.writeFileSync(path.join(dest,'linker/phase8.ld'),script);}
  }
  reject('wrong shared map owner',()=>p8.verifyInteriorGroupMapOwners(phase8,map.replaceAll('objects/c/'+otherTarget.symbol+'.o','objects/c/wrong.o')));
  const clone=()=>structuredClone({targets,model});
  for(const [name,mutate]of [
    ['reordered contributors',c=>c.targets.reverse()],['duplicate contributor',c=>c.targets.push(c.targets[0])],
    ['gap',c=>c.targets[1].auxiliarySections[0].romStartNumber+=4],['overlap',c=>c.targets[1].auxiliarySections[0].romStartNumber-=4],
    ['noninitial prefix',c=>c.targets[1].auxiliarySections[0].ownerPrefixBytes=8],['nonfinal tail',c=>c.targets[0].auxiliarySections[0].ownerTailBytes=4],
    ['owner identity',c=>c.targets[1].auxiliarySections[0].ownerOriginalAssemblySha256='0'.repeat(64)]]){
    const c=clone();mutate(c);reject('partition '+name,()=>a.validateAuxiliaryOwnerGroups(c.targets,c.model));
  }
  const fallback=p7.parseElfFile(path.join(dest,'comparison/original/chunk_020.o'));
  interior.originalInteriorBytes(fallback,other,rom);
  reject('original identity hash',()=>interior.originalInteriorBytes(fallback,{...other,preservedInteriorBefore:{...other.preservedInteriorBefore,ownerOriginalAssemblySha256:'0'.repeat(64)}},rom));
  reject('unmapped original identity',()=>interior.originalInteriorBytes(fallback,{...other,preservedInteriorBefore:{...other.preservedInteriorBefore,ownerOriginalAssembly:'asm/original/__unmapped_retained_fixture__.s'}},rom));
  const altered=Buffer.from(rom);altered[aux.ownerRomStartNumber]^=1;reject('changed neighbor original bytes',()=>interior.originalInteriorBytes(fallback,other,altered));
  const originalRow=fallback.sections.find(s=>s.name===aux.outputSection),relocated=Buffer.from(fallback.buffer);
  const empty=fallback.sections.find(s=>s.index!==0&&s.size===0&&s.name!==aux.outputSection);
  assert(empty);relocated.writeUInt32BE(9,empty.headerOffset+4);relocated.writeUInt32BE(8,empty.headerOffset+20);relocated.writeUInt32BE(originalRow.index,empty.headerOffset+28);
  reject('actual original-row REL outside interior',()=>interior.originalInteriorBytes(p7.parseElf32BigEndian(relocated),other,rom));
  const key=opts=>cache.sha256Value(cache.createCacheKeyMaterial({...cacheOptions,target,classification,...opts}));
  const baseKey=key({}),ids=cache.defaultImplementationIdentities();ids.find(x=>x.path==='tools/lib/phase8_matching_c.js').sha256='0'.repeat(64);
  assert.notEqual(key({implementationIdentities:ids}),baseKey);checks.push('implementation identity invalidates cache key');
  const changedTarget=structuredClone(target);changedTarget.auxiliarySections[0].expectedTrailingPaddingSha256='0'.repeat(64);
  assert.notEqual(key({target:changedTarget}),baseKey);checks.push('padding contract invalidates cache key');
  const changedPartition=structuredClone(target);changedPartition.auxiliarySections[0].ownerPrefixSha256='0'.repeat(64);
  assert.notEqual(key({target:changedPartition}),baseKey);checks.push('retained partition invalidates cache key');
  const reversed=[...manifest.linkedObjects.map(r=>r.path),'objects/assembly/chunk_016.o','objects/assembly/chunk_020.o'].reverse();
  ctx.run(ctx.tc.toolsAbs.linker,[...ctx.tc.linkerFlags,'-T','linker/phase8.ld','-Map=reverse.map','-o','reverse.elf',...reversed],dest);
  const reverse=p7.parseElfFile(path.join(dest,'reverse.elf'));
  assert.deepEqual(p7.elfSectionBytes(reverse,reverse.sections.find(s=>s.name===aux.outputSection)),p7.elfSectionBytes(linked,ro));
  p8.verifyInteriorGroupMapOwners(phase8,fs.readFileSync(path.join(dest,'reverse.map'),'utf8'));checks.push('reversed response files preserve exact row and map');
  fs.writeFileSync(path.join(ctx.out,'shared-checks.json'),JSON.stringify({status:'pass',checks,scope:'synthetic native fixture; no canonical acceptance'},null,2));
}

function main(){
  const passed=[];
  const reject=(name,fn,pattern=/retained auxiliary/)=>{assert.throws(fn,pattern,name);passed.push(name);};
  const report=require('./retained_auxiliary_composition').main({padded:true,inspect(ctx){
    const {target,phase8,classification,dest,rom,linked,cache}=ctx,aux=target.auxiliarySections[0];
    const compilerFile=path.join(dest,'generated/c/'+target.symbol+'.compiler.s');
    const sourceFile=path.join(dest,'objects/c/'+target.symbol+'.source-object.o');
    const native=fs.readFileSync(compilerFile),source=fs.readFileSync(sourceFile);
    const grammar=bytes=>p8.verifyRetainedAuxiliaryCompilerAssembly(bytes,target);
    grammar(native);
    const text=native.toString(),table=text.match(/\.L[0-9]+:\r?\n\s*\.word/)[0].split(':')[0];
    const mutations={
      'explicit zero':s=>s.replace(/(\.word\s+\.L[0-9]+)(\r?\n\s*\.text)/,'$1\n\t.word\t0$2'),
      'explicit space':s=>s.replace(/(\.word\s+\.L[0-9]+)(\r?\n\s*\.text)/,'$1\n\t.space\t4$2'),
      'padding label':s=>s.replace(/(\.word\s+\.L[0-9]+)(\r?\n\s*\.text)/,'$1\n.L99999:$2'),
      'wrong alignment':s=>s.replace(/\.align\s+3/,' .align 4'),
      'undefined destination':s=>s.replace(/\.word\s+\.L[0-9]+/,'.word .L99999'),
      'table destination':s=>s.replace(/\.word\s+\.L[0-9]+/,'.word '+table),
      'duplicate destination':s=>s+'\n'+s.match(/^\.L[0-9]+:$/m)[0]+'\n',
    };
    for(const [name,mutate]of Object.entries(mutations)){
      const changed=Buffer.from(mutate(text));assert.notDeepEqual(changed,native);reject(name,()=>grammar(changed));
    }
    const check=bytes=>p8.verifyAuxiliarySourceObjectSection(p7.parseElf32BigEndian(bytes),target,aux,'mutation');
    check(source);
    function change(fn){const bytes=Buffer.from(source),elf=p7.parseElf32BigEndian(bytes);fn(bytes,elf);return bytes;}
    const ro=elf=>elf.sections.find(s=>s.name===aux.outputSection);
    const symoff=(elf,symbol)=>elf.sections[symbol.symbolTableIndex].offset+symbol.symbolIndex*16;
    const extraCarrier=(b,e,owner,type=9)=>{
      const section=e.sections.find(s=>s.name==='.note'),symbols=e.sections.find(s=>s.type===2),width=type===9?8:12;
      assert(section.size>=width);b.writeUInt32BE(type,section.headerOffset+4);b.writeUInt32BE(width,section.headerOffset+20);
      b.writeUInt32BE(symbols.index,section.headerOffset+24);b.writeUInt32BE(owner,section.headerOffset+28);b.writeUInt32BE(width,section.headerOffset+36);
      b.writeUInt32BE(4,section.offset);return section;
    };
    for(const field of ['link','info','entrySize']){
      const slot={link:24,info:28,entrySize:36}[field];
      reject('readonly '+field,()=>check(change((b,e)=>b.writeUInt32BE(1,ro(e).headerOffset+slot))));
    }
    for(const [name,value,size]of [['symbol at padding',28,0],['symbol end marker',32,0],['symbol crossing',24,8]]){
      reject(name,()=>check(change((b,e)=>{const sym=e.symbols.find(s=>s.sectionIndex===ro(e).index);const off=symoff(e,sym);b.writeUInt32BE(value,off+4);b.writeUInt32BE(size,off+8);})));}
    // Ancillary carrier is included: redirect its actual symbol to readonly,
    // retaining the table's own outgoing REL and all table bytes unchanged.
    function incoming(edits){return change((b,e)=>{
      const carrier=e.sections.find(s=>s.name==='.rel'+target.sectionName),owner=e.sections[carrier.info];
      const anchor=e.symbols.find(s=>s.sectionIndex===ro(e).index&&s.symbolType===3);
      const count=carrier.size/8;
      // Neutralize existing references to readonly before installing test records.
      const external=e.symbols.find(s=>s.name==='external_call');
      for(let i=0;i<count;i++)b.writeUInt32BE((external.symbolIndex<<8)|4,carrier.offset+i*8+4);
      edits({b,e,carrier,owner,anchor,put:(i,type,word,index=anchor.symbolIndex)=>{
        const place=i*4;b.writeUInt32BE(place,carrier.offset+i*8);b.writeUInt32BE((index<<8)|type,carrier.offset+i*8+4);b.writeUInt32BE(word>>>0,owner.offset+place);
      }});
    });}
    for(const type of [2,4])for(const at of [28,32])reject('incoming '+type+' at '+at,()=>check(incoming(({put})=>put(0,type,type===4?at/4:at))));
    for(const type of [2,4])check(incoming(({put})=>put(0,type,type===4?4:16)));
    check(incoming(({put})=>{put(0,5,0);put(1,5,0);put(2,6,16);}));passed.push('valid R32 R26 and multiple HI16');
    reject('earlier pending high not overwritten',()=>check(incoming(({put})=>{put(0,5,1);put(1,5,0);put(2,6,16);}))); 
    reject('unpaired high',()=>check(incoming(({put})=>put(0,5,0))));
    reject('unpaired low',()=>check(incoming(({put})=>put(0,6,0))));
    reject('negative signed low',()=>check(incoming(({put})=>{put(0,5,0);put(1,6,0xFFFF);}))); 
    reject('unsupported incoming type',()=>check(incoming(({put})=>put(0,1,0))),/unsupported.*relocation/);
    reject('nonaligned incoming',()=>check(incoming(({put})=>put(0,2,1))));
    reject('incoming overflow',()=>check(incoming(({put})=>put(0,2,0xFFFFFFFF))));
    reject('symbol plus addend exceeds entries',()=>check(incoming(({b,e,anchor,put})=>{b.writeUInt32BE(24,symoff(e,anchor)+4);put(0,2,4);}))); 
    check(incoming(({b,e,anchor,put})=>{b.writeUInt32BE(4,symoff(e,anchor)+4);put(0,2,4);}));passed.push('named-offset payload reference');
    reject('cross-carrier HI16 LO16',()=>check(incoming(({b,e,anchor,put})=>{
      put(0,5,0);const owner=e.sections.find(s=>s.name===target.sectionName),rel=extraCarrier(b,e,owner.index);
      b.writeUInt32BE((anchor.symbolIndex<<8)|6,rel.offset+4);b.writeUInt32BE(0,owner.offset+4);
    })));
    reject('different-symbol HI16 LO16',()=>check(incoming(({b,e,anchor,put})=>{
      const other=e.symbols.find(s=>s.name==='external_call'),off=symoff(e,other);
      b.writeUInt16BE(ro(e).index,off+14);b.writeUInt32BE(0,off+4);b.writeUInt32BE(0,off+8);
      put(0,5,0);put(1,6,0,other.symbolIndex);
    })));
    reject('extra table REL carrier',()=>check(change((b,e)=>{
      const rel=extraCarrier(b,e,ro(e).index),sym=e.symbols.find(s=>s.sectionIndex===ro(e).index);
      b.writeUInt32BE((sym.symbolIndex<<8)|2,rel.offset+4);
    })),/relocation/);
    reject('incoming RELA',()=>check(incoming(({b,e,anchor})=>{
      const owner=e.sections.find(s=>s.name===target.sectionName),rel=extraCarrier(b,e,owner.index,4);
      b.writeUInt32BE((anchor.symbolIndex<<8)|2,rel.offset+4);b.writeUInt32BE(0,rel.offset+8);
    })));
    reject('table REL order',()=>check(change((b,e)=>{
      const rel=e.sections.find(s=>s.name==='.rel'+aux.outputSection);b.writeUInt32BE(4,rel.offset);b.writeUInt32BE(0,rel.offset+8);
    })),/relocation/);
    reject('table REL into padding',()=>check(change((b,e)=>{
      const rel=e.sections.find(s=>s.name==='.rel'+aux.outputSection);b.writeUInt32BE(aux.entryBytes,rel.offset);
    })),/relocation/);
    reject('table addend body end',()=>check(change((b,e)=>b.writeUInt32BE(target.bytes,ro(e).offset))),/relocation|bytes/);
    reject('nonzero native padding',()=>check(change((b,e)=>b.writeUInt32BE(1,ro(e).offset+aux.entryBytes))),/padding/);
    // Unrelated relocation types stay under the pre-existing ordinary validators;
    // the new decoder does not impose its incoming-only type rules on them.
    const stripped=p7.parseElfFile(path.join(dest,'objects/c/'+target.symbol+'.o'));
    p8.verifyAuxiliaryLinkedObjectSection(stripped,target,aux,'stripped positive');
    // Replay authenticates the bytes again; no serialized success flag bypasses grammar.
    const explicit=Buffer.from(mutations['explicit zero'](text));
    fs.writeFileSync(compilerFile,explicit);
    try{
      reject('independent source-object grammar replay',()=>p8.deriveSourceObjectProof(phase8,target,dest,classification,linked,rom));
      reject('cache artifact grammar replay',()=>cache.inspectCompiledTargetArtifacts({target,classification,files:cache.outputArtifactFiles(dest,target)}));
    }finally{fs.writeFileSync(compilerFile,native);}
    const symbolMutation=change((b,e)=>{
      const symbol=e.symbols.find(s=>s.sectionIndex===ro(e).index);b.writeUInt32BE(aux.entryBytes,symoff(e,symbol)+4);
    });
    fs.writeFileSync(sourceFile,symbolMutation);
    try{
      reject('cache source-object padding symbol replay',()=>cache.inspectCompiledTargetArtifacts({phase8,target,classification,files:cache.outputArtifactFiles(dest,target)}),/retained auxiliary|ancillary removal|relocation (contract|drift)/);
      reject('independent source-object padding symbol replay',()=>p8.deriveSourceObjectProof(phase8,target,dest,classification,linked,rom),/retained auxiliary|ancillary removal|relocation (contract|drift)/);
    }finally{fs.writeFileSync(sourceFile,source);}
    const result={status:'pass',checks:passed,sourceClass:classification.class,entries:aux.entries,padding:aux.trailingPaddingBytes};
    fs.writeFileSync(path.join(ctx.out,'provenance-result.json'),JSON.stringify(result,null,2));
  }});
  for(const padded of [true,false])require('./retained_auxiliary_composition').main({shared:true,padded,inspect:ctx=>sharedChecks(ctx,passed)});
  console.log(JSON.stringify({status:'pass',checks:passed,fixture:report.out}));
}
if(require.main===module)main();module.exports={main};





