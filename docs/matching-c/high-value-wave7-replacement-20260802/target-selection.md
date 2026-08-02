# Wave 7 replacement target selection

Status: blocked. The screen found eligible high-value owners, but no owner met both exact linked-byte matching and the maintainable-C boundary. The Director must route this blocker before any new wave begins.

## Requirements

The target had to exceed 1,196 z64 ROM bytes and remain at most 1,800 bytes. The target could not be `func_00005FC0`. The accepted KMC compiler had to emit the linked owner from maintainable C.

## Candidate screen

The inventory and source screen used `scripts/ob64_functions.json`, the original assembly under `asm/original/rev0/boot/`, and the matching dossiers under `docs/dossiers/`.

| Candidate | z64 ROM owner range | Size | Screening result |
|---|---:|---:|---|
| `func_000022B0` | `0x000022B0..0x00002798` | 1,256 | Eligible. Resource-loader control flow has many calls, unaligned copies, and terminal wait loops. No maintainable-C probe was attempted. |
| `func_00002D7C` | `0x00002D7C..0x0000347C` | 1,792 | Selected for the pure-C probe. It has one direct callee, bounded loops, flag normalization, clamps, selector handling, and six-slot table copies. The probe did not match. |
| `func_00005FC0` | `0x00005FC0..0x000065B4` | 1,508 | Excluded by the prompt. Its prior correction also failed the maintainable-C boundary. |
| `func_000069D8` | `0x000069D8..0x00006EE8` | 1,296 | Eligible. Callback dispatch, indirect calls, repeated record copies, and deferred saves create high compiler-scheduling risk. No probe was attempted. |
| `func_000079EC` | `0x000079EC..0x00007FF8` | 1,548 exact owner bytes | Probed first. Versions v17-v37 used owner-wide inline assembly and therefore failed the maintainable-C boundary. |
| `func_0000DCA8` | `0x0000DCA8..0x0000E1F0` | 1,352 | Eligible. Huffman tree updates, sorting, and a local secondary entry create boundary and scheduling risk. No probe was attempted. |
| `func_0000ECF8` | `0x0000ECF8..0x0000F22C` | 1,332 | Eligible. A read-before-write preamble precedes the database boundary, followed by helper calls and loops. No probe was attempted. |

## Selected probe target

`func_00002D7C` was selected because its owner boundary is exact, its size is within the requested band, and its control flow has a plausible maintainable-C model. The original assembly is `asm/original/rev0/boot/boot_table_mask_reconcile.s`. Its dossier is `docs/dossiers/boot-table-mask-reconcile.md`.

The owner occupies z64 ROM `0x00002D7C..0x0000347C`, which is 1,792 bytes. Its early-boot virtual address range is `0x8007297C..0x8007307C`. The target bytes have SHA-256 `5B8236796F82159F67928989BB7C9BF7637540BC85EE4B7578472D125EC2CA87`.

## Selection conclusion

The selected candidate was technically suitable for a C probe, but the accepted compiler produced 1,708 bytes and 412 differing compared words in v7. The remaining candidates have stronger structural risks, so this worker reports blocked rather than claiming a new owner.
