# Lane A batch 02 promotion evidence index

Status is completed and review-pending. Frozen `func_00269798` now extends canonical `main` to twenty exact matching-C targets. This creates one reproducible combined review subject while preserving cumulative Phase 5B inputs. No action is required from Joe; the Director must freeze and route fresh Critical review.

## Assignment and baseline

| Item | Identity or result |
|---|---|
| Task ID | `OB64-MC-A-B02-PROMOTION-20260803-R1` |
| Role | worker |
| Inventory profile | `NORMAL` |
| Parent branch and start | `main` at `d954fd4338b37d646f6a11912c6d8e5b396213a0` |
| Required parent ancestor | `5b7ba821eb6cef36817ce84a2b642c83f9768fe2`, present |
| Canonical path | `C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp` |
| Canonical branch and start | `main` at `e5d5b84ecaff6888183b0d1e867e0834600e0409` |
| Canonical start status | clean |
| Lane A path | `C:\Users\Joe\Projects\OB64-Decomp-Worktrees\lane-a` |
| Lane A branch and frozen input | `matching-c/lane-a-b02` at `f6158ab9f1ab62779276c166c858c771f2dfe117` |
| Lane A start status | clean |
| External output root | `C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\promotion\lane-a-b02-r1` |
| External output root at baseline | absent |

Baseline was recorded at `2026-08-03T20:27:31.1877881-04:00`.

The parent baseline contained unrelated documentation and coordination changes. The assignment kept every parent path read-only.

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

The Director assignment grants this worker sole canonical writes for this promotion.

## Accepted dependency

The assigned prerequisite report records an `Accepted` verdict.

- `C:\Users\Joe\Projects\OgreBattlel64\wiki\after-action-reports\20260803-ob64-matching-c-lane-a-b02-func_00269798-independent-review.md`.

## Promotion scope

