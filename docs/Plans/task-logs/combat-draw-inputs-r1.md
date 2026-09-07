# Combat draw inputs r1

## Outcome and scope

Status: complete; terminal retrieval package released.

This retrieval-only assignment copied existing inputs for the fourteen draft W8 members. It did not activate W8, change production or matching configuration, derive technical or semantic conclusions, draft C, or run compilation, diff, source-policy, verifier, runtime, emulator, or database tools.

## Baseline

- Accepted source baseline: `d70fd8524ad3f9d7c9f6355be1772bca852d087a`.
- Assignment release: `29cd12758c13c02ecd75c735ffa4ced0bd9f31ca`.
- Exact membership source: draft `docs/Plans/prompts/combat-draw-wave8-r1.md`.
- W6 owns current production source/build. Its working-tree source and matching-configuration changes remained provisional and were not parsed as accepted evidence.

## Claims and evidence grades

- **Literal accepted-input retrieval:** 14/14 membership rows and 14/14 Rev 0 assembly manifest parts found.
- **Identity check:** all fourteen worktree assembly byte streams match their manifest SHA-256 values.
- **Declared source state:** `func_0020BFF8` is recorded as `accepted-pure-c`; the other thirteen targets are recorded as `not-accepted-as-c` / `ASM`.
- **No new technical claim:** meanings, compiler behavior, boundaries, membership, ownership changes, and W8 readiness remain outside this package.

## Compact target table

`ROM end` and `VMA end` are exclusive. Every assembly path is `asm/original/rev0/lib/<symbol>.s`.

| Target | Owner row | Bytes | ROM range | VMA range | Declared state | Canonical C | ASM raw SHA-256 |
|---|---:|---:|---|---|---|---|---|
| `func_001F3C00` | 3698 | 6740 | `0x001F3C00..0x001F5654` | `0x801B0770..0x801B21C4` | `ASM / not-accepted-as-c` | `absent` | `C31BB4824DF0178D65383897F956F802C0C7CAD14245FD0A74BAB99F5C42C85B` |
| `func_001F5654` | 3699 | 2628 | `0x001F5654..0x001F6098` | `0x801B21C4..0x801B2C08` | `ASM / not-accepted-as-c` | `absent` | `524E1CA0DCE51E802A8DD9FA36000A87B4BB3D7AE0FB6D09D7862052A672F7A9` |
| `func_001F6098` | 3700 | 4148 | `0x001F6098..0x001F70CC` | `0x801B2C08..0x801B3C3C` | `ASM / not-accepted-as-c` | `absent` | `63304127A1DECEDF5AD1253390FEEB1A68D54A4B237EFFA71CDD006143722924` |
| `func_001F7ADC` | 3706 | 3800 | `0x001F7ADC..0x001F89B4` | `0x801B464C..0x801B5524` | `ASM / not-accepted-as-c` | `absent` | `41EE2BEC138C2F40CF3678EB02961BECC800E2602AFC1E17FEDD14F07177FF29` |
| `func_001F89B4` | 3707 | 160 | `0x001F89B4..0x001F8A54` | `0x801B5524..0x801B55C4` | `ASM / not-accepted-as-c` | `absent` | `E644533D5CAFD1ABA0ED7E58701F8F29F7C73D51E517CBC36A6CAF6C12F0D043` |
| `func_001FCB28` | 3733 | 2628 | `0x001FCB28..0x001FD56C` | `0x801B9698..0x801BA0DC` | `ASM / not-accepted-as-c` | `absent` | `DF406460F26C06817519F5C2EB572298C6D8BE1154DC3EDD45DC3FD1CEE6C7B7` |
| `func_001FD56C` | 3734 | 2396 | `0x001FD56C..0x001FDEC8` | `0x801BA0DC..0x801BAA38` | `ASM / not-accepted-as-c` | `absent` | `B147A2F4D7252ADFD7E50AD6EE90421951D7DA2DF199FA1F2262E3C7DC410778` |
| `func_0020BFF8` | 3874 | 28 | `0x0020BFF8..0x0020C014` | `0x801C8B68..0x801C8B84` | `PURE_C / accepted-pure-c` | `src/lib/func_0020BFF8.c` | `9888047448AD576BA7B6C39A4A42D1AF303BD09F5F430DC288E41E1006B85AAF` |
| `func_0020C014` | 3875 | 32 | `0x0020C014..0x0020C034` | `0x801C8B84..0x801C8BA4` | `ASM / not-accepted-as-c` | `absent` | `A5608501FC97C5782297B3BDFD31FCC42898A068947B174D8057836F431418DB` |
| `func_0020C034` | 3876 | 28 | `0x0020C034..0x0020C050` | `0x801C8BA4..0x801C8BC0` | `ASM / not-accepted-as-c` | `absent` | `F79F80F6A8FF125FCB412EA739CEDCC084796B25E51145155CD98760AC5E0E61` |
| `func_0020C448` | 3898 | 48 | `0x0020C448..0x0020C478` | `0x801C8FB8..0x801C8FE8` | `ASM / not-accepted-as-c` | `absent` | `5A2A2F255171ACC2250EAE68032123F907272146560F075E2C58831572BC1217` |
| `func_0020C4B8` | 3900 | 524 | `0x0020C4B8..0x0020C6C4` | `0x801C9028..0x801C9234` | `ASM / not-accepted-as-c` | `absent` | `05333145DDC440A629B7B097AAFC38F4C9189E551A902C39F201B0BF96018425` |
| `func_002103EC` | 3939 | 120 | `0x002103EC..0x00210464` | `0x801CCF5C..0x801CCFD4` | `ASM / not-accepted-as-c` | `absent` | `1461B7DA86277275BB50D828BB156A4DEC6F20BA10FF77102047C0CD5FC0E277` |
| `func_0020DB10` | 3922 | 5548 | `0x0020DB10..0x0020F0BC` | `0x801CA680..0x801CBC2C` | `ASM / not-accepted-as-c` | `absent` | `4493C58ABF102557B2E89D98021B18968903F706B3D983227497CD101379E2FE` |

