# High Attack Battle Stream Wave 4 Matching-C Report

Status: **completed with two exact promotions and three preserved PURE_C blockers**

Wave 4 attempted all five assigned accepted owners in dependency order. It
promoted `func_0021C3B0` as exact `PURE_C` and `func_002158E4` as exact
`HYBRID_C`. The latter uses a zero-byte empty extended-assembly constraint to
resolve a compiler scheduler tie; it is not matching C and does not contribute
to the `PURE_C` count. The other three targets remain ASM-owned, with their
strongest independently reconstructed PURE_C sources preserved for later work.

## Assignment

| Item | Value |
|---|---|
| Role | Matching-C worker, actor snapshot and interrupt-control Wave 4 |
| Worktree | `C:\Users\Joe\Projects\OgreBattlel64\high-attack-wave-4` |
| Branch | `codex/high-attack-wave-4` |
| Required and observed starting HEAD | `647d412b75c7755df80e57f528ede5a64b5b5fd9` |
| Continuation base after the initial blocker report | `b7e13ffe56261519b41206b24db7951f5ab45ebf` |
| Structural scope | accepted boundaries and overlay placement unchanged |

The prepared Wave 4 checkout was used in place. No branch, worktree, push, or
remote operation was performed. Parent High Attack evidence was read-only and
Total Resolver was not needed. Wave 5 was not started.

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

`func_002158E4` snapshots the `0x6094`-byte battle owner, invokes the battle
reinitializer, restores selected owner ranges and a context byte, releases the
snapshot, and synchronizes actor state. `func_002159D0` performs the same
sequence when the stream planner is at zero, then scans and rewrites future
action-stream records and installs a `0x41` boundary marker.

`func_00215CF0` is the large interrupt/menu state dispatcher.
`func_00217BA8` initializes and animates the interrupt UI, performs the
snapshot transition at its threshold, handles two input paths, and advances
the controller timer. `func_0021C3B0` iterates all 20 actor slots and
synchronizes actor fields into two persistent record-table families. These are
static semantic aids, not new runtime behavioral proof.

## Matching results

| Function | Accepted bytes | Strongest result | Evidence | Disposition |
|---|---:|---|---|---|
| `func_002158E4` | 236 | exact linked bytes, 27 matching relocations, SHA-256 `2F0A1C6BC565B80B40015D55DD7944DC2C2C842E488763608D932D9BBCE6A8BD` | exact source is `HYBRID_C`; best PURE_C body differs only in a three-word scheduler tie | promoted as exact `HYBRID_C`, not matching C |
| `func_0021C3B0` | 512 | exact linked bytes, 27 matching relocations, SHA-256 `DC90E3EE150A784F0E79C93D488526E631F0D4BDE8CEDEC97E888850AE2C9194` | 512 bytes / 128 instructions from sole `PURE_C` owner | promoted as matching C |
| `func_002159D0` | 800 | candidate `B64E0169ADFD9D76DD0F2EB1C3FED123C16A3A56E3038FAB87A83256864D510D` | exact extent, score 70.58, 79 recognized relocations; five machine-shape words remain | preserved PURE_C blocker; ASM owner retained |
| `func_00217BA8` | 1,032 | candidate `B4DF0A7D7F267763C4348F00FC58F314474C6AFC8E7D57783629D3D7DC8E29F7` | exact extent, score 70.99, 107 recognized relocations; three scheduler words remain | preserved PURE_C blocker; ASM owner retained |
| `func_00215CF0` | 3,400 | candidate `FAE761956C1D221F00281248C73A96A158FBE3C247F7F8735166089B08D2E975` | 3,236 bytes / 809 instructions, score 28.52, 293 recognized relocations | preserved PURE_C blocker; ASM owner retained |

Scratch scores for ASM-owned targets include unresolved relocation fields and
are comparative workbench evidence, not canonical linked-byte claims.

## Exact promotions

### `func_002158E4`

The best ordinary C source has the exact 236-byte extent and correct behavior,
but KMC saves the allocator result before loading `D_801CE8BC`; retail performs
those independent operations in the opposite order. Source-shape, type,
lifetime, aliasing, evaluation-order, aggregate, and control-flow trials all
returned to the same three-word difference or disturbed a wider region.

The active source uses an extended-assembly statement with an empty template.
It emits no instruction and implements no behavior, but its simultaneous
input/output constraint gives KMC the dependency needed to choose the retail
schedule. Source policy therefore correctly classifies the unit as `HYBRID_C`.
The linked target is exact and the relocation contract contains 27 matching
records. The best PURE_C attempt remains archived and its exhaustion evidence
is recorded in `docs/dossiers/func_002158E4-a493a3ded3.md`.

### `func_0021C3B0`

The exact source retains the five-register 20-actor traversal, table split,
field writes, predicates, and helper-call order. A `for` loop recovered the
retail branch-likely exits and loop increment, an `s32` side selector produced
the signed `slti`, and staging the indexed table address reproduced the retail
operand order at the last differing word. The result is an exact 512-byte
`PURE_C` owner with 27 matching relocation records.

## Preserved blockers

### `func_002159D0`

The continuation recovered exact extent, the branch-likely type dispatch,
pointer-add operand order, load/compare/add register reuse, both marker paths,
and the symbolic `D_800EB1F0` address form. After masking only recognized
relocation fields, the remaining deviations are:

- offsets `0x34`, `0x38`, and `0x3C`: the same allocator-result/global-load
  scheduler tie proven for `func_002158E4`;
- offsets `0x178` and `0x180`: an inverse but semantically equivalent
  conditional/unconditional jump pairing for the `0x41` case.

Wave 4 does not permit a hybrid body fallback for this large target. The
strongest exact-length PURE_C source is preserved at
`docs/archive/matching-c-candidates/2026-09-04-func_002159D0-b64e0169ad.c`;
the active assembly remains the sole owner.

### `func_00217BA8`

The continuation corrected the preamble, scalar widths, numeric globals,
allocator prototype, mode branch, timer arithmetic, control-flow orientation,
and relocation-bearing operands. After masking only recognized relocation
fields, every target word matches except offsets `0x1C4`, `0x1C8`, and
`0x1CC`, which are the identical allocator/global-load scheduler tie. The
strongest exact-length PURE_C source is preserved at
`docs/archive/matching-c-candidates/2026-09-04-func_00217BA8-b4df0a7d7f.c`;
the active assembly remains the sole owner.

### `func_00215CF0`

The continuation reduced the earlier deficit from 420 bytes / 105 instructions
to 164 bytes / 41 instructions. It restored the missing `0x100`-byte local
text buffer and three distinct floating-point sentinel comparisons, replaced
numeric accesses and provisional library calls with typed symbols, recovered
the retail `0x140` frame and three-register save set, lowered the state selector
as the retail branch chain, and relocated the shared tails after states 10 and
11.

The remaining mismatch is not a relocation or register-allocation-only issue:
the workbench reports 170 blocks versus retail's 177, later source/CFG shape is
still absent, and KMC selects different legal delay-slot schedules in the
shared snapshot and sentinel blocks. The stronger PURE_C source is preserved
at `docs/archive/matching-c-candidates/2026-09-04-func_00215CF0-fae761956c.c`;
the active assembly remains the sole owner.

## Verification

Following the instruction not to run a full ROM build per remaining function,
all remaining iterations used direct KMC/object workbench comparisons. After
all five dispositions were final, exactly one wave-end full verifier and one
status command were run:

```text
node tools/verify.js

Baserom identity ........... PASS
Toolchain .................. PASS
Source policy .............. PASS
C linker ownership ......... PASS
Target placement ........... PASS
Relocations ................ PASS
Target bytes ............... EXACT
Full ROM ................... EXACT

PURE_C exact ............... 460 functions / 32416 bytes
HYBRID_C exact ............. 63 functions / 33960 bytes

RESULT: EXACT BASELINE
```

The generated verification report
`build/current/verification.json` has SHA-256
`CA755EC65A7893C4EA82BF8B0DDC213D1DDAC5FB646154975D934B1DB38C8FC9`.
The one generated status pass reported:

```text
Retail ROM ................... EXACT
Exact PURE_C ................. 460 functions / 32416 bytes
Exact HYBRID_C ............... 63 functions / 33960 bytes
Assembly owners remaining .... 5661 / 6444196 bytes
Other/data owners ............ 1058 / 35432596 bytes
UNKNOWN classifications ...... 0
```

Relative to Wave 4 entry, the accepted baseline gained one matching-C function
and 512 matching-C bytes, plus one exact 236-byte HYBRID_C owner. The two
promotions removed two assembly owners and 748 assembly-owned bytes while
preserving an exact retail ROM.

## Commits

- `b7e13ffe56261519b41206b24db7951f5ab45ebf` — initial Wave 4
  workbench candidates and evidence dossiers
- `149befa8d1cb9f2e7810f05c0f502f3e88a99d8c` — exact bounded-hybrid
  `func_002158E4` promotion
- `16d1b997cb2ceeb372ee33aa8f9ad7e8415dac65` — exact PURE_C
  `func_0021C3B0` promotion
- `7f4c82b49d22e225429b98a505806a463375c126` — stronger blocked
  `func_002159D0` candidate
- `8c0936527c16a5d239fa8460e4c4374f2fc2c8a0` — near-exact blocked
  `func_00217BA8` candidate
- `978ec4731ad6e36cdb1ba28048a88185fc7feb82` — stronger blocked
  `func_00215CF0` candidate

The final task-report commit is recorded in the Director handoff. No commits
were pushed.

## Symbol-name sidecar

The static bodies, callers, callees, record widths, and field accesses support
these cautious aliases:

| Function | Evidence class | Proposed alias |
|---|---|---|
| `func_002158E4` | `SUPPORTED_ALIAS` | `battle_state_reinitialize_from_snapshot` |
| `func_002159D0` | `SUPPORTED_ALIAS` | `battle_action_stream_prepare_interrupt_boundary` |
| `func_00215CF0` | `SUPPORTED_ALIAS` | `battle_interrupt_menu_update` |
| `func_00217BA8` | `SUPPORTED_ALIAS` | `battle_interrupt_controller_update` |
| `func_0021C3B0` | `SUPPORTED_ALIAS` | `battle_actor_state_sync` |

These are not `CANONICAL` names. No symbol rename or new absolute linker alias
is retained by this work.

## Director disposition

Wave 4 is complete. Integrate the branch commits in order, retain the three
remaining ASM owners, do not count `func_002158E4` as matching C, and treat the
generated status above as authoritative. A future PURE_C reopen should start
with the documented scheduler tie before revisiting the two near-exact large
targets.
