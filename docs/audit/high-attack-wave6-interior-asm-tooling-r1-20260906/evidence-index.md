# Retained interior assembly tooling — evidence index

Completed worker implementation and verification; independent structural review is pending.
This evidence does not establish new production ownership or complete the original matching wave.

Paths are relative to `C:/Users/Joe/Projects/OgreBattlel64/high-attack-wave-5` unless explicitly absolute.
Ignored evidence root: `build/audit/HA-W6-INTERIOR-ASM-01/`.
The associated AAR describes each changed file's causal role and every production non-activation boundary.

## Frozen inputs

| Input | Identity |
| --- | --- |
| Subject HEAD | `841462eceb640d61f0393b4a60427d1abaf84d23` |
| Branch | `codex/high-attack-wave-5` |
| Ready routing parent | `30326c62196005c5dea00f04e312b6b401c64f74` |
| Claim | `C:/Users/Joe/Projects/OgreBattlel64/docs/Plans/task-logs/high-attack-wave6-interior-asm-tooling-r1-HA-W6-INTERIOR-ASM-01.claim.json` |
| Claim SHA-256 | `1D55AA63B725899022387BC9A7D503A846675B9E7D0A21FF8E3038C9E78EC10A` |
| Target configuration SHA-256 | `ED94543EB6715C7B5B45508BEAA41D2546D98EDF75E77F0CEF6C779BA000D418` |
| Linkage configuration SHA-256 | `D4366AC399EE4DDEC03641A6FADF9423826BA6337DBE8345FB6843570EF8D2C8` |
| Active C78C source SHA-256 | `5F1020DA9FAFA524353CF1CAA3C2A4E371BB84F008E424A10DDE01B1FE9C3121` |
| Original row source SHA-256 | `DB6B37FC1619F6541AC8FD469202CCE1A11A3B0686BAC43C0CF2AD7B1EFF10FF` |
| Canonical normalized ROM SHA-256 | `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A` |
| KMC compiler SHA-256 | `F3F1C99A322F5B3D8C108C2A44AF1D6D084DD27575C5D60BF0F0D33FFF34B1C6` |

`baseline.json` records the exact claim, 7,111 protected input identities, and pre-edit implementation identities.
Its SHA-256 is `37025783306E38831FF31D93C6EB6BA305DE364862CA4FCDB262BBD3F4FCE389`.
`preservation-mid.json` reauthenticates protected bytes, claim, branch, and HEAD after the implementation and isolated probes.
Final preservation is rechecked when producing `final-proof.json` and `closure.json`.
The final closure also hashes the completed AAR, this index, and the exact parent log.

## Reproduction and evidence roles

Use the subject checkout and its configured authenticated tools.
`capture.js` runs a Node command with a fresh label and preserves stdout, stderr, exit status, timestamps, and log identity.
Each captured command's exact arguments and working directory are in its same-stem JSON record.
No prior label or terminal evidence is reused.

| Entry point | Scope |
| --- | --- |
| `node tests/auxiliary_interior.js` | Original-row assembly-proxy fixture, placement/accounting variants, and 37 negative controls |
| `node build/audit/HA-W6-INTERIOR-ASM-01/real-c-probe.js` | Fresh actual-C two-target probe, exact full ROM, independent proofs, fresh object parity, and fourteen evidence controls |
| `node build/audit/HA-W6-INTERIOR-ASM-01/recorded-probe.js` | Actual isolated artifacts, in-memory recorded-build reconstruction, and five rejection controls |
| `node tools/test.js` | Final routine tooling suite |
| `node tools/audit.js` | Full structural gate, CURRENT verification, and independent fresh compilation |
| `node tests/phase8_matching_c.js --output <final-CURRENT>` | Final recorded-build/proof and preserved auxiliary checks |
| `node tests/func_0022B06C_auxiliary.js --output <final-CURRENT>` | Accepted table and generated assembly remainder preservation |
| `node tests/func_0021B438_0021B894_switch_tables.js` | Preserved repeated-table and exterior ownership regression |
| `node tests/auxiliary_internal_padding.js` | Preserved compiler alignment-padding regression |
| `node tests/diff_object_cache.js` | Preserved cache cold/warm/stale and source-identity checks |

