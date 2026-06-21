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
6. `docs/NEXT_STEPS.md`
7. Parent `docs/mips-decomp-workflow-plan.md`
8. Parent subsystem docs and trace artifacts as cited by the local note

When a durable fact changes, update `AGENTS.md` and the relevant `docs/` file in
the same commit.

## Current State

The repo has a Rev 0-only scaffold, verified baserom normalization, no-gap
original MIPS extraction for the configured code region, a whole-ROM structural
coverage ledger, raw span extraction, an exact byte-for-byte raw ROM rebuild,
and an assembly-backed code-region rebuild. Setup is complete: a project-local
GNU MIPS binutils toolchain is configured, tracked source chunks assemble through
real `mips64-elf-as`, and `node tools/verify_setup.js` verifies the whole setup.

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
- `assemble_original_mips.js` currently uses 1 tracked real-assembler source
  chunk (`0x00001000..0x00011000`) and 99 generated fallback chunks.
- `rebuild_rom.js --assembled-code ...` substitutes that assembled code blob for
  the raw code segment and still confirms the same full-ROM SHA256.
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
wiki/          regenerated reports and function dossiers
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
- `tools/assemble_original_mips.js` assembles tracked/generated source chunks
  into one code-region binary. Tracked chunks use GNU `mips64-elf-as`; generated
  fallback chunks use the minimal `.word` assembler.
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
- Source mix: 1 tracked real-asm chunk and 99 generated fallback chunks.
- Code SHA256:
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- Full ROM SHA256:
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

## Next Best Work

The setup phase is complete. The next phase is real decomp preparation:

1. Split the first tracked chunk into cleaner chunk/function/data files.
2. Begin function naming from existing parent symbols and trace evidence.
3. Keep `node tools/verify_setup.js` green after every source-layout change.
4. Start C conversion only after the split/compare loop is comfortable.

See `docs/NEXT_STEPS.md` for the active task queue.
