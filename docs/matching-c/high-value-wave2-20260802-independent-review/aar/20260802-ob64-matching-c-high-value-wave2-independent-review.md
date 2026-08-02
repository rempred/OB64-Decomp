# After-action report: independent review of matching-C wave 2

## Verdict

`Accepted`.

The frozen commit `f06aea6b5bc8cd9c99ab09881e4f91a55474a602` matches the declared 224-byte owner.

It preserves the secondary entry, both accepted C targets, relocations, placement, and the complete canonical ROM.

The Director may propagate this result and unlock Wave 3.

No correction is required.

## Frozen subject

The subject is canonical decomp commit `f06aea6b5bc8cd9c99ab09881e4f91a55474a602` on `main`.

The reviewed target is `func_00007688`.

Its z64 ROM range is `0x00007688..0x00007768`.

Its boot RAM range is `0x80077288..0x80077368`.

The secondary entry is `func_00007714` at owner offset `0x8C`.

The accepted preserved targets are `func_000E5938` and `func_0000B33C`.

## Claims reviewed

The worker claimed one bounded matching-C owner with structural correspondence.

The review covered these material claims:

- The frozen file set contains only the intended source, configuration, and evidence files.
- The 224-byte owner boundary includes the secondary entry and final delay slot.
- The new C source reproduces the retained original bytes.
- The target placement and relocations remain exact.
- Both earlier accepted C targets remain byte-exact.
- The complete canonical ROM remains byte-exact.
- Repeated builds preserve path-independent identities.
- Compiler, assembler, linker, Splat, and asm-differ provenance remains authenticated.
- The clean-room source contains no external-derived implementation.
- Inline encoding controls remain inside the assigned structural boundary.
- Worker evidence is sufficient for the claimed static evidence grade.

The worker did not claim runtime semantics.

## Review method

The reviewer archived the frozen commit into a separate read-only subject copy.

The reviewer extracted the 56 `.word` values from the frozen assembly independently.

The reviewer compiled and linked the frozen C source with the authenticated KMC and GNU tools.

The reviewer inspected the focused object relocations and symbol table.

The reviewer rebuilt and verified the complete Phase 8 result in two fresh output roots.

The reviewer compared report identities and checked the frozen commit file inventory.

The reviewer used no emulator, controller input, savestate, or human gate.

## Test results

### Owner and boundary

The frozen assembly contains 56 four-byte words.

The words cover z64 ROM range `0x00007688..0x00007768`.

The local manifest records one 224-byte owner with that same exclusive end.

The secondary symbol links at offset `0x8C` and has size `0x54`.

The secondary end equals the owner end at offset `0xE0`.

The boundary and secondary-entry claims pass.

### Focused byte proof

The reviewer-owned reference and candidate both hash to `4398E1D52DE73D83846A34DDB7A4A97EA669E8DA66DA321F98CFF91C0BF9BC31`.

The candidate contains 224 bytes.

The reference contains 224 bytes.

The comparison reports zero differing bytes.

The focused proof is `C:\Users\Joe\.codex\ob64-matching-c-wave2-review-20260802\focused\focused-proof.json`.

### Relocations and placement

Readelf reports 13 `.rel.text` entries.

Readelf reports two `.rel.pdr` entries.

The offsets and symbols match the frozen Phase 8 configuration.

The linked owner begins at boot RAM `0x80077288`.

The target placement and relocation claims pass.

### Full Phase 8 result

The reviewer build reports `PASS` with canonical ROM hash `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

The reviewer verification reports `PASS`.

The verification reports `fullRomExact: true`.

The verification reports `acceptedRowsPreserved: 7242`.

The verification reports `acceptedSlicesPreserved: 7251`.

The verification reports `overlayDescriptorsPreserved: 19`.

The verification reports `originalAssemblyTargetsNotLinked: true`.

All three configured targets pass exact comparison.

### Reproducibility

The second fresh output root also builds and verifies successfully.

The reproducibility comparison reports `PASS`.

The build report identity is `C58E57EFCFA70A48313431B914D39FAF1C711BB2AF35818FD2D9F8CC9D76D004`.

The verification report identity is `FF4F3E8DCD86C4B6DDD4E364CA2ABC48B38B31DD78A2C1A3C4D4C78C8441455B`.

The reproducibility report identity is `B257AC3E7725544690D875150CF2CDEBD634B9051EA0AB21F8606A3327BDA697`.

The path-independent identity claim passes.

## Provenance and clean-room review

The KMC executable hash is `F3F1C99A322F5B3D8C108C2A44AF1D6D084DD27575C5D60BF0F0D33FFF34B1C6`.

Its source commit is `43d1cdb67ed135879869b5266f01efaaada5e35a`.

Its source tree is `bbed133c38a1feffafe941c36b20d3b38ba47a33`.

The binutils, Splat, and asm-differ hashes match the accepted manifest.

The frozen C source contains no raw instruction directives.

Its inline assembly contains register bindings, zero-register `addu` controls, ordering controls, and one owner-size directive.

These controls preserve encoding and boundary metadata.

They do not import the original instruction body.

The clean-room and encoding-control claims pass.

## Admissible findings

No blocking finding exists.

The two-root build was an acceptance test.

Its producer was the accepted Phase 8 build procedure.

Its ordinary sequence was compile, assemble, link, verify, and identity comparison.

Its smallest useful failure would change target bytes, placement, relocations, preservation, or ROM identity.

The test stayed within the static evidence grade and assigned threat model.

No excluded hostile construction affected the verdict.

## Reused frozen evidence

The review reused the worker AAR, evidence index, target selection, independent derivation, source, assembly, and configuration.

The worker evidence remains attributable to the frozen commit.

The reviewer independently reproduced the material byte and build claims.

## Evidence limits

The review proves static byte identity, owner placement, relocation identity, and build reproducibility.

It does not prove runtime state-slot semantics.

It does not prove gameplay behavior.

The worker correctly limited its claims to static structural correspondence.

## Documentation consequences

No canonical domain claim requires correction or supersession.

The review record is under `docs/matching-c/high-value-wave2-20260802-independent-review/`.

The Director may propagate the accepted result after intake.

## Exact next route

The required route is `Accepted`.

The Director may propagate the result and unlock Wave 3.

No worker correction or research reopening is required.

