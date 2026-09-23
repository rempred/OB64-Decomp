'use strict';

// Retail-register attribution for the research-only allocation oracle.
//
// Given an oracle compile made with OB64_RA_DP=1 and OB64_RA_TRACE, map every
// object word to its assembly line and GCC insn UID, compare register fields
// with retail, attribute each field to the pre-reload pseudo occupying that
// hard register in that insn, and derive a pseudo -> retail hard register
// map.  A pseudo with contradictory votes is reported, never forced.

const childProcess = require('child_process');
const fs = require('fs');
const path = require('path');
const { parseElfFile, elfSectionBytes } = require('../../lib/phase7_conventional');
const { context, words } = require('./oracle_lib');

const MAP_PREFIX = 'ob64m_';

// ---- MIPS register-field decoding (GCC hard regnos: GPR 0-31, FPR 32-63) ----

function fields(w) {
  const op = w >>> 26;
  const rs = (w >>> 21) & 31;
  const rt = (w >>> 16) & 31;
  const rd = (w >>> 11) & 31;
  const sa = (w >>> 6) & 31;
  const out = [];
  const gpr = (name, v) => out.push({ name, reg: v });
  const fpr = (name, v) => out.push({ name, reg: 32 + v });
  let fixedMask; // bits that are not register fields and must match exactly
  if (op === 0) { gpr('rs', rs); gpr('rt', rt); gpr('rd', rd); fixedMask = 0xFC00003F | (31 << 6); }
  else if (op === 1) { gpr('rs', rs); fixedMask = 0xFC1FFFFF; }
  else if (op === 2 || op === 3) { fixedMask = 0xFC000000; }
  else if (op === 0x11) {
    const fmt = rs;
    if (fmt === 0 || fmt === 4 || fmt === 2 || fmt === 6) { // mfc1 cfc1 mtc1 ctc1
      gpr('rt', rt); if (fmt === 0 || fmt === 4) fpr('fs', rd); fixedMask = 0xFFE007FF;
      if (fmt === 2 || fmt === 6) fixedMask = 0xFFFFFFFF & ~(31 << 16);
    } else if (fmt === 8) { fixedMask = 0xFFFFFFFF; } // bc1x: offset handled by caller mask
    else { fpr('ft', rt); fpr('fs', rd); fpr('fd', sa); fixedMask = 0xFFE0003F; }
  } else if ([0x31, 0x35, 0x39, 0x3D].includes(op)) { gpr('rs', rs); fpr('ft', rt); fixedMask = 0xFC00FFFF; }
  else { gpr('rs', rs); gpr('rt', rt); fixedMask = 0xFC00FFFF; }
  return { out, fixedMask: fixedMask >>> 0 };
}

// Relocation field masks.  Fail closed: an unsupported relocation type makes
// the comparison fail instead of masking the whole word.
const RELOC_FIELD = { R_MIPS_26: 0x03FFFFFF, R_MIPS_HI16: 0xFFFF, R_MIPS_LO16: 0xFFFF };
function relocationMasks(relocations) {
  const masks = new Map();
  for (const r of relocations || []) {
    const offset = typeof r.offset === 'string' ? Number.parseInt(r.offset, 16) : r.offset;
    const m = RELOC_FIELD[r.type];
    if (m === undefined) return null;
    masks.set(offset / 4, (masks.get(offset / 4) || 0) | m);
  }
  return masks;
}

// Weak diagnostic only: retail bytes with relocated fields masked.  It does
// not establish callee/data identity or addends; never a success verdict.
function maskedEqual(expected, actual, relocations) {
  if (!expected || expected.length !== actual.length) return false;
  const masks = relocationMasks(relocations);
  if (!masks) return false;
  const e = words(expected); const a = words(actual);
  return e.every((w, i) => ((w ^ a[i]) & ~(masks.get(i) || 0)) === 0);
}

function relocationKey(r) {
  const offset = typeof r.offset === 'string' ? Number.parseInt(r.offset, 16) : r.offset;
  return `${offset}|${r.type}|${r.symbol}|${r.section || ''}|${r.addend ?? ''}`;
}

// Strong gate for known-exact controls: the candidate's scratch object text
// (including in-place REL addends in relocated fields) and its relocation
// records equal those of the accepted exact source compiled the same way,
// and that reference is itself masked-compatible with retail.
function referenceIdentical(reference, candidate) {
  if (!reference || !candidate || !reference.actual.equals(candidate.actual)) return false;
  const a = (reference.relocations || []).map(relocationKey).sort();
  const b = (candidate.relocations || []).map(relocationKey).sort();
  return a.length === b.length && a.every((k, i) => k === b[i]);
}

// ---- object word -> assembly line -> insn UID ----

function isInstructionLine(line) {
  const t = line.trim();
  return t && !t.startsWith('.') && !t.startsWith('#') && !/^[A-Za-z_.$][\w.$]*:/.test(t) && /^\t/.test(line);
}

