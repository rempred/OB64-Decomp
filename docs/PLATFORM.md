# OB64 Decomp Platform

Read this after `../AGENTS.md`. It is the fast orientation document for future
agents who need to understand where the Rev 0 decomp repo stands without
reconstructing the parent workspace history.

## Purpose

`OB64 Decomp/` is the dedicated source-level decompilation repo for Ogre Battle
64: Person of Lordly Caliber, US Rev 0 only.

The intended finished output is a reproducible source tree that can build the
original ROM from:

- C source under `src/`.
- Original/reference MIPS under `asm/original/`.
- Nonmatching or handwritten MIPS under `asm/nonmatching/` only while C is not
  matching.
- Structured data and asset source forms under `data/` and `assets/`.

The parent `OgreBattlel64` workspace remains the research lab for emulator
traces, Project64 automation, editor experiments, patch builders, and large
generated artifacts. This repo should receive only stable decomp inputs, tools,
and curated notes.

## Source Of Truth Order

For decomp work, use this order:

1. `../AGENTS.md`
2. `docs/PLATFORM.md`
3. `docs/REV0_SCOPE.md`
4. `docs/TOOLCHAIN.md`
5. `docs/WORKFLOW.md`
6. `docs/DECOMP_LOG.md`
7. `docs/FULL_ROM_SOURCE_MANIFEST.md`
8. `docs/NEXT_STEPS.md`
9. Parent `docs/mips-decomp-workflow-plan.md`
10. Parent subsystem docs and trace artifacts as cited by the local note

When a durable fact changes, update `AGENTS.md` and the relevant `docs/` file in
the same commit.

## Current State

The repo has a Rev 0-only scaffold, verified baserom normalization, no-gap
original MIPS extraction for the configured code region, a whole-ROM structural
coverage ledger, raw span extraction, an exact byte-for-byte raw ROM rebuild,
and an assembly-backed code-region rebuild. Setup is complete: a project-local
GNU MIPS binutils toolchain is configured, tracked source chunks assemble through
real `mips64-elf-as`, and `node tools/verify_setup.js` verifies the whole setup.
The first source-layout loops have split the boot entry, early boot/resource
allocator/free block, resource validation/tree helpers, early loader/state loop,
boot mode/flag helper cluster, table/mask reconcile routine, boot mode/message
accumulator helper, resource-buffer reset/flag helper, resource state reset
wrapper, resource/display-list update cluster, display-list state emit helper,
display-list finalize/flip helper, display-list sync/modes helper, and
display-list counter-step/counter-packet helpers, resource window cache update
helper, bitstream cursor helper cluster, bitstream descriptor decode helper, and
bitstream descriptor encode helper, resource probe init helper, resource probe
finalize wrapper, resource probe dispatch-prepare helper, and resource probe
dispatch-apply helper, resource probe dispatch result-build helper, resource
probe global cleanup helper, resource probe chunk callback-walk helper,
resource probe global buffer copy helper, resource probe global buffer
signature-check helper, resource probe ID materialize helper, resource probe
dual-callback materialize helper, resource probe global-buffer dual-callback
apply helper, resource probe ID check/materialize helper, and resource probe
indexed-record check helper, resource probe large-record check helper, and
resource probe small-record check helper, resource probe indexed-record
copy/flag helper, resource probe large-record copy/flag helper, and resource
probe record checksum/signature helper, boot state dispatch loop init helper,
boot mode/message accumulator seed wrapper, boot resource table/mask apply
cluster, boot state global reset helper, boot state slot callback dispatch
helper, boot state slot render callback walk helper, boot state slot queue
service gate, boot resource global handle release helper, boot resource global
handle slot record prepare helper, boot state slot current peer record flag mark
helper, boot state slot target peer record dispatch helper, boot state slot
flagged dispatch/lookup helper, and boot state slot pool/table helpers into
named tracked parts, then queue record-step, queue F000 record-step, slot record
release/payload helpers, queue priority rebuild helper, no-op tails, and compact
record-copy leaf, display-list transform record emit helper, and transform
wrapper/clamped-rect emit helper, flagged rect packet emit helper, color rect
packet emit helper, vector distance/transform-prefix helper, transform
coefficients/sum-clear helper, command stream dispatch helper, command stream
resource-node dispatch helper, resource-node payload materialize helper, and
resource-node insert/find helper, resource-node context materialize helper,
resource-node LZSS context materialize helper, resource-node overlay context
materialize helper, resource-node recursive insert/slot-search helper,
resource-node recursive cleanup/free helper, and resource-node recursive
payload-clear helper, resource-node recursive field-`+0x0C` rewrite helper,
resource-node recursive child/free helper, resource-node recursive key/field
clear helper, byte copy/fill aligned leaves, the parent-labeled LZSS
decompressor, the boot resource record mark-ready helper, and the boot resource
loader callback-register helper into named tracked parts while preserving the
exact rebuild gate. The current setup gate also builds a
full-ROM source ownership manifest so non-code bytes are represented as
raw/archive/audio/LZSS/tail/padding source forms instead of being misclassified
as MIPS.

Current known-good pipeline:

```powershell
node tools/verify_setup.js
```

Expected current results:

- `verify_baserom.js` accepts the parent Rev 0 `.v64`, normalizes it to
  `build/baserom.us_rev0.z64`, and verifies Project64 CRC
  `E6419BC5/69011DE3`.
- `extract_original_mips.js` covers code region
  `0x00001000..0x0063676C` with no gaps.
