'use strict';
// The real completeCurrent, artifact/input gates, validateRecords and manifest
// projection run here. Only ELF reconstruction uses deterministic evidence hooks.
const assert = require('assert/strict');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const vm = require('vm');
const nodeTest = require('node:test');
const { createFixtureSuite } = require('./lib/fixture_lifecycle');
const { createRequire } = require('module');
const ROOT = process.cwd();
const FIXTURES = path.join(ROOT, 'build/current-metadata-tests');
// Successful cases discard only their newly owned synthetic fixtures after result capture.
// Set OB64_KEEP_TEST_FIXTURES=1 to retain them; failed/unsafe/crashed cases always remain.
const { test, fixtureDirectory } = createFixtureSuite(nodeTest, { root: FIXTURES });
const realRequire = createRequire(path.join(ROOT, 'tools/lib/current_workflow.js'));
const actualText = realRequire('./text_contract');
const actualGroups = realRequire('./compilation_groups');
const actualPhase8 = realRequire('./phase8_matching_c');
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex').toUpperCase();
const clone = value => JSON.parse(JSON.stringify(value));

function fixture(accepted = null) {
  const root = fixtureDirectory('fixture-');
  function write(relative, value) {
    const file = path.join(root, relative);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    const bytes = Buffer.isBuffer(value) ? value : Buffer.from(typeof value === 'string' ? value : JSON.stringify(value));
    fs.writeFileSync(file, bytes); return { path: relative, bytes: bytes.length, sha256: hash(bytes) };
  }
  for (const name of ['phase8.elf', 'phase8.elf-report.json', 'phase8.map', 'phase8.us_rev0.z64']) write(name, name);
  const phase8 = { targets: [], logicalFunctionConfigIdentity: { sha256: 'logical' }, ...(accepted ? { model: accepted.model } : {}) };
  const policy = { schemaVersion: 2, status: 'pass', targets: [] };
  const replacements = [], layout = { schemaVersion: 2, phase8MatchingCTargets: [] }, manifest = { schemaVersion: 5, linkedObjects: [] }, representations = new Map();
  for (const symbol of accepted ? accepted.targets.map(t => t.symbol) : ['one', 'two', 'three']) {
    const source = `src/${symbol}.c`, input = write(source, `int ${symbol}(void) { return 1; }\n`), sourceSha256 = hash(Buffer.from('authored:' + symbol));
    const original = accepted?.targets.find(t => t.symbol === symbol);
    const target = { sectionName: '.fixture.' + symbol, ...original, symbol, source, sourceSha256, bytes: original?.bytes || 4 }; phase8.targets.push(target);
    policy.targets.push({ symbol, source, sourceSha256, class: 'PURE_C', digest: 'D'.repeat(64), compilationInput: { bytes: input.bytes, sha256: input.sha256 } });
    const representation = { textContract: actualText.resolveTextContract(target), objectEvidence: { symbol, owner: 'original' }, linkEvidence: { fullOwnerExact: true } };
    representations.set(symbol, representation);
    const compiler = write(`objects/${symbol}.compiler.s`, 'compiler:' + symbol), linked = write(`objects/${symbol}.linked.s`, 'linked:' + symbol), object = write(`objects/${symbol}.o`, 'object:' + symbol), raw = write(`objects/${symbol}.raw.o`, 'raw:' + symbol);
    const proof = write(`generated/c/${symbol}.source-object-proof.json`, { schemaVersion: 4, kind: 'ob64-source-to-object-load-evidence', target: { symbol, source, sourceSha256, sectionName: target.sectionName, ownerSections: (target.textOwners || [{sectionName:target.sectionName}]).map(o=>o.sectionName), sourceClass: 'PURE_C', sourcePolicyDigest: 'D'.repeat(64), compilationInput: {bytes:input.bytes,sha256:input.sha256} }, ...representation });
    replacements.push({ ...target, sourceClass: 'PURE_C', sourcePolicyDigest: 'D'.repeat(64), compilerAssembly: compiler.path, compilerAssemblySha256: compiler.sha256,
      linkedAssembly: linked.path, linkedAssemblySha256: linked.sha256, cObject: object.path, cObjectSha256: object.sha256,
      assemblerObject: raw.path, assemblerObjectSha256: raw.sha256, sourceObjectProof: proof, compilationInput: input });
    layout.phase8MatchingCTargets.push({ symbol, ...representation });
    manifest.linkedObjects.push({ ...object, ownerKind: 'matching-c-target', targetSymbol: symbol, ...representation });
  }
  const evidence = { targets: replacements.map(t => ({ symbol:t.symbol,sourceClass:t.sourceClass,sourcePolicyDigest:t.sourcePolicyDigest,compilationInput:{bytes:t.compilationInput.bytes,sha256:t.compilationInput.sha256},proof:t.sourceObjectProof })) };
  const report = { schemaVersion: 7, status: 'pass', acceptedInputs: { logicalFunctionConfig: phase8.logicalFunctionConfigIdentity }, targetReplacements: replacements, sourceObjectEvidence:evidence, verification:{schemaVersion:6,status:'pass',sourceObjectEvidence:evidence,targets:replacements.map((t,i)=>({symbol:t.symbol,source:t.source,sectionName:t.sectionName,sourceObjectEvidence:evidence.targets[i],representationSha256:actualText.representationDigest(representations.get(t.symbol))}))} };
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
    './phase8_matching_c': { ...actualPhase8, loadCanonicalBaserom: () => Buffer.alloc(4) },
    './text_contract': {
      ...actualText,
      linkContext: () => ({ mapText: fs.readFileSync(path.join(f.root, 'phase8.map'), 'utf8') }), finishLinkContext() { onFinish?.(f); },
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
  assert.deepEqual(current.counters.validations, Array.from({length:3}, () => ['CURRENT proof', 'CURRENT layout', 'CURRENT manifest']).flat());
  assert.equal(current.counters.validations.length, 9);
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
    ['proof representation', f => f.write('generated/c/one.source-object-proof.json', { schemaVersion: 4, ...f.representations.get('two') })],
    ['proof schema', f => f.write('generated/c/one.source-object-proof.json', { schemaVersion: 3, ...f.representations.get('one') })],
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
  const g = fixture(), outside = fixtureDirectory('outside-');
  fs.writeFileSync(path.join(outside, 'manifest.json'), JSON.stringify(g.manifest));
  fs.renameSync(path.join(g.root, 'objects'), path.join(g.root, 'original-objects'));
  try { fs.symlinkSync(outside, path.join(g.root, 'objects'), process.platform === 'win32' ? 'junction' : 'dir'); }
  catch (error) { if (['EPERM', 'EACCES'].includes(error.code)) return; throw error; }
  const escaped = run(g);
  assert.equal(escaped.result, false); assert.equal(escaped.counters.targets.length, 0);
  const h = fixture(), replacement = fixtureDirectory('replacement-');
  fs.writeFileSync(path.join(replacement, 'manifest.json'), JSON.stringify(h.manifest));
  assert.equal(run(h, { onFinish() {
    fs.renameSync(path.join(h.root, 'objects'), path.join(h.root, 'original-objects'));
    fs.symlinkSync(replacement, path.join(h.root, 'objects'), process.platform === 'win32' ? 'junction' : 'dir');
  } }).result, false);
});

