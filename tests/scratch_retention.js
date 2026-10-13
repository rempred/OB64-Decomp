'use strict';
const assert = require('assert/strict');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const vm = require('vm');
const test = require('node:test');
const { Worker } = require('worker_threads');
const retention = require('../tools/lib/scratch_retention');
const cli = require('../tools/scratch-retention');
const base = process.env.OB64_SCRATCH_TEST_ROOT || path.join(__dirname, '../build/tests/scratch-retention');
assert(path.isAbsolute(base), 'test root must be absolute');
fs.mkdirSync(base, { recursive: true });
const config = { maxRuns: 1, maxBytes: 100, maxRecordBytes: 100, floorBytes: 20, peakBytes: 10 };
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex').toUpperCase();
const bytesIdentity = bytes => ({ bytes: bytes.length, sha256: hash(bytes) });
let suffix = 0;
function fixture() {
  const root = fs.mkdtempSync(path.join(base, 'tiny-'));
  fs.mkdirSync(path.join(root, 'diff'));
  return root;
}
function start(root, symbol = 'func_12345678', readSpace = () => 1000) {
  const name = `${symbol}-1791818961866-${(++suffix).toString(16).padStart(6, '0')}`;
  return retention.begin({ root: path.join(root, 'diff'), output: path.join(root, 'diff', name), config, readSpace });
}
function captured(handle, root, exact = false) {
  const authored = Buffer.from('int producer(void) { return 1; }\n'), input = Buffer.from('int producer(void){return 1;}\n');
  fs.mkdirSync(path.join(root, 'src'), { recursive: true });
  fs.writeFileSync(path.join(root, 'src/producer.c'), authored);
  const classification = { source: 'src/producer.c', sourceBytes: authored.length, sourceSha256: hash(authored),
    compilationInput: bytesIdentity(input), digest: 'source-policy-digest' };
  const capture = retention.captureSource(handle, root, classification, input);
  fs.mkdirSync(path.join(handle.output, 'src'));
  fs.writeFileSync(path.join(handle.output, 'src/producer.c'), input);
  const report = { symbol: 'func_12345678', output: handle.output, source: classification.source,
    sourcePolicyDigest: classification.digest, compilationInput: classification.compilationInput,
    object: { compilationInput: { path: classification.source, ...classification.compilationInput } }, comparison: { exact } };
  return { capture, report, authored, input, classification };
}

test('caps warn, live reserve rejects on the correct volume before work, config fails closed', () => {
  assert.equal(retention.limitWarnings({ runs: 2, bytes: 101, retainedBytes: 101 }, config).length, 3);
  for (const value of ['0', '-1', 'NaN', 'Infinity', '1.5', '9007199254740992']) {
    assert.throws(() => retention.settings({ OB64_SCRATCH_PEAK_BYTES: value }), /invalid/);
  }
  assert.throws(() => retention.settings({ OB64_SCRATCH_FLOOR_BYTES: String(Number.MAX_SAFE_INTEGER) }), /overflow/);
  const root = fixture();
  assert.throws(() => start(root, 'low', volume => { assert.equal(volume, path.join(root, 'diff')); return 29; }), /free-space/);
  assert.equal(retention.reservations(path.join(root, 'diff')).active.length, 0);
  let free = 30;
  const handle = start(root, 'live', () => free);
  for (const phase of ['before-copy', 'before-compile', 'before-link']) {
    free = 29; assert.throws(() => handle.check(phase), new RegExp(phase));
    free = 30; handle.check(phase);
  }
  handle.release('failed');
});

test('concurrent slots accumulate, same-symbol and crashed claims reject without stale-PID recovery', () => {
  const root = fixture(), first = start(root, 'one', () => 50), second = start(root, 'two', () => 50);
  assert.equal(first.check('two-slots').requiredBytes, 40);
  assert.throws(() => start(root, 'three', () => 49), /free-space/);
  assert.throws(() => start(root, 'ONE'), /same-symbol/);
  second.release('failed');
  // Deliberately unreleased first simulates crash; it stays reserved and blocks the symbol.
  assert.deepEqual(retention.reservations(path.join(root, 'diff')).active, [path.basename(first.output)]);
  assert.throws(() => start(root, 'one'), /same-symbol/);
  const meta = path.join(first.output, '.scratch-retention/claim.json');
  fs.writeFileSync(meta, '{');
  assert.throws(() => start(root, 'four'));
});

