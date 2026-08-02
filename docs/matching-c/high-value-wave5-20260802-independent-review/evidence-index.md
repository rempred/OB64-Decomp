# Wave 5 independent-review evidence index

## Verdict and subject

| Item | Result |
|---|---|
| Review assignment | ob64-decomp-matching-c-high-value-function-wave5-independent-review-20260802, revision 1 |
| Director task | 019fba30-9100-72c3-bdd2-8758a7fab9c6 on local |
| Verdict | Accepted |
| Frozen repository | C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp |
| Frozen commit | 470d7c4f9686e73f728d23862601c9d97a9110b2 |
| Frozen branch | main |
| Worker AAR | docs/matching-c/high-value-wave5-20260802/aar/20260802-ob64-matching-c-high-value-wave5-aar.md |
| Worker evidence index | docs/matching-c/high-value-wave5-20260802/evidence-index.md |
| Reviewer output root | C:\Users\Joe\.codex\ob64-matching-c-wave5-review-20260802\phase8-review |

## Claim-to-evidence map

| Claim | Independent evidence | Result |
|---|---|---|
| Wave 5 size boundary | Target range 0x0026B360..0x0026B7E4; 1,156 bytes; 289 words | Pass |
| Exact function boundary | Final jr $ra at 0x0026B7DC with delay slot at 0x0026B7E0; successor begins at 0x0026B7E4 | Pass |
| No secondary entry | build/context/rev0-function-context-0026B360-0026B7E4.json; one function; empty secondaryEntries | Pass |
| Overlay placement | Descriptor 12; target runtime range 0x802167B0..0x80216C34; matching 0xC4D0 ROM/runtime deltas | Pass |
| Linked target bytes | Fresh verifier target text SHA-256 5342CBA0C83FCFE9E4825BEF64B50DDFFAAF359ABF9D470CDE1E7D517825DBFC | Pass |
| Relocations | Fresh verifier target record; 29 .rel.text entries and one .rel.pdr entry | Pass |
| Earlier owners | Fresh asm-differ report; five earlier owners have score zero and exact status | Pass |
| Full ROM | Fresh ROM SHA-256 571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A | Pass |
| Code region | Fresh code-region SHA-256 40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409 | Pass |
| Reproducibility | Fresh reviewer build compared with worker build A; comparison passed | Pass |
| Provenance | Fresh build report records accepted input hashes, compiler hash, Splat hashes, and asm-differ commit | Pass |
| Clean-room boundary | Frozen tree contains only source, config, and curated Markdown; no external-derived implementation or generated binary | Pass |

## Direct identity checks

| Artifact | Bytes | SHA-256 |
|---|---:|---|
| Target C source | 10,573 | A83A9A2FB003C77D861ECDA7897D0E28A93D5DCB9093E16291E35A6CD27F8DB8 |
| Original assembly | 22,440 | 2DE06BCC819A1176A23E31A6F1FB7C7267702F99F3A7D52EB4757BCEF609AC73 |
| Matching-C configuration | 22,208 | E07A2C3A2E58478EF5F76BD1C168B97026920B9ADC35A5306E847017C55B6BD4 |
| Overlay configuration | 44,750 | D4F1FB177822334EB748D6D62B342FB813D8825FEDD912057CF651EB616A5FB6 |
| Semantic Splat configuration | 3,137,062 | 1BC788145E625600756004CF53673A322616C4FEBFC5102788ACDEFA0F050574 |
| Boundary context JSON | 4,603 | 49619787B75DDF3A179274D3332783144A4B2F6D7A701CF8F54DF23331B7E256 |
| Descriptor 12 raw identity | 40 descriptor bytes | 998FF913EC9C6AC3D5BDD3C3C24F78D0225D8C70D3F64AF0CC100CCAAA3BFBAA |

The direct ROM-slice comparison used the fresh canonical z64 output. It found zero mismatches across all 1,156 target bytes.

## Fresh reviewer outputs

| Artifact | Bytes | SHA-256 |
|---|---:|---|
| phase8.elf | 44,130,728 | D1AC44BDA03BB5B104F6CB810A8419A86791521FE6E0D2F820925C6B07CDAE0D |
| phase8.map | 7,004,697 | F6027949F179C558AEBE7906F308887AF5DA5B2A4F4B106F07BDE61B29F03778 |
| phase8.us_rev0.z64 | 41,943,040 | 571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A |
| build-report.json | 67,443 | D8CBBDDDA7BAFEC9922023F376C3ABE0B7E5BFD05ADCE7E1B82B5D86A9F3E00A |
| verification.json | 30,148 | B4DDC93810560CA2A04A145C8401CE802840DA3BD61C7CA747C8ECAC68A79B84 |
| reproducibility-vs-worker-a.json | 27,871 | 2EE4D99CE402FF5A01DBE956D125C0AEFE162ED600B6DE1DE054FCDC3D79F93E |

The fresh verifier reports 7,242 primary rows, 7,251 executable slices, 19 overlay reservations, six matching-C owners, and no linked original-assembly target.

## Provenance

| Input | Identity |
|---|---|
| KMC compiler | F3F1C99A322F5B3D8C108C2A44AF1D6D084DD27575C5D60BF0F0D33FFF34B1C6 |
| asm-differ | commit 093360aa31f90e67216ed1971c4087516cc7b940 |
| Splat Python | 4CCA2027319C08DCA5CC4B64C9BA415CC89205152202CB6805081277C43B610F |
| Splat split.py | EED41D3C36AFA4A980A3B22BC76C371569696CADFEF925DBB63606BFB081544E |
| Phase 8 configuration | E07A2C3A2E58478EF5F76BD1C168B97026920B9ADC35A5306E847017C55B6BD4 |
| Accepted integration baseline | b22815518f060425519c08df19b617af8b5099a7 |

The parent repository was read-only during review. Its current HEAD is 5a81440061738e89137180872e8ad03f531870e4, which differs from the worker's recorded parent baseline. The fresh build used the authenticated Phase 7 output and canonical decomp inputs.

## Review-owned records

- docs/matching-c/high-value-wave5-20260802-independent-review/aar/20260802-ob64-matching-c-high-value-wave5-independent-review.md
- docs/matching-c/high-value-wave5-20260802-independent-review/task-log.md
- docs/matching-c/high-value-wave5-20260802-independent-review/evidence-index.md

The frozen result remains unchanged. Generated outputs remain outside Git under the reviewer-owned root.
