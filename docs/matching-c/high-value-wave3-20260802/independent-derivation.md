# Independent derivation: `func_0000BC8C`

## Status and result

The independent derivation is complete and review-pending. The C source
reproduces the selected 524-byte resolver owner and its accepted placement.
The Director must route this result for fresh Critical review.

The derivation uses the canonical Rev 0 assembly, the accepted owner model,
the local resource dossier, and the accepted KMC toolchain. No external-derived
implementation or expression was used. No action is required from Joe during
worker intake.

## Direct assembly observations

1. The function allocates a `0x138`-byte stack frame.
2. The prologue saves `s0` through `s3` and `ra`.
3. The record pointer remains in `s1`.
4. The context pointer remains in `s3`.
5. The high bit of record byte `0` selects the flagged path.
6. The flagged path allocates and initializes a buffer.
7. The flagged path calls the operation dispatcher with six arguments.
8. The normal path starts at record offset `0x16`.
9. Slash-prefixed `K` and `X` paths scan until a slash or terminator.
10. An empty scanned path selects the default path string.
11. The path helper receives the scratch buffer and selected path.
12. The type field is the high nibble of the halfword at record offset `0x124`.
13. Type `0x8000` scans a four-byte directory-pointer table.
14. The directory helper compares record bytes at offset `1` with each entry.
15. Each successful directory comparison increments the match count.
16. A null directory entry enters the missing-entry diagnostic path.
17. The normal path allocates and initializes the selected resource buffer.
18. The normal path passes the scratch buffer and match count to the dispatcher.
19. A nonzero record field at offset `0x118` enables result comparison.
20. A mismatch compares the dispatcher result with record halfword `0x116`.
21. Type `0x4000` calls the type-specific diagnostic helper.
22. Other types call the common diagnostic helper.
23. Every path restores the saved registers through the common epilogue.

## Semantic address map

| Semantic name | Game meaning | Address | Address space | Evidence role |
|---|---|---|---|---|
| `boot_resource_record_resolve_load` | Per-record resource resolver and load preparation | `0x0000BC8C..0x0000BE98` | z64 ROM range, end exclusive | Accepted 524-byte owner |
| `boot_resource_record_resolve_load` | Runtime placement of the owner | `0x8007B88C..0x8007BA98` | boot RAM virtual range, end exclusive | Phase 8 linked section |
| `g_resource_template` | Resource initialization template | `0x800AE27C` | boot RAM virtual address | `HI16` and `LO16` link aliases |
| `g_resource_directory_table` | Directory pointers scanned for matching record IDs | `0x800A8750` | boot RAM virtual address | Effective value of encoded `lui 0x800B` and `addiu 0x8750` |
| `func_00001330` | Resource buffer allocator | `0x80070F30` | boot RAM virtual address | Flagged and normal allocation calls |
| `func_0000F4E4` | Resource buffer initializer | `0x8007F4E4` | boot RAM virtual address | Flagged and normal initialization calls |
| `func_0000F450` | Path preparation helper | `0x8007F450` | boot RAM virtual address | Normal-path call |
| `func_0000BE98` | Resource operation dispatcher | `0x8007BA98` | boot RAM virtual address | Six-argument dispatch call |
| `func_00092F50` | Directory-entry matcher | `0x80092F50` | boot RAM virtual address | Directory scan helper |
| `func_0000BF90` | Common diagnostic helper | `0x8007BB90` | boot RAM virtual address | Error and mismatch reporting |
| `func_0000BFC0` | Type-specific diagnostic helper | `0x8007BBC0` | boot RAM virtual address | Type `0x4000` reporting |

The accepted dossier labels the directory table `0x800B8750`. The original
instruction pair uses a sign-extended `addiu` low half. The linker alias is
therefore `0x800A8750`, which preserves the original high-half instruction.

All selected code lies below the early-boot relocation boundary. The placement
uses the accepted early-boot linear class. No overlay back-map is required.

## C mapping

