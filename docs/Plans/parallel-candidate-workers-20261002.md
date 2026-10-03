# Parallel candidate workers: implementation and pilot

Status: implemented, independently reviewed by GoldOx and accepted by Astra for the initial
two-worker pilot, 2026-10-03 UTC. Joe authorized implementation and rollout when ready. Sol
completed and committed his valid Combat context wave, then released shared resources for
tooling validation. The checks below passed; Astra authorizes his explicit resumption after
scoped local integration. Native checks remain serialized. No branch, worktree, monitor or
heartbeat is part of this implementation.

## Intended result and boundaries

Two workers can independently derive and test C for two dependency-ready targets in the
same assigned family/wave, without changing each other's compiler inputs or canonical
configuration. Sol owns coordinated early linked checks and sequential integration, then
runs the normal verifier once when the complete assigned wave is ready. Scratch results
remain provisional and explicitly distinguish raw-object from linked evidence.

Start with Sol plus one candidate-only helper, not a pool. Each owns one target at a time.
Sol dispatches and coordinates that internal helper so requests for shared-input quiet periods
and candidate integration stay with the production writer. Astra retains tooling approval.
Keep a coupled compilation producer, its logical bodies, table ownership and required
dependencies with one worker. Do not split a producer or redefine wave membership to
manufacture independent work. If only one eligible unfinished target remains, finish it
serially and begin the pilot at a later suitable wave.

This changes candidate development concurrency only. The canonical Rev 0 identity, pinned
compiler/assembler, PURE_C policy, placement, ownership, relocation, byte and full-ROM gates
remain unchanged. No Editor work, Linux migration, external decomp source copying, runtime
captures, automatic commits/pushes or extra acceptance categories are included.

## Why a worktree is not the first step

The useful parallel work is private candidate editing, analysis and focused checks. A full
checkout per worker is unnecessary while only Sol writes production source/configuration.
All workers read the current main checkout; candidate sources and disposable results live
in separate ignored directories. No merge or rebase is needed to deliver a candidate.

A Git worktree would isolate tracked edits but would not automatically isolate ignored
tool paths, externally configured workRoot, caches or build processes. Worktrees remain
unauthorized. Revisit them only if a future explicitly authorized design gives several
workers independent multi-file production changes. There is no proposal to share one
writable checkout among unrestricted production writers.

## Existing capabilities and the specific gap

- `tools/diff.js` reads active canonical targets; it has no private-source CLI. Its final
  `build/diff/<symbol>.json` report and CURRENT state are shared surfaces.
- `match.js watch <symbol> --source <file>` already records and compiles scratch C through
  the production compiler, source policy and authenticated diagnostic comparison. It is
  the preferred extension point, not a separate compiler pipeline or old standalone probe.
- `compiler.js` already accepts internal `matchingRoot` and `storeOptions`; compile attempts
  use distinct directories. `store.js` accepts a database path. These are not yet an
  end-to-end isolated CLI contract.
- `probe.js` currently fixes its output root and fails on an incomplete content-keyed
  directory. SQLite WAL and unique compile IDs do not prove the whole toolchain concurrency-safe.
- Scratch linked diagnostics currently require an already-active accepted C-source owner,
  an accepted relocation contract and an authenticated control object: exactly one owner
  and compiler function, without auxiliary ownership. This includes eligible HYBRID_C
  conversions, not arbitrary new ASM owners.
- Inactive ASM targets can still use scratch compilation, compiler dumps and symbolic-object
  comparison. Address-unresolved raw bytes cannot be called linked exact. The pilot may use
  genuine unfinished ASM targets with this honest limitation; Sol supplies early and final
  canonical linked checks in coordinated quiet periods. Compilation-group, logical coverage
  and auxiliary-ownership restrictions remain in force.

Before implementation, enumerate the writes made by the small command set used in the
pilot (intake, private watch, probe, observation/preservation). Trace default initialization,
subprocess working directories, shared preparation outputs and native tool side effects.
Do not build a general job scheduler or audit every unrelated repository command.

## Minimal tooling design

The existing workbench now accepts `--scratch-root build/matching/w1` or `w2` on the bounded
command set. Use short roots because the historical compiler has Windows path-length limits.

