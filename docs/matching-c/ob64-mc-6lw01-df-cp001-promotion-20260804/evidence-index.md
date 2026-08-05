# Highway D-F checkpoint 001 promotion evidence index

Status is completed and review-pending. Six frozen accepted results now extend canonical `main` from 23 to 29 exact targets. This creates one reproducible promotion subject. No action is required from Joe; the Parent Director must freeze and route independent review.

## Assignment and baseline

| Item | Identity or result |
|---|---|
| Program ID | `OB64-MC-6LW01-20260803` |
| Task ID | `OB64-MC-6LW01-PROMO-DF-CP001-20260804-R1` |
| Role and surface | `worker`, `promotion` |
| Inventory profile | `NORMAL` |
| Canonical path | `C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp` |
| Canonical branch and start | `main` at `38e9348438cc0255f9bf44a159e42ba0eb5ec056` |
| Canonical start status | clean |
| Starting target count | 23 |
| Starting configuration SHA-256 | `C1221A8FF12270BF20B96E94A159839066F0DCA83FB411BA0B73A7B133AB2513` |
| External output root | `C:\Users\Joe\Projects\OgreBattlel64-External-Outputs\OB64-MC-6LW01-20260803\DF-CP001\promotion-r1` |
| External output at baseline | absent |

The assignment grants this worker the canonical promotion surface. No helper received write authority.

## Frozen checkpoint

| Item | Identity or result |
|---|---|
| Checkpoint | `OB64-MC-6LW01-DF-CP001` |
| Kind and state | `ROUTINE`, `frozen` |
| Manifest | `C:\Users\Joe\Projects\OgreBattlel64-Coordination-Worktrees\highway-df\docs\Plans\ob64-matching-c-six-lane-wave-20260803\checkpoints\OB64-MC-6LW01-DF-CP001-checkpoint-manifest.json` |
| Manifest SHA-256 | `74B48B267BE11A34B7AB142008A0A43A84CAB5F57017FAE931329E07DBE16D6C` |
| Accepted functions | 6 |
| Accepted bytes | 864 |
| Classifications | 4 `PURE_MATCHING_C`, 1 `JUSTIFIED_HYBRID`, 1 `ASSEMBLY_REQUIRED` |

Each accepted result exists as a Git commit tree. Each commit trailer matches the checkpoint function, lane, lease, and review commit.

## Promoted functions

| Symbol | Lane and ordinal | Accepted-result commit | Classification | Assembly-bearing | z64 ROM interval | Bytes |
|---|---|---|---|---|---|---:|
| `func_0002DE10` | D, 1 | `bf66282f1303d9e8e3ca1440948374169f8e1815` | `ASSEMBLY_REQUIRED` | true | `0x0002DE10..0x0002DE50` | 64 |
| `func_000238B0` | E, 2 | `c1f3ca9c8f7e53d8be9364686212a71a5bd4a6bc` | `JUSTIFIED_HYBRID` | true | `0x000238B0..0x00023908` | 88 |
| `func_001072B8` | F, 3 | `f61b07ed64c7b9a0213f8f503b91f0d4f08d3ce5` | `PURE_MATCHING_C` | false | `0x001072B8..0x0010738C` | 212 |
| `func_0000B030` | E, 5 | `2e3938517d0ea7ba1e0820d397f64fc6e7db705a` | `PURE_MATCHING_C` | false | `0x0000B030..0x0000B0B0` | 128 |
| `func_0011B344` | F, 6 | `c987fca07b3605819d96b777be65328cc773c19c` | `PURE_MATCHING_C` | false | `0x0011B344..0x0011B430` | 236 |
| `func_00007600` | E, 7 | `4aafcf831b992a81d07a573da95b678cbdff54bd` | `PURE_MATCHING_C` | false | `0x00007600..0x00007688` | 136 |

The promotion copies each function's target object and C owner from its accepted-result tree. It does not apply lane commit history.

## Source and fallback identity

