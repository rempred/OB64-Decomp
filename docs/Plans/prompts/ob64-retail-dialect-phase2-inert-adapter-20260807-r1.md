---
task_id: ob64-retail-dialect-phase2-inert-adapter
revision: 1
status: superseded
role: worker
review_level: Critical
inventory_profile: NORMAL
human_gate: none
launch_id: f9b8469449a24184aa9130611ab9b706
workspace_claim: C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp\docs\Plans\task-logs\ob64-retail-dialect-phase2-r1-f9b8469449a24184aa9130611ab9b706.claim.json
depends_on:
  - eace7a5b63febfff0f3a53934e730cdedc4f33b6
  - 39c4cc1a3bb5a62ed171032469362760a9a35c5c
baseline_repositories:
  parent: 1ac946fae7fee8e601902da8c3234b8e3b8eef62
  decomp: 39c4cc1a3bb5a62ed171032469362760a9a35c5c
supersedes: null
current_agents_overrides_prompt: true
---

# Phase 2 worker assignment: inert compiler-assembly dialect adapter

## Mission

Add the authenticated, fail-closed compiler-assembly dialect adapter infrastructure in inert mode.

Do not change any C source. Every current owner must retain exact bytes and classification.

This phase establishes the adapter contract before p3063 migration.

## Governing design

Read `AGENTS.md`, parent `docs/Worker-workflow.md`, this assignment, and sections 8 through 11 of:

`C:\Users\Joe\AppData\Local\Temp\ob64-retail-dialect-221529b0a843423c851d6fa32e751460\retail-assembler-dialect-investigation-20260807.md`

Use frozen Phase 1 commits `eace7a5b63febfff0f3a53934e730cdedc4f33b6` and `39c4cc1a3bb5a62ed171032469362760a9a35c5c`.

## Mission envelope

Work only in `C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp`.

Create the claim and task log before technical writes.

You are the sole repository writer for this phase. Preserve every unrelated edit.

Do not change any file under `src/` or `asm/`.

Do not change `config/toolchain.json`, `config/phase8/matching-c.json`, `config/source-policy.json`, placement, relocations, target hashes, compiler identity, assembler identity, assembler flags, or queue state.

Do not change target entries beyond the plan's top-level manifest pin. Target entries must remain only `symbol` and `source`.

Do not commit, push, publish, resume the queue, or start p3063 migration.

Keep experimental and clean-build outputs outside the repository or under ignored build roots.

The external p3063 permuters predate this program and use isolated roots. Do not control or alter them.

## Dirty-baseline preservation

The original dirty paths remain user-owned.

Three planned Phase 2 files already contain unrelated edits:

- `config/README.md`
- `config/matching-c-targets.json`
- `tools/lib/current_workflow.js`

Their exact pre-Phase-2 copies are under:

`C:\Users\Joe\AppData\Local\Temp\ob64-retail-dialect-implementation-8877eec7d55f407f904e7a77b1863538\phase2-baseline`

Preserve those baseline contents. Record Phase 2 additions separately so the Director can stage only attributable hunks.

Do not touch any other original dirty path.

## Required implementation contract

Classify every target before compilation. Reject `UNKNOWN`.

Only `PURE_C` may enter the parser. `HYBRID_C` must use byte-identical passthrough and report zero transformations.

The sole rule is a complete numeric-register statement:

`move $N,$M` becomes `addu $N,$M,$0`, where both registers are `$0` through `$31`.

Do not accept named registers in version 1.

Do not rewrite explicit `or`, explicit `addu`, directives, labels, comments, data, inline-assembly regions, or other mnemonics.

Reject semicolon statements, macros, conditionals, ambiguous operands, unknown registers, floating-point moves, coprocessor moves, and unsupported syntax.

Reject `#APP` or `#NO_APP` in `PURE_C`. Permit balanced markers only in bypassed hybrid output.

The transformer API must not receive a symbol, address, ROM offset, expected byte, expected word, expected hash, expected count, or transformation offset.

Store and separately hash:

1. untouched `<symbol>.compiler.s`;
2. adapted or passthrough `<symbol>.dialect.s`;
3. section-adjusted `<symbol>.s` consumed by GNU assembler;
4. `<symbol>.dialect-proof.json`.

The proof must record the plan's identities, source-policy digest, eligibility, hashes, counts, and final object/target identities.

Add `config/compiler-assembly-dialect.json`. Authenticate it from the active-target configuration and current-workflow fingerprint.

Keep the pinned KMC compiler and GNU assembler 2.39 with `-EB -mips3 -32` unchanged.

Advance report schemas. Reject stale reports under the new effective toolchain contract.

## Inert-phase gates

- Every source remains unchanged.
- All current `PURE_C` targets report zero transformations.
- Every `HYBRID_C` target reports zero transformations.
- Every hybrid raw and adapted assembly hash is identical.
- Every current object, target, owner, size, placement, symbol, and relocation remains exact.
- `func_0002CD70` remains `HYBRID_C` and byte-exact.
- Its raw words at function-relative offsets `+0x004` and `+0x028` remain `0x00801025`.
- The full ROM remains SHA-256 `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
- Two clean external builds produce identical reports, proofs, objects, targets, counts, and ROMs.
- The heavyweight audit passes with dialect identity and hybrid-passthrough checks.
- The adapter reports zero transformed targets and zero total transformations.

Stop on any transformed current target, hybrid drift, OR regression, source-class drift, unsupported syntax, identity drift, nonreproducibility, or structural change.

## Expected surfaces

The accepted plan names these likely surfaces:

- `config/compiler-assembly-dialect.json`
- `config/matching-c-targets.json`
- `config/README.md`
- `tools/lib/compiler_assembly_dialect.js`
- `tools/lib/active_targets.js`
- `tools/lib/source_policy.js`
- `tools/source_policy.js`, only if shared report integration requires it
- `tools/lib/phase8_matching_c.js`
- `tools/build_phase8_matching_c.js`
- `tools/verify_phase8_matching_c.js`
- `tools/lib/current_workflow.js`
- `tools/audit.js`
- focused tests and fixtures listed in the plan
- `docs/TOOLCHAIN.md`
- `docs/WORKFLOW.md`
- `docs/SOURCE_POLICY.md`
- `docs/AUDIT.md`

Add only causally required files. Record every scope expansion.

## Required records

- Claim: `docs/Plans/task-logs/ob64-retail-dialect-phase2-r1-f9b8469449a24184aa9130611ab9b706.claim.json`.
- Task log: `docs/Plans/task-logs/ob64-retail-dialect-phase2-r1-f9b8469449a24184aa9130611ab9b706.md`.
- Evidence index: `docs/audit/2026-08-07-retail-dialect-phase2-inert-adapter-evidence.md`.
- AAR: `docs/audit/2026-08-07-retail-dialect-phase2-inert-adapter-aar.md`.

Record exact commands, artifact hashes, comparison baselines, transformation counts, audit results, failures, and residual risks.

## Completion

Return a completed or blocked handoff to `/root`.

The Director will inspect attribution, create the Phase 2 result commit, and route independent review.

Phase 3 and the function queue remain blocked until accepted review.
