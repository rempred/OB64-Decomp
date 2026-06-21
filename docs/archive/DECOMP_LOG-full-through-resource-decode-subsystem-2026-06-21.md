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
- The configured code region `0x00001000..0x0063676C` is conservative. Executable
  MIPS only occupies `0x00001000..0x002B89B4`; the trailing 3,661,240 bytes
  (56.24%) have zero `jr $ra` and are non-code data still emitted as `.word`
  `original_mips`. A static control-flow audit found no credible code edge into
  the tail (0 branch targets, 0 J/JAL to a known function). Audit:
  `tools/audit_code_region.js` / `docs/CODE_REGION_AUDIT.md`.
- Current tracked code source mix: one composite real-assembler chunk
  `0x00001000..0x00011000` made from 131 tracked source files, plus 99 generated
  fallback code chunks. Named-function coverage of chunk 0 now runs
  `0x00001000..0x0000F22C`; current remainder `code_0000F22C_00011000.s`.
- The parent boundary DB orphans a 2–4 word read-before-write load preamble onto
  the previous function's tail; true entries precede the labeled `func_` start
  (seen at `0xD248/0xD600/0xECF0/0xF22C`). Always check for this when splitting.
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
  `boot_resource_loader_callback_register.s` `0x5FC0..0xB030`.
- Resource/decode subsystem `0x0000B030..0x0000F22C` (29 named parts:
  `boot_resource_lzss_load_entry` … `boot_resource_huffman_codelengths`; 10 left
  as `func_0000XXXX`). Dossier:
  `docs/dossiers/boot-resource-decode-subsystem-B030-F22C.md`.
- Current remainder: `code_0000F22C_00011000.s`.

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

## 2026-06-21 - Boot LZSS Decompress Split

Baseline before the split:

- `git status --short` was clean at commit
  `845bcaf Split Rev 0 boot byte copy fill leaves`.
- `node tools\verify_setup.js` passed with 825 archives, zero unknown bytes, 108
  visible overlap bytes, 99 tracked source files, 99 generated fallback chunks,
  and unchanged code/ROM hashes.

Promoted `asm/original/rev0/boot/boot_lzss_decompress.s`, covering ROM
`0x0000A510..0x0000AF7C` / RAM `0x8007A110..0x8007AB7C`. The old
`asm/original/rev0/code_0000A510_00011000.s` remainder was removed and replaced
by `asm/original/rev0/code_0000AF7C_00011000.s`.

Static evidence from parent function/symbol data, parent `docs/rom-layout.md`,
parent `docs/overlay-system.md`, and local source:

- Parent labels `0xA510` as `seed::lzss_decompress`, size `0xA6C` / 2,668
  bytes, frame size `0x28`, fixed at RAM `0x8007A110` in all seven named states
  and all 21 snapshots.
- Parent records secondary entry `0xABE0` / RAM `0x8007A7E0`.
- High-confidence callers include the resource-node LZSS context materialize
  helper at `0x9EFC`, resource-loader helper `0xB030`, and many later
  overlay/resource callers.
- Parent `docs/overlay-system.md` confirms the simple boot mapping is valid for
  this permanent decompressor.
- Parent `docs/rom-layout.md` records the LZSS token format from this function.

Static shape:

- The primary entry reads a 4-byte decompressed length from the source header by
  calling the `0xABE0` secondary entry, advances the source pointer by four
  bytes, and decodes until the produced byte count reaches that length.
- Token branches cover short back-references, literal runs, zero-fill runs,
  extended and super back-references, `0xFF` fill, `0x00` fill, and skip/NOP
  opcodes matching parent `docs/rom-layout.md`.
- Local source also contains helper-like internal regions after the main
  epilogue at `0xAB28..0xABDC`, including a final helper-like return at
  `0xAF74..0xAF78`. Because parent function data sizes `0xA510` through
  `0xAF7C`, keep the full range together until a finer boundary has stronger
  evidence.
- The next formal prologue starts cleanly at `0xAF7C`.

Verification for the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- Full `node tools\verify_setup.js` passed after the split and doc updates.
- Source mix is now 1 tracked composite real-asm chunk made from 100 tracked
  source files, plus 99 generated fallback chunks.
- Static dossier:
  `docs/dossiers/boot-lzss-decompress.md`.

## 2026-06-21 - Boot Resource Record Mark-Ready Split

Baseline before the split:

- `git status --short` was clean at commit
  `644d772 Split Rev 0 boot LZSS decompress`.
