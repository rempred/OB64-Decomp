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
- Current tracked code source mix: thirty composite real-assembler chunks
  (chunk 0 177 `boot/`; chunks 1–29 in `lib/`: 350, 216, 67, 376, 88, 78, 103, 87, 34, 35, 191, 74, 67, 94, 153, 95, 66, 95, 80, 175, 99, 99, 73, 63, 71, 96, 142, 97, 103) =
  **3,544 tracked source files**, plus 70 generated fallback code chunks. **Chunks
  0–29 (`0x00001000..0x001E1000`) are now fully source-owned as named code/data
  parts** (chunk 13: 27 code + 40 data, MIXED — unit-mgmt UI data; chunk 14: 74 code + 20
  data, MIXED — graphics/display-list data + DL-builder code; chunk 15: 134 code + 19
  data, MIXED — floats/display-list data + the OB64 opening-narration rodata; chunk 16: 72
  code + 23 data, MIXED — leading scenario record/pointer/float64 data + the
  neutral-encounter code path; chunk 17: 66 code + 0 data, ALL CODE — char-data/encounter
  code; chunk 18: 95 code + 0 data, ALL CODE — FP-heavy scenario/combat code; chunk 19: 64
  code + 16 data, MIXED — encounter/dispatcher code + a trailing scenario data region with
  an outgoing data straddler; chunk 20: 89 code + 86 data, MIXED — scenario data tables
  [neutral_encounter 40×20, creature_drop 36×8] + a 125-string game-text pool +
  encounter/dispatcher code; chunk 21: 94 code + 5 data, MIXED — class/character-lookup code
  + a trailing high-entropy/compressed data region with an outgoing data straddler; chunk 22:
  35 code + 64 data, MIXED — UI/text + weapon-type/terrain resource data wrapping FP-heavy
  menu/item/legion code, with incoming AND outgoing DATA straddlers; chunk 23: 40 code + 33
  data, MIXED 6-region — scenario/camera + char-data code interleaved with TWO large data
  islands the parent DB mislabeled as functions [refuted byte-exactly], ending in the outgoing
  FUNCTION straddler func_0017FF4C; chunk 24: 40 code + 23 data, MIXED — FP/menu/display code
  wrapping a large ~26.7KB interior DATA region [font/tile bitmaps + fixed-stride record tables +
  0x8021 pointer tables + float64 pool] the parent DB again missed, with incoming AND outgoing
  FUNCTION straddlers; chunk 25: 59 code + 12 data, CODE-dominant MIXED — char/class/scenario
  code [incl. the documented record-builder func_0019554C, hook @0x195584] + a shop-dialogue
  string pool + 2 inline data islands, with incoming AND outgoing FUNCTION straddlers; chunk 26:
  81 code + 15 data, CODE-dominant MIXED - FP-heavy char/class/scenario/encounter code + 3 inline
  DATA islands; chunk 27: 128 code + 14 data, CODE-dominant MIXED - FP-heavy class/char/encounter/
  resource code + status/menu string table island + display-list/float/color-LUT island, with
  incoming AND outgoing FUNCTION straddlers; chunk 28: 73 code + 22 data + 2 function
  straddlers, MIXED - stronghold/tutorial text, pointer/GBI-like data, packed command/script
  blobs, and recovered frameless helpers; chunk 29: 97 normal code + 4 zero-fill data + 2
  function straddlers, CODE-dominant MIXED - dense world-map/resource code with tiny alignment
  data and recovered frameless helpers); next is chunk 30 (`0x001E1000`, still a generated
  fallback chunk). The promote-tool merge blocker is FIXED.
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
- Chunk 14 source-ownership `0x000E1000..0x000F1000` (94 parts: 74 code [73 `func_*`
  + 1 straddler-head] + 20 data; MIXED, 4 interleaved regions — graphics/display-list
  DATA `0xE1000..0xE48F0` + DL-builder/char-data CODE `0xE48F0..0xEAEFC` + pointer-table
  DATA island `0xEAEFC..0xEBBB0` + char-data/FP CODE `0xEBBB0..0xF1000`; incoming data
  straddler from chunk 13 + outgoing FUNCTION straddler into chunk 15; adversarial
  caught 2 boundary fixes: data→code at 0xE48F0 (3 frameless DL builders) + a 0xEBBB0
  preamble-orphan).
  Dossier: `docs/dossiers/lib-chunk14-E1000-F1000.md`; data index
  `docs/data-index/rev0/chunk14-data-region-inventory.json`. **Chunk 14 source-owned.**
- Chunk 15 source-ownership `0x000F1000..0x00101000` (153 parts: 134 code + 19 data,
  MIXED, 5 interleaved regions — incoming FUNCTION straddler-tail + CODE R1 + floats/
  display-list DATA + CODE R2 + tail DATA with the OB64 opening-narration rodata + an
  outgoing DATA straddler into chunk 16; deterministic gate caught 6 unmerged defects,
  adversarial swarm found 3 more R1 fixes, R2 + both data regions 0 disproofs).
  Dossier `docs/dossiers/lib-chunk15-F1000-101000.md`; data index
  `docs/data-index/rev0/chunk15-data-region-inventory.json`. **Chunk 15 source-owned.**
- Chunk 16 source-ownership `0x00101000..0x00111000` (95 parts: 72 code + 23 data,
  MIXED — leading scenario DATA [record-table tail + 0x801A pointer/jump tables + float64
  const pool] + the neutral-encounter CODE path; outgoing FUNCTION straddler
  func_00110160 into chunk 17; adversarial 0 structural disproofs, 1 data-note evidence
  fix). Dossier `docs/dossiers/lib-chunk16-101000-111000.md`; data index
  `docs/data-index/rev0/chunk16-data-region-inventory.json`. **Chunk 16 source-owned.**
- Chunk 17 source-ownership `0x00111000..0x00121000` (66 parts: 66 code + 0 data, ALL
  CODE — char-data/encounter code; incoming straddler-tail func_00110160_chunk17tail +
  ~64 functions + outgoing straddler-head func_00120FC4 into chunk 18; adversarial 0
  disproofs). Dossier `docs/dossiers/lib-chunk17-111000-121000.md`; no data index (all
  code). **Chunk 17 source-owned.**
- Chunk 18 source-ownership `0x00121000..0x00131000` (95 parts: 95 code + 0 data, ALL
  CODE — FP-heavy scenario/combat code; incoming straddler-tail func_00120FC4_chunk18tail +
  ~93 functions + outgoing straddler-head func_00130E60 into chunk 19; adversarial 1 fix —
  missed frameless leaf at 0x12ECDC). Dossier `docs/dossiers/lib-chunk18-121000-131000.md`;
  no data index (all code). **Chunk 18 source-owned.**
