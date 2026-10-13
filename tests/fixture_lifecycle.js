'use strict';
const assert = require('assert/strict');
const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');
const test = require('node:test');
const { createFixtureSuite } = require('./lib/fixture_lifecycle');
const root = process.env.OB64_FIXTURE_LIFECYCLE_TEST_ROOT || path.join(__dirname, '../build/tests/fixture-lifecycle');
assert(path.isAbsolute(root)); fs.mkdirSync(root, { recursive: true });
function fresh(keep = '0') {
  const parent = fs.mkdtempSync(path.join(root, 'tiny-'));
  return createFixtureSuite(null, { root: parent, keep });
}
function records(suite, suffix) {
  return fs.readdirSync(suite.invocation).filter(name => name.endsWith(suffix))
    .map(name => JSON.parse(fs.readFileSync(path.join(suite.invocation, name))));
}

test('successful owned case records outcome before bounded deletion and never selects historical siblings', async () => {
  const suite = fresh(), historical = path.join(path.dirname(suite.invocation), 'fixture-historical');
  fs.mkdirSync(historical); fs.writeFileSync(path.join(historical, 'evidence.txt'), 'old evidence');
  let fixture;
  const unlink = fs.unlinkSync;
  fs.unlinkSync = file => {
    const result = records(suite, '.result.json');
    assert.equal(result.length, 1); assert.equal(result[0].status, 'pass');
    assert(file.startsWith(suite.invocation + path.sep));
    return unlink(file);
  };
  try {
    await suite.runCase('success', () => {
      fixture = suite.fixtureDirectory(); fs.mkdirSync(path.join(fixture, 'nested'));
      fs.writeFileSync(path.join(fixture, 'nested/input.c'), 'int x;');
      fs.writeFileSync(path.join(fixture, 'report.json'), '{}');
    });
  } finally { fs.unlinkSync = unlink; }
  assert(!fs.existsSync(fixture));
  assert.equal(fs.readFileSync(path.join(historical, 'evidence.txt'), 'utf8'), 'old evidence');
  assert.equal(records(suite, '.cleanup.json')[0].status, 'removed-successful-fixtures');
});

test('failed tests, falsy thrown values and explicit keep mode preserve exact fixtures', async () => {
  for (const error of [Error('original test failure'), null, 0]) {
    const suite = fresh(); let fixture, caught = false;
    try { await suite.runCase('failure', () => { fixture = suite.fixtureDirectory(); fs.writeFileSync(path.join(fixture, 'evidence'), 'keep'); throw error; }); }
    catch (actual) { caught = true; assert.equal(actual, error); }
    assert(caught); assert.equal(fs.readFileSync(path.join(fixture, 'evidence'), 'utf8'), 'keep');
    assert.equal(records(suite, '.result.json')[0].status, 'fail');
    assert.equal(records(suite, '.cleanup.json')[0].status, 'retained');
  }
  const keep = fresh('1'); let fixture;
  await keep.runCase('keep', () => { fixture = keep.fixtureDirectory(); fs.writeFileSync(path.join(fixture, 'source.c'), 'retained'); });
  assert(fs.existsSync(fixture)); assert.equal(records(keep, '.result.json')[0].retainedReason, 'keep-fixtures mode');
  assert.throws(() => fresh('yes'), /must be 0 or 1/);
});

test('case containing a junction or hardlink is retained without following or unlinking it', async () => {
  for (const mode of ['junction', 'hardlink']) {
    const suite = fresh(), outside = fs.mkdtempSync(path.join(root, 'outside-'));
    fs.writeFileSync(path.join(outside, 'evidence'), 'untouched'); let fixture;
    await suite.runCase(mode, () => {
      fixture = suite.fixtureDirectory();
      if (mode === 'junction') fs.symlinkSync(outside, path.join(fixture, 'link'), process.platform === 'win32' ? 'junction' : 'dir');
      else fs.linkSync(path.join(outside, 'evidence'), path.join(fixture, 'link'));
    });
    assert(fs.existsSync(path.join(fixture, 'link')));
    assert.equal(fs.readFileSync(path.join(outside, 'evidence'), 'utf8'), 'untouched');
    assert.equal(records(suite, '.cleanup.json')[0].status, 'retained');
  }
});

test('unregistered children and escaped allocation prefixes retain or reject without deletion', async () => {
  const suite = fresh(); let unknown;
  await suite.runCase('unknown', () => {
    assert.throws(() => suite.fixtureDirectory('../escape-'), /safe prefix/);
    const fixture = suite.fixtureDirectory(); unknown = path.join(path.dirname(fixture), 'unknown.txt');
    fs.writeFileSync(unknown, 'unknown');
  });
  assert.equal(fs.readFileSync(unknown, 'utf8'), 'unknown');
  assert.equal(records(suite, '.cleanup.json')[0].status, 'retained');
  assert.throws(() => suite.fixtureDirectory(), /active test/);
});

