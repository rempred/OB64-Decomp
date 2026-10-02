# Reusable knowledge, concise intake, and shared declarations

Status: implementation in progress under Joe's explicit go-ahead, 2026-10-02. Reviewed with
GoldOx (Claude/Fable); final plan review is Agent Mail 717 and its seven corrections below
are incorporated. Source/build ownership was released by Sol after Scenario commit `249454cb`.
Director: SilentCrane. Joe requested this plan; this document does not itself change
matching acceptance, source/build ownership, or the active implementation priority.

## Intended result

A worker starting a function can quickly find the relevant solved example, useful failed
experiment, and existing data/interface description. A worker resuming it can recover the
best source and next experiment without reading the program's history. Related production
C uses shared declarations when the evidence establishes that they describe the same thing.

This is the implementer's design reference. Ordinary matching workers will use the resulting
short workflow instructions and intake packet, not reread this whole plan at every target.

Deliver these through the current workbench, repository documents, and shared headers.
Do not introduce a second knowledge database, a new progress ledger, a promotion protocol,
a mandatory review per function, or background model calls.

Joe's later instruction selects implementation of this plan now. The
[active queue](../NEXT_STEPS.md) retains the unfinished 30-second focused-diff and verifier
throughput goals for continuation afterward. Parallel
decomp agents and a Linux host remain deferred. No Editor/runtime work or push is authorized.

## Existing pieces and actual gaps

| Piece | Existing implementation | Change needed |
| --- | --- | --- |
| Target research | `tools/lib/matching/intake.js`, `research.js`; tracked dossier/source pairs; `match.js intake/import/preserve` | A compact view and explicit cross-target suggestions; keep current authentication and research boundaries |
| Similarity and compiler examples | `family.js`, `mips_analysis.js`; `matching_studies/compiler_curriculum/corpus.js`; template-reuse studies | Connect existing ranking/representation capabilities to normal intake; do not build another compiler corpus first |
| Source-context observations | Context, source change, measured effect, remaining failure, tags and source relations | Keep these records; add a small symptom-to-evidence index, not a migration of historical tags |
| Shared declarations | Six `include/game` headers, including `class_entry.h` and pose/draw contracts | Adopt additional proven common declarations in bounded source waves |
| Dependency identity | Source-policy depfiles, exact expanded compiler input, diff caches, CURRENT and fresh verification | Reuse these mechanisms; header edits must invalidate all affected producers |
| Working continuity | One lengthy Sol resumption note and existing family plans | One concise live cursor linked to full membership and durable evidence |

Relevant references: [workbench](../MATCHING_WORKBENCH.md), [workflow](../WORKFLOW.md),
[research reuse pilot](../research/w8-pro-research/reuse-pilot.md),
[compiler retrieval](../matching-c/compiler-curriculum.md),
[template transfer](../matching-c/template-reuse.md), and
[accepted header contract](matching-methods-improvement-20260904.md).

`RuntimeUnit` forward declarations are not repeated concrete layouts. Identical type names
do not prove identical layouts: nearby ClassEntry views access different fields. Existing
family similarity and opcode retrieval are research leads, not evidence of semantic equality.

## Delivery sequence and ownership

| Step | Concrete deliverable | Owner and completion |
| --- | --- | --- |
| 0. Fix the pilot set | Small representative input set and before measurements, kept under ignored `build/` | Director; one bounded session using existing records, no new matching campaign |
| 1. Compact intake and continuity | Compact workbench presentation, full-detail escape hatch, one shortened live cursor | Tooling owner plus Sol at a coordinated documentation boundary; no production source edits |
| 2. Cross-target reuse | Family siblings and symptom-indexed lessons; nearest-source fallback only if its replay earns inclusion | Tooling owner; Claude independently reviews the implementation and adversarial results |
| 3. Shared-declaration support | Read-only declaration inventory and a narrowly scoped consistency check | Tooling owner; no automatic C rewriting or global type unification |
| 4. Scenario header pilot | Shared integer definitions and one shared source-record header, adopted by its actual consumers | Sole production writer; first pair in the combined four-target cleanup wave |
| 5. Shop interface pilot | One supported function declaration shared by its definition and caller | Same sole writer; second pair in that wave, then one final verifier for all four |
| 6. Normal operation | Intake, recording, header reuse and maintenance instructions integrated into existing workflow | Director; rollout review after ten ordinary target intakes, no recurring monitor |

