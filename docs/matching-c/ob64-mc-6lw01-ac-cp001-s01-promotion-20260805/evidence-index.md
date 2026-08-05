# Highway A-C checkpoint 001 S01 promotion evidence index

Status is completed and review-pending. Six frozen S01 results now extend canonical `main` from 28 to 34 exact targets. This creates the epoch-1 promotion subject. The Parent Director must freeze this result and route independent review.

## Assignment and baseline

| Item | Identity or result |
|---|---|
| Program ID | `OB64-MC-6LW01-20260803` |
| Task ID | `OB64-MC-6LW01-PROMO-AC-CP001-S01-20260805-R1` |
| Role and surface | `worker`, `promotion` |
| Inventory profile | `NORMAL` |
| Canonical path | `C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp` |
| Canonical branch and start | `main` at `0a637e4fb34b9f94fb073a06d16e1d9b777493b0` |
| Starting target count | 28 |
| Starting configuration SHA-256 | `E0D9023BFCA2CD9BE55DEAC6457561D168F1BCA9DE02702F607A4C2C1B6F70D6` |
| External output root | `C:\Users\Joe\Projects\OgreBattlel64-External-Outputs\OB64-MC-6LW01-20260803\AC-CP001-S01\promotion-r1` |
| External output at baseline | absent |

The assignment grants this worker the canonical promotion surface. No helper received write authority.

The baseline contained unrelated G-I CP003 records. Their four starting hashes are recorded in the task log.

## Frozen checkpoint

| Item | Identity or result |
|---|---|
| Checkpoint | `OB64-MC-6LW01-AC-CP001-S01` |
| Kind and state | `DRAIN_SUPERSESSION`, `frozen` |
| Manifest | `C:\Users\Joe\Projects\OgreBattlel64-Coordination-Worktrees\highway-ac\docs\Plans\ob64-matching-c-six-lane-wave-20260803\checkpoints\OB64-MC-6LW01-AC-CP001-S01-checkpoint-manifest.json` |
| Manifest SHA-256 | `F298D99C84859AA5F1605A283CE136AC8081DF6ACB55C8DDE150D1694750002B` |
| Route boundary | `C:\Users\Joe\Projects\OgreBattlel64\docs\Plans\ob64-matching-c-six-lane-wave-20260803\checkpoint-supersessions\OB64-MC-6LW01-AC-CP001-drain-supersession.json` |
| Route boundary SHA-256 | `C20C4EC7CFCBEA188D9FB5B95661E9BB22FB2450224E5ED9B5FF4ECB9993E0B4` |
| Intake receipt | `C:\Users\Joe\Projects\OgreBattlel64\docs\Plans\ob64-matching-c-six-lane-wave-20260803\checkpoint-intakes\OB64-MC-6LW01-AC-CP001-S01-received.json` |
| Intake receipt SHA-256 | `FC3584D0ABE3C049B76216F5EC14FA28B423218309AB74EFB332610645BDE569` |
| Accepted functions | 6 |
| Accepted bytes | 716 |
| Classifications | 1 `PURE_MATCHING_C`, 5 `JUSTIFIED_HYBRID` |

Each accepted result exists as a Git commit tree. Each commit trailer matches its function, lane, lease, and review commit.

## Promoted functions and addresses

All addresses below are z64 ROM intervals. They identify each promoted owner within the accepted ROM image.

