# Lane B batch 01 promotion readelf filename correction evidence index

Status: completed and pending Director freeze. The Phase 8 artifact basename is now `phase8.readelf.txt`, with every other predecessor byte preserved. This matters because the accepted promotion evidence now names the verified artifact exactly. No action is required from Joe; the Director must freeze the correction before acceptance propagation.

## Assignment and scope

| Item | Recorded value |
|---|---|
| Correction task | `OB64-MC-B-B01-PROMOTION-READELFFIX-20260803-R1` |
| Canonical path | `C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp` |
| Required branch and HEAD | `main` at `f739fe237ad904fee204b2e4a32f4f965b7bfb7c` |
| Frozen Lane B input | `fe38378f89c57e78b7df3b8ba0a89fa2fe7e613c` |
| Predecessor evidence index | `../evidence-index.md` |
| Predecessor SHA-256 | `E7402D8DC19C598E62922599765B35B6350B20435BB3D874D933B9353AAB9B5B` |
| Corrected SHA-256 | `25BB0DFBA6BE06505EBF6D189DD2A0C8EDCCAAA1423260B4EB8E160FAC8AACAD` |
| Correction scope | One Phase 8 artifact basename plus three correction records |
| Technical build status | Accepted and preserved; no build rerun |
| Correction review status | `pending` |

## Direct observations

The parent branch was `main` at `3ca6d7eab96407d42ac553665653632fa057e5c5`.

The required parent ancestor `31932c39c9b5b2de05a8593703855314d1fa2d65` was present.

The parent repository had unrelated existing changes and remained read-only.

During correction, unrelated parent work advanced HEAD to `73d1ae7b546ba9b5cda6ddd36144c552a1ecea98`.

The required parent ancestor remained present, so this unrelated commit did not trigger a stop.

The canonical branch was clean on `main` at `f739fe237ad904fee204b2e4a32f4f965b7bfb7c`.

The frozen Lane B input commit object `fe38378f89c57e78b7df3b8ba0a89fa2fe7e613c` was present.

The predecessor evidence index matched its required SHA-256 before editing.

The corrected Phase 8 artifact cell occurs exactly once.

The corrected evidence index uses UTF-8 without a byte-order mark and retains LF line endings.

The corrected evidence index is seven bytes longer because `phase8.` was added.

The artifact size remains `4,622,874` bytes.

The artifact SHA-256 remains `B4A5D81B7139EDF906622121DC92062B1832F356C63B36F4F8B3BF782B1986FB`.

The correction remains uncommitted and unstaged.

## Identity ledger

| Artifact | Before correction | After correction | Result |
|---|---|---|---|
| Frozen promotion evidence index | `E7402D8DC19C598E62922599765B35B6350B20435BB3D874D933B9353AAB9B5B` | `25BB0DFBA6BE06505EBF6D189DD2A0C8EDCCAAA1423260B4EB8E160FAC8AACAD` | Intended basename-only change |
| Phase 8 readelf artifact basename | `readelf.txt` | `phase8.readelf.txt` | Corrected |
| Phase 8 readelf artifact size | `4,622,874` | `4,622,874` | Preserved |
| Phase 8 readelf artifact SHA-256 | `B4A5D81B7139EDF906622121DC92062B1832F356C63B36F4F8B3BF782B1986FB` | `B4A5D81B7139EDF906622121DC92062B1832F356C63B36F4F8B3BF782B1986FB` | Preserved |

## Predecessor reconstruction proof

The corrected evidence index was read as strict UTF-8 bytes without a byte-order mark.

The byte stream round-tripped through strict UTF-8 without change.

The corrected artifact cell had exactly one ordinal occurrence.

The reconstruction restored `readelf.txt` in that cell only.

The reconstructed byte stream was 14,356 bytes.

The reconstructed byte stream hashed to `E7402D8DC19C598E62922599765B35B6350B20435BB3D874D933B9353AAB9B5B`.

This exact match proves that every byte outside the assigned basename remained unchanged.

