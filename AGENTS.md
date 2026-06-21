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
  (`0x00001000..0x00011000`) made from 39 real-assembler source files.
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
`0x368C` target has since been superseded by the resource-buffer reset split
below.

## Boot Resource-Buffer Reset/Flag Split

The next tracked Rev 0 original-MIPS split separates the permanent helper after
the mode/message accumulator update:

- `asm/original/rev0/boot/boot_resource_buffer_reset_flags.s`
  `0x0000368C..0x00003798`; parent reports a 268-byte prologue function, frame
  size `0x20`, and secondary entries `0x377C/0x378C`.
- Remainder:
  `asm/original/rev0/code_00003798_00011000.s`.

Static evidence: the primary entry walks two `0x18`-byte resource-buffer rows
starting at computed base `0x800A81C0`, uses six static `resource_free` call
sites (`0x800712C4`) against row pointer fields, clears the six accumulator
halfwords (`0x800C4C08`, `0x800E7D68`, `0x800C4A18`, `0x800E7A1C`,
`0x800C4BCA`, `0x800C4AD8`), writes mode flag `0x800AEE72 = 2`, calls
`0x80093380(0x800A81C0, 0x30)`, and clears byte `0x800A81F0`. The `0x377C`
secondary entry writes byte flag `0x800A8213 = 1`; `0x378C` returns that flag.
Parent `docs/enemy-system.md` has used the `0x800A81C0+` row as a lead but also
retracts EDAT-specific conclusions for shared slot `0x800A81C8`, so this split
does not promote an EDAT-specific semantic name.

Static dossier: `docs/dossiers/boot-resource-buffer-reset-flags.md`. The next
source split at `0x00003798` has since been superseded by the resource state
reset split below.

## Boot Resource State Reset Split

The next tracked Rev 0 original-MIPS split separates the compact wrapper after
the resource-buffer reset helper:

- `asm/original/rev0/boot/boot_resource_state_reset.s`
  `0x00003798..0x000037F8`; parent reports a 96-byte prologue function, frame
  size `0x18`, and no secondary entries.
- Remainder:
  `asm/original/rev0/code_000037F8_00011000.s`.

Static evidence: the routine calls unresolved helper `0x80089A10`, calls the
previous `boot_resource_buffer_reset_flags` routine at `0x8007328C`, clears
bytes `0x800A8210..0x800A8213`, frees the pointer stored at `0x800AEF9C` via
`resource_free` (`0x800712C4`), writes the returned pointer back to
`0x800AEF9C`, and clears word `0x800C4B20`. Parent callgraph data reports
high-confidence callers at ROM `0x5FC0` and `0x4EBCC`, medium-confidence
callers at `0x1CF960/0x1CF9C0`, and fixed RAM `0x80073398` in all seven named
states. The unresolved helper keeps this a conservative source-layout label
rather than a final C API name.

Static dossier: `docs/dossiers/boot-resource-state-reset.md`. The next source
split at `0x000037F8` has since been superseded by the resource/display-list
update split below.

## Boot Resource Display-List Update Split

The next tracked Rev 0 original-MIPS split separates the overlapping
resource/display-list update cluster after the resource state reset helper:

- `asm/original/rev0/boot/boot_resource_display_list_update.s`
  `0x000037F8..0x00003C2C`; parent reports `0x37F8` as a 936-byte leaf entry
  and `0x3808` as a 1,060-byte prologue function with frame size `0x40` and
  secondary entry `0x3BA0`.
- Remainder:
  `asm/original/rev0/code_00003C2C_00011000.s`.
  That file has since been superseded by the display-list state emit split
  below.

