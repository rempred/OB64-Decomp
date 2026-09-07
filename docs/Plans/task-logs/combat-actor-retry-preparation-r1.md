# Combat actor retry preparation R1

Completed. The four retained hybrids have one distinct scheduler blocker at five sites.
The later dispatcher reconstruction already closed its old size, control-flow and argument-setup deficits.
The next actor worker should test one narrowly identified dependency hypothesis in the smallest function before propagating it.
No source hypothesis, semantic interpretation or matching result is accepted here.

Task combat-actor-retry-preparation, revision 1, launch COMBAT-ACTOR-RETRY-PREPARATION-20260907-01.
Receiver /root/boot_conversion_preparation; Director /root, native 01a07262-aeca-7341-ad10-2dba705ff988; local.
The complete fresh claim was created atomically and read back before report writes.
Starting main: 53dd7f70945a30a4c6d9c6016b384b282e3529c1.
All five inspected production-source Git blobs equal accepted d70fd853fdffacf71290b24763e010a549276a55.
W6's unaccepted sources, header and configuration edits were inventoried only, not used as research inputs.
Only this report and its claim were written.

## Current result and retained controls

| Target | Complete z64 owner | Bytes / relocations | Best retained PURE_C control | Remaining owner-relative region |
|---|---|---|---|---|
| func_002158E4 | [0x002158E4,0x002159D0) | 236 / 27 | A493A3DED358... | [0x18,0x24) |
| func_002159D0 | [0x002159D0,0x00215CF0) | 800 / 79 | 49A839EAEA01... | [0x34,0x40) |
| func_00215CF0 | [0x00215CF0,0x00216A38) | 3400 / 295 | 20B217BD5262... | [0x4AC,0x4B8), [0xC4C,0xC58) |
| func_00217BA8 | [0x00217BA8,0x00217FB0) | 1032 / 107 | B4DF0A7D7F26... | [0x1C4,0x1D0) |

These are complete accepted owners, not proposed partitions.
Each active source is accepted exact HYBRID_C with its original assembly fallback retained.
The original reference words at the five sites show owner-address materialization/load before move s0,v0.
The pure controls save the allocator return first.
A 12-byte residual region describes three reordered instructions, not necessarily twelve unequal bytes.
The smallest direct diagnostic measured eleven unequal bytes in that region.

The earliest CF0 dossiers describe 3236 bytes or a broad 3400-byte control-flow mismatch.
They are superseded for retry selection by 20B217... and the later reproduced study.
The strongest source preserves all 57 external call offsets and 295 relocations.
Restoring ten-argument call setup, shared-tail placement, flag-store duplication and byte-result reuse closed the wider problems.
Do not reconstruct its old missing 164 bytes again or alter its boundary.

## What each zero-byte constraint does

All five statements have the same form: empty volatile template, "=r" snapshot output, tied "0" allocation input, and separate "r" owner input.
They have no clobbers, fixed registers, memory clobber or injected instructions.
The tied operand requires allocation and snapshot to occupy the same register at that statement.
The simultaneous owner input makes the owner value available before that output transfer point.
Compiler register shuffles around the statement remain possible; an empty template does not mean the source is PURE_C.

Sites:
- 58E4: allocation -> snapshot, with owner.
- 59D0: allocation -> temp_s0_22, with temp_a1_25.
- 5CF0: allocation_325 -> temp_s0_325 with temp_a1_328; allocation_850 -> temp_s0_850 with temp_a1_853.
- 7BA8: allocation -> temp_s0_128, with temp_a1_131.

The measured effect is owner-load before the long-lived allocator-result save.
These statements are not general memory barriers or evidence that the allocator leaves the global owner unchanged.
The owner must still be read after allocation; moving that read before the call changes an unsupported semantic assumption.
They also do not establish any new ownership, copying or gameplay meaning.

## Established cause and exhausted experiments

The accepted allocator scheduler trace is stronger than the early dossier's priority shorthand.
calls.c creates a return copy before owner-load RTL.
After context-load selection, save and owner have equal priority.
The save's anti-dependence has raw cost 1, MIPS-adjusted cost 0, then effective cost 1.
Both candidates therefore have scheduling class 3.
Original logical instruction order breaks the tie during backward scheduling and preserves save-before-owner in forward output.
This was directly traced at all five sites with instrumented/production output parity.

Earlier trials covered direct globals, carrier locals, casts/prototypes, register/volatile qualifiers, comma and argument assignments, aggregates, aliases, duplicated branches and goto lifetimes.
The focused do-while transfer and one-shot carrier converged to the same regressed emission.
They retained the original residual and added another eight-byte residual.
The inline two-result helper grew the smallest function to 240 bytes.
The later sequential carrier changed raw pseudo identities but preserved the exact causal signature and output.
Do not repeat that carrier or the completed instrumentation run as new research.

Function-specific preservation:
- 59D0's byte-width copy inside an infinite loop with two exits already fixes the type-0x41 branch orientation and a0/a1 allocation.
- 5CF0's ten-argument setup, state-7 cursor split, one-argument func_00055234 call and merged-store shapes are solved constraints.
- 7BA8's allocator call retains its existing extra argument evidence and threshold path. Do not simplify that prototype during scheduling work.
- 58E4 is the smallest faithful control for this shared issue.

## New lead and bounded experiment

Boot R2 at accepted 523d460 proves a narrower fact: a redundant pointer condition can survive allocation and schedule2, then disappear in late jump cleanup.
It solved a pointer/result register-allocation overlap, not this allocator scheduler dependency.
Its technique is not automatically transferable, and duplicated branches were already among early actor trials.

