'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { assembleWordAsmText } = require('./word_asm');

const HEADER = 'data/source-owners/rev0/raw_header/0000_raw_header_00000000_00001000.srcbin';
const HEADER_SHA256 = 'AC11C6D6A7A4EFAB4817612268A7EA9CE418677418B299B15CD908B09B621A84';
const CLEAR = 'asm/original/rev0/boot/boot_entry_clear_bss.s';
const CLEAR_SHA256 = 'C55F6547A0F6B365FC6035FD0AE75246F2D4F572A1B78B67A970B390BBA049AB';
const authenticatedProofs = new WeakSet();
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex').toUpperCase();
function check(condition, message) {
  if (!condition) throw new Error(`boot initialized data: ${message}`);
}
function words(bytes, start, expected, label) {
  expected.forEach((word, index) => check(bytes.readUInt32BE(start + index * 4) === word,
    `${label} instruction drift at ${start + index * 4}`));
}
function signedImmediate(word) { return (word << 16) >> 16; }
function immediatePair(bytes, offset) {
  return (((bytes.readUInt32BE(offset) & 0xFFFF) * 0x10000)
    + signedImmediate(bytes.readUInt32BE(offset + 4))) >>> 0;
}

// This is a recognizer for the authenticated Rev 0 IPL3 and entry stub, not a
// speculative MIPS emulator. Values come from emitted bytes, never comments or
// a configurable upper bound. Exact control/operand templates keep the small
// proof closed over DMA setup, completion, entry transfer, and the clear loop.
function recognizeOriginalBytes(header, clear) {
  check(Buffer.isBuffer(header) && header.length === 0x1000, 'header extent drift');
  check(Buffer.isBuffer(clear) && clear.length === 0x60, 'clear extent drift');
  words(header, 0x4C0, [0x3C0BB000, 0x8D690008, 0x3C0A1FFF, 0x354AFFFF,
    0x3C01A460, 0x012A4824, 0xAC290000, 0x3C08A460, 0x8D080010,
    0x31080002, 0x5500FFFD, 0x3C08A460, 0x24081000, 0x010B4020,
    0x010A4024, 0x3C01A460, 0xAC280004, 0x3C0A0010, 0x254AFFFF,
    0x3C01A460, 0xAC2A000C], 'initial PI DMA');
  words(header, 0x584, [0x3C0BA460, 0x8D6B0010, 0x316B0001, 0x1560FFE0, 0], 'PI completion');
  words(header, 0x764, [0x3C0BB000, 0x8D690008, 0x01200008, 0], 'entry transfer');
  words(clear, 0, [0x3C08800B, 0x2508EDB0, 0x3C090004, 0x2529AE70,
    0xAD000000, 0xAD000004, 0x21080008, 0x2129FFF8, 0x1520FFFB, 0,
    0x3C0A8008, 0x254AF880, 0x3C1D800C, 0x01400008, 0x27BD6D60,
    0, 0, 0, 0, 0, 0, 0, 0, 0], 'boot clear');
  const vramStart = header.readUInt32BE(8);
  check(vramStart >= 0x80000000 && vramStart < 0xA0000000 && vramStart % 4 === 0,
    'entry is not an aligned KSEG0 address');
  const romStart = signedImmediate(header.readUInt32BE(0x4F0));
  const bytes = immediatePair(header, 0x504) + 1;
  const delta = vramStart - romStart;
  const clearStart = immediatePair(clear, 0);
  const clearBytes = immediatePair(clear, 8);
  check(bytes > 0 && clearBytes > 0 && clearBytes % 8 === 0
    && clearStart >= vramStart && clearStart < vramStart + bytes, 'clear/DMA geometry drift');
  return Object.freeze({ romStart, romEndExclusive: romStart + bytes, vramStart,
    vramEndExclusive: vramStart + bytes, delta, clearStart,
    clearEndExclusive: clearStart + clearBytes, preservedRomEndExclusive: clearStart - delta });
}

function authenticateSources(config, manifest, header, source) {
  check(config.acceptedInputSha256 && config.acceptedInputSha256[HEADER] === HEADER_SHA256,
    'header pin is missing or changed');
  check(hash(header) === HEADER_SHA256, 'header source identity drift');
  const parts = (manifest.chunks || []).flatMap(chunk => chunk.parts || []).filter(part => part.file === CLEAR);
  check(parts.length === 1 && parts[0].sha256 === CLEAR_SHA256
    && Number(parts[0].romStart) === 0x1000 && Number(parts[0].romEndExclusive) === 0x1060
    && parts[0].bytes === 0x60, 'original clear owner identity drift');
  check(source.length === parts[0].textBytes && hash(source) === CLEAR_SHA256, 'clear source identity drift');
  const proof = recognizeOriginalBytes(header, assembleWordAsmText(source.toString('utf8'), CLEAR).bytes);
  authenticatedProofs.add(proof);
  return proof;
}

