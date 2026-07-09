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
- Current tracked code source mix: **one hundred composite real-assembler chunks**
  (chunk 0 177 `boot/`; chunks 1–99 in `lib/`: 350, 216, 67, 376, 88, 78, 103, 87, 34, 35, 191, 74, 67, 94, 153, 95, 66, 95, 80, 175, 99, 99, 73, 63, 71, 96, 142, 97, 103, 122, 86, 198, 109, 120, 134, 164, 180, 232, 155, 159, 160, 171, 90, 17, 15, 17, 27, 9, 11, 13, 13, 13, 9, 9, 9, 7, 1, 5, 3, 3, 5, 5, 5, 7, 15, 8, 21, 33, 23, 19, 23, 21, 33, 13, 7, 7, 15, 4, 11, 5, 4, 4, 5, 9, 9, 11, 4, 9, 5, 3, 4, 4, 4, 4, 3, 4, 4, 5, 1) =
  **6,181 tracked source files**, plus **0 generated fallback code chunks — the entire configured code
  region `0x00001000..0x0063676C` is now FULLY SOURCE-OWNED (data-ownership loop COMPLETE; consolidated
  coordinator report: `docs/FINAL_DATA_OWNERSHIP_REPORT_2026-06-24.md`)**. **Chunks
  0–99 (`0x00001000..0x0063676C`) are fully source-owned as named code/data
  parts** (chunks 90-99 own the **Section C HUFF pool tail** [0x5A1000..0x63676C]: 36 parser-backed parts
  cut at word-aligned HUFF block starts [magic-12] + chunk seams, 0 code; LOOP-COMPLETE reaching the
  configured stop 0x63676C incl. the terminal partial chunk 99 [0x631000..0x63676C]; Section C = N64
  JPEG/NJPG-style "HUFF" entropy pool, 29 blocks, 18-byte word-aligned container header decoded incl.
  leadU32==blockSize-4 self-relative length, Huffman entropy stage decoded to 230,400-byte coefficient
  buffers per block, final image render pending; data-only-safe) (chunk 89 owns the whole **Section B tail +
  Section C start** [0x591000..0x5A1000]: 5 structural parts [block 61 tail + block 62 = anim-family end
  0x594280 + Section C 65-entry directory + zero pad + Section C HUFF pool start], 0 code)
  (chunks 79-88 = Section B parser-backed cutscene AUDIO-SEQUENCE blocks [0x4F1000..0x591000]:
  71 parts at natural catalog block boundaries [block 0 body + blocks 1-60 whole + block 61 head], 0 code;
  all 63 blocks tag 0x215 + contiguous per parent ob64_anim_block_catalog.json/anim_block_codec.py;
  FALLBACK at 0x591000 — block 61 tail + block 62 + the Section-B directory tail were mid-chunk-89,
  now owned in chunk 89) (chunk 78 crosses the **Section A/B boundary** [0x4E1000..0x4F1000]: 4 structural parts =
  Section A audio tail + Section B index table [1798 records, shape decoded] + Section B payload
  [undecoded] + the head of the first parser-backed cutscene audio-sequence block [tag 0x215];
  chunk-78 bytes owned, Section B unit partial) (chunks 68-77 = flat Section A AUDIO sample payload [0x441000..0x4E1000]: 194 parts [102 data +
  92 zero_fill, 0 code], raw 4-bit ADPCM/VADPCM after the chunk-66/67 bank; whole-range entropy 7.309, no
  sub-bank header, 4 quiet-audio <6.0 windows confirmed NON-structural; 10-chunk batch stayed clean;
  outgoing data_004E0CE8 into chunk 78. The Section A/B boundary is byte-confirmed just past this run at
  ~0x4E3158 [an 8-byte-stride (offset,0x64) index table = survey Section B]) (chunk 67 = the chunk-66 audio bank's WaveTables sample-payload TAIL closure + flat post-tail
  Section A audio [0x431000..0x441000]: 21 parts [11 data + 10 zero_fill, 0 code]; WaveTables payload ends
  0x431EF1 [terminator zero_fill_00431EF4]; no new sub-bank header in chunk 67; chunk-67 bytes owned, the
  chunk-66+67 audio-bank unit still `partial`; outgoing flat-audio continuation data_0043F3D8 into chunk 68) (chunk 66 = a DECODED N64 audio sound-bank [0x421000..0x431000]: 8 structural parts [5 data +
  3 zero_fill, 0 code], `N64 PtrTablesV2` codebook directory @0x423FF0 [133 order-2 VADPCM records,
  strides 0xA0/0xD0, u32-BE offset table @0x429820] + `N64 WaveTables` sample bank @0x429CD0 [4-bit ADPCM,
  continues into chunk 67] — CONFIRMS Section A is AUDIO; chunk-66 bytes owned `yes`, whole-bank schema
  `partial`; outgoing WaveTables continuation `data_00429CC8` into chunk 67) (chunks 62-65 = Section A slice 3, a FALLBACK from the planned 10-chunk batch 62-71: 0 code +
  32 data [18 data + 14 zero_fill] across `0x3E1000..0x421000`; stopped at `0x421000` because chunk 66
  is a **decoded N64 audio sound-bank** [magics `N64 PtrTablesV2` @0x423FF0 + `N64 WaveTables` @0x429CD0]
  with a low-entropy region [2.66 bits/2KB @0x429800] that needs a focused decode run — strong evidence
  the whole Section A family is AUDIO, not texture; 0 jr$ra/0 prologues at all 4 alignments;
  parent-tooling-dark) (chunks 52-61 = Section A slice 2 [0x341000..0x3E1000]: 0 code + 64 data [37 data + 27
  zero_fill], DATA TERRITORY — same high-entropy asset family, TYPE UNRESOLVED, conservative names;
  0 jr$ra/0 prologues/0 pointers at all 4 byte alignments; parent-tooling-dark (all leads rejected,
  4a/4f byte-disproven); container layout decoded [37 objects + 27 pads, 8-aligned-not-16]; outgoing
  continuation data_003DE988 into chunk 62. chunks 48-51 = Section A slice 1 [survey natural unit Section A 0x301000..0x4E3000]:
  0 code + 46 data [25 data + 21 zero_fill] across 0x301000..0x341000, DATA TERRITORY — high-entropy
  asset data continuing the chunk-43..47 family, TYPE UNRESOLVED (graphics/texture vs audio-codec-
  residual; conservative data_/zero_fill_ names); 0 jr$ra/0 prologues/0 pointers; B-table-to-A
  hypothesis byte-tested + rejected for this slice; outgoing continuation data_0033FD78 into chunk 52;
  chunk 44: 0 code + 17 data [9 data + 8 zero_fill], DATA TERRITORY — the entire
  64 KiB is non-code high-entropy graphics/texture data PAST the executable extent `0x2B89B4`
  (0 jr$ra / 0 prologues / 0 pointers), continuing chunk 43's tail; no code, no straddler;
  chunk 43: 81 code + 1 straddler-tail + 8 data, MIXED — mission-briefing/
  scenario-overview overlay CODE `0x2B1000..0x2B89B8` then the code→data transition at
  `0x2B89B8` and an F3DEX2 display-list/float-pool/texture DATA tail `0x2B89B8..0x2C1000`;
  crosses the executable-extent end `0x2B89B4`; ends in data, no outgoing straddler;
  chunk 39: 135 code + 19 data + 1 straddler-tail, MIXED — mission-briefing/combat
  display-list code continuing chunks 36-38, wrapping THREE interior data islands (big data
  territory 0x273FFC..0x275850 with pointer/jump/float64 tables; a GBI display-list blob
  0x279DA8..0x27A020; a tail small-int LUT + zero-fill 0x280D48..0x281000); chunk ends in data
  (no outgoing straddler);
  chunk 38: 230 code + 0 data + 2 straddlers, ALL CODE — FP/GBI display-list builders +
  mission-briefing/combat dispatchers continuing chunks 36-37, frameless-leaf dense, parent-gap
  frameless recoveries (288 B@0x2639D8 GBI builder, 796 B@0x2664A4 switch dispatch);
  chunk 36: 134 code + 28 data + 2 straddlers, MIXED — mission-briefing/combat
  display-list module + TWO combat-overlay DATA islands; chunk 37: 170 code + 8 data + 2
  straddlers, MIXED — command-dispatcher mission-briefing/combat code + a 0x80x pointer/
  struct/float record-table DATA island; chunk 34: 89 code + 29 data + 2 straddlers, MIXED — promotion/level-up/class-def
  code + a combat-overlay DATA island [0x801D/0x801E handler/jump pointer tables + GBI/RDP
  display-list blobs + float/double pools + message-string rodata]; chunk 35: 127 code + 5
  data + 2 straddlers, MIXED — class/promotion/display-list code + a float-ramp + 0x801F
  pointer/double record-table DATA island, frameless-leaf dense; chunk 13: 27 code + 40 data, MIXED — unit-mgmt UI data; chunk 14: 74 code + 20
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
  data and recovered frameless helpers; chunk 30: 89 normal code + 31 data + 2 function
  straddlers, MIXED - FP/RDP display-list world-map/resource code wrapping the Sound-Test/BGM
  screen + staff-credits data territory; chunk 31: 84 normal code + 0 data + 2 function
  straddlers, ALL CODE - FP/GBI display-list builders + attack/queue module code, incl. the
  High-Attack cleanup-guard site at z64 0x1F36F0; chunk 32: 196 normal code + 0 data + 2
  function straddlers, ALL CODE - frameless-leaf-dense FP/display-list + class-def/char-data
  code; chunk 33: 82 normal code + 25 data + 2 function straddlers, MIXED - code + a font/glyph
  + pointer/float DATA region [0x211D14..0x213B10] + a jump-table state-machine straddler;
  chunk 34: 89 normal code + 29 data + 2 function straddlers, MIXED - promotion/level-up/class-def
  code + a combat-overlay pointer/blob/float/string DATA island [0x228D6C..0x22A280];
  chunk 35: 127 normal code + 5 data + 2 function straddlers, MIXED - class/promotion/display-list
  code + a float-ramp/0x801F record-table DATA island [0x239B94..0x23A3A0];
  chunk 36: 134 normal code + 28 data + 2 function straddlers, MIXED - mission-briefing/combat
  display-list module + TWO combat-overlay DATA islands [0x243F14..0x2447A0, 0x24B410..0x24BCA0];
  chunk 37: 170 normal code + 8 data + 2 function straddlers, MIXED - command-dispatcher
  mission-briefing/combat code + a 0x80x pointer/struct/float record-table DATA island
  [0x25E2BC..0x25EE90]);
  the configured code region is now FULLY source-owned through chunk 99 (`0x0063676C`) — 0 generated
  fallback chunks remain; the data-ownership loop is COMPLETE. The promote-tool merge blocker is FIXED.
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
  plus 1,048 generated fallback owner files / 35,388,567 bytes.
