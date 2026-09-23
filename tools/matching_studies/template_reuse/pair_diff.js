#!/usr/bin/env node
'use strict';

// Template-reuse pair analysis (research only; scratch compiles only).
//
//   node pair_diff.js [--level S2] [--limit N]
//
// For each unsolved target with an S2 skeleton twin that has an active source,
// compile the donor source with the pinned compiler (scratch) to learn which
// words carry relocations, then classify every retail word that differs
// between donor and target:
//   internal-jump   R_MIPS_26 against .text (function-relative; links alike)
//   address-remap   donor word carries an external relocation; the target's
//                   retail word decodes to an address resolved (fail-closed)
//                   through the accepted registry / same-placement functions
//   literal         no donor relocation: a constant or offset differs and
//                   needs an evidence-backed source substitution
// Output: build/template-reuse/pairs.json (contract schemaVersion 1).

const fs = require('fs');
const path = require('path');
const { context, compile, words } = require('../regalloc_oracle/oracle_lib');
const { classifySource } = require('../../lib/source_policy');

const ROOT = path.resolve(__dirname, '../../..');
const OUT_DIR = path.join(ROOT, 'build', 'template-reuse');
const CENSUS = path.join(OUT_DIR, 'skeleton-census.json');
const LINKAGE = path.join(ROOT, 'config', 'matching-c-linkage.json');

const hex = (n) => `0x${(n >>> 0).toString(16).toUpperCase().padStart(8, '0')}`;
const signExt16 = (v) => (v & 0x8000 ? v - 0x10000 : v);

function relocOffset(r) { return typeof r.offset === 'string' ? Number.parseInt(r.offset, 16) : r.offset; }

function registry(workbench) {
  const data = new Map();
  for (const s of JSON.parse(fs.readFileSync(LINKAGE, 'utf8')).symbols) data.set(Number.parseInt(s.address, 16) >>> 0, s.name);
  const byName = new Map([...data.entries()].map(([a, n]) => [n, a]));
  return { data, byName, functions: workbench.targets };
}

// Function symbols whose entry VRAM equals `vram`, restricted to targets that
// share the caller's overlay descriptor or are not overlay-placed.
function resolveFunction(reg, vram, caller) {
  const hits = reg.functions.filter((t) => (t.entryVram >>> 0) === (vram >>> 0)
    && (t.placementKind !== 'overlay' || t.overlayDescriptorId === caller.overlayDescriptorId));
  return hits.length === 1 ? hits[0].symbol : null;
}

function classifyPair(pair, reg, donorT, targetT, donorCompile) {
  const d = words(donorT.expectedBytes); const t = words(targetT.expectedBytes);
  const relocs = new Map();
  for (const r of donorCompile.relocations) relocs.set(relocOffset(r) / 4, r);
  const diffWords = []; const substitutions = []; const unresolved = [];
  const hiPending = new Map(); // symbol -> { index, targetHi, donorHi }
  const addSub = (s) => { if (!substitutions.some((x) => x.kind === s.kind && x.from === s.from)) substitutions.push(s); else if (!substitutions.some((x) => x.from === s.from && x.to === s.to)) unresolved.push(`conflicting substitution for ${s.from}`); };
  for (let i = 0; i < d.length; i++) {
    const r = relocs.get(i);
    // HI16 words are remembered even when equal: the LO16 partner decides.
    if (r && r.type === 'R_MIPS_HI16') hiPending.set(r.symbol, { index: i, donorHi: d[i] & 0xFFFF, targetHi: t[i] & 0xFFFF });
    if (d[i] === t[i] && !(r && r.type === 'R_MIPS_LO16')) continue;
    const entry = { offset: i * 4, retailTarget: hex(t[i]), retailDonor: hex(d[i]) };
    const op = d[i] >>> 26;
    entry.field = op === 2 || op === 3 ? 'jump26' : 'imm16';
    if (r) {
      entry.donorReloc = { type: r.type, symbol: r.symbol };
      if (r.type === 'R_MIPS_26' && r.symbol === '.text') {
        // CFG guard: the jump must land at the same function-relative offset.
        entry.kind = 'internal-jump';
        const dest = (w, base) => ((((base & 0xF0000000) | ((w & 0x03FFFFFF) << 2)) >>> 0) - (base >>> 0));
        entry.donorRel = dest(d[i], donorT.entryVram); entry.targetRel = dest(t[i], targetT.entryVram);
        if (entry.donorRel !== entry.targetRel) unresolved.push(`internal jump at +0x${(i * 4).toString(16)} lands at +0x${entry.targetRel.toString(16)} vs donor +0x${entry.donorRel.toString(16)}`);
      }
      else if (r.type === 'R_MIPS_26') {
        entry.kind = 'address-remap';
        const vram = ((targetT.entryVram & 0xF0000000) | ((t[i] & 0x03FFFFFF) << 2)) >>> 0;
        const sym = resolveFunction(reg, vram, targetT);
        if (sym) addSub({ kind: 'symbol', from: r.symbol, to: sym, evidence: `jal ${hex(vram)} at +0x${(i * 4).toString(16)}` });
        else unresolved.push(`call target ${hex(vram)} at +0x${(i * 4).toString(16)} does not resolve uniquely`);
      } else if (r.type === 'R_MIPS_LO16') {
        const hi = hiPending.get(r.symbol);
        if (!hi) { unresolved.push(`LO16 without HI16 for ${r.symbol}`); continue; }
        const donorAddr = ((hi.donorHi << 16) + signExt16(d[i] & 0xFFFF)) >>> 0;
        const targetAddr = ((hi.targetHi << 16) + signExt16(t[i] & 0xFFFF)) >>> 0;
        if (donorAddr === targetAddr) continue;
        entry.kind = 'address-remap';
        const base = reg.byName.get(r.symbol);
        const addend = base === undefined ? null : donorAddr - base;
        if (addend === null) { unresolved.push(`donor data symbol ${r.symbol} not in registry`); }
        else {
          const targetBase = (targetAddr - addend) >>> 0;
          const name = reg.data.get(targetBase) || `D_${targetBase.toString(16).toUpperCase().padStart(8, '0')}`;
          addSub({ kind: 'symbol', from: r.symbol, to: name, evidence: `HI16/LO16 ${hex(targetAddr)} (addend ${addend})`, registered: reg.data.has(targetBase) });
        }
      } else if (r.type === 'R_MIPS_HI16') { continue; }
      else { entry.kind = 'unsupported-reloc'; unresolved.push(`unsupported relocation ${r.type}`); }
    } else {
      entry.kind = 'literal';
      unresolved.push(`literal difference at +0x${(i * 4).toString(16)}: ${hex(d[i] & 0xFFFF)} -> ${hex(t[i] & 0xFFFF)}`);
    }
    diffWords.push(entry);
  }
  return { diffWords, substitutions, unresolved };
}

