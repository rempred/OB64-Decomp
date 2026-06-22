#!/usr/bin/env node
// Disassembly-based function-start scanner for PARENT-UNDETECTED code regions
// (where ob64_functions.json / the overlay map have 0 entries, e.g. chunks 6-7).
// A MIPS function entry is the only place a "addiu $sp,$sp,-N" prologue appears,
// so framed-function starts = the range start + every such prologue. Frameless
// leaves (no prologue) between framed functions are left as gaps for the analysis
// swarm to recover (same as plan_chunk's gaps). Emits a plan_base.json compatible
// with tools/slice_chunk.js so the rest of the pipeline is unchanged.
//
// Read-only: writes only the gitignored build/ plan file. Usage:
//   node tools/scan_functions.js --start 0x66E10 --end 0x71000 \
//     --disasm build/original-mips/rev0/code_00061000_00071000.s
// Optional: --tail-end <t> --tail-name <n> to force a leading straddler-tail part
//   (e.g. a function continuing in from the previous chunk).
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const A = {}; const av = process.argv.slice(2);
for (let i = 0; i < av.length; i += 2) A[av[i].replace(/^--/, '')] = av[i + 1];
function usage(msg) {
  if (msg) console.error(`Error: ${msg}\n`);
  console.log(`Usage: node tools/scan_functions.js --start <hex> --end <hex> --disasm <chunk.s> [--tail-end <hex> --tail-name <name>]

Seeds the chunk-split pipeline for PARENT-UNDETECTED code: framed-function starts
= range start + every "addiu $sp,$sp,-N" prologue. Writes
build/chunk_<start>-<end>_plan_base.json (slice_chunk-compatible).`);
}
if (av.includes('--help') || av.includes('-h')) { usage(); process.exit(0); }
if (!A.start || !A.end || !A.disasm) { usage('--start, --end, --disasm are required'); process.exit(2); }
const P = (h) => parseInt(h, 16);
const H = (n) => '0x' + n.toString(16).toUpperCase().padStart(8, '0');
const START = P(A.start), END = P(A.end);
const TAIL_END = A['tail-end'] ? P(A['tail-end']) : START;
const TAIL_NAME = A['tail-name'] || null;
const disasmPath = path.resolve(ROOT, A.disasm);
if (!fs.existsSync(disasmPath)) { usage(`--disasm not found: ${A.disasm}`); process.exit(2); }
const disasm = fs.readFileSync(disasmPath, 'utf8').replace(/\r\n/g, '\n').split('\n');
const W = new Map();
for (const l of disasm) { const m = l.match(/\/\*\s+0x([0-9A-Fa-f]{8})\s+0x[0-9A-Fa-f]{8}\s+0x([0-9A-Fa-f]{8})/); if (m) W.set(parseInt(m[1], 16), parseInt(m[2], 16) >>> 0); }
const isProl = (w) => (w >>> 16) === 0x27bd && (w & 0x8000); // addiu $sp,$sp,-N

const starts = new Set([TAIL_END]); // first framed function after any straddler tail
for (let r = Math.max(START, TAIL_END); r < END; r += 4) { const w = W.get(r); if (w != null && isProl(w)) starts.add(r); }
let cuts = [...starts].sort((a, b) => a - b);
if (TAIL_NAME && TAIL_END !== START) cuts = [START, ...cuts];
cuts.push(END);

const tag = `${START.toString(16).padStart(8, '0')}-${END.toString(16).padStart(8, '0')}`;
const partition = [];
for (let i = 0; i < cuts.length - 1; i += 1) {
  const s = cuts[i], e = cuts[i + 1];
  const isTail = TAIL_NAME && TAIL_END !== START && s === START;
  partition.push({
    idx: i, start: H(s), end: H(e), bytes: e - s,
    fnRom: isTail ? null : H(s),
    defaultName: isTail ? TAIL_NAME : `func_${s.toString(16).toUpperCase().padStart(8, '0')}`,
    parentName: null, kind: isTail ? 'straddler-tail' : 'prologue-scan', frameSize: null, flags: null,
    callerCount: null, calleeCount: null, calleesInRange: [], roleHints: [], topConstants: [], accessed: [],
    secondaryInside: [], leadingGap: null, hazards: [],
  });
}
let cur = START;
for (const e of partition) { if (P(e.start) !== cur) throw new Error(`contiguity break at ${e.start}`); cur = P(e.end); }
if (cur !== END) throw new Error(`partition ends at ${H(cur)} != ${H(END)}`);
const out = { range: { start: H(START), end: H(END) }, tailEnd: H(TAIL_END), tailName: TAIL_NAME, fileCount: partition.length, droppedSecondaries: [], gapCount: 0, source: 'scan_functions (prologue-based; parent-undetected)', partition };
fs.writeFileSync(path.join(ROOT, `build/chunk_${tag}_plan_base.json`), JSON.stringify(out, null, 2));
console.log(`[${tag}] prologue-scan: ${partition.length} framed-function file(s) over ${H(START)}..${H(END)} (prologues found: ${starts.size - (TAIL_NAME && TAIL_END !== START ? 1 : 1)})`);
const big = partition.filter((p) => p.bytes >= 512).map((p) => `${p.start}(${p.bytes})`);
console.log(`large files (>=512B, likely hide frameless leaves): ${big.length}${big.length ? ' — ' + big.slice(0, 8).join(' ') : ''}`);
