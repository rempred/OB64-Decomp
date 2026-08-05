# Highway D-F checkpoint 001 promotion task log

Status is completed and review-pending. Six frozen results now extend canonical matching C from 23 to 29 exact targets. This prepares one stable review subject. No action is required from Joe; the Parent Director must route independent review.

## Assignment

- Task ID: `OB64-MC-6LW01-PROMO-DF-CP001-20260804-R1`.
- Role: `worker`.
- Surface: `promotion`.
- Program ID: `OB64-MC-6LW01-20260803`.
- Checkpoint ID: `OB64-MC-6LW01-DF-CP001`.
- Inventory profile: `NORMAL`.
- Canonical worktree: `C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp`.
- External output root: `C:\Users\Joe\Projects\OgreBattlel64-External-Outputs\OB64-MC-6LW01-20260803\DF-CP001\promotion-r1`.

## Baseline

Baseline was recorded at `2026-08-04T21:12:11.8453421-04:00` before any promotion write or build.

- Canonical branch: `main`.
- Canonical HEAD: `38e9348438cc0255f9bf44a159e42ba0eb5ec056`.
- Canonical status: clean.
- Starting matching-C target count: 23.
- Starting configuration SHA-256: `C1221A8FF12270BF20B96E94A159839066F0DCA83FB411BA0B73A7B133AB2513`.
- Checkpoint manifest SHA-256: `74B48B267BE11A34B7AB142008A0A43A84CAB5F57017FAE931329E07DBE16D6C`.
- Checkpoint state: `frozen`.
- Checkpoint accepted functions: 6.
- Checkpoint accepted bytes: 864.
- The assignment grants this worker the canonical promotion surface.
- The clean start proves no existing canonical change overlaps this promotion.
- No helper agent has write authority for this task.

## Frozen inputs

The checkpoint records four `PURE_MATCHING_C`, one `JUSTIFIED_HYBRID`, and one `ASSEMBLY_REQUIRED` classification.

The accepted functions are:

1. `func_0002de10`, 64 bytes, accepted result `bf66282f1303d9e8e3ca1440948374169f8e1815`.
2. `func_000238b0`, 88 bytes, accepted result `c1f3ca9c8f7e53d8be9364686212a71a5bd4a6bc`.
3. `func_001072b8`, 212 bytes, accepted result `f61b07ed64c7b9a0213f8f503b91f0d4f08d3ce5`.
4. `func_0000b030`, 128 bytes, accepted result `2e3938517d0ea7ba1e0820d397f64fc6e7db705a`.
5. `func_0011b344`, 236 bytes, accepted result `c987fca07b3605819d96b777be65328cc773c19c`.
6. `func_00007600`, 136 bytes, accepted result `4aafcf831b992a81d07a573da95b678cbdff54bd`.

Each accepted result exists as a commit object. Its commit trailers bind the function, lane, lease, and review commit.

## Plan

1. Extract each accepted target record and C owner from its accepted-result tree.
2. Preserve all 23 starting target records byte-for-byte and in order.
3. Preserve the starting compiler object byte-for-byte.
4. Append the six frozen targets in checkpoint order.
5. Verify source, fallback, range, row, symbol, and classification identities.
6. Run fresh external Phase 7 build and verification outputs.
7. Run fresh external Phase 8 build and verification outputs.
8. Audit final paths, hashes, unstaged state, and preserved inputs.
9. Create the evidence index, after-action report, and handoff manifest.
10. Run `validate_handoff.js` before the exact callback.

The principal risk is importing cumulative lane history instead of one reviewed function tree. Exact target and source extraction controls this risk.

## Running record

- Required repository rules and workflows were read.
- The task transport protocol was read.
- The matching-C configuration path is `config/phase8/matching-c.json`.
- Each frozen accepted-result tree contains its named target record.
- The first patch-construction wrapper failed on truncated configuration output.
- That wrapper made no repository change.
- The second wrapper failed on PowerShell-to-Node quoting.
- That wrapper made no repository change.
- PowerShell JSON extraction then supplied the exact accepted records.
- Each canonical source path was absent before integration.
- Each canonical assembly fallback matched its frozen SHA-256.
- The configuration now contains exactly 29 targets.
- The first 23 target objects match canonical `HEAD` exactly.
- The compiler object matches canonical `HEAD` exactly.
- Each appended target object matches its accepted-result tree.
- All source and fallback hashes match their target contracts.
- Symbols, rows, primary IDs, sections, sources, and fallbacks are unique.
- Pairwise interval analysis found no overlapping target ranges.
- Integrated configuration SHA-256: `7AD3F59E5B2A9F9254B62727B14EE3189E783DA7D9FF2AB93F0813A17418D8E9`.
- KMC compiler SHA-256: `F3F1C99A322F5B3D8C108C2A44AF1D6D084DD27575C5D60BF0F0D33FFF34B1C6`.
- Splat Python SHA-256: `4CCA2027319C08DCA5CC4B64C9BA415CC89205152202CB6805081277C43B610F`.
- Splat split-script SHA-256: `EED41D3C36AFA4A980A3B22BC76C371569696CADFEF925DBB63606BFB081544E`.
- asm-differ revision: `093360aa31f90e67216ed1971c4087516cc7b940`.
- Node version: `v24.13.1`.
- Python version: `3.11.15`.
- The isolated external output root was absent before this task.
- Frozen assembly-evidence paths and hashes match the checkpoint manifest.
- Fresh Splat generation passed.
- Fresh Phase 7 conventional build passed.
- Fresh Phase 7 conventional verification passed.
- Fresh Phase 8 matching-C build passed for 29 targets.
- Fresh Phase 8 matching-C verification passed for 29 targets.
- Phase 7 and Phase 8 preserve full-ROM SHA-256 `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
- Phase 7 and Phase 8 preserve code-region SHA-256 `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- Phase 8 preserves 7,242 rows, 7,251 slices, and 19 overlay descriptors.
- Phase 8 records `fullRomExact: true` and `originalAssemblyTargetsNotLinked: true`.
- All 29 asm-differ results are exact with score zero.
- Final `HEAD` remains `38e9348438cc0255f9bf44a159e42ba0eb5ec056` on `main`.
- Final status contains exactly eleven assigned promotion paths.
- The Git index is empty.
- Tracked `git diff --check` passed.
- All eleven assigned text files have one terminal line feed.
- All eleven assigned text files contain no trailing horizontal whitespace.
- `validate_handoff.js` returned `ok: true` with `errors: []`.
- No branch, worktree, commit, merge, cherry-pick, push, or external action occurred.

## Current worker status

Status is completed and review-pending. The worker does not issue an acceptance verdict.
