# Remaining terminal owners: uncompiled preparation r1

Completed bounded preparation for all eight assigned owners (4,580 bytes / 1,145 words). Every original word agrees with the canonical normalized ROM. This is ordinary implementation assistance, not matching, structural, semantic, or reusable compiler acceptance. No candidate or compiler operation was performed.

## Inputs and extent

Receiver `/root/boot_conversion_preparation`, Astra Medium; Director `/root`, local native task `01a07262-aeca-7341-ad10-2dba705ff988`. Launch `COMBAT-TERMINAL-REMAINING-PREPARATION-20260907-01`; fresh claim created atomically and read back before evidence writes. Coordination `e727c1af4b1d4dec9e7d354c9b1a349d4d869348`; exact source inputs are Git W7 `469a1416918592749d61dc34e3e079796f7b673c`, never mutable W8 source.

Corrected package SHA256 `8129EAC6B6E5C93C22741B7C0407094987222040436E1719D7E9474B5373AA3E`; correction report `0CF8D2C24D4894C79A1109A9C71D5F47A8AE1A662C75053684008804D6E453AB`. Frozen EBBC caller-context note `C678D309B66EB84F8E1997BA4276FAF95CC3CF3C78DE4E607CB9EF0A7888D87F` is reused only at its interface. Exact original paths/hashes, saved placement, all instruction words and computed branches/calls appear in the eight owner JSON maps under `build/combat-terminal-remaining-preparation-r1/`. `evidence.json` records package, Git and ROM identities; `helper-inputs.json` records bounded helper Git inputs; `tables-and-helper-proof.json` records the guarded table and helper word comparisons. `output-manifest.json` binds all output files other than itself.

| Owner | ROM extent, exclusive end | Bytes / words | Frame |
|---|---|---:|---:|
| 002213DC | 2213DC..2215D0 | 500 / 125 | 30 |
| 002215D0 | 2215D0..222190 | 3008 / 752 | 80 |
| 00222190 | 222190..22222C | 156 / 39 | 40 |
| 0022222C | 22222C..222344 | 280 / 70 | 58 |
| 00222344 | 222344..2223E0 | 156 / 39 | 40 |
| 002223E0 | 2223E0..2224F4 | 276 / 69 | 50 |
| 00222530 | 222530..22257C | 76 / 19 | 20 |
| 0021EAF0 | 21EAF0..21EB70 | 128 / 32 | 18 |

Addresses, field offsets and frames in this report are hexadecimal unless explicitly decimal. Accepted placement is the package's `resource-loader-00213b10` mapping, VMA = ROM + `7FFBCD30`. Assembly comment VMAs do not establish placement. Public entries, complete extents including trailing words, fallback originals, final returns and delay slots remain intact.

## Interfaces shared by these notes

`S` denotes a context, `P = *(S+4*i)`, `Q = *(S+C+4*i)` for three slots; these are observed offsets, not new accepted types. The context byte `A5` supplies per-slot bits where explicitly tested. Signed halfword reloads after stores matter. Arithmetic below describes machine operations; it does not authorize signed-overflow assumptions in future C.

