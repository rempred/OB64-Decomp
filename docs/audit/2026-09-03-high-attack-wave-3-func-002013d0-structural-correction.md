# High Attack Battle Stream Wave 3 `func_002013D0` Structural Correction

Status: **implemented; independent structural re-review pending**

Accepted base: `aca0a60728cbcfa141f8e84b27af359fad817f4b`

Implementation commits:

- structural model and fail-closed proof: `7e562f25353f5af61238dff4b27a9b421bfa7ddb`;
- exact C activation and canonical linkage: `0b20516c635dc06aa2397edca82069c9174218c1`.

## Outcome and scope

The correction retains accepted row 3758 and its original 96-byte ROM span while representing its
two materially different subranges:

| Section | ROM | Accepted VRAM | Bytes | Execution | Linked owner |
| --- | --- | --- | ---: | --- | --- |
| `.ob64.r3758.s0` | `0x002013D0..0x00201424` | `0x801BDF40..0x801BDF94` | 84 | executable | `objects/c/func_002013D0.o` |
| `.ob64.r3758.s1` | `0x00201424..0x00201430` | `0x801BDF94..0x801BDFA0` | 12 | non-executable | `objects/assembly/chunk_032.o` |

The 84-byte prefix is now an ordinary exact `PURE_C` target. The 12-byte alignment tail remains
owned by the accepted assembly chunk and carries the generic non-executable-range identity
`func-002013d0-alignment-padding`. There is no inline-assembly fallback, compiler-assembly rewrite,
or C ownership of the padding.

This is a structural and build-contract correction. It does not revise the historical accepted
source-part boundary, rename the function semantically, modify original assembly, change compiler
identity, or make a broader claim that zero words are generally non-executable.

## Direct ROM evidence

The accepted row is ROM `0x002013D0..0x00201430`, descriptor 10 text, original owner
`asm/original/rev0/lib/func_002013D0.s`, assembly chunk 32.

- ROM `0x0020141C` is `0x03E00008` (`jr $ra`).
- ROM `0x00201420` is `0x27BD0018`, the required return delay-slot stack restore.
- ROM `0x00201424`, `0x00201428`, and `0x0020142C` are zero words.
- The next accepted source-part/function boundary is ROM `0x00201430`.
- The 84-byte executable prefix SHA-256 is
  `18ACA89C612392942718624B1792D58238FAB2AC1FE6F3F95D6777D6AF2E11B1`.
- The 12-byte zero tail SHA-256 is
  `15EC7BF0B50732B49F8228E07D24365338F9E3AB994B00AF08E5A3BFFE55FD8B`.
- The unchanged 96-byte accepted row SHA-256 is
  `1D5E4D5613EEA1E4D33A84C03FC45BA0F744BE37EE42749B1813148F2BC3A06F`.

A same-descriptor scan of decoded direct branches, jumps, and calls found no target in accepted
VRAM `0x801BDF94..0x801BDFA0`. An aligned whole-ROM pointer scan found no materialized pointer to
`0x801BDF94`, `0x801BDF98`, or `0x801BDF9C`. These negative scans are supporting evidence; the
return sequence, successor boundary, accepted ownership, and fail-closed linked proof are the
primary evidence.

## Authenticated Phase 5A support

The locally configured accepted Phase 5A product was read without modification. Relevant evidence
files and identities are:

| Evidence | SHA-256 | Relevant record |
| --- | --- | --- |
| `control-flow-edges.jsonl` | `C94748D69E7C2E3E2326DD56DF2EFBD8CF320BBBEAE00647E2BB08453C9722E4` | call at ROM `0x00200170`, instruction `0x0C06F7D0`, targets accepted live address `0x801BDF40`; no live target is recorded for the padding addresses |
| `return-delay-slots.jsonl` | `75C739AA2D19205970822AF6CE14ECA58C2140E7712B3B30CDBD606FE347E9F0` | return ROM `0x0020141C`, delay slot `0x00201420`, next ROM `0x00201424` |
| `function-dispositions.jsonl` | `7812CA48DA2ABD17E569C15C5CD47D3DE235D94A01FC35E26FAA41A8869F3A9E` | accepted start at `0x002013D0`, internal return/delay labels, and accepted successor start at `0x00201430` |

