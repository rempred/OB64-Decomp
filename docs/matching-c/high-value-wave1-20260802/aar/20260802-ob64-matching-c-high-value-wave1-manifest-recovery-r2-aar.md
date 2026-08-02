# After-action report: matching C manifest recovery revision 2

## Outcome

The correction is complete and review-pending. The authenticated Phase 6 manifest is restored, and two matching-C targets reproduce the canonical ROM. This clears the r1 build blocker and proves the selected slice through fresh builds. The Director must route this report and the uncommitted canonical diff for independent Critical review. No acceptance verdict is issued.

## Mission and authority

This correction addressed the missing compiler-manifest blocker from revision 1. The correction used the ready revision-2 prompt and the repository workflows.

The authorized manifest source was one frozen integration blob. Its source commit was b22815518f060425519c08df19b617af8b5099a7. Its source blob was 2d4cddd4ee381da7e767a7f0580de1ab67573919.

The worker read only the authorized manifest file from the integration repository. The worker did not inspect the protected integration work root. The worker did not copy external C, assembly, configuration, comments, or documentation.

The parent research repository, editor repository, master ROM, savestates, and emulator remained read-only. The worker made no commit, push, publication, or acceptance decision.

## Corrected target slice

| Semantic owner | Game meaning | z64 ROM range | Linked boot RAM | Bytes | Result |
|---|---|---:|---:|---:|---|
| Existing matching-C target func_000E5938 | Existing selected high-value function | 0x000E5938..0x000E595C | 0x80198BB8 | 36 | Exact linked text preserved |
| boot_resource_pool_acquire_release, function func_0000B33C | Boot resource-pool acquisition and release | 0x0000B33C..0x0000B3E4 | 0x8007AF3C | 168 | Exact linked text produced from canonical C |

The new production source is src/boot/boot_resource_pool_acquire_release.c. Its SHA-256 is 9A176F6860CB0D5F3E3B4627B2DAC9D8C2AC8A3B5FEF956FA040BEF354C68F62.

The canonical manifest is docs/external-intake/phase6-kmc-reproduction-20260801/reproduction-manifest.json. It is 5883 bytes. Its SHA-256 is 98C8ACC06A8FBF40DADBD25AE20C2539E8765E14EA12895158C37CC413D06C26.

The source manifest and canonical manifest were compared byte-for-byte. Their sizes and hashes match exactly.

## Technical result

The canonical matching-C configuration now uses schema version 2. It declares both selected targets. It authenticates the Phase 6 manifest before compiler use.

The Phase 8 toolchain now supports multiple target rows. It compiles each target independently. It verifies object relocation contracts before link integration.

The pool target object contains 13 code relocations and one procedure-descriptor relocation. The linked target text has SHA-256 B5B9786B86B3BA207A56847F26694E126F19667DAB49498E93607F9C4939A0C9.

The pool target object text has SHA-256 22A134DAAC883CC9F33D2B7CBE82745E2DDCD284EBB8F1D1899B5F30ED6AABF9. The existing target linked text has SHA-256 26256054A9F77DAD786308548B96966D4E7A3385975A9E989CEE70DBF0268789.

The existing target remains owned by objects/c/func_000E5938.o. The new target is owned by objects/c/func_0000B33C.o. The verifier reports two matching-C owners and two original-assembly fallbacks.

The asm-differ checks report exact matches for both targets. The existing target comparison reports 9 rows. The pool target comparison reports 42 rows. Both reports have zero current differences.

## Verification commands and results

The following syntax checks passed.

~~~powershell
node --check tools/lib/phase8_matching_c.js
node --check tools/lib/phase7_conventional.js
node --check tools/build_phase8_matching_c.js
~~~

The following build command passed for each fresh output root. The output root was changed between r2-a and r2-b.

~~~powershell
node tools/build_phase8_matching_c.js --output "C:\Users\Joe\.codex\ob64-matching-c-wave1-20260802-r2-a" --phase7-output "C:\Users\Joe\.codex\ob64-phase8-matching-c-20260801\run-a\conventional" --compiler "C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe" --splat-python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --splat-split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ"
~~~

Both builds passed. Both builds produced the exact canonical ROM.

The verification command passed for each fresh output root.

~~~powershell
node tools/verify_phase8_matching_c.js --output "C:\Users\Joe\.codex\ob64-matching-c-wave1-20260802-r2-a" --compiler "C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe" --splat-python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --splat-split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ" --report "C:\Users\Joe\.codex\ob64-matching-c-wave1-20260802-r2-a\verification.json"
~~~

The reproducibility command passed.

~~~powershell
node tools/compare_phase8_reproducibility.js --left "C:\Users\Joe\.codex\ob64-matching-c-wave1-20260802-r2-a" --right "C:\Users\Joe\.codex\ob64-matching-c-wave1-20260802-r2-b" --report "C:\Users\Joe\.codex\ob64-matching-c-wave1-20260802-r2-a\reproducibility.json"
~~~

