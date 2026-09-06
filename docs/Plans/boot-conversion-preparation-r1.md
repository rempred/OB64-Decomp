# Boot conversion preparation R1

Completed preparation; implementation remains pending. All three accepted owners are exact `HYBRID_C` in the inspected proof.
No inspected evidence establishes an inherent assembly requirement. The Director can assign one three-target conversion wave to the sole production writer.
This report proposes experiments, not matching acceptance. Research judgments are review pending.

## Scope and evidence identities

Inspected canonical main: `fc9e24707db1b423945055cb9a2fa92bff89029a`.
Parent main: `1c3be2509ebffde413be832b68f69e20d4e7d25c`.
`git diff 497181d HEAD -- src config tools` produced no differences.
Source observations below bind to these hashes, regardless of later disjoint tooling changes.

| Target | Current source SHA-256 | Original assembly SHA-256 |
|---|---|---|
| `func_00003798` | `33523A7202205B7AB2EDA9FF2154C4C6963BFBA405493089700D32669D6D3076` | `5024C973F005D3297EFA12B011FD7DD09D886DE0970A7C40A0A21A20DBC20CFE` |
| `func_00009EFC` | `46E7B84D3A344BCF23AECE92D2AC81684A43A0593CE72977383431871A19076C` | `1AD8EFEE9F07B8F458A5A50149F41CE977C0508C80B3714A1D7471D26E7BF28A` |
| `func_0000A1F8` | `D264B6D51EF37D25D8CFA196E701C26CA737EE3F14B31EB12085F191F7A00820` | `4BD0E4B4D0F03045CAA0223256EF3176D15F2CB1AC349016D602DCDD6D91AFFB` |

