# Combat compositing sixth-owner preparation R1

Completed read-only preparation. The sixth owner transforms paired image payloads through a temporary allocation, then copies the result over its input. Its nested pixel loops and single-precision transform differ from the earlier pool/compositing dispatchers. The W7 source worker can implement this owner after the fifth member. No C candidate or matching result is supplied.

Task combat-compositing-sixth-preparation, revision 1; launch COMBAT-COMPOSITING-SIXTH-PREPARATION-20260907-01. Receiver /root/boot_conversion_preparation; Director /root, native 01a07262-aeca-7341-ad10-2dba705ff988; local. Ready commit 29f6bd57bd150b84c5b0582ae3c42f357232230c; starting HEAD 97a5957c2946bb64064de3faa7ecd017feb2903f. The fresh claim was created atomically and read back before writes. Required guides were read in this continuing context.

## Accepted identity and bounded inputs

| Semantic name | Meaning retained for matching | Address | Address space | Evidence role |
|---|---|---|---|---|
| Sixth owner | func_00208508; complete 1,016-byte owner | 00208508..00208900 | z64 ROM, end exclusive | Reconstruction boundary |
| Sixth placement | Accepted descriptor-10 placement | 801C5078..801C5470 | RAM virtual, end exclusive | Call/branch interpretation |
| Payload-size helper | func_00201E08 | 00201E08 / 801BE978 | z64 ROM / RAM virtual | First payload extent |
| Row-stride helper | func_00201E38 | 00201E38 / 801BE9A8 | z64 ROM / RAM virtual | Both row strides |

Accepted production baseline is 0e1191013aeebed2929c9caff7c1f139169ad7f3. Frozen retrieval at 68f66c9 supplies w7-inputs.json, SHA256 F376C9304E9CB3AAC2B76886EBE0CACCF271D700D31191F6E8D05A56E7720E2B. The target assembly SHA256 is 5DF93073AAF0E8A69D02387F7F9C7892136D50FEDD1D52B26195E5544FDF25D8.

The offline check authenticates all 254 owner words against normalized Rev 0 ROM. It also compares eight bounded original files with baseline Git blobs and ROM. References are the two stride helpers, copy, zero-fill, sqrtf, func_00206888 and func_00207658. Accepted pool/pose headers were read through git show at the baseline. Mutable W7 C, headers, linkage and compiler outputs were not used.

## Entry, storage and state

Incoming a0 is the first header pointer, held in s3. Incoming a1 is an integer parameter saved at stack +0x14. Its gameplay meaning is unknown. No incoming floating argument is supported.

Use neutral image-header fields: bytes +0/+1, type byte +2, format byte +3, unsigned width at +4, unsigned height at +6. Payload starts at +8. The accepted baseline has no shared image-header type in include/game; CombatPoseRecord and CombatPosePoolRecord are different layouts. Any new local view should express these observed widths without reusing those unrelated structs or assuming mutable W7 type definitions.

Let P be the first header, Q the second header, A the first row stride, and B the second row stride. These labels describe matching dataflow, not new canonical names.

1. Q = P + 8 + size_helper(P.format, P.width, P.height).
2. A = stride_helper(P.format, P.width).
3. B = stride_helper(Q.format, Q.width).
4. Allocate N = A*P.height + B*Q.height + 16 bytes.
5. Recompute the two products after allocation, then zero the entire temporary block.
6. Temporary first header T is the allocation; second header U is T + A*P.height + 8.

The stride helper returns ceil(width/4)*16 for format 3, ceil(width/4)*8 for 2, ceil(width/8)*8 for 1, ceil(width/16)*8 for 0, and ceil(width/32)*8 otherwise. The size helper multiplies that stride by height. Preserve the helper calls; do not inline their formulas merely because they are known.

Header stores at ROM 002085FC..00208644 write both magic bytes as 0x36,0x34. T receives type 0 and format 2; U receives type 4 and format 1. Both output widths and heights come from P. Allocation and final copy lengths still use Q.height for the second payload. No equality of P/Q dimensions is checked or established here.

| Lifetime | Retail register or stack role |
|---|---|
| First input header | s3 |
| Second input header | stack +0x1C |
| Integer parameter | stack +0x14; later converted to f22 |
| First and second strides | stack +0x24 / +0x2C |
| First and second source payloads | stack +0x34 / +0x3C |
| Signed first-stride divided by two | stack +0x44 |
| Temporary headers | s7 / s8 |
| y / x counters | s4 / s2 |
| Center x / center y / row-center equality | t0 / t2 / t1 |
| First / second destination cursors | s5 / s6 |
| dx / dy | s1 / s0 |
| Output row byte offsets | a2 / a3, initially 8 |

These roles explain live ranges; they are not requested fixed-register bindings.

## Loop and transform

ROM 00208648..002086A4 computes centerX = P.width >> 1 and centerY = P.height >> 1. Height zero skips the loops. Each row starts x at zero, forms T+rowOffsetA and U+rowOffsetB, and skips pixels when width is zero. Signed counters compare against zero-extended header dimensions. Dimensions are reread at loop tests; do not silently cache every load.

