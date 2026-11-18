# Cutscene preview integration

## November 17, 2026

The [assigned roster](../cutscene-preview-services-draft.md) completed on `main`. Integration chat `01a1ecea-4071-7b73-a5b0-0baa66dd3b92` hands acceptance to Director chat `01a1eb8b-d5e6-7083-bb49-8e6648ef3e0b` through the verified native watcher.

## Verified input selection

The exact US Rev 0 rebuild has SHA-256 `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

The [selected v1 manifest](../../../build/cutscene-preview-inputs-20261117/manifest.json) has input set ID `150FBB21062FD23C49B740591A5ABD2D536B364C7DC9316ACB20A9304235EBBE` and manifest SHA-256 `B4A83B17419A8F355177050C5083CFE4A6C659F5EAF437981A85E8EC049219CD`.

## Guarded preflight

Private roots use `build/matching/preview-261117-<lowercase-wave>`.

- Actor queries [Q1 2/2](../../../build/preview-261117-q1-preflight.json).
- Army panels [P1 3/3](../../../build/preview-261117-p1-preflight.json), [P2 4/4](../../../build/preview-261117-p2-preflight.json), [P3 6/6](../../../build/preview-261117-p3-preflight.json), [P4 3/3](../../../build/preview-261117-p4-preflight.json), [P5 7/7](../../../build/preview-261117-p5-preflight.json).
- Title cards [T1 4/4](../../../build/preview-261117-t1-preflight.json), [T2 6/6](../../../build/preview-261117-t2-preflight.json), [T3 3/3](../../../build/preview-261117-t3-preflight.json), [T4 4/4](../../../build/preview-261117-t4-preflight.json), [T5 4/4](../../../build/preview-261117-t5-preflight.json).

## November 18 integration

**T1** has four exact C bodies, complete 24-byte table and four retained executable bytes after teardown. [Acceptance](../../../build/integration/cutscene-preview/t1-acceptance-evidence.json) · [Tail layout proof](../../../build/integration/cutscene-preview/t1-retained-layout-evidence.json) · [Fade control](../../dossiers/func_0028A678-d3b24b5638.md) · [Graphics control](../../dossiers/func_0028A534-c14e6b643e.md)

**Q1** has two exact C bodies, 48-byte retail override table in ASM and 18 matching dispatcher fixtures. [Acceptance](../../../build/integration/cutscene-preview/q1-acceptance-evidence.json) · [Dispatcher fixtures](../../../build/integration/cutscene-preview/q1-accepted-query-cases.json) · [First-key guard control](../../dossiers/func_002AC700-17caf22daa.md) · [Signed return control](../../dossiers/func_002AC700-2d1e401a72.md)

**P1** has three exact C bodies, 21 switch relocations and the linked zero in row 5290. The eight-byte stub retains its own C owner. [Acceptance](../../../build/integration/cutscene-preview/p1-acceptance-evidence.json) · [Coordinate-load control](../../dossiers/func_00297CC8-b57a26d021.md)

**T3** has three exact C bodies. The executable word at ROM 28977C precedes T2. Eight selector 1078 replays matched. [Acceptance](../../../build/integration/cutscene-preview/t3-acceptance-evidence.json) · [Layout](../../../build/integration/cutscene-preview/t3-retained-layout-evidence.json) · [Traces](../../../build/integration/cutscene-preview/t3-accepted-traces.json) · [Initialization control](../../dossiers/func_002893E4-bc3af70a17.md) · [Cursor control](../../dossiers/func_00289558-17354e236c.md)

**T4** has four exact C bodies, five BSS bindings and three matching replays with eight rectangles each. [Acceptance](../../../build/integration/cutscene-preview/t4-acceptance-evidence.json) · [Traces](../../../build/integration/cutscene-preview/t4-accepted-traces.json) · [Pointer lifetime control](../../dossiers/func_002878F4-4199b6e311.md) · [Cursor load control](../../dossiers/func_00287AA4-823de770d9.md)

**T5** has four exact C bodies, four folded entry words and five resident slots. Four replays cover selectors 1073 and 1078. [Acceptance](../../../build/integration/cutscene-preview/t5-acceptance-evidence.json) · [Traces](../../../build/integration/cutscene-preview/t5-accepted-traces.json) · [Flag store control](../../dossiers/func_00281F10-03668bc782.md)

**P5** has seven exact C bodies, two folded entries and row 5166 preserved. Seven selector 0 replays used the original P2 assembly. [Acceptance](../../../build/integration/cutscene-preview/p5-acceptance-evidence.json) · [Traces](../../../build/integration/cutscene-preview/p5-accepted-traces.json) · [Frame control](../../dossiers/func_0028af64-f0a4c947ed.md) · [Scissor control](../../dossiers/func_00281CE4-5ebe719806.md)

**P2** has four PURE_C bodies and 143 text relocations. Row 5291 links 84 bytes and 21 entries. Seven scene and five close controls matched. [Acceptance](../../../build/integration/cutscene-preview/p2-acceptance-evidence.json) · [Replays](../../../build/integration/cutscene-preview/p2-accepted-traces.json) · [Signed-extension frame control](../../dossiers/func_00298948-9be4b392f2.md) · [Unsigned-byte control](../../dossiers/func_00298948-63b0ff58d4.md) · [Call interface control](../../dossiers/func_00299740-94aec088ad.md) · [Counted loop control](../../dossiers/func_00299AC8-b1002cecdd.md)

**P3** has six PURE_C bodies, 62 text relocations and the folded help entry. Section 20 uses the subject. Sections 21 and 22 use parameters +0x24. [Acceptance](../../../build/integration/cutscene-preview/p3-acceptance-evidence.json) · [Help replay](../../../build/integration/cutscene-preview/p3-accepted-traces.json) · [Constructor store control](../../dossiers/func_00296518-580db89150.md) · [Marker fallthrough control](../../dossiers/func_00296754-c3cd02883c.md) · [Indexed address control](../../dossiers/func_00297644-9246174c83.md)

**P4** has three exact C bodies and 90 matching replay cases. [Acceptance](../../../build/integration/cutscene-preview/p4-acceptance-evidence.json) · [Replays](../../../build/integration/cutscene-preview/p4-accepted-traces.json) · [Byte branch control](../../dossiers/func_002993EC-2e084146c6.md) · [Signed step pair](../../dossiers/func_00298B70-61be3cd751.md) · [Page readback pair](../../dossiers/func_00298B70-dd2571b164.md) · [Refresh jump control](../../dossiers/func_00298B70-685367d5fa.md)

**T2** has six exact C bodies and 112 text relocations. Controlled selector 1073 replays exercised script start and query, fade and reveal updates, texture copies and display-list drawing. [Acceptance](../../../build/integration/cutscene-preview/t2-acceptance-evidence.json) · [Replays](../../../build/integration/cutscene-preview/t2-accepted-traces.json) · [Width control](../../dossiers/func_00289ECC-3236e47d7d.md) · [Halfword control](../../dossiers/func_00289ECC-c7454b43ec.md) · [Clipped X control](../../dossiers/func_00289780-acf8dde5ef.md)

[Program acceptance roster](../../../build/integration/cutscene-preview/program-acceptance-evidence.json) binds all assigned owners to one fresh verifier and the exact retail ROM. Verified CURRENT `8412D50E1A2CDD150C75409B585A92DBF5748C5F5FE16C9530EDCEFB15B7ECF3`.

Production ownership returns to the Director with the final native handoff after the scoped commit and proof publication.
