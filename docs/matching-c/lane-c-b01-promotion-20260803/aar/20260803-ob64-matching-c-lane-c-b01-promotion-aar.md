# After-action report: Lane C batch 01 canonical promotion

Status is completed and review-pending. The worker promoted three frozen Lane C owners and passed two fresh combined Phase 7 and Phase 8 roots. This creates a reproducible twenty-three-target canonical result while preserving accepted Phase 5B inputs. No action is required from Joe; the Director must freeze and route fresh Critical review.

## Assignment and boundaries

The assignment was `OB64-MC-C-B01-PROMOTION-20260803-R1`.

Canonical `main` started clean at `2ec7cddb7e7634566c0985fda6324b1ecb6fc2fb`.

Frozen Lane C started clean at `2d3e1a60522c4e1dee5cbcf9582ea5f4a8bf4e86`.

The parent required ancestor remained present. Its unrelated existing changes stayed read-only.

The worker wrote only the assigned canonical promotion files and records.

Lane C and every other lane remained read-only.

No branch, commit, worktree, push, publication, editor, emulator, RAM, controller input, network, or remote action occurred.

## Promotion result

The canonical matching-C configuration now contains twenty-three targets.

The twenty baseline target bodies remain byte-for-byte unchanged and ordered.

The appended Lane C records are `func_000241f8`, `func_0025CB60`, and `func_0025EFC8`.

The appended order matches the frozen Lane C order.

All target symbols, rows, primary owners, source paths, fallback paths, and ROM ranges are unique.

Pairwise interval analysis found no overlapping target ranges.

All twenty-three source and fallback hashes match their target contracts.

The final configuration SHA-256 is `C1221A8FF12270BF20B96E94A159839066F0DCA83FB411BA0B73A7B133AB2513`.

The complete source, fallback, range, and row evidence is in `evidence-index.md`.

## Phase 5B preservation

The Lane C branch carries an older shared configuration profile.

The worker did not copy those shared files into canonical `main`.

Every accepted cumulative Phase 5B input matches its canonical start hash.

Both Phase 7 reports record those same accepted input identities.

## Verification summary

Both fresh Splat executions passed.

Both conventional Phase 7 builds and verifications passed.

Both matching-C Phase 8 builds and verifications passed for all twenty-three targets.

Both Phase 8 runs preserved full-ROM SHA-256 `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

Both Phase 8 runs preserved code-region SHA-256 `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.

Both Phase 8 verifications preserved 7,242 primary rows, 7,251 link slices, and 19 overlay reservations.

Both preservation records set `fullRomExact: true` and `originalAssemblyTargetsNotLinked: true`.

All twenty-three asm-differ results set `exact: true` and `currentScore: 0`.

Phase 7 and Phase 8 reproducibility comparisons passed with identical reports and outputs.

The exact commands and artifact hashes are in `evidence-index.md`.

## Material claims

| Claim | Evidence grade | Review status | Supporting artifacts |
|---|---|---|---|
| The three frozen Lane C owners were appended without duplicate ownership. | `Verified` | pending | Final configuration and raw record audit |
| The canonical Phase 5B inputs remained unchanged. | `Verified` | pending | Final file audit and Phase 7 accepted inputs |
| Two fresh combined Phase 7 and Phase 8 roots passed. | `Verified` | pending | Run A and Run B build and verification reports |
| The result is path-independent. | `Verified` | pending | Phase 7 and Phase 8 reproducibility reports |
| The result proves gameplay semantics. | Not claimed | pending | Static matching proves build identity, not runtime behavior |

## Changed surfaces

The promotion changed these canonical files:

- `config/phase8/matching-c.json`.
- `src/lib/list_insert_head_000241f8.c`.
- `src/lib/func_0025CB60.c`.
- `src/lib/func_0025EFC8.c`.

The worker created the assigned task log, evidence index, and this report.

The final path audit found only the seven assigned files.

The staged index is empty. The final canonical changes remain uncommitted and unstaged.

Tracked and new-file `git diff --check` checks produced no whitespace errors.

## Failed paths and limits

The initial combined patch appended the report draft to `evidence-index.md` and did not create the missing `aar/` directory.

The path gate detected the missing report. The worker created the directory and re-applied the report content.

The first final audit trimmed Git's leading status column and reported a false path mismatch.

The corrected read-only parser passed the core identity audit.

The record-status cross-check detected the appended report draft.

The worker removed the duplicate draft and preserved the standalone report.

No required build, verification, comparison, or preservation path failed.

The static result proves exact configured build identity and promotion provenance.

It does not prove gameplay meaning, runtime behavior, editor readiness, or release safety.

## Proposed canonical-document changes

No canonical status or semantic document change is proposed before independent review.

The assignment kept `AGENTS.md`, `docs/PLATFORM.md`, and `docs/NEXT_STEPS.md` read-only.

## Review state and next action

Evidence grade is `Verified` for exact promotion provenance and structural build identity.

Review status is `pending`.

Fresh independent Critical review remains required.

The worker does not accept its own result.
