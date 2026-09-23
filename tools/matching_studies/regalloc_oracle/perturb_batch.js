#!/usr/bin/env node
'use strict';

// Blind perturbation batch (research only).
//
//   node perturb_batch.js <symbol> <exact-source.c> [--stmt] [--max N]
//
// Default mode swaps two simple local declarations at the top of the body.
// --stmt swaps adjacent simple statements with no textual dependency.
// Variants whose pinned output keeps retail length but differs go through the
// forced-assignment check.  Variant sources are written under
// build/regalloc-oracle/src/<symbol>/; the perturbation is recorded only in
// the result file so later recovery scoring can hide it.

const fs = require('fs');
const path = require('path');
const { ORACLE_ROOT, ROOT, compile } = require('./oracle_lib');
const { check } = require('./force_check');

const DECL = /^(?:register\s+)?[A-Za-z_]\w*(?:\s+[A-Za-z_]\w*)*[\s*]+[A-Za-z_]\w*(?:\[[^\]]*\])?;$/;
const CONTROL = /^(return|if|else|while|for|do|switch|case|break|continue|goto)\b/;
const TYPE_WORD = /^(u8|u16|u32|s8|s16|s32|unsigned|signed|int|char|short|long|float|double)\b/;

function declarationLines(lines, symbol) {
  const open = lines.findIndex((l, i) => l.includes(`${symbol}(`) && !l.trim().endsWith(';')
    && lines.slice(i, i + 3).some((x) => x.includes('{')));
  if (open < 0) return [];
  const brace = lines.findIndex((l, i) => i >= open && l.includes('{'));
  const out = [];
  for (let i = brace + 1; i < lines.length; i++) {
    const t = lines[i].trim();
    if (!t) continue;
    if (DECL.test(t) && !/^return\b/.test(t)) out.push(i); else break;
  }
  return out;
}

// Assigned lvalue text of a simple statement, or null.
function lvalueOf(t) {
  const m = t.match(/^(.+?)\s*(?:[-+*/&|^]|<<|>>)?=(?!=)/);
  return m ? m[1].trim() : null;
}