The option selects a private workbench database and every writable source snapshot,
compile, probe, diagnostic and report directory reached by the supported commands.
No silent fallback to shared output/database paths is allowed. Reuse existing schemas,
content identities and compiler functions. A worker root has one owner and one live native
command at a time; the two roots may run concurrently after validation. Reject accidental
duplicate use. Route these concrete paths, not just `compileCandidate`:

- CLI `initializeStore` and `syncTargets`, currently run even before most read-like commands;
- `watch`/`recordCandidate`/`compileCandidate` with both `matchingRoot` and `storeOptions`;
- `latestCandidateRun`, `classify`, `compare`, observation queries and candidate-backed probes;
- `probe` source snapshots, pass dumps and report cache;
- research `import` and `preserveResearch`, including their snapshot directory and DB lookups;
- `intake`, reading that root's DB plus tracked dossiers through its existing read-only path.

Reject the option on unsupported commands rather than silently ignore it. Private DBs are
the first-version decision: shared SQLite writers have WAL/timeout handling, but intake's
strict immutable read guard can reject a concurrent writer or nonempty WAL. A private DB
avoids that cross-worker interference without weakening the guard. Normal tracked dossiers
remain shared knowledge; temporary per-root history is not a replacement research system.

Repository-local regular-file and real-path checks reject escaping paths, reparse/symlink
redirection and aliasing another worker's or production output. Recheck resolved locations
before writes/cleanup. Fresh attempts write into private directories; an interrupted attempt
must never be read as a completed cache hit. Cleanup affects only that worker's disposable
files after its child processes have exited; preserve selected source and useful evidence.

Treat source location as a compiler input. The private authored file's quoted includes,
source origin, approved include roots, preprocessed bytes and full header closure must have
the same meanings as the intended production file. Do not add a loose include search path
or copy headers and silently change resolution. Extend existing origin/dependency handling
only as needed; test shadowing and reject ambiguity. First-version eligibility may exclude
unsupported source-local includes rather than weaken the contract.

Share only authenticated read-only inputs: the normalized baserom, tool binaries, structural
model, repository headers/research and existing exact CURRENT outputs. Existing preparation
that mutates a common cache must be done once by the owner before parallel checks, redirected
privately, or excluded from the pilot. No assumption that compiler binaries have no global
scratch files: overlapping-process tests must establish the configured path's behavior.

Use the existing input identities to bind each result to source/expanded bytes/dependencies,
compiler/flags, target/owner/relocation contract, comparison implementation and CURRENT
provenance. Validate before and after a check and on reuse. A changed relevant input makes
the result stale/unavailable and preserves the C for another focused check. File size/mtime
or an unchanged Git commit alone never establish validity. No new acceptance cache or
independent snapshot/lease/promotion protocol is introduced.

For the first pilot, choose targets supported by existing complete-body scratch compilation,
whose canonical placement/ownership and dependency contracts are already settled. An isolated
link need not be available for every private experiment. A generic private linked-diff path
for inactive ASM owners is deferred; do not fabricate an accepted control to enable it.
If a target needs unsupported grouped/auxiliary scratch handling or constant canonical
activation to obtain useful feedback, keep that target serial and choose a suitable pair.
Do not launch workers who must wait for Sol after every experiment.

## Ownership and operation

| Surface | Writer / rule |
| --- | --- |
| Production `src/`, shared headers, registries, build/verification outputs | Sol only |
| First private candidate, DB, artifacts and compact cursor | Sol |
| Second private candidate, DB, artifacts and compact cursor | Candidate helper only |
| Shared tools and workflow rules | Astra coordinates a safe change boundary and review |
| Shared research publication | Sol integrates selected observations with existing commands |
| Guidance | Claude answers specific blockers; no routine per-function review |

Both workers read current intake, full relevant disassembly and the accepted owner/body map,
check complete coverage early, then use hypothesis -> focused test -> evidence -> next
experiment. Preserve the best candidate through regressions. No speculative shared type or
prototype changes inside a private candidate become an accepted interface by implication.

