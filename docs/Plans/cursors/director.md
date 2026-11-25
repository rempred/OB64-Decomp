# Director handoff — November 25, 2026

**Army record ownership.** [Helpers](../../../build/integration/army-records/helpers-acceptance.json), [recruitment](../../../build/integration/army-records/recruitment-acceptance.json), Formation and Display passed. The [integrator](codex://threads/01a20fed-25a2-7272-9eea-c241bebda0ed) verifies all seven Selection functions together. All three source workers have disjoint [assignments](../army-record-ownership-program.md#selection-source-assignments).

**Selection.** The [renderer worker](codex://threads/01a20ffa-f76c-7052-923e-636c295880bd) and [Astra Medium advisor](codex://threads/01a21300-91c6-7122-ad96-31a6dc9db52f) retain `00136C38` and the private `00135EE4` match. [Formation](codex://threads/01a20ffa-ecfa-7093-a6c8-14647e5d6038) owns the [four prepared targets](../../../build/integration/army-records/selection-four-preflight.json), including both `00150550` rows. [Display](codex://threads/01a20ffa-f224-7a32-8d14-fda4ed64655d) owns [00159FD4](../../../build/integration/army-records/selection-large-preflight.json). All use [bundle B](../../../build/integration/army-records/selection-b-release.json). Coordinate live contract replacement at a command boundary.

**Display accepted.** The [eight functions](../../../build/integration/army-records/display-acceptance.json) passed at [183cbade](https://github.com/rempred/OB64-Decomp/commit/183cbade75d575c541e812c535e40e8a0c51cbf1). The installed audit reproduced the complete Rev 0 ROM.

**Formation accepted.** The [canonical report](../../../build/integration/army-records/formation-acceptance.json) binds 8,912 matching C bytes and the shared switch table to [9b2d76dd](https://github.com/rempred/OB64-Decomp/commit/9b2d76dd30f475a7393fc2960b4f319f9fbf2909).

**PR #8.** The verified PR receiver now wakes [this Director](codex://threads/01a20fce-044b-7530-a3e1-53ce76a22be3). [Initial checks](../../../build/pr8-review-9a2afc44/director-initial-triage.json) record the private `00135EE4` overlap. Recheck the head, reconcile ownership and run intake after Selection. [Contributor PR](https://github.com/rempred/OB64-Decomp/pull/8)

**Accepted.** The [C interface census](../c-interface-cleanup.md#four-remaining-compiler-inputs) closed at `662d6b24` with an empty exception list and a byte-identical Rev 0 ROM. [Canonical audit](../../../build/parse21/checked/canonical-acceptance.json) · [Current queue](../../NEXT_STEPS.md)

The Editor Director integrated the preceding revision `87530794` locally as `5b46b47` and verified the retail export. The [L4 capture notes](../c-interface-cleanup.md#retail-l4-dma-capture) identify the two execution breakpoints. Existing traces and static references do not identify a retail scene that reaches them.

The [two audio corrections](../c-interface-verification.md#accepted-audio-corrections) passed the full retail verification and all 64 replay cases at `b4278919`. The Editor received them for playback and export.

The [Liedel pair](../../../build/integration/liedel-text/liedel-text-acceptance-evidence.json) passed at `e82db7aa`, the [graduation trio](../../../build/integration/grad-close/graduation-dialogue-acceptance-evidence.json) at `88369c7c`, and the [Magnus and Paul pair](../../../build/integration/paul-audio/paul-audio-acceptance-evidence.json) at `b4beb6d4`. The Editor received all three for playback checks.

The [story event program](../story-event-continuation.md) closed at `9be88806`. The Editor received the driver, interpreter, controlled-call scope and [full-ROM evidence for all six owners](../../../build/integration/story-event/story-event-program-acceptance-evidence.json). Retain the released workers’ candidates, inputs and delivery records.

The [cutscene preview program](../cutscene-preview-services-draft.md) closed on main at `2447f1d5`. The [actor placement and mission-briefing program](../actor-placement-briefing-program.md) previously closed at `3ac73120`.

The [Editor handoff](../cutscene-preview-services-draft.md#editor-handoff-after-program-acceptance) reached the Editor director on November 18. The accepted cutscene program retains its four retired delivery records under `~/.local/share/codex-thread-monitors/cutscene-preview-261117-*`.

## Accepted cutscene baseline

The [final cutscene roster](../../../build/integration/cutscene-preview/program-acceptance-evidence.json) records every owner, the retained ASM suffixes and the linked switch tables. See the [integration closeout](cutscene-preview-integration.md) and the [chapter-reveal replay](../../../build/integration/cutscene-preview/t2-accepted-traces.json).

## Released assignments

The A01/A03/A04, A02/A05/P01 and M01 assignments are complete. Retain the candidates, selected inputs, proof and delivery records in their original locations (`actor-briefing-261117-*` for monitoring). The B02 research-reference repair is recorded at `bb1a4e6e`.

## Closed work

[Body construction and equipment visuals](../body-equipment-program.md) closed with B02 scene placement (`8eaabdfc`) and B01 body construction (`ea3dfaae`). Both complete owners passed pure-C and full-ROM verification. The [integration closeout](body-equipment-integration.md) preserves the accepted controls, original assembly references and earlier wave fingerprint. The [consumable effects program](consumable-integration.md) closed on November 3 (`0b972a78`).

Attack visual effects closed on October 31 (closure commit `38efb10a`). The [descriptor program](../descriptor-serialization-program.md) closed on October 26 with an exact hybrid encoder. Its pure-C objective and sixteen-byte tail remain open research questions. The [standard-library program](../standard-library-program-draft/PROGRAM.md) finished October 17.
