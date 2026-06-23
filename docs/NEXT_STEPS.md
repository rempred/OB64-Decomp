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

Current source mix: 11 tracked composite real-assembler chunks (chunk 0 177
`boot/`; chunks 1–10 in `lib/`: 350, 216, 67, 376, 88, 78, 103, 87, 34, 35) = 1,611 tracked
source files, plus 89 generated fallback chunks. **Chunks 0–10 are fully
source-owned as named code/data parts** (`0x00001000..0x000B1000`; chunk 7: 80 code
+ 1 straddler-head + 22 data; chunk 8: 61 code + 2 straddler + 24 data; chunk 9: 32
code + 2 straddler + 0 data, ALL CODE; chunk 10: 33 code + 2 straddler + 0 data, ALL
CODE); next is chunk 11 (`0x000B1000`).

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

3. Continue into chunk 11.

   Chunks 0–10 (`0x00001000..0x000B1000`) are fully source-owned as named code/data
   parts: chunk 0 in `boot/`; chunks 1–10 in `lib/` (dossiers `lib-chunk1-…` …
   `lib-chunk10-…`). Chunks 9 and 10 were both ALL CODE (army-mgmt / F3DEX display-list
   builders). Chunk 10 (35 parts: 33 code + 2 straddler + 0 data) needed 3
   preamble-orphan folds + 7 recovered frameless leaves (incl. the 6,944 B
   `func_000AB6D8` un-merged from a parent over-merge) + 5 jump-table dispatchers
   (tables in `0x801EF…` relocated RAM); adversarial pass (4 refuters + 1 data-hunter)
   found 0 disproofs and no inline data.

   **Next frontier: `0x000B1000` (chunk 11).** FIRST continue the function straddler:
   `func_000B0BFC_chunk10head` `[0xB0BFC,0xB1000)` (true entry 0xB0BFC) continues to
   `0x000B1F00` (chunk-11 tail file `func_000B0BFC_chunk11tail` `[0xB1000,0x000B1F00)`).
   Chunk 11 has 113 parent function labels and 654 nops (a different profile from
   chunks 9–10) — content-scan for data regions FIRST. `plan_chunk`+
   `dump_function_context` should seed parent-detected code; use `scan_functions` for
   parent-undetected sub-regions. Pipeline: `scan_functions` or `plan_chunk`/
   `slice_chunk --disasm`/`integrate_chunk` (context optional)/`check_splits`/
   `check_boundaries` + analysis + adversarial swarms (Agent-tool, one per
   slice/region). The 10% executable target `0x000468F8` is surpassed (coverage now
   25.3016%, code-only ≈ 20.71%). See the DECOMP_LOG "Next Frontier" and
   `docs/dossiers/lib-chunk10-A1000-B1000.md`.

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
