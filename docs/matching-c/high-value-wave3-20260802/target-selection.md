# Target selection

## Status and result

Target selection is complete and review-pending. The selected owner is
`func_0000BC8C`, a bounded resolver and load-preparation function. No movement
candidate met the assignment boundary and evidence requirements. No action is
required from Joe before independent Critical review.

## Baseline

| Item | Recorded value |
|---|---|
| Canonical repository | `C:\\Users\\Joe\\Projects\\OgreBattlel64\\OB64 Decomp` |
| Canonical branch | `main` |
| Canonical HEAD | `b0768ff413f6d31c7d80988ecda941fcd2487462` |
| Parent HEAD | `bed88d069e2f61b941c34907bc49f868de6f6e93` (read-only) |
| Integration evidence HEAD | `b22815518f060425519c08df19b617af8b5099a7` (read-only) |
| Phase 5A product root | `C:\\Users\\Joe\\Projects\\OB64-Decomp-Hijs-Integration\\docs\\external-intake\\phase5-boundary-segment-reconciliation-static-20260731` |
| Canonical ROM SHA-256 | `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A` |
| Canonical code-region SHA-256 | `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409` |
| Setup baseline | PASS; `build/setup/verify-setup-report.json` records `ok: true` and 21 passing checks before source edits |

The parent HEAD differs from the assignment snapshot. The parent remains
read-only, so this difference does not affect the canonical mission surface.

## Selection requirements

| Requirement | Result | Evidence |
|---|---|---|
| One target only | PASS | The selected source and configuration add one owner. |
| More than 224 bytes | PASS | The owner spans 524 z64 ROM bytes. |
| At most 640 bytes | PASS | The owner ends after 524 bytes. |
| Preferred movement or resolver path | PASS | The accepted subsystem dossier identifies a per-record resolve/load path. |
| Accepted boundary | PASS | The retained assembly ends at `jr $ra` and its stack-restore delay slot. |
| Not known-library code | PASS | The owner is boot resource logic, not a standard-library symbol. |
| Three structural features | PASS | The owner has multiple calls, two loops, and multiple branch decisions. |
| Bounded review slice | PASS | The owner is one early-boot linear section with no secondary entry. |
| Reuse or leverage | PASS | The resolver sits between archive record decoding and the nine-way operation dispatcher. |

## Rejected preferred-path candidates

Static search found no bounded executable owner explicitly identified as movement
or pathfinding code. The `MakeRouteList` text is in chunk-20 data, not code.
The nearby table-scan leaf `func_00145210` is only 112 bytes. The encounter
dispatcher `func_00145290` is 344 bytes, but accepted evidence does not prove
movement or resolver meaning. It remains outside this slice.

No scheduler candidate was selected because the resolver candidate passed the
preferred-path requirement. No generic resource-loader fallback was needed.

## Selected owner

| Semantic name | Game meaning | Address | Address space | Evidence role |
|---|---|---|---|---|
| `boot_resource_record_resolve_load` | Per-record resolver and load preparation | `0x0000BC8C..0x0000BE98` | z64 ROM range | Selected C owner |
| `boot_resource_record_resolve_load` | Same code placement | `0x8007B88C..0x8007BA98` | boot RAM virtual range | Early-boot linear placement |
| `boot_resource_directory_table` | Directory entries scanned for matching record IDs | `0x800A8750` | boot RAM virtual address | Effective address of the encoded `lui 0x800B` / `addiu 0x8750` pair |
| `boot_resource_operation_dispatcher` | Nine-way operation dispatcher called after resolution | `0x8007BA98` | boot RAM virtual address | Downstream call target |

Direct assembly observations support the following shape:

1. The function allocates a `0x138`-byte frame and saves `s0`–`s3` plus `ra`.
2. It checks record flag bit `0x80` at record offset `0`.
3. The flagged path allocates a buffer, initializes it, and returns through the common epilogue.
4. The normal path recognizes slash-prefixed records and scans a slash-delimited path.
5. It checks record type bits at offset `0x124`.
6. The `0x8000` type scans a directory table with four-byte entries.
7. The directory scan calls the record-match helper with record ID plus one.
8. A matching directory entry selects a subresource offset and triggers the same load path.
9. The function compares the loaded result with record offset `0x116` when record offset `0x118` is present.
10. It dispatches failure or completion through local error strings and helper calls.

The accepted dossier labels this directory as `0x800B8750`. The instruction
pair uses a sign-extended `addiu` low half, so the linked symbol alias must be
`0x800A8750` to preserve the original `lui 0x800B` encoding.

## Claim record

### Claim

`func_0000BC8C` is the strongest eligible Wave 3 resolver target.

### Evidence grade

`Supported` before independent review.

### Review status

`pending`.

### Scope and context

Static Rev 0 matching-C target selection. This record does not prove gameplay
semantics for the resolver fields or diagnostic strings.

### Supporting artifacts

- `asm/original/rev0/boot/boot_resource_record_resolve_load.s`
- `docs/dossiers/boot-resource-decode-subsystem-B030-F22C.md`
- `config/splat/us_rev0.semantic.json`
- `asm/original/rev0/manifest.json`
- `build/setup/verify-setup-report.json`

### Independent corroboration

The accepted owner model gives row `107`, primary ID
`primary:33d28818678d3db90344`, and one executable early-boot slice.

### Competing interpretation

The function may be a resource-record validator rather than a full resolver.
Its directory scan and operation-dispatch call still satisfy the resolver-path
selection rule without assigning stronger gameplay semantics.

### Falsifier

An accepted boundary correction, relocation mismatch, or independent byte
mismatch would invalidate this selection.

### Known limits

The selected function has no runtime proof. The selected name remains a
structural role label from accepted static evidence.

### Product consequence

The target is suitable for one Critical matching-C review slice. No editor
change or stronger semantic name is authorized by this selection.
