# OB64 Decomp — Canonical Matching Workflow

This document defines the ordinary function-matching loop for *Ogre Battle 64:
Person of Lordly Caliber*, US Rev 0. It uses the accepted structural model and
toolchain and keeps them unchanged.

Read [the agent guide](../AGENTS.md) first. Source classification is defined by
[the source policy](SOURCE_POLICY.md). If the work changes a boundary, segment,
overlay, placement, executable extent, linker ownership rule, or toolchain
contract, stop using this ordinary workflow and follow
[the structural audit](AUDIT.md).

## The short path

Use the agent guide's worker assignments on `main`, with one production source/build writer.
Route retrieval/data-seeking or parsing-only assignments to Sol High under the agent guide's worker-model rule.
Use [the active queue](NEXT_STEPS.md) for current worker assignments and the
[program](Plans/sequential-main-program.md) for complete family scope and real dependencies.
Do not create or use concurrent development branches/worktrees. Preserve historical worktrees as read-only evidence.
Independent read-only research/review and explicitly disjoint documentation work may proceed alongside matching.
Assign source workers separate complete waves, preferably in less-related families, under
[the private workflow below](#private-candidate-workers). Each works on one target at a time;
do not divide one function or coupled producer between source workers. The production writer
retains sole canonical integration and build ownership, with one completed wave integrated at a time.
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

#### Record useful experiments

When an experiment changes the next useful source question, record its exact source and a
short observation through the [shared research commands](MATCHING_WORKBENCH.md). State the
starting context, source change, observed effect and remaining failure; link the relevant
evidence and parent or comparison candidate. Use identity capture to compute source,
preprocessed-input, dependency and reference hashes rather than transcribing them by hand.
The effect and interpretation remain authored claims, separate from those computed identities.
Archive discovery is read-only. When using an archived parent/comparison ID that is absent
from the local store, import its needed records first using the reference's reimport recipe;
do not migrate unrelated history merely to record a new experiment.

Preserve a small useful set: the best emitted match, a source pair demonstrating a useful
effect, and the nearest counterexample when one exists. A worse candidate can be worth keeping
when it distinguishes a mechanism. Export actionable sources and observations for future
checkouts; generated assembly, dumps and bulk evidence remain ignored. Do not archive every
trial, invent a counterexample or update several status documents for each observation.
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

The verifier builds CURRENT when needed, independently classifies sources, and then:

1. authenticates the baserom and pinned toolchain;
2. resolves the accepted structural owner uniquely;
3. compiles the source and recreates its source-to-object proof;
4. excludes the original assembly target;
5. proves sole C-object ownership in the linker map;
6. checks address, size, and reviewed load-relevant relocations;
7. compares the final linked target bytes with the baserom; and
8. compares the complete rebuilt ROM byte-for-byte with the baserom.

Confirm every assigned wave target is present and `PURE_C` in this run's
authoritative source-policy report. Use that same report and final ownership,
placement, relocation, target-byte, and complete-ROM evidence for all wave members.
The normal complete command reports `RESULT: EXACT BASELINE`; that result alone
does not establish the requested source class of every wave member.

Do not loop `verify.js --target` over wave members. Each call repeats full-ROM
verification and fresh compilation of all active C replacements.
Do not use global `--require-pure` when the accepted baseline contains legitimate hybrids.
For a standalone one-function wave, `verify.js --target <symbol> --require-pure`
can replace the one final command; it must not be followed by a duplicate full verifier.

### 7. Integrate the completed wave

Preserve unrelated work in a shared checkout. Record the verified wave without
an independent source-review gate. Before recording any scoped commit, inspect:

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

After normal acceptance of the complete assigned wave, the Director starts a fresh matching
worker using `gpt-6.1-sol` with reasoning `xhigh`. Retain the current top-level/private-worker
arrangement and single production writer. Do not fork the outgoing conversation's full history.
Release its source/private-root ownership before reuse, stop its retired watchers, and attach
the replacement's own mail and stop monitoring without copying delivery state. A private
candidate packet alone is not wave acceptance; coordinate its normal production integration
before treating that wave as completed. Integrating another worker's wave does not complete
the production writer's own unfinished assignment.

The new worker's initial prompt must start work immediately and include:

- required parent/repository reading, role, sole writable root and protected shared inputs;
- the next complete wave's membership/dependencies, links to all parked obligations, and the
  current accepted input/proof identity without repeating unchanged verification;
- recoverable best sources, a small useful set of source pairs/counterexamples and current
  research-intake commands; publish reusable private observations through the existing shared
  research commands and maintain the lesson index without creating another archive;
- the concrete first target/experiment and the existing concise continuation note;
- Agent Mail connection/project key, registration under its own identity, verified Claude
  recipient `GoldOx`, and Astra's director route. Save credentials privately. A specific stuck
  question goes directly to Claude; ordinary matching does not wait for routine review;
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
Supported commands are `intake`, `watch`, `classify`, `compare`, `inspect`, `history`, `best`,
`observations`, `import`, `preserve` and `probe`; other commands reject `--scratch-root`. Preserve is
an explicit tracked publication operation reserved to the production writer by assignment, not an
automatic side effect of testing. Do not copy databases to share discoveries. Use the existing
research commands and normal tracked intake for useful best sources, effects and counterexamples.

Only approved repository `include/` dependencies are supported for private candidates. Do not copy
or shadow headers inside the private root. Authored source and the compiled snapshot must expand to
the same bytes with the same approved dependencies. Inputs are checked by content before and after
the command; changing headers, configuration, tools or CURRENT invalidates the check. Each root has
one live command; duplicate use rejects. Path aliases, reparse points and escaping paths reject.

Private context preparation reuses eligible sibling preprocessing bytes in that root's `preprocess/`
directory through the existing authenticated CPP cache. Classifications are recomputed; the requested
active producer and authored/snapshot candidate remain fresh. No classification or acceptance verdict
is cached. The first use is slower; changed shell environments can make it cold again. Watch/probe JSON
includes `preprocessCache` counters and `contextPreparation` timings. The normal verifier remains fresh.

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
after each function. Keep canonical inputs stable while both workers iterate, then batch the production
focused checks into the complete-wave integration period. Where private linked/full-owner evidence is
unavailable (including inactive ASM or unsupported grouped/auxiliary owners), report the partial verdict
honestly and arrange the necessary canonical check before relying on the missing evidence; batch those
exceptions where practical. Raw/masked equality never substitutes for linked bytes or full-owner coverage.

For combined integration or a necessary shared tooling/header/configuration change, the Director stops
new shared-input commands and drains those in flight before the production writer changes shared inputs.
Workers may continue private edits and reasoning. Unexpected shared-input drift rejects the check;
refresh affected context and retry after the inputs stabilize. No automatic rebase or unchanged
acceptance repeat is needed. A shared-input failure is not evidence that the candidate C failed.

Integrate candidates sequentially and check their actual production source/include context with the
normal focused diff. After every member of the original assigned wave is ready, run the normal final
verifier once on the combined result, without a preceding redundant build. Private native commands
remain stopped throughout that verifier. Unsupported grouped/auxiliary scratch targets stay serial;
do not invent missing relocation expectations or controls to make a target eligible.

An unrelated unfinished wave does not delay a complete, dependency-ready wave. The Director schedules
that ready wave with the sole production writer, who temporarily handles its integration and final
verification before returning to matching. Keep unfinished candidates from other waves private.
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
