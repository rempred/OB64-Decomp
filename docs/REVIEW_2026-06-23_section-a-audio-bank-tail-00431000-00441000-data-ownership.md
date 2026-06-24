# Review Handoff: Section A chunk-67 WaveTables tail closure — `0x00431000..0x00441000`

Date: 2026-06-24 (run); filename keeps the coordinator slug date `2026-06-23`.

Focused schema-closure run (1 chunk): closes the chunk-66 N64 audio bank's WaveTables sample payload and
owns the flat post-tail Section A audio. Reaches the planned frontier `0x00441000` — a **`run-complete`**.

## Natural unit & exact ROM range

- Natural unit: the Section A audio-bank **WaveTables payload tail** + the post-tail flat Section A audio.
- Owned: **chunk 67** = `0x00431000..0x00441000` (65,536 B). Frontier `0x00431000` → **`0x00441000`** (chunk 68).

## Code/data composition

**21 parts = 11 data + 10 zero_fill, 0 code.** Byte split: **data 65,324 B · zero_fill 212 B.**
data_00431000 = WaveTables tail; zero_fill_00431EF4 = bank terminator; the rest = flat post-tail audio.

## Machine-readable index

`docs/data-index/rev0/section-a-audio-bank-tail-00431000-00441000-data-inventory.json` — `waveTablesTail`,
`postTailRegion`, `audioBankTailFinding`, `hiddenCodeRisk`, `chunk67BytesStatus`, `bank66plus67Status`.
Validated: parses; byteSplit sum = contiguity = 65,536 (to `0x441000`); 21 subregions, 0 gaps. Dossier:
`docs/dossiers/section-a-audio-bank-tail-00431000-00441000-data-ownership.md`.

## WaveTables tail closure evidence (byte-verified)

The WaveTables sample payload's **last non-zero byte is `0x431EF0`** (`= 0x3F`, preceded by
`1f 1f 1f 1f 01 3f`), terminated by a 24-byte zero run `0x431EF1..0x431F09`; flat audio resumes at
`0x431F09` (`= 0x53`). So the chunk-66 bank's WaveTables span is **`0x429CD0..0x431EF1`** (≈ 33,313 B of
4-bit ADPCM samples). Independently reproduced by all 4 swarm passes. Word-aligned in the tiling as
`zero_fill_00431EF4` (`0x431EF4..0x431F08`, 20 B) — the 3 leading + 1 trailing unaligned terminator zeros
are absorbed into the adjacent data parts (all zero; correct conservative alignment).

## Post-tail characterization

`0x431F08..0x441000` = flat high-entropy raw VADPCM/4-bit-ADPCM sample data (U-shaped nibble histogram,
U-ratio 2.41; 2KB entropy 6.57–7.26, **no `<6.0` structured window**). **No new
`N64 PtrTablesV2`/`N64 WaveTables`/AIFC/CTL/TBL/`0xD3000000` header anywhere in chunk 67** (checked).
Conservatively raw audio sample payload. Continues into chunk 68 (entropy 7.336) → resume flat batches.

## Parent tooling inspected — none accepted (`anyAcceptedRomLead = false`)

`ob64_audio_region_analysis.js` (ROM 0x925483..) and `research/ob64_crack_gap3.js` (ROM 0x20248C2..,
defines the gap base for 4a/4f) = **comparison/rule-out only**. **TRAP hit + byte-rejected:** 4a gapOffset
`0x440172` (block_3332, SPRITE_CI8/CI4_TILE, claimed 37.6 % zeros) is a decompressed-7MB-stream
coordinate (→ ~ROM `0x2464A34`); ROM @`0x440172` is flat audio (entropy 7.179, 1.8 % zeros, no `64`
header). 4f: 0 in-range. `ob64_archive_catalog.json`: first LHA `0x636784` (none in range).
`ob64_anim_block_catalog.json`: blocks ≥ `0x4F0FB0` (none in range). No audio loader in parent
`editor/`/`tools/`/`wiki/`/`ModderResources/`.

