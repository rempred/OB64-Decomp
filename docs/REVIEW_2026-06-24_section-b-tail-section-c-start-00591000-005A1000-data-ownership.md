# Review Handoff: Section B tail + Section C start — `0x00591000..0x005A1000` (chunk 89) — RUN-COMPLETE

Date: 2026-06-24.

Combined-boundary ownership of the **whole** chunk 89: closes the Section B cutscene audio-sequence block
family (family end `0x594280`) and starts the Section C HUFFMAN-compressed resource pool. **REACHED the
planned frontier `0x005A1000`** — this run **resolves** the prior run's partial-interior-chunk fallback
(chunks 79-88 fell back at `0x591000`) by owning both sides of the Section B/C boundary as separate
subranges in one chunk-aligned run.

## ✅ RUN-COMPLETE SUMMARY (read first)

- **Target:** whole chunk 89 (`0x591000..0x5A1000`). **Owned:** all 65,536 bytes. **Frontier reached:
  `0x005A1000`.**
- **Constraint resolved:** the prior fallback existed because the anim-family end `0x594280` + B/C boundary
  are mid-chunk-89, and `assemble` requires each manifest chunk to exactly tile its 64 KiB report chunk.
  Owning the WHOLE chunk 89 with separate Section B tail + Section C subranges represents the mid-chunk
  boundary `0x594280` as an internal part boundary — **no pipeline change needed** (prompt-authorized).
- **Bridge event: `agent/run-complete`** (frontier reached), frontier **`0x005A1000`**.

## Exact completed range / chunks

- **Owned: chunk 89** = `0x00591000..0x005A1000` (65,536 B).
- Frontier `0x00591000` → **`0x005A1000`** (chunk 90). Planned `0x005A1000` reached.

## Code/data composition — 5 structural parts (4 data + 1 zero_fill, 0 code)

| Part | ROM range | Bytes | What |
|---|---|---|---|
| `data_00591000` | `0x591000..0x592490` | 5,264 | Section B **block 61 tail** (completes block 61; head owned chunk 88) |
| `data_00592490` | `0x592490..0x594280` | 7,664 | Section B **block 62** = FINAL (63rd) block; **family end 0x594280** |
| `data_00594280` | `0x594280..0x594384` | 260 | **Section C directory** (65-entry u32-BE offset table) |
| `zero_fill_00594384` | `0x594384..0x5943C8` | 68 | post-directory zero pad (17 words) |
| `data_005943C8` | `0x5943C8..0x5A1000` | 52,280 | **Section C HUFFMAN-compressed "HUFF" pool START** (UNDECODED; OUTGOING) |

## Ownership status: `yes` (all 65,536 bytes of chunk 89)

Independent reviewer **yes**; `partialChunkResolved = true`. All bytes byte-exact owned as 5 parser-backed /
classified parts. The block family is owned as a parser-backed **container**; Section C is owned as
classified compressed data (payload undecoded).

## Section B closure (parser-backed, byte-verified)

Source of truth: parent `ob64_anim_block_catalog.json` (63 blocks `0x4F0FB0..0x594280`, roundtrip_ok) +
`anim_block_codec.py`. **5-pass swarm:** block 61 (catalog idx 61, `0x5908D0`/`0x1BC0`, end_source
next-header) + block 62 (catalog idx 62, `0x592490`/`0x1DF0`, end_source known-trailing-end) are the final
2 family blocks; ROM-verified tag `0x00000215` at each header; codec round-trips **both IDENTICAL**.
**Family ends `0x594280`** (block 62 size ASSUMED via KNOWN_TRAILING_END, corroborated by a `0x96`
terminator @`0x59427A` + zero-fill). This closes the 63-block family.

## Section C findings (NEW — refines the survey)

- **Directory** `0x594280..0x594384` = 65 u32-BE words: 3-word prelude `0x64C2/0x140/0x148`, then a 62-entry
  offset list `0x63DC..0x27C5F4` (largely-monotonic, NOT strictly — repeats/back-references = shared
  assets). Max `0x27C5F4` (2.49 MB) **far exceeds** the raw-ROM Section C span `0xA24EC` (~4×) → indexes a
  **DECOMPRESSED asset space**. Then 68 B all-zero pad to `0x5943C8`.
- **Section C = a custom "HUFF" HUFFMAN-compressed pool** (`0x5943C8..`). ASCII `"HUFF"` magic @`0x5943D4`,
  `0x59A668`, `0x5A0E40` (3 in-chunk); **29 HUFF blocks** across `0x594280..0x63676C` (first `0x5943D4`,
  last `0x630BC4`). Header: `[u16]` + CONSTANT `48 55 fe 00 / 01 40 00 f0` + `"HUFF"` + `01 2c` + payload.
  Whole-pool entropy ~7.97. **UNDECODED-compressed** — no decompressor in the parent toolchain (the only
  parent Huffman code is the standard LHA `-lh5-` decoder for the archives @`0x636784+`, a different codec).
  This **refines the survey's** "no standard magic": Section C has a custom `"HUFF"` block magic.

## Section B/C boundary — pinned at `0x594280`

