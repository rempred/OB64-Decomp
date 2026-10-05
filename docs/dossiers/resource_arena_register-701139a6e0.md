# resource_arena_register: register-live-guard

Preservation does not change current source ownership or establish matching acceptance.

- Candidate: `701139A6E04006B49F03391A31F1B320B3F269A499F63FBE8EDE0D07CA8ABFCF`
- Observation: `67184A5BC1DBDCCC7ED148E17FB359A52A24F5CD9AEA14D20CA3FC5AD9D652CB`
- Source: [exact C](../archive/matching-c-candidates/2026-10-05-resource_arena_register-701139a6e0.c)
- Metadata: [curated observation](resource_arena_register-701139a6e0.observation.json)

Complete arena wave: source-bound compiler experiment; see authored observation for measured effect and remaining gates.

## Source context

Complete resource_arena_register physical owner compiled under the pinned native toolchain. Evidence from register-watch-19.json is symbolic-object diagnostic evidence because the original ASM owner remains active.

Compare the zero-initialized scan index directly with D_800AEDE0 at loop entry; use SI n and explicit (u16)n slot capture before n++.

## Recorded observation

Preserves full528 bytes, frame48, initial BLEZ, read-before-prologue prefix and all required bodies. Tail count/index/offset/end registers remain permuted. The best source is recoverable; this is not an accepted match.

## Remaining failure

Actual external bindings, sole C ownership, placement, exact linked target bytes and one complete seven-owner full-ROM verifier remain required.

Research role: emitted-best; selected emitted best: true.

Replay: `node tools/match.js probe resource_arena_register --source docs/archive/matching-c-candidates/2026-10-05-resource_arena_register-701139a6e0.c`. Check the metadata's expanded/header identities before interpreting its dumps.
