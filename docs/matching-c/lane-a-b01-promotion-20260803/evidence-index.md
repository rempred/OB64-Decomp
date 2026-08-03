# Lane A batch 01 promotion evidence index

Status: completed for Director intake, with independent Critical review pending. The worker promoted the four frozen Lane A owners into canonical `main`, passed two fresh combined Phase 7 and Phase 8 runs, and preserved the canonical full-ROM and code-region identities. No action is required from Joe; the Director must route this result for fresh Critical review.

## Assignment and baseline

| Item | Identity or result |
|---|---|
| Task ID | `OB64-MC-A-B01-PROMOTION-20260803-R1` |
| Role | worker |
| Inventory profile | `NORMAL` |
| Canonical path | `C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp` |
| Canonical branch and starting HEAD | `main` at `c59603356f9b0e77f54ccb432a19d65cb572a279` |
| Canonical starting status | clean |
| Lane A path | `C:\Users\Joe\Projects\OB64-Decomp-Worktrees\lane-a` |
| Lane A branch and frozen HEAD | `matching-c/lane-a-b01` at `51171f6f1a10c190c8100248d9fd7734f36b2d94` |
| Lane A starting status | clean |
| Isolated output root | `C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\promotion\lane-a-b01-r1` |

The lane worktree remained read-only. The canonical worktree remains on `main` with uncommitted and unstaged promotion changes.

## Promotion scope

The canonical configuration was extended from seven to eleven targets. The first seven records remain unchanged and the four Lane A records were appended in frozen order.

