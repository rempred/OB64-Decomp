# resource_alloc: alloc-array

Preservation does not change current source ownership or establish matching acceptance.

- Candidate: `407E58AF91F51AEF1E2E615B3C882B1BB021410E1662ADAC87CB710DFA186583`
- Observation: `8B0237F0E4EE4E3831B722D5FB9EFAEFF1457774E85592D8CA2ADF40D3F3DB48`
- Source: [exact C](../archive/matching-c-candidates/2026-10-05-resource_alloc-407e58af91.c)
- Metadata: [curated observation](resource_alloc-407e58af91.observation.json)

Complete arena wave: source-bound compiler experiment; see authored observation for measured effect and remaining gates.

## Source context

Complete resource_alloc physical owner compiled under the pinned native toolchain. Evidence from alloc-watch-3.json is symbolic-object diagnostic evidence because the original ASM owner remains active.

Use direct ArenaRecord array indexing throughout instead of the explicit byte-offset local.

## Recorded observation

Emits428 bytes with the retail saved-register census; removes the duplicate offset lifetime. The scan increment is still in the find-call delay slot, and the needed argument is outside that slot.

## Remaining failure

Actual external bindings, sole C ownership, placement, exact linked target bytes and one complete seven-owner full-ROM verifier remain required.

Research role: effect-example; selected emitted best: false.

Replay: `node tools/match.js probe resource_alloc --source docs/archive/matching-c-candidates/2026-10-05-resource_alloc-407e58af91.c`. Check the metadata's expanded/header identities before interpreting its dumps.