For `func_0020BFF8`, the accepted record names `objects/c/func_0020BFF8.o`, primary ID `primary:9a4a8ccec54eab7d0ced`, and source SHA-256 `A121834C101C03CF128EB19987556A1D4B74349186E0BBB605731DFB127C7D3D`. Its active-target record points to `src/lib/func_0020BFF8.c`; its linkage-target record has an empty `expectedRelocations` array.

The sequential inventory stores parent membership citations at lines 131–144. The current parent file with raw SHA-256 `1FD28B5ADAE9BBEE9D4F8F4619A2D2962A89FA1049E1B976898875FB36171B83` places the same rows at lines 133–146. Both line sets are retained in the package.

## Literal direct calls

The machine package preserves all 195 `jal` sites with ROM addresses, numeric target spelling, address-equal accepted linkage aliases, W8 target matches, and hash-verified W6/W7 package matches. This compact table lists target literals and counts.

| Owner | Sites | Target literals with counts |
|---|---:|---|
| `func_001F3C00` | 57 | `0x801C8FB8` × 1, `0x80092A90` × 1, `0x800988A0` × 1, `0x8020B1E0` × 1, `0x801BEA0C` × 23, `0x801BE8FC` × 2, `0x801BA0DC` × 1, `0x801C2304` × 2, `0x801C2178` × 2, `0x801C22E8` × 1, `0x801C33F8` × 3, `0x801C22D0` × 1, `0x801C8BA4` × 2, `0x801C8B68` × 2, `0x801C1FF4` × 1, `0x801C2EB0` × 1, `0x801BE9A8` × 2, `0x801BE978` × 1, `0x8016DE1C` × 1, `0x80098AA0` × 1, `0x801CCF5C` × 6, `0x801B9698` × 1 |
| `func_001F5654` | 22 | `0x801C8FB8` × 1, `0x80092A90` × 1, `0x800988A0` × 1, `0x801AD60C` × 1, `0x801C8BA4` × 2, `0x801C8B68` × 2, `0x801C1FF4` × 1, `0x801C22E8` × 1, `0x801C3750` × 1, `0x801C22D0` × 1, `0x801BE9A8` × 1, `0x8016DE1C` × 1, `0x80098AA0` × 1, `0x801CCF5C` × 6, `0x801BEA0C` × 1 |
| `func_001F6098` | 25 | `0x801C8FB8` × 1, `0x80092A90` × 1, `0x800988A0` × 1, `0x8020B1E0` × 1, `0x801C1DA0` × 1, `0x801C8BA4` × 2, `0x801C8B68` × 2, `0x801C1FF4` × 1, `0x801C22E8` × 1, `0x801C3750` × 1, `0x801C22D0` × 1, `0x801BE9A8` × 2, `0x8016DE1C` × 1, `0x80098AA0` × 1, `0x801CCF5C` × 6, `0x801BEA0C` × 2 |
| `func_001F7ADC` | 35 | `0x801C8FB8` × 1, `0x8009CFB0` × 2, `0x800907E0` × 1, `0x80092A90` × 1, `0x800988A0` × 1, `0x80092C18` × 1, `0x801C8BA4` × 2, `0x801C8B68` × 2, `0x801C1FF4` × 1, `0x801C2EB0` × 1, `0x801BE9A8` × 2, `0x8016DE1C` × 1, `0x80098AA0` × 1, `0x801CCF5C` × 4, `0x801BEA0C` × 14 |
| `func_001F89B4` | 2 | `0x801B464C` × 2 |
| `func_001FCB28` | 0 | none |
| `func_001FD56C` | 0 | none |
| `func_0020BFF8` | 0 | none |
| `func_0020C014` | 0 | none |
| `func_0020C034` | 0 | none |
| `func_0020C448` | 1 | `0x8016FA34` × 1 |
| `func_0020C4B8` | 9 | `0x80098C20` × 1, `0x80098AA0` × 2, `0x80098340` × 3, `0x80092C18` × 1, `0x80098920` × 1, `0x801CCD70` × 1 |
| `func_002103EC` | 1 | `0x80093380` × 1 |
| `func_0020DB10` | 43 | `0x801ADADC` × 4, `0x80093380` × 6, `0x801C9478` × 5, `0x801C974C` × 5, `0x801C9FA4` × 4, `0x8016E338` × 4, `0x801ADB9C` × 3, `0x8016DEC4` × 2, `0x8016FA34` × 1, `0x801BE138` × 1, `0x801C41C8` × 1, `0x801C3F3C` × 1, `0x801CD3FC` × 1, `0x801CD19C` × 1, `0x801C8B84` × 1, `0x801CC7EC` × 1, `0x801CD4A0` × 1, `0x801ADCBC` × 1 |

