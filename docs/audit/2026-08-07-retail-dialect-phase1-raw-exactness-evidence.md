# Retail dialect Phase 1 raw-exactness evidence

Completed. Phase 1 now requires raw final linked bytes for an `EXACT` diff result. This prevents disassembly aliases from hiding machine-code differences. The Director must freeze this result and route independent review before Phase 2 starts.

Review status: `pending`.

## Scope and provenance

- Assignment: `docs/Plans/prompts/ob64-retail-dialect-phase1-raw-exactness-20260807-r1.md`.
- Assignment SHA-256: `0EB9D3955E0332C3758A2330636642869E7D34BBCCE5D46803EDDAFDCF96A28B`.
- Launch ID: `1ec4be4cc4e94a72a72736794da9f572`.
- Parent starting HEAD: `1ac946fae7fee8e601902da8c3234b8e3b8eef62`.
- Decomp starting HEAD: `042c7c02e0f86da664c8d34d01597a4e61c4eef3`.
- Branch: `main`.
- Inventory profile: `NORMAL`.
- Claim: `docs/Plans/task-logs/ob64-retail-dialect-phase1-r1-1ec4be4cc4e94a72a72736794da9f572.claim.json`.
- Claim SHA-256: `089F11F4832C8171FEF0BBCFB2D7379438EB1C99BBBA1F44EA0D7F91669DC060`.

The Director confirmed two launch additions after the recorded dirty fingerprint. They were the Phase 1 prompt and Director claim. The original fourteen-path dirty baseline remained preserved.

## Implementation evidence

| Surface | Result | SHA-256 |
|---|---|---|
| `tools/lib/phase8_matching_c.js` | Shared canonical baserom loader, final linked comparator, result combiner, and strict-verifier reuse | `D27994A6B86F100A770FC6922F7C0E77E6F0A9F0AD7619F0D93260C938CA1D02` |
| `tools/diff.js` | Schema 2 report and separate raw/asm display | `7FBA543F34CEBC16382DA0195F06872AB4460B262FCE53EE80F21D2705A12DE0` |
| `tests/diff_exactness.js` | Alias, placement, relocation, malformed-input, and score tests | `91AA3CC58878EAC294ACF75A80F2AE89C17100FF85EEDE9D6D34711CB8EA9684` |
| `tests/fixtures/diff-exactness/move-alias.json` | Retail `addu` and GNU `or` fixture words | `12EC64401898D2AE453E1D8BA92A6C0FC37FCB924E7C1C3D127B795F4F4A1687` |
| `tests/phase8_matching_c.js` | All-target raw linked-byte preservation proof | `07D9ADEC0A90A948A5C1214062FF149F72F10A26287C9F401A0A240F0BF3EC76` |
| `docs/WORKFLOW.md` | Canonical `EXACT`, `RAW BYTES DIFFER`, and `ERROR` meanings | `A7075C3086584EE0D092CE2B4A767ABF91DE7BD70720A2E14E3175FE6CDE697E` |
| `tests/README.md` | Focused test entry point | `752D0C118E3BEF022D181E8EF3F63672B79CEE8B3E59B0BA20B0FC8D23E26B68` |

The comparator requires one executable target section at the accepted runtime address. It also requires one matching load header at the accepted z64 ROM address.

The comparator reads bytes from `phase8.elf`. It never compares unresolved relocatable object bytes.

The public result contains these independent fields:

```text
asmDifferScoreZero
rawBytesExact
linkedTargetSha256
expectedTargetSha256
differingByteCount
differingInstructionWordCount
firstDifferenceOffset
exact
```

The result rule is `exact = asmDifferScoreZero && rawBytesExact`.

## Focused alias regression

Command:

```text
node tests/diff_exactness.js
```

Result: `PASS`.

The fixture gives asm-differ a zero-score alias pair. Retail contains `0x00801021`, while the GNU form is `0x00801025`.

Observed result:

```json
{
  "asmDifferScoreZero": true,
  "rawBytesExact": false,
  "exact": false,
  "differingByteCount": 1,
  "differingInstructionWordCount": 1,
  "firstDifferenceOffset": 3,
  "label": "RAW BYTES DIFFER"
}
```

Equal bytes and a zero score still returned `EXACT`.

Fifteen hostile mutations failed closed. They covered missing, duplicate, malformed, wrong-sized, non-executable, and wrongly placed sections.

They also covered malformed ELF ranges, reference drift, malformed rows, fractional scores, and out-of-range scores.

The relocation fixture compared final linked bytes successfully. Its unresolved object bytes remained nonexact.

## Preserved p3063 counterexample

The preserved pure candidate was read without modification:

`C:\Users\Joe\.codex\ob64-decomp-current\diff\func_0019554C-1786141068159-ea148f`

| Artifact | SHA-256 |
|---|---|
| `phase8.elf` | `06468B39DE827B7CB570727596CA24280B056569200CB9AF626F0D67A70EAE0D` |
| `asm-differ-proof/func_0019554C.json` | `A59947E02BC309BCB91B0981E9B2DD2117E05A0D940F51AE067DEB2EFF18D2B7` |

The preserved asm-differ proof reports 161 rows and score `0 / 16100`.

The corrected result is:

```json
{
  "asmDifferScoreZero": true,
  "rawBytesExact": false,
  "exact": false,
  "linkedTargetSha256": "E18458549F00E8CBC4299A2DAA58765904C964EB938E6FB0DBA02200AC463B2F",
  "expectedTargetSha256": "5985A5DFC866D4EFFB58C0E412AA76A8E0AE8DA0EF19BB8E44A6BF278C2A5E2B",
  "differingByteCount": 14,
  "differingInstructionWordCount": 14,
  "firstDifferenceOffset": 11
}
```

`firstDifferenceOffset` is the first differing byte. The first changed instruction starts at function-relative offset `+0x008`.

The current p3063 source remains unchanged and `HYBRID_C`. Its SHA-256 remains `284DC9EC2BF1ACBC31DE8E81F33B85393B89CEBE15309B162A39540C5302DA5D`.

## Real exact-target regression

Command:

```text
node tools/diff.js func_0002CD70
```

Result: `PASS`.

The schema 2 report is `build/diff/func_0002CD70.json`. Its SHA-256 is `C9D7FCDADAC6E3FFBDAD71AE81AEC569382141DB9166E06DF50B80C5CEA13319`.

The report preserves `HYBRID_C`. It reports score `0 / 1100`, raw equality, zero differences, and `EXACT`.

Both target hashes equal `9842231309587A8F054CE82E257F9DC0FD864608CF90266F53AFF570E37E1ADF`.

## Integrated verification

Final command:

```text
node tools/verify.js
```

Result: `PASS`.

The verifier passed baserom identity, toolchain, source policy, ownership, placement, relocations, target bytes, and full-ROM identity.

It checked 36 active owners. All 36 raw comparisons and asm-differ results were exact.

The final current fingerprint is `EFD02AE928D6ADC25CC20AC2B7309F65FD0CBABD1DCE78ED61E804E37ABF493E`.

The current build root is:

`C:\Users\Joe\.codex\ob64-decomp-current\current\efd02ae928d6adc25cc20ac2\build`

| Artifact | SHA-256 | Meaning |
|---|---|---|
| `build-report.json` | `0CA15B73732F25629F65F63F72CA953AA04FCA1ED7D7FF09302D97C884C330C2` | Passing build and verification chain |
| `phase8.elf` | `D7D27A84287557F020B264D9F10D03CDE83CEFE0D9F930D6060EDFEC3F16F03B` | Final linked section and load placement source |
| `phase8.map` | `56D405EB7C2050856394C9D6C73826D0E7A3F01B8AF6F33BAB90B0652662E427` | Sole-owner evidence |
| `phase8.us_rev0.z64` | `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A` | Exact complete retail ROM |
| `build/current/verification.json` | `759BA9F9AF06017F9A65FA5390507975C9BAA20DDDFCCA7DC2B250086F21FEED` | Strict all-target verification |
| `build/current/fresh-compilation.json` | `581D5DABE4DD5E2EBC795FD4F1FCAF4D17AACECB8F399715CC133928E2F5E788` | Fresh source-to-object identity |
| `build/source-policy/report.json` | `1C0AD83B565D074C6AB492E54237A5D80EE499463F914571D0BB134F9487CA18` | Three pure and 33 hybrid owners |

Additional passing commands:

```text
node tests/phase8_matching_c.js --output <final-current-build>
node tests/workflow_acceptance.js --output <final-current-build>
node tests/active_targets.js
git diff --check -- <Phase-1-owned paths>
node --check tools/lib/phase8_matching_c.js
node --check tools/diff.js
node --check tests/diff_exactness.js
node --check tests/phase8_matching_c.js
```

## Claims

### Claim 1

- Claim: A zero asm-differ score cannot produce `EXACT` when final linked bytes differ.
- Evidence grade: `Verified`.
- Review status: `pending`.
- Supporting artifacts: focused alias fixture and preserved p3063 proof.
- Competing interpretation: asm-differ aliases might still define exactness.
- Falsifier: any zero-score raw mismatch reporting `exact: true`.
- Product consequence: Phase 2 can no longer hide an adapter regression behind disassembly aliases.

### Claim 2

- Claim: Missing, duplicate, malformed, wrong-sized, or wrongly loaded target sections fail closed.
- Evidence grade: `Verified`.
- Review status: `pending`.
- Supporting artifacts: fifteen hostile fixture mutations.
- Competing interpretation: section bytes alone might be sufficient.
- Falsifier: any hostile fixture returning a comparison result instead of an error.
- Product consequence: the diff display cannot certify bytes detached from accepted placement.

### Claim 3

- Claim: Current exact owners and the complete retail ROM remain exact.
- Evidence grade: `Verified`.
- Review status: `pending`.
- Supporting artifacts: final strict verification and all-target test.
- Competing interpretation: the comparator could reject valid relocated owners.
- Falsifier: any accepted owner, relocation, placement, or ROM mismatch.
- Product consequence: Phase 1 changes reporting without changing accepted machine code.

## Limits

This phase does not add the dialect adapter. It does not change p3063 source or source classification.

This phase does not accept itself. Independent review remains mandatory before Phase 2.

The heavyweight adapter audit remains part of the later implementation phases. No queue state changed.