For each pixel, normally dx = x-centerX and dy = y-centerY. At the exact center, both become 1. The jump at 002086CC targets ROM 002086DC, which still enters the square-root computation. This special case neither skips sampling nor assigns a default pixel.

The scalar operation order is:

- Integer multiply dx*dx and dy*dy, integer add, signed-int-to-float conversion, then sqrtf.
- Integer product parameter*(P.width-parameter), then signed-int-to-float conversion.
- scale = float(parameter) + float(product)/distance.
- verticalOffset = (float(dy)*scale)/100.0f.
- horizontalOffset = (float(dx)*scale)/100.0f.
- sampleX = trunc(float(x)+verticalOffset).
- sampleY = trunc(float(y)-horizontalOffset).

The axes cross: dy changes sampleX, and dx changes sampleY with subtraction. Preserve that relationship. A radial scale of each matching axis would reconstruct different behavior. Every floating operation is single precision. Preserve integer multiplication before conversion, separate divisions by 100.0f, and truncation toward zero. Do not reassociate into a double expression or reciprocal multiplication.

The emitted sqrt sequence at 00208708..00208770 performs sqrt.s, tests the result against itself, and calls RAM 800907E0 on the unordered path. The original sqrtf helper itself performs sqrt.s. This is a matching peculiarity around a math call, not justification to author assembler or fabricate explicit hardware exception logic. No compiler experiment was performed here.

## Bounds, paired reads and completion

Samples must satisfy sampleX >= 0, sampleX < P.width, sampleY >= 0, and sampleY < P.height. The first check is a likely negative branch. The middle checks combine signed x-bound and nonnegative-y tests before the last y-bound check.

On an accepted sample, the first load is an unsigned halfword from P+8 + 2*((A/2)*sampleY + sampleX). The second is an unsigned byte from Q+8 + B*sampleY + sampleX. A/2 uses signed division toward zero, evidenced by sign-bit adjustment and arithmetic shift. Do not replace it with width, or conflate byte stride and halfword indexing.

Stores write the first value through the halfword destination cursor and the second through the byte cursor. Every pixel advances those cursors by two and one bytes, including rejected samples. Rejected samples remain zero from the initial clear. Row offsets advance independently by A and B. The second payload uses P's sampling bounds, despite its own input dimensions being used for allocation/stride computation.

At ROM 00208884..002088C0 the function recomputes N, copies T to P, then frees T. The copy helper at RAM 80093060 uses a0 as source and a1 as destination. Its historical memcpy label must not cause argument reversal. The call here sets a0=T, a1=P, a2=N. The function does not return a useful explicitly constructed value; void is the supported working interface.

No allocation-failure check exists. Arbitrary integer-parameter range, compatible payload formats/dimensions and float-to-int conversion range are not established. Do not invent validation or assume an unrestricted safe input domain. Avoid introducing signed-overflow or conversion assumptions as matching tricks.

## Relationship and implementation priorities

Earlier W7 owners operate on decoded pose records, pool entries, resources and compositing helpers. For example, func_00206888 traverses the 0xB0 pool and consumes decoded record fields. Func_00207658 has three opcode-table dispatch sites and decoded scratch records. The sixth owner instead takes a packed header directly, has no switch table, and creates no pool record. Their C expressions and argument structures should not be copied into this reconstruction.

The shared connections are allocator/free use and downstream image storage, not identical state machines. No fifth-owner sourceRow/counter investigation or seventh-owner reconstruction was performed. A broad package selection initially displayed the fifth member's retrieval row because its end address equals the sixth start; no fifth source or candidate analysis followed.

Begin with the observed header widths, two payload pointers, separate signed strides/counters, structured nested loops and the stated float operation order. Keep the center special case explicit. Preserve complete-owner behavior before tuning source spelling. Frame 0xB0, saved f20/f22/f24, eight JAL sites, repeated size products, conditional sqrt fallback, and likely-branch increments are concrete diff landmarks. They are not evidence of an inherent pure-C blocker.

The worker should use its normal focused linked diff and source-policy checks after writing the candidate. Preserve all seven W7 members. One final complete-wave verifier remains required after all are ready; this note creates no independent matching review gate.

## Proof and release

Reproduction command: python -B build/combat-compositing-sixth-preparation-r1/check.py. Result: all 254 target words and eight bounded original owners authenticated against baseline and ROM. Ignored evidence.json SHA256 A4A86F3C6E299DD54FFDD27D12ECB383ABDD3DB00BB9AA4C74F6D125E1A0CEFE contains identities and exact target words. Raw V64 SHA256 is 6CA0A1AFE224831E202857AD64EF26BD429A034A4EA48404BB09621641A07B12; normalized z64 SHA256 is 571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A. Normalization remained in memory.

Evidence grade: exact words and local instruction/dataflow observations Verified static; readable reconstruction guidance Supported, uncompiled. No semantic or structural acceptance is claimed. No matching result is claimed. Existing semantic names remain unchanged. Two guessed helper filenames were absent; original memcpy/memset symbols resolved them without changing inputs.

Only the fresh claim, this report and ignored checker/evidence were written. W7 production and priority-helper changes were preserved. No C candidate, compiler, linking, build, verifier, generator, production edit, runtime, database, external source, agent or Git mutation occurred. No command remains running. Terminal handoff releases all assigned writes to /root.