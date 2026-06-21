# OB64 Decomp Log

This is the compact current-state decomp memory. Full historical logs are
archived under `docs/archive/`; the newest full archive before this compaction
is `docs/archive/DECOMP_LOG-full-through-boot-state-slot-callback-dispatch-2026-06-21.md`.

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
  `0x00001000..0x00011000` made from 62 tracked source files, plus 99 generated
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
- `boot_resource_buffer_reset_flags.s` `0x368C..0x3798`.
- `boot_resource_state_reset.s` `0x3798..0x37F8`.
- Resource/display-list update and display-list emit/finalize/sync helpers
  through `boot_display_list_sync_modes.s` `0x37F8..0x4048`.
- Display-list counter helpers through `boot_display_list_counter_packet_emit.s`
  `0x4048..0x42D8`.
- `boot_resource_window_cache_update.s` `0x42D8..0x43D4`.
- Bitstream descriptor/cursor helpers through
  `boot_bitstream_descriptor_encode.s` `0x43D4..0x4AC8`.
- Resource probe helpers through
  `boot_resource_probe_record_checksum_signature.s` `0x4AC8..0x5FC0`.
- State/slot helpers through `boot_state_slot_render_callback_walk.s`
  `0x5FC0..0x71C8`.
- Current remainder: `code_000071C8_00011000.s`.

Static dossiers live under `docs/dossiers/` and are the durable evidence notes
for each promoted source-layout split.

## 2026-06-21 - Boot State Slot Render Callback Walk Split

Baseline before the split:

- `git status --short` was clean at commit
  `3a78ffd Split Rev 0 boot state slot callback dispatch helper`.
- `node tools\verify_setup.js` passed with 825 archives, zero unknown bytes, 108
  visible overlap bytes, 61 tracked source files, 99 generated fallback chunks,
  and unchanged code/ROM hashes.
- The running decomp log had grown beyond the intended compact-memory size, so
  the previous full version was archived at
  `docs/archive/DECOMP_LOG-full-through-boot-state-slot-callback-dispatch-2026-06-21.md`
  and this compact current-state file replaced it.

Promoted `asm/original/rev0/boot/boot_state_slot_render_callback_walk.s`
covering ROM `0x00006EE8..0x000071C8` / RAM
`0x80076AE8..0x80076DC8`. The old
`asm/original/rev0/code_00006EE8_00011000.s` remainder was removed and replaced
by `asm/original/rev0/code_000071C8_00011000.s`.

Static evidence from parent `../scripts/ob64_functions.json`,
`../scripts/ob64_symbols_v2.json`, `../scripts/ob64_callgraph_v2.json`, and
local source inspection:

- `0x6EE8` is a 736-byte valid JAL-target leaf prefix that loads halfword
  `0x800C49D0` and falls into the `0x6EF0` body.
- `0x6EF0` is a 728-byte valid prologue body with frame size `0x38`, epilogue,
  `jalr`, and the same end at `0x71C8`.
- Fixed runtime evidence places the helper at RAM `0x80076AE8/0x80076AF0` in
  all seven named states and all 21 parent snapshots.
- High-confidence caller for `0x6EE8` is `0x27A0`; parent v2 caller evidence
  also reports high-confidence caller `0x102FA8` for the `0x6EF0` body.
- High-confidence callees are `0x23460` / RAM `0x80093060` count 2,
  `0x8564` / RAM `0x80078164`, `0x49C84` / RAM `0x80173D84`,
  `0x49CBC` / RAM `0x80173DBC`, and `0x84D4` / RAM `0x800780D4`.
- Parent callgraph leaves unresolved RAM target `0x800782EC`.
- Local source shows writes to display-list pointer global `0x800E9BA0`, emits
  `DE00` and `E700` packet words, writes active slot `0x800C4C20`, reads queue
  count/list globals `0x800C49D0` and `0x800C4C10`, copies 0xA8-byte slot
  records rooted at `0x800F82C8`, and uses working record `0x800E7A30`.

Static shape:

- Starts from `0x800C49D0 - 1` and walks the queued slot list at
  `0x800C4C10` backwards.
- For each selected slot, computes the 0xA8-byte record address under
  `0x800F82C8`, stores the current slot to `0x800C4C20`, and skips records
  lacking the expected flag/pointer state.
- Copies the selected record to working record `0x800E7A30`, calls helper
  `0x80078164`, then emits display-list `DE00` packets around helper calls
  `0x80173D84` and `0x80173DBC` when the working flags allow them.
- Calls the working-record callback pointer at `0x800E7A48` / local
  `s3 + 0x18` through `jalr`, then emits an `E700` sync packet.
- When record flags allow, calls unresolved helper `0x800782EC` with four
  halfword-like fields from the working record.
- Calls helper `0x800780D4`, restores the working record back to the source
  slot through `0x80093060`, decrements the reverse index, and loops.
- On exit, stores `0x800C4C20 = -1` and returns.

Verification for the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- Full `node tools\verify_setup.js` passed after docs were updated.
- Source mix is now 1 tracked composite real-asm chunk made from 62 tracked
  source files, plus 99 generated fallback chunks.
- Code-region SHA256 remains
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- Full ROM SHA256 remains
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

## Next Frontier

Continue from `asm/original/rev0/code_000071C8_00011000.s`.

Parent/local evidence for the next target:

- `0x71C8` is a 56-byte leaf entry that falls into the `0x71D0` 48-byte
  prologue body with frame size `0x18`, fixed RAM `0x80076DC8/0x80076DD0`,
  and clean end at `0x7200`.
- `0x71C8` has high-confidence caller `0x27A0`.
- High-confidence callees are `0x79EC` / RAM `0x800775EC` and `0x859C` / RAM
  `0x8007819C`; unresolved RAM target is `0x80077BF8`.
- The helper gates on `0x800C49D0`, then calls the three helpers and returns.
- Next parent boundaries after this pair are `0x7200` leaf / `0x7208`
  prologue and `0x722C` leaf / `0x7234` prologue.
