# Lane C batch 01 promotion evidence index

Status is completed and review-pending. Three frozen Lane C owners now extend canonical `main` to twenty-three exact matching-C targets. This creates the final reproducible combined review subject while preserving accepted Phase 5B inputs. No action is required from Joe; the Director must freeze and route fresh Critical review.

## Assignment and baseline

| Item | Identity or result |
|---|---|
| Task ID | `OB64-MC-C-B01-PROMOTION-20260803-R1` |
| Role | worker |
| Inventory profile | `NORMAL` |
| Parent branch and start | `main` at `a5abda45f012bc72a3075801efa15e2f00e2832d` |
| Required parent ancestor | `dd846bbdcf1ce9a9d1723125c5892a15b5ea84ad`, present |
| Canonical path | `C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp` |
| Canonical branch and start | `main` at `2ec7cddb7e7634566c0985fda6324b1ecb6fc2fb` |
| Canonical start status | clean |
| Lane C path | `C:\Users\Joe\Projects\OB64-Decomp-Worktrees\lane-c` |
| Lane C branch and frozen input | `matching-c/lane-c-b01` at `2d3e1a60522c4e1dee5cbcf9582ea5f4a8bf4e86` |
| Lane C start status | clean |
| External output root | `C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\promotion\lane-c-b01-r1` |
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

The assignment identified these accepted prerequisite reviews:

- `C:\Users\Joe\Projects\OgreBattlel64\wiki\after-action-reports\20260803-ob64-matching-c-lane-c-row565-phase5b-sol-independent-review.md`.
- `C:\Users\Joe\Projects\OgreBattlel64\wiki\after-action-reports\20260803-ob64-matching-c-lane-c-b01-func_0025cb60-independent-review.md`.
- `C:\Users\Joe\Projects\OgreBattlel64\wiki\after-action-reports\20260803-ob64-matching-c-lane-c-b01-func_0025efc8-independent-review-r2.md`.
- `C:\Users\Joe\Projects\OgreBattlel64\wiki\after-action-reports\20260803-ob64-matching-c-lane-a-b02-promotion-independent-review.md`.

## Promotion scope

The canonical configuration now contains these twenty-three targets in exact order:

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
func_00269798
func_000241f8
func_0025CB60
func_0025EFC8
```

A raw-text record audit compared the working configuration with both frozen repositories.

- All twenty canonical target bodies match canonical `HEAD` byte-for-byte.
- All three appended target bodies match frozen Lane C records eight through ten byte-for-byte.
- The compiler contract matches canonical `HEAD` exactly.
- All symbols, owner rows, primary owners, source paths, fallback paths, and exact ROM ranges are unique.
- Pairwise interval analysis found zero overlapping target ranges.
- All twenty-three C-source and assembly-fallback hashes match their target contracts.

The final configuration SHA-256 is `C1221A8FF12270BF20B96E94A159839066F0DCA83FB411BA0B73A7B133AB2513`.

| Structural symbol | C source | C source SHA-256 | Original assembly fallback | Fallback SHA-256 | Row | z64 ROM range | Bytes |
|---|---|---|---|---|---:|---|---:|
| `func_000241f8` | `src/lib/list_insert_head_000241f8.c` | `99D1D827E64B1D382FECA26C984A4F3A72E66199E3E928AE7641B9FAD8C6A0BA` | `asm/original/rev0/lib/list_insert_head_000241f8.s` | `D3F7A9C28A521515FB02E146C9D99B669B660C8AC74EA2A3F788B6717AE788CF` | 565 | `0x000241F8..0x00024250` | 88 |
| `func_0025CB60` | `src/lib/func_0025CB60.c` | `EFE8BA4486EC0386D67163331128AF4233CCDF39161825C4991BE259302A74F9` | `asm/original/rev0/lib/func_0025CB60.s` | `2C4D5D2C10A7085EFD1762763BF3F41EDE5490622DF3AC7832C779E8BA1B4897` | 4583 | `0x0025CB60..0x0025CBA8` | 72 |
| `func_0025EFC8` | `src/lib/func_0025EFC8.c` | `9528F35D2C4CCC7CA0FC573197F78DD19AB410DE21EBC76C5BA6811B5343E1F4` | `asm/original/rev0/lib/func_0025EFC8.s` | `FD9C692314F2A8E78B46BAC4C71925AD18C9EE04AFE8BE2D12AAE97F3654028A` | 4612 | `0x0025EFC8..0x0025F058` | 144 |

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
node tools/run_phase7_splat.js --output "C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\promotion\lane-c-b01-r1\run-a\splat" --python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --snapshot-root "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source"
node tools/build_phase7_conventional.js --output "C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\promotion\lane-c-b01-r1\run-a\phase7" --splat-output "C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\promotion\lane-c-b01-r1\run-a\splat" --splat-python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --splat-split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ"
node tools/verify_phase7_conventional.js --output "C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\promotion\lane-c-b01-r1\run-a\phase7" --splat-python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --splat-split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ" --report "C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\promotion\lane-c-b01-r1\run-a\phase7\verification.json"
node tools/build_phase8_matching_c.js --output "C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\promotion\lane-c-b01-r1\run-a\phase8" --phase7-output "C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\promotion\lane-c-b01-r1\run-a\phase7" --compiler "C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe" --splat-python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --splat-split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ"
node tools/verify_phase8_matching_c.js --output "C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\promotion\lane-c-b01-r1\run-a\phase8" --compiler "C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe" --splat-python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --splat-split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ" --report "C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\promotion\lane-c-b01-r1\run-a\phase8\verification.json"
```

### Fresh run B

