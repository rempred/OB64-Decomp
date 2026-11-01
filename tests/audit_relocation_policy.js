'use strict';
const assert = require('assert/strict');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { validateRetiredPdrEvidence } = require('../tools/audit');

function fixture(lengths) {
  const targets = lengths.map((length, index) => ({
    symbol: 'target_' + index, relocationContractSource: index % 2 ? 'canonical' : 'legacy-compatibility',
    expectedRelocations: [{ section: '.rel.text', type: 'R_MIPS_26', offset: '0x00000000', symbol: 'provider' }],
    legacyAncillaryRelocations: Array.from({ length }, (_, i) => ({ section: '.rel.pdr', type: 'R_MIPS_32',
      offset: '0x' + (i * 32).toString(16).padStart(8, '0'), symbol: i ? 'secondary_function' : 'target_' + index })),
  }));
  return { targets, evidence: {
    counts: { proofTargets: targets.length, retiredPdrRelocations: lengths.reduce((a, b) => a + b, 0) },
    targets: targets.map(t => ({ symbol: t.symbol, relocationContractSource: t.relocationContractSource,
      retiredPdrRelocations: t.legacyAncillaryRelocations.length })),
  } };
}

function main(options = {}) {
  const checks = [], verify = value => validateRetiredPdrEvidence(value.targets, value.evidence);
  const reject = (name, change) => {
    const f = fixture([0, 1, 2]); change(f);
    assert.throws(() => verify(f), /retired PDR evidence:/, name); checks.push(name);
  };
  for (const [name, lengths] of [['empty', []], ['zero', [0, 0]], ['multi-entry', [0, 1, 2]],
    ['historical 38', Array(38).fill(1)], ['current 35 over 34 owners', [2, ...Array(33).fill(1), 0]]]) {
    assert.equal(verify(fixture(lengths)).retiredPdrRelocations, lengths.reduce((a, b) => a + b, 0)); checks.push(name);
  }
  const transition = fixture([0, 1, 2]);
  transition.targets[1].legacyAncillaryRelocations = []; transition.evidence.targets[1].retiredPdrRelocations = 0;
  transition.evidence.counts.retiredPdrRelocations--; assert.equal(verify(transition).retiredPdrRelocations, 2);
  transition.targets[1].legacyAncillaryRelocations.push({ section: '.rel.pdr', symbol: 'other' });
  transition.evidence.targets[1].retiredPdrRelocations++; transition.evidence.counts.retiredPdrRelocations++;
  assert.equal(verify(transition).retiredPdrRelocations, 3); checks.push('contract-derived removal/addition');
  for (const [name, mutate] of [
    ['duplicate active', f => f.targets[2].symbol = f.targets[1].symbol],
    ['duplicate evidence', f => f.evidence.targets[2].symbol = f.evidence.targets[1].symbol],
    ['missing evidence', f => f.evidence.targets.pop()], ['extra evidence', f => f.evidence.targets.push({ ...f.evidence.targets[0], symbol: 'extra' })],
    ['unknown symbol', f => f.evidence.targets[0].symbol = 'unknown'], ['empty active symbol', f => f.targets[0].symbol = ''],
    ['redistributed count', f => { f.evidence.targets[1].retiredPdrRelocations = 2; f.evidence.targets[2].retiredPdrRelocations = 1; }],
    ['wrong aggregate', f => f.evidence.counts.retiredPdrRelocations++], ['wrong proof count', f => f.evidence.counts.proofTargets++],
    ['absent expected list', f => delete f.targets[0].expectedRelocations], ['absent retired list', f => delete f.targets[0].legacyAncillaryRelocations],
    ['non-array retired list', f => f.targets[0].legacyAncillaryRelocations = {}],
    ['active PDR', f => f.targets[0].expectedRelocations[0].section = '.rel.pdr'],
    ['missing active section', f => delete f.targets[0].expectedRelocations[0].section],
    ['retired text', f => f.targets[1].legacyAncillaryRelocations[0].section = '.rel.text'],
    ['null retired record', f => f.targets[1].legacyAncillaryRelocations[0] = null],
    ['missing contract source', f => { delete f.targets[0].relocationContractSource; delete f.evidence.targets[0].relocationContractSource; }],
    ['wrong contract source', f => f.evidence.targets[0].relocationContractSource = 'canonical'],
    ['unknown model contract source', f => { f.targets[0].relocationContractSource = 'unbound'; f.evidence.targets[0].relocationContractSource = 'unbound'; }],
  ]) reject(name, mutate);
  for (const invalid of [-1, 0.5, Number.MAX_SAFE_INTEGER + 1, '1', null, undefined, NaN, Infinity]) {
    reject('invalid target count ' + String(invalid), f => f.evidence.targets[1].retiredPdrRelocations = invalid);
    reject('invalid aggregate ' + String(invalid), f => f.evidence.counts.retiredPdrRelocations = invalid);
    reject('invalid proof census ' + String(invalid), f => f.evidence.counts.proofTargets = invalid);
  }
  const pure = fixture([1]); pure.evidence.targets[0].sourceClass = 'PURE_C'; verify(pure); checks.push('PURE_C can retain legacy PDR metadata');

  const sourceRoot = options.sourceRoot || path.resolve(__dirname, '..');
  const audit = fs.readFileSync(path.join(sourceRoot, 'tools/audit.js'), 'utf8');
  const companion = fs.readFileSync(path.join(sourceRoot, 'tests/phase8_matching_c.js'), 'utf8');
  assert.match(companion, /validateRetiredPdrEvidence\(phase8\.targets, independentEvidence\)/);
  assert(companion.indexOf('verifySourceObjectProofs(phase8,') < companion.indexOf('validateRetiredPdrEvidence(phase8.targets,'));
  assert.match(companion, /proof\.target\.sourceClass !== classification\.class/);
  assert.match(companion, /JSON\.stringify\(proof\.finalObject\.legacyPdrRelocationsRetired\) !== JSON\.stringify\(target\.legacyAncillaryRelocations\)/);
  const expression = companion.match(/const gnu26RegressionClasses = (new Map\(\[[\s\S]*?\]\));/)[1];
  const classes = vm.runInNewContext(expression, { SOURCE_CLASSES: { PURE_C: 'PURE_C', HYBRID_C: 'HYBRID_C' } });
  assert.deepEqual([...classes.keys()], ['func_0002CD70', 'func_0000BC8C', 'func_0015DF10', 'func_0002DE10', 'func_00269798', 'func_0000B29C']);
  assert.deepEqual([...classes.values()], ['HYBRID_C', 'PURE_C', 'HYBRID_C', 'HYBRID_C', 'PURE_C', 'PURE_C']);
  assert.equal(classes.get('func_00269798'), 'PURE_C');
  const enforceCanary = (symbol, mechanical, proof) => { assert.equal(mechanical, classes.get(symbol)); assert.equal(proof, mechanical); };
  enforceCanary('func_00269798', 'PURE_C', 'PURE_C');
  assert.throws(() => enforceCanary('func_00269798', 'HYBRID_C', 'HYBRID_C'));
  assert.throws(() => enforceCanary('func_00269798', 'PURE_C', 'HYBRID_C'));
  checks.push('six reviewed canaries and stale HYBRID rejection', 'companion independent proof prerequisite');

  // Execute actual audit control flow with test-only dependencies. Stop before
  // ROM I/O; no native command, real context preparation or report publication.
  let preparations = 0, verified = false;
  const outer = { phase8: { targets: fixture([1]).targets } };
  const fresh = { phase8: { targets: [], linkageConfig: { targets: [] }, compatibility: [{ symbol: 'func_000135a0', legacyRecord: false, relocationContractSource: 'canonical' }] } };
  const empty = fixture([]).evidence;
  empty.identity = { sourceCommit: '54514ded39ceb32165a125ddba04ca5b551773a2' };
  Object.assign(empty.counts, { pureTargets: 0, hybridTargets: 0, compilerAssemblyRewrites: 0 });
  const stop = new Error('test stopped before ROM read');
  const workflow = { prepareContext: () => ++preparations === 1 ? outer : fresh, ensureBaseline: () => {}, runNode: () => {}, writeJson: () => assert.fail('report must not publish'),
    verifyCurrent: (context, opts) => { assert.equal(context, fresh); assert.equal(opts.forceFresh, true); verified = true;
      return { build: { output: 'unused' }, sourcePolicy: { counts: { PURE_C: 0, HYBRID_C: 0 } }, verification: { verification: { sourceObjectEvidence: empty } } }; } };
  const mod = { exports: {} };
  const request = name => {
    if (name === 'fs') return { existsSync: () => true, statSync: () => ({ isDirectory: () => true }), readFileSync: () => { throw stop; } };
    if (name === 'path' || name === 'util') return require(name);
    if (name === './lib/current_workflow') return workflow;
    if (name === './lib/verification_profile') return { measure: (_, __, f) => f(), withVerificationProfile: (_, __, f) => f(null) };
    if (name === './lib/local_tools') return { resolveLocalTools: () => ({ phase5aRoot: 'unused' }) };
    if (name === './lib/phase7_conventional') return { ROOT: sourceRoot };
    if (name === './lib/text_contract') return {};
    if (name.startsWith('../tests/')) return { main: () => {}, run: () => {}, verifyFunc002861C8Structure: () => ({}) };
    throw new Error('unexpected test dependency ' + name);
  };
  vm.runInNewContext(audit, { require: request, module: mod, process: { argv: [] }, console: { log: () => {} } });
  assert.throws(() => mod.exports.main([]), error => error === stop); assert(verified); assert.equal(preparations, 2);
  assert.match(audit, /isDeepStrictEqual\(proof\.finalObject\?\.legacyPdrRelocationsRetired, target\.legacyAncillaryRelocations\)/);
  checks.push('post-fresh census uses exact verification context', 'forceFresh and no report promotion', 'authenticated callback preserves exact array check');
  // Execute the actual callback body with synthetic already-open proof inputs.
  // Hash/descriptor authentication is a separate mandatory production prerequisite.
  const callback = audit.match(/textContract\.withSourceObjectProof\(current\.build\.output, target, record, proof => \{([\s\S]*?)\n    \}\);/)[1];
  const proofTarget = fixture([2]).targets[0];
  const proof = { finalObject: { legacyPdrRelocationsRetired: structuredClone(proofTarget.legacyAncillaryRelocations) }, objectEvidence: {}, linkEvidence: { fullOwnerExact: true }, textContract: { mode: 'fixture' } };
  const checkProof = candidate => vm.runInNewContext(callback, { require, proof: candidate, target: proofTarget,
    textContract: { validateRecords: () => {}, resolveTextContract: () => ({}), hash: () => 'fixture' } });
  checkProof(proof);
  for (const [name, mutate] of [
    ['missing array', p => delete p.finalObject.legacyPdrRelocationsRetired],
    ['record order', p => p.finalObject.legacyPdrRelocationsRetired.reverse()],
    ['referenced symbol', p => p.finalObject.legacyPdrRelocationsRetired[1].symbol = 'different'],
    ['offset', p => p.finalObject.legacyPdrRelocationsRetired[1].offset = '0x00000000'],
    ['type', p => p.finalObject.legacyPdrRelocationsRetired[0].type = 'R_MIPS_26'],
    ['section', p => p.finalObject.legacyPdrRelocationsRetired[0].section = '.rel.text'],
  ]) {
    const changed = structuredClone(proof); mutate(changed);
    assert.throws(() => checkProof(changed), /audit retired PDR proof array mismatch/); checks.push('authenticated callback rejects ' + name);
  }
  const result = { status: 'pass', checks, scope: 'pure rejection and mocked control-flow tests; no native/full audit/build' };
  console.log(JSON.stringify(result)); return result;
}
if (require.main === module) main();
module.exports = { main };