- Current code-region SHA256:
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- Current rebuilt/full ROM SHA256:
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
- Canonical verification command: `node tools\verify_setup.js`.
- Beyond the boot-linear rule, three overlay VRAM deltas are promotion-grade
  (runtime-trace proven): map-AI overlay `0x101000..0x130000` = `+0x800AB8C0`;
  scenario-loader module `~0x195000..0x197800` = `+0x8007FB70`; the helper
  module containing live `0x8021590C` = `+0x800A30E0` (z64 home `0x0017282C`).
  The asm comment column stays nominal-linear — never exec-watch it for overlay
  code. Source: `docs/subsystems/map-ai-eset-runtime.md`.

## 2026-07-03 - Runtime fact import: map-AI/ESET subsystem

First curated promotion-grade import from the parent scenario-editor research
line (Wave 1 → R4 natural-wake → suppression hunt → gate mop-up → Wave 2/S3;
AARs under parent `wiki/after-action-reports/20260702*/20260703*`). New:
`docs/subsystems/map-ai-eset-runtime.md` — 14 evidence-named function
identities (scenario deployment loader, map-unit update dispatcher, wake
primitive, kind-2 gate resolver with the full operator enum incl. the op1
two-way router, group movement consumer, scheduler setter/transfer passes with
their kind jump tables, site-flag recompute, resident cache-invalidate leaves,
and more), 16 verified data labels with layouts (map-unit pool 50×0xC0 and its
dynamic iterator bound, Section 2/3 runtime tables + latch/evaluator bitsets,
site records, route descriptors, formation tables, scenario resource-container
pointer table), struct sketches (proven fields only), z64 static sources
(ESET archives fetch-verified; shared placement-resources region
`0x02625000..0x02628000` incl. the key30 selector table at `0x02626DFB`), and
a binding "Explicitly NOT promoted" list. Every entry cites its parent trace
or controlled-mutation artifact per the AGENTS.md import rule. Struct headers
under `include/game/` were deliberately deferred until C conversion reaches
these functions — the subsystem doc is the naming source until then.
`docs/NEXT_STEPS.md` item 5 and `docs/runtime-state-catalog.md` (per-state
index + canonical LOADING seed + card-clear driver) were updated in the same
pass. Docs-only change; setup gate unaffected.

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
- Chunk 30 source-ownership `0x001E1000..0x001F1000` (122 parts: 89 normal code + 31 data
  + 2 function straddlers, MIXED): incoming straddler-tail `func_001E0FC8_chunk30tail` →
  CODE R1 `0x1E120C..0x1EE574` (FP/RDP display-list world-map/char-data/resource code) →
  interior DATA `0x1EE574..0x1F0A30` (Sound-Test/"Ogre Battle 64 BGM Selection" screen:
  graphics/GBI display-list + 46-string scene-name pool + 0x801B pointer tables + a
  fixed-stride record table; then alphabet + screen format strings + the 126-string
  staff-credits roll + handler/float tables) → CODE R2 `0x1F0A30..0x1F0F90` → outgoing
  straddler-head `func_001F0F9C`. Adversarial caught 2 missed frameless leaves (former
  func_001EA134→4, func_001EAE50→2). Dossier `docs/dossiers/lib-chunk30-1E1000-1F1000.md`;
  data index `docs/data-index/rev0/chunk30-data-region-inventory.json`. **Chunk 30 source-owned.**
