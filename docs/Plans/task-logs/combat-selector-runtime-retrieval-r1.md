# Combat selector runtime retrieval r1

Status: completed; review pending.

This task retrieved existing Total Resolver knowledge for `func_00201778` and accepted RAM entry `0x801BE2E8`.
It separates current execution evidence from placement and returns literal records for Astra Medium interpretation.
It makes no dead-code, family-membership, game-meaning, or missing-evidence-cause conclusion.

## Baseline and scope

- Assignment: `combat-selector-runtime-retrieval`, revision 1.
- Launch ID: `COMBAT-SELECTOR-RUNTIME-RETRIEVAL-20260906-01`.
- Receiving task: `/root/combat_data_retrieval` on host `local`.
- Director task: `01a07262-aeca-7341-ad10-2dba705ff988`.
- Canonical branch and activation HEAD: `main` at `31560c422a1e656e70d713e86ffcfb8e9b204eb7`.
- Parent branch and activation HEAD: `main` at `e445991cc357a56e9d8f3d3866c247d6f52e1634`.
- Inventory profile: `NORMAL`.
- The assigned claim, report, and output root were absent before activation.

Production, shared tools, configuration, knowledge databases, session databases, and earlier research remained read-only.
Concurrent tooling and r2 research work stayed outside this task's assigned surfaces.
This task wrote only its fresh claim, this report, and ignored `build/combat-selector-runtime-retrieval-r1/` artifacts.

No database selection, initialization, repair, ingestion, capture, emulator operation, GUI use, or memory write occurred.
No agents, builds, branches, worktrees, staging, commits, or push occurred.

## Selected knowledge identity

`knowledge status` selected this database:

| Field | Literal value |
|---|---|
| path | `build/total-resolver/knowledge/total-resolver-v5-factorized-dma-protocol017-r3.sqlite` |
| byte length | 1,541,058,560 |
| SHA-256 | `B5CFB5DF59D837FDBEEC620E289AC8378823844EE15B910B829E7ECF1F44E005` |
| database ID | `023E881A-314D-4398-9E22-1E05952A3537` |
| schema | `ob64-total-resolver-knowledge.v5`, version 5 |
| active bridge protocol | `0.17.0` |
| ledger ordinal | 17 |
| frontier | `K3:023E881A-314D-4398-9E22-1E05952A3537:17:243:296918:321133:11341:90298` |
| normalized ROM SHA-256 | `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A` |
| evidence state | `live-unreviewed` |
| capture authority | `observation-only` |

Every saved query reports this database ID, frontier, ledger, and evidence state.
Every query also reports `historicalDynamicProductsUsed: false`.
The frozen accepted inputs are the static DB, resource-chain atlas, and structure-field atlas.

## Required verification

`python -m tools.total_resolver knowledge verify` returned `PASS`.
All 26 checks passed.
They include SQLite health, foreign keys, exact opcodes, mappings, exact call relationships, frontier checks, and materialized-view comparisons.

The verifier found 11,341 exact call relationships with zero identity, count, or context-range errors.
It found 243,405 mapped rows with zero opcode or function-range mismatches.
It found 33,864 exact overlay-atlas rows and 4,870 exact runtime-provenance and Total Resolver rows.
Each materialized checkpoint matched ledger 17.

The verifier also recorded zero context-free live mappings and zero candidate exact-byte mismatches.
The full result is `build/combat-selector-runtime-retrieval-r1/knowledge-verify.json`.

## Target result

`explain func_00201778` resolved one accepted static identity:

- function ID 3197;
- static name `func_00201778`;
- z64 range `0x00201778..0x00201798`;
- high static confidence; and
- evidence lane `static`.

The current dynamic summary is exactly:

| Field | Count or value |
|---|---:|
| coverage class | `placed-not-executed` |
| placement facts | 2 |
| instruction facts | 0 |
| execution sessions | 0 |
| exact edges | 0 |
| incoming edges | 0 |
| outgoing edges | 0 |

The detailed static call graph has zero callers and zero callees.
The detailed runtime call graph also has zero callers, callees, call records, callsite facts, and frame-sequence witnesses.
All call omitted-row counts are zero at the query's limit of 100.

The execution query returned empty instruction and session arrays.
The detailed focused query returned zero focused execution witnesses.
No known-activity session membership was returned for the target.

Therefore the current package contains no target caller PC, RA, call target, target origin, argument pair, frame, or event-time context.
This sentence describes absent records in the selected database and does not claim the function never executed.

## Placement facts kept separate

The same current knowledge database contains two placement facts for the target range.
Both map z64 `0x00201778..0x00201798` to physical RDRAM `0x001BE2E8..0x001BE308`.
Their corresponding KSEG0 range is `0x801BE2E8..0x801BE308`.

| Placement ID | Mapping method | Observation count | Session count |
|---:|---|---:|---:|
| 1057 | `direct-contiguous-rom-dma-slab-equality` | 17 | 1 |
| 7834 | `atomic-baseline-rdram-exact-function-bytes` | 2 | 2 |

The query marks each row with `Placement or residence is not execution.`
The session counts cannot be summed because the returned rows do not establish whether their session memberships overlap.
The documented query did not expose placement-session IDs or semantic session context.

These two current knowledge facts are distinct from the earlier accepted offline atlas's 244 saved placements.
Neither set establishes an execution or caller provenance record.

## Exact address queries

The documented live search normalized `0x801BE2E8` to physical `0x001BE2E8`.
It returned zero instructions, edges, sessions, sampled PCs, focused witnesses, raw events, markers, controller transitions, or unresolved rows.
It returned no mapping diagnostics or known-activity record.

