# Combat training capture retrieval r1

## Outcome and scope

Status: completed.

The newest integrated database capture did **not** record an execution hit for `func_00201778`. The literal negative is bounded to the retained evidence for ledger-19 session `20260907T015447.515844Z-2540d1ed`; it does not establish dead code or behavior.

This assignment used only supported read-only status, verification, explain, search, and coverage paths. It did not ingest, mutate a database, inspect active raw staging, or control a runtime.

## Claims and evidence grades

Claim: The currently selected knowledge database is healthy and its newest integrated capture is ledger-19 session `20260907T015447.515844Z-2540d1ed`.

- Evidence grade: `Verified` for database/session identity.
- Review status: `pending`.
- Scope and context: selected knowledge database after its frontier advanced from ledger 18 to ledger 19 during retrieval.
- Supporting artifacts: terminal `knowledge status`, terminal `knowledge verify`, explicit `session status SESSION_ID`, and session-filtered search catalog.
- Independent corroboration: status and session records agree on database ID, ledger ordinal, frontier, session ID, and ingestion result.
- Competing interpretation: the earlier ledger-18 training session was initially newest, but became an earlier snapshot after ledger 19 was integrated.
- Falsifier: a later selected-database frontier or a different ledger-19 catalog/session record.
- Known limits: this is the selected database state at the terminal verification boundary.
- Product consequence: GUI/preset planning should bind ledger 19 and the exact profile metadata below.

Claim: Ledger-19 session evidence contains no `func_00201778` entry, instruction, incoming/outgoing edge, runtime call/caller, or focused witness.

- Evidence grade: `Verified` as a window-bounded database observation.
- Review status: `pending`.
- Scope and context: session `20260907T015447.515844Z-2540d1ed`, bridge sequence `[10182,24637)`, frames `17436..21684`, retained context class `emitted-events-and-saved-samples`.
- Supporting artifacts: session-filtered `explain func_00201778`; exact physical/opcode search at `0x001BE2E8` / `0x3C03801D`; exact incoming edge-to search at `0x001BE2E8`.
- Independent corroboration: function explain, physical/opcode search, and incoming-edge search all return zero target rows.
- Competing interpretation: the profile used by this capture did not configure the selector as a focused target; historical frontier filtering also limits reconstruction of repeated known occurrences.
- Falsifier: any session-bound selector instruction, execution-session, edge, call, or focused row.
- Known limits: placement proves residence only. The negative does not apply outside this capture or establish why no target row exists.
- Product consequence: this capture does not close the selector consumer-provenance gate.

## Selected knowledge identity