test('shared auxiliary CURRENT reuse requires authentic model, explicit recorded selectors and exact map order', () => {
  const active = realRequire('./active_targets').loadActiveTargetModel();
  const targets = ['func_0022B06C', 'func_0022D14C', 'func_0022EF50', 'func_0022F580', 'func_00232458'].map(symbol => active.targets.find(t => t.symbol === symbol));
  assert(targets.every(Boolean));
  const interiors = realRequire('./auxiliary_interior').interiorRecords(targets);
  assert.equal(interiors.length, 1);
  assert.equal(interiors[0].bytes, 8);
  const accepted = { model: active.model, targets };
  function sharedFixture() {
    const f = fixture(accepted), first = targets[0].auxiliarySections[0], last = targets.at(-1).auxiliarySections[0];
    const tailPath = `objects/assembly/auxiliary/chunk_${String(last.ownerChunkIndex).padStart(3, '0')}_${last.outputSection.slice(6)}_tail.o`;
    const manifest = { linkedObjects: [
      ...interiors.map(record => ({ path: record.objectRelative, ownerKind: 'accepted-assembly-auxiliary-interior',
        targetSymbol: record.symbol, retainedInterior: record })),
      ...targets.map(t => ({ path: `objects/c/${t.symbol}.o`, ownerKind: 'matching-c-target', targetSymbol: t.symbol })),
      { path: tailPath, ownerKind: 'accepted-assembly-auxiliary-tail', targetSymbol: targets.at(-1).symbol,
        outputSection: last.outputSection, inputSection: last.ownerTailSection, sectionType: 'SHT_PROGBITS', sectionFlags: ['SHF_ALLOC'] },
    ] };
    const script = actualPhase8.renderPhase8LinkerScript(f.phase8, manifest);
    const hex = value => value.toString(16);
    const contribution = (section, start, bytes, owner) => ` ${section} ${hex(start)} ${hex(bytes)} ${hex(bytes)} 2**3 elf32-bigmips ${owner}(overhead 0 bytes)`;
    const cLines = targets.map(t => { const a = t.auxiliarySections[0]; return contribution(a.outputSection, a.vramStartNumber, a.bytes, `objects/c/${t.symbol}.o`); });
    const orderedLines = targets.flatMap((target, index) => [
      ...interiors.filter(record => record.symbol === target.symbol).map(record =>
        contribution(record.inputSection, record.vramStart, record.bytes, record.objectRelative)), cLines[index],
    ]);
    const map = [`${first.outputSection} ${hex(first.ownerVramStartNumber)} ${hex(first.ownerSectionBytes)} 0 2**3 load alloc contents`,
      ...orderedLines, contribution(last.ownerTailSection, last.ownerTailVramStartNumber, last.ownerTailBytes, tailPath)].join('\n') + '\n';
    f.write('linker/phase8.ld', script); f.write('phase8.map', map);
    return { ...f, script, map, cLines, first };
  }
  assert.equal(run(sharedFixture()).result, true, 'valid shared-row reuse');
  for (const [label, mutate] of [
    ['recorded wildcard', f => f.write('linker/phase8.ld', f.script.replace(`objects/c/${targets[0].symbol}.o(${f.first.outputSection})`, `*(${f.first.outputSection})`))],
    ['bare-file input', f => f.write('linker/phase8.ld', f.script.replace('  /DISCARD/ :', `  .unused 0 : { objects/c/${targets[0].symbol}.o }\n  /DISCARD/ :`))],
    ['implicit input in emitted output form', f => f.write('linker/phase8.ld', f.script.replace('  /DISCARD/ :', `  .unused 0x00000000 : AT(0x00000000)\n  {\n    objects/c/${targets[0].symbol}.o\n  }\n  /DISCARD/ :`))],
    ['missing recorded script', f => fs.unlinkSync(path.join(f.root, 'linker/phase8.ld'))],
    ['map missing retained interior', f => { const record = interiors[0]; f.write('phase8.map', f.map.split('\n').filter(line => !line.includes(record.inputSection)).join('\n')); }],
    ['map owner swap', f => f.write('phase8.map', f.map.replace(f.cLines[0], 'SWAP').replace(f.cLines[1], f.cLines[0]).replace('SWAP', f.cLines[1]))],
    ['map missing owner', f => f.write('phase8.map', f.map.replace(f.cLines[0], ''))],
    ['map duplicate owner', f => f.write('phase8.map', f.map.replace(f.cLines[0], f.cLines[0] + '\n' + f.cLines[0]))],
    ['forged contributor chunk', f => { f.phase8.targets[0].chunkIndex += 1; }],
    ['missing accepted context', f => { delete f.phase8.model; }],
  ]) {
    const f = sharedFixture(); assert.equal(run(f).result, true, label + ' before mutation');
    mutate(f); assert.equal(run(f).result, false, label);
  }
  for (const relative of ['linker/phase8.ld', 'phase8.map']) {
    const f = sharedFixture();
    assert.equal(run(f, { onFinish() { fs.appendFileSync(path.join(f.root, relative), ' '); } }).result, false,
      relative + ' changed after initial shared-row validation');
  }
  for (const selector of ['*( .ob64.r4248 )', '* \n (\t.ob64.r4248\n)', '*(.ob64.r*)',
    '*(.ob64.r????)', '*(.ob64.r[0-9][0-9][0-9][0-9])', '*( .text .ob64.r4248 )',
    '*( .text, .ob64.r4248 )', '* /* comment */ ( .ob64.r4248 )', '*(".ob64.r4248")',
    '*(SORT(.ob64.r*))', '*(EXCLUDE_FILE(absent.o) .ob64.r4248)', '*(.ob64.r424[]8])', "*('.ob64.r4248')"]) {
    const f = sharedFixture();
    assert.equal(run(f).result, true, 'positive before residual selector: ' + selector);
    f.write('linker/phase8.ld', f.script.replace('  /DISCARD/ :', `  .unused 0 : { ${selector} }\n  /DISCARD/ :`));
    assert.equal(run(f).result, false, 'residual selector: ' + selector);
  }
});

