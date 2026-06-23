#!/usr/bin/env node
'use strict';
/*
 * decode_ob64_tables.js — decode the two documented fixed-stride scenario tables in chunk 20
 * (neutral_encounter_table @ 0x141ED0, creature_drop_table @ 0x142258) from the byte-exact
 * Rev 0 disassembly into JSON indexes + human-readable Markdown exports.
 *
 * Field layouts are from reconciled parent evidence (docs/neutral-encounters.md,
 * docs/drop-table.md, editor/parsers.js, ram_snapshots/table_map.json) — HIGH confidence,
 * byte-verified. The raw .s owners remain authoritative; these are companion decodes.
 *
 * Usage: node tools/decode_ob64_tables.js
 *   reads build/original-mips/rev0/code_00141000_00151000.s
 *   writes docs/data-index/rev0/chunk20-{neutral-encounter,creature-drop}-table.json
 *      and data/decoded/rev0/tables/chunk20-{neutral-encounter,creature-drop}-table.md
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const DISASM = path.join(ROOT, 'build/original-mips/rev0/code_00141000_00151000.s');

// Build an address->byte map from the .word disasm (z64/big-endian byte order).
function readBytes(file) {
  const txt = fs.readFileSync(file, 'utf8');
  const re = /\/\*\s*(0x[0-9A-Fa-f]{8})\s+0x[0-9A-Fa-f]{8}\s+(0x[0-9A-Fa-f]{8})\s*\*\//g;
  const bytes = new Map();
  let m;
  while ((m = re.exec(txt))) {
    const off = parseInt(m[1], 16);
    const w = parseInt(m[2], 16) >>> 0;
    bytes.set(off, (w >>> 24) & 0xff);
    bytes.set(off + 1, (w >>> 16) & 0xff);
    bytes.set(off + 2, (w >>> 8) & 0xff);
    bytes.set(off + 3, w & 0xff);
  }
  return bytes;
}
const B = readBytes(DISASM);
const u8 = (a) => { if (!B.has(a)) throw new Error(`no byte @0x${a.toString(16)}`); return B.get(a); };
const u16 = (a) => (u8(a) << 8) | u8(a + 1); // big-endian
const hex = (n, w = 8) => '0x' + n.toString(16).toUpperCase().padStart(w, '0');

// ---- neutral_encounter_table @ 0x141ED0: 4B pad + 40 slices x 20B + 12B pad (816B) ----
function decodeNeutral() {
  const base = 0x141ED0;
  const SLOT_TERRAIN = ['Plains/Roads', 'Forest', 'Hills', 'Mountains', 'Sea/Water',
    'Sky/Air', 'Wasteland', 'Town/Castle', 'Swamp', 'Snowy Highlands'];
  const rows = [];
  const rowsBase = base + 4; // first slice (s0=1)
  for (let s = 0; s < 40; s++) {
    const rowOff = rowsBase + s * 20;
    const slots = [];
    for (let k = 0; k < 10; k++) {
      const a = u8(rowOff + k * 2), b = u8(rowOff + k * 2 + 1);
      let kind;
      if (a === 0 && b === 0) kind = 'empty';
      else if (a === b) kind = 'single';
      else kind = 'pair-5050';
      slots.push({ terrain: SLOT_TERRAIN[k], classA: hex(a, 2), classB: hex(b, 2), kind });
    }
    rows.push({ index: s + 1, romOffset: hex(rowOff), slots });
  }
  return {
    name: 'neutral_encounter_table',
    rangeZ64: [hex(base), hex(base + 816)],
    totalBytes: 816,
    rowCount: 40,
    rowStride: '0x14',
    layout: '4-byte leading zero pad; 40 rows x 20 bytes (rowFormula ROM = 0x141ED0 + 4 + (index-1)*20, rows end 0x1421F4); 12 trailing bytes [0x1421F4,0x142200) (NOT pure pad: 0x1421F8 = 0x4C504144 "LPAD" marker + 0x00004340). Each row = 10 terrain-indexed 2-byte slots; slot = [u8 classA, u8 classB]: classA==classB -> single creature, A!=B -> 50/50 random, [00 00] -> empty.',
    confidence: 'HIGH (docs/neutral-encounters.md + editor/parsers.js + table_map.json size 816; byte-verified)',
    runtimeRamCopy: '0x801ED790 (scenario state; overlay-relocated, NOT a linear map of the ROM addr)',
    rawOwner: 'asm/original/rev0/lib/<table part covering 0x141ED0> (byte-exact; this is a companion decode)',
    notes: 'Slot->terrain mapping per docs; class IDs are 1-based game class IDs. The superseded 51x16B model is WRONG.',
    rows,
  };
}

// ---- creature_drop_table @ 0x142258: 36 records x 8B (288B), indexed by class id ----
function decodeDrops() {
  const base = 0x142258;
  function slot(v) {
    if (v === 0) return { raw: hex(v, 4), empty: true };
    return { raw: hex(v, 4), equipment: !!(v & 0x8000), itemId: v & 0x7fff, itemIdHex: hex(v & 0x7fff, 4) };
  }
  const records = [];
  for (let r = 0; r < 36; r++) {
    const o = base + r * 8;
    const pad = u8(o), classId = u8(o + 1);
    const s1 = u16(o + 2), s2 = u16(o + 4), s3 = u16(o + 6);
    records.push({
      index: r, romOffset: hex(o), pad: hex(pad, 2), classId: hex(classId, 2),
      drops: [slot(s1), slot(s2), slot(s3)],
      sentinel: pad === 0 && classId === 0 && s1 === 0 && s2 === 0 && s3 === 0,
    });
  }
  return {
    name: 'creature_drop_table',
    rangeZ64: [hex(base), hex(base + 288)],
    totalBytes: 288,
    rowCount: 36,
    rowStride: '0x8',
    layout: 'record (8B): [0]=u8 pad(0x00); [1]=u8 class_id; [2-3]=u16BE drop slot1; [4-5]=slot2; [6-7]=slot3. Drop slot: bit15(0x8000)=equipment flag, bits0-14=item id (index into item_stat_table @ ROM 0x62310). Indexed by class id; record 35 = all-zero sentinel.',
    confidence: 'HIGH (docs/drop-table.md + editor/parsers.js:566-610 + table_map.json size 288=36x8; byte-verified e.g. Hawkman class 0x27 -> 80 31/80 9B/80 E8)',
    runtimeRamCopy: '0x801EDB18 (scenario state; overlay-relocated)',
    rawOwner: 'asm/original/rev0/lib/<table part covering 0x142258> (byte-exact; companion decode)',
    records,
  };
}

function writeJson(p, obj) { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, JSON.stringify(obj, null, 2)); }

function neutralMd(t) {
  const L = [];
  L.push(`# neutral_encounter_table — decoded (chunk 20)`);
  L.push('');
  L.push(`- ROM range (z64): \`${t.rangeZ64[0]}..${t.rangeZ64[1]}\` (${t.totalBytes} bytes). Raw owner is authoritative; this is a companion decode.`);
  L.push(`- ${t.rowCount} rows × ${t.rowStride}-byte stride. Layout: ${t.layout}`);
  L.push(`- Confidence: ${t.confidence}. Runtime RAM copy: ${t.runtimeRamCopy}.`);
  L.push('');
  L.push('Each row = 10 terrain slots; `single`=one class, `5050`=two classes 50/50, `.`=empty.');
  L.push('');
  L.push('| row | ROM | ' + ['Plains', 'Forest', 'Hills', 'Mtn', 'Sea', 'Sky', 'Waste', 'Town', 'Swamp', 'Snow'].join(' | ') + ' |');
  L.push('|---:|---|' + '---|'.repeat(10));
  for (const r of t.rows) {
    const cells = r.slots.map((s) => s.kind === 'empty' ? '.' : (s.kind === 'single' ? s.classA.replace('0x', '') : `${s.classA.replace('0x', '')}/${s.classB.replace('0x', '')}`));
    L.push(`| ${r.index} | \`${r.romOffset}\` | ` + cells.join(' | ') + ' |');
  }
  L.push('');
  return L.join('\n');
}
function dropsMd(t) {
  const L = [];
  L.push(`# creature_drop_table — decoded (chunk 20)`);
  L.push('');
  L.push(`- ROM range (z64): \`${t.rangeZ64[0]}..${t.rangeZ64[1]}\` (${t.totalBytes} bytes). Raw owner is authoritative; this is a companion decode.`);
  L.push(`- ${t.rowCount} records × ${t.rowStride}-byte stride, indexed by class id. Layout: ${t.layout}`);
  L.push(`- Confidence: ${t.confidence}. Runtime RAM copy: ${t.runtimeRamCopy}.`);
  L.push('');
  L.push('Drop columns: `E:itemid` = equipment flag set; `i:itemid` = non-equip; `.` = empty. itemid is the raw 15-bit field (index into item_stat_table @ ROM 0x62310).');
  L.push('');
  L.push('| rec | ROM | class | drop1 | drop2 | drop3 |');
  L.push('|---:|---|---|---|---|---|');
  for (const r of t.records) {
    const d = r.drops.map((s) => s.empty ? '.' : `${s.equipment ? 'E' : 'i'}:${s.itemIdHex.replace('0x', '')}`);
    L.push(`| ${r.index} | \`${r.romOffset}\` | \`${r.classId}\`${r.sentinel ? ' (sentinel)' : ''} | ${d[0]} | ${d[1]} | ${d[2]} |`);
  }
  L.push('');
  return L.join('\n');
}

const neutral = decodeNeutral();
const drops = decodeDrops();
writeJson(path.join(ROOT, 'docs/data-index/rev0/chunk20-neutral-encounter-table.json'), neutral);
writeJson(path.join(ROOT, 'docs/data-index/rev0/chunk20-creature-drop-table.json'), drops);
fs.mkdirSync(path.join(ROOT, 'data/decoded/rev0/tables'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'data/decoded/rev0/tables/chunk20-neutral-encounter-table.md'), neutralMd(neutral));
fs.writeFileSync(path.join(ROOT, 'data/decoded/rev0/tables/chunk20-creature-drop-table.md'), dropsMd(drops));
console.log(`neutral_encounter_table: ${neutral.rowCount} rows @ ${neutral.rangeZ64[0]}..${neutral.rangeZ64[1]}`);
console.log(`creature_drop_table: ${drops.rowCount} records @ ${drops.rangeZ64[0]}..${drops.rangeZ64[1]}`);
const nonSentinelDrops = drops.records.filter((r) => !r.sentinel).length;
console.log(`drop records non-sentinel: ${nonSentinelDrops}`);
