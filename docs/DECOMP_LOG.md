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
  `0x00001000..0x00011000` made from 53 tracked source files, plus 99 generated
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
- `boot_resource_probe_chunk_callback_walk.s` `0x5058..0x50F0`.
- `boot_resource_probe_global_buffer_copy.s` `0x50F0..0x51A0`.
- `boot_resource_probe_global_buffer_signature_check.s` `0x51A0..0x539C`.
- `boot_resource_probe_id_materialize.s` `0x539C..0x553C`.
- `boot_resource_probe_dual_callback_materialize.s` `0x553C..0x5624`.
- `boot_resource_probe_global_buffer_dual_callback_apply.s`
  `0x5624..0x5760`.
- `boot_resource_probe_id_check_materialize.s` `0x5760..0x581C`.
- `boot_resource_probe_indexed_record_check.s` `0x581C..0x5978`.
- `boot_resource_probe_large_record_check.s` `0x5978..0x5A88`.
- `boot_resource_probe_small_record_check.s` `0x5A88..0x5B8C`.
- `boot_resource_probe_indexed_record_copy_flag.s` `0x5B8C..0x5C58`.
- Current remainder: `code_00005C58_00011000.s`.

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

## 2026-06-21 - Boot Resource Probe Chunk Callback Walk Split

Baseline before the split:

- `git status --short` was clean at commit
  `963422b Split Rev 0 resource probe global cleanup`.
- `node tools\verify_setup.js` passed with 825 archives, zero unknown bytes, 108
  visible overlap bytes, 42 tracked source files, and unchanged code/ROM hashes.
- Coverage/source audit reports still lined up: coverage ledger spans classify
  all 41,943,040 ROM bytes with zero unknown bytes; the source manifest has
  1,059 entries and preserves 2,469,141 ambiguous bytes explicitly.

Promoted `asm/original/rev0/boot/boot_resource_probe_chunk_callback_walk.s`
covering ROM `0x00005058..0x000050F0` / RAM
`0x80074C58..0x80074CF0`. The old `code_00005058_00011000.s` remainder was
removed and replaced by `asm/original/rev0/code_000050F0_00011000.s`.

Static evidence from parent `../scripts/ob64_symbols_v2.json`,
`../scripts/ob64_callgraph_v2.json`, and `../scripts/ob64_xrefs.json`:

- `0x5058` is a 152-byte valid JAL-target prologue with frame size `0x28`,
  epilogue, one `jalr`, and next function boundary `0x50F0`.
- Fixed RAM is `0x80074C58` in all seven named states and all 21 snapshots.
- Callers: `0x4FF0` and `0x4FF8`.
- High-confidence callees: `resource_alloc` (`0x1330`) and `resource_free`
  (`0x16C4`).
- No unresolved RAM calls.
- Global traffic: read from `0x800C4800`.

Static shape:

- The routine allocates a 0x10-byte scratch record and stores callback pointer
  `0x8008A0F0` into scratch word `+0x00`.
- It reads byte `0x800C4800`; when that byte is nonzero, it skips the chunk
  callback loop and just frees the scratch record.
- When the byte is zero, it walks an 0x8000-byte incoming buffer in 0x100-byte
  chunks and calls the scratch callback through `jalr` with
  `(offset, buffer + offset, 0x100, 1)`.
- It frees the scratch record with `resource_free` and returns.
- The name is conservative and records a static chunk-callback walk shape, not a
  verified runtime API.

Verification for the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- `node tools\verify_setup.js` passed after the docs update.
- Source mix is now 1 tracked composite real-asm chunk made from 43 tracked
  source files, plus 99 generated fallback chunks.

## 2026-06-21 - Boot Resource Probe Global Buffer Copy Split

Baseline before the split:

- `git status --short` was clean at commit
  `7b80364 Split Rev 0 resource probe chunk callback walk`.
- `node tools\verify_setup.js` passed with 825 archives, zero unknown bytes, 108
  visible overlap bytes, 43 tracked source files, and unchanged code/ROM hashes.
