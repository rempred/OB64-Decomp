# resource_arena_register: register-single-capture

Preservation does not change current source ownership or establish matching acceptance.

- Candidate: `798EE89AC0AD5E9612E9AA703656C6B4D46E9C8DDCF2C2E14CFC0B74AD448B97`
- Observation: `0A9A61C52617BEC3FB366358AB7024D81C326767F6D0F5218DDFE81773978928`
- Source: [exact C](../archive/matching-c-candidates/2026-10-05-resource_arena_register-798ee89ac0.c)
- Metadata: [curated observation](resource_arena_register-798ee89ac0.observation.json)

Complete arena wave: source-bound compiler experiment; see authored observation for measured effect and remaining gates.

## Source context

Complete resource_arena_register physical owner compiled under the pinned native toolchain. Evidence from register-watch-10.json is symbolic-object diagnostic evidence because the original ASM owner remains active.

Capture a u16 table index without changing that local; increment the global count separately after reading the endpoint.

## Recorded observation

Primary496 plus leaf28 are emitted. CombineC037 drops the captured count zero_extend because its last value is a zero-extending HI memory read. The required ANDI is absent; initial captured-count guard becomes BEQ.

## Remaining failure

Actual external bindings, sole C ownership, placement, exact linked target bytes and one complete seven-owner full-ROM verifier remain required.

Research role: effect-example; selected emitted best: false.

Replay: `node tools/match.js probe resource_arena_register --source docs/archive/matching-c-candidates/2026-10-05-resource_arena_register-798ee89ac0.c`. Check the metadata's expanded/header identities before interpreting its dumps.
