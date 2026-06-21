# Decomp Log

This is the running memory file for the nested Rev 0 decomp repo. Keep it short
enough for future agents to read every session. When it approaches roughly
10,000 tokens, condense the current state here and archive the previous full log
under `docs/archive/`.

## 2026-06-21 - Loop 1, Boot Entry Split

Target:

- ROM `0x00001000..0x00001060`.
- RAM `0x80070C00..0x80070C60`.
- Named source: `asm/original/rev0/boot/boot_entry_clear_bss.s`.
- Dossier: `docs/dossiers/boot-entry-clear-bss.md`.

Baseline:

- `node tools\verify_setup.js` passed before edits.
- Rev 0 CRC `E6419BC5/69011DE3`.
- Coverage ledger: 825 archives, zero unknown bytes, 108 visible overlap bytes.
- Code-region SHA256:
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- Full ROM SHA256:
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

Source-layout change:

- The tracked first chunk `0x00001000..0x00011000` is now represented by
  ordered manifest parts.
- Part 1: `boot_entry_clear_bss_and_jump`,
  `asm/original/rev0/boot/boot_entry_clear_bss.s`,
  `0x00001000..0x00001060`, 96 bytes.
- Part 2: `code_00001060_00011000_remainder`,
  `asm/original/rev0/code_00001060_00011000.s`,
  `0x00001060..0x00011000`, 65,440 bytes.

Tooling change:

- `tools/assemble_original_mips.js` now understands `manifest.json` chunk
  `parts`, assembles each tracked part through GNU MIPS binutils, verifies each
  part size, then concatenates them back into the original no-gap chunk.
- `tests/binutils_smoke.js` now verifies all parts of the first tracked chunk,
  not just a single monolithic source file.

Static findings:

- ROM header entry point is `0x80070C00`.
- The early boot mapping gives ROM `0x00001000` -> RAM `0x80070C00`.
- The stub clears `0x3AE70` bytes from `0x800AEDB0` through exclusive end
  `0x800E9C20`.
- The stub sets `sp = 0x800C6D60` in a branch delay slot and jumps to
  `0x8007F880`.
- There is no stack frame and no `jal` call in the target range.

Verification:

- `node tests\binutils_smoke.js` passed after the split.
- `node tools\assemble_original_mips.js` passed after the split.
- Full `node tools\verify_setup.js` passed after the split.
- Final source mix: 1 tracked real-asm chunk, represented as 1 manifest
  composite with 2 tracked source files, plus 99 generated fallback chunks.
- Final code-region SHA256:
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- Final full-ROM SHA256:
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

## 2026-06-21 - Phase 2, Full-ROM Source Manifest

Target:

- Expand from code-region original-MIPS proof toward full-ROM no-gap source
  ownership.
- Keep non-code bytes represented as raw/archive/compressed/audio/padding source
  strategies instead of disassembling data as instructions.

Baseline:

- `node tools\verify_setup.js` passed before edits.
- Baseline source mix stayed 1 tracked composite real-asm chunk, 2 tracked source
  files, and 99 generated fallback chunks.
- Baseline code SHA256:
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- Baseline full-ROM SHA256:
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

Tooling change:

- Added `tools/build_full_source_manifest.js`.
- `tools/verify_setup.js` now runs that tool and requires
  `fullSourceManifestNoGap` plus `fullSourceManifestNoUnknownBytes`.
- Generated reports are ignored:
  `build/source-manifest/rev0-full-source-manifest.json/.md`.

Current source ownership:

- Entries: 1,059 contiguous ROM spans.
- ROM bytes covered: 41,943,040 / 41,943,040.
- Unknown bytes: 0.
- `original_mips`: 6,510,444 bytes.
- Non-code/raw/data/archive source forms: 35,432,596 bytes.
- Ambiguous bytes preserved explicitly: 2,469,141.

Source-form byte totals:

- `raw_header`: 4,096.
- `original_mips`: 6,510,444.
- `raw_structural_gap`: 24.
- `lha_archive`: 5,041,336.
- `raw_archive_gap`: 2,429,124.
- `raw_audio_data`: 20,065,069.
- `raw_lzss_region`: 7,188,782.
- `raw_tail_data`: 39,909.
- `padding_ff`: 664,256.

