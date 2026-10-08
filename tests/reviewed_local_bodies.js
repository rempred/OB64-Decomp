#!/usr/bin/env node
'use strict';
// Read-only structural fixtures; no native tools or source activation.
const assert = require('assert');
const fs = require('fs');
const logical = require('../tools/lib/logical_functions');
const { loadWorkbenchModel } = require('../tools/lib/matching/target_model');
const { normalizeCompilerTextFunctions } = require('../tools/lib/active_targets');
const { validateCompilerFunctionPartition } = require('../tools/lib/elf_text_split');
const { verifyCompilerTextFunctions } = require('../tools/lib/phase8_matching_c');
const clone = value => JSON.parse(JSON.stringify(value));
const hex = value => '0x' + value.toString(16).toUpperCase().padStart(8, '0');
const workbench = loadWorkbenchModel();
const { model, baserom, logicalRegistry: registry } = workbench;
const config = JSON.parse(fs.readFileSync(logical.CONFIG_PATH, 'utf8'));
let negatives = 0;
function reject(label, run, pattern = /reviewed local body|compiler text|compiler function|malformed|owner entry/) {
  assert.throws(run, pattern, label); negatives++;
}
function fixture(index) {
  const row = model.rows.find(row => row.index === index);
  const bodies = registry.bodies.filter(body => body.romStart < row.romEndExclusive && body.romEndExclusive > row.romStart);
  let cursor = row.romStart;
  for (const body of bodies) { assert.equal(body.romStart, cursor); cursor = body.romEndExclusive; }
  assert.equal(cursor, row.romEndExclusive, 'real fixture must cover full physical owner');
  const symbol = `func_${row.romStart.toString(16).padStart(8, '0').toUpperCase()}`;
  const functions = bodies.map((body, i) => ({ symbol: i ? body.symbol : symbol,
    offset: hex(body.romStart - row.romStart), offsetNumber: body.romStart - row.romStart,
    bytes: body.romEndExclusive - body.romStart, binding: i ? 'LOCAL' : 'GLOBAL',
    entryEvidence: i ? 'reviewed-local-body' : 'owner' }));
  return { row, bodies, symbol, functions };
}
function check(f, functions = f.functions, reg = registry, rows = [f.row]) {
  logical.assertActivationCompatible(reg, f.symbol, rows, functions);
}
for (const [index, sizes] of [[9,[352,8,8]], [132,[88,32]], [133,[28,224,32]]]) {
  const f = fixture(index);
  assert.deepEqual(f.functions.map(fn => fn.bytes), sizes);
  check(f);
  const raw = f.functions.map(({ offsetNumber, ...fn }) => fn);
  assert.deepEqual(normalizeCompilerTextFunctions(raw, f.symbol, 'compiler text fixture'), f.functions);
}
const f = fixture(9);
function mutate(label, change) { const functions = clone(f.functions); change(functions); reject(label, () => check(f, functions)); }
mutate('case is not a canonical symbol', a => { a[1].symbol = a[1].symbol.toLowerCase(); });
mutate('invented alias', a => { a[1].symbol = 'validator_load_return'; });
mutate('primary evidence', a => { a[0].entryEvidence = 'reviewed-local-body'; });
mutate('GLOBAL secondary', a => { a[1].binding = 'GLOBAL'; });
mutate('LOCAL primary', a => { a[0].binding = 'LOCAL'; });
mutate('unknown secondary evidence', a => { a[1].entryEvidence = 'invented'; });
mutate('missing body', a => a.pop());
mutate('extra fourth body', a => a.push({ ...a[2], symbol: 'fourth', offset: hex(368), offsetNumber: 368 }));
mutate('reordered bodies', a => { [a[1], a[2]] = [a[2], a[1]]; });
mutate('whole-size-preserving fabricated split', a => { a[0].bytes -= 4; a[1].bytes += 4; a[1].offsetNumber -= 4; a[1].offset = hex(a[1].offsetNumber); });
mutate('old-tag body still maps exactly', a => { a[1].entryEvidence = 'fixed-address-call'; a[0].bytes -= 4; a[1].bytes += 4; a[1].offsetNumber -= 4; a[1].offset = hex(a[1].offsetNumber); });
mutate('old-tag secondary cannot use alias', a => { a[1].entryEvidence = 'internal-call-only'; a[1].symbol = 'alias'; });
const mixed = clone(f.functions); mixed[1].entryEvidence = 'fixed-address-call'; check(f, mixed);
reject('missing authenticated context', () => check(f, f.functions, clone(registry)));
reject('registry loaded without ROM', () => check(f, f.functions, logical.loadRegistry(model, null, config)));
const modified = logical.loadRegistry(model, baserom, clone(config));
modified.bodies.find(b => b.symbol === f.bodies[1].symbol).fragments[0].vramStart += 4;
reject('post-load fragment mutation', () => check(f, f.functions, modified));
const wrongRow = clone(f.row); wrongRow.slices[0].vramStart += 4;
reject('selected owner runtime mapping changed', () => check(f, f.functions, registry, [wrongRow]));
reject('wrong selected physical owner', () => check(f, f.functions, registry, [fixture(132).row]));
reject('multi-owner activation unsupported', () => check(f, f.functions, registry, [f.row, fixture(132).row]));
for (const index of [68,99]) {
  const other = fixture(index);
  assert(other.bodies.slice(1).some(body => body.evidence.status !== 'supplemental-reviewed-body'));
  reject('real non-supplemental secondary row ' + index, () => check(other));
}
const aliased = clone(config);
aliased.bodies.find(body => body.symbol === f.bodies[1].symbol).aliases.push('validator_load_return');
const aliasRegistry = logical.loadRegistry(model, baserom, aliased);
const aliasFunctions = clone(f.functions); aliasFunctions[1].symbol = 'validator_load_return';
reject('registered alias is not canonical body symbol', () => check(f, aliasFunctions, aliasRegistry));
for (const change of [a => { a[1].entryEvidence = 'bogus'; }, a => { a[1].binding = 'GLOBAL'; }, a => { a[0].entryEvidence = 'reviewed-local-body'; }]) {
  const raw = f.functions.map(({ offsetNumber, ...fn }) => fn); change(raw);
  reject('normalizer rejects malformed evidence', () => normalizeCompilerTextFunctions(raw, f.symbol, 'compiler text fixture'));
}
// The split validator is also used at diff_object_cache.js's reconstruction path.
reject('unbound neutral split/cache partition', () => validateCompilerFunctionPartition(f.functions, f.row.bytes, f.symbol), /composition across physical owners is unsupported/);
const old = clone(f.functions); old.slice(1).forEach(fn => { fn.entryEvidence = 'fixed-address-call'; });
validateCompilerFunctionPartition(old, f.row.bytes, f.symbol);
const section = { index: 7, name: '.ob64.r0009' };
const target = { symbol: f.symbol, compilerTextFunctionsExplicit: true, compilerTextFunctions: f.functions,
  vramStartNumber: f.row.slices[0].vramStart };
const symbols = f.functions.map(fn => ({ name: fn.symbol, value: fn.offsetNumber, size: fn.bytes,
  binding: fn.binding === 'GLOBAL' ? 1 : 0, symbolType: 2, visibility: 0, sectionIndex: 7 }));
assert.equal(verifyCompilerTextFunctions({ symbols }, target, section).length, 3);
assert.equal(verifyCompilerTextFunctions({ symbols: symbols.map(s => ({ ...s, value: s.value + target.vramStartNumber })) }, target, section, true).length, 3);
for (const change of [a => { a[1].binding = 1; }, a => { a[1].size += 4; }, a => { a[1].value += 4; }, a => { a[1].visibility = 2; }, a => a.push({ ...a[2], name: 'extra' })]) {
  const bad = clone(symbols); change(bad);
  reject('actual ELF census mismatch', () => verifyCompilerTextFunctions({ symbols: bad }, target, section), /compiler|function/);
}
console.log(`reviewed local body checks passed: three complete owners, ${negatives} negative controls`);
