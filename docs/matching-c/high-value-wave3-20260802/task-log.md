# Task log and reproduction procedure

## Terminal status

The worker result is complete and review-pending. The selected 524-byte target,
all four configured C targets, both external roots, and the full ROM pass.
The Director must intake the uncommitted changes and route fresh Critical review.

No commit, push, publication, or acceptance verdict was made. No action is
required from Joe during worker intake.

## Baseline and identity

| Item | Recorded value |
|---|---|
| Canonical decomp repository | `C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp` |
| Canonical branch and HEAD | `main`, `b0768ff413f6d31c7d80988ecda941fcd2487462` |
| Parent repository HEAD | `bed88d069e2f61b941c34907bc49f868de6f6e93`; read-only |
| Integration evidence HEAD | `b22815518f060425519c08df19b617af8b5099a7`; read-only |
| Phase 5A product root | `C:\Users\Joe\Projects\OB64-Decomp-Hijs-Integration\docs\external-intake\phase5-boundary-segment-reconciliation-static-20260731` |
| Canonical ROM SHA-256 | `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A` |
| Canonical code-region SHA-256 | `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409` |
| Phase 7 input | `C:\Users\Joe\.codex\ob64-phase8-matching-c-20260801\run-a\conventional` |
| Accepted compiler | `C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe` |

## Commands and results

| Sequence | Exact command or action | Result | Evidence |
|---:|---|---|---|
| 1 | Read the parent rules, worker workflow, ready prompt, nested rules, and local toolchain documents. | PASS; mission scope and protected surfaces were identified before edits. | Assignment record and repository documents |
| 2 | Record branch and HEAD for the canonical, parent, and integration repositories. | PASS; canonical repository started on `main` at the recorded HEAD. | `target-selection.md` |
| 3 | Run `node tools/verify_setup.js --phase5a-root "C:\Users\Joe\Projects\OB64-Decomp-Hijs-Integration\docs\external-intake\phase5-boundary-segment-reconciliation-static-20260731"` before source edits. | PASS; `ok: true` and all 21 checks passed. | Setup report and baseline notes |
| 4 | Select `func_0000BC8C` from the accepted owner model and local resource dossier. | PASS; row `107`, section `.ob64.r0107`, 524 bytes, early-boot linear placement. | `target-selection.md` |
| 5 | Derive the C body from local assembly, ROM bytes, and accepted local evidence. | PASS; behavior, constants, calls, loops, and diagnostics are recorded. | `independent-derivation.md` and source file |
| 6 | Compile and assemble the candidate with the accepted KMC flags. | PASS; the object section is 524 bytes and has the configured relocation set. | Root A generated C object and build report |
| 7 | Add the target to `config/phase8/matching-c.json`. | PASS; four targets load with rows `1972`, `105`, `67`, and `107`. | Configuration SHA-256 `454AC010D93FD6C583C5C5F8A8F00F3E50D2A79B5A7A8476131648B9F7060BCD` |
| 8 | Run the first Phase 8 build in root A. | Corrective failure; linked ROM SHA was `9BD499C93BA18FC84053C14B357A3592419931F2BDB3E709D6E9EF31258E9247`. | External root A first output |
| 9 | Compare the failed target range and correct address aliases and `addu` copy encodings. | PASS; the final focused object differs from linked reference bytes only at relocation words before linking. | Source, config, and target-selection correction notes |
| 10 | Run the final Phase 8 build in root A. | PASS; full ROM SHA is `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`. | `C:\Users\Joe\.codex\ob64-matching-c-wave3-20260802-a\phase8-v2\build-report.json` |
| 11 | Run the final verifier in root A with `--report "C:\Users\Joe\.codex\ob64-matching-c-wave3-20260802-a\phase8-v2\verification.json"`. | PASS; target bytes, relocations, placement, preservation, and full ROM checks pass. | Root A verification report SHA-256 `8AAF145E4FEA0B71708B6665D4AAC53FDAB116E007000B4AC204C582CA1A174E` |
| 12 | Run the final Phase 8 build and verifier in root B. | PASS; root B produces the same identities as root A. | Root B build and verification reports |
| 13 | Run the canonical two-root comparer. | PASS; path-independent Phase 8 identities match. | `reproducibility.json` SHA-256 `71D72748C64FC22A69B57158032F0A5EF7021FD5EC5EBFA82EA8094E8D268BA3` |
| 14 | Rerun `node tools/verify_setup.js --phase5a-root "C:\Users\Joe\Projects\OB64-Decomp-Hijs-Integration\docs\external-intake\phase5-boundary-segment-reconciliation-static-20260731"` after final source and configuration edits. | PASS; all 21 checks passed. The command completed after 282.9 seconds. | Setup report SHA-256 `B0E9FA404B81A92CA0EB23C75A3F1A534964AEB815771EE0D00CA5008F351F8D` |
| 15 | Run scoped diff, JSON, and inventory checks. | PASS; no whitespace errors, invalid JSON, generated tracked artifact, or unrelated mission-path file was found. | Final scoped Git status |

## Final Phase 8 commands

The following commands reproduce root A.

```powershell
node tools/build_phase8_matching_c.js --output "C:\Users\Joe\.codex\ob64-matching-c-wave3-20260802-a\phase8-v2" --phase7-output "C:\Users\Joe\.codex\ob64-phase8-matching-c-20260801\run-a\conventional" --compiler "C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe" --splat-python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --splat-split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ"
node tools/verify_phase8_matching_c.js --output "C:\Users\Joe\.codex\ob64-matching-c-wave3-20260802-a\phase8-v2" --compiler "C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe" --splat-python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --splat-split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ" --report "C:\Users\Joe\.codex\ob64-matching-c-wave3-20260802-a\phase8-v2\verification.json"
```

Root B uses the same command arguments with this output path:

```powershell
C:\Users\Joe\.codex\ob64-matching-c-wave3-20260802-b\phase8-v2
```

The canonical reproducibility command is:

```powershell
node tools/compare_phase8_reproducibility.js --left "C:\Users\Joe\.codex\ob64-matching-c-wave3-20260802-a\phase8-v2" --right "C:\Users\Joe\.codex\ob64-matching-c-wave3-20260802-b\phase8-v2" --report "C:\Users\Joe\.codex\ob64-matching-c-wave3-20260802-a\phase8-v2\reproducibility.json"
```

## Correction and protocol notes

The first setup wrapper exceeded its 124-second shell timeout after the setup
report had completed. The report was valid, and the exact Node processes were
stopped. The final unchanged setup command passed in 282.9 seconds.

The first Phase 8 build exposed 17 one-byte differences inside the target.
The differences came from three incorrect linked aliases and KMC `or` copies.
The worker corrected those values and reran the complete build and verifier.

The first reproducibility command used `verify-report.json`. The comparer
requires `verification.json`. Both verifiers were rerun with the canonical name.
The corrected comparer then passed.

## Final changed surfaces

The worker changed only these canonical surfaces:

- `src/boot/boot_resource_record_resolve_load.c`
- `config/phase8/matching-c.json`
- `docs/matching-c/high-value-wave3-20260802/`

The retained original assembly was not changed. Generated build files remain
outside the canonical repository. The worker left all changes uncommitted.

## Next action

The Director must freeze this coherent result and route it for independent
Critical review. The worker must not accept its own result.
