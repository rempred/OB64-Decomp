# resource_arena_init: retained-root-address

Preservation does not change current source ownership or establish matching acceptance.

- Candidate: `809AFD5B29D11FB377F640ACA6425F7238EC913FB0B7DF09515F4B276038C552`
- Observation: `5866E2856579DD57803819F03D9DCD9125215E5829767AE49B1CB44E647E9F38`
- Source: [exact C](../archive/matching-c-candidates/2026-10-05-resource_arena_init-809afd5b29.c)
- Metadata: [curated observation](resource_arena_init-809afd5b29.observation.json)

Complete arena wave: source-bound compiler experiment; see authored observation for measured effect and remaining gates.

## Source context

Same complete owner, record views, prototypes and alignment source as direct-field watch3. Private watch8 compiles PURE_C, frame32,192 bytes.

Retain root=(ArenaNode**)((u8*)arena+8), clear *root and pass that same root pointer to the insertion helper.

## Recorded observation

The root clear becomes sw zero,8(s1), with addiu a0,s1,8 preceding the call; the store fills the retail delay slot. The four extra bytes disappear. End alignment still appears at020 before argument/table-address setup instead of034.

## Remaining failure

Complete192-byte extent but nonexact initial instruction schedule; unresolved external relocations and linked/full-ROM gates remain.

Research role: effect-example; selected emitted best: false.

Replay: `node tools/match.js probe resource_arena_init --source docs/archive/matching-c-candidates/2026-10-05-resource_arena_init-809afd5b29.c`. Check the metadata's expanded/header identities before interpreting its dumps.
