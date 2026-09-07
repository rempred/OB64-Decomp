# W7 scalar mask-expansion analysis

Completed: the high OR order comes directly from initial RTL, while the low shift uses a separate expression temporary allocated locally to register2. One narrow low-alpha accumulator hypothesis follows. The Director can route this assistance to the sole W7 source worker; no independent acceptance gate is added.

## Identity and limits

Task combat-compositing-mask-analysis r1; launch COMBAT-COMPOSITING-MASK-ANALYSIS-20260907-01. Worker /root/compilation_groups_design, Astra Medium, local. Director /root, native task01a07262-aeca-7341-ad10-2dba705ff988. Complete claim, including source/assembly identities, was created atomically at2026-09-07T03:20:55.6969795-04:00 and read back. Starting HEAD was bfe48f9d976875f9adefa77d7420fc562061c02e.

Only build/combat-compositing-wave7-r1/rtl-207E30-indexed-base/ and the complete original owner/canonical ROM supply technical inputs. Source SHA-256 is062762E67A14B2DF5367EFF67C53F00A678192AAC093297F92DC3D9B8BCFD5FE. Assembly SHA-256 is483A1C7B635BBBA12F8812159746E374F77870CB857F7E27F2FC623DC9293BA9. Both match the assignment. Thirteen compiler passes and the diagnostic command are separately hashed. All pseudo IDs below belong only to this variant.

The directory contains no object or raw-byte record. Candidate instruction forms are authenticated in its assembly and final dumps. Their exact candidate byte offsets cannot independently be confirmed here. Candidate encodings below are derived from those assembly operands, not measured object words. Retail words and offsets were independently verified against all438 original words and the normalized canonical ROM.

## Authentication of the three claims

The reported offsets are hexadecimal and function-relative. Retail owner start is z64 ROM0x00207E30.

| Reported offset | Retail z64 ROM | Verified retail word/form | Authenticated candidate assembly form | Derived candidate encoding |
|---|---|---|---|---|
| +0x370 |0x002081A0|0x00694825: or9,3,9|candidate.s:434, or9,9,3|0x01234825|
| +0x4DC |0x0020830C|0x00034900: sll9,3,4|candidate.s:540, sll2,3,4|0x00031100|
| +0x4E4 |0x00208314|0x01234825: or9,9,3|candidate.s:545, or9,2,3|0x00434825|

Thus all three reported operand differences are supported. Their candidate offset assignment remains reported rather than independently measured. The missing object does not prevent tracing these unique mask operations through their source and stable instruction UIDs. No compilation was performed to fill that gap.

## Actual source and early stages

The source declares packed as u8, coverage as int and alpha as u32. It reads packed once through volatile u8. High coverage is `(signed char)packed & 0xF0`; alpha receives `(u8)coverage`. Within the nonzero-alpha branch, the source separately shifts alpha right four and applies `alpha |= coverage`.

Initial RTL UID528 loads packed into QI pseudo105. UIDs530/531 implement signed-char extension with left24/arithmetic-right24. UID532 masks that result with240 into coverage pseudo106. UID534 zero-extends the low byte into alpha pseudo108. This is the actual signed-char source path, not the unsigned-mask spelling from another snapshot.

CSE2 still retains the signed-extension shifts. Combine deletes UIDs530/531 and feeds the byte directly into the240 mask at UID532. The explicit alpha byte narrowing at UID534 remains. Therefore the sign-extension instructions disappear at combine; their absence is not evidence that the source lacked the signed-char cast.

## High OR origin

Initial RTL UID540 updates pseudo108 with a logical right shift by4. UID542 then sets pseudo108 to IOR(pseudo108,pseudo106), in that operand order. CSE, CSE2, combine and lreg preserve it. Greg substitutes alpha=hard9 and coverage=hard3, producing IOR(9,3) into9. Dbr and final assembly retain that order.

