#!/usr/bin/env node
'use strict';
/*
 * decode_rodata_strings.js — decode a tracked Rev 0 rodata `.s` owner (or a byte
 * range of a chunk disasm) into NUL-delimited strings, byte-exactly, and emit a
 * machine-readable JSON index plus a human-readable Markdown export.
 *
 * It NEVER normalizes or strips control codes. Printable ASCII (0x20-0x7E) is
 * shown verbatim; NUL (0x00) is a string terminator; every other byte is shown as
 * an explicit \xHH escape. `@`-prefixed inline codes (e.g. @0 @1 @w @c @e) are
 * left in the decoded text and additionally tallied so a reader sees them without
 * the tool guessing their semantics.
 *
 * Usage:
 *   node tools/decode_rodata_strings.js --owner asm/original/rev0/lib/rodata_001006f0.s \
 *     --out-json docs/data-index/rev0/chunk15-opening-prologue-strings.json \
 *     --out-md data/decoded/rev0/dialogue/chunk15-opening-prologue.md \
 *     [--title "..."] [--min-run 1]
 *
 * The owner `.s` is parsed from its `/* ROM RAM WORD *\/ .word 0x...` lines; bytes
 * are taken in z64/big-endian word order (the on-ROM byte order). Alternatively
 * pass --disasm <chunk.s> --start <hex> --end <hex> to decode a sub-range.
 */
const fs = require('fs');
const path = require('path');

function parseArgs(argv) {
  const a = { minRun: 1 };
  for (let i = 2; i < argv.length; i++) {
    const k = argv[i];
    const v = argv[i + 1];
    if (k === '--owner') { a.owner = v; i++; }
    else if (k === '--disasm') { a.disasm = v; i++; }
    else if (k === '--start') { a.start = parseInt(v, 16); i++; }
    else if (k === '--end') { a.end = parseInt(v, 16); i++; }
    else if (k === '--out-json') { a.outJson = v; i++; }
    else if (k === '--out-md') { a.outMd = v; i++; }
    else if (k === '--title') { a.title = v; i++; }
    else if (k === '--min-run') { a.minRun = parseInt(v, 10); i++; }
    else if (k === '--help' || k === '-h') { a.help = true; }
  }
  return a;
}

// Extract (offset, byte[]) from a `.word`-style disasm/owner file.
function readWordsBytes(file, start, end) {
  const txt = fs.readFileSync(file, 'utf8');
  const re = /\/\*\s*(0x[0-9A-Fa-f]{8})\s+0x[0-9A-Fa-f]{8}\s+(0x[0-9A-Fa-f]{8})\s*\*\//g;
  let m;
  let base = null;
  const bytes = [];
  while ((m = re.exec(txt))) {
    const off = parseInt(m[1], 16);
    if (start != null && (off < start || off >= end)) continue;
    if (base == null) base = off;
    const w = parseInt(m[2], 16) >>> 0;
    bytes.push((w >>> 24) & 0xff, (w >>> 16) & 0xff, (w >>> 8) & 0xff, w & 0xff);
  }
  if (base == null) throw new Error(`no .word lines matched in ${file}` + (start != null ? ` for range` : ''));
  return { base, bytes };
}

function renderByte(b) {
  if (b >= 0x20 && b <= 0x7e) return String.fromCharCode(b);
  return '\\x' + b.toString(16).toUpperCase().padStart(2, '0');
}

// Split bytes into NUL-delimited segments, tracking absolute offsets.
function segment(base, bytes, minRun) {
  const segs = [];
  let i = 0;
  while (i < bytes.length) {
    // consume a NUL run (padding/terminators between strings)
    if (bytes[i] === 0x00) {
      const padStart = base + i;
      let n = 0;
      while (i < bytes.length && bytes[i] === 0x00) { i++; n++; }
      segs.push({ kind: 'nul', offset: '0x' + padStart.toString(16).toUpperCase().padStart(8, '0'), bytes: n });
      continue;
    }
    const strStart = base + i;
    const raw = [];
    while (i < bytes.length && bytes[i] !== 0x00) { raw.push(bytes[i]); i++; }
    if (raw.length < minRun) continue;
    let text = '';
    const ctrl = {};
    for (let j = 0; j < raw.length; j++) {
      const b = raw[j];
      text += renderByte(b);
      if (b === 0x40 /* '@' */ && j + 1 < raw.length) {
        const next = raw[j + 1];
        const code = '@' + (next >= 0x20 && next <= 0x7e ? String.fromCharCode(next) : '\\x' + next.toString(16).toUpperCase().padStart(2, '0'));
        ctrl[code] = (ctrl[code] || 0) + 1;
      }
    }
    const nonPrintable = raw.filter((b) => b < 0x20 || b > 0x7e).length;
    segs.push({
      kind: 'string',
      offset: '0x' + strStart.toString(16).toUpperCase().padStart(8, '0'),
      bytes: raw.length,
      text,
      atCodes: ctrl,
      nonPrintable,
    });
  }
  return segs;
}

