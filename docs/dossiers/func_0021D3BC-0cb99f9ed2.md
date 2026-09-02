# func_0021D3BC: Preserved Matching-Workbench Candidate

## Status

This source is a research candidate. The original assembly remains the accepted owner.

- Candidate: `0CB99F9ED2A7377571A1FC40E6931E46BB3C98BEE34E0EC929279661C26BF756`
- Target: `func_0021D3BC` at ROM `0x21D3BC`
- Source: `docs/archive/matching-c-candidates/2026-09-02-func_0021D3BC-0cb99f9ed2.c`
- Source SHA-256: `085E351A2EB6E262604BEA85AEA48FFA11E8F7670600A7F7CD06B7DF4B39D013`
- Latest scratch class: `length-mismatch`
- Latest scratch score: `39.18`

## Preservation reason

PURE_C research reconstruction of the shared record-removal shift tail. The retail entry at 0x21D3BC is also reached from func_0021D374 at runtime 0x801DA0EC/0x801DA108 and consumes adjustment from live-in t0, outside the standalone C ABI. This candidate's deliberately uninitialized adjustment exposes that contract and must not be activated. It emits 38 versus 37 instructions, with 33 differing instructions/95 bytes; the first recorded difference is candidate `lui $v1, 0x801C` versus expected `lui $v0, 0x801D` at +0x00. Reopen after a structural audit defines the multi-entry/shared-tail owner and manual-load slab, then reconstruct the combined owner without undefined C.

## Evidence boundary

Scratch object comparison does not prove canonical linker ownership, relocation resolution, target bytes, or full-ROM identity. Resume through the normal diff and verification workflow.

## First recorded difference

```json
{
  "actual": "lui $v1, 0x801C",
  "actualWord": "0x3C03801C",
  "expected": "lui $v0, 0x801D",
  "expectedWord": "0x3C02801D",
  "index": 0,
  "offset": 0,
  "pc": 2216892
}
```