Sixteen call sites have exact VMA-entry matches in the prior W6/W7 packages. The packages were reused without repeating their extraction:

- W6: `build/combat-pool-inputs-r1/w6-inputs.json`, SHA-256 `2D394ABAB1AA7EC98AB78BDF6D6A0A6C50E9840C600B2A52740BD1750BA89AF1`.
- W7: `build/combat-compositing-inputs-r1/w7-inputs.json`, SHA-256 `F376C9304E9CB3AAC2B76886EBE0CACCF271D700D31191F6E8D05A56E7720E2B`.

## Linkage, relocation, group and auxiliary records

At `d70fd85`, only `func_0020BFF8` has a W8 active-target and linkage-target record. The accepted linkage file contains 28 incoming W8 relocations:

| Referenced W8 symbol | Count | Accepted owner + offset records |
|---|---:|---|
| `func_0020BFF8` | 10 | `func_001F197C+0x000000BC` `R_MIPS_26` `.rel.text`; `func_001F114C+0x00000030` `R_MIPS_26` `.rel.text`; `func_00201108+0x0000022C` `R_MIPS_26` `.rel.text`; `func_0021C3B0+0x00000038` `R_MIPS_26` `.rel.text`; `func_0021824C+0x00000134` `R_MIPS_26` `.rel.text`; `func_00218B58+0x000000C0` `R_MIPS_26` `.rel.text`; `func_00218B58+0x00000108` `R_MIPS_26` `.rel.text`; `func_00218B58+0x00000244` `R_MIPS_26` `.rel.text`; `func_00218B58+0x00000280` `R_MIPS_26` `.rel.text`; `func_00218B58+0x00000394` `R_MIPS_26` `.rel.text` |
| `func_0020C014` | 13 | `func_001F1218+0x00000378` `R_MIPS_26` `.rel.text`; `func_00201108+0x00000178` `R_MIPS_26` `.rel.text`; `func_0021C3B0+0x00000090` `R_MIPS_26` `.rel.text`; `func_0021B770+0x0000008C` `R_MIPS_26` `.rel.text`; `func_0021B0A0+0x0000005C` `R_MIPS_26` `.rel.text`; `func_00218B58+0x00000098` `R_MIPS_26` `.rel.text`; `func_00218B58+0x000000E4` `R_MIPS_26` `.rel.text`; `func_00218B58+0x0000021C` `R_MIPS_26` `.rel.text`; `func_00218B58+0x00000254` `R_MIPS_26` `.rel.text`; `func_00218B58+0x00000370` `R_MIPS_26` `.rel.text`; `func_00218B58+0x000003D8` `R_MIPS_26` `.rel.text`; `func_0021840C+0x00000184` `R_MIPS_26` `.rel.text`; `func_0021840C+0x00000328` `R_MIPS_26` `.rel.text` |
| `func_0020C034` | 2 | `func_001F197C+0x000000B0` `R_MIPS_26` `.rel.text`; `func_001F114C+0x0000003C` `R_MIPS_26` `.rel.text` |
| `func_0020C4B8` | 1 | `func_001F1218+0x000002DC` `R_MIPS_26` `.rel.text` |
| `func_0020DB10` | 2 | `func_001F2134+0x00000058` `R_MIPS_26` `.rel.text`; `func_001F309C+0x000001AC` `R_MIPS_26` `.rel.text` |

