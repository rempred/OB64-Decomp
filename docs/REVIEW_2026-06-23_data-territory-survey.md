# Review Handoff: One-Shot Data Territory Survey (frontier `0x00301000`)

Date: 2026-06-23

This was a **survey pass**, not an ownership batch. No source ownership was claimed and no chunk-48
batch was started. Deliverables: a canonical machine-readable survey inventory + a past-data index
catalog + a dossier + this review.

## Opening fix (commit `b9ba728`)

`docs/REVIEW_2026-06-23_chunks45-47-source-ownership.md` had a placeholder final review-handoff
commit line; replaced with the real hash **`e42eae7`** (`Add chunks 45-47 review handoff`). Narrow
doc-only fix. The coordinator's template commit `f3beb3b` was left untouched.

## Survey scope (exact ranges)

- **Remaining data territory** (scope 1): `0x00301000..0x0063676C` = **3,364,716 B** = the **52
  generated fallback chunks (48..99)**. Emitted as `original_mips` `.word` fallback; **not yet split
  into tracked data parts**. Hard natural end `0x0063676C` = configured codeRegion end; then a 24-B
  `raw_structural_gap` (full-ROM-manifest-owned), then the LHA archive cluster (first `-lh5-` byte
  at `0x00636784`/`0x00636786`, byte-verified). Derived from `asm/original/rev0/manifest.json`
  (`codeRegion.endExclusive 0x0063676C`) + `docs/FULL_ROM_SOURCE_MANIFEST.md`, not assumed.
- **Past data** (scope 2): `0x002B89B8..0x00301000` (chunks 43-47), already byte-exact tracked.

## Swarm plan (true subagents used)

5 read-only Workflow passes (no source/manifest/owned-file edits), lead consolidated:
parent-tooling comparator · parser/schema+boundary analyst · hidden-MIPS adversary · past-data
normalizer · ownership-standard reviewer. Helper: `build/survey_scan.js` (windowed
jr$ra/prologue/pointer/zero/ascii/gbi/entropy + zero-runs + ASCII strings + archive magic over the
baserom). All headline claims byte-verified by the lead (anim catalog, the `0x4E3158` table, `-lh5-`).

## Remaining data territory map (3 natural sections; byte math reconciles to 3,364,716 B)

| Sec | Range | Bytes | Chunks | Family | Survey status |
|---|---|---:|---|---|---|
| A | `0x301000..0x4E3000` | 1,974,272 | 48..78 | high-entropy asset pool — **texture vs audio UNRESOLVED** | raw-but-classified |
| B | `0x4E3000..0x595000` | 729,088 | 78..89 | cutscene audio/sequence subsystem | parsed/undecoded/raw |
| C | `0x595000..0x63676C` | 661,356 | 89..99 | near-max-entropy packed/compressed pool | raw-but-classified |

Status bytes: **parsed 682,776** (B index table 14,408 + B anim blocks 668,368) · **raw-but-classified
2,639,404** (A 1,974,272 + B lead-in 320 + B directory 3,456 + C 661,356) · **undecoded 42,536** (B
payload) · **gap 0**. (Survey statuses = classification confidence, NOT ownership — all 3.36 MB stay
generated fallback.)

- **Section A**: continues the chunk-43..47 texture family (chunk 47 `data_003002E8` → `0x301000`),
  entropy ~7.0-7.36. Competing type: parser pass found a U-shaped nibble histogram = signed-PCM/ADPCM
  audio-codec-residual signature (not palette indices); Section B's offset table may index into A as
  an audio sample bank. **Unresolved → raw-but-classified**; ownership pass should test the table→A link.
- **Section B** (only parser-backed section):
  - `0x4E3140..0x4E6988` index/offset table: header (total-length `0xDC6A`) + **1798 × 8-byte records
    `[u32-BE monotonic offset][u32-BE const 0x64]`**, byte-verified → **parsed**.
  - `0x4E6988..0x4F0FB0` medium-entropy ~5.0 payload → **undecoded**.
  - `0x4F0FB0..0x594280` **63 cutscene AUDIO-SEQUENCE blocks** → **parsed, GATE-PROVEN** (parent
    `ob64_anim_block_catalog.json` + `anim_block_codec.py`; in-game sound-blanking proof; all 63
    roundtrip_ok).
  - `0x594280..0x595000` directory/offset table (u32-BE ascending) → raw-but-classified.
