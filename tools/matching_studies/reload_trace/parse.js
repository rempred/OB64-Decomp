'use strict';
const TYPES = new Set(('find-begin find-end-0 find-end-1 descriptor descriptor-modes descriptor-kind input output selected replacement-begin spill-order spill scan emitted-substituted replacement-survivors insn range-end replacement-end label-call-state allocate-begin allocate-index allocate-failure allocate-selected allocate-success allocate-fatal allocate-disabled choose-begin choose-order attempt-begin inherit-success equivalent-found equivalent-usable equivalent-success attempt-success retry-before-restore retry-after-restore before-cancellations after-cancellations choose-end state state-reg state-override emit-equivalent').split(' '));
const RTX = new Set('input output selected insn state-reg state-override equivalent-found equivalent-usable emit-equivalent'.split(' '));
function parse(text, filter) {
  const lines = text.replace(/\r\n/g, '\n').split('\n'), events = []; let begun = false, ended = false, rtl = null, pendingRtl = null;
  let find = null, choosing = null, allocation = null, retry = null, replacement = false, range = null;
  for (const line of lines) {
    if (rtl !== null) { if (line === 'RR|rtl-end') { pendingRtl.rtl = rtl.join('\n'); if (!pendingRtl.rtl.trim()) throw Error('empty RTL'); rtl = null; pendingRtl = null; } else { if (line.startsWith('RR|')) throw Error('truncated RTL'); rtl.push(line); } continue; }
    if (pendingRtl) { if (line !== 'RR|rtl-begin') throw Error('missing RTL begin'); rtl = []; continue; }
    if (!line.startsWith('RR|')) continue;
    if (line === 'RR|begin|1') { if (begun || ended) throw Error('duplicate trace begin'); begun = true; continue; }
    const p = line.split('|');
    if (p[1] === 'end') {
      if (!begun || ended || p.length !== 4 || Number(p[2]) !== events.length || p[3] !== '0' || find || choosing || allocation || retry || replacement || range) throw Error('incomplete trace end');
      ended = true; continue;
    }
    if (!begun || ended || p.length !== 13 || !TYPES.has(p[1]) || p.slice(2, 3).concat(p.slice(4)).some(x => !/^-?\d+$/.test(x))) throw Error('malformed trace event');
    const [seq, fn, uid, phase, choose, attempt, reload, cursor, a, b, c] = p.slice(2).map((v, i) => i === 1 ? v : Number(v));
    if (seq !== events.length + 1 || ![0, 1].includes(phase) || filter && fn !== filter) throw Error('trace sequence/filter/phase');
    const e = { type: p[1], seq, fn, uid, phase, choose, attempt, reload, cursor, a, b, c }; events.push(e);
    if (e.type === 'find-begin') { if (find || a !== phase) throw Error('find nesting'); find = e; }
    if (e.type.startsWith('find-end-')) { if (!find || find.uid !== uid || find.phase !== phase || Number(e.type.slice(-1)) !== phase) throw Error('find closure'); find = null; }
    if (e.type === 'replacement-begin') { if (replacement || phase !== 1) throw Error('replacement nesting'); replacement = true; }
    if (e.type === 'replacement-end') { if (!replacement || choosing || range) throw Error('replacement closure'); replacement = false; }
    if (e.type === 'choose-begin') { if (!replacement || choosing || phase !== 1) throw Error('choose nesting'); choosing = e; }
    if (e.type === 'choose-end') { if (!choosing || choosing.choose !== choose || choosing.uid !== uid || allocation || retry) throw Error('choose closure'); choosing = null; }
    if (e.type === 'allocate-begin') { if (!choosing || allocation || phase !== 1) throw Error('allocation nesting'); allocation = e; }
    if (['allocate-success', 'allocate-failure', 'allocate-disabled'].includes(e.type)) { if (!allocation || allocation.reload !== reload || allocation.uid !== uid) throw Error('allocation closure'); allocation = null; }
    if (e.type === 'allocate-fatal') throw Error('fatal allocation is not positive trace coverage');
    if (e.type === 'retry-before-restore') { if (!choosing || retry || allocation) throw Error('retry nesting'); retry = e; }
    if (e.type === 'retry-after-restore') { if (!retry || retry.uid !== uid || retry.choose !== choose || retry.attempt !== attempt) throw Error('retry closure'); retry = null; }
    if (['emitted-substituted', 'replacement-survivors'].includes(e.type)) { if (range || !replacement) throw Error('range nesting'); range = e; }
    if (e.type === 'range-end') { if (!range || range.uid !== uid) throw Error('range closure'); range = null; }
    if (RTX.has(e.type)) pendingRtl = e;
  }
  if (!begun || !ended || !events.length || pendingRtl || rtl) throw Error('missing/truncated trace');
  for (const [index, e] of events.entries()) {
    if (e.type.startsWith('find-end-')) {
      if (e.a < 0 || e.a > 4096) throw Error('descriptor count');
      for (let r = 0; r < e.a; r++) for (const [j, type] of ['descriptor', 'descriptor-modes', 'descriptor-kind', 'input', 'output', 'selected'].entries()) {
        const next = events[index + 1 + r * 6 + j];
        if (!next || next.type !== type || next.reload !== r || next.uid !== e.uid || next.phase !== e.phase) throw Error('incomplete selected descriptor list');
      }
    }
    if (['choose-order', 'attempt-begin', 'attempt-success', 'retry-before-restore', 'retry-after-restore', 'before-cancellations', 'after-cancellations', 'choose-end'].includes(e.type)) {
      if (e.a < 0 || e.a > 4096) throw Error('state count');
      const seen = new Set();
      for (let j = 0; j < e.a; j++) {
        const state = events[index + 1 + j * 3];
        if (!state || state.type !== 'state' || state.a !== j || state.uid !== e.uid || seen.has(state.reload)) throw Error('incomplete state list');
        seen.add(state.reload);
        for (const [k, type] of ['state-reg', 'state-override'].entries()) {
          const next = events[index + 2 + j * 3 + k];
          if (!next || next.type !== type || next.reload !== state.reload || next.uid !== e.uid) throw Error('incomplete state RTL');
        }
      }
    }
  }
  validateLifecycle(events);
  const coverage = Object.fromEntries([...TYPES].map(t => [t, events.filter(e => e.type === t).length]));
  if (!coverage['find-begin'] || !coverage['replacement-end']) throw Error('missing actual reload observation');
  return { schemaVersion: 1, events, coverage, unobserved: ['reload.c internal constraint-alternative search', 'retail intermediate/event history'] };
}
function validateLifecycle(events) {
  let replacement = null, find = null, lastFind = null, choice = null, lastChoice = null, allocation = null, range = null, cursor = null, spills = [], survivors = false;
  const require = (ok, message) => { if (!ok) throw Error(`trace lifecycle: ${message}`); };
  const context = (a, b, keys = ['fn', 'uid', 'phase', 'choose', 'attempt', 'cursor']) => keys.every(k => a[k] === b[k]);
  const count = n => Number.isSafeInteger(n) && n >= 0 && n <= 4096;
  const childTypes = new Set(['descriptor', 'descriptor-modes', 'descriptor-kind', 'input', 'output', 'selected', 'state', 'state-reg', 'state-override', 'spill']);
  for (let i = 0; i < events.length; i++) {
    const e = events[i], t = e.type;
    require(/^[A-Za-z_.$][\w.$]*$/.test(e.fn), 'function name');
    if (replacement) {
      require(e.phase === 1 && e.fn === replacement.fn, 'replacement function/phase');
      require(e.cursor === (t === 'allocate-success' ? e.a : cursor), 'cursor transition');
    } else require(e.phase === 0 || t === 'replacement-begin', 'planning phase');
    const children = (types, n, ordered) => {
      require(count(n), 'child count'); const seen = new Set();
      for (let j = 0; j < n; j++) {
        const first = events[i + 1]; require(first, 'missing child');
        if (types[0] !== 'spill') { require(first.reload >= 0 && first.reload < n && !seen.has(first.reload), 'child index'); seen.add(first.reload); }
        if (ordered) require(first.reload === j, 'descriptor order');
        if (types[0] === 'state' || types[0] === 'spill') require(first.a === j, 'child order');
        for (const type of types) { const v = events[++i]; require(v && v.type === type && context(e, v) && v.reload === first.reload, 'child context/order'); }
      }
    };
    if (range) {
      if (t === 'insn') { require(context(e, range, ['fn', 'phase', 'choose', 'attempt', 'cursor']), 'insn context'); continue; }
      require(t === 'range-end' && context(e, range), 'range end'); range = null; continue;
    }
    require(!childTypes.has(t) && t !== 'insn' && t !== 'range-end', 'orphan child');
    if (t === 'replacement-begin') { require(!replacement && !find && !choice, 'replacement begin'); replacement = e; cursor = e.cursor; survivors = false; spills = []; continue; }
    if (t === 'replacement-end') { require(replacement && !find && !choice && survivors, 'replacement end'); replacement = null; lastFind = null; lastChoice = null; continue; }
    if (t === 'find-begin') { require(!find && !choice && e.a === e.phase, 'find begin'); find = e; continue; }
    if (t.startsWith('find-end-')) { require(find && context(find, e) && +t.slice(-1) === e.phase, 'find end'); find = null; lastFind = e; children(['descriptor', 'descriptor-modes', 'descriptor-kind', 'input', 'output', 'selected'], e.a, true); continue; }
    require(!find, 'event inside find call');
    if (t === 'spill-order' || t === 'label-call-state') { require(replacement && !choice, 'spill context'); const start = i; children(['spill'], e.a); const pool = events.slice(start + 1, i + 1).map(v => v.b); if (t === 'spill-order') spills = pool; else require(JSON.stringify(pool) === JSON.stringify(spills), 'spill pool drift'); continue; }
    if (t === 'scan') { require(replacement && !choice, 'scan context'); continue; }
    if (t === 'choose-begin') { require(replacement && !choice && lastFind && lastFind.phase === 1 && lastFind.fn === e.fn && lastFind.uid === e.uid && e.a === lastFind.a && e.a > 0 && e.attempt === -1, 'choose begin'); choice = { event: e, stage: 'begin', attempt: -1, failed: false }; continue; }
    if (t === 'emitted-substituted' || t === 'replacement-survivors') { require(replacement && !choice && (t !== 'emitted-substituted' || lastChoice && context(e, lastChoice, ['fn', 'uid', 'phase', 'choose', 'attempt'])), 'range context'); if (t === 'replacement-survivors') survivors = true; range = e; continue; }
    if (t === 'emit-equivalent') { require(lastChoice && context(e, lastChoice, ['fn', 'uid', 'phase', 'choose', 'attempt']) && e.reload >= 0 && e.reload < lastChoice.a, 'emit context'); continue; }
    require(choice && context(e, choice.event, ['fn', 'uid', 'phase', 'choose']), 'choose context');
    if (t === 'choose-order') { require(choice.stage === 'begin' && e.attempt === -1, 'choose order'); choice.stage = 'ordered'; }
    else if (t === 'attempt-begin') { require(['ordered', 'restored'].includes(choice.stage) && [0, 1].includes(e.attempt) && (choice.stage !== 'restored' || choice.attempt === 1 && e.attempt === 0), 'attempt order'); choice.stage = 'attempt'; choice.attempt = e.attempt; choice.failed = false; }
    else {
      require(e.attempt === choice.attempt, 'attempt context');
      if (t.startsWith('allocate-')) {
        require(choice.stage === 'attempt' && e.reload >= 0 && e.reload < choice.event.a, 'allocation bounds');
        if (t === 'allocate-begin') { require(!allocation, 'allocation nesting'); allocation = { event: e }; }
        else {
          require(allocation && context(e, allocation.event, ['fn', 'uid', 'phase', 'choose', 'attempt', 'reload']), 'allocation context');
          if (t === 'allocate-index') { require([0, 1].includes(e.a) && e.b >= 0 && e.b < spills.length && spills[e.b] === e.c, 'allocation candidate'); allocation.index = e; }
          else if (t === 'allocate-selected') { require(allocation.index && e.a === allocation.index.b && e.b === allocation.index.c && e.c === allocation.index.a, 'allocation selection'); allocation.selected = e; }
          else if (t === 'allocate-success') { require(allocation.selected && ['a', 'b', 'c'].every(k => e[k] === allocation.selected[k]), 'allocation success'); allocation = null; cursor = e.cursor; }
          else if (t === 'allocate-failure') { require(!allocation.selected, 'failed selected allocation'); allocation = null; choice.failed = true; }
          else throw Error('trace lifecycle: unsuccessful compiler allocation');
        }
        continue;
      }
      if (['inherit-success', 'equivalent-found', 'equivalent-usable', 'equivalent-success'].includes(t)) { require(choice.stage === 'attempt' && e.attempt === 1 && e.reload >= 0 && e.reload < choice.event.a, 'inheritance context'); continue; }
      require(!allocation, 'unfinished allocation');
      const transitions = { 'attempt-success': ['attempt', 'success'], 'retry-before-restore': ['attempt', 'retry'], 'retry-after-restore': ['retry', 'restored'], 'before-cancellations': ['success', 'before'], 'after-cancellations': ['before', 'after'], 'choose-end': ['after', 'done'] };
      const transition = transitions[t]; require(transition && choice.stage === transition[0], 'choose stage');
      if (t === 'attempt-success') require(!choice.failed, 'success after failed allocation');
      if (t === 'retry-before-restore') require(choice.failed && e.attempt === 1, 'retry without failed inheritance allocation');
      choice.stage = transition[1];
    }
    require(e.a === choice.event.a, 'state count drift'); children(['state', 'state-reg', 'state-override'], e.a);
    if (t === 'choose-end') { lastChoice = e; choice = null; }
  }
  require(!replacement && !find && !choice && !allocation && !range, 'unfinished lifecycle');
}
module.exports = { TYPES, RTX, parse, validateLifecycle };
