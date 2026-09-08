# Independent Material review: compilation-group workbench correction

**Verdict: Accepted.** No material finding remains. The bounded consumer correction may be used normally, and Director `/root` may resume W8 against it. This verdict does not accept complete-group scratch compilation, any source wave, a new structural contract, or matching-C status.

Reviewer `/root/db10_trace_review`; Director `/root`; launch `COMPILATION-GROUP-WORKBENCH-REVIEW-20260908-01`; review activation release `c3c940bd0d1bfbaf32988b6a955314de7421502d`; frozen implementation `9e253e2402a6acd0b7e41472870780d1445fb3e3`.

## Frozen subject and eligibility

The implementation report hashes to `5B975AD84C8DFEE198B0F8760915FE4A5A7EA939B5EFA17844729E912F199A7B`. Its evidence manifest hashes to `4916BBE52C88A3FF865782FFDE8AD17D96557044503DD31411351D6D649794F9`, and its changed-file index hashes to `18CD845A3BF740578E353FD88E2812102FFB353C02137BDC220FDD9D8FC2FEFA`.

I independently hashed every manifest entry. All 400 entries match their retained byte counts and SHA256 values. All fourteen indexed implementation files match their frozen identities. The implementation manifest releases writes and records no live process.

After the review fixtures, I reauthenticated all fourteen changed files, all twenty frozen W8 source/shared inputs, and all twenty-one protected assessed inputs. No identity changed. The fresh review claim was created atomically and read back before any other review write; its task, launch, host, reviewer task and revision match this assignment.

## Technical review

The workbench now consumes `loadActiveTargetModel()` directly. It does not add another group parser or relax the strict registry, source, owner, relocation or toolchain checks. The stricter prerequisite is explicit: even `loadWorkbenchModel({requireBaserom:false})` invokes the active loader, which authenticates the normalized ROM before omitting expected-byte buffers from the returned workbench targets.

The five `combat_pose_metadata` members remain five individual retail targets. Each resolves the same real source, `src/lib/combat_pose_metadata.c`, and the same producer. Each view exposes the complete ordered five-member list and its selected member index. The observed member extents remain 68, 8, 8, 376 and 372 bytes. No member is relabeled as an independently compiled source.

The live fields `activeMatchingSource`, `activeMatchingProducer` and `scratchCompilation` are excluded from `targetRecord()` metadata. I changed all three fields in memory and obtained the identical stored record. I also recomputed every group member's `targetId` from its model ID, structural metadata and expected-byte hash; all five identities agree. A metadata-stripped target still resolves the live group binding through the workbench and remains ineligible for scratch compilation.

The shared admission assertion runs before side effects in `recordCandidate`, `compileCandidate`, `runM2c`, `prepareAndCompile` and `runProbe`. Probe checks both the workbench binding before context preparation and the supplied/resolved Phase 8 context before compiler use. Explicit group sweep selection rejects before target synchronization, compiler preparation, m2c resolution or sweep storage. The unchanged final `text_contract.bindWorkbenchTarget` guard remains a separate later check.

Automatic sweep selection excludes every unsupported group member in default, include-solved and smallest-leaves modes. Explicit group selection rejects with the complete-group diagnostic. Default ranking omits active group members; include-solved ranking includes all five with truthful producer and unsupported-scratch fields. Inspection, context and history can therefore keep their individual target views while scratch operations remain closed.

## Assessment corrections

All three required corrections are satisfied.

- **CGWA-C01:** `tests/compilation_groups.js` creates a fresh `build/tests/compilation-groups/focused-*` root and authenticates the live group configuration, active target configuration and all active sources before and after its fixtures. The review run used `focused-TEiUTQ`; the frozen implementation root was not reused.
- **CGWA-C02:** probe admission is enforced in the library before context preparation, source creation and process launch, including supplied grouped compiler context. It is not dependent on CLI routing.
- **CGWA-C03:** the final frozen real-chain run is `run-plA04o`, after admission factoring. I independently reproduced it in fresh root `run-GPMHzf`.

The retained `routine-incomplete-refactor.log` and `integration-incomplete-refactor.log` are correctly identified as failures from an incomplete intermediate move. They are not used as passing evidence. The final routine log reports 16/16 after the final factoring.

## Independent validation

Fresh review checks produced these results:

- `tests/active_targets.js`: passed; the strict model contains 606 active targets and the positive compilation-group relocation checks passed.
- `tests/compilation_groups.js`: passed both real toolchain fixtures, with 37 and 31 malformed-input rejections, in isolated `focused-TEiUTQ`.
- `tests/matching_workbench.js`: passed, including live producer truthfulness, identity exclusion, direct-library/CLI admission and zero-side-effect controls.
- `tests/matching_workbench_integration.js`: passed in `run-GPMHzf`; six rulesets shared one generation/compile and produced an exact 40-byte `memcpy_bytewise` candidate. Shorter and longer candidates remained scoreable, `.rodata` relocations remained present, malformed functions and COMMON storage rejected, and the repeat reused the candidate/compile identity.
- Independent model and rank scripts confirmed the five-member producer view, structural target identities, stripped-record admission, all three automatic selector exclusions, and default/include-solved ranking behavior using an isolated review database.

These checks establish compatibility for the bounded workbench consumer correction. The real-chain result is scratch evidence only. I did not run a canonical full-ROM build, verifier or structural audit, and this review makes no W8 completion or matching-C claim.

Review evidence is bound in `build/compilation-group-workbench-review-r1/manifest.json`, including the fresh claim and report, review scripts/logs/database, and every file in the three fresh fixture roots. No implementation, production source/configuration, shared tool, test, compiler, runtime, Resolver, canonical database or Git state was changed. All review writes and processes are released to Director `/root`.
