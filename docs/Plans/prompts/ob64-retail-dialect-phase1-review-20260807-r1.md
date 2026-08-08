---
task_id: ob64-retail-dialect-phase1-review
revision: 1
status: completed
role: reviewer
review_level: Critical
inventory_profile: NORMAL
human_gate: none
launch_id: f17e033365004c818b1c94eeb5df4220
workspace_claim: C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp\docs\Plans\task-logs\ob64-retail-dialect-phase1-review-r1-f17e033365004c818b1c94eeb5df4220.claim.json
depends_on:
  - eace7a5b63febfff0f3a53934e730cdedc4f33b6
baseline_repositories:
  parent: 1ac946fae7fee8e601902da8c3234b8e3b8eef62
  decomp: eace7a5b63febfff0f3a53934e730cdedc4f33b6
supersedes: null
current_agents_overrides_prompt: true
---

# Phase 1 independent review: raw-byte exactness

## Mission

Independently review frozen commit `eace7a5b63febfff0f3a53934e730cdedc4f33b6`.

Decide whether Phase 1 safely makes raw final linked-byte equality mandatory for `EXACT`.

## Review authority and boundary

Work only in `C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp`.

Read `AGENTS.md`, `docs/Reviewer-workflow.md`, this assignment, the frozen commit, and the worker AAR.

Create the claim before any review write.

Do not modify reviewed code, tests, source, configuration, metadata, placement, queue state, or worker records.

You may write only your claim, task log, and independent review report.

Keep experimental outputs under a fresh external temporary directory.

Do not commit, push, publish, or start Phase 2.

Preserve all pre-existing dirty work. You are the only current repository writer.

The external p3063 permuters predate this program and use isolated external roots. Do not control or alter them.

## Required review questions

1. Does `EXACT` now require both a valid zero asm-differ score and raw final linked-byte equality?
2. Does comparison use the final linked section with accepted VMA, ROM load address, size, and retail identity?
3. Do malformed, missing, duplicate, displaced, and reference-drifted inputs fail closed?
4. Can the preserved pure p3063 candidate still be mislabeled exact?
5. Does accepted `func_0002CD70` remain byte-exact with its two retail OR encodings?
6. Did the phase change any target bytes, classifications, ownership, placement, relocations, tool identity, metadata, or queue state?
7. Are the tests independent enough to catch an alias-equivalent raw mismatch and a relocated-object mistake?

## Verification

Choose and run the smallest independent tests needed to support the verdict.

Inspect the frozen commit and relevant canonical bytes directly. Do not rely only on the worker summary.

Record exact commands, artifact identities, findings, residual risks, and a verdict of `accepted`, `accepted-with-notes`, `correction-required`, or `blocked`.

## Deliverables

- Claim: `docs/Plans/task-logs/ob64-retail-dialect-phase1-review-r1-f17e033365004c818b1c94eeb5df4220.claim.json`.
- Task log: `docs/Plans/task-logs/ob64-retail-dialect-phase1-review-r1-f17e033365004c818b1c94eeb5df4220.md`.
- Review report: `docs/audit/2026-08-07-retail-dialect-phase1-independent-review.md`.

Return the verdict to `/root`. The Director will freeze the review record and decide whether Phase 2 may start.
