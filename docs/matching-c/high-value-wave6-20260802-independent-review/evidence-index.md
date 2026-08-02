# Wave 6 independent-review evidence index

## Review result

| Item | Result |
|---|---|
| Frozen subject | `7d527a7ff8c3ad01ba00d586aee6ef7dba567d39` |
| Reviewer verdict | `Accepted with corrections` |
| Technical result | Exact linked bytes, exact ROM, and exact preservation checks |
| Remaining issue | Seven stale relocation-count statements in five Markdown records |
| Director route | Documentation-only correction before propagation |

The review report is `aar\20260802-ob64-matching-c-high-value-wave6-independent-review.md`. The task log is `task-log.md`.

## Frozen subject identities

| Artifact | Identity |
|---|---|
| Canonical repository | `C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp` |
| Canonical branch | `main` |
| Frozen commit | `7d527a7ff8c3ad01ba00d586aee6ef7dba567d39` |
| Frozen commit parent | `3b8b950d654848d5178c3f8bcdbbc00ca493accf` |
| Integration HEAD | `b22815518f060425519c08df19b617af8b5099a7` |
| Review-time parent HEAD | `6d5a31a122513dbf2b7e24f249cb5827f7e2c4aa` |

The parent repository remained read-only. The protected Phase 5A `_work` root was not entered.

## Target identity

| Field | Result |
|---|---|
| Symbol | `func_0026B820` |
| ROM range | `0x0026B820..0x0026BCCC` z64, end exclusive |
| Size | 1,196 bytes |
| Section | `.ob64.r4836` |
| Overlay descriptor | `12` |
| Link range | `0x80216C70..0x8021711C` overlay link virtual range |
| Source SHA-256 | `12D34159C5CA16BE3AB3FEA6E0CF3380B4CC217B0BFBB65D175F04F4535ED900` |
| Original assembly SHA-256 | `C43334DEC069D6760B6A2D24E40FDB3C7F3518D63224BA8A021EEB9F8A84997D` |
| Raw C object text SHA-256 | `C48C33CA6FBF76AFEEF6A19B3CF3709D83045EA82BEE78D4E23B6BA4F9FB814D` |
| Linked target text SHA-256 | `A88503EABEC9D4127CFBD75972F3F0465DC1A58B904DBDDE3B54BCFBA16B4E1A` |

## Direct static checks

| Claim | Evidence | Result |
|---|---|---|
| Exact boundary | 299 contiguous assembly words; `jr $ra` at `0x0026BCC4`; delay slot at `0x0026BCC8`; successor at `0x0026BCCC` | PASS |
| Descriptor placement | `config/overlays/us_rev0.json`, descriptor `12`; `config/splat/us_rev0.semantic.json`, row `4836` | PASS |
| Competing address interpretation | Source annotation `0x802DB420` versus descriptor-linked placement `0x80216C70` | Validated link placement used |
| ROM target bytes | Original assembly word stream compared with fresh ROM slice | PASS |
| Linked target section | Fresh ELF `.ob64.r4836`; size `0x4AC`; VMA `0x80216C70`; LMA `0x0026B820` | PASS |
| Linked target extraction | Reviewer-owned `review-target-r4836.bin`, 1,196 bytes | SHA matches expected |

## Fresh build evidence

| Artifact | Path | Identity or result |
|---|---|---|
| Reviewer build A | `C:\Users\Joe\.codex\ob64-matching-c-wave6-review-20260802\run-a\conventional` | PASS |
| Reviewer build B | `C:\Users\Joe\.codex\ob64-matching-c-wave6-review-20260802\run-b\conventional` | PASS |
| Reviewer verification A | `...\run-a\conventional\verification.json` | PASS |
| Reviewer verification B | `...\run-b\conventional\verification.json` | PASS |
| Reproducibility report | `...\run-a\conventional\reviewer-reproducibility.json` | `D99C32C68DA6D665793A36E3CDC3207088FF2857D529FE36D95F942BA73EAA48` |
| Build A ROM | `...\run-a\conventional\phase8.us_rev0.z64` | `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A` |
| Build B ROM | `...\run-b\conventional\phase8.us_rev0.z64` | Same hash as build A |

The fresh verifier reports seven exact asm-differ targets. It reports 7,242 primary rows, 7,251 link slices, 19 overlay reservations, and no linked original-assembly target.

## Preservation identities

| Artifact | SHA-256 |
|---|---|
| Full ROM | `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A` |
| Code region `0x00001000..0x0063676C` | `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409` |
| Fresh ELF | `AFBCE8B6A5C6D43FC0BDA6A3F9386603DC89D839F76CDB9C159C3D2DBE1EFCF5` |
| Fresh map | `350B31BF8D51070A5039AFFA67ED2703F33C397EBF42873DBC3BF4CB92E075E2` |
| Fresh layout | `9682CB22EEED5D20FD7091C6B4E76E6C8DD27F7E12D943FEB13E88240A328D91` |
| Fresh readelf report | `82C560E890175C78BF93F3C47E1F635CD4C671EF6876D1886516098DB1E06C7D` |

## Relocation review

The fresh object reports 28 entries in the target text relocation section. It reports one `.rel.pdr` entry. The configuration contains 29 expected entries total. Six entries target the owner section itself.

The relocation offsets and symbols match the frozen configuration. The count prose does not.

The Director must correct these frozen statements:

- `29 .rel.text entries and one .rel.pdr` must become `28 text relocations and one .rel.pdr`.
- `C object relocation count | 30 total` must become `29 total`.
- `four same-owner control-flow relocations` must become `six same-owner control-flow relocations`.

Affected records:

- `aar\20260802-ob64-matching-c-high-value-wave6-aar.md`
- `task-log.md`
- `target-selection.md`
- `independent-derivation.md`
- `evidence-index.md`

## Provenance

| Artifact | SHA-256 |
|---|---|
| Matching-C configuration | `3FA55971AF36908D2CA0A44460F36BB9156DEF8DF71FA0630583B5AC2C01D07C` |
| KMC compiler | `F3F1C99A322F5B3D8C108C2A44AF1D6D084DD27575C5D60BF0F0D33FFF34B1C6` |
| Phase 6 compiler manifest | `98C8ACC06A8FBF40DADBD25AE20C2539E8765E14EA12895158C37CC413D06C26` |
| Setup report | `B0E9FA404B81A92CA0EB23C75A3F1A534964AEB815771EE0D00CA5008F351F8D` |
| Phase 7 build report | `080CFE20487E93E776EB46D1C5374B720D99DE73F55826AB6C94CD96906564EE` |

The reviewer recomputed source, original assembly, configuration, compiler, manifest, setup, ROM, and code-region hashes. All matched the frozen records.

## Evidence limits

The result remains static and structural. It does not prove gameplay semantics, runtime safety, editor round trips, or cold-boot behavior.

The review reused the frozen setup report because the assignment forbids protected Phase 5A `_work` traversal. The fresh Phase 8 builds verified the accepted Phase 7 input and authenticated local tool identities.

The reviewer did not inspect external-derived implementations. No changed source includes external-derived code or comments.

