# Attack visual effects — active decomp program

Prepared October 27, 2026, against `main` at `7d9a3621` and accepted CURRENT
`88F9BA72`. **Joe authorized initiation on October 27, 2026.**
The historical directory name is retained; this is the active program.

## Outcome and scope

Reconstruct the retail visual-effect programs and their shared handling code in
readable, byte-exact PURE_C. This covers selecting an effect, submitting it,
allocating/updating its tasks, loading resources, running child/model callbacks,
registering/drawing objects, and completing/releasing the effect. It includes all
retail attack-effect slots used by the current editor, rather than only Fireball.

The screenshot is a useful entry-point list, not the complete family. All nine
listed handlers and Fireball's `func_0024EE08` still use assembly in the accepted
baseline. Their current extents and assignments are in [the roster](ROSTER.md).

The [generated inventory](inventory.json) is the authoritative scope snapshot.
It binds every target to its accepted ROM extent, RAM placement, original source,
source class, complete wave, and evidence for inclusion. It is not a second live
matching-progress counter; refresh from canonical generated status as work lands.

| Scope component | Targets | Accepted target bytes |
|---|---:|---:|
| Distinct attack-program entry callbacks | 107 | 50,128 |
| Shared handling and protocol-family companions | 273 | 62,520 |
| Additional child callbacks and reached module-local support | 149 | 64,356 |
| Complete proposed scope | **529** | **177,004** |

At the initial inventory date, **25 targets / 636 bytes were already PURE_C** and are preserved.
The remaining **504 targets / 176,368 bytes** comprise 493 ASM replacements and
11 existing HYBRID_C conversions. All 107 program entry callbacks were ASM at that initial inventory date.
Counts describe accepted matching targets/complete logical bodies, not individual
source fragments or a claim that every target executes for every attack.

## What establishes the family

