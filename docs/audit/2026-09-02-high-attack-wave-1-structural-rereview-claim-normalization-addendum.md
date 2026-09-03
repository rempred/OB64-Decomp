# High Attack Battle Stream Structural Re-review Claim Normalization Addendum

## Purpose

This addendum records deterministic Git line-ending normalization for the immutable re-review claim. It is a lifecycle correction only. The original claim remains unchanged, and this addendum does not alter the technical re-review report, the **Revision required** verdict, or finding `HABSW1-SR-F01`.

## Affected immutable record

Path:

`docs/Plans/task-logs/ob64-high-attack-wave1-structural-correction-rereview-20260902-r1-HABSW1-SRR-20260902-01.claim.json`

The original claim has two valid content identities at different lifecycle boundaries:

| Boundary | Bytes | SHA-256 |
| --- | ---: | --- |
| Raw file preserved in the reviewer worktree | 330 | `64805C1CC3051B42F1E562795E835521654E77284B4928850CE12B5E5692FF50` |
| LF-normalized content produced by Git's clean filter | 322 | `794674DE619138E454141289245AC94B2526F17BB69C1FE891A78DBE6328E34B` |

The raw hash in the original review report and task log identifies the exact worktree claim read during review. It must not be presented as the content hash of the staged or committed Git blob. The clean hash above is the SHA-256 of that staged/committed text representation.

## Byte-level proof

The raw claim contains eight `0x0D` bytes and nine `0x0A` bytes. The `0x0D` bytes occur at zero-based raw offsets:

`1, 84, 112, 153, 215, 252, 274, 326`

Each `0x0D` is immediately followed by `0x0A`. Removing exactly those eight `0x0D` bytes, with no insertion, substitution, reordering, or other deletion, changes the length from 330 to 322 bytes and changes the SHA-256 from `64805C1CC3051B42F1E562795E835521654E77284B4928850CE12B5E5692FF50` to `794674DE619138E454141289245AC94B2526F17BB69C1FE891A78DBE6328E34B`.

The repository clean-filter contract is established by `.gitattributes` rules `* text=auto eol=lf` and `*.json text eol=lf`; `git check-attr` resolves the claim to `text: set` and `eol: lf`. Git's filtered blob SHA-1 is `e403a119b3501f9249351fbc647005ff8d4dae14`, exactly equal to the independently calculated Git-blob SHA-1 for the CR-deleted bytes. The unfiltered raw blob SHA-1 is `9ece6262245380caa00fd2c90ab1a1a149cbec26`.

This proves that LF normalization is the only content difference.

## Lifecycle interpretation

- Preserve the original claim without editing, replacing, or retargeting it.
- Use raw SHA-256 `64805C1CC3051B42F1E562795E835521654E77284B4928850CE12B5E5692FF50` only for the original worktree artifact.
- Use clean SHA-256 `794674DE619138E454141289245AC94B2526F17BB69C1FE891A78DBE6328E34B` for the exact LF content staged and stored by Git.
- Treat this addendum and its create-only claim as the durable explanation of the identity transition.

No structural evidence, accepted owner, verifier behavior, source classification, implementation, or test result changes. The technical **Revision required** verdict and `HABSW1-SR-F01` remain in force.
