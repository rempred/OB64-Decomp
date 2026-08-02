# Wave 4 matching-C independent-review task log

Status: completed. Verdict: Accepted with corrections. The fresh review
reproduced the 808-byte structural owner, its overlay placement, its 42
relocations, all four earlier owners, and the complete canonical ROM. The
Director must correct one reproducibility-hash label in three evidence records
before propagating Wave 4. No source, configuration, or build correction is
required.

## Assignment and frozen subject

| Item | Recorded value |
|---|---|
| Review assignment | ob64-decomp-matching-c-high-value-function-wave4-independent-review-20260802 |
| Review revision | 1 |
| Review level | Critical |
| Reviewer task | 019fc247-b3ec-7543-9d20-8e36a9553ed6 |
| Director task | 019fba30-9100-72c3-bdd2-8758a7fab9c6 on local |
| Canonical frozen commit | db8f7e697bdffc9ed6b3224894db4efe5cd2d6aa |
| Canonical branch | main |
| Reviewed target | func_00269470 |
| Reviewed z64 ROM range | 0x00269470..0x00269798, end exclusive |
| Reviewed target size | 808 bytes |
| Reviewed owner | row 4801, section .ob64.r4801 |
| Reviewed overlay | descriptor 12 |

The frozen commit is the current canonical HEAD. Its parent is
d398c23f4163e807039c45956a4ed25c4698b641.

The worker report is
OB64 Decomp/docs/matching-c/high-value-wave4-20260802/aar/20260802-ob64-matching-c-high-value-wave4-aar.md.

The evidence-completion report is
OB64 Decomp/docs/matching-c/high-value-wave4-20260802/aar/20260802-ob64-matching-c-high-value-wave4-evidence-completion-aar.md.

The worker evidence index is
OB64 Decomp/docs/matching-c/high-value-wave4-20260802/evidence-index.md.

## Baseline and ownership

| Repository | Branch | Review-time HEAD | Surface |
|---|---|---|---|
| Parent OgreBattlel64 | main | b016fb508be2378626e17c60f035ada366cd09f0 | Read-only |
| Canonical OB64 Decomp | main | db8f7e697bdffc9ed6b3224894db4efe5cd2d6aa | Frozen result read-only |
| Integration evidence | main | b22815518f060425519c08df19b617af8b5099a7 | Read-only |

The review prompt records parent baseline 354ec098b306e786284e4c902de82833e6944d15.
The worker package records an earlier parent baseline 355236254220eb8ab6f0146868c643ad409287b7.
The parent remained read-only, and no parent file supplied technical evidence.
This is a coordination observation, not a semantic finding.

The reviewer-owned Git surface was initially absent:

OB64 Decomp/docs/matching-c/high-value-wave4-20260802-independent-review/

The reviewer created that directory and wrote only reviewer records there.
The frozen result, parent repository, integration repository, ROM, and product
surfaces remained read-only. No file was staged or committed.

The generated review output root was:

C:\Users\Joe\.codex\ob64-matching-c-wave4-review-20260802\

## Frozen commit file set

The frozen commit changes exactly these ten paths:

    config/phase8/matching-c.json
    docs/matching-c/high-value-wave4-20260802/aar/20260802-ob64-matching-c-high-value-wave4-aar.md
    docs/matching-c/high-value-wave4-20260802/aar/20260802-ob64-matching-c-high-value-wave4-evidence-completion-aar.md
    docs/matching-c/high-value-wave4-20260802/evidence-index.md
    docs/matching-c/high-value-wave4-20260802/independent-derivation.md
    docs/matching-c/high-value-wave4-20260802/reproduction-procedure.md
    docs/matching-c/high-value-wave4-20260802/target-selection.md
    docs/matching-c/high-value-wave4-20260802/task-log.md
    src/overlays/descriptor_12/func_00269470.c
    tools/lib/phase8_matching_c.js

The frozen evidence root contains seven Markdown files. All local Markdown
links resolve. No ROM, object, map, executable, report, or other generated
artifact exists under that tracked evidence root. The frozen diff check passed.

