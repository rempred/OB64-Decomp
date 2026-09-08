---
task_id: compilation-group-workbench-assessment
revision: 1
status: ready
role: worker
review_level: Material
inventory_profile: NORMAL
human_gate: none
launch_id: COMPILATION-GROUP-WORKBENCH-ASSESSMENT-20260908-01
workspace_claim: C:/Users/Joe/Projects/OgreBattlel64/OB64 Decomp/docs/Plans/task-logs/compilation-group-workbench-assessment-r1.claim.json
---

# Assess the existing compilation-group workbench failures

Director `/root` assigns existing Astra Medium `/root/db10_allocation_trace` a bounded read-only tooling assessment. W8 R6 remains active with its sole production source/build writer. This assignment cannot alter shared tools or interrupt matching.

Read parent/canonical AGENTS.md, parent Worker-workflow.md, canonical WORKFLOW.md, SOURCE_POLICY.md and AUDIT.md. Read the accepted compilation-group design and implementation/review records. Implementation `45904b5` is accepted at `31dc838`; its existing contracts remain controlling.

The accepted analysis-packet review at `4f4ce3d6434f52a20a526a1c17be6da7f6ee21ac` confirms four pre-existing routine failures. Read `docs/Plans/task-logs/analysis-packets-implementation-r1.md` and `docs/Plans/task-logs/analysis-packets-review-r1.md`. Retained output is `build/analysis-packets-implementation-r1/routine-tests.log`. Its baseline index `routine-baseline.json` has SHA256 `72B36E63E95F9AED79FA48DFC6B607DF7EB2FF7854D36082194EE09A7754135A`. The failures concern active-targets, compilation-groups, matching-context and matching-workbench. These failures were reported, not waived or repaired.

Determine the generic representation problem and propose a bounded correction consistent with the accepted compilation-group contract. Identify affected reader/consumer assumptions, expected behavior for standalone and grouped targets, required file scope and meaningful validation. Distinguish stale test assumptions from actual product behavior defects. Trace relevant current source and retained failure evidence; choose the analysis independently. Do not rerun the full routine suite merely to rediscover the recorded failures.

The proposed correction must preserve complete group membership, sole compilation ownership, actual source identity, and all existing fail-closed structural checks. Do not hide group members, mislabel shared source as standalone, loosen acceptance, special-case a function, or alter production configuration to satisfy tests. Identify what should remain unsupported explicitly when the accepted contract does not cover a behavior. This work addresses an independently observed generic defect; it cannot serve as a workaround for the three current nonmatching functions.

Return a concrete implementation recommendation with source references, evidence identities, unresolved questions and the required audit/review scope. This assessment does not authorize implementation or become an accepted dependency before its Material review. The Director will schedule any implementation separately with exclusive shared-tool ownership.

Own only the fresh claim, `C:/Users/Joe/Projects/OgreBattlel64/OB64 Decomp/docs/Plans/task-logs/compilation-group-workbench-assessment-r1.md` and ignored `build/compilation-group-workbench-assessment-r1/`. Create the claim atomically and read it back before other writes. These paths may contain the report's bounded static evidence and identity index. All production source/configuration, shared tools, tests and existing evidence remain read-only. You are not alone; preserve other edits and bind observations to exact input identities.

No implementation, shared-tool/test/config edits, compiler runs, canonical build/verifier/audit, runtime, Resolver, GUI, database, global installs, agents, staging, commits, branches/worktrees or push. Read-only source/Git inspection is permitted. If a material observation requires additional mutation, state the precise need and return it to the Director.

Complete the bounded assessment or return its concrete evidence gap. Release all assessment writes/processes explicitly to Director `/root`.
