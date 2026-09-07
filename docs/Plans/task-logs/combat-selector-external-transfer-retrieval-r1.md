# Combat selector external-transfer retrieval r1

## Outcome and scope

The complete verified normalized ROM contains one four-byte-aligned raw word equal to one of the sixteen J/JAL encodings for the selector's eight instruction addresses. The word is `0x0C06F8BB` at z64 ROM offset `0x00B5A3B4`. Its opcode bits are JAL and its 26-bit field equals the low target field for RAM `0x801BE2EC`, the selector's second instruction.

The hit is outside accepted descriptor-10 text. Existing structural metadata classifies its containing row as raw audio data and supplies no overlay descriptor for that offset. This result is raw word equality only. It does not establish an instruction, transfer, caller, reachability, loaded selector, or selector use.

No prior frozen record had the exact wider scope. The accepted r1 review scanned the original assembly-word set for nine selector entry addresses. The accepted r2 review enumerated incoming direct transfers to all eight words only inside descriptor-10 text. I therefore performed the prompt's bounded full-ROM aligned encoding search. I did not repeat the accepted descriptor-10 census, JR/JALR, pointer-literal, decoded-resource, runtime, or database investigations.

## Literal search result

The search covered normalized z64 ROM `[0x00000000,0x02800000)` at offsets divisible by four. For each target `T`, the raw words were `0x08000000 | ((T >> 2) & 0x03FFFFFF)` and `0x0C000000 | ((T >> 2) & 0x03FFFFFF)`.

| Target RAM address | Raw J word | Raw JAL word | Aligned hits |
|---|---:|---:|---:|
| `0x801BE2E8` | `0x0806F8BA` | `0x0C06F8BA` | 0 |
| `0x801BE2EC` | `0x0806F8BB` | `0x0C06F8BB` | 1 |
| `0x801BE2F0` | `0x0806F8BC` | `0x0C06F8BC` | 0 |
| `0x801BE2F4` | `0x0806F8BD` | `0x0C06F8BD` | 0 |
| `0x801BE2F8` | `0x0806F8BE` | `0x0C06F8BE` | 0 |
| `0x801BE2FC` | `0x0806F8BF` | `0x0C06F8BF` | 0 |
| `0x801BE300` | `0x0806F8C0` | `0x0C06F8C0` | 0 |
| `0x801BE304` | `0x0806F8C1` | `0x0C06F8C1` | 0 |

The one raw hit has these existing fields:

| Field | Literal value |
|---|---|
| z64 ROM offset | `0x00B5A3B4` |
| raw word | `0x0C06F8BB` |
| target-field label | `0x801BE2EC`, subject to the address-region assumption below |
| descriptor-10 text | outside `[0x001F0A30,0x00211D20)` |
| semantic row index / ID | `6356` / `primary:d6567459808ac7d65fb6` |
| semantic row range | `[0x009254EF,0x01C4801C)` |
| primary class / source form | `audio` / `raw_audio_data` |
| owner kind | `generated-byte-owner` |
| ambiguity / processor class / segment type | `false` / `cpu-or-non-cpu` / `bin` |
| row name | `p6356_audio_raw_audio_data_009254ef_01c4801c` |
| existing overlay descriptor | none |

The existing selector owner row is index `3770`, ID `primary:f5b349aa6b7fe4341a1f`, name `p3770_code_original_mips_00201778_00201798`, z64 `[0x00201778,0x00201798)`. Accepted descriptor 10 records `romStart=0x001F0A30`, `romEnd=0x00213B10`, `vramStart=0x801AD5A0`, and `textEnd=0x801CE890`; its stored placement gives selector RAM `[0x801BE2E8,0x801BE308)`.

## Claims and evidence grades

Claim: the stated complete-ROM aligned raw-word search has exactly one hit, at `0x00B5A3B4`.

- Evidence grade: **Verified static** for byte identity and bounded raw-word equality.
- Review status: **pending** for this worker result.
- Supporting artifact: `build/combat-selector-external-transfer-retrieval-r1/aligned-jtype-hits.json`.
- Competing interpretation: the same four bytes are data in the accepted semantic row, or a raw pattern with no executed JAL meaning.
- Falsifier: another divisible-by-four ROM offset containing any listed raw word, or a byte/hash mismatch against the authenticated normalized ROM.
- Product consequence: none assigned.

Claim: existing accepted metadata records the hit inside semantic audio row 6356 and outside every stored overlay descriptor.

- Evidence grade: **Verified static** for the existing row/descriptor fields and the bounded containment join.
- Review status: **pending** for this retrieval package; the source structural records were previously accepted inputs.
- Supporting artifact: the same JSON, including the exact semantic and overlay input hashes.
- Product consequence: none assigned.