## Review method and commands

The review used direct frozen-commit inspection, one fresh independent Phase 8
build, independent verification, two reproducibility comparisons, direct ROM
range hashing, object-section extraction, provenance inspection, and grammar
checks.

The fresh build command was:

    node tools/build_phase8_matching_c.js --output "C:\Users\Joe\.codex\ob64-matching-c-wave4-review-20260802\phase8-review" --phase7-output "C:\Users\Joe\.codex\ob64-phase8-matching-c-20260801\run-a\conventional" --compiler "C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe" --splat-python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --splat-split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ"

Result: PASS. The fresh ROM SHA-256 is
571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A.

The independent verifier command was:

    node tools/verify_phase8_matching_c.js --output "C:\Users\Joe\.codex\ob64-matching-c-wave4-review-20260802\phase8-review" --compiler "C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe" --splat-python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --splat-split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ" --report "C:\Users\Joe\.codex\ob64-matching-c-wave4-review-20260802\phase8-review\verification.json"

Result: PASS.

The reviewer compared the fresh root against worker root A:

    node tools/compare_phase8_reproducibility.js --left "C:\Users\Joe\.codex\ob64-matching-c-wave4-review-20260802\phase8-review" --right "C:\Users\Joe\.codex\ob64-matching-c-wave4-20260802-a\phase8-final-a" --report "C:\Users\Joe\.codex\ob64-matching-c-wave4-review-20260802\reproducibility-review.json"

Result: PASS. The reports are identical.

The reviewer also compared the two worker roots:

    node tools/compare_phase8_reproducibility.js --left "C:\Users\Joe\.codex\ob64-matching-c-wave4-20260802-a\phase8-final-a" --right "C:\Users\Joe\.codex\ob64-matching-c-wave4-20260802-b\phase8-final-b" --report "C:\Users\Joe\.codex\ob64-matching-c-wave4-review-20260802\reproducibility-worker-roots.json"

Result: PASS. The reports are identical.

## Technical test results

### Target selection and boundary

The selected owner is 808 bytes. It satisfies the Wave 4 size window of more
than 524 and at most 896 z64 ROM bytes.

The original owner begins with a stack frame and selector bound check. It ends
with jr $ra at z64 ROM 0x00269790 and its delay slot at 0x00269794.
The adjacent successor func_00269798 begins at z64 ROM 0x00269798.
No secondary entry appears in the accepted owner slice.

Overlay descriptor 12 maps z64 ROM range 0x0025EE90..0x00275850 to runtime
range 0x8020A2E0..0x802210C0. Applying that validated delta places the target
at runtime 0x802148C0..0x80214BE8.

### Target bytes and relocations

The fresh verifier reported exact true for func_00269470. Direct hashing of
the fresh ROM target range produced the expected linked SHA-256:

    C4F2DD8D5281054D1F0266ECDEDC6832CF669DA331AC4C4F0A92B6A7D134EF02

The C object section .ob64.r4801 is 808 bytes. GNU objcopy extracted that
section with SHA-256:

    481296CB178391FFE31D7270EA993FED1AC5B7BE17F43AAFF5B97830E68C9BDC

The fresh build reported all 42 target relocations. The reviewer compared the
complete relocation array with config/phase8/matching-c.json.
The arrays are equal.

### Earlier-owner preservation

The fresh ROM ranges for all five configured C owners match their expected
linked hashes:

| Semantic name | z64 ROM range | Bytes | SHA-256 |
|---|---|---:|---|
| func_000E5938 | 0x000E5938..0x000E595C | 36 | 26256054A9F77DAD786308548B96966D4E7A3385975A9E989CEE70DBF0268789 |
| func_0000B33C | 0x0000B33C..0x0000B3E4 | 168 | B5B9786B86B3BA207A56847F26694E126F19667DAB49498E93607F9C4939A0C9 |
| func_00007688 | 0x00007688..0x00007768 | 224 | 4398E1D52DE73D83846A34DDB7A4A97EA669E8DA66DA321F98CFF91C0BF9BC31 |
| func_0000BC8C | 0x0000BC8C..0x0000BE98 | 524 | 23B9E078BC45A44074A7F23B9C4C8384D8C39D5A8D39951F39739F11BDCC5424 |
| func_00269470 | 0x00269470..0x00269798 | 808 | C4F2DD8D5281054D1F0266ECDEDC6832CF669DA331AC4C4F0A92B6A7D134EF02 |