| Symbol | C source | Source SHA-256 | Assembly fallback | Fallback SHA-256 |
|---|---|---|---|---|
| `func_0002DE10` | `src/lib/mod_s64_tail.c` | `F2E739927C71AB14E249F6A15A8791753BE52F0C23A957B25EABBBCB0AAC3B31` | `asm/original/rev0/lib/mod_s64_tail.s` | `7B72356E33147DB291CCE1B39F43F22F0E7061499478833BC04E29E33FC72E94` |
| `func_000238B0` | `src/lib/sprintf.c` | `A411AF229D47F10CF1E5F3AEA455665A0C17A39FEAB3CE0E06A03F02E6BCE997` | `asm/original/rev0/lib/sprintf.s` | `D000B21EFFC5065D59AA3410BE10C362CB2950EA7679D38287FF7C8204F37F68` |
| `func_001072B8` | `src/lib/func_001072B8.c` | `E981D005A2721AEF9EB1E5D49C09CC045E5139AC43A20F218309347B027C706D` | `asm/original/rev0/lib/func_001072B8.s` | `B83D25946DA913495993A3842E333E84589F5325EA8EB34BD8CF7E815D4A653A` |
| `func_0000B030` | `src/boot/boot_resource_lzss_load_entry.c` | `5201D5853F7D1C33A10003A1C4733ABBC376260274FE1060E28D928003168B82` | `asm/original/rev0/boot/boot_resource_lzss_load_entry.s` | `69A3216B70E4352A8593118AC43A85D9C5F2B2D8445A66D9264EFF27F24A7F77` |
| `func_0011B344` | `src/lib/func_0011B344.c` | `8C0AD970A2D4AC96F39859D480BC487415303AC06724E530B6334CD382A88E1B` | `asm/original/rev0/lib/func_0011B344.s` | `49D476B0505B845A4CD7535B0884AD3706C81C724BB73B8C69CE4FD1E658D49C` |
| `func_00007600` | `src/boot/boot_state_slot_target_peer_record_dispatch.c` | `1F785BF47CFA234F410EAA295889B36BE1F6694333C2CCDBD6EE0CC76F60C5F3` | `asm/original/rev0/boot/boot_state_slot_target_peer_record_dispatch.s` | `8D79AF5281F083E0EE4CE8FB75F5B42A60A9364D8E42BE08CCA9541B40A565EC` |

All twelve hashes match the accepted target contracts. Every fallback existed unchanged at the canonical baseline.

## Frozen assembly evidence

These fields are copied from the checkpoint manifest without reinterpretation.

### `func_0002DE10`

- Worker justification: "The sixteen-instruction target branches on live $a2, preserves each caller $ra through nonstandard $t5 save and restore around jal, copies $t1 or $a1 into $v1, and writes the return value in each jr delay slot. C language semantics do not directly control these register assignments or MIPS delay-slot ordering, while the frozen C wrapper emits the complete body with inline assembly."
- Worker evidence: `C:\Users\Joe\Projects\OB64-Decomp-Worktrees\lane-d\asm\original\rev0\lib\mod_s64_tail.s`.
- Worker evidence SHA-256: `7B72356E33147DB291CCE1B39F43F22F0E7061499478833BC04E29E33FC72E94`.
- Reviewer confirmation: "Confirmed: the frozen target preserves $ra through $t5 around jal calls and writes return values in jr delay slots. Those exact low-level behaviors require retained assembly."
- Reviewer evidence: `C:\Users\Joe\Projects\OgreBattlel64-Coordination-Worktrees\highway-df\docs\Plans\ob64-matching-c-six-lane-wave-20260803\evidence\OB64-MC-6LW01-DF-S01-001-LANE-D-FUNC-0002DE10-CLASSIFICATION-REVIEW-PROTOCOL-CORRECTION-R1-evidence.md`.
- Reviewer evidence SHA-256: `D09BC949EC39A4F25079348BDACD87B6AC150DC04407E588E85B485F0B49D27D`.

### `func_000238B0`

