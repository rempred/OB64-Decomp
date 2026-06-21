# OB64 Decomp - Agent Guide

This file is this repo's local memory gate. Read it first, then read
`docs/PLATFORM.md` for the current platform snapshot and `docs/NEXT_STEPS.md`
for the active work queue.

This repository is the dedicated decompilation workspace for Ogre Battle 64:
Person of Lordly Caliber, US Rev 0 only.

## Scope

- Target ROM: US Rev 0 retail, game ID `NOBE`, country `C:45`.
- Do not add Rev 1 support until the Rev 0 structure, build, and compare loop are
  stable.
- Final tracked output should be source form:
  - C decompilation under `src/`.
  - Original/reference MIPS under `asm/original/`.
  - Nonmatching assembly under `asm/nonmatching/` only while C is not matching.
- Do not commit ROM binaries, save files, savestates, object files, rebuilt ROMs,
  or generated bulk artifacts.

## Relationship To Parent Workspace

The parent `OgreBattlel64` workspace remains the research lab: emulator traces,
runtime probes, editor experiments, patch builders, and large generated artifacts
belong there until they become stable decomp inputs.

This repo should contain reproducible decomp source, configuration, curated docs,
and tools. When importing facts from the parent workspace, include the source doc
or artifact path in the relevant note.

## Required Context

Before decomp work, read:

1. Parent `AGENTS.md`.
2. Local `docs/PLATFORM.md`.
3. Local `docs/REV0_SCOPE.md`.
4. Local `docs/TOOLCHAIN.md`.
5. Local `docs/WORKFLOW.md`.
6. Local `docs/DECOMP_LOG.md`.
7. Local `docs/FULL_ROM_SOURCE_MANIFEST.md`.
8. Local `docs/NEXT_STEPS.md`.
9. Parent `docs/mips-decomp-workflow-plan.md`.
10. Parent `docs/mips-decode.md`.
11. Parent `docs/overlay-system.md`.
12. The relevant subsystem doc in the parent `docs/` folder.

When a durable fact changes, update this file and the relevant local doc before
committing. If the fact came from parent-workspace research, include the parent
source path in the note.

## Address Rules

- Documentation offsets use z64 byte order.
- The local baserom may be supplied as `.v64`, `.z64`, or `.n64`, but tools
  should normalize to canonical z64 bytes for extraction and comparison.
- Only the boot region below roughly z64 `0x0002F000` follows the simple
  `RAM = ROM + 0x8006FC00` mapping.
- Later code is overlay-loaded and must be resolved through the overlay map.

## Evidence Rules

- Static decomp output is candidate evidence.
- Runtime trace or controlled mutation is required before naming behavior as
  verified.
- Matching code is not automatically semantic proof; semantic claims still need
  subsystem evidence.
- Update docs when a function name, struct field, segment boundary, or overlay
  mapping becomes durable.

## No-Gap Decomp Rule

The repo may have incomplete C and imperfect function boundaries, but every byte
in a configured segment must remain represented by source. The current
`tools/extract_original_mips.js` first pass preserves the Rev 0 code region by
emitting every 4-byte word as `.word` plus a decode comment into ignored
`build/original-mips/rev0/`. Promote generated original MIPS into
`asm/original/` only after the split/link/compare policy is stable.

## Current Rev 0 Coverage Ledger

`tools/build_rom_coverage_ledger.js` is the whole-ROM structural safety check.
It independently scans LHA headers instead of trusting the parent archive
catalog alone, compares count and offsets with the parent catalog, records
rejected method-like signatures, and reports overlaps.

Current Rev 0 result:

- Valid parsed LHA archives: 825.
- Parent catalog offsets match: yes.
- Method-like signatures: 837 total, 12 rejected/unparsed, none in unknown
  space.
- Unknown bytes: 0.
- Archive-gap bytes: 2,429,124.
- Tail data: `0x0275415B..0x0275DD40`.
- Clean trailing `0xFF` padding: `0x0275DD40..0x02800000`.