The actual-C probe creates a unique output directory and never edits production source/configuration.
The recorded-probe script deliberately reads the indexed successful actual-C output rather than trusting an unbound path supplied externally.
Its in-memory report is a verifier fixture, not a new production acceptance report.
Its five negative controls leave the source artifacts unchanged.

## Isolated actual-C outputs

Successful expanded probe: `build/audit/HA-W6-INTERIOR-ASM-01/real-c-aKIkXu/`.
The `result.json` contains normal verification evidence, fresh object comparisons, and fourteen evidence controls.
The `scope.json` binds source hashes, measured relocations, isolated contracts, and any fixture-only alias removal.
`generated/c/*.source-object-proof.json` contains independently reconstructed source-object and final placement evidence.
The original fallback, exact retained binary/object, linker map, ELF, and complete ROM remain under this ignored output.

The archived EF50 source SHA-256 is `3D7DC9F4744CF4777E954546498000005943C5E5FB07C394E8E028F4A62BE423`.
Its reproduced scratch object SHA-256 is `B54D6A347C82A169191F7939708115695EF48ADB3F574E0CE7852C71863C03FD`.
The retained interval SHA-256 is `C06E0C3DE2F47A65DDC68064F08498FC85592F18F24859DB20259D14681F8411`.
Its retained object SHA-256 is `FE46675A13486DF4C97F6AED7DC39B60F1D0450899DC6EBD8B092084CD69176C`.

The tracked fixture's final routine output is `test-runs/interior-asm-qMwFKT/result.json` under the evidence root.
It includes assembly-proxy identities, actual empty relocation censuses, complete row bytes, and separate retained-assembly accounting.
The assembly proxies do not establish PURE_C status.
D14C's placement-only variant does not establish a compiled target or production ownership contract.

## Preserved failed experiments

`interior-first` failed the initial pinned-linker map grammar parser; linked bytes had already matched.
`interior-third` failed because the D14C fixture omitted its accepted chunk identity.
Their nonzero exits, stdout/stderr, and isolated outputs remain preserved.
Later passing captures supersede these implementation experiments without hiding them or weakening their gates.

## Final snapshot and scope

All paths below are relative to the ignored evidence root.

| Artifact | SHA-256 |
| --- | --- |
| `final-proof.json` | `DCCA86C74030B0159FE6C0CCCD35FBCB2869C7BB6FDAFBD2850D5A24D55C1871` |
| `snapshots/audit.json` | `401ED144F8D494B57AA9293BE638C5408029CCAA2EAF72B9DFE5105866E4C318` |
| `snapshots/structural-setup.json` | `D1C16E156BC6201E3C523953C2A39D6BEEFA4FC0D376F48AF57203E26FBA50DC` |
| `snapshots/current-state.json` | `8D5B4B38ED152B1B4F5DA01E8771A494B2EC1CB7045F7661ADD2B9B859BA80C9` |
| `snapshots/verification.json` | `F5B3D9E9866C069FD4A4F18C2CFDCA49629E0177C8605B7DDFDEC96A55BE014A` |
| `snapshots/fresh-compilation.json` | `481729200857C69F7633A4BF047AF35EE373B3E499E3C153A5C0BAEF0A66EFEE` |
| `snapshots/source-policy.json` | `D9D3E19218A84492E432DF47FE0CFBD9F768731239243B9F4CED2398D9C902A5` |
| `snapshots/current-build-report.json` | `A0645CEAD653C025FCF708635265F2C42806A394CE2C8D9031F7B7DD3BBFAC09` |
| `snapshots/current-manifest.json` | `27ACF5717DD9B3CE70B68486DF197A96E095A43C3DCB09DD91653B2D510509AD` |
| `snapshots/current-layout.json` | `7669DA88FEF1FB060C47B4408F0334A539FFA8684253EFB43DE53752371462A3` |
| `recorded-probe-result.json` | `BF21D74C1870053401A73315C53CDCA87FB0B763A7DA8893CA9F5823E8AEBE88` |
| `test-runs/interior-asm-qMwFKT/result.json` | `DD44D27231A6B16D56F698A6EC6E67953BF5108A07D22B4BA3711F0468F0A2DB` |

