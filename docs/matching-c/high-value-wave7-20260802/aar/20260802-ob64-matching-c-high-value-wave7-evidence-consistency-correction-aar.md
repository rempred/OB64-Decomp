# After-action report: Wave 7 evidence-consistency correction

Status: historical consistency correction retained; candidate `func_00005FC0` is rejected and withdrawn from active matching C. The task log and worker AAR still preserve the corrected historical identities. This matters because the evidence package remains auditable after withdrawal. The Director must preserve the original assembly fallback and keep proportional Critical review pending; no action is required from Joe.

## Scope and authority

This correction addressed two statements in the completed Wave 7 worker package. The authorized surfaces were the worker task log, the worker AAR, and this correction AAR.

The source, matching-C configuration, evidence index, derivation record, target-selection record, and reproduction procedure remained read-only during this consistency correction. The withdrawal later removed the rejected source and configuration entry. The parent research repository, integration repository, ROM, emulator, RAM, savestates, and controller input remained untouched.

No technical build or verifier rerun was authorized. This correction worker did not create a branch, commit, stage, push, publish, delegate work, or issue an acceptance verdict.

## Corrections made

| Evidence surface | Previous statement | Corrected statement |
|---|---|---|
| `docs/matching-c/high-value-wave7-20260802/task-log.md` | The reproducibility comparison listed build-report SHA-256 `0BEA7BD4DB191849EA0481A3836E326809E9C2095624AE43D27F2A04E27C39C2`. | The reproducibility report is named with SHA-256 `B1E0E72EAD3E43571167407F74FD71F0741CA8002B35D8FAF8DCEDBD96DE7F26`. |
| `docs/matching-c/high-value-wave7-20260802/aar/20260802-ob64-matching-c-high-value-wave7-aar.md` | The changed-surfaces paragraph undercounted the Markdown evidence records. | The paragraph counts six pre-correction Markdown evidence records. |

The build-report SHA-256 `0BEA7BD4DB191849EA0481A3836E326809E9C2095624AE43D27F2A04E27C39C2` remains correct for both final build reports. The correction removes only its incorrect use as the reproducibility-report identity.

The six pre-correction records were `evidence-index.md`, `independent-derivation.md`, `reproduction-procedure.md`, `target-selection.md`, `task-log.md`, and the worker AAR. This correction AAR is the seventh Markdown record after correction.

## Preservation checks

The withdrawn matching-C source had SHA-256 `BFEB371935DCA921472E44FA2AF6FF002459008DF47DA415B39CA2B1B785B999`. The pre-withdrawal matching-C configuration had SHA-256 `855E14C889788DBB708F0D02CEAEF225E3EE7642A2A77FF3819C886588ADA444`. The current seven-owner configuration has SHA-256 `3FA55971AF36908D2CA0A44460F36BB9156DEF8DF71FA0630583B5AC2C01D07C`.

The worker AAR had SHA-256 `B9717BF6F0FD183F01EF5838098BACDC44AA05919F2012523BEF72B1EE8BBE31` before this correction. Its post-correction SHA-256 is `15FAF16F9BCB748AD60D330FB4B54D4A23A5E27E7D0DA575CF6C127D6E37A5EC`.

The disclosed exact-layout anchor limitation remains unchanged in the historical record. The target boundary, placement, relocation contract, full-ROM identity, and build identities remain historical evidence. The candidate is no longer active.

## Verification

The scoped diff check passed for the three authorized correction surfaces:

```powershell
git diff --check -- docs/matching-c/high-value-wave7-20260802/task-log.md docs/matching-c/high-value-wave7-20260802/aar/20260802-ob64-matching-c-high-value-wave7-aar.md docs/matching-c/high-value-wave7-20260802/aar/20260802-ob64-matching-c-high-value-wave7-evidence-consistency-correction-aar.md
```

The stale reproducibility assignment and stale five-record count are absent. The corrected task log contains the authenticated reproducibility-report SHA-256 `B1E0E72EAD3E43571167407F74FD71F0741CA8002B35D8FAF8DCEDBD96DE7F26`. The corrected worker AAR contains the phrase `six pre-correction Markdown evidence records`.

No technical build was rerun because the assignment limited this work to evidence consistency. The existing authenticated build, verification, and reproducibility reports remain the supporting artifacts.

## Baseline and protocol notes

The canonical decomp repository remained on `main` at `e153585d7d1cb860d82ea8a905e4831a7b197a7c`. The integration repository remained on `main` at `b22815518f060425519c08df19b617af8b5099a7`.

The parent research repository was on `main` at `2c431bb42f31b71d73c1efd97c559424ce46ae02`, whose subject is `director: prepare matching-C wave 7 evidence correction`. The parent repository was read-only for this correction, and no parent files were changed.

The parent HEAD differs from the earlier Wave 7 worker baseline because the Director prepared this correction assignment. The difference does not affect the three authorized evidence surfaces.

## Withdrawal status

The candidate is rejected under `W7-MC-01` and withdrawn from active matching C. The original assembly remains the exact fallback. The accepted-backend research question remains unresolved.

## Evidence grade and review state

Correction evidence grade: `Supported`. The corrected statements match the authenticated artifact identities and the observed Markdown-record inventory.

Review state: `historical; rejected; withdrawn`. Proportional Critical review of the withdrawal remains `pending`. This correction worker does not issue an acceptance verdict.

## Director handoff

The Director must preserve this historical consistency correction with the withdrawal AAR. The Director must preserve the corrected reproducibility-report identity, the six pre-correction record count, the rejected candidate status, and the pending withdrawal review state.