## Full-ROM Source Manifest

`tools/build_full_source_manifest.js` audits the coverage ledger, raw segment
manifest, original-MIPS report, and assembled-code report into a full-ROM source
ownership manifest. It is part of `node tools/verify_setup.js`.

Current result:

- Entries: 1,059 contiguous ROM spans.
- ROM bytes covered: 41,943,040 / 41,943,040.
- Unknown bytes: 0.
- Original-MIPS source bytes: 6,510,444.
- Non-code/raw/data/archive source bytes: 35,432,596.
- Ambiguous bytes preserved explicitly: 2,469,141.

The generated manifest lives under ignored `build/source-manifest/`. Durable
policy and current numbers are in `docs/FULL_ROM_SOURCE_MANIFEST.md`.

Tracked non-code source owners now begin under `data/source-owners/rev0/`.
`tools/promote_non_code_sources.js` promotes selected non-code source-manifest
entries into tracked `.srcbin` files and writes
`data/source-owners/rev0/manifest.json`. `tools/extract_non_code_sources.js`
verifies that tracked manifest and prefers matching tracked files while still
generating ignored fallback owners for every unpromoted non-code span.

Current tracked batch:

- `raw_header` `0x00000000..0x00001000` (4,096 bytes).
- `raw_structural_gap` `0x0063676C..0x00636784` (24 bytes).
- `raw_tail_data` `0x0275415B..0x0275DD40` (39,909 bytes, ambiguous).

Current source-owner mix: 3 tracked files / 44,029 bytes, plus 1,055 generated
fallback files / 35,388,567 bytes. Total non-code source ownership remains
1,058 files / 35,432,596 bytes.

## Exact Rebuild Rule

Before replacing raw bytes with assembly or C, preserve the exact-rebuild loop:

```powershell
node tools/verify_setup.js
```

`verify_setup.js` runs baserom verification, whole-ROM coverage, MIPS extraction,
binutils smoke tests, raw rebuild, full-ROM source-manifest audit, non-code
source-owner extraction, source-manifest rebuild, and assembled-code rebuild. It
must report PASS before source replacement work is considered safe.

Current exact rebuild result:

- Segment count: 1,059.
- Total bytes: 41,943,040.
- Rebuilt/reference SHA256:
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
- Exact match: pass.
- First diff: none.

## Assembly-Backed Code Rebuild

`tools/assemble_original_mips.js` assembles the generated no-gap `.word`
reference into ignored `build/assembled/rev0/code.bin`. It prefers tracked
chunks under `asm/original/rev0/` when present and falls back to generated chunks
under `build/original-mips/rev0/` for ranges not yet promoted. Tracked chunks go
through the real GNU MIPS assembler configured in `config/toolchain.json`;
generated fallback chunks still use the minimal `.word` path until promoted.
Tracked manifest chunks may now contain ordered `parts`, allowing a promoted
64 KiB chunk to be split into named source files while still rebuilding as one
no-gap source range.

Current result:

- Assembled code region: `0x00001000..0x0063676C`.
- Bytes: 6,510,444.
- Code-region SHA256:
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- Code-region match against baserom: pass.
- Tracked real-assembler original-MIPS chunks: 1 composite
  (`0x00001000..0x00011000`) made from 24 real-assembler source files.
- Generated fallback chunks: 99.
- Assembled-code ROM rebuild command:

```powershell
node tools/assemble_original_mips.js
node tools/rebuild_rom.js --assembled-code build/assembled/rev0/code.bin --out dist/rebuilt.us_rev0.assembled-code.z64 --report build/rebuild/rev0-assembled-code-rebuild-report.json
```

