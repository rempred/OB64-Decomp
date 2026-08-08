---
task_id: ob64-retail-dialect-phase3-review
revision: 1
status: completed
role: reviewer
review_level: Critical
inventory_profile: NORMAL
human_gate: none
launch_id: dcb3e07d72864456b0a7b28df333cb74
workspace_claim: C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp\docs\Plans\task-logs\ob64-retail-dialect-phase3-review-r1-dcb3e07d72864456b0a7b28df333cb74.claim.json
depends_on:
  - 48f93cb1031b139fda2848882deac2db7c4d338c
baseline_repositories:
  parent: 1ac946fae7fee8e601902da8c3234b8e3b8eef62
  decomp: 48f93cb1031b139fda2848882deac2db7c4d338c
supersedes: null
current_agents_overrides_prompt: true
---

# Phase 3 independent critical review: p3063 pure-C migration

## Mission

Independently review frozen worker-result commit `48f93cb1031b139fda2848882deac2db7c4d338c`.

Decide whether Phase 3 safely removes only p3063's local `move` macro and establishes exact `PURE_C` output without regressing any accepted hybrid owner.

## Authority and boundary

Work only in `C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp`.

Read the decomp `AGENTS.md`, parent `AGENTS.md`, parent `docs/Reviewer-workflow.md`, this assignment, the accepted Phase 2 worker and review records, the Phase 3 worker prompt, the frozen commit, the Phase 3 AAR, and its evidence index.

Create the claim atomically before any review write.

Use host ID `codex-desktop-current`, receiving task ID `/root/phase3_review`, Director task ID `ob64-retail-dialect-implementation-director`, and Director collaboration ID `/root`.

Do not modify reviewed code, tests, configuration, source, assembly, metadata, placement, queue state, worker records, or generated accepted evidence.

You may write only your claim, task log, and review report.

Keep review experiments in a fresh external temporary root.

Do not commit, push, resume the function queue, or control the pre-existing external p3063 permuters.

Preserve the original dirty workspace. You are the sole current repository writer.

## Dirty-baseline note

The frozen result commit deliberately excludes the user's recorded dirty baseline.

The live working tree retains the coherent 36-target overlay, including the user-owned target addition and accepted p3063 placement work.

Review both the frozen attributable diff and the recorded effective-state relationship. Do not absorb or alter any dirty-baseline hunk.

## Required independent questions

1. Does the frozen Phase 3 source diff remove only p3063's four-line local macro statement?
2. Does source policy independently classify `func_0019554C` as `PURE_C` with no assembler mechanism or reason?
3. Does authenticated KMC output contain exactly fourteen supported numeric-register `move` statements?
4. Does adapted output differ from raw output only at those fourteen statements?
5. Do all six explicit `or` statements and all other assembly lines remain unchanged?
6. Does p3063 link to the exact 644-byte retail target SHA-256 `5985A5DFC866D4EFFB58C0E412AA76A8E0AE8DA0EF19BB8E44A6BF278C2A5E2B`?
7. Does p3063 retain section `.ob64.r3063`, RAM VMA `0x802150BC`, z64 ROM range `0x0019554C..0x001957D0`, and sole owner `objects/c/func_0019554C.o`?
8. Does the C object retain 31 `.rel.text` relocations and one `.rel.pdr` relocation with the recorded symbols?
9. Does `func_0002CD70` remain exact `HYBRID_C`, with zero transformations and `0x00801025` at relative offsets `+0x004` and `+0x028`?
10. Do all 32 hybrid targets retain byte-identical raw and dialect assembly with zero transformations?
11. Do the two clean roots reproduce all 36 proofs, objects, target slices, relocation sets, reports, and exact full-ROM bytes?
12. Does the connected heavyweight audit report belong to current fingerprint `F344A83DD10D3002966172C7F179EA1D8A88B8ED2A5A331003DFDDF44A75005F` and the same coherent build?
13. Did compiler identity, assembler identity, flags, adapter identity, placement, ownership, relocation model, metadata, structural inputs, and queue state remain unchanged?
14. Did the worker preserve all user-owned dirty paths and the pre-existing p3062 candidate?

## Verification

Do not treat the worker summary, AAR, evidence prose, or agent messages as proof.

Inspect the frozen diff, source, generated artifacts, raw bytes, maps, relocations, reports, and hashes directly.

Recompute material identities, transformation counts, hybrid passthrough counts, and the two protected OR words.

Run the smallest independent tests needed to falsify the claims.

You may authenticate and reuse the two clean roots only after proving that their reports and artifacts form one coherent build.

You may rerun strict verification on a reviewer-owned copy. Do not repeat the multi-hour heavyweight audit without a concrete identity or correctness conflict.

Record setup failures separately from admissible correctness findings.

Return one verdict: `accepted`, `accepted-with-notes`, `correction-required`, or `blocked`.

## Deliverables

- Claim: `docs/Plans/task-logs/ob64-retail-dialect-phase3-review-r1-dcb3e07d72864456b0a7b28df333cb74.claim.json`.
- Task log: `docs/Plans/task-logs/ob64-retail-dialect-phase3-review-r1-dcb3e07d72864456b0a7b28df333cb74.md`.
- Review report: `docs/audit/2026-08-08-retail-dialect-phase3-independent-review.md`.

Return the verdict to `/root`. The Director will freeze the review and decide whether the implementation is accepted.

The function queue remains paused throughout review.
