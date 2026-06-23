# OB64 Decomp Log

This is the compact current-state decomp memory. Full historical logs are
archived under `docs/archive/`; the newest full archive before this compaction
is
`docs/archive/DECOMP_LOG-full-through-resource-decode-subsystem-2026-06-21.md`.

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
- Current tracked code source mix: fourteen composite real-assembler chunks
  (chunk 0 177 `boot/`; chunks 1–13 in `lib/`: 350, 216, 67, 376, 88, 78, 103, 87, 34, 35, 191, 74, 67) =
  **1,943 tracked source files**, plus 86 generated fallback code chunks. **Chunks
  0–13 (`0x00001000..0x000E1000`) are now fully source-owned as named code/data
  parts** (chunk 9: 32 code + 2 straddler + 0 data, ALL CODE; chunk 10: 33 code + 2
  straddler + 0 data, ALL CODE; chunk 11: 189 code + 2 straddler + 0 data, ALL CODE —
  77 leaves recovered; chunk 12: 72 code + 2 straddler + 0 data, ALL CODE — 20
  dispatchers; chunk 13: 27 code + 40 data, MIXED — unit-mgmt UI data); next is chunk
  14 (`0x000E1000`, still a generated fallback chunk). The promote-tool merge blocker is FIXED.
- The parent boundary DB has TWO recurring defects, both fixed when splitting:
  (1) `end_rom` is INCLUSIVE (exclusive end = `end_rom + 4`; do NOT treat the
  delay slot as a gap — `tools/dump_function_context.js` now enforces this with a
  regression guard); (2) it both over-merges (multiple real functions in one
  record with spurious "secondary entries", e.g. `0xF734` = 4 functions incl.
  libc `strcat/strcpy/strcmp`) and orphans a read-before-write load preamble onto
  the previous function's tail (true entry precedes the labeled `func_` start;
  seen at `0xD248/0xD600/0xECF0/0xF22C/0xFDB8/0x1054C/0x10E70/0x10FE0`). Always
  validate boundaries from disasm, not the parent record alone.
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
- Codec / libc / vec3 tranche `0x0000F22C..0x00011000` (47 named parts: codec
  workers, libc `strcat/strcpy/strcmp/memset/memcpy`, `boot_io_*` stream I/O, a
  `vec3_*` float math library, text renderer, RNG). Dossier:
  `docs/dossiers/boot-codec-libc-vec3-F22C-11000.md`. **Chunk 0 complete.**
- Chunk 1 library tranche `0x00011000..0x00021000` (350 named parts in `lib/`:
  unit/character-record subsystem, tagged script/command interpreter, float math
  (trig/sqrt/ldexp), libc (`memset`/`memmove`/byte-copy), allocators/free-lists,
  glyph⇄ASCII text encoding, and libultra OS primitives — cache ops, AI audio,
  CPU interrupt mask, virtual→physical). Dossier:
  `docs/dossiers/lib-chunk1-11000-21000.md`. **Chunk 1 complete.**
- Chunk 2 library tranche `0x00021000..0x00031000` (216 named parts in `lib/`:
  the Nintendo SDK **libultra** OS core — exception/scheduler/threads, message
  queues, EPI DMA, CP0 access, RSP control, TLB — plus libc (`mem*`/`str*`/
  `sprintf`/`_Printf`), the `gu` matrix library, math (`sin`/`cos`/`sqrt`/…), the
  compiler 64-bit runtime (`udivmod_u64`/`divmod_s64`/…), MMIO register accessors,
  and an embedded **RSP microcode** data block). Dossier:
  `docs/dossiers/lib-chunk2-21000-31000.md`. **Chunk 2 complete.**
- Chunk 3 source-ownership `0x00031000..0x00041000` (67 parts: a bundle of N64
  RSP microcodes + text-VM jump table + zero-fill/rodata data, and a 23-function
  overlay-relocated code tail; +1 from the chunk-4-run straddler correction).
  Dossier: `docs/dossiers/lib-chunk3-31000-41000.md`. **Chunk 3 source-owned.**
- Chunk 4 source-ownership `0x00041000..0x00051000` (376 parts: 374 conservative
  code `func_*` + 2 straddler markers, 0 data; overlay-relocated,
  frameless-leaf-dense; ~211 frameless leaves recovered). Dossier:
  `docs/dossiers/lib-chunk4-41000-51000.md`. **Chunk 4 source-owned.**
