# Lane A batch 01 promotion lifecycle correction evidence index

Status: completed and review-pending. This index proves the bounded lifecycle correction and preserves the predecessor's technical identities. No action is required from Joe; the Director must freeze the correction before fresh Critical review.

## Assignment and scope

| Item | Recorded value |
|---|---|
| Correction task | `OB64-MC-A-B01-PROMOTION-LOGFIX-20260803-R1` |
| Canonical path | `C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp` |
| Required branch and HEAD | `main` at `c59603356f9b0e77f54ccb432a19d65cb572a279` |
| Predecessor task log | `../task-log.md` |
| Predecessor task-log SHA-256 | `E205C3915DC0B1B83F72C4CBAB3FEC639AAC5A21056560E67F851C5F2CEE19B7` before correction |
| Correction scope | One opening status paragraph plus three new correction records |
| Technical build status | Preserved; no build rerun |
| Review status | `pending` |

## Direct observations

The canonical branch was `main`.

The canonical HEAD was `c59603356f9b0e77f54ccb432a19d65cb572a279`.

The predecessor task log matched the required SHA-256 before editing.

The corrected paragraph contains `completed`, `review-pending`, and `Independent Critical review remains required`.

The adjacent Joe-action sentence remained unchanged.

The protected promotion configuration, four promoted C sources, predecessor evidence index, and predecessor AAR retained their required hashes.

The canonical correction remains uncommitted and unstaged.

## Identity ledger

| Artifact | SHA-256 after correction | Required result |
|---|---|---|
| `config/phase8/matching-c.json` | `FF8E396A08341C31D28DF12EE9DF021A2A201477D63A68CF4E25B4F4442386F3` | match |
| `src/boot/boot_resource_node_recursive_payload_clear.c` | `D264B6D51EF37D25D8CFA196E701C26CA737EE3F14B31EB12085F191F7A00820` | match |
| `src/boot/boot_resource_state_reset.c` | `33523A7202205B7AB2EDA9FF2154C4C6963BFBA405493089700D32669D6D3076` | match |
| `src/lib/func_0025C8A4.c` | `6880A637BE37232EF80FB14E1D97270333A2C889B14ADE7E533AB4B71268C70E` | match |
| `src/lib/rand.c` | `A6D5880B7E6DB3198A720F2EBAE50F09151B5705AFD518A62CD3FA072CED1825` | match |
| predecessor `evidence-index.md` | `0600777910013FE30408BC1BA529DF66324AE935C8003CAC10D0046FF01805BE` | match |
| predecessor promotion AAR | `9990A95187D9423987B9A61D63D7BE4209BB1149A4170E560C05666F8F3F2F8E` | match |

## Exact verification commands

All commands below ran from `C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp` unless stated otherwise.

```powershell
git branch --show-current
git rev-parse HEAD
git status --short --untracked-files=all
Get-FileHash -Algorithm SHA256 -LiteralPath docs\matching-c\lane-a-b01-promotion-20260803\task-log.md
Get-FileHash -Algorithm SHA256 -LiteralPath config\phase8\matching-c.json,src\boot\boot_resource_node_recursive_payload_clear.c,src\boot\boot_resource_state_reset.c,src\lib\func_0025C8A4.c,src\lib\rand.c,docs\matching-c\lane-a-b01-promotion-20260803\evidence-index.md,docs\matching-c\lane-a-b01-promotion-20260803\aar\20260803-ob64-matching-c-lane-a-b01-promotion-aar.md
git diff --check -- docs\matching-c\lane-a-b01-promotion-20260803\task-log.md
rg -n "active|Promotion and fresh verification remain pending|completed and review-pending|Independent Critical review remains required" docs\matching-c\lane-a-b01-promotion-20260803\task-log.md
rg -n "[ \t]+$" docs\matching-c\lane-a-b01-promotion-20260803\lifecycle-correction-20260803
```

The branch and HEAD commands matched the required baseline.

The predecessor hash matched before correction.

The protected identity commands returned the required hashes after correction.

The status command showed only the attributable promotion and correction paths in canonical `OB64 Decomp`.

The whitespace search returned no matches.

The `git diff --check` command returned exit code `0`; the untracked correction records were additionally checked by the whitespace search.

One initial whitespace command used a mistyped `202603` directory and returned path-not-found. The correct `20260803` command was rerun and returned no matches.

## Predecessor reconstruction proof

The corrected task log was read as UTF-8 bytes.

The corrected paragraph bytes were replaced in memory with the exact predecessor paragraph bytes.

The reconstructed byte stream hashed to `E205C3915DC0B1B83F72C4CBAB3FEC639AAC5A21056560E67F851C5F2CEE19B7`.

This proves that the correction changed only the named paragraph bytes.

## Evidence interpretation

The lifecycle claim is `Supported` because the exact paragraph replacement and predecessor reconstruction agree.

The protected identity claim is `Verified` because every required post-correction SHA-256 matched.

The technical promotion result remains `Verified` and review-pending from the predecessor evidence package.

The correction does not prove gameplay semantics or independently accept the promotion.

## Protocol note

One setup command briefly created an empty directory under the parent workspace.

The empty directory and its empty child were removed after explicit path and contents checks.

The parent path was absent afterward, and no parent file changed.

The correction AAR records this scope-control deviation.

## Records

- [Correction task log](task-log.md)
- [Correction AAR](aar/20260803-ob64-matching-c-lane-a-b01-promotion-lifecycle-correction-aar.md)
- [Predecessor task log](../task-log.md)
- [Predecessor evidence index](../evidence-index.md)
- [Predecessor AAR](../aar/20260803-ob64-matching-c-lane-a-b01-promotion-aar.md)