| Structural symbol | C source | C source SHA-256 | Original assembly fallback | Fallback SHA-256 | Row | z64 ROM range | Bytes |
|---|---|---|---|---|---:|---|---:|
| `func_000E5938` | `src/overlays/descriptor_02/func_000E5938.c` | `8663465B420CE2BCCE4085D552FD88DAD194041ECEEA7AA15EECA6BC7C698FB5` | `asm/original/rev0/lib/func_000E5938.s` | `56FF9576FAB7E66DA496E6BAEBCCAC6013004A69F04E6686337369E628B095DE` | 1972 | `0x000E5938..0x000E595C` | 36 |
| `func_0000B33C` | `src/boot/boot_resource_pool_acquire_release.c` | `9A176F6860CB0D5F3E3B4627B2DAC9D8C2AC8A3B5FEF956FA040BEF354C68F62` | `asm/original/rev0/boot/boot_resource_pool_acquire_release.s` | `52E6438AB303533F47BF54079AD3F95822B9904EC356CA4B31E156C85B84108C` | 105 | `0x0000B33C..0x0000B3E4` | 168 |
| `func_00007688` | `src/boot/boot_state_slot_flagged_dispatch_lookup.c` | `BDEDCC08040A6DB6D45303ACEA8AE652E3A261FB6B63D44064C72F534A81F5A5` | `asm/original/rev0/boot/boot_state_slot_flagged_dispatch_lookup.s` | `90B860B2C29E15957BB39D1E17DF7939C205CCC50E94A8F9FD215F36382E6DD2` | 67 | `0x00007688..0x00007768` | 224 |
| `func_0000BC8C` | `src/boot/boot_resource_record_resolve_load.c` | `1DD83FE80C651B037F67238CA6E6FF03C441469F869F1630F7316D0C89D73068` | `asm/original/rev0/boot/boot_resource_record_resolve_load.s` | `B77775732A4D474596FCEB6369CF286A784ED86AC2A1442B1D60B94BCC9DB04E` | 107 | `0x0000BC8C..0x0000BE98` | 524 |
| `func_00269470` | `src/overlays/descriptor_12/func_00269470.c` | `366C3F0D312711E71DB34900B7DBB2D75B59D4DCF36745EF2C80B397C60F40F2` | `asm/original/rev0/lib/func_00269470.s` | `8A11B4BE872A6ABABA1F9EE8FF5C3108CBD81B18C45A21653D3FBE49BAA2B7EB` | 4801 | `0x00269470..0x00269798` | 808 |
| `func_0026B360` | `src/overlays/descriptor_12/func_0026B360.c` | `A83A9A2FB003C77D861ECDA7897D0E28A93D5DCB9093E16291E35A6CD27F8DB8` | `asm/original/rev0/lib/func_0026B360.s` | `2DE06BCC819A1176A23E31A6F1FB7C7267702F99F3A7D52EB4757BCEF609AC73` | 4834 | `0x0026B360..0x0026B7E4` | 1,156 |
| `func_0026B820` | `src/overlays/descriptor_12/func_0026B820.c` | `12D34159C5CA16BE3AB3FEA6E0CF3380B4CC217B0BFBB65D175F04F4535ED900` | `asm/original/rev0/lib/func_0026B820.s` | `C43334DEC069D6760B6A2D24E40FDB3C7F3518D63224BA8A021EEB9F8A84997D` | 4836 | `0x0026B820..0x0026BCCC` | 1,196 |
| `func_00003798` | `src/boot/boot_resource_state_reset.c` | `33523A7202205B7AB2EDA9FF2154C4C6963BFBA405493089700D32669D6D3076` | `asm/original/rev0/boot/boot_resource_state_reset.s` | `5024C973F005D3297EFA12B011FD7DD09D886DE0970A7C40A0A21A20DBC20CFE` | 25 | `0x00003798..0x000037F8` | 96 |
| `func_0000A1F8` | `src/boot/boot_resource_node_recursive_payload_clear.c` | `D264B6D51EF37D25D8CFA196E701C26CA737EE3F14B31EB12085F191F7A00820` | `asm/original/rev0/boot/boot_resource_node_recursive_payload_clear.s` | `4BD0E4B4D0F03045CAA0223256EF3176D15F2CB1AC349016D602DCDD6D91AFFB` | 93 | `0x0000A1F8..0x0000A250` | 88 |
| `func_0002CBCC` | `src/lib/rand.c` | `A6D5880B7E6DB3198A720F2EBAE50F09151B5705AFD518A62CD3FA072CED1825` | `asm/original/rev0/lib/rand.s` | `6C7D402401BE543EC8341B3C1E8E9FCED766A2142D4CC5D2EF832DFD0867BC65` | 711 | `0x0002CBCC..0x0002CC00` | 52 |
| `func_0025C8A4` | `src/lib/func_0025C8A4.c` | `6880A637BE37232EF80FB14E1D97270333A2C889B14ADE7E533AB4B71268C70E` | `asm/original/rev0/lib/func_0025C8A4.s` | `4E480B32B4FCAAAD978BD68F3D35733B503AC412A4BF1BBDF82BFA69D76BD483` | 4579 | `0x0025C8A4..0x0025C8D0` | 44 |

The Lane A matching-C configuration hash is `FF8E396A08341C31D28DF12EE9DF021A2A201477D63A68CF4E25B4F4442386F3`.

The canonical seven-target configuration hash before promotion was `3FA55971AF36908D2CA0A44460F36BB9156DEF8DF71FA0630583B5AC2C01D07C`.

The source hash audit found no duplicate symbol, row, or ROM range.

The fallback audit found all eleven expected assembly hashes unchanged.

## Preserved Phase 5B input

The Lane A branch carried separate older Phase 5B configuration edits. This promotion did not copy those files.

Canonical `main` retained the accepted cumulative row-565 Phase 5B correction and shared input.

The fresh Phase 7 build report records the preserved canonical input hashes:

| Canonical input | SHA-256 recorded by Phase 7 |
|---|---|
| `config/segments/rev0.yaml` | `0EE7443968414711C081D779E22B58F7291DA73518C7CF56285F9BD236B6AE07` |
| `config/splat/us_rev0.semantic.json` | `44938312F6967E94B527B8B878C01125A2589B1BD28B2DB7E9F06059E2843979` |
| `config/splat/us_rev0.overlay-linker-inputs.json` | `42183B3BC308AD7850B59DB988029639A74ECAEA5A120DAF7D2598055374F8A5` |
| `config/splat/us_rev0.yaml` | `4A06310B83005E8F6F2986A6CD00B51083F7D6F002F4A7E670B41CCF4D8FFE67` |