- Chunk 5 source-ownership `0x00051000..0x00061000` (88 parts: 76 code `func_*` +
  1 straddler-tail + 11 data; MIXED — overlay code + ~20 KB game-data tail).
  Dossier: `docs/dossiers/lib-chunk5-51000-61000.md`. **Chunk 5 source-owned.**
- Chunk 6 source-ownership `0x00061000..0x00071000` (78 parts: 60 code `func_*` +
  18 data; MIXED — item/equipment data + PARENT-UNDETECTED code + data tail).
  Dossier: `docs/dossiers/lib-chunk6-61000-71000.md`. **Chunk 6 source-owned.**
- Chunk 7 source-ownership `0x00071000..0x00081000` (103 parts: 80 code `func_*` +
  1 straddler-head + 22 data; MIXED 4-region — blob continuation + parent-undetected
  code + Controller-Pak menu data + parent-detected code).
  Dossier: `docs/dossiers/lib-chunk7-71000-81000.md`. **Chunk 7 source-owned.**
- Chunk 8 source-ownership `0x00081000..0x00091000` (87 parts: 61 code `func_*` +
  2 straddler markers + 24 data; MIXED 3-region — straddler tail + code + game data
  (mission-name/options-menu pools) + code).
  Dossier: `docs/dossiers/lib-chunk8-81000-91000.md`. **Chunk 8 source-owned.**
- Chunk 9 source-ownership `0x00091000..0x000A1000` (34 parts: 32 code `func_*` +
  2 straddler markers + 0 data; ALL CODE — first single-class chunk since chunk 2:
  army-mgmt / F3DEX display-list builders; 1 preamble-orphan fold `func_00095258`;
  2 internal jump-table dispatchers with tables in `0x801F` relocated RAM; 5
  multi-entry fns; adversarial data-hunt found no inline data).
  Dossier: `docs/dossiers/lib-chunk9-91000-A1000.md`. **Chunk 9 source-owned.**
- Chunk 10 source-ownership `0x000A1000..0x000B1000` (35 parts: 33 code `func_*` +
  2 straddler markers + 0 data; ALL CODE — army-mgmt / F3DEX display-list builders;
  3 preamble-orphan folds; 7 recovered frameless leaves (GAP1 + GAP2 cluster + 3
  parent over-merge un-merges incl. the 6,944 B `func_000AB6D8`); 5 jump-table
  dispatchers with tables in `0x801EF…` relocated RAM; 1 multi-entry; adversarial
  pass 0 disproofs, no inline data).
  Dossier: `docs/dossiers/lib-chunk10-A1000-B1000.md`. **Chunk 10 source-owned.**
- Chunk 11 source-ownership `0x000B1000..0x000C1000` (191 parts: 189 code `func_*`
  (112 framed + 77 frameless) + 2 straddler markers + 0 data; ALL CODE — FP-math +
  frameless-leaf-dense char-data code; parent detected only 112 of 189 fns; 4 gap
  clusters + many over-merge un-merges; 9 jump-table dispatchers (tables in `0x801F`
  relocated RAM); gates caught 2 delay-slot leaks, adversarial caught 1 under-split +
  2 missed preamble-orphans; 0 inline data).
  Dossier: `docs/dossiers/lib-chunk11-B1000-C1000.md`. **Chunk 11 source-owned.**
- Chunk 12 source-ownership `0x000C1000..0x000D1000` (74 parts: 72 code `func_*` + 2
  straddler markers + 0 data; ALL CODE — FP-math + dispatcher-heavy char-data code;
  deferred-prologue `func_000C132C`; 12 frameless leaves + ~24 preamble-orphans; 20
  jump-table dispatchers (tables in `0x801F` relocated RAM); adversarial 0 disproofs
  after 3 preamble-orphan fold fixes; 0 inline data).
  Dossier: `docs/dossiers/lib-chunk12-C1000-D1000.md`. **Chunk 12 source-owned.**
- One-shot retroactive audits of chunks 0–11 (parent-evidence + data-inventory):
  0 proven boundary/name mistakes; 8 data-index JSONs under `docs/data-index/rev0/`;
  reports under `docs/audit/`. See review handoff.