test('two real concurrent same-symbol admissions cannot both enter the heavy phase', async () => {
  const root = fixture(), shared = new SharedArrayBuffer(12), state = new Int32Array(shared);
  const workerSource = `const {workerData:d,parentPort}=require('worker_threads');
    const r=require(d.module); const a=new Int32Array(d.shared);
    Atomics.add(a,0,1); Atomics.notify(a,0);
    while(Atomics.load(a,0)<2) Atomics.wait(a,0,1,100);
    let h; try { h=r.begin({root:d.root,output:d.output,config:d.config,readSpace:()=>1000}); Atomics.add(a,1,1); }
    catch(e) {} finally { Atomics.add(a,2,1); Atomics.notify(a,2); }
    while(Atomics.load(a,2)<2) Atomics.wait(a,2,1,100);
    if(h)h.release('failed'); parentPort.postMessage('done');`;
  await Promise.all([1, 2].map(index => new Promise((resolve, reject) => {
    const worker = new Worker(workerSource, { eval: true, workerData: { module: require.resolve('../tools/lib/scratch_retention'),
      root: path.join(root, 'diff'), output: path.join(root, 'diff', `same-1791818961866-a0000${index}`), config, shared } });
    worker.on('error', reject); worker.on('exit', code => code ? reject(Error(`worker exit ${code}`)) : resolve());
  })));
  assert(Atomics.load(state, 1) <= 1);
});

test('mixed-floor real concurrent participant cannot consume an active higher floor', async () => {
  const root = fixture(), shared = new SharedArrayBuffer(4), state = new Int32Array(shared);
  const workerSource = `const {workerData:d,parentPort}=require('worker_threads');
    const r=require(d.module), a=new Int32Array(d.shared);
    const h=r.begin({root:d.root,output:d.output,config:d.config,readSpace:()=>1000});
    parentPort.postMessage('admitted');
    Atomics.wait(a,0,0,5000); h.release('failed');`;
  const worker = new Worker(workerSource, { eval: true, workerData: { module: require.resolve('../tools/lib/scratch_retention'),
    root: path.join(root, 'diff'), output: path.join(root, 'diff', 'high-1791818961866-a00001'),
    config: { ...config, floorBytes: 800, peakBytes: 200 }, shared } });
  const exited = new Promise((resolve, reject) => {
    worker.on('error', reject); worker.on('exit', code => code ? reject(Error(`worker exit ${code}`)) : resolve());
  });
  await new Promise((resolve, reject) => { worker.once('message', resolve); worker.once('error', reject); });
  try {
    assert.throws(() => retention.begin({ root: path.join(root, 'diff'),
      output: path.join(root, 'diff', 'low-1791818961866-a00002'),
      config: { ...config, floorBytes: 1, peakBytes: 1 }, readSpace: () => 1000 }), /required 1001/);
    const current = retention.checkSpace(path.join(root, 'diff'), { ...config, floorBytes: 1 }, 'after-rejected-low', () => 1000);
    assert.equal(current.active.length, 1); assert.equal(current.requiredBytes, 1000);
    assert.equal(current.activeFloorBytes, 800);
  } finally { Atomics.store(state, 0, 1); Atomics.notify(state, 0); await exited; }
  const after = retention.checkSpace(path.join(root, 'diff'), { ...config, floorBytes: 1 }, 'after-high-release', () => 1000);
  assert.equal(after.active.length, 0); assert.equal(after.requiredBytes, 1);
});

test('different valid floors conserve the maximum until release; old or malformed claim floors fail closed', () => {
  const root = fixture(), diff = path.join(root, 'diff');
  const high = retention.begin({ root: diff, output: path.join(diff, 'high-1791818961866-a00001'),
    config: { ...config, floorBytes: 800, peakBytes: 200 }, readSpace: () => 1001 });
  const low = retention.begin({ root: diff, output: path.join(diff, 'low-1791818961866-a00002'),
    config: { ...config, floorBytes: 1, peakBytes: 1 }, readSpace: () => 1001 });
  assert.equal(low.check('both-admitted').requiredBytes, 1001);
  high.release('failed');
  assert.equal(low.check('high-released').requiredBytes, 2);
  low.release('failed');
  for (const [label, change] of [
    ['old schema', claim => { claim.schemaVersion = 1; }],
    ['missing floor', claim => { delete claim.floorBytes; }],
    ...[0, -1, '800', null, 1.5, Number.MAX_SAFE_INTEGER + 1].map(value => [String(value), claim => { claim.floorBytes = value; }]),
  ]) {
    const invalidRoot = fixture(), handle = start(invalidRoot), claimFile = path.join(handle.meta, 'claim.json');
    const claim = JSON.parse(fs.readFileSync(claimFile)); change(claim); fs.writeFileSync(claimFile, JSON.stringify(claim));
    assert.throws(() => handle.check(label), /invalid reservation/);
    // Releasing does not quietly authenticate an obsolete/malformed claim.
    handle.release('failed');
    assert.throws(() => retention.reservations(path.join(invalidRoot, 'diff')), /invalid reservation/);
  }
});

