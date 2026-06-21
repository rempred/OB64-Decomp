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
  (`0x00001000..0x00011000`) made from 69 real-assembler source files.
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
  That file has since been superseded by the resource probe dispatch-apply
  split below.

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

Static dossier: `docs/dossiers/boot-resource-probe-dispatch-prepare.md`. The
`0x00004DC0` target has since been superseded by the resource probe
dispatch-apply split below.

## Boot Resource Probe Dispatch Apply Split

The next tracked Rev 0 original-MIPS split separates the 276-byte helper after
the resource probe dispatch-prepare helper:

- `asm/original/rev0/boot/boot_resource_probe_dispatch_apply.s`
  `0x00004DC0..0x00004ED4`; parent reports a JAL-target prologue routine with
  frame size `0x20` and one `jalr`.
- Remainder:
  `asm/original/rev0/code_00004ED4_00011000.s`.
  That file has since been superseded by the resource probe dispatch result
  build split below.

Static evidence: parent callgraph/symbol data reports high-confidence callers
`0x22B0`, `0x79E84`, `0x1DF788`, and `0x1E0024`, medium-confidence caller
`0x24AE88`, high-confidence callees `0x5624`, `resource_alloc` (`0x1330`),
`0x50F0`, `resource_free` (`0x16C4`), and `0x4FF0`, unresolved RAM call target
`0x8016CDCC`, one indirect `jalr`, reads from `0x800A8258/0x800A8250`, and
fixed RAM `0x800749C0` in all seven named states and all 21 snapshots.

Static shape: the routine dispatches on incoming ID. ID `0x0F` calls helper
`0x5624` then finalizes. ID `0x0E` allocates a 0x10-byte scratch record, copies
or materializes it through `0x50F0(a0=record, a1=0, a2=0x10)`, calls unresolved
RAM `0x8016CDCC` on record `+0x0C`, frees the record, then finalizes. Other IDs
allocate a 0x1850-byte record, compute slot offset `id * 0x1850 + 0x10`, call
`0x50F0(a0=record, a1=offset, a2=0x1850)`, walk 13 stride-`0x1C` callback-table
entries read from `0x800A8250/0x800A8258`, invoke nonzero callbacks through
`jalr`, free the record, then finalize through `0x4FF0(0x37081383)`. The name is
conservative and records a static resource/probe dispatch-apply shape, not a
verified runtime API.

Static dossier: `docs/dossiers/boot-resource-probe-dispatch-apply.md`. The
`0x00004ED4` target has since been superseded by the resource probe dispatch
result build split below.

## Boot Resource Probe Dispatch Result Build Split

The next tracked Rev 0 original-MIPS split separates the 284-byte helper after
the resource probe dispatch-apply helper:

- `asm/original/rev0/boot/boot_resource_probe_dispatch_result_build.s`
  `0x00004ED4..0x00004FF0`; parent reports a JAL-target prologue routine with
  frame size `0x28`, no `jalr`, and no unresolved targets.
- Remainder:
  `asm/original/rev0/code_00004FF0_00011000.s`.
  That file has since been superseded by the resource probe global cleanup
  split below.

Static evidence: parent callgraph/symbol data reports high-confidence callers
`0x79E84` and `0x1DF5F4`, medium-confidence callers `0x1D17E0` and
`0x24AE88`, high-confidence callees `resource_alloc` (`0x1330`), `0x5978`,
`0x50F0`, `0x581C`, `0x4FF0`, `0x23460`, and `resource_free` (`0x16C4`), no
unresolved RAM calls, a read from `0x800A8258`, and fixed RAM `0x80074AD4` in
all seven named states and all 21 snapshots.

Static shape: ID `0x0F` allocates a 0x4AE8-byte scratch record, calls helper
`0x5978`, materializes data through `0x50F0(a0=record, a1=0x30B0, a2=0x4AE8)`,
and uses the record's first word as an optional result marker. Other IDs
allocate a 0x1850-byte scratch record, call `0x581C(id, record)`, compute the
same `id * 0x1850 + 0x10` source offset used by the dispatch-apply helper,
materialize data through `0x50F0`, and use record word `+0x0C` as the optional
result marker. When the marker is nonzero, the routine reads offset data from
`0x800A8258`, allocates a 0x1A-byte output buffer, copies 0x1A bytes via
`0x23460`, frees the scratch record, and returns the output buffer. Otherwise it
still calls `0x4FF0(0x37081383)`, frees the scratch record, and returns zero.
The name is conservative and records a static resource/probe dispatch-result
build shape, not a verified runtime API.

Static dossier: `docs/dossiers/boot-resource-probe-dispatch-result-build.md`.
The `0x00004FF0` target has since been superseded by the resource probe global
cleanup split below.

## Boot Resource Probe Global Cleanup Split

The next tracked Rev 0 original-MIPS split separates the overlapping
`0x4FF0/0x4FF8` helper pair after the resource probe dispatch result-builder:

- `asm/original/rev0/boot/boot_resource_probe_global_cleanup.s`
  `0x00004FF0..0x00005058`; parent reports `0x4FF0` as a 104-byte JAL-target
  leaf entry and `0x4FF8` as a 96-byte overlapping prologue body sharing the
  same return.
- Remainder:
  `asm/original/rev0/code_00005058_00011000.s`.
  That file has since been superseded by the resource probe chunk callback walk
  split below.

Static evidence: parent function/symbol/callgraph data reports high-confidence
callers to `0x4FF0` from `0x4AC8`, `0x4C34`, `0x4C5C`, `0x4DC0`, and `0x4ED4`;
no direct callers to `0x4FF8`; high-confidence callees `0x5058` and
`resource_free` (`0x16C4`); fixed RAM `0x80074BF0/0x80074BF8` in all seven
named states and all 21 snapshots; and reads/writes of `0x800A83B8` and
`0x800A83BC`. No unresolved call targets were reported.

Static shape: `0x4FF0` reads the byte at `0x800A83BC` and falls into the
`0x4FF8` prologue body. If that byte is `1` and incoming `a0` equals
`0x37081383`, the routine calls helper `0x5058` with the word at
`0x800A83B8`. It then clears `0x800A83BC`, frees the pointer stored at
`0x800A83B8` via `resource_free` when nonzero, clears `0x800A83B8`, and
returns. The name is conservative and records a static global cleanup/free
shape in the resource-probe family, not a verified runtime API.

Static dossier: `docs/dossiers/boot-resource-probe-global-cleanup.md`. The
`0x00005058` target has since been superseded by the resource probe chunk
callback walk split below.

## Boot Resource Probe Chunk Callback Walk Split

The next tracked Rev 0 original-MIPS split separates the 152-byte helper called
by the resource probe global cleanup helper:

- `asm/original/rev0/boot/boot_resource_probe_chunk_callback_walk.s`
  `0x00005058..0x000050F0`; parent reports a JAL-target prologue with frame
  size `0x28`, one indirect `jalr`, and no unresolved calls.
- Remainder:
  `asm/original/rev0/code_000050F0_00011000.s`.
  That file has since been superseded by the resource probe global buffer copy
  split below.

Static evidence: parent function/symbol/callgraph data reports high-confidence
callers from `0x4FF0` and `0x4FF8`, high-confidence callees `resource_alloc`
(`0x1330`) and `resource_free` (`0x16C4`), one indirect call through a scratch
function pointer, no unresolved targets, fixed RAM `0x80074C58` in all seven
named states and all 21 snapshots, and a read from `0x800C4800`.

Static shape: the routine allocates a 0x10-byte scratch record, stores callback
pointer `0x8008A0F0` into scratch word `+0x00`, and checks byte `0x800C4800`.
When that byte is zero, it walks an incoming buffer in 0x100-byte chunks across
an 0x8000-byte span, calling the scratch callback through `jalr` with
`(offset, buffer + offset, 0x100, 1)`. It then frees the scratch record and
returns. The name is conservative and records the static chunk-callback shape,
not a verified runtime API.

Static dossier: `docs/dossiers/boot-resource-probe-chunk-callback-walk.md`.
The `0x000050F0` target has since been superseded by the resource probe global
buffer copy split below.

## Boot Resource Probe Global Buffer Copy Split

The next tracked Rev 0 original-MIPS split keeps the overlapping
`0x50F0/0x50F8` helper pair together:

- `asm/original/rev0/boot/boot_resource_probe_global_buffer_copy.s`
  `0x000050F0..0x000051A0`; parent reports `0x50F0` as a 176-byte leaf entry
  and `0x50F8` as an overlapping 168-byte prologue body with frame size
  `0x28`.
- Remainder:
  `asm/original/rev0/code_000051A0_00011000.s`.
  That file has since been superseded by the resource probe global buffer
  signature check split below.

Static evidence: parent function/symbol/callgraph data reports high-confidence
callers to `0x50F0` from `0x4DC0` and `0x4ED4`; no direct callers to `0x50F8`;
high-confidence callees `resource_alloc` (`0x1330`), `0x1A4F0` / RAM
`0x8008A0F0`, and `0x23460` / RAM `0x80093060`; no unresolved targets; fixed
RAM `0x80074CF0/0x80074CF8` in all seven named states and all 21 snapshots; and
reads/writes of `0x800A83B8`.

Static shape: `0x50F0` loads global pointer `0x800A83B8` and falls into the
`0x50F8` stack-frame body. If the global is zero, the body allocates `0x8000`
bytes, stores the pointer back to `0x800A83B8`, and populates the span in
`0x100`-byte chunks by calling `0x8008A0F0(offset, global + offset, 0x100, 0)`.
It then copies the caller-provided source/length into `0x800A83B8 + offset`
through `0x80093060(global + a1, a0, a2)`. The name is conservative and records
the static global-buffer materialize/copy shape, not a verified runtime API.

Static dossier: `docs/dossiers/boot-resource-probe-global-buffer-copy.md`.

## Boot Resource Probe Global Buffer Signature Check Split

The next tracked Rev 0 original-MIPS split separates the 508-byte helper called
by resource probe init:

- `asm/original/rev0/boot/boot_resource_probe_global_buffer_signature_check.s`
  `0x000051A0..0x0000539C`; parent reports a JAL-target prologue with frame
  size `0x38`, no unresolved calls, and no indirect jump.
- Remainder:
  `asm/original/rev0/code_0000539C_00011000.s`.
  That file has since been superseded by the resource probe ID materialize
  split below.

Static evidence: parent function/symbol/callgraph data reports high-confidence
caller `0x4AC8`, high-confidence callees `resource_alloc` (`0x1330`),
`0x1A4F0` / RAM `0x8008A0F0`, `0x23460` / RAM `0x80093060`, and `0x23350` /
RAM `0x80092F50`; no unresolved targets; fixed RAM `0x80074DA0` in all seven
named states and all 21 snapshots; and reads/writes of `0x800A83B8`.

Static shape: the helper ensures shared global buffer `0x800A83B8` exists,
filling a newly allocated `0x8000`-byte span in `0x100`-byte chunks through
`0x8008A0F0`. It then copies four 8-byte records from offsets `0x14`,
`0x1864`, `0x30B4`, and `0x0004` into stack scratch with `0x80093060` and
compares each scratch record against the 8-byte base at `0x800A8240` through
`0x80092F50`. The first equal comparison returns zero; if all required
comparisons are nonzero, the final return is normalized with `sltu v0, zero,
v0`. The name is conservative and records a static signature/record-check
shape, not verified runtime semantics.

Static dossier:
`docs/dossiers/boot-resource-probe-global-buffer-signature-check.md`.

## Boot Resource Probe ID Materialize Split

The next tracked Rev 0 original-MIPS split separates the 416-byte helper called
by resource probe init, the finalize wrapper, and the `0x5760` helper:

- `asm/original/rev0/boot/boot_resource_probe_id_materialize.s`
  `0x0000539C..0x0000553C`; parent reports a prologue with frame size `0x38`,
  one indirect `jalr`, and one unresolved RAM call.
- Historical remainder at that step:
  `asm/original/rev0/code_0000553C_00011000.s`, now superseded by the
  dual-callback materialize split below.

Static evidence: parent function/symbol/callgraph data reports high-confidence
callers `0x4AC8`, `0x4C34`, and `0x5760`; high-confidence callees
`resource_alloc` (`0x1330`), `0x23780` / RAM `0x80093380`, `0x5D9C`,
`0x5C58` via RAM target `0x800758FC`, `0x23460` / RAM `0x80093060`,
`0x1A4F0` / RAM `0x8008A0F0`, `0x5B8C`, and `resource_free` (`0x16C4`);
unresolved target `0x8016CD90`; fixed RAM `0x80074F9C` in all seven named
states and all 21 snapshots; and traffic on `0x800A83B8/83BC` plus reads from
`0x800A824C/8258`.

Static shape: input ID `0x0E` allocates and clears a 0x10-byte record, calls the
unresolved `0x8016CD90` on record `+0x0C`, then calls nearby helpers before
freeing the record. Input ID `0x0F` clears stack scratch, copies 8 bytes from
`0x800A8240` into stack scratch, ensures shared global buffer `0x800A83B8`
exists, copies 12 bytes from global-buffer offset `0x30B0`, sets byte
`0x800A83BC` to `1`, and returns without heap scratch. Other IDs allocate and
clear a 0x1850-byte scratch record, walk 13 stride-`0x1C` callback entries read
from `0x800A824C/8258`, call nonzero callbacks through `jalr`, run nearby
helpers with the ID and scratch record, free the scratch, and return. The name
is conservative and records the static ID dispatch/materialize shape, not
verified runtime semantics.

