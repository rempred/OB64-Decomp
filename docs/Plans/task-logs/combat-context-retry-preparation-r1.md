# Combat context retry preparation R1

Completed. This read-only preparation separates the retained length mismatch from the accepted boot lifetime result.
The future source worker must test each proposed hypothesis within the complete three-member shared-context wave.

Task combat-context-retry-preparation, revision 1, launch COMBAT-CONTEXT-RETRY-PREPARATION-20260907-01, receiver /root/boot_conversion_preparation, local.
The complete fresh claim was created atomically and read back before this report.
Baseline main: 1a5a73ab544221955a777aeaee16524f2424afd1, after ready cbcfecd.
The pose worker owns existing target/linkage edits, four untracked pose sources, and its R3 records.
Own only this report, its claim, and the assigned ignored evidence root. No production or historical inputs may change.

Plan: compare retained source/ROM pocket, inspect each assembler constraint, and reuse accepted boot R2 pass evidence.
Leading interpretation: early alias coalescing removes a required copy and changes scheduling.
Alternative: the final-call delay slot is an independent lifetime issue.
Existing artifacts distinguish these; no candidate, compiler, runtime or database operation is authorized.

## Completed preparation

Completed. The retained deficit is one instruction of length, with register and scheduling differences, rather than four isolated differing bytes.
Boot R2 justifies testing late-removed conditions that extend local lifetimes.
It does not prove that Combat's equal-valued aliases will receive different registers.
The Director can assign the future source worker these bounded hypotheses after the pose writer releases ownership.

Evidence grade: existing machine/source observations are Supported; proposed source forms are Candidate and untested.
New research interpretation remains review pending. This report grants no matching or semantic acceptance.

## Existing evidence and constraints

The active func_001FFE80 source is accepted exact HYBRID_C.
Its complete z64 owner is [0x001FFE80,0x0020019C), 796 bytes, with 54 recorded relocations.
The historical accepted target SHA-256 is F980232EFC52C2B199FE98013C63495EC8DF87303E18353FC34FB3E47F9C7402.
The current target record selects src/lib/func_001FFE80.c.
The dossier's statement that assembly remains the accepted owner describes its preserved scratch context, not today's active target record.

The preserved pure candidate is 792 bytes.
Its dossier reports zero-offset record-alias coalescing, an entry copy in the flag-branch delay slot, and different value registers.
It also reports the final call filling its retail nop with the return-address restore.
The dossier's first-word difference is an unresolved scratch relocation, not the causal alias mismatch.
No new compilation or linked comparison was performed here.

The current source differs from the preserved candidate beyond its assembly.
It uses the already loaded record for the core alias and preserves entry-address lifetime through a direct frame-step call expression.
The historical W3 report specifically credits that direct expression with the retail call-slot addu operand order.
A fresh plain baseline should therefore start from current source with assembly replaced by its C dataflow, while retaining the archived candidate as a control.

| Retail operation | z64 ROM location | Constraint on retry |
|---|---|---|
| Flag branch and record-to-core copy | 0x00200018 / 0x0020001C | Copy s2 into a0 in the branch slot. No new memory access. |
| Position and offset loads | 0x00200020 / 0x00200024 | Signed halfword loads from core offsets 0x1E and 0x52. |
| Entry and original-position copies | 0x00200028 / 0x0020002C | Copy a1 to a3 and v0 to a2 before destructive sum. |
| Sum, nonnegative branch, offset save | 0x00200030..0x00200038 | Preserve original position and offset independently of their sum. |
| Helper call and sum argument | 0x0020007C / 0x00200080 | a0=payload, a1=frame plus unsigned step, a2=original position, a3=entry. |
| Final wrapper call, nop, return-address load | 0x00200170..0x00200178 | Preserve the nop and subsequent epilogue order. |

These locations use literal ROM offsets.
The original split's printed 0x8026xxxx PC annotations are decoding aids, not accepted relocated placement authority.
The retained dossier comparison uses entry RAM 0x801BC9F0.

There are two assembler mechanisms in the current source:

- The empty template has output "=r", tied input "0", and clobber "$3". The tied operand preserves the core-pointer value in one register. The clobber excludes v1 at that boundary and changes allocation freedom. It emits no instruction and has no memory clobber. It is not a general memory-order barrier.
- The two-move template has two "=&r" outputs and two "r" inputs. Early-clobber prevents output registers from overlapping input registers. It materializes the preserved entry and original-position values before the sum. It injects two full-width register copies, not narrowed halfword copies. Neither output requests a fixed register number; surrounding allocation selects a3 and a2.

Removing the mechanisms requires preserving their dataflow, not pretending their compiler constraints are C semantics.
The halfword values are sign-extended before the full-width copies.
The original offset also survives the helper call for the later halfword restoration.

## Transferable boot evidence

Accepted 523d460 contains the R2 materializer result.
Its plain source had distinct pseudos before allocation, but the pointer died at the final load.
Local allocation reused v0 for both pointer and loaded value.
A condition on the saved pointer, with identical output stores in both arms, extended the pointer lifetime.
Allocation selected v0 for the pointer and v1 for the output.
The late jump pass removed the redundant condition after scheduling and allocation.
The final canonical comparison and complete three-target verifier passed.

That condition added no memory access and supplied no null protection.
R2's pointer locals, arithmetic cancellation, signed storage, aggregates and byte-copy probes did not establish a general alternative recipe.
Combat's zero-offset core and record aliases initially have equal values; overlapping lifetime alone can still permit coalescing.
Combat also has calls, a loop, destructive argument preparation, and a second epilogue concern.

## Bounded hypotheses for the future source worker