The fresh verifier also reported 7,242 accepted rows, 7,251 accepted
executable slices, 19 overlay descriptors, and no linked original-assembly
target owners.

The fresh code-region SHA-256 is
40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409.
The fresh full-ROM SHA-256 is
571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A.

### Tool grammar and inline assembly

The frozen tool change permits CRLF after a single .text directive. It still
rejects extra .text directives and any .section directive.

All five fresh KMC compiler outputs contain exactly one .text directive and
zero .section directives. All five outputs contain CRLF line endings.

The target source uses constrained labels, fixed-register inline assembly, and
one local move macro. It contains no copied .word body and no external-derived
source marker. The reviewer did not inspect external-derived implementations.
The exact linked-byte result validates the emitted encoding contract.

### Provenance

The fresh build report authenticates the KMC compiler, GNU binutils, Splat,
asm-differ, Phase 7 inputs, matching-C configuration, C sources, and original
assembly. The compiler SHA-256 is
F3F1C99A322F5B3D8C108C2A44AF1D6D084DD27575C5D60BF0F0D33FFF34B1C6.
The Splat split script SHA-256 is
EED41D3C36AFA4A980A3B22BC76C371569696CADFEF925DBB63606BFB081544E.
The asm-differ commit is 093360aa31f90e67216ed1971c4087516cc7b940.

The frozen source, configuration, and build-library hashes match the worker
evidence index. The setup report hash is
B0E9FA404B81A92CA0EB23C75A3F1A534964AEB815771EE0D00CA5008F351F8D.

## Admissible finding

Finding ID: W4-DOC-001

Finding: Three evidence records identify the build-report SHA-256 as the
reproducibility-report SHA-256.

Failed assigned claim or gate: The corrected evidence package is complete and
internally consistent.

Frozen subject: db8f7e697bdffc9ed6b3224894db4efe5cd2d6aa.

Direct observation: The compare command writes
C:\Users\Joe\.codex\ob64-matching-c-wave4-20260802-a\phase8-final-a\reproducibility.json.
Its SHA-256 is
926B48259BC2A6282EF95BF06B95AAA36D161DA1C382656ECC5B61B265E73D57.
The cited value E16576C27FCF4226F47871C8DB5E54D04C437612136140BBFD86E658001EB81B
is the build-report.json SHA-256.

Reachable producer path: The accepted reproducibility command produces the
comparison report in the worker output root.

Material consequence: The reproducibility result remains PASS, but the cited
artifact cannot be authenticated using the recorded hash.

Supporting evidence: The mismatch appears in reproduction-procedure.md,
evidence-index.md, and task-log.md. The reviewer independently reran the
comparison and confirmed the actual report hash.

Smallest correction boundary: Update those three Markdown records only.
Replace the mislabeled comparison-report hash with
926B48259BC2A6282EF95BF06B95AAA36D161DA1C382656ECC5B61B265E73D57.
No technical build or source rerun is required.

This is a non-semantic coordination defect. It does not justify Revision
required or Research reopened.

## Evidence limits

The accepted evidence grade remains Supported for static structural
correspondence. The review does not prove runtime behavior, gameplay meaning,
editor round trips, or cold-boot installation.

The review used no emulator, RAM, controller input, savestate, editor, or
external-derived implementation. No human gate was required.

## Documentation consequences and next route

The Director must route the three-file hash-label correction, then intake this
report as Accepted with corrections. The Director may propagate Wave 4 after
that bounded cleanup. No worker source correction or research-reopen
assignment is required.

After propagation, the Director can update the pre-review four-owner status
references in the nested AGENTS.md, docs/PLATFORM.md, and docs/NEXT_STEPS.md.
Those status updates are outside this review surface.
