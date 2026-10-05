# resource_alloc: alloc-offset

Preservation does not change current source ownership or establish matching acceptance.

- Candidate: `F21104DFB0730FB36416E3199304D992D3AAA79F5CC72A6B9F0C97366FCFA7D8`
- Observation: `30DA739E1E644FECBEC519FB46D5BE294DCD3BB589E390E7CD20EE243EA0A65A`
- Source: [exact C](../archive/matching-c-candidates/2026-10-05-resource_alloc-f21104dfb0.c)
- Metadata: [curated observation](resource_alloc-f21104dfb0.observation.json)

Complete arena wave: source-bound compiler experiment; see authored observation for measured effect and remaining gates.

## Source context

Complete resource_alloc physical owner compiled under the pinned native toolchain. Evidence from alloc-watch-2.json is symbolic-object diagnostic evidence because the original ASM owner remains active.

Retain an explicit byte-offset local for table lookups, with the unsigned count predicate corrected.

## Recorded observation

Emits440 bytes and saves both s5 and fp for duplicate offset quantities; retail owner is428 bytes. Probe15FA997C shows the explicit source quantity remains separate from the equivalent synthesized address quantity.

## Remaining failure

Actual external bindings, sole C ownership, placement, exact linked target bytes and one complete seven-owner full-ROM verifier remain required.

Research role: effect-example; selected emitted best: false.

Replay: `node tools/match.js probe resource_alloc --source docs/archive/matching-c-candidates/2026-10-05-resource_alloc-f21104dfb0.c`. Check the metadata's expanded/header identities before interpreting its dumps.
