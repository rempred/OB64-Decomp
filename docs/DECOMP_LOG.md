# OB64 Decomp Log

This is the compact current-state decomp memory. Full historical logs are
archived under `docs/archive/`; the newest full archive before this compaction
is
`docs/archive/DECOMP_LOG-full-through-boot-resource-node-lzss-context-materialize-2026-06-21.md`.

Read this after `AGENTS.md`, `docs/PLATFORM.md`, `docs/REV0_SCOPE.md`,
`docs/TOOLCHAIN.md`, and `docs/WORKFLOW.md`. Keep this file focused on durable
session facts, active frontiers, and verification results. If it again grows
toward roughly 10,000 tokens, archive the full version under `docs/archive/`
and replace the active log with a compact current-state summary.

## Current Invariants

- Target: Ogre Battle 64 US Rev 0 only.
- Every configured byte must remain source-owned. The full-ROM source manifest
  currently covers all 41,943,040 bytes with zero unknown bytes.
- Whole-ROM coverage still independently scans for LHA headers; do not trust the
  parent archive catalog by itself.
- Current tracked code source mix: one composite real-assembler chunk
  `0x00001000..0x00011000` made from 99 tracked source files, plus 99 generated
  fallback code chunks.
- Current tracked non-code source-owner mix: 3 tracked files / 44,029 bytes,
  plus 1,055 generated fallback owner files / 35,388,567 bytes.
- Current code-region SHA256:
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- Current rebuilt/full ROM SHA256:
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
- Canonical verification command: `node tools\verify_setup.js`.

## Source Promotion History

The first Rev 0 code chunk `0x00001000..0x00011000` is promoted as a tracked
composite chunk in `asm/original/rev0/manifest.json`. Its source files are still
original/reference MIPS using exact `.word` output plus decode comments; names
are conservative source-layout labels unless a dossier says runtime behavior is
verified.

Current named sequence:

- `boot_entry_clear_bss.s` `0x1000..0x1060`.
- Resource arena and allocator files through `resource_largest_free_block.s`
  `0x1060..0x18D4`.
- Resource validation/realloc/tree files through `resource_alloc_tree_scan.s`
  `0x18D4..0x22B0`.
- `early_boot_resource_loader.s` and `boot_state_service_loop.s`
  `0x22B0..0x2B38`.
- Boot mode/flag helpers through `boot_status_flag_test.s`
  `0x2B38..0x2D7C`.
- `boot_table_mask_reconcile.s` `0x2D7C..0x347C`.
- `boot_mode_message_accumulator_update.s` `0x347C..0x368C`.
- Resource-buffer/state/display-list helpers through
  `boot_display_list_sync_modes.s` `0x368C..0x4048`.
- Display-list counter helpers through `boot_display_list_counter_packet_emit.s`
  `0x4048..0x42D8`.
- `boot_resource_window_cache_update.s` `0x42D8..0x43D4`.
- Bitstream descriptor/cursor helpers through
  `boot_bitstream_descriptor_encode.s` `0x43D4..0x4AC8`.
- Resource probe helpers through
  `boot_resource_probe_record_checksum_signature.s` `0x4AC8..0x5FC0`.
- State/slot, resource-handle, transform-record, command/resource-node, and
  resource-node context/recursive helpers through
  `boot_byte_fill_aligned_leaf.s` `0x5FC0..0xA510`.
- Current remainder: `code_0000A510_00011000.s`.

Static dossiers live under `docs/dossiers/` and are the durable evidence notes
for each promoted source-layout split.

## 2026-06-21 - Boot Resource Node Overlay Context Materialize Split

Baseline before the split:

- `git status --short` was clean at commit
  `55f7890 Split Rev 0 boot resource node LZSS context materialize`.
- `node tools\verify_setup.js` passed with 825 archives, zero unknown bytes, 108
  visible overlap bytes, 90 tracked source files, 99 generated fallback chunks,
  and unchanged code/ROM hashes.
- Active `docs/DECOMP_LOG.md` had grown close to the compaction threshold, so
  the previous full version was archived at
  `docs/archive/DECOMP_LOG-full-through-boot-resource-node-lzss-context-materialize-2026-06-21.md`
  before this compact current-state file was written.

Promoted
`asm/original/rev0/boot/boot_resource_node_overlay_context_materialize.s`
covering ROM `0x00009FD8..0x0000A0B4` / RAM
`0x80079BD8..0x80079CB4`. The old
`asm/original/rev0/code_00009FD8_00011000.s` remainder was removed and replaced
by `asm/original/rev0/code_0000A0B4_00011000.s`.