The corrected evidence index is 14,363 bytes.

The corrected evidence index hashes to `25BB0DFBA6BE06505EBF6D189DD2A0C8EDCCAAA1423260B4EB8E160FAC8AACAD`.

## Exact verification commands

All commands ran from `C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp` unless stated otherwise.

```powershell
git branch --show-current
git rev-parse HEAD
git status --short --untracked-files=all
git diff --cached --name-only
Get-FileHash -Algorithm SHA256 -LiteralPath docs\matching-c\lane-b-b01-promotion-20260803\evidence-index.md
rg -n --fixed-strings 'phase8.readelf.txt' docs\matching-c\lane-b-b01-promotion-20260803\evidence-index.md
git diff --numstat -- docs\matching-c\lane-b-b01-promotion-20260803\evidence-index.md
git diff -- docs\matching-c\lane-b-b01-promotion-20260803\evidence-index.md
git diff --check -- docs\matching-c\lane-b-b01-promotion-20260803\evidence-index.md docs\matching-c\lane-b-b01-promotion-20260803\readelf-filename-correction-20260803\task-log.md docs\matching-c\lane-b-b01-promotion-20260803\readelf-filename-correction-20260803\evidence-index.md docs\matching-c\lane-b-b01-promotion-20260803\readelf-filename-correction-20260803\aar\20260803-ob64-matching-c-lane-b-b01-promotion-readelf-filename-correction-aar.md
rg -n "[ \t]+$" docs\matching-c\lane-b-b01-promotion-20260803\evidence-index.md docs\matching-c\lane-b-b01-promotion-20260803\readelf-filename-correction-20260803\task-log.md docs\matching-c\lane-b-b01-promotion-20260803\readelf-filename-correction-20260803\evidence-index.md docs\matching-c\lane-b-b01-promotion-20260803\readelf-filename-correction-20260803\aar\20260803-ob64-matching-c-lane-b-b01-promotion-readelf-filename-correction-aar.md
```

The reconstruction check used these exact cell values:

```powershell
$expected = 'E7402D8DC19C598E62922599765B35B6350B20435BB3D874D933B9353AAB9B5B'
$utf8 = [System.Text.UTF8Encoding]::new($false, $true)
$bytes = [System.IO.File]::ReadAllBytes((Resolve-Path $path))
$text = $utf8.GetString($bytes)
$new = '| `phase8.readelf.txt` |'
$old = '| `readelf.txt` |'
$reconstructed = $utf8.GetBytes($text.Replace($new, $old))
```

The strict UTF-8 round trip passed.

The corrected cell count was one.

The reconstructed hash matched the required predecessor hash.

The tracked diff reported one added line and one removed line.

The tracked diff displayed only the assigned basename replacement.

The four-path whitespace and staged-path checks passed.

The final inventory contained only the corrected predecessor and three assigned records.

## Failed verification method

The first final command used `String.Split` to count the exact corrected row.

PowerShell treated the supplied row as individual split characters instead of one literal substring.

The assertion stopped with a false failure before the command completed.

The command was read-only and changed no file.

The corrected command used `[regex]::Escape` and counted one complete corrected row.

The corrected command counted zero stale predecessor rows and passed every remaining gate.

## Evidence interpretation

The basename-only claim is `Verified` because the predecessor reconstructs byte-for-byte.

The adjacent-cell preservation claim is `Verified` by reconstruction and the one-line tracked diff.

The correction claims have `review: pending` because the worker cannot accept its own result.

The technical promotion remains accepted from its frozen predecessor.

No technical build, gameplay-semantic, runtime, or new acceptance claim was added.

## Records

- [Correction task log](task-log.md)
- [Correction AAR](aar/20260803-ob64-matching-c-lane-b-b01-promotion-readelf-filename-correction-aar.md)
- [Corrected promotion evidence index](../evidence-index.md)
- [Frozen promotion AAR](../aar/20260803-ob64-matching-c-lane-b-b01-promotion-aar.md)