- `build_rom_coverage_ledger.js` independently finds 825 valid LHA archives,
  matches the parent archive catalog offsets, and reports zero unknown bytes.
- `extract_rom_segments.js` emits 1,059 non-overlapping raw spans.
- `rebuild_rom.js` produces `dist/rebuilt.us_rev0.z64` and confirms an exact
  byte match against `build/baserom.us_rev0.z64`.
- `assemble_original_mips.js` emits `build/assembled/rev0/code.bin`, matching
  baserom code-region SHA256
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- `assemble_original_mips.js` currently uses 41 tracked composite
  real-assembler chunks (`0x00001000..0x00011000` 177; `0x00011000..0x00021000`
  350; `0x00021000..0x00031000` 216; `0x00031000..0x00041000` 67;
  `0x00041000..0x00051000` 376; `0x00051000..0x00061000` 88;
  `0x00061000..0x00071000` 78; `0x00071000..0x00081000` 103;
  `0x00081000..0x00091000` 87; `0x00091000..0x000A1000` 34;
  `0x000A1000..0x000B1000` 35; `0x000B1000..0x000C1000` 191;
  `0x000C1000..0x000D1000` 74; `0x000D1000..0x000E1000` 67;
  `0x000E1000..0x000F1000` 94; `0x000F1000..0x00101000` 153;
  `0x00101000..0x00111000` 95; `0x00111000..0x00121000` 66;
  `0x00121000..0x00131000` 95; `0x00131000..0x00141000` 80;
  `0x00141000..0x00151000` 175; `0x00151000..0x00161000` 99;
  `0x00161000..0x00171000` 99; `0x00171000..0x00181000` 73;
  `0x00181000..0x00191000` 63; `0x00191000..0x001A1000` 71;
  `0x001A1000..0x001B1000` 96; `0x001B1000..0x001C1000` 142;
  `0x001C1000..0x001D1000` 97; `0x001D1000..0x001E1000` 103;
  `0x001E1000..0x001F1000` 122; `0x001F1000..0x00201000` 86;
  `0x00201000..0x00211000` 198; `0x00211000..0x00221000` 109 files =
  6,181 tracked source files total across chunks 0–99; the per-chunk enumeration above is a HISTORICAL setup-milestone snapshot through chunk 33 — see DECOMP_LOG / the chunk list for current per-chunk counts), plus 0 generated fallback chunks (the entire configured code region 0x1000..0x63676C is now fully source-owned — data-ownership loop complete).
- `rebuild_rom.js --assembled-code ...` substitutes that assembled code blob for
  the raw code segment and still confirms the same full-ROM SHA256.
- `build_full_source_manifest.js` emits a 1,059-entry full-ROM source ownership
  manifest with zero unknown bytes and 2,469,141 ambiguous bytes preserved
  explicitly.
- `extract_non_code_sources.js` verifies 3 tracked non-code source owners under
  `data/source-owners/rev0/` and generates 1,055 ignored fallback owners for the
  remaining non-code spans.
- `tests/binutils_smoke.js` proves `.word`, real instruction, `.set noreorder`,
  and first tracked chunk real-assembler behavior.

Current rebuilt/reference SHA256:

```text
571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A
```

## Repo Invariants

- Rev 0 only until the build, compare, and overlay workflow is stable.
- Do not commit ROM binaries, savestates, save files, generated bulk outputs,
  object files, rebuilt ROMs, or local experiments.
- Documentation offsets use z64 byte order.
- Tool input may be `.v64`, `.z64`, or `.n64`, but extraction and comparison use
  canonical z64 bytes.
- Every configured byte must remain represented by source or raw span data. The
  decomp can have incomplete names and imperfect function boundaries; it cannot
  have missing bytes.
- The coverage ledger must keep using an independent archive scan. Do not rely
  on the parent archive catalog alone.
- `rebuild_rom.js` must stay green before replacing raw spans with assembly or C.

## Folder Map

```text
baserom/       local ROM inputs, ignored
config/        Rev 0 ROM profile, segments, overlays, symbols, linker inputs
include/       shared C headers and structs
src/           decompiled C source
asm/           original, nonmatching, and handwritten MIPS assembly
data/          tables, rodata, archive manifests, binary data source forms
assets/        extracted art/audio/model source artifacts
tools/         extraction, disassembly, coverage, rebuild, and compare tools
docs/          curated decomp notes and subsystem docs
wiki/          regenerated reports and imported function dossiers
tests/         parser, extraction, compare, and regression tests
build/         generated intermediates, ignored
dist/          rebuilt ROMs and reports, ignored
scratch/       local experiments, ignored
.toolchains/   local toolchains, ignored
```

## Generated Artifacts

These outputs are useful but ignored:

- `build/baserom.us_rev0.z64`
- `build/baserom.us_rev0.report.json`
- `build/original-mips/rev0/`
- `build/original-mips/rev0-report.json`
- `build/coverage/rev0-rom-coverage-ledger.json`
- `build/coverage/rev0-rom-coverage-ledger.md`
- `build/assembled/rev0/code.bin`
- `build/assembled/rev0-report.json`
- `build/segments/rev0/manifest.json`
- `build/segments/rev0/raw/`
- `build/rebuild/rev0-rebuild-report.json`
- `build/source-manifest/rev0-full-source-manifest.json`
- `build/source-manifest/rev0-full-source-manifest.md`
- `build/source-owners/rev0/`
- `build/rebuild/rev0-source-manifest-rebuild-report.json`
- `build/setup/verify-setup-report.json`
- `build/toolchain-smoke/binutils-smoke-report.json`
- `dist/rebuilt.us_rev0.z64`

