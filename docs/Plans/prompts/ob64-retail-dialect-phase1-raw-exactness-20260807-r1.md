---
task_id: ob64-retail-dialect-phase1-raw-exactness
revision: 1
status: completed
role: worker
review_level: Critical
inventory_profile: NORMAL
human_gate: none
launch_id: 1ec4be4cc4e94a72a72736794da9f572
workspace_claim: C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp\docs\Plans\task-logs\ob64-retail-dialect-phase1-r1-1ec4be4cc4e94a72a72736794da9f572.claim.json
depends_on: []
baseline_repositories:
  parent: 1ac946fae7fee8e601902da8c3234b8e3b8eef62
  decomp: 042c7c02e0f86da664c8d34d01597a4e61c4eef3
supersedes: null
current_agents_overrides_prompt: true
---

# Phase 1 worker assignment: raw-byte exactness

## Mission

Correct the function-diff exactness contract so `EXACT` requires final linked-target byte equality.

This result matters because alias-equivalent disassembly can hide raw instruction differences.

## Accepted starting point

Use the current dirty decomp workspace and preserve every pre-existing change.

Use sections 6, 9, and 10 of this accepted investigation report:

`C:\Users\Joe\AppData\Local\Temp\ob64-retail-dialect-221529b0a843423c851d6fa32e751460\retail-assembler-dialect-investigation-20260807.md`

The decomp baseline dirty-status SHA-256 is `DB4BE349DCBB457C9D43903390533BFD0A4A0BA0D75C59F183D6465999FCEBF5`.

## Mission envelope

Work only in `C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp`.

You may change the diff implementation, shared raw-comparison logic, focused tests, fixtures, and directly affected workflow documentation.

Do not change C sources, active targets, placement, relocations, compiler identity, assembler identity, source-policy rules, or queue state.

Keep generated outputs under ignored build roots or a fresh external temporary root.

Do not commit, push, publish, or resume the function queue.

You are not alone in the repository. Preserve all unrelated edits and adapt to the recorded dirty baseline.

## Required deliverables

- A fail-closed raw linked-target comparison used by function-diff reporting.
- Separate asm-differ and raw-byte result fields.
- Focused alias-equivalent, byte-different regression coverage.
- Preservation coverage for existing exact targets and strict verification.
- A task log at `C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp\docs\Plans\task-logs\ob64-retail-dialect-phase1-r1-1ec4be4cc4e94a72a72736794da9f572.md`.
- An evidence index at `C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp\docs\audit\2026-08-07-retail-dialect-phase1-raw-exactness-evidence.md`.
- An AAR at `C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp\docs\audit\2026-08-07-retail-dialect-phase1-raw-exactness-aar.md`.

## Completion conditions

- A zero asm-differ score with unequal raw bytes cannot report `EXACT`.
- Equal raw bytes and a zero score still report `EXACT`.
- Missing, duplicate, malformed, or wrong-sized sections fail closed.
- Relocated targets compare final linked bytes.
- Existing exact targets and the full retail ROM remain exact.
- Focused and ordinary affected tests pass.
- No unrelated dirty change enters the result.

## Stops

Stop for compiler, assembler, baserom, placement, or ownership drift.

Stop if another actor changes the workspace after baseline.

Stop if the correction requires weakening strict verification or changing the accepted matching contract.

## Handoff

Return a completed or blocked handoff to `/root` through your final response.

The Director will inspect attribution, freeze the result, and route independent review.
