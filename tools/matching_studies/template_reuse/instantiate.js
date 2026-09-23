#!/usr/bin/env node
'use strict';

// Template-reuse instantiation pilot (research only; scratch compiles only).
//
//   node instantiate.js [--max 10]
//
// Takes pairs from build/template-reuse/pairs.json that are fully explained
// (PURE_C standalone donor, scratch-eligible target, zero unresolved
// differences), writes an ordinary-C candidate by renaming the donor function
// to the target symbol and applying the recorded symbol substitutions, then
// compiles donor and candidate with the unmodified pinned compiler.
//
// Gate G1 (all must hold):
//   policy     candidate classifies PURE_C (source-policy tool)
//   object     candidate scratch object text == donor scratch object text
//   relocs     candidate relocation records == donor records with symbols
//              mapped through {donor -> target, substitutions}
//   link       simulated placement at the target entry VRAM with registry
//              addresses reproduces every retail word (unregistered data
//              symbols fail closed: G1-pending-registration)
//   explained  pair analysis: every retail donor/target difference is an
//              internal jump with equal function-relative destination, or an
//              address remap resolved to the substituted symbol
// Masked retail compatibility is reported as a weak diagnostic only.  No
// production file is written and nothing is activated; canonical diff.js /
// verify.js acceptance requires a separate, authorized activation.

const fs = require('fs');
const path = require('path');
const { context, compile } = require('../regalloc_oracle/oracle_lib');
const { maskedEqual, relocationKey } = require('../regalloc_oracle/analyze');
const { classifySource } = require('../../lib/source_policy');

const ROOT = path.resolve(__dirname, '../../..');
const OUT_DIR = path.join(ROOT, 'build', 'template-reuse');
const CAND_DIR = path.join(OUT_DIR, 'candidates');

// Independent, placement-qualified address check (link_check.js): place the
// candidate at the target's entry VRAM and apply its relocations with
// authenticated addresses only; every retail word must match.
const { linkCheck, overlayRanges, makeResolver } = require('./link_check');
function simulatedLink(cand, targetT, workbench, registryEntries) {
  const words = []; for (let i = 0; i < cand.actual.length; i += 4) words.push(cand.actual.readUInt32BE(i));
  const expectedWords = []; for (let i = 0; i < targetT.expectedBytes.length; i += 4) expectedWords.push(targetT.expectedBytes.readUInt32BE(i));
  return linkCheck({
    words, relocations: cand.relocations, expectedWords, entryVram: targetT.entryVram >>> 0,
    target: { placementKind: targetT.placementKind, overlayDescriptorId: targetT.overlayDescriptorId, loadSlabId: targetT.loadSlabId },
    resolve: makeResolver(registryEntries, workbench.targets), overlays: overlayRanges(workbench.model),
  });
}