All hypotheses below are untested. Change one local region at a time and retain the current declarations and surrounding source.

1. **Plain current-source control.** Replace both templates with ordinary value-preserving assignments. Keep single position/offset loads and the current direct frame-step argument. Prediction: this separates residual current allocation from the archived source's different entry lifetime. Falsifier of historical persistence: the complete 796-byte target already matches. A changed size or pocket narrows the current problem; it does not invalidate the archive.

2. **Late use of the preserved original position.** After the signed-halfword loads and ordinary copies, use a defined condition on the saved original-position local. Put the same existing continuation in both arms, initially limiting duplication to the sum/guard region. Prediction: the saved original value remains live while the working sum becomes a distinct value, preserving the v0-to-a2 copy. This is the closest analogue to boot's distinct pointer/value lifetimes. Falsifiers: early condition deletion, unchanged coalescing, surviving branch, extra loads, or any changed raw instruction outside the intended pocket. If the whole continuation must be duplicated to test this, preserve every branch's original call/store count.

3. **Late use of the original entry address.** Preserve the entry pointer separately from the working frame-step argument. Place a condition on that already loaded local around identical call-argument preparation/continuation. Keep the condition after the working argument becomes a scalar, if that preserves the retail access order. Prediction: this distinguishes the entry preserved for a3 from the destructive a1 value. Falsifiers: premature merging, changed helper arguments, extra pointer reloads, changed call-slot addu operand order, or residual branch code. A pointer comparison with null is defined; do not use pointer subtraction, ordering between unrelated objects, or fabricated alignment assumptions.

The second and third hypotheses target distinct destructive lifetimes.
Neither promises the s2-to-a0 alias copy in the flag-branch slot.
If that copy remains absent, inspect the corresponding future pass dumps before another source trial.
Determine whether the alias disappears before allocation or equal-valued live ranges remain coalescible.
Boot's result alone does not answer that question.

Treat the final-call nop as an independent observation until the plain current-source control measures it.
Do not add an empty helper, fake return value, volatile side effect, or ABI change to force the epilogue.
A pocket fix that leaves a nonexact final call remains a blocked whole target.

## Semantic preservation and rejection limits

Keep the public void(void) entry and existing call signatures.
Do not infer gameplay meanings from current field names.
Reload the secondary collection base and record after func_001F1218, as retail does.
Do not hoist those loads across the call or cache them across iterations.

Retain signed 16-bit position, offset and current-frame reads; retain unsigned 16-bit saved frame, reset base, limit and step.
Keep the original position as the third helper argument and the entry address as the fourth.
The sum of two sign-extended halfwords fits s32; no overflow assumption is needed for that sum.
Do not substitute an s16 sum or narrow the preserved argument.
Keep halfword restoration order 0x50, 0x52, 0x54 and existing low-half truncation behavior.

Keep both byte countdowns, masks, ordered halfword/byte resets, volatile context-pointer reloads and final wrapper call.
Do not replace byte or halfword operations with wide aggregate/memcpy operations.
Do not add restrict, stronger nonaliasing types, uninitialized reads, out-of-object pointer arithmetic, or assertions about object separation.
Conditions must inspect already initialized local values and execute identical existing effects for both outcomes.
A condition after a dereference creates no new validity guarantee.
The existing live-record validity and object-lifetime domain remains unresolved here; no new domain assumption is authorized.

## Evidence index and verification

Required current rules, parent Worker-workflow, sequential program, future draft, source, original assembly and retained dossier were read.
The research-aide index was checked; this bounded compiler question uses the explicitly assigned project evidence rather than runtime/database aides.
Parent HEAD: f940a2825ac97453746d3e9cef9c5cabc60a8dd2.

| Input | SHA-256 |
|---|---|
| src/lib/func_001FFE80.c | 0ADD34F029663A846F12D2370B8C98A335E1B2F0B34241039EEC1A1B180765B6 |
| docs/archive/matching-c-candidates/2026-09-03-func_001FFE80-2d73908d61.c | 4C2D0C61A28EC7433CB55327361EDD9761B1EF6535B420C7402EF381025B8A3D |
| asm/original/rev0/lib/func_001FFE80.s | 8BE95D72294E363DEA1C404DCAA0F6E63862EB24173C661594A45D8B58C01B6E |
| docs/Plans/task-logs/boot-conversion-wave-r2.md | 0E0A0F1649B0A0DC633644A49702DF29946BD5D71B0F471BDEB2D968C33A4058 |

Additional evidence: docs/dossiers/func_001FFE80-2d73908d61.md; W3 report docs/Plans/task-logs/ob64-high-attack-wave3-matching-20260903-r1-HABSW3-MC-20260903-01.md; current boot materializer source.
Shared scope: docs/Plans/task-logs/combat-shared-membership-r1.md at 58906b6.
The accepted wrapper structural review preserves an 84-byte executable prefix and 12-byte assembly-owned non-executable tail.
Its source is docs/audit/2026-09-03-high-attack-wave-3-func-002013d0-structural-independent-review.md.

Verification here consists of read-only source comparison, literal ROM-assembly inspection, report reconciliation and input hashing.
No hypotheses were compiled or classified. No new C files, tools/config/source edits, runtime/database operations, agents, branches/worktrees or Git mutations occurred.
Only the fresh claim and this report were written. No canonical-document changes are proposed.
The complete future wave remains func_001FFE80, func_002013D0 and func_00201108, with one final normal verifier after all are ready.
This preparation neither accepts a candidate nor repeats an ordinary matching acceptance gate.

Terminal handoff releases all owned report/evidence writes to /root. No command remains running.
