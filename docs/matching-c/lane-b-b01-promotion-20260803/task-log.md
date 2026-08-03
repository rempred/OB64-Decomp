# Lane B batch 01 canonical promotion task log

Status is completed and review-pending. The four-owner promotion and both fresh combined roots passed. This correction makes the finished result coherent for fresh Critical review. No action is required from Joe; the Director must freeze the result and route that review.

## Assignment

- Task ID: `OB64-MC-B-B01-PROMOTION-20260803-R1`
- Role: worker.
- Director thread: `019fc57a-ba80-7341-8b36-5e9680ebbbef` on host `local`.
- Canonical repository: `C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp`.
- Lane B repository: `C:\Users\Joe\Projects\OB64-Decomp-Worktrees\lane-b`.
- Required output root: `C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\promotion\lane-b-b01-r1`.

## Baseline

Baseline was recorded at `2026-08-03T17:33:29.1673962-04:00` before any promotion write or build.

- Canonical branch: `main`.
- Canonical HEAD: `715c3412c74c17caa9121e52fd888048a979fc47`.
- Canonical status: clean; `git status --short --branch` reported only `## main...origin/main [ahead 36]`.
- Lane B branch: `matching-c/lane-b-b01`.
- Lane B HEAD: `fe38378f89c57e78b7df3b8ba0a89fa2fe7e613c`.
- Lane B status: clean; `git status --short --branch` reported only `## matching-c/lane-b-b01`.
- Canonical Phase 8 target count: 11.
- Lane B Phase 8 target count: 11, with four additional frozen target records after the canonical eleven.
- Canonical Phase 8 configuration SHA-256: `FF8E396A08341C31D28DF12EE9DF021A2A201477D63A68CF4E25B4F4442386F3`.
- Lane B Phase 8 configuration SHA-256: `86F991234980B4DAF94DC09B7741BB01B8FDBFDBE82F8ED61FE26CAD488C6AB4`.
- Required external output root was absent at baseline.

The four Lane B C-owner hashes are:

| Symbol | Source | SHA-256 |
|---|---|---|
| `func_00008564` | `src/boot/boot_state_slot_payload_copy_free.c` | `9E47572E2E913AAA26245ED005CFF261B0C408798D5896F87DD0A5AE3D354CB8` |
| `func_00023970` | `src/lib/osCreateMesgQueue.c` | `9B60B141932209B60BD3B5218044A79550C91F99B8106A05E918408EBF03B34F` |
| `func_0002CB80` | `src/lib/hypotf.c` | `EAE34C8B3C30DA41BDC98C7BABC83F9ACDE73EB2AECAABAE0E16FEA9B67059AB` |
| `func_0025CAF0` | `src/lib/func_0025CAF0.c` | `5EB40F5A9509ADF0742D7528D95353EDBD48B55CF05D0354184CA421A0118DD1` |

The corresponding original-assembly fallback hashes are:

| Symbol | Assembly fallback | SHA-256 |
|---|---|---|
| `func_00008564` | `asm/original/rev0/boot/boot_state_slot_payload_copy_free.s` | `6CA00F11ABD9A5C4143CA484803B5C6468353AD56499E29008DAE55FA0FE20E9` |
| `func_00023970` | `asm/original/rev0/lib/osCreateMesgQueue.s` | `B07EBA870ACDCD8C6EFC72CC07891650030E51635B8998A70A1BCE861237FC1E` |
| `func_0002CB80` | `asm/original/rev0/lib/hypotf.s` | `B4D3DE77E9ADB7BDEDED631EEB7364FE01BA9F75BC0CA9A2113F400C636F83FE` |
| `func_0025CAF0` | `asm/original/rev0/lib/func_0025CAF0.s` | `424D2696B2EC8B30B663CC86271AD1065D5E12922BA35BBB398DA228580E5018` |

Canonical accepted cumulative Phase 5B inputs are preserved from `main`. Their baseline hashes include:

- `asm/original/rev0/manifest.json`: `EE6A81334FDCFC2867BC7AF63AD56624E08C6B92D992915A45B610B44D3FCF44`.
- `config/roms/us_rev0.json`: `5E9183D5DF1D87D83EEC70E7DCA4BE3F859059B85FF192B8E1317F38B60D0331`.
- `config/overlays/us_rev0.json`: `D4F1FB177822334EB748D6D62B342FB813D8825FEDD912057CF651EB616A5FB6`.
- `config/segments/rev0.yaml`: `0EE7443968414711C081D779E22B58F7291DA73518C7CF56285F9BD236B6AE07`.
- `config/splat/us_rev0.semantic.json`: `44938312F6967E94B527B8B878C01125A2589B1BD28B2DB7E9F06059E2843979`.
- `config/splat/us_rev0.overlay-linker-inputs.json`: `42183B3BC308AD7850B59DB988029639A74ECAEA5A120DAF7D2598055374F8A5`.
- `config/splat/us_rev0.yaml`: `4A06310B83005E8F6F2986A6CD00B51083F7D6F002F4A7E670B41CCF4D8FFE67`.
- `docs/external-intake/phase6-kmc-reproduction-20260801/reproduction-manifest.json`: `98C8ACC06A8FBF40DADBD25AE20C2539E8765E14EA12895158C37CC413D06C26`.

## Plan

1. Create a strict fifteen-target union in canonical target order.
2. Keep the eleven canonical target records unchanged.
3. Append the four frozen Lane B records in order.
4. Copy only the four Lane B C owners.
5. Keep existing canonical assembly fallbacks unchanged.
6. Run two fresh combined Phase 7 and Phase 8 roots outside the repository.
7. Compare both runs and verify ROM identities.
8. Write the evidence index and after-action report.

The principal failure mode was accidental import of Lane B shared configuration. The audit proves canonical Phase 5B inputs stayed unchanged.

## Promotion result

The canonical Phase 8 configuration now contains exactly fifteen targets.

- The eleven baseline target record bodies match canonical `main` byte-for-byte.
- The four appended symbols are `func_00008564`, `func_00023970`, `func_0002CB80`, and `func_0025CAF0`.
- The appended order matches frozen Lane B order.
- All fifteen symbols, row indexes, and ROM ranges are unique.
- All fifteen C source hashes match their target contracts.
- All fifteen original-assembly fallback hashes match their target contracts.
- Canonical protected files remain unchanged.
- No file is staged.
- `git diff --check` passes.

## Fresh combined roots

Both roots used the authenticated local prerequisites recorded in the prior promotion workflow.

- Run A: `C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\promotion\lane-b-b01-r1\run-a`.
- Run B: `C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\promotion\lane-b-b01-r1\run-b`.
- Both Phase 7 builds and verifications passed.
- Both Phase 8 builds and verifications passed for fifteen targets.
- Both full-ROM SHA-256 values are `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
- Both code-region SHA-256 values are `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- Both Phase 8 verifications preserve 7,242 rows, 7,251 slices, and 19 overlay reservations.
- Both Phase 8 verifications report `fullRomExact: true` and `originalAssemblyTargetsNotLinked: true`.
- All fifteen asm-differ results report `exact: true` and `currentScore: 0`.
- Phase 7 reproducibility comparison passed with report SHA-256 `EAACF0ECD60BACC7A04C815689F6BE896F036D5830B03EF210329244F326597D`.
- Phase 8 reproducibility comparison passed with report SHA-256 `9295109C75F92589BA2CE48A9AC11691DBBCA791D376E59B0255EB62E9893472`.

The exact command ledger and artifact hashes are in `evidence-index.md`.

## Final worker status

Status is completed and review-pending. Lane B and all other lanes remained read-only.

The result proves structural promotion and exact static build identity. It does not prove gameplay semantics or runtime behavior.

The worker does not issue an acceptance verdict. Fresh independent Critical review remains required.