- Database: `C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp\build\total-resolver\knowledge\total-resolver-v5-factorized-dma-protocol017-r3.sqlite`.
- Database ID: `023E881A-314D-4398-9E22-1E05952A3537`.
- Schema: `ob64-total-resolver-knowledge.v5`, schema version 5.
- Terminal frontier: `K3:023E881A-314D-4398-9E22-1E05952A3537:19:243:298000:322455:11488:106574`.
- Ledger/session count: `19` / `19`.
- ROM normalized SHA-256: `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
- Dynamic review state: `live-unreviewed`.
- Terminal `knowledge verify`: `PASS`.

## Newest integrated capture

| Field | Literal record |
|---|---|
| Session ID | `20260907T015447.515844Z-2540d1ed` |
| Ledger ordinal | `19` |
| Semantic name | `Battle Capture with Field Pause` |
| Notes | `Normal battle, accessed strategy menu, animation menu, paused field and unpaused several times` |
| Started | `2026-09-07T01:54:47.828Z` |
| Ended | `2026-09-07T01:59:52.243Z` |
| Semantic context saved | `2026-09-07T02:00:41.082Z` |
| Ingested | `2026-09-07T02:01:26.751Z` |
| Capture identity | `capture:20260907T015447.515844Z-2540d1ed:1A0798C3089-5F0CFFEA:10182:24637` |
| Status | closed; worker closed; ingestion `ingested`; ingestion result `PASS` |
| Continuity/loss | continuous; `0` dropped sequences; `0` bridge loss ranges |
| Capture volume | `16585` total events; `14455` machine events |
| Retained session rows | `1035` instructions; `929` edges; `65` calls; `1879` function placements; `1129` sampled PCs |
| Focused data | `2372` execution witnesses; `16` pointer snapshots; one profile |
| Staging directory | `build/total-resolver/sessions/20260907T015447.515844Z-2540d1ed` |
| Completeness label | `emitted-events-and-saved-samples` |

The catalog limitation is literal: historical known execution suppressed by the persistent frontier cannot be recreated; only emitted events and saved samples are retained. Exact full-ROM static-data DMA lifetimes are compacted into resource/destination summaries, while exact pairing/order remains in immutable staging.

## Focused profile and target rows

The session's recorded focused profile is `cutscene-studio-v1`. Current supported profile metadata declares these 11 targets; the session-filtered query counts sum to the session total of `2372` focused witnesses.

| Target ID | z64 start | Session witnesses |
|---|---:|---:|
| `environment-loader-a` | `0x00067320` | 0 |
| `environment-loader-b` | `0x00067B48` | 2 |
| `huff-entry` | `0x00069328` | 2 |
| `huff-completion` | `0x0006947C` | 2 |
| `stage-builder` | `0x001FB32C` | 2 |
| `director-parser` | `0x00284288` | 0 |
| `body-pose-resolver` | `0x00207658` | 4 |
| `alternate-pose-decoder` | `0x00204F34` | 2360 |
| `actor-pose-updater` | `0x0029E218` | 0 |
| `actor-pose-initializer` | `0x002A9364` | 0 |
| `sprite-matrix-builder` | `0x002A9AD0` | 0 |

`func_00201778` is absent from that configured target list.

## Selector identity and literal result

- Static function ID: `3197`.
- z64 range: `0x00201778..0x00201798`.
- physical RDRAM range: `0x001BE2E8..0x001BE308`.
- live KSEG0 range: `0x801BE2E8..0x801BE308`.
- Entry opcode: `0x3C03801D`.
- Exact 32-byte signature: `3C03801D8C6306880004104000441021004510210062182103E0000890620000`.
- Placement ID `1057`: `direct-contiguous-rom-dma-slab-equality`; 17 observations in one session.
- Placement ID `7834`: `atomic-baseline-rdram-exact-function-bytes`; 2 observations in two sessions.

The two placement facts are global residence evidence and are not execution rows for the newest session.

| Session-filtered selector record | Count/rows |
|---|---:|
| Coverage class | `placed-not-executed` |
| Placement facts | 2 global facts |
| Instructions | 0 / `[]` |
| Execution sessions | 0 / `[]` |
| Exact edges | 0 |
| Incoming edges | 0 |
| Outgoing edges | 0 |
| Runtime incoming calls / callsites / caller functions | 0 / 0 / 0 |
| Runtime outgoing calls | 0 |
| Focused witnesses | 0 / `[]` |
| Exact entry physical+opcode instruction rows | 0 / `[]` |
| Exact incoming edges to physical entry | 0 / `[]` |

## Earlier integrated snapshot

The first refresh found ledger 18 as current. Its newest session was `20260907T014744.554601Z-e10f0dc1`, named `Training Battle With Retreat`, started `2026-09-07T01:47:44.894Z`, ended `01:51:15.244Z`, and ingested `01:52:29.403Z`. Its selector instruction, incoming-edge, runtime-caller, and focused counts were also zero. Ledger 19 superseded it only as the newest-integrated selection; its saved query outputs remain unchanged as an earlier snapshot.

## Changed surfaces

- `docs/Plans/task-logs/combat-training-capture-retrieval-r1.claim.json`
- `docs/Plans/task-logs/combat-training-capture-retrieval-r1.md`
- `build/combat-training-capture-retrieval-r1/` (ignored query output, literal result, and manifest)

No other surface was changed.

## Failed paths and limits

Three initial detail queries used `--limit 200`; the supported maximum is 100, so each exited 2 before querying and was repeated successfully with `--limit 100`. Their diagnostic outputs are retained. One PowerShell summary command had a parse error before execution and made no write.

The selected database advanced from ledger 18 to ledger 19 during retrieval. The final evidence was refreshed, reverified, and rebound to ledger 19. The earlier checkpoint is preserved as a time-specific ledger-18 result.

No active staging was inspected. No raw staging, direct SQLite, runtime, emulator, GUI, control, start/stop/load/pause/resume, capture, ingestion, database mutation, arbitrary RAM read, production build, source edit, agent, staging, commit, push, branch, or worktree operation occurred.

The negative is bounded to the newest integrated capture's retained database evidence. It does not prove a universal lack of execution, consumer provenance, target origin, behavior, or dead code.

## Evidence index

- Literal result: `build/combat-training-capture-retrieval-r1/literal-result.json`; SHA-256 `497A024A190485995FFB57C5AFAD6DE25999D781F2A00A1CA74EC7A78D760587`.
- Artifact manifest: `build/combat-training-capture-retrieval-r1/artifact-manifest.json`; 56 hashed files; SHA-256 `7CEE8C91E7A308E285529B53407E959E20EA6EB3A405FDD6C0B9F8A319B008F3`.
- Claim: `docs/Plans/task-logs/combat-training-capture-retrieval-r1.claim.json`; SHA-256 `9EDE625CDE1D089A3EC617A69AF088602D3E0C334443FA77889503D4F875BF20`.
- Terminal identity: `knowledge-status-terminal.txt` and `knowledge-verify-terminal.txt`.
- Ledger-19 session: `session-status-ledger19.txt` and `search-ledger19-session.json`.
- Selector: `explain-target-ledger19-session.json`, `search-target-entry-exact-ledger19-session.json`, and `search-target-incoming-ledger19-session.json`.
- Profile counts: `focused-target-counts-ledger19.json` plus the 11 per-target query files.
- Earlier snapshot: ledger-18 status, explain, search, and profile-count outputs retained under the same ignored root.

## Verification summary

- Terminal `knowledge status` and `knowledge verify` both exited 0; verification result is `PASS`.
- Session status, ingestion record, and knowledge catalog agree on ledger-19 identity and timestamps.
- Session-filtered explain/search paths independently agree on zero selector instructions, calls, edges, and focused rows.
- Profile target counts sum exactly to `2372`, matching the session focused-witness total.
- The artifact manifest hashes every bounded output existing before the manifest.
- The ignored output root does not enter ordinary Git status; unrelated boot work remains preserved.

## Protocol deviations

None. The mid-task frontier advance was handled by the required refresh and did not involve this read-only worker.

## Proposed canonical-document changes

None. Any Combat GUI preset implementation belongs to a separate Astra implementation assignment.

## Next action

Director may use the literal ledger-19 metadata and negative selector result to plan a profile/preset that includes the accepted selector watch. All assignment writes are released at terminal handoff.