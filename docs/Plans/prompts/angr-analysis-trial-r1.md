---
task_id: angr-analysis-trial
revision: 1
status: completed
role: worker
review_level: Focused
inventory_profile: NORMAL
human_gate: none
launch_id: ANGR-ANALYSIS-TRIAL-20260907-01
workspace_claim: C:/Users/Joe/Projects/OgreBattlel64/OB64 Decomp/docs/Plans/task-logs/angr-analysis-trial-r1.claim.json
---

# Evaluate angr as optional analysis beside m2c

Director `/root`, task `01a07dad-52c1-7cb0-9913-d9f7afa91281`, reuses Astra Medium `/root/db10_allocation_trace` for Joe's explicit trial request.
Read parent/canonical AGENTS.md, parent docs/Worker-workflow.md, canonical docs/WORKFLOW.md, docs/SOURCE_POLICY.md and docs/AUDIT.md.
The task is complementary analysis: m2c remains the primary matching-C generator. Do not grade angr mainly by its generated C or seek production integration now.
Source owner `/root/combat_draw_continuation` retains all production ownership. Sol High `/root/db10_alias_inventory` is retrieving accepted trial inputs and m2c/runtime locations.

Use official angr repository/documentation as primary sources: https://github.com/angr/angr and https://docs.angr.io/ .
Start by preparing an isolated environment while retrieval runs. User authorization includes task-local dependency setup and a small representative trial.
Install pinned recorded versions under your ignored root only (venv or task-local package target). Do not modify system Python, production tools, m2c, compiler pins or shared configuration.
Record Python/angr/archinfo/pyvex/claripy/cle and relevant solver versions, package provenance, installation/runtime commands and elapsed effort.
An existing usable runtime is preferred. No system-wide installs, new WSL/container service or persistent background service is authorized.
If Windows/native dependency support blocks installation, make a bounded alternate-runtime attempt using an already installed runtime, then report the precise limitation; do not turn the whole trial into environment engineering.

Run approximately three solved accepted functions plus func_00215CF0 if its accepted owner can be uniquely resolved.
If that symbol is unavailable/ambiguous, report exactly why and include another hard current blocker; it is preferable to include215CF0 plus a current W8 blocker if inexpensive.
Freeze exact original ROM bytes/placement/extent and necessary tables/callee metadata in task-local copies. Do not read a changing CURRENT linked object as retail truth.
Use the accepted full-wave source/evidence and actual m2c output as comparison references. Run the existing m2c tool into your own ignored root if an output is missing, without modifying its installation or shared output paths.
Do not promote any angr boundary/overlay/owner suggestion into production. Never map conflicting overlay states as if simultaneously active.

Exercise the requested capabilities where representative inputs permit:
- CFG recovery, loops/branches/calls and higher-level structuring;
- reaching definitions/data dependencies, with concrete def-use questions at selected instructions;
- indirect jumps/switch destinations, including unresolved or falsely resolved edges;
- prototype/calling-convention inference, checking argument/return/stack and floating-point evidence;
- bounded symbolic execution on a small solved behavior and a useful blocker question if feasible.
Use per-analysis time/state/solver limits and record timeout, unsupported and error cases explicitly. Do not allow unbounded whole-ROM scans or path explosion.
Do not replace missing call behavior with unjustified return values. Label hooks, summaries, initial registers, memory constraints and unsupported hardware effects as assumptions.

Assess N64/MIPS adaptation explicitly: big endianness, MIPS III/VR4300 instruction lifting,32-bit pointers/o32-like ABI versus physical64-bit registers,
FPU operations/register mode, delay slots/branch-likely behavior, relocations, ROM versus runtime addresses, overlays, data tables, external calls and hardware/global memory.
Check instruction/IR fidelity on the actual selected bytes before trusting downstream answers. No silent instruction rewriting, fake byte patches or symbol-specific bypasses.
Task-local loader/mapping or ABI adaptation is permitted if explicit and generic; preserve raw and adapted results separately and identify what knowledge was supplied.

Separate minimal-input recovery from metadata-assisted analysis. Known boundaries, prototypes, table entries or accepted edges supplied as inputs cannot also count as new discoveries.
Compare factual outputs against accepted project evidence, m2c output and known exact C. Use a concise result matrix: correct new information, already known, wrong, unresolved/unsupported.
For each claimed new fact, give exact instruction/data evidence, verification, and how it would change an LLM's next matching-C step.
Do not claim faster matching merely from a nicer graph or more output; distinguish a demonstrated useful next step from a plausible future benefit.
If using angr's decompiler/AIL, evaluate structure recovery only as one analysis output, not as the replacement-C objective.

Return one concise recommendation: adopt as an optional analysis tool, run a larger trial, or reject, with the strongest concrete evidence.
Report adaptation/maintenance costs, reliability limits and whether the observed benefit justifies optional integration. No actual shared-tool integration is authorized by this evaluation assignment.
This new tool/research result requires applicable independent review before adoption guidance is propagated. It adds no ordinary matching-source review gate or full-ROM acceptance run.

Own only fresh claim, docs/Plans/task-logs/angr-analysis-trial-r1.md and ignored build/angr-analysis-trial-r1/.
Create claim atomically/read back before writes. You are not alone: all prior reports, production sources and other workers' roots stay read-only.
No canonical C/ASM/configuration/tooling/compiler/owner/linkage changes, canonical build/diff/verifier, runtime/Resolver/GUI/bridge/database, agents, Git, branches/worktrees or push.
Keep generated packages, binaries, m2c/angr output and proof data untracked under the assigned root. Record enough exact commands/inputs for independent replay.
Return frozen report/evidence identities and release writes. The broader sequential Combat/Squad/High Attack goal remains intact.
