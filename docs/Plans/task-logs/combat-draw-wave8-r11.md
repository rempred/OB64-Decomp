# Combat draw W8 R11: traversal identity and flag storage

This counter/flag sequence is complete; the full fourteen-target W8 wave remains unresolved. No new production best is selected. All twenty R8 source/shared inputs authenticated and were preserved byte-for-byte under `build/combat-draw-wave8-r11/starting-inputs/`, including D764's local line endings. They are restored at this boundary. Prior R9/R10 archives and evidence remain frozen.

## Measured inputs

| Input | Extent | Frame | Different bytes/words | Accessed + unused homes |
|---|---:|---:|---:|---:|
| baseline-control | 5548 | 552 | 41/28 | 4+3 |
| baseline-update-index | 5548 | 552 | 41/28 | 4+3 |
| staged-control | 5548 | 552 | 100/88 | 4+3 |
| staged-update-index | 5548 | 552 | 72/60 | 4+3 |
| staged-update-policy-indices | 5548 | 552 | 72/60 | 4+3 |
| staged-flags-snapshot | 5564 | 544 | 739/231 | 3+3 |
| address-control | 5564 | 560 | 824/247 | 5+3 |
| address-flags-snapshot | 5580 | 552 | 862/263 | 4+3 |
| staged-packed-flags | 5548 | 544 | 429/152 | 3+3 |
| staged-call-boundary-flags | 5564 | 552 | 682/229 | 4+3 |
| staged-packed-call-flags | 5556 | 552 | 706/230 | 4+3 |

Every input classified PURE_C and received a pinned private compile/assemble/link comparison. Every interpreted diagnostic trace agrees with pinned assembly for its exact input, excluding only the known diagnostic-option comment. Private sources, policies, expanded inputs and results are in `build/combat-draw-wave8-r11/db10/<input>/`; dumps, HOME/access evidence and commands are in `db10-traces/<input>/`.

Staged-update-index passed canonical focused development comparison with **72 differing bytes/60 words and the exact 209-entry relocation contract** in 108.349s (601 sibling cache hits, zero misses, one requested compile). Raw snapshot was rejected for incorrect extent in 65.395s. Packed flags recover the 5548-byte extent, but their complete relocation list differs from baseline despite the same count of 209. Private comparisons and successful focused commands do not establish matching acceptance. No full-ROM verifier ran.

Normal preparation reused the authenticated default Kuna/m2c packet on a cache hit (3.002s), with fresh research intake. The outputs remain hypotheses; no decompiler regeneration was needed. Canonical timing includes classification/cache/link work, while private result wallMs covers its own compile/assemble/link call. Reasoning/reporting time was not separately measured.

## Separating independent traversal identities

The first change replaces only the final update traversal's function-scope actorIndex with block-local u32 updateIndex. Initialization, values 0..19, scene_actor arguments, updateOffset recurrence, ten-call inner loop, casts and bounds remain identical. Batch initially retains actorIndex and policy retains count. No later use reads the final traversal's counter.

In the staged control, actorIndex pseudo 85 has 28 uses over 58 instructions and crosses two calls. After splitting, batch 85 has 19/33/one call and updateIndex 982 has 9/25/one call. Their conflict union separates: batch keeps count 84, run 929, resource 941 and source-base 1012; update owns peers 77, 983, 984 and 986. The genuine batch/count conflict remains. Count now receives register 18, batch 17, update 19, and generated sort index 1075 still receives 30. Pseudo IDs here belong only to that exact input.

The identical source split on 5BF6 emits complete raw text and relocations identical to 5BF6. Thus its output effect depends on staged-countdown context. The connected policy-only split further separates its independent zero-initialized traversal: count's statistics drop from 41 uses/187 instructions/six calls to 32/146/three calls, while policyIndex 961 has 9/41/three calls and its own conflict neighborhood. Nevertheless its raw text and relocations equal staged-update-only. Graph separation alone does not promise different bytes.

## Flag value history

The allocation evidence identifies flag10, rather than the batch source-base pointer, as the register-19 blocker during sorting. Generated sort index has genuine conflicts occupying saved registers 16..23. Batch source base is a distinct quantity that does not conflict with that sort index. The original flag values must survive deduplication, the key call and insertion; reloading the actor field after the call is not justified.

