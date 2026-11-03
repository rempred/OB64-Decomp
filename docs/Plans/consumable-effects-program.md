# Consumable effects, eligibility and item feedback — active program

Prepared November 3, 2026 against `main` at `c6b65db3f708`. Joe authorized concurrent
execution with Astra Medium workers and Muse at its highest supported effort.
Existing completed programs and their retired workers remain closed. Current
assignments and native routes are in the [Director cursor](cursors/director.md).

## Objective and scope

Reconstruct readable, independently derived `PURE_C` for common consumable effects,
their Army and scenario use paths, target eligibility and item-specific feedback.
Include the separate Flag of Unity handling inside the assigned controllers.
Preserve retail behavior, complete logical functions, original assembly fallback,
accepted interfaces and the existing byte-exact Rev 0 baseline.

The initial scope contains **nine functions / 20,076 code bytes**:
**seven ASM replacements / 18,644 bytes**, plus **two accepted PURE_C helpers /
1,432 bytes** to preserve. These are scope figures from the accepted target model,
not a manually maintained progress counter. Generated source-policy and verification
status remain authoritative as work proceeds.

Sizes below are complete ROM code extents, not C file sizes; associated original
tables and other data retain their existing ownership. ROM interval ends are exclusive.

| Wave | Logical function | ROM interval | Runtime entry | Bytes | Responsibility |
|---|---|---|---|---:|---|
| C01 | `func_00041098` | `0x41098..0x415FC` | `0x8016B198` | 1,380 | Common two-phase consumable executor for IDs 1–19: generate/cache effect values and apply healing, fatigue reduction, status recovery, level-up requests, stat boosts and alignment/luck changes. |
| C01 | `func_00040FF4` | `0x40FF4..0x41098` | `0x8016B0F4` | 164 | Shared special-target pool calculation returning a segment count from 0 to 3; used by scenario eligibility and application. |
| C01 | `func_000c4650` | `0xC4650..0xC4A40` | `0x801D7BF0` | 1,008 | Army target-availability producer: character and squad eligibility, including HP, status, stat and alignment restrictions. |
| C01 | `func_000c9850` | `0xC9850..0xCA7E8` | `0x801DCDF0` | 3,992 | Army item-use state machine: selection, eligibility, inventory consumption and single/group effect application; separate Flag of Unity behavior. |
| C02 | `func_001AD8CC` | `0x1AD8CC..0x1ADB8C` | `0x802195BC` | 704 | Scenario eligibility for IDs 1–19, including special-pool checks, recursive member checks, stat caps and alignment endpoints. |
| C02 | `func_001AD0E4` | `0x1AD0E4..0x1AD8CC` | `0x80218DD4` | 2,024 | Item-specific detail/availability dispatcher; selects explanations using the item and eligibility result. |
| C02 | `func_001A9290` | `0x1A9290..0x1AB72C` | `0x80214F80` | 9,372 | General scenario/character-data state dispatcher containing scenario item-use flows and Flag of Unity handling. Its complete non-item branches remain part of this assignment. |
| KEEP | `func_00044aa4` | `0x44AA4..0x4501C` | `0x8016EBA4` | 1,400 | Accepted general level-up calculation called by Champion Statuette. |
| KEEP | `func_00045440` | `0x45440..0x45460` | `0x8016F540` | 32 | Accepted consumable metadata byte accessor used for single/group targeting scope. |

The KEEP entries are preserved dependencies, not additional matching assignments.
Use the actual symbol spellings above when registering sources and relocations.

## Complete waves and boundaries

| Wave | Complete new membership | Targets | Bytes |
|---|---|---:|---:|
| C01 — shared effects and Army use | `00041098`, `00040FF4`, `000c4650`, `000c9850` | 4 | 6,544 |
| C02 — scenario use and item feedback | `001AD8CC`, `001AD0E4`, `001A9290` | 3 | 12,100 |

C01 owns the shared executor and segment helper once; C02 consumes their interfaces.
Suggested investigation order follows each row above. Both waves may develop
concurrently against authenticated stable inputs: existing ASM supplies the shared
interfaces until their replacements are accepted. C01-first integration is useful,
but an unfinished C01 does not block acceptance of a complete, dependency-ready C02.
Serialize production integration and reconcile actual shared interfaces at that boundary.
Do not split a wave into per-function acceptance runs.

Important scope conditions:

- `00040FF4` is one 164-byte logical function across existing physical owners of
  **12 + 152 bytes**. Preserve both parts in one producer/replacement contract.