function main() {
  const args = process.argv.slice(2);
  const level = args.includes('--level') ? args[args.indexOf('--level') + 1] : 'S2';
  const limit = args.includes('--limit') ? Number(args[args.indexOf('--limit') + 1]) : Infinity;
  const census = JSON.parse(fs.readFileSync(CENSUS, 'utf8'));
  const { session, workbench } = context();
  const reg = registry(workbench);
  const pairs = [];
  for (const p of census.pairs[level.toLowerCase()].slice(0, limit)) {
    const targetT = workbench.bySymbol.get(p.symbol.toLowerCase());
    const donorSymbol = p.twins[0];
    const donorT = workbench.bySymbol.get(donorSymbol.toLowerCase());
    const rec = {
      target: targetT.symbol, targetBytes: targetT.bytes,
      targetScratchEligible: !!targetT.scratchCompilation?.supported,
      targetExclusion: targetT.scratchCompilation?.supported ? undefined : targetT.scratchCompilation?.reason || targetT.placementKind,
      donor: donorT.symbol, donorSource: donorT.activeMatchingSource, level,
    };
    try {
      rec.donorClass = classifySource(donorT.activeMatchingSource, { preprocessor: session.preprocessor }).class;
    } catch (error) { rec.donorClass = 'UNKNOWN'; rec.donorClassError = String(error.message).slice(0, 200); }
    if (!donorT.activeMatchingSource || donorT.activeMatchingProducer?.kind !== 'standalone') {
      rec.unresolved = [`donor producer ${donorT.activeMatchingProducer?.kind || 'none'} (only standalone sources are instantiated)`];
      pairs.push(rec); continue;
    }
    try {
      const donorCompile = compile(donorT.symbol, donorT.activeMatchingSource, { tag: 'donor' });
      Object.assign(rec, classifyPair(p, reg, donorT, targetT, donorCompile));
      rec.donorRelocations = donorCompile.relocations.length;
    } catch (error) {
      rec.unresolved = [`donor scratch compile failed: ${String(error.message).split('\n')[0].slice(0, 200)}`];
    }
    pairs.push(rec);
    process.stderr.write(`${rec.target} <- ${rec.donor} [${rec.donorClass}] diff=${(rec.diffWords || []).length} subs=${(rec.substitutions || []).length} unresolved=${(rec.unresolved || []).length}\n`);
  }
  const out = {
    schemaVersion: 1, modelId: workbench.modelId, generatedAt: new Date().toISOString(),
    skeletonLevels: {
      S2: 'words equal after masking imm16 (I-type), jump26 (J-type), fmt-8 cop1 branch imm16; R-type fully compared',
      S1: 'per-word opKey + registers by first-occurrence renaming ($zero,$sp,$ra fixed)',
      S0: 'per-word opKey only',
    },
    pairs,
  };
  fs.writeFileSync(path.join(OUT_DIR, 'pairs.json'), JSON.stringify(out, null, 2));
  console.log(JSON.stringify({ pairs: pairs.length, out: path.join(OUT_DIR, 'pairs.json') }));
}

if (require.main === module) main();

module.exports = { resolveFunction, registry, classifyPair };