Each step must leave a usable result. Do not hold compact intake behind a general C parser,
hold the type pilot behind a repository-wide semantic reconstruction, or delay Sol while
the plan is being reviewed. Shared-tool tests that mutate config or use canonical build
resources require an explicit ownership handoff. Resume Sol when those resources are released.

## 1. Retrieve useful understanding at target intake

### Presentation and command surface

Extend `tools/match.js` and `tools/lib/matching/intake.js`. Put cross-target selection in a
small adjacent helper only if this keeps the current intake implementation clearer.
Implemented CLI additions:

```text
node tools/match.js intake <symbol> --cross-limit 3
node tools/match.js intake <symbol> --symptom register-allocation
node tools/match.js intake <symbol> --include-details --json
```

Preserve the existing machine-readable observation fields and same-target relation semantics.
Add a versioned presentation/summary section rather than silently changing the meaning of
`valid`, `selectedBest`, `counts`, or acceptance. Same-target assessment remains complete
before display truncation. Full details retain every existing failure/count/truncation signal.
Compact human-readable output becomes the default; `--include-details` expands it. Keep
`--json` complete under its existing explicit limit/truncation semantics, with summary fields
additive. A default human view of five own-target rows is enough; do not silently reduce the
machine-readable census to five. Apply the same compact default to human-facing prepare/watch
and packet summaries without removing the full research object from their JSON/API results.

The normal presentation contains:

1. Current target, logical/physical owner and producer applicability; current source identity.
2. Current-source observation when present, then a bounded useful source pair/counterexample.
   Historical selected-best annotations remain historical; they do not identify an active best
   merely because they exist. The worker's current cursor identifies an inactive best candidate.
3. A bounded sibling/lesson section: source/dossier links, why retrieved, observed source
   change/effect, important differences, and evidence/applicability status. Show at most
   three sibling sources and three short lessons, with a total packet budget.
4. Visible stale/malformed/unavailable counts and a route to full detail. Do not bury an
   unresolved body/owner conflict or fabricate an empty-history result after an error.

Prefer extracted existing fields to generated prose. Do not embed full C, assembly dumps,
long histories or full hashes repeatedly in default output. Detail remains available by link.
Prepare/watch and analysis-packet presentation use the same helper; explicitly supplied
source remains the only authored candidate input. Nothing is injected into m2c or C automatically.
Do not attach this lookup to every focused diff or compiler invocation.

### Selection, provenance, and freshness

Use two complementary routes:

1. **Family siblings with source:** use the existing exact, relocation-normalized,
   register-normalized and structural tiers in that order, explicitly labeled. Offer active
   source or preserved candidates with their own class, remaining failure and evidence status.
   Do not call every active source accepted; current applicable verification supplies that claim.
2. **Compiler lessons by symptom:** use the existing mismatch labels and
   `docs/KMC_GCC_MATCHING_NOTES.md`. Add a small tracked
   `docs/matching-c/compiler-lessons.json` index linking a bounded vocabulary of symptoms to
   existing note anchors and immutable observations/source pairs. Measurements remain in
   the observations; compiler explanations remain in the cited notes. Do not manually copy
   measurements, proof status or matching counts into a second table. A short applicability
   description may identify which lesson to open. Existing REPRODUCED,
   EXACT_SINGLE_FUNCTION and NONMATCHING_EXPERIMENT labels keep their documented meanings.

