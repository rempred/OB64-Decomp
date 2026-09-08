# DB10 predicate origins R1

Completed read-only guidance. The current input has additional real predicates, but this pass found no evidence-backed new source lifetime recipe for a fourth comparison-only home. This is a bounded missing-decision result, not a pure-C impossibility claim.

Receiver `/root/combat_draw_continuation`, Director `/root`, launch `COMBAT-DB10-PREDICATE-ORIGINS-20260908-01`; starting HEAD `577f591241fec4587c024d56fba3ea118965469a`. Fresh claim was created atomically/read back. Governing guides and accepted diagnostic/survey were reused. Production belongs to the R3 successor; R2 remains frozen.

## Bound input and inventory

Evidence root: `build/combat-db10-predicate-origins-r1/`. `inputs.json` records the 16 exact copied source/pass/assembly/trace files from `build/combat-db10-allocation-trace-r1/guarded-dedup-for/`. Authored source SHA256 `5BF6ACF3CEF8F4A229AA143CCEB76376AC333B455BB1EDA18E9296476D791FD3`; expanded input `08561F8CD28616666538499F3F86CD3BB4A58D38B608DB0872742DFF5DCC375D`. Existing pinned/tracer assembly agrees after only the recorded `-da` option-comment difference. No executable was run here.

The parser selects only `func_0020DB10`, including inlined nodes and RTL mode/flag suffixes. It finds 44 integer comparison definitions, 12 floating condition-register definitions, and 153 conditional branches in initial RTL. These counts describe nodes, not independent source conditions. `comparison-origins.json` retains each defining node and its same-UID history; `conditional-branches.json` retains all branch nodes. Same UID does not guarantee the same operation after rewriting. The compact pass summary is an index, not an elimination proof.

## Dynamic predicates and the three known homes

All source lines below refer to the copied `authored.c`; UID references refer to the main function in copied dumps.

| Source origin | Initial UID / pseudo | Current retained fate |
|---|---|---|
| Dedup entry, line 340 | 2727 / 818, unsigned index77 < count84 | Known USE 3689 from combine; home 1DC. Same UID 2727 is rewritten to index clear, so tracking that UID alone would misidentify the predicate. |
| Dedup continuation, line 341 | 2734 / 819 | Real comparison remains through jump2, v0 = s0 < s2. |
| Post-dedup found test, line 346 | 2806 / 840 | Real comparison remains through jump2; flow records death of index77. No home for 840. |
| Insertion continuation, line 349 | 2831 / 841 | Real latch comparison remains. First jump pass also creates entry UID 3513 / 1024 using the cleared index77 and count84; that entry becomes known USE 3690, home 1F4. |
| Key/resource break, line 350 | 2848 / 847 | Real unsigned compare remains through jump2, v0 = t2 < v0. Loaded resource846 dies at this compare; key799 survives for the real insertion store. No home for 847. |
| Shift continuation, line 352 | 2872 / 848 | Real unsigned compare remains through jump2, v0 = s0 < t1. No home for 848. |
| Submission continuation, line 377 | 3103 / 926 | Real latch comparison remains. Jump creates entry UID 3523 / 1026 from cleared actorIndex85 and count84; known USE 3691, home 1FC. |
| Inner run bound, line 380 | 3116 / 928 | Real unsigned compare remains through jump2, v0 = s0 < s2. No home for 928. |

The four dedup equalities (UIDs 2751, 2762, 2773, 2784) and run resource equality (3139) begin as direct eq/ne branch operands, not separate Boolean comparison-result definitions. This is absence of such a temporary in initial RTL, not evidence of a temporary subsequently spilled or eliminated.

Domains: count, actorIndex, run, key and shift are u32. Shared index is int, converted to unsigned in these mixed comparisons. Variant is masked to 16 bits; flag10/flag8 are extracted bits. Key is assigned the 32-bit return of func_002015C8 into u32; this packet supplies no narrower return range. Preserve equality/tie behavior of key < resources[index]. Neither signed ordering nor subtraction-based ordering is justified for arbitrary 32-bit keys. Inner run compares with total count, exactly as written; count - actorIndex is not a supported replacement. Do not infer an 18-element bound merely from array declarations.