| Literal callee VMA | Relevant authenticated interface |
|---|---|
| 8007FE70 | Resident `vec3_distance`, original ROM 10270..102E0: two pointers, reads exactly three floats each, returns single-precision square root of summed squared component differences (with its existing fallback). |
| 8016DBD8 | Accepted `func_00043ad8` / package alias: two integer inputs reduced to bytes; byte result. |
| 801ADC60 | `001F10F0(P,P+98)`: updates two floats in second object, then P signed halfwords 1C/20 from float sums. |
| 801BC35C | `001FF7EC`: two arguments narrowed to signed 16-bit, returns float through its existing five-argument underlying helper. |
| 8021802C | `0026CBDC(float position, int count, float* A, float* B, float* C)`: f12 plus a1/a2/a3 and fifth argument at caller sp+10; float result. Count is integer, not float bits. Reads indexed adjacent float pairs; the caller's spacing does not prove array capacity. |
| 801BE1E0 / 801BE264 | Accepted `00201670` / `002016F4`: two integer arguments, float result; different byte lanes of a pointer-based table divided by 16. Preserve FF fallback behavior in existing helpers. |
| 801BE3A8 / 801BE410 | `00201838` / `002018A0`: two integer arguments, byte-valued result; caller explicitly masks low eight bits. |
| 801C8AC0 / 801C8AA4 | Accepted `0020BF50` / `0020BF34`: integer result `(arg-4)*38` / `(arg-1)*38`, with 38 decimal. |
| 801C8FE8 | Accepted `0020C478(index)`: returns context or null, index restricted to 0..19 by helper. |
| 801C8B84 / 801C8E9C | `0020C014` / `0020C32C`: context argument; zero for null, otherwise `((word40>>8)^1)&1` / `(word40>>1)&1`. |
| 801C8B54 | Accepted `0020BFE4(void)`: tests byte at 800E9C12 against 1. |
| 801C9234 | `0020C6C4(pointer, int* outA, int* outB)`: writes both four-byte outputs; no stable result used here. |
| 801AD9D4 | `001F0E64(pointer, integer mode)`: callers ignore result. Mode zero can invoke three ordered random calls under the helper's existing flag condition; do not reorder/merge calls. |
| 801DB6CC | Package literal interface to separate `0021E99C`, two pointers P/Q, ignored result. No duplicate complete-owner analysis. |
| 801DB8EC / 801CBF44 | Frozen EBBC no-argument caller interface / accepted `0020F3D4(void)`; results ignored by 215D0. |

These contextual reconciliations do not promote overlapping same-address aliases into new ownership or runtime proof.

## 002213DC

ABI: one context pointer; integer result 0 after completing slots, 1 on the specific early condition below. Frame 30 holds outgoing fifth argument at 10 and six saved GPR words at 18..2C; no local array.

For i=0..2, require bit i of byte A5 and both P/Q nonnull. Query 8016DBD8 with context bytes 4B/4F. If low byte is not 1, call 801ADC60(P,P+98), then 00222530(P,Q), write P words 4/8/C as 30 decimal times signed halfwords 1C/1E/20, and copy P halfwords 1C/20 to Q.

For result 1, dereference P.wordBC and compare its signed word0 with signed word8. If current >= limit, return 1 immediately; this does not continue later slots. Otherwise update P through 801ADC60; call 801BC35C(P.s16_1C,P.s16_20), truncate float and store low halfword to P/Q at 1E, then copy P 1C/20 to Q. Read old state.word0, increment/store it, **reload P.wordBC**, and call 8021802C with float(old), integer state.word4, state+C, state+34, state+5C. Add returned float to the signed reloaded P.half1E, truncate and narrow back to P; Q retains the pre-add value. P words 4/8/C receive the scaled signed coordinates. Preserve reload and conversion order rather than treating the two Y stores as interchangeable.

## 002215D0

ABI: no incoming argument consumed; no result contract established by callers here. Frame 80 saves ten GPRs at 58..7C. The two calls to 801C9234 use actual four-byte output pairs at sp10/14 and sp18/1C; no capacity is inferred for unused frame space. Before the prologue it reads global word 801CE8C4; if nonzero it calls EBBC, then reloads/increments/stores global 801CE8C8. It iterates twenty decimal indices through 801C8FE8. Null contexts and out-of-range states advance the index. Final service 801CBF44 runs once, followed by complete epilogue and two retained trailing nops.

Dispatch uses `unsigned(S.word74-1)<60` and sixty words at VMA 801E6E10 / ROM 22A0E0 (240 bytes; SHA256 `3EA1FE7461CA533F8B9DEEA09416352262750540B65EFFF76B83556F5FA7158E`). All destinations are aligned and internal. States below are decimal. Every other state 1..60 goes directly to 222140 (next context), as do failed range guards. Exact sixty-entry map is in the table evidence.