- Chunk 31 source-ownership `0x001F1000..0x00201000` (86 parts: 84 normal code + 0 data
  + 2 function straddlers, ALL CODE): incoming straddler-tail `func_001F0F9C_chunk31tail`
  (`0x1F1000..0x1F102C`) → FP/GBI display-list builders + attack/queue module code →
  outgoing straddler-head `func_002006E8` (`0x2006E8..0x201000` → chunk 32). Recovered
  frameless leaves + over-merge un-splits at 0x1F102C and 0x1FF7EC + the 0x1F8D70 flag-
  accessor cluster; adversarial caught 1 missed frameless leaf (func_001F8A54→func_001F8BDC)
  + 1 note fix. Harvested the High-Attack cleanup-guard candidate at z64 0x1F36F0 (owner
  func_001F3540) into `docs/patch-workbench/rev0/patch-workbench-chunks30-31-2026-06-23.json`
  (static-only / needs-runtime). Dossier `docs/dossiers/lib-chunk31-1F1000-201000.md`; no
  data index (all code). **Chunk 31 source-owned.**
- Chunk 32 source-ownership `0x00201000..0x00211000` (198 parts: 196 normal code + 0 data
  + 2 function straddlers, ALL CODE, frameless-leaf-dense): incoming straddler-tail
  `func_002006E8_chunk32tail` (`0x201000..0x201108`) → FP/display-list + class-def/char-data
  code (preamble-orphans incl. func_00201108; jr$v0 dispatchers internal; ~50+ recovered
  frameless leaves) → outgoing straddler-head `func_00210C30` (`0x210C30..0x211000` → chunk 33).
  Adversarial caught 1 missed frameless leaf (func_0020156C over-extended → split off
  func_00201584) + 2 preamble-orphan boundary corrections (func_002091F4/func_0020934C
  re-anchored to their true preamble entry). Dossier `docs/dossiers/lib-chunk32-201000-211000.md`;
  no data index (all code). **Chunk 32 source-owned.**
- Chunk 33 source-ownership `0x00211000..0x00221000` (109 parts: 82 normal code + 25 data
  + 2 function straddlers, MIXED): incoming straddler-tail `func_00210C30_chunk33tail`
  (`0x211000..0x211028`) → CODE R1 → interior font/glyph + pointer/float DATA region
  `0x211D14..0x213B10` (rodata strings + glyph remap map + 16-bit LUT + packed graphics +
  0x801A/0x801B/0x801C pointer tables + float64/float32 pools) → CODE R2 (incl. High-Attack
  hook functions) → outgoing straddler-head `func_0021EBBC` (`0x21EBBC..0x221000`, a ~21KB
  jump-table state machine → chunk 34). Adversarial caught 1 missed seam preamble
  (func_0021181C); 3 more seam preamble-orphans merged at combine. Harvested 2 High-Attack
  hook candidates (0x21CD48 in func_0021CBC4, 0x21BF84 in func_0021B894) into
  `docs/patch-workbench/rev0/patch-workbench-chunks32-33-2026-06-23.json` (static-only).
  Dossier `docs/dossiers/lib-chunk33-211000-221000.md`; data index
  `docs/data-index/rev0/chunk33-data-region-inventory.json`. **Chunk 33 source-owned.**
- Chunk 34 source-ownership `0x00221000..0x00231000` (120 parts: 89 normal code + 29 data
  + 2 function straddlers, MIXED): incoming straddler-tail `func_0021EBBC_chunk34tail`
  (`0x221000..0x2213DC`, classChangeStateMachine tail) → CODE region A → interior
  combat-overlay DATA island `0x228D6C..0x22A280` (0x801D/0x801E handler/jump pointer
  tables + GBI/RDP display-list blobs + float/double pools + rodata message strings) →
  CODE region B (dispatchers func_0022D14C/func_0022F580) → outgoing straddler-head
  `func_00230A9C` (`0x230A9C..0x231000` → chunk 35). Adversarial 6/6 clean. Fixed a
  preamble-orphan name/label mismatch (func_00228A88/func_00228B3C) that collided at
  assemble. Dossier + data index added. **Chunk 34 source-owned.**
- Chunk 35 source-ownership `0x00231000..0x00241000` (134 parts: 127 normal code + 5 data
  + 2 function straddlers, MIXED): incoming straddler-tail `func_00230A9C_chunk35tail`
  (`0x231000..0x2317C8`) → CODE region A → interior DATA island `0x239B94..0x23A3A0`
  (float32 ramp 0.6→4.0 + packed record blob + 0x801F pointer/double record table) →
  CODE region B (command dispatcher func_0023C114) → outgoing straddler-head
  `func_00240FF0` (`0x240FF0..0x241000` → chunk 36). Frameless-leaf/preamble-orphan
  dense; the run-prompt 60B/76B "data gap" leads (`0x23B210`/`0x23B678`) were proven CODE.
  Adversarial 5 clean + 1 HIGH fixed (slice-seam preamble-orphan `0x240D20` folded
  forward → func_00240D20). Dossier + data index added. **Chunk 35 source-owned.**
- Chunk 36 source-ownership `0x00241000..0x00251000` (164 parts: 134 normal code + 28 data
  + 2 function straddlers, MIXED, mission-briefing/combat display-list module): incoming
  straddler-tail `func_00240FF0_chunk36tail` (`0x241000..0x2410A0`) → CODE → DATA island A
  (`0x243F14..0x2447A0`) → CODE (incl. recovered frameless GBI builders `func_0024A37C`/
  `func_0024A638`) → DATA island C (`0x24B410..0x24BCA0`) → CODE (frameless range-check
  `func_0024BCA0` + divide/scale-helper cluster) → outgoing straddler-head `func_00250F9C`
  (`0x250F9C..0x251000` → chunk 37). Two interior data islands carved via `build/carve_chunk.js`;
  parent-gap leads `0x24A37C`/`0x24BD60` proven CODE. Fixed divide-helper delay-slot leaks +
  a preamble-orphan boundary (`func_0024BE5C`). Adversarial clean (LOW data-naming nits only).
  Dossier + data index added. **Chunk 36 source-owned.**
- Chunk 37 source-ownership `0x00251000..0x00261000` (180 parts: 170 normal code + 8 data
  + 2 function straddlers, MIXED, command-dispatcher mission-briefing/combat code): incoming
  straddler-tail `func_00250F9C_chunk37tail` (`0x251000..0x2510E0`) → CODE region 1 (dense
  dispatchers; heavy parent-over-merge frameless-leaf recovery, e.g. `func_0025B394` → 6
  funcs) → DATA island F (`0x25E2BC..0x25EE90`, mixed 0x80x pointer/struct/float record
  table) → CODE region 2 (frameless FP/compare leaves) → outgoing straddler-head
  `func_00260F30` (`0x260F30..0x261000` → chunk 38). Adversarial clean (LOW data-note nits
  only). Dossier + data index added. **Chunk 37 source-owned.**
