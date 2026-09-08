# 7ADC guided endpoint search independent review R1

**Verdict: Accepted.** The frozen research supports the four-form probe result, the distinct desired-order predicate, the partial format-1 transfer, and the stated residual and raw-object limits.

The Director may use this result as candidate-specific guidance for ordinary source experiments. It establishes no improved match or ordinary matching acceptance.

## Frozen subject and eligibility

The activation freezes subject commit `454e1158`. The reviewed report SHA-256 is `9B69F03C601C44AC617A19CF3796F55E36B519E2D6FBFC8EAE36F8218986BE15`.

The reviewed 168-file manifest SHA-256 is `C8CC9A796692665FB4FCF5716F211D637277EDB983ED03F28788F461EC6A79BE`. Every listed file passed independent size and SHA-256 checks, and the manifested set equals the frozen evidence-root file set.

The accepted predecessor chain was reused. Its worker report, review, and 500-file manifest retain their bound SHA-256 identities `CA73AFBB9EEC6B0F360365BBE93B23FA66914EFB17B3C6356D46AD2D44E8DD34`, `2647D558F61AA60BEEA7D8B3B972DAF15512177FC277C64DB6F79E5CF9E37337`, and `C9963854662FE0AEFFDA1DEC9B56BB1674678DCC6E1C17A08E454D40BE12615F`.

The reviewer claim was created atomically and read back before review-root writes. The worker and predecessor artifacts remained read-only.

## Independent method

The reviewer copied the authenticated compiler into the ignored review root and replayed all seven new inputs: four probes and three complete-function copies. Each input compiled plainly and with ordinary `-da`, for 14 successful compiler invocations.

Every fresh plain and dump assembly equals its frozen counterpart. Fresh `rtl`, `flow`, `combine`, `sched`, `sched2`, and `dbr` files also equal the frozen evidence for every input. The compiler copy retains SHA-256 `F3F1C99A322F5B3D8C108C2A44AF1D6D084DD27575C5D60BF0F0D33FFF34B1C6` and the recorded flags.

An independent straight-line assembly analysis classified calls, explicit `noreorder` delay slots, self-decrement, shift, mask, and both packed stores. It does not import the worker property checker.

The reviewer also assembled the unchanged baseline and three fresh full copies. GNU `objdump` supplied section, symbol, relocation, and raw text evidence independently of the worker ELF parser. The configured assembler retains SHA-256 `0831D410AD140F2D2225382273219ACB418EF6EC1E986A3309F034D2A8350A5C` and the recorded flags.

The reproduction script is `build/combat-7adc-guided-endpoint-search-review-r1/reproduce.js`, SHA-256 `47AC2D1E428B8D71B9FD91C3B8D7197A52EC9004307B39B17103FCFDA94F96BB`. Its result is `build/combat-7adc-guided-endpoint-search-review-r1/review-results.json`, SHA-256 `5EE030E9193369DE2938D97A1CE76B922A5F2F411C09291E95DAFACB396A85C6`.

## Four-form result and predicate separation

The four frozen probe sources are exact transformations of the accepted predecessor input. No source contains volatile access, assembly, or a compiler barrier. Under the stated `0 <= row, strip <= 65535` domain, relevant signed values remain between `-4` and `524276`; the alternatives preserve the endpoint value and existing valid buffer accesses.

Fresh assembly produces this classification:

| Probe form | Completed WIDTH calls at endpoint self-decrement | Desired order | Accepted early order |
|---|---:|---:|---:|
| pre-sum-copy | 0 | no | yes |
| post-sum-self | 0 | no | yes |
| pre-sum-packed | 2 | yes | no |
| post-sum-expression | 2 | yes | no |

Each form retains four actual WIDTH calls, two packed stores, and a same-register subtract followed by shift-by-two and mask-4095 in that register. For the first two forms the decrement is the first call's explicit delay instruction and executes before the call. For the two promising forms it executes after the second call.

This independently confirms that the new desired predicate and the frozen accepted early-order predicate are distinct. Neither passes vacuously. The two promising probe sources are different but reproduce identical assembly.

## Complete-function transfer and residuals

Both all-site source alternatives are exact transformations of the fixed predecessor input and reproduce identical complete-function output. The format-1-only input is also the exact claimed single-branch transformation; the two common branches retain their original sum and update forms.

In format 1, the transformed output computes the endpoint sum in `s1`, then decrements, shifts, and masks in `s1`. The row remains in `s2` and the command pointer in `s3`, while retail uses row `s3` and command pointer `s2`. The candidate endpoint improvement therefore transfers only partially.

The format-1-only copy preserves the two common-branch residuals at owner offsets `0x9D8/0x9DC` and `0xCE0/0xCE4`: subtraction goes from live `s2` into `v1`, then shifts `v1` back into `s2`. The all-site forms still fail same-register operation there and introduce additional scheduling changes.

## Object and raw-comparison limits

All four fresh objects have a 3800-byte `func_001F7ADC` symbol and a 368-byte frame. Their `.text` sections are 3808 bytes. The final eight bytes are section-alignment tail and do not enlarge the function extent.

Each object has 180 actual text relocations. The format-1-only relocation sequence equals the unchanged baseline. Both all-site alternatives have the same sequence as each other and a different sequence from baseline.

After excluding each candidate object's actual relocation-bearing offsets, fresh same-offset comparison against the authenticated retail function region reproduces 15 native differences for baseline, 29 for each all-site copy, and 17 for the format-1-only copy. The format-1-only copy changes 19 nonrelocated words from baseline, all between owner offsets `0xA7C` and `0xBF4`.

These are raw candidate-object observations within the accepted 3800-byte region. Jump, HI16, and LO16 words at relocation offsets remain unresolved. The evidence does not establish linked placement, alignment, relocation-contract acceptance, target-byte equality, or full-ROM equality.

## Findings and consequence

No admissible finding was identified. The worker report states the supported result and its limits accurately.

The format-1 `s1` endpoint sequence and the probe's desired-order source forms may guide later ordinary source experiments. The row/pointer arrangement and both common branches remain unresolved, and the 17-difference candidate is worse than the preserved 15-difference baseline.

The observations apply only to these candidate inputs, pinned tools, and flags. They do not reconstruct retail source, event-time allocation, retail compiler state, or retail scheduling history. They do not establish impossibility for untested forms.

No production source, structure, compiler, shared tool, matching claim, or ordinary review gate is accepted here. All fourteen W8 targets and the final complete-wave verifier remain required.

All reviewer commands have finished. The claim, report, and ignored review root are released at terminal handoff.
