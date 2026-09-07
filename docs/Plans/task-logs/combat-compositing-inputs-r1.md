# Combat compositing inputs r1

## Outcome and scope

Status: complete; terminal retrieval package released.

This retrieval-only assignment copied existing inputs for the seven draft W7 members. It did not activate W7, change production or matching configuration, derive technical or semantic conclusions, draft C, or run compilation, diff, source-policy, verifier, runtime, emulator, or database tools.

## Baseline

- Frozen assignment commit: `4445f9c0cf707a5681b97b8579a02709e93b9798`.
- Current committed retrieval baseline named by the prompt: `dff8b8c3b09996da4da08a11aef92b03a753f8cf`.
- Last accepted complete matching baseline named by the prompt: `523d4604040b1a6093a8ccb5a22ae6ded650c082`.
- Exact membership source: draft `docs/Plans/prompts/combat-compositing-wave7-r1.md`.
- Concurrent W5 working-tree source and matching-configuration changes were preserved and were not parsed as accepted evidence.

## Claims and evidence grades

- **Literal accepted-input retrieval:** 7/7 membership rows and 7/7 Rev 0 assembly manifest parts found.
- **Identity check:** all seven worktree assembly byte streams match their manifest SHA-256 values.
- **Declared source state:** all seven targets are recorded as `not-accepted-as-c` / `ASM`; none has an existing canonical C path.
- **No new technical claim:** meanings, table semantics, compiler behavior, boundaries, membership, and W7 readiness remain outside this package.

## Compact target table

`ROM end` and `VMA end` are exclusive. Every assembly path is `asm/original/rev0/lib/<symbol>.s`.

| Target | Owner row | Bytes | ROM range | VMA range | Declared state | Canonical C | ASM raw SHA-256 |
|---|---:|---:|---|---|---|---|---|
| `func_00206340` | 3836 | 1352 | `0x00206340..0x00206888` | `0x801C2EB0..0x801C33F8` | `ASM / not-accepted-as-c` | `absent` | `6F93051115D42FDFB28292247AAD687A584C05985106973CBE870D2AF5154A24` |
| `func_00206888` | 3837 | 856 | `0x00206888..0x00206BE0` | `0x801C33F8..0x801C3750` | `ASM / not-accepted-as-c` | `absent` | `4074A9C643BFB8F47BC3858579801A801CF0294492EDDEE4F48D4C5A6C0E6206` |
| `func_00206BE0` | 3838 | 1556 | `0x00206BE0..0x002071F4` | `0x801C3750..0x801C3D64` | `ASM / not-accepted-as-c` | `absent` | `D600034F55D8366C660384BA5173D54567FA4E4E37F85C424695EAB0070E342A` |
| `func_00207658` | 3841 | 1048 | `0x00207658..0x00207A70` | `0x801C41C8..0x801C45E0` | `ASM / not-accepted-as-c` | `absent` | `616E504912D1263C0E90EA21EDAAF99599D2861707A6FFFAFF4CDB054C4581ED` |
| `func_00207E30` | 3844 | 1752 | `0x00207E30..0x00208508` | `0x801C49A0..0x801C5078` | `ASM / not-accepted-as-c` | `absent` | `9EC834B385C85F14D7454B801585285812D94500FD31A0EBE377B77DECD6F0A6` |
| `func_00208508` | 3845 | 1016 | `0x00208508..0x00208900` | `0x801C5078..0x801C5470` | `ASM / not-accepted-as-c` | `absent` | `5DF93073AAF0E8A69D02387F7F9C7892136D50FEDD1D52B26195E5544FDF25D8` |
| `func_00208900` | 3846 | 1152 | `0x00208900..0x00208D80` | `0x801C5470..0x801C58F0` | `ASM / not-accepted-as-c` | `absent` | `E970E66CA97FBC4590E946400B297CFF981FB2898BB9EBE70939655C98AE880C` |

The sequential inventory stores parent membership citations at lines 117–123. The current parent file with raw SHA-256 `1FD28B5ADAE9BBEE9D4F8F4619A2D2962A89FA1049E1B976898875FB36171B83` places the same seven literal rows at lines 119–125. Both line sets are preserved in the JSON package.

## Literal direct calls