Static dossier: `docs/dossiers/boot-resource-probe-id-materialize.md`.

## Boot Resource Probe Dual Callback Materialize Split

The next tracked Rev 0 original-MIPS split separates the 232-byte helper called
by resource probe dispatch prepare:

- `asm/original/rev0/boot/boot_resource_probe_dual_callback_materialize.s`
  `0x0000553C..0x00005624`; parent reports a prologue with frame size `0x20`,
  two indirect `jalr` calls, and no unresolved RAM calls.
- Historical remainder at that step:
  `asm/original/rev0/code_00005624_00011000.s`, now superseded by the
  global-buffer dual-callback apply split below.

Static evidence: parent function/symbol/callgraph data reports high-confidence
caller `0x4C5C`; high-confidence callees `resource_alloc` (`0x1330`),
`0x23780` / RAM `0x80093380`, `0x5D9C` / RAM `0x8007599C`, `0x5C58` / RAM
`0x80075858`, and `resource_free` (`0x16C4`); fixed RAM `0x8007513C` in all
seven named states and all 21 snapshots; and reads from
`0x800A8254/8258/8260/8264`.

Static shape: the routine allocates and clears a 0x4AE8-byte scratch record,
walks 13 stride-`0x1C` callback slots from `0x800A8254/8258` with callback
arguments at `scratch + offset + 0x0C`, walks 13 more slots from
`0x800A8260/8264` with arguments at `scratch + offset + 0x1850`, calls nearby
helpers `0x5D9C(0x0F, scratch)` and `0x5C58(scratch)`, frees the scratch
record, and returns. The name is conservative and records the static
dual-callback materialize shape, not verified runtime semantics.

Static dossier:
`docs/dossiers/boot-resource-probe-dual-callback-materialize.md`.

## Boot Resource Probe Global Buffer Dual Callback Apply Split

The next tracked Rev 0 original-MIPS split separates the 316-byte helper called
by resource probe dispatch apply:

- `asm/original/rev0/boot/boot_resource_probe_global_buffer_dual_callback_apply.s`
  `0x00005624..0x00005760`; parent reports a prologue with frame size `0x20`,
  two indirect `jalr` calls, and no unresolved RAM calls.
- Historical remainder at that step:
  `asm/original/rev0/code_00005760_00011000.s`, now superseded by the
  ID check/materialize split below.

Static evidence: parent function/symbol/callgraph data reports high-confidence
caller `0x4DC0`; high-confidence callees `resource_alloc` (`0x1330`, called
twice), `0x1A4F0` / RAM `0x8008A0F0`, `0x23460` / RAM `0x80093060`, and
`resource_free` (`0x16C4`); fixed RAM `0x80075224` in all seven named states
and all 21 snapshots; reads/writes `0x800A83B8`; and reads from
`0x800A8250/8258/825C/8264`.

Static shape: the routine allocates a `0x4AE8` scratch record, ensures shared
global buffer `0x800A83B8` exists by allocating `0x8000` and filling it in
`0x100`-byte chunks through `0x8008A0F0`, copies `0x4AE8` bytes from buffer
offset `0x30B0` into scratch through `0x80093060`, skips callbacks if scratch
word `+0x00` is zero, otherwise walks 13 stride-`0x1C` callback slots from
`0x800A8250/8258` with arguments at `scratch + offset + 0x0C`, walks 13 more
slots from `0x800A825C/8264` with arguments at
`scratch + offset + 0x1850`, frees the scratch record, and returns. The name is
conservative and records the static global-buffer/callback apply shape, not
verified runtime semantics.

Static dossier:
`docs/dossiers/boot-resource-probe-global-buffer-dual-callback-apply.md`.

## Boot Resource Probe ID Check Materialize Split

The next tracked Rev 0 original-MIPS split separates the 188-byte helper called
by resource probe init:

- `asm/original/rev0/boot/boot_resource_probe_id_check_materialize.s`
  `0x00005760..0x0000581C`; parent reports a prologue with frame size `0x20`,
  no indirect calls, and no unresolved RAM calls.
- Remainder after this split:
  `asm/original/rev0/code_0000581C_00011000.s`.

Static evidence: parent function/symbol/callgraph data reports high-confidence
caller `0x4AC8`; high-confidence callees `resource_alloc` (`0x1330`, called
three times), `0x5978` via RAM targets `0x80075688` and `0x80075578`, `0x581C`,
`resource_free` (`0x16C4`), and `0x539C`; fixed RAM `0x80075360` in all seven
named states and all 21 snapshots; no global xrefs; and no unresolved RAM
targets.

Static shape: the routine dispatches on incoming ID. ID `0x0E` allocates a
0x10-byte scratch record and calls nearby checker target RAM `0x80075688`.
ID `0x0F` allocates a 0x4AE8-byte scratch record and calls target RAM
`0x80075578`. All other IDs allocate a 0x1850-byte scratch record and call
`0x581C(id, scratch)`. It records whether the checker returned nonzero, frees
the scratch record, returns `1` on success, and calls `0x539C(id)` before
returning `0` on failure. The name is conservative and records the static
ID-check/fallback-materialize shape, not verified runtime semantics.

Static dossier:
`docs/dossiers/boot-resource-probe-id-check-materialize.md`.

## Boot Resource Probe Indexed Record Check Split

The next tracked Rev 0 original-MIPS split separates the 348-byte helper called
by the dispatch result builder and the ID check/materialize wrapper:

- `asm/original/rev0/boot/boot_resource_probe_indexed_record_check.s`
  `0x0000581C..0x00005978`; parent reports a prologue with frame size `0x30`,
  fixed RAM `0x8007541C`, and secondary entry `0x588C`.
- Remainder after this split, now superseded by the large-record split below:
  `asm/original/rev0/code_00005978_00011000.s`.

Static evidence: parent function/symbol/callgraph data reports callers `0x4ED4`
and `0x5760`; high-confidence callees `resource_alloc` (`0x1330`),
`0x1A4F0` / RAM `0x8008A0F0`, `0x23460` / RAM `0x80093060`, and `0x23350` /
RAM `0x80092F50`; unresolved RAM calls to `0x80075A84` and `0x80075B00`;
reads/writes `0x800A83B8`; and fixed residency in all seven named states / all
21 parent RAM snapshots.

