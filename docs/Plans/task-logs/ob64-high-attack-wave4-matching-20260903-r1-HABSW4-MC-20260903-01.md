# High Attack Battle Stream Wave 4 Matching-C Report

Status: **completed with five preserved PURE_C blockers and zero promotions**

Wave 4 made a full matching attempt on all five assigned accepted owners. The
small shared snapshot helper, `func_002158E4`, reached a canonical linked
236-byte PURE_C body with a matching 27-relocation contract and only three
instruction words out of retail order. The other four functions reached
compiling semantic PURE_C candidates but still have material control-flow,
register-allocation, or extent differences. Every strongest candidate is
preserved with a dossier; the original assembly remains the accepted owner for
all five targets.

## Assignment

| Item | Value |
|---|---|
| Role | Matching-C worker, actor snapshot and interrupt-control Wave 4 |
| Worktree | `C:\Users\Joe\Projects\OgreBattlel64\high-attack-wave-4` |
| Branch | `codex/high-attack-wave-4` |
| Required starting HEAD | `647d412b75c7755df80e57f528ede5a64b5b5fd9` |
| Observed starting HEAD | `647d412b75c7755df80e57f528ede5a64b5b5fd9` |
| Starting status | clean |
| Structural scope | accepted boundaries, overlay placement, and owners unchanged |

The entry branch, HEAD, cleanliness, baserom-identity, and matching-workbench
doctor gates passed before source trials. Only the prepared Wave 4 worktree was
written. Parent High Attack evidence was read-only; Total Resolver was not
needed or used. No branch, worktree, push, or remote operation was performed.

## Family model

Static bodies and the established neighboring stream helpers support this
relationship:

```text
func_00217BA8 -----> func_002159D0 -----> snapshot/reinitialize sequence
       |                    |
       |                    +-----------> func_0021C3B0
       +--------------------------------> func_0021C3B0

func_00215CF0 -----> func_002159D0
       |
       +-----------> inline snapshot/reinitialize sequence
       +-----------> func_0021C3B0

func_002158E4 -----> snapshot/reinitialize sequence -> func_0021C3B0
```

`func_002158E4` snapshots the 0x6094-byte battle owner, resets the stream
planner field, invokes the battle reinitializer, restores selected owner
ranges and a saved context byte, releases the snapshot, and synchronizes actor
state.

`func_002159D0` performs the same snapshot/reinitialize sequence when the
stream planner is at zero, then scans future action-stream records. It records
the first eligible boundary, rewrites future record types and payload bytes,
emits a `0x41` boundary marker, and changes the selected actor's interrupt
state.

`func_00215CF0` is the large interrupt/menu state dispatcher. It consumes
controller input, advances per-actor state, creates and tears down UI
resources, calls the stream-boundary preparer, and contains another copy of the
snapshot/reinitialize sequence in one state path.

`func_00217BA8` initializes and animates the interrupt UI bounds, selects its
timing window, performs the snapshot/reinitialize transition at the threshold,
handles the two input paths, and increments the controller timer.

`func_0021C3B0` iterates all 20 actor slots and synchronizes actor fields into
the two persistent record-table families. It also clears transient actor state
under the observed activity predicates.

These are static semantic aids, not behavioral proof from new runtime capture.

## Matching results

| Function | Accepted range | Bytes | Strongest candidate | Scratch result | Canonical result | Disposition |
|---|---|---:|---|---|---|---|
| `func_002158E4` | `0x002158E4..0x002159D0` | 236 | `A493A3DED358110F479B3B356FFF631E55AF0A687441A1BFD46F4DA7667177A3` | 236/236, score 93.26 | 11 differing bytes in three words; all 27 relocations match | preserved PURE_C blocker |
| `func_002159D0` | `0x002159D0..0x00215CF0` | 800 | `1C8D67A40440ACC64A173C1ED4FBA457C268F8C03159AA7095C56C842B754EA2` | 792/800, score 54; 130 differing instructions / 368 bytes | not activated as an accepted owner | preserved PURE_C blocker |
| `func_00215CF0` | `0x00215CF0..0x00216A38` | 3,400 | `B8362C34897CC9CCBB0FAC5BF5EE197C9938822629258E5CCD26C94E1BC501A9` | 2980/3400, score 18.39; 842 differing instructions / 3,064 bytes; 105 expected-only instructions | not activated as an accepted owner | preserved PURE_C blocker |
| `func_00217BA8` | `0x00217BA8..0x00217FB0` | 1,032 | `9413B6F6A6BD4843EC8C2C8878CD9DF743A11097CDED8B6ACB02DD5DFA845618` | 1040/1032, score 25; 243 differing instructions / 855 bytes | not activated as an accepted owner | preserved PURE_C blocker |
| `func_0021C3B0` | `0x0021C3B0..0x0021C5B0` | 512 | `AE9AF908A6D51866F66626965DD0A675581B2FA10A3A87A84FAA871F793743E0` | 508/512, score 48.98; 82 differing instructions / 236 bytes | not activated as an accepted owner | preserved PURE_C blocker |

