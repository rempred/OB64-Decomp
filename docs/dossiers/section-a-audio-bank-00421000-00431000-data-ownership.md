# Section A audio sound-bank — `0x00421000..0x00431000` (chunk 66)

Focused decode + ownership of the chunk-66 N64 audio sound-bank (the structure that triggered the
slice-3 fallback). Machine-readable inventory:
`docs/data-index/rev0/section-a-audio-bank-00421000-00431000-data-inventory.json`.

Classification: **DATA TERRITORY — N64 custom-framed VADPCM audio sound-bank.** Resolves the Section A
texture-vs-audio question in favor of **AUDIO**.

## Composition

**8 structural parts = 5 data + 3 zero_fill (0 code)** over `0x421000..0x431000` (65,536 B). Byte split:
**raw-but-classified data 64,864 B · parsed zero_fill 672 B.** Boundaries follow the decoded structure
(not zero-run tiling, which would shatter the codebook table).

| part | range | role |
|---|---|---|
| `data_00421000` | `0x421000..0x423FD4` | incoming raw VADPCM sample tail of the PREVIOUS bank (entropy 6.96) |
| `zero_fill_00423FD4` | `0x423FD4..0x423FF0` | 28 B pre-header pad |
| `data_00423FF0` | `0x423FF0..0x429820` | `N64 PtrTablesV2` magic + 133-record VADPCM codebook table |
| `data_00429820` | `0x429820..0x429A34` | 133-entry u32-BE offset table (directory) |
| `zero_fill_00429A34` | `0x429A34..0x429AB4` | 128 B inter-section pad |
| `data_00429AB4` | `0x429AB4..0x429AC4` | 16 B inter-pad field (`EE`/`0A`; field_0x00, unresolved) |
| `zero_fill_00429AC4` | `0x429AC4..0x429CC8` | 516 B silence pad (survey 519 B run) |
| `data_00429CC8` | `0x429CC8..0x431000` | `N64 WaveTables` magic + raw VADPCM sample payload (→ chunk 67) |

- Incoming: chunk 65 `data_00420438` → `data_00421000` (seamless, no zero gap at `0x421000`).
- Outgoing: `data_00429CC8` (WaveTables payload) runs to `0x431000` with no terminating zero-fill →
  continues into chunk 67 (terminates ~`0x431EF4` per the chunk-67 tiling).

## Decoded schema (canonical detail in the JSON)

**`N64 PtrTablesV2`** (generic pointer-table container — the *same* magic also sits at `0x2B8BA0` in
chunk 43 in a **graphics** display-list context, count `0x7c` vs `0x85`; the audio meaning here comes
from the contents + the adjacent WaveTables bank, not the magic).

- **Record table** `0x424010..0x429820`: u32-BE `recordCount = 0x85 (133)` @0x424010; 133 contiguous
  VADPCM predictor-codebook records, strides `0xA0`×106 + `0xD0`×26 + one `0xB0` tail =
  `0x5810` exactly (zero gaps). Record 0 doubles as a 0x30-byte global header whose words are
  magic-relative pointers (`0x5830`→offset-table start, `0x5A44`→its end). **Codec = standard order-2
  N64 libultra VADPCM**: every record has +0x28 = 2 (predictor ORDER) and +0x2C = 4 (constant); the 26
  `0xD0` records are exactly those with nonzero +0x1C. Coefficient books are smooth quasi-sinusoidal
  int16-BE (rec0 book0: −2040,−2969,−2290,−376,1733,…); book1 all-zero (unused predictor slot).
- **Offset table** `0x429820..0x429A34`: 133 × u32-BE, base `0x423FE0`-relative (entry0 `0x30`→`0x424010`),
  strictly monotonic `0x30..0x5790`, deltas exactly `{0xA0:106, 0xD0:26}` = the record strides; each
  entry lands on a record boundary and the entries fully cover the record region.
- **WaveTables** `0x429CC8..`: two `0xD3000000` sentinel words + `N64 WaveTables \0` magic @0x429CD0 +
  minimal header (two zero u32) + raw ADPCM sample payload (entropy 7.26; U-shaped 4-bit nibble
  histogram nib0=0.134/nibF=0.095 vs nib7/8=0.044 = 4-bit ADPCM residual). No sample-rate/loop fields in
  the WaveTables header itself — sample addressing is driven by the per-record +0x10/+0x14/+0x20 fields.

## Proof of non-code (data-only safe)

0 `jr $ra` / 0 prologues / 0 epilogues / 0 `lw $ra` at **all 4 byte alignments**; 0 pointer-table runs.
The coefficient region scanned in isolation: int16 values centered near zero (ADPCM book, not addresses).
The offset table has no `0x80`/KSEG prefix = base-relative offsets, not a jump table. Confirmed by a
deterministic scan + a 5-pass adversarial swarm (hidden-code + parser + parent + QA + reviewer).

## Parent tooling / leads

No external parent artifact maps into `0x421000..0x431000` (no PtrTablesV2/WaveTables loader exists in
parent `editor/`/`tools/`; the bank is research-classified only). `ob64_audio_region_analysis.js`
(ROM 0x925483..) and `ob64_crack_gap3.js` (ROM 0x20248C2..) are **comparison/rule-out only** (different
regions, only 9/16-byte VADPCM strides, no 0xA0/0xD0 codebook). Chunk 66 is before the first LHA archive
(`0x636784`) = raw/uncompressed. The decode is internal-scan-derived but byte-verified independently.

## Verification

`check_boundaries`/`check_splits` PASS (8 parts, 0 fragments, 0 code); `check_manifest` (67 chunks);
`assemble_original_mips` byte-exact (code SHA unchanged); `verify_setup` / `audit_code_region` — see the
review handoff. Runtime states: none. Patch-workbench: none.

## Ownership status: chunk-66 bytes `yes`; whole-bank schema `partial`

All 65,536 bytes of chunk 66 are byte-exact owned as 8 structural parts. The **whole audio bank** is
`partial`: the WaveTables sample payload continues into chunk 67, and the incoming edge is the previous
bank's tail (its header is before `0x421000`); several record/header fields remain unresolved
(field_0xNN). This is the intended disposition for a focused chunk-scoped decode.

## Next-run first action

Confirm the WaveTables payload closes in chunk 67 (~`0x431EF4`, tiling already exists) and that no
further sub-bank header precedes it; then **resume flat 10-chunk batches at chunk 68 (`0x441000`)** — the
payload ends only ~`0xEF4` into chunk 67, so the bank does not run deep. Optionally decode the remaining
record/WaveTables field semantics and VADPCM frame parameters (parser/runtime follow-up).