Static shape: the routine computes `id * 0x1850 + 0x10`, ensures the shared
global buffer `0x800A83B8` exists by allocating `0x8000` and filling it in
`0x100`-byte chunks through `0x8008A0F0`, copies `0x1850` bytes from the shared
buffer into caller scratch through `0x80093060`, compares `scratch + 4` against
the 8-byte base at `0x800A8240` through `0x80092F50`, then calls unresolved
halfword-return helpers over `scratch + 0x0C` / length `0x1844` and compares
their low halfwords against the first two scratch header halfwords. The name is
conservative and records the static indexed-record check shape, not verified
runtime semantics or final checksum names.

Static dossier:
`docs/dossiers/boot-resource-probe-indexed-record-check.md`.

## Boot Resource Probe Large Record Check Split

The next tracked Rev 0 original-MIPS split separates the overlapping helper pair
called by the dispatch result builder and the ID check/materialize wrapper:

- `asm/original/rev0/boot/boot_resource_probe_large_record_check.s`
  `0x00005978..0x00005A88`; parent reports a leaf entry at `0x5978` that falls
  into the `0x5980` prologue body with frame size `0x28`.
- Remainder after this split, now superseded by the small-record split below:
  `asm/original/rev0/code_00005A88_00011000.s`.

Static evidence: parent function/symbol/callgraph data reports callers `0x4ED4`
and `0x5760` to the leaf entry, plus a second `0x5760` call to the sibling RAM
target `0x80075688`; high-confidence callees `resource_alloc` (`0x1330`),
`0x1A4F0` / RAM `0x8008A0F0`, `0x23460` / RAM `0x80093060`, and `0x23350` /
RAM `0x80092F50`; unresolved RAM calls to `0x80075A84` and `0x80075B00`;
reads/writes `0x800A83B8`; and fixed residency in all seven named states / all
21 parent RAM snapshots.

Static shape: the `0x5978` prefix loads shared global buffer pointer
`0x800A83B8`, then the `0x5980` prologue body ensures the shared buffer exists
by allocating `0x8000` and filling it in `0x100`-byte chunks through
`0x8008A0F0`. It copies `0x4AE8` bytes from shared-buffer offset `0x30B0` into
caller scratch through `0x80093060`, compares `scratch + 4` against the 8-byte
base at `0x800A8240`, and returns zero on mismatch. If scratch word `+0x00` is
zero, it returns `1`; otherwise it checks two halfword-return helpers over
`scratch + 0x0C` / length `0x4ADC` / source offset `0x30B0` against the first
two scratch header halfwords. The name is conservative and records the static
large-record check shape, not verified runtime semantics or final checksum
names.

Static dossier:
`docs/dossiers/boot-resource-probe-large-record-check.md`.

## Boot Resource Probe Small Record Check Split

The next tracked Rev 0 original-MIPS split separates the overlapping sibling
helper pair after the large-record check:

- `asm/original/rev0/boot/boot_resource_probe_small_record_check.s`
  `0x00005A88..0x00005B8C`; parent reports a leaf entry at `0x5A88` that falls
  into the `0x5A90` prologue body with frame size `0x28`.
- Remainder at that step, now superseded by the indexed-record copy/flag split:
  `asm/original/rev0/code_00005B8C_00011000.s`.

Static evidence: parent function/symbol/callgraph data reports the pair as the
same permanent sibling family seen by the previous wrapper target
`0x80075688`, with primary RAM `0x80075578/0x80075580` and matching code at
`0x80075688/0x80075690` across all seven named states / all 21 parent RAM
snapshots. High-confidence callees are `resource_alloc` (`0x1330`),
`0x1A4F0` / RAM `0x8008A0F0`, `0x23460` / RAM `0x80093060`, and `0x23350` /
RAM `0x80092F50`; unresolved RAM calls remain `0x80075A84` and `0x80075B00`;
global traffic reads/writes `0x800A83B8`.

Static shape: the `0x5A88` prefix loads shared global buffer pointer
`0x800A83B8`, then the `0x5A90` prologue body ensures the shared buffer exists
by allocating `0x8000` and filling it in `0x100`-byte chunks through
`0x8008A0F0`. It copies `0x10` bytes from shared-buffer offset `0` into caller
scratch through `0x80093060`, compares `scratch + 4` against the 8-byte base at
`0x800A8240`, and returns zero on mismatch. It then checks two
halfword-return helpers over `scratch + 0x0C` / length `4` / source offset `0`
against the first two scratch header halfwords. The name is conservative and
records the static small-record check shape, not verified runtime semantics or
final checksum names.

Static dossier:
`docs/dossiers/boot-resource-probe-small-record-check.md`.

## Boot Resource Probe Indexed Record Copy/Flag Split

The next tracked Rev 0 original-MIPS split separates the indexed-record
materialize helper after the small-record check:

- `asm/original/rev0/boot/boot_resource_probe_indexed_record_copy_flag.s`
  `0x00005B8C..0x00005C58`; parent reports a 204-byte prologue helper with
  frame size `0x28`.
- Remainder at that step, now superseded by the large-record copy/flag split:
  `asm/original/rev0/code_00005C58_00011000.s`.

Static evidence: parent symbol/callgraph data places the helper at fixed RAM
`0x8007578C` in all seven named states / all 21 snapshots. Static callers are
`0x4C5C` and `0x539C`; high-confidence callees are `resource_alloc` (`0x1330`),
`0x1A4F0` / RAM `0x8008A0F0`, and `0x23460` / RAM `0x80093060`; there are no
unresolved RAM calls. Global traffic reads/writes `0x800A83B8` and writes byte
`0x800A83BC`.

Static shape: computes `id * 0x1850 + 0x10`, ensures shared buffer
`0x800A83B8` exists by allocating/filling `0x8000` bytes when needed, copies one
`0x1850`-byte indexed record from that offset into caller scratch, sets
`0x800A83BC = 1`, and returns. The name is conservative and records the static
copy/flag shape, not verified runtime semantics.

Static dossier:
`docs/dossiers/boot-resource-probe-indexed-record-copy-flag.md`.

## Boot Resource Probe Large Record Copy/Flag Split

The next tracked Rev 0 original-MIPS split separates the large-record copy/flag
helper after the indexed-record copy/flag helper:

- `asm/original/rev0/boot/boot_resource_probe_large_record_copy_flag.s`
  `0x00005C58..0x00005CFC`; parent reports a leaf entry at `0x5C58` that falls
  into the `0x5C60` prologue body with frame size `0x20`.
- Remainder at that step, now superseded by the small-record copy/flag split:
  `asm/original/rev0/code_00005CFC_00011000.s`.

