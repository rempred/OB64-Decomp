# Complete EBBC owner preparation r1

Status: completed. The complete owner is prepared, with dispatch, storage, interface, and production-contract obligations preserved.
The retained candidate is a navigation aid, not a source implementation ready for frame tuning.
Director `/root` must bind preceding accepted waves and sole ownership before source activation. W8 retains sole production ownership now.

Identity: `combat-terminal-ebbc-preparation`, revision 1, launch `COMBAT-TERMINAL-EBBC-PREPARATION-20260907-01`.
Receiver `/root/sequential_scope`; Director native task `01a07262-aeca-7341-ad10-2dba705ff988`; host `local`; Astra Medium.
Ready `1f25a7f3d9c7124564c3a57c70ae1244cf4eef61`; activation and starting HEAD `9f368071dca99396faf02a03365b891edee29f67`.
Coordination `6278e64d389bf0bf510111f26a747e1925a8a388`; accepted source W7 `469a1416918592749d61dc34e3e079796f7b673c`.

Plan: authenticate the frozen retrieval and relevant W7 objects, then compare complete assembly words with canonical ROM.
Reconcile ABI, escaped storage, dispatch paths, helper contracts, and current auxiliary ownership.
The leading interpretation is that the candidate is a useful nonexact whole-owner hypothesis.
The alternative is that address-based declarations conceal wrong external interfaces or internal labels.
Direct call words, bounded table targets, and accepted contracts distinguish these cases.
A differing ROM identity, owner extent, or placement falsifies the controlling input assumptions and stops analysis.
This task supports matching preparation only, not new semantic or structural acceptance.

The claim was created atomically and read back before other writes. The fresh ignored output root was absent.
Existing W8 source/configuration changes and held Resolver test changes are outside this task and remain untouched.

## Controlling evidence and limits

The frozen retrieval package and report authenticated against their prescribed hashes and exact Git objects.
Twenty-one relevant package inputs authenticated before analysis. Eleven additional W7 source, assembly, and contract inputs have hashes in `evidence.json`.
No fifteen-owner retrieval was repeated.

Canonical normalized Rev 0 ROM SHA256 is `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`, with 41,943,040 bytes.
All 2,568 owner words equal that ROM. Complete owner SHA256 is `FB00F50A286089C39EFDD6777416CCD2C9E47B974503554059EAF98A1A0D7A87`.
The two physical parts remain 9,284 and 988 bytes. Original fallback identities remain those in the assignment and frozen package.

Accepted `resource-loader-00213b10` maps this owner to VMA `[0x801DB8EC,0x801DE10C)` from ROM `[0x0021EBBC,0x002213DC)`.
This is accepted saved placement, not new execution evidence. Assembly comment VMAs do not control that projection.
The research-aide index routes byte questions to the current original assembly foundation. No database, runtime product, or external source was queried.

The candidate is W7 Git blob `55d5b94e695351deda46ce52e6792365f63a3cb2`.
Its LF SHA256 is `0CD33BD126273285BA3C9BF9E5E474C47FAE25FE303D412694272082D09AED26`.
The dossier's Resolver observations remain historical leads. Its 10,104-byte/728-frame candidate and 10,208-byte/776-frame aggregate trial remain historical measurements.
No current compiler result, failure cause, or reusable compiler theorem follows from those metrics.

These are direct static preparation observations, not new semantic, inventory, or structural acceptance.
The leading candidate interpretation survives only as a navigation hypothesis. Direct instructions expose the declaration and control-flow hazards below.

## ABI and escaped storage

The public entry establishes a 744-byte frame. It saves `s0..s8`, `ra`, and floating-point register pairs beginning at `f20` and `f22`.
The entry loads the global context itself. `void func_0021EBBC(void)` remains the neutral reconstruction interface; no new argument or result meaning is established.
The common return restores those registers. ROM `0x002213D4` is `jr ra`; ROM `0x002213D8` restores the frame in its delay slot.

All offsets below are relative to the owner's adjusted stack pointer. These are real escaped storage footprints, not requested compiler allocations.

