---
task_id: combat-draw-db10-peer-delay-preparation
revision: 1
status: active
role: worker
review_level: Focused
inventory_profile: NORMAL
human_gate: none
launch_id: COMBAT-DRAW-DB10-PEER-DELAY-PREPARATION-20260907-01
workspace_claim: C:/Users/Joe/Projects/OgreBattlel64/OB64 Decomp/docs/Plans/task-logs/combat-draw-db10-peer-delay-preparation-r1.claim.json
---

# Trace DB10 peer-branch delay-slot differences

Use Astra Medium in /root/boot_conversion_preparation. Director /root, native task 01a07262-aeca-7341-ad10-2dba705ff988, local.
Coordination baseline: e9974e113be503c3a46acbd5e209e35aadfd04d0. Accepted matching source remains W7 469a1416918592749d61dc34e3e079796f7b673c.
Reuse unchanged governing guides: both AGENTS.md files, parent docs/Worker-workflow.md, canonical docs/WORKFLOW.md and docs/SOURCE_POLICY.md.

The sole W8 matcher requests a bounded, read-only retained-stage comparison of two frozen DB10 controls.
Identify the first visible stage producing the extra peer-presence branch delay no-op in control A versus B.
Account for actual predicate, peer-offset and result dependencies and lifetimes around the four affected peer checks.
Distinguish filling a delay slot from attaining retail's v0 offset value and its surrounding joins.
Report observed stage transitions separately from any unrecorded scheduling or allocation cause.
Do not create source candidates, propose a recipe sweep, or infer original source spelling.

Frozen source root: build/combat-draw-wave8-r1/.

| Control | Authored source | Production assembly | Reported provisional result |
|---|---|---|---|
| A | func_0020DB10.presence-offset-reuse.c; SHA256 F642ED3E73190DA8F38A3BFD1467B518BBF33B64A5A2603A2EA01931EC18A8CF | func_0020DB10.presence-offset-reuse.s; SHA256 B8519C253CD85265DF4EE601346D45DEAAEC2D91FC732802D74C1E9BAFAF3E03 | 5564 bytes, frame552; four extra peer-branch delay no-ops |
| B | func_0020DB10.early-peer-offset.c; SHA256 3427A473CB32930A1371C8571393DB0D8D2467E195CC427C527342091EAEC966 | func_0020DB10.early-peer-offset.s; SHA256 09C0ED84EA8F1FFA65A28974C9EDC01ECCFB18127D92EB248DF5E7EFE4712331 | 5536 bytes, frame552; filled slots, different peer registers and joins |

Use only these corresponding preserved diagnostic directories:

- A: build/combat-draw-wave8-r1/rtl-DB10-presence-offset-reuse-preprocessed/.
- B: build/combat-draw-wave8-r1/rtl-DB10-early-peer-offset-preprocessed/.

Each contains candidate.c, candidate.s, policy.json, diagnostic-command.json and thirteen retained candidate.c pass dumps.
Passes: .rtl, .jump, .cse, .loop, .cse2, .flow, .combine, .sched, .lreg, .greg, .sched2, .jump2 and .dbr.
Record all exact identities before analysis. Authenticate expanded inputs and recorded policy/command provenance without rerunning commands.
Establish each control's production/diagnostic comparability before attributing retained metadata to its production output.
The matcher reports equality after excluding .file and comment lines. Verify the actual differences and retain their precise scope.
Distinguish self-contained expanded-input identity from independent preprocessing/header replay if the latter is unavailable.
The separate rtl-DB10-presence-offset-reuse/ directory contains a failed direct-unpreprocessed diagnostic. It is invalid and excluded.
Do not use that failed package, mutable production C/configuration, other controls or Resolver/generated production state.

Retail authority is asm/original/rev0/lib/func_0020DB10.s at accepted W7.
Original SHA256: 4493C58ABF102557B2E89D98021B18968903F706B3D983227497CD101379E2FE.
The complete accepted owner spans ROM20DB10..20F0BC: 5548 bytes and 1387 words.
Authenticate original words against the canonical ROM. Derived draft assembly contains marked m2c guard instructions and is not retail authority.
Read-only ROM: C:/Users/Joe/Projects/OgreBattlel64/Ogre Battle 64 - Person of Lordly Caliber (U) [!].v64.
Raw SHA256: 6CA0A1AFE224831E202857AD64EF26BD429A034A4EA48404BB09621641A07B12.
In-memory normalized z64 SHA256: 571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A.
Do not rewrite ROM or inspect external decomp source.
Reuse full-owner preparation at e8505fb1eeb14633aef168f86b7896cf6069721d only as bounded navigation.
Its report is docs/Plans/task-logs/combat-draw-integration-preparation-r1.md, SHA256 6479A82EE8DD2690AD302745C12590A3D5FE542F3223A57FFBAEACC1540A8096.
Its evidence is build/combat-draw-integration-preparation-r1/evidence.json, SHA256 7F0FF78ECAF3171D283534F9EAA5CDF77038703FC7D50CD6F05AF5E51912BA0E.

Return a bounded branch/UID/stage table and the evidence for dependency and lifetime differences.
Separate initial source-derived RTL, scheduling, allocation/reload, final delay filling and emitted instructions.
If the retained stages cannot establish a cause or decision, identify the exact missing evidence.
Existing authenticated pinned compiler source may clarify retained metadata; no fetch, rebuild, instrumentation or compiler execution is authorized.
Do not transfer pseudo identities or conclusions from the earlier context-before-fields frame report into these newer controls.
Exclude the primary writer's coordinate, counter, frame, band and token source experiments.
Full-file comparability may authenticate excluded bytes without interpreting those operations.
Ask the Director before expanding scope. No source recipe is required.

This is ordinary read-only matching assistance, not reusable compiler research acceptance, independent source review or semantic/structural acceptance.
/root/boot_materializer_reasoning retains sole production source/build ownership and continues its disjoint source corrections.
All fourteen W8 members remain required for the single final complete-wave verifier. Neither control is accepted by size or partial agreement.

Create and read back the complete fresh claim atomically before other writes.
Record receiver /root/boot_conversion_preparation separately from Director/native identity, host, task, revision, launch and exact input baselines.
Own only that claim, docs/Plans/task-logs/combat-draw-db10-peer-delay-preparation-r1.md and ignored build/combat-draw-db10-peer-delay-preparation-r1/.
Bounded offline parsing and evidence writes are allowed only in that owned scope.
No C candidates, source edits, compiler/link/build/verifier/source-policy commands, shared-tool changes, structural changes or relaxed gates.
No padding, artificial references, volatile barriers, assembler escapes or fabricated bytes.
No agents, runtime/GUI/bridge/database/capture actions, staging, commits, push, branches or worktrees.
You are not alone; preserve all W8, Resolver, frozen and unrelated work.
Return the bounded result or precise limitation directly to /root through collaboration, then release all assigned writes.
Do not send native app callbacks.