Sol assigns two independent targets and their exact producer scopes through existing
coordination. The helper returns its best source path, existing candidate/run IDs, tested
input context, `sourceClass`, `evidenceMode`, `rawExactBytes`, `rawRelocationMaskedExact`,
actual relocation census and its expected-evidence status, coverage/extent, residual mismatch,
relevant discoveries and blockers. Report `diagnosticExactBytes` as linked evidence only
when `diagnostic.status` is available with authenticated-isolated-link mode. Otherwise retain
the unavailable reason and the existing value: symbolic definite nonmatches may report false,
whereas unresolved exactness remains null. Neither value proves an available linked comparison.
A scalar score, raw equality or masked equality cannot substitute.

The intended symbolic handback is relocation-masked text equality with all required bodies
covered and every actual relocation accounted for against available original-backed evidence.
Where an accepted relocation expectation is absent, report that explicitly; Sol's canonical
diff/review establishes the missing contract. Never manufacture equality with an unavailable
expectation. A remaining mismatch/blocker can also be handed back with the recoverable best;
it is not an exact candidate and does not shrink the wave.
Keep one short cursor per active worker within the existing cursor budget; no task ledger,
new progress count or experiment archive. Claude is consulted only for genuine blockers.
Astra decides tooling scope; approval does not replace tests or independent tooling review.

During a parallel candidate period Sol also uses private checks. Neither worker changes
canonical source, headers, config or CURRENT while a private check is in flight. Sol's
temporary activation changes `phase8.targets` even if restored exactly later; it is allowed
only inside a coordinated quiet period, never concurrently with a helper check.

Retain the existing early linked-diff rule: after a first complete candidate and coverage
check, pause new shared-input commands, drain in-flight checks, and let Sol run the ordinary
focused diff under his sole canonical ownership. Preserve its result and exactly restore any
temporary activation before private checks resume. Repeat a coordinated linked check when
evidence calls for it, including candidate readiness; it is not a full-ROM build. Authenticate
fresh input context after every such period. Workers may continue local editing/reasoning,
but shared-model intake/probes/compiles wait until the context is stable again. If the need
for these windows becomes frequent, keep that target serial or propose the generic private
linked-diff capability as a separate tooling task.

For a shared tooling/header/structural change, stop starting affected checks, let in-flight
commands finish, preserve candidates, make and validate the change, then resume. Hash-based
drift rejection remains the backstop for an unexpected edit. Reuse still-valid compile
evidence; refresh affected comparison evidence under existing rules. An unrelated accepted
wave does not require rebasing candidate text or a new full-ROM build. It may invalidate
CURRENT-dependent diagnostics, which are refreshed when needed. Never promise that a broad
existing dependency key permits narrower reuse than it actually does.

## Integration, knowledge and acceptance

Sol reads the returned source/evidence, resolves interface conflicts from project evidence,
and adopts the candidate into its real production path. Relocating source or changing a
header can change preprocessing, so run the normal focused linked diff on the integrated
inputs. A prior focused result may be reused only if those exact integration inputs still
authenticate; moving the source usually changes its context. Do not treat the scratch
worker's result as integration or matching acceptance.
This is ordinary source integration, not a new independent reviewer gate.

Publish only useful best sources, source/effect pairs and counterexamples through existing
research commands. Sol imports the returned source at its real location using the existing
identity-capture path, then preserves the selected observation; private-root routing permits
reading the helper's original evidence without copying SQLite files. Reconcile changed
source/include identities rather than transplant a private report as fresh production proof.
Preserve provenance and historical/stale labels. Verify that published discoveries are visible
in subsequent normal intake. The director maintains the existing lesson index when a reusable
lesson warrants it.

Once every member of the original complete wave is ready, Sol runs `node tools/verify.js`
once on the combined inputs, without a preceding redundant build. Confirm every assigned
target's requested source class and all canonical gates. Fix relevant failures and rerun;
do not rerun merely because a commit or handoff occurred. A blocked member does not license
silently accepting a reduced wave. Commit only scoped authorized inputs; push requires its
own authorization. Start the next pair only when dependencies and scratch eligibility allow.

## Required validation before any agent pilot

1. Path/output tests: separate and duplicate roots; Windows aliases/reparse paths; compiler
   path-length limits; no writes to canonical config, CURRENT, another root or shared cache.
