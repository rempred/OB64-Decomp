# angr trial independent references

Completed. Worker `/root/combat_draw_continuation`, Astra Medium; Director `/root`; activation `f964afe1`, launch `ANGR-TRIAL-REFERENCE-20260907-01`. Fresh claim was created atomically and read back. Production W8 work is paused with selected3C00 D037 and exact7ADC F3F90 preserved. No angr output has been inspected; no angr/m2c invocation, package installation, compilation or production edit is performed by this worker.

Reference questions are formed from original machine words, current C and accepted project records before trial answers. Expected edges, declarations and answers are comparison oracles, not minimal recovery inputs. Runtime values must come from accepted placement metadata; historical decode comments in original assembly can use older runtime mappings. Owner-relative offsets are hexadecimal throughout; these offsets and raw words are the stable references used here. Equivalent basic-block partitioning is allowed, but delay-slot execution and transfer destinations must agree.

## Hard case: func_00215CF0

The current problem is a PURE_C compiler-ordering blocker, not missing ownership or a broad unresolved dispatcher CFG. `combat-actor-retry-preparation-r1.md` supersedes the early incomplete dispatcher account: current accepted exact HYBRID_C has complete3400-byte owner,57 external call offsets and295 relocations. Two empty asm constraints preserve the desired owner-load-before-return-save ordering. Their existence prevents a PURE_C classification despite exact bytes.

Question: at each allocator call, identify the return value preserved into s0, the subsequent global owner load used as the next copy call's first argument, and their exact order. Do the available bytes prove that moving the owner load before allocation is valid? What new evidence, if any, would this supply beyond existing project/m2c reconstruction?

Oracle: first call at owner offset4A4 has delay4A8 supplying a0=0x6094. After return,4AC materializes0x801D0000 into a0,4B0 loads word0x801CE8BC into a0,4B4 copies v0 into s0. Second call isC44 with nop delayC48; C4C/C50/C54 repeat materialization/load/save. The loads occur after the calls. The following copy uses loaded owner as a0, saved allocator return as a1 and0x6094 as a2; the clear through the independently loaded0x801CE8C0 pointer is in the copy-call delay slot. Do not assume the allocator leaves either global unchanged without callee evidence. The full original prototype, allocation semantics and global effects are not established by these call-site constraints alone.

Known project value: existing source already names allocation/result/owner and reproduces the two exact sites using empty constraints. Accepted compiler diagnostics identify a scheduler tie originating in return-copy RTL order. Recovering the same def-use relation or CFG is useful validation but is not a new C expression or a solution to that tie. A newly proved real dependency might change the next matching step; merely declaring the independent instructions interchangeable does not tell the pinned compiler how to emit them.

## Candidate baseline: func_0020BFF8

Question: recover both null/non-null return paths and the likely-branch delay-slot execution, then express the return as a bounded bit-vector relation. Identify the input and return machine constraints without overclaiming the C prototype.

Oracle from the seven original words: offset0 is beql a0,zero to14; offset4 sets v0=0 only on the taken/null path. Non-null execution skips that likely delay instruction, reaches lw v0,0x40(a0) at8, then logical shift-right8 atC and mask1 at10. Offset14 returns through ra with nop delay18. Thus a0=0 returns0 without dereferencing it; for a valid aligned readable non-null p, return=((word32[p+0x40] >>8)&1), independent of other entry argument registers. There is no loop or indirect transfer except return. The accepted C declaration is int(void*); bytes constrain one tested/address-bearing32-bit register input and a0/1 v0 result, not the original pointer type or absence of unused formal parameters. A bounded symbolic check may use a valid mapped p with a symbolic32-bit word and compare both p=0 and p!=0 paths; arbitrary invalid pointers need not return normally.

Original source `asm/original/rev0/lib/func_0020BFF8.s` SHA9888047448AD576BA7B6C39A4A42D1AF303BD09F5F430DC288E41E1006B85AAF; accepted C `src/lib/func_0020BFF8.c` SHAA121834C101C03CF128EB19987556A1D4B74349186E0BBB605731DFB127C7D3D already supplies the same null guard and bit expression. Correct rediscovery adds no new matching fact.

## Solved loop/call case: func_001F34B0

Questions: recover the two backedges, loop counts, pointer-load progression and final call; determine what input/return constraints are observable and whether one global base may safely be assumed for every iteration.