function hasCall(t) {
  const re = /([A-Za-z_]\w*)\s*\(/g;
  let m;
  while ((m = re.exec(t))) {
    const after = t.slice(m.index + m[0].length);
    if (!TYPE_WORD.test(after.trim()) && !['sizeof'].includes(m[1])) return true;
  }
  return false;
}

function mentions(text, lv) {
  const escaped = lv.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(^|[^\\w>.])${escaped}(?!\\w)`).test(text);
}

// Sound swap subset (semantics-preserving by construction):
//   L: `local op= expr;`  local is a scalar declared at the top of the body;
//      expr has no calls, ++/--, or embedded assignment.
//   M: `base->field = rhs;` base is an identifier; rhs reads no memory
//      (only identifiers, constants and arithmetic).
// Allowed adjacent pairs: L+L, L+M where L's expr reads no memory, and M+M
// with the same base and different field names.  Neither statement may
// mention the other's lvalue.  Files using `volatile` or `union` are skipped
// entirely (M+M relies on distinct fields not overlapping).
const NO_SIDE_EFFECTS = (e) => !hasCall(e) && !/\+\+|--/.test(e) && !/[^=!<>]=(?!=)/.test(e);
const READS_MEMORY = (e) => /->|\[|\*\s*[A-Za-z_(]|\.\s*[A-Za-z_]/.test(e.replace(/\b\d+\.\d*|\.\d+/g, '0'));

function localNames(lines, decls) {
  const names = new Set();
  for (const i of decls) {
    const t = lines[i].trim();
    if (/\[|\bvolatile\b/.test(t)) continue;
    const m = t.match(/([A-Za-z_]\w*)\s*;$/);
    if (m) names.add(m[1]);
  }
  return names;
}

function classify(t, locals) {
  if (!/;$/.test(t) || CONTROL.test(t)) return null;
  const m = t.match(/^(.+?)\s*((?:[-+*/&|^]|<<|>>)?=)(?!=)\s*(.+);$/);
  if (!m) return null;
  const [, lhs, , rhs] = m;
  if (!NO_SIDE_EFFECTS(rhs)) return null;
  if (locals.has(lhs.trim())) return { kind: 'L', lhs: lhs.trim(), rhs, readsMemory: READS_MEMORY(rhs) };
  const f = lhs.trim().match(/^([A-Za-z_]\w*)->([A-Za-z_]\w*)$/);
  if (f && !READS_MEMORY(rhs)) return { kind: 'M', lhs: lhs.trim(), base: f[1], field: f[2], rhs };
  return null;
}

function statementPairs(lines, decls) {
  if (lines.some((l) => /\b(volatile|union)\b/.test(l))) return [];
  const start = decls.length ? decls[decls.length - 1] + 1 : 0;
  const locals = localNames(lines, decls);
  const pairs = [];
  for (let i = start; i + 1 < lines.length; i++) {
    const a = lines[i].trim(); const b = lines[i + 1].trim();
    const ca = classify(a, locals); const cb = classify(b, locals);
    if (!ca || !cb) continue;
    if (ca.lhs === cb.lhs || mentions(b, ca.lhs) || mentions(a, cb.lhs)) continue;
    const kinds = ca.kind + cb.kind;
    const ok = kinds === 'LL'
      || (kinds === 'LM' && !ca.readsMemory) || (kinds === 'ML' && !cb.readsMemory)
      || (kinds === 'MM' && ca.base === cb.base && ca.field !== cb.field);
    if (ok) pairs.push([i, i + 1]);
  }
  return pairs;
}

// `lhs = X op Y;` with a commutative op and simple operands -> `lhs = Y op X;`
// Operands: identifier, identifier->field, or integer constant.
const OPERAND = String.raw`[A-Za-z_]\w*(?:->\w+)?|0x[0-9A-Fa-f]+|\d+`;
const COMMUTE = new RegExp(String.raw`^(\s*[^=]*[^=!<>+\-*/&|^]=\s*)(${OPERAND})\s*([+*&|^])\s*(${OPERAND})\s*;(\s*)$`);
function commuteLines(lines, decls) {
  if (lines.some((l) => /\b(volatile|union)\b/.test(l))) return [];
  const start = decls.length ? decls[decls.length - 1] + 1 : 0;
  const out = [];
  for (let i = start; i < lines.length; i++) if (COMMUTE.test(lines[i]) && !CONTROL.test(lines[i].trim())) out.push(i);
  return out;
}

function runVariant(symbol, dir, name, lines, a, b, results, source) {
  const variant = lines.slice();
  if (b === null) variant[a] = lines[a].replace(COMMUTE, (m, lhs, x, op, y, tail) => `${lhs}${y} ${op} ${x};${tail}`);
  else [variant[a], variant[b]] = [variant[b], variant[a]];
  const file = path.join(dir, name);
  fs.writeFileSync(file, variant.join('\n'));
  // check() compiles with the pinned compiler and grades against the
  // accepted exact source (reference-identical object text + relocations).
  const row = { variant: name, swapped: b === null ? [lines[a].trim(), variant[a].trim()] : [lines[a].trim(), lines[b].trim()] };
  Object.assign(row, check(symbol, file, { reference: source }));
  row.exact = row.verdict === 'already-exact';
  results.push(row);
  process.stderr.write(`${name}: ${row.exact ? 'exact' : row.verdict || (row.sameLength ? '?' : 'extent-differs')}\n`);
}

function main() {
  const [symbol, source] = process.argv.slice(2);
  const maxIndex = process.argv.indexOf('--max');
  const max = maxIndex > 0 ? Number(process.argv[maxIndex + 1]) : 40;
  const stmtMode = process.argv.includes('--stmt');
  const commuteMode = process.argv.includes('--commute');
  const modeName = commuteMode ? 'commute' : stmtMode ? 'stmt' : 'decl';
  const lines = fs.readFileSync(path.resolve(ROOT, source), 'utf8').split('\n');
  const decls = declarationLines(lines, symbol);
  const dir = path.join(ORACLE_ROOT, 'src', symbol);
  fs.mkdirSync(dir, { recursive: true });
  const results = [];
  const pairs = commuteMode
    ? commuteLines(lines, decls).map((a) => [`commute-${a}.c`, a, null])
    : stmtMode
    ? statementPairs(lines, decls).map(([a, b]) => [`stmt-${a}-${b}.c`, a, b])
    : decls.flatMap((a, i) => decls.slice(i + 1).map((b, j) => [`swap-${i}-${i + 1 + j}.c`, a, b]));
  for (const [name, a, b] of pairs.slice(0, max)) runVariant(symbol, dir, name, lines, a, b, results, source);
  const outFile = path.join(ORACLE_ROOT, 'results', `${symbol}-${modeName}.json`);
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, JSON.stringify({ symbol, source, mode: modeName, results }, null, 2));
  const summary = {};
  for (const r of results) { const k = r.exact ? 'still-exact' : (r.verdict || 'extent-differs'); summary[k] = (summary[k] || 0) + 1; }
  console.log(JSON.stringify({ symbol, tried: results.length, summary, outFile }, null, 2));
}

if (require.main === module) main();

module.exports = { statementPairs, commuteLines, declarationLines, COMMUTE };