- Coverage/source audit reports still lined up: full-ROM source manifest has
  1,059 entries, zero unknown bytes, and 2,469,141 ambiguous bytes preserved
  explicitly.

Promoted `asm/original/rev0/boot/boot_resource_probe_global_buffer_copy.s`
covering ROM `0x000050F0..0x000051A0` / RAM
`0x80074CF0..0x80074DA0`. The old `code_000050F0_00011000.s` remainder was
removed and replaced by `asm/original/rev0/code_000051A0_00011000.s`.

Static evidence from parent `../scripts/ob64_symbols_v2.json`,
`../scripts/ob64_callgraph_v2.json`, and `../scripts/ob64_xrefs.json`:

- `0x50F0` is a 176-byte valid JAL-target leaf entry; `0x50F8` is the
  overlapping 168-byte prologue body with frame size `0x28` and the same return.
- Fixed RAM is `0x80074CF0/0x80074CF8` in all seven named states and all 21
  snapshots.
- Callers to `0x50F0`: `0x4DC0` and `0x4ED4`.
- No direct callers to `0x50F8` were reported.
- High-confidence callees: `resource_alloc` (`0x1330`), `0x1A4F0` / RAM
  `0x8008A0F0`, and `0x23460` / RAM `0x80093060`.
- No unresolved RAM calls.
- Global traffic: reads/writes `0x800A83B8`.

Static shape:

- The callable `0x50F0` prefix loads global pointer `0x800A83B8` and falls into
  the `0x50F8` stack-frame body.
- If the global is zero, the body allocates `0x8000` bytes, stores it to
  `0x800A83B8`, and fills the span in `0x100`-byte chunks by calling
  `0x8008A0F0(offset, global + offset, 0x100, 0)`.
- It then copies the caller-provided bytes through `0x80093060` with
  destination `0x800A83B8 + a1`, source `a0`, and length `a2`.
- The name is conservative and records a static global-buffer materialize/copy
  shape in the resource-probe family, not a verified runtime API.

Verification for the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- `node tools\verify_setup.js` passed after the docs update.
- Source mix is now 1 tracked composite real-asm chunk made from 44 tracked
  source files, plus 99 generated fallback chunks.

## 2026-06-21 - Boot Resource Probe Global Buffer Signature Check Split

Baseline before the split:

- `git status --short` was clean at commit
  `5cd3b60 Split Rev 0 resource probe global buffer copy`.
- `node tools\verify_setup.js` passed with 825 archives, zero unknown bytes, 108
  visible overlap bytes, 44 tracked source files, and unchanged code/ROM hashes.
- Coverage/source audit reports still lined up: full-ROM source manifest has
  1,059 entries, zero unknown bytes, and 2,469,141 ambiguous bytes preserved
  explicitly.

Promoted
`asm/original/rev0/boot/boot_resource_probe_global_buffer_signature_check.s`
covering ROM `0x000051A0..0x0000539C` / RAM
`0x80074DA0..0x80074F9C`. The old `code_000051A0_00011000.s` remainder was
removed and replaced by `asm/original/rev0/code_0000539C_00011000.s`.

Static evidence from parent `../scripts/ob64_symbols_v2.json`,
`../scripts/ob64_callgraph_v2.json`, and `../scripts/ob64_xrefs.json`:

- `0x51A0` is a 508-byte valid JAL-target prologue with frame size `0x38`,
  epilogue, no `jalr`, and next function boundary `0x539C`.
- Fixed RAM is `0x80074DA0` in all seven named states and all 21 snapshots.
- Caller to `0x51A0`: `0x4AC8`.
- High-confidence callees: `resource_alloc` (`0x1330`), `0x1A4F0` / RAM
  `0x8008A0F0`, `0x23460` / RAM `0x80093060`, and `0x23350` / RAM
  `0x80092F50`.
- No unresolved RAM calls.
- Global traffic: reads/writes `0x800A83B8`.

Static shape:

- The helper ensures shared global buffer `0x800A83B8` exists, allocating
  `0x8000` bytes and filling it in `0x100`-byte chunks through
  `0x8008A0F0(offset, global + offset, 0x100, 0)` when absent.
- It copies 8-byte records from global-buffer offsets `0x14`, `0x1864`,
  `0x30B4`, and `0x0004` into stack scratch through `0x80093060`.
- It compares each scratch record against the 8-byte base at `0x800A8240`
  through `0x80092F50`.
- Equal comparison returns zero through the early-exit path. If all required
  comparisons are nonzero, the final compare return is normalized with
  `sltu v0, zero, v0`.
- The name is conservative and records a static resource-probe record/signature
  check shape, not a verified runtime API.

Verification for the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- `node tools\verify_setup.js` passed after the docs update.
- Source mix is now 1 tracked composite real-asm chunk made from 45 tracked
  source files, plus 99 generated fallback chunks.

## 2026-06-21 - Boot Resource Probe ID Materialize Split

Baseline before the split:

- `git status --short` was clean at commit
  `dfea638 Split Rev 0 resource probe global buffer signature check`.
- `node tools\verify_setup.js` passed with 825 archives, zero unknown bytes, 108
  visible overlap bytes, 45 tracked source files, and unchanged code/ROM hashes.
- Coverage/source audit reports still lined up: full-ROM source manifest has
  1,059 entries, zero unknown bytes, and 2,469,141 ambiguous bytes preserved
  explicitly.

Promoted `asm/original/rev0/boot/boot_resource_probe_id_materialize.s`
covering ROM `0x0000539C..0x0000553C` / RAM
`0x80074F9C..0x8007513C`. The old `code_0000539C_00011000.s` remainder was
removed and replaced by `asm/original/rev0/code_0000553C_00011000.s`.

Static evidence from parent `../scripts/ob64_symbols_v2.json`,
`../scripts/ob64_callgraph_v2.json`, and `../scripts/ob64_xrefs.json`:

- `0x539C` is a 416-byte valid prologue with frame size `0x38`, epilogue, one
  `jalr`, and next function boundary `0x553C`.
- Fixed RAM is `0x80074F9C` in all seven named states and all 21 snapshots.
- Callers to `0x539C`: `0x4AC8`, `0x4C34`, and `0x5760`.
- High-confidence callees: `resource_alloc` (`0x1330`), `0x23780` / RAM
  `0x80093380`, `0x5D9C`, `0x5C58` via RAM `0x800758FC`, `0x23460` / RAM
  `0x80093060`, `0x1A4F0` / RAM `0x8008A0F0`, `0x5B8C`, and `resource_free`
  (`0x16C4`).
- One unresolved RAM call is reported: `0x8016CD90`.
- Global traffic: reads/writes `0x800A83B8`, writes `0x800A83BC`, and reads
  `0x800A824C/0x800A8258`.

Static shape:

- Input ID `0x0E` allocates and clears a 0x10-byte record, calls unresolved
  `0x8016CD90` on record `+0x0C`, calls nearby helpers `0x5D9C` and the
  overlay-aware `0x5C58` target via RAM `0x800758FC`, then frees the record.
- Input ID `0x0F` clears 12 bytes of stack scratch, copies 8 bytes from
  `0x800A8240` to stack offset `+0x14`, ensures shared global buffer
  `0x800A83B8` exists, copies 12 bytes from global-buffer offset `0x30B0` to
  stack scratch, sets byte `0x800A83BC` to `1`, and returns through the epilogue
  without heap scratch.
- Other IDs allocate and clear a 0x1850-byte scratch record, loop over 13
  stride-`0x1C` callback slots, read callback pointers from `0x800A824C + i`,
  read per-slot offsets from `0x800A8258 + i`, call nonzero callbacks through
  `jalr` with scratch-relative arguments, call nearby helpers `0x5D9C` and
  `0x5B8C` with the input ID and scratch record, free the scratch record, and
  return.