Oracle: frame32 bytes, preserved s0/s1/ra. First body starts18; load of global0x801CE8BC at1C, indexed pointer load24, increment index28, call0x800712C4 at2C with offset+=12 in delay30. Unsigned test index<16 at34 and branch38→18, nop delay3C. Second body44 reloads the global at48, scales index at4C, loads pointer at base+0x180+4*index at54, calls the same target58 with index increment in delay5C, then unsigned test<10 at60 and branch64→44, nop delay68. Conditional on normal callee returns and readable addresses, there are16 then10 calls. Final global load70 feeds a0 for call0x80093380 at74 with a1=0xC0 in delay78; return88 has stack restoration in delay8C.

The current declaration is void(void), but bytes only show no used entry argument registers and no intentionally produced return after the final call. They cannot exclude unused formals or prove that the leftover v0 is an API return. Each call to0x800712C4 receives one explicitly loaded a0; other incoming call registers do not prove additional formal parameters. The global is reloaded on every iteration and before the final call. Calls may change it; a fixed-base symbolic summary is conditional on a separately stated hook/model. Under a hook that only returns normally and preserves callee-saved registers, the iteration counts remain fixed, while load addresses can follow changed global values.

Accepted C already expresses both loops, per-iteration global accesses and final size. This is validation of extraction/dataflow, not new pointer ownership/freeing semantics from the callee name.

## Solved switch/stack case: func_001F197C

Questions: recover selector bounds and indirect-transfer targets with code alone and then with the accepted table bytes; identify outgoing stack argument positions and the three distinct byte-output addresses; establish the bounded initial no-loop behavior independently of unknown callees.

Oracle switch: helper return is masked255 at100; unsigned selector<22 test104 branches at108 to default338 when false, with selector*4 in its ordinary delay10C. Address arithmetic110–118 reads table0x801CFD48+4*selector, then jr v0 at11C with nop delay120. It is an internal table dispatch, not a function return. Code-only bytes constrain the table address/bound but do not contain all table words; unresolved targets without the table are an input limitation. Accepted table ROM[2131D8,213230), runtime[801CFD48,801CFDA0),88bytes. Its22 owner-relative target offsets in selector order0..21 are:

`1D8,124,338,1AC,158,164,338,338,338,338,338,1B8,338,338,290,254,338,338,338,338,338,138`.

The default338 joins the state remainder/loop condition, not necessarily function exit. The entry remainder-zero edge8C→37C skips the dispatcher; loop backedge374→A4 uses the same signed16 state-field remainder-by50 condition. Delay slots and target addresses, rather than identical block partition counts, define correct recovery.

Oracle machine call atF8: a0/a1 come from object+48/+4C, a2 from an earlier helper result, a3 from another return moved in delayFC. Five additional32-bit stack values are stored at current sp+10,+14,+18,+1C,+20, making nine occupied machine argument positions. The last three are addresses of bytes sp+28,+29,+2A; these are subsequently read with lbu in case blocks. The current C declares nine helper arguments and three u8 pointers. The call site plus later byte loads does not by itself prove the callee writes exactly one byte at each pointer or the complete original pointed-to types. Entry a0/a1/a2 are retained as object/state/nullable out; unused entry a3 does not rule out an unused fourth formal.

Bounded symbolic oracle: with readable state+4 whose signed16 value is divisible by50, the dispatcher loop is skipped. The return is0. With out=NULL, no output buffer is written; with valid writable out for two32-bit words disjoint from the state storage, final out[0]=0 and out[1]=-1. No helper is called on this path, the input object need not be dereferenced, and no state field is written. Values0,50 and bit patternFFCE(-50) are useful concrete boundary checks; this does not claim unrestricted termination for other states or arbitrary helper responses. Original arithmetic and exact C already supply this behavior.

## Selection and comparison rules

Sol confirmed the completed-wave PURE_C trio BFF8,1F34B0 and1F197C. Provisional W8 suggestions103EC/FD56C are excluded. Accepted runtime starts are801C8B68,801B0020,801AE4EC; hard215CF0 starts801D2A20. No oracle answers are provided to minimal-input recovery. Optional table bytes, callee models and prototypes are assistance and must be recorded separately; recovering a supplied prototype is not inference. Missing table bytes, unknown callee effects and actual compiler-only blockers must be reported as different limitations.