- Chunk 13 source-ownership `0x000D1000..0x000E1000` (67 parts: 27 code [26 `func_*`
  + 1 straddler-tail] + 40 data; MIXED — dispatcher-heavy char-data code
  `0xD1000..0xDAB18` + unit/battle-management UI data `0xDAB18..0xE1000`: string
  pools, RAM-pointer tables, IEEE floats, display-list/command stream, + an outgoing
  packed/glyph data straddler into chunk 14; adversarial 0 disproofs).
  Dossier: `docs/dossiers/lib-chunk13-D1000-E1000.md`; data index
  `docs/data-index/rev0/chunk13-data-region-inventory.json`. **Chunk 13 source-owned.**
- Current remainder: none in chunks 0–13 (`0x1000..0xE1000` fully source-owned).
  Next is chunk 14 generated fallback `0x000E1000..0x000F1000`.

Static dossiers live under `docs/dossiers/` and are the durable evidence notes
for each promoted source-layout split.

## Earlier per-split entries (archived 2026-06-21)

The individual boot-segment split entries for the first code chunk
(`boot_resource_node_*` through `boot_resource_loader_callback_register`, plus
the earlier boot/display-list/probe/state-slot splits) were pruned here at the
~10k-token threshold. Full provenance is preserved in
`docs/archive/DECOMP_LOG-full-through-resource-decode-subsystem-2026-06-21.md` (do not read unless a specific older split is needed) and is
summarized in "Source Promotion History" above plus each function's dossier.

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

## Archived chunk narratives (boot subsystems + chunks 1–7)

The detailed per-split narratives for the boot subsystems (`0xB030..0x11000`) and
chunks 1–7 (`0x11000..0x81000`) were moved to
`docs/archive/DECOMP_LOG-2026-06-21-boot-and-chunks1-7.md` to keep this log lean.
Their durable findings live in the per-chunk dossiers (`docs/dossiers/lib-chunk1-…`
… `lib-chunk7-…`, `boot-…`) and the chunk review handoffs. Recent narratives
(chunks 8+) remain below.

## 2026-06-22 - Chunk 8 Split (0x81000..0x91000); chunk 8 complete — MIXED 3-region

Starting state clean at HEAD `f185640` (after `53e4027`). Opening checks PASS: no
stale current-state counts, no root scratch, 0 data files with function wording.

DONE: **87 parts (61 code `func_*` + 2 straddler markers + 24 data)**. Tracked
files 1,455 → **1,542**; fallback 92 → 91. Byte-exact (code SHA `40D4E787…B409`,
ROM `571E8339…CC67A`). Coverage `0x1000..0x91000` = **20.70 %** (code-only ≈
16.11 %). DATA = game data (length-prefixed mission/location-name string pool +
UI/options-menu pool + packed records + RAM-pointer tables). Adversarial pass:
**6/6 regions clean, 0 issues**. STRADDLER-OUT: `func_00090e54_chunk8head`
`[0x90E54,0x91000)` → `0x912F4` in chunk 9. No tool changes. Dossier
`docs/dossiers/lib-chunk8-81000-91000.md`; review
`docs/REVIEW_2026-06-22_chunk08-source-ownership.md`.

CHUNK 8 `0x81000..0x91000` promoted (manifest now 9 chunks, seeded 1 part). Largely
**PARENT-DETECTED** (43 parent fns + 43 overlay fns; first `0x810DC`, last `0x90E54`).
**3-region map** (recon, deterministic):
- STRADDLER+CODE1 `0x81000..0x85818` (18,456 B): first part is the incoming
  function straddler tail `func_0007ffac_chunk8tail` `[0x81000,0x810DC)` (chunk-7
  head `func_0007ffac_chunk7head`; func_0007FFAC true entry 0x7FFAC, ends 0x810DC —
  confirmed jr $ra 0x810D4). Then parent-detected code incl. the giant
  `func_00083C5C` `[0x83C5C,0x851D0)` (display-list builder) and a parent gap
  `0x851D0..0x85684` of FRAMELESS leaves (float-const setup). `plan_chunk`.
- DATA `0x85818..0x87200` (6,632 B): a packed record/offset blob (0x02-0x09/0xFF
  lead bytes) + zero-fill (`0x858bc..0x858e4`) + ASCII strings (`0x85ca8..0x85e8c`)
  + RAM-pointer tables (`0x86728..0x871fc`). Data→code boundary pinned at `0x87200`
  (frameless display-list builder `move $t4,$a1; lui 0x800F; ... E700` begins).