Static evidence: the four-instruction `0x37F8` prefix reads
`0x800A81F0/0x800AEE72` and falls into the `0x3808` prologue, so it stays with
the parent cluster. The routine selects a `0x18`-byte row from base
`0x800A81C0`, stores it to `0x800F9BE0`, refreshes row pointers with repeated
`resource_free` and `resource_alloc_mode1_wrapper` calls, touches flag bytes
`0x800A8210..0x800A8215`, conditionally allocates/frees the large pointer global
`0x800AEF9C` and aligned base `0x800C4B20`, and emits F3DEX-style display-list
command words through the heavily used display-list pointer global
`0x800E9BA0`/`0x800F9BA0`. Parent callgraph data reports high-confidence callee
edges to `resource_free`, `resource_alloc_mode1_wrapper`, `0x00003C2C`,
`0x000228D0`, and `0x000210C0`; the call to RAM `0x800737A0` is the included
`0x3BA0` secondary helper. The cluster is fixed at RAM `0x800733F8/0x80073408`
in all seven named states.

Static dossier: `docs/dossiers/boot-resource-display-list-update.md`. The next
source split at `0x00003C2C` has since been superseded by the display-list
state emit split below.

## Boot Display-List State Emit Split

The next tracked Rev 0 original-MIPS split separates the standalone
display-list/state emission helper called by the resource/display-list update
cluster:

- `asm/original/rev0/boot/boot_display_list_state_emit.s`
  `0x00003C2C..0x00003EE4`; parent reports a 696-byte prologue function, frame
  size `0x20`, and no secondary entries.
- Remainder:
  `asm/original/rev0/code_00003EE4_00011000.s`.
  That file has since been superseded by the display-list finalize/flip split
  below.

Static evidence: parent callgraph data reports high-confidence callers at
`0x37F8` and `0x3808`, a high-confidence callee edge to `0x80090780`, and one
unresolved target at RAM `0x8016CD30`. The routine exits early when the
unresolved helper returns a nonzero low byte. Otherwise it reads flag byte
`0x800A8213`, reads pointer/state globals `0x800C4B20` and `0x800E8210`, and
emits F3DEX-style command words through the shared display-list cursor
`0x800E9BA0`/`0x800F9BA0`. The optional flag-controlled block writes a larger
`FE00/E700/E300/E200/F700` style packet and the always-run block calls
`0x80090780` before emitting a `DE00` command pointing at `0x801869C8`. The
cluster is fixed at RAM `0x8007382C` in all seven named states and all 21
parent RAM snapshots.

Static dossier: `docs/dossiers/boot-display-list-state-emit.md`. The next
source split at `0x00003EE4` has since been superseded by the display-list
finalize/flip split below.

## Boot Display-List Finalize/Flip Split

The next tracked Rev 0 original-MIPS split separates the compact display-list
finalize/flip helper called by the early boot state loop:

- `asm/original/rev0/boot/boot_display_list_finalize_flip.s`
  `0x00003EE4..0x00003FD0`; parent reports a 236-byte prologue function, frame
  size `0x18`, and no secondary entries.
- Remainder:
  `asm/original/rev0/code_00003FD0_00011000.s` at this step; superseded by
  the display-list sync/modes split below.

Static evidence: parent callgraph data reports high-confidence caller `0x27A0`
and high-confidence callee edges to `0x4048` and `0x19C04`. The routine calls
the local `0x4048/0x4050` helper first, then appends two `DE00` display-list
links to `0x801869C8` and `0x80186E70`, plus `E700`, `E900`, and `DF00`
commands, through the shared display-list cursor `0x800E9BA0`/`0x800F9BA0`.
It reads the selected row pointer at `0x800E9BE0`, reads byte `0x800C4808`,
passes the emitted span length to helper `0x80089804`, clears byte flag
`0x800A8213`, and toggles byte `0x800A81F0`. The routine is fixed at RAM
`0x80073AE4` in all seven named states and all 21 parent RAM snapshots.

Static dossier: `docs/dossiers/boot-display-list-finalize-flip.md`. The
`0x00003FD0` target has since been superseded by the display-list sync/modes
split below.

## Boot Display-List Sync/Modes Split

The next tracked Rev 0 original-MIPS split separates the small display-list
sync/modes helper called by the early boot state loop:

