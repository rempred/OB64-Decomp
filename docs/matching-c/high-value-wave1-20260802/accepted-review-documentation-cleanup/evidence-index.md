# Accepted-review documentation cleanup evidence index

## Claims

| Claim | Evidence grade | Review status | Supporting artifact | What it proves |
|---|---|---|---|---|
| C-01 distinguishes object-text and linked-text hashes. | Verified | Pending Director intake | independent-derivation.md local exact proof; independent-review AAR C-01 | The object-text SHA-256 is 22A134DAAC883CC9F33D2B7CBE82745E2DDCD284EBB8F1D1899B5F30ED6AABF9, and the linked-text SHA-256 is B5B9786B86B3BA207A56847F26694E126F19667DAB49498E93607F9C4939A0C9. |
| C-02 marks the revision-1 blocker as historical in target-selection.md. | Verified | Pending Director intake | target-selection.md Correction - 2026-08-02 | The document states that the Phase 6 compiler manifest is present and authenticated, then cites the revision-2 recovery AAR. |
| C-02 marks the revision-1 blocker as historical in independent-derivation.md. | Verified | Pending Director intake | independent-derivation.md Correction - 2026-08-02 | The document states that the Phase 6 compiler manifest is present and authenticated, then cites the revision-2 recovery AAR. |
| The revision-1 blocked AAR is unchanged. | Verified | Pending Director intake | Baseline Git object and final byte comparison | The blocked AAR remains byte-identical to canonical commit 6082c2f755d08dcfc514a28c12b145c3085818db. |
| Independent-review records are unchanged. | Verified | Pending Director intake | Baseline Git objects and final byte comparison | The independent-review AAR, evidence index, and task log remain byte-identical to the accepted-review baseline. |
| No technical behavior changed. | Verified | Pending Director intake | Scoped final status and diff | Only the two named evidence documents and cleanup-owned records differ. |

## Commands

~~~powershell
rg -n "Correction - 2026-08-02|canonical Phase 6 compiler manifest is present and authenticated|object-text SHA-256|linked-text SHA-256" docs/matching-c/high-value-wave1-20260802/target-selection.md docs/matching-c/high-value-wave1-20260802/independent-derivation.md
~~~

Expected result: two dated Correction markers, two authenticated-manifest claims, one object-text hash label, and one linked-text hash label.

~~~powershell
git diff --check -- docs/matching-c/high-value-wave1-20260802/target-selection.md docs/matching-c/high-value-wave1-20260802/independent-derivation.md
~~~

Expected result: exit code 0 with no whitespace diagnostics.

## Baseline identities

| Artifact | Bytes | SHA-256 |
|---|---:|---|
| Canonical accepted-review HEAD | Git commit | 6082c2f755d08dcfc514a28c12b145c3085818db |
| Revision-1 blocked AAR | 6145 | 94EBA8490E1B78ADA77E8A4309121F2174F6865C2E3BEBA80976C1CE6E72A164 |
| Independent-review AAR | 7771 | 7508DC0FE1D545470110594538A49722F89047CE5C15A9A834B9395704BD4F72 |
| Independent-review evidence index | 5596 | 529C44A0757397178BE1F559134F97FE133A54BD98196BD3E81364A0F037DA81 |
| Independent-review task log | 9915 | 82C66E96744B57AE54F37E3BCACDAAA58456BBDD942A46D7F4DE6A3A4BBFB105 |
| Revision-2 recovery AAR | 10177 | 60D4DD3B65F45DACC2F1A29F3C7FA339EE06A2BEC6C76791638ADD525DEFEC63 |

## Protected surfaces

- Parent research repository: read-only.
- Independent-review records: read-only and byte-preserved.
- Revision-1 blocked AAR: read-only and byte-preserved.
- Source, configuration, manifest, tools, tests, generated outputs, ROM, emulator, RAM, controller input, and savestates: untouched.

## Handoff

The cleanup result is complete and uncommitted. The Director owns intake and accepted-result propagation.