- **Section C**: homogeneous ~7.95-entropy packed/compressed blob, **0 standard magic**, no internal
  structure, preceded by the `0x594280` directory, unbroken to `0x63676C`.

## Bounded past-data one-shot (scope 2) results

296,520 B owned (chunks 43-47), 84 parts, split 932 parsed zero_fill + 295,588 raw-but-classified +
**0 undecoded**. The chunk-43..47 indexes (v2-new schema) are schema-consistent and byte-complete —
indexing **ADEQUATE**, no normalization required to proceed. Broader landscape (additive catalog
`docs/data-index/rev0/_data-index-catalog.json`, no existing index modified): **30 systematic
inventories** (17 v1-old chunks 13-33 + 13 v2-new chunks 34-47; ~517 KB / 595 parts) + **23 focused
structure indexes** (parsed tables/string pools, chunks 5-30). Documented **v1-old vs v2-new schema
drift** as an optional non-blocking normalization opportunity.

## Parent tooling compared (named artifacts)

ACCEPTED: `scripts/ob64_anim_block_catalog.json` (63 anim/audio blocks `0x4F0FB0..0x594280`) +
`tools/anim_block_codec.py` (gate-proven decoder); `scripts/ob64_archive_catalog.json` (first LHA
`0x636784`, 0 entries below → confirms hard end); `scripts/ob64_functions.json` (0 valid functions in
range); the `0x594280` directory table (byte-derived). REJECTED: **`ob64_4a_audit.json` /
`ob64_4f_audit.json`** (their gapOffsets are decompressed-7MB-LZSS-stream offsets `0xf1ce0..0x6dae24`;
source compressed region ROM `0x20248C2..0x26FF9F0`, past `0x636784` — **NOT ROM offsets; zero
in-range coverage; importing as ROM addresses would mis-place ownership**); `ob64_functions.json`
`0x594A9C` (valid:false noise); `ob64_audio_region_analysis.js` BGM pool (`0x925483+`, past the range);
DMA traces (0 reads SOURCE the range — `romoff` source vs `dram` dest); fallback `.s` decode comments
(invalid linear RAM=ROM back-map on data).

## Hidden-MIPS adversarial findings

**DATA-ONLY SAFE — no hidden-code risk.** 0 `jr $ra`, 0 pointer-table runs, 0 magic; 1 coincidental
prologue (`0x594A9C`, immediate -28239 not /8, no body, rejected). 110 "jal-into-range" resolve to
overlay RAM `0x80300000+` (above the executable extent — the forbidden linear back-map); 26k
"ROM-offset constants" are ordinary in-code MIPS encodings. No chunk-fallback/mixed pass warranted.

## Machine-readable inventory

`docs/data-index/rev0/data-territory-survey-00301000.json` (canonical; full schema:
surveyRanges/pastDataScope/remainingDataScope/chunkCoverage/naturalGroups[]/knownContinuations/
parentToolingComparisons/hiddenCodeRisk/statusSummary/ownershipAssessment/recommendedOwnershipBatches/
recommendedTemplateAdjustments/unresolvedUnknowns/rejectedLeads). Validated: parses; statusSummary sum
= naturalGroups sum = remainingDataScope.bytes = 3,364,716. Catalog:
`docs/data-index/rev0/_data-index-catalog.json` (parses; 30 inventories + 23 focused).

## Ownership-standard assessment

**Overall: `no`.** All of `0x301000..0x63676C` is generated fallback with **zero tracked named data
parts** (independently re-proven: last tracked owner is `zero_fill_003002D8.s` ending `0x301000`). A
survey establishes non-code + classification, NOT ownership (which needs tracked `.s` parts +
per-part provenance + index + dossier + recorded adversarial proof + exact chunk coverage). Per
section: **A `no`** (owned-candidate, clean mechanical batch), **B `no`** (owned-candidate, needs a
**parser-backed** pass), **C `no`** (owned-candidate, clean mechanical batch). Past data (chunks 43-47):
**`yes`** (already owned to standard).

