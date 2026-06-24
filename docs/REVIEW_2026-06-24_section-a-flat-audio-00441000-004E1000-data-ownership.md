# Review Handoff: Section A flat audio — `0x00441000..0x004E1000` (chunks 68-77)

Date: 2026-06-24.

Standard 10-chunk data-territory batch: the flat Section A audio sample payload after the chunk-66/67
audio bank. Reaches the planned frontier `0x004E1000` — a **`run-complete`**. The 10-chunk batch
**stayed clean** (no fallback).

## Exact completed range / chunks

- **Owned: chunks 68, 69, 70, 71, 72, 73, 74, 75, 76, 77** = `0x00441000..0x004E1000` (655,360 B).
- Frontier `0x00441000` → **`0x004E1000`** (chunk 78). Remains before the Section A/B boundary
  ~`0x4E3158`.

## Code/data composition

**194 parts = 102 data + 92 zero_fill, 0 code.** Byte split: **data 653,276 B · zero_fill 2,084 B.**
Whole-range entropy 7.309 (flat). Per-chunk parts: 68=33, 69=23, 70=19, 71=23, 72=21, 73=33, 74=13,
75=7, 76=7, 77=15.

## Ownership status: `yes`

All 655,360 bytes byte-exact owned as 194 conservative `data_`/`zero_fill_` parts (independent reviewer
**yes**). Flat raw 4-bit ADPCM/VADPCM Section A audio sample payload; byte-exact, not semantic per-sample
decode (the owning codebook is the chunk-66 bank, out of range).

## Hidden-MIPS result

**DATA-ONLY SAFE.** 0 jr$ra / 0 prologues / 0 epilogues / 0 lw $ra / 0 pointer-runs at all 4 byte
alignments. Disasm is the structural inverse of code: 11–26 illegal encodings per 64 words, 0 NOPs,
branch density 14–36 % (real MIPS ~6 %), 0 `jr` per window. 5-pass swarm unanimous; QA 0 blocking
problems.

## Low-entropy windows — quiet audio, not structure (no fallback)

4 of 320 2KB-windows dip `<6.0` (`0x46A800`/`0x482800`/`0x4DF000`/`0x4DF800`), scattered. Each has an
extreme U-shaped nibble histogram (U-ratio 9.8–27) identical in kind to the high-entropy windows,
differing only in amplitude (quiet/low-amplitude ADPCM); no zero blocks, no record marker, no header, no
stride. The `<6.0 → fall back` rule was considered and correctly **not** triggered (swarm:
`lowEntropyWindowsAreStructure = false`).

## Parent tooling — accepted/rejected leads (`anyAcceptedRomLead = false`)

`ob64_audio_region_analysis.js` (ROM 0x925483..) and `research/ob64_crack_gap3.js` (stream coords) =
comparison/rule-out only. **TRAP byte-rejected:** the single in-range 4a gapOffset `0x44DB22` is a
decompressed-7MB-stream coord (base `0x20248C2`) — ROM there is ADPCM noise. 4f: 0 in-range.
`ob64_archive_catalog.json` first LHA `0x636784` (none in range); `ob64_anim_block_catalog.json` blocks
`≥ 0x4F0FB0` (none in range). No audio loader in parent `editor/`/`tools/`/`wiki/`/`ModderResources/`.

## Machine-readable index

`docs/data-index/rev0/section-a-flat-audio-00441000-004E1000-data-inventory.json` — `lowEntropyWindows`,
`sectionABBoundaryNote`, `incomingContinuation`, `outgoingContinuation`, `hiddenCodeRisk`. Validated:
parses; byteSplit sum = contiguity = 655,360 (to `0x4E1000`); 194 subregions, 0 gaps. Dossier:
`docs/dossiers/section-a-flat-audio-00441000-004E1000-data-ownership.md`.

## 10-chunk batch result

**Stayed clean — no fallback.** The 4 quiet-audio windows were investigated and confirmed non-structural.
The 10-chunk default is validated for flat Section A audio.

## Caveats & unresolved fields

- Per-sample VADPCM params / codebook out-of-range (chunk-66 bank); true per-sample edges unknown
  (conservative zero-fill splits). Same-bank-vs-new-bank unresolved. No editor/runtime loader.

## Recommended next unit / frontier — short transitional, then PARSE Section B

**Chunk 78 (`0x004E1000`) is NOT a flat 10-chunk batch.** Only ~`0x2000` of flat Section A audio remains
(`0x4E1000..~0x4E3158`); then the **Section A/B boundary**, byte-confirmed by the swarm: a short
zero-fill, then an **8-byte-stride table of `(u32-BE offset, u32-BE 0x64)` records** (`00 00 38 48 / 00
00 00 64`, …) = the survey **Section-B index table at `0x4E3158`**. Next unit: own the short audio tail
as flat data, then **PIVOT to PARSE Section B** as a real fixed-record index table (NOT flat-tiled),
cross-referencing `ob64_anim_block_catalog.json` (first cutscene block `0x4F0FB0`, the 63 gate-proven
audio-sequence blocks `0x4F0FB0..0x594280`).

## Runtime-state & patch-workbench

No runtime states (`RUNTIME_STATE_ONESHOT = none`; request log unchanged). No patch-workbench
(data/asset territory, static-only).

## Verification results

```text
JSON parse docs/data-index/rev0/section-a-flat-audio-00441000-004E1000-data-inventory.json   parses; byteSplit=655,360, contiguous to 0x4E1000, 194 subregions
source-owner coverage 0x441000..0x4E1000                                                     194 parts, byte-exact, 0 gaps
node tools/check_boundaries.js / check_splits.js (x10)                                        BOUNDARY CHECK PASS; 0 fragments (0 code)
node tools/check_manifest.js                                                                  ALL CHECKS PASS (78 chunks; 68=33..77=15)
node tools/assemble_original_mips.js                                                          Exact code-region match: PASS (SHA 40D4E787..B409 unchanged)
node tools/verify_setup.js                                                                    PASS (78 composites / 6,065 files / 22 fallback)
node tools/audit_code_region.js                                                               OK (executable extent 0x1000..0x2B89B4 unchanged)
git diff --check                                                                              clean
```

## Commits

- `8ffbe49` — `Source-own Rev0 Section A flat audio chunks 68-77 (0x441000..0x4E1000)`
  (194 parts + manifest + index + dossier + current-state docs).
- This review handoff (final commit).

## Review doc path

`docs/REVIEW_2026-06-24_section-a-flat-audio-00441000-004E1000-data-ownership.md`