function main() {
  const a = parseArgs(process.argv);
  if (a.help || (!a.owner && !a.disasm)) {
    console.log('Usage: node tools/decode_rodata_strings.js --owner <rodata.s> --out-json <json> --out-md <md> [--title "..."]');
    console.log('   or: node tools/decode_rodata_strings.js --disasm <chunk.s> --start <hex> --end <hex> --out-json <json> --out-md <md>');
    process.exit(a.help ? 0 : 1);
  }
  const file = a.owner || a.disasm;
  const { base, bytes } = readWordsBytes(file, a.disasm ? a.start : null, a.disasm ? a.end : null);
  const segs = segment(base, bytes, a.minRun);
  const strings = segs.filter((s) => s.kind === 'string');
  const totalAt = {};
  for (const s of strings) for (const [k, v] of Object.entries(s.atCodes)) totalAt[k] = (totalAt[k] || 0) + v;
  const endOff = base + bytes.length;
  const index = {
    source: file.replace(/\\/g, '/'),
    rangeZ64: ['0x' + base.toString(16).toUpperCase().padStart(8, '0'), '0x' + endOff.toString(16).toUpperCase().padStart(8, '0')],
    totalBytes: bytes.length,
    encoding: 'ASCII, NUL-terminated, big-endian (z64) byte order; @-prefixed inline control codes left verbatim',
    title: a.title || path.basename(file),
    stringCount: strings.length,
    atCodeTally: totalAt,
    atCodeSemantics: 'UNRESOLVED — @0..@3/@w/@c/@e are inline formatting/control codes; exact runtime meaning not decoded',
    confidence: 'high (printable ASCII text); control-code semantics hypothesis-grade',
    segments: segs,
  };
  if (a.outJson) {
    fs.mkdirSync(path.dirname(a.outJson), { recursive: true });
    fs.writeFileSync(a.outJson, JSON.stringify(index, null, 2));
  }
  if (a.outMd) {
    fs.mkdirSync(path.dirname(a.outMd), { recursive: true });
    const lines = [];
    lines.push(`# ${a.title || path.basename(file)} — decoded strings`);
    lines.push('');
    lines.push(`- Source owner: \`${index.source}\` (raw bytes preserved; this is a companion decode).`);
    lines.push(`- ROM range (z64): \`${index.rangeZ64[0]}..${index.rangeZ64[1]}\` (${index.totalBytes} bytes).`);
    lines.push(`- Encoding: ${index.encoding}.`);
    lines.push(`- Strings: ${index.stringCount}.`);
    lines.push(`- \`@\` control codes seen: ${Object.keys(totalAt).length ? Object.entries(totalAt).map(([k, v]) => `\`${k}\`×${v}`).join(', ') : 'none'}.`);
    lines.push(`- Control-code semantics: **${index.atCodeSemantics}**.`);
    lines.push(`- Confidence: ${index.confidence}.`);
    lines.push('');
    lines.push('Printable ASCII is shown verbatim; `\\xHH` = a non-printable byte; NUL terminators/padding are listed as `<NUL×n>`. No control code has been removed or normalized.');
    lines.push('');
    lines.push('| ROM offset | bytes | decoded text (verbatim) |');
    lines.push('|---|---:|---|');
    for (const s of segs) {
      if (s.kind === 'nul') {
        lines.push(`| \`${s.offset}\` | ${s.bytes} | \`<NUL×${s.bytes}>\` |`);
      } else {
        const cell = s.text.replace(/\|/g, '\\|');
        lines.push(`| \`${s.offset}\` | ${s.bytes} | ${cell} |`);
      }
    }
    lines.push('');
    fs.writeFileSync(a.outMd, lines.join('\n'));
  }
  console.log(`Decoded ${strings.length} string(s), ${bytes.length} bytes from ${file}`);
  console.log(`@-codes: ${JSON.stringify(totalAt)}`);
  if (a.outJson) console.log(`JSON:  ${a.outJson}`);
  if (a.outMd) console.log(`MD:    ${a.outMd}`);
}

main();