function uidOf(line) {
  const m = line.match(/#\s+(\d+)\s+[A-Za-z_][\w]*(?:\/\d+)?\s*$/);
  return m ? Number(m[1]) : null;
}

// Words that may legitimately differ between the labelled noreorder mapping
// object and the real object: branch/jump offsets move when gas inserts nops.
function offsetMask(w) {
  const op = w >>> 26;
  if (op === 2 || op === 3) return 0x03FFFFFF;
  if (op === 1 || (op >= 4 && op <= 7) || (op >= 20 && op <= 23)) return 0xFFFF;
  if (op === 0x11 && ((w >>> 21) & 31) === 8) return 0xFFFF;
  return 0;
}
function sameInstruction(x, y) {
  const m = offsetMask(x) | offsetMask(y);
  return ((x ^ y) & ~m) === 0;
}

// Map every real object word to an assembly line.  Labels are inserted before
// each instruction line and the function is assembled in noreorder mode, so
// labels cannot perturb gas delay-slot filling; the per-line expansions are
// then aligned with the real (reorder-mode) object, which may contain
// gas-inserted nops and previous-instruction swaps into call delay slots.
function lineMap(compileResult) {
  const { oracleSession } = context();
  const text = fs.readFileSync(compileResult.adjustedAssembly, 'utf8');
  const lines = text.split(/\n/);
  const symbol = compileResult.symbol;
  const start = lines.findIndex((l) => l.trim() === `${symbol}:`);
  const end = lines.findIndex((l, i) => i > start && /^\.end\s/.test(l.trim()) && l.includes(symbol));
  if (start < 0 || end < 0) throw new Error('function body not found in adjusted assembly');
  const info = [];
  const out = [];
  lines.forEach((line, i) => {
    if (i > start && i < end && /^\s*\.set\s+reorder\s*$/.test(line)) { out.push('\t.set\tnoreorder'); return; }
    if (i > start && i < end && isInstructionLine(line)) {
      const k = info.length;
      out.push(`${MAP_PREFIX}${k}:`);
      info.push({ line: i + 1, text: line.trim(), uid: uidOf(line) });
      // three-operand mult/div are macros gas only accepts in reorder mode
      if (/^\s*(mult|multu|div|divu|rem|remu)\s+[^,]+,[^,]+,[^,#]+/.test(line)) {
        out.push('	.set	reorder', line, '	.set	noreorder');
        return;
      }
    }
    out.push(line);
    if (i === start) out.push('\t.set\tnoreorder');
  });
  const dir = compileResult.artifactDir;
  const mapAsm = path.join(dir, 'map.s');
  const mapObj = path.join(dir, 'map.o');
  fs.writeFileSync(mapAsm, out.join('\n'));
  const assembler = oracleSession.runtime.tools['mips-kmc-elf-as.exe'].path;
  const flags = oracleSession.context.phase8.model.config.binutils.compilerAssemblerFlags;
  const res = childProcess.spawnSync(assembler, [...flags, '-o', mapObj, mapAsm], { cwd: dir, encoding: 'utf8', windowsHide: true });
  if (res.status !== 0) return { ok: false, reason: `mapping assembly failed: ${res.stderr.trim().split('\n').slice(0, 3).join(' | ')}` };
  const mapElf = parseElfFile(mapObj);
  const mapFn = mapElf.symbols.find((s) => s.name === symbol);
  const mapWords = words(Buffer.from(elfSectionBytes(mapElf, mapElf.sections[mapFn.sectionIndex])));
  const labels = new Map(mapElf.symbols.filter((s) => s.name && s.name.startsWith(MAP_PREFIX))
    .map((s) => [Number(s.name.slice(MAP_PREFIX.length)), (s.value - mapFn.value) / 4]));
  // Each line spans up to the next line's label; the last line spans to the
  // function's mapping extent (.end sets the symbol size).
  const fnWords = (mapFn.size || mapWords.length * 4) / 4;
  const expansions = info.map((entry, k) => mapWords.slice(
    labels.get(k),
    k + 1 < info.length ? labels.get(k + 1) : Math.max(labels.get(k) + 1, fnWords),
  ));
  const real = words(compileResult.actual);
  const wordLine = new Array(real.length).fill(null);
  const matchAt = (j, exp) => exp.length > 0 && exp.every((w, t) => j + t < real.length && sameInstruction(real[j + t], w));
  let j = 0; let k = 0; let inserted = 0; let swaps = 0;
  while (j < real.length && k < info.length) {
    const exp = expansions[k];
    if (exp.length === 0) { k++; continue; }
    if (matchAt(j, exp)) { for (let t = 0; t < exp.length; t++) wordLine[j + t] = k; j += exp.length; k++; continue; }
    // gas moved the last word of this line's expansion into the delay slot
    // of the following single-word jump/branch: [E0..En-2, jump, En-1]
    const next = expansions[k + 1];
    const n = exp.length;
    if (next && next.length === 1 && matchAt(j, exp.slice(0, n - 1).concat(next)) && matchAt(j + n, [exp[n - 1]])) {
      for (let t = 0; t < n - 1; t++) wordLine[j + t] = k;
      wordLine[j + n - 1] = k + 1; wordLine[j + n] = k; j += n + 1; k += 2; swaps++; continue;
    }
    if (real[j] === 0) { j++; inserted++; continue; }
    return { ok: false, reason: `alignment failed at word ${j} line ${k} (${info[k].text})`, info };
  }
  while (j < real.length && real[j] === 0) { j++; inserted++; }
  if (j !== real.length || k < info.length && expansions.slice(k).some((e) => e.length)) {
    return { ok: false, reason: `alignment incomplete (word ${j}/${real.length}, line ${k}/${info.length})`, info };
  }
  return { ok: true, info, wordLine, inserted, swaps };
}

// ---- trace parsing ----

function parseTrace(file, symbol) {
  const pseudos = new Map(); const insns = new Map(); let header = null;
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const parts = line.split('|');
    if (parts[1] !== symbol) continue;
    if (parts[0] === 'F') header = line;
    else if (parts[0] === 'P') {
      const rec = { regno: Number(parts[2]) };
      for (const kv of parts.slice(3)) { const [k, v] = kv.split('='); rec[k] = /^-?\d+$/.test(v) ? Number(v) : v; }
      pseudos.set(rec.regno, rec);
    } else if (parts[0] === 'I') {
      insns.set(Number(parts[2]), parts[3] ? parts[3].split(',').map(Number) : []);
    }
  }
  if (!header) throw new Error(`no trace for ${symbol}`);
  return { header, pseudos, insns };
}

const MODE_REGS = { DI: 2, DF: 2, DC: 2 };
function occupies(p, hard) {
  if (p.hard < 0) return -1;
  const n = MODE_REGS[p.mode] || 1;
  return hard >= p.hard && hard < p.hard + n ? hard - p.hard : -1;
}

// ---- attribution ----

function attribute(compileResult, traceFile) {
  const map = lineMap(compileResult);
  if (!map.ok) return { ok: false, reason: map.reason };
  const trace = parseTrace(traceFile, compileResult.symbol);
  const e = words(compileResult.expected); const a = words(compileResult.actual);
  const masks = relocationMasks(compileResult.relocations);
  if (!masks) return { ok: false, reason: 'unsupported relocation type' };
  const votes = new Map(); // pseudo -> Map(retailHard -> count)
  const structural = []; const unattributed = []; let registerDiffWords = 0;
  const vote = (p, hard) => {
    if (!votes.has(p)) votes.set(p, new Map());
    const m = votes.get(p); m.set(hard, (m.get(hard) || 0) + 1);
  };
  for (let i = 0; i < a.length; i++) {
    const rm = masks.get(i) || 0;
    const ce = fields(e[i]); const ca = fields(a[i]);
    const fixed = (ca.fixedMask & ~rm) >>> 0;
    if (((e[i] ^ a[i]) & fixed) !== 0 || ce.out.length !== ca.out.length) {
      structural.push(i); continue;
    }
    const k = map.wordLine[i]; const uid = k == null ? null : map.info[k].uid;
    const candidates = uid == null ? [] : (trace.insns.get(uid) || []).map((r) => trace.pseudos.get(r)).filter(Boolean);
    let differs = false;
    ca.out.forEach((f, j) => {
      const retailReg = ce.out[j].reg;
      if (retailReg !== f.reg) differs = true;
      if (f.reg === 0) return; // $zero is never allocated
      const owners = candidates.filter((p) => occupies(p, f.reg) >= 0);
      if (owners.length === 1) {
        vote(owners[0].regno, retailReg - occupies(owners[0], f.reg));
      } else if (retailReg !== f.reg) {
        unattributed.push({ word: i, uid, field: f.name, candidate: f.reg, retail: retailReg, owners: owners.map((p) => p.regno) });
      }
    });
    if (differs) registerDiffWords++;
  }
  // A clear majority (>= 75% of at least 2 votes) is accepted and recorded as
  // a resolved conflict: swapped same-shape instructions masquerade as
  // renamings at a few words.  The forced compile's byte comparison remains
  // the only verdict, so a wrong majority cannot produce a false success.
  const assignment = []; const conflicts = []; const resolved = [];
  for (const [p, m] of votes) {
    const entries = [...m.entries()].sort((x, y) => y[1] - x[1]);
    const total = entries.reduce((s, e) => s + e[1], 0);
    const current = trace.pseudos.get(p).hard;
    let choice = entries[0][0];
    if (entries.length > 1) {
      if (entries[0][1] >= 2 && entries[0][1] / total >= 0.75) resolved.push({ pseudo: p, current, votes: Object.fromEntries(entries) });
      else { conflicts.push({ pseudo: p, current, votes: Object.fromEntries(entries) }); continue; }
    }
    if (choice !== current) assignment.push({ pseudo: p, from: current, to: choice, votes: entries[0][1] });
  }
  return {
    ok: true,
    words: a.length,
    structuralWords: structural.length,
    registerDiffWords,
    unattributed,
    conflicts,
    resolved,
    assignment,
    mapping: { inserted: map.inserted, swaps: map.swaps },
    trace,
  };
}

module.exports = { fields, maskedEqual, referenceIdentical, relocationKey, relocationMasks, lineMap, parseTrace, attribute };
