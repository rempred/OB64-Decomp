# 3C00 competing values

Completed read-only W8 support. Worker `/root/db10_allocation_trace`, Astra Medium; Director `/root`; activation `f414bcbc`, launch `COMBAT-3C00-COMPETING-VALUES-20260907-01`. Fresh claim was atomically created and read back before writes. All evidence is under ignored `build/combat-3c00-competing-values-r1/` (R). No compilation, source trial, production change or canonical verification ran.

The additional current `s3` competitor is **endField pseudo921**, the masked lower packet endpoint. It conflicts with packet row920 and occupies `s3` in all three candidates. Retail's corresponding companion endpoint uses `s2`, while the candidate's `s2` carries **tileOffset922**; retail's tile value uses `s7`. The problem involves these actual overlapping values, not just companion/u1/strip. The failed primary-row split additionally places geometry row116 in `s6` and header99 in `s5`, preserving a real obstacle to assigning companion to `s6`.

## Authentication and scope

All supplied source/input/analysis hashes were checked before interpretation:

| Trace directory | Source SHA256 | Expanded input SHA256 |
| --- | --- | --- |
| distinct-cursor-full-tile (current) | `7F823700DD804DF6C261FC1BBD665BA3B5DA91DBCE0CB4A34F659A70079BE7DF` | `19D903BD6959C0939EAA93F71673E192A81998BA18C2734D15D3216D2ABFBABD` |
| companion-null-at-capacity | `93420A0F14551CDB27A9B5F9E3C5B7BE934B1FA13E43BCB4F4D0C20EA2D31C1A` | `2508C0516F23F83941F387A04D5E500A564878169F162898E84D012B44A060DE` |
| primary-row-after-shortened-companion | `E209C13BE196D87901ADAFCFC515208432FB8012AB0910B50A5D83D5F363A1E9` | `265DC83A06FD70099AE9BB0561CDF65EA6CB94BDB8C9CADFF971979A245EAE47` |

Their analysis hashes are respectively `FFF0CDCF35BAB3E5CF571911D6B50762DC05BECBEA81E4D464462C4C0B75248E`, `9B56B3FCAF9A0DD060F6D6BF29C1D24324CDBD07CCB32671F6F89D3251352907`, and `237A60E4DD36B50966C11D80B98029F7C747C52B844EFA2DDE4C010FEAA1909B`. Each recorded pinned assembly hash was checked, and existing trace assembly equals pinned assembly after only the exact `-da` options-comment difference. Recorded pinned commands have successful status and authenticate the executable as `F3F1C99A322F5B3D8C108C2A44AF1D6D084DD27575C5D60BF0F0D33FFF34B1C6`; no invocation was repeated. `authentication.json` binds all copied files.

The original assembly hash `C31BB4824DF0178D65383897F956F802C0C7CAD14245FD0A74BAB99F5C42C85B`, frozen retail text `CF1895D24E0D41D92D2C1B15CC9736253A7DD4CFD34F6882CCE21A79BE36136C`, and retail binary `458A6CB397B154CCC0CBE12CAEF4456A711C676E6B269F32A8DEE2490522925A` all authenticate. Every original assembly word equals the 6740-byte retail binary. Retail offsets below are relative to accepted ROM `0x1F3C00`, runtime `0x801B0770`. The older D589 candidate was not treated as current.

## Complete relevant register arrangement

Numbers identify candidate pseudos only. G means listed in the candidate's global allocation order; L means the specific local assignment is recorded. Register names are final candidate dispositions at the corresponding uses, not claims about allocator decision events.

| Real value | Current | Delayed companion null | Delayed null + separate primary row | Retail corresponding use |
| --- | --- | --- | --- | --- |
| primary header pointer99 | G `s4` | G `s4` | G `s5` | `s4` |
| companion pointer100 | G `s8` | G `s7` | G `s7` | `s6` |
| u0 HI113 before narrowing | G `s3` | G `s3` | G `s3` | `s3` |
| u1 HI114 before narrowing | G `s6` | G `s6` | G `s4` | `s7` |
| strip115 | G `s7` | G `s8` | G `s8` | `s8` |
| geometry row116 | G `s5` | G `s5` | G `s6` | `s5` |
| companion packet row920 | G `s6` | G `s6` | G `s4` | `s3` |
| primary packet row | same920 `s6` | same920 `s6` | L923 `s2` | `s3`, newly formed value |
| packed endField921 | G `s3` across companion/primary definitions | same | same | companion endpoint `s2`; new primary endpoint `s0` |
| tileOffset922 | G `s2` | G `s2` | G `s2` | `s7` at companion tile construction |
| companion sync/render command pointer | G923 `s0` | same | G924 `s0` | `s1` at matched sync/tile stores |
| companion size-command cursor | G924 `s1` | same | G925 `s1` | `s0` at shared size stores |

These last cursor identities are source values at the companion sequence; registers can be reused for other commands later. The table does not assert one retail variable per hardware register across the whole function.

