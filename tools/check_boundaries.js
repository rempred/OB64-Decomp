#!/usr/bin/env node
// Read-only deterministic boundary verifier for a chunk split. Complements
// check_splits.js (fragment check) with overlay-immune structural invariants:
//   1. fragment            : a code part with NO return and NO j/jal.
//   2. cross-boundary branch: a PC-relative branch whose target is in a DIFFERENT
//                             part (a function split mid-body, or wrongly merged).
//   3. under-split          : a return followed (after its delay slot + alignment
//                             nops) by a NEW "addiu $sp,-N" prologue inside the
//                             same code part (two merged functions).
//   4. delay-slot leak      : a code part whose LAST word is a control transfer
//                             (jr/branch/j) — its delay slot leaked to the next part.
//   5. data island          : a run of >= 4 consecutive RAM-pointer words inside a
//                             code part (possible inline jump table / rodata) — WARN.
// Data/straddler-head parts are exempt from return/leak/branch checks as noted.
// Exit non-zero if any hard invariant (1-4) fails. Usage:
//   node tools/check_boundaries.js --splits <splits.json> --disasm <chunk.s>
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const A = {}; const av = process.argv.slice(2);
for (let i = 0; i < av.length; i += 2) A[av[i].replace(/^--/, '')] = av[i + 1];

function usage(msg) {
  if (msg) console.error(`Error: ${msg}\n`);
  console.log(`Usage: node tools/check_boundaries.js --splits <splits.json> --disasm <chunk.s>

Deterministic boundary invariants (overlay-immune). Both args required.
Exits 0 if clean, 1 if any hard invariant (fragment / cross-boundary branch /
under-split / delay-slot leak) fails. Data-island runs are warnings.`);
}
if (av.includes('--help') || av.includes('-h')) { usage(); process.exit(0); }
if (!A.splits || !A.disasm) { usage('both --splits and --disasm are required'); process.exit(2); }
for (const [k, l] of [['splits', '--splits'], ['disasm', '--disasm']]) {
  if (!fs.existsSync(path.resolve(ROOT, A[k]))) { usage(`${l} not found: ${A[k]}`); process.exit(2); }
}

const P = (h) => (typeof h === 'number' ? h : parseInt(h, 16));
const splits = JSON.parse(fs.readFileSync(path.resolve(ROOT, A.splits), 'utf8')).splits;
const disasm = fs.readFileSync(path.resolve(ROOT, A.disasm), 'utf8').replace(/\r\n/g, '\n').split('\n');
const W = new Map();
for (const l of disasm) { const m = l.match(/\/\*\s+0x([0-9A-Fa-f]{8})\s+0x[0-9A-Fa-f]{8}\s+0x([0-9A-Fa-f]{8})/); if (m) W.set(parseInt(m[1], 16), parseInt(m[2], 16) >>> 0); }

const isRet = (w) => (w & 0xfc1fffff) === 0x00000008;            // jr $reg (incl jr $ra)
const isJ = (w) => { const op = w >>> 26; return op === 2 || op === 3; };
const brOps = new Set([1, 4, 5, 6, 7, 0x14, 0x15, 0x16, 0x17]);
const isBr = (w) => brOps.has(w >>> 26);
const brTarget = (rom, w) => { if (!isBr(w)) return null; let imm = w & 0xffff; if (imm & 0x8000) imm -= 0x10000; return rom + 4 + imm * 4; };
const isProl = (w) => (w >>> 16) === 0x27bd && (w & 0x8000);     // addiu $sp,$sp,-N
const isPtr = (w) => (w >>> 20) === 0x800 || ((w >>> 16) >= 0x8016 && (w >>> 16) <= 0x801b);
const isCode = (s) => !s.kind || s.kind === 'code' || s.kind === 'straddler-tail' || s.kind === 'straddler-head';
const isStraddlerHead = (s) => s.kind === 'straddler-head';

