#!/usr/bin/env node
'use strict';

// Template-pool census (research only, read-only).
//
// For every accepted function target, normalize retail instruction words into
// skeletons at three strengths and count unsolved targets whose skeleton
// equals that of a solved target (one with an active matching source).
//
//   S2  words equal after masking imm16 and jump-target fields
//       (registers, opcodes, shift amounts identical)
//   S1  opcode/function identity per word, registers abstracted by
//       first-occurrence renaming (consistent renaming within the function)
//   S0  opcode/function identity per word only
//
// Writes build/template-reuse/skeleton-census.json.

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { loadWorkbenchModel } = require('../../lib/matching/target_model');

const ROOT = path.resolve(__dirname, '../../..');
const OUT = path.join(ROOT, 'build', 'template-reuse', 'skeleton-census.json');

function words(buf) { const o = []; for (let i = 0; i + 4 <= buf.length; i += 4) o.push(buf.readUInt32BE(i)); return o; }

function opKey(w) {
  const op = w >>> 26;
  if (op === 0) return `R${w & 63}`;
  if (op === 1) return `B${(w >>> 16) & 31}`;
  if (op === 0x11 || op === 0x10) return `C${op}.${(w >>> 21) & 31}.${w & 63}`;
  return `O${op}`;
}

function immMask(w) {
  const op = w >>> 26;
  if (op === 2 || op === 3) return 0xFC000000;
  if (op === 0) return 0xFFFFFFFF;
  if (op === 0x11) { const fmt = (w >>> 21) & 31; return fmt === 8 ? 0xFFFF0000 : 0xFFFFFFFF; }
  return 0xFFFF0000;
}

function regFields(w) {
  const op = w >>> 26;
  if (op === 0) return [(w >>> 21) & 31, (w >>> 16) & 31, (w >>> 11) & 31];
  if (op === 2 || op === 3) return [];
  if (op === 1) return [(w >>> 21) & 31];
  if (op === 0x11) return [(w >>> 16) & 31, (w >>> 11) & 31, (w >>> 6) & 31].map((r) => 32 + r);
  return [(w >>> 21) & 31, (w >>> 16) & 31];
}

const hash = (s) => crypto.createHash('sha1').update(s).digest('hex').slice(0, 16);

function skeletons(buf) {
  const ws = words(buf);
  const s0 = ws.map(opKey).join(' ');
  const s2 = ws.map((w) => ((w & immMask(w)) >>> 0).toString(16)).join(' ');
  const rename = new Map();
  const s1 = ws.map((w) => `${opKey(w)}:${regFields(w).map((r) => {
    if (r === 0 || r === 29 || r === 31) return `h${r}`; // $zero, $sp, $ra keep identity
    if (!rename.has(r)) rename.set(r, rename.size);
    return rename.get(r);
  }).join(',')}`).join(' ');
  return { n: ws.length, s0: hash(s0), s1: hash(s1), s2: hash(s2) };
}

function main() {
  const workbench = loadWorkbenchModel();
  const rows = [];
  for (const t of workbench.targets) {
    if (!t.expectedBytes || t.expectedBytes.length < 8) continue;
    rows.push({ symbol: t.symbol, bytes: t.bytes, solved: !!t.activeMatchingSource, scratch: t.scratchCompilation, ...skeletons(t.expectedBytes) });
  }
  const index = { s0: new Map(), s1: new Map(), s2: new Map() };
  for (const r of rows) for (const k of ['s0', 's1', 's2']) {
    if (!index[k].has(r[k])) index[k].set(r[k], []);
    index[k].get(r[k]).push(r);
  }
  const solved = rows.filter((r) => r.solved);
  const unsolved = rows.filter((r) => !r.solved);
  const summary = { targets: rows.length, solved: solved.length, unsolved: unsolved.length };
  const pairs = {};
  for (const k of ['s2', 's1', 's0']) {
    const hit = unsolved.filter((r) => index[k].get(r[k]).some((o) => o.solved));
    summary[`unsolvedWithSolvedTwin_${k}`] = hit.length;
    summary[`unsolvedWithSolvedTwin_${k}_bytes`] = hit.reduce((s, r) => s + r.bytes, 0);
    const bands = { '<=64': 0, '<=256': 0, '<=1024': 0, '>1024': 0 };
    for (const r of hit) bands[r.bytes <= 64 ? '<=64' : r.bytes <= 256 ? '<=256' : r.bytes <= 1024 ? '<=1024' : '>1024']++;
    summary[`bands_${k}`] = bands;
    pairs[k] = hit.map((r) => ({ symbol: r.symbol, bytes: r.bytes, twins: index[k].get(r[k]).filter((o) => o.solved).map((o) => o.symbol).slice(0, 5) }));
    // clusters of unsolved-only duplicates (solve one, get the rest)
    const groups = [...index[k].values()].filter((g) => g.length > 1 && g.every((o) => !o.solved));
    summary[`unsolvedOnlyClusters_${k}`] = groups.length;
    summary[`unsolvedInThoseClusters_${k}`] = groups.reduce((s, g) => s + g.length, 0);
    summary[`largestUnsolvedClusters_${k}`] = groups.sort((a, b) => b.length - a.length).slice(0, 8)
      .map((g) => ({ size: g.length, bytes: g[0].bytes, example: g[0].symbol }));
  }
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify({ summary, pairs }, null, 2));
  console.log(JSON.stringify(summary, null, 2));
}

main();
