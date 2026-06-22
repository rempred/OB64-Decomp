#!/usr/bin/env node
// Chunk-split pipeline (1/4): base-partition planner for a 64 KiB code chunk.
//
// Reads the read-only context report from tools/dump_function_context.js
// (build/context/rev0-function-context-<tag>.json) and emits a base partition:
// cut at primary parent-function starts, drop overlap/secondary entries, force
// the straddler-tail boundary, and fold the tail-end file under the first
// primary. The base partition is only a starting point — the per-slice analysis
// swarm refines boundaries (hidden frameless leaves, preamble-orphans, dual
// entries, inline data) before tools/split_original_mips_part.js writes files.
//
// Read-only w.r.t. tracked source: writes only gitignored build/ artifacts.
// Usage: node tools/plan_chunk.js --start 0x41000 --end 0x51000 --tail-end 0x41098 --tail-name func_00040ff4_chunk4tail
// For a chunk with no straddler, pass --tail-end equal to --start and a
// --tail-name that will be ignored (the first primary becomes file 0).
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const A = {};
const av = process.argv.slice(2);
for (let i = 0; i < av.length; i += 2) A[av[i].replace(/^--/, '')] = av[i + 1];
const P = (v) => (typeof v === 'number' ? v : parseInt(v, 16));
const H = (n) => '0x' + n.toString(16).toUpperCase().padStart(8, '0');
const CHUNK_START = P(A.start), CHUNK_END = P(A.end), TAIL_END = P(A['tail-end']);
const TAIL_NAME = A['tail-name'];
const tag = `${CHUNK_START.toString(16).padStart(8, '0')}-${CHUNK_END.toString(16).padStart(8, '0')}`;
const ctxPath = path.join(ROOT, `build/context/rev0-function-context-${tag}.json`);
const j = JSON.parse(fs.readFileSync(ctxPath, 'utf8'));

const secondary = new Set(j.boundaryNotes.filter((n) => n.kind === 'overlap').map((n) => P(n.b)));
const gaps = j.boundaryNotes.filter((n) => n.kind === 'gap').map((n) => ({ from: P(n.from), to: P(n.to), bytes: n.bytes }));
const gapBefore = new Map(gaps.map((g) => [g.to, g]));
const hazardByRom = new Map(j.hazards.map((h) => [P(h.rom), h.hazards]));
const fns = j.functions.map((f) => ({ ...f, _rom: P(f.rom) }));
const byRom = new Map(fns.map((f) => [f._rom, f]));

let primaryStarts = fns.map((f) => f._rom).filter((r) => !secondary.has(r) && r >= TAIL_END).sort((a, b) => a - b);
const p0 = primaryStarts[0];
// cuts = {start, tailEnd, end} ∪ (primary starts except p0)
const cutSet = new Set([CHUNK_START, TAIL_END, CHUNK_END]);
for (const s of primaryStarts) if (s !== p0) cutSet.add(s);
const cuts = [...cutSet].sort((a, b) => a - b);

const partition = [];
for (let i = 0; i < cuts.length - 1; i += 1) {
  const start = cuts[i], end = cuts[i + 1];
  let fnRom;
  if (start === CHUNK_START && CHUNK_START !== TAIL_END) fnRom = null; // straddler tail
  else if (start === TAIL_END) fnRom = p0;                            // first real function (folds any leading pad)
  else fnRom = start;
  const f = fnRom != null ? byRom.get(fnRom) : null;
  const secInside = [...secondary].filter((s) => s >= start && s < end).sort((a, b) => a - b);
  const g = gapBefore.get(fnRom);
  partition.push({
    idx: i,
    start: H(start), end: H(end), bytes: end - start,
    fnRom: fnRom != null ? H(fnRom) : null,
    defaultName: (start === CHUNK_START && CHUNK_START !== TAIL_END) ? TAIL_NAME : (fnRom != null ? `func_${fnRom.toString(16).toUpperCase().padStart(8, '0')}` : `data_${start.toString(16).toUpperCase().padStart(8, '0')}`),
    parentName: f ? f.name : null,
    kind: f ? f.kind : (start === CHUNK_START ? 'straddler-tail' : null),
    frameSize: f ? f.frameSize : null,
    flags: f ? f.flags : null,
    callerCount: f ? f.callerCount : null,
    calleeCount: f ? f.calleeCount : null,
    calleesInRange: f ? f.calleesInRange : [],
    roleHints: f ? f.roleHints : [],
    topConstants: f ? (f.topConstants || []).slice(0, 6) : [],
    accessed: f ? (f.accessed || []).slice(0, 12) : [],
    secondaryInside: secInside.map(H),
    leadingGap: g ? { from: H(g.from), to: H(g.to), bytes: g.bytes } : null,
    hazards: f ? (hazardByRom.get(fnRom) || []) : [],
  });
}
let cur = CHUNK_START;
for (const e of partition) { if (P(e.start) !== cur) throw new Error(`contiguity break at ${e.start}`); cur = P(e.end); }
if (cur !== CHUNK_END) throw new Error(`partition ends at ${H(cur)} != ${H(CHUNK_END)}`);

const out = { range: { start: H(CHUNK_START), end: H(CHUNK_END) }, tailEnd: H(TAIL_END), tailName: TAIL_NAME, fileCount: partition.length, droppedSecondaries: [...secondary].sort((a, b) => a - b).map(H), gapCount: gaps.length, partition };
fs.writeFileSync(path.join(ROOT, `build/chunk_${tag}_plan_base.json`), JSON.stringify(out, null, 2));
console.log(`[${tag}] files: ${partition.length}; dropped secondaries: ${secondary.size}; gaps: ${gaps.length}`);
console.log(`large gaps (>=64B):`, gaps.filter((g) => g.bytes >= 64).map((g) => `${H(g.from)}..${H(g.to)}(${g.bytes})`).join(' ') || 'none');
for (const e of partition.slice(0, 4)) console.log('  ', e.start, e.end, e.bytes, e.defaultName, e.secondaryInside.length ? `sec=${e.secondaryInside.join(',')}` : '');
console.log('   ...'); for (const e of partition.slice(-2)) console.log('  ', e.start, e.end, e.bytes, e.defaultName);
