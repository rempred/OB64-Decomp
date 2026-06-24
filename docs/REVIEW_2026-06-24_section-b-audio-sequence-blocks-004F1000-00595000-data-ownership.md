# Review Handoff: Section B cutscene audio-sequence blocks — `0x004F1000..0x00591000` (chunks 79-88) — FALLBACK

Date: 2026-06-24.

Parser-backed natural-block ownership of the Section B cutscene audio-sequence block family. **FELL BACK
at `0x591000`** (chunk 88 end) from the planned target `0x595000` — the natural unit ends mid-chunk-89,
which the 64 KiB-chunk pipeline cannot partially represent without owning forbidden Section C.

## ⚠️ FALLBACK SUMMARY (read first)

- **Target:** chunks 79-88 full + chunk 89 partial (`0x4F1000..0x595000`). **Owned:** chunks 79-88
  (`0x4F1000..0x591000`).
- **Reason:** the block-family end (`0x594280`), the prompt's fallback boundary (`0x594280`), and the B/C
  boundary (`0x595000`) are ALL mid-chunk-89 (the 64 KiB report chunk is `0x591000..0x5A1000`).
  `assemble_original_mips.js` requires each manifest chunk to **exactly tile** its 64 KiB report chunk
  (it throws otherwise), and `promote` refuses partial overlaps. So a partial-interior chunk 89 is not
  representable, and owning the whole chunk 89 would pull in forbidden Section C past `0x595000`. So
  `0x591000` (chunk 88 end) is the only pipeline-clean boundary ≤ `0x595000`. (Stop conditions:
  "source-owner manifest/tooling cannot safely represent the planned split" + "directory tail needs a
  separate pass".)
- **Bridge event: `agent/error`** (fallback), frontier **`0x00591000`**.

## Exact completed range / chunks

- **Owned: chunks 79, 80, …, 88** = `0x004F1000..0x00591000` (655,360 B).
- Frontier `0x004F1000` → **`0x00591000`** (chunk 89). Planned `0x595000` NOT reached.

## Code/data composition

**71 parser-backed parts (all data, 0 zero_fill, 0 code).** Cut at the catalog block boundaries (+ chunk
seams). Owns **block 0 body** (`0x4F1000..0x4F4070`) + **blocks 1–60 whole** + **block 61 head**
(`0x5908D0..0x591000`).

## Ownership status: `yes` (chunks 79-88)

All 655,360 bytes byte-exact owned as 71 parser-backed block parts (independent reviewer **yes**;
fallback endorsed). The block family is owned as a parser-backed **container**; per-channel event-opcode
semantics conservative.

## Block-family / parser findings

Source of truth: parent `ob64_anim_block_catalog.json` (63 blocks `0x4F0FB0..0x594280`, roundtrip_ok) +
`anim_block_codec.py` (cutscene MUSIC/SFX; Gate-2 in-game proof). **Swarm-verified byte-exact:** all 63
block starts tag `0x00000215`; all header invariants (tag@+0x00, nch@+0x04, t1off@+0x0C=0x38,
t2off@+0x10=t1off+nch×4, t2end@+0x14); perfect contiguity (0 gaps); family end `0x594280`; owned-span
exact (block 0 body + 1–60 whole + 61 head). 4a/4f `gapOffset`s in range byte-rejected (stream coords).

## Directory-tail & B/C-boundary findings (DEFERRED, chunk 89)

`0x594280..0x595000`: a **65-entry u32-BE offset table** @`0x594280` (table proper `0x594280..0x594384`;
prelude `0x64C2/0x140/0x148` then offsets `0x63DC..0x27C5F4`; max ~2.6 MB exceeds the raw-ROM Section C
span → indexes a **decompressed asset space**, conservatively a directory into the Section C packed pool;
corroborated by the codec doc). **Correction to an earlier read:** after `0x594384` there is a short zero
gap then **more non-zero directory/asset content to ~`0x594FFF`** (NOT zero-padding); Section C packed
pool begins ~`0x595000`. The exact B/C boundary is conservatively `~0x595000` (high-entropy both sides;
no zero/marker boundary) — DEFERRED.

## Hidden-MIPS result

**DATA-ONLY SAFE.** 0 jr$ra/prologues/epilogues/lw$ra/sw$ra at all 4 byte alignments AND byte-agnostic;
known code region has 2105 jr$ra vs this region's 0. The 4 pointer-runs are audio-event bytes inside
streams. 5-pass swarm unanimous; QA 0 problems.

## Parent tooling — accepted/rejected leads

**ACCEPTED (byte-verified ROM lead):** `ob64_anim_block_catalog.json` block mapping + `anim_block_codec.py`
roundtrip. Range precedes the first LHA (`0x636784`). **REJECTED:** 6 in-range 4a/4f `gapOffset`s
(decompressed-7MB-stream coords). `ob64_audio_region_analysis.js` / layout docs comparison-only.

## Machine-readable index & review handoff

- Index: `docs/data-index/rev0/section-b-audio-sequence-blocks-004F1000-00595000-data-inventory.json` —
  `blockCatalog`, `blockBoundarySummary` (61 in-range block boundaries), `sectionBDirectory`,
  `sectionBCBoundary`, `fallback`, `payloadExtentInterpretationGap`. Validated: parses; data 655,360,
  contiguous to `0x591000`, 71 subregions, 0 gaps. Dossier:
  `docs/dossiers/section-b-audio-sequence-blocks-004F1000-00595000-data-ownership.md`.

## Verification results

```text
JSON parse docs/data-index/rev0/section-b-audio-sequence-blocks-004F1000-00595000-data-inventory.json   parses; data=655,360, contiguous to 0x591000, 71 subregions
source-owner coverage 0x4F1000..0x591000                                                                71 parts, byte-exact, 0 gaps
parser/catalog block-boundary audit (63 blocks)                                                         all 63 tag 0x215; contiguity 0 breaks; owned-span exact (5-pass swarm)
node tools/check_boundaries.js / check_splits.js (x10)                                                  BOUNDARY CHECK PASS; 0 fragments (0 code)
node tools/check_manifest.js                                                                            ALL CHECKS PASS (89 chunks)
node tools/assemble_original_mips.js                                                                    Exact code-region match: PASS (SHA 40D4E787..B409 unchanged)
node tools/verify_setup.js                                                                              PASS (89 composites / 6,140 files / 11 fallback)
node tools/audit_code_region.js                                                                         OK (executable extent 0x1000..0x2B89B4 unchanged)
git diff --check                                                                                        clean
```

## Reached `0x595000` or fell back at `0x594280`?

**Neither — fell back at `0x591000`** (chunk 88 end), which is *before* the prompt's `0x594280` fallback,
because `0x594280` is itself mid-chunk-89 and not pipeline-representable. This owns most of the block
family (61 of 63 blocks); the last 2 blocks + directory are deferred.

## Caveats & unresolved fields

- Per-channel event-opcode semantics conservative (container proven; events verbatim).
- Section-B directory-tail schema + exact B/C boundary deferred (chunk 89).
- chunk-78 `payloadLen 0xDC6A`→`0x4F45F2` interpretation gap carried forward.
- **Tooling limitation surfaced:** the pipeline can't own a partial-interior 64 KiB chunk — natural units
  ending mid-chunk force a chunk-aligned fallback. The chunk-89 run needs a partial-chunk enhancement or
  a combined Section-B-tail + Section-C run ending at `0x5A1000`.

## Runtime-state & patch-workbench

No runtime states (`RUNTIME_STATE_ONESHOT = none`; request log unchanged). No patch-workbench
(data/asset territory, static-only).

## Next recommended unit / frontier

**Chunk 89 (`0x00591000`):** own block 61 tail (`0x591000..0x592490`) + block 62 (`0x592490..0x594280`)
+ the Section-B directory tail (`0x594280..0x595000`), then pin the Section B/C boundary and start
Section C. Resolve the partial-chunk constraint by either (a) a partial-interior-chunk pipeline
enhancement, or (b) a combined Section-B-tail + Section-C run owning all of chunk 89 to the `0x5A1000`
chunk boundary (with Section C in scope).

## Commits

- `20c3ce3` — `Source-own Rev0 Section B cutscene audio-sequence blocks chunks 79-88 (0x4F1000..0x591000) [FALLBACK]`
  (71 parser-backed parts + manifest + index + dossier + current-state docs).
- This review handoff (final commit).

## Review doc path

`docs/REVIEW_2026-06-24_section-b-audio-sequence-blocks-004F1000-00595000-data-ownership.md`
