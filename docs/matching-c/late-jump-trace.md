# Late cross-jump trace

This standalone diagnostic instruments a private copy of the pinned GCC 2.7.2
`jump.c`. It does not change canonical C, toolchain configuration, matching
counts, candidate scores, accepted compiler identity, or ROM verification.
The diagnostic compiler and its emitted code are never acceptance inputs.

The implementation is `tools/matching_studies/late_jump_trace.js`. Every command
uses a fresh compiler copy. Existing build manifests are evidence to inspect,
not authority to reuse an executable. Original compiler sources and production
`cc1.exe` remain read-only. Generated source, compiler objects, executables,
temporary preprocessing files, corpus snapshots and reports stay under ignored
`build/late-jump-trace/`.

## Commands

```powershell
node tests/late_jump_trace.js
node tools/matching_studies/late_jump_trace.js corpus
node tools/matching_studies/late_jump_trace.js run --target func_001237F0 --source docs/archive/matching-c-candidates/2026-10-04-func_001237F0-69a987da95.c
```

`--compiler-source DIRECTORY` or `OB64_KMC_GCC_SOURCE` can locate the authenticated
configured compiler checkout. The default is the existing clean-d checkout.
`build` runs only the diagnostic compiler provenance checks and build; do not
run it before `corpus` or `run`, which already build their own compiler.

Arbitrary repository-local sources must satisfy the existing scratch compiler and source-policy
contracts for the requested accepted target. This tool does not expand those
contracts or accept missing logical bodies. The five fixed corpus cases are
the active accepted PURE_C `src/battle/func_002158E4.c` (SHA-256 `592355ABC3E5B20DDF8C532EE2EB95D78645C1D2DDC7B48C3E7AEED8E97923D0`),
the genuine nonmatching resolver candidates `69A987DA` and `457BF323`,
and independent merge/no-merge controls. The positive pin must resolve to the
active source owner, and every case is mechanically classified PURE_C.
The report pins each source's exact
bytes and the source policy's expanded input and dependency identities.

## Evidence and interpretation

The side file is enabled only with `OB64_LATE_JUMP_TRACE_FILE` on the isolated
compiler. It records every actual `jump_optimize` invocation, its arguments,
reload state and loop iterations. Conditional, unconditional and return paths
record the original short-circuit operands as evaluated; unvisited operands
remain unvisited. Chain entries skipped before `find_cross_jump` are visible.
The trace does not call optimizer predicates a second time.

`find_cross_jump` records the ordered pair of instruction UIDs, original
minimum and credits, instruction/pattern comparisons, REG_EQUAL/REG_EQUIV
fallbacks, validation/cancellation/application outcomes, stop reasons and
accepted endpoints. `do_cross_jump` records label resolution, redirect/return
conversion, note removals and deletions in rewrite order.

MIPS has no `STACK_REGS`; the trace explicitly records that the stack-register
death-note gate is inactive. The late pass is identified by its actual argument
and reload records, ordinarily `cross_jump=1`, `noop_moves=1`, `after_regscan=0`,
and `reload_completed=1`. The source's death-specific argument is `cross_jump=2`;
it must not be confused with the ordinary late pass.

The side stream has versioned schema, contiguous sequence numbers, invocation
and iteration identities, a fresh per-run nonce, exact expanded-input identity,
begin/end sentinels and a 200,000-event ceiling. Overflow, truncation, wrong
nonce/input, unknown events, malformed integers and incomplete invocation/find/
rewrite nesting and impossible event-value domains reject. Classification is
bound to the originally pinned authored snapshot before any compilation.
Failures leave diagnostic artifacts for investigation
but no passing aggregate report.

Every source is compiled sequentially at the same source/output paths by the
authenticated production compiler, both uninstrumented controls (untouched
object relink and unmodified `jump.c` rebuild), and the
instrumented compiler both disabled and enabled. Before interpreting any
trace, the tool requires exact untouched assembly, adjusted assembly, raw ELF
object, complete owned section evidence, function bytes and actual relocations.
There is no output normalization. A parity pass is equality against production
for that source; it is not a retail match or a proof that a C source solution
exists.

## Compiler provenance

The original compiler remains SHA-256
`F3F1C99A322F5B3D8C108C2A44AF1D6D084DD27575C5D60BF0F0D33FFF34B1C6`,
from source commit `43d1cdb67ed135879869b5266f01efaaada5e35a` and tree
`bbed133c38a1feffafe941c36b20d3b38ba47a33`. Original `jump.c` is
`45860E25B20891170703EB33848B01A6B03AC5D9A6629995E40C3748B1B9E6D8`.
The bootstrap manifest, tracked tree, full configured source/object/generated
header closure and production executable are authenticated before copying.
All copied inputs and the original closure are rehashed after the experiment.

Visual Studio was serviced in place: original compiler/linker build 36248 became
36257. An untouched relink therefore **does not reproduce the original complete
executable hash**. The separately reviewed diagnostic comparator
`late_jump_provenance.js` accounts for the complete narrow metadata delta:
PE Rich/compiler-product records, COFF/debug timestamps and reproducibility hash,
plus the unmodified `jump.obj` compiler ID and C13 object-path/version metadata.
Executable code/data/relocations and all remaining structural/byte content must
agree; unknown changes reject. No bytes are patched to claim original identity.
Production identity and all five-way target assembly/object comparisons remain
exact. This exception applies only to these diagnostic host controls.