## Structural Snapshot

- ROM size: 41,943,040 bytes.
- Code region currently extracted as original MIPS:
  `0x00001000..0x0063676C`.
- Chunks 0–99 (`0x00001000..0x0063676C`) are fully source-owned as named
  code/data parts (6,181 tracked source files: 177 in `boot/` + 6,004 in `lib/`;
  chunk 39: 135 code + 1 straddler-tail + 19 data, MIXED — mission-briefing/combat display-list
  code continuing chunks 36-38, wrapping THREE interior data islands (big data territory
  0x273FFC..0x275850 [136/272-word pointer tables + float64 pool + 8-row jump table]; GBI
  display-list blob 0x279DA8..0x27A020; tail small-int LUTs + zero-fill 0x280D48..0x281000);
  chunk ends in data, no outgoing straddler;
  chunk 38: 230 code + 2 straddler + 0 data, ALL CODE — FP/GBI display-list builders +
  mission-briefing/combat dispatchers (continuation of chunks 36-37), frameless-leaf dense;
  parent-gap frameless recoveries (288 B@0x2639D8 GBI builder, 796 B@0x2664A4 switch dispatch);
  chunk 36: 134 code + 2 straddler + 28 data, MIXED — mission-briefing/combat display-list
  module + TWO combat-overlay DATA islands + frameless GBI builders + divide/scale helpers;
  chunk 37: 170 code + 2 straddler + 8 data, MIXED — command-dispatcher mission-briefing/combat
  code + a 0x80x pointer/struct/float record-table DATA island, heavy frameless-leaf recovery;
  chunk 34: 89 code + 2 straddler + 29 data, MIXED — promotion/level-up/class-def code +
  a combat-overlay pointer/blob/float/string DATA island; chunk 35: 127 code + 2 straddler
  + 5 data, MIXED — class/promotion/display-list code + a float-ramp/0x801F record-table
  DATA island, frameless-leaf dense;
  chunk 11: 189 code + 2 straddler + 0 data, ALL CODE — 77 frameless leaves recovered;
  chunk 12: 72 code + 2 straddler + 0 data, ALL CODE — 20 dispatchers; chunk 13: 27
  code + 40 data, MIXED — unit-mgmt UI data; chunk 14: 74 code + 20 data, MIXED —
  graphics/display-list data + DL-builder code; chunk 15: 134 code + 19 data, MIXED —
  floats/display-list data + the OB64 opening-narration rodata; chunk 16: 72 code + 23
  data, MIXED — leading scenario record/pointer/float64 data + the neutral-encounter code
  path; chunk 17: 66 code + 0 data, ALL CODE — char-data/encounter code with incoming +
  outgoing function straddlers; chunk 18: 95 code + 0 data, ALL CODE — FP-heavy scenario/
  combat code; chunk 19: 64 code + 16 data, MIXED — encounter/dispatcher code (incl. the
  neutralEncounterDispatcher) + a trailing scenario data region (bit-LUT/pointer tables/
  record table/packed bytes) with an outgoing data straddler; chunk 20: 89 code + 86 data,
  MIXED — leading scenario data tables [neutral_encounter 40×20, creature_drop 36×8] +
  pointer tables + a 125-string game-text pool + encounter/dispatcher code with an outgoing
  function straddler; chunk 21: 94 code + 5 data, MIXED — class/character-lookup code [incl.
  the classLookup_full lead @0x1591FC] + a trailing high-entropy/compressed data region with
  an outgoing data straddler; chunk 22: 35 code + 64 data, MIXED — leading UI/text +
  weapon-type/terrain resource data + pointer/float pools wrapping FP-heavy menu/item/legion
  code, with incoming AND outgoing DATA straddlers; chunk 23: 40 code + 33 data, MIXED 6-region —
  scenario/camera + char-data code interleaved with two large data islands the parent DB
  mislabeled as functions [refuted byte-exactly], ending in the outgoing FUNCTION straddler
  func_0017FF4C; chunk 24: 40 code + 23 data, MIXED 3-region — FP/menu/display code wrapping a
  large ~26.7KB interior DATA region [font/tile bitmaps + fixed-stride record tables + 0x8021
  pointer tables + float64 pool] the parent DB again missed, with incoming AND outgoing FUNCTION
  straddlers; chunk 25: 59 code + 12 data, CODE-dominant MIXED — char/class/scenario code [incl.
  the documented record-builder func_0019554C, hook @0x195584] + a shop-dialogue string pool +
  2 inline data islands, with incoming AND outgoing FUNCTION straddlers; chunk 26: 81 code + 15
  data, CODE-dominant MIXED — FP-heavy char/class/scenario/encounter code + 3 inline DATA islands
  [Soldier/Thrust labels + jump table; a ~1.9KB ramp-LUT/packed-record/double-pool island after
  func_001A42A4; an options-menu string pool], incl. ESET loader func_001A6D64, reward-queue writer
  func_001AF828, 9.3KB dispatcher func_001A9290 (the editor's "0x1AB030 jump table" refuted as
  class-promotion CODE), with incoming AND outgoing FUNCTION straddlers; chunk 27: 128 code + 14
  data, CODE-dominant MIXED - FP-heavy class/char/encounter/resource code + status/menu string
  table island + display-list/float/color-LUT island, with incoming AND outgoing FUNCTION
  straddlers; chunk 28: 73 normal code + 22 data + 2 function straddlers, MIXED - stronghold/
  tutorial text + pointer/GBI-like data + packed command/script blobs + recovered frameless
  helpers; chunk 29: 97 normal code + 4 zero-fill data + 2 function straddlers, CODE-dominant
  MIXED - dense world-map/resource code + recovered frameless helpers; chunk 30: 89 normal code
  + 31 data + 2 function straddlers, MIXED - FP/RDP display-list world-map/resource code wrapping
  the Sound-Test/BGM-selection screen + staff-credits DATA territory [`0x1EE574..0x1F0A30`];
  chunk 31: 84 normal code + 0 data + 2 function straddlers, ALL CODE - FP/GBI display-list
  builders + attack/queue module code incl. the High-Attack cleanup-guard site at z64 `0x1F36F0`;
  chunk 32: 196 normal code + 0 data + 2 function straddlers, ALL CODE - frameless-leaf-dense
  FP/display-list + class-def/char-data code;
  chunk 33: 82 normal code + 25 data + 2 function straddlers, MIXED - code + a font/glyph +
  pointer/float DATA region [`0x211D14..0x213B10`] + a jump-table state-machine straddler);
  the configured code region is now fully source-owned through `0x0063676C` (chunk 99, the terminal partial chunk; 0 generated fallback chunks remain — data-ownership loop complete; the Section C HUFF pool is fully owned).
  chunk 1
  `0x11000..0x21000` is a graphics/unit-script/math/libc/libultra library; chunk 2
  `0x21000..0x31000` is the statically-linked libultra (N64 SDK) + libc + 64-bit
  runtime + `gu` matrix library + RSP-microcode data; chunk 3 `0x31000..0x41000`
  (DATA-DOMINANT) is a bundle of N64 RSP microcodes + the text-VM jump table +
  zero-fill/rodata, plus a 23-function overlay-relocated code tail; chunk 4
  `0x41000..0x51000` (CODE-DOMINANT) is overlay-relocated, frameless-leaf-dense
  code (RAM `0x8016B198+`), all conservative `func_*`; chunk 5 `0x51000..0x61000`
  (MIXED) is overlay code `0x5148C..0x5C208` + a ~20 KB game-data tail
  `0x5C208..0x61000` (F3DEX2 GBI display-list image, AI/element/attack name string
  pools, pointer/descriptor/order tables, two fixed-stride record tables); chunk 6
  `0x61000..0x71000` (MIXED + PARENT-UNDETECTED) is item/equipment data
  (`0x61000..0x66E10`) + parent-undetected overlay code (`0x66E10..0x70E70`) + a
  data tail (`0x70E70..0x71000`, straddles into chunk 7); chunk 7 `0x71000..0x81000`
  (MIXED 4-region) is a blob continuation + parent-undetected code
  (`0x71280..0x783A0`) + Controller-Pak/save-data menu data (`0x783A0..0x79730`) +
  parent-detected code (`0x79730..0x81000`, with an 11 KB switch-dispatcher and a
  chunk-8 straddler); chunk 8 `0x81000..0x91000` (MIXED 3-region) is a straddler
  tail + parent-detected code (`0x81000..0x85818`) + game data (`0x85818..0x87200`:
  mission/location-name pool + UI/options-menu pool + packed records + RAM-pointer
  tables) + code (`0x87200..0x91000`, with a chunk-9 straddler); chunk 9
  `0x91000..0xA1000` (ALL CODE) is army-mgmt / F3DEX display-list builders — 32
  framed functions + 2 straddlers, 1 preamble-orphan `func_00095258`, 2 jump-table
  dispatchers with tables in `0x801F` relocated RAM, 0 inline data, with a chunk-10
  straddler `func_000A0DAC` continuing to `0x000A118C`; chunk 10 `0xA1000..0xB1000`
  (ALL CODE) is more of the same family — 33 functions + 2 straddlers, 3
  preamble-orphans + 7 recovered frameless leaves (incl. the 6,944 B `func_000AB6D8`),
  5 jump-table dispatchers (tables in `0x801EF…` relocated RAM), 0 inline data, with
  a chunk-11 straddler `func_000B0BFC` continuing to `0x000B1F00`; chunk 11
  `0xB1000..0xC1000` (ALL CODE, frameless-leaf-DENSE) is FP-math + char-data/
  display-list code — 189 functions (112 framed + 77 recovered frameless) + 2
  straddlers, 4 gap clusters, 9 jump-table dispatchers (tables in `0x801F` relocated
  RAM), 0 inline data, with a chunk-12 straddler `func_000C0EDC` continuing to
  `0x000C132C`; chunk 12 `0xC1000..0xD1000` (ALL CODE) is FP-math +
  dispatcher-heavy char-data code — 72 functions + 2 straddlers, deferred-prologue
  `func_000C132C`, 12 frameless leaves, ~24 preamble-orphans, 20 jump-table
  dispatchers (tables in `0x801F` relocated RAM), 0 inline data, with a chunk-13
  straddler `func_000D0B8C` continuing to `0x000D110C`; chunk 13 `0xD1000..0xE1000`
  (MIXED) is dispatcher-heavy char-data code (`0xD1000..0xDAB18`, 26 fns + straddler-tail)
  then unit/battle-management UI data (`0xDAB18..0xE1000`, 40 data parts: string pools,
  RAM-pointer tables, IEEE floats, a display-list/command stream, + an outgoing
  packed/glyph data straddler `data_000e0bd0` into chunk 14); chunk 14 `0xE1000..0xF1000`
  (MIXED, 4 interleaved regions) is graphics/display-list DATA (`0xE1000..0xE48F0`) +
  DL-builder/char-data CODE (`0xE48F0..0xEAEFC`, incl. 3 leading frameless DL builders)
  + a pointer-table DATA island (`0xEAEFC..0xEBBB0`, with debug format strings) +
  char-data/FP CODE (`0xEBBB0..0xF1000`), with an incoming data straddler and an
  outgoing function straddler `func_000F0F64` into chunk 15; chunk 15 `0xF1000..0x101000`
  (MIXED, code-heavier, 5 interleaved regions) is an incoming FUNCTION straddler-tail
  (`0xF1000..0xF1354`) + CODE R1 (`0xF1354..0xF8550`) + floats/pointers/display-list
  DATA (`0xF8550..0xF9FF8`) + CODE R2 (`0xF9FF8..0x1003CC`) + tail DATA
  (`0x1003CC..0x101000`: packed records + the OB64 opening-prologue narration rodata
  `rodata_001006f0` + a pointer table + a fixed-stride float-record table) ending in an
  outgoing DATA straddler `data_00100fd4` into chunk 16; chunk 16 `0x101000..0x111000`
  (MIXED) is a leading scenario DATA region (`0x101000..0x101CE0`: a fixed-stride
  0x50-byte record-table tail continuing from chunk 15, 0x801A RAM-pointer/jump tables,
  and a float64 const pool) + the neutral-encounter CODE path (`0x101CE0..0x111000`;
  parent-documented LEADS: 0x102FA8 scenario dispatcher, 0x105CC8 text_renderer,
  0x10D484/0x10DDBC spawn helpers — names stay `func_*`) with an outgoing FUNCTION
  straddler `func_00110160` into chunk 17; chunk 17 `0x111000..0x121000` (ALL CODE) is
  char-data/encounter code — incoming straddler-tail `func_00110160_chunk17tail`
  (`0x111000..0x111464`) + ~64 functions + outgoing straddler-head `func_00120FC4`
  (`0x120FC4..0x121000`) into chunk 18; chunk 18 `0x121000..0x131000` (ALL CODE) is
  FP-heavy scenario/combat code — incoming straddler-tail `func_00120FC4_chunk18tail`
  (`0x121000..0x1211F8`) + ~93 functions + outgoing straddler-head `func_00130E60`
  (`0x130E60..0x131000`) into chunk 19; chunk 19 `0x131000..0x141000` (MIXED) is
  encounter/dispatcher CODE (`0x131050..0x13C49C`, incl. the `neutralEncounterDispatcher`
  @0x13C068 named conservatively `func_0013C060`) + a trailing DATA region
  (`0x13C49C..0x141000`: bit-LUT + 0x801E pointer tables + a fixed-stride record/script
  table + packed-byte tail straddling into chunk 20); chunk 20 `0x141000..0x151000` (MIXED)
  is leading scenario DATA (`0x141000..0x145210`: packed-byte straddler + gfx/float pools +
  the documented `neutral_encounter_table` [40×20 @0x141ED0] and `creature_drop_table`
  [36×8 @0x142258] + 0x801A/0x801B pointer tables + a 125-string game-text pool @0x1432E4) +
  encounter/dispatcher CODE (`0x145210..0x151000`, an inline data island @0x14DE88) with an
  outgoing function straddler `func_00150550` into chunk 21; chunk 21 `0x151000..0x161000`
  (MIXED) is class/character-lookup CODE (`0x15105C..0x15FBF0`, incl. the `classLookup_full`
  lead @0x1591FC named conservatively `func_001591FC`) + a trailing high-entropy/compressed
  DATA region (`0x15FBF0..0x161000`) with an outgoing data straddler `data_0015FDF8` into
  chunk 22; chunk 22 `0x161000..0x171000` (MIXED) is leading resource DATA
  (`0x161000..0x165FC0`: incoming straddler-tail + packed/bitmap blobs + 0x801F/0x8021 pointer
  & float pools + decoded ASCII pools — weapon/armor type-name table @0x163FC0, terrain+UI
  message pool @0x1650A0) + FP-heavy menu/item/legion CODE (`0x165FC0..0x16FB90`, entry
  `func_00165FC0` preamble-orphan) + a trailing DATA region (`0x16FB90..0x171000`: UI strings +
  GBI/RDP display-list data) with an outgoing `0xF83E` packed-halfword straddler
  `data_001708C8_chunk22head` into chunk 23; chunk 23 `0x171000..0x181000` (MIXED, 6 regions) is
  leading DATA → scenario/camera CODE1 (`0x171EA0..0x175F28`) → DATA island1
  (`0x175F28..0x177ED0`, incl. a 408B tutorial help-message) → char-data CODE2
  (`0x177ED0..0x17BCD0`) → DATA island2 (`0x17BCD0..0x17F9C0`, largest; packed/high-entropy) →
  CODE3 (`0x17F9C0..0x181000`) ending in the outgoing FUNCTION straddler-head `func_0017FF4C`
  into chunk 24 — the two data islands were proven byte-exactly to be data (0 prologues/returns),
  refuting the parent DB's "function" mislabel; chunk 24 `0x181000..0x191000` (MIXED, 3 regions)
  is CODE1 (`0x181000..0x1822E4`, incoming straddler-tail func_0017FF4C_chunk24tail + FP/menu code)
  → a large interior DATA region (`0x1822E4..0x188B60`, ~26.7KB: font/tile bitmaps + fixed-stride
  record tables [363×0x10, 177×0x10] + 0x8021 RAM-pointer tables + float64 pool — again missed by
  the parent DB, 0 prologues/returns) → CODE2 (`0x188B60..0x191000`, char/display code incl. the
  8788B func_00189778 + inline data island data_0018F044) ending in the outgoing FUNCTION
  straddler-head `func_0018FB30` into chunk 25; chunk 25 `0x191000..0x1A1000` (CODE-dominant MIXED)
  is char/class/scenario CODE1 (`0x191000..0x19BFF0`, incl. the documented record-builder
  func_0019554C [hook @0x195584] + huge func_001960A8 + dispatcher func_001977E0 + 2 inline data
  islands) → a shop-dialogue STRING POOL (`0x19BFF0..0x19C760`, rodata + handler-pointer tables) →
  CODE2 (`0x19C760..0x1A1000`) ending in the outgoing FUNCTION straddler-head `func_001A0264` into
  chunk 26; chunks 26-27 are now also source-owned, and chunk 18 remains all code (dossiers
  `docs/dossiers/boot-resource-decode-subsystem-B030-F22C.md`,
  `docs/dossiers/boot-codec-libc-vec3-F22C-11000.md`,
  `docs/dossiers/lib-chunk1-11000-21000.md`,
  `docs/dossiers/lib-chunk2-21000-31000.md`,
  `docs/dossiers/lib-chunk3-31000-41000.md`,
  `docs/dossiers/lib-chunk4-41000-51000.md`,
  `docs/dossiers/lib-chunk5-51000-61000.md`,
  `docs/dossiers/lib-chunk6-61000-71000.md`,
  `docs/dossiers/lib-chunk7-71000-81000.md`,
  `docs/dossiers/lib-chunk8-81000-91000.md`,
  `docs/dossiers/lib-chunk9-91000-A1000.md`,
  `docs/dossiers/lib-chunk10-A1000-B1000.md`,
  `docs/dossiers/lib-chunk11-B1000-C1000.md`,
  `docs/dossiers/lib-chunk12-C1000-D1000.md`,
  `docs/dossiers/lib-chunk13-D1000-E1000.md`,
  `docs/dossiers/lib-chunk14-E1000-F1000.md`,
  `docs/dossiers/lib-chunk15-F1000-101000.md`,
  `docs/dossiers/lib-chunk16-101000-111000.md`,
  `docs/dossiers/lib-chunk17-111000-121000.md`,
  `docs/dossiers/lib-chunk18-121000-131000.md`,
  `docs/dossiers/lib-chunk19-131000-141000.md`,
  `docs/dossiers/lib-chunk20-141000-151000.md`,
  `docs/dossiers/lib-chunk21-151000-161000.md`,
  `docs/dossiers/lib-chunk22-161000-171000.md`,
  `docs/dossiers/lib-chunk23-171000-181000.md`,
  `docs/dossiers/lib-chunk24-181000-191000.md`,
  `docs/dossiers/lib-chunk25-191000-1A1000.md`,
  `docs/dossiers/lib-chunk26-1A1000-1B1000.md`,
  `docs/dossiers/lib-chunk27-1B1000-1C1000.md`).
