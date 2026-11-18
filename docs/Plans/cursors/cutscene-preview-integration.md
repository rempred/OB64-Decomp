# Cutscene preview integration

## November 17, 2026

All 11 waves of the [46-owner program](../cutscene-preview-services-draft.md) passed guarded preparation on `main`. Integration chat `01a1ecea-4071-7b73-a5b0-0baa66dd3b92` owns production writes. Director chat `01a1eb8b-d5e6-7083-bb49-8e6648ef3e0b` owns release and confirmed receipt of the startup message and first stop notification. Monitor `cutscene-preview-261117-integration` remains active.

## Verified input selection

Pinned `tools/status.ps1` reported `VERIFIED / EXACT ROM` for CURRENT `25FDAD0F2D4C068AD63FA63A5EDD21FD5E53BB20985B4F5432400FF32D7F500F`. The normalized 41,943,040-byte US Rev 0 ROM and retained exact rebuild have SHA-256 `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

The [selected v1 manifest](../../../build/cutscene-preview-inputs-20261117/manifest.json) has input set ID `150FBB21062FD23C49B740591A5ABD2D536B364C7DC9316ACB20A9304235EBBE` and manifest SHA-256 `B4A83B17419A8F355177050C5083CFE4A6C659F5EAF437981A85E8EC049219CD`. Set `OB64_WORK_ROOT=C:/Users/Joe/.codex/ob64-descriptor-20261026` and prepend `.toolchains/node-v24.13.1-win-x64` to the process PATH. Invoke that pinned `node.exe`.

## Guarded preflight

Private roots use `build/matching/preview-261117-<lowercase-wave>`. Each report records the full roster with exact canonical spelling. All selected ROM spans and hashes agree with the normalized ROM.

- Actor queries [Q1 2/2](../../../build/preview-261117-q1-preflight.json).
- Army panels [P1 3/3](../../../build/preview-261117-p1-preflight.json), [P2 4/4](../../../build/preview-261117-p2-preflight.json), [P3 6/6](../../../build/preview-261117-p3-preflight.json), [P4 3/3](../../../build/preview-261117-p4-preflight.json), [P5 7/7](../../../build/preview-261117-p5-preflight.json).
- Title cards [T1 4/4](../../../build/preview-261117-t1-preflight.json), [T2 6/6](../../../build/preview-261117-t2-preflight.json), [T3 3/3](../../../build/preview-261117-t3-preflight.json), [T4 4/4](../../../build/preview-261117-t4-preflight.json), [T5 4/4](../../../build/preview-261117-t5-preflight.json).

## Integration checks

- **Q1.** Both spans include folded two-instruction heads. The accepted dispatcher declares both returns as `s32`. Conserve the 22 override halfwords and the sentinel word at `2868F0..286920`.
- **P1.** The constructor row at `29A408..29A460` has 21 entries, 14 in-owner destinations and the original terminal zero word. The adjacent `29A460..29A4B4` row dispatches inside `func_00299740` in P2. The query ends at `283740` and release starts at `283748`.
- **T1.** Preserve the folded heads at `28A310`, `28A534` and `28A678`. The `29A0A0..29A0B8` row has five in-owner entries and one zero word. The dispatch instructions encode base `0x8023E160` using the sign-extended `lw` displacement at `28A3B4`. Teardown covers all 204 bytes through the terminal word at `28A7AC`.

## November 18 integration

**T1** passed one fresh verifier as four `PURE_C` bodies with 40/44/6/22 text relocations. The constructor owns the complete 24-byte table and five local destinations. Four T5 callers retain their linked bytes and placement. The teardown keeps four original executable ASM bytes after its 200-byte C body. Verified CURRENT `690FCDFD7ED7EE235C5EA96AE79CAD3E3C23645523A82AD626D62B79B3D9230F`. [Acceptance](../../../build/integration/cutscene-preview/t1-acceptance-evidence.json) · [Tail layout proof](../../../build/integration/cutscene-preview/t1-retained-layout-evidence.json) · [Fade control](../../dossiers/func_0028A678-6e73cac4b2.md) · [Graphics control](../../dossiers/func_0028A534-c14e6b643e.md)

**Q1** passed one fresh verifier as two `PURE_C` bodies with 14/6 relocations. The 48-byte retail override table stays in ASM. The first key remains at `0x8022A921`. 18 dispatcher fixtures matched retail. Verified CURRENT `EFA1E8FA027D650C69CC74769C7607DF218621B2F4D5D613321A0A97742C4242`. [Acceptance](../../../build/integration/cutscene-preview/q1-acceptance-evidence.json) · [Dispatcher fixtures](../../../build/integration/cutscene-preview/q1-accepted-query-cases.json) · [First-key guard control](../../dossiers/func_002AC700-17caf22daa.md) · [Signed return control](../../dossiers/func_002AC700-2d1e401a72.md)

**P1** passed one fresh verifier as three `PURE_C` bodies with 170/8/5 text relocations. Constructor row 5290 owns 21 table relocations and the terminal zero. P2 row 5291 remains in ASM and the eight-byte stub keeps its own C owner. Verified CURRENT `6510F1E970B7015B0C85F33E849E9180E1A6A0B3C043282523210E1D7105AB6B`. [Acceptance](../../../build/integration/cutscene-preview/p1-acceptance-evidence.json) · [Coordinate-load control](../../dossiers/func_00297CC8-8f77cc233b.md)

Production ownership stays with the integration chat. Selected inputs and referenced outputs remain available to assigned workers.
