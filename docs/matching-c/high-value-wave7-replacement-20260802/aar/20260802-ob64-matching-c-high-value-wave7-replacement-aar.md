# Worker AAR: Wave 7 matching-C replacement

Status: blocked. No new high-value matching-C owner was produced because the tested maintainable-C owner did not emit exact bytes, and the first candidate violated the C boundary. The Director must intake this evidence and keep independent Critical review pending; Joe need not change the canonical result from this worker handoff.

## Outcome and scope

The worker screened eligible permanent-boot owners above 1,196 and at most 1,800 z64 ROM bytes. It excluded `func_00005FC0` as required. It tested `func_000079EC` and then `func_00002D7C`.

The `func_000079EC` probes reached the requested size band, but the source used owner-wide inline assembly. That implementation did not satisfy maintainable C. The `func_00002D7C` pure-C probes emitted meaningful linked code, but v7 produced 1,708 bytes instead of 1,792 and differed in 1,403 bytes.

## Claims and evidence grades

| Claim | Grade | Review | Evidence |
|---|---|---|---|
| `func_00002D7C` is a valid size-band candidate with a provable owner boundary. | Supported | pending | [target-selection.md](../target-selection.md); [independent-derivation.md](../independent-derivation.md) |
| The pure-C model emits meaningful code but not exact owner bytes. | Verified | pending | `probe/table-v7/linked.bin`; [reproduction-procedure.md](../reproduction-procedure.md) |
| `func_000079EC` fails the maintainable-C boundary. | Supported | pending | [task-log.md](../task-log.md); external v17-v37 probe outputs |
| No replacement owner satisfies all required gates. | Supported | pending | [target-selection.md](../target-selection.md); [task-log.md](../task-log.md) |

## Changed surfaces

The worker created and updated the evidence root, including the chronological task log. It created temporary canonical C probe sources during screening and removed them after the blocker was established. No configuration changed. No accepted owner changed. No commit, stage, push, publication, or external communication occurred.

The external probe root is `C:\Users\Joe\.codex\ob64-matching-c-wave7-replacement-20260802\`. It contains the raw compiler, assembler, linker, and comparison outputs referenced by the evidence records.

## Failed paths and limits

The v17-v37 `func_000079EC` path used progressively larger inline-assembly kernels. The final structure replaced material C implementation and was stopped under the steering instruction.

The `func_00002D7C` v1-v7 path kept implementation logic in C. v5 was 1,716 bytes. v6 reached the original 0x58-byte frame size but differed in 1,405 bytes and 412 compared words. v7 was 1,708 bytes and differed in 1,403 bytes and 412 compared words.

The remaining screened candidates were not proven impossible. They were not implemented because the tested candidate already established the accepted-backend and maintainable-C blocker, while their source structures show higher boundary or scheduling risk.

## Evidence index

See [evidence-index.md](../evidence-index.md) for claims, grades, review state, identities, and artifact paths. The required AAR basename is `20260802-ob64-matching-c-high-value-wave7-replacement-aar.md`.

## Verification summary

The accepted KMC compiler, GNU MIPS assembler, GNU linker, and object copier produced the final v7 probe. The direct comparison used the original 1,792-byte owner and reported first difference `0xB`.

The two fresh Phase 8 builds, Phase 8 verifiers, and reproducibility comparison were not run. They require a valid selected owner and canonical configuration. Running them after the exact-byte and maintainable-C gates failed would not establish the required result.

The worker preserved the recorded full-ROM SHA-256 `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A` and code-region SHA-256 `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409` by leaving accepted sources and configuration unchanged.

## Protocol deviations

No mission-scope deviation affected the result. The required build and verifier gates were stopped under the prompt's explicit blocked conditions. A path typo briefly created an empty sibling directory, which was removed after verification. The worker did not modify protected repositories, launch the emulator, edit the prompt, commit, push, publish, or issue an acceptance verdict.

## Proposed canonical-document changes

No canonical semantic or domain-document change is proposed. The result is a blocked probe, not an accepted new owner. The Director may record the blocker in coordination records after independent review.

## Next action and blocker

Blocker: the accepted KMC backend did not emit exact `func_00002D7C` bytes from maintainable C, while the `func_000079EC` route required prohibited owner-wide inline assembly. Achieving an exact result now would require either a different eligible owner or compiler/backend policy work outside this mission.

Independent Critical review remains pending. This worker AAR is not an acceptance verdict.
