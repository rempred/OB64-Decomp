# High Attack Battle Stream Families — Director Plan

Status: **ready**

Date: 2026-09-02

## Outcome

This plan organizes the High Attack battle-stream Matching-C program into eight
sequential waves. Wave 1 is the action-stream record-construction family.

The plan contains 69 logical family functions and five shared bridge functions.
The complete program therefore contains 74 functions and 72,788 bytes.

All 74 functions are active `ASM` at the plan baseline. Generated status remains
authoritative. Run `node tools/status.js` before each wave and after integration.

The primary goal is exact `PURE_C` for every listed function. The work must make
the retail functions available for a later source-level High Attack migration.
This plan does not design or install that modified-game migration.

## Director decisions

These decisions govern every wave:

1. Work on one family at a time.
2. Run the waves in the order in this plan.
3. Attempt every function in the active family.
4. Do not stop after the highlighted High Attack target matches.
5. Include family members that the current patch does not modify.
6. Use one primary worker for each family to preserve context and shared types.
7. Start each wave from a clean, recorded decomp commit.
8. Let the Director create and prepare a worktree when Joe authorizes one.
9. Let the Director review, integrate, and remove or retain completed worktrees.
10. Do not run a complete-ROM verifier after each edit, candidate, or individual function.
11. Use the canonical linked diff for iteration.
12. Run one complete verifier at worker handoff after all practical family work is complete.
13. Run the complete verifier again after wave integration.
14. Prefer `PURE_C` and continue a serious Pure-C attempt before considering hybrid output.
15. Do not treat m2c output as the completed decompilation attempt.
16. Permit family-scale research, shared types, and creative source experiments.
17. Keep accepted owner boundaries and canonical source ownership unchanged.

A worker must not stop because an automatic draft fails to compile or remains
nonexact. The worker must repair the draft, reconstruct the logic, and iterate
from concrete linked differences.

## Family and translation-unit boundary

The family names in this plan are scheduling names. They describe supported
call, data, and control relationships. They are not canonical function names.

The families are bounded dependency groups. A reference to one shared global
does not make every caller part of the same family. Generic and high-fan-in
helpers appear in the separate shared bridge inventory.

The current evidence does not prove the original compiler translation units.
The matching workbench also does not assign these functions to one proved
compiler-similarity family. Do not present these planning groups as structural
translation-unit proof.

A family worker can use one ignored, family-scale C reconstruction for analysis.
The worker can also share provisional types and expressions in ignored scratch
files. These methods can improve logic, prototypes, and control-flow recovery.

The earlier larger-translation-unit experiment only tested generated candidates
and grouped compilation. It did not include sustained manual Matching-C work.
Its zero-match result does not reject family-scale reconstruction.

Grouped compilation alone did not change the tested function instructions.
Do not expect a larger translation unit to repair registers or schedules by
itself. Canonical regrouping of accepted owners is structural work and is not
authorized by this plan.

## Target legend

- **Bold function** — selected high-value Matching-C target.
- `DIRECT` — owns current or optional High Attack behavior or a patch site.
- `SUPPORT` — provides high-value context for replacing the patch in source.
- `FAMILY` — belongs to the bounded family and must still receive a full attempt.

The optional slot-zero patch in `func_0021B894` is disabled in the current Rev 0
builder. It remains a direct target because it is part of the supported High
Attack design history.

## Wave summary

| Wave | Family | Family functions | Family bytes | Highlighted targets | Baseline |
|---:|---|---:|---:|---|---|
| 1 | Action-stream record construction | 16 | 2,932 | `func_0021C970`, `func_0021CBC4` | all `ASM` |
| 2 | Combat-owner lifecycle | 3 | 1,160 | `func_001F3540` | all `ASM` |
| 3 | Context and trailer initialization | 3 | 1,604 | `func_00201108` | all `ASM` |
| 4 | Actor snapshot and interrupt control | 4 | 5,468 | `func_002159D0`, `func_00215CF0`, `func_00217BA8` | all `ASM` |
| 5 | Battle completion and controller paths | 7 | 6,412 | `func_0021840C`, `func_0021B894` | all `ASM` |
| 6 | Action-mode dispatch | 15 | 21,248 | none | all `ASM` |
| 7 | Action candidate selection and resolution | 7 | 13,412 | `func_00232D7C` | all `ASM` |
| 8 | Terminal stream dispatcher and state machine | 14 | 19,508 | `func_0021EBBC` | all `ASM` |
| **Total** |  | **69** | **71,744** | **11 targets** | **all `ASM`** |

