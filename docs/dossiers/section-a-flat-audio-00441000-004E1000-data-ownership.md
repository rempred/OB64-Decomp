# Section A flat audio — `0x00441000..0x004E1000` (chunks 68-77)

Data-territory ownership: the flat Section A audio sample payload after the chunk-66/67 audio bank. Back
to the standard 10-chunk default. Machine-readable inventory:
`docs/data-index/rev0/section-a-flat-audio-00441000-004E1000-data-inventory.json`.

Classification: **DATA TERRITORY — flat raw 4-bit ADPCM/VADPCM Section A audio sample payload** (no
container header in this range; the codebook directory is the chunk-66 bank).

## Composition

**194 parts = 102 data + 92 zero_fill (0 code)** over `0x441000..0x4E1000` (655,360 B = ten 64 KiB
chunks). Byte split: **raw-but-classified data 653,276 B · parsed zero_fill 2,084 B.** Whole-range
entropy **7.309** (flat). Per-chunk parts: 68 = 33, 69 = 23, 70 = 19, 71 = 23, 72 = 21, 73 = 33,
74 = 13, 75 = 7, 76 = 7, 77 = 15.

- Incoming: chunk 67 `data_0043F3D8` → `data_00441000` (seamless, no zero gap at `0x441000`).
- Outgoing: `data_004E0CE8` runs to `0x4E1000` (no terminating zero-fill) → continues into chunk 78.

## Type — flat raw ADPCM/VADPCM audio (byte-verified)

Global byte histogram top values `0x00/0x0F/0xF0/0xFF/0x10/0x01/0x11/0x1F` = the canonical 4-bit
signed-delta ADPCM fingerprint. **No sub-bank header** anywhere (0 `N64 PtrTablesV2`/`N64 WaveTables`/
AIFC/AIFF/FORM/SSND/COMM/CTL/TBL/`0xD3000000`); **no compression magic**; **no fixed record stride**
(autocorrelation only diffuse mult-of-9 VADPCM-frame peaks, shared with the high-entropy windows); **no
pointer/index table** (0x80–8F density below random, longest run < 4). Conservative `data_`/`zero_fill_`;
ownership is byte-exact, not per-sample decode (the owning codebook is the chunk-66 bank).

### Low-entropy windows — quiet audio, NOT structure (no fallback)

4 of 320 2KB-windows dip `<6.0` (`0x46A800`=5.94, `0x482800`=5.96, `0x4DF000`=5.99, `0x4DF800`=5.97),
scattered (not sustained). Each has an **extreme U-shaped nibble histogram (U-ratio 9.8–27)** identical
*in kind* to the high-entropy windows — they differ only in amplitude (quiet/low-amplitude passages,
deltas cluster to 0/±1 → lower byte entropy), with **no zero/padding blocks, no record marker, no
header, no stride**. The lead considered and **rejected the `<6.0 → fall back` rule** here because these
are quiet audio, not a structured region; the swarm independently agreed (`lowEntropyWindowsAreStructure
= false`).

## Proof of non-code (data-only safe)

0 `jr $ra` / 0 prologues / 0 epilogues / 0 `lw $ra` / 0 pointer-runs at **all 4 byte alignments**
(655,360 B). Disasm is the structural *inverse* of code: 11–26 reserved/illegal encodings per 64 words,
**0 NOPs**, branch density 14–36 % (real MIPS ~6 %), 0 `jr` per window — vs the control boot region
`0x1000` (100 % legal, 10 NOPs, 6 % branch, `jr` present). Confirmed by a deterministic scan + a 5-pass
swarm.

## Parent tooling / leads — none accepted (`anyAcceptedRomLead = false`)

`ob64_audio_region_analysis.js` (ROM 0x925483..) and `research/ob64_crack_gap3.js` (stream coords) =
comparison/rule-out only. **TRAP byte-rejected:** the single in-range 4a gapOffset `0x44DB22` is a
decompressed-7MB-stream coord (gap base `0x20248C2`) — ROM there is ADPCM noise (no header). 4f: 0
in-range. `ob64_archive_catalog.json`: first LHA `0x636784` (none in range). `ob64_anim_block_catalog.json`:
blocks `≥ 0x4F0FB0` (just past the A/B boundary; none in range). No audio loader in parent
`editor/`/`tools/`/`wiki/`/`ModderResources/` reads this payload.

## Verification

`check_boundaries`/`check_splits` PASS (all 10 chunks, 0 fragments, 0 code); `check_manifest` (78
chunks); `assemble_original_mips` byte-exact (code SHA unchanged); `verify_setup` / `audit_code_region`
— see the review handoff. Runtime states: none. Patch-workbench: none.

## Ownership status: `yes`

All 655,360 bytes byte-exact owned (194 parts). The 10-chunk batch **stayed clean** (no fallback). Per-
sample VADPCM params + the owning codebook are out-of-range (chunk-66 bank) and don't downgrade
byte-exact ownership.

## Caveats & unresolved fields

- Per-sample VADPCM frame params / codebook predictors unresolvable in-range (codebook is the chunk-66
  bank); true per-sample object edges unknown (conservative zero-fill splits).
- Whether this payload is a later segment of the chunk-66 bank or a separate bank is unresolved.
- No editor/runtime loader reads these samples (static classification only).

## Next-run first action — short transitional unit, then PARSE Section B

**Chunk 78 onward (`0x4E1000`) is NOT a flat 10-chunk batch.** Only ~`0x2000` of flat Section A audio
remains (`0x4E1000..~0x4E3158`); then the **Section A/B boundary** — byte-confirmed by the swarm: a short
zero-fill, then an **8-byte-stride table of `(u32-BE offset, u32-BE 0x64)` records** (`00 00 38 48 / 00
00 00 64`, …) = the survey **Section-B index table at `0x4E3158`**. The next unit should own the short
audio tail as flat data, then **PIVOT to PARSE Section B** as a real fixed-record index table (NOT
flat-tiled), cross-referencing `ob64_anim_block_catalog.json` (first cutscene block `0x4F0FB0`).