| Semantic name | Game meaning | Address | Address space | Evidence role | Accepted-result commit | Classification | Bytes |
|---|---|---|---|---|---|---|---:|
| `func_0024DA10` | Unresolved library routine | `0x0024DA10..0x0024DA50` | z64 ROM interval | Promoted owner | `e162a10d222d699512ebd340cc82f96be34df969` | `JUSTIFIED_HYBRID` | 64 |
| `func_0015DF10` | Unresolved library routine | `0x0015DF10..0x0015DF68` | z64 ROM interval | Promoted owner | `9752a768ec68286d2c11d3e6f36b0f70db1d4757` | `JUSTIFIED_HYBRID` | 88 |
| `boot_resource_archive_load_one` | Loads one resource archive entry | `0x0000B29C..0x0000B33C` | z64 ROM interval | Promoted owner | `4908ccaedbb3a32236502e2b2412d965314822b0` | `JUSTIFIED_HYBRID` | 160 |
| `func_0024E490` | Unresolved library routine | `0x0024E490..0x0024E510` | z64 ROM interval | Promoted owner | `8f8cd3d1f4414cecbb2c5f2ec26d68f064824152` | `JUSTIFIED_HYBRID` | 128 |
| `boot_state_slot_queue_service_gate` | Gates state-slot queue servicing | `0x000071C8..0x00007200` | z64 ROM interval | Promoted owner | `e25fa943d74f6df26098c407b8e826975255f974` | `PURE_MATCHING_C` | 56 |
| `boot_resource_node_lzss_context_materialize` | Builds one resource decompression context | `0x00009EFC..0x00009FD8` | z64 ROM interval | Promoted owner | `d18dad4b522f070de8731759253e2a15ab0d92b3` | `JUSTIFIED_HYBRID` | 220 |

The promotion copies each function's target object and C owner from its accepted-result tree. It does not apply lane commit history.

## Source and fallback identity

| Symbol | C source | Source SHA-256 | Assembly fallback | Fallback SHA-256 |
|---|---|---|---|---|
| `func_0024DA10` | `src/lib/func_0024DA10.c` | `02484EAA4966E464B97550F22F23E417826167C0395BCF06DF136741C4A01448` | `asm/original/rev0/lib/func_0024DA10.s` | `39ABAB43300BC7BF76B2707C8B5CCE46E5F14BC210CBCE5F9713C04167770BB6` |
| `func_0015DF10` | `src/lib/func_0015DF10.c` | `C30F972AD367D92EF34CFA63A34F5921D7D3E19AF11B2B06234CCCD6279E9099` | `asm/original/rev0/lib/func_0015DF10.s` | `356457428A96747382CB2B4F0F46C832B278F03DA99EE2185C847C375ACE9B79` |
| `func_0000B29C` | `src/boot/boot_resource_archive_load_one.c` | `770B977268313E631C6551425FD084285C610F4ACBD875130F91D42034009D0C` | `asm/original/rev0/boot/boot_resource_archive_load_one.s` | `A118AA162446DDE6330A2ED466B7500FB590BE9CC627A625B5597B76BD96D2FF` |
| `func_0024E490` | `src/lib/func_0024E490.c` | `C6F5C1B00DC83C3B1BDF2226B0F2C094FFE7FEBEA1ADF3CE6DBE991607B9993F` | `asm/original/rev0/lib/func_0024E490.s` | `E7F5188857AAE09F052678DA2F4DFE4147AEA0B9C40CDE5D1C3FC1D391C6C374` |
| `func_000071C8` | `src/boot/boot_state_slot_queue_service_gate.c` | `E78F1AAF0805548A4883DE6782E5EECDC5C3EBF807E0812C3017C73B46E56DB1` | `asm/original/rev0/boot/boot_state_slot_queue_service_gate.s` | `544476389ADA9DFDBA7F52947C72F2FE09D7456917F12D5153E7B9E0D054B414` |
| `func_00009EFC` | `src/boot/boot_resource_node_lzss_context_materialize.c` | `46E7B84D3A344BCF23AECE92D2AC81684A43A0593CE72977383431871A19076C` | `asm/original/rev0/boot/boot_resource_node_lzss_context_materialize.s` | `1AD8EFEE9F07B8F458A5A50149F41CE977C0508C80B3714A1D7471D26E7BF28A` |

All twelve hashes match the accepted target contracts. Every fallback existed unchanged at the canonical baseline.

## Frozen assembly evidence

These fields are copied from the checkpoint manifest without reinterpretation.

### `func_0024DA10`

