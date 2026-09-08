# W8 reuse pilot R1 independent review

## Verdict

**Accepted** at commit `07905252d847aa8fc262d99d61400af54a87d596`.

The commit adds an import-only research-observation path to the existing candidate store, bounded effect retrieval, neutral preservation, five exact W8 source states with curated metadata/dossiers, and tracked-only replay instructions. It adds no database/schema migration, compiler instrumentation, production source, configuration, ownership, linkage, or matching-gate change.

No required fix remains.

## Review findings and corrections

Review found that early preservation code did not bind stored preprocessor provenance to the freshly resolved/default, origin-context, and archived-source classifications. Its Windows ancestor walk could also fail to terminate for a differently cased repository path. These were corrected with exact preprocessor cross-bindings and a root-terminating, case-safe path walk.

Follow-up falsifiers closed four metadata and capability gaps: preservation now rechecks current grouped-target exclusion; imports reject self-parent/self-related candidate edges; dossier text rejects NUL; and preservation requires the stored variant to equal the curated observation label. The preprocessor-drift test retains a matching label so it isolates that failure. An ignored replay script initially asserted the wrong schema-3 field after its first successful compilation; the corrected replay authenticated that cache and freshly compiled the other four archives.

The final focused suite contains 22 checks covering these cases alongside exact identities, wrong source/header/reference hashes, missing/foreign/distinct relations, bounded effect queries, idempotent import, safe snapshots, exact export, no overwrite, Windows path case, zero compile rows, and intercepted KMC codegen. The complete existing matching-workbench suite also passed.

## Independent checks

- `git diff 07905252^ 07905252 --check` and syntax checks for the new helper, CLI, and focused test passed. The commit contains exactly 23 expected files.
- The commit leaves `tools/matching_workbench/schema.sql`, configuration, `src/`, source policy, and the accepted probe unchanged. The accepted probe remains SHA-256 `E21027895EC88E8904685F8BDE3B1D2FEA7B48DC041C6E97C24300B7C0B3285D`.
- `node build/w8-reuse-pilot-review-r1/check.js` independently reclassified all five tracked archives. Every source hash, expanded-input hash/size, four-header dependency record, preprocessor identity, report reference, candidate ID, relation, dossier link, and neutral boundary agreed. All five retained schema-3 probe reports authenticated with 13 nonempty dumps and the recorded expanded hash. The D037 control archive is byte-identical to current `src/lib/func_001F3C00.c`.
- `node build/w8-reuse-pilot-review-r1/negative.js` used an isolated store and independently passed repeated-import idempotence, tagged retrieval, zero compile rows, and rejection of self lineage, NUL metadata, recomputed variant/label mismatch, stale preprocessor provenance, and preserve-after-grouping.
- Source-pair diffs support the authored change claims. R7 integer/local moves only three outer completion locals and their final store into the two branches; R7 short/shared changes only `endField` from `int` to `unsigned short`; D037/local only localizes those completion declarations/stores. The frozen allocation and extent claims match the referenced R7/R8 reports and remain explicitly input-specific.

## Final identities

| Input | Identity |
|---|---|
| `tools/lib/matching/research.js` | `BE22CB63FF4F9D135D7CC6CDD589A1097442A027951AE29FA76CB4CD5FE391F5` |
| `tools/match.js` | `C11960A5472B7D0500B1483DC8ECB99FC9F2E4B0CDAC88AB9775258F7C8E26D9` |
| `tools/matching_workbench/store.py` | `CA53D8DF8AD80F4F84BB4A9265077C325508D2DCBFD5B178DDA6371303337078` |
| `tests/matching_research.js` | `8C20DC925DAB8B3F5F7004B57384CE10239017CF89FE4825AF50B5F78C038938` |
| `tests/matching_workbench.js` | `84819E7E0A822C0AC9DF3B11E0CC4B34EA105AE30EE6BB11DC4BBFF25BE78B6B` |
| `docs/MATCHING_WORKBENCH.md` | `5F1C044D6346E808A7C6822AA263552309B1F2181BC218FF602BDB61564450F2` |
| `docs/research/w8-pro-research/reuse-pilot.md` | `DEED066397B67B567EB5F75EC4FBFA39764DDECBCF3B719EF6275CA68220AB43` |
| `docs/Plans/task-logs/w8-reuse-pilot-r1.md` | `B9C2363EC7E5501BDD2ABDE8461144F6950ED902536437BB60F5FB59F48D22C9` |

| Preserved state | Candidate ID | Exact source SHA-256 |
|---|---|---|
| R7 integer/shared | `7E434EC440AC7F8F0BA23E03BFD7A3B5374771FBEE0857D0109CE3D25AD0215D` | `866761F1D3624BE1E30759126FC7CAD0292536829B0F81A3DC4D0C21EB45FF04` |
| R7 short/shared | `7FA66212D41385A31D5EEB18FE9C3DBEBC73037D92458C279B7E0AFFB95D3865` | `18110DDA0820A21E5F1182975EBAF929792893B8AB85FA004EDB474289D9B807` |
| R7 integer/local | `CD8CFFB3CD5811164BE045B7B09C78FC2D2BEB76B071AB0A0579B1BE623D9E93` | `4ED007DE4897C89A67C691A6D4F4C6493BA6A94C8F967FC7A7768F741A31962C` |
| D037 control | `519474319F673191AB26EE7A6C12B47195ED7D6859F26C9A5DD4C2E4461C7C23` | `D03797FD04EEE60592E0644A837E09308568D3E82448883997A10A85DA7F91F5` |
| D037 local | `5D960029406B6FA7F0A2CD3A5F98669F10E51D87193531A2DAFF6EC27B3AFD29` | `B340160E9E582F8F54C96B937DA0413C3B0117FEE35223D6DBCAD622A0F911D8` |

The commit identity binds the remaining five observation envelopes and ten source/dossier artifacts.

## Acceptance limits

Imports preprocess and write candidate/observation records; they do not create compiler runs. Preservation writes exact C, authored claims, computed provenance, and neutral dossiers without changing current source ownership. Observation IDs may change when a tracked archive is reimported because source path is part of observation provenance; candidate IDs remain stable for the same target and bytes.

The generic probe replay reproduces compiler inputs/outputs. It does not reproduce the instrumented HOME events; those claims remain frozen R7/R8 observations tied to exact inputs. Roles, effect tags, and `selectedBest` are authored research annotations. Hashes authenticate source, expansion, dependencies, preprocessing, and references, not the behavioral claims or matching acceptance.

This acceptance does not establish original-source identity, a general compiler recipe, matching C, linker ownership, relocation equality, target-byte equality, full-ROM equality, or W8 completion. No full-ROM verifier or structural audit was required because the commit changes no enumerated structural foundation.
