#!/usr/bin/env node
'use strict';

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { scanSource, normalizeDeclaration, inventory, parseArguments, formatHuman, repositoryPath } = require('../tools/declarations');

let checks = 0;
function test(name, callback) { callback(); checks++; console.log('PASS ' + name); }
function environment() { return { aliases: new Map(), tags: new Map(), macros: new Set() }; }
function normalized(source) {
  const state = environment();
  return scanSource(source).events.filter(event => event.kind !== 'directive').map(event => ({ ...event, normalized: normalizeDeclaration(event, state) }));
}
function fixture(sources, headers = {}, extra = {}) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'ob64-declarations-'));
  const write = (relative, contents) => {
    const destination = path.join(directory, relative);
    fs.mkdirSync(path.dirname(destination), { recursive: true }); fs.writeFileSync(destination, contents);
  };
  fs.mkdirSync(path.join(directory, 'include'));
  const targets = Object.entries(sources).map(([symbol, item]) => ({ symbol, ...(typeof item === 'string'
    ? { source: 'src/' + symbol + '.c' } : item.target) }));
  for (const [symbol, item] of Object.entries(sources)) {
    if (typeof item === 'string') write('src/' + symbol + '.c', item);
    else if (item.text !== undefined) write(item.target.source || item.source, item.text);
  }
  for (const [name, contents] of Object.entries(headers)) write(name, contents);
  write('config/matching-c-targets.json', JSON.stringify({ targets }));
  write('config/matching-c-compilation-groups.json', JSON.stringify({ groups: extra.groups || [] }));
  write('config/matching-c-linkage.json', JSON.stringify({ symbols: extra.symbols || [], targets: extra.linkageTargets || [] }));
  write('config/source-policy.json', JSON.stringify({ preprocessor: { includeDirectories: ['include'] } }));
  return { directory, write, run: options => inventory({ root: directory, ...options }),
    close: () => {
      const real = fs.realpathSync(directory), parent = fs.realpathSync(os.tmpdir());
      assert.strictEqual(path.dirname(real).toLowerCase(), parent.toLowerCase());
      assert(path.basename(real).startsWith('ob64-declarations-'));
      fs.rmSync(real, { recursive: true });
    } };
}
function withFixture(sources, headers, extra, callback) {
  const data = fixture(sources, headers, extra);
  try { callback(data); } finally { data.close(); }
}
const guarded = body => '#ifndef SHARED_H\n#define SHARED_H\n' + body + '\n#endif\n';

test('semicolon bounds keep 28 RuntimeUnit forwards distinct from one layout', () => {
  const sources = {};
  for (let i = 0; i < 28; i++) sources['forward' + i] = 'typedef struct RuntimeUnit RuntimeUnit;\nextern RuntimeUnit *units;\n';
  sources.body = 'typedef unsigned char u8; typedef unsigned int u32; typedef int s32;\n'
    + 'typedef struct RuntimeUnit { u32 flags; u8 field_04_to_A7[0xA4]; s32 *field_A8; } RuntimeUnit;';
  for (let i = 0; i < 11; i++) sources['view' + i] = `typedef struct { int field_${i}; } RuntimeUnit;`;
  withFixture(sources, {}, {}, data => {
    const result = data.run({ targets: ['forward0'] });
    const unit = result.relationships.find(item => item.name === 'RuntimeUnit');
    assert.strictEqual(unit.opaqueForwards, 28); assert.strictEqual(unit.taggedConcreteBodies, 1);
    assert.strictEqual(unit.anonymousTypedefBodies, 11); assert.strictEqual(unit.concreteBodies, 12);
    assert(!unit.classifications.includes('textual-duplicate-candidate'));
  });
});

test('comments strings and nested bodies cannot invent top-level declarations', () => {
  const result = scanSource('/* typedef struct Fake { int x; } Fake; */\nint f(void) { char *s = "}; typedef int Fake;"; if (1) { } }\nextern volatile int real;');
  assert.deepStrictEqual(result.events.map(item => item.name), ['f', 'real']);
  assert.strictEqual(result.events[0].definition, true); assert.strictEqual(result.issues.length, 0);
});

test('identical pilot records are textual candidates; ClassEntry views stay distinct', () => {
  const record = 'typedef unsigned char u8; typedef struct Func001957D0SourceRecord { u8 field_00; u8 field_02[5]; } Func001957D0SourceRecord;';
  withFixture({ one: record + 'typedef struct ClassEntry { int field_00; } ClassEntry;',
    two: record + 'typedef struct ClassEntry { int field_00; char padding[20]; } ClassEntry;' }, {}, {}, data => {
    const result = data.run({ targets: ['one'] });
    assert(result.relationships.find(item => item.name === 'Func001957D0SourceRecord').classifications.includes('textual-duplicate-candidate'));
    assert(result.relationships.find(item => item.name === 'ClassEntry').classifications.includes('partial-views-or-incompatible-bodies'));
    assert(result.evidenceBoundary.some(item => item.includes('semantic equivalence')));
  });
});