2. Real serial/concurrent parity on an accepted PURE_C control and at least two recoverable
   nonmatching candidates, including a real inactive ASM target. Exercise both symbolic-object
   and available isolated-link modes, instruction/extent/register and relocation-sensitive
   failures, and masked-equal data that cannot establish linked exactness. Report source class,
   coverage, actual relocation and every named raw/diagnostic field unchanged. Include unavailable
   expected relocation evidence; a null/unknown field must not become true after routing.
3. Drift/rejection tests: source and transitive header edits (including same-size edits),
   include shadowing, tool/flags changes, stale/replaced CURRENT, ambiguous symbols, incomplete
   group/body coverage and corrupted cache/report artifacts. Retain HYBRID/UNKNOWN distinctions.
4. Failure recovery: overlapping identical requests, process cancellation/crash, partial
   reports and occupied output paths must preserve the other worker and never produce false
   exactness. Do not kill unrelated native processes to recover one worker.
5. Knowledge round trip: save a useful private observation via existing commands, confirm
   normal intake can recover its source and evidence status, and confirm stale/foreign-target
   evidence still rejects. No bulk archive of every trial.
6. Timings: repeat the same cold/warm serial and two-process workloads at least three times;
   record total elapsed work, per-worker median/range, sample counts, resource use, waiting
   and failures. Use a 25% total check-throughput improvement without doubling either worker's
   median warm latency as the initial reason to enable native concurrency. This is not an
   agent-pilot or acceptance gate. Two agents may reason/edit in parallel while native checks
   serialize. Isolation and correct failure behavior are mandatory in either mode.

Choose native concurrency only after these measurements. If the cold-run cost makes the full
timing matrix impractical, record that limit, keep native serialization and run the distinct
real parity/rejection cases; do not infer a throughput benefit from an incomplete benchmark.
For serialization or duplicate-root
exclusion, use a bounded process-owned mutex/handle around the complete check, released when
its process exits; do not build a persistent scheduler or require mail for every compile.
Do not reclaim a lock based only on PID/timestamp or kill another worker to clear it. Drain
checks before canonical diff/verification; scratch native commands remain paused throughout
the full verifier to preserve its stable inputs and resource budget. Reasoning/private edits
can continue. Test cancellation and abandoned-handle recovery before release.

Run affected routine tests and independent implementation review before release. Apply
`docs/AUDIT.md` if the implementation touches ownership/build/verification foundations or
compiler/linker contracts; a private-path wrapper alone does not justify an unrelated full
ROM rerun. Plan review is not implementation approval or proof that concurrency works.

## Rollout and maintenance

After Joe authorizes implementation, first establish the private command path and run the
bounded tests while preserving Sol's current work. Coordinate any needed native-test pause
and explicitly resume Sol afterward. Give the infrastructure experiment one working session:
if isolation requires a broad pipeline rewrite or shows no throughput gain, retain the
useful result and revise the design rather than grow a parallel framework unnoticed.

After tooling acceptance and authorization to launch parallel decomp, use the next suitable
existing wave with two independent targets. Select the helper model under current explicit
role instructions and the applicable agent guide. Run at most two decomp workers. Observe
the complete wave, including integration and final verification, using existing command
profiles/handbacks: iteration latency, duplicate effort, coordination delay, provisional
candidates delivered, how many fail their first canonical diff, integration rework and total
elapsed time. Do not claim an agent speed multiplier
from compiler timing or from an easier target. Compare against recent similar serial work
with its uncertainty; a single wave is preliminary evidence.

Stop or reduce concurrency on an isolation failure, persistent contention, no independent
work or excessive integration rework. Preserve both candidates, return to the existing
single-writer loop and repair the concrete cause. Failure of this optional pilot must not
leave Sol idle. No new monitor or heartbeat is needed.

Maintain private-command regression tests in the normal test runner. Shared-tool changes
rerun affected concurrency/drift cases; ordinary matches do not. Keep implementation help
and durable operating rules in the existing CLI/WORKFLOW/AGENTS locations when rollout is
authorized; this proposal holds the rationale and pilot outcome. Existing focused-diff
30-second and verifier 15-minute goals remain open; planning this pilot does not supersede
that queue or authorize starting deferred work.

## Review and director decision

