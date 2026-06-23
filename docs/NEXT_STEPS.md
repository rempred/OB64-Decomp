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

Current source mix: 30 tracked composite real-assembler chunks (chunk 0 177
`boot/`; chunks 1–29 in `lib/`: 350, 216, 67, 376, 88, 78, 103, 87, 34, 35, 191, 74, 67, 94, 153, 95, 66, 95, 80, 175, 99, 99, 73, 63, 71, 96, 142, 97, 103) = 3,544 tracked
source files, plus 70 generated fallback chunks. **Chunks 0–29 are fully
source-owned as named code/data parts** (`0x00001000..0x001E1000`; chunk 16: 72 code + 23
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
straddlers, CODE-dominant MIXED - dense world-map/resource code + recovered frameless helpers);
next is chunk 30 (`0x001E1000`).

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

3. Continue into chunk 30.

   Patch-workbench backfill prerequisite: read
   `docs/REVIEW_2026-06-23_patch-workbench-backfill.md` and
   `docs/patch-workbench/rev0/patch-workbench-backfill-2026-06-23.json`
   before splitting chunk 30. Keep any patch-workbench harvest lightweight and
   subordinate to source ownership.

   Chunks 0–29 (`0x00001000..0x001E1000`) are fully source-owned as named code/data
   parts: chunk 0 in `boot/`; chunks 1–29 in `lib/` (dossiers `lib-chunk1-…` …
   `lib-chunk29-…`). Chunks 13–16 and 19–29 are MIXED; chunks 17–18 are ALL CODE.
   Chunk 29 (103 parts: 97 normal code + 4 zero-fill data + 2 function straddlers)
   is CODE-dominant MIXED: incoming `func_001D0694_chunk29tail`, dense world-map/resource
   code, recovered frameless helpers at `0x1D9338` and `0x1E0A38`, four tiny zero-fill
   data islands, and outgoing FUNCTION straddler `func_001E0FC8`. Data index
   `docs/data-index/rev0/chunk29-data-region-inventory.json`.

   **Next frontier: `0x001E1000` (chunk 30).** FIRST continue the OUTGOING FUNCTION straddler:
   `func_001E0FC8` starts in chunk 29 at `0x001E0FC0` with the parent prologue at
   `0x001E0FC8`, has no `jr$ra` before the chunk boundary, and must be emitted first in
   chunk 30 as `func_001E0FC8_chunk30tail` starting at `0x001E1000`.
   Pipeline: `slice_extract`/`check_splits`/`check_boundaries` + analysis + adversarial swarms
   (Workflow) + a data-classification/index/export swarm for data regions.
   Coverage now 69.0045% (code-only 56.4735%). See the DECOMP_LOG "Next Frontier" and
   `docs/dossiers/lib-chunk29-1D1000-1E1000.md`.

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
