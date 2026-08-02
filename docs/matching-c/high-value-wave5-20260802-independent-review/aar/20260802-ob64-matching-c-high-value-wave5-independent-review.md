# Critical independent review: Wave 5 matching C

## Verdict

Verdict: Accepted.

The frozen result correctly adds one bounded 1,156-byte static C owner. A fresh reviewer build and verifier reproduced the exact target, earlier owners, code region, and full ROM. This preserves the value of the Wave 5 slice and permits Director propagation; no action is required from Joe.

## Frozen subject

- Assignment: ob64-decomp-matching-c-high-value-function-wave5-independent-review-20260802, revision 1.
- Director task: 019fba30-9100-72c3-bdd2-8758a7fab9c6 on local.
- Canonical repository: C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp.
- Frozen commit: 470d7c4f9686e73f728d23862601c9d97a9110b2.
- Frozen branch and HEAD: main at 470d7c4f9686e73f728d23862601c9d97a9110b2.
- Worker result: completed and review-pending.
- Worker AAR: docs/matching-c/high-value-wave5-20260802/aar/20260802-ob64-matching-c-high-value-wave5-aar.md.
- Worker evidence index: docs/matching-c/high-value-wave5-20260802/evidence-index.md.

The frozen commit changes exactly eight declared files. It adds one C source, one matching-C configuration entry, and six curated worker records. Its scoped working tree is clean, and its Git index is unstaged.

## Claims reviewed

The review covered these material static claims:

1. Target selection satisfies the Wave 5 size and control-path requirements.
2. The owner boundary ends at the return instruction and has no secondary entry.
3. Overlay descriptor 12 places the owner at the declared runtime range.
4. The C source reproduces the original linked bytes and relocations.
5. The five earlier C owners remain exact.
6. The canonical ROM and code region remain exact.
7. Two build roots preserve path-independent identities.
8. Tool, input, and clean-room provenance remain authenticated.
9. The evidence package contains no prohibited generated artifacts.

The worker made only structural claims. This review therefore required static and build evidence, not runtime gameplay evidence.

## Review method

I used direct frozen-commit inspection, independent hash recomputation, overlay mapping arithmetic, canonical ROM-slice comparison, and a fresh Phase 8 build. I ran the accepted Phase 8 verifier and compared the fresh output with the frozen worker build. I used no emulator, ROM patch, savestate, protected integration-root traversal, or mutation of the frozen result.

The review's smallest falsifier was the selected owner slice. It tests the boundary, source bytes, link placement, relocations, and full-ROM preservation together. The producer is the canonical assembly and the accepted Phase 8 build pipeline. The test stays within the worker's static evidence grade and assigned threat model.

## Tests and results

### Frozen result and target identity

Direct Git inspection returned the expected worker file set:

    config/phase8/matching-c.json
    src/overlays/descriptor_12/func_0026B360.c
    docs/matching-c/high-value-wave5-20260802/target-selection.md
    docs/matching-c/high-value-wave5-20260802/independent-derivation.md
    docs/matching-c/high-value-wave5-20260802/reproduction-procedure.md
    docs/matching-c/high-value-wave5-20260802/task-log.md
    docs/matching-c/high-value-wave5-20260802/evidence-index.md
    docs/matching-c/high-value-wave5-20260802/aar/20260802-ob64-matching-c-high-value-wave5-aar.md

The target source SHA-256 is A83A9A2FB003C77D861ECDA7897D0E28A93D5DCB9093E16291E35A6CD27F8DB8. The original assembly SHA-256 is 2DE06BCC819A1176A23E31A6F1FB7C7267702F99F3A7D52EB4757BCEF609AC73. The matching-C configuration SHA-256 is E07A2C3A2E58478EF5F76BD1C168B97026920B9ADC35A5306E847017C55B6BD4.

The selected owner spans z64 ROM range 0x0026B360..0x0026B7E4, end exclusive. It has 1,156 bytes, which satisfies the greater-than-808 and at-most-1,280-byte Wave 5 boundary. The canonical assembly contains 289 words, one final jr $ra, and its delay slot. Comparing those words with the fresh canonical z64 ROM slice produced zero mismatches.

The context artifact records one function, a 128-byte frame, an indirect jump, no secondary entries, and no in-range callees. Its SHA-256 is 49619787B75DDF3A179274D3332783144A4B2F6D7A701CF8F54DF23331B7E256.

### Overlay placement

Overlay descriptor 12 has raw SHA-256 998FF913EC9C6AC3D5BDD3C3C24F78D0225D8C70D3F64AF0CC100CCAAA3BFBAA. Its ROM range is 0x0025EE90..0x00275850, and its text runtime range is 0x8020A2E0..0x8021F450.

The selected owner begins at runtime address 0x802167B0 and ends at 0x80216C34. The ROM and runtime offsets from the descriptor start are both 0xC4D0. The target is therefore contained by the descriptor and uses the validated overlay mapping.

