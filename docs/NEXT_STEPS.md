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

Current source mix: 41 tracked composite real-assembler chunks (chunk 0 177
`boot/`; chunks 1–40 in `lib/`: 350, 216, 67, 376, 88, 78, 103, 87, 34, 35, 191, 74, 67, 94, 153, 95, 66, 95, 80, 175, 99, 99, 73, 63, 71, 96, 142, 97, 103, 122, 86, 198, 109, 120, 134, 164, 180, 232, 155, 159) = 5,203 tracked
source files, plus 59 generated fallback chunks. **Chunks 0–40 are fully
source-owned as named code/data parts** (`0x00001000..0x00281000`;
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
next is chunk 41 (`0x00291000`).

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

3. Continue into chunk 40.

   Chunks 0–39 (`0x00001000..0x00281000`) are fully source-owned as named code/data
   parts: chunk 0 in `boot/`; chunks 1–39 in `lib/` (dossiers `lib-chunk1-…` …
   `lib-chunk39-…`). Chunk 39 (155 parts) is MIXED — mission-briefing/combat display-list
   code continuing chunks 36-38, wrapping THREE interior data islands (DATA A 0x273FFC..0x275850
   big territory [136/272-word pointer tables, packed blobs, float64 pool, 8-row jump table];
   DATA B 0x279DA8..0x27A020 GBI display-list blob; DATA C 0x280D48..0x281000 small-int LUTs +
   zero-fill + 640/480 screen-dim records). Data index
   `docs/data-index/rev0/chunk39-data-region-inventory.json`. Adversarial 7 verifiers all clean.
   Chunk 39 ENDS IN DATA — no outgoing straddler.

   **Next frontier: `0x00291000` (chunk 41).** No incoming straddler. FIRST action: classify
   the start of `0x00281000` (content/zero/ASCII/pointer-density + return/prologue scan); do not
   assume code. Pipeline: `dump_function_context`/`plan_chunk`/`carve_chunk`/`slice_chunk`/
   `check_splits`/`check_boundaries` + analysis + data + adversarial swarms (Workflow). Coverage
   now 94.3056% (code-only 80.2693%). See the DECOMP_LOG and `docs/dossiers/lib-chunk39-*.md`. No
   new patch-workbench candidates in chunk 38; the chunk-33 candidates (`0x21CD48`/`0x21BF84`)
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
