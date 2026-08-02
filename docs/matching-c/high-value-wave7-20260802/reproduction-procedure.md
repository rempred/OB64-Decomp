# Wave 7 reproduction procedure

## Status and result

Status: reproduction complete and review-pending. The authenticated setup,
two final builds, two verifiers, and reproducibility comparison all passed.
This proves the static build result is path-independent. The Director must
route Critical review; no action is required from Joe.

## Authenticated inputs

| Input | Path or identity | SHA-256 or identity |
|---|---|---|
| Phase 5A root | `C:\Users\Joe\Projects\OB64-Decomp-Hijs-Integration\docs\external-intake\phase5-boundary-segment-reconciliation-static-20260731` | Declared prompt input; protected descendants were not enumerated |
| Phase 7 conventional output | `C:\Users\Joe\.codex\ob64-phase8-matching-c-20260801\run-a\conventional` | Build report `080CFE20487E93E776EB46D1C5374B720D99DE73F55826AB6C94CD96906564EE` |
| KMC compiler | `C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe` | `F3F1C99A322F5B3D8C108C2A44AF1D6D084DD27575C5D60BF0F0D33FFF34B1C6` |
| Phase 6 manifest | `docs/external-intake/phase6-kmc-reproduction-20260801/reproduction-manifest.json` | `98C8ACC06A8FBF40DADBD25AE20C2539E8765E14EA12895158C37CC413D06C26` |
| Splat Python | `C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe` | Setup report authenticated |
| Splat split script | `C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py` | `EED41D3C36AFA4A980A3B22BC76C371569696CADFEF925DBB63606BFB081544E` |
| asm-differ | `C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ` | Commit `093360aa31f90e67216ed1971c4087516cc7b940` |

## Setup gate

Run from `C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp`:

```text
node tools/verify_setup.js --phase5a-root "C:\Users\Joe\Projects\OB64-Decomp-Hijs-Integration\docs\external-intake\phase5-boundary-segment-reconciliation-static-20260731"
```

Result: `OB64 Decomp setup verification: PASS`.

Report: `build/setup/verify-setup-report.json`.

Report SHA-256: `B0E9FA404B81A92CA0EB23C75A3F1A534964AEB815771EE0D00CA5008F351F8D`.

The setup report records code-region SHA-256
`40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409` and ROM
SHA-256 `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

## Final build roots

The final commands used the accepted KMC flags from the Phase 6 manifest. Each
output root was new for its final build. Generated outputs stayed outside Git.

### Root A

```text
node tools/build_phase8_matching_c.js --output "C:\Users\Joe\.codex\ob64-matching-c-wave7-20260802\run-a4\conventional" --phase7-output "C:\Users\Joe\.codex\ob64-phase8-matching-c-20260801\run-a\conventional" --compiler "C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe" --splat-python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --splat-split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ"
```

Result: `Phase 8 matching C build: PASS`.

Build report SHA-256: `0BEA7BD4DB191849EA0481A3836E326809E9C2095624AE43D27F2A04E27C39C2`.

### Root B

```text
node tools/build_phase8_matching_c.js --output "C:\Users\Joe\.codex\ob64-matching-c-wave7-20260802\run-b3\conventional" --phase7-output "C:\Users\Joe\.codex\ob64-phase8-matching-c-20260801\run-a\conventional" --compiler "C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe" --splat-python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --splat-split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ"
```

Result: `Phase 8 matching C build: PASS`.

Build report SHA-256: `0BEA7BD4DB191849EA0481A3836E326809E9C2095624AE43D27F2A04E27C39C2`.

## Verification gates

Run the verifier once per final root:

```text
node tools/verify_phase8_matching_c.js --output "C:\Users\Joe\.codex\ob64-matching-c-wave7-20260802\run-a4\conventional" --compiler "C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe" --splat-python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --splat-split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ" --report "C:\Users\Joe\.codex\ob64-matching-c-wave7-20260802\run-a4\conventional\verification.json"
node tools/verify_phase8_matching_c.js --output "C:\Users\Joe\.codex\ob64-matching-c-wave7-20260802\run-b3\conventional" --compiler "C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe" --splat-python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --splat-split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ" --report "C:\Users\Joe\.codex\ob64-matching-c-wave7-20260802\run-b3\conventional\verification.json"
```

Both results were `Phase 8 matching C verification: PASS`.

Each verification report has SHA-256
`334399C94C61A50EBB0BF6AF2E19C958E866B4E9BC36ECD9F8614E791751782B`.

Each report records eight matching-C owners, 7,242 primary rows, 7,251 link
slices, 19 overlay reservations, and `fullRomExact: true`.

## Reproducibility gate

```text
node tools/compare_phase8_reproducibility.js --left "C:\Users\Joe\.codex\ob64-matching-c-wave7-20260802\run-a4\conventional" --right "C:\Users\Joe\.codex\ob64-matching-c-wave7-20260802\run-b3\conventional" --report "C:\Users\Joe\.codex\ob64-matching-c-wave7-20260802\run-a4\conventional\reproducibility.json"
```

Result: `Phase 8 reproducibility comparison: PASS`.

The report records `reportsIdentical: true`.

Reproducibility report SHA-256: `B1E0E72EAD3E43571167407F74FD71F0741CA8002B35D8FAF8DCEDBD96DE7F26`.

## Target result

The target text and object text are both 1,508 bytes. Both hashes are
`08B5A10F4A00B892D8CBE99A62BC7F823FBB7A6B4EB9FB488D1BC2EFC341B50B`.

The linked owner is `.ob64.r0056` at runtime virtual address `0x80075BC0`.
The final target contract has zero text relocations and zero `.rel.pdr`
relocations. The target covers the local secondary and both local tail leaves.

## Evidence package

The worker AAR is [20260802-ob64-matching-c-high-value-wave7-aar.md](aar/20260802-ob64-matching-c-high-value-wave7-aar.md).