test('compact proof authentication rejects self-consistent substitutions and mixed report forms', () => {
  const f = fixture(), record = f.replacements[0], target = f.phase8.targets[0];
  const file = path.join(f.root, record.sourceObjectProof.path), original = fs.readFileSync(file);
  const resolve = () => actualText.withSourceObjectProof(f.root, target, record, () => {});
  resolve();
  for (const [label, mutate] of [
    ['symbol', p => p.target.symbol = 'other'], ['source', p => p.target.source = 'src/other.c'],
    ['source hash', p => p.target.sourceSha256 = '0'.repeat(64)], ['class', p => p.target.sourceClass = 'HYBRID_C'],
    ['policy', p => p.target.sourcePolicyDigest = '0'.repeat(64)], ['input', p => p.target.compilationInput.bytes++],
    ['owner', p => p.target.ownerSections = ['other']], ['schema', p => p.schemaVersion = 3],
    ['kind', p => p.kind = 'other'], ['contract', p => p.textContract.owners[0].bytes++],
  ]) {
    const forged = JSON.parse(original); mutate(forged);
    record.sourceObjectProof = f.write(record.sourceObjectProof.path, forged);
    assert.throws(resolve, undefined, label);
    fs.writeFileSync(file, original); record.sourceObjectProof = { path: path.relative(f.root, file).replace(/\\/g, '/'), bytes: original.length, sha256: hash(original) }; resolve();
  }
  assert.throws(() => actualText.withSourceObjectProof(f.root, target, record, proof => proof));
  for (const key of ['textContract', 'objectEvidence', 'linkEvidence']) {
    record[key] = {}; assert.throws(resolve); delete record[key]; resolve();
  }
  for (const mutate of [r => r.proof = r.sourceObjectProof, r => r.representationSha256 = '0'.repeat(64), r => r.freshRepresentationSha256 = '0'.repeat(64)]) {
    const changed = clone(record); mutate(changed);
    assert.throws(() => actualText.withSourceObjectProof(f.root, target, changed, () => {}));
  }
});