Start with existing labels such as register-allocation, scheduling-or-block-order,
load-store-width-or-signedness, stack-layout-or-offset-family, branch-polarity,
constant-or-immediate-construction and opcode-or-expression. A small manual subtype such as
store-flag is allowed for an evidenced lesson; it is not an automatic diagnostic assertion.
Unknown labels reject in the index schema. Reuse current diagnostic output only when it is
bound to the current candidate; otherwise ask the worker to select a symptom explicitly.
Do not trust a stale `build/diff` report after a failed run. The classifier remains a hypothesis
guide, not a compiler-causality oracle.

The existing free-form effect tags are too diverse and often generic to be a good ranking
signal. Keep them searchable without migrating the observation schema. Prefer source context
and the small symptom index to a tag-frequency score. Stable ordering and visible applicability
limits matter more than a numerical similarity score. Return fewer results when appropriate.

The existing curriculum n-gram retrieval is a fallback candidate, not a v1 dependency.
Evaluate at most three nearest-source results only when no family sibling is available.
Enable that fallback by default only if the replay test below shows additional useful hits;
otherwise retain the explicit existing research command.

Reuse pure feature/ranking functions where their contracts fit. The curriculum's held-out
evaluation mode and its answer exclusions must remain intact; production suggestions may
include family siblings, but evaluation must not accidentally leak held-out answers.
Do not run the corpus compiler builder or template instantiator during ordinary intake.

Use a fresh in-memory catalog of tracked observation metadata first. Existing active source
examples without observations may be offered as source examples, with no invented compiler
lesson or current acceptance claim. Target features come from authenticated project evidence.
When ROM or current compiler evidence is unavailable, retain explicit reference-only limits.

Authenticate selected observations under their own targets with existing `assess` and source
policy functions. Assessing a donor successfully does not prove transfer to the new target.
Cross-target links are a separate presentation field, not foreign `parentCandidateId` or
`relatedCandidateIds` entries: those remain same-target relations. A worker who tests a transfer
records the result on the receiving target, citing the donor dossier through normal references.

An ignored persistent index is optional only if measurement shows repeated catalog/feature
work is expensive. It must be disposable, content-keyed, rebuildable from tracked inputs,
and contain discovery data rather than cached acceptance/classification verdicts. Added,
changed and removed records must change the catalog identity. Selected content is always
reauthenticated. An absent, corrupt or stale index cannot hide records or claim validity.
No daemon, embedding service, new SQLite schema or automatic background queue is needed.

### Capture lessons through the current research commands

Keep the existing observation schema. In its fields, state:

- **Context:** exact source/producer/compiler setting and the mismatch being investigated.
- **Source change:** the tested change, with a recoverable source pair where useful.
- **Observed effect:** measured bytes, schedule, allocation, frame or call/relocation outcome.
- **Remaining failure:** what still differs and the next discriminating question.

Separate the measurement from an explanation of why it happened. A failed variant can
demonstrate a mechanism without becoming the selected best. Use the pinned source context;
pseudo-register numbers and statement-level observations are not universal identities.
Use existing effect tags consistently, while retaining historical tags unchanged. Add a new
symptom-index entry only when a discovery would change another target's experiment; point
to the existing observation and note rather than writing the same finding twice. A correction
updates the index to the superseding evidence and preserves the earlier counterexample.
The worker proposes the lesson and its evidence links in the ordinary handback. The director
owns edits/integration of `compiler-lessons.json`, checking references and evidence labels.
This is index maintenance, not an extra review prerequisite for an ordinary matching wave.
Do not give two agents simultaneous write ownership of that tracked index.
Do not turn every native trial into a tracked dossier or require a new form per experiment.

## 2. Keep the working state short and evidence recoverable

Keep the live cursor at no more than 500 words; it contains only:

```text
Current family / wave; complete membership link
Active target; parked targets and their concrete blockers
Best source and the current mismatch
Next experiment and what its outcomes would distinguish
Applicable acceptance evidence, or provisional/unverified status
Unresolved structural/interface gates; any pending coordination
```

