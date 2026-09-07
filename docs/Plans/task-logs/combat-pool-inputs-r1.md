# Combat pool inputs r1

## Outcome and scope

Status: complete; terminal retrieval package released.

This retrieval-only assignment copied existing exact inputs for the fifteen draft W6 members. It did not activate W6, change production or matching configuration, derive meanings, draft C, or run build, diff, source-policy, verifier, runtime, emulator, or database tools.

## Baseline

- Accepted extraction baseline: `78ebc7e9800a6379c2d58814c39eea06cebf49fa`.
- Launch ID: `COMBAT-POOL-INPUTS-20260907-01`.
- Exact membership source: draft `docs/Plans/prompts/combat-pool-wave6-r1.md`.
- Main advanced during extraction as other owners worked. All accepted configuration and canonical repository reads in the package came from Git objects at the fixed extraction baseline. Concurrent W5 working-tree records were excluded.

## Claims and evidence grades

- **Literal accepted-input retrieval:** 15/15 membership rows and 15/15 Rev 0 assembly manifest parts found.
- **Identity check:** all 15 worktree assembly byte streams match their manifest SHA-256 values.
- **Declared source state:** one target, `func_00205794`, is recorded as `accepted-pure-c`; the other fourteen are recorded as `not-accepted-as-c` / `ASM` at the extraction baseline.
- **No new semantic or structural claim:** names, meanings, compiler behavior, boundary decisions, and W6 readiness remain outside this package.

## Compact target table

`ROM end` and `VMA end` are exclusive. Every assembly path is `asm/original/rev0/lib/<symbol>.s`.

| Target | Owner row | Bytes | ROM range | VMA range | Declared state | Canonical C | ASM raw SHA-256 |
|---|---:|---:|---|---|---|---|---|
| `func_00205760` | 3821 | 24 | `0x00205760..0x00205778` | `0x801C22D0..0x801C22E8` | `ASM / not-accepted-as-c` | `absent` | `29D4D2B163609F3E5E0AF171CB5188FC8E857657197B7471224003C3BBA124EF` |
| `func_00205778` | 3822 | 28 | `0x00205778..0x00205794` | `0x801C22E8..0x801C2304` | `ASM / not-accepted-as-c` | `absent` | `776B10A777DE3858B601C58640543579D76745EE8CC44DE04FB59F6BE5046789` |
| `func_00205794` | 3823 | 12 | `0x00205794..0x002057A0` | `0x801C2304..0x801C2310` | `PURE_C / accepted-pure-c` | `src/lib/func_00205794.c` | `2B4E91F7A1108CB6A9C4621D4FBEC30BAB421FCBD6E786DB6F46335AF25634F1` |
| `func_002057A0` | 3824 | 60 | `0x002057A0..0x002057DC` | `0x801C2310..0x801C234C` | `ASM / not-accepted-as-c` | `absent` | `5A633DA4E74D0201D4C85EE167F8F590EE8F3CB022261B7EACD0FA492C4D57A0` |
| `func_002057DC` | 3825 | 428 | `0x002057DC..0x00205988` | `0x801C234C..0x801C24F8` | `ASM / not-accepted-as-c` | `absent` | `770D27050E46BE52BD9DEF6BFD5C070FD77FC8DC77877DD475E9C62E00C78F58` |
| `func_00205988` | 3826 | 536 | `0x00205988..0x00205BA0` | `0x801C24F8..0x801C2710` | `ASM / not-accepted-as-c` | `absent` | `4134959468757CB2A06FE560BE11A855DE167A5D3015B2A7A28E1386FE2A2F24` |
| `func_00205BA0` | 3827 | 232 | `0x00205BA0..0x00205C88` | `0x801C2710..0x801C27F8` | `ASM / not-accepted-as-c` | `absent` | `1C4A4A102D91DBBF7BB70F6BE70F7E121E761CE3ED662D56188559F740A6A4ED` |
| `func_00205C88` | 3828 | 1124 | `0x00205C88..0x002060EC` | `0x801C27F8..0x801C2C5C` | `ASM / not-accepted-as-c` | `absent` | `05A4B42AED37A8A2D9EA3CA2AE8410C8F50105D470FD29E714675D3BD766DEBD` |
| `func_002060EC` | 3829 | 68 | `0x002060EC..0x00206130` | `0x801C2C5C..0x801C2CA0` | `ASM / not-accepted-as-c` | `absent` | `998C1081649CEBF9596287817CE200D4339CD232AE2EF2DD442272656C47EA5B` |
| `func_00206130` | 3830 | 68 | `0x00206130..0x00206174` | `0x801C2CA0..0x801C2CE4` | `ASM / not-accepted-as-c` | `absent` | `726C18196ED0D84DA0E889870E70D716AFEE84D903B40D54EADF9D55B99FF85B` |
| `func_00206174` | 3831 | 68 | `0x00206174..0x002061B8` | `0x801C2CE4..0x801C2D28` | `ASM / not-accepted-as-c` | `absent` | `C951EB8449C5E9B3DF89C627973272629E49373EBF6C4E5CBB5C3AC630E785F1` |
| `func_002061B8` | 3832 | 68 | `0x002061B8..0x002061FC` | `0x801C2D28..0x801C2D6C` | `ASM / not-accepted-as-c` | `absent` | `40843B717467877AD7F40FD8D8C80EC65DA06B808E8DE3A796EDCB9360FEFB99` |
| `func_002061FC` | 3833 | 112 | `0x002061FC..0x0020626C` | `0x801C2D6C..0x801C2DDC` | `ASM / not-accepted-as-c` | `absent` | `B80E3B14AF6D7CD5789FBEA89F9409057BC38B2046BB22632813133E400318D3` |
| `func_0020626C` | 3834 | 100 | `0x0020626C..0x002062D0` | `0x801C2DDC..0x801C2E40` | `ASM / not-accepted-as-c` | `absent` | `BE8FBD618BDE1BFE604670E95FB982914F809D7F4CAEDD45AD901DB1B374E286` |
| `func_002062D0` | 3835 | 112 | `0x002062D0..0x00206340` | `0x801C2E40..0x801C2EB0` | `ASM / not-accepted-as-c` | `absent` | `ADCD5AA2F3594F4443ABB1A3F4916513889C7920B6C44D64B09C021E8DD432B6` |