The canonical segment manifest still names Phase 5B row `565` as the accepted cumulative code owner.

The Lane A alternate Phase 5B hashes were not introduced into canonical `main`.

## Authenticated local prerequisites

| Input | Path or identity | SHA-256 or revision |
|---|---|---|
| KMC compiler | `C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe` | `F3F1C99A322F5B3D8C108C2A44AF1D6D084DD27575C5D60BF0F0D33FFF34B1C6` |
| Splat Python | `C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe` | `4CCA2027319C08DCA5CC4B64C9BA415CC89205152202CB6805081277C43B610F` |
| Splat split script | `C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py` | `EED41D3C36AFA4A980A3B22BC76C371569696CADFEF925DBB63606BFB081544E` |
| Splat snapshot root | `C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source` | split script contained within root |
| asm-differ checkout | `C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ` | `093360aa31f90e67216ed1971c4087516cc7b940` |
| Canonical ROM input | `build/baserom.us_rev0.z64` | `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A` |

## Exact command ledger

The commands below ran from `C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp`.

### Fresh run A

```powershell
node tools/run_phase7_splat.js --output "C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\promotion\lane-a-b01-r1\run-a\splat" --python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --snapshot-root "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source"
node tools/build_phase7_conventional.js --output "C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\promotion\lane-a-b01-r1\run-a\phase7" --splat-output "C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\promotion\lane-a-b01-r1\run-a\splat" --splat-python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --splat-split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ"
node tools/verify_phase7_conventional.js --output "C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\promotion\lane-a-b01-r1\run-a\phase7" --splat-python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --splat-split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ" --report "C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\promotion\lane-a-b01-r1\run-a\phase7\verification.json"
node tools/build_phase8_matching_c.js --output "C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\promotion\lane-a-b01-r1\run-a\phase8" --phase7-output "C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\promotion\lane-a-b01-r1\run-a\phase7" --compiler "C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe" --splat-python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --splat-split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ"
node tools/verify_phase8_matching_c.js --output "C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\promotion\lane-a-b01-r1\run-a\phase8" --compiler "C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe" --splat-python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --splat-split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ" --report "C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\promotion\lane-a-b01-r1\run-a\phase8\verification.json"
```

### Fresh run B

Run B used the same five commands with `run-a` replaced by `run-b` in every output path.

## Verification results

### Phase 7

Both Splat executions passed. Both conventional Phase 7 builds passed. Both Phase 7 verifications passed.

| Artifact | Both runs: bytes | Both runs: SHA-256 |
|---|---:|---|
| `phase7.elf` | 44,129,632 | `D557B2719DDB4E462EE94222F7A7059F020A99B1332509A9B0BE5F7AB4BC75FD` |
| `phase7.map` | 6,997,991 | `C1DF1F93B8D11EFF470F637C69C5F1B6008CF96449091F4E5DED1DB120108EF1` |
| `phase7.us_rev0.z64` | 41,943,040 | `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A` |
| Phase 7 code region | — | `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409` |
| `layout.json` | 4,896,157 | `64002AC9A84AC695E516ED946FBCF90E073F884FE817C0092FECC9FEE7E9B990` |

The Phase 7 build report SHA-256 is `DFF3D4DE0BBF88829CFECEC88161AA5443AC3F1B87C12314167491706FD29EE7` in both runs.

The Phase 7 verification report SHA-256 is `7CCE232075BCF187789DE424E8DD76CD43186A5B6DE61905C92D771E8A11D89E` in both runs.

### Phase 8

Both matching-C Phase 8 builds passed for all eleven targets. Both Phase 8 verifications passed.

The Phase 8 verification recorded 7,242 primary rows, 7,251 link slices, 19 overlay reservations, 11 matching-C owners, and five assembly fallback objects.

The preservation proof recorded `fullRomExact: true` and `originalAssemblyTargetsNotLinked: true`.

All eleven asm-differ proofs reported `exact: true` and `currentScore: 0`.