`final-proof.json` contains every changed implementation/documentation file's exact path, byte count, and SHA-256.
It also binds all six probe/capture/snapshot generators, seventeen command captures, eleven report snapshots, and selected original/generated/linked probe artifacts.
Each snapshot was copied create-only and compared with its live source identity.
The baseline-state and complete ELF-report identities are included in that same manifest.
The final closure rehashes these inputs and artifacts, then records the completed deliverables and exact parent-log identity.

| Final capture log | Exit | SHA-256 |
| --- | ---: | --- |
| `audit-final.log` | 0 | `D5714C4C61D7BB4618853D58A47D24DBAB2F6D58D3E87D464F7A3B14603F9EC1` |
| `routine-final.log` | 0 | `D9C9A63ECA4E19154B4054561C775199B0792DF4AA0506A71E7F0ACC43366857` |
| `phase8-final.log` | 0 | `DFE2C25368E106E88A59DA28BA1347E288C125C01416F0448B1CDCCBA9241BA9` |
| `b06c-generated.log` | 0 | `86A3ED7CC4AAD0E9FB014A0977B697E99D75BE070A89384929E1BA5C1C943877` |
| `focused-cache.log` | 0 | `EC2A703D1BD077E948304E9C9A9E72AB5DC335FC98B310BBF407D14F7E1CD26A` |
| `focused-repeated.log` | 0 | `937AF19001C7897F9D7BBCB223AE1769CF061C7553CF272CF4B72990896B5A6A` |
| `padding-final.log` | 0 | `D988A84FC2B871712854EE077E703D03C58CB33D9E48982EF2B1B2A43B29B14B` |
| `interior-fourth.log` | 0 | `E799D2D4DEE194F7A8556E6BEE6207827B38B88A067DFE593CEF0B273FFDCD02` |
| `real-c-second.log` | 0 | `4B1A706CB7C8007EE94B7442D352ADD4436973B13753EA5EF3E4DD56C699C543` |
| `recorded-probe-first.log` | 0 | `CD7B4D213CD935E3F606BCD586E9CBCF47D12E1C872AF689AA2F3E4EBAC47732` |
| `interior-first.log` — preserved failure | 1 | `11910B00205C9E4516455A9B1EDBB20D2FA56ADF32C1865F675C92678F6E2196` |
| `interior-third.log` — preserved failure | 1 | `D462C541642437A18F0BF899BBED337E9C72D5076EAB4C7643BFB3D95A53677E` |

Final CURRENT fingerprint: `C9CAD79080A3D3AF8EEEC2F3564BC7E82AAEAFA772660DA03F4F7A9F05196EC1`.
Final CURRENT output: `C:/Users/Joe/.codex/ob64-high-attack-wave-5/work/current/c9cad79080a3d3af8eeec2f3/build`.
The audit completed at `2026-09-06T12:24:00.599Z`, with exact baseline/CURRENT ROMs and independently fresh source-object evidence.
The generated snapshots own classification, relocation, and target counts; no new matching-progress ledger is introduced.
All protected source/configuration inputs remain unchanged, including all fourteen active Wave 6 sources and the four original inactive drafts.
The final closure records the fourteen source identities and their actual final PURE_C classifications.

All implementation and report files remain uncommitted.
No ordinary source activation, integration, task/subagent creation, runtime operation, or publication is included.
Independent review remains required after Director freezing.
