# After-action report: Wave 5 high-value matching C

Status: completed and review-pending. The worker converted `func_0026B360` to C
and reproduced its exact 1,156 linked bytes in two fresh external roots. This
matters because a larger resource and state dispatcher now preserves the full
canonical ROM. No action is required from Joe; the Director must intake this
report and route fresh Critical independent review.

## Assignment and boundaries

The assignment selected exactly one original game function. The worker touched
only the canonical `OB64 Decomp` repository. The parent and integration
repositories remained read-only. No branch, commit, push, publication, or
acceptance verdict was made.

Starting identities and scope are recorded in
[evidence-index.md](../evidence-index.md). The canonical repository started on
`main` at `c81a897f4f6b7b65ddd84d23fa6b3012e45025e8`.

## Selection result

The selected owner is `func_0026B360`. It spans z64 ROM range
`0x0026B360..0x0026B7E4`, end exclusive. The accepted owner is 1,156 bytes.
Its placement is `.ob64.r4834` at runtime range
`0x802167B0..0x80216C34`. The owner belongs to overlay descriptor 12.

The owner exceeds the five accepted C owners in size. It also adds a larger
control path with selector dispatch, array allocation, cleanup, record loops,
state flags, relocated globals, and 17 direct calls. These are structural
observations. They do not prove gameplay semantics.

The boundary ends at `jr $ra` at z64 ROM address `0x0026B7DC`. Its stack-restore
delay slot is at `0x0026B7E0`. `func_0026B7E4` follows the boundary.

Rejected candidates are recorded in [target-selection.md](../target-selection.md).
The selected owner provided the strongest bounded resource and state control
path in the eligible size range.

## Independent C derivation

The source is `src/overlays/descriptor_12/func_0026B360.c`. Its SHA-256 is
`A83A9A2FB003C77D861ECDA7897D0E28A93D5DCB9093E16291E35A6CD27F8DB8`.
The original assembly SHA-256 is
`2DE06BCC819A1176A23E31A6F1FB7C7267702F99F3A7D52EB4757BCEF609AC73`.

The source derives selector masking, seven-entry table dispatch, data offsets,
allocation sizes, cleanup order, record strides, flag tests, call arguments,
and relocated aliases from canonical assembly evidence. The full mapping is in
[independent-derivation.md](../independent-derivation.md).

The source uses structural field names. It does not claim gameplay meanings for
the selector, state, records, globals, or helper functions. It uses limited
compiler anchors for exact register, frame, and branch placement.

## Compiler and build integration

The accepted compiler is KMC GCC 2.7.2. Its SHA-256 is
`F3F1C99A322F5B3D8C108C2A44AF1D6D084DD27575C5D60BF0F0D33FFF34B1C6`.
The build flags are:

```text
-quiet -O2 -meb -mips3 -mgp32 -mfp32 -G 0 -fno-PIC -mno-abicalls -fno-builtin -funsigned-char
```

The raw C object text SHA-256 is
`09E0856A4F0881FE2D495FA4A2C291A889DB3BFCB784FC7D7623B8AE639F1249`.
The linked target SHA-256 is
`5342CBA0C83FCFE9E4825BEF64B50DDFFAAF359ABF9D470CDE1E7D517825DBFC`.

The target manifest records 29 `.rel.text` relocations and one `.rel.pdr`
relocation. The original assembly remains available as the comparison fallback.

No build-support source was changed for this owner. The existing Phase 8 build
support and accepted compiler produced the target from the new source entry.

## Verification

The required setup command passed all 21 checks:

```text
node tools/verify_setup.js --phase5a-root "C:\Users\Joe\Projects\OB64-Decomp-Hijs-Integration\docs\external-intake\phase5-boundary-segment-reconciliation-static-20260731"
```

The setup report SHA-256 is
`B0E9FA404B81A92CA0EB23C75A3F1A534964AEB815771EE0D00CA5008F351F8D`.

Phase 8 build and verifier gates passed in these fresh roots:

- `C:\Users\Joe\.codex\ob64-matching-c-wave5-20260802-a\phase8-final-a`
- `C:\Users\Joe\.codex\ob64-matching-c-wave5-20260802-b\phase8-final-b`

Both roots produced full-ROM SHA-256
`571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
Both produced code-region SHA-256
`40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.

The path-independent comparison passed. Its report SHA-256 is
`2EE4D99CE402FF5A01DBE956D125C0AEFE162ED600B6DE1DE054FCDC3D79F93E`.

asm-differ reported exact matches for all six C owners. The preservation report
records 7,242 primary rows, 7,251 executable slices, and 19 overlay reservations.
No original assembly target remained linked.

The full command ledger and output identities are in
[reproduction-procedure.md](../reproduction-procedure.md). The claim-to-artifact
mapping is in [evidence-index.md](../evidence-index.md).

## Evidence package

The worker created these curated records:

- [target selection](../target-selection.md)
- [independent derivation](../independent-derivation.md)
- [reproduction procedure](../reproduction-procedure.md)
- [chronological task log](../task-log.md)
- [evidence index](../evidence-index.md)

Generated ROMs, objects, maps, executables, and bulk reports remain in the two
external roots. The evidence root contains no prohibited generated artifact.

## Proposed post-review documentation

The Director may propose an accepted-owner entry for `func_0026B360` in the
canonical matching-C status document after fresh Critical review accepts this
result. That update should preserve the structural naming and recorded hashes.
No canonical semantic document was changed by this worker.

## Evidence and review state

Worker result: completed. Evidence grade: supported before independent review.
Review status: pending. This worker does not accept its own result.

The Director can freeze this report and evidence package for the required fresh
Critical review. Wave 6 remains prohibited until Wave 5 receives an accepted
verdict.
