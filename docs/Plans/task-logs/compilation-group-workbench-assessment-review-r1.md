# Independent Material review: compilation-group workbench assessment

**Verdict: Accepted with corrections.** The assessment identifies the current failures correctly and proposes a sound generic consumer correction. Director `/root` may route a separate implementation after adding the three bounded corrections below. This verdict accepts the design direction only. It does not accept unwritten code, clear the four failures, change shared tools, or accept W8.

Reviewer `/root/db10_trace_review`; Director `/root`; launch `COMPILATION-GROUP-WORKBENCH-ASSESSMENT-REVIEW-20260908-01`; review activation release `65f368ba9a96a63a6b6924d6203a5f4e01872c4a`; frozen assessment `71ed03c71261927a1ca11ed347f0245dac9abb7f`.

## Frozen subject and eligibility

The assessment report hashes to `30569B194CF07CC78967E00B8AC0D2992B27C97D1E1627D6233F2C2D276760FC`. Its evidence manifest hashes to `8CDC903BDFD7DA400060E84BCCED374D15499FEC1E3FFD9E0F1FC7D979F1BEA1`.

Both manifest entries match their byte counts and SHA256 values. All 30 assessed input identities also match. They include the relevant models, readers, consumers, tests, design records, source, and retained failure evidence.

The worker completed the read-only assessment and released its writes. The review claim was created atomically before review-root writes. Its task, launch, reviewer, host, and revision values match the activation.

## Claims reviewed

The assessment classifies two failures as stale test assertions. It classifies the other two as one shared workbench-reader defect.

It recommends joining workbench targets to the strict active producer model by normalized symbol. Standalone targets retain their source. Group members expose the shared source and complete producer membership without claiming independent source ownership.

The proposal separates activity from scratch-compilation capability. Group members remain visible for inspection and research metadata. Candidate generation, compilation, probes, and automatic sweeps remain unsupported until complete-group candidates exist.

It also keeps live producer state outside immutable target identity. Existing canonical producer, projection, ownership, source-policy, and verification contracts remain unchanged.

## Independent observations

The current `loadWorkbenchModel({requireBaserom:false})` fails with `active matching target record is malformed or duplicated`. The reader validates every authored active record before building any target. One valid group therefore blocks unrelated standalone inspection.

The strict active model loads successfully. It resolves one `combat_pose_metadata` producer and five ordered members. All members use `src/lib/combat_pose_metadata.c` and `objects/c/groups/combat_pose_metadata.o`.

The members retain distinct owner rows, sections, extents, and relocation views. Their byte extents are 68, 8, 8, 376, and 372. Their relocation counts are 2, 0, 0, 8, and 7.

I simulated only the proposed consumer join by resolving authored group entries to their strict shared source. The mixed model then loaded. All five group members remained visible, and the unrelated `func_0020BFF8` source remained unchanged.

This simulation did not implement the proposal. It tested whether the existing structural target model can carry the strict producer view without changing accepted target structure.

## Failure classification

The two stale-test classifications are correct.

`tests/active_targets.js` allows only canonical or legacy relocation provenance. The strict model now produces validated `compilation-group` provenance for legitimate group members.

`tests/compilation_groups.js` requires an empty production group registry. Its synthetic fixtures do not depend on that permanent condition.

The other two failures share the reader cause. `target_model.js` requires every authored entry to contain `source`, while group entries contain `symbol` and `compilationGroup`. The matching-context and matching-workbench suites stop at that check.

The assessment correctly rejects filtering out group members. The accepted design keeps every function owner visible and keeps the producer separate.

## Selection, identity, and rejection boundaries

The current default sweep omits active group members because it tests `activeMatchingSource`. The `includeSolved` mode admits them. The fixed smallest-leaves set also admits the two eight-byte group members.

`publicTarget` reports those members as `ordinaryMatchingEligible` because that field only represents prefix position. The assessment correctly requires a separate scratch capability and reason.

The final `bindWorkbenchTarget` guard rejects both a directly marked group target and a target found through the active session. It emits the required complete-group diagnostic.

