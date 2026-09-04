# Optional Matching Workbench

`tools/match.js` is a generated research layer for finding and improving C
candidates. It resolves accepted US Rev 0 targets, generates drafts with pinned
m2c, compiles scratch candidates with the authenticated KMC/GNU chain, and keeps
local experiment history.

It cannot activate, promote, or accept a target. A high score, exact scratch
object, exact isolated diagnostic link, matching CFG, or preserved candidate is
still research evidence. Canonical acceptance always requires:

```text
node tools/diff.js <symbol>
node tools/verify.js --target <symbol> --require-pure
node tools/verify.js
```

Those commands prove the final linked target, sole C ownership, reviewed
relocations, source class, and complete-ROM identity. See
[the canonical workflow](WORKFLOW.md).

## Setup

The workbench uses the same normalized baserom and authenticated production
compiler, assembler, preprocessing, and host tools as the normal workflow. It
also needs the m2c commit and tree pinned in
`config/matching-workbench.json`. The default checkout is `../tools/m2c`.
Select another with `OB64_M2C_ROOT` or `--m2c-root <path>`.

The repository authenticates supplied dependencies but does not install them.
After completing [the local setup](../README.md#local-prerequisites), run:

```powershell
node tools/match.js doctor
node tools/match.js --help
```

`doctor` validates the accepted target model, normalized baserom, workbench
store, pinned m2c tree, and configured compiler chain. Its success proves setup,
not a source match.

Routine outputs stay under ignored `build/matching/`. The SQLite database at
`build/matching/workbench.sqlite` is designed to persist between local sessions;
back it up if the experiment history matters.

## A small useful loop

Inspect an accepted target and any prior experiments:

```powershell
node tools/match.js inspect <symbol>
node tools/match.js history <symbol>
node tools/match.js best <symbol>
```

Generate one ordinary structured draft:

```powershell
node tools/match.js prepare <symbol> --variant structured
```

Edit a candidate outside canonical `src/` while experimenting, then compile it:

```powershell
node tools/match.js watch <symbol> --source <candidate.c>
```

When a source is promising, deliberately adapt it into `src/`, activate the
target with the smallest configuration entry, and return to `diff.js`. Do not
copy a workbench status label into a matching claim.

## Candidate history and identity

A schema-2 candidate identity covers the exact accepted target and every byte of
source text. Generation origin, ruleset, parent candidate, and tool arguments
are separate observations. The same C found through several routes is compiled
once without losing provenance.

The workbench stores successful compilation artifacts for exact-input reuse.
Failed attempts remain visible and can be retried after an environmental repair.
A change to the accepted target model creates a new model identity and makes old
experiments stale rather than silently applying them to new structure.

Use these commands to reopen or compare stored work:

```powershell
node tools/match.js classify <candidate-id>
node tools/match.js classify <candidate-id> --include-details --include-source
node tools/match.js compare <candidate-id> <candidate-id>
```

`compare` requires two successfully compiled candidates for the same exact
target. It compares candidates with each other; it is not canonical retail
acceptance.

Accepted source-part rows named as one contiguous function head and tail are
composed into one target only after the workbench validates ROM, VMA, placement,
and source ownership. A tail is not exposed as a new function.

## Diagnostics and relocation-aware interpretation

Scratch diagnostics exist to answer “what source change should I try next?”
They do not answer “is this matching C?”

Unresolved raw-object addresses can make otherwise equivalent `j` and `jal`
instructions look different. Do not infer a CFG mismatch merely from those
unresolved operands. The selected diagnostic mode is explicit:

- `authenticated-isolated-link` requires a fresh verified CURRENT ELF, fixed
  accepted VMA, exact active single-function control object, supported text
  relocations, unique symbols, and no auxiliary or multi-owner content. The
  candidate is linked in isolation at the accepted VMA for comparison.
- `symbolic-object` is the conservative fallback. It resolves supported
  section-relative internal jumps, abstracts known external calls, and leaves
  unsupported or ambiguous control targets indeterminate rather than inventing
  a CFG mismatch.

`primaryClass`, `score`, CFG evidence, differing counts, and `firstDifference`
come from the selected diagnostic evidence. `rawObjectExactBytes` and the
existing `exactScratchBytes` remain raw-object facts; `diagnosticExactBytes` is
separate and can become true after an isolated link. `acceptanceEligible` is
always false.

When the isolated path is unavailable, `diagnostic.status`, `.code`, and
`.reason` retain the concrete cause, such as a nonactive assembly owner, missing
relocation contract, ROM-only or unknown placement, stale CURRENT evidence,
auxiliary/multi-owner content, unsupported relocation, ambiguous symbol, or
link/control failure. Keep that reason; do not treat a raw fallback score as
equivalent evidence.

Authentic cached compilation artifacts remain reusable when only comparison
semantics or linked provenance changes. `comparisonRefreshed` reports that the
stored compile was reused and its stale comparison recomputed. The `compare`
command uses symbolic relocation-aware object evidence between candidates and proves
neither linked addresses nor acceptance.

An isolated diagnostic link still does not prove that the production linker
selected the C object as sole owner, that every active replacement and
relocation contract is valid, or that the complete ROM is exact. Useful fields
and full comparison details are available through `classify`,
`history --include-details`, `best --include-details`, and `--json`. Treat the
current `node tools/match.js --help` output and report schema as the command and
field authority.

## Draft generation

With no `--variant`, `prepare` runs the complete configured ruleset ensemble.
Repeat `--variant` to select a subset:

```powershell
node tools/match.js prepare <symbol>
node tools/match.js prepare <symbol> --variant structured --variant gotos
```

Context is generated for human inspection by default, but it is passed to m2c
only with `--with-context`. Use `--no-context` to skip generation and
`--no-compile` to stop after draft generation.

The configured variants are:

| Variant | Bounded hypothesis |
| --- | --- |
| `structured` | Ordinary deterministic structured m2c output. |
| `structured-abi-gaps` | Preserve a literal missing general-purpose argument slot. |
| `structured-load-first` | Test one recognized byte-load-before-zero-store shape. |
| `structured-return-flow` | Test direct conditional returns and a widened narrow result. |
| `structured-cursor-steps` | Retain recognized explicit byte-cursor advances. |
| `structured-masked-local` | Materialize one recognized masked comparison temporary. |
| `gotos` | Use m2c's goto-only mode. |
| `stack` | Use m2c's stack-structure mode. |

The calibrated transforms fail closed on unrecognized source shapes. They are
candidate-generation hypotheses, not global compiler rules. m2c output usually
needs human reconstruction and diff-guided changes. It does not replace the KMC
matching compiler, canonical linker, or verifier.

Rulesets form an ensemble rather than a contest for one permanent winner. A
variant can remain useful when it finds a unique exact candidate even if another
variant performs better elsewhere. Identical m2c inputs share one generator
invocation; identical generated source shares one scratch compilation while all
ruleset observations remain recorded.

## Bounded sweeps

Sweeps checkpoint after every target and resume interrupted work:

```powershell
node tools/match.js sweep --max-size 64 --leaf-only --limit 200
node tools/match.js sweep --set smallest-leaves-200 --variant structured --no-context
node tools/match.js sweep --max-size 256 --variant structured-return-flow --no-context --jobs 8
node tools/match.js sweep-status
node tools/match.js sweep-status --include-targets
```

Bare `sweep` selects every unsolved ordinary target and the full ensemble. Give
it an explicit set, maximum size, or limit unless that broad run is intentional.
General sweeps omit active matching targets unless `--include-solved` is set.
The fixed `smallest-leaves-200` set includes solved targets so calibration runs
remain comparable.

Parallel sweeps currently require `--no-context`. They keep one target's
rulesets together and use an authenticated temporary snapshot of the pinned m2c
tree. Start with a bounded canary before increasing `--jobs`.

Use `summary.ensemble.exactTargetCount` for the distinct exact-target total. The
legacy `exactBytes` field counts exact variant runs and can count one function
more than once. Default output is bounded; request full membership only with
`sweep-status --include-targets`.

The fixed-corpus results and their limits are recorded in
[the workbench calibration](matching-c/matching-workbench-calibration-20260823.md)
and [ensemble report](matching-c/matching-workbench-ensemble-20260823.md). Easy
zero-relocation leaves are not sufficient calibration for difficult,
relocation-bearing frontier targets.

## Families, context, and ranking

```powershell
node tools/match.js family build
node tools/match.js family <symbol>
node tools/match.js family list --tier exact --include-members
node tools/match.js context <symbol>
node tools/match.js rank --lane leverage
node tools/match.js rank --explain <symbol>
```

Family tiers are collision-checked representations. Only the exact-byte tier is
byte equality, and exact clones remain distinct physical targets. The
relocation-normalized tier ignores only external `J`/`JAL` target fields; it
does not infer `HI16`/`LO16` intent or common meaning.

Context reports mix evidence of different strengths. Decoded instruction facts
are exact to the tracked bytes. Read-before-write results and near-call windows
are bounded lexical candidates, not path-sensitive dataflow proof; inferred
arguments and types are hypotheses. Parent/context leads do not become accepted
structure or semantics. `context --runtime` performs an optional read-only Total
Resolver lookup. It does not start capture and requires neither a live
Project64 session nor Project64 for normal workbench use. Read
`../tools/total_resolver/AGENTS.md` before broader Total Resolver work.

A bounded direct-call regression can be inspected with:

```powershell
node tools/match.js context func_00054e24 --include-context
```

In the incoming `func_00215CF0` window at call PC `0x801D338C`, the sixth stack
store at `sp+0x24` occupies the supported non-control `jal` delay slot at
`0x801D3390`; the report retains its exact PC and marks `delaySlot: true`. The
other incoming call at `0x801D34B8` has all six stack stores before the `jal`.
Both remain lexical observations inside the 12-predecessor bound. They do not
infer a callee signature, prove that the callee has ten parameters, map every C
call to one retail call, or establish support for every delay-slot or branch
form.

Ranking keeps reviewed value and mechanical matchability separate. Treat it as
an inspectable queue aid and apply the priorities in [NEXT_STEPS.md](NEXT_STEPS.md).

## Large-dispatcher comparison

`case-cfg` compares bounded command regions and named shared tails for a
large comparison-driven dispatcher:

```powershell
node tools/match.js case-cfg <candidate-id> --case-map <map.json> --actual-dispatch <offset> --actual-body <offset> --actual-tail <name=offset>
```

The command map supplies accepted command values, dispatch bounds, fixed
dispatch-time registers, and expected shared tails. Actual dispatch, body, and
tail offsets remain explicit because they can move during reconstruction. A
schema-2 map can bind those inputs to one exact candidate ID, source hash, and
source class. Missing, duplicated, ambiguous, changed, or unsupported inputs
fail closed.

Reports align retail and candidate regions per command and record block, call,
successor, and tail parity. Region totals can count a shared interior block once
per command and are not whole-function metrics. Register names and supported
external jump relocations are normalized for this comparison. A case-CFG report
does not establish semantics, exact bytes, linked ownership, or full-ROM
identity.

The tracked `func_00284288` comparison can be reproduced in an isolated local
database:

```powershell
node tools/reproduce_func_00284288_case_cfg.js --actual-dispatch 0x80 --actual-body 0x8A0 --actual-tail post-command=0x1EC8
```

Its m2c delay-slot adapter regression is:

```powershell
node tools/reproduce_func_00284288_m2c_delay_slot.js --m2c-root <pinned-m2c-checkout>
```

Both are target-specific research evidence.

## Compiler probes

Use a probe only to answer a specific compiler-pass question:

```powershell
node tools/match.js probe <symbol> --source <candidate.c>
node tools/match.js probe <symbol> --candidate <candidate-id>
node tools/match.js probe compare <left-report.json> <right-report.json>
```

Probe output is always research-only, including output from the accepted
compiler. A compiler supplied with `--research-compiler` is confined to the
probe interface and cannot enter `build`, `diff`, or `verify`. Alternative flags
or compilers need bounded evidence; a better scratch score is not authority to
change the pinned production contract.

See [the KMC matching notes](KMC_GCC_MATCHING_NOTES.md) for reproduced,
scope-limited source-shape observations. Treat those observations as experiment
ideas, not universal register-allocation recipes.

### Allocator owner-order study

The bounded allocator scheduling study is reproducible but is not a general
candidate generator. It requires a clean `mips-gcc-2.7.2` source checkout at
commit `43d1cdb67ed135879869b5266f01efaaada5e35a`:

```powershell
node tests/matching_studies.js
node tools/matching_studies/allocator_owner_order.js run --compiler-source 'C:\path\to\mips-gcc-2.7.2'
```

`OB64_KMC_GCC_SOURCE` can select the checkout instead. Generated output stays
under ignored `build/matching-studies/allocator-owner-order/` and does not use
the shared `build/matching/` cache.

The completed run reproduced four archived `PURE_C` baselines and all five of
their declared 12-byte scheduling residual sites, plus two exact `PURE_C`
controls. Three bounded variants remained non-exact and produced two distinct
final object-plus-relocation states. Their earlier compiler-pass states remain
distinct and recorded even when final emission converges.

At the decisive scheduler choice, the return save's anti-dependence cost is
zeroed and then normalized to cost 1, leaving both candidates in class 3;
original LUID decides the backward-scheduling order. This result falsifies only
the three tested source hypotheses. It does not prove that matching `PURE_C` is
impossible, produce a candidate ready for promotion, or make the isolated links
acceptance evidence. See
[the complete study note](matching-c/allocator-owner-order-study.md) for the
contract, results, limits, and next discriminating experiment.

## Preserve a blocked candidate

`preserve` is the deliberate tracked export:

```powershell
node tools/match.js preserve <candidate-id> --note "why this is worth keeping"
```

It copies the exact candidate and a short dossier into tracked archive paths. It
does not activate or promote the source. Candidate identity includes trailing
whitespace; editing preserved source creates a successor candidate and requires
new identity and dossier references. Do not weaken repository-wide whitespace
checks to accommodate one archived input.

All other routine workbench commands write ignored generated state.

## Scratch compiler limits

Scratch compilation can retain compiler-generated read-only `.rodata` and can
encode supported numeric COP1 operations for the pinned assembler. These are
research allowances only. Canonical build, diff, and verification reject
auxiliary output without a reviewed contract that fixes its read-only section,
bytes, relocations, placement, and ownership.

Do not move active matching sources into shared headers as routine cleanup. The
production path currently sends self-contained raw C to KMC `cc1`, no active
target uses `#include`, and included-content dependency identities are not part
of the production/workbench contract. Header support or preprocessing changes
need a separate compiler/toolchain structural task and audit before canonical
use.

Use `--include-details`, `--include-source`, `--include-members`,
`--include-context`, or `--include-targets` only when complete rows are needed;
use `--json` for machine-readable output. The executable help is authoritative
for the current option surface:

```powershell
node tools/match.js --help
```
