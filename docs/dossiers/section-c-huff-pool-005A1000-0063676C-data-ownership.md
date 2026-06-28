# Section C HUFF pool — `0x005A1000..0x0063676C` (chunks 90-99) — LOOP-COMPLETE

Parser-backed data-territory ownership of the **tail of the Section C custom "HUFF" Huffman-compressed
resource pool**, continuing from the chunk-89 pool start to the configured data-ownership stop. Machine-
readable inventory: `docs/data-index/rev0/section-c-huff-pool-005A1000-0063676C-data-inventory.json`.

**This run REACHES the configured stop `0x0063676C`** (the end of the configured code region). After it, the
**entire code region `0x00001000..0x0063676C` is fully source-owned** (0 generated fallback chunks) — the
data-ownership loop is complete. Final consolidated report:
`docs/FINAL_DATA_OWNERSHIP_REPORT_2026-06-24.md`.

Classification: **DATA TERRITORY — Section C N64 JPEG/NJPG-style "HUFF" entropy-compressed resource pool**
(length-linked OB64 wrapper; container header decoded; Huffman entropy stage decoded to macroblock
coefficient buffers; final image render pending).

## Composition — 36 parser-backed parts (all data, 0 zero_fill, 0 code)

Parts cut at **word-aligned HUFF block starts (magic−12) + chunk seams**. Per-chunk counts: 90:3, 91:4,
92:4, 93:4, 94:4, 95:3, 96:4, 97:4, 98:5, 99:1. Blocks straddling a chunk seam are owned as HEAD (ends at
seam) + TAIL (next chunk). 0 zero_fill parts (no zero-runs ≥16 B; max zero-run 6 B).

- **Chunks 90-98 full** (`0x5A1000..0x631000`) = 35 parts.
- **Terminal partial chunk 99** (`0x631000..0x0063676C`) = 1 part (`data_00631000`), the tail of the final
  block 28. Fully promotable: `assemble` tiles against the source-report chunk's `romEndExclusive`
  (`0x63676C`), not a forced `0x_1000` boundary; `codeRegion.endExclusive = 0x63676C`.
- **Incoming:** chunk 89 `data_005943C8` (HUFF pool start, blocks 0-2 head) → `data_005A1000` (tail of
  block 2 across the `0x5A1000` seam).

## HUFF block container — DECODED header (swarm byte-verified)

29 HUFF blocks across the pool (first magic `0x5943D4`, last `0x630BC4`); **26 begin in this run span**
(blocks 3-28). Each block has a **word-aligned 18-byte container header** at `magic−12`:

```
+0x00  u32  leadU32   (0x0000XXXX, big-endian)
+0x04  4B   48 55 FE 00     (const, all 29 blocks)
+0x08  4B   01 40 00 F0     (const, all 29 blocks)
+0x0C  4B   48 55 46 46     "HUFF" magic
+0x10  2B   01 2C           (const, all 29 blocks)
+0x12  ..   compressed payload  → runs to the next block start
```

**Decoded relation (new this run):** `leadU32 == blockSize − 4` for **all 28 blocks 0..27**
(`start + leadU32 + 4 == nextBlockStart`, verified, 0 mismatches) — the leading u32 is a **self-relative
container length field**. Its semantic name/units (encoded-length vs decompressed-size) remain unknown.
Blocks tile **contiguously**. The final block 28 (`0x630BB8`) has `leadU32 = 0x5BC4` → a natural end of
`0x636780`, which is **20 B past the stop `0x63676C`** (inside the structural gap, before LHA `0x636784`);
so this run owns only `0x630BB8..0x63676C` of block 28.

## HUFF payload decode attempt — 2026-06-28

`node tools/analyze_section_c_huff.js` now dumps/parses/classifies the pool under ignored
`build/huff-section-c/`. It writes per-block container/payload dumps, a JSON/Markdown report, and
standard-JPEG-Huffman coefficient buffers under `build/huff-section-c/njpg/`.

Result: **all 29 blocks decode with the N64 JPEG/NJPG HUFF shape**:

- Inner buffer at `blockStart+0x0C` begins with `"HUFF"` + `0x012C`.
- Header word `0x014000F0` decodes naturally as **320x240**.
- `0x012C` = **300 macroblocks** = `(320/16) * (240/16)`.
- MSB-first standard JPEG Huffman decode succeeds for **29/29** blocks.
- LSB-first decode fails for **0/29** blocks.
- Each decoded coefficient buffer is **230,400 B** (`300 * 6 * 64 * 2`).
- Aggregate compressed payload: **663,982 B**, entropy **7.9742 bits/byte**.
- Generic zlib/raw-deflate/gzip probes still produce **0** successes.

This is the CPU entropy stage only. Final renderable images still require the NJPG/RSP JPEG stage or an
equivalent IDCT, quantization, de-zigzag, and YUV conversion path. External format anchor:
Nintendo's N64 JPEG/NJPG manual describes a `"HUFF"` Huffman-compressed JPEG path and a 16x16 macroblock
layout: <https://ultra64.ca/files/documentation/online-manuals/man/pro-man/pro25/25-07.html>.

