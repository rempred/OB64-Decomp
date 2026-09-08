# Compilation-group workbench assessment

Completed. Two routine failures come from stale assertions; two expose one workbench reader defect. Group activation currently prevents the entire workbench from loading. The Director should route a bounded consumer/test correction after independent Material review. Complete-group scratch compilation should remain unsupported.

Worker `/root/db10_allocation_trace`, Astra Medium; Director `/root`. Activation: `daad951630e0686dc324104a4e88066b2240a41e`. The claim was created atomically and read back. Evidence root: `build/compilation-group-workbench-assessment-r1/` (R). The W8 source worker continued independently. Observed HEADs advanced through disjoint Director commits; `observations.json` binds the inspected files rather than assuming a frozen checkout.

## Evidence and controlling contract

The accepted compilation-group implementation is `45904b577d67de81acad661a0c8286e01c43ee4c`, accepted at `31dc838`. Its design distinguishes one compilation producer from individual accepted function owners. All members activate together and share one authenticated source and object. Each retains its own placement, fallback, relocation and byte checks.

`docs/Plans/compilation-groups-design.md:121` defines complete producer cache identity. Line 127 explicitly requires a group-specific workbench rejection until complete-group candidates are supported. The r2 design correction changes raw `.reginfo` handling, not that boundary. `docs/WORKFLOW.md` retains canonical whole-group diff and unsupported standalone-workbench behavior. The implementation review verifies these boundaries; its originally empty production registry was an activation condition, not a permanent runtime invariant.

Retained failure evidence is `build/analysis-packets-implementation-r1/routine-tests.log`. The accepted analysis-packet review records four failures, without treating them as passing. Its baseline index SHA256 is `72B36E63E95F9AED79FA48DFC6B607DF7EB2FF7854D36082194EE09A7754135A`. All ten named dependency/configuration hashes still agree. R/observations.json binds their current identities and the additional inspected consumers/design records.

Read-only loader calls confirmed two facts. `loadWorkbenchModel({requireBaserom:false})` throws `active matching target record is malformed or duplicated`. The unchanged strict active model successfully resolves all five pose members. They use `src/lib/combat_pose_metadata.c` and `objects/c/groups/combat_pose_metadata.o` together. Their owner rows remain 3807–3811; their individual extents are 68, 8, 8, 376 and 372 bytes. Every member reports `relocationContractSource: compilation-group`. Calling the existing text-contract binding guard produces the intended complete-group diagnostic.

No test suite, compiler, database, canonical build, verifier, audit or runtime was run. The loader/guard calls only read existing inputs. R/collect.js records exactly those calls and their identity checks.

## Failure classification

| Retained failure | Current source | Assessment |
|---|---|---|
| active-targets | `tests/active_targets.js:1046` admits only canonical/legacy relocation provenance | Stale assertion. The strict active model intentionally produces validated `compilation-group` provenance. |
| compilation-groups | `tests/compilation_groups.js:15` requires zero active production groups | Stale fixture precondition. The test creates separate fixture inputs and does not need the production registry to be empty. |
| matching-context | `tools/lib/matching/target_model.js:99` requires every authored active record to contain `source` | Product reader defect. Group records legitimately contain `symbol` and `compilationGroup` instead. |
| matching-workbench | Same reader, reached by `tests/matching_workbench.js:1244` | Same product defect, not another group compiler failure. |

The reader validates all active records before constructing any target. Consequently an unrelated standalone target cannot be inspected when one valid group exists. `tools/match.js:554` loads this model before command dispatch. The impact therefore extends beyond grouped candidate commands. Context tests stop before reaching their normal static-analysis checks; this evidence does not show their dataflow logic is wrong.

Merely relaxing line 99 is insufficient. Line 168 reads only the authored `.source`, leaving valid grouped targets with null `activeMatchingSource`. `rank.js:87–88` then treats them as inactive, including for solved-exemplar selection. `sweep.js:30` also uses that field for default filtering. The `smallest-leaves-200` selector bypasses that default filter, and `includeSolved` admits active targets. These paths need explicit scratch eligibility, not hidden group members.

## Recommended correction

Use the existing strict active-model result as the authority for active producer bindings. `active_targets.js:1334–1348` resolves the group source and rejects mixed standalone/group contracts. `compilation_groups.js:67–108` enforces complete activation, source agreement, owner/mode constraints, member order and placement. Reuse these validations; do not write a weaker parallel registry parser in the workbench.

Keep all accepted function targets in the workbench model. Join their active producer state by normalized symbol. A standalone view retains its actual standalone source. A grouped view exposes the actual shared source, producer kind/id, ordered complete member list and selected member index. Its retail bytes and target identity still describe only that accepted function owner. A group summary must not imply that the selected member independently owns the shared source.

For compatibility, `activeMatchingSource` can contain the actual shared source path. Pair it with explicit producer metadata, and use an explicit activity predicate in consumers. Do not invent per-member source paths or count the producer as another function. Active source presence remains workflow state, not proof of exact matching acceptance.

Separate inspection eligibility from scratch-compilation eligibility. Grouped members remain visible in inspect, context, history and ranking when active entries are requested. They must report that standalone candidate compilation is unsupported. Automatic compile sweeps should omit unsupported grouped candidates and explain exclusions. An explicitly requested grouped compile should return the complete-group diagnostic before generating, recording or compiling a standalone candidate.

