# Evidence brief: three W8 residuals

This is an authored synthesis of linked repository reports, not a new generated proof report. Status and source identities refer to `3815708b` on 2026-09-08. Metrics below are inherited from the cited reports, not freshly measured here.

## Compiler and comparison context

Production uses authenticated Windows KMC GCC 2.7.2 `cc1.exe`, SHA-256 `F3F1C99A322F5B3D8C108C2A44AF1D6D084DD27575C5D60BF0F0D33FFF34B1C6`. The accepted flags in [matching-c.json](../../../config/phase8/matching-c.json) are:

```text
-quiet -O2 -meb -mips3 -mgp32 -mfp32 -G 0
-fno-PIC -mno-abicalls -fno-builtin -funsigned-char
```

The cc1 artifact does not preprocess directives. The authenticated external companion preprocesses headers/macros with `-P -undef -nostdinc` and repository `include/`; see [source-policy.json](../../../config/source-policy.json). Its modern preprocessor version must not be mistaken for the code-generating compiler. Production assembly/linking uses the pinned [GNU Binutils 2.6 contract](../../../config/toolchain.json). Do not suggest compiler flag or toolchain substitution as an ordinary matching experiment.

Separate three measurements: complete linked target-byte differences; native instruction/word comparisons that may exclude relocations; and heuristic upstream permutation scores. They are not interchangeable. A correct frame or extent alone is not a match. Each instrumented diagnostic input needs its own output agreement with the pinned compiler before interpreting its trace.

| Target | Current source SHA-256 | Recorded residual |
|---|---|---|
| 3C00 | `D03797FD04EEE60592E0644A837E09308568D3E82448883997A10A85DA7F91F5` | Focused linked difference: 770 bytes / 261 words; accepted extent 6740 bytes; frame 504 |
| 6098 | `D76444B2C4AF7AD44E40DA2F68456E894355AA9F1B6BF4D44F4B792DC10097E1` | Focused linked difference: 56 bytes / 46 words; frame 408 versus retail 456 |
| DB10 | `5BF6ACF3CEF8F4A229AA143CCEB76376AC333B455BB1EDA18E9296476D791FD3` | Frame 552 versus retail 560; separate six-word cyclic initialization ordering difference |

The byte/word figures are the reports' respective comparison metrics, not arithmetic conversions. Do not borrow an older DB10 source's linked score for current 5BF6. The [R7 terminal handback](../../Plans/task-logs/combat-draw-wave8-r7.md) preserves these qualifications.

## 3C00: coupled packet and loop lifetimes

The selected D037 source separates the primary packed endpoint from the companion endpoint. The [competing-value report](../../Plans/task-logs/combat-3c00-competing-values-r1.md) and [R2 history](../../Plans/task-logs/combat-draw-wave8-r2.md) explain its selection and prior null/row/cursor controls. Remaining work concerns the joint companion pointer, strip, row, tile, endpoint and command-cursor allocation. Register names are observed roles, not evidence of original C variable identity.

| Sequence | What was actually tried | Result and remaining limit |
|---|---|---|
| R5 endpoint/vertex sequence | Shared row endpoint; common final vertex pair; distinct vertex/packet endpoints; common first-pair calls; packed-consumer recomputation; short endpoint forms | Carried values changed allocation and sometimes added a real endpoint spill. Recomputing at consumers could remove the spill while losing useful assignments. Some inputs changed call layout. No new best. |
| R6 overlap/strip sequence | Carry overlap instead of strip; narrow its real value; share companion/primary packed endpoint; restore strip and full-width state; vary packet row/tile histories | Some intermediates recovered four retail register roles but changed actual values, conversions or other code. One-less-than-strip in the desired register is not equality. No new best. |
| R7 joint search | Eight combinations of endpoint recompute/reuse, primary row shared/separate, and nonzero full-tile recompute/reuse | Endpoint reuse plus separate row introduced an accessed endpoint spill and frame 512. Controls reproduced previous outputs. |
| R7 continuation | Narrow actual 12-bit endpoint to unsigned short; localize real final size-command cursor stores to existing branches; restore int endpoint; revisit row/tile choices | Narrowing removed the new spill. Cursor localization allowed the restored int endpoint to stay spill-free. Useful allocation interactions were retained, but complete output remained worse than D037. |
| R7 strip continuation | Persistent short strip; drawing-phase promotion; extend that promoted value through late loop consumers | Some useful register roles returned, but conversions or persistent short storage remained. Smaller frames did not establish removal of every real spill. |

Sources: [R5](../../Plans/task-logs/combat-draw-wave8-r5.md), [R6](../../Plans/task-logs/combat-draw-wave8-r6.md), [R7](../../Plans/task-logs/combat-draw-wave8-r7.md). R7 completed 34 distinct authored inputs across 54 choice contexts, not 54 distinct source inputs. All twenty repeated controls reproduced raw/linked bytes and actual relocations; none replaced the best.

