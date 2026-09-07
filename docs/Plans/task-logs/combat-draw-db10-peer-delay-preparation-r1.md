# DB10 peer-presence delay comparison r1

Completed bounded frozen A/B comparison. The earliest difference is already in initial RTL: A loads presence into a pseudo that it subsequently overwrites with the peer offset, below the presence branch; B computes a separate offset before loading presence. First scheduling moves B's load ahead of that independent offset. The first explicit **filled-versus-unfilled delay-slot result** is `.dbr`: B wraps each presence branch and its offset add in a SEQUENCE; A leaves all four branches unsequenced. This is not a late spill or a newly introduced no-op in initial RTL.

B fills the slots but uses a0 for the first two offsets and v1 for the last two, with corresponding peer results v1/a0. Retail uses v0 offset and v1 result at all four sites. Neither slot occupancy nor provisional total size establishes a retail match. No source recipe is proposed.

## Authentication and scope

Receiver `/root/boot_conversion_preparation`, Astra Medium; Director `/root`, local native `01a07262-aeca-7341-ad10-2dba705ff988`. Task `combat-draw-db10-peer-delay-preparation`, revision1; launch `COMBAT-DRAW-DB10-PEER-DELAY-PREPARATION-20260907-01`. Ready `75fd1fc0df8ba6e556f7d9aade6a6c9a96d2f51b`, activation `2520272babf36288494cd98bd1da9c05077f1a79`, coordination `e9974e113be503c3a46acbd5e209e35aadfd04d0`, accepted W7 `469a1416918592749d61dc34e3e079796f7b673c`. Complete fresh claim was created atomically and read back before evidence writes. Unchanged governing guides reused.

`evidence.json` binds 41 exact inputs: each control's authored C/production assembly and seventeen-file preprocessed diagnostic directory, the two frozen full-owner navigation records and accepted W7 original ASM. The four prescribed source/assembly hashes pass. Both pairs differ at exactly two lines: `.file` line1 and the line10 option comment's `-da`. All other lines agree, including instructions, labels, directives, frame and data; no broad executable-only filtering hides another difference.

Retained policy A binds authored SHA256 `F642ED3E73190DA8F38A3BFD1467B518BBF33B64A5A2603A2EA01931EC18A8CF` to expanded input `F26624E3BE39F7C6299021D1DFB4CC5E4F134AEC99753A97117A56C7E8519AB9` (26,092 bytes). B binds authored `3427A473CB32930A1371C8571393DB0D8D2467E195CC427C527342091EAEC966` to expansion `F4737AF637027DC4C1F0099BFB20665768067C602A42C5E2740F00BA768D82E7` (26,061 bytes). Both policies record PURE_C and empty dependency lists, authenticated external preprocessing settings and compiler association. These are retained records, not fresh source-policy acceptance. The corresponding self-contained candidate files match the recorded compilation-input hashes and sizes. Commands record the pinned cc1 path, prescribed optimization/MIPS flags with `-da`, status0 and empty stdout/stderr. No command was rerun. Recorded preprocessing provenance is stronger here than a bare filename; independent replay with original configuration/header state was not performed and is not silently supplied from mutable files.

Actual W7 original ASM hash `4493C58ABF102557B2E89D98021B18968903F706B3D983227497CD101379E2FE` passes. All 1,387 original words at ROM20DB10..20F0BC match the canonical ROM: raw SHA256 `6CA0A1AFE224831E202857AD64EF26BD429A034A4EA48404BB09621641A07B12`, normalized in memory `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`. No draft guard instruction or failed direct-unpreprocessed diagnostic was read or included. The frozen full-owner report/evidence hashes authenticate; only bounded peer-check navigation is reused. Earlier frame-control pseudo identities are not transferred.

## Four-site UID table

UIDs and pseudo numbers below are independently extracted from these controls. Each triple is **load / presence branch / offset add**. All constants0x20C and0x1C4 are the observed presence-field and record offsets, not new semantic field names.

| Check | Retail load / branch / delay add ROM | A UIDs; shared presence/offset pseudo | B UIDs; presence / offset pseudos | B final SEQUENCE UID |
|---|---|---|---|---|
| 1 | 20DF4C /20DF50 /20DF54 | 552 /553 /554; 253 | 553 /554 /552; 254 /253 | 3745 |
| 2 | 20E374 /20E378 /20E37C | 1152 /1153 /1154; 413 | 1153 /1154 /1152; 415 /414 | 3772 |
| 3 | 20E858 /20E85C /20E860 | 1846 /1847 /1848; 598 | 1847 /1848 /1846; 601 /600 | 3796 |
| 4 | 20EBE4 /20EBE8 /20EBEC | 2338 /2339 /2340; 734 | 2339 /2340 /2338; 738 /737 | 3818 |

Both authored `find_peer` bodies initialize peer to null and restrict the load using unsigned search<20. In A, the block's actorOffset variable first holds the loaded presence word; only if nonzero does the same variable become searchOffset+0x1C4. In B, actorOffset is computed first, then a distinct loaded predicate gates `peer=base+actorOffset`. The supplied expansion preserves that distinction. It is real state/control placement already in the initial compiler input, not a proposed new trial.

## Visible transitions and dependencies

