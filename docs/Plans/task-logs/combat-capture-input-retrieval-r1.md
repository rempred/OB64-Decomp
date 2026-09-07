# Combat capture input retrieval r1

Status: complete; all assigned writes released.

This report inventories existing metadata for files below parent
`runtime-states/vanilla/rev0`. Every displayed state label is the filename and remains an
**unverified filename label**. Neither the `vanilla/rev0` directory name nor a catalog entry
establishes current in-state ROM identity, gameplay position, selector reachability, or suitability
for a runtime observation.

## Baseline and scope

- Assignment: `combat-capture-input-retrieval`, revision 1.
- Launch ID: `COMBAT-CAPTURE-INPUT-RETRIEVAL-20260906-01`.
- Receiving task: `/root/combat_data_retrieval` on host `local`.
- Director task: `01a07262-aeca-7341-ad10-2dba705ff988`.
- Canonical branch and activation HEAD: `main` at
  `0ff1776a9831319574a2666300f7a7d692b6b4bf`.
- Parent branch and activation HEAD: `main` at
  `f940a2825ac97453746d3e9cef9c5cabc60a8dd2`.
- Inventory profile: `NORMAL`.
- The assigned claim, report, and output root were absent before activation.

All runtime assets, manifests, production files, tools, databases, and prior reports remained
read-only. No state was opened, decompressed, parsed, hashed, copied, loaded, modified, or deleted.
No emulator, database, build, or semantic operation occurred.

## Bounded inventory result

The bounded filesystem has 109 files totaling 148,286,674 bytes. Every file is named with the
`.pj.zip` suffix; there is no metadata document within `runtime-states/vanilla/rev0` itself. Counts
by first directory are: `battle` 22, `core-menus` 34, `dialogue-cutscene` 27, and `scenario-map`
26.

The explicit `battle` directory supplies 22 records. The table keeps paths relative to
`runtime-states/vanilla/rev0/battle/`. `Catalog SHA-256` is copied from the July 8 generated
catalog and was not recomputed against the current state file.

| Unverified filename path | Current bytes | Catalog SHA-256 |
|---|---:|---|
| `battle_active/Battle Start magic on both sides.pj.zip` | 1,069,912 | absent |
| `battle_active/Battle active after spell unit has status effect animations on.pj.zip` | 1,316,106 | `15FAA15B2CC66B8EB6F9E607E96A986706C38B554765B37510B70B216D3EE10D` |
| `battle_active/Battle active mid ally unit attack animations on.pj.zip` | 1,426,482 | `CB21E7D90C03C514E079C628544F35AD393D13E71DF0E69454D28F59D44C57EF` |
| `battle_active/Battle active mid enemy unit attack animations on.pj.zip` | 1,424,393 | `3D5029393E0020ADBA9D22D0BFA59BBEA90D0E00753E03F0BCBB689CB89BE735` |
| `battle_active/Battle active mid enemy unit spell attack animations on.pj.zip` | 1,317,132 | `AA1A5119BA5F600B9937722765109AE54671F746961649C78293BFF8B906B0BB` |
| `battle_command_prompt/Animation battle menu.pj.zip` | 1,411,772 | `713DCD68F8F735378DC5DD962EAF0CAE604C000C10BA2178202D75143B6FDDA8` |
| `battle_command_prompt/Battle Strategy menu.pj.zip` | 1,425,866 | `4D56A5FAC11299C9BD6A8BD7A3A93200BC27D8F1910B647322DBE60D900D1BD9` |
| `battle_ending_or_results/Battle Ended Title Card.pj.zip` | 1,292,031 | `2A80D89A91E327F4D932803523FDF234A289DA2FA27BC4838CCD8410CA0B5070` |
| `battle_ending_or_results/Battle ended XP reward.pj.zip` | 1,406,598 | `C6B55744281E6F1EB4A212D513ABA69BE795F6C6B9C58F8EB31924E25C80802B` |
| `battle_ending_or_results/Battle ended alignment adjustment.pj.zip` | 1,406,674 | `90D72298F1AEAEF937EF2384C4338301F9767D322163CB6BA71B7977FDF9B720` |
| `battle_ending_or_results/Battle ended fading out.pj.zip` | 1,134,045 | `32F9E6741B2516BB6578437E31792E1D40D57977FE3EFD04798D155FD3CA3614` |
| `battle_ending_or_results/Battle over Reward Drop loading.pj.zip` | 1,343,998 | `D1AEA15A70B3989CC47B7BD433FCB9BA72C398FF8848B271E9F0AB59480DA08A` |
| `battle_ending_or_results/Battle over Reward Dropped.pj.zip` | 1,378,022 | `F88042828035622FE1CD4FA5A046C9FDBF98A42BEAA4E80F3E9EA471F48CC2D9` |
| `battle_loading_or_intro/Battle Loading from card 2.pj.zip` | 1,208,378 | `41262639097B9440498CF80D3AE1F3D23BBB247A4CB78357D5165F226C2208B2` |
| `battle_loading_or_intro/Battle Loading from card 3.pj.zip` | 1,185,188 | `BFBE9AC58018B869063C96997E635689E311DA2B09A50AE44E8D5CE9A4522447` |
| `battle_loading_or_intro/Battle Loading from card.pj.zip` | 1,255,041 | `1FF0FB520E903D32B746AA02B4C13433516FB2AEDEBCF8AE72895954212FDE1E` |
| `battle_loading_or_intro/Battle Scene Loaded FIGHT IT OUT gone ANIMATIONS ON.pj.zip` | 1,407,896 | absent |
| `battle_loading_or_intro/Battle Scene Loaded FIGHT IT OUT gone.pj.zip` | 1,373,679 | `1ADE3B026F18C942217D49DC22E996746F8A18C83F1B08223E09B53AF4A8456B` |
| `battle_loading_or_intro/Battle Scene Loaded FIGHT IT OUT on screen.pj.zip` | 1,294,131 | `B8DC765BC400DD5A91D900620EA057096AE5BB3C73C8786A075A72FCD8AA1FE3` |
| `battle_loading_or_intro/Battle Start Card in scenario preload.pj.zip` | 1,372,364 | `641AD6AFAF23E91C3FFDE3D9EB11DAE313F7E6F79A0E113A7E50F5A120C58375` |
| `battle_loading_or_intro/Battle loading from scenario.pj.zip` | 1,251,381 | absent |
| `battle_loading_or_intro/Battle started no animations.pj.zip` | 1,428,532 | `28D75CC1677BC047B3D6A5122E28FC4A653591ADC8B4AC9782BAF719395E1DF8` |

