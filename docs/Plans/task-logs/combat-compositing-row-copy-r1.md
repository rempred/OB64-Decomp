Completed: row-guard retains an explicit join copy between two noninterfering pseudos that receive incompatible hard registers. Death notes are present. The local copy transform cannot fold this control-flow shape across the loop backedge. Named branch-advance avoids the copy in initial RTL. Director intake is next; the sole W7 writer retains candidate work.

Assignment: `COMBAT-COMPOSITING-ROW-COPY-20260907-01`, revision 1. Worker: `/root/compilation_groups_design`, Astra Medium. Director: `/root`, native task `01a07262-aeca-7341-ad10-2dba705ff988`, local. Starting HEAD: `2cc6b6570b79e9185e98c5c3b56bcb6513dc4be7`. The complete fresh claim was created atomically before evidence writes.

## Inputs and boundary

Package A is `build/combat-compositing-wave7-r1/rtl-207E30-row-guard/`. Its preprocessed source SHA256 is `75B5F285E4C1FFA3553FE4B742A52480D5938ECAB468FD5C579A70BADA260634`. Its assembly SHA256 is `EEB29134D61660584DF63FFE1A419C4E92505C89612332395737616246114D95`.

Package B is `build/combat-compositing-wave7-r1/rtl-207E30-named-branch-advance/`. Its preprocessed source SHA256 is `4EE397F4A55054F73CAAE92C396A087D320C79B734393566F9DEC6BC6C018710`. Its assembly SHA256 is `A7A682F1860A173E763C309D9B676E83C0D1AE7CC1DCACDBF9EC409CF9A6AF87`.

Both packages' thirteen passes and command records were hashed. The frozen global-allocation, priority, and fast-loop reports passed their exact recorded hash checks. Their authored/preprocessed association limits remain unchanged. This report binds conclusions to the preprocessed packages, not to a new preprocessing claim. No current shared source or compiler outputs were used.

The original owner SHA256 remains `9EC834B385C85F14D7454B801585285812D94500FD31A0EBE377B77DECD6F0A6`. This task establishes no new retail byte count or matching result. Relevant pinned `local-alloc.c`, `global.c`, and `flow.c` hashes agree with the prior authenticated compiler evidence. No compiler was executed or internally traced.

## Role authentication and earliest difference

In A, `nextSource` is declared before `sourceRow`. Initial RTL independently authenticates their roles:

| A instruction UID | RTL operation | Source role |
|---:|---|---|
| 303 | pseudo87 = input84 + 8 | Initialize sourceRow |
| 497 | pseudo86 = pseudo87 + stride100 | Fast branch nextSource calculation |
| 990 | pseudo86 = pseudo87 + stride100 | Other branch nextSource calculation |
| 995 | pseudo87 = pseudo86 | Join assignment sourceRow = nextSource |

These are actual preprocessed statements and RTL relationships, not roles inferred from register numbers alone. UID995 already exists in initial RTL. Both branch calculations and that copy survive through local allocation.

In B, sourceRow is pseudo86. UID303 initializes it from input84 plus eight. UIDs 487 and 978 each update pseudo86 from itself plus stride99. There is no corresponding join copy. B's pseudo87 instead belongs to another row pointer; it must not be compared with A's sourceRow87 by number alone.

Thus B avoids this copy before optimization. It does not demonstrate successful coalescing of A's temporary. The packages contain other differences, so their complete hard-register layouts cannot be attributed solely to these statements.

## Death and local-copy handling

A's flow pass places `REG_DEAD sourceRow87` on both branch additions, UIDs 497 and 990. It places `REG_DEAD nextSource86` on UID995. These notes remain in local-allocation output. Copy retention therefore cannot be explained by a missing death note at the join.

| A value | Flow references / length | lreg references / length | Death sites | Calls crossed |
|---|---|---|---:|---:|
| nextSource86 | 9 / 4 | 9 / 4 | 1 | 0 |
| sourceRow87 | 14 / 254 | 14 / 198 | 2 | 3 |