- Chunk 19 source-ownership `0x00131000..0x00141000` (80 parts: 64 code + 16 data, MIXED
  — encounter/dispatcher code [0x131050..0x13C49C, incl. the neutralEncounterDispatcher
  @0x13C068 named func_0013C060] + a trailing DATA region [0x13C49C..0x141000] with an
  outgoing data straddler into chunk 20; adversarial 0 disproofs — the data-hunter refuted
  the parent's "combat code in the gap" [linear-map fallacy]). Dossier
  `docs/dossiers/lib-chunk19-131000-141000.md`; data index
  `docs/data-index/rev0/chunk19-data-region-inventory.json`. **Chunk 19 source-owned.**
- Current remainder: none in chunks 0-29 (`0x1000..0x1E1000` fully source-owned).
  **Current frontier: `0x001E1000` (chunk 30).** Next is chunk 30 generated fallback
  `0x001E1000..0x001F1000`; first continue outgoing FUNCTION straddler
  `func_001E0FC8` as `func_001E0FC8_chunk30tail`.

Static dossiers live under `docs/dossiers/` and are the durable evidence notes
for each promoted source-layout split.

## Earlier per-split entries (archived 2026-06-21)

The individual boot-segment split entries for the first code chunk
(`boot_resource_node_*` through `boot_resource_loader_callback_register`, plus
the earlier boot/display-list/probe/state-slot splits) were pruned here at the
~10k-token threshold. Full provenance is preserved in
`docs/archive/DECOMP_LOG-full-through-resource-decode-subsystem-2026-06-21.md` (do not read unless a specific older split is needed) and is
summarized in "Source Promotion History" above plus each function's dossier.

## Pruned: 2026-06-21 code-region audits + chunks 8–13 detail

The full dated entries for the 2026-06-21 code-region extent audits and the chunk 8–13
splits were archived here on 2026-06-23 to keep this log under the ~10k-token threshold:
`docs/archive/DECOMP_LOG-2026-06-23-audits-and-chunks8-13.md`. Durable facts are preserved
there, in each `docs/dossiers/lib-chunk*` dossier, and in `docs/CODE_REGION_AUDIT.md`.
Chunks 0–13 are fully source-owned; recent detail (chunks 14–17) and the current frontier
are below.

## 2026-06-23 - Chunk 25 Split (0x191000..0x1A1000); chunk 25 complete — CODE-dominant MIXED (char/class/scenario code + shop-dialogue string pool + inline data islands)

DONE: **71 parts (59 code + 12 data)**. Tracked files 3,035 → **3,106**; fallback 75 → 74.
Byte-exact (code SHA `40D4E787…B409`, ROM `571E8339…CC67A`). Coverage `0x1000..0x1A1000` =
**1,703,936 B = 59.8039 %** (code-only = 1,389,036 B = 48.7517 %; +2,368 data bytes). Regions:
incoming FUNCTION straddler-tail func_0018FB30_chunk25tail [0x191000,0x191174) (jr$ra@0x19116C) →
char/class/scenario CODE1 `0x191000..0x19BFF0` (40+ funcs incl. the parent-documented,
in-game-proven **record-builder func_0019554C** [hook @0x195584, builds 52B enemy record from
enemydat template; name conservative], huge func_001960A8 [5776B], dispatcher func_001977E0
[preamble-orphan, 4580B, jr$v0]; 9 preamble-orphans, 4 frameless leaves; 2 inline data islands
data_001952E8 [Soldier/Thrust/Target Unit labels + 0x8021 ptr table] + data_00197738 [Mitsuiye /
"No free space on TCharacterEnemyData." / "...EnemySolderData." debug strings + 0x80215A ptr
table]) → shop-dialogue STRING POOL `0x19BFF0..0x19C760` (rodata_0019BFF0: 47 strings, "What's
today's special?" etc. with {T05} tokens; + 6 handler/jump-pointer tables [0x8021/0x8016 band] +
zero pad) → CODE2 `0x19C760..0x1A1000` (preamble-orphan entry func_0019C760 + func_0019E2E0
[5456B]) ending in outgoing FUNCTION straddler-head func_001A0264 [0x1A0264,0x1A1000) → chunk 26
(no jr$ra before 0x1A1000). Method: parent-evidence sweep + proret scan → slice_extract → 9 code
+ 1 data agents (Workflow) → combine_chunk.js → 4 cross-slice preamble folds (func_00191E50,
func_0019AF78, + e1s1 internal) + 6 preamble-orphan label fixes + 1 name fix (func_0019B718→
func_0019B710) → check_boundaries PASS + check_splits 0 frag → 6-agent adversarial swarm (0
boundary moves; LOW fixes: 2 note ASCII transcriptions, 1 stale file field, string-pool tables
reclassified as handler-pointer arrays). Gates check_manifest (26/3,106/74)/check_boundaries/
check_splits/rebuild byte-exact/assemble byte-exact/verify_setup/audit all PASS; git diff --check
clean; 0 data files with function wording; data-index JSON valid. Dossier
`docs/dossiers/lib-chunk25-191000-1A1000.md`; data index
`docs/data-index/rev0/chunk25-data-region-inventory.json` + 3 decoded ASCII exports
(chunk25-dialogue-pool-19BFF0, chunk25-ui-labels-1952E8, chunk25-debug-strings-197738). Next file
after split: chunk 26 `0x1A1000`, opening with the tail of func_001A0264 (`func_001A0264_chunk26tail`).

## 2026-06-23 - Chunk 24 Split (0x181000..0x191000); chunk 24 complete — MIXED (FP/menu/display code wrapping a large ~26.7KB interior data region)

DONE: **63 parts (40 code + 23 data)**. Tracked files 2,972 → **3,035**; fallback 76 → 75.
Byte-exact (code SHA `40D4E787…B409`, ROM `571E8339…CC67A`). Coverage `0x1000..0x191000` =
**1,638,400 B = 57.5038 %** (code-only = 1,325,868 B = 46.5347 %; +26,936 data bytes). **3
ROM-ordered regions:** CODE1 `0x181000..0x1822E4` (incoming FUNCTION straddler-tail
func_0017FF4C_chunk24tail [0x181000,0x181118) ending jr$ra@0x181110+delay addiu $sp,0x88; FP/menu
code; 5 preamble-orphans incl. the ~15-word hoisted-const preamble func_0018197C [adversarially
confirmed ONE function]) → **DATA `0x1822E4..0x188B60` (~26,748 B, 22 parts)**: font/tile bitmap
stream (data_001825F0, 0x02-fill + 0x78 glyph markers) + packed/high-entropy blocks + fixed-stride
RECORD tables (data_00185950 363×0x10, data_00187000 177×0x10; invariant cols 0xFFFB0000@+4 /
0xFFFFFFFF@+0xC) + 0x8021 RAM-pointer tables (table_00187B10 16 ptrs, table_001888D8 140 ptrs) +
float64 pool (float_00188B10 10 doubles) → CODE2 `0x188B60..0x191000` (frameless DL-builder leaf
func_00188B60; huge func_00189778 [8788B, 1 prologue/1 return]; 10 preamble-orphans; inline data
island data_0018F044 [UI labels Soldier/Remove + 0x8021 pointer mini-table]; ends in outgoing
FUNCTION straddler-head func_0018FB30 [0x18FB30,0x191000) -> chunk 25, jr$ra at 0x19116C).
**PARENT-DB CORRECTION:** the parent functions DB MISSED the ~26.7KB interior data region
(labeled code throughout, same failure as chunk 23); byte-exact proret scan + 3 adversarial data
verifiers prove 0 prologues/0 jr$ra across [0x1822E4,0x188B60). The parent "9028B orphan"
func_00189778 IS code (1 prologue + multiple returns). Method: parent-evidence sweep + proret
scan (derived the 3-region map) → slice_extract (own byte-exact slices, NOT parent-DB-seeded) →
8 code + 6 data agents (Workflow) → combine_chunk.js → 3 cross-slice preamble folds
(func_00181B54, func_0018BAB4, func_0018DC84) → check_boundaries PASS + check_splits 0 frag →
6-agent adversarial swarm (ALL CLEAN; only 1 LOW cosmetic note, no re-tiling) → split
--remove-source (2 folded parts renamed to match names + manifest fixed). Also fixed (cleanup
commit e5f1f57): the split tool now strips false-function labels from data parts, and 2 prior
data files (table_00177B44, zero_fill_00145204) were cleaned of embedded func_X: labels. Gates
check_manifest (25/3,035/75)/check_boundaries/check_splits/rebuild byte-exact/assemble
byte-exact/verify_setup/audit all PASS; git diff --check clean; 0 data files with function
wording; data-index JSON valid. Dossier `docs/dossiers/lib-chunk24-181000-191000.md`; data index
`docs/data-index/rev0/chunk24-data-region-inventory.json` + 1 decoded UI-label export
(`chunk24-ui-labels-18F044`). Next file after split: chunk 25 `0x191000`, opening with the tail
of the outgoing FUNCTION straddler `func_0018FB30_chunk25tail`.

## 2026-06-23 - Chunk 23 Split (0x171000..0x181000); chunk 23 complete — MIXED, 6 regions (scenario/camera + char-data code + two large data islands)

DONE: **73 parts (40 code + 33 data)**. Tracked files 2,899 → **2,972**; fallback 77 → 76.
Byte-exact (code SHA `40D4E787…B409`, ROM `571E8339…CC67A`). Coverage `0x1000..0x181000` =
**1,572,864 B = 55.2036 %** (code-only = 1,287,268 B = 45.1799 %; +27,456 data bytes). **6
ROM-ordered regions:** leading DATA `0x171000..0x171EA0` (incoming straddler-tail
`data_00171000_chunk23tail`, ends 0x171C48; float64 pool + 0x8021 pointer tables + {Cn} tokens)
→ scenario/camera CODE1 `0x171EA0..0x175F28` (22 code +1 inline zero_fill; leads `func_00173D50`
camera-transition begin, `func_001742D0` stepSetup; recovered frameless leaf `func_00171F10`;
7 preamble-orphans; func_001742D0 ends 0x17456C correcting the DB) → DATA island1
`0x175F28..0x177ED0` (10 parts; packed halfword/byte-index maps + a 408B tutorial help-message
rodata @0x1779A0 + a 224-entry 0x8021 pointer table) → char-data CODE2 `0x177ED0..0x17BCD0`
(14 parts; preamble-orphan entry func_00177ED0 [lui/lw $a0,0x8022]; func_00178A44 5932B single
fn; func_0017A660 ends 0x17B984 correcting the DB; func_0017B984 jr $v0 dispatch internal) →
DATA island2 `0x17BCD0..0x17F9C0` (14 parts, largest; packed/high-entropy [possibly compressed/
graphics] + float64 pool + 0x801 pointer table) → CODE3 `0x17F9C0..0x181000` (4 parts;
preamble-orphan entry func_0017F9C0 [lui/lbu $v0,0x8021]; ends in the outgoing FUNCTION
straddler-head `func_0017FF4C`). **PARENT-DB CORRECTION (headline):** the parent functions DB
lists ~35 "functions" across [0x171EA0,0x181000] but the two data islands (8104B + 15600B) have
**0 prologues / 0 jr$ra** (proven by independent byte-exact scan AND two adversarial data-island
verifiers); the parent `func_00177D20` is a 0x80218D00 pointer run (false positive, absorbed
into table_00177B44). Method: parent-evidence sweep + byte-exact prologue map (derived the real
6-region map) → 8 code + 3 data agents (Workflow) → combine_chunk.js (data names →
<kind>_<addr>, descriptive tokens folded into notes; kinds normalized; inline island
func_00173D48 → zero_fill_00173D48) → check_boundaries PASS + check_splits 0 frag → 6-agent
adversarial swarm (3 code + 3 data): **4 CLEAN, 2 low fixes** — func_0017FA04 frameless-leaf→
prologue (it is framed -0x48 saving $ra/$s0-$s3); zero_fill_00177918 split into zero_fill +
data_00177928 (0x15-band index) + zero_fill_00177980. The outgoing straddler revised from
func_0017FF54 to **func_0017FF4C** (the c3s2 analyzer found the read-before-write preamble 8
bytes earlier; 0 jr$ra in [0x17FF4C,0x181000) confirmed — continues into chunk 24). Gates
check_manifest (24/2,972/76)/check_boundaries/check_splits/rebuild byte-exact/assemble
byte-exact/verify_setup/audit all PASS; git diff --check clean; 0 data files with function
wording; data-index JSON valid. Dossier `docs/dossiers/lib-chunk23-171000-181000.md`; data index
`docs/data-index/rev0/chunk23-data-region-inventory.json` + 1 decoded help-message export
(`chunk23-help-message-text`). Next file after split: chunk 24 `0x181000`, opening with the tail
of the outgoing FUNCTION straddler `func_0017FF4C` (CODE, not data).

## 2026-06-23 - Chunk 22 Split (0x161000..0x171000); chunk 22 complete — MIXED (UI/text + type-name/terrain resource data wrapping FP-heavy menu code)

DONE: **99 parts (35 code + 64 data)**. Tracked files 2,800 → **2,899**; fallback 78 → 77.
Byte-exact (code SHA `40D4E787…B409`, ROM `571E8339…CC67A`). Coverage `0x1000..0x171000` =
**1,507,328 B = 52.9035 %** (code-only = 1,249,188 B = 43.8434 %; +25,648 data bytes). Regions
(chunk begins AND ends in DATA): incoming DATA straddler-tail `data_00161000_chunk22tail`
[0x161000,0x161388) (chunk-21 packed-byte stream, ends byte-exact at 0x161388) → leading DATA
`0x161000..0x165FC0` (54 parts; packed/bitmap blobs + `0x801F/0x8021` pointer & float pools +
decoded ASCII pools: weapon/armor type-name table @0x163FC0, terrain+battle/legion/item UI
message pool @0x1650A0, `{Cn}` tokens, stat-label abbreviations) → CODE `0x165FC0..0x16FB90`
(35 parts; FP-heavy menu/item/legion routines, 10 preamble-orphans incl. entry `func_00165FC0`
[data→code at the `lui/lw $v1` read-before-write pair] and the lower-confidence `$a0` fold
`func_0016A56C`; 7 frameless leaves; `j 0x8021xxxx` overlay tail-jumps + `jr $reg` dispatch
internal; growth-table-consumer lead near `func_00167DE0`) → trailing DATA `0x16FB90..0x171000`
(10 parts; UI strings + GBI/RDP display-list data + outgoing `0xF83E`-family packed straddler
`data_001708C8_chunk22head` into chunk 23). Method: parent-evidence sweep + content scan
(data/code/data boundaries 0x165FC0 & 0x16FB90) → 6 code + 3 data agents (Workflow) →
combine_chunk.js (data names → <kind>_<addr>; kinds normalized) → check_boundaries PASS +
check_splits 0 frag → 6-agent adversarial swarm (3 code + 3 data): **all CLEAN** — fixes were
1 kind correction (`func_0016C8B8` frameless-leaf→prologue, it is framed), 1 rodata-seam merge
(weapon-type table spanning 0x164000), and 4 note-accuracy nits (`data_001614B8` first word
`0xE000EE0E`; `data_00161388` +1 trailing zero word; `table_001641C4` 20 not 21 pointers;
`float_00165E00` first double 8.0833 not 8.16667, recomputed). Verifiers independently
confirmed both data regions have 0 prologues/returns and the data/code seams are byte-exact.
Gates check_manifest (23/2,899/77)/check_boundaries/check_splits/rebuild byte-exact/assemble
byte-exact/verify_setup/audit all PASS; git diff --check clean; 0 data files with function
wording; data-index JSON valid. Parent-evidence corrections: runtime slots are 0x8021xxxx (not
the symbols_v2 0x801d5xxx linear back-map); the 0x1650A0 pool is terrain+UI text (NOT a
weapon-name table — that is the smaller @0x163FC0 type-name block). Dossier
`docs/dossiers/lib-chunk22-161000-171000.md`; data index
`docs/data-index/rev0/chunk22-data-region-inventory.json` + 3 decoded string-pool exports
(`chunk22-equipment-type-name-table`, `chunk22-ui-string-pool`, `chunk22-trailing-ui-strings`).
Next file after split: chunk 23 `0x171000`, opening with `data_00171000_chunk23tail`
(continuation of the `0xF83E` packed-halfword straddler).

## 2026-06-23 - Chunk 21 Split (0x151000..0x161000); chunk 21 complete — MIXED (class/character-lookup code + trailing high-entropy data)

DONE: **99 parts (94 code [incl. 1 incoming straddler-tail] + 5 data)**. Tracked files 2,701
→ **2,800**; fallback 79 → 78. Byte-exact (code SHA `40D4E787…B409`, ROM `571E8339…CC67A`).
Coverage `0x1000..0x161000` = **1,441,792 B = 50.6033 %** (code-only ≈ 1,209,308 B =
42.4437 %; +5,148 data bytes). Regions: incoming straddler-tail `func_00150550_chunk21tail`
[0x151000,0x15105C) → CODE `0x15105C..0x15FBF0` (93 parts; class/character lookup, 17
preamble-orphans, 23 frameless leaves, jr$v0 dispatchers 0x153910/0x155554 internal; the
`classLookup_full` lead @0x1591FC kept as `func_001591FC`) → trailing high-entropy DATA
`0x15FBF0..0x161000` (5 parts; possibly compressed) with outgoing straddler-head
`data_0015FDF8_chunk21head` into chunk 22. Method: parent context + content scan (code/data
boundary 0x15FBF0 at last fn jr$ra@0x15FBE8) → 7 code + 1 data agent (Workflow) →
combine_chunk.js (data names → <kind>_<addr>; kinds normalized) → check_boundaries PASS +
check_splits 0 frag → 4-agent adversarial swarm (3 code + 1 data): **1 fix** — missed
frameless leaf at 0x15F838 (func_0015F694 over-merged a no-prologue leaf across its
epilogue@0x15F830; split off func_0015F838); data-hunter CONFIRMED no hidden code in the
data region (0 prologues/returns). Gates check_manifest (22/2,800/78)/check_boundaries/
check_splits/assemble byte-exact/verify_setup/audit all PASS; 0 data files with function
wording; data-index JSON valid. Parent-evidence: classLookup_full @0x1591FC (runtime
0x8020808C, snapshot-verified) recorded as a LEAD; runtime-override hook @0x1574B8; 0x15FBF0
= editor overlay stub-cave (not a function). Dossier
`docs/dossiers/lib-chunk21-151000-161000.md`; data index
`docs/data-index/rev0/chunk21-data-region-inventory.json`. Next file after split: chunk 22
`0x161000`, opening with `data_00161000_chunk22tail` (continuation of the packed-byte
straddler).

## 2026-06-23 - Chunk 20 Split (0x141000..0x151000); chunk 20 complete — MIXED (scenario data tables + encounter/dispatcher code)

DONE: **175 parts (89 code + 86 data)**. Tracked files 2,526 → **2,701**; fallback 80 →
79. Byte-exact (code SHA `40D4E787…B409`, ROM `571E8339…CC67A`). Coverage `0x1000..0x151000`
= **1,376,256 B = 48.3032 %** (code-only ≈ 1,148,920 B = 40.3242 %; +20,328 data bytes).
Regions: leading DATA `0x141000..0x145210` (84 parts) → CODE `0x145210..0x151000` (89 parts
incl. an inline data island `data_0014DE88` [0x14DE88,0x14EBE0]). Incoming straddler-tail
`data_00141000_chunk20tail` [0x141000,0x1416A0) (chunk-19 packed-byte continuation). Outgoing
straddler-head `func_00150550` [0x150550,0x151000) → 0x15105C in chunk 21.

DATA highlights (all decoded/indexed): **neutral_encounter_table** `table_00141ED0`
[0x141ED0,0x142200) 40×20 (HIGH conf, byte-verified) and **creature_drop_table**
`table_00142258` [0x142258,0x142378) 36×8 (Hawkman class 0x27 → 0x31/0x9B/0xE8) — both
decoded to JSON + MD via new durable `tools/decode_ob64_tables.js`; a **125-string game-text
pool** `rodata_001432E4` [0x1432E4,0x1449F0] (5900B: "Legion led by…"/"Winning condition…")
decoded via `decode_rodata_strings.js` (0x81xx control codes preserved); + 0x801A/0x801B
RAM-pointer tables, float/double const pools, display-list/graphics blocks, debug strings.

Method: content-scan region map → 3 data + 7 code-slice agents (Workflow) → combine
(data names → <kind>_<addr>; neutral-table boundary aligned to documented 816B; kinds
normalized) → check_boundaries PASS + check_splits 0 true frags → 5-agent adversarial swarm
(3 code + 2 data): **1 disproof** — data-hunter found HIDDEN CODE at 0x145210 mis-classified
as data_00145210; reclassified as func_00145210 + func_00145280 (frameless leaves), data→code
boundary moved 0x145290→0x145210 → re-gate → split. Gates check_manifest (21/2,701/79)/
check_boundaries/check_splits/assemble byte-exact/verify_setup/audit all PASS; 0 data files
with function wording; all data-index JSON valid. Parent-evidence: both tables independently
documented (docs/neutral-encounters.md, drop-table.md, editor/parsers.js, table_map.json);
code overlay-relocated to runtime 0x801F4xxx (scenario) — symbols_v2 `ram` 0x801B4xxx is the
WRONG linear back-map; classifier tags not adopted. Dossier
`docs/dossiers/lib-chunk20-141000-151000.md`; data indexes
`docs/data-index/rev0/chunk20-{data-region-inventory,neutral-encounter-table,creature-drop-table,string-pool-1432E4}.json`;
exports under `data/decoded/rev0/{tables,strings}/`. Next file after split: chunk 21
`0x151000`, opening with `func_00150550_chunk21tail` [0x151000,0x15105C).

## 2026-06-23 - Chunk 19 Split (0x131000..0x141000); chunk 19 complete — MIXED (encounter/dispatcher code + trailing scenario data)

DONE: **80 parts (64 code [incl. 1 incoming straddler-tail] + 16 data)**. Tracked files
2,446 → **2,526**; fallback 81 → 80. Byte-exact (code SHA `40D4E787…B409`, ROM
`571E8339…CC67A`). Coverage `0x1000..0x141000` = **1,310,720 B = 46.0030 %** (code-only ≈
1,103,712 B = 38.7376 %; +19,300 data bytes). Three ROM-ordered regions: incoming
straddler-tail func_00130E60_chunk19tail [0x131000,0x131050) → CODE [0x131050,0x13C49C) (63
parts; dispatcher-heavy encounter code, parent over-merge func_00131388 split into 5 fns,
9 preamble-orphans, 9 frameless leaves; the LAST code fn func_0013C060 = the parent-doc
**neutralEncounterDispatcher** @0x13C068, name kept conservative; ends jr$ra@0x13C494) →
DATA [0x13C49C,0x141000) (16 parts: bit-LUT + 0x801E pointer tables + a fixed-stride
record/script table [0x13C550,0x13D824] + packed blocks + outgoing straddler-head
data_00140EA0_chunk19head into chunk 20). Method: parent context + content scan (code/data
boundary 0x13C49C pinned at last fn jr$ra) → 7 code + 1 data agent (Workflow) →
combine_chunk.js (data names → <kind>_<addr>; kinds normalized) → check_boundaries PASS +
check_splits 0 frag → 4-agent adversarial swarm (3 code + 1 data): **0 disproofs**. KEY
RESULT: the data-hunter independently REFUTED the parent wiki-trace's "live combat code at
0x13DD74/0x13EE90/0x140180" — the LINEAR-MAP FALLACY (0 prologues, 0 jr$ra, 0 sw$ra across
the whole data region; those ROM offsets are packed data). Gates check_manifest (20/2,526/
80)/check_boundaries/check_splits/assemble byte-exact/verify_setup/audit all PASS; 0 data
files with function wording; data-index JSON valid. Dossier
`docs/dossiers/lib-chunk19-131000-141000.md`; data index
`docs/data-index/rev0/chunk19-data-region-inventory.json`. Next file after split: chunk 20
`0x141000`, opening with data_00141000_chunk20tail (continuation of the packed-byte
straddler); the documented neutral_encounter_table (0x141ED0) + creature_drop_table
(0x142258) are early in chunk 20.

