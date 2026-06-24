# Review Handoff: Section A chunk-66 audio sound-bank — `0x00421000..0x00431000`

Date: 2026-06-24 (run); filename keeps the coordinator slug date `2026-06-23`.

Focused **decode** + ownership run (1 chunk) on the N64 audio sound-bank that triggered the slice-3
fallback. This run reaches the planned frontier `0x00431000` — a **`run-complete`**, not a fallback.

## Natural unit & exact ownership range

- Natural unit: a Section A **N64 custom-framed VADPCM audio sound-bank** (PtrTablesV2 codebook +
  WaveTables sample bank).
- Owned: **chunk 66** = `0x00421000..0x00431000` (65,536 B).
- Frontier: `0x00421000` → **`0x00431000`** (chunk 67). Read-only lookahead into chunk 67 only.

## Code/data composition

**8 structural parts = 5 data + 3 zero_fill, 0 code.** Byte split: **data 64,864 B · zero_fill 672 B.**
Boundaries follow the decoded structure (a structural splits file, NOT zero-run tiling — that would
shatter the 133-record codebook at intra-record coefficient padding).

## Machine-readable index

`docs/data-index/rev0/section-a-audio-bank-00421000-00431000-data-inventory.json` — full schema:
`decodedContainerSchema`, `recordTable`, `offsetTable`, `waveTables`, `padding`, `audioBankFinding`,
`hiddenCodeRisk`, `chunk66BytesStatus`, `wholeBankSchemaStatus`. Validated: parses; byteSplit sum =
contiguity = 65,536 (to `0x431000`); 8 subregions, 0 gaps. Dossier:
`docs/dossiers/section-a-audio-bank-00421000-00431000-data-ownership.md`.

## Audio-bank schema decoded vs unresolved

**Decoded (byte-verified by the swarm):** both ASCII magics (`N64 PtrTablesV2\0` @0x423FF0,
`N64 WaveTables \0` @0x429CD0); recordCount `0x85`=133; 133 contiguous records (strides 0xA0×106 /
0xD0×26 / 0xB0×1 = `0x5810` exactly); **codec = standard order-2 N64 libultra VADPCM** (+0x28=2 ORDER,
+0x2C=4, smooth int16-BE coefficient books); the 26 `0xD0` records ↔ nonzero +0x1C (set-equality);
133-entry u32-BE offset table (base 0x423FE0, monotonic 0x30..0x5790, deltas = strides, fully covers the
record region); global header @0x424010 with magic-relative size pointers; WaveTables payload = 4-bit
ADPCM residual (U-shaped nibbles, entropy 7.26); three zero pads classified.

**Unresolved (field_0xNN; downgrades whole-bank schema, not byte ownership):** per-record sample
addressing fields (+0x10/+0x14/+0x20), global header +0x10/+0x14/+0x1C/+0x20, the two `0xD3000000`
sentinel words, the inter-pad `EE`/`0A` field, exact VADPCM frame parameters, and the WaveTables bank
end (continues into chunk 67).

## Parent tooling inspected — comparison/rule-out only; PtrTablesV2 is generic

No external parent artifact maps into `0x421000..0x431000`. `ob64_audio_region_analysis.js` (ROM
0x925483.. BGM envelope) and `research/ob64_crack_gap3.js` (ROM 0x20248C2.. gap) are comparison/rule-out
only (different regions; only 9/16-byte VADPCM strides; no 0xA0/0xD0 codebook; no PtrTables/WaveTables
reference). `ob64_archive_catalog.json` confirms chunk 66 precedes the first LHA (`0x636784`) = raw.
`ob64_anim_block_catalog.json` covers cutscene blocks ≥ `0x4F0FB0` only. **PtrTablesV2 is a GENERIC
container** — byte-identical magic at chunk 43 `0x2B8BA0` but graphics/F3DEX2 content (count `0x7c`);
same format, different domain. No parent loader reads these magics (research-classified only). 4a/4f
gapOffsets are decompressed-stream offsets, not ROM (rejected).

## Hidden-MIPS adversarial result

**DATA-ONLY SAFE.** 0 jr$ra / 0 prologues / 0 epilogues / 0 lw $ra at all 4 byte alignments; 0
pointer-table runs. The coefficient region (prime "looks like MIPS" suspect) scanned in isolation: int16
values centered near zero = ADPCM book, not addresses. Offset table has no KSEG prefix = base-relative,
not a jump table. 5-pass swarm unanimous; QA 0 blocking problems.

## Ownership status: chunk-66 bytes `yes`; whole-bank schema `partial`

All 65,536 bytes byte-exact owned as 8 structural parts (independent reviewer: chunk66BytesStatus
**yes**). Whole-bank schema **partial**: the WaveTables payload continues into chunk 67 (ends ~`0x431EF4`)
and the incoming edge is the previous bank's tail; some fields unresolved. Per the run standard, chunk
bytes `yes` + schema `partial` is the intended disposition.

## Caveats & unresolved fields

- Whole-bank schema partial (payload spans into chunk 67; previous bank's header is before `0x421000`).
- Record/WaveTables field semantics partly unresolved (field_0xNN); order=2 + VADPCM class ARE resolved.
- PtrTablesV2 magic is generic (graphics instance in chunk 43); audio meaning is content-derived.
- No editor/runtime loader reads these magics — static research classification only.
- Coefficients begin at record+0x30 (record-0 header is 0x30 B); the split boundary at `0x423FF0`
  (magic) correctly contains the whole record table — non-blocking prose nuance only.

## Recommended next ownership unit / resume guidance

1. **Quick verify** the WaveTables payload closes in chunk 67 at `zero_fill_00431EF4` (tiling already
   exists) and no further sub-bank header precedes it.
2. **Resume flat 10-chunk batches at chunk 68 (`0x441000`)** — the payload ends only ~`0xEF4` into chunk
   67, so the bank does not run deep.

## When to resume 10-chunk batches

At chunk 68 (`0x441000`), once chunk 67's payload tail is confirmed terminated. No deep focused
continuation is needed.

## Runtime-state & patch-workbench

No runtime states (`RUNTIME_STATE_ONESHOT = none`; request log unchanged). No patch-workbench
(data/asset territory, static-only; a PI-DMA audio loader presumably streams this bank at runtime —
`needs-runtime`, not proven).

## Verification

```text
JSON parse docs/data-index/rev0/section-a-audio-bank-00421000-00431000-data-inventory.json   parses; byteSplit=65,536, contiguous to 0x431000, 8 subregions
source-owner coverage 0x421000..0x431000                                                      8 parts, byte-exact, 0 gaps
node tools/check_boundaries.js / check_splits.js                                              BOUNDARY CHECK PASS; 0 fragments (0 code)
node tools/check_manifest.js                                                                  ALL CHECKS PASS (67 chunks; chunk 66 = 8 parts)
node tools/assemble_original_mips.js                                                          Exact code-region match: PASS (SHA 40D4E787..B409 unchanged)
node tools/verify_setup.js                                                                    PASS (67 composites / 5,850 files / 33 fallback)
node tools/audit_code_region.js                                                               OK (executable extent 0x1000..0x2B89B4 unchanged)
git diff --check                                                                              clean
```

## Commits

- `91bb208` — `Source-own Rev0 Section A chunk 66 N64 audio sound-bank (0x421000..0x431000)`
  (8 structural parts + manifest + index + dossier + current-state docs).
- This review handoff (final commit).

## Review doc path

`docs/REVIEW_2026-06-23_section-a-audio-bank-00421000-00431000-data-ownership.md`
