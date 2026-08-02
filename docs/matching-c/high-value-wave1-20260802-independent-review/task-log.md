# Independent review task log

## Outcome

The review reached `Accepted with corrections` for frozen commit `444c99c3a163d8526ced583e1d6c63626a21f54c`.
The independent build and verifier passed for both matching-C targets, and the normalized master ROM matched the rebuilt ROM.
The Director must route two documentation-only corrections before propagation.

## Review eligibility

| Gate | Observation | Result |
|---|---|---|
| Assignment | Prompt status is `ready`; role is `reviewer`; review level is `Critical`. | Pass |
| Worker result | Revision-2 AAR reports completion and requests independent review. | Pass |
| Frozen subject | Canonical decomp HEAD is `444c99c3a163d8526ced583e1d6c63626a21f54c`. | Pass |
| Worker evidence | The revision-2 AAR, evidence index, task log, and earlier blocked AAR exist. | Pass |
| Review independence | The reviewer did not produce the frozen commit. | Pass |
| Inventory profile | `PROTECTED` profile applied; review surface was empty at start. | Pass |
| Protected roots | No integration `_work` root or external-derived implementation was inspected. | Pass |

## Starting identities

| Repository or surface | Branch | HEAD or state |
|---|---|---|
| Parent research repository | `main` | `efe7a4bb40643fa296b35b507d227eb56ee3755a` |
| Canonical decomp repository | `main` | `444c99c3a163d8526ced583e1d6c63626a21f54c` |
| Frozen commit parent | — | `fdd9b381f025c1887111d74ebdb3f783957962aa` |
| Reviewer surface | — | Empty before review writes |

The parent HEAD differs from the assignment baseline. The parent remained read-only.
The frozen canonical HEAD matches the assigned subject exactly.

## Review method

The review used static inspection, fresh reproduction, provenance checks, and preservation checks.
The reviewer used the authenticated local toolchain recorded by the canonical manifests.
All generated build outputs were written outside Git.

The reviewer tested these claims:

1. The frozen commit matches the worker's declared change scope.
2. Both C targets reproduce their original linked bytes.
3. The complete canonical ROM remains byte-exact.
4. Repeated builds preserve path-independent identities.
5. Manifest and tool provenance remain authenticated.
6. Source derivation respects the clean-room boundary.
7. The frozen commit contains no prohibited generated artifacts.
8. The worker evidence supports each material result claim.

## Independent tests

### Frozen scope and source identity

The frozen commit changes only configuration, build tooling, source, manifest, and matching-C evidence records.
No ROM, object, executable, map, binary, `build/`, or `dist/` path appears in its changed-file list.
`git diff --check` reports no whitespace errors.

The production pool source and preserved candidate source both hash to `9A176F6860CB0D5F3E3B4627B2DAC9D8C2AC8A3B5FEF956FA040BEF354C68F62`.
The production source contains no external-source include or attribution marker.

### Syntax and build reproduction

These syntax checks passed:

```powershell
node --check tools/lib/phase8_matching_c.js
node --check tools/build_phase8_matching_c.js
node --check tools/verify_phase8_matching_c.js
node --check tools/compare_phase8_reproducibility.js
node --check tools/lib/phase7_conventional.js
```

The fresh reviewer output root was:

`C:\Users\Joe\.codex\ob64-matching-c-wave1-review-20260802`

The independent build passed:

```text
node tools/build_phase8_matching_c.js --output "C:\Users\Joe\.codex\ob64-matching-c-wave1-review-20260802" --phase7-output "C:\Users\Joe\.codex\ob64-phase8-matching-c-20260801\run-a\conventional" --compiler "C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe" --splat-python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --splat-split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ"
Result: PASS; ROM SHA-256 `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
```

The independent verifier passed:

```text
node tools/verify_phase8_matching_c.js --output "C:\Users\Joe\.codex\ob64-matching-c-wave1-review-20260802" --compiler "C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe" --splat-python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --splat-split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ" --report "C:\Users\Joe\.codex\ob64-matching-c-wave1-review-20260802\verification.json"
Result: PASS; ROM SHA-256 `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
```

The verification report records two exact target proofs:

| Semantic target | Address | Bytes | Linked text SHA-256 | Linked owner |
|---|---|---:|---|---|
| Existing descriptor helper `func_000E5938` | z64 `0x000E5938..0x000E595C`; overlay RAM `0x80198BB8` | 36 | `26256054A9F77DAD786308548B96966D4E7A3385975A9E989CEE70DBF0268789` | `objects/c/func_000E5938.o` |
| Boot resource-pool helper `func_0000B33C` | z64 `0x0000B33C..0x0000B3E4`; boot RAM `0x8007AF3C` | 168 | `B5B9786B86B3BA207A56847F26694E126F19667DAB49498E93607F9C4939A0C9` | `objects/c/func_0000B33C.o` |

