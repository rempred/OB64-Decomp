# Wave 6 independent-review task log

Status: completed with verdict `Accepted with corrections`.

The frozen matching-C result passes independent Critical review. The only remaining issue is a documentation count mismatch. The Director must correct five review records before propagation. No action is required from Joe.

## Assignment and identities

| Item | Recorded value |
|---|---|
| Review assignment | `ob64-decomp-matching-c-high-value-function-wave6-independent-review-20260802`, revision 1 |
| Director task | `019fba30-9100-72c3-bdd2-8758a7fab9c6` on `local` |
| Frozen canonical commit | `7d527a7ff8c3ad01ba00d586aee6ef7dba567d39` |
| Canonical repository | `C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp` |
| Canonical branch | `main` |
| Parent review-time HEAD | `6d5a31a122513dbf2b7e24f249cb5827f7e2c4aa`; read-only |
| Integration HEAD | `b22815518f060425519c08df19b617af8b5099a7`; read-only |
| Reviewer evidence root | `C:\Users\Joe\.codex\ob64-matching-c-wave6-review-20260802` |
| Reviewer report | `aar\20260802-ob64-matching-c-high-value-wave6-independent-review.md` |

The review directory was absent before intake. No other writer owned it. The frozen source and configuration remained unchanged.

## Review plan

The review used the smallest checks that could falsify the assigned claims.

1. Confirm the frozen commit and evidence package.
2. Inspect the changed source, configuration, and target assembly.
3. Recompute the target boundary and overlay placement.
4. Build the frozen result in two fresh external roots.
5. Verify all seven C owners and preservation counts.
6. Compare the two output roots for path independence.
7. Recompute target, ROM, code-region, and provenance identities.
8. Check clean-room and generated-artifact constraints.
9. Route one permitted verdict.

## Chronology

### Eligibility

The prompt status is `ready`. The frozen commit is exact and reachable. The worker AAR and correction AAR exist. The evidence index link resolves. The review surface was unclaimed.

The parent and integration repositories remained read-only. The protected Phase 5A `_work` root was not entered or enumerated.

### Static boundary and placement

The target assembly contains 299 contiguous `.word` entries. The range is `0x0026B820..0x0026BCCC`, which is 1,196 bytes. The final return is at `0x0026BCC4`. The restore delay slot is at `0x0026BCC8`. The successor begins at `0x0026BCCC`.

Descriptor 12 reports text range `0x8020A2E0..0x8021F450`. Semantic row `4836` reports the target ROM range and 1,196-byte size. The target link section is `.ob64.r4836`.

### Fresh build A

Command:

```text
node tools/build_phase8_matching_c.js --output "C:\Users\Joe\.codex\ob64-matching-c-wave6-review-20260802\run-a\conventional" --phase7-output "C:\Users\Joe\.codex\ob64-phase8-matching-c-20260801\run-a\conventional" --compiler "C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe" --splat-python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --splat-split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ"
```

Result: PASS. The output ROM SHA-256 is `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

The initial directory wrapper used an unsupported `New-Item -LiteralPath` parameter. The build tool still created the output and passed. The wrapper error did not alter the frozen repository.

### Fresh build B

Command:

```text
node tools/build_phase8_matching_c.js --output "C:\Users\Joe\.codex\ob64-matching-c-wave6-review-20260802\run-b\conventional" --phase7-output "C:\Users\Joe\.codex\ob64-phase8-matching-c-20260801\run-a\conventional" --compiler "C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe" --splat-python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --splat-split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ"
```

Result: PASS. The output ROM SHA-256 matches build A.

### Standalone verification

The reviewer ran `node tools/verify_phase8_matching_c.js` for both roots with the authenticated compiler, Splat, split script, asm-differ checkout, and report path `verification.json`.

Results: PASS for both roots. Seven matching-C owners are exact. The full-ROM hash and code-region hash match the canonical values.

### Reproducibility repair

The first comparison used reports named `reviewer-verification.json`. The comparison tool requires the literal filename `verification.json`. It failed with `ENOENT` before comparing outputs.

The reviewer reran both verifiers with the required filename. The comparison then passed.

Command:

```text
node tools/compare_phase8_reproducibility.js --left "C:\Users\Joe\.codex\ob64-matching-c-wave6-review-20260802\run-a\conventional" --right "C:\Users\Joe\.codex\ob64-matching-c-wave6-review-20260802\run-b\conventional" --report "C:\Users\Joe\.codex\ob64-matching-c-wave6-review-20260802\run-a\conventional\reviewer-reproducibility.json"
```

Result: PASS. The comparison report SHA-256 is `D99C32C68DA6D665793A36E3CDC3207088FF2857D529FE36D95F942BA73EAA48`.

### Direct linked-section extraction

The reviewer ran `mips64-elf-objdump.exe -h` on the fresh ELF. The `.ob64.r4836` section reports size `0x4AC`, VMA `0x80216C70`, and LMA `0x0026B820`.

The reviewer ran `mips64-elf-objcopy.exe --dump-section .ob64.r4836=review-target-r4836.bin`. The dump is 1,196 bytes. Its SHA-256 is `A88503EABEC9D4127CFBD75972F3F0465DC1A58B904DBDDE3B54BCFBA16B4E1A`.

Objcopy printed unrelated overlay allocation warnings. The requested section dump succeeded and matched the expected hash.

### Direct relocation extraction

The reviewer ran `mips64-elf-readelf.exe -r` on `objects/c/func_0026B820.o`.

The raw object reports 28 entries in the target text relocation section. It reports one `.rel.pdr` entry. The expected configuration list contains 29 entries total. Six text relocations target the owner section itself.

### Direct hash checks

The reviewer independently recomputed these identities:

| Artifact | SHA-256 |
|---|---|
| Matching-C configuration | `3FA55971AF36908D2CA0A44460F36BB9156DEF8DF71FA0630583B5AC2C01D07C` |
| KMC compiler | `F3F1C99A322F5B3D8C108C2A44AF1D6D084DD27575C5D60BF0F0D33FFF34B1C6` |
| Phase 6 compiler manifest | `98C8ACC06A8FBF40DADBD25AE20C2539E8765E14EA12895158C37CC413D06C26` |
| Setup report | `B0E9FA404B81A92CA0EB23C75A3F1A534964AEB815771EE0D00CA5008F351F8D` |
| Full ROM | `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A` |
| Code region | `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409` |

The reviewer also compared every frozen configuration target against the fresh verification report. Source hashes, placement, sizes, linked hashes, and relocation lists matched for all seven targets.

### Correction C1

The frozen records contain seven stale count statements across five Markdown files.

The target configuration and raw object show 28 text relocations plus one `.rel.pdr` relocation. The total is 29. The target-selection record says four same-owner relocations, but the exact list contains six.

This is a documentation-only coordination defect. It does not require source, configuration, build, or technical evidence reruns after correction.

## Final review state

Technical claims: accepted.

Documentation state: bounded correction required.

Permitted verdict: `Accepted with corrections`.

Required route: The Director updates the five records, searches for stale count text, and then propagates Wave 6.