Static evidence from parent function/symbol/callgraph/xref data, parent
`docs/mips-decode.md`, `docs/overlay-system.md`, and local source:

- `0x9FD8` is a 220-byte prologue helper with frame size `0x18`, fixed in all
  seven named states and all 21 snapshots.
- Parent symbols label it `dma/resource::resource loader`.
- Parent v2 data reports callees to node helper RAM `0x80079CB4`, `0x2DEF4` /
  RAM `0x8009DAF4`, `resource_alloc` `0x1330`, `0x2DFB8` / RAM
  `0x8009DBB8`, resolved overlay target `0x000F84AC` / RAM `0x801AB74C`, and
  unresolved RAM helper `0x801AB720`.
- Parent xrefs show `0x9FD8` reads shared context field base `0x800AF0C4` and
  writes `0x800C4BC0`.
- The node-helper callee is represented cautiously because parent v2 maps RAM
  `0x80079CB4` to the earlier same-state signature candidate at `0x9CAC`,
  while local source keeps the actual next helper at `0xA0B4`.

Static shape:

- Accepts a node-like pointer in `a0`.
- Calls RAM `0x80079CB4` with `[node+0x0C]` and index `0`, storing the returned
  node back to `[node+0x0C]`.
- If `[node+0x04]` is empty, calls the DMA/cache helper, stores the returned
  size/result to `[node+0x08]`, allocates a payload buffer, stores it to
  `[node+0x04]`, and calls the copy/load helper.
- If `[node+0x04]` is already populated, calls unresolved RAM helper
  `0x801AB720(payload)` and stores the returned value as context field `+0x08`.
- Allocates a destination, stores it to context field `+0x04`, calls overlay
  target `0x801AB74C(dest, [node+0x04])`, sets context status `+0x0C = 3`, and
  mirrors context field `+0x08` to global `0x800C4BC0`.
- The split includes the `0xA0AC` return and `0xA0B0` delay-slot stack restore;
  the next recursive node helper starts at `0xA0B4`.

Verification for the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- Full `node tools\verify_setup.js` passed after the split and doc updates.
- Source mix is now 1 tracked composite real-asm chunk made from 91 tracked
  source files, plus 99 generated fallback chunks.
- Static dossier:
  `docs/dossiers/boot-resource-node-overlay-context-materialize.md`.

## 2026-06-21 - Boot Resource Node Recursive Insert/Slot Search Split

Baseline before the split:

- `git status --short` was clean at commit
  `e2f84ba Split Rev 0 boot resource node overlay context materialize`.
- `node tools\verify_setup.js` passed with 825 archives, zero unknown bytes, 108
  visible overlap bytes, 91 tracked source files, 99 generated fallback chunks,
  and unchanged code/ROM hashes.

Promoted
`asm/original/rev0/boot/boot_resource_node_recursive_insert_slot_search.s`
covering ROM `0x0000A0B4..0x0000A198` / RAM
`0x80079CB4..0x80079D98`. The old
`asm/original/rev0/code_0000A0B4_00011000.s` remainder was removed and replaced
by `asm/original/rev0/code_0000A198_00011000.s`.

Static evidence from parent function/symbol/callgraph/xref data and local
source:

- `0xA0B4` is a 228-byte recursive prologue helper with frame size `0x20`,
  fixed in all seven named states and all 21 snapshots.
- Parent function data records a secondary entry at ROM `0xA160` / RAM
  `0x80079D60`.
- Parent old callees are two recursive calls and one call to
  `resource_alloc_mode1_wrapper` `0x1688` / RAM `0x80071288`.
- Parent v2 resolves RAM `0x80079CB4` to the earlier `0x9CAC` same-state
  candidate; keep this as an aliasing caveat while local source owns the actual
  `0xA0B4` body.
- Parent xrefs show `0xA0B4` is the only writer of shared context base
  `0x800AF0C4`.

Static shape:

- The primary entry accepts a node/root pointer in `a0` and key/source value in
  `a1`.
- It returns matching nodes by comparing field `+0x00`, recurses through child
  fields `+0x10/+0x14`, and allocates/clears a `0x18`-byte node when the input
  node is null.
- Both matching and newly allocated nodes are stored to `0x800AF0C4`.
- The secondary `0xA160` entry walks a pointer-to-node slot and returns the slot
  pointer where the key is found or should be inserted, advancing through
  `node+0x18` or `node+0x14`.
- The split includes the primary return at `0xA158..0xA15C` and the secondary
  return at `0xA190..0xA194`; the next helper starts at `0xA198`.

