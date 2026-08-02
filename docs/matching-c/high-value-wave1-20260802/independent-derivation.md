# Independent derivation

## Status

The candidate C body is independently derived from the target assembly and accepted project records. The local compiled and linked text is byte-identical to the 168-byte target. Review status is `pending`.

The C source uses one GCC inline-assembly instruction. That instruction preserves the original `addu` encoding in a branch delay slot, and this deviation remains visible for review.

## Direct assembly observations

1. The function allocates a 32-byte stack frame and saves `ra`, `s1`, and `s0`.
2. A nonzero argument selects acquire mode.
3. Acquire mode reads the pool head from `g_resource_pool`.
4. A null pool head returns through the common epilogue.
5. Each acquire entry contains a destination pointer at offset `0` and a size at offset `4`.
6. Acquire entries are eight bytes apart.
7. Each size is passed to `resource_allocate`.
8. The allocated pointer is stored through the entry destination pointer.
9. The acquire loop stops when the next entry destination pointer is null.
10. Zero argument selects release mode.
11. Release mode performs the same null pool-head check.
12. Release mode passes each entry destination value to `resource_free`.
13. The release loop advances eight bytes and stops at a null next destination pointer.
14. Both modes restore the saved registers and return with no C result.

## C mapping

| Assembly behavior | C construct | Constant or address evidence |
|---|---|---|
| Acquire/release mode branch | `if (acquire != 0) ... else ...` | The first branch tests `$a0` against zero. |
| Pool entry shape | `ResourcePoolEntry` with two 32-bit fields | The load offsets are `0` and `4`, and entry stride is `8`. |
| Pool head | `resource_pool` | Effective boot RAM address `0x800A884C`. |
| Acquire call | `func_00001330(size)` | The target JAL resolves to boot RAM `0x80070F30`. |
| Release call | `func_000016C4(ptr)` | The target JAL resolves to boot RAM `0x800712C4`. |
| Entry traversal | `entry++` | The assembly advances the entry base by `8`. |
| Acquire size index | `offset += 8` and pool-base byte arithmetic | The assembly computes pool-base plus `4` plus an eight-byte index. |
| Sentinel | `entry->slot != 0` | Each loop reads the next entry destination pointer. |

The `resource_pool` declaration is an external symbol. The compiler and linker resolve it to the boot RAM pool address without adding C data bytes.

## Delay-slot deviation

The KMC compiler emits `move $s1,$0` for a zero initialization. GNU assembler encodes that alias as `or $s1,$0,$0`, while the target word is `addu $s1,$0,$0`.

The candidate therefore emits `asm("addu %0,$0,$0" : "=r"(offset))` after a standalone `asm(".set noreorder")` directive. The compiler places the instruction in the null-pool branch delay slot, and the object section then matches the target bytes exactly.

This is an exact encoding repair, not an imported implementation. No external-derived C, assembly, expression, or documentation was inspected.

## Local exact proof

The candidate object's text section contains 168 bytes and hashes to the object-text SHA-256 22A134DAAC883CC9F33D2B7CBE82745E2DDCD284EBB8F1D1899B5F30ED6AABF9.

The linked target text contains 168 bytes and hashes to the linked-text SHA-256 B5B9786B86B3BA207A56847F26694E126F19667DAB49498E93607F9C4939A0C9.

The candidate object contains 13 `.rel.text` entries for the resource-pool symbol, two direct calls, and the local loop jump. The standalone link resolves those references to the target words and preserves the target placement at boot RAM `0x8007AF3C`.

## Historical revision-1 limit

The local exact proof did not establish full-ROM integration. Revision 1 recorded that the accepted Phase 8 build stopped before compilation because its pinned Phase 6 manifest was absent from the canonical repository.

## Correction - 2026-08-02

Revision 2 superseded the revision-1 manifest blocker. The canonical Phase 6 compiler manifest is present and authenticated. Its SHA-256 is 98C8ACC06A8FBF40DADBD25AE20C2539E8765E14EA12895158C37CC413D06C26.

The recovery evidence is recorded in docs/matching-c/high-value-wave1-20260802/aar/20260802-ob64-matching-c-high-value-wave1-manifest-recovery-r2-aar.md.