- The name is conservative and records a static ID dispatch/materialize shape,
  not a verified runtime API.

Verification for the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- `node tools\verify_setup.js` passed after the docs update.
- Source mix is now 1 tracked composite real-asm chunk made from 46 tracked
  source files, plus 99 generated fallback chunks.

## 2026-06-21 - Boot Resource Probe Dual Callback Materialize Split

Baseline before the split:

- `git status --short` was clean at commit
  `0d7a392 Split Rev 0 resource probe ID materialize helper`.
- `node tools\verify_setup.js` passed with 825 archives, zero unknown bytes, 108
  visible overlap bytes, 46 tracked source files, and unchanged code/ROM hashes.
- The active compact decomp log was 408 lines / 2,881 words, so no archive/prune
  pass was needed.

Promoted
`asm/original/rev0/boot/boot_resource_probe_dual_callback_materialize.s`
covering ROM `0x0000553C..0x00005624` / RAM
`0x8007513C..0x80075224`. The old `code_0000553C_00011000.s` remainder was
removed and replaced by `asm/original/rev0/code_00005624_00011000.s`.

Static evidence from parent `../scripts/ob64_symbols_v2.json`,
`../scripts/ob64_callgraph_v2.json`, and `../scripts/ob64_xrefs.json`:

- `0x553C` is a 232-byte valid prologue with frame size `0x20`, epilogue, two
  indirect `jalr` calls, and next function boundary `0x5624`.
- Fixed RAM is `0x8007513C` in all seven named states and all 21 snapshots.
- Caller to `0x553C`: `0x4C5C`.
- High-confidence callees: `resource_alloc` (`0x1330`), `0x23780` / RAM
  `0x80093380`, `0x5D9C` / RAM `0x8007599C`, `0x5C58` / RAM `0x80075858`, and
  `resource_free` (`0x16C4`).
- No unresolved RAM calls are reported.
- Global reads: `0x800A8254`, `0x800A8258`, `0x800A8260`, and `0x800A8264`.

Static shape:

- Allocates and clears a 0x4AE8-byte scratch record.
- Walks 13 stride-`0x1C` callback entries from `0x800A8254/8258`, calling
  nonzero function pointers through `jalr` with `scratch + offset + 0x0C`.
- Walks 13 stride-`0x1C` callback entries from `0x800A8260/8264`, calling
  nonzero function pointers through `jalr` with `scratch + offset + 0x1850`.
- Calls nearby helpers `0x5D9C(0x0F, scratch)` and `0x5C58(scratch)`, frees the
  scratch record, and returns.
- The name is conservative and records a static dual-callback materialize
  shape, not a verified runtime API.

Verification for the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- `node tools\verify_setup.js` passed after the docs update.
- Source mix is now 1 tracked composite real-asm chunk made from 47 tracked
  source files, plus 99 generated fallback chunks.

## 2026-06-21 - Boot Resource Probe Global Buffer Dual Callback Apply Split

Baseline before the split:

- `git status --short` was clean at commit
  `9052a4c Split Rev 0 resource probe dual callback materialize helper`.
- `node tools\verify_setup.js` passed with 825 archives, zero unknown bytes, 108
  visible overlap bytes, 47 tracked source files, and unchanged code/ROM hashes.
- The active compact decomp log was 451 lines / 3,180 words, so no archive/prune
  pass was needed.

Promoted
`asm/original/rev0/boot/boot_resource_probe_global_buffer_dual_callback_apply.s`
covering ROM `0x00005624..0x00005760` / RAM
`0x80075224..0x80075360`. The old `code_00005624_00011000.s` remainder was
removed and replaced by `asm/original/rev0/code_00005760_00011000.s`.

Static evidence from parent `../scripts/ob64_symbols_v2.json`,
`../scripts/ob64_callgraph_v2.json`, and `../scripts/ob64_xrefs.json`:

- `0x5624` is a 316-byte valid prologue with frame size `0x20`, epilogue, two
  indirect `jalr` calls, and next function boundary `0x5760`.
