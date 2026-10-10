'use strict';
const assert = require('assert/strict'), fs = require('fs'), path = require('path');
const { parse } = require('../tools/matching_studies/reload_trace/parse');
const { instrument } = require('../tools/matching_studies/reload_trace/instrument');
const pe = require('../tools/matching_studies/reload_trace/pe_metadata');
const c = require('../tools/matching_studies/reload_trace/common');
// Synthetic parser controls are explicitly not observed compiler coverage.
function synthetic() {
  const rows = ['RR|begin|1']; let seq = 0;
  let attempt = -1, cursor = -1;
  function e(type, options = {}) {
    const v = { phase: 1, choose: 1, attempt, reload: -1, a: 0, b: 0, d: 0, ...options };
    rows.push(['RR', type, ++seq, 'fixture', 9, v.phase, v.choose, v.attempt, v.reload, cursor, v.a, v.b, v.d].join('|'));
    if (require('../tools/matching_studies/reload_trace/parse').RTX.has(type)) rows.push('RR|rtl-begin', '(nil)', 'RR|rtl-end');
  }
  function state(type) { e(type, { a: 1 }); e('state', { reload: 0 }); e('state-reg', { reload: 0 }); e('state-override', { reload: 0 }); }
  e('find-begin', { phase: 0 }); e('find-end-0', { phase: 0 });
  e('replacement-begin'); e('spill-order', { a: 1 }); e('spill', { b: 11 });
  e('find-begin', { a: 1 }); e('find-end-1', { a: 1 });
  for (const type of ['descriptor', 'descriptor-modes', 'descriptor-kind', 'input', 'output', 'selected']) e(type, { reload: 0 });
  e('choose-begin', { a: 1 }); state('choose-order'); attempt = 1; state('attempt-begin');
  e('allocate-begin', { reload: 0 }); e('allocate-index', { reload: 0, d: 11 }); e('allocate-failure', { reload: 0 });
  state('retry-before-restore'); state('retry-after-restore'); attempt = 0; state('attempt-begin');
  e('allocate-begin', { reload: 0 }); e('allocate-index', { reload: 0, d: 11 }); e('allocate-selected', { reload: 0, b: 11 }); cursor = 0; e('allocate-success', { reload: 0, b: 11 });
  state('attempt-success'); state('before-cancellations'); state('after-cancellations'); state('choose-end');
  e('emitted-substituted'); e('range-end'); e('replacement-survivors'); e('range-end'); e('replacement-end');
  rows.push('RR|end|' + seq + '|0'); return rows.join('\n');
}
const trace = synthetic(), parsed = parse(trace, 'fixture');
assert.equal(parsed.coverage['retry-after-restore'], 1);
for (const bad of [trace.replace(/RR\|end\|\d+\|0/, ''), trace.replace('RR|begin|1', ''), trace.replace('allocate-failure', 'allocate-magic'), trace.replace('retry-after-restore', 'attempt-success'), trace.replace(/(RR\|end\|\d+)\|0/, '$1|1')]) assert.throws(() => parse(bad, 'fixture'));
const { validateLifecycle } = require('../tools/matching_studies/reload_trace/parse');
for (const type of ['attempt-success', 'before-cancellations', 'after-cancellations', 'allocate-index', 'replacement-survivors']) {
  assert.throws(() => validateLifecycle(parsed.events.filter(e => e.type !== type)), type);
}
for (const [type, field, value] of [['state-reg', 'choose', 99], ['input', 'fn', 'wrong'], ['allocate-begin', 'reload', 1], ['state', 'attempt', 99], ['find-end-1', 'phase', 0], ['allocate-success', 'cursor', 99]]) {
  const events = structuredClone(parsed.events); events.find(e => e.type === type)[field] = value;
  assert.throws(() => validateLifecycle(events), `${type}/${field}`);
}
assert.throws(() => parse(trace, 'other'));
assert.throws(() => c.contained(path.join(c.ROOT, 'src/out')));
const old = process.env.OB64_RA_FORCE; process.env.OB64_RA_FORCE = 'no';
try { assert.throws(() => c.environment()); } finally { if (old === undefined) delete process.env.OB64_RA_FORCE; else process.env.OB64_RA_FORCE = old; }
for (const key of ['CL', '_cl_', 'link', '_LINK_']) assert.throws(() => c.environment({}, { [key]: '/bad' }));
for (const key of ['VR4300MUL', 'vr4300mul', 'Vr4300Mul']) assert.throws(() => c.environment({}, { [key]: 'OFF' }));
assert.throws(() => c.run('unused', [], { env: { CL: '/bad' } }));
const containmentRoot = c.fresh('containment-test'), junction = path.join(containmentRoot, 'redirect');
fs.symlinkSync(c.ROOT, junction, 'junction');
assert.throws(() => c.contained(path.join(junction, 'nested-root', 'file'), path.join(junction, 'nested-root')));
const source = fs.readFileSync(path.join(c.SOURCE, 'reload1.c'), 'utf8');
const patched = instrument(source); assert(patched.includes('rr_phase = 0;')); assert(patched.includes('rr_phase = 1;'));
assert.throws(() => instrument(source.replace('\nchoose_reload_regs (insn, avoid_return_reg)', '\ndifferent_function (insn, avoid_return_reg)')));
assert.throws(() => instrument(patched));
const original = fs.readFileSync(path.join(c.SOURCE, 'cc1.exe')), shape = pe.metadata(original);
assert.equal(pe.compare(original, original).differences.length, 0);
for (const interval of shape.allowed) {
  // Change payload, not the structural Rich marker/key or REPRO length.
  const offset = interval.kind === 'rich-records' ? interval.offset + 16 : interval.offset;
  const b = Buffer.from(original); b[offset] ^= 1; assert.equal(pe.compare(original, b).differences.length, 1);
}
for (const offset of [shape.sections[0].offset, shape.sections[2].offset, 60, shape.pe + 4]) {
  const b = Buffer.from(original); b[offset] ^= 1; assert.throws(() => pe.compare(original, b));
}
const debugDirectory = original.readUInt32LE(shape.pe + 24 + 96 + 48);
const section = shape.sections.find(s => debugDirectory >= s.virtual && debugDirectory < s.virtual + s.bytes);
const debugOffset = section.offset + debugDirectory - section.virtual;
for (const offset of [debugOffset + 24, debugOffset + 16, shape.entries[0].pointer, shape.pe + 24 + 96 + 8]) {
  const b = Buffer.from(original); b[offset] ^= 1; assert.throws(() => pe.compare(original, b));
}
console.log('Reload trace isolated parser/anchor/PE/environment controls: PASS (synthetic parser coverage, no compiler run)');
if (process.argv[2]) {
  const manifestFile = path.resolve(process.argv[2]), manifest = JSON.parse(fs.readFileSync(manifestFile));
  const { authenticateManifest } = require('../tools/matching_studies/reload_trace/provenance');
  authenticateManifest(manifestFile);
  const mutations = [
    m => { m.origin.commit = 'forged'; },
    m => { m.compiler.path = m.origin.compiler.path; m.compiler.sha256 = m.origin.compiler.sha256; },
    m => { m.pristineReload.sha256 = 'forged'; },
    m => { m.sourceFiles.pop(); },
    m => { [m.objects[0], m.objects[1]] = [m.objects[1], m.objects[0]]; },
    m => { m.scripts[0].sha256 = 'forged'; },
    m => { m.equivalenceReport.sha256 = 'forged'; },
    m => { m.host.compilerDlls.pop(); },
  ];
  const suffix = Date.now();
  mutations.forEach((mutate, i) => {
    const m = structuredClone(manifest); mutate(m);
    const f = path.join(path.dirname(manifestFile), `negative-manifest-${suffix}-${i}.json`); c.write(f, m);
    assert.throws(() => authenticateManifest(f), `manifest mutation ${i}`);
  });
  console.log('Recorded manifest replay and eight forged/drifted closure controls: PASS');
}
