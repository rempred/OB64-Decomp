# Lane B batch 01 promotion readelf filename correction task log

Status: completed and pending Director freeze. The Phase 8 artifact basename is now `phase8.readelf.txt`, with every other predecessor byte preserved. This matters because the accepted promotion evidence now names the verified artifact exactly. No action is required from Joe; the Director must freeze the correction before acceptance propagation.

## Assignment identity

| Item | Recorded value |
|---|---|
| Correction task | `OB64-MC-B-B01-PROMOTION-READELFFIX-20260803-R1` |
| Role | correction-worker |
| Review level | Focused |
| Director thread | `019fc57a-ba80-7341-8b36-5e9680ebbbef` on `local` |
| Inventory profile | `NORMAL` |
| Canonical repository | `C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp` |
| Required branch | `main` |
| Required starting HEAD | `f739fe237ad904fee204b2e4a32f4f965b7bfb7c` |
| Frozen Lane B input | `fe38378f89c57e78b7df3b8ba0a89fa2fe7e613c` |
| Technical promotion state | accepted; unchanged by this correction |

## Baseline

The correction began after reading the ready assignment, parent rules, worker workflow, and nested decomp rules.

The parent repository was on `main` at `3ca6d7eab96407d42ac553665653632fa057e5c5`.

The required parent ancestor `31932c39c9b5b2de05a8593703855314d1fa2d65` was present in that history.

The parent repository had unrelated existing changes. This correction keeps every parent path read-only.

During correction, unrelated parent work advanced HEAD to `73d1ae7b546ba9b5cda6ddd36144c552a1ecea98`.

The required parent ancestor remained present, so the assignment states this change is not a stop.

The canonical repository was clean on `main` at `f739fe237ad904fee204b2e4a32f4f965b7bfb7c`.

The frozen Lane B input commit object `fe38378f89c57e78b7df3b8ba0a89fa2fe7e613c` was present.

The predecessor evidence index matched `E7402D8DC19C598E62922599765B35B6350B20435BB3D874D933B9353AAB9B5B`.

The incorrect basename `readelf.txt` occurred once in the Phase 8 artifact table.

The three assigned correction-record paths did not exist.

## Correction plan

1. Replace only `readelf.txt` with `phase8.readelf.txt` in the Phase 8 artifact table.
2. Preserve the adjacent size and SHA-256 cells.
3. Reconstruct the predecessor by restoring `readelf.txt` in memory.
4. Require the reconstructed bytes to match the predecessor SHA-256.
5. Confirm every other canonical path remains unchanged.
6. Create the correction evidence index and AAR.
7. Run four-path whitespace, inventory, and staging checks.
8. Send and confirm the exact terminal callback.

The principal failure mode is changing any predecessor byte beyond the assigned basename.

Exact predecessor reconstruction distinguishes the intended replacement from wider file drift.

## Chronological actions

| Sequence | Action | Direct observation | Result |
|---:|---|---|---|
| 1 | Read governing records | The assignment authorizes one basename replacement and three correction records. | Scope established. |
| 2 | Record repository identities | Canonical `main` and HEAD matched the frozen assignment. | Baseline passed. |
| 3 | Inspect canonical inventory | The canonical tree was clean, and no assigned correction record existed. | One-writer scope confirmed. |
| 4 | Hash the predecessor | The evidence index matched its required SHA-256. | Predecessor identity passed. |
| 5 | Create this correction task log | The running record now captures the baseline and bounded plan. | Running record created. |
| 6 | Correct the Phase 8 basename | `readelf.txt` became `phase8.readelf.txt`. | Assigned correction applied. |
| 7 | Reconstruct the predecessor | Restoring `readelf.txt` in memory produced the required predecessor SHA-256. | Exact byte scope proved. |
| 8 | Create correction records | The assigned evidence index and AAR were created. | Correction package completed. |
| 9 | Run the first final verification command | PowerShell treated the exact row string as split characters. | The read-only assertion stopped with a false failure. |
| 10 | Correct the exact-row assertion | An escaped literal regular expression counted the complete row. | Final reconstruction and inventory gates passed. |

## Correction result

The predecessor row was:

> | `readelf.txt` | 4,622,874 | `B4A5D81B7139EDF906622121DC92062B1832F356C63B36F4F8B3BF782B1986FB` |

The corrected row is:

> | `phase8.readelf.txt` | 4,622,874 | `B4A5D81B7139EDF906622121DC92062B1832F356C63B36F4F8B3BF782B1986FB` |

The adjacent size and SHA-256 cells remained unchanged.

Every other predecessor byte was preserved.

## Predecessor reconstruction

The corrected evidence index uses strict UTF-8 without a byte-order mark.

The corrected cell occurred exactly once.

Restoring the old cell in memory produced 14,356 bytes.

Those bytes hashed to `E7402D8DC19C598E62922599765B35B6350B20435BB3D874D933B9353AAB9B5B`.

The corrected evidence index is 14,363 bytes.

The corrected evidence index hashes to `25BB0DFBA6BE06505EBF6D189DD2A0C8EDCCAAA1423260B4EB8E160FAC8AACAD`.

## Verification summary

The tracked diff contains one removed row and one added row.

The tracked diff displays only the assigned basename replacement.

The final inventory contains the corrected predecessor and three assigned records.

The four-path `git diff --check` passed.

The four-path trailing-whitespace search returned no matches.

The staged-path count was zero.

No build, review, acceptance, or technical verification rerun occurred.

Exact commands and hashes are recorded in [evidence-index.md](evidence-index.md).

## Authorized scope

The correction can replace one basename in the frozen promotion evidence index.

The correction can add this task log, its evidence index, and its AAR.

The correction must preserve every other predecessor byte and canonical path.

The correction must not rerun builds, review, accept, commit, stage, or publish.

## Failed paths and limits

The first final command used `String.Split` to count an exact row.

PowerShell treated the supplied string as individual split characters.

The assertion stopped with a false failure before the command completed.

The command made no file changes.

The corrected assertion used an escaped literal regular expression and passed.

This correction does not re-prove the accepted technical promotion.

This correction does not issue an acceptance verdict.

## Protocol deviations

None.

## Terminal state

Terminal status: completed.

Blocker: none.

The accepted technical promotion remains unchanged.

No technical re-review is required because exact predecessor reconstruction passed.

The Director must freeze the unstaged and uncommitted correction.

The exact terminal packet is ready for the required callback.
