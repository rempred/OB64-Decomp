# Review Handoff: 2026-06-23 Chunks 26-27 Source Ownership (`0x001A1000..0x001C1000`)

## Summary

Codex takeover completed the interrupted source-ownership pass. Chunk 26 had already
been committed; chunk 27 was mechanically present but still needed cleanup, stale-doc
fixes, verification, and this handoff.

- Chunk 26: `0x001A1000..0x001B1000`, 96 parts, 81 code + 15 data.
- Chunk 27: `0x001B1000..0x001C1000`, 142 parts, 128 code + 14 data.
- Current source-owned frontier: `0x001C1000` (chunk 28).
- Current source mix: 28 tracked composite chunks, 3,344 tracked source files, 72 generated fallback chunks.
- Source-owned bytes: `0x1000..0x1C1000` = 1,835,008 bytes = 64.4042% of executable extent.
- Code-only classified bytes: 1,514,224 bytes = 53.1455%.

## Commits

- `e579642` - Source-own Rev 0 chunk 26 (`0x1A1000..0x1B1000`).
- `6505d41` - Add patch-workbench guidance to source-ownership prompts.
- `9e13042` - Source-own Rev 0 chunk 27 (`0x1B1000..0x1C1000`).

This review handoff is intentionally separate from those commits.

## What Changed

Chunk 26 source-owned the FP-heavy char/class/scenario/encounter slice with three
inline data islands, including UI labels, ramp/LUT/record tables, option/debug-menu
strings, and the outgoing `func_001B0F78` straddler head.

Chunk 27 source-owned the next 64 KiB as a CODE-dominant mixed range:

- Incoming function tail: `func_001B0F78_chunk27tail` at `0x001B1000..0x001B1070`.
- Main status/menu data island: `0x001B226C..0x001B2670`, including 18 decoded strings, packed tables, double pools, and RAM-pointer tables.
- Display-list/float/color-LUT island: `0x001B9920..0x001BA050`.
- Small zero-fill islands: `0x001B1504..0x001B1510`, `0x001B24A4..0x001B24BC`, `0x001B2664..0x001B2670`, and `0x001BBFA8..0x001BBFB0`.
- Notable code leads: `func_001B6538`, `func_001B902C`, `func_001B924C`, `func_001BC020`, `func_001BDD70`, `func_001BDE70`, and `func_001BDF2C`.
- Outgoing function head: `func_001C0FC8` at `0x001C0FC8..0x001C1000`; continue it first in chunk 28 as `func_001C0FC8_chunk28tail`.

## Takeover Fixes

- Removed eight duplicate same-case labels after read-before-write preambles in chunk 27 files. These assembled as duplicate symbols before cleanup.
- Refreshed manifest `textBytes` and `sha256` metadata for the nine edited asm files.
- Corrected the chunk 27 data-region inventory so the two isolated zero-fill pads no longer appear as one giant range spanning code.
- Replaced stale `@`-control-code wording for `chunk27-status-menu-1B226C`; the actual strings use raw `\x0E`, `\x10`, and `\x0F` bytes.
- Updated stale current-state docs from chunk 26 frontier to chunk 28 frontier.
- Kept the patch-workbench prompt/template framework in a separate commit from the chunk source-owner commit.

## Patch Workbench Harvest

No patch-workbench artifact was created for chunks 26-27. The pass did not naturally
encounter a static patch site that could be classified beyond existing parent-project
seeds. Any future hook-site claims should remain `candidate`, `rejected`, or
`needs-runtime` unless backed by runtime trace, controlled mutation, or equivalent proof.

Relevant caveats for future harvesting:

- Overlay/RAM mapping remains non-linear; do not back-map `0x8022/0x8023` decode-column addresses as simple ROM offsets.
- Chunk 27 parent evidence notes observed overlay mapping around ROM `0x001B1518` -> RAM `0x801BFE28`.
- Resource-loader and display-list builders are useful provenance leads, but not proven patch sites by themselves.

## Verification

All checks below were run from `C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp`.

- `node tools/check_manifest.js` -> ALL CHECKS PASS (28 chunks).
- `node tools/check_boundaries.js --splits build/chunk_001B1000-001C1000_splits.json --disasm build/original-mips/rev0/code_001B1000_001C1000.s` -> PASS, 142 parts, no fragment/cross/under/leak/straddler/data-island warnings.
- `node tools/check_splits.js --splits build/chunk_001B1000-001C1000_splits.json --disasm build/original-mips/rev0/code_001B1000_001C1000.s` -> PASS, 142 splits, no <=12B non-data fragments.
- `node -e` JSON parse for `chunk27-data-region-inventory.json`, `chunk27-status-menu-1B226C.json`, and `asm/original/rev0/manifest.json` -> OK.
- `git diff --check` and `git diff --cached --check` -> clean.
- `node tests/binutils_smoke.js` -> PASS.
- Targeted real-assembler probes for the fixed preamble files `func_001B1518.s`, `func_001B2DCC.s`, and `func_001BA3EC.s` -> PASS.
- `node tools/assemble_original_mips.js` -> Exact code-region match PASS; code SHA `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- `node tools/verify_setup.js` -> PASS; ROM SHA `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
- `node tools/audit_code_region.js` -> OK.

## Current Frontier

Next normal source-ownership work starts at chunk 28, `0x001C1000..0x001D1000`.
First action: continue outgoing function straddler `func_001C0FC8` as
`func_001C0FC8_chunk28tail`, then resolve the rest of chunk 28.

Per the coordinator plan, the next Claude prompt should be the one-shot Rev 0
patch-workbench backfill/recursive audit before resuming normal two-chunk work.
