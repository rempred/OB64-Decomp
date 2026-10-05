# resource_arena_register: returned-slot-lifetime

Preservation does not change current source ownership or establish matching acceptance.

- Candidate: `269C4E086FD874E9AABE7CAD38668C86D22DFA744D6204626D592DD872DB60D9`
- Observation: `D803D95A195A21A6D4C4798F2966D1609CD14FAB0533BF2F81C3AA9388D1D4BD`
- Source: [exact C](../archive/matching-c-candidates/2026-10-05-resource_arena_register-269c4e086f.c)
- Metadata: [curated observation](resource_arena_register-269c4e086f.observation.json)

Complete arena wave: source-bound compiler experiment; see authored observation for measured effect and remaining gates.

## Source context

Full resource_arena_register owner: primary500, independently callable leaf28 and load-before-prologue prefix. Watch33 uses the same source as watch19 except for the primary's SI return type and return slot. Both are PURE_C528 under the pinned toolchain; original ASM remains active, so this is symbolic-object evidence only.

Return the captured preincrement slot, preserving the old 16-bit count in v0 through the function return as the retail instructions do.

## Recorded observation

Watch33 is rawRelocationMaskedExact for all528 bytes. The live returned slot occupies v0 through the tail; offset uses v1, the header/endpoint a0 and captured/updated count a1. No instructions or artificial padding are added. The prior void-return candidate's short slot lifetime allowed base/end to reuse v1 and count a0. This is a measured counterexample to a tail model that assumes the slot dies after address formation; non-local source variables are unnecessary.

## Remaining failure

Private GLOBAL leaf census remains distinct from the production LOCAL contract. Actual external bindings, sole C ownership, placement, exact linked target bytes and one complete seven-owner full-ROM verifier remain required. This establishes no caller use or runtime behavioral claim.

Research role: emitted-best; selected emitted best: true.

Replay: `node tools/match.js probe resource_arena_register --source docs/archive/matching-c-candidates/2026-10-05-resource_arena_register-269c4e086f.c`. Check the metadata's expanded/header identities before interpreting its dumps.
