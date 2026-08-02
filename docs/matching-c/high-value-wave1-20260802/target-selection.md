# Target selection

## Status

The candidate target is selected, and its local byte-match proof passes. The revision-1 build blocker is historical: the accepted build then could not start because its pinned Phase 6 compiler manifest was missing.

This record is a worker result with review status `pending`. It is not an acceptance verdict.

## Correction - 2026-08-02

Revision 2 superseded the revision-1 manifest blocker. The canonical Phase 6 compiler manifest is present and authenticated. Its SHA-256 is 98C8ACC06A8FBF40DADBD25AE20C2539E8765E14EA12895158C37CC413D06C26.

The recovery evidence is recorded in docs/matching-c/high-value-wave1-20260802/aar/20260802-ob64-matching-c-high-value-wave1-manifest-recovery-r2-aar.md.

## Baseline

| Repository | Starting branch | Starting HEAD | Scope result |
|---|---|---|---|
| Parent research repository | `main` | `e6da653cfd5f0799bd03c3da74851f1bb5dfa8b6` | Read-only; unchanged |
| Canonical decomp repository | `main` | `fdd9b381f025c1887111d74ebdb3f783957962aa` | Evidence files only; no source owner or config was integrated |

The assignment baseline names parent HEAD `416705b9132c26861a4c6d60554a93a420a5157c`. The current parent HEAD differs, so parent evidence was treated as read-only context.

## Selected function

The selected structural function is `boot_resource_pool_acquire_release`, with original symbol `func_0000B33C`.

| Semantic name | Game meaning | Address | Address space | Evidence role |
|---|---|---|---|---|
| `boot_resource_pool_acquire_release` | Brackets resource-pool allocation and release passes | `0x0000B33C..0x0000B3E4` | z64 ROM range | Accepted function boundary and target bytes |
| `boot_resource_pool_acquire_release` | Runtime entry point | `0x8007AF3C..0x8007AFE4` | Boot RAM virtual range | Placement derived from the early-boot linear map |
| `g_resource_pool` | First resource-pool entry | `0x800A884C` | Boot RAM virtual address | Pool head and entry base used by both modes |
| `resource_allocate` | Allocates one resource block | `0x00001330` | z64 ROM offset | Direct callee in acquire mode |
| `resource_free` | Frees one resource block | `0x000016C4` | z64 ROM offset | Direct callee in release mode |

The selected range contains 168 bytes. Its accepted owner row is row `105`, primary ID `primary:d1d28e3025ceb53164a4`, section `.ob64.r0105`, and assembly chunk `0`.

## Requirement proof

| Assignment requirement | Direct evidence |
|---|---|
| Scheduler, resource-loader, movement, or resolver path | The target is in the boot resource-loader assembly directory and is called by both archive-load functions. |
| Accepted function boundary | The Phase 5/7 semantic row and assembly manifest agree on one 168-byte owner. |
| Not known-library code | The target is a named boot resource-pool routine, not a library owner. |
| More than 36 bytes | The target is 168 bytes. |
| Frame, call, loop, or multiple decisions | The target has a 32-byte frame, two direct calls, two loops, and acquire/release decisions. |
| Reuse or centrality | `func_0000B0B0` calls it twice, and `func_0000B29C` calls it twice. |
| Bounded review slice | One early-boot function and one source file are involved. |

The parent symbol record reports 32-byte frame size, callees at z64 ROM offsets `0x00001330` and `0x000016C4`, and four caller edges. The target remains below the early-boot linear-map boundary, so no overlay back-map is used.

## Competing target considered

`boot_resource_loader_callback_register` was considered because it is a 132-byte resource-loader function with three calls. It was not selected because its independent C reconstruction required seven compiler alias encodings, while the pool routine required one explicit delay-slot encoding. The pool routine also provides stronger review leverage through two resource-management modes and two loops.

## Supporting artifacts

- Original assembly: `asm/original/rev0/boot/boot_resource_pool_acquire_release.s`
- Parent symbol record: `..\\scripts\\ob64_symbols_v2.json`, function key `0x0000b33c`
- Accepted semantic owner: `config/splat/us_rev0.semantic.json`, row `105`
- Tracked assembly manifest: `asm/original/rev0/manifest.json`, chunk `0`
- Candidate C: `candidate/boot_resource_pool_acquire_release.c`
- Independent derivation: `independent-derivation.md`
- Task log and reproduction procedure: `task-log.md`
- Evidence index: `evidence-index.md`