test('local typedef meanings qualify otherwise identical record spelling', () => {
  withFixture({ one: 'typedef unsigned char Word; typedef struct Record { Word field; } Record; extern Word fn(void);',
    two: 'typedef unsigned int Word; typedef struct Record { Word field; } Record; Word fn(void) { return 0; }' }, {}, {}, data => {
    const result = data.run({ targets: ['one'] });
    const records = result.declarations.filter(item => item.name === 'Record');
    assert.notStrictEqual(records[0].contexts[0].signature, records[1].contexts[0].signature);
    assert.strictEqual(result.relationships.find(item => item.name === 'fn').supportedSignatures.length, 2);
  });
});

test('function definition/prototype names are ignored but width and qualifiers retained', () => {
  const result = normalized('typedef unsigned short u16; extern int call(volatile u16 *value, int); int call(volatile u16 *other, int count) { return 0; } extern int call(u16 *, int);');
  assert.strictEqual(result[1].normalized.signature, result[2].normalized.signature);
  assert.notStrictEqual(result[1].normalized.signature, result[3].normalized.signature);
});

test('void and unspecified argument lists remain distinct and unspecified is unresolved', () => {
  const result = normalized('extern int f(); extern int f(void);');
  assert.notStrictEqual(result[0].normalized.signature, result[1].normalized.signature);
  assert(result[0].normalized.reasons.includes('unspecified-parameter-list'));
});

test('compatible parameter qualifiers and incomplete arrays do not invent conflicts', () => {
  const result = normalized('extern int f(const int value, int * const pointer); extern int f(int, int *); extern int a(int values[4]);');
  assert(result[0].normalized.reasons.includes('qualified-parameter-compatibility-unsupported'));
  assert(result[2].normalized.reasons.includes('array-parameter-adjustment-unsupported'));
  withFixture({ one: '#include "shared.h"\nextern int values[4];' }, { 'include/shared.h': guarded('extern int values[];') }, {}, data => {
    const report = data.run({ targets: ['one'], headers: ['include/shared.h'], check: true });
    assert.strictEqual(report.check.status, 'incomplete'); assert.strictEqual(report.check.problems.length, 0);
  });
});

test('conditional packed function-pointer variadic and macro declarators stay unsupported', () => {
  const source = '#if OPTION\ntypedef struct Conditional { int x; } Conditional;\n#endif\n'
    + 'typedef struct Packed { int x; } __attribute__((packed)) Packed;\n'
    + 'extern int (*callback)(int); extern int variadic(int, ...); DECLARE(thing);';
  const result = scanSource(source);
  assert.strictEqual(result.events.filter(item => item.kind !== 'directive').length, 5);
  assert(result.events.filter(item => item.kind !== 'directive').every(item => !item.supported));
  const state = environment(); state.macros.add('API_TYPE');
  assert(normalizeDeclaration(scanSource('extern API_TYPE x;').events[0], state).reasons.includes('macro-in-type'));
});

test('transitive guarded header closure checks nominated producers without compiler', () => {
  withFixture({ one: '#include "outer.h"\nint call(int value) { return value; }', two: '#include "shared.h"\nint two(void) { return call(1); }' },
    { 'include/shared.h': guarded('extern int call(int value);'), 'include/outer.h': '#include "shared.h"\n#include "shared.h"\n' }, {}, data => {
      const options = { targets: ['one', 'two'], headers: ['include/shared.h'], check: true };
      const result = data.run(options);
      assert.strictEqual(result.check.status, 'supported-subset-clean'); assert.strictEqual(result.check.compilerChecked, false);
      assert.deepStrictEqual(result.check.knownConsumers, ['src/one.c', 'src/two.c']);
      assert(result.includeClosure.find(item => item.context === 'src/one.c').files.includes('include/shared.h'));
      assert.strictEqual(data.run({ ...options, targets: ['one'] }).check.status, 'incomplete');
      assert(formatHuman(result).includes('compilerChecked: false'));
      assert.deepStrictEqual(data.run(options), result);
    });
});