const renameIdent = (text, from, to) => text.replace(new RegExp(`\\b${from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g'), to);

function main() {
  const max = process.argv.includes('--max') ? Number(process.argv[process.argv.indexOf('--max') + 1]) : 10;
  const data = JSON.parse(fs.readFileSync(path.join(OUT_DIR, 'pairs.json'), 'utf8'));
  const { session, workbench } = context();
  const registry = JSON.parse(fs.readFileSync(path.join(ROOT, 'config', 'matching-c-linkage.json'), 'utf8')).symbols;
  fs.mkdirSync(CAND_DIR, { recursive: true });
  const eligible = data.pairs.filter((p) => p.donorClass === 'PURE_C' && p.targetScratchEligible
    && Array.isArray(p.diffWords) && !(p.unresolved || []).length);
  const donorCache = new Map();
  const results = [];
  for (const p of eligible.slice(0, max)) {
    const row = { target: p.target, donor: p.donor, bytes: p.targetBytes, substitutions: p.substitutions };
    try {
      const map = new Map([[p.donor, p.target], ...(p.substitutions || []).map((s) => [s.from, s.to])]);
      let text = fs.readFileSync(path.join(ROOT, p.donorSource), 'utf8');
      for (const [from, to] of map) text = renameIdent(text, from, to);
      const header = `/* template-reuse scratch candidate: ${p.target} instantiated from ${p.donor} (${p.donorSource}). Research only. */\n`;
      const file = path.join(CAND_DIR, `${p.target}.c`);
      fs.writeFileSync(file, header + text);
      row.candidate = path.relative(ROOT, file).replace(/\\/g, '/');
      row.policy = classifySource(row.candidate, { preprocessor: session.preprocessor }).class;
      if (!donorCache.has(p.donor)) donorCache.set(p.donor, compile(p.donor, p.donorSource, { tag: 'donor' }));
      const donor = donorCache.get(p.donor);
      const cand = compile(p.target, row.candidate, { tag: 'candidate' });
      row.objectIdentical = cand.actual.equals(donor.actual);
      const mapSym = (r) => ({ ...r, symbol: map.get(r.symbol) || r.symbol });
      const a = donor.relocations.map((r) => relocationKey(mapSym(r))).sort();
      const b = cand.relocations.map(relocationKey).sort();
      row.relocationsIdentical = a.length === b.length && a.every((k, i) => k === b[i]);
      row.relocations = cand.relocations.length;
      row.explained = true;
      row.maskedRetail = maskedEqual(cand.expected, cand.actual, cand.relocations);
      const link = simulatedLink(cand, workbench.bySymbol.get(p.target.toLowerCase()), workbench, registry);
      row.simulatedLink = link;
      row.unregisteredSymbols = (p.substitutions || []).filter((s) => s.registered === false).map((s) => s.to);
      row.G1 = row.policy === 'PURE_C' && row.objectIdentical && row.relocationsIdentical && row.explained && link.equal;
      if (!row.G1) {
        // Registration alone clears a candidate only when every other link problem is an unregistered symbol.
        const others = (link.problems || []).filter((m) => !row.unregisteredSymbols.some((s) => m.includes(s)));
        row.status = row.unregisteredSymbols.length && !others.length && !link.differingOffsets.length && row.objectIdentical && row.relocationsIdentical
          ? 'pending-registration' : 'unresolved-references';
      }
      // Adversarial control: a deliberately wrong substitution must fail the link check.
      const wrong = (p.substitutions || [])[0];
      if (wrong) {
        const bogus = { ...cand, relocations: cand.relocations.map((r) => (r.symbol === wrong.to ? { ...r, symbol: 'D_80000000' } : r)) };
        row.adversarialWrongSymbolRejected = !simulatedLink(bogus, workbench.bySymbol.get(p.target.toLowerCase()), workbench, registry).equal;
      }
    } catch (error) {
      row.error = String(error.message).split('\n')[0].slice(0, 300);
      row.G1 = false;
    }
    results.push(row);
    process.stderr.write(`${row.target} (${row.bytes} B) <- ${row.donor}: G1=${row.G1} policy=${row.policy} object=${row.objectIdentical} relocs=${row.relocationsIdentical} masked=${row.maskedRetail} link=${row.simulatedLink && row.simulatedLink.equal} adv=${row.adversarialWrongSymbolRejected}${row.error ? ` ERROR ${row.error}` : ''}\n`);
  }
  const excluded = data.pairs.filter((p) => !eligible.includes(p)).map((p) => ({
    target: p.target, donor: p.donor, donorClass: p.donorClass, eligible: p.targetScratchEligible,
    reasons: [...(p.donorClass !== 'PURE_C' ? [`donor ${p.donorClass}`] : []), ...(!p.targetScratchEligible ? [`target not scratch-eligible (${p.targetExclusion || 'unknown'})`] : []), ...(p.unresolved || [])],
  }));
  const summary = {
    attempted: results.length,
    passedG1: results.filter((r) => r.G1).length,
    passedG1Bytes: results.filter((r) => r.G1).reduce((s, r) => s + r.bytes, 0),
    excluded: excluded.length,
  };
  fs.writeFileSync(path.join(OUT_DIR, 'instantiation-results.json'), JSON.stringify({ schemaVersion: 1, generatedAt: new Date().toISOString(), summary, results, excluded }, null, 2));
  console.log(JSON.stringify(summary, null, 2));
}

if (require.main === module) main();

module.exports = { simulatedLink };
