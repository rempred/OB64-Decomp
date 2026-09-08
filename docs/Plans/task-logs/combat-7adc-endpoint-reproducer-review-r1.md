# 7ADC endpoint reproducer independent review R1

**Verdict: Accepted.** Completed. The frozen research supports its controlled endpoint result, faithful smaller pair, failed controls, and bounded scheduler-source correlation.

The Director may propagate this result as candidate-specific research guidance. The source worker must establish all ordinary matching gates independently.

## Frozen subject and eligibility

The activation freezes subject commit `7493c9d0`. The reviewed report SHA-256 is `CA73AFBB9EEC6B0F360365BBE93B23FA66914EFB17B3C6356D46AD2D44E8DD34`.

The reviewed 500-file manifest SHA-256 is `C9963854662FE0AEFFDA1DEC9B56BB1674678DCC6E1C17A08E454D40BE12615F`. Both identities matched before technical review.

Every manifested file passed independent size and SHA-256 checks. The manifest file set also matched the frozen evidence root exactly.

The worker assignment is completed. Its report and evidence remain read-only.

The reviewer claim was created atomically and read back before review writes. No assigned review path had an earlier artifact or owner.

## Claims reviewed

The review covered five material claims.

1. Four complete-function controls isolate endpoint spelling from two final row-store statements.
2. The 46-line and 47-line pair retains the stronger endpoint scheduling property without vacuous removal.
3. Four real WIDTH calls and two packed stores consume the required results and live endpoint.
4. Four smaller failed controls lose a named part of that property.
5. The scheduler source correlates with the observed dependency difference within stated limits.

The strongest competing explanation was the row-store spelling. It could produce the observed schedule while endpoint spelling remained incidental.

A second explanation was vacuous reduction. Removed calls, dead endpoint values, undefined behavior, or an artificial barrier could preserve a misleading order.

## Review method

The reviewer copied the pinned compiler and 18 candidate inputs into the ignored review root. The compiler copy retained SHA-256 `F3F1C99A322F5B3D8C108C2A44AF1D6D084DD27575C5D60BF0F0D33FFF34B1C6`.

The 18 inputs include four complete controls and seven reduced pairs. Each input was compiled with and without ordinary `-da` pass dumps.

All 36 invocations used the recorded compiler flags. No invocation changed a compiler, production source, configuration, or canonical build artifact.

Each fresh plain assembly exactly matched its frozen counterpart. Each fresh pass assembly differed from plain output only in the `-da` options comment.

The six selected pass files matched frozen evidence for every input. These files are `rtl`, `flow`, `combine`, `sched`, `sched2`, and `dbr`.

The reviewer independently parsed RTL instruction blocks and WIDTH-call positions. A separate assembly dataflow check accounted for each MIPS call delay slot.

The reviewer also ran an exact copy of the bounded property checker on the chosen pair. The same-signature no-render-tail control rejected because only three WIDTH calls remained.

The reproduction script is `build/combat-7adc-endpoint-reproducer-review-r1/reproduce.js`. Its SHA-256 is `85A73DE3AE845DB1C5E2E92BE7F43DA63E585260D106CA243BA7997733A68E8C`.

The result is `build/combat-7adc-endpoint-reproducer-review-r1/review-results.json`. Its SHA-256 is `212DABBBDEE41D81E38B97FA5E8E40747122A320A4DD4AEDA12E4A2CD12F2638`.

## Controlled complete-function result

The row-form pair differs only at three endpoint updates. The expression-form pair differs only at the same three updates.

Holding endpoint spelling fixed, the row forms differ only at two final row-store statements. This independently confirms the intended two-variable control matrix.

Fresh first-scheduler positions reproduce the report:

| Complete control | Preceding WIDTH calls for the three endpoint decrements |
|---|---|
| Temporary with row self-update | `3, 7, 12` |
| Self-update with row self-update | `1, 5, 10` |
| Temporary with expression store | `3, 7, 12` |
| Self-update with expression store | `1, 6, 10` |

The first format branch preserves `3` versus `1` in both row forms. Therefore the final row stores do not explain that endpoint distinction.

The middle format branch changes the self-update position from `5` to `6`. This confirms the reported row-store scheduling confound.

Fresh complete-function replay also matches the six frozen passes. The reduction result therefore remains connected to the complete controlled function.

## Faithful smaller pair

