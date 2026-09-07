---
task_id: combat-capture-preset-gui
revision: 4
status: completed
role: worker
review_level: Focused
inventory_profile: NORMAL
human_gate: no-new-capture-authority
launch_id: COMBAT-CAPTURE-PRESET-GUI-20260907-04
workspace_claim: C:/Users/Joe/Projects/OgreBattlel64/OB64 Decomp/docs/Plans/task-logs/combat-capture-startup-r4.claim.json
---

# Correct the observed Combat capture startup failure

Use Astra Medium /root/combat_discovery. Director /root, native task 01a07262-aeca-7341-ad10-2dba705ff988, local.
Joe reports a real startup error through a screenshot after using the new GUI.
The GUI log confirms Pj64Error: invalid count: 0 during Combat startup with beforeRom=false.
Failed session: 20260907T030928.940105Z-127f5fec, bridge epoch 1A079C8AF20-F79E5FFB, worker 24704 now interrupted.
Subsequent ordinary and Combat attempts failed because observation preflight found a nonempty unified queue.
Read the current GUI diagnostic log under build/total-resolver/combat-capture-gui-launch-r1/ and the failed session's preserved records.
These are evidence, not permission to repeat commands, clear queues, restart processes, or start a capture.

Read both AGENTS.md files, parent docs/Worker-workflow.md, Total Resolver maintenance/recovery guidance, and the accepted R1-R3 implementation/review records.
First diagnose read-only while W5 releases production ownership. You may create the fresh claim/log and isolated scratch.
Identify the exact rejected wire command, value, and deployed bridge parsing contract from actual code and preserved evidence.
Use the real bridge command/parser implementation or its existing offline harness to reproduce the defect.
The previous fake-client test pass did not establish this live compatibility; correct the missing contract coverage.
Do not replace zero with an arbitrary count merely to suppress the error; establish the intended supported capture contract.
Preserve the requested Combat observations, preset dropdown, manual Stop and no time limit.
Preserve qualification, watch ownership, capacity/loss, failure cleanup and Cutscene compatibility.

After explicit Director production release, own minimal coherent canonical Total Resolver source/test/documentation corrections.
Project64 external repository and deployed binaries/scripts remain read-only during this assignment's initial diagnosis.
If the correct remedy requires external writes or deployment, report exact necessary scope before those operations.
Do not modify matching sources, configuration, compiler/linker contracts, structural foundations, or frozen evidence.
Keep a generic correction and adversarial rejection; no selector-specific bypass or weakened startup gate.
Determine whether failure cleanup leaves owned events and how the documented recovery should preserve their provenance.
Do not drain, discard, ingest, relabel or otherwise mutate live queues, sessions, databases or runtime state during diagnosis/testing.
Do not automatically retry capture, restart Project64, load a state, or close Joe's GUI.
Prepare a concrete recovery/relaunch route for Director action after corrected tooling review.

Create the complete claim atomically before other writes.
Own docs/Plans/task-logs/combat-capture-startup-r4.md and ignored build/total-resolver/combat-capture-startup-r4/.
Use proportional offline tests that execute the real relevant wire/parser path, plus affected lifecycle regressions.
Report exact root cause, corrected files, tests, remaining live recovery needs, and source/evidence identities.
You are not alone; W5 is winding down and Sol's input report is disjoint. Wait for explicit production release.
No agents, staging, commits, push, branches, worktrees, Computer Use, new live capture or full ROM build.
Send prompt checkpoints and terminal result directly through collaboration.send_message to /root; never native app callbacks/readbacks.
Release all production/report writes at terminal handoff for applicable independent review.
