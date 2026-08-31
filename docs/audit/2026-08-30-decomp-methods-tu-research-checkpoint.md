# Decompilation-method and intended-TU research checkpoint

Date: 2026-08-30

Frozen base: `ee6151458d789cab3d1242637b873ae0da5b2cee`

Director branch: `codex/decomp-methods-tu-director`

This is an evidence checkpoint, not authorization to regroup canonical source, merge logical functions, weaken accepted ownership, or replace the current Matching-C workflow. Product infrastructure is deferred at this checkpoint.

Post-checkpoint implementation and final review are recorded in [2026-08-30-decomp-methods-tu-director-report.md](2026-08-30-decomp-methods-tu-director-report.md). That later work implemented only the scratch compiler repair and mismatch classifier; provider and TU infrastructure remained deferred.

## Vocabulary and baseline

The investigation kept three concepts separate:

- A **logical function** is a callable routine or a proven multi-entry routine.
- An **accepted owner** is the ROM/runtime range and linked-byte ownership recognized by this repository.
- A **translation unit** is one or more logical functions plus file-local data compiled into one object.

At the frozen clean base, `node tools/verify.js` passed baserom identity, authenticated toolchain, source policy, C ownership, placement, relocations, exact target bytes, and the complete ROM. The generated status was:

| State | Functions/owners | Bytes |
|---|---:|---:|
| Exact `PURE_C` | 387 | 18,992 |
| Exact `HYBRID_C` | 64 | 35,228 |
| Assembly owners remaining | 5,733 | 6,456,224 |
| `UNKNOWN` source class | 0 | — |