This is a presentation budget, not permission to drop assigned functions or dependencies.
The family plan retains complete membership and completion criteria. Generated status owns
counts. A cursor links to evidence instead of repeating hashes and historical paragraphs.
Update it at a meaningful best-source change, blocker, wave completion or handoff; not after
every cheap test. One active writer maintains it; advisory replies are not another diary.
Add one cheap read-only budget check to the routine test runner for
`docs/Plans/cursors/*.md`; exclude historical notes. Count words deterministically and report
an over-budget file rather than truncating it. Move durable detail to its existing evidence
or roster document and retain the link. Do not create a manual word-count ledger.

At the first migration, reconcile every assigned function, parked candidate and protected gate
against the existing note and current family plans. Build an ignored before/after membership
comparison and manually check unresolved items. Historical manifests are not assumed current.
Check incoming links and hashed research references before moving or rewriting any document.
If a long note is a pinned historical reference, leave its bytes/path intact, freeze its role,
and start a short current cursor linked from the active plan. Do not add even a freeze header
to a hashed historical reference. A proposed path is `docs/Plans/cursors/sol.md`; Sol writes
its first version at his next coordinated handback. Do not update both afterward.
If it has no such constraints, shorten the existing current file, with Git retaining history.
Coordinate this one-time handoff with Sol rather than rewriting his live note concurrently.

Keep useful archived source pairs, counterexamples and their metadata tracked. Existing
canonical references must remain recoverable. Initial cleanup changes default reading and
future preservation behavior; it does not bulk-delete or relocate the archive. Only remove a
proven redundant entry later after checking incoming references and recovery from a fresh checkout.

Put durable rules in AGENTS, the daily loop in WORKFLOW, command details in MATCHING_WORKBENCH,
and current priorities in NEXT_STEPS. Replace repeated procedural paragraphs with links when
touching those documents for this implementation; avoid an unrelated repository-wide rewrite.

## 3. Share proven descriptions of data and calls

### Inventory as a means to an actual migration

Add `tools/declarations.js` as a narrow read-only inventory, with explicit `--target` and
`--header` scopes plus JSON output. Enumerate active producers and relevant
headers; distinguish opaque forward declarations, concrete definitions, partial views,
textually identical candidates, incompatible declarations and unsupported syntax.
Classify forward declarations separately before searching for concrete bodies. The token
inventory distinguishes RuntimeUnit's 28 tagged forwards, one tagged body in `func_0012FB64.c`,
and eleven anonymous typedef views. It is not a 29-layout consolidation pilot. Keep all three
categories in the regression fixture; neither a matching tag nor an alias proves shared layout.
Recognize macro/packing/conditional context; a text match is only candidate discovery.
Do not turn a regex extractor into a purported C type checker. Start with the syntax required
by the selected pilot and report unsupported constructs explicitly.

The inventory is generated under ignored build paths, with paths and evidence links; it is
not another manually maintained registry. Use existing compiler/dependency identities for
the actual checks. A shared declaration is admitted from original accesses, mapped storage,
consumer/producer evidence and target-compiler behavior, not name similarity alone.

### Concrete data pilot

First reconcile current proof and the complete consumer closure for:

- `src/lib/func_001957D0.c`
- `src/lib/func_000490ec.c`

Both currently define the same `Func001957D0SourceRecord` and refer to
`g_func_001957D0_source_records`. The selected narrow migration is:

1. Add `include/common/types.h` with the exact existing signed/unsigned 8/16/32-bit aliases.
   Adopt it only in the pilot's consumers; do not reformat or migrate all C files.
   Before source adoption, use the pinned compiler in isolated scratch under the writer's
   ownership to test include guards, mixed include order and repeated local typedefs. Do not
   assume this old compiler accepts duplicate identical typedefs; remove superseded local
   aliases in the same source edit that introduces the header. This probe is planned, not
   claimed as run during this read-only planning task.
2. Add `include/game/scenario_source_record.h` containing the unchanged record and supported
   shared global declaration. Include the integer header so it is self-contained.
3. Replace those duplicate declarations with the include, preserving field names, qualifier
   distinctions, alignment, array stride, expressions and function signatures.
4. Leave the packed template, 52/56-byte partial records and uncertain meanings local.