test('supported conflicting signedness prototype and volatile declarations fail scoped check', () => {
  withFixture({ one: '#include "shared.h"\nextern int global; unsigned int call(int value) { return value; }' },
    { 'include/shared.h': guarded('extern volatile int global; extern int call(int value);') }, {}, data => {
      const result = data.run({ targets: ['one'], headers: ['include/shared.h'], check: true });
      assert.strictEqual(result.check.status, 'conflict');
      assert.deepStrictEqual(result.check.problems.map(item => item.name).sort(), ['call', 'global']);
    });
});

test('duplicate concrete definitions reject and repeated aliases remain compiler questions', () => {
  withFixture({ one: '#include "shared.h"\ntypedef struct Record { int x; } Record; typedef int Alias;' },
    { 'include/shared.h': guarded('typedef struct Record { int x; } Record; typedef int Alias;') }, {}, data => {
      const result = data.run({ targets: ['one'], headers: ['include/shared.h'], check: true });
      assert(result.check.problems.some(item => item.reason === 'duplicate-definition'));
      assert(result.check.uncertainties.some(item => item.name === 'Alias' && item.reason === 'duplicate-alias-needs-target-compiler'));
      data.write('src/one.c', '#include "shared.h"\ntypedef unsigned int Alias;');
      assert(data.run({ targets: ['one'], headers: ['include/shared.h'], check: true }).check.problems.some(item => item.name === 'Alias'));
    });
});

test('missing macro conditional and unsafe includes cannot certify closure', () => {
  for (const include of ['#include "missing.h"', '#include HEADER', '#if FLAG\n#include "shared.h"\n#endif', '#include "../outside.h"']) {
    withFixture({ one: include + '\nextern int call(void);' }, { 'include/shared.h': guarded('extern int call(void);') }, {}, data => {
      const result = data.run({ targets: ['one'], headers: ['include/shared.h'], check: true });
      assert.strictEqual(result.check.status, 'incomplete');
      assert(result.check.uncertainties.some(item => /include/.test(item.reason)));
    });
  }
});

test('unresolved include in another active producer prevents complete consumer census', () => {
  withFixture({ one: '#include "shared.h"', hidden: '#include HEADER' }, { 'include/shared.h': guarded('extern int call(void);') }, {}, data => {
    assert(data.run({ targets: ['one'], headers: ['include/shared.h'], check: true }).check.uncertainties.some(item => item.reason.startsWith('consumer-closure-unresolved:')));
  });
});

test('non-including producer with a different header name signature prevents clean check', () => {
  withFixture({ one: '#include "shared.h"', other: 'extern volatile unsigned int shared;' },
    { 'include/shared.h': guarded('extern int shared;') }, {}, data => {
      const result = data.run({ targets: ['one'], headers: ['include/shared.h'], check: true });
      assert.strictEqual(result.check.status, 'incomplete'); assert.strictEqual(result.check.problems.length, 0);
      assert(result.check.uncertainties.some(item => item.context === 'src/other.c' && item.reason === 'declared-outside-nominated-closure'));
    });
});

test('header shadowing reports actual resolution and nominated path mismatch', () => {
  withFixture({ one: '#include "shared.h"' }, { 'include/shared.h': guarded('extern int original(void);'), 'src/shared.h': guarded('extern int shadow(void);') }, {}, data => {
    const result = data.run({ targets: ['one'], headers: ['include/shared.h'], check: true });
    assert.strictEqual(result.check.status, 'incomplete');
    const edge = result.includeClosure.find(item => item.context === 'src/one.c').edges[0];
    assert.strictEqual(edge.resolved, 'src/shared.h'); assert.deepStrictEqual(edge.shadowedCandidates, ['include/shared.h']);
  });
});

test('packed directive and guard collision are explicit incomplete states', () => {
  withFixture({ one: '#include "first.h"\n#include "shared.h"' }, {
    'include/shared.h': guarded('extern int call(void);'), 'include/first.h': guarded('extern int other(void);'),
  }, {}, data => {
    const options = { targets: ['one'], headers: ['include/shared.h'], check: true };
    assert(data.run(options).check.uncertainties.some(item => item.reason.startsWith('header-guard-collision:')));
    data.write('src/one.c', '#pragma pack(1)\n#include "shared.h"');
    const result = data.run(options);
    assert.strictEqual(result.check.status, 'incomplete');
    assert(result.check.uncertainties.some(item => item.reason.includes('directive')));
  });
});

test('unsupported unnamed header declaration is not silently a clean empty scope', () => {
  withFixture({ one: '#include "shared.h"' }, { 'include/shared.h': guarded('typedef struct Packed { int x; } __attribute__((packed)) Packed;') }, {}, data => {
    const result = data.run({ targets: ['one'], headers: ['include/shared.h'], check: true });
    assert.strictEqual(result.check.status, 'incomplete');
    assert(result.check.uncertainties.some(item => item.reason.includes('packing')));
  });
});

