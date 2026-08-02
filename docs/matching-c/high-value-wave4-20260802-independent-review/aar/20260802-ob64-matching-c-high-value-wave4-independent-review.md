# After-action report: Wave 4 matching-C independent review

## Outcome

Verdict: Accepted with corrections. The frozen commit independently reproduces
the 808-byte func_00269470 owner, its overlay placement, 42 relocations, all
four earlier owners, and the complete canonical ROM. This matters because the
technical result passes Critical review, but three evidence records mislabel
the reproducibility report hash. The Director must apply that documentation
correction before propagating Wave 4. No source or build correction is needed.

## Frozen subject and eligibility

The reviewed canonical commit is
db8f7e697bdffc9ed6b3224894db4efe5cd2d6aa on main.

The reviewed target is structural function func_00269470. Its z64 ROM range is
0x00269470..0x00269798, end exclusive. Its owner is row 4801 in section
.ob64.r4801. Its overlay descriptor is 12.

The worker AAR is
OB64 Decomp/docs/matching-c/high-value-wave4-20260802/aar/20260802-ob64-matching-c-high-value-wave4-aar.md.

The evidence-completion AAR is
OB64 Decomp/docs/matching-c/high-value-wave4-20260802/aar/20260802-ob64-matching-c-high-value-wave4-evidence-completion-aar.md.

The worker evidence index is
OB64 Decomp/docs/matching-c/high-value-wave4-20260802/evidence-index.md.

The worker and evidence-completion records report completed status. The exact
frozen commit and evidence package exist. The reviewer did not produce the
frozen result. The review used PROTECTED inventory rules.

The reviewer wrote only under
OB64 Decomp/docs/matching-c/high-value-wave4-20260802-independent-review/.
Generated build outputs remain outside Git. No frozen file was modified.

## Claims reviewed

The review covered:

- frozen file-set scope;
- Wave 4 target selection and value;
- owner boundary and overlay placement;
- linked target bytes and relocations;
- all four earlier target owners;
- complete code-region and ROM identity;
- repeated-build identity;
- compiler and input provenance;
- clean-room compliance;
- constrained labels, macros, and inline assembly;
- CRLF and one-section grammar repair;
- corrected evidence-package completeness; and
- prohibited generated artifacts.

The review did not extend the worker's static scope into runtime behavior,
gameplay meaning, editor integration, or cold-boot installation.

## Review method

The reviewer inspected the frozen commit, worker AARs, evidence index, target
selection, derivation, reproduction procedure, task log, original assembly,
successor assembly, matching-C configuration, source, and tool diff.

The reviewer independently built Phase 8 under:

C:\Users\Joe\.codex\ob64-matching-c-wave4-review-20260802\phase8-review\

The build passed with full ROM SHA-256
571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A.

The fresh verifier passed. It reported 7,242 accepted rows, 7,251 accepted
executable slices, 19 overlay descriptors, five matching-C owners, and no
linked original-assembly target owners.

The reviewer compared the fresh root with worker root A. The comparison passed.
The reviewer also compared worker roots A and B. That comparison passed.

The review task log records the exact commands, report paths, hashes, and
diagnostic-tool repairs:

OB64 Decomp/docs/matching-c/high-value-wave4-20260802-independent-review/task-log.md

## Reused frozen evidence

The review reused the worker setup report, worker roots A and B, accepted
Phase 7 output identity, original assembly hashes, and the corrected evidence
records as frozen inputs. The setup report hash is
B0E9FA404B81A92CA0EB23C75A3F1A534964AEB815771EE0D00CA5008F351F8D.

The setup command was not rerun because it writes generated outputs inside the
canonical repository. The fresh Phase 8 build and verifier independently
retested every affected byte, placement, relocation, preservation, and
provenance claim. The worker roots were used only for reproducibility comparison.

## Direct observations

| Semantic name | Game meaning | Address | Address space | Evidence role |
|---|---|---|---|---|
| func_00269470 | Seven-way state handler | 0x00269470..0x00269798 | z64 ROM range, end exclusive | Selected owner |
| func_00269470 | Same owner placement | 0x802148C0..0x80214BE8 | Overlay descriptor 12 runtime range | Link placement |
| func_00269798 | Adjacent successor | 0x00269798..0x002697DC | z64 ROM range, end exclusive | Boundary control |
| g_func_00269470_dispatch_table | Seven-entry dispatch source | 0x80220BA0 | Overlay runtime virtual address | Indirect dispatch |
| func_00269470_callback | State callback field | s0+0x70 | Overlay-relative state field | Two indirect calls |

