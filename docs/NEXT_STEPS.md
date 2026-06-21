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

Current source mix: 2 tracked composite real-assembler chunks
(`0x00001000..0x00011000` from 177 files in `boot/`; `0x00011000..0x00021000`
from 350 files in `lib/`) = 527 tracked source files, plus 98 generated fallback
chunks. **Chunks 0 and 1 are fully split into named functions**
(`0x00001000..0x00021000`); next is chunk 2 (`0x00021000`).

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

3. Continue splitting into chunk 2.

   Chunks 0 and 1 (`0x00001000..0x00021000`) are fully split into named functions:
   chunk 0 boot/resource/codec/libc/vec3 in `boot/` (dossiers
   `boot-resource-decode-subsystem-B030-F22C.md`, `boot-codec-libc-vec3-F22C-11000.md`),
   and chunk 1 in `lib/` — a graphics/unit-script + math + libc + libultra-OS
   library (dossier `lib-chunk1-11000-21000.md`).

   **Next frontier: `0x00021000` (chunk 2).** No blocker — the
   `promote_original_mips.js` merge fix is done and proven. Pipeline:
   `node tools/promote_original_mips.js --chunk code_00021000_00031000.s`
   (merges + seeds a splittable part), then
   `node tools/dump_function_context.js --start 0x21000 --end <next>`, build a
   base partition, run the analyze→adversarial-review swarm, integrate into a
   `--splits-file` JSON, and `node tools/split_original_mips_part.js --part <chunk2
   file> --splits-file <json> --remove-source`. Expect the same parent-DB defects
   (hidden tiny jal-reachable leaves, preamble-orphans, dual-entries) — validate
   every boundary from disasm; default names to `func_XXXXXXXX` unless evidence is
   hard.

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