The assembled-code rebuild currently preserves the full ROM SHA256
`571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A` exactly.
Next source-layout work should continue promoting/splitting tracked
`asm/original/` inputs without losing the exact rebuild gate. Use
`tools/promote_original_mips.js` for chunk promotion and `--strict-tracked` only
after every configured code chunk is tracked.

## First Decomp Loop: Boot Entry

The first named Rev 0 original-MIPS split is
`asm/original/rev0/boot/boot_entry_clear_bss.s`, covering ROM
`0x00001000..0x00001060` / RAM `0x80070C00..0x80070C60`. The static dossier is
`docs/dossiers/boot-entry-clear-bss.md`, and the running memory entry is in
`docs/DECOMP_LOG.md`.

Static finding: the ROM header entry point enters this stub at `0x80070C00`.
It clears `0x3AE70` bytes from `0x800AEDB0` through exclusive end
`0x800E9C20`, initializes `sp = 0x800C6D60`, then jumps to `0x8007F880`.
Treat the `clear_bss` name as a conservative static label for the observed boot
RAM clear span, not as a fully mapped linker section.

## Boot Resource Arena Split

The next tracked Rev 0 original-MIPS split covers the permanent boot/resource
block after the entry stub:

- `asm/original/rev0/boot/resource_arena_init.s`
  `0x00001060..0x00001120`.
- `asm/original/rev0/boot/resource_arena_register.s`
  `0x00001120..0x00001330`.
- `asm/original/rev0/boot/resource_alloc.s`
  `0x00001330..0x000014DC`; parent seed label `resource_alloc`.
- Remainder after this split was
  `asm/original/rev0/code_000014DC_00011000.s`; that file has since been
  superseded by the allocator/free split below.

Static dossier: `docs/dossiers/boot-resource-arena-and-alloc.md`.
`tools/split_original_mips_part.js` is the reusable manifest-part splitter used
for this source-layout change. The simple boot ROM-to-RAM mapping applies to
these ranges, and parent symbols locate the split functions in all 21 RAM
snapshots. Treat the arena/global names as conservative source-layout labels
until runtime or controlled mutation evidence proves exact allocator semantics.

## Boot Resource Alloc/Free Split

The next tracked Rev 0 original-MIPS split extends the same permanent
boot/resource block:

- `asm/original/rev0/boot/resource_alloc_alt_scan.s`
  `0x000014DC..0x00001688`.
- `asm/original/rev0/boot/resource_alloc_mode1_wrapper.s`
  `0x00001688..0x000016C4`; saves `0x800BEDE2`, forces it to `1`, calls
  parent seed `resource_alloc`, then restores the saved value.
- `asm/original/rev0/boot/resource_free.s`
  `0x000016C4..0x000017EC`; parent seed label `resource_free`, 427 parent
  callers.
- `asm/original/rev0/boot/resource_largest_free_block.s`
  `0x000017EC..0x000018D4`; keeps the `0x17EC/0x17F0` flag-load prefix with
  `func_000017F4` and scans arena free-list nodes for the largest `+0x18`
  free-size field.
- Remainder after this split was
  `asm/original/rev0/code_000018D4_00011000.s`; that file has since been
  superseded by the validation/realloc/tree-helper split below.

Static dossier: `docs/dossiers/boot-resource-alloc-free.md`. The
`resource_alloc_alt_scan` and `resource_largest_free_block` names are
conservative static/source-layout names, not final C API claims.

## Boot Resource Validation/Realloc/Tree Split

The next tracked Rev 0 original-MIPS split continues the same boot/resource
helper cluster through the early boot-init boundary:

- `asm/original/rev0/boot/resource_ptr_validate.s`
  `0x000018D4..0x00001A44`; validates allocator header/link fields and has
  small secondary return helpers at `0x1A34` and `0x1A3C`.
- `asm/original/rev0/boot/resource_realloc.s`
  `0x00001A44..0x00001DE8`; realloc-like static behavior, including null-ptr
  allocation, zero-size free, grow/copy/free, shrink/split, and secondary
  tree/list unlink entry `0x1D50`.