The physical-plus-opcode query tested `0x001BE2E8` with `0x3C03801D`, the accessor's first known word.
It returned the same zero counts.
The ROM-offset search for `0x00201778` also returned zero dynamic records.

The function search returned only the one accepted static function identity above.
Its dynamic record counts were otherwise zero.

`explain 0x801BE2E8` was unsupported because the command parsed this value as a function partial name.
That result is a query-form limitation and is not negative evidence.
The documented `search --live` and `search --physical` forms supplied the address-specific results.

## Coverage and negative boundary

The selected frontier contains 17 accepted captured sessions and seven known-activity sessions.
It contains 296,918 instruction facts, 321,133 edge facts, 11,341 exact call relationships, and 8,558 function placements.
Its 4,870 functions have these current coverage classes:

| Coverage class | Functions |
|---|---:|
| placed and executed | 2,370 |
| placed, not executed | 2,268 |
| executed, unplaced | 4 |
| never observed | 228 |

Coverage describes only the 17 accepted captured sessions at frontier ledger 17.
Unplayed paths remain outside this result.
Historical novelty filtering can suppress later repeated event streams.
Known-activity bitmaps restore exact session membership for known facts without supplying event time, order, or occurrence count.

For this target, the database contains no instruction fact to match against those bitmaps.
No inference about uncaptured execution, indirect reachability, dead code, family membership, or game meaning follows.

## Evidence grades and review state

Claim: the selected database, frontier, verification result, query parameters, and returned counts are reproduced exactly.
Evidence grade: **Verified static retrieval**.
Review status: **pending**.
Supporting artifact: `build/combat-selector-runtime-retrieval-r1/retrieval.json`.

Claim: current knowledge has two placement facts and zero target execution, caller, argument, or session-context records.
Evidence grade: **corpus-bounded live-unreviewed record**.
Review status: **pending**.
Scope: database ID `023E881A-314D-4398-9E22-1E05952A3537`, ledger 17, and its 17 accepted sessions only.

The static function identity comes from the accepted frozen static source.
The current placement and dynamic rows retain the `live-unreviewed` state.
No record is promoted to accepted structure, semantics, or Editor-ready evidence here.

## Evidence index

| Artifact | Purpose | SHA-256 |
|---|---|---|
| `knowledge-status.json` | selected database and frontier | `B383AB6FC89BCBE97577EF0F75BCE71FC54A9D18F98662D8CDD0A573E7B75300` |
| `knowledge-verify.json` | required 26-check verifier result | `D34306AE5C9A46B6AD1EA187E387789BD8A95277152E10711EF52A53CF4EFE79` |
| `coverage.json` | selected frontier coverage and boundary | `5BDA2B5D147A8C016EBA0A1CEAE9478F6CBFA46F9A1D666DABE57A0FA66CF180` |
| `explain-function-all.json` | complete static/runtime call query | `A01116C6E2D2BAAB54A79956FF493A0CA9288DD42B65AFB9E46A05771F5A1A13` |
| `explain-function-executions.json` | execution-specific query | `770433F22B7B3334E07EC631C90F46AA6838E7B1B97566C7329574124AD35965` |
| `explain-function-placements.json` | complete two-row placement query | `A3AFBE6322D191EDF10892DEE59C28408A5837D8693BE6EA6F2918CF9A1D6341` |
| `explain-function-focused.json` | focused arguments and session context | `B6C453FC4F03DFC73DF06F6EF9CD0292A66E2713DE7615E84332C8457C412B6C` |
| `explain-live-entry.json` | unsupported bare-address query record | `A6FDF6146C8E79941219E6FCC8753EF8E3A59EE5AAC1E4B12DAB5F3EF0181167` |
| `search-live-entry.json` | exact live/physical entry search | `9BBAADDB3B4DC2D6283C0B3B63B3BF744F435B0CE5362F4B1704FBE0E10737D4` |
| `search-physical-entry-opcode.json` | exact physical address and opcode search | `B1881F428FB554800512AC5E6C9AF640F36C36C0C9C14B2563512909E8F3C37F` |
| `search-function.json` | exact function-name search | `1F216530F74E800B2F754307FE3FFD2CEC84CE81B522EA1E330B6835A52F24FB` |
| `search-rom-entry.json` | exact z64-entry search | `24A3B86685431AD10F67E82A0C1CE79C30DA4CD827B125D6147E4049E0209A38` |
| `summarize.py` | ignored bounded validation/parser | `FCFD70DA8DF59732AE9B810F8312DD135DE0F1B3A3EA0233A38F1F2DD034F1E6` |
| `retrieval.json` | validated literal handoff package | `59C104ECCE02494E1F0F47DE15394269F688B361F9AC2705B5AFC41CA9408C13` |

The machine package embeds every raw-query file size and SHA-256.
It also records the exact commands, evidence boundaries, failed paths, and logical verification row counts.

## Failed paths and protocol deviations

Five initial target commands used `--limit 10000` and were rejected before query execution.
The supported limit is 1 through 100.
Each command was rerun with 100.
The target counts, empty arrays, omitted-row counts, and two placement rows fit within that bound.

The unsupported bare-address explanation is recorded above and in the package.
These failures concern command forms and do not provide game evidence.
No process was terminated.

There were no protocol deviations.
The claim was created atomically before the report or ignored outputs.
Required status and verification checks preceded dependent evidence queries.

## Proposed canonical follow-up

The Astra Medium researcher should interpret this current-knowledge miss together with the earlier decoded-data and saved-placement results.
This retrieval alone does not close the selector gate.
Any new capture remains a separately authorized runtime task and is outside this assignment.

No canonical documentation change is proposed by this retrieval-only worker.