The accepted compilation-groups file contains one repository-wide group and no W8 symbol reference. No W8 group contract is recorded.

The accepted Combat discovery result supplies six bounded auxiliary records already tied to W8: five records for `func_0020DB10` calling `func_002073CC`, `func_0020CBDC`, `func_0021062C`, `func_0021088C`, and `func_00210930` at the recorded sites; and one saved-placement/group-2 interface record for `func_001F3C00` and `func_0025FD90` at live `0x8020B1E0`. The package preserves every call-site list and the original scope wording. No broader ownership or execution claim was added.

## Switch-table lookup

No accepted switch-table census row names a W8 owner in `docs/Plans/combat-discovery-r1.md`. None of the fourteen original assembly splits contains a parsed non-return `jr` or `jalr` comment record. This is a bounded input result; it does not prove global absence of indirect machine-code behavior.

## Frozen archive lookup

- Exact archived candidate sources for the fourteen W8 symbols: **0**.
- `func_0020BFF8` has one dependency-catalog record: `status: present-in-canonical`, canonical source `src/lib/func_0020BFF8.c`, original assembly `asm/original/rev0/lib/func_0020BFF8.s`, and null canonical-linkage field.
- One preserved candidate consumer, `func_0021B894`, names `combat:func_0020BFF8`; its exact archive path, commit/blob fields, and raw SHA-256 are in the package.
- The other thirteen targets have no dependency-catalog record or preserved consumer in this manifest. All fourteen sequential target records have empty `archivedCandidates` arrays.

These zero counts are scoped to `docs/archive/matching-c-candidates/resumption-20260906/manifest.json`, whose purpose says it confers no matching or structural acceptance.

## Relevant existing reports

Accepted project records with direct W8 references are:

| Record | Literal disposition | Direct W8 references | Identity |
|---|---|---|---|
| `docs/Plans/combat-discovery-r1.md` | `accepted subject; independent review Accepted with corrections` | line 26: `func_0020DB10`; line 29: `func_0020DB10`; line 96: `func_001F3C00`; line 129: `func_0020DB10` | SHA-256 `1578AA2A0167D59538FA68ED016DDD4F1461BCBD9CB01F82298851089F022DB1` |
| `docs/Plans/task-logs/combat-discovery-review-r1.md` | `Accepted with corrections` | line 102: `func_001F3C00` | SHA-256 `D95962D55E2FC22DA8F0DDA849D67B89382AD5D247A2BFE11BDE905AEFA8840E` |
| `docs/Plans/task-logs/combat-shared-dispatch-review-r1.md` | `Accepted` | line 161: `func_0020C014`; line 162: `func_0020BFF8` | SHA-256 `5CDA8E1FCEDD4FF777FCEA29DC8E668B00195FC1DA5333A6E563D024638859B1` |
| `../wiki/after-action-reports/20260728-combat-sprite-art-fighter-selector28-pose-frame-reference-atlas-correction-aar-identity-log-correction-independent-review.md` | `Accepted` | associated accepted review; target spelling is in its frozen subject record | SHA-256 `3F7CA3351DEFE352321B409DFC9F44A325EB086DA93B9A01BC538F5773763BD5` |
| `../wiki/after-action-reports/20260728-combat-sprite-art-fighter-selector28-frame-token-art-chain-static-overlay-address-correction-independent-review.md` | `Accepted for bounded static Outcome B` | associated accepted review; target spelling is in its frozen subject record | SHA-256 `73FAAC8AD9717D8667BFBBACFCE8874D96054C5746F0A8C32DC8CDDC87BA1011` |
| `../wiki/after-action-reports/20260728-combat-sprite-art-fighter-selector28-runtime-package-gate8-correction-independent-review.md` | `Accepted` | associated accepted review; target spelling is in its frozen subject record | SHA-256 `A7F8FA6DB9DBA115C1881E70F9B50153C21BB69980A25C8AF9D88CD9776628DA` |

The parent research-aide index independently marks the Fighter pose-frame, static art-chain, and seeded runtime packages accepted and links their final accepted reviews. The package records that index identity plus four target-bearing precursor/current AARs with their literal `Research reopened`, `review pending`, or `complete` dispositions; it does not promote those records.

## Changed surfaces

- `docs/Plans/task-logs/combat-draw-inputs-r1.claim.json`
- `docs/Plans/task-logs/combat-draw-inputs-r1.md`
- Ignored `build/combat-draw-inputs-r1/w8-inputs.json`

No production source, tool, configuration, ROM, archive, runtime/database state, branch, worktree, staged set, or commit was changed.

## Failed paths and limits

- No exact W8 candidate source exists in the frozen resumption manifest. This is bounded manifest absence.
- Direct-call coverage is limited to literal `jal` comments in the fourteen original assembly splits. Numeric targets were not semantically resolved.
- W6/W7 cross-references are exact VMA-entry matches from the two prior hash-verified packages.
- Accepted auxiliary records were copied from the accepted discovery result/review without extending their meaning.
- Original ASM boundary-candidate comments were excluded from owner extents. In particular, `func_001F7ADC` uses the accepted 3,800-byte manifest/inventory extent while its older ASM comment says 3,808 bytes. No new boundary decision was made.
- Runtime/static databases, emulator state, ROM bytes, external sources, and provisional W6 content were not read.

## Evidence index