- `asm/original/rev0/boot/resource_tree_insert_find.s`
  `0x00001DE8..0x00001E74`; keeps recursive insert entry `0x1DE8` and
  search/fit helper `0x1E3C` together.
- `asm/original/rev0/boot/resource_rebuild_free_trees.s`
  `0x00001E74..0x00001F9C`; keeps the `0x1E74` flag-load prefix with
  `func_00001E7C`.
- `asm/original/rev0/boot/resource_find_arena_index.s`
  `0x00001F9C..0x00002004`; keeps the `0x1F9C` count-load prefix with
  `func_00001FA4`.
- `asm/original/rev0/boot/resource_alloc_tree_scan.s`
  `0x00002004..0x000022B0`; parent reports 27 callers and secondary helper
  entry `0x2274`.
- Remainder after this split was
  `asm/original/rev0/code_000022B0_00011000.s`.
  That file has since been superseded by the early loader/state-loop split
  below.

Static dossier: `docs/dossiers/boot-resource-validation-realloc-trees.md`. The
names in this group are source-layout names inferred from static allocator
table/list behavior unless later runtime or mutation proof upgrades them.

## Early Boot Resource Loader/State Loop Split

The next tracked Rev 0 original-MIPS split separates the first post-allocator
boot-init routines:

- `asm/original/rev0/boot/early_boot_resource_loader.s`
  `0x000022B0..0x00002798`; parent labels `0x22B0` as
  `dma/resource::resource loader` and `dispatcher/state-machine`.
- `asm/original/rev0/boot/boot_state_service_loop.s`
  `0x00002798..0x00002B38`; keeps the two-word `0x2798` prefix with scanner
  prologue `func_000027A0`, and keeps secondary halt/check code at `0x2B10`.
- Remainder:
  `asm/original/rev0/code_00002B38_00011000.s`.

Static dossier: `docs/dossiers/boot-early-loader-state-loop.md`. The
`boot_state_service_loop` name is a conservative source-layout label based on
static state-byte/check-loop shape, not a verified C API. The
`code_00002B38_00011000.s` remainder has since been superseded by the
boot-mode/flag-helper split below.

## Boot Mode/Flag Helper Split

The next tracked Rev 0 original-MIPS split separates the compact helper cluster
after the early boot state loop:

- `asm/original/rev0/boot/boot_mode_message_select.s`
  `0x00002B38..0x00002BD8`; keeps overlapping scanner entries
  `0x2B38/0x2B40` together and selects one of four `0x800A_B9xx/BAxx` pointer
  tables before calling `0x800955C0`.
- `asm/original/rev0/boot/boot_flag_table_reset.s`
  `0x00002BD8..0x00002CBC`; clears two 4x16 halfword tables around
  `0x800BEE90/0x800BEF10`, clears `0x800BEE78..+0x18`, and keeps the adjacent
  no-label `0x2C4C` status-byte adjust block.
- `asm/original/rev0/boot/boot_status_flag_set.s`
  `0x00002CBC..0x00002D00`; sets bit `0x01` in byte `0x800BEF9A`.
- `asm/original/rev0/boot/boot_status_flag_clear.s`
  `0x00002D00..0x00002D44`; masks byte `0x800BEF9A` with `0xFA`.
- `asm/original/rev0/boot/boot_status_flag_test.s`
  `0x00002D44..0x00002D7C`; returns bit `0x04` from byte `0x800BEF9A`.
- Remainder:
  `asm/original/rev0/code_00002D7C_00011000.s`.

Static dossier: `docs/dossiers/boot-mode-flag-helpers.md`. The flag-helper
names are conservative static labels. Next source split should start at
`0x00002D7C`, the large table/bitmask routine called by both the early loader
and the state loop. That target has since been superseded by the table/mask
reconcile split below.

## Boot Table/Mask Reconcile Split

