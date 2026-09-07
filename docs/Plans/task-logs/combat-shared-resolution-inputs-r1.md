# Combat shared resolution inputs r1

## Outcome and scope

Status: complete. This retrieval-only assignment collected the existing accepted inputs for the complete seven-member future shared resolution wave. It did not activate, divide, reconstruct, implement, build or accept that wave.

## Baselines and authority

- Accepted W7 source baseline: `469a1416918592749d61dc34e3e079796f7b673c`.
- Assignment ready commit: `a568ce9bb8897754e477fbb0e57f56ae2a2911a6`.
- Activation commit: `874544ccddb31dad1315d9d713589437a9104e7d`.
- Coordination baseline: `24ebe27d682eda4d15216aab0ccb71fe901d771c`.
- Accepted sequential scope and target inventory: `93226492485a62bf5654810db8b333ffd601d4c5`.
- Accepted shared-member reconciliation: `58906b64febb013028455f523023770e594c22d6`.
- Launch: `COMBAT-SHARED-RESOLUTION-INPUTS-20260907-01`; receiver `/root/combat_data_retrieval`; Director native task `01a07262-aeca-7341-ad10-2dba705ff988`; host `local`; `gpt-5.6-sol`, high reasoning.
- W8 draw production changes were excluded. Source and configuration extraction used named Git objects, not mutable checkout copies.

The accepted sequential program schedules this complete resolution wave after the complete seventeen-member shared action-mode wave and its accepted baseline. The current Director draft preserves the same seven names. This report copies those assignments and does not make a new membership or scheduling decision.

## Literal owner and placement inventory

All seven entries are `high-attack` wave 7 owners, `ASM`, `not-accepted-as-c`, with execution owner `high-attack` in the accepted sequential target inventory. All lie within accepted equal-length non-descriptor placement record `resource-loader-0022a280`: ROM `0x0022A280..0x0023A3A0` maps to VMA `0x801E6FB0..0x801F70D0` in `config/phase7/conventional-build.json`.

| Target | Accepted semantic owner | Complete ROM extent | Accepted saved VMA extent | Logical bytes | Literal `jal` sites |
|---|---|---|---|---:|---:|
| `func_0022F580` | p4181 / `primary:24285661f686f7acd7ed` | `0x0022F580..0x00230A9C` | `0x801EC2B0..0x801ED7CC` | 5,404 | 90 |
| `func_00230A9C` | p4182 / `primary:8cc7217cf44f86d7ce6e`; p4183 / `primary:48c26db372eedd57dc4c` | `0x00230A9C..0x002317C8` | `0x801ED7CC..0x801EE4F8` | 3,372 | 69 |
| `func_002317C8` | p4184 / `primary:b43152d61ab3fa785407` | `0x002317C8..0x00231CC0` | `0x801EE4F8..0x801EE9F0` | 1,272 | 20 |
| `func_00231CC0` | p4185 / `primary:975e6be9e846190c59f8` | `0x00231CC0..0x00232280` | `0x801EE9F0..0x801EEFB0` | 1,472 | 3 |
| `func_00232280` | p4186 / `primary:cad4d2ba2ac25a4eac86` | `0x00232280..0x00232458` | `0x801EEFB0..0x801EF188` | 472 | 6 |
| `func_00232458` | p4187 / `primary:49387246f98f15768fca` | `0x00232458..0x00232D7C` | `0x801EF188..0x801EFAAC` | 2,340 | 43 |
| `func_00232D7C` | p4188 / `primary:859f5bdcfb2c0d75a1b9` | `0x00232D7C..0x002331AC` | `0x801EFAAC..0x801EFEDC` | 1,072 | 33 |

The accepted semantic rows supply exact ROM owner identities but contain no VMA fields. The saved VMA ranges above are offset projections within the accepted equal-length slab record. All six non-descriptor slabs and all nineteen static overlay reservations were checked; this slab uniquely contains every complete owner, while no static overlay reservation contains them. Saved placement is not execution evidence.

The original assembly instruction comments retain a different decoded-instruction VMA series. Those comments expressly call decode comments aids. The package preserves their first and end VMAs per physical part, separately from the accepted slab placement, without reconciling or substituting them.

## Complete continuation and assembly identities

The controlling High Attack table lists 1,380 bytes for `func_00230A9C`, exactly its chunk-34 head `0x00230A9C..0x00231000`. The original manifest, source comments, chunk ownership review and both canonical dossiers declare its chunk-35 continuation `0x00231000..0x002317C8`; the return is at `0x002317C0`, delay slot at `0x002317C4`, and boundary at `0x002317C8`. The future seven-member scope therefore retains 3,372 logical-owner bytes in two physical parts. The seven table-head byte counts total 13,412; complete logical-owner extents total 15,404.