| Storage | Required footprint and direct evidence | Candidate reconciliation |
|---|---|---|
| First copied record | `[sp+0x58,sp+0x150)`, 248 bytes; ROM `0x0021F688..0x0021F6A8` | Keep `0xF8` bytes. Read its word at `+0x7C`, corresponding to `sp+0xD4`, after the helper. |
| Second copied record | `[sp+0x150,sp+0x248)`, 248 bytes; ROM `0x0021F704..0x0021F728` | `sp1CC` is the buffer word at `+0x7C`, not an independent uninitialized scalar. |
| Copied subrecord | `[sp+0x250,sp+0x2A0)`, 80 bytes; ROM `0x002200CC..0x0022010C` | Five 16-byte iterations copy object offsets `+0x44..+0x94`. Preserve the complete extent. |
| Two vector inputs | Three floats each at `sp+0x38` and `sp+0x48`; ROM `0x0021F314..0x0021F38C` | Replace scattered scalar assumptions with actual three-component access. The middle components contain zero bits. |
| Halfword interpolation input/output | Input base `sp+0x20`; output base `sp+0x18`; call at ROM `0x0021F040` | The helper reads through input `+0x10` and writes four halfwords, including output `sp+0x1E`. |
| First coordinate outputs | Words at `sp+0x248` and `sp+0x24C`; call at ROM `0x0021FBD4` | Fourth argument is the first pointer; fifth argument is the second pointer stored at outgoing `sp+0x10`. |
| Second coordinate outputs | Words at `sp+0x2A0` and `sp+0x2A4`; call at ROM `0x00220B3C` | Preserve the same five-argument order and subsequent signed-halfword narrowing. |

The interpolation input footprint is 18 bytes. The caller initializes seven named halfwords, not every byte of that footprint.
Do not invent initializers for `sp+0x28` or `sp+0x30` merely to make the scratch declaration look complete.
The helper's fourth output exists even though this caller consumes only its first three halfwords.

The copy helper at VMA `0x80093060` is accepted ROM owner `memcpy`, ROM `0x00023460`.
Its instruction contract copies from `a0` to `a1`, with size in `a2`; it returns the original destination.
Do not substitute standard destination-first `memcpy` or the separate `memcpy_bytewise` interface by name alone.

The copied-record helper is `func_0022EF50`, conditionally projected at VMA `0x801EBC80` under its accepted resource slab.
Its original instructions write record `+0x7C`, corroborating both subsequent stack reads. It remains a preceding action-mode obligation.
The scheduling call then uses record, raw kind `0x0E`, and that resulting word at VMA `0x801E34D8` (`func_002267A8`).

The subrecord call projects to accepted `func_001F197C`, VMA `0x801AE4EC`, under the combat overlay context.
Its accepted C contract takes three arguments: object, mutable state, and optional output pointer. Here the third argument is zero.
The candidate's fourth argument is a leftover register value, not a supported fourth parameter.
The 80-byte copied extent remains required even though the accepted helper's named state fields stop earlier.

## Complete dispatch and continuation

The entry fetches context pointer VMA `0x801CE8C0`, cursor field `+0x810`, and command bytes from context plus cursor plus `0x10`.
It compares command byte `+2` with context word `+4`. On equality, it clears that word before first dispatch.
On inequality, the continuation increments context words `+4` and `+8` before the common exit checks.
These field descriptions remain neutral; they do not rename raw command values as gameplay states.

| Dispatch | Guard and selector | Table VMA / ROM | Complete entries |
|---|---|---|---:|
| Initial command gate, ROM `0x0021EC44` | Unsigned `command[0]-0x16 < 44`; raw domain `0x16..0x41` | `0x801E6C48` / `0x00229F18` | 44 |
| Main command dispatch, ROM `0x0021F24C` | Unsigned `command[0]-1 < 63`; raw domain `1..0x3F` | `0x801E6CF8` / `0x00229FC8` | 63 |
| Nested record dispatch, ROM `0x0022030C` | Unsigned `record.field48-0x58 < 5`; raw domain `0x58..0x5C` | `0x801E6DF8` / `0x0022A0C8` | 5 |

All 112 literal entries resolve to 66 distinct aligned destinations inside the complete owner under accepted placement.
`dispatch-map.md` lists every raw selector, table slot, target VMA, and ROM destination. Duplicate targets remain explicit.
This proves guarded immutable-table structure only, not execution or unchanged runtime contents.