- Chunk 38 source-ownership `0x00261000..0x00271000` (232 parts: 230 normal code + 0 data
  + 2 function straddlers, ALL CODE, FP/GBI display-list + mission-briefing/combat dispatcher
  continuation of chunks 36-37): incoming straddler-tail `func_00260F30_chunk38tail`
  (`0x261000..0x26109C`, jr$ra@0x261094) → CODE `0x26109C..0x270FF0` (~230 functions;
  frameless-leaf dense; parent-gap frameless recoveries proven CODE: 288 B@0x2639D8 GBI
  display-list builder `func_002639E0`, 96 B@0x264FB4 `func_00264FC0`, 796 B@0x2664A4 switch
  dispatch `func_002664B0`/`func_00266550`) → outgoing straddler-head `func_00270FF0`
  (`0x270FF0..0x271000` → chunk 39, returns jr$ra@0x271068). Content scan + boundary gates
  confirmed NO data island. Adversarial 6 verifiers: 3 HIGH fixed (over-merge un-split
  func_00263050→4; preamble folds func_00261D00, func_00267108), 3 clean. Dossier added; no
  data index (all code). **Chunk 38 source-owned.**
- Chunk 39 source-ownership `0x00271000..0x00281000` (155 parts: 135 normal code + 19 data
  + 1 function straddler-tail, MIXED, 3 code regions + 3 interior data islands; the most
  interleaved chunk so far): incoming straddler-tail `func_00270FF0_chunk39tail`
  (`0x271000..0x271070`, jr$ra@0x271068) → CODE R1 `0x271070..0x273FFC` → DATA A
  `0x273FFC..0x275850` (6,228 B big territory: 136/272-word RAM-pointer tables, packed blobs,
  ID/float arrays, overlay handler pointer table, float64 pool [pi-like/3.0/180.0], an 8-row
  jump table) → CODE R2 `0x275850..0x279DA8` (frameless band 0x275850.. + dispatchers) → DATA B
  `0x279DA8..0x27A020` (632 B static GBI/F3DEX2 display-list asset) → CODE R3 `0x27A020..0x280D48`
  (functions + frameless GBI/FP builders at 0x27B1B4/0x27D050/0x2804D4/0x280970) → DATA C
  `0x280D48..0x281000` (696 B small-int LUTs + zero-fill + 640/480 screen-dim records). Chunk
  ENDS IN DATA — no outgoing straddler; frontier 0x281000 clean. 3 islands carved via
  carve_chunk; adversarial 7 verifiers (4 code + 3 data) ALL structurally CLEAN (only 4 LOW
  note-text fixes). Dossier + data index added. **Chunk 39 source-owned.**
- Chunk 40 source-ownership `0x00281000..0x00291000` (159 parts: 142 normal code + 16 data
  + 1 function straddler-head, MIXED): leading DATA L `0x281000..0x281860` (640/480 records
  continuing chunk 39 + ~314-word RAM-pointer table + Yes/No UI strings + float64 doubles) →
  CODE C1 (incl. dispatcher `func_00284288`, 87 callees) → DATA M `0x2866E4..0x286BD0` (float32
  pool + strings + zero-fill + 0x8022Axxx pointer table) → CODE C2 ending in OUTGOING
  straddler-head `func_00290D50` (`0x290D50..0x291000` → chunk 41; preamble 0x290D50 →
  prologue 0x290D58). No incoming straddler (started with data). Frameless recoveries (128 B@
  0x283D94, 224 B@0x286444, 1944 B@0x28F18C) proven CODE; 1 over-split fixed (func_0028A7B0/
  func_0028A7E4 merged — internal forward branch). Adversarial 6 verifiers ALL clean. Dossier +
  data index added. **Chunk 40 source-owned.**
- Chunk 41 source-ownership `0x00291000..0x002A1000` (160 parts: 134 normal code + 24 data
  + 2 function straddlers, MIXED): incoming straddler-tail `func_00290D50_chunk41tail`
  (`0x291000..0x2910DC`, jr$ra@0x2910D4) → CODE C1 (FP-heavy) → DATA D `0x299D44..0x29A4C0`
  (1,916 B: zero-fill + RAM-pointer tables + ASCII pools ['Palatinean Year'/'Saldian'/'Viragore']
  + 30.0f) → CODE C2 (incl. func_0029BBD8 delay-slot-prologue recovery) → OUTGOING straddler-head
  `func_002A0EF0` (`0x2A0EF0..0x2A1000` → chunk 42). Fixed 7 spurious straddler-head labels, 9
  preamble-orphan label conflicts, a 4-byte DATA D gap, and a slice-seam preamble fragment.
  Adversarial 5 verifiers ALL clean. Dossier + data index added. **Chunk 41 source-owned.**
- Chunk 42 source-ownership `0x002A1000..0x002B1000` (171 parts: 157 normal code + 12 data
  + 2 function straddlers, MIXED): incoming straddler-tail `func_002A0EF0_chunk42tail`
  (`0x2A1000..0x2A135C`, jr$ra@0x2A1354) → CODE C1 (FP-heavy; 156 B frameless matrix-transform
  leaf func_002A3310) → DATA A `0x2A82B4..0x2A8D20` (2,668 B: zero-fill + concept/emotion +
  element ['serene water'/'solid earth'/'ragng flame'/'swift wind'] string pools + RAM-pointer
  tables + float64 pool [pi] + trailing 0x802376E4 dispatch/jump table) → CODE C2 (frameless FP
  preamble func_002A90EC; 520 B frameless leaf) → DATA B `0x2AE338..0x2AE3C0` (136 B float64 pool:
  pi/180/90/160/120/0.5/1.0) → CODE C3 (204 B frameless leaf) → OUTGOING straddler-head
  `func_002B0E8C` (`0x2B0E8C..0x2B1000` → chunk 43). Fixed 4 spurious straddler-head labels, 44
  preamble-orphan label conflicts, a straddler-boundary overlap (func_002B0D30 end→0x2B0E8C), a
  slice-seam preamble fragment (func_002ADF30), and 1 MED adversarial preamble fix
  (func_002A8F24/func_002A90EC). Adversarial 7 verifiers clean (1 MED + LOW fixed). Dossier +
  data index added. **Chunk 42 source-owned.**
- Chunk 43 source-ownership `0x002B1000..0x002C1000` (90 parts: 81 normal code + 1 incoming
  straddler-tail + 8 data, MIXED — code then data tail): incoming straddler-tail
  `func_002B0E8C_chunk43tail` (`0x2B1000..0x2B1014`, jr$ra@0x2B100C) → CODE region
  `0x2B1014..0x2B89B8` (the mission-briefing/scenario-overview overlay, runtime RAM ~`0x8023Cxxx`;
  62 parent functions + recovered frameless leaves + preamble folds; all 4 parent-DB gaps are
  frameless code) → **code→data transition at `0x2B89B8`** (last function func_002B88C8 epilogue
  jr$ra@0x2B89B0 + delay@0x2B89B4; executable extent ends 0x2B89B4) → DATA tail `0x2B89B8..0x2C1000`
  (34,376 B, 8 parts: F3DEX2 display lists + IEEE float/double pools [pi/90/60f] + 'N64 PtrTablesV2'
  signature + trailing high-entropy texture tiles; 4 zero_fill + 4 data; raw-but-classified). No
  outgoing straddler (chunk ends in data, continues into chunk 44). Fixed 3 slice-seam preamble
  folds + 1 intra-slice preamble (func_002B1028) + 1 adversarial-caught frameless-leaf under-split
  (func_002B24F0 @0x2B24F0). Label normalization (5 redundant parent-boundary labels removed).
  Adversarial 6 skeptics: 5 clean + 1 real under-split (fixed). Dossier + data index added.
  Parent `4a_audit` sprite-blocks in this range rejected as scanner false positives. **Chunk 43
  source-owned.**
