# Highway A-C checkpoint 001 S01 promotion review task log

Status is completed with verdict `Accepted`. The frozen promotion preserves the earlier baseline and adds only six approved targets. Final handoff validation passed. The Parent Director must intake and propagate the accepted review.

## Assignment

- Task ID: `OB64-MC-6LW01-PROMO-AC-CP001-S01-REVIEW-20260805-R1`.
- Role: `promotion-reviewer`.
- Task kind: `review`.
- Surface: `promotion`.
- Lane: `PROGRAM`.
- Program ID: `OB64-MC-6LW01-20260803`.
- Checkpoint ID: `OB64-MC-6LW01-AC-CP001-S01`.
- Inventory profile: `NORMAL`.
- Reviewed commit: `af478b688233996a2c4495265eadbd6146eff1f1`.
- Assigned parent: `0a637e4fb34b9f94fb073a06d16e1d9b777493b0`.
- Review output root: `C:\Users\Joe\Projects\OgreBattlel64-External-Outputs\OB64-MC-6LW01-20260803\AC-CP001-S01\promotion-review-r1`.

## Start gate

The assignment was `ready` and required independent promotion review.

The Parent repository started on `main` at `01fd3b9aa49f50d4b257905be275402b6d681f90`.

The canonical decomp repository started on `main` at the reviewed commit.

The decomp worktree contained one unrelated G-I CP003 documentation directory.

That directory does not overlap this review path.

The four G-I files retained these SHA-256 values throughout review:

| File | SHA-256 |
|---|---|
| `aar/20260805-ob64-mc-6lw01-gi-cp003-promotion-aar.md` | `EBC1E0E9F260D9E2A299C58719EB1C1A7A0CF1983CFB042277323CF2CC0FAE08` |
| `evidence-index.md` | `FE602852CC18C6BD136C88FBE0072B5B3288C5A3DEBF8A39C580C6816CA22594` |
| `handoff-manifest.json` | `E4C628E05B01B5AF5A401023AAE6BE22BD6D80881CBC150A2FAEDA3FD121C7BE` |
| `task-log.md` | `CC54765774742F60AC8EB1200A04F0C3E233B92912A0510B8AA70426BD1B8C50` |

The assigned review directory was absent at baseline.

The external review output root was also absent.

## Review eligibility

- The assignment names a review task and an exact frozen subject.
- The promotion AAR reports `completed` and `review-pending`.
- The worker evidence package exists.
- The frozen subject is a commit with the assigned parent.
- No unfinished worker blocker appears in the AAR.
- This reviewer did not create the promotion.
- Review writes remain within the assigned review records and external output root.
- No planned review write overlaps existing work.

Review eligibility passed.

## Review design

The primary claim is an exact six-target union over a preserved 28-target baseline.

The strongest competing interpretation is that cumulative lane history or another target entered promotion.

The smallest falsifier compares the frozen parent, changed paths, configuration objects, accepted trees, and source blobs.

Fresh Phase 7 and Phase 8 runs test the resulting conventional build and matching-C build.

No hostile mutation is needed for this static preservation claim.

## Running record