GoldOx reviewed the complete draft and relevant code read-only in Agent Mail 740, following
request 737 and the inactive-owner addendum 738. His four must-fix findings are incorporated:
all CLI initialization/query/write paths route privately; intake reads the private DB plus
tracked records; canonical activation cannot overlap private checks; handbacks use explicit
raw/symbolic/linked fields. He recommended genuine unfinished ASM targets instead of selecting
only already-accepted C/hybrid owners for convenience.

Astra adopts symbolic-object iteration for eligible inactive ASM targets, but retains the
existing early canonical linked check in a coordinated quiet period. Missing relocation
expectations stay missing until properly established. This avoids both a new linker project
as a prerequisite and the unsupported claim that raw comparison proves a linked match.

GoldOx 741 agreed with Astra's follow-up 739 that agent concurrency and native concurrency
are separate choices. Astra keeps the measured native-concurrency decision and a transient
OS-owned serialization fallback; PID/timestamp-based stale-lock deletion is not the chosen
design. The 25% native throughput target does not block an otherwise useful agent pilot.

Astra retains private `probe` support in the bounded command set rather than requiring Sol
to mediate every compiler-dump request; those dumps directly support this program's hard
functions. No broad workbench command rewrite is authorized.

GoldOx's final correction check in mail 743 confirms all four fixes and no remaining
substantive objection to the revised plan, including private probes, coordinated early links
and the process-owned serialization fallback. Astra accepts this design for future authorized
implementation. This is plan review only: no concurrency tests, code changes, worker launch,
new policy, native build, commit or push were performed by this planning task. Sol's current
production work and verifier continued uninterrupted. The eventual implementation still needs
its own tests, independent tooling review and any applicable audit.

## Implementation and validation

Joe's subsequent implementation authorization is active. Sol acknowledged the intentional
tooling boundary in mail 749: finish the already-running complete context-wave verifier,
preserve the accepted result, then release shared resources. He has prepared 158E4/159D0 as
the first independent pair inside the original five-member Actor wave; no next-wave source
work begins before the tooling handback.

After Sol's explicit release at `5accc882`, the reviewed code was installed. The CLI routes the
bounded command set; core changes validate private source expansion and shared-input drift;
the Windows guard uses root/native mutexes and owned Job Objects. Native serialization is
scoped to this main checkout, not unrelated checkouts or ordinary build commands.

GoldOx's implementation review (750–753) closed after fixing drift rejection before failed
compile publication, removing a dead probe-root option and retaining full relocations in
detailed handbacks. The root also changed directory traversal to reject reparse directories
before entering them; eight process controls passed again. The required routine runner then
passed all 28 suites in 184.2 seconds. These initial private wrappers changed no canonical
source, linker/compiler contract or acceptance gate. The later shared preparation extension
below does require renewed CURRENT evidence because its implementation identity changed.

The first real checks passed: accepted 129268 took 180.672 seconds; shared-header 490ec took
215.889 seconds. Both retained PURE_C, raw nonexact/masked exact, and authenticated isolated-link
exact evidence, including real relocations. The control compiled in 390 ms and its two isolated
links took 94 ms total: the wall cost is outside that target compilation/linking. Fresh context
preparation still preprocessed the whole active corpus. Inactive B1F4 took 75.621 seconds and
remained symbolic-only, 3572/3588 bytes with 103 actual relocations and unavailable expectations.
Truncated FFE80 took 157.498 seconds and remained nonexact at 792/796 bytes. These are fixture
checks, not new matching acceptance. Four-smoke raw output is retained before cache changes.

GoldOx reviewed the bounded preparation extension in 755–761 with no blocking finding. Private
roots now reuse the existing CPP-byte cache for eligible siblings; requested active producers,
candidate expansion and classifications stay fresh. The cache finishes once before exposing the
context, with whole-command input checks again before result publication. Root-only guard markers
avoid separate cache populations for native/query commands, while the full process/root/native
ticket checks remain. The native wait is bounded to five minutes to accommodate first-use costs.
Private handbacks expose existing profiler timings and cache counters. All 28 routine suites passed
again in 128.0 seconds, including default-path, same-size mutation, publication and marker tests.

