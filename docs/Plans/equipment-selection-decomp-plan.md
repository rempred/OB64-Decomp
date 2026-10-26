# Equipment classification and weapon and spellbook selection decomp plan

Completed and accepted October 26, 2026 at `a3a8a4a3`. Final proof is preserved in
`build/accepted-builds/equipment-e1`; both assigned scratch roots are removed and
the worker/route are retired. The execution plan below records the agreed scope; current
ownership and release state are in the [Director cursor](cursors/director.md).
Scope checked against main `2594b2f182e655730734537448e9cb404659187f`.

## Scope and completeness

The proposed three functions are a complete, dependency-ready **selection-helper
wave: 496 bytes in three existing physical owners**. All three currently retain
their original assembly implementation. Use the repository's actual lowercase
symbol spelling below.

| E1 member | ROM interval, end exclusive | Accepted runtime address | Bytes | Observed behavior |
|---|---|---|---:|---|
| `func_000458f0` | `0x458F0..0x45934` | `0x8016F9F0` | 68 | Returns whether an equipment type is 1–13 or 24. |
| `func_00045934` | `0x45934..0x45A50` | `0x8016FA34` | 284 | Returns the first of four equipment IDs with that weapon classification, or zero. |
| `func_00045a50` | `0x45A50..0x45AE0` | `0x8016FB50` | 144 | Returns the first of four equipment IDs whose type is 23, the spellbook category, or zero. |

Each reads the unsigned type byte at `0x8018C410 + (id & 0xFFFF) * 32`.
The selectors inspect arguments in order; they return the selected **item ID**,
not its type or element. They contain their classification logic inline and make
no calls, including no call to `func_000458f0`. Preserve these leaf interfaces.

The directly related raw-type accessor, `func_000454c8` (24 bytes), is already
accepted `PURE_C`; protect it rather than rematching it. The element accessor
`func_000454e0`, flag accessor `func_000458d4`, and callers `func_00044370`,
`func_0004440c`, `func_0020C448`, and `func_0020DB10` are also existing C to preserve.
Book-before-weapon precedence belongs to callers such as `func_0004440c`.
Default equipment, generic-book conversion, class restrictions, inventory sorting,
and damage calculation remain outside E1.

The neighboring unmatched `func_0004555c`, `func_000455ac`, `func_000455fc`,
`func_0004564c`, `func_0004569c`, and `func_000456ec` are stat accessors with a
special item case, not missing selection helpers. The next owner, `func_00045ae0`,
loads resources. None is a callee or coupled producer of E1. This closes the
bounded helper family, not every equipment-related operation in the game.

### Evidence for the boundary

- [Original assembly manifest](../../asm/original/rev0/manifest.json) and
  [accepted segments](../../config/segments/rev0.yaml) give rows 946–948,
  `.ob64.r0946`–`.ob64.r0948`, with separate 68/284/144-byte owners. No current
  logical-function, multi-owner, or compilation-group contract couples them.
- Every word in the three reference files was compared with the normalized ROM;
  all 496 bytes agree. ROM SHA-256:
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
- The preserved accepted ELF report supplies the runtime addresses above. The
  older assembly comments' `0x800B...` addresses are extraction annotations;
  use the accepted `0x8016...` placement for calls, branches and relocations.
- A whole-ROM aligned J/JAL and absolute-pointer census found the direct callers
  below, no external J/JAL into an E1 body's interior, and no aligned absolute
  pointers to its entry. This is static evidence; it does not rule out computed
  indirect references. Complete owner coverage includes each return delay slot.

| Target | Direct JAL sites | Containing original owners |
|---|---:|---|
| `func_000458f0` | 5 | `000bc464`; `00235754` at four sites |
| `func_00045934` | 8 | `00044370`, `0004440c`, `000c6e38`, `000c6fe8`, `0020C448`, `0020DB10`, `002A9364`, `002B867C` |
| `func_00045a50` | 3 | `00044370`, `0004440c`, `00233568` |

