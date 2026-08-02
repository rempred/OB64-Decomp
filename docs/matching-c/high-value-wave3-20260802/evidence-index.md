# Evidence index

The worker result is complete and review-pending. This index maps each material
claim to its evidence and records the review state. The Director must route the
package for fresh Critical review.

No action is required from Joe during worker intake.

## Claim index

| Claim | Evidence artifact | Command or check | Result and review state |
|---|---|---|---|
| The setup baseline passed before edits. | `build/setup/verify-setup-report.json` and baseline task notes | `node tools/verify_setup.js --phase5a-root "C:\\Users\\Joe\\Projects\\OB64-Decomp-Hijs-Integration\\docs\\external-intake\\phase5-boundary-segment-reconciliation-static-20260731"` | `ok: true`; all 21 checks passed before source edits. Supported; review pending. |
| The selected owner satisfies the assignment boundary. | `target-selection.md`; accepted row `107`; resource dossier | Owner `.ob64.r0107` spans z64 ROM `0x0000BC8C..0x0000BE98`, or 524 bytes. It is resolver/load logic with multiple calls, loops, and branches. Supported; review pending. |
| The C source independently derives the observed behavior. | `independent-derivation.md`; `src/boot/boot_resource_record_resolve_load.c` | Pinned KMC compilation and GNU assembly under the accepted Phase 8 build | The source maps the flagged path, path normalization, directory scan, load path, result checks, and diagnostic tail. Supported; review pending. |
| The compiled target has the accepted object identity. | Root A `objects/c/func_0000BC8C.o`; build report | Phase 8 target object shape, hash, symbol, and relocation checks | `.text` is 524 bytes with SHA-256 `5302930D9D0E9D22D8AEF4EF57C2B57B111E37DDB2882362EF6C1427BFED09B0`. Supported; review pending. |
| The linked target matches the original bytes. | Root A `verification.json`; original assembly fallback object | `node tools/verify_phase8_matching_c.js ... --report ...\\verification.json` | Target SHA-256 is `23B9E078BC45A44074A7F23B9C4C8384D8C39D5A8D39951F39739F11BDCC5424`; asm-differ reports `exact: true`. Supported; review pending. |
| The target placement and relocation contract are preserved. | Root A `verification.json`; `config/phase8/matching-c.json` | Phase 8 target placement and relocation verification | Symbol value is `0x8007B88C`; section is `.ob64.r0107`; 21 `.rel.text` records and one `.rel.pdr` record pass. Supported; review pending. |
| Existing accepted targets remain exact. | Root A `verification.json` | Phase 8 preservation and target verification | Four C owners are exact. `acceptedRowsPreserved: 7242`; `acceptedSlicesPreserved: 7251`; `overlayDescriptorsPreserved: 19`; `originalAssemblyTargetsNotLinked: true`. Supported; review pending. |
| The conventional full ROM remains exact. | Root A `phase8.us_rev0.z64`; verification report | Phase 8 build and verifier | ROM SHA-256 is `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`. Supported; review pending. |
| Both fresh roots reproduce path-independent identities. | Root A and root B reports; root A `reproducibility.json` | `node tools/compare_phase8_reproducibility.js --left ... --right ... --report ...` | PASS; all compared identities match. Reproducibility report SHA-256 is `71D72748C64FC22A69B57158032F0A5EF7021FD5EC5EBFA82EA8094E8D268BA3`. Supported; review pending. |
| The post-edit setup remains valid. | `build/setup/verify-setup-report.json` | Required explicit-root setup command rerun after final edits | All 21 checks passed. Code-region SHA-256 remains `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`. Supported; review pending. |
| The canonical tree contains no generated build artifact. | Scoped Git inventory; `task-log.md` | Scoped `git status --short --untracked-files=all` and final diff checks | Only source, configuration, and wave3 evidence files are attributable. Build outputs remain external. Supported; review pending. |

## Artifact identities

| Artifact | Identity |
|---|---|
| Canonical ROM | SHA-256 `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A` |
| Canonical code region | SHA-256 `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409` |
| Original assembly | `asm/original/rev0/boot/boot_resource_record_resolve_load.s`; SHA-256 `B77775732A4D474596FCEB6369CF286A784ED86AC2A1442B1D60B94BCC9DB04E` |
| Matching-C source | `src/boot/boot_resource_record_resolve_load.c`; SHA-256 `1DD83FE80C651B037F67238CA6E6FF03C441469F869F1630F7316D0C89D73068` |
| Phase 8 configuration | `config/phase8/matching-c.json`; SHA-256 `454AC010D93FD6C583C5C5F8A8F00F3E50D2A79B5A7A8476131648B9F7060BCD` |
| Matching C object `.text` | Root A `objects/c/func_0000BC8C.o`; SHA-256 `5302930D9D0E9D22D8AEF4EF57C2B57B111E37DDB2882362EF6C1427BFED09B0` |
| Linked target section | Root A `.ob64.r0107`; SHA-256 `23B9E078BC45A44074A7F23B9C4C8384D8C39D5A8D39951F39739F11BDCC5424` |
| Phase 8 build report | Root A `build-report.json`; SHA-256 `13A7469457B5909905E34C8DF8E7F2DE96B13628709C7987142B9390D5516FD1` |
| Phase 8 verification report | Root A `verification.json`; SHA-256 `8AAF145E4FEA0B71708B6665D4AAC53FDAB116E007000B4AC204C582CA1A174E` |
| Phase 8 reproducibility report | Root A `reproducibility.json`; SHA-256 `71D72748C64FC22A69B57158032F0A5EF7021FD5EC5EBFA82EA8094E8D268BA3` |
| Setup report | `build/setup/verify-setup-report.json`; SHA-256 `B0E9FA404B81A92CA0EB23C75A3F1A534964AEB815771EE0D00CA5008F351F8D` |

The raw Phase 8 artifacts remain outside the canonical repository. The
canonical repository contains only the source, configuration, and handoff
evidence required by this assignment.

## Review state

Every claim above is `Supported` before independent review. The worker did not
accept the result. Runtime behavior, gameplay field meaning, and editor impact
remain outside this mission.