| States | Entry ROM | Complete group behavior |
|---|---|---|
| 6 | 221678 | For each nonnull P, signed half48<5 sets context state74=1. No A5 mask. |
| 2,8,33 | 2216B4 | Call 213DC(S); nonzero result sets state1. |
| 10 | 2216CC | All nonnull P: flag any old word94==0 and store old-1 even when zero (delay slot). Call 213DC. If either result/flag is nonzero, masked nonnull P call 801AD9D4(P+44,12 decimal), then 801DB6CC(P,Q); set state1. |
| 12 | 221778 | Require 801C8E9C(S)!=0, then masked nonnull P perform half1C wobble. For phase word94<3, side false subtracts 2 / true adds 2; for phase<6 reverse direction; increment word94 each processed child. Side helper is called per child, not hoisted. |
| 45 | 221A3C | Same wobble without the outer 801C8E9C gate. |
| 50 | 221828 | Query side once; all nonnull P move half1C by signed 8, clamp at displacement 38 decimal from half28, copy to Q.half1C and scale P.word4 by 30. If any reaches clamp, update S.word5C by signed 38 and S.word58 by signed 1, obtain truncated 801BC35C(S.s16_5E,S.s16_66) into word60, copy P/Q starting-X half28 and S.half62 into their 1E/2A, set state1. Preserve direction-specific narrow comparisons. |
| 19 | 221ADC | Masked P/Q pairs, both nonnull: if P.half34!=0 subtract P.word94, narrow to signed half, set Q.half34 to truncation-toward-zero division by 4; if negative clamp both to zero. No extra-pointer propagation or state change. |
| 35 | 221B78 | Masked nonnull P: call 801C9234(P+44,&sp10,&sp14). Only if signed P.half4E equals output sp14, test signed word94+12<256. True stores +12 and half4C=3; false clears word94 and half4C, stores literal 801B3CB8 to P.word0, sets state1. |
| 36 | 221C04 | Masked nonnull P: call 801C9234 with sp18/1C outputs (not read). Same +12 threshold. True calls 801C8B54, reloads word94 and adds 12 if nonzero result, otherwise 64; half4C=3. Thus the +64 path can cross 256 despite the +12 pretest. False follows state35's clear path. |
| 46 | 221CA8 | Masked nonnull P: add signed byte at 801E5E0F+P.word94 to half1E; decrement word94 and set state1 when new value is zero. |
| 47 | 221D28 | Same byte access, subtract instead; new zero also calls 801AD9D4(P+44,0). |
| 57 | 221DB8 | Lookup target context using source byteA6 without a new null guard. If source first P.byte37!=0, copy exactly eight unaligned bytes 36..3D to target first P. Decrease source first P.half34 and increase target first P.half34, using word94 steps, signed narrowing, Q /4 and optional-extra propagation described below. Source zero skips decrease; target exactly255 skips increase. No state1 store. |
| 59 | 221F34 | Masked nonnull P increase half34 toward255 with Q and extras. Increment context byteA6 with byte wrap; when new value==35 decimal, masked nonnull P call 801AD9D4(P+44,40 decimal), then set state1. |
| 60 | 222070 | Masked nonnull P decrease half34 toward0 with Q and extras, then call 213DC(S), ignoring its result. |

For the last three groups, division by four adds 3 for negative narrowed values before arithmetic shift. Copies to optional pointers S.word18 and S.word1C occur before clamp. The clamp tails deliberately **test word1C but reload word18 for the final store** (for example 221E78..221E88); they are not equivalent to writing through the tested pointer. Increasing clamps P to255 and Q to63 when the signed narrowed value is >=256; decreasing clamps negative values to0. Missing null guards and asymmetry are original behavior, not permission to invent initializers or repair pointers. This is a concrete alias/reload constraint for future C, not a semantic bug verdict.

