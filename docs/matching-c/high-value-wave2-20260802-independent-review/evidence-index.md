# Independent review evidence index

## Verdict

The review verdict is `Accepted`.

The reviewed result passed every assigned Critical-review claim.

## Frozen subject

| Item | Identity |
|---|---|
| Canonical commit | `f06aea6b5bc8cd9c99ab09881e4f91a55474a602` |
| Target symbol | `func_00007688` |
| Target ROM range | z64 `0x00007688..0x00007768` |
| Target boot RAM range | `0x80077288..0x80077368` |
| Target size | 224 bytes |
| Secondary entry | `func_00007714` at owner offset `0x8C` |
| Canonical ROM SHA-256 | `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A` |
| Canonical code-region SHA-256 | `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409` |

## Claim review

| Claim | Independent evidence | Result | Review state |
|---|---|---|---|
| The worker file set is bounded. | Frozen commit file inventory and `git diff --check`. | Seven expected files; no prohibited binary artifact. | Passed |
| The owner boundary is correct. | Frozen assembly, local manifest, and dossier. | 56 words cover 224 bytes through exclusive z64 end `0x00007768`. | Passed |
| The secondary entry remains inside the owner. | Reviewer `readelf` symbol table and frozen assembly. | `func_00007714` starts at `0x8C` and ends at `0xE0`. | Passed |
| The C source matches the retained bytes. | Reviewer focused proof. | 224 candidate bytes equal 224 reference bytes. | Passed |
| Target placement remains exact. | Reviewer Phase 8 verification and map output. | Linked owner begins at boot RAM `0x80077288`. | Passed |
| Target relocations remain exact. | Reviewer `readelf` output and Phase 8 verification. | 13 text relocations and two `.rel.pdr` entries match. | Passed |
| Both prior C targets remain exact. | Reviewer Phase 8 verification. | `func_000E5938` and `func_0000B33C` pass exact comparison. | Passed |
| The complete canonical ROM remains exact. | Reviewer Phase 8 verification. | `fullRomExact: true`; ROM hash matches canonical. | Passed |
| Repeated builds remain path-independent. | Reviewer reproducibility report. | Two fresh roots have identical report identities. | Passed |
| Tool provenance remains authenticated. | Reviewer hashes and canonical Phase 6 manifest. | KMC, binutils, Splat, and asm-differ identities match. | Passed |
| Clean-room derivation remains bounded. | Reviewer source inspection and worker derivation record. | No copied instruction body or raw word implementation appears. | Passed |
| Encoding controls remain bounded. | Reviewer source and compiler assembly. | Register bindings, zero-register `addu`, ordering, and size controls only. | Passed |
| Generated artifacts remain outside Git. | Frozen commit inventory and reviewer output roots. | Canonical commit tracks no generated build artifact. | Passed |
| Worker evidence is sufficient. | Worker AAR, evidence index, and independent reproduction. | Every material claim has direct or independently reproduced support. | Passed |

## Reviewer-owned evidence

| Artifact | SHA-256 or result |
|---|---|
| `C:\Users\Joe\.codex\ob64-matching-c-wave2-review-20260802\focused\focused-proof.json` | `2B6D0ED35C463EC5BDEB398CF9A2462414F8ADECC344A76F9694A6747E2CF30F` |
| Reviewer focused candidate/reference | Both `4398E1D52DE73D83846A34DDB7A4A97EA669E8DA66DA321F98CFF91C0BF9BC31` |
| Reviewer Phase 8 build report | `C58E57EFCFA70A48313431B914D39FAF1C711BB2AF35818FD2D9F8CC9D76D004` |
| Reviewer Phase 8 verification report | `FF4F3E8DCD86C4B6DDD4E364CA2ABC48B38B31DD78A2C1A3C4D4C78C8441455B` |
| Reviewer reproducibility report | `B257AC3E7725544690D875150CF2CDEBD634B9051EA0AB21F8606A3327BDA697` |
| Reviewer Phase 8 ROM | `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A` |
| Reviewer Phase 8 code region | `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409` |
| Reviewer focused relocations | Readelf output under `focused\readelf.txt`; 13 `.rel.text`, two `.rel.pdr`. |

## Reused frozen evidence

```text
C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp\docs\matching-c\high-value-wave2-20260802\aar\20260802-ob64-matching-c-high-value-wave2-aar.md
C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp\docs\matching-c\high-value-wave2-20260802\evidence-index.md
C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp\docs\matching-c\high-value-wave2-20260802\target-selection.md
C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp\docs\matching-c\high-value-wave2-20260802\independent-derivation.md
C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp\src\boot\boot_state_slot_flagged_dispatch_lookup.c
C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp\asm\original\rev0\boot\boot_state_slot_flagged_dispatch_lookup.s
C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp\config\phase8\matching-c.json
```

## Admissibility

The two-root build is an acceptance test for the claimed structural build result.

Its producer is the accepted Phase 8 build procedure using canonical source, configuration, and Phase 7 input.

The ordinary sequence is compile, assemble, link, verify, and compare two fresh output roots.

The material consequence is a changed target byte, placement, relocation, preservation, or ROM identity.

The test is the smallest useful falsifier for byte identity and path dependence.

It remains within the claimed static evidence grade and assigned threat model.

No excluded hostile construction affected the verdict.

## Evidence limits

The evidence proves static structural correspondence.

It does not prove runtime state-slot semantics or gameplay behavior.

The worker made no broader semantic claim.

