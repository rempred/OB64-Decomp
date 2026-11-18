# Actor placement, body selection and mission-briefing actors

Completed on November 17, 2026. The final fresh verifier at `3ac73120` confirmed every function in the wave roster as matching PURE_C in the same byte-identical US Rev 0 ROM. The shared pose updater's 88-byte switch table is an additional C contribution inside an otherwise retained assembly data row. [Integration closeout](cursors/actor-briefing-integration.md) · [Final roster and evidence](../../build/integration/actor-briefing/program-acceptance-evidence.json)

Three top-level Sol 6.2 XHigh matching workers continued in their original chats across waves, with a separate sole production integrator on main. All roles and notification routes were released at closeout. The census and wave briefs below record the scope at assignment.

## Direct caller census

The normalized Rev 0 [constructor call census](../../../wiki/combat-body-animation-default-constructor-argument-producer-static-20260727/constructor-call-reference-census.jsonl), original assembly and current C registry identify nine calls to `func_002A9364` in seven physical owners. Addresses below are z64 ROM offsets. The two scene-placement call sites belong to the body at 2AAC68 inside the 2AAC60 owner.

| Complete owner | Call sites | Input to initializer | Source work |
| --- | --- | --- | --- |
| 00284288 | 284FB4 | Command 0x2A supplies art and owner from words +0x08 and +0x18 | Existing C, shared dispatcher |
| 002A9364 | 2A9804 | Related-slot recursion, with per-child sentinel resolution | A01 |
| 002AAC60 | 2AAE0C, 2AB098 | First uses row +0x48/+0x4C, second requests inherited values | Existing C |
| 002AB0F8 | 2AB278 | Actor-input row pair | A02 |
| 002ABB3C | 2ABECC, 2ABF00 | Both requests inherit current art and owner | Existing C |
| 002ACFD8 | 2AD1DC | Filtered presentation starter uses row pair | A02 |
| 002AD224 | 2AD3A4 | Presentation updater requests inherited values | A02 |

Mission briefing has a separate constructor. At 285EC4 the same dispatcher sends command 0xC2's two signed halfwords to 002B88C8. That wrapper selects the first eligible row among twenty and calls 002B867C at 2B8970. Row +0x48 and +0x4C supply ABI arguments four and five. Ordinal zero uses the occupied anchor. A later component copies the preceding component after its immediate pose call. The [review](../../../docs/reviews/cutscene-subordinate-construction-review-r1-20260910/report.md) distinguishes instruction execution under controlled services from natural mission playback.

## Complete waves

| Wave | Complete owners, z64 start to exclusive end | First investigation |
| --- | --- | --- |
| A01 | 2A9364–2A985C | Compare 0x2A's explicit arguments, row-derived arguments and a linked child inheriting different fields from its parent. Preserve the original request across recursion. Inspect the first mismatched store, branch or call relocation. |
| A02 | 2AB0F8–2AB2A8, 2ACFD8–2AD224, 2AD224–2AD420 | Compare a row-supplied start with an inherited refresh. Preserve both eight-byte folded preambles. Check coordinate loads and initializations against the accepted 2AAC60 source pair before changing indexing. |
| M01 | 2B88C8–2B89B8, 2B867C–2B88C8 | Follow 0xC2 through the wrapper first. Compare one occupied anchor with a later component present, looking for copy source, immediate pose, and publication order. Keep the stack argument signedness and width grounded in the call. |
| A03, continuation | 20D870–20D9C4, 20C120–20C164 | Trace the persistent-character pair into the row. Test classification of null, ordinary and paired contexts (10, 25, 123). Both constructors call the same predicate at live 801C8C90. |
| A04, continuation | 2A98C4–2A99D0 | Companion 0x2B query on the initialized pose. Retain the folded entry and establish the dispatcher return ABI from the consuming instructions. |
| A05, continuation | 2AD574–2AD6D0, 2AB574–2AB6BC, 2AD434–2AD574 | Follow the context-specific availability filter and final leader-slot normalization from 2ABB3C. Compare the explicit 0xA6 member-slot binding with automatic placement. |
| P01, continuation | 29E218–29E70C | Immediate pose sequencer shared by both constructors. Reconcile its switch destinations, table owner and the complete producer before dispatch. Compare the alternate decoder call and first post-pose state with the briefing clone control. |

At assignment, the continuation rows had original assembly owners and no same-named active C target. Each complete wave passed guarded preparation before dispatch. P01 used the existing auxiliary contract to preserve the original 208-byte prefix and 232-byte tail around the compiler-emitted table.

## Source and runtime boundaries

Existing callers disagree on the initializer declaration. 2AAC60 declares a word return, while 2ABB3C and 284288 declare void. Read the return paths, including the early slot return, and check actual result use before the integrator reconciles prototypes. The P02 caller-width experiment in the matching study supplies the control.

The class-default sources 19554C, 249290 and 23A3A0 feed the persistent character. The deployed-row initializer 20C908 and subordinate graph builder 20CBDC are existing C. Keep the accepted scene constructor 2AB810, placement 2AAC60, materializer 2ABB3C, lifecycle query 2AD420, appearance getters 43E88/43EDC/43F30/43F84, equipment selector 45934, resource services 2015C8/205C88/207658 and alternate decoder 204F34 as call and regression controls. The [constructor argument trace](../../../docs/combat-animation-system.md) and [Director command reference](../../../docs/cutscene-director-command-reference.md) identify these interfaces. General allocation, the scheduler, movement, renderer and archive loading are shared services. Reopen membership if a dedicated producer or owner spanning this boundary is demonstrated.

The editor's [body-selection export](../../../editor/native/game/art/body-selection.c) and 675 original-MIPS cases provide behavioral controls. Derive retail C independently from original assembly and project evidence. The [briefing preview](../../../editor/cutscene-runtime.js) exposes where launch, allocation or preparation results are still required. A natural 0xC2 witness is a separate semantic investigation. Editor changes, patch removal and full-game playback are outside the matching acceptance claim.

Use the [matching study](../research/how-matching-works-20261117.md) and [normal workflow](../WORKFLOW.md). Integrate complete ready waves serially with mechanical PURE_C classification, sole C ownership, exact placement and relocations, exact linked target bytes and a byte-identical full ROM. Preserve original assembly. No per-function full-ROM run.