- Worker justification: "The pinned KMC backend emits move for both required general-register copies, and six maintainable pure-C forms retain those pseudos. The local macro is narrower than inline instruction bodies, build-tool rewriting, or a standalone assembly owner."
- Worker evidence: `C:\Users\Joe\Projects\OB64-Decomp-Worktrees\lane-a\docs\matching-c-records\OB64-MC-6LW01-LANE-A-ORD001-POLICY-CORRECTION-20260804-R1\classification-evidence.md`.
- Worker evidence SHA-256: `36DB7EE8D2A141877418D34BDC2E19A5D0201E6A8B1DDB6FB4461B1C6F7F432E`.
- Reviewer confirmation: "Independent review confirms that every tested pure-C form emits 0x00A08025 and 0x02002825, while the file-scope move macro emits required 0x00A08021 and 0x02002821 at owner offsets +0x08 and +0x2C."
- Reviewer evidence: `C:\Users\Joe\.codex\ob64-matching-c-20260804-lane-a-ord001-policy-correction-review-r1\hybrid-rerun\func_0024DA10.text.bin`.
- Reviewer evidence SHA-256: `5B0B9B3C72F7E46817FDB15E4CFB25C79625DD7842ABF906B96356B6E1BE00E3`.

### `func_0015DF10`

- Worker justification: "A direct R_MIPS_26 jump enters an internal call-and-epilogue tail without writing $ra, while preserving the active frame and saved return address."
- Worker evidence: `C:\Users\Joe\Projects\OB64-Decomp-Worktrees\lane-b\docs\matching-c-records\OB64-MC-6LW01-LANE-B-ORD002-PROVENANCE-CORRECTION-20260804-R1\evidence-index.md`.
- Worker evidence SHA-256: `173E65670A87A498CE1A6234F4587E53864E24BA4225365912378FCD6A6DA04E`.
- Reviewer confirmation: "The independent result is JUSTIFIED_HYBRID with assemblyBearing true. The retained assembly is necessary for the exact non-linking internal-tail transfer and zero-register encoding."
- Reviewer evidence: `C:\Users\Joe\Projects\OB64-Decomp-Worktrees\lane-b\docs\matching-c-records\OB64-MC-6LW01-LANE-B-ORD002-PROVENANCE-CORRECTION-REVIEW-20260804-R1\assembly-necessity-confirmation.md`.
- Reviewer evidence SHA-256: `B5D0AB3AFD8353E89526780532D618907A9AF4611AF4B3802DC7FF90C436FA3C`.

### `func_0000B29C`

- Worker justification: "The translation-unit-local move, li, and ori macros preserve original MIPS copy and immediate forms in branch and call delay slots. The pure-C probe differs at nine instruction words."
- Worker evidence: `C:\Users\Joe\Projects\OB64-Decomp-Worktrees\lane-c\docs\matching-c-records\OB64-MC-6LW01-LANE-C-ORD003-POLICY-CORRECTION-20260804-R1\classification-evidence.md`.
- Worker evidence SHA-256: `240BCECEF4E09406163E73404A2D4D88F66CD25B4F8DB3535142DE2BF0F4E6A0`.
- Reviewer confirmation: "Fresh pure-C compilation and linked comparison reproduce nine differences; each retained macro is minimal, bounded, and required for the exact target instruction forms."
- Reviewer evidence: `C:\Users\Joe\Projects\OB64-Decomp-Worktrees\lane-c\docs\matching-c-records\OB64-MC-6LW01-LANE-C-ORD003-POLICY-CORRECTION-REVIEW-20260804-R1\review-report.md`.
- Reviewer evidence SHA-256: `436534A83CFD47A0E86D6501B19AA88E084797328AFE8EDE766B3717A46C4EA4`.

### `func_0024E490`

- Worker justification: "The first helper call consumes a byte loaded into $v0 in its delay slot, and the target initializes $s2 and $s0 after saving them; the minimal inline block preserves that MIPS architectural handoff."
- Worker evidence: `C:\Users\Joe\Projects\OB64-Decomp-Worktrees\lane-a\docs\matching-c-records\OB64-MC-6LW01-LANE-A-ORD004-20260804-R1\evidence-index.md`.
- Worker evidence SHA-256: `9F0A269EF94C761B720961ED3CB3B0EC53A64A966CF2E9AF983837D850FCB9D5`.
- Reviewer confirmation: "Independent review confirms that the first helper call requires the loaded $v0 value for the andi $a2,$v0,0x00F0 delay-slot handoff, and that $s2/$s0 initialize after their saves before the call; this architectural scheduling requires inline assembly while the surrounding body remains C."
- Reviewer evidence: `C:\Users\Joe\Projects\OB64-Decomp-Worktrees\lane-a\docs\matching-c-records\OB64-MC-6LW01-LANE-A-ORD004-REVIEW-20260804-R1\evidence-index.md`.
- Reviewer evidence SHA-256: `00A0AB1486FC1942DEEA18327DE5A6F29FD4919A0F745792C8BF85BC94FE70E0`.