Static evidence: parent symbol data places the exact helper at fixed RAM
`0x80075858/0x80075860` in all seven named states / all 21 snapshots. Direct
caller evidence for the exact entry is `0x553C`; parent callgraph aliases
nearby sibling targets from `0x4C5C` and `0x539C` into the same family, so keep
the `0x5CFC/0x5D04` sibling separate for the next split. High-confidence
callees are `resource_alloc` (`0x1330`), `0x1A4F0` / RAM `0x8008A0F0`, and
`0x23460` / RAM `0x80093060`; there are no unresolved RAM calls. Global traffic
reads/writes `0x800A83B8` and writes byte `0x800A83BC`.

Static shape: the `0x5C58` prefix loads shared buffer pointer `0x800A83B8`, then
the `0x5C60` prologue body ensures that buffer exists by allocating/filling
`0x8000` bytes when needed, copies `0x4AE8` bytes from shared-buffer offset
`0x30B0` into caller scratch, sets `0x800A83BC = 1`, and returns. The name is
conservative and records the static large-record copy/flag shape, not verified
runtime semantics.

Static dossier:
`docs/dossiers/boot-resource-probe-large-record-copy-flag.md`.

## Boot Resource Probe Small Record Copy/Flag Split

The next tracked Rev 0 original-MIPS split separates the overlapping sibling
helper after the large-record copy/flag helper:

- `asm/original/rev0/boot/boot_resource_probe_small_record_copy_flag.s`
  `0x00005CFC..0x00005D9C`; parent reports a leaf entry at `0x5CFC` that falls
  into the `0x5D04` prologue body with frame size `0x20`.
- Remainder at that step, now superseded by the record checksum/signature split:
  `asm/original/rev0/code_00005D9C_00011000.s`.

Static evidence: parent symbol/callgraph data places the helper at sibling RAM
targets `0x800758FC/0x80075904` in all seven named states / all 21 snapshots.
Static direct callers are `0x4C5C` and `0x539C`, though parent callgraph v2
folds those RAM targets into the nearby `0x5C58` family. High-confidence
callees are `resource_alloc` (`0x1330`), `0x1A4F0` / RAM `0x8008A0F0`, and
`0x23460` / RAM `0x80093060`; there are no unresolved RAM calls. Global traffic
reads/writes `0x800A83B8` and writes byte `0x800A83BC`.

Static shape: the `0x5CFC` prefix loads shared buffer pointer `0x800A83B8`, then
the `0x5D04` prologue body ensures that buffer exists by allocating/filling
`0x8000` bytes when needed, copies `0x10` bytes from shared-buffer offset `0`
into caller scratch, sets `0x800A83BC = 1`, and returns. The name is
conservative and records the static small-record copy/flag shape, not verified
runtime semantics.

Static dossier:
`docs/dossiers/boot-resource-probe-small-record-copy-flag.md`.

## Boot Resource Probe Record Checksum/Signature Split

The next tracked Rev 0 original-MIPS split separates the record header
checksum/signature helper cluster after the small-record copy/flag helper:

- `asm/original/rev0/boot/boot_resource_probe_record_checksum_signature.s`
  `0x00005D9C..0x00005FC0`; parent reports a 544-byte prologue at `0x5D9C`
  with frame size `0x20` and secondary entries at `0x5E84` and `0x5F00`.
- Remainder at that step, now superseded by the state dispatch loop init split:
  `asm/original/rev0/code_00005FC0_00011000.s`.

Static evidence: parent symbol data places `0x5D9C` at fixed RAM
`0x8007599C` in all seven named states / all 21 snapshots. Static callers are
`0x4C5C`, `0x539C`, and `0x553C`, with adjacent record-check helpers also
calling the secondary entry targets. The only high-confidence external callee is
`0x23460` / RAM `0x80093060`; local direct calls to `0x80075A84` and
`0x80075B00` are internal secondary entries in the same split.

Static shape: dispatches on ID `0x0E`, `0x0F`, or indexed IDs, computes two
low-halfword helper values over the record payload, writes them to record
header halfwords, and copies the 8-byte base signature from `0x800A8240` to
record `+4`. The file also keeps local zero-seed byte-sum and bit-count sibling
entries at `0x5EC4` and `0x5F60` with the parent-reported secondary entries at
`0x5E84` and `0x5F00`. The name is conservative and records the static
checksum/signature shape, not verified runtime semantics.

Static dossier:
`docs/dossiers/boot-resource-probe-record-checksum-signature.md`.

## Boot State Dispatch Loop Init Split

The next tracked Rev 0 original-MIPS split separates the large boot/state
dispatch loop and its local selector helper:

- `asm/original/rev0/boot/boot_state_dispatch_loop_init.s`
  `0x00005FC0..0x000065A4`; parent reports a 1508-byte prologue at `0x5FC0`
  with frame size `0x28` and a secondary entry at `0x6550`.
- Remainder at that step, now superseded by the accumulator seed wrapper split:
  `asm/original/rev0/code_000065A4_00011000.s`.

Static evidence: parent symbol data places `0x5FC0` at fixed RAM
`0x80075BC0` in all seven named states / all 21 snapshots. The high-confidence
caller is `0x22B0`; parent also reports three indirect calls and unresolved
targets that local source inspection resolves in part as the internal secondary
entry `0x80076150` (`0x6550`). High-confidence callees include `0x23780`,
`0x25A10`, `0x65E4`, `0x6724`, `0x19D90`, `0x1120`, `0x2D44`, `0x19FC0`,
`0x19E30`, and `0x3798`.

Static shape: initializes a callback/function-pointer table at
`0x800AF028..0x800AF088`, manages the task stack/head at `0x800C4BBC`, status
halfword `0x800C4C26`, depth byte `0x800AF020`, selected callback index
`0x800E810E`, and callback return pointer `0x800E8294`, then loops through
state callbacks and scheduler/status transitions. The local `0x6550` secondary
entry dispatches through the jump table at `0x800ADF30` and can write
`0xFFFE` to `0x800C4C26`. The name is conservative and records the static
dispatch-loop/table-init shape, not a complete runtime state-machine model.

Static dossier:
`docs/dossiers/boot-state-dispatch-loop-init.md`.

## Boot Mode/Message Accumulator Seed Wrapper Split

The next tracked Rev 0 original-MIPS split separates the small wrapper after the
state dispatch loop:

- `asm/original/rev0/boot/boot_mode_message_accumulator_seed_wrapper.s`
  `0x000065A4..0x000065E4`; parent reports a 64-byte prologue at `0x65A4`
  with frame size `0x28`.
- Remainder at that step, now superseded by the resource table/mask apply
  split:
  `asm/original/rev0/code_000065E4_00011000.s`.

Static evidence: parent symbol data places `0x65A4` at fixed RAM
`0x800761A4` in all seven named states / all 21 snapshots, with no v2 direct
callers. The local `jal 0x80073164` maps linearly to ROM `0x3564`, the
secondary entry inside `boot_mode_message_accumulator_update.s`. Parent old
symbol data folds that edge to `0x347C`; v2 leaves the secondary-entry target
unresolved.

