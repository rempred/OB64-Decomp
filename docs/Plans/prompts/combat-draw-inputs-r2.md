---
task_id: combat-draw-inputs
revision: 2
status: ready
role: correction-worker
review_level: Focused
inventory_profile: NORMAL
human_gate: none
launch_id: COMBAT-DRAW-INPUTS-20260907-02
workspace_claim: C:/Users/Joe/Projects/OgreBattlel64/OB64 Decomp/docs/Plans/task-logs/combat-draw-inputs-r2.claim.json
---

# Correct the draw-input baseline citation

Use Sol High /root/combat_data_retrieval for literal identity reconciliation only.
Director /root, native task 01a07262-aeca-7341-ad10-2dba705ff988, local.
Read both AGENTS.md files and parent docs/Worker-workflow.md.
Preserve the completed R1 report and package unchanged.
R1 report SHA256 is 7E3A029A76EB190DC1F4099FC4ADE5472AFCC15C80867FFEED62934E14C50F35.
R1 package SHA256 is 4340C97DE145E1970D62F909B443894ACECFF3742F544D9BB41CCE0A9263025D.

Director intake found two different full commit identities for d70fd85 in the report.
The baseline paragraph uses d70fd8524ad3f9d7c9f6355be1772bca852d087a.
Git resolves d70fd85 to d70fd853fdffacf71290b24763e010a549276a55, matching the package and report evidence table.
Verify this exact mismatch against Git and the frozen package.
Check the report's other full commit citations against the actual referenced Git objects.
Write a concise separate R2 correction identifying incorrect citations and the authoritative replacements.
State whether the literal package requires correction; if it does, preserve R1 and write a corrected copy in the R2 root.
If the package is correct, reuse its unchanged bytes and hash without re-extracting the fourteen-target package.
Do not change source facts, membership, semantic claims or accepted ownership.

Create the complete fresh claim atomically before writes.
Own only the claim, docs/Plans/task-logs/combat-draw-inputs-r2.md and ignored build/combat-draw-inputs-r2/.
You are not alone; W6 retains sole production/build ownership.
No production/config/tool edits, builds, diffs, verifiers, runtime/database, agents or Git mutations.
Report directly through collaboration.send_message to /root; never native app sends/readbacks.
Release all writes at terminal handoff.
