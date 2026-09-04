# func_00217BA8: Preserved Matching-Workbench Candidate

## Status

This source is a research candidate. The original assembly remains the accepted owner.

- Candidate: `B4DF0A7D7F267763C4348F00FC58F314474C6AFC8E7D57783629D3D7DC8E29F7`
- Target: `func_00217BA8` at ROM `0x217BA8`
- Source: `docs/archive/matching-c-candidates/2026-09-04-func_00217BA8-b4df0a7d7f.c`
- Source SHA-256: `00168420BDA77475FA8045AB47DA8695508AD1C6F9B8D017CA2BD6CD30331A99`
- Latest scratch class: `cfg-mismatch`
- Latest scratch score: `70.99`
- Scratch extent: `1032` bytes / `258` instructions (exact target extent)
- Recognized scratch relocations: `107`
- Scratch artifact: `build/matching/runs/84B9D676761EBFCE1C4D5C8473B8F1F8531FF92E34E619746C6AB787D99AEDEE`

## Preservation reason

Exact-length PURE_C reconstruction. After relocation-bearing fields are excluded, all target words match except offsets 0x1C4, 0x1C8, and 0x1CC: KMC saves the allocator return in s0 before loading D_801CE8BC, while retail loads the owner first and then saves v0. This is the identical scheduler tie exhaustively established for func_002158E4; large-target hybrid fallback is outside Wave 4 scope, so original ASM ownership remains active.

The earlier candidate's missing two-word preamble, scalar-width errors, numeric
global accesses, allocator prototype, mode branch, and timer arithmetic were all
corrected. The final scratch object has the retail instruction count, stack frame,
control-flow orientation, opcode sequence, and non-relocation words everywhere
outside the three-word scheduler tie. Re-testing the broad source-shape families
already exhausted for `func_002158E4` would duplicate the same proven compiler
constraint rather than add new evidence.

## Evidence boundary

Scratch object comparison does not prove canonical linker ownership, relocation resolution, target bytes, or full-ROM identity. Resume through the normal diff and verification workflow.

## Workbench-reported first difference

The generic workbench reports unresolved relocation fields first because the
target is still ASM-owned and therefore has no accepted C relocation manifest.
The bounded comparison above masks only the fields identified by the candidate's
complete relocation records; it leaves the three scheduler words as the sole
machine-shape differences.

```json
{
  "actual": "lui $v1, 0x0000",
  "actualWord": "0x3C030000",
  "expected": "lui $v1, 0x801D",
  "expectedWord": "0x3C03801D",
  "index": 0,
  "offset": 0,
  "pc": 2149402840
}
```