Block 62 ends at `0x594280`; the Section C directory begins AT `0x594280` with no gap → structural B→C
transition byte-exact **`0x594280`** (most defensible). Compressed-payload transition ~`0x5943C8` (entropy
6.40 → 7.97). The survey's "~`0x595000`" is **`0xD80` too high** (inside the HUFF pool); superseded. Both
boundaries are mid-chunk-89 and owned here.

## Hidden-MIPS result

**DATA-ONLY SAFE.** Adversary swarm, all 4 alignments: **`jr $ra` = 0** everywhere; no `lw/sw $ra` frame
structure; exactly 1 prologue-pattern word = `0x594A9C` (`0x27BD91B1`) = the **survey-known FALSE
POSITIVE** (signed imm −28239 ≈ 28 KB frame, located inside the first HUFF block ≥`0x5943C8`, no closing
return). The `0x594A9C` code lead is **rejected** (parent `ob64_functions.json` has 0 funcs in range).
Contrast: known code region `0x1000..0x100000` has 2105 `jr $ra`.

## Parent tooling — accepted/rejected leads

**ACCEPTED byte-verified ROM lead** (`anyAcceptedRomLead = true`): `ob64_anim_block_catalog.json` blocks 61
+ 62 match the ROM (tag 0x215 each; block 62 end = family end `0x594280`). Range precedes the first LHA
archive (`0x636784`; all 825 archives ≥ it). **No parent tool decodes the Section C "HUFF" codec**
(`huffDecoderInParent = false`). **REJECTED:** the `0x594A9C` code lead; the single in-range 4f `gapOffset`
`0x5921D0` ("palettetail") lands inside block 61's audio tail in ROM and is a decompressed-7MB-stream coord
(base `0x20248C2`), not a ROM offset; 4a has 0 in-range.

## Machine-readable index & dossier

- Index: `docs/data-index/rev0/section-b-tail-section-c-start-00591000-005A1000-data-inventory.json` —
  `directoryEvidence`, `sectionBCBoundary`, `sectionCStart`, `toolingConstraint`, `decodedContainerSchema`,
  `hiddenCodeRisk`, `rejectedLeads`. Validated: parses; data 65,468 + zero 68 = 65,536, contiguous
  `0x591000..0x5A1000`, 5 subregions, 0 gaps.
- Dossier: `docs/dossiers/section-b-tail-section-c-start-00591000-005A1000-data-ownership.md`.

## Verification results

```text
JSON parse section-b-tail-section-c-start-00591000-005A1000-data-inventory.json   parses; data=65,468 + zero=68 = 65,536; contiguous to 0x5A1000; 5 subregions
5-pass verification swarm (hidden/parser/parent/QA/reviewer)                      unanimous; ownershipStatus=yes; partialChunkResolved=true; QA 0 problems
node tools/check_manifest.js                                                      ALL CHECKS PASS (90 chunks; chunk 89 = 5 parts)
node tools/check_boundaries.js / check_splits.js                                  BOUNDARY CHECK PASS; 0 fragments / 0 code
node tools/assemble_original_mips.js                                             Exact code-region match: PASS (SHA 40D4E787..B409 unchanged)
node tools/verify_setup.js                                                        PASS (90 composites / 6,145 files / 10 fallback)
node tools/audit_code_region.js                                                   OK (executable extent 0x1000..0x2B89B4 unchanged)
git diff --check                                                                  clean
```

## Reached `0x005A1000` or fell back?

**Reached `0x005A1000`** (whole chunk 89 owned). This is the RUN-COMPLETE that resolves the prior
partial-interior-chunk fallback.

## Caveats & unresolved fields

- Section C HUFF (Huffman) codec UNDECODED-compressed (no parent decoder); blocks owned by container shape.
- Directory per-entry semantics unresolved (prelude meaning; 29 blocks vs 62 offsets mapping; offsets index
  a decompressed-asset space, base `0x20248C2` not reconciled here).
- HUFF block header fields beyond the magic not formally decoded.
- Block 62 size `0x1DF0` ASSUMED via KNOWN_TRAILING_END (only block not header-corroborated).
- B/C boundary dual-pin: `0x594280` (structural) vs ~`0x5943C8` (payload); both are part boundaries.
- chunk-78 Section B index-table payloadLen interpretation gap carried forward.

## Runtime-state & patch-workbench

No runtime states (`RUNTIME_STATE_ONESHOT = none`; request log unchanged). No patch-workbench (data/asset
territory, static-only).

## Next recommended unit / frontier

**Chunk 90 (`0x005A1000`):** continue Section C — own the next run of "HUFF" Huffman-compressed blocks as
raw-but-classified (undecoded-compressed) data territory, advancing toward the hard data end ~`0x0063676C`
(last HUFF block `0x630BC4`; first LHA archive `0x636784`). Optionally build/port a HUFF decoder to decode
the Section C blocks + map the directory entries to decompressed assets. Do NOT continue past `0x0063676C`
without Joe explicitly asking.

## Commits

- `a48c944` — `Source-own Rev0 chunk 89 Section B tail + Section C start (0x591000..0x5A1000) + advance current-state docs`
  (5 structural parts + manifest + index + dossier + current-state docs).
- This review handoff (final commit).

## Review doc path

`docs/REVIEW_2026-06-24_section-b-tail-section-c-start-00591000-005A1000-data-ownership.md`
