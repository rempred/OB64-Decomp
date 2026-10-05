# resource_arena_init: root-direct-field

Preservation does not change current source ownership or establish matching acceptance.

- Candidate: `4F331D5F4EA920C7F7AA704496941FDAF81C82DDAA39321CF1ACFA6F1F777AD3`
- Observation: `049D6E29BBDC638F8715FC9569402AE08AB650F8212325612E86322025C40FA1`
- Source: [exact C](../archive/matching-c-candidates/2026-10-05-resource_arena_init-4f331d5f4e.c)
- Metadata: [curated observation](resource_arena_init-4f331d5f4e.observation.json)

Complete arena wave: source-bound compiler experiment; see authored observation for measured effect and remaining gates.

## Source context

Full192-byte resource_arena_init owner. A12-byte ArenaRecord view preserves the pointer reload after the base->end store. Pinned private watch3 source4F331D5F produces196 bytes, frame32, PURE_C; linked evidence unavailable for this inactive ASM owner.

Use arena->root=0 directly, with the table pointer retained for the insertion arguments.

## Recorded observation

RTL insn51 begins as MEM/s(reg76+8)=0, but private probe27FE CSE folds it to MEM/s(CONST(symbol D_800AEDB0+8))=0. The emitted LUI+SW adds4 bytes and moves the address-add into the insertion call's delay slot. The end AND is at020 rather than034.

## Remaining failure

196 versus192 bytes, root-store addressing/delay slot and end-alignment schedule differ. No linked or full-ROM acceptance.

Research role: counterexample; selected emitted best: false.

Replay: `node tools/match.js probe resource_arena_init --source docs/archive/matching-c-candidates/2026-10-05-resource_arena_init-4f331d5f4e.c`. Check the metadata's expanded/header identities before interpreting its dumps.
