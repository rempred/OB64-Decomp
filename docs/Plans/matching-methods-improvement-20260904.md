# Matching methods improvement

Joe requested this implementation program after the repository and matching-method review.
Matching feedback and iteration have priority over the broader maintenance backlog.

## Delivery and validation

The first implementation wave passed independent review on 2026-09-04. The required
`node tools/test.js` manifest passed all ten suites, and a fresh `node tools/verify.js`
finished with `RESULT: EXACT BASELINE`. Source classification, ownership, placement,
relocations, target bytes and the complete ROM all passed. No active matching source,
accepted boundary or production toolchain contract changed.

The six-case diagnostic reproduction retained all six compiled runs while refreshing
comparison evidence, then reused the unchanged comparisons. The four scheduling
candidates retained their expected residuals and both exact controls reached diagnostic
exactness. The diff-cache benchmark measured approximately 111 seconds cold and
52 seconds warm, reducing compiler invocations from 526 to one. Generated evidence
remains under ignored `build/` paths; Git records the implementation.

The allocator study found no new exact PURE_C source. Its bounded results and next
discriminating experiment are recorded in the linked study below. Broader pre-existing
snapshot, filesystem and source-policy-cache hardening remains separate maintenance;
it is not an additional acceptance ritual for ordinary matching.

## First implementation wave

| Work | Owner task | Scope |
|---|---|---|
| Accurate matching diagnostics | Matching diagnostics and actionable diffs | Relocation-aware comparison, actionable first difference, candidate ranking and comparison invalidation; matching workbench regression repair |
| Routine regression baseline | Matching regression baseline and status accounting | Multi-owner status coverage, exactness-test repair, focused status tests and one routine test entry point |
| Calling-convention evidence | Matching regression baseline and status accounting | Include supported call delay-slot argument preparation in bounded context, with explicit provenance and no inferred signature |
| Faster canonical diffs | Authenticated object reuse for matching diffs | Diff-only cache for unchanged non-target objects; requested target and final verification remain freshly compiled |
| Shared compiler blocker | Allocator scheduling study and matching methods | Reproducible allocation/owner-load study, compiler-state deduplication, causal variants and family holdouts |
| Contributor path | Matching contributor onboarding and tool reference | Short README/normal workflow, linked optional workbench reference and the settled routine test command |

The diagnostic implementation owns the compiler, MIPS analysis, diagnostic-link and
score-query modules under `tools/lib/matching/`, `tools/match.js`, matching workbench
persistence, and its workbench/diagnostic tests.
The cache implementation owns `tools/diff.js` and its new helper/tests.
The regression implementation owns `tools/status.js`, `tests/diff_exactness.js`,
its new status tests and the routine test entry point. It also owns the bounded
`tools/lib/matching/context.js` correction and new `tests/matching_context.js`.
The compiler study owns its new study tools/tests and one focused methods document.
The onboarding implementation owns README, WORKFLOW and tools reference documentation.
The active queue, this plan and integration belong to the director.

All tasks use the existing checkout. They do not create branches or worktrees.
The director coordinates changes to shared files, tests that modify shared inputs,
canonical builds, independent review and commits. Workers do not stage others' files.
Ordinary Git and the task conversations remain the integration record.

## Acceptance

- Preserve raw comparison evidence and distinguish resolved diagnostics from accepted matching.
- Reproduce the four allocation-family candidates and two exact C controls through the ordinary
  diagnostic path; unresolved addresses must not become invented control-flow facts.
- Preserve real wrong-byte, wrong-symbol, wrong-addend, wrong-placement and ownership failures.
- Reject or rebuild stale/corrupt cached artifacts; never trust timestamps or stored claims alone.
- A warm diff must compile the requested target and any actually invalidated siblings, then link
  and compare freshly. Final verification must independently recompile as before.
- Test status accounting against complete accepted text ownership, including retained fragments.
- Reproduce the sixth outgoing stack slot in the `func_00215CF0` call to
  `func_00054e24` at PC `0x801D338C`; the store in its JAL delay slot is execution
  evidence, while its association with an argument remains a bounded lexical hypothesis.
- Assess compiler-study progress by distinct emitted states and falsified hypotheses. Bounded
  failure does not prove PURE_C is impossible.
