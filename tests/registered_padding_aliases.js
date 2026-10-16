'use strict';
const assert=require('assert');
const tm=require('../tools/lib/matching/target_model');
function run(w){
  const targets=w.targets.filter(t=>t.selectionKind==='registered-padding-producer');
  const rows=values=>values.map(v=>v.rowIndex??v.index).sort((a,b)=>a-b);
  assert.deepStrictEqual(rows(targets),rows(w.model.config.retainedPaddingCuts));
  assert.deepStrictEqual(rows(targets),rows(w.model.rows.filter(r=>r.retainedPadding)));
  let aliases=0,rejected=0;
  for(const target of targets){
    tm.assertExecutablePrefixSelection(w,target);
    const record=tm.targetRecord(target),metadata={...record.metadata};delete metadata.expectedBytesSha256;
    assert.equal(record.targetId,tm.digest({modelId:w.modelId,metadata,expectedBytesSha256:target.expectedBytesSha256}));
    for(const alias of (target.logicalAliases||[]).filter(a=>a.toLowerCase()!==target.symbol.toLowerCase())){
      const selected=tm.resolveTarget(w,alias.toUpperCase());assert.equal(selected.targetId,target.targetId);
      assert.equal(selected.requestedSymbol,alias.toUpperCase());assert(tm.historicalSymbols(target).includes(alias.toLowerCase()));
      assert.throws(()=>tm.assertExecutablePrefixSelection(w,selected),/requested partial entry/);aliases++;
    }
    if(!target.logicalAliases)continue;
    const body=w.logicalRegistry.bodies.find(b=>b.symbol===target.symbol),reject=fn=>{assert.throws(fn);rejected++;};
    reject(()=>tm.applyRegisteredAliasCorrection(w,[{...target,row:structuredClone(target.row)}],w.logicalRegistry,body));
    reject(()=>tm.applyRegisteredAliasCorrection(w,[target],structuredClone(w.logicalRegistry),body));
    reject(()=>tm.applyRegisteredAliasCorrection(w,[{...target,selectionKind:'logical-body'}],w.logicalRegistry,body));
    reject(()=>tm.applyRegisteredAliasCorrection(w,[{...target,bytes:target.bytes-4}],w.logicalRegistry,body));
    reject(()=>tm.applyRegisteredAliasCorrection(w,[target,{...target,row:null,symbol:'other',romStart:target.romStart+4}],w.logicalRegistry,body));
    reject(()=>tm.applyRegisteredAliasCorrection(w,[target,{...target,row:null,symbol:body.aliases[0],romStart:0,romEndExclusive:4}],w.logicalRegistry,body));
    for(const mutate of [b=>b.romStart+=4,b=>b.romEndExclusive-=4,b=>b.fragments.push({...b.fragments[0]}),b=>b.symbol=body.aliases[0],b=>b.fragments[0].rowIndex++,b=>b.romStart=target.row.romEndExclusive-4]){
      const changed=structuredClone(body);mutate(changed);reject(()=>tm.applyRegisteredAliasCorrection(w,[target],w.logicalRegistry,changed));
    }
  }
  for(const target of targets.filter(t=>t.logicalFunctions.length>1)){
    for(const body of w.logicalRegistry.bodies.filter(b=>b.fragments[0].rowIndex===target.rowIndex)){
      assert.throws(()=>tm.applyRegisteredAliasCorrection(w,[target],w.logicalRegistry,body));rejected++;
    }
  }
  const reference=tm.loadWorkbenchModel({requireBaserom:false});
  assert.strictEqual(reference.baserom,null);
  assert(reference.targets.every(t=>t.expectedBytes===null&&t.expectedBytesSha256===null));
  assert.deepStrictEqual(reference.targets.map(t=>t.rowIndex),w.targets.map(t=>t.rowIndex));
  const referenceTargets=reference.targets.filter(t=>t.selectionKind==='registered-padding-producer');
  assert.deepStrictEqual(rows(referenceTargets),rows(targets));
  for(const t of referenceTargets){
    const normal=targets.find(n=>n.rowIndex===t.rowIndex);
    for(const key of ['selectionKind','logicalFunctions','logicalCoverage','originalOwner','logicalAliases'])assert.deepStrictEqual(t[key],normal[key]);
    assert.throws(()=>require('../tools/lib/logical_functions').assertRetainedPaddingProducer(reference.logicalRegistry,t.row));
    if(t.logicalAliases){const body=reference.logicalRegistry.bodies.find(b=>b.symbol===t.symbol);assert.throws(()=>tm.applyRegisteredAliasCorrection(reference,[t],reference.logicalRegistry,body));}
    for(const alias of (t.logicalAliases||[]).filter(a=>a!==t.symbol)){const selected=tm.resolveTarget(reference,alias);assert.equal(selected.requestedSymbol,alias);assert.throws(()=>tm.assertExecutablePrefixSelection(reference,selected),/requested partial entry/);}
  }
  return {registered:targets.length,aliases,rejected,referenceOnlyTargets:reference.targets.length};
}
module.exports={run};