Code-bearing evidence:

- Configured code region remains `0x00001000..0x0063676C`.
- Parent function DB count: 3,683.
- Parent overlay source hints from `../ram_snapshots/overlay_sources.json` are
  recorded in the generated manifest and all sit inside the configured code
  region.

Open ambiguities:

- 524 `raw_archive_gap` spans / 2,429,124 bytes.
- Known 108-byte archive/audio overlap.
- `raw_tail_data` at `0x0275415B..0x0275DD40`.

Next recommended target:

- Add a non-code source generator under `data/bin/`, `data/archives/`, or
  `assets/`, then teach the rebuild path to consume the full source manifest
  rather than only `build/segments/rev0/raw/`.

## 2026-06-21 - Phase 3, Non-Code Source Owners

Target:

- Move from a full-ROM source ownership audit to a rebuild path that actually
  consumes source-owner files for every non-code span.
- Keep generated owner files ignored for now; do not commit 35 MB of bulk raw
  bytes until the tracked `data/`/`assets/` layout is deliberately chosen.

Baseline:

- `node tools\verify_setup.js` passed before edits.
- Full-ROM source manifest already had 1,059 entries, 0 unknown bytes, and
  2,469,141 ambiguous bytes preserved explicitly.

Tooling change:

- Added `tools/extract_non_code_sources.js`.
- Added `tools/rebuild_from_source_manifest.js`.
- `tools/verify_setup.js` now requires:
  - `nonCodeSourceOwnersExact`
  - `sourceManifestRebuildExact`

Generated source-owner result:

- Manifest: `build/source-owners/rev0/manifest.json`.
- Owner files: 1,058 generated non-code files under ignored
  `build/source-owners/rev0/`.
- Non-code owner bytes: 35,432,596.
- Ambiguous bytes preserved: 2,469,141.
- Raw segment hashes all matched the source-owner bytes.

Generated owner distribution:

- `lha_archive`: 528 files / 5,041,336 bytes.
- `raw_archive_gap`: 524 files / 2,429,124 bytes.
- `raw_audio_data`: 1 file / 20,065,069 bytes.
- `raw_lzss_region`: 1 file / 7,188,782 bytes.
- `raw_header`: 1 file / 4,096 bytes.
- `raw_structural_gap`: 1 file / 24 bytes.
- `raw_tail_data`: 1 file / 39,909 bytes.
- `padding_ff`: 1 file / 664,256 bytes.

Rebuild proof:

- `node tools\rebuild_from_source_manifest.js` rebuilt from
  `build/assembled/rev0/code.bin` plus the generated source-owner files.
- Output: `dist/rebuilt.us_rev0.source-manifest.z64`.
- SHA256:
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
- Exact byte match: PASS.

Next recommended target:

- Promote/curate a tracked non-code source layout under `data/` or `assets/` in
  deliberate batches, then let the source-owner manifest point to tracked source
  where appropriate while keeping bulky generated proof outputs ignored.

## 2026-06-21 - Phase 4, Initial Tracked Non-Code Owners

Target:

- Promote a small, low-risk non-code owner batch into tracked `data/` source.
- Keep unpromoted non-code bytes covered by generated fallback owners.

Baseline:

- `node tools\verify_setup.js` passed before edits.
- Baseline source owners: 1,058 generated non-code files / 35,432,596 bytes.
- Baseline full ROM SHA256:
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

Tooling change:

- Added `tools/promote_non_code_sources.js`.
- `tools/extract_non_code_sources.js` now accepts a tracked source-owner
  manifest, verifies each tracked owner by range, source form, length, and
  SHA256, and prefers tracked files over generated `build/` owners.
- `tools/verify_setup.js` now reports tracked vs generated non-code owner counts.

Tracked source-owner batch:

- `data/source-owners/rev0/raw_header/0000_raw_header_00000000_00001000.srcbin`
  covers `0x00000000..0x00001000`, 4,096 bytes.
- `data/source-owners/rev0/raw_structural_gap/0002_raw_structural_gap_0063676C_00636784.srcbin`
  covers `0x0063676C..0x00636784`, 24 bytes.
