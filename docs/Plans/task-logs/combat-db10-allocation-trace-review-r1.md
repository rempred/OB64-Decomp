# DB10 allocation trace independent review R1

**Verdict: Accepted.** Completed. The frozen report supports its candidate-only allocation findings and its two bounded source-experiment directions.

The Director may propagate these findings as guidance for ordinary DB10 source experiments. The source worker must still establish every normal matching gate independently.

## Frozen subject and eligibility

The activation freezes subject commit `e29eec8a`. The reviewed report SHA-256 is `14F8C4909461227D3050CE2279EC50584DBB70C73F98390AEAE84B0402F76669`.

The reviewed output manifest SHA-256 is `9D5DA4FFBB47C1060F36C3F8714FEA4E81EA2D6B1BBE1A5B4E1CC3541B18A81F`. Both supplied identities matched before technical review.

The worker assignment is completed. Its report and ignored evidence package exist and remain read-only.

The reviewer claim was created atomically and read back before review writes. No assigned review path had an earlier owner or artifact.

## Claims reviewed

The review covered three material claims.

1. The isolated compiler traces preserve the pinned assembly for all three complete candidate inputs.
2. Ascending pseudo allocation explains the first home-order difference between the two 552-byte candidates.
3. The 560-byte control adds an accessed scalar home, separate from its three compiler-only `USE` homes.

The strongest competing explanation was instrumentation or host rebuild drift. Such drift could produce plausible traces for assembly that the pinned compiler never emits.

A second competing explanation was that the 560-byte control added only unused compiler bookkeeping. That would make its frame size an invalid real-spill control.

## Review method

The reviewer first recomputed all 1,300 manifest file identities. Every recorded size and SHA-256 matched.

The reviewer also checked all 1,189 recorded external compiler-tree inputs. Every source identity matched the worker's recorded original hash.

Only `function.c`, `reload1.c`, `combine.c`, and their rebuilt objects differ in the diagnostic compiler copy. Direct delta inspection found logging and call-site tags only.

The five `alter_reg` call sites have distinct path tags. The allocator conditions, requested modes, sizes, alignments, and allocation calls remain unchanged.

The reviewer copied the three compiler executables and complete candidate inputs into the ignored review root. Each copied binary and input retained its expected SHA-256.

The reviewer then ran four isolated compiler invocations for each candidate:

- pinned compiler;
- uninstrumented three-unit rebuild;
- instrumented compiler without `-da`; and
- instrumented compiler with `-da`.

The replay used the worker's complete flags. It did not invoke a canonical build, linked diff, verifier, runtime, or Git operation.

The reviewer parsed fresh raw traces without using `allocation-analysis.json`. The parser correlated each `HOME`, `STACK`, memory offset, and `HOME_RESULT` event.

The reviewer also inspected fresh initial, jump, and local-register RTL dumps. Assembly scans classified each allocated home as accessed or compiler-only.

The reproduction script is `build/combat-db10-allocation-trace-review-r1/reproduce.js`. Its SHA-256 is `B26A187B9FD9EA64A0DF8ECA7AAA6DB49EA7CB4AB350E166B304D9EA7505E0AD`.

The result is `build/combat-db10-allocation-trace-review-r1/review-results.json`. Its SHA-256 is `2C21D691F71834E62A544452686AC58F25D14277A6F001E672CFAEEDC5904017`.

## Independent results

For every candidate, pinned output equaled uninstrumented-control output byte-for-byte. Pinned output also equaled instrumented output without `-da` byte-for-byte.

With `-da`, each assembly had exactly one raw difference. The command comment changed from `# -funsigned-char -o` to `# -funsigned-char -da -o`.

Removing that exact comment delta made the assembly byte-identical. Trace stderr was also identical with and without `-da`.

Fresh reviewer outputs matched the worker's corresponding assembly, stderr, and selected RTL dumps across 27 file comparisons. This rejects input or invocation drift.

All candidates allocate six 72-byte block objects before scalar homes. The block extent reaches 432 bytes.

Each scalar request uses `SI` mode, four-byte inherent and total size, eight-byte effective alignment, and eight rounded bytes. All use `reload-initial` with `from_reg=-1`.

The resulting scalar sequences follow. Offsets are local stack-pointer-relative byte offsets.

| Candidate | Pseudo order | Stack offsets | Compiler-only `USE` pseudos | Accessed pseudos | Frame |
|---|---|---|---|---|---|
| Current guarded dedup | `72, 73, 818, 861, 870, 1024, 1026` | `0x1CC` through `0x1FC` by eight | `818, 1024, 1026` | `72, 73, 861, 870` | 552 |
| Older null-first peers | `72, 73, 860, 869, 1022, 1023, 1025` | `0x1CC` through `0x1FC` by eight | `1022, 1023, 1025` | `72, 73, 860, 869` | 552 |
| Failed second latch | `72, 73, 459, 861, 870, 1023, 1024, 1026` | `0x1CC` through `0x204` by eight | `1023, 1024, 1026` | `72, 73, 459, 861, 870` | 560 |

The current candidate creates comparison pseudo `818` in initial RTL. Pointer pseudos `861` and `870` are created later.

The older candidate has pointer pseudos `860` and `869` in initial RTL. Its comparison pseudo `1022` first appears in the jump pass.

The compiler source visits pseudos from `LAST_VIRTUAL_REGISTER + 1` to `max_regno` in ascending order. The fresh trace follows that order exactly.

These facts support the report's bounded causal statement. Source control-flow placement changed pseudo creation timing and therefore changed scalar-home order for these candidates.

Fresh local-register RTL contains each claimed compiler-only pseudo in one standalone `USE` node with `REG_DEAD`. Their stack offsets have no direct assembly access.

The second-latch pseudo `459` is different. Its `0x1DC` stack home has three direct assembly accesses and increases scalar extent from 488 to 496 bytes.

This independently preserves the distinction between compiler-only homes and an additional accessed spill. A 560-byte frame alone remains insufficient evidence of success.

The fresh `COMBINE_USE` events also reproduce the claimed stop kinds. The guarded entry comparison stops at a jump, while another comparison stops at a code label.

## Findings

No admissible finding was identified. The evidence, consequence, and limits agree with the assigned claims.

## Evidence limits and consequence

The control rebuild covers `function.c`, `reload1.c`, and `combine.c`. It is not a fresh complete compiler bootstrap.

The host compiler version differs from the original bootstrap. Therefore rebuilt executable identity and general compiler equivalence remain unclaimed.

Assembly agreement proves diagnostic noninterference only for these three complete candidate inputs. It does not qualify this compiler as a production replacement.

The traces describe candidate compiler behavior. They cannot identify unavailable retail source, retail RTL, original declarations, or retail allocation history.

The accepted causal finding can guide tests around existing dedup, insertion-search, and submission predicates. Each later candidate still requires an ordinary linked diff.

This review accepts no DB10 source, source class, function match, structural change, or compiler change. It adds no ordinary matching review gate.

All fourteen W8 members remain required. The single final complete-wave verifier remains the acceptance gate after the wave is ready.

## Director route

The Director may mark the diagnostic review accepted and let the source worker use its bounded predicate-order guidance. No worker correction is required.

The Director must preserve the candidate-only scope when citing this report. Any retail-history or general compiler claim requires a new research assignment.

All reviewer commands have finished. The claim, report, and ignored review root are released at terminal handoff.
