# Section A slice 1 — `0x00301000..0x00341000` (chunks 48-51)

Data-territory ownership (first ownership run after the survey). Machine-readable inventory:
`docs/data-index/rev0/section-a-00301000-00341000-data-inventory.json`. Survey context:
`docs/data-index/rev0/data-territory-survey-00301000.json` +
`docs/REVIEW_2026-06-23_data-territory-survey.md`.

Classification: **DATA TERRITORY — source-owned as data parts** (no code). The first slice of the
survey's natural unit **Section A** (high-entropy asset pool `0x301000..0x4E3000`, 1,974,272 B). This
run owns only chunks 48-51; Section A continues past `0x341000`.

## Composition

**46 parts = 25 data + 21 zero_fill (0 code)** over `0x301000..0x341000` (262,144 B).

| chunk | range | parts (data + zf) |
|---|---|---|
| 48 | `0x301000..0x311000` | 9 (5 + 4) |
| 49 | `0x311000..0x321000` | 11 (6 + 5) |
| 50 | `0x321000..0x331000` | 13 (7 + 6) |
| 51 | `0x331000..0x341000` | 13 (7 + 6) |

Byte split: **raw-but-classified data 261,708 B** · **parsed zero_fill 436 B** · **undecoded 0 B**.

- Incoming continuation: chunk 47 `data_003002E8` → `data_00301000` (seamless, no zero gap at the
  `0x301000` seam — verified: 32 B before `0x301000` are non-zero high-entropy).
- Outgoing continuation: `data_0033FD78` runs to `0x341000` with no terminating zero-fill →
  continues into chunk 52 (Section A slice 2).

## Type — UNRESOLVED (kept conservative)

High-entropy packed asset data (entropy ~7.0–7.3). The survey recorded **two competing hypotheses**:
graphics/texture vs signed-PCM/ADPCM audio-codec-residual/sample-bank. This run did NOT resolve the
type — names stay conservative `data_`/`zero_fill_`, status `raw-but-classified`. A later Section A
slice or the A/B boundary may decide (e.g. testing the Section-B index table against Section A's tail).

## Proof of non-code (data-only safe)

**0 `jr $ra`, 0 stack prologues (`0x27BD8xxx..0x27BDFxxx`), 0 `0x80xxxxxx` RAM-pointer words** across
all 65,536 words; no real ASCII strings (only coincidental printable runs); no archive/LZSS/MIO0
magic; only small word-aligned zero-fill object separators. Confirmed by a deterministic lead scan +
2 independent adversary passes.

## Parent tooling / leads

- `scripts/ob64_functions.json`: **0 valid functions** in range. `scripts/ob64_archive_catalog.json`:
  **0 archive entries** (first LHA `0x636784`). `scripts/ob64_anim_block_catalog.json`: all 63 blocks
  `>= 0x4F0FB0` (none in range).
- **REJECTED**: `scripts/ob64_4a_audit.json` / `ob64_4f_audit.json` in-range-looking gapOffsets
  (16 + 6, e.g. `0x3016b4`, `0x332cde`) are **decompressed-7MB-LZSS-stream offsets, NOT ROM offsets**
  (audit max ~`0x6dae24`; byte-verified: ROM bytes at `0x332cde` are not a valid F3DEX2 display list).
- **B-table-to-A hypothesis: byte-tested + REJECTED for this slice.** The Section-B index table at
  ROM `0x4E3158` (1798 records `[u32-BE offset 0x3848..0xDC58][u32-BE 0x64]`) does not classify
  chunks 48-51: under absolute / table-relative / section-tail bases the offsets miss the slice; only
  base `0x301000` lands arithmetically in-slice (`0x304848..0x30EC58`) but the bytes there show no
  record structure — arithmetic coincidence, not a real mapping.
- `.s` fallback decode comments (RAM column / mnemonics): the invalid linear RAM=ROM back-map on data;
  ignored as evidence (0 real instructions).

## Mistakes corrected / hazards handled

- None structural — uniformly non-code. Segmented at zero-fill runs (the 2 benign tiling-QA notes:
  one incidental unaligned 16-B zero patch inside a data part, and word-aligned zero_fill subsets of
  slightly larger true runs — both correctly classified as data, no coverage error). No data forced
  into `func_*` files. Type kept conservative.

## Verification

`check_boundaries` PASS (all 4 chunks, 0 code); `check_splits` 0 fragments; `check_manifest` (52
chunks: 48=9, 49=11, 50=13, 51=13); `assemble_original_mips` byte-exact (code SHA unchanged);
`verify_setup` / `audit_code_region` — see the review handoff. Adversarial 4 passes: all clean.
Runtime states: none used (`RUNTIME_STATE_ONESHOT = none`). Patch-workbench: none (data/asset
territory, not patch space).

## Ownership status: `yes` (this slice only)

`0x301000..0x341000` is byte-exact tracked (46 `data_`/`zero_fill_` parts), with per-part provenance,
this index, this dossier, recorded adversarial hidden-code proof, exact chunk coverage, and
confidence/caveats. **Only this 4-chunk slice is owned** — the rest of Section A (to `0x4E3000`) is
NOT yet owned.

## Next-run first action (chunk 52, `0x341000`)

Section A slice 2: own the `data_0033FD78` high-entropy asset continuation across `0x341000`. Chunk 52
is still inside Section A (to `0x4E3000`); expect more data territory. Use the data-territory template.
