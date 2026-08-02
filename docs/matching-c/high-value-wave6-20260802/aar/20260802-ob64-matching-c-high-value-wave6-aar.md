# After-action report: Wave 6 high-value matching C


Status: completed and review-pending. The worker converted `func_0026B820` to C
and reproduced its exact 1,196 linked bytes in two fresh external roots. This
matters because the new descriptor-backed owner preserves the canonical ROM and
all six earlier C owners. No action is required from Joe; the Director must
intake this report and route fresh Critical independent review.

## Assignment and boundaries

The assignment selected exactly one original game function. The worker touched
only the canonical `OB64 Decomp` repository. The parent and integration
repositories remained read-only. No branch, commit, push, publication, or
acceptance verdict was made.

Starting identities and scope are recorded in
[evidence-index.md](../evidence-index.md). The canonical repository started on
`main` at `3b8b950d654848d5178c3f8bcdbbc00ca493accf`.

## Selection result

The selected owner is `func_0026B820`. It spans z64 ROM range
`0x0026B820..0x0026BCCC`, end exclusive. The accepted owner is 1,196 bytes.
Its placement is `.ob64.r4836` at runtime range
`0x80216C70..0x8021711C`. The owner belongs to overlay descriptor 12.

The owner adds selector dispatch, three allocations, initialization, cleanup,
record loops, state flags, floating-point updates, and direct helper calls.
These are structural observations. They do not prove gameplay semantics.

The boundary ends at `jr $ra` at z64 ROM address `0x0026BCC4`. Its restore
delay slot is at `0x0026BCC8`. `func_0026BCCC` follows the boundary.

The original split comments also show execution annotation `0x802DB420`. The
accepted Phase 5/7 link placement is `0x80216C70`. The worker used the validated
overlay link model instead of an unvalidated address subtraction.

The rejected candidate was `func_00213E30`. Its ROM-only placement could not
resolve runtime `R_MIPS_26` calls without changing its bytes. No source or
configuration row was added for that candidate.

Full selection evidence is in [target-selection.md](../target-selection.md).

## Independent C derivation

The source is `src/overlays/descriptor_12/func_0026B820.c`. Its SHA-256 is
`12D34159C5CA16BE3AB3FEA6E0CF3380B4CC217B0BFBB65D175F04F4535ED900`.
The original assembly SHA-256 is
`C43334DEC069D6760B6A2D24E40FDB3C7F3518D63224BA8A021EEB9F8A84997D`.

The source derives selector masking, seven-entry table dispatch, data offsets,
allocation sizes, cleanup order, record strides, flag tests, call arguments,
floating-point stores, and relocated aliases from canonical assembly evidence.
The full mapping is in [independent-derivation.md](../independent-derivation.md).

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
`C48C33CA6FBF76AFEEF6A19B3CF3709D83045EA82BEE78D4E23B6BA4F9FB814D`.
The linked target SHA-256 is
`A88503EABEC9D4127CFBD75972F3F0465DC1A58B904DBDDE3B54BCFBA16B4E1A`.

The target manifest records 29 `.rel.text` relocations and one `.rel.pdr`
relocation. The original assembly remains available as the comparison fallback.

No build-support source was changed for this owner. The existing Phase 8 build
support and accepted compiler produced the target from the new source entry.

## Verification

The required setup command passed all 21 checks. The setup report SHA-256 is
`B0E9FA404B81A92CA0EB23C75A3F1A534964AEB815771EE0D00CA5008F351F8D`.

Phase 8 build and verifier gates passed in these fresh roots:

- `C:\Users\Joe\.codex\ob64-matching-c-wave6-20260802\run-a\conventional`
- `C:\Users\Joe\.codex\ob64-matching-c-wave6-20260802\run-b\conventional`

Both roots produced full-ROM SHA-256
`571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
Both produced code-region SHA-256
`40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.

The path-independent comparison passed. Its report SHA-256 is
`D99C32C68DA6D665793A36E3CDC3207088FF2857D529FE36D95F942BA73EAA48`.
The build report SHA-256 is
`A74706081DBF38D2024A7BF2C8BC4E9906A290C1470E6CE635904DBB2C124A1E` in both
roots. The verifier report SHA-256 is
`D265EAEE4A07FC30F204460D8D100C2F6290A785B1B1A7D5968F66F604FD9AED` in both
roots.

asm-differ reported exact matches for all seven C owners. The new target has
299 assembly rows, current score `0`, and maximum score `29,900`.

The preservation report records 7,242 primary rows, 7,251 executable slices,
19 overlay reservations, and no original assembly target remaining linked.

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

The Director may propose an accepted-owner entry for `func_0026B820` in the
canonical matching-C status document after fresh Critical review accepts this
result. That update should preserve structural naming and recorded hashes.
No canonical semantic document was changed by this worker.

## Evidence and review state

Worker result: completed. Evidence grade: supported before independent review.
Review status: pending. This worker does not accept its own result.

The Director can freeze this report and evidence package for the required fresh
Critical review. Wave 7 remains prohibited until Wave 6 receives an accepted
verdict.
