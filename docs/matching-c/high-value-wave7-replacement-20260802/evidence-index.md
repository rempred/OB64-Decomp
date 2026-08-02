# Evidence index

Status: blocked. Independent Critical review remains pending. No acceptance verdict is recorded.

| Material claim | Evidence grade | Review | Supporting artifact |
|---|---|---|---|
| `func_00002D7C` is an eligible 1,792-byte permanent-boot owner. | Supported | pending | [target selection](target-selection.md); `asm/original/rev0/boot/boot_table_mask_reconcile.s`; `docs/dossiers/boot-table-mask-reconcile.md` |
| The owner boundary is z64 ROM `0x00002D7C..0x0000347C` and virtual address `0x8007297C..0x8007307C`. | Verified | pending | [independent derivation](independent-derivation.md); original target bytes |
| The pure-C probe controls meaningful implementation code. | Supported | pending | [independent derivation](independent-derivation.md); `probe/table-v5/func_00002D7C.compiler.s`; `probe/table-v7/func_00002D7C.compiler.s` |
| The final pure-C probe does not match exact owner bytes. | Verified | pending | `probe/table-v7/linked.bin`; [reproduction procedure](reproduction-procedure.md) |
| `func_000079EC` cannot be accepted because its probe used owner-wide inline assembly. | Supported | pending | `probe/func_000079EC.v37.bin`; [task log](task-log.md); source history before cleanup |
| The seven previously accepted owners and canonical identities were not modified by this worker. | Supported | pending | explicit scoped status and diff checks; prompt baseline identities |
| The replacement search is blocked under the prompt's stop conditions. | Supported | pending | [worker AAR](aar/20260802-ob64-matching-c-high-value-wave7-replacement-aar.md); [task log](task-log.md) |

## Identity records

The accepted full-ROM SHA-256 is `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

The accepted code-region SHA-256 is `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.

The worker made no configuration change and no accepted-owner source change. The external probe binaries remain outside the evidence root. The evidence root contains records only; it contains no generated ROM, object, map, executable, or bulk report.

## Required report

The worker AAR is [20260802-ob64-matching-c-high-value-wave7-replacement-aar.md](aar/20260802-ob64-matching-c-high-value-wave7-replacement-aar.md).