- CODE2 `0x87200..0x91000` (40,448 B): frameless code `0x87200..0x8786C` (3+ leaves,
  returns 0x87398/0x87544/0x876dc) + parent fn `0x8786C` + parent gap `0x87908..
  0x88024` frameless leaves + parent fns to `0x90E54`. `plan_chunk`. STRADDLER-OUT:
  parent fn `0x90E54` ends `0x912F4` → continues into chunk 9; chunk-8 head
  `[0x90E54,0x91000)`.
- Small parent gaps (8 B: 0x8240C/0x82924/0x83078/0x838D0/0x8E728; 64 B 0x83604;
  32 B 0x8D454) = preamble-orphans/alignment inside the code regions.

Method: CODE1 + CODE2 analysis swarms (4+6 slices) + DATA classification swarm
(2 sub-regions) → combine → `check_boundaries` → 6-region adversarial swarm
(6/6 clean) → split. Gates: check_manifest/check_boundaries/check_splits/assemble
byte-exact/verify_setup (9 chunks/1,542/91)/audit all PASS; 0 data files with
function wording. Next file after split: chunk 9 `0x91000`, opening with
`func_00090e54_chunk9tail` `[0x91000,0x912F4)`.

## 2026-06-22 - Chunk 9 Split (0x91000..0xA1000); chunk 9 complete — ALL CODE

Starting state clean at HEAD `da2dd9c`. Opening fixes (commit `d86e9f5`): chunk-8
review-doc placeholder `_(this doc)_` → `da2dd9c`; "chunk-9 head" → "chunk-9 tail
file" wording in AGENTS.md (2), NEXT_STEPS.md, lib-chunk8 dossier, chunk-8 review.
No count/frontier change. 0 root scratch; 0 data files with function wording.

DONE: **34 parts (32 code `func_*` + 2 straddler markers + 0 data)**. Tracked files
1,542 → **1,576**; fallback 91 → 90. Byte-exact (code SHA `40D4E787…B409`, ROM
`571E8339…CC67A`). Coverage `0x1000..0xA1000` = **655,360 B = 23.0015 %** (code-only
≈ 524,572 B = 18.41 %). **ALL CODE — first single-class chunk since chunk 2.**
Adversarial pass: 4 region refuters + 1 dedicated data-hunter, **0 disproofs**;
quantitative data-hunt found max inline pointer-run 1 word, max zero-run 1 word, 0
of 16,384 words undecodable. STRADDLER-OUT: `func_000A0DAC_chunk9head`
`[0xA0DAC,0xA1000)` → `0x000A118C` in chunk 10. No tool changes. Dossier
`docs/dossiers/lib-chunk9-91000-A1000.md`; review
`docs/REVIEW_2026-06-22_chunk09-source-ownership.md`.

CHUNK 9 `0x91000..0xA1000` promoted (manifest 10 chunks, seeded 1 part). Heavily
**PARENT-DETECTED** (33 parent fns, 31 named — `character::char-data consumer`,
F3DEX/RDP display-list builders for army-mgmt/class-change/mission-briefing). Single
all-code region; no interior data. Boundary work:
- STRADDLER-IN: `func_00090e54_chunk9tail` `[0x91000,0x912F4)` (tail of func_00090E54,
  true entry 0x90E54 in chunk 8; ends jr $ra@0x912EC + epilogue addiu $sp,0x30@0x912F0;
  next prologue 0x912F4; frame -0x30 matches chunk-8 parent prologue).
- 32 framed functions `0x912F4..0xA0DAC`, every one single-prologue/single-`jr $ra`.
  Only correction: 1 preamble-orphan — parent labeled `0x95260`, true entry `0x95258`
  (8-byte read-before-write `lui/lw 0x80196AF8`, consumed at 0x952AC); folded →
  `func_00095258 [0x95258,0x96B74)`, `func_000943A0` ends `[0x943A0,0x95258)`.
- 2 internal jump-table dispatchers (NOT boundaries): `jr $v0`@0x96930 (in
  func_00095258, 9-case, table 0x801EF940) and `jr $v0`@0xA06F0 (in func_000A0560,
  7-case, table 0x801F…) — both target tables in relocated overlay RAM, not inline.
- 5 multi-entry fns kept whole (sec 0x92410/0x93A28/0x9437C/0x9DC04/0xA037C).
- STRADDLER-OUT: `func_000A0DAC_chunk9head [0xA0DAC,0xA1000)` (no jr $ra in range;
  last word 0xA0FFC bne, delay slot in chunk 10) → continues to 0x000A118C.