The five shared bridge functions add 1,044 bytes. They receive their first full
attempt in the first consuming wave assigned below.

## Wave 1: action-stream record construction

This is the first active wave. It contains direct stream insertion and cursor
advance targets. It also contains the complete bounded record-helper family.

| Function | Bytes | Priority | Current status |
|---|---:|---|---|
| `func_0021C8DC` | 148 | `FAMILY` | `ASM` |
| **`func_0021C970`** | 168 | `DIRECT` | `ASM` |
| `func_0021CA18` | 112 | `FAMILY` | `ASM` |
| `func_0021CA88` | 168 | `FAMILY` | `ASM` |
| `func_0021CB30` | 148 | `FAMILY` | `ASM` |
| **`func_0021CBC4`** | 1,544 | `DIRECT` | `ASM` |
| `func_0021D1CC` | 52 | `FAMILY` | `ASM` |
| `func_0021D200` | 48 | `FAMILY` | `ASM` |
| `func_0021D230` | 44 | `FAMILY` | `ASM` |
| `func_0021D25C` | 48 | `FAMILY` | `ASM` |
| `func_0021D28C` | 52 | `FAMILY` | `ASM` |
| `func_0021D2C0` | 56 | `FAMILY` | `ASM` |
| `func_0021D2F8` | 60 | `FAMILY` | `ASM` |
| `func_0021D334` | 64 | `FAMILY` | `ASM` |
| `func_0021D374` | 72 | `FAMILY` | `ASM` |
| `func_0021D3BC` | 148 | `FAMILY` | `ASM` |

The worker must first map the shared record shape, field widths, cursor rules,
and wrapper arguments. The worker can change the target order when linked-diff
evidence supports another order.

The default order is:

1. Match the small traversal and record helpers.
2. Match `func_0021C970`.
3. Match the core `func_0021CBC4` owner.
4. Match all eight thin command wrappers.
5. Recheck every shared prototype across the family.

Wave 1 is not complete when only the two direct targets match.

## Wave 2: combat-owner lifecycle

This family covers setup, partial cleanup, and complete cleanup of the shared
combat owner. The direct target owns the High Attack cleanup free guard.

| Function | Bytes | Priority | Current status |
|---|---:|---|---|
| `func_001F309C` | 548 | `FAMILY` | `ASM` |
| `func_001F34B0` | 144 | `FAMILY` | `ASM` |
| **`func_001F3540`** | 468 | `DIRECT` | `ASM` |

Match the allocation and cleanup siblings before finalizing shared owner types.
Do not model the free guard without understanding the preceding cleanup calls.

## Wave 3: context and trailer initialization

This family initializes or copies the context records affected by High Attack
relocation. The supported static call chain is
`func_001FFE80 -> func_002013D0 -> func_00201108`.

| Function | Bytes | Priority | Current status |
|---|---:|---|---|
| `func_001FFE80` | 796 | `FAMILY` | `ASM` |
| **`func_00201108`** | 712 | `SUPPORT` | `ASM` |
| `func_002013D0` | 96 | `FAMILY` | `ASM` |

The worker must derive copy widths and record offsets from retail code. Parent
relocation tables are leads. They do not replace independent derivation.

## Wave 4: actor snapshot and interrupt control

This family covers actor-state copies, interrupt-boundary scanning, and the
associated interrupt/menu control paths.

| Function | Bytes | Priority | Current status |
|---|---:|---|---|
| `func_002158E4` | 236 | `FAMILY` | `ASM` |
| **`func_002159D0`** | 800 | `DIRECT` | `ASM` |
| **`func_00215CF0`** | 3,400 | `SUPPORT` | `ASM` |
| **`func_00217BA8`** | 1,032 | `SUPPORT` | `ASM` |

Wave 4 also owns the first full attempt for shared bridge `func_0021C3B0`.
The worker must preserve the retail ordering around candidate selection, marker
writes, state writes, and stream advancement.

## Wave 5: battle completion and controller paths