## Address-region assumption and limits

MIPS J-type execution forms the effective address from `(PC + 4)[31:28]` plus the encoded 26-bit field and two zero bits. Labeling `0x0C06F8BB` as the encoding for `0x801BE2EC` assumes an executing instruction whose `PC + 4` has upper nibble `0x8`. The scan establishes only that the aligned ROM bytes equal the raw word. The accepted semantic classification is retained explicitly; it is not overridden by the opcode-shaped pattern.

The scan does not cover unaligned byte occurrences, JR/JALR, branches, pointer literals, synthesized addresses, decompressed data, runtime stores, or dynamic overlay state. A zero count for seven encodings does not prove non-use. The one hit does not prove execution, reachability, a caller, selector residency, or a transfer to the selector's interior instruction.

## Input identity

| Input | SHA-256 / identity |
|---|---|
| Assignment commit | `e9f99598e183135e9eaf2930fb1737f9210e9c59` |
| Accepted discovery commit | `1f68aa001c612e2a7ce160e0cdf1d83a0c8b2048` |
| Accepted discovery review commit | `024a9710425d6652dfc91857666b532006d1c54e` |
| Parent V64 ROM | `6CA0A1AFE224831E202857AD64EF26BD429A034A4EA48404BB09621641A07B12`, 41,943,040 bytes |
| In-memory normalized z64 ROM | `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`, 41,943,040 bytes |
| `config/splat/us_rev0.semantic.json` | `44938312F6967E94B527B8B878C01125A2589B1BD28B2DB7E9F06059E2843979` |
| `config/overlays/us_rev0.json` | `D4F1FB177822334EB748D6D62B342FB813D8825FEDD912057CF651EB616A5FB6` |
| Accepted r1 review checks | `52FB3999EF77BDA84161554D4FDEBEEFD051C48A42DE7695F6B5FCCC8D22B9F6` |
| Accepted r2 review evidence | `7F66F8F2985F8ADE8B3E159456589400AA0121666E152C93243592DB2DAC173F` |

The task started from `main` at the assigned ready boundary. During this disjoint read-only retrieval, other authorized work advanced `main`; no current matching input was used as evidence, and the accepted semantic/overlay hashes remained equal to the accepted review inputs.

## Changed surfaces

- `docs/Plans/task-logs/combat-selector-external-transfer-retrieval-r1.claim.json`
- `docs/Plans/task-logs/combat-selector-external-transfer-retrieval-r1.md`
- `build/combat-selector-external-transfer-retrieval-r1/scan_aligned_jtype.py`
- `build/combat-selector-external-transfer-retrieval-r1/aligned-jtype-hits.json`

No source, configuration, compiler, build, verifier, runtime, database, Git ref, branch, worktree, staging area, or remote changed.

## Evidence index

| Artifact | Purpose | SHA-256 |
|---|---|---|
| `build/combat-selector-external-transfer-retrieval-r1/scan_aligned_jtype.py` | Bounded deterministic normalizer and aligned J/JAL raw-word scan | `0C0A3E7630D012E78651DBA0B59F325388ABC8D049BE8AFB458295BF8B55267F` |
| `build/combat-selector-external-transfer-retrieval-r1/aligned-jtype-hits.json` | Eight target encodings, raw hits, existing metadata fields, boundaries and limits | `40E2802ABA9498DABC7A34142D79DF719884DEAD1D25752441B6BB3B0E57ECA4` |
| `build/combat-discovery-review-r1/accepted/review-checks.json` | Frozen earlier nine-entry/original-word result and accepted input hashes | `52FB3999EF77BDA84161554D4FDEBEEFD051C48A42DE7695F6B5FCCC8D22B9F6` |
| `build/combat-discovery-review-r2/accepted/review-evidence.json` | Frozen descriptor-10-only all-eight-word direct-edge scope | `7F66F8F2985F8ADE8B3E159456589400AA0121666E152C93243592DB2DAC173F` |

## Verification summary

The parser authenticated the source V64 and in-memory normalized z64 identities, required exactly eight four-byte target addresses, scanned every divisible-by-four word start in `[0x00000000,0x02800000)`, and joined hits only to existing semantic rows and overlay descriptor fields. A direct readback of normalized bytes at `0x00B5A3B4` returned `0C06F8BB`. Counts were one total, zero inside descriptor-10 text, one outside, zero without an owner row, and one without an overlay descriptor.

## Protocol deviations

None.

## Proposed canonical-document changes

None. This retrieval supplies raw evidence for later interpretation and does not establish technical acceptance or a semantic conclusion.

## Next action

The Director can route the literal one-hit record for independent interpretation while preserving the accepted descriptor-10 and conditional JR/JALR results as separate evidence.
