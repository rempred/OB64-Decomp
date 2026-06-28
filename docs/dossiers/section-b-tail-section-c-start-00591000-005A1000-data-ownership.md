# Section B tail + Section C start — `0x00591000..0x005A1000` (chunk 89) — RUN-COMPLETE

Combined-boundary ownership of the **whole** chunk 89: it closes the Section B cutscene audio-sequence
block family **and** starts the Section C HUFFMAN-compressed resource pool. Machine-readable inventory:
`docs/data-index/rev0/section-b-tail-section-c-start-00591000-005A1000-data-inventory.json`.

**This run REACHES the planned frontier `0x005A1000` (whole chunk 89 owned).** It deliberately owns both
sides of the Section B/C boundary as separate subranges, which **resolves the prior run's partial-interior-
chunk fallback** (chunks 79-88 fell back at `0x591000` because the family end `0x594280` is mid-chunk-89).

Classification: **MIXED DATA TERRITORY** — (B) parser-backed cutscene audio-sequence block tail + (C)
Section C resource-pool directory + Section C HUFFMAN-compressed pool start.

## Composition — 5 structural parts (4 data + 1 zero_fill, 0 code)

| Part | ROM range | Bytes | Class | What |
|---|---|---|---|---|
| `data_00591000` | `0x591000..0x592490` | 5,264 | raw-but-classified | Section B **block 61 tail** (completes block 61 `0x5908D0..0x592490`, tag 0x215; head owned chunk 88) |
| `data_00592490` | `0x592490..0x594280` | 7,664 | raw-but-classified | Section B **block 62** = the FINAL (63rd) family block (tag 0x215, no following header); **family end 0x594280** |
| `data_00594280` | `0x594280..0x594384` | 260 | raw-but-classified | **Section C directory**: 65-entry u32-BE offset table (TOC for the HUFF pool) |
| `zero_fill_00594384` | `0x594384..0x5943C8` | 68 | parsed (all-zero) | Post-directory zero pad (17 words) |
| `data_005943C8` | `0x5943C8..0x5A1000` | 52,280 | raw-but-classified | **Section C HUFFMAN-compressed pool START** (N64 JPEG/NJPG-style HUFF entropy; OUTGOING into chunk 90) |

- **Incoming:** chunk 88 block 61 head (`0x5908D0..0x591000`) → `data_00591000` (block 61 tail); seamless
  mid-block across the `0x591000` seam.
- **Outgoing:** `data_005943C8` (Section C HUFF pool) runs to `0x5A1000` and continues into chunk 90
  (the pool spans Section C to ~`0x63676C`; 29 HUFF blocks, last @`0x630BC4`).

## Section B closure (parser-backed, byte-verified)

Source of truth: parent `scripts/ob64_anim_block_catalog.json` (63 contiguous blocks `0x4F0FB0..0x594280`,
roundtrip_ok) + `tools/anim_block_codec.py` (cutscene MUSIC/SFX). **5-pass swarm:** block 61 = catalog
index 61 (`0x5908D0`, size `0x1BC0`, end_source next-header) and block 62 = catalog index 62 (`0x592490`,
size `0x1DF0`, end_source known-trailing-end) are the **final 2 family blocks**; ROM-verified tag
`0x00000215` at each header; `codec.verify_block` round-trips **both IDENTICAL**. **Family ends at
`0x594280`** (block 62 size `0x1DF0` is ASSUMED via codec KNOWN_TRAILING_END, independently corroborated by
a `0x96` end-of-track terminator @`0x59427A` + zero-fill to `0x594280`). This closes the 63-block family.

## Section C apparatus (NEW — refines the survey)

**Directory** (`0x594280..0x594384`, 65 u32-BE words): 3-word prelude `0x64C2/0x140/0x148`, then a 62-entry
offset list `0x63DC..0x27C5F4`. **Largely-monotonic, NOT strictly** — entries [33..35] repeat `0x0C9A42`,
plus back-references at idx40→41/43→44/44→45 (shared/reused assets). Max offset `0x27C5F4` (2.49 MB) **far
exceeds** the raw-ROM Section C span `0x594280..0x63676C` = `0xA24EC` (0.63 MB; ~4×), so **the offsets
index a DECOMPRESSED asset space**, not raw ROM. Then a 68 B all-zero pad to `0x5943C8`.

**Section C = an N64 JPEG/NJPG-style "HUFF" entropy pool** (`0x5943C8..`). ASCII `"HUFF"` (48 55 46 46) magic
@`0x5943D4`, `0x59A668`, `0x5A0E40` (3 in-chunk; 4th @`0x5A787C` is past `0x5A1000`); **29 HUFF blocks**
across `0x594280..0x63676C` (first `0x5943D4`, last `0x630BC4`). Header word `01 40 00 f0` is 320x240
and `01 2c` is 300 macroblocks. Post-run decode update (2026-06-28): MSB-first standard JPEG Huffman
decode succeeds for all 29 blocks, identifying the pool as N64 JPEG/NJPG-style HUFF entropy data. Final
renderable images still require the NJPG/RSP JPEG stage or equivalent IDCT, quantization/de-zigzag, and YUV
conversion.