All eight question scopes were sent to the trial executor before receiving results. Exact inputs and existing m2c references are bound below; no angr output has been inspected.

## Reference inputs and existing m2c baseline

The answers above were frozen at2026-09-07T22:41:20-04:00 in `build/angr-trial-reference-r1/oracles-before-results.md`, SHAC2EE0F0A97F3DA231FEBFA4CAD049D9574AFFC0EC6861AD6FBF260987822AF22, before any angr output was received or read. The executor was instructed to use that file only after freezing minimal recovery outputs. Subsequent work added provenance, not tool-derived answers.

`inputs.json` SHA5D52583B3B9334C13D648BB52D8CA6D996F174401A5F204F1438A1095582CD3F binds copied original assembly/current C and the actor retry report. `197c-table-reference.json` SHA71763BB2F561206916D79C2A0CD7A6055CE7AA12215E95EAD65B1CB32E668B22 is the existing accepted auxiliary-table contract, including expected linked hash3A1CC13ADB14677E5DBEC143E8A4EA5EA0AC6D58D2743A1394E02B357CF5F95A. This is oracle metadata, not a code-only discovery.

Completed-wave provenance is the existing pass report `C:/Users/Joe/.codex/ob64-consolidated-intake-20260906/work/final-snapshots-02/3-verification.json`, SHA2A837B56D02452A333704C31DBB70334831F7F7C6BD181A0F58FF1F4F64A6FAF. Its four target records are copied into `accepted-target-records.json`, SHAFEA500395991291DA3B7568ACFAFC2868D6787B20B83FBAD91747A925E06382A. These preserve the three PURE_C records and the HYBRID_C hard case; no acceptance was rerun. The canonical ROM hash in the accepted report is571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A.

Sol retrieved the configured m2c checkout at `C:/Users/Joe/Projects/OgreBattlel64/tools/m2c`, HEAD3478473441a1e6da75d6bf07629452f410390ef4, tree3943f2fb966096365ca19d888a85f7a0386aac17. Independently hashed m2c.py isB99BC4CBAD2AA8C89CCDF67B874256E0A36CE7B31B7AC26E488BB27EE446AB63; `config/matching-workbench.json` EBB344E06E906352CF8C6DEC8E20316A9427F3F499BDFA763265720A9C59B32D; existing adapter `tools/lib/matching/m2c.js`70930229286EEC7B6AECC8818492AA30CBB8FB05BAC4A23E3554B06BA36C5143. The recorded wrapper uses Python, `--target mips-gcc-c --function SYMBOL --globals used`, variant options, optional context, and prepared assembly. None was executed here.

The retained strongest CF0 C is `docs/archive/matching-c-candidates/2026-09-04-func_00215CF0-20b217bd52.c`, copied as `215cf0-retained-pure.c`, SHAD1E9A5915BD38286869DC4FF67DF0EFD25932B3276B4E2CBF49828967A0A58B0. It already expresses allocator results, owner arguments, copy sizes and the full dispatcher. It is a preserved project candidate derived through matching work, not represented here as an untouched raw m2c answer. Sol's direct archive search found no raw solved-case m2c draft files; generation history exists but does not substitute for exact raw outputs. Therefore this independent matrix establishes what accepted project C/assembly and retained CF0 C already supply, and does not award or deny raw m2c recovery accuracy without a separately recorded output. The executor's fresh m2c run, if any, must state its prepared assembly, context and assistance.

## Release

Only this fresh claim/report and ignored reference root were written. No production/source/config/tooling changes, trial execution, compilation, runtime or canonical verification occurred. Final read-only hashes confirm3C00 D03797FD04EEE60592E0644A837E09308568D3E82448883997A10A85DA7F91F5;6098 D76444B2C4AF7AD44E40DA2F68456E894355AA9F1B6BF4D44F4B792DC10097E1; exact7ADC F3F90BD828DE9141A6E48D4BBBF4691F3A5B6C60C828CE9B2F8289408457B518;DB10 5BF6ACF3CEF8F4A229AA143CCEB76376AC333B455BB1EDA18E9296476D791FD3 remain preserved. Production ownership stays with this worker, trials paused pending Director routing. Reference-task writes are complete and released; no semantic, structural, compiler or matching acceptance is issued.
