# Review Handoff: Section A/B boundary + Section B start — `0x004E1000..0x004F1000` (chunk 78)

Date: 2026-06-24.

Focused natural-boundary/schema run (1 chunk): chunk 78 crosses the **Section A/B boundary**. Reaches the
planned frontier `0x004F1000` — a **`run-complete`**. One-chunk boundary unit was the right call (no
smaller fallback needed).

## Exact completed range / chunk

- **Chunk 78** = `0x004E1000..0x004F1000` (65,536 B). Frontier `0x004E1000` → **`0x004F1000`** (chunk 79).

## Code/data composition

**4 structural data parts, 0 zero_fill, 0 code.** Byte split: raw-but-classified 23,000 B · undecoded
42,536 B. Parts: `data_004E1000` (audio tail, 8,512), `data_004E3140` (index table, 14,408),
`data_004E6988` (payload, 42,536), `data_004F0FB0` (block head, 80).

## Ownership status: chunk-78 bytes `yes`; Section B unit `partial`

All 65,536 bytes byte-exact owned (reviewer **yes**). Section B unit `partial` — the table shape is
decoded but the payload + `0x64`/header semantics are unresolved, and Section B spans far past this chunk.

## Exact Section A/B boundary decision

**`0x004E3140`** (byte-confirmed): the flat Section A 4-bit ADPCM audio tail ends and the Section B
index-table header begins here (header word0 `0x706` = 1798 record count; entropy ~6.8→2.5). Section A
(`0x301000..0x4E3140`) is now fully owned + AUDIO; Section B begins at `0x4E3140`.

## Section B table / schema findings

Header (6 u32-BE) `[recordCount 0x706 (1798), 0x2E4, 0x102, 0, 0, 0xDC6A (=56426 payloadLen)]`; **1798
records** @`0x4E3158`, stride 8 = `[u32-BE offset, u32-BE 0x64]`; offsets monotonic `0x3848..0xDC58`,
base `0x4E3140` (rec0 → `0x4E6988` = payload start); table ends exactly `0x4E6988`. **`0x64` = constant
flag/type, NOT a length** (record spans 17–66 B). Indexed records are **`0x80`-terminated variable-length
event streams** (1797/1798 end in `0x80`). Payload `0x4E6988..0x4F0FB0` undecoded; indexed portion ends
~`0x4F0DAA` then a u16-BE LUT to `0x4F0FB0`. First block @`0x4F0FB0` = tag `0x215`, size `0x30C0`
(ends `0x4F4070`).

## Hidden-MIPS result

**DATA-ONLY SAFE.** 0 jr$ra / 0 prologues / 0 epilogues / 0 lw $ra / 0 jr-any at all 4 byte alignments,
every region; 0 pointer-table runs. Table offsets are payload-relative (base `0x4E3140`), not code
pointers. 5-pass swarm unanimous; QA 0 blocking problems.

## Parent tooling — accepted/rejected leads

**ACCEPTED (byte-verified ROM lead, `anyAcceptedRomLead = true`):** `scripts/ob64_anim_block_catalog.json`
block 0 @`0x4F0FB0` — ROM header matches (tag `0x215`, nch 24, stride `0x1A0`, size `0x30C0`; next block
@`0x4F4070` also `0x215`); 63 contiguous blocks `0x4F0FB0..0x594280`; `tools/anim_block_codec.py`
Gate-1/Gate-2 proven (cutscene MUSIC/SFX). **Rejected:** 4a gapOffset `0x4EBBD8` (decompressed-7MB-stream
coord, base `0x20248C2`; ROM there is Section B payload). 4f: 0 in-range. archive first LHA `0x636784`
(chunk 78 precedes it). **No parent tool decodes the Section B index table or payload.**

## Machine-readable index & review handoff

- Index: `docs/data-index/rev0/section-a-to-b-boundary-004E1000-004F1000-data-inventory.json` —
  `decodedContainerSchema` (sectionBIndexTable/sectionBPayload/firstCutsceneBlock), `sectionABBoundary`,
  `payloadExtentInterpretationGap`, `hiddenCodeRisk`. Validated: parses; byteSplit sum = contiguity =
  65,536 (to `0x4F1000`); 4 subregions, 0 gaps. Dossier:
  `docs/dossiers/section-a-to-b-boundary-004E1000-004F1000-data-ownership.md`.

## Verification results

```text
JSON parse docs/data-index/rev0/section-a-to-b-boundary-004E1000-004F1000-data-inventory.json   parses; byteSplit=65,536, contiguous to 0x4F1000, 4 subregions
source-owner coverage 0x4E1000..0x4F1000                                                        4 parts, byte-exact, 0 gaps
node tools/check_boundaries.js / check_splits.js                                                BOUNDARY CHECK PASS; 0 fragments (0 code)
node tools/check_manifest.js                                                                    ALL CHECKS PASS (79 chunks; chunk 78 = 4 parts)
node tools/assemble_original_mips.js                                                            Exact code-region match: PASS (SHA 40D4E787..B409 unchanged)
node tools/verify_setup.js                                                                      PASS (79 composites / 6,069 files / 21 fallback)
node tools/audit_code_region.js                                                                 OK (executable extent 0x1000..0x2B89B4 unchanged)
git diff --check                                                                                clean
```

## One-chunk fallback enough or smaller needed?

**One-chunk boundary unit was correct — no smaller fallback needed.** The A/B boundary, table shape, and
first-block tag all pinned cleanly in one chunk. The next unit is the parser-backed anim-block family
(natural-block run), NOT a flat batch.

## Caveats & unresolved fields

- Section B payload undecoded (`0x80`-terminated event streams); `0x64` field, header `0x2E4`/`0x102`,
  and the trailing u16-BE LUT semantics unknown.
- **Header payloadLen `0xDC6A` implies a logical payload extent to `0x4F45F2` (past the first anim block
  `0x4F0FB0`)** — unresolved interpretation gap (does the length include the anim-block region?), settle
  in chunk 79.
- Only the first block HEAD (80 B) is owned in chunk 78; the body + 62 more blocks are chunk 79+.

## Runtime-state & patch-workbench

No runtime states (`RUNTIME_STATE_ONESHOT = none`; request log unchanged). No patch-workbench
(data/asset territory, static-only).

## Next recommended unit / frontier

**Chunk 79 (`0x004F1000`) — parser-backed anim-block family.** Finish owning the first block body
(`0x4F0FB0..0x4F4070`), then the contiguous **63-block cutscene audio-sequence run** (`0x4F0FB0..0x594280`)
via `tools/anim_block_codec.py`, preserving natural block boundaries (NOT flat tiling). Settle the
payloadLen-vs-anim-block interpretation gap.

## Commits

- `5029837` — `Source-own Rev0 Section A/B boundary + Section B index start chunk 78 (0x4E1000..0x4F1000)`
  (4 structural parts + manifest + index + dossier + current-state docs).
- This review handoff (final commit).

## Review doc path

`docs/REVIEW_2026-06-24_section-a-to-b-boundary-004E1000-004F1000-data-ownership.md`