Static shape: the wrapper calls the accumulator secondary in mode `a0 = 0` with
values `1`, `1`, `0x80`, `1`, `0x100`, and `0x2000` in
`a1/a2/a3/sp+0x10/sp+0x14/sp+0x18`, then returns. The callee's mode-zero path
overwrites six halfword-like accumulator globals and writes byte flag
`0x800AEE72 = 2`. The name is conservative and records a static seed/default
wrapper relationship, not runtime semantic proof.

Static dossier:
`docs/dossiers/boot-mode-message-accumulator-seed-wrapper.md`.

## Boot Resource Table/Mask Apply Split

The next tracked Rev 0 original-MIPS split keeps the related table/mask helper
cluster together:

- `asm/original/rev0/boot/boot_resource_table_mask_apply.s`
  `0x000065E4..0x000068E0`; contains prologue helpers at `0x65E4` and
  `0x6724`, the shared local selector leaf at `0x6830`, and padding through the
  next clean prologue boundary.
- Remainder at this split, now superseded by the boot state global reset split:
  `asm/original/rev0/code_000068E0_00011000.s`.

Static evidence: parent symbol data places `0x65E4` and `0x6724` at fixed RAM
`0x800761E4` and `0x80076324` in all seven named states / all 21 snapshots, both
with high-confidence caller `0x5FC0`. Parent labels `0x65E4` as
`dma/resource::resource loader` and reports high-confidence callees
`0x204C0`, `0x20410`, `0x2DE50`, and `0x23780`; `0x6724` calls
`resource_arena_register` (`0x1120`) twice. Parent callgraph leaves
`0x80076430` unresolved for both helpers; local source resolves that target to
the in-range selector leaf at `0x6830`.

Static shape: `0x6830` scans pointer table `0x800B86FC` and chooses a table
slot whose listed bit IDs are not already masked by the incoming value.
`0x65E4` then walks that selected `0xFF`-terminated byte list and, for selected
IDs, applies table ranges around `0x800B83C0..0x800B83E4` through helpers
`0x800900C0`, `0x80090010`, `0x8009DA50`, and `0x80093380`. `0x6724` walks the
same selected list and registers gaps up to per-ID/end bounds and final
`0x80243DB0` through `resource_arena_register`. Names remain conservative
source-layout labels, not runtime-verified resource semantics.

Static dossier: `docs/dossiers/boot-resource-table-mask-apply.md`.

## Boot State Global Reset Split

The next tracked Rev 0 original-MIPS split promotes the compact boot
state/global reset-style helper immediately after the table/mask cluster:

- `asm/original/rev0/boot/boot_state_global_reset.s`
  `0x000068E0..0x000069D8`; contains the 248-byte prologue helper at `0x68E0`.
- Remainder at this split, now superseded by the boot state slot callback
  dispatch split:
  `asm/original/rev0/code_000069D8_00011000.s`.

Static evidence: parent function data reports `0x68E0` as a 248-byte valid
prologue helper with frame size `0x18`, epilogue, no indirect jumps, fixed RAM
`0x800764E0` in all seven named states, and high-confidence caller `0x22B0`.
High-confidence callees are `0x25090` / RAM `0x80094C90` twice, `0x23780` /
RAM `0x80093380` twice, `0x49A60` / RAM `0x80173B60`, and `0x859C` / RAM
`0x8007819C`; the one unresolved callgraph target is RAM `0x8009C7C0`.

Static shape: the helper calls `0x80094C90`, clears `0x800E82C8` length
`0x3F0`, clears `0x800C4C10` length `0x0C`, sets `0x800C4C20 = 1` and
`0x800E79A0 = 8`, clears halfword/global state around `0x800C49D0` and
`0x800BF0A0..0x800BF0B0`, initializes four pointer/halfword slots at
`0x800BF090/0x800BF0A6`, then calls unresolved `0x8009C7C0`,
`0x80173B60([0x800BF0B0])`, and `0x8007819C`. The name is conservative and
records a static reset/init shape, not runtime-verified system semantics.

Static dossier: `docs/dossiers/boot-state-global-reset.md`.

## Boot State Slot Callback Dispatch Split

The next tracked Rev 0 original-MIPS split promotes the large permanent helper
called by the early boot state service loop:

- `asm/original/rev0/boot/boot_state_slot_callback_dispatch.s`
  `0x000069D8..0x00006EE8`; contains the 1,296-byte prologue helper at
  `0x69D8`.
- Remainder at this split, now superseded by the boot state slot render
  callback walk split:
  `asm/original/rev0/code_00006EE8_00011000.s`.

Static evidence: parent function data reports `0x69D8` as a valid 1,296-byte
prologue helper with frame size `0x30`, epilogue, `jalr`, no indirect jump,
fixed RAM `0x800765D8` in all seven named states, and high-confidence caller
`0x27A0`. The caller source in `boot_state_service_loop.s` calls sibling helper
`0x6EE8`, compact wrapper `0x71C8`, then `0x69D8`. High-confidence callees are
`0x23460` / RAM `0x80093060` four times, `0x49A60` / RAM `0x80173B60`,
`0x84D4` / RAM `0x800780D4` twice, `0x8388` / RAM `0x80077F88` twice,
`0x859C` / RAM `0x8007819C` twice, `0x8564` / RAM `0x80078164`, `0x49C14` /
RAM `0x80173D14`, `0x49C4C` / RAM `0x80173D4C`, `0x2CBCC` / RAM
`0x8009C7CC`, and `0x7688` / RAM `0x80077288`; unresolved RAM targets are
`0x80077494` and `0x8017C29C`.

Static shape: the helper processes six 0xA8-byte records rooted at
`0x800E82C8`, uses `0x800E7A30` as a working record copy, writes current slot
global `0x800C4C20`, dispatches through working-record callback pointers at
`0x800E7A40` and `0x800E7A44`, updates flags/geometry-like halfwords around
`0x800E7A32..0x800E7A3C`, handles pointer/list state at `0x800E7AC8` and
`0x800BF0B0`, decrements counter `0x800C49D0`, restores modified working
records back to their source slots, then sets `0x800C4C20 = -1` and calls
`0x80077288`. The name is conservative and records a static slot/callback
dispatch shape, not runtime-verified state-machine semantics.

Static dossier: `docs/dossiers/boot-state-slot-callback-dispatch.md`.

## Boot State Slot Render Callback Walk Split

The next tracked Rev 0 original-MIPS split promotes the related helper after
the slot callback dispatch helper:

- `asm/original/rev0/boot/boot_state_slot_render_callback_walk.s`
  `0x00006EE8..0x000071C8`; contains the `0x6EE8` leaf prefix and `0x6EF0`
  prologue body.
