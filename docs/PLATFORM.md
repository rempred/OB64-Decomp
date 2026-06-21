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
resource-node insert/find helper into named tracked parts while preserving the
exact rebuild gate. The
current setup gate also builds a
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
- `assemble_original_mips.js` currently uses 1 tracked composite
  real-assembler chunk (`0x00001000..0x00011000`) made from 88 tracked source
  files, plus 99 generated fallback chunks.
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
- Source mix: 1 tracked composite real-asm chunk made from 88 tracked source
  files, plus 99 generated fallback chunks.
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
- `docs/DECOMP_LOG.md`
- `docs/FULL_ROM_SOURCE_MANIFEST.md`

The next phase remains full-ROM source preparation:

1. Promote/curate the next tracked non-code owner batch under `data/` or
   `assets/`.
2. Continue splitting original MIPS into cleaner function/data files, starting
   from `asm/original/rev0/code_00009D50_00011000.s`. The next target is
   `0x9D50`, a larger frame-`0x50` resource-loader/context helper. Parent
   evidence reports command-stream callers, callees to the DMA/cache and
   allocation helpers plus `0xB29C`, `0x9CAC`, and `0xB0B0`, and reads/writes
   around `0x800AF0C4` and `0x800C4BC0`; keep `0x9D50..0x9EFC` together.
3. Keep `node tools/verify_setup.js` green after every source-layout change.

See `docs/NEXT_STEPS.md` for the active task queue.
