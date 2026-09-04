# High Attack Battle Stream Wave 4 Matching-C Report

Status: **completed with four exact promotions and one preserved PURE_C blocker**

Wave 4 attempted all five assigned accepted owners in dependency order. It
promoted `func_0021C3B0` as exact `PURE_C` and `func_002158E4`,
`func_002159D0`, and `func_00217BA8` as exact `HYBRID_C`. Each hybrid source
uses the same zero-byte empty extended-assembly constraint to resolve a proven
KMC scheduler tie; none is matching C or contributes to the `PURE_C` count.
`func_00215CF0` remains ASM-owned, with a substantially stronger independently
reconstructed PURE_C source preserved for later work.

## Assignment

| Item | Value |
|---|---|
| Role | Matching-C worker, actor snapshot and interrupt-control Wave 4 |
| Worktree | `C:\Users\Joe\Projects\OgreBattlel64\high-attack-wave-4` |
| Branch | `codex/high-attack-wave-4` |
| Required and observed starting HEAD | `647d412b75c7755df80e57f528ede5a64b5b5fd9` |
| Continuation base after the initial blocker report | `b7e13ffe56261519b41206b24db7951f5ab45ebf` |
| Continuation base after Wave 4 integration | `b28a7c46188915ebb3b5a4a759b09ccffab6a178` |
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
| `func_002159D0` | 800 | exact linked bytes, 79 matching relocations, SHA-256 `3E34625B1C1630EA8A974ABF082D1AA19123E62D4A60B674D821DE3892BA06E8` | exact source is `HYBRID_C`; best PURE_C body differs only in the three-word scheduler tie | promoted as exact `HYBRID_C`, not matching C |
| `func_00217BA8` | 1,032 | exact linked bytes, 107 matching relocations, SHA-256 `FE23E341C7625CCBE953CE268D858A5ACF66FC2C012F4A8C0D82802A1F8E63D8` | exact source is `HYBRID_C`; best PURE_C body differs only in the three-word scheduler tie | promoted as exact `HYBRID_C`, not matching C |
| `func_00215CF0` | 3,400 | candidate `8BB179FD7AB31807515451089CA0190B6723FE4C6133059B8C93F0762E8871C7` | exact 3,400-byte / 850-instruction extent, score 37.97, 293 recognized relocations, 169 / 177 CFG blocks | preserved PURE_C blocker; ASM owner retained |

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

### `func_002159D0`

The continuation recovered exact extent, the branch-likely type dispatch,
pointer-add operand order, load/compare/add register reuse, both marker paths,
and the symbolic `D_800EB1F0` address form. A byte-width copy in an explicit
single-iteration control shape recovered the retail `0x41` branch pair without
changing allocation. The resulting best PURE_C candidate has the exact extent,
CFG, opcodes, registers, and all 79 relocation records; after relocation
masking, only the established offsets `0x34`, `0x38`, and `0x3C` scheduler tie
remain.

Representative source-shape and compiler-pass probes exhausted the ordinary C
families available for that tie. The active source therefore uses the bounded
zero-byte empty extended-assembly constraint already proven in
`func_002158E4`. The linked 800 bytes and all 79 relocations are exact. The
stronger PURE_C candidate is preserved as
`docs/archive/matching-c-candidates/2026-09-04-func_002159D0-49a839eaea.c`;
the accepted owner is truthfully `HYBRID_C`.

### `func_00217BA8`

The continuation corrected the preamble, scalar widths, numeric globals,
allocator prototype, mode branch, timer arithmetic, control-flow orientation,
and relocation-bearing operands. After masking only recognized relocation
fields, every target word matches except offsets `0x1C4`, `0x1C8`, and
`0x1CC`, which are the identical allocator/global-load scheduler tie. The
same representative source families collapse to those three words in the
function's full register-pressure context, providing a concrete PURE_C blocker.
The active source applies the bounded zero-byte constraint, producing exact
linked bytes and all 107 matching relocation records. The strongest
exact-length PURE_C source is preserved at
`docs/archive/matching-c-candidates/2026-09-04-func_00217BA8-b4df0a7d7f.c`;
the accepted owner is truthfully `HYBRID_C`.

