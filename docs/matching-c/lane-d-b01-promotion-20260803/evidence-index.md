# Lane D batch 01 promotion evidence index

Status is completed and review-pending. Four frozen Lane D owners now extend canonical `main` to nineteen exact matching-C targets. This creates one reproducible combined review subject while preserving accepted Phase 5B inputs. No action is required from Joe; the Director must freeze and route the result for fresh Critical review.

## Assignment and baseline

| Item | Identity or result |
|---|---|
| Task ID | `OB64-MC-D-B01-PROMOTION-20260803-R1` |
| Role | worker |
| Inventory profile | `NORMAL` |
| Parent branch and start | `main` at `1a39f0e30c43633beb32e0d14bd3ebdaeb44a0ef` |
| Required parent ancestor | `8f6e30b913403c455ca9357bd0a98d35b634588f`, present |
| Canonical path | `C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp` |
| Canonical branch and start | `main` at `76ab996e818c54e23e51a89ae5fd32e96fcd8794` |
| Canonical start status | clean |
| Lane D path | `C:\Users\Joe\Projects\OB64-Decomp-Worktrees\lane-d` |
| Lane D branch and frozen input | `matching-c/lane-d-b01` at `8811fae74ee17609de3f435e5cb3709d6df36c8d` |
| Lane D start status | clean |
| External output root | `C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\promotion\lane-d-b01-r1` |
| External output root at baseline | absent |

The parent baseline contained unrelated existing documentation and coordination changes. The assignment kept every parent path read-only.

```text
 M AGENTS.md
 M CLAUDE.md
 M TestingWorkFlow.MD
 M docs/Director-workflow.md
 M docs/OgreBattle-Platform.md
 M docs/bizhawk-emulator.md
 M docs/mips-decomp-workflow-plan.md
 M docs/modding-resources.md
 M docs/pending-tasks.md
 M docs/project64-live-watch-sop.md
 M docs/research-workflow.md
 M docs/scenario-load-live-trace.md
?? TestingWorkFlow-ARCHIVED.MD
?? docs/Director-workflow-ARCHIVED.md
?? docs/Plans/task-logs/ob64-matching-c-row585-phase5b-successor-intake-correction-20260803-r2.md
?? docs/Reviewer-workflow.md
?? docs/Worker-workflow.md
?? docs/research-workflow-ARCHIVED.md
```

## Accepted dependencies

Each assigned prerequisite report records an `Accepted` verdict.

- `C:\Users\Joe\Projects\OgreBattlel64\wiki\after-action-reports\20260803-ob64-matching-c-row585-phase5b-sol-cross-repository-independent-review.md`.
- `C:\Users\Joe\Projects\OgreBattlel64\wiki\after-action-reports\20260803-ob64-matching-c-lane-d-b01-func_0000d994-independent-review.md`.
- `C:\Users\Joe\Projects\OgreBattlel64\wiki\after-action-reports\20260803-ob64-matching-c-lane-d-b01-func_0002cd70-independent-review-r2.md`.
- `C:\Users\Joe\Projects\OgreBattlel64\wiki\after-action-reports\20260803-ob64-matching-c-lane-d-b01-func_0025dab0-independent-review.md`.

## Promotion scope

The canonical configuration now contains these nineteen targets in exact order:

```text
func_000E5938
func_0000B33C
func_00007688
func_0000BC8C
func_00269470
func_0026B360
func_0026B820
func_00003798
func_0000A1F8
func_0002CBCC
func_0025C8A4
func_00008564
func_00023970
func_0002CB80
func_0025CAF0
func_00025000
func_0000D994
func_0002CD70
func_0025DAB0
```

A raw-text record audit compared the working configuration with both frozen repositories.

- All fifteen canonical target bodies match canonical `HEAD` byte-for-byte.
- All four appended target bodies match frozen Lane D records eight through eleven byte-for-byte.
- The compiler contract matches canonical `HEAD` exactly.
- All nineteen symbols, owner rows, source paths, fallback paths, and exact ROM ranges are unique.
- Pairwise interval analysis found zero overlapping target ranges.
- All nineteen C-source and assembly-fallback hashes match their target contracts.

The final configuration SHA-256 is `0443605E350DA54EA1131DC693B66E630DB9C0B2B2DB13A6F66AE2127904940C`.

