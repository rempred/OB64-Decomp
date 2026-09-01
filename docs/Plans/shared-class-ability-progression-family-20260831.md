# Shared Class, Ability, and Progression Family Plan

Status: **ready**

## Outcome

This plan covers 59 accepted function owners in one related code family. The
family occupies z64 ROM range `0x00043100..0x000453E0`.

The current family contains:

- 8 exact `PURE_C` functions;
- 2 exact `HYBRID_C` functions; and
- 49 `ASM` functions.

The goal is exact `PURE_C` for the 49 assembly owners. A second goal is exact
`PURE_C` for the two current hybrid owners.

This family supplies class-record access, ability selection, default equipment,
level history, class growth, and character initialization. It is useful to the
class-change system. It does not contain the complete class-change menu or its
complete eligibility formula.

## Evidence boundary

The accepted owner model supplies the range and all 59 function boundaries.
Ordinary matching work must preserve those boundaries.

The parent promotion research supports these family relationships:

- Class records are 72 bytes.
- `func_00044934` resolves a level-dependent class identity.
- `func_00044130` uses the same class-copy relation for field selection.
- The default-equipment accessors support the Angel Knight transformation.
- The complete ordinary class-change eligibility consumer remains unknown.

These relationships provide working context. They do not establish canonical
function names.

External decompilation can identify a family or name candidate. Treat each
external lead as `CANDIDATE`. Independently inspect retail instructions,
callers, callees, strings, and data before recording a `SUPPORTED_ALIAS`.
Only `CANONICAL` evidence can replace a build symbol.

This plan excludes:

- `func_000453e0`, which starts at the family end;
- the unresolved ordinary class-change controller and candidate filter;
- the compressed stat-gate resource and its unknown final consumer;
- end-of-scenario transformation owners; and
- class-card portrait and rendering owners.

## Current status snapshot

This snapshot is dated 2026-08-31. Generated status remains authoritative.
Run `node tools/status.js` before work and after integration.

| Group | Relationship | `PURE_C` exact | `HYBRID_C` exact | `ASM` | Total |
|---|---|---:|---:|---:|---:|
| A | Class scalar and growth accessor template | 0 | 0 | 23 | 23 |
| B | Class resistance accessor template | 0 | 0 | 7 | 7 |
| C | Movement, row ability, size, gender, leadership, and flag accessors | 0 | 0 | 11 | 11 |
| D | Default equipment accessors | 4 | 0 | 0 | 4 |
| E | Class and ability selectors, names, and related helpers | 2 | 1 | 7 | 10 |
| F | Level history, equipment selection, growth, and initialization | 2 | 1 | 1 | 4 |
| **Family** |  | **8** | **2** | **49** | **59** |

## Target inventory

The role names below describe supported working relationships. They are not
canonical symbol names.

### Group A: class scalar and growth accessor template

These 23 frameless leaf owners use one repeated 72-byte class-record selection
shape. Their individual field meanings require separate static support.

| Target | Size | Current status | Plan stage |
|---|---:|---|---|
| `func_00043100` | 84 | `ASM` | 1A exemplar |
| `func_00043154` | 84 | `ASM` | 1A |
| `func_000431a8` | 84 | `ASM` | 1A |
| `func_000431fc` | 84 | `ASM` | 1A |
| `func_00043250` | 84 | `ASM` | 1A |
| `func_000432a4` | 84 | `ASM` | 1A |
| `func_000432f8` | 84 | `ASM` | 1A |
| `func_0004334c` | 84 | `ASM` | 1A |
| `func_000433a0` | 84 | `ASM` | 1A |
| `func_000433f4` | 84 | `ASM` | 1A |
| `func_00043448` | 84 | `ASM` | 1A |
| `func_0004349c` | 84 | `ASM` | 1A |
| `func_000434f0` | 84 | `ASM` | 1A |
| `func_00043544` | 84 | `ASM` | 1A |
| `func_00043598` | 84 | `ASM` | 1A |
| `func_000435ec` | 84 | `ASM` | 1A |
| `func_00043640` | 84 | `ASM` | 1A |
| `func_00043694` | 84 | `ASM` | 1A |
| `func_000436e8` | 84 | `ASM` | 1A |
| `func_0004373c` | 84 | `ASM` | 1A |
| `func_00043790` | 84 | `ASM` | 1A |
| `func_000437e4` | 84 | `ASM` | 1A |
| `func_00043838` | 84 | `ASM` | 1A |