| Artifact | Both runs: bytes | Both runs: SHA-256 |
|---|---:|---|
| `phase8.elf` | 44,131,496 | `44A34DA16BA624ACEDFE701517D7B4E9DCCE3A8C70FD64FAA2F5B6C5679DF896` |
| `phase8.map` | 7,009,868 | `29AFAC020CEB0B1F8F17E4029DA90E23DF3D7A2ACCA7C05B9AD0A6FABF1328F8` |
| `phase8.us_rev0.z64` | 41,943,040 | `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A` |
| Phase 8 code region | — | `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409` |
| `layout.json` | 4,901,640 | `7655A59F2D72607D34526990DDAF23B451F61893777B4C7038976B0F375890D2` |
| `readelf.txt` | 4,622,315 | `ED8E3555672A76E18A576DC08A9F2DCD360818CC712BF0DB5323B2C4BD40E319` |
| `objects/manifest.json` | 27,440 | `F32C6C300AA776AA6DFF1BDE55EFCA2866D5F94C2104DB5B180AC9A7D6A0ADF1` |

The Phase 8 configuration hash recorded in both build reports is `FF8E396A08341C31D28DF12EE9DF021A2A201477D63A68CF4E25B4F4442386F3`.

The Phase 8 build report SHA-256 is `EC2DD5559D307A7C709DB26437031E3120B82BEF6A51FC3ACE2D0257F8A75BC1` in both runs.

The Phase 8 verification report SHA-256 is `5B3E7B29FAFEA07BF8075150D725BBF2FDF4BA78B7CA27295C61137ED1623C29` in both runs.

### Reproducibility

The exact comparison commands were:

```powershell
node tools/compare_phase7_reproducibility.js --left "C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\promotion\lane-a-b01-r1\run-a\phase7\build-report.json" --right "C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\promotion\lane-a-b01-r1\run-b\phase7\build-report.json" --report "C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\promotion\lane-a-b01-r1\run-a\phase7\reproducibility.json"
node tools/compare_phase8_reproducibility.js --left "C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\promotion\lane-a-b01-r1\run-a\phase8" --right "C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\promotion\lane-a-b01-r1\run-b\phase8" --report "C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\promotion\lane-a-b01-r1\run-a\phase8\reproducibility.json"
```

The Phase 7 comparison passed. Its report file is `run-a\phase7\reproducibility.json` with SHA-256 `EAACF0ECD60BACC7A04C815689F6BE896F036D5830B03EF210329244F326597D`.

The Phase 8 comparison passed. Its report file is `run-a\phase8\reproducibility.json` with SHA-256 `33E66FF90C71F7172CC8D2B5F6BA5836B3F9F926BA675D8831129DD103ACF58D`.

## Evidence interpretation

The exact target order and source hashes prove that the frozen Lane A batch was promoted without duplicate ownership or provenance loss.

The Phase 7 input hashes prove that the canonical cumulative row-565 Phase 5B profile remained the shared build input.

The Phase 8 object, linked-text, asm-differ, ROM, and code-region identities prove exact static replacement and preservation at the configured build scope.

The reports do not prove gameplay semantics or runtime behavior.

## Final scope audit

Expected canonical changes are:

- `config/phase8/matching-c.json`
- `src/boot/boot_resource_state_reset.c`
- `src/boot/boot_resource_node_recursive_payload_clear.c`
- `src/lib/rand.c`
- `src/lib/func_0025C8A4.c`
- `docs/matching-c/lane-a-b01-promotion-20260803/task-log.md`
- `docs/matching-c/lane-a-b01-promotion-20260803/evidence-index.md`
- `docs/matching-c/lane-a-b01-promotion-20260803/aar/20260803-ob64-matching-c-lane-a-b01-promotion-aar.md`

The final `git status --short --untracked-files=all` contained only the expected paths above.

The final `git diff --check` passed.

No file was staged. No commit, branch, worktree, push, or publication was created.

## Review state

Evidence grade: `Verified` for exact structural build identity and promotion provenance.

Review status: `pending`.

The worker does not issue an acceptance verdict. Fresh independent Critical review remains required.
