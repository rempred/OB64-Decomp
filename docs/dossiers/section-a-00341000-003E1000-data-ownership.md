# Section A slice 2 — `0x00341000..0x003E1000` (chunks 52-61)

Data-territory ownership (second slice of survey Section A). Machine-readable inventory:
`docs/data-index/rev0/section-a-00341000-003E1000-data-inventory.json`. Builds on slice 1
(`docs/dossiers/section-a-00301000-00341000-data-ownership.md`) and the survey
(`docs/data-index/rev0/data-territory-survey-00301000.json`).

Classification: **DATA TERRITORY — source-owned as data parts** (no code). The second slice of the
survey's natural unit **Section A** (high-entropy asset pool `0x301000..0x4E3000`, 1,974,272 B). This
run owns chunks 52-61; Section A continues past `0x3E1000`.

## Composition

**64 parts = 37 data + 27 zero_fill (0 code)** over `0x341000..0x3E1000` (655,360 B = ten 64 KiB chunks).

| chunk | range | parts (data + zf) |
|---|---|---|
| 52 | `0x341000..0x351000` | 13 (7 + 6) |
| 53 | `0x351000..0x361000` | 9 (5 + 4) |
| 54 | `0x361000..0x371000` | 9 (5 + 4) |
| 55 | `0x371000..0x381000` | 9 (5 + 4) |
| 56 | `0x381000..0x391000` | 7 (4 + 3) |
| 57 | `0x391000..0x3A1000` | 1 (1 + 0) |
| 58 | `0x3A1000..0x3B1000` | 5 (3 + 2) |
| 59 | `0x3B1000..0x3C1000` | 3 (2 + 1) |
| 60 | `0x3C1000..0x3D1000` | 3 (2 + 1) |
| 61 | `0x3D1000..0x3E1000` | 5 (3 + 2) |

Byte split: **raw-but-classified data 654,812 B** · **parsed zero_fill 548 B** · **undecoded 0 B**.
Chunk 57 is a single 64 KiB object (no internal ≥4-word zero run).

- Incoming continuation: chunk 51 `data_0033FD78` → `data_00341000` (seamless; seam at `0x341000` has
  non-zero words on both sides — before `0xEDDEDACE`, after `0x62AF2102`).
- Outgoing continuation: `data_003DE988` runs to `0x3E1000` with no terminating zero-fill →
  continues into chunk 62 (Section A slice 3).

## Type — UNRESOLVED (kept conservative)

High-entropy packed asset data (entropy 6.99–7.28 bits/byte). Same family as slice 1; the survey's two
competing hypotheses (graphics/texture vs signed-PCM/ADPCM audio-codec residual) remain unresolved.
Names stay conservative `data_`/`zero_fill_`, status `raw-but-classified`. **Slice 1 was not
retroactively renamed** — no slice-2 evidence resolves the type.