### Group B: class resistance accessor template

These seven owners use the same selection template for the resistance field
cluster.

| Target | Size | Current status | Plan stage |
|---|---:|---|---|
| `func_0004388c` | 84 | `ASM` | 1B exemplar |
| `func_000438e0` | 84 | `ASM` | 1B |
| `func_00043934` | 84 | `ASM` | 1B |
| `func_00043988` | 84 | `ASM` | 1B |
| `func_000439dc` | 84 | `ASM` | 1B |
| `func_00043a30` | 84 | `ASM` | 1B |
| `func_00043a84` | 84 | `ASM` | 1B |

### Group C: movement, ability, and class-property accessors

These owners cover movement, row abilities, hit counts, size, gender,
leadership, and class flags. Confirm each field before assigning a supported
alias.

| Target | Size | Current status | Plan stage |
|---|---:|---|---|
| `func_00043ad8` | 84 | `ASM` | 1C exemplar |
| `func_00043b2c` | 84 | `ASM` | 1C |
| `func_00043b80` | 84 | `ASM` | 1C |
| `func_00043bd4` | 76 | `ASM` | 1C |
| `func_00043c20` | 84 | `ASM` | 1C |
| `func_00043c74` | 84 | `ASM` | 1C |
| `func_00043cc8` | 84 | `ASM` | 1C |
| `func_00043d1c` | 84 | `ASM` | 1C |
| `func_00043d70` | 84 | `ASM` | 1C |
| `func_00043dc4` | 84 | `ASM` | 1C |
| `func_00043e18` | 112 | `ASM` | 1C special selector |

### Group D: default equipment accessors

These exact sources are template and type evidence for the assembly accessors.
Do not refactor them during Stage 1.

| Target | Size | Current status | Plan stage |
|---|---:|---|---|
| `func_00043e88` | 84 | exact `PURE_C` | preserve |
| `func_00043edc` | 84 | exact `PURE_C` | preserve |
| `func_00043f30` | 84 | exact `PURE_C` | preserve |
| `func_00043f84` | 84 | exact `PURE_C` | preserve |

### Group E: class and ability selectors and names

This group depends on the class-record accessors and the class-copy relation.
The two small exact sources provide return-type and address clues.

| Target | Size | Current status | Plan stage |
|---|---:|---|---|
| `func_00043fd8` | 104 | `ASM` | 2A |
| `func_00044040` | 52 | `ASM` | 2A exemplar |
| `func_00044074` | 104 | `ASM` | 2A |
| `func_000440dc` | 84 | `ASM` | 2A |
| `func_00044130` | 264 | exact `HYBRID_C` | 2B pure cleanup |
| `func_00044238` | 264 | `ASM` | 2B |
| `func_00044340` | 24 | exact `PURE_C` | preserve |
| `func_00044358` | 24 | exact `PURE_C` | preserve |
| `func_00044370` | 156 | `ASM` | 2C |
| `func_0004440c` | 1,320 | `ASM` | 2C long owner |

### Group F: progression and initialization

This group uses class-record data to resolve level history, select equipment,
apply per-level growth, and initialize character state.

| Target | Size | Current status | Plan stage |
|---|---:|---|---|
| `func_00044934` | 184 | exact `PURE_C` | preserve and use as evidence |
| `func_000449ec` | 184 | `ASM` | 3A |
| `func_00044aa4` | 1,400 | exact `HYBRID_C` | 3B pure cleanup |
| `func_0004501C` | 964 | exact `PURE_C` | preserve and use as evidence |

## Work strategy

Treat the range as one analysis family. Promote one accepted owner at a time.

Do not combine the 59 owners into one canonical compiler translation unit only
to influence code generation. The measured larger-translation-unit experiment
did not improve registers, stack layout, scheduling, or control flow. A larger
unit can still help shared type analysis. It requires a separate structural
task before it can change canonical ownership.

Do not create a shared header before the first stages match. Early type cleanup
can disturb already exact sources. First prove compatible field widths and
record shapes across several exact functions. A later refactor must preserve
every target and the complete ROM.

Do not add new hybrid implementations during this plan. Preserve the two exact
hybrid fallbacks until their pure replacements pass every gate.

Keep nonmatching C under ignored `build/matching/` paths. Activate a source only
when it is ready for the canonical linked diff. Use the documented preservation
command for durable blocked research.

## Stage 0: establish the baseline