## Preserved blocker

### `func_00215CF0`

Earlier work reduced the initial deficit from 420 bytes / 105 instructions to
164 bytes / 41 instructions while recovering the retail `0x140` frame,
three-register save set, text buffer, sentinel comparisons, symbolic accesses,
state chain, and shared-tail placement. This continuation closed the remaining
extent deficit by restoring the six outgoing stack arguments omitted from each
ten-argument `func_00054e24` call. KMC retains the path-specific ABI setup and
tail-merges the calls into the two retail shared sites; these arguments are
structural call evidence, not padding.

Separating states 8 and 9 and expressing the state-3 `0x100` selector through a
byte local recovered the final instruction and exact `0xD48` extent. The new
PURE_C candidate has 850 / 850 instructions, score 37.97, 293 recognized
relocations, and 169 blocks versus retail's 177. Its remaining 691 aligned
instruction differences span CFG, scheduling, and allocation, so it is not an
acceptance candidate. It is preserved at
`docs/archive/matching-c-candidates/2026-09-04-func_00215CF0-8bb179fd7a.c`;
the original assembly remains the sole accepted owner.

## Verification

Following the instruction not to run a full ROM build per remaining function,
all remaining iterations used direct KMC/object workbench comparisons. After
all five dispositions were final, one completed consolidated full verifier and
one status command were run. The first consolidated attempt was interrupted by
the Codex desktop crash before it produced a result. After restart, a retry
failed before compilation because Windows servicing had updated the GAC
console-host assembly around the otherwise unchanged pinned PowerShell files.

The existing pinned `powershell.exe` and
`System.Management.Automation.dll` retained their authenticated hashes. An
isolated runtime copy paired them with the matching `10.0.26100.8972`
`Microsoft.PowerShell.ConsoleHost.dll` still present in WinSxS (SHA-256
`5923BB7D8B4CA57344EE7BBB8CE2BCC1F93F82C89C507CB0FE24EF3D1E2A509F`).
That runtime reported the accepted PowerShell version before the successful
consolidated run. No per-function full-ROM build was run.

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
HYBRID_C exact ............. 65 functions / 35792 bytes

RESULT: EXACT BASELINE
```

The generated verification report
`build/current/verification.json` has SHA-256
`5E01256BAD8D80B04BF7AF5FD6E2250C45589F8793AC1E2652A859D3B818722F`.
The one generated status pass reported:

```text
Retail ROM ................... EXACT
Exact PURE_C ................. 460 functions / 32416 bytes
Exact HYBRID_C ............... 65 functions / 35792 bytes
Assembly owners remaining .... 5659 / 6442364 bytes
Other/data owners ............ 1058 / 35432596 bytes
UNKNOWN classifications ...... 0
```

Relative to Wave 4 entry, the accepted baseline gained one matching-C function
and 512 matching-C bytes, plus three exact `HYBRID_C` owners totaling 2,068
bytes. The four promotions removed four assembly owners and 2,580
assembly-owned bytes while preserving an exact retail ROM.

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
- `b28a7c46188915ebb3b5a4a759b09ccffab6a178` — integrated Wave 4 base
  used for the final continuation
- `9a8e7e35d5f4e9070f32191f75d7814a8d03ad15` — exact bounded-hybrid
  `func_00217BA8` promotion
- `a664a96c9cac5c9729adee2ed1fd2a7cadef2ab8` — exact bounded-hybrid
  `func_002159D0` promotion

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

Wave 4 is complete. Integrate the continuation commits in order, retain
`func_00215CF0` as the sole remaining ASM owner, and do not count any of the
three exact hybrid promotions as matching C. Treat the generated status above
as authoritative. A future PURE_C reopen for the exact hybrid targets should
start with the documented scheduler tie; a reopen for `func_00215CF0` should
start from the archived exact-extent candidate and its remaining CFG mismatch.