Method: promote → dump_function_context + content-scan (build/scan_chunk9.js) →
plan_chunk (--tail-end 0x912F4) → slice_chunk --disasm (7 slices) → 7-agent analysis
swarm → integrate_chunk → check_boundaries + check_splits → 5-agent adversarial swarm
→ split. Gates: check_manifest/check_boundaries/check_splits/assemble byte-exact/
verify_setup (10 chunks/1,576/90)/audit all PASS; 0 data files with function wording.
Next file after split: chunk 10 `0xA1000`, opening with the straddler tail
`func_000A0DAC_chunk10tail` `[0xA1000,0x000A118C)`.

## 2026-06-22 - Chunk 10 Split (0xA1000..0xB1000); chunk 10 complete — ALL CODE

Opening fix (commit `3746ce1`): chunk-9 review commit-table placeholder
`_(this doc's commit)_` → `b162bfd`. No count/frontier change.

DONE: **35 parts (33 code `func_*` + 2 straddler markers + 0 data)**. Tracked files
1,576 → **1,611**; fallback 90 → 89. Byte-exact (code SHA `40D4E787…B409`, ROM
`571E8339…CC67A`). Coverage `0x1000..0xB1000` = **720,896 B = 25.3016 %** (code-only
≈ 590,108 B = 20.71 %). **ALL CODE** (no inline data — adversarial data-hunt:
16,384/16,384 words decode as MIPS, max pointer-run 1 word, all 5 dispatcher tables
in `0x801EF…` relocated RAM). Same army-mgmt / F3DEX display-list-builder family as
chunk 9, but the parent DB had far more boundary defects:
- STRADDLER-IN: `func_000A0DAC_chunk10tail` `[0xA1000,0xA118C)` (tail of func_000A0DAC,
  true entry 0xA0DAC in chunk 9; ends jr $ra@0xA1184 + epilogue@0xA1188).
- 3 preamble-orphans folded: `func_000A4A00` (parent 0xA4A08), `func_000AB5EC`
  (parent 0xAB5F4), `func_000AEB8C` (parent 0xAEB94) — all read-before-write lui/lw.
- 7 frameless leaves recovered: GAP1 `func_000A71C8` (float-compare); GAP2 cluster
  `func_000AE298`/`func_000AE30C`/`func_000AE384`; over-merge un-merges
  `func_000AB040`, `func_000AB6D8` (6,944 B switch-body), `func_000AD6A0`.
- 5 internal jr$reg dispatchers @0xA5768/0xA84D0/0xAB3D8/0xB04E0/0xB0C50 (tables in
  0x801EF998/F9F8/FA10/FA30/FA70 relocated RAM — NOT boundaries).
- 1 multi-entry `func_000ADA74` (sec 0xADB74).
- STRADDLER-OUT: `func_000B0BFC_chunk10head` `[0xB0BFC,0xB1000)` (true entry 0xB0BFC,
  no jr $ra in range, internal dispatch @0xB0C50) → continues to 0x000B1F00
  (return jr $ra@0xB1EF8 in chunk 11).

Method: promote → dump_function_context + content-scan (build/scan_chunk.js) →
plan_chunk (--tail-end 0xA118C) → slice_chunk --disasm (7 slices) → 7-agent analysis
swarm → integrate_chunk → check_boundaries + check_splits → 5-agent adversarial swarm
(4 region refuters + 1 data-hunter, 0 disproofs, all KEEP-SPLIT) → split. Mid-run
gates: check_manifest/check_boundaries/check_splits/assemble byte-exact/verify_setup
(11 chunks/1,611/89)/diff all PASS; 0 data files with function wording. Next file
after split: chunk 11 `0xB1000`, opening with the straddler tail
`func_000B0BFC_chunk11tail` `[0xB1000,0x000B1F00)`.

## 2026-06-22 - Chunk 11 Split (0xB1000..0xC1000); chunk 11 complete — ALL CODE, frameless-dense

