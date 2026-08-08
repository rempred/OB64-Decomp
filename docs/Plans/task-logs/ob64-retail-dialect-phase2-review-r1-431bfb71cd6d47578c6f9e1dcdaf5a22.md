# Phase 2 inert-adapter independent review log

Status: `completed`. Verdict: `accepted-with-notes`.

## Activation

- Assignment: `docs/Plans/prompts/ob64-retail-dialect-phase2-review-20260808-r1.md`.
- Revision: `1`.
- Launch ID: `431bfb71cd6d47578c6f9e1dcdaf5a22`.
- Receiving task ID: `/root/phase2_review`.
- Host ID: `codex-desktop-current`.
- Inventory profile: `NORMAL`.
- Parent starting HEAD: `1ac946fae7fee8e601902da8c3234b8e3b8eef62` on `main`.
- Decomp starting HEAD: `4fc51f3590004fba670b2e3b679d4602bcee2313` on `main`.
- Frozen subject: `4fc51f3590004fba670b2e3b679d4602bcee2313`.

The assigned claim did not exist at activation. It was created atomically at
`2026-08-08T06:31:40.6620460Z` before this log or any technical review write.

## Baseline inventory

The parent repository had extensive pre-existing user-owned changes. They do not overlap this review's decomp-only write paths.

The decomp repository had these pre-existing tracked changes:

- `config/README.md`
- `config/matching-c-targets.json`
- `config/phase7/conventional-build.json`
- `config/phase8/matching-c.json`
- `docs/NEXT_STEPS.md`
- `docs/PLATFORM.md`
- `docs/subsystems/map-ai-eset-runtime.md`
- `tests/phase7_conventional_build.js`
- `tools/build_phase7_conventional.js`
- `tools/lib/current_workflow.js`
- `tools/lib/phase7_conventional.js`

The decomp repository also had these pre-existing untracked paths:

- `docs/Plans/prompts/ob64-retail-dialect-phase2-review-20260808-r1.md`
- `docs/audit/2026-08-07-func-0019554c-slab-placement-blocker.md`
- `src/lib/func_00195410.c`

The review report and review log paths were absent. No baseline path overlaps them.
The prompt identifies the `config/README.md`, `config/matching-c-targets.json`, and
`tools/lib/current_workflow.js` hunks as the live dirty-baseline relationship relevant to Phase 2.

## Review execution

The review inspected frozen commit `4fc51f3590004fba670b2e3b679d4602bcee2313` directly.

The commit changes 44 files with 2,682 additions and 82 deletions. It changes no source or assembly path.

The frozen target array contains 35 entries and matches its parent. The preserved baseline and live arrays contain the same 36 entries.

The reviewer created this external evidence root:

`C:\Users\Joe\AppData\Local\Temp\ob64-phase2-review-3028969d9ef044b1969135c2ceb838b6`

### Focused adapter and manifest checks

Commands:

```text
node tests/compiler_assembly_dialect.js
node tests/active_targets.js
node tests/source_policy.js
```

The effective-tree runs passed. The adapter suite covered every numeric general-purpose register and two authentic hybrid fixtures.

The manifest suite passed 36 targets and rejected 16 pin or identity mutations.

The source-policy suite passed after the authenticated preprocessor toolchain was copied into the external tree.

The first source-policy attempt lacked the external preprocessor. The second had only `cpp.exe` and lacked its compiler companion.

Those two failures were reviewer-tool setup failures. Copying the complete authenticated toolchain corrected the named cause.

An independent inline falsifier passed these cases:

- numeric-only pure transformation;
- explicit OR preservation;
- opaque invalid-UTF8 hybrid passthrough;
- `UNKNOWN` pre-adaptation rejection;
- pure APP-marker rejection;
- transformer metadata-argument rejection;
- named-register rejection;
- semicolon rejection; and
- labeled-move rejection.

It recomputed manifest SHA-256 `FD87D6E56A9285D7D37A6FCFCE972787FDED7C7B5A4C8536EF50A5408F1D0331`.

It recomputed module SHA-256 `224E12F01B28E30C1402E0C6A6524529DA21C26E6BD62CDF953FF198A8229B12`.

### Clean-root authentication

Command:

```text
node tools/compare_phase8_reproducibility.js --left <worker-root>\run-a --right <worker-root>\run-b
```

The comparator passed with build-report SHA-256 `7A7D8EDE7A7AB91B804319670A6E14D5E8D285234A3A36983E36412F4DE2FB2E`.

An independent scanner compared every required artifact in both roots.

It matched 36 proofs, 36 objects, 36 raw assemblies, 36 dialect assemblies, and 36 section-adjusted assemblies.

It found three pure targets, 33 hybrid targets, zero transformed targets, and zero transformations.

All 33 hybrid raw and dialect files matched byte-for-byte. All 36 target slices matched the retail ROM.

The ROM SHA-256 remained `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

### Strict verification

The reviewer copied run A before verification. The worker evidence root remained unchanged.

Command:

```text
node tools/verify_phase8_matching_c.js --output <copied-run-a> --compiler <accepted-cc1.exe> --splat-python <accepted-python.exe> --splat-split <accepted-split.py> --asm-differ <accepted-asm-differ> --report <review-root>\strict-verification.json
```

Strict verification passed in 175.6 seconds. Its report SHA-256 is `C753877C2FF156ABF39CB1A1BED032D65346A956F4B80A6A092BEF3CF22E0BC8`.

Command:

```text
node tests/workflow_acceptance.js --output <copied-run-a>
```

The first run reached the local-tool configuration gate after completing mutation checks. The retry supplied `OB64_LOCAL_TOOLS` and passed.

It rejected stale build, verification, and proof schemas. It also rejected missing proof, hybrid hash drift, and recorded `UNKNOWN` class.

### Real memset regression

The direct ROM extraction retained target SHA-256 `9842231309587A8F054CE82E257F9DC0FD864608CF90266F53AFF570E37E1ADF`.

The words at function-relative offsets `+0x004` and `+0x028` remained `0x00801025`.

The proof retained five APP markers, four NO_APP markers, two explicit OR statements, and zero transformations.

### Heavyweight-audit identity

The heavyweight audit was not rerun. The evidence audit found no concrete reason for another multi-hour execution.

The accepted audit report SHA-256 is `C51004FD892E19A7BC699AA60160B17AF674A3DE1D934C97F218303D19ED4CAE`.

The recorded current fingerprint is `A027104B14AE468D38299B8D8AE474C4CACFB085AB59EE7B787EDA07B063E19E`.

Independent recomputation matched that value. It also matched baseline fingerprint `38505F4E9DEC810884884CF4AC1709B72011C7E16CE57D3EFA2891A0DF794DA9`.

The audit's build report, verification, ELF, object manifest, and ROM identities matched both clean roots.

### Diagnostics

A raw `git archive` tree failed authentic-fixture hashes because archive bytes use normalized line endings.

It also lacked the recorded baseline overlay, so the 35-target active model did not match the accepted slab mapping.

The assignment defines the effective state as the frozen attributable commit plus the preserved baseline. These diagnostics do not fail that state.

### Final result

No admissible correction finding emerged.

Review report:

`docs/audit/2026-08-08-retail-dialect-phase2-independent-review.md`

The Director may accept Phase 2 with notes. Phase 3 must preserve the coherent 36-target baseline overlay.
