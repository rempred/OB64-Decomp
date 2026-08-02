# Task log and reproduction procedure

## Terminal status

The correction is complete and review-pending. The selected C slice now builds through the authenticated multi-target Phase 8 path, while the Director still owns review and intake.

## Commands and results

| Sequence | Exact command or action | Result | Evidence |
|---|---|---|---|
| 1 | Read assignment and governing workflows. | PASS; worker scope and protected roots identified. | Prompt revision `r1`, `AGENTS.md`, `docs/Worker-workflow.md` |
| 2 | Record Git branch and HEAD for parent and canonical repositories. | PASS; parent HEAD differed from the assignment baseline. | `target-selection.md` |
| 3 | `node tools/verify_setup.js --phase5a-root "C:\\Users\\Joe\\Projects\\OB64-Decomp-Hijs-Integration\\docs\\external-intake\\phase5-boundary-segment-reconciliation-static-20260731"` | PASS; 21 setup checks passed, zero unknown coverage bytes, and canonical ROM identity matched. | External log `C:\\Users\\Joe\\.codex\\ob64-matching-c-wave1-20260802\\setup-baseline-r2.log`; SHA-256 `864413BFE2EB64EE0D3BCACDE68FC5DDFDE4CFC2E2A941692907BDCFAE1BC006`; report SHA-256 `B0E9FA404B81A92CA0EB23C75A3F1A534964AEB815771EE0D00CA5008F351F8D` |
| 4 | Extract `.word` values from the original target source into `pool-reference-rebuilt.bin`. | PASS; 42 words and 168 bytes. | External generator `C:\\Users\\Joe\\.codex\\ob64-matching-c-wave1-20260802\\build_pool_reference.js`; output SHA-256 `B5B9786B86B3BA207A56847F26694E126F19667DAB49498E93607F9C4939A0C9` |
| 5 | Compile the tracked candidate with KMC flags, assemble with `-EB -mips3 -32`, link at `0x8007AF3C`, and extract `.text`. | PASS; candidate length 168 bytes and byte comparison exact. | External files `candidate_tracked.s`, `candidate_tracked.o`, `candidate_tracked.elf`, `candidate_tracked.bin`; candidate binary SHA-256 equals the reference hash. |
| 6 | `mips64-elf-readelf.exe -Wr candidate_tracked.o` | PASS; 13 `.rel.text` entries and one `.rel.pdr` entry recorded. | External output `candidate_tracked-relocations.txt`; object SHA-256 `28FD79C70BBE67F11C7651C318D70E440EC48BEAAE1B986EED5F6A9FBB94548E` |
| 7 | `node tools/build_phase8_matching_c.js --output ... --phase7-output ... --compiler ... --splat-python ... --splat-split ... --asm-differ ...` | BLOCKED before target compilation because the accepted Phase 6 manifest is missing. | External log `C:\\Users\\Joe\\.codex\\ob64-matching-c-wave1-20260802\\blocked-standard-build.log`; SHA-256 `5D28878A044C318566EAA8FB9C1656155328B697F4334B730B62F700AE967A35` |
| 8 | Restore the exact manifest from integration commit b22815518f060425519c08df19b617af8b5099a7, then compare source and canonical bytes. | PASS; both files are 5883 bytes with SHA-256 98C8ACC06A8FBF40DADBD25AE20C2539E8765E14EA12895158C37CC413D06C26. | Canonical path docs/external-intake/phase6-kmc-reproduction-20260801/reproduction-manifest.json; source blob 2d4cddd4ee381da7e767a7f0580de1ab67573919 |
| 9 | Run the multi-target Phase 8 build and verification in fresh roots r2-a and r2-b. | PASS; both targets compile, link, verify, and preserve the exact canonical ROM and code-region identities. | External roots C:\Users\Joe\.codex\ob64-matching-c-wave1-20260802-r2-a and C:\Users\Joe\.codex\ob64-matching-c-wave1-20260802-r2-b; build report SHA-256 BECCF6CDCBFCDAFB68D93F140002D6E570F800C11BB3C0E9D548F5398734314D |
| 10 | Compare the two fresh Phase 8 roots with node tools/compare_phase8_reproducibility.js. | PASS; all identity fields match, including ROM, code region, ELF, map, layout, readelf, and object manifest. | Reproducibility report SHA-256 6A3CFA9646E116F91D293E617F9E7C3F2E789F7FA6B24DE886ED341591FD11A6 |
| 11 | Verify the accepted conventional Phase 7 output with node tools/verify_phase7_conventional.js. | PASS; the conventional full-ROM identity remains exact. | Accepted output C:\Users\Joe\.codex\ob64-phase8-matching-c-20260801\run-a\conventional; ROM SHA-256 571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A |
| 12 | Run the required setup verifier unchanged after integration. | PASS on the second run after the first shell observation timed out; 21 checks passed and canonical identities remained exact. | Setup report C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp\build\setup\verify-setup-report.json; report SHA-256 B0E9FA404B81A92CA0EB23C75A3F1A534964AEB815771EE0D00CA5008F351F8D |

## Exact local compile command

The following command reproduces the focused proof. It uses only the pinned KMC compiler and GNU binutils already present on the host.

```powershell
$root = "C:\Users\Joe\.codex\ob64-matching-c-wave1-20260802"
$cc = "C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe"
$as = "C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\binutils-2.39\bin\mips64-elf-as.exe"
$ld = "C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\binutils-2.39\bin\mips64-elf-ld.exe"
$objcopy = "C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\binutils-2.39\bin\mips64-elf-objcopy.exe"
& $cc -quiet -O2 -meb -mips3 -mgp32 -mfp32 -G 0 -fno-PIC -mno-abicalls -fno-builtin -funsigned-char "C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp\docs\matching-c\high-value-wave1-20260802\candidate\boot_resource_pool_acquire_release.c" -o "$root\candidate_tracked.s"
& $as -EB -mips3 -32 -o "$root\candidate_tracked.o" "$root\candidate_tracked.s"
& $ld -EB -m elf32ebmip --no-check-sections --build-id=none -T "$root\candidate_pool.ld" -o "$root\candidate_tracked.elf" "$root\candidate_tracked.o"
& $objcopy -O binary --only-section=.text "$root\candidate_tracked.elf" "$root\candidate_tracked.bin"
```

The linker script binds `resource_pool` to boot RAM `0x800A884C`, `func_00001330` to boot RAM `0x80070F30`, `func_000016C4` to boot RAM `0x800712C4`, and the target text to boot RAM `0x8007AF3C`.

## Blocker

The canonical Phase 7 and Phase 8 configurations require this exact file:

`docs/external-intake/phase6-kmc-reproduction-20260801/reproduction-manifest.json`

The file was restored byte-for-byte from the authorized integration commit b22815518f060425519c08df19b617af8b5099a7. The canonical copy and source blob both have SHA-256 98C8ACC06A8FBF40DADBD25AE20C2539E8765E14EA12895158C37CC413D06C26.

The correction uses only the authenticated manifest, canonical source, canonical assembly, and pinned local toolchain. No external C, assembly, configuration, comments, or documentation were copied.

## Next action

The Director must route the uncommitted correction diff and AAR for independent Critical review. The Director must not treat this worker result as an acceptance verdict.