### `func_00009EFC`

- Worker justification: "Two function-local instruction-emitting inline-assembly blocks preserve the original call delay slots. The first emits the required argument load, call, and zero-register add. The second emits the required call and argument load."
- Worker evidence: `C:\Users\Joe\Projects\OB64-Decomp-Worktrees\lane-c\docs\matching-c-records\OB64-MC-6LW01-LANE-C-ORD006-20260804-R1\classification-evidence.md`.
- Worker evidence SHA-256: `755BD42793923466E33ACEE8B6B06879120ACEC26F1B0EB1D6E06B604FD19672`.
- Reviewer confirmation: "The first inline-assembly block is necessary because pure C emits a different zero-register instruction. The second block is redundant under the accepted compiler."
- Reviewer evidence: `C:\Users\Joe\Projects\OB64-Decomp-Worktrees\lane-c\docs\matching-c-records\OB64-MC-6LW01-LANE-C-ORD006-REVIEW-20260804-R1\review-report.md`.
- Reviewer evidence SHA-256: `E480BE8A0D4648FC36FBD56063830C9D688BD0159366332BFD00259441D31EC4`.

The accepted checkpoint retains both `func_00009EFC` inline blocks. This promotion preserves that reviewed result without new classification judgment.

The pure `func_000071C8` record remains `assemblyBearing: false`. Its checkpoint record contains no assembly evidence.

## Lifecycle receipts

| Symbol | Receipt | SHA-256 |
|---|---|---|
| `func_0024DA10` | `C:\Users\Joe\Projects\OgreBattlel64-Coordination-Worktrees\highway-ac\docs\Plans\ob64-matching-c-six-lane-wave-20260803\receipts\OB64-MC-6LW01-AC-S01-1-func_0024da10-lifecycle.json` | `F942E22D9F19587FCF4FB3BB5DD0F7291E638B152C09305B8BD5C17607931F0C` |
| `func_0015DF10` | `C:\Users\Joe\Projects\OgreBattlel64-Coordination-Worktrees\highway-ac\docs\Plans\ob64-matching-c-six-lane-wave-20260803\receipts\OB64-MC-6LW01-AC-S01-2-func_0015df10-lifecycle.json` | `D5C86E5B60CAE7EB8B78D72D787044C1482237611208F3E952CCB18CA44D88AD` |
| `func_0000B29C` | `C:\Users\Joe\Projects\OgreBattlel64-Coordination-Worktrees\highway-ac\docs\Plans\ob64-matching-c-six-lane-wave-20260803\receipts\OB64-MC-6LW01-AC-S01-3-func_0000b29c-lifecycle.json` | `5B20AECCA90F5D1502F81726A69B9964E611DC46F91A327A122622ADE256651A` |
| `func_0024E490` | `C:\Users\Joe\Projects\OgreBattlel64-Coordination-Worktrees\highway-ac\docs\Plans\ob64-matching-c-six-lane-wave-20260803\receipts\OB64-MC-6LW01-AC-S01-4-func_0024e490-lifecycle.json` | `0F20AD2B5E5457873F8B361EE33847408DD9EF649D8BCEB38869AE399EABDB2E` |
| `func_000071C8` | `C:\Users\Joe\Projects\OgreBattlel64-Coordination-Worktrees\highway-ac\docs\Plans\ob64-matching-c-six-lane-wave-20260803\receipts\OB64-MC-6LW01-AC-S01-5-func_000071c8-lifecycle.json` | `BCC12DD2AE515497433D2219E313580B64F378289811DF69028854DECD1D26A1` |
| `func_00009EFC` | `C:\Users\Joe\Projects\OgreBattlel64-Coordination-Worktrees\highway-ac\docs\Plans\ob64-matching-c-six-lane-wave-20260803\receipts\OB64-MC-6LW01-AC-S01-6-func_00009efc-lifecycle.json` | `54A242A33C56A9822A1A6FD1B3365F97F64E931DA0A8EBEAB1ABBF309243FC90` |

