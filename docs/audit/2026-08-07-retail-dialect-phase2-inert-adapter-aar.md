# Retail dialect Phase 2 inert-adapter AAR

Completed. Phase 2 adds an authenticated inert compiler-assembly adapter while preserving every current byte and source classification. This creates a safe Phase 3 boundary. The Director must freeze the result and route independent critical review.

Review status: `pending`.

## Outcome and scope

The worker implemented classification before compilation, fail-closed dialect dispatch, staged assembly artifacts, deterministic proofs, strict proof recreation, and stale-schema rejection.

All 36 active targets remained exact. The result contains three `PURE_C` targets, 33 `HYBRID_C` targets, zero transformed targets, and zero transformations.

Every hybrid raw and adapted file remained byte-identical. The complete retail ROM retained SHA-256
`571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

No C or assembly source changed. Phase 3 and the function queue remain outside this assignment.

## Claims and evidence grades

| Claim | Grade | Review |
|---|---|---|
| The adapter contract is authenticated, deterministic, target-blind, and fail-closed | `Verified` | `pending` |
| Every current hybrid target uses byte-identical passthrough with zero transformations | `Verified` | `pending` |
| Every current pure target produces zero inert-phase transformations | `Verified` | `pending` |
| Two clean builds reproduce every proof, object, target, report, and linked output | `Verified` | `pending` |
| All 36 targets and the complete US Rev 0 ROM remain exact | `Verified` | `pending` |
| `func_0002CD70` retains both accepted OR-encoding words | `Verified` | `pending` |

The evidence index contains exact commands, artifact hashes, identities, counts, and falsifiers:

`docs/audit/2026-08-07-retail-dialect-phase2-inert-adapter-evidence.md`

## Changed surfaces

Configuration and documentation:

- `config/compiler-assembly-dialect.json`
- `config/matching-c-targets.json`
- `config/README.md`
- `docs/TOOLCHAIN.md`
- `docs/WORKFLOW.md`
- `docs/SOURCE_POLICY.md`
- `docs/AUDIT.md`
- `tests/README.md`

Build and verification code:

- `tools/lib/compiler_assembly_dialect.js`
- `tools/lib/active_targets.js`
- `tools/lib/source_policy.js`
- `tools/lib/phase8_matching_c.js`
- `tools/build_phase8_matching_c.js`
- `tools/verify_phase8_matching_c.js`
- `tools/lib/current_workflow.js`
- `tools/compare_phase8_reproducibility.js`
- `tools/diff.js`
- `tools/audit.js`

Tests and fixtures:

- `tests/compiler_assembly_dialect.js`
- `tests/active_targets.js`
- `tests/source_policy.js`
- `tests/binutils_smoke.js`
- `tests/phase8_matching_c.js`
- `tests/workflow_acceptance.js`
- `tests/workflow_parity.js`
- `tests/fixtures/compiler-assembly-dialect/func_0002CD70.compiler.s`
- `tests/fixtures/compiler-assembly-dialect/func_0025C8A4.compiler.s`
- `tests/fixtures/compiler-assembly-dialect/hostile-conditional.s`
- `tests/fixtures/compiler-assembly-dialect/hostile-coprocessor-move.s`
- `tests/fixtures/compiler-assembly-dialect/hostile-floating-move.s`
- `tests/fixtures/compiler-assembly-dialect/hostile-macro.s`
- `tests/fixtures/compiler-assembly-dialect/hostile-named-register.s`
- `tests/fixtures/compiler-assembly-dialect/hostile-semicolon.s`
- `tests/fixtures/compiler-assembly-dialect/hybrid-balanced.s`
- `tests/fixtures/compiler-assembly-dialect/pure-numeric.s`
- `tests/fixtures/compiler-assembly-dialect/pure-zero.s`

Required records:

- `docs/Plans/task-logs/ob64-retail-dialect-phase2-r2-1c3d7093d091473a85033743eb068a22.claim.json`
- `docs/Plans/task-logs/ob64-retail-dialect-phase2-r2-1c3d7093d091473a85033743eb068a22.md`
- `docs/audit/2026-08-07-retail-dialect-phase2-inert-adapter-evidence.md`
- `docs/audit/2026-08-07-retail-dialect-phase2-inert-adapter-aar.md`

All changes remain uncommitted for Director intake.

## Overlap preservation

Three Phase 2 files contained user-owned or Director-owned edits at activation:

- `config/README.md`
- `config/matching-c-targets.json`
- `tools/lib/current_workflow.js`

The supplied pre-Phase-2 copies remain preserved. Comparison showed only attributable Phase 2 additions.

The matching-target array remained identical as parsed JSON. Only schema 2 and one top-level dialect-manifest pin were added.

The Director must stage these three files by attributable hunk. The Director must not stage unrelated dirty work from the shared tree.

## Verification summary

The focused adapter, active-target, source-policy, binutils, Phase 8, workflow-acceptance, workflow-parity, diff-exactness, and word-assembly suites passed.

The binutils test distinguished GNU OR expansion `0x00801025` from adapted ADDU encoding `0x00801021`.

Two clean external builds passed. Their build reports were byte-identical with SHA-256
`7A7D8EDE7A7AB91B804319670A6E14D5E8D285234A3A36983E36412F4DE2FB2E`.

Their strict verification reports were byte-identical with SHA-256
`C753877C2FF156ABF39CB1A1BED032D65346A956F4B80A6A092BEF3CF22E0BC8`.

The reproducibility comparator matched 36 proofs, 36 objects, 36 linked targets, and all major linked outputs.

`node tools/verify.js` passed all 36 active targets and complete-ROM exactness.

`node tools/verify.js --target func_0002CD70` passed. The target remained `HYBRID_C` and byte-exact.

`node tools/audit.js` passed structural protections and CURRENT exact-ROM verification. Its final report SHA-256 is
`C51004FD892E19A7BC699AA60160B17AF674A3DE1D934C97F218303D19ED4CAE`.

`func_0002CD70` retained target SHA-256
`9842231309587A8F054CE82E257F9DC0FD864608CF90266F53AFF570E37E1ADF`.

Its words at function-relative offsets `+0x004` and `+0x028` remained `0x00801025`.

Final syntax checks passed for 17 JavaScript files. JSON parsing, scoped whitespace checks, and protected-source checks also passed.

## Failed paths and limits

The first dialect unit run found a lost carriage return in section adjustment. The worker corrected line-ending preservation before integrated builds.

The first binutils smoke invocation reached a 60-second wrapper timeout. A connected rerun passed every assertion in 190.3 seconds.

The first audit wrapper reached its 30-minute bound during structural reconstruction. Its detached child later exited without a final verdict.

A second connected audit completed in 8,732.8 seconds and passed. No incomplete run was treated as evidence.

Phase 2 exercises zero transformations in the production corpus. The unit suite covers positive transformations, but Phase 3 must prove nonzero integration separately.

The original retail assembler identity remains unknown. This adapter is an authenticated engineering boundary, not a provenance claim.

## Protocol deviations

A registered read-only helper ran `node tests/active_targets.js` without authority. The command wrote one ignored generated report.

The worker stopped immediately, interrupted the helper, and reported the collision. The Director authorized resumption after confirming containment.

No helper ran further tests or builds. No disputed source file changed.

## Canonical-document changes

This assignment explicitly authorized the following scoped documentation updates:

- `docs/TOOLCHAIN.md` now defines the compiler, adapter, assembler, and proof chain.
- `docs/WORKFLOW.md` now defines classification, artifacts, proof recreation, and derived counts.
- `docs/SOURCE_POLICY.md` now defines pure eligibility and opaque hybrid passthrough.
- `docs/AUDIT.md` now defines dialect authentication, proof checks, stale schemas, and the OR regression.
- `config/README.md` now defines manifest ownership and hash update order.
- `tests/README.md` now registers the direct dialect test commands.

No queue, placement, target, relocation, compiler, assembler, or source-policy contract changed.

## Next action

The Director must inspect attribution and create the Phase 2 worker-result commit.

An independent reviewer must then evaluate the frozen result at critical review level.

Phase 3 and the function queue must remain blocked until the Director accepts that review.
