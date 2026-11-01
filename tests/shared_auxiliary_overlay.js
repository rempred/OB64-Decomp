'use strict';
const assert=require('assert/strict'),fs=require('fs'),path=require('path'),inspector=require('inspector');
module.exports=async function(c){
const {active,targets,model,inputs,privateRoot,root}=c,inputSet=require(path.join(root,'tools/lib/matching/input_set'));
const session=new inspector.Session();session.connect();const post=(name,args={})=>new Promise((res,rej)=>session.post(name,args,(e,r)=>e?rej(e):res(r)));
await post('Profiler.enable');await post('Profiler.startPreciseCoverage',{callCount:true,detailed:true});
const coverage=async()=>{const {result}=await post('Profiler.takePreciseCoverage');return result.flatMap(s=>s.functions.filter(f=>['sharedAuxiliaryOverlayAuthority','parseDescriptors'].includes(f.functionName)).map(f=>({function:f.functionName,calls:f.ranges[0].count})));};
const start=performance.now();active.validateAuxiliaryOwnerGroups(targets,model);const elapsedMs=performance.now()-start,counts=await coverage();assert.equal(counts.find(c=>c.function==='sharedAuxiliaryOverlayAuthority').calls,1);assert.equal(counts.find(c=>c.function==='parseDescriptors').calls,1);
const existing=targets.slice(0,6).map(t=>({...t,auxiliarySections:t.auxiliarySections.map(a=>({...a}))}));
const tail=existing[5].auxiliarySections[0];Object.assign(tail,{ownerTailBytes:20,ownerTailSection:tail.outputSection+'.tail',ownerTailRomStartNumber:tail.romEndNumber,ownerTailRomEndNumber:tail.ownerRomEndNumber,ownerTailVramStartNumber:tail.vramEndNumber,ownerTailVramEndNumber:tail.ownerVramEndNumber});
active.validateAuxiliaryOwnerGroups(existing,model);const unchanged=await coverage();assert(unchanged.every(c=>c.calls===0));
// No mutation of proof/binding fields after ordered group finalization.
active.validateAuxiliaryOwnerGroups(targets,model);const before=JSON.stringify(targets.map(t=>({symbol:t.symbol,owners:t.textOwners,aux:t.auxiliarySections})));active.validateAuxiliaryOwnerGroups(targets,model);assert.equal(JSON.stringify(targets.map(t=>({symbol:t.symbol,owners:t.textOwners,aux:t.auxiliarySections}))),before);
const clone=()=>{const f=structuredClone({targets,model});inputSet.bind(f.model,inputs);for(const t of f.targets){t.model=f.model;t.row=f.model.rows.find(r=>r.index===t.row.index);if(t.rows)t.rows=t.rows.map(r=>f.model.rows.find(x=>x.index===r.index));for(const o of t.textOwners)o.row=f.model.rows.find(r=>r.index===o.rowIndex);}return f;};
const cases=[
['missing model',f=>{f.model=null}],['missing descriptor',f=>f.model.overlays.splice(12,1)],['duplicate descriptor',f=>f.model.overlays.push(f.model.overlays[12])],['forged reservation',f=>{f.model.overlays[12].raw_sha256='0'.repeat(64)}],['coordinated model endpoints',f=>{f.model.overlays[12].vram_start+=4;f.model.linkerInputs.overlayReservations[12].vram_start+=4;}],['independent accepted pin',f=>{f.model.config.acceptedInputSha256['config/overlays/us_rev0.json']='0'.repeat(64)}],['wrong section',f=>{f.targets[6].row.slices[0].overlaySection='data-rodata'}],['wrong descriptor',f=>{f.targets[6].row.slices[0].overlayDescriptorId=11}],['slab marker',f=>{f.targets[6].row.slices[0].loadSlabId='forged'}],['ROM-only',f=>{f.targets[6].row.slices[0].placementKind='rom-only'}],['shifted RAM end',f=>{f.targets[6].row.slices[0].vramEndExclusive+=4}],['retained full-row endpoint',f=>{f.targets[5].row.slices[1].vramEndExclusive+=4}],['retained whole-row extent',f=>{f.targets[5].row.romEndExclusive+=4}],['text chunk',f=>{f.targets[6].textOwners[0].chunkIndex=38}],['data chunk',f=>{f.targets[6].auxiliarySections[0].ownerChunkIndex=38}],['source hash',f=>{f.targets[6].textOwners[0].originalAssemblySha256='0'.repeat(64)}],['missing owner',f=>{f.targets[6].textOwners=[]}],['duplicated owner',f=>{f.targets[6].textOwners.push(f.targets[6].textOwners[0])}],['duplicate member',f=>{f.targets.push(f.targets[6])}],['reordered fragments',f=>f.targets.reverse()],['missing fragment',f=>f.targets.splice(1,1)],['old C09C tail',f=>{f.targets[5].auxiliarySections[0]=structuredClone(existing[5].auxiliarySections[0])}],['bundle mode excluded',f=>{f.targets[6].compilationGroupId='unsupported'}],['fragment overlap',f=>{f.targets[6].auxiliarySections[0].romStartNumber-=4}],['forged data identity',f=>{f.targets[6].auxiliarySections[0].ownerOriginalAssemblySha256='0'.repeat(64)}],['native padding claimed as row',f=>{f.targets[6].auxiliarySections[0].romEndNumber+=4}],
];
const negatives=[];for(const [name,mutate]of cases){const f=clone();mutate(f);let failure;try{active.validateAuxiliaryOwnerGroups(f.targets,f.model)}catch(e){failure=e.message}assert(failure,name+' unexpectedly accepted');negatives.push({name,failure});}
// Real descriptor reservations already overlap VRAM; the genuine positive must pass.
assert(model.overlays.some((a,i)=>model.overlays.some((b,j)=>i!==j&&a.vram_start<b.vram_end_exclusive&&a.vram_end_exclusive>b.vram_start)));
await post('Profiler.stopPreciseCoverage');session.disconnect();
const multiGroup=await require('./shared_auxiliary_overlay_groups')(c),selectedInputs=require('./shared_auxiliary_overlay_inputs')(c);
const report={diagnostic:true,multiGroup,selectedInputs,positive:'real seven, actual retained340, actual overlapping VRAM',elapsedMs,qualifyingInvocationCounts:counts,sameChunkCounts:unchanged,negatives,finalizationNoMutation:true,limitations:['Private loader executes staged code but installed fingerprint readers still hash preimages.','No installed CURRENT/acceptance claim.']};fs.writeFileSync(path.join(privateRoot,'placement-report.json'),JSON.stringify(report,null,2)+'\n');console.log('PASS placement '+negatives.length+' negatives; '+elapsedMs.toFixed(1)+'ms');return report;
};
function context(options={}) {
  const root=path.resolve(__dirname,'..'),p7=require('../tools/lib/phase7_conventional'),active=require('../tools/lib/active_targets'),inputSet=require('../tools/lib/matching/input_set');
  const inputs=options.inputs?inputSet.openInputSet(options.inputs):undefined;
  const phase8=active.loadActiveTargetModel({inputs}),model=phase8.model;
  const targets=phase8.targets.filter(t=>t.auxiliarySections.some(a=>a.outputSection==='.ob64.r4933'));
  assert.equal(targets.length,7,'requires the complete seven-producer configuration');
  const privateRoot=path.resolve(options.output||path.join(root,'build/tests/shared-auxiliary-overlay'));
  assert(privateRoot.startsWith(path.join(root,'build')+path.sep));fs.mkdirSync(privateRoot,{recursive:true});
  return {root,privateRoot,inputs,phase8,model,targets,active,p7,rom:inputSet.read(inputs,path.join(root,'build/baserom.us_rev0.z64')),hash:p7.sha256Buffer};
}
module.exports.context=context;
if(require.main===module){const value=flag=>{const i=process.argv.indexOf(flag);return i<0?undefined:process.argv[i+1];};module.exports(context({inputs:value('--inputs'),output:value('--output')})).catch(e=>{console.error(e);process.exitCode=1;});}