- Run the consolidated routine tests and normal full-ROM verification after the combined changes.
  Obtain independent Sol Max review of diagnostic provenance, cache validation and regression
  coverage. If implementation changes structural acceptance, follow `docs/AUDIT.md` as well.

## Follow-up order

Joe authorized the remaining implementation on 2026-09-04. Astra directs this work.
The first wave is committed and pushed through `80c817e`.

| Follow-up | Owner | Current scope |
|---|---|---|
| Warm-diff profiling | Existing authenticated-object-reuse task | Post-header measurement completed at `7967afd`: three exact warm runs average 76.9 seconds versus 49.0 previously. The increase is mainly in host preparation/classification work; preprocessor child time stayed near 19 seconds. The next bounded study measures that work and tests reuse of a workspace within one classification pass after Wave 5 integration. |
| Scheduler trace and source probe | Existing allocator-study task | Six-case trace accepted at `352f5d4`. The subsequent sequential-carrier probe reproduced the same emitted state and causal signature; independent artifact checks passed, and the experiment stopped. |
| Shared-header support | Authenticated headers and shared-source pilot | Contract and four-function pilot at `4123be2`, with input confinement/source-identity and duplicate-dependency corrections at `7967afd`. All routine suites, structural audit and fresh exact-ROM verification passed. Independent structural review closed both findings with PASS; the contract is accepted. |
| Native consumables review | Rebuild Director | Phase 5B accepted at Editor `4106740` without blocking findings. The native rebuild program is paused; its clean implementation worktree is released for later coordinated work. |
| Editor startup and export structure | Astra, after matching-tool/header validation | Resume coordinated editor work, measure startup and ROM initialization, then defer justified dataset loading and extract one coherent export responsibility. |

The existing implementation owners retain technical design authority. Reviewers independently
identify defects in the assigned result; the director decides release scope. Optional hardening
and unrelated pre-existing issues remain separate follow-ups. A completed result receives a
finite review, and corrections return to its implementer.

The matching investigations may proceed beside the separate native review. Timed benchmarks
use a coordinated quiet interval. Structural build changes and editor changes wait for their
respective dependencies and explicit file ownership. No new branch or worktree is required.

The native review consumes its existing frozen decomp worktree, not decomp `main`, so it does
not block matching-tool work. High Attack Wave 5 is complete and independently reviewed through
`b8f4a5e` in its existing worktree. The bounded post-header measurement is complete and its
integration hold is released. Decomp director owns rebase onto the accepted contract, routine
tests, integration and full verification. Further performance implementation waits for that
integration to finish so shared inputs stay stable during verification.

1. Use the accepted [warm-diff profile](../matching-c/warm-diff-profile.md) to guide one justified
   optimization. First measure preparation substages and test a workspace reused within one
   sequential classification pass. Preserve fresh preprocessing, exact compiler-input bytes,
   dependency authentication and all final verification. The current data does not identify the
   particular operation causing the host-side increase or promise a saving. Do not introduce a
   competing classification/input cache as part of this bounded study.
   The accepted [scheduler trace](../matching-c/allocator-scheduler-trace.md) guided the completed
   [sequential-carrier probe](../matching-c/allocator-source-probe.md), which collapsed to the same
   baseline. Further allocator-family experiments require a new causal or semantic lead beyond a
   local carrier; no additional form or family sweep is assigned. This bounded negative result
   does not prove that a PURE_C solution is impossible.
2. Preserve the accepted authenticated preprocessing/dependency contract and four-function
   shared-interface pilot. Exact compiler-input bytes and complete local dependency identities
   now participate in classification, compilation and reuse. The identical class-record views in
   `func_00043e88`, `func_00043edc`, `func_00043f30` and `func_00043f84` share the reviewed header;
   broader header migration is unassigned. Other partial declarations must not be combined from
   superficial similarity. Preserve cautious names and exact output.
3. Coordinate with the native editor rebuild before changing overlapping editor files. Measure
   startup/download/parse cost, then implement bounded deferred dataset loading if the measurements
   support it. Preserve feature initialization, errors and export behavior.
4. Extract a small, coherent editor responsibility only after its dependencies and owning tests are
   understood. Keep the current architecture; a framework rewrite is outside this program.

The existing High Attack matching and native rebuild programs retain their own assigned source
targets. This tooling program does not take over their implementation or integration decisions.
