# Combat draw 7ADC row allocation preparation r1

Completed bounded assistance. Both reported format-1 register mismatches first appear in local allocation, after earlier copy simplification. The values have overlapping lifetimes and require distinct storage. The Director should route this evidence to the matcher. No supported nonduplicate source discriminator is proposed.

Launch COMBAT-DRAW-7ADC-ROW-ALLOCATION-PREPARATION-20260907-01; receiver /root/boot_conversion_preparation; Director /root, native 01a07262-aeca-7341-ad10-2dba705ff988; local; Astra Medium. Ready af99ab61ba5f81ffa09af66fc9b063900862b2a3; activation 793bdac872f507328c680198752cc0eae2269beb. Coordination baseline is d37ff1046e0451b65fe45f685b092eceff1ee2a1; accepted source is W7 469a1416918592749d61dc34e3e079796f7b673c. The complete fresh claim was created atomically and read back before other writes. Unchanged required guides were reused from the continuing context.

## Authentication and applicability

inputs.json binds all 21 supplied files before interpretation, including all thirteen passes and diagnostic-command.json. The four candidate source/assembly hashes match the prompt. Complete offline macro expansion matches diagnostic candidate.c after excluding comments and whitespace. Emitted assembly matches after excluding comments and .file directives. Full-file comparison authenticated excluded portions without interpreting their operations.

All 950 original words match the W7 Git owner, derived aid and actual normalized ROM. The accepted extent remains 3,800 bytes; the following eight-byte owner was excluded. The previous complete-owner report and evidence hashes match the prompt. inputs.json records the original blob hash and both ROM hashes. Raw ROM SHA256 is 6CA0A1AFE224831E202857AD64EF26BD429A034A4EA48404BB09621641A07B12. In-memory normalized SHA256 is 571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A.

The reported 3,796 bytes, 368-byte frame and 190 native differences remain attributed diagnostic measurements. The reported four-byte tail-sharing deficit was not independently analyzed. No compiler, linked diff or verifier was run.

## Actual allocation units

A pseudo identifies a compiler value before hardware allocation. Hardware registers16/17/18/19 correspond to s0/s1/s2/s3. These numbers are not frame offsets.

| Assigned value | Retained source/value evidence | First hard-register assignment |
|---|---|---|
| Unmasked row prefix545 | UID1382 shifts the row value left2. Initial1384 copies545 to rowField540. | .lreg assigns545 to18/s2. |
| Masked rowField540 | UID1423 masks545 with4095. UID1493 uses540 in the F4 first-word value. | .lreg assigns540 to18/s2. |
| E600/F4 base575 | UID1466 reads the command cursor. After first CSE, the same base addresses the E600 words and the following F4 words. | .lreg assigns575 to17/s1. |

The relevant source has a format-1-local rowField declaration. Initial RTL preserves separate row-prefix545 and rowField540 values. First CSE changes the mask source to545. The redundant intermediate copy1384 survives through .cse2, then becomes NOTE_INSN_DELETED in .flow. The prefix545 dies at mask1423. Both units receive s2, consistent with their successive lifetimes; this does not establish an original source variable spelling.

Initial RTL gives E600 a scoped pointer574 copied from cursor load575. F4 initially has a separate cursor load579 and scoped pointer578. First CSE removes copies1472/1489 and the second cursor load1483. It rewrites F4 accesses to offsets8/12 from575. The E600 accesses stay at offsets0/4. Cursor advancement remains represented by base+8 and base+16 publications. This base unification precedes allocation; it is not a reload or late scheduling effect.

## Lifetimes, conflicts and stage boundaries

| Local metadata | rowField540 | Prefix545 | Packet base575 |
|---|---|---|---|
| Recorded references |15 |6 |21 |
| Recorded instruction span |55 |2 |28 |
| Basic block |45 |45 |45 |
| Crossed calls |3 |none stated |1 |
| Local assignment |18/s2 |18/s2 |17/s1 |

These counters are compiler metadata, not dynamic counts or an allocator priority formula. All three units are absent from the .greg global allocation list. Their .greg dispositions retain the local choices; later scheduling does not originate their registers.

rowField540 is already live when575 is loaded. Both remain necessary at UID1493, which reads rowField, and1495, which stores the F4 first word through575+8. The pointer survives the width-helper call1511 and dies at its final store1536. rowField survives that point. Its later final-use/death marker is1610. That marker was inspected only to bound rowField's lifetime; the shared F2 cursor-load schedule and tail expressions were not analyzed.