## Hidden-MIPS adversarial result

**DATA-ONLY SAFE.** 0 jr$ra / 0 prologues / 0 epilogues / 0 lw $ra at all 4 byte alignments (65,533
words); 0 pointer-table runs (lone `sw $ra` at unaligned `0x431D5B` = noise). 5-pass swarm unanimous;
QA 0 problems.

## Audio-bank schema after chunk 67: `partial`

The WaveTables sample payload is now **byte-bounded** (`0x429CD0..0x431EF1`), closing the chunk-66 bank's
outgoing edge, and the PtrTablesV2 container is decoded — but the directory → sample-byte addressing and
several header/record fields remain unresolved (`field_0xNN`), so the chunk-66+67 audio-bank **unit** is
`partial`, not `yes`.

## Ownership status: chunk-67 bytes `yes`; bank-66+67 unit `partial`

All 65,536 chunk-67 bytes byte-exact owned (reviewer **yes**). Bank unit **partial** (payload bounded,
addressing unmapped). Per the run standard, chunk bytes `yes` + bank-unit `partial` is the intended
disposition.

## Caveats & unresolved fields

- Bank addressing unmapped: WaveTables header @0x429CE0, the two `0xD3000000` sentinels @0x429CC8,
  per-record `+0x10/+0x14/+0x1C/+0x20` fields, the 133-record directory → payload-offset linkage.
- Post-tail per-sample VADPCM params unknown; same-bank-segment-vs-new-bank unresolved.
- No editor/runtime loader reads these banks (static classification only).
- The 24 B byte-precise terminator is word-aligned as a 20 B `zero_fill` (absorbed zeros) — not a defect.

## Recommended next ownership unit + resume guidance

**Resume the flat 10-chunk default at chunk 68 (`0x441000`)** — expected chunks 68–77
(`0x441000..0x4E1000`) of flat Section A audio sample payload, stopping before the Section A/B boundary
~`0x4E3000`. Open mid-stream (no header at the seam); fall back if a new `N64 PtrTablesV2`/`N64
WaveTables` header reappears.

## When to resume 10-chunk batches

**Now** — at chunk 68. The audio-bank schema boundary is closed and the post-tail signal is flat (no
`<6.0` window, no header). `resume10ChunkAt68 = true`.

## Runtime-state & patch-workbench

No runtime states (`RUNTIME_STATE_ONESHOT = none`; request log unchanged). No patch-workbench
(data/asset territory, static-only).

## Verification

```text
JSON parse docs/data-index/rev0/section-a-audio-bank-tail-00431000-00441000-data-inventory.json   parses; byteSplit=65,536, contiguous to 0x441000, 21 subregions
source-owner coverage 0x431000..0x441000                                                          21 parts, byte-exact, 0 gaps
node tools/check_boundaries.js / check_splits.js                                                  BOUNDARY CHECK PASS; 0 fragments (0 code)
node tools/check_manifest.js                                                                      ALL CHECKS PASS (68 chunks; chunk 67 = 21 parts)
node tools/assemble_original_mips.js                                                              Exact code-region match: PASS (SHA 40D4E787..B409 unchanged)
node tools/verify_setup.js                                                                        PASS (68 composites / 5,871 files / 32 fallback)
node tools/audit_code_region.js                                                                   OK (executable extent 0x1000..0x2B89B4 unchanged)
git diff --check                                                                                  clean
```

## Commits

- `d2b6e7b` — `Source-own Rev0 Section A chunk 67 WaveTables tail closure (0x431000..0x441000)`
  (21 parts + manifest + index + dossier + current-state docs).
- This review handoff (final commit).

## Review doc path

`docs/REVIEW_2026-06-23_section-a-audio-bank-tail-00431000-00441000-data-ownership.md`