Reference sources: [classifier](../../asm/original/rev0/lib/func_000458f0.s),
[weapon selector](../../asm/original/rev0/lib/func_00045934.s),
[spellbook selector](../../asm/original/rev0/lib/func_00045a50.s),
[existing type accessor](../../src/lib/func_000454c8.c), and
[existing selection caller](../../src/lib/func_00044370.c).
Parent research corroborates the category meanings in
[elements and resistances](../../../docs/elements-resistances-system.md)
and [combat modes](../../../docs/combat-modes.md); reconstruct source from the ROM
and canonical project evidence.

## Setup and ownership

The GCC preprocessing and GNU assembler/linker bundles were restored as real
directories under `.toolchains`, with all pinned binaries and all copied files
hash-checked. The installed Node had also drifted; the original Node v24.13.1 was
restored under `.toolchains/node-v24.13.1-win-x64` from its official distribution
and authenticated against the unchanged host pin. Prepend that directory to the
worker process's PATH and use its `node.exe` for all native commands. Recovery
evidence is in `build/setup-recovery-20261025/`. No toolchain contract changed.
The old cache is gone; one setup baseline must pass before matching starts.

The Director owns authenticating the restored bundles, including the
preprocessor's companion engine, against
[source-policy.json](../../config/source-policy.json) and the tracked Binutils
contract, and checking the other
[local prerequisites](../../README.md). Restore the accepted tool identities;
do not replace them with another compiler or weaken authentication. Release this
setup hold when the normal setup checks pass. Changes to tooling contracts still
require explicit Sol/Claude agreement, Astra approval and independent review.

Assign **one fresh top-level Sol 6.1 Extra High worker** the entire E1 wave and sole
production-write ownership. Do not split the three functions into separate waves
to fill slots. Another already-authorized, unrelated complete wave may run with a
second worker; this plan does not create that assignment. Use main, no new branch
or worktree, the worker's persistent paired Muse consultant, and the existing
native Director message/stop routes. Test route delivery before dispatch; retire
the route after acceptance and cleanup. Matching difficulty remains owned by the
same worker; it is not an indefinite hold.

Joe explicitly selected **Muse Wonder Full at Extra High** for E1. The installed
CLI's model is `muse-wonder-1.0`, with `full` instructions and `xhigh` effort.
Use the dedicated session `0b07eba3-4030-4764-984b-1d48040a0bcb`; mapping and successful
startup/history-recall evidence are under `build/consultants/equip-e1-muse/`.
Call `muse exec` with that exact `--session-id`, `--model muse-wonder-1.0`,
`--reasoning-effort xhigh`, `--prompt-file` and `--json`. Preserve the read-only
consultant configuration: `--preset empty --worktree off --disable-write
--disable-shell --disable-web-tools --disable-reminders --disable-request-user-input
--no-foreign-personal-context`. Supply the relevant source evidence in the prompt;
read the completed response from JSON `payload_type=run.terminal.completed` and
`payload.text`, and report failures rather than interpreting empty output as advice.
Use the same session for later questions, with one invocation at a time. Muse advises;
the Sol worker owns matching, implementation and acceptance. No new communication
framework, Agent Mail or automatic consultant loop is needed. This assignment-specific
consultant choice supersedes the normal Claude route and agreement role for E1;
Astra approval and applicable independent tooling review still apply.

## Matching and acceptance

1. Reconcile current intake and accepted owner metadata after setup recovery.
   Work through classifier, weapon selector, then spellbook selector. Use separate
   C producers and preserve all existing function and data ownership.
2. Derive readable C and run the supported private `watch`/comparison workflow.
   Preserve 16-bit ID truncation, unsigned table reads, four-slot ordering, zero
   fallback, and category boundaries 0/1/13/14/23/24/25. Check each possible winning
   slot and the no-match case during source review; no new testing framework is
   needed. Consult paired Muse for difficult compiler matching.
