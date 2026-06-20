# OB64 Decomp - Agent Guide

This repository is the dedicated decompilation workspace for Ogre Battle 64:
Person of Lordly Caliber, US Rev 0 only.

## Scope

- Target ROM: US Rev 0 retail, game ID `NOBE`, country `C:45`.
- Do not add Rev 1 support until the Rev 0 structure, build, and compare loop are
  stable.
- Final tracked output should be source form:
  - C decompilation under `src/`.
  - Original/reference MIPS under `asm/original/`.
  - Nonmatching assembly under `asm/nonmatching/` only while C is not matching.
- Do not commit ROM binaries, save files, savestates, object files, rebuilt ROMs,
  or generated bulk artifacts.

## Relationship To Parent Workspace

The parent `OgreBattlel64` workspace remains the research lab: emulator traces,
runtime probes, editor experiments, patch builders, and large generated artifacts
belong there until they become stable decomp inputs.

This repo should contain reproducible decomp source, configuration, curated docs,
and tools. When importing facts from the parent workspace, include the source doc
or artifact path in the relevant note.

## Required Context

Before decomp work, read:

1. Parent `AGENTS.md`.
2. Parent `docs/mips-decomp-workflow-plan.md`.
3. Parent `docs/mips-decode.md`.
4. Parent `docs/overlay-system.md`.
5. The relevant subsystem doc in the parent `docs/` folder.

## Address Rules

- Documentation offsets use z64 byte order.
- The local baserom may be supplied as `.v64`, `.z64`, or `.n64`, but tools
  should normalize to canonical z64 bytes for extraction and comparison.
- Only the boot region below roughly z64 `0x0002F000` follows the simple
  `RAM = ROM + 0x8006FC00` mapping.
- Later code is overlay-loaded and must be resolved through the overlay map.

## Evidence Rules

- Static decomp output is candidate evidence.
- Runtime trace or controlled mutation is required before naming behavior as
  verified.
- Matching code is not automatically semantic proof; semantic claims still need
  subsystem evidence.
- Update docs when a function name, struct field, segment boundary, or overlay
  mapping becomes durable.

