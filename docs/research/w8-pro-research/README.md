# W8 research handoff for ChatGPT Pro

Prepared 2026-09-08 from repository commit `3815708b`. This package summarizes existing evidence; it introduces no new compiler, semantic, structural or matching acceptance claim. The three source hashes were checked during preparation. No compiler experiment or ROM verification was repeated.

## Start here

1. Read [the research request](research-request.md), then [the evidence brief](evidence-brief.md).
2. Read the current C and original assembly for the target you investigate. Assembly files contain exact `.word` values, ROM/runtime addresses and decoding comments. Comments are aids; words and accepted ownership govern.
3. Follow the relevant experiment reports linked in the brief. Prefer terminal summaries over earlier progress entries. Reports describe different exact inputs: do not merge their pseudo numbers, stack mappings or scores.
4. Return a ranked set of concrete, falsifiable experiments for the local implementation worker. The web researcher is not being asked to certify matching or reconstruct the program's administrative history.

## Source and contract map

| Target | Current source | Original reference |
|---|---|---|
| 3C00 | [func_001F3C00.c](../../../src/lib/func_001F3C00.c) | [func_001F3C00.s](../../../asm/original/rev0/lib/func_001F3C00.s) |
| 6098 | [func_001F6098.c](../../../src/lib/func_001F6098.c) | [func_001F6098.s](../../../asm/original/rev0/lib/func_001F6098.s) |
| DB10 | [func_0020DB10.c](../../../src/lib/func_0020DB10.c) | [func_0020DB10.s](../../../asm/original/rev0/lib/func_0020DB10.s) |

The renderer sources include [combat_draw.h](../../../include/game/combat_draw.h), [combat_draw_commands.h](../../../include/game/combat_draw_commands.h) and [combat_pose_record.h](../../../include/game/combat_pose_record.h). Read these before inferring argument types, side effects or macro evaluation order.

Required repository rules are [AGENTS.md](../../../AGENTS.md), [WORKFLOW.md](../../WORKFLOW.md), and [SOURCE_POLICY.md](../../SOURCE_POLICY.md). Current sequencing is in [the program plan](../../Plans/sequential-main-program.md); the technical next assignment is [W8 R8](../../Plans/prompts/combat-draw-wave8-r8.md). The web research request does not activate that local source assignment.

## What is available remotely

Tracked C, headers, original assembly, configuration, research reports and review reports are published. The original assembly is sufficient to inspect target instructions without downloading a ROM. Git history preserves prior committed sources, but many temporary experiments were never source commits.

Ignored `build/` paths cited in reports are **local-only**: candidate snapshots, expanded inputs, compiler binaries, allocation traces, RTL dumps, objects, linked comparisons and generated proof reports are not included. A hash identifies an artifact; it does not make its contents available to the web app. Do not claim to have inspected one from its hash or from a report's summary. If a particular comparison requires missing content, name the exact smallest excerpt needed and the decision it would resolve. The local worker can supply a bounded authored explanation or run an experiment under existing contracts.

For stable source citations, use the `3815708b` revision rather than changing `main`. For example: [3C00 at the research baseline](https://github.com/rempred/OB64-Decomp/blob/3815708b/src/lib/func_001F3C00.c). This package is added after that baseline. No repository history has been rewritten.

## Current acceptance boundary

W7 is the last accepted exact wave. W8 contains fourteen targets, including these three nonexact targets. Other focused-exact candidates remain provisional pending the single final combined W8 verifier. The complete Combat → Squad → High Attack program remains required. This handoff is intentionally limited to the three current technical blockers; it does not narrow that program.

Only mechanically classified PURE_C, sole C ownership, accepted placement, correct actual relocations, exact target bytes and an exact complete normalized US Rev 0 ROM establish matching-C acceptance. Matching does not establish original source identity or semantic names. Full-wave acceptance is performed locally once the complete wave is ready.
