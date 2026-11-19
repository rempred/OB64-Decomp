# Audio envelope in Magnus’s confrontation with Paul

The [Editor director](codex://threads/01a1eae5-90a2-7c31-956d-6ed447687e40) referred two routines on November 18. In [scene 290](../../../docs/Plans/task-logs/story-cutscene-preview-20261118.md), playback reaches Director word 174 and requests an audio envelope using index 44. The [accepted command dispatcher](../../src/lib/func_00284288.c) passes four script operands to the initializer for command `0xB4`. The desktop test’s initial gain table contains four values.

| Function | US Rev 0 ROM, exclusive end | Bytes | Evidence to preserve |
| --- | --- | ---: | --- |
| [Initializer](../../asm/original/rev0/lib/func_00283224.s) | `[0x283224, 0x283318)` | 244 | In the indexed path the instructions at `0x2832AC–0x2832BC` load a word from `0x800EB2E0 + 8 × index` and store its low halfword into the envelope. |
| [Update](../../asm/original/rev0/lib/func_00283350.s) | `[0x283350, 0x2834C4)` | 372 | The first two instructions load state consumed after the historical `0x283358` label. Keep the entire owner and follow updates to the initialized state. |

The [existing audio comparison](../../../editor/native/tests/scene-audio-mips.cjs) exercises the original routines, including graduation with gain index 3. It supplies controlled values and audio calls. The Editor owns the index-44 caller state, the preview of the confrontation and exported-game checks. A fixed value for entry 44 requires separate evidence.

The [source worker](codex://threads/01a1f11d-cd43-7720-8eee-aeaab4517558) owns both functions under `build/matching/paul-audio-261118`. The [existing production integrator](codex://threads/01a1f05f-2cc1-7700-88c1-dcf0b0551584) reconciles the interface and runs one full-ROM verification for the pair. [Liedel’s dialogue wave](liedel-dialogue-renderer.md) can proceed independently.