- Fixed RAM is `0x80075224` in all seven named states and all 21 snapshots.
- Caller to `0x5624`: `0x4DC0`.
- High-confidence callees: `resource_alloc` (`0x1330`, count 2),
  `0x1A4F0` / RAM `0x8008A0F0`, `0x23460` / RAM `0x80093060`, and
  `resource_free` (`0x16C4`).
- No unresolved RAM calls are reported.
- Global traffic: reads/writes `0x800A83B8`; reads `0x800A8250`,
  `0x800A8258`, `0x800A825C`, and `0x800A8264`.

Static shape:

- Allocates a `0x4AE8` scratch record.
- If shared global buffer `0x800A83B8` is null, allocates `0x8000` bytes and
  fills the buffer in `0x100`-byte chunks through `0x8008A0F0`.
- Copies `0x4AE8` bytes from shared-buffer offset `0x30B0` into scratch through
  `0x80093060`.
- If scratch word `+0x00` is zero, skips callbacks and frees the scratch.
- Otherwise walks 13 stride-`0x1C` callback slots from `0x800A8250/8258` with
  arguments at `scratch + offset + 0x0C`, then 13 slots from
  `0x800A825C/8264` with arguments at `scratch + offset + 0x1850`.
- Frees the scratch record and returns.
- The name is conservative and records a static global-buffer/callback apply
  shape, not a verified runtime API.

Verification for the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- `node tools\verify_setup.js` passed after the docs update.
- Source mix is now 1 tracked composite real-asm chunk made from 48 tracked
  source files, plus 99 generated fallback chunks.

## 2026-06-21 - Boot Resource Probe ID Check Materialize Split

Baseline before the split:

- `git status --short` was clean at commit
  `121f097 Split Rev 0 resource probe global buffer dual callback apply helper`.
- `node tools\verify_setup.js` passed with 825 archives, zero unknown bytes, 108
  visible overlap bytes, 48 tracked source files, and unchanged code/ROM hashes.
- The active compact decomp log was 498 lines / 3,536 words, so no archive/prune
  pass was needed.

Promoted `asm/original/rev0/boot/boot_resource_probe_id_check_materialize.s`
covering ROM `0x00005760..0x0000581C` / RAM
`0x80075360..0x8007541C`. The old `code_00005760_00011000.s` remainder was
removed and replaced by `asm/original/rev0/code_0000581C_00011000.s`.

Static evidence from parent `../scripts/ob64_symbols_v2.json` and
`../scripts/ob64_callgraph_v2.json`:

- `0x5760` is a 188-byte valid prologue with frame size `0x20`, epilogue, no
  indirect calls, and next function boundary `0x581C`.
- Fixed RAM is `0x80075360` in all seven named states and all 21 snapshots.
- Caller to `0x5760`: `0x4AC8`.
- High-confidence callees: `resource_alloc` (`0x1330`, count 3), `0x5978` via
  RAM targets `0x80075688` and `0x80075578`, `0x581C`, `resource_free`
  (`0x16C4`), and `0x539C`.
- No unresolved RAM calls are reported.
- No global xrefs are reported.

Static shape:

- Dispatches on incoming ID.
- ID `0x0E` allocates a 0x10-byte scratch record and calls target RAM
  `0x80075688`.
- ID `0x0F` allocates a 0x4AE8-byte scratch record and calls target RAM
  `0x80075578`.
- Other IDs allocate a 0x1850-byte scratch record and call `0x581C(id,
  scratch)`.
- All paths convert the helper return to a boolean, free the scratch record, and
  return `1` if the helper was nonzero.
- On a zero helper result, the routine calls `0x539C(id)` and returns `0`.
- The name is conservative and records a static ID-check/fallback-materialize
  shape, not a verified runtime API.

Verification for the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- `node tools\verify_setup.js` passed after the docs update.
- Source mix is now 1 tracked composite real-asm chunk made from 49 tracked
  source files, plus 99 generated fallback chunks.

