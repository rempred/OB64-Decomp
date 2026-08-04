# Lane C batch 01 canonical promotion task log

Status is completed and review-pending. Three frozen Lane C owners now extend canonical `main` to twenty-three exact targets, and both combined roots passed. This matters because the accepted Phase 5B inputs and canonical ROM identity remain preserved. No action is required from Joe; the Director must route fresh Critical review.

## Assignment

- Task ID: `OB64-MC-C-B01-PROMOTION-20260803-R1`.
- Role: worker.
- Director thread: `019fc57a-ba80-7341-8b36-5e9680ebbbef` on host `local`.
- Inventory profile: `NORMAL`.
- Canonical repository: `C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp`.
- Lane C repository: `C:\Users\Joe\Projects\OB64-Decomp-Worktrees\lane-c`.
- External output root: `C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\promotion\lane-c-b01-r1`.

## Baseline

Baseline was recorded at `2026-08-03T21:42:57.3753023-04:00` before any promotion write or build.

- Parent branch: `main`.
- Parent HEAD: `a5abda45f012bc72a3075801efa15e2f00e2832d`.
- Required parent ancestor: `dd846bbdcf1ce9a9d1723125c5892a15b5ea84ad`, present.
- Parent status contained unrelated existing changes outside this assignment.
- Canonical branch: `main`.
- Canonical HEAD: `2ec7cddb7e7634566c0985fda6324b1ecb6fc2fb`.
- Canonical status: clean.
- Lane C branch: `matching-c/lane-c-b01`.
- Lane C HEAD: `2d3e1a60522c4e1dee5cbcf9582ea5f4a8bf4e86`.
- Lane C status: clean.
- Canonical Phase 8 target count: twenty.
- Lane C Phase 8 target count: ten.
- Canonical Phase 8 configuration SHA-256: `EDD763A657223516284ABCA5521F12A25742ACFA5CECC8DF1042AAC06B12685F`.
- Lane C Phase 8 configuration SHA-256: `2CDA1EFF94B607FFBF624DB559BC44703646C89FF89B9EEDC9D8C3D737A362E0`.
- The external output root was absent at baseline.
- The Director assignment grants this worker sole canonical writes for this promotion.

Existing parent changes are read-only and outside the canonical promotion surface. The prompt permits unrelated parent changes when the required ancestor remains present.

## Frozen Lane C inputs

| Symbol | C source | Source SHA-256 | Assembly fallback | Fallback SHA-256 |
|---|---|---|---|---|
| `func_000241f8` | `src/lib/list_insert_head_000241f8.c` | `99D1D827E64B1D382FECA26C984A4F3A72E66199E3E928AE7641B9FAD8C6A0BA` | `asm/original/rev0/lib/list_insert_head_000241f8.s` | `D3F7A9C28A521515FB02E146C9D99B669B660C8AC74EA2A3F788B6717AE788CF` |
| `func_0025CB60` | `src/lib/func_0025CB60.c` | `EFE8BA4486EC0386D67163331128AF4233CCDF39161825C4991BE259302A74F9` | `asm/original/rev0/lib/func_0025CB60.s` | `2C4D5D2C10A7085EFD1762763BF3F41EDE5490622DF3AC7832C779E8BA1B4897` |
| `func_0025EFC8` | `src/lib/func_0025EFC8.c` | `9528F35D2C4CCC7CA0FC573197F78DD19AB410DE21EBC76C5BA6811B5343E1F4` | `asm/original/rev0/lib/func_0025EFC8.s` | `FD9C692314F2A8E78B46BAC4C71925AD18C9EE04AFE8BE2D12AAE97F3654028A` |

Each canonical source path was absent at baseline. Each canonical assembly fallback matched the frozen Lane C hash.

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

1. Preserve the twenty canonical target records byte-for-byte.
2. Append the three frozen Lane C records in accepted order.
3. Copy only the three frozen C owners.
4. Audit unique symbols, rows, ranges, and paths.
5. Confirm all twenty-three source and fallback hashes.
6. Run two fresh combined Phase 7 and Phase 8 roots.
7. Compare Phase 7 and Phase 8 outputs for path independence.
8. Record artifacts, final paths, deviations, and the pending review state.

The principal risk is importing Lane C shared configuration. The preservation audit will compare canonical Phase 5B inputs to their start hashes.

## Running record

- Baseline checks passed.
- The canonical configuration now contains exactly twenty-three targets.
- The first twenty target records match canonical `HEAD` byte-for-byte.
- The three appended records match frozen Lane C records eight through ten byte-for-byte.
- The appended order is `func_000241f8`, `func_0025CB60`, then `func_0025EFC8`.
- All target symbols, rows, primary owners, ROM ranges, source paths, and fallback paths are unique.
- Pairwise interval analysis found no target overlap.
- All twenty-three C-source and assembly-fallback hashes match their contracts.
- Final promotion configuration SHA-256: `C1221A8FF12270BF20B96E94A159839066F0DCA83FB411BA0B73A7B133AB2513`.
- Run A Phase 7 build and verification passed.
- Run A Phase 8 build and verification passed for twenty-three targets.
- Run B Phase 7 build and verification passed.
- Run B Phase 8 build and verification passed for twenty-three targets.
- Phase 7 reproducibility passed with identical reports and outputs.
- Phase 8 reproducibility passed with identical reports and outputs.
- Both runs preserved full-ROM SHA-256 `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
- Both runs preserved code-region SHA-256 `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- All twenty-three asm-differ results report exact matches and zero current scores.
- Final Phase 5B input hashes match baseline.
- The initial combined patch appended the report draft to `evidence-index.md` and did not create the missing `aar/` directory.
- The path gate detected the missing report. The worker created the directory and re-applied the report content.
- The first final audit trimmed Git's leading status column and reported a false path mismatch.
- The corrected read-only parser passed the core identity audit.
- The record-status cross-check detected the appended report draft.
- The worker removed the duplicate draft and preserved the standalone report.
- Final canonical status contains only the seven assigned promotion paths.
- The staged index is empty.
- Tracked and new-file `git diff --check` checks produced no whitespace errors.
- Canonical `HEAD` remains the required start.
- Lane C remains clean at its frozen input.

The exact command ledger and output hashes are in `evidence-index.md`.

## Final worker status

Status is completed and review-pending. Lane C and every other lane remained read-only.

The result proves structural promotion and exact static build identity. It does not prove gameplay semantics or runtime behavior.

The worker does not issue an acceptance verdict. Fresh independent Critical review remains required.