- Executable extent (evidence, `tools/audit_code_region.js`):
  `0x00001000..0x002B89B4`. The trailing `0x002B89B4..0x0063676C` (3,661,240
  bytes, 56.24%) has zero `jr $ra` and is non-code data still emitted as `.word`
  `original_mips`; reclassification is the next full-ROM-coverage step. See
  `docs/CODE_REGION_AUDIT.md`.
- Valid parsed LHA archives: 825.
- Parent archive catalog count and offsets match the independent scan.
- Method-like signatures: 837 total, 12 rejected or unparsed, none in unknown
  space.
- Unknown bytes: 0.
- Archive-gap bytes: 2,429,124.
- Tail data: `0x0275415B..0x0275DD40`.
- Clean trailing `0xFF` padding: `0x0275DD40..0x02800000`.
- Known visible archive/audio overlap:
  `0x00925483..0x009254EF` (108 bytes).
- Full-ROM source manifest: 1,059 contiguous entries; 6,510,444 bytes
  `original_mips`; 35,432,596 bytes non-code/raw/data/archive source forms;
  2,469,141 ambiguous bytes preserved explicitly; 0 unknown bytes.
- Source-owner rebuild: 3 tracked non-code owner files under
  `data/source-owners/rev0/` (44,029 bytes), 1,048 generated fallback files under
  `build/source-owners/rev0/` (35,388,567 bytes), source-manifest rebuild exact.