test('plain pre-result replacement, moved roots and missing allocations retain the entire case', async () => {
  for (const mode of ['replacement', 'moved', 'missing']) {
    const suite = fresh(), parent = path.dirname(suite.invocation);
    const saved = path.join(parent, 'saved-owned'), outsider = path.join(parent, 'unowned-preexisting');
    fs.mkdirSync(outsider); fs.writeFileSync(path.join(outsider, 'evidence'), 'unowned evidence');
    const within = file => assert(path.resolve(file).startsWith(path.resolve(parent) + path.sep));
    let allocated, sibling;
    await suite.runCase(mode, () => {
      allocated = suite.fixtureDirectory(); sibling = suite.fixtureDirectory();
      fs.writeFileSync(path.join(sibling, 'evidence'), 'owned sibling must remain');
      const originalIdentity = fs.statSync(allocated).ino;
      for (const file of [allocated, saved, outsider]) within(file);
      if (mode === 'missing') fs.rmdirSync(allocated); // Only the newly allocated empty fixture.
      else {
        fs.renameSync(allocated, saved);
        if (mode === 'replacement') {
          fs.renameSync(outsider, allocated);
          assert.notEqual(fs.statSync(allocated).ino, originalIdentity);
        }
      }
    });
    const cleanup = records(suite, '.cleanup.json')[0];
    assert.equal(cleanup.status, 'retained');
    assert.equal(records(suite, '.result.json')[0].cleanupPlanned, false);
    assert.equal(fs.readFileSync(path.join(sibling, 'evidence'), 'utf8'), 'owned sibling must remain');
    if (mode === 'replacement') {
      assert.equal(fs.readFileSync(path.join(allocated, 'evidence'), 'utf8'), 'unowned evidence');
      assert.equal(cleanup.reason, 'allocated fixture root replaced');
    } else assert.equal(fs.readFileSync(path.join(outsider, 'evidence'), 'utf8'), 'unowned evidence');
    if (mode !== 'missing') assert(fs.existsSync(saved));
  }
});

test('failed durable result capture preserves data and does not mask original test failure', async () => {
  for (const fails of [false, true]) {
    const suite = fresh(), original = Error('test failed'); let fixture;
    const open = fs.openSync;
    fs.openSync = (file, ...rest) => { if (String(file).endsWith('.result.json')) throw Error('capture failed'); return open(file, ...rest); };
    try {
      await assert.rejects(suite.runCase('capture failure', () => {
        fixture = suite.fixtureDirectory(); fs.writeFileSync(path.join(fixture, 'source'), 'kept');
        if (fails) throw original;
      }), error => fails ? error === original && error.fixtureCaptureError === 'capture failed' : error.message === 'capture failed');
    } finally { fs.openSync = open; }
    assert.equal(fs.readFileSync(path.join(fixture, 'source'), 'utf8'), 'kept');
    assert.equal(records(suite, '.cleanup.json').length, 0);
  }
});

test('post-result file drift cancels cleanup before any removal', async () => {
  const suite = fresh(); let fixture;
  const open = fs.openSync;
  fs.openSync = (file, ...rest) => {
    if (String(file).endsWith('.result.json')) fs.appendFileSync(path.join(fixture, 'source'), 'changed');
    return open(file, ...rest);
  };
  try { await suite.runCase('drift', () => { fixture = suite.fixtureDirectory(); fs.writeFileSync(path.join(fixture, 'source'), 'original'); }); }
  finally { fs.openSync = open; }
  assert.equal(fs.readFileSync(path.join(fixture, 'source'), 'utf8'), 'originalchanged');
  assert.equal(records(suite, '.cleanup.json')[0].status, 'retained');
});

test('simultaneous asynchronous cases own disjoint fixtures', async () => {
  const suite = fresh(), dirs = [];
  await Promise.all([1, 2].map(index => suite.runCase(`case ${index}`, async () => {
    await new Promise(resolve => setImmediate(resolve));
    const fixture = suite.fixtureDirectory(); dirs.push(fixture); fs.writeFileSync(path.join(fixture, 'value'), String(index));
  })));
  assert.equal(new Set(dirs.map(file => path.dirname(file))).size, 2);
  assert(dirs.every(file => !fs.existsSync(file))); assert.equal(records(suite, '.result.json').length, 2);
});

test('a process crash before result capture leaves its fresh evidence intact', () => {
  const parent = fs.mkdtempSync(path.join(root, 'crash-'));
  const code = `const fs=require('fs'),path=require('path');const {createFixtureSuite}=require(process.argv[1]);
    const s=createFixtureSuite(null,{root:process.argv[2],keep:'0'});
    s.runCase('crash',()=>{const d=s.fixtureDirectory();fs.writeFileSync(path.join(d,'evidence'),'crashed');process.exit(23);});`;
  const child = childProcess.spawnSync(process.execPath, ['-e', code, require.resolve('./lib/fixture_lifecycle'), parent], { windowsHide: true });
  assert.equal(child.status, 23);
  const invocation = path.join(parent, fs.readdirSync(parent)[0]);
  assert(!fs.readdirSync(invocation).some(name => name.endsWith('.result.json')));
  const caseRoot = path.join(invocation, fs.readdirSync(invocation).find(name => name.startsWith('case-')));
  const fixture = path.join(caseRoot, fs.readdirSync(caseRoot)[0]);
  assert.equal(fs.readFileSync(path.join(fixture, 'evidence'), 'utf8'), 'crashed');
});
