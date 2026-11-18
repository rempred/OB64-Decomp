# Story-event integration

The [assigned wave](../story-event-continuation.md) covers the scene-request driver and resident event interpreter. [Production chat](codex://threads/01a1f05f-2cc1-7700-88c1-dcf0b0551584) retains sole production ownership on `main`. The [Director](codex://threads/01a1eb8b-d5e6-7083-bb49-8e6648ef3e0b) confirmed delivery of both the native startup message and the stop-watcher event.

On November 18, the pinned toolchain prepared both owners against verified CURRENT `8412D50E1A2CDD150C75409B585A92DBF5748C5F5FE16C9530EDCEFB15B7ECF3`. The normalized and rebuilt US Rev 0 ROMs share SHA-256 `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`. The [selected v1 manifest](../../../build/story-event-inputs-20261118/manifest.json) has input set ID `27EBDA99FA4297E407FA1297A80CE0D7FB64CAA7D33D6DCD34074243F5C2727A` and SHA-256 `6FCE4B21843E62EEC0F7EA0CCB0A6DB08484811FF2A64F03ADB8D02771CBE096`.

The [guarded report](../../../build/story-event-261118-preflight.json) records `prepared` for `func_00048024` (row 1021, 280 bytes) and `func_00046854` (row 1017, 4,672 bytes) under [the assigned private root](../../../build/matching/story-event-261118). The Director received both preparation rows for candidate dispatch.

## Additional Editor referrals

The [entry preflight](../../../build/story-entry-261118-preflight.json) prepared `func_00047dd8` (row 1019, 264 bytes), `func_00048294` (row 1025, 544 bytes) and `func_00047ee0` (row 1020, 324 bytes). The [mapper preflight](../../../build/story-mapper-261118-preflight.json) prepared `func_00046738` (row 1016, 284 bytes). Both use the same selected manifest and can proceed in their assigned private roots. The entry trio can be accepted independently.

## Shared read-only row 1283

The [original row](../../../asm/original/rev0/lib/table_000665c8.s) covers ROM `[0x665C8, 0x66B58)` and RAM `[0x801906C8, 0x80190C58)`. Its original object has zero relocations against the row. Its original and linked bytes match retail. Both text owners and the row use the accepted `cold-boot-loader-00040e80` loader-DMA slab.

The mapper's 27 pointers occupy `[0x665C8, 0x66634)`. The interpreter's five tables start at `0x66638`, `0x66A38`, `0x66AA8`, `0x66B18` and `0x66B38`, with 255, 28, 28, 7 and 7 pointers. All destinations are aligned within the corresponding text owner. The four zero words start at `0x66634`, `0x66A34`, `0x66B34` and `0x66B54`.

The mapper now supplies the first 112 bytes of row 1283, including its four-byte native alignment word. The remaining 1,312 bytes are retained ASM. The interpreter wave will reconcile the complete row with five compiler occurrences, two internal alignment words and the original terminal zero.

## Accepted mapper

`func_00046738` is exact `PURE_C` with 30 text and 27 table relocations. The scheduler shares its `u16` return and `s32` input declaration, and all 836 scheduler bytes match retail. The [mapper report](../../../build/integration/story-event/mapper-acceptance-evidence.json) binds CURRENT `633858359D12F0FDEC97023B190478784A5848F1C3B84F95A1431AF1FC78822C`, the exact ROM, 256 oracle cases and 768 isolated retail replays. The [signed-return control](../../dossiers/func_00046738-21f53f4a42.md) records the extra sign extension.

## Accepted event entry

The [entry report](../../../build/integration/story-event/entry-acceptance-evidence.json) binds verified CURRENT `D695992DEA7F10DDCACFE89ACF8DE2ECAC6E5804EAA3931CFB02A0FD0254F903` to all three exact `PURE_C` bodies and 102 text relocations. Both callers of `func_00047ee0` pass verification with its word-return declaration. Ten isolated checks against linked production and retail cover dispatch, selector and row changes, and indexed entry with full context restoration. External calls are controlled stubs.

The complete driver and interpreter pair is next. Its private source and five-table relocation inventory are ready. Preserve the selected input references through final reconciliation.
