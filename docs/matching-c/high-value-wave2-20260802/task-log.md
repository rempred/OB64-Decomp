# Task log and reproduction procedure

## Terminal status

The worker result is complete and review-pending. The selected 224-byte target,
both accepted matching-C targets, the conventional build, and the full ROM are
byte-exact. The Director must intake this uncommitted result for Critical review.

## Baseline and identity

| Item | Identity or result |
|---|---|
| Parent repository HEAD | `1e22de1041be2480e8b1e789aedad4e24b7fae39`; read-only |
| Canonical decomp HEAD | `697f54a1f3d3048b302cf72205dc4d7ad9f9f376` on `main` |
| Phase 5A product root | `C:\\Users\\Joe\\Projects\\OB64-Decomp-Hijs-Integration\\docs\\external-intake\\phase5-boundary-segment-reconciliation-static-20260731` |
| Canonical ROM SHA-256 | `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A` |
| Canonical code-region SHA-256 | `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409` |
| KMC compiler | `C:\\Users\\Joe\\.codex\\ob64-phase6-kmc-20260801\\clean-d\\toolchain\\kmc-gcc-2.7.2\\cc1.exe` |
| Phase 7 input | `C:\\Users\\Joe\\.codex\\ob64-phase8-matching-c-20260801\\run-a\\conventional` |

## Commands and results

| Sequence | Exact command or action | Result | Evidence |
|---:|---|---|---|
| 1 | Read `AGENTS.md`, `docs/Worker-workflow.md`, the ready prompt, local `AGENTS.md`, `PLATFORM.md`, `NEXT_STEPS.md`, `WORKFLOW.md`, and `TOOLCHAIN.md`. | PASS; worker scope and protected roots identified. | Assignment prompt and repository files |
| 2 | Record parent and canonical Git metadata. | PASS; canonical repository is `main` at the required HEAD. | `target-selection.md` |
| 3 | `node tools/verify_setup.js --phase5a-root "C:\\Users\\Joe\\Projects\\OB64-Decomp-Hijs-Integration\\docs\\external-intake\\phase5-boundary-segment-reconciliation-static-20260731"` | PASS after the longer retry; all 21 checks passed before source edits. | Canonical setup report; SHA-256 `B0E9FA404B81A92CA0EB23C75A3F1A534964AEB815771EE0D00CA5008F351F8D` |
| 4 | Select `func_00007688` from the accepted owner model and local dossier. | PASS; 224 bytes, early-boot linear placement, one accepted owner row, and secondary entry at offset `0x8C`. | `target-selection.md`; `docs/dossiers/boot-state-slot-flagged-dispatch-lookup.md` |
| 5 | Compile and link the C source in the focused worker root. | PASS; linked text is 224 bytes and equals the extracted assembly reference. | `C:\\Users\\Joe\\.codex\\ob64-matching-c-wave2-20260802-focused-a\\focused-proof.json` |
| 6 | Add the target to `config/phase8/matching-c.json`, then load the Phase 8 model. | PASS; three targets load with rows `1972`, `105`, and `67`. | `config/phase8/matching-c.json` |
| 7 | `node tools/build_phase8_matching_c.js --output "C:\\Users\\Joe\\.codex\\ob64-matching-c-wave2-20260802-a" --phase7-output "C:\\Users\\Joe\\.codex\\ob64-phase8-matching-c-20260801\\run-a\\conventional" --compiler "C:\\Users\\Joe\\.codex\\ob64-phase6-kmc-20260801\\clean-d\\toolchain\\kmc-gcc-2.7.2\\cc1.exe" --splat-python "C:\\Users\\Joe\\.codex\\phase5b-splat-20260801-r4\\venv\\Scripts\\python.exe" --splat-split "C:\\Users\\Joe\\.codex\\phase5b-splat-20260801-r4\\splat-source\\split.py" --asm-differ "C:\\Users\\Joe\\Projects\\OgreBattlel64\\ModderResources\\External Decomp Research\\ogrebattle64-codeberg\\tools\\asm-differ"` | PASS; all three targets compile, link, and reproduce the canonical ROM. | Root A `build-report.json`; SHA-256 `C58E57EFCFA70A48313431B914D39FAF1C711BB2AF35818FD2D9F8CC9D76D004` |
| 8 | `node tools/verify_phase8_matching_c.js --output "C:\\Users\\Joe\\.codex\\ob64-matching-c-wave2-20260802-a" --compiler "C:\\Users\\Joe\\.codex\\ob64-phase6-kmc-20260801\\clean-d\\toolchain\\kmc-gcc-2.7.2\\cc1.exe" --splat-python "C:\\Users\\Joe\\.codex\\phase5b-splat-20260801-r4\\venv\\Scripts\\python.exe" --splat-split "C:\\Users\\Joe\\.codex\\phase5b-splat-20260801-r4\\splat-source\\split.py" --asm-differ "C:\\Users\\Joe\\Projects\\OgreBattlel64\\ModderResources\\External Decomp Research\\ogrebattle64-codeberg\\tools\\asm-differ" --report "C:\\Users\\Joe\\.codex\\ob64-matching-c-wave2-20260802-a\\verification.json"` | PASS; target bytes, relocations, placement, preservation, and full ROM pass. | Root A `verification.json`; SHA-256 `FF4F3E8DCD86C4B6DDD4E364CA2ABC48B38B31DD78A2C1A3C4D4C78C8441455B` |
| 9 | Repeat the Phase 8 build and verification in root B. | PASS; root B produces the same verification identities. | Root B `build-report.json` and `verification.json` |
| 10 | `node tools/compare_phase8_reproducibility.js --left "C:\\Users\\Joe\\.codex\\ob64-matching-c-wave2-20260802-a" --right "C:\\Users\\Joe\\.codex\\ob64-matching-c-wave2-20260802-b" --report "C:\\Users\\Joe\\.codex\\ob64-matching-c-wave2-20260802-a\\reproducibility.json"` | PASS; path-independent identities match. | `reproducibility.json`; SHA-256 `B257AC3E7725544690D875150CF2CDEBD634B9051EA0AB21F8606A3327BDA697` |
| 11 | `node tools/verify_phase7_conventional.js --output "C:\\Users\\Joe\\.codex\\ob64-phase8-matching-c-20260801\\run-a\\conventional" --splat-python "C:\\Users\\Joe\\.codex\\phase5b-splat-20260801-r4\\venv\\Scripts\\python.exe" --splat-split "C:\\Users\\Joe\\.codex\\phase5b-splat-20260801-r4\\splat-source\\split.py" --asm-differ "C:\\Users\\Joe\\Projects\\OgreBattlel64\\ModderResources\\External Decomp Research\\ogrebattle64-codeberg\\tools\\asm-differ"` | PASS; conventional full-ROM identity remains exact. | Phase 7 output; ROM SHA-256 `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A` |
| 12 | Rerun the required explicit-root setup command after source and configuration edits. | PASS; all 21 checks passed and canonical code and ROM hashes remained exact. | `build/setup/verify-setup-report.json`; SHA-256 `B0E9FA404B81A92CA0EB23C75A3F1A534964AEB815771EE0D00CA5008F351F8D` |
| 13 | `git diff --check -- config/phase8/matching-c.json`; parse `config/phase8/matching-c.json`; verify the explicit mission-path inventory. | PASS; the tracked diff has no whitespace errors, the JSON has three targets with rows `1972`, `105`, and `67`, and the inventory contains only expected task files. | Final scoped status and syntax checks |