- `node tools\verify_setup.js` passed with 825 archives, zero unknown bytes, 108
  visible overlap bytes, 100 tracked source files, 99 generated fallback chunks,
  and unchanged code/ROM hashes.

Promoted
`asm/original/rev0/boot/boot_resource_record_mark_ready.s`, covering ROM
`0x0000AF7C..0x0000AFAC` / RAM `0x8007AB7C..0x8007ABAC`. The old
`asm/original/rev0/code_0000AF7C_00011000.s` remainder was removed and replaced
by `asm/original/rev0/code_0000AFAC_00011000.s`.

Static evidence from parent function/symbol/callgraph data, parent
`docs/overlay-system.md`, and local source:

- `0xAF7C` is a 48-byte prologue helper with frame size `0x18`, fixed in all
  seven named states and all 21 snapshots.
- Parent data has no v2 callers for this helper.
- Parent v2 callgraph records one high-confidence JAL to RAM `0x80093810`;
  parent v2 resolves that to target ROM `0x000239A0` with two overlay
  candidates, so keep the callee identity cautious until that helper is split.
- The adjacent `0xAFAC` helper also uses global `0x800AF320`, and `0xB030` is a
  parent-labeled resource-loader/LZSS caller.

Static shape:

- Accepts a record pointer in `a0`, moves it to `a1`, loads
  `a0 = 0x800AF320`, and sets `a2 = 1`.
- Stores byte `1` to `[record+0x08]` in the JAL delay slot.
- Calls the shared RAM helper at `0x80093810` with
  `(0x800AF320, record, 1)`, then returns.
- The `mark-ready` name is a conservative source-layout label for the observed
  flag write, not verified queue semantics.

Verification for the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- Full `node tools\verify_setup.js` passed after the split.
- Source mix is now 1 tracked composite real-asm chunk made from 101 tracked
  source files, plus 99 generated fallback chunks.
- Static dossier:
  `docs/dossiers/boot-resource-record-mark-ready.md`.

## 2026-06-21 - Boot Resource Loader Callback Register Split

Baseline before the split:

- `git status --short` was clean at commit
  `d721603 Split Rev 0 boot resource record mark helper`.
- `node tools\verify_setup.js` passed with 825 archives, zero unknown bytes, 108
  visible overlap bytes, 101 tracked source files, 99 generated fallback chunks,
  and unchanged code/ROM hashes.

Promoted
`asm/original/rev0/boot/boot_resource_loader_callback_register.s`, covering ROM
`0x0000AFAC..0x0000B030` / RAM `0x8007ABAC..0x8007AC30`. The old
`asm/original/rev0/code_0000AFAC_00011000.s` remainder was removed and replaced
by `asm/original/rev0/code_0000B030_00011000.s`.

Static evidence from parent function/callgraph data, parent
`docs/overlay-system.md`, and local source:

- `0xAFAC` is a 132-byte prologue helper with frame size `0x28`, fixed at RAM
  `0x8007ABAC` in all seven named states and all 21 snapshots.
- Parent data has no v2 callers for this helper.
- High-confidence JAL targets are RAM `0x80093570`, `0x80094860`, and
  `0x80094A20`.
- The adjacent `0xB030` helper is parent-labeled as a resource-loader/LZSS
  caller and is passed as the callback-like function pointer loaded into `a2`
  before the `0x80094860` call.

Static shape:

- Calls `0x80093570(0x800AF320, 0x800AF300, 8)`.
- Loads global/context pointer `0x800AF0D0` into `s0`.
- Calls `0x80094860(0x800AF0D0, incoming_a0, 0x8007AC30, 0, 0x800AF300,
  incoming_a1)` with the last two values passed on the stack.
- Calls `0x80094A20(0x800AF0D0)`, then returns.
- The `callback_register` name is a conservative source-layout label for the
  observed registration shape, not verified task/list API semantics.

Verification for the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- Full `node tools\verify_setup.js` passed after the split.
- Source mix is now 1 tracked composite real-asm chunk made from 102 tracked
  source files, plus 99 generated fallback chunks.
- Static dossier:
  `docs/dossiers/boot-resource-loader-callback-register.md`.

## 2026-06-21 - Code-Region Extent Audit (Full-ROM Coverage Phase)

Baseline before the step:

- `git status --short` was clean at commit
  `9652795 Split Rev 0 boot resource loader callback register`.
