'use strict';
// The real completeCurrent, artifact/input gates, validateRecords and manifest
// projection run here. Only ELF reconstruction uses deterministic evidence hooks.
const assert = require('assert/strict');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const vm = require('vm');
const test = require('node:test');
const { createRequire } = require('module');
const ROOT = process.cwd();
const FIXTURES = path.join(ROOT, 'build/current-metadata-tests');
fs.mkdirSync(FIXTURES, { recursive: true });
const realRequire = createRequire(path.join(ROOT, 'tools/lib/current_workflow.js'));
const actualText = realRequire('./text_contract');
const actualGroups = realRequire('./compilation_groups');
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex').toUpperCase();
const clone = value => JSON.parse(JSON.stringify(value));

function fixture() {
  const root = fs.mkdtempSync(path.join(FIXTURES, 'fixture-'));
  function write(relative, value) {
    const file = path.join(root, relative);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    const bytes = Buffer.isBuffer(value) ? value : Buffer.from(typeof value === 'string' ? value : JSON.stringify(value));
    fs.writeFileSync(file, bytes); return { path: relative, bytes: bytes.length, sha256: hash(bytes) };
  }
  for (const name of ['phase8.elf', 'phase8.elf-report.json', 'phase8.map', 'phase8.us_rev0.z64']) write(name, name);
  const phase8 = { targets: [], logicalFunctionConfigIdentity: { sha256: 'logical' } };
  const policy = { schemaVersion: 2, status: 'pass', targets: [] };
  const replacements = [], layout = { schemaVersion: 2, phase8MatchingCTargets: [] }, manifest = { schemaVersion: 5, linkedObjects: [] }, representations = new Map();
  for (const symbol of ['one', 'two', 'three']) {
    const source = `src/${symbol}.c`, input = write(source, `int ${symbol}(void) { return 1; }\n`), sourceSha256 = hash(Buffer.from('authored:' + symbol));
    const target = { symbol, source, sourceSha256, bytes: 4 }; phase8.targets.push(target);
    policy.targets.push({ symbol, source, sourceSha256, class: 'PURE_C', compilationInput: { bytes: input.bytes, sha256: input.sha256 } });
    const representation = { textContract: { symbol, bytes: 4 }, objectEvidence: { symbol, owner: 'original' }, linkEvidence: { fullOwnerExact: true } };
    representations.set(symbol, representation);
    const compiler = write(`objects/${symbol}.compiler.s`, 'compiler:' + symbol), linked = write(`objects/${symbol}.linked.s`, 'linked:' + symbol), object = write(`objects/${symbol}.o`, 'object:' + symbol), raw = write(`objects/${symbol}.raw.o`, 'raw:' + symbol);
    const proof = write(`proofs/${symbol}.json`, { schemaVersion: 4, ...representation });
    replacements.push({ ...target, sourceClass: 'PURE_C', compilerAssembly: compiler.path, compilerAssemblySha256: compiler.sha256,
      linkedAssembly: linked.path, linkedAssemblySha256: linked.sha256, cObject: object.path, cObjectSha256: object.sha256,
      assemblerObject: raw.path, assemblerObjectSha256: raw.sha256, sourceObjectProof: proof, compilationInput: input, ...representation });
    layout.phase8MatchingCTargets.push({ symbol, ...representation });
    manifest.linkedObjects.push({ ...object, ownerKind: 'matching-c-target', targetSymbol: symbol, ...representation });
  }
  const report = { schemaVersion: 6, status: 'pass', acceptedInputs: { logicalFunctionConfig: phase8.logicalFunctionConfigIdentity }, targetReplacements: replacements };
  const save = () => { write('build-report.json', report); write('layout.json', layout); write('objects/manifest.json', manifest); };
  save(); return { root, phase8, policy, replacements, layout, manifest, report, representations, write, save };
}

