# Independent review task log

## Terminal status

The review completed with verdict `Accepted`.

The frozen result matches the declared 224-byte owner and preserves both accepted targets and the complete canonical ROM.

The Director may propagate the result and unlock Wave 3.

No correction is required.

## Review identity

| Item | Identity or result |
|---|---|
| Review assignment | `ob64-decomp-matching-c-high-value-function-wave2-independent-review-20260802` |
| Frozen canonical commit | `f06aea6b5bc8cd9c99ab09881e4f91a55474a602` |
| Frozen commit parent | `697f54a1f3d3048b302cf72205dc4d7ad9f9f376` |
| Canonical branch | `main` |
| Assigned parent baseline | `a27aa22253a006c51f77f15134e3923223ef54e7` |
| Observed parent HEAD | `dc1778ae2e56827dd05220c3d3b80b5818d8b9be` |
| Integration evidence HEAD | `b22815518f060425519c08df19b617af8b5099a7` |
| Review inventory profile | `PROTECTED` |
| Review root | `C:\Users\Joe\.codex\ob64-matching-c-wave2-review-20260802` |
| Human gate | None |
| Reviewer mutations | Reviewer-owned copies and records only |

The parent advanced through review-launch documentation commits after the assigned baseline.

The review used the frozen canonical archive and did not use those parent changes for technical evidence.

## Frozen file set

The frozen commit changes exactly these seven files:

```text
config/phase8/matching-c.json
docs/matching-c/high-value-wave2-20260802/aar/20260802-ob64-matching-c-high-value-wave2-aar.md
docs/matching-c/high-value-wave2-20260802/evidence-index.md
docs/matching-c/high-value-wave2-20260802/independent-derivation.md
docs/matching-c/high-value-wave2-20260802/target-selection.md
docs/matching-c/high-value-wave2-20260802/task-log.md
src/boot/boot_state_slot_flagged_dispatch_lookup.c
```

The commit contains no ROM, object, executable, map, or generated binary artifact.

The canonical working tree is clean for the explicit frozen paths.

`git diff --check` reports no whitespace errors for the frozen commit.

## Review method

The review used direct source inspection, independent focused rebuilding, full Phase 8 rebuilding, and provenance checks.

The focused reference came from 56 `.word` values in the frozen assembly.

The focused candidate came from a fresh compile, assembly, link, and extraction.

The full result came from two fresh Phase 8 output roots.

The review used only authenticated local tools recorded by the canonical manifest.

The review did not run the emulator because the worker claimed static structural correspondence only.

## Independent checks

| Check | Direct observation | Result |
|---|---|---|
| Owner boundary | The assembly contains 56 words from z64 `0x00007688` through `0x00007767`. | 224 bytes; exclusive end `0x00007768`. |
| Secondary entry | `func_00007714` links at owner offset `0x8C` and has size `0x54`. | It remains inside the 224-byte owner. |
| Focused bytes | Reviewer-owned reference and candidate hashes both equal `4398E1D52DE73D83846A34DDB7A4A97EA669E8DA66DA321F98CFF91C0BF9BC31`. | 224/224 bytes match; zero differences. |
| Focused relocations | Readelf reports 13 `.rel.text` entries and two `.rel.pdr` entries. | Offsets, types, and symbols match the frozen configuration. |
| Target placement | The linked target begins at boot RAM `0x80077288`. | This matches the z64 early-boot placement. |
| Accepted targets | Phase 8 reports exact text for `func_000E5938`, `func_0000B33C`, and `func_00007688`. | All three targets pass. |
| Preservation | Phase 8 reports `fullRomExact: true`, `acceptedRowsPreserved: 7242`, and `acceptedSlicesPreserved: 7251`. | Existing owners remain preserved. |
| Overlay preservation | Phase 8 reports `overlayDescriptorsPreserved: 19`. | Existing overlay metadata remains preserved. |
| Assembly fallback | Phase 8 reports `originalAssemblyTargetsNotLinked: true`. | The new C target replaces the intended owner. |
| Full ROM | Reviewer Phase 8 output SHA-256 is `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`. | The complete ROM remains exact. |
| Reproducibility | Two fresh roots produce identical build and verification report identities. | Path-independent reproducibility passes. |
| Clean-room source | The C source has no `.word`, `.byte`, or `.half` implementation directives. | Inline controls remain limited to register, delay-slot, ordering, and size controls. |
| Generated artifacts | The frozen commit file inventory contains only source, configuration, and evidence documents. | No prohibited generated artifact is tracked. |

## Exact review commands

The full Phase 8 checks used these commands from the reviewer-owned canonical archive:

```powershell
node tools/build_phase8_matching_c.js --output "C:\Users\Joe\.codex\ob64-matching-c-wave2-review-20260802\phase8-a" --phase7-output "C:\Users\Joe\.codex\ob64-phase8-matching-c-20260801\run-a\conventional" --compiler "C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe" --splat-python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --splat-split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ"
node tools/verify_phase8_matching_c.js --output "C:\Users\Joe\.codex\ob64-matching-c-wave2-review-20260802\phase8-a" --compiler "C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe" --splat-python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --splat-split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ" --report "C:\Users\Joe\.codex\ob64-matching-c-wave2-review-20260802\phase8-a\verification.json"
node tools/build_phase8_matching_c.js --output "C:\Users\Joe\.codex\ob64-matching-c-wave2-review-20260802\phase8-b" --phase7-output "C:\Users\Joe\.codex\ob64-phase8-matching-c-20260801\run-a\conventional" --compiler "C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe" --splat-python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --splat-split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ"
node tools/verify_phase8_matching_c.js --output "C:\Users\Joe\.codex\ob64-matching-c-wave2-review-20260802\phase8-b" --compiler "C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe" --splat-python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --splat-split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ" --report "C:\Users\Joe\.codex\ob64-matching-c-wave2-review-20260802\phase8-b\verification.json"
node tools/compare_phase8_reproducibility.js --left "C:\Users\Joe\.codex\ob64-matching-c-wave2-review-20260802\phase8-a" --right "C:\Users\Joe\.codex\ob64-matching-c-wave2-review-20260802\phase8-b" --report "C:\Users\Joe\.codex\ob64-matching-c-wave2-review-20260802\reproducibility.json"
```

All five commands passed.

The focused compile used the pinned KMC compiler, GNU assembler, GNU linker, objcopy, and readelf.

The focused proof is recorded at `C:\Users\Joe\.codex\ob64-matching-c-wave2-review-20260802\focused\focused-proof.json`.

## Reviewer tooling repairs

The first PowerShell Git tar extraction failed with a damaged archive checksum.

The reviewer replaced that stream with a ZIP archive and verified all frozen file hashes.

The first focused parser used an over-escaped regular expression and found zero words.

The reviewer corrected the expression and reproduced all 56 words.

The first full build lacked ignored `.toolchains` in the archive.

The reviewer copied five authenticated binutils executables into the reviewer-owned root.

The rerun passed without changing the frozen result.

The first generated focused report contained a literal newline escape.

The reviewer regenerated it and validated the JSON parse.

## Evidence limits

The review certifies static byte identity, owner placement, relocation identity, and build reproducibility.

It does not certify runtime behavior or gameplay meaning.

The conservative function names remain structural.

No runtime or human gate was assigned.

## Next route

The exact verdict is `Accepted`.

The Director may propagate the accepted result and unlock Wave 3.

No worker correction, research reopening, or canonical documentation correction is required.