- `node tools\verify_setup.js` passed with 825 archives, zero unknown bytes, 108
  visible overlap bytes, 102 tracked source files, 99 generated fallback chunks,
  code SHA256 `40D4E787...B409`, ROM SHA256 `571E8339...CC67A`.

Opened the full-ROM coverage phase by auditing whether the configured code
region is actually all code. Added read-only tool `tools/audit_code_region.js`
and tracked doc `docs/CODE_REGION_AUDIT.md`. The tool writes only gitignored
reports (`build/coverage/rev0-code-region-audit.json/.md`) and does not touch the
rebuild path, so the exact-rebuild/`verify_setup` gate is unchanged.

Finding (evidence, not yet reclassified):

- Executable extent `0x00001000..0x002B89B4` (2,849,204 bytes): 96.75% opcode
  words, 5,065 `jr $ra` (1.82/KB), all 13 parent overlay anchors inside it;
  545,844 bytes (19.16%) interleaved gap/rodata between detected functions.
- Suspected non-code tail `0x002B89B4..0x0063676C` (3,661,240 bytes, 56.24% of
  the configured region): ZERO `jr $ra` across 915,310 words, ~52-64% opcode-word
  density, ~35% ASCII density, near-zero RAM-pointer density. Conclusion:
  non-code data currently emitted as `.word` `original_mips`.
- Last valid parent-detected function ends at `0x002B89B4`; no valid function
  starts beyond it. The parent DB's max `end_rom` `0x00598A9C` is one
  `valid:false` false positive inside the tail and is excluded.

Method: union of valid parent function `[start_rom,end_rom)` intervals plus
per-256 KiB intrinsic scan (`jr $ra`, opcode, pointer, zero, ASCII density);
conservative verdicts (`code-evidenced` / `data-evidenced` / `unproven`).

Verification for the step:

- `node tools\audit_code_region.js` runs clean and reports the extent/tail above.
- `node tools\verify_setup.js` still PASS after adding the tool and docs; code and
  ROM SHA256 unchanged.

Next: refine the exact code/data boundary near `0x002B89B4`, then reclassify the
tail from code to a data source form (config/segments + ledger + full-ROM source
manifest) while keeping the byte-exact gate green; later wire the audit into a
coverage gate.

## 2026-06-21 - Code-Region Audit Review Follow-up

Addressed the review of the code-region extent audit (no rebuild-breaking issue
found; tool + docs accepted). Changes, all in `tools/audit_code_region.js` + docs,
no rebuild-path or config change:

- Added a static control-flow edge audit. It scans every instruction word in the
  valid detected functions of the executable extent and reports direct
  branch/J/JAL targets landing in the tail `0x002B89B4..0x0063676C`. Result:
  **0 PC-relative branch targets** (overlay-immune, authoritative) and
  **0 J/JAL targets resolving to a known function**. The 7 raw J/JAL-into-tail
  hits all originate from function `0x001A42A4` and target non-functions
  (`targetKnownFn=false`) in the zero-`jr $ra` tail; they are a data ramp table
  embedded in that function (`0F0F0F0F`, `0C0D0E0F`, … near `0x1A4560`) decoding
  as `jal`. Verdict `no-credible-code-edge-into-tail`. Credibility is gated on the
  target resolving to a known function start (overlay-robust); "code-like source"
  alone is insufficient because real functions can embed data tables.
- Hardened missing-input behavior for gate readiness: parent JSON is required by
  default (missing or corrupt = hard error); `--allow-missing-parent-db`
  downgrades a *missing* file to intrinsic-only mode (corrupt always fails loud).
  Replaces the old silent `loadOptionalJson`.
- Surfaced returnless (no `jr $ra`) detected "functions" as data mis-detected as
  functions, and added per-hit `targetKnownFn` to the report.
- Mirrored the durable finding into parent `docs/rom-layout.md` (review item 4).
- A typo (template literal closed with `'` instead of a backtick) was caught and
  fixed during testing; `node --check` and a `${}`-aware lexer now pass.

Verification: `node tools/audit_code_region.js` runs clean (verdict above);
`node tools/verify_setup.js` PASS with code/ROM SHA256 unchanged;
`git diff --check` clean. Reclassification still gated on pinning the exact
boundary — not done.

## 2026-06-21 - Resource/Decode Subsystem Split (0xB030..0xF22C)

Substantial split/naming tranche on the boot function-split track.