## Current Tool Roles

- `tools/verify_baserom.js` verifies Rev 0 identity and writes canonical z64.
- `tools/extract_original_mips.js` emits no-gap `.word` MIPS reference chunks
  for the configured code region.
- `tools/build_rom_coverage_ledger.js` builds the whole-ROM structural ledger
  and rejects suspicious archive-like signatures outside valid LHA headers.
- `tools/extract_rom_segments.js` extracts the ledger's non-overlapping spans as
  raw rebuild inputs.
- `tools/rebuild_rom.js` rebuilds from the segment manifest and fails on any
  byte mismatch. With `--assembled-code`, it substitutes an assembled code blob
  for the configured code-region span.
- `tools/build_full_source_manifest.js` assigns every ROM byte to a source
  strategy and audits ledger/segment/original-MIPS consistency.
- `tools/promote_non_code_sources.js` promotes selected non-code manifest
  entries into tracked `data/source-owners/rev0/` source owners.
- `tools/extract_non_code_sources.js` verifies tracked non-code source owners
  when present and writes ignored byte-exact fallback source-owner files for
  every unpromoted non-code manifest entry.
- `tools/rebuild_from_source_manifest.js` rebuilds from assembled original MIPS
  plus source-owner files and byte-compares against the baserom.
- `tools/assemble_original_mips.js` assembles tracked/generated source chunks
  into one code-region binary. Tracked chunks use GNU `mips64-elf-as`; generated
  fallback chunks use the minimal `.word` assembler. Manifest chunk `parts` are
  assembled in order for named source splits.