3. Integrate the complete set into `src/lib/func_000458f0.c`,
   `src/lib/func_00045934.c`, and `src/lib/func_00045a50.c`, with normal target and
   actual-relocation registrations. Use focused canonical linked diffs. Private
   masked/object equality alone does not establish linked acceptance. Preserve the
   table bytes and caller interfaces; do not turn inline selection logic into new
   cross-function calls merely to share C source.
4. Once all three candidates are ready, run **one** `node tools/verify.js` on the
   combined state, without a preceding redundant build. Require all three to be
   `PURE_C`, sole linked C owners, correctly placed, exact in their full sections,
   and part of a byte-identical full ROM. Keep original assembly as the accepted
   fallback/reference. Ordinary matching adds no independent review gate;
   structural or tooling changes retain their existing requirements.
5. Record the complete accepted wave on main, preserve its final proof, publish
   useful compiler observations through the existing research commands, and
   complete the cleanup below before releasing the worker. No push is included
   in this assignment.

## Bounded scratch and required cleanup

Completion includes verified scratch cleanup. Warning thresholds alone are not a
storage policy: the current `scratch-retention.js` inventories but does not delete.
This plan uses scoped filesystem cleanup, not a new daemon or coordination system.

| Storage | Rule |
|---|---|
| Private candidates | Use only `build/matching/equip-e1`; its 71-character absolute path passed `resolvePrivateWorkspace`. Keep current/best source and selected useful counterexamples recoverable. |
| Shared generated build cache | Set process-local `OB64_WORK_ROOT=C:\Users\Joe\.codex\ob64-equip-e1` for every E1 native command. This supported override keeps E1 outputs separate without changing global configuration. |
| Growth during matching | Keep at most the best and latest completed comparison output sets. After a command exits and useful source/evidence is preserved, delete superseded bulk objects, maps, copied inputs and failed-run directories. Do not accumulate one full build per experiment. |
| Wave storage budget | Plan for at most **8 GiB** across these two roots. Before starting a native operation, leave its existing 2 GiB provisional peak within that budget; clean or resolve capacity if retained data exceeds 6 GiB. Also obey the tool's existing free-space admission checks. This is an operational rule, not a claim that warning-only tooling enforces a quota. |
| Final retained result | Keep one complete accepted wave build, the final verifier/fresh-compilation/source-policy reports, source identities and concise useful research under `build/accepted-builds/equipment-e1/` and existing tracked research locations. Keep the previous protected library archive intact. |
| Wave closeout | After copying and hash-checking the accepted result, delete both E1 scratch roots, including failed runs, old current/baseline copies, probe output and workbench scratch. Check both paths are absent and record retained size and the cleanup result in the existing cursor. |

Reuse one valid setup baseline while matching. Since the old cached builds are gone, a
single setup build may be necessary; do not rebuild it per function. Refresh only
when required by changed inputs. Final acceptance may create fresh verification
outputs within the same budget.

Follow [safe filesystem cleanup](../WORKFLOW.md#safe-filesystem-cleanup), including
the no-follow census of every nested junction and shared-tool checks. Cleanup runs
only after commands using the affected root have stopped. Resolve
absolute paths against the two assigned roots and use literal paths; exclude
`.toolchains`, ROM inputs, other workers, native-rebuild/editor directories and
accepted archives. Preserve source and selected research before deleting its
only supporting scratch copy. After acceptance, the verified C source and final
wave proof replace the need to retain unsuccessful full builds.

At launch, confirm that the execution environment permits narrowly scoped cleanup.
Earlier bulk deletion requests were rejected by automatic approval review. If
cleanup is blocked again, the Director owns resolving that concrete permission or
environment blocker; report the exact undeleted path and stop further scratch
growth at the budget. Do not claim cleanup succeeded or silently defer it to a
future program.