This establishes real interference between540 and575. They cannot occupy the same register across the observed overlapping lifetime. Prefix545 instead dies at1423 before the packet base starts, so its reuse with540 is a separate situation.

The first retained hardware assignment is .lreg. Before it, the units remain pseudos through .sched. In .greg and emitted assembly, rowField is s2 and the E600/F4 base is s1. The provided dumps do not expose a local interference matrix, per-quantity score, allocation-attempt sequence or rejection reason. A global conflict list for another unit cannot substitute for those missing local decisions. The evidence therefore identifies overlap and actual assignments, but not why the allocator chose s2/s1 rather than retail's s3/s2.

## Retail evidence

All addresses in this table are z64 ROM instruction offsets within the authenticated owner. The command-cursor symbol denotes RAM800E9BA0.

| Value | ROM offsets | Observed retail register/use |
|---|---|---|
| Shifted row |001F8558 |sll s3,s8,2 |
| Masked row |001F8598 |andi s3,s3,0xFFF |
| Third packet base |001F85A8..001F85AC |Load the cursor into s2. |
| Shared E600/F4 base advancement |001F85CC..001F85E4 |Publish base+8 and base+16 using s2. |
| F4 first word and packet writes |001F85E8..001F85F4 |Read rowField from s3; write E600 at0(s2), zero at4(s2), and F4 at8(s2). |

The retail instructions confirm the reported two-register shift. They also confirm a shared E600/F4 base, so the candidate's CSE base unification alone is not the mismatch. No statement here reconstructs retail compiler passes or its original local quantities.

## Evidence limit and release

No new discriminator is proposed. Sharing rowField across paths, a complete SIZE wrapper, payload wrappers and captured arguments already failed under the supplied observations. This frozen package provides no separate untested real-state lifetime boundary with a supported register prediction. Recommending another spelling of those controls would duplicate prior work. Exact local-allocation causation needs applicable local decision evidence beyond the supplied assignments and counters. No new compilation or package is requested by this report.

No artificial references, dummy homes, padding, volatile barriers, assembly or compiler exceptions are proposed. End-field arithmetic, shared F2-load scheduling, solved prefix/vertices and the preceding first-two-packet study remain excluded. The later row death was used only as a lifetime boundary.

Only the new claim/report/ignored root were written. W8 production, F580 preparation, held Resolver work and frozen records were preserved. No source/configuration/tooling edits, candidates, compiler/diff/verifier/source-policy operations, runtime/bridge/DB actions, Git mutations or agents occurred. All fourteen W8 targets and the single final complete-wave verifier remain required. This is ordinary assistance, not independent review or reusable compiler/semantic acceptance. All assigned writes are released at direct collaboration handoff; these records then remain frozen.

All 21 inputs rehashed unchanged before release. Output identities (SHA256); exact sizes are in outputs.json.

| Artifact | SHA256 |
|---|---|
| allocation.json | 6E7E3A0E95C4F02A5FC96058331876FC5ED00143FD797355D398CD44E94E43A6 |
| allocation.py | 6EF9CC5D8C7E19512C7DBBE7A854B37C2320EB249525D176478597A4C0732B28 |
| auth.py | A41D9A7A54A274592A5D42D9EF9FFA9030A531D15C895492110E81053D8CF6FB |
| comparability.json | D05B2E6A29D93AD7FE9B66CC72EA73D19532620DC6155D62B17827A0E2982B2E |
| finalize.py | 821E6099DBD9552152C70428CDF93D8C5047332823432D15C8716E277126D53C |
| inputs.json | 096802306590A48CA63C87845D87363B54548F2510E0824467CB8C3DEE6709EB |
| trace.py | 22046D9EA23CF6BF6D121E7300BF0D6DF7A8DB2F47CD9D8769C02ECB0C2FCCD5 |
| units.json | 419A2FF847B6C7CAB9AB3A8B633A3ACF9A163A8538B8C5F84EAE2F9E68F6987D |
| units.py | 9CB4408FF8BBDC7093792789269E91FEAB21A72A82C824B74E227DD0969B1C13 |
| outputs.json | 2FB7CFA62A7412C4690BC3CB1E6D8D9EEA4573EBAECC03790E2E703D3957378F |
