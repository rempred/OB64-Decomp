# Matching Workbench Ruleset Ensemble — 2026-08-23

## Outcome

The workbench now treats calibrated m2c rulesets as an ensemble. It does not
discard a pass merely because that pass loses a function another pass matches.
The retained criterion is unique exact yield across the ensemble.

On the frozen second 200-function corpus, the baseline structured pass matched
116 functions. The previous three-pass union matched 124. The six-pass
ensemble matches 130 distinct functions: the eight prior ABI wins plus six new
ruleset-specific wins.

The six new candidates were then cleaned into ordinary C and passed the full
canonical verifier. Each is `PURE_C`, solely owns its accepted linked section,
has the accepted placement and empty relocation contract, matches its linked
retail bytes, and preserves the byte-identical complete ROM.

## Exact membership contract

New sweeps use summary contract 3. `summary.ensemble` stores:

- `exactTargetCount`, the deduplicated number of exact functions;
- `functionMembership`, with every exact ruleset and candidate ID for each
  function;
- per-ruleset exact symbols and candidate IDs;
- gains and losses against the first requested ruleset; and
- functions found by exactly one requested ruleset.

The older `summary.exactBytes` field remains the count of exact variant runs.
It is retained for compatibility and can count one function several times.
`sweep-status` derives the ensemble view from retained target rows for older
sweeps as well. Default display is bounded; `--include-targets` exposes complete
target rows and membership.

## Retained rulesets

| Ruleset | Mechanical hypothesis | Unique second-corpus wins |
|---|---|---|
| `structured-abi-gaps` | Preserve missing integer/pointer ABI argument slots | `func_000463b8`, `func_000464bc`, `func_000465dc`, `func_000465f0`, `func_00046604`, `func_00046618`, `func_0004662c`, `func_00046640` |
| `structured-load-first` | Load one cursor byte before an independent zero store | none in this corpus |
| `structured-return-flow` | Widen an inferred narrow result and replace a default/overwrite result temporary with direct returns | `func_0012E950`, `func_00201B18`, `func_0029C19C` |
| `structured-cursor-steps` | Express one- or two-byte cursor advances at the loads | `func_000143dc`, `func_00014628` |
| `structured-masked-local` | Keep a masked value as a separate temporary before comparing it with zero | `func_00146094` |

`structured-return-flow` deliberately demonstrates the ensemble rule. It loses
baseline match `func_00090e40`, but the baseline and other passes retain that
function while return-flow contributes three functions no other pass finds.

## Fixed-corpus measurements

Both sweeps selected exactly the frozen corpus, included already promoted
targets, disabled inferred context, and used the pinned m2c and KMC/GNU tools.

| Corpus | Sweep ID | Baseline | Ensemble | Exact variant runs | Recorded duration |
|---|---|---:|---:|---:|---:|
| Original smallest leaves | `B3FD7FD2A639F85B2E3DEEF3B23BAC139F515D4B9106F22350BD9B949B9DB980` | 142 | 148 | 858 | 700,067 ms |
| Frozen second batch | `7BD93859E23DB844A908A7EAD3B636324E8F4F1BFA6A6F75C7243CDBCE08E67D` | 116 | 130 | 709 | 878,483 ms |

The first duration includes an intentional interruption after 20 functions and
subsequent resume, so it is not a clean throughput benchmark. During that run,
identical structured m2c invocations were consolidated: the six local
structured rulesets now require one m2c launch per target instead of six.
After the second sweep, identical generated source was also consolidated to one
compile per target preparation. Every ruleset still receives its own candidate
observation. Failed persistent compiles remain retryable on a later command;
they are shared only within the current preparation.

## Promoted functions

| Function | Ruleset | Exact candidate ID |
|---|---|---|
| `func_000143dc` | `structured-cursor-steps` | `716D6C476446F19080D6C9ADEE13379B0CBF6A2DFCD76417D2B463E6058E5C8C` |
| `func_00014628` | `structured-cursor-steps` | `B2D6BB27CB6CEDEE6BBAEDBE8F6827894DC8C77DDB0757876C39B89FDBD93282` |
| `func_0012E950` | `structured-return-flow` | `961DFBEE6024F67FC78DB510CA678B92F34F3D24CB207F031483C9E47B7E5D48` |
| `func_00146094` | `structured-masked-local` | `A46212DC722413DEC01465BF53EEEF834AAFDE85D4D4CC4F8B63F6F2714A9DCF` |
| `func_00201B18` | `structured-return-flow` | `AAEDD17123F7B1A8F026C68F9FCB6C72D701D383C2A475205729E93BD84CFA8E` |
| `func_0029C19C` | `structured-return-flow` | `48F2B2CDF5A6720E54AE87070AC14E47216CC6268C97901D4856E3B115D7373E` |

The cleaned canonical source has different source hashes and therefore
different candidate IDs. The IDs above identify the exact generated candidates
that established each ruleset's yield; canonical acceptance comes from the
linked verifier, not from those scratch IDs.

## Remaining near misses

Of the 38 compiled nonexact results examined after the ABI pass, six are now
canonical matches. The remaining 32 comprise 18 length mismatches, 12
opcode/expression mismatches, one immediate/signedness mismatch, and one
scheduling/block-order mismatch.

Several tempting broad rules did not work and were not retained:

- rewriting KSEG0 hexadecimal literals as signed decimal values did not make
  KMC emit relocation-style `lui`/`addiu` address materialization;
- introducing an index local did not stop KMC from folding an add before a
  multiply into the final memory offset; and
- explicitly updating an addition base changed scheduling but did not match the
  retail order.

Many length mismatches include explicit padding, coprocessor operations, saved
register restoration from a chunk tail, or behavior that m2c omitted. Those are
not safe text-rewrite rules. Address-materialization cases likely need real
symbol/relocation context rather than a spelling change to a numeric constant.
The remaining cases should stay individual research targets until another
repeated, machine-tested correction appears.

## Canonical verification

The integrated verifier passed baserom identity, authenticated toolchain,
source policy, sole C ownership, target placement, relocations, exact linked
target bytes, source-to-object identity, and the byte-identical full ROM.

```text
PURE_C exact ............... 287 functions / 7760 bytes
HYBRID_C exact ............. 33 functions / 8136 bytes
RESULT: EXACT BASELINE
```
