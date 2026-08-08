# Phase 1 raw-byte exactness task log

Status: completed; independent review pending

## Activation

- Task: `ob64-retail-dialect-phase1-raw-exactness`, revision 1.
- Launch ID: `1ec4be4cc4e94a72a72736794da9f572`.
- Receiving task: `/root` on `codex-desktop-current`.
- Workspace claim: `docs/Plans/task-logs/ob64-retail-dialect-phase1-r1-1ec4be4cc4e94a72a72736794da9f572.claim.json`.
- Authorized repository: `C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp`.

## Baseline

- Parent branch and HEAD: `main`, `1ac946fae7fee8e601902da8c3234b8e3b8eef62`.
- Decomp branch and HEAD: `main`, `042c7c02e0f86da664c8d34d01597a4e61c4eef3`.
- The Director confirmed the Phase 1 prompt and Director claim as attributable launch additions.
- Preserve the recorded dirty baseline: `config/README.md`, `config/matching-c-targets.json`, `config/phase7/conventional-build.json`, `config/phase8/matching-c.json`, `docs/NEXT_STEPS.md`, `docs/PLATFORM.md`, `docs/subsystems/map-ai-eset-runtime.md`, `tests/phase7_conventional_build.js`, `tools/build_phase7_conventional.js`, `tools/lib/current_workflow.js`, `tools/lib/phase7_conventional.js`, `docs/audit/2026-08-07-func-0019554c-slab-placement-blocker.md`, `src/lib/func_00195410.c`, and the Director-owned Phase 1 prompt.
- No task edit may overlap or revert those changes. `tools/lib/current_workflow.js` is pre-existing dirty and remains outside Phase 1 ownership.

## Technical plan

1. Trace current diff exactness and final linked-target extraction.
2. Add one fail-closed linked-target comparator in the Phase 8 library.
3. Make `runTargetAsmDiffer()` expose score and raw-byte results separately.
4. Update `tools/diff.js` so only both conditions produce `EXACT`.
5. Add fixture coverage for alias-equivalent unequal bytes and malformed sections.
6. Run focused tests, existing exact-target checks, strict verification, and full-ROM verification.
7. Write the evidence index and AAR for independent review.

## Risk and falsifier

The main risk is comparing relocatable object bytes instead of final linked bytes. The implementation fails if a relocated target can report exact without comparing its linked ELF section to baserom bytes.

## Activity

- 2026-08-08: Read the governing rules, assignment, and accepted report sections 6, 9, and 10.
- 2026-08-08: Established the baseline and created the exclusive workspace claim.
- 2026-08-08: Added a shared final linked-target comparator and separate asm-differ/raw result fields.
- 2026-08-08: Added the focused alias fixture and fail-closed section-shape tests.
- 2026-08-08: `node tests/diff_exactness.js` passed.
- 2026-08-08: The preserved pure p3063 candidate now evaluates `asmDifferScoreZero: true`, `rawBytesExact: false`, and `exact: false`.
- 2026-08-08: The preserved candidate has 14 differing bytes in 14 instruction words.
- 2026-08-08: `node tools/diff.js func_0002CD70` reported `EXACT` with independent raw equality.
- 2026-08-08: `node tools/verify.js` passed all 36 active targets and the complete retail ROM.
- 2026-08-08: `node tests/phase8_matching_c.js`, `node tests/workflow_acceptance.js`, and `node tests/active_targets.js` passed against the new current build.
- 2026-08-08: A read-only worker self-check found missing load-header and malformed-score validation.
- 2026-08-08: Added load-placement and strict score/row validation with hostile fixtures.
- 2026-08-08: Final `node tools/verify.js` passed with fingerprint `EFD02AE928D6ADC25CC20AC2B7309F65FD0CBABD1DCE78ED61E804E37ABF493E`.
- 2026-08-08: Final `node tools/diff.js func_0002CD70` preserved exact `HYBRID_C` bytes.
- 2026-08-08: Wrote the evidence index and AAR. All task changes remain uncommitted for Director intake.

## Result

Phase 1 is technically complete. Independent review remains required before Phase 2 starts.
