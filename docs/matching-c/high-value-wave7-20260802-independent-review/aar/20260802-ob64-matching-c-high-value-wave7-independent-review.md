# Critical independent review: Wave 7 matching C

Verdict: `Revision required`.

The frozen result is byte-exact, correctly placed, reproducible, and clean-room compliant. It fails the assigned maintainable-C gate because the inline layout anchor emits the entire owner. The Director must route a worker correction and proportional Critical re-review. No action is required from Joe.

## Frozen subject

The review covers canonical decomp commit
`1872b09872b50202341c0e9c097ac24951dedea5`.

The reviewed owner is `func_00005FC0`. Its semantic role is a boot task and
state-dispatch owner. Its target range is z64 ROM
`0x00005FC0..0x000065A4`, end exclusive.

| Semantic name | Game meaning | Address | Address space | Evidence role |
|---|---|---:|---|---|
| Boot task-dispatch owner | Permanent boot control path | `0x00005FC0..0x000065A4` | z64 ROM interval | Reviewed 1,508-byte owner |
| Boot task-dispatch owner | Permanent boot control path | `0x80075BC0..0x800761A4` | fixed boot RAM interval | Placement contract |
| Callback-index selector | Local secondary entry | `0x00006550` | z64 ROM offset | Internal successor |
| Default callback-result leaf | Local tail entry | `0x00006588` | z64 ROM offset | Internal successor |
| Status-completion leaf | Local tail entry | `0x00006594` | z64 ROM offset | Internal successor |
| Linked target section | Matching-C owner section | `.ob64.r0056` | linker section | Placement and size |

The canonical tree was clean at this frozen subject. The parent workspace was
read-only and started at current HEAD
`ebe54a7fd7065a61183e30baadb01da4d8228790`.

The prompt records parent baseline
`1db6c40377fa7bb282db9bb7334f9a8cde1a9e40`. This drift did not affect review.

The canonical and integration starting identities match the prompt:

- Canonical decomp: `1872b09872b50202341c0e9c097ac24951dedea5`.
- Integration evidence: `b22815518f060425519c08df19b617af8b5099a7`.

The review did not traverse the protected integration `_work` root.

## Claims reviewed

The review evaluated these claims:

- The selected owner has the declared size and boundary.
- The target has exact bytes and fixed-boot placement.
- The target has no relocations.
- Seven earlier C owners remain preserved.
- Two fresh builds are path-independent.
- The evidence package is internally consistent.
- The derivation respects the clean-room boundary.
- The hybrid source satisfies the maintainable-C requirement.

The review treated the result as static structural evidence. It did not require
runtime proof because the worker made no gameplay or runtime behavior claim.

## Review method

The reviewer used direct commit inspection, independent byte recomputation, a
fresh authenticated Phase 8 build, verification, and a reproducibility check.

The reviewer parsed the original `.word` stream independently. The stream has
377 words and 1,508 bytes. Its hash is
`08B5A10F4A00B892D8CBE99A62BC7F823FBB7A6B4EB9FB488D1BC2EFC341B50B`.

The reviewer compared those bytes with the fresh rebuilt ROM and the normalized
master `.v64` ROM. All three target slices matched.

The reviewer ran the accepted KMC compiler, Splat runtime, split script, and
asm-differ checkout. The fresh build and verifier passed.

The reviewer compared the fresh build against the worker's final root. The
reproducibility report recorded `reportsIdentical: true`.

## Tests and results

| Check | Result | Direct observation |
|---|---|---|
| Frozen file set | PASS | The frozen commit changes nine allowed files. No ROM, object, executable, map, or bulk artifact is tracked. |
| Target boundary | PASS | The assembly stream covers 1,508 bytes. The linked size is `0x5E4`. The local entries remain inside the declared owner. |
| Target bytes | PASS | The independently parsed assembly, rebuilt ROM slice, and normalized master slice have the same hash. |
| Target placement | PASS | `.ob64.r0056` links at fixed boot RAM `0x80075BC0` with ROM load `0x00005FC0`. |
| Target relocations | PASS | The target relocation array is empty. |
| Earlier owners | PASS | The verifier reports 7,242 preserved rows, 7,251 preserved slices, and 19 preserved overlay reservations. |
| Full ROM | PASS | The rebuilt ROM hash is `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`. |
| Code region | PASS | The rebuilt code-region hash is `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`. |
| Fresh verifier | PASS | The verification report records exact target bytes and no linked original fallback target. |
| Reproducibility | PASS | Reviewer and worker outputs compare with `reportsIdentical: true`. |
| Evidence consistency | PASS | The corrected AAR assigns the reproducibility hash to the reproducibility artifact. |
| Maintainable C | FAIL | The compiler output emits the full owner from inline `.word` data. No semantic C model symbol is emitted. |

