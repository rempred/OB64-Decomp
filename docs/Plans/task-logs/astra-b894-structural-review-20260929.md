# B894 structural activation review

Date: 2026-09-29. Decision: **Accepted structural ownership delta; no review findings.**

Sol/BoldTower implemented the scoped change approved in Agent Mail #423 and requested review in #424. Astra/SilentCrane checked evidence freshness and ROM identity. The independent read-only reviewer `/root/b894_structural_review` examined the configuration delta, source identity, ownership partition, padding interpretation, fallback preservation, and existing negative controls. Sol retains production source/build ownership.

## Reviewed inputs

The reviewed diff is against `07daff2d9d1422d147f3e39d1aba20a80a9c7f92` on `main`.

| File | SHA-256 |
|---|---|
| `config/matching-c-targets.json` | `012AB1BBF6F4E3D0FB49013AF174906D17A951E0A6D71D4F5D70030632FB91E2` |
| `config/matching-c-linkage.json` | `BBD841C76DBCF870605B0848C36CC911B5313854471F2D2D0D3B1CBF1C56A9A4` |
| `src/battle/func_0021B894.c` | `C3DE40CE5ED2A44FFDD9B2CD88FC39B9E9E3537C7539F773286636000BCCDB98` |

The source is identical to the approved archived project candidate. The configuration delta adds only B894 and `D_80193670` through `D_80193673`; it removes or changes no existing entries. Newer squad/shop entries and their symbols remain present. `func_00208DC8` remains resolved through its active C owner. B438 remains ASM.

## Structural findings

- B894 retains the accepted `.ob64.r4028` text owner at z64 `[0x0021B894, 0x0021C074)`, VMA `0x801D85C4`, 2,016 bytes. The recorded canonical link has sole C ownership, 174 matching text relocations, and exact target bytes.
- Auxiliary row `.ob64.r4156` remains `[0x00229AB0, 0x00229DB0)`, partitioned in order into 720 retained ASM bytes, 44 B894 compiler bytes, and four retained ASM bytes. The 720-byte prefix includes both B438 tables. The map and exact interval hashes support complete, nonoverlapping ownership.
- The 44-byte C contribution has eleven relocations at offsets `0x00` through `0x28`, with addends inside B894's text owner. Its source object contains 48 bytes: the selected 44-byte table and four authenticated zero compiler-padding bytes. That padding is distinct from the four retained original-ASM tail bytes.
- Both original assembly fallbacks remain tracked and unchanged. The replaced slices exclude their original linked contributions while the retained intervals preserve their original bytes.
- The existing switch-table fixture covers wrong owner identity/extent, gaps, overlap, order, duplicate/missing retained fragments, malformed source-object selection, relocation/table-base errors, and nonzero padding/tail. Sol reported its successful run with 16 rejected mutations; the reviewer inspected these controls without repeating the run.

## Verification evidence

`build/audit/report.json` reports PASS at `2026-09-29T13:10:03.277Z`. CURRENT fingerprint `1F509DEFE98EA612A9CDF6606CC7D4E2501C1C732CD51479540C19A85F2DB55C` was recomputed from the current model and the build's original source-policy classification and agrees with the recorded state. All 1,359 checked accepted-input identities agree; the verification and fresh-compilation report hashes and recorded ELF, map, ROM, layout, ELF-report, and object-manifest hashes agree with their files.

The existing focused and current reports classify B894 `PURE_C` and establish exact text/table bytes, placement, relocations, and sole ownership. Direct hashing confirms CURRENT, the assembly/data baseline, and the canonical ROM all equal `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

This review ran no compiler, full build, final verifier, or duplicate fixture run. It reused the audit and verification evidence for unchanged inputs.

## Scope of acceptance

The reviewed B894 structural activation may be integrated under the existing scoped local commit policy. The complete eight-member W5 PURE_C assignment remains open while B438 is unresolved. This decision makes no new semantic claim, changes no compiler/tooling contract, and grants no push authorization. Material changes to the reviewed inputs require the applicable affected checks; an unchanged commit or handoff does not require repeating verification.