This family covers completion decisions and their dedicated controller helpers.
The optional slot-zero High Attack site belongs to the final owner.

| Function | Bytes | Priority | Current status |
|---|---:|---|---|
| `func_0021824C` | 396 | `FAMILY` | `ASM` |
| **`func_0021840C`** | 944 | `SUPPORT` | `ASM` |
| `func_00218B58` | 1,364 | `FAMILY` | `ASM` |
| `func_0021B0A0` | 576 | `FAMILY` | `ASM` |
| `func_0021B438` | 824 | `FAMILY` | `ASM` |
| `func_0021B770` | 292 | `FAMILY` | `ASM` |
| **`func_0021B894`** | 2,016 | `DIRECT`, optional patch | `ASM` |

Wave 5 also owns the first full attempt for shared bridge `func_002224F4`.
Do not infer slot-index or completion semantics from the patch description alone.

## Wave 6: action-mode dispatch

This family contains the mode dispatcher, four large mode owners, and their
dedicated preparation helpers. It supports the later action-resolution family.

| Function | Bytes | Priority | Current status |
|---|---:|---|---|
| `func_0022A280` | 404 | `FAMILY` | `ASM` |
| `func_0022A414` | 204 | `FAMILY` | `ASM` |
| `func_0022A4E0` | 728 | `FAMILY` | `ASM` |
| `func_0022A7B8` | 428 | `FAMILY` | `ASM` |
| `func_0022A964` | 1,176 | `FAMILY` | `ASM` |
| `func_0022ADFC` | 624 | `FAMILY` | `ASM` |
| `func_0022B06C` | 392 | `FAMILY` | `ASM` |
| `func_0022B1F4` | 3,588 | `FAMILY` | `ASM` |
| `func_0022BFF8` | 1,940 | `FAMILY` | `ASM` |
| `func_0022C78C` | 2,496 | `FAMILY` | `ASM` |
| `func_0022D14C` | 6,844 | `FAMILY` | `ASM` |
| `func_0022EC08` | 460 | `FAMILY` | `ASM` |
| `func_0022EDD4` | 380 | `FAMILY` | `ASM` |
| `func_0022EF50` | 876 | `FAMILY` | `ASM` |
| `func_0022F2BC` | 708 | `FAMILY` | `ASM` |

Wave 6 also owns the first full attempts for shared bridges
`func_0022257C` and `func_00222604`.

The worker must map the four dispatch modes before tuning large owners. Shared
types can be tested across the family, but each accepted owner stays separate.

## Wave 7: action candidate selection and resolution

This family covers action planning, candidate selection, and resolution. It
depends on the action-mode family and ends with one supporting High Attack target.

| Function | Bytes | Priority | Current status |
|---|---:|---|---|
| `func_0022F580` | 5,404 | `FAMILY` | `ASM` |
| `func_00230A9C` | 1,380 | `FAMILY` | `ASM` |
| `func_002317C8` | 1,272 | `FAMILY` | `ASM` |
| `func_00231CC0` | 1,472 | `FAMILY` | `ASM` |
| `func_00232280` | 472 | `FAMILY` | `ASM` |
| `func_00232458` | 2,340 | `FAMILY` | `ASM` |
| **`func_00232D7C`** | 1,072 | `SUPPORT` | `ASM` |

The worker must reuse proven Wave 6 types and mode relationships. Do not copy
unverified field meanings into canonical names or comments.

## Wave 8: terminal stream dispatcher and state machine

This family is the capstone. It contains the large terminal stream owner and
its dedicated state handlers and controllers.

| Function | Bytes | Priority | Current status |
|---|---:|---|---|
| `func_0021D7F0` | 1,204 | `FAMILY` | `ASM` |
| `func_0021DCA4` | 972 | `FAMILY` | `ASM` |
| `func_0021E070` | 596 | `FAMILY` | `ASM` |
| `func_0021E2C4` | 584 | `FAMILY` | `ASM` |
| `func_0021E50C` | 1,168 | `FAMILY` | `ASM` |
| `func_0021E99C` | 260 | `FAMILY` | `ASM` |
| **`func_0021EBBC`** | 10,272 | `DIRECT` | `ASM` |
| `func_002213DC` | 500 | `FAMILY` | `ASM` |
| `func_002215D0` | 3,008 | `FAMILY` | `ASM` |
| `func_00222190` | 156 | `FAMILY` | `ASM` |
| `func_0022222C` | 280 | `FAMILY` | `ASM` |
| `func_00222344` | 156 | `FAMILY` | `ASM` |
| `func_002223E0` | 276 | `FAMILY` | `ASM` |
| `func_00222530` | 76 | `FAMILY` | `ASM` |