Directory refinement: entries 2-30 map exactly to HUFF block starts 0-28, entry 31 maps to the natural
HUFF pool end `0x636780`, and entry 48 repeats the final block start. Entries 32-64 do **not** resolve to
simple raw Section C block starts under the directory base; their meaning remains unresolved.

## Proof of non-code (data-only safe)

Swarm adversary + parent + schema passes, all 4 byte alignments over 612,204 B: **`jr $ra` = 0 at ANY
alignment** (the necessary condition for a returning function is absent); **0 word-aligned prologues** (5
`0x27BD`+signbit words exist but all NON-word-aligned coincidences inside compressed payload); 0
word-aligned `lw $ra`; 2 word-aligned `sw $ra` (`0x5A14A0`, `0x61BF28` — large non-frame immediates, no
`jr $ra` to pair = false positives). No pointer/jump-table runs ≥4. Entropy ~7.974, **0 KB windows < 6.0**.
Contrast known code `0x1000..0x100000`: 2105 `jr $ra`, 1286 (all word-aligned) prologues, entropy 5.99.

> Note: the lead's quick scan had a sign-comparison bug that undercounted word-aligned `lw/sw $ra`; the
> swarm independently re-derived the correct counts (above). Conclusion unchanged — data-only-safe.

## Parent tooling — accepted/rejected leads

**No parent TOOL decodes the "HUFF" (`48 55 46 46`) blocks** (`huffDecoderInParent = false`;
`anyAcceptedRomLead = false`). The editor `lh5Decompress`/`repack.js` Huffman is the **different LHA LH5
codec** (DICBIT=13, NC=510/NP=14/NT=19) targeting the `-lh5-` archives at `0x636784+`; the archive scanner
only matches `-lh?-`. The repo also decompiles an **in-game** boot codec subsystem (boot `0xB030..0xF22C`:
LZSS + canonical-Huffman/DEFLATE + adaptive-Huffman; e.g. `boot_decode_huffman_codelengths 0xECF0`) — game
MIPS, not a parent tool, and not required for the current HUFF result; the analyzer matches the N64
JPEG/NJPG HUFF path instead. **REJECTED:** 0 functions in range (`ob64_functions.json`; the lone `0x594A9C` entry is the known
false positive, below the span); `ob64_4a_audit.json` (113) / `ob64_4f_audit.json` (64) in-range gapOffsets
are decompressed-7MB-stream coords (base `0x20248C2`), byte-rejected.

## Boundary & LHA

Pool start `0x5943C8` (chunk 89) → owned end `0x63676C` (configured stop, mid-data). The 24-byte
**structural gap** `0x63676C..0x636784` (high-entropy filler incl. ~20 B of block 28's payload tail) is the
full-ROM-manifest `raw_structural_gap`, **out of scope**. First **LHA archive** at `0x636784` (`-lh5-` at
`0x636786`, `last_battle_test.n64`); Section C precedes it.

## Verification

`check_manifest` (100 chunks); `check_boundaries`/`check_splits` PASS (10 chunks, 36 parts, 0 fragments, 0
code); `assemble_original_mips` **byte-exact** (code SHA `40D4E787…B409` unchanged); `verify_setup` +
`audit_code_region` — see review handoff. Runtime states: none. Patch-workbench: none.

## Ownership status: BYTES `yes` / natural-unit `partial`

Every byte of `0x5A1000..0x63676C` is byte-exact owned as 36 parser-backed data parts, 0 code, with the
HUFF container header decoded (incl. `leadU32==blockSize−4`). The natural Section C unit is **partial**:
the HUFF entropy stage is decoded to coefficient buffers, but final image rendering and several wrapper/
directory semantics remain unresolved. The earlier byte-ownership standard was already satisfied before payload decoding; the new decode result
strengthens the data-territory classification.

## Caveats & unresolved fields

- HUFF entropy stage decoded; final renderable pixels are not yet produced.
- `leadU32` verified numerically as `blockSize−4` (self-relative length); semantic name/units unknown.
- Coefficient buffers are 230,400 B per block, but quant tables / RSP JPEG parameters / display target are
  not yet recovered.
- Const header word `48 55 FE 00` purpose unknown; `01 40 00 F0` is 320x240 and `01 2C` is 300 macroblocks.
- Block 28's natural end `0x636780` is past the stop; the terminal partial owns only `0x630BB8..0x63676C`.
- The chunk-89 65-entry directory has a compressed-block run (entries 2-31 plus entry 48 repeat), but
  entries 32-64 remain unresolved.

## Loop completion / next

This is the **final data-ownership-loop run**. After it the configured code region `0x1000..0x63676C` is
fully source-owned (100 composites / 6,181 files / **0 fallback**). **Final consolidated report:
`docs/FINAL_DATA_OWNERSHIP_REPORT_2026-06-24.md`.** Optional decode track: implement the NJPG render stage
and resolve the remaining Section C directory entries. Out of scope without Joe: the structural gap
`0x63676C..0x636784` and the LHA archive region `0x636784+`.