## Definitions, uses and span evidence

`value-map.json` in each copied directory contains exact initial RTL and all selected ordinary pass references, complete `.greg` conflict records and register dispositions. `reference-spans.json` lists definitions and blocks that contain references; these are reference blocks, not a fabricated event-time interference trace. `selected-blocks.txt` preserves relevant flow block headers/live-in sets. Counts in the following table use **`.lreg`**, which is the later snapshot used in the supplied allocation discussion; `.flow` counts are separately retained and sometimes differ.

| Value | Definition/use anchors (current unless stated) | `.lreg` refs / live length / crossed calls |
| --- | --- | --- |
| header99 | UID1544 assigns image to header; header WIDTH/height/format uses continue into primary packets | 66 /637 /35; split control638 |
| companion100 | current null UID1097 in block36; controls null UID1559 in block68; actual companion address UID1577; later format/width loads | current52 /794 /50; controls52 /632 /35 |
| u0/u1 113/114 | branches define113 at1784/1793,114 at1786/1801; narrowing refs1914/1924 before vertex loop | 113:6 /48 /2;114:6 /51 /2 |
| strip115 | copy capacity1892, cap to remaining1898, later update3454; geometry/endpoint expressions and row-loop control | 40 /535 /30 |
| geometry row116 | zero1902 or remaining-strip1908; feeds vertex row coordinates, rowField and endField; updates3416/3428/3432 after packet work | 46 /524 /30; two deaths in lreg |
| rowField920 | `(row*4)&4095`: defs2713/2946 in companion format branches,3193 in primary; first command and size-row stores consume it | current/control16 /153 /6, two deaths; split10 /102 /4, one death |
| endField921 | `((row+strip-1)*4)&4095`: defs2752/2985 in companion branches,3257 in primary; companion final payload3098 and primary sizeEnd3371 consume it | 16 /111 /5, two deaths, all three candidates |
| tileOffset922 | masked tileBytes/8 at2672 in zero-format path; prefixed value2905/3053 in nonzero path; used in subsequent tile word | 12 /102 /4, two deaths |
| split primaryRow923 | definition3193 and primary packet/size row uses only, flow block104 | 6 /41 /2; one death; local `s2` |

Companion packet row/end definitions and uses occupy flow blocks98 and101, then shared transition/primary block104. end921 retains that multi-block arrangement in the split-row control. The separate primaryRow is genuinely block104-local, while companion row920 still has a use in block104 at the shared companion size store, so it is not confined to one format block. Geometry row is referenced in blocks85/86, vertex blocks89/90, packet blocks98/101/104, then update blocks107/108. It therefore remains available after packet-row calculation, not merely as a dead precursor.

The global-order ranks (one-based within the printed candidate list) expose the observed arrangement without inventing priorities: current end92135, geometry11640, row92041, strip11544, tile92245, companion10046, u1-11451. Delayed-null companion rises to42, before strip45; end/row positions remain35/41. Split-primary-row has end35, geometry40, companion41, strip44, tile45, companion-row47 and u1-11451; primaryRow923 is absent from that global list and explicitly local. These are printed order facts; no new preference-score computation or causal rule is asserted.

## Real conflicts, sharing and additional competitors

The recorded conflict sets establish pairwise conflict among header99, companion100, strip115, geometry row116, packet row920, packed end921 and tileOffset922. They cannot share one register while preserving these candidate live ranges. The selected companion command/cursor values also conflict with packet row/end at their overlapping stores, occupying `s0/s1` in the current candidate. `conflicts-and-prior.json` preserves the reduced conflict submatrix; full sets remain in each value map.

The specific `s3` obstacle is end921, not the earlier u0 value. Both current u0 and end921 eventually use `s3`, but u0 has no recorded conflict with packet row or the later end value. u0 has already been narrowed into stored `leftU` before packet construction. Similarly u1 has no conflict with packet row920, so the observed sharing `u1/row = s6` (or split control `s4`) is compatible with those intervals. u1 **does** conflict with companion, strip and geometry row because its narrowing still overlaps their setup.

To place packet row in retail's `s3` under the unchanged candidate allocation would collide with end921, which remains live from its load-packet definition through the companion size payload and is later redefined/used in primary packets. Moving that end to retail's companion `s2` would in turn collide with tileOffset922 during companion tail construction. Current tileOffset cannot move to `s7` without addressing strip115 there. These are candidate conflict correspondences, not proof of a unique necessary allocator sequence.

The failed split-primary-row case identifies the next actual occupant instead of saying that another value took a freed register: geometry row116 uses `s6`, remains live for `(row+strip-1)` and later row updates, and conflicts with companion100. Header99 meanwhile uses `s5` and conflicts with geometry row. Splitting packet row did not eliminate these live requirements or assign companion to `s6`. No conclusion that this is an inherent source conflict follows; different source values/lifetimes may lead to another representation.

## Retail instruction-derived values and transitions

