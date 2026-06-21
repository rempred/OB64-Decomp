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
  `0x00001000..0x00011000` made from 84 tracked source files, plus 99 generated
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
- State/slot, resource-handle, and transform-record helpers through
  `boot_display_list_transform_coefficients_sum_clear.s`
  `0x5FC0..0x978C`.
- Current remainder: `code_0000978C_00011000.s`.

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
  records rooted at `0x800E82C8`, and uses working record `0x800E7A30`.

Static shape:

- Starts from `0x800C49D0 - 1` and walks the queued slot list at
  `0x800C4C10` backwards.
- For each selected slot, computes the 0xA8-byte record address under
  `0x800E82C8`, stores the current slot to `0x800C4C20`, and skips records
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

## 2026-06-21 - Boot State Slot Queue Service Gate Split

Baseline before the split:

- `git status --short` was clean at commit
  `d48d0ea Split Rev 0 boot state slot render callback walk`.
- `node tools\verify_setup.js` passed with 825 archives, zero unknown bytes, 108
  visible overlap bytes, 62 tracked source files, 99 generated fallback chunks,
  and unchanged code/ROM hashes.

Promoted `asm/original/rev0/boot/boot_state_slot_queue_service_gate.s` covering
ROM `0x000071C8..0x00007200` / RAM `0x80076DC8..0x80076E00`. The old
`asm/original/rev0/code_000071C8_00011000.s` remainder was removed and replaced
by `asm/original/rev0/code_00007200_00011000.s`.

Static evidence from parent function/symbol/callgraph data and local source
inspection:

- `0x71C8` is a 56-byte leaf entry that reads halfword global `0x800C49D0` and
  falls into the `0x71D0` body.
- `0x71D0` is a 48-byte prologue body with frame size `0x18` and clean end at
  `0x7200`.
- Fixed runtime evidence places the pair at RAM `0x80076DC8/0x80076DD0` in all
  seven named states and all 21 parent snapshots.
- High-confidence caller for `0x71C8` is `0x27A0`.
- High-confidence callees are `0x79EC` / RAM `0x800775EC` and `0x859C` / RAM
  `0x8007819C`; unresolved RAM target is `0x80077BF8`.
- Local source gates on `0x800C49D0 != 0`, then calls `0x800775EC`,
  unresolved `0x80077BF8`, and `0x8007819C`.

Verification for the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- Full `node tools\verify_setup.js` passed after docs were updated.
- Source mix is now 1 tracked composite real-asm chunk made from 63 tracked
  source files, plus 99 generated fallback chunks.
- Code-region SHA256 remains
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- Full ROM SHA256 remains
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

## 2026-06-21 - Boot Resource Global Handle Release Split

Baseline before the split:

- `git status --short` was clean at commit
  `5cfe5ac Split Rev 0 boot state slot queue service gate`.
- `node tools\verify_setup.js` passed with 825 archives, zero unknown bytes, 108
  visible overlap bytes, 63 tracked source files, 99 generated fallback chunks,
  and unchanged code/ROM hashes.

Promoted `asm/original/rev0/boot/boot_resource_global_handle_release.s`
covering ROM `0x00007200..0x0000722C` / RAM
`0x80076E00..0x80076E2C`. The old
`asm/original/rev0/code_00007200_00011000.s` remainder was removed and replaced
by `asm/original/rev0/code_0000722C_00011000.s`.

Static evidence from parent function/symbol/callgraph data, sibling source, and
local source inspection:

- `0x7200` is a 44-byte leaf entry that reads word global `0x800AF0B0` and
  falls into the `0x7208` body.
- `0x7208` is a 36-byte prologue body with frame size `0x18` and clean end at
  `0x722C`.
- Fixed runtime evidence places the pair at RAM `0x80076E00/0x80076E08` in all
  seven named states and all 21 parent snapshots.
- High-confidence callers for `0x7200` are `0x4EBCC` and `0x4EC3C`;
  medium-confidence caller is `0x1CF960`.
- High-confidence callee is `0x49AA0` / RAM `0x80173BA0`.
- Local source calls `0x80173BA0(a0)` with `a0 = [0x800AF0B0]`, clears
  `0x800AF0B0`, and returns.
- The sibling `0x722C` entry calls paired helper `0x80173B60` and stores its
  return value to `0x800AF0B0`, supporting a cautious release/acquire-style
  source-layout pair without proving ownership semantics.

Verification for the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- Full `node tools\verify_setup.js` passed after docs were updated.
- Source mix is now 1 tracked composite real-asm chunk made from 64 tracked
  source files, plus 99 generated fallback chunks.
- Code-region SHA256 remains
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- Full ROM SHA256 remains
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

## 2026-06-21 - Boot Resource Global Handle Slot Record Prepare Split

Baseline before the split:

- `git status --short` was clean at commit
  `e19ecec Split Rev 0 boot resource global handle release`.