- `asm/original/rev0/boot/boot_display_list_sync_modes.s`
  `0x00003FD0..0x00004048`; parent reports a 120-byte prologue function, frame
  size `0x18`, and no secondary entries.
- Remainder:
  `asm/original/rev0/code_00004048_00011000.s` at this step; superseded by
  the display-list counter-step split below.

Static evidence: parent callgraph data reports high-confidence caller `0x27A0`
and one high-confidence callee edge to permanent helper `0x80095610`
(`0x00025A10`). The routine calls that helper with `a0=0x5A`, then advances the
shared display-list cursor `0x800E9BA0`/`0x800F9BA0` through three packet slots:
`E700 00000000`, `E3001801 00000000`, and `E3001A01 00000030`. Parent symbol
data locates it at fixed RAM `0x80073BD0` in all seven named states and all 21
parent RAM snapshots. Xref data shows read/write traffic through the shared
cursor and writes to packet words `0x800F0000..0x800F0014`.

Static dossier: `docs/dossiers/boot-display-list-sync-modes.md`. The
`0x00004048` target has since been superseded by the display-list counter-step
split below.

## Boot Display-List Counter-Step Split

The next tracked Rev 0 original-MIPS split separates the overlapping counter
step helper called by the display-list finalize/flip routine:

- `asm/original/rev0/boot/boot_display_list_counter_step.s`
  `0x00004048..0x000040B0`; parent reports a 104-byte leaf entry at `0x4048`
  and an overlapping 96-byte prologue entry at `0x4050`.
- Remainder:
  `asm/original/rev0/code_000040B0_00011000.s`.
  That file has since been superseded by the display-list counter packet emit
  split below.

Static evidence: parent callgraph data reports high-confidence caller `0x3EE4`
to the `0x4048` entry, no direct callers to the `0x4050` prologue entry, and a
shared high-confidence callee edge to local helper `0x40B0`. The `0x4048`
prefix loads byte `0x800AEF99`; the shared body returns early if it is zero,
clamps values above `0x0C` back to `0x0C`, stores the clamped byte, computes a
scaled 8-bit argument from the byte via `(value * 0xFF) / 6`-style multiply-high
math, and calls `0x40B0(a0=scaled)`. Xref data shows `0x800AEF99` is touched
only by the early boot state loop and this helper pair.

Static dossier: `docs/dossiers/boot-display-list-counter-step.md`. The
`0x000040B0` target has since been superseded by the display-list counter packet
emit split below.

## Boot Display-List Counter Packet Emit Split

The next tracked Rev 0 original-MIPS split separates the display-list packet
helper called by the counter-step helper:

- `asm/original/rev0/boot/boot_display_list_counter_packet_emit.s`
  `0x000040B0..0x000042D8`; parent reports a 552-byte prologue function, frame
  size `0x20`, callers `0x4048/0x4050`, and secondary epilogue entry `0x42C4`.
- Remainder:
  `asm/original/rev0/code_000042D8_00011000.s`.
  That file has since been superseded by the resource window cache update split
  below.

Static evidence: parent callgraph data reports high-confidence callers from the
counter-step helper entries and one unresolved call to RAM `0x8016CD30`. The
routine returns early when the incoming low byte is zero. Otherwise it advances
the shared display-list cursor `0x800E9BA0` through packet words, writes links
to `0x801869C8`, `0x80186358`, and `0x80186610`, emits `E700`, `D900`,
`FA00`, `E450`, `E100`, `F100`, and `DE00` style command words, and always
appends a trailing `E700 00000000` before returning through the `0x42C4`
epilogue. The routine is fixed at RAM `0x80073CB0` in all seven named states
and all 21 parent RAM snapshots.

Static dossier: `docs/dossiers/boot-display-list-counter-packet-emit.md`. The
`0x000042D8` target has since been superseded by the resource window cache
update split below.

## Boot Resource Window Cache Update Split

