# OB64-MC-6LW01-DF-CP001-S02 Canonical Correction Task Log

## Outcome

Status: completed. The correction removed only `func_000238b0` from the prohibited six-function promotion. All 28 retained targets remain exact. No action is required.

## Authority and scope

- Task: `OB64-MC-6LW01-PROMO-DF-CP001-S02-CORRECTION-20260805-R1`.
- Role: worker.
- Task kind: correction.
- Surface: integration-correction.
- Lane: `PROGRAM`.
- Canonical repository: `C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp`.
- Inventory profile: `NORMAL`.
- Writable surface: the canonical configuration, excluded source owner, and assigned correction records.
- Human gate: none.
- External-action gate: commits, pushes, publication, releases, pull requests, new tasks, branches, and worktrees are prohibited.

## Baseline

- Prompt status: `ready`.
- Branch: `main`.
- Starting HEAD: `3f67125b22eda07ea56f72e0961790d19e3f1689`.
- Expected starting HEAD: `3f67125b22eda07ea56f72e0961790d19e3f1689`.
- Worktree state: clean.
- One-writer ownership: this direct assignment names this worker as the canonical correction owner.
- Helper agents: none.
- Starting configuration SHA-256: `7AD3F59E5B2A9F9254B62727B14EE3189E783DA7D9FF2AB93F0813A17418D8E9`.
- Checkpoint manifest SHA-256: `68B56CB26FD679351455123A5122176FB507CDCA130B73154516F47C4B8C05DF`.
- Policy boundary SHA-256: `3EE3D82030F67184690FB00F6C17C997271FFBF620CD0BCD317E3DB5A50ED711`.
- Accepted canonical baseline: `38e9348438cc0255f9bf44a159e42ba0eb5ec056`.
- Prohibited promotion commit: `3f67125b22eda07ea56f72e0961790d19e3f1689`.
- Prohibited review commit: `6e6844a94f32bd0b657cc38b617462d7a79b0a47`.

## Plan

1. Inspect the prohibited promotion delta and current matching-C schema.
2. Reverse only the excluded function's configuration entry and source addition.
3. Prove all compiler fields and twenty-eight retained targets are unchanged.
4. Run fresh external Phase 7 and Phase 8 builds.
5. Run conventional and matching-C verification.
6. Prove the five retained targets remain exact.
7. Prove `func_000238b0` is absent from configuration and canonical source.
8. Finalize the evidence package and validate the handoff manifest.

## Strongest failure mode

The correction could alter another target or a compiler field while removing the excluded function. A stale output root could also conceal that drift.

The proof will compare normalized configuration fields and retained targets against the prohibited promotion. Fresh external outputs will then rebuild and verify all retained targets.

## Evidence log

### 2026-08-05 — baseline established

Command:

```powershell
$repo='C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp'
git -C $repo branch --show-current
git -C $repo rev-parse HEAD
git -C $repo status --short --branch
```

Result: branch `main`, exact expected HEAD, and no worktree changes.

Command:

```powershell
Get-FileHash -Algorithm SHA256 -LiteralPath 'C:\Users\Joe\Projects\OgreBattlel64-Coordination-Worktrees\highway-df\docs\Plans\ob64-matching-c-six-lane-wave-20260803\checkpoints\OB64-MC-6LW01-DF-CP001-S02-checkpoint-manifest.json'
Get-FileHash -Algorithm SHA256 -LiteralPath 'C:\Users\Joe\Projects\OgreBattlel64\docs\Plans\ob64-matching-c-six-lane-wave-20260803\checkpoint-supersessions\OB64-MC-6LW01-DF-CP001-S02-policy-supersession.json'
```

Result: both frozen artifact hashes match the assignment.

### 2026-08-05 — configuration correction

The starting configuration parsed with top-level keys `schemaVersion`, `profile`, `targets`, and `compiler`.

The accepted baseline contained 23 targets. The prohibited promotion contained 29 targets.

The six promoted targets were:

| Structural symbol | Bytes | Source |
|---|---:|---|
| `func_0002DE10` | 64 | `src/lib/mod_s64_tail.c` |
| `func_000238B0` | 88 | `src/lib/sprintf.c` |
| `func_001072B8` | 212 | `src/lib/func_001072B8.c` |
| `func_0000B030` | 128 | `src/boot/boot_resource_lzss_load_entry.c` |
| `func_0011B344` | 236 | `src/lib/func_0011B344.c` |
| `func_00007600` | 136 | `src/boot/boot_state_slot_target_peer_record_dispatch.c` |

The worker removed only the `func_000238B0` target object. The worker also removed only `src/lib/sprintf.c`.

Command:

```powershell
$path='config/phase8/matching-c.json'
$start='3f67125b22eda07ea56f72e0961790d19e3f1689'
$base='38e9348438cc0255f9bf44a159e42ba0eb5ec056'
$currentRaw=Get-Content -Raw -Encoding UTF8 -LiteralPath $path
$current=$currentRaw|ConvertFrom-Json
$startRaw=(git show "$start`:$path") -join "`n"
$startConfig=$startRaw|ConvertFrom-Json
$baseRaw=(git show "$base`:$path") -join "`n"
$baseConfig=$baseRaw|ConvertFrom-Json
$expectedRetained=@($startConfig.targets|Where-Object {$_.symbol -cne 'func_000238B0'})
Get-FileHash -Algorithm SHA256 -LiteralPath $path
$current.targets.Count
@($current.targets|Where-Object {$_.symbol -ceq 'func_000238B0'}).Count
Test-Path -LiteralPath 'src/lib/sprintf.c'
(($current.compiler|ConvertTo-Json -Depth 100 -Compress) -ceq ($startConfig.compiler|ConvertTo-Json -Depth 100 -Compress))
(($current.targets[0..22]|ConvertTo-Json -Depth 100 -Compress) -ceq ($baseConfig.targets|ConvertTo-Json -Depth 100 -Compress))
(($current.targets|ConvertTo-Json -Depth 100 -Compress) -ceq ($expectedRetained|ConvertTo-Json -Depth 100 -Compress))
```

Result:

```text
freshHash=E0D9023BFCA2CD9BE55DEAC6457561D168F1BCA9DE02702F607A4C2C1B6F70D6
hashDiffers=True
targetCount=28
excludedConfigCount=0
excludedSourceExists=False
compilerUnchanged=True
baselineTargetsUnchanged=True
allRetainedTargetsUnchanged=True
```

The retained original assembly owner remains at `asm/original/rev0/lib/sprintf.s`.

Its SHA-256 remains `D000B21EFFC5065D59AA3410BE10C362CB2950EA7679D38287FF7C8204F37F68`.

### 2026-08-05 — authenticated prerequisites

| Prerequisite | Path | Verified identity |
|---|---|---|
| Phase 5A product | `C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\lane-c\row565-phase5b-sol-correction-r1\phase5a-cumulative-successor` | Manifest `F004C4C09D611671935BD0D7927D514EAC1E05C347FBB271A523C424AFDB1D04` |
| Splat Python | `C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe` | `4CCA2027319C08DCA5CC4B64C9BA415CC89205152202CB6805081277C43B610F` |
| Splat entry point | `C:\Users\Joe\.codex\phase5b-splat-20260801-third-review-correction-r2\snapshot\split.py` | `EED41D3C36AFA4A980A3B22BC76C371569696CADFEF925DBB63606BFB081544E` |
| asm-differ | `C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ` | Commit `093360aa31f90e67216ed1971c4087516cc7b940` |
| KMC compiler | `C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-b\toolchain\kmc-gcc-2.7.2\cc1.exe` | `F3F1C99A322F5B3D8C108C2A44AF1D6D084DD27575C5D60BF0F0D33FFF34B1C6` |

The asm-differ checkout also matched all pinned file hashes.

### 2026-08-05 — setup verification

Command:

```powershell
node tools\verify_setup.js --phase5a-root 'C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\lane-c\row565-phase5b-sol-correction-r1\phase5a-cumulative-successor'
```

Result: PASS after 372.8 seconds. All 21 checks passed.

The code-region SHA-256 remained `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.

The full-ROM SHA-256 remained `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

### 2026-08-05 — fresh Splat and conventional build

Fresh external root:

`C:\Users\Joe\Projects\OgreBattlel64-External-Outputs\OB64-MC-6LW01-20260803\DF-CP001-S02\correction-r1`.

The root did not exist before this run.

Command:

```powershell
node tools\run_phase7_splat.js --output 'C:\Users\Joe\Projects\OgreBattlel64-External-Outputs\OB64-MC-6LW01-20260803\DF-CP001-S02\correction-r1\splat' --python 'C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe' --split 'C:\Users\Joe\.codex\phase5b-splat-20260801-third-review-correction-r2\snapshot\split.py' --snapshot-root 'C:\Users\Joe\.codex\phase5b-splat-20260801-third-review-correction-r2\snapshot'
```

Result: `Phase 7 Splat execution: PASS`.

Command:

```powershell
node tools\build_phase7_conventional.js --output 'C:\Users\Joe\Projects\OgreBattlel64-External-Outputs\OB64-MC-6LW01-20260803\DF-CP001-S02\correction-r1\phase7' --splat-output 'C:\Users\Joe\Projects\OgreBattlel64-External-Outputs\OB64-MC-6LW01-20260803\DF-CP001-S02\correction-r1\splat' --splat-python 'C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe' --splat-split 'C:\Users\Joe\.codex\phase5b-splat-20260801-third-review-correction-r2\snapshot\split.py' --asm-differ 'C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ'
```

Result: `Phase 7 conventional build: PASS`.

Command:

```powershell
node tools\verify_phase7_conventional.js --output 'C:\Users\Joe\Projects\OgreBattlel64-External-Outputs\OB64-MC-6LW01-20260803\DF-CP001-S02\correction-r1\phase7' --splat-python 'C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe' --splat-split 'C:\Users\Joe\.codex\phase5b-splat-20260801-third-review-correction-r2\snapshot\split.py' --asm-differ 'C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ' --report 'C:\Users\Joe\Projects\OgreBattlel64-External-Outputs\OB64-MC-6LW01-20260803\DF-CP001-S02\correction-r1\phase7\verification.json'
```

Result: `Phase 7 conventional verification: PASS`.

The Phase 7 ROM has canonical SHA-256 `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

### 2026-08-05 — fresh matching-C build

Command:

```powershell
node tools\build_phase8_matching_c.js --output 'C:\Users\Joe\Projects\OgreBattlel64-External-Outputs\OB64-MC-6LW01-20260803\DF-CP001-S02\correction-r1\phase8' --phase7-output 'C:\Users\Joe\Projects\OgreBattlel64-External-Outputs\OB64-MC-6LW01-20260803\DF-CP001-S02\correction-r1\phase7' --compiler 'C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-b\toolchain\kmc-gcc-2.7.2\cc1.exe' --splat-python 'C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe' --splat-split 'C:\Users\Joe\.codex\phase5b-splat-20260801-third-review-correction-r2\snapshot\split.py' --asm-differ 'C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ'
```

Result: `Phase 8 matching C build: PASS` with exactly 28 targets.

Command:

```powershell
node tools\verify_phase8_matching_c.js --output 'C:\Users\Joe\Projects\OgreBattlel64-External-Outputs\OB64-MC-6LW01-20260803\DF-CP001-S02\correction-r1\phase8' --compiler 'C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-b\toolchain\kmc-gcc-2.7.2\cc1.exe' --splat-python 'C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe' --splat-split 'C:\Users\Joe\.codex\phase5b-splat-20260801-third-review-correction-r2\snapshot\split.py' --asm-differ 'C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ' --report 'C:\Users\Joe\Projects\OgreBattlel64-External-Outputs\OB64-MC-6LW01-20260803\DF-CP001-S02\correction-r1\phase8\verification.json'
```

Result: `Phase 8 matching C verification: PASS`.

The Phase 8 ROM has canonical SHA-256 `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

### 2026-08-05 — five-function exact proof

| Structural symbol | Bytes | Linked text SHA-256 | asm-differ |
|---|---:|---|---|
| `func_0002DE10` | 64 | `55C72E0B914987A8E32A265336CCB667C54FCE1B1F8833ABD9A4ADCCBF651C20` | `exact=True`, score `0/1600` |
| `func_001072B8` | 212 | `01668E7CEF47586F27ED52C70957621F4CE194E6C411C3F5429D8693AE51B7BF` | `exact=True`, score `0/5300` |
| `func_0000B030` | 128 | `724F3F574CDD3BC80C392947C4F36E9D22201C861EBF03946466CB14D204D03B` | `exact=True`, score `0/3200` |
| `func_0011B344` | 236 | `D32E5D60DA2783A0C0724A59B7D1DF54E3E09C4C544DD587C85835BA722E131E` | `exact=True`, score `0/5600` |
| `func_00007600` | 136 | `4775B598FFACB859D340132D48CB1FBFAF2024B1215769C8AAC5102609DA8E40` | `exact=True`, score `0/3400` |

The five functions total 776 bytes.

The Phase 8 report contains zero `func_000238B0` target proofs.

### 2026-08-05 — handoff validation

Command:

```powershell
node 'C:\Users\Joe\Projects\OgreBattlel64\tools\coordination\validate_handoff.js' --manifest 'C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp\docs\matching-c\ob64-mc-6lw01-df-cp001-s02-correction-20260805\handoff-manifest.json' --worktree 'C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp'
```

Result:

```json
{
  "ok": true,
  "programId": "OB64-MC-6LW01-20260803",
  "taskId": "OB64-MC-6LW01-PROMO-DF-CP001-S02-CORRECTION-20260805-R1",
  "errors": []
}
```

### 2026-08-05 — failed discovery methods

An initial broad `diff.py` hash search exceeded its 30-second limit. It produced no usable output and changed no file.

A bounded Git metadata search found the exact asm-differ checkout. All pinned identities then matched.

An initial configuration context command matched two `symbol` fields. PowerShell rejected array arithmetic before any mutation.

The corrected command anchored the first target-level symbol field. It returned the intended target block.

A final Git object comparison first used backslash object paths. Git rejected those paths before comparison.

The corrected forward-slash object paths passed all configuration comparisons.

## Final result

- Corrected configuration targets: 28.
- Accepted baseline targets preserved: 23.
- Retained checkpoint targets preserved: 5.
- Retained checkpoint bytes: 776.
- Excluded function: `func_000238b0`.
- Fresh configuration SHA-256: `E0D9023BFCA2CD9BE55DEAC6457561D168F1BCA9DE02702F607A4C2C1B6F70D6`.
- Review status: pending.

## Current next action

Inspect the final diff, rerun the validator, and send the exact callback once.
