# Director handoff — November 22, 2026

**Current assignment.** [Retire the 70 inherited caller exceptions](../c-interface-cleanup.md#inherited-caller-exceptions) in one wave. Audio worker `01a204f3-c5af-71a2-ba24-f737e5f23d9d`, battle and unit worker `01a204f4-28c5-7031-81b5-c89a7c5848fb`, and panels and runtime worker `01a204f3-ee35-79e1-a4b1-2f3fb5c3e245` own the private sources. Integrator `01a204f3-b7b3-7ca1-af27-b0e9683009a9` owns native preparation and all production changes. The existing [684-finding cleanup](https://github.com/rempred/OB64-Decomp/commit/6da7ec50b141088740650e69b1e7a428f77c080c) is accepted. Independent tooling reviewer `01a204f6-9e0b-7dc3-81e6-29feddecb07e` reviews the projected empty list before the single combined audit. Workers may query saved traces concurrently. The Director approves and schedules any live captures one at a time. [Queue](../../NEXT_STEPS.md)

The [two audio corrections](../c-interface-verification.md#accepted-audio-corrections) passed the full retail verification and all 64 replay cases at `b4278919`. The Editor received them for playback and export.

The [Liedel pair](../../../build/integration/liedel-text/liedel-text-acceptance-evidence.json) passed at `e82db7aa`, the [graduation trio](../../../build/integration/grad-close/graduation-dialogue-acceptance-evidence.json) at `88369c7c`, and the [Magnus and Paul pair](../../../build/integration/paul-audio/paul-audio-acceptance-evidence.json) at `b4beb6d4`. The Editor received all three for playback checks.

The [story event program](../story-event-continuation.md) closed at `9be88806`. The Editor received the driver, interpreter, controlled-call scope and [full-ROM evidence for all six owners](../../../build/integration/story-event/story-event-program-acceptance-evidence.json). Retain the released workers’ candidates, inputs and delivery records.

The [cutscene preview program](../cutscene-preview-services-draft.md) closed on main at `2447f1d5`. The [actor placement and mission-briefing program](../actor-placement-briefing-program.md) previously closed at `3ac73120`.

The [Editor handoff](../cutscene-preview-services-draft.md#editor-handoff-after-program-acceptance) reached the Editor director on November 18. The accepted cutscene program retains its four retired delivery records under `~/.local/share/codex-thread-monitors/cutscene-preview-261117-*`.

## Accepted cutscene baseline

The [final acceptance roster](../../../build/integration/cutscene-preview/program-acceptance-evidence.json) binds all assigned owners and sources to CURRENT `8412D50E1A2CDD150C75409B585A92DBF5748C5F5FE16C9530EDCEFB15B7ECF3`. The rebuilt ROM SHA-256 is `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`. The two retained four-byte ASM suffixes and three linked C switch tables are itemized in the roster. The [integration closeout](cutscene-preview-integration.md) links each wave and the [T2 replay](../../../build/integration/cutscene-preview/t2-accepted-traces.json) covers chapter reveal completion with controlled assets and randomness.

## Released assignments

The A01/A03/A04, A02/A05/P01 and M01 assignments are complete. Retain the candidates, selected inputs, proof and delivery records in their original locations (`actor-briefing-261117-*` for monitoring). The B02 research-reference repair is recorded at `bb1a4e6e`.

## Closed work

[Body construction and equipment visuals](../body-equipment-program.md) closed with B02 scene placement (`8eaabdfc`) and B01 body construction (`ea3dfaae`). Both complete owners passed pure-C and full-ROM verification. The [integration closeout](body-equipment-integration.md) preserves the accepted controls, original assembly references and earlier wave fingerprint. The [consumable effects program](consumable-integration.md) closed on November 3 (`0b972a78`).

Attack visual effects closed on October 31 (closure commit `38efb10a`). The [descriptor program](../descriptor-serialization-program.md) closed on October 26 with an exact hybrid encoder. Its pure-C objective and sixteen-byte tail remain open research questions. The [standard-library program](../standard-library-program-draft/PROGRAM.md) finished October 17.