## 2026-06-21 - Boot Resource Probe Indexed Record Check Split

Baseline before the split:

- `git status --short` was clean at commit
  `a1f8590 Split Rev 0 resource probe ID check materialize helper`.
- `node tools\verify_setup.js` passed with 825 archives, zero unknown bytes, 108
  visible overlap bytes, 49 tracked source files, and unchanged code/ROM hashes.

Promoted `asm/original/rev0/boot/boot_resource_probe_indexed_record_check.s`
covering ROM `0x0000581C..0x00005978` / RAM
`0x8007541C..0x80075578`. The old `code_0000581C_00011000.s` remainder was
removed and replaced by `asm/original/rev0/code_00005978_00011000.s`.

Static evidence from parent `../scripts/ob64_symbols_v2.json`,
`../scripts/ob64_callgraph_v2.json`, and `../scripts/ob64_xrefs.json`:

- `0x581C` is a 348-byte valid prologue with frame size `0x30`, epilogue, no
  indirect calls, next boundary `0x5978`, and secondary entry `0x588C`.
- Fixed RAM is `0x8007541C` in all seven named states and all 21 snapshots.
- Callers: `0x4ED4` and `0x5760`.
- High-confidence callees: `resource_alloc` (`0x1330`), `0x1A4F0` / RAM
  `0x8008A0F0`, `0x23460` / RAM `0x80093060`, and `0x23350` / RAM
  `0x80092F50`.
- Unresolved RAM calls are reported for `0x80075A84` and `0x80075B00`.
- Global traffic: reads/writes `0x800A83B8`.

Static shape:

- Computes indexed offset `id * 0x1850 + 0x10`.
- Ensures shared global buffer `0x800A83B8` exists, allocating `0x8000` bytes
  and filling it in `0x100`-byte chunks through `0x8008A0F0` when absent.
- Copies `0x1850` bytes from the shared buffer at the indexed offset into
  caller scratch through `0x80093060`.
- Compares `scratch + 4` against the 8-byte base at `0x800A8240` through
  `0x80092F50`; mismatch returns zero.
- Calls unresolved `0x80075A84(scratch + 0x0C, 0x1844, indexedOffset)` and
  compares the low halfword return against `lhu scratch+0`.
- Calls unresolved `0x80075B00(scratch + 0x0C, 0x1844, indexedOffset)` and
  compares the low halfword return against `lhu scratch+2`.
- Returns `1` only if the signature and both halfword checks match.

Verification for the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- `node tools\verify_setup.js` passed after the docs update.
- Source mix is now 1 tracked composite real-asm chunk made from 50 tracked
  source files, plus 99 generated fallback chunks.

## 2026-06-21 - Boot Resource Probe Large Record Check Split

Baseline before the split:

- `git status --short` was clean at commit
  `58bd85b Split Rev 0 resource probe indexed record check helper`.
- `node tools\verify_setup.js` passed with 825 archives, zero unknown bytes, 108
  visible overlap bytes, 50 tracked source files, and unchanged code/ROM hashes.

Promoted `asm/original/rev0/boot/boot_resource_probe_large_record_check.s`
covering ROM `0x00005978..0x00005A88` / RAM
`0x80075578..0x80075688`. The old `code_00005978_00011000.s` remainder was
removed and replaced by `asm/original/rev0/code_00005A88_00011000.s`.

Static evidence from parent `../scripts/ob64_symbols_v2.json`,
`../scripts/ob64_callgraph_v2.json`, and `../scripts/ob64_xrefs.json`:

- `0x5978` is a 272-byte leaf entry that reads `0x800A83B8` before falling into
  the `0x5980` 264-byte prologue body with frame size `0x28`.
- Fixed runtime evidence shows primary RAM `0x80075578`, with matching code
  also appearing at `0x80075688` in all seven named states and all 21 snapshots.
- Callers: `0x4ED4` and `0x5760`; `0x5760` reaches both RAM targets
  `0x80075578` and `0x80075688`.