- `tools/promote_original_mips.js` promotes generated chunks into tracked
  `asm/original/rev0/` source in deliberate batches.
- `tools/audit_code_region.js` is a read-only code-region audit: it unions the
  parent valid-function intervals and an intrinsic per-window `jr $ra`/opcode/
  pointer/zero/ASCII scan to report the executable extent versus non-code data
  inside the configured code region, and runs a static control-flow edge audit
  (direct branch/J/JAL targets into the suspected data tail). Parent JSON is
  required by default (missing/corrupt = hard error; `--allow-missing-parent-db`
  for intrinsic-only). Reports go to ignored
  `build/coverage/rev0-code-region-audit.json/.md`; it does not touch the rebuild
  path. See `docs/CODE_REGION_AUDIT.md`.
- `tools/dump_function_context.js` is a read-only analysis aid for split passes:
  for a ROM range it joins parent function boundaries, the `symbols_v2` callgraph
  (callees/callers with names), accessed globals, top constants, secondary
  entries, and flags into a per-function context report under ignored
  `build/context/`. Parent JSON required by default (`--allow-missing-parent-db`).
- `tools/split_original_mips_part.js` splits one tracked manifest part into named
  sub-parts (contiguous, no-gap-validated), preserving exact `.word` lines. The
  `--splits-file` entries accept `kind` (`data` / `straddler-head` /
  `straddler-tail`) and `note` for honest data/straddler/recovered-boundary
  headers.