One particularly misleading metric was smaller extent: some R7 forms retained 23 static WIDTH calls through `sched2`, then had 22 at `jump2` due to late tail sharing. That is not evidence of deleting an executed operation or changing a function boundary. Inspect mutually exclusive paths and relocation occurrences as well as aggregate scores.

**Prepared next question:** R7 mostly explored a different R6 strip/overlap/vertex context, using D037 as a fidelity control. [R8](../../Plans/prompts/combat-draw-wave8-r8.md) proposes assessing the useful final-cursor lifetime relation in D037 itself. Determine which real producer/consumer change is appropriate there, checking older controls before describing a combination as new. Do not assume a transformation transfers unchanged.

## 6098: unexplained unused frame positions and vertex lifetimes

The [frame account](../../Plans/task-logs/combat-draw-6098-frame-preparation-r1.md) examines an older identified input. It establishes a 48-byte difference below the saved-register block: both owners have 23 directly accessed scalar homes, while retail spreads them across 29 eight-byte-spaced positions. Retail's six unaccessed lattice positions are `0x164, 0x16C, 0x174, 0x184, 0x18C, 0x194`, in two groups around active homes `0x17C` and `0x19C`. Fixed-object and outgoing-argument regions explain no extra 48 bytes. The spacing does not prove eight-byte original scalar types or six missing variables.

The [later exact-input allocation trace](../../Plans/task-logs/combat-draw-6098-allocation-trace-r1.md) is the reference for current D764. It finds 23 accessed homes and zero `COMBINE_USE` events. No comparison-only home is attributed to the vertex branches or texture-row loop. Older full-flags/right-coordinate mappings must not be silently transferred to D764: its full flags and right-coordinate storage differs from the older input.

The important contrast with DB10 is therefore observed candidate behavior: DB10 exhibits comparison-only allocation, while this 6098 input does not. Retail's unused positions have no surviving original RTL or allocation log to identify their cause.