New shared headers are self-contained and guarded: include their required common aliases
rather than depend on include order in consumers. Document this convention in
`include/README.md`. The legacy `class_entry.h` exception remains until a subsequent small
header-maintenance wave changes that header and all four consumers together, removing local
aliases at the same time. Do not change it during an unrelated single-function edit.

This pilot is nominated from current source, not pre-certified by this plan. If original
placement or consumer evidence contradicts sharing, report that specific conflict and choose
another demonstrated duplicate; do not expand or rename the record to make the pilot pass.
The existing ClassEntry four-function header pilot is a regression reference, not a mandate
to combine its other partial views. Pointer-containing layouts must be checked using the N64
target ABI, never the host's pointer size or padding rules.

### Concrete interface pilot

At a suitable Shop boundary, reconcile `func_0019BD14` and its caller `func_0019B26C`.
The current definition and call declaration agree on `u32 func_0019BD14(void)`.
Use a small self-contained Shop header included by both definition and caller; preserve
their existing code. Search all declarations and mapped callers before fixing the scope.
Keep the date-helper overlay alias and unrelated uncertain interfaces out of this migration.

The inventory pilot must also demonstrate a real conflict without forcing a repair. Use
the documented [F34 caller reconciliation](task-logs/astra-f34-caller-interface-review-20261001.md)
as a known evidence-boundary case and select one current conflicting declaration from the
fresh inventory. Report alias/context, supplied versus consumed inputs and the unresolved
reason. If no supported shared declaration follows, leave it local and record that outcome;
the purpose is to prove the process refuses unjustified merging, not to reopen the movement
family. Do not assume an exact accepted callee proves its historical unused formal arguments.

For each future shared interface, record supported parameter/return types, calling context,
and the actual source/ASM evidence. Distinguish arguments a caller supplies from values a
callee consumes. Unused register values alone establish neither a parameter nor its absence.
Do not silently normalize signedness, narrowing, qualifiers, return types or variadic behavior.
Address labels require owner/overlay context; equal RAM numbers need not identify one object.

### Checks and future edits

Add a scoped declaration-check command/test alongside the inventory. It checks the selected
shared header and its known consumers for supported textual duplicate definitions and declaration
conflicts. The command reports `compilerChecked: false`; pinned-compiler fixtures in each source
pilot provide the separate supported C checks. Unknown/partial views stay explicit rather
than generating hundreds of false mandatory failures. No build-wide extern registry is created.

Use small target-compiler fixtures for relevant sizes, offsets and signatures. Include deliberate
wrong width/signedness, padding, conflicting prototype, forward-declaration and header-shadowing
controls. An offset/size test establishes layout only; it does not prove a field's meaning.

Before modifying a shared header later, enumerate its full transitive dependent producers from
current authenticated dependency records and source evidence. Reconcile includes/conditionals, grouped producers and all
mapped callers, rather than trust a stale previous depfile alone. Make all affected sources
consistent, test changed consumers with focused checks, then verify the complete assigned
source wave once. Retain a narrow local view where a shared meaning is not established.
The existing dependency-content hashes and Tier-B include-directory name/type inventories
already handle changed header contents and changed include resolution under their accepted
contracts. There is no new cache-invalidation system, manual cache purge or acceptance cache
to add. A directory inventory alone is not a substitute for dependency content hashes.
Run the initial header migrations as one dedicated, complete four-target cleanup wave at this boundary,
without mixing a new header with unresolved matching edits. If any consumer ceases to be exact,
do not land the proposed shared-header wave; diagnose or restore its previous local form.
Do not silently shrink the consumer set to conceal the failure.

`tools/verify_shared_header_compatibility.js` is historical support, not a generic migration
gate: it assumes header-free source identities/artifacts and older schemas. Do not run or
weaken it to bless these edits. Use current source policy, focused diff and normal verifier.

## Validation and rollout criteria

### Retrieval and concise presentation

