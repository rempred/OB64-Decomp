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
- `assemble_original_mips.js` currently uses 13 tracked composite
  real-assembler chunks (`0x00001000..0x00011000` 177; `0x00011000..0x00021000`
  350; `0x00021000..0x00031000` 216; `0x00031000..0x00041000` 67;
  `0x00041000..0x00051000` 376; `0x00051000..0x00061000` 88;
  `0x00061000..0x00071000` 78; `0x00071000..0x00081000` 103;
  `0x00081000..0x00091000` 87; `0x00091000..0x000A1000` 34;
  `0x000A1000..0x000B1000` 35; `0x000B1000..0x000C1000` 191;
  `0x000C1000..0x000D1000` 74 files = 1,876 tracked
  source files total), plus 87 generated fallback chunks.
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
- Chunks 0–12 (`0x00001000..0x000D1000`) are fully source-owned as named
  code/data parts (1,876 tracked source files: 177 in `boot/` + 1,699 in `lib/`;
  chunk 9: 32 code + 2 straddler + 0 data, ALL CODE; chunk 10: 33 code + 2 straddler +
  0 data, ALL CODE; chunk 11: 189 code + 2 straddler + 0 data, ALL CODE — 77 frameless
  leaves recovered; chunk 12: 72 code + 2 straddler + 0 data, ALL CODE — 20
  dispatchers); current split frontier `0x000D1000` (chunk 13, still a generated
  fallback chunk). chunk 1
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
  straddler `func_000D0B8C` continuing to `0x000D110C` (dossiers
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
  `docs/dossiers/lib-chunk12-C1000-D1000.md`).
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
  `data/source-owners/rev0/` (44,029 bytes), 1,055 generated fallback files under
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
  part name/file detection across all chunks).
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
- Source mix: 13 tracked composite real-asm chunks made from 1,876 tracked source
  files, plus 87 generated fallback chunks.
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
2. Continue splitting original MIPS into cleaner function/data files, starting
   from `asm/original/rev0/code_0000B030_00011000.s`. The next target is the
   parent-labeled `0xB030` resource-loader helper, size `0x80` / 128 bytes,
   frame size `0x20`, RAM `0x8007AC30`, with high-confidence calls to RAM
   `0x800936E0`, LZSS decompressor RAM `0x8007A110`, RAM `0x80093810`, and
   unresolved RAM helper `0x80093540`. Keep semantic naming cautious until the
   helper's list/record API is better proven.
3. Keep `node tools/verify_setup.js` green after every source-layout change.

See `docs/NEXT_STEPS.md` for the active task queue.
