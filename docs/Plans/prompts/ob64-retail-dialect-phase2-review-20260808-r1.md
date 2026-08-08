---
task_id: ob64-retail-dialect-phase2-review
revision: 1
status: completed
role: reviewer
review_level: Critical
inventory_profile: NORMAL
human_gate: none
launch_id: 431bfb71cd6d47578c6f9e1dcdaf5a22
workspace_claim: C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp\docs\Plans\task-logs\ob64-retail-dialect-phase2-review-r1-431bfb71cd6d47578c6f9e1dcdaf5a22.claim.json
depends_on:
  - 4fc51f3590004fba670b2e3b679d4602bcee2313
baseline_repositories:
  parent: 1ac946fae7fee8e601902da8c3234b8e3b8eef62
  decomp: 4fc51f3590004fba670b2e3b679d4602bcee2313
supersedes: null
current_agents_overrides_prompt: true
---

# Phase 2 independent critical review: inert dialect adapter

## Mission

Independently review frozen worker-result commit `4fc51f3590004fba670b2e3b679d4602bcee2313`.

Decide whether Phase 2 safely establishes an authenticated inert adapter boundary before p3063 migration.

## Authority and boundary

Work only in `C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp`.

Read `AGENTS.md`, parent `docs/Reviewer-workflow.md`, this assignment, both Phase 2 worker prompts, the frozen commit, worker AAR, and evidence index.

Create the claim before any review write.

Use host ID `codex-desktop-current`, receiving task ID `/root/phase2_review`, Director task ID `ob64-retail-dialect-implementation-director`, and Director collaboration ID `/root`.

Do not modify reviewed code, tests, configuration, source, assembly, metadata, placement, queue state, worker records, or generated accepted evidence.

You may write only your claim, task log, and review report.

Keep review experiments in a fresh external temporary root.

Do not commit, push, start Phase 3, or control the pre-existing external p3063 permuters.

Preserve the original dirty workspace. You are the sole current repository writer.

## Dirty-baseline note

The result commit deliberately excludes three user-owned pre-Phase-2 hunks.

The working tree still contains those hunks in `config/README.md`, `config/matching-c-targets.json`, and `tools/lib/current_workflow.js`.

The current target addition makes the live workspace contain 36 targets. Do not absorb or alter it.

Review both the frozen attributable diff and the recorded dirty-baseline relationship.

## Required independent questions

1. Is the transformer target-blind and limited to complete numeric-GPR `move` statements?
2. Can any symbol, address, offset, expected byte, expected hash, expected count, or expected word influence transformation?
3. Does `UNKNOWN` reject before adaptation?
4. Does `HYBRID_C` bypass parsing as opaque bytes with equal hashes and zero transformations?
5. Does any APP marker reject in `PURE_C` while authenticated terminal-APP hybrid output remains accepted?
6. Are raw, dialect, section-adjusted, object, and deterministic proof artifacts separately preserved and hashed?
7. Does strict verification independently recreate derived assembly and proofs and reject stale schemas or missing evidence?
8. Do current pure targets perform zero transformations?
9. Do all current hybrid targets remain byte-identical?
10. Does `func_0002CD70` remain exact with `0x00801025` at `+0x004` and `+0x028`?
11. Do two clean roots actually contain identical proofs, objects, targets, reports, and ROMs?
12. Does the heavyweight audit report belong to this exact effective toolchain and current build?
13. Did Phase 2 alter source, assembly, target entries, compiler identity, assembler identity, flags, placement, relocations, target bytes, full ROM, or queue state?
14. Are the adapter manifest, module hash, config pin, and workflow fingerprint internally coherent?

## Verification

Do not treat the worker summary as evidence.

Inspect code and exact artifacts directly. Recompute material hashes and aggregate counts.

Run the smallest independent tests needed to falsify the claims. Include focused adapter and manifest tests plus a real `func_0002CD70` check.

You may reuse the two identified clean roots only after independently authenticating their reports and artifacts.

Record any compatibility note from schema changes separately from a correctness finding.

Return one verdict: `accepted`, `accepted-with-notes`, `correction-required`, or `blocked`.

## Deliverables

- Claim: `docs/Plans/task-logs/ob64-retail-dialect-phase2-review-r1-431bfb71cd6d47578c6f9e1dcdaf5a22.claim.json`.
- Task log: `docs/Plans/task-logs/ob64-retail-dialect-phase2-review-r1-431bfb71cd6d47578c6f9e1dcdaf5a22.md`.
- Review report: `docs/audit/2026-08-08-retail-dialect-phase2-independent-review.md`.

Return the verdict to `/root`. The Director will freeze the review and decide whether Phase 3 may start.
