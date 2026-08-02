# Task log: high-value matching-C wave 3 independent review

## Terminal status

The review is complete with verdict `Accepted`. The frozen fourth matching-C
slice reproduces its 524-byte target and preserves the three earlier accepted
targets. The Director can propagate the result and unlock Wave 4.

No worker correction, research reopening, or Joe action is required.

## Review identity

| Item | Recorded value |
|---|---|
| Review assignment | `ob64-decomp-matching-c-high-value-function-wave3-independent-review-20260802` |
| Director task | `019fba30-9100-72c3-bdd2-8758a7fab9c6` on `local` |
| Frozen canonical commit | `b0cdbc4d6efcfc1264214959ca17b3bf8c4b0399` |
| Canonical branch and HEAD at review start | `main`, `b0cdbc4d6efcfc1264214959ca17b3bf8c4b0399` |
| Parent HEAD at review start | `463cad8d61f162c6fee9fe66cc65f32c5460714e` |
| Prompt and worker parent baseline | `bed88d069e2f61b941c34907bc49f868de6f6e93` |
| Integration evidence HEAD | `b22815518f060425519c08df19b617af8b5099a7` |
| Reviewer output root | `C:\Users\Joe\.codex\ob64-matching-c-wave3-review-20260802` |
| Reviewer report | `docs/matching-c/high-value-wave3-20260802-independent-review/aar/20260802-ob64-matching-c-high-value-wave3-independent-review.md` |

The parent advanced after the worker baseline through coordination commits
`872e86f` and `463cad8`. The commits launch and route this review. They do not
change the frozen canonical result or its Phase 8 inputs.

The canonical review-output directory was absent at start. No other writer was
present on that surface. The frozen source, configuration, and worker evidence
remained read-only.

## Review method

The review used direct frozen-commit inspection, independent Phase 8 rebuild,
independent byte-range hashing, relocation inspection, and reproducibility
comparison. Generated outputs stayed under the reviewer-owned external root.

The review did not operate the emulator. The worker claims are static
structural claims, so runtime proof is outside this assignment.

## Commands and results

| Sequence | Exact command or action | Result |
|---:|---|---|
| 1 | Read `AGENTS.md`, `docs/Reviewer-workflow.md`, `OB64 Decomp/AGENTS.md`, the ready prompt, `OB64 Decomp/docs/WORKFLOW.md`, and `OB64 Decomp/docs/TOOLCHAIN.md`. | PASS; review authority, protected surfaces, and static evidence scope were confirmed. |
| 2 | Record branch and HEAD for the parent, canonical, and integration repositories. | PASS; canonical and integration matched the frozen identities. Parent drift was coordination-only. |
| 3 | Inspect frozen commit `b0cdbc4d6efcfc1264214959ca17b3bf8c4b0399` and the worker AAR and evidence index. | PASS; worker result was complete and review-pending. |
| 4 | `git diff-tree --no-commit-id --name-status -r b0cdbc4d6efcfc1264214959ca17b3bf8c4b0399` | PASS; exactly the source, matching-C configuration, and five wave-3 handoff files changed. |
| 5 | Run `node tools/build_phase8_matching_c.js` into `C:\Users\Joe\.codex\ob64-matching-c-wave3-review-20260802\phase8`. | PASS; ROM SHA-256 was `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`. |
| 6 | Run `node tools/verify_phase8_matching_c.js` with a reviewer-owned `verification.json`. | PASS; target, relocation, preservation, and full-ROM checks passed. |
| 7 | Build and verify a second output under `C:\Users\Joe\.codex\ob64-matching-c-wave3-review-20260802\phase8-b`. | PASS; the second ROM and verification passed. |
| 8 | Run `node tools/compare_phase8_reproducibility.js` on the two reviewer outputs. | PASS; reports and generated identities matched. |
| 9 | Independently hash the full ROM, code region, target, and all three earlier accepted ranges. | PASS; every computed hash matched the accepted values. |
| 10 | Inspect `func_0000BC8C` object sections and relocations with authenticated GNU `readelf`. | PASS; `.ob64.r0107` is `0x20C` bytes, with 21 relocation entries and one `.rel.pdr` entry. |
| 11 | Inspect the linker map and signed-low-half instruction words. | PASS; placement, aliases, and boundary assertions remain exact. |
| 12 | Inspect changed paths, diff check, and external-artifact scan. | PASS; no generated ROM, object, map, or bulk artifact entered the canonical commit. |