const parts = splits.map((s) => ({ name: s.name, a: P(s.start), b: P(s.end), s }));
const partOf = (rom) => { for (const p of parts) if (rom >= p.a && rom < p.b) return p; return null; };
const lo = parts.length ? parts[0].a : 0, hi = parts.length ? parts[parts.length - 1].b : 0;

const fail = { fragment: [], cross: [], under: [], leak: [], straddler: [] };
const warn = { island: [] };

// Straddler position sanity: a straddler-tail must be the FIRST part (start==lo);
// a straddler-head must END at the chunk end (end==hi). A straddler kind anywhere
// else is almost always a slice-boundary preamble-orphan mislabel.
for (let i = 0; i < parts.length; i += 1) {
  const p = parts[i];
  if (p.s.kind === 'straddler-tail' && p.a !== lo) fail.straddler.push(`${p.name} straddler-tail not first (starts 0x${p.a.toString(16)}, chunk starts 0x${lo.toString(16)})`);
  if (p.s.kind === 'straddler-head' && p.b !== hi) fail.straddler.push(`${p.name} straddler-head does not end at chunk end (ends 0x${p.b.toString(16)}, chunk ends 0x${hi.toString(16)})`);
}

for (const p of parts) {
  if (!isCode(p.s)) continue;
  // 1. fragment
  let hasRet = false, hasJ = false;
  for (let r = p.a; r < p.b; r += 4) { const w = W.get(r); if (w == null) continue; if (isRet(w) || isJ(w)) { if (isRet(w)) hasRet = true; hasJ = true; } }
  if (!isStraddlerHead(p.s) && !hasRet && !hasJ) fail.fragment.push(`${p.name} ${p.s.start}..${p.s.end}`);
  // 2. cross-boundary branch + 3. under-split + 5. data island
  let run = 0;
  for (let r = p.a; r < p.b; r += 4) {
    const w = W.get(r); if (w == null) continue;
    const t = brTarget(r, w);
    if (t != null && t >= lo && t < hi) { const tp = partOf(t); if (tp && tp.a !== p.a) fail.cross.push(`${p.name} @0x${r.toString(16)} -> 0x${t.toString(16)} in ${tp.name}`); }
    if (isRet(w) && r + 8 < p.b) { let k = r + 8; while (k < p.b && W.get(k) === 0) k += 4; if (k < p.b && isProl(W.get(k))) fail.under.push(`${p.name}: ret@0x${r.toString(16)} new prologue@0x${k.toString(16)}`); }
    if (isPtr(w)) { run += 1; if (run === 4) warn.island.push(`${p.name} ptr-run starting ~0x${(r - 12).toString(16)}`); } else run = 0;
  }
  // 4. delay-slot leak (last word is a control transfer)
  if (!isStraddlerHead(p.s)) { const lw = W.get(p.b - 4); if (lw != null && (isRet(lw) || isBr(lw) || isJ(lw))) fail.leak.push(`${p.name} last word @0x${(p.b - 4).toString(16)} = 0x${lw.toString(16)}`); }
}

const sizes = parts.map((p) => p.b - p.a).sort((x, y) => x - y);
console.log(`parts: ${parts.length} (code ${parts.filter((p) => isCode(p.s)).length}, data ${parts.filter((p) => !isCode(p.s)).length}); size min/median/max: ${sizes[0]}/${sizes[Math.floor(sizes.length / 2)]}/${sizes[sizes.length - 1]}`);
let hardFails = 0;
for (const [k, arr] of Object.entries(fail)) {
  console.log(`${k}: ${arr.length}`);
  hardFails += arr.length;
  for (const x of arr.slice(0, 30)) console.log('  FAIL', x);
}
console.log(`data-island warnings: ${warn.island.length}`);
for (const x of warn.island.slice(0, 30)) console.log('  WARN', x);
console.log(hardFails === 0 ? '\nBOUNDARY CHECK PASS' : `\n${hardFails} HARD FAILURE(S)`);
process.exit(hardFails === 0 ? 0 : 1);
