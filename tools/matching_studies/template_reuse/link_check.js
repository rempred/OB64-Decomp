'use strict';

// Placement-qualified relocation check for template-reuse candidates
// (research only; pure functions, no compiler or filesystem access).
//
// linkCheck places a scratch object's function text at the target's entry
// VRAM, applies its REL relocations using independently authenticated
// addresses, and compares every word with the retail target.  It fails closed:
//   - names resolve through accepted function targets first (case-insensitive,
//     as the workbench does); a registry entry with the same name must agree
//     on the address.  Only non-function names fall through to the data
//     registry.  Duplicate or case-variant keys that disagree are ambiguous.
//     Invented D_<addr> names never authenticate themselves.
//   - only qualified placement kinds are accepted: early-boot-linear,
//     overlay (same descriptor as the target), non-descriptor-load-slab (same
//     slab).  rom-only or missing placement is rejected.
//   - a data address inside any overlay or load-slab VRAM range is accepted
//     only when exactly one such range covers it and that range belongs to the
//     target; overlapping ranges make the owner ambiguous without
//     symbol-specific evidence, so they fail closed.
//   - R_MIPS_26 destinations must be word-aligned and inside the 256 MB region
//     of the jump's delay-slot PC (PC + 4).
//   - each HI16 pairs with the next LO16 of the same symbol for its AHL; every
//     LO16 applies its own in-place addend.

const signExt16 = (v) => (v & 0x8000 ? v - 0x10000 : v);
const QUALIFIED = new Set(['early-boot-linear', 'overlay', 'non-descriptor-load-slab']);

function qualified(p) {
  return !!p && QUALIFIED.has(p.placementKind)
    && (p.placementKind !== 'overlay' || (p.overlayDescriptorId !== null && p.overlayDescriptorId !== undefined))
    && (p.placementKind !== 'non-descriptor-load-slab' || !!p.loadSlabId);
}

function placementOk(ref, target) {
  if (!qualified(ref) || !qualified(target)) return false;
  if (!Number.isInteger(ref.address) && typeof ref.address !== 'number') return false;
  if (ref.placementKind === 'overlay') return target.placementKind === 'overlay' && ref.overlayDescriptorId === target.overlayDescriptorId;
  if (ref.placementKind === 'non-descriptor-load-slab') return target.placementKind === 'non-descriptor-load-slab' && ref.loadSlabId === target.loadSlabId;
  return true; // early-boot-linear is resident for every caller
}

// ranges: [{ kind: 'overlay'|'slab', id, vramStart, vramEnd }]
function dataPlacementOk(address, target, ranges) {
  if (!qualified(target)) return false;
  const containing = ranges.filter((r) => address >= r.vramStart && address < r.vramEnd);
  if (!containing.length) return true; // resident address outside every loadable range
  if (containing.length !== 1) return false; // overlapping owners: ambiguous
  const [r] = containing;
  if (r.kind === 'overlay') return target.placementKind === 'overlay' && r.id === target.overlayDescriptorId;
  return target.placementKind === 'non-descriptor-load-slab' && r.id === target.loadSlabId;
}