The next tracked Rev 0 original-MIPS split separates the large permanent
table/mask routine after the boot mode/flag helpers:

- `asm/original/rev0/boot/boot_table_mask_reconcile.s`
  `0x00002D7C..0x0000347C`; parent reports a 1,792-byte prologue function,
  frame size `0x58`, high-confidence callers `0x22B0` and `0x27A0`, and callee
  `0x8008A600`.
- Remainder:
  `asm/original/rev0/code_0000347C_00011000.s`.

Static evidence: the routine is present at RAM `0x8007297C` in all seven named
states and all 21 parent RAM snapshots. It updates halfword masks and mirrored
state tables around `0x800C47F0`, `0x800BEE90`, `0x800BEF10`,
`0x800E79B0`, `0x800E79BC`, and `0x800F8100`, and clamps signed record bytes at
offsets `+2/+3` to `-0x3D..0x3D`.

Static dossier: `docs/dossiers/boot-table-mask-reconcile.md`. That target has
since been superseded by the boot mode/message accumulator split below.

## Boot Mode/Message Accumulator Split

The next tracked Rev 0 original-MIPS split separates the permanent helper after
the table/mask reconcile routine:

- `asm/original/rev0/boot/boot_mode_message_accumulator_update.s`
  `0x0000347C..0x0000368C`; parent reports a 528-byte prologue function, frame
  size `0x20`, and secondary entry `0x3564`.
- Remainder:
  `asm/original/rev0/code_0000368C_00011000.s`.

Static evidence: the primary entry stores `a0+0xC` to `0x800C4BB8`, calls an
unresolved overlay-aware target at RAM `0x8016CD3C`, uses its low byte together
with `0x80000300` to select one of four `0x800A_B9xx/BAxx` pointer tables, then
calls `0x800955C0`, optional `0x80095610(0x5A)`, and `0x800957D0`. The `0x3564`
secondary entry either overwrites or accumulates six halfword globals
(`0x800C4C08`, `0x800E7D68`, `0x800C4A18`, `0x800E7A1C`, `0x800C4BCA`,
`0x800C4AD8`) and writes mode flag `0x800AEE72 = 2`.

Static dossier: `docs/dossiers/boot-mode-message-accumulator-update.md`. The
next source split should start at `0x0000368C`; keep the `0x368C..0x3798`
routine and secondary entries `0x377C/0x378C` together unless stronger evidence
splits them safely.

## Setup Complete Gate

The setup phase is complete when `node tools/verify_setup.js` passes. Current
setup-complete state:

- Local toolchain: `n64-tools-gcc-toolchain-mips64-win64`.
- Toolchain source:
  `https://github.com/n64-tools/gcc-toolchain-mips64/releases/download/latest/gcc-toolchain-mips64-win64.zip`.
- Archive SHA256:
  `7EE3598AC151C0A728DCFD916E3DF615793D2ED0A28CDC0CCAFA31EEF76526BB`.
- Installed under ignored `.toolchains/gcc-toolchain-mips64-win64/`.
- Assembler: GNU Binutils 2.39 `mips64-elf-as.exe` with `-EB -mips3 -32`.
- Setup verifier: `tools/verify_setup.js`.
- Current verifier result: PASS; 825 archives, 0 unknown bytes, 108 overlap
  bytes visible, 1 tracked composite real-asm chunk made from 24 tracked source
  files, 99 generated fallback chunks, full-source manifest 1,059 entries with
  2,469,141 ambiguous bytes preserved explicitly, 3 tracked non-code
  source-owner files / 44,029 bytes, 1,055 generated non-code fallback files /
  35,388,567 bytes, source-manifest rebuild exact, full ROM
  SHA256
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

Next phase is either promoting another small non-code owner batch or continuing
tracked original-MIPS splits from `asm/original/rev0/code_0000368C_00011000.s`.
Do not begin semantic C decomp unless the setup verifier is green.