The canonical configuration now contains these twenty targets in exact order:

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
```

An in-memory raw-record audit compared the working configuration with both frozen repositories.

- All nineteen canonical target bodies match canonical `HEAD` byte-for-byte.
- The appended target body matches frozen Lane A target index eleven byte-for-byte.
- The compiler contract matches canonical `HEAD` byte-for-byte.
- All twenty symbols, owner rows, primary IDs, sources, fallbacks, and exact ranges are unique.
- Pairwise interval analysis found zero overlapping target ranges.
- All twenty C-source and assembly-fallback hashes match their target contracts.

The final configuration SHA-256 is `EDD763A657223516284ABCA5521F12A25742ACFA5CECC8DF1042AAC06B12685F`.

| Structural symbol | C source | C source SHA-256 | Original assembly fallback | Fallback SHA-256 | Row | z64 ROM range | Bytes |
|---|---|---|---|---|---:|---|---:|
| `func_000E5938` | `src/overlays/descriptor_02/func_000E5938.c` | `8663465B420CE2BCCE4085D552FD88DAD194041ECEEA7AA15EECA6BC7C698FB5` | `asm/original/rev0/lib/func_000E5938.s` | `56FF9576FAB7E66DA496E6BAEBCCAC6013004A69F04E6686337369E628B095DE` | 1972 | `0x000E5938..0x000E595C` | 36 |
| `func_0000B33C` | `src/boot/boot_resource_pool_acquire_release.c` | `9A176F6860CB0D5F3E3B4627B2DAC9D8C2AC8A3B5FEF956FA040BEF354C68F62` | `asm/original/rev0/boot/boot_resource_pool_acquire_release.s` | `52E6438AB303533F47BF54079AD3F95822B9904EC356CA4B31E156C85B84108C` | 105 | `0x0000B33C..0x0000B3E4` | 168 |
| `func_00007688` | `src/boot/boot_state_slot_flagged_dispatch_lookup.c` | `BDEDCC08040A6DB6D45303ACEA8AE652E3A261FB6B63D44064C72F534A81F5A5` | `asm/original/rev0/boot/boot_state_slot_flagged_dispatch_lookup.s` | `90B860B2C29E15957BB39D1E17DF7939C205CCC50E94A8F9FD215F36382E6DD2` | 67 | `0x00007688..0x00007768` | 224 |
| `func_0000BC8C` | `src/boot/boot_resource_record_resolve_load.c` | `1DD83FE80C651B037F67238CA6E6FF03C441469F869F1630F7316D0C89D73068` | `asm/original/rev0/boot/boot_resource_record_resolve_load.s` | `B77775732A4D474596FCEB6369CF286A784ED86AC2A1442B1D60B94BCC9DB04E` | 107 | `0x0000BC8C..0x0000BE98` | 524 |
| `func_00269470` | `src/overlays/descriptor_12/func_00269470.c` | `366C3F0D312711E71DB34900B7DBB2D75B59D4DCF36745EF2C80B397C60F40F2` | `asm/original/rev0/lib/func_00269470.s` | `8A11B4BE872A6ABABA1F9EE8FF5C3108CBD81B18C45A21653D3FBE49BAA2B7EB` | 4801 | `0x00269470..0x00269798` | 808 |
| `func_0026B360` | `src/overlays/descriptor_12/func_0026B360.c` | `A83A9A2FB003C77D861ECDA7897D0E28A93D5DCB9093E16291E35A6CD27F8DB8` | `asm/original/rev0/lib/func_0026B360.s` | `2DE06BCC819A1176A23E31A6F1FB7C7267702F99F3A7D52EB4757BCEF609AC73` | 4834 | `0x0026B360..0x0026B7E4` | 1156 |
| `func_0026B820` | `src/overlays/descriptor_12/func_0026B820.c` | `12D34159C5CA16BE3AB3FEA6E0CF3380B4CC217B0BFBB65D175F04F4535ED900` | `asm/original/rev0/lib/func_0026B820.s` | `C43334DEC069D6760B6A2D24E40FDB3C7F3518D63224BA8A021EEB9F8A84997D` | 4836 | `0x0026B820..0x0026BCCC` | 1196 |
| `func_00003798` | `src/boot/boot_resource_state_reset.c` | `33523A7202205B7AB2EDA9FF2154C4C6963BFBA405493089700D32669D6D3076` | `asm/original/rev0/boot/boot_resource_state_reset.s` | `5024C973F005D3297EFA12B011FD7DD09D886DE0970A7C40A0A21A20DBC20CFE` | 25 | `0x00003798..0x000037F8` | 96 |
| `func_0000A1F8` | `src/boot/boot_resource_node_recursive_payload_clear.c` | `D264B6D51EF37D25D8CFA196E701C26CA737EE3F14B31EB12085F191F7A00820` | `asm/original/rev0/boot/boot_resource_node_recursive_payload_clear.s` | `4BD0E4B4D0F03045CAA0223256EF3176D15F2CB1AC349016D602DCDD6D91AFFB` | 93 | `0x0000A1F8..0x0000A250` | 88 |
| `func_0002CBCC` | `src/lib/rand.c` | `A6D5880B7E6DB3198A720F2EBAE50F09151B5705AFD518A62CD3FA072CED1825` | `asm/original/rev0/lib/rand.s` | `6C7D402401BE543EC8341B3C1E8E9FCED766A2142D4CC5D2EF832DFD0867BC65` | 711 | `0x0002CBCC..0x0002CC00` | 52 |
| `func_0025C8A4` | `src/lib/func_0025C8A4.c` | `6880A637BE37232EF80FB14E1D97270333A2C889B14ADE7E533AB4B71268C70E` | `asm/original/rev0/lib/func_0025C8A4.s` | `4E480B32B4FCAAAD978BD68F3D35733B503AC412A4BF1BBDF82BFA69D76BD483` | 4579 | `0x0025C8A4..0x0025C8D0` | 44 |
| `func_00008564` | `src/boot/boot_state_slot_payload_copy_free.c` | `9E47572E2E913AAA26245ED005CFF261B0C408798D5896F87DD0A5AE3D354CB8` | `asm/original/rev0/boot/boot_state_slot_payload_copy_free.s` | `6CA00F11ABD9A5C4143CA484803B5C6468353AD56499E29008DAE55FA0FE20E9` | 74 | `0x00008564..0x0000859C` | 56 |
| `func_00023970` | `src/lib/osCreateMesgQueue.c` | `9B60B141932209B60BD3B5218044A79550C91F99B8106A05E918408EBF03B34F` | `asm/original/rev0/lib/osCreateMesgQueue.s` | `B07EBA870ACDCD8C6EFC72CC07891650030E51635B8998A70A1BCE861237FC1E` | 554 | `0x00023970..0x000239A0` | 48 |
| `func_0002CB80` | `src/lib/hypotf.c` | `EAE34C8B3C30DA41BDC98C7BABC83F9ACDE73EB2AECAABAE0E16FEA9B67059AB` | `asm/original/rev0/lib/hypotf.s` | `B4D3DE77E9ADB7BDEDED631EEB7364FE01BA9F75BC0CA9A2113F400C636F83FE` | 709 | `0x0002CB80..0x0002CBC0` | 64 |
| `func_0025CAF0` | `src/lib/func_0025CAF0.c` | `5EB40F5A9509ADF0742D7528D95353EDBD48B55CF05D0354184CA421A0118DD1` | `asm/original/rev0/lib/func_0025CAF0.s` | `424D2696B2EC8B30B663CC86271AD1065D5E12922BA35BBB398DA228580E5018` | 4582 | `0x0025CAF0..0x0025CB60` | 112 |
| `func_00025000` | `src/lib/list_remove_node.c` | `9BEC4B5499AD27D3390AA0A5FEB1D8C4A929DD4FC3B558AA91CA3D7AB0A82C4A` | `asm/original/rev0/lib/list_remove_node.s` | `F53C50B7F051E63A47E69AED53933AE069A3DE1E32C0A3FD14DA2BCA67A1BC79` | 585 | `0x00025000..0x00025040` | 64 |
| `func_0000D994` | `src/boot/boot_decode_huffman_reset_state.c` | `6B73B27E16C2BDF308E5ABA9F3BD31F1086F6F2D54972EC832FA477CDAE1A70B` | `asm/original/rev0/boot/boot_decode_huffman_reset_state.s` | `EA2179878E82D0DE763C6D2934FAF5D451B210A99BE63A0C9CB3273700B16443` | 120 | `0x0000D994..0x0000D9B8` | 36 |
| `func_0002CD70` | `src/lib/memset_0002cd70.c` | `C4E12F941EA88D4C60C10C439751094EBEC385E973CB20C21B78469A45874AD2` | `asm/original/rev0/lib/memset_0002cd70.s` | `BC389CA20BB661B8EC2B7BCB9ABC2E3D278BD4AC7538413FE2B6E897EDE1656B` | 714 | `0x0002CD70..0x0002CDA0` | 48 |
| `func_0025DAB0` | `src/lib/func_0025DAB0.c` | `8B9125C080728BEBCE0981E15FC6E8044D5601B9543C2DD03FC90B86D94ECC47` | `asm/original/rev0/lib/func_0025DAB0.s` | `7242AAC379613791E041A0440ADCC2EA5105FC7F0E8EC0F11792C9D4B12AC97C` | 4593 | `0x0025DAB0..0x0025DB00` | 80 |
| `func_00269798` | `src/lib/func_00269798.c` | `EF08FAFBC2CA323EC8031D93FA23D0A2B80363566EC5C41461822D6D08E9BD0E` | `asm/original/rev0/lib/func_00269798.s` | `8C7A0F1025428DA6739FB746F0CE832E27A36A200227FB879BF238DF56115120` | 4802 | `0x00269798..0x002697DC` | 68 |

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

No cumulative Phase 5B input file changed.

## Authenticated prerequisites

| Input | Path or identity | SHA-256 or revision |
|---|---|---|
| KMC compiler | `C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe` | `F3F1C99A322F5B3D8C108C2A44AF1D6D084DD27575C5D60BF0F0D33FFF34B1C6` |
| Splat Python | `C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe` | `4CCA2027319C08DCA5CC4B64C9BA415CC89205152202CB6805081277C43B610F` |
| Splat split script | `C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py` | `EED41D3C36AFA4A980A3B22BC76C371569696CADFEF925DBB63606BFB081544E` |
| Splat snapshot root | `C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source` | Authenticated by the split script and tracked provenance inputs |
| asm-differ checkout | `C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ` | `093360aa31f90e67216ed1971c4087516cc7b940` |
| Node runtime | accepted host runtime | `v24.13.1` |
| Python runtime | accepted Splat runtime | `3.11.15` |
| Windows PowerShell | accepted host runtime | `5.1.26100.8972` |

## Exact command ledger

All commands ran from `C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp`.

### Fresh run A

```powershell
node tools/run_phase7_splat.js --output "C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\promotion\lane-a-b02-r1\run-a\splat" --python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --snapshot-root "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source"
node tools/build_phase7_conventional.js --output "C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\promotion\lane-a-b02-r1\run-a\phase7" --splat-output "C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\promotion\lane-a-b02-r1\run-a\splat" --splat-python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --splat-split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ"
node tools/verify_phase7_conventional.js --output "C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\promotion\lane-a-b02-r1\run-a\phase7" --splat-python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --splat-split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ" --report "C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\promotion\lane-a-b02-r1\run-a\phase7\verification.json"
node tools/build_phase8_matching_c.js --output "C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\promotion\lane-a-b02-r1\run-a\phase8" --phase7-output "C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\promotion\lane-a-b02-r1\run-a\phase7" --compiler "C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe" --splat-python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --splat-split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ"
node tools/verify_phase8_matching_c.js --output "C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\promotion\lane-a-b02-r1\run-a\phase8" --compiler "C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe" --splat-python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --splat-split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ" --report "C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\promotion\lane-a-b02-r1\run-a\phase8\verification.json"
```

### Fresh run B

```powershell
node tools/run_phase7_splat.js --output "C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\promotion\lane-a-b02-r1\run-b\splat" --python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --snapshot-root "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source"
node tools/build_phase7_conventional.js --output "C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\promotion\lane-a-b02-r1\run-b\phase7" --splat-output "C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\promotion\lane-a-b02-r1\run-b\splat" --splat-python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --splat-split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ"
node tools/verify_phase7_conventional.js --output "C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\promotion\lane-a-b02-r1\run-b\phase7" --splat-python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --splat-split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ" --report "C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\promotion\lane-a-b02-r1\run-b\phase7\verification.json"
node tools/build_phase8_matching_c.js --output "C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\promotion\lane-a-b02-r1\run-b\phase8" --phase7-output "C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\promotion\lane-a-b02-r1\run-b\phase7" --compiler "C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe" --splat-python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --splat-split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ"
node tools/verify_phase8_matching_c.js --output "C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\promotion\lane-a-b02-r1\run-b\phase8" --compiler "C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe" --splat-python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --splat-split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ" --report "C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\promotion\lane-a-b02-r1\run-b\phase8\verification.json"
```

### Reproducibility comparisons

```powershell
node tools/compare_phase7_reproducibility.js --left "C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\promotion\lane-a-b02-r1\run-a\phase7\build-report.json" --right "C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\promotion\lane-a-b02-r1\run-b\phase7\build-report.json" --report "C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\promotion\lane-a-b02-r1\run-a\phase7\reproducibility.json"
node tools/compare_phase8_reproducibility.js --left "C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\promotion\lane-a-b02-r1\run-a\phase8" --right "C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\promotion\lane-a-b02-r1\run-b\phase8" --report "C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\promotion\lane-a-b02-r1\run-a\phase8\reproducibility.json"
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
| Phase 7 code region | - | `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409` |
| `layout.json` | 4,896,157 | `64002AC9A84AC695E516ED946FBCF90E073F884FE817C0092FECC9FEE7E9B990` |
| `objects/manifest.json` | 17,940 | `460AC658BD50909B1C070319A9C5DD1D48D2E8198DC05B80C3023829EA4E4A90` |
| `build-report.json` | 7,455 | `DFF3D4DE0BBF88829CFECEC88161AA5443AC3F1B87C12314167491706FD29EE7` |
| `verification.json` | 2,423 | `7CCE232075BCF187789DE424E8DD76CD43186A5B6DE61905C92D771E8A11D89E` |