Because `current_workflow.js` is an authenticated CURRENT implementation input, Astra chose one
`audit.js --profile`, including the normal verifier, to establish the changed tooling baseline.
No identity was exempted and no redundant verifier was added. The audit passed at
2026-10-03T01:47:17.858Z (UTC), taking 1573.741 seconds. Report
`build/audit/report.json`, SHA `DACA948A6631BEF50EE826030221E942FBBEEFD8E542AD06A4F9C41481EE6FE9`,
binds CURRENT `D4719C7ABD5E77493B88363B4E6D57E7272CB0FEDD1CD1FB1B5FC19077584BBA` to the
canonical ROM `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`, including
fresh source proof and every current target gate. These are tooling-baseline results, not new
function matches. Bounded paired parity/probe/research checks now use two persistent roots
across both modes. Full cold-repeat benchmarking is deferred if disproportionate; native
parallelism will not be enabled on incomplete timing evidence. The final result and resumption
belong here when validated. Ignored detailed outputs are under
`build/parallel-implementation/validation/`. Sol's watcher remains running.

### Warm-cost correction before rollout

The two new cold roots passed at 240.747 and 244.522 seconds. Their first warm control passed
at 148.687 seconds with identical comparison evidence. Private context preparation fell to
9.752 seconds (712 cache hits, 18 fresh preprocesses); roughly 139 seconds remained outside
preparation. No larger timing matrix or research publication had started. This was too slow
to hand to Sol as the routine candidate path.

GoldOx confirmed that `completeCurrent` reparsed the full layout and object manifest once per
target. Astra brought forward just that bounded correction: capture/parse both files and
project manifest members once per invocation, keep existing `.find` semantics and every
per-target gate, and reauthenticate file existence, size, content and confinement at the end.
There is no persistent cache of CURRENT validity. GoldOx independently reviewed the 21-line
addition/five-line removal and adversarial fixture outcomes in mail 769, with no blocking
finding. The installed `current-metadata-reuse` test is in the required runner; all 29 suites
passed in 174.9 seconds.

This changed an authenticated verification input again, so a second audit ran after those
checks. It passed at 2026-10-03T02:36:41.953Z in 1898.239 seconds, including strict CURRENT
verification and fresh compilation. Its report SHA is
`234103491CBAD3A49631F904654634EBD06B9F3AB3630854F9E4513A55C919CC`; CURRENT fingerprint is
`7E9B2DB0C24DC145FB5C841EE360DC08A8DD69741CA8FBB5A472F20EB09C27FC`, verified at
2026-10-03T02:36:41.737Z, with the unchanged canonical ROM SHA above. Raw log, timing and
result are `build/parallel-implementation/current-reuse-audit.log`,
`build/verification-profile/audit-20261003020503796-38592.json` and
`build/parallel-implementation/current-reuse-audit-result.json`.

The first audit remains evidence for its exact earlier state; it is not relabeled as proof
of the new code. Final private validation used unchanged shared inputs while Sol remained
paused. Further performance changes wait for measurements.

GoldOx independently closed the final evidence review in mail 772 without findings. The first
post-hoist warm active control passed in 60.087 seconds, versus 148.687 before the hoist. It
reused the object but refreshed its comparison against the new authenticated CURRENT; validation
explicitly excluded the older comparison embedded in the immutable compile report. Preparation
took 19.563 seconds with 712 cache hits and 18 fresh preprocesses. The genuine inactive B1F4
nonmatch passed its evidence checks in 36.666 seconds (19.254 seconds preparation), preserving
3572/3588-byte extent, 103 actual relocations and unavailable linked/expected-relocation evidence.
These are single samples, not a throughput benchmark or achievement of the 30-second goal.

The inactive check's two new cache entries were `src/lib/func_00129268.c` (kept fresh during
control seeding) and `third_party/lha/ob64/decode_start_st0.c`. The cold seed had 712 misses,
711 publications and one write failure; the latter source had no older cached key and now
published successfully. This accounts for the observed miss without evidence of key churn.
The original write error's OS cause was not recorded and remains unknown; fresh authenticated
bytes were used when publication failed.

The initial pilot keeps native checks serialized. Bounded concurrent correctness tests do not
by themselves justify changing that default. The multi-repeat cold benchmark is deferred;
worker concurrency is useful for independent source reasoning without claiming compiler speedup.