- High-confidence callees: `resource_alloc` (`0x1330`), `0x1A4F0` /
  RAM `0x8008A0F0`, `0x23460` /
  RAM `0x80093060`, and `0x23350` / RAM `0x80092F50`.
- Unresolved RAM calls are reported for `0x80075A84` and `0x80075B00`.
- Global traffic: reads/writes `0x800A83B8`.

Static shape:

- The `0x5978` prefix loads shared global buffer pointer `0x800A83B8`, then the
  `0x5980` stack-frame body uses that loaded pointer.
- If the pointer is zero, the routine allocates `0x8000` bytes, stores it to
  `0x800A83B8`, and fills the span in `0x100`-byte chunks through
  `0x8008A0F0`.
- Copies `0x4AE8` bytes from shared-buffer offset `0x30B0` into caller scratch
  through `0x80093060`.
- Compares `scratch + 4` against the 8-byte base at `0x800A8240` through
  `0x80092F50`; mismatch returns zero.
- If scratch word `+0x00` is zero, returns `1`.
- Otherwise calls unresolved `0x80075A84(scratch + 0x0C, 0x4ADC, 0x30B0)` and
  compares the low halfword return against `lhu scratch+0`.
- Calls unresolved `0x80075B00(scratch + 0x0C, 0x4ADC, 0x30B0)` and compares
  the low halfword return against `lhu scratch+2`.
- Returns `1` only if the signature and required halfword checks match.

Verification for the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- `node tools\verify_setup.js` passed after the docs update.
- Source mix is now 1 tracked composite real-asm chunk made from 51 tracked
  source files, plus 99 generated fallback chunks.

## 2026-06-21 - Boot Resource Probe Small Record Check Split

Baseline before the split:

- `git status --short` was clean at commit
  `f475044 Split Rev 0 resource probe large record check helper`.
- `node tools\verify_setup.js` passed with 825 archives, zero unknown bytes, 108
  visible overlap bytes, 51 tracked source files, and unchanged code/ROM hashes.

Promoted `asm/original/rev0/boot/boot_resource_probe_small_record_check.s`
covering ROM `0x00005A88..0x00005B8C` / RAM
`0x80075688..0x8007578C`. The old `code_00005A88_00011000.s` remainder was
removed and replaced by `asm/original/rev0/code_00005B8C_00011000.s`.

Static evidence from parent `../scripts/ob64_symbols_v2.json`,
`../scripts/ob64_callgraph_v2.json`, and `../scripts/ob64_xrefs.json`:

- `0x5A88` is a 260-byte leaf entry that reads `0x800A83B8` before falling into
  the `0x5A90` 252-byte prologue body with frame size `0x28`.
- Fixed runtime evidence aliases the sibling family with primary RAM
  `0x80075578/0x80075580` plus code also appearing at `0x80075688/0x80075690`
  in all seven named states and all 21 snapshots.
- Parent callgraph data records no direct callers on the specific
  `0x00005A88/0x00005A90` entries, but the preceding ID check/materialize
  wrapper targets sibling RAM `0x80075688`; the v2 map folds that target into
  the nearby record-check family.
- High-confidence callees mirror the record-check family:
  `resource_alloc` (`0x1330`), `0x1A4F0` / RAM `0x8008A0F0`, `0x23460` /
  RAM `0x80093060`, and `0x23350` / RAM `0x80092F50`.
- Unresolved RAM calls are reported for `0x80075A84` and `0x80075B00`.
- Global traffic: reads/writes `0x800A83B8`.

Static shape:

- The `0x5A88` prefix loads shared global buffer pointer `0x800A83B8`, then the
  `0x5A90` stack-frame body uses that loaded pointer.
- If the pointer is zero, the routine allocates `0x8000` bytes, stores it to
  `0x800A83B8`, and fills the span in `0x100`-byte chunks through
  `0x8008A0F0`.
- Copies `0x10` bytes from shared-buffer offset `0` into caller scratch through
  `0x80093060`.