Each Phase 7 verification records 7,242 primary rows, 7,251 link slices, 19 overlay reservations, and 41,943,040 represented bytes.

### Phase 8 outputs

Run A and Run B produced identical Phase 8 artifacts.

| Artifact | Bytes | SHA-256 |
|---|---:|---|
| `phase8.elf` | 44,132,244 | `25883C72E1B811CF93707128182CFE3E92CD540B7C95E0C25D93977A470673E9` |
| `phase8.map` | 7,017,658 | `A9EEF147F2713BAA14B6A557613B64510199EA1E66CC5190E16D179EB02C8450` |
| `phase8.us_rev0.z64` | 41,943,040 | `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A` |
| Phase 8 code region | - | `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409` |
| `layout.json` | 4,905,950 | `A5CC1D02292CCAB69EC5405603A2838813725416998525245E669BDD6870FEB6` |
| `phase8.readelf.txt` | 4,623,740 | `20BE0830B4A9B413A005F6A94BED064CC185FE2802FFE2A594E88402F93754A3` |
| `objects/manifest.json` | 30,122 | `C9A882AD5B5A10404344360D89F076BB80037637B0E3A98664CDF97A20539A68` |
| `build-report.json` | 145,501 | `A59EED590B624066DBDA531901D1CC9CB87165A11136527FFD726F82B9F4957B` |
| `verification.json` | 65,269 | `9D7918C6E91B014669ED9FD267A688560AC207427B54C169CA85B6FA4E398FAA` |

