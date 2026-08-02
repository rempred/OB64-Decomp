# Wave 4 matching-C independent-review evidence index

Status: completed. Verdict: Accepted with corrections. The independent review
passed every technical claim and found one documentation-only hash-label defect.
The Director must correct three Markdown records before propagating Wave 4.

## Frozen identity

| Item | Result |
|---|---|
| Review assignment | ob64-decomp-matching-c-high-value-function-wave4-independent-review-20260802, revision 1 |
| Reviewer task | 019fc247-b3ec-7543-9d20-8e36a9553ed6 |
| Director task | 019fba30-9100-72c3-bdd2-8758a7fab9c6 on local |
| Frozen canonical commit | db8f7e697bdffc9ed6b3224894db4efe5cd2d6aa |
| Frozen canonical branch | main |
| Target | func_00269470 |
| Target range | z64 ROM 0x00269470..0x00269798, end exclusive |
| Target size | 808 bytes |
| Owner | row 4801, section .ob64.r4801 |
| Overlay | descriptor 12 |
| Worker evidence | OB64 Decomp/docs/matching-c/high-value-wave4-20260802/evidence-index.md |
| Review output root | C:\Users\Joe\.codex\ob64-matching-c-wave4-review-20260802\ |

## Claim review

| Claim | Independent evidence | Result |
|---|---|---|
| Frozen subject is exact | git HEAD and commit parent inspection | PASS |
| Worker file set is declared and bounded | Frozen diff-tree and explicit path inventory | PASS |
| Wave 4 target selection meets size and value requirements | Target selection record, original assembly, and 808-byte owner math | PASS |
| Owner boundary is exact | jr $ra at 0x00269790, delay slot at 0x00269794, successor at 0x00269798 | PASS |
| Overlay placement is exact | Descriptor 12 delta calculation and fresh linker report | PASS |
| Linked target bytes are exact | Fresh verifier, direct ROM hash, and asm-differ exact true | PASS |
| Relocations remain exact | Fresh report and complete 42-entry config comparison | PASS |
| Four earlier C owners remain exact | Direct fresh-ROM range hashes and asm-differ exact true | PASS |
| Code region remains exact | Fresh code-region SHA-256 | PASS |
| Full canonical ROM remains exact | Fresh ROM SHA-256 and verifier | PASS |
| Repeated builds preserve identities | Fresh-root/A comparison and worker-root A/B comparison | PASS |
| Tool and input provenance remains authenticated | Fresh build report and local tool hashes | PASS |
| Clean-room boundary remains respected | Canonical source inspection and no external-derived implementation inspection | PASS |
| Constrained labels, macros, and inline assembly remain bounded | Source inspection plus exact linked bytes | PASS |
| CRLF repair preserves one-section grammar | Five fresh compiler outputs: one .text and zero .section each | PASS |
| Corrected evidence package is internally consistent | Hash audit of recorded comparison report | CORRECTION REQUIRED |
| Prohibited generated artifacts are absent | Seven-file Markdown-only evidence-root inventory | PASS |

## Direct identities

| Artifact | SHA-256 or result |
|---|---|
| Target C source | 366C3F0D312711E71DB34900B7DBB2D75B59D4DCF36745EF2C80B397C60F40F2 |
| Matching-C configuration | E7EC41010E82EE542A9109C9FEC62555FF5FB3323D9158AA18AA7A994975F547 |
| Matching-C build library | 7BA0183B35473C4E779E5D4D3056EAAF7EDC8A35A3835CD796A8225EACAECA3F |
| Original target assembly | 8A11B4BE872A6ABABA1F9EE8FF5C3108CBD81B18C45A21653D3FBE49BAA2B7EB |
| Target object section, 808 bytes | 481296CB178391FFE31D7270EA993FED1AC5B7BE17F43AAFF5B97830E68C9BDC |
| Target linked bytes | C4F2DD8D5281054D1F0266ECDEDC6832CF669DA331AC4C4F0A92B6A7D134EF02 |
| Code region | 40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409 |
| Fresh reviewer ROM | 571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A |
| Fresh build report | E16576C27FCF4226F47871C8DB5E54D04C437612136140BBFD86E658001EB81B |
| Fresh verification report | 14614EF010864D34BAAFEE863CFBC4D40E0E9CC1361615435878DB6BD3AFFCF7 |
| Reviewer comparison report | 926B48259BC2A6282EF95BF06B95AAA36D161DA1C382656ECC5B61B265E73D57 |
| Setup report | B0E9FA404B81A92CA0EB23C75A3F1A534964AEB815771EE0D00CA5008F351F8D |

The reviewer comparison report and worker comparison report have the same
SHA-256: 926B48259BC2A6282EF95BF06B95AAA36D161DA1C382656ECC5B61B265E73D57.
The value E16576C27FCF4226F47871C8DB5E54D04C437612136140BBFD86E658001EB81B
is the build-report SHA-256, not the comparison-report SHA-256.

## Reviewer-owned evidence

The fresh reviewer build and verifier wrote generated outputs under:

C:\Users\Joe\.codex\ob64-matching-c-wave4-review-20260802\phase8-review\

The reviewer extracted the target object section to:

C:\Users\Joe\.codex\ob64-matching-c-wave4-review-20260802\func_00269470.object.r4801.bin

The extracted object section is 808 bytes and matches the recorded target
object SHA-256.

The reviewer initially attempted objcopy section .text. That section is zero
bytes in the target object because the executable section is .ob64.r4801.
The reviewer read the object section table, reran objcopy with .ob64.r4801,
and obtained the expected 808-byte hash. This diagnostic artifact remains
outside Git.

The first comparator invocation observed a temporary missing build-report.json.
After output-schema inspection, the comparator was rerun and passed. The
second run is the accepted review result.

## Admissible finding and route

Finding W4-DOC-001 is documentation-only. Three worker records cite the
build-report hash as the comparison-report hash:

- OB64 Decomp/docs/matching-c/high-value-wave4-20260802/reproduction-procedure.md
- OB64 Decomp/docs/matching-c/high-value-wave4-20260802/evidence-index.md
- OB64 Decomp/docs/matching-c/high-value-wave4-20260802/task-log.md

The Director must replace that cited value with
926B48259BC2A6282EF95BF06B95AAA36D161DA1C382656ECC5B61B265E73D57.
The Director must not alter the C source, matching-C configuration, original
assembly, or matching-C build helper for this correction.

## Evidence limits

The review supports static structural correspondence only. It does not prove
runtime behavior, gameplay semantics, editor readiness, or cold-boot behavior.
The worker and reviewer did not claim those properties.

## Exact next route

The Director must intake the AAR, apply the three-file hash-label correction,
and record the technical result as accepted after bounded cleanup. Wave 5 can
proceed after that route. No research reopening is required.