| Structural symbol | C source | C source SHA-256 | Original assembly fallback | Fallback SHA-256 | Row | z64 ROM range | Bytes |
|---|---|---|---|---|---:|---|---:|
| `func_00025000` | `src/lib/list_remove_node.c` | `9BEC4B5499AD27D3390AA0A5FEB1D8C4A929DD4FC3B558AA91CA3D7AB0A82C4A` | `asm/original/rev0/lib/list_remove_node.s` | `F53C50B7F051E63A47E69AED53933AE069A3DE1E32C0A3FD14DA2BCA67A1BC79` | 585 | `0x00025000..0x00025040` | 64 |
| `func_0000D994` | `src/boot/boot_decode_huffman_reset_state.c` | `6B73B27E16C2BDF308E5ABA9F3BD31F1086F6F2D54972EC832FA477CDAE1A70B` | `asm/original/rev0/boot/boot_decode_huffman_reset_state.s` | `EA2179878E82D0DE763C6D2934FAF5D451B210A99BE63A0C9CB3273700B16443` | 120 | `0x0000D994..0x0000D9B8` | 36 |
| `func_0002CD70` | `src/lib/memset_0002cd70.c` | `C4E12F941EA88D4C60C10C439751094EBEC385E973CB20C21B78469A45874AD2` | `asm/original/rev0/lib/memset_0002cd70.s` | `BC389CA20BB661B8EC2B7BCB9ABC2E3D278BD4AC7538413FE2B6E897EDE1656B` | 714 | `0x0002CD70..0x0002CDA0` | 48 |
| `func_0025DAB0` | `src/lib/func_0025DAB0.c` | `8B9125C080728BEBCE0981E15FC6E8044D5601B9543C2DD03FC90B86D94ECC47` | `asm/original/rev0/lib/func_0025DAB0.s` | `7242AAC379613791E041A0440ADCC2EA5105FC7F0E8EC0F11792C9D4B12AC97C` | 4593 | `0x0025DAB0..0x0025DB00` | 80 |

## Preserved canonical inputs

The final file hashes match canonical start and both Phase 7 accepted-input records.

| Canonical input | SHA-256 |
|---|---|
| `asm/original/rev0/manifest.json` | `EE6A81334FDCFC2867BC7AF63AD56624E08C6B92D992915A45B610B44D3FCF44` |
| `config/roms/us_rev0.json` | `5E9183D5DF1D87D83EEC70E7DCA4BE3F859059B85FF192B8E1317F38B60D0331` |
| `config/overlays/us_rev0.json` | `D4F1FB177822334EB748D6D62B342FB813D8825FEDD912057CF651EB616A5FB6` |
| `config/segments/rev0.yaml` | `0EE7443968414711C081D779E22B58F7291DA73518C7CF56285F9BD236B6AE07` |
| `config/splat/us_rev0.semantic.json` | `44938312F6967E94B527B8B878C01125A2589B1BD28B2DB7E9F06059E2843979` |
| `config/splat/us_rev0.overlay-linker-inputs.json` | `42183B3BC308AD7850B59DB988029639A74ECAEA5A120DAF7D2598055374F8A5` |
| `config/splat/us_rev0.yaml` | `4A06310B83005E8F6F2986A6CD00B51083F7D6F002F4A7E670B41CCF4D8FFE67` |
| `config/splat/splat64-0.34.0.lock.json` | `FF1669083684AD936B3679C2C8EC6EB4664045D78B88C24CDFAEEB0068B2EB87` |
| `config/splat/splat64-0.34.0.provenance.json` | `E7F0F6C06DEB58D3C899F39169DDCAD14C56B3CBC3E8EA546886C8A780BC2EFF` |
| `config/toolchain.json` | `5A93298ED635C5FC6458C9DC1BBEB45A3EDCA7C4683D6E329BCE838E942B30FD` |
| `docs/external-intake/phase6-kmc-reproduction-20260801/reproduction-manifest.json` | `98C8ACC06A8FBF40DADBD25AE20C2539E8765E14EA12895158C37CC413D06C26` |

No Phase 5B input file changed.

## Authenticated prerequisites