test('compact companions preserve own-derived digests and actual build byte binding', () => {
  const f = fixture(), workflow = realRequire('./current_workflow');
  const buildIdentity = actualText.readCompactReport(f.root).identity;
  const fresh = { schemaVersion: 6, status: 'pass', buildReport: buildIdentity, targets: f.replacements.map(r => ({ symbol: r.symbol, source: r.source, sourceSha256: r.sourceSha256, sourceClass: r.sourceClass, sourcePolicyDigest: r.sourcePolicyDigest, compilationInput: r.compilationInput, sourceObjectProof: r.sourceObjectProof, freshRepresentationSha256: actualText.representationDigest(f.representations.get(r.symbol), false) })) };
  const verified = { schemaVersion: 6, status: 'pass', output: '.', buildReport: buildIdentity, verification: f.report.verification };
  const validate = (a=f.report,b=fresh,c=verified) => workflow.validateVerifiedCompanions(a,b,c,f.root,f.phase8);
  validate();
  for (const [label, mutate] of [
    ['crossed build', v => v.fresh.buildReport.sha256 = '0'.repeat(64)],
    ['fresh source path', v => v.fresh.targets[0].source = 'src/other.c'],
    ['fresh digest', v => v.fresh.targets[0].freshRepresentationSha256 = '0'.repeat(64)],
    ['verification digest', v => v.verified.verification.targets[0].representationSha256 = '0'.repeat(64)],
    ['missing', v => v.fresh.targets.pop()], ['duplicate', v => v.fresh.targets[1] = v.fresh.targets[0]],
    ['extra', v => v.fresh.targets.push(v.fresh.targets[0])], ['unknown', v => v.verified.schemaVersion = 99],
    ['inline', v => v.fresh.targets[0].objectEvidence = {}],
  ]) {
    const v = clone({build:f.report,fresh,verified}); mutate(v);
    assert.throws(() => validate(v.build,v.fresh,v.verified), undefined, label); validate();
  }
  // A companion published before the others/state cannot cross the old build binding.
  fs.appendFileSync(path.join(f.root, 'build-report.json'), ' ');
  assert.throws(() => validate()); f.save(); validate();
});
