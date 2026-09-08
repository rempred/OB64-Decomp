---
task_id: angr-trial-reference
revision: 1
status: active
role: worker
review_level: Focused
inventory_profile: NORMAL
human_gate: none
launch_id: ANGR-TRIAL-REFERENCE-20260907-01
workspace_claim: C:/Users/Joe/Projects/OgreBattlel64/OB64 Decomp/docs/Plans/task-logs/angr-trial-reference-r1.claim.json
---

# Define project-reference questions for the angr trial

Director `/root`, task `01a07dad-52c1-7cb0-9913-d9f7afa91281`, reuses Astra Medium `/root/combat_draw_continuation` for this read-only reference task.
Production W8 best inputs remain restored and source ownership stays with this worker; no production trials run during this reference assignment.
Joe requested evaluating angr's analysis evidence alongside m2c on solved functions and a hard blocker, ideally func_00215CF0.
Read parent/canonical AGENTS.md, parent docs/Worker-workflow.md, canonical docs/WORKFLOW.md, docs/SOURCE_POLICY.md and docs/AUDIT.md.

Coordinate with Sol `/root/db10_alias_inventory` for accepted input locations and Astra `/root/db10_allocation_trace` for the approximately three solved cases plus blocker trial set.
Use accepted project evidence, original assembly, known exact C and existing m2c output to define a compact reference matrix before inspecting angr answers.
Choose a few concrete questions covering CFG edges/loops, a switch or indirect transfer if available, register/stack def-use facts, prototype/ABI constraints and a bounded symbolic behavior.
For func_00215CF0, identify what is actually unresolved and which analysis question could change the next C-matching step; do not invent a structural problem if its blocker is compiler-specific.
For calling conventions, separate accepted C declarations from machine-supported argument/return constraints; exact bytes alone do not prove every unused parameter or full original prototype.
For CFGs, account for MIPS delay slots/branch-likely and allow equivalent block partitioning. For dataflow, identify exact definition/use instruction locations and conditional limits.
Use known original-owner/data/placement facts without promoting new boundaries or runtime behavior. Mark missing/ambiguous oracle facts rather than guessing.
Do not feed expected edges/prototypes/target lists into the trial's minimal-input recovery. Share references as comparison oracles and clearly label any optional assistance inputs.
State what m2c/project evidence already supplies so a correct angr rediscovery is not counted as new information.

No angr execution, package installation, m2c invocation, compilation or source experiment is assigned here; the separate trial worker owns execution.
No new semantic, structural, compiler or matching acceptance follows from this reference matrix. It joins the new tool trial's applicable independent review.
Own only fresh claim, docs/Plans/task-logs/angr-trial-reference-r1.md and ignored build/angr-trial-reference-r1/.
Create claim atomically/read back first. Other workers' evidence, all previous records and production source/configuration/tools remain read-only.
No canonical diff/build/verifier, Resolver/runtime/GUI/bridge/database, agents, Git, branches/worktrees or push.
Send useful bounded reference questions early to the trial worker and Director; freeze exact references/report at completion and release writes.
All W8/full-wave and broader sequential family requirements remain intact. Resume production work only after Director routing.
