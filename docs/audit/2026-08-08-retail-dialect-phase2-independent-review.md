# Retail dialect Phase 2 independent critical review

Completed. Verdict: `accepted-with-notes`. Phase 2 safely establishes the authenticated inert adapter boundary without changing current retail output.

This matters because Phase 3 can test nonzero adaptation without weakening the exact baseline. The Director may accept Phase 2 and authorize Phase 3.

The Director must preserve the recorded 36-target baseline overlay when routing Phase 3. No worker correction is required.

Review status: `accepted-with-notes`.

## Frozen subject and effective state

The frozen attributable result is commit `4fc51f3590004fba670b2e3b679d4602bcee2313` on `main`.

The assigned effective state also includes the recorded pre-Phase-2 dirty baseline. That overlay supplies the 36th target and accepted slab mapping.

The frozen commit retains 35 target entries because the Director excluded the user-owned addition. The live effective state contains 36 targets.

The frozen parent and commit target arrays are identical. The baseline and live 36-target arrays are also identical.

The only live target addition is `func_00195410` from `src/lib/func_00195410.c`. Phase 2 adds only schema 2 and one manifest pin.

The review used a fresh external tree containing the frozen commit plus the recorded baseline overlay. No reviewed file or worker record changed.

## Verdict basis

No admissible correction finding emerged.

The transformer receives only compiler-assembly bytes and source class. Its arity guard is at `tools/lib/compiler_assembly_dialect.js:203`.

Pure output rejects APP markers before parsing at `tools/lib/compiler_assembly_dialect.js:130`. Numeric-register matching is fixed at line 143.

Hybrid output uses opaque byte passthrough at `tools/lib/compiler_assembly_dialect.js:207`. It reports zero transformations.

Manifest pins and module identity are validated at `tools/lib/active_targets.js:72` and `tools/lib/active_targets.js:84`.

Classification is validated before compilation at `tools/lib/phase8_matching_c.js:387` and `tools/lib/phase8_matching_c.js:428`.

Strict proof recreation starts at `tools/lib/phase8_matching_c.js:510`. Stored proof bytes are compared at line 629.

Current-state reuse requires schema 2 and the current fingerprint at `tools/lib/current_workflow.js:195`.

The heavyweight audit checks hybrid passthrough and the mandatory memset regression at `tools/audit.js:50` through `tools/audit.js:71`.

## Claims reviewed

| Claim | Result | Independent basis |
|---|---|---|
| Target-blind numeric-GPR rule | Pass | API arity, code inspection, and metadata-argument rejection |
| `UNKNOWN` rejects before adaptation | Pass | Direct falsifier and workflow mutation test |
| `HYBRID_C` is opaque passthrough | Pass | Invalid UTF-8 falsifier and all 33 production proofs |
| Pure APP markers reject | Pass | APP-only, NO_APP-only, balanced, and terminal-APP cases |
| Artifact stages remain separate | Pass | 36 raw, dialect, section-adjusted, object, and proof identities |
| Strict verification recreates proofs | Pass | Copied run-A verification completed successfully |
| Current production transformations remain zero | Pass | Three pure and 33 hybrid proofs independently aggregated |
| `func_0002CD70` remains exact | Pass | Direct ROM extraction, proof inspection, and audit gate |
| Two clean roots reproduce exactly | Pass | Byte comparison of reports, proofs, objects, targets, and outputs |
| Heavyweight audit belongs to this build | Pass | Current fingerprint, build report, verification, ELF, manifest, and ROM identities |
| Phase 2 preserves structural inputs | Pass | Frozen path audit, strict verification, and exact artifact comparison |
| Manifest, module, config, and fingerprint agree | Pass | Recomputed hashes and current-state fingerprint equality |

Each accepted claim retains the worker's `Verified` evidence grade. Independent review status is now `accepted-with-notes`.

## Independent tests and results

The reviewer-owned effective tree was:

`C:\Users\Joe\AppData\Local\Temp\ob64-phase2-review-3028969d9ef044b1969135c2ceb838b6\effective`

The following checks passed:

| Command or check | Result |
|---|---|
| `node tests/compiler_assembly_dialect.js` | Two positive transforms, full numeric-register coverage, two authentic hybrid fixtures, and 11 hostile rejections passed |
| `node tests/active_targets.js` | 36 targets passed; 16 manifest and pin mutations rejected |
| `node tests/source_policy.js` | Classification, adapter invariance, preprocessing failure, and escaped-path checks passed |
| Independent transformer script | Opaque hybrid bytes passed; metadata, marker, named-register, semicolon, label, and unknown cases rejected |
| `node tools/compare_phase8_reproducibility.js` | Run A and run B passed with build-report SHA-256 `7A7D8EDE...FB2E` |
| Independent clean-root scanner | All 36 proofs, objects, assembly stages, linked targets, reports, and ROM bytes matched |
| `node tools/verify_phase8_matching_c.js` | Strict verification passed in 175.6 seconds on a copied run-A root |
| `node tests/workflow_acceptance.js` | Six stale, missing, drifted, or unknown evidence mutations rejected |
| Audit identity recomputation | Recorded and computed current and baseline fingerprints matched exactly |