The complete 78-site list is in `w7-inputs.json`. This compact view preserves each numeric target literal and its number of call sites; the package gives every ROM call-site address and exact address-equal aliases from the accepted linkage symbol table.

| Owner | Call sites | Target literals with counts |
|---|---:|---|
| `func_00206340` | 10 | `0x801BE138` × 1, `0x801BE18C` × 1, `0x801BE0DC` × 1, `0x8009DF48` × 1, `0x801C15E0` × 2, `0x8016F5E0` × 1, `0x8009DD38` × 1, `0x801C0F50` × 1, `0x800712C4` × 1 |
| `func_00206888` | 9 | `0x8009DD38` × 3, `0x801C15E0` × 2, `0x800712C4` × 3, `0x801C0F50` × 1 |
| `func_00206BE0` | 20 | `0x801BE138` × 1, `0x801BE18C` × 1, `0x801BE0DC` × 1, `0x8009DD38` × 6, `0x801C15E0` × 4, `0x800712C4` × 5, `0x8016F5E0` × 1, `0x801C0F50` × 1 |
| `func_00207658` | 7 | `0x801BE138` × 3, `0x801BE18C` × 1, `0x801BE0DC` × 1, `0x8016F5E0` × 1, `0x801C27F8` × 1 |
| `func_00207E30` | 11 | `0x801BE138` × 1, `0x801C1EE8` × 1, `0x801BE9A8` × 4, `0x80070F30` × 1, `0x80093380` × 1, `0x801C2178` × 1, `0x801C2EB0` × 1, `0x801BE978` × 1 |
| `func_00208508` | 8 | `0x801BE978` × 1, `0x801BE9A8` × 2, `0x80070F30` × 1, `0x80093380` × 1, `0x800907E0` × 1, `0x80093060` × 1, `0x800712C4` × 1 |
| `func_00208900` | 13 | `0x801BE138` × 1, `0x801BE18C` × 1, `0x801C5078` × 1, `0x801C1EE8` × 1, `0x801BE9A8` × 4, `0x80070F30` × 1, `0x80093380` × 1, `0x801C2178` × 1, `0x801C2EB0` × 1, `0x801BE978` × 1 |

## Linkage and relocation records

At the accepted complete matching baseline `523d460`, none of the seven symbols has an active-target record, linkage-target record, incoming expected relocation, or compilation-group reference. The committed retrieval snapshot `dff8b8c` has the same zero W7 counts. Its repository-wide configuration counts differ from `523d460`, so the package preserves the two scopes separately and does not classify the later records as an accepted complete matching baseline.

## Existing switch tables and auxiliary owner

The accepted Combat discovery result records these seven W7 dispatch sites. The independent discovery review accepted the complete ten-site census with corrections; this package copies only the seven sites whose owners are in W7. Each row contains 14 ordered destinations, for 98 destination entries total. Exact ordered destinations are in the JSON package.

| Owner | Dispatch ROM site | Table ROM start | Destination count |
|---|---|---|---:|
| `func_00206340` | `0x002063A8` | `0x00213878` | 14 |
| `func_00206BE0` | `0x00206C48` | `0x002138B0` | 14 |
| `func_00207658` | `0x002076CC` | `0x002138E8` | 14 |
| `func_00207658` | `0x002077DC` | `0x00213920` | 14 |
| `func_00207658` | `0x002078C0` | `0x00213958` | 14 |
| `func_00207E30` | `0x00207E88` | `0x00213990` | 14 |
| `func_00208900` | `0x00208958` | `0x002139C8` | 14 |

All seven table starts fall inside the existing Rev 0 manifest part `table_00213840` at `0x00213840..0x00213A40`: `asm/original/rev0/lib/table_00213840.s`, 512 bytes, raw SHA-256 `F95B3C731225DA4710554F31BC9284FA34F628E8C00DB863BDA62D77A5B26E34`. The worktree raw hash matches. This is the recorded auxiliary part only; no stronger table ownership was inferred.

## Frozen archive lookup

- Manifest purpose: `Inactive restart archive; no matching or structural acceptance is conferred`.
- Exact archived candidate sources for the seven W7 symbols: **0**.
- W7 dependency-catalog records: **0**.
- Preserved candidate consumers that name a W7 symbol: **0**.
- Each sequential W7 target record also has an empty `archivedCandidates` array.