This is an early expression-order difference, not a scheduler-created operand reversal. Retail instead encodes IOR(3,9) into9. Both are ordinary integer OR of the same values; commutativity explains equal arithmetic results, not matching bytes. The existing split high shift/OR already uses one alpha accumulator. No second high-mask source experiment is proposed here.

## Low shift and OR origins

Low coverage comes from packed&15. Initial RTL UID742 masks the byte through temporary316; UID743 narrows into coverage pseudo106. Its nonzero branch then computes the complete expression `(coverage << 4) | coverage`.

Initial RTL UID749 shifts coverage106 into a distinct SI expression temporary317. UID750 combines temporary317 with coverage106 into alpha108. This split survives CSE, CSE2, combine and lreg. It is already present before register allocation.

Lreg line278 reports temporary317 across two instructions. Its allocation line665 says `Register 317 in 2`. Lreg's RTL body still names317, so the allocation summary is necessary to locate the decision. Greg line98 retains `317 in 2`. Greg UIDs749/750 become sll2,3,4 followed by or9,2,3. Alpha108 and coverage106 receive9 and3; the low shift temporary's local assignment must not be attributed to a later scheduler.

This establishes the separate temporary's origin and its allocation stage. It does not prove an allocator defect or a general rule that expression temporaries always receive2. No frame, global row, input-pointer or inner-alpha-pointer priority analysis was performed.

## One hypothesis, not an experiment result

Test only whether using the existing unsigned alpha as the low expansion accumulator removes the separate shift-result lifetime. Conceptually, assign the unsigned shifted low coverage to alpha first, then OR the unchanged coverage into alpha. Preserve the packed read, coverage mask, branch, downstream channel arithmetic and all memory operations. No new variable, volatile access or register binding is needed.

Predicted early effect: the low shift directly defines the alpha pseudo rather than temporary317 followed by a separate alpha definition. Predicted allocation effect: the locally allocated shift temporary disappears, allowing the low shift and OR to use the same alpha register. If alpha remains in9, the desired forms are sll9,3,4 and or9,9,3. This is a lifetime/type hypothesis, not a promise about final allocation.

Falsifier: if CSE/combine recreate a separate shift temporary, the proposed mechanism did not persist. If the lifetime merges but a different hard register is chosen, the stated final-register prediction failed. Extra conversions, changed packed access, channel-order drift or changed memory behavior also invalidate the intended control. If the source worker has already tested this exact mechanism, do not repeat it as a spelling sweep.

Low coverage is bounded to0..15 by the existing mask. Its four-bit left shift and OR produce0..255. Using the existing unsigned alpha for that intermediate needs no overflow or undefined-behavior assumption. This bounded arithmetic observation does not establish selector domains or whole-owner game semantics. The high OR residual remains a separately explained source-order difference, with no additional hypothesis in this report.

## Evidence, verification and release

Command: node build/combat-compositing-mask-analysis-r1/check.js. Result PASS. Eighteen input identities, bounded source/assembly excerpts, all selected pass UIDs and allocation lines are recorded. The candidate-offset limitation is explicit in the evidence JSON. No source candidate or compiler output was generated.

Evidence path: build/combat-compositing-mask-analysis-r1/evidence.json. SHA-256:A8B544884A7763FBD8605E7F154A50E5F83E0CB52341714DFB75D34CA805BFCD. Normalized canonical ROM SHA-256:571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A. Normalization occurred in memory. The original owner SHA-256 is9EC834B385C85F14D7454B801585285812D94500FD31A0EBE377B77DECD6F0A6.

Broad text output was narrowed after truncation. No candidate experiment failed or was run. Only the fresh claim, this report and ignored check.js/evidence.json were written. Input directories, prior terminal reports and all production/disjoint writes remain unchanged. No compiler, link, build, verifier, generator, runtime, database or Git mutation occurred. All seven W7 targets retain their original complete-wave gates. No canonical-document change or independent matching review is proposed. All assigned writes are released at terminal handoff.