## Other real predicate families

Initial UIDs give precise retrieval anchors; complete nodes and pass fates are in the index.

- Fixed loops: slot < 5 (68,1417); pointer submissions index < 3 (735,1372,2606); sort actor < 20 (2652); policy/update < 20 (3337,3433); update index < 10 (3412). The relevant counter definitions/increments give their small loop domains; current comparisons remain emitted.
- Byte-derived selected index < 30 (122,275,894,1489,1642,2118) and sourceId < 100 (251,1618) remain emitted. Loads are zero-extended bytes; no extra dynamic-bound lifetime appears.
- Halfword truth and selector truth (260/263,1627/1630) feed the actual non-short-circuit Boolean OR. Halfword is 0..65535; selector is an unrestricted int. Both truth comparisons remain emitted; selector loads use its existing accessed home. A mode-suffixed `insn:HI` is not a deleted comparison.
- COPY_ROW class == 1 (392,1003,1759,2227) starts as an integer comparison result, then CSE retargets its destination to the live classIsOne value (for example 203 becomes 182 at UID392). It remains emitted. This is value reuse, not an extra unused comparison home.
- WORD id == 0x87 || == 0x88 is lowered to the range comparison at 477; the 0xA1 alternative is a direct equality branch. The loaded word is unrestricted by this test alone.
- Inlined peer guard/latch pairs (558/602,1198/1242,1909/1953,2432/2476) and scene_actor guards (3242,3366) retain actual immediate-bound comparisons. Presence, null, side and enable tests use real loaded/masked values and direct branches; no additional comparison-home event is recorded.
- The two remap_token expansions contain six ordered FP tests each (183,187,202,206,221,225 and 1550,1554,1569,1573,1588,1592). Their destination is hard CC_FP register67, not an SI pseudo awaiting a scalar home. Floating ordering cannot be inverted assuming NaNs absent.
- Remaining gates are direct truth/equality branches: byte/halfword gates; actor/pointer presence; flags; peer identity/type; auxiliary value; helper return; policy/status bits. Their complete initial branch nodes are retained. No claim that every loaded value has a narrow domain follows from a supplied C prototype.

## Retained controls and missing decision

`corpus-predicate-spellings.json` authenticates all 94 authored snapshots represented by the existing 93-distinct-input survey and extracts key/post-dedup lines. The key test remains unsigned less-than across index/insertion and grouped-resource variants. This source-text observation does not extend the survey's compiler coverage. The survey already establishes at most three non-emitting homes in its exact corpus; larger frames add accessed storage.

The existing R2 `try-db10.js` was read, never executed. It already covers dedup/insertion/submission predicate state, inclusive dedup bound, inner-run state/break/helper/guarded-do, shift state, bound helpers, operation blocks, signedness alternatives and work-entry predicates. Repeating these without a changed mechanism is unsupported. The later guarded source/context/resource aliases are also a preserved failure, not a new predicate lead.

Key/resource 847 is a remaining real value comparison whose specific Boolean-state spelling is not established by this bounded corpus scan. That fact alone does not justify another trial: unlike the three known entry predicates, neither operand is the entry-zero value making the comparison foldable, and its emitted result controls the actual insertion break. The current records supply no supported lifetime transition that would preserve a non-emitting USE for it. Likewise, post-dedup 840 remains a necessary live decision. Creating redundant tests or carrying unused comparison state would invent the sought mechanism.

The missing decision is therefore which genuine source lifetime/control history, if any, causes a fourth non-emitting allocation in a retail-equivalent input. No retail compiler input or event-time trace is available, and the accepted current records do not identify it. This reading does not close all possible source forms or explain retail's extra eight bytes.

## Release

No production source/config/build, shared tool, compiler/decompiler, diagnostic instrumentation, canonical diff or verifier was changed or run. No semantic/structural acceptance is claimed. All fourteen W8 targets and the single final complete-wave verifier remain the successor's combined gate. This report and its ignored evidence are complete; all writes for this predicate-origin assignment are released. R2 and both tool-evaluation reports remain closed.