DONE: **191 parts (189 code `func_*` [112 framed + 77 frameless] + 2 straddler
markers + 0 data)**. Tracked files 1,611 → **1,802**; fallback 89 → 88. Byte-exact
(code SHA `40D4E787…B409`, ROM `571E8339…CC67A`). Coverage `0x1000..0xC1000` =
**786,432 B = 27.6018 %** (code-only ≈ 655,644 B = 23.0115 %). **ALL CODE** — FP-math
(`~0xB2500..0xB4640`: cvt.s.w/mul.s/div.s, float constants built in-stream via
lui+mtc1, NOT data) + frameless-leaf-dense char-data/display-list code. The defining
feature: the parent DB detected only **112 of 189** functions; the swarm recovered
**77 frameless leaves** (4 gap clusters gap1 0xB3B00 5 leaves / gap3 0xB8DD8 4 / gap4
0xBA2B4 4 / gap2 0xB86F8, plus many over-merge un-merges). 9 internal jr$reg
dispatchers (tables in 0x801F relocated RAM). STRADDLER-IN
`func_000B0BFC_chunk11tail` `[0xB1000,0xB1F00)`; STRADDLER-OUT
`func_000C0EDC_chunk11head` `[0xC0EDC,0xC1000)` → 0x000C132C in chunk 12.