- Chunk 44 source-ownership `0x002C1000..0x002D1000` (17 parts: 9 data + 8 zero_fill, 0 code —
  DATA TERRITORY): the entire 64 KiB chunk is non-code data, PAST the evidenced executable-MIPS
  extent end `0x002B89B4`. It continues chunk 43's `data_002BF118` high-entropy texture tail. Proof
  of non-code: **0 jr$ra, 0 stack prologues, 0 RAM-pointer words** across all 16,384 words; no real
  ASCII strings; no archive/LZSS magic. Owned as 9 `data_` high-entropy graphics/texture asset spans
  (raw-but-classified; possibly compressed, each block leads with a small `0x00xxxxxx` length-prefix
  hypothesis) + 8 `zero_fill_` parts (16–28 B, parsed) at the real zero-runs separating texture
  objects. No incoming/outgoing straddler. Adversarial 4 skeptics (3 region hidden-code+structure
  scans + 1 tiling): ALL clean (no hidden code, no missed structure). Dossier + data index added.
  Global non-code tail NOT reclassified (only chunk-44 bytes owned). **Chunk 44 source-owned.**
- Chunk 45 source-ownership `0x002D1000..0x002E1000` (15 parts: 8 data + 7 zero_fill, 0 code —
  DATA TERRITORY): the entire 64 KiB chunk is non-code data, PAST the executable extent `0x002B89B4`.
  It continues chunk 44's `data_002CBA58` high-entropy texture tail seamlessly (no zero gap at the
  `0x2D1000` seam). Proof of non-code: **0 jr$ra, 0 stack prologues, 0 RAM-pointer words** across all
  16,384 words; 3,156 coincidental ASCII bytes (no real strings); no archive/LZSS magic. Owned as 8
  `data_` high-entropy graphics/texture asset spans (raw-but-classified; possibly compressed) + 7
  `zero_fill_` parts (16–28 B, parsed). Last part `data_002E0D68` runs to the chunk end (continues
  into chunk 46). Parent evidence: 4f_audit RGBA sprite-tile leads at the chunk start (`0x2d112c`/
  `119c`/`11fa`/`12a4`), 4a RGBA32 straddler `0x2d0fe2` — asset-shape hints only. Adversarial 2
  skeptics (hidden-code+structure + tiling): clean. Dossier + data index added. **Chunk 45 source-owned.**
- Chunk 46 source-ownership `0x002E1000..0x002F1000` (17 parts: 9 data + 8 zero_fill, 0 code —
  DATA TERRITORY): the entire 64 KiB chunk is non-code data, PAST the executable extent `0x002B89B4`.
  It continues chunk 45's `data_002E0D68` high-entropy texture tail. Proof of non-code: **0 jr$ra,
  0 stack prologues, 0 RAM-pointer words** across all 16,384 words; 1,564 coincidental ASCII bytes
  (no real strings); no archive/LZSS magic. Owned as 9 `data_` high-entropy graphics/texture asset
  spans (raw-but-classified; possibly compressed) + 8 `zero_fill_` parts (16–32 B, parsed). Last part
  `data_002EF7F8` runs to the chunk end (continues into chunk 47). **Runtime-load evidence**: 3 real
  PI-DMA cart→RAM transfers source this chunk (romoff `0x2e1110`/`14c2`/`1872`, 0x3c0 B each,
  archive-unmapped raw asset bytes — `Cutscene Frames/dma_log.txt`); 4a CI4 asset-shape hint at
  `0x2e81d8` (scanner-flooded). Adversarial 2 skeptics: clean. Dossier + data index added. **Chunk 46
  source-owned.**
- Chunk 47 source-ownership `0x002F1000..0x00301000` (27 parts: 14 data + 13 zero_fill, 0 code —
  DATA TERRITORY): the entire 64 KiB chunk is non-code data, PAST the executable extent `0x002B89B4`.
  It continues chunk 46's `data_002EF7F8` high-entropy texture tail. Proof of non-code: **0 jr$ra,
  0 stack prologues, 0 RAM-pointer words** across all 16,384 words; 1,324 coincidental ASCII bytes
  (no real strings); no archive/LZSS magic. Owned as 14 `data_` high-entropy graphics/texture asset
  spans (raw-but-classified; possibly compressed) + 13 `zero_fill_` parts (16–32 B, parsed; more
  frequent object boundaries than chunks 45-46). **OUTGOING data continuation**: the final part
  `data_003002E8` (3,352 B) runs to `0x00301000` with no terminating zero-fill and continues into
  chunk 48. Adversarial 2 skeptics: clean. Dossier + data index added. **Chunk 47 source-owned.**
- Section A slice 1 ownership `0x00301000..0x00341000` (chunks 48-51; 46 parts: 25 data + 21
  zero_fill, 0 code — DATA TERRITORY): first ownership batch of survey Section A (0x301000..0x4E3000).
  Continues chunk 47's `data_003002E8` high-entropy asset tail seamlessly (no zero gap at the 0x301000
  seam). Proof of non-code: **0 jr$ra, 0 stack prologues, 0 RAM-pointer words** across all 65,536
  words; no real ASCII strings; no archive/LZSS/MIO0 magic. Owned as 25 `data_` high-entropy asset
  spans (raw-but-classified; TYPE UNRESOLVED — graphics/texture vs audio-codec-residual per the survey)
  + 21 `zero_fill_` parts (parsed). Parent evidence: 0 functions/0 archives/0 anim-blocks in range;
  parent 4a/4f in-range gapOffsets are decompressed-7MB-LZSS-stream offsets (byte-rejected, NOT ROM);
  the Section-B 0x4E3158 index table was byte-tested against this slice and does NOT classify it
  (arithmetic-only coincidence at base 0x301000, no record structure). Adversarial 4 passes (2
  hidden-code + tiling QA + parent comparator): all clean. Index
  `docs/data-index/rev0/section-a-00301000-00341000-data-inventory.json` + dossier added. Outgoing
  continuation `data_0033FD78` into chunk 52. **Chunks 48-51 source-owned (Section A slice 1).**
- Section A slice 2 ownership `0x00341000..0x003E1000` (chunks 52-61; 64 parts: 37 data + 27 zero_fill,
  0 code — DATA TERRITORY): second ownership batch of survey Section A, a 10-chunk slice (proven-clean
  data-only). Continues slice 1's `data_0033FD78` seamlessly (seam at 0x341000 non-zero both sides).
  Proof of non-code: **0 jr$ra, 0 stack prologues AND 0 epilogues/lw $ra at all 4 byte alignments, 0
  pointer runs** across all 163,840 words; 0 real strings (≥4-letter dictionary test = 0 hits; elevated
  printable counts in chunks 59-61 are garbage); no archive/LZSS/MIO0 magic. Owned as 37 `data_`
  high-entropy asset spans (raw-but-classified; TYPE UNRESOLVED) + 27 `zero_fill_` parts (parsed).
  Parser decoded the **container layout** (37 objects + 27 zero pads, all post-pad boundaries
  8-aligned-never-16) but object contents stay undecoded. **Parent-tooling-dark**: 0 functions/0
  archives/0 anim-blocks in range; 4a/4f in-range gapOffsets byte-disproven (decompressed-7MB-stream,
  NOT ROM — stream `block_3126_0x341e44` e6f70000.. ≠ ROM 0x341E44 dcbd53ae..); B-table-to-A re-tested
  + rejected (0 in-range under all 4 mandated bases). Adversarial swarm 6 passes (2 hidden-code +
  parent + parser + QA + independent reviewer): unanimous `yes`. 10-chunk batch preserved review
  quality (machine-checkable standard scales O(bytes)); 10 = safe ceiling for flat data-only Section A,
  drop to 4 on any heterogeneity. Index `docs/data-index/rev0/section-a-00341000-003E1000-data-inventory.json`
  + dossier added. Outgoing continuation `data_003DE988` into chunk 62. **Chunks 52-61 source-owned (Section A slice 2).**