- `data/source-owners/rev0/raw_tail_data/1057_raw_tail_data_0275415B_0275DD40.srcbin`
  covers `0x0275415B..0x0275DD40`, 39,909 bytes, still explicitly ambiguous.
- Tracked manifest: `data/source-owners/rev0/manifest.json`.

Verification:

- `node tools\extract_non_code_sources.js` passed with 3 tracked owner files /
  44,029 bytes and 1,055 generated fallback files / 35,388,567 bytes.
- `node tools\rebuild_from_source_manifest.js` rebuilt exact.
- Full `node tools\verify_setup.js` passed after the promotion.
- Final source-manifest rebuild SHA256:
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

Next recommended target:

- Promote the next deliberate non-code source-owner batch or return to splitting
  tracked original-MIPS source, keeping the full verifier green.

## 2026-06-21 - Phase 5, Boot Resource Arena Split

Target:

- Continue source-layout cleanup inside the first tracked original-MIPS chunk.
- Split permanent boot/resource code after the entry stub while preserving
  no-gap coverage and exact assembled bytes.

Baseline:

- `node tools\verify_setup.js` passed before edits.
- Baseline source mix: 1 tracked composite real-asm chunk made from 2 tracked
  files, plus 99 generated fallback chunks.
- Baseline code-region SHA256:
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- Baseline full ROM SHA256:
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

Tooling change:

- Added `tools/split_original_mips_part.js`.
- The splitter replaces one tracked manifest part with smaller contiguous parts,
  preserving the original `.word` lines and decode comments for each z64 range.

Source-layout change:

- Removed superseded
  `asm/original/rev0/code_00001060_00011000.s`.
- Added `asm/original/rev0/boot/resource_arena_init.s`,
  `0x00001060..0x00001120`, 192 bytes.
- Added `asm/original/rev0/boot/resource_arena_register.s`,
  `0x00001120..0x00001330`, 528 bytes.
- Added `asm/original/rev0/boot/resource_alloc.s`,
  `0x00001330..0x000014DC`, 428 bytes.
- Added remainder `asm/original/rev0/code_000014DC_00011000.s`,
  `0x000014DC..0x00011000`, 64,292 bytes.
- Static dossier: `docs/dossiers/boot-resource-arena-and-alloc.md`.

Evidence:

- Parent `../scripts/ob64_symbols_v2.json` locates `0x1060`, `0x1120`,
  `0x1128`, and `0x1330` in all 21 RAM snapshots and all seven known states.
- Parent seed label for `0x00001330` is `resource_alloc`; it has 314 parent
  callers.
- `0x1120` and `0x1128` are overlapping scanner entries and stay in the same
  source file; `0x1128` has a secondary entry at `0x1314`.

Verification:

- `node tests\binutils_smoke.js` passed after the split.
- `node tools\assemble_original_mips.js` passed after the split.
- Full `node tools\verify_setup.js` passed after the split.
- Assembled report now shows 1 tracked composite real-asm chunk made from 5
  tracked source files, plus 99 generated fallback chunks.
- Code-region SHA256 remains:
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- Full ROM SHA256 remains:
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

Next recommended target:

- Continue from `asm/original/rev0/code_000014DC_00011000.s`, likely around
  `func_000014DC`, or promote another small tracked non-code owner batch.

## 2026-06-21 - Phase 6, Boot Resource Alloc/Free Split

Target:

- Continue source-layout cleanup inside the first tracked original-MIPS chunk.
- Split the allocator/free family immediately after parent seed
  `resource_alloc`, preserving the exact assembled-code rebuild.

Baseline:

- `node tools\verify_setup.js` passed before edits.
- Baseline source mix: 1 tracked composite real-asm chunk made from 5 tracked
  files, plus 99 generated fallback chunks.
- Baseline code-region SHA256:
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- Baseline full ROM SHA256:
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

Source-layout change:

- Removed superseded
  `asm/original/rev0/code_000014DC_00011000.s`.
- Added `asm/original/rev0/boot/resource_alloc_alt_scan.s`,
  `0x000014DC..0x00001688`, 428 bytes.
- Added `asm/original/rev0/boot/resource_alloc_mode1_wrapper.s`,
  `0x00001688..0x000016C4`, 60 bytes.
