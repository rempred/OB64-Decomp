# Compilation-group design review

**Verdict: Revision required.** Completed. The producer and owner separation is sound, but the raw allocation gate conflicts with the required pinned-assembler producer. This conflict prevents use of the frozen proposal as an implementation dependency. The Director must route one bounded design correction and proportional independent re-review.

## Frozen subject and eligibility

- Assignment: `/root/compilation_groups_review`, revision 1.
- Launch: `COMPILATION-GROUPS-DESIGN-REVIEW-20260906-01`.
- Director: `/root`, native task `01a07262-aeca-7341-ad10-2dba705ff988`, local.
- Frozen result: `5dad70919ff43bc988cdbff9003be91347153a75`.
- Proposal: `docs/Plans/compilation-groups-design.md`.
- Producer report: `docs/Plans/task-logs/compilation-groups-design-r1.md`.

The proposal's worktree SHA-256 is `BE38B960535FA8EAA710358168F6281FDC2AB0263D0B6661368EE2B42A96B379`. The LF-normalized Git blob SHA-256 is `63F69EE7B77E43DF23B23432C6B77E9960AC61293CB7F994FB25C59C739DC47C`.

Production code, configuration, and tests are unchanged from `46d78ded786669e306bc3ca80c6f2d9e752a81a5` through the frozen result. Later checkout changes do not touch those surfaces.

The worker reported completed and released all writes. The reviewer did not produce the result. The assigned claim and report were absent at activation. The recorded concurrent work owns disjoint documentation paths.

## Claims reviewed

The review covered these material claims:

1. A compilation producer can remain separate from each function target and accepted structural owner.
2. One native `.text` section can project into existing owner sections without changing load semantics.
3. Group membership can remain contiguous, indivisible, and incompatible with legacy representation modes.
4. Strict proof can preserve bytes, symbols, relocations, alignment, ownership, placement, and complete-ROM gates.
5. Classification, cache, diagnostic, manifest, layout, and status consumers can use producer records and member views.
6. Required fixtures and negative controls bound the proposed first implementation.

The review did not treat the pose experiment as production evidence or original compilation-unit proof.

## Review method

I inspected the frozen proposal and producer report directly from the frozen commit. I inspected the current implementation at the unchanged production identity.

The main inspected modules were:

- `tools/lib/active_targets.js`;
- `tools/lib/elf_text_split.js`;
- `tools/lib/text_contract.js`;
- `tools/lib/phase8_matching_c.js`;
- `tools/lib/current_workflow.js`;
- `tools/lib/diff_object_cache.js`;
- `tools/lib/matching/compiler.js`;
- source-policy, status, audit, reproducibility, and shared-header consumers; and
- `tests/multi_owner_text.js` and `tests/native_text_tail.js`.

I verified the designated research report at SHA-256 `C1198AD8810DBBF437EF80114AEBB01E3748C3E011547EF26A2EA4A1776DE16F`. I then recomputed its central shape from the preserved local artifacts.

No compiler, build, verifier, audit, emulator, branch, worktree, agent, commit, or push ran. No reviewed file was modified.

## Finding CGDR-001

**Finding ID:** `CGDR-001`

**Finding:** The raw group allocation rule omits the required GNU 2.6 `.reginfo` allowance.

**Failed assigned claim or gate:** The design is not yet sufficiently bounded to become an implementation dependency. Its required pose positive conflicts with its raw-object rejection rule.

**Frozen subject:** `5dad70919ff43bc988cdbff9003be91347153a75`, `docs/Plans/compilation-groups-design.md`.

**Direct observation:** The proposal requires raw-object validation before projection or ancillary stripping. It then states that extra allocated sections reject.

The preserved native object contains one nonempty allocated `.reginfo` section. Its type is `0x70000006`, flags are `2`, size is `24`, and alignment is `4`.

The current native check explicitly permits that section before stripping. The current compile path also includes `.reginfo` in its accepted raw allocation set.

The compile path removes `.reginfo` only after source-object checks. The proposal does not state whether `.reginfo` is excluded from the term `extra`.

The proposal preserves the art-native mode, but that compatibility statement does not define the new group's raw allocation boundary.

**Reachable producer path:** Compile the required pose group through the authenticated KMC compiler and pinned GNU 2.6 assembler. This ordinary path produced the inspected raw object.

**Material consequence:** A literal implementation rejects the required positive before projection. An inferred exception creates an unreviewed allocation boundary in a fail-closed structural verifier.

**Supporting evidence:**

- `C:/Users/Joe/.codex/ob64-pose-split-research-20260906-r1/group.native.object.json`;
- `C:/Users/Joe/.codex/ob64-pose-split-research-20260906-r1/group.native.o`;
- `tools/lib/text_contract.js`, `nativeObjectAllocationEvidence`;
- `tools/lib/phase8_matching_c.js`, the raw allocation set and ancillary-removal sequence; and
- proposal raw-object rules and required pose positive.

