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

async function run(workbench) {
  const members = workbench.targets.filter(t => t.activeMatchingProducer?.kind === 'compilation-group');
  const groupedActive = [...workbench.activeTargetsBySymbol.values()].filter(t => t.compilationGroup);
  assert.equal(members.length, groupedActive.length);
  assert.deepEqual(producerView(null), null);
  assert.deepEqual(producerView({ source: 'src/fixture.c' }), { kind: 'standalone', source: 'src/fixture.c' });
  for (const member of members) {
    const active = workbench.activeTargetsBySymbol.get(member.symbol.toLowerCase());
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
    const bare = { symbol: target.symbol };
    assert.throws(() => compileCandidate({}, bare, '', { session: { context } }), /complete group candidate/);
    assert.throws(() => runProbe({}, bare, '', { context }), /complete group candidate/);
    assert.throws(() => prepareAndCompile({}, bare, { compilerSession: { context } }), /complete group candidate/);
    assert.throws(() => require('../tools/lib/text_contract').bindWorkbenchTarget({ context }, bare), /complete group candidate/);
  } finally { [fs.writeFileSync, fs.mkdirSync, cp.spawnSync] = original; }
  assert.equal(sideEffects, 0);
  const database = path.join(ROOT, 'build/matching/workbench.sqlite');
  const before = fs.existsSync(database) ? sha256File(database) : null;
  for (const command of ['prepare', 'watch', 'probe']) {
    const result = cp.spawnSync(process.execPath, [path.join(ROOT, 'tools/match.js'), command, target.symbol,
      '--source', 'must-not-be-read.c'], { cwd: ROOT, encoding: 'utf8', windowsHide: true });
    assert.equal(result.status, 1);
    assert.match(result.stderr, /complete group candidate/);
  }
  assert.equal(fs.existsSync(database) ? sha256File(database) : null, before);
}

module.exports = { run };
