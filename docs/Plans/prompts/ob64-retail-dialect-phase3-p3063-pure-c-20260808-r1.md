---
task_id: ob64-retail-dialect-phase3-p3063-pure-c
revision: 1
status: completed
role: worker
review_level: Critical
inventory_profile: NORMAL
human_gate: none
launch_id: bdd8a3caac774cf5af0e78182a5680a3
workspace_claim: C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp\docs\Plans\task-logs\ob64-retail-dialect-phase3-r1-bdd8a3caac774cf5af0e78182a5680a3.claim.json
depends_on:
  - 4fc51f3590004fba670b2e3b679d4602bcee2313
  - 8b35468b82f2e0b0afd7aa9729926b064b9ba328
baseline_repositories:
  parent: 1ac946fae7fee8e601902da8c3234b8e3b8eef62
  decomp: 8b35468b82f2e0b0afd7aa9729926b064b9ba328
supersedes: null
current_agents_overrides_prompt: true
---

# Phase 3 worker assignment: migrate p3063 to exact PURE_C

## Mission

Remove only p3063's translation-unit-local `move` macro.

Prove `func_0019554C` becomes exact `PURE_C` through the accepted dialect adapter.

Do not change its C expressions, structure, placement, metadata, relocations, or ownership.

## Governing design and baseline

Read `AGENTS.md`, parent `docs/Worker-workflow.md`, this assignment, and sections 8 through 11 of:

`C:\Users\Joe\AppData\Local\Temp\ob64-retail-dialect-221529b0a843423c851d6fa32e751460\retail-assembler-dialect-investigation-20260807.md`

Read the accepted Phase 2 worker and independent-review records.

Start from the coherent live 36-target baseline overlay preserved by Phase 2 review.

The clean p3063 source SHA-256 before this phase is:

`284DC9EC2BF1ACBC31DE8E81F33B85393B89CEBE15309B162A39540C5302DA5D`

## Mission envelope

Work only in `C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp`.

Create the claim and task log before technical writes.

You are the sole repository writer. Preserve every pre-existing dirty file and hunk.

The only authorized source edit is removal of the local `.macro move` block from:

`src/lib/func_0019554C.c`

Do not edit any other file under `src/` or `asm/`.

Do not edit adapter code, manifest, compiler or assembler configuration, active target configuration, Phase 8 compatibility metadata, source-policy rules, placement, relocation expectations, target hashes, ownership, documentation queue state, or `docs/NEXT_STEPS.md`.

If infrastructure fails, stop and report. Do not repair it inside this migration assignment.

You may add only the required claim, task log, evidence index, and AAR besides the p3063 source edit.

Keep clean-build and experimental outputs in fresh external temporary roots.

Do not commit, push, publish, resume the function queue, migrate `func_00195410`, or migrate `func_0024DA10`.

Do not control the pre-existing external p3063 permuters.

## Required p3063 gates

- The source diff removes only the local move macro.
- Source policy reports `PURE_C` with zero assembler mechanisms.
- Raw KMC compiler assembly contains exactly 14 supported numeric-GPR `move` statements.
- The adapter reports exactly 14 transformations for p3063.
- The build reports exactly one transformed target and 14 total transformations.
- All explicit `or` statements remain byte-for-byte unchanged through adaptation.
- The p3063 target section is `.ob64.r3063`.
- Runtime VMA remains `0x802150BC`.
- z64 ROM range remains `0x0019554C..0x001957D0`.
- Size remains 644 bytes.
- Sole owner remains `objects/c/func_0019554C.o`.
- Target SHA-256 is `5985A5DFC866D4EFFB58C0E412AA76A8E0AE8DA0EF19BB8E44A6BF278C2A5E2B`.
- The complete ROM SHA-256 is `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
- The exact accepted relocations remain, including 31 `.rel.text` and one `.rel.pdr` record.
- Placement assertions, fallback pruning, symbols, and object ownership remain exact.
- The assembly fallback is not linked for p3063.

## Mandatory full-corpus regressions

- Every other source remains byte-identical.
- Every other object and linked target remains exact.
- Every `HYBRID_C` raw and dialect assembly remains byte-identical with zero transformations.
- `func_0002CD70` remains `HYBRID_C` and byte-exact.
- Its words at function-relative offsets `+0x004` and `+0x028` remain `0x00801025`.
- The final source census is four `PURE_C`, 32 `HYBRID_C`, and zero `UNKNOWN`.
- Two clean external builds reproduce reports, proofs, objects, targets, counts, relocations, and ROM identity.
- The normal full verifier passes.
- The heavyweight audit passes and records one transformed target with 14 transformations.

## Required commands and evidence

Run the canonical source-policy, diff, target verification, full verification, two-clean-build reproducibility, and heavyweight-audit paths.

Use raw-byte exactness, not asm-differ score alone.

Independently compare compiler and dialect assembly to prove exactly 14 syntax changes and unchanged explicit OR statements.

Record exact commands, run roots, hashes, counts, placement, owner, symbols, relocations, reports, failures, and residual risks.

## Required records

- Claim: `docs/Plans/task-logs/ob64-retail-dialect-phase3-r1-bdd8a3caac774cf5af0e78182a5680a3.claim.json`.
- Task log: `docs/Plans/task-logs/ob64-retail-dialect-phase3-r1-bdd8a3caac774cf5af0e78182a5680a3.md`.
- Evidence index: `docs/audit/2026-08-08-retail-dialect-phase3-p3063-pure-c-evidence.md`.
- AAR: `docs/audit/2026-08-08-retail-dialect-phase3-p3063-pure-c-aar.md`.

## Stops

Stop if the source diff contains any non-macro change.

Stop if the transformation count differs from 14, any explicit OR changes, any hybrid output changes, or `func_0002CD70` regresses.

Stop on compiler, assembler, manifest, source-policy, placement, owner, relocation, symbol, target, full-ROM, reproducibility, or audit drift.

Do not create any offset-based exception or patch object or ROM bytes.

## Handoff

Return a completed or blocked handoff to `/root`.

The Director will inspect attribution, create the Phase 3 result commit, and route independent critical review.

The function queue remains paused until final acceptance.