## Focused proof procedure

The focused proof uses the pinned compiler, GNU assembler, GNU linker, and
objcopy. It extracts one `.word` reference from the retained original assembly.

```powershell
$focused = "C:\\Users\\Joe\\.codex\\ob64-matching-c-wave2-20260802-focused-a"
$cc = "C:\\Users\\Joe\\.codex\\ob64-phase6-kmc-20260801\\clean-d\\toolchain\\kmc-gcc-2.7.2\\cc1.exe"
$as = "C:\\Users\\Joe\\.codex\\ob64-phase6-kmc-20260801\\clean-d\\toolchain\\binutils-2.39\\bin\\mips64-elf-as.exe"
$ld = "C:\\Users\\Joe\\.codex\\ob64-phase6-kmc-20260801\\clean-d\\toolchain\\binutils-2.39\\bin\\mips64-elf-ld.exe"
$objcopy = "C:\\Users\\Joe\\.codex\\ob64-phase6-kmc-20260801\\clean-d\\toolchain\\binutils-2.39\\bin\\mips64-elf-objcopy.exe"
& $cc -quiet -O2 -meb -mips3 -mgp32 -mfp32 -G 0 -fno-PIC -mno-abicalls -fno-builtin -funsigned-char "C:\\Users\\Joe\\Projects\\OgreBattlel64\\OB64 Decomp\\src\\boot\\boot_state_slot_flagged_dispatch_lookup.c" -o "$focused\\func_00007688.compiler.s"
& $as -EB -mips3 -32 -o "$focused\\func_00007688.o" "$focused\\func_00007688.compiler.s"
& $ld -EB -m elf32ebmip --no-check-sections --build-id=none -T "$focused\\focused.ld" -o "$focused\\func_00007688.elf" "$focused\\func_00007688.o"
& $objcopy -O binary --only-section=.text "$focused\\func_00007688.elf" "$focused\\func_00007688.bin"
```

The focused comparison reports 224 candidate bytes, 224 reference bytes, zero
differences, and linked SHA-256 `4398E1D52DE73D83846A34DDB7A4A97EA669E8DA66DA321F98CFF91C0BF9BC31`.

## Failed path and protocol deviation

The first setup invocation exceeded the shell tool's 124-second timeout before
the verifier could report. The unchanged command passed on a 600-second retry.
This was a host-tool timeout, not product evidence or a semantic failure.

The target C source uses constrained inline assembly and register variables to
preserve exact `addu` encodings and delay-slot placement. This is a documented
source-level encoding control, not imported assembly implementation.

## Next action

The worker must leave all canonical changes uncommitted. The Director must
freeze the coherent result and route it for independent Critical review.
