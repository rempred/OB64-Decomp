# func_002AAC60: natural-index-before-lifetime-fix

Preservation does not change current source ownership or establish matching acceptance.

- Candidate: `B390F0A1AC33365C0BC048E6EDCE7955B56D27B43FF72D5B718C4D2F49EB203C`
- Observation: `AD8052D2BEE63ED05A5437F8BD236E0AF414A15CEEDCA857DA33D43A45972438`
- Source: [exact C](../archive/matching-c-candidates/2026-11-09-func_002AAC60-b390f0a1ac.c)
- Current reference: [successor observation](func_002AAC60-55b287797b.md)
- Original observation envelope: Git commit `1c8419fb` at this dossier’s original metadata path.

Retain direct27 as the minimal natural-index allocation counterexample; the final example is src/lib/func_002AAC60.c, not another archived final-source copy.

## Source context

Complete 1176-byte func_002AAC60 with natural outer unit indexing and natural inner work[isLeader + 4] indexing. The true leader arm assigns isLeader = 1 before loading startX/startY. Compare the final canonical source, which moves only that assignment after the two loads; unused declarations/comments also differ.

Keep the natural inner index; delay the true-arm isLeader = 1 assignment until after both coordinate loads, without moving declarations or rewriting the loop.

## Recorded observation

Direct27 and direct57 both emit 294 instructions and a 120-byte frame covering the full owner and preamble. Direct27 has 29 normalized word differences involving s2/s3 roles; direct57 has zero after masking relocation fields and normalizing internal jumps. The canonical source with the lifetime change has an exact 1176-byte linked diff, so natural indexing is not inherently incompatible with the retail allocation.

## Remaining failure

This counterexample does not match retail. The comparison is specific to this producer and does not prove the original C or a general KMC allocation rule. Final-source acceptance belongs to its canonical verifier, not these symbolic-object diagnostics.

Research role: counterexample; selected emitted best: false.

Replay: `node tools/match.js probe func_002AAC60 --source docs/archive/matching-c-candidates/2026-11-09-func_002AAC60-b390f0a1ac.c`. Check the metadata's expanded/header identities before interpreting its dumps.