- `001A9290` is a whole **9,372-byte general dispatcher**, not an isolated item-use
  routine. Do not extract only its consumable cases or silently omit other states.
- Preserve the executor's generation/cache/apply phases, RNG call behavior, target
  traversal and inventory-consumption timing. Army and scenario validators are
  separate implementations; do not assume their single/group checks are interchangeable.
- Item IDs 1–19 use the common effect dispatcher. Flag of Unity's ID-20 handling
  belongs to the caller controllers. Item-detail feedback is in scope through `001AD0E4`.
- Keep the neutral name “special three-segment pool target.” A precise gameplay
  identity for those special entries is not established by the current static evidence.

Shared services remain interfaces. In particular, `func_00153898` (180 bytes) is
the general six-stat getter used by scenario eligibility; the item-specific cap
rule is in `001AD8CC`, so the accessor is not a new program member. General RNG,
allocation, resource lifetime, navigation, rendering, sound and the level-up
routine's private growth helpers also remain outside this assignment. Preserve
existing source classes, including the shared HYBRID_C menu helper `func_000c4a40`;
this program does not authorize converting it.

This is a bounded consumable-behavior and feedback program, not an inventory of
every special item or every transitive UI dependency. Reconcile a newly evidenced
coupled producer or missing item-specific owner with the Director before accepting
the affected wave; adjacency or a generic call alone does not expand the scope.

## Intake and evidence

The accepted target model reported supported private matching for all seven new
targets at drafting. No tooling change is pre-authorized. At launch, confirm the
current source classes, complete owners, original tables, placement and interfaces
through existing intake. Use accepted runtime mappings rather than the older
assembly comments' synthetic linear RAM column.

Original sources:

- [Effect executor](../../asm/original/rev0/lib/func_00041098.s),
  [segment helper head](../../asm/original/rev0/lib/func_00040ff4_chunk3head.s) and
  [tail](../../asm/original/rev0/lib/func_00040ff4_chunk4tail.s).
- [Army eligibility](../../asm/original/rev0/lib/func_000c4650.s) and
  [Army controller](../../asm/original/rev0/lib/func_000c9850.s).
- [Scenario eligibility](../../asm/original/rev0/lib/func_001AD8CC.s),
  [item details](../../asm/original/rev0/lib/func_001AD0E4.s) and
  [scenario dispatcher](../../asm/original/rev0/lib/func_001A9290.s).
- Existing [level-up C](../../src/lib/func_00044aa4.c) and
  [metadata accessor C](../../src/lib/func_00045440.c).

Relevant local parent-project research is the
[consumable family census](../../../wiki/after-action-reports/20260723-consumable-effects-family-static-census-aar.md),
[healing/fatigue trace](../../../ConsumableHealingFatigueStaticTrace.MD) and
[item explanation/status evidence](../../../reports/alignment-player-guide-20260916/writer-conditions/report.md).
These supply semantic leads and previously checked call relationships; reconstruct
canonical C from the ROM and accepted project evidence. For example, the Revive Stone
detail text identifies petrification recovery; do not infer behavior from its name alone.

Use current `match.js intake` and the shared compiler lessons before repeating
experiments. Keep complete bodies, actual loads/stores, signedness, truncations,
branch cases and jump-table destinations visible in the first comparison.
Semantic uncertainty does not block exact C; runtime claims require their own evidence.

## Execution and consultation

Staffing is **two fresh top-level Astra Medium matching workers** (`gpt-6-astra`,
reasoning `medium`), one per complete wave, plus a **separate top-level Astra Medium
integrator**. This is Joe's program-specific override of the default Sol staffing.
The integrator is the sole canonical source/header/configuration/build writer;
matching workers keep their own wave and private context in `build/matching/ci-c01`
and `build/matching/ci-c02`. Work on `main`, without new branches/worktrees.

The Astra Director handles assignments, handoffs and tooling decisions. For this
program, use **Muse Wonder Full** (`muse-wonder-1.0`) at the **highest available effort** through
the existing subscription CLI, replacing the default Claude consultant route.
Installed Muse Code 1.4.14 lists `ultra` above `max`, but actual November 3 calls
reported the Ultra entitlement gate closed and used `xhigh`. A help/profile entry
does not establish account availability. Use `--reasoning-effort max`: C01's
same-session consultation 003 completed successfully with no fallback warning.
Retain runtime evidence of requested and reported effective settings.
If Max also falls back to `xhigh`, use explicit `xhigh`; do not bypass account
gates or stop matching over the shortfall. Record requested versus effective effort
and report a newly observed fallback. Each matching worker owns one fresh persistent session for its entire
lifetime, with its worker/session mapping and questions/results under
`build/consultants/consumable-c01-muse` or `consumable-c02-muse`. Reuse that session
ID for all consultations, serialize its calls, and retain logs. Never resume
another worker's identity or fall back to API/PAYG billing.

