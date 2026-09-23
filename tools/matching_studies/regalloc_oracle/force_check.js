#!/usr/bin/env node
'use strict';

// Forced-assignment check (research only).
//
//   node force_check.js <symbol> <source.c> [--reference <accepted-exact.c>]
//
// 1. pinned cc1: compare the source with the reference / retail.
// 2. oracle cc1 with UID annotation + trace: attribute each register-field
//    difference to a pre-reload pseudo (a proposal, not evidence).
// 3. force exactly those pseudos to the retail hard registers immediately
//    before reload and compile again.
//
// Verdicts are graded:
//   reference-identical  forced scratch object text AND relocation records
//                        equal those of the accepted exact source compiled
//                        the same way (strong; only with --reference)
//   masked-compatible    retail bytes equal with relocated fields masked
//                        (weak: says nothing about callee/data/addend identity)
// A map derived with majority-resolved vote conflicts is labelled
// hypothesis-derived; the forced bytes remain the only verdict.  Success
// means the residual is reachable by allocation alone in this pipeline; it
// says nothing yet about source realizability.

const fs = require('fs');
const path = require('path');
const { ORACLE_ROOT, compile, words } = require('./oracle_lib');
const { attribute, maskedEqual, referenceIdentical } = require('./analyze');

const referenceCache = new Map();
function referenceCompile(symbol, reference) {
  const key = `${symbol}|${reference}`;
  if (!referenceCache.has(key)) {
    const ref = compile(symbol, reference, { tag: 'reference' });
    ref.maskedCompatible = maskedEqual(ref.expected, ref.actual, ref.relocations);
    referenceCache.set(key, ref);
  }
  return referenceCache.get(key);
}

function check(symbol, source, options = {}) {
  const out = { symbol, source, reference: options.reference || null };
  const ref = options.reference ? referenceCompile(symbol, options.reference) : null;
  if (ref && !ref.maskedCompatible) { out.verdict = 'reference-not-retail-compatible'; return out; }
  const pinned = compile(symbol, source, {});
  out.pinnedMasked = maskedEqual(pinned.expected, pinned.actual, pinned.relocations);
  out.pinnedReferenceIdentical = ref ? referenceIdentical(ref, pinned) : null;
  out.sameLength = pinned.sameLength;
  if (!pinned.sameLength) { out.verdict = 'extent-differs'; return out; }
  if (ref ? out.pinnedReferenceIdentical : out.pinnedMasked) { out.verdict = 'already-exact'; return out; }
  const stamp = `${Date.now()}-${process.pid}`;
  const traceFile = path.join(ORACLE_ROOT, 'traces', `${symbol}-${stamp}.txt`);
  fs.mkdirSync(path.dirname(traceFile), { recursive: true });
  const traced = compile(symbol, source, { oracle: true, env: { OB64_RA_DP: '1', OB64_RA_TRACE: traceFile }, tag: 'trace' });
  const analysis = attribute(traced, traceFile);
  if (!analysis.ok) { out.verdict = `mapping-failed: ${analysis.reason}`; return out; }
  Object.assign(out, {
    traceFile,
    words: analysis.words,
    structuralWords: analysis.structuralWords,
    registerDiffWords: analysis.registerDiffWords,
    unattributed: analysis.unattributed.length,
    conflicts: analysis.conflicts,
    resolvedConflicts: analysis.resolved,
    mapping: analysis.mapping,
    assignment: analysis.assignment,
    mapKind: analysis.resolved.length ? 'hypothesis-derived (majority-resolved conflicts)' : 'consistent',
  });
  if (analysis.structuralWords) { out.verdict = 'structural-residual'; return out; }
  if (analysis.conflicts.length) { out.verdict = 'not-a-pure-renaming'; return out; }
  if (!analysis.assignment.length) { out.verdict = 'no-attributable-renaming'; return out; }
  const forceFile = path.join(ORACLE_ROOT, 'traces', `${symbol}-${stamp}.force`);
  fs.writeFileSync(forceFile, analysis.assignment.map((a) => `${symbol} ${a.pseudo} ${a.to}\n`).join(''));
  const forced = compile(symbol, source, { oracle: true, env: { OB64_RA_FORCE: forceFile }, tag: 'force' });
  out.forceFile = forceFile;
  out.forcedMasked = maskedEqual(forced.expected, forced.actual, forced.relocations);
  out.forcedReferenceIdentical = ref ? referenceIdentical(ref, forced) : null;
  if (ref ? out.forcedReferenceIdentical : out.forcedMasked) {
    out.verdict = ref ? 'allocation-only: forced map is reference-identical'
      : 'allocation-only (weak): forced map is masked-compatible with retail';
  } else {
    out.verdict = 'forced assignment still differs';
    if (forced.sameLength) {
      const e = words(ref ? ref.actual : forced.expected); const a = words(forced.actual);
      out.forcedDiffWords = e.filter((w, i) => w !== a[i]).length;
    }
  }
  return out;
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const refIndex = args.indexOf('--reference');
  const reference = refIndex >= 0 ? args[refIndex + 1] : undefined;
  const [symbol, source] = args.filter((a, i) => refIndex < 0 || (i !== refIndex && i !== refIndex + 1));
  console.log(JSON.stringify(check(symbol, source, { reference }), null, 2));
}

module.exports = { check };