- Range investigated: ROM `0x0000B030..0x0000F22C` (~0x41FC bytes, 29 functions).
- Previous frontier `0x0000B030`; new frontier `0x0000F22C` (new remainder
  `asm/original/rev0/code_0000F22C_00011000.s`). Chunk-0 named coverage is now
  `0x00001000..0x0000F22C`; tracked source files 102 -> 131.
- Method: built reusable `tools/dump_function_context.js`; ran it over the range;
  ran a 6-cluster analysis swarm + adversarial review; maintainer re-verified all
  hazards (jump tables, callback, dual-entry) and all boundary corrections from
  the disassembly. Full per-function provenance:
  `docs/dossiers/boot-resource-decode-subsystem-B030-F22C.md`.

Subsystem: a permanent (all-7-states) tagged resource-archive loader + custom
decompressor. Front end `0xB030..0xBE98` (archive open + pool bracket + 85-way
tag-record decode + resolve/load), decode/verify core `0xBE98..0xC310`
(9-way dispatch + buffered copy/CRC16 + pluggable codec driver), and a
Huffman/DEFLATE + adaptive-Huffman codec `0xC778..0xF22C`. Shared state block
`0x800AF360..0x800AF4xx`; record/node block `0x800B0000+`.

Confirmed function boundaries (29): every parent boundary in the range was
validated against prologue/epilogue/delay-slot/`jr $ra`. Boundaries are listed in
the dossier table; all 29 split files rebuild byte-exactly.

