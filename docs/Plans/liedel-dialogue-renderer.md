# Liedel’s recruitment dialogue

The [Editor director](codex://threads/01a1eae5-90a2-7c31-956d-6ed447687e40) referred the resident text renderer on November 18. The [story playback survey](../../../docs/Plans/task-logs/story-cutscene-preview-20261118.md) records Liedel’s offer (selector 121) stopping at word 183 on update 357 with an unsupported encoded character. Both responses (122 and 123) encounter the same error while preparing the offer. Which encoded byte and retail path account for that failure remains an Editor playback question.

| Complete Rev 0 owner | ROM interval, exclusive end | Bytes | Reason for matching |
| --- | --- | ---: | --- |
| [Text renderer](../../asm/original/rev0/lib/func_0004fe04.s) | `[0x4FE04, 0x50604)` | 2,048 | Consumes text and control sequences. Calls the helper at `0x4FF24`, `0x4FFB4` and `0x50034` and tests its return each time. |
| [Glyph helper](../../asm/original/rev0/lib/func_0004f86c.s) | `[0x4F86C, 0x4FE04)` | 1,432 | Reads the input span and draws with different small- and normal-font rectangles. Glyph selection and spacing also involve downstream routines and font metrics. |

The wrappers at `0x4EF34` and `0x4F2AC` establish the entry interface. The [item-font investigation](../../../docs/Plans/task-logs/attack-shared-playback-20261101.md) supplies independent controls for a single small span, two lines with a horizontal offset, and the normal font. Comparing consumed bytes, selected glyph and cursor advance separately can distinguish parsing from layout. The historical parent-function size comment on the renderer includes a neighboring function; use the accepted extent ending after the delay slot at `0x50600`.

The [matching worker](codex://threads/01a1f11b-0fab-7f70-b8d9-2792fd4b4334) owns both targets in `build/matching/liedel-text-261118`. The [current production integrator](codex://threads/01a1f05f-2cc1-7700-88c1-dcf0b0551584) retains the sole canonical write role for one combined verification. This wave has independent acceptance from the [six story-event functions](story-event-continuation.md). The Director sends the accepted C to the Editor for replay of the offer and both responses.