- Section A slice 3 ownership `0x003E1000..0x00421000` (chunks 62-65; 32 parts: 18 data + 14 zero_fill,
  0 code — DATA TERRITORY) — a **FALLBACK** from the planned 10-chunk batch (62-71). Continues slice 2's
  `data_003DE988` seamlessly. Entropy 7.14-7.30 (min-2KB 6.49-6.97); 0 jr$ra/0 prologues/0 epilogues at
  all 4 byte alignments (discriminator validated vs control .text). **Fell back at `0x421000`** because
  chunk 66 is a **decoded N64 audio sound-bank** — embedded magics `N64 PtrTablesV2` @0x423FF0 +
  `N64 WaveTables` @0x429CD0, a 133-record directory (strides 0xA0/0xD0, offset table @0x429820) +
  WaveTables sample payload, with a low-entropy structured region (2.66 bits/2KB @0x429800, the
  survey-documented 519B zero run @0x429AC1 = bank padding). This trips the `<6.0 bits/2KiB → fall back`
  rule and is **strong evidence the entire Section A family is AUDIO, not texture** (kept conservative
  for 62-65; magics are in chunk 66). Parent-tooling-dark (all leads byte-rejected). Adversarial swarm 5
  passes: unanimous `yes` for 62-65, fallback endorsed. Index
  `docs/data-index/rev0/section-a-003E1000-00421000-data-inventory.json` + dossier added. Outgoing
  continuation `data_00420438` into chunk 66. **Chunks 62-65 source-owned (Section A slice 3, fallback).**
- Section A chunk-66 audio sound-bank ownership `0x00421000..0x00431000` (focused 1-chunk decode run; 8
  structural parts: 5 data + 3 zero_fill, 0 code). The deferred slice-3 anomaly, now DECODED as a custom-
  framed N64 VADPCM sound-bank: `N64 PtrTablesV2\0` magic @0x423FF0 + a 133-record codebook table
  (recordCount field 0x85; strides 0xA0×106/0xD0×26/0xB0×1 = 0x5810 contiguous; **codec = standard order-2
  N64 libultra VADPCM**, +0x28=2; the 26 0xD0 records ↔ nonzero +0x1C) + a 133-entry u32-BE offset table
  @0x429820 (base 0x423FE0, monotonic, deltas = strides) + three zero pads + `N64 WaveTables \0` @0x429CD0
  (two 0xD3000000 sentinel words; 4-bit ADPCM sample payload, U-shaped nibbles, entropy 7.26). Proof of
  non-code: 0 jr$ra/0 prologues/0 epilogues at all 4 alignments; coeffs centered near 0 (ADPCM book, not
  addresses); offset table no KSEG. Parent: PtrTablesV2 is a GENERIC container (same magic in chunk 43
  @0x2B8BA0 is graphics); no parent loader reads these magics. 5-pass swarm: chunk-66 bytes `yes`,
  whole-bank schema `partial` (WaveTables payload continues into chunk 67, ends ~0x431EF4). Index
  `docs/data-index/rev0/section-a-audio-bank-00421000-00431000-data-inventory.json` + dossier added.
  Outgoing continuation `data_00429CC8` (WaveTables payload) into chunk 67. **Chunk 66 source-owned (audio sound-bank).**
- Section A audio-bank WaveTables TAIL closure `0x00431000..0x00441000` (focused 1-chunk run; 21 parts:
  11 data + 10 zero_fill, 0 code). Closes the chunk-66 bank: the WaveTables sample payload (data_00429CC8)
  continues across 0x431000 as `data_00431000` and ENDS at last-non-zero byte **0x431EF0** (`...1f 1f 1f
  1f 01 3f`), terminated by a 24-byte zero run 0x431EF1..0x431F09 (= `zero_fill_00431EF4`). Bank WaveTables
  span = `0x429CD0..0x431EF1` (~33,313 B of 4-bit ADPCM). **NO new PtrTablesV2/WaveTables header in chunk
  67**; the post-tail 0x431F08..0x441000 is flat high-entropy Section A audio sample data (U-shaped
  nibbles, 2KB entropy 6.57-7.26, no <6.0 window). Proof of non-code: 0 jr$ra/0 prologues/0 epilogues at
  all 4 alignments. Parent: anyAcceptedRomLead=false; 4a gapOffset 0x440172 byte-rejected (decompressed-
  stream coord; ROM there is flat audio). 5-pass swarm: chunk-67 bytes `yes`, chunk-66+67 audio-bank unit
  `partial` (payload byte-bounded but directory→sample addressing unmapped). Index
  `docs/data-index/rev0/section-a-audio-bank-tail-00431000-00441000-data-inventory.json` + dossier added.
  Outgoing flat-audio continuation `data_0043F3D8` into chunk 68. **Chunk 67 source-owned (WaveTables tail closure).**
- Section A flat-audio slice `0x00441000..0x004E1000` (standard 10-chunk batch; chunks 68-77; 194 parts:
  102 data + 92 zero_fill, 0 code). The flat raw 4-bit ADPCM/VADPCM Section A audio sample payload after
  the chunk-66/67 bank. Continues chunk-67 `data_0043F3D8` seamlessly. Whole-range entropy 7.309; NO
  sub-bank header (0 PtrTablesV2/WaveTables/AIFC/CTL/TBL anywhere); canonical 4-bit signed-delta ADPCM byte
  histogram. 4 of 320 2KB-windows dip <6.0 but were confirmed **quiet/low-amplitude ADPCM, NOT structure**
  (extreme U-shaped nibbles, no zeros/markers) — the <6.0-fallback rule was correctly NOT triggered.
  Proof of non-code: 0 jr$ra/0 prologues/0 epilogues at all 4 alignments (disasm = the structural inverse
  of code: 0 NOPs, 14-36% branch density, illegal encodings). Parent: anyAcceptedRomLead=false; 4a gapOffset
  0x44DB22 byte-rejected (stream coord). 5-pass swarm: ownership `yes`, **10-chunk batch stayed clean (no
  fallback)**. Index `docs/data-index/rev0/section-a-flat-audio-00441000-004E1000-data-inventory.json` +
  dossier added. Outgoing `data_004E0CE8` into chunk 78. **Chunks 68-77 source-owned (flat Section A audio).**
