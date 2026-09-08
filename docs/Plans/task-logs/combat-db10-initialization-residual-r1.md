# DB10 initialization residual

Completed disjoint read-only W8 support. Worker `/root/db10_allocation_trace`, Astra Medium; Director `/root`; activation `f42a16ef`, launch `COMBAT-DB10-INITIALIZATION-RESIDUAL-20260907-01`. Fresh claim was atomically created and read back before other writes. Only the fresh claim/report and ignored `build/combat-db10-initialization-residual-r1/` (R) were written. No compilation, source experiment, canonical diff, build, verifier, Git or runtime operation ran.

The separately reported six-word residual is exactly one cyclic reordering at owner offsets `0x11DC`–`0x11F0`: current C clears the outer actor-scan counter before five array-base setup instructions; retail clears it afterward. Those six instruction words have the same multiset. All base values, destination registers and two spill offsets in this region agree. The current `.loop` pass already contains the counter-clear-before-base order. This establishes the current source/pass origin, but supplies no demonstrated source spelling that obtains the retail order.

## Exact input and accepted-owner authentication

The source is current guarded-dedup `5BF6ACF3CEF8F4A229AA143CCEB76376AC333B455BB1EDA18E9296476D791FD3`, expanded input `08561F8CD28616666538499F3F86CD3BB4A58D38B608DB0872742DFF5DCC375D`. The production source bytes and R1 frozen expanded/compiler/object artifacts authenticate against `func_0020DB10.raw-evidence.json`; their copies are in R. Compiler assembly is `3EA53AF7335AD6FDDD111F06437FD03849B8E661CAB01607BED5B91254A48E26`; raw object is `2AA78DFBA2C8111C88AE6ED8AC4B3D1E83C2B2605A8D05B550253ECF083A1BEC`; accepted-size raw text is `EF516D64BE984BA8EB8EA1C5E89BCBF050DCF988EE36F9DFBD6C379D5793C911`.

Current ordinary passes, authored/expanded inputs, compiler commands and assemblies are copied from the accepted DB10 trace's guarded-dedup package. Each selected file authenticates against that package's manifest `9D5DA4FFBB47C1060F36C3F8714FEA4E81EA2D6B1BBE1A5B4E1CC3541B18A81F`. Retained trace assembly equals pinned assembly after the exact `-da` options-comment delta. Pinned trace-package assembly equals retained production assembly after `.file` and comment lines are excluded. No invocation was repeated.

The original assembly owner `asm/original/rev0/lib/func_0020DB10.s` contains exactly 5548 bytes, every word equal to the canonical normalized ROM at `0x20DB10`. Full ROM SHA256 authenticates as `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`. `input-authentication.json`, `raw-evidence.json` and `instructions.json` bind these checks and record the actual object section and relocation rows. This is accepted-owner reference use, not a new structural claim.

The older A2CF focused linked result was not used as current evidence. The prior 93-input allocation survey was not repeated. R2's report was used to delimit already-failed source classes, not to substitute their inputs for this one.

## Instruction and value correspondence

The shared preceding anchor at `0x11D0` is `bne v0,zero,0x980`, exiting the second five-slot processing loop when not taken. Its delay slot at `0x11D4` clears `s2` (`count`). Both then clear `s7` (`sortOffset`) at `0x11D8`. The shared following loop-head anchor at `0x11F4`–`0x11F8` loads `D_801CE8BC`, followed by scene-plus-sortOffset and field `0x20C` load, then the actor-present branch at `0x1204`. These block anchors identify the region independently of a global mismatch score.

| Owner offset | Current candidate | Retail |
| --- | --- | --- |
| `0x11DC` | `move s3,zero` | `addiu s6,sp,0x18` |
| `0x11E0` | `addiu s6,sp,0x18` | `addiu t3,sp,0x5C` |
| `0x11E4` | `addiu t3,sp,0x5C` | `sw t3,0x1E4(sp)` |
| `0x11E8` | `sw t3,0x1E4(sp)` | `addiu t3,sp,0xA4` |
| `0x11EC` | `addiu t3,sp,0xA4` | `sw t3,0x1EC(sp)` |
| `0x11F0` | `sw t3,0x1EC(sp)` | `move s3,zero` |

The clear is `actorIndex = 0`, the outer 20-actor scan ordinal. It is not the inner dedup/insertion variable `index`, despite the historical shorthand “sort-index initialization.” The other five instructions establish `sources` base `sp+0x18` in `s6`, spill `contexts` base `sp+0x5C` to `sp+0x1E4`, and spill `resources` base `sp+0xA4` to `sp+0x1EC`, reusing `t3`. Arrays are declared at source lines 150–151; their 18-element, four-byte layouts explain the base separation. Uses in dedup/insertion and submission establish the source associations.