The signed-byte base 801E5E0F maps to ROM 2290DF within the accepted loader slab; these owners provide no guard on word94 and no table capacity. Preserve the literal reference without declaring an invented bounded array. The literal stored pointer 801B3CB8 remains neutral; no new function meaning is inferred.

## Four distance/arithmetic owners

All return the integer produced by `trunc.w.s` after single-precision division. There is no new lower clamp, divisor-zero guard or invalid-float policy. Each builds **two twelve-byte float triples** at sp10..1B and sp20..2B; intervening gaps are not fourth components. The zero components are positive-zero words. Component order, argument conversion and helper-call order remain observable obligations even where distance is mathematically symmetric.

| Owner | ABI and exact calculation order |
|---|---|
| 222190 | Five arguments `(object,x0,z0,x1,z1)`; fifth at incoming sp10. Triple A=(x0,0,z0), B=(x1,0,z1). Distance first; divide by 801BE1E0(object.word48,word4C). Frame40: saved GPR words30/34, F20 double-save38..3F. |
| 22222C | Four arguments `(source,target,x,z)`. Map target.word58 via 801C8AC0, then target.word54 via 801C8AA4. Call 801BE3A8(source48/4C), then 801BE410(target48/4C), mask each low byte and sum. Distance between (x,0,z) and mapped triple; subtract float(sum), then divide by 801BE1E0(source48/4C). Frame58 saves seven GPR words30..48 and F20 at50..57. |
| 222344 | Five arguments as 222190, but A=(x1,0,z1), B=(x0,0,z0), and divisor is 801BE264(object48/4C). Same frame40 storage. |
| 2223E0 | Six arguments `(source,target,mapZ,mapX,x,z)`. Incoming fifth/sixth are sp10/14, accessed after frame50 allocation at60/64. Map a3 through 801C8AC0, then a2 through 801C8AA4. A=(x,0,z), B=(mappedX,0,mappedZ). Distance **before** the two byte-result calls (source then target), subtract float(sum), divide by 801BE264(source48/4C). Frame50 saves six GPR words30..44 and F20 at48..4F. |

## 00222530 and retained bridge 0021EAF0

22530 takes P/Q pointers, frame20 with three saved GPR words10/14/18. Call 801BC35C with signed P.half1C/20; truncate returned float to full integer v0, store its low halfword to **Q then P** at1E. v0 remains that full truncated result; 213DC ignores it. No local buffer or additional guard.

21EAF0 takes context S, frame18 with saved words10/14. Independently load S.word18 then S.word1C. For each nonnull pointer, read signed half48; if nonzero and `unsigned(value-1)&3` is less than2, call 801AD9D4(pointer+44,value+2). Do not replace this bit test with a positive-only range: negative signed halfwords can satisfy it. No stable result is established across its paths. The bridge keeps its existing family disposition and complete 128-byte owner.

## Reconstruction order and limits

Within the future sole writer's already assigned fifteen-member wave, useful local order is 22530; the four arithmetic helpers in their listed order; 21EAF0; 213DC; 215D0 after binding the separately prepared 21E99C and frozen EBBC contracts. This is only dependency-aware source preparation, not eight new waves. Complete seven-member resolution and preceding seventeen-member action-mode source prerequisites remain required. W8 retains all fourteen members and its current gates.

The future writer must use accepted table/placement contracts, retain operation-specific truncation and repeated reads, and establish matching through focused linked diffs and the one complete fifteen-target final verifier. Missing original source expression, unconstrained byte-table indices, helper-internal table lengths and missing runtime guards are explicit limits; they do not create a universal runtime, termination or exhaustion gate. No partition, boundary, shared-tool remedy or source-policy exception is proposed.

Only this claim/report/ignored evidence root was written. No mutable six-helper report, W8 production source or held Resolver input was used as authority. All assigned writes are released at handoff; outputs are terminal and should remain unchanged.
