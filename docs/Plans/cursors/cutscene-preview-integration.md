# Cutscene preview integration

## November 17, 2026

All 11 waves of the [46-owner program](../cutscene-preview-services-draft.md) passed guarded preparation on `main`. Integration chat `01a1ecea-4071-7b73-a5b0-0baa66dd3b92` owns production. The verified native watcher `cutscene-preview-261117-integration` routes to Director chat `01a1eb8b-d5e6-7083-bb49-8e6648ef3e0b`.

## Verified input selection

Pinned `tools/status.ps1` reported `VERIFIED / EXACT ROM` for CURRENT `25FDAD0F2D4C068AD63FA63A5EDD21FD5E53BB20985B4F5432400FF32D7F500F`. The normalized 41,943,040-byte US Rev 0 ROM and retained exact rebuild have SHA-256 `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

The [selected v1 manifest](../../../build/cutscene-preview-inputs-20261117/manifest.json) has input set ID `150FBB21062FD23C49B740591A5ABD2D536B364C7DC9316ACB20A9304235EBBE` and manifest SHA-256 `B4A83B17419A8F355177050C5083CFE4A6C659F5EAF437981A85E8EC049219CD`. Set `OB64_WORK_ROOT=C:/Users/Joe/.codex/ob64-descriptor-20261026` and prepend `.toolchains/node-v24.13.1-win-x64` to the process PATH. Invoke that pinned `node.exe`.

## Guarded preflight

Private roots use `build/matching/preview-261117-<lowercase-wave>`. Each report records the full roster with exact canonical spelling. All selected ROM spans and hashes agree with the normalized ROM.

- Actor queries [Q1 2/2](../../../build/preview-261117-q1-preflight.json).
- Army panels [P1 3/3](../../../build/preview-261117-p1-preflight.json), [P2 4/4](../../../build/preview-261117-p2-preflight.json), [P3 6/6](../../../build/preview-261117-p3-preflight.json), [P4 3/3](../../../build/preview-261117-p4-preflight.json), [P5 7/7](../../../build/preview-261117-p5-preflight.json).
- Title cards [T1 4/4](../../../build/preview-261117-t1-preflight.json), [T2 6/6](../../../build/preview-261117-t2-preflight.json), [T3 3/3](../../../build/preview-261117-t3-preflight.json), [T4 4/4](../../../build/preview-261117-t4-preflight.json), [T5 4/4](../../../build/preview-261117-t5-preflight.json).

## November 18 integration

**T1** passed one fresh verifier as four `PURE_C` bodies with 40/44/6/22 text relocations. The constructor owns the complete 24-byte table and five local destinations. Four T5 callers retain their linked bytes and placement. The teardown keeps four original executable ASM bytes after its 200-byte C body. [Acceptance](../../../build/integration/cutscene-preview/t1-acceptance-evidence.json) · [Tail layout proof](../../../build/integration/cutscene-preview/t1-retained-layout-evidence.json) · [Fade control](../../dossiers/func_0028A678-6e73cac4b2.md) · [Graphics control](../../dossiers/func_0028A534-c14e6b643e.md)

**Q1** passed one fresh verifier as two `PURE_C` bodies with 14/6 relocations. The 48-byte retail override table stays in ASM. The first key remains at `0x8022A921`. 18 dispatcher fixtures matched retail. [Acceptance](../../../build/integration/cutscene-preview/q1-acceptance-evidence.json) · [Dispatcher fixtures](../../../build/integration/cutscene-preview/q1-accepted-query-cases.json) · [First-key guard control](../../dossiers/func_002AC700-17caf22daa.md) · [Signed return control](../../dossiers/func_002AC700-2d1e401a72.md)

**P1** passed one fresh verifier as three `PURE_C` bodies with 170/8/5 text relocations. Constructor row 5290 owns 21 table relocations and the terminal zero. P2 row 5291 remains in ASM and the eight-byte stub keeps its own C owner. [Acceptance](../../../build/integration/cutscene-preview/p1-acceptance-evidence.json) · [Coordinate-load control](../../dossiers/func_00297CC8-2d1851d70d.md)

**T3** passed one fresh verifier as three `PURE_C` bodies with 22/36/15 ordered relocations. Guarded admission keeps the original executable word at `28977C` and T2 starts at `289780`. Eight controlled selector 1078 traces matched retail. [Acceptance](../../../build/integration/cutscene-preview/t3-acceptance-evidence.json) · [Layout](../../../build/integration/cutscene-preview/t3-retained-layout-evidence.json) · [Traces](../../../build/integration/cutscene-preview/t3-accepted-traces.json) · [Initialization control](../../dossiers/func_002893E4-bc3af70a17.md) · [Cursor control](../../dossiers/func_00289558-17354e236c.md)

**T4** passed one fresh verifier as four `PURE_C` bodies with 32/15/12/100 ordered relocations. The five BSS bindings, folded entries and neighboring owners checked out. Three controlled traces matched retail, including the eight rectangles per case. [Acceptance](../../../build/integration/cutscene-preview/t4-acceptance-evidence.json) · [Traces](../../../build/integration/cutscene-preview/t4-accepted-traces.json) · [Pointer lifetime control](../../dossiers/func_002878F4-10be6576b7.md) · [Cursor load control](../../dossiers/func_00287AA4-823de770d9.md)

**T5** passed one fresh verifier as four `PURE_C` bodies with 28/9/13/3 ordered relocations. The four folded entry words and five resident slot bindings match retail. Four controlled queue and callback traces cover selectors 1073 and 1078. [Acceptance](../../../build/integration/cutscene-preview/t5-acceptance-evidence.json) · [Traces](../../../build/integration/cutscene-preview/t5-accepted-traces.json) · [Flag store control](../../dossiers/func_00281F10-03668bc782.md)

**P5** passed one fresh verifier as seven `PURE_C` bodies with 220 ordered relocations. Both folded entries and row 5166 are intact. P1 shares the exact panel parameter layout. Seven controlled selector-0 traces used stable P2 assembly. Verified CURRENT `7FD3ADAFE1D6131DA22EFF7F6FE9EDF411446A4D40D7B3E4F3AFDE73C83AC276`. [Acceptance](../../../build/integration/cutscene-preview/p5-acceptance-evidence.json) · [Traces](../../../build/integration/cutscene-preview/p5-accepted-traces.json) · [Frame control](../../dossiers/func_0028af64-f0a4c947ed.md) · [Scissor control](../../dossiers/func_00281CE4-5ebe719806.md)

Production ownership stays with the integration chat. Selected inputs and referenced outputs remain available to assigned workers.