Four additional files outside the explicit `battle` directory contain the literal
case-insensitive word `battle` in their filenames. They are returned separately as lexical hits;
their relevance is not inferred. Paths are relative to `runtime-states/vanilla/rev0/`.

| Unverified filename path | Current bytes | Catalog SHA-256 |
|---|---:|---|
| `scenario-map/scenario_map_loaded/SCENARIO 1 LOADED Mission failure battle card.pj.zip` | 1,502,604 | `709672BE4F358FB8D79999DC256B33EBFFEDFA4412F65DD60D9DDDEB796115FD` |
| `scenario-map/scenario_map_loaded/SCENARIO 1 LOADED Mission objective battle card.pj.zip` | 1,478,295 | `F691C8AEED383F8C6275A8FF6A7A58780E137468F0BBD1F0AA1E76FAD84E91F0` |
| `scenario-map/scenario_map_loaded/SCENARIO 1 LOADED Missionstart battle card title fade in.pj.zip` | 1,491,502 | `50B0AB96F3758D931A220A11A6DF57034BD4F0FE5CB7B23196BEB8826B46F79C` |
| `scenario-map/scenario_map_loaded/SCENARIO 1 LOADED before battle cards.pj.zip` | 1,447,029 | `A8443E4C1B8E9D73BBB02372DDD61518CBA3610F89684BB749B13ABAEFF282BA` |

## Catalog coverage and provenance

The paired generated manifests are parent `runtime-states/INDEX.md` and
`wiki/runtime-state-index.json`. They report generation at `2026-07-08T03:54:47.524Z` by
`tools/gen_runtime_state_index.js` from parent HEAD
`cf72a43c52c5ae1855cbf9f2b89c6cd3d10d1501`. Their recorded corpus is 103 files totaling
141,022,494 bytes in 18 categories, with 10 curated notes.

All 103 catalog paths still exist and their catalog byte sizes equal current filesystem sizes.
There are no catalog paths missing from the filesystem. Six current filesystem paths are absent
from the catalog:

- `runtime-states/vanilla/rev0/battle/battle_active/Battle Start magic on both sides.pj.zip`
- `runtime-states/vanilla/rev0/battle/battle_loading_or_intro/Battle Scene Loaded FIGHT IT OUT gone ANIMATIONS ON.pj.zip`
- `runtime-states/vanilla/rev0/battle/battle_loading_or_intro/Battle loading from scenario.pj.zip`
- `runtime-states/vanilla/rev0/core-menus/army_management/Character Card.pj.zip`
- `runtime-states/vanilla/rev0/core-menus/army_management/Squad select menu IN SCENARIO.pj.zip`
- `runtime-states/vanilla/rev0/core-menus/army_management/Squad select menu v2 IN SCENARIO.pj.zip`

The 19 cataloged files in the explicit battle directory and all four supplemental lexical hits
have `note: null` and `noteSource: null` in the JSON manifest. The human index renders those as
`filename only — undescribed`. The catalog describes the overall corpus as
`fork-build/vanilla-ROM lineage` and explicitly leaves per-state in-state identity enrichment as a
TODO. That corpus-level statement is the only catalog provenance available for these 23 files; it
does not verify the current files as vanilla Rev 0 states.

Three exact-path references add limited recorded provenance:

- `wiki/after-action-reports/20260719-b52-magic-damaging-combat-fixture-aar.md:78`
  records SHA-256
  `DE2022F3AF7DA5E4CA7C1DF2FF976915FA3CA585A54A3D18C7178B4293AC8ECF` for
  `Battle Start magic on both sides.pj.zip` and labels it `Joe-supplied immutable primary`.
  The current file was not rehashed here. The same report's exact Rev 0 header statement applies
  to its later working/final states, not explicitly to this source file.
- `wiki/after-action-reports/20260725-combat-attacker-body-animation-table-and-swap-correction-aar.md:90`
  records SHA-256
  `464BCC227F8C8151F78572ED92F40F5CD0F4692308C837B8762FEDEC28CEE583` for
  `Battle Scene Loaded FIGHT IT OUT gone ANIMATIONS ON.pj.zip`, calls it a Joe-supplied
  authoritative animations-on starting state, and says it was copied hash-equal while the source
  remained read-only. The report records retail ROM CRC `E6419BC5/69011DE3` for that run. The
  current source file was not rehashed here, so those remain document assertions rather than a
  fresh identity check.
- `docs/combat-modes.md:2131` calls
  `Battle active mid enemy unit spell attack animations on.pj.zip` an offline live-code source and
  records the same `AA1A...B0BB` SHA-256 as the generated catalog. This is a corroborating document
  reference, not a current rehash or gameplay validation.

An exact bounded text search in parent `docs/`, `wiki/`, and the catalog found no reference for
`Battle loading from scenario.pj.zip`; it therefore has no documented hash, provenance, or ROM
identity in this retrieval.

## Deterministic retrieval package

| Artifact | SHA-256 |
|---|---|
| `build/combat-capture-input-retrieval-r1/inventory.py` | `55DD3CDBF73D49F47C465BE0286116AD876E63D3C09F7F6A7377DD220D28E71F` |
| `build/combat-capture-input-retrieval-r1/inventory.json` | `92FA19DF904CE222C42E241F50020B57749AC8597D4A450C5D0070A9DC6FFA2B` |
| `docs/Plans/task-logs/combat-capture-input-retrieval-r1.claim.json` | `5DD3D2BF3F87551F1DF0FABA443660CD92EF3A65B3156DD7236BFED60898B96F` |
| parent `runtime-states/INDEX.md` | `E22F580FBE8074D57AC64C9AABA150A8175996A2E1E8D9F092BCC72A106D02BB` |
| parent `wiki/runtime-state-index.json` | `3E25EA1BB222C2F8B0C053F9995399FE08645350644ED845C1CEC9AB351A4AB7` |
| parent `tools/gen_runtime_state_index.js` | `AA71F6DBF575A2DDFE783E103E1F858ABDA9A5D460AA3F27A1C1EB0EED4650FA` |
| parent magic-fixture AAR | `388233E06F0970B11638DBCD48B1A9A6D359B2E87FE36DEFBAF64E33153D7838` |
| parent animations-on AAR | `868B588C03A4710C372BD0C7CC99F9A863E41EEC7FA3191AAC61DAC93C99D2BD` |
| parent `docs/combat-modes.md` | `143FDB0850BC141AFB7EFC32FAC1B06A0EFA91340C00BF583723E401D3EA007A` |

`inventory.json` preserves exact current paths, sizes, UTC modification timestamps, catalog fields,
catalog-versus-filesystem coverage, and explicit null catalog records. The parser enumerates only
the bounded `rev0` parent directory and reads the existing machine catalog. It hashes only metadata
sources, never state files.

## Coverage limits

- Selection is exhaustive for the explicit `battle` directory. The supplemental set is exhaustive
  only for the literal word `battle` in filenames outside that directory; it makes no semantic
  relevance claim and does not attempt synonyms.
- Catalog hashes were accepted as recorded fields and were not verified against current state
  bytes. The two hashes from later AARs were also not verified against current state bytes.
- Filename labels, directory categories, modification timestamps, and sizes do not prove gameplay
  state, ROM identity, revision, execution, or selector reachability.
- No state contents or archive member names were read. No RAM or runtime metadata was decoded.
- No selector trigger is demonstrated and no runtime owner is selected by this inventory.

## Activity log

- Read the complete assignment, canonical and parent agent guides, and parent worker workflow.
- Found no nested `AGENTS.md` beneath the bounded parent `runtime-states` path.
- Confirmed the canonical and parent baselines and preserved unrelated concurrent changes.
- Confirmed the claim, report, and ignored output root absent, then created and verified the claim
  with create-only semantics before the report or ignored parser outputs.
- Enumerated filename/stat metadata under the bounded parent path, parsed the existing paired
  catalog, and performed exact-path searches only for directly relevant local references.
- Wrote only the assigned claim, this report, and ignored deterministic retrieval outputs.
- Completed the literal inventory and released all assigned writes. No staging, commit, or push was
  performed.
