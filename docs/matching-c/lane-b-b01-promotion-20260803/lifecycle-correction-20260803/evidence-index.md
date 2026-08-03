# Lane B batch 01 promotion lifecycle correction evidence index

Status: completed and review-pending. This index proves the bounded lifecycle correction and preserves every protected promotion identity. This matters because the predecessor can now enter fresh Critical review without lifecycle ambiguity. No action is required from Joe; the Director must freeze the result and route that review.

## Assignment and scope

| Item | Recorded value |
|---|---|
| Correction task | `OB64-MC-B-B01-PROMOTION-LOGFIX-20260803-R1` |
| Canonical path | `C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp` |
| Required branch and HEAD | `main` at `715c3412c74c17caa9121e52fd888048a979fc47` |
| Frozen Lane B input | `fe38378f89c57e78b7df3b8ba0a89fa2fe7e613c` |
| Predecessor task log | `../task-log.md` |
| Predecessor task-log SHA-256 | `C60B7BCDF4314D867AF6F15272DE8E73941121D19662E95C85EA52B3F153FF54` before correction |
| Corrected task-log SHA-256 | `58DAD02B6D3F4FAB98519CE750EE6E6BC5CEB915CC14EDB793DF94257A050BF9` |
| Correction scope | One opening lifecycle paragraph plus three correction records |
| Technical build status | Preserved; no build rerun |
| Review status | `pending` |

## Direct observations

The parent branch was `main` at `bf83176674ad14ae9c4005b286eef99c073106fb`.

The required parent ancestor `e34e5d623f896a481cbe605baa4b32e8a5008562` was present.

The canonical branch was `main` at `715c3412c74c17caa9121e52fd888048a979fc47`.

The frozen Lane B input commit object `fe38378f89c57e78b7df3b8ba0a89fa2fe7e613c` was present.

The predecessor task log matched its required SHA-256 before editing.

The corrected paragraph occurs once, and the stale paragraph occurs zero times.

The corrected paragraph states completed and review-pending status.

It states that the four-owner promotion and both fresh combined roots passed.

It directs the Director to freeze the result and route fresh Critical review.

All seven protected promotion identities retained their required SHA-256 values.

The correction remains uncommitted and unstaged.

## Identity ledger

| Artifact | SHA-256 after correction | Required result |
|---|---|---|
| `config/phase8/matching-c.json` | `4BA9398C154B4C14097F9500DF45EE9EE15EB0B588CE138A50D5F186DA50887F` | match |
| `src/boot/boot_state_slot_payload_copy_free.c` | `9E47572E2E913AAA26245ED005CFF261B0C408798D5896F87DD0A5AE3D354CB8` | match |
| `src/lib/osCreateMesgQueue.c` | `9B60B141932209B60BD3B5218044A79550C91F99B8106A05E918408EBF03B34F` | match |
| `src/lib/hypotf.c` | `EAE34C8B3C30DA41BDC98C7BABC83F9ACDE73EB2AECAABAE0E16FEA9B67059AB` | match |
| `src/lib/func_0025CAF0.c` | `5EB40F5A9509ADF0742D7528D95353EDBD48B55CF05D0354184CA421A0118DD1` | match |
| predecessor `evidence-index.md` | `E7402D8DC19C598E62922599765B35B6350B20435BB3D874D933B9353AAB9B5B` | match |
| predecessor promotion AAR | `257BADCC2A0CBEC2D092539B296F0412C555097882C9215EDF2525303862C4DF` | match |

## Predecessor reconstruction proof

The corrected task log was read as UTF-8 bytes without a byte-order mark.

The corrected paragraph had exactly one byte-preserving UTF-8 occurrence.

The exact predecessor paragraph replaced that occurrence in memory.

The reconstructed byte stream hashed to `C60B7BCDF4314D867AF6F15272DE8E73941121D19662E95C85EA52B3F153FF54`.

This exact match proves that every byte outside the assigned paragraph remained unchanged.

The corrected task log hashes to `58DAD02B6D3F4FAB98519CE750EE6E6BC5CEB915CC14EDB793DF94257A050BF9`.

## Exact verification commands

All commands ran from `C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp` unless stated otherwise.

```powershell
git branch --show-current
git rev-parse HEAD
git status --short --untracked-files=all
git diff --cached --name-only
Get-FileHash -Algorithm SHA256 -LiteralPath config\phase8\matching-c.json,src\boot\boot_state_slot_payload_copy_free.c,src\lib\osCreateMesgQueue.c,src\lib\hypotf.c,src\lib\func_0025CAF0.c,docs\matching-c\lane-b-b01-promotion-20260803\evidence-index.md,docs\matching-c\lane-b-b01-promotion-20260803\aar\20260803-ob64-matching-c-lane-b-b01-promotion-aar.md
Get-FileHash -Algorithm SHA256 -LiteralPath docs\matching-c\lane-b-b01-promotion-20260803\task-log.md
rg -n "^Status is active\.|^Status is completed and review-pending\.|four-owner promotion|both fresh combined roots|Director must freeze" docs\matching-c\lane-b-b01-promotion-20260803\task-log.md
rg -n "[ \t]+$" docs\matching-c\lane-b-b01-promotion-20260803\task-log.md docs\matching-c\lane-b-b01-promotion-20260803\lifecycle-correction-20260803
```

The reconstruction check used these exact paragraph values:

```powershell
$old = 'Status is active. The canonical repository and frozen Lane B input match their required commits, so promotion can proceed. No action is required from Joe during this worker run.'
$new = 'Status is completed and review-pending. The four-owner promotion and both fresh combined roots passed. This correction makes the finished result coherent for fresh Critical review. No action is required from Joe; the Director must freeze the result and route that review.'
$utf8 = [System.Text.UTF8Encoding]::new($false)
$bytes = [System.IO.File]::ReadAllBytes('docs\matching-c\lane-b-b01-promotion-20260803\task-log.md')
$text = $utf8.GetString($bytes)
$reconstructedBytes = $utf8.GetBytes($text.Replace($new, $old))
```

The branch and HEAD matched the assigned canonical baseline.

The status inventory contained only the frozen promotion result and this correction package.

The staged-path command returned no paths.

The identity commands returned every required SHA-256 value.

The paragraph search returned the corrected opening at line 3 and the preserved final status at line 106.

The search returned no stale opening paragraph.

The whitespace search returned no matches.

## Failed verification method

The first in-memory check used invalid PowerShell generic method syntax for `SequenceEqual[byte]`.

PowerShell stopped at parse time, so that command read or changed no files.

The corrected check compared Base64 encodings for the UTF-8 round trip.

The corrected check passed and produced the exact predecessor hash.

## Evidence interpretation

The paragraph-scope claim is `Verified` because the predecessor reconstructs byte-for-byte.

The protected identity claim is `Verified` because every required post-correction SHA-256 matched.

The technical promotion result remains review-pending from the predecessor evidence package.

No technical build, gameplay-semantic, runtime, or acceptance claim was added.

## Records

- [Correction task log](task-log.md)
- [Correction AAR](aar/20260803-ob64-matching-c-lane-b-b01-promotion-lifecycle-correction-aar.md)
- [Predecessor task log](../task-log.md)
- [Predecessor evidence index](../evidence-index.md)
- [Predecessor AAR](../aar/20260803-ob64-matching-c-lane-b-b01-promotion-aar.md)
