# Review Handoff: Section C HUFF pool — `0x005A1000..0x0063676C` (chunks 90-99) — LOOP-COMPLETE

Date: 2026-06-24.

Parser-backed data-territory ownership of the tail of the Section C N64 JPEG/NJPG-style "HUFF"
entropy-compressed resource pool, from the chunk-89 pool start to the configured data-ownership stop. **REACHED the stop
`0x0063676C`.** After this run the **entire configured code region `0x00001000..0x0063676C` is fully
source-owned (0 generated fallback chunks)** — the data-ownership loop is complete and a consolidated
coordinator report is due.

## ✅ LOOP-COMPLETE SUMMARY (read first)

- **Target:** `0x005A1000..0x0063676C` (612,204 B) = chunks 90-98 full + terminal partial chunk 99.
  **Owned:** all 612,204 bytes. **Frontier reached: `0x0063676C`** (the configured stop; did not own past).
- **Milestone:** code region `0x1000..0x63676C` now 100% source-owned (**100 composites / 6,181 files / 0
  fallback**). Consolidated coordinator report written: `docs/FINAL_DATA_OWNERSHIP_REPORT_2026-06-24.md`.
- **Bridge event: `agent/run-complete`**, frontier **`0x0063676C`**.

## Exact range / chunk coverage

- **Owned: chunks 90-98** (`0x5A1000..0x631000`, 9 full chunks) **+ terminal partial chunk 99**
  (`0x631000..0x0063676C`). Frontier `0x005A1000` → **`0x0063676C`**.

## Data/code composition — 36 parser-backed parts (all data, 0 zero_fill, 0 code)

Cut at word-aligned HUFF block starts (magic−12) + chunk seams. Per-chunk: 90:3, 91:4, 92:4, 93:4, 94:4,
95:3, 96:4, 97:4, 98:5, 99:1. 0 zero_fill (no zero-runs ≥16 B). Terminal chunk 99 = 1 part (`data_00631000`,
tail of final block 28).

## HUFF block / container evidence

29 HUFF blocks (first magic `0x5943D4`, last `0x630BC4`); 26 begin in span (blocks 3-28). Each block has a
**word-aligned 18-byte container header** at `magic−12`: `[u32 leadU32][48 55 FE 00][01 40 00 F0]["HUFF"]
[01 2C]` then compressed payload to the next block start. All 29 const-header-valid, all block-starts
word-aligned. **Decoded relation:** `leadU32 == blockSize − 4` for all 28 blocks 0..27 (verified, 0
mismatches) — a self-relative container length field. Blocks tile contiguously. Final block 28's natural end
(`0x636780`) is 20 B past the stop (in the structural gap); the terminal partial owns `0x630BB8..0x63676C`.

Post-review decode update, 2026-06-28: `node tools/analyze_section_c_huff.js` matches the N64 JPEG/NJPG HUFF path. The inner buffer begins `"HUFF"` + `0x012C`; `0x014000F0` is 320x240; `0x012C` is 300 macroblocks; MSB-first standard JPEG Huffman decode succeeds for 29/29 blocks and LSB-first succeeds for 0/29. Each decoded coefficient buffer is 230,400 B. Final renderable images still require the NJPG/RSP JPEG stage or equivalent IDCT, quantization/de-zigzag, and YUV conversion.

## Hidden-MIPS result

**DATA-ONLY SAFE.** All 4 alignments over 612,204 B: `jr $ra` = 0 at ANY alignment; 0 word-aligned
prologues (5 non-word-aligned FPs); 0 word-aligned `lw $ra`; 2 word-aligned `sw $ra` (both FPs, no `jr $ra`
to pair). No pointer/jump-table runs ≥4. Entropy ~7.974, 0 KB windows < 6.0. (The lead's quick scan
undercounted `lw/sw $ra` due to a sign-comparison bug; the swarm re-derived the correct counts — conclusion
unchanged.)

## Parent tooling — accepted/rejected leads

