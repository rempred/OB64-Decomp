# High Attack Battle Stream Wave 1 Layout-Verifier Independent Re-review

Date: 2026-09-02
Assignment: `ob64-high-attack-wave1-structural-layout-verifier-rereview-20260902`
Revision: `1`
Launch ID: `HABSW1-SRR2-20260902-01`
Receiving task: `01a063b3-508e-7a11-8852-27196080c7d1`
Director task: `01a04998-5492-7e62-aba5-9901250a123e`
Frozen corrected subject: `3e2f8022997baa14f9611bfedb26e37b100e3a9c`
Correction base: `2e77c5ea702498857a6a10dcc5dbd3609bf32cb5`

Verdict: **Accepted**

The narrowed residual of `HABSW1-SR-F01` is resolved. The ordinary Phase 8 path now rejects contradictory existing accepted-row structural provenance for either mixed-row slice, including matching-C execution and placement provenance for `.ob64.r4033.s0` and retained-assembly placement provenance for `.ob64.r4033.s1`. The valid 140-byte split-row build remains exact, and the correction does not weaken the checked unrelated ownership, placement, execution, auxiliary-section, multi-owner, or exact-ROM gates.

## Scope and protocol

This was a proportional causal re-review of the frozen correction. The four previously accepted structural conclusions were kept by reference and were not reopened. Matching-C implementation, semantic naming, assembly ownership changes, and source-class changes remained out of scope.

Before the first reviewer write, the worktree was clean and unstaged on branch `codex/high-attack-wave-1-structural-audit` at the exact frozen commit. Its parent was the assigned correction base. The assigned claim did not exist, and the worktree/process/thread checks found no other actor using the physical worktree. The claim was then created atomically with create-new semantics, read back, and left immutable:

- `docs/Plans/task-logs/ob64-high-attack-wave1-structural-layout-verifier-rereview-20260902-r1-HABSW1-SRR2-20260902-01.claim.json`
- raw SHA-256: `8A114F172A3639D46C2D17930ADCEE521753488C300F44FB6C43C2C5DD35AF02`

## Correction reviewed

The complete frozen delta `2e77c5ea702498857a6a10dcc5dbd3609bf32cb5..3e2f8022997baa14f9611bfedb26e37b100e3a9c` was reviewed. The executable change is confined to `tools/lib/phase8_matching_c.js`, with focused coverage added to `tests/split_row_phase8.js`.

For each mixed-row slice, Phase 8 now requires exactly one corresponding accepted-layout slice. It checks accepted `inputKind`, effective layout `inputKind`, and equality of every field in the Phase 7 external slice contract:

- `sectionName`
- `romStart`
- `romEndExclusive`
- `vramStart`
- `vramEndExclusive`
- `placementKind`
- `overlayDescriptorId`
- `loadSlabId`
- `overlaySection`
- `executable`
- `executableRangeId`
- `nonExecutableRangeId`

The matching-C slice must resolve through the accepted row selected by the text owner and must have effective `matching-c` ownership. The retained slice must resolve through its declared accepted row and remain effective `tracked-assembly`. Existing source, fallback, logical-range, linked-owner, retained-byte, and retained-placement checks remain in force. The focused test also fixes the twelve-field census against the Phase 7 external accepted-layout contract, so a later contract-field addition cannot silently escape this test.

## Independent causal checks

1. The unchanged independent mutation harness from the earlier re-review was run against the corrected subject. All twelve mutations were rejected: the three established controls and all nine contradictions that the earlier subject had accepted. The nine former counterexamples cover both slices' ROM/VRAM placement and the matching slice's execution, executable-range, descriptor, load-slab, and overlay-section provenance.
2. `node tests/split_row_phase8.js` passed. Its fresh report contains 36 distinct rejected mutations, covering every one of the twelve accepted-layout structural fields on both slices, both accepted `inputKind` values, both effective `inputKind` values, and the pre-existing split-row gates. The positive fixture linked exactly 140 bytes of `.ob64.r4033.s0` from `PURE_C`, retained `.ob64.r4033.s1` solely in assembly, and produced the canonical ROM SHA-256 `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`. Fresh report SHA-256: `270F5209750D236087A600211026122B739FECDAC7B2287E66C7CCE909D2850A`.
3. `node tests/multi_owner_phase8.js` passed and produced the same exact-ROM hash, preserving the unrelated multi-entry owner path.
4. `node tests/phase8_matching_c.js --output C:\Users\Joe\.codex\ob64-high-attack-wave-1-structural-audit\work\current\f9f766addf05186e490411e4\build` passed. Its ordinary targets remained accepted, and its owner, ELF-section, linked-auxiliary, preserved-tail, relocation, source-proof, and exact-ROM mutations remained rejected.
5. `git diff --check 2e77c5ea702498857a6a10dcc5dbd3609bf32cb5..3e2f8022997baa14f9611bfedb26e37b100e3a9c` passed. Static review found no writer/model/resolver, assembly-owner, configuration, or source-class change in the correction.

## Finding disposition

### `HABSW1-SR-F01` — resolved

The earlier report demonstrated that Phase 8 accepted nine contradictory existing accepted-layout fields. Those same counterexamples now fail at the ordinary verifier boundary. The added full external-field census and two-slice mutation matrix establish that the fix is not limited to the previously named examples. Both sides of the mixed row have unambiguous accepted-layout provenance, and malformed or contradictory input fails closed.

No new findings were identified.

## Evidence reuse and limits

The earlier independent re-review and the correction report were used as assigned indexes. Their accepted conclusions and frozen build evidence were retained by hash/reference where the correction did not affect them. This review independently reran the causal counterexamples and the proportional positive and regression suites; it did not repeat unrelated historical research or the full structural audit.

## Director consequence

The Director may integrate frozen corrected subject `3e2f8022997baa14f9611bfedb26e37b100e3a9c`, subject to normal intake hygiene, and may treat the structural dependency for the six blocked functions as accepted. Reviewer-owned records remain uncommitted and unstaged for Director intake.
