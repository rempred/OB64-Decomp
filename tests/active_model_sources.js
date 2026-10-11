#!/usr/bin/env node
'use strict';
const assert = require('assert/strict');
const fs = require('fs');
const path = require('path');
const p7 = require('../tools/lib/phase7_conventional');
const active = require('../tools/lib/active_targets');
const symbols = ['alpha', 'Alpha', 'ALPHA', 'beta', 'gamma', '.local', '$dollar', 'with.dot', 'foo', 'bar', 'globl_only'];
const texts = [
  '.globl alpha\nalpha:\nAlpha:\n', '.globl\n beta \n gamma:\n', '\t.local:\r\n$dollar:\nwith.dot:\n',
  '.globl globl_only\n', '.globl foo,bar\n', '.globl alpha', 'alpha :\n', 'prefix_alpha:\n',
  '.globl alpha\n.globl beta\nalpha:\nbeta:\n', 'alpha: beta:\n', ' # alpha:\n', '\n\n .globl\n\nalpha\n\nbeta:\n',
];
let symbolEquivalences = 0;
for (const text of texts) {
  const indexed = new Set(active.assemblySymbolNames(text));
  for (const symbol of symbols) {
    const escaped = symbol.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const old = new RegExp(`(?:^|\\n)\\s*(?:\\.globl\\s+${escaped}\\s*(?:\\r?\\n)|${escaped}:)`, 'm').test(text);
    assert.equal(indexed.has(symbol), old, symbol + ' ' + JSON.stringify(text)); symbolEquivalences++;
  }
}
// Atomic owners independently authenticate each original fragment at these bounded sites.
const atomicReadChains = {
  atomicCensus: [['assertCensus', 'atomic_owner_union.js']],
  atomicOutputModel: [['assertCensus', 'atomic_owner_union.js'], ['outputModel', 'atomic_owner_union.js']],
  atomicAuxiliaryProjection: [['checkTarget', 'auxiliary_projection.js'], ['validateCensus', 'auxiliary_projection.js']],
  atomicRetainedBindings: [['checkTarget', 'auxiliary_projection.js'], ['retainedBindings', 'auxiliary_projection.js'],
    ['', 'active_targets.js'], ['Array.map', '<anonymous>']],
};
function atomicReadSite(stack) {
  const frames = stack.split('\n').slice(1).map(line => {
    const match = /^\s*at ([^(]+) \((.*):\d+:\d+\)$/.exec(line);
    if (match) return [match[1].replace(/^Object\./, ''), path.resolve(match[2])];
    const callback = /^\s*at (.*):\d+:\d+$/.exec(line);
    if (callback) return ['', path.resolve(callback[1])];
    return line.trim() === 'at Array.map (<anonymous>)' ? ['Array.map', '<anonymous>'] : null;
  });
  const frame = ([name, file]) => [name, file === '<anonymous>' ? file : path.join(p7.ROOT, 'tools/lib', file)];
  for (const [site, chain] of Object.entries(atomicReadChains)) {
    const expected = [['sha256File', 'phase7_conventional.js'], ['authenticate', 'atomic_owner_union.js'],
      ...chain, ['loadActiveTargetModelInternal', 'active_targets.js']].map(frame);
    if (expected.every((value, i) => frames[i + 1]?.[0] === value[0] && frames[i + 1]?.[1] === value[1])) return site;
  }
  return frames.some(value => value?.[0] === 'authenticate'
    && value[1] === path.join(p7.ROOT, 'tools/lib/atomic_owner_union.js')) ? 'other' : null;
}
// An authentication caller must not hide behind the generic retained-projection category.
const unknownAtomicStack = 'Error\n    at fs.readFileSync (test.js:1:1)\n'
  + `    at Object.sha256File (${path.join(p7.ROOT, 'tools/lib/phase7_conventional.js')}:1:1)\n`
  + `    at Object.authenticate (${path.join(p7.ROOT, 'tools/lib/atomic_owner_union.js')}:1:1)\n`
  + `    at unexpectedCaller (${path.join(p7.ROOT, 'tools/lib/atomic_owner_union.js')}:1:1)\n`
  + `    at Object.retainedBindings (${path.join(p7.ROOT, 'tools/lib/auxiliary_projection.js')}:1:1)`;
assert.equal(atomicReadSite(unknownAtomicStack), 'other');
const sortedReads = rows => rows.map(row => JSON.stringify(row)).sort();
const assertAtomicReads = (actual, expected) => assert.deepEqual(sortedReads(actual), sortedReads(expected),
  'atomic authentication path/site/count census');
const atomicReads = [];
const read = fs.readFileSync, readSites = {}, assemblyPrefix = path.join(p7.ROOT, 'asm/original/rev0') + path.sep;
const bootClearSource = path.join(p7.ROOT, 'asm/original/rev0/boot/boot_entry_clear_bss.s');
let prepared;
try {
  fs.readFileSync = function (file, ...args) {
    if (typeof file === 'string' && path.resolve(file).startsWith(assemblyPrefix) && file.endsWith('.s')) {
      const stack = new Error().stack;
      const bootProof = stack.includes('at Object.loadProof ') && stack.includes('boot_initialized_data.js');
      if (bootProof) assert.equal(path.resolve(file), bootClearSource, 'unexpected boot proof assembly source');
      const atomicSite = atomicReadSite(stack);
      if (atomicSite && atomicSite !== 'other') atomicReads.push({ site: atomicSite, file: path.resolve(file) });
      const site = atomicSite || (bootProof ? 'bootInitializedDataProof'
        : stack.includes('at loadAcceptedModel ') ? 'initialAcceptedModel'
        : stack.includes('at verifyRowSymbolSourceCache ') ? 'finalSourceSweep'
          : stack.includes('at cachedAssemblyText ') ? 'cachedAssemblyText'
          : stack.includes('at Object.assertActivationCompatible ') ? 'logicalActivation'
            : stack.includes('at Object.retainedBindings ') ? 'retainedProjection' : 'other');
      readSites[site] = (readSites[site] || 0) + 1;
    }
    return read.call(this, file, ...args);
  };
  prepared = active.loadActiveTargetModelForContext();
  const targets = [prepared.targets[0], prepared.targets.find(t => !/^func_/i.test(t.symbol)), prepared.targets.find(t => t.multiOwner)].filter(Boolean);
  const selected = targets.map(t => ({ symbol: t.symbol, row: active.resolveAcceptedRow(prepared.model, t.symbol).index }));
  // Target source overrides are intentionally outside the assembly model seal.
  const targetSource = prepared.targets[0].source; prepared.targets[0].source = 'isolated-test-source.c';
  const identities = active.finishActiveTargetModelSources(prepared); prepared.targets[0].source = targetSource;
  const expected = [...new Map(prepared.model.rows.filter(row => row.inputKind === 'tracked-assembly').map(row => [row.part.file,
    { path: row.part.file, sha256: row.part.sha256 }])).values()].sort((a, b) => a.path.localeCompare(b.path));
  assert.deepEqual(identities, expected);
  assert.equal(readSites.initialAcceptedModel, prepared.model.parts.length);
  assert.equal(readSites.bootInitializedDataProof, 1, 'independent boot-clear source authentication');
  assert.equal(readSites.finalSourceSweep, identities.length);
  assert.equal(readSites.cachedAssemblyText || 0, 0); assert.equal(readSites.logicalActivation || 0, 0);
  const expectedAtomicReads = prepared.targets.filter(target => target.atomicText).flatMap(target => {
    const sites = ['atomicCensus', 'atomicOutputModel',
      ...(target.auxiliaryProjection?.schemaVersion === 4 ? ['atomicAuxiliaryProjection', 'atomicRetainedBindings'] : [])];
    return target.atomicBinding.body.fragments.flatMap(fragment => {
      assert(prepared.model.parts.some(part => part.file === fragment.file && part.sha256 === fragment.sha256),
        'atomic fragment must be a sealed model part');
      return sites.map(site => ({ site, file: path.join(p7.ROOT, fragment.file) }));
    });
  });
  assertAtomicReads(atomicReads, expectedAtomicReads);
  const unexpectedRead = { site: 'unexpectedAtomicCaller', file: assemblyPrefix + 'unexpected.s' };
  assert.throws(() => assertAtomicReads([...atomicReads, unexpectedRead], expectedAtomicReads));
  if (expectedAtomicReads.length) {
    const first = expectedAtomicReads[0], rest = expectedAtomicReads.slice(1);
    assert.throws(() => assertAtomicReads([{ ...first, file: unexpectedRead.file }, ...rest], expectedAtomicReads));
    assert.throws(() => assertAtomicReads([{ ...first, site: unexpectedRead.site }, ...rest], expectedAtomicReads));
    assert.throws(() => assertAtomicReads([...expectedAtomicReads, first], expectedAtomicReads));
    assert.throws(() => assertAtomicReads(rest, expectedAtomicReads));
  }
  // Standalone bindings are read once per target; a composed group binds once at member zero.
  const expectedRetainedProjectionReads = prepared.targets.reduce((count, target) => {
    const bindings = target.auxiliaryProjection ? target.auxiliaryProjectionRetained
      : target.groupMemberIndex === 0 && target.compilationGroup?.auxiliary
        ? target.compilationGroup.auxiliary.retained : [];
    assert(Array.isArray(bindings), 'returned retained-projection binding census');
    return count + bindings.length;
  }, 0);
  assert.equal(readSites.retainedProjection || 0, expectedRetainedProjectionReads,
    'non-authentication retained-projection source reads');
  assert.equal(readSites.other || 0, 0, 'unclassified assembly source reread');
  fs.readFileSync = read;
  const cache = new Map();
  for (const target of selected) assert.equal(active.resolveAcceptedRow(prepared.model, target.symbol, cache).index, target.row);
  assert.throws(() => active.finishActiveTargetModelSources(prepared), /already finished/);
  assert.throws(() => active.finishActiveTargetModelSources({ ...prepared }), /missing/);
} finally { fs.readFileSync = read; }
const mutations = [];
for (const [name, mutate] of [
  ['model identity', value => { value.model = { ...value.model }; }],
  ['model config', value => { value.model.config.profile += '-changed'; }],
  ['row census', value => { value.model.rows.pop(); }],
  ['part census', value => { value.model.parts.pop(); }],
  ['duplicate conflicting file', value => { value.model.parts.push({ ...value.model.parts[0], sha256: '0'.repeat(64) }); }],
]) {
  const value = active.loadActiveTargetModelForContext(); mutate(value);
  assert.throws(() => active.finishActiveTargetModelSources(value), /model changed/); mutations.push(name);
}
const sourceFile = path.join(p7.ROOT, prepared.model.parts[0].file);
const changed = active.loadActiveTargetModelForContext();
try {
  fs.readFileSync = function (file, ...args) { const bytes = read.call(this, file, ...args);
    if (path.resolve(String(file)) !== path.resolve(sourceFile)) return bytes;
    const copy = Buffer.from(bytes); copy[0] ^= 1; return copy;
  };
  assert.throws(() => active.finishActiveTargetModelSources(changed), /source changed/); mutations.push('source bytes');
} finally { fs.readFileSync = read; }
const missing = active.loadActiveTargetModelForContext(), stat = fs.statSync;
try {
  fs.statSync = function(file, ...args) {
    if (path.resolve(String(file)) === path.resolve(sourceFile)) throw Object.assign(new Error('missing fixture source'), { code: 'ENOENT' });
    return stat.call(this, file, ...args);
  };
  assert.throws(() => active.finishActiveTargetModelSources(missing), /source changed/); mutations.push('missing source');
} finally { fs.statSync = stat; }
let reads = 0;
try {
  fs.readFileSync = function (file, ...args) { const bytes = read.call(this, file, ...args);
    if (path.resolve(String(file)) !== path.resolve(sourceFile)
        || !new Error().stack.includes('at verifyRowSymbolSourceCache ')) return bytes;
    reads++;
    const copy = Buffer.from(bytes); copy[0] ^= 1; return copy;
  };
  assert.throws(() => active.loadActiveTargetModel(), /source changed/); mutations.push('default loader performs final sweep');
  assert.equal(reads, 1, 'default loader must perform its final authenticated source sweep');
} finally { fs.readFileSync = read; }
const root = fs.mkdtempSync(path.join(p7.ROOT, 'build/tests/active-model-sources-'));
const report = { status: 'pass', symbolEquivalences, assemblyParts: prepared.model.parts.length, readSites, mutations };
fs.writeFileSync(path.join(root, 'report.json'), JSON.stringify(report, null, 2) + '\n'); console.log(JSON.stringify({ ...report, output: root }, null, 2));