`anyAcceptedRomLead = false`, `huffDecoderInParent = false`. The editor `lh5Decompress`/`repack.js` Huffman
is the **different LHA LH5 codec** (`-lh5-` archives at `0x636784+`); it does not decode the `HUFF` magic.
The in-game boot codec subsystem (boot `0xB030..0xF22C`, canonical/adaptive-Huffman) is game MIPS, not a
parent tool, and not required for the current HUFF result. **REJECTED:** 0
functions in range (`ob64_functions.json`; `0x594A9C` is the known FP, below span); `ob64_4a_audit.json`
(113) / `ob64_4f_audit.json` (64) in-range gapOffsets are decompressed-7MB-stream coords (base
`0x20248C2`), byte-rejected. First LHA archive `0x636784` confirmed (`-lh5-`, `last_battle_test.n64`);
Section C precedes it.

## Ownership status

- **BYTES: `yes`** — every byte of `0x5A1000..0x63676C` byte-exact owned as 36 parser-backed data parts;
  `assemble` byte-exact (code SHA `40D4E787…B409` unchanged); 0 code (data-only-safe); container header
  decoded. Independent reviewer confirmed byte ownership; the later 2026-06-28 decode strengthens the data
  classification.
- **Natural Section C unit: `partial`** ? the HUFF entropy stage is decoded to coefficient buffers, but
  final image rendering and several wrapper/directory semantics remain unresolved.

## Machine-readable index & dossier

- Index: `docs/data-index/rev0/section-c-huff-pool-005A1000-0063676C-data-inventory.json` — `blockTable`
  (29 blocks), `decodedContainerSchema` (`leadU32==blockSize−4`), `terminalPartial`, `hiddenCodeRisk`,
  `sectionCBoundaryAndLha`, `rejectedLeads`, `loopCompletion`. Validated: parses; data 612,204, contiguous
  `0x5A1000..0x63676C`, 36 subregions, 0 gaps.
- Dossier: `docs/dossiers/section-c-huff-pool-005A1000-0063676C-data-ownership.md`.

## Verification results

```text
JSON parse section-c-huff-pool-005A1000-0063676C-data-inventory.json   parses; data=612,204; contiguous to 0x63676C; 36 subregions; 29 blocks
source-owner coverage 0x5A1000..0x63676C                               36 parts, byte-exact, 0 gaps
node tools/check_manifest.js                                           ALL CHECKS PASS (100 chunks)
node tools/check_boundaries.js / check_splits.js (x10)                 BOUNDARY CHECK PASS; 0 fragments / 0 code
node tools/assemble_original_mips.js                                   Exact code-region match: PASS (SHA 40D4E787..B409 unchanged)
node tools/verify_setup.js                                             PASS (100 composites / 6,181 files / 0 fallback)
node tools/audit_code_region.js                                        OK (executable extent 0x1000..0x2B89B4 unchanged)
git diff --check                                                       clean
```

## Stop condition reached or fallback?

**Reached the configured stop `0x0063676C` exactly.** The terminal partial chunk 99 is fully owned (1 data
part ending at the stop). Did not own past `0x63676C` (the structural gap + LHA region remain out of scope).

## Caveats & unresolved fields

- HUFF entropy stage decoded; final renderable pixels are not yet produced.
- `leadU32` semantic name/units unknown (value = `blockSize−4`, self-relative length).
- Coefficient buffers are 230,400 B per block, but quant tables / RSP JPEG parameters / display target are not yet recovered.
- Block 28's true tail (`0x63676C..0x636780`) lies in the out-of-scope structural gap.
- Directory entries 2-31 now map to the HUFF block run and natural pool end; entries 32-64 remain unresolved.

## Runtime-state & patch-workbench

No runtime states (`RUNTIME_STATE_ONESHOT = none`; request log unchanged). No patch-workbench (data/asset
territory, static-only).

## Is a final consolidated coordinator report due?

**Written.** This is the final data-ownership-loop run; the configured code region `0x1000..0x63676C` is now
fully source-owned (0 fallback chunks). Recommended next: implement the NJPG render stage and resolve the
remaining Section C directory entries. The structural gap and LHA region are out of scope without Joe's
explicit ask.

## Commits

- `974f346` — `Source-own Rev0 Section C HUFF pool chunks 90-99 (0x5A1000..0x63676C) + advance current-state docs`
  (36 parser-backed parts + manifest + index + dossier + current-state docs).
- This review handoff (final commit).

## Review doc path

`docs/REVIEW_2026-06-24_section-c-huff-pool-005A1000-0063676C-data-ownership.md`