Each Phase 8 verification records twenty matching-C owners and five distinct fallback objects.

Each verification preserves 7,242 primary rows, 7,251 link slices, 19 overlay reservations, and 41,943,040 represented bytes.

Both preservation records set `fullRomExact: true` and `originalAssemblyTargetsNotLinked: true`.

All twenty asm-differ results set `exact: true` and `currentScore: 0`.

The promoted owner uses row 4802, section `.ob64.r4802`, and 68 linked bytes.

Its linked text SHA-256 is `595967A215671EFBC9CD91CD8420C25EFB4B54BCF82E6CF6C3092766095958F3`.

Its proof records 17 rows, maximum score 1,700, current score zero, and eight relocations.

### Reproducibility outputs

| Comparison | Status | Reports identical | Compared report identity | Reproducibility report SHA-256 |
|---|---|---|---|---|
| Phase 7 | pass | true | `DFF3D4DE0BBF88829CFECEC88161AA5443AC3F1B87C12314167491706FD29EE7` | `EAACF0ECD60BACC7A04C815689F6BE896F036D5830B03EF210329244F326597D` |
| Phase 8 | pass | true | build `A59EED590B624066DBDA531901D1CC9CB87165A11136527FFD726F82B9F4957B`; verification `9D7918C6E91B014669ED9FD267A688560AC207427B54C169CA85B6FA4E398FAA` | `CCA76AF680E2F0B62E8B9F2D4DF5EFACA9F387B01E16AD28A8335EC18B64CE50` |