Run B used the same five commands with `run-a` replaced by `run-b` in every output path.

### Reproducibility comparisons

```powershell
node tools/compare_phase7_reproducibility.js --left "C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\promotion\lane-c-b01-r1\run-a\phase7\build-report.json" --right "C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\promotion\lane-c-b01-r1\run-b\phase7\build-report.json" --report "C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\promotion\lane-c-b01-r1\run-a\phase7\reproducibility.json"
node tools/compare_phase8_reproducibility.js --left "C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\promotion\lane-c-b01-r1\run-a\phase8" --right "C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\promotion\lane-c-b01-r1\run-b\phase8" --report "C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\promotion\lane-c-b01-r1\run-a\phase8\reproducibility.json"
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
| `phase8.elf` | 44,132,444 | `A7ABB785D7E21D37CED2C72BF78991627C04F0F5634EDAA46D1C821DAE40A8EB` |
| `phase8.map` | 7,020,063 | `0C7B4FB7F561A6B3D1545C16E5AB93C02ABF68BF9EDF08E95BD61E712E417B6E` |
| `phase8.us_rev0.z64` | 41,943,040 | `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A` |
| Phase 8 code region | — | `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409` |
| `layout.json` | 4,907,388 | `D4EEE090A6797FEF229C68706FEB2A32C2450B079C91951F2627F095DF92B020` |
| `phase8.readelf.txt` | 4,624,120 | `BBB41AF2AF5BA21057026D1262E77152D905E1480566E41EF55B7D30BDDE021E` |
| `objects/manifest.json` | 31,016 | `85D479FF40B92918BC26915F35973D5B13C5653CA03688F77A21A6EF78F83EC1` |
| `build-report.json` | 158,292 | `1503EB1324A34682974962F0F43E59D94F3E938038264E864CED431436CFCE5A` |
| `verification.json` | 70,767 | `A28E12815A9C05C7B014A96F63F5FF70D3F0EC6101C9452E12C94354C4294AB1` |

Each Phase 8 verification records twenty-three matching-C owners and five distinct fallback objects.

Each verification preserves 7,242 primary rows, 7,251 link slices, 19 overlay reservations, and 41,943,040 represented bytes.

Both preservation records set `fullRomExact: true` and `originalAssemblyTargetsNotLinked: true`.

All twenty-three asm-differ results set `exact: true` and `currentScore: 0`.

### Reproducibility outputs

| Comparison | Status | Reports identical | Compared report identity | Reproducibility report SHA-256 |
|---|---|---|---|---|
| Phase 7 | pass | true | `DFF3D4DE0BBF88829CFECEC88161AA5443AC3F1B87C12314167491706FD29EE7` | `EAACF0ECD60BACC7A04C815689F6BE896F036D5830B03EF210329244F326597D` |
| Phase 8 | pass | true | build `1503EB1324A34682974962F0F43E59D94F3E938038264E864CED431436CFCE5A`; verification `A28E12815A9C05C7B014A96F63F5FF70D3F0EC6101C9452E12C94354C4294AB1` | `77B7B8250CDD481FB208B44EBC223AD576D5A094A46B1BCACD064508DA58F745` |

## Final path inventory

Final canonical changes are:

- `config/phase8/matching-c.json`.
- `src/lib/list_insert_head_000241f8.c`.
- `src/lib/func_0025CB60.c`.
- `src/lib/func_0025EFC8.c`.
- `docs/matching-c/lane-c-b01-promotion-20260803/task-log.md`.
- `docs/matching-c/lane-c-b01-promotion-20260803/evidence-index.md`.
- `docs/matching-c/lane-c-b01-promotion-20260803/aar/20260803-ob64-matching-c-lane-c-b01-promotion-aar.md`.

The final status audit contains only these seven paths.

The index contains no staged path. The result remains uncommitted.

Tracked `git diff --check` passed for the configuration change.

No-index `git diff --check` checks produced no whitespace errors for all six new files.

## Claims and review state

| Claim | Evidence grade | Review status | Supporting artifacts |
|---|---|---|---|
| The three frozen Lane C owners were appended in frozen order. | `Verified` | pending | Raw target-record comparison and final configuration |
| The twenty canonical records and Phase 5B inputs were preserved. | `Verified` | pending | Raw record comparison, final input hashes, and Phase 7 accepted inputs |
| All twenty-three C sources and fallback paths match their contracts. | `Verified` | pending | Complete source and fallback SHA-256 audit |
| Two fresh combined Phase 7 and Phase 8 roots passed. | `Verified` | pending | Run A and Run B reports under the external output root |
| The result is path-independent. | `Verified` | pending | Phase 7 and Phase 8 reproducibility reports |
| The result proves gameplay semantics. | Not claimed | pending | Static matching proves build identity, not runtime behavior |

## Deviations and limits

No protocol deviation changed the mission, inputs, or evidence boundary.

Run A and Run B paired commands executed concurrently against isolated output roots.

The initial combined patch appended the report draft to `evidence-index.md` and did not create the missing `aar/` directory.

The path gate detected the missing report. The worker created the directory and re-applied the report content.

The first final audit trimmed Git's leading status column and reported a false path mismatch.

The corrected read-only parser passed the core identity audit.

The record-status cross-check detected the appended report draft.

The worker removed the duplicate draft and preserved the standalone report.

The worker did not run the setup gate because this assignment required fresh combined Phase 7 and Phase 8 roots.

No branch, commit, worktree, push, publication, editor, emulator, RAM, controller input, network, or remote action occurred.

Lane C and every other lane remained read-only.

The worker does not issue an acceptance verdict. Fresh independent Critical review remains required.