- `tools/plan_chunk.js` → `tools/slice_chunk.js` → (analysis swarm) →
  `tools/integrate_chunk.js` → `tools/check_splits.js` are the chunk-split
  pipeline used for chunks 1+: plan a base partition from the function-context
  report, slice it for the per-slice analysis swarm, integrate the swarm's
  results into a validated `--splits-file`, and run an adversarial fragment check.
  They write only gitignored `build/` artifacts.
- `tools/check_manifest.js` is a read-only manifest integrity audit (contiguity,
  first/last `.word` vs declared range, sha256/textBytes/bytes, and duplicate
  part name/file detection across all chunks). Wired into `verify_setup.js` as
  the `manifestIntegrityAudit` check (2026-07-08).
- `tools/export_function_corrections.js` is a read-only exporter of the loop's
  accumulated function-boundary corrections as a diff against the parent
  function DB (`../scripts/ob64_functions.json`): recovered functions, start
  corrections (preamble-orphan folds), over-merges, data refutes, and
  end-over-extensions, written to ignored `build/corrections/`. The 2026-07-08
  run was delivered parent-side as
  `../scripts/ob64_function_corrections_rev0.json` (parent `docs/mips-decode.md`
  Stage 1b).
- `tools/check_boundaries.js` is a read-only deterministic boundary gate over a
  splits JSON + chunk disasm: overlay-immune invariants (no fragment, no
  cross-boundary PC-relative branch, no prologue-after-return under-split, no
  delay-slot leak, straddler-position sanity) plus a data-island warning. Used
  every chunk alongside `check_splits.js`. `slice_chunk.js` takes `--disasm` to
  slice a code sub-region of a MIXED chunk from the full-chunk disasm.
- `tools/scan_functions.js` seeds the chunk-split pipeline for PARENT-UNDETECTED
  code regions (where `ob64_functions.json`/overlay map have 0 entries, e.g.
  chunks 6–7): framed-function starts = range start + every `addiu $sp,-N`
  prologue; the analysis swarm then recovers frameless leaves. Emits a
  `slice_chunk`-compatible plan. `integrate_chunk.js` treats the context as
  optional so these regions integrate without a parent-DB context file.
- `tools/verify_setup.js` is the canonical setup verification command.
- `tests/binutils_smoke.js` verifies the GNU MIPS binutils path.
- `tests/word_asm_smoke.js` verifies the minimal `.word` assembler used by the
  generated fallback path.

## Setup Complete

Setup is complete when:

```powershell
node tools/verify_setup.js
```

prints PASS. Current PASS summary:

- Baserom Rev 0 verified.
- Coverage ledger: 825 archives, zero unknown bytes, 108 overlap bytes visible.
- Toolchain: `n64-tools-gcc-toolchain-mips64-win64`, GNU Binutils 2.39.
- Binutils smoke tests: `.word`, real instructions, `.set noreorder`, and first
  tracked chunk real assembly all pass.
- Source mix: 100 tracked composite real-asm chunks made from 6,181 tracked source
  files, plus 0 generated fallback chunks. (Current totals: 100 composites / 6,181 files / 0 fallback — the entire configured code region 0x1000..0x63676C is fully source-owned.)
- Source manifest: 1,059 entries, zero unknown bytes, 2,469,141 ambiguous bytes
  preserved explicitly.
- Source owners: 3 tracked non-code files / 44,029 bytes plus 1,055 generated
  fallback files / 35,388,567 bytes; total 35,432,596 non-code bytes.
