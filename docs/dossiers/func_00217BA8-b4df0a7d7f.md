# func_00217BA8: Exact Hybrid Promotion and PURE_C Exhaustion

## Status

`func_00217BA8` is an exact `HYBRID_C` owner. It is not matching C and does not
contribute to the `PURE_C` count.

- Accepted range: `0x00217BA8..0x00217FB0` (`1032` bytes / `258` instructions)
- Active source: `src/battle/func_00217BA8.c`
- Active source SHA-256: `7571288045AADC6FD45045A9CBFD28BACB7D74DC800C3F8BBFDDD66943ACAF09`
- Target and linked SHA-256: `FE23E341C7625CCBE953CE268D858A5ACF66FC2C012F4A8C0D82802A1F8E63D8`
- Relocation contract: `107` records, `MATCH`
- Preserved best PURE_C candidate: `B4DF0A7D7F267763C4348F00FC58F314474C6AFC8E7D57783629D3D7DC8E29F7`
- Preserved PURE_C source: `docs/archive/matching-c-candidates/2026-09-04-func_00217BA8-b4df0a7d7f.c`

## PURE_C exhaustion

The preserved PURE_C candidate has the exact accepted extent, stack frame,
control-flow orientation, opcode sequence, and behavior. Once its complete 107
relocation records are masked, only offsets `0x1C4`, `0x1C8`, and `0x1CC`
differ: KMC saves the allocator result in `$s0` before loading `D_801CE8BC`,
whereas retail loads the owner first and then saves `$v0`.

This is the same scheduler tie established independently for
`func_002158E4`. The Wave 4 continuation nevertheless repeated representative
source families in this function's full register-pressure context:

- direct allocator-result assignment versus an intermediate allocation;
- owner assignment as a separate statement, a direct global argument, and an
  argument-side assignment;
- immediate versus deferred snapshot assignment after the owner load;
- `register` owner storage and `void *` versus `u8 *` owner/snapshot types;
- `void *` versus typed allocator return declarations.

Direct-global and argument-side owner forms changed additional instructions.
All semantically clean local-owner forms collapsed to the identical three-word
tie. This confirms the broader type, lifetime, evaluation-order, volatility,
aliasing, aggregate, and control-flow search already captured in
`docs/dossiers/func_002158E4-a493a3ded3.md`: both operations are ready after
the allocator call, and KMC consistently prioritizes the long-lived return
value save.

## Bounded compiler-influence fallback

The active source uses one extended-assembly statement with an empty template.
It ties the allocator value to the long-lived snapshot output and presents the
owner as a simultaneous input. The statement emits no instruction and
implements no behavior; the entire 1032-byte target remains compiler output
from the surrounding C. Its only effect is to make KMC schedule the owner load
before the allocator-result save.

This remains an assembler mechanism under source policy, so the translation
unit is truthfully `HYBRID_C`. A future PURE_C reopen requires a source shape
or compiler capability that represents the same dependency without an
assembler escape hatch.

## Canonical acceptance

Canonical `node tools/diff.js func_00217BA8` reported:

```text
Source class ............... HYBRID_C
Decoded instruction rows ... EXACT
Raw linked bytes ........... EXACT
Differing bytes ............ 0
Relocation contract ........ MATCH (107 records)
Linked target SHA-256 ...... FE23E341C7625CCBE953CE268D858A5ACF66FC2C012F4A8C0D82802A1F8E63D8
```

The target source-policy audit reports `HYBRID_C` with no `UNKNOWN`, `ASM`, or
misclassified result. The consolidated verifier subsequently passed ownership,
placement, relocations, exact target bytes, and exact full-ROM identity. Its
generated report SHA-256 is
`5E01256BAD8D80B04BF7AF5FD6E2250C45589F8793AC1E2652A859D3B818722F`.
