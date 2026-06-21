# OB64 Decomp Log

This is the compact current-state decomp memory. The full historical log through
the previous frontier is archived at
`docs/archive/DECOMP_LOG-full-through-resource-probe-finalize-2026-06-21.md`.

Read this after `AGENTS.md`, `docs/PLATFORM.md`, `docs/REV0_SCOPE.md`,
`docs/TOOLCHAIN.md`, and `docs/WORKFLOW.md`. Keep it focused on durable
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
  `0x00001000..0x00011000` made from 42 tracked source files, plus 99 generated
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
- `boot_bitstream_cursor_helpers.s` `0x43D4..0x46F4`.
- `boot_bitstream_descriptor_decode.s` `0x46F4..0x4894`.
- `boot_bitstream_descriptor_encode.s` `0x4894..0x4AC8`.
- `boot_resource_probe_init.s` `0x4AC8..0x4C34`.
- `boot_resource_probe_finalize.s` `0x4C34..0x4C5C`.
- `boot_resource_probe_dispatch_prepare.s` `0x4C5C..0x4DC0`.
- `boot_resource_probe_dispatch_apply.s` `0x4DC0..0x4ED4`.
- `boot_resource_probe_dispatch_result_build.s` `0x4ED4..0x4FF0`.
- `boot_resource_probe_global_cleanup.s` `0x4FF0..0x5058`.
- Current remainder: `code_00005058_00011000.s`.

Static dossiers live under `docs/dossiers/` and are the durable evidence notes
for each promoted source-layout split.

## 2026-06-21 - Boot Resource Probe Dispatch Prepare Split

Promoted `asm/original/rev0/boot/boot_resource_probe_dispatch_prepare.s`
covering ROM `0x00004C5C..0x00004DC0` / RAM `0x8007485C..0x800749C0`.
The old `code_00004C5C_00011000.s` remainder was removed and replaced by
`asm/original/rev0/code_00004DC0_00011000.s`.

Static evidence from parent `../scripts/ob64_functions.json` and
`../scripts/ob64_symbols_v2.json`:

- `0x4C5C` is a 356-byte valid JAL-target prologue with frame size `0x28`,
  epilogue, one `jalr`, and next function boundary `0x4DC0`.
- Fixed RAM is `0x8007485C` in all seven named states and all 21 snapshots.
- Callers: `0x4DF6C`, `0x79E84`, `0xEC6D4`, `0x1E05B4`, and medium-confidence
  `0x24AF04`.
- High-confidence callees: `0x553C`, `resource_alloc` (`0x1330`), `0x23780`,
  `0x5D9C`, `0x5C58` via overlay-ambiguous target RAM `0x800758FC`,
  `resource_free` (`0x16C4`), `0x5B8C`, and `0x4FF0`.
- Unresolved RAM calls: `0x8016CDF4` and `0x80093540`.
- Global reads: `0x800A8254` and `0x800A8258`.

Static shape:

- ID `0x0F` calls helper `0x553C`, then common finalizer `0x4FF0(0x37081383)`.
- ID `0x0E` allocates/clears a 0x10-byte record, calls unresolved
  `0x8016CDF4` on record `+0x0C`, runs local helper/free cleanup, then
  finalizes.
- IDs `0` and `1` allocate a 0x1850-byte record, increment word `+0x0C` with
  zero wrapping to `-1`, walk 13 stride-`0x1C` callback-table entries read from
  `0x800A8254/0x800A8258`, call nonzero callbacks through `jalr`, then run
  local helper/free cleanup and finalize.
- Other IDs call diagnostic-looking unresolved `0x80093540(0x800ADF08, id)` and
  loop forever.

Verification for the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- `node tools\verify_setup.js` passed after the docs update.
- Source mix is now 1 tracked composite real-asm chunk made from 39 tracked
  source files, plus 99 generated fallback chunks.

## 2026-06-21 - Boot Resource Probe Dispatch Apply Split

Baseline before the split:

- `git status --short` was clean at commit
  `a066efe Split Rev 0 resource probe dispatch`.
- `node tools\verify_setup.js` passed with 825 archives, zero unknown bytes, 108
  visible overlap bytes, 39 tracked source files, and unchanged code/ROM hashes.