## 2026-06-23 - Chunk 18 Split (0x121000..0x131000); chunk 18 complete — ALL CODE (FP-heavy scenario/combat; both-end straddlers)

DONE: **95 parts (95 code + 0 data)** = 1 incoming straddler-tail + 62 framed prologues +
8 preamble-orphans + 23 frameless leaves + 1 outgoing straddler-head. Tracked files 2,351
→ **2,446**; fallback 82 → 81. Byte-exact (code SHA `40D4E787…B409`, ROM `571E8339…CC67A`).
Coverage `0x1000..0x131000` = **1,245,184 B = 43.7029 %** (code-only ≈ 1,057,476 B =
37.1148 %; chunk 18 all code). INCOMING straddler-tail func_00120FC4_chunk18tail
[0x121000,0x1211F8) (FP-heavy 0x50-frame fn, float consts from out-of-chunk 0x801F rodata).
OUTGOING straddler-head func_00130E60 [0x130E60,0x131000) → 0x131050 in chunk 19. Method:
parent context + content scan (the "float-const runs" were FP-instruction false positives;
no data) → 8 code-slice agents (Workflow) → combine_chunk.js (0 label conflicts) →
check_boundaries PASS + check_splits 0 frag → 3-agent adversarial swarm: **1 fix** (missed
frameless leaf — func_0012EC6C had two jr$ra; split off func_0012ECDC@0x12ECDC) → re-gate →
split. Gates check_manifest (19/2,446/81)/check_boundaries/check_splits/assemble byte-exact/
verify_setup/audit all PASS. Parent-evidence: near-new territory — only heuristic
auto-classifier tags + hot-path proof; runtime band 0x801D; LEADS recorded (text-VM
consumers 0x126D24/0x1284C4/0x12B440, Chaos-Frame stat fn 0x12FBB8) — names stay func_*.
Dossier `docs/dossiers/lib-chunk18-121000-131000.md`; no data index. Next file after split:
chunk 19 `0x131000`, opening with func_00130E60_chunk19tail [0x131000,0x131050).

