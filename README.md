# OB64 Decomp

Dedicated decompilation repo for Ogre Battle 64: Person of Lordly Caliber, US
Rev 0.

Start here for future sessions:

- `AGENTS.md` - local rules and durable memory gate.
- `docs/PLATFORM.md` - current repo state, invariants, and command snapshot.
- `docs/REV0_SCOPE.md` - Rev 0 identity and structural coverage snapshot.
- `docs/TOOLCHAIN.md` - local MIPS binutils setup and smoke-test expectations.
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

## Current Milestones

The repository now has these accepted capabilities:

1. The no-gap atlas owns the complete configured code region.
2. The overlay configuration reproduces 19 descriptors, 11 groups, and 11 pointers.
3. The production Splat configuration conserves all 7,242 accepted ROM owners.
4. The conventional assembly and linker path reproduces the complete ROM.
5. One independently written 36-byte C function matches its original section.

The matching function is `func_000E5938`. Its name and acceptance are
structural; they do not establish gameplay semantics.

## Canonical Verification

The setup gate needs the accepted Phase 5A evidence root. That evidence remains
outside this clean-room repository.

```powershell
$phase5aRoot = '<accepted-phase5a-product-root>'
node tools/verify_setup.js --phase5a-root $phase5aRoot
```

The current 21-check gate reproduces the full Rev 0 ROM at SHA-256
`571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

The assembled code region remains SHA-256
`40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.

Use `docs/WORKFLOW.md` for the Splat, conventional build, and matching-C
commands. Keep every generated object, map, executable, ROM, and report outside
tracked source.
