# OB64 Decomp

Dedicated decompilation repo for Ogre Battle 64: Person of Lordly Caliber, US
Rev 0.

Start here for future sessions:

- `AGENTS.md` - local rules and durable memory gate.
- `docs/PLATFORM.md` - current repo state, invariants, and command snapshot.
- `docs/REV0_SCOPE.md` - Rev 0 identity and structural coverage snapshot.
- `docs/WORKFLOW.md` - decomp loop and evidence rules.
- `docs/NEXT_STEPS.md` - immediate task queue.

The goal is to produce a reproducible source tree for the ROM:

- `src/` - C source for decompiled functions and systems.
- `asm/original/` - original MIPS disassembly preserved as readable reference.
- `asm/nonmatching/` - assembly linked while a C version is not matching yet.
- `data/` and `assets/` - structured data and extracted asset source forms.
- `config/` - Rev 0 ROM profile, segments, overlays, symbols, and linker input.

ROM binaries are local inputs only and are ignored by git.

## Current Scope

Rev 0 only. Rev 1 support is intentionally out of scope until the Rev 0 build,
compare, and overlay workflow is stable.

## Expected Local Input

Place a local Rev 0 ROM under `baserom/`. The preferred file is the parent
workspace master ROM:

```text
Ogre Battle 64 - Person of Lordly Caliber (U) [!].v64
```

Tools should normalize local input to canonical z64 bytes before extraction,
disassembly, or comparison.

## Folder Map

```text
baserom/       local ROM inputs, ignored
config/        Rev 0 profile, segments, overlays, symbols, linker config
include/       shared C headers and structs
src/           decompiled C source
asm/           original, nonmatching, and handwritten MIPS assembly
data/          tables, rodata, binary data source, archive manifests
assets/        extracted art/audio/model source artifacts
tools/         extraction, disassembly, compare, and context tools
docs/          curated decomp notes and subsystem docs
wiki/          regenerated decomp reports and function dossiers
tests/         parser, extraction, and compare tests
build/         generated objects/intermediates, ignored
dist/          rebuilt ROMs/reports, ignored
scratch/       local experiments, ignored
```

## First Milestones

1. Import Rev 0 config and segment scaffolding.
2. Build a read-only extraction/disassembly pass.
3. Generate original MIPS into `asm/original/`.
4. Add a minimal linker/compare loop.
5. Begin replacing matched functions with C under `src/`.

## Current First-Pass Tools

```powershell
node tools/verify_baserom.js
node tools/extract_original_mips.js
```

The extractor currently writes generated, ignored no-gap MIPS reference output
under `build/original-mips/rev0/`. Once the split/link/compare policy is stable,
curated original MIPS can be promoted into `asm/original/`.

```powershell
node tools/build_rom_coverage_ledger.js
```

Builds the whole-ROM structural ledger. The current Rev 0 pass independently
finds 825 valid LHA archives, matches the parent catalog offsets, reports zero
unknown bytes, and keeps the `archive/audio` boundary overlap visible.

```powershell
node tools/extract_rom_segments.js
node tools/rebuild_rom.js
```

Runs the first exact rebuild loop from raw ledger spans. This is the safety net
that future C and assembly replacement work must preserve.

Current status: 1,059 ledger spans rebuild to a byte-identical Rev 0 ROM with
SHA256 `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