- Added `asm/original/rev0/boot/resource_free.s`,
  `0x000016C4..0x000017EC`, 296 bytes.
- Added `asm/original/rev0/boot/resource_largest_free_block.s`,
  `0x000017EC..0x000018D4`, 232 bytes, keeping the `0x17EC/0x17F0`
  prefix with `func_000017F4`.
- Added remainder `asm/original/rev0/code_000018D4_00011000.s`,
  `0x000018D4..0x00011000`, 63,276 bytes.
- Static dossier: `docs/dossiers/boot-resource-alloc-free.md`.

Evidence:

- Parent `../scripts/ob64_symbols_v2.json` locates `0x14DC`, `0x1688`,
  `0x16C4`, `0x17F4`, and `0x18D4` in all 21 RAM snapshots and all seven
  known states.
- Parent seed label for `0x000016C4` is `resource_free`; it has 427 parent
  callers.
- `0x1688` has 15 parent callers and wraps seed `resource_alloc` at
  `0x80070F30` while forcing `0x800BEDE2 = 1`.
- `0x17EC/0x17F4` scans arena free-list nodes rooted at `0x800BEDB8` and
  returns the maximum observed node `+0x18` field.

Verification:

- `node tests\binutils_smoke.js` passed after the split.
- `node tools\assemble_original_mips.js` passed after the split.
- Full `node tools\verify_setup.js` passed after the split.
- Assembled report now shows 1 tracked composite real-asm chunk made from 9
  tracked source files, plus 99 generated fallback chunks.
- Code-region SHA256 remains:
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- Full ROM SHA256 remains:
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

Next recommended target:

- Continue from `asm/original/rev0/code_000018D4_00011000.s`, likely with the
  allocator pointer-validation/assert helper at `func_000018D4`, or promote
  another small tracked non-code owner batch.

## 2026-06-21 - Phase 7, Boot Resource Validation/Realloc/Tree Split

Target:

- Continue source-layout cleanup inside the first tracked original-MIPS chunk.
- Split the allocator validation, realloc-like, tree, and arena-index helpers
  before the early boot init dispatcher at `0x000022B0`.

Baseline:

- `node tools\verify_setup.js` passed before edits.
- Baseline source mix: 1 tracked composite real-asm chunk made from 9 tracked
  files, plus 99 generated fallback chunks.
- Baseline code-region SHA256:
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- Baseline full ROM SHA256:
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

Source-layout change:

- Removed superseded
  `asm/original/rev0/code_000018D4_00011000.s`.
- Added `asm/original/rev0/boot/resource_ptr_validate.s`,
  `0x000018D4..0x00001A44`, 368 bytes.
- Added `asm/original/rev0/boot/resource_realloc.s`,
  `0x00001A44..0x00001DE8`, 932 bytes.
- Added `asm/original/rev0/boot/resource_tree_insert_find.s`,
  `0x00001DE8..0x00001E74`, 140 bytes.
- Added `asm/original/rev0/boot/resource_rebuild_free_trees.s`,
  `0x00001E74..0x00001F9C`, 296 bytes.
- Added `asm/original/rev0/boot/resource_find_arena_index.s`,
  `0x00001F9C..0x00002004`, 104 bytes.
- Added `asm/original/rev0/boot/resource_alloc_tree_scan.s`,
  `0x00002004..0x000022B0`, 684 bytes.
- Added remainder `asm/original/rev0/code_000022B0_00011000.s`,
  `0x000022B0..0x00011000`, 60,752 bytes.
- Static dossier: `docs/dossiers/boot-resource-validation-realloc-trees.md`.

Evidence:

- Parent `../scripts/ob64_symbols_v2.json` locates `0x18D4`, `0x1A44`,
  `0x1DE8`, `0x1E74`, `0x1F9C`, `0x2004`, and `0x22B0` in all 21 RAM
  snapshots and all seven known states.
- `0x1A44` carries a secondary entry at `0x1D50`, the unlink helper reached by
  earlier allocator/free code at RAM `0x80071950`; the split keeps it in
  `resource_realloc.s`.
- `0x1DE8` carries secondary entry `0x1E3C`, and `0x2004` carries secondary
  entry `0x2274`; both secondary entries stay with their parent source files.
