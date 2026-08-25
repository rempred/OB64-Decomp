# func_0012FBB8: Preserved Matching-Workbench Candidate

## Status

This source remains the best preserved `PURE_C` research candidate. The active
canonical owner is now the separately reviewed exact `HYBRID_C` source at
`src/lib/func_0012fbb8.c`; this pure-C candidate was not promoted.

- Candidate: `C67C7E65CDDEB21ED2C230604825056CFFFA180FB73308F0CF88D3CA1A3C4FC6`
- Target: `func_0012FBB8` at ROM `0x12FBB8`
- Source: `docs/archive/matching-c-candidates/2026-08-25-func_0012FBB8-c67c7e65cd.c`
- Source SHA-256: `1FED04AEB58D2A76968CFFEB65B98C9F67B06B77701A9823A7E2957B0EB9C263`
- Latest scratch class: `cfg-mismatch`
- Latest scratch score: `68.66`

## Preservation reason

Best PURE_C attempt: exact outside the zero-count/division selection; KMC coalesces quotient into s0 and removes retail's v0-to-s0 move across all tested C layouts.

## Evidence boundary

Scratch object comparison does not prove canonical linker ownership, relocation resolution, target bytes, or full-ROM identity. Resume through the normal diff and verification workflow.

## Subsequent canonical result

Candidate `3488F28131269879EB655FB6525FC9CBE279CEB594ECF2E1FAF62A02698D9E1B`
was reviewed and integrated with its one fixed-register constraint. Canonical
linked diff, relocation, ownership, source-policy, and full-ROM gates pass; the
accepted result is exact `HYBRID_C`, not matching C.

## First recorded difference

```json
{
  "actual": "j 0x8000022C",
  "actualWord": "0x0800008B",
  "expected": "j 0x801DB6A4",
  "expectedWord": "0x08076DA9",
  "index": 17,
  "offset": 68,
  "pc": 2149430460
}
```