function run(f, { onTarget, onFinish, linkedExact = true } = {}) {
  const counters = { layoutParses: 0, manifestParses: 0, layoutReads: 0, manifestReads: 0, projections: 0, targets: [], validations: [] };
  const module = { exports: {} };
  const fsView = { ...fs, readFileSync(file, ...args) {
    if (path.resolve(file) === path.join(f.root, 'layout.json')) counters.layoutReads++;
    if (path.resolve(file) === path.join(f.root, 'objects/manifest.json')) counters.manifestReads++;
    return fs.readFileSync(file, ...args);
  } };
  const jsonView = { ...JSON, stringify: JSON.stringify, parse(bytes) {
    const parsed = JSON.parse(bytes);
    if (parsed?.schemaVersion === 2 && parsed.phase8MatchingCTargets) counters.layoutParses++;
    if (parsed?.schemaVersion === 5 && parsed.linkedObjects) counters.manifestParses++;
    return parsed;
  } };
  const substitutes = {
    fs: fsView,
    './phase7_conventional': { ROOT, sha256Buffer: hash, sha256File: file => hash(fs.readFileSync(file)) },
    './auxiliary_interior': { interiorRecords: () => [] },
    './phase8_matching_c': { loadCanonicalBaserom: () => Buffer.alloc(4) },
    './text_contract': {
      linkContext: () => ({}), finishLinkContext() { onFinish?.(f); },
      recordsForTarget(target) { counters.targets.push(target.symbol); onTarget?.(target, f); return { ...f.representations.get(target.symbol), linkEvidence: { fullOwnerExact: linkedExact } }; },
      validateRecords(record, expected, label) { counters.validations.push(label); return actualText.validateRecords(record, expected, label); },
    },
    './compilation_groups': { manifestMembers(...args) { counters.projections++; return actualGroups.manifestMembers(...args); } },
  };
  const file = path.join(ROOT, 'tools/lib/current_workflow.js');
  vm.runInNewContext(fs.readFileSync(file, 'utf8'), { module, require: name => Object.hasOwn(substitutes, name) ? substitutes[name] : realRequire(name), Buffer, process, JSON: jsonView });
  return { result: module.exports.completeCurrent(f.root, f.phase8, f.policy), counters };
}

test('supported positive CURRENT preserves every target gate while parsing/projecting metadata once', () => {
  const f = fixture(), current = run(f);
  assert.equal(current.result, true);
  assert.deepEqual(current.counters.targets, ['one', 'two', 'three']);
  assert.deepEqual(current.counters.validations, Array.from({length:3}, () => ['CURRENT', 'CURRENT proof', 'CURRENT layout', 'CURRENT manifest']).flat());
  assert.equal(current.counters.validations.length, 12);
  assert.equal(current.counters.layoutParses, 1); assert.equal(current.counters.manifestParses, 1); assert.equal(current.counters.projections, 1);
  // Initial snapshot plus final authentication read; no per-target metadata reads.
  assert.equal(current.counters.layoutReads, 2); assert.equal(current.counters.manifestReads, 2);
});

test('missing, duplicate and reordered record outcomes preserve existing first-match semantics', () => {
  const cases = [
    ['missing layout', f => f.layout.phase8MatchingCTargets.pop(), false],
    ['missing manifest', f => f.manifest.linkedObjects.pop(), false],
    ['duplicate manifest path', f => f.manifest.linkedObjects.push(clone(f.manifest.linkedObjects[0])), false],
    ['duplicate symbol distinct path after valid', f => { const r = clone(f.manifest.linkedObjects[0]); r.path = 'unused.o'; r.objectEvidence.owner = 'invalid'; f.manifest.linkedObjects.push(r); }, true],
    ['duplicate invalid layout after valid', f => { const r = clone(f.layout.phase8MatchingCTargets[0]); r.textContract.bytes++; f.layout.phase8MatchingCTargets.push(r); }, true],
    ['duplicate invalid layout before valid', f => { const r = clone(f.layout.phase8MatchingCTargets[0]); r.textContract.bytes++; f.layout.phase8MatchingCTargets.unshift(r); }, false],
    ['reordered layout and manifest', f => { f.layout.phase8MatchingCTargets.reverse(); f.manifest.linkedObjects.reverse(); }, true],
    ['duplicate policy symbol', f => { f.policy.targets[1] = clone(f.policy.targets[0]); }, false],
    ['duplicate replacement symbol', f => { f.report.targetReplacements[1] = clone(f.report.targetReplacements[0]); }, false],
    ['wrong layout schema', f => { f.layout.schemaVersion++; }, false],
    ['wrong manifest schema', f => { f.manifest.schemaVersion++; }, false],
  ];
  for (const [label, change, expected] of cases) {
    const f = fixture(); change(f); f.save();
    assert.equal(run(f).result, expected, label);
  }
});