- Parent reports 27 callers for `0x2004` and 11 callers for `0x1DE8`.
- Next boundary `0x22B0` is parent-labeled `dma/resource::resource loader` and
  `dispatcher/state-machine`; it remains the next split target.

Verification:

- `node tests\binutils_smoke.js` passed after the split.
- `node tools\assemble_original_mips.js` passed after the split.
- Full `node tools\verify_setup.js` passed after the split.
- Assembled report now shows 1 tracked composite real-asm chunk made from 15
  tracked source files, plus 99 generated fallback chunks.
- Code-region SHA256 remains:
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- Full ROM SHA256 remains:
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

Next recommended target:

- Continue from `asm/original/rev0/code_000022B0_00011000.s`, beginning with
  parent-labeled early boot/resource loader `func_000022B0`, or promote another
  small tracked non-code owner batch.

## 2026-06-21 - Phase 8, Early Boot Resource Loader/State Loop Split

Target:

- Continue source-layout cleanup inside the first tracked original-MIPS chunk.
- Split the parent-labeled early boot/resource loader and the adjacent
  prefix-bearing boot state service loop.

Baseline:

- `node tools\verify_setup.js` passed before edits.
- Baseline source mix: 1 tracked composite real-asm chunk made from 15 tracked
  files, plus 99 generated fallback chunks.
- Baseline code-region SHA256:
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- Baseline full ROM SHA256:
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

Source-layout change:

- Removed superseded
  `asm/original/rev0/code_000022B0_00011000.s`.
- Added `asm/original/rev0/boot/early_boot_resource_loader.s`,
  `0x000022B0..0x00002798`, 1,256 bytes.
- Added `asm/original/rev0/boot/boot_state_service_loop.s`,
  `0x00002798..0x00002B38`, 928 bytes.
- Added remainder `asm/original/rev0/code_00002B38_00011000.s`,
  `0x00002B38..0x00011000`, 58,568 bytes.
- Static dossier: `docs/dossiers/boot-early-loader-state-loop.md`.

Evidence:

- Parent `../scripts/ob64_symbols_v2.json` labels `0x22B0` as
  `dma/resource::resource loader` and `dispatcher/state-machine`, with 40
  callees, no indirect-call edges, and residency in all seven captured states.
- `0x22B0` parent size is 1,256 bytes, so its range ends at `0x2798`.
- The two words at `0x2798..0x27A0` are executable prefix instructions that
  load `0x800C4800` into `v1` before scanner prologue `0x27A0`; they are not
  padding and stay with `boot_state_service_loop.s`.
- Parent marks `0x27A0` as a 920-byte prologue function with frame size `0x20`
  and secondary entry `0x2B10`.
- The next remainder starts at `0x2B38`, where the scanner reports overlapping
  entries `0x2B38` leaf and `0x2B40` prologue. Keep them together next pass.

Verification:

- `node tests\binutils_smoke.js` passed after the split.
- `node tools\assemble_original_mips.js` passed after the split.
- Full `node tools\verify_setup.js` passed after the split.
- Assembled report now shows 1 tracked composite real-asm chunk made from 17
  tracked source files, plus 99 generated fallback chunks.
- Code-region SHA256 remains:
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- Full ROM SHA256 remains:
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

Next recommended target:

- Continue from `asm/original/rev0/code_00002B38_00011000.s`, beginning with
  the overlapping `0x2B38/0x2B40` helper, or promote another small tracked
  non-code owner batch.

## 2026-06-21 - Boot Mode/Flag Helper Split

Target:

- Continue source-layout cleanup inside the first tracked original-MIPS chunk.
- Split the compact helper cluster after the early boot state loop, while
  keeping overlapping or no-label scanner regions together.

Baseline:

- `node tools\verify_setup.js` passed before edits.
- Baseline source mix: 1 tracked composite real-asm chunk made from 17 tracked
  files, plus 99 generated fallback chunks.
- Baseline code-region SHA256:
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- Baseline full ROM SHA256:
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

Source-layout change:

- Removed superseded
  `asm/original/rev0/code_00002B38_00011000.s`.
- Added `asm/original/rev0/boot/boot_mode_message_select.s`,
  `0x00002B38..0x00002BD8`, 160 bytes.
