# Lane B batch 01 promotion evidence index

Status is completed and review-pending. Four frozen Lane B owners were appended to canonical `main`, creating fifteen exact matching-C targets. This matters because the combined result preserves the accepted Phase 5B inputs and full-ROM identity. No action is required from Joe; the Director must route this result for fresh Critical review.

## Assignment and baseline

| Item | Identity or result |
|---|---|
| Task ID | `OB64-MC-B-B01-PROMOTION-20260803-R1` |
| Role | worker |
| Inventory profile | `NORMAL` |
| Canonical path | `C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp` |
| Canonical branch and start | `main` at `715c3412c74c17caa9121e52fd888048a979fc47` |
| Canonical start status | clean |
| Lane B path | `C:\Users\Joe\Projects\OB64-Decomp-Worktrees\lane-b` |
| Lane B branch and frozen input | `matching-c/lane-b-b01` at `fe38378f89c57e78b7df3b8ba0a89fa2fe7e613c` |
| Lane B start status | clean |
| External output root | `C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\promotion\lane-b-b01-r1` |
| External output root at baseline | absent |

The canonical Phase 8 configuration had eleven targets at baseline. Lane B had eleven canonical targets followed by four frozen records.

## Promotion scope

The canonical configuration now contains these fifteen targets in exact order:

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
```

The eleven baseline target record bodies match canonical `main` byte-for-byte. The configuration diff contains only the four appended records.

| Symbol | C source | C source SHA-256 | Original assembly fallback | Fallback SHA-256 | Row | z64 ROM range | Bytes |
|---|---|---|---|---|---:|---|---:|
| `func_00008564` | `src/boot/boot_state_slot_payload_copy_free.c` | `9E47572E2E913AAA26245ED005CFF261B0C408798D5896F87DD0A5AE3D354CB8` | `asm/original/rev0/boot/boot_state_slot_payload_copy_free.s` | `6CA00F11ABD9A5C4143CA484803B5C6468353AD56499E29008DAE55FA0FE20E9` | 74 | `0x00008564..0x0000859C` | 56 |
| `func_00023970` | `src/lib/osCreateMesgQueue.c` | `9B60B141932209B60BD3B5218044A79550C91F99B8106A05E918408EBF03B34F` | `asm/original/rev0/lib/osCreateMesgQueue.s` | `B07EBA870ACDCD8C6EFC72CC07891650030E51635B8998A70A1BCE861237FC1E` | 554 | `0x00023970..0x000239A0` | 48 |
| `func_0002CB80` | `src/lib/hypotf.c` | `EAE34C8B3C30DA41BDC98C7BABC83F9ACDE73EB2AECAABAE0E16FEA9B67059AB` | `asm/original/rev0/lib/hypotf.s` | `B4D3DE77E9ADB7BDEDED631EEB7364FE01BA9F75BC0CA9A2113F400C636F83FE` | 709 | `0x0002CB80..0x0002CBC0` | 64 |
| `func_0025CAF0` | `src/lib/func_0025CAF0.c` | `5EB40F5A9509ADF0742D7528D95353EDBD48B55CF05D0354184CA421A0118DD1` | `asm/original/rev0/lib/func_0025CAF0.s` | `424D2696B2EC8B30B663CC86271AD1065D5E12922BA35BBB398DA228580E5018` | 4582 | `0x0025CAF0..0x0025CB60` | 112 |

The final configuration SHA-256 is `4BA9398C154B4C14097F9500DF45EE9EE15EB0B588CE138A50D5F186DA50887F`.

The source and fallback audit checked every one of the fifteen target records. All symbols, row indexes, ROM ranges, source paths, and fallback paths are unique.

## Preserved canonical inputs

The following accepted cumulative Phase 5B input hashes match canonical start objects and both Phase 7 reports.

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
| Splat snapshot root | `C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source` | split script contained within root |
| asm-differ checkout | `C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ` | `093360aa31f90e67216ed1971c4087516cc7b940` |

## Exact command ledger

All commands ran from `C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp`.

### Fresh run A

```powershell
node tools/run_phase7_splat.js --output "C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\promotion\lane-b-b01-r1\run-a\splat" --python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --snapshot-root "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source"
node tools/build_phase7_conventional.js --output "C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\promotion\lane-b-b01-r1\run-a\phase7" --splat-output "C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\promotion\lane-b-b01-r1\run-a\splat" --splat-python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --splat-split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ"
node tools/verify_phase7_conventional.js --output "C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\promotion\lane-b-b01-r1\run-a\phase7" --splat-python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --splat-split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ" --report "C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\promotion\lane-b-b01-r1\run-a\phase7\verification.json"
node tools/build_phase8_matching_c.js --output "C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\promotion\lane-b-b01-r1\run-a\phase8" --phase7-output "C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\promotion\lane-b-b01-r1\run-a\phase7" --compiler "C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe" --splat-python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --splat-split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ"
node tools/verify_phase8_matching_c.js --output "C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\promotion\lane-b-b01-r1\run-a\phase8" --compiler "C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe" --splat-python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --splat-split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ" --report "C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\promotion\lane-b-b01-r1\run-a\phase8\verification.json"
```

### Fresh run B

Run B used the same five commands with `run-a` replaced by `run-b` in every output path.

### Reproducibility comparisons

```powershell
node tools/compare_phase7_reproducibility.js --left "C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\promotion\lane-b-b01-r1\run-a\phase7\build-report.json" --right "C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\promotion\lane-b-b01-r1\run-b\phase7\build-report.json" --report "C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\promotion\lane-b-b01-r1\run-a\phase7\reproducibility.json"
node tools/compare_phase8_reproducibility.js --left "C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\promotion\lane-b-b01-r1\run-a\phase8" --right "C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\promotion\lane-b-b01-r1\run-b\phase8" --report "C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\promotion\lane-b-b01-r1\run-a\phase8\reproducibility.json"
```

## Verification results

Both runs passed Splat execution, conventional Phase 7 build, Phase 7 verification, matching-C Phase 8 build, and Phase 8 verification.

### Phase 7 outputs

Run A and run B produced identical artifacts.

| Artifact | Bytes | SHA-256 |
|---|---:|---|
| `phase7.elf` | 44,129,632 | `D557B2719DDB4E462EE94222F7A7059F020A99B1332509A9B0BE5F7AB4BC75FD` |
| `phase7.map` | 6,997,991 | `C1DF1F93B8D11EFF470F637C69C5F1B6008CF96449091F4E5DED1DB120108EF1` |
| `phase7.us_rev0.z64` | 41,943,040 | `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A` |
| Phase 7 code region | — | `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409` |
| `layout.json` | 4,896,157 | `64002AC9A84AC695E516ED946FBCF90E073F884FE817C0092FECC9FEE7E9B990` |
| `build-report.json` | — | `DFF3D4DE0BBF88829CFECEC88161AA5443AC3F1B87C12314167491706FD29EE7` |
| `verification.json` | — | `7CCE232075BCF187789DE424E8DD76CD43186A5B6DE61905C92D771E8A11D89E` |

The Phase 7 reports record 7,242 primary rows, 7,251 link slices, 19 overlay reservations, and 41,943,040 represented bytes.

### Phase 8 outputs

Run A and run B produced identical artifacts.

| Artifact | Bytes | SHA-256 |
|---|---:|---|
| `phase8.elf` | 44,131,788 | `2AA56A28D045D87459411B343C73C7EEB68902FB2273AAD38464241846357EAE` |
| `phase8.map` | 7,013,285 | `10D2386FEB0923EFE8C2DF4E97F4FFE0C956EAE3024D47F87677AC8018A344B8` |
| `phase8.us_rev0.z64` | 41,943,040 | `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A` |
| Phase 8 code region | — | `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409` |
| `layout.json` | 4,903,553 | `6A1A3A35C0962CF074EC690FD41880F1E4C656073DDDDC88FCBEDF1489182027` |
| `readelf.txt` | 4,622,874 | `B4A5D81B7139EDF906622121DC92062B1832F356C63B36F4F8B3BF782B1986FB` |
| `objects/manifest.json` | 28,632 | `74CBFC3BE95B37FE04815AB9E4F3EA3DBAF4816A27AD042AF1190C3FBFB08DEC` |
| `build-report.json` | — | `0385B07E8075B0896452C4E8F5B6C93B3884E500AA09C3B616115410209C248C` |
| `verification.json` | — | `70DB10D681F187F78DE64A436BBEF3BE276B5BD1066E49B37BDD34DAFA26563C` |

Both Phase 8 verifications report fifteen matching-C owners and five distinct original-assembly fallback objects. The target manifest audit matched all fifteen fallback paths.

Both Phase 8 verifications preserve 7,242 primary rows, 7,251 link slices, 19 overlay reservations, and 41,943,040 represented bytes.

Both reports record `fullRomExact: true` and `originalAssemblyTargetsNotLinked: true`. All fifteen asm-differ results report `exact: true` and `currentScore: 0`.

### Reproducibility outputs

| Comparison | Status | Reports identical | Report SHA-256 |
|---|---|---|---|
| Phase 7 | pass | true | `EAACF0ECD60BACC7A04C815689F6BE896F036D5830B03EF210329244F326597D` |
| Phase 8 | pass | true | `9295109C75F92589BA2CE48A9AC11691DBBCA791D376E59B0255EB62E9893472` |

## Final path inventory

Expected canonical changes are:

- `config/phase8/matching-c.json`
- `src/boot/boot_state_slot_payload_copy_free.c`
- `src/lib/osCreateMesgQueue.c`
- `src/lib/hypotf.c`
- `src/lib/func_0025CAF0.c`
- `docs/matching-c/lane-b-b01-promotion-20260803/task-log.md`
- `docs/matching-c/lane-b-b01-promotion-20260803/evidence-index.md`
- `docs/matching-c/lane-b-b01-promotion-20260803/aar/20260803-ob64-matching-c-lane-b-b01-promotion-aar.md`

The final status audit must contain only these paths. The final diff is uncommitted and unstaged. Lane B and all other lanes remain read-only.

## Claims and review state

| Claim | Evidence grade | Review status | Supporting artifacts |
|---|---|---|---|
| The four frozen Lane B owners were appended in frozen order. | `Verified` | pending | Final Phase 8 configuration and target-order audit |
| The eleven canonical records and accepted Phase 5B inputs were preserved. | `Verified` | pending | Byte-exact record-body comparison, Git object audit, Phase 7 accepted inputs |
| All fifteen C sources and fallback paths match their contracts. | `Verified` | pending | Source and fallback SHA-256 audit; Phase 8 accepted inputs |
| Two fresh combined Phase 7 and Phase 8 roots passed. | `Verified` | pending | Run A and run B build and verification reports |
| The result is path-independent. | `Verified` | pending | Phase 7 and Phase 8 reproducibility reports |
| The result proves gameplay semantics. | Not claimed | pending | Static matching proves build identity, not runtime behavior |

## Deviations and limits

No protocol deviation changed the mission, inputs, or acceptance boundary.

The worker did not run the setup gate because this assignment required fresh combined Phase 7 and Phase 8 roots.

No branch, commit, worktree, push, publication, editor, emulator, RAM, controller input, network, or remote action occurred.

The worker does not issue an acceptance verdict. Fresh independent Critical review remains required.