Verification for the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- Full `node tools\verify_setup.js` passed after the split and doc updates.
- Source mix is now 1 tracked composite real-asm chunk made from 92 tracked
  source files, plus 99 generated fallback chunks.
- Static dossier:
  `docs/dossiers/boot-resource-node-recursive-insert-slot-search.md`.

## 2026-06-21 - Boot Resource Node Recursive Cleanup/Free Split

Baseline before the split:

- `git status --short` was clean at commit
  `c0638be Split Rev 0 boot resource node recursive slot search`.
- `node tools\verify_setup.js` passed with 825 archives, zero unknown bytes, 108
  visible overlap bytes, 92 tracked source files, 99 generated fallback chunks,
  and unchanged code/ROM hashes.

Promoted
`asm/original/rev0/boot/boot_resource_node_recursive_cleanup_free.s`
covering ROM `0x0000A198..0x0000A1F8` / RAM
`0x80079D98..0x80079DF8`. The old
`asm/original/rev0/code_0000A198_00011000.s` remainder was removed and replaced
by `asm/original/rev0/code_0000A1F8_00011000.s`.

Static evidence from parent function/symbol/callgraph data and local source:

- `0xA198` is a 96-byte recursive prologue helper with frame size `0x18`, fixed
  in all seven named states and all 21 snapshots.
- Parent callers are `0x9A18`, `0x9A28`, and self-recursion.
- Parent callees are three self-recursive calls, one call to `0xA29C` / RAM
  `0x80079E9C`, and two calls to `resource_free` `0x16C4` / RAM
  `0x800712C4`.
- Local source recurses through fields `+0x10`, `+0x14`, and `+0x18`, calls
  `0xA29C` on field `+0x0C`, frees field `+0x04`, frees the node, and returns
  zero on the cleanup path.
- The split includes the return at `0xA1F0` and delay-slot stack restore at
  `0xA1F4`; the next helper starts cleanly at `0xA1F8`.

Verification for the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- Full `node tools\verify_setup.js` passed after the split and doc updates.
- Source mix is now 1 tracked composite real-asm chunk made from 93 tracked
  source files, plus 99 generated fallback chunks.
- Static dossier:
  `docs/dossiers/boot-resource-node-recursive-cleanup-free.md`.

## 2026-06-21 - Boot Resource Node Recursive Payload Clear Split

Baseline before the split:

- `git status --short` was clean at commit
  `fdf00df Split Rev 0 boot resource node recursive cleanup free`.
- `node tools\verify_setup.js` passed with 825 archives, zero unknown bytes, 108
  visible overlap bytes, 93 tracked source files, 99 generated fallback chunks,
  and unchanged code/ROM hashes.

Promoted
`asm/original/rev0/boot/boot_resource_node_recursive_payload_clear.s`
covering ROM `0x0000A1F8..0x0000A250` / RAM
`0x80079DF8..0x80079E50`. The old
`asm/original/rev0/code_0000A1F8_00011000.s` remainder was removed and replaced
by `asm/original/rev0/code_0000A250_00011000.s`.

Static evidence from parent function/symbol/callgraph data and local source:

- `0xA1F8` is an 88-byte recursive prologue helper with frame size `0x18`,
  fixed in all seven named states and all 21 snapshots.
- Parent callers are `0x9A18`, `0x9A28`, and self-recursion.
- Parent callees are three self-recursive calls and one call to `resource_free`
  `0x16C4` / RAM `0x800712C4`.
- Local source recurses through fields `+0x10`, `+0x14`, and `+0x18`, checks
  field `+0x0C`, and when that field is nonzero frees field `+0x04` and clears
  `+0x04`.
- The split includes the return at `0xA248` and delay-slot stack restore at
  `0xA24C`; the next helper starts cleanly at `0xA250`.

Verification for the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- Full `node tools\verify_setup.js` passed after the split and doc updates.
- Source mix is now 1 tracked composite real-asm chunk made from 94 tracked
  source files, plus 99 generated fallback chunks.
- Static dossier:
  `docs/dossiers/boot-resource-node-recursive-payload-clear.md`.

## 2026-06-21 - Boot Resource Node Recursive Field +0x0C Rewrite Split

Baseline before the split:

- `git status --short` was clean at commit
  `2b8f292 Split Rev 0 boot resource node recursive payload clear`.
- `node tools\verify_setup.js` passed with 825 archives, zero unknown bytes, 108
  visible overlap bytes, 94 tracked source files, 99 generated fallback chunks,
  and unchanged code/ROM hashes.

