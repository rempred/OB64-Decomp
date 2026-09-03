# High Attack Battle Stream Wave 1 Structural Correction Re-review Task Log

## Assignment

- Assignment: `ob64-high-attack-wave1-structural-correction-rereview-20260902`
- Revision: `1`
- Launch ID: `HABSW1-SRR-20260902-01`
- Role: independent reviewer
- Review level: Critical
- Receiving task: `01a063b3-508e-7a11-8852-27196080c7d1`
- Director task: `01a04998-5492-7e62-aba5-9901250a123e` on host `local`
- Correction worker task: `01a06309-6831-7e02-88e2-b0cd2be57b86`
- Frozen corrected subject: `67feba18102c6c8e11d6078016bd7f14c62e135d`
- Correction base: `bbec5a2b426330b094c07d18ab5b35446564e712`
- Original audited subject: `7c8ff722b290e4a754effb969d7931aaa0d2d3cb`
- Prior finding: `HABSW1-SR-F01`

## Protocol and workspace ownership

Initial read-only checks confirmed:

- the worktree was on `codex/high-attack-wave-1-structural-audit` at exact `HEAD` `67feba18102c6c8e11d6078016bd7f14c62e135d`;
- tracked and untracked status was clean;
- the assigned claim, task log, and report did not exist;
- the worktree registry resolved the assigned physical path and branch; and
- no other task or process was active in the assigned worktree.

The complete claim payload was constructed before opening the file and created atomically with `.NET FileMode.CreateNew` at:

`docs/Plans/task-logs/ob64-high-attack-wave1-structural-correction-rereview-20260902-r1-HABSW1-SRR-20260902-01.claim.json`

The read-back SHA-256 is `64805C1CC3051B42F1E562795E835521654E77284B4928850CE12B5E5692FF50`. Every later runtime/write boundary retained that hash and the frozen `HEAD`. The claim was never edited, replaced, renamed, or retargeted.

After the heavyweight audit, the same identity checks passed. The only non-ignored item then present was the reviewer claim, and no competing actor was active.

## Bounded reading and lineage

Read:

- the complete frozen diff `bbec5a2b426330b094c07d18ab5b35446564e712..67feba18102c6c8e11d6078016bd7f14c62e135d`;
- the original independent review and `HABSW1-SR-F01`;
- the correction report;
- the attribution and whitespace lifecycle addenda, claims, and task logs; and
- only the implementation and tests needed to trace the corrected resolver, layout, map, ELF, fallback, and verification paths.

The correction commit's parent is exactly the comparison base. `git diff --check` passed. The frozen delta did not alter assembly, active target configuration, matching-C linkage configuration, source classifications, or the accepted structural model. The original correction claim's wrong receiving-task attribution remains immutable; the addendum and separately claimed attribution record preserve and correct the lineage without technical drift.

## Causal review map

- Prior finding `HABSW1-SR-F01`: **Run again**.
- Four earlier structural evidence conclusions: **Keep** because the correction cannot affect their inputs or meaning.
- Positive split-row resolver/build path: **Run again** because both named implementation files changed.
- Exact current baseline and unrelated Phase 7/8 protections: **Run again** because shared Phase 8 logic changed.
- Detailed mixed-layout structural consistency: **Add** because the correction introduced per-slice layout records and a claimed external verifier for them.

## Direct positive observations

The corrected resolver produces one 140-byte owner for `.ob64.r4033.s0` with logical extent `0..140`. The real split-row fixture compiled exact `PURE_C`, pruned only `.s0` from the retained chunk, linked `.s0` solely from the C object and `.s1` solely from the assembly object, and rebuilt the canonical ROM.

Independent census of the fixture output found:

- C object `.s0`: 140 bytes, flags `6`, SHA-256 `58A0D8F0D763A659AC0E489FC9F6F117B2C628496F07F7E42F37304B59EAB19C`;
- pruned assembly `.s1`: eight bytes, flags `2`, SHA-256 `AF5570F5A1810B7AF78CAF4BC70A660F0DF51E42BAF91D4DE5B2328DE0E83DFC`;
- linked `.s0`: VRAM `0x801D960C`, 140 bytes, executable load;
- linked `.s1`: VRAM `0x801D9698`, eight bytes, read-only non-executable load;
- unique map owners: `objects/c/func_0021C8DC.o` for `.s0` and `objects/assembly/chunk_033.o` for `.s1`; and
- exact 41,943,040-byte ROM SHA-256 `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

The positive census is preserved in ignored reviewer evidence at `build/reviewer/HABSW1-SRR-20260902-01/positive_census.json`.

## Adversarial result

Static inspection showed that `verifyPhase8Layout` checks ownership decoration for the matching-C slice but omits its execution, ROM/VRAM, placement, slab/overlay, and range fields. Its retained-slice branch checks execution and bounds but omits placement/slab/range provenance.

The reviewer harness mutated one existing layout field at a time on a reviewer-owned copy. It produced:

- rejected controls: matching logical offset, retained execution, and retained ROM start;
- accepted contradictions on `.s0`: false execution, shifted ROM start, shifted VRAM start, false placement kind, false slab ID, and false non-executable range ID; and
- accepted contradictions on `.s1`: false placement kind, false slab ID, and false non-executable range ID.

This is an admissible generator-defect acceptance test. `writeLayout` is the ordinary producer, `verifyPhase8Output` calls the tested verifier, and the one-field mutation stays inside the assigned static structural threat model. It is the smallest falsifier for the explicit requirement that execution, placement, and provenance mutations of either slice fail closed.

Evidence:

- `build/reviewer/HABSW1-SRR-20260902-01/layout_mutations.js`, SHA-256 `3D8534B9024A16E78158E6B1590D6F2ABE702220FDD78CE9D5D295B3A204AB0C`;
- `build/reviewer/HABSW1-SRR-20260902-01/layout_mutation_results.json`, SHA-256 `701878C282AA67817DC3F6A22BFDCF62A6A57A5B82952F2F062BD9F8F2488D4B`.

## Verification record

| Command/check | Result |
| --- | --- |
| `node tests/active_targets.js` | Pass; 500 targets |
| `node tests/split_row_phase8.js` | Pass; exact split-row fixture and eight covered rejections |
| `node tests/phase7_conventional_build.js --output C:\Users\Joe\.codex\ob64-high-attack-wave-1-structural-audit\work\baseline\d2702dd336536d344b5b3d94\phase7` | Pass |
| `node tests/phase8_matching_c.js --output C:\Users\Joe\.codex\ob64-high-attack-wave-1-structural-audit\work\current\5f88b366f2c4e722a3b44a17\build` | Pass |
| `node tests/multi_owner_phase8.js` | Pass; exact ROM |
| `node tools/audit.js` | Pass; structural protections and CURRENT exact ROM |
| Reviewer mixed-layout mutations | Fail acceptance; nine false records accepted |
| Direct object/map/ELF/ROM census | Pass for valid fixture |
| `git diff --check bbec5a2b..67feba18` | Pass |

Fresh audit report: `build/audit/report.json`, SHA-256 `71C60230508E302A49661EBA47FB695B424347D8B6991EF31F03AC6CB109B0E1`. It completed at `2026-09-02T22:38:55.065Z` with 500 proof targets, 439 `PURE_C`, 61 `HYBRID_C`, zero `UNKNOWN`, zero compiler-assembly rewrites, three auxiliary sections, and exact canonical ROM.

## Judgment and route

`HABSW1-SR-F01` remains open in narrowed form. The positive ownership path is fixed and no unrelated regression was found, but the assigned external-layout fail-closed proof is materially incomplete. The smallest correction is to compare each mixed-row layout slice's complete existing structural projection against the accepted row and add focused one-field negatives. No writer/model, assembly, source-class, semantic, candidate-activation, or linkage change is needed.

Verdict: **Revision required**.

Required route: the Director must withhold integration and the six-function release, assign the bounded verifier/test correction, freeze it, and request proportional independent re-review. Reviewer-owned tracked artifacts remain uncommitted; no push or implementation edit was made.

## Director handoff transport

The exact terminal packet was submitted to Director task `01a04998-5492-7e62-aba5-9901250a123e` on host `local`. The send returned the target task ID, but the required exact read showed only a newly active Director turn with an empty item list, so the packet text could not be confirmed. In accordance with `Reviewer-workflow.md`, the identical packet was retried once and the exact read was repeated. The second send also returned the target task ID, but the packet remained absent from the readable items. No further retry was made.

Transport delivery is therefore unconfirmed. This does not change the completed technical status or the **Revision required** verdict, and the final response must disclose the transport failure.