For `func_00205794`, the accepted record names `objects/c/func_00205794.o`, primary ID `primary:0ed2c1c47a5d43d2ed85`, and source SHA-256 `2038D6C43A031132F21378F4EA7336CCA3844871777F89714E2AD9376BDD087B`. Its baseline active-target entry points to `src/lib/func_00205794.c`; its linkage target has an empty `expectedRelocations` array. No other W6 symbol has a baseline active-target or linkage-target record.

## Literal direct calls

Only `jal` comment records in the fifteen original assembly inputs were parsed. Numeric target spelling is preserved; the JSON package also supplies exact address-equal aliases from the accepted linkage symbol table when present.

| Owner | Direct-call target and ROM call sites |
|---|---|
| `func_002057A0` | `0x80070F30` @ `0x002057B4`<br>`0x80093380` @ `0x002057C8` |
| `func_002057DC` | `0x800712C4` @ `0x00205834`, `0x0020585C`, `0x00205884`, `0x002058D4`, `0x002058F4`, `0x00205908`, `0x0020591C`, `0x00205930`, `0x00205948`, `0x00205960` |
| `func_00205988` | `0x800712C4` @ `0x00205A00`, `0x00205A50`, `0x00205AA0`, `0x00205AE4`, `0x00205B04`, `0x00205B18`, `0x00205B2C`, `0x00205B40`, `0x00205B54`<br>`0x80093380` @ `0x00205B68` |
| `func_00205C88` | `0x801BE138` @ `0x00205D44`<br>`0x8009DAF4` @ `0x00205D60`, `0x00205D94`<br>`0x80071C04` @ `0x00205D68`<br>`0x8009DBB8` @ `0x00205D7C`, `0x00205DC0`<br>`0x80070F30` @ `0x00205D9C`, `0x00205F04`<br>`0x800712C4` @ `0x00205DAC`, `0x00205DC8`, `0x002060B4`<br>`0x8009DD38` @ `0x00205DD8`, `0x00205DE8`, `0x00205E08`<br>`0x8009DF48` @ `0x00205DF8`<br>`0x801BE18C` @ `0x00205E40`<br>`0x801BE0DC` @ `0x00205E4C`<br>`0x8016F5E0` @ `0x00205E5C`<br>`0x80093380` @ `0x00205F64`, `0x00205F70`, `0x00205F7C`, `0x00205F88`, `0x00205F94`, `0x00205FA0`, `0x00205FAC`<br>`0x80093060` @ `0x00205FBC`, `0x00205FD0` |
| `func_002061FC` | `0x800712C4` @ `0x00206238` |

Coverage is 50 direct-call sites across five owners. The remaining ten owners contain no parsed `jal` comment record.

## Relocation and group records

At baseline, the accepted linkage contract contains these three incoming W6 relocations:

| Referenced W6 symbol | Accepted owner | Offset | Type | Section |
|---|---|---|---|---|
| `func_00205760` | `func_001F309C` | `0x00000144` | `R_MIPS_26` | `.rel.text` |
| `func_002057A0` | `func_001F309C` | `0x0000013C` | `R_MIPS_26` | `.rel.text` |
| `func_002057DC` | `func_001F3540` | `0x0000019C` | `R_MIPS_26` | `.rel.text` |