- Compares `scratch + 4` against the 8-byte base at `0x800A8240` through
  `0x80092F50`; mismatch returns zero.
- Calls unresolved `0x80075A84(scratch + 0x0C, 4, 0)` and compares the low
  halfword return against `lhu scratch+0`.
- Calls unresolved `0x80075B00(scratch + 0x0C, 4, 0)` and compares the low
  halfword return against `lhu scratch+2`.
- Returns `1` only if the signature and both halfword checks match.

Verification for the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- `node tools\verify_setup.js` passed after the docs update.
- Source mix is now 1 tracked composite real-asm chunk made from 52 tracked
  source files, plus 99 generated fallback chunks.

## 2026-06-21 - Boot Resource Probe Indexed Record Copy/Flag Split

Baseline before the split:

- `git status --short` was clean at commit
  `73d92db Split Rev 0 resource probe small record check helper`.
- `node tools\verify_setup.js` passed with 825 archives, zero unknown bytes, 108
  visible overlap bytes, 52 tracked source files, and unchanged code/ROM hashes.

Promoted
`asm/original/rev0/boot/boot_resource_probe_indexed_record_copy_flag.s`
covering ROM `0x00005B8C..0x00005C58` / RAM
`0x8007578C..0x80075858`. The old `code_00005B8C_00011000.s` remainder was
removed and replaced by `asm/original/rev0/code_00005C58_00011000.s`.

Static evidence from parent `../scripts/ob64_symbols_v2.json`,
`../scripts/ob64_callgraph_v2.json`, and local source inspection:

- `0x5B8C` is a 204-byte prologue helper with frame size `0x28`.
- Fixed runtime evidence places it at RAM `0x8007578C` in all seven named states
  and all 21 snapshots.
- Static callers are `0x4C5C` and `0x539C`.
- High-confidence callees are `resource_alloc` (`0x1330`), `0x1A4F0` /
  RAM `0x8008A0F0`, and `0x23460` / RAM `0x80093060`; no unresolved calls were
  reported for this helper.
- Global traffic reads/writes `0x800A83B8` and writes byte `0x800A83BC`.

Static shape:

- Computes `id * 0x1850 + 0x10` through shifts/adds.
- If shared buffer pointer `0x800A83B8` is zero, allocates `0x8000`, stores it
  globally, and fills the span in `0x100`-byte chunks through `0x8008A0F0`.
- Copies `0x1850` bytes from `0x800A83B8 + computedOffset` into caller scratch
  through `0x80093060`.
- Stores byte `1` to `0x800A83BC`.
- Restores saved registers and returns; no signature/halfword validation is
  present in this helper.

Verification for the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- `node tools\verify_setup.js` passed after the docs update.
- Source mix is now 1 tracked composite real-asm chunk made from 53 tracked
  source files, plus 99 generated fallback chunks.

## Next Frontier

Continue from `asm/original/rev0/code_00005C58_00011000.s`.

Parent evidence for the next target:

- `0x5C58` is a leaf entry that reads `0x800A83B8` before falling into the
  `0x5C60` prologue helper with frame size `0x20`.
- Fixed runtime evidence places the family at RAM `0x80075858/0x80075860` in
  all seven named states and all 21 snapshots; parent data also aliases sibling
  targets at `0x800758FC/0x80075904`, so inspect the overlap carefully before
  splitting.
- Static callers include `0x553C`; parent callgraph also folds `0x4C5C` and
  `0x539C` into the same `0x5C58` family through the alias.
- High-confidence callees are `resource_alloc` (`0x1330`), `0x1A4F0` /
  RAM `0x8008A0F0`, and `0x23460` / RAM `0x80093060`.
- It reads/writes `0x800A83B8` and writes byte `0x800A83BC`.
- Static shape: ensures the shared buffer exists, copies `0x4AE8` bytes from
  shared-buffer offset `0x30B0` into caller scratch, sets `0x800A83BC = 1`, and
  returns.