- Added `asm/original/rev0/boot/boot_flag_table_reset.s`,
  `0x00002BD8..0x00002CBC`, 228 bytes.
- Added `asm/original/rev0/boot/boot_status_flag_set.s`,
  `0x00002CBC..0x00002D00`, 68 bytes.
- Added `asm/original/rev0/boot/boot_status_flag_clear.s`,
  `0x00002D00..0x00002D44`, 68 bytes.
- Added `asm/original/rev0/boot/boot_status_flag_test.s`,
  `0x00002D44..0x00002D7C`, 56 bytes.
- Added remainder `asm/original/rev0/code_00002D7C_00011000.s`,
  `0x00002D7C..0x00011000`, 57,988 bytes.
- Static dossier: `docs/dossiers/boot-mode-flag-helpers.md`.

Evidence:

- Parent scanner reports overlapping entries at `0x2B38` and `0x2B40`. Direct
  calls target `0x80072738`, while no direct call target was found for
  `0x80072740`, so both entries stay in `boot_mode_message_select.s`.
- `boot_mode_message_select.s` reads `0x80000300`, selects one of four
  computed `0x800A_B960/B9B0/BA00/BA50` pointer tables based on that mode value and
  incoming `a0` values `2` or `9`, then calls `0x800955C0`.
- `boot_flag_table_reset.s` clears two 4x16 halfword table groups at
  `0x800BEE90` and `0x800BEF10`, clears `0x18` bytes at `0x800BEE78` through
  common helper `0x80093380`, and keeps the no-label `0x2C4C` flag-adjust
  block inside the parent `0x2BD8` range.
- The status flag set/clear/test wrappers all call `0x8008B820` around access
  to byte `0x800BEF9A`; the helper semantics remain unnamed pending runtime
  evidence.

Verification:

- `node tests\binutils_smoke.js` passed after the split.
- `node tools\assemble_original_mips.js` passed after the split.
- Full `node tools\verify_setup.js` passed after the split.
- Assembled report now shows 1 tracked composite real-asm chunk made from 22
  tracked source files, plus 99 generated fallback chunks.
- Code-region SHA256 remains:
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- Full ROM SHA256 remains:
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

Next recommended target:

- Continue from `asm/original/rev0/code_00002D7C_00011000.s`, beginning with
  the large `0x2D7C..0x347C` table/bitmask routine called by both the early
  loader and the state loop, or promote another small tracked non-code owner
  batch.

## 2026-06-21 - Boot Table/Mask Reconcile Split

Target:

- Continue source-layout cleanup inside the first tracked original-MIPS chunk.
- Split the large `0x2D7C..0x347C` table/mask routine after the boot mode/flag
  helpers.

Baseline:

- `node tools\verify_setup.js` passed before edits.
- Baseline source mix: 1 tracked composite real-asm chunk made from 22 tracked
  files, plus 99 generated fallback chunks.
- Baseline code-region SHA256:
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- Baseline full ROM SHA256:
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

Source-layout change:

- Removed superseded
  `asm/original/rev0/code_00002D7C_00011000.s`.
- Added `asm/original/rev0/boot/boot_table_mask_reconcile.s`,
  `0x00002D7C..0x0000347C`, 1,792 bytes.
- Added remainder `asm/original/rev0/code_0000347C_00011000.s`,
  `0x0000347C..0x00011000`, 56,196 bytes.
- Static dossier: `docs/dossiers/boot-table-mask-reconcile.md`.

Evidence:

- Parent `../scripts/ob64_functions.json` reports `0x2D7C` as a 1,792-byte
  prologue, frame size `0x58`, no indirect jumps, and end `0x3478`; the delay
  slot at `0x3478` means the source split ends at exclusive `0x347C`.
- Parent `../scripts/ob64_callgraph_v2.json` reports high-confidence callers
  `0x22B0` and `0x27A0`, and one high-confidence callee `0x8008A600`
  (`ROM 0x1AA00`).
- Parent `../scripts/ob64_function_states.json` and
  `../scripts/ob64_overlay_map.json` locate the routine at RAM `0x8007297C` in
  all seven named states and all 21 RAM snapshots.
