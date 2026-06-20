# OB64 Decomp

Dedicated decompilation repo for Ogre Battle 64: Person of Lordly Caliber, US
Rev 0.

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