The raw snapshot captures FLAGS(actor) immediately after the variant call and extracts bits 8 and 10 from that captured value at the existing consumers. The two original adjacent field loads were already coalesced by the compiler; this is a storage/lifetime experiment, not a saved-load claim. One snapshot word now crosses the key call, and normalized extracts are repeated by phase. One base spill disappears, giving three accessed plus three unused homes and frame 544. Generated index moves to register 23 while the snapshot occupies 19. Extra extraction yields 5564 bytes.

Applying only that snapshot change to R10's before-bound dependent-address source preserves its actual induction reductions and removes the generated-address spill. The result has four accessed plus three unused homes, frame 552 and 5580 bytes. This is a confirmed transfer of reduced storage demand, not matching progress.

The two-bit snapshot ((u32)FLAGS(actor) >> 8) & 5u retains exactly the needed values. Consumers use & 1u and >> 2; the latter is 0 or 1 from the mask. It removes 16 bytes of repeated extraction and restores 5548 extent, but retains frame 544 and incorrect relocations/register roles.

A separate call-boundary control keeps the raw snapshot only through deduplication, then creates insertion-only normalized flags immediately before the key call and reuses them for insertion. The snapshot becomes caller-only; two normalized quantities again cross the call. The base spill returns (four accessed plus three unused), and the source base now blocks register 19; generated index remains 30. Post-call extraction disappears, but pre-call argument handling and storage costs leave extent 5564. Combining the compact mask with that genuine call boundary reduces extent to 5556, still with four accessed plus three unused homes. No field reload, dummy reference or unnecessary store was added.

## Remaining source question

The counter split improves staged-context output, but does not restore the retail register assignment or missing unused home. Flag representations preserve values correctly and change storage, yet either retain a saved snapshot blocking the desired register or restore separate normalized values and another competing base. None improves the selected 5BF6 byte comparison.

Read-only compiler evidence also shows that the generated index GIV was already nonreplaceable: a copy back to actorIndex is emitted, dies at its sole predicate consumer in flow, and is deleted by combine. A declaration or replaceability spelling alone therefore supplies no new discriminator. Actual derived-address consumers have been tested in R10/R11; additional uses must not be manufactured. Further matching needs a distinct supported source/value-use question, not a register-forcing or type/name permutation sweep.

All source bests and twenty protected inputs are restored. No shared tools, compiler identity/flags, structural contract, relocation configuration, runtime, branch or worktree changed. No full-wave acceptance is claimed.

## Preserved source links

| State | Source | Curated metadata |
|---|---|---|
| staged-update-index | [exact C](../../../docs/archive/matching-c-candidates/2026-09-08-func_0020DB10-810c6dd6b8.c) | [observation](../../../docs/dossiers/func_0020DB10-810c6dd6b8.observation.json) |
| baseline-update-index | [exact C](../../../docs/archive/matching-c-candidates/2026-09-08-func_0020DB10-decf860608.c) | [observation](../../../docs/dossiers/func_0020DB10-decf860608.observation.json) |
| staged-flags-snapshot | [exact C](../../../docs/archive/matching-c-candidates/2026-09-08-func_0020DB10-13e72dd5e6.c) | [observation](../../../docs/dossiers/func_0020DB10-13e72dd5e6.observation.json) |
| staged-call-boundary-flags | [exact C](../../../docs/archive/matching-c-candidates/2026-09-08-func_0020DB10-707001d812.c) | [observation](../../../docs/dossiers/func_0020DB10-707001d812.observation.json) |
| staged-packed-flags | [exact C](../../../docs/archive/matching-c-candidates/2026-09-08-func_0020DB10-e8c0c11bb0.c) | [observation](../../../docs/dossiers/func_0020DB10-e8c0c11bb0.observation.json) |
| address-flags-snapshot | [exact C](../../../docs/archive/matching-c-candidates/2026-09-08-func_0020DB10-fd3ed7315a.c) | [observation](../../../docs/dossiers/func_0020DB10-fd3ed7315a.observation.json) |