- `node tools\verify_setup.js` passed with 825 archives, zero unknown bytes, 108
  visible overlap bytes, 64 tracked source files, 99 generated fallback chunks,
  and unchanged code/ROM hashes.

Promoted
`asm/original/rev0/boot/boot_resource_global_handle_slot_record_prepare.s`
covering ROM `0x0000722C..0x00007560` / RAM
`0x80076E2C..0x80077160`. The old
`asm/original/rev0/code_0000722C_00011000.s` remainder was removed and replaced
by `asm/original/rev0/code_00007560_00011000.s`.

Static evidence from parent function/symbol/callgraph/xref data and local
source inspection:

- `0x722C` is a 44-byte leaf entry that reads word global `0x800AF0B0` and
  falls into the `0x7234` body.
- `0x7234` is an 812-byte prologue helper with frame size `0x18`, fixed RAM
  `0x80076E34` in all seven named states and all 21 parent snapshots, and
  secondary entries at `0x735C` and `0x745C`.
- Parent callgraph reports high-confidence callers `0x4EC10` and `0x4EC3C`
  for `0x722C`, plus medium-confidence caller `0x1CF9C0`.
- High-confidence callee is `0x49A60` / RAM `0x80173B60`.
- The slot-record base used by this helper and the recent slot helpers is
  `0x800E82C8`, not stale `0x800F82C8`; local source uses `lui 0x800F` with
  signed negative displacements such as `-0x7D38`.

Static shape:

- Refreshes global handle `0x800AF0B0` by calling
  `0x80173B60([0x800AF0B0])` and storing the return value back to the global.
- Contains small internal scans for free/occupied slot-record indices across
  six records with stride `0xA8` and flag bit `0x8000` at record `+0x00`.
- The `0x735C` secondary entry searches forward for a free slot and writes a
  record; `0x745C` searches backward from slot 4 and writes a neighboring slot.
- Record writes touch `+0x00`, word `+0x10`, halfwords `+0x06/+0x08/+0x0A/
  +0x0C/+0x0E`, and provenance-like halfwords `+0xA2/+0xA4` from current-slot
  globals `0x800C4C20` and `0x800E810E`.
- The previous active log's "clean end at `0x7558`" wording is corrected:
  `0x7558` is `jr ra`, `0x755C` is the delay-slot store, and the clean
  exclusive end is `0x7560`.

Verification for the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- Full `node tools\verify_setup.js` passed after docs were updated.
- Source mix is now 1 tracked composite real-asm chunk made from 65 tracked
  source files, plus 99 generated fallback chunks.
- Code-region SHA256 remains
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- Full ROM SHA256 remains
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

## 2026-06-21 - Boot State Slot Current Peer Record Flag Mark Split

Baseline before the split:

- `git status --short` was clean at commit
  `1c0fe44 Split Rev 0 boot resource global handle slot record prepare`.
- `node tools\verify_setup.js` passed with 825 archives, zero unknown bytes, 108
  visible overlap bytes, 65 tracked source files, 99 generated fallback chunks,
  and unchanged code/ROM hashes.

Promoted
`asm/original/rev0/boot/boot_state_slot_current_peer_record_flag_mark.s`
covering ROM `0x00007560..0x00007600` / RAM
`0x80077160..0x80077200`. The old
`asm/original/rev0/code_00007560_00011000.s` remainder was removed and replaced
by `asm/original/rev0/code_00007600_00011000.s`.

Static evidence from parent function/symbol/callgraph/xref data and local
source inspection:

- `0x7560` is a two-word leaf prefix that reads active-slot global
  `0x800C4C20` and falls into the `0x7568` body.
- `0x7568` is a 152-byte prologue helper with frame size `0x20`, fixed RAM
  `0x80077168`, no direct v2 callers, and high-confidence callee `0x8388` /
  RAM `0x80077F88`.
- Parent/local xrefs show reads of `0x800C4C20`, slot-record halfword
  `0x800E82C8`, signed record field `0x800E836A`, and read/write access to
  working-record byte `0x800E7A32`.

Static shape:

- Returns immediately when active slot `0x800C4C20` is negative.
- Scans six 0xA8-byte records rooted at corrected signed address `0x800E82C8`.
- Skips the current active slot, requires flag bit `0x8000`, and requires
  record `+0xA2` to equal the active-slot global.
- Calls `0x80077F88(slot)` for each matching peer record.
- Sets bit `0x02` in working-record byte `0x800E7A32` after the scan.

Verification for the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- Full `node tools\verify_setup.js` passed after docs were updated.
- Source mix is now 1 tracked composite real-asm chunk made from 66 tracked
  source files, plus 99 generated fallback chunks.
- Code-region SHA256 remains
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- Full ROM SHA256 remains
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

## 2026-06-21 - Boot State Slot Target Peer Record Dispatch Split

Baseline before the split:

- `git status --short` was clean at commit
  `dad92bd Split Rev 0 boot state slot current peer flag mark`.
- `node tools\verify_setup.js` passed with 825 archives, zero unknown bytes, 108
  visible overlap bytes, 66 tracked source files, 99 generated fallback chunks,
  and unchanged code/ROM hashes.