1. Confirm `git status --short --branch` has no unexpected changes.
2. Record the starting commit.
3. Run `node tools/status.js`.
4. Inspect the accepted owner and linkage record for the first target.
5. Inspect the four exact default-equipment accessors as internal examples.

Stop if the ROM, toolchain, boundary, placement, or ownership model fails.
Route a boundary or placement issue as structural work.

## Stage 1: match the 41 accessor owners

Work in three tranches: Group A, Group B, then Group C.

For each tranche:

1. Match the named exemplar first.
2. Use `node tools/match.js prepare <symbol> --variant structured --no-context`.
3. Inspect inferred context, but do not pass it to m2c by default.
4. Compare the exemplar with the exact Group D source shapes.
5. Run the canonical diff early.
6. Apply the proven source shape to one sibling at a time.
7. Derive every field width and offset from that sibling's retail instructions.
8. Verify and commit each exact target before the next target.

If the structured draft is not exact, use the configured ensemble. Use a probe
only when it answers one specific residual mismatch.

Stage 1 is complete when all 41 owners are exact `PURE_C`, or every unresolved
owner has one concrete blocker with preserved evidence.

## Stage 2: match class and ability selection

Complete Stage 2 in this order:

1. Match `func_00044040` as the small selector exemplar.
2. Match `func_00043fd8`, `func_00044074`, and `func_000440dc`.
3. Match `func_00044238` before attempting the related hybrid cleanup.
4. Convert `func_00044130` from exact `HYBRID_C` to exact `PURE_C`.
5. Match `func_00044370`.
6. Match the long owner `func_0004440c` last.

Preserve `func_00044340` and `func_00044358` as exact references. Do not infer
canonical names from their external-family position.

## Stage 3: match progression and initialization support

Complete Stage 3 in this order:

1. Match `func_000449ec` using the adjacent exact resolver as type evidence.
2. Map `func_00044aa4` callers, joins, loop structure, and field widths.
3. Remove every assembler mechanism from `func_00044aa4`.
4. Regain exact target bytes as `PURE_C`.
5. Reverify the existing exact `func_00044934` and `func_0004501C` dependencies.

Do not alter the established level-history formula to invent complete menu
eligibility. The parent research explicitly leaves that consumer unresolved.

## Normal target gate

Use this loop for every new target:

```text
inspect accepted target
-> write or adapt PURE_C
-> node tools/diff.js <symbol>
-> iterate from the concrete linked diff
-> node tools/source_policy.js --target <symbol>
-> node tools/verify.js --target <symbol> --require-pure
-> node tools/verify.js
-> git diff --check
-> commit the verified target
```

The target is complete only when:

- source policy reports `PURE_C`;
- the C object is the sole linked owner;
- accepted placement and size pass;
- linked target bytes are exact;
- the complete ROM is exact; and
- the commit contains only the target and its smallest required configuration.

Attempt a `SUPPORTED_ALIAS` promotion as a sidecar to each match. Insufficient
semantic evidence does not block exact C. Keep the address-based build symbol.

## Stop conditions

Stop the affected target and report exact evidence when:

- the accepted boundary or placement appears wrong;
- compiler output requires an uncontracted auxiliary section;
- the original assembly owner remains linked;
- source policy reports `UNKNOWN`;
- the pinned toolchain cannot be authenticated;
- exact output appears to require an assembler escape hatch; or
- another writer changes an overlapping file.

Do not weaken verification. Do not activate a nonmatching reconstruction. Do
not convert a source mismatch into structural work without direct evidence.

## Family completion gate

The plan is complete when:

- all 59 owners are exact `PURE_C`;
- all 59 accepted boundaries remain unchanged;
- no family target uses an assembler escape hatch;
- `node tools/verify.js` reports an exact complete ROM;
- `node tools/status.js` reports the generated source classes;
- `git diff --check` passes; and
- the final working tree is clean.

Do not maintain a rolling function count in this file. Use generated status for
current totals.

## Required evidence

Decompilation repository:

- `AGENTS.md`
- `docs/WORKFLOW.md`
- `docs/SOURCE_POLICY.md`
- `docs/NEXT_STEPS.md`
- `docs/KMC_GCC_MATCHING_NOTES.md`
- `asm/original/rev0/manifest.json`
- `config/matching-c-targets.json`
- `config/matching-c-linkage.json`

Parent research repository, read-only:

- `AGENTS.md`
- `docs/promotion-system.md`
