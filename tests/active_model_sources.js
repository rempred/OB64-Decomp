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
function readFrames(stack) {
  return stack.split('\n').slice(1).map(line => {
    const match = /^\s*at ([^(]+) \((.*):\d+:\d+\)$/.exec(line);
    if (match) return [match[1].replace(/^Object\./, ''), path.resolve(match[2])];
    const callback = /^\s*at (.*):\d+:\d+$/.exec(line);
    if (callback) return ['', path.resolve(callback[1])];
    return line.trim() === 'at Array.map (<anonymous>)' ? ['Array.map', '<anonymous>'] : null;
  });
}
function atomicReadSite(stack) {
  const frames = readFrames(stack);
  const frame = ([name, file]) => [name, file === '<anonymous>' ? file : path.join(p7.ROOT, 'tools/lib', file)];
  for (const [site, chain] of Object.entries(atomicReadChains)) {
    const expected = [['sha256File', 'phase7_conventional.js'], ['authenticate', 'atomic_owner_union.js'],
      ...chain, ['loadActiveTargetModelInternal', 'active_targets.js']].map(frame);
    if (expected.every((value, i) => frames[i + 1]?.[0] === value[0] && frames[i + 1]?.[1] === value[1])) return site;
  }
  return frames.some(value => value?.[0] === 'authenticate'
    && value[1] === path.join(p7.ROOT, 'tools/lib/atomic_owner_union.js')) ? 'other' : null;
}
// Interior binding independently reads each preceding/member/following physical owner.
const interiorTail = [['interiorOriginal', 'compilation_groups.js'], ['', 'compilation_groups.js'],
  ['Array.map', '<anonymous>'], ['interiorBinding', 'compilation_groups.js'],
  ['bindInterior', 'compilation_groups.js'], ['bind', 'compilation_groups.js'],
  ['loadActiveTargetModelInternal', 'active_targets.js']];
const interiorReadChains = {
  interiorOriginalHash: [['sha256File', 'phase7_conventional.js'], ...interiorTail],
  interiorOriginalText: interiorTail,
};
function interiorReadSite(stack) {
  const frames = readFrames(stack);
  for (const [site, chain] of Object.entries(interiorReadChains)) {
    if (chain.every(([name, file], i) => frames[i + 1]?.[0] === name
      && frames[i + 1]?.[1] === (file === '<anonymous>' ? file : path.join(p7.ROOT, 'tools/lib', file)))) return site;
  }
  return frames.some(value => ['interiorOriginal', 'interiorBinding'].includes(value?.[0])
    && value[1] === path.join(p7.ROOT, 'tools/lib/compilation_groups.js')) ? 'other' : null;
}
const singleTail = [['singleFragmentCanonical', 'compilation_groups.js'],
  ['bindSingleFragmentContext', 'compilation_groups.js'], ['bind', 'compilation_groups.js'],
  ['loadActiveTargetModelInternal', 'active_targets.js']];
const literalBindTail = [['literalRunBindings', 'compilation_groups.js'], ['bindLiteralRun', 'compilation_groups.js'],
  ['bind', 'compilation_groups.js'], ['loadActiveTargetModelInternal', 'active_targets.js']];
const literalFinishTail = [['literalRunBindings', 'compilation_groups.js'], ['authenticateLiteralRun', 'compilation_groups.js'],
  ['finishLiteralRunBindings', 'compilation_groups.js'], ['loadActiveTargetModelInternal', 'active_targets.js']];
const registryRead = [['sha256File', 'phase7_conventional.js'], ['', 'logical_functions.js'],
  ['Array.map', '<anonymous>'], ['loadRegistry', 'logical_functions.js']];
const authorityReadChains = {
  initialAcceptedModel: [['loadAcceptedModel', 'phase7_conventional.js'], ['loadActiveTargetModelInternal', 'active_targets.js']],
  bootInitializedDataProof: [['loadProof', 'boot_initialized_data.js'], ['loadAcceptedModel', 'phase7_conventional.js'],
    ['loadActiveTargetModelInternal', 'active_targets.js']],
  singleBoot: [['loadProof', 'boot_initialized_data.js'], ['loadAcceptedModel', 'phase7_conventional.js'], ...singleTail],
  singleModel: [['loadAcceptedModel', 'phase7_conventional.js'], ...singleTail],
  singleOriginal: singleTail,
  singleRegistry: [...registryRead, ...singleTail],
  singleActivation: [['assertActivationCompatible', 'logical_functions.js'], ...singleTail],
  singlePair: [['sha256File', 'phase7_conventional.js'], ['', 'active_targets.js'], ['Array.map', '<anonymous>'],
    ['resolveAuxiliarySectionContracts', 'active_targets.js'], ...singleTail],
  singleIdentity: [['sha256File', 'phase7_conventional.js'], ['', 'compilation_groups.js'], ['Array.map', '<anonymous>'], ...singleTail],
  literalBindRegistry: [...registryRead, ...literalBindTail],
  literalBindHash: [['sha256File', 'phase7_conventional.js'], ...literalBindTail],
  literalBindOriginal: literalBindTail,
  literalFinishRegistry: [...registryRead, ...literalFinishTail],
  literalFinishHash: [['sha256File', 'phase7_conventional.js'], ...literalFinishTail],
  literalFinishOriginal: literalFinishTail,
  mixedOriginal: [['bindMixed', 'retained_literal_references.js'], ['finishFragmentBindings', 'compilation_groups.js'],
    ['validateAuxiliaryOwnerGroups', 'active_targets.js'], ['loadActiveTargetModelInternal', 'active_targets.js']],
};
function authorityReadSite(stack) {
  const frames = readFrames(stack);
  if (frames.length >= 60) return 'other';
  for (const [site, chain] of Object.entries(authorityReadChains)) {
    if (chain.every(([name, file], i) => frames[i + 1]?.[0] === name
      && frames[i + 1]?.[1] === (file === '<anonymous>' ? file : path.join(p7.ROOT, 'tools/lib', file)))) return site;
  }
  return frames.some(frame => ['singleFragmentCanonical', 'bindSingleFragmentContext', 'literalRunBindings',
    'bindLiteralRun', 'authenticateLiteralRun', 'finishLiteralRunBindings', 'bindMixed', 'loadProof', 'loadAcceptedModel'].includes(frame?.[0])
    || frame?.[1] === path.join(p7.ROOT, 'tools/lib/boot_initialized_data.js')) ? 'other' : null;
}
function sourceReadSite(stack, bootProof) {
  return authorityReadSite(stack) || atomicReadSite(stack) || interiorReadSite(stack) || (bootProof ? 'other'
    : stack.includes('at verifyRowSymbolSourceCache ') ? 'finalSourceSweep'
    : stack.includes('at cachedAssemblyText ') ? 'cachedAssemblyText'
    : stack.includes('at Object.assertActivationCompatible ') ? 'logicalActivation'
    : stack.includes('at Object.retainedBindings ') ? 'retainedProjection' : 'other');
}
const syntheticStack = chain => 'Error\n    at fs.readFileSync (test.js:1:1)\n' + chain.map(([name, file]) =>
  file === '<anonymous>' ? `    at ${name} (<anonymous>)`
    : name ? `    at ${name} (${path.join(p7.ROOT, 'tools/lib', file)}:1:1)`
      : `    at ${path.join(p7.ROOT, 'tools/lib', file)}:1:1`).join('\n');
for (const [site, chain] of Object.entries(authorityReadChains)) {
  assert.equal(sourceReadSite(syntheticStack(chain)), site);
  for (let i = 0; i < chain.length; i++) for (const replacement of [[chain[i][0], 'wrong-module.js'], ['wrongOwner', chain[i][1]]]) {
    const wrong = chain.map((frame, j) => j === i ? replacement : frame);
    assert.equal(sourceReadSite(syntheticStack(wrong)), 'other', 'exact authority function/module chain');
  }
  for (let end = 0; end < chain.length; end++)
    assert.equal(sourceReadSite(syntheticStack(chain.slice(0, end))), 'other', 'incomplete authority chain');
  assert.equal(sourceReadSite(syntheticStack([...chain, ...Array.from({ length: 60 }, () => ['caller', 'active_targets.js'])])),
    'other', 'bounded stack must reject truncation');
  assert.equal(sourceReadSite(syntheticStack([['unexpected', 'compilation_groups.js'], ...chain,
    ['loadAcceptedModel', 'phase7_conventional.js']])), 'other', 'authority cannot hide behind generic fallback');
}
for (const [site, chain] of Object.entries(interiorReadChains)) {
  assert.equal(sourceReadSite(syntheticStack(chain)), site);
  for (let i = 0; i < chain.length; i++) {
    for (const replacement of [[chain[i][0], 'wrong-module.js'], ['wrongOwner', chain[i][1]]]) {
      const wrong = chain.map((frame, j) => j === i ? replacement : frame);
      assert.equal(sourceReadSite(syntheticStack(wrong)), 'other', 'exact interior function/module chain');
    }
  }
  const auth = chain.map(frame => frame[0] === 'bindInterior' ? ['authenticateInterior', frame[1]] : frame);
  for (const generic of ['loadAcceptedModel', 'verifyRowSymbolSourceCache', 'cachedAssemblyText',
    'Object.assertActivationCompatible', 'Object.retainedBindings']) {
    assert.equal(sourceReadSite(syntheticStack([...auth, [generic, 'active_targets.js']])), 'other',
      'unknown interior caller cannot hide behind generic source categories');
  }
}
const assertInteriorReads = (actual, expected) => assert.deepEqual(sortedReads(actual), sortedReads(expected),
  'interior authentication path/site/count census');
function expectedInteriorReads(context) {
  const groups = context.targets.filter(target => target.groupMemberIndex === 0
    && require('../tools/lib/compilation_groups').interior(target.compilationGroup));
  assert(groups.length > 0, 'nonvacuous interior group census');
  return groups.flatMap(({ compilationGroup: group }) => {
    const binding = group.interiorRun.binding;
    assert(binding, 'interior group binding required');
    const ids = [group.interiorRun.precedingOwnerRowIndex, ...group.members.map(member => member.ownerRowIndex),
      group.interiorRun.followingOwnerRowIndex];
    const bound = [binding.preceding, ...binding.members, binding.following];
    assert.equal(bound.length, ids.length, 'interior binding cardinality');
    return ids.flatMap((id, i) => {
      const rows = context.model.rows.filter(row => row.index === id);
      assert.equal(rows.length, 1, 'unique interior model owner');
      const row = rows[0];
      assert.equal(bound[i].rowIndex, id, 'interior bound owner');
      assert.equal(bound[i].originalAssembly, row.part.file, 'interior bound file');
      assert.equal(bound[i].originalAssemblySha256, row.part.sha256, 'interior bound source hash');
      const parts = context.model.parts.filter(part => part.file === row.part.file);
      assert.equal(parts.length, 1, 'unique sealed interior part');
      assert.equal(parts[0].sha256, row.part.sha256, 'interior sealed source hash');
      return Object.keys(interiorReadChains).map(site => ({ site, file: path.join(p7.ROOT, row.part.file) }));
    });
  });
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
// Snapshot registry bytes before interception; expectation derivation must not add source reads.
const registryBytes = fs.readFileSync(path.join(p7.ROOT, 'config/logical-functions.json'));
const registryConfig = JSON.parse(registryBytes);
const registryIdentity = { path: 'config/logical-functions.json', bytes: registryBytes.length, sha256: p7.sha256Buffer(registryBytes) };
function expectedAuthorityReads(context) {
  const result = [], groups = [...new Set(context.targets.map(t => t.compilationGroup).filter(Boolean))];
  const groupTools = require('../tools/lib/compilation_groups');
  const rowFile = index => {
    const rows = context.model.rows.filter(r => r.index === index); assert.equal(rows.length, 1);
    const part = rows[0].part; assert(part);
    assert.equal(context.model.parts.filter(p => p.file === part.file && p.sha256 === part.sha256).length, 1);
    return path.join(p7.ROOT, part.file);
  };
  const registryFiles = registryConfig.bodies.flatMap(body => body.fragments.map(fragment => {
    assert.equal(rowFile(fragment.rowIndex), path.join(p7.ROOT, fragment.file));
    assert.equal(context.model.rows[fragment.rowIndex].part.sha256, fragment.sha256);
    return path.join(p7.ROOT, fragment.file);
  }));
  const add = (site, files, times = 1) => { for (let i = 0; i < times; i++) for (const file of files) result.push({ site, file }); };
  add('bootInitializedDataProof', [bootClearSource]);
  add('initialAcceptedModel', context.model.parts.map(p => path.join(p7.ROOT, p.file)));
  for (const group of groups) {
    if (groupTools.singleFragment(group)) {
      const binding = group.singleFragmentBinding; assert.deepEqual(binding.logical, registryIdentity);
      const owner = rowFile(group.members[0].ownerRowIndex), data = rowFile(group.auxiliary.sections[0].ownerRowIndex);
      for (const row of binding.rows) assert.deepEqual(row, context.model.rows[row.index]);
      add('singleBoot', [bootClearSource]); add('singleModel', context.model.parts.map(p => path.join(p7.ROOT, p.file)));
      add('singleOriginal', [owner, data]); add('singleActivation', [owner]); add('singleRegistry', registryFiles);
      add('singlePair', [data]);
      const inputs = binding.inputs.filter(f => f.path.startsWith('asm/original/rev0/') && f.path.endsWith('.s'));
      assert.deepEqual(inputs.map(f => path.join(p7.ROOT, f.path)), [owner, data]);
      for (const input of inputs) assert.equal(input.sha256, context.model.parts.find(p => p.file === input.path).sha256);
      add('singleIdentity', [owner, data]);
    }
    if (group.mode === 'native-text-owner-retained-literal-run-projection') {
      const binding = group.retainedNeighborBinding; assert.deepEqual(binding.registryIdentity, registryIdentity);
      const neighbor = rowFile(binding.rowIndex);
      assert.equal(neighbor, path.join(p7.ROOT, binding.source));
      assert.equal(binding.sourceSha256, context.model.rows[binding.rowIndex].part.sha256);
      const files = [...group.members.map(m => rowFile(m.ownerRowIndex)), neighbor];
      for (const [prefix, times] of [['literalBind', 1], ['literalFinish', 2]]) {
        add(prefix + 'Registry', registryFiles, times); add(prefix + 'Hash', files, times); add(prefix + 'Original', [neighbor], times);
      }
    }
    if (group.mode === 'native-text-owner-functions-mixed-readonly-fragment-projection') {
      const section = group.auxiliary.sections[0], file = rowFile(section.ownerRowIndex);
      assert.equal(file, path.join(p7.ROOT, section.ownerOriginalAssembly));
      assert.equal(section.ownerOriginalAssemblySha256, context.model.rows[section.ownerRowIndex].part.sha256);
      add('mixedOriginal', [file]);
    }
  }
  return result;
}
const atomicReads = [], interiorReads = [], initialReads = [], authorityReads = [];
const read = fs.readFileSync, readSites = {}, assemblyPrefix = path.join(p7.ROOT, 'asm/original/rev0') + path.sep;
const bootClearSource = path.join(p7.ROOT, 'asm/original/rev0/boot/boot_entry_clear_bss.s');
let prepared;
const stackTraceLimit = Error.stackTraceLimit;
try {
  Error.stackTraceLimit = 60;
  fs.readFileSync = function (file, ...args) {
    if (typeof file === 'string' && path.resolve(file).startsWith(assemblyPrefix) && file.endsWith('.s')) {
      const stack = new Error().stack;
      const bootProof = stack.includes('at Object.loadProof ') && stack.includes('boot_initialized_data.js');
      if (bootProof) assert.equal(path.resolve(file), bootClearSource, 'unexpected boot proof assembly source');
      const atomicSite = atomicReadSite(stack);
      if (atomicSite && atomicSite !== 'other') atomicReads.push({ site: atomicSite, file: path.resolve(file) });
      const site = sourceReadSite(stack, bootProof);
      if (Object.hasOwn(authorityReadChains, site)) authorityReads.push({ site, file: path.resolve(file) });
      if (site === 'initialAcceptedModel') initialReads.push(path.resolve(file));
      if (Object.hasOwn(interiorReadChains, site)) interiorReads.push({ site, file: path.resolve(file) });
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
  assert.deepEqual(initialReads.sort(), prepared.model.parts.map(part => path.join(p7.ROOT, part.file)).sort(),
    'initial authenticated read must visit each exact physical source once, including retained-padding owners');
  assert.equal(readSites.bootInitializedDataProof, 1, 'independent boot-clear source authentication');
  const expectedAuthority = expectedAuthorityReads(prepared);
  const checkAuthority = rows => assert.deepEqual(sortedReads(rows), sortedReads(expectedAuthority), 'authority path/site/count census');
  checkAuthority(authorityReads);
  for (const site of new Set(expectedAuthority.map(r => r.site))) {
    const first = expectedAuthority.find(r => r.site === site), index = expectedAuthority.indexOf(first);
    const remaining = expectedAuthority.filter((_, i) => i !== index);
    for (const changed of [remaining, [...expectedAuthority, first],
      [...remaining, { ...first, file: assemblyPrefix + 'wrong.s' }],
      [...remaining, { ...first, site: 'wrong' }]]) { checkAuthority(authorityReads); assert.throws(() => checkAuthority(changed)); checkAuthority(authorityReads); }
  }
  assert.throws(() => checkAuthority([...authorityReads, ...authorityReads.filter(r => r.site === 'singleModel')]));
  for (const group of new Set(prepared.targets.map(t => t.compilationGroup).filter(Boolean))) {
    const records = group.singleFragmentBinding ? [[group.singleFragmentBinding.logical, 'sha256'],
      ...group.singleFragmentBinding.inputs.filter(f => f.path.endsWith('.s')).flatMap(f => [[f, 'path'], [f, 'sha256']])]
      : group.retainedNeighborBinding ? [[group.retainedNeighborBinding.registryIdentity, 'sha256'],
        [group.retainedNeighborBinding, 'source'], [group.retainedNeighborBinding, 'sourceSha256']]
        : group.mode === 'native-text-owner-functions-mixed-readonly-fragment-projection'
          ? [[group.auxiliary.sections[0], 'ownerOriginalAssembly'], [group.auxiliary.sections[0], 'ownerOriginalAssemblySha256']] : [];
    for (const [record, field] of records) {
      checkAuthority(expectedAuthorityReads(prepared)); const previous = record[field]; record[field] = 'wrong';
      try { assert.throws(() => expectedAuthorityReads(prepared)); } finally { record[field] = previous; }
      checkAuthority(expectedAuthorityReads(prepared));
    }
  }
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
  const expectedInterior = expectedInteriorReads(prepared);
  assertInteriorReads(interiorReads, expectedInterior);
  const firstInterior = expectedInterior[0], remainingInterior = expectedInterior.slice(1);
  for (const actual of [remainingInterior, [...expectedInterior, firstInterior],
    [...expectedInterior, ...expectedInterior], // authenticateInterior's nested loader duplicates valid stacks.
    [{ ...firstInterior, file: assemblyPrefix + 'wrong-owner.s' }, ...remainingInterior],
    [{ ...firstInterior, site: 'wrongInteriorSite' }, ...remainingInterior],
    [...expectedInterior, { site: 'extra', file: 'extra.s' }]]) {
    assert.throws(() => assertInteriorReads(actual, expectedInterior));
  }
  for (const field of ['rowIndex', 'originalAssembly', 'originalAssemblySha256']) {
    const group = prepared.targets.find(target => target.groupMemberIndex === 0
      && require('../tools/lib/compilation_groups').interior(target.compilationGroup)).compilationGroup;
    const bound = group.interiorRun.binding.preceding, original = bound[field];
    try { bound[field] = field === 'rowIndex' ? -1 : 'wrong';
      assert.throws(() => expectedInteriorReads(prepared), /interior bound/);
    } finally { bound[field] = original; }
  }
  // Projection bindings belong to standalone projections and composed groups.
  // Ordinary shared-row fragments retain ASM through their row contracts instead.
  function retainedProjectionBindings(target) {
    const projection = require('../tools/lib/auxiliary_projection');
    let bindings = [];
    if (target.auxiliaryProjection) bindings = target.auxiliaryProjectionRetained;
    else if (target.groupMemberIndex === 0 && target.compilationGroup?.auxiliary) {
      const group = target.compilationGroup;
      if (projection.composed(group)) bindings = group.auxiliary.retained;
      else {
        if (projection.singleFragment(group)) projection.singleFragmentContract(group);
        else if (group.mode === 'native-text-owner-functions-mixed-readonly-fragment-projection') projection.mixedContract(group);
        else {
          assert(projection.fragmentMode(group), 'unknown auxiliary producer in source-read census');
          assert.deepEqual(Object.keys(group.auxiliary).sort(), ['alignmentDirectives', 'compilerLabel', 'sections']);
          projection.fragmentContract(group);
        }
      }
    }
    assert(Array.isArray(bindings), 'returned retained-projection binding census');
    return bindings;
  }
  const expectedRetainedProjectionReads = prepared.targets.reduce((count, target) =>
    count + retainedProjectionBindings(target).length, 0);
  const fragment = prepared.targets.find(target => target.groupMemberIndex === 0
    && require('../tools/lib/auxiliary_projection').fragmentMode(target.compilationGroup));
  assert(fragment, 'nonvacuous ordinary-fragment source-read control');
  for (const auxiliary of [{ ...fragment.compilationGroup.auxiliary, retained: [] },
    { ...fragment.compilationGroup.auxiliary, projection: {} }]) {
    assert.throws(() => retainedProjectionBindings({ ...fragment,
      compilationGroup: { ...fragment.compilationGroup, auxiliary } }));
  }
  assert.throws(() => retainedProjectionBindings({ ...fragment,
    compilationGroup: { ...fragment.compilationGroup, mode: 'unknown' } }));
  for (const target of prepared.targets.filter(t => t.groupMemberIndex === 0
    && (require('../tools/lib/auxiliary_projection').singleFragment(t.compilationGroup)
      || t.compilationGroup?.mode === 'native-text-owner-functions-mixed-readonly-fragment-projection'))) {
    assert.deepEqual(retainedProjectionBindings(target), []);
    for (const auxiliary of [{ ...target.compilationGroup.auxiliary, retained: [] },
      { ...target.compilationGroup.auxiliary, projection: {} }, { ...target.compilationGroup.auxiliary, nativeSection: {} }])
      assert.throws(() => retainedProjectionBindings({ ...target, compilationGroup: { ...target.compilationGroup, auxiliary } }));
    assert.throws(() => retainedProjectionBindings({ ...target, compilationGroup: { ...target.compilationGroup, mode: 'unknown' } }));
  }
  const composed = prepared.targets.find(target => target.groupMemberIndex === 0
    && require('../tools/lib/auxiliary_projection').composed(target.compilationGroup));
  assert(composed, 'nonvacuous composed source-read control');
  for (const retained of [undefined, null, {}]) assert.throws(() => retainedProjectionBindings({ ...composed,
    compilationGroup: { ...composed.compilationGroup, auxiliary: { ...composed.compilationGroup.auxiliary, retained } } }));
  assert.equal(readSites.retainedProjection || 0, expectedRetainedProjectionReads,
    'non-authentication retained-projection source reads');
  assert.equal(readSites.other || 0, 0, 'unclassified assembly source reread');
  fs.readFileSync = read;
  const cache = new Map();
  for (const target of selected) assert.equal(active.resolveAcceptedRow(prepared.model, target.symbol, cache).index, target.row);
  assert.throws(() => active.finishActiveTargetModelSources(prepared), /already finished/);
  assert.throws(() => active.finishActiveTargetModelSources({ ...prepared }), /missing/);
} finally { fs.readFileSync = read; Error.stackTraceLimit = stackTraceLimit; }
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
// Reusing an initial retained-padding capture must not waive the final bracket.
for (const row of prepared.model.rows.filter(row => row.retainedPadding)) {
  const value = active.loadActiveTargetModelForContext(), retainedFile = path.join(p7.ROOT, row.part.file);
  try {
    fs.readFileSync = function (file, ...args) {
      const bytes = read.call(this, file, ...args);
      if (path.resolve(String(file)) !== retainedFile) return bytes;
      const copy = Buffer.from(bytes); copy[0] ^= 1; return copy;
    };
    assert.throws(() => active.finishActiveTargetModelSources(value), /source changed/);
    mutations.push('retained source changed after capture: ' + row.index);
  } finally { fs.readFileSync = read; }
}
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

// Auxiliary logical checks must reuse only the active loader's authenticated callback.
const projection = require('../tools/lib/auxiliary_projection');
const logical = require('../tools/lib/logical_functions');
const retained = projection.retainedBindings, census = projection.validateCensus;
const loadRegistry = logical.loadRegistry, activate = logical.assertActivationCompatible;
let authenticatedSource, currentRoute, callbackContext;
const callbackRoutes = [];
try {
  projection.retainedBindings = function (target, model, rom, source) {
    if (target.auxiliaryProjection?.schemaVersion !== 3) return retained(...arguments);
    assert.equal(typeof source, 'function');
    authenticatedSource = source; currentRoute = 'retainedBindings';
    try { return retained(...arguments); } finally { currentRoute = null; }
  };
  projection.validateCensus = function (targets, source) {
    assert.equal(source, authenticatedSource, 'both routes use the same loader callback');
    currentRoute = 'validateCensus';
    try { return census(...arguments); } finally { currentRoute = null; }
  };
  logical.loadRegistry = function (model, rom, config, source) {
    if (currentRoute) {
      assert.equal(config, undefined, 'preserve default registry configuration');
      assert.equal(source, authenticatedSource); callbackRoutes.push(currentRoute + ':registry');
    }
    return loadRegistry(...arguments);
  };
  logical.assertActivationCompatible = function (registry, symbol, rows, functions, source) {
    if (currentRoute) {
      assert.equal(source, authenticatedSource); callbackRoutes.push(currentRoute + ':activation');
    }
    return activate(...arguments);
  };
  callbackContext = active.loadActiveTargetModelForContext();
} finally {
  projection.retainedBindings = retained; projection.validateCensus = census;
  logical.loadRegistry = loadRegistry; logical.assertActivationCompatible = activate;
}
assert.deepEqual(callbackRoutes, ['retainedBindings:registry', 'retainedBindings:activation',
  'validateCensus:registry', 'validateCensus:activation']);
const logicalTarget = prepared.targets.find(target => target.auxiliaryProjection?.schemaVersion === 3);
assert(logicalTarget, 'accepted native multi-function target required');
const logicalSourceFile = path.resolve(p7.ROOT, logicalTarget.rows[0].part.file);
let fallbackReads = 0;
try {
  fs.readFileSync = function (file, ...args) {
    if (path.resolve(String(file)) === logicalSourceFile) fallbackReads++;
    return read.call(this, file, ...args);
  };
  projection.checkTarget(logicalTarget, authenticatedSource);
  assert.equal(fallbackReads, 0);
  for (const [name, badSource] of [
    ['missing cached row', (file, sha) => authenticatedSource(file + '.missing', sha)],
    ['forged cached SHA', (file) => authenticatedSource(file, '0'.repeat(64))],
  ]) {
    assert.throws(() => projection.checkTarget(logicalTarget, badSource), /assembly source callback identity drift/, name);
    assert.equal(fallbackReads, 0, name + ' must never fall back to disk');
  }
  assert.throws(() => projection.checkTarget({ ...logicalTarget,
    reviewedLocalBodyRegistryIdentity: { ...logicalTarget.reviewedLocalBodyRegistryIdentity, sha256: '0'.repeat(64) },
  }, authenticatedSource), /registry identity drift/, 'forged registry identity');
  // A parse-equivalent changed registry still has a different independently read identity.
  fs.readFileSync = function (file, ...args) {
    const value = read.call(this, file, ...args);
    if (path.resolve(String(file)) !== path.resolve(logical.CONFIG_PATH)) return value;
    return typeof value === 'string' ? value + '\n' : Buffer.concat([value, Buffer.from('\n')]);
  };
  assert.throws(() => projection.checkTarget(logicalTarget, authenticatedSource), /registry identity drift/, 'stale registry');
  fs.readFileSync = function (file, ...args) {
    if (path.resolve(String(file)) === logicalSourceFile) fallbackReads++;
    return read.call(this, file, ...args);
  };
  projection.checkTarget(logicalTarget);
  assert(fallbackReads > 0, 'context-free callers independently read assembly');
  // Context-free registry authentication must reject changed source bytes.
  fs.readFileSync = function (file, ...args) {
    const value = read.call(this, file, ...args);
    if (path.resolve(String(file)) !== logicalSourceFile) return value;
    return typeof value === 'string' ? value + '\n' : Buffer.concat([value, Buffer.from('\n')]);
  };
  assert.throws(() => projection.checkTarget(logicalTarget), /fallback source drift/, 'context-free source drift');
} finally { fs.readFileSync = read; }
active.finishActiveTargetModelSources(callbackContext);
assert.throws(() => projection.checkTarget(logicalTarget, authenticatedSource),
  /assembly source callback identity drift/, 'finished context must invalidate its cached callback');
console.log(JSON.stringify({ authenticatedCachePlumbing: 'pass', callbackRoutes, contextFreeReads: fallbackReads }));
