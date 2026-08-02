# Independent derivation: `func_00007688`

## Status and result

The independent derivation is complete and review-pending. The C source
reproduces the selected 224-byte owner, including its accepted secondary entry.
The Director must route this result for fresh Critical review.

The derivation uses only the canonical Rev 0 assembly, accepted owner model,
and accepted local toolchain. No external-derived implementation was used.

## Direct assembly observations

1. The primary entry allocates a 32-byte stack frame.
2. The primary entry saves `ra`, `s1`, and `s0`.
3. The primary entry calls `0x80077F80` before reading the status field.
4. The status field is a halfword at boot RAM `0x800C4C26`.
5. A status value of `0xFFFF` skips the record scan.
6. The scan uses six records with a stride of `0xA8` bytes.
7. The record base is boot RAM `0x800E82C8` plus the scan offset.
8. The first record test reads a halfword at record offset `0`.
9. The first record test requires flag bit `0x8000`.
10. The second record test reads a byte at record offset `3`.
11. The second record test requires bit `0x04`.
12. A record passing both tests calls `0x80077F88` with its slot index.
13. The primary loop increments the slot index after every record.
14. The primary loop increments the byte offset by `0xA8` after every record.
15. The primary loop ends when the slot index reaches six.
16. The accepted owner includes a secondary entry at ROM offset `0x00007714`.
17. The secondary entry scans the same six records.
18. The secondary entry tests the halfword flag at record offset `0`.
19. The secondary entry compares the word at record offset `0x10` with `a0`.
20. The secondary entry returns the matching slot index.
21. The secondary entry returns `-1` when no record matches.

## Semantic address map

| Semantic name | Game meaning | Address | Address space | Evidence role |
|---|---|---|---|---|
| `boot_state_slot_flagged_dispatch_lookup` | Primary six-record flagged-slot scan | `0x00007688..0x00007714` | z64 ROM range | C primary body and exact linked bytes |
| `boot_state_slot_flagged_dispatch_lookup_secondary` | Alternate slot lookup entry | `0x00007714..0x00007768` | z64 ROM range | C secondary body inside the same owner |
| `g_state_slot_status` | Status gate halfword | `0x800C4C26` | boot RAM virtual address | Link alias and halfword load |
| `g_state_slot_records` | First state-slot record | `0x800E82C8` | boot RAM virtual address | Link alias and record loads |
| `boot_state_slot_noop_return_tail` | Preliminary call target | `0x80077F80` | boot RAM virtual address | Link alias for the first call |
| `func_00008388` | Per-record helper | `0x80077F88` | boot RAM virtual address | Link alias for flagged-slot dispatch |

The primary entry uses early-boot linear placement. The corresponding z64 ROM
range is below the configured early-boot boundary, so no overlay back-map is
needed.

## C mapping

| Assembly behavior | C construct | Constant or address evidence |
|---|---|---|
| Save slot index in `s1` | `register int slot asm("$17")` | Primary register use and call argument |
| Save record offset in `s0` | `register unsigned int offset asm("$16")` | Primary address calculation and stride update |
| Status gate | `g_state_slot_status != 0xFFFF` | Halfword load at `0x800C4C26` |
| Record base | `g_state_slot_records + offset` | Base `0x800E82C8` and repeated `s0` use |
| Record flag test | `*(volatile unsigned short *)record & 0x8000` | Halfword offset `0`, mask `0x8000` |
| Record mode test | `*(volatile unsigned char *)(record + 3) & 0x04` | Byte offset `3`, mask `0x04` |
| Per-record dispatch | `func_00008388(slot + zero)` | JAL target `0x80077F88`, `a0` delay slot |
| Six-record loop | `do ... while (slot < 6)` | Signed `slti` at primary loop tail |
| Alternate lookup result | `return slot + zero` | Secondary jump delay slot copies `a1` to `v0` |
| Alternate miss result | `return -1` | Final `addiu v0, zero, -1` |

The secondary C function `func_00007714` models the accepted alternate entry.
It is emitted into the same target section and does not add another Phase 8
target. The final `.size` directive keeps `func_00007688` as the 224-byte
owner required by the accepted semantic row.

## Encoding controls

The KMC compiler emits `move` aliases for several zero-register copies. The
original owner uses the `addu` encodings at the corresponding delay slots.

The source uses constrained inline assembly for those encodings. The source
also emits `.set noreorder` before the primary branch-likely sequence. These
controls preserve the original delay-slot placement without importing a
function implementation.

The source binds selected C variables to `$s0`, `$s1`, `$a1`, `$v1`, and `$zero`.
Those bindings preserve the observed register roles and exact instruction
selection. The focused object contains 15 relocation records, including two
`.rel.pdr` records for the primary and alternate entry symbols.

## Claim record

### Claim

The C source independently expresses the primary scan and accepted alternate
lookup entry for `func_00007688`.

### Evidence grade

`Supported` before independent review. The derivation maps every tested field,
constant, call, loop bound, return path, and placement address to assembly.

### Review status

`pending`.

### Scope and context

Static Rev 0 matching-C derivation only. Runtime semantics remain unverified.

### Supporting artifacts

- `asm/original/rev0/boot/boot_state_slot_flagged_dispatch_lookup.s`
- `src/boot/boot_state_slot_flagged_dispatch_lookup.c`
- `config/phase8/matching-c.json`
- `C:\\Users\\Joe\\.codex\\ob64-matching-c-wave2-20260802-focused-a\\focused-proof.json`

### Independent corroboration

The focused linked text and extracted `.word` reference are both 224 bytes.
Both hashes are `4398E1D52DE73D83846A34DDB7A4A97EA669E8DA66DA321F98CFF91C0BF9BC31`.
The fresh Phase 8 verifier reproduces this target in two external roots.

### Competing interpretation

The state-slot path is scheduler-like by structure, but the exact gameplay role
of the status field and per-record helper remains unresolved.

### Falsifier

An independent disassembly mismatch, relocation mismatch, or accepted boundary
correction would falsify this derivation.

### Known limits

The result proves static byte identity and link placement. It does not prove
runtime behavior, field semantics, or the meaning of `func_00008388`.

### Product consequence

The target is suitable for Critical review as a structural matching-C slice.
No editor change or semantic product naming is authorized by this result.