All six receipt hashes match the frozen checkpoint manifest.

## Configuration union audit

- The final configuration contains exactly 34 targets.
- The first 28 target objects match canonical `HEAD` exactly.
- The compiler object matches canonical `HEAD` exactly.
- Each appended object matches its accepted-result tree.
- Symbols, rows, primary IDs, sections, sources, and fallbacks are unique.
- Pairwise interval analysis found zero overlapping target ranges.
- Final configuration SHA-256: `88F544C2054DB6FD1AC048698619D7524B615CF43F940BB7B9F04415740D55C1`.

## Authenticated prerequisites

| Input | Identity | SHA-256 or revision |
|---|---|---|
| KMC compiler | `C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe` | `F3F1C99A322F5B3D8C108C2A44AF1D6D084DD27575C5D60BF0F0D33FFF34B1C6` |
| Splat Python | `C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe` | `4CCA2027319C08DCA5CC4B64C9BA415CC89205152202CB6805081277C43B610F` |
| Splat split script | `C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py` | `EED41D3C36AFA4A980A3B22BC76C371569696CADFEF925DBB63606BFB081544E` |
| asm-differ | accepted checkout | `093360aa31f90e67216ed1971c4087516cc7b940` |
| Node | `v24.13.1` | executable `E3BE0545990C90995D7BF3A7AF5D64AF1F2E0FC1BBD9B79C27F7ABC1E9676E50` |
| Python | `3.11.15` | executable hash above |

The Phase 7 report also records the five GNU MIPS tool hashes and Windows host identity.

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

Both build reports contain these accepted identities.

## Exact command ledger

All commands ran from `C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp`.

```powershell
node tools/run_phase7_splat.js --output "C:\Users\Joe\Projects\OgreBattlel64-External-Outputs\OB64-MC-6LW01-20260803\AC-CP001-S01\promotion-r1\splat" --python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --snapshot-root "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source"
node tools/build_phase7_conventional.js --output "C:\Users\Joe\Projects\OgreBattlel64-External-Outputs\OB64-MC-6LW01-20260803\AC-CP001-S01\promotion-r1\phase7" --splat-output "C:\Users\Joe\Projects\OgreBattlel64-External-Outputs\OB64-MC-6LW01-20260803\AC-CP001-S01\promotion-r1\splat" --splat-python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --splat-split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ"
node tools/verify_phase7_conventional.js --output "C:\Users\Joe\Projects\OgreBattlel64-External-Outputs\OB64-MC-6LW01-20260803\AC-CP001-S01\promotion-r1\phase7" --splat-python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --splat-split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ" --report "C:\Users\Joe\Projects\OgreBattlel64-External-Outputs\OB64-MC-6LW01-20260803\AC-CP001-S01\promotion-r1\phase7\verification.json"
node tools/build_phase8_matching_c.js --output "C:\Users\Joe\Projects\OgreBattlel64-External-Outputs\OB64-MC-6LW01-20260803\AC-CP001-S01\promotion-r1\phase8" --phase7-output "C:\Users\Joe\Projects\OgreBattlel64-External-Outputs\OB64-MC-6LW01-20260803\AC-CP001-S01\promotion-r1\phase7" --compiler "C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe" --splat-python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --splat-split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ"
node tools/verify_phase8_matching_c.js --output "C:\Users\Joe\Projects\OgreBattlel64-External-Outputs\OB64-MC-6LW01-20260803\AC-CP001-S01\promotion-r1\phase8" --compiler "C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe" --splat-python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --splat-split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ" --report "C:\Users\Joe\Projects\OgreBattlel64-External-Outputs\OB64-MC-6LW01-20260803\AC-CP001-S01\promotion-r1\phase8\verification.json"
```

All five commands passed.

## Verification results

- Splat generated the 7,242-owner extraction.
- Phase 7 conventional build and verification passed.
- Phase 8 build and verification passed for 34 targets.
- Full-ROM SHA-256 remains `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
- Code-region SHA-256 remains `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- Phase 8 preserves 7,242 rows, 7,251 slices, and 19 overlay descriptors.
- Phase 8 records `fullRomExact: true`.
- Phase 8 records `originalAssemblyTargetsNotLinked: true`.
- All 34 asm-differ results report `exact: true` and `currentScore: 0`.

