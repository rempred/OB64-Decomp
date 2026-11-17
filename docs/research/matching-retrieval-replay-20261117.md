# Matching priority and research discovery correction

Joe requested correction of the November 17 onboarding/tooling findings and an
assessment of actual matching methods. This bounded pass changes discovery only.
It starts no matching assignment. Exact source, toolchain, owner, relocation and
full-ROM acceptance continue through their existing commands.

## Supported priorities

`config/matching-priorities.json` now identifies the two parallel construction
paths named by the [completed body/equipment census](../Plans/body-equipment-program.md).
The accepted current model resolves `func_002A9364` to z64 ROM
`2A9364..2A985C` (1,272 bytes) and `func_002B867C` to `2B867C..2B88C8`
(588 bytes). Neither has an active C producer. Their documented constructor inputs
make them useful future source work for actor placement and mission briefings.
These functions fall outside the completed group's ten patch sites, so this
priority claims no specific patch removal or completed visual-system census.

The ranker's useful-work category previously also required mechanical
matchability of at least 35. Large calling/FP bodies could disappear from that
filter despite a reviewed priority and no alternative consumer. Value and
matchability now remain independent. Output retains both scores, reasons and
unknown runtime reach. Priority does not activate source or establish semantics.

## Temporal held-out retrieval replay

Generator `tools/replay_knowledge_20261117.js` fixes three recent queries and uses
the parent of each solve commit as the donor/index cutoff. It reads each cutoff's
Git index blob and source/dossier availability, excludes lessons naming the
receiving target, then invokes the existing pure family selector and reproduces
the existing symptom selection. It writes
`build/research/retrieval-replay-20261117/report.json`, including complete cutoff
SHAs, index hashes, selected IDs and all available lesson descriptions.

| Receiving target | Historical cutoff | Symptom | Family suggestions | Additional symptom lessons hidden after the first three |
|---|---|---|---:|---:|
| `func_002AB810` | `8eaabdfc` | scheduling/block order | 0 | 17 |
| `func_002AAC60` | `0b972a78` | register allocation | 0 | 24 |
| `func_000c9850` | `e2086f74` | stack layout/offset family | 0 | 2 |

The first two queries return the same first three lessons despite their different
symptoms. Broad symptom overlap and JSON order determine this result. The B01
query's fourteenth lesson, `actor-real-operation-duplication`, offers an older
source pair involving duplication of actual actor operations. It is a plausible
lead for the later duplicate-initializer investigation. It does not supply the
later scope solution or demonstrate a successful transfer. B02's second compact
lesson already discusses initialization placement, so added detail alone has no
established benefit for that solve. C9850's omitted aggregate-frame example is a
counterexample, with no evidence that it would explain the final address-phase
solution. No decisive retrieval success or matching speedup is claimed.

This is a retrospective temporal holdout selected by a researcher aware of the
outcomes. Current accepted assembly metadata supplies structural representations,
and historical model equivalence was not established. The replay evaluates
discovery only. It neither authenticates historical donor source/header closures
nor compiles their transfer. Filename discovery denotes availability only.
These limits prevent treating the zero family results as a general benchmark of
all future matching work.

## Detail escape hatch

Inspection found that `--include-details` still exposed only three symptom
lessons. `knowledge.js` used the same unconditional `slice(0, 3)` for compact and
detailed results. The explicit detail request now enumerates all matching lessons
within the existing 30-lesson catalog bound and authenticates each selected
observation through the existing path. Compact output keeps its first-three
budget and lookup remains opt-in. This makes hidden lessons inspectable without
changing their ranking or claiming that catalog order predicts usefulness.

Use `match.js intake <symbol> --symptom <label> --include-details` to inspect
additional lessons. The compact result still records its omitted count.
Historical validity, source classification and applicability remain separate.

## Checks and next evidence

`tests/matching_priorities.js` verifies both real accepted target memberships and
their evidence paths, then exercises the actual ranker with deliberately hard
zero-caller bodies. Both priorities remain visible with unknown runtime reach.
An annotated target with an active source is excluded by default and included
with `includeSolved`. The test allows priority annotations to remain after
future acceptance; ordinary matching needs no priority-file curation step.
`tests/matching_knowledge_details.js` checks the compact budget, all-detail
enumeration, unchanged first-three evidence, disabled lookup behavior and actual
intake command dispatch with a five-lesson fixture.
The temporal replay runs without a compiler or verifier.

The actual `rank --lane leverage --limit 10000 --json` command dispatch also
passed with the real target model and authenticated tool/source context. A test
bootstrap redirected only `requestStore` to a newly owned SQLite file, preserving
the ordinary command and ranking behavior while avoiding the shared research
database. Output is retained as `cli-rank.json` beside the replay. Both annotated
targets surfaced despite mechanical matchability below the old threshold.

| Target | Value | Matchability | Distinct static callers |
|---|---:|---:|---:|
| `func_002A9364` | 67 | 9 | 7 |
| `func_002B867C` | 59 | 29.3 | 1 |

The invocation took 303.43 seconds. The command prepares a compiler session and
authenticates/classifies the active source context before ranking. No new object
or ROM was requested. This observed cost supports keeping ranking out of each
candidate-edit loop; it does not isolate a particular slow stage.

## Fast annotated-priority lookup

`match.js rank --priorities-only --lane leverage` now reads only configured
priorities. It shares the existing target metrics, direct caller index, scoring,
ordering and active-source filters. It skips SQLite initialization/synchronization,
candidate-history queries, family lookup and the compiler-session provenance that
would authenticate all active C inputs. `--include-solved` includes annotations
with active sources, and `--explain <symbol>` retains the coverage label.
The result identifies its limited basis and marks candidate history/family
evidence omitted and current source classification/acceptance unevaluated.

The actual unwrapped pinned-runtime command, including process startup, completed
in 11.43 seconds and returned the two annotated targets with the same static
scores/caller counts shown above. Output is `cli-priorities.json` beside the
replay. These are single observations of different documented scopes. The full
sample used an empty isolated history store, so identical scores establish only
that common static case. Existing full ranking retains its history and family
contributions, which can change scores when available.

Regression tests exercise the real command dispatcher and reject SQLite access,
synchronization or compiler-session preparation on the fast path. They also
check active/default and include-solved visibility, exclusion of an unannotated
target, preservation of explanation coverage and rejection of this flag on
another command. Full ranking continues through its original evidence path.

The existing knowledge suite passed all 26 checks. A real pinned-runtime
`match.js intake func_002A9364 --symptom register-allocation --include-details --json`
completed in 6.84 seconds, returning all 27 applicable lessons and zero omitted.
Its output is retained beside the replay as `cli-details.json`. An earlier run
correctly rejected a concurrent edit to selected `wave_accounting.js`; after that
writer froze its files, fresh live research inputs passed without a pin override.
The changed discovery files are absent from the canonical baseline/CURRENT
implementation hash lists and production configuration pins. No canonical
acceptance build was needed for this discovery-only change.

The next retrieval experiment should freeze the worker's current mismatch and
candidate context before selecting suggestions, then record which proposed
experiment changes and what its compiled result shows. Evaluate a context-aware
selector against the existing order on held-out problems before changing defaults.
More lesson retrieval can increase reading and authentication work. Its success
criterion is a better next experiment with measured total time, rather than the
number of suggestions returned.