The accepted conventional output passed its independent verifier.

~~~powershell
node tools/verify_phase7_conventional.js --output "C:\Users\Joe\.codex\ob64-phase8-matching-c-20260801\run-a\conventional" --splat-python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --splat-split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ"
~~~

The required setup command passed on its second unchanged run.

~~~powershell
node tools/verify_setup.js --phase5a-root "C:\Users\Joe\Projects\OB64-Decomp-Hijs-Integration\docs\external-intake\phase5-boundary-segment-reconciliation-static-20260731"
~~~

The first setup observation timed out after 184 seconds. The second run passed after 293 seconds. The pass reported 21 checks, zero unknown coverage bytes, and 108 overlap bytes.

## Fresh-root identities

The two fresh roots have identical output identities.

| Artifact | Bytes | SHA-256 |
|---|---:|---|
| Phase 8 build report | 19008 | BECCF6CDCBFCDAFB68D93F140002D6E570F800C11BB3C0E9D548F5398734314D |
| Phase 8 verification report | 6613 | F8F8CC3BA73CB924BC88C8B58710DDF104C4645ADE9003A9E458B49F51879FBF |
| Phase 8 ELF | 44129764 | B6409636A96C3F0786FFE12E76CF6D822937C0DEF313307D6493744726E672B0 |
| Phase 8 map | 6999646 | 17CEDCDCB1D5E472430B823D033F2F8B04EAC2E0EF680F9C2902EAE44835C414 |
| Phase 8 ROM | 41943040 | 571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A |
| Phase 8 code region | Derived ROM region | 40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409 |
| Phase 8 layout | 4897192 | 7709B485F5D1F21162B16ECB7294DFFA161D302420E33CF0C84A73F2BCA174F2 |
| Phase 8 readelf output | 4618787 | 2204158CE59A3DCBD81946FB4E7FBB844EBBD9EC478EA71CDBF9B4C4507E6C5B |
| Phase 8 object manifest | 23999 | EA5D0D194E990E326C15360D5596AA217AB1F1D243E4C640054B2A50096CAE9E |

The reproducibility report is 5876 bytes. Its SHA-256 is 6A3CFA9646E116F91D293E617F9E7C3F2E789F7FA6B24DE886ED341591FD11A6.

The setup report is 7804 bytes. Its SHA-256 is B0E9FA404B81A92CA0EB23C75A3F1A534964AEB815771EE0D00CA5008F351F8D.

## Canonical changes

The correction changes the following canonical surfaces:

- Phase 8 matching-C configuration.
- Phase 8 matching-C build, verification, and reproducibility tools.
- Phase 7 ELF symbol metadata needed by relocation checks.
- The pool production C source.
- The authenticated Phase 6 manifest.
- The revision-1 task log and evidence index.
- This revision-2 AAR.

The revision-1 candidate source and derivation remain preserved. The revision-1 blocked AAR remains unchanged.

No generated build artifacts were added to the tracked canonical tree. The setup report is generated under the existing ignored build directory. Git status showed no generated artifact path among the task changes.

## Deviation and artifact handling

Several partial external build outputs were produced during correction. They were moved to these quarantine roots:

- C:\Users\Joe\.codex\ob64-matching-c-wave1-20260802-r2-failed-a
- C:\Users\Joe\.codex\ob64-matching-c-wave1-20260802-r2-failed-b
- C:\Users\Joe\.codex\ob64-matching-c-wave1-20260802-r2-failed-a2
- C:\Users\Joe\.codex\ob64-matching-c-wave1-20260802-r2-failed-a3
- C:\Users\Joe\.codex\ob64-matching-c-wave1-20260802-r2-failed-a4
- C:\Users\Joe\.codex\ob64-matching-c-wave1-20260802-r2-failed-a5

These outputs are derived artifacts from failed local attempts. They were not used as canonical inputs. The authorized fresh roots contain the passing outputs.

The first setup command observation timed out. The unchanged second command passed. The timeout was treated as an observation limit, not as a setup failure.

## Claim review state

| Claim | Evidence grade | Review state |
|---|---|---|
| The manifest is restored from the authorized frozen blob. | Verified | Pending independent Critical review |
| Both selected targets reproduce exact linked text. | Verified | Pending independent Critical review |
| The pool C source follows the observed control flow. | Supported | Pending independent Critical review |
| The full ROM and code region remain exact. | Verified | Pending independent Critical review |
| The two fresh roots are path-independent. | Verified | Pending independent Critical review |

The worker does not accept these claims. The Director must assign an independent Critical reviewer. The Director can then update canonical status after review.

## Follow-up

The Director must intake the uncommitted canonical changes. The Director must preserve the r1 blocked AAR. The Director must route this AAR with the exact fresh-root reports. The Director must record the reviewer verdict separately.
