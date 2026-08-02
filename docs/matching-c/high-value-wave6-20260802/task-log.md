# Wave 6 task log

## Status

Status: completed and review-pending. The worker selected and reproduced one
matching-C owner. No action is required from Joe during worker intake.

## Assignment and baseline

| Item | Recorded value |
|---|---|
| Assignment | `ob64-decomp-matching-c-high-value-function-wave6-20260802`, revision 1 |
| Worker role | Research and implementation worker |
| Canonical repository | `C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp` |
| Canonical branch and starting HEAD | `main`, `3b8b950d654848d5178c3f8bcdbbc00ca493accf` |
| Parent repository starting HEAD | `a77c56c125d284ad71b8511b5642da1ae649725a`; read-only |
| Prompt parent baseline | `e595013a15663a114b1d8692badea3738652b3bf` |
| Integration repository starting HEAD | `b22815518f060425519c08df19b617af8b5099a7`; read-only |
| Phase 5A setup report | `build/setup/verify-setup-report.json`; hash recorded after final setup verification |

The observed parent HEAD differs from the prompt baseline. The parent remains
read-only, so this drift does not change the mission.

## Mission envelope

The worker may add one matching-C owner, its Phase 8 configuration row, and
curated evidence under this wave directory. The worker must preserve all prior
owners and canonical ROM, code-region, overlay, and setup identities.

The worker must not modify the editor, parent research sources, integration
files, ROMs, savestates, emulator state, or generated evidence outputs. The
worker must not inspect external-derived implementations. The worker must not
commit, push, publish, or issue an acceptance verdict.

## Technical plan

1. Prove one canonical owner exceeds 1,156 and does not exceed 1,600 z64 ROM
   bytes.
2. Verify predecessor, successor, return boundary, and any secondary entry.
3. Verify the accepted Phase 5/7 section, ROM placement, and relocation model.
4. Derive maintainable C from canonical assembly and structural evidence only.
5. Compile the source with the authenticated KMC contract.
6. Record raw-object relocations before setting the Phase 8 contract.
7. Run two fresh external Phase 8 builds and compare path-independent results.
8. Verify prior owners, canonical identities, and scoped working-tree changes.
9. Report the result with review status `pending`.

## Candidate decision

The selected owner is now `func_0026B820`, a 1,196-byte descriptor-12 resource
and state dispatcher. It has selector dispatch, three allocations, three
initialization writes, several bounded record loops, flag transitions, two
floating-point record updates, and seven direct helper owners.

The target is a descriptor-backed Phase 5/7 slice. Its canonical runtime
placement is `0x80216C70`, which is distinct from its z64 ROM range.

## Alternatives and falsifiers

The rejected first candidate was `func_00213E30`, a 1,172-byte combat
character-state owner in a ROM-only gap. Its canonical placement could not
resolve runtime `R_MIPS_26` calls without changing the target bytes.

The selection is falsified by a boundary correction, an unproved secondary
entry, a Phase 5/7 placement mismatch, an unavailable exact object contract,
or a linked-byte mismatch. Any prior-owner or canonical-identity drift also
blocks completion.

## Log entries

### 2026-08-02 — setup and target selection

The canonical setup verifier passed all 21 checks before source edits. The
first target had no secondary entry, but its ROM-only placement failed the
relocatable-C link gate. No source or configuration row was added for it.
The replacement target has no secondary entry and ends at the successor
boundary after its `jr $ra` delay slot. No writer conflict was found in the
scoped canonical or parent paths.

### 2026-08-02 - ROM-only candidate rejected

Manual linking of `func_00213E30` at canonical `vramStart=0x00213E30` produced
`R_MIPS_26` overflow against runtime `0x801...` helper aliases. The worker
discarded that source and selected descriptor-backed `func_0026B820` instead.

### 2026-08-02 — implementation

The source derives the selector dispatch, allocation paths, cleanup path, flag
transition, four propagation loops, record check, and direct helper calls.
The KMC object is exactly 1,196 bytes. Its raw object text SHA-256 is
`C48C33CA6FBF76AFEEF6A19B3CF3709D83045EA82BEE78D4E23B6BA4F9FB814D`.
The linked target text SHA-256 is
`A88503EABEC9D4127CFBD75972F3F0465DC1A58B904DBDDE3B54BCFBA16B4E1A`.
The relocation contract records 28 text relocations and one `.rel.pdr` entry.
The Phase 8 row and source are now recorded in the scoped diff.

### 2026-08-02 — verification

The setup verifier passed all 21 checks. Fresh builds A and B passed from
separate external roots. Both roots are byte-identical across 171 pre-report
files, and both full-ROM outputs have SHA-256
`571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
Standalone Phase 8 verification passed for both roots. The path-independent
comparison passed with report SHA-256
`D99C32C68DA6D665793A36E3CDC3207088FF2857D529FE36D95F942BA73EAA48`.

### 2026-08-02 - handoff

The curated target-selection, independent-derivation, reproduction-procedure,
evidence-index, and AAR records are complete. Evidence grade is `Supported`
before independent review. Review status is `pending`. The worker did not
commit, publish, or issue an acceptance verdict.