The normalized Rev-0 ROM is 41,943,040 bytes with SHA-256 `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

The workbench model had 4,851 accepted function targets, 4,848 ordinary targets, and 4,400 targets without an active C owner. Those are function-target counts; they are not interchangeable with the 5,733 remaining assembly-owner rows.

## Fair benchmark method

The 34-target corpus was selected and frozen without opening canonical matched C. It contains 19 exact `PURE_C` controls, six exact `HYBRID_C` controls, and nine unresolved assembly targets. Selection used generated source class, accepted owner/linkage/placement metadata, assembly-derived metrics, and subsystem evidence. `func_002A0EF0` was intentionally excluded because its live multi-owner investigation is not an ordinary lifter or TU target.

Candidate generation used only fixed automatic provider commands. No candidate was manually edited. Exact controls supplied accepted assembly, bytes, relocations, primitive context, and bounded jump-table evidence but not canonical C. Canonical source could be inspected only after the scored freeze for diagnosis. A later cross-lane status update disclosed high-level descriptions of a few source shapes; the corpus, commands, variants, compiler-adapter experiment, and clusters were already frozen and were not changed afterward.

This was blind candidate generation at execution time, but it was not a holdout evaluation of the pre-existing ensemble. The `structured-return-flow` and `structured-cursor-steps` transforms predated this pilot and had been developed/validated on `func_0012E950` and `func_000143dc`. Their exact rows are calibrated controls that show retained capability, not generalization. Excluding those rows, the default workbench has one out-of-sample exact control (`strlen`), and the context run has none.

An emitted C file was never counted as a match. The corrected schema separately records provider emission, compiler exit, object assembly, scratch-contract acceptance, scoreability, exact scratch text, canonical linked proof, and complete-ROM proof.

## Lifter results

The durable 204-row table is [benchmark-rows.csv](evidence/2026-08-30-decomp-methods-tu/benchmark-rows.csv); the blind corpus is [corpus.json](evidence/2026-08-30-decomp-methods-tu/corpus.json). Exact per-row provider commands, cwd/environment contracts, ordered inputs and hashes, and retained input adapters are in [provider-reproduction.jsonl](evidence/2026-08-30-decomp-methods-tu/provider-reproduction.jsonl).

| Method | Lifted | Explicit refusals | Candidates | Scoreable objects | Exact scratch, all | Exact excluding calibrated controls | Canonical linked/full-ROM proof, all / holdout |
|---|---:|---:|---:|---:|---:|---:|---:|
| Raw old-style m2c | 29/34 | 5 | 29 | 0 | 0 | 0 | 0 / 0 |
| Raw m2c plus current syntax adapter | 29/34 | 5 | 29 | 3 | 1 | 1 | 0 / 0 |
| Current `match.js` default | 34/34 | 0 | 104 | 24 | 3 | 1 | 3 / 1 |
| Current `match.js --with-context` | 34/34 | 0 | 103 | 23 | 1 | 0 | 1 / 0 |
| Multi-function m2c | 9 applicable rows | 0 | 9 | 6 | 0 | 0 | 0 / 0 |
| asmlift | 1/34 | 33 | 1 | 1 | 0 | 0 | 0 / 0 |

Headline conclusions:

- m2c through the existing workbench remains the default candidate generator. It had complete coverage and the best compile/score/exact results.
- Historical raw m2c “success” meant only exit code zero, nonempty output, and no literal `Decompilation failure`; its reported 91.2% was an emission rate, not a compile, semantic, instruction, linked-owner, or ROM-match rate.
- asmlift `be9f44a` was reproducible and correctly explicit about refusal, but it emitted one candidate and refused 33 targets: unsupported calls, branch-likely instructions, COP1 operations, and indirect jumps dominated. It does not justify provider integration now.
- Passing the current inferred context reduced exact controls from three to one. Context quality, not context quantity, is the limiting issue.
- Multi-function m2c changed only one of nine owner-level outputs and produced no exact result. After correcting `func_002861C8` to three logical functions, combined context changed zero of three structured sources and improved zero of three best results.
- The evidence favors narrow KMC-aware workbench transformations and better relocation/data/type context. It does not justify a general m2c fork. A fork should be considered only for a demonstrated parser/IR limitation, such as the label-before-delay-slot failure that survives guarded input normalization.

### Corrected `func_002861C8` measurement

The original owner-level input incorrectly presented a 636-byte accepted owner containing three compiler functions as one glabel. That row remains evidence of current owner-level `match.js` behavior, but it is not a fair per-logical-function result.

The [15-row supplement](evidence/2026-08-30-decomp-methods-tu/func-002861c8-logical-supplement.csv) measures:

| Logical function | Accepted role/range | Best current-workbench score | Result |
|---|---|---:|---|
| `func_002861C8` | global primary, `0x2861C8..0x2862FC` | 43.10 | scoreable, nonexact |
| `func_002861C8_scan` | local internal-call-only helper, `0x2862FC..0x2863F8` | 39.32 | scoreable, nonexact |
| `func_002861C8_find` | local fixed-address helper, `0x2863F8..0x286444` | 37.70 | scoreable, nonexact |

asmlift refused the primary indirect jump and both branch-likely helpers. Combined m2c context did not improve any of the three.

## Grouped-TU compilation pilot

The durable per-function table is [phase2-function-results.csv](evidence/2026-08-30-decomp-methods-tu/phase2-function-results.csv). It covers 16 exact accessors, seven exact parser/resource controls, and the three proven functions inside the `func_002861C8` owner.

- All 26 logical-function slices were identical grouped versus separate after relocation at the accepted VMAs. Grouping changed no registers, stack frames, masks, instruction scheduling, sizes, bindings, or function order.
- All 23 exact `PURE_C` controls remained exact. The closest `PURE_C` `func_002861C8` candidate also remained unchanged: its primary and find functions were exact after relocation, while the scan function retained the same six `$t2`/`$t3` allocation words from retail.
- The real 32-byte `func_00283E14` table and 24-byte `func_002861C8` table retained their bytes, entry order, alignment, and normalized relocations.
- Four parser-control raw object words and several `func_002861C8` raw words changed only because section-relative relocation encodings changed. Relocation-normalized and scratch-linked function bytes were unchanged.
- Identical doubles were not pooled across functions. Grouping retained two literal entries, changed the later reference addend to `+8`, and removed duplicate per-object alignment tails. That is object packaging evidence, not an accepted-ROM improvement.
- The seven-function parser source exposed genuine incompatible prototype, storage-view, and volatility declarations. Its exact emitted bytes do not make the warning-bearing source a sound fixture or prove a shared original type.
- Existing production orchestration still compiles one object per accepted target. No grouped object spanning accepted owners received sole-owner, placement, full-relocation, or complete-ROM proof.

Empirical answer: with this compiler and corpus, ordinary same-TU compilation did not improve function code. It clarified shared declarations and changed scratch object/data packaging, but it did not improve accepted jump-table, string, constant, or padding placement.

## Hijs source organization

The exact mapping is [hijs-segment14-mapping.csv](evidence/2026-08-30-decomp-methods-tu/hijs-segment14-mapping.csv).

The read-only source was `https://codeberg.org/hijsje/ogrebattle64`, branch `main`, commit `511c8ca0fb0fdcabd72b4c023a644e900f3b9112`. The supplied archive SHA-256 is `B4F8D0148F2CA10F6CD045C11AC32B87632FDB1F466E6ABF0A86BD519DC82743`; 119 of 119 files matched the inspected Git blobs. Its expected ROM SHA-1 is the same Rev-0 identity, `9CD0CFB50B883EDB068E0C30D213193B9CF89895`.

Hijs did not represent this region as one giant multi-entry C function:

- `src/segment_14/281860.c` contains 25 separately named `INCLUDE_ASM` routines, including the routine corresponding to `func_002827EC`. Its YAML-associated `.rodata` begins at `0x286B50`.
- `src/segment_14/283DF0.c` contains 17 separately named `INCLUDE_ASM` routines in ROM order: `0x283DF0`, the seven exact parser controls, the one large parser at `0x284288`, three entries at `0x2861C8/0x2862FC/0x2863F8`, and five later helpers through `0x286620`. Its YAML-associated `.rodata` begins at `0x286B90`.
- The Makefile pattern compiles each wrapper `.c` into one object. `INCLUDE_ASM` injects separate assembly routines and `INCLUDE_RODATA` fragments into that object. These files are hybrid assembly wrappers, not `PURE_C` and not proof of original retail source boundaries.

