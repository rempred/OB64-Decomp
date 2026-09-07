---
task_id: combat-7adc-endpoint-reproducer
revision: 1
status: completed
role: worker
review_level: Focused
inventory_profile: NORMAL
human_gate: none
launch_id: COMBAT-7ADC-ENDPOINT-REPRODUCER-20260907-01
workspace_claim: C:/Users/Joe/Projects/OgreBattlel64/OB64 Decomp/docs/Plans/task-logs/combat-7adc-endpoint-reproducer-r1.claim.json
---

# Isolate the 7ADC endpoint code-generation difference

Director `/root`, local task `01a07dad-52c1-7cb0-9913-d9f7afa91281`, reuses Astra Medium worker `/root/db10_allocation_trace`.
Starting coordination HEAD is `45220944`. The source worker has restored all best candidates and paused production experiments.
This separately assigned compiler research follows Joe's suggestion to construct a smaller reproducer after tracing and guided source tests.
Production ownership remains with `/root/combat_draw_continuation`; this worker owns only isolated research copies.

Read parent and canonical AGENTS.md, parent docs/Worker-workflow.md, canonical docs/WORKFLOW.md, docs/SOURCE_POLICY.md and docs/AUDIT.md.
Reuse the accepted compiler diagnostic report/review and W8 R2's endpoint-pass comparison.
The frozen locating manifest is build/combat-draw-wave8-r2/7adc-endpoint-locating/manifest.json.
Its SHA256 is A46F056F30EDD18A8D29DD2CD2D3FB82A9EFFE9E29EF9C2EBA24B89BCD91FBEA.
It binds source, complete input, ordinary passes, pinned/tracer assembly and command records for both candidates.
Current source: EE2731479C73A8BFCB7CCD4CF5B95AD0DD80E058821B323A089244B22F570176.
Current complete input: 444077E9FADE629401A939C6C32B35E0873CB9E3F1DA0EA428944492438003C8.
Retained source: 9664CDE9AF7F83001D93D7620CEA50248A4F4F54C6BF8FECCC11D0C61CEBF162.
Retained complete input: B0F82DECC65FDC38B8E9B87C999B573BD68E33EF133F22F4F0AE3CAF787F4743.
The package includes regions.json, pass-snippets.json and source-difference.patch.

The current candidate subtracts through a temporary before shifting back into the live endpoint.
The retained explicit-stage candidate keeps endpoint self-updates but schedules a decrement before an earlier WIDTH call.
The pair also differs in two final row stores because the retained input lacks SIZE_ROW. It is not a one-variable comparison.
First establish controlled full-function inputs that isolate the endpoint spelling from that row-store difference.
Preserve both original candidates and all failed controls. Do not assume the initial reported difference has one cause.

Define a nonvacuous, reproducible property that retains the relevant WIDTH call, live endpoint update, and emitted use of the packed coordinate.
Then attempt to reduce the responsible source context while preserving the observed temporary/self-update and scheduling distinction.
A task-local reducer, available C-Reduce, or manual reduction is acceptable. Do not perform a system-wide dependency installation.
Any helper dependency must remain within the assigned ignored root. Never alter production tool configuration or executable identities.
Avoid introducing undefined behavior, uninitialized reads, artificial compiler barriers, volatile accesses or assembler mechanisms to preserve a result.
Do not call a result minimal without proving that claim. A faithful smaller reproducer with explicit retained context is sufficient.
Reduced code is diagnostic evidence only and must never be activated as a game-function replacement.

Use the pinned compiler and complete recorded flags. Additional ordinary pass dumps must first preserve the corresponding pinned assembly.
No new compiler instrumentation is authorized. If that becomes necessary, return the precise missing observation to the Director.
Before deriving a full-function source lead, retest the relevant distinction in the complete controlled function.
Keep candidate code-generation observations separate from unavailable retail compiler history and from matching acceptance.
If reduction cannot preserve the property, report the bounded failed attempts and exact fidelity condition that was lost.

Own only the fresh claim, docs/Plans/task-logs/combat-7adc-endpoint-reproducer-r1.md and ignored build/combat-7adc-endpoint-reproducer-r1/.
Create the claim atomically and read it back before writes. You are not alone; all prior records and evidence remain read-only.
No production C/configuration, shared tooling, compiler pins/flags, owner boundaries, linker contracts, runtime, GUI, bridge or database changes.
No canonical linked diff, full build, verifier, agents, staging, commits, push, branches or worktrees.
The new reproduction and any reusable causal claims require independent research review before propagation.
That review cannot accept a source match or add an ordinary matching review gate.
All fourteen W8 targets and their single final complete-wave verifier remain required; all later family obligations remain intact.
Report reproducible controlled inputs, property checks, reduced source, failed attempts and limits directly to `/root`, then release writes.