- Worker justification: "The minimal move macro emits the target addu instruction encodings."
- Worker evidence: `C:\Users\Joe\Projects\OgreBattlel64-Coordination-Worktrees\highway-df\docs\Plans\ob64-matching-c-six-lane-wave-20260803\reports\OB64-MC-6LW01-DF-S01-002-LANE-E-FUNC-000238B0-WORK-R1-aar.md`.
- Worker evidence SHA-256: `9E057E5F864EE4C558F8DF66DB008AA395E66A536D1EE7CC396F89025F0805C7`.
- Reviewer confirmation: "An independent no-macro build emitted or funct 0x25 at five move sites where the target requires addu funct 0x21; the surrounding function remains primarily C."
- Reviewer evidence: `C:\Users\Joe\Projects\OgreBattlel64-Coordination-Worktrees\highway-df\docs\Plans\ob64-matching-c-six-lane-wave-20260803\reports\OB64-MC-6LW01-DF-S01-002-LANE-E-FUNC-000238B0-REVIEW-R1-review-report.md`.
- Reviewer evidence SHA-256: `2098F1FA4C7071DAA24D2C513F13D31B8B3E597A529DE03D1F1EB88A9597FB84`.

The four `PURE_MATCHING_C` records remain `assemblyBearing: false`. Their checkpoint records contain no assembly-evidence array.

## Configuration union audit

- The final configuration contains exactly 29 targets.
- The first 23 target objects match canonical `HEAD` exactly.
- The compiler object matches canonical `HEAD` exactly.
- Each appended object matches its accepted-result tree.
- Symbols, rows, primary IDs, sections, sources, and fallbacks are unique.
- Pairwise interval analysis found zero overlapping target ranges.
- Final configuration SHA-256: `7AD3F59E5B2A9F9254B62727B14EE3189E783DA7D9FF2AB93F0813A17418D8E9`.

## Authenticated prerequisites

| Input | Identity | SHA-256 or revision |
|---|---|---|
| KMC compiler | `C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe` | `F3F1C99A322F5B3D8C108C2A44AF1D6D084DD27575C5D60BF0F0D33FFF34B1C6` |
| Splat Python | `C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe` | `4CCA2027319C08DCA5CC4B64C9BA415CC89205152202CB6805081277C43B610F` |
| Splat split script | `C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py` | `EED41D3C36AFA4A980A3B22BC76C371569696CADFEF925DBB63606BFB081544E` |
| asm-differ | accepted checkout | `093360aa31f90e67216ed1971c4087516cc7b940` |
| Node | `v24.13.1` | executable `E3BE0545990C90995D7BF3A7AF5D64AF1F2E0FC1BBD9B79C27F7ABC1E9676E50` |
| Python | `3.11.15` | executable hash above |

The Phase 7 report also records the five GNU MIPS tool hashes and the Windows host identity.

## Preserved conventional inputs

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

Both Phase 7 and Phase 8 reports contain these same accepted identities.

## Exact command ledger

All commands ran from `C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp`.

```powershell
node tools/run_phase7_splat.js --output "C:\Users\Joe\Projects\OgreBattlel64-External-Outputs\OB64-MC-6LW01-20260803\DF-CP001\promotion-r1\splat" --python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --snapshot-root "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source"
node tools/build_phase7_conventional.js --output "C:\Users\Joe\Projects\OgreBattlel64-External-Outputs\OB64-MC-6LW01-20260803\DF-CP001\promotion-r1\phase7" --splat-output "C:\Users\Joe\Projects\OgreBattlel64-External-Outputs\OB64-MC-6LW01-20260803\DF-CP001\promotion-r1\splat" --splat-python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --splat-split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ"
node tools/verify_phase7_conventional.js --output "C:\Users\Joe\Projects\OgreBattlel64-External-Outputs\OB64-MC-6LW01-20260803\DF-CP001\promotion-r1\phase7" --splat-python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --splat-split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ" --report "C:\Users\Joe\Projects\OgreBattlel64-External-Outputs\OB64-MC-6LW01-20260803\DF-CP001\promotion-r1\phase7\verification.json"
node tools/build_phase8_matching_c.js --output "C:\Users\Joe\Projects\OgreBattlel64-External-Outputs\OB64-MC-6LW01-20260803\DF-CP001\promotion-r1\phase8" --phase7-output "C:\Users\Joe\Projects\OgreBattlel64-External-Outputs\OB64-MC-6LW01-20260803\DF-CP001\promotion-r1\phase7" --compiler "C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe" --splat-python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --splat-split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ"
node tools/verify_phase8_matching_c.js --output "C:\Users\Joe\Projects\OgreBattlel64-External-Outputs\OB64-MC-6LW01-20260803\DF-CP001\promotion-r1\phase8" --compiler "C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe" --splat-python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --splat-split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ" --report "C:\Users\Joe\Projects\OgreBattlel64-External-Outputs\OB64-MC-6LW01-20260803\DF-CP001\promotion-r1\phase8\verification.json"
```