The fixed-baseline `config/matching-c-compilation-groups.json` contains zero groups, so it declares no W6 group contract. The package does not import or classify concurrent W5 group edits.

## Existing switch-table reference

One W6 switch-table reference is already recorded in `docs/Plans/combat-discovery-r1.md:48`: owner `func_00205C88`, dispatch site `0x00205CE4`, table start `0x00213840`, ordered destinations `0x00205D0C, 0x00205D34, 0x00205CEC, 0x00205CF4, 0x00205CFC, 0x00205D04, 0x00205D0C, 0x00205D0C, 0x00205D14, 0x00205D1C, 0x00205D24, 0x00205D2C, 0x00205D38, 0x00205D34`. The original assembly also contains the corresponding non-return `jr $v0` comment record at `0x00205CE4`. No additional switch reference was present for the other fourteen members in the bounded accepted inputs.

## Frozen archive lookup

- Manifest: `docs/archive/matching-c-candidates/resumption-20260906/manifest.json`, Git-blob SHA-256 `2FD0697E1DD2E8F93B7D0C040B114C51D3A0BC4F2BCFE498E10F98AFB25BA3E5`.
- Manifest purpose: `Inactive restart archive; no matching or structural acceptance is conferred`.
- Exact archived source candidates for the fifteen W6 symbols: **0**. The sequential target records independently carry empty `archivedCandidates` arrays for all fifteen.
- Dependency-catalog records exist for `func_002060EC`, `func_00206174`, and `func_0020626C`; each says `status: present-in-canonical`, names its original assembly path, and has null canonical C/linkage fields.
- Five preserved candidates consume those dependencies: `func_00205484` and `func_00205608` reference `func_002060EC`; `func_00204EE0`, `func_00204F34`, and `func_002050AC` reference `func_00206174`; `func_00205484` also references `func_0020626C`. These are dependency references, not W6 source candidates. Exact archive paths, source commits, blobs, and SHA-256 values are in the JSON package.

## Parent Combat record lookup

Accepted parent reports with exact W6 mentions are:

| Report | Literal disposition | W6 mention | Raw SHA-256 |
|---|---|---|---|
| `../wiki/after-action-reports/20260725-combat-body-animation-evidence-package-correction-independent-review.md` | `Accepted` | line 102: `func_00205C88`, `func_00206174` | `C25C4D54FE8623AC1F0FFAA51864F83AB8E77118C7D6BB6F204F96C08E4DEAE3` |
| `../wiki/after-action-reports/20260727-combat-body-animation-class-pose-resource-selector-compatibility-atlas-independent-review-overlay-backmap-correction-aar.md` | `Accepted; independent review required before promotion` | line 19: `func_00206174` | `C69E14B5D1C5D7344CF705FC1B945B01671066B3158CADF2E6AA025ADB6C4546` |
| `../wiki/after-action-reports/20260727-combat-body-animation-class-pose-resource-selector-compatibility-atlas-independent-review-overlay-backmap-correction-independent-review.md` | `Accepted` | line 46: `func_00206174` | `99FF5890466265D86840BD85571793EF6E524B3F810AD5D6AEDA94E23C5FC7F1` |
| `../wiki/after-action-reports/20260727-combat-body-animation-default-class-pose-resource-selector-compatibility-atlas-independent-review.md` | `Accepted` | line 41: `func_00205C88` | `B8B68D755B6327ABEE19544B98AB23536DFC2E6BC445B514B2C02D8C7CDCD706` |

The JSON package also preserves five other bounded parent records that mention `func_00205C88` or `func_00206174`, with their literal `review pending`, `independent review required`, `Revision required`, or `complete` dispositions. It does not promote those records to accepted status. No bounded parent report match was found for the other thirteen W6 symbols.

## Changed surfaces

- `docs/Plans/task-logs/combat-pool-inputs-r1.claim.json`
- `docs/Plans/task-logs/combat-pool-inputs-r1.md`
- Ignored `build/combat-pool-inputs-r1/w6-inputs.json`

No production source, tool, configuration, archive, database, branch, worktree, staged set, or commit was changed.

## Failed paths and limits

- No exact W6 candidate source exists in the frozen archive. This is a confirmed bounded absence, not a conclusion that no candidate ever existed elsewhere.
- Direct-call coverage is limited to literal `jal` records in original assembly comments. It does not resolve numeric overlay targets beyond address-equal aliases already in the baseline linkage table.
- Switch coverage is limited to the single W6 record already present in `docs/Plans/combat-discovery-r1.md`.
- Original ASM function-boundary-candidate comments were not used for owner extents. Those comments identify themselves as aids; accepted extents were copied from the sequential inventory and Rev 0 manifest. No boundary decision was made.
- Static DB access was unnecessary. Runtime databases, active capture state, emulator state, and external sources were not read.

