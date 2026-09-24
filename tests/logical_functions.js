'use strict';
const assert = require('assert');
const fs = require('fs');
const registry = require('../tools/lib/logical_functions');
const targetModel = require('../tools/lib/matching/target_model');
const { emitM2cAssembly, discoverOverlayJumpTables } = require('../tools/lib/matching/assembly');
const { instructionInfo, wordsFromBuffer } = require('../tools/lib/matching/mips_analysis');
const { validateLogicalFunctionCensus } = require('../tools/lib/matching/compiler');
const { loadActiveTargetModel } = require('../tools/lib/active_targets');
const { syncTargets, recordCandidate, candidateRecord } = require('../tools/lib/matching/compiler');
const { requestStore } = require('../tools/lib/matching/store');
const path = require('path');
const workbench = targetModel.loadWorkbenchModel();
const config = JSON.parse(fs.readFileSync(registry.CONFIG_PATH));
const clone = value => structuredClone(value);
let controls = 0;
function rejects(mutator, pattern) {
  const changed = clone(config); mutator(changed);
  assert.throws(() => registry.loadRegistry(workbench.model, workbench.baserom, changed), pattern); controls++;
}
rejects(c => c.bodies[0].fragments.pop(), /fragment/);
rejects(c => c.bodies.reverse(), /reordered/);
rejects(c => c.bodies[1].romStart = c.bodies[0].romStart, /overlapping/);
rejects(c => c.bodies[1].aliases.push(c.bodies[0].symbol.toLowerCase()), /alias collision/);
rejects(c => c.bodies[0].fragments[0].ownerOffset++, /fragment/);
rejects(c => c.bodies[0].fragments[0].sha256 = '0'.repeat(64), /fallback/);
rejects(c => c.bodies[0].expectedBytesSha256 = '0'.repeat(64), /hash drift/);
rejects(c => c.bodies[0].evidence.status = 'probable-unreferenced-function', /malformed/);
rejects(c => c.padding[0].expectedBytesSha256 = '0'.repeat(64), /padding hash/);
rejects(c => c.padding[0].romEndExclusive = workbench.baserom.length + 4, /invalid padding/);
rejects(c => c.preservedProductionEnvelopes.push(clone(c.preservedProductionEnvelopes[0])), /preserved producer/);
rejects(c => c.preservedProductionEnvelopes[0].compilerTextFunctions[0].bytes -= 4, /coverage drift/);
rejects(c => c.unavailableBodies.push({ ...c.bodies[0], reason: 'assumed-map' }), /unavailable/);
rejects(c => c.unavailableBodies.push({ ...c.bodies.shift(), reason: 'runtime-placement-unqualified' }), /qualified placement/);
assert.equal(workbench.logicalRegistry.unavailableBodies.length, 0);
for (const [start,end] of [[0x1782C0,0x17841C],[0x178450,0x178A44],[0x1C9050,0x1C906C],
  [0x2B3300,0x2B3494],[0x2B3494,0x2B3704]]) {
  const body=workbench.logicalRegistry.bodies.find(body=>body.romStart===start);
  assert(body);assert.equal(body.romEndExclusive,end);
  assert(body.fragments.every(fragment=>fragment.placementKind==='non-descriptor-load-slab'));
}
assert.throws(()=>registry.intersections(workbench.model,0x1C904C,0x1C9074),/unqualified|placement/);controls++;
const unqualified = clone(workbench.model);
unqualified.rows.find(row => row.index === config.bodies[0].fragments[0].rowIndex).slices[0].placementKind = 'rom-only';
assert.throws(() => registry.loadRegistry(unqualified, workbench.baserom), /unqualified/); controls++;
const spans = [[0xe6f8,0xea98,'func_0000E708'],[0xd0b84,0xd110c,'func_000D0B8C'],
  [0xee050,0xee094,'func_000EE058'],[0x1cfe68,0x1d013c,'func_001CFE70'],
  [0x261d24,0x261d7c,'func_00261D60'],[0x2664b0,0x2667c0,'func_00266550'],
  [0x267990,0x267d98,'func_00267994'],[0x2806f8,0x280b34,'func_00280700'],
  [0x2b3494,0x2b3704,'func_002B349C']];