Promoted
`asm/original/rev0/boot/boot_resource_node_recursive_field0c_rewrite.s`
covering ROM `0x0000A250..0x0000A29C` / RAM
`0x80079E50..0x80079E9C`. The old
`asm/original/rev0/code_0000A250_00011000.s` remainder was removed and replaced
by `asm/original/rev0/code_0000A29C_00011000.s`.

Static evidence from parent function/symbol/callgraph data and local source:

- `0xA250` is a 76-byte recursive prologue helper with frame size `0x18`, fixed
  in all seven named states and all 21 snapshots.
- Parent callers are `0x9A18`, `0x9A28`, and self-recursion.
- Parent callees are three self-recursive calls and one call to `0xA29C` / RAM
  `0x80079E9C`.
- Local source recurses through fields `+0x10`, `+0x14`, and `+0x18`, calls
  `0xA29C` on field `+0x0C`, and stores the returned value back to `+0x0C`.
- The split includes the return at `0xA294` and delay-slot stack restore at
  `0xA298`; the next helper starts cleanly at `0xA29C`.

Verification for the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- Full `node tools\verify_setup.js` passed after the split.
- Source mix is now 1 tracked composite real-asm chunk made from 95 tracked
  source files, plus 99 generated fallback chunks.
- Static dossier:
  `docs/dossiers/boot-resource-node-recursive-field0c-rewrite.md`.

## 2026-06-21 - Boot Resource Node Recursive Child Free Split

Baseline before the split:

- `git status --short` was clean at commit
  `7c3a27c Split Rev 0 boot resource node recursive field0c rewrite`.
- `node tools\verify_setup.js` passed with 825 archives, zero unknown bytes, 108
  visible overlap bytes, 95 tracked source files, 99 generated fallback chunks,
  and unchanged code/ROM hashes.

Promoted
`asm/original/rev0/boot/boot_resource_node_recursive_child_free.s`
covering ROM `0x0000A29C..0x0000A2F4` / RAM
`0x80079E9C..0x80079EF4`. The old
`asm/original/rev0/code_0000A29C_00011000.s` remainder was removed and replaced
by `asm/original/rev0/code_0000A2F4_00011000.s`.

Static evidence from parent function/symbol/callgraph data and local source:

- `0xA29C` is an 88-byte recursive prologue helper with frame size `0x18`, fixed
  in all seven named states and all 21 snapshots.
- Parent callers are `0x9A18`, `0x9A28`, `0xA198`, `0xA250`, and
  self-recursion.
- Parent callees are two self-recursive calls and two calls to `resource_free`
  `0x16C4` / RAM `0x800712C4`.
- Local source recurses through fields `+0x10` and `+0x14`, stores returned
  values into those fields, frees field `+0x04`, frees the node itself, clears
  `s0` to zero, and returns zero.
- The split includes the return at `0xA2EC` and delay-slot stack restore at
  `0xA2F0`; the next helper starts cleanly at `0xA2F4`.

Verification for the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- Full `node tools\verify_setup.js` passed after the split.
- Source mix is now 1 tracked composite real-asm chunk made from 96 tracked
  source files, plus 99 generated fallback chunks.
- Static dossier:
  `docs/dossiers/boot-resource-node-recursive-child-free.md`.

## 2026-06-21 - Boot Resource Node Recursive Key/Field Clear Split

Baseline before the split:

- `git status --short` was clean at commit
  `4b446c2 Split Rev 0 boot resource node recursive child free`.
- `node tools\verify_setup.js` passed with 825 archives, zero unknown bytes, 108
  visible overlap bytes, 96 tracked source files, 99 generated fallback chunks,
  and unchanged code/ROM hashes.

Promoted
`asm/original/rev0/boot/boot_resource_node_recursive_key_field_clear.s`
covering ROM `0x0000A2F4..0x0000A370` / RAM
`0x80079EF4..0x80079F70`. The old
`asm/original/rev0/code_0000A2F4_00011000.s` remainder was removed and replaced
by `asm/original/rev0/code_0000A370_00011000.s`.

Static evidence from parent function/symbol/callgraph data and local source:

- `0xA2F4` is a 116-byte recursive prologue helper with frame size `0x18`,
  fixed in all seven named states and all 21 snapshots.
- Parent callers are `0x9A18`, `0x9A28`, and self-recursion.
- Parent callees are two self-recursive calls and one call to `resource_free`
  `0x16C4` / RAM `0x800712C4`.
