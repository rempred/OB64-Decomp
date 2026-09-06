# Compilation-group design task report

Completed. The proposal separates compilation producers from function owners and recommends lossless native object projection. The Director must intake and independently review the design before implementation. No production configuration or tooling changed.

## Assignment and baseline

- Task: `/root/compilation_groups_design`, revision 1.
- Launch: `COMPILATION-GROUPS-DESIGN-20260906-01`.
- Director: `/root`, native task `01a07262-aeca-7341-ad10-2dba705ff988`, local.
- Starting main HEAD: `46d78ded786669e306bc3ca80c6f2d9e752a81a5`.
- Current main HEAD: `e03ad2261292358906351e4a3d8e737b0b4e0e08`.
- The later commit is Director coordination activity. `git diff --name-only 46d78de HEAD -- tools config tests` returned no changes.
- Initial inventory showed the disjoint process worker's claim. Git status warned about inaccessible global-ignore and cache paths.
- Assigned proposal and report paths were absent before writing. The complete assigned claim was created atomically and read back first.

## Result and evidence grades

**Direct code observation:** The current multi-owner splitter preserves text bytes and remaps ELF section, symbol and relocation metadata. Its existing alignment and continuation-symbol guards exclude the native public-function group.

**Inherited isolated research:** The pose experiment reproduces five complete owners in one native 832-byte section. This report does not promote that result to production PURE_C or complete-ROM acceptance.

**Proposed design:** A separate group projection mode can preserve native bytes, all public functions and the existing output-section/PT_LOAD layout. It compiles once and produces one C object with multiple owner sections.

**Unverified implementation claim:** Native alignment projection and preserved group-base relocation anchors require new independent positive and negative controls. No historical compilation-unit claim is made.

The proposal specifies schema contents, producer/member ownership, tail provenance, relocation accounting, source classification, strict proof, caching, diagnostics and counting. It also specifies concrete module scope and acceptance cadence.

## Reconstructed activity log

1. Read the ready assignment, canonical and parent agent rules, worker workflow, source policy, normal workflow, queue and structural audit.
2. Read the sequential program and designated parent pose report. Its SHA-256 matched the controlling input.
3. Created and verified the claim before other writes. No experiments were run.
4. Inspected active-target, native-text, compiler/proof, layout/map, cache, status and diagnostic consumers.
5. Initially considered one aggregate physical output section because native input sections are indivisible to linker selectors.
6. Found and read the existing ELF splitter. Revised the recommendation to metadata projection while retaining physical owner sections.
7. Inspected the splitter's independent fixture source and the pose research JSON. Did not rerun either experiment.
8. Wrote the proposal and reviewed relocation-anchor, alignment, class inheritance and per-function count requirements.
9. Resumed the same claim after Director continuation. Production tool/config/test inputs remained unchanged from the inspected baseline.

The initial aggregate-section idea was an analysis alternative, not an attempted implementation. It would require broader section/load-census changes. The proposal retains that comparison for review.

## Evidence index

- Proposal: `docs/Plans/compilation-groups-design.md`.
- Claim: `docs/Plans/task-logs/compilation-groups-design-r1.claim.json`.
- Assignment: `docs/Plans/prompts/compilation-groups-design-r1.md`.
- Research: parent `docs/reviews/combat-pose-split-padding-research-r1/research-report.md`.
- Research SHA-256: `C1198AD8810DBBF437EF80114AEBB01E3748C3E011547EF26A2EA4A1776DE16F`.
- Local evidence: `C:/Users/Joe/.codex/ob64-pose-split-research-20260906-r1/corrected-results.json` and `supplement.json`.
- Producer and projection sources: `tools/lib/phase8_matching_c.js`, `tools/lib/elf_text_split.js`, `tools/lib/text_contract.js`.
- Contracts and consumers: the proposal's current-contract table names the remaining inspected modules and functions.
- Independent fixture precedent: `tests/multi_owner_text.js`; native rejection precedent: `tests/native_text_tail.js`.

## Verification, limits and deviations

This was read-only design analysis except the three assigned documentation/claim files. No generated analysis output was needed. No source, config, tool, test, external decomp source or source-comparison excerpt was changed or imported.

No compiler, build, verifier, structural audit, emulator, agent launch, branch, worktree, commit or push ran. Proposed test cases are explicitly future work. The design requires new unrelated pure-C group fixtures, zero-tail coverage, relocation controls and existing-mode regression coverage.

`git diff --check` reported no tracked whitespace error. Assigned files were read back and scoped status confirmed their expected untracked paths. This does not establish implementation acceptance.

The task log was written retrospectively and is labeled reconstructed. No experiment required an earlier experiment log. The research-aide index was checked after the assigned evidence inspection; no generated atlas was used or authoritative semantic claim made. Initial canonical-relative reads of parent documents failed, then succeeded at their explicit parent paths.

No write conflict or automatic approval rejection occurred. The assignment explicitly uses collaboration transport, which controls this internal-agent handoff instead of the older native-task callback procedure.

## Next action and release

The Director must freeze the proposal and route independent design review. Review must examine relocation-anchor semantics, projected alignment, preserved load mappings and producer/member count separation. Implementation requires a later ready assignment.

After tooling implementation, run one completed changed-input structural audit and independent review. A later production source wave still requires its complete-wave verifier. Tooling acceptance alone accepts no Combat member.

Proposed canonical changes are limited to documenting the reviewed producer contract in source policy, workflow and audit after implementation review. No canonical rule change is requested during this design handoff.

All assigned writes are released with terminal handoff. This report and proposal are frozen after delivery.