## 2026-06-23 - Chunk 17 Split (0x111000..0x121000); chunk 17 complete — ALL CODE (char-data/encounter; both-end straddlers)

DONE: **66 parts (66 code + 0 data)** = 1 incoming straddler-tail + 37 framed prologues +
23 preamble-orphans + 4 frameless leaves + 1 outgoing straddler-head. Tracked files 2,285
→ **2,351**; fallback 83 → 82. Byte-exact (code SHA `40D4E787…B409`, ROM `571E8339…CC67A`).
Coverage `0x1000..0x121000` = **1,179,648 B = 41.4027 %** (code-only ≈ 991,940 B =
34.8146 %; chunk 17 is all code). INCOMING straddler-tail func_00110160_chunk17tail
[0x111000,0x111464) (jr $ra@0x11145C; tail of chunk-16 func_00110160). OUTGOING
straddler-head func_00120FC4 [0x120FC4,0x121000) → 0x1211F8 in chunk 18. The 23
preamble-orphans are the recurring read-before-write folds (lui/lw/lbu/mtc1 of 0x801F
globals/float regs); jr$v0 dispatchers (0x11C954→0x801FE438, 0x11EAD8→0x801EE478), jalr
$v0 (0x11D354), and j 0x801Cxxxx overlay tail-jumps kept internal; in-stream FP constants
are CODE. Method: parent context + content scan (no data signature) → 8 code-slice agents
(Workflow) → combine_chunk.js (0 label conflicts; first=func_00110160_chunk17tail,
last=func_00120FC4) → check_boundaries PASS + check_splits 0 frag → 3-agent adversarial
swarm: **0 disproofs** → split. Gates check_manifest (18/2,351/82)/check_boundaries/
check_splits/assemble byte-exact/verify_setup/audit all PASS. Parent-evidence: chunk 17
largely new territory — only 0x115440 has a role lead (bitfield helpers @0x80186190/210);
rest are classifier role tags only; names stay func_*. Dossier
`docs/dossiers/lib-chunk17-111000-121000.md`; no data index (all code). Next file after
split: chunk 18 `0x121000`, opening with func_00120FC4_chunk18tail [0x121000,0x1211F8).

