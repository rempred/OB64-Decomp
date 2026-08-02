# Wave 5 chronological task log

## Status and result

Status: completed and review-pending. The task selected, implemented, built, and
authenticated one 1,156-byte owner without changing protected repositories. This
matters because the complete Wave 5 result is ready for fresh Critical review.
No action is required from Joe during worker intake.

## Mission and inventory baseline

| Sequence | Action and observation | Evidence |
|---:|---|---|
| 1 | Read the parent rules, worker workflow, assignment, nested repository rules, and overlay guidance. | `AGENTS.md`, `docs/Worker-workflow.md`, assignment prompt, nested workflow documents |
| 2 | Recorded canonical starting branch `main` and HEAD `c81a897f4f6b7b65ddd84d23fa6b3012e45025e8`. | Canonical Git metadata |
| 3 | Recorded parent starting HEAD `db51d5de60fbe67599553565fd97dc3dd5282e3f`. | Parent Git metadata; parent remained read-only |
| 4 | Confirmed the scoped canonical status was clean before edits. | Scoped `git status --short --untracked-files=all` |
| 5 | Confirmed the target prompt was active and current. | `docs/Plans/prompts/ob64-decomp-matching-c-high-value-function-wave5-20260802-r1-prompt.md` |

The prompt parent baseline was `9f3b3ce95fc71074a1045785cbd9febdf36eedfe`.
The observed parent HEAD differed, but the parent stayed read-only.

## Selection chronology

| Sequence | Action and observation | Result |
|---:|---|---|
| 6 | Inspected the canonical function context for `0x0026B360..0x0026B7E4`. | One 1,156-byte owner with frame, table dispatch, loops, and direct calls |
| 7 | Validated predecessor `func_0026B32C` and successor `func_0026B7E4`. | Boundary ends at `jr $ra` plus delay slot |
| 8 | Back-mapped the owner through overlay descriptor 12. | Row `4834`, `.ob64.r4834`, runtime `0x802167B0..0x80216C34` |
| 9 | Scanned larger candidates and rejected four alternatives. | Rejection reasons recorded in `target-selection.md` |
| 10 | Selected `func_0026B360`. | Size and preferred resource/state control requirements passed |

The target context files were generated under `build/context/`. Their hashes are
recorded in `target-selection.md`.

## Derivation and implementation chronology

| Sequence | Action and observation | Result |
|---:|---|---|
| 11 | Derived state offsets, data fields, dispatch cases, loops, calls, and aliases from canonical assembly. | Recorded in `independent-derivation.md` |
| 12 | Wrote `src/overlays/descriptor_12/func_0026B360.c`. | One structural C owner, with no gameplay semantic claim |
| 13 | Compiled and assembled the owner in an external scratch root. | Section length was 1,156 bytes |
| 14 | Compared object words against the canonical ROM while masking relocation words. | Two loop-entry branches initially differed |
| 15 | Moved two compiler-local branch labels before count reloads. | All non-relocation words matched |
| 16 | Recompiled and reassembled the corrected owner. | Zero non-relocation word mismatches; 30 relocations recorded |
| 17 | Added the target manifest entry to `config/phase8/matching-c.json`. | Source, placement, aliases, hashes, and relocations authenticated |

The raw object text SHA-256 is
`09E0856A4F0881FE2D495FA4A2C291A889DB3BFCB784FC7D7623B8AE639F1249`.
The linked target SHA-256 is
`5342CBA0C83FCFE9E4825BEF64B50DDFFAAF359ABF9D470CDE1E7D517825DBFC`.

## Verification chronology

| Sequence | Command or action | Result |
|---:|---|---|
| 18 | Ran setup verification with an incorrect `.codex` Phase 5A path. | Failed because the manifest path was absent; no repository change resulted |
| 19 | Reran setup verification with the authorized integration evidence path. | PASS; 21 checks passed |
| 20 | Built Phase 8 in fresh external root A. | PASS; canonical full-ROM SHA preserved |
| 21 | First verifier invocation omitted required tool arguments. | Failed with a usage contract error; no artifact identity changed |
| 22 | Reran verifier A with compiler, Splat, and asm-differ arguments. | PASS |
| 23 | Built Phase 8 in fresh external root B. | PASS; canonical full-ROM SHA preserved |
| 24 | Ran verifier B with the authenticated tool inputs. | PASS |
| 25 | Compared roots A and B with the reproducibility tool. | PASS; reports and output identities were identical |
| 26 | Inspected the final scoped diff and evidence inventory. | No unrelated canonical changes were found |

The first two command corrections were procedural. They did not alter source,
configuration, build support, or generated identities.

## Authorized writes and preserved surfaces

The coherent canonical write set is:

- `src/overlays/descriptor_12/func_0026B360.c`
- `config/phase8/matching-c.json`
- `docs/matching-c/high-value-wave5-20260802/target-selection.md`
- `docs/matching-c/high-value-wave5-20260802/independent-derivation.md`
- `docs/matching-c/high-value-wave5-20260802/reproduction-procedure.md`
- `docs/matching-c/high-value-wave5-20260802/task-log.md`
- `docs/matching-c/high-value-wave5-20260802/evidence-index.md`
- `docs/matching-c/high-value-wave5-20260802/aar/20260802-ob64-matching-c-high-value-wave5-aar.md`

The parent and integration repositories remained read-only. The editor, master
ROM, emulator, RAM, controller, and savestate surfaces remained untouched. The
protected Phase 5A `_work` root was not entered or enumerated.

Generated setup outputs remain generator-owned. Generated Phase 8 outputs remain
under the two external roots. No generated artifact was copied into this
evidence root.

## Final evidence inventory

The evidence root contains these curated records:

- `target-selection.md`
- `independent-derivation.md`
- `reproduction-procedure.md`
- `task-log.md`
- `evidence-index.md`
- `aar/20260802-ob64-matching-c-high-value-wave5-aar.md`

The evidence index links every material claim to source, configuration, command,
report, or generated output identity.

## Terminal state

Terminal status: completed. The canonical changes remain uncommitted and
unstaged for Director intake. No acceptance verdict was issued.

Evidence grade: supported before independent review. Review status: pending.
Wave 6 remains outside this worker's authority.