Promoted
`asm/original/rev0/boot/boot_state_slot_target_peer_record_dispatch.s`
covering ROM `0x00007600..0x00007688` / RAM
`0x80077200..0x80077288`. The old
`asm/original/rev0/code_00007600_00011000.s` remainder was removed and replaced
by `asm/original/rev0/code_00007688_00011000.s`.

Static evidence from parent function/symbol/callgraph/xref data and local
source inspection:

- `0x7600` is a 136-byte prologue helper with frame size `0x20`, fixed RAM
  `0x80077200`, no direct v2 callers, and clean end at `0x7688`.
- High-confidence callee is `0x8388` / RAM `0x80077F88`.
- Parent/local xrefs show reads of slot-record halfword `0x800E82C8` and signed
  record field `0x800E836A`.
- Local source shows the clean epilogue at `0x7670..0x7684`; `0x7688` is the
  next parent prologue boundary.

Static shape:

- Saves incoming target slot `a0` in `s2`.
- Returns immediately when the target slot is negative.
- Scans six 0xA8-byte records rooted at corrected signed address
  `0x800E82C8`.
- Skips the target slot, requires flag bit `0x8000`, and requires record
  `+0xA2` to equal the target slot.
- Calls `0x80077F88(slot)` for each matching peer record.

Verification for the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- Full `node tools\verify_setup.js` passed after docs were updated.
- Source mix is now 1 tracked composite real-asm chunk made from 67 tracked
  source files, plus 99 generated fallback chunks.
- Code-region SHA256 remains
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- Full ROM SHA256 remains
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

## 2026-06-21 - Boot State Slot Flagged Dispatch/Lookup Split

Baseline before the split:

- `git status --short` was clean at commit
  `edb6187 Split Rev 0 boot state slot target peer dispatch`.
- `node tools\verify_setup.js` passed with 825 archives, zero unknown bytes, 108
  visible overlap bytes, 67 tracked source files, 99 generated fallback chunks,
  and unchanged code/ROM hashes.

Promoted
`asm/original/rev0/boot/boot_state_slot_flagged_dispatch_lookup.s` covering ROM
`0x00007688..0x00007768` / RAM `0x80077288..0x80077368`. The old
`asm/original/rev0/code_00007688_00011000.s` remainder was removed and replaced
by `asm/original/rev0/code_00007768_00011000.s`.

Static evidence from parent function/symbol/callgraph/xref data and local
source inspection:

- `0x7688` is a 224-byte prologue helper with frame size `0x20`, fixed RAM
  `0x80077288` in all seven named states and all 21 parent snapshots, and clean
  end at `0x7768`.
- High-confidence caller is `0x69D8`; high-confidence callee is `0x8388` /
  RAM `0x80077F88`.
- Parent v2 leaves call target `0x80077F80` unresolved; local source resolves it
  to the two-instruction `jr ra; nop` secondary tail at ROM `0x8380..0x8388`
  immediately before the `0x8388` helper.
- Parent records secondary entry `0x7714`; local search found no direct local
  source call to that leaf.
- Parent/local xrefs show reads of status halfword `0x800C4C26`, slot-record
  halfword `0x800E82C8`, slot-record byte `0x800E82CB`, and slot-record word
  `0x800E82D8`.

Static shape:

- The primary entry calls the no-op-style `0x80077F80` secondary tail, then
  returns without scanning when status `0x800C4C26 == 0xFFFF`.
- Otherwise it scans six 0xA8-byte records rooted at corrected signed address
  `0x800E82C8`.
- For each record, it requires flag bit `0x8000` and byte field `+0x03 & 0x04`
  before calling `0x80077F88(slot)`.
- The `0x7714` secondary leaf scans the same six records for word field
  `+0x10` matching incoming `a0`, returning the matching slot index or `-1`.

Verification for the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- Full `node tools\verify_setup.js` passed after docs were updated.
- Source mix is now 1 tracked composite real-asm chunk made from 68 tracked
  source files, plus 99 generated fallback chunks.
- Code-region SHA256 remains
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- Full ROM SHA256 remains
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

## 2026-06-21 - Boot State Slot Pool/Table Helpers Split

Baseline before the split:

- `git status --short` was clean at commit
  `b45509d Split Rev 0 boot state slot flagged dispatch lookup`.
- `node tools\verify_setup.js` passed with 825 archives, zero unknown bytes, 108
  visible overlap bytes, 68 tracked source files, 99 generated fallback chunks,
  and unchanged code/ROM hashes.

Promoted
`asm/original/rev0/boot/boot_state_slot_pool_table_helpers.s` covering ROM
`0x00007768..0x000079EC` / RAM `0x80077368..0x800775EC`. The old
`asm/original/rev0/code_00007768_00011000.s` remainder was removed and replaced
by `asm/original/rev0/code_000079EC_00011000.s`.

Static evidence from parent function/symbol/callgraph data and local source
inspection:

- Parent function data reports `0x7768` as a 644-byte prologue helper with
  frame size `0x18`, fixed RAM `0x80077368` in all seven named states and all
  21 parent snapshots.
- Parent records secondary entries at `0x77D4`, `0x789C`, and `0x7924`; local
  source also exposes two clean ten-entry scan leaves starting at `0x780C` and
  `0x785C`, plus the pointer-table install helper entry shape beginning at
  `0x7894`.
- Old linear parent callers are `0x69D8`, `0xEBBC0`, and `0xED530`; v2 has no
  resolved overlay-aware callers for this helper.
- Parent v2 leaves literal call target `0x80093540` unresolved. Local source
  shows this is an interior entry inside the shared diagnostic/assert helper
  whose parent prologue starts at ROM `0x23908` / RAM `0x80093508`.
- Parent `functions.json` reports the boundary awkwardly around `0x79E8`, but
  local source confirms `0x79E8` is the delay-slot store for the `jr ra` at
  `0x79E4`; the clean exclusive end is the next prologue at `0x79EC`.

Static shape:

- The `0x7768` primary entry computes `a0 * 0xA8`, scans ten words beginning at
  computed base `0x800E8300`, returns the first zero index, and calls
  `0x80093540(0x800ADF88)` before parking if none is free.
- The `0x77D4`, `0x780C`, and `0x785C` scan leaves return the first empty index
  or `-1` for ten-entry word pools rooted at `0x800E7A68`,
  `0x800E8328 + a0 * 0xA8`, and `0x800E7A90`.
- The trailing helper compares incoming `a0` against halfword global
  `0x800C4C10`, then installs one of two pointer-table sets into globals around
  `0x800C48xx..0x800C4Cxx`, `0x800E79xx..0x800E7Dxx`, and
  `0x800F81xx..0x800F9Bxx`.

Verification for the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- Full `node tools\verify_setup.js` passed after docs were updated.
- Source mix is now 1 tracked composite real-asm chunk made from 69 tracked
  source files, plus 99 generated fallback chunks.
- Code-region SHA256 remains
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- Full ROM SHA256 remains
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

## 2026-06-21 - Boot State Slot Queue Record Step Split

Baseline before the split:

- `node tools\verify_setup.js` passed with 825 archives, zero unknown bytes, 108
  visible overlap bytes, 69 tracked source files, 99 generated fallback chunks,
  and unchanged code/ROM hashes.

Promoted `asm/original/rev0/boot/boot_state_slot_queue_record_step.s` covering
ROM `0x000079EC..0x00007FF8` / RAM `0x800775EC..0x80077BF8`. The old
`asm/original/rev0/code_000079EC_00011000.s` remainder was removed and replaced
by `asm/original/rev0/code_00007FF8_00011000.s`.

Static evidence from parent `../scripts/ob64_functions.json`,
`../scripts/ob64_symbols_v2.json`, `../scripts/ob64_callgraph_v2.json`, and
local source inspection:

- `0x79EC` is a prologue helper with frame size `0x68`, fixed RAM
  `0x800775EC` in all seven named states and all 21 parent snapshots.
- Parent evidence reports the `0x71C8/0x71D0` queue service gate as a caller.
- Parent data reports secondary entries at `0x7F2C` and `0x7FF8`; local source
  shows `0x7F2C` is an internal branch target, while `0x7FF8` is a separate
  executable prefix called by the queue service gate as RAM `0x80077BF8`.
- The clean helper epilogue is `0x7FEC..0x7FF4`, so the split stops before
  `0x7FF8` instead of folding the prefix into the returned helper.

Static shape:

- Reads queue count `0x800C49D0` and walks queued slot IDs from
  `0x800C4C10`.
- Computes record addresses under corrected 0xA8-byte slot-record base
  `0x800E82C8`.
- Filters for record flag mask `0xE800` and byte `+0x03 & 0x02 == 0`.
- Sets record flag bit `0x0400` on the update path, adjusts two signed
  position-like axes against bounds `0x140` and `0xF0`, writes a packed
  halfword to record `+0x2C`, and clears bits with mask `0xF3FF` when both axes
  complete.

Verification for the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- Full `node tools\verify_setup.js` passed after docs were updated.
- Source mix is now 1 tracked composite real-asm chunk made from 70 tracked
  source files, plus 99 generated fallback chunks.
- Static dossier: `docs/dossiers/boot-state-slot-queue-record-step.md`.

## 2026-06-21 - Boot State Slot Queue F000 Record-Step / No-op Tail Split

Baseline before the split:

- `git status --short` was clean at commit
  `b4417e9 Split Rev 0 boot state slot queue record step`.
- `node tools\verify_setup.js` passed with 825 archives, zero unknown bytes, 108
  visible overlap bytes, 70 tracked source files, 99 generated fallback chunks,
  and unchanged code/ROM hashes.

