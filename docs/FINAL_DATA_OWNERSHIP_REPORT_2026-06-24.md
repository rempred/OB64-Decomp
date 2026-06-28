# Final Data-Ownership Loop Report

Date: 2026-06-24

Scope: Rev 0 decomp workspace, configured original-MIPS/code-region span
`0x00001000..0x0063676C`.

## Executive Summary

The normal data-ownership loop reached its configured stop condition at
`0x0063676C`. Chunks 0-99 are now fully source-owned as named code/data parts:
100 composite chunks, 6,181 tracked real-assembler source files, and 0 generated
fallback chunks.

The final run, Section C HUFF pool tail
`0x005A1000..0x0063676C`, owned 612,204 bytes as 36 parser-backed data parts
with no gaps, no zero-fill parts, and no code. The bridge event
`20260624235102-run_complete-f66775` was reviewed and marked handled after the
coordinator spot checks below. No follow-up Claude prompt was sent because the
loop stop was reached.

The configured region is conservative: executable MIPS evidence ends around
`0x00001000..0x002B89B4`; the trailing region is data-evidenced, rebuildable,
and now owned as data-oriented source parts while still living under the
configured original-MIPS assembly/rebuild path.

## Final Coverage

| Metric | Result |
| --- | --- |
| Configured region | `0x00001000..0x0063676C` |
| Configured bytes | 6,510,444 |
| Composite chunks | 100 |
| Tracked source files | 6,181 |
| Generated fallback chunks | 0 |
| Assembled code-region SHA256 | `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409` |
| Full rebuilt ROM SHA256 | `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A` |
| Normal loop stop | `0x0063676C` reached |

The full-ROM source manifest remains separate and still covers the entire
41,943,040-byte ROM by broader source strategies. This report covers the
detailed source-ownership refinement loop inside the configured original-MIPS
region.

## Ownership By Natural Unit

| Natural unit | Range | Byte ownership | Natural-unit status | Notes |
| --- | --- | --- | --- | --- |
| Executable MIPS extent | `0x00001000..0x002B89B4` | yes | partial semantic decomp | Fully source-owned as original MIPS/code parts. Function and behavior names remain conservative unless runtime/subsystem evidence exists. |
| Code/data transition | chunk 43, `0x002B1000..0x002C1000` | yes | mixed | Last code epilogue around `0x002B89B8`; tail is non-code display-list/float/asset data. |
| Early non-code tail and Section A pre-audio data | `0x002B89B8..0x00421000` | yes | partial | High-entropy data territory, segmented into data and zero-fill parts. Exact asset type is not fully decoded for all slices. |
| Section A audio bank and flat audio | `0x00421000..0x004E3140` | yes | partial | Section A is AUDIO. PtrTablesV2/WaveTables evidence identifies the bank, and chunk 67 closes the WaveTables payload. Directory-to-sample addressing and several fields remain unresolved. |
| Section B boundary/index/payload | `0x004E3140..0x004F0FB0` | yes | partial | Section A/B boundary is pinned at `0x004E3140`. Section B begins with a decoded-shape 1,798-record index and a payload area whose payloadLen-vs-anim-block interpretation remains unresolved. |
| Section B cutscene audio-sequence block family | `0x004F0FB0..0x00594280` | yes | partial | Parser-backed 63-block family, all data, tag `0x215`. Blocks are owned through the family end, but higher-level decoded meaning remains partial. |
| Section B tail and Section C start | `0x00594280..0x005A1000` | yes | partial | Section B family closes at `0x00594280`. Section C starts with a 65-entry u32-BE directory, zero pad, and the first N64 JPEG/NJPG-style HUFF blocks. |
| Section C HUFF pool to loop stop | `0x005A1000..0x0063676C` | yes | partial | 36 parser-backed data parts, 29-block container evidence across the pool; HUFF entropy stage decoded to coefficient buffers, final image render pending. |
| Structural gap and LHA archives | `0x0063676C..` | out of this loop | out of scope | The 24-byte structural gap `0x0063676C..0x00636784` and first `-lh5-` archive at `0x00636784` are not part of the normal data-ownership loop. They remain covered by full-ROM source strategies. |

## What "HUFF" Means Here

"HUFF" is an ASCII magic value (`48 55 46 46`) found inside a custom compressed
resource-pool container in Section C. It is not a generic label we invented for
any high-entropy data; it is a repeated on-ROM marker.

Known Section C layout:

- Section C boundary: `0x00594280`.
- Directory: `0x00594280..0x00594384`, 65 u32-BE entries.
- Zero pad: `0x00594384..0x005943C8`.
- HUFF pool starts at `0x005943C8`.
- First HUFF magic: `0x005943D4`.
- Last HUFF magic found in the loop span: `0x00630BC4`.
- Total HUFF blocks: 29.

Each block begins at `magic - 12` and uses an 18-byte container header:

```text
+0x00  u32 leadU32
+0x04  48 55 FE 00
+0x08  01 40 00 F0
+0x0C  "HUFF" (48 55 46 46)
+0x10  01 2C
+0x12  compressed payload bytes until the next block start
```

