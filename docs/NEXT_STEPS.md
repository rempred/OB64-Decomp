# Next Steps

This is the immediate work queue for the Rev 0 decomp repo. Keep it short and
update it when a task becomes durable, blocked, or complete.

## Setup Complete

The setup phase is complete. The repo can verify Rev 0 identity, whole-ROM
coverage, real GNU MIPS binutils, first tracked chunk real assembly, raw rebuild,
full-ROM source-manifest audit, and assembled-code rebuild with one command.

Current passing commands:

```powershell
node tools/verify_setup.js
```

Current source mix: 79 tracked composite real-assembler chunks (chunk 0 177
`boot/`; chunks 1–78 in `lib/`: 350, 216, 67, 376, 88, 78, 103, 87, 34, 35, 191, 74, 67, 94, 153, 95, 66, 95, 80, 175, 99, 99, 73, 63, 71, 96, 142, 97, 103, 122, 86, 198, 109, 120, 134, 164, 180, 232, 155, 159, 160, 171, 90, 17, 15, 17, 27, 9, 11, 13, 13, 13, 9, 9, 9, 7, 1, 5, 3, 3, 5, 5, 5, 7, 15, 8, 21, 33, 23, 19, 23, 21, 33, 13, 7, 7, 15, 4) = 6,069 tracked
source files, plus 21 generated fallback chunks. **Chunks 0–78 are fully
source-owned as named code/data parts** (`0x00001000..0x004F1000`;
chunk 78 crosses the Section A/B boundary [0x4E1000..0x4F1000; boundary pinned 0x4E3140]: 4 structural
parts = Section A audio tail + Section B index table [1798 records, shape decoded] + Section B payload
[undecoded] + first parser-backed cutscene-block head; chunk-78 bytes owned, Section B unit partial;
chunks 68-77 = flat Section A AUDIO sample payload [0x441000..0x4E1000]: 194 parts [102 data + 92
zero_fill, 0 code], raw 4-bit ADPCM/VADPCM after the chunk-66/67 bank; whole-range entropy 7.309, no
sub-bank header, 4 quiet-audio <6.0 windows confirmed non-structural, 10-chunk batch stayed clean; outgoing
data_004E0CE8 into chunk 78 (A/B boundary ~0x4E3158 just past);
chunk 67 = the chunk-66 audio bank's WaveTables sample-payload TAIL closure + flat post-tail Section A
audio [0x431000..0x441000]: 21 parts; payload ends 0x431EF1; chunk-66+67 bank unit partial; outgoing
data_0043F3D8 into chunk 68;
chunk 66 = a DECODED N64 audio sound-bank [0x421000..0x431000]: 8 structural parts [5 data + 3 zero_fill,
0 code], N64 PtrTablesV2 codebook @0x423FF0 [133 order-2 VADPCM records] + N64 WaveTables @0x429CD0 — CONFIRMS
Section A is AUDIO; outgoing data_00429CC8 into chunk 67;
chunks 62-65 = Section A slice 3 [0x3E1000..0x421000]: 0 code + 32 data [18 data + 14 zero_fill],
DATA TERRITORY — FALLBACK from planned 62-71; outgoing continuation data_00420438 into chunk 66;
chunks 52-61 = Section A slice 2 [0x341000..0x3E1000]: 0 code + 64 data [37 data + 27 zero_fill],
DATA TERRITORY — same asset family, TYPE UNRESOLVED, conservative names; 0 jr$ra/0 prologues/0 pointers
at all 4 byte alignments; parent-tooling-dark; container layout decoded; outgoing continuation
data_003DE988 into chunk 62;
chunks 48-51 = Section A slice 1 [survey natural unit Section A 0x301000..0x4E3000]: 0 code + 46
data [25 data + 21 zero_fill], DATA TERRITORY — high-entropy asset data continuing the chunk-43..47
family, TYPE UNRESOLVED (graphics/texture vs audio-codec-residual; conservative names); 0 jr$ra/0
prologues/0 pointers; outgoing continuation data_0033FD78 into chunk 52;
chunk 47: 0 code + 27 data [14 data + 13 zero_fill], DATA TERRITORY — the entire 64 KiB is non-code
high-entropy graphics/texture asset data past the executable extent, continuing chunk 46's
`data_002EF7F8` tail (0 jr$ra/0 prologues/0 pointers); final part `data_003002E8` runs to the chunk
end — OUTGOING data continuation into chunk 48; no code, no straddler;
chunk 46: 0 code + 17 data [9 data + 8 zero_fill], DATA TERRITORY — the entire 64 KiB is non-code
high-entropy graphics/texture asset data past the executable extent, continuing chunk 45's
`data_002E0D68` tail (0 jr$ra/0 prologues/0 pointers); 3 real PI-DMA cart-reads source this chunk
(romoff 0x2e1110/14c2/1872, archive-unmapped raw asset bytes); no code, no straddler;
chunk 45: 0 code + 15 data [8 data + 7 zero_fill], DATA TERRITORY — the entire 64 KiB is non-code
high-entropy graphics/texture asset data past the executable extent, continuing chunk 44's
`data_002CBA58` tail (0 jr$ra/0 prologues/0 pointers); no code, no straddler;
chunk 44: 0 code + 17 data [9 data + 8 zero_fill], DATA TERRITORY — the entire 64 KiB is non-code
high-entropy graphics/texture data PAST the executable extent 0x2B89B4 (0 jr$ra/0 prologues/0
pointers), continuing chunk 43's tail; no code, no straddler;
chunk 43: 81 code + 1 straddler-tail + 8 data, MIXED — the mission-briefing/scenario-overview
overlay CODE region 0x2B1000..0x2B89B8 then the evidenced code→data transition at 0x2B89B8 and an
F3DEX2 display-list/float-pool/texture DATA tail 0x2B89B8..0x2C1000; crosses the executable-extent
end 0x2B89B4; chunk ends in data, NO outgoing straddler;
chunk 39: 135 code + 19 data + 1 straddler-tail, MIXED — mission-briefing/combat display-list
code continuing chunks 36-38, wrapping THREE interior data islands (big data territory
0x273FFC..0x275850 [pointer/jump/float64 tables]; GBI display-list blob 0x279DA8..0x27A020;
tail small-int LUT+zero-fill 0x280D48..0x281000); chunk ends in data, NO outgoing straddler;
chunk 38: 230 code + 0 data + 2 straddlers, ALL CODE — FP/GBI display-list builders +
mission-briefing/combat dispatchers (continuation of chunks 36-37), frameless-leaf dense;
parent-gap frameless recoveries (288 B@0x2639D8 GBI builder, 796 B@0x2664A4 switch dispatch);
chunk 36: 134 code + 28 data + 2 straddlers, MIXED — mission-briefing/combat display-list
module wrapping TWO combat-overlay DATA islands (0x801D/0x801E pointer tables + GBI/RDP
display-list blobs + float/double pools + rodata strings) with frameless GBI builders and a
divide/scale-helper cluster recovered from parent gaps;
chunk 37: 170 code + 8 data + 2 straddlers, MIXED — command-dispatcher-heavy mission-briefing/
combat code wrapping a mixed 0x80x pointer/struct/float record-table DATA island, with heavy
parent-over-merge frameless-leaf recovery;
chunk 34: 89 code + 29 data + 2 straddlers, MIXED — promotion/level-up/class-def code
wrapping a combat-overlay DATA island (0x801D/0x801E handler/jump pointer tables + GBI/RDP
display-list blobs + float/double pools + message-string rodata);
chunk 35: 127 code + 5 data + 2 straddlers, MIXED — class/promotion/display-list code
wrapping a float-ramp + 0x801F pointer/double record-table DATA island, frameless-leaf dense;
chunk 16: 72 code + 23
data, MIXED — leading scenario record/pointer/float64 data + the neutral-encounter code path;
chunk 17: 66 code + 0 data, ALL CODE — char-data/encounter code;
chunk 18: 95 code + 0 data, ALL CODE — FP-heavy scenario/combat code;
chunk 19: 64 code + 16 data, MIXED — encounter/dispatcher code + a trailing scenario data region;
chunk 20: 89 code + 86 data, MIXED — scenario data tables (neutral_encounter 40×20, creature_drop 36×8) + a 125-string game-text pool + encounter/dispatcher code;
chunk 21: 94 code + 5 data, MIXED — class/character-lookup code + a trailing high-entropy/compressed data region with an outgoing data straddler;
chunk 22: 35 code + 64 data, MIXED — UI/text + weapon-type/terrain resource data wrapping FP-heavy menu/item/legion code, with incoming AND outgoing DATA straddlers;
chunk 23: 40 code + 33 data, MIXED 6-region — scenario/camera + char-data code interleaved with two large data islands the parent DB mislabeled as functions, ending in the outgoing FUNCTION straddler func_0017FF4C;
chunk 24: 40 code + 23 data, MIXED — FP/menu/display code wrapping a large ~26.7KB interior DATA region [font/tile bitmaps + fixed-stride record tables + 0x8021 pointer tables + float64 pool] the parent DB again missed, with incoming AND outgoing FUNCTION straddlers;
chunk 25: 59 code + 12 data, CODE-dominant MIXED — char/class/scenario code [incl. the documented record-builder func_0019554C] + a shop-dialogue string pool + 2 inline data islands, with incoming AND outgoing FUNCTION straddlers;
chunk 26: 81 code + 15 data, CODE-dominant MIXED — FP-heavy char/class/scenario/encounter code +
3 inline data islands [Soldier/Thrust labels + jump table; a ~1.9KB ramp-LUT/packed-record/double-pool
island after func_001A42A4; an options-menu string pool], incl. the ESET loader func_001A6D64 + the
reward-queue writer func_001AF828 + the 9.3KB dispatcher func_001A9290, with incoming AND outgoing
FUNCTION straddlers; chunk 27: 128 code + 14 data, CODE-dominant MIXED - FP-heavy class/char/
encounter/resource code + status/menu string table island + display-list/float/color-LUT island,
with incoming AND outgoing FUNCTION straddlers; chunk 28: 73 normal code + 22 data + 2 function
straddlers, MIXED - stronghold/tutorial text + pointer/GBI-like data + packed command/script
blobs + recovered frameless helpers; chunk 29: 97 normal code + 4 zero-fill data + 2 function
straddlers, CODE-dominant MIXED - dense world-map/resource code + recovered frameless helpers;
chunk 30: 89 normal code + 31 data + 2 function straddlers, MIXED - FP/RDP display-list
world-map/resource code wrapping the Sound-Test/BGM-selection screen + staff-credits data
territory; chunk 31: 84 normal code + 0 data + 2 function straddlers, ALL CODE - FP/GBI
display-list builders + attack/queue module code incl. the High-Attack cleanup-guard site
at z64 0x1F36F0; chunk 32: 196 normal code + 0 data + 2 function straddlers, ALL CODE -
frameless-leaf-dense FP/display-list + class-def/char-data code; chunk 33: 82 normal code +
25 data + 2 function straddlers, MIXED - code + a font/glyph + pointer/float DATA region
+ a jump-table state-machine straddler);
next is chunk 79 (`0x004F1000`, Section B cutscene anim-block family, parser-backed).

