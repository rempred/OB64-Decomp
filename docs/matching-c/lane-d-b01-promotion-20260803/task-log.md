# Lane D batch 01 canonical promotion task log

Status is completed and review-pending. Four frozen Lane D owners now extend canonical `main` to nineteen exact targets, and both fresh combined roots passed. This matters because the accepted Phase 5B inputs and canonical ROM identity remain preserved. No action is required from Joe; the Director must route fresh Critical review.

## Assignment

- Task ID: `OB64-MC-D-B01-PROMOTION-20260803-R1`.
- Role: worker.
- Director thread: `019fc57a-ba80-7341-8b36-5e9680ebbbef` on host `local`.
- Inventory profile: `NORMAL`.
- Canonical repository: `C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp`.
- Lane D repository: `C:\Users\Joe\Projects\OB64-Decomp-Worktrees\lane-d`.
- External output root: `C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\promotion\lane-d-b01-r1`.

## Baseline

Baseline was recorded at `2026-08-03T19:20:29.6028863-04:00` before any promotion write or build.

- Parent branch: `main`.
- Parent HEAD: `1a39f0e30c43633beb32e0d14bd3ebdaeb44a0ef`.
- Required parent ancestor: `8f6e30b913403c455ca9357bd0a98d35b634588f`, present.
- Parent status contained unrelated existing changes outside this assignment.
- Canonical branch: `main`.
- Canonical HEAD: `76ab996e818c54e23e51a89ae5fd32e96fcd8794`.
- Canonical status: clean.
- Lane D branch: `matching-c/lane-d-b01`.
- Lane D HEAD: `8811fae74ee17609de3f435e5cb3709d6df36c8d`.
- Lane D status: clean.
- Canonical Phase 8 target count: fifteen.
- Lane D Phase 8 target count: eleven.
- Canonical Phase 8 configuration SHA-256: `4BA9398C154B4C14097F9500DF45EE9EE15EB0B588CE138A50D5F186DA50887F`.
- Lane D Phase 8 configuration SHA-256: `BDD977B42DFC8319B19C930F7F2A29260B599306DD23644F794C09A79AFC7F05`.
- The external output root was absent at baseline.
- The Director assignment grants this worker sole canonical writes for this promotion.

Existing parent changes are read-only and outside the canonical promotion surface. The prompt states that an unrelated parent commit is not a stop when the required ancestor remains present.

## Frozen Lane D inputs

| Symbol | C source | Source SHA-256 | Assembly fallback | Fallback SHA-256 |
|---|---|---|---|---|
| `func_00025000` | `src/lib/list_remove_node.c` | `9BEC4B5499AD27D3390AA0A5FEB1D8C4A929DD4FC3B558AA91CA3D7AB0A82C4A` | `asm/original/rev0/lib/list_remove_node.s` | `F53C50B7F051E63A47E69AED53933AE069A3DE1E32C0A3FD14DA2BCA67A1BC79` |
| `func_0000D994` | `src/boot/boot_decode_huffman_reset_state.c` | `6B73B27E16C2BDF308E5ABA9F3BD31F1086F6F2D54972EC832FA477CDAE1A70B` | `asm/original/rev0/boot/boot_decode_huffman_reset_state.s` | `EA2179878E82D0DE763C6D2934FAF5D451B210A99BE63A0C9CB3273700B16443` |
| `func_0002CD70` | `src/lib/memset_0002cd70.c` | `C4E12F941EA88D4C60C10C439751094EBEC385E973CB20C21B78469A45874AD2` | `asm/original/rev0/lib/memset_0002cd70.s` | `BC389CA20BB661B8EC2B7BCB9ABC2E3D278BD4AC7538413FE2B6E897EDE1656B` |
| `func_0025DAB0` | `src/lib/func_0025DAB0.c` | `8B9125C080728BEBCE0981E15FC6E8044D5601B9543C2DD03FC90B86D94ECC47` | `asm/original/rev0/lib/func_0025DAB0.s` | `7242AAC379613791E041A0440ADCC2EA5105FC7F0E8EC0F11792C9D4B12AC97C` |

Each canonical source path was absent at baseline. Each canonical assembly fallback matched the frozen Lane D hash.

## Preserved cumulative Phase 5B inputs

| Canonical input | Baseline SHA-256 |
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

## Authenticated prerequisites

| Input | Path or revision | SHA-256 |
|---|---|---|
| KMC compiler | `C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe` | `F3F1C99A322F5B3D8C108C2A44AF1D6D084DD27575C5D60BF0F0D33FFF34B1C6` |
| Splat Python | `C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe` | `4CCA2027319C08DCA5CC4B64C9BA415CC89205152202CB6805081277C43B610F` |
| Splat split script | `C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py` | `EED41D3C36AFA4A980A3B22BC76C371569696CADFEF925DBB63606BFB081544E` |
| asm-differ checkout | `093360aa31f90e67216ed1971c4087516cc7b940` | Git revision |

## Plan

1. Preserve the fifteen canonical target records byte-for-byte.
2. Append the four frozen Lane D records in accepted order.
3. Copy only the four frozen C owners.
4. Audit unique symbols, rows, ranges, and paths.
5. Confirm all nineteen source and fallback hashes.
6. Run two fresh combined Phase 7 and Phase 8 roots.
7. Compare Phase 7 and Phase 8 outputs for path independence.
8. Record artifacts, final paths, deviations, and the pending review state.

The principal risk is importing Lane D shared configuration. The preservation audit will compare canonical Phase 5B inputs to their start objects.

## Running record

- Baseline checks passed.
- The canonical configuration now contains exactly nineteen targets.
- The first fifteen target records match canonical `HEAD` exactly.
- The four appended records match frozen Lane D records eight through eleven exactly.
- The appended order is `func_00025000`, `func_0000D994`, `func_0002CD70`, then `func_0025DAB0`.
- All nineteen symbols, rows, ROM ranges, source paths, and fallback paths are unique.
- All nineteen C-source and assembly-fallback hashes match their contracts.
- Final promotion configuration SHA-256: `0443605E350DA54EA1131DC693B66E630DB9C0B2B2DB13A6F66AE2127904940C`.
- Run A Phase 7 build and verification passed.
- Run A Phase 8 build and verification passed for nineteen targets.
- Run B Phase 7 build and verification passed.
- Run B Phase 8 build and verification passed for nineteen targets.
- Phase 7 reproducibility passed with identical reports and outputs.
- Phase 8 reproducibility passed with identical reports and outputs.
- Both runs preserved full-ROM SHA-256 `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
- Both runs preserved code-region SHA-256 `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- All nineteen asm-differ results report exact matches and zero current scores.
- Final Phase 5B input hashes match baseline.
- Final canonical status contains only the eight assigned promotion paths.
- The staged index is empty.
- Tracked and new-file `git diff --check` checks produced no whitespace errors.
- Canonical `HEAD` remains the required start.
- Lane D remains clean at its frozen input.

The exact command ledger and output hashes are in `evidence-index.md`.

## Final worker status

Status is completed and review-pending. Lane D and every other lane remained read-only.

The result proves structural promotion and exact static build identity. It does not prove gameplay semantics or runtime behavior.

The worker does not issue an acceptance verdict. Fresh independent Critical review remains required.