The first verifier command failed before verification because the reviewer
mistyped the authenticated `split.py` path. The corrected command passed.

## Admissible finding

### Finding ID: W7-MC-01

Finding: The target source does not satisfy the assigned maintainable-C
requirement. The 1,508-byte owner is emitted by an inline `.word` layout anchor.

Failed assigned claim or gate: The hybrid source must satisfy the maintainable-C
requirement while preserving exact target bytes.

Frozen subject: Canonical decomp commit
`1872b09872b50202341c0e9c097ac24951dedea5`, owner `func_00005FC0`.

Direct observation: The source contains 377 `.word` directives in its inline
assembly anchor. The model functions are `static inline` and marked unused.
The fresh compiler output contains no model symbol. It contains the full target
anchor, and the target object contains no emitted C-model function.

Reachable producer path: The ordinary Phase 8 build compiles the frozen source
for row `56` and links `.ob64.r0056`. This path produced the observed target.

Material consequence: The accepted owner would be assembly bytes wrapped in a
C file. Future edits to the semantic model cannot change the linked owner.
Acceptance would therefore misclassify an assembly fallback as maintainable C.

Smallest correction boundary: Replace the full-owner layout anchor with
compiler-generated C that preserves the exact target. Keep the original
assembly as fallback. Rerun target bytes, placement, relocations, preservation,
and reproducibility checks, then repeat Critical review.

This is an acceptance test within the declared static evidence grade. It uses
the normal compiler producer and does not construct an excluded hostile state.

## Reused frozen evidence

The review used these worker records:

- `docs/matching-c/high-value-wave7-20260802/target-selection.md`
- `docs/matching-c/high-value-wave7-20260802/independent-derivation.md`
- `docs/matching-c/high-value-wave7-20260802/reproduction-procedure.md`
- `docs/matching-c/high-value-wave7-20260802/task-log.md`
- `docs/matching-c/high-value-wave7-20260802/evidence-index.md`
- `docs/matching-c/high-value-wave7-20260802/aar/20260802-ob64-matching-c-high-value-wave7-aar.md`
- `docs/matching-c/high-value-wave7-20260802/aar/20260802-ob64-matching-c-high-value-wave7-evidence-consistency-correction-aar.md`

The reviewer-owned evidence index and task log are in
`docs/matching-c/high-value-wave7-20260802-independent-review/`.

Fresh generated outputs remain outside Git under
`C:\Users\Joe\.codex\ob64-matching-c-wave7-review-20260802`.

The fresh build report hash is
`0BEA7BD4DB191849EA0481A3836E326809E9C2095624AE43D27F2A04E27C39C2`.

The fresh verification report hash is
`334399C94C61A50EBB0BF6AF2E19C958E866B4E9BC36ECD9F8614E791751782B`.

The fresh reproducibility report hash is
`B1E0E72EAD3E43571167407F74FD71F0741CA8002B35D8FAF8DCEDBD96DE7F26`.

## Evidence limits

The review proves static byte identity, placement, preservation, and build
provenance. It does not prove gameplay semantics or runtime behavior.

The worker's structural C model remains useful evidence of an independently
derived interpretation. The model is not the emitted implementation.

The review did not inspect external-derived implementations. It did not enter
the protected integration work root. It did not modify the frozen result.

## Documentation consequences

The Director must not propagate this owner as accepted matching C. The Director
must preserve the exact-byte evidence and the disclosed anchor limitation.

No canonical domain-document update is proposed before correction.

## Exact next route

The permitted verdict is `Revision required`.

The Director must route `W7-MC-01` to a correction worker. The correction must
replace the full-owner anchor with compiler-generated C or return with a new
research question if the accepted backend cannot support that path.

The Director must obtain a proportional Critical re-review after correction.