| Stage | A | B |
|---|---|---|
| Initial `.rtl` | Load shared pseudo; branch tests it; fallthrough overwrites that pseudo with offset; result consumes new offset. | Offset definition; separate presence load; branch tests presence; fallthrough result consumes offset. |
| Through `.combine` | Same load→branch→offset ordering at all four sites. | Same offset→load→branch ordering at all four sites. |
| First `.sched` | Ordering remains unchanged. | Load moves before offset, giving load→offset→branch. Distinct predicate/offset pseudos permit the offset to sit between load and test. |
| `.lreg` | Selected load/offset pseudos remain pseudos. | Selected predicate/offset pseudos remain distinct pseudos. |
| `.greg` | Selected shared pseudos map to v0; result is v1. | Predicate maps to v0; offset maps to a0 for checks1/2 and v1 for3/4; peer result maps to v1/a0 respectively. |
| `.sched2`, `.jump2` | Load→branch→offset remains unsequenced. | Load→offset→branch remains unsequenced. |
| `.dbr` | Four presence branches still standalone; offset remains after branch. | Each branch and preceding offset becomes an explicit two-member SEQUENCE, listed above. |

For A, branch REG_DEAD marks the old predicate value dead; the following assignment creates the new offset value in the same pseudo. This is not an arithmetic dependence on the loaded word: the offset expression uses the independent searchOffset state. It is nevertheless a same-pseudo definition/use ordering constraint in the retained pre-allocation representation, with the offset on a different control-flow side of the branch. The result consumes the offset, with its later REG_DEAD note. Neither death note implies the downstream state may be arbitrarily moved to the other branch arm.

For B, offset survives across the presence load and branch until the result addition; presence is dead at the branch. Their independent definitions and overlapping values remain visible through scheduling. In the final SEQUENCE, the predicate is v0 and the offset destination is a different register. For example check1 has branch554 followed by offset552 setting a0 = a3+452 decimal, then result555 sets v1=t0+a0. The branch dependency list still records its predicate producer553; the metadata does not claim the offset computes presence. These observations account for why B presents a backward-movable independent instruction while A does not present that same instruction before its branch.

The authenticated pinned `reorg.c` backward-fill scan at2890..2945 checks that a moved instruction neither needs/sets resources changed after it nor sets resources needed by the branch. B's independent preceding offset is consistent with those criteria. A's preceding presence load defines the tested register; its offset is in fallthrough and cannot be selected by that backward scan. A later fallthrough/thread search has separate opposite-thread liveness, eligibility, trap and ownership requirements (`reorg.c:3275..3375`). No retained event log records which candidate was considered/rejected there, so this report does **not** assign A's unfilled result to one specific unobserved rejection. MIPS branch delay eligibility also has its own length/type conditions (`mips.md:125..128`). Source criteria are not an execution trace.

Inspected compiler files match source commit `43d1cdb67ed135879869b5266f01efaaada5e35a`, tree `bbed133c38a1feffafe941c36b20d3b38ba47a33`, after CRLF normalization. `compiler-reference.json` records actual/Git hashes and reauthenticates the recorded bootstrap association and deployed cc1 hash `F3F1C99A322F5B3D8C108C2A44AF1D6D084DD27575C5D60BF0F0D33FFF34B1C6`. No compiler execution, instrumentation or new scheduling model was performed.

## Emission, retail registers and joins

Retail has four actual words `addiu v0,a2,0x1C4` in the presence-branch delay slots, followed on fallthrough by `addu v1,a3,v0`. The zero-presence edge skips the result addition and joins the range-failure path at ROM20DF5C/20E384/20E868/20EBF4, where v1 is the nullable peer. The following branch has its own v0=0 delay instruction. Existing bit-8 polarity and subsequent enabled checks retain their respective paths.

A keeps the retail-like v0 offset/v1 result registers and corresponding peer joins, but its emitted presence branch is under assembler **reorder**, with no explicit GCC delay SEQUENCE. Its `.s` shows a `#nop` comment after the load; that comment is not an instruction. B emits explicit `.set noreorder` branch/add pairs, but shifts search/scan/base/offset register roles; in its last two checks, null initialization, result addition, peer-null test and peer field loads all use a0 rather than retail v1. A filled B slot is therefore not the retail register contract or a guarantee of correct surrounding byte-level joins.

The supplied A assembly does not literally print the four extra branch-delay nop instructions. Their assembled existence is the writer's reported measurement; the retained compiler evidence establishes unfilled branches emitted for assembler scheduling versus B's explicit filled pairs. No assembler/object/linked diff was run here. A5564 bytes versus B5536, both frame552, remain provisional measurements; the28-byte difference must not be attributed wholly to four slots or treated as acceptance. Other register/join differences remain.

Exact unresolved state: no per-attempt delay-filler log supplies scanned candidates, search direction/pass, actual resource sets, opposite-thread live registers, ownership/eligibility/trap decisions or later relaxation history. Likewise greg mappings are after allocation/reload, not an initial hard-register attempt trace. These gaps prevent a unique internal rejection or allocation-cause claim, not the observed stage comparison above.

## Delivery and release

`branch-stage-windows.json` covers all four checks through all thirteen stages; `assembly-windows.json` binds their emitted and retail neighborhoods. `evidence.json` preserves all input hashes and exact pair differences. `output-manifest.json` binds outputs and the terminal report/claim. No recipe, artificial reference, padding, volatile barrier, assembler escape or original-source spelling inference is proposed.

All fourteen W8 members and the single complete-wave verifier remain required. The sole writer's coordinate/counter/frame/band/token corrections were not investigated. This is ordinary matching assistance, not independent review or reusable compiler/semantic/structural acceptance. Only the assigned report/claim/ignored root was written; no source/compiler/build/verifier/runtime/database/Git mutation or agent action occurred. All unrelated W8, Resolver and frozen records are preserved. All assigned writes are released at terminal handoff.
