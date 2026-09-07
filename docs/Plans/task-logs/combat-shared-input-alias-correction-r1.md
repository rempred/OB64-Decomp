# Combat shared input alias correction r1

## Outcome and scope

Status: complete. This data-only correction audited the frozen terminal and resolution retrieval packages against the exact accepted W7 linkage registry, corrected only their per-call `acceptedLinkageAliases` arrays in new package copies, and preserved the frozen predecessors byte-for-byte. It did not change accepted source, configuration, shared tooling, production inputs or any matching status.

## Baselines and authenticated inputs

- Accepted W7 source: `469a1416918592749d61dc34e3e079796f7b673c`.
- Assignment ready: `070db8450ed088eafe8aef34827c5f8312dbc00d`; activation: `985728467e99154e4d9cc66f7d2ab41423c55dbf`; coordination: `9cbd996b05f8bdbc393dda0fbfb61151ac0c65c8`.
- Launch: `COMBAT-SHARED-INPUT-ALIAS-CORRECTION-20260907-01`; receiver `/root/combat_data_retrieval`; Director native task `01a07262-aeca-7341-ad10-2dba705ff988`; host `local`; `gpt-5.6-sol`, high reasoning.
- Frozen terminal predecessor: freeze `44fba4a847ea197cdca76b1d04be905e245a508e`; report SHA-256 `46E98A06292E9E09F5A61C93B89596B145D2872B5D2F456249AD8BA3E5EBDE4C`; package SHA-256 `E933CE792D1F52440F242605C20F485CA1A9BABDA516F762C63D2A92386569D5`; extractor SHA-256 `8FE023F2FD35E84E3101D5F4877C68FD3CD3B706CF3F8423776E1024E3EB8F7E`.
- Frozen resolution predecessor: freeze `6cdf6afed32b3362fdda98d8eb4cfe831b690786`; report SHA-256 `004C80ECB0D91243525F7C5C52C1D11A76A6411926CF0190126D91DA7686446D`; package SHA-256 `97EBF95C1AB96ADB26FD684AF78384F34068C55537A45C1198763C2D864EC12C`; extractor SHA-256 `7A10EEAA417CE1777C28C7916FFF89DFA29F4B8B09EDDCB8C3745E6FAA0909F6`.
- Accepted registry: `config/matching-c-linkage.json` at W7, Git blob `647158b9087241c64e8fb2fbccc2860e9c2f7ab2`, 663,072 bytes, raw SHA-256 `8A666E99FA205F1B9400C10D5F539AFE3E86DDEE47A4D16CF4B8158C7D4D574D`, 653 `symbols` records.
- EBBC preparation report SHA-256 `C678D309B66EB84F8E1997BA4276FAF95CC3CF3C78DE4E607CB9EF0A7888D87F` and evidence SHA-256 `27877F54E6FBCAD2989A13818FD70B4FE3FA6D746E21C6244209969BCA209199` match their assigned identities.

## Exact parsing defect

Both frozen extractors indexed `symbols[].address` exactly as stored in the accepted linkage JSON: a hexadecimal **string** such as `"0x80093060"`. They decoded each instruction target to an **integer**, then queried the string-keyed dictionary with that integer. Python treats those keys as unequal, so every lookup returned the fallback empty list. The EBBC preparation exposed five valid target-address aliases; it did not show that the packages read the wrong field.

The correction rejects any linkage symbol record other than exactly `{name, address}`, rejects empty or non-string names, and accepts only address strings matching `^0x[0-9A-Fa-f]{8}$`. It parses both linkage addresses and package `decodedTarget` strings to integers before lookup. All 653 accepted symbol records passed this shape check. Incoming relocation records remain separate and were not changed.

## Terminal package correction

The complete fifteen-member terminal package contains 322 literal direct-call records and 93 unique decoded target addresses. Normalized lookup yields 42 positive call records at 9 unique target addresses; the other 280 call records at 84 unique addresses have no accepted registry alias. The frozen predecessor had zero nonempty alias arrays.

| Decoded target | Accepted linkage aliases | Call records | Terminal members containing those records |
|---|---|---:|---|
| `0x80070F30` | `func_00001330`, `func_00070F30`, `func_80070F30` | 3 | `func_0021D7F0`, `func_0021DCA4`, `func_0021E50C` |
| `0x800712C4` | `func_000016C4`, `func_800712C4` | 3 | `func_0021D7F0`, `func_0021DCA4`, `func_0021E50C` |
| `0x80093060` | `func_00023460` | 20 | `func_0021D7F0`, `func_0021DCA4`, `func_0021E50C`, `func_0021EBBC` |
| `0x80093380` | `func_00023780`, `func_80093380` | 5 | `func_0021D7F0`, `func_0021DCA4`, `func_0021E50C`, `func_0021EBBC` |
| `0x8016DBD8` | `func_0016DBD8` | 3 | `func_0021D7F0`, `func_0021E50C`, `func_002213DC` |
| `0x801BC35C` | `func_001BC35C` | 4 | `func_002213DC`, `func_002215D0`, `func_00222530` |
| `0x801CA29C` | `func_001CA29C` | 2 | `func_0021EBBC` |
| `0x801CC37C` | `func_0020F80C` | 1 | `func_0021EBBC` |
| `0x801D96A0` | `func_801D96A0` | 1 | `func_0021EBBC` |

