# Task Log — High Attack Wave 1 Structural Layout Verifier Correction

- Assignment: `ob64-high-attack-wave1-structural-layout-verifier-correction-20260902`
- Revision: 1
- Role: correction-worker
- Review level: Critical
- Launch: `HABSW1-SC2-20260902-01`
- Receiving task: `01a06309-6831-7e02-88e2-b0cd2be57b86`
- Host: `local`
- Accepted HEAD: `2e77c5ea702498857a6a10dcc5dbd3609bf32cb5`
- Frozen predecessor correction: `67feba18102c6c8e11d6078016bd7f14c62e135d`
- Worktree: `C:\Users\Joe\Projects\OgreBattlel64\high-attack-wave-1-structural-audit`

## Protocol

Before the first write, the worktree was clean, on
`codex/high-attack-wave-1-structural-audit`, and exactly at the accepted HEAD. The frozen
predecessor correction was an ancestor. The assigned claim, task log, and correction report did
not exist, and the existing task records showed no concurrent actor or mixed lineage.

The complete claim was created atomically with create-only semantics at
`2026-09-02T21:20:07.3852291-04:00`, read back, and left immutable. Its SHA-256 is
`6F4841008408234D494630B1DA99C4F9548776061A9B4CC5DD91A8C38E798155`.

No branch, worktree, commit, remote state, accepted structural model, assembly, active target,
source classification, Matching-C candidate, linkage contract, resolver, fallback-pruning,
linker, map, ELF, or exact-ROM behavior was changed.

## Finding reproduction

The frozen re-review identified the remaining form of `HABSW1-SR-F01`: the ordinary external
layout verifier checked the mixed-row ownership decorations but did not compare all structural
fields emitted from the accepted Phase 7 slice model.

Before editing, the reviewer harness
`node build/reviewer/HABSW1-SRR-20260902-01/layout_mutations.js` reached the real verifier and
reproduced the finding. Three existing controls were rejected, but nine one-field execution,
placement, and provenance contradictions were accepted across the matching-C and retained-
assembly slices.

## Implementation record

- Added one accepted-row slice resolver local to the external layout verification path.
- Defined the complete 12-field structural projection that Phase 7 emits for each accepted slice:
  section name, ROM and VRAM bounds, placement kind, overlay descriptor, load slab, overlay
  section, execution classification, and executable/non-executable range identities.
- Required the Phase 8 record's `baseInputKind` to equal the accepted row's `inputKind`, and
  separately required the effective Phase 8 `inputKind` appropriate to the matching-C or retained
  assembly slice.
- Kept the existing source, fallback, symbol, logical-offset, linked-owner, and assembly-hash
  checks as separate ownership decorations.
- Extended the end-to-end split-row regression with an explicit external-field census and one-
  field contradictions for all 12 accepted fields, accepted input kind, and effective input kind
  on both slices.

An initial local draft compared all 21 internal slice-model fields. It correctly rejected the
reviewer mutations but also demanded fields that the accepted Phase 7 external layout contract
does not emit. That draft was discarded before final verification. The final correction compares
the complete 12-field external projection and keeps its field census explicit in the regression,
so a future projection change cannot silently escape test coverage.

## Focused results

- The reviewer harness passed after the correction: all nine formerly accepted contradictions
  and all three controls were rejected.
- `node tests/split_row_phase8.js` passed with an exact test-only `PURE_C` fixture. It retained C
  ownership of `.ob64.r4033.s0`, assembly ownership of `.ob64.r4033.s1`, produced the canonical
  ROM, and rejected 36 mutations: the eight existing owner/extent/byte/provenance negatives plus
  14 structural/input-kind contradictions for each slice.
- Final focused report:
  `C:\Users\Joe\.codex\ob64-high-attack-wave-1-structural-audit\work\tests\split-row-phase8-X8lEE5\split-row-phase8-test-report.json`.
  SHA-256:
  `3925A3B21EE7FCCF65975196E072BB14CAEF973C06DDE4BDABF5244471649429`.
- `node tests/multi_owner_phase8.js` passed; the unrelated two-owner exact-ROM fixture and its
  `HYBRID_C` structural fixture remained unchanged.

## Final verification

- `node tools/build.js` passed and produced a fresh ordinary CURRENT build at
  `C:\Users\Joe\.codex\ob64-high-attack-wave-1-structural-audit\work\current\f9f766addf05186e490411e4\build`.
- `node tests/phase8_matching_c.js --output "C:\Users\Joe\.codex\ob64-high-attack-wave-1-structural-audit\work\current\f9f766addf05186e490411e4\build"`
  passed: 500 targets, 439 `PURE_C`, 61 `HYBRID_C`, zero `ASM`, zero `UNKNOWN`, three auxiliary
  sections, 2,874 load-relevant relocations, all generic mutations rejected, and exact ROM.
- `node tools/audit.js` passed Structural protections and CURRENT exact ROM. Audit report SHA-256:
  `1D29324D34DF3D6E43A311A1F8E51399BB4AC1F7A88830BB9FD877537DAEF348`.
- The single final `node tools/verify.js` passed baserom identity, toolchain, source policy, C
  linker ownership, target placement, relocations, exact target bytes, and Full ROM EXACT. Counts
  remained 439 `PURE_C` / 27,024 bytes and 61 `HYBRID_C` / 32,928 bytes. Verification report
  SHA-256: `C4B3D503A7D1A1FB9ECC6CCC8725763D58B67F080FF923633074C8D905252D30`.

The proposed uncommitted correction resolves the narrowed `HABSW1-SR-F01` acceptance defect.
Proportional independent re-review remains the Director's next gate.