The next tracked Rev 0 original-MIPS split separates the overlapping
resource-window/cache helper after the counter packet emitter:

- `asm/original/rev0/boot/boot_resource_window_cache_update.s`
  `0x000042D8..0x000043D4`; parent reports a 128-byte JAL-target leaf entry at
  `0x42D8`, an overlapping 244-byte prologue body at `0x42E0`, and secondary
  entry `0x4358`.
- Remainder:
  `asm/original/rev0/code_000043D4_00011000.s`.
  That file has since been superseded by the bitstream cursor helper split
  below.

Static evidence: parent callgraph/symbol data reports caller `0x27A0` to the
`0x42D8` entry, callee `0x11D08`, and fixed RAM `0x80073ED8/0x80073EE0` in all
seven named states and all 21 RAM snapshots. Static shape: the `0x42D8` prefix
loads `0x800A81F4` into `v0` before falling into the `0x42E0` body. When that
state word is zero, the body clears seven stride-`0x50` words from
`0x800EB0DC..0x800EB2BC`, calls `0x80081908(a0=3, a1=0x0C)`, reads
`0x800C4BCC`, stores `0x800A81F4 = 0x0C`, and stores the pointer to
`0x800A81F8`. The `0x4358` secondary entry checks the cached pointer/window
against the current `0x800C4BCC` pointer and may clear `0x800A81F4` before
returning it.

Static dossier: `docs/dossiers/boot-resource-window-cache-update.md`. The
`0x000043D4` target has since been superseded by the bitstream cursor helper
split below.

## Boot Bitstream Cursor Helpers Split

The next tracked Rev 0 original-MIPS split separates the bit cursor / bitstream
helper cluster after the resource-window cache helper:

- `asm/original/rev0/boot/boot_bitstream_cursor_helpers.s`
  `0x000043D4..0x000046F4`; parent reports an 800-byte JAL-target prologue
  routine at `0x43D4`, high-confidence caller `0x22B0`, and unresolved calls to
  RAM `0x8008B820`.
- Remainder:
  `asm/original/rev0/code_000046F4_00011000.s`.
  That file has since been superseded by the bitstream descriptor decode split
  below.

Static evidence: the `0x43D4` prologue calls `0x8008B820(a0=1)`, clears seven
pointer-table records reached through `0x800A8218`, calls the unresolved helper
again, then returns before a compact set of local cursor helpers. The leaf
helpers initialize, read, and write bits using globals `0x800AEFB0`,
`0x800AEFB4`, `0x800AEFB8`, `0x800AEFBC`, and `0x800AEFC0`; xref data shows
those globals continue into the next helper family at `0x46F4`, `0x4894`, and
`0x48C8`. The split keeps the delay slot at `0x46F0` with this cluster and
starts the next source file at the following prologue boundary `0x46F4`.

Static dossier: `docs/dossiers/boot-bitstream-cursor-helpers.md`. The
`0x000046F4` target has since been superseded by the bitstream descriptor decode
split below.

## Boot Bitstream Descriptor Decode Split

The next tracked Rev 0 original-MIPS split separates the bitstream descriptor
decode routine that uses the cursor globals initialized by the previous helper
cluster:

- `asm/original/rev0/boot/boot_bitstream_descriptor_decode.s`
  `0x000046F4..0x00004894`; parent reports a 416-byte JAL-target prologue
  routine with frame size `0x10`.
- Remainder:
  `asm/original/rev0/code_00004894_00011000.s`.
  That file has since been superseded by the bitstream descriptor encode split
  below.

Static evidence: parent callgraph/symbol data reports high-confidence callers
`0x42DC4` and `0x42F68`, no callees, fixed RAM `0x800742F4` in all seven named
states and all 21 RAM snapshots, and accesses to shared bit cursor globals
`0x800AEFB0`, `0x800AEFB4`, `0x800AEFB8`, `0x800AEFBC`, and `0x800AEFC0`.
Static shape: entry initializes the cursor from `a0`, then walks descriptor rows
from `a1`; each row uses a base pointer, stride, record pointer, and count-like
field, and the inner loop consumes bit-width records to write decoded bytes at
row-base plus record offsets. The name is conservative and records a bitstream
descriptor decode shape, not a verified compression format.