Promoted `asm/original/rev0/boot/boot_state_slot_queue_f000_record_step.s`
covering ROM `0x00007FF8..0x00008380` / RAM
`0x80077BF8..0x80077F80`, and
`asm/original/rev0/boot/boot_state_slot_noop_return_tail.s` covering ROM
`0x00008380..0x00008388` / RAM `0x80077F80..0x80077F88`. The old
`asm/original/rev0/code_00007FF8_00011000.s` remainder was removed and replaced
by `asm/original/rev0/code_00008388_00011000.s`.

Static evidence from parent `../scripts/ob64_functions.json`,
`../scripts/ob64_symbols_v2.json`, `../scripts/ob64_callgraph_v2.json`, parent
xrefs, and local source inspection:

- ROM `0x7FF8..0x8000` is the executable prefix called by the queue service
  gate at RAM `0x80077BF8`; it loads queue count `0x800C49D0` into `v0` and
  feeds the `0x8000` body.
- `0x8000` is a prologue helper with frame size `0x30`, fixed RAM
  `0x80077C00`, active in all seven named states and all 21 parent snapshots.
- Parent symbol data reports helper size 904, secondary entries at `0x8090`
  and `0x8380`, and high-confidence callee `0x8388`.
- Local source shows `0x8380..0x8388` is exactly `jr ra; nop`, matching the
  flagged dispatch/lookup dossier's previously unresolved RAM target
  `0x80077F80`.

Static shape:

- Reads queue count `0x800C49D0` and walks queued slot IDs from `0x800C4C10`.
- Computes corrected-base records as `0x800E82C8 + slot * 0xA8`.
- Filters for record flag high nibble `0xF000` plus byte `+0x03 & 0x02 == 0`.
- Uses global word `0x800E79A0` as a bound/span-like value.
- Calls `0x8388(slot)` for terminal endpoint cases.
- Otherwise initializes bit `0x0400`, writes temp/fraction fields around
  `+0x28..+0x2E`, and updates signed position-like fields around
  `+0x0A/+0x0C` from fields around `+0x04/+0x06/+0x08`.

Verification for the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- Full `node tools\verify_setup.js` passed after docs were updated.
- Source mix is now 1 tracked composite real-asm chunk made from 72 tracked
  source files, plus 99 generated fallback chunks.
- Static dossier: `docs/dossiers/boot-state-slot-queue-f000-record-step.md`.

## 2026-06-21 - Boot State Slot Record Release / Payload / Queue Rebuild Cluster Split

Baseline before the split:

- `git status --short` was clean at commit
  `dfb9373 Split Rev 0 boot state slot queue F000 step`.
- `node tools\verify_setup.js` passed with 825 archives, zero unknown bytes, 108
  visible overlap bytes, 72 tracked source files, 99 generated fallback chunks,
  and unchanged code/ROM hashes.

Promoted six source parts from
`asm/original/rev0/code_00008388_00011000.s`:

- `boot_state_slot_record_release_recursive.s` `0x00008388..0x000084D4`.
- `boot_state_slot_payload_alloc_copy.s` `0x000084D4..0x00008564`.
- `boot_state_slot_payload_copy_free.s` `0x00008564..0x0000859C`.
- `boot_state_slot_queue_rebuild_priority_order.s`
  `0x0000859C..0x000086EC`.
- `boot_state_slot_render_noop_tail.s` `0x000086EC..0x00008700`.
- `boot_state_record_copy_58_leaf.s` `0x00008700..0x0000874C`.

The old remainder was replaced by
`asm/original/rev0/code_0000874C_00011000.s`; that remainder is now superseded
by the transform-record split below.

Static evidence from parent symbols/callgraph/xrefs and local source:

- `0x8388`, `0x84D4`, `0x8564`, and `0x859C` are permanent all-state helpers in
  all 21 snapshots.
- `0x8388` has high-confidence callers `0x69D8`, `0x7568`, `0x7600`,
  `0x7688`, `0x8000`, and itself; callees are itself, `resource_free`
  (`0x16C4`), and `0x23780`.
- `0x84D4` allocates `length + 6`, stores a small header, and copies payload
  bytes through `0x23460`; `0x8564` copies payload bytes back out and frees the
  buffer.
- `0x859C` clears/rebuilds queue globals `0x800C49D0` and `0x800C4C10` from
  active `0x800E82C8` records using halfword field `+0x0E` / `0x800E82D6`.
- `0x86EC` resolves the render callback walk's previous unresolved target
  `0x800782EC` to a no-op return target plus trailing nop padding.
- `0x8700` is a no-prologue leaf that copies `0x58` bytes from `a1` to `a0`.

Verification for the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- Full `node tools\verify_setup.js` passed after docs were updated.
- Source mix is now 1 tracked composite real-asm chunk made from 78 tracked
  source files, plus 99 generated fallback chunks.
- Static dossier: `docs/dossiers/boot-state-slot-record-release-cluster.md`.

## 2026-06-21 - Boot Display-List Transform Record Emit Split

Baseline before the split:

- `git status --short` was clean at commit
  `53e89f8 Split Rev 0 boot state slot record release cluster`.
- `node tools\verify_setup.js` passed with 825 archives, zero unknown bytes, 108
  visible overlap bytes, 78 tracked source files, 99 generated fallback chunks,
  and unchanged code/ROM hashes.

Promoted `asm/original/rev0/boot/boot_display_list_transform_record_emit.s`
covering ROM `0x0000874C..0x00008A58` / RAM
`0x8007834C..0x80078658`. The old
`asm/original/rev0/code_0000874C_00011000.s` remainder was removed and replaced
by `asm/original/rev0/code_00008A58_00011000.s`; that remainder is now
superseded by the transform-wrapper/clamped-rect split below.

Static evidence from parent symbols/callgraph/xrefs and local source:

- `0x874C` is a two-word JAL-target leaf prefix, fixed in all seven named states
  and all 21 snapshots, that reads global `0x800F9BE0` and falls into the
  `0x8754` body.
- `0x8754` is the shared prologue body with frame size `0x60` and clean return
  at `0x8A48..0x8A54`.
- High-confidence callers for `0x874C` are `0x8A58` and `0xEE8E0`.
- High-confidence callees are `0x228D0` / RAM `0x800924D0`, `0x210C0` / RAM
  `0x80090CC0`, and `0x21DD4` / RAM `0x800919D4`.
- Local source reads/writes display-list pointer global `0x800E9BA0`, reads
  descriptor/base global `0x800F9BE0`, updates `0x800C4BE4` and `0x800C4C48`,
  and writes `0x800E7A0E` plus `0x800C4C24`.

Static shape:

- Incoming `a0` is treated as a `0x58`-byte transform/record-like source.
- The helper copies float/word fields from that source into stack/helper
  arguments, then emits display-list-style packet words including `DB0E`,
  `DA38`, `DC08`, and `E700`.
- The zero-vector path calls `0x80090CC0`; the nonzero transform path calls
  `0x800919D4` and emits the larger packet sequence.

Verification for the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- Full `node tools\verify_setup.js` passed after docs were updated.
- Source mix is now 1 tracked composite real-asm chunk made from 79 tracked
  source files, plus 99 generated fallback chunks.
- Static dossier: `docs/dossiers/boot-display-list-transform-record-emit.md`.

## 2026-06-21 - Boot Display-List Transform Wrapper / Clamped Rect Emit Split

Baseline before the split:

- `git status --short` was clean at commit
  `94efc58 Split Rev 0 boot display-list transform record emit`.
- `node tools\verify_setup.js` passed with 825 archives, zero unknown bytes, 108
  visible overlap bytes, 79 tracked source files, 99 generated fallback chunks,
  and unchanged code/ROM hashes.

Promoted
`asm/original/rev0/boot/boot_display_list_transform_wrapper_clamped_rect_emit.s`
covering ROM `0x00008A58..0x00008D6C` / RAM
`0x80078658..0x8007896C`. The old
`asm/original/rev0/code_00008A58_00011000.s` remainder was removed and replaced
by `asm/original/rev0/code_00008D6C_00011000.s`.

Static evidence from parent function/symbol/callgraph/xref data and local
source:

- `0x8A58` is a valid 788-byte helper fixed in all seven named states and all
  21 snapshots, with frame size `0x18`.
- Parent data records secondary entry `0x8A74`; local source shows the wrapper
  at `0x8A58..0x8A70` returns before that no-stack secondary body.
- The only high-confidence callee is prior helper `0x874C` / RAM `0x8007834C`.
- Parent symbols list older static callers `0xE65FC`, `0xE6D98` count 2,
  `0xEC598`, `0xEE8E0`, `0xF82DC`, `0xFAFAC`, and `0x2825BC`; v2 callgraph
  does not resolve overlay-aware callers for this helper.
- Local source reads/writes display-list pointer global `0x800E9BA0`, reads
  descriptor/base global `0x800E9BE0`, and updates counter-like global
  `0x800C4BE4`.

Static shape:

- The `0x8A58` wrapper saves `ra`, calls `0x8007834C(a0)`, restores `ra`, and
  returns.
- The `0x8A74` secondary entry clamps four coordinate-like arguments to
  `0..0x13F` and `0..0xEF`.
- It writes a 64-byte descriptor record through `0x800E9BE0 + 8`, indexed by
  `0x800C4BE4`, then increments the counter.
- It emits display-list-style `E700`, `DC080008`, and `ED00` packet words
  through `0x800E9BA0`, using a `* 4.0`, truncate, and `0x0FFF` packing path for
  the coordinate fields.

Verification for the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- Full `node tools\verify_setup.js` passed after docs were updated.
- Source mix is now 1 tracked composite real-asm chunk made from 80 tracked
  source files, plus 99 generated fallback chunks.
- Static dossier:
  `docs/dossiers/boot-display-list-transform-wrapper-clamped-rect-emit.md`.

## 2026-06-21 - Boot Display-List Flagged Rect Packet Emit Split

