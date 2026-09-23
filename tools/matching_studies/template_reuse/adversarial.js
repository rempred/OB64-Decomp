#!/usr/bin/env node
'use strict';

// Adversarial controls for the template-reuse G1 link gate (research only).
//
//   node adversarial.js
//
// For each candidate in build/template-reuse/instantiation-results.json that
// passed G1, recompile it (pinned compiler, scratch) and confirm the link gate
// REJECTS each applicable mutation:
//   call-destination   an external R_MIPS_26 relocation retargeted to a
//                      different accepted function
//   branch-offset      a PC-relative branch immediate changed by one word
//   internal-jump      a .text R_MIPS_26 in-place target moved by one word
//   data-addend        a LO16 in-place addend changed by 4
// and that pair_diff's placement-qualified resolver REJECTS a call target
// whose only resolution is a same-VRAM function in a different overlay.
// The masked retail comparison is recorded for each mutation to show which
// ones it would (wrongly) admit.

const fs = require('fs');
const path = require('path');
const { context, compile } = require('../regalloc_oracle/oracle_lib');
const { maskedEqual } = require('../regalloc_oracle/analyze');
const { simulatedLink } = require('./instantiate');
const { resolveFunction, registry: pairRegistry } = require('./pair_diff');

const ROOT = path.resolve(__dirname, '../../..');
const OUT_DIR = path.join(ROOT, 'build', 'template-reuse');

const offsetOf = (r) => (typeof r.offset === 'string' ? Number.parseInt(r.offset, 16) : r.offset);
function withWord(buf, index, fn) { const b = Buffer.from(buf); b.writeUInt32BE(fn(b.readUInt32BE(index * 4)) >>> 0, index * 4); return b; }
const isBranch = (w) => { const op = w >>> 26; return op === 1 || (op >= 4 && op <= 7) || (op >= 20 && op <= 23); };

function main() {
  const { workbench } = context();
  const registry = JSON.parse(fs.readFileSync(path.join(ROOT, 'config', 'matching-c-linkage.json'), 'utf8')).symbols;
  const inst = JSON.parse(fs.readFileSync(path.join(OUT_DIR, 'instantiation-results.json'), 'utf8'));
  const rows = [];
  for (const r of inst.results.filter((x) => x.G1)) {
    const targetT = workbench.bySymbol.get(r.target.toLowerCase());
    const cand = compile(r.target, r.candidate, { tag: 'candidate' });
    const base = simulatedLink(cand, targetT, workbench, registry);
    const tests = [];
    const run = (name, mutated) => {
      const link = simulatedLink(mutated, targetT, workbench, registry);
      tests.push({ name, rejected: !link.equal, maskedWouldAdmit: maskedEqual(targetT.expectedBytes, mutated.actual, mutated.relocations) });
    };
    const ext = cand.relocations.find((x) => x.type === 'R_MIPS_26' && x.symbol !== '.text');
    if (ext) {
      const other = workbench.targets.find((t) => t.symbol !== ext.symbol && (t.entryVram >>> 0) !== (workbench.bySymbol.get(ext.symbol.toLowerCase())?.entryVram >>> 0));
      run('call-destination', { ...cand, relocations: cand.relocations.map((x) => (x === ext ? { ...x, symbol: other.symbol } : x)) });
    }
    const words = []; for (let i = 0; i < cand.actual.length; i += 4) words.push(cand.actual.readUInt32BE(i));
    const relocated = new Set(cand.relocations.map((x) => offsetOf(x) / 4));
    const br = words.findIndex((w, i) => isBranch(w) && !relocated.has(i));
    if (br >= 0) run('branch-offset', { ...cand, actual: withWord(cand.actual, br, (w) => (w & 0xFFFF0000) | ((w + 1) & 0xFFFF)) });
    const ij = cand.relocations.find((x) => x.type === 'R_MIPS_26' && x.symbol === '.text');
    if (ij) run('internal-jump', { ...cand, actual: withWord(cand.actual, offsetOf(ij) / 4, (w) => (w & 0xFC000000) | ((w + 1) & 0x03FFFFFF)) });
    const lo = cand.relocations.find((x) => x.type === 'R_MIPS_LO16');
    if (lo) run('data-addend', { ...cand, actual: withWord(cand.actual, offsetOf(lo) / 4, (w) => (w & 0xFFFF0000) | ((w + 4) & 0xFFFF)) });
    rows.push({ target: r.target, baselineLinkEqual: base.equal, tests });
    process.stderr.write(`${r.target}: baseline=${base.equal} ${tests.map((t) => `${t.name}:${t.rejected ? 'rejected' : 'ADMITTED'}${t.maskedWouldAdmit ? '(masked admits)' : ''}`).join(' ')}\n`);
  }
  // Cross-overlay resolution control: find an entry VRAM shared by functions
  // in two different overlays; a caller in a third placement must not resolve.
  const reg = pairRegistry(workbench);
  const byVram = new Map();
  for (const t of workbench.targets.filter((x) => x.placementKind === 'overlay')) {
    const k = t.entryVram >>> 0; if (!byVram.has(k)) byVram.set(k, []); byVram.get(k).push(t);
  }
  const shared = [...byVram.values()].find((g) => new Set(g.map((t) => t.overlayDescriptorId)).size >= 2);
  let overlayControl = null;
  if (shared) {
    const [a, b] = shared;
    const outsider = workbench.targets.find((t) => t.placementKind === 'overlay' && !shared.some((s) => s.overlayDescriptorId === t.overlayDescriptorId));
    overlayControl = {
      vram: `0x${(a.entryVram >>> 0).toString(16)}`, candidates: shared.map((t) => `${t.symbol}@${t.overlayDescriptorId}`),
      fromOverlayA: resolveFunction(reg, a.entryVram, a), fromOverlayB: resolveFunction(reg, b.entryVram, b),
      fromUnrelatedOverlay: resolveFunction(reg, a.entryVram, outsider),
    };
    overlayControl.rejectedWhenUnqualified = overlayControl.fromUnrelatedOverlay === null;
    overlayControl.qualifiedResolvesToOwnOverlay = overlayControl.fromOverlayA === a.symbol && overlayControl.fromOverlayB === b.symbol;
  }
  const all = rows.flatMap((r) => r.tests);
  const summary = {
    candidates: rows.length, mutations: all.length,
    rejected: all.filter((t) => t.rejected).length,
    maskedWouldAdmit: all.filter((t) => t.maskedWouldAdmit).length,
    baselinesEqual: rows.every((r) => r.baselineLinkEqual),
    overlayControl,
  };
  fs.writeFileSync(path.join(OUT_DIR, 'adversarial-results.json'), JSON.stringify({ schemaVersion: 1, generatedAt: new Date().toISOString(), summary, rows }, null, 2));
  console.log(JSON.stringify(summary, null, 2));
}

main();