## 2026-06-23 - Chunk 16 Split (0x101000..0x111000); chunk 16 complete — MIXED (leading scenario data + neutral-encounter code)

DONE: **95 parts (72 code [incl. 1 outgoing straddler-head] + 23 data)**. Tracked files
2,190 → **2,285**; fallback 84 → 83. Byte-exact (code SHA `40D4E787…B409`, ROM
`571E8339…CC67A`). Coverage `0x1000..0x111000` = **1,114,112 B = 39.1026 %** (code-only ≈
926,404 B = 32.5145 %; +3,296 data bytes). Three ROM-ordered regions: leading DATA
`0x101000..0x101CE0` (fixed-stride 0x50-byte record-table tail continuing from chunk 15
[ends 0x101164] + 0x801A/0x801B RAM-pointer/jump tables incl. a ~100-entry 0x801AEAEC
fill table + two embedded ASCII format strings + a float64 const pool 1.0/180.0/pi/pi-half/
2.5) → CODE `0x101CE0..0x111000` (the neutral-encounter path; parent-missed frameless leaf
func_00101CE0 at the data→code boundary, 23 preamble-orphans, 9 frameless leaves, jr$v0
dispatchers + j 0x801Bxxxx tail-jumps internal) → outgoing straddler-head func_00110160.

