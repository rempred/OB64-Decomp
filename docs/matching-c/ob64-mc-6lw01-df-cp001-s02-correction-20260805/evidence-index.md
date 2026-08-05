# OB64-MC-6LW01-DF-CP001-S02 Correction Evidence Index

## Outcome

Status: completed. The evidence proves that only `func_000238b0` left the prohibited promotion. The other twenty-eight targets remain exact. No action is required.

## Frozen route inputs

| Artifact | SHA-256 | Evidence role |
|---|---|---|
| `C:\Users\Joe\Projects\OgreBattlel64-Coordination-Worktrees\highway-df\docs\Plans\ob64-matching-c-six-lane-wave-20260803\checkpoints\OB64-MC-6LW01-DF-CP001-S02-checkpoint-manifest.json` | `68B56CB26FD679351455123A5122176FB507CDCA130B73154516F47C4B8C05DF` | Freezes the five retained checkpoint functions and 776 bytes. |
| `C:\Users\Joe\Projects\OgreBattlel64\docs\Plans\ob64-matching-c-six-lane-wave-20260803\checkpoint-supersessions\OB64-MC-6LW01-DF-CP001-S02-policy-supersession.json` | `3EE3D82030F67184690FB00F6C17C997271FFBF620CD0BCD317E3DB5A50ED711` | Requires exclusion of `func_000238b0`. |
| `C:\Users\Joe\Projects\OgreBattlel64\docs\Plans\prompts\ob64-matching-c-six-lane-wave-df-cp001-s02-canonical-correction-20260805-r1-prompt.md` | `DD206C5FE262F8D5AE891E9B9B7F6A0FB843AF3EF10E96C7C68398F1E05A6341` | Defines the correction mission and done-gates. |

## Canonical correction

| Artifact or check | Result | Evidence role |
|---|---|---|
| Starting HEAD | `3f67125b22eda07ea56f72e0961790d19e3f1689` | Preserves the prohibited promotion and earlier history. |
| Starting configuration SHA-256 | `7AD3F59E5B2A9F9254B62727B14EE3189E783DA7D9FF2AB93F0813A17418D8E9` | Identifies the prohibited 29-target configuration. |
| Corrected configuration | `C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp\config\phase8\matching-c.json` | Holds the corrected 28-target configuration. |
| Corrected configuration SHA-256 | `E0D9023BFCA2CD9BE55DEAC6457561D168F1BCA9DE02702F607A4C2C1B6F70D6` | Proves a fresh configuration identity. |
| Configuration comparison | `allRetainedTargetsUnchanged=True` | Proves all 28 retained target objects are unchanged. |
| Baseline comparison | `baselineTargetsUnchanged=True` | Proves all 23 accepted baseline target objects are unchanged. |
| Compiler comparison | `compilerUnchanged=True` | Proves every compiler field is unchanged. |
| Excluded configuration count | `0` | Proves `func_000238B0` is absent from configuration. |
| Excluded source | `C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp\src\lib\sprintf.c` | The promoted C source is absent. |
| Retained assembly fallback | `C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp\asm\original\rev0\lib\sprintf.s` | Preserves no-gap original assembly ownership. |
| Retained fallback SHA-256 | `D000B21EFFC5065D59AA3410BE10C362CB2950EA7679D38287FF7C8204F37F68` | Proves the fallback owner is unchanged. |

## Authenticated prerequisites

| Prerequisite | Identity | Evidence role |
|---|---|---|
| Phase 5A product root | `C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\lane-c\row565-phase5b-sol-correction-r1\phase5a-cumulative-successor` | Supplies the accepted cumulative Phase 5A product. |
| Phase 5A product manifest SHA-256 | `F004C4C09D611671935BD0D7927D514EAC1E05C347FBB271A523C424AFDB1D04` | Matches the accepted configuration pin. |
| Splat Python | `C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe` | Runs the authenticated Splat environment. |
| Splat Python SHA-256 | `4CCA2027319C08DCA5CC4B64C9BA415CC89205152202CB6805081277C43B610F` | Matches the Phase 7 pin. |
| Splat `split.py` | `C:\Users\Joe\.codex\phase5b-splat-20260801-third-review-correction-r2\snapshot\split.py` | Supplies the authenticated source snapshot entry point. |
| Splat `split.py` SHA-256 | `EED41D3C36AFA4A980A3B22BC76C371569696CADFEF925DBB63606BFB081544E` | Matches the Phase 7 pin. |
| asm-differ checkout | `C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ` | Supplies exact section comparison. |
| asm-differ commit | `093360aa31f90e67216ed1971c4087516cc7b940` | Matches the conventional-build pin. |
| asm-differ `diff.py` SHA-256 | `D69AA5916DA99A9D88D3B3156C4ABB1C656E425205644B3DB4726204DC7C2211` | Matches the conventional-build pin. |
| KMC compiler | `C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-b\toolchain\kmc-gcc-2.7.2\cc1.exe` | Compiles all matching-C targets. |
| KMC compiler SHA-256 | `F3F1C99A322F5B3D8C108C2A44AF1D6D084DD27575C5D60BF0F0D33FFF34B1C6` | Matches the Phase 8 pin. |