The scratch mismatch totals for the four noncanonical candidates include
unresolved relocation-bearing words and therefore are useful for relative
workbench progress, not canonical linked-byte claims. Only
`func_002158E4` was activated long enough for the normal canonical diff to
resolve and check its relocation identities. All temporary sources, target
rows, linkage rows, and aliases were then removed or restored before wave-end
verification.

No target met the exact-byte acceptance rule, so no per-target exact commit was
created. This report and the ten preserved evidence artifacts are the only
Wave 4 deliverables.

## Attempt record and blockers

The full eight-strategy `match.js prepare --no-context` ensemble was run for
each target. Compile-failed generated sources were mechanically repaired where
that exposed useful KMC code-generation evidence, then manual source-shape,
type, lifetime, volatility, loop, branch, and delay-slot trials were applied in
proportion to each target's closeness.

### `func_002158E4`

The candidate models the complete shared helper and produces the accepted
236-byte extent. A canonical linked diff reported:

```text
Source class ............... PURE_C
Accepted extent ............ 236 / 236 bytes
Raw linked differences ..... 11 bytes in 3 instruction words
Difference offsets ......... 0x18, 0x1C, 0x20
Relocation contract ........ MATCH (27 relocations)
Expected target SHA-256 .... 2F0A1C6BC565B80B40015D55DD7944DC2C2C842E488763608D932D9BBCE6A8BD
Candidate linked SHA-256 ... CB2A2D6F8D2B7E24664D6D2F84C13880851B30F8DA3DF46B663B27A69A7312C6
```

KMC places `move $s0, $v0` immediately after the allocator call; retail loads
`D_801CE8BC` first and then performs the move. The remaining work is tightly
localized to this post-allocation scheduling choice. Reopen with a source-shape
or lifetime technique that changes only those three words and re-run the normal
canonical diff and pure verifier.

Preserved evidence:

- `docs/archive/matching-c-candidates/2026-09-03-func_002158E4-a493a3ded3.c`
- `docs/dossiers/func_002158E4-a493a3ded3.md`
- source SHA-256 `C59E098C0633E9DE88F4ABB550A6CB124BC315584D254776C4ACE4AEDAFB91A1`

### `func_002159D0`

The best complete reconstruction has the retail saved-register roles, exact
preamble ownership, constants, future-record scan, type rewrites, marker
ordering, and relocation-bearing globals. It is two instructions short and
still differs in CFG/delay-slot lowering, including the duplicated snapshot
post-allocation schedule. Reopen after solving `func_002158E4`, transplant the
proven source shape, and localize the scan backedge and candidate-offset
lifetime.

Preserved evidence:

- `docs/archive/matching-c-candidates/2026-09-03-func_002159D0-1c8d67a404.c`
- `docs/dossiers/func_002159D0-1c8d67a404.md`
- source SHA-256 `44B02642A635D75D820F4A92DC2FD963E8D72E4FB362099BAFF0802A0372F742`

### `func_00215CF0`

The repaired candidate compiles as PURE_C and represents every retail switch
case plus the observed High Attack guard and state behavior. It remains 420
bytes short, with a much smaller stack frame and major differences in switch,
resource-lifetime, and shared-tail lowering. Reopen only after the direct
controller, stream preparer, and snapshot helper shapes converge; reconstruct
one state cluster at a time against the accepted assembly rather than treating
the mechanically recovered body as near-match source.

Preserved evidence:

- `docs/archive/matching-c-candidates/2026-09-03-func_00215CF0-b8362c3489.c`
- `docs/dossiers/func_00215CF0-b8362c3489.md`
- source SHA-256 `C0A1358A44D4CBA2A06A93D0490AC3A1C04B71AC8026FF96ECBEC49C4CC80B5A`

### `func_00217BA8`