- Local source compares incoming `a1` with node field `+0x00`, recursing
  through field `+0x10` when `a1 < key` and field `+0x14` when `key < a1`.
- On equality, local source frees field `+0x04` and clears fields
  `+0x04/+0x08/+0x0C`.
- Parent function data ends at `0xA368`; the split deliberately includes the
  two zero padding words at `0xA368..0xA370` so the next real helper starts at
  `0xA370`.

Verification for the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- Full `node tools\verify_setup.js` passed after the split.
- Source mix is now 1 tracked composite real-asm chunk made from 97 tracked
  source files, plus 99 generated fallback chunks.
- Static dossier:
  `docs/dossiers/boot-resource-node-recursive-key-field-clear.md`.

## 2026-06-21 - Boot Byte Copy/Fill Aligned Leaves Split

Baseline before the split:

- `git status --short` was clean at commit
  `7880114 Split Rev 0 boot resource node recursive key field clear`.
- `node tools\verify_setup.js` passed with 825 archives, zero unknown bytes, 108
  visible overlap bytes, 97 tracked source files, 99 generated fallback chunks,
  and unchanged code/ROM hashes.

Promoted two no-frame utility leaves out of
`asm/original/rev0/code_0000A370_00011000.s`:

- `asm/original/rev0/boot/boot_byte_copy_aligned_leaf.s`, covering ROM
  `0x0000A370..0x0000A470` / RAM `0x80079F70..0x8007A070`.
- `asm/original/rev0/boot/boot_byte_fill_aligned_leaf.s`, covering ROM
  `0x0000A470..0x0000A510` / RAM `0x8007A070..0x8007A110`.

The old `asm/original/rev0/code_0000A370_00011000.s` remainder was removed and
replaced by `asm/original/rev0/code_0000A510_00011000.s`.

Static evidence from parent function/symbol/callgraph data and local source:

- Parent function/symbol data does not list formal starts at `0xA370` or
  `0xA470`.
- Local source shows both helpers are standalone leaves with no stack frame, no
  calls, no external branches, and `jr ra` returns with original `a0` moved to
  `v0` in the delay slot.
- The first helper copies `a2` bytes from `a1` to `a0`, handling unaligned
  leading/trailing byte and halfword cases around a word-copy loop.
- The second helper masks incoming fill byte `a1`, expands it across a word,
  writes leading/trailing alignment fragments, and loops on word stores.
- Parent data marks the next formal function at `0xA510` as
  `seed::lzss_decompress`, a 2,668-byte prologue helper with frame size `0x28`
  and RAM `0x8007A110`.

Verification for the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- Full `node tools\verify_setup.js` passed after the split.
- Source mix is now 1 tracked composite real-asm chunk made from 99 tracked
  source files, plus 99 generated fallback chunks.
- Static dossier:
  `docs/dossiers/boot-byte-copy-fill-aligned-leaves.md`.

## Current Dossier Set

The current boot/source-layout dossier list is long; use `docs/PLATFORM.md` for
the full quick index. The newest dossiers are:

- `docs/dossiers/boot-command-stream-dispatch.md`
- `docs/dossiers/boot-command-stream-resource-node-dispatch.md`
- `docs/dossiers/boot-resource-node-payload-materialize.md`
- `docs/dossiers/boot-resource-node-insert-find.md`
- `docs/dossiers/boot-resource-node-context-materialize.md`
- `docs/dossiers/boot-resource-node-lzss-context-materialize.md`
- `docs/dossiers/boot-resource-node-overlay-context-materialize.md`
- `docs/dossiers/boot-resource-node-recursive-insert-slot-search.md`
- `docs/dossiers/boot-resource-node-recursive-cleanup-free.md`
- `docs/dossiers/boot-resource-node-recursive-payload-clear.md`
- `docs/dossiers/boot-resource-node-recursive-field0c-rewrite.md`
- `docs/dossiers/boot-resource-node-recursive-child-free.md`
- `docs/dossiers/boot-resource-node-recursive-key-field-clear.md`
- `docs/dossiers/boot-byte-copy-fill-aligned-leaves.md`

## Next Frontier

Continue from `asm/original/rev0/code_0000A510_00011000.s`. The next target is
the parent-labeled `seed::lzss_decompress` helper at `0xA510..0xAF7C`, frame
size `0x28`, fixed RAM `0x8007A110`, and a secondary entry at `0xABE0`.
Parent docs `docs/rom-layout.md` and `docs/archive/REPORT.md` already record
the LZSS token format from this function, so the next split should keep the
full parent range together and use those docs as semantic leads while preserving
source-layout naming discipline.
