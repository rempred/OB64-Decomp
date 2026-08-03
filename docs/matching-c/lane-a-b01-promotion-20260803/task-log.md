# Lane A batch 01 canonical promotion task log

## Status

The task is completed and review-pending. The four accepted Lane A matching-C owners are promoted in canonical `main`, and fresh Phase 7 and Phase 8 verification passed. Independent Critical review remains required.

No action is required from Joe during this worker run.

## Assignment

- Task ID: `OB64-MC-A-B01-PROMOTION-20260803-R1`
- Role: worker
- Assignment: promote the four accepted Lane A matching-C owners into canonical `main`.
- Inventory profile: `NORMAL`
- Human gate: none
- Required canonical repository: `C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp`
- Required isolated output root: `C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\promotion\lane-a-b01-r1`

## Baseline

The canonical repository is on `main` at `c59603356f9b0e77f54ccb432a19d65cb572a279`.

The canonical working tree was clean at baseline.

The Lane A repository is on `matching-c/lane-a-b01` at `51171f6f1a10c190c8100248d9fd7734f36b2d94`.

The Lane A working tree was clean at baseline.

The parent assignment is ready at `C:\Users\Joe\Projects\OgreBattlel64\docs\Plans\prompts\ob64-matching-c-lane-a-b01-promotion-20260803-r1-prompt.md`.

## Mission constraints

- Keep the seven existing canonical targets unchanged and in order.
- Append only the four accepted Lane A targets in Lane A order.
- Copy only the four exact accepted C sources from Lane A.
- Preserve the accepted Phase 5B row-565 correction and shared input.
- Preserve every original assembly fallback unchanged.
- Keep Lane A read-only.
- Write only canonical promotion files and task-owned records.
- Use isolated outputs for every build and comparison.
- Leave canonical changes uncommitted and unstaged.
- Do not create a branch, commit, task, subagent, or worktree.
- Do not use external decomp source, network, remotes, editor, emulator, RAM, or controller input.

## Technical plan

1. Inspect the frozen Lane A commit, canonical target manifest, source manifest, build configuration, and accepted Phase 5B inputs.
2. Prove the strict seven-plus-four target union and the four source hashes before copying files.
3. Copy the four accepted source files and update only the canonical matching-C configuration.
4. Run fresh isolated Phase 7 and Phase 8 builds and verification commands.
5. Run a path-independent reproducibility comparison from a second isolated output root.
6. Verify full-ROM and code-region identities, final target order, fallback preservation, and unstaged scope.
7. Write the evidence index and AAR, then send one terminal Director callback.

## Evidence categories

Current observations are baseline observations only. Promotion claims remain `review: pending` until independent Critical review.

Leading failure mode: an accidental target, source, fallback, or Phase 5B input change could produce a passing build with the wrong eleven-target provenance.

Required distinguishing evidence: exact target order, exact source hashes, configuration and manifest diffs, fallback identity checks, isolated build reports, reproducibility hashes, and unchanged canonical ROM identities.

## Frozen batch inspection

The Lane A frozen tip is `51171f6f1a10c190c8100248d9fd7734f36b2d94`.

The Lane A `config/phase8/matching-c.json` contains the seven canonical targets followed by exactly `func_00003798`, `func_0000A1F8`, `func_0002CBCC`, and `func_0025C8A4`.

The first seven target records and the compiler contract match canonical `c59603356f9b0e77f54ccb432a19d65cb572a279`.

The Lane A matching-C configuration hash is `FF8E396A08341C31D28DF12EE9DF021A2A201477D63A68CF4E25B4F4442386F3`.

The canonical matching-C configuration hash is `3FA55971AF36908D2CA0A44460F36BB9156DEF8DF71FA0630583B5AC2C01D07C`.

All eleven target symbols, row indexes, and ROM ranges are unique.

All eleven source hashes match their target contracts.

All eleven original assembly fallback hashes match their target contracts.

The Lane A tip also carries separate Phase 5B configuration edits from an older input profile. Those files are not part of this promotion. Canonical `main` retains the accepted cumulative row-565 Phase 5B correction and shared input from `c59603356f9b0e77f54ccb432a19d65cb572a279`.

## Experiment log

### Promotion

The canonical matching-C configuration now has eleven targets.

The first seven target records remain byte-for-byte unchanged from canonical `c59603356f9b0e77f54ccb432a19d65cb572a279`.

The four appended targets match the frozen Lane A order and source identities.

The canonical Phase 5B files remain unchanged from `c59603356f9b0e77f54ccb432a19d65cb572a279`.

The canonical matching-C configuration hash is now `FF8E396A08341C31D28DF12EE9DF021A2A201477D63A68CF4E25B4F4442386F3`.

### Fresh combined run A

The run-A Splat execution passed.

The run-A Phase 7 build passed with full-ROM SHA-256 `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

The run-A Phase 7 verification passed.

The run-A Phase 8 build passed for all eleven targets.

The run-A Phase 8 verification passed with full-ROM SHA-256 `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A` and code-region SHA-256 `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.

### Fresh combined run B

The run-B Splat execution passed.

The run-B Phase 7 build and verification passed.

The run-B Phase 8 build and verification passed for all eleven targets.

Run B produced the same full-ROM and code-region identities as run A.

### Reproducibility

The Phase 7 path-independent comparison passed.

The Phase 8 path-independent comparison passed.

The final generated evidence remains under `C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\promotion\lane-a-b01-r1`.

The final canonical worktree is uncommitted and unstaged.

Independent Critical review remains required. The worker has not accepted the result.
