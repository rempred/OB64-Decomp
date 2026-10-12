# func_0012FBB8: q5-narrow-accumulator-restores-copy-but-ternary-remains-expanded

Preservation does not change current source ownership or establish matching acceptance.

- Candidate: `3A1A7FFCEC9C7CE542C709BDAC7A010219C8CCE212E35A5561604B1C8BA03086`
- Observation: `898CABFE066221BCBBC109844F67F01712903C6CDA7E6152BCAA0F41CB0488FC`
- Source: [exact C](../archive/matching-c-candidates/2026-10-12-func_0012FBB8-3a1a7ffcec.c)
- Metadata: [curated observation](func_0012FBB8-3a1a7ffcec.observation.json)

Preserve source-bound Q5 narrow-ternary research; private evidence retains its original diagnostic status and canonical acceptance is established separately by the complete-wave verifier.

## Source context

Historical PURE_C C67C7E65CD source was reproduced as control.c under current authenticated inputs: 580 bytes, 15 differing words/44 bytes, with quotient forwarded into s0.

Change only the actual accumulator var_s0_31 from s32 to u16 while keeping ternary average selection.

## Recorded observation

PURE_C private watch restores div v0,v0,v1 and move s0,v0 but emits the division before the default block with a jump/copy delay slot. The full function is 588 bytes and remains nonexact. Narrowing changes the desired mechanism despite the worse whole-body comparison.

## Remaining failure

Default/divide selection ordering and extra extent remain. This is an informative intermediate, not a selected best or canonical match.

Research role: counterexample; selected emitted best: false.

Replay: `node tools/match.js probe func_0012FBB8 --source docs/archive/matching-c-candidates/2026-10-12-func_0012FBB8-3a1a7ffcec.c`. Check the metadata's expanded/header identities before interpreting its dumps.
