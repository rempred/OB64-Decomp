# Director handoff — November 18, 2026

**Joe assigned all 46 owners in the [cutscene preview program](../cutscene-preview-services-draft.md).** Q1 covers actor-dependent branches, P1 the scripted Army panel opening and T1 the shared title-card path. Retain the three Sol 6.2 XHigh matching chats across complete waves and use a separate production integrator. Joe requested no assistants. The Director owns native route qualification, preflight release, wave acceptance and reassignment. The [actor placement and mission-briefing program](../actor-placement-briefing-program.md) closed on main at `3ac73120`.

## Current chats

Director `01a1eb8b-d5e6-7083-bb49-8e6648ef3e0b` is the native destination on host `local`. The per-chat monitor directories under `~/.local/share/codex-thread-monitors/cutscene-preview-261117-*` keep their original suffix across reassignments.

| Role | Chat | First wave / route suffix |
| --- | --- | --- |
| Matching 1 | `01a1ecea-4461-7391-9450-0209f3c2bee8` | Q1 / q1 |
| Matching 2 | `01a1ecea-3ceb-7173-abd1-499259192f6e` | P1 / p1 |
| Matching 3 | `01a1ecea-481f-7a72-91ad-f8cdcf49cfb5` | T1 / t1 |
| Production | `01a1ecea-4071-7b73-a5b0-0baa66dd3b92` | integration |

All four native message and stop routes are verified. All 46 owners passed guarded preparation on the [selected inputs](../../../build/cutscene-preview-inputs-20261117/manifest.json). T4 was accepted at `2abac0b3`. Retained worker 1 started T5 title-scene callbacks. Worker 2 continues P2 scripted Army-panel updates and worker 3 continues T2 chapter reveal. The [integrator](cutscene-preview-integration.md) retains production ownership pending the next complete wave. Preserve all three chats and their watchers.

After all 46 owners pass, send Joe's [Editor director handoff](../cutscene-preview-services-draft.md#editor-handoff-after-program-acceptance) and record delivery. Editor director chat `01a1eae5-90a2-7c31-956d-6ed447687e40` is verified on host `local`.

## Accepted baseline

[T4 acceptance](../../../build/integration/cutscene-preview/t4-acceptance-evidence.json) binds all four mission-entry companion routines to exact Rev 0 CURRENT `8F90F3F160E4FA51A22F991B342EE10038424C16064E0540D23C13CB1374733A`. [Three controlled traces](../../../build/integration/cutscene-preview/t4-accepted-traces.json) cover the companion and title draw/release order. Earlier accepted waves are [T3](../../../build/integration/cutscene-preview/t3-acceptance-evidence.json), [P1](../../../build/integration/cutscene-preview/p1-acceptance-evidence.json), [Q1](../../../build/integration/cutscene-preview/q1-acceptance-evidence.json) and [T1](../../../build/integration/cutscene-preview/t1-acceptance-evidence.json).

## Released assignments

The A01/A03/A04, A02/A05/P01 and M01 matching chats completed their assignments. The production integrator finished all commands and released ownership. All four route processes exited through their own stop flags; their delivery records remain in the original `actor-briefing-261117-*` monitor directories. Preserve the private candidates, selected inputs and generated proof at their existing paths. The B02 research-reference repair is recorded at `bb1a4e6e`.

## Closed work

[Body construction and equipment visuals](../body-equipment-program.md) closed with B02 scene placement (`8eaabdfc`) and B01 body construction (`ea3dfaae`). Both complete owners passed pure-C and full-ROM verification. The [integration closeout](body-equipment-integration.md) preserves the accepted controls, original assembly references and earlier wave fingerprint. The [consumable effects program](consumable-integration.md) closed on November 3 (`0b972a78`).

Attack visual effects closed on October 31 (closure commit `38efb10a`). The [descriptor program](../descriptor-serialization-program.md) closed on October 26 with an exact hybrid encoder. Its pure-C objective and sixteen-byte tail remain open research questions. The [standard-library program](../standard-library-program-draft/PROGRAM.md) finished October 17.