for (const [start,end,alias] of spans) {
  const target = targetModel.resolveTarget(workbench, alias.toLowerCase());
  assert.equal(target.romStart,start); assert.equal(target.romEndExclusive,end);
  assert.equal(target.logicalFunctions.length,1); assert.equal(target.logicalCoverageComplete,true);
  assert.equal(target.requestedSymbol || target.symbol,alias.toLowerCase());
  const assembly = emitM2cAssembly(target,workbench);
  assert.equal((assembly.match(/glabel (?!jtbl_)/g)||[]).length,1);
  assert(assembly.includes(start.toString(16).toUpperCase().padStart(8,'0')));
  assert.throws(() => registry.assertActivationCompatible(workbench.logicalRegistry,alias,
    [workbench.model.rows.find(row => row.romStart <= start && row.romEndExclusive > start)]), /logical body|logical-body/); controls++;
}
for (const [start,length,count] of [[0x488cc,92,2],[0x7768,644,5],[0x8a58,788,2],[0x1cf9c0,160,2]]) {
  const target = workbench.targets.find(target => target.romStart === start);
  assert.equal(target.bytes,length); assert.equal(target.logicalFunctions.length,count);
  targetModel.assertScratchCapability(workbench,target);
  const assembly = emitM2cAssembly(target,workbench);
  for (const body of target.logicalFunctions) assert(assembly.includes(`glabel ${body.symbol}`));
  const changed = {...target,logicalCoverage:clone(target.logicalCoverage)};
  changed.logicalCoverage[0].kind='unknown';
  assert.throws(() => targetModel.assertScratchCapability(workbench,changed), /resolved logical coverage/); controls++;
}
const helper=targetModel.resolveTarget(workbench,'func_0000780C');
assert.equal(helper.bytes,80); assert.equal(helper.selectionKind,'logical-body');
assert.equal(targetModel.resolveTarget(workbench,'func_0000E3F0').targetId,
  targetModel.resolveTarget(workbench,'boot_decode_huffman_symbol').targetId);
const snapshots=[...workbench.targets,...workbench.logicalTargets];
assert.equal(new Set(snapshots.map(target=>target.targetId)).size,snapshots.length);
for(const body of workbench.logicalRegistry.bodies) {
  const selected=targetModel.resolveTarget(workbench,body.symbol);
  assert(selected.logicalFunctions.some(fn=>fn.romStart===body.romStart&&fn.romEndExclusive===body.romEndExclusive));
  if(selected.selectionKind==='logical-body') {
    assert.equal(selected.romStart,body.romStart);assert.equal(selected.romEndExclusive,body.romEndExclusive);
  }
  assert(snapshots.filter(target=>target.selectionKind==='logical-body'
    &&target.romStart===body.romStart&&target.romEndExclusive===body.romEndExclusive).length<=1);
  for(const alias of body.aliases)assert.equal(targetModel.resolveTarget(workbench,alias).targetId,selected.targetId);
}
assert.equal(targetModel.scratchCapability(workbench,{...helper,placementKind:'rom-only'}).code,'unqualified-runtime-placement');controls++;
const grouped=[...workbench.activeTargetsBySymbol.values()].find(target=>target.compilationGroup);
assert.equal(targetModel.scratchCapability(workbench,{...helper,symbol:'hidden_group_alias',romStart:grouped.romStartNumber,
  romEndExclusive:grouped.romEndNumber}).code,'complete-group-candidate-required');controls++;