- Remainder at this split, now superseded by the boot state slot queue service
  gate split:
  `asm/original/rev0/code_000071C8_00011000.s`.

Static evidence: parent function data reports `0x6EE8` as a 736-byte valid
JAL-target leaf entry with `jr $ra`, `jalr`, and end `0x71C8`; `0x6EF0` is the
728-byte prologue body with frame size `0x38`, epilogue, `jalr`, and the same
end. Fixed runtime evidence places the helper at RAM `0x80076AE8/0x80076AF0`
in all seven named states and all 21 parent snapshots. High-confidence caller
for `0x6EE8` is `0x27A0`; parent v2 also reports high-confidence caller
`0x102FA8` for the `0x6EF0` body. High-confidence callees are `0x23460` /
RAM `0x80093060` count 2, `0x8564` / RAM `0x80078164`, `0x49C84` /
RAM `0x80173D84`, `0x49CBC` / RAM `0x80173DBC`, and `0x84D4` /
RAM `0x800780D4`; unresolved target is `0x800782EC`.

Static shape: starts from `0x800C49D0 - 1`, walks queued slot list
`0x800C4C10` backwards, copies selected 0xA8-byte records from `0x800E82C8`
into working record `0x800E7A30`, writes active slot `0x800C4C20`, emits
display-list `DE00`/`E700` packets through `0x800E9BA0`, calls helpers
`0x80173D84`/`0x80173DBC`, dispatches working-record callback pointer
`0x800E7A48` through `jalr`, optionally calls unresolved `0x800782EC`, calls
`0x800780D4`, restores the working record to the source slot, and exits with
`0x800C4C20 = -1`. The name is conservative and records a static
slot/render/callback walk shape, not runtime-verified state-machine or graphics
semantics.

Static dossier: `docs/dossiers/boot-state-slot-render-callback-walk.md`.

## Boot State Slot Queue Service Gate Split

The next tracked Rev 0 original-MIPS split promotes the compact gate after the
slot render/callback walk helper:

- `asm/original/rev0/boot/boot_state_slot_queue_service_gate.s`
  `0x000071C8..0x00007200`; contains the `0x71C8` leaf prefix and `0x71D0`
  prologue body.
- Remainder at this split, now superseded by the boot resource global handle
  release split:
  `asm/original/rev0/code_00007200_00011000.s`.

Static evidence: parent function data reports `0x71C8` as a 56-byte leaf entry
that falls into the `0x71D0` 48-byte prologue body with frame size `0x18` and
clean end `0x7200`. Fixed runtime evidence places the pair at RAM
`0x80076DC8/0x80076DD0` in all seven named states and all 21 parent snapshots.
High-confidence caller for `0x71C8` is `0x27A0`. High-confidence callees are
`0x79EC` / RAM `0x800775EC` and `0x859C` / RAM `0x8007819C`; unresolved RAM
target is `0x80077BF8`.

Static shape: the leaf prefix reads halfword global `0x800C49D0`. The body saves
`ra`, returns immediately when the halfword is zero, otherwise calls
`0x800775EC`, unresolved `0x80077BF8`, and `0x8007819C`, then restores `ra` and
returns. The name is conservative and records a static queue/service gate shape,
not runtime-verified scheduler semantics.

Static dossier: `docs/dossiers/boot-state-slot-queue-service-gate.md`.

## Boot Resource Global Handle Release Split

The next tracked Rev 0 original-MIPS split promotes the compact utility after
the queue service gate:

- `asm/original/rev0/boot/boot_resource_global_handle_release.s`
  `0x00007200..0x0000722C`; contains the `0x7200` leaf prefix and `0x7208`
  prologue body.
- Remainder at this split, now superseded by the boot resource global handle
  slot record prepare split:
  `asm/original/rev0/code_0000722C_00011000.s`.

Static evidence: parent function data reports `0x7200` as a 44-byte leaf entry
that falls into the `0x7208` 36-byte prologue body with frame size `0x18` and
clean end `0x722C`. Fixed runtime evidence places the pair at RAM
`0x80076E00/0x80076E08` in all seven named states and all 21 parent snapshots.
High-confidence callers for `0x7200` are `0x4EBCC` and `0x4EC3C`;
medium-confidence caller is `0x1CF960`. High-confidence callee is `0x49AA0` /
RAM `0x80173BA0`.

Static shape: the leaf prefix reads word global `0x800AF0B0` into `a0`. The body
saves `ra`, calls `0x80173BA0(a0)`, clears `0x800AF0B0`, restores `ra`, and
returns. The nearby sibling `0x722C` calls paired helper `0x80173B60` and stores
its return value back to `0x800AF0B0`, so the release-style name is a cautious
static pairing label, not runtime-verified ownership semantics.

Static dossier: `docs/dossiers/boot-resource-global-handle-release.md`.

## Boot Resource Global Handle Slot Record Prepare Split

The next tracked Rev 0 original-MIPS split promotes the larger sibling helper
family after the global-handle release helper:

- `asm/original/rev0/boot/boot_resource_global_handle_slot_record_prepare.s`
  `0x0000722C..0x00007560`; contains the `0x722C` leaf prefix, `0x7234`
  prologue body, secondary entries `0x735C` and `0x745C`, and the final delay
  slot at `0x755C`.
- Remainder at this split, now superseded by the boot state slot current peer
  record flag mark split:
  `asm/original/rev0/code_00007560_00011000.s`.

Static evidence: parent function data reports `0x722C` as a 44-byte leaf entry
that falls into the `0x7234` 812-byte prologue helper with frame size `0x18`,
fixed RAM `0x80076E2C/0x80076E34` in all seven named states and all 21 parent
snapshots, secondary entries at `0x735C` and `0x745C`, high-confidence callers
`0x4EC10` and `0x4EC3C`, medium-confidence caller `0x1CF9C0`, and
high-confidence callee `0x49A60` / RAM `0x80173B60`. Static shape: refreshes
global handle `0x800AF0B0` through helper `0x80173B60`, then scans or writes
six 0xA8-byte slot records rooted at corrected signed address `0x800E82C8`
(not stale `0x800F82C8`), writing fields at `+0x00`, `+0x06..+0x10`,
`+0xA2`, and `+0xA4` from call arguments and current-slot globals
`0x800C4C20` / `0x800E810E`. Local source inspection confirms the clean
exclusive end is `0x7560`: `0x7558` is `jr ra` and `0x755C` is its delay slot.
Static dossier:
`docs/dossiers/boot-resource-global-handle-slot-record-prepare.md`.

## Boot State Slot Current Peer Record Flag Mark Split

The next tracked Rev 0 original-MIPS split promotes the compact helper after
the global-handle slot record prepare helper:

- `asm/original/rev0/boot/boot_state_slot_current_peer_record_flag_mark.s`
  `0x00007560..0x00007600`; contains the `0x7560` leaf prefix and `0x7568`
  prologue body.
- Remainder at this split, now superseded by the boot state slot target peer
  record dispatch split:
  `asm/original/rev0/code_00007600_00011000.s`.

Static evidence: parent function data reports `0x7568` as a 152-byte prologue
helper with frame size `0x20`, fixed RAM `0x80077168`, no direct v2 callers,
and high-confidence callee `0x8388` / RAM `0x80077F88`. Local source keeps the
two-word `0x7560` prefix with the body because it reads current active-slot
global `0x800C4C20` into the value consumed by the body. Static shape: when the
active slot is nonnegative, scans six 0xA8-byte slot records rooted at corrected
signed address `0x800E82C8`, skips the current slot, requires record flag bit
`0x8000`, requires signed record field `+0xA2` to equal the active-slot global,
calls `0x80077F88(slot)`, then sets bit `0x02` in working-record byte
`0x800E7A32`. The name is conservative and records the static peer-record scan
and flag-mark shape, not runtime-verified scheduler semantics.

Static dossier:
`docs/dossiers/boot-state-slot-current-peer-record-flag-mark.md`.

## Boot State Slot Target Peer Record Dispatch Split

The next tracked Rev 0 original-MIPS split promotes the target-slot sibling
helper after the current peer-record flag mark helper:

- `asm/original/rev0/boot/boot_state_slot_target_peer_record_dispatch.s`
  `0x00007600..0x00007688`; contains the `0x7600` prologue helper.
- Remainder at this split, now superseded by the boot state slot flagged
  dispatch/lookup split:
  `asm/original/rev0/code_00007688_00011000.s`.

Static evidence: parent function data reports `0x7600` as a 136-byte prologue
helper with frame size `0x20`, fixed RAM `0x80077200`, no direct v2 callers,
and high-confidence callee `0x8388` / RAM `0x80077F88`. Static shape: saves the
incoming target slot in `s2`, returns immediately when that target is negative,
scans six 0xA8-byte slot records rooted at corrected signed address
`0x800E82C8`, skips the target slot, requires record flag bit `0x8000`,
requires signed record field `+0xA2` to equal the target slot, and calls
`0x80077F88(slot)` for matching peer records. The name is conservative and
records the static target-slot peer-record dispatch shape, not runtime-verified
scheduler semantics.

Static dossier:
`docs/dossiers/boot-state-slot-target-peer-record-dispatch.md`.

## Boot State Slot Flagged Dispatch/Lookup Split

The next tracked Rev 0 original-MIPS split promotes the status-gated slot
dispatch helper and its local lookup leaf after the target peer-record dispatch
helper:

- `asm/original/rev0/boot/boot_state_slot_flagged_dispatch_lookup.s`
  `0x00007688..0x00007768`; contains the `0x7688` prologue helper and
  secondary entry `0x7714`.
- Remainder at this split, now superseded by the boot state slot pool/table
  helper split:
  `asm/original/rev0/code_00007768_00011000.s`.

Static evidence: parent function/symbol data reports `0x7688` as a 224-byte
prologue helper with frame size `0x20`, fixed RAM `0x80077288` in all seven
named states and all 21 snapshots, high-confidence caller `0x69D8`, clean end
at `0x7768`, and secondary entry `0x7714`. Local source resolves the parent v2
unresolved call target `0x80077F80` to a two-instruction `jr ra; nop` secondary
tail immediately before the `0x8388` helper. Static shape: the primary entry
calls that no-op-style secondary tail, checks status halfword `0x800C4C26`
against `0xFFFF`, scans six 0xA8-byte slot records rooted at corrected signed
address `0x800E82C8`, requires record flag bit `0x8000` and byte field
`+0x03 & 0x04`, and calls `0x80077F88(slot)` for matching records. The `0x7714`
secondary leaf scans the same six records for word field `+0x10` matching
incoming `a0`, returning the slot index or `-1`. The name is conservative and
records the static slot flag/lookup shape, not runtime-verified scheduler
semantics.

Static dossier:
`docs/dossiers/boot-state-slot-flagged-dispatch-lookup.md`.

## Boot State Slot Pool/Table Helpers Split

The next tracked Rev 0 original-MIPS split promotes the ten-entry slot pool
scanner and pointer-table install helper after the flagged dispatch/lookup
helper:

- `asm/original/rev0/boot/boot_state_slot_pool_table_helpers.s`
  `0x00007768..0x000079EC`; contains the `0x7768` prologue helper, secondary
  scan leaves at `0x77D4`, `0x780C`, `0x785C`, and the pointer-table install
  helper starting at local `0x7894`.
- Current remainder:
  `asm/original/rev0/code_000079EC_00011000.s`.

Static evidence: parent function/symbol data reports `0x7768` as a 644-byte
prologue helper with frame size `0x18`, fixed RAM `0x80077368` in all seven
named states and all 21 snapshots, old static callers `0x69D8`, `0xEBBC0`, and
`0xED530`, and a callee folded to `0x23908`. Parent v2 leaves literal target
`0x80093540` unresolved; local source shows that address is an in-function
entry inside the shared diagnostic/assert helper at ROM `0x23908..0x23964`.
Static shape: the first leaves scan ten-entry word pools rooted around
`0x800E8300`, `0x800E7A68`, `0x800E8328`, and `0x800E7A90`, returning an empty
index or `-1`; the first scan calls `0x80093540(0x800ADF88)` and parks if the
computed record has no free ten-entry word. The trailing helper compares
incoming `a0` against halfword global `0x800C4C10`, then installs one of two
pointer-table sets into globals around `0x800C48xx..0x800C4Cxx`,
`0x800E79xx..0x800E7Dxx`, and `0x800F81xx..0x800F9Bxx`. Parent
`functions.json` reports the boundary awkwardly around `0x79E8`, but local
source confirms the delay-slot store at `0x79E8` belongs to this unit and the
clean exclusive end is the next prologue at `0x79EC`.

Static dossier:
`docs/dossiers/boot-state-slot-pool-table-helpers.md`.

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
  bytes visible, 1 tracked composite real-asm chunk made from 69 tracked source
  files, 99 generated fallback chunks, full-source manifest 1,059 entries with
  2,469,141 ambiguous bytes preserved explicitly, 3 tracked non-code
  source-owner files / 44,029 bytes, 1,055 generated non-code fallback files /
  35,388,567 bytes, source-manifest rebuild exact, full ROM
  SHA256
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

Next phase is either promoting another small non-code owner batch or continuing
tracked original-MIPS splits from `asm/original/rev0/code_000079EC_00011000.s`.
Do not begin semantic C decomp unless the setup verifier is green.
