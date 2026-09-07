# D14C preserved diagnostics — completed, causal interpretation review pending

Task `combat-d14c-preserved-diagnostics` r1; launch `COMBAT-D14C-PRESERVED-DIAGNOSTICS-20260907-01`. Worker `/root/compilation_groups_design`, Astra Medium, local; Director `/root`, native task `01a07262-aeca-7341-ad10-2dba705ff988`. Complete claim created atomically and read back before evidence writes at `2026-09-07T01:31:35.6899757-04:00`. Starting main was `0acd2dfe9963b6d33f83fafef4a4d27b96afda64`; accepted source baseline remains `0e1191013aeebed2929c9caff7c1f139169ad7f3`. Provisional Combat W7 files were excluded.

## Result and limits

The preserved E07/P03 evidence distinguishes two discrepancies in the final excluded-entry loop. Its cursor-relative address form exists in initial RTL, before allocation or scheduling: this discrepancy cannot have been introduced solely by a final allocator or scheduler. Separately, its final-loop index acquires hard register s3 during global allocation, whereas retail uses s5. This identifies the stage at which the register choice materializes, not the upstream reason that allocation chooses it.

The address discrepancy is not evidence of a missing memory operation: retail advances a cursor initialized to sp+40 and loads at cursor+152; E07 advances one initialized to sp+192 and loads at cursor+0. Both select frame-relative slot 192+4i for corresponding iterations. Since complete frame sizes differ, this is a correspondence of local slot roles in their respective frames, not an assertion of identical absolute runtime addresses. No concrete missing branch or call was found in this bounded region. This does not prove whole-function semantic equivalence or exclude earlier source/control-flow differences.

E07 remains nonmatching: preserved report text is 6,744 bytes versus the complete 6,844-byte owner, frame 576 versus 616, and rawExactBytes false. Neither deficit is explained by this local finding. No source repair, semantic name, structural change or matching acceptance is established.

## Inputs and method

Read the governing guides, sequential program, assignment and frozen retry preparation. The preparation at `4daf5cd` retains report SHA-256 `26C6BAE4FFAC8FDAB6FE5982FAFD92EE3C9A97BAE8E3DF29D955D79ADB1035CB` and input-manifest SHA-256 `787FF01F9B50FBA493B189FFF9FB139F16629DDD59824FF49C9C56A9634F2288`; both matched.

Historical artifact root is `../high-attack-wave-5/build/matching/`. E07 run root is `runs/3E7D083FC2A6606EC8A9CAD42524DA84E9985CEDDC7DAD002781B039D1CE8E64/`. P03 root is `targets/func_0022D14C/probes/0F97294BD42563E766A0AC830133FDADF7F99F6D13E081E22582CF2EFB002DD8/`. These are preserved project artifacts; no external decomp source was consulted.

| Input | SHA-256 |
|---|---|
| E07 workbench-report.json | `40622E763E3C0F692DBAC6710EA296C50307F8EC072CF6052D006F2AF31B830A` |
| P03 probe-report.json | `9B32A54B830CF0BFFAADC28F3AA389DF06A6F6E8354257CA53BAF2C827EF3E05` |
| P03 func_0022D14C.c | `78DD9D9325EC0AD875768041E9517A7D224D92F947B68C7DEE4D15CD922986E4` |
| P03 func_0022D14C.s | `1F01D9A749E88AF7AEC1BCCC756FA7E142220B6F763A27D5B214F06236C05B8F` |
| E07 candidate.compiler.s | `EE864AF7870F2560A0C239565ACD9C6A57289C15A403AE7158CDF0BEA60CAD22` |
| Canonical asm/original/rev0/lib/func_0022D14C.s | `EF14D6581AE474F7ABA21C09568FDFA0C69AEBAC234C09A9EF90D573AE14A8D3` |
| P03 initial .rtl | `1EA3EC0D0CA53B84F669839BB09C72AE949F1A5295B7CB4AABAC6AC5B6F39ABE` |
| P03 .cse | `13087B00B8747675CF2FCEC5C1A413CA0A306723BED4D778C9C4F3D6BB64C748` |
| P03 .lreg | `BC22248966357CA4D2E87F01AC2FF56EC4AF59C857CA4DA6BBC3C1C213E60D48` |
| P03 .greg | `DC7BF4851387CB221C9CF4DB76548CD9B0F133530B86FC65E1EEC875BA6939FF` |

