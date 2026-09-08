#!/usr/bin/env node
'use strict';
const fs = require('fs'), path = require('path'), assert = require('assert');
const { prepare, selectInput, verifyCache, confinedBuild, fileHash, sha } = require('./core');
const { makeElf, validateElf } = require('./elf');
const { parse } = require('./cli');
const repo = path.resolve(__dirname, '../..');
const tests = [];
function check(name, callback) { callback(); tests.push({ name, status: 'pass' }); }
function reject(name, callback) { check(name, () => assert.throws(callback)); }
function main() {
  const config = path.resolve(process.argv[2] || ''), root = confinedBuild(process.argv[3] || 'build/analysis-packet-tests');
  assert(fs.existsSync(config), 'usage: node tools/analysis_packet/test.js LOCAL_CONFIG build/TEST_ROOT');
  fs.mkdirSync(root, { recursive: true });
  const out = fs.mkdtempSync(path.join(root, 'run-'));
  reject('tracked output path rejected', () => confinedBuild(path.join(repo, 'src/packet')));
  reject('parent escape rejected', () => confinedBuild(path.join(repo, 'build/../src/packet')));
  reject('irrelevant CLI option rejected', () => parse(['prepare', 'func_0020BFF8', '--kuna', 'fake']));
  reject('duplicate CLI option rejected', () => parse(['prepare', 'func_0020BFF8', '--out', 'one', '--out', 'two']));
  const tiny = [{ address: 0x80100000, bytes: Buffer.from('03e0000800000000', 'hex'), executable: true }];
  check('ELF independent section/function parser agrees', () => {
    const elf = makeElf('fixture', tiny), parsed = require('../lib/phase7_conventional').parseElf32BigEndian(elf);
    assert.equal(parsed.header.entry, tiny[0].address);
    const text = parsed.sections.find(s => s.name === '.text'); assert.equal(text.size, 8); assert.equal(text.address, tiny[0].address);
  });
  reject('ELF mutated load bytes rejected', () => { const elf = makeElf('fixture', tiny); elf[elf.readUInt32BE(56)] ^= 1; validateElf(elf, tiny); });
  reject('overlapping load intervals rejected', () => makeElf('fixture', [...tiny, { ...tiny[0], executable: false }]));
  const model = require('../lib/phase7_conventional').loadAcceptedModel(), rom = fs.readFileSync(path.join(repo, 'build/baserom.us_rev0.z64'));
  const row = model.rows.find(r => r.romStart === 0x20bff8);
  const modified = changes => ({ ...model, rows: model.rows.map(r => r === row ? { ...r, ...changes } : r) });
  reject('entry prefix rejected', () => selectInput(modified({ part: { ...row.part, symbolByteOffset: 4 } }), 'func_0020BFF8', rom));
  reject('secondary label is not relabeled as owner entry', () => selectInput(modified({ part: { ...row.part, name: 'other_primary_entry' } }), 'func_0020BFF8', rom));
  reject('actual multi-owner primary rejected', () => selectInput(model, 'func_0021D374', rom));
  reject('actual multi-owner secondary rejected', () => selectInput(model, 'func_0021D3BC', rom));
  reject('actual nonexecutable data symbol rejected', () => selectInput(model, 'D_801D03A0', rom));
  reject('ambiguous owner rejected', () => selectInput(modified({ ambiguous: true }), 'func_0020BFF8', rom));
  reject('multiple mapping slices rejected', () => selectInput(modified({ slices: [...row.slices, ...row.slices] }), 'func_0020BFF8', rom));
  reject('nonexecutable owner rejected', () => selectInput(modified({ slices: [{ ...row.slices[0], executable: false }] }), 'func_0020BFF8', rom));
  reject('wrong ROM hash rejected', () => { const bad = Buffer.from(rom); bad[0] ^= 1; selectInput(model, 'func_0020BFF8', bad); });
  reject('code supplied as table rejected', () => selectInput(model, 'func_0020BFF8', rom, '0x20bff8:28'));
  reject('partial table length rejected', () => selectInput(model, 'func_001F197C', rom, '0x2131d8:84'));
  reject('unaligned table rejected', () => selectInput(model, 'func_001F197C', rom, '0x2131d9:88'));
  reject('alternate without ambiguity reason rejected', () => prepare({ symbol: 'func_0020BFF8', config, out, kunaOption: 'regionstructure=off' }));
  const results = [];
  const options = symbol => ({ symbol, config, out });
  const first = prepare(options('func_0020BFF8')); results.push(first);
  check('both default tools produced BFF8', () => assert.equal(first.status, 'produced-hypotheses'));
  const before = fileHash(path.join(first.directory, 'manifest.json')), hit = prepare(options('func_0020BFF8'));
  check('cache hit preserves packet artifacts', () => { assert.equal(hit.cache, 'hit'); assert.equal(hit.directory, first.directory); assert.equal(fileHash(path.join(hit.directory, 'manifest.json')), before); });
  const key = JSON.parse(fs.readFileSync(path.join(first.directory, 'packet.json'))).key;
  for (const [name, mutate] of [
    ['changed output', d => fs.appendFileSync(path.join(d, 'kuna/code.c'), '\ncorrupt')],
    ['removed manifest member', d => { const p = path.join(d, 'manifest.json'), j = JSON.parse(fs.readFileSync(p)); j.files.pop(); fs.writeFileSync(p, JSON.stringify(j)); }],
    ['changed input identity', d => { const p = path.join(d, 'identity.json'), j = JSON.parse(fs.readFileSync(p)); j.options.rawM2c = false; fs.writeFileSync(p, JSON.stringify(j)); }],
    ['unsafe manifest path', d => { const p = path.join(d, 'manifest.json'), j = JSON.parse(fs.readFileSync(p)); j.files[0].path = '../escape'; fs.writeFileSync(p, JSON.stringify(j)); }],
  ]) {
    const copy = path.join(out, 'negative-' + name.replaceAll(' ', '-')); fs.cpSync(first.directory, copy, { recursive: true }); mutate(copy);
    reject('cache rejects ' + name, () => verifyCache(copy, key));
  }
  const missingConfig = path.join(out, 'missing.json'); fs.writeFileSync(missingConfig, JSON.stringify({ schema: 1, kuna: null, m2c: null }));
  const missing = prepare({ ...options('func_0020BFF8'), config: missingConfig }); results.push(missing);
  check('missing tools remain visible and uncoupled', () => { const p = JSON.parse(fs.readFileSync(path.join(missing.directory, 'packet.json'))); assert.equal(p.status, 'partial'); assert.equal(p.tools.kuna.status, 'unavailable'); assert.equal(p.tools.m2c.status, 'unavailable'); });
  const driftConfig = path.join(out, 'drift.json'), drift = JSON.parse(fs.readFileSync(config)); drift.kuna.sha256 = '0'.repeat(64); fs.writeFileSync(driftConfig, JSON.stringify(drift));
  const unavailable = prepare({ ...options('func_0020BFF8'), config: driftConfig }); results.push(unavailable);
  check('drifted tool not executed while other tool remains usable', () => { const p = JSON.parse(fs.readFileSync(path.join(unavailable.directory, 'packet.json'))); assert.equal(p.tools.kuna.status, 'unavailable'); assert.equal(p.tools.m2c.status, 'produced'); assert.notEqual(unavailable.directory, first.directory); });
  const timeout = prepare({ ...options('func_0020BFF8'), timeoutMs: 1 }); results.push(timeout);
  check('execution timeouts recorded as partial failure', () => { const p = JSON.parse(fs.readFileSync(path.join(timeout.directory, 'packet.json'))); assert.equal(p.status, 'partial'); assert.equal(p.tools.kuna.status, 'failed'); });
  const samples = [
    ['func_001F6098', null, 'build/combat-draw-wave8-r4/kuna/default/code.c', 'build/combat-draw-wave8-r4/m2c/001F6098-code.c'],
    ['func_001F3C00', null, 'build/kuna-analysis-trial-r1/outputs/3c00-default/code.c', 'build/kuna-analysis-trial-r1/m2c/001F3C00-code.c'],
    ['func_001F197C', '0x2131d8:88', 'build/kuna-analysis-trial-r1/outputs/197c-table-default/code.c', null],
  ];
  for (const [symbol, table, kunaReference, m2cReference] of samples) {
    const r = prepare({ ...options(symbol), table }); results.push(r);
    check(symbol + ' default packet succeeds', () => assert.equal(r.status, 'produced-hypotheses'));
    check(symbol + ' Kuna matches frozen packet', () => {
      const referenceDir = path.dirname(path.join(repo, kunaReference));
      const raw = ['stdout.json', 'stdout.txt'].map(n => path.join(referenceDir, n)).find(p => fs.existsSync(p));
      // Older extraction appended CRLF to code.c; compare the preserved raw JSON
      // code field byte-for-byte, not that separately formatted display artifact.
      const code = JSON.parse(fs.readFileSync(raw)).functions[0].code;
      assert.equal(fs.readFileSync(path.join(r.directory, 'kuna/code.c'), 'utf8'), code);
    });
    if (m2cReference) check(symbol + ' m2c matches frozen packet', () => assert.equal(fileHash(path.join(r.directory, 'm2c/code.c')), fileHash(path.join(repo, m2cReference))));
    if (table) check('supplied table stays explicit and both outputs recover switch', () => { const m = JSON.parse(fs.readFileSync(path.join(r.directory, 'input.json'))); assert.equal(m.suppliedTables[0].bytes, 88); for (const tool of ['kuna', 'm2c']) assert(/switch\s*\(/.test(fs.readFileSync(path.join(r.directory, tool, 'code.c'), 'utf8'))); });
  }
  const alternate = prepare({ ...options('func_0020BFF8'), kunaOption: 'regionstructure=off', reason: 'Test whether an explicitly requested structurer changes the selected branch.' }); results.push(alternate);
  check('alternate is additive and changes cache identity', () => { assert.notEqual(alternate.directory, first.directory); const p = JSON.parse(fs.readFileSync(path.join(alternate.directory, 'packet.json'))); assert.equal(p.tools.kunaAlternate.status, 'produced'); assert(p.tools.kunaAlternate.reason); assert.equal(p.tools.kuna.status, 'produced'); });
  const grouped = prepare(options('func_00204F34')); results.push(grouped);
  check('accepted compilation-group member keeps its own retail extent', () => {
    assert.equal(grouped.status, 'produced-hypotheses'); const m = JSON.parse(fs.readFileSync(path.join(grouped.directory, 'input.json')));
    assert.equal(m.row.bytes, 376); assert.equal(m.productionGrouping.id, 'combat_pose_metadata');
    assert.equal(m.codeSha256, '34B6830BC258827623BD48614D41685A76486A9FD8B50DE76F52596119279D8C');
  });
  fs.writeFileSync(path.join(out, 'results.json'), JSON.stringify({ tests, results }, null, 2));
  console.log(JSON.stringify({ status: 'pass', tests: tests.length, directory: out, resultSha256: fileHash(path.join(out, 'results.json')) }, null, 2));
}
try { main(); } catch (error) { console.error(error.stack); console.error(JSON.stringify(tests)); process.exitCode = 1; }