| Input | Path or identity | SHA-256 or revision |
|---|---|---|
| KMC compiler | `C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe` | `F3F1C99A322F5B3D8C108C2A44AF1D6D084DD27575C5D60BF0F0D33FFF34B1C6` |
| Splat Python | `C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe` | `4CCA2027319C08DCA5CC4B64C9BA415CC89205152202CB6805081277C43B610F` |
| Splat split script | `C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py` | `EED41D3C36AFA4A980A3B22BC76C371569696CADFEF925DBB63606BFB081544E` |
| Splat snapshot root | `C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source` | Contains the authenticated split script |
| asm-differ checkout | `C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ` | `093360aa31f90e67216ed1971c4087516cc7b940` |

## Exact command ledger

All commands ran from `C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp`.

### Fresh run A

```powershell
node tools/run_phase7_splat.js --output "C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\promotion\lane-d-b01-r1\run-a\splat" --python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --snapshot-root "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source"
node tools/build_phase7_conventional.js --output "C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\promotion\lane-d-b01-r1\run-a\phase7" --splat-output "C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\promotion\lane-d-b01-r1\run-a\splat" --splat-python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --splat-split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ"
node tools/verify_phase7_conventional.js --output "C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\promotion\lane-d-b01-r1\run-a\phase7" --splat-python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --splat-split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ" --report "C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\promotion\lane-d-b01-r1\run-a\phase7\verification.json"
node tools/build_phase8_matching_c.js --output "C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\promotion\lane-d-b01-r1\run-a\phase8" --phase7-output "C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\promotion\lane-d-b01-r1\run-a\phase7" --compiler "C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe" --splat-python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --splat-split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ"
node tools/verify_phase8_matching_c.js --output "C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\promotion\lane-d-b01-r1\run-a\phase8" --compiler "C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe" --splat-python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --splat-split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ" --report "C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\promotion\lane-d-b01-r1\run-a\phase8\verification.json"
```

### Fresh run B

Run B used the same five commands with `run-a` replaced by `run-b` in each output path.

### Reproducibility comparisons

```powershell
node tools/compare_phase7_reproducibility.js --left "C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\promotion\lane-d-b01-r1\run-a\phase7\build-report.json" --right "C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\promotion\lane-d-b01-r1\run-b\phase7\build-report.json" --report "C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\promotion\lane-d-b01-r1\run-a\phase7\reproducibility.json"
node tools/compare_phase8_reproducibility.js --left "C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\promotion\lane-d-b01-r1\run-a\phase8" --right "C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\promotion\lane-d-b01-r1\run-b\phase8" --report "C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\promotion\lane-d-b01-r1\run-a\phase8\reproducibility.json"
```

## Verification results

Both roots passed Splat execution, Phase 7 build, Phase 7 verification, Phase 8 build, and Phase 8 verification.

### Phase 7 outputs

Run A and Run B produced identical Phase 7 artifacts.

| Artifact | Bytes | SHA-256 |
|---|---:|---|
| `phase7.elf` | 44,129,632 | `D557B2719DDB4E462EE94222F7A7059F020A99B1332509A9B0BE5F7AB4BC75FD` |
| `phase7.map` | 6,997,991 | `C1DF1F93B8D11EFF470F637C69C5F1B6008CF96449091F4E5DED1DB120108EF1` |
| `phase7.us_rev0.z64` | 41,943,040 | `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A` |
| Phase 7 code region | — | `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409` |
| `layout.json` | 4,896,157 | `64002AC9A84AC695E516ED946FBCF90E073F884FE817C0092FECC9FEE7E9B990` |
| `build-report.json` | 7,455 | `DFF3D4DE0BBF88829CFECEC88161AA5443AC3F1B87C12314167491706FD29EE7` |
| `verification.json` | 2,423 | `7CCE232075BCF187789DE424E8DD76CD43186A5B6DE61905C92D771E8A11D89E` |

Each Phase 7 verification records 7,242 primary rows, 7,251 link slices, 19 overlay reservations, and 41,943,040 represented bytes.

### Phase 8 outputs

Run A and Run B produced identical Phase 8 artifacts.