Baseline before the split:

- `git status --short` was clean at commit
  `e28f734 Split Rev 0 boot display-list clamped rect emit`.
- `node tools\verify_setup.js` passed with 825 archives, zero unknown bytes, 108
  visible overlap bytes, 80 tracked source files, 99 generated fallback chunks,
  and unchanged code/ROM hashes.

Promoted
`asm/original/rev0/boot/boot_display_list_flagged_rect_packet_emit.s` covering
ROM `0x00008D6C..0x0000906C` / RAM `0x8007896C..0x80078C6C`. The old
`asm/original/rev0/code_00008D6C_00011000.s` remainder was removed and replaced
by `asm/original/rev0/code_0000906C_00011000.s`; that remainder is now
superseded by the color rect packet split below.

Static evidence from parent function/symbol/callgraph/xref data and local
source:

- `0x8D6C` is a valid 768-byte prologue helper fixed in all seven named states
  and all 21 snapshots, with frame size `0x28`.
- Parent callgraph data reports high-confidence caller `0x16DAEC`.
- The only unresolved v2 target is RAM `0x8007338C`; local earlier source
  identifies it as the `0x378C` secondary entry inside
  `boot_resource_buffer_reset_flags.s`.
- Parent top constants are `320` and `240`.
- Local source reads display-list pointer global `0x800E9BA0`, reads
  `0x800C4B20` and `0x800E8210`, and writes a fixed packet run through offsets
  up to `+0xA4`.

Static shape:

- The helper gates on the `0x378C` flag/read helper and returns without emitting
  packets when that helper returns zero.
- It clamps four coordinate-like arguments to `0..0x13F` and `0..0xEF`.
- It emits display-list-style words through `0x800E9BA0`, including repeated
  `E700` syncs plus `E200001C`, `E3000A01`, `FE00`, `F700`, and `F600` command
  words.

Verification for the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- Full `node tools\verify_setup.js` passed after docs were updated.
- Source mix is now 1 tracked composite real-asm chunk made from 81 tracked
  source files, plus 99 generated fallback chunks.
- Static dossier:
  `docs/dossiers/boot-display-list-flagged-rect-packet-emit.md`.

## 2026-06-21 - Boot Display-List Color Rect Packet Emit Split

Baseline before the split:

- `git status --short` was clean at commit
  `15d833e Split Rev 0 boot display-list flagged rect packet emit`.
- `node tools\verify_setup.js` passed with 825 archives, zero unknown bytes, 108
  visible overlap bytes, 81 tracked source files, 99 generated fallback chunks,
  and unchanged code/ROM hashes.

Promoted
`asm/original/rev0/boot/boot_display_list_color_rect_packet_emit.s` covering ROM
`0x0000906C..0x00009428` / RAM `0x80078C6C..0x80079028`. The old
`asm/original/rev0/code_0000906C_00011000.s` remainder was removed and replaced
by `asm/original/rev0/code_00009428_00011000.s`.

Static evidence from parent function/symbol/callgraph/xref data and local
source:

- `0x906C` is a valid 956-byte prologue helper fixed in all seven named states
  and all 21 snapshots, with frame size `0x30`.
- Parent data reports no secondary entries, no `jalr`, a clean exclusive end at
  `0x9428`, older/static callers `0xEE8E0` and `0xFAFAC`, and top constants
  `320` and `240`.
- Parent old callee data reports `0x368C`, while v2 leaves RAM target
  `0x8007338C` unresolved; local earlier source identifies that as the `0x378C`
  secondary entry inside `boot_resource_buffer_reset_flags.s`.
- Local source reads display-list pointer global `0x800E9BA0`, reads
  `0x800C4B20` and `0x800E8210`, and writes packet offsets from `0x800F0000`
  through `0x800F0044`.

Static shape:

- The helper clamps coordinate-like arguments to `0..0x13F` and `0..0xEF`,
  using an extra stack argument for the fourth clamp.
- It saves incoming `a0` as a color/fill-like word duplicated into both
  halfwords.
- It emits display-list-style packet runs through `0x800E9BA0`, including
  `E700`, `E200001C`, `E3000A01`, `FE00`, `F700`, and `F600` command words.

Verification for the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- Full `node tools\verify_setup.js` passed after docs were updated.
- Source mix is now 1 tracked composite real-asm chunk made from 82 tracked
  source files, plus 99 generated fallback chunks.
- Static dossier:
  `docs/dossiers/boot-display-list-color-rect-packet-emit.md`.

## 2026-06-21 - Boot Display-List Vector Distance / Transform Prefix Split

Baseline before the split:

- `git status --short` was clean at commit
  `6860e90 Split Rev 0 boot display-list color rect packet emit`.
- `node tools\verify_setup.js` passed with 825 archives, zero unknown bytes, 108
  visible overlap bytes, 82 tracked source files, 99 generated fallback chunks,
  and unchanged code/ROM hashes.