| Logical target / physical part | ROM extent | Bytes | Manifest/raw SHA-256 |
|---|---|---:|---|
| `func_0022F580` | `0x0022F580..0x00230A9C` | 5,404 | `3B9E75EAAD4DF53BA4135F890006EE4C04C200A72234419C5DA9930159B188AA` |
| `func_00230A9C` head | `0x00230A9C..0x00231000` | 1,380 | `3967B2372FC919C9F6F4BD63F7B8945B8D1CC3D81F6457B5440A882476B81471` |
| `func_00230A9C_chunk35tail` | `0x00231000..0x002317C8` | 1,992 | `8D5747B8A1B6F85B9161790EF65409D501D5259EEBD59D3F83FA1D12FB35385B` |
| `func_002317C8` | `0x002317C8..0x00231CC0` | 1,272 | `CEDE26E567FDCBCA91B8D6B7582717611D9F65D334F379646961D61B23C0089A` |
| `func_00231CC0` | `0x00231CC0..0x00232280` | 1,472 | `B1E9EF2CC30D2BF0ADD9FDB1A076AD463D1E89DBA0F5C8B3A0EEB4EE9BF38A3E` |
| `func_00232280` | `0x00232280..0x00232458` | 472 | `A68FC7DDB8893C0BD8EA68AECFADE7F5929839C8177A2A80C2B04D90333E86EE` |
| `func_00232458` | `0x00232458..0x00232D7C` | 2,340 | `56F6542D4EB7959B6556A38AFCD925E3F87EC6D65A1DC09DAD4F64DE995BB159` |
| `func_00232D7C` | `0x00232D7C..0x002331AC` | 1,072 | `D09433CB44A32D1578BF684F33D0628E8ECDB23B3266A3A622E5CFA598627DBB` |

All eight raw assembly hashes equal their accepted manifest hashes. `func_00232458.s` declares one internal indirect jump resolved within the function and no inline data table at its boundary. The bounded parse records one non-return `jr` in `func_00232458` and one in `func_0022F580`; it derives no table boundary or new partition.

## Calls and existing contracts

The package contains all 264 opcode-3 `jal` words from the eight accepted physical assembly parts, with site ROM, decoded source-comment VMA, raw word, decoded target, source part and any exact address aliases found in the accepted linkage symbol registry. None of the 264 target addresses has an accepted alias in that registry. The parser found no `jalr` instruction in these parts. These statements cover only the named source records and are not a caller or transfer census.

At accepted W7 baseline, all seven have:

- no canonical C path or active matching-target record;
- no linkage target contract or auxiliary-section contract;
- no incoming relocation from an existing accepted linkage target contract;
- no multi-owner contract; and
- no accepted compilation-group membership.

These are expected bounded absences for unactivated assembly owners. Incoming-relocation absence is limited to the accepted linkage registry and is not a global caller census.

## Frozen archive references

The canonical archive index `docs/archive/matching-c-candidates/resumption-20260906/manifest.json` was searched in its `sources`, `notes` and `dependencyCatalog` fields for each exact target name. It contains no exact record for any of the seven. The accepted sequential target inventory independently records an empty `archivedCandidates` list for all seven. No historical worktree tree or external source was searched, and archive absence does not prove that no experiment ever existed elsewhere.

## Evidence index and hashes

- Literal package: `build/combat-shared-resolution-inputs-r1/resolution-inputs.json`, SHA-256 `97EBF95C1AB96ADB26FD684AF78384F34068C55537A45C1198763C2D864EC12C`.
- Bounded extractor: `build/combat-shared-resolution-inputs-r1/extract_inputs.py`.
- Accepted ownership and assembly: `config/splat/us_rev0.semantic.json`, `config/splat/us_rev0.overlay-linker-inputs.json`, `asm/original/rev0/manifest.json` and the eight assembly paths listed in the package at `469a1416918592749d61dc34e3e079796f7b673c`.
- Accepted placement: `config/phase7/conventional-build.json` at the same baseline.
- Existing contracts: `config/matching-c-targets.json`, `config/matching-c-linkage.json`, `config/matching-c-multi-owner.json` and `config/matching-c-compilation-groups.json` at the same baseline.
- Canonical continuation records: `docs/REVIEW_2026-06-23_chunks34-35-source-ownership.md`, `docs/dossiers/lib-chunk34-221000-231000.md` and `docs/dossiers/lib-chunk35-231000-241000.md` at the same baseline.
- Exact Git-blob SHA-256 values for every used input are in `sourceIdentities` in the package.

## Verification summary

- 7/7 ordered members agree across the Director draft, controlling High Attack W7 table and accepted sequential target inventory.
- 7/7 logical owners resolve uniquely; 8/8 physical assembly parts and raw hashes match the accepted manifest.
- 7/7 complete logical extents have one accepted containing non-descriptor placement record.
- 264 literal direct calls, 0 indirect `jalr` sites, and 2 non-return `jr` sites in the exact bounded parts.
- 0/7 active target, linkage target, multi-owner or compilation-group contracts; 0 accepted incoming relocation records.
- 0/7 frozen archive exact-name records and 0/7 accepted archived candidates.
- Deterministic extractor rerun reproduced the same package bytes and SHA-256.

## Changed surfaces

- `docs/Plans/task-logs/combat-shared-resolution-inputs-r1.claim.json`
- `docs/Plans/task-logs/combat-shared-resolution-inputs-r1.md`
- `build/combat-shared-resolution-inputs-r1/extract_inputs.py`
- `build/combat-shared-resolution-inputs-r1/resolution-inputs.json`

## Limits and protocol

No semantic meaning, candidate C, compiler workaround, new boundary, ownership decision, source acceptance, build, diff, verifier, runtime, database, GUI, external source or Git mutation was used. No production source, configuration, shared tooling, historical record or other worker output was modified. No agent or background process was started. Protocol deviations: none.

Director/Astra may interpret the literal package only after binding the preceding complete action-mode accepted baseline and sole future production ownership. All assigned writes are released at terminal handoff.
