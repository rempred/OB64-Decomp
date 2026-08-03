# After-action report: Lane A batch 01 canonical promotion

Status: completed and review-pending. The worker promoted four frozen Lane A matching-C owners into canonical `main` and passed two fresh combined Phase 7 and Phase 8 runs. This matters because canonical `main` now has one reproducible eleven-target result while retaining the accepted Phase 5B input and assembly fallbacks. No action is required from Joe; the Director must route this result for fresh Critical review.

## Assignment and boundaries

The assignment was `OB64-MC-A-B01-PROMOTION-20260803-R1`.

The canonical repository started on `main` at `c59603356f9b0e77f54ccb432a19d65cb572a279`.

The frozen Lane A repository was clean at `51171f6f1a10c190c8100248d9fd7734f36b2d94`.

The worker wrote only the canonical promotion files and task-owned records.

The Lane A worktree, ROM inputs, emulator, RAM, editor, remotes, and external source implementations remained untouched.

No branch, commit, worktree, push, publication, or acceptance verdict was created.

## Promotion result

The canonical matching-C configuration now contains eleven targets.

The seven canonical targets remain unchanged and retain their original order.

The four appended Lane A targets are `func_00003798`, `func_0000A1F8`, `func_0002CBCC`, and `func_0025C8A4`.

The appended order matches Lane A exactly.

The promoted C source hashes match the frozen Lane A contracts.

The final matching-C configuration hash is `FF8E396A08341C31D28DF12EE9DF021A2A201477D63A68CF4E25B4F4442386F3`.

All eleven symbols, row indexes, and ROM ranges are unique.

The original assembly fallback hashes match all eleven target contracts.

The complete source, target, and fallback table is in [evidence-index.md](../evidence-index.md).

## Phase 5B preservation

The Lane A branch contained separate older Phase 5B configuration edits.

The worker did not copy those edits into canonical `main`.

Canonical `main` retains the accepted cumulative row-565 correction and shared input from the required starting tip.

Fresh Phase 7 reports record the canonical segment and Splat input hashes.

This preserves the Phase 5B correction while adding only the matching-C promotion.

## Material claims

| Claim | Evidence grade | Review status | Supporting artifacts |
|---|---|---|---|
| The four frozen Lane A owners were appended without duplicate ownership. | `Verified` | pending | Final `config/phase8/matching-c.json`; source hash audit; target order in both Phase 8 reports |
| The accepted Phase 5B input remained canonical. | `Verified` | pending | Phase 7 `acceptedInputs`; canonical Phase 5B configuration files; final diff scope |
| Two fresh combined Phase 7 and Phase 8 runs passed. | `Verified` | pending | `run-a` and `run-b` build and verification reports under the isolated output root |
| The result is path-independent. | `Verified` | pending | Phase 7 and Phase 8 reproducibility reports |
| The result proves gameplay semantics. | Not claimed | pending | Static matching proves build identity, not runtime behavior |

## Verification summary

Both Splat executions passed.

Both conventional Phase 7 builds and verifications passed.

Both matching-C Phase 8 builds and verifications passed for all eleven targets.

Both Phase 8 runs preserved full-ROM SHA-256 `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

Both Phase 8 runs preserved code-region SHA-256 `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.

The Phase 8 preservation proof recorded 7,242 primary rows, 7,251 link slices, 19 overlay reservations, and five assembly fallback objects.

The preservation proof recorded `fullRomExact: true` and `originalAssemblyTargetsNotLinked: true`.

All eleven asm-differ proofs reported `exact: true` and `currentScore: 0`.

The exact commands and artifact hashes are in [evidence-index.md](../evidence-index.md).

## Changed surfaces

The promotion changed these canonical source and configuration files:

- `config/phase8/matching-c.json`
- `src/boot/boot_resource_state_reset.c`
- `src/boot/boot_resource_node_recursive_payload_clear.c`
- `src/lib/rand.c`
- `src/lib/func_0025C8A4.c`

The worker also created the assigned task log, evidence index, and this AAR.

The final canonical changes remain uncommitted and unstaged.

## Failed paths and limits

No required build, verification, or comparison path failed.

The worker did not rerun the setup gate because this assignment required isolated Phase 7 and Phase 8 outputs.

The build result proves static structure and byte identity only.

It does not prove gameplay meaning or runtime behavior.

## Protocol and scope review

No protocol deviation changed the acceptance boundary.

The worker ran an additional Phase 7 reproducibility comparison.

All generated outputs remain below `C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\promotion\lane-a-b01-r1`.

The final `git diff --check` passed.

The final status contained only the expected promotion files and task-owned records.

## Proposed canonical-document changes

No canonical status or semantic document change is proposed before independent review.

The Director can update canonical status documents only after fresh Critical review accepts this combined result.

## Next action and review state

Evidence grade: `Verified` for exact promotion provenance and structural build identity.

Review status: `pending`.

Fresh independent Critical review remains required.

The worker does not accept its own result.
