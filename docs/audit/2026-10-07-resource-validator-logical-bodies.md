# Resource validator logical-body admission

Status: accepted on October 7 after focused regressions, one changed-input
structural audit and independent final review. No production C is activated.

The unchanged physical row 9, `.ob64.r0009`, owns ROM `000018D4..00001A44`
(368 bytes), mapped to RAM `800714D4..80071644`. This addition describes its
complete executable-body census using neutral address names:

| Logical name | ROM interval, exclusive end | Bytes | Owner offset |
| --- | --- | ---: | ---: |
| `func_000018D4` | `000018D4..00001A34` | 352 | 0 |
| `func_00001A34` | `00001A34..00001A3C` | 8 | 352 |
| `func_00001A3C` | `00001A3C..00001A44` | 8 | 360 |

All 92 original words in `asm/original/rev0/boot/resource_ptr_validate.s` were
independently compared with the canonical normalized ROM. The source SHA-256 is
`685AB9FA8FBE96C5F5732C20A14199E4E4C53CFD7295D066F282BF74ACEE81CC`.
Each registry record binds its canonical interval hash and derived physical-source
intersection. Physical boundaries, source ownership, placement and fallback stay
unchanged; none of these sixteen terminal bytes is classified as padding.

The main body's return at `1A2C` completes its frame restoration in the `1A30`
delay slot. The next pair is `03E00008 / 8C82FFF4`: return the word at incoming
A0 minus12. The final pair is `03E00008 / 00001021`: return zero. Both terminal
bodies obtain their state independently from an argument or constant. Main-body
control flow does not enter either pair, and no noncall edge crosses the cuts.
Together these facts support body boundaries without inferring historical names,
public linkage, runtime use or broader semantics.

The bounded original-source reference census found no incoming direct/literal
hits for the three starts. Its documented limits include computed, indirect,
encoded, callback, symbolic and overlay-relative references. No-hit results prove
neither deadness nor a complete absence of callers. The ignored source study and
supporting census remain under `build/matching/resval-20261007/`.

The existing [boot-body census](2026-09-23-boot-decode-body-census.md) is the
metadata precedent: reviewed self-contained bodies can be recorded without known
callers or new exports. These records use `supplemental-reviewed-body` and empty
alias lists. Empty aliases are essential: the historical alias-correction route
must not shorten the complete `resource_ptr_validate` workbench selection to352
bytes. The old wholesale registry generator is not used.

After admission, the existing workbench supports a complete three-GLOBAL-function
diagnostic source. The two private placeholder names must be changed to the neutral
registry names; the main selection retains `resource_ptr_validate`. Scratch GLOBAL
bindings are diagnostic requirements, not production exports. Probe completion
does not establish object lengths or exactness. Ordinary watch evidence must retain
the complete function census, emitted bytes, relocations and any mismatch. An
inactive ASM owner still lacks an authenticated isolated linked acceptance result.

Production acceptance remains separate. Existing `compilerTextFunctions` machinery
can conserve this whole owner with one GLOBAL and two LOCAL functions. Its secondary
call-evidence tags still require justified selection; this logical admission does
not invent internal or fixed-address calls, approve bindings or activate source.
Canonical matching still requires mechanical source classification, exact actual
relocations, sole ownership, complete target bytes and complete-ROM equality.

`node tests/resource_validator_logical.js` is the focused static regression. It
checks the three intervals, canonical words/hashes, fragments, full-owner selection,
complete assembly-export labels and scratch census. Negative controls cover malformed
fragments/hashes, overlapping bodies, duplicate aliases, unsupported evidence,
executable-as-padding substitution, omitted coverage, partial-owner activation and
invalid scratch function census. It invokes no compiler, linker or database write.

On October 7, `node tests/resource_validator_logical.js` passed the full-owner
selection and 13 negative controls, including an extra fourth emitted function.
`node tests/logical_functions.js` also passed its existing 45 negative controls.
These static checks do not supply linked-byte or complete-ROM acceptance.

`node tests/logical_functions_integration.js` also passed: actual compiled inputs
with missing, extra or reordered functions reject; the helper, cache, padding and
public classify/compare/preserve checks pass. Its evidence remains under ignored
`build/logical-functions-native-9rMT5C/`.

One `node tools/audit.js --profile` exited zero with `AUDIT PASS` at
`2026-10-07T23:30:35.877Z`, taking 960.362 seconds. It rebuilt CURRENT for the new
registry identity and independently recompiled all active sources. The baseline
was reused normally; no preliminary build or separate verifier ran.

- Registry SHA-256: `A92E1CF2ED2AC766724935DDE37A8FC601232B7BE3E6AE2661E42134F34E9E5B`.
- CURRENT: `BF5BA958C2E8E9D5BF2606810E64CEF814464451FD551E1A8B304C69056E6048`.
- Baseline: `D6553DEDD807851A93DC37DB9A8E9CD0186DA99B0ED88A763E39BBBC56B4B32F`.
- Complete ROM: 41,943,040 bytes, SHA-256 `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

Independent review checked the actual reports, interval/source hashes and rebuilt
ROM. Only the logical registry changed among the 1,050 captured tracked source,
header, configuration and tool inputs. All fresh source proofs pass with unchanged
source classes and zero compiler-assembly rewrites. The validator remains inactive.
Detailed evidence is in `build/audit/validator-logical-20261007/` and the normal
generated audit/current reports; these remain untracked.

Director mail 1700 releases the actual worker drain in 1696 after confirmations
1697/1698 and final review. LavenderSpire resumes full-owner private diagnostics;
QuietPond resumes the complete movement wave after refreshing context. No matching
wave, public secondary binding or production activation is accepted by this repair.
