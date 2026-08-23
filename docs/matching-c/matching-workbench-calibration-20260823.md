# Matching Workbench Calibration — 2026-08-23

## Outcome

The seven closest nonexact results from the fixed 200-function pilot were
reconstructed manually and compared with their original m2c drafts. Six became
exact `PURE_C`; `__osPopThread` became exact `HYBRID_C` after a genuine pure-C
attempt established a KMC register-allocation blocker.

Two repeated mechanical differences became narrow, explicit generation
variants. Each variant was rerun independently over the same fixed corpus. Both
increased exact yield and retained every one of the original 142 exact symbols,
so both were kept.

That lack of regression is an observed result, not the retention rule. The
workbench now evaluates rulesets as an ensemble: a pass remains useful when it
adds an otherwise-missing exact function even if another pass is needed to
retain a baseline match. Per-function membership and the later calibration are
recorded in `matching-workbench-ensemble-20260823.md`.

## Manual corrections

| Target | m2c draft problem | Corrected source fact | Result |
|---|---|---|---|
| `func_000149b0` | Named its only parameter `arg1` but declared it in the first ABI slot | Retain an unused `arg0` before `arg1` | Exact `PURE_C` |
| `func_00014a0c` | Same missing first ABI slot | Retain an unused `arg0` before `arg1` | Exact `PURE_C` |
| `func_0004649c` | Declared `arg0, arg2`, which made C pass `arg2` in `$a1` | Retain an unused `arg1` so the value remains in `$a2` | Exact `PURE_C` |
| `func_000464ac` | Same missing middle ABI slot | Retain an unused `arg1` so the value remains in `$a2` | Exact `PURE_C` |
| `func_00014614` | Read the cursor byte after an independent zero store | Load the cursor byte into a local before either store | Exact `PURE_C` |
| `func_00014988` | Same source-order loss | Load the cursor byte into a local before either store | Exact `PURE_C` |
| `__osPopThread` | Treated the routine as `void` and overwrote the loaded head | Return the removed head while storing its successor | Exact `HYBRID_C` |

The queue routine's retail code leaves the original head in `$v0`, loads the
successor into `$t9`, stores the successor, and returns. The ordinary C
reconstruction correctly reserves `$v0` for the returned head, but authenticated
KMC GCC 2.7.2 chooses `$v1` for the successor. Direct expressions, typed locals,
`register`, pointer and member volatility, K&R syntax, an inline helper, and a
union view all remained nonexact. A register binding produces the retail bytes
and is therefore classified `HYBRID_C`. The target is in the statically linked
libultra block, but the original compiler identity of this individual object is
not proven. No generator variant was kept for it because the pure-C correction
did not increase exact yield under the accepted compiler.

## Retained variants

### `structured-abi-gaps`

This variant starts from normal structured m2c output. If all generated
parameters are 32-bit integer or pointer arguments named `arg0` through `arg3`,
it inserts an unused `s32` parameter for a missing earlier general-purpose
argument slot. It refuses floating-point, 64-bit, reordered, out-of-range, and
non-m2c signatures rather than guessing their ABI.

### `structured-load-first`

This variant recognizes only a generated three-statement body with:

1. a zero store through one argument;
2. a later store of one byte loaded through a different cursor argument; and
3. `return cursor + 1`.

It introduces a byte local before the zero store and uses that local in the
second store. Bodies with another statement, a shared address base, a non-byte
cursor, or another shape are unchanged. This is an explicit ordering
hypothesis, not a claim that arbitrary stores and loads may be reordered.

Requested and actually applied transforms are retained in candidate
provenance. Unknown transform names fail closed. Adapter version 6 separates
these results from the original adapter-5 sweep.

## Fixed-corpus gate

All runs selected the same deterministic 200 smallest accepted leaf functions,
included already promoted targets, disabled inferred context, and used the same
pinned m2c and KMC/GNU tools.

| Run | Sweep ID | Exact | Lost from baseline | Added |
|---|---|---:|---:|---|
| `structured` | `F1AABBF37D2D952E65E4252BD9FF724FBC91EABE71014C69F4FACF85599395B7` | 142 | — | — |
| `structured-abi-gaps` | `1CD1CC4A3BB71E859E04F17656B09B94C83121691033DF416636E0A9D63E6429` | 146 | 0 | 4 |
| `structured-load-first` | `832F1EB652385A069B1DF3AC8204AE6E7606F93C7F1CEB063B0DB820E500CA3B` | 144 | 0 | 2 |

The ABI additions were exactly `func_000149b0`, `func_00014a0c`,
`func_0004649c`, and `func_000464ac`. The load-order additions were exactly
`func_00014614` and `func_00014988`. Direct set comparison found no lost
baseline symbol in either run. The two pre-existing m2c generation failures
also remained unchanged.

Measured wall time was 222,853 ms for the adapter-6 baseline, 196,460 ms for
the ABI variant, and 197,794 ms for the load-first variant. Most unchanged
candidate compiles reused exact-source cache entries; m2c generation still ran
for each target.

## Canonical acceptance

The six pure functions and one explicitly hybrid function were activated with
empty relocation contracts. The integrated verifier passed authenticated
toolchain, source policy, sole C ownership, accepted placement, relocations,
exact target bytes, and a byte-exact complete ROM.

```text
PURE_C exact ............... 157 functions / 4328 bytes
HYBRID_C exact ............. 33 functions / 8136 bytes
RESULT: EXACT BASELINE
```

Scratch and sweep exactness remain research aids. Future generated candidates
still require deliberate source review and the normal canonical verifier.
