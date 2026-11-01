# E03 runtime compiler observations

These eleven observations preserve exact historical sources and measured controls.
Private normal-model imports remain uncompiled research; their selected-mi15 native
references retain their original context. Canonical acceptance belongs separately to
[the complete E03 wave](../../build/integration/attack-effects/e03/wave-acceptance.json).
No observation establishes a universal compiler mechanism or strengthens uncertain field names.

## func_00261C90

Use slot->next_00=index+1 and index++ in the loop update, retaining pointer traversal, unsigned types, allocation and post-call count read.

KMC now emits separate index+1 temporary, halfword store and index copy; complete extent112B and rawObjectRelocationMaskedExact=true. No other C behavior changed.

See [the source and controls](../dossiers/func_00261C90-12155a01fa.md) and
[the authenticated observation](../dossiers/func_00261C90-12155a01fa.observation.json).

## func_00261DA8

Express allocation/pop and initialization in an ordinary static inline C helper; clear words before setting field18=1, then caller stores payload and registers it.

Recovers incoming A1 copy and A0 payload/S0 return lifetimes; reordered flag store removes remaining scheduling differences. Full136B PURE_C raw-relocation-masked object equality; helper emits no separate function.

See [the source and controls](../dossiers/func_00261DA8-d4c4f7315c.md) and
[the authenticated observation](../dossiers/func_00261DA8-d4c4f7315c.observation.json).

## func_00261E90

Use direct global base/count/index expressions in both initializer phases instead of cached local bases/bounds; retain record pointer for free-link walk.

Restores guard-to-loop count and pointer copies and expected register assignments. Full208B PURE_C raw-relocation-masked equality. Local-cache, split-counter and alternate array controls were not selected; regressions do not disprove underlying structure.

See [the source and controls](../dossiers/func_00261E90-91b83a5b6c.md) and
[the authenticated observation](../dossiers/func_00261E90-91b83a5b6c.observation.json).

## func_00261F84

Use three-element direct command-pair indexing, global output[used] stores in both grouping loops, then record++ before index++ in the grouping-loop update.

Direct pair indexing removes table pointer/end saved registers and restores frame64 while initially worsening score; global output indexing induces separate outer and inner output cursors and guarded count snapshots, restores736B/97.5 score; loop-update order resolves four register/scheduling fields. Final raw-relocation-masked exact, one full body. Controls preserve all phases and are not selected as best.

See [the source and controls](../dossiers/func_00261F84-cdd8695e98.md) and
[the authenticated observation](../dossiers/func_00261F84-cdd8695e98.observation.json).

## func_00262450

Replace cached local task/count/stack_count and pointer-walk clearing with direct global base/count/index expressions; preserve assignment and initialization order.

Restores expected countA5/baseA6 allocation and guard-to-loop copies. Native extent304->312B and PURE_C raw-relocation-masked exact. This repeats the measured E90 lesson in0x9C task records, without asserting generic invariance for all functions.

See [the source and controls](../dossiers/func_00262450-d58c7a95c1.md) and
[the authenticated observation](../dossiers/func_00262450-d58c7a95c1.observation.json).

## func_00262730

Move global list-tail traversal assignment from a while body into an otherwise empty for-loop update; preserve loop condition, insertion operations and all aliases.

KMC emits original repeated global tail reload, V0 temporary and delayed global store rather than incoming-parameter register cache/move.172->176B and full raw-relocation-masked exact. Same for-update lesson also helps inlined traversal2910.

See [the source and controls](../dossiers/func_00262730-ee0b0d69ce.md) and
[the authenticated observation](../dossiers/func_00262730-ee0b0d69ce.observation.json).

## func_0026285C

Return the task callback s32 result from the wrapper after context restore; retain direct predecrement push/preincrement pop and both post-call global reloads. Correct this candidate forward declaration to s32.

Original V0 remains unchanged after jalr through return. Making this value live across context restore shifts index/base/address+parent from V3/A4/V0 to exact A4/A5/V3; all10 register fields resolved, same136B/frame24. No visible caller-consumption claim. Parent-local and void-inline helper controls reproduce baseline; parameter reuse worsens pre-call allocation.

See [the source and controls](../dossiers/func_0026285C-60cfc57a70.md) and
[the authenticated observation](../dossiers/func_0026285C-60cfc57a70.observation.json).

## func_00262910

Use for-update tail traversal as independently measured at2730, plus ordinary static inline allocator returning the full task pointer before constructor/list/context initialization.

For-update alone improves extent408->412B but worsens score; not selected as best and does not disprove traversal hypothesis. Inline allocator restores original V3 pointer and S0 copy in jump delay; full416B PURE_C raw-relocation-masked exact, one emitted body, no helper call. Complete list/context/callback setup retained.

See [the source and controls](../dossiers/func_00262910-282790eee6.md) and
[the authenticated observation](../dossiers/func_00262910-282790eee6.observation.json).

## func_00262CC0

Express pool initialization and free links with direct global base/count/index expressions instead of cached bounds and walking a local record pointer.

First multi-field clear keeps record base in V3, stores fields at+4/+C and increments index in original position; second guard/loop count copy restored.224->228B and full PURE_C raw-relocation-masked equality. This is a measured transfer of E90/2450 global-array lesson, not a universal rewriting rule.

See [the source and controls](../dossiers/func_00262CC0-e0ddaf763f.md) and
[the authenticated observation](../dossiers/func_00262CC0-e0ddaf763f.observation.json).

## func_00262DD4

Use direct global array expressions, one outer index reused across phases and a separate inner scan. Spell the strict maximum check item>endpoint. Initialize index before used outside first loop.

Global arrays restore380B and both endpoint-slot induction paths. item>endpoint restores original FP load/compare operand order plus reload only after minimum swap. Reversing initial counter initialization order fixes the remaining four prologue register/save fields; moving same-order init outside for or swapping declarations alone does not. Full raw-relocation-masked equality, frame56. All inclusive scan/endpoints, strict comparisons and post-minimum swap reload retained.

See [the source and controls](../dossiers/func_00262DD4-2bb0d35e3c.md) and
[the authenticated observation](../dossiers/func_00262DD4-2bb0d35e3c.observation.json).

## func_00262F50

Use separate command-cursor postincrements for both packets; model the observed0x40-byte matrix stride as a private block type and use matrix-cursor postincrement inside each word04 assignment.

Separate packet increments alone recover constant A6/A7 but move argument mask to last call delay, worsening score at unchanged256B. Matrix postincrements recover original global cursor-store-before-packet-store order and original call-delay packet store. Full256B/frame40 raw-relocation-masked equality.64-byte private block records stride only; no new alignment/field meaning or linked addresses certified.

See [the source and controls](../dossiers/func_00262F50-34301cefb6.md) and
[the authenticated observation](../dossiers/func_00262F50-34301cefb6.observation.json).

The old private cursor spelling D_800F9BA0 is retained only as historical evidence.
Canonical integration uses D_800E9BA0: original LUI0x800F plus signed low0x9BA0.