`compileCandidate` records a database candidate and source snapshot before reaching that guard. `prepareAndCompile` launches m2c before any grouped-candidate admission. The assessment correctly requires an earlier check while retaining the final session guard.

Adding live producer fields naively would place them in `targetRecord.metadata`. The assessment correctly requires their exclusion from stored structural identity. Registry changes may refresh live views without changing retail target identity.

## Required bounded corrections

### CGWA-C01: keep new fixture output out of frozen evidence

`tests/compilation_groups.js` writes generated fixtures beneath `build/compilation-groups-implementation-r1/`. That root belongs to the completed frozen implementation.

The current stale assertion stops before the write. Removing the assertion makes the next routine run append a new `focused-*` directory there.

The implementation must redirect this test to its new assigned evidence root or a generic isolated test root. It must not reuse the frozen implementation root for writes.

This is a non-semantic coordination correction. It changes no group contract or test meaning.

### CGWA-C02: include compiler probes in early admission

`tools/lib/matching/probe.js` is a supported workbench compiler path. It writes a source file and launches a compiler without calling `bindWorkbenchTarget`.

The assessment already requires every explicit grouped candidate request to reject before a compiler launch. The implementation scope must apply that rule to `probe` as well.

The preferred boundary is a shared scratch-capability assertion used inside each side-effecting library path. A CLI-only check is insufficient for direct module callers.

This correction preserves the assessment’s stated behavior. It names one otherwise easy-to-miss consumer.

### CGWA-C03: run the existing workbench integration suite

`tests/matching_workbench_integration.js` directly loads the target model and exercises `prepareAndCompile`, `compileCandidate`, source identity, caching, and real KMC/GNU output. `tests/README.md` identifies it as the real-chain integration fixture.

This suite is not part of `tools/test.js`. Running only the four failed suites and the routine manifest would omit it.

The implementation must run this integration suite after the reader and admission changes. Its normal standalone target must retain existing behavior.

This is a bounded verification correction. It adds no full-ROM or structural-audit requirement.

## Accepted implementation contract

The implementation can consume the existing strict active-model result. It must not add a weaker group-registry parser.

Each grouped workbench view must expose the shared source, producer identity, complete ordered members, and selected member index. Its retail bytes and target identity must still describe one accepted owner.

Inspection, context, history, and explicit active ranking can show grouped members. Automatic compile sweeps must exclude them with a visible reason.

Explicit prepare, watch, probe, and equivalent candidate requests must reject before generation, compiler launch, candidate storage, or source snapshots. The final session guard must remain independent.

Stored target records must omit live activity, producer, and scratch-capability fields. Producer summaries require their own input identity if cached.

The active-target test must admit group provenance only with positive strict-binding checks. The group fixture must authenticate live configuration before and after its isolated fixtures.

The implementation must preserve missing, partial, reordered, duplicate, mixed-source, and unsupported group rejection. Empty-registry, standalone, continuation, native-tail, and existing scratch paths must retain their behavior.

## Scope and route

The assessment’s proposed reader and consumer changes do not alter structural ownership or matching acceptance. Material review plus focused, routine, and existing workbench-integration evidence is proportionate.

A changed-input structural audit becomes necessary only if implementation changes group admission, projection, source coverage, build ownership, compiler behavior, or verification. It is not required for the accepted reader, selection, rejection, and test correction alone.

The Director may route one separate bounded implementation with exclusive shared-tool ownership. Its prompt must include `CGWA-C01` through `CGWA-C03`. The completed implementation requires independent Material review.

No complete-group scratch compiler is accepted or proposed. Canonical whole-group diff remains the supported source path. The ordinary W8 wave retains its final complete-wave verifier.

All review writes are confined to the claim, this report, and `build/compilation-group-workbench-assessment-review-r1/`. No production source, configuration, shared tool, test, compiler, build, verifier, audit, runtime, database, or Git state changed. All review writes and processes are released to Director `/root`.