- Required Parent and decomp rules were read.
- The reviewer workflow was read.
- The matching-C workflow section was read.
- The assignment, checkpoint manifest, promotion assignment, AAR, evidence index, task log, and worker handoff were read.
- The task transport protocol was read before callback work.
- The reviewed commit resolves to `af478b688233996a2c4495265eadbd6146eff1f1`.
- Its sole parent resolves to `0a637e4fb34b9f94fb073a06d16e1d9b777493b0`.
- The commit changes exactly eleven authorized promotion paths.
- `git diff --check` passes for the frozen commit.
- The base configuration SHA-256 is `E0D9023BFCA2CD9BE55DEAC6457561D168F1BCA9DE02702F607A4C2C1B6F70D6`.
- The final configuration SHA-256 is `88F544C2054DB6FD1AC048698619D7524B615CF43F940BB7B9F04415740D55C1`.
- All 28 earlier target objects match the parent configuration exactly.
- The compiler object matches the parent and every accepted-result configuration.
- Each checkpoint target occurs exactly once.
- The six checkpoint targets total 716 bytes.
- Each target object matches its accepted-result tree.
- Each promoted source blob matches its accepted-result tree.
- All 34 configured source and fallback hashes match their files.
- Every configured interval length equals its byte count.
- Symbols, rows, primary IDs, sections, sources, and fallbacks are unique.
- Pairwise interval analysis finds no overlap.
- Six lifecycle receipts and ten hybrid-classification artifacts match their frozen hashes.
- The KMC compiler, Splat Python, and Splat split script match their assigned hashes.
- The asm-differ checkout remains at `093360aa31f90e67216ed1971c4087516cc7b940`.
- Fresh Splat generation passed.
- Fresh Phase 7 build and verification passed.
- Fresh Phase 8 build and verification passed for 34 targets.
- Both phases reproduce the stock full-ROM SHA-256.
- Both phases reproduce the accepted code-region SHA-256.
- All 34 asm-differ results are exact with score zero.
- Every Phase 8 target links from a generated C object.
- Original target assembly is not linked.
- Fresh build and verification reports match the worker report hashes exactly.
- No command timed out.
- No verification command failed.

## Exact verification commands

All five commands ran from `C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp`.

```powershell
node tools/run_phase7_splat.js --output "C:\Users\Joe\Projects\OgreBattlel64-External-Outputs\OB64-MC-6LW01-20260803\AC-CP001-S01\promotion-review-r1\splat" --python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --snapshot-root "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source"
node tools/build_phase7_conventional.js --output "C:\Users\Joe\Projects\OgreBattlel64-External-Outputs\OB64-MC-6LW01-20260803\AC-CP001-S01\promotion-review-r1\phase7" --splat-output "C:\Users\Joe\Projects\OgreBattlel64-External-Outputs\OB64-MC-6LW01-20260803\AC-CP001-S01\promotion-review-r1\splat" --splat-python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --splat-split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ"
node tools/verify_phase7_conventional.js --output "C:\Users\Joe\Projects\OgreBattlel64-External-Outputs\OB64-MC-6LW01-20260803\AC-CP001-S01\promotion-review-r1\phase7" --splat-python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --splat-split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ" --report "C:\Users\Joe\Projects\OgreBattlel64-External-Outputs\OB64-MC-6LW01-20260803\AC-CP001-S01\promotion-review-r1\phase7\verification.json"
node tools/build_phase8_matching_c.js --output "C:\Users\Joe\Projects\OgreBattlel64-External-Outputs\OB64-MC-6LW01-20260803\AC-CP001-S01\promotion-review-r1\phase8" --phase7-output "C:\Users\Joe\Projects\OgreBattlel64-External-Outputs\OB64-MC-6LW01-20260803\AC-CP001-S01\promotion-review-r1\phase7" --compiler "C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe" --splat-python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --splat-split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ"
node tools/verify_phase8_matching_c.js --output "C:\Users\Joe\Projects\OgreBattlel64-External-Outputs\OB64-MC-6LW01-20260803\AC-CP001-S01\promotion-review-r1\phase8" --compiler "C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe" --splat-python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --splat-split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ" --report "C:\Users\Joe\Projects\OgreBattlel64-External-Outputs\OB64-MC-6LW01-20260803\AC-CP001-S01\promotion-review-r1\phase8\verification.json"
```

Every command returned exit code zero.

The command timeout was 60 seconds.

No command reached that timeout.

A timeout would indicate interrupted verification, not a failed build claim.

## Technical verdict

The technical verdict is `Accepted`.

No admissible finding exists.

## Handoff validation

The final validator command ran from the Parent repository.

```powershell
node 'C:\Users\Joe\Projects\OgreBattlel64\tools\coordination\validate_handoff.js' --manifest 'C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp\docs\matching-c\ob64-mc-6lw01-ac-cp001-s01-promotion-review-20260805\handoff-manifest.json' --worktree 'C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp'
```

The validator returned `ok: true` with `errors: []`.

The exact terminal callback is ready for one delivery.