Descriptor 12 maps z64 ROM 0x0025EE90..0x00275850 to runtime
0x8020A2E0..0x802210C0. The target runtime range follows that validated
overlay delta. The early-boot linear mapping was not used.

The original assembly ends with jr $ra at z64 ROM 0x00269790 and its delay slot
at 0x00269794. The successor begins at 0x00269798. The owner length is 808
bytes. No secondary entry occurs in the accepted slice.

## Test results

### Target bytes and relocations

The fresh verifier reported exact true for func_00269470. Direct hashing of the
fresh ROM target range produced:

    C4F2DD8D5281054D1F0266ECDEDC6832CF669DA331AC4C4F0A92B6A7D134EF02

The extracted .ob64.r4801 object section is 808 bytes with SHA-256:

    481296CB178391FFE31D7270EA993FED1AC5B7BE17F43AAFF5B97830E68C9BDC

The fresh report contains 42 target relocations. Its complete relocation array
equals the frozen matching-C configuration.

### Preservation and ROM identity

The fresh ROM hashes for the four earlier accepted owners equal their
configuration hashes. The new target hash also equals its configuration hash.
The fresh code-region SHA-256 is
40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409.
The fresh full-ROM SHA-256 is
571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A.

The fresh asm-differ result is exact true for all five C owners.

### Tool grammar and provenance

The tool diff changes only the .text matcher and replacement to accept an
optional carriage return. It still requires exactly one .text directive and
rejects .section directives.

Each of the five fresh compiler outputs has one .text directive, zero
.section directives, and CRLF line endings. This validates the repaired grammar
contract on the accepted KMC output.

The fresh build report authenticates the compiler, binutils, Splat,
asm-differ, Phase 7 inputs, Phase 8 configuration, C sources, and original
assembly. The KMC compiler SHA-256 is
F3F1C99A322F5B3D8C108C2A44AF1D6D084DD27575C5D60BF0F0D33FFF34B1C6.
The Splat split-script SHA-256 is
EED41D3C36AFA4A980A3B22BC76C371569696CADFEF925DBB63606BFB081544E.
The asm-differ commit is 093360aa31f90e67216ed1971c4087516cc7b940.

The C source contains constrained labels, fixed-register inline assembly, and
a local move macro. It contains no copied .word body or external-derived
source marker. The reviewer did not inspect external-derived implementations.

## Admissible finding

Finding ID: W4-DOC-001.

Three evidence records cite
E16576C27FCF4226F47871C8DB5E54D04C437612136140BBFD86E658001EB81B
as the reproducibility-report SHA-256. That value is the build-report SHA-256.

The accepted compare command writes
C:\Users\Joe\.codex\ob64-matching-c-wave4-20260802-a\phase8-final-a\reproducibility.json.
The actual comparison-report SHA-256 is
926B48259BC2A6282EF95BF06B95AAA36D161DA1C382656ECC5B61B265E73D57.

This mismatch affects evidence authentication, not code bytes or build
behavior. The smallest correction updates only:

- OB64 Decomp/docs/matching-c/high-value-wave4-20260802/reproduction-procedure.md
- OB64 Decomp/docs/matching-c/high-value-wave4-20260802/evidence-index.md
- OB64 Decomp/docs/matching-c/high-value-wave4-20260802/task-log.md

No technical rerun is required after that documentation-only correction.

## Evidence limits

The evidence grade remains Supported for static structural correspondence.
Exact bytes do not prove gameplay semantics, runtime behavior, editor
round trips, or cold-boot installation.

The review did not use emulator controls, RAM, savestates, editor files,
controller input, or external-derived implementations. No human gate applied.

## Documentation consequences and exact route

The Director must intake this report as Accepted with corrections. The
Director must apply the three-file hash-label cleanup before propagating Wave 4.
The Director must not alter the reviewed source, configuration, assembly, or
build helper for this cleanup.

After propagation, the Director can update the pre-review four-owner status
references in nested AGENTS.md, docs/PLATFORM.md, and docs/NEXT_STEPS.md.
No worker correction or research-reopen assignment is required.
