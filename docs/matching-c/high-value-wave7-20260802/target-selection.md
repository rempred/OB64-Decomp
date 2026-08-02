# Wave 7 target selection

## Status and result

Status: worker result complete and review-pending. The selected owner is
`func_00005FC0`, a 1,508-byte permanent boot state-dispatch and task-loop
owner. This matters because it adds a larger resource-orchestration control
path with an explicit secondary entry.

Independent Critical review remains pending. No action is required from Joe.

## Mission identity

| Item | Recorded value |
|---|---|
| Assignment | `ob64-decomp-matching-c-high-value-function-wave7-20260802`, revision 1 |
| Worker role | Research and implementation worker |
| Canonical repository | `C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp` |
| Canonical branch and starting HEAD | `main`, `e153585d7d1cb860d82ea8a905e4831a7b197a7c` |
| Parent repository starting HEAD | `ac9c21eb498cfef3009b0df6c62e3bf090f394c5`; read-only |
| Integration repository starting HEAD | `b22815518f060425519c08df19b617af8b5099a7`; read-only |
| Prompt canonical baseline | `e153585d7d1cb860d82ea8a905e4831a7b197a7c` |
| Canonical code-region SHA-256 | `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409` |
| Canonical ROM SHA-256 | `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A` |

The parent HEAD differs from the prompt baseline. The parent stayed read-only.
This difference did not change the canonical target or the mission boundary.

## Selection requirements

| Requirement | Result | Evidence |
|---|---|---|
| Exactly one owner | PASS | This record selects only `func_00005FC0`. |
| More than 1,196 z64 ROM bytes | PASS | The owner spans 1,508 bytes. |
| At most 1,700 z64 ROM bytes | PASS | The owner ends after 1,508 bytes. |
| Preferred control path | PASS | The owner initializes callbacks and services task/status transitions. |
| At least seven meaningful structural features | PASS | It has callback-table setup, task-stack setup, status polling, indexed callback dispatch, callback-result routing, optional callbacks, task pop, high-bit transition, task push, and a secondary jump table. |
| More than a linear wrapper or leaf | PASS | The owner contains a loop, multiple branches, three indirect calls, direct helper calls, and a local secondary entry. |
| Proven boundary | PASS | The owner ends after the return delay slot at z64 ROM `0x000065A0`; the next owner begins at `0x000065A4`. |
| Proven secondary-entry status | PASS | Parent symbol data records the local secondary entry at z64 ROM `0x00006550`, offset `0x590`. |
| Proven placement | PASS | The accepted Phase 5/7 model uses section `.ob64.r0056` at runtime virtual address `0x80075BC0`. |
| Preferred runtime class | PASS | Parent symbol data places the owner at the same permanent boot address in all seven named states and 21 snapshots. |

## Selected owner and boundaries

| Semantic name | Game meaning | Address | Address space | Evidence role |
|---|---|---|---|---|
| `func_00005FC0` | Boot state dispatch and task-loop owner | `0x00005FC0..0x000065A4` | z64 ROM range, end exclusive | Selected owner and exact byte slice |
| `func_00005FC0` | Boot state dispatch and task-loop owner | `0x80075BC0..0x800761A4` | fixed boot RAM range, end exclusive | Accepted runtime placement |
| `func_00005D9C` | Predecessor record checksum/signature owner | `0x00005D9C..0x00005FC0` | z64 ROM range | Boundary predecessor |
| `func_000065A4` | Accumulator seed wrapper | `0x000065A4..0x000065E4` | z64 ROM range | Boundary successor |
| `func_00006550` | Local callback-index selector | `0x00006550..0x00006584` | z64 ROM range | Accepted secondary entry |
| `func_00006588` | Local callback pointer leaf | `0x00006588..0x00006594` | z64 ROM range | Callback-table target inside owner |
| `func_00006594` | Local status-completion leaf | `0x00006594..0x000065A4` | z64 ROM range | Local leaf and exact tail coverage |
| `g_boot_callback_table` | Twenty-five callback pointers | `0x800AF028..0x800AF08C` | boot RAM data range | Main-entry initialization destination |
| `g_boot_task_head` | Current task-record pointer | `0x800C4BBC` | boot RAM global | Task-stack state destination |
| `g_boot_task_status` | Scheduler status halfword | `0x800C4C26` | boot RAM global | Poll, push, pop, and completion state |
| `g_boot_selected_callback` | Masked callback index | `0x800E810E` | boot RAM global | Indexed callback dispatch input |
| `g_boot_callback_result` | Callback result pointer | `0x800E8294` | boot RAM global | Result routing input |