Preserve `text_contract.js:82–85` as the final independent group rejection. It checks both target metadata and the compiler session's active model. The early consumer check improves routing; it must not replace that final check. `compiler.js:762–767` currently records a candidate before binding. Move the unsupported-group admission decision ahead of that side effect where feasible, while retaining session revalidation before compilation. Do not introduce group projection, candidate splitting, single-member overrides or new compiler behavior.

The existing `ordinaryMatchingEligible` field derives only from owner-prefix position (`target_model.js:226`). Do not silently redefine it as a guarantee of standalone scratch support. Add a specific scratch capability/reason or document a deliberate field migration. Canonical group source work remains supported through the existing whole-group diff path.

## Identity and cache consequences

Keep live producer state outside the immutable machine target record. `target_model.js:165` derives target identity from structural metadata and retail bytes. `targetRecord` explicitly excludes `activeMatchingSource`; `tests/matching_workbench.js:1284–1286` verifies that changing active source does not change that identity. Exclude new live producer/activity/capability fields consistently as well. Do not accidentally serialize them through the current metadata spread.

Read the current group registry and target configuration each time producer state is formed. If producer summaries are cached, give that cache its own complete input identity. Registry membership/order/source changes must invalidate the summary without changing the accepted retail target identity. A database schema change is unnecessary if the additional state remains live and outside stored target records. If implementation chooses persistence, specify migration and invalidation explicitly before adding it.

Workbench diagnostic comparison identity already includes `target_model.js` and `compiler.js` in `diagnostic_link.js:34–46`. Existing comparison invalidation must remain effective after a consumer change. This assessment does not recommend altering canonical CURRENT, group artifact caches or source-policy identity.

## Bounded file scope

Required implementation candidates are `tools/lib/matching/target_model.js`, its ranking/sweep consumers, and the four failing test files. Candidate admission may require small changes in `compiler.js` and `m2c.js`, or their CLI callers, to reject before side effects. `tools/match.js` may need capability/exclusion reporting. Update `docs/MATCHING_WORKBENCH.md` for the visible supported/unsupported distinction.

Prefer leaving `active_targets.js`, `compilation_groups.js`, `text_contract.js`, canonical compiler/build/verifier logic, production configuration and source unchanged. Reuse their existing APIs. If that requires extracting a shared validator, stop and declare the expanded scope first. Such extraction affects fail-closed admission and needs separate audit consideration.

For active-target tests, add the legitimate provenance alternative only with positive group binding assertions. Check the complete ordered producer membership, actual shared source and member-relative relocation evidence. Retain rejection of missing/unreviewed provenance and all existing standalone/legacy checks.

For compilation-group fixtures, replace the permanent empty-registry assumption with isolation assertions. Authenticate the production registry before and after the fixture. Keep fixture sources, group records and targets separate from live configuration. Preserve all existing native/projection/cache/relocation malformed-input controls. Do not satisfy the test by deleting, filtering or disabling the production group.

## Meaningful validation and review

The separately assigned implementation should exercise the following focused cases before the routine suite:

- A mixed standalone/group model loads; every group member remains visible with correct shared source, ordered members and selected index.
- An unrelated standalone inspect/context request works while a group is active.
- Default rank/sweep activity remains correct; explicit active listings expose groups honestly.
- Automatic sweeps, including smallest-leaves and include-solved modes, do not attempt unsupported group compilation.
- Explicit grouped candidate requests reject before compiler/decompiler launch and candidate/database writes; the final session guard also rejects independently.
- Missing, duplicate, reordered, unknown, partially active or mixed-source group records fail existing strict validators.
- Changed producer metadata refreshes live views but leaves structural target identity stable. Stored record serialization excludes workflow state.
- An empty registry and ordinary standalone/native-tail/continuation paths retain their existing behavior.
- Both corrected fixture assertions run with valid active production groups and leave source/configuration untouched.

Then run the four affected suites and the routine tooling manifest once on the completed correction. No full routine rerun is needed for this assessment. Preserve any remaining failures rather than waiving them. A complete-group scratch compiler remains a separate feature requiring its own candidate, cache, member and proof design.

For the proposed reader/selection/test-only scope, require independent Material review and focused/routine tooling evidence. It changes no structural ownership or acceptance rule, so it does not by itself justify a full-ROM structural audit. If implementation changes admission, projection, source coverage, compiler/build ownership or verification, apply `docs/AUDIT.md` and its changed-input audit requirement. Never use unfinished W8 source equality as this tooling correction's test oracle.

## Limits and release

The field names and exact factoring above are recommendations, not an implemented API. The remaining implementation question is whether live metadata can reuse the strict loader without undesirable repeated model I/O. That is a performance/design choice; it does not justify duplicating weaker validation. No other evidence gap blocks the bounded correction recommendation.

All assessment writes are confined to the fresh claim, this report and R. Other files remain read-only, including the active W8 writer's work. No processes remain live. **All assessment writes/processes are released to Director `/root`.** Independent Material review and separate implementation scheduling remain pending. R/manifest.json binds the report and static evidence.
