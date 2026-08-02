# Wave 6 reproduction procedure

## Status and result

Status: completed and review-pending. The authenticated setup, build, verifier,
and reproducibility gates all passed. This matters because two fresh external
roots produced identical full-ROM and owner results. No action is required from
Joe; the Director must route the package for independent Critical review.

## Authenticated inputs

| Input | Path | Identity |
|---|---|---|
| Phase 5A root | `C:\Users\Joe\Projects\OB64-Decomp-Hijs-Integration\docs\external-intake\phase5-boundary-segment-reconciliation-static-20260731` | Read-only accepted Phase 5A input |
| Phase 7 input | `C:\Users\Joe\.codex\ob64-phase8-matching-c-20260801\run-a\conventional` | Accepted Phase 7 output |
| KMC compiler | `C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe` | `F3F1C99A322F5B3D8C108C2A44AF1D6D084DD27575C5D60BF0F0D33FFF34B1C6` |
| Splat Python | `C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe` | Authenticated Phase 5B runtime |
| Splat split script | `C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py` | Authenticated Phase 5B tool |
| asm-differ checkout | `C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ` | Authenticated comparison tool |
| Phase 6 manifest | `docs/external-intake/phase6-kmc-reproduction-20260801/reproduction-manifest.json` | `98C8ACC06A8FBF40DADBD25AE20C2539E8765E14EA12895158C37CC413D06C26` |

The KMC compile flags are:

```text
-quiet -O2 -meb -mips3 -mgp32 -mfp32 -G 0 -fno-PIC -mno-abicalls -fno-builtin -funsigned-char
```

## Setup verification

Run from `C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp`:

```text
node tools/verify_setup.js --phase5a-root "C:\Users\Joe\Projects\OB64-Decomp-Hijs-Integration\docs\external-intake\phase5-boundary-segment-reconciliation-static-20260731"
```

Result: PASS with all 21 checks. The report records these identities:

| Identity | SHA-256 |
|---|---|
| Code region | `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409` |
| Full ROM | `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A` |
| Overlay configuration | `D4F1FB177822334EB748D6D62B342BF813D8825FEDD912057CF651EB616A5FB6` |
| Setup report | `B0E9FA404B81A92CA0EB23C75A3F1A534964AEB815771EE0D00CA5008F351F8D` |

## Fresh build A

The output directory was absent before the build:

```text
C:\Users\Joe\.codex\ob64-matching-c-wave6-20260802\run-a\conventional
```

Run:

```text
node tools/build_phase8_matching_c.js --output "C:\Users\Joe\.codex\ob64-matching-c-wave6-20260802\run-a\conventional" --phase7-output "C:\Users\Joe\.codex\ob64-phase8-matching-c-20260801\run-a\conventional" --compiler "C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe" --splat-python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --splat-split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ"
```

Result: PASS. The build produced the canonical full-ROM SHA-256.

## Fresh build B

The output directory was absent before the build:

```text
C:\Users\Joe\.codex\ob64-matching-c-wave6-20260802\run-b\conventional
```

Run the same command with this output path:

```text
node tools/build_phase8_matching_c.js --output "C:\Users\Joe\.codex\ob64-matching-c-wave6-20260802\run-b\conventional" --phase7-output "C:\Users\Joe\.codex\ob64-phase8-matching-c-20260801\run-a\conventional" --compiler "C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe" --splat-python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --splat-split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ"
```

Result: PASS. The build produced the same canonical full-ROM SHA-256.

## Standalone verification

Verify build A:

```text
node tools/verify_phase8_matching_c.js --output "C:\Users\Joe\.codex\ob64-matching-c-wave6-20260802\run-a\conventional" --compiler "C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe" --splat-python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --splat-split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ" --report "C:\Users\Joe\.codex\ob64-matching-c-wave6-20260802\run-a\conventional\verification.json"
```

Verify build B:

```text
node tools/verify_phase8_matching_c.js --output "C:\Users\Joe\.codex\ob64-matching-c-wave6-20260802\run-b\conventional" --compiler "C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe" --splat-python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --splat-split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ" --report "C:\Users\Joe\.codex\ob64-matching-c-wave6-20260802\run-b\conventional\verification.json"
```

Both verifier runs passed. The verifier report SHA-256 is
`D265EAEE4A07FC30F204460D8D100C2F6290A785B1B1A7D5968F66F604FD9AED` in both
roots.

## Path-independent comparison

Run:

```text
node tools/compare_phase8_reproducibility.js --left "C:\Users\Joe\.codex\ob64-matching-c-wave6-20260802\run-a\conventional" --right "C:\Users\Joe\.codex\ob64-matching-c-wave6-20260802\run-b\conventional" --report "C:\Users\Joe\.codex\ob64-matching-c-wave6-20260802\run-a\conventional\reproducibility.json"
```

Result: PASS. The build report SHA-256 is
`A74706081DBF38D2024A7BF2C8BC4E9906A290C1470E6CE635904DBB2C124A1E` in both
roots. The verification report SHA-256 is
`D265EAEE4A07FC30F204460D8D100C2F6290A785B1B1A7D5968F66F604FD9AED` in both
roots. The comparison report SHA-256 is
`D99C32C68DA6D665793A36E3CDC3207088FF2857D529FE36D95F942BA73EAA48`.

An independent file-tree hash comparison also found zero differences across
the 171 files present before the comparison report was added.

## Output identities

Both fresh roots produced these identical identities:

| Artifact | Bytes | SHA-256 |
|---|---:|---|
| `phase8.elf` | 44,130,992 | `AFBCE8B6A5C6D43FC0BDA6A3F9386603DC89D839F76CDB9C159C3D2DBE1EFCF5` |
| `phase8.map` | 7,006,000 | `350B31BF8D51070A5039AFFA67ED2703F33C397EBF42873DBC3BF4CB92E075E2` |
| `phase8.us_rev0.z64` | 41,943,040 | `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A` |
| Code region | — | `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409` |
| `layout.json` | 4,899,701 | `9682CB22EEED5D20FD7091C6B4E76E6C8DD27F7E12D943FEB13E88240A328D91` |
| `phase8.readelf.txt` | 4,621,335 | `82C560E890175C78BF93F3C47E1F635CD4C671EF6876D1886516098DB1E06C7D` |
| `objects/manifest.json` | 25,742 | `8EC8D2EFF32B9CB1A57D3676A30AAB61A67685C2B835B056CD1BA86DD35E3F37` |

## Target proof

The linked target is `.ob64.r4836` at runtime address `0x80216C70`. It is
1,196 bytes. Its linked text SHA-256 is
`A88503EABEC9D4127CFBD75972F3F0465DC1A58B904DBDDE3B54BCFBA16B4E1A`.
The raw C object text SHA-256 is
`C48C33CA6FBF76AFEEF6A19B3CF3709D83045EA82BEE78D4E23B6BA4F9FB814D`.

asm-differ reported exact matches for all seven C owners. The new target has
299 assembly rows, current score `0`, and maximum score `29,900`.

The preservation report records 7,242 primary rows, 7,251 executable slices,
19 overlay reservations, and no linked original-assembly target.

## Evidence storage

Generated ROMs, objects, maps, executables, and bulk reports remain under the
two external roots. The tracked evidence root contains curated Markdown only.

## Review state

Worker result: completed. Evidence grade: supported before independent review.
Review status: pending. This procedure does not issue an acceptance verdict.