Promoted
`asm/original/rev0/boot/boot_display_list_vector_distance_and_transform_prefix.s`
covering ROM `0x00009428..0x0000954C` / RAM
`0x80079028..0x8007914C`. The old
`asm/original/rev0/code_00009428_00011000.s` remainder was removed and replaced
by `asm/original/rev0/code_0000954C_00011000.s`.

Static evidence from parent function/symbol/callgraph/xref data and local
source:

- `0x9428` is a valid 292-byte (`0x124`) prologue helper fixed in all seven
  named states and all 21 snapshots, with frame size `0x40`.
- Parent data reports no `jalr`, no indirect jump, no resolved v2 callers,
  older caller `0x112650`, and secondary entries `0x9488` and `0x953C`.
- The v2 callgraph leaves RAM targets `0x80098450` and `0x800907E0`
  unresolved.
- Parent/local xrefs read globals `0x800E9BE0` and `0x800C4C24`.
- Local source shows `0x953C..0x9548` reads those globals and falls through
  into the next `0x954C` body, so the prefix stays with this split to preserve
  the parent secondary entry.

Static shape:

- The helper calls RAM `0x80098450` with zeroed float arguments and stack output
  pointers.
- It reads vector-like float fields at `[a1+0/4/8]`, subtracts the returned
  output floats, squares and sums the components, and runs `sqrt.s`.
- The alternate sqrt path calls RAM `0x800907E0`.
- The result is divided by incoming `a2` saved as `f20`, scaled with float
  constant `0x477FFE00`, converted through the signed float-to-int boundary
  case, and returned as a 16-bit inverted value.

Verification for the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- Full `node tools\verify_setup.js` passed after docs were updated.
- Source mix is now 1 tracked composite real-asm chunk made from 83 tracked
  source files, plus 99 generated fallback chunks.
- Static dossier:
  `docs/dossiers/boot-display-list-vector-distance-and-transform-prefix.md`.

## 2026-06-21 - Boot Display-List Transform Coefficients / Sum Clear Split

Baseline before the split:

- `git status --short` was clean at commit
  `b26f5d0 Split Rev 0 boot display-list vector distance prefix`.
- `node tools\verify_setup.js` passed with 825 archives, zero unknown bytes, 108
  visible overlap bytes, 83 tracked source files, 99 generated fallback chunks,
  and unchanged code/ROM hashes.

Promoted
`asm/original/rev0/boot/boot_display_list_transform_coefficients_sum_clear.s`
covering ROM `0x0000954C..0x0000978C` / RAM
`0x8007914C..0x8007938C`. The old
`asm/original/rev0/code_0000954C_00011000.s` remainder was removed and replaced
by `asm/original/rev0/code_0000978C_00011000.s`.

Static evidence from parent function/symbol/callgraph/xref data and local
source:

- `0x954C` is a valid 576-byte (`0x240`) prologue helper fixed in all seven
  named states and all 21 snapshots, with frame size `0xA8`.
- Parent data reports older caller `0x22B0`, high-confidence callee `0x28D20` /
  RAM `0x80098920` called twice, no unresolved v2 targets, and secondary entry
  `0x9780`.
- Parent xrefs read globals `0x800F0008`, `0x800E9BE0`, and `0x800E7A0E`, and
  write `0x800A8740`.
- Local source corrects the exclusive boundary: parent function data ends at
  `0x9788`, but `0x9788` is the delay-slot store for the `0x9784` `jr ra`, so
  the promoted source must include through `0x978C`.

Static shape:

- The main helper calls RAM `0x80098920` twice, uses incoming `f12`, `f14`, and
  `a2` as float coefficients, reads descriptor/global `0x800E9BE0` plus
  halfword `0x800E7A0E`, and writes intermediate stack floats at
  `sp+0x60..0x6C`.
- It scales with float constant `0x467F8000`, truncates the divided float, and
  returns converted value plus `0x3FE0`.
- The promoted block also includes a compact `0x9758..0x9780` 16-word sum leaf
  and a `0x9780..0x978C` tail that clears word global `0x800A8740`.

Verification for the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- Full `node tools\verify_setup.js` passed after docs were updated.
- Source mix is now 1 tracked composite real-asm chunk made from 84 tracked
  source files, plus 99 generated fallback chunks.
- Static dossier:
  `docs/dossiers/boot-display-list-transform-coefficients-sum-clear.md`.

## Next Frontier

Continue from `asm/original/rev0/code_0000978C_00011000.s`. The first target is
the `0x978C` leaf/prefix family at RAM `0x8007938C`. Parent function data
reports size `0x28C`, actual prologue body at `0x97A8`, fixed in all seven
named states and all 21 snapshots, many callers, JAL-target and indirect-jump
behavior, high-confidence callees `0x9CAC`, `0x9C50`, `0x9D50`, `0x9EFC`,
`0x9FD8`, and `resource_free` `0x16C4`, with no unresolved v2 targets. Keep the
next `0x978C..0x9A18` family together until the jump/table shape is split
safely.
