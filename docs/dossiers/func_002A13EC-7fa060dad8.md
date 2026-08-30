# func_002A13EC: Preserved Matching-Workbench Candidate

## Status

This source is a research candidate. The original assembly remains the accepted owner.

- Candidate: `7FA060DAD88DCD2FB660956F1859F6288B9C2D79E732506AE228011B584B189F`
- Target: `func_002A13EC` at ROM `0x2A13EC`
- Source: `docs/archive/matching-c-candidates/2026-08-30-func_002A13EC-7fa060dad8.c`
- Source SHA-256: `4A3D0157F8CB2DA988128CFDBE2BD561D24CBB8A125BE5E708AF34574BCEEBF3`
- Latest scratch class: `cfg-mismatch`
- Latest scratch score: `73.32`

## Preservation reason

Accepted manual-load placement resolves the internal jump. Canonical diff retains seven register-allocation-only instruction-word differences: KMC coalesces current and loop-next into v1 while retail keeps current in v1 and loop-next in v0. Pure-C retries covered declaration order, scoped temporaries, explicit result joins, compound/preincrement forms, signedness, and current/next reassignment without resolving the allocator choice.

After applying the accepted relocations, the pure candidate differs in exactly 10 bytes across
those 7 instruction words.

## Evidence boundary

Scratch object comparison does not prove canonical linker ownership, relocation resolution, target bytes, or full-ROM identity. Resume through the normal diff and verification workflow.

## First recorded difference

```json
{
  "actual": "lui $v1, 0x0000",
  "actualWord": "0x3C030000",
  "expected": "lui $v1, 0x8023",
  "expectedWord": "0x3C038023",
  "index": 1,
  "offset": 4,
  "pc": 2149784512
}
```