The assembled code-region SHA256 is
`40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`; the full
ROM rebuild SHA256 remains
`571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

Current full-ROM source manifest:

- 1,059 entries.
- 0 unknown bytes.
- 6,510,444 `original_mips` bytes.
- 35,432,596 non-code/raw/data/archive source bytes.
- 2,469,141 ambiguous bytes preserved explicitly.
- 3 tracked non-code source-owner files / 44,029 bytes.
- 1,055 ignored generated non-code source-owner fallback files / 35,388,567
  bytes.
- Source-manifest rebuild exact.

## Active Goal

Expand toward full-ROM no-gap source representation without losing exact rebuild
coverage or overclassifying data as MIPS.

## Full-ROM Coverage Track: Code/Data Boundary (opened 2026-06-21)

`tools/audit_code_region.js` (read-only; reports under
`build/coverage/rev0-code-region-audit.json/.md`) found that the configured code
region `0x00001000..0x0063676C` is conservative: executable MIPS only occupies
`0x00001000..0x002B89B4`, and the trailing `0x002B89B4..0x0063676C`
(3,661,240 bytes, 56.24%) has zero `jr $ra` and is non-code data emitted as
`.word` `original_mips`. Evidence and method: `docs/CODE_REGION_AUDIT.md`.

Review follow-up (2026-06-21): `audit_code_region.js` now also runs a static
control-flow edge audit and found **no credible code edge into the tail** (0
PC-relative branch targets, 0 J/JAL targets resolving to a known function; the 7
raw J/JAL-into-tail hits are an embedded data ramp table at `0x001A42A4`). The
tool also hardened parent-input handling (missing/corrupt parent DB is a hard
error unless `--allow-missing-parent-db`). The control-flow prerequisite for
reclassification is satisfied; the exact boundary is still unpinned, so do NOT
reclassify yet.

Next on this track (each step must keep `node tools/verify_setup.js` green):

1. Refine the exact code/data boundary near `0x002B89B4` (first/last `jr $ra`,
   alignment padding, any structural marker just past the last detected
   function). Treat the boundary byte as unproven until pinned.
2. Reclassify `0x002B89B4..0x0063676C` from `code`/`original_mips` to a data
   source form across `config/segments/rev0.yaml`, the coverage ledger, and the
   full-ROM source manifest. The original-MIPS extraction/assembly range shrinks
   to the executable extent; the tail becomes a data owner. The rebuilt ROM
   SHA256 must stay `571E8339...CC67A`.
3. Once the boundary is final, wire `audit_code_region.js` into a coverage gate
   so "no proven code outside the executable extent" stays enforced.

Run anytime:

```powershell
node tools/audit_code_region.js
```

## Ordered Work

1. Promote the next curated tracked non-code source-owner batch.

   The first tracked batch is done under `data/source-owners/rev0/`:
   `raw_header`, `raw_structural_gap`, and ambiguous `raw_tail_data`. Next,
   choose another small batch under `data/` or `assets/`. Keep archive gaps raw
   and explicitly ambiguous unless repeatable scanner evidence improves the
   classification.

2. Keep tracked-owner verification wired into the rebuild path.

   `tools/extract_non_code_sources.js` now prefers verified tracked owners and
   generates fallback owners for the rest. Keep `node tools/verify_setup.js`
   green after every promotion.

3. Section B cutscene anim-block family at chunk 79 (parser-backed natural-block run; Section A done).

   Chunks 0–78 (`0x00001000..0x004F1000`) are fully source-owned as named code/data
   parts: chunk 0 in `boot/`; chunks 1–78 in `lib/` (dossiers `lib-chunk1-…` … `lib-chunk47-…` +
   `section-a-00301000-00341000-data-ownership.md` + `section-a-00341000-003E1000-data-ownership.md` +
   `section-a-003E1000-00421000-data-ownership.md` + `section-a-audio-bank-00421000-00431000-data-ownership.md`
   + `section-a-audio-bank-tail-00431000-00441000-data-ownership.md` + `section-a-flat-audio-00441000-004E1000-data-ownership.md`
   + `section-a-to-b-boundary-004E1000-004F1000-data-ownership.md`).
   Chunk 43 (90 parts) is the MIXED code→data
   transition chunk. Chunks 44-47 + Section A slices 1-3 (chunks 48-65) are DATA TERRITORY: each entire
   64 KiB is non-code high-entropy asset data past the executable extent (0 jr$ra/0 prologues/0
   pointers), `data_` + `zero_fill_` parts; adversarial skeptics all clean. Chunk 66 is a DECODED N64
   audio sound-bank (PtrTablesV2 codebook + WaveTables samples, order-2 VADPCM; 8 structural parts);
   chunk 67 closes that bank's WaveTables payload (ends 0x431EF1) + flat post-tail audio (21 parts);
   chunks 68-77 are flat Section A audio sample payload (194 parts); chunk 78 crosses the Section A/B
   boundary (pinned 0x4E3140): Section A audio tail + Section B index table + payload + first cutscene-block
   head (4 parts). All of Section A (0x301000..0x4E3140) is AUDIO.
   Indexes `docs/data-index/rev0/chunk4{3,4,5,6,7}-data-region-inventory.json` +
   `section-a-00301000-00341000-data-inventory.json` + `section-a-00341000-003E1000-data-inventory.json`
   + `section-a-003E1000-00421000-data-inventory.json` + `section-a-audio-bank-00421000-00431000-data-inventory.json`
   + `section-a-audio-bank-tail-00431000-00441000-data-inventory.json` + `section-a-flat-audio-00441000-004E1000-data-inventory.json`
   + `section-a-to-b-boundary-004E1000-004F1000-data-inventory.json`.

   **Next frontier: `0x004F1000` (chunk 79).** The evidenced executable MIPS extent
   `0x1000..0x2B89B4` is **100.0000% source-owned**. Chunk 78 ended with the first cutscene block HEAD
   (tag 0x215, size 0x30C0 -> ends 0x4F4070) — OUTGOING into chunk 79. The Section A/B boundary is pinned
   at 0x4E3140; Section B begins there (index table 0x4E3140..0x4E6988 [shape decoded] + payload
   0x4E6988..0x4F0FB0 [undecoded] + the 63 cutscene audio-sequence blocks 0x4F0FB0..0x594280). FIRST
   action: continue the **Section B anim-block family** from 0x4F1000 — finish the first block body then
   the contiguous 63-block run as a PARSER-BACKED natural-block run (`ob64_anim_block_catalog.json` +
   `anim_block_codec.py`, gate-proven; preserve natural block boundaries, NOT flat tiling); settle the
   Section B header-payloadLen-vs-anim-block interpretation gap. Use
   `docs/templates/data-territory-source-ownership-run-prompt.md`.
   Pipeline: data-territory scans (entropy/string/pointer/zero) + tiling generator + adversarial
   data/parent swarm (Workflow). Coverage 100.0000% of the executable extent (code-only 85.7977%). See
   the DECOMP_LOG, `docs/data-index/rev0/data-territory-survey-00301000.json`, and the Section A slice-1 dossier.
   No new patch-workbench candidates in chunks 43-51; the chunk-33 candidates (`0x21CD48`/`0x21BF84`)
   and chunk-31 `0x1F36F0` stand (`candidate`/`needs-runtime`, RSR-011/RSR-014).

4. Keep the setup gate green.

   Re-run `node tools/verify_setup.js` after each split/promotion. Required
   result: PASS.

5. Name functions only from evidence.

   Use parent symbols, trace docs, and clear local labels. Avoid semantic naming
   unless runtime/controlled evidence supports it.

6. Promote more chunks deliberately.

   Use `tools/promote_original_mips.js` in small batches or when a subsystem
   needs that chunk. Do not commit the full generated 125 MB source set at once.

## Watch Items

- The parent archive catalog has missed whole sections in the past. Keep the
  independent LHA scan in the default coverage gate.
- The `archive/audio` overlap at `0x00925483..0x009254EF` is known and should
  remain visible until reconciled.
- Only the early boot region uses the simple `RAM = ROM + 0x8006FC00` mapping.
  Later code is overlay-loaded and needs overlay-aware address handling.
- Generated files under `build/` and `dist/` are local proof artifacts, not
  source files to commit.