The repaired candidate includes UI/timer initialization, threshold animation,
snapshot-family calls, input guards, selected-state writes, and counter
advance. It is two instructions long; numeric-global typing and whole-function
register/CFG scheduling are not yet retail-shaped. Reopen after the snapshot
helper and actor-sync functions, then replace absolute numeric declarations
with evidence-backed types and tune the threshold/input tails separately.

Preserved evidence:

- `docs/archive/matching-c-candidates/2026-09-03-func_00217BA8-9413b6f6a6.c`
- `docs/dossiers/func_00217BA8-9413b6f6a6.md`
- source SHA-256 `83997F8957A819E63CA3B43D45784B66034C0BB99DF2B959069D4B07E12E6C7F`

### `func_0021C3B0`

The strongest semantic candidate has the five-register 20-actor loop, table
split, field writes, predicates, and helper-call order. It is one instruction
short; branch-likely selection, load-use scheduling, and the loop tail still
differ. Reopen with localized volatile/lifetime and explicit-goto experiments,
then use the exact result as a dependency for the two controllers.

Preserved evidence:

- `docs/archive/matching-c-candidates/2026-09-03-func_0021C3B0-ae9af908a6.c`
- `docs/dossiers/func_0021C3B0-ae9af908a6.md`
- source SHA-256 `D79EF0B5A6CB317CD263C4486FB8AECFA28E790E342DED794B1C91E344F739DE`

Recommended reopen order is `func_002158E4`, `func_0021C3B0`,
`func_002159D0`, `func_00217BA8`, then `func_00215CF0`.

## Symbol-name sidecar

The static bodies, callers, callees, record widths, and field accesses support
these cautious aliases:

| Function | Evidence class | Proposed alias | Static basis |
|---|---|---|---|
| `func_002158E4` | `SUPPORTED_ALIAS` | `battle_state_reinitialize_from_snapshot` | snapshots the battle owner, runs the reinitializer, restores selected ranges, frees the snapshot, and synchronizes actors |
| `func_002159D0` | `SUPPORTED_ALIAS` | `battle_action_stream_prepare_interrupt_boundary` | scans and rewrites future stream records, installs a `0x41` boundary, and changes selected-actor interrupt state |
| `func_00215CF0` | `SUPPORTED_ALIAS` | `battle_interrupt_menu_update` | dispatches interrupt/menu states, controller input, UI resources, and stream preparation |
| `func_00217BA8` | `SUPPORTED_ALIAS` | `battle_interrupt_controller_update` | initializes and animates the interrupt window, gates input, invokes preparation, and advances its timer |
| `func_0021C3B0` | `SUPPORTED_ALIAS` | `battle_actor_state_sync` | iterates 20 actor slots and writes actor state into the persistent record tables |

These are not `CANONICAL` names. No symbol rename or new absolute linker alias
is retained by this work.

## Verification

The final standalone source-policy audit passed before the one wave-end full
verifier. The complete verifier then passed on the restored canonical tree:

```text
node tools/source_policy.js
node tools/verify.js

Baserom identity ........... PASS
Toolchain .................. PASS
Source policy .............. PASS
C linker ownership ......... PASS
Target placement ........... PASS
Relocations ................ PASS
Target bytes ............... EXACT
Full ROM ................... EXACT

PURE_C exact ............... 459 functions / 31904 bytes
HYBRID_C exact ............. 62 functions / 33724 bytes

RESULT: EXACT BASELINE
```

The generated verification report SHA-256 was
`D6C407027EF493F9FCD7519B4E1E5CEB74B05C7A77FD4B4E31EC136A72EA55E4`.
The immediately following generated status was:

```text
Retail ROM ................... EXACT
Exact PURE_C ................. 459 functions / 31904 bytes
Exact HYBRID_C ............... 62 functions / 33724 bytes
Assembly owners remaining .... 5663 / 6444944 bytes
Other/data owners ............ 1058 / 35432596 bytes
UNKNOWN classifications ...... 0
```

## Hybrid extent and ownership

Wave 4 added no inline assembly, register-asm binding, raw assembler injection,
or other hybrid mechanism: hybrid extent is **zero bytes**. All preserved
sources are PURE_C research candidates, not active translation units. Each
original assembly target remains available and remains the sole linked owner
of its accepted section. The final exact baseline therefore makes no new
matching-function or matching-byte claim for this wave.

## Director handoff

The Director should treat Wave 4 as a completed five-target attempt with no
promotion. Review the near-exact shared helper first, preserve the dependency
order above when scheduling a reopen, and retain all accepted structural owners
unless a separately scoped structural task proves a change.
