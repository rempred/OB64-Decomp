# Lane A batch 02 canonical promotion task log

Status is completed and review-pending. Frozen `func_00269798` now extends canonical `main` to twenty exact targets, and both fresh combined roots passed. This matters because the accepted Phase 5B inputs and canonical ROM identity remain preserved. No action is required from Joe; the Director must route fresh Critical review.

## Assignment

- Task ID: `OB64-MC-A-B02-PROMOTION-20260803-R1`.
- Role: worker.
- Director thread: `019fc57a-ba80-7341-8b36-5e9680ebbbef` on host `local`.
- Inventory profile: `NORMAL`.
- Canonical repository: `C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp`.
- Lane A repository: `C:\Users\Joe\Projects\OB64-Decomp-Worktrees\lane-a`.
- External output root: `C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\promotion\lane-a-b02-r1`.

## Baseline

Baseline was recorded at `2026-08-03T20:27:31.1877881-04:00` before any promotion write or build.

- Parent branch: `main`.
- Parent HEAD: `d954fd4338b37d646f6a11912c6d8e5b396213a0`.
- Required parent ancestor: `5b7ba821eb6cef36817ce84a2b642c83f9768fe2`, present.
- Parent status contained existing changes outside this assignment.
- Canonical branch: `main`.
- Canonical HEAD: `e5d5b84ecaff6888183b0d1e867e0834600e0409`.
- Canonical status: clean.
- Lane A branch: `matching-c/lane-a-b02`.
- Lane A HEAD: `f6158ab9f1ab62779276c166c858c771f2dfe117`.
- Lane A status: clean.
- Canonical Phase 8 target count: nineteen.
- Lane A Phase 8 target count: twelve.
- Canonical Phase 8 configuration SHA-256: `0443605E350DA54EA1131DC693B66E630DB9C0B2B2DB13A6F66AE2127904940C`.
- Lane A Phase 8 configuration SHA-256: `5B75C03F8ABD8DA6AD968CDD2B039A927C0DFBAE5CDD2F3C470E498591F8C9FE`.
- The external output root was absent at baseline.
- The Director assignment grants this worker sole canonical writes for this promotion.

Existing parent changes are read-only and outside the canonical promotion surface. The prompt allows unrelated parent changes when the required ancestor remains present.

## Frozen Lane A input

| Symbol | C source | Source SHA-256 | Assembly fallback | Fallback SHA-256 |
|---|---|---|---|---|
| `func_00269798` | `src/lib/func_00269798.c` | `EF08FAFBC2CA323EC8031D93FA23D0A2B80363566EC5C41461822D6D08E9BD0E` | `asm/original/rev0/lib/func_00269798.s` | `8C7A0F1025428DA6739FB746F0CE832E27A36A200227FB879BF238DF56115120` |

The canonical source path was absent at baseline. The canonical assembly fallback matched the frozen Lane A hash.

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

## Plan

1. Preserve all nineteen canonical target records byte-for-byte.
2. Append the frozen Lane A record without importing shared configuration.
3. Copy only the frozen C source owner.
4. Audit symbols, rows, ranges, source paths, and fallback paths.
5. Confirm all twenty source and fallback hashes.
6. Run two fresh combined Phase 7 and Phase 8 roots.
7. Compare Phase 7 and Phase 8 outputs for path independence.
8. Record artifacts, deviations, final paths, and pending review state.

The principal risk is replacing accepted cumulative inputs with Lane A's older shared configuration. Hash and parsed-record audits will test that risk.

The ordinary supported path uses authenticated Splat, asm-differ, GNU binutils, and KMC prerequisites. Both fresh roots must reproduce canonical ROM identity.

## Running record

- Assignment, workflow, repository baselines, and frozen review were read.
- Baseline identity, clean-worktree, source, fallback, and Phase 5B checks passed.
- The canonical configuration now contains exactly twenty targets.
- All nineteen canonical target bodies remain byte-for-byte unchanged and ordered.
- The appended record matches Lane A target index eleven byte-for-byte.
- The canonical compiler contract remains byte-for-byte unchanged.
- All twenty symbols, rows, primary IDs, ranges, source paths, and fallback paths are unique.
- Pairwise interval analysis found zero target-range overlaps.
- All twenty source and fallback hashes match their contracts.
- Final promotion configuration SHA-256: `EDD763A657223516284ABCA5521F12A25742ACFA5CECC8DF1042AAC06B12685F`.
- The promoted source hash matches frozen Lane A.
- The canonical fallback remains byte-identical to frozen Lane A.
- Authenticated compiler, Python, split script, and asm-differ identities passed the pre-build check.
- Run A Phase 7 build and verification passed.
- Run A Phase 8 build and verification passed for twenty targets.
- Run B Phase 7 build and verification passed.
- Run B Phase 8 build and verification passed for twenty targets.
- Phase 7 reproducibility passed with identical reports and outputs.
- Phase 8 reproducibility passed with identical reports and outputs.
- Both runs preserved full-ROM SHA-256 `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
- Both runs preserved code-region SHA-256 `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- All twenty asm-differ results report exact matches and zero current scores.
- Final Phase 5B input hashes match baseline.
- Final canonical status contains only the five assigned promotion paths.
- The staged index is empty.
- Tracked and new-file `git diff --check` checks produced no whitespace errors.
- Canonical `HEAD` remains the required start.
- Lane A remains clean at its frozen input.
- Parent `HEAD` advanced independently to `d330e558996e90c405f04fd4e5f5cfacb92e8227`.
- The required parent ancestor remains present.

## Current worker status

Status is completed and review-pending. Lane A and every other lane remained read-only.

The result proves structural promotion and exact static build identity. It does not prove gameplay semantics or runtime behavior.

The worker does not issue an acceptance verdict. Fresh independent Critical review remains required.
