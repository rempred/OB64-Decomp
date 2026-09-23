#!/usr/bin/env node
'use strict';

const assert = require('node:assert/strict');
const {test} = require('node:test');
const {hash, features, partition, queryFromRecord, retrieve, evaluate, validateRecord} = require('../tools/matching_studies/compiler_curriculum/corpus');
const {argumentsFor, selectTargets} = require('../tools/matching_studies/compiler_curriculum/build');

function row(symbol, words, extras = {}) {
  const object = Buffer.alloc(words.length * 4);
  words.forEach((word, i) => object.writeUInt32BE(word >>> 0, i * 4));
  const sourceText = `unsigned ${symbol}(unsigned x) { return x; }`;
  return {...{symbol, sourceText, sourceSha256: hash(sourceText), sourceClass: 'PURE_C', toolId: 'compiler-A',
    objectHex: object.toString('hex'), objectSha256: hash(object), retailHex: object.toString('hex'), retailSha256: hash(object),
    relocations: [], vramStart: 0x80000000, aliases: [], compilerAssembly: 'fixture',
    provenance: {assemblyProvenance: {compilerAssembly: {sha256: hash('fixture'), bytes: 7}}}}, ...extras};
}

test('curriculum grouping prevents an immediate-only twin from crossing folds', () => {
  const records = partition([row('one', [0x03e00008, 0x24020001]), row('two', [0x03e00008, 0x24020002])]);
  assert.equal(records[0].groupId, records[1].groupId);
  assert.equal(records[0].fold, records[1].fold);
});

test('changed branch topology is retained in the family representation', () => {
  const a = row('one', [0x10800001, 0, 0x03e00008, 0]);
  const b = row('two', [0x10800002, 0, 0x03e00008, 0]);
  assert.notEqual(features(a.retailHex, a.vramStart).family, features(b.retailHex, b.vramStart).family);
});

test('aliases and source/object equivalence are grouped transitively', () => {
  const a = row('one', [0x03e00008, 0x24020001], {aliases: ['bridge']});
  const b = row('two', [0x03e00008, 0x00851021], {aliases: ['bridge']});
  const c = row('three', [0x03e00008, 0x00851021]);
  const records = partition([a, b, c]);
  assert.equal(new Set(records.map(value => value.groupId)).size, 1);
  assert.deepEqual(partition([c, a, b]), records);
});

test('a held-out query cannot retrieve itself, aliases, or a renamed family twin', () => {
  const records = partition([row('one', [0x03e00008, 0x24020001]), row('two', [0x03e00008, 0x24020002]),
    row('three', [0x03e00008, 0x00851021])]);
  const query = queryFromRecord(records.find(value => value.symbol === 'one'));
  assert.deepEqual(retrieve(query, records, {heldOut: true}).map(value => value.symbol), ['three']);
  assert.equal(retrieve(query, records)[0].symbol, 'two');
  query.aliases = ['THREE'];
  assert.equal(retrieve(query, records, {heldOut: true}).length, 0);
});

test('masked similarity never becomes an equality or recovery verdict', () => {
  const records = partition([row('one', [0x03e00008, 0x24020001]), row('two', [0x03e00008, 0x24020002])]);
  const ranked = retrieve(queryFromRecord(records[0]), records);
  assert.equal(ranked[0].score, 1);
  assert.match(ranked[0].evidence, /not semantic equivalence/);
  assert.equal(evaluate(records).measuredRecovery, null);
});

test('evaluation queries contain no accepted C or compiler assembly answer', () => {
  const query = queryFromRecord(partition([row('one', [0x03e00008, 0])])[0]);
  for (const field of ['sourceText', 'sourcePath', 'compilerAssembly', 'objectHex']) assert.equal(query[field], undefined);
});

test('mixed compiler identities, duplicate targets, and nonpure sources are rejected', () => {
  const a = row('one', [0x03e00008, 0]);
  assert.throws(() => partition([a, {...a, symbol: 'two', toolId: 'compiler-B'}]), /compiler identities/);
  assert.throws(() => partition([a, {...a, symbol: 'ONE'}]), /Duplicate target/);
  assert.throws(() => partition([{...a, sourceClass: 'HYBRID_C'}]), /non-PURE_C/);
  assert.throws(() => retrieve({...queryFromRecord(a), toolId: 'compiler-B'}, [a]), /different compiler/);
});

test('tampered source and instruction bytes are rejected', () => {
  const a = row('one', [0x03e00008, 0]);
  assert.throws(() => validateRecord({...a, sourceText: a.sourceText + 'x'}), /identity mismatch/);
  assert.throws(() => validateRecord({...a, objectHex: '0000'}), /aligned/);
  assert.throws(() => validateRecord({...a, retailHex: '0000000000000000'}), /identity mismatch/);
  assert.throws(() => validateRecord({...a, compilerAssembly: 'changed'}), /assembly identity/);
  assert.throws(() => validateRecord({...a, compilerAssembly: undefined}), /assembly identity/);
  assert.throws(() => validateRecord({...a, provenance: {}}), /assembly identity/);
});

test('explicit leakage in a purported train/test split is rejected', () => {
  const records = partition([row('one', [0x03e00008, 0x24020001]), row('two', [0x03e00008, 0x24020002])]);
  records[0].fold = 0;
  records[1].fold = 1;
  assert.throws(() => evaluate(records), /Family leakage/);
});

test('bounds reject invalid or accidental unlimited compilation', () => {
  assert.equal(argumentsFor([]).limit, 16);
  for (const args of [['--limit', '0'], ['--limit', 'Infinity'], ['--max-bytes', '7'], ['--limit'], ['--oops', 'x']]) {
    assert.throws(() => argumentsFor(args));
  }
});

test('bounded selection represents calls and branches instead of exhausting the leaf pool first', () => {
  const rows = [row('leaf1', [0x03e00008, 0x24020001]), row('leaf2', [0x03e00008, 0x24020002]),
    row('branch', [0x10800001, 0, 0x03e00008, 0]), row('caller', [0x0c000123, 0, 0x03e00008, 0])];
  const targets = rows.map(value => ({...value, expectedBytes: Buffer.from(value.retailHex, 'hex')}));
  const selected = selectTargets(targets, 3);
  assert.deepEqual(selected.map(value => features(value.retailHex, value.vramStart).stage),
    ['straight-line', 'control-flow', 'calls-and-context']);
  assert.deepEqual(selectTargets([...targets].reverse(), 3), selected);
});