test('transitive header aliases and self-containment are inside the nominated check', () => {
  withFixture({ one: '#include "shared.h"\ntypedef unsigned int Byte;' }, {
    'include/shared.h': guarded('#include "types.h"\nextern Byte value;'), 'include/types.h': 'typedef unsigned char Byte;',
  }, {}, data => {
    const options = { targets: ['one'], headers: ['include/shared.h'], check: true };
    assert(data.run(options).check.problems.some(item => item.name === 'Byte'));
    data.write('include/shared.h', guarded('extern Unknown value;'));
    assert(data.run(options).check.uncertainties.some(item => item.reason.startsWith('header-self-containment:')));
  });
});

test('predefined or undefined include guards cannot conceal declarations', () => {
  withFixture({ one: '#define SHARED_H\n#include "shared.h"' }, { 'include/shared.h': guarded('typedef struct R { int x; } R;') }, {}, data => {
    const options = { targets: ['one'], headers: ['include/shared.h'], check: true };
    assert(data.run(options).check.uncertainties.some(item => item.reason.startsWith('predefined-header-guard:')));
    data.write('src/one.c', '#include "shared.h"\n#undef SHARED_H\n#include "shared.h"');
    assert(data.run(options).check.problems.some(item => item.reason === 'duplicate-definition'));
  });
});

test('group targets share one producer and all member context remains visible', () => {
  withFixture({ one: { target: { compilationGroup: 'pair' }, source: 'src/pair.c', text: '#include "shared.h"\nint one(void) { return 1; } int two(void) { return 2; }' },
    two: { target: { compilationGroup: 'pair' } } }, { 'include/shared.h': guarded('extern int one(void);') },
  { groups: [{ id: 'pair', source: 'src/pair.c', members: [{ symbol: 'one' }, { symbol: 'two' }] }] }, data => {
    const result = data.run({ targets: ['two'], headers: ['include/shared.h'], check: true });
    assert.strictEqual(result.producers.length, 1); assert.deepStrictEqual(result.producers[0].targets, ['one', 'two']);
    assert.strictEqual(result.check.status, 'supported-subset-clean');
  });
});

test('same address symbol retains distinct overlay producer contexts', () => {
  withFixture({ one: { target: { source: 'src/overlays/descriptor_01/one.c' }, text: 'extern volatile int D_80100000;' },
    two: { target: { source: 'src/overlays/descriptor_02/two.c' }, text: 'extern unsigned int D_80100000;' } }, {},
  { symbols: [{ name: 'D_80100000', address: '0x80100000' }], linkageTargets: [
    { symbol: 'one', expectedRelocations: [{ symbol: 'D_80100000' }] }, { symbol: 'two', expectedRelocations: [{ symbol: 'D_80100000' }] },
  ] }, data => {
    const result = data.run({ targets: ['one'] }); const relation = result.relationships.find(item => item.name === 'D_80100000');
    assert.deepStrictEqual(relation.mappedReferences.map(item => item.overlayContext), ['01', '02']);
    assert(relation.identity.includes('do not establish one object')); assert.strictEqual(result.check, null);
  });
});

test('path escapes and unknown target/config identities fail closed before source access', () => {
  withFixture({ one: 'int one(void) { return 0; }' }, {}, {}, data => {
    for (const name of ['../escape', '/absolute', 'C:/outside', 'include/../escape', 'include\\file.h']) assert.throws(() => repositoryPath(data.directory, name), /unsafe/);
    assert.throws(() => data.run({ targets: ['absent'] }), /unknown active target/);
    assert.throws(() => data.run({ targets: ['one'], headers: ['include/missing.h'] }), /missing repository/);
    assert.throws(() => data.run({ targets: ['one'], check: true }), /requires/);
    data.write('config/matching-c-targets.json', JSON.stringify({ targets: [{ symbol: 'one', source: '../outside.c' }] }));
    assert.throws(() => data.run({ targets: ['one'] }), /unsafe/);
  });
});

test('CLI repeatable scopes and malformed options', () => {
  assert.deepStrictEqual(parseArguments(['--target', 'one', '--target', 'two', '--header', 'include/shared.h', '--check', '--json']),
    { targets: ['one', 'two'], headers: ['include/shared.h'], check: true, json: true });
  assert.throws(() => parseArguments(['--target']), /missing/);
  assert.throws(() => parseArguments(['--fix']), /unknown/);
});

console.log(`declaration_inventory: ${checks} fixture groups passed; no compiler/build or canonical source writes`);