The normalized Rev0 ROM SHA-256 is
`571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
The main descriptor table occupies ROM `0x274870..0x274A90`: 136 pointers.
Slots **0..132** are the attack-effect domain: 133 IDs share 107 distinct callbacks.
Slots **133..135** are the separately documented battle transitions and are
excluded from this program. Sharing an entry point does not create extra functions.
The 136 three-byte metadata records occupy `0x274A90..0x274C28`.

Resolve pointers only within accepted battle overlay group **2, 4, 10, 11, 12,
13, 14**. Overlapping menu overlays and the original ASM comments' synthetic RAM
column are not valid substitutes. For example, Fireball ID8 resolves to
`func_0024EE08`, RAM `0x801FA248`, with a 364-byte body. It starts a separate
child callback, `func_0024EA70`; matching its descriptor callback alone does not
finish its implementation family.

Two additional static tables close gaps that a direct-call census misses:

- `0x25E2C0..0x25E318`: 22 words, including 19 nonzero code pointers, selected by
  typed-object/coordinate adapters. This includes table-only handlers such as
  `0024BE1C`, `0024BE5C`, `0024BEA0`, and `0024BECC`.
- `0x25ED30..0x25ED6C`: 15 animated-model callbacks. Consumers including
  `0024CFAC`, `0024DAE4`, and `0024DC20` pass a selected pointer through
  `002698A0`; `00269470` stores and calls it through object `+0x70`.

The interior switch tables at `0x275750..0x275844` also matter. Their entries
lead inside existing bodies, so they must be covered by those complete producers;
they are not dozens of additional standalone functions.

Inclusion uses these tables, mapped calls/code-address formations, shared record
layouts and lifecycle companions. It does not use mere ROM adjacency. The roster
stops at general resident math, allocation, DMA, audio, renderer, and battle-Actor
implementations. The inventory lists 51 distinct resolved external dependencies.
Combat damage/status calculations, attack-data editing, character pose programs,
cutscene directors, the three transition programs, and modified-editor wrappers
are outside this matching assignment. Existing ASM dependencies may remain ASM.

This is a complete **proposed static family scope**, not proof that arbitrary
runtime-installed callbacks cannot introduce another target. No concrete missing
static callback remains identified. If intake reveals another installed callback
or coupled producer, the Director must reconcile it before accepting that affected
wave. Do not silently omit it or expand into an unrelated subsystem.

## Complete waves

Each row is one acceptance wave. The roster lists every remaining target and every
already-PURE_C dependency retained with it. Program cohorts retain aliases and
their exclusive child helpers; helpers shared across cohorts have one E-wave owner.
Cohorts follow implementation patterns, not effect-ID ranges or unproved spell names.
The table below is the initial scope snapshot, not a live remaining-work counter.

| Wave | Complete assignment | Remaining targets | Bytes |
|---|---|---:|---:|
| E01 | Submission, presentation lifecycle and completion | 21 | 4,656 |
| E02 | Resource caches, typed loaders and deferred release | 30 | 6,832 |
| E03 | Object pools, task scheduling and render registration | 36 | 5,084 |
| E04 | Coordinates, interpolation and numerical support | 35 | 5,308 |
| E05 | Effect geometry and display-list construction | 40 | 16,000 |
| E06 | Animated-model resources and transforms | 33 | 8,264 |
| E07 | Animated-object dispatchers and command adapters | 44 | 10,840 |
| E08 | Typed-object adapters and table-driven model callbacks | 38 | 11,256 |
| E09 | Shared task choreography and child callbacks | 18 | 4,816 |
| P01 | Child-launch and timed response (Fireball family) | 25 | 13,592 |
| P02 | Forwarded-message child orchestration | 36 | 22,528 |
| P03 | Variant-loop response programs | 10 | 4,480 |
| P04 | Direct timed presentation scripts | 41 | 15,820 |
| P05 | Extended staged and coordinate choreography | 41 | 21,528 |
| P06 | Context-handoff child scripts | 40 | 19,716 |
| P07 | Delegated common-handler wrappers | 16 | 5,648 |
| **Total** | **16 waves** | **504** | **176,368** |

Current assignments, accepted-wave proof and production/tooling ownership are in the
[Director cursor](../cursors/director.md). Follow the [active queue](../../NEXT_STEPS.md)
for Joe's tooling-before-resumption sequence; wave membership remains unchanged.
Joe's October 28 clarification removes the Director-imposed storage cap and serial
restriction; clean completed-wave scratch promptly while preserving useful evidence.
See the [Director cursor](../cursors/director.md) for ownership and proof.

Initial authorized launch: **E01 shared handling as production writer, alongside P01
Fireball-family private candidate work**, both fresh top-level Sol 6.1 Extra High
threads. E01 owns 21 conversions; P01 owns 25 conversions, including 16 program
roots and nine child/support targets. Both iterate privately against stable inputs
until a complete-wave integration window. The Director coordinates any necessary
canonical exception checks and the one production writer integrates each ready wave.
Joe authorized a third worker on October 29: P04 alongside P02 and E04. Keep three
complete assignments active, replacing a worker only after its own wave
is accepted and ownership is released. The integrator owns prompt, safe scratch cleanup;
cleanup of released scratch does not delay a fresh worker with disjoint roots and preserved inputs.
Joe also authorized a dedicated top-level integration thread on October 29, additional to
those three matching assignments. This supersedes the initial combined matching/production
role: E04 returns to its own private wave after the running P02 check and production handoff.
The integrator alone reconciles complete waves, verifies them and handles authorized cleanup;
the Director accepts results and releases ownership. Do not divert matching workers to other waves.

This is a priority order, not a prerequisite that every shared helper be converted
before a program callback. Original ASM supplies stable interfaces. Disjoint
waves may develop concurrently; integrate one complete wave at a time. Drain
affected native checks only while shared inputs change, refresh them, and release
the drain promptly. No worker waits on unrelated matching difficulty.

## Basis for the program cohorts

All 107 roots were checked across their complete original instruction extents.
Grouping combines message/state constants, call sequences, installed child addresses
and recursive child ownership; proximity and equal sizes alone are not sufficient.
P01/P02/P03/P07 have particularly close repeated control patterns. P04/P05 are
broader protocol cohorts; they are not claims of identical source templates.

P01 includes effect IDs **8, 9, 16, 17, 39, 40, 51, 52, 58, 59, 65, 66, 67, 68,
72, 73**. Every root installs a child through `00262AB0`, stages via `00262C64`,
and uses `0025DAB0`. Fireball `0024EE08` and nonadjacent `00252548` share the
`0x100/0x101/0x1000..0x1003` dispatch pattern and context save/restore. Its children
and exclusive support are `0024EA70`, `0024F730`, `002522E0`, `00252A9C`,
`002532A8`, `00253928`, `00254220`, `0024CBC8`, and `0024CFAC`.
The static model callbacks selected by `0024CFAC` stay with their shared E08 owner.

P02 forwards messages to stored children; P03 uses the common variant-loop handler;
P04 issues presentation calls directly; P05 groups extended staged/coordinate
subfamilies; P06 launches children with context handoff; P07 delegates common
messages to `0027351C`. Existing E01-E09 protocol memberships are unchanged.
For a complete callable body with an original terminal suffix, see the source-bound
[P03 example](../../dossiers/func_0025630C-5434473088.md) and its separate
[accepted audit](../../audit/2026-10-28-attack-p03-integration.md). Diagnose coverage
before tuning; the example does not establish another target's boundary or padding provenance.

The old E10 is removed: its helpers are exclusive to the new P01/P02/P06 cohorts.
Every physical producer retains one wave owner, and all 529 targets remain in scope.
The inventory preserves per-root instruction/call evidence; detailed research is
in `build/research/attack-effects-similarity-20261027/EVIDENCE.md`.

## Structural intake before affected waves

The current workbench flags four targets as not ordinarily eligible, despite
supporting private comparison. Resolve their complete canonical producer admission
before dispatching the affected source wave; do not assume a passing private diff
settles ownership. Existing accepted logical corrections must be preserved.

| Wave | Complete body or coupled pair | Required treatment |
|---|---|---|
| E03 | `00261D24..00261D7C`, 88 bytes | Include the physical `00261D60` continuation |
| E05 | `002664B0..002667C0`, 784 bytes | Include the physical `00266550` continuation |
| E06 | `00267928..00267990`, 104 bytes, plus `00267990..00267D98`, 1,032 bytes | Keep both together; the latter's workbench symbol is `func_00267994`, but its logical entry includes the preceding four-byte preamble |

Other source-file straddlers already resolve as whole workbench targets: E02's
`00260F30` is 364 bytes across the `0x261000` file boundary; P04's `00250F9C`
and P02's `00270FF0` also retain all listed parts. File boundaries never shrink a wave.
Preambles at `0026285C`, `00263400`, and `00263AF0`, and the render switch tables,
belong in the initial coverage check before tuning.

Use a bounded structural helper/reviewer when required. First determine whether
an existing contract already suffices. Actual tooling or ownership-rule changes
retain explicit worker/consultant agreement, Astra approval, independent review
and structural audit. This plan authorizes no bypass, new boundary or new tool.
Continue unaffected waves while a concrete structural dependency is resolved.

## Execution and acceptance

Work on current `main`; no branches or worktrees. Matching remains in top-level
Sol 6.1 `xhigh` threads. Subagents are bounded research/tooling/review only.
Keep the dedicated integrator as the one production source/config/header/build writer. Every matching worker owns its
complete wave, one target at a time, until acceptance and explicit release.

Carry forward the last successful consultant choice: **Muse Wonder Full, Extra
High, using Joe's subscription**. Give each worker its own persistent lifetime
session and reuse it across problems. Authenticate the installed model/profile
at launch; reuse the existing direct CLI flow without new wrappers or orchestration.
No API billing fallback, Agent Mail or scheduled tasks. The Director approves
tooling; the source worker and consultant own ordinary reconstruction hypotheses.

Every fresh Sol worker prompt must carry forward this consultation guidance,
regardless of the assigned consultant. Ask for broader analysis, direction, or a
connected series of experiments when useful. Invite the consultant to challenge
assumptions and explain what different outcomes would imply. A targeted question
or single suggestion is welcome when the evidence supports it; do not impose a
one-suggestion limit or a fixed number of suggestions.

Sol owns reconstruction, hypotheses, experiment selection, implementation and
testing. Work through the consultant's guidance independently, adapting to results,
and continue useful investigation while awaiting advice. Do not return for approval
or another suggestion after each trial. Consult again after meaningfully exploring
the guidance, with a concise account of attempts, findings and unresolved questions.
Return sooner if new evidence invalidates the guidance, exposes an important
ambiguity, or reveals a real blocker; do not exhaust experiments that have become
irrelevant. This adds no per-trial reporting or ordinary-matching approval gate;
existing structural/tooling approval and acceptance requirements still apply.

Use the existing native stop/attention watcher and thread messaging, with a fresh
deduplicated route per assigned worker to this Director. Test actual startup and
delivery. Internal helpers also need a verified completion route. Process a stop
using the cursor and actual process state; exhausted ideas are not an indefinite
hold. A real hold identifies dependency, resolving owner and release condition.
Retire routes when the complete assignment is accepted and ownership released.

Reuse current research intake, shared compiler lessons, exact source pairs and
counterexamples before repeating experiments. Reconcile full bodies, original
ASM, accepted placement and indirect-table edges before matching. Keep uncertain
names as `func_XXXXXXXX`; exact code does not prove new gameplay semantics.

Use linked diffs during development, then **one canonical verifier for the entire
ready wave**. It builds CURRENT if needed: no preceding redundant build and no
per-function full-ROM verification. Require every assigned conversion to be
mechanically PURE_C, the sole linked owner, correctly placed, relocation-exact,
target-byte exact, and part of a byte-identical full ROM, with the normal fresh
compilation proof. Ordinary matching adds no independent review ceremony.
Structural changes use their existing separate audit/review rules.

An exact hybrid is not PURE_C completion. Do not repeat the descriptor program's
revised outcome silently: any proposed change to this program's requested source
class must be explicit, evidence-backed and decided by the Director under policy.

## Scratch retention and safe cleanup

Reuse the authenticated live CURRENT, fresh proof and baseline at
`C:/Users/Joe/.codex/ob64-descriptor-20261026` through the supported process-local
`OB64_WORK_ROOT` override. The name is historical; avoid duplicating its baseline
for every worker. Never recreate deleted `ob64-decomp-current`. Use pinned Node
and the restored authenticated toolchain. Audit-only Phase5A evidence is the
authenticated library-L4 product already selected in ignored local-tools config.

Both workers may run private candidate checks concurrently. Joe's October 28
clarification makes storage control a scratch-retention and cleanup responsibility;
the Director-imposed 12 GiB combined cap and serial-check restriction are withdrawn.
Keep existing live free-space admission checks unchanged. Use one private root per
active wave. Retain best/latest bulk comparisons and compact useful source, result
and observation records. During integration, safely discard superseded bulk diff
output after preserving its useful evidence; do not accumulate a full build tree
for each target. Storage warnings alone do not suspend concurrent matching.

At acceptance, preserve the wave's source identities, full-ROM/verifier/fresh
reports, necessary owner/object/relocation proof and useful research, then remove
its scratch after verifying the copies. Keep one complete latest accepted live
build; do not archive every temporary full build. Preserve existing E1/D1/D2 and
library archives. Any reduction of accepted evidence must keep its required proof
and be explicitly reviewed before deletion. This needs no new cleanup service.

Use the existing no-follow cleanup procedure: inspect root, ancestors and all
descendants; never recurse through junctions/symlinks/mounts. Shared tools, ROMs,
editor work and link targets are protected. Verify tool identities before and
after deletion. Record freed/retained sizes in the existing worker cursor, then
release ownership. No push is assigned.

## Evidence and planning checks

Primary inputs: verified original ROM; accepted overlay/owner/logical-function
models; current generated source-policy and verification reports. The existing
parent editor census and effect runner supplied leads, independently reconciled
against those decomp inputs. See `../reports/attack-effects-20261026/inventory.json`,
`../tools/attack-effects-audit.cjs`, and the parent
`docs/cutscene-director-command-reference.md` result-lifecycle section.

Research outputs are under ignored `build/research/attack-effects-20261027/`.
The final roster has unique targets, no overlapping logical extents, all 133
attack IDs mapped exactly once, no transition-only root included, and one wave
per remaining target. The canonical baseline was not rebuilt for this planning
task. The planning research made no production source/toolchain changes, live
emulator captures or editor modifications; matching is now separately authorized.