The dump omits `dies in` when the count is one. It prints no single-block assignment for either pseudo. The source's local-allocation eligibility requires a single block and exactly one death, plus class conditions. One death alone does not make nextSource locally allocatable. Both appear in the later global allocation list.

The pinned `local-alloc.c:1008` dispatches dying-source pseudo copies to `optimize_reg_copy_2` when expensive optimization is enabled. This transform searches forward for a reverse copy with the matching destination death. It stops at a jump, label, or loop boundary (`local-alloc.c:884`). It is not a general control-flow coalescer.

After A's UID995, the retained scheduled/local RTL contains row updates and the height test. It reaches jump UID419 without a reverse copy. Therefore this transform cannot remove UID995 from the retained shape. This is a source-supported explanation of a failed precondition, not an observed internal invocation or rejection trace.

The combine output also retains UID995. Its producer link is nil; two predecessor branch definitions feed the join. The passes establish retention there. They do not expose every internal combine decision, so no stronger exact rejection reason is claimed.

## Global conflict and final copy

The global conflict rows do not list pseudo86 against pseudo87 in either direction. Both entries are unshared, size-one allocation units. No hard-register preference row is printed for either. The absence of mutual interference permits sharing; it does not force sharing.

The authenticated priority rule gives nextSource86 priority 67500 and sourceRow87 priority 2121. The global header allocates nextSource far earlier. Final dispositions are nextSource86 in register 2 and sourceRow87 in register 30 (`$fp`). SourceRow87's hard-conflict row includes register 2. NextSource86's hard-conflict row does not.

This is a concrete reason the chosen register 2 cannot also serve sourceRow87 under the recorded conflict model. SourceRow also crosses three calls, unlike nextSource. These facts explain why lack of a pseudo-to-pseudo conflict is insufficient. They do not reconstruct each internal register-search attempt.

The pinned global preference expansion merges existing hard-register preference sets for suitable nonconflicting deaths. It does not merge every copy-connected pseudo into one allocation unit. Here the dump explicitly shows separate units with no printed preferences. Global allocation changes UID995 to register30 = register2, and that move survives `jump2`, scheduling, and delay-slot output.

Post-global output still contains both branch additions. `jump2` retains UID990 and removes the separate UID497 addition. This late consolidation occurs after the distinct hard registers already exist. Final assembly contains `addu $2,$fp,$24` followed later by `move $fp,$2`. B instead emits a direct source-row update, `addu $21,$21,$24`.

## Supported consequence and remaining limit

The earliest supported distinction is the initial RTL destination identity: A computes into nextSource then copies at the join; B directly updates sourceRow. The later evidence explains why A's valid death notes do not guarantee copy removal. A general compiler defect, absent death information, or mandatory mutual conflict is not supported.

The direct branch-update representation is already demonstrated by frozen B. It is the single supported ordinary-C mechanism for avoiding this join copy. Its predicted stage effect is a self-update in initial RTL with no nextSource-to-sourceRow join assignment. A retained distinct join copy in that initial RTL would falsify that prediction. This is an existing control, not a request to repeat B or a new source-spelling experiment.

It does not predict retail register allocation, frame size, or a complete match. No new alternative hypothesis is proposed. The writer's early-y/common-update setup/frame candidate and solved packed expressions were excluded.

## Delivery

Offline parser `build/combat-compositing-row-copy-r1/inspect.js` passed on 40 authenticated inputs. It retained all relevant pass transitions, death notes, conflicts, dispositions, compiler excerpts, and priority arithmetic. Evidence: `build/combat-compositing-row-copy-r1/evidence.json`, SHA256 `819C1BB940D6A88C1F9FCBE8AC49DBED6A0789290AC6A72B732EDD5D49D8C5AC`.

Only this report, the fresh claim, and assigned ignored evidence root were written. No compiler, candidate, source/configuration, build, verifier, runtime, database, agent, or Git mutation occurred. Previous terminal reports remain frozen. All writes are released at handoff. All seven W7 targets retain their complete-wave gates; this assistance adds no independent matching review.