Within complete `func_0021EBBC`, the EBBC preparation's five positive target addresses account for 14 positive call records: eight to `0x80093060`, two to `0x80093380`, two to `0x801CA29C`, one to `0x801CC37C` and one to `0x801D96A0`. Its five alias lists agree exactly with the accepted registry lookup.

Corrected copy: `build/combat-shared-input-alias-correction-r1/terminal-inputs-corrected.json`, 173,027 bytes, SHA-256 `8129EAC6B6E5C93C22741B7C0407094987222040436E1719D7E9474B5373AA3E`.

## Resolution package correction

The directly related complete seven-member resolution package contains 264 literal direct-call records and 86 unique decoded target addresses. Normalized lookup yields 45 positive call records at 7 unique target addresses; the other 219 call records at 79 unique addresses have no accepted registry alias. The frozen predecessor had zero nonempty alias arrays.

| Decoded target | Accepted linkage aliases | Call records | Resolution members containing those records |
|---|---|---:|---|
| `0x80093060` | `func_00023460` | 1 | `func_0022F580` |
| `0x80093380` | `func_00023780`, `func_80093380` | 12 | `func_0022F580`, `func_00230A9C`, `func_002317C8`, `func_00231CC0`, `func_00232458`, `func_00232D7C` |
| `0x8009C7CC` | `rand` | 24 | `func_0022F580`, `func_00230A9C`, `func_00232458` |
| `0x8016F5E0` | `func_000454E0` | 1 | `func_00230A9C` |
| `0x801CA29C` | `func_001CA29C` | 4 | `func_0022F580`, `func_00230A9C`, `func_00232458` |
| `0x801CC37C` | `func_0020F80C` | 1 | `func_00232D7C` |
| `0x801F0E1C` | `D_801F0E1C` | 2 | `func_0022F580` |

Corrected copy: `build/combat-shared-input-alias-correction-r1/resolution-inputs-corrected.json`, 115,834 bytes, SHA-256 `0EFA3D1990C347FBCCFCA32666FE6430BFDD0491E780B43D4F91CC68787BC1B1`.

## Conservation and evidence

The corrected copies preserve the original package schemas, task/baseline metadata, complete owner and wave scope, member order, all owner extents and continuations, placements, source identities, archive records, contracts, incoming relocations, call order and every call field other than the affected `acceptedLinkageAliases` arrays. Replacing the 42 terminal and 45 resolution corrected arrays with their predecessor values makes each corrected JSON object exactly equal to its predecessor object. Every positive call record has the complete sorted accepted alias list; every other recorded target has an empty list.

Correction metadata remains separate from the copied extraction packages in `build/combat-shared-input-alias-correction-r1/identity-map.json`, SHA-256 `B20AD73F3A7B95C0E151D0D40E4FDF4943994FC932A64F711054CFB91CDEF9CF`. It records every changed JSON path with target, source part, site ROM, decoded target and before/after alias arrays; it also lists all positive and negative unique target addresses and exact predecessor/output identities. The bounded correction utility is `build/combat-shared-input-alias-correction-r1/correct_aliases.py`, SHA-256 `01B077D798C25BD54EA96A420BE7B441039237E160A237CB8C83CD799A991143`; the atomic claim SHA-256 is `A2878435B0298D84355F397BEAFB947144A40D2163F4A2158C33919DBBDB8B8C`.

A deterministic rerun reproduced both corrected package hashes and the identity-map hash. The original reports, packages and extractors retain their authenticated bytes. This report supersedes only the frozen predecessor statements and fields asserting that no decoded direct-call target had an accepted linkage alias.

## Limits and released surfaces

The accepted symbol registry establishes literal same-address names only. This correction makes no caller, callee, ownership, execution, semantic, placement, source-acceptance or matching conclusion from those names. It does not audit any package beyond the assigned terminal and directly related resolution packages.

Owned surfaces are the fresh claim, this report, and `build/combat-shared-input-alias-correction-r1/`. No production source, configuration, shared tooling, frozen predecessor, W8 input or other worker output was modified. No compiler, build, verifier, runtime, database, external source, agent or Git mutation was used. Protocol deviations: none. All assigned writes are released at terminal handoff.
