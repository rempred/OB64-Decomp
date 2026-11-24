# Review Handoff: Chunk 6 — game data + parent-undetected code (`0x00061000..0x00071000`)

For the next decomp agent / reviewer. Static/offline, byte-exact rebuild preserved.

- **Chunk:** 6, ROM `0x00061000..0x00071000` (65,536 B).
- **Commit:** see git log (message starts "Source-own Rev 0 chunk 6").
- **Composition:** 78 parts = **60 code `func_*` + 18 data** (three-part layout:
  DATA1 `0x61000..0x66E10` 11 parts; CODE `0x66E10..0x70E70` 60 func_ + 6 inline
  data islands; DATA2 `0x70E70..0x71000` 1 part).

## Files added/modified/removed
- Added: 78 `asm/original/rev0/lib/*.s`; NEW `tools/scan_functions.js`.
- Removed: temp whole-chunk `code_00061000_00071000.s` (`--remove-source`).
- Modified: `asm/original/rev0/manifest.json`; `tools/integrate_chunk.js`
  (context now optional, for parent-undetected regions).
- Docs: new dossier `docs/dossiers/lib-chunk6-61000-71000.md`; this review;
  updated `AGENTS.md`, `DECOMP_LOG.md`, `NEXT_STEPS.md`, `PLATFORM.md`.

## Key boundary decisions
- **Parent-detection gap:** the parent DB + overlay map have 0 entries in chunks
  6–7 (last fn `0x5C1A8` chunk 5; next `0x79730` chunk 8). The code region is
  parent-undetected; boundaries came from `scan_functions` (prologue seed) + the
  analysis swarm, NOT the parent DB.
- Code/data boundaries `0x66E10` (DATA1→CODE, first prologue) and `0x70E70`
  (CODE→DATA2, after the last `jr $ra`).

## Code/data classification evidence
- DATA1 = item/equipment data (record-table continuation from chunk 5, a large
  weapon/item name string pool, multiple RAM-pointer tables, float consts +
  `string_dsp()` debug text, byte-index tables). DATA2 = a packed F2/F3 record /
  offset-table blob (decodes as `j`/`sdc1` but is data; 0 returns/prologues).
- 6 inline pointer-table islands inside the code region (`data_000694b0`,
  `table_00069618` ~166 ptrs, `data_000698dc`, `0x6E5xx` family) — RAM-pointer
  words, not code.

## Parent DB contradictions discovered
- The parent DB MISSES this entire region (not just frameless leaves — it detects
  0 functions across ~41 KB of real code). `scan_functions.js` was built for this.

## Frameless leaves recovered / preamble-orphans
- Many functions here are preceded by a 2-word global-load preamble (`lui/lw
  $vN,-0x59A0`). The analysis swarm folded 4; the adversarial pass found 3 more
  (`0x68C88`, `0x68FB0`, `0x6B488`). One frameless leaf (`0x6E660`) was recovered
  from a data part's tail by the adversarial pass.

## Data islands / jump tables
- 6 inline pointer-table islands (above). No host-CPU jump tables (the indirect
  `jr $v0` sites are switch dispatches reading relocated-RAM tables, inside their
  functions).

## Straddlers
- **In (data):** `data_00061000` continues chunk 5's 0x10-stride record table.
- **Out (data):** `data_00070e70` (packed record/offset blob) straddles into
  chunk 7 — chunk 7 likely opens with its continuation.

## Mistakes corrected (this chunk)
- 2 slice-seam preamble straddler-head mislabels folded (analysis swarm artifact).
- 2 delay-slot leaks fixed (agents ended functions on the `jr $ra`).
- 6 adversarial fixes (3 preamble folds, 1 data→table rename, 1 code-in-data
  recovery `0x6E660`, 1 data-part merge `0x70FD4`→`data_00070e70`).

## Verification (all PASS)
- `node tools/check_manifest.js` → ALL PASS (1,352 parts).
- `node tools/check_boundaries.js --splits build/chunk_00061000-00071000_splits.json --disasm build/original-mips/rev0/code_00061000_00071000.s` → PASS.
- `node tools/assemble_original_mips.js` → byte-exact (`40D4E787…B409`).
- `node tools/verify_setup.js` → PASS (7 chunks / 1,352 files / 93 fallback; ROM `571E8339…CC67A`).
- `node tools/audit_code_region.js` → OK; `git diff --check` → clean; 0 data files with function wording.

## Current frontier after chunk 6
- **`0x00071000` (chunk 7).** Tracked files **1,352**; fallback **93**; coverage **16.10 %**.

## Next chunk's required first action
- Classify chunk 7's start: `data_00070e70` straddles in. Verify whether
  `0x71000+` continues that packed-record/offset blob (→ a `data_00071000`
  continuation) or transitions to code. Chunk 7 is parent-undetected (next parent
  fn is `0x79730` in chunk 8) — use `scan_functions` for its code region(s).

## Unresolved caveats
- Code names are conservative overlay address labels. DATA1's record/pointer-table
  field semantics and the weapon-name→index wiring are not yet resolved. DATA2's
  packed blob format (compressed graphics / ucode-style?) is unidentified.