## Promoted target verification

| Symbol | Section | Bytes | Linked text SHA-256 | Relocations | asm-differ score |
|---|---|---:|---|---:|---:|
| `func_0024DA10` | `.ob64.r4446` | 64 | `EEAB9F395C0ADBD6A6AD31DA286FFC25E5C6B86625309D4F310F5C7DD9EE05FE` | 3 | 0 |
| `func_0015DF10` | `.ob64.r2780` | 88 | `954ECB9684001E13C54B14C5CE9FA796DD63FAD70FB081CE2CF9AF728DF6D3EB` | 9 | 0 |
| `func_0000B29C` | `.ob64.r0104` | 160 | `4FBDE745E39A4573532493BFAE30681CCAFEC07E2A5491DD085203AEDE2FDCF3` | 8 | 0 |
| `func_0024E490` | `.ob64.r4456` | 128 | `B2E1A00BBE5256AB8E3AE20DFDBC3C89013A20E660076BD11EF961ACDAC90932` | 3 | 0 |
| `func_000071C8` | `.ob64.r0062` | 56 | `8444EEE2677F70A8CC14D77255D42C11ECAB65D6386D982D0310CA0AC92A4F8C` | 6 | 0 |
| `func_00009EFC` | `.ob64.r0089` | 220 | `0EC181DF69EEE883C0C0BC6963D1B1D5B62E21F2D05A1CC6C947819862C91BD6` | 20 | 0 |

Each linked owner is its generated C object. Every reported target is exact.

## Output artifacts

| Artifact | Bytes | SHA-256 |
|---|---:|---|
| `phase7/phase7.elf` | 44,129,632 | `D557B2719DDB4E462EE94222F7A7059F020A99B1332509A9B0BE5F7AB4BC75FD` |
| `phase7/phase7.map` | 6,997,991 | `C1DF1F93B8D11EFF470F637C69C5F1B6008CF96449091F4E5DED1DB120108EF1` |
| `phase7/phase7.us_rev0.z64` | 41,943,040 | `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A` |
| `phase7/layout.json` | 4,896,157 | `64002AC9A84AC695E516ED946FBCF90E073F884FE817C0092FECC9FEE7E9B990` |
| `phase7/build-report.json` | 7,455 | `DFF3D4DE0BBF88829CFECEC88161AA5443AC3F1B87C12314167491706FD29EE7` |
| `phase7/verification.json` | 2,423 | `7CCE232075BCF187789DE424E8DD76CD43186A5B6DE61905C92D771E8A11D89E` |
| `phase8/phase8.elf` | 44,133,476 | `D88126A024C2E2291DFB3404E7BF22671A52E3A559A0D3FDBC1C48D190F82E06` |
| `phase8/phase8.map` | 7,030,026 | `A1A8646F58043B7B73A583DD8ED6FEC205CC1379F4FD2988BA0DD3CA0D723B58` |
| `phase8/phase8.us_rev0.z64` | 41,943,040 | `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A` |
| `phase8/layout.json` | 4,912,792 | `5CA588BB23E98CB12322A3659F7BF80707F59CC7E65BBEA23E894FD728CE979A` |
| `phase8/phase8.readelf.txt` | 4,626,319 | `50EC9A6D291507751617D1A9A2CE516A332FCE4A21C589F5AE70EB9DBA531632` |
| `phase8/objects/manifest.json` | 35,306 | `491A9538A3118675F84166833E3D6744B2EA5FEEC1E4665BC65C720B110ABFE2` |
| `phase8/build-report.json` | 219,845 | `6681EEC0DB13908707AECD493D2EB87234245786D1EBD529284BBA82F0BD5AB1` |
| `phase8/verification.json` | 98,427 | `6E96F2E9B67CA91BB285298EBEFB7C88E7BFE6E79B7E5F22A554A34096827736` |

Artifact paths are relative to the isolated external output root.

## Method limits

Static matching proves source integration, target bytes, placement, and full-ROM identity. It does not prove gameplay meaning or runtime behavior.

## Review state

The promotion evidence grade is `Verified` for structural integration and build identity. Review status remains `pending`.

The worker does not accept its own result. Fresh independent promotion review remains required.
