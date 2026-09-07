---
task_id: combat-draw-db10-frame-preparation
revision: 1
status: completed
role: worker
review_level: Focused
inventory_profile: NORMAL
human_gate: none
launch_id: COMBAT-DRAW-DB10-FRAME-PREPARATION-20260907-01
workspace_claim: C:/Users/Joe/Projects/OgreBattlel64/OB64 Decomp/docs/Plans/task-logs/combat-draw-db10-frame-preparation-r1.claim.json
---

# Account for the preserved DB10 stack frame

Use Astra Medium in /root/boot_conversion_preparation. Director /root, native task 01a07262-aeca-7341-ad10-2dba705ff988, local.
Coordination baseline: 42379835d0ac76c3348e4c1a0b5b15684a7cc02b. Accepted matching source remains W7 469a1416918592749d61dc34e3e079796f7b673c.
Reuse unchanged governing guides: both AGENTS.md files, parent docs/Worker-workflow.md, canonical docs/WORKFLOW.md and docs/SOURCE_POLICY.md.

The sole W8 matcher requests a disjoint, read-only account of DB10's candidate frame: 552 bytes versus retail's 560 bytes.
Account for fixed locals, outgoing arguments, saved registers, alignment, actual scalar spills and compiler-only USE homes.
In particular, identify evidence for candidate pointer homes 0x1DC/0x1E4 versus retail stack offsets 0x1E4/0x1EC.
Separate observed memory accesses, compiler lifetime metadata and inferred source objects. Report only allocation origins visible in the preserved stages.
Do not infer original source spelling, fabricate storage, or propose padding or artificial references.

Authenticate these frozen inputs before interpretation:

- build/combat-draw-wave8-r1/func_0020DB10.context-before-fields.c, SHA256 6895DEB733E68E277BF7FF438B6794D8E8B87A0FB3EE024DCD29F887F55A57F1.
- build/combat-draw-wave8-r1/func_0020DB10.context-before-fields.s, SHA256 768CA33C44C4C15096645CBF25194AD8757E95483D39B277206007AF78E47BC5.
- build/combat-draw-wave8-r1/rtl-DB10-context-before-fields/candidate.c, SHA256 CB553896CE53ADA34C38BBC240DF7A2AE6749CC5E4058FD5130E53E8282F581C.
- build/combat-draw-wave8-r1/rtl-DB10-context-before-fields/candidate.s, SHA256 F5543497F6984A3148B64216081972C3085BEC557BA9570ED16A4F64394686DD.
- The same diagnostic directory's diagnostic-command.json and all thirteen candidate.c dumps: .rtl, .jump, .cse, .loop, .cse2, .flow, .combine, .sched, .lreg, .greg, .sched2, .jump2 and .dbr.
- asm/original/rev0/lib/func_0020DB10.s at accepted W7. Its recorded SHA256 is 4493C58ABF102557B2E89D98021B18968903F706B3D983227497CD101379E2FE.

Establish production/diagnostic assembly comparability before attributing pass metadata to the production candidate.
Authenticate the expanded input and command; distinguish verified self-contained input identity from unavailable preprocessing/header replay provenance.
The matcher reports 5,556 candidate bytes against the accepted 5,548-byte owner. These are provisional observations, not matching acceptance.
The derived build/combat-draw-wave8-r1/draft-func_0020DB10/original.s is a navigation aid with marked m2c guard nops.
Authenticate actual owner words against original ASM and ROM; exclude inserted guard instructions from the retail account.

Reuse the full-owner preparation frozen at e8505fb1eeb14633aef168f86b7896cf6069721d.
Report: docs/Plans/task-logs/combat-draw-integration-preparation-r1.md, SHA256 6479A82EE8DD2690AD302745C12590A3D5FE542F3223A57FFBAEACC1540A8096.
Evidence: build/combat-draw-integration-preparation-r1/evidence.json, SHA256 7F0FF78ECAF3171D283534F9EAA5CDF77038703FC7D50CD6F05AF5E51912BA0E.
Six work-array start addresses and their spacing do not alone establish source capacities.
Read-only ROM: C:/Users/Joe/Projects/OgreBattlel64/Ogre Battle 64 - Person of Lordly Caliber (U) [!].v64.
Raw SHA256: 6CA0A1AFE224831E202857AD64EF26BD429A034A4EA48404BB09621641A07B12.
In-memory normalized z64 SHA256: 571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A.
Do not rewrite ROM or inspect external decomp source.

Read only this package and necessary accepted references for the frame question.
Existing authenticated pinned GCC source may clarify metadata; no fetch, rebuild, instrumentation or compiler execution is authorized.
The accepted 6098 frame account is a method reference only. Do not transfer its offsets, missing-home explanation or source conclusions to DB10.
Exclude the writer's peer-delay, row/index/actor register experiments, band spelling and token-register source work.
Full-file comparability may authenticate excluded bytes without interpreting those operations.
Do not read mutable production candidates/configuration, other experiments, Resolver evidence or generated production state.
Ask the Director before expanding scope.

Return a bounded frame/home table with exact supporting evidence and explicit unresolved correspondences.
Identify the first preserved stage introducing relevant spill or USE homes when observable.
Keep pre-allocation metadata, reload changes and final assembly observations distinct. State missing evidence instead of assigning a cause.
Include input/output identities. No source recipe is required.
This is ordinary matching assistance, not reusable compiler research acceptance, independent source review, or semantic/structural acceptance.
All fourteen W8 members and the single final complete-wave verifier remain required.
/root/boot_materializer_reasoning remains the sole production source/build writer and continues its disjoint source corrections.

Create and read back the complete fresh claim atomically before other writes.
Record receiver /root/boot_conversion_preparation separately from Director/native identity, host, task, revision, launch and exact input baselines.
Own only that claim, docs/Plans/task-logs/combat-draw-db10-frame-preparation-r1.md and ignored build/combat-draw-db10-frame-preparation-r1/.
Bounded offline parsing and evidence writes are allowed only in that owned scope.
No C candidates, source edits, compiler/link/build/verifier/source-policy commands, shared-tool changes, structural changes or relaxed gates.
No agents, runtime/GUI/bridge/database/capture actions, staging, commits, push, branches or worktrees.
You are not alone; preserve all W8, Resolver, frozen and unrelated work.
Return the bounded result or precise limitation directly to /root through collaboration, then release all assigned writes.
Do not send native app callbacks.