Prior work includes [neighbor-expression reading](../../Plans/task-logs/combat-6098-neighbor-expression-r1.md), [R4's shared final vertex experiments](../../Plans/task-logs/combat-draw-wave8-r4.md), and [R5 sequence C](../../Plans/task-logs/combat-draw-wave8-r5.md). R5 tested twelve coordinated inputs: common full y, shared/branch-local mutable texture row, delta updates, explicit arithmetic stages, short texture state, narrowed corner outputs, and source-x narrowing.

A real top-to-bottom texture-coordinate delta moved the flipped update after the second call in one form. Merely reusing a C variable did not enforce that schedule. Explicitly staged arithmetic changed it again. Branch-local short texture state with direct bottom-coordinate assignment recovered the full 4148-byte extent, expected first-pair register roles and shared call tail, but remained at frame 408 and native 49 differing words versus best 46. These native counts are not new linked-byte measurements. Source-x narrowing added actual storage without explaining retail's unused positions. All twelve inputs retained 23 accessed homes and zero COMBINE_USE events.

**Research questions:** Is there a justified source-level producer/consumer relation that distinguishes the preserved full-size alternative from D764 and predicts an observable compiler-pass change? Is there a historically applicable mechanism for reserved-but-unaccessed space that can be tested without inventing padding or adding meaningless references? Treat these as separate questions unless evidence connects them.

## DB10: allocation order and an independent preheader order

The [allocation trace](../../Plans/task-logs/combat-db10-allocation-trace-r1.md), with its [accepted independent review](../../Plans/task-logs/combat-db10-allocation-trace-review-r1.md), explains allocation differences among three complete candidate inputs. It does not reconstruct retail compiler history.

Six real 72-byte arrays consume 432 bytes. Reload's initial ascending-pseudo traversal allocates SI homes using eight-byte rounding and four-byte big-endian correction. Current guarded 5BF6 has seven homes: four accessed values and three non-emitting comparison-only homes. Adding 24 outgoing bytes and 40 saved-register bytes gives frame 552. The failed distinct-latch input reaches 560 with an additional **accessed** latch spill, while retail shares the corresponding latch home. It is not a solution.

| Ordinal | Current 5BF6 allocation | Observed role |
|---|---|---|
| 1 | pseudo 72, sp+1CC | selector |
| 2 | pseudo 73, sp+1D4 | shared latch |
| 3 | pseudo 818, sp+1DC | comparison USE only |
| 4 | pseudo 861, sp+1E4 | biased context address |
| 5 | pseudo 870, sp+1EC | biased resource address |
| 6 | pseudo 1024, sp+1F4 | comparison USE only |
| 7 | pseudo 1026, sp+1FC | comparison USE only |

The explicit dedup entry guard creates comparison pseudo 818 in initial RTL before the pointer pseudos. An older null-first input creates the corresponding comparison in the first jump pass, after the pointers. `combine.c` REG_DEAD redistribution creates standalone USEs; these become allocated memory homes with no emitted accesses. This explains candidate ordering. It does not prove retail had a fourth USE home.

The [93-input survey](../../Plans/task-logs/combat-db10-preserved-allocation-survey-r1.md) found at most three non-emitting homes in that bounded corpus. [Predicate-origin reading](../../Plans/task-logs/combat-db10-predicate-origins-r1.md), [Kuna guidance](../../Plans/task-logs/combat-db10-kuna-guidance-r1.md) and retained guard/alias controls supplied no exact recipe. Do not interpret a bounded negative as pure-C impossibility.

Separately, [initialization locating](../../Plans/task-logs/combat-db10-initialization-residual-r1.md) identifies this exact cyclic order at owner-relative offsets `0x11DC..0x11F0`:

| Offset | Current | Retail |
|---|---|---|
| 11DC | move s3,zero | addiu s6,sp,0x18 |
| 11E0 | addiu s6,sp,0x18 | addiu t3,sp,0x5C |
| 11E4 | addiu t3,sp,0x5C | sw t3,0x1E4(sp) |
| 11E8 | sw t3,0x1E4(sp) | addiu t3,sp,0xA4 |
| 11EC | addiu t3,sp,0xA4 | sw t3,0x1EC(sp) |
| 11F0 | sw t3,0x1EC(sp) | move s3,zero |

The clear is the outer `actorIndex`, not inner dedup/insertion `index`. Current `.loop` output already has the undesired order. The five base operations and clear have the same instruction multiset; no actual relocation lies in this window. Its pointer-home offsets already equal retail, so do not explain this local order difference by the frame gap.

**Read the later correction:** [retained-base-control report](../../Plans/task-logs/combat-db10-retained-base-control-r1.md) identifies sp+5C and sp+A4 as compiler-produced biased preceding-element address bases. Natural C array starts are sp+60 and sp+A8. This is not permission to author pointers before the arrays. The older named control aliases sources/contexts/**variants**, on a different predecessor; it is not a one-variable comparison against current 5BF6. Its extra spill preserves real `variant` across a call, and it still fails the full desired order.

[R5 sequence B](../../Plans/task-logs/combat-draw-wave8-r5.md) tested insertion-only aliases after the key call, shared sourceList, a real six-array aggregate, a source-index shift loop, and restored outer aliases. Frames 552, 560 and 576 reflected real address/variant storage interactions; every input retained three comparison-only homes. Grouping did not merge the duplicate address histories in those inputs. No new best was selected.

**Research questions:** Which existing real predicate could change comparison creation/death handling in a way not already covered? Which valid array-access/loop representation could change the five-base/outer-clear hoisting order without retaining additional address state? A proposed reduction needs an observable predicate that preserves the relevant allocation behavior, not just frame size.

## Methods already evaluated

| Method | Existing disposition | Useful next contribution |
|---|---|---|
| Isolated allocator instrumentation | Implemented and reviewed for bounded candidate observations; production compiler unchanged | Name an exact missing event and the decision it changes before recommending more tracing. |
| Guided decomp-permuter | [Trial](../../Plans/task-logs/combat-guided-permuter-trial-r1.md) and [review](../../Plans/task-logs/combat-guided-permuter-review-r1.md) accepted bounded manual single-owner/no-extra-data use; R7 used it | Propose meaningful interacting choices and predicted discriminators, not generic unbounded search. |
| Kuna beside m2c | [Trial](../../Plans/task-logs/kuna-analysis-trial-r1.md) supported optional second opinions; cached default packets are now supported | Derive a new relation from actual source/assembly; merely requesting another default decompilation repeats work. |
| angr | [Trial](../../Plans/task-logs/angr-analysis-trial-r1.md) and [review](../../Plans/task-logs/angr-analysis-trial-review-r1.md) did not support maintained adoption for this workflow | Address the tested floating-point/support limits before claiming it solves these cases. |
| Reduction | A [7ADC endpoint reproducer](../../Plans/task-logs/combat-7adc-endpoint-reproducer-r1.md) already exists for a related solved target | A DB10/6098 reducer proposal needs a new target-specific retained property and full-function validation plan. |

Temporary regressions are explicitly allowed. Preserve the best separately, and distinguish “not selected” from “underlying hypothesis disproved.” Any external compiler research should be supported by primary sources and assessed for applicability to this specific KMC lineage; modern GCC behavior alone is not historical evidence.