All five commands passed.

## Verification results

- Splat generated the 7,242-owner extraction.
- Phase 7 conventional build and verification passed.
- Phase 8 build and verification passed for 29 targets.
- Full-ROM SHA-256 remains `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
- Code-region SHA-256 remains `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- Phase 8 preserves 7,242 rows, 7,251 slices, and 19 overlay descriptors.
- Phase 8 records `fullRomExact: true`.
- Phase 8 records `originalAssemblyTargetsNotLinked: true`.
- All 29 asm-differ results report `exact: true` and `currentScore: 0`.

## Output artifacts

| Artifact | Bytes | SHA-256 |
|---|---:|---|
| `phase7/phase7.elf` | 44,129,632 | `D557B2719DDB4E462EE94222F7A7059F020A99B1332509A9B0BE5F7AB4BC75FD` |
| `phase7/phase7.map` | 6,997,991 | `C1DF1F93B8D11EFF470F637C69C5F1B6008CF96449091F4E5DED1DB120108EF1` |
| `phase7/phase7.us_rev0.z64` | 41,943,040 | `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A` |
| `phase7/layout.json` | 4,896,157 | `64002AC9A84AC695E516ED946FBCF90E073F884FE817C0092FECC9FEE7E9B990` |
| `phase7/build-report.json` | 7,455 | `DFF3D4DE0BBF88829CFECEC88161AA5443AC3F1B87C12314167491706FD29EE7` |
| `phase7/verification.json` | 2,423 | `7CCE232075BCF187789DE424E8DD76CD43186A5B6DE61905C92D771E8A11D89E` |
| `phase8/phase8.elf` | 44,132,720 | `820F868C6132E3B489FC12C9D55E6DEA032193142D91106BD4D2FFFD3618D577` |
| `phase8/phase8.map` | 7,024,890 | `EE655001E2BB01279854522831C51C48D464F4305D7F2BFC3B07ED24F2B4ECD1` |
| `phase8/phase8.us_rev0.z64` | 41,943,040 | `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A` |
| `phase8/layout.json` | 4,910,289 | `94CDD072FC5EF07E469B16D14E175E3AA440953526659E84A2BE0F0D9A58DE66` |
| `phase8/phase8.readelf.txt` | 4,624,677 | `74F02AA53FFD9D9B682A93D25A7787840433BBD5704F14059ECCFB6DF804057F` |
| `phase8/objects/manifest.json` | 33,310 | `161E671E4B706571D1ED3B445000DAF3D1B1DD321D792195080208C33BEAE12A` |
| `phase8/build-report.json` | 189,149 | `F2A0ADB4E0CF85D70EA309DF0F868D1D6050E26E1D4FCFE7CAB41EC255DAE155` |
| `phase8/verification.json` | 84,476 | `0417C3B8E086F2300C7A7DFF8437ED499A4F0EC77F5BC8FD349E742C15505869` |

Artifact paths are relative to the isolated external output root.

## Method failures and limits

The first patch wrapper received truncated configuration output. The second wrapper encountered PowerShell-to-Node quoting loss.

Neither failed wrapper changed a repository file. PowerShell JSON extraction then supplied the exact accepted records.

Static matching proves source integration, target bytes, placement, and full-ROM identity. It does not prove gameplay meaning or runtime behavior.

## Review state

The promotion evidence grade is `Verified` for structural integration and build identity. Review status remains `pending`.

The worker does not accept its own result. Fresh independent promotion review remains required.
