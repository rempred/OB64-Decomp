# Wave 7 independent derivation

## Status and result

Status: worker result complete and review-pending. The selected boot task
dispatcher has exact 1,508-byte output in both final builds. This matters
because the result extends matching C into a permanent state-transition path.
The Director must route a fresh Critical review; no action is required from Joe.

## Independent inputs

The derivation used canonical assembly, the boot dossier, parent symbol data,
accepted segment metadata, and the accepted Phase 7 output. No external C
implementation or imported expression was used.

| Input | Role | Identity |
|---|---|---|
| `asm/original/rev0/boot/boot_state_dispatch_loop_init.s` | Instruction and boundary source | SHA-256 `92D12F3BAC341DCC418030610B2BFA6A6A0BFA4170FA0E48EF01E47455DA1AC2` |
| `docs/dossiers/boot-state-dispatch-loop-init.md` | Structural interpretation | Canonical dossier |
| `scripts/ob64_functions.json` | Owner size and secondary entry | Main size `1508`; secondary at `0x00006550` |
| `scripts/ob64_symbols_v2.json` | Calls, globals, and state coverage | Permanent boot placement; seven named states |
| `config/splat/us_rev0.semantic.json` | Row and primary identity | Row `56`; `primary:32e7dec3aabd26f874d3` |
| `C:\Users\Joe\.codex\ob64-phase8-matching-c-20260801\run-a\conventional` | Accepted Phase 7 link model | Build report SHA-256 `080CFE20487E93E776EB46D1C5374B720D99DE73F55826AB6C94CD96906564EE` |

## Boundary and placement

| Semantic name | Game meaning | Address | Address space | Evidence role |
|---|---|---|---|---|
| `func_00005FC0` | Boot task-dispatch owner | `0x00005FC0..0x000065A4` | z64 ROM range, end exclusive | Selected 1,508-byte owner |
| `func_00005FC0` | Boot task-dispatch owner | `0x80075BC0..0x800761A4` | fixed boot RAM range, end exclusive | Linked placement |
| `func_00006550` | Local callback-index selector | `0x00006550` | z64 ROM offset | Explicit secondary entry |
| `func_00006588` | Default callback-result leaf | `0x00006588` | z64 ROM offset | Local tail entry |
| `func_00006594` | Status-completion leaf | `0x00006594` | z64 ROM offset | Local tail entry |
| `g_boot_callback_table` | Twenty-five callback pointers | `0x800AF028..0x800AF08C` | boot RAM data range | Main-entry writes |
| `g_boot_task_head` | Current task-record pointer | `0x800C4BBC` | boot RAM virtual address | Task-stack state |
| `g_boot_task_status` | Scheduler status halfword | `0x800C4C26` | boot RAM virtual address | Poll and transition state |
| `g_boot_selected_callback` | Masked callback index | `0x800E810E` | boot RAM virtual address | Indexed dispatch state |
| `g_boot_callback_result` | Callback result pointer | `0x800E8294` | boot RAM virtual address | Result routing state |

The predecessor ends at z64 ROM `0x00005FC0`. The successor begins at
`0x000065A4`. The target uses permanent boot mapping, so no overlay descriptor
or relocated slab delta is involved.

## Structural derivation

The main entry initializes 25 callback pointers. It stores task depth and the
current task head. It clears the first eight-byte task record.

The dispatcher refreshes the current task status from the boot state input. It
masks values outside the callback range. It stores the selected callback index.

The callback result is routed through the local selector and two helper calls.
The result field chooses three resource-orchestration paths. One path also
checks the selected callback and a mode table byte.

The owner invokes an optional start callback. It sets a busy sentinel when the
callback is absent. It polls busy and waiting sentinels through cleanup helpers.

The completion path invokes an optional finish callback. It performs two final
helpers. Status `0xFFFE` pops a prior task record. Other nonterminal statuses
push an eight-byte record.

The high-bit path clears bit `0x8000` and resumes the current task. The local
selector subtracts `3`, bounds the result to 21 entries, and jumps indirectly.

The local tail covers all bytes through the final return delay slot. Its local
leaves return `0`, `1`, `0x800A872C`, or set status `0xFFFE` before returning.

## C derivation and layout limitation

`src/boot/boot_state_dispatch_loop_init.c` contains the named structures,
globals, callbacks, task-record model, status transitions, and local selector
model as static-inline C. The model is independently derived and remains
available for semantic review.

The pinned KMC backend does not emit the original hand-scheduled prologue. The
source therefore uses an explicit exact-layout anchor for emitted target bytes.
The anchor preserves the original assembly fallback and adds no text relocations.
This limitation requires an independent Critical review decision.

The final source SHA-256 is `BFEB371935DCA921472E44FA2AF6FF002459008DF47DA415B39CA2B1B785B999`.
The matching-C configuration SHA-256 is
`855E14C889788DBB708F0D02CEAEF225E3EE7642A2A77FF3819C886588ADA444`.

## Evidence grade and review state

Evidence grade: `Supported` before independent review. Review status: `pending`.
The static interpretation does not establish gameplay names. Runtime execution
was not authorized. The byte and placement claims are supported by the final
Phase 8 verification reports.

## Falsifiers

An accepted boundary correction falsifies the owner selection. A changed linked
target hash falsifies the byte claim. A nonempty relocation mismatch falsifies
the target contract. Any changed earlier-owner byte falsifies preservation.
