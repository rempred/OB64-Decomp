'use strict';
const assert=require('assert'),fs=require('fs'),path=require('path');
const p7=require('../tools/lib/phase7_conventional'),logical=require('../tools/lib/logical_functions');
const active=require('../tools/lib/active_targets'),p8=require('../tools/lib/phase8_matching_c'),workbench=require('../tools/lib/matching/target_model');
const {validateLogicalFunctionCensus}=require('../tools/lib/matching/compiler');
const clone=v=>JSON.parse(JSON.stringify(v));
function main(){
 const model=p7.loadAcceptedModel(),rom=fs.readFileSync(path.join(p7.ROOT,'build/baserom.us_rev0.z64'));
 const registry=logical.loadRegistry(model,rom);let controls=0;
 const reject=(fn,pattern=/retained padding|fragment|placement|coverage|entry/)=>{assert.throws(fn,pattern);controls++;};
 for(const index of [58,2327,2351]){
  const row=model.rows[index],edge=p7.retainedPaddingSlices(row),binding=logical.assertRetainedPaddingProducer(registry,row);
  assert.equal(row.slices.length,2);assert(row.slices.every(s=>s.executable));assert(row.slices.every(s=>s.nonExecutableRangeId===null));
  const symbol=binding.bodies[0].symbol, resolved=active.resolveAcceptedRows(model,symbol,new Map(),null,registry);
  const functions=binding.bodies.map((b,i)=>({symbol:b.symbol,offsetNumber:b.romStart-edge.body.romStart,offset:'0x'+(b.romStart-edge.body.romStart).toString(16).toUpperCase().padStart(8,'0'),bytes:b.romEndExclusive-b.romStart,binding:i?'LOCAL':'GLOBAL',entryEvidence:edge.record.compilerFunctions[i].entryEvidence}));
  logical.assertActivationCompatible(registry,symbol,[row],functions);
  const target={symbol,row,rows:[row],textOwners:resolved.owners,bytes:edge.body.bytes,compilerTextFunctions:functions,auxiliarySections:[]};
  const account=require('../tools/lib/status_accounting').summarizeAcceptedOwnership(model,[target]);
  assert.equal(account.assembly.rows.find(r=>r.rowIndex===index).bytes,index===58?8:index===2327?12:4);
  assert.equal(account.replacements.bytes,edge.body.bytes);
  const retained=p8.targetRetainedAssemblySlices(target);assert.equal(retained.length,1);assert.equal(retained[0].executable,true);assert.equal(retained[0].bytes,index===58?8:index===2327?12:4);
  assert.equal(target.bytes+retained[0].bytes,row.bytes);
  const authority={model,baserom:rom,multiOwnerContracts:new Map(),multiOwnerConfigIdentity:{sha256:'test'}};
  const selection=workbench.retainedPaddingSelection(authority,row,rom);
  assert.equal(selection.logicalFunctions.length,index===58?3:1);
  assert.deepEqual(selection.originalOwner.slices.map(s=>s.comparisonRole),index!==2351?['compared-complete-producer','retained-original-assembly']:['retained-original-assembly','compared-complete-producer']);
  const selected={...selection,expectedBytes:rom.subarray(selection.romStart,selection.romEndExclusive),expectedBytesSha256:p7.sha256Buffer(rom.subarray(selection.romStart,selection.romEndExclusive))};
  workbench.assertExecutablePrefixSelection(authority,selected);
  const native=selection.logicalFunctions.map((fn,i)=>({name:fn.symbol,value:fn.offset,size:fn.bytes,binding:i?0:1,visibility:0,symbolType:2}));
  const bindings=selection.logicalFunctions.map(fn=>fn.binding);
  assert.equal(validateLogicalFunctionCensus(native,selection.logicalFunctions,selection.bytes,bindings),selection.bytes);
  if(index===58){
    reject(()=>validateLogicalFunctionCensus(native,selection.logicalFunctions,selection.bytes),/scratch object/);
    reject(()=>validateLogicalFunctionCensus(native,selection.logicalFunctions,selection.bytes,bindings.slice(1)),/binding/);
    const wrong=clone(native);wrong[1].binding=1;reject(()=>validateLogicalFunctionCensus(wrong,selection.logicalFunctions,selection.bytes,bindings),/scratch object/);
    const forged=clone(selected);forged.expectedBytes=selected.expectedBytes;forged.logicalFunctions[1].binding='GLOBAL';reject(()=>workbench.assertExecutablePrefixSelection(authority,forged),/identity/);
  }
  reject(()=>workbench.assertExecutablePrefixSelection(authority,{...selected,bytes:selected.bytes+4}),/identity/);
  const bad=clone(selected);bad.expectedBytes=selected.expectedBytes;bad.originalOwner.slices.find(s=>s.retainedPaddingId).comparisonRole='compared-complete-producer';
  reject(()=>workbench.assertExecutablePrefixSelection(authority,bad),/identity/);
  reject(()=>active.resolveAcceptedRows(model,'func_'+edge.retained.romStart.toString(16).toUpperCase().padStart(8,'0'),new Map(),null,registry),/retained padding|resolve/);
  reject(()=>logical.assertActivationCompatible(registry,symbol,[row],functions.slice(0,-1)),/census/);
  const forged=clone(row);forged.slices.find(s=>s.retainedPaddingId).executable=false;reject(()=>p7.retainedPaddingSlices(forged));
 }
 // A zero JR delay slot is not padding: binding follows registry body end.
 const cfg=JSON.parse(fs.readFileSync(path.join(p7.ROOT,'config/phase7/conventional-build.json')));
 const bad=clone(cfg);bad.retainedPaddingCuts[0].romStart=0x68d4;bad.retainedPaddingCuts[0].expectedSha256=p7.sha256Buffer(Buffer.alloc(12));
 // Structural literal-zero validation alone is deliberately not activation authority.
 p7.validateRetainedPaddingCuts(bad,model.semantic.rows,model.parts);
 const regConfig=JSON.parse(fs.readFileSync(logical.CONFIG_PATH));const body=regConfig.bodies.find(b=>b.romEndExclusive===0x68d8);assert(body);assert.equal(rom.readUInt32BE(0x68d0),0x03e00008);assert.equal(rom.readUInt32BE(0x68d4),0);
 const wrongModel=clone(model),r=wrongModel.rows[58];r.retainedPadding=bad.retainedPaddingCuts[0];r.slices[0].romEndExclusive-=4;r.slices[0].vramEndExclusive-=4;r.slices[0].bytes-=4;r.slices[1].romStart-=4;r.slices[1].vramStart-=4;r.slices[1].bytes+=4;
 reject(()=>logical.loadRegistry(wrongModel,rom,regConfig));
 const duplicate=clone(cfg);duplicate.retainedPaddingCuts.push(clone(duplicate.retainedPaddingCuts[0]));duplicate.expected.retainedPaddingCuts++;reject(()=>p7.validateRetainedPaddingCuts(duplicate,model.semantic.rows,model.parts));
 const nonzero=clone(cfg);nonzero.retainedPaddingCuts[1].romEndExclusive+=4;reject(()=>p7.validateRetainedPaddingCuts(nonzero,model.semantic.rows,model.parts));
 const wb=workbench.loadWorkbenchModel();
 for(const name of ['func_000068D8','func_000068DC','func_00120BBC'])reject(()=>workbench.resolveTarget(wb,name),/does not resolve/);
 assert.equal(workbench.resolveTarget(wb,'func_000065E4').logicalFunctions.length,3);
 const layoutRoot=fs.mkdtempSync(path.join((fs.mkdirSync(path.join(p7.ROOT,'build/registered-padding-layout'),{recursive:true}),path.join(p7.ROOT,'build/registered-padding-layout')),'case-'));
 require('../tools/build_phase7_conventional').writeLayout(model,layoutRoot);
 const layout=JSON.parse(fs.readFileSync(path.join(layoutRoot,'layout.json')));assert.equal(p7.verifyLayoutAgainstModel(model,layout),true);
 delete layout.owners.find(r=>r.index===58).slices[1].retainedPaddingId;
 reject(()=>p7.verifyLayoutAgainstModel(model,layout),/slice drift/);
 const legacy=[{name:'ordinary',value:0,size:8,binding:1,visibility:0,symbolType:2}];assert.equal(validateLogicalFunctionCensus(legacy,[{symbol:'ordinary'}],8),8);
 console.log(JSON.stringify({status:'pass',controls,rows:[58,2327,2351],native:false}));return {controls};
}
if(require.main===module)main();module.exports={main};
