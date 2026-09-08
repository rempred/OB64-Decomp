---
task_id: angr-trial-input-retrieval
revision: 1
status: active
role: worker
review_level: Focused
inventory_profile: NORMAL
human_gate: none
launch_id: ANGR-TRIAL-INPUT-RETRIEVAL-20260907-01
workspace_claim: C:/Users/Joe/Projects/OgreBattlel64/OB64 Decomp/docs/Plans/task-logs/angr-trial-input-retrieval-r1.claim.json
---

# Retrieve accepted inputs for the requested angr trial

Director `/root`, task `01a07dad-52c1-7cb0-9913-d9f7afa91281`, reuses Sol High `/root/db10_alias_inventory` for retrieval/parsing only.
Joe explicitly requests a small angr analysis trial beside m2c, including solved functions and a hard blocker, ideally func_00215CF0.
Read parent/canonical AGENTS.md, parent docs/Worker-workflow.md, canonical docs/WORKFLOW.md and docs/SOURCE_POLICY.md.

Locate func_00215CF0's accepted owner, original assembly, exact ROM/runtime placement and extent, existing current or retained C/m2c output,
and the report(s) documenting its unresolved issue. Record ambiguity or missing accepted placement rather than resolving structure yourself.
Retrieve a small menu of fully accepted PURE_C functions (prefer three or four) with exact final-wave evidence, source, original asm and placement.
Use existing function descriptions and source-text constructs to include a simple leaf/control baseline, a loop/pointer/call case and a switch/indirect-transfer case if available.
Do not claim behavior from names. Distinguish accepted full-wave exact functions from focused-only7ADC evidence.
Current W8 hard3C00/DB10/6098 may be additional options but do not replace215CF0 silently.

For each candidate, report exact paths/hashes and accepted evidence locations. Retrieve existing jump-table/data/callee-placement references as literal metadata.
Find the project's actual m2c executable/version/command/context inputs and existing draft outputs. Do not run m2c or modify its installation.
Also locate the configured Python runtime and ordinary tooling wrappers from configuration/documentation; no dependency installation.
Do not traverse captures or unlicensed external decomp source. Do not reconstruct historical program chronology beyond these needed records.
Send useful located paths early to `/root` and `/root/db10_allocation_trace`, who is preparing the isolated trial environment.
Preserve exact copies of selected mutable inputs in your ignored root; original-source path/hash is an observation, not a demand to freeze production.

Own only fresh claim, docs/Plans/task-logs/angr-trial-input-retrieval-r1.md and ignored build/angr-trial-input-retrieval-r1/.
Create claim atomically/read back first. You are not alone; production ownership remains with `/root/combat_draw_continuation`.
No implementation, semantic/structural acceptance, source trial, compilation, dependency installation, canonical diff/build/verifier, runtime/Resolver, Git or agents.
No changes outside assigned paths, no new matching count, and no ordinary matching-review gate. All existing family/wave obligations remain.
Return bounded input inventory/report identities, then release writes.
