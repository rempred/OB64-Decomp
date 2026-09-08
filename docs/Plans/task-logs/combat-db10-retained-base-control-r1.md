# DB10 retained base control

Completed disjoint read-only support. Worker `/root/db10_allocation_trace`, Astra Medium; Director `/root`; activation `6f1c6326`, launch `COMBAT-DB10-RETAINED-BASE-CONTROL-20260907-01`. The fresh claim was atomically created and read back before other writes. Evidence is under ignored `build/combat-db10-retained-base-control-r1/` (R). No new compilation or source trial ran.

The retained named-sort-bases control **does not obtain the desired complete clear/base order**. It moves some explicit pointer definitions before the counter clear, but the source pointer definition is scheduled after it and the resource-address hoist remains afterward. Its extra accessed four-byte slot at `sp+0x210` preserves the live `variant` value: the masked result of `func_00045934`, needed after `func_002015C8` for insertion into the variant array. It is neither an unused allocation nor another pointer home.

## Identities and comparison scope

Named source SHA256 is `0D30080F69E50ED4D9DFA54C03661BB21BBC12AEB0E4426EC0C223A2D4D47FCC`; complete input is `16F4096540BBCD7B8449428E08DD4642CB59D6D9289FD2F825B30266BAB1D528`. Source, retained assembly and exact ordinary passes were authenticated from the earlier allocation survey's manifest and copied into `named/`. Pinned assembly is `68F80E41AAEBC71BF5E6E339CCEF45B26A049F464819486FE9146B32B7033B1E`. Retained diagnostic assembly matches pinned assembly after only the exact `-da` options-comment delta. `authentication.json` binds selected files and manifest identities.

Current guarded-dedup source authenticates as `5BF6ACF3CEF8F4A229AA143CCEB76376AC333B455BB1EDA18E9296476D791FD3`. Current instruction/pass evidence is reused from the frozen initialization locating manifest `C60EEE4281A0693EF059F45F0FB94FC7E69CB382E7B308CFB5A76980F4AC7215` and copied to `current-instructions.json` / `current-passes.json`.

Only one additional retained control was inspected: older null-first-peer-flags, source `A2CFD7EFF3CE04ABD178D5CB577F37B9E218ACBC4F312A95D6FE90C02DB19C61`, input `E9280D970F8CFFE1CAB7AD40438903C8F7297FFEFDD53CA25E4112C597879268`. Its selected files authenticate against accepted trace manifest `9D5DA4FFBB47C1060F36C3F8714FEA4E81EA2D6B1BBE1A5B4E1CC3541B18A81F` and reside in `older-base/`. It is a source-control comparator, not substituted current linked evidence.

`older-base-to-named.patch` establishes that the named control adds three pointer aliases—sources, contexts, **variants**—and uses them throughout the outer actor loop. `current-to-named.patch` additionally shows that named lacks the current dedup entry guard. Consequently, the named result is not a one-variable test against current guarded-dedup. Its retained predecessor is the correct one-variable source comparator.

## Actual order and address values

An important precision correction to `docs/Plans/task-logs/combat-db10-initialization-residual-r1.md`, SHA256 `164020BA726BF841B031556FA57BC76420AD58B341491B2EF8E0798D608A2606`: current hoisted `sp+0x5C` and `sp+0xA4` are **biased address bases** used for `contexts[shift-1]` and `resources[shift-1]`. Natural array starts are `contexts = sp+0x60` and `resources = sp+0xA8`. The prior description “contexts/resources base” must not be read as natural element-zero addresses. This corrects only the source association precision; all previously recorded instruction words, offsets and ordering remain true. The frozen predecessor is not edited.

Current declarations are `int sources[18], contexts[18]; u32 resources[18];` (lines150–151), with four-byte elements. Current source lines354–355 perform `contexts[shift] = contexts[shift - 1]` and `resources[shift] = resources[shift - 1]`. The preserved `current-indexed-access-rtl.txt` shows current left-hand element-zero offsets72/144 versus right-hand preceding-element offsets68/140 from the virtual local base. With that virtual base materialized as `sp+24`, the natural starts are96/168 and the biased arithmetic bases92/164. Thus `contexts + 4*(shift-1)` in machine-address arithmetic is represented by `(sp+92) + 4*shift`; this is not an authored one-before-array C pointer. Named's explicit `contextList` instead points at the actual first element, virtual offset72→`sp+96`; `variantList` uses virtual216→`sp+240`. Its declarations and indexed uses are preserved in the exact source diff and initial RTL.

The relevant named emitted preheader after the same second-slot-loop exit is:

```text
addu t5,sp,0x60       # contextList natural element-zero base
sw   t5,0x1DC(sp)
addu t5,sp,0xF0       # variantList natural element-zero base
move s7,zero         # sortOffset
move s3,zero         # actorIndex
addu fp,sp,0x18      # sourceList natural base
move s6,fp           # additional compiler address value
sw   t5,0x1E4(sp)    # preserve variantList
addu t5,sp,0xA4      # resource shift predecessor-address base
sw   t5,0x1EC(sp)
addu t5,sp,0x134     # flag10 shift predecessor-address base
sw   t5,0x1F4(sp)
.L241:               # load D_801CE8BC and test actor field
```

The named source pointer definition starts in initial RTL as UID2644/pseudo793 before counter UID2654/pseudo85; contexts UID2646/pseudo794 and variants UID2648/pseudo795 also precede it. `.loop` still has those three definitions before the clear, but adds additional hoists UID3629 (`sp+24`), UID3630 (`sp+164`) and UID3631 (`sp+308`) after it. `.sched` moves UID2644 after counter UID2654 and turns UID3629 into a copy from sourceList. These observed pass orders persist through emitted code. The failure is therefore more specific than saying every explicit base always remains after the counter: context and variant definitions precede it, while the source base and resource-address operations required for retail's target sequence do not.

