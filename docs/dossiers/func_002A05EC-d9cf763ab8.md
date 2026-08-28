# func_002A05EC: Preserved Matching-Workbench Candidate

## Status

This source is a research candidate. The original assembly remains the accepted owner.

- Candidate: `D9CF763AB8A17B46780AC555D2824C12EEA052BB44A005020CAC5D2237514BAA`
- Target: `func_002A05EC` at ROM `0x2A05EC`
- Source: `docs/archive/matching-c-candidates/2026-08-28-func_002A05EC-d9cf763ab8.c`
- Source SHA-256: `2E210A582FE71580A48E8CF6D03D4879F5675197E6F38FFF0AEF442BB76B1A10`
- Latest scratch class: `immediate-or-signedness`
- Latest scratch score: `98.18`

## Preservation reason

The pure-C candidate reproduces all 37 instructions, the control-flow graph, opcodes, and relocations. One internal jump word differs because the ROM-only placement cannot encode the live slab address `0x80230DBC` without structural work or assembler injection.

## Evidence boundary

Scratch object comparison does not prove canonical linker ownership, relocation resolution, target bytes, or full-ROM identity. Resume through the normal diff and verification workflow.