test('full-owner, proof, artifacts and compilation-input rejection gates remain unchanged', () => {
  for (const [label, mutate] of [
    ['proof representation', f => f.write('proofs/one.json', { schemaVersion: 4, ...f.representations.get('two') })],
    ['proof schema', f => f.write('proofs/one.json', { schemaVersion: 3, ...f.representations.get('one') })],
    ['compiler assembly', f => f.write('objects/one.compiler.s', 'bad')],
    ['linked assembly', f => f.write('objects/one.linked.s', 'bad')],
    ['object', f => f.write('objects/one.o', 'bad')],
    ['assembler object', f => f.write('objects/one.raw.o', 'bad')],
    ['compilation input', f => f.write('src/one.c', 'bad')],
    ['source class', f => { f.policy.targets[0].class = 'UNKNOWN'; }],
    ['input path', f => { f.replacements[0].compilationInput.path = 'src/two.c'; f.save(); }],
  ]) {
    const f = fixture(); mutate(f);
    assert.equal(run(f).result, false, label);
  }
  assert.equal(run(fixture(), { linkedExact: false }).result, false);
  assert.equal(run(fixture(), { onFinish() { throw Error('linked input/tool drift'); } }).result, false);
});

test('end authentication rejects same-size metadata changes, replacement/removal, and required-file loss', () => {
  for (const relative of ['layout.json', 'objects/manifest.json']) {
    for (const mode of ['same-size', 'replacement', 'removed']) {
      const f = fixture();
      const mutate = () => {
        const file = path.join(f.root, relative), bytes = fs.readFileSync(file);
        if (mode === 'removed') { fs.unlinkSync(file); return; }
        const changed = Buffer.from(bytes.toString().replace('original', 'modified'));
        assert.equal(changed.length, bytes.length);
        if (mode === 'replacement') { const temporary = file + '.replacement'; fs.writeFileSync(temporary, changed); fs.unlinkSync(file); fs.renameSync(temporary, file); }
        else fs.writeFileSync(file, changed);
      };
      assert.equal(run(f, { onTarget(target) { if (target.symbol === 'three') mutate(); } }).result, false, relative + ': ' + mode);
    }
    const f = fixture();
    assert.equal(run(f, { onFinish() { fs.appendFileSync(path.join(f.root, relative), ' '); } }).result, false);
  }
  const f = fixture();
  assert.equal(run(f, { onFinish() { fs.unlinkSync(path.join(f.root, 'phase8.elf-report.json')); } }).result, false);
});

test('metadata confinement rejects nonregular paths and indirect escapes', () => {
  const f = fixture(), file = path.join(f.root, 'layout.json');
  fs.unlinkSync(file); fs.mkdirSync(file);
  assert.equal(run(f).result, false);
  const g = fixture(), outside = fs.mkdtempSync(path.join(FIXTURES, 'outside-'));
  fs.writeFileSync(path.join(outside, 'manifest.json'), JSON.stringify(g.manifest));
  fs.renameSync(path.join(g.root, 'objects'), path.join(g.root, 'original-objects'));
  try { fs.symlinkSync(outside, path.join(g.root, 'objects'), process.platform === 'win32' ? 'junction' : 'dir'); }
  catch (error) { if (['EPERM', 'EACCES'].includes(error.code)) return; throw error; }
  const escaped = run(g);
  assert.equal(escaped.result, false); assert.equal(escaped.counters.targets.length, 0);
  const h = fixture(), replacement = fs.mkdtempSync(path.join(FIXTURES, 'replacement-'));
  fs.writeFileSync(path.join(replacement, 'manifest.json'), JSON.stringify(h.manifest));
  assert.equal(run(h, { onFinish() {
    fs.renameSync(path.join(h.root, 'objects'), path.join(h.root, 'original-objects'));
    fs.symlinkSync(replacement, path.join(h.root, 'objects'), process.platform === 'win32' ? 'junction' : 'dir');
  } }).result, false);
});