| Input | Scope identity |
|---|---|
| `docs/Plans/sequential-family-targets.json` | commit `d70fd853fdffacf71290b24763e010a549276a55`, blob `76e9fe8ffbd96b1a1890ee38e7c68e194c3a6845`, blob SHA-256 `5938B13CC438CB047D143FB704EE800080A0ADE4D1CAE44B4BADE84E1344BDE8` |
| `asm/original/rev0/manifest.json` | commit `d70fd853fdffacf71290b24763e010a549276a55`, blob `1f01c4c5abeebea85c6596b86fd9750e4f3e1b55`, blob SHA-256 `EE6A81334FDCFC2867BC7AF63AD56624E08C6B92D992915A45B610B44D3FCF44` |
| `config/matching-c-targets.json` | commit `d70fd853fdffacf71290b24763e010a549276a55`, blob `765e819b224a86660ed9d7284eb1df999511dca2`, blob SHA-256 `96AA85BE6BC71CBB37D385AFB9654F6221E1E602945159F4A48875D2D4BAC4F2` |
| `config/matching-c-linkage.json` | commit `d70fd853fdffacf71290b24763e010a549276a55`, blob `44523543d5e9d7cd9f0cda3b14736b37450a1eca`, blob SHA-256 `E52B7B60AB9949B29D01DDA5611A717E3FF5AFE7F9854A923565B1B0FD44619D` |
| `config/matching-c-compilation-groups.json` | commit `d70fd853fdffacf71290b24763e010a549276a55`, blob `28e38b25b3b2bd9279241fc0678ce90456eb2d44`, blob SHA-256 `B805162A633B86E5E33A8E12416DBD4207C530C718E1AAF395B1D29F3AE53A4A` |
| `docs/archive/matching-c-candidates/resumption-20260906/manifest.json` | commit `d70fd853fdffacf71290b24763e010a549276a55`, blob `f6b3796c1fbde03ac6572f247cdc982f4888f07f`, blob SHA-256 `2FD0697E1DD2E8F93B7D0C040B114C51D3A0BC4F2BCFE498E10F98AFB25BA3E5` |
| `docs/Plans/combat-discovery-r1.md` | commit `d70fd853fdffacf71290b24763e010a549276a55`, blob `63da41107ac48415b873ebe6d34bade27978ab82`, blob SHA-256 `1578AA2A0167D59538FA68ED016DDD4F1461BCBD9CB01F82298851089F022DB1` |
| `docs/Plans/task-logs/combat-discovery-review-r1.md` | commit `d70fd853fdffacf71290b24763e010a549276a55`, blob `6f4751f060bb9da99969ce6e08144878cb5f5ece`, blob SHA-256 `D95962D55E2FC22DA8F0DDA849D67B89382AD5D247A2BFE11BDE905AEFA8840E` |
| `docs/Plans/task-logs/combat-shared-dispatch-review-r1.md` | commit `d70fd853fdffacf71290b24763e010a549276a55`, blob `61c2e410925dc607ceeec2443e6dccc6e84eacc6`, blob SHA-256 `5CDA8E1FCEDD4FF777FCEA29DC8E668B00195FC1DA5333A6E563D024638859B1` |
| `src/lib/func_0020BFF8.c` | commit `d70fd853fdffacf71290b24763e010a549276a55`, blob `5c0bcce621ecf1c9765add96023d41e0fe9d1658`, blob SHA-256 `A121834C101C03CF128EB19987556A1D4B74349186E0BBB605731DFB127C7D3D` |
| `../docs/Plans/combat-body-resources-family-inventory-20260905.md` | raw bytes 25847, SHA-256 `1FD28B5ADAE9BBEE9D4F8F4619A2D2962A89FA1049E1B976898875FB36171B83` |

- Machine-readable package: `build/combat-draw-inputs-r1/w8-inputs.json`, 99239 bytes, SHA-256 `4340C97DE145E1970D62F909B443894ACECFF3742F544D9BB41CCE0A9263025D`.

## Verification summary

- Draft membership and sequential inventory match exactly: 14/14, no extras.
- Every target has one accepted membership row and one original ASM manifest part.
- Every accepted byte count agrees with its manifest range; all fourteen worktree assembly hashes equal manifest hashes.
- Counts: one canonical C/target/linkage record, 28 incoming relocations, zero W8 group references, 195 direct calls, zero indirect-call or non-return-indirect-jump comment records, zero accepted W8 switch rows, six accepted auxiliary records, zero exact frozen candidates, one frozen dependency record, and one frozen consumer.
- Both prior package hashes matched before their target maps were reused.
- The output JSON was decoded after writing. No build or acceptance command was run.

## Protocol deviations

None. Main advanced through other owners while extraction ran; every accepted repository input remained pinned to `d70fd85`.

## Proposed canonical-document changes

None.

## Next action

The Director may provide this literal package to a later W8 implementation task after separately binding accepted prerequisite waves and sole production ownership. This retrieval task releases all writes.