These are bounded results for `docs/archive/matching-c-candidates/resumption-20260906/manifest.json`; they do not establish global absence outside that named manifest.

## Relevant existing reports

| Record | Literal disposition | W7 references | Identity |
|---|---|---|---|
| `docs/Plans/combat-discovery-r1.md` | `frozen discovery result; accepted with corrections by its independent review` | line 26: `func_00207658`; line 42: `func_00207658`; line 49: `func_00206340`; line 50: `func_00206BE0`; line 51: `func_00207658`; line 52: `func_00207658`; line 53: `func_00207658`; line 54: `func_00207E30`; line 55: `func_00208900` | SHA-256 `1578AA2A0167D59538FA68ED016DDD4F1461BCBD9CB01F82298851089F022DB1` |
| `docs/Plans/task-logs/combat-discovery-review-r1.md` | `Accepted with corrections` | line 78: `func_00207658` | SHA-256 `D95962D55E2FC22DA8F0DDA849D67B89382AD5D247A2BFE11BDE905AEFA8840E` |
| `../wiki/after-action-reports/20260725-combat-attack-animation-source-assignment-r2-correction-independent-review.md` | `Research reopened` | line 19: `func_00206340`; line 205: `func_00206340` | SHA-256 `38381C0CBBDC171DD5E1CC90F212F34D0A4294A62168BC9F4D816C8AFAD0DBA0` |
| `../wiki/after-action-reports/20260728-combat-sprite-art-fighter-selector28-frame-token-art-chain-static-aar.md` | `complete; Outcome B bounded static source chain` | line 42: `func_00206340` | SHA-256 `804822A8F02E8533586C5B5FCC760B30F064F5D0B32914C9E205024FD7B1C00E` |

The parent `Research reopened` record and the completed static AAR are retained with their literal dispositions. This report does not promote either record. No exact parent after-action-report reference was found for the other six W7 symbols.

## Changed surfaces

- `docs/Plans/task-logs/combat-compositing-inputs-r1.claim.json`
- `docs/Plans/task-logs/combat-compositing-inputs-r1.md`
- Ignored `build/combat-compositing-inputs-r1/w7-inputs.json`

No production source, tool, configuration, ROM, archive, runtime/database state, branch, worktree, staged set, or commit was changed.

## Failed paths and limits

- Zero target/linkage/relocation/group records is bounded separately to `523d460` and `dff8b8c`.
- Zero archive candidates is bounded to the frozen resumption manifest.
- Direct-call coverage is limited to literal `jal` comment records in the seven original assembly splits. Numeric targets were not semantically resolved.
- Switch-table coverage is copied from `docs/Plans/combat-discovery-r1.md` and its accepted independent review. No new table relationship was derived.
- Original ASM boundary-candidate comments were not used for extents. The sequential inventory and original manifest supply the recorded ranges.
- Static or runtime databases, active captures, emulator state, ROM bytes, external sources, and provisional W5 content were not read.

## Evidence index

