# Section A/B boundary + Section B index start — `0x004E1000..0x004F1000` (chunk 78)

Focused natural-boundary/schema run: chunk 78 crosses the **Section A/B boundary**. Machine-readable
inventory: `docs/data-index/rev0/section-a-to-b-boundary-004E1000-004F1000-data-inventory.json`. Closes
Section A (now fully owned + classified AUDIO) and opens Section B.

Classification: **MIXED data families across the A/B boundary** — Section A audio tail, Section B index
table + payload, and the head of the first parser-backed cutscene audio-sequence block.

## Composition

**4 structural data parts (0 zero_fill, 0 code)** over `0x4E1000..0x4F1000` (65,536 B).

| part | range | bytes | role |
|---|---|---|---|
| `data_004E1000` | `0x4E1000..0x4E3140` | 8,512 | Section A AUDIO tail (continuation of chunk-77 `data_004E0CE8`) |
| `data_004E3140` | `0x4E3140..0x4E6988` | 14,408 | Section B INDEX TABLE (shape decoded) |
| `data_004E6988` | `0x4E6988..0x4F0FB0` | 42,536 | Section B PAYLOAD (undecoded) |
| `data_004F0FB0` | `0x4F0FB0..0x4F1000` | 80 | first cutscene block HEAD (parser-backed; outgoing) |

Byte split: raw-but-classified 23,000 B · undecoded 42,536 B. All boundaries word-aligned.

## Section A/B boundary — pinned at `0x004E3140` (byte-confirmed)

The flat Section A 4-bit ADPCM audio tail ends and the Section B index-table header begins at
**`0x4E3140`** (header word0 = `0x706` = 1798 record count). Entropy drops ~6.8→2.5 at the boundary.
This resolves the survey's "header `0x4E3140` / table `0x4E3158`" wording: header `0x4E3140..0x4E3158`
(24 B), records `0x4E3158..0x4E6988`. **Section A** (`0x301000..0x4E3140`) is now fully owned + classified
AUDIO; **Section B** begins here.

## Section B index table — shape decoded (semantics partial)

`0x4E3140..0x4E6988` (14,408 B; entropy ~2.5). Header (6 u32-BE) = `[recordCount 0x706 (1798), 0x2E4
(740), 0x102 (258), 0, 0, 0xDC6A (56426 = payloadLen)]`. **1798 records** @`0x4E3158`, stride 8 =
`[u32-BE offset, u32-BE 0x64]`; offsets strictly monotonic `0x3848..0xDC58`, **base `0x4E3140`**
(rec0 `0x3848` → `0x4E6988` = payload start; table ends exactly at `0x4E6988`). **`0x64` is a constant
flag/type, NOT a per-record length** (record spans are only 17–66 B). The indexed records are
**`0x80`-terminated variable-length event streams** (1797/1798 end in byte `0x80`).

## Section B payload — undecoded

`0x4E6988..0x4F0FB0` (42,536 B; entropy ~5.5), indexed by the table. The indexed payload effectively ends
~`0x4F0DAA`, then a u16-BE LUT `0x4F0DAA..0x4F0FB0` (incrementing `0x0000..0x0084` ×2, purpose unknown).
Record/stream schema UNKNOWN; no parent tool decodes it.

## First cutscene audio-sequence block — parser-backed (outgoing)

`data_004F0FB0` is the **HEAD only** (80 B) of block 0: tag `0x00000215`, nch 24, t1off `0x38`, t2off
`0x98`, stride `0x1A0`, **size `0x30C0`** → ends `0x4F4070` (next block also tag `0x215`). **Accepted
byte-verified ROM lead:** parent `scripts/ob64_anim_block_catalog.json` (block 0 @`0x4F0FB0`; 63
contiguous blocks `0x4F0FB0..0x594280`; roundtrip_ok) + `tools/anim_block_codec.py` (cutscene MUSIC/SFX
sequences, Gate-2 in-game proof). The block body continues past `0x4F1000` → **outgoing into chunk 79**
(not overclaimed).

## Proof of non-code (data-only safe)

0 `jr $ra` / 0 prologues / 0 epilogues / 0 `lw $ra` / 0 jr-any at **all 4 byte alignments**, every region;
0 pointer-table runs. The table offsets are payload-relative small monotonic values (base `0x4E3140`),
not `0x80xxxxxx` code pointers; `field2 == 0x64` constant is impossible in code. Confirmed by a
deterministic scan + a 5-pass swarm.

## Parent tooling / leads

**Accepted (byte-verified):** `ob64_anim_block_catalog.json` block 0 @`0x4F0FB0` (`anyAcceptedRomLead =
true`). **Rejected:** 4a gapOffset `0x4EBBD8` (decompressed-7MB-stream coord, base `0x20248C2`; ROM there
is Section B payload, not a CI4 tile). 4f: 0 in-range. archive first LHA `0x636784` (chunk 78 precedes
it). **No parent tool decodes the Section B index table or payload.**

## Verification

`check_boundaries`/`check_splits` PASS (4 parts, 0 fragments, 0 code); `check_manifest` (79 chunks);
`assemble_original_mips` byte-exact (code SHA unchanged); `verify_setup` / `audit_code_region` — see the
review handoff. Runtime states: none. Patch-workbench: none.

## Ownership status: chunk-78 bytes `yes`; Section B unit `partial`

All 65,536 chunk-78 bytes byte-exact owned (4 parts). Section A/B boundary pinned. Section B table shape
decoded but the `0x64` field + header fields + payload schema are unresolved, and the Section B subsystem
+ the 63-block family span far past this chunk — so the Section B **unit** is `partial`.

## Caveats & unresolved fields

- Section B payload undecoded (`0x80`-terminated event streams, schema unknown); `0x64` field meaning
  unknown; header fields `0x2E4`/`0x102` unknown; trailing u16-BE LUT purpose unknown.
- **Header payloadLen `0xDC6A` implies a logical payload extent to `0x4F45F2` (past the first anim block
  `0x4F0FB0`)**, while the chunk-local payload part stops at `0x4F0FB0` — an unresolved interpretation gap
  to settle in chunk 79 (does the header length include the anim-block region?).
- Only the first block HEAD (80 B) is in chunk 78; the body + 62 more blocks are chunk 79+.

## Next-run first action — chunk 79: parser-backed anim-block family

Continue Section B from `0x4F1000`: finish owning the first block body (`0x4F0FB0..0x4F4070`), then the
contiguous **63-block cutscene audio-sequence run** (`0x4F0FB0..0x594280`) as a **PARSER-BACKED
natural-block run** (`tools/anim_block_codec.py`; preserve natural block boundaries — NOT flat tiling).
Also settle the payloadLen-vs-anim-block interpretation gap.