const tableTarget=targetModel.resolveTarget(workbench,'func_000D0B8C');
const infos=wordsFromBuffer(tableTarget.expectedBytes).map((word,index)=>instructionInfo(word,tableTarget.vramStart+index*4));
const tables=discoverOverlayJumpTables(tableTarget,workbench,infos);
assert.deepEqual(tables.map(table=>[table.tableRom,table.entryCount]),[[0xdcfc0,11],[0xdcff0,11]]);
for(const change of [
  changed=>{changed[tables[0].jrIndex-5].op=5;},
  changed=>{changed[tables[0].jrIndex-6].rs=30;},
  changed=>{changed[tables[0].jrIndex-6].rt=changed[tables[0].jrIndex-6].rs;},
  changed=>{changed[tables[0].jrIndex-5].rs=30;},
]) {const changed=clone(infos);change(changed);assert.equal(discoverOverlayJumpTables(tableTarget,workbench,changed).length,1);controls++;}
const tableSlice=workbench.model.slices.find(slice=>slice.loadSlabId===tableTarget.loadSlabId&&slice.romStart<=0xdcfc0&&slice.romEndExclusive>0xdcfc0);
assert.equal(discoverOverlayJumpTables(tableTarget,{...workbench,model:{...workbench.model,slices:[...workbench.model.slices,tableSlice]}},infos).length,0);controls++;
assert.equal(discoverOverlayJumpTables({...tableTarget,loadSlabId:'unproved'},workbench,infos).length,0);controls++;
for(const replacement of [{...tableSlice,executable:true},{...tableSlice,vramEndExclusive:0x801f0564}]) {
  const changed={...workbench,model:{...workbench.model,slices:workbench.model.slices.map(slice=>slice===tableSlice?replacement:slice)}};
  assert.equal(discoverOverlayJumpTables(tableTarget,changed,infos).length,0);controls++;
}
const tableBytes=Buffer.from(workbench.baserom);tableBytes.writeUInt32BE(tableTarget.vramEndExclusive,tables[0].tableRom);
assert.equal(discoverOverlayJumpTables(tableTarget,{...workbench,baserom:tableBytes},infos).length,1);controls++;
const functions=[{name:'first',value:0,size:12,binding:1,visibility:0,symbolType:2},
  {name:'second',value:12,size:20,binding:1,visibility:0,symbolType:2}];
assert.equal(validateLogicalFunctionCensus(functions,[{symbol:'first'},{symbol:'second'}],32),32);
for(const changed of [functions.slice(0,1),[functions[1],functions[0]].map((f,i)=>({...f,value:i*12})),
  functions.map((f,i)=>({...f,value:i?8:0})),functions.map((f,i)=>({...f,value:i?16:0}))]) {
  assert.throws(()=>validateLogicalFunctionCensus(changed,[{symbol:'first'},{symbol:'second'}],40),/census|malformed/);controls++;
}
assert.equal(loadActiveTargetModel().targets.length,650);
const fixtureRoot=fs.mkdtempSync(path.resolve('build/logical-functions-test-'));
const interiorFile=path.join(fixtureRoot,'interior.s');
fs.writeFileSync(interiorFile,'.text\n.word 0\n.Linterior:\n.word 0\n');
assert.throws(()=>registry.assertActivationCompatible({bodies:[],aliases:new Map(),preservedProductionEnvelopes:[]},'.Linterior',
  [{romStart:0,romEndExclusive:8,part:{name:'owner',file:path.relative(path.resolve('.'),interiorFile)}}]),/interior assembly-label/);controls++;
const storeOptions={database:path.join(fixtureRoot,'workbench.sqlite')};
const synced=syncTargets(workbench,storeOptions);
const helperCandidate=recordCandidate(workbench,helper,'int func_0000780C(int a) { return a; }',{
  matchingRoot:fixtureRoot,storeOptions,syncTargets:false});
assert.equal(helperCandidate.candidate.targetId,helper.targetId);
const aliasTarget=targetModel.resolveTarget(workbench,'func_00261D60');
assert.deepEqual(targetModel.targetRecord(aliasTarget).metadata,targetModel.targetRecord(workbench.bySymbol.get(aliasTarget.symbol.toLowerCase())).metadata);
const oldTarget={...aliasTarget,symbol:'func_00261D60',targetId:'A'.repeat(64),modelId:'B'.repeat(64)};
requestStore({action:'upsert_targets',records:[targetModel.targetRecord(oldTarget)]},storeOptions);
const oldCandidate=candidateRecord(oldTarget,'int func_00261D60(void) { return 0; }',{origin:'research-import'});
requestStore({action:'put_candidate',record:oldCandidate},storeOptions);
const history=requestStore({action:'query',name:'history',args:{modelId:workbench.modelId,symbol:aliasTarget.symbol,
  symbols:targetModel.historicalSymbols(aliasTarget),limit:10}},storeOptions);
assert.equal(history.length,1);assert.equal(history[0].symbol,'func_00261D60');assert.equal(history[0].is_stale,1);
assert.equal(history[0].target_id,oldTarget.targetId);
const researchRows=requestStore({action:'query',name:'research_intake',args:{symbol:'func_00261d60',limit:10}},storeOptions);
assert.equal(researchRows.length,1);assert.equal(researchRows[0].symbol,'func_00261D60');
console.log(`logical functions: nine spans, five newly placed bodies, four complete envelopes, helper store/alias history and ${controls} negative controls pass`);
