# Combat draw W8 R10: DB10 value use and generated initialization

W8 remains unresolved. No new production best is selected; 5BF6, D037 and exact local D764 remain preserved, along with the other eleven W8 controls. This report records input-specific source/compiler findings within the continuing fourteen-target assignment.

## Inputs and comparison

All twenty R8 source/shared inputs authenticated before experiments and were copied byte-for-byte into `build/combat-draw-wave8-r10/starting-inputs/`. Normal DB10 intake found the three valid R9 archives and separately flagged three superseded store observations. The default authenticated Kuna/m2c packet was reused on a cache hit (3.385s packet preparation; no decompiler rerun). Both decompiler outputs remain hypotheses.

Each input below classified PURE_C and received a pinned compile/assemble/private linked comparison against accepted DB10 retail bytes. Every interpreted trace agreed with pinned assembly for its exact input, apart from the known diagnostic-option comment. All generated evidence remains ignored under `build/combat-draw-wave8-r10/`; source cases have `db10/<name>/authored.c`, `policy.json`, `input.c` and `result.json`. Pass/HOME/access evidence is in `db10-traces/<name>/`.

| Input | Extent | Frame | Different bytes/words | Accessed + unused homes |
|---|---:|---:|---:|---:|
| control | 5548 | 552 | 41/28 | baseline |
| named-old-grouped-index | 5552 | 560 | 446/130 | 4+4 |
| named-old-new-index | 5548 | 552 | 99/46 | 4+3 |
| named-old-shared-limit | 5548 | 560 | 77/26 | 4+4 |
| named-old-value | 5552 | 560 | 446/130 | 4+4 |
| postincrement-bound | 5548 | 552 | 99/46 | 4+3 |
| predicate-before-increment | 5552 | 552 | 457/140 | 4+3 |
| sort-countdown | 5556 | 552 | 503/180 | 4+3 |
| sort-ordinal | 5552 | 552 | 523/178 | 4+3 |
| sort-ordinal-derived-offset | 5556 | 544 | 831/258 | 3+3 |
| sort-staged-countdown | 5548 | 552 | 100/88 | 4+3 |
| split-exit-conversion | 5556 | 560 | 443/131 | 4+4 |
| split-exit-shared-limit | 5548 | 560 | 68/23 | 4+4 |
| staged-countdown-split-limit | 5548 | 560 | 122/78 | 4+4 |
| staged-offset-before-bound | 5564 | 560 | 824/247 | 5+3 |
| staged-top-derived-offset | 5552 | 544 | 877/256 | 3+3 |
| staged-top-index | 5556 | 552 | 815/254 | 4+3 |

Postincrement-bound passed the canonical focused development path as PURE_C,5548 bytes,99 differing bytes/46 words and exact209-entry relocation contract (123.858s). Named-old-value was rejected for its5552-byte extent (71.638s). Split-exit-shared-limit passed that path as PURE_C,5548 bytes,68 differing bytes/23 words and exact209-entry relocation contract (114.611s). Staged countdown also passed the focused path as PURE_C,5548 bytes,100 differing bytes/88 words and exact209 relocations (116.339s). These development comparisons do not establish matching acceptance. No full-ROM verifier or runtime ran; shared tools, compiler identity/flags, structural ownership and relocation configuration remain unchanged.

## Single-counter source sequence

With count>=1, postincrement-bound starts run=0 and tests its old value against count-1. A true bound increments run before accessing that next member; a false bound still increments it to count. Thus it accesses the same member indices and submits the same total as the baseline run=1 scan on every defined execution. Count is bounded by the twenty-actor pass; unsigned increment cannot overflow. The existing total-count bound is retained, not changed to count-actorIndex. A small abstract check covered every exhaustion/first-mismatch position for counts1..20; this supplements the source argument and is not runtime evidence.

The unnamed postincrement form loses the fourth unused home: CSE resolves its old-value temporary to zero, and loop motion hoists the resulting entry predicate. Naming the old value and actually using it in resources[actorIndex+additional+1] retains its post-comparison use. Flow preserves that value through the comparison; combine then leaves a non-emitting USE and frame560. Naming alone while indexing with new run emits exactly the unnamed control's raw text and relocations. Parenthesizing additional+1 changes neither named-old output nor relocations. This is a real consumer/liveness distinction, not a naming or pseudo-number guarantee.

Saving the actual combined continuation predicate before increment preserves one recurrence but materializes its boolean with xor/sltu and keeps a shared loop header. There is no separately copied initial condition to fold into the fourth unused home.

Splitting total conversion between the actual mismatch and exhausted-bound exits retains4+4. The mismatch increment merges into its branch delay slot; exhaustion still increments separately. Giving the actual unchanged count-1 bound a shared additionalLimit outside the batch loop removes a duplicate bound computation and improves preheader delay-slot filling. The resulting5548/frame560 input differs by68 bytes/23 words with exact relocations. It has one counter recurrence, unlike R9 derived-total, but its zero-based indexing, conversion placement and separate sort preheader remain different from retail. Applying the same bound placement to named-old also restores5548 extent (77/26), while retaining its snapshot move. None is selected over baseline41/28 solely for frame or word count.

## Source-derived sort initialization