Corrections (all caught by gates/adversarial): 2 delay-slot leaks (gap4, by
check_boundaries — boundaries shifted +1 word); 1 under-split `func_000b876c`
(adversarial); 2 missed preamble-orphans `func_000bedb8`/`func_000bf248`
(adversarial — analysis agent noted the fold but didn't move the boundary). No tool
changes. Dossier `docs/dossiers/lib-chunk11-B1000-C1000.md`; review
`docs/REVIEW_2026-06-22_chunks10-11-source-ownership.md`.

Method: promote → dump_function_context + content-scan → plan_chunk (--tail-end
0xB1F00) → slice_chunk --disasm (12 slices) → 12-agent analysis swarm →
integrate_chunk → check_boundaries (caught 2 leaks) → 5-agent adversarial swarm
(found under-split + 2 orphans) → re-check → split. Gates: check_manifest/
check_boundaries/check_splits/assemble byte-exact/verify_setup (12 chunks/1,802/88)/
audit all PASS; 0 data files with function wording. Next file after split: chunk 12
`0xC1000`, opening with the straddler tail `func_000C0EDC_chunk12tail`
`[0xC1000,0x000C132C)`.

## 2026-06-23 - Retroactive audits (chunks 0–11) + Chunk 12 Split (0xC1000..0xD1000); chunk 12 complete — ALL CODE

ONE-SHOT AUDITS (commit `a7eafdf`, no `.s` changes): (1) parent-evidence audit of
chunks 0–11 vs parent repo — 3 confirmed leads (squadblob bootstrap @0x283C4 →
editor/squadblob.js; combat action table @0x60988 → MIPS_Decode.md; seed::memcpy_like
@0x23460), 3 rejected (incl. 2 parent over-runs into RSP ucode that vindicate our
boundaries), **0 proven mistakes / no fix required**. (2) data-inventory audit —
130,788 data bytes (parsed 22,408 / raw-but-classified 95,384 / undecoded 12,996), 8
JSON indexes under `docs/data-index/rev0/`, 2 mislabel candidates kept as-is after
cross-reference. Reports under `docs/audit/`.

CHUNK 12 DONE: **74 parts (72 code `func_*` + 2 straddler markers + 0 data)**.
Tracked files 1,802 → **1,876**; fallback 88 → 87. Byte-exact (code SHA
`40D4E787…B409`, ROM `571E8339…CC67A`). Coverage `0x1000..0xD1000` = **851,968 B =
29.9020 %** (code-only ≈ 721,180 B = 25.3118 %). **ALL CODE** — FP-math +
dispatcher-heavy char-data code. STRADDLER-IN `func_000C0EDC_chunk12tail`
`[0xC1000,0xC132C)`; deferred-prologue `func_000C132C [0xC132C,0xC1578)` (parent
labeled 0xC1364); 12 frameless leaves + ~24 preamble-orphans; **20 internal jr$reg
dispatchers** (tables in 0x801F relocated RAM, NOT boundaries); STRADDLER-OUT
`func_000D0B8C_chunk12head [0xD0B8C,0xD1000)` → 0x000D110C in chunk 13.

Corrections (adversarial): 3 unfolded preamble-orphans `func_000c6bec`/`func_000c71e0`/
`func_000c7d00` (analysis agent left the read-before-write lui/lw in the previous
function's tail; folded forward). 0 other disproofs. No tool changes. Method: promote
→ dump_function_context + content-scan → plan_chunk (--tail-end 0xC132C) → slice_chunk
--disasm (8 slices) → 8-agent analysis swarm → integrate → check_boundaries → 5-agent
adversarial swarm → fix → re-check → split. Mid-run gates check_manifest/
check_boundaries/check_splits/assemble byte-exact/diff all PASS; 0 data files with
function wording. Dossier `docs/dossiers/lib-chunk12-C1000-D1000.md`. Next file after
split: chunk 13 `0xD1000`, opening with the straddler tail `func_000D0B8C_chunk13tail`
`[0xD1000,0x000D110C)`.

## 2026-06-23 - Chunk 13 Split (0xD1000..0xE1000); chunk 13 complete — MIXED (code + data)

DONE: **67 parts (27 code [26 `func_*` + 1 straddler-tail] + 40 data)** — the first
MIXED chunk since chunk 8. Tracked files 1,876 → **1,943**; fallback 87 → 86.
Byte-exact (code SHA `40D4E787…B409`, ROM `571E8339…CC67A`). Coverage
`0x1000..0xE1000` = **917,504 B = 32.2021 %** (code-only ≈ 760,884 B = 26.70 %; +25,832
data bytes). Two regions: CODE `0xD1000..0xDAB18` (39,704 B, dispatcher-heavy
char-data: 26 fns + straddler-tail, 13 preamble-orphans, 6 frameless leaves, ~17
jr$reg dispatchers w/ 0x801F RAM tables) then DATA `0xDAB18..0xE1000` (25,832 B,
unit/battle-management UI data: 2 string pools (rodata) + 10 RAM-pointer tables + 5
zero-fill + 23 packed/record data; IEEE floats; a display-list/command stream
`data_000de250`; + an OUTGOING packed/glyph DATA straddler `data_000e0bd0_chunk13head`
`[0xE0BD0,0xE1000)` → continues into chunk 14). Code→data boundary `0xDAB18`
adversarially confirmed.

STRADDLER-IN `func_000D0B8C_chunk13tail [0xD1000,0xD110C)`. Adversarial swarm: 1
code-boundary + 2 data-classification agents, **0 disproofs** (code 27 fns ↔ 27 jr$ra
1:1; data 100% data, all classes + boundaries confirmed; straddler runs to 0xE1000).
No tool changes. Method: code = dump_function_context+plan_chunk (--tail-end 0xD110C,
--end 0xDAB18) + slice_chunk --disasm (3 slices) + 3-agent code swarm; data = 4-agent
data-classification swarm over [0xDAB18,0xE1000); combine → check_boundaries +
check_splits → adversarial → split. Full gates: check_manifest/check_boundaries/
check_splits/assemble byte-exact/verify_setup (14 chunks/1,943/86)/audit all PASS; 0
data files with function wording; data-index JSON valid. Dossier
`docs/dossiers/lib-chunk13-D1000-E1000.md`; data index
`docs/data-index/rev0/chunk13-data-region-inventory.json`; review
`docs/REVIEW_2026-06-23_chunks12-13-source-ownership.md`. Next file after split: chunk
14 `0xE1000`, opening with the OUTGOING DATA straddler tail `data_000e1000_chunk14tail`
`[0xE1000,?)` (continuation of the packed/glyph blob).

## Current Dossier Set

The current boot/source-layout dossier list is long; use `docs/PLATFORM.md` for
the full quick index. The newest dossiers are:

- `docs/dossiers/lib-chunk13-D1000-E1000.md` (67-part chunk-13: MIXED — dispatcher-heavy char-data code (0xD1000..0xDAB18) + unit-mgmt UI data (0xDAB18..0xE1000: string pools, RAM-pointer tables, floats, display-list stream, + outgoing packed/glyph data straddler); 27 code + 40 data; chunk 13 done)
- `docs/dossiers/lib-chunk12-C1000-D1000.md` (74-part chunk-12: ALL CODE — FP-math + dispatcher-heavy char-data code; deferred-prologue func_000C132C, 12 frameless leaves, ~24 preamble-orphans, 20 RAM-table dispatchers, 0 data; chunk 12 done)
- `docs/dossiers/lib-chunk11-B1000-C1000.md` (191-part chunk-11: ALL CODE — FP-math + frameless-leaf-dense char-data code; 112 framed + 77 recovered frameless; 4 gap clusters, 9 RAM-table dispatchers, 0 data; gates+adversarial caught 2 leaks/1 under-split/2 orphans; chunk 11 done)
- `docs/dossiers/lib-chunk10-A1000-B1000.md` (35-part chunk-10: ALL CODE — army-mgmt / F3DEX display-list builders; 3 preamble-orphans, 7 recovered frameless leaves (incl. 6,944 B func_000AB6D8), 5 RAM-table dispatchers, 1 multi-entry, 0 data; chunk 10 done)
- `docs/dossiers/lib-chunk9-91000-A1000.md` (34-part chunk-9: ALL CODE — army-mgmt / F3DEX display-list builders; 1 preamble-orphan, 2 RAM-table dispatchers, 5 multi-entry, 0 data; chunk 9 done)
- `docs/dossiers/lib-chunk8-81000-91000.md` (87-part chunk-8: MIXED 3-region — straddler tail + code + game data (mission-name/options-menu pools) + code; chunk 8 done)
- `docs/dossiers/lib-chunk7-71000-81000.md` (103-part chunk-7: MIXED 4-region — blob + parent-undetected code + Controller-Pak menu data + parent-detected code; chunk 7 done)
- `docs/dossiers/lib-chunk6-61000-71000.md` (78-part chunk-6: MIXED — item/equipment data + PARENT-UNDETECTED code + data tail; chunk 6 done)
- `docs/dossiers/lib-chunk5-51000-61000.md` (88-part chunk-5: MIXED — overlay code + game-data tail (display-list/string-pools/record-tables); chunk 5 done)
- `docs/dossiers/lib-chunk4-41000-51000.md` (376-part chunk-4: overlay-relocated, frameless-leaf-dense code; all conservative `func_*`; chunk 4 done)
- `docs/dossiers/lib-chunk3-31000-41000.md` (67-part chunk-3: RSP microcode bundle + text-VM tables + overlay code tail; data-dominant)
- `docs/dossiers/lib-chunk2-21000-31000.md` (216-file chunk-2 libultra/libc/gu library; chunk 2 done)
- `docs/dossiers/lib-chunk1-11000-21000.md` (350-function chunk-1 library; chunk 1 done)
- `docs/dossiers/boot-codec-libc-vec3-F22C-11000.md` (47-function tranche; chunk 0 done)
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

Chunks 0–13 (`0x00001000..0x000E1000`) are fully source-owned as named code/data
parts (chunk 10: 33 code + 2 straddler + 0 data, ALL CODE; chunk 11: 189 code + 2
straddler + 0 data, ALL CODE — 77 frameless leaves recovered; chunk 12: 72 code + 2
straddler + 0 data, ALL CODE — 20 dispatchers; chunk 13: 27 code + 40 data, MIXED —
unit-mgmt UI data). The next frontier is **`0x000E1000` (chunk 14)**. Coverage
`0x1000..0xE1000` = 917,504 B = 32.2021% of the 2,849,204-byte executable extent
(code-only ≈ 760,884 B = 26.70%; +25,832 chunk-13 data bytes).

FIRST: continue the OUTGOING DATA straddler from chunk 13. The packed/glyph data blob
`data_000e0bd0_chunk13head` `[0xE0BD0,0xE1000)` continues past the chunk boundary;
chunk 14's first file is its tail `data_000e1000_chunk14tail` `[0xE1000,?)`. Determine
its end from the chunk-14 bytes (high-byte-dense packed/glyph/compressed data with no
terminator) before classifying the rest.

Then classify chunk 14's code/data mix. Chunk 13 ended data-heavy, so chunk 14 may
continue as data or resume code — content-scan for DATA regions FIRST. `plan_chunk`
(+`dump_function_context`) seeds parent-detected code; use `scan_functions`
for parent-undetected sub-regions; data-classification swarm for data regions.
Pipeline tools: `scan_functions`
or `plan_chunk`/`slice_chunk --disasm`/`integrate_chunk` (context optional)/
`check_splits`/`check_boundaries` + analysis + adversarial swarms (Agent-tool, one
per slice/region). Default **conservative `func_*`**.

There are now two active tracks. The library source-ownership track continues at
`0xE1000` (chunk 14) as above. The full-ROM coverage track (opened 2026-06-21) next refines
the exact code/data boundary near `0x002B89B4` and reclassifies the non-code tail
`0x002B89B4..0x0063676C` from `original_mips` to a data source form, shrinking the
configured code region to the executable extent while keeping the exact rebuild
gate green. See `docs/CODE_REGION_AUDIT.md` and `docs/NEXT_STEPS.md`.