| Input | Scope identity |
|---|---|
| `docs/Plans/sequential-family-targets.json` | commit `dff8b8c3b09996da4da08a11aef92b03a753f8cf`, blob `76e9fe8ffbd96b1a1890ee38e7c68e194c3a6845`, blob SHA-256 `5938B13CC438CB047D143FB704EE800080A0ADE4D1CAE44B4BADE84E1344BDE8` |
| `asm/original/rev0/manifest.json` | commit `dff8b8c3b09996da4da08a11aef92b03a753f8cf`, blob `1f01c4c5abeebea85c6596b86fd9750e4f3e1b55`, blob SHA-256 `EE6A81334FDCFC2867BC7AF63AD56624E08C6B92D992915A45B610B44D3FCF44` |
| `docs/archive/matching-c-candidates/resumption-20260906/manifest.json` | commit `dff8b8c3b09996da4da08a11aef92b03a753f8cf`, blob `f6b3796c1fbde03ac6572f247cdc982f4888f07f`, blob SHA-256 `2FD0697E1DD2E8F93B7D0C040B114C51D3A0BC4F2BCFE498E10F98AFB25BA3E5` |
| `docs/Plans/combat-discovery-r1.md` | commit `dff8b8c3b09996da4da08a11aef92b03a753f8cf`, blob `63da41107ac48415b873ebe6d34bade27978ab82`, blob SHA-256 `1578AA2A0167D59538FA68ED016DDD4F1461BCBD9CB01F82298851089F022DB1` |
| `docs/Plans/task-logs/combat-discovery-review-r1.md` | commit `dff8b8c3b09996da4da08a11aef92b03a753f8cf`, blob `6f4751f060bb9da99969ce6e08144878cb5f5ece`, blob SHA-256 `D95962D55E2FC22DA8F0DDA849D67B89382AD5D247A2BFE11BDE905AEFA8840E` |
| `config/matching-c-targets.json` | commit `523d4604040b1a6093a8ccb5a22ae6ded650c082`, blob `fa507562e91f561a3f1faa3120dcecf5af59438f`, blob SHA-256 `762681F45DAEEA7FE983F97B751AEF78EED05C7C59E4E57784478175092AF96E` |
| `config/matching-c-linkage.json` | commit `523d4604040b1a6093a8ccb5a22ae6ded650c082`, blob `9b2fcf58440b1ee9fddbdc06983c8e86ca72bc93`, blob SHA-256 `9A8F64E9B67B663ABC8E047237DAEFD30EC863C4A90D1C342C1961D9F98FAE46` |
| `config/matching-c-compilation-groups.json` | commit `523d4604040b1a6093a8ccb5a22ae6ded650c082`, blob `db9ce5798e3ae80e61fe63b2e0f14fba1f0c6629`, blob SHA-256 `2E8000CC6D276F0E354E452E522988096CFD77EC57FF33C54808825D638D1FA6` |
| `config/matching-c-targets.json` | commit `dff8b8c3b09996da4da08a11aef92b03a753f8cf`, blob `23680b10259b0ff74b8891dcbd53c65e04c8b5f6`, blob SHA-256 `778F28D34EDA880BB2AB3949FD5857FE6FD6BAA304297BF40AF970F93673C98F` |
| `config/matching-c-linkage.json` | commit `dff8b8c3b09996da4da08a11aef92b03a753f8cf`, blob `d237110497f27df5d930a4c4d2d2bf6fb4cedafd`, blob SHA-256 `FC4C320F155B0175A0AEABD43457A058E53616DA8C4A593450A7E051000ABF8A` |
| `config/matching-c-compilation-groups.json` | commit `dff8b8c3b09996da4da08a11aef92b03a753f8cf`, blob `28e38b25b3b2bd9279241fc0678ce90456eb2d44`, blob SHA-256 `B805162A633B86E5E33A8E12416DBD4207C530C718E1AAF395B1D29F3AE53A4A` |
| `asm/original/rev0/lib/table_00213840.s` | commit `dff8b8c3b09996da4da08a11aef92b03a753f8cf`, blob `48edb1837a27126aad3e79eb627fab105369335d`, blob SHA-256 `F95B3C731225DA4710554F31BC9284FA34F628E8C00DB863BDA62D77A5B26E34` |
| `../docs/Plans/combat-body-resources-family-inventory-20260905.md` | raw bytes 25847, SHA-256 `1FD28B5ADAE9BBEE9D4F8F4619A2D2962A89FA1049E1B976898875FB36171B83` |

- Machine-readable package: `build/combat-compositing-inputs-r1/w7-inputs.json`, 44960 bytes, SHA-256 `F376C9304E9CB3AAC2B76886EBE0CACCF271D700D31191F6E8D05A56E7720E2B`.

## Verification summary

- Parsed membership equals the seven-member draft exactly, with no extras.
- Each target has one sequential membership row and one original ASM manifest part.
- All seven accepted byte counts agree with their manifest ranges; all seven worktree assembly hashes equal manifest hashes.
- Counts: zero canonical C paths, zero accepted target/linkage/relocation/group records, 78 direct calls, seven non-return indirect jumps, seven recorded switch sites, 98 ordered destinations, zero exact frozen candidates, and zero frozen dependency records.
- The `table_00213840` worktree hash equals its manifest hash.
- The output JSON was decoded after writing. No build or acceptance command was run.

## Protocol deviations

None. The lifecycle-only activation commit followed the frozen ready prompt; data reads remained pinned to the two exact baselines named by that prompt.

## Proposed canonical-document changes

None.

## Next action

The Director may give this literal package to a later W7 implementation task after separately binding the accepted preceding wave and sole production ownership. This retrieval task releases all writes.