- Section A/B boundary + Section B index start `0x004E1000..0x004F1000` (focused 1-chunk natural-boundary
  run; chunk 78; 4 structural data parts, 0 code). Crosses the **Section A/B boundary, byte-pinned at
  `0x4E3140`**. Parts: (1) `data_004E1000` Section A AUDIO tail (continuation of `data_004E0CE8`, ends at
  the boundary); (2) `data_004E3140` SECTION B INDEX TABLE — header [recordCount 0x706=1798, ..., 0xDC6A
  payloadLen] + 1798 records [u32-BE offset, u32-BE 0x64], base 0x4E3140, table 0x4E3140..0x4E6988 (shape
  DECODED; 0x64 = constant flag not length; records index 0x80-terminated event streams); (3)
  `data_004E6988` SECTION B PAYLOAD (42,536 B, UNDECODED); (4) `data_004F0FB0` first cutscene
  audio-sequence block HEAD (tag 0x215, size 0x30C0 -> ends 0x4F4070). **Accepted byte-verified ROM lead:**
  parent `ob64_anim_block_catalog.json` block 0 @0x4F0FB0 (63 blocks 0x4F0FB0..0x594280, roundtrip_ok) +
  `anim_block_codec.py` (cutscene music/SFX, Gate-proven). 0 jr$ra/0 prologues at all 4 alignments. 5-pass
  swarm: chunk-78 bytes `yes`, Section B unit `partial`. Index
  `docs/data-index/rev0/section-a-to-b-boundary-004E1000-004F1000-data-inventory.json` + dossier added.
  Outgoing first-block continuation into chunk 79. **Chunk 78 source-owned (A/B boundary + Section B start).**
- Section B cutscene audio-sequence blocks `0x004F1000..0x00591000` (parser-backed natural-block run;
  chunks 79-88; 71 parts, 0 code) — a **FALLBACK at 0x591000**. Owns the 63-block cutscene audio-sequence
  family's body: block 0 body (continuation of chunk-78 `data_004F0FB0` across 0x4F1000) + blocks 1-60
  whole + block 61 head, cut at natural catalog block boundaries. Byte-verified (5-pass swarm): all 63
  blocks tag 0x00000215, header invariants hold (tag@+0, nch@+4, t1off@+C=0x38, t2off/t2end), perfect
  contiguity, family end 0x594280; ACCEPTED byte-verified ROM lead = parent `ob64_anim_block_catalog.json`
  + `anim_block_codec.py` (cutscene MUSIC/SFX, byte-identical roundtrip, Gate-2 proven). Proof of non-code:
  0 jr$ra/0 prologues/0 epilogues at all 4 alignments AND byte-agnostic (vs 2105 jr$ra in known code).
  **FALLBACK reason:** the family end 0x594280 + the B/C boundary 0x595000 are mid-chunk-89; assemble
  requires manifest chunks to exactly tile the 64KB report chunk, and owning the whole chunk 89 would
  include forbidden Section C past 0x595000 — so 0x591000 is the only pipeline-clean boundary. Deferred to
  chunk 89: block 61 tail + block 62 + the Section-B directory tail (a 65-entry u32-BE offset table
  @0x594280 indexing the decompressed Section C asset space). Index
  `docs/data-index/rev0/section-b-audio-sequence-blocks-004F1000-00595000-data-inventory.json` + dossier
  added. Outgoing block 61 tail into chunk 89. **Chunks 79-88 source-owned (Section B audio-sequence blocks, fallback).**
