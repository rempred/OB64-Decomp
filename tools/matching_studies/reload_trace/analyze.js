'use strict';
const c = require('./common'), { fs, path, identity, same, write } = c;
function history(trace) {
  const events = trace.events, allocations = []; let begin = null, find = null, descriptorStart = null;
  for (const e of events) {
    if (e.type === 'find-end-1') find = e;
    if (e.type === 'choose-begin') { if (!find || find.uid !== e.uid || find.fn !== e.fn) throw Error('descriptor invocation'); descriptorStart = find; }
    if (e.type === 'allocate-begin') begin = e;
    if (e.type === 'allocate-failure') begin = null;
    if (e.type !== 'allocate-success') continue;
    if (!begin || begin.uid !== e.uid || begin.reload !== e.reload) throw Error('allocation trace closure');
    const descriptors = events.filter(v => v.seq > descriptorStart.seq && v.seq <= descriptorStart.seq + descriptorStart.a * 6 && v.phase === 1 && v.fn === e.fn && v.uid === e.uid && v.reload === e.reload);
    const last = type => descriptors.filter(v => v.type === type).at(-1);
    const end = events.find(v => v.seq > e.seq && v.type === 'range-end' && v.uid === e.uid);
    const emitted = events.filter(v => v.seq > e.seq && (!end || v.seq < end.seq) && v.type === 'insn');
    allocations.push({ ordinal: allocations.length, uid: e.uid, choose: e.choose, attempt: e.attempt,
      beginSeq: begin.seq, endSeq: e.seq, reload: e.reload, cursorBefore: begin.cursor, cursorAfter: e.cursor,
      spillIndex: e.a, hardRegister: e.b, pass: e.c, descriptor: last('descriptor'), mode: last('descriptor-modes'),
      input: last('input')?.rtl, output: last('output')?.rtl, emitted });
    begin = null;
  }
  return allocations;
}
function compare(left, right) {
  const signature = e => JSON.stringify([e.input, e.output, e.descriptor?.a, e.descriptor?.b, e.descriptor?.c, e.mode?.a, e.mode?.b, e.mode?.c]);
  let prefix = 0; while (prefix < left.length && prefix < right.length && signature(left[prefix]) === signature(right[prefix]) && left[prefix].hardRegister === right[prefix].hardRegister && left[prefix].cursorBefore === right[prefix].cursorBefore) prefix++;
  const added = prefix < right.length && prefix < left.length && signature(right[prefix + 1] || {}) === signature(left[prefix]);
  let decisionPrefix = 0; while (decisionPrefix < left.length && decisionPrefix < right.length && ['hardRegister', 'cursorBefore', 'cursorAfter'].every(k => left[decisionPrefix][k] === right[decisionPrefix][k])) decisionPrefix++;
  return { identicalDescriptorPrefixAllocations: prefix, leftEvent: left[prefix] || null, rightEvent: right[prefix] || null,
    identicalDecisionPrefixAllocations: decisionPrefix, leftDecision: left[decisionPrefix] || null, rightDecision: right[decisionPrefix] || null,
    rightNextDescriptorEqualsLeft: added, rightNext: added ? right[prefix + 1] : null,
    boundary: 'A source-bound descriptor/assigned-register prefix comparison, not a retail intermediate reconstruction or general alpha-equivalence proof.' };
}
function analyze(file) {
  const report = JSON.parse(fs.readFileSync(file)); if (report.status !== 'pass' || report.acceptanceEligible !== false || report.researchOnly !== true || report.schemaVersion !== 1) throw Error('focused research report must pass');
  const summaries = report.cases.map(record => {
    same(identity(record.events.path).sha256, record.events.sha256, 'events changed');
    const trace = JSON.parse(fs.readFileSync(record.events.path));
    require('./parse').validateLifecycle(trace.events);
    return { id: record.id, events: record.events, coverage: trace.coverage, allocations: history(trace) };
  });
  const left = summaries.find(r => r.id === 'd14c-best');
  const result = { schemaVersion: 1, report: identity(file), wholeFunctionHistories: summaries,
    comparisons: summaries.filter(r => r.id !== left.id).map(r => ({ leftId: left.id, rightId: r.id, ...compare(left.allocations, r.allocations) })),
    limits: ['Candidate events only; no retail intermediate history.', 'Constraint alternative search inside reload.c is unobserved.', 'No actual retry observed in the focused corpus; synthetic parser controls are not positive compiler retry evidence.', 'Emitted-substituted and replacement-survivor RTL are observations at reload time, not a claim that later scheduling/reorg preserves every instruction. Complete assembly/object parity independently checks final output.'] };
  const output = path.join(c.fresh('analysis'), 'analysis.json'); write(output, result); return { ...result, output };
}
if (require.main === module) { const r = analyze(path.resolve(process.argv[2])); console.log(JSON.stringify({ output: r.output, comparisons: r.comparisons.map(v => ({ left: v.leftId, right: v.rightId, descriptorPrefix: v.identicalDescriptorPrefixAllocations, decisionPrefix: v.identicalDecisionPrefixAllocations })) })); }
module.exports = { history, compare, analyze };