No actual relocation lies in these six words. The immediately following candidate zero-valued `lui/lw` operands at `0x11F4/0x11F8` carry actual HI16/LO16 relocations to `D_801CE8BC`; they are not additional initialization-value mismatches. `instructions.json` annotates every word in the larger `0x11C0`–`0x1230` anchor window and records all text relocation positions.

Frame552 versus retail560 remains a separate unresolved issue. Array pointer homes here already equal retail `0x1E4/0x1EC`; the six-word region does not exhibit an eight-byte offset discrepancy, missing operation, extra allocation, or register-allocation mismatch. Entry/exit saved-register offsets elsewhere are outside this locating conclusion. Nothing here identifies the missing frame space's role.

## Current source and earliest retained pass

Current source lines 324–329 initialize `count`, then `sortOffset`, then `actorIndex`, followed by `while (actorIndex < 20)`. The three base expressions are compiler-generated from real accesses within this loop; the authored source has no explicit base-pointer setup statements at the preheader.

| Value / operation | Current pass identity | Origin and progression |
| --- | --- | --- |
| `count = 0` | UID2639, pseudo84 → `s2` | Initial RTL; eventually placed in prior branch delay slot |
| `sortOffset = 0` | UID2644, pseudo792 → `s7` | Initial RTL; remains before the six-word region |
| `actorIndex = 0` | UID2647, pseudo85 → `s3` | Initial RTL before loop entry; remains before generated base setup |
| `sources` base | CSE UID3452, pseudo991; loop UID3637 → `s6` | CSE has `fp+24` in the loop body for `sources[index]`; `.loop` places the base before loop-head label2656 but after UID2647 |
| `contexts` base | initial UID2904, pseudo861; loop UID3638 → `t3` and spill | Initial RTL virtual local base plus68; CSE materializes `fp+92` in shift-body access; `.loop` places it after UID3637 |
| `resources` base | initial UID2923, pseudo870; loop UID3639 → `t3` and spill | Initial RTL virtual local base plus140; CSE materializes `fp+164`; `.loop` places it after UID3638 |

Thus initial RTL already places the counter initialization before the loop, but does not yet contain the eventual adjacent preheader base operations. CSE still has the base definitions in body access sequences. **`.loop` is the earliest retained pass showing the particular adjacent ordering at issue:** UID2647, then new UIDs3637/3638/3639, then loop-begin note2649 and label2656. This is an observation of this candidate's dumps, not an assertion about retail optimization history.

The order remains in `.cse2`, `.flow`, `.combine`, `.sched`, `.lreg`, `.greg`, `.sched2` and `.dbr`. During the retained reload/global-allocation output, stores UID3731 and UID3734 follow the two `t3` base computations. The final sequence is UID2647,3637,3638,3731,3639,3734, matching the six native instructions. Exact selected blocks and initialization windows from every relevant current pass are in `passes.json`; complete authenticated passes remain in `current/`. Parsing is restricted to `func_0020DB10` and preserves instruction mode annotations.

## Bounded handback and missing observation

No justified new source spelling is established by this read-only result. Moving named bases before `actorIndex` in C is an obvious hypothesis, but R1 already records the failed named-sort-bases control (different extent/frame and an accessed spill); R2 records that corresponding allocation-preserving controls retain the unwanted order. It would be misleading to present that unchanged class as a new untested lead. Likewise, the R2 scoped unsigned `index` controls concern the inner search index and remove the resource spill; their name must not be confused with this outer `actorIndex` clear.

The precise missing observation is a readable, operation-preserving source arrangement that makes the three actual base definitions precede UID2647's clear in the optimized preheader while retaining the current loop/control values and pointer allocation. The retained evidence shows where this ordering first becomes adjacent and that late scheduling does not repair it; it does not show a source transformation that changes that insertion order while preserving the rest of the function. A future source trial should inspect the first `.loop` preheader, then verify the six emitted operations and unchanged block anchors, separately from frame/home measurements. There is no evidence here for padding, artificial dependencies, a compiler exception, generic compiler defect, or an impossible source match.

This locating result requires no new ordinary matching-review gate and establishes no matching acceptance or new reusable compiler/semantic/structural claim. The production owner retains source/build ownership and all normal completed-wave gates. All fourteen W8 targets and their single final verifier, later families and no-push direction remain intact.

`locate.js` records authentication, read-only decoding and pass extraction. `checks.json` confirms the six-word multiset and assembly agreements; `manifest.json` binds the task-local evidence apart from itself. The evidence and report are frozen at release; all writes are released. The separately frozen 7ADC guided search and its ongoing review were not altered.
