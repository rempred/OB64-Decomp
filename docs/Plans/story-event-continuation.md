# Story choices and the next scene

The complete six-function program passed on main at `9be88806`. The [final acceptance record](../../build/integration/story-event/story-event-program-acceptance-evidence.json) covers all six sole C owners in one exact US Rev 0 rebuild, both C contributions to the shared table row and six driver/interpreter comparisons with controlled external calls. The Director delivered the final pair to the Editor on November 18.

On November 18, 2026, Joe asked the [Editor director](codex://threads/01a1eae5-90a2-7c31-956d-6ed447687e40) to send functions that would materially help story editing for immediate matching. The first referral covers one caller and its interpreter. The previous [46-function cutscene program](cutscene-preview-services-draft.md) is accepted.

| US Rev 0 function | ROM range, exclusive end | Bytes | Consumer |
| --- | --- | ---: | --- |
| `func_00048024` | `0x48024–0x4813C` | 280 | Cutscene command `0xBB` reaches this driver. The instructions at `0x48054–0x48068` advance an accepted request. The driver calls the interpreter at `0x4810C`. |
| `func_00046854` | `0x46854–0x47A94` | 4,672 | The resident event interpreter can request a scene, test the answer through dialogue control 3, and request the corresponding reaction. |

Wentinus event program 22 selects question 171, 174, 177 or 180 according to the cast. Both edited answers for the cast without Dio and Leia have a Project64 reference. Sheen event program 20 connects his offer (159) to acceptance (160) or refusal (161). Opening either reaction separately tests the reaction script alone. The [story replay survey](../../../docs/Plans/task-logs/story-cutscene-preview-20261118.md) and [event evidence](../../../docs/Plans/task-logs/wentinus-native-semantics-20261103.md) identify where earlier tests advanced the request cursor manually.

The [matching worker](codex://threads/01a1f05f-2856-7260-9e6d-02d145e80e0f) owns both functions in `build/matching/story-event-261118`. Start with the driver. Check the interpreter interface against the caller and the uses of its result, following the [P02 width experiment](../dossiers/func_0026d770-103dc31163.md). Inventory the full interpreter body, its five indirect dispatches, referenced tables, destinations and physical owners before tuning. An early linked comparison should distinguish a missing dispatch body or table from an instruction-selection difference. Keep new behavioral conclusions tied to the cases that demonstrate them.

The [production integrator](codex://threads/01a1f05f-2cc1-7700-88c1-dcf0b0551584) prepares selected inputs, reconciles the complete pair and runs the normal combined verifier. The Director returns the accepted source and evidence to the Editor for Wentinus and Sheen playback. The Editor can work on already evidenced decision paths in parallel.

## Event entry and campaign effects

The Editor’s second referral adds the paths that establish an event’s starting state and translate its outgoing requests. The three event-entry routines form a complete wave. The request mapper has its own text owner and contributes table entries to the same physical data row as the interpreter.

| Assignment | Function | US Rev 0 ROM, exclusive end | Bytes | What the editor can check |
| --- | --- | --- | ---: | --- |
| Event entry | `func_00047dd8` | `0x47DD8–0x47EE0` | 264 | The world caller selects arrival or investigation. The first two instructions feed the branch after the historical `47DE0` label. |
| Event entry | `func_00048294` | `0x48294–0x484B4` | 544 | The loader establishes the active event context. Its halfword store at `0x4839C` supplies the row that the row 68 test seeded. |
| Event entry | `func_00047ee0` | `0x47EE0–0x48024` | 324 | A caller can select a particular program and entry before invoking the interpreter at `0x47FB8`. |
| Request mapping | `func_00046738` | `0x46738–0x46854` | 284 | The interpreter and scheduler use the returned request code and associated subtype to route campaign effects. |

The [entry worker](codex://threads/01a1f087-8a01-7e01-a576-7676ca725980) owns the [three prepared entry targets](../../build/story-entry-261118-preflight.json) in `build/matching/story-entry-261118`. The [mapper worker](codex://threads/01a1f087-8e2f-7af1-bbd9-7e1c2f561a2f) owns the [prepared mapper](../../build/story-mapper-261118-preflight.json) in `build/matching/story-mapper-261118`. The [arrival cases](../../../docs/Plans/task-logs/scenario-events-view-20261103.md), [row 68 continuation](../../../docs/event-semantics/review.md) and [256 mapper inputs](../../../docs/event-semantics/vm-reference.md) supply behavior checks.

The [original 1,424-byte table row](../../asm/original/rev0/lib/table_000665c8.s) contains 27 mapper pointers and 325 interpreter pointers across five tables. Each pointer lands inside its respective function. Four zero words start at `0x66634`, `0x66A34`, `0x66B34` and `0x66B54`. The mapper starts at `0x665C8` and the interpreter tables start at `0x66638`.

The first ready wave can go to integration. If the mapper or interpreter arrives first, the integrator checks its compiled table extent, alignment and relocations against the [ordinary shared-row rules](../WORKFLOW.md), with the other contribution retained in assembly. Accepting the second requires checking both contributions together across the entire row. The entry trio can proceed independently.