**Container layout decoded** (the parser pass's positive finding): the range is a pool of **37 discrete
asset objects** separated by **27 short zero-fill pads** (4–7 words). Invariant: all 27 post-pad object
boundaries are **8-byte aligned but never 16-byte aligned** (`end & 0xF == 8`) — a deliberate
container-layout rule, *not* a fixed intra-object record stride. Object *contents* remain undecoded.
Heterogeneity signal: lag-1 byte correlation rises from ~0.01–0.05 (chunks 52–55) to ~0.245–0.288
(chunks 59–61) — the tail is measurably smoother (consistent with concatenated packed blocks; does not
classify type). Chunk 57's byte histogram skews to `0x00/0xFF/0x0F/0xF0/0x01/0x11/0x61/0x63` — a
compressed/encoded asset-stream signature.

## Proof of non-code (data-only safe)

**0 `jr $ra`, 0 stack prologues AND 0 epilogues / 0 `lw $ra` restores at ALL FOUR byte alignments;
0 `0x80xxxxxx` pointer-table runs** (not even two consecutive anywhere; RAM-range word density
0.056–0.07%, below the ~0.195% random expectation); no archive/LZSS/MIO0 magic; **0 real strings**
(strict ≥4-letter dictionary-word test = 0 hits across 320 KiB; the elevated coincidental-printable
counts in chunks 59–61 are garbage mixed runs, e.g. `C5WfR@N  C22// "5DCRAOBRTUFC5%`). Common-opcode
density only 33–50 % (real MIPS > 85 %); longest plausible-opcode run 10–12 words (random expectation);
JAL distinct/count ≈ 1.0 (no call-graph reuse). Confirmed by a deterministic lead scan + 2 independent
adversary passes (52-56 / 57-61) + an independent ownership re-derivation, all from the raw z64 baserom.

## Parent tooling / leads — region is parent-tooling-dark

`anyAcceptedRomLead = false`. No external artifact maps into `0x341000..0x3E1000`:

- `scripts/ob64_functions.json`: **0 functions** in range (last real function ends `0x2B89B4`; lone
  `0x594A9C` entry is `valid=false` masked-data noise, out of range).
- `scripts/ob64_archive_catalog.json`: first LHA `0x636784`, **0 in range**.
- `scripts/ob64_anim_block_catalog.json`: 63 blocks `0x4F0FB0..0x592490`, **0 in range**.
- **REJECTED (byte-verified):** `ob64_4a_audit.json` / `ob64_4f_audit.json` in-range-looking
  `gapOffset`s are **decompressed-7MB-LZSS-stream** offsets (source `ob64_7mb_blocks/`, max
  `0x6BA170` / `0x6DAE24`), NOT ROM. Disproof: stream `block_3126_0x341e44` = `e6f70000…` vs raw ROM
  `0x341E44` = `dcbd53ae…` (no match).
- **B-table-to-A hypothesis: re-tested + REJECTED for this slice.** The `0x4E3158` table (1798 records
  `[u32-BE offset 0x3848..0xDC58][u32-BE 0x64]`) yields **0 in-range records under all four mandated
  bases** (absolute / table-relative / section-B-tail / `0x301000`-relative). Only an unmandated
  `+0x341000` self-base hits, and it is provably coincidental (an arbitrary `+0x351000` also maps all
  1798; the offsets are one contiguous ~41 KB blob; 6.4 % coverage; no byte-verified justification).

Provenance is therefore **internal-scan-derived only**. If a future artifact is found that *does* map
into this range, the conservative names should be revisited.

## Verification

`check_boundaries` PASS (all 10 chunks, 0 code); `check_splits` 0 fragments; `check_manifest`
(62 chunks); `assemble_original_mips` byte-exact (code SHA unchanged); `verify_setup` /
`audit_code_region` — see the review handoff. Adversarial swarm: 6 passes, all clean (unanimous
ownership `yes`). Runtime states: none used (`RUNTIME_STATE_ONESHOT = none`). Patch-workbench: none
(data/asset territory, not patch space).

## Ownership status: `yes` (this slice only)

`0x341000..0x3E1000` is byte-exact tracked (64 `data_`/`zero_fill_` parts under `asm/original/rev0/lib/`),
with per-part provenance, this index, this dossier, recorded adversarial hidden-code proof, exact chunk
coverage, and confidence/caveats. **Only chunks 52-61 are owned** — the rest of Section A (to `0x4E3000`)
is NOT yet owned.

## Batch-size finding

The 10-chunk batch did **not** degrade review quality versus the 4-chunk slice 1, because this is
homogeneous high-entropy asset data with a machine-checkable ownership standard (contiguity math,
all-alignment code scan, zero-run set-equality, entropy floor) that scales O(bytes). **10 chunks is the
safe ceiling** for proven-clean, parent-tooling-dark, flat-signal data-only Section A runs; **drop back
to 4** the moment any chunk shows heterogeneity needing per-object reasoning (real compression magic, a
sustained low-entropy window < 6.0 bits/2 KB, a pointer/jump-table run ≥ 4, a meaningful ASCII/symbol
run, or any `jr $ra`/prologue hit).

## Next-run first action (chunk 62, `0x3E1000`)

Section A slice 3: own the `data_003DE988` high-entropy asset continuation across `0x3E1000`. Chunk 62
is still inside Section A (to `0x4E3000`); expect more data territory. Use the data-territory template;
a 10-chunk batch (62-71) is acceptable while the signal stays flat.
