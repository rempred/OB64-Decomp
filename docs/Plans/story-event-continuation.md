# Story choices and the next scene

On November 18, 2026, Joe asked the [Editor director](codex://threads/01a1eae5-90a2-7c31-956d-6ed447687e40) to send functions that would materially help story editing for immediate matching. The first referral covers one caller and its interpreter. The previous [46-function cutscene program](cutscene-preview-services-draft.md) is accepted.

| US Rev 0 function | ROM range, exclusive end | Bytes | Consumer |
| --- | --- | ---: | --- |
| `func_00048024` | `0x48024–0x4813C` | 280 | Cutscene command `0xBB` reaches this driver. The instructions at `0x48054–0x48068` advance an accepted request. The driver calls the interpreter at `0x4810C`. |
| `func_00046854` | `0x46854–0x47A94` | 4,672 | The resident event interpreter can request a scene, test the answer through dialogue control 3, and request the corresponding reaction. |

Wentinus event program 22 selects question 171, 174, 177 or 180 according to the cast. Both edited answers for the cast without Dio and Leia have a Project64 reference. Sheen event program 20 connects his offer (159) to acceptance (160) or refusal (161). Opening either reaction separately tests the reaction script alone. The [story replay survey](../../../docs/Plans/task-logs/story-cutscene-preview-20261118.md) and [event evidence](../../../docs/Plans/task-logs/wentinus-native-semantics-20261103.md) identify where earlier tests advanced the request cursor manually.

The [matching worker](codex://threads/01a1f05f-2856-7260-9e6d-02d145e80e0f) owns both functions in `build/matching/story-event-261118`. Start with the driver. Check the interpreter interface against the caller and the uses of its result, following the [P02 width experiment](../dossiers/func_0026d770-103dc31163.md). Inventory the full interpreter body, its five indirect dispatches, referenced tables, destinations and physical owners before tuning. An early linked comparison should distinguish a missing dispatch body or table from an instruction-selection difference. Keep new behavioral conclusions tied to the cases that demonstrate them.

The [production integrator](codex://threads/01a1f05f-2cc1-7700-88c1-dcf0b0551584) prepares selected inputs, reconciles the complete pair and runs the normal combined verifier. The Director returns the accepted source and evidence to the Editor for Wentinus and Sheen playback. The Editor can work on already evidenced decision paths in parallel.