INCOMING straddler-tail data_00101000_chunk16tail [0x101000,0x101024) (9-word completion
of the chunk-15 truncated record). OUTGOING straddler-head func_00110160 [0x110160,0x111000)
→ 0x111464 in chunk 17. Method: content-scan region map → 2 data agents + 8 code-slice
agents (Workflow) → combine (combine_chunk.js: decimal→hex norm, data names → <kind>_<addr>,
preamble-orphan label = own name) → check_boundaries PASS + check_splits 0 frag → 5-agent
adversarial swarm (3 code + 2 data): **0 structural disproofs**, 1 data-note evidence fix
(record-table-end word mis-cited 0x00010002, actually 0x00000019; boundary 0x101164 was
already correct) → split. Gates check_manifest (17/2,285/83)/check_boundaries/check_splits/
assemble byte-exact/verify_setup/audit all PASS; 0 data files with function wording;
data-index JSON valid. Parent-evidence sweep: chunk 16 is the neutral-encounter path —
0x102FA8 scenario event-state dispatcher (88 callees), 0x105CC8 text_renderer (+~0x53A4=
0x10706C), 0x10D484/0x10DDBC spawn helpers — recorded as LEADS, names stay func_*; the
0x50 record table + 0x801A jump tables are new (not in parent). Opening fixes this run
(commit d4c98d1): review-doc hash, superseded 0xF135C log notes, and a durable
tools/decode_rodata_strings.js producing a byte-exact chunk-15 opening-prologue export.
Dossier `docs/dossiers/lib-chunk16-101000-111000.md`; data index
`docs/data-index/rev0/chunk16-data-region-inventory.json`. Next file after split: chunk
17 `0x111000`, opening with the incoming straddler tail func_00110160_chunk17tail.

## 2026-06-23 - Chunk 15 Split (0xF1000..0x101000); chunk 15 complete — MIXED (5 interleaved regions, code-heavier)

DONE: **153 parts (134 code [incl. 1 incoming straddler-tail] + 19 data)**. Tracked
files 2,037 → **2,190**; fallback 85 → 84. Byte-exact (code SHA `40D4E787…B409`, ROM
`571E8339…CC67A`). Coverage `0x1000..0x101000` = **1,048,576 B = 36.80 %** (code-only ≈
864,164 B = 30.33 %; +9,948 data bytes). Five ROM-ordered regions: incoming FUNCTION
straddler-tail `0xF1000..0xF1354` → CODE R1 `0xF1354..0xF8550` (60 parts; dispatcher
`func_000F1354`, two frameless float-lerp clusters, 8 preamble-orphans) → DATA R1
`0xF8550..0xF9FF8` (12 parts: float32 tables + 2 large F3DEX display-list blobs + pointer
tables + a float64 region with pi) → CODE R2 `0xF9FF8..0x1003CC` (73 parts; 23 recovered
frameless leaves, 2 dispatchers, 1 dual-entry leaf) → DATA R2 `0x1003CC..0x101000` (7
parts: packed records + the **OB64 opening-prologue narration rodata** `rodata_001006f0`
"@0Palatinean Year 238…Holy Lodis Empire…Galicia" + a pointer table + a fixed-stride
0x50-byte float-record table + an outgoing DATA straddler).