test('whole producer source and actual input bind immutable nonmatching report; mutable source is never substituted', () => {
  const root = fixture(), handle = start(root), c = captured(handle, root);
  fs.writeFileSync(path.join(root, 'src/producer.c'), 'changed after compile');
  const summary = retention.captureReport(handle, c.capture, c.report);
  assert.equal(summary.exact, false); assert.equal(summary.diagnosticOnly, true);
  assert.deepEqual(fs.readFileSync(path.join(handle.meta, 'authored.c')), c.authored);
  fs.mkdirSync(path.join(root, 'build'));
  retention.publishLatest(path.join(root, 'build/diff'), c.report.symbol, c.report);
  assert.deepEqual(fs.readFileSync(path.join(root, 'build/diff/func_12345678.json')), fs.readFileSync(path.join(handle.meta, 'report.json')));
  assert.throws(() => retention.captureReport(handle, c.capture, c.report), /EEXIST/);
  handle.release('complete');
  const account = retention.accounting(path.join(root, 'diff'), config);
  const measured = retention.RECORDS.reduce((sum, name) => sum + fs.statSync(path.join(handle.meta, name)).size, 0);
  assert.equal(account.totals.retainedBytes, measured);
  assert(account.warnings.some(message => message.includes('WARN ONLY')));
});

test('drift and capture failures retain files without declaring completion', () => {
  const root = fixture(), handle = start(root), c = captured(handle, root);
  c.report.object.compilationInput.sha256 = '0'.repeat(64);
  assert.throws(() => retention.captureReport(handle, c.capture, c.report), /identity/);
  assert(fs.existsSync(path.join(handle.meta, 'authored.c')));
  assert(!fs.existsSync(path.join(handle.meta, 'summary.json')));
  handle.release('failed');
  const next = start(root, 'different');
  assert.throws(() => retention.captureSource(next, root, { ...c.classification, sourceSha256: '0'.repeat(64) }, c.input), /identity/);
  next.release('failed');
});

test('completed records tampered after capture become protected unknown inventory', () => {
  const root = fixture(), handle = start(root), c = captured(handle, root);
  retention.captureReport(handle, c.capture, c.report); handle.release('complete');
  fs.appendFileSync(path.join(handle.meta, 'input.c'), 'changed');
  const report = retention.inventory(path.join(root, 'diff'));
  assert.equal(report.runs[0].status, 'unknown');
  assert(report.issues.some(issue => issue.includes('retained input identity mismatch')));
  assert.equal(report.runs[0].wouldDelete, false);
});

