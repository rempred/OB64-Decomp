# Director handoff — November 17, 2026

**No matching wave or production writer is active.** The last assigned program closed on November 9. Its workers, reviewers, integration role and notification routes are released. The next decision for Joe is which editor problem to assign.

## Accepted baseline

The [November 10 structural audit](../../audit/2026-11-10-splat-and-repository-cleanup.md) records the accepted US Rev 0 build (CURRENT), fingerprint `081B815B15E33390CB26067C16891AAA20C32FB00415F9D963841A5E37018A8C`. Its normalized z64 ROM SHA-256 is `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`. The audited Splat configuration is committed at `29e0915c`. The November 17 matching tools and Git checkout corrections are recorded at `b6d715cb` and `02406d96`.

On a provisioned checkout, run `.\tools\status.ps1 --snapshot` to authenticate the retained reports and ROM. Use `.\tools\status.ps1` when a decision depends on whether today's sources still match that proof. A fresh Git checkout contains the audit record. Reproducing verification locally requires the private ROM, pinned tools and [setup instructions](../../../README.md#start-here).

## Closed work

[Body construction and equipment visuals](../body-equipment-program.md) closed with B02 scene placement (`8eaabdfc`) and B01 body construction (`ea3dfaae`). Both complete owners passed pure-C and full-ROM verification. The [integration closeout](body-equipment-integration.md) preserves the accepted controls, original assembly references and earlier wave fingerprint. The [consumable effects program](consumable-integration.md) closed on November 3 (`0b972a78`).

Attack visual effects closed on October 31 (closure commit `38efb10a`). The [descriptor program](../descriptor-serialization-program.md) closed on October 26 with an exact hybrid encoder. Its pure-C objective and sixteen-byte tail remain open research questions. The [standard-library program](../standard-library-program-draft/PROGRAM.md) finished October 17.

## Next decision

Read the [matching study](../../research/how-matching-works-20261117.md) before scoping or staffing a wave. The study and worked examples are tracked. Replaying the private runs requires their saved reports. The [queue](../../NEXT_STEPS.md) identifies two candidates for a proposal: `func_002A9364` for actor initialization and placement, and `func_002B867C` for mission-briefing construction. Choose the relevant game path, identify the editor behavior the source could unlock, and bound the related owners and callers. The broader cutscene program remains a draft.

Once Joe assigns a program, use the [workflow](../../WORKFLOW.md#the-short-path) to give workers complete waves and the integrator sole production ownership. Establish fresh native message and stop routes to the incoming Director for the assigned roles. Retired session IDs and old monitors are historical records.