## Section B/C boundary — pinned at `0x594280`

Block 62 ends at `0x594280` and the Section C directory begins AT `0x594280` with no gap, so the structural
B→C transition is byte-exact **`0x594280`** (the most defensible pin). The high-entropy/compressed-payload
transition is ~`0x5943C8` (Section B entropy 6.40 vs HUFF pool 7.97). The survey's "~`0x595000`" is
**`0xD80` too high** — it lands inside the HUFF pool between the 1st and 2nd HUFF blocks; superseded. Both
`0x594280` and `0x5943C8` are mid-chunk-89 and owned here.

## Proof of non-code (data-only safe)

Adversary swarm pass, all 4 byte alignments: **`jr $ra` (0x03E00008) = 0** everywhere in the chunk; no
`lw $ra`/`sw $ra` frame structure; exactly **1** prologue-pattern word = `0x594A9C` (`0x27BD91B1`). That
word is the **survey-known FALSE POSITIVE**: signed immediate −28239 (absurd ~28 KB frame), located at
offset `0x6C8` INSIDE the first HUFF block (≥`0x5943C8`, entropy 7.97), neighbors pure compressed noise,
and **no `jr $ra` anywhere** to close a frame. The `0x594A9C` "function" lead (parent `ob64_functions.json`
has 0 funcs in range) is **rejected**. Contrast: known code region `0x1000..0x100000` has 2105 `jr $ra`.

## Parent tooling / leads

**ACCEPTED byte-verified ROM lead** (`anyAcceptedRomLead = true`): `ob64_anim_block_catalog.json` blocks 61
(`0x5908D0`/`0x1BC0`) + 62 (`0x592490`/`0x1DF0`) match the ROM (tag 0x215 each); block 62 end = family end
`0x594280`. Range precedes the first LHA archive (`0x636784`; all 825 archives ≥ it). **No parent tool
decodes the Section C "HUFF" codec** (`huffDecoderInParent = false`). **REJECTED:** the `0x594A9C` code lead
(above); the single in-range 4f `gapOffset` `0x5921D0` ("palettetail") lands inside block 61's audio tail in
ROM and is a decompressed-7MB-stream coord (base `0x20248C2`), not a ROM offset; 4a has 0 in-range.

## Tooling constraint — RESOLVED

The prior run (chunks 79-88) fell back at `0x591000` because the family end `0x594280` + B/C boundary are
mid-chunk-89, and `assemble_original_mips.js` requires each manifest chunk to exactly tile its 64 KiB report
chunk. **Resolved here** by owning the WHOLE chunk 89 as one chunk-aligned run with separate subranges
(Section B tail + Section C directory + Section C HUFF start). No pipeline change was needed — the mid-chunk
B/C boundary `0x594280` is represented as an internal part boundary within the chunk-aligned manifest entry.
This was the prompt-authorized strategy.

## Verification

`check_manifest` (90 chunks); `check_boundaries`/`check_splits` PASS (5 parts, 0 fragments, 0 code);
`assemble_original_mips` byte-exact (code SHA `40D4E787…B409` unchanged); `verify_setup` + `audit_code_region`
— see review handoff. Runtime states: none (static-only). Patch-workbench: none.

## Ownership status: `yes` (all 65,536 bytes of chunk 89)

Independent reviewer **yes**; `partialChunkResolved = true`. All 65,536 bytes byte-exact owned as 5
structural parts. Downgrades to caveats only — none affect byte-exact ownership.

## Caveats & unresolved fields

- HUFF entropy stage decoded; final renderable pixels are not yet produced.
- Directory per-entry semantics unresolved (3-word prelude meaning; the 29 compressed blocks vs 62 asset
  offsets mapping; offsets index decompressed-asset space, not reconciled against base `0x20248C2` here).
- HUFF block header fields beyond the magic not formally decoded (leading u16; the constant
  `48 55 fe 00 / 01 40 00 f0 / 01 2c` Huffman-table/window params).
- Block 62 size `0x1DF0` ASSUMED via KNOWN_TRAILING_END (only block not header-corroborated; supported by
  the `0x96` terminator + zero-fill at `0x59427A`).
- B/C boundary dual-pin: `0x594280` (structural) vs ~`0x5943C8` (payload); both represented as part
  boundaries. chunk-78 Section B index-table payloadLen gap carried forward.

## Next-run first action — chunk 90 (`0x005A1000`): continue Section C

Chunks 90-99 now own Section C through the configured stop. Next decode work is to implement the NJPG
render stage and resolve the remaining directory entries; the LHA `-lh5-` archive catalog begins at
`0x636784`. Do NOT continue past `0x0063676C`
without Joe explicitly asking.
