# Wave 5 reproduction procedure

## Status and result

Status: completed and review-pending. The setup gate, two fresh Phase 8 builds,
two verifiers, and reproducibility comparison all passed. This matters because
the result is path-independent and preserves the canonical ROM. No action is
required from Joe; the Director must route the result for Critical review.

## Preconditions

Run commands from the canonical repository:

```text
C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp
```

The parent and integration repositories remain read-only. The master ROM and
savestate surfaces remain read-only. Build outputs use fresh external roots.

## Authenticated inputs

| Input | Path or identity | SHA-256 |
|---|---|---|
| Accepted KMC compiler | `C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe` | `F3F1C99A322F5B3D8C108C2A44AF1D6D084DD27575C5D60BF0F0D33FFF34B1C6` |
| Compiler manifest | `docs/external-intake/phase6-kmc-reproduction-20260801/reproduction-manifest.json` | `98C8ACC06A8FBF40DADBD25AE20C2539E8765E14EA12895158C37CC413D06C26` |
| Accepted Phase 7 output | `C:\Users\Joe\.codex\ob64-phase8-matching-c-20260801\run-a\conventional` | ROM `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A` |
| Splat Python | `C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe` | Authenticated by the build report |
| Splat split script | `C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py` | Authenticated by the build report |
| asm-differ checkout | `C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ` | Commit `093360aa31f90e67216ed1971c4087516cc7b940` |
| Matching-C configuration | `config/phase8/matching-c.json` | `E07A2C3A2E58478EF5F76BD1C168B97026920B9ADC35A5306E847017C55B6BD4` |

Use these compile flags exactly:

```text
-quiet -O2 -meb -mips3 -mgp32 -mfp32 -G 0 -fno-PIC -mno-abicalls -fno-builtin -funsigned-char
```

## Setup gate

Run:

```text
node tools/verify_setup.js --phase5a-root "C:\Users\Joe\Projects\OB64-Decomp-Hijs-Integration\docs\external-intake\phase5-boundary-segment-reconciliation-static-20260731"
```

Result: PASS. The report has 21 passing checks. It records zero unknown bytes,
exact code-region rebuilding, exact source-manifest rebuilding, and canonical
ROM SHA-256 `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

Report:

```text
C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp\build\setup\verify-setup-report.json
```

Report SHA-256:

```text
B0E9FA404B81A92CA0EB23C75A3F1A534964AEB815771EE0D00CA5008F351F8D
```

## Fresh build A

Run:

```text
node tools/build_phase8_matching_c.js --output "C:\Users\Joe\.codex\ob64-matching-c-wave5-20260802-a\phase8-final-a" --phase7-output "C:\Users\Joe\.codex\ob64-phase8-matching-c-20260801\run-a\conventional" --compiler "C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe" --splat-python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --splat-split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ"
```

Result: PASS. The build report records the canonical full-ROM and code-region
identities.

Verify:

```text
node tools/verify_phase8_matching_c.js --output "C:\Users\Joe\.codex\ob64-matching-c-wave5-20260802-a\phase8-final-a" --compiler "C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe" --splat-python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --splat-split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ" --report "C:\Users\Joe\.codex\ob64-matching-c-wave5-20260802-a\phase8-final-a\verification.json"
```

Result: PASS.

## Fresh build B

Run the same build command with this fresh output path:

```text
C:\Users\Joe\.codex\ob64-matching-c-wave5-20260802-b\phase8-final-b
```

The complete command is:

```text
node tools/build_phase8_matching_c.js --output "C:\Users\Joe\.codex\ob64-matching-c-wave5-20260802-b\phase8-final-b" --phase7-output "C:\Users\Joe\.codex\ob64-phase8-matching-c-20260801\run-a\conventional" --compiler "C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe" --splat-python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --splat-split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ"
```

Verify build B:

```text
node tools/verify_phase8_matching_c.js --output "C:\Users\Joe\.codex\ob64-matching-c-wave5-20260802-b\phase8-final-b" --compiler "C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe" --splat-python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --splat-split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ" --report "C:\Users\Joe\.codex\ob64-matching-c-wave5-20260802-b\phase8-final-b\verification.json"
```

Results: build PASS and verifier PASS.

## Path-independent comparison

Run:

```text
node tools/compare_phase8_reproducibility.js --left "C:\Users\Joe\.codex\ob64-matching-c-wave5-20260802-a\phase8-final-a" --right "C:\Users\Joe\.codex\ob64-matching-c-wave5-20260802-b\phase8-final-b" --report "C:\Users\Joe\.codex\ob64-matching-c-wave5-20260802-a\phase8-final-a\reproducibility.json"
```

Result: PASS. The reports and all authenticated outputs are identical.

## Output identities

Both fresh roots produced these identities:

| Artifact | Bytes | SHA-256 |
|---|---:|---|
| `phase8.elf` | 44,130,728 | `D1AC44BDA03BB5B104F6CB810A8419A86791521FE6E0D2F820925C6B07CDAE0D` |
| `phase8.map` | 7,004,697 | `F6027949F179C558AEBE7906F308887AF5DA5B2A4F4B106F07BDE61B29F03778` |
| `phase8.us_rev0.z64` | 41,943,040 | `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A` |
| Code region | — | `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409` |
| `layout.json` | 4,899,208 | `6B6C34EC593BFB1C149A192368B45999731584196B3925A99FBA80482EEC72B9` |
| `readelf.txt` | 4,620,742 | `7D2DB83D00427B0F84AA619781ACD5BA00268057696E54A53E079DFD3BE358F9` |
| `object-manifest.json` | 25,444 | `9552CC8B84B17BD3F47048502D3C764B6CC4AE4AD9078BF9695849BF212FB3CF` |

The build report SHA-256 is
`D8CBBDDDA7BAFEC9922023F376C3ABE0B7E5BFD05ADCE7E1B82B5D86A9F3E00A` in both
roots. The verifier report SHA-256 is
`B4DDC93810560CA2A04A145C8401CE802840DA3BD61C7CA747C8ECAC68A79B84` in both
roots. The comparison report SHA-256 is
`2EE4D99CE402FF5A01DBE956D125C0AEFE162ED600B6DE1DE054FCDC3D79F93E`.

## Target proof

The linked target is `.ob64.r4834` at runtime address `0x802167B0`. It is
1,156 bytes. Its linked text SHA-256 is
`5342CBA0C83FCFE9E4825BEF64B50DDFFAAF359ABF9D470CDE1E7D517825DBFC`.
The object text SHA-256 before linking is
`09E0856A4F0881FE2D495FA4A2C291A889DB3BFCB784FC7D7623B8AE639F1249`.

asm-differ reports exact matches for all six C owners. The target has 289
assembly rows, score zero, and maximum score 28,900.

The preservation report records 7,242 primary rows, 7,251 executable slices,
19 overlay reservations, and no linked original-assembly target.

## Evidence storage

Generated ROMs, objects, maps, executables, and bulk reports remain under the
two external roots. The tracked evidence root contains only curated Markdown
records and this procedure.

## Review state

Worker result: completed. Evidence grade: supported before independent review.
Review status: pending. This procedure does not issue an acceptance verdict.