## Recommended next natural-section data ownership batches

1. **Section A** `0x301000..0x4E3000` (chunks 48..78) — clean mechanical data-territory batch
   (continuation of chunks 44-47); resolve the texture-vs-audio type during ownership.
2. **Section B** `0x4E3000..0x595000` (chunks 78..89) — **parser-backed/careful pass**: a `table_`
   part for the `0x4E3158` index table, 63 named parser-backed parts for the anim/audio blocks (port
   `anim_block_codec.py`), and raw-but-classified payload/directory. Sub-batch 78-82 then 83-89.
3. **Section C** `0x595000..0x63676C` (chunks 89..99) — clean mechanical batch ending at the hard
   `0x63676C` boundary; own as opaque packed-resource parts citing the `0x594280` directory.

Use `docs/templates/data-territory-source-ownership-run-prompt.md` for all three (natural-section units).

## Template adequacy

`data-territory-source-ownership-run-prompt.md` is **adequate** for A/C and supports B's parser-backed
path (it already has a parser/dumper-evidence path + a "unknown schema needing focused parser work"
fallback clause). **Suggested addition**: a caution/placeholder (`{PARENT_OFFSET_SPACE_CAVEAT}`) that
parent 4a/4f scanner offsets are decompressed-7MB-stream offsets, not ROM offsets — to prevent a
future linear-back-map ownership error.

## Runtime-state / patch-workbench

No runtime states loaded or used; `RUNTIME_STATE_ONESHOT = none`; `docs/runtime-state-requests.md`
unchanged (no IDs opened/served/superseded). No patch-workbench artifact: this is data/asset
territory, not patch space (static-only). Section B's parser-backed anim/audio blocks are an
editor/mod target via the existing parent codec — editor work, not patch space.

## Verification

```text
node -e (JSON.parse) docs/data-index/rev0/data-territory-survey-00301000.json   parses; byte math MATCH (3,364,716)
node -e (JSON.parse) docs/data-index/rev0/_data-index-catalog.json              parses (30 inventories + 23 focused)
byte-verify: anim_block_catalog 63@0x4F0FB0 ; table 0x4E3158 [mono][0x64] hdr 0xDC6A ; -lh5-@0x636786   CONFIRMED
git diff --check                                                                 clean
git status --short --branch                                                      on main
```

**Rebuild verification (check_manifest / assemble / verify_setup / audit) was NOT run** and is not
needed: this pass changed **no** source-owner, manifest, or rebuild-relevant files. It only fixed one
review-doc line and ADDED survey/catalog/dossier/review docs + JSON (no tracked `.s` parts, no
manifest edit, no code-region change). The byte-exact rebuild and code-region SHA are unaffected.

## Caveats and unresolved unknowns

- Survey ≠ ownership: A/B/C remain generated fallback; statuses are classification confidence only.
- Section A exact type (graphics/texture vs audio-codec-residual) is unresolved — competing evidence.
- Section B payload `0x4E6988..0x4F0FB0` format unknown; index-table `0x64` field meaning guessed.
- Section C compression/encoding scheme unknown (no magic; custom packed).
- Exact A/B (`0x4E3000` vs `~0x4E2000`) and B/C (`0x594000` vs `0x595000`) boundary bytes to be pinned
  during ownership.
- Do NOT import parent 4a/4f offsets as ROM addresses; do NOT apply a linear RAM=ROM map in this range.

## Files changed

- `b9ba728`: `docs/REVIEW_2026-06-23_chunks45-47-source-ownership.md` (opening fix).
- This survey commit: `docs/data-index/rev0/data-territory-survey-00301000.json` (canonical inventory),
  `docs/data-index/rev0/_data-index-catalog.json` (past-data catalog),
  `docs/dossiers/data-territory-survey-00301000.md` (dossier), this review.

## Recommended next run

Start the natural-section data-territory ownership loop with **Section A** (`0x301000..0x4E3000`,
chunks 48..78) using `data-territory-source-ownership-run-prompt.md`. Then **Section B** as a
parser-backed pass, then **Section C**. Frontier stays `0x00301000` until an ownership batch promotes.