The initial table has seven destination groups. Raw `0x16` runs the longer setup path; `0x17` and `0x20` have separate paths.
Raw `0x1E/0x38` go directly to the common cursor-advance block. Raw `0x40` enters an internal wait check; `0x41` sets the exit flag.
The other listed values converge on the main setup/dispatch path. Its out-of-range branch also reaches that setup path.
Main setup resolves command byte `+3` through `func_0020C478`. It conditionally copies bytes `+4..+9` into record fields `+0xA5..+0xAA`.
The null-record branch and raw `0x33` bypass must survive reconstruction.

Main-dispatch groups include repeated three-slot loops, pointer lifecycle calls, copied-record calculations, coordinate/float work, and raw state writes.
Preserve bit tests against record `+0xA5`, null checks, command-byte sentinels, and precise helper order within each destination.
The nested table orders values `0x58,0x59,0x5A,0x5B,0x5C` into helper constants `0xA4,0xA6,0xA5,0xA7,0xA8`.
Do not sort those constants into a different order.

The physical head falls through into the continuation: a `lui` at ROM `0x00220FFC` feeds the `lw` at `0x00221000`.
Main raw command `0x3B` starts in the head and continues across that pair.
Main raw commands `0x3C/0x3D/0x3E` target ROM `0x0022108C/0x00221110/0x002211D8` directly.
Nine additional table slots target the continuation's shared cursor-advance block at ROM `0x002211E0`.
The direct-transfer census retains 63 head-to-tail transfers and one tail-to-head jump, plus the physical fallthrough.

The cursor-advance block calls `func_0021C970`, stores its result to context `+0x810`, and jumps back to ROM `0x0021EBF8`.
That re-entry is inside the existing frame. It must not become recursive public entry or an external call.
The remaining continuation includes three-slot cleanup, a twenty-record flag sweep, exit-flag checks, numeric recalculation, and the common restore.
All remain required even when a scratch path appears to return early.

## Candidate declarations and accepted interfaces

There are 205 literal `jal` sites to 72 addresses. No literal `j` leaves the complete owner.
The candidate declares 29 address-named internal destinations as functions. `evidence.json` lists each declaration and its actual internal ROM position.
For example, `func_001DC454` is the shared helper-call block at ROM `0x0021F724`; `func_001DDF10` is the cursor-advance block.
`func_001DDF50` is the exit-flag block; `func_001DE0D4` is the restore block. These are not new public helper interfaces.
Reconstruct their existing branches, joins, register-carried values, and fallthroughs within the complete owner.

The candidate also contains pointer-shaped placeholders, unprototyped declarations, and synthetic `M2C_UNK` returns.
Recheck pointer arithmetic in bytes. A typed `s32 * + 0x44` does not express an instruction's 68-byte offset.
Preserve `lb/lbu`, `lh/lhu`, `slt/sltiu`, masks, signed division, and the exact float conversion sequence.
Branch-likely delay-slot effects are conditional. Normal branch delay-slot stores execute on both outcomes.
Do not infer a changed declaration, filler storage, or scheduling workaround from historical byte/frame gaps.

`helper-map.md` covers all 72 addresses and all 205 sites. `evidence.json` also retains competing accepted placement projections.
Exact owner-start matches are navigation evidence, not proof that only that overlay can occupy the address at runtime.
Combat pose interfaces use accepted overlay 10; numeric renderer interfaces use conditional overlay 12. These contexts must remain qualified.
Future accepted W8, supplement, shared context, actor, completion, mode, and resolution contracts supersede scratch prototypes when bound.
The six terminal helpers `func_0021D7F0..func_0021E99C` remain members of the same fifteen-owner gate.

The frozen package's empty alias lists are not authoritative absence evidence.
Reading W7 registry `symbols[].address` directly finds aliases at five of these call addresses; the helper map records them.
This corrects navigation within this preparation only. The frozen predecessor remains unchanged.

## Current production prerequisites