- Extend `tests/matching_intake.js` and relevant `matching_research`, workbench, curriculum
  and analysis-packet tests. These already cover missing stores, reference-only mode,
  stale headers/preprocessors, incorrect target identity and foreign relations.
- Add positive cross-target cases plus real nonmatching/failed candidates. Reject stale donor
  source, changed include, compiler mismatch, wrong owner/alias and corrupted index entries.
  Similar opcodes with different offsets/constants must remain leads, never exactness claims.
- Preserve unchanged compiler/decompiler input, matching verdicts and group restrictions;
  lookup failure cannot change a successful compiler result or conceal an actual failure.
- Confirm deterministic ranking, omitted-result counts, complete detail access and fresh
  discovery after a dossier is added on an analysis-packet cache hit. No hidden compiler run.
- Exercise a fresh checkout without the ignored research database/index, and the missing-ROM
  reference-only case. Do not rebuild acceptance merely to make a reading test succeed.

Freeze a small pilot set before tuning ranking: own-target history, a useful cross-target
transfer, a useful regression pair, inactive ASM candidate, grouped producer, partial-view
type conflict, stale evidence and empty history. Use existing Scenario/W8 pairs and accepted
header examples rather than accepted tiny functions alone. Define relevant expected links
before evaluating output. Require all seeded known-useful cases to be discoverable in detail
and at least four of six positive retrieval queries to put a useful link in the first three.
All adversarial status cases must remain honest; zero false-valid records is required.

Also replay the last twelve usable solved-target histories, using only donor evidence that
existed before each solve. Freeze selection and cutoffs before tuning; if fewer than twelve
have trustworthy history, report the actual count rather than inventing dates. A hit requires
a cited lesson/sibling that explains a recorded decisive experiment, not just the target's own
answer or a generic scheduling tag. Fewer than four useful hits in twelve means the new
automatic section stays opt-in pending a smaller revised design. Compare sibling-only,
symptom-only and optional n-gram fallback results separately. Do not let a later lesson about
the solve leak into its replay input. This is a retrieval-usefulness test, not new decomp work.
Observation envelopes have no reliable creation timestamp. Use the first Git commit introducing
the dossier/observation content and the solve commit, with ancestry and the actual historical
blob establishing availability. Filename dates are only a cross-check; mtimes are not evidence.
Later edits to an older file must not leak into the historical replay. Keep the fixed input
list and results under ignored build paths, not a new changing source-history ledger.

Default displayed intake should be at most about 1,500 words and at least 50% smaller than
the existing required reading for the same representative resumptions. Preserve full assigned
membership, best-source recovery and a concrete next experiment. Measure catalog/ranking and
selected-record authentication separately; target <=1 second added warm selection overhead
on three fixed representative intakes, with total authentication time reported separately.
If authentication makes default retrieval materially slower, reduce automatic suggestions or
keep cross-target retrieval opt-in rather than relaxing validation. Do not add work to diff.

After ten ordinary target intakes, inspect actual worker use: which suggestion was consulted,
what experiment it changed, and whether useful counterexamples prevented repeated work. Reuse
the existing observations/command history; no per-test metrics diary. If suggestions produce
no actionable reuse, narrow the defaults and revise selection; do not expand the index blindly.
This small pilot demonstrates usefulness, not a statistically proven decomp speed multiplier.
Count a suggestion as consulted only when the worker names the opened lesson/example and
its use in the ordinary handback or existing observation. Displaying a suggestion is not use.

### Source and tooling acceptance

For each header-adoption wave, establish every affected consumer before edits. Run focused
source-policy/linked checks as needed while changing them; preserve class, full body coverage,
sole ownership, placement, actual relocation contracts and exact bytes. Once the whole wave
is ready, run plain `node tools/verify.js` once and let it build CURRENT if required. No
per-function full ROM, redundant preceding build, or unchanged-commit verifier repeat.