**Smallest correction boundary:** Define the exact raw `.reginfo` policy for group producers. The correction must specify its admitted shape, uniqueness, evidence, and removal point.

The corrected design must reject every other uncontracted allocated section. It must also prove that removing admitted ancillary metadata leaves projected bytes, symbols, and load relocations unchanged.

This correction changes an evidence boundary. It cannot use the `Accepted with corrections` route.

### Admissibility record

1. The test targets the assigned soundness and boundedness claim.
2. The supported producer is the pinned production assembler.
3. The ordinary sequence is the proposal's required native group compilation.
4. Failure either blocks the required positive or leaves an unspecified accepted section.
5. Inspecting the raw producer census is the smallest useful falsifier.
6. The test uses direct artifact and current-code evidence within the proposal's stated grade.
7. The test uses an ordinary accepted build input, without hostile mutation.

This is an acceptance finding.

## Tests and results

| Check | Direct result | Judgment |
|---|---|---|
| Frozen identity | Worktree and Git-normalized proposal hashes match their stated identities. | Pass |
| Production preservation | No production, configuration, or test path changed through the reviewed result. | Pass |
| Isolated native shape | Native output is 832 bytes and equals the retail interval. Ordinary section assignment preserves only the first 824 bytes. | Pass within inherited research grade |
| Function census | Offsets are `0`, `68`, `76`, `84`, and `460`; sizes cover 824 bytes without an internal gap. | Pass |
| Tail derivation | `alignUp(824, 16) - 824` is eight. The eight terminal bytes are zero. | Pass |
| Placement context | All five owners are contiguous and use one ROM-to-RAM translation delta. The group start is 16-byte aligned. | Pass |
| Relocation boundary | The raw object has 17 load relocations. The largest place is `0x2EC`; no relocation overlaps the tail. | Pass |
| Projection semantics | Rebased relocation places preserve absolute places. The first-section anchor preserves group-relative section addends. | Sound by ELF semantics and existing splitter precedent |
| Alignment projection | `gcd(16, offset)` gives `16, 4, 4, 4, 4` for the five owner starts. Exact link equations detect inserted fill or movement. | Sound |
| Producer and member separation | One physical object can supply exact-path owner sections while member results remain individual targets. | Sound, with schema implementation pending |
| Legacy compatibility | The proposed separate mode retains the art-native, local-function, and continuation contracts without widening their guards. | Sound |
| Raw allocated census | The required raw object contains allocated `.reginfo`, while the group rule does not admit it. | Fail: `CGDR-001` |

The existing splitter already preserves section-symbol anchoring, named-symbol absolute values, relocation information words, and owner-relative relocation places. Its current alignment guard correctly remains unchanged.

The proposed group mode uses a separate alignment rule. The required split-versus-unsplit fixtures can falsify mistakes without weakening the existing splitter.

## Reused frozen evidence

The review reused these frozen artifacts after checking their identities and recomputing their central relationships:

- the designated pose research report;
- `corrected-results.json`;
- `supplement.json`;
- `group.native.object.json`;
- `group.native.corrected.bin`; and
- `group.ordinary.corrected.bin`.

The existing multi-owner and native-tail tests supplied implementation precedent. They were inspected but not rerun because the reviewed result changed no implementation input.

## Evidence limits and remaining risks

The native pose evidence remains isolated feasibility evidence. It does not prove an original source file, production `PURE_C`, production ownership, or complete-ROM acceptance.

No projected public-function group exists yet. The relocation anchor, derived alignment, producer cache, and member proof remain future implementation claims.

The proposal's required fixtures adequately target those risks. They include independent placements, carry-sensitive relocations, zero-tail coverage, stale records, mixed generations, and legacy controls.

The defined-symbol census needs explicit implementation treatment for compiler markers and aliases. The proposal's complete census and alias rejection requirements bound that work sufficiently.

The concrete module list is an implementation map, not an exhaustive caller list. Implementation must update every schema consumer found by repository-wide reference search.

## Documentation consequences and route

No canonical source-policy, workflow, or audit change is accepted from this review. Ordinary matching waves gain no independent review gate.

The Director must not use `5dad70919ff43bc988cdbff9003be91347153a75` as the implementation dependency.

The Director must route a correction worker for `CGDR-001`. The worker must preserve the frozen predecessor and change only the raw group allocation contract and affected required evidence.

The Director must then freeze the corrected result and route proportional independent re-review. The re-review must rerun `CGDR-001` and check any causally affected allocation tests.

After acceptance, the Director may route tooling implementation. That later result still requires its changed-input structural audit and independent review.

Production group activation remains separate. A later source wave must pass the complete normal verifier for all assigned members.

All reviewer writes are released with terminal handoff.