- Static code shape updates halfword masks and mirrored tables around
  `0x800C47F0`, `0x800BEE90`, `0x800BEF10`, `0x800E79B0`, `0x800E79BC`, and
  `0x800F8100`, and clamps signed record bytes at offsets `+2/+3` to
  `-0x3D..0x3D`.

Verification:

- `node tests\binutils_smoke.js` passed after the split.
- `node tools\assemble_original_mips.js` passed after the split.
- Full `node tools\verify_setup.js` passed after the split.
- Assembled report now shows 1 tracked composite real-asm chunk made from 23
  tracked source files, plus 99 generated fallback chunks.
- Code-region SHA256 remains:
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- Full ROM SHA256 remains:
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

Next recommended target:

- Continue from `asm/original/rev0/code_0000347C_00011000.s`, beginning with
  the `0x347C..0x368C` routine and keeping secondary entry `0x3564` together,
  or promote another small tracked non-code owner batch. This target has since
  been completed by the boot mode/message accumulator split below.

## 2026-06-21 - Boot Mode/Message Accumulator Split

Target:

- Continue source-layout cleanup inside the first tracked original-MIPS chunk.
- Split the `0x347C..0x368C` routine after the table/mask reconcile routine
  while keeping its secondary entry at `0x3564` in the same file.

Baseline:

- `node tools\verify_setup.js` passed before edits.
- Baseline source mix: 1 tracked composite real-asm chunk made from 23 tracked
  files, plus 99 generated fallback chunks.
- Baseline code-region SHA256:
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- Baseline full ROM SHA256:
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

Source-layout change:

- Removed superseded
  `asm/original/rev0/code_0000347C_00011000.s`.
- Added `asm/original/rev0/boot/boot_mode_message_accumulator_update.s`,
  `0x0000347C..0x0000368C`, 528 bytes.
- Added remainder `asm/original/rev0/code_0000368C_00011000.s`,
  `0x0000368C..0x00011000`, 55,668 bytes.
- Static dossier: `docs/dossiers/boot-mode-message-accumulator-update.md`.

Evidence:

- Parent `../scripts/ob64_functions.json` reports `0x347C` as a 528-byte
  prologue, frame size `0x20`, no indirect jumps, and secondary entry `0x3564`.
  The parent end marker is `0x3688`; the delay slot at `0x3688` means the
  source split ends at exclusive `0x368C`.
- Parent `../scripts/ob64_callgraph_v2.json` reports no direct static callers,
  high-confidence callees `0x800955C0` (`ROM 0x259C0`), `0x80095610`
  (`ROM 0x25A10`), and `0x800957D0` (`ROM 0x25BD0`), plus one unresolved JAL
  target at RAM `0x8016CD3C`.
- Parent `../scripts/ob64_symbols_v2.json` locates the routine at fixed RAM
  `0x8007307C` in all seven named states.
- Static code shape: primary entry stores `[a0+0xC]` to `0x800C4BB8`, calls the
  unresolved `0x8016CD3C`, uses the low return byte together with
  `0x80000300` to choose one of four computed `0x800A_B9xx/BAxx` pointer
  tables, then calls `0x800955C0`, optional `0x80095610(0x5A)`, and
  `0x800957D0`.
- Secondary entry `0x3564` either overwrites or accumulates six halfword globals
  (`0x800C4C08`, `0x800E7D68`, `0x800C4A18`, `0x800E7A1C`, `0x800C4BCA`,
  `0x800C4AD8`) from `a1/a2/a3/sp+0x10/sp+0x14/sp+0x18`, then writes flag
  `0x800AEE72 = 2`.

Verification:

- `node tests\binutils_smoke.js` passed after the split.
- `node tools\assemble_original_mips.js` passed after the split.
- Full `node tools\verify_setup.js` passed after the split.
- Assembled report now shows 1 tracked composite real-asm chunk made from 24
  tracked source files, plus 99 generated fallback chunks.
- Code-region SHA256 remains:
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- Full ROM SHA256 remains:
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

Next recommended target:

- Continue from `asm/original/rev0/code_0000368C_00011000.s`, beginning with
  the `0x368C..0x3798` routine and keeping secondary entries `0x377C/0x378C`
  together, or promote another small tracked non-code owner batch.