Static dossier: `docs/dossiers/boot-bitstream-descriptor-decode.md`. The
`0x00004894` target has since been superseded by the bitstream descriptor encode
split below.

## Boot Bitstream Descriptor Encode Split

The next tracked Rev 0 original-MIPS split keeps the overlapping bitstream
helper pair together:

- `asm/original/rev0/boot/boot_bitstream_descriptor_encode.s`
  `0x00004894..0x00004AC8`; parent reports `0x4894` as a 548-byte JAL-target
  leaf and `0x48C8` as an overlapping 496-byte prologue with frame size `0x8`.
- Remainder:
  `asm/original/rev0/code_00004AC8_00011000.s`.
  That file has since been superseded by the boot resource probe init split
  below.

Static evidence: `0x48C8` is the branch delay slot for the `0x48C4` branch in
the `0x4894` prefix, so those entries must stay in one source file. Parent
callgraph/symbol data reports callers `0x42E64` and `0x43000` to `0x4894`, no
direct callers to `0x48C8`, no callees, fixed RAM `0x80074494/0x800744C8` in
all seven named states and all 21 snapshots, and shared bit cursor global
accesses. Static shape: entry initializes the cursor from `a0`, walks descriptor
rows from `a1`, reads source bytes from row-base plus descriptor offsets, packs
variable-width values into the shared bit cursor, and flushes the final partial
byte. The no-target `0x4AB8..0x4AC4` nop/nop/return/nop shape stays with this
file so the active remainder begins at the next scanner prologue `0x4AC8`.

Static dossier: `docs/dossiers/boot-bitstream-descriptor-encode.md`. The
`0x00004AC8` target has since been superseded by the boot resource probe init
split below.

## Boot Resource Probe Init Split

The next tracked Rev 0 original-MIPS split separates the first helper after the
bitstream descriptor pair:

- `asm/original/rev0/boot/boot_resource_probe_init.s`
  `0x00004AC8..0x00004C34`; parent reports a 364-byte JAL-target prologue
  routine with frame size `0x20`.
- Remainder:
  `asm/original/rev0/code_00004C34_00011000.s`.
  That file has since been superseded by the resource probe finalize split
  below.

Static evidence: parent callgraph/symbol data reports high-confidence caller
`0x22B0`, high-confidence callees `0x51A0`, `0x539C`, `0x5760`, and `0x4FF0`,
four unresolved calls to RAM `0x80093540`, and fixed RAM `0x800746C8` in all
seven named states and all 21 snapshots. Static xrefs show `0x4AC8` writes
shared globals `0x800A83B8` and `0x800A83BC`, and is the only current xref writer
for `0x800AEFD0` and `0x800AEFD2`.

Static shape: the routine clears `0x800A83B8/83BC`, initializes three bytes at
`0x800AEFD0..0x800AEFD2` to `0xFF`, probes/checks IDs `0`, `1`, `0x0F`, and
`0x0E` through nearby helpers, records missing IDs into the `0x800AEFD0` byte
list, emits diagnostic-looking calls through unresolved RAM `0x80093540`, calls
`0x4FF0` with magic value `0x37081383`, and returns either zero or the
`0x800AEFD0` list pointer. The name is conservative and records a static
resource/probe initialization shape, not a verified runtime API.

Static dossier: `docs/dossiers/boot-resource-probe-init.md`. The
`0x00004C34` target has since been superseded by the resource probe finalize
split below.

## Boot Resource Probe Finalize Split

The next tracked Rev 0 original-MIPS split separates the compact wrapper after
the resource probe init helper:

- `asm/original/rev0/boot/boot_resource_probe_finalize.s`
  `0x00004C34..0x00004C5C`; parent reports a 40-byte JAL-target prologue
  routine with frame size `0x18`.
