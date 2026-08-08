# Phase 2 inert dialect-adapter task log

Status: routed. Revision 1 stopped before technical implementation because its hybrid-marker gate conflicts with authenticated KMC output. This stop prevents a false rejection of accepted hybrid targets. The Director must issue revision 2 with a corrected gate, fresh launch, and fresh claim.

## Activation

- Task ID: `ob64-retail-dialect-phase2-inert-adapter`.
- Assignment revision: `1`.
- Launch ID: `f9b8469449a24184aa9130611ab9b706`.
- Receiving task ID: `/root/phase2_worker`.
- Director task ID: `ob64-retail-dialect-implementation-director`.
- Director collaboration ID: `/root`.
- Host ID: `codex-desktop-current`.
- Inventory profile: `NORMAL`.
- Human gate: none.
- Claim: `docs/Plans/task-logs/ob64-retail-dialect-phase2-r1-f9b8469449a24184aa9130611ab9b706.claim.json`.

## Mission and boundaries

The worker will add authenticated compiler-assembly dialect infrastructure in inert mode. The worker must not change C or assembly sources. The worker must not migrate `p3063`, alter queue state, commit, or push.

The worker owns writes only inside `C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp`. The three overlapping Phase 2 files retain their supplied dirty-baseline bytes. Every other original dirty path remains untouched.

## Baseline

- Parent branch and HEAD: `main` at `1ac946fae7fee8e601902da8c3234b8e3b8eef62`.
- Decomp branch and HEAD: `main` at `39c4cc1a3bb5a62ed171032469362760a9a35c5c`.
- Decomp upstream state: `main...origin/main [ahead 4]`.
- Phase 1 dependency commit: `eace7a5b63febfff0f3a53934e730cdedc4f33b6`, object type `commit`.
- Decomp dependency commit: `39c4cc1a3bb5a62ed171032469362760a9a35c5c`, object type `commit`.

The initial `NORMAL` inventory contained these user-owned paths:

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
- `docs/Plans/prompts/ob64-retail-dialect-phase2-inert-adapter-20260807-r1.md`
- `docs/audit/2026-08-07-func-0019554c-slab-placement-blocker.md`
- `src/lib/func_00195410.c`

The claim became the first Phase 2 repository write. Its SHA-256 was `24243D7A4372026A7669869C658766876F281F29D6DF15EEDC929EB59847C318` after readback.

## Overlap preservation

The supplied copies matched the working files before Phase 2 changes:

| Path | Pre-Phase-2 SHA-256 | Copy match |
|---|---|---|
| `config/README.md` | `DE70B0C5B1520DD0881E3E264AFB4B2C9BDCC9CF33F437332FBBE3FFC8F81BB3` | yes |
| `config/matching-c-targets.json` | `C7B09D281225D195CCF8F002580189071229D7E8160813B7D34D230632B4AB06` | yes |
| `tools/lib/current_workflow.js` | `5229608481A550361D88073B19FE1EBE8847081B8F440642206305417BC70A72` | yes |

The copy root is `C:\Users\Joe\AppData\Local\Temp\ob64-retail-dialect-implementation-8877eec7d55f407f904e7a77b1863538\phase2-baseline`.

## Technical plan

1. Read the accepted design and current toolchain, workflow, source-policy, and audit contracts.
2. Map every affected loader, build consumer, verifier, schema, and audit check.
3. Add a fail-closed adapter parser, manifest authentication, artifact pipeline, and proof schema.
4. Add focused rejection, passthrough, transformation, authentication, and stale-report tests.
5. Run focused tests before both clean external builds.
6. Compare reports, proofs, objects, targets, counts, and complete ROM identities.
7. Run the dedicated `func_0002CD70` gate and the heavyweight audit.
8. Write the evidence index and after-action report for Director intake.

The strongest preservation risk is accidental byte drift from assembly rewriting or stale identity acceptance. Hash comparisons and full-ROM gates distinguish both failures.

## Activity

- `2026-08-08T01:03:03.501Z`: Created and verified the exclusive workspace claim.
- `2026-08-08`: Confirmed both assigned baseline commits and dependency objects.
- `2026-08-08`: Confirmed all three supplied dirty-baseline copies match the working files.

## Failures and deviations

- A first baseline-copy lookup assumed repository-relative subdirectories. The supplied copies use flat filenames. No file changed, and the corrected lookup proved all three identities.
- Ten accepted `HYBRID_C` outputs end with a terminal `#APP` state at end-of-file.
- A literal balanced-marker requirement would reject the accepted inert baseline.
- Independent read-only evidence tied this shape to authenticated KMC GCC 2.7.2 behavior.
- The Director ruled that `HYBRID_C` bypass is opaque and must not gate APP syntax.
- The Director ruled that `PURE_C` rejects either marker and `UNKNOWN` rejects before adaptation.
- This ruling corrects an explicit revision-1 done-gate, so technical implementation did not start.

## Terminal routing

- Terminal status: `superseded-before-technical-work`.
- Adapter implementation files changed: none.
- Source files changed: none.
- Builds, tests, experiments, and audits run: none.
- Revision-1 records changed: claim and this task log only.
- Required successor: revision 2 with a new launch ID and workspace claim.

## Next action

The Director must issue revision 2 before any Phase 2 technical work resumes.
