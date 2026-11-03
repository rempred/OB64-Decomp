# OB64 Decomp — Canonical Matching Workflow

This document defines the ordinary function-matching loop for *Ogre Battle 64:
Person of Lordly Caliber*, US Rev 0. It uses the accepted structural model and
toolchain and keeps them unchanged.

Read [the agent guide](../AGENTS.md) first. Source classification is defined by
[the source policy](SOURCE_POLICY.md). If the work changes a boundary, segment,
overlay, placement, executable extent, linker ownership rule, or toolchain
contract, stop using this ordinary workflow and follow
[the structural audit](AUDIT.md).

## Comparison scratch storage

`diff.js` preserves an immutable diagnostic report, complete authored producer and
expanded compiler input under each run's `.scratch-retention/` directory. The
capture authenticates existing source-policy and compiled-input identities; it
is diagnostic evidence, not matching acceptance or a complete replayable dependency
archive. A small summary and file census identify the retained bytes. Existing
compiler, owner, source-class, relocation and full-ROM rules do not change.

Storage control currently performs **no deletion**. Defaults of 32 runs, 12 GiB of
recorded run bytes and 4 GiB of retained records are warning thresholds only. There
is no hard storage quota or bounded-total cleanup. Legacy/incomplete byte totals
remain explicitly unknown in the cheap per-run accounting. Large manifest, ELF
JSON and map files are bulk, not part of the retained-record allowlist.

Live free space is a hard admission check on the diff destination volume, before
baseline reuse and again before copy, compile and link: 8 GiB floor plus 2 GiB for each
active cooperative diff reservation. With mixed settings, the largest active floor
plus all active peaks applies; a new caller cannot lower an existing reserve.
Old or malformed claims fail closed. The 2 GiB peak is provisional; this is not a
volume quota or a guarantee against unrelated writers. A missing/stale baseline
refuses before its native build starts and requires separately budgeted setup.
Existing context preparation still precedes this comparison-run admission.

Configure positive integer byte/run values with `OB64_SCRATCH_MAX_RUNS`,
`OB64_SCRATCH_MAX_BYTES`, `OB64_SCRATCH_MAX_RECORD_BYTES`,
`OB64_SCRATCH_FLOOR_BYTES` and `OB64_SCRATCH_PEAK_BYTES`.
Run/byte thresholds continue to warn when exceeded. A reservation claim is
append-only; a separate completion/failure release records a finished command.
Crashed or malformed claims are never cleared by age/PID and require Director
inspection. Concurrent same-symbol commands reject while the other claim is
active; latest reports publish atomically, with every run retaining its own report.
Error paths retain files. These records are internal scratch lifecycle metadata,
not a new matching-worker handoff protocol.

Read-only inventory is available through:

`node tools/scratch-retention.js --root <absolute-diff-root> --dry-run --docs <absolute-docs-root> --memory <absolute-memory-root> --mail <absolute-project-mail-archive>`

The --mail option above reads preserved historical archives only; it is not an operational
Mail dependency. Repeat reference options to cover all relevant roots. Missing, unreadable or unsafe
inputs are exposed as incomplete, protecting affected data. Supplied-root coverage
is not proof that every current/best/pinned/live reference has been found. The
inventory recognizes full diff names/paths, bare 13-digit timestamps and a 6-hex
suffix adjacent to its symbol; 64-/8-hex identifiers apply only to actual hash run
IDs. Function address mentions alone are not hash-run references. No apply/remove
operation exists. All data, including current/best/referenced/unknown runs and their
complete dependency closure, remains untouched. The Director owns the next reviewed
historical dry-run and operator-apply decision after this stage; inspection does not
authorize cleanup of workbench/probes, accepted proofs, compiler sources or fixtures.

### Safe filesystem cleanup

Apply this to scratch cleanup and authorized worktree removal, including Git's own
recursive removal. Stop commands using the selected root first; preserve best source,
required research and accepted proof before deleting their only copy.

1. Verify the exact absolute deletion root is inside the user-authorized scope. Inspect
   its ancestors, the root itself and the complete subtree with an explicit directory
   walk that **does not descend into reparse points**. Record every junction, symlink or
   mount point and its target. An incomplete or unreadable census blocks that cleanup.
2. Protect shared tools and inputs regardless of where the link lives: repository
   `.toolchains`, configured compiler/PowerShell/Python/runtime roots, baseroms and
   accepted-build archives. Capture the existing pinned identities of any shared tools
   reachable from the subtree. A disposable checkout does not make its link targets
   disposable.
3. Never pass a subtree containing reparse points to `Remove-Item -Recurse`,
   `git worktree remove`, or another recursive remover. Detach each link itself with a
   verified nonrecursive link-removal operation and confirm its target remains intact;
   otherwise leave the subtree alone and report the specific blocker. Do not compose
   deletion across shells or traverse links to calculate removal paths.
4. Repeat the no-follow census immediately before deletion; abort if links, root identity
   or active users changed. Delete only the validated literal path in one shell. Check
   the requested root is gone and protected targets still exist with unchanged pinned
   hashes. Run the affected setup/smoke check before declaring cleanup complete. Do not
   fix a failed post-check by changing toolchain pins.

This is an execution check, not a new evidence protocol: retain the concise result in
the existing cursor or cleanup report. Keep wave scratch bounded during matching and
remove it after accepted output has been copied and hash-checked.

If deletion of an authorized disposable item is blocked, Joe requests moving it to
`C:/Users/Joe/Desktop/Recycling` instead, when safe and permitted. Use a unique descriptive
subfolder without overwriting existing contents. Apply the same no-follow census to the
source and destination ancestors, protect active users and published references, then
move the validated literal path and verify its contents. Record the original and new
paths in the existing cleanup report or cursor. If the move is blocked or unsafe, leave
the item in place and report why. Do not automatically empty Recycling.

## The short path