Boundary corrections (recurring "preamble-orphan" idiom — the detector orphans a
2–4 word read-before-write load preamble onto the previous function's tail):
- `func_0000D248` true start `0xD248` (parent `0xD250`): `0xD248/0xD24C` load
  `0x800AF3C6`, consumed by `bne $v0` @`0xD254` before any write.
- `func_0000D600` true start `0xD600` (parent `0xD610`): `0xD600..0xD60C` load
  `0x800AF3C2/0x800AF410`, consumed @`0xD61C/0xD624`.
- `boot_decode_huffman_codelengths` true start `0xECF0` (parent `0xECF8`):
  `0xECF0/0xECF4` load `0x800AF3C6`, consumed @`0xED08`.
- `func_0000CEB8` extended to end `0xD248` (absorbs its `jr` delay slot `0xD244`).
- Next frontier corrected `0xF23C` -> `0xF22C` (same idiom); remainder starts there.
- Spurious parent secondary entries rejected (not split): `0xBBB8` (mid-loop in
  `0xB3E4`), `0xDC48` (mid-instruction in `boot_decode_huffman_tree_init`).
- Genuine multi-entry functions kept as one file: `0xE1F0`->`0xE204` dual entry;
  `0xDCA8`+`0xDFF4`; plus secondaries `0xBF48`, `0xC604/0xC65C/0xC444`,
  `0xC838/0xC938`, `0xCF8C/0xD00C`.

New/revised names: 19 descriptive (`boot_resource_*` loader, `boot_decode_*`
codec) + 10 conservative `func_0000XXXX` (role-noted). High confidence:
`boot_resource_pool_acquire_release` (`0xB33C`, alloc/free bracket — verified).
Medium (hard structural anchor): `boot_resource_lzss_load_entry` (lzss call),
`boot_resource_archive_load_many/one` (archive open+loop),
`boot_resource_tag_record_decode` (85-way jump table @`0x800AE128`),
`boot_resource_op_dispatch` (9-way jump table @`0x800AE2E8`),
`boot_decode_driver` (3 jalr codec callbacks @`0x800AF3B4`, CRC16 poly `0xA001`),
`boot_decode_build_huffman_table` (histogram+firstcode). The adaptive-Huffman
codec names (`boot_decode_huffman_*`) are **hypothesis** (constants 286/285/628,
`0x8000` renorm, bit-reader idiom — not symbol-proven). Address-only `func_*` for
the three `0x80093540` log wrappers and the uncertain codec internals.

Callgraph: dispatchers `0xB3E4`/`0xBE98`/`0xC310`; high-fanin shared workers
`func_0000BFC0` (4), `boot_decode_build_huffman_table` (5), the bit-reader
secondaries `0xC65C` (`jal 0x8007C25C`) / `0xC838` (`jal 0x8007C438`), and the
`0xDCA8`/`0xDFF4` tree-update pair. The tranche is entered almost entirely via
`boot_resource_archive_load_many` (20 callers incl. `0x9D50` and many
`0x1Cxxxx..0x23xxxx` sites). Codec internals have in-range jal in-degree 0
because they are reached via the codec vtable `0x800AF3B4` or as pointer entries
(so the static "leaf degree 0/0" label is unreliable here).

Key constants/globals informing interpretation: jump tables RAM `0x800AE128`
(85) / `0x800AE2E8` (9) (runtime DATA, NOT embedded — unverified targets);
CRC-16/MODBUS poly `0xA001`; DEFLATE `0x11E`=286 / `0x11D`=285; adaptive-Huffman
`0x274`=628 node arrays + `0x8000` renorm; record magic `0x81B6`; tag bytes
`0x55/0x4D/0x48/0x4B/0x58/0x6D`; descriptor lists `0x800BF320` (lzss) /
`0x800BE0A8` (archive) / `0x800B884C` (pool) / `0x800B8750` (dir table).

False leads / softened: parent secondaries `0xBBB8`/`0xDC48` rejected; the
`report2/3/2b` names dropped to `func_*` (helper `0x80093540` identity
unconfirmed); `decode_char`/`decode_with_prefetch` dropped to `func_*`
(mechanism unproven). Static callgraph degree mislabels "leaf" functions that
call bit-reader secondary entries.

Tool change: added `tools/dump_function_context.js` (read-only join of parent
boundaries + symbols_v2 callgraph + accessed globals + flags → gitignored
`build/context/` report; required-parent-DB by default with
`--allow-missing-parent-db`).

Verification: `node tools/dump_function_context.js --start 0xB030 --end 0xF23C`
OK; `node tools/split_original_mips_part.js` produced 29 named parts + remainder;
`node tools/verify_setup.js` PASS — code SHA256 `40D4E787...B409` and ROM SHA256
`571E8339...CC67A` unchanged (byte-exact); `git diff --check` clean.

Next recommended target: split from `code_0000F22C_00011000.s` starting at the
corrected entry `0x0000F22C` (a canonical-Huffman read/decode worker), then
continue the codec and the low-level stream I/O (`func_0000F970` fread-like,
`F9D8` fwrite-like, referenced from this tranche). Expect the preamble-orphan
boundary idiom on every function. A high-value side quest: decode the runtime
dispatch tables `0x800AE128`/`0x800AE2E8` (registered elsewhere) to map opcodes
to handlers and upgrade the `func_*`/hypothesis names.

## Current Dossier Set

The current boot/source-layout dossier list is long; use `docs/PLATFORM.md` for
the full quick index. The newest dossiers are:

- `docs/dossiers/boot-resource-decode-subsystem-B030-F22C.md` (29-function tranche)
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
- `docs/dossiers/boot-lzss-decompress.md`
- `docs/dossiers/boot-resource-record-mark-ready.md`
- `docs/dossiers/boot-resource-loader-callback-register.md`

## Next Frontier

Continue from `asm/original/rev0/code_0000F22C_00011000.s`. The next function's
TRUE entry is `0x0000F22C` (parent labels it `0xF23C`; the 4 preamble words
`0xF22C..0xF238` load `0x800AF3C2`/`0x800AF410`, consumed read-before-write at
`0xF248/0xF250`). It is another canonical-Huffman read/decode worker in the same
codec (end-of-block symbol `0x11D`=285; calls bit-reader `0xC65C`). Past it the
label list continues into the low-level stream I/O this tranche calls out to
(`func_0000F970` fread-like, `F9D8` fwrite-like) plus remaining codec workers.
Expect the preamble-orphan boundary idiom (true entry precedes the labeled
`func_` start) on essentially every function in this region. Use
`tools/dump_function_context.js --start 0xF22C --end <next>` to seed the next
pass, and resolve `jal 0x8007C25C`->`0xC65C` / `jal 0x8007C438`->`0xC838` /
`jal 0x8007BC24`->`0xC024` to their real/secondary entries rather than trusting
static call degree. Subsystem context + globals:
`docs/dossiers/boot-resource-decode-subsystem-B030-F22C.md`.

There are now two active tracks. The boot function-split track continues at
`0xF22C` as above. The full-ROM coverage track (opened 2026-06-21) next refines
the exact code/data boundary near `0x002B89B4` and reclassifies the non-code tail
`0x002B89B4..0x0063676C` from `original_mips` to a data source form, shrinking the
configured code region to the executable extent while keeping the exact rebuild
gate green. See `docs/CODE_REGION_AUDIT.md` and `docs/NEXT_STEPS.md`.
