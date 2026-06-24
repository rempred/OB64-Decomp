# Section A slice 3 — `0x003E1000..0x00421000` (chunks 62-65) — FALLBACK

Data-territory ownership (third slice of survey Section A). Machine-readable inventory:
`docs/data-index/rev0/section-a-003E1000-00421000-data-inventory.json`. Builds on slice 2
(`docs/dossiers/section-a-00341000-003E1000-data-ownership.md`).

**This run FELL BACK from the planned 10-chunk batch (62-71, `0x3E1000..0x481000`) to 4 chunks
(62-65, `0x3E1000..0x421000`)** — chunk 66 contains a structured N64 audio sound-bank (low-entropy)
that trips the prompt's `<6.0 bits/2KiB → fall back` rule and needs a focused decode run.

Classification: **DATA TERRITORY — source-owned as data parts** (no code). Same high-entropy asset
family as slices 1-2.

## Composition

**32 parts = 18 data + 14 zero_fill (0 code)** over `0x3E1000..0x421000` (262,144 B = four 64 KiB chunks).

| chunk | range | parts (data + zf) | whole-chunk entropy |
|---|---|---|---|
| 62 | `0x3E1000..0x3F1000` | 5 (3 + 2) | 7.296 |
| 63 | `0x3F1000..0x401000` | 5 (3 + 2) | 7.252 |
| 64 | `0x401000..0x411000` | 7 (4 + 3) | 7.234 |
| 65 | `0x411000..0x421000` | 15 (8 + 7) | 7.144 |

Byte split: **raw-but-classified data 261,836 B** · **parsed zero_fill 308 B** · **undecoded 0 B**.
Min-2KB-window entropy across 62-65 = **6.49–6.97** (uniformly high; never structured-low).

- Incoming continuation: chunk 61 `data_003DE988` → `data_003E1000` (seamless; seam `0x3E1000` non-zero
  both sides — `0x62324433` / `0x054327F6`).
- Outgoing continuation: `data_00420438` runs to `0x421000` (no terminating zero-fill) → continues into
  chunk 66 (the deferred audio sound-bank).

## Fallback — why chunk 66 is deferred

Chunk 66 (`0x421000..0x431000`) is a **DECODED N64 libultra audio sound-bank**, found independently by
the hidden-code and parser passes via two embedded ASCII magic headers:

- **`N64 PtrTablesV2` @ `0x00423FF0`** — directory/pointer-table header.
- **`N64 WaveTables ` @ `0x00429CD0`** — sample-bank payload header (entropy resumes ~7.26 after it).

Between them: a 133-record fixed-stride table (strides `0xA0`/160 B ×106 + `0xD0`/208 B ×27, marker
word-pair `NN NN NN 02` / `NN NN NN 04`) and a monotonic u32-BE offset table (134 entries) @ `0x429820`
whose deltas `{160:106, 208:27}` equal the record strides (132/132 map base+offset → record marker).
The 128 B zero block @ `0x429A34` and the **519 B zero run @ `0x429AC1..0x429CC8`** are bank
terminator/alignment padding — the latter is the survey-documented *only* ≥256 B zero run in the whole
`0x301000..0x63676C` tail (internal padding, NOT a section boundary). Entropy collapse onset `0x423C00`,
trough **2.66 bits/2KB @ `0x429800`** (min-1KB 1.79 @ `0x429900`).

This is structured audio metadata, **not** the flat high-entropy asset family — it must not be folded
into the conservative `data_` template. Stopping at the clean chunk boundary `0x421000` defers all of
it to a focused run.

## Type — still UNRESOLVED for 62-65, but Section A is now likely AUDIO

Chunks 62-65 kept conservative (`data_`/`zero_fill_`, `raw-but-classified`), exactly per the slice-2
precedent. **New evidence:** the chunk-66 `N64 PtrTablesV2`/`N64 WaveTables` bank is strong evidence the
entire Section A high-entropy family (slices 1-3) is **AUDIO sample/bank data, not graphics/texture** —
partially resolving the long-standing slice-1/2 ambiguity. Kept as evidence only: the magics are in
chunk 66, not 62-65; 62-65 are likely the adjacent WaveTables sample payload but not byte-proven as
such, so they are owned conservatively (not typed as audio).

## Proof of non-code (data-only safe)

**0 `jr $ra`, 0 stack prologues, 0 epilogues, 0 `lw $ra` at all 4 byte alignments** (and 0 `jr $ra` at
every unaligned byte offset across `0x3E1000..0x431000`); **0 pointer-table runs** (max RAM-pointer run
1–2 words). Opcode validFrac 0.66–0.71 / branch coherence 0.42–0.45 = chance, vs CONTROL `.text` regions
(`0x80000`/`0x200000`/`0x2A0000`) scoring validFrac 0.99–1.00 / coherence 0.95–1.00 / 3.5–14.5 `jr $ra`
per Kword — the discriminator works and these targets have zero function framing. Chunk 66 also screened
non-code (the audio directory holds file-relative sample offsets, not `0x80xxxxxx` code addresses).

## Parent tooling / leads — parent-tooling-dark

`anyAcceptedRomLead = false`. 0 functions (last ends `0x2B89B4`), 0 archives (first LHA `0x636784`), 0
anim-blocks (region starts `0x4F0FB0`) in range. **REJECTED (byte-verified):** 4a in-range gapOffsets
(`0x3e4c4c`/`0x440172`/`0x44db22`) are decompressed-7MB-stream offsets — extracted blocks are all-zero-
leading vs dense ROM data (full-span match 0.7–1.4%, chance); 4f has 0 in-range. B-table-to-A re-tested:
the `0x4E3158` table's relative offsets resolve (base `0x4E3140`) to Section B's *own* payload
`0x4E6988..0x4F0D98`, not Section A — rejected. No parent artifact maps anything into the chunk-66
audio bank; its structure is self-describing via the embedded magics only.

## Verification

`check_boundaries` PASS (all 4 chunks, 0 code); `check_splits` 0 fragments; `check_manifest` (66
chunks); `assemble_original_mips` byte-exact (code SHA unchanged); `verify_setup` / `audit_code_region`
— see the review handoff. Adversarial swarm: 5 passes, unanimous (`yes` for 62-65, fallback endorsed).
Runtime states: none. Patch-workbench: none.

## Ownership status: `yes` (chunks 62-65 only)

`0x3E1000..0x421000` is byte-exact tracked (32 `data_`/`zero_fill_` parts), with per-part provenance,
the index, this dossier, recorded adversarial hidden-code proof, exact chunk coverage, and
confidence/caveats. **Only chunks 62-65 are owned**; chunks 66-71 (planned) are DEFERRED.

## Next-run first action — FOCUSED audio run (chunk 66, `0x421000`)

Decode/own the N64 audio sound-bank: `N64 PtrTablesV2` @ `0x423FF0` header + 133-record directory
(strides `0xA0`/`0xD0`, offset table @ `0x429820`) + `N64 WaveTables ` @ `0x429CD0` sample payload;
classify the 519 B zero run @ `0x429AC1` as bank padding; resolve the 0x28-byte record-header fields +
int16-BE coefficient/sample encoding; cross-check parent audio tooling (PI-DMA/growth loaders). Use a
small batch (1–2 chunks) until the schema is resolved; re-enable 10-chunk batches only once signal is
flat again.