The main entry returns after the task loop sees either a completion signal from
the status helper or a terminal status of `0xFFFC`.

The local secondary entry subtracts `3`, bounds the result to 21 entries, and
dispatches through the jump table at boot RAM `0x800ADF30`. Its local leaves
return `0`, `1`, `0x800A872C`, or set status `0xFFFE` before returning.

The C derivation models the callback table, task records, status transitions,
result routing, polling, cleanup, and local selector dispatch with structural
names. The pinned KMC backend did not reproduce the hand-scheduled entry
prologue, so the source preserves an explicit exact-layout anchor for emitted
bytes. Critical review must decide whether this backend limitation satisfies the
maintainable-C gate.

## Structural value

Direct canonical assembly and the canonical boot dossier show these features:

1. The main entry writes 25 callback pointers to the callback table.
2. It initializes task depth, current task head, and the first eight-byte record.
3. It refreshes the current task halfword from the boot state input.
4. It masks an out-of-range task value before indexed callback dispatch.
5. It stores the callback result and routes its record field through two helpers.
6. It handles negative, selected-state, and high-bit callback-result paths.
7. It invokes an optional callback stored in the current task record.
8. It polls two wait sentinels and performs cleanup callbacks.
9. It pops a prior task record for status `0xFFFE`.
10. It clears the high status bit and resumes the current task.
11. It pushes an eight-byte task record for other nonterminal statuses.
12. The local secondary entry performs a bounded indirect jump-table dispatch.

These are structural observations. They do not prove final gameplay meanings for
the callback pointers, task records, status values, or helper functions.

## Rejected alternatives

| Candidate | Reason not selected |
|---|---|
| `func_000022B0` | It is eligible at 1,256 bytes, but its static role is a narrower early resource-loader path. The selected owner has a larger state-transition loop and an explicit secondary entry. |
| `func_000065E4` | It is a 320-byte successor and fails the minimum-size gate. |
| `func_0026CE74` | It is eligible at 1,248 bytes, but the preferred permanent boot scheduler path provides stronger high-value control evidence and avoids adding another overlay relocation contract. |

## Selection evidence inputs

| Input | Evidence role |
|---|---|
| `asm/original/rev0/boot/boot_state_dispatch_loop_init.s` | Original instructions, successor boundaries, and local entries |
| `asm/original/rev0/boot/boot_resource_probe_record_checksum_signature.s` | Predecessor boundary |
| `asm/original/rev0/boot/boot_mode_message_accumulator_seed_wrapper.s` | Successor boundary |
| `docs/dossiers/boot-state-dispatch-loop-init.md` | Canonical structural dossier and runtime placement summary |
| `config/splat/us_rev0.semantic.json` | Accepted row `56`, ROM range, and owner identity |
| `config/splat/us_rev0.overlay-linker-inputs.json` | Accepted row and linker identity |
| `scripts/ob64_functions.json` | Parent size, frame, and secondary-entry record |
| `scripts/ob64_symbols_v2.json` | Parent calls, accesses, runtime placement, and state coverage |
| `build/setup/verify-setup-report.json` | Canonical setup and ROM identity |

## Claim record

### Claim

`func_00005FC0` is an eligible and independently bounded Wave 7 target.

### Evidence grade

`Supported` before independent review.

### Review status

`pending`.

### Scope and limits

This record covers static target selection, boundary proof, and byte-oriented
placement. It does not establish gameplay semantics or accept the worker result.

### Falsifier

An accepted boundary correction, relocation mismatch, linked-byte mismatch, or
unexpected change to an earlier owner invalidates this selection.

### Product consequence

The owner is suitable for one fresh Critical review slice. No editor change is
authorized by this worker result.
