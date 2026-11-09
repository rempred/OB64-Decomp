# Body construction, scene placement and equipment visuals

Authorized November 8, 2026. Base: `main` at `0b972a78`, accepted CURRENT
`51174C7C86B20D82B20106F28DC0D79E6DDD0837FD4C86AEC46D34CB8303F162`.
This program closes the missing retail C owners in the native editor's bounded
body/equipment visual-policy and wide-marker group. It does not implement editor
adaptations or establish new runtime semantics.

## Family census

Completed and accepted November 9: B02 `func_002AAC60` is matching PURE_C in
`8eaabdfc`; B01 `func_002AB810` is matching PURE_C in `ea3dfaae`. Combined CURRENT
`5894EA0E55DBDB41BA76517755F5E8110AC032C4DD35E6313BEB49DD6BE14086`
passes the complete-ROM verifier. Full proof and curated controls:
[integration cursor](cursors/body-equipment-integration.md). Director authenticated
the recorded reports, ROM and B01 source; all assignments and production ownership
are released, with native assignment routes retired. Both commits remain local.

At intake, the two proposed functions were the **only remaining ASM owners in this
bounded group**, not its only members. The actual patch-site definitions in
`../editor/native/engine/body_visual_policy.cpp` and `body_markers.h` identify
ten fragments in six complete owners:

| Complete owner | z64 ROM interval (end exclusive) | Group sites | Current evidence |
|---|---|---|---|
| `func_00207658` | `207658..207A70` | equipment register `2076A8+132` | accepted PURE_C |
| `func_00205C88` | `205C88..2060EC` | allocation `205CBC+124`; markers `205FD8+220` | accepted PURE_C |
| `func_00206340` | `206340..206888` | image `206370+144`; context `206470+20`; kind `2064EC+36` | accepted PURE_C |
| `func_002ABB3C` | `2ABB3C..2ABF64` | roster `2ABD68+24` | accepted PURE_C |
| `func_002AB810` | `2AB810..2ABB3C` | construction `2AB884+56` | accepted PURE_C; B01, 812 bytes |
| `func_002AAC60` | `2AAC60..2AB0F8` | entrance skip `2AADC8+40`; sticky `2AAFA4+24` | accepted PURE_C; B02, 1,176 bytes |

Thus the intake audit's **three unrecovered fragments map to two functions**. Complete
original assembly ranges agree with the site containment. Accepted source
classes come from the hash-authenticated fresh-compilation report referenced by
`build/current/state.json`, not its stale neighboring report copies. The four
accepted members remain dependencies and integration regression coverage.

The broader actor-presentation system contains additional unrecovered functions,
including `func_002A9364` (`2A9364..2A985C`, 1,272 bytes; actor initialization/placement)
and `func_002B867C` (`2B867C..2B88C8`, 588 bytes; mission-briefing construction).
The parent `docs/combat-animation-system.md` constructor-argument trace identifies
these parallel paths. They are not owners of this group's ten patch sites.
Rendering, motion, lifecycle and command dispatch extend beyond this finite
group; the separate cutscene draft remains unassigned. No claim of a complete
game-wide actor-function census is made.

## Complete waves and dependencies (execution record)

- **B01 / Worker 1:** `func_002AB810`, full 812-byte owner; private root
  `build/matching/bv-b01`. Assistant 1 is its persistent consultation partner.
- **B02 / Worker 2:** `func_002AAC60`, full 1,176-byte owner; private root
  `build/matching/bv-b02`. Assistant 2 is its persistent consultation partner.
  Preserve the eight-byte read-before-prologue preamble and interior
  `func_002AAC68` label as one accepted owner; do not split or truncate it.

These are two independent C producers, not artificial subdivisions of one
producer. B02 calls B01; accepted roster owner `002ABB3C` also calls B01. Existing
external-call/assembly fallback contracts allow concurrent private reconstruction
against identical selected inputs. Preserve the observed ABI, reconcile it at
integration, and do not turn a routine call edge into a candidate-work dependency.
Both complete waves must pass supported source-independent preparation before
dispatch. Private diagnostics never establish canonical acceptance.

Runtime selection: prepend `.toolchains/node-v24.13.1-win-x64` to process-local
PATH and invoke its pinned `node.exe`; set
`OB64_WORK_ROOT=C:/Users/Joe/.codex/ob64-descriptor-20261026`.
System Node24.22.1 does not match the existing host contract. The local Node24.13.1
copy and host tuple were authenticated unchanged; no runtime pin update is needed.

## Staffing, ownership and acceptance (execution record)

After worker quota failures, Joe authorized Director to finish both saved private
candidates directly. The existing integrator retained sole production ownership
through acceptance. Director accepted the final handoff and released that ownership
on November 9; all workers and assistants remain stopped. The rules below record
the execution arrangement, not active assignments.

Joe's current configuration supersedes historical Codex staffing: two primary
DeepSeek V4.1 Flash Free/MAX workers, paired persistent Inkling 2 Small Free/MAX
assistants; Astra/HIGH Director; separate Sol6.1/HIGH integrator; both existing
Director reviewers retained. All use maximum supported context. Exact identities,
assigned roots, selected manifests and launch state live in the
[Director cursor](cursors/director.md) and ignored session registry.

Workers write only their private roots, one target at a time. Assistants advise
their paired worker without editing its candidate. Integrator alone owns
canonical source/header/configuration and build writes, complete-wave source/ABI
reconciliation, canonical linked diffs, actual relocation records, research
curation and final verification. Director owns program/queue/cursor documents
and local communications setup. No branch, worktree, push or emulator work.

Use current research intake, full assembly and bounded body coverage before
tuning; preserve the best source and useful counterexamples. Consultation uses
the assigned native worker/assistant pair. Send only complete-wave handoffs,
actionable blockers, shared-input coordination or explicitly requested tests to
the exact Director route. No routine per-experiment progress. A no-ideas stop
does not complete a wave. Structural/tooling defects retain separate approval,
audit and independent review requirements.

Integrate complete ready waves serially. Require mechanical PURE_C, exclusive
C ownership, accepted placement, exact relocation contract and target bytes,
then one complete fresh-ROM verification for the changed completed-wave state.
No per-function redundant build, no verifier repeat for unchanged handoff.
Retain original assembly fallback. Curate useful research before scoped commits.
Native direct delivery, stop/attention recovery, deduplication, retirement and
idle-Director wakeup must be tested before unattended matching launch.