## Final path inventory

Expected canonical changes are:

- `config/phase8/matching-c.json`.
- `src/lib/func_00269798.c`.
- `docs/matching-c/lane-a-b02-promotion-20260803/task-log.md`.
- `docs/matching-c/lane-a-b02-promotion-20260803/evidence-index.md`.
- `docs/matching-c/lane-a-b02-promotion-20260803/aar/20260803-ob64-matching-c-lane-a-b02-promotion-aar.md`.

The final status audit contains only these five paths.

The index contains no staged path. The result remains uncommitted.

Tracked `git diff --check` passed for the configuration change.

No-index `git diff --check` checks produced no whitespace errors for all four new files.

Canonical `HEAD` remains `e5d5b84ecaff6888183b0d1e867e0834600e0409`.

Lane A remains clean at `f6158ab9f1ab62779276c166c858c771f2dfe117`.

Parent `HEAD` advanced independently to `d330e558996e90c405f04fd4e5f5cfacb92e8227`. The required ancestor remains present.

## Claims and review state

| Claim | Evidence grade | Review status | Supporting artifacts |
|---|---|---|---|
| The frozen Lane A owner was appended without duplicate ownership. | `Verified` | pending | Raw target-record audit and final configuration |
| The nineteen canonical records and Phase 5B inputs were preserved. | `Verified` | pending | Raw record comparison, final input hashes, and Phase 7 accepted inputs |
| All twenty C sources and fallback paths match their contracts. | `Verified` | pending | Complete source and fallback SHA-256 audit |
| Two fresh combined Phase 7 and Phase 8 roots passed. | `Verified` | pending | Run A and Run B reports under the external output root |
| The result is path-independent. | `Verified` | pending | Phase 7 and Phase 8 reproducibility reports |
| The result proves gameplay semantics. | Not claimed | pending | Static matching proves build identity, not runtime behavior |

## Deviations and limits

One preflight query treated the authenticated Splat snapshot as a Git checkout. The query failed because the snapshot contains no Git metadata.

The normal gate authenticated Splat through the accepted split script and provenance inputs. Both fresh Splat executions passed.

One diagnostic query assumed the Phase 7 asm-differ object shape for Phase 8. It stopped before extracting data.

After inspecting the Phase 8 array shape, the corrected query passed for both roots. No production artifact changed.

The worker did not run the setup gate because this assignment required fresh combined Phase 7 and Phase 8 roots.

No branch, commit, worktree, push, publication, editor, emulator, RAM, controller input, network, or remote action occurred.

Lane A and every other lane remained read-only.

The worker does not issue an acceptance verdict. Fresh independent Critical review remains required.
