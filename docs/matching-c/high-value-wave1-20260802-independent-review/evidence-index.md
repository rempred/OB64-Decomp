# Independent review evidence index

## Verdict

`Accepted with corrections`.

The frozen commit passed independent technical review.
Two evidence-record corrections remain before propagation.

## Frozen subject

| Item | Identity |
|---|---|
| Canonical decomp commit | `444c99c3a163d8526ced583e1d6c63626a21f54c` |
| Frozen commit parent | `fdd9b381f025c1887111d74ebdb3f783957962aa` |
| Review profile | `PROTECTED` |
| Reviewer output root | `C:\Users\Joe\.codex\ob64-matching-c-wave1-review-20260802` |
| Worker AAR | `C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp\docs\matching-c\high-value-wave1-20260802\aar\20260802-ob64-matching-c-high-value-wave1-manifest-recovery-r2-aar.md` |
| Worker evidence index | `C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp\docs\matching-c\high-value-wave1-20260802\evidence-index.md` |

## Claim results

| Claim | Independent result | Evidence |
|---|---|---|
| Frozen file set stays inside scope. | Pass | `git diff-tree`; no forbidden generated suffixes; `git diff --check` pass. |
| Existing target remains preserved. | Pass | Fresh `verification.json`; `func_000E5938`, 36 bytes, linked text SHA-256 `26256054A9F77DAD786308548B96966D4E7A3385975A9E989CEE70DBF0268789`. |
| New pool target reproduces linked bytes. | Pass | Fresh `verification.json`; `func_0000B33C`, 168 bytes, linked text SHA-256 `B5B9786B86B3BA207A56847F26694E126F19667DAB49498E93607F9C4939A0C9`. |
| New target relocations match the contract. | Pass | Fresh verification records 13 `.rel.text` entries and one `.rel.pdr` entry. |
| Original assembly targets remain fallback-only. | Pass | Fresh verification reports `originalAssemblyTargetsNotLinked: true`. |
| Complete canonical ROM remains exact. | Pass | Fresh ROM SHA-256 and normalized master `.v64` SHA-256 both equal `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`. |
| Code-region identity remains exact. | Pass | Fresh code-region SHA-256 `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`. |
| Fresh outputs are path-independent. | Pass | Reviewer root compared with worker r2-a; report SHA-256 `6A3CFA9646E116F91D293E617F9E7C3F2E789F7FA6B24DE886ED341591FD11A6`. |
| Compiler manifest is authenticated. | Pass | Canonical file and frozen integration Git blob both resolve to `2d4cddd4ee381da7e767a7f0580de1ab67573919`; file SHA-256 `98C8ACC06A8FBF40DADBD25AE20C2539E8765E14EA12895158C37CC413D06C26`. |
| Pinned compiler is authenticated. | Pass | `cc1.exe` SHA-256 `F3F1C99A322F5B3D8C108C2A44AF1D6D084DD27575C5D60BF0F0D33FFF34B1C6`. |
| Clean-room boundary is respected by the reviewed source. | Pass within the assigned boundary | Source and candidate match; neither contains external implementation includes; external-derived implementations were not inspected. |
| Canonical tree contains no prohibited generated artifact. | Pass | Frozen changed-file list contains no ROM, object, executable, map, binary, `build/`, or `dist/` path. |

## Reviewer artifact identities

| Artifact | Path | SHA-256 |
|---|---|---|
| Build report | `C:\Users\Joe\.codex\ob64-matching-c-wave1-review-20260802\build-report.json` | `BECCF6CDCBFCDAFB68D93F140002D6E570F800C11BB3C0E9D548F5398734314D` |
| Verification report | `C:\Users\Joe\.codex\ob64-matching-c-wave1-review-20260802\verification.json` | `F8F8CC3BA73CB924BC88C8B58710DDF104C4645ADE9003A9E458B49F51879FBF` |
| Reproducibility report | `C:\Users\Joe\.codex\ob64-matching-c-wave1-review-20260802\reproducibility-vs-r2-a.json` | `6A3CFA9646E116F91D293E617F9E7C3F2E789F7FA6B24DE886ED341591FD11A6` |
| Fresh ROM | `C:\Users\Joe\.codex\ob64-matching-c-wave1-review-20260802\phase8.us_rev0.z64` | `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A` |
| Fresh ELF | `C:\Users\Joe\.codex\ob64-matching-c-wave1-review-20260802\phase8.elf` | `B6409636A96C3F0786FFE12E76CF6D822937C0DEF313307D6493744726E672B0` |
| Fresh map | `C:\Users\Joe\.codex\ob64-matching-c-wave1-review-20260802\phase8.map` | `17CEDCDCB1D5E472430B823D033F2F8B04EAC2E0EF680F9C2902EAE44835C414` |
| Fresh layout | `C:\Users\Joe\.codex\ob64-matching-c-wave1-review-20260802\layout.json` | `7709B485F5D1F21162B16ECB7294DFFA161D302420E33CF0C84A73F2BCA174F2` |
| Fresh readelf output | `C:\Users\Joe\.codex\ob64-matching-c-wave1-review-20260802\phase8.readelf.txt` | `2204158CE59A3DCBD81946FB4E7FBB844EBBD9EC478EA71CDBF9B4C4507E6C5B` |
| Fresh object manifest | `C:\Users\Joe\.codex\ob64-matching-c-wave1-review-20260802\objects\manifest.json` | `EA5D0D194E990E326C15360D5596AA217AB1F1D243E4C640054B2A50096CAE9E` |

## Corrections required

| ID | File or record | Required correction | Consequence |
|---|---|---|---|
| C-01 | `docs/matching-c/high-value-wave1-20260802/independent-derivation.md:51` | Distinguish object-text SHA-256 `22A134DAAC883CC9F33D2B7CBE82745E2DDCD284EBB8F1D1899B5F30ED6AABF9` from linked-text SHA-256 `B5B9786B86B3BA207A56847F26694E126F19667DAB49498E93607F9C4939A0C9`. | Prevents evidence attribution ambiguity. |
| C-02 | `target-selection.md` and `independent-derivation.md` | Mark the revision-1 missing-manifest statements as historical or superseded by the revision-2 AAR. | Prevents stale lifecycle status from appearing current. |

## Evidence limits

The review did not establish runtime semantics.
The worker setup report was reused because rerunning `verify_setup.js` writes under the canonical ignored `build/` tree.
The independent Phase 8 build revalidated the accepted Phase 7 input and full-ROM identity.

## Route

The Director must apply or route C-01 and C-02 before propagation.
No source or build correction is required.