- Coverage/source audit reports still lined up: coverage ledger spans classify
  all 41,943,040 ROM bytes with zero unknown bytes; segment/source manifest
  checks pass; original-MIPS covers configured code region
  `0x00001000..0x0063676C`; non-code bytes remain represented as raw/archive/
  audio/LZSS/tail/padding source forms.

Promoted `asm/original/rev0/boot/boot_resource_probe_dispatch_apply.s` covering
ROM `0x00004DC0..0x00004ED4` / RAM `0x800749C0..0x80074AD4`. The old
`code_00004DC0_00011000.s` remainder was removed and replaced by
`asm/original/rev0/code_00004ED4_00011000.s`.

Static evidence from parent `../scripts/ob64_functions.json` and
`../scripts/ob64_symbols_v2.json`:

- `0x4DC0` is a 276-byte valid JAL-target prologue with frame size `0x20`,
  epilogue, one `jalr`, and next function boundary `0x4ED4`.
- Fixed RAM is `0x800749C0` in all seven named states and all 21 snapshots.
- Callers: `0x22B0`, `0x79E84`, `0x1DF788`, `0x1E0024`, and medium-confidence
  `0x24AE88`.
- High-confidence callees: `0x5624`, `resource_alloc` (`0x1330`), `0x50F0`,
  `resource_free` (`0x16C4`), and `0x4FF0`.
- Unresolved RAM call: `0x8016CDCC`.
- Global reads: `0x800A8258` and `0x800A8250`.

Static shape:

- ID `0x0F` calls helper `0x5624`, then common finalizer `0x4FF0(0x37081383)`.
- ID `0x0E` allocates a 0x10-byte scratch record, calls `0x50F0` with
  `(record, 0, 0x10)`, calls unresolved `0x8016CDCC` on record `+0x0C`, frees
  the record, and finalizes.
- Other IDs allocate a 0x1850-byte scratch record, compute slot offset
  `id * 0x1850 + 0x10`, call `0x50F0` with `(record, offset, 0x1850)`, walk 13
  stride-`0x1C` callback-table entries read from `0x800A8250/0x800A8258`, call
  nonzero callbacks through `jalr`, free the record, and finalize.

Verification for the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- `node tools\verify_setup.js` passed after the docs update.
- Source mix is now 1 tracked composite real-asm chunk made from 40 tracked
  source files, plus 99 generated fallback chunks.

## 2026-06-21 - Boot Resource Probe Dispatch Result Build Split

Baseline before the split:

- `git status --short` was clean at commit
  `ac03f12 Split Rev 0 resource probe dispatch apply`.
- `node tools\verify_setup.js` passed with 825 archives, zero unknown bytes, 108
  visible overlap bytes, 40 tracked source files, and unchanged code/ROM hashes.
- Coverage/source audit reports still lined up: coverage ledger spans classify
  all 41,943,040 ROM bytes with zero unknown bytes; original-MIPS covers
  configured code region `0x00001000..0x0063676C`; source-owner rebuild remains
  exact with ambiguous archive-gap/tail bytes preserved explicitly.

Promoted `asm/original/rev0/boot/boot_resource_probe_dispatch_result_build.s`
covering ROM `0x00004ED4..0x00004FF0` / RAM
`0x80074AD4..0x80074BF0`. The old `code_00004ED4_00011000.s` remainder was
removed and replaced by `asm/original/rev0/code_00004FF0_00011000.s`.

Static evidence from parent `../scripts/ob64_functions.json`,
`../scripts/ob64_symbols_v2.json`, and `../scripts/ob64_callgraph_v2.json`:

- `0x4ED4` is a 284-byte valid JAL-target prologue with frame size `0x28`,
  epilogue, no `jalr`, and next function boundary `0x4FF0`.
- Fixed RAM is `0x80074AD4` in all seven named states and all 21 snapshots.
- Callers: `0x79E84`, `0x1DF5F4`, and medium-confidence `0x1D17E0` and
  `0x24AE88`.
- High-confidence callees: `resource_alloc` (`0x1330`), `0x5978`, `0x50F0`,
  `0x581C`, `0x4FF0`, `0x23460`, and `resource_free` (`0x16C4`).
