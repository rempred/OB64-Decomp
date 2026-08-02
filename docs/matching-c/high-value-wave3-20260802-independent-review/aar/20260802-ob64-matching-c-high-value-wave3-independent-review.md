# After-action report: high-value matching-C wave 3 independent review

## Outcome

Verdict: `Accepted`. The frozen commit independently reproduces the 524-byte
resolver owner, its placement, relocations, three earlier owners, and full ROM.

This matters because the Wave 3 slice is byte-exact and remains structurally
bounded. The Director may propagate the result and unlock Wave 4. No action is
required from Joe.

## Frozen subject

The reviewed canonical decomp commit is
`b0cdbc4d6efcfc1264214959ca17b3bf8c4b0399` on `main`.

The worker AAR is
`C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp\docs\matching-c\high-value-wave3-20260802\aar\20260802-ob64-matching-c-high-value-wave3-aar.md`.

The worker evidence index is
`C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp\docs\matching-c\high-value-wave3-20260802\evidence-index.md`.

The reviewed source target is structural function `func_0000BC8C`. Its worker
grade is `Supported`, and its claims remain limited to static correspondence.

## Eligibility and scope

The assignment is a Critical independent review. The worker result is complete
and review-pending. The exact frozen commit and worker evidence package exist.

The reviewer did not produce the worker result. The canonical repository was at
the frozen HEAD. The integration evidence HEAD matched the assignment.

The parent repository advanced after the worker baseline through coordination
commits `872e86f` and `463cad8`. Those commits launch and route this review. They
do not change the frozen canonical result or the Phase 8 input identities.

The reviewer wrote only under
`docs/matching-c/high-value-wave3-20260802-independent-review/`.

## Claims reviewed

The review covered target selection, owner boundaries, linked bytes, placement,
relocations, signed-low-half aliases, preservation, complete-ROM identity,
reproducibility, provenance, clean-room compliance, encoding controls, artifact
hygiene, and evidence sufficiency.

The review did not extend the worker's static scope into runtime behavior,
gameplay meaning, or editor integration.

## Review method

The review used five independent checks:

1. Inspect the frozen commit, worker package, original assembly, manifest, and resource dossier.
2. Rebuild and verify Phase 8 under a fresh reviewer-owned output root.
3. Repeat the build in a second reviewer-owned path and compare identities.
4. Hash target ranges and preserved ranges directly from the reviewer ROM.
5. Inspect object relocations and linker placement with authenticated GNU tools.

The main independent commands were:

```powershell
node tools/build_phase8_matching_c.js --output "C:\Users\Joe\.codex\ob64-matching-c-wave3-review-20260802\phase8" --phase7-output "C:\Users\Joe\.codex\ob64-phase8-matching-c-20260801\run-a\conventional" --compiler "C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe" --splat-python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --splat-split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ"
node tools/verify_phase8_matching_c.js --output "C:\Users\Joe\.codex\ob64-matching-c-wave3-review-20260802\phase8" --compiler "C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe" --splat-python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --splat-split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ" --report "C:\Users\Joe\.codex\ob64-matching-c-wave3-review-20260802\phase8\verification.json"
node tools/compare_phase8_reproducibility.js --left "C:\Users\Joe\.codex\ob64-matching-c-wave3-review-20260802\phase8" --right "C:\Users\Joe\.codex\ob64-matching-c-wave3-review-20260802\phase8-b" --report "C:\Users\Joe\.codex\ob64-matching-c-wave3-review-20260802\phase8\reproducibility.json"
```

All three commands passed. The two Phase 8 verifiers also passed.

## Direct observations

| Semantic name | Game meaning | Address | Address space | Evidence role |
|---|---|---|---|---|
| `boot_resource_record_resolve_load` | Fourth static matching-C owner | `0x0000BC8C..0x0000BE98` | z64 ROM range, end exclusive | 524-byte target boundary |
| `boot_resource_record_resolve_load` | Linked target placement | `0x8007B88C..0x8007BA98` | boot RAM virtual range, end exclusive | `.ob64.r0107` placement |
| `boot_resource_op_dispatch` | Adjacent dispatcher owner | `0x8007BA98` | boot RAM virtual address | Boundary control |
| `g_resource_directory_table` | Directory table scanned by the resolver | `0x800A8750` | boot RAM virtual address | Effective signed-low-half alias |
| `g_resource_template` | Resource initialization template | `0x800AE27C` | boot RAM virtual address | Effective signed-low-half alias |

The original assembly has one function entry and ends with `jr $ra` followed by
the stack-restore delay slot. The next dispatcher begins at the exclusive end.
The manifest part also records exactly 524 bytes and the target assembly hash.