test('reference formats cover actual diff names without interpreting function addresses as run hashes', () => {
  const name = 'func_0012FBB8-1791818961866-cd3a8a', full = `C:/scratch/diff/${name}`;
  for (const text of [name, full.replace(/\//g, '\\'), '1791818961866', 'func_0012FBB8 at 1791818961866', 'func_0012FBB8 / cd3a8a', 'cd3a8a: func_0012FBB8']) {
    assert(retention.referenced(name, text, full), text);
  }
  for (const text of ['func_0012FBB8', '0012FBB8', 'cd3a8a', '117918189618660']) assert(!retention.referenced(name, text, full), text);
  const id = '1234abcd' + 'f'.repeat(56);
  assert(retention.referenced(id, 'run 1234abcd', '/runs/' + id));
  assert(!retention.referenced(id, 'func_1234abcd', '/runs/' + id));
});

test('read-only inventory preserves unknown and referenced closure; missing inputs cannot authorize apply', () => {
  const root = fixture(), handle = start(root), c = captured(handle, root);
  retention.captureReport(handle, c.capture, c.report); handle.release('complete');
  fs.mkdirSync(path.join(root, 'diff/legacy-1791818961866-abc123'));
  const before = retention.census(path.join(root, 'diff'));
  const unknown = retention.inventory(path.join(root, 'diff'), {}, config);
  assert.equal(unknown.referenceInventoryComplete, false); assert(unknown.issues.includes('missing mail reference input'));
  const refs = {};
  for (const category of ['docs', 'memory', 'mail']) {
    const directory = path.join(root, category); fs.mkdirSync(directory);
    fs.writeFileSync(path.join(directory, 'record.md'), 'Referenced run ' + path.basename(handle.output)); refs[category] = [directory];
  }
  const known = retention.inventory(path.join(root, 'diff'), refs, config);
  assert.equal(known.referenceInventoryComplete, true);
  assert(known.runs.find(run => run.name === path.basename(handle.output)).protection.some(reason => reason.startsWith('referenced')));
  assert(known.runs.every(run => run.wouldDelete === false));
  assert.deepEqual(retention.census(path.join(root, 'diff')), before);
  assert.throws(() => cli.parseArguments(['--root', path.join(root, 'diff'), '--apply']), /no apply/);
});

test('escaping paths, junction ancestors and hardlinked records are rejected without traversal', () => {
  const root = fixture(), outside = fixture();
  assert.throws(() => retention.contained(root, outside), /escapes/);
  const link = path.join(root, 'linked');
  fs.symlinkSync(outside, link, process.platform === 'win32' ? 'junction' : 'dir');
  assert.throws(() => retention.plain(link), /linked/);
  fs.writeFileSync(path.join(outside, 'proof.txt'), 'evidence');
  assert.throws(() => retention.plain(path.join(link, 'proof.txt')), /linked/);
  fs.linkSync(path.join(outside, 'proof.txt'), path.join(root, 'hardlink.txt'));
  assert.throws(() => retention.plain(path.join(root, 'hardlink.txt'), 'file'), /hardlinked/);
  assert(retention.census(root).issues.length >= 2);
  assert.equal(fs.readFileSync(path.join(outside, 'proof.txt'), 'utf8'), 'evidence');
});

// Pure fixture geometry only; unchanged diff_admission tests the real guards and call order.
function fixtureGeometry(root) {
  function assertBuildOutputLocation(output) {
    assert.equal(path.dirname(path.resolve(output)), path.join(root, 'diff'), 'fixture output geometry');
  }
  function assertBuildPathSeparation(output, baseline) {
    assertBuildOutputLocation(output);
    assert.equal(path.resolve(baseline), path.resolve(root), 'fixture baseline geometry');
    assert.notEqual(path.resolve(output), path.resolve(baseline), 'fixture distinct geometry');
  }
  return { assertBuildOutputLocation, assertBuildPathSeparation };
}
function stubbedDiff({ free = () => 1000, missingBaseline = false, failPhase = null, failRelease = false } = {}) {
  const root = fixture(), events = [], authored = Buffer.from('int producer(void){return 1;}\n');
  fs.mkdirSync(path.join(root, 'src')); fs.mkdirSync(path.join(root, 'build'));
  fs.writeFileSync(path.join(root, 'src/producer.c'), authored);
  const classification = { symbol: 'member', source: 'src/producer.c', sourceBytes: authored.length, sourceSha256: hash(authored),
    compilationInput: bytesIdentity(authored), digest: 'digest', class: 'PURE_C' };
  const target = { symbol: 'member', source: classification.source, expectedRelocations: [], relocationContractSource: 'accepted' };
  const context = { phase8: { targets: [target], model: {}, toolchain: { identity: {} } }, localTools: { workRoot: root },
    sourcePolicy: { targets: [classification] }, diffPreprocess: { finish() { events.push('finish'); }, stats: {} } };
  const phase = name => { events.push(name); if (failPhase === name) throw Error(`original ${name} failure`); };
  const runtime = { tools: Object.fromEntries(['objcopy','as','objdump'].map(name => [`mips-kmc-elf-${name}.exe`, { path: name }])) };
  const mocks = {
    './lib/scratch_retention': { ...retention, begin(options) { const handle = retention.begin({ ...options, config, readSpace(volume) {
      events.push('space'); assert.equal(volume, path.join(root, 'diff')); return free(events);
    } }); if (failRelease) handle.release = () => { throw Error('release error'); }; return handle; } },
    './lib/source_policy': { compilationInputBytes: () => authored },
    './lib/text_contract': { withObjectEvidenceMemo: callback => callback(), linkContext: () => ({ canonicalBaserom: Buffer.alloc(4) }),
      recordsForTarget: () => ({}), finishLinkContext: () => phase('identity') },
    './lib/phase8_matching_c': { ROOT: root, ...fixtureGeometry(root), copyPhase7Objects() { phase('copy'); return { linkedObjects: [], replacements: [] }; },
      linkPhase8: () => phase('link'), pathIndependentRuntime() {}, runTargetAsmDiffer: () => ({ exact: false, asmDifferPairwiseExact: false, rawBytesExact: false }),
      sha256File() {}, verifyCompiler: () => ({}), verifyPhase7Input: () => ({}), verifyRuntimeTools: () => runtime,
      writeLayout() {}, writeObjectManifest: () => ({}), loadCanonicalBaserom: () => Buffer.alloc(4) },
    './lib/diff_object_cache': { IMPLEMENTATION_FILES: [], sha256Value() {}, compileDiffTargets({ output }) {
      phase('compile'); fs.mkdirSync(path.join(output, 'src')); fs.writeFileSync(path.join(output, target.source), authored);
      return { compiled: new Map([['member', { relocations: [], compilationInput: { path: target.source, ...classification.compilationInput } }]]), cache: {} };
    } },
    './lib/diff_profile': {},
    './lib/current_workflow': { prepareContext: () => context, ensureBaseline(_context, options) {
      phase('baseline'); if (missingBaseline) { options.onStep('Preparing accepted structural baseline'); phase('baseline-native'); }
      return { phase7Output: root };
    } },
  };
  const module = { exports: {} };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../tools/diff.js'), 'utf8'), {
    module, require: name => mocks[name] || require(name), console: { log() {}, warn() {} }, process, Buffer,
  });
  return { run: () => module.exports.main(['member']), events, root };
}