// resolve(name) -> { kind: 'function', address, placementKind, overlayDescriptorId, loadSlabId }
//               |  { kind: 'data', address } | null
function linkCheck({ words, relocations, expectedWords, entryVram, target, resolve, overlays = [] }) {
  const w = words.slice();
  const problems = [];
  if (!qualified(target)) problems.push(`target placement ${target && target.placementKind} is not qualified`);
  const relocs = relocations.map((r) => ({ ...r, index: (typeof r.offset === 'string' ? Number.parseInt(r.offset, 16) : r.offset) / 4 }))
    .sort((a, b) => a.index - b.index);
  const addressOf = (r) => {
    if (r.symbol === '.text') return entryVram >>> 0;
    const ref = resolve(r.symbol);
    if (!ref) { problems.push(`unauthenticated or ambiguous symbol ${r.symbol}`); return null; }
    if (ref.kind === 'function' && !placementOk(ref, target)) { problems.push(`${r.symbol} outside target placement`); return null; }
    if (ref.kind === 'data' && !dataPlacementOk(ref.address >>> 0, target, overlays)) { problems.push(`${r.symbol} data owner not uniquely the target's placement`); return null; }
    return ref.address >>> 0;
  };
  const raw = words.slice(); // in-place addends are read before any word is patched
  for (let k = 0; k < relocs.length; k++) {
    const r = relocs[k]; const i = r.index;
    const S = addressOf(r);
    if (S === null) continue;
    if (r.type === 'R_MIPS_26') {
      const dest = (S + ((raw[i] & 0x03FFFFFF) << 2)) >>> 0;
      const pc4 = ((entryVram >>> 0) + i * 4 + 4) >>> 0;
      if (dest % 4 !== 0) { problems.push(`misaligned jump at +0x${(i * 4).toString(16)}`); continue; }
      if (((dest ^ pc4) & 0xF0000000) !== 0) { problems.push(`unreachable jump at +0x${(i * 4).toString(16)}`); continue; }
      w[i] = ((raw[i] & 0xFC000000) | ((dest >>> 2) & 0x03FFFFFF)) >>> 0;
    } else if (r.type === 'R_MIPS_HI16') {
      const lo = relocs.slice(k + 1).find((x) => x.type === 'R_MIPS_LO16' && x.symbol === r.symbol);
      if (!lo) { problems.push(`HI16 without LO16 for ${r.symbol}`); continue; }
      const ahl = ((raw[i] & 0xFFFF) << 16) + signExt16(raw[lo.index] & 0xFFFF);
      const value = (S + ahl) >>> 0;
      w[i] = ((raw[i] & 0xFFFF0000) | (((value + 0x8000) >>> 16) & 0xFFFF)) >>> 0;
    } else if (r.type === 'R_MIPS_LO16') {
      w[i] = ((raw[i] & 0xFFFF0000) | ((S + signExt16(raw[i] & 0xFFFF)) & 0xFFFF)) >>> 0;
    } else problems.push(`unsupported relocation ${r.type}`);
  }
  const differing = [];
  for (let i = 0; i < Math.max(expectedWords.length, w.length); i++) if (expectedWords[i] !== w[i]) differing.push(i * 4);
  return { equal: !problems.length && !differing.length, differingOffsets: differing.slice(0, 8), problems };
}

function overlayRanges(model) {
  const overlays = (model.overlays || []).map((o) => ({ kind: 'overlay', id: o.descriptor_id, vramStart: o.vram_start >>> 0, vramEnd: o.vram_end_exclusive >>> 0 }));
  const slabs = (model.nonDescriptorLoadSlabs || []).map((s) => ({ kind: 'slab', id: s.id, vramStart: s.vramStart >>> 0, vramEnd: s.vramEndExclusive >>> 0 }));
  return overlays.concat(slabs);
}

// Resolver over accepted function targets (canonical symbol, case-insensitive)
// and the data registry.  Any duplicate, case-variant conflict, or
// function/registry address disagreement resolves to null (ambiguous).
function makeResolver(registryEntries, targets) {
  const AMBIGUOUS = Symbol('ambiguous');
  const data = new Map();
  for (const s of registryEntries) {
    const key = s.name.toLowerCase(); const address = Number.parseInt(s.address, 16) >>> 0;
    if (data.has(key) && data.get(key) !== address) data.set(key, AMBIGUOUS);
    else if (!data.has(key)) data.set(key, address);
  }
  const fns = new Map();
  for (const t of targets) {
    const key = t.symbol.toLowerCase();
    fns.set(key, fns.has(key) ? AMBIGUOUS : t);
  }
  return (name) => {
    const key = name.toLowerCase();
    const f = fns.get(key); const d = data.get(key);
    if (f === AMBIGUOUS || d === AMBIGUOUS) return null;
    if (f) {
      const address = f.entryVram >>> 0;
      if (d !== undefined && d !== address) return null;
      return { kind: 'function', address, placementKind: f.placementKind, overlayDescriptorId: f.overlayDescriptorId, loadSlabId: f.loadSlabId };
    }
    return d === undefined ? null : { kind: 'data', address: d };
  };
}

module.exports = { linkCheck, overlayRanges, makeResolver, placementOk, dataPlacementOk, qualified };
