---
task_id: combat-3c00-competing-values
revision: 1
status: active
role: worker
review_level: Focused
inventory_profile: NORMAL
human_gate: none
launch_id: COMBAT-3C00-COMPETING-VALUES-20260907-01
workspace_claim: C:/Users/Joe/Projects/OgreBattlel64/OB64 Decomp/docs/Plans/task-logs/combat-3c00-competing-values-r1.claim.json
---

# Locate 3C00's competing saved-register values

Director `/root`, local task `01a07dad-52c1-7cb0-9913-d9f7afa91281`, reuses Astra Medium worker `/root/db10_allocation_trace`.
Production source/build ownership remains with `/root/combat_draw_continuation`, who has restored all best inputs and supplied this locating scope.
This is disjoint read-only support for ordinary W8 matching, using existing accepted owners and previously pinned-agreed candidate passes.

Read parent and canonical AGENTS.md, parent docs/Worker-workflow.md, canonical docs/WORKFLOW.md and docs/SOURCE_POLICY.md.
Read the current 3C00 allocation observations in docs/Plans/task-logs/combat-draw-wave8-r2.md and the retail side of the frozen combat-draw-3c00-residual-r1.md.
Do not treat the older residual report's D589 candidate as current source. Its retail reference remains useful under its stated limits.

Exact trace directories under build/combat-draw-wave8-r2/3c00-traces/ are:
- distinct-cursor-full-tile: authored source 7F823700DD804DF6C261FC1BBD665BA3B5DA91DBCE0CB4A34F659A70079BE7DF; expanded input 19D903BD6959C0939EAA93F71673E192A81998BA18C2734D15D3216D2ABFBABD; analysis FFF0CDCF35BAB3E5CF571911D6B50762DC05BECBEA81E4D464462C4C0B75248E.
- companion-null-at-capacity: authored source 93420A0F14551CDB27A9B5F9E3C5B7BE934B1FA13E43BCB4F4D0C20EA2D31C1A; expanded input 2508C0516F23F83941F387A04D5E500A564878169F162898E84D012B44A060DE; analysis 9B56B3FCAF9A0DD060F6D6BF29C1D24324CDBD07CCB32671F6F89D3251352907.
- primary-row-after-shortened-companion: authored source E209C13BE196D87901ADAFCFC515208432FB8012AB0910B50A5D83D5F363A1E9; expanded input 265DC83A06FD70099AE9BB0561CDF65EA6CB94BDB8C9CADFF971979A245EAE47; analysis 237A60E4DD36B50966C11D80B98029F7C747C52B844EFA2DDE4C010FEAA1909B.
Each directory contains authored.c, candidate.c, candidate.c.rtl/flow/lreg/greg and other passes, pinned.s, trace.s and analysis.json. Authenticate these inputs and existing agreement before interpretation; no new compilation is authorized.
Original asm/original/rev0/lib/func_001F3C00.s SHA256 C31BB4824DF0178D65383897F956F802C0C7CAD14245FD0A74BAB99F5C42C85B.
Frozen retail disassembly build/combat-draw-3c00-residual-r1/retail.txt SHA256 CF1895D24E0D41D92D2C1B15CC9736253A7DD4CFD34F6882CCE21A79BE36136C; retail.bin SHA256 458A6CB397B154CCC0CBE12CAEF4456A711C676E6B269F32A8DEE2490522925A.
Accepted ROM start is0x001F3C00, runtime0x801B0770, extent6740. Relevant relative offsets are null099C, capacity0Dxx, u1F10/F18 and1020-1028, stripFB4-FD0, geometry rowFE0/FE8, packet row14BC/14C0, calls14D4/14DC, tails1554-1574 and16CC-16DC.
Retail companion/u1/strip/geometry-row/packet-row dispositions at these uses are s6/s7/s8/s5/s3; current are s8/s6/s7/s5/s6. Include any additional actual value that prevents the current packet row from using retail's s3.

Current companion100/u1-114/strip115 are all global and map to s8/s6/s7 versus retail s6/s7/s8 at the matched uses.
The first control shortens companion's null-initialization lifetime and changes them to s7/s6/s8.
Current packet-row920 = (row*4)&4095 occupies s6, conflicts with companion/strip, and can share with u1.
The second control separates the primary packet-row value: companion packet-row920 falls to s4 and primaryRow923 is local s2,
but geometry row116 takes s6; companion/u1/strip become s7/s4/s8. These changes worsen native comparisons and are not selected.

Map the full relevant competing value arrangement, including geometry row, companion/primary packet rows, companion pointer, u1 and strip.
Use exact definitions/uses, block and call spans, allocation-class/order/conflict records and hard-register dispositions in each candidate.
At the affected companion setup and companion-to-primary transition, establish corresponding retail instruction-derived values and lifetimes where evidence permits.
Do not invent retail pseudo registers, compiler priorities or event-time allocation history from machine code.
Explain which real conflicts prevent the desired register sharing and distinguish a documented conflict from inferred allocator preference.
Do not stop at saying that freeing one register assigns it to another value: identify the competing real value and its actual overlapping uses.
Return a bounded table and one or a small number of concrete, untested source-lifetime questions if justified, checking R2's prior controls first.
If mapping is ambiguous or lacks evidence, state the exact uncertainty. No new generic compiler-cause, semantic, structural or matching claim is authorized.

Own only the fresh claim, docs/Plans/task-logs/combat-3c00-competing-values-r1.md and ignored build/combat-3c00-competing-values-r1/.
Create the claim atomically and read it back before other writes. You are not alone; previous reports/evidence and all production files are read-only.
No source trials, compilation, new instrumentation, shared tooling/configuration, compiler identities/flags, accepted owner/linkage changes or padding/artificial references.
No canonical diff, full build, verifier, Resolver, runtime, GUI, bridge, database, agents, staging, commit, push, branch or worktree.
This locating result adds no ordinary matching-review gate. All fourteen W8 targets, one final complete-wave verifier and later families remain required.
Return exact report/evidence identities through collaboration, then release writes.