Independent review applies to the shared tooling changes. Pure presentation/documentation
work needs focused behavior/link checks, not a new ROM build. Ordinary header extraction under
the accepted compiler/include contract needs normal wave verification, not an invented source
review gate. Any change to acceptance, source policy, ownership, preprocessing contracts or
compiler foundations is a separate structural/tooling change requiring the applicable audit
and independent review. Do not bundle such a change into this plan's easy header pilot.

Implementation touch points and proposed tests:

| Change | Files / checks |
| --- | --- |
| Compact and cross-target presentation | `tools/match.js`, `tools/lib/matching/intake.js`, a small selection helper if needed; `tests/matching_intake.js`, `tests/matching_research.js`, `tests/matching_workbench.js` |
| Existing packet wiring | `tools/analysis_packet/core.js` only if its presentation adapter needs adjustment; real packet-cache refresh test in `tools/analysis_packet/test.js` |
| Symptom index | `docs/matching-c/compiler-lessons.json`, existing KMC notes links; schema/link/symptom/replay tests, no observation schema migration |
| Reused ranking contracts | `family.js` / `mips_analysis.js` representations and curriculum pure functions; preserve `tests/compiler_curriculum.js` and `tests/template_reuse.js` |
| Declaration inventory | `tools/declarations.js`, `tests/declaration_inventory.js`; proposed scoped-header check; no auto-fix mode |
| Source adoption | New integer/Scenario/Shop headers and the precisely enumerated consumers; `tests/source_policy.js`, confinement/cache tests and normal complete-wave verifier |
| Daily documentation | `docs/WORKFLOW.md`, `docs/MATCHING_WORKBENCH.md`, `include/README.md`, one current cursor and the active queue link; no fifth copy of the rules |
| Cursor maintenance | One proposed `tests/cursor_budget.js` check, wired once into `tools/test.js`; live cursors only, no automatic truncation |

Wire new focused tooling tests into `tools/test.js` or its existing workbench suite once,
without running the same nested suite twice. Grouped producers, transitive-header changes,
same-size edits, bad include resolution and interrupted/failed lookups belong in the negative
checks. Do not add full-ROM tests to documentation maintenance or a per-function hook.

## Maintenance in the normal working loop

| Event | Required action | Owner |
| --- | --- | --- |
| Start/resume target | Read short cursor and compact intake; open only relevant examples/contracts | Sol/current production worker |
| Mismatch class changes or target stalls | Retrieve relevant effect examples; form a discriminating source experiment; ask Claude when genuinely stuck | Worker, Claude advisory |
| Useful discovery | Preserve best or explanatory pair/counterexample through existing commands; name limits and donor reference | Worker |
| Cross-function lesson worth indexing | Propose entry in ordinary handback; director adds or supersedes the evidence link in the one lesson index | Worker proposes; director is index writer |
| New proven shared field/interface | Reuse existing header or propose narrow consolidation; keep uncertain meanings explicit | Worker, director only for structural/semantic scope decisions |
| Shared header edit | Enumerate and check affected producers; final verification at the complete wave boundary | Sole production writer |
| Wave completion/handoff | Refresh one current cursor; update a domain document only for reusable new understanding | Worker |
| Tool change or failed retrieval pilot | Correct implementation and run affected tests; independent tooling review | Director/tooling owner, Claude reviewer |

No scheduled housekeeping or heartbeat is added. Usefulness checks occur with real work.
The worker does not need Claude's review to accept an ordinary matching wave. The director
maintains tooling and workflow, while the worker records discoveries and uses shared contracts.

## Recovery and exclusions

If retrieval regresses, disable the new presentation/selection path and retain existing full
intake. Rebuild or remove only its disposable index through the normal confined tool path.
If a header changes output, keep the best pre-edit source, isolate the cause with focused
checks, and retain local declarations until the complete wave passes. If a shortened cursor
loses an obligation, recover it from the preserved note/Git before continuing that assignment.

This plan does not authorize source copying from external decomps, blanket declaration
merges, invented semantic names, extra acceptance caches, archive deletion, a new equivalence
class, antivirus exclusions, new agents working concurrently on functions, Linux migration,
live emulator captures, new branches/worktrees or publication.