INCOMING straddler-tail `func_000F0F64_chunk15tail [0xF1000,0xF1354)` (tail of chunk-14's
`func_000F0F64`; refined end **0xF1354** not 0xF135C — `func_000F1354` has a 2-word
preamble before its 0xF135C prologue). OUTGOING straddler `data_00100fd4_chunk15head
[0x100FD4,0x101000)` — truncated 0x50-byte float record (11/20 words), continues into
chunk 16 (first word 0x42340000=45.0 is word[11]). Deterministic `check_boundaries`
caught **6 unmerged defects** the slice agents flagged-but-didn't-merge (5
preamble-orphans `0xF55CC/0xF57C4/0xF59BC/0xF6258/0xF62D0` + 1 delay-slot leak
`func_000F2FE4`@0xF3098). Adversarial swarm (4 agents: 2 code-region + 2 data-hunters)
found **3 more R1 fixes** (preamble-orphans `0xF286C`/`0xF4AFC`; missed frameless leaf
`0xF8480`) — R2 + both data regions **0 disproofs**. One data agent emitted decimal
addresses (normalized to hex in the combine); the slice `label` field initially pointed
at the embedded prologue label (duplicate-symbol assembler error) → fixed to label=own-name
and re-split cleanly. No tool changes. Method: region-map → 2 code sub-regions (8 slice
agents) + 2 data agents → combine → gates → adversarial → fix → re-gate → split. Gates
check_manifest/check_boundaries/check_splits/assemble byte-exact/verify_setup (16
chunks/2,190/84)/audit all PASS; 0 data files with function wording; data-index JSON
valid. Parent-evidence sweep: parent `scripts/ob64_symbols_v2.json` already maps the 92
functions here (overlay, non-linear RAM) with a few heuristic labels (recorded as LEADS);
the 0x1006F0 opening narration is NEW (not in parent). Dossier
`docs/dossiers/lib-chunk15-F1000-101000.md`; data index
`docs/data-index/rev0/chunk15-data-region-inventory.json`. Next file after split: chunk
16 `0x101000`, opening with the OUTGOING DATA straddler tail `data_00101000_chunk16tail`.

## 2026-06-23 - Chunk 14 Split (0xE1000..0xF1000); chunk 14 complete — MIXED (4 interleaved regions)

DONE: **94 parts (74 code [73 `func_*` + 1 straddler-head] + 20 data)**. Tracked files
1,943 → **2,037**; fallback 86 → 85. Byte-exact (code SHA `40D4E787…B409`, ROM
`571E8339…CC67A`). Coverage `0x1000..0xF1000` = **983,040 B = 34.5018 %** (code-only ≈
808,576 B = 28.38 %; +17,828 data bytes). Four ROM-ordered regions: DATA
`0xE1000..0xE48F0` (graphics: packed/glyph blob continuation + F3D/RDP display-list
stream + 4bpp pixel blobs) → CODE `0xE48F0..0xEAEFC` (DL-builder + char-data; 3 leading
frameless DL builders + parent fns + frameless leaves) → DATA island `0xEAEFC..0xEBBB0`
(RAM-pointer tables 0x8019 band + debug format strings "speech.c…"/"Kao No Error") →
CODE `0xEBBB0..0xF1000` (char-data/FP; outgoing FUNCTION straddler).

INCOMING data straddler `data_000e1000_chunk14tail [0xE1000,0xE13D0)` (continues
chunk-13 data_000e0bd0; ends at first DF000000 record). OUTGOING straddler-head
`func_000F0F64_chunk14head [0xF0F64,0xF1000)` → 0x000F135C in chunk 15 [superseded: refined
to 0xF1354 during the chunk-15 run — see the chunk-15 entry]. Adversarial
swarm (4 agents) caught 2 boundary fixes: (1) data→code boundary is 0xE48F0 NOT the
parent's 0xE4BE0 — 3 frameless DL-builder functions (func_000e48f0/4930/495c) precede
the first framed fn; (2) preamble-orphan true entry 0xEBBB0 NOT 0xEBBC0 (4-word
read-before-write lui/lbu 0x800E7A32). 0 other disproofs. No tool changes. Method:
region-map → 2 code sub-regions (5 analysis agents) + 3 data-classification agents →
combine (insert 3 frameless fns at 0xE48F0) → check_boundaries → adversarial → fix →
re-check → split. Mid-run gates check_manifest/check_boundaries/check_splits/assemble
byte-exact/diff all PASS; 0 data files with function wording; data-index JSON valid.
Dossier `docs/dossiers/lib-chunk14-E1000-F1000.md`; data index
`docs/data-index/rev0/chunk14-data-region-inventory.json`. Next file after split: chunk
15 `0xF1000`, opening with the OUTGOING FUNCTION straddler tail
`func_000F0F64_chunk15tail` `[0xF1000,0x000F135C)` [superseded: refined to
`[0xF1000,0x000F1354)` during the chunk-15 run — see the chunk-15 entry].

## Current Dossier Set

The current boot/source-layout dossier list is long; use `docs/PLATFORM.md` for
the full quick index. The newest dossiers are:

- `docs/dossiers/lib-chunk29-1D1000-1E1000.md` (103-part chunk-29:
  CODE-dominant MIXED — incoming function tail `func_001D0694_chunk29tail`,
  dense world-map/resource code, four tiny zero-fill alignment islands,
  recovered frameless helpers at `0x1D9338` and `0x1E0A38`, and outgoing
  function head `func_001E0FC8`; 97 normal code + 4 data + 2 straddlers; chunk
  29 done)
- `docs/dossiers/lib-chunk28-1C1000-1D1000.md` (97-part chunk-28: MIXED —
  incoming function tail `func_001C0FC8_chunk28tail`, parent/code clusters,
  three data territories [pointer/GBI-like data, stronghold/tutorial text +
  packed command/script data, second script/table blob], recovered frameless
  helpers at `0x1C3D14` and `0x1CE070..0x1CE174`, and outgoing function head
  `func_001D0694`; 73 normal code + 22 data + 2 straddlers; chunk 28 done)
- `docs/dossiers/lib-chunk27-1B1000-1C1000.md` (142-part chunk-27:
  CODE-dominant MIXED — FP-heavy class/char/encounter/resource code +
  status/menu string table island + display-list/float/color-LUT island; 128
  code + 14 data; incoming and outgoing function straddlers; chunk 27 done)
- `docs/dossiers/lib-chunk26-1A1000-1B1000.md` (96-part chunk-26:
  CODE-dominant MIXED — FP-heavy char/class/scenario/encounter code + 3 inline
  data islands; incoming and outgoing function straddlers; chunk 26 done)
- `docs/dossiers/lib-chunk25-191000-1A1000.md` (71-part chunk-25:
  CODE-dominant MIXED — char/class/scenario code + shop-dialogue string pool +
  inline data islands; incoming and outgoing function straddlers; chunk 25 done)
