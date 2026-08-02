# Reproduction procedure

Status: completed and review-pending. This procedure reproduces the recorded
Wave 4 build and evidence identities. It matters because another worker can
repeat the result without private conversation context. No action is required
from Joe; the Director must freeze the result before Critical review.

## Scope

Original assignment: `ob64-decomp-matching-c-high-value-function-wave4-20260802`, revision 1.

This procedure covers the existing technical candidate. The correction worker
changed only documentation under this evidence root. The source, configuration,
and tool repair remain read-only for this correction.

The canonical decomp repository is at `main` HEAD
`d398c23f4163e807039c45956a4ed25c4698b641`. The parent repository remained
read-only. The master ROM remained read-only. Build outputs belong in fresh
external roots.

## Authenticated inputs

| Input | Path | Identity |
|---|---|---|
| Phase 5A product | `C:\Users\Joe\Projects\OB64-Decomp-Hijs-Integration\docs\external-intake\phase5-boundary-segment-reconciliation-static-20260731` | Explicit setup input |
| Phase 7 conventional output | `C:\Users\Joe\.codex\ob64-phase8-matching-c-20260801\run-a\conventional` | Accepted Phase 7 input |
| KMC compiler | `C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe` | `F3F1C99A322F5B3D8C108C2A44AF1D6D084DD27575C5D60BF0F0D33FFF34B1C6` |
| Splat Python | `C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe` | Recorded in build report |
| Splat split script | `C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py` | `EED41D3C36AFA4A980A3B22BC76C371569696CADFEF925DBB63606BFB081544E` |
| Assembly differ | `C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ` | Commit `093360aa31f90e67216ed1971c4087516cc7b940` |

Use an empty fresh output directory for each build. Do not reuse a prior output
directory when reproducing the build.

## Step 1: setup gate

Run this command from `C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp`:

```powershell
node tools/verify_setup.js --phase5a-root "C:\Users\Joe\Projects\OB64-Decomp-Hijs-Integration\docs\external-intake\phase5-boundary-segment-reconciliation-static-20260731"
```

Expected result: `OB64 Decomp setup verification: PASS`.

The recorded report has SHA-256
`B0E9FA404B81A92CA0EB23C75A3F1A534964AEB815771EE0D00CA5008F351F8D`.
It records 21 passing checks. The canonical full ROM SHA-256 is
`571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

## Step 2: build external root A

Run this command from the same canonical repository:

```powershell
node tools/build_phase8_matching_c.js --output "C:\Users\Joe\.codex\ob64-matching-c-wave4-20260802-a\phase8-final-a" --phase7-output "C:\Users\Joe\.codex\ob64-phase8-matching-c-20260801\run-a\conventional" --compiler "C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe" --splat-python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --splat-split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ"
```

Expected result: `Phase 8 matching C build: PASS`.

Root A recorded the canonical full ROM SHA-256
`571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

## Step 3: verify external root A

```powershell
node tools/verify_phase8_matching_c.js --output "C:\Users\Joe\.codex\ob64-matching-c-wave4-20260802-a\phase8-final-a" --compiler "C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe" --splat-python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --splat-split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ" --report "C:\Users\Joe\.codex\ob64-matching-c-wave4-20260802-a\phase8-final-a\verification.json"
```

Expected result: `Phase 8 matching C verification: PASS`.

## Step 4: build external root B

Use the same accepted inputs with this fresh output path:

```powershell
node tools/build_phase8_matching_c.js --output "C:\Users\Joe\.codex\ob64-matching-c-wave4-20260802-b\phase8-final-b" --phase7-output "C:\Users\Joe\.codex\ob64-phase8-matching-c-20260801\run-a\conventional" --compiler "C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe" --splat-python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --splat-split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ"
```

Expected result: `Phase 8 matching C build: PASS`.

Root B produced the same canonical full ROM SHA-256.

## Step 5: verify external root B

```powershell
node tools/verify_phase8_matching_c.js --output "C:\Users\Joe\.codex\ob64-matching-c-wave4-20260802-b\phase8-final-b" --compiler "C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe" --splat-python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --splat-split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ" --report "C:\Users\Joe\.codex\ob64-matching-c-wave4-20260802-b\phase8-final-b\verification.json"
```

Expected result: `Phase 8 matching C verification: PASS`.

## Step 6: compare the two roots

```powershell
node tools/compare_phase8_reproducibility.js --left "C:\Users\Joe\.codex\ob64-matching-c-wave4-20260802-a\phase8-final-a" --right "C:\Users\Joe\.codex\ob64-matching-c-wave4-20260802-b\phase8-final-b" --report "C:\Users\Joe\.codex\ob64-matching-c-wave4-20260802-a\phase8-final-a\reproducibility.json"
```

Expected result: `Phase 8 reproducibility comparison: PASS`.

The recorded comparison report SHA-256 is
`E16576C27FCF4226F47871C8DB5E54D04C437612136140BBFD86E658001EB81B`.

## Step 7: verify target identities

The build reports must identify these target values:

| Identity | Expected value |
|---|---|
| Target section | `.ob64.r4801`, 808 bytes |
| Target C object text | `481296CB178391FFE31D7270EA993FED1AC5B7BE17F43AAFF5B97830E68C9BDC` |
| Target linked text | `C4F2DD8D5281054D1F0266ECDEDC6832CF669DA331AC4C4F0A92B6A7D134EF02` |
| Target placement | Runtime `0x802148C0..0x80214BE8`, overlay descriptor `12` |
| Accepted rows preserved | `7242` |
| Accepted slices preserved | `7251` |
| Overlay descriptors preserved | `19` |
| Earlier accepted targets | `func_000E5938`, `func_0000B33C`, `func_00007688`, `func_0000BC8C` |
| Full ROM | `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A` |

The four earlier accepted targets must report `exact: true` through asm-differ.
No original assembly target may remain a linked owner.

## Package cross-links

The [evidence index](evidence-index.md) records this procedure and its results.
The [after-action report](aar/20260802-ob64-matching-c-high-value-wave4-aar.md)
summarizes the technical result. The [evidence-completion correction report](aar/20260802-ob64-matching-c-high-value-wave4-evidence-completion-aar.md)
summarizes the documentation correction and its review state.

## Step 8: scope checks

Run these commands from the parent workspace after updating the evidence:

```powershell
git -C "C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp" diff --check -- "docs/matching-c/high-value-wave4-20260802"
```

Expected result: exit code `0` with no output.

```powershell
rg --files "C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp\docs\matching-c\high-value-wave4-20260802" | Sort-Object
```

Expected result: seven curated Markdown files. The root must contain no
generated ROM, object, map, report, or other build artifact.

## Interpretation limits

The build proves byte identity, placement, relocations, and preservation. It
does not prove gameplay semantics. Critical independent review remains required.
