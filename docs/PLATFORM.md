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
4. `docs/WORKFLOW.md`
5. `docs/NEXT_STEPS.md`
6. Parent `docs/mips-decomp-workflow-plan.md`
7. Parent subsystem docs and trace artifacts as cited by the local note

When a durable fact changes, update `AGENTS.md` and the relevant `docs/` file in
the same commit.

## Current State

The repo has a Rev 0-only scaffold, verified baserom normalization, no-gap
original MIPS extraction for the configured code region, a whole-ROM structural
coverage ledger, raw span extraction, an exact byte-for-byte raw ROM rebuild,
and an assembly-backed code-region rebuild using the generated `.word` source.

Current known-good pipeline:

```powershell
node tools/verify_baserom.js
node tools/build_rom_coverage_ledger.js
node tools/extract_original_mips.js
node tools/assemble_original_mips.js
node tools/extract_rom_segments.js
node tools/rebuild_rom.js
node tools/rebuild_rom.js --assembled-code build/assembled/rev0/code.bin --out dist/rebuilt.us_rev0.assembled-code.z64 --report build/rebuild/rev0-assembled-code-rebuild-report.json
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
- `rebuild_rom.js --assembled-code ...` substitutes that assembled code blob for
  the raw code segment and still confirms the same full-ROM SHA256.

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
- `tools/assemble_original_mips.js` assembles the generated no-gap `.word`
  chunks into one code-region binary.
- `tests/word_asm_smoke.js` verifies the minimal `.word` assembler used by the
  first assembly-backed rebuild.

## Next Best Work

The assembly-backed rebuild path exists and passes exact comparison. The next
decomp step is to turn that proof into the tracked source layout:

1. Decide how much generated no-gap `.word` source should be promoted from
   ignored `build/original-mips/rev0/` into tracked `asm/original/`.
2. Add the tracked assembly source path to `assemble_original_mips.js`.
3. Keep `rebuild_rom.js --assembled-code ...` exact after the source move.
4. Then start splitting code into functions, rodata, jump tables, and C.

See `docs/NEXT_STEPS.md` for the active task queue.