- Section B tail + Section C start `0x00591000..0x005A1000` (whole chunk 89; 5 structural parts, 0 code) —
  a **RUN-COMPLETE** that resolves the prior partial-interior-chunk fallback by owning both sides of the
  Section B/C boundary as separate subranges. Parts: block 61 tail (0x591000..0x592490) + block 62
  (0x592490..0x594280 = the FINAL/63rd anim block, **family end 0x594280**) + Section C 65-entry u32-BE
  **directory** (0x594280..0x594384; offsets 0x63DC..0x27C5F4, max 2.49 MB >> raw span 0xA24EC → indexes a
  DECOMPRESSED asset space) + 68 B zero pad + **Section C HUFFMAN-compressed pool start** (0x5943C8..,
  "HUFF" magic). 5-pass swarm byte-verified: blocks 61/62 close the family (codec roundtrip IDENTICAL);
  **Section C = an N64 JPEG/NJPG-style "HUFF" entropy pool, 29 blocks (first 0x5943D4, last 0x630BC4);
  Huffman entropy stage decoded offline 2026-06-28** — REFINES the survey's "no standard magic". B/C boundary
  pinned at **0x594280** (survey's ~0x595000 was 0xD80 too high, inside the pool). Proof of non-code:
  0 jr$ra at all 4 alignments; the lone prologue word 0x594A9C=0x27BD91B1 confirmed FALSE POSITIVE (inside
  HUFF data, no return). Index `docs/data-index/rev0/section-b-tail-section-c-start-00591000-005A1000-data-inventory.json`
  + dossier added. Outgoing Section C HUFF pool into chunk 90. **Chunk 89 source-owned (Section B tail + Section C start).**
- Section C HUFF pool tail `0x005A1000..0x0063676C` (chunks 90-99; 36 parser-backed parts, 0 code) — a
  **LOOP-COMPLETE** reaching the configured data-ownership stop **0x63676C**. Owns the rest of the Section C
  custom "HUFF" Huffman pool: 9 full chunks 90-98 + the **terminal partial chunk 99** (0x631000..0x63676C).
  Parts cut at **word-aligned HUFF block starts (magic-12) + chunk seams**; 0 zero_fill (no zero-runs >=16B).
  6-pass Ultracode swarm byte-verified: **29 HUFF blocks** (26 begin in span; first magic 0x5943D4, last
  0x630BC4), each with an 18-byte word-aligned container header `[u32 leadU32][48 55 fe 00][01 40 00 f0]
  ["HUFF"][01 2c]`; **NEW: leadU32 == blockSize-4 (self-relative container length) for all blocks 0..27**
  (verified). Blocks tile contiguously; HUFF entropy stage decoded to coefficient buffers (final image
  render pending; the editor LH5 codec is a different codec for the -lh5- archives @0x636784+). Proof of
  non-code: 0 jr$ra at ANY alignment; 0
  word-aligned prologues (5 non-word-aligned FPs); entropy ~7.97, 0 sub-6.0 KB windows = data-only-safe.
  Terminal partial chunk 99 fully promotable (assemble tiles against the report romEndExclusive 0x63676C).
  Index `docs/data-index/rev0/section-c-huff-pool-005A1000-0063676C-data-inventory.json` + dossier added.
  **Chunks 90-99 source-owned — code region 0x1000..0x63676C FULLY source-owned (0 fallback; loop complete).**
- Current remainder: **NONE — the entire configured code region `0x1000..0x63676C` is fully source-owned
  (0 generated fallback chunks; data-ownership loop COMPLETE).** Evidenced executable MIPS `0x1000..0x2B89B4`
  100% source-owned. **Section A (0x301000..0x4E3140) AUDIO; Section B audio-sequence-block family fully
  owned (family end 0x594280); Section C N64 JPEG/NJPG-style "HUFF" entropy pool fully owned
  0x5943C8..0x63676C (29 blocks, container decoded, Huffman entropy stage decoded; final image render
  pending).**
  **Current frontier: `0x0063676C` (configured code-region end / data-ownership stop) — REACHED.** Chunks
  90-99 owned the Section C HUFF pool tail to the stop. **Final consolidated coordinator report:
  `docs/FINAL_DATA_OWNERSHIP_REPORT_2026-06-24.md`.**
  Out of scope without Joe: the 24-byte structural gap `0x63676C..0x636784` and the LHA `-lh5-` archive
  region at `0x636784+`. Optional decode track: implement the NJPG render stage and resolve the remaining
  chunk-89 directory entries.

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

Chunks 0–99 (`0x00001000..0x0063676C`) are fully source-owned as named code/data
parts — **the entire configured code region is source-owned (0 generated fallback chunks); the
data-ownership loop is COMPLETE. Final consolidated report:
`docs/FINAL_DATA_OWNERSHIP_REPORT_2026-06-24.md`.** Chunk 43 (90 parts) is the MIXED code→data transition chunk: the mission-briefing/
scenario-overview overlay CODE region `0x2B1000..0x2B89B8` (incoming straddler-tail
func_002B0E8C_chunk43tail; 62 parent functions + frameless leaves) then the evidenced code→data
boundary at `0x2B89B8` and an F3DEX2 display-list/float-pool/texture DATA tail `0x2B89B8..0x2C1000`
(8 parts). Chunks 44-47 + Section A slices 1-3 (chunks 48-65) are DATA TERRITORY: each entire 64 KiB is
non-code high-entropy asset data past the executable extent (0 jr$ra/0 prologues/0 pointers),
`data_` + `zero_fill_` parts. Chunk 66 (`0x421000..0x431000`) is a DECODED N64 audio sound-bank
(`N64 PtrTablesV2` codebook + `N64 WaveTables` samples, order-2 VADPCM) — 8 structural parts; chunk 67
(`0x431000..0x441000`) closes that bank's WaveTables payload (ends 0x431EF1) + flat post-tail audio (21
parts); chunks 68-77 (`0x441000..0x4E1000`) are flat Section A audio sample payload (194 parts). All
CONFIRM Section A is AUDIO; the chunk-66+67 bank unit is `partial` (payload byte-bounded, addressing
unmapped). Chunk 78 (`0x4E1000..0x4F1000`) crosses the **Section A/B boundary** (pinned 0x4E3140): Section
A audio tail + Section B index table [1798 records, shape decoded] + Section B payload [undecoded] + first
parser-backed cutscene-block head (4 parts). Chunks 79-88 (`0x4F1000..0x591000`) are the Section B
parser-backed cutscene AUDIO-SEQUENCE blocks (71 parts; block 0 body + blocks 1-60 whole + block 61 head;
FALLBACK at 0x591000). Chunk 89 (`0x591000..0x5A1000`) owns the whole **Section B tail + Section C start**
(5 parts; RUN-COMPLETE resolving that fallback): block 61 tail + block 62 = anim-family end 0x594280 +
Section C 65-entry directory + zero pad + **Section C HUFFMAN-compressed "HUFF" pool start** (29 blocks,
N64 JPEG/NJPG-style HUFF entropy decoded; B/C boundary pinned 0x594280). Chunks 90-99
(`0x5A1000..0x63676C`) own the **Section C HUFF pool
tail** (36 parser-backed parts, LOOP-COMPLETE at the configured stop 0x63676C incl. the terminal partial
chunk 99): the rest of the 29-block N64 JPEG/NJPG-style "HUFF" entropy pool, parts cut at word-aligned
block starts (magic-12) + chunk seams, container header decoded (leadU32==blockSize-4 self-relative
length), Huffman entropy stage decoded to coefficient buffers, final image render pending, data-only-safe.
Dossiers: `docs/dossiers/lib-chunk4{3,4,5,6,7}-*.md` +
`docs/dossiers/section-a-00301000-00341000-data-ownership.md` +
`docs/dossiers/section-a-00341000-003E1000-data-ownership.md` +
`docs/dossiers/section-a-003E1000-00421000-data-ownership.md` +
`docs/dossiers/section-a-audio-bank-00421000-00431000-data-ownership.md` +
`docs/dossiers/section-a-audio-bank-tail-00431000-00441000-data-ownership.md` +
`docs/dossiers/section-a-flat-audio-00441000-004E1000-data-ownership.md` +
`docs/dossiers/section-a-to-b-boundary-004E1000-004F1000-data-ownership.md`; data indexes
`docs/data-index/rev0/chunk4{3,4,5,6,7}-data-region-inventory.json` +
`section-a-00301000-00341000-data-inventory.json` + `section-a-00341000-003E1000-data-inventory.json`
+ `section-a-003E1000-00421000-data-inventory.json` + `section-a-audio-bank-00421000-00431000-data-inventory.json`
+ `section-a-audio-bank-tail-00431000-00441000-data-inventory.json` + `section-a-flat-audio-00441000-004E1000-data-inventory.json`
+ `section-a-to-b-boundary-004E1000-004F1000-data-inventory.json` + `section-b-audio-sequence-blocks-004F1000-00595000-data-inventory.json`
+ `section-b-tail-section-c-start-00591000-005A1000-data-inventory.json`
+ `section-c-huff-pool-005A1000-0063676C-data-inventory.json`
(+ dossiers `docs/dossiers/section-b-audio-sequence-blocks-004F1000-00595000-data-ownership.md`
+ `docs/dossiers/section-b-tail-section-c-start-00591000-005A1000-data-ownership.md`
+ `docs/dossiers/section-c-huff-pool-005A1000-0063676C-data-ownership.md`).

Current frontier is **`0x0063676C` (configured code-region end / data-ownership stop) — REACHED**. The
evidenced executable MIPS extent `0x1000..0x2B89B4` (2,849,204 B) is **100.0000% source-owned**; the **entire
configured code region `0x1000..0x0063676C` (6,510,444 B = the assembled code.bin) is now 100% source-owned**
(code-only = 2,444,548 B = 85.7977% of the executable extent; the rest are interior + chunk-43..47 + Section
A audio + Section A/B boundary + Section B audio-sequence blocks + Section C HUFF pool). **0 generated
fallback chunks remain — the data-ownership loop is COMPLETE.**

FIRST for the next run: the data-ownership loop is **complete** — chunks 90-99 owned the Section C HUFF pool
tail to the configured stop `0x63676C` (LOOP-COMPLETE), so the whole code region is source-owned. **Final
consolidated coordinator report: `docs/FINAL_DATA_OWNERSHIP_REPORT_2026-06-24.md`.** No further library source-ownership frontier remains. Optional
follow-ups: (a) implement the NJPG render stage for Section C and resolve the remaining chunk-89 65-entry
directory entries; (b) the full-ROM coverage track below. Out of scope without Joe: the 24-byte structural gap
`0x63676C..0x636784` and the LHA `-lh5-` archive region at `0x636784+`.
**Section A (0x301000..0x4E3140) AUDIO; Section B family fully owned; Section C "HUFF" pool fully owned.**

The library source-ownership track is now COMPLETE through the configured code region. The full-ROM coverage
track (opened 2026-06-21)
next refines the exact code/data boundary near `0x002B89B4` and reclassifies the
non-code tail `0x002B89B4..0x0063676C` from `original_mips` to a data source
form, shrinking the configured code region to the executable extent while
keeping the exact rebuild gate green. See `docs/CODE_REGION_AUDIT.md` and
`docs/NEXT_STEPS.md`.
