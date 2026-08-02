# Wave 5 independent-review task log

## Status

Status: completed. Verdict: Accepted.

The review independently reproduced the frozen target and preservation gates. This matters because the Director can intake the result without a correction route. No action is required from Joe.

## Assignment and eligibility

| Sequence | Observation | Evidence |
|---:|---|---|
| 1 | Read parent rules, reviewer workflow, assignment, nested decomp rules, local workflow, and toolchain. | AGENTS.md; docs/Reviewer-workflow.md; assignment prompt; OB64 Decomp/AGENTS.md; docs/WORKFLOW.md; docs/TOOLCHAIN.md |
| 2 | Confirmed the prompt status is ready and the role is reviewer. | docs/Plans/prompts/ob64-decomp-matching-c-high-value-function-wave5-independent-review-20260802-r1-prompt.md |
| 3 | Confirmed canonical decomp HEAD is the frozen commit on main. | Git HEAD 470d7c4f9686e73f728d23862601c9d97a9110b2 |
| 4 | Confirmed the worker AAR and evidence index exist. | Worker evidence paths in the assignment |
| 5 | Confirmed the review directory was absent and the scoped index was clean. | Reviewer-owned review surface |
| 6 | Confirmed parent and integration identities without changing either repository. | Parent HEAD 5a81440061738e89137180872e8ad03f531870e4; integration HEAD b22815518f060425519c08df19b617af8b5099a7 |

The parent HEAD differs from the worker's recorded baseline. The parent remained read-only, and the difference did not enter the fresh build inputs.

## Independent checks

| Sequence | Check | Result |
|---:|---|---|
| 7 | Inspected the frozen commit file list and source/config diff. | Exactly eight declared files; no generated binary artifact |
| 8 | Recomputed source, assembly, matching-C configuration, overlay configuration, and context hashes. | All recorded identities matched |
| 9 | Parsed the original assembly owner. | 289 words; 1,156 bytes; one final jr $ra; correct delay slot |
| 10 | Compared the assembly words with the fresh canonical z64 ROM slice. | Zero mismatches |
| 11 | Recomputed descriptor-12 containment and mapping deltas. | ROM and runtime deltas both 0xC4D0 |
| 12 | Inspected the context boundary record. | One function; no secondary entries; indirect-jump hazard recorded |
| 13 | Verified accepted compiler, Splat, and asm-differ prerequisites. | Compiler hash and asm-differ commit matched; required paths existed |
| 14 | Built Phase 8 in the fresh reviewer-owned root. | PASS; full-ROM SHA-256 571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A |
| 15 | Ran the Phase 8 verifier in the fresh reviewer-owned root. | PASS; all six owners exact; preservation exact |
| 16 | Compared the fresh reviewer build with worker build A. | PASS; path-independent identities |

## Commands

The independent build command was:

    node tools/build_phase8_matching_c.js --output "C:\Users\Joe\.codex\ob64-matching-c-wave5-review-20260802\phase8-review" --phase7-output "C:\Users\Joe\.codex\ob64-phase8-matching-c-20260801\run-a\conventional" --compiler "C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe" --splat-python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --splat-split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ"

The verifier command was:

    node tools/verify_phase8_matching_c.js --output "C:\Users\Joe\.codex\ob64-matching-c-wave5-review-20260802\phase8-review" --compiler "C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe" --splat-python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --splat-split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ" --report "C:\Users\Joe\.codex\ob64-matching-c-wave5-review-20260802\phase8-review\verification.json"

The reproducibility command was:

    node tools/compare_phase8_reproducibility.js --left "C:\Users\Joe\.codex\ob64-matching-c-wave5-review-20260802\phase8-review" --right "C:\Users\Joe\.codex\ob64-matching-c-wave5-20260802-a\phase8-final-a" --report "C:\Users\Joe\.codex\ob64-matching-c-wave5-review-20260802\phase8-review\reproducibility-vs-worker-a.json"

## Reviewer-owned writes

The reviewer wrote only these records:

- docs/matching-c/high-value-wave5-20260802-independent-review/task-log.md
- docs/matching-c/high-value-wave5-20260802-independent-review/evidence-index.md
- docs/matching-c/high-value-wave5-20260802-independent-review/aar/20260802-ob64-matching-c-high-value-wave5-independent-review.md

Generated outputs remain outside Git under C:\Users\Joe\.codex\ob64-matching-c-wave5-review-20260802\.

## Terminal state

Terminal status: completed.

The frozen result remains unchanged. Reviewer records remain uncommitted and unstaged. The reviewer issued no correction and no acceptance mutation.
