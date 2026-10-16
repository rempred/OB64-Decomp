'use strict';
const assert = require('assert'), fs = require('fs'), path = require('path');
const p7 = require('../tools/lib/phase7_conventional');
const logical = require('../tools/lib/logical_functions');
const active = require('../tools/lib/active_targets');
function run(context = active.loadActiveTargetModel(), api = active) {
  const rom = fs.readFileSync(path.join(p7.ROOT, 'build/baserom.us_rev0.z64'));
  const registry = logical.loadRegistry(context.model, rom);
  const read = file => fs.readFileSync(path.join(p7.ROOT, file), 'utf8');
  let controls = 0;
  const reject = callback => { assert.throws(callback); controls++; };
  // This existing producer supplies real authenticated authority, not a copied fixture.
  const target = context.targets.find(t => t.row.retainedPadding && t.relocationContractSource === 'canonical'
    && !t.auxiliarySections.length && p7.retainedPaddingSlices(t.row).record.edge === 'terminal');
  assert(target);
  const legacy = { sectionName: '.ob64.r' + String(target.row.index).padStart(4, '0') };
  const call = (t = target, l = legacy, r = registry, source = read) => api.legacyComparisonView(t, l, r, rom, source);
  if (target.physicalInterface) reject(() => logical.physicalInterface({...target,physicalInterface:{...target.physicalInterface,offset:4}}));
  const before = JSON.stringify(target), view = call();
  assert.strictEqual(JSON.stringify(target), before);
  assert.equal(view.target.bytes, target.row.bytes);
  assert.equal(view.composition.body.bytes + view.composition.retainedAssembly.bytes, target.row.bytes);
  assert.equal(view.target.expectedTextSha256, p7.sha256Buffer(rom.subarray(target.row.romStart, target.row.romEndExclusive)));
  for (const row of context.model.rows.filter(r => r.slices.length === 1)) {
    assert.equal('.ob64.r' + String(row.index).padStart(4, '0'), row.slices[0].sectionName);
  }
  const split = context.targets.find(t => t.symbol === 'func_0011B344');
  const splitLegacy = context.legacyConfig.targets.find(t => t.symbol === split.symbol);
  assert.strictEqual(call(split, splitLegacy).target, split);
  assert.strictEqual(call(split, splitLegacy).composition, null);
  assert.equal(context.compatibility.find(t => t.symbol === split.symbol).comparisons.length, 13);
  for (const change of [
    {relocationContractSource:'legacy-compatibility'}, {multiOwner:true}, {multiOwnerContract:{}},
    {compilationGroupId:'forged'}, {compilationGroup:{}}, {auxiliarySections:[{}]},
    {auxiliaryProjection:{}}, {atomicText:{}}, {nativeTextTail:{}},
    {rows:[]}, {textOwners:[]}, {bytes:target.bytes+4},
    {romEndNumber:target.romEndNumber+4}, {vramStartNumber:target.vramStartNumber+4},
    {vramEndNumber:target.vramEndNumber+4}, {sectionName:target.sectionName+'bad'},
    {expectedTextSha256:'0'.repeat(64)}, {compilerTextFunctions:[]}, {symbol:'forged'},
  ]) reject(() => call({...target,...change}));
  reject(() => call(target, legacy, JSON.parse(JSON.stringify(registry))));
  const row = JSON.parse(JSON.stringify(target.row));
  reject(() => call({...target,row,rows:[row]}));
  reject(() => call(target, {...legacy,sectionName:'.ob64.wrong'}));
  reject(() => call(target, legacy, registry, file => read(file)+'\n'));
  const leading = context.model.rows.find(row => row.retainedPadding?.edge === 'leading');
  assert(leading);
  reject(() => call({...target,row:leading,rows:[leading]}, {sectionName:'.ob64.r'+String(leading.index).padStart(4,'0')}));
  // No registry or cut means no new equivalence permission: caller keeps exact comparisons.
  assert.strictEqual(call({...target,row:{...target.row,retainedPadding:null}}).composition,null);
  return {status:'pass',controls,wholeOwnerBytes:view.target.bytes,bodyBytes:target.bytes};
}
if (require.main === module) console.log(JSON.stringify(run()));
module.exports = {run};