Next evidence step: inspect the exact archived duplicated-branch forms against the boot condition's pass lifetime.
Identify whether any actor trial kept the owner predicate live through schedule2 at the allocation-to-snapshot transfer.
If an identical form already failed, reuse that result and reject the proposed retry.
No additional carrier sweep is justified.

If that precise placement is absent, one untested source hypothesis is available:
in 58E4, read owner after allocation, then condition on the initialized owner local, assigning the same allocation to snapshot in both arms.
Keep the context clear and subsequent calls outside that condition in their existing order.
The proposed causal effect is a control-dependent snapshot transfer that survives through schedule2 and disappears only in late jump cleanup.
It adds no intended memory access, pointer arithmetic, or different effect between outcomes.
A null test supplies no null protection and must not move existing accesses into a different semantic domain.

The future probe must distinguish:
1. condition eliminated before scheduling: same known tie; reject this form;
2. condition survives but snapshot remains saved before the owner: hypothesis falsified;
3. desired order arises but a branch, copy, frame, register or later instruction changes: nonexact; retain the bounded failure;
4. condition disappears late and the complete target matches: candidate only, then normal canonical gates.

This is one experiment for one distinct blocker, not four unrelated spelling trials.
If it fails without a new causal distinction, do not propagate it.
If it succeeds, test unchanged placement in 59D0, then each CF0 site separately, then 7BA8.
The CF0 first site has priority 3 rather than 1 and must not inherit the smallest-site conclusion.
Each propagation must retain its complete function's ABI, branch, stream, marker and restoration behavior.

A semantically justified real dependency would be an alternative reopen condition.
No such dependency is established by these inputs.
Do not invent allocation/global aliasing, success-only argument domains, pointer subtraction, extra calls, volatile side effects or undefined arithmetic to create one.
No missing representation capability is demonstrated: all owners already link exactly as hybrid under unchanged contracts.
The blocker is emitted instruction ordering, not auxiliary bytes, owner shape, placement or a linker escape.

## Input identities and evidence limits

All following SHA-256 values were read from the actual files.
Active source paths are src/battle/func_SYMBOL.c; pure-control paths are the archived filenames below.

| Symbol | Active source SHA-256 | Pure-control SHA-256 |
|---|---|---|
| 002158E4 | C3B18C44ADE13DB19119F0AED8EF483C0219BB6DFCFF287B611C5FDBA1F9B698 | C59E098C0633E9DE88F4ABB550A6CB124BC315584D254776C4ACE4AEDAFB91A1 |
| 002159D0 | 05B417FC6B488003B0011519B21D68D211BE211C0C32F3B6642DBBBEF32325E3 | 0069119A8570AB793446B1B77DB688871707BAF9B95516862C25D41A2285407D |
| 00215CF0 | 69C4F92273BC8469F007EE75A4F9239F6AF1D537E7951E66CF0A13E7A207EF30 | D1E9A5915BD38286869DC4FF67DF0EFD25932B3276B4E2CBF49828967A0A58B0 |
| 00217BA8 | 7571288045AADC6FD45045A9CBFD28BACB7D74DC800C3F8BBFDDD66943ACAF09 | 00168420BDA77475FA8045AB47DA8695508AD1C6F9B8D017CA2BD6CD30331A99 |

Pure controls under docs/archive/matching-c-candidates/:
2026-09-03-func_002158E4-a493a3ded3.c;
2026-09-04-func_002159D0-49a839eaea.c;
2026-09-04-func_00215CF0-20b217bd52.c;
2026-09-04-func_00217BA8-b4df0a7d7f.c.
CF0's historical dossier lists a different source hash; the actual archive hash above equals the authenticated later study input.
Do not use the older dossier hash to silently substitute a source.

Bridge func_0021C3B0 source SHA-256:
BE8E96C64511E82F3674FAC8A94BC4C23F6B82C7217E7F130F81F4099D90732E.
It remains accepted PURE_C, 512 bytes, and its blob also equals d70fd85.

Primary evidence:
- Corresponding dossiers a493a3ded3, b64e0169ad, 20b217bd52 and b4df0a7d7f.
- docs/matching-c/allocator-owner-order-study.md.
- docs/matching-c/allocator-scheduler-trace.md, accepted trace at 352f5d4.
- docs/matching-c/allocator-source-probe.md; unchanged causal signature 23809A8B11ABE9537D02B33CA8FD71B66243BA921A5A8D1E2F613026F51C6167.
- docs/Plans/task-logs/boot-conversion-wave-r2.md and accepted boot materializer source.
- Original complete owners under asm/original/rev0/lib/ and current five accepted sources.
- Current matching-methods plan, sequential program, shared-member reconciliation and future actor-wave draft.

The governing canonical/parent rules and workflows were read in this continuing worker context.
No W6 working source or configuration was interpreted.
Evidence grade: retained source/compiler observations are Supported; the new placement hypothesis is Candidate, untested and review pending.
The work verified identities and reconciled existing evidence only.
No compilation, linked diff, build, verifier, generator, runtime/database operation, candidate C file, agent or Git mutation occurred.
No canonical documentation change is proposed.

The future gate remains all four retries plus func_0021C3B0.
Bind the preceding context wave before activation.
One final normal verifier must cover all five PURE_C targets with exact ownership, placement, relocations, bytes and complete ROM.
Nothing in this report completes that wave or supplies a new source/semantic/structural acceptance.

Terminal handoff releases all owned report/evidence writes to /root. No command remains running.