Descriptor-group back-mapping makes the accepted call edge's `target_rom` ambiguous, so the report
does not treat the absent ROM field as stronger evidence than it is. Its authenticated
`target_live = 0x801BDF40` still corroborates entry at the executable prefix, not the tail.

## Structural correction

The accepted model previously had no way to express a non-executable subrange inside a fixed
overlay text row. Consequently, activating an exact 84-byte object against the historical 96-byte
row failed with target object section-shape drift.

The correction adds the generic top-level `fixedOverlayNonExecutableRanges` contract to the Phase
7 model. It is validated independently of any active Matching-C target and is constrained by:

1. exact schema and configured count;
2. unique, non-reserved identifiers and aligned integer endpoints;
3. containment in exactly the named descriptor;
4. confinement to that descriptor's text section; and
5. no overlap with another fixed-overlay non-executable range.

Phase 7 cuts accepted rows at those range endpoints, emits the tail as non-executable with its
range identity, and independently verifies the ELF section, program-header execution treatment,
VRAM, ROM LMA, bytes, and layout summary. Phase 8 preserves that assembly slice when the executable
prefix is C-owned and independently re-verifies both slices' 12-field accepted provenance plus the
fixed-range summary.

The existing non-descriptor load-slab range gates remain unchanged. The earlier accepted
`func_0021C8DC` split-row behavior is exercised alongside this row and remains exact.

## Smallest falsifiers exercised

The focused gates reject the smallest practical counterexamples to the corrected claim:

- make `.ob64.r3758.s1` executable at the ELF-section or PT_LOAD level;
- move the padding's accepted VRAM or ROM load address;
- change a retained padding byte or give the slice to the C/map owner;
- introduce a gap or overlap between `.s0` and `.s1`;
- alter any accepted execution, range-ID, descriptor, section, placement, endpoint, input-kind, or
  linked-owner provenance field;
- change the fixed-range count/list/schema, use a reserved or duplicate ID, use an unaligned
  endpoint, escape descriptor text, select the wrong descriptor/section, or overlap ranges; and
- regress the active target's logical extent to the whole 96-byte row.

The end-to-end `func_002013D0` fixture rejected 39 mutations while performing real compilation,
fallback pruning, link/map/ELF inspection, layout verification, and complete-ROM comparison. The
data-driven `func_0021C8DC` fixture rejected its existing 38 mutations in the same run.

## Exact C activation

`src/lib/func_002013D0.c` is byte-identical to the preserved candidate at
`docs/archive/matching-c-candidates/2026-09-03-func_002013D0-2ee9e463f3.c`; both files have SHA-256
`22AE9F69A59A7DBE93BB7D873B6E077F9AF8745B8281585F367D15C11C1D5C5C`.

The canonical relocation contract contains 11 `.rel.text` relocations:

| Offsets | Type | Symbol |
| --- | --- | --- |
| `0x08` | `R_MIPS_26` | `func_00201108` |
| `0x10`, `0x2C` | `R_MIPS_HI16` | `D_801CE8C0` |
| `0x14`, `0x30` | `R_MIPS_LO16` | `D_801CE8C0` |
| `0x18` / `0x1C` | `R_MIPS_HI16` / `R_MIPS_LO16` | `D_801976DC` |
| `0x24`, `0x40` | `R_MIPS_26` | `func_00209774` |
| `0x34` / `0x38` | `R_MIPS_HI16` / `R_MIPS_LO16` | `D_801976E8` |

The final target diff reports `PURE_C`, relocation contract `MATCH`, 0 differing bytes, 0 differing
instruction words, and identical linked/expected target SHA-256
`18ACA89C612392942718624B1792D58238FAB2AC1FE6F3F95D6777D6AF2E11B1`.

## Changed surfaces

Structural model and proof:

- `config/README.md`;
- `config/phase7/conventional-build.json`;
- `tools/build_phase7_conventional.js`;
- `tools/lib/phase7_conventional.js`;
- `tools/lib/phase8_matching_c.js`;
- `tests/active_targets.js`;
- `tests/phase7_conventional_build.js`; and
- `tests/split_row_phase8.js`.

Activation:

- `src/lib/func_002013D0.c`;
- `config/matching-c-targets.json`; and
- `config/matching-c-linkage.json`.

This report is the only additional durable record. No original assembly, archived candidate,
canonical workflow/source-policy document, toolchain contract, or unrelated target source changed.

## Verification

| Check | Result |
| --- | --- |
| `node tests/active_targets.js` | Pass; 521 active targets and the split-row execution/extent contract |
| `node tests/split_row_phase8.js` | Pass; both split rows exact, `func_002013D0` 84 C bytes + 12 retained assembly bytes, 39 rejected mutations |
| `node tests/phase7_conventional_build.js --output <accepted phase7>` | Pass; baseline verified and all execution, placement, range-schema, descriptor, and overlap mutations rejected |
| `node tools/diff.js func_002013D0` | `EXACT`, `PURE_C`, 0 differing bytes/words, relocation contract `MATCH` |
| `node tools/source_policy.js --target func_002013D0` | Pass; one requested `PURE_C` target, zero hybrid/ASM/unknown |
| `node tools/verify.js --target func_002013D0 --require-pure` | Pass; baserom/toolchain/policy/ownership/placement/relocations, target bytes, and full ROM |
| `node tools/audit.js` | Pass; structural protections and CURRENT exact ROM |

The verified CURRENT fingerprint is
`050B793EDF4D6F5BF1A504B466F5F5A4E3E8F120DA9EF4FABD19656C5AF5EB4F`. It contains 459
`PURE_C` functions / 31,904 bytes and 62 `HYBRID_C` functions / 33,724 bytes, with zero active
compiler-assembly rewrites. The final 40 MiB ROM SHA-256 is
`571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

## Evidence index

- Wave 3 report:
  `docs/Plans/task-logs/ob64-high-attack-wave3-matching-20260903-r1-HABSW3-MC-20260903-01.md`.
- Preserved dossier: `docs/dossiers/func_002013D0-2ee9e463f3.md`.
- Accepted Phase 7 baseline:
  `C:\Users\Joe\.codex\ob64-high-attack-wave-3-structural\work\baseline\56e27189080d91c8379a2300\phase7`.
- Final `func_002013D0` split-row report:
  `C:\Users\Joe\.codex\ob64-high-attack-wave-3-structural\work\tests\split-row-phase8-func_002013D0-D4gSzQ\split-row-phase8-test-report.json`,
  SHA-256 `E166E29396C4D108062D4F01BD3362B8BF712FB13CC80B00C58E7B90D5B8AC99`.
- Preserved `func_0021C8DC` split-row report:
  `C:\Users\Joe\.codex\ob64-high-attack-wave-3-structural\work\tests\split-row-phase8-func_0021C8DC-XhdQCT\split-row-phase8-test-report.json`,
  SHA-256 `ACBE672AF85290E37EFFB109D7F9B32056F4B731CF51617742B63D0B4E44B9F0`.
- Target diff: `build/diff/func_002013D0.json`, SHA-256
  `58CD39D9C7922A43FD967D8FAD9F64595FA8C00B0DA09B7A6AD7E77AEDAC391D`.
- Complete verifier: `build/current/verification.json`, SHA-256
  `D6C407027EF493F9FCD7519B4E1E5CEB74B05C7A77FD4B4E31EC136A72EA55E4`.
- Structural audit: `build/audit/report.json`, SHA-256
  `6658E5D075F53F9D39D71879CC0C68F8F74B1619554C0BCA3B4AC39AF1355711`.

## Residual risk and next action

The structural conclusion depends on the accepted descriptor map and Phase 5A evidence product.
The negative direct-target and pointer scans cannot prove that no computed address could ever
reach zero padding; they support, but do not replace, the decoded return sequence and accepted
boundary evidence. The implementation therefore remains deliberately narrow: it identifies only
the exact 12-byte accepted range and fails closed on placement, execution, provenance, or schema
drift.

Route commits `7e562f2` and `0b20516` plus this report through independent structural re-review.
The re-review should challenge the ROM/VRAM endpoints, ELF and PT_LOAD execution treatment,
retained assembly ownership, fixed-range schema, and the explicit gap/overlap falsifiers.