- Remainder:
  `asm/original/rev0/code_00004C5C_00011000.s`.
  That file has since been superseded by the resource probe dispatch-prepare
  split below.

Static evidence: parent callgraph/symbol data reports high-confidence caller
`0x1E0024`, high-confidence callees `0x539C` and `0x4FF0`, no unresolved calls,
no global xrefs, and fixed RAM `0x80074834` in all seven named states and all
21 snapshots.

Static shape: the routine saves `ra`, calls `0x539C` with the incoming `a0`,
then calls `0x4FF0` with magic value `0x37081383` before returning. The name is
conservative and records the static resource/probe finalizer-wrapper shape, not
a verified runtime API.

Static dossier: `docs/dossiers/boot-resource-probe-finalize.md`. The
`0x00004C5C` target has since been superseded by the resource probe
dispatch-prepare split below.

## Boot Resource Probe Dispatch Prepare Split

The next tracked Rev 0 original-MIPS split separates the 356-byte helper after
the compact resource probe finalizer wrapper:

- `asm/original/rev0/boot/boot_resource_probe_dispatch_prepare.s`
  `0x00004C5C..0x00004DC0`; parent reports a JAL-target prologue routine with
  frame size `0x28` and one `jalr`.
- Remainder:
  `asm/original/rev0/code_00004DC0_00011000.s`.

Static evidence: parent callgraph/symbol data reports high-confidence callers
`0x4DF6C`, `0x79E84`, `0xEC6D4`, and `0x1E05B4`, medium-confidence caller
`0x24AF04`, high-confidence callees `0x553C`, `resource_alloc` (`0x1330`),
`0x23780`, `0x5D9C`, `0x5C58` through an overlay-ambiguous target RAM
`0x800758FC`, `resource_free` (`0x16C4`), `0x5B8C`, and `0x4FF0`, unresolved
RAM call targets `0x8016CDF4` and `0x80093540`, one indirect `jalr`, reads from
`0x800A8254/0x800A8258`, and fixed RAM `0x8007485C` in all seven named states
and all 21 snapshots.

Static shape: the routine dispatches on incoming ID. ID `0x0F` calls helper
`0x553C` then finalizes. ID `0x0E` allocates and clears a 0x10-byte record,
calls unresolved RAM `0x8016CDF4` on record `+0x0C`, then runs local helper/free
cleanup. IDs `0` and `1` allocate a 0x1850-byte record, increment word `+0x0C`
with zero wrapping to `-1`, walk 13 stride-`0x1C` callback-table entries read
from `0x800A8254/0x800A8258`, invoke nonzero callbacks through `jalr`, then run
local helper/free cleanup. Other IDs call unresolved diagnostic-looking
`0x80093540(0x800ADF08, id)` and enter an infinite loop. Valid paths converge on
`0x4FF0(0x37081383)`. The name is conservative and records a static
resource/probe dispatch-prepare shape, not a verified runtime API.

Static dossier: `docs/dossiers/boot-resource-probe-dispatch-prepare.md`. Next
source split should start at `asm/original/rev0/code_00004DC0_00011000.s`, a
276-byte prologue routine with frame size `0x20`, one `jalr`, unresolved RAM
call target `0x8016CDCC`, and reads from `0x800A8258/0x800A8250`.

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
  bytes visible, 1 tracked composite real-asm chunk made from 39 tracked source
  files, 99 generated fallback chunks, full-source manifest 1,059 entries with
  2,469,141 ambiguous bytes preserved explicitly, 3 tracked non-code
  source-owner files / 44,029 bytes, 1,055 generated non-code fallback files /
  35,388,567 bytes, source-manifest rebuild exact, full ROM
  SHA256
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

Next phase is either promoting another small non-code owner batch or continuing
tracked original-MIPS splits from `asm/original/rev0/code_00004DC0_00011000.s`.
Do not begin semantic C decomp unless the setup verifier is green.
