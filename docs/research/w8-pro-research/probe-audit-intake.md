# Intake: generic probe and evidence reuse assessment

2026-09-08. This is an independently checked intake of Joe's supplied `## Overall finding.txt` (SHA-256 `B27FB7E3BADDCCC47B7BEE0932D3852D035616737E2146A96158A926E7B9AF21`) and `OB64-probe-audit-reproducer-2026-09-08.zip` (`71E696520DE9903DCB4F7D6334B0F582667C5065F65362D8C0D5729B7EDDA91F`). No production source, shared tool, compiler, configuration or matching acceptance changed.

## Reproduced findings

The ZIP's probe subject exactly equals the current committed [probe.js](../../../tools/lib/matching/probe.js), Git blob `2dff2ce933ddd1a1b6f849e34e500a97985b1b40`. The working file has the same normalized text. The supplied harness was read before execution and copied only into ignored `build/probe-audit-intake-20260908/`. The executed harness differs only by an explicit resolved temporary-directory validation before recursive cleanup. The probe subject remains unchanged. No external harness or implementation source was copied into tracked code.

All seven isolated mocked checks reproduced:

- Authored include/macro text reaches the mocked compiler unchanged.
- Changing fixture header contents reuses the complete report.
- Changing effective flags with target identity held fixed reuses the old report and old command arguments.
- Deleting a recorded RTL dump still permits cached-complete reuse.
- Different target/compiler identities are absent from the comparison's compatibility reporting.
- Changed dump bytes are compared without rejecting disagreement with recorded hashes.
- UID/pseudo-only textual changes count as the first divergent pass.

The last observation is a labeling/interpretation limitation, not evidence that pseudo identities should be erased. Pseudo creation order matters in the existing DB10 allocation evidence. Cross-compiler comparison can be intentional; provenance should be explicit rather than silently treated as interchangeable.

These are exact-subject JavaScript input/cache/comparison tests with mocked compiler, authentication and repository context. They are not KMC or full-CLI integration tests. In particular, they do not establish that real cc1 accepts an unexpanded header fixture. Local results are preserved in `build/probe-audit-intake-20260908/results.json`.

The [CLI](../../../tools/match.js) probe branch supplies authored text from explicit source, candidate record or active C. The probe's own identity lists source text, target, compiler hash/designation and requested passes, without an explicit effective-flag or authenticated preprocessing/dependency closure. Complete cache return precedes dump validation. Comparison reads present dump text without authenticating recorded hashes. These inspected paths support the bounded reproduced API findings.

## W8 applicability

Read-only inspection found R7/R8 using copied specialized trace drivers and private diagnostic linking. R7 `trace-3c00.js` authenticates expanded input and performs per-input pinned/tracer agreement. R8 `experiment.js` invokes those copied drivers and its private adapter; `focused.js` separately invokes canonical diff. These inspected paths do not call generic `runProbe`. This is bounded caller evidence, not a claim that the generic probe has never been used anywhere in project history.

The [R8 report](../../Plans/task-logs/combat-draw-wave8-r8.md) remains the latest source result: D037 branch-local completion worsened output and caused excessive late WIDTH sharing; DB10's additional-member representation produced four accessed plus four non-emitting homes at frame560, but wrong extent and nonexact bytes. Both best sources were restored. The assessment's proposal to try the D037 transfer has therefore already been executed, and the old “no fourth non-emitting home yet” context is superseded by R8. None of this accepts W8 or identifies retail's original source history.

## Recommended bounded follow-up

First, route a separate shared-tooling repair of the generic probe. Reuse existing authenticated compilation-input machinery; bind effective flags, exact expanded bytes, dependency/preprocessor identities, compiler identity/designation, requested passes and relevant implementation identity. Require valid source/assembly/expected dump artifacts before complete-cache reuse. Authenticate comparison inputs, expose intentional input/tool differences and pass coverage, and identify textual divergence explicitly. Preserve research-only output and current scratch/compilation-group exclusions. Do not change production compiler flags, ownership, layout, source-policy exceptions or acceptance gates.

Verification should independently author regression tests for these input/cache/comparison failures and run appropriate real-chain integration, including headered C and unchanged compilation-input equality. Shared tooling requires independent review under the agent guide. The structural audit applies if the actual implementation crosses an enumerated [AUDIT.md](../../AUDIT.md) boundary; do not silently expand a diagnostic repair into a production compiler/verification contract change.

Second, try a small reusable source-pair export using existing candidate storage/preservation. The inspected store has candidate source, parent and observation/metadata facilities, while current preserve exports source plus a dossier; it does not automatically export the full observation/expanded-input/replay closure. Start with a decisive R7 cursor/endpoint pair, its nearest counterexample and the R8 transfer result, rather than inventing a new database or migrating every experiment. Exact source context and remaining failures should travel with the selected effect. This recommendation remains a proposal, not an implemented capability.

Two existing-interface qualifications matter for that pilot: the inspected store dispatcher has no note-write action despite an `experiment_note` table, so observation metadata is the currently usable path; and the preserve dossier hardcodes an original-assembly-owner statement that needs qualification for already-active C targets such as W8. An import-only pilot must not accidentally trigger compilation through `watch` or misstate current ownership.

Paired reduction and broader workflow/overhead changes remain optional later experiments. The report alone supplies no measured overhead breakdown or new matching recipe. No repair, migration, reduction run or additional matching-source assignment was activated by this intake.