Hijs independently chose a multi-function/object grouping consistent with the likely parser/resource module, including the three logical functions inside our `func_002861C8` owner. The final Director report records its relevant compiler flags, macros, includes, Clang check, Shift-JIS preprocessing, assembler/linker rules, and full dependency gitlinks. Its setup downloads unchecksummed `latest/download` compiler archives and its ordinary assembly/link path uses unversioned system `mips-linux-gnu-*` tools, so an independent successful Hijs build/object reproduction was not established.

## Logical functions versus likely TUs

The current accepted model is not broadly split into logical functions that are too small:

- `func_00284288` is one valid 8,000-byte logical parser function with one `0x78` frame, one return, no internal call target, and no non-call edge into its interior or across its owner boundary.
- The accepted `func_002861C8` owner contains three ordinary compiler functions with independent returns. It is one owner and one current C TU, but three logical functions.
- `func_002A0EF0` remains the opposite exceptional case: one logical function crosses two accepted owners and a branch/delay-slot seam. TU recovery must not replace its multi-owner structural contract.
- No evaluated parser, switch, or control boundary showed a direct non-call edge, fallthrough, shared frame, or shared tail that would justify merging ordinary logical functions.

The present source files are nevertheless likely finer than historical TUs. Strong leads include function ordering, internal-only helpers, common private declarations, Hijs's independent multi-function grouping, and the ordered auxiliary data. Those facts support experiments; they do not prove exact original TU start/end boundaries.

The best future real intended-TU reconstruction is the `0x283DF0` parser/resource/scanner cluster, centered on `func_00284288` plus the three logical functions in `func_002861C8`. A warning-free infrastructure fixture should instead begin with the 16 exact accessors, because they isolate multi-owner TU mechanics without `.rodata` or incompatible declarations.

A proven parser/resource TU might eventually replace the special shared auxiliary-row arrangement for row 5131, possibly the compiler-padding/assembly-tail arrangement for row 5130, and the ad hoc single-owner/multiple-compiler-function representation of `func_002861C8`. It must not replace accepted per-function ranges, relocation proof, assembly fallback, sole ownership, complete-ROM verification, or the `func_002A0EF0` multi-owner contract.

## Independent methodology review and resolutions

| Finding | Resolution at this checkpoint |
|---|---|
| Scratch candidate compilation lacks the now-required compiler-function metadata. | Confirmed. Benchmark rows distinguish compiler/object/contract/scoreable states. A production scratch-specific path must validate emitted symbols and allow diagnostic length differences without weakening canonical compile checks. No product patch was included here. |
| `func_002861C8` owner was unfairly treated as one logical function. | Confirmed and resolved by the fixed 15-row supplement; the owner-level row remains separately labeled as current behavior. |
| The seven-function parser fixture has incompatible declarations and warnings. | Confirmed. It is evidence of a shared-source-model problem, not an acceptable fixture. The 16 accessors are the safer future infrastructure control. |
| `compileSuccess` conflated scratch validation with post-hoc scoreability. | Resolved in the corrected schema-v2 table with separate state fields. |
| `relocation-only` does not prove relocation symbol/addend identity. | Confirmed. Future classification should use a weaker `relocation-mask-compatible` likelihood until normalized records match. No classifier claim was strengthened here. |
| Principal evidence lived only under ignored/user-specific paths. | Resolved with bounded corpus/result/mapping tables plus a 350-record provider provenance file and three retained input implementations; ROMs, objects, generated C/assembly, compiler output, and bulk reports remain excluded. |
| Hijs build reproducibility was overstated. | Resolved by recording the exact commit/archive, Makefile assumptions, full gitlinks, and unchecksummed/generated compiler plus unpinned-system-binutils limitation. |

## Checkpoint decisions

1. Keep m2c through `tools/match.js` as the default generator.
2. Do not add asmlift or a general candidate-provider interface yet. asmlift remains a reproducible, failure-isolated research provider, not a competitive candidate source on this corpus.
3. Do not fork m2c for source-shape search. Keep KMC-specific transformations in the workbench; escalate only a reproduced parser/IR limitation.
4. Repair the scratch compiler contract before expanding search or classification. Follow with an evidence-bearing, multi-label mismatch classifier that compares normalized relocation records.
5. Defer experimental TU manifests and general grouped-object support. No grouped multi-owner object has production ownership/full-ROM proof, and the interesting parser fixture is not declaration-clean.
6. Do not regroup canonical source in this task. Revisit a tightly controlled accessor fixture first, then a dedicated `0x283DF0` parser/resource intended-TU task.

Still unproven are exact original TU boundaries, whether Hijs's grouping reflects retail source rather than later reconstruction, useful string placement changes, improvement from richer private types/static declarations, PURE_C promotion of `func_002861C8`, any TU solution for `func_00284288`, and any grouped multi-owner exact-ROM implementation.

The bundle manifest, source paths, tool identities, hashes, and reproduction limits are recorded in [manifest.json](evidence/2026-08-30-decomp-methods-tu/manifest.json).
