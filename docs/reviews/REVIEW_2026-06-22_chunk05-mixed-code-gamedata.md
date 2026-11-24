# Review Handoff: Chunk 5 — mixed overlay code + game-data tail (`0x00051000..0x00061000`)

For the next decomp agent / reviewer. Static/offline, byte-exact rebuild preserved.

- **Chunk:** 5, ROM `0x00051000..0x00061000` (65,536 B).
- **Commit:** see git log (this chunk's commit message starts "Source-own Rev 0 chunk 5").
- **Composition:** 88 parts = **76 code `func_*` + 1 straddler-tail marker + 11 data parts** (code `0x5148C..0x5C208`; data `0x5C208..0x61000`).

## Files added/modified/removed
- Added: 88 `asm/original/rev0/lib/*.s` (chunk 5).
- Removed: temp whole-chunk `code_00051000_00061000.s` (promoted then `--remove-source`).
- Modified: `asm/original/rev0/manifest.json` (chunk 5 = 88 parts).
- Tools: `tools/check_splits.js` (self-documenting/safe args — committed separately `c1b8822`); `tools/slice_chunk.js` (+`--disasm` override for mixed chunks); `tools/check_boundaries.js` (NEW reusable deterministic boundary gate; + straddler-position check).
- Docs: new dossier `docs/dossiers/lib-chunk5-51000-61000.md`; this review; updated `AGENTS.md`, `DECOMP_LOG.md`, `NEXT_STEPS.md`, `PLATFORM.md`, `WORKFLOW.md`.

## Key boundary decisions
- **Code/data boundary `0x5C208`** (3 signals: overlay map 0 fns ≥ here; 0 `jr $ra` + 0 prologues in the tail; pointer/ASCII density). Code region split via the function pipeline; data region via a dedicated data-classification swarm.
- Both code-region "gaps" (632 B `0x51A50`, 4548 B `0x5AFE4`) were frameless-leaf/stub clusters, not data.

## Code/data classification evidence
- Data tail = game data: F3DEX2 GBI display-list image (`data_0005c208`), AI-behaviour/element/attack name string pools (`rodata_*`), pointer/descriptor/order tables (`table_*`), and two fixed-stride record tables (`data_0005db18` 0x48-stride ×165, `data_00060980` 0x10-stride ×~104). Full map in the dossier. All `kind:"data"`, no function wording.

## Parent DB contradictions discovered
1. **The straddler-tail was itself an over-merge.** `func_00050F98` (parent size 1268 → claimed end `0x5148C`) actually ends at **`0x51400`** (`jr $ra` 0x513F8, epilogue `addiu $sp,0x30`). Parent over-merged it with two frameless leaves `func_00051400` (digit/atoi parse) and `func_00051450` (char-class check). Corrects the chunk-4 record (chunk-4 straddler-head file is unchanged/byte-exact; only `func_00050F98`'s end moved `0x5148C → 0x51400`).
2. Multiple per-function over-merges un-merged into frameless-leaf clusters (slices 1–6 notes).

## Frameless leaves recovered
~33 (43 parent fns → 76 code func_ parts; the 4548 B gap alone held a stub+leaf cluster).

## Data islands / jump tables
- No inline jump tables in the code region (the indirect `jr` at `0x517A4`/`0x511C8` are bounds-checked switch dispatches reading relocated-RAM tables; stay inside their functions).
- The data region's tables are pointer/index/record tables, all RAM-pointer-valued.

## Straddlers
- **In:** `func_00050f98_chunk5tail` `[0x51000,0x51400)` (tail of `func_00050F98`; head in chunk 4).
- **Out (data):** `data_00060980` (0x10-stride record table) **straddles** — record at `0x60FFC` is incomplete and continues at `0x61000`. Chunk 6 likely opens with that continuation.

## Mistakes corrected (this chunk)
- A slice agent mislabeled a 2-word read-before-write preamble at the slice-5/6 seam (`0x58478`) as a `straddler-head`; folded into `func_00058478` (true entry). Hardened `check_boundaries.js` to auto-flag a straddler-head not ending at chunk end / straddler-tail not at chunk start.
- Adversarial fixes: straddler-tail over-merge (above); `rodata_0005ce70`'s last 8 bytes were the `0x5CEBC` order table, not string pad.

## Verification (all PASS)
- `node tools/check_manifest.js` → ALL PASS (1,274 parts).
- `node tools/check_boundaries.js --splits build/chunk_00051000-00061000_splits.json --disasm build/original-mips/rev0/code_00051000_00061000.s` → PASS (0 fragment/cross/under/leak/straddler).
- `node tools/check_splits.js --splits … --disasm …` → 0 fragments.
- `node tools/assemble_original_mips.js` → byte-exact (`40D4E787…B409`).
- `node tools/verify_setup.js` → PASS (6 chunks / 1,274 files / 94 fallback; ROM `571E8339…CC67A`).
- `node tools/audit_code_region.js` → OK; `git diff --check` → clean; 0 data files with function wording.

## Current frontier after chunk 5
- **`0x00061000` (chunk 6).** Tracked source files **1,274**; fallback chunks **94**; coverage **13.80 %**.

## Next chunk's required first action
- Classify chunk 6's start: the `0x10`-stride record table `data_00060980` straddles into `0x61000`. Verify whether `0x61000+` continues that data table (→ `data_00061000` continuation) or is code, BEFORE planning. Then `dump_function_context --start 0x61000 --end 0x71000`, classify code/data via the overlay map, and run the pipeline.

## Unresolved caveats
- Code names are conservative overlay address labels. Data record-table field semantics (beyond the per-record RAM pointer) are unknown. The string pools are identified but not yet wired to their index tables.