Wave 8 also owns the first full attempt for shared bridge `func_0021EAF0`.

`func_0021EBBC` is one logical function stored in two physical assembly chunks.
Its head is 9,284 bytes. Its continuation is 988 bytes. Preserve that accepted
logical owner and use the reviewed multi-owner mechanism only when required.

Match the small handlers and controllers before the large target. Use the
preserved reconstruction and dossier as internal research evidence. Do not
activate a nonexact reconstruction.

## Shared bridge inventory

These helpers have callers in several families. They are not a ninth semantic
family. The default wave assignment prevents them from being forgotten or
duplicated.

| Function | Bytes | First full attempt | Current status |
|---|---:|---:|---|
| `func_0021C3B0` | 512 | Wave 4 | `ASM` |
| `func_0021EAF0` | 128 | Wave 8 | `ASM` |
| `func_002224F4` | 60 | Wave 5 | `ASM` |
| `func_0022257C` | 136 | Wave 6 | `ASM` |
| `func_00222604` | 208 | Wave 6 | `ASM` |
| **Total** | **1,044** |  |  |

A later call-graph correction can move a bridge to an earlier wave. It must not
remove the bridge from the program without direct contrary evidence.

## Director start gate

Before Wave 1, the Director must:

1. Confirm `git status --short --branch` is clean.
2. Record the exact starting commit.
3. Run `node tools/status.js`.
4. Run `node tools/verify.js` once for the program baseline.
5. Confirm one writer owns the selected checkout.
6. Create a branch or worktree only with Joe's explicit authorization.
7. Record any pre-existing worktree and branch before assigning it.
8. Confirm the Wave 1 family still has the accepted boundaries listed here.

When the Director creates a worktree, the Director must also prepare its ignored
local environment. A Git worktree does not inherit ignored tool bundles.

The prepared worktree must have:

- an isolated `config/local-tools.json` with valid absolute paths;
- access to the authenticated KMC compiler;
- byte-identical authenticated GNU Binutils 2.6 tools;
- the authenticated source-policy preprocessor bundle;
- a valid Rev 0 baserom path or `OB64_ROM_INPUT` setting;
- a unique external build or work root; and
- a passing `node tools/match.js doctor` result.

A missing `as.exe`, `mips64-elf-cpp.exe`, ignored `.toolchains` directory, or
local-tools file is an environment defect. It is not a C blocker. Never weaken
tool identity checks to make a worktree run.

## Normal family execution

The worker must understand the family before tuning individual registers.

For each family:

1. Inspect every accepted owner in the family.
2. Map bounded callers, callees, globals, fields, shared tails, and dispatch modes.
3. Identify one small exemplar when the family has repeated source shapes.
4. Use m2c through `tools/match.js` as a draft generator.
5. Repair invalid labels, prototypes, pointer expressions, and missing control paths.
6. Write a manual Pure-C reconstruction when generated drafts are insufficient.
7. Run the canonical linked diff early.
8. Change one source property in response to each concrete difference.
9. Commit one linked-byte-exact target at a time, pending the wave-end complete verifier.
10. Continue until every family member received a full attempt.

Use this canonical loop for a final target candidate:

```text
node tools/diff.js <symbol>
node tools/source_policy.js --target <symbol>
git diff --check
commit the linked-byte-exact target
```

`tools/diff.js` is the normal per-function iteration and linked-byte check.
`tools/verify.js --target` still builds and checks the complete current ROM.
Workers must not run it after each exact function.

After all practical family work is complete, the worker runs one batch gate:

```text
node tools/verify.js
node tools/status.js
git diff --check
git status --short --branch
```

This single wave-end run verifies the complete active result. Before that run,
an exact linked diff is a provisional exact result, not final acceptance.

After the Director integrates a wave, run:

```text
node tools/verify.js
node tools/status.js
git diff --check
git status --short --branch
```

The final status must be clean. The complete verifier must report an exact ROM.

## Required matching effort

Automatic candidate generation is a starting point. It is not evidence that a
target has received a dedicated Matching-C attempt.

Before reporting a compiler blocker, the worker must:

1. Read the complete accepted owner.
2. Inspect its bounded call and data context.
3. Generate the ordinary structured candidate.
4. Run the configured ensemble when the structured candidate is insufficient.
5. Repair m2c output that is invalid but mechanically recoverable.
6. Produce at least one manual Pure-C reconstruction.
7. Run at least one canonical linked diff on a valid candidate.
8. Test focused control-flow, type, expression, and declaration hypotheses.
9. Compare the result with relevant exact neighboring C when available.
10. Record the exact remaining bytes, instructions, relocations, or ownership defect.
11. Preserve the best useful blocker candidate with `tools/match.js preserve`.

Large size is not a blocker. Difficult scheduling is not a blocker. An invalid
m2c label is not a blocker. A low first-pass score is not a blocker.

The worker can use creative Pure-C methods from
`docs/KMC_GCC_MATCHING_NOTES.md`. Useful methods include explicit integer widths,
pointer casts, signed-division formulations, control-flow reshaping, declaration
order, deliberate temporaries, `goto`, and case-aware dispatcher comparison.

The unused `mips_c` JavaScript prototype is not the default candidate generator.
It has no demonstrated advantage over the pinned m2c workflow. Use it only for
one documented, bounded research question.

## Hybrid-C limit

The assigned result is `PURE_C`. Hybrid C is not the normal fallback.

An exact hybrid can be retained only after a genuine Pure-C attempt reaches a
concrete current blocker. The worker must document that blocker before adding
an assembler escape mechanism.

Any permitted hybrid fragment must be very small. It can influence one register,
instruction, schedule, or compiler/assembler decision. It must not implement a
meaningful algorithm, case handler, loop, or copied assembly body.

One assembler instruction still makes the complete translation unit `HYBRID_C`.
Report it as exact `HYBRID_C`, never Matching C. Preserve it as a fallback while
the Pure-C target remains open unless Joe accepts a documented exception.

Do not use raw words, assembly includes, naked functions, register-asm bindings,
or section tricks to disguise a large hybrid implementation.

## Blocker and retry policy

One blocked function does not justify abandoning the rest of its family. Finish
all independent functions and return to the blocker with the improved family
types and expressions.

Do not start the next wave while a practical in-family retry remains. Route a
focused research or correction task inside the same wave when it can materially
improve the result.

The Director can park one function and advance only when:

- the full effort checklist is complete;
- the blocker is concrete and preserved;
- the blocker needs structural work, a missing tool capability, or new evidence;
- no current in-family experiment can answer it; and
- the plan records a specific condition that reopens the target.

A parked target remains part of its original family. Later compiler knowledge,
new exact neighboring C, a new switch-table contract, or a corrected prototype
must trigger a reattempt.

Compiler-generated switch-table `.rodata` is not automatically a blocker. The
current workflow supports a reviewed auxiliary read-only section contract. Test
that path before reporting failure.

An accepted owner that spans contiguous executable rows can use the reviewed
multi-owner contract. Do not change boundaries to avoid that contract.

If placement, overlay mapping, executable extent, or accepted ownership appears
wrong, stop the affected target and open a structural task under `docs/AUDIT.md`.
Do not make a structural correction inside an ordinary family wave.

A missing Total Resolver database does not block static Matching-C work. Total
Resolver is optional unless the assigned question specifically requires runtime
evidence. Read `tools/total_resolver/AGENTS.md` before using it.

## Symbol-name sidecar

Use exactly three evidence classes:

1. `CANDIDATE` — an external lead that is never canonical.
2. `SUPPORTED_ALIAS` — a name independently supported by static evidence.
3. `CANONICAL` — a name proved by runtime, controlled mutation, or recognized library evidence.

For every matched function, the worker must attempt a `SUPPORTED_ALIAS`
promotion. Inspect the body, callers, callees, strings, tables, and data accesses.

Insufficient naming evidence does not block Matching C. Keep `func_XXXXXXXX` and
continue. Joe does not need to manually verify every proposed name. Only a
`CANONICAL` result can replace the build symbol.