The normalized Rev 0 ROM was read-only and hashed to `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
The research-aide index routes byte-exact instruction questions directly to canonical boot assembly. That source foundation supplied the primary evidence.
No external decomp source or comparison excerpt was read.

## Accepted owners and existing proof

`config/matching-c-targets.json` activates each source. `config/phase8/matching-c.json` retains its accepted owner and legacy relocation contract.
All three are boot chunk 0 owners with no overlay descriptor.

| Semantic label used here | Symbol and section | z64 ROM interval | RAM virtual start | Bytes |
|---|---|---|---|---|
| State reset | `func_00003798`, `.ob64.r0025` | `[0x00003798,0x000037F8)` | `0x80073398` | 96 |
| Context materializer | `func_00009EFC`, `.ob64.r0089` | `[0x00009EFC,0x00009FD8)` | `0x80079AFC` | 220 |
| Recursive payload clear | `func_0000A1F8`, `.ob64.r0093` | `[0x0000A1F8,0x0000A250)` | `0x80079DF8` | 88 |

Primary IDs are respectively `primary:4c95a7be59461399a3bd`, `primary:fbd648970e4ce4cb4000`, and `primary:948967d22eb8c7cb717e`.
Existing `build/current/verification.json` has SHA-256 `2A837B56D02452A333704C31DBB70334831F7F7C6BD181A0F58FF1F4F64A6FAF`.
Its three target records report exact bytes, sole `objects/c/<symbol>.o` ownership, and no retained assembly slices.
Its source-object evidence and `build/source-policy/report.json` classify all three as `HYBRID_C`.
Its full-ROM result is exact. This is an inspected previous report, not a newly run verifier.

The complete target records, relocation details, policy records, and input hashes are in ignored `build/boot-conversion-preparation-r1/evidence.json`.
`build/current/state.json` identifies the existing build output under `C:/Users/Joe/.codex/ob64-consolidated-intake-20260906/work/current/3027a134be8c910726fda6cf/build/`.
That output contains each `generated/c/<symbol>.source-object-proof.json` and its untouched compiler assembly.

## State reset: `func_00003798`

Sources: `src/boot/boot_resource_state_reset.c:14` and `asm/original/rev0/boot/boot_resource_state_reset.s:12`.
The retail path calls two helpers, captures the resource pointer, clears four bytes, calls the pointer helper, stores its result, then clears a word.
The byte clears occur in descending symbol order, from `g_resource_state_byte_3` to `g_resource_state_byte_0`.
The final byte clear executes before the pointer helper body, in its call delay slot.
The current C splits that byte's address load and store across two inline-assembly blocks at lines 26 and 31.

**Prior attempt provenance.** Commit `751625e` contains `docs/matching-c/lane-a-b01-func_00003798-20260803/task-log.md`, especially probes 01–14.
Ordinary direct stores, reversed source order, a local return value, pointer volatility, and aggregate/address forms were tried.
Reported failures included a 100-byte result, a call `nop`, or an added saved register.
The retained probe-01 compiler assembly is `C:/Users/Joe/.codex/ob64-matching-c-worktrees/outputs/lane-a/b01-func_00003798-r1/probe-01/func_00003798.compiler.s`.
It contains ordinary symbolic stores and calls, without the final assembly escape.
Its reorder-mode text does not itself prove the final assembled delay slots.
The historical log's claim about a returned-pointer store in a call slot needs object-level reproduction before reuse.

**Bounded next hypothesis.** First restore ordinary descending byte stores before the helper, a local return value, and the final pointer/word stores.
Retest through the current authenticated KMC/GNU 2.6 path before recreating old workarounds.
If the final byte store still misses the delay slot, compare direct assignment and local-result lifetime forms, one change per linked diff.
Separate macro expansion from compiler scheduling using the untouched compiler assembly and final instruction words.
Do not keep a byte-address local across the call without evidence; prior evidence predicts an unwanted saved register.

**Falsifier and limit.** Wrong owner size, final byte-store placement, global addressing, or any linked word falsifies an exact candidate.
The old failed shapes establish bounded historical difficulty, not current impossibility.
“Shutdown” and meanings of the four bytes remain unsupported here. Preserve the address-named function and current cautious global names.

## Context materializer: `func_00009EFC`

Sources: `src/boot/boot_resource_node_lzss_context_materialize.c:27` and `asm/original/rev0/boot/boot_resource_node_lzss_context_materialize.s:12`.
The first call replaces node field `0x0C` with the helper result, passing its old value and zero.
When context field `0x04` is null, a missing node field `0x04` can be allocated and filled using node field `0x00`.
Node field `0x08` receives the size-query result even when that result is zero.
An existing node buffer bypasses that allocation but still reaches context materialization.
A nonnull node buffer supplies a second size query, context allocation, transfer call, and context field `0x0C = 2`.
The final global store always copies context field `0x08`, including paths that skip materialization.

The current escape set includes two inline call sequences and register bindings for zero, results, arguments, and the final output.
All must disappear for `PURE_C`; deleting only the two instruction blocks is insufficient.
The source's pointer-typed `g_resource_context_output` receives the size-like scalar at context field `0x08`, not context field `0x04`.
This field flow is decisive; a broader global type or semantic rename still requires its other consumers.
Do not cache the context pointer across calls: retail explicitly reloads the global afterward.

**Prior attempt provenance.** Commit `7a5eca3` contains `docs/matching-c-records/OB64-MC-6LW01-LANE-C-ORD006-20260804-R1/task-log.md` and `classification-evidence.md`.
The concrete recorded failure is a hybrid candidate using `v0` instead of `v1` in the final load/store.
The two differing bytes were z64 ROM offsets `0x00009FBD` and `0x00009FC5`.
A final register binding corrected them historically.
The retained `C:/Users/Joe/.codex/ob64-matching-c-20260804-lane-c-ord006-r1/phase8/probe/func_00009EFC.compiler.s` already contains both `#APP` blocks.
The inspected log and classification record do not identify a complete pure-C candidate or its concrete linked failure.
This is a search-bounded provenance gap, not proof that no such attempt ever existed.

**Bounded next hypothesis.** Reconstruct the two calls with ordinary prototypes, preserve the nested null guards, and keep node/context layouts explicit.
Use ordinary assignment results for each allocation and the size store; remove every zero-register addition and register binding.
Preserve the common final store after all conditional paths.
The first early diff should distinguish call scheduling, zero/move encodings, and final temporary allocation as separate problems.
If only the final register differs, compare a scoped scalar temporary against the direct field expression and inspect its live range.
If the second size-call load is hoisted, compare an explicit buffer local inside its guarded block against a direct field argument.
Recheck reload behavior after calls rather than assuming equivalent pointer lifetimes generate equivalent bytes.