| Assembly behavior | C construct | Constant or address evidence |
|---|---|---|
| Record and context register roles | `record`, `context`, and fixed register variables | Prologue copies record to `s1` and context to `s3` |
| Flagged-path allocation | `func_00001330(record[0x0C])` | `lw a0,12(s1)` before the allocator call |
| Flagged-path initialization | `func_0000F4E4(scratch, template, buffer, size)` | Scratch offset `0x18`, template alias, and record size |
| Flagged-path dispatch | Six-argument `func_0000BE98` call | Record value at `0x08`, flag mask `0x7F`, and zero scratch argument |
| Slash path normalization | Conditional scan over `path` | Slash byte `0x2F`, type bytes `K` and `X`, default path literal |
| Path preparation | `func_0000F450(scratch, path)` | Scratch pointer at stack offset `0x18` |
| Type selection | High nibble mask `0xF000` | Halfword load from record offset `0x124` |
| Directory scan | Infinite C loop over `g_resource_directory_table` | Four-byte pointer stride and null terminator |
| Directory comparison | `func_00092F50(record + 1, entry, 5)` | Record suffix, table entry, and limit `5` |
| Match count | `match_count` increment after each successful comparison | `addiu s2,s2,1` in the loop delay slot |
| Normal allocation | Inline allocator call with record size | Preserves `lw a0,12(s1)` and allocator delay slot |
| Normal initialization | `func_0000F4E4` with scratch and match buffer | Exact `a2` and `a3` argument setup |
| Result validation | Dispatcher result, buffer clear, and field comparison | Record offsets `0x118` and `0x116` |
| Diagnostic tail | Inline control-flow labels around C path labels | Preserves local jumps, delay slots, and message literals |

The source uses constrained inline assembly only where the KMC compiler would
otherwise select a different `move` alias or delay-slot schedule. These blocks
preserve `addu` encodings, branch ordering, and local control-flow edges. They
do not copy the original function body.

## Byte and relocation evidence

The retained original assembly SHA-256 is
`B77775732A4D474596FCEB6369CF286A784ED86AC2A1442B1D60B94BCC9DB04E`.

The final C source SHA-256 is
`1DD83FE80C651B037F67238CA6E6FF03C441469F869F1630F7316D0C89D73068`.

The compiled object `.text` section is 524 bytes. Its SHA-256 is
`5302930D9D0E9D22D8AEF4EF57C2B57B111E37DDB2882362EF6C1427BFED09B0`.

The linked target section is 524 bytes. Its SHA-256 is
`23B9E078BC45A44074A7F23B9C4C8384D8C39D5A8D39951F39739F11BDCC5424`.

The object contains 21 `.rel.text` records and one `.rel.pdr` record. Phase 8
rechecks every relocation record, section placement, owner symbol, and fallback
comparison object.

## Claim record

### Claim

`func_0000BC8C` is an independently derived C implementation of the accepted
boot resource resolver and load-preparation owner.

### Evidence grade

`Supported` before independent review.

### Review status

`pending`.

### Scope and context

This result covers static Rev 0 matching-C derivation and reproducible linking.
It does not cover runtime execution, gameplay behavior, or editor integration.

### Supporting artifacts

- `asm/original/rev0/boot/boot_resource_record_resolve_load.s`
- `src/boot/boot_resource_record_resolve_load.c`
- `config/phase8/matching-c.json`
- `docs/dossiers/boot-resource-decode-subsystem-B030-F22C.md`
- `build/setup/verify-setup-report.json`
- Root A and root B Phase 8 reports listed in `evidence-index.md`

### Competing interpretation

The function may be a resource-record validator rather than a complete loader.
Its directory scan, buffer initialization, and dispatcher call still establish
the required resolver-path selection value.

### Falsifier

An independent byte mismatch, relocation mismatch, boundary correction, or
owner-model drift would falsify this derivation.

### Known limits

The result proves static byte identity and link placement. It does not prove
the runtime meaning of every record field, directory entry, or diagnostic text.

### Product consequence

The target is suitable for fresh Critical review. No editor change or stronger
semantic product name is authorized by this worker result.