Astra owns reconstruction, hypotheses, experiment selection, implementation and
testing. Start from the worker's own intake and analysis; consult Muse when a
difficult question warrants it, not automatically for every function or trial.
Ask for broader analysis, direction or related experiments with their rationale;
a precise suggestion is welcome, but impose no one-suggestion limit. Explore and
adapt the guidance independently before returning with meaningful evidence. Return
sooner if new evidence invalidates the direction or exposes a real blocker. There
are no experiment quotas, per-trial approvals or autonomous consultant loops.
If Muse is unavailable, preserve the session, continue independent work where
possible and report a concrete access/tooling blocker. The worker owns consultant
process completion; no separate Director watcher for every Muse turn is needed.

Use existing native messaging and stop/attention watchers, with verified delivery
to the active Director for both workers, the integrator and any bounded helper.
Confirm each dispatched worker actually starts. No Agent Mail, scheduled tasks,
heartbeats, new message framework or routine per-experiment reports. A stopped
unfinished assignment needs cursor/process inspection and an owned next action;
matching difficulty alone is not a hold. Genuine holds name the dependency,
resolving owner and release condition. Retire ownership and routes after acceptance.

Authenticate the existing compiler/preprocessor/runtime pins and accepted baseline.
Reuse valid setup and supported immutable matching inputs; build a missing baseline
once when necessary. Private checks validate candidates and their dependencies
against that baseline and may run concurrently. Affected shared-input drains are
scoped and released promptly; storage cleanup is not a single compilation slot.

Joe additionally authorized reviewed workflow improvements on November 3: actual-checker
preflight for complete wave membership, shared target resolution, immutable matching-tool
versions, and proportionate validation of private-diagnostic changes. The integrator owns
one concrete plan and consultant assessment before Director approval, then staged implementation
and independent exact-code review. Keep current matching moving and use existing manifests,
cursors and native routes. Preserve full-ROM wave acceptance and genuine structural audit
requirements; this is not authorization for a new coordination framework or broader program.

## Acceptance, publication and cleanup

For each complete wave, the integrator reconciles source, headers, providers and
actual relocations, performs the necessary focused comparisons, then runs **one
normal full-ROM verifier** on the combined state. The verifier builds CURRENT when
needed; no redundant prebuild or per-function full-ROM run. Require every assigned
replacement to be mechanically `PURE_C`, sole linked C owner, correctly placed,
relocation/target-byte exact, and included in the byte-identical complete Rev 0 ROM
with normal fresh-compilation evidence. Preserve both KEEP helpers and unrelated
accepted work. The canonical ROM SHA-256 is
`571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

Ordinary matching adds no independent source-review gate. Structural or tooling
changes retain explicit source-worker/Muse agreement, Director approval and applicable
independent review/audit. Use the reviewed generic terminal-tail rule only when its
conditions hold; the integrator stages it at complete-wave integration. An exact
hybrid is not completion of these PURE_C assignments.

Before committing, curate candidate sources and dossiers under the
[pre-commit workflow](../WORKFLOW.md#7-integrate-the-completed-wave). Retain only
documented reusable lessons and their necessary source pairs, intermediates,
counterexamples and parent context. Prefer canonical C for an identical final
example; matching a function does not justify another permanent candidate copy.
Repair references and validate retained research before discarding redundant files.
Keep ordinary experiment output in ignored scratch.

At wave acceptance, preserve required source/proof and useful research, release
ownership, and clean disposable scratch promptly using the
[safe cleanup procedure](../WORKFLOW.md#safe-filesystem-cleanup). Inspect roots,
ancestors and descendants without following links; protect toolchains, ROM inputs,
accepted outputs and references. Use Joe's Desktop/Recycling fallback for authorized
disposable files that cannot be deleted safely; never empty it automatically.
Cleanup must not strand the other worker or delete its selected inputs.

The program ends when both complete waves are accepted and their publication,
curation and cleanup are closed. Do not start another family automatically. This
program authorizes matching, complete-wave integration and normal curated wave
commits. It does not authorize a push, new tooling without approval or another family.