The fresh linker map places section .ob64.r4834 at runtime address 0x802167B0 with length 0x484. The linked owner is objects/c/func_0026B360.o.

### Fresh independent build

I ran this command from the canonical repository:

    node tools/build_phase8_matching_c.js --output "C:\Users\Joe\.codex\ob64-matching-c-wave5-review-20260802\phase8-review" --phase7-output "C:\Users\Joe\.codex\ob64-phase8-matching-c-20260801\run-a\conventional" --compiler "C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe" --splat-python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --splat-split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ"

The build passed. It produced full-ROM SHA-256 571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A and code-region SHA-256 40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409.

The fresh target has linked-text SHA-256 5342CBA0C83FCFE9E4825BEF64B50DDFFAAF359ABF9D470CDE1E7D517825DBFC. The linked section has 1,156 bytes and 30 recorded relocations. The relocation list contains 29 .rel.text entries and one .rel.pdr entry. Every configured relocation matches the verifier output.

### Fresh verifier and preservation

I ran the accepted verifier with the same authenticated inputs and wrote its report under the reviewer-owned root:

    node tools/verify_phase8_matching_c.js --output "C:\Users\Joe\.codex\ob64-matching-c-wave5-review-20260802\phase8-review" --compiler "C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe" --splat-python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --splat-split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ" --report "C:\Users\Joe\.codex\ob64-matching-c-wave5-review-20260802\phase8-review\verification.json"

The verifier passed. It reports 7,242 primary rows, 7,251 executable slices, 19 overlay reservations, and six matching-C owners. It reports full-ROM exactness, preservation of all accepted rows and slices, preservation of all overlay descriptors, and no linked original-assembly target.

asm-differ reports exact matches for all six owners. The selected owner has 289 rows, score zero, and maximum score 28,900. The five earlier owners also have score zero and exact status.

### Reproducibility

I compared the fresh reviewer build with the frozen worker build:

    node tools/compare_phase8_reproducibility.js --left "C:\Users\Joe\.codex\ob64-matching-c-wave5-review-20260802\phase8-review" --right "C:\Users\Joe\.codex\ob64-matching-c-wave5-20260802-a\phase8-final-a" --report "C:\Users\Joe\.codex\ob64-matching-c-wave5-review-20260802\phase8-review\reproducibility-vs-worker-a.json"

The comparison passed. The build report, verifier report, ELF, map, ROM, layout, readelf output, object manifest, target identities, and asm-differ results are identical to the worker build. The worker's independent A/B comparison also passed.

### Provenance and clean-room boundary

The fresh build authenticated the KMC compiler at F3F1C99A322F5B3D8C108C2A44AF1D6D084DD27575C5D60BF0F0D33FFF34B1C6. It recorded asm-differ commit 093360aa31f90e67216ed1971c4087516cc7b940, the accepted Splat input hashes, the Phase 8 configuration hash, and the target source hash.

The target source uses structural field names and canonical assembly-derived control flow. The frozen commit contains no external-derived implementation, binary, executable, ROM, object, or map artifact. The evidence package records the clean-room derivation, while this review does not claim to reconstruct the worker's private authoring history.

The parent repository currently has unrelated dirty work and a different HEAD from the worker's recorded parent baseline. The parent remained read-only, and the fresh build consumed the authenticated Phase 7 output and canonical decomp inputs. This coordination difference does not affect the frozen result.

## Findings

No admissible blocking findings were found. The review found no correctness, boundary, relocation, preservation, provenance, protocol, or evidence-package defect. No correction worker or proportional re-review is required.

## Reused frozen evidence

I reused the worker's completed AAR, evidence index, target-selection record, independent derivation, reproduction procedure, task log, and setup report by their recorded paths and hashes. I independently recomputed the target source, assembly, configuration, overlay configuration, compiler, fresh build, verifier, and reproducibility identities.

The frozen setup report was reused by identity. I did not rerun setup verification because that command writes generated output under the protected canonical repository. The fresh Phase 8 build and verifier independently exercised the accepted inputs and preserved the same exact ROM and code-region identities.

## Evidence limits

This verdict accepts static structural correspondence only. It does not promote gameplay meanings, runtime behavior, editor behavior, or cross-host portability. No runtime or cold-boot evidence was assigned, and none is required for the worker's claim.

The parent function database remains a boundary lead. The direct assembly word count, return boundary, ROM comparison, overlay delta, and fresh linker map provide the acceptance evidence.

## Documentation consequences

This review adds only reviewer-owned records under:

    C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp\docs\matching-c\high-value-wave5-20260802-independent-review\

No canonical domain document requires correction. The Director may propagate the accepted structural owner and update coordination status. Semantic naming remains outside this verdict.

## Exact next route

Director intake may record Verdict: Accepted for frozen commit 470d7c4f9686e73f728d23862601c9d97a9110b2. The Director may propagate Wave 5 and route the next program phase under its existing gates. No worker correction, review replacement, push, publication, or external action is authorized by this report.