Current/retail target sequence concerns `sources` natural base plus biased context/resource shift bases; named instead explicitly aliases `sources`, `contexts`, **variants**, and also retains compiler-derived resource/flag10 shifted-address bases. It is not a retained test naming precisely the three values involved in the six-word residual.

All displayed base/stack instructions are direct register/immediate operations, not symbolic relocations. Named changes their values/registers and emitted operation count, rather than just permuting the current six words. In particular, its natural context `0x60` differs from current's biased `0x5C`, and its context home `0x1DC` differs from current/retail `0x1E4`. Its variant home at `0x1E4` must not be mistaken for the current context home at that same numeric address.

The exact named package retains source/assembly/passes, but no matching named raw object or actual relocation table was found in its scoped evidence. Only `.c/.s` are retained under the named R1 prefix, and the survey input package has no object. No new object was assembled because compilation is prohibited. Therefore this task cannot authenticate a full named-versus-current relocation delta or native owner offsets for the named assembly. The symbolic `func_00045934`, `func_002015C8`, and `D_801CE8BC` anchors identify the sequences; current actual relocation evidence remains available, but is not substituted for named relocation facts.

## The additional accessed spill

Source line337 assigns:

```c
variant = func_00045934(HALF(actor,0x36), HALF(actor,0x38),
                       HALF(actor,0x3A), HALF(actor,0x3C)) & 0xFFFF;
```

It is consumed in the dedup comparison against `variantList[index]`, then—if insertion is required—retained across the key-producing `func_002015C8` call and stored by `variantList[shift] = variant`. The name here is the existing source variable, not a strengthened behavioral interpretation of either called function.

| Evidence event | Exact value correspondence |
| --- | --- |
| producer call UID2715, then definition UID2718 | masked return becomes pseudo805; initial RTL explicitly ANDs65535 |
| comparison UID2761 | pseudo805 compared with loaded variantList element |
| `.flow` | pseudo805: seven uses,90 instructions, one crossed call |
| `.greg` UID2718 | `zero_extend` of return register into hard register12, `t4`; emitted `andi t4,v0,0xFFFF` |
| store UID3685 | writes `t4` to `sp+528` (`0x210`) immediately around call UID2819 |
| call UID2819 | `func_002015C8`; its result goes into the separate key value, eventually `t3` |
| reload UID3686 | restores `t4` from `sp+0x210` |
| address UID3027, store UID3029 | address is variantList pseudo795 plus scaled shift; stores pseudo805, now `t4` |

Final assembly puts the `sw t4,528(sp)` in the key call's explicit delay slot, reloads `t4` immediately after return, and later emits `sw t4,0(v0)` at the variant insertion address. The new slot therefore preserves an actual scalar needed by a real store; it does not hold the key returned by the intervening call. Source and exact per-pass definitions/uses are in `named-passes.json`, with complete authenticated dumps in `named/`.

The retained trace records nine initial SI homes, each requesting4 rounded to8, ending at local extent504. These cover selector/latch, four accessed pointer-address homes and three non-emitting comparison homes. A later SI request4 with alignment4 advances504→508 and returns stack address528. Final local alignment gives512, plus24 outgoing argument bytes and40 saved-register bytes, yielding frame576. This is distinct from current frame552 and retail560. Relative to current's seven initial homes, the named control adds two initial rounded homes and the later four-byte scalar spill, with final alignment accounting for the24-byte frame increase. The trace/pass join identifies the preserved value; it does not establish an unavailable retail allocation cause.

R1 historically reports named function extent5620 versus accepted5548, whereas the frame576 is directly confirmed in its authenticated assembly. Without a retained exact object this task does not independently remeasure that named extent or attribute all reported72 bytes to this spill. The explicit address copies, extra accessed pointer homes, scalar save/reload, changed pointer arithmetic and unrelated register/scheduling differences are separate residuals; the scalar spill alone is two instructions, not an explanation of every difference.

## Smallest remaining source/lifetime question

This retained control does not test whether the **current guarded-dedup** input can use only the needed source/context/resource addressing relationships while leaving variants unaliased, avoiding the extra variant-pointer lifetime and retaining the masked variant through the key call without this accessed spill. Its alias set differs from the actual six-word target set, and its missing entry guard is an independent confound.

That is a bounded untested question relative to the exact controls inspected here, not a prescribed successful rewrite or a claim that the full historical corpus never tried every related spelling. The production owner should check its saved trial descriptions before any new experiment. Even explicit source pointer initialization before the clear in initial RTL is insufficient by itself: this named control's scheduler later moves it behind the clear. A future test would need to preserve actual operations and inspect both optimized preheader placement and the masked variant's live path across `func_002015C8`. Do not encode biased previous-element addresses as out-of-bounds C pointers merely to mimic the compiler's internal arithmetic.

No new generic compiler-cause, semantic, structural or matching claim follows. No matching acceptance or ordinary matching-review gate is added. All fourteen W8 targets, one final complete-wave verifier, later families, production ownership and no-push instruction remain intact.

`inspect.js` authenticates/copies only named evidence, one direct predecessor and current locating outputs; `diffs.py` produces the two exact source comparisons. `manifest.json` binds the final task evidence. At completion all writes are released; prior reports/roots, production/tooling/configuration, compiler identities, accepted owners/linkage, runtime/Resolver and Git remain untouched.