The strict verification report retained SHA-256 `C753877C2FF156ABF39CB1A1BED032D65346A956F4B80A6A092BEF3CF22E0BC8`.

## Clean-root evidence

The authenticated worker root is:

`C:\Users\Joe\AppData\Local\Temp\ob64-phase2-clean-c7f73e9edae844dba52dfd331d4ff50d`

Run A and run B contained 36 proofs, 36 objects, and 36 linked targets. They also contained 108 distinct assembly-stage files.

Both roots contained three `PURE_C` targets and 33 `HYBRID_C` targets. Both reported zero transformed targets and zero transformations.

All 33 hybrid raw and dialect files matched byte-for-byte. All 36 target slices matched their accepted retail hashes.

| Artifact | Independently observed SHA-256 |
|---|---|
| `build-report.json` | `7A7D8EDE7A7AB91B804319670A6E14D5E8D285234A3A36983E36412F4DE2FB2E` |
| `verification.json` | `C753877C2FF156ABF39CB1A1BED032D65346A956F4B80A6A092BEF3CF22E0BC8` |
| `phase8.us_rev0.z64` | `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A` |
| `phase8.elf` | `D7D27A84287557F020B264D9F10D03CDE83CEFE0D9F930D6060EDFEC3F16F03B` |
| `objects/manifest.json` | `ADBA23FAB2242F53EF21E7656157F68581CF21223F663328A6E0ADE09C495F48` |

## Real `func_0002CD70` falsifier

The linked target remains `HYBRID_C`. Its target SHA-256 is `9842231309587A8F054CE82E257F9DC0FD864608CF90266F53AFF570E37E1ADF`.

The z64 ROM target starts at `0x0002CD70`. The words at function-relative offsets `+0x004` and `+0x028` are both `0x00801025`.

Its compiler and dialect assemblies share SHA-256 `040B9057A3F11214D78D719ACD75E96621056A172A862C24120A9DC84DB66969`.

Its proof records five APP markers, four NO_APP markers, two explicit OR statements, and zero transformations.

## Audit identity

The heavyweight audit was not rerun. No evidence audit exposed a concrete need for another multi-hour execution.

The accepted audit report has SHA-256 `C51004FD892E19A7BC699AA60160B17AF674A3DE1D934C97F218303D19ED4CAE`.

Its current fingerprint is `A027104B14AE468D38299B8D8AE474C4CACFB085AB59EE7B787EDA07B063E19E`.

Independent recomputation produced the same fingerprint. The baseline fingerprint also matched `38505F4E9DEC810884884CF4AC1709B72011C7E16CE57D3EFA2891A0DF794DA9`.

The audit's build report, verification, ELF, object manifest, and ROM hashes match both clean roots.

The audit identifies manifest SHA-256 `FD87D6E56A9285D7D37A6FCFCE972787FDED7C7B5A4C8536EF50A5408F1D0331`.

It also identifies adapter-module SHA-256 `224E12F01B28E30C1402E0C6A6524529DA21C26E6BD62CDF953FF198A8229B12`.

## Preservation result

The Phase 2 commit changes no path under `src/` or `asm/`. It does not change `config/toolchain.json` or `config/source-policy.json`.

It does not change `config/phase8/matching-c.json`, placement configuration, or `docs/NEXT_STEPS.md`.

The frozen 35-target array matches its parent. The live 36-target array matches the preserved pre-Phase-2 baseline.

Strict verification passed every owner, placement, size, symbol, relocation, linked target, and full-ROM check.

## Adversarial-test admissibility

The adapter falsifiers used supported compiler-output inputs and the production adapter entry point. Failure could have changed retail instructions.

The manifest mutations model ordinary configuration or module drift. The active-target loader is the supported producer and rejection boundary.

The stale and missing proof mutations model old caches or interrupted evidence production. Strict verification is the supported consumer.

Each test changed one variable in a reviewer-owned external copy. Each was the smallest useful in-scope falsifier.

All were acceptance tests under the assigned fail-closed build threat model. No hostile concurrency or deliberate hash forgery was used.

## Compatibility notes

Phase 2 advances build, verification, current-state, fresh-compilation, reproducibility, proof, diff, and audit schemas.

Old reports and caches intentionally reject under the new effective toolchain. Downstream consumers must regenerate them before reuse.

The frozen commit is an attributable patch, not a standalone 36-target checkout. Phase 3 must retain the recorded baseline overlay.

A raw `git archive` diagnostic also normalized fixture line endings. Authentic compiler-output fixture hashes require the accepted Windows checkout behavior.

These are compatibility and composition notes. They are not correctness findings against the assigned effective state.

## Assumptions and residual risk

The review assumes Phase 3 starts from the same coherent 36-target baseline or a separately frozen equivalent.

The original retail assembler identity remains unknown. The adapter proves an authenticated engineering boundary, not historical assembler provenance.

Production currently exercises zero transformations. Phase 3 must independently prove its expected 14 transformations and unchanged explicit OR statements.

The review authenticated both clean roots and reran strict verification on one copied root. It did not repeat the multi-hour structural audit.

## Exact route

The Director may record Phase 2 as accepted with notes. The Director may then authorize Phase 3 against the coherent 36-target effective state.

No correction assignment is required. The function queue remains governed by the Director's separate routing decisions.
