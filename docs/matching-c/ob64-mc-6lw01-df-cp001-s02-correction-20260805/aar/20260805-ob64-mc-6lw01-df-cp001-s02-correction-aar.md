# OB64-MC-6LW01-DF-CP001-S02 Canonical Correction AAR

## Outcome

Status: completed. The correction removes only `func_000238b0` from the prohibited promotion. This restores the frozen policy boundary while preserving 28 exact targets. No action is required from Joe.

The Parent Director must freeze the uncommitted result and route independent review. This worker does not issue an acceptance verdict.

## Scope

Task `OB64-MC-6LW01-PROMO-DF-CP001-S02-CORRECTION-20260805-R1` used the `integration-correction` surface. The task started at canonical commit `3f67125b22eda07ea56f72e0961790d19e3f1689` on `main`.

The correction did not revisit any function classification. It applied the frozen checkpoint policy exactly.

## Result

- Removed the `func_000238B0` object from `config/phase8/matching-c.json`.
- Removed promoted source `src/lib/sprintf.c`.
- Preserved original assembly owner `asm/original/rev0/lib/sprintf.s`.
- Preserved all 23 accepted baseline target objects unchanged.
- Preserved all five permitted checkpoint target objects unchanged.
- Preserved every compiler field unchanged.
- Produced exactly 28 configured targets.
- Produced fresh configuration SHA-256 `E0D9023BFCA2CD9BE55DEAC6457561D168F1BCA9DE02702F607A4C2C1B6F70D6`.

## Claims

### Claim 1

Claim: only the excluded function left the prohibited promotion.

Evidence grade: `Verified`.

Review status: `pending`.

Scope and context: static canonical configuration and source tree at uncommitted HEAD `3f67125b22eda07ea56f72e0961790d19e3f1689`.

Supporting artifacts: corrected configuration, Git diff, and Phase 8 build report.

Independent corroboration: configuration comparison retained every nonexcluded target object exactly.

Competing interpretation: another target or compiler field changed during removal.

Falsifier: any unequal retained target object, compiler field, or unexpected tracked diff.

Known limits: independent review has not accepted this worker result.

Product consequence: the Parent can freeze a direct child of the prohibited promotion.

### Claim 2

Claim: all five permitted checkpoint functions remain exact across 776 bytes.

Evidence grade: `Verified`.

Review status: `pending`.

Scope and context: fresh external Phase 8 build and verifier on the accepted Windows host.

Supporting artifacts: Phase 8 build report and verification report.

Independent corroboration: asm-differ reports `exact=True` and zero score for every retained function.

Competing interpretation: stale output or an unchanged configuration could conceal a failed rebuild.

Falsifier: a reused output directory, nonzero asm-differ score, target hash drift, or ROM hash drift.

Known limits: exact static bytes do not prove gameplay meaning.

Product consequence: the five permitted functions remain eligible for independent promotion review.

### Claim 3

Claim: the 28-target correction preserves the canonical code region and retail ROM.

Evidence grade: `Verified`.

Review status: `pending`.

Scope and context: fresh Phase 7 and Phase 8 outputs under the assigned isolated root.

Supporting artifacts: setup, conventional, matching-C, and verifier reports.

Independent corroboration: both ROMs have SHA-256 `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

Competing interpretation: a target-local match could coexist with unrelated ROM drift.

Falsifier: code-region or full-ROM SHA-256 drift.

Known limits: the proof covers the accepted host and authenticated prerequisites.

Product consequence: the correction is suitable for Parent freeze and independent review.

## Changed surfaces

Tracked technical changes:

- `config/phase8/matching-c.json`: removed one 49-line target object.
- `src/lib/sprintf.c`: removed the excluded 24-line promoted source.

Assigned records:

- `docs/matching-c/ob64-mc-6lw01-df-cp001-s02-correction-20260805/task-log.md`.
- `docs/matching-c/ob64-mc-6lw01-df-cp001-s02-correction-20260805/evidence-index.md`.
- `docs/matching-c/ob64-mc-6lw01-df-cp001-s02-correction-20260805/aar/20260805-ob64-mc-6lw01-df-cp001-s02-correction-aar.md`.
- `docs/matching-c/ob64-mc-6lw01-df-cp001-s02-correction-20260805/handoff-manifest.json`.

Fresh generated outputs remain outside the repository. Their assigned root is `C:\Users\Joe\Projects\OgreBattlel64-External-Outputs\OB64-MC-6LW01-20260803\DF-CP001-S02\correction-r1`.

## Verification summary

- The canonical 21-check setup gate passed.
- Fresh authenticated Splat execution passed.
- Fresh conventional build and verification passed.
- Fresh 28-target matching-C build and verification passed.
- All five retained functions produced exact linked text.
- Both fresh ROMs match the canonical retail SHA-256.
- `func_000238B0` is absent from configuration and canonical C source.
- Its original assembly fallback remains unchanged.
- `git diff --check` passed.
- The handoff validator passed with zero errors.

## Failed paths and limits

An initial broad `diff.py` hash search timed out after 30 seconds without output. A bounded Git metadata scan found the authenticated asm-differ checkout.

An initial context extraction matched two identical `symbol` fields. PowerShell rejected the resulting array arithmetic before any file mutation.

The corrected extraction anchored the target object's first symbol line. No technical result changed because of either discovery failure.

This task proves no gameplay semantics. It makes no new decomp judgment and changes no canonical domain document.

## Protocol deviations

None.

## Evidence index

`C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp\docs\matching-c\ob64-mc-6lw01-df-cp001-s02-correction-20260805\evidence-index.md` records inputs, prerequisites, commands, hashes, and per-function proofs.

## Proposed canonical-document changes

After accepted independent review, the Director must update local current-state documents to record 28 active matching-C owners. The update must exclude `func_000238b0` and cite the accepted correction commit.

Candidate documents are `AGENTS.md`, `docs/PLATFORM.md`, `docs/DECOMP_LOG.md`, and `docs/NEXT_STEPS.md`. This worker did not edit them before review.

## Next action

The Parent Director must freeze this uncommitted correction as a direct child of the prohibited promotion. The Parent must then route independent review.