The new target records 13 `.rel.text` entries and one `.rel.pdr` entry.
The verifier reports `originalAssemblyTargetsNotLinked: true`.
The verifier reports 7,242 accepted rows and 7,251 accepted slices preserved.

### Reproducibility

This comparison passed:

```text
node tools/compare_phase8_reproducibility.js --left "C:\Users\Joe\.codex\ob64-matching-c-wave1-review-20260802" --right "C:\Users\Joe\.codex\ob64-matching-c-wave1-20260802-r2-a" --report "C:\Users\Joe\.codex\ob64-matching-c-wave1-review-20260802\reproducibility-vs-r2-a.json"
Result: PASS; build-report SHA-256 `BECCF6CDCBFCDAFB68D93F140002D6E570F800C11BB3C0E9D548F5398734314D`.
```

The fresh reviewer report identities match the worker's reported r2-a and r2-b identities.
The reviewer comparison report hashes to `6A3CFA9646E116F91D293E617F9E7C3F2E789F7FA6B24DE886ED341591FD11A6`.

### ROM preservation

The Phase 8 verifier reports full-ROM SHA-256 `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
It reports code-region SHA-256 `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.

The reviewer read the master `.v64` ROM and swapped each byte pair in memory.
The normalized master hash is `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
The master file remained read-only.

### Manifest and tool provenance

The canonical manifest is 5,883 bytes and hashes to `98C8ACC06A8FBF40DADBD25AE20C2539E8765E14EA12895158C37CC413D06C26`.
The manifest path resolves to blob `2d4cddd4ee381da7e767a7f0580de1ab67573919` in frozen integration commit `b22815518f060425519c08df19b617af8b5099a7`.
The pinned KMC executable hashes to `F3F1C99A322F5B3D8C108C2A44AF1D6D084DD27575C5D60BF0F0D33FFF34B1C6`.
The build report records the accepted Splat, GNU binutils, host, and asm-differ identities.

The reviewer used only the frozen manifest Git object and declared Phase 5A product inputs.
The integration protected `_work` root was not traversed.

### Generated-artifact and clean-room checks

The frozen changed-file list contains no ROM, object, executable, map, binary, `build/`, or `dist/` artifact.
Fresh objects, maps, ELF files, ROMs, and reports remain under the reviewer-owned external root.
The canonical source and candidate source match exactly and contain no external implementation include.
The review did not inspect external-derived implementations.

## Reused worker evidence

The reviewer reused the worker's revision-2 AAR, evidence index, task log, and revision-1 blocked AAR.
The worker's post-integration setup report remains evidence for that setup claim.
The independent Phase 8 build revalidated the accepted Phase 7 input and full-ROM identity.

## Corrections

No semantic, byte, schema, linker, or evidence-boundary defect was found.
Two documentation-only corrections remain.

### C-01 — Separate object and linked-text hashes

`independent-derivation.md` line 51 says the candidate object and linked text both hash to `B5B978...`.
The canonical Phase 8 contract records object text hash `22A134DAAC883CC9F33D2B7CBE82745E2DDCD284EBB8F1D1899B5F30ED6AABF9`.
The linked target text hashes to `B5B9786B86B3BA207A56847F26694E126F19667DAB49498E93607F9C4939A0C9`.
The Director must correct the wording without changing source, configuration, or test evidence.

### C-02 — Mark revision-1 blocked status as historical

`target-selection.md` and `independent-derivation.md` retain revision-1 statements that the manifest is absent.
The revision-2 manifest is present, authenticated, and used by the independent passing build.
The Director must add a dated historical or superseded pointer to the revision-2 AAR.
The Director must preserve the revision-1 blocked AAR unchanged.

These corrections do not change the reviewed result or require full technical recertification.

## Evidence limits

The review proves structural matching and exact rebuild preservation.
It does not prove gameplay semantics or runtime behavior.
No runtime test was assigned or required for this static matching-C claim.
The review did not rerun `verify_setup.js` because it writes generated reports under the canonical ignored `build/` tree.
The worker's authenticated setup report remains identified by its recorded SHA-256.

## Verdict and route

`Accepted with corrections`.

The Director must route C-01 and C-02 as bounded documentation cleanup.
The Director may propagate the matching-C result after those corrections.
No source, configuration, manifest, or verifier correction is required.