test('diff integration checks reserve before baseline and each heavy phase; missing baseline never builds', () => {
  // No files/events are needed to falsify the mocks, regardless of fixture-root location.
  const geometryRoot = path.resolve(base, 'geometry-only'), geometry = fixtureGeometry(geometryRoot);
  geometry.assertBuildPathSeparation(path.join(geometryRoot, 'diff/run'), geometryRoot);
  for (const [output, baseline, message] of [
    [path.join(geometryRoot, 'wrong/run'), geometryRoot, 'fixture output geometry'],
    [path.join(geometryRoot, 'diff/run'), path.join(geometryRoot, 'wrong'), 'fixture baseline geometry'],
    [geometryRoot, geometryRoot, 'fixture output geometry'],
  ]) assert.throws(() => geometry.assertBuildPathSeparation(output, baseline), error => error.message.includes(message)
    && !/free-space|separately budgeted|original compile failure/.test(error.message));
  const low = stubbedDiff({ free: () => 29 });
  assert.throws(low.run, /free-space/); assert(!low.events.includes('baseline'));
  const missing = stubbedDiff({ missingBaseline: true });
  assert.throws(missing.run, /separately budgeted/); assert(!missing.events.includes('baseline-native'));
  for (const [target, check] of [['copy', 2], ['compile', 3], ['link', 4]]) {
    const scenario = stubbedDiff({ free: events => events.filter(event => event === 'space').length >= check ? 29 : 1000 });
    assert.throws(scenario.run, /free-space/); assert(!scenario.events.includes(target));
  }
  const success = stubbedDiff(); assert.equal(success.run().comparison.exact, false);
  assert.deepEqual(success.events, ['space','baseline','space','copy','space','compile','space','link','identity','finish']);
  const failed = stubbedDiff({ failPhase: 'compile' });
  assert.throws(failed.run, /original compile failure/);
  const run = fs.readdirSync(path.join(failed.root, 'diff'))[0];
  assert(!fs.existsSync(path.join(failed.root, 'diff', run, '.scratch-retention/summary.json')));
  const dualFailure = stubbedDiff({ failPhase: 'compile', failRelease: true });
  assert.throws(dualFailure.run, error => error.message === 'original compile failure' && error.scratchReleaseError === 'release error');
});
