# After-action report: Lane B batch 01 canonical promotion

Status is completed and review-pending. The worker promoted four frozen Lane B owners into canonical `main` and passed two fresh combined Phase 7 and Phase 8 runs. This matters because canonical `main` now has one reproducible fifteen-target result with the accepted Phase 5B inputs preserved. No action is required from Joe; the Director must route this result for fresh Critical review.

## Assignment and boundaries

The assignment was `OB64-MC-B-B01-PROMOTION-20260803-R1`.

Canonical `main` started at `715c3412c74c17caa9121e52fd888048a979fc47`.

Frozen Lane B started at `fe38378f89c57e78b7df3b8ba0a89fa2fe7e613c`.

Both working trees were clean before writes.

The worker wrote only the canonical promotion files and assigned records.

Lane B and all other lanes remained read-only.

No branch, commit, worktree, push, publication, editor, emulator, RAM, controller input, network, or remote action occurred.

## Promotion result

The canonical matching-C configuration now contains fifteen targets.

The eleven baseline target record bodies remain byte-for-byte unchanged and in order.

The appended Lane B records are `func_00008564`, `func_00023970`, `func_0002CB80`, and `func_0025CAF0`.

The appended order matches the frozen Lane B order.

All fifteen target symbols, row indexes, and ROM ranges are unique.

All fifteen source hashes and fallback hashes match their target contracts.

The final configuration SHA-256 is `4BA9398C154B4C14097F9500DF45EE9EE15EB0B588CE138A50D5F186DA50887F`.

The complete source, fallback, range, and row table is in `evidence-index.md`.

## Phase 5B preservation

The Lane B branch carried separate shared configuration changes.

The worker did not copy those changes into canonical `main`.

Canonical Phase 5B input Git objects match the required canonical start.

Both Phase 7 reports record the same accepted input hashes.

## Verification summary

Both fresh Splat executions passed.

Both conventional Phase 7 builds and verifications passed.

Both matching-C Phase 8 builds and verifications passed for all fifteen targets.

Both Phase 8 runs preserved full-ROM SHA-256 `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

Both Phase 8 runs preserved code-region SHA-256 `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.

Both Phase 8 verifications preserved 7,242 primary rows, 7,251 link slices, and 19 overlay reservations.

Both Phase 8 preservation proofs record `fullRomExact: true` and `originalAssemblyTargetsNotLinked: true`.

All fifteen asm-differ results report `exact: true` and `currentScore: 0`.

Phase 7 and Phase 8 reproducibility comparisons passed.

The exact commands and artifact hashes are in `evidence-index.md`.

## Material claims

| Claim | Evidence grade | Review status | Supporting artifacts |
|---|---|---|---|
| The four frozen Lane B owners were appended without duplicate ownership. | `Verified` | pending | Final Phase 8 configuration and target audit |
| The canonical Phase 5B inputs remained unchanged. | `Verified` | pending | Git object audit and Phase 7 accepted inputs |
| Two fresh combined Phase 7 and Phase 8 runs passed. | `Verified` | pending | Run A and run B reports under the external output root |
| The result is path-independent. | `Verified` | pending | Phase 7 and Phase 8 reproducibility reports |
| The result proves gameplay semantics. | Not claimed | pending | Static matching proves build identity, not runtime behavior |

## Changed surfaces

The promotion changed these canonical files:

- `config/phase8/matching-c.json`
- `src/boot/boot_state_slot_payload_copy_free.c`
- `src/lib/osCreateMesgQueue.c`
- `src/lib/hypotf.c`
- `src/lib/func_0025CAF0.c`

The worker created the assigned task log, evidence index, and this report.

The final canonical changes remain uncommitted and unstaged.

## Failed paths and limits

No required build, verification, or comparison path failed.

The static result proves exact configured build identity and promotion provenance.

It does not prove gameplay meaning or runtime behavior.

No canonical status or semantic document change is proposed before independent review.

## Review state and next action

Evidence grade is `Verified` for exact promotion provenance and structural build identity.

Review status is `pending`.

Fresh independent Critical review remains required.

The worker does not accept its own result.