### Real correctness matrix

All six fixtures passed in each of the two roots under both serial and concurrent command
execution (24 checks). The concurrent half forced 12 fresh compilations with distinct authored
comment variants and identical expanded source; it did not merely reuse cached objects.
Cross-mode comparisons preserved object text, actual relocations, expanded-source identities,
owner/body evidence and every named comparison field. The fixtures were the accepted 129268
control, shared-header 490ec, two genuine archived 129268 nonmatches, inactive ASM B1F4 and the
short FFE80 candidate. Only the two controls had exact authenticated linked diagnostics;
all four nonmatches remained nonexact and missing B1F4 relocation expectations remained null.

Details are in `build/parallel-implementation/validation/pvfin-posthoist-correctness-summary.json`.
The saved CLI intervals establish overlapping commands. Estimated compile-record intervals
do not establish overlap of the individual KMC/assembler child processes. Native concurrency
therefore remains disabled for the initial agent pilot; no compiler throughput gain is claimed.

Real query validation then caught a CLI startup-order defect: the command dispatcher reached
`module.exports.latestCandidateRun` before the direct-entry path assigned exports. Required-module
tests had missed it. The dispatcher now uses a nonshadowing local wrapper around the hoisted
function. A new direct-entry test reproduced the original failure, then passed for default/private
`classify`, `compare` and candidate-backed `probe` after the repair. The affected real commands and
routine suite were rerun; prior compile/probe evidence remains for its unchanged implementations.
No CURRENT/compiler/verifier implementation changed in this repair.
GoldOx reviewed the correction in mail 778 with no finding; the routine suite passed again,
29/29 in 201.0 seconds. The probe's implementation identity includes `match.js`, so earlier
source-backed probe reports retain their earlier identities. Candidate-backed probe checks
exercise the repaired CLI with new reports; old reports are not relabeled as new evidence.
Real `classify`, nonmatch/self `compare`, and cross-target rejection passed in both roots;
the default `case-cfg` missing-candidate path also reached the expected lookup error. These
nine CLI checks are retained in `pvfin-queries.json` and `pvfin-case-cfg-routing.json` under
the validation directory. They add no production candidate to the shared database.
New-identity candidate-backed probes passed in both roots for RTL, flow, global allocation
and delay-slot dumps, including content/hash authentication and cross-root equality. Reuse
retained the probe ID; deliberately corrupting one owned dump rejected, and its original
bytes were restored. `pvfin-candidate-probe.json` records these repaired-CLI checks.

The real header-shadow test rejected a byte-identical source-local copy of the approved 490ec
header; canonical headers stayed untouched. The private research round trip then reproduced a
genuine nonmatch, imported its observation, recovered it through private intake, published it
with existing `preserve`, and recovered valid source/evidence through normal shared intake.
Stale source identities, a foreign-target parent and a foreign observation all rejected. The
Director inspected and removed only the three new fixture publication files, after verifying
their exact bytes against retained copies. Original research stayed untouched. Evidence is in
`pvfin-shadow.json`, `pvfin-knowledge.json`, `pvfin-owned-publications.json`,
`pvfin-publication-copies.json` and `pvfin-cleanup.json` under the validation directory.

### Release decision

Astra accepts the implementation after independent review, the applicable changed-input audit,
29/29 routine suites and the real positive/negative checks above. Sol resumes as the sole
production writer and assigns one internal Astra Medium helper to `func_002158E4` in
`build/matching/actorhelper/`; Sol owns `func_002159D0` in `build/matching/solactor/`. Keep accepted
canonical inputs in place during parallel candidate work, with temporary activation/restoration
only inside coordinated early-link windows, then integrate the complete ready wave sequentially.
The original five-member Actor wave still includes `func_00215CF0`, `func_00217BA8` and accepted
`func_0021C3B0`; its final verifier runs once when the complete wave is ready. Tooling acceptance
does not accept any new function. The existing Sol watcher remains running.

The pilot must now establish practical value through actual decomp work. No agent speedup or
native throughput improvement is claimed yet. The 30-second focused-diff and 15-minute verifier
goals remain open. Linux and broader worker pools remain outside this release.