The linked directory words are `3C10800B` and `26108750`. The signed low half
resolves the directory symbol to `0x800A8750`. The template words similarly
resolve to `0x800AE27C`. The target hash proves both original encodings remain.

## Tests and results

### Frozen file set

The frozen commit changes exactly seven attributable paths. They are the target
source, matching-C configuration, and five wave-3 handoff records. No source
assembly, ROM, object, map, executable, or bulk generated file changed.

The scoped diff check passed. The review output directory was initially absent,
and it was created only for reviewer-owned records.

### Target selection and boundary

The local resource dossier places the target in the front-end resolver path.
The target contains calls, loops, path handling, directory scanning, result
checks, and diagnostic branches. The adjacent dispatcher begins at `0xBE98`.

The accepted owner model records row `107` in section `.ob64.r0107`. The target
range is `0x0000BC8C..0x0000BE98` in z64 ROM order. Its length is `0x20C`, or
524 bytes. No secondary entry occurs inside the owner.

### Byte and relocation checks

The independent verifier reported `exact: true` for all four configured C
owners. It reported 21 target relocations and one procedure-descriptor
relocation for `func_0000BC8C`.

The reviewer object section `.ob64.r0107` is `0x20C` bytes. The linker map
asserts the target ROM range, boot RAM placement, and section size. All map
assertions pass.

The direct target SHA-256 is
`23B9E078BC45A44074A7F23B9C4C8384D8C39D5A8D39951F39739F11BDCC5424`.

### Preservation and complete ROM

The three earlier accepted target ranges match their expected hashes:

| Semantic name | z64 ROM range | Bytes | SHA-256 |
|---|---:|---:|---|
| `descriptor_02_func_000E5938` | `0x000E5938..0x000E595C` | 36 | `26256054A9F77DAD786308548B96966D4E7A3385975A9E989CEE70DBF0268789` |
| `boot_resource_pool_acquire_release` | `0x0000B33C..0x0000B3E4` | 168 | `B5B9786B86B3BA207A56847F26694E126F19667DAB49498E93607F9C4939A0C9` |
| `boot_state_slot_flagged_dispatch_lookup` | `0x00007688..0x00007768` | 224 | `4398E1D52DE73D83846A34DDB7A4A97EA669E8DA66DA321F98CFF91C0BF9BC31` |

The reviewer ROM SHA-256 is
`571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

The reviewer code-region SHA-256 is
`40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.

### Reproducibility

The second reviewer build passed in a different output path. The comparer
reported `status: pass` and `reportsIdentical: true`. ROM, ELF, map, layout,
and object-manifest hashes matched across both reviewer roots.

### Provenance and clean-room controls

The compiler hash, GNU binutils hashes, Splat hashes, and asm-differ commit
matched the authenticated values recorded by the Phase 8 build. The canonical
source and configuration hashes also matched the frozen evidence index.

The source contains constrained inline assembly for selected encodings and
delay slots. It does not contain a copied `.word` body or external-derived
source expression. The reviewer did not inspect external-derived
implementations.

### Reused setup evidence

The worker's setup reports were reused for the setup-baseline claim. The
post-edit report hash is
`B0E9FA404B81A92CA0EB23C75A3F1A534964AEB815771EE0D00CA5008F351F8D`.

The setup command was not rerun because it writes generated setup outputs in
the canonical repository. The independent Phase 8 build and verifier used a
fresh reviewer-owned output root and passed all affected exactness checks.

## Admissible findings

No admissible blocking finding exists.

The boundary test used the accepted local owner model and ordinary canonical
link path. It tested the smallest useful falsifier for overlap, omission, or a
secondary entry. It stayed within the assigned static evidence grade and
threat model.

The parent HEAD drift is a coordination observation, not a semantic finding.
The current parent commits only launch and route the review. The canonical
frozen commit and required integration HEAD remain exact.

## Evidence limits

The accepted evidence grade remains `Supported` for static structural
correspondence. Exact bytes do not prove runtime behavior or gameplay meaning.

The review does not prove editor round-trip safety, runtime loading, or semantic
field names. Those claims were outside the worker mission and remain unclaimed.

## Documentation consequences

No canonical domain document needs a correction, supersession, or closure
marker. The Director may update review state after intake. The accepted result
can proceed to Wave 4 planning.

## Exact next route

The Director must intake this reviewer report and record verdict `Accepted`.
The Director may propagate the frozen result and route Wave 4. No worker
correction or research-reopen assignment is required.
