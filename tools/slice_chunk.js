#!/usr/bin/env node
// Chunk-split pipeline (2/4): per-slice splitter for the analysis swarm.
//
// Splits the base partition from tools/plan_chunk.js into N contiguous slices
// (seams chosen at non-preamble-orphan boundaries) and writes, for each slice,
// the decoded .s lines (build/chunk_<tag>_slices/sliceK.s) and the slice plan
// (sliceK_plan.json). Each slice is handed to one analysis agent, which refines
// boundaries and proposes conservative names, returning sliceK_final.json.
//
// Read-only w.r.t. tracked source: writes only gitignored build/ artifacts.
// Usage: node tools/slice_chunk.js --start 0x41000 --end 0x51000 --nslices 12
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const A = {};
const av = process.argv.slice(2);
for (let i = 0; i < av.length; i += 2) A[av[i].replace(/^--/, '')] = av[i + 1];
const P = (v) => parseInt(v, 16);
const CHUNK_START = P(A.start), CHUNK_END = P(A.end);
const NSL = parseInt(A.nslices || '10', 10);
const tag = `${CHUNK_START.toString(16).padStart(8, '0')}-${CHUNK_END.toString(16).padStart(8, '0')}`;
const plan = JSON.parse(fs.readFileSync(path.join(ROOT, `build/chunk_${tag}_plan_base.json`), 'utf8'));
// --disasm overrides the default chunk-file path. Needed for a MIXED chunk where
// the analyzed sub-range (e.g. the code region) is narrower than the 64 KiB chunk
// disasm file; slice_chunk only emits words inside the plan ranges, so a wider
// disasm is fine.
const disasmPath = A.disasm
  ? path.resolve(ROOT, A.disasm)
  : path.join(ROOT, `build/original-mips/rev0/code_${CHUNK_START.toString(16).padStart(8, '0')}_${CHUNK_END.toString(16).padStart(8, '0')}.s`);
const disasm = fs.readFileSync(disasmPath, 'utf8').replace(/\r\n/g, '\n').split('\n');
const wordRom = (l) => { const m = l.match(/\/\*\s+0x([0-9A-Fa-f]{8})\s+/); return m ? parseInt(m[1], 16) : null; };

const part = plan.partition, N = part.length;
const per = Math.ceil(N / NSL);
const seams = [0]; let want = per;
for (let i = 1; i < N && seams.length < NSL; i++) {
  if (i >= want) { let k = i; while (k < N && part[k].leadingGap) k++; if (k < N) { seams.push(k); want = k + per; } }
}
const slices = [];
for (let s = 0; s < seams.length; s++) {
  const a = seams[s], b = (s + 1 < seams.length) ? seams[s + 1] : N;
  slices.push({ slice: s + 1, start: part[a].start, end: part[b - 1].end, files: b - a });
}
const outDir = path.join(ROOT, `build/chunk_${tag}_slices`);
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(ROOT, `build/chunk_${tag}_slices.json`), JSON.stringify(slices, null, 2));
for (const sl of slices) {
  const a = P(sl.start), b = P(sl.end);
  const out = []; let keep = false; let pending = [];
  for (const line of disasm) {
    const rom = wordRom(line);
    if (rom == null) { pending.push(line); continue; }
    if (rom >= a && rom < b) { if (!keep) { pending = []; keep = true; } out.push(...pending); pending = []; out.push(line); }
    else { pending = []; if (rom >= b) break; }
  }
  // Note: the decode comments carry the LINEAR-map RAM column (ROM + 0x8006FC00).
  // For overlay-relocated chunks the true runtime RAM differs — cross-check the
  // overlay map (scripts/ob64_overlay_map.json) before trusting any RAM target.
  fs.writeFileSync(path.join(outDir, `slice${sl.slice}.s`), `; ${tag} slice ${sl.slice}: ${sl.start}..${sl.end} (${sl.files} base files)\n; Decode comments show the linear-map RAM column; overlay-relocated chunks differ (see scripts/ob64_overlay_map.json).\n` + out.join('\n') + '\n');
  const planSlice = part.filter((e) => P(e.start) >= a && P(e.start) < b);
  fs.writeFileSync(path.join(outDir, `slice${sl.slice}_plan.json`), JSON.stringify({ slice: sl.slice, start: sl.start, end: sl.end, files: planSlice }, null, 2));
  console.log(`slice ${sl.slice}: ${sl.start}..${sl.end} files=${sl.files} lines=${out.length}`);
}
