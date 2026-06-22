#!/usr/bin/env node
// Chunk-split pipeline (4/4): adversarial fragment check (read-only).
//
// Reads an integrated splits JSON and the chunk disassembly and flags any code
// part that contains NO return (jr $ra / jr $reg) AND NO j/jal — i.e. a likely
// boundary fragment rather than a whole function. Data/jumptable/rodata parts
// are skipped (they legitimately have no return). Also lists very small files.
// This does not prove correctness; it catches the common split mistake.
//
// Usage: node tools/check_splits.js --splits build/chunk_00041000-00051000_splits.json --disasm build/original-mips/rev0/code_00041000_00051000.s
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const A = {}; const av = process.argv.slice(2);
for (let i = 0; i < av.length; i += 2) A[av[i].replace(/^--/, '')] = av[i + 1];
const P = (v) => parseInt(v, 16);

function usage(msg) {
  if (msg) console.error(`Error: ${msg}\n`);
  console.log(`Usage: node tools/check_splits.js --splits <splits.json> --disasm <chunk.s>

Adversarial fragment check (read-only): flags any code part with NO return and
NO j/jal (likely a boundary fragment) and lists very small files. Both arguments
are REQUIRED:
  --splits  integrated splits JSON ({splits:[{name,start,end,kind?}]}).
  --disasm  the chunk disassembly .s (decode-comment lines).
Example:
  node tools/check_splits.js \\
    --splits build/chunk_00051000-00061000_splits.json \\
    --disasm build/original-mips/rev0/code_00051000_00061000.s`);
}
if (av.includes('--help') || av.includes('-h')) { usage(); process.exit(0); }
if (!A.splits || !A.disasm) { usage('both --splits and --disasm are required'); process.exit(2); }
for (const [k, label] of [['splits', '--splits'], ['disasm', '--disasm']]) {
  if (!fs.existsSync(path.resolve(ROOT, A[k]))) { usage(`${label} file not found: ${A[k]}`); process.exit(2); }
}

const splits = JSON.parse(fs.readFileSync(path.resolve(ROOT, A.splits), 'utf8')).splits;
const disasm = fs.readFileSync(path.resolve(ROOT, A.disasm), 'utf8').replace(/\r\n/g, '\n').split('\n');
const word = new Map();
for (const l of disasm) { const m = l.match(/\/\*\s+0x([0-9A-Fa-f]{8})\s+0x[0-9A-Fa-f]{8}\s+0x([0-9A-Fa-f]{8})\s+\*\//); if (m) word.set(parseInt(m[1], 16), parseInt(m[2], 16) >>> 0); }
const JR_RA = 0x03e00008;
const isJrReg = (w) => (w & 0xfc1fffff) === 0x00000008;
const isJ = (w) => { const op = w >>> 26; return op === 0x02 || op === 0x03; };
const isData = (s) => s.kind === 'data' || s.kind === 'jumptable' || (s.name && /^(data|jumptable|rodata)_/.test(s.name));
let frag = 0; const noReturn = []; const tiny = []; const sizes = [];
for (const s of splits) {
  const a = P(s.start), b = P(s.end); sizes.push(b - a);
  if (isData(s) || (s.kind && /straddler/.test(s.kind))) continue;
  let hasReturn = false, hasJ = false;
  for (let r = a; r < b; r += 4) { const w = word.get(r); if (w == null) continue; if (w === JR_RA || isJrReg(w)) hasReturn = true; if (isJ(w)) hasJ = true; }
  if (b - a <= 12) tiny.push(`${s.name} ${s.start}..${s.end} (${b - a}B)`);
  if (!hasReturn && !hasJ) { frag++; noReturn.push(`${s.name} ${s.start}..${s.end} (${b - a}B)`); }
}
sizes.sort((x, y) => x - y);
console.log(`splits: ${splits.length}; size min/median/max: ${sizes[0]}/${sizes[Math.floor(sizes.length / 2)]}/${sizes[sizes.length - 1]}`);
console.log(`<=12B files: ${tiny.length}; NO return AND NO j/jal (fragment?, non-data): ${frag}`);
for (const x of tiny.slice(0, 40)) console.log('  TINY', x);
for (const x of noReturn.slice(0, 80)) console.log('  FRAG?', x);