Use the agent guide's worker assignments on `main`, with one dedicated top-level integration
thread as production source/build writer, additional to the assigned matching workers.
Route retrieval/data-seeking or parsing-only assignments to Sol High under the agent guide's worker-model rule.
Use [the active queue](NEXT_STEPS.md) for current worker assignments and the
[program](Plans/sequential-main-program.md) for complete family scope and real dependencies.
Do not create or use concurrent development branches/worktrees. Preserve historical worktrees as read-only evidence.
Independent read-only research/review and explicitly disjoint documentation work may proceed alongside matching.
Assign source workers separate complete waves, preferably in less-related families, under
[the private workflow below](#private-candidate-workers). Each works on one target at a time;
do not divide one function or coupled producer between source workers. The production writer
retains sole canonical integration and build ownership, with one completed wave integrated at a time.
Matching workers stay with their own complete waves and private context. The integrator reconciles
ready sources, runs acceptance, publishes shared research and performs authorized cleanup.
The Director makes acceptance and ownership-release decisions. For a production-role transfer,
finish the outgoing writer's active production commands and record the next action in its existing
cursor/handoff before releasing it; then grant the new integrator sole write authority.
Parent top-level task transport procedures do not apply to this decomp program.

After the one-time local setup in [the repository README](../README.md):

```text
node tools/match.js doctor
→ establish a missing setup baseline once
→ choose one accepted target
→ consult its current research intake
→ write or adjust its C source
→ node tools/diff.js <symbol>
→ iterate from the linked diff
→ confirm PURE_C and exact relocation contract; record a provisional candidate
→ repeat for the remaining assigned wave targets
→ after the complete wave, node tools/verify.js once
→ confirm every wave target is PURE_C in the final report
→ completed-wave integration; verify changed integration inputs
```

`match.js doctor` is a setup check for the optional research workbench. It needs
the normalized baserom, the configured production compiler/assembler chain, and
the pinned m2c checkout. It does not install any dependency and it does not
verify a source match.

Final full-ROM builds and strict verification occur at the end of a complete
assigned wave, not after each function. `verify.js` builds CURRENT when needed;
do not run a redundant final `build.js` first. The `--target` option still runs
the complete verifier, so it is not a focused per-function alternative.

Provisional function commits can preserve small source history without a final
ROM build. They remain unaccepted until the combined wave passes its final gates.
Do not redefine a multi-function wave as single-function waves to retain the old cadence.
A genuinely standalone function assignment has one wave containing that function.

Ordinary matching-wave completion does not require independent review. Passing
the complete canonical verifier and confirming every assigned target is `PURE_C`
establishes matching acceptance for those exact inputs. A ROM build alone is
insufficient. Director intake confirms scope and the reported proof; it does
not repeat the matching work or require another verifier for independent review.

Structural changes, tooling or verification changes, and new semantic claims
retain their applicable review requirements. Recording actual relocations under
existing linker rules remains ordinary matching work. Reviewing that evidence
does not require a separate reviewer. Route any change to the linker rules or
accepted structural model through the structural workflow.

## Acceptance boundary

The project keeps four kinds of evidence separate:

1. **Matching evidence:** did the linked replacement and complete ROM reproduce
   retail bytes?
2. **Source evidence:** is the source `PURE_C`, `HYBRID_C`, `ASM`, or `UNKNOWN`?
3. **Structural evidence:** are the accepted owner, boundary, placement, and
   linker model correct?
4. **Semantic evidence:** what does the code mean?

An ordinary function counts as matching C only when all of these are true:

```text
verified Rev 0 baserom
+ authenticated pinned toolchain
+ PURE_C source
+ original assembly target excluded from the current link
+ C object is the sole linked owner
+ accepted address and size
+ reviewed load-relevant relocations
+ exact linked target bytes
+ exact complete ROM
= accepted matching C
```

An exact match does not prove a descriptive name, comment, field meaning, or
gameplay explanation. An exact `HYBRID_C` replacement remains matching hybrid;
it is not matching C and does not contribute to the matching-C count.

`BASELINE` is the accepted assembly/data build and structural model that
reconstructs retail Rev 0. `CURRENT` is that baseline with zero or more accepted
assembly owners replaced by C objects. An accepted `CURRENT` must remain byte-exact
with the canonical ROM. Intermediate wave candidates do not establish a new accepted baseline.

## One-time setup

The README lists every local prerequisite. In summary, provide the supported
ROM and authenticated host, compiler, PowerShell, Splat, asm-differ, GNU
Binutils, preprocessing, and m2c dependencies. Then create the ignored local
configuration and normalize the ROM:

```powershell
if (-not (Test-Path config/local-tools.json)) {
  Copy-Item config/local-tools.example.json config/local-tools.json
}
# If copied above, replace its normal-work placeholders.
node tools/verify_baserom.js
node tools/match.js doctor
node tools/build.js
```

The normalization command auto-selects a sole ROM under `baserom/`. If the ROM
exists only at the external path recorded as `romInput`, pass that path directly
with `node tools/verify_baserom.js --input <rom>`; the standalone normalizer does
not load `config/local-tools.json`.

`workRoot` must be outside the repository. `phase5aRoot` is audit-only. The
repository authenticates supplied tools against tracked contracts; it does not
download or install them.

`tools/build.js` creates or reuses a valid accepted structural baseline, builds
all active C replacements, and requires the complete current ROM to equal the
canonical normalized baserom. A build failure caused by tool or ROM identity is
a setup failure to fix, not a verification rule to bypass.

This setup baseline is a one-time prerequisite when missing. Do not repeat it
for each target or when an authenticated existing baseline can be reused.

## Normal matching loop

### 1. Select an accepted target

Work on one assigned target at a time. Use the priorities in
[NEXT_STEPS.md](NEXT_STEPS.md); prefer work that removes a LordlyCaliber hook or
limitation or unlocks a high-value call graph. Function count is a status metric,
not the optimization target.

Confirm that the symbol resolves to one unambiguous accepted logical target with
its complete text-owner mapping, ROM placement, runtime placement, size, and
original assembly. A legitimate logical target can span multiple preserved
owner rows; use its reviewed mapping as-is. Do not reject that mapping or infer
a new boundary from a plausible disassembly during an ordinary match. For conflicting
evidence, use the bounded coverage check below before routing a structural concern.

The optional workbench can inspect or rank accepted targets:

```powershell
node tools/match.js inspect <symbol>
node tools/match.js rank --lane leverage
node tools/match.js rank --explain <symbol>
```

Rankings and family relationships are leads, not structural or semantic proof.

Before starting or resuming the target, consult its current research intake:

```powershell
node tools/match.js intake <symbol>
```

This presents relevant archived source observations and available local history, including
source context, effects, remaining failures and related candidates. Read the exact useful
pair or counterexample before repeating or extending an experiment. Compare its source context
with the current best; an effect observed in another context is a hypothesis for transfer.
Missing history is a normal result. Reference-only, stale, malformed or unavailable evidence
must retain that status; it does not establish a current observation or silently mean there
was no prior work. Check parent/comparison relation status separately from source validity.

The human view is compact; use `--include-details` to expand it or `--json` for the full
structured result within its explicit result limit. Do not read full histories by default.
For a relevant source analogue or compiler symptom, request bounded additional evidence:

```powershell
node tools/match.js intake <symbol> --cross-limit 3
node tools/match.js intake <symbol> --symptom register-allocation
```

These opt-in suggestions are research leads. A sibling's valid source does not prove transfer,
and a recorded lesson does not prove its explanation applies to this target. Open the cited
source pair before using it. Use an explicit symptom when no fresh candidate-bound diagnostic
is available; never infer it from a stale diff report. This lookup is not part of every edit/diff.
Family tiers remain distinct: exact bytes, relocation-normalized, register-normalized and
structural. Donors are assessed under their own targets; grouped history remains reference-only
for standalone reuse and HYBRID_C remains hybrid. Active source alone is not acceptance.
The [lesson index](matching-c/compiler-lessons.json) links supported symptoms to existing notes
and observations; unknown symptoms reject. It stores no copied measurements or acceptance
verdicts. Full JSON retains same-target assessment, failures, relations and explicit census
limits. The compact view shows at most five own-target rows; optional discovery adds at most
three siblings and three lessons. No compiler corpus or persistent discovery service is run.

Matching preparation/watch results and standalone analysis-packet results also present fresh
research intake. If that current presentation has already been read, do not repeat the lookup.
The lookup uses tracked records on a fresh checkout and can supplement them from an existing
local store. It performs no code generation or source activation. Optional history problems
do not block the ordinary compile, linked diff or final verifier. See the
[workbench reference](MATCHING_WORKBENCH.md) for commands and evidence-state details.

#### Check target coverage before tuning

1. At intake or resumption, reconcile the current intake/dossier and relevant documentation with full target disassembly.
   Identify callable bodies, physical owner fragments, and the C producer required by the assignment.
   Use [logical-function selections and production boundaries](LOGICAL_FUNCTIONS.md) to distinguish scratch body coverage from production ownership.
2. Before tuning, check candidate C, whether generated or hand-authored, and the first comparison.
   Both must cover the expected byte interval and body census.
   Every required body must be represented; a combined owner must not silently become only its first body.
   Accepted metadata and generated output are evidence to cross-check, not substitutes for this reconciliation.
3. For a strong unexplained length/body gap or contradictory documentation, the worker must investigate the target before further tuning.
   Neighboring return-plus-independent-setup patterns and live setup outside the selection also require this bounded investigation.
   Inspect adjacent instructions and relevant existing evidence only far enough to explain the discrepancy.
   Account for delay slots, shared tails, padding, and the accepted producer contract.
   A return alone does not prove a split. An ordinary length mismatch does not establish a structural defect.
4. Preserve the best candidate. Record expected versus actual byte/body coverage through existing research records or handback.
   Include the concrete evidence, competing explanation, and remaining uncertainty; reuse current records rather than creating a separate report requirement.
   For an independently supported boundary or tool defect, route the evidence to the Director for a separate assignment.
   Ordinary matchers must not change shared tools or owners. Continue unaffected authorized work.

In reporting, distinguish a generated candidate, a manual source experiment, a compilation failure, and a compiled nonmatch.
A compiled nonmatch requires successful compilation and current comparison evidence.
An exact linked candidate remains provisional until the existing completed-wave gates establish an accepted match.
This check adds no per-target full build, repository-wide rescan, or new acceptance gate.

### 2. Reconstruct and activate the source

Create or adjust the target under `src/`. Use the accepted disassembly, callers,
callees, constants, static data, existing types, and relevant repository
research. Independently derive readable, structured C first, then run an early linked diff.
Reuse evidence-backed shared types, fields, and constants where their layouts and meanings are supported.
Keep uncertain meanings explicit; a byte match alone cannot establish them.
Awkward but valid C is allowed when the historical compiler requires it.
Explain necessary compiler workarounds near the affected source, with the observed reason.
Ordinary readability cleanup under existing contracts uses the same wave gates without additional independent review.

At analysis intake for a large or difficult function, prepare or reuse the default Kuna and m2c
outputs with the accepted [standalone analysis-packet command](ANALYSIS_PACKETS.md).
It generates both interpretations from authenticated retail inputs and caches them by input,
tool and option identities. Keep m2c primary and treat both outputs as hypotheses. Request an
alternate Kuna transformation only for a specific ambiguity. Unsupported inputs and missing or
failed tools remain explicit; packet generation is outside compilation and acceptance checks
and does not become a prerequisite for the normal build.

Keep the accepted target symbol unless a `CANONICAL` semantic name is already
established. The original assembly file remains tracked as reference and
fallback, but an active current build must exclude its target and link only the
C replacement.

For a new active target, add the smallest record to
`config/matching-c-targets.json`:

```json
{ "symbol": "func_XXXXXXXX", "source": "src/path/func_XXXXXXXX.c" }
```

Do not duplicate derivable placement, byte, boundary, or owner facts in that
record. Never add a new target to the frozen compatibility file
`config/phase8/matching-c.json`.

Do not paste instructions into C or use register-asm bindings, raw-code
injection, naked-function mechanisms, or section tricks to force a match. The
source-policy tool classifies assembler escape hatches mechanically. If the
assignment requires matching C, the final source must be `PURE_C`.

### 3. Iterate with the canonical linked diff

Run:

```powershell
node tools/diff.js <symbol>
```

`diff.js` prepares the active replacement objects, freshly compiles the
requested target with the authenticated compiler, and links a fresh current
layout at the accepted placements. It reports instruction diagnostics
separately from the raw linked-byte result. The linked-byte result is
authoritative. `EXACT` requires a nonempty pairwise decoded-instruction match and
equal final linked bytes. Missing, duplicate, malformed, or wrong-sized linked
sections fail.

Do not require every experiment to improve the score immediately. Keep the best known candidate
separate from exploratory source snapshots, and allow a supported hypothesis to be tested through
several related changes even when an intermediate result regresses. Record what the experiment
tests and what its result establishes. Prefer "not selected as the current best" for a worse
candidate. A worse score or nonmatching extent rules out that exact candidate for acceptance;
it does not by itself rule out the underlying control-flow or lifetime hypothesis. Closing that
hypothesis requires stronger, stated evidence. Preserve useful intermediate forms and follow-up
questions without weakening final byte, ownership, source-class or full-ROM requirements.

For responsiveness, the diff path may reuse authenticated cached objects from
ignored `build/diff-object-cache/` for unchanged sibling targets. Its cache key
and restored artifact set cover the sibling's authored source, exact
preprocessed compiler input, complete repository-local dependency identities,
source-policy result, accepted
target/linkage contract, compiler and assembler identities and flags,
object-processing implementation, and every restored artifact. A missing,
stale, malformed, or tampered entry is rejected and rebuilt. The requested
target is always compiled fresh, and every diff still freshly constructs and
links the current layout before comparing it. The summary reports sibling
cache hits, misses, rebuilds, and compiler invocations.

The diff also caches eligible sibling preprocessing output under ignored
`build/cache/diff-preprocess/`. Reuse binds content hashes, the literal include
closure and search-path inventories, tool/configuration identities, and the
inherited environment. Unsupported directives, include mechanisms or volatile
macros use fresh preprocessing. Source classification is recomputed from current
source and expanded bytes; an end-of-run check rejects input drift. The requested
producer, including all members of its compilation group, always preprocesses
and compiles freshly. The summary reports reused and fresh CPP inputs.

When several already prepared candidates need focused diagnostics on the same
stable inputs, use `node tools/diff.js --batch <symbol> <symbol> ...` (optionally
`--profile`). Each distinct requested producer preprocesses and compiles once
fresh; all requested targets share one production link. Group members stay
together. This does not change assignment ownership or public scratch group
admission. Single-symbol commands retain their existing behavior.

One batch reserves one shared build plus its additional diagnostic records. Its
claim covers every requested producer member, rejecting overlap with active or
crashed single/batch claims. Retention preserves each producer's authored/input
pair and each requested target's report in one shared output. Any member reference
protects the entire output; retention still provides no deletion operation.
Complete nonmatches produce honest per-target diagnostics and `allExact: false`;
their command completion is not matching acceptance. Compilation, validation or
final identity failures preserve available partial evidence without replacing
latest target reports. Latest report publication is per-file, not atomic across
the batch; each published member references the completed immutable batch manifest.

Cache reuse is a development optimization only. `verify.js` and CURRENT
verification do not import either cache; they independently perform the fresh
final recompilation and complete-ROM check at wave completion and remain mandatory.
The diff's internal development link remains necessary for relocated target-byte
comparison. It does not authorize a separate final ROM build or full verifier per function.

Use the instruction diff to make one evidence-driven source change at a time.
Source order, control-flow shape, integer widths, expression grouping,
temporaries, and live ranges can change the old compiler's output. Do not force
register allocation with assembly.

Generated diff reports and compiler outputs are ignored evidence. Do not commit
them.

Use evidence from the current invocation. A failed diff can leave an older
`build/diff/<symbol>.json` unchanged. Preserve the failing command's output and
available `--profile` report; do not attribute the older JSON to that attempt.
Before recording a candidate, confirm the report identifies the current source
and compiled artifacts. Process exit and scalar diagnostic scores do not prove
linked-byte equality or a matching relocation contract.

#### When matching ideas run out

Exhausting the current experiment list does not finish or suspend the assignment. The worker
retains the complete wave and changes its investigative approach. A no-lead reply from
Claude/GoldOx, a plateau, or inability to identify the exact original source statement is not
by itself a blocking dependency.

Preserve the best candidate and useful intermediates, then revisit the unresolved mismatch,
the assumptions behind closed hypotheses, relevant target/caller/data evidence and current
research intake. Consult the worker-lifetime paired Claude session through `tools/consult_claude.py`
with a specific question and the source-bound
evidence that makes it useful. Continue independent reconstruction while awaiting that reply;
consultation is not a blanket stop. The worker and Claude choose the next meaningful source
hypothesis or evidence question. The Director handles repository, service, coordination and
tooling decisions rather than choosing matching experiments.

A plausible hypothesis grounded in available evidence is enough to try ordinary C within
the accepted contracts. Proof of the original statement and a complete compiler explanation
are not prerequisites. Preserve uncertainty and informative temporary regressions. Do not
manufacture activity by repeating trials already shown equivalent without a new discriminator,
adding arbitrary pressure, or weakening source-policy or acceptance rules. If the current
route is exhausted, investigate another assumption or evidence question within the assignment.
Use the existing cursor and research records; no per-trial report, approval or new helper is
required. A no-ideas stop does not authorize handing the worker's matching work to the Director.

Hold only the affected operation when Joe pauses it, a shared-input/native drain is active,
an applicable fail-closed rule requires it, or a concrete external input, tool, service or
Director decision prevents further authorized work. Record the exact dependency or rule,
who must take what action, and the observable release condition in the existing cursor;
continue unaffected authorized work. "Need more ideas" or "need the original statement"
alone does not establish such a dependency. A proposed tooling remedy retains the existing
Sol/Claude agreement, Director approval, audit and independent review requirements.

When an existing native thread stop/attention watcher reports an unfinished active worker stopped, the
Director checks the cursor, process state and any actual hold. If it stopped only for lack
of ideas, resume that same assignment and its worker/Claude investigation. Do not convert
the stop into an indefinite hold or replace the worker before its complete assignment is
accepted and ownership released, unless Joe directs otherwise. Preserve Joe's assigned
top-level worker role and existing watcher routing. Never resume retired/completed workers
or add scheduled tasks to provide continuity.

#### Director event continuity

After accepted consultation setup, use native Codex collaboration/thread messaging and
local thread stop/attention watchers; never scheduled tasks or heartbeat automations.
Agent Mail is no longer an operational transport for this decomp program. Preserve its
archives as read-only historical evidence; do not modify unrelated global Mail services. Internal tooling, research and review helpers require the
same reliable continuation coverage as top-level source workers.

1. At assignment, record the helper's real thread ID, role and ownership in the Director
   cursor. Reuse the existing tested thread-monitor implementation with a dedicated
   configuration/state directory for that helper and the current Director destination.
   Do not copy another worker's delivery cursor or create a duplicate process. Confirm
   the exact process, destination and fresh status, including a successful read of the
   internal thread. Keep an active collaboration wait until this route is established.
2. Give the helper the exact current Director thread identity and tested native route.
   Send one clearly labeled native startup delivery test and verify actual receipt and
   stop-watcher wakeup at that destination. Approval/scope requests and final handoffs,
   including tooling agreements, use this verified native route. Preserve durable retry
   and deduplication state. Ordinary progress and experiments remain exception-only.
3. A helper needing a decision preserves evidence, sends the concrete request, and ends
   its turn so the stop/attention monitor is a fallback. A failed send is reported through
   the other verified native route and the saved handoff; it is not a reason to wait silently. The Director
   checks the monitored stop against actual cursor/process state and reads its handoff.
   A ready implementation or review package is actionable even when other assigned work
   remains. If collaboration delivery alone cannot wake the idle Director and the stop
   watcher is the verified wakeup route, end immediately after that handoff before starting
   another patch. The Director dispatches review and resumes independent work promptly.
4. Before yielding an autonomous coordination turn, handle received completions and
   decisions, or name their concrete owner/dependency/release condition. Confirm every
   still-assigned helper has a live route. Do not infer that all work should be idle from
   the production writer's legitimate drain; advance its tooling/review prerequisite.
   A status-only user request gets a read-only answer, without treating the request as
   authorization for new edits or worker restarts.
5. On acceptance and release, stop only that helper's monitor through its owned stop
   flag, confirm exit and preserve state/history. Never resume a retired worker from
   an old event. Keep transport retries and durable event deduplication; test completion,
   attention, restart/retry and wrong-destination rejection when the transport changes.

The current reused implementation lives under
`C:/Users/Joe/.local/share/codex-thread-monitors/actor-worker-to-astra/`;
dedicated `internal-*-to-purple` directories carry current internal-helper routes.
`watch-sol.py` and `desktop-bridge.mjs` perform metadata-only observation and delivery;
the historical filename does not restrict them to source workers. Read current status
and ownership records rather than assuming an old PID is still authoritative. A watcher
alert requests Director intake, not automatic worker resumption or acceptance.

#### Record useful experiments

Routine trials need no separate plan file, journal entry or prose recap of tool output.
A short prediction in working context is enough; a competing explanation is useful when
it changes the next test, not a required template for every edit. If a trial teaches
nothing new, its existing source/tool artifacts suffice.

When an experiment changes the next useful source question, record its exact source and a
short observation through the [shared research commands](MATCHING_WORKBENCH.md). State the
starting context, source change, observed effect and remaining failure; link the relevant
evidence and parent or comparison candidate. Use identity capture to compute source,
preprocessed-input, dependency and reference hashes rather than transcribing them by hand.
The effect and interpretation remain authored claims, separate from those computed identities.
Archive discovery is read-only. When using an archived parent/comparison ID that is absent
from the local store, import its needed records first using the reference's reimport recipe;
do not migrate unrelated history merely to record a new experiment.

Keep the authored observation to a few sentences by default. Add detail only to preserve
a reproducible, decision-relevant mechanism or important uncertainty. Write it once in
the existing observation fields; link it from the cursor or handback instead of copying
it into a plan, journal, claims file and narrative summary. Generated dossiers and proof
metadata remain tool output. Do not repeat unchanged constraints, hash lists, body census
or acceptance disclaimers in every trial; link their authoritative record and describe
only a relevant change. Worse bytes can still justify a useful mechanism observation.

Preserve a small useful set tied to documented lessons: a source pair demonstrating a useful
effect and a counterexample when it distinguishes a mechanism. Use accepted canonical C for
the final example when it supplies the same evidence; do not automatically export another
"best" or final-source copy. A worse candidate can be worth keeping when the documented
comparison needs it. Export actionable sources and observations for future checkouts;
routine trials, generated assembly, dumps and bulk evidence remain ignored. Do not archive
every trial, invent a counterexample or update several status documents for each observation.
For grouped sources, retain the complete producer context and existing group restrictions;
reading a member's history does not authorize single-member import or compilation.

At handback, link those records and state the next unresolved source question. An observation,
preservation action or `selectedBest` label does not establish matching acceptance. Continue
the same linked-diff loop and complete-wave verifier; ordinary source work gains no review gate.

When a result would help another function, propose its lesson and evidence link in the ordinary
handback. The Director owns `docs/matching-c/compiler-lessons.json`; the index points to existing
measurements and interpretations rather than copying them into a second record. Supersede a
wrong lesson with the correction while retaining the useful failed experiment. Name a suggestion
actually opened and how it changed the experiment; merely displaying one is not recorded use.

#### Keep the current cursor useful

Use the worker's one live note under `docs/Plans/cursors/`, within the agent guide's budget.
At a meaningful best-source change, blocker, wave completion or handoff, replace its current
state: active and parked targets, best source, next discriminating experiment, applicable proof
or provisional status, and unresolved gates. Link the full roster, source observations and wave
plan. Generated status owns counts. A historical note referenced by hash remains byte-for-byte
unchanged; designate the new cursor from the active plan instead of adding a freeze header.
Write readable sentences; meet the budget by removing repetition and linking evidence,
not by joining words or packing measurements into dense shorthand. Stop extending oversized
chronological journals and do not create replacement journals. Preserve their existing bytes;
at the next normal cursor update, point to the current best and useful research records.
Old chronology is reference material, not required reading at each resumption. This is
not a separate cleanup assignment or a reason to pause matching.
`node tests/cursor_budget.js` checks the live notes without truncating them or modifying history.

#### Reuse shared declarations

Use an existing supported header before inventing another local description. The advisory
`node tools/declarations.js --target <symbol> --json` inventory distinguishes opaque forwards,
concrete descriptions and unresolved differences; textual similarity is not layout or meaning.
Follow [the shared-header convention](../include/README.md) for new headers. Keep different
partial views, qualifiers and uncertain interfaces local until their evidence is reconciled.
For nominated header consumers, use `node tools/declarations.js --header include/game/example.h
--target func_XXXXXXXX --check --json`, repeating `--target` for the complete known set.
This is a supported textual check, explicitly `compilerChecked: false`: exit 1 reports a
conflict, exit 2 an incomplete scope or unsupported input, and exit 0 only a clean supported
subset. Pinned-compiler fixtures and canonical source checks establish the compiler facts.

For a shared-header edit, enumerate every affected producer using current dependency records
and include/source context, including grouped producers. Check all affected consumers with the
focused tools, then use one normal final verifier for the complete assigned header wave.
Do not mix the first header adoption with unfinished matching changes. Existing dependency
content hashes and include-resolution checks invalidate caches; no manual cache purge or new
acceptance cache is needed. Exact C does not establish an original unused-argument signature.

#### Diagnostic boundary

Raw scratch-object words can differ even when the linked instructions do not.
In particular, `j` and `jal` addresses are supplied through relocations. A
scratch score, CFG class, manual word comparison, isolated diagnostic link, or
workbench result labeled exact is useful only for choosing the next experiment.
None proves sole linker ownership, accepted relocation handling, final target
placement, or complete-ROM equality.

Use [the optional workbench reference](MATCHING_WORKBENCH.md) for candidate
generation, experiment history, bounded comparisons, and its diagnostic limits.
The canonical `diff.js` check remains required per target. The `verify.js` gate
remains required for the completed wave.

### 4. Review relocation evidence

Load-relevant relocation equality is part of acceptance because the repository
must support later source modifications, not only reproduce one historical byte
sequence.

For a newly activated target, `diff.js` may show
`Relocation contract ........ MISSING` and print the candidate relocations. This
is expected discovery output, not acceptance. Review the object and linked
result, then add the smallest exact per-target entry to
`config/matching-c-linkage.json`. Use an explicit empty relocation list when the
reviewed object has none.

Do not guess a relocation from disassembled instruction text or copy another
target's record. Internal absolute `j`/`jal` relocations normalize to `.text`.
External function and data symbols must resolve through the shared registry or
an actual linked definition. Exact final bytes with a different or missing
relocation contract are not an accepted mod-ready pure-C replacement.

Rerun `diff.js` after adding the reviewed contract. Strict verification fails if
the entry is absent or if the compiled object later changes.

An explicit canonical entry governs the current source even when its relocations
differ from the frozen `config/phase8/matching-c.json` record. For example, replacing
an inline-assembly address with a C symbol reference can add real HI16/LO16 records
while preserving every linked byte. Keep the frozen record unchanged; it is the
fallback only when no canonical entry exists. Compatibility reports retain the
actual historical equality as `canonicalLegacyEquivalent`. This does not relax
current-contract versus emitted-object equality, shared absolute-symbol bindings,
source-object reproduction, ownership, placement, or retail-byte gates.

### 5. Record a provisional target and continue the wave

When the linked diff is exact, run:

```powershell
node tools/source_policy.js --target <symbol>
```

Use the canonical diff report from the current source to confirm linked-byte
`EXACT`, mechanical `PURE_C`, and a matching reviewed relocation contract.
`diff.js` can complete while reporting differences or a missing contract;
successful process exit alone does not establish these conditions.
The diff already records mechanical source classification; a separate policy
command is useful when that evidence needs a focused refresh.

Record the source and evidence under the assigned commit policy, then continue
with the next wave target. Describe this result as a provisional candidate with
an exact linked diff. Do not report accepted matching C or advance accepted counts.
Recheck affected candidates when later source or dependency changes invalidate their evidence.

Do not run `build.js`, `verify.js`, `verify.js --target`, or equivalent full-ROM
acceptance commands after each function. A difficult or blocked member remains
unfinished; it does not silently reduce the wave's completion scope.

### 6. Verify the complete wave

After every assigned wave target is ready, run the complete verifier once:

```powershell
node tools/verify.js
```

For changed inputs the verifier launches one fresh build in an empty output directory,
independently classifies sources, and then:

1. authenticates the baserom and pinned toolchain;
2. resolves the accepted structural owner uniquely;
3. compiles the source and recreates its source-to-object proof;
4. excludes the original assembly target;
5. proves sole C-object ownership in the linker map;
6. checks address, size, and reviewed load-relevant relocations;
7. compares the final linked target bytes with the baserom; and
8. compares the complete rebuilt ROM byte-for-byte with the baserom.

The independently checked source/object/link lineage, ELF-file-to-ROM payload binding,
complete linker-input census and final input/output seals establish freshness without a
second compiler pass. Construction reports are unverified; only the verified companions
and final CURRENT state establish acceptance. `tools/build.js` produces construction and
does not publish acceptance. Decoded instruction comparisons remain development/mismatch
diagnostics; ordinary success records that they were not run, without inventing a score.

Build/status consumers may report unchanged accepted state without claiming a fresh run.
An actual verification request launches the fresh chain; saved companions cannot mint its
freshness. Use `node tools/verify.js --fresh --profile` for an explicit fresh-build measurement. Measure the whole
normal command, including preparation, build, independent checks and publication; never
report a reuse hit as a fresh build. The engineering goal is under five minutes. Initial
missing-baseline setup and the structural audit are separate costs, not omitted from their
own reported totals.

Confirm every assigned wave target is present and `PURE_C` in this run's
authoritative source-policy report. Use that same report and final ownership,
placement, relocation, target-byte, and complete-ROM evidence for all wave members.
The normal complete command reports `RESULT: EXACT BASELINE`; that result alone
does not establish the requested source class of every wave member.

Do not loop `verify.js --target` over wave members. One final report covers the complete wave.
Do not use global `--require-pure` when the accepted baseline contains legitimate hybrids.
For a standalone one-function wave, `verify.js --target <symbol> --require-pure`
can replace the one final command; it must not be followed by a duplicate full verifier.

### 7. Integrate the completed wave

Preserve unrelated work in a shared checkout. Record the verified wave without
an independent source-review gate. Before staging a completed wave, curate its research:

- Every candidate C file needs a useful documented lesson or a required comparison/parent
  role in one. Wave membership, a successful match or an export command is insufficient.
- Prefer canonical C for an identical final example. Keep the smallest set that actually
  demonstrates each lesson, with complete producer context; do not keep routine trial chains.
- Check incoming file and candidate-ID references before pruning. Remove obsolete companion
  dossiers together, or preserve their useful prose and migrate links to the retained example.
  Preserve live authenticated observations and their required controls unchanged; do not rewrite
  identities to hide missing evidence. Historical census lists are records of their date, not
  a requirement to retain every old working-tree path forever.
- Check the retained lesson/reference closure with the existing research checks, then inspect
  the explicit staged file list. No new archive registry, approval gate or full-ROM run is needed
  for documentation-only curation.

Before recording any scoped commit, inspect:

```powershell
git diff --check
git status --short --branch
```

The final report must identify the exact verified source, tool, and link inputs.
A commit or unchanged handoff alone does not require another build or verifier.
Integrate the completed wave onto the newest accepted canonical base.
If integration changes the verified inputs, run one complete verifier on that
combined final state before acceptance or publication. Do not integrate unfinished
individual candidates as accepted results.
Do not repeat unchanged completed-wave verification solely for independent review.
Separate structural, tooling, or semantic assignments retain their required review.

Commit only the source and smallest necessary configuration or evidence change. Git is
the integration record; ordinary matches do not need promotion manifests,
checkpoint receipts, frozen accepted trees, or separate review packages.

### 8. Start the next wave with a fresh worker

Maintain Joe's assigned number of top-level matching workers on disjoint complete waves from the existing assigned program,
with private candidate ownership for each and a separate dedicated production integrator. The Director owns
finding the next complete dependency-ready assignment whenever a slot opens; do that work
immediately, using an explicitly assigned retrieval helper when useful. An unrelated unfinished
wave is not a staffing dependency. Resolve ownership before dispatch, preserve assigned
top-level roles, and confirm the new worker's turn actually starts. A real shared-input drain
holds only affected native commands; continue useful authorized private preparation. If a
second assignment is genuinely blocked, record the exact dependency, owner and release condition
in the existing cursor; do not manufacture activity or expand the program to fill a slot.

After normal acceptance of the complete assigned wave, the Director starts a fresh matching
top-level worker using `gpt-6.1-sol` with reasoning `xhigh`. Preserve the dedicated integration thread
and the other workers' private candidate ownership. Use subagents for bounded research,
tooling and review. Do not fork the outgoing conversation's full history.
Release its source/private-root ownership before reuse, stop its retired watchers, and attach
the replacement's own native message and stop monitoring without copying delivery state. A private
candidate packet alone is not wave acceptance; coordinate its normal production integration
before treating that wave as completed. Do not give a matching worker another wave's integration
or verification assignment; its unfinished matching assignment remains with that worker.

The new worker's initial prompt must start work immediately and include:

- required parent/repository reading, role, sole writable root and protected shared inputs;
- the next complete wave's membership/dependencies, links to all parked obligations, and the
  current accepted input/proof identity without repeating unchanged verification;
- recoverable best sources, a small useful set of source pairs/counterexamples and current
  research-intake commands; publish reusable private observations through the existing shared
  research commands and maintain the lesson index without creating another archive;
- the concrete first target/experiment and the existing concise continuation note;
- inherited worker identity, its paired Claude wrapper instructions and the verified native
  route to the exact current Director thread with tested stop/attention wakeup. The Director
  is Astra and owns infrastructure approval; independent exact-code review remains separate.
  A specific stuck question goes to the paired Claude session; ordinary matching does not
  wait for routine review;
- the normal one-target loop, concurrent private checks, complete-wave verifier, and the
  exception-only reporting policy in `AGENTS.md`.

The Director owns this handoff and monitor transfer; workers do not create successors or send
routine progress messages to each other. Preserve knowledge through the existing records and
compact cursor, not a growing conversation replay or a new handoff protocol. If useful private
research is ready before the wave, the production writer may publish it in a small batch without
claiming acceptance or pausing unrelated checks for documentation alone.

Ordinary matchers must not edit shared tooling. Route independently justified representation defects
to a separate structural/tooling assignment with its applicable audit and independent review.
The remedy must preserve generic invariants and adversarial rejection. A single target's success
does not justify symbol-specific bypasses, fabricated bytes, or source-policy/compiler exceptions.

For that separately assigned tooling work, also run the required routine tooling manifest:

```powershell
node tools/test.js
```

Use `node tools/test.js --list` to inspect its explicit suite list. The routine
runner is not a canonical build, complete-ROM verifier, or structural audit, so
it supplements rather than replaces `verify.js`.

Run `node tools/status.js` after a valid verification state to derive current
`PURE_C`, `HYBRID_C`, and remaining-owner counts. Do not copy changing counts
into prose documents.

## Private candidate workers

The Director assigns each candidate worker a separate complete wave and one short ignored directory
under `build/matching/`, preferably using less-related families. Each worker owns one target at a time.
Before dispatch, preflight the chosen path through `resolvePrivateWorkspace` in
`tools/lib/matching/private_workspace.js` without starting native work. Its current guard requires
a nonreserved lowercase basename of at most24 characters and a resolved root no longer than120;
the validator remains authoritative. An invalid assignment path is a Director scope correction,
not grounds to weaken the guard or replace the unfinished worker.
Keep the original complete wave and any coupled producer, required bodies,
table ownership and dependency gates intact. Work in the same checkout on `main`; no worker branch,
worktree or rebase is needed. The production writer alone integrates into `src/`, shared headers and
configuration, publishes selected research, and runs canonical linking/verification.

Joe's additional candidate worker runs in a separate top-level Codex chat under the Director's
monitoring and coordination. Routine progress, stop notifications and blockers go to the Director,
not the production writer. The Director relays only actionable integration or shared-input
coordination. Do not attach this worker as a child of the production writer.

For an assigned root such as `build/matching/actorhelper`:

```powershell
node tools/match.js intake func_002158E4 --scratch-root build/matching/actorhelper
node tools/match.js watch func_002158E4 --source build/matching/actorhelper/candidate.c --scratch-root build/matching/actorhelper --json
node tools/match.js probe func_002158E4 --source build/matching/actorhelper/candidate.c --scratch-root build/matching/actorhelper --passes rtl,flow,global-allocation,delay-slots --json
```

Read current intake, the full disassembly and required-body coverage before tuning. Private source,
observations, database, snapshots, compiler/probe outputs and reports stay in that assigned root.

For private checks that must continue during ordinary canonical integration, the production owner can
capture a currently verified input set with `node tools/match.js capture-inputs --output build/inputs-v1`
(the destination must be new). Capture authenticates existing CURRENT and companions; it does not build
or repair them. Mutable configuration, active source/include and research data are copied once.
Tools, original assembly/raw data, normalized ROM and the versioned accepted output remain authenticated
references. Preserve those references while a worker uses the set.

After reviewed installation of only `tools/lib/diff_preprocess_cache.js` and/or
`tools/match.js`, the sole production writer may run `node tools/match.js refresh-inputs
--from <parent.json> --from-sha256 <recorded SHA256> --replace <logical-tool-path=reviewed SHA256>
--output <new sibling.json> --json` (repeat `--replace` for both). First drain in-flight
shared-tool users and verify installation preimages. Exact-code review must establish unchanged
enrolled dependencies, runtime and canonical contracts; path/hash eligibility is not approval.
The constructor binds the parent, three unchanged implementation anchors and copied/live verified
state, then exclusively writes a sibling sharing the existing `data/`. Only the named records'
bytes/hashes change; all other expectations remain historical. It certifies neither full selected
closure nor CURRENT acceptance. Release uses reviewed installation and bounded construction;
each worker's next normal command retains its own strict opening/runtime/proof/closing checks.
Use full capture for broader changes or independent storage. Preserve parent/data while any sibling
is active. Failed/interrupted output is retained and never reported as success by that invocation;
a complete unreported artifact may still pass unchanged consumers. No acceptance marker is added.

### Complete-wave preparation and immutable private tool selection

Before dispatch, run `node tools/match.js preflight <all wave symbols> --inputs <manifest>
--scratch-root <private root> --output <new ignored report> --json`, using the selected bundle's
`run.ps1` in place of `node tools/match.js` for v2 inputs. This guarded command constructs the actual
diagnostic target and compiler preparation session for every target without a candidate, compiler
invocation, SQLite write or full-ROM build. Only `prepared` for every assigned target passes;
duplicates, aliases and target-local failures remain explicit. Shared prerequisite failures prevent
dependent preparation. The report proves neither C classification nor emitted-body, table or
relocation coverage, exact target bytes or matching acceptance.

The production writer publishes reviewed code with `node tools/match.js publish-tools
--reviewed-patch-sha256 <SHA256> [--source <complete reviewed code root>] --json`, then captures selected data with `capture-inputs
--tool-bundle <version> --output <new ignored directory> --json`. This records provenance; the hash
argument does not itself constitute review approval. An explicit source root must contain the entire
reviewed execution closure; publication never fills missing dependencies from live code. This lets
a future private version be published while prior-version workers run. Share one content-addressed bundle between
workers. Its launcher admits only explicit selected private commands; it cannot build or certify
CURRENT. V1 live inputs remain supported; v2 requires its exact bound bundle. No implicit migration
or live implementation fallback is allowed. Hash-only historical tool evidence is copied into
selected data, outside loadable bundle code; it must never be imported or spawned.

Adopt a new version only after that root's command has finished. Separate roots may use A and B
concurrently. Existing drains still apply before referenced shared runtimes, original inputs or
accepted outputs change. Keep old versions and selected data while referenced by active workers or
needed research; retirement requires recoverable reviewed source and the normal safe-cleanup and
research-reference checks. This is trusted-local-operator integrity, not a sandbox against an operator
who can rewrite tools, manifests and pins. The already executing Python guard is trusted; its
pre-child identity checks complement sealed Node reads, runtime pins and closing checks.

Add `--inputs build/inputs-v1/manifest.json` to guarded `preflight`, `intake`, `history`, `best`, `watch --source`, or `probe --source`.
No other command/flag branch supports selected inputs, including `preserve`,
`probe --candidate`, and `--research-compiler`. Watch/probe authenticate actual selected reads, dependency identities,
directory membership, accepted proof and physical set identity. Read-only intake authenticates
its consumed metadata, complete original-ASM symbol/owner census, canonical ROM, required
source/research dependencies and executed repository code. It uses the same target-selection
rules, but does not replay every active representation or certify all selected files/CURRENT.
Its accepted fingerprint is historical selection identity, never fresh acceptance. Required
consumed-input drift aborts before output; optional uncaptured historical references remain
unavailable. The per-invocation reader retains authenticated in-process bytes and closes with
content/path/directory checks; subprocess preprocessing retains its actual expanded-output,
dependency and include-resolution checks, not a claim of race-proof filesystem snapshots.
Research Python guard/store launches isolate user import configuration while retaining the
existing trusted configured Python/OS runtime boundary; no whole-Python installation or
unused PowerShell runtime certification is claimed. Tool implementation changes continue to
change model/candidate IDs and can make historical observations target-mismatched. A missing/drifted
required selected input aborts; an uncaptured historical research reference is explicitly unavailable.
There is no fallback to live mutable bytes. Location-sensitive preprocessing must still agree with
accepted inputs and authored/snapshot expansion. Results include the selected input-set identity and
remain private diagnostics, never acceptance.

Intake alone checks the scratch root, SQLite companions, guard ticket and consumed input paths
without recursively inspecting unrelated scratch descendants. Its research source check uses the
pinned preprocessor at the actual authored-source location and repeats preprocessing before
publication. Exact expanded bytes and complete logical dependency identities must agree; source,
header, runtime, metadata, reference and manifest closing checks remain mandatory. Configured
repository include-directory closure is retained. An earlier shadow header changes the dependency
identity even when its bytes agree. Unread descendant membership and output-identical unconsumed
availability changes are outside this diagnostic seal. This grants no native compilation or
matching acceptance; strict private commands keep their existing workspace checks. Interrupted
processes may leave a regular ticket; the existing mutex and drained Job Objects, never the ticket
or a PID guess, authorize recovery.


The Director records each active manifest in existing cursors. Refresh one worker explicitly after
draining that root, retain its best source/old evidence, and preserve the previous input set until all
users release it. Snapshot capture/selection adds no per-function full-ROM verification or new scheduler.
An archive alone does not keep published research references readable. Retain their needed files at
resolvable paths, or deliberately migrate them with the existing research mechanisms and validate the
current curated-reference closure before removing the old paths. Retained historical evidence does
not resume its former worker or make that root active scratch.
Supported commands are `intake`, `watch`, `classify`, `compare`, `inspect`, `history`, `best`,
`observations`, `import`, `preserve` and `probe`; other commands reject `--scratch-root`. Preserve is
an explicit tracked publication operation reserved to the production writer by assignment, not an
automatic side effect of testing. Do not copy databases to share discoveries. Use the existing
research commands and normal tracked intake for useful best sources, effects and counterexamples.

Ordinary private `watch --source` and `probe --source` now use a target-scoped
candidate diagnostic against one historical accepted baseline. With `--inputs`, that
baseline is the selected state; otherwise the command selects verified CURRENT at
entry. It never constructs a new canonical CURRENT or treats a private result as
matching acceptance. The report records the historical fingerprint, actual consumed
input identity, fresh compilation and `currentAcceptanceCertified: false`.

The command validates authentic state/build/verification/fresh companion identities
and original target/producer cardinalities, then the complete relevant owner/body
contracts, original ASM, canonical ROM bytes, and actual accepted ELF/control/proof
inputs. It classifies and compiles only the authored candidate and snapshot. It does
not reclassify sibling sources, hash unused accepted objects, reverify the rebuilt
ROM, or recursively inspect unrelated scratch history. A changed unrelated source,
unused object, or historical run is outside this diagnostic boundary. Full source
policy, sole ownership, placement, relocation, exact target and whole-ROM gates
remain at complete-wave canonical acceptance.

Only approved repository `include/` dependencies are supported. Fresh preprocessing
at authored and snapshot locations must yield identical expanded bytes and logical
dependencies, and repeats before completion to detect used-header changes and even
same-bytes include shadows. Ordinary candidate diagnostics require PURE_C and a fresh
native compile on every invocation; they do not reuse compiled candidate verdicts.
Explicit research-compiler probes and other nonordinary routes retain their separate
existing contracts. Research retrieval is available through `match.js intake`; it is
not embedded in the default native check's result.

The bounded diagnostic adapter supports ordinary complete physical owners and their
supported existing text contracts. Coupled, partial, split, atomic or auxiliary
producer shapes it cannot hydrate completely reject without falling back to a full
model/source census. A complete ordinary inactive-ASM producer can still yield honest
raw/symbolic evidence with isolated linking explicitly unavailable. Terminal-tail
fallbacks requiring the full original-ASM collision census are explicitly unavailable
in this private scope; canonical tail admission retains that census unchanged.

Each root retains one authenticated command/ticket, mutex and Windows Job Object.
Opening and closing checks cover consumed/written paths and ancestors, selected
inputs, actual tools and loaded repository code, generated native artifacts, and
DB/control/sidecar paths. They do not traverse unrelated descendants. Relevant input
and fresh CPP close precede completed report/store publication; DB/sidecar/output
path checks run inside the rollback-capable completion transaction. Rejected close
publishes neither a completed report nor a history/best result. An acknowledgement
lost after a valid committed transaction is distinct from rejected close. No check
claims continuous observation of transient external filesystem changes.

Selected historical inputs remain usable as live CURRENT advances; used referenced
tools/outputs must remain stable and changed-tool installation still drains affected
users. The wider diagnostic change is ineligible for the narrow CLI-only input
refresh constructor. Installation requires fresh accepted-state/capture and the
applicable audit based on functional verification changes, not filename hashing.

`watch` and `probe` default to `--native-concurrency parallel`. Workers in different private roots
can compile, probe and compare at the same time without permission for individual checks. Each root
still permits only one live command; a second command in that root fails with `busy` and can be retried
after the first finishes. Its OS-owned guard and Job Object retain process cleanup and containment.
The returned `nativeConcurrency` describes the current command's scheduling mode, including when it
reuses an authenticated cached object; it does not relabel the original compile's provenance.

Use explicit `--native-concurrency serial` only as a coordinated fallback for host contention.
All participating private workers must select it: serial commands wait on each other, but do not
exclude parallel-mode commands, ordinary `diff.js`/`verify.js`, or another checkout. The serial wait
is bounded to five minutes; parallel mode has no cross-worker queue. Input authentication, drift
rejection and every comparison gate are identical in both modes. An interrupted or rejected check
retains its candidate and supplies no completed verdict. Do not clear locks by PID/age or kill another
worker's processes. Report actual timings; concurrency alone does not imply a speedup.

Private handback identifies the source, run/artifacts, complete body/extent evidence, source class,
actual relocations, expected-evidence availability and remaining mismatch. Keep `rawExactBytes`,
`rawRelocationMaskedExact` and `diagnosticExactBytes` distinct. Only an available authenticated isolated
link supplies private linked diagnostics; inactive ASM owners may have symbolic-object evidence only.
Use `actualRelocations` and `rawObjectComparison.relocationEvidence` for the emitted relocation census;
the linked comparison's top-level relocation availability may be false because linked bytes contain
no relocation records.
Null/unavailable evidence cannot become an exactness claim. Even an exact isolated link is provisional.

Use an available authenticated private linked comparison for the early linked-diff development check.
Do not pause sibling workers for an ordinary provisional candidate or require a canonical activation
after each function. Keep live canonical inputs stable for checks without `--inputs`, then batch the production
focused checks into the complete-wave integration period. Where private linked/full-owner evidence is
unavailable (including inactive ASM or unsupported grouped/auxiliary owners), report the partial verdict
honestly and arrange the necessary canonical check before relying on the missing evidence; batch those
exceptions where practical. Raw/masked equality never substitutes for linked bytes or full-owner coverage.

For combined integration or a necessary shared tooling/header/configuration change, the Director stops
new live-input commands and drains those in flight before the production writer changes their inputs.
Explicit selected-input checks can continue through ordinary source/header/configuration integration and
canonical verification. Changes to their referenced tools, original inputs or accepted outputs still
require an affected-user drain; preserve those references until the selected set is released.
Workers may continue private edits and reasoning. Unexpected shared-input drift rejects the check;
refresh affected context and retry after the inputs stabilize. No automatic rebase or unchanged
acceptance repeat is needed. A shared-input failure is not evidence that the candidate C failed.

Integrate candidates sequentially and check their actual production source/include context with the
normal focused diff. After every member of the original assigned wave is ready, run the normal final
verifier once on the combined result, without a preceding redundant build. Private native commands
using live inputs remain stopped throughout that verifier. Unsupported grouped/auxiliary scratch targets stay serial;
do not invent missing relocation expectations or controls to make a target eligible.

An unrelated unfinished wave does not delay a complete, dependency-ready wave. The Director schedules
that ready wave with the dedicated integration thread for source reconciliation and final
verification. Keep unfinished candidates from other waves private and their workers matching.
Real interface, table and structural dependencies must still be resolved before affected integration.
When shared inputs stabilize, each worker refreshes only its affected context and resumes private checks;
there is no per-function integration pause or requirement to rebase a Git worktree.

Keep one compact current note per worker. A candidate-only helper keeps its note in its private root;
the Director handles its continuation and relays integration-ready evidence. The production writer
keeps the existing production cursor. The
[parallel candidate plan](Plans/parallel-candidate-workers-20261002.md) records rollout evidence and
limits; it adds no ordinary matching review or promotion protocol.

## Advanced linkage contracts

Most targets need only one compiler-emitted text function. A reviewed linkage
contract may additionally handle any of these established cases without
rewriting compiler instructions or data:

- one logical C target gaplessly replacing multiple contiguous preserved text
  owners under `config/matching-c-multi-owner.json`;
- multiple compiler-emitted local functions that gaplessly partition one
  accepted text owner; or
- read-only compiler-emitted switch-table fragments assigned to one accepted
  auxiliary row, interleaved with explicitly contracted retained original assembly.

Such a contract must pin the complete symbol or fragment census, section shape,
alignment, bytes, hashes, load-relevant relocations, placement, and ownership.
Local functions do not become new accepted owners or exported aliases.
C fragments and explicit retained ASM intervals must cover the complete auxiliary row in order without gaps or overlaps.
Only the first fragment may retain an exterior prefix; only the final fragment may retain the single exterior tail.
Noninitial fragments may contract an immediately preceding interval through `preservedInteriorBefore`.
Retained interiors support literal data only: the whole original row must have no nonempty REL/RELA sections targeting it.
This restriction includes relocations outside the retained interval; generated retained objects must also have no actual relocations.
Retained bytes remain ASM, not compiler padding or matching-C progress.
See [the accepted retained-interior contract](AUXILIARY_INTERIOR_ASSEMBLY.md) for its full restrictions and review evidence.
Tooling acceptance neither activates a production owner nor accepts an unfinished matching wave.
Writable, executable, conventional `.data`/`.bss`, uncontracted
tails, and rewritten compiler output reject.

The production path retains the exact authenticated KMC input at the target's
source-relative path, the untouched `<symbol>.compiler.s`, the section-assigned
`<symbol>.s`, the raw GNU 2.6 object, the stripped link input, and a
deterministic source-object proof. Strict verification independently
re-preprocesses the authored source, reauthenticates every dependency, and
recreates that proof. See [the source policy](SOURCE_POLICY.md) and
[the toolchain reference](TOOLCHAIN.md) for the detailed compiler-assembly
contract.

## Naming sidecar

Naming does not gate a machine-code match. Use exactly these evidence classes:

1. `CANDIDATE` — an external lead; never a canonical build name.
2. `SUPPORTED_ALIAS` — independently supported by static evidence.
3. `CANONICAL` — established by runtime evidence, controlled mutation, or
   recognized SDK/library proof.

During matching, inspect the body, callers, callees, strings, and data accesses
for a possible `SUPPORTED_ALIAS`, but leave the build symbol address-named when
evidence is insufficient. Only a `CANONICAL` name may replace it. Perform a
canonical rename as a scoped semantic change and rerun the linked diff and
source-policy checks. Include its complete-ROM proof in the final wave verification.

## Stop or change workflows

Stop the ordinary loop and report the concrete evidence when:

- the baserom or pinned toolchain cannot be authenticated;
- the accepted owner cannot be resolved uniquely;
- the boundary, overlay, placement, executable classification, or linker model
  appears wrong;
- original assembly may still be linked or C ownership is ambiguous;
- target placement, relocation structure, target bytes, or full-ROM bytes
  differ at a claimed completion point;
- source classification is `UNKNOWN`; or
- a semantic claim exceeds the available evidence.

Open a structural task for structural changes. Keep a nonmatching pure-C
reconstruction clearly labeled outside the exact baseline. An exact
`HYBRID_C` fallback is final for a pure-C assignment only when the function most
likely requires assembly inherently or a genuine pure-C attempt has a concrete,
documented blocker. Size, scheduling difficulty, or exact hybrid bytes alone are
not sufficient.

For a modified game, begin from a known-exact retail baseline, make the
intentional change, and use changed-byte, layout, and emulator/runtime tests.
Modified-ROM acceptance must not require retail equality, and retail equality
does not prove modified behavior.

## Optional references

- [MATCHING_WORKBENCH.md](MATCHING_WORKBENCH.md) — generated candidate research,
  history, diagnostics, sweeps, and limits.
- [KMC_GCC_MATCHING_NOTES.md](KMC_GCC_MATCHING_NOTES.md) — reproduced,
  target-scoped compiler matching observations.
- [templates/matching-c-agent-prompt-guide.md](templates/matching-c-agent-prompt-guide.md)
  — a concise prompt for an assigned one-function task.
- [tools/README.md](../tools/README.md) — repository tool index.

## Text representation evidence

Strict outputs use linkage schema 4, source-object proof 4, layout 2, and build/verification/manifest 5. Each target carries independently derived textContract, objectEvidence, and linkEvidence. Stale outputs must be rebuilt. CURRENT fingerprints use version 7; verified state and fresh compilation use version 5.

Ordinary section assignment and existing auxiliary contracts retain their behavior. The bounded nativeTextTail descriptor permits untouched compiler assembly with a 1132-byte function inside its 1136-byte, 16-aligned native text owner. The four zero bytes must come from assembler alignment. Full-owner bytes, sole ownership, relocations, and the entire ROM must still match. The art routine `func_00204A70` is active in the canonical target registry.

Shared-header compatibility defaults to current version-5 evidence on both sides. Use `--historical-v3-v4` only for the retained historical migration; it cannot bridge older evidence into version 5.

## Compilation-group workflow

General compilation-group tooling does not activate a source wave. A separately assigned source wave must activate every group member together and retain all existing owner boundaries and public entries. Activation is provisional until the complete wave passes the canonical verifier; ordinary activation under accepted contracts requires no additional independent source review.

Edit the group's one authored translation unit, then run `node tools/diff.js <member>`. The diff compiles the requested member's whole group once. Unchanged sibling groups use one authenticated producer cache bundle, with member views validated against that bundle. Cache schema 4 includes group contracts, all authenticated source dependencies and producer implementations. CURRENT fingerprint version 7 includes the group registry.

The canonical diff compares the selected complete owner and freshly links all active members. Group admission requires its reviewed raw text and relocation contract. Changing that contract is explicit provisional source-wave work; failed producer checks must not be described as an exact diff. The optional standalone workbench rejects grouped members until it supports complete group candidates.

Strict verification recreates group artifacts and retains separate member proofs. One group object contributes each accepted owner section exactly once. A complete wave receives one final verifier; neither tooling acceptance nor a successful isolated group fixture accepts production members.

The deferred historical storage pilot is not authorized by consultation cutover. Its old
Mail-based operator-GO protocol cannot be used after cutover; a separately scoped, reviewed
native authorization correction is required before any pilot execution.

### GLOBAL owner-functions with an ordinary readonly fragment

The distinct compilation-group mode `native-text-owner-functions-readonly-fragment-projection`
admits a complete GLOBAL function producer across complete physical owners, including multiple
functions in one owner, with one ordinary shared-row switch-table fragment. Its auxiliary envelope
names the actual `functionSymbol` and containing `memberSymbol`, compiler table label and
alignment directives. Every table destination and text reference must belong to that function.
The complete logical registry, owner/function partitions, native relocation order and cross-function
HI16/LO16 guards remain mandatory. Activate the complete producer together, with no duplicate
standalone provider. This mode does not change legacy owner-functions, composed whole-row,
standalone LOCAL-entry or bundle contracts.

Compiler assembly remains unchanged. Preserve raw, text-projected, projected and stripped objects,
their complete section/symbol/relocation censuses and deterministic projections. New-mode evidence
uses text schema12, object schema20 and composition schema7; replay authenticates all artifacts,
implementation identity, source-policy input, exact linked map/relocations and ordinary retained-row
custody. Cache hits require the same text-projected intermediate as direct compilation.

Ordinary shared-row contributors from different archive chunks may pair through one uniquely
authenticated boot-initialized data slab only when the existing boot pairing predicate accepts
every complete contributing text slice against the actual auxiliary owner. Accepted source/chunk
identities and model/config agreement remain required. Existing loader-DMA admission and bundle
rules retain their separate contracts. Ordinary cross-chunk overlay fragments additionally require one independently authenticated descriptor, complete physical-owner containment and both ROM/RAM endpoint equations. Descriptor authority is constructed once only when needed during a shared-row validation; bounded candidate checks do not acquire global descriptor work. Replacing an old final table requires removing its tail and
proving the new interior/final tail; rebuild retained-literal evidence against the resulting interval
without changing original-ASM literal payloads or their configuration.

### Mixed native readonly producers

A complete GLOBAL owner-function producer may use the strict `native-text-owner-functions-mixed-readonly-fragment-projection` contract when its immutable native readonly section mixes one function-attributed switch table with referenced double literals and minimal terminal alignment zeros. The native flags-1, alignment-16 envelope is permitted only by the complete mixed proof; ordinary readonly and retained-literal modes keep their existing rules. Keep native, mixed-metadata, text-projected, source-object, strip-intermediate and corrected final objects distinct. Native assembly, instruction words, table words and encoded addends stay unchanged. Only the selected table contributes C data; each literal and zero interval must remain in authenticated original ASM under the current shared-row partitions. Tooling admission is not matching acceptance.

### Complete literal runs and allocated mixed readonly producers

The explicit `native-text-owner-retained-literal-run-projection` contract preserves
one complete native producer and every complete physical C owner. Its raw text
includes exactly four native alignment bytes beyond the owned run. Those bytes
must already belong to the adjacent original ASM owner and its authenticated
logical-padding record. The original neighbor remains wholly linked as ASM; this
is an outside-owner omission, not function truncation. Native, projected, split,
stripped, cached and linked evidence distinguish raw extent, owned extent and
whole-neighbor custody. Fresh logical-registry binding is required at proof and
cache validation. Older producer modes retain their existing tail rules.

Mixed readonly schema 2 admits an allocated, nonwritable native readonly section
with alignment16, one table at offset0, exact scalar slots and optional bounded
64-byte initializer. Only the table becomes C-owned. The isolated table uses
alignment8, authenticated against the compiler's unchanged `.align 3`/`.align 2`
directives; the aggregate native section remains alignment16. This composes with
the existing equal-alignment shared-owner rule. Scalars, initializer, interior
zero bytes and neighboring original data stay ASM-owned. Schema1 remains its
existing nonallocated literal-first contract.

Initializer permission is restricted to the pinned compiler's finite leaf-copy
shape and ABI: exact source/end/destination and four load/store roles, one bounded
backedge, complete relocation/entry census, and no outside-window operand use or
write of either live pointer. Calls, indirect/external transfers, reserved
encodings, control in delay slots, terminal fall-through and alternate terminal
delay entry reject. Internal control flow remains supported. This is neither a
semantic proof nor general pointer escape, CFG or stack-safety analysis. The
restriction applies only to the initializer-containing function.

## Routine terminal-zero suffixes

`watch` automatically reports `terminalTail` for a bounded complete PURE_C body followed by
4, 8 or 12 original zero bytes. It retains the original length-mismatch verdict and separates
raw/masked body equality from linked acceptance. The complete return/delay slot, reachable
body coverage, original entry/ROM, actual native/assigned objects and relocation census must
qualify. No private command publishes tracked research or changes a registry. Unsupported
shapes remain ordinary investigation or separate structural work.

At a complete-wave integration boundary, the dedicated integrator stages current sources and
ordinary active entries, then runs:

```powershell
node tools/match.js tail-admit func_XXXXXXXX func_YYYYYYYY --apply --json
```

Omit `--apply` to inspect the freshly recomputed proposal. The command never imports a worker
registry or historical receipt. It prefers the existing nativeTextTail contract only when actual
native extent covers the whole owner; otherwise the complete original suffix stays executable
ASM under the retained-edge contract and contributes no C bytes. No original padding provenance
or numeric/runtime-reference absence is inferred. Current conflicting records fail closed.

`configuration-staged` is provisional. Run normal focused diffs, then the original complete
wave verifier and applicable structural audit. Actual provider/REL closure, original fallback,
sole custody, placement and full physical bytes remain mandatory. Strictly qualifying uses
need no new per-target structural author/reviewer package after independent generic tooling
review; exceptional shapes retain their review. No per-function full-ROM checks are added.

Historical reports remain unchanged evidence. Shared tooling installation requires affected
native drains and selected-input refresh before checks resume.

Private `history` and `best` use the same bounded target identity as native candidate checks; pass the same `--inputs` selection when querying historical selected-input results. A live-input query may correctly mark an older accepted baseline stale.


Registered terminal original-ASM text may be composed, after structural approval,
with one ordinary readonly switch-table fragment in a shared row. The generic
contract retains all native table bytes and minimal alignment zeros, authenticates
their compiler/object provenance, and uses the existing complete ordered C/ASM row
proof. It does not permit groups, projections, nativeTextTail, sourceObjectPrefix or
multiple compiler occurrences. This exceptional composition remains outside routine
tail-admit: the integrator binds current full-row inputs and runs the complete wave's
normal gates plus the applicable changed-tool structural audit.


### Complete inactive multi-owner private diagnostics

Ordinary selected-input watch/probe-source can hydrate a complete inactive ASM
span when its logical bodies and contiguous physical owners close without gaps.
One GLOBAL body or exactly one GLOBAL plus one fixed-address-call LOCAL body is
supported. The latter requires selected accepted caller object/proof/actual REL,
encoded addend, unique fixed provider and independently mapped original JAL.
Physical markers are not callable bodies or producer selections. Groups, active
multi-owner producers, padding, partial/atomic/auxiliary shapes remain excluded.
The existing single-owner successful path adds no source/object reads or scans.

Expected body and physical partitions remain separate from actual native extents.
The whole native text/tail is reported, including honest changed-size nonmatches.
Census-admissible names/order/bindings allow reporting; census-exact offsets/sizes
and byte equality are separate diagnostic gates. Identical bytes with a different
function census remain a producer nonmatch. LOCAL permission comes only from the
fresh context's immutable expectation for its exact target, rechecked on replay.
Isolated linking remains unavailable for these complete inactive envelopes.
These results do not establish canonical registration or matching acceptance.

`node tests/matching_multi_owner_diagnostic.js` runs pure geometry/census checks.
Its explicit `--native --inputs <manifest> --output <new-build-directory>` mode
runs bounded fixture compilation/replay using the same production APIs. A separately
reviewed staged-module fixture may substitute only approved existing production
module IDs and the two test IDs, with exact installed-preimage/replacement guards.
Staged results establish fixture behavior, never supported-watch lineage or
canonical acceptance. Installed checks, changed-tool audit/fresh acceptance and
one fresh capture remain required before combined release. Failure of either
single-body or composed gates blocks the whole package; no partial release.

For this new complete-owner native route, select the exact original physical
primary spelling (for example `func_002664b0`). Case-insensitive metadata lookup
still resolves the owner, but the generic workbench selector clones differently
spelled requests; a clone deliberately gains no immutable context authority.
Existing single-owner selector behavior is unchanged. Supporting cloned aliases
would require a separately reviewed resolver change, not relaxed target identity.


### Terminal-tail original interior labels

The canonical terminal-tail fallback also accepts a strict literal-word original
with an optional primary ROM-address label and inert local ROM-address labels
strictly inside the authenticated complete C body. Exact-spelling owner-label
metadata, complete original source/ROM equality and all existing coverage/tail
checks remain mandatory. This creates no compiler entry, alias or callable-body
claim; numeric/runtime entry absence is not asserted.

Admission rejects interior identity claims in the already authenticated original
source census, canonical producers/compiler functions, groups, fixed/linkage/REL
views and logical-registry names/aliases, including disjoint records. Missing
required views fail closed. Actual assigned/native complete symbol tables
(including undefined, ABS and FILE) and complete raw REL records also reject those
interior identities. Equal runtime RAM in another overlay is not identity.
Existing ordinary exact-name behavior and reads remain unchanged.

The real native original-emitter fixture must prove LOCAL/default/non-FUNC/size-zero
interior symbols at exact offsets with no symbolic REL use. Its conformance proof
is invalidated by an emitter or pinned-toolchain change; production admission does
not add an original assembly compilation. Inert labels on return/delay instructions
do not create control edges; actual edge, return/delay and complete-body gates
remain unchanged. Focused malformed/collision/native controls, independent exact
review, changed-input structural audit and complete-wave matching acceptance
remain required for installing this generic capability.

Original-emitter conformance passed for func_00263904 and func_00267670 with
the pinned STT_OBJECT(1) type: both are LOCAL/default/size-zero at offsets52
and8, respectively, with exact whole-owner bytes and no REL references.
The earlier mistaken STT_NOTYPE(0) assumption and failed fixture remain
preserved in historical evidence. This does not change the candidate/native
C symbol census or imply data storage. Unexpected emitter metadata fails
the fixture; it is not a blanket allowance for arbitrary non-function types.