Retail null initialization at `0x099C` sets companion `s6` to zero; capacity-region instructions later form and consume its actual pointer. This does not reveal a retail pseudo or global/local classification.

Retail u0 is in `s3` at `0x0F08/0x0F14`; u1 is in `s7` at `0x0F10/0x0F18`. Their sign-extension/store sequences at `0x1004`–`0x100C` and `0x1020`–`0x1028` finish these scalar uses before the packet phase. Retail strip is `s8` at `0x0FB4`–`0x0FD0`, geometry row is `s5` at `0x0FE0/0x0FE8`. Both remain used in later endpoint arithmetic, including `0x14F0` and `0x17F0`.

At companion load setup, `0x14BC/0x14C0` compute `(s5<<2)&4095` into packet-row `s3`, used in the command first word at `0x14C8/0x14D0`. Companion pointer `s6` provides WIDTH arguments at `0x14D4/0x14DC`, surrounding call `0x14D8`. The following `0x14F0`–`0x14FC` compute `(s5+s8-1)*4 &4095` into companion-end `s2`, consumed at `0x150C/0x1514`. Row and end are now simultaneously needed across later WIDTH calls.

The companion tile value is distinct: zero-format construction uses `s7` at `0x156C/0x1574`; the nonzero path explicitly forms the prefixed value into `s7` at `0x15F8` and consumes it in final tile word `0x16D4`. Its old u1 interpretation is no longer live at these uses. This is instruction-derived register reuse, not identification of original C variables.

At the companion-to-primary transition, retail uses the companion row at `0x16F0/0x16F4`, then immediately begins a new row value in the same `s3`: shift at the companion WIDTH call's delay slot `0x1704`, mask at the primary WIDTH call's delay slot `0x1740`. The old companion-end `s2` has its final shown payload use at `0x1718/0x171C`; later `s2` is reused for a primary command cursor at `0x1794/0x1798`. A **newly computed** primary endpoint is formed into `s0` by `0x17F0` and `0x1804`–`0x180C`, used in the primary load payload and retained through final size payload `0x18BC`–`0x18C8`. Primary row `s3` survives through `0x1898/0x189C`.

These distinct retail definitions/use intervals support considering separate companion/primary endpoint states. They do not prove that retail C used two variables, nor that a split must allocate them locally. The candidate shares pseudo921 across corresponding endpoint definitions; retail simply provides separate physical value histories in `s2` then `s0`. No retail allocation priority or conflict table was invented.

## Prior controls and bounded source question

R2's recorded u1 deferred-narrowing, item-local u1 and early-rightU controls have already tested those classes. The early-rightU form moves u1 to `s2` but leaves the companion/strip issue; the two supplied null/row controls also remain failed candidates. Repeating those unchanged is not proposed.

A targeted R1/R2 source/name check found an older **shared-primary-end-state** control. Its source routes primary endpoint through shared `sizeEnd`, also changes the optional branch and common final store arrangement, and uses the older companion packet expressions rather than current explicit shared companion tail, independent cursor and full-tile state. R1 records6712 bytes/360 native differences and calls it over-shared. **direct-row-end-fields** broadly removes named row and endpoint states. **primary-int-field** separates row, not end. Those exact older sources are copied and hashed in `conflicts-and-prior.json`; their output is not reassigned to current7F823.

The bounded remaining question is narrower: on exact current7F823 with its **original null initialization**, unchanged optional path/shared tail/cursors/tile value, can a distinct block-local **primary packed endpoint** run from the existing primary load-packet definition to the existing final `sizeEnd = ...` assignment, while companion `endField` ends after its actual companion payload use? Keep current packet row unchanged. This tests the concrete s3 competitor and the retail companion-end→primary-end lifetime break, rather than redoing the failed primary-row split or reusing shared `sizeEnd` across more paths. No new operation, artificial reference or barrier is justified.

This is untested in the exact current context among the inspected controls, not an exhaustive assertion about every historical spelling. The source owner must check any additional private trial notes before trying it. There is no guarantee that it gives packet row `s3`, moves tileOffset to `s7`, or repairs the companion/u1/strip arrangement; all competing values above must be measured again. If the compiler reunifies the endpoint values or preserves the same conflicting order, that exact pass transition would be the next missing observation.

## Release and limits

All three candidates retain their recorded504-byte frame and failed native comparison status; this task establishes no matching acceptance or new extent/relocation proof. Analysis is grounded in authenticated source/passes/assembly and accepted retail references, not a new generic compiler-cause, semantic or structural claim. No independent ordinary matching-review gate is added.

`locate.js` records authentication and allocation/reference extraction; `spans.js` maps reference blocks; `finish.js` records executable/retail checks and the final manifest. Complete copied passes and source remain reviewable. At completion the report/evidence are frozen and all writes released. Production/tooling/configuration/compiler identities, accepted ownership/linkage, Resolver/runtime and Git were untouched. All fourteen W8 targets, one final complete-wave verifier, later families and no-push direction remain intact.