For blocks 0-27, `leadU32 == blockSize - 4`, so it is a self-relative
container length field. The name and semantic unit of that field are still not
known. The final block's natural end appears to extend to `0x00636780`, but the
normal loop intentionally stops at `0x0063676C`; the remaining 20 bytes are in
the out-of-scope structural gap.

Practical interpretation: Section C is an N64 JPEG/NJPG-style HUFF entropy
pool inside an OB64-specific wrapper. The container is identified and byte-owned,
and the CPU Huffman stage now decodes to macroblock coefficient buffers. Final
renderable images still need the NJPG/RSP JPEG stage or an equivalent IDCT,
quantization/de-zigzag, and YUV conversion path.

Post-report decode update, 2026-06-28:

- `node tools/analyze_section_c_huff.js` parses all 29 HUFF blocks.
- Header word `0x014000F0` is 320x240.
- `0x012C` is 300 macroblocks = `(320 / 16) * (240 / 16)`.
- MSB-first standard JPEG Huffman decode succeeds for 29/29 blocks.
- LSB-first decode succeeds for 0/29 blocks.
- Each decoded coefficient buffer is 230,400 bytes.
- Directory entries 2-30 map to the 29 HUFF block starts, entry 31 maps to the
  natural pool end `0x00636780`, and entry 48 repeats the final block start.
  Entries 32-64 remain unresolved.

## Unresolved Questions

- Implement the NJPG render stage for the decoded coefficient buffers.
- Resolve the remaining Section C directory entries and any decompressed asset
  offsets they index.
- Name `leadU32` only after its semantic role is proven; current evidence only
  proves `leadU32 == blockSize - 4` for non-final blocks.
- Resolve Section B index/payload interpretation, especially the
  payloadLen-vs-anim-block relationship.
- Finish Section A audio semantics: directory-to-sample addressing, remaining
  bank fields, and any sample/export implications.
- Reclassify the data tail out of `original_mips` only after a separate segment
  policy pass pins the exact code/data boundary and keeps exact rebuild green.

## Rejected Or Downgraded Leads

- Parent editor `lh5Decompress`/`repack.js` Huffman code is for standard LHA
  `-lh5-` archives beginning at `0x00636784+`; it does not decode the Section C HUFF/NJPG path.
- Parent 4a/4f findings are decompressed stream offsets, not ROM offsets. Do not
  compare them directly to ROM addresses without a mapping.
- Parent function DB false positives in the data tail are not accepted code
  ownership evidence. The known Section C prologue-like value near `0x00594A9C`
  is compressed-data noise, not a function.
- Hidden-MIPS checks found no credible executable code in the Section C HUFF
  span: no `jr $ra` at any alignment, no word-aligned prologues, no credible
  pointer/jump-table runs.
- The old survey boundary near `0x00595000` is superseded. The Section B/C
  natural boundary is `0x00594280`; the HUFF pool itself starts at
  `0x005943C8`.

## Verification Results

Coordinator spot checks after the final bridge event:

```text
JSON index coverage
  docs/data-index/rev0/section-c-huff-pool-005A1000-0063676C-data-inventory.json
  36 subregions, 612,204 bytes, exactly 0x005A1000..0x0063676C, 0 gaps

node tools/check_manifest.js
  ALL CHECKS PASS

node tools/audit_code_region.js
  Code-region audit: OK
  Executable extent: 0x00001000..0x002B89B4
  Tail verdict: data-evidenced

node tools/assemble_original_mips.js
  Exact code-region match: PASS
  SHA256: 40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409

node tools/verify_setup.js
  PASS
  100 composite chunks / 6,181 tracked files / 0 generated fallback chunks
  Source-manifest rebuild exact
  Assembled-code rebuild exact

git diff --check
  clean

git status --short --branch
  ## main
```

## Stop Condition

The normal data-ownership loop stops at `0x0063676C`. Do not continue chunk
prompts into the rest of the 40 MB ROM unless Joe explicitly asks for a new
workflow, such as archive/audio/LZSS/raw-owner promotion or deeper indexing.

## Recommended Optional Future Workflows

1. NJPG render track: implement de-zigzag, quantization, IDCT, and YUV
   conversion for the decoded Section C coefficient buffers, or match the RSP
   JPEG microcode path.
2. Section C directory mapping: resolve the remaining 65-entry directory values
   and any decompressed asset offsets they index.
3. Section A/B semantics cleanup: finish unresolved audio-bank fields, sample
   addressing, Section B index/payload semantics, and audio-sequence exports.
4. Code-region reclassification: shrink the configured executable source region
   to the pinned MIPS extent and move the data tail into a tracked data source
   form, with `node tools/verify_setup.js` green before and after.
5. Tracked non-code owner promotion: continue replacing generated full-ROM
   fallback owners with curated tracked source-owner files.

## Canonical Artifacts

- Final review:
  `docs/REVIEW_2026-06-24_section-c-huff-pool-005A1000-0063676C-data-ownership.md`
- Final index:
  `docs/data-index/rev0/section-c-huff-pool-005A1000-0063676C-data-inventory.json`
- Final dossier:
  `docs/dossiers/section-c-huff-pool-005A1000-0063676C-data-ownership.md`
- Setup verification report:
  `build/setup/verify-setup-report.json`
- Full-ROM source manifest:
  `docs/FULL_ROM_SOURCE_MANIFEST.md`
