# Section B cutscene audio-sequence blocks — `0x004F1000..0x00591000` (chunks 79-88) — FALLBACK

Parser-backed natural-block ownership of the Section B cutscene audio-sequence block family. Machine-
readable inventory: `docs/data-index/rev0/section-b-audio-sequence-blocks-004F1000-00595000-data-inventory.json`.

**This run FELL BACK at `0x591000` (chunk 88 end)** from the planned target `0x595000`. The block-family
end (`0x594280`) and the B/C boundary (`0x595000`) are both **mid-chunk-89**, which the whole-64KB-chunk
assemble pipeline cannot partially represent without owning forbidden Section C (see Fallback).

Classification: **DATA TERRITORY — Section B parser-backed cutscene AUDIO-SEQUENCE blocks** (music/SFX
sequences; not vector animation).

## Composition

**71 parser-backed parts (all data, 0 zero_fill, 0 code)** over `0x4F1000..0x591000` (655,360 B = ten
64 KiB chunks). Parts are cut at the **catalog block boundaries** (+ chunk seams for cross-chunk blocks).

- Owned: **block 0 body** (`0x4F1000..0x4F4070`; head was chunk 78) + **blocks 1–60 whole**
  (`0x4F4070..0x5908D0`) + **block 61 head** (`0x5908D0..0x591000`).
- Incoming: chunk 78 `data_004F0FB0` (block 0 head) → `data_004F1000` (block 0 body); seamless mid-block.
- Outgoing: block 61 head → block 61 tail (`0x591000..0x592490`) in chunk 89.

## Parser-backed block model (byte-verified)

Source of truth: parent `scripts/ob64_anim_block_catalog.json` (63 contiguous blocks `0x4F0FB0..0x594280`,
roundtrip_ok) + `tools/anim_block_codec.py` (cutscene MUSIC/SFX sequences; **Gate-2 in-game proof**:
blanking tracks stopped cutscene sound while animation continued). Each block: header **tag `0x00000215`**
@+0x00, **nch** @+0x04, **t1off** @+0x0C (= 0x38), **t2off** @+0x10 (= t1off + nch×4), **t2end** @+0x14
(= t2off + nch×4); table1 = per-channel command-stream starts; table2 = per-channel init pointers; then
per-channel command/event streams (grammar: `95 ff 99 60` track-start / `0x96` end-of-track).

**Verified by a 5-pass swarm:** all 63 block starts carry tag `0x215` (0 exceptions); all header invariants
hold; perfect contiguity (`block[i].off+size == block[i+1].off`, 0 gaps); family end `0x594280`; the
owned-span claim is exact. Ownership is of the parser-backed **container** (byte-exact); per-channel
event-opcode semantics are kept conservative (carried verbatim, not decoded).

## Proof of non-code (data-only safe)

0 `jr $ra` / 0 prologues / 0 epilogues / 0 `lw $ra` / 0 `sw $ra` at **all 4 byte alignments AND
byte-agnostic** (0 at any offset) across 655,360 B. Quantitative contrast: the known code region
`0x1000..0x100000` has 2105 `jr $ra` + 1286 prologues; this comparable-size region has **0/0**. The 4
runs of ≥4 consecutive `0x80xxxxxx` words all fall inside per-channel audio-event streams (coincidental
high byte, not pointer/jump tables).

## Parent tooling / leads

**ACCEPTED byte-verified ROM lead** (`anyAcceptedRomLead = true`): the `ob64_anim_block_catalog.json`
block mapping matches the ROM exactly (all 63 starts tag `0x215`, all boundaries tile); the codec
roundtrips all 63 blocks byte-identical. Range precedes the first LHA archive (`0x636784`). **REJECTED:**
6 in-range 4a/4f `gapOffset`s (`0x4F6E10`/`0x503928`/`0x510804`/`0x564892`/`0x584DFE`/`0x51BCDC`) are
decompressed-7MB-stream coords (base `0x20248C2`) — read as ROM offsets they land mid-block with no
`0x215` tag; byte-rejected.

## Fallback — why the run stops at `0x591000`

The natural unit's end (`0x594280`), the prompt's fallback boundary (`0x594280`), and the B/C boundary
(`0x595000`) are **all mid-chunk-89** (the 64 KiB report chunk is `0x591000..0x5A1000`).
`assemble_original_mips.js` **requires every tracked manifest chunk to exactly tile its 64 KiB report
chunk** (it throws if parts don't end at the report-chunk end), and `promote` refuses partial overlaps —
so a partial-interior chunk 89 (`0x591000..0x595000`) is **not representable**. Owning the whole report
chunk 89 (`0x591000..0x5A1000`) would require source-owning Section C bytes past `0x595000`, which the
prompt forbids. So **`0x591000` (chunk 88 end) is the only pipeline-clean boundary ≤ `0x595000`.**

## Deferred (chunk 89, `0x591000..0x595000`, 16,384 B)

- **block 61 tail** `0x591000..0x592490` (0x1490 B);
- **block 62** `0x592490..0x594280` (0x1DF0 B; trailing family block, sized via the codec's
  KNOWN_TRAILING_END);
- **Section-B directory tail** `0x594280..0x595000`: a **65-entry u32-BE offset table** @`0x594280`
  (table proper `0x594280..0x594384`; 3-word prelude `0x64C2/0x140/0x148` then offsets `0x63DC..0x27C5F4`;
  max offset ~2.6 MB exceeds the raw-ROM Section C span → indexes a **decompressed asset space**,
  conservatively a directory into the Section C packed pool). **NOTE:** after `0x594384` there is a short
  zero gap then **more non-zero directory/asset content to ~`0x594FFF`** (NOT zero-padding); then the
  Section C packed pool begins ~`0x595000`. Semantics unproven.

## Verification

`check_boundaries`/`check_splits` PASS (all 10 chunks, 0 fragments, 0 code); `check_manifest` (89 chunks);
`assemble_original_mips` byte-exact (code SHA unchanged); `verify_setup` / `audit_code_region` — see the
review handoff. Runtime states: none. Patch-workbench: none.

## Ownership status: `yes` (chunks 79-88; block 0 body + 1-60 + 61 head)

All 655,360 chunk-79-88 bytes byte-exact owned as 71 parser-backed block parts. The remaining 2 blocks
(61 tail + 62) + the directory tail are deferred to chunk 89.

## Caveats & unresolved fields

- Per-channel event-opcode semantics conservative (container proven; events carried verbatim).
- Section-B directory-tail schema (`0x594280..0x595000`) + the exact B/C boundary (~`0x595000`) deferred.
- The chunk-78 Section B index-table `payloadLen 0xDC6A` → `0x4F45F2` interpretation gap (falls in the
  block-0/1 region) carried forward; the block family is parser-backed regardless.

## Next-run first action — chunk 89 (block tail + directory + B/C boundary)

Own block 61 tail (`0x591000..0x592490`) + block 62 (`0x592490..0x594280`) + the directory tail
(`0x594280..0x595000`), then pin the Section B/C boundary and start Section C. Because `0x594280` and
`0x595000` are mid-chunk-89, this needs either a **partial-interior-chunk pipeline enhancement** OR a
**combined Section-B-tail + Section-C run** that owns all of chunk 89 down to a Section C natural boundary
(e.g. the `0x5A1000` chunk boundary, once Section C is in scope).
