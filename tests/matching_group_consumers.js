'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const cp = require('child_process');
const { ROOT, sha256File } = require('../tools/lib/phase7_conventional');
const { targetRecord, publicTarget } = require('../tools/lib/matching/target_model');
const { producerView, scratchCapability, isActiveTarget } = require('../tools/lib/matching/target_model');
const { selectSweepTargets, runSweep } = require('../tools/lib/matching/sweep');
const { compileCandidate, recordCandidate } = require('../tools/lib/matching/compiler');
const { runM2c, prepareAndCompile } = require('../tools/lib/matching/m2c');
const { runProbe } = require('../tools/lib/matching/probe');
const { resolveWorkbenchActiveTarget, bindWorkbenchTarget } = require('../tools/lib/text_contract');

async function run(workbench) {
  const members = workbench.targets.filter(t => t.activeMatchingProducer?.kind === 'compilation-group');
  const groupedActive = [...workbench.activeTargetsBySymbol.values()].filter(t => t.compilationGroup);
  assert.equal(members.length, groupedActive.length);
  assert.deepEqual(producerView(null), null);
  assert.deepEqual(producerView({ source: 'src/fixture.c' }), { kind: 'standalone', source: 'src/fixture.c' });
  for (const member of members) {
    const active = resolveWorkbenchActiveTarget(groupedActive, member);
    assert.equal(member.activeMatchingSource, active.source);
    assert.deepEqual(member.activeMatchingProducer.members, active.compilationGroup.members);
    assert.equal(member.activeMatchingProducer.memberIndex, active.groupMemberIndex);
    assert(isActiveTarget(member));
    assert.equal(publicTarget(member).scratchCompilation.supported, false);
    const changed = { ...member, activeMatchingSource: 'different.c', activeMatchingProducer: null,
      scratchCompilation: { supported: true } };
    assert.deepEqual(targetRecord(member, 'fixed'), targetRecord(changed, 'fixed'));
    assert.equal(scratchCapability(workbench, changed).supported, false, 'stored/stripped metadata bypassed the live binding');
    for (const selector of [{}, { includeSolved: true }, { set: 'smallest-leaves-200' }]) {
      assert(!selectSweepTargets(workbench, selector).some(t => t.targetId === member.targetId));
    }
  }
  const separatelyLoaded = require('../tools/lib/active_targets').loadActiveTargetModel().targets;
  const aliases = members.filter(member => resolveWorkbenchActiveTarget(groupedActive,member).symbol !== member.symbol);
  // Exact physical/canonical pairs from the accepted owner and group registries.
  // The standalone row581 physical interface is not a compilation-group alias.
  const expectedAliases = [
    [48, 'boot_resource_probe_id_check_materialize', 'func_00005760', 'boot_resource_checksum_chain'],
    [49, 'boot_resource_probe_indexed_record_check', 'func_0000581C', 'boot_resource_checksum_chain'],
    [50, 'boot_resource_probe_large_record_check', 'func_00005978', 'boot_resource_checksum_chain'],
    [51, 'boot_resource_probe_small_record_check', 'func_00005A88', 'boot_resource_checksum_chain'],
    [55, 'boot_resource_probe_record_checksum_signature', 'func_00005D9C', 'boot_resource_checksum_chain'],
    [565, 'list_insert_head_000241f8', 'func_000241f8', 'thread_scheduler_000240b0'],
    [566, 'list_remove', 'func_00024250', 'thread_scheduler_000240b0'],
    [573, 'func_000246c0', 'func_000246C0', 'thread_scheduler_000240b0'],
  ];
  const actualAliases = aliases.map(member => {
    const active = resolveWorkbenchActiveTarget(groupedActive, member);
    return [member.rowIndex, member.symbol, active.symbol, active.compilationGroup.id];
  }).sort((a, b) => a[0] - b[0]);
  assert.deepEqual(actualAliases, expectedAliases, 'complete physical/canonical group alias census');
  for(const target of aliases){const active=resolveWorkbenchActiveTarget(groupedActive,target);
    assert.equal(resolveWorkbenchActiveTarget(groupedActive,{symbol:target.symbol}),active);
    assert.equal(resolveWorkbenchActiveTarget([], {symbol:target.symbol}),null);
    assert.equal(resolveWorkbenchActiveTarget([...groupedActive,...separatelyLoaded],{symbol:target.symbol}),active);
    assert.equal(scratchCapability(workbench,target,separatelyLoaded).supported,false);
    const conflicting={...active,sourceSha256:'0'.repeat(64)};
    assert.throws(()=>resolveWorkbenchActiveTarget([...groupedActive,conflicting],{symbol:target.symbol}),/ambiguous/);
    assert.throws(()=>scratchCapability(workbench,target,[conflicting]),/ambiguous/);
    for(const [field,value]of [['rowIndex',target.rowIndex+1],['romStart',target.romStart+4],['romEndExclusive',target.romEndExclusive-4],
      ['vramStart',target.vramStart+4],['vramEndExclusive',target.vramEndExclusive-4],['sectionName','.wrong'],
      ['originalAssembly','wrong.s'],['originalAssemblySha256','0'.repeat(64)]])
      assert.throws(()=>resolveWorkbenchActiveTarget(groupedActive,{symbol:target.symbol,[field]:value}),/supplied group identity drift/);
    const wrong={...active,rowIndex:active.rowIndex+1};
    assert.throws(()=>resolveWorkbenchActiveTarget(groupedActive.map(a=>a===active?wrong:a),{symbol:target.symbol}),/group owner identity drift/);
  }
  const standalone = workbench.targets.find(t => t.activeMatchingProducer?.kind === 'standalone' && t.symbolByteOffset === 0);
  assert(standalone && scratchCapability(workbench, standalone).supported);
  assert(selectSweepTargets(workbench, { includeSolved: true, symbols: [standalone.symbol] }).length === 1);
  if (!members.length) return; // An empty registry is a supported production state.
  const target = members[0];
  let sideEffects = 0;
  const original = [fs.writeFileSync, fs.mkdirSync, cp.spawnSync];
  const forbidden = () => { sideEffects++; throw new Error('unexpected side effect'); };
  fs.writeFileSync = fs.mkdirSync = cp.spawnSync = forbidden;
  try {
    for (const value of [target, { symbol: target.symbol, targetId: target.targetId }]) {
      for (const call of [
        () => recordCandidate(workbench, value, 'irrelevant'),
        () => compileCandidate(workbench, value, 'irrelevant'),
        () => runM2c(workbench, value),
        () => prepareAndCompile(workbench, value),
        () => prepareAndCompile(workbench, value, { compile: false }),
        () => runProbe(workbench, value, 'irrelevant'),
      ]) assert.throws(call, /complete group candidate/);
      await assert.rejects(runSweep(workbench, { symbols: [target.symbol] }), /complete group candidate/);
    }
    const context = { phase8: { targets: groupedActive } };
    const interiors=workbench.logicalTargets.filter(t=>['func_00005E84','func_00005EC4','func_00005F00','func_00005F60'].includes(t.symbol));
    assert.equal(interiors.length,4);
    const copies=members.filter(t=>[52,53,54].includes(t.rowIndex));assert.equal(copies.length,3);
    for(const copy of copies)assert.equal(resolveWorkbenchActiveTarget(groupedActive,copy).symbol,copy.symbol);
    for(const selected of [...aliases,...interiors,...copies]){
      for(const request of [selected,{symbol:selected.symbol}]){
        assert.throws(()=>bindWorkbenchTarget({context},request),/complete group candidate/);
        assert.throws(()=>compileCandidate({},request,'',{session:{context}}),/complete group candidate/);
        assert.throws(()=>runProbe({},request,'',{context}),/complete group candidate/);
        assert.throws(()=>prepareAndCompile({},request,{compilerSession:{context}}),/complete group candidate/);
        assert.equal(scratchCapability(workbench,request).supported,false);
        assert.equal(scratchCapability({},request,groupedActive).supported,false);
      }
      if(!interiors.includes(selected))assert.throws(()=>selectSweepTargets(workbench,{includeSolved:true,symbols:[selected.symbol]}),/complete group candidate/);
      else assert.deepEqual(selectSweepTargets(workbench,{includeSolved:true,symbols:[selected.symbol]}),[], 'logical interior cannot enter physical sweep');
    }
    for(const selected of aliases)assert.throws(()=>bindWorkbenchTarget({context},{symbol:selected.symbol,romStart:selected.romStart+4}),/supplied group identity drift/);

    const bare = { symbol: target.symbol };
    assert.throws(() => compileCandidate({}, bare, '', { session: { context } }), /complete group candidate/);
    assert.throws(() => runProbe({}, bare, '', { context }), /complete group candidate/);
    assert.throws(() => prepareAndCompile({}, bare, { compilerSession: { context } }), /complete group candidate/);
    assert.throws(() => require('../tools/lib/text_contract').bindWorkbenchTarget({ context }, bare), /complete group candidate/);
  } finally { [fs.writeFileSync, fs.mkdirSync, cp.spawnSync] = original; }
  assert.equal(sideEffects, 0);
  const database = path.join(ROOT, 'build/matching/workbench.sqlite');
  const before = fs.existsSync(database) ? sha256File(database) : null;
  for (const selected of [target,aliases[0],workbench.logicalTargets.find(t=>t.symbol==='func_00005EC4')]) for (const command of ['prepare', 'watch', 'probe']) {
    const result = cp.spawnSync(process.execPath, [path.join(ROOT, 'tools/match.js'), command, selected.symbol,
      '--source', 'must-not-be-read.c'], { cwd: ROOT, encoding: 'utf8', windowsHide: true });
    assert.equal(result.status, 1);
    assert.match(result.stderr, /complete group candidate/);
  }
  assert.equal(fs.existsSync(database) ? sha256File(database) : null, before);
}

module.exports = { run };
