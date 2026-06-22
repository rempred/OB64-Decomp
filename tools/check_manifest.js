#!/usr/bin/env node
// Read-only manifest integrity audit: verifies every tracked manifest part is
// contiguous within its chunk, that each .s file's actual .word decode-comment
// range matches its declared [romStart,romEndExclusive), that recorded
// sha256/textBytes/bytes match the file, and that there are no duplicate part
// files or names. Exits non-zero on any problem. Touches no source.
//
// Usage: node tools/check_manifest.js [--manifest <json>]
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.resolve(__dirname, '..');
const A = {}; const av = process.argv.slice(2);
for (let i = 0; i < av.length; i += 2) A[av[i].replace(/^--/, '')] = av[i + 1];
const manifestPath = A.manifest ? path.resolve(A.manifest) : path.join(ROOT, 'asm/original/rev0/manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const parseHex = (v) => (typeof v === 'number' ? v : parseInt(v, 16));
const sha = (buf) => crypto.createHash('sha256').update(buf).digest('hex').toUpperCase();
const wordRom = (line) => {
  const m = line.match(/\/\*\s+0x([0-9A-Fa-f]{8})\s+/);
  return m ? parseInt(m[1], 16) : null;
};

let problems = 0;
const report = (msg) => { problems += 1; console.log('  PROBLEM:', msg); };

for (const chunk of manifest.chunks) {
  const cStart = parseHex(chunk.romStart);
  const cEnd = parseHex(chunk.romEndExclusive);
  console.log(`Chunk ${chunk.file} ${chunk.romStart}..${chunk.romEndExclusive} parts=${(chunk.parts || []).length}`);
  if (!Array.isArray(chunk.parts)) { console.log('  (no parts — single-file chunk)'); continue; }
  let cursor = cStart;
  for (const part of chunk.parts) {
    const pStart = parseHex(part.romStart);
    const pEnd = parseHex(part.romEndExclusive);
    if (pStart !== cursor) report(`contiguity: ${part.file} starts 0x${pStart.toString(16)}, expected 0x${cursor.toString(16)}`);
    if (pEnd <= pStart) report(`bad range: ${part.file} ${part.romStart}..${part.romEndExclusive}`);
    if (pEnd - pStart !== part.bytes) report(`bytes field: ${part.file} declares ${part.bytes}, range is ${pEnd - pStart}`);
    const abs = path.resolve(ROOT, part.file);
    if (!fs.existsSync(abs)) { report(`missing file: ${part.file}`); cursor = pEnd; continue; }
    const raw = fs.readFileSync(abs);
    if (sha(raw) !== part.sha256) report(`sha256: ${part.file} file=${sha(raw)} manifest=${part.sha256}`);
    if (raw.length !== part.textBytes) report(`textBytes: ${part.file} file=${raw.length} manifest=${part.textBytes}`);
    // word-range check from decode comments
    const lines = raw.toString('utf8').replace(/\r\n/g, '\n').split('\n');
    const roms = [];
    for (const l of lines) { const r = wordRom(l); if (r != null) roms.push(r); }
    if (roms.length === 0) { report(`no .word decode comments in ${part.file}`); cursor = pEnd; continue; }
    const first = roms[0];
    const last = roms[roms.length - 1];
    if (first !== pStart) report(`first .word: ${part.file} first=0x${first.toString(16)}, declared start 0x${pStart.toString(16)}`);
    if (last !== pEnd - 4) report(`last .word: ${part.file} last=0x${last.toString(16)}, declared end-4 0x${(pEnd - 4).toString(16)}`);
    if (roms.length * 4 !== pEnd - pStart) report(`word count: ${part.file} ${roms.length} words = ${roms.length * 4} B, range ${pEnd - pStart} B`);
    // strictly increasing by 4
    for (let i = 1; i < roms.length; i += 1) {
      if (roms[i] !== roms[i - 1] + 4) { report(`non-contiguous words in ${part.file} near 0x${roms[i].toString(16)}`); break; }
    }
    cursor = pEnd;
  }
  if (cursor !== cEnd) report(`chunk end: ${chunk.file} parts end 0x${cursor.toString(16)}, expected 0x${cEnd.toString(16)}`);
}

// duplicate file-name and duplicate name detection across all parts
const seenFiles = new Map();
const seenNames = new Map();
for (const chunk of manifest.chunks) for (const part of chunk.parts || []) {
  if (seenFiles.has(part.file)) report(`duplicate part file: ${part.file}`);
  seenFiles.set(part.file, true);
  if (part.name) {
    if (seenNames.has(part.name)) report(`duplicate part name: ${part.name} (${part.file} and ${seenNames.get(part.name)})`);
    seenNames.set(part.name, part.file);
  }
}

console.log(problems === 0 ? '\nALL CHECKS PASS' : `\n${problems} PROBLEM(S) FOUND`);
process.exit(problems === 0 ? 0 : 1);