Task-local `build/combat-d14c-preserved-diagnostics-r1/analyze.js` hashes 19 inputs and asserts all thirteen dump hashes against P03's manifest: rtl, jump, cse, loop, cse2, flow, combine, sched, lreg, greg, sched2, jump2 and dbr. It checks source equality to P03's embedded sourceText. P03 assembly and E07 compiler assembly differ only in the .file directive and compiler command comment containing dump options; all remaining instruction/directive text is identical after newline normalization. This connects the diagnostic dumps to E07's instruction stream without assembling anything. It is diagnostic correspondence, not a new acceptance proof.

The parser decodes selected words from E07's preserved base64 objectText and original .word records, and checks call relocations. It asserts the original has 1,711 words covering exactly ROM `[0x0022D14C,0x0022EC08)`, 6,844 bytes. Native entry is loaded at 0x801E9E7C under the accepted loader placement; ROM addresses below are taken from owner records and instructions decoded independently of stale PC comments. No new ROM measurement occurred.

Historical P03 records compiler SHA-256 `F3F1C99A322F5B3D8C108C2A44AF1D6D084DD27575C5D60BF0F0D33FFF34B1C6`. This task authenticates retained file identities, not current compiler availability or reproducibility. P03 and E07 reports are not acceptance-eligible.

## Explicit later-region correspondence

The region follows an event-0x20 call and starts with func_0020BFE4. Both forms skip the loop if that helper returns zero or local count sp+0x1CC is nonpositive. The loop starts with index zero, makes three rand calls, combines shifted random values (shift18/mask0x0C000000, shift15, OR), computes unsigned remainder6 using 0xAAAAAAAB, and adds the pointed base. It calls func_0021D230 with event0x2F and argument 0xFF, stores returned value+10 at selected object+0x94, reloads that value to maintain the local maximum at sp+0x16C, advances index/cursor, and repeats while index<count. The exit stores the maximum through the output pointer at sp+0x15C. These constant/call/dataflow anchors establish the correspondence; numerical similarity or E39 agreement is not used.

Candidate coordinates below are function-relative .text offsets; native coordinates are z64 ROM addresses. They are deliberately not aligned by equal offsets.

| Operation | Retail ROM | E07 .text |
|---|---|---|
| func_0020BFE4 call | 0x22EAFC | 0x194C |
| Zero-return guard | 0x22EB04 -> 0x22EBC8 | 0x1954 -> 0x1A18 |
| Nonpositive-count guard | 0x22EB10 -> 0x22EBC8 | 0x1960 -> 0x1A18 |
| Cursor initializer | 0x22EB24: s2=sp+40 | 0x1968: s2=sp+192 |
| Three rand calls | 0x22EB28 / 30 / 38 | 0x1978 / 1980 / 1988 |
| Load selected entry into a2 | 0x22EB60: 152(s2) | 0x19B0: 0(s2) |
| func_0021D230 event call | 0x22EB88 | 0x19D8 |
| Reload selected entry for store/read | 0x22EB90 / 9C: 152(s2) | 0x19E0 / 19EC: 0(s2) |
| Increment loop index | 0x22EBB8: s5++ | 0x1A08: s3++ |
| Back edge | 0x22EBC0 -> 0x22EB28 | 0x1A10 -> 0x1978 |
| Cursor advance in delay slot | 0x22EBC4: s2+=4 | 0x1A14: s2+=4 |
| Exit maximum store sequence | 0x22EBC8..D4 | 0x1A18..24 |

Retail cursor initializer word is 0x27B20028; its three selected-entry loads are 0x8E460098, 0x8E420098, 0x8E420098. E07 uses 0x27B200C0 and corresponding zero-displacement loads. Retail index increment is 0x26B50001; E07 is 0x26730001. Candidate call identities are supplied by its R_MIPS_26 relocations, not unrelocated JAL address bits. Other differences include constant-register assignment (retail mask s4/multiplier s3; candidate mask s5/multiplier s4) and nearby load ordering. This report does not claim to explain every difference.

## Pass-local discrimination

P03 source explicitly initializes its final cursor from prefix.excluded and increments it. The candidate aggregate contains LocalPacket, six s32 buffer elements, then six excluded pointers; excluded begins at aggregate offset152. This is candidate source expression evidence, not recovery of an original C type.

| Fact / stable UID | Initial RTL | CSE | Local allocation | Global allocation / final |
|---|---|---|---|---|
| Cursor initialization 4367 | .rtl:10583, pseudo112=pseudo69+152 | .cse:10198, pseudo112=fp+192 | .lreg:13230 retains fp+192 | .greg:11619, s2=sp+192; .dbr:11606 retains it |
| Entry load 4416 | .rtl:10731, a2=mem(pseudo112), no displacement | .cse:10344 retains it | .lreg:13342 retains it | .greg:11731 and .dbr:11727 use mem(s2), no displacement |
| Index increment 4445 | .rtl:10794, pseudo176+=1 | .cse:10408 retains pseudo176 | .lreg:13478 still pseudo176 | .greg:11882 and .dbr:11882 use hard19/s3 |

