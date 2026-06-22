#!/usr/bin/env node
// Chunk-split pipeline (3/4): integrator.
//
// Merges the per-slice sliceK_final.json outputs from the analysis swarm into
// one validated --splits-file for tools/split_original_mips_part.js. Validates
// contiguity, 4-alignment, full coverage of [start,end), and (when the chunk
// opens with a straddler) that the first file is the straddler tail. Dedupes
// names against the existing manifest and within the chunk (descriptive names
// keep their root via an address suffix; collisions on func_/data_ get _b).
//
// Read-only w.r.t. tracked source: writes only the gitignored splits JSON.
// Usage: node tools/integrate_chunk.js --start 0x41000 --end 0x51000 --tail-end 0x41098 --tail-name func_00040ff4_chunk4tail
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const A = {}; const av = process.argv.slice(2);
for (let i = 0; i < av.length; i += 2) A[av[i].replace(/^--/, '')] = av[i + 1];
const P = (v) => parseInt(v, 16);
const LH = (n) => n.toString(16).toLowerCase().padStart(8, '0');
const H = (n) => '0x' + n.toString(16).toUpperCase().padStart(8, '0');
const CHUNK_START = P(A.start), CHUNK_END = P(A.end), TAIL_END = P(A['tail-end']);
const TAIL_NAME = A['tail-name'];
const HAS_TAIL = TAIL_END !== CHUNK_START;
const LIBDIR = A.libdir || 'asm/original/rev0/lib';
const tag = `${CHUNK_START.toString(16).padStart(8, '0')}-${CHUNK_END.toString(16).padStart(8, '0')}`;
const chunkFile = `asm/original/rev0/code_${CHUNK_START.toString(16).padStart(8, '0')}_${CHUNK_END.toString(16).padStart(8, '0')}.s`;

const ctx = JSON.parse(fs.readFileSync(path.join(ROOT, `build/context/rev0-function-context-${tag}.json`), 'utf8'));
const embedded = new Set(ctx.functions.map((f) => P(f.rom)));
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'asm/original/rev0/manifest.json'), 'utf8'));
const existingNames = new Set();
for (const c of manifest.chunks) for (const p of c.parts || []) if (p.name) existingNames.add(p.name.toLowerCase());

const slicesMeta = JSON.parse(fs.readFileSync(path.join(ROOT, `build/chunk_${tag}_slices.json`), 'utf8'));
let merged = []; const missing = [];
for (const sm of slicesMeta) {
  const fp = path.join(ROOT, `build/chunk_${tag}_slices/slice${sm.slice}_final.json`);
  if (!fs.existsSync(fp)) { missing.push(sm.slice); continue; }
  const data = JSON.parse(fs.readFileSync(fp, 'utf8'));
  merged.push(...(data.functions || []));
}
if (missing.length) { console.error('MISSING final files for slices:', missing.join(',')); process.exit(2); }

const problems = []; let cur = CHUNK_START;
for (let i = 0; i < merged.length; i++) {
  const f = merged[i], s = P(f.start), e = P(f.end);
  if (s !== cur) problems.push(`#${i} ${f.name}: start ${f.start} != expected ${H(cur)}`);
  if (e <= s) problems.push(`#${i} ${f.name}: bad range ${f.start}..${f.end}`);
  if (s % 4 || e % 4) problems.push(`#${i} ${f.name}: not 4-aligned`);
  cur = e;
}
if (cur !== CHUNK_END) problems.push(`final end ${H(cur)} != ${H(CHUNK_END)}`);
if (HAS_TAIL && (P(merged[0].start) !== CHUNK_START || P(merged[0].end) !== TAIL_END || merged[0].name !== TAIL_NAME)) {
  problems.push(`first file must be ${TAIL_NAME} ${H(CHUNK_START)}..${H(TAIL_END)}, got ${merged[0].name} ${merged[0].start}..${merged[0].end}`);
}
if (problems.length) { console.error('PROBLEMS:\n' + problems.map((p) => '  ' + p).join('\n')); process.exit(3); }

// asm labels allow [A-Za-z_][A-Za-z0-9_]* — keep libultra/libc camelCase names
// (osException, guRotate, __osDispatchThread) instead of dropping them to func_.
const validName = (n) => /^[A-Za-z_][A-Za-z0-9_]*$/.test(n);
const used = new Set();
let descriptive = 0, conservative = 0, dataFiles = 0, fallbacks = 0, collisions = 0;
const splits = [];
for (const f of merged) {
  const s = P(f.start), e = P(f.end);
  const funcName = 'func_' + LH(s);
  let name = (f.name || '').trim();
  const isData = f.kind === 'data' || f.kind === 'jumptable';
  const isStraddler = f.kind === 'straddler-head' || f.kind === 'straddler-tail';
  if (/^func_[0-9a-fA-F]{8}$/.test(name)) name = funcName; // canonical lowercase func_<start>
  else if (!name || !validName(name)) { name = isData ? (f.kind + '_' + LH(s)) : funcName; fallbacks++; }
  // dedupe vs existing manifest + already-used; preserve descriptive root via address suffix
  if (used.has(name.toLowerCase()) || existingNames.has(name.toLowerCase())) {
    collisions++;
    name = (name === funcName || /^(data|jumptable)_/.test(name)) ? `${name}_b` : `${name}_${LH(s)}`;
  }
  used.add(name.toLowerCase());
  if (isData) dataFiles++;
  else if (/^func_[0-9a-f]{8}$/.test(name)) conservative++;
  else descriptive++;
  const isFuncStartName = name === funcName;
  const label = (isFuncStartName && embedded.has(s)) ? null : name;
  const entry = { name, start: H(s), end: H(e), file: `${LIBDIR}/${name}.s` };
  if (label) entry.label = label;
  if (isData) { entry.kind = 'data'; if (f.note) entry.note = f.note; }
  else if (isStraddler) { entry.kind = f.kind; if (f.note) entry.note = f.note; }
  else if (f.note) entry.note = f.note;
  splits.push(entry);
}
fs.writeFileSync(path.join(ROOT, `build/chunk_${tag}_splits.json`), JSON.stringify({ part: chunkFile, splits }, null, 2));
console.log(`[${tag}] merged ${merged.length} files; descriptive ${descriptive}; func_ ${conservative}; data/jumptable ${dataFiles}; fallbacks ${fallbacks}; collisions ${collisions}`);
console.log(`wrote build/chunk_${tag}_splits.json`);