- Code SHA256:
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- Full ROM SHA256:
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

## Next Best Work

The setup phase is complete and the first source split is committed to local
docs:

- `asm/original/rev0/boot/boot_entry_clear_bss.s`
- `docs/dossiers/boot-entry-clear-bss.md`
- `docs/dossiers/boot-resource-arena-and-alloc.md`
- `docs/dossiers/boot-resource-alloc-free.md`
- `docs/dossiers/boot-resource-validation-realloc-trees.md`
- `docs/dossiers/boot-early-loader-state-loop.md`
- `docs/dossiers/boot-mode-flag-helpers.md`
- `docs/dossiers/boot-table-mask-reconcile.md`
- `docs/dossiers/boot-mode-message-accumulator-update.md`
- `docs/dossiers/boot-resource-buffer-reset-flags.md`
- `docs/dossiers/boot-resource-state-reset.md`
- `docs/dossiers/boot-resource-display-list-update.md`
- `docs/dossiers/boot-display-list-state-emit.md`
- `docs/dossiers/boot-display-list-finalize-flip.md`
- `docs/dossiers/boot-display-list-sync-modes.md`
- `docs/dossiers/boot-display-list-counter-step.md`
- `docs/dossiers/boot-display-list-counter-packet-emit.md`
- `docs/dossiers/boot-resource-window-cache-update.md`
- `docs/dossiers/boot-bitstream-cursor-helpers.md`
- `docs/dossiers/boot-bitstream-descriptor-decode.md`
- `docs/dossiers/boot-bitstream-descriptor-encode.md`
- `docs/dossiers/boot-resource-probe-init.md`
- `docs/dossiers/boot-resource-probe-finalize.md`
- `docs/dossiers/boot-resource-probe-dispatch-prepare.md`
- `docs/dossiers/boot-resource-probe-dispatch-apply.md`
- `docs/dossiers/boot-resource-probe-dispatch-result-build.md`
- `docs/dossiers/boot-resource-probe-global-cleanup.md`
- `docs/dossiers/boot-resource-probe-chunk-callback-walk.md`
- `docs/dossiers/boot-resource-probe-global-buffer-copy.md`
- `docs/dossiers/boot-resource-probe-global-buffer-signature-check.md`
- `docs/dossiers/boot-resource-probe-id-materialize.md`
- `docs/dossiers/boot-resource-probe-dual-callback-materialize.md`
- `docs/dossiers/boot-resource-probe-global-buffer-dual-callback-apply.md`
- `docs/dossiers/boot-resource-probe-id-check-materialize.md`
- `docs/dossiers/boot-resource-probe-indexed-record-check.md`
- `docs/dossiers/boot-resource-probe-large-record-check.md`
- `docs/dossiers/boot-resource-probe-small-record-check.md`
- `docs/dossiers/boot-resource-probe-indexed-record-copy-flag.md`
- `docs/dossiers/boot-resource-probe-large-record-copy-flag.md`
- `docs/dossiers/boot-resource-probe-small-record-copy-flag.md`
- `docs/dossiers/boot-resource-probe-record-checksum-signature.md`
- `docs/dossiers/boot-state-dispatch-loop-init.md`
- `docs/dossiers/boot-mode-message-accumulator-seed-wrapper.md`
- `docs/dossiers/boot-resource-table-mask-apply.md`
- `docs/dossiers/boot-state-global-reset.md`
- `docs/dossiers/boot-state-slot-callback-dispatch.md`
- `docs/dossiers/boot-state-slot-render-callback-walk.md`
- `docs/dossiers/boot-state-slot-queue-service-gate.md`
- `docs/dossiers/boot-resource-global-handle-release.md`
- `docs/dossiers/boot-resource-global-handle-slot-record-prepare.md`
- `docs/dossiers/boot-state-slot-current-peer-record-flag-mark.md`
- `docs/dossiers/boot-state-slot-target-peer-record-dispatch.md`
- `docs/dossiers/boot-state-slot-flagged-dispatch-lookup.md`
- `docs/dossiers/boot-state-slot-pool-table-helpers.md`
- `docs/dossiers/boot-state-slot-queue-record-step.md`
- `docs/dossiers/boot-state-slot-queue-f000-record-step.md`
- `docs/dossiers/boot-state-slot-record-release-cluster.md`
- `docs/dossiers/boot-display-list-transform-record-emit.md`
- `docs/dossiers/boot-display-list-transform-wrapper-clamped-rect-emit.md`
- `docs/dossiers/boot-display-list-flagged-rect-packet-emit.md`
- `docs/dossiers/boot-display-list-color-rect-packet-emit.md`
- `docs/dossiers/boot-display-list-vector-distance-and-transform-prefix.md`
- `docs/dossiers/boot-display-list-transform-coefficients-sum-clear.md`
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
- `docs/DECOMP_LOG.md`
- `docs/FULL_ROM_SOURCE_MANIFEST.md`

The next phase remains full-ROM source preparation:

1. Promote/curate the next tracked non-code owner batch under `data/` or
   `assets/`.
2. Continue splitting original MIPS into cleaner function/data files from the
   current frontier in `docs/NEXT_STEPS.md`: chunk 34 at `0x00221000`,
   first continuing outgoing straddler `func_0021EBBC` as
   `func_0021EBBC_chunk34tail`.
3. Keep `node tools/verify_setup.js` green after every source-layout change.

See `docs/NEXT_STEPS.md` for the active task queue.