Line numbers refer to the exact P03 dump files named above. The greg allocation record at line182 explicitly says `176 in 19`; line173 assigns `112 in 18`. Earlier sched/loop dumps also retain these pseudo operand forms. UID4367 is still present after reload, marked insn:QI; the offline parser accounts for that annotation.

The zero-displacement load already exists at the earliest retained RTL. CSE exposes the stack-relative initializer192 but does not introduce the zero displacement. The most precise supported stage statement is therefore: candidate source expansion already supplies a cursor-to-entry representation; the final allocator/scheduler is not its origin. Without original compiler intermediates, no claim is possible about which pass produced retail's alternative representation.

For the separate index-register discrepancy, lreg-to-greg localizes the concrete hard-register assignment. It does not establish an allocator defect or prove that a register-priority change would repair the function: source lifetime, control flow and first scheduling can influence the allocation input. Pseudo176 here is the final-loop index, not the earlier pseudo179 investigated by E39/E40. That study was not repeated.

## Competing explanations and falsifiable next action

A late scheduling-only explanation for the cursor displacement is contradicted by initial RTL. A different address representation is supported. A different local memory operation is not supported by the corresponding affine addresses and load/store roles. Missing whole-function source or control flow remains possible outside this bounded loop. A global-allocation choice is directly observed for the index, but its upstream cause remains unresolved.

No required pass dump is missing for these stage-local conclusions. The precise causal gap is a controlled comparison that changes the address expression while preserving defined object accesses, plus its early-pass output; preserved E07/P03 is one source point, not an intervention. Original compiler intermediates are also absent, so the retail compiler's historical transformation path is unknown.

After separate authorization, a narrow experiment could test one ordinary, defined aggregate-relative formulation of this final loop while preserving operations, order and the complete owner. Its hypothesis is that the selected entry can remain represented as aggregate base plus the excluded-field displacement through initial RTL/CSE. Require an in-bounds object model before writing or compiling a variant; no invalid pointer arithmetic, fabricated storage, register binding or tool exception is proposed. If CSE canonicalizes it back to the same advanced-cursor form, that proposed formulation is falsified as a means of changing this discrepancy. If the address form changes, inspect whether index allocation changes independently; do not simultaneously add lifetime/priority interventions. Earlier-region drift or altered calls/accesses invalidates the control. This is a proposed test, not a recipe known to work and not permission to activate a candidate.

## Preserved gates and completion

D14C remains the complete 6,844-byte owner. Its separate auxiliary ownership gate remains: accepted shared-table preparation can retain the middle 64 bytes as assembly between B06C and EF50; five entries, four alignment bytes and ten entries in a placement proxy do not establish exact D14C C. Future activation must resolve that interior ownership without overlap under the separate structural assignment/audit/review. No new tooling limitation is demonstrated here.

All seventeen shared W6 owners remain: func_0022A280, func_0022A414, func_0022A4E0, func_0022A7B8, func_0022A964, func_0022ADFC, func_0022B06C, func_0022B1F4, func_0022BFF8, func_0022C78C, func_0022D14C, func_0022EC08, func_0022EDD4, func_0022EF50, func_0022F2BC, func_0022257C and func_00222604. High Attack W5's complete eight including B438/B894 remain preceding obligations; its seven-member W7 and fifteen-member W8 including func_0021EAF0 remain later obligations. Combat's active W7 and remaining W8 and shared prerequisites remain intact. This diagnostic does not replace a wave or authorize concurrent production.

Offline parser assertions passed for input hashes, source/assembly correspondence, owner extent, selected words, relocations and stage facts. Its initial attempt assumed objectText was an object; correcting that task-local parser to read the actual base64 string resolved the failure without compiling. A bounded extraction fix recognizes annotated insn records. A broad frame-object display was truncated; the report uses scalar frame sizes already inspected. Read-only Git status produced inaccessible user-ignore/cache warnings; no index/ref mutation occurred. Other agents' production and documentation changes were preserved.

Final ignored evidence is `build/combat-d14c-preserved-diagnostics-r1/evidence.json`, SHA-256 `4F81BBF9542EE4651C3011DDCE6FA47BC4FBB97B410D064477C99EA3DF750FBB`; it includes the full 19-file identity manifest, thirteen authenticated pass excerpts, selected decoded native/candidate words and relocations. Only this report, its fresh claim, and the ignored parser/evidence were written. No candidate C, compiler, diff/build/verifier, runtime or production operation was performed. New causal interpretations are Supported, review pending. All assigned writes are released at terminal handoff.