The host compiler and linker have explicit executable pins. The full selected
host executable/header/library closure is recorded and rehashed. Every host
build checks `vcvarsall.bat` before and after execution, re-captures actual
`cl`, `link`, `INCLUDE` and `LIB` selections, and rejects selection drift even
if the old directories still exist unchanged.

The final native corpus report is
`build/late-jump-trace/run-muucuo0x-a89c5a/report.json`. Its compiler manifest
records the actual control hashes: relink `BA23F7A1…`, unmodified rebuild
`23FCDC97…`, and diagnostic compiler
`2563B2EF2EAE23B9F8C6C2FB3A15D606EF83350B3BBAA1BDB2FD04C0E191317F`.
The instrumentation identity is
`E103CBB63490098DC6F340EFD56B7E5B7536470195CF359717DD04808000B578`.

## Native results and terminal decisions

All five corpus sources passed exact untouched assembly, adjusted assembly,
raw object, full section/symbol/actual-relocation census and function-byte
parity for production, both controls, trace-disabled and trace-enabled builds.
The active positive retains its 236-byte section and 27 section relocations.

| Input | Trace events | Late iterations | Finds / rewrites |
| --- | ---: | ---: | ---: |
| Active accepted `func_002158E4` | 174 | 3 | 1 / 1 |
| Resolver `69A987DA` | 22,648 | 5 | 877 / 40 |
| Uniform terminal arms `457BF323` | 21,940 | 4 | 909 / 49 |
| Independent merge control | 182 | 2 | 3 / 1 |
| Independent no-merge control | 37 | 1 | 0 / 0 |

Both resolver inputs identify invocation 4 as the late pass:
`cross_jump=1`, `reload_completed=1`, `noop_moves=1`, `after_regscan=0`.
Their source-specific causal extraction is
`build/late-jump-trace/run-muucuo0x-a89c5a/terminal-causal-extract.json`.
It authenticates the previous production SCHED2/JUMP2 dumps and checks their
authored/expanded identities against the new trace input before using their
UIDs to identify the terminal RTL. It does not transfer UIDs between sources.

For the [uniform-arm candidate](../dossiers/func_001237F0-457bf323de.md), the
observed ordering explains why simply counting the initial matching suffix is
insufficient:

1. Iteration 1 compares `(1116,1426)` at sequence 10543. The zero-result pair
   `(1114,1416)` matches, reducing minimum `1→0`; the preceding label gives
   another credit `0→−1`. The rewrite at 10562 redirects jump 1116 to label
   1413 and deletes zero assignment 1114. The other terminal zero exits undergo
   corresponding rewrites. The immediate `(1116,772)` retry at 10634 still
   stops at label 1111, with minimum 1 and no accepted endpoint.
2. Iteration 2 compares `(1116,772)` again, at 15858. This time seven instruction
   pairs match, from the qualification tail back through the evaluator call
   and argument move: accepted endpoints `(1087,737)`, minimum `2→−5`.
   The preceding `(1083,729)` patterns differ; the first has no usable equality
   note. The rewrite at 15958 deletes UIDs
   `1087,1089,1093,1096,1098,1100,1102`, in that order.
3. The immediately following `(1116,909)` comparison at 16001 matches only
   the accumulator-zero branches `(1083,876)`, giving `2→1`. The next pair
   `(1079,872)` differs, but the actual jump-around predicate grants the
   second credit at 16025, `1→0`. Thus the single-branch prefix also merges,
   at 16029. The third-level counterpart follows the same sequence at
   16574/16645. This credit was missing from a static two-instruction-minimum
   explanation.
4. Iteration 3 shares the operation-3 evaluator tails, then the three-instruction
   operation/accumulator guards: `(1134,927)` at 19248 and `(1333,927)` at
   19537. Finally `(1374,1175)` accepts `(1277,1078)` with minimum `2→0`,
   sharing the two remaining operation-2 setup instructions at 19607.

The [raw-result helper candidate](../dossiers/func_001237F0-69a987da95.md)
follows a different path. Iteration 1 shares zero assignment `(1081,1112)`
and the two evaluator instructions `(1086,1104)`. Iteration 2 shares the
post-result-test suffix `(1118,743)`, stopping at the helper's label 1115.
Iteration 3 shares the remaining evaluator tail `(1104,737)`, stopping at
label 1102. The final iteration's `(1090,909)` comparison at 22335 actually
rejects branches `(1080,876)`: `pattern-equal=0`, no REG_EQUAL or REG_EQUIV
fallback, minimum still 2. The authenticated final dump shows their different
zero destinations: helper label 1111 versus zero-epilogue label 1333.
Likewise `(1146,1381)` stops on different instruction kinds `(1112,739)`,
zero assignment versus evaluator call. The analogous third-level path remains.

The direct result is a sequence of concrete accepted/rejected cross-jump
decisions for these two C inputs. The inference is that uniform terminal arms
expose progressively more shared suffixes after earlier rewrites, while the
raw-result helper preserves a distinct value-producing path through the shared
result test. Neither trace identifies the unknown retail source, proves a
death-note distinction, or supplies a matching C remedy.

## Focused validation

`node tests/late_jump_trace.js` passes 42 rejection controls, including stale
or malformed traces, impossible predicate/code/UID values, source/classification
drift, a historical candidate falsely labeled accepted, changed raw outputs or
relocations, unsafe paths, and host script/selection/closure drift.
`node tests/late_jump_provenance.js` separately exercises the strict host
metadata comparators; `--actual` additionally checks the preserved native
control specimens. No full-ROM command is part of this isolated diagnostic.