The selected inputs retain their reported SHA-256 identities. They differ only at the endpoint decrement and multiplication spelling.

Both sources initialize `rowField` and `endField` from function parameters. Every local pointer and value is assigned before its first use.

The source contains no volatile access, assembly, artificial dependency, or compiler barrier. Four executable WIDTH calls remain.

Under the stated `0 <= row, strip <= 65535` domain, signed intermediate values range from `-4` through `524276`. These values fit signed 32-bit arithmetic.

The required valid header and six-record command buffer make every accessed object and pointer increment valid. The selected pair uses no negative packet index.

The reduced type definitions preserve the accessed field offsets. Assembly reads image format at byte offset `3` and image width at byte offset `4`.

Initial RTL gives the temporary form destination pseudo `118` and endpoint source pseudo `75`. The self-update form uses pseudo `75` for both.

Both `.sched` and `.sched2` place the temporary decrement after two preceding WIDTH calls. Both place the self-update decrement before the first call.

The assembly result is stronger than textual call counting. The self-update decrement occupies the first call's delay slot and executes before that callee.

The temporary decrement executes after the second call returns. The independent checker records two completed calls at that instruction.

Both assemblies retain four WIDTH calls. Both emit a packed endpoint store after call two and another after call four.

The first packed store writes at command-field offset `12($17)`. Its value contains WIDTH result two and the shifted, masked endpoint.

The second packed store writes at command-field offset `4($17)`. Its value contains WIDTH result four and the same live endpoint.

These observations reject dead endpoint data and deleted-call explanations. They verify the bounded property for the selected compiler inputs.

## Failed controls and property checker

Fresh replays reproduce all four reported failure classes:

| Failed pair | Temporary position | Self-update position | Emitted WIDTH calls | Lost condition |
|---|---:|---:|---:|---|
| Core | after 1 | before first | 2 | Earlier line WIDTH was removed |
| Two-call context | after 2 | after 1 | 3 | Self-update no longer crosses the earlier call |
| Three-call context | after 3 | after 2 | 4 | Self-update no longer crosses the earlier call |
| No render tail | after 3 | after 2 | 3 | Earlier crossing and final endpoint reuse were lost |

The bounded property checker processes the delay instruction before marking a call completed. It then applies the expected caller-register clobbers.

The checker rejects missing calls, missing stores, wrong decrement position, unknown instructions, and missing WIDTH provenance. It is intentionally tied to the selected probe signature.

The independent assembly checker reached the same chosen-pair result without using the worker's `property.json`. No conclusion depends only on the worker checker.

## Scheduler-source correlation

The external `sched.c` and the copied source both hash to `01F112458F9C539D77F317490137D4AF5BFB9418B195B6A8798F8DB2B1D981C9`.

The unchanged rule adds a `REG_DEP_ANTI` call dependency when a pseudo destination crosses zero calls. The temporary destination crosses zero calls in `.flow`.

The temporary decrement consequently carries `REG_DEP_ANTI` to WIDTH call UID `111`. The call-crossing endpoint pseudo has no equivalent dependency on UID `111`.

This source and pass agreement supports the worker's candidate-specific explanation. It is a correlation from unchanged source and emitted pass state.

No instrumented execution proves that this rule alone selected the final schedule. Other scheduler priorities remain outside the evidence.

## Findings

No admissible finding was identified. The evidence, consequence, and limits agree with the assigned claims.

## Evidence limits and consequence

The selected pair is a faithful smaller reproducer. The manual reductions do not prove minimality or statement-level necessity.

The compiler and pass observations apply to these inputs and flags. They do not reconstruct retail source, retail compiler state, or retail scheduling history.

The reduced code has no runtime result in this evidence. The arithmetic and object conditions define the valid static diagnostic domain.

The result supplies no complete-function spelling that places the endpoint at a desired retail position. It is not a matching recipe.

This review accepts no production source, function match, source class, structural change, or compiler change. It adds no ordinary matching review gate.

All fourteen W8 targets remain required. The single final complete-wave verifier remains the acceptance gate after the wave is ready.

## Director route

The Director may mark this research accepted. The source worker may use the endpoint-lifetime and row-control guidance in later ordinary experiments.

The Director must preserve the candidate-only and source-correlation limits. A general scheduler or retail-history claim requires a new research assignment.

All reviewer commands have finished. The claim, report, and ignored review root are released at terminal handoff.