**Falsifier and limit.** An added null guard, omitted zero-size store, cached context across calls, or changed final field copy violates observed behavior.
Wrong prologue, zero argument encoding, delay slot, or output register falsifies an exact candidate.
The target source supports cautious shared node fields; no matching shared header was found in the inspected `include/` and boot-source searches.
Sharing those layouts is a source-quality opportunity, not a demonstrated machine-code requirement.
Do not infer allocation-failure safety, ownership meaning for field `0x0C`, or a named state meaning for literal 2.

## Recursive payload clear: `func_0000A1F8`

Sources: `src/boot/boot_resource_node_recursive_payload_clear.c:13` and `asm/original/rev0/boot/boot_resource_node_recursive_payload_clear.s:12`.
A null node returns. Otherwise, recursion visits fields `0x10`, `0x14`, and `0x18` in that order.
Only afterward does nonzero field `0x0C` trigger the helper on field `0x04`, followed by a zero store to field `0x04`.
The guard tests field `0x0C`, not the payload pointer. The node itself and field `0x0C` are not cleared here.
The current escape set is two register bindings, artificial zero addition, and an empty memory-clobber assembly barrier.

**Prior attempt provenance.** Commit `fb9de60` contains `docs/matching-c/lane-a-b01-func_0000a1f8-20260803/task-log.md`.
Its ordinary-C probe reported an 88-byte candidate with the payload load in the conditional-branch slot.
Retail instead has a branch `nop` and places that load in the helper-call slot.
An explicit assembly `nop` added a word and was rejected; an empty barrier plus fixed-zero arithmetic produced the retained hybrid.
The ordinary compiler assembly survives at `C:/Users/Joe/.codex/ob64-matching-c-worktrees/outputs/lane-a/b01-func_0000a1f8-r1/probe-ordinary/func_0000A1F8.compiler.s`.
It has ordinary recursive calls and field loads, but its reorder-mode text alone is not final scheduling proof.

**Bounded next hypothesis.** Start with a plain node parameter, the null guard, three explicit recursive calls, and the guarded helper/clear pair.
GNU 2.6 may remove the historical move-encoding and scheduling motivation; the early linked diff decides this.
If payload-load speculation persists, compare a block-local payload expression and an early-return form of the final guard.
A narrowly volatile payload access is a later candidate only if a concrete mismatch requires preventing speculation.
It must not add reads or imply hardware volatility; document its measured code-generation purpose if retained.
Do not replace the three calls with a loop unless evidence supports the extra loop machinery.

**Falsifier and limit.** A payload load before the observed guard, changed child order, or an altered release condition rejects the reconstruction.
Wrong `s0` copy encoding or either delay slot rejects exact matching even when behavior agrees.
Static recursion does not prove that every runtime graph is acyclic, a binary tree, or exclusively owned.

## Execution handoff and limits

All proposals are `Candidate`; instruction/data-flow observations are `Supported` at the inspected static scope, with review pending.
Existing mechanical proof is reported at its exact input identities and does not accept these uncompiled proposals.
A decisive competing interpretation is that old assembler behavior caused some historical failures.
The accepted migration document `docs/audit/2026-08-12-gnu-binutils-2.6-toolchain-migration.md:13` records removal of GNU 2.39 and its dialect adapter.
That is why a fresh plain-C comparison under today's fixed toolchain is a distinct experiment.
No compiler, assembler, boundary, linkage-rule, or source-policy change is proposed.

The implementation worker should complete one target at a time and retain actual source/linked-diff identities for each attempt.
After all three are ready, use one final complete-wave verifier and confirm each is `PURE_C` in that report.
Do not add a review-only repeat or per-function full-ROM gate.
If a genuine current pure-C attempt remains blocked, report its precise mismatch and exhausted supported hypotheses.
The inspected historical records alone do not authorize final hybrid fallback for this new assignment.

No required input blocks preparation. Current pure-C generated output remains the required new evidence during implementation.
No compilation, linking, build, verifier, runtime, agent, branch/worktree, staging, commit, or push occurred.
Only the assigned claim, report, task log, and ignored evidence snapshot were written.
No canonical-document change is proposed beyond future source comments justified by actual compiler mismatches.

Final read-only checks confirmed every original `.word` against its normalized-ROM interval.
All three current source hashes and assembly hashes still match the inspected accepted records.
The assigned report and log were checked for trailing whitespace; the evidence snapshot parses and remains ignored.