- `docs/dossiers/lib-chunk24-181000-191000.md` (63-part chunk-24: MIXED —
  FP/menu/display code wrapping a large interior font/tile/table/pointer/float
  data region; incoming and outgoing function straddlers; chunk 24 done)
- `docs/dossiers/lib-chunk23-171000-181000.md` (73-part chunk-23: MIXED
  6-region — scenario/camera + char-data code interleaved with two large data
  islands; outgoing function straddler; chunk 23 done)
- `docs/dossiers/lib-chunk22-161000-171000.md` (99-part chunk-22: MIXED —
  UI/text + weapon-type/terrain resource data wrapping menu/item/legion code;
  incoming and outgoing data straddlers; chunk 22 done)
- `docs/dossiers/lib-chunk21-151000-161000.md` (99-part chunk-21: MIXED — class/character-lookup CODE [incl. the classLookup_full lead @0x1591FC, named func_001591FC] + a trailing high-entropy/compressed DATA region with an outgoing data straddler data_0015FDF8_chunk21head into chunk 22; 94 code + 5 data; adversarial 1 fix — missed frameless leaf at 0x15F838; data-hunter confirmed no hidden code; chunk 21 done)
- `docs/dossiers/lib-chunk20-141000-151000.md` (175-part chunk-20: MIXED — leading scenario DATA [packed-byte straddler + gfx/float pools + neutral_encounter_table 40×20 + creature_drop_table 36×8 + 0x801A/0x801B pointer tables + a 125-string game-text pool @0x1432E4] + encounter/dispatcher CODE with an inline data island @0x14DE88 + outgoing fn straddler func_00150550; 89 code + 86 data; adversarial 1 fix — hidden code at 0x145210; both tables + string pool decoded to JSON+MD; chunk 20 done)
- `docs/dossiers/lib-chunk19-131000-141000.md` (80-part chunk-19: MIXED — encounter/dispatcher CODE [incl. the neutralEncounterDispatcher @0x13C068, named func_0013C060] + a trailing DATA region [bit-LUT + 0x801E pointer tables + fixed-stride record/script table + packed-byte tail straddling into chunk 20]; 64 code + 16 data; adversarial 0 disproofs — data-hunter refuted the parent "combat code in the gap" linear-map fallacy; chunk 19 done)
- `docs/dossiers/lib-chunk18-121000-131000.md` (95-part chunk-18: ALL CODE — FP-heavy scenario/combat code; incoming straddler-tail func_00120FC4_chunk18tail + ~93 functions [8 preamble-orphans, 23 frameless leaves] + outgoing straddler-head func_00130E60 into chunk 19; 0 data; adversarial 1 fix (missed frameless leaf 0x12ECDC); parent near-new territory, runtime band 0x801D; chunk 18 done)
- `docs/dossiers/lib-chunk17-111000-121000.md` (66-part chunk-17: ALL CODE — char-data/encounter code; incoming straddler-tail func_00110160_chunk17tail + ~64 functions [23 preamble-orphans, 4 frameless leaves] + outgoing straddler-head func_00120FC4 into chunk 18; 0 data; adversarial 0 disproofs; parent lead only 0x115440 bitfield helpers; chunk 17 done)
- `docs/dossiers/lib-chunk16-101000-111000.md` (95-part chunk-16: MIXED — leading scenario DATA [record-table tail + 0x801A pointer/jump tables + float64 const pool] + the neutral-encounter CODE path; 72 code + 23 data; parent-missed frameless leaf at the data→code boundary 0x101CE0; outgoing fn straddler func_00110160; adversarial 0 structural disproofs; parent LEADS recorded [0x102FA8 dispatcher, 0x105CC8 text_renderer]; chunk 16 done)
- `docs/dossiers/lib-chunk15-F1000-101000.md` (153-part chunk-15: MIXED, code-heavier, 5 interleaved regions — incoming fn straddler-tail + CODE R1 + floats/display-list data + CODE R2 + tail data with the OB64 opening-narration rodata; 134 code + 19 data; outgoing DATA straddler; deterministic gate caught 6 unmerged defects + adversarial 3 R1 fixes; chunk 15 done)
- `docs/dossiers/lib-chunk14-E1000-F1000.md` (94-part chunk-14: MIXED, 4 interleaved regions — graphics/display-list data + DL-builder/char-data code + pointer-table data island + char-data/FP code; 74 code + 20 data; incoming data straddler + outgoing fn straddler; data→code boundary corrected to 0xE48F0; chunk 14 done)
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

Chunks 0–29 (`0x00001000..0x001E1000`) are fully source-owned as named code/data
parts. Chunk 29 (`0x001D1000..0x001E1000`) is CODE-dominant MIXED: 103 parts
(97 normal code + 4 zero-fill data + 2 function straddlers). It completes
incoming `func_001D0694_chunk29tail` at `0x001D1000..0x001D10A4`, recovers
frameless helpers at `0x001D9338` and `0x001E0A38`, preserves four pure-zero
alignment islands as data, and ends with outgoing function straddler-head
`func_001E0FC8` at `0x001E0FC0..0x001E1000`.

Chunk 29 data totals 24 bytes, all parsed zero-fill:

- `0x001D46F8..0x001D4700`.
- `0x001D884C..0x001D8850`.
- `0x001DAAAC..0x001DAAB0`.
- `0x001DBF68..0x001DBF70`.

Data index: `docs/data-index/rev0/chunk29-data-region-inventory.json`.
Dossier: `docs/dossiers/lib-chunk29-1D1000-1E1000.md`.

Current frontier is **`0x001E1000` (chunk 30)**. Coverage
`0x1000..0x1E1000` = 1,966,080 B = 69.0045% of the 2,849,204-byte executable
extent (code-only = 1,609,044 B = 56.4735%).

FIRST for the next run: continue the OUTGOING FUNCTION straddler from chunk 29.
`func_001E0FC8` starts in chunk 29 at `0x001E0FC0` with the parent prologue at
`0x001E0FC8`, has no `jr$ra` before the chunk boundary, and must be emitted
first in chunk 30 as `func_001E0FC8_chunk30tail` starting at `0x001E1000`.

There are now two active tracks. The library source-ownership track continues at
`0x1E1000` (chunk 30) as above. The full-ROM coverage track (opened 2026-06-21)
next refines the exact code/data boundary near `0x002B89B4` and reclassifies the
non-code tail `0x002B89B4..0x0063676C` from `original_mips` to a data source
form, shrinking the configured code region to the executable extent while
keeping the exact rebuild gate green. See `docs/CODE_REGION_AUDIT.md` and
`docs/NEXT_STEPS.md`.
