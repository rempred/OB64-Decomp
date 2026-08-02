# Independent Critical review AAR

## Verdict

`Accepted with corrections`.

The frozen commit `444c99c3a163d8526ced583e1d6c63626a21f54c` passed independent build, verification, preservation, provenance, and clean-room checks.
The result matters because the 168-byte boot resource-pool replacement and the existing 36-byte target both reproduce their linked bytes.
The Director must route two bounded evidence-record corrections before propagating the result.
No action is required from Joe.

## Frozen subject and worker result

The frozen subject is the canonical decomp repository at commit `444c99c3a163d8526ced583e1d6c63626a21f54c`.
Its parent is `fdd9b381f025c1887111d74ebdb3f783957962aa`.
The reviewed new target is structural function `func_0000B33C`.
Its z64 ROM range is `0x0000B33C..0x0000B3E4`.
The preserved target is `func_000E5938`.

The revision-2 worker AAR reports completion and requests independent Critical review.
The evidence index, task log, candidate source, derivation, target selection, and earlier blocked AAR are present.
The reviewer surface was empty at start.
The reviewer did not modify the frozen result.

## Claims reviewed

The review covered these claims:

1. The frozen commit matches the worker's declared file set.
2. Both C targets reproduce their original linked bytes.
3. The complete canonical ROM remains byte-exact.
4. Repeated builds preserve path-independent identities.
5. Manifest and tool provenance remain authenticated.
6. Source derivation respects the clean-room boundary.
7. The repository contains no prohibited generated artifacts.
8. Every material worker claim has sufficient evidence.

## Review method

The reviewer used static diff inspection and a fresh external build root.
The reviewer reused only authenticated local tools and declared Phase 5A product inputs.
The reviewer did not traverse the integration `_work` root.
The reviewer did not inspect external-derived implementations.

The review applied the `PROTECTED` inventory profile.
The parent research repository remained read-only.
The canonical frozen files remained read-only.
Reviewer artifacts were written only under the assigned review surface and external review root.

## Direct observations

### File set and generated artifacts

The frozen commit changes configuration, source, build tools, the authorized manifest, and evidence records.
It adds no ROM, object, executable, map, binary, `build/`, or `dist/` path.
`git diff --check` passes.
The reviewer found no generated artifact in the frozen changed-file list.

The production C source and preserved candidate source hash identically.
The production source contains no external implementation include or attribution marker.

### Independent build and verification

The reviewer ran the accepted Phase 8 build in:

`C:\Users\Joe\.codex\ob64-matching-c-wave1-review-20260802`

The build passed with full-ROM SHA-256 `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
The independent Phase 8 verifier passed with the same full-ROM hash.
The verification report records two matching-C owners and two original-assembly fallbacks.

The existing descriptor target `func_000E5938` links at overlay RAM `0x80198BB8`.
Its 36-byte linked text hashes to `26256054A9F77DAD786308548B96966D4E7A3385975A9E989CEE70DBF0268789`.
The new boot resource-pool target `func_0000B33C` links at boot RAM `0x8007AF3C`.
Its 168-byte linked text hashes to `B5B9786B86B3BA207A56847F26694E126F19667DAB49498E93607F9C4939A0C9`.

The new target's object text hashes to `22A134DAAC883CC9F33D2B7CBE82745E2DDCD284EBB8F1D1899B5F30ED6AABF9`.
The object records 13 `.rel.text` entries and one `.rel.pdr` entry.
The linked owner is `objects/c/func_0000B33C.o`.
The fallback owner remains `asm/original/rev0/boot/boot_resource_pool_acquire_release.s`.

The verifier reports full ROM exactness, 7,242 accepted rows preserved, and 7,251 accepted slices preserved.
The code-region hash is `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.

### Reproducibility

The reviewer compared the fresh reviewer root with the worker's r2-a root.
The path-independent comparison passed.
The build-report hash is `BECCF6CDCBFCDAFB68D93F140002D6E570F800C11BB3C0E9D548F5398734314D`.
The reviewer reproducibility report hash is `6A3CFA9646E116F91D293E617F9E7C3F2E789F7FA6B24DE886ED341591FD11A6`.
The report identities match the worker's two-root identity table.

### ROM preservation

The reviewer read the master `.v64` ROM and swapped each byte pair in memory.
The normalized master hash equals the fresh rebuilt ROM hash.
The master ROM remained read-only.

### Manifest and tool provenance

The canonical compiler manifest is 5,883 bytes.
Its SHA-256 is `98C8ACC06A8FBF40DADBD25AE20C2539E8765E14EA12895158C37CC413D06C26`.
Its frozen integration Git blob is `2d4cddd4ee381da7e767a7f0580de1ab67573919`.
The pinned KMC compiler hash is `F3F1C99A322F5B3D8C108C2A44AF1D6D084DD27575C5D60BF0F0D33FFF34B1C6`.
The build report records the accepted Splat, binutils, host, and asm-differ identities.

The reviewer reused the worker's setup report instead of rerunning `verify_setup.js`.
The independent Phase 8 build revalidated the accepted Phase 7 input and final ROM identity.

## Admissible findings

No blocking admissible finding was identified.
The review found no semantic, byte, schema, linker, or evidence-boundary defect.

### Correction C-01 — Object and linked-text hash wording

`independent-derivation.md` line 51 says the candidate object and linked text both hash to `B5B978...`.
The canonical contract distinguishes object text hash `22A134DAAC883CC9F33D2B7CBE82745E2DDCD284EBB8F1D1899B5F30ED6AABF9` from linked text hash `B5B978...`.
This wording can misattribute the evidence hash.
The Director must correct the wording without changing source, configuration, or test evidence.

### Correction C-02 — Historical revision-1 status

`target-selection.md` and `independent-derivation.md` retain revision-1 statements that the manifest is absent.
The revision-2 manifest is present, authenticated, and used by the passing independent build.
The Director must add a dated historical or superseded pointer to the revision-2 AAR.
The Director must preserve the earlier blocked AAR unchanged.

These corrections are documentation-only and do not change the reviewed result.

## Reused frozen evidence

The reviewer reused the revision-2 worker AAR and evidence index for worker commands and artifact references.
The reviewer independently reproduced the Phase 8 build, verifier, and path-independent comparison.
The reviewer independently authenticated the manifest Git blob and compiler executable hash.
The reviewer independently normalized the read-only master ROM and matched its SHA-256.

## Evidence limits

The review proves structural matching and exact rebuild preservation.
It does not prove gameplay semantics or runtime behavior.
The review did not rerun the setup command because that command writes generated reports under canonical `build/`.
The worker's setup report remains reused evidence with its recorded hash.

## Documentation consequences and route

The Director must route C-01 and C-02 as bounded documentation cleanup.
The Director may propagate the matching-C result after those corrections.
No source, configuration, manifest, or verifier correction is required.

## Review artifact paths

- Review task log: `C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp\docs\matching-c\high-value-wave1-20260802-independent-review\task-log.md`
- Review evidence index: `C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp\docs\matching-c\high-value-wave1-20260802-independent-review\evidence-index.md`
- Reviewer output root: `C:\Users\Joe\.codex\ob64-matching-c-wave1-review-20260802`