Countdown maps remaining20..1 to actor indices0..19 and exits with index20. Its original constant-minus form leaves the constant20 in an in-loop temporary which motion declines; no ascending GIV is recognized. One-based ordinal maps1..20 to the same indices and does produce a GIV, but its arithmetic benefit2 minus increment cost2 is zero. The compiler explicitly declines the reduction as0 versus143. Merely extending lifetime cannot overcome zero benefit.

Deriving the real scene offset from index*248 removes the independent offset recurrence but does not create additional address GIVs in this input. Shift/subtract/shift remains emitted and one accessed home disappears, reducing frame to544. The scalar index GIV is discovered late in the loop scan, after the body consumers; whether definition placement could change dependent recognition remains a hypothesis.

Staged unsigned countdown computes actorIndex=-actorsRemaining, then actorIndex+=20. Both operations are defined modulo2^32, and their combined bounded result is exactly20-remaining. This exposes NEG plus constant PLUS before combination. The retained compiler recognizes benefit4, reduces the ascending index GIV and eliminates the countdown. Its new zero initialization follows the hoisted bases; scheduling places it just before the final base spill. Register roles shift because the generated index receives a different allocation, so5548/frame552 and exact relocations still differ by100 bytes/88 words. The source mechanism succeeds; the complete preheader does not match.

The retained loop.c authenticates as1680B125630D5CCD6CCF9872AA0C5E6EC81E65B19C01F06F8B194656B60ABDD8. Its MINUS and NEG handling is present; MINUS support was never absent. Relevant logic is move_movables before strength_reduce at966–977, GIV benefit/cost at3780–3829, and generated initialization before loop_start at3879–3880. No compiler source or tool was changed.

## Remaining question and evidence boundary

The new split-exit/shared-limit source is a useful alternative to R9's full-extent4+4 state. The generated-initialization input independently validates ordering but changes register roles. Combining staged countdown with split-exit/shared-limit retained5548/frame560 and4+4 but differed by122 bytes/78 words; the register-role mismatch remains. This is an unselected full-input transfer, not matching acceptance. Neither mechanism identifies retail's authored variables. No dummy references, artificial storage, invalid pointers or new acceptance exceptions were introduced.

Canonical command durations include classification/cache/link work and are not compiler-only timings. Private compile/assemble/link calls record their measured wallMs per input (roughly0.2s each); interpreted trace commands record their actual command inputs and outputs. Reasoning/reporting time was not separately measured. Source hashes, complete bytes/relocations and diagnostic identity remain distinct from these authored interpretations.

## Connected definition/branch-placement controls

Moving the staged index definitions to the top of an explicit infinite loop, followed by the real index>=20 exit, preserves countdown elimination (5556/frame552,815/254). Deriving the actual scene offset immediately after that exit test still recognizes no dependent GIVs (5552/frame544,877/256). This contradicts the narrower expectation that discovery before body consumers alone suffices.

Moving only offset=index*248 before the bound test changes the result: .loop recognizes and reduces dependent GIVs with benefits6,12,14,15 and17, combines the identical offset expressions and eliminates the countdown. The final check computes the defined unused value20*248=4960; no memory access moves before the bound. Its5564/frame560 output differs by824 bytes/247 words and has FIVE accessed plus three unused homes. Generated address GIV1076 occupies516 with actual spill accesses. Matching frame size therefore reflects a different allocation mechanism than retail's four accessed/four unused homes. The guarded-after-bound control and before-bound source differ only in the placement of this real offset calculation. Retained loop.c can disable dependent derivation across jumps; the paired output establishes the placement effect without claiming an instrumented observation of that internal flag.

The supported sequence is now recorded. Remaining source questions concern preserving generated initialization order with retail register roles, and retaining the fourth non-emitting home while restoring retail's total-run loop. Additional permutations without a new value-use or induction-consumer distinction are not justified by these results. All twenty original inputs are restored at this boundary; no production source or relocation entry is proposed for selection. No full-wave acceptance is claimed.

## Preserved source links

| State | Source | Curated metadata |
|---|---|---|
| named-old-value | [exact C](../../../docs/archive/matching-c-candidates/2026-09-08-func_0020DB10-bef61cb3bf.c) | [observation](../../../docs/dossiers/func_0020DB10-bef61cb3bf.observation.json) |
| named-old-new-index | [exact C](../../../docs/archive/matching-c-candidates/2026-09-08-func_0020DB10-6bfc3b52a1.c) | [observation](../../../docs/dossiers/func_0020DB10-6bfc3b52a1.observation.json) |
| split-exit-shared-limit | [exact C](../../../docs/archive/matching-c-candidates/2026-09-08-func_0020DB10-92917d08c4.c) | [observation](../../../docs/dossiers/func_0020DB10-92917d08c4.observation.json) |
| sort-staged-countdown | [exact C](../../../docs/archive/matching-c-candidates/2026-09-08-func_0020DB10-fce4806774.c) | [observation](../../../docs/dossiers/func_0020DB10-fce4806774.observation.json) |
| staged-offset-before-bound | [exact C](../../../docs/archive/matching-c-candidates/2026-09-08-func_0020DB10-4dc08145c3.c) | [observation](../../../docs/dossiers/func_0020DB10-4dc08145c3.observation.json) |
