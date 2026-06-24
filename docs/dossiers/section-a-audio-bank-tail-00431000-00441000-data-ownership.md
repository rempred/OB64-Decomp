# Section A audio-bank WaveTables tail closure — `0x00431000..0x00441000` (chunk 67)

Focused schema-closure run: closes the chunk-66 N64 audio bank's WaveTables sample payload and owns the
flat post-tail Section A audio data. Machine-readable inventory:
`docs/data-index/rev0/section-a-audio-bank-tail-00431000-00441000-data-inventory.json`. Builds on the
chunk-66 decode (`docs/dossiers/section-a-audio-bank-00421000-00431000-data-ownership.md`).

Classification: **DATA TERRITORY — Section A audio** (WaveTables tail + flat ADPCM sample payload).

## Composition

**21 parts = 11 data + 10 zero_fill (0 code)** over `0x431000..0x441000` (65,536 B). Byte split:
**raw-but-classified data 65,324 B · parsed zero_fill 212 B.**

- `data_00431000` (`0x431000..0x431EF4`): the WaveTables 4-bit ADPCM sample payload **tail** (continuation
  of chunk-66 `data_00429CC8`), ending at `0x431EF0`.
- `zero_fill_00431EF4` (`0x431EF4..0x431F08`): the **WaveTables bank terminator** (byte-precise 24 B run
  `0x431EF1..0x431F09`; word-aligned 20 B here).
- `data_00431F08` … `data_0043F3D8` + interleaved `zero_fill_*`: flat post-tail Section A audio sample
  data.

- Incoming: chunk 66 `data_00429CC8` → `data_00431000` (seamless, no zero gap at `0x431000`).
- Outgoing: `data_0043F3D8` runs to `0x441000` (no terminating zero-fill) → continues into chunk 68.

## WaveTables tail closure (byte-verified)

The WaveTables sample payload's **last non-zero byte is `0x431EF0`** (`= 0x3F`, preceded by
`1f 1f 1f 1f 01 3f`), terminated by a 24-byte zero run `0x431EF1..0x431F09`; flat audio resumes at
`0x431F09` (`= 0x53`). So the chunk-66 bank's WaveTables span is **`0x429CD0..0x431EF1`** (≈ 33,313 B of
4-bit ADPCM samples across chunks 66–67). The 3 leading unaligned terminator zeros (`0x431EF1..0x431EF3`)
are absorbed into `data_00431000` and the 1 trailing zero (`0x431F08`) into `data_00431F08` — a correct
conservative word-alignment of the same terminator (all absorbed bytes are zero).

## Post-tail region — flat Section A audio (no new bank header)

`0x431F08..0x441000` is flat high-entropy raw VADPCM/4-bit-ADPCM sample data: U-shaped nibble histogram
(extremes 23.0 % vs mid-band 9.6 %, U-ratio 2.41); 2KB-window entropy **6.57–7.26 (no `<6.0` structured
window)**; **no `N64 PtrTablesV2`/`N64 WaveTables`/AIFC/CTL/TBL/`0xD3000000` header anywhere in chunk
67**. Conservatively classified as raw audio sample payload (unknown per-sample encoding params, no
directory in this chunk). Flows continuously across `0x441000` into chunk 68 (entropy 7.336) → **resume
flat 10-chunk batches at chunk 68.**

## Proof of non-code (data-only safe)

0 `jr $ra` / 0 prologues / 0 epilogues / 0 `lw $ra` at **all 4 byte alignments** (65,533 words); 0
pointer-table runs (lone `sw $ra` at unaligned `0x431D5B` is noise; scattered `0x80xxxxxx` words have
non-constant gaps). Confirmed by a deterministic scan + a 5-pass swarm.

## Parent tooling / leads — none accepted (`anyAcceptedRomLead = false`)

Parent audio scripts (`ob64_audio_region_analysis.js` ROM 0x925483.., `research/ob64_crack_gap3.js` ROM
0x20248C2..) are **comparison/rule-out only** (different regions; the latter defines the gap base
`0x20248C2` that the 4a/4f gapOffsets are relative to). **TRAP hit + byte-rejected:** 4a gapOffset
`0x440172` (block_3332, SPRITE_CI8/CI4_TILE, claimed 37.6 % zeros) is a decompressed-7MB-stream
coordinate (→ ~ROM `0x2464A34`), not ROM `0x440172` — ROM there is flat audio (entropy 7.179, 1.8 %
zeros, no `64` header). 4f: 0 in-range. Chunk 67 precedes the first LHA (`0x636784`). No audio-bank
loader in parent `editor/`/`tools/`/`wiki/`/`ModderResources/` references these banks.

## Verification

`check_boundaries`/`check_splits` PASS (21 parts, 0 fragments, 0 code); `check_manifest` (68 chunks);
`assemble_original_mips` byte-exact (code SHA unchanged); `verify_setup` / `audit_code_region` — see the
review handoff. Runtime states: none. Patch-workbench: none.

## Ownership status: chunk-67 bytes `yes`; chunk-66+67 audio-bank unit `partial`

All 65,536 chunk-67 bytes are byte-exact owned (21 parts). The WaveTables payload is now **byte-bounded**
(closing the chunk-66 outgoing edge) and the PtrTablesV2 container is decoded, but the directory →
sample-byte addressing and several header/record fields remain unresolved (`field_0xNN`) → the bank
**unit** stays `partial`.

## Caveats & unresolved fields

- Bank-unit partial: WaveTables header @0x429CE0 (count/size/loop/rate), the two `0xD3000000` sentinel
  words @0x429CC8, the per-record `+0x10/+0x14/+0x1C/+0x20` sample-addressing fields, and the
  133-record directory → payload-offset linkage are not byte-mapped.
- Post-tail audio per-sample VADPCM params (order/npredictors/frame size) unknown; whether it's the same
  bank's second segment or a new bank (codebook later) is unresolved.
- No editor/runtime loader reads these banks — static research classification only.

## Next-run first action

**Resume the flat 10-chunk default at chunk 68 (`0x441000`)** — expected chunks 68–77
(`0x441000..0x4E1000`) of flat Section A audio sample payload, stopping before the Section A/B boundary
~`0x4E3000`. Open the batch mid-stream (no header at the seam); stay alert for any new
`N64 PtrTablesV2`/`N64 WaveTables` header that would re-introduce a codebook and shorten the batch.