The first direct-hash command contained a PowerShell literal typo. It failed
before execution and produced no evidence. The corrected command ran unchanged
and passed all checks.

## Direct observations

| Semantic name | Game meaning | Address | Address space | Evidence role |
|---|---|---|---|---|
| `boot_resource_record_resolve_load` | Fourth static matching-C owner | `0x0000BC8C..0x0000BE98` | z64 ROM range, end exclusive | 524-byte target boundary |
| `boot_resource_record_resolve_load` | Linked target placement | `0x8007B88C..0x8007BA98` | boot RAM virtual range, end exclusive | `.ob64.r0107` placement |
| `boot_resource_op_dispatch` | Next function after the reviewed owner | `0x8007BA98` | boot RAM virtual address | Adjacent-boundary control |
| `g_resource_directory_table` | Directory table scanned by the resolver | `0x800A8750` | boot RAM virtual address | Effective signed-low-half alias |
| `g_resource_template` | Resource initialization template | `0x800AE27C` | boot RAM virtual address | Effective signed-low-half alias |

The reviewed original assembly contains one function label and ends with
`jr $ra` plus its stack-restore delay slot. The adjacent dispatcher begins at
the exclusive end address. No secondary entry appears inside the target.

The linked directory words are `lui $s0,0x800B` and `addiu $s0,$s0,-0x78B0`.
Their sign-extended sum is `0x800A8750`. The template words similarly resolve
to `0x800AE27C`. Exact target bytes preserve both original encodings.

## Review findings

No admissible blocking finding exists.

The boundary check was an acceptance test. Its producer is the accepted local
original-MIPS owner model and canonical Phase 8 linker input. Its ordinary path
is the normal source-to-link build. A boundary failure would overlap the next
function or omit target bytes. Comparing the owner range, adjacent dispatcher,
and exact linked bytes is the smallest useful falsifier for this claim.

The test remains inside the worker's static evidence grade and assigned threat
model. It does not test runtime meaning or arbitrary hostile state mutation.

## Reused frozen evidence

The worker setup reports were reused for the setup-baseline claim. The review
did not rerun the setup command because its generated outputs belong under the
fresh reviewer root, while the independent Phase 8 build exercised the frozen
models and all four matching-C owners.

The reused post-edit setup report has SHA-256
`B0E9FA404B81A92CA0EB23C75A3F1A534964AEB815771EE0D00CA5008F351F8D`.

## Independent result summary

- The frozen target source and configuration reproduce the exact linked bytes.
- The target symbol remains at boot RAM virtual address `0x8007B88C`.
- The target remains in section `.ob64.r0107` with ROM load range `0x0000BC8C..0x0000BE98`.
- The object contains 21 `.rel.ob64.r0107` relocations and one `.rel.pdr` relocation.
- All four configured C owners report `exact: true` through asm-differ.
- The three earlier accepted target hashes remain exact.
- The canonical ROM and code-region hashes remain exact.
- Two reviewer-owned build roots produce identical reports and outputs.
- The changed canonical paths contain no generated build artifact.
- The source uses constrained inline assembly without copying the original body.
- No external-derived implementation was inspected or entered the canonical commit.

The reviewed worker claims remain limited to static structural correspondence.
The review does not promote runtime behavior, gameplay meaning, or editor use.

## Documentation consequences and route

No canonical domain correction, supersession, or closure marker is required.
The Director may record `review: accepted` for the frozen result and propagate
the matching-C status after intake. The exact route is Wave 4 planning.
