# Data Territory Survey — frontier `0x00301000`

Survey-only (NOT an ownership claim). Canonical machine-readable inventory:
`docs/data-index/rev0/data-territory-survey-00301000.json`. Past-data catalog:
`docs/data-index/rev0/_data-index-catalog.json`. Review handoff:
`docs/REVIEW_2026-06-23_data-territory-survey.md`.

## Scope

- **Remaining data territory**: `0x00301000..0x0063676C` = **3,364,716 B** = the 52 generated fallback
  chunks (48..99), emitted as `original_mips` `.word` and **not yet split into tracked data parts**.
  Hard natural end `0x0063676C` (configured codeRegion end); then a 24-B `raw_structural_gap`, then
  the LHA archive cluster (first `-lh5-` header byte-verified at `0x00636784`/`0x00636786`).
- **Past data (scope 2)**: `0x002B89B8..0x00301000` (chunks 43-47), 296,520 B owned, already
  byte-exact tracked. Indexing **adequate**; broader index directory has a documented v1-old/v2-new
  schema drift (see catalog).

## Hidden code: NONE — DATA-ONLY SAFE

Across the whole 3.36 MB: **0 `jr $ra`, 0 RAM-pointer words, 0 archive magic**, 1 coincidental
prologue (`0x594A9C`, immediate -28239, rejected), 1 zero-run ≥256 B (`0x429AC1`). Independently
re-proven by an adversary pass. The 110 "jal-into-range" / 26k "ROM-offset constant" signals are all
overlay-RAM references / ordinary MIPS encodings (the forbidden linear back-map), not code edges.

## Three natural sections (exact byte math reconciles to 3,364,716 B)

| Sec | Range | Bytes | Chunks | Family | Status |
|---|---|---:|---|---|---|
| A | `0x301000..0x4E3000` | 1,974,272 | 48..78 | high-entropy asset pool — **texture-vs-audio UNRESOLVED** | raw-but-classified |
| B | `0x4E3000..0x595000` | 729,088 | 78..89 | cutscene audio/sequence subsystem (table + payload + 63 anim blocks + directory) | parsed/undecoded/raw |
| C | `0x595000..0x63676C` | 661,356 | 89..99 | near-max-entropy packed/compressed resource pool | raw-but-classified |

**Section A** continues the chunk-43..47 texture family (chunk 47 `data_003002E8` flows into
`0x301000`), entropy ~7.0-7.36. BUT the parser pass found a U-shaped nibble histogram (signed-PCM/
ADPCM audio-codec-residual signature, not palette indices) — and Section B's offset table may index
into A as an audio sample bank. **Type is unresolved → raw-but-classified**; the ownership pass should
test whether B's `0x4E3158` offsets resolve into A.

**Section B** is the only section with parser-backed structure:
- `0x4E3140..0x4E6988` (14,408 B): index/offset table — header (total-length `0xDC6A`) + **1798 ×
  8-byte records `[u32-BE monotonic offset][u32-BE const 0x64]`** (byte-verified). **parsed**.
- `0x4E6988..0x4F0FB0` (42,536 B): medium-entropy ~5.0 payload. **undecoded**.
- `0x4F0FB0..0x594280` (668,368 B): **63 contiguous cutscene AUDIO-SEQUENCE blocks**. **parsed,
  GATE-PROVEN** by parent `scripts/ob64_anim_block_catalog.json` + `tools/anim_block_codec.py`
  (in-game proof: blanking tracks stopped cutscene sound; all 63 roundtrip_ok).
- `0x594280..0x595000` (3,456 B): directory/offset table (u32-BE ascending) preceding Section C.

**Section C** is a homogeneous ~7.95-entropy packed/compressed blob (custom encoding — **0 standard
magic**), no internal structure, preceded by the `0x594280` directory, running unbroken to the hard
end `0x63676C`.

## Key reconciliations / rejected leads

- **CRITICAL TRAP**: the parent graphics/sprite scanners `scripts/ob64_4a_audit.json` /
  `ob64_4f_audit.json` index a **decompressed-7MB-LZSS-stream** (gapOffset `0xf1ce0..0x6dae24`; source
  compressed region ROM `0x20248C2..0x26FF9F0`, past `0x636784`), **NOT raw ROM offsets**. They give
  ZERO real coverage of this range; importing their offsets as ROM addresses would mis-place ownership.
- `0x594A9C` parent "function" = false positive (data).
- DMA traces: 0 PI-DMA reads SOURCE this range (data is CPU-read in place; `romoff` source vs `dram` dest).
- `ob64_audio_region_analysis.js` (BGM/SEQ pool `0x925483+`) is past `0x636784`, distinct from the
  in-range cutscene sequences.

## Ownership assessment: NO (survey ≠ ownership)

All of `0x301000..0x63676C` is generated fallback (0 tracked parts). Recommended batches:
1. **Section A** (`0x301000..0x4E3000`, chunks 48..78) — clean mechanical data-territory batch
   (data-territory template); resolve the texture/audio type during ownership.
2. **Section B** (`0x4E3000..0x595000`, chunks 78..89) — **parser-backed/careful pass** (table_ part +
   63 named anim-block parts via `anim_block_codec.py` + raw payload/directory); NOT a raw bulk batch.
3. **Section C** (`0x595000..0x63676C`, chunks 89..99) — clean mechanical batch ending at the hard
   `0x63676C` boundary.

## Template adequacy

`docs/templates/data-territory-source-ownership-run-prompt.md` is **adequate** for A/C and supports
B's parser-backed path. Suggested addition: a caution that parent 4a/4f scanner offsets are
decompressed-stream offsets, not ROM offsets (a `{PARENT_OFFSET_SPACE_CAVEAT}` placeholder).

## Runtime-state / patch-workbench

No runtime states used; `RUNTIME_STATE_ONESHOT = none`; request log unchanged. No patch-workbench
(data territory = not patch space; static-only). Section B's parser-backed anim blocks are an
editing/mod target via the existing parent codec, but that is editor work, not patch space.