## Implementation decisions and measured rollout

- Sol released production/config/build/native-test ownership after accepted Scenario commit
  `249454cb`. His live cursor is 332 words; its full roster links and parked gates remain.
  The historical resumption note remains at its original path and bytes.
- Preserve `docs/MATCHING_WORKBENCH.md` at its original bytes: four existing observations
  pin that exact guide. New command details are in `docs/WORKFLOW.md`. Its 72 historical
  reference hashes already differed from the pre-change guide; no archived hashes are rewritten.
- The frozen twelve pre-solve Git replays found **0/12 decisive family hits and 0/12 decisive
  symptom hits**. Cross-target lookup therefore remains opt-in. The n-gram fallback was not
  evaluated or enabled. This implementation does not claim a demonstrated decomp speed multiplier.
- The six frozen present-day retrieval queries found three useful first-three results, below
  the four-of-six threshold. Resume packets including the same cursor shrank 61–82%; a fresh
  startup that also includes all four durable guides shrank only 8.5–27.6%. Guide reading has
  not been silently omitted from that comparison.
- Fixed own-target, cross-example and grouped intake displays fell from 6,068 / 5,562 / 2,709
  words to 820 / 861 / 867, with identical full same-target observations, counts, totals and
  truncation. Added opt-in catalog/ranking cost was 131–151 ms; donor authentication was
  measured separately. These single runs establish display reduction, not a runtime speedup.
- Detailed before/after and historical-cutoff evidence is ignored under
  `build/knowledge-workflow-20261002/replay/`. The routine test runner includes the new
  cursor budget, declaration fixtures and knowledge retrieval checks once each.
- The declaration inventory deliberately performs no compilation. Its supported textual
  check is advisory; the two header waves retain separate target-compiler fixtures, focused
  checks and normal completed-wave verification. No source-policy or acceptance contract changes.
- Independent implementation review was requested from GoldOx in Agent Mail 724. Review 726
  required currently valid curated observation links and explicit conflicts outside nominated
  header users. Review 727 supported batching both pilots; both use `common/types.h`, so its
  full four-producer closure is one assigned wave. Final review 731 confirmed both corrections
  and no further findings. The Director accepts the tooling after the required routine runner
  passed **27/27 suites in 135.3 seconds**; its log is
  `build/knowledge-workflow-20261002/routine-tests.log`. This includes 24 knowledge checks,
  23 declaration fixture groups, 25 intake checks and the existing regression suites.
  The separate real packet-cache refresh discovered a new dossier with no decompiler rerun.
  Header pilots and final source integration remain pending at this tooling handoff.
- Curated current-observation links now authenticate the two recent Scenario discoveries.
  The W8 localization/regression trio remains available as explicitly historical dossier
  references, with no claim of current target binding. No observation or source history was
  rewritten to make an index link appear valid.

## Consultation record

- GoldOx identity verified as the current Claude guidance assistant.
- Agent Mail 711 requests critique of the concrete implementation and maintenance proposal.
- Mail 712 adds the existing retrieval implementation and specific data/interface pilot findings.
- Mails 713/714 support compact intake, atlas siblings and symptom-based lessons, the narrow
  Scenario record pilot, dedicated header waves and one final verifier per complete wave.
- Mail 716 submits the concrete draft and corrects the RuntimeUnit census and unsafe idea of
  editing a hash-referenced historical note. Mail 717 confirms both corrections and accepts
  the plan subject to seven small additions, now incorporated: compact default/full JSON,
  Git-dated replay, mechanical cursor budget, director ownership of the lesson index,
  self-contained new headers with a later ClassEntry migration, existing cache invalidation,
  and an observable definition of consulted suggestions.
- Director decisions: preserve current priority/order and source acceptance; no broad RuntimeUnit
  or ClassEntry merger; no automatic effect-tag scoring or new persistent index; n-gram fallback
  must earn inclusion. Planning changed only this document and the active-queue link. No compile,
  source/config edit, full-ROM build, verifier, audit, watcher change or push ran for this plan.
