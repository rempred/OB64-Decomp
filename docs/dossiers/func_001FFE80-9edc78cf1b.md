# func_001FFE80: current-source-plain-c-control

Preservation does not change current source ownership or establish matching acceptance.

- Candidate: `9EDC78CF1B5B1C2BEE5EFBA5D3DD160349070462479603B09DCA899584BB18D1`
- Observation: `CE844F0333992ACC6DCA8327A128F33A7FB9AA763A2B57C8E87FDFBE23A6C0B0`
- Source: [exact C](../archive/matching-c-candidates/2026-09-29-func_001FFE80-9edc78cf1b.c)
- Metadata: [curated observation](func_001FFE80-9edc78cf1b.observation.json)

Exact source and observed KMC effect for the shared-context PURE_C retry

## Source context

The accepted 796-byte func_001FFE80 owner is exact HYBRID_C. This control starts from the current active source, rather than the older archived pure-C draft.

Remove the empty tied-output/clobber assembler template and replace the two assembler moves with ordinary C assignments; retain the current direct frame-step call expression and every surrounding load and call.

## Recorded observation

Source policy classified PURE_C. The current-run canonical diff compiled the source and rejected its 792-byte .ob64.r3750 section against the accepted 796-byte owner before linking. The scratch workbench compiled 198 instructions with 54 relocations; its symbolic-object comparison is nonexact. In its compiler assembly the flag branch has no record-to-core move in the delay slot.

## Remaining failure

One emitted instruction is missing and the second-loop allocation and final-call scheduling differ from retail. This trial is not a linked or complete-ROM match.

Research role: effect-example; selected emitted best: false.

Replay: `node tools/match.js probe func_001FFE80 --source docs/archive/matching-c-candidates/2026-09-29-func_001FFE80-9edc78cf1b.c`. Check the metadata's expanded/header identities before interpreting its dumps.