## Research and clean-room use

Use the decomp repository and the parent research repository together. The
parent repository is read-only during an ordinary matching wave.

Parent patch code, runtime traces, modder notes, and external decompilation can
identify addresses, behavior hypotheses, and likely relationships. They must not
supply copied source expression, comments, or configuration for canonical C.

Derive canonical source independently from retail assembly, linked differences,
accepted project evidence, and the pinned compiler.

Project64 is not required for ordinary matching. Runtime evidence can support a
semantic name or resolve a specific behavioral question. It does not replace the
linked-byte and complete-ROM gates.

## Narrow reading map

Do not require a worker to read the complete parent project index or archived
program history. Read only the documents required by the active wave.

Every wave reads:

- `AGENTS.md` in this repository;
- `docs/WORKFLOW.md`;
- `docs/SOURCE_POLICY.md`;
- `docs/NEXT_STEPS.md`;
- this plan; and
- relevant sections of `docs/KMC_GCC_MATCHING_NOTES.md`.

When parent research is used, read the parent `AGENTS.md` once. Then search for
the active symbols and read only the surrounding sections in these sources:

- `tools/build_high_attack_stream_shift_rom.py`;
- `docs/combat-attack-buffer.md`;
- `HighAttackInterruptDebug.MD`; and
- the specific `wiki/battle-turn-queue-trace/` artifact named by those sections.

Wave-specific decomp evidence includes:

- Wave 2: `docs/patch-workbench/rev0/patch-workbench-chunks30-31-2026-06-23.json`.
- Waves 1 and 5: `docs/patch-workbench/rev0/patch-workbench-chunks32-33-2026-06-23.json`.
- Waves 3 and 4: bounded function context plus the relevant parent relocation or interrupt evidence.
- Waves 6 and 7: bounded context for the mode and planner owners.
- Wave 8: `docs/dossiers/func_0021EBBC-524b193eaf.md` and its preserved candidate.

Do not read `docs/AUDIT.md` unless direct evidence changes the task into
structural work. Do not initialize a Total Resolver database for an ordinary
static family wave.

## Wave handoff and integration

Before the terminal callback, the worker or reviewer must finish all file writes,
verification, hashes, Git-status checks, task-log updates, and final-response
preparation. The callback to the Director must be the task's last action. After
the callback, the agent must run no command, call no tool, and write no file; it
must end the task immediately.

When a callback arrives, the Director checks the source task status. If the task
is not yet finished, the Director does not freeze its files and checks again two
minutes later.

The worker must report each family member as one of:

- exact `PURE_C`;
- exact `HYBRID_C` fallback with a documented Pure-C blocker;
- preserved nonmatching `PURE_C` research; or
- unresolved `ASM` with a concrete blocker and reopen condition.

The report must distinguish direct targets, support targets, and other family
members. It must list every function. It must not omit a failed attempt.

The worker must report the single wave-end complete-verifier result. The worker
must not repeat a complete-ROM verifier once per exact function.

Commit exact targets separately. Do not activate or commit nonmatching sources
as canonical implementations. Preserve selected research only through the
documented workbench workflow.

The Director must review the full wave diff against its recorded base. The
Director must preserve unrelated work and reject mixed provenance.

The Director integrates only exact acceptable results onto the newest main
branch. After integration, the Director reruns target checks affected by
conflicts and the complete verifier.

## Family completion gate

A wave is exact-complete when:

- every family function is exact `PURE_C`;
- every shared bridge assigned to that wave is exact `PURE_C`;
- every accepted boundary remains unchanged;
- every active source has sole linked ownership;
- linked target bytes are exact;
- the integrated complete ROM is exact; and
- the final worktree is clean.

An attempt-complete wave can retain a parked blocker only under the blocker and
retry policy above. It remains open in this plan.

The complete Director program closes when all 74 listed functions are exact
`PURE_C`, generated status is current, the complete ROM is exact, and main is
clean. Any accepted Hybrid-C or ASM exception must remain visible and requires
Joe's explicit decision before program closure.

After this plan closes, create a separate modified-game plan for the source-level
High Attack migration. Do not combine retail Matching-C acceptance with modified
ROM behavior testing.