| Existing table owner | ROM extent | Literal contents relevant here | Current contract |
|---|---|---|---|
| p4160 / `primary:4c428c51de43325a8afe`, `table_00229f18.s` | `[0x00229F18,0x0022A0C8)` | First 44 entries, then 63 entries, then four zero bytes | Original ASM data; no W7 auxiliary claimant |
| p4161 / `primary:131e7799e871c691a661`, `table_0022a0c8.s` | `[0x0022A0C8,0x0022A0E0)` | Five entries, then four zero bytes | Original ASM data; no W7 auxiliary claimant |

The zero words at ROM `0x0022A0C4` and `0x0022A0DC` are outside the guarded entry domains. Their bytes still belong to their complete owners.
EBBC has no W7 active C, linkage, multi-owner, or compilation-group contract. Bounded working snapshots also contain no EBBC target record.
The accepted multi-owner mechanism exists, but no EBBC production record yet binds both text rows.

Current policy admits one compiler `.rodata` region per target and preserves accepted auxiliary-row ownership.
Three table references across two existing data rows do not establish a ready production assignment.
The future writer must expose its actual compiler section/relocation requirements before claiming compatibility with existing contracts.
The Director must route any demonstrated representation change through the applicable structural/tooling process. This note designs or activates no partition.
Do not merge the data rows, drop a table, synthesize bytes, export internal labels, or use compilation groups to bypass these prerequisites.

## Bounded resumption order

1. Director binds the complete preceding action-mode and seven-member resolution results, current accepted source, and sole production ownership.
2. Future writer reauthenticates both text parts, table owners, ROM identity, and accepted helper declarations.
3. Resolve the 29 internal-label placeholders and real buffer views before tuning candidate size or frame shape.
4. Preserve all dispatch entries, guarded defaults, continuation paths, global stores, and helper calls in one complete-owner reconstruction.
5. Run an early focused linked diff under existing contracts. First inspect ABI, unresolved relocations, section shape, and complete-owner coverage.
6. If actual output needs unrepresented table ownership, stop that route and return exact evidence for Director assignment.
7. Iterate one target at a time; keep provisional results provisional until all fifteen members pass the one final normal verifier.

All original Combat and later High Attack obligations remain intact. This preparation grants no implementation activation or shortened wave gate.

## Evidence and verification

Ignored root: `build/combat-terminal-ebbc-preparation-r1/`.

| Artifact | SHA256 |
|---|---|
| `prepare.py` | `D42E4603273CEA4BCE5C5841FE8913CED548812E6899AB1107A95214BF95E3FC` |
| `evidence.json` | `27877F54E6FBCAD2989A13818FD70B4FE3FA6D746E21C6244209969BCA209199` |
| `dispatch-map.md` | `34AC024CF34423407762857FFFBED87F9F33459058A72E92C20906B38DD3A4E7` |
| `helper-map.md` | `2C146EF015DBCEA19F478AA10E4F5EF53FC3EB3602C3702D60B1697014DA037A` |
| `owner.txt` | `60D250E5CCD22741C2E9C73E3C3028FAB844D41DE159FD8AE6F353FB41E61C13` |

Reproduction command: `python build/combat-terminal-ebbc-preparation-r1/prepare.py`.
The script authenticates inputs, compares ROM words, projects accepted placements, and exports bounded tables/calls. It performs no compilation or database operation.
`owner.txt` retains original instruction comment text beside correctly projected address columns; its branch-comment addresses are not placement authority.
JSON transfer destinations use decoded words and accepted placement instead.

Checks pass: exact input hashes, complete contiguous text coverage, 112 in-owner table entries, 205 direct calls, and complete table-owner extents.
The owner/table results are deterministic. Working-config snapshot hashes can change with the authorized W8 writer and are explicitly separate from accepted W7 evidence.
Failed methods were limited to missing guessed source paths, PowerShell wildcard-path searches, and truncated oversized reads. Exact registry paths resolved those reads.
No failed command changed production state. Git reported inaccessible global-ignore/cache paths; scoped output checks remain available.

Changed surfaces are this report, its permanent claim, and the new ignored root only. No production C was generated or edited.
No compiler experiment, build, linked diff, verifier, runtime, database, source/configuration/tooling mutation, agent, branch, worktree, or Git mutation occurred.
No new canonical-document change is proposed. Director may link this preparation from the future wave after intake.
Protocol deviations: none. All assigned writes are released at terminal handoff.