function loadProof(root, config, manifest) {
  return authenticateSources(config, manifest, fs.readFileSync(path.join(root, HEADER)),
    fs.readFileSync(path.join(root, CLEAR)));
}

function intersects(a, b, c, d) { return a < d && b > c; }
function contains(outer, inner) {
  return inner.romStart >= outer.romStart && inner.romEndExclusive <= outer.romEndExclusive
    && inner.vramStart >= outer.vramStart && inner.vramEndExclusive <= outer.vramEndExclusive;
}
function validateSlabs(config, slabs, overlays, rows, proof) {
  check(authenticatedProofs.has(proof), 'missing authenticated initial image proof');
  check(config.rom.earlyBootLinearEndExclusive === 0x2F000
    && config.rom.earlyBootLinearBase === proof.delta
    && config.rom.bootInitializedDataRomEndExclusive === proof.preservedRomEndExclusive,
  'configured boot mapping disagrees with original bytes');
  const bootSlabs = slabs.filter(item => item.kind === 'boot-initialized-data');
  check(bootSlabs.length === 1, 'boot data slab census drift');
  for (const slab of bootSlabs) {
    for (const key of ['romStart', 'romEndExclusive', 'vramStart', 'vramEndExclusive']) {
      check(Number.isSafeInteger(slab[key]) && slab[key] % 4 === 0, 'unsafe or unaligned data extent');
    }
    check(slab.romEndExclusive > slab.romStart && slab.romStart >= config.rom.earlyBootLinearEndExclusive
      && slab.romEndExclusive <= proof.preservedRomEndExclusive && contains(proof, slab)
      && slab.vramStart - slab.romStart === proof.delta
      && slab.vramEndExclusive - slab.romEndExclusive === proof.delta, 'data slab escaped preserved initial image');
    for (const key of ['executableRanges', 'nonExecutableRanges']) {
      check(slab[key] === undefined || (Array.isArray(slab[key]) && slab[key].length === 0),
        'boot data cannot override execution classification');
    }
    for (const other of slabs.filter(item => item !== slab)) {
      check(!intersects(slab.romStart, slab.romEndExclusive, other.romStart, other.romEndExclusive)
        && !intersects(slab.vramStart, slab.vramEndExclusive, other.vramStart, other.vramEndExclusive),
      'boot data conflicts with another load slab');
    }
    for (const overlay of overlays) {
      check(!intersects(slab.romStart, slab.romEndExclusive, overlay.rom_start, overlay.rom_end_exclusive)
        && !intersects(slab.vramStart, slab.vramEndExclusive, overlay.vram_start, overlay.vram_end_exclusive),
      'boot data conflicts with fixed overlay');
    }
    const owners = rows.filter(row => intersects(slab.romStart, slab.romEndExclusive, row.romStart, row.romEndExclusive));
    let cursor = slab.romStart;
    for (const row of owners) {
      check(row.romStart === cursor && row.romEndExclusive <= slab.romEndExclusive
        && row.inputKind === 'tracked-assembly' && row.primaryClass === 'data' && row.part
        && row.slices.length === 1, 'boot data must contain complete tracked data owners');
      const slice = row.slices[0];
      check(!slice.executable && slice.executableRangeId === null && slice.nonExecutableRangeId === null
        && slice.romStart === row.romStart && slice.romEndExclusive === row.romEndExclusive
        && slice.loadSlabId === slab.id && slice.placementKind === 'non-descriptor-load-slab'
        && contains(slab, slice) && slice.vramStart - slice.romStart === proof.delta
        && slice.vramEndExclusive - slice.romEndExclusive === proof.delta,
      'boot data owner placement/classification drift');
      cursor = row.romEndExclusive;
    }
    check(cursor === slab.romEndExclusive, 'boot data owner coverage is incomplete');
  }
}

function isAuxiliaryPair(model, target, auxiliary) {
  if (!target || !auxiliary || target.placementKind !== 'early-boot-linear' || !target.executable
      || auxiliary.placementKind !== 'non-descriptor-load-slab' || auxiliary.executable) return false;
  const slabs = (model.nonDescriptorLoadSlabs || []).filter(slab => slab.id === auxiliary.loadSlabId);
  if (slabs.length !== 1 || slabs[0].kind !== 'boot-initialized-data') return false;
  const proof = model.bootInitializedDataProof;
  validateSlabs(model.config, model.nonDescriptorLoadSlabs, model.overlays, model.rows, proof);
  return contains(slabs[0], auxiliary) && contains(proof, target)
    && target.romEndExclusive <= model.config.rom.earlyBootLinearEndExclusive
    && target.vramStart - target.romStart === proof.delta
    && target.vramEndExclusive - target.romEndExclusive === proof.delta;
}

module.exports = { loadProof, authenticateSources, recognizeOriginalBytes, validateSlabs, isAuxiliaryPair };