- No unresolved RAM calls.
- Global read: `0x800A8258`.

Static shape:

- ID `0x0F` allocates a 0x4AE8-byte scratch record, calls helper `0x5978`,
  materializes data through `0x50F0(record, 0x30B0, 0x4AE8)`, and uses the
  first scratch word as an optional marker.
- Other IDs allocate a 0x1850-byte scratch record, call `0x581C(id, record)`,
  materialize data through `0x50F0(record, id * 0x1850 + 0x10, 0x1850)`, and
  use scratch word `+0x0C` as an optional marker.
- If the marker is nonzero, the routine reads offset data from `0x800A8258`,
  allocates a 0x1A-byte output buffer, copies 0x1A bytes from the scratch record
  through `0x23460`, frees the scratch record, and returns the output buffer.
  Otherwise it still calls `0x4FF0(0x37081383)`, frees the scratch record, and
  returns zero.

Verification for the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- `node tools\verify_setup.js` passed after the docs update.
- Source mix is now 1 tracked composite real-asm chunk made from 41 tracked
  source files, plus 99 generated fallback chunks.

## 2026-06-21 - Boot Resource Probe Global Cleanup Split

Baseline before the split:

- `git status --short` was clean at commit
  `714729d Split Rev 0 resource probe dispatch result build`.
- `node tools\verify_setup.js` passed with 825 archives, zero unknown bytes, 108
  visible overlap bytes, 41 tracked source files, and unchanged code/ROM hashes.
- Coverage/source audit reports still lined up: coverage ledger spans classify
  all 41,943,040 ROM bytes with zero unknown bytes; the source manifest has
  1,059 entries and preserves 2,469,141 ambiguous bytes explicitly.

Promoted `asm/original/rev0/boot/boot_resource_probe_global_cleanup.s`
covering ROM `0x00004FF0..0x00005058` / RAM
`0x80074BF0..0x80074C58`. The old `code_00004FF0_00011000.s` remainder was
removed and replaced by `asm/original/rev0/code_00005058_00011000.s`.

Static evidence from parent `../scripts/ob64_functions.json`,
`../scripts/ob64_symbols_v2.json`, and `../scripts/ob64_callgraph_v2.json`:

- `0x4FF0` is a 104-byte valid JAL-target leaf entry; `0x4FF8` is the
  overlapping 96-byte prologue body with frame size `0x18` and the same return.
- Fixed RAM is `0x80074BF0/0x80074BF8` in all seven named states and all 21
  snapshots.
- Callers to `0x4FF0`: `0x4AC8`, `0x4C34`, `0x4C5C`, `0x4DC0`, and `0x4ED4`.
- No direct callers to `0x4FF8` were reported.
- High-confidence callees: `0x5058` and `resource_free` (`0x16C4`).
- No unresolved RAM calls.
- Global traffic: reads/writes `0x800A83B8` and `0x800A83BC`.

Static shape:

- The callable `0x4FF0` prefix reads byte `0x800A83BC` and falls into the
  `0x4FF8` stack-frame body.
- If that byte is `1` and incoming `a0` equals `0x37081383`, the routine calls
  `0x5058([0x800A83B8])`.
- It clears `0x800A83BC`, frees `[0x800A83B8]` with `resource_free` when
  nonzero, clears `0x800A83B8`, and returns.
- The name is conservative and records the static clear/free role in the
  resource-probe family, not a verified runtime API.

Verification for the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- `node tools\verify_setup.js` passed after the docs update.
- Source mix is now 1 tracked composite real-asm chunk made from 42 tracked
  source files, plus 99 generated fallback chunks.

## Next Frontier

Continue from `asm/original/rev0/code_00005058_00011000.s`.

Parent evidence for the next target:

- `0x5058` is a 152-byte JAL-target prologue with frame size `0x28`, epilogue,
  and one indirect `jalr`.
- Fixed RAM is `0x80074C58` in all seven named states and all 21 snapshots.
- Callers: `0x4FF0` and `0x4FF8`.
- High-confidence callees: `resource_alloc` (`0x1330`) and `resource_free`
  (`0x16C4`).
- Global traffic: read from `0x800C4800`.