## Evidence index

| Input | Scope identity |
|---|---|
| `docs/Plans/sequential-family-targets.json` | baseline `78ebc7e9800a6379c2d58814c39eea06cebf49fa`, blob `76e9fe8ffbd96b1a1890ee38e7c68e194c3a6845`, blob SHA-256 `5938B13CC438CB047D143FB704EE800080A0ADE4D1CAE44B4BADE84E1344BDE8` |
| `asm/original/rev0/manifest.json` | baseline `78ebc7e9800a6379c2d58814c39eea06cebf49fa`, blob `1f01c4c5abeebea85c6596b86fd9750e4f3e1b55`, blob SHA-256 `EE6A81334FDCFC2867BC7AF63AD56624E08C6B92D992915A45B610B44D3FCF44` |
| `config/matching-c-targets.json` | baseline `78ebc7e9800a6379c2d58814c39eea06cebf49fa`, blob `fa507562e91f561a3f1faa3120dcecf5af59438f`, blob SHA-256 `762681F45DAEEA7FE983F97B751AEF78EED05C7C59E4E57784478175092AF96E` |
| `config/matching-c-linkage.json` | baseline `78ebc7e9800a6379c2d58814c39eea06cebf49fa`, blob `9b2fcf58440b1ee9fddbdc06983c8e86ca72bc93`, blob SHA-256 `9A8F64E9B67B663ABC8E047237DAEFD30EC863C4A90D1C342C1961D9F98FAE46` |
| `config/matching-c-compilation-groups.json` | baseline `78ebc7e9800a6379c2d58814c39eea06cebf49fa`, blob `db9ce5798e3ae80e61fe63b2e0f14fba1f0c6629`, blob SHA-256 `2E8000CC6D276F0E354E452E522988096CFD77EC57FF33C54808825D638D1FA6` |
| `src/lib/func_00205794.c` | baseline `78ebc7e9800a6379c2d58814c39eea06cebf49fa`, blob `047b0ce41848462edc7c5de472cc06f12c765333`, blob SHA-256 `2038D6C43A031132F21378F4EA7336CCA3844871777F89714E2AD9376BDD087B` |
| `docs/archive/matching-c-candidates/resumption-20260906/manifest.json` | baseline `78ebc7e9800a6379c2d58814c39eea06cebf49fa`, blob `f6b3796c1fbde03ac6572f247cdc982f4888f07f`, blob SHA-256 `2FD0697E1DD2E8F93B7D0C040B114C51D3A0BC4F2BCFE498E10F98AFB25BA3E5` |
| `docs/Plans/combat-discovery-r1.md` | baseline `78ebc7e9800a6379c2d58814c39eea06cebf49fa`, blob `63da41107ac48415b873ebe6d34bade27978ab82`, blob SHA-256 `1578AA2A0167D59538FA68ED016DDD4F1461BCBD9CB01F82298851089F022DB1` |
| `../docs/Plans/combat-body-resources-family-inventory-20260905.md` | raw SHA-256 `1FD28B5ADAE9BBEE9D4F8F4619A2D2962A89FA1049E1B976898875FB36171B83`; parent working-tree record; W6 table lines 95-109 |

- Extracted package: `build/combat-pool-inputs-r1/w6-inputs.json`, 53096 bytes, SHA-256 `2D394ABAB1AA7EC98AB78BDF6D6A0A6C50E9840C600B2A52740BD1750BA89AF1`.

## Verification summary

- Parsed target set equals the draft membership exactly: 15/15, no extras.
- Each target has one sequential membership record and one original ASM manifest part.
- All fifteen manifest ranges agree with the accepted byte counts; all fifteen worktree ASM raw hashes equal manifest hashes.
- Counts: one canonical C path, one active-target record, one linkage-target record, three incoming accepted relocations, zero baseline groups, 50 direct calls, one non-return indirect jump, one recorded switch table, zero exact frozen candidates, three frozen dependency records.
- The output JSON was decoded after writing and the compact records were read back. No build or acceptance command was run.

## Protocol deviations

None. Main advanced through other owners while this read-only extraction ran; the assignment remained pinned to `78ebc7e` and did not absorb the new production state.

## Proposed canonical-document changes

None.

## Next action

The Director may provide the literal package to a later W6 implementation task after separately binding the accepted W5 baseline and production ownership. This retrieval task releases all writes.