## Fresh verification outputs

External root: `C:\Users\Joe\Projects\OgreBattlel64-External-Outputs\OB64-MC-6LW01-20260803\DF-CP001-S02\correction-r1`.

| Artifact | Bytes | SHA-256 | Result |
|---|---:|---|---|
| `C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp\build\setup\verify-setup-report.json` | 7,801 | `984BF75ED781E9E7D9C6B7A228D8AECDA22CBBC38911979157E0793004342D41` | All 21 setup checks passed. |
| `C:\Users\Joe\Projects\OgreBattlel64-External-Outputs\OB64-MC-6LW01-20260803\DF-CP001-S02\correction-r1\splat\splat-command.json` | 1,933,598 | `7145CF6328F57E2BC2DD3D38569A91240CFD98B5625F4EB59E79E90BE9A4833D` | Fresh Splat execution passed. |
| `C:\Users\Joe\Projects\OgreBattlel64-External-Outputs\OB64-MC-6LW01-20260803\DF-CP001-S02\correction-r1\phase7\build-report.json` | 7,455 | `DFF3D4DE0BBF88829CFECEC88161AA5443AC3F1B87C12314167491706FD29EE7` | Fresh conventional build passed. |
| `C:\Users\Joe\Projects\OgreBattlel64-External-Outputs\OB64-MC-6LW01-20260803\DF-CP001-S02\correction-r1\phase7\verification.json` | 2,423 | `7CCE232075BCF187789DE424E8DD76CD43186A5B6DE61905C92D771E8A11D89E` | Conventional verification passed. |
| `C:\Users\Joe\Projects\OgreBattlel64-External-Outputs\OB64-MC-6LW01-20260803\DF-CP001-S02\correction-r1\phase7\phase7.us_rev0.z64` | 41,943,040 | `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A` | Conventional ROM matches the retail reference. |
| `C:\Users\Joe\Projects\OgreBattlel64-External-Outputs\OB64-MC-6LW01-20260803\DF-CP001-S02\correction-r1\phase8\build-report.json` | 184,895 | `BBCFB93E51EA28E0ABB896958C4FD8FBEC20B0F40CAB15F31C3B866DDB303718` | Fresh 28-target matching-C build passed. |
| `C:\Users\Joe\Projects\OgreBattlel64-External-Outputs\OB64-MC-6LW01-20260803\DF-CP001-S02\correction-r1\phase8\verification.json` | 82,637 | `14B9F0FA578B16405F28855AF46438C06FA2839655E7FC0751AC68A76606665C` | Independent Phase 8 verification passed. |
| `C:\Users\Joe\Projects\OgreBattlel64-External-Outputs\OB64-MC-6LW01-20260803\DF-CP001-S02\correction-r1\phase8\phase8.us_rev0.z64` | 41,943,040 | `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A` | Matching-C ROM matches the retail reference. |

Both build reports record code-region SHA-256 `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.

## Five retained checkpoint functions

| Structural symbol | Bytes | Source SHA-256 | Exact linked text SHA-256 | asm-differ |
|---|---:|---|---|---|
| `func_0002DE10` | 64 | `F2E739927C71AB14E249F6A15A8791753BE52F0C23A957B25EABBBCB0AAC3B31` | `55C72E0B914987A8E32A265336CCB667C54FCE1B1F8833ABD9A4ADCCBF651C20` | `exact=True`, score `0/1600` |
| `func_001072B8` | 212 | `E981D005A2721AEF9EB1E5D49C09CC045E5139AC43A20F218309347B027C706D` | `01668E7CEF47586F27ED52C70957621F4CE194E6C411C3F5429D8693AE51B7BF` | `exact=True`, score `0/5300` |
| `func_0000B030` | 128 | `5201D5853F7D1C33A10003A1C4733ABBC376260274FE1060E28D928003168B82` | `724F3F574CDD3BC80C392947C4F36E9D22201C861EBF03946466CB14D204D03B` | `exact=True`, score `0/3200` |
| `func_0011B344` | 236 | `8C0AD970A2D4AC96F39859D480BC487415303AC06724E530B6334CD382A88E1B` | `D32E5D60DA2783A0C0724A59B7D1DF54E3E09C4C544DD587C85835BA722E131E` | `exact=True`, score `0/5600` |
| `func_00007600` | 136 | `1F785BF47CFA234F410EAA295889B36BE1F6694333C2CCDBD6EE0CC76F60C5F3` | `4775B598FFACB859D340132D48CB1FBFAF2024B1215769C8AAC5102609DA8E40` | `exact=True`, score `0/3400` |

The five functions total 776 bytes. Each fresh source hash matches its unchanged configuration field.

## Commands and limits

The exact commands and results are recorded in `C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp\docs\matching-c\ob64-mc-6lw01-df-cp001-s02-correction-20260805\task-log.md`.

This package proves static configuration, source identity, linked bytes, and full-ROM identity. It makes no gameplay or semantic claim.

## Handoff validation

`tools/coordination/validate_handoff.js` returned `ok: true` with zero errors for the assigned manifest and canonical worktree.