| Artifact | Bytes | SHA-256 |
|---|---:|---|
| `phase8.elf` | 44,132,188 | `E4E36F94A8650C1E0A027AB3A415BAD9A2074F9B59F304E1DF68DABED66B6ED4` |
| `phase8.map` | 7,016,859 | `9238C62AA3B230D92B917471EF2CEA71311117F9194825E6E7D2A756ABB23EC0` |
| `phase8.us_rev0.z64` | 41,943,040 | `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A` |
| Phase 8 code region | — | `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409` |
| `layout.json` | 4,905,478 | `C9F7AB430ABAC5AB841B18567CC0682C0313894DD1C17EADF9442FA5F4FB8D8A` |
| `phase8.readelf.txt` | 4,623,598 | `A421B18AEE48BCCB4FA6D71425791444CF8463DE188A2A497A02A6067016238D` |
| `objects/manifest.json` | 29,824 | `6281A9BC9471DCEFC8FAA497874CA9CC6CF4AAC88E636627CCDC0305A97E1D4B` |
| `build-report.json` | 139,783 | `6309FD35AAD225D699BAC0AED780F42E2F5375945018C0B3725588D5E4D01811` |
| `verification.json` | 62,679 | `17FE1E2491CB6EF07F939A6356569436D39CC97457115C2AA79B845536594965` |

Each Phase 8 verification records nineteen matching-C owners and five distinct fallback objects.

Each verification preserves 7,242 primary rows, 7,251 link slices, 19 overlay reservations, and 41,943,040 represented bytes.

Both preservation records set `fullRomExact: true` and `originalAssemblyTargetsNotLinked: true`.

All nineteen asm-differ results set `exact: true` and `currentScore: 0`.

### Reproducibility outputs

| Comparison | Status | Reports identical | Compared report identity | Reproducibility report SHA-256 |
|---|---|---|---|---|
| Phase 7 | pass | true | `DFF3D4DE0BBF88829CFECEC88161AA5443AC3F1B87C12314167491706FD29EE7` | `EAACF0ECD60BACC7A04C815689F6BE896F036D5830B03EF210329244F326597D` |
| Phase 8 | pass | true | build `6309FD35AAD225D699BAC0AED780F42E2F5375945018C0B3725588D5E4D01811`; verification `17FE1E2491CB6EF07F939A6356569436D39CC97457115C2AA79B845536594965` | `6D42B1984C24335A574460F6117EF34A67620EE1285EC566E53A245D2D36E72B` |

## Final path inventory

Expected canonical changes are:

- `config/phase8/matching-c.json`.
- `src/lib/list_remove_node.c`.
- `src/boot/boot_decode_huffman_reset_state.c`.
- `src/lib/memset_0002cd70.c`.
- `src/lib/func_0025DAB0.c`.
- `docs/matching-c/lane-d-b01-promotion-20260803/task-log.md`.
- `docs/matching-c/lane-d-b01-promotion-20260803/evidence-index.md`.
- `docs/matching-c/lane-d-b01-promotion-20260803/aar/20260803-ob64-matching-c-lane-d-b01-promotion-aar.md`.

The final status audit contains only these eight paths.

The index contains no staged path. The result remains uncommitted.

Tracked `git diff --check` passed for the configuration change.

No-index `git diff --check` checks produced no whitespace errors for all seven new files.

## Claims and review state

| Claim | Evidence grade | Review status | Supporting artifacts |
|---|---|---|---|
| The four frozen Lane D owners were appended in frozen order. | `Verified` | pending | Raw target-record comparison and final configuration |
| The fifteen canonical records and Phase 5B inputs were preserved. | `Verified` | pending | Raw record comparison, final input hashes, and Phase 7 accepted inputs |
| All nineteen C sources and fallback paths match their contracts. | `Verified` | pending | Complete source and fallback SHA-256 audit |
| Two fresh combined Phase 7 and Phase 8 roots passed. | `Verified` | pending | Run A and Run B reports under the external output root |
| The result is path-independent. | `Verified` | pending | Phase 7 and Phase 8 reproducibility reports |
| The result proves gameplay semantics. | Not claimed | pending | Static matching proves build identity, not runtime behavior |

## Deviations and limits

No protocol deviation changed the mission, inputs, or evidence boundary.

The worker did not run the setup gate because this assignment required fresh combined Phase 7 and Phase 8 roots.

No branch, commit, worktree, push, publication, editor, emulator, RAM, controller input, network, or remote action occurred.

Lane D and every other lane remained read-only.

The worker does not issue an acceptance verdict. Fresh independent Critical review remains required.
