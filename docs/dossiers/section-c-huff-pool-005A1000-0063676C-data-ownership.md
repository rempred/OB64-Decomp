# Section C HUFF pool — `0x005A1000..0x0063676C` (chunks 90-99) — LOOP-COMPLETE

Parser-backed data-territory ownership of the **tail of the Section C custom "HUFF" Huffman-compressed
resource pool**, continuing from the chunk-89 pool start to the configured data-ownership stop. Machine-
readable inventory: `docs/data-index/rev0/section-c-huff-pool-005A1000-0063676C-data-inventory.json`.

**This run REACHES the configured stop `0x0063676C`** (the end of the configured code region). After it, the
**entire code region `0x00001000..0x0063676C` is fully source-owned** (0 generated fallback chunks) — the
data-ownership loop is complete. A consolidated coordinator report is now due.

Classification: **DATA TERRITORY — Section C custom "HUFF" Huffman-compressed resource pool** (length-linked
blocks; container header decoded; compressed payload undecoded).

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
MIPS, not a parent tool, not tied to the Section C pool; noted only as a candidate decoder for a future
attempt. **REJECTED:** 0 functions in range (`ob64_functions.json`; the lone `0x594A9C` entry is the known
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
HUFF container header decoded (incl. `leadU32==blockSize−4`). The natural Section C unit is **partial**: the
compressed payload + `leadU32` semantics + per-block decompressed semantics are undecoded (no decoder). The
prompt's `yes` standard explicitly allows undecoded-compressed payload when byte ownership + container
classification + code-risk are strong — all three hold here.

## Caveats & unresolved fields

- HUFF compressed payload UNDECODED (no parent/in-game decoder proven against the `48 55 46 46` magic).
- `leadU32` verified numerically as `blockSize−4` (self-relative length); semantic name/units unknown.
- Per-block decompressed size / symbol count / Huffman code-table layout unknown.
- Const header runs `48 55 FE 00`, `01 40 00 F0`, `01 2C` purpose unknown (constant on all 29 blocks).
- Block 28's natural end `0x636780` is past the stop; the terminal partial owns only `0x630BB8..0x63676C`.
- The chunk-89 65-entry directory → 29-HUFF-block mapping (directory indexes a decompressed asset space) is
  unresolved.

## Loop completion / next

This is the **final data-ownership-loop run**. After it the configured code region `0x1000..0x63676C` is
fully source-owned (100 composites / 6,181 files / **0 fallback**). **A consolidated coordinator report is
due.** Optional decode track: attempt the custom "HUFF" codec (candidate: the in-game boot Huffman
subsystem) + map the directory to decompressed blocks. Out of scope without Joe: the structural gap
`0x63676C..0x636784` and the LHA archive region `0x636784+`.
