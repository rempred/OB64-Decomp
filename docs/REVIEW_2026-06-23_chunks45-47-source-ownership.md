# Review Handoff: Rev 0 Chunks 45-47 Source Ownership

Date: 2026-06-23

Range covered: `0x002D1000..0x00301000` (three chunks). This run is entirely **data territory** —
the whole range is PAST the evidenced executable-MIPS extent end `0x002B89B4`. All three chunks are
source-owned as **data parts** (NOT split into functions): high-entropy graphics/texture asset data
continuing the chunk-44 tail.

Final frontier: `0x00301000` (chunk 48). The evidenced executable MIPS extent
`0x00001000..0x002B89B4` (2,849,204 B) remains **100.0000% source-owned**.

## Commits in this run

- `5683a79` — `Fix chunks43-44 review final-commit hash` (opening fix).
- `2d8ffa6` — `Source-own Rev0 chunk 45 (0x2D1000..0x2E1000) + advance current-state docs`.
- `0659c74` — `Source-own Rev0 chunk 46 (0x2E1000..0x2F1000) + advance current-state docs`.
- `90b98dc` — `Source-own Rev0 chunk 47 (0x2F1000..0x301000) + advance current-state docs`.
- `a9417a3` — `Add four-chunk default for proven data-only tail territory to run template`.
- `Add chunks 45-47 review handoff` — this document, the run's final commit (its own hash is
  recorded in the run's final report / bridge ping, and may be filled in here by the next run).

## Opening Fix (commit `5683a79`)

`docs/REVIEW_2026-06-23_chunks43-44-source-ownership.md`: replaced the placeholder prose
review-handoff commit line with the real final commit hash **`28a1f2b`**. The current-state docs were
already correct from the chunk-44 commit (chunks 0-44 / frontier `0x002D1000` / 45 composites /
5,641 files / 55 fallback / 100.0000% executable coverage); no other change needed.

## Outcome

Chunks 45, 46, and 47 are source-owned as tracked **data parts** (DATA TERRITORY — NOT "fully split
into functions": all parts are `data_`/`zero_fill_`). Every byte in `0x2D1000..0x301000` is owned;
**0 bytes remain in generated fallback ownership** for the target range. All three rebuild
byte-exactly.

Current source mix (`verify_setup` / `assemble_original_mips`):

- **48** tracked real-assembler composite chunks (was 45).
- **5,700** tracked original-MIPS source files (177 `boot/` + 5,523 `lib/`); +59 this run
  (chunk 45: 15, chunk 46: 17, chunk 47: 27).
- **52** generated fallback chunks (was 55).
- Source-owned executable-MIPS bytes: **2,849,204** = **100.0000%** of the evidenced extent
  (`0x00001000..0x002B89B4`) — unchanged (this run added 0 code bytes).
- Total source-owned bytes `0x1000..0x301000` (code+data): **3,145,724** (+196,608 this run).
- Code-only classified bytes: **2,444,548** = **85.7977%** of the extent — unchanged.

Code-region SHA256 `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409` (unchanged);
full ROM SHA256 `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A` (unchanged).

## Chunk 45 — `0x002D1000..0x002E1000` — DATA TERRITORY (commit `2d8ffa6`)

Dossier `docs/dossiers/lib-chunk45-2D1000-2E1000.md`; data index
`docs/data-index/rev0/chunk45-data-region-inventory.json`; split JSON
`build/chunk_002D1000-002E1000_splits.json`.

**15 parts = 8 data + 7 zero_fill (0 code).** No incoming/outgoing function straddler. Continues
chunk 44's `data_002CBA58` high-entropy texture tail **seamlessly** (no zero gap at the `0x2D1000`
seam). Last part `data_002E0D68` runs to the chunk end (continues into chunk 46). Data 65,380 B
(raw-but-classified) · zero_fill 156 B (parsed).

## Chunk 46 — `0x002E1000..0x002F1000` — DATA TERRITORY (commit `0659c74`)

Dossier `docs/dossiers/lib-chunk46-2E1000-2F1000.md`; data index
`docs/data-index/rev0/chunk46-data-region-inventory.json`; split JSON
`build/chunk_002E1000-002F1000_splits.json`.

**17 parts = 9 data + 8 zero_fill (0 code).** Continues chunk 45's `data_002E0D68` tail. Last part
`data_002EF7F8` runs to the chunk end (continues into chunk 47). Data 65,356 B · zero_fill 180 B.
**Runtime-load evidence**: 3 real PI-DMA cart→RAM transfers source this chunk (romoff `0x2e1110`/
`0x2e14c2`/`0x2e1872`, 0x3c0 B each — the 0x3c0 length is a capture-filter artifact, not a record
size — loaded to RAM `0x801206f0`/`0x801255b0`/`0x801260f0`, all **archive-unmapped** = raw cart
asset bytes, not LHA-compressed). Confirms this region is raw packed asset data copied at runtime via
PI DMA.

## Chunk 47 — `0x002F1000..0x00301000` — DATA TERRITORY (commit `90b98dc`)

Dossier `docs/dossiers/lib-chunk47-2F1000-301000.md`; data index
`docs/data-index/rev0/chunk47-data-region-inventory.json`; split JSON
`build/chunk_002F1000-00301000_splits.json`.

**27 parts = 14 data + 13 zero_fill (0 code).** Continues chunk 46's `data_002EF7F8` tail. More
frequent object boundaries (13 zero-fill separators) than chunks 45-46. **OUTGOING data
continuation**: the final part `data_003002E8` (3,352 B) runs to `0x00301000` with no terminating
zero-fill and continues into chunk 48 (the next run's first action). Data 65,276 B · zero_fill 260 B.

## Data accounting (Data Territory Mode)

Total data this run: **196,608 bytes** (all three chunks, 0 code) across **59 data parts** (chunk
45: 15, chunk 46: 17, chunk 47: 27).
- **parsed**: 596 B (all `zero_fill` spans: 156 + 180 + 260).
- **raw-but-classified**: 196,012 B (high-entropy graphics/texture/asset blobs; possibly compressed,
  not field-decoded).
- **undecoded-and-unclassified: 0 bytes.**

Data files added: 59 (`asm/original/rev0/lib/{data,zero_fill}_*.s`). Index files added: 3
(`docs/data-index/rev0/chunk4{5,6,7}-data-region-inventory.json`). Known format families found:
high-entropy packed graphics/texture/asset pixel data (entropy ~6.7–7.25 bits/byte), zero-fill
object-separator alignment. No proven container/compression format — no MIO0/Yay0/Yaz0/LZSS magic
anywhere; the parent scanners' RGBA/CI4 labels are asset-SHAPE hints only. Exact next data frontier:
`0x00301000` (chunk 48), mid-object (the `data_003002E8` continuation).

## Hidden-code / false-MIPS adversarial scans

Each chunk passed a deterministic hidden-code gate (0 `jr $ra`, 0 stack prologues
`0x27BD8xxx..0x27BDFxxx`, 0 `0x80xxxxxx` RAM-pointer words across all 16,384 words/chunk) AND a
6-agent adversarial swarm (per chunk: 1 hidden-code+structure skeptic + 1 tiling/classification
skeptic): **ALL clean** (hiddenCode=false, missedStructure=false, 0 findings on all 6). Skeptics
independently confirmed: no real prologue+return pair, no string pool (printable bytes are random
texture nibbles), no `0x80xxxxxx` pointer table (no run ≥ 4 consecutive), no fixed-stride record
table, no compression/archive header at any part start. Two cosmetic notes only (word-aligned
zero-fill segmentation leaves incidental 1–3 unaligned zero bytes inside neighboring data parts —
correctly classified as data; an unaligned 16-byte incidental zero patch in chunk-46 texture data
correctly left inside its data part). No fix required.

## Parent DB / overlay contradictions & evidence sweep (`0x2D1000..0x301000`)

Whole-range direct byte stats (parent `.v64` de-swapped): entropy **7.244 b/byte**, all 256 byte
values present, zero%≈2.66 — packed asset data, **no compression magic** anywhere. Reconciled leads:

- **Runtime-load**: 3 archive-unmapped PI-DMA reads sourcing `0x2e1xxx` (chunk 46; see above).
- **Asset-shape hints** (NOT proven formats — reconciled against bytes): `scripts/ob64_4f_audit.json`
  4 small RGBA sprite/tile blocks at chunk-45 start (`0x2d112c`/`119c`/`11fa`/`12a4`);
  `scripts/ob64_4a_audit.json` one CI4 block `0x2e81d8` (claimed 153,600 B but overruns the range —
  scanner heuristic flooding) and a boundary straddler `0x2d0fe2` (RGBA32). These corroborate
  "texture/tile-shaped graphics data" but do not establish a parsed format.

Rejected / corrected:
- `scripts/ob64_functions.json`: **0 valid functions** in range (only the known `0x594a9c`
  `valid:false` false positive, far above the range).
- `scripts/ob64_archive_catalog.json`: **0 archive entries** in range (first LHA archive at
  `0x636784`). `ob64_anim_block_catalog.json`: 0 in range.
- Cutscene `dma_traces/*.json` "84 in-range hits": rejected — matched on DESTINATION RAM `0x802Dxxxx`,
  not ROM source; true `romoff` source filter gives 0 (except the 3 chunk-46 reads above).
- 498 ROM BE-words equal to an in-range offset: rejected as a directory — coincidental code constants,
  no monotonic asset-directory table indexing the range.
- Editor/patch-builder `0x2E…/0x2F…/0x300…` hits: rejected (MIPS-instruction encodings or runtime-RAM
  addresses, not ROM offsets). No editor/LordlyCaliber artifact references this ROM range.
- Do NOT invent overlay RAM mappings for this raw asset data past the executable extent.

## Patch Workbench

**None encountered.** This is data/asset territory — static data/zero-fill spans are NOT patch space
(no loader/runtime proof). The carried out-of-range candidates (`0x21CD48`/`0x21BF84`, `0x1F36F0`,
RSR-011/RSR-014) are unchanged and were NOT broadened into retroactive audits. No new
`docs/patch-workbench/rev0/*.json` artifact created.

## Runtime-state catalog / request log

**No runtime states were loaded or used** (static source ownership only). `RUNTIME_STATE_ONESHOT`
stays `none`. `docs/runtime-state-requests.md` is **unchanged**: no IDs opened, served, or
superseded. RSR-001/RSR-011/RSR-013 remain open; RSR-014 stays satisfied (static). Note: the 3
chunk-46 PI-DMA reads are already-captured evidence in the parent's `Cutscene Frames/dma_log.txt` —
not a missing runtime situation, so no new request was opened.

## Prompt-template four-chunk data-only default — APPLIED

Chunks 45-47 proved the remaining frontier is **clean data-only tail territory** (0 jr$ra / 0
prologues / 0 pointers / 0 hidden code / 0 parser-schema decisions / 0 patch-workbench-or-runtime
questions; adversarial all clean), so the conditional update Joe requested was **applied**:
`docs/templates/chunk-source-ownership-run-prompt.md` now allows a **four-chunk default for proven
data-only tail territory past `0x002B89B4`**, while explicitly keeping the two/three-chunk defaults
and full code gates for mixed/uncertain/code/hidden-code-risk/parser/patch/runtime ranges. The
`{CHUNK_COUNT}` checklist entry now reads `2`, `3`, or `4` with the data-only restriction. If a
future "data-only" run uncovers hidden code or a real structure mid-run, it must drop back to a
smaller unit and full code gates.

## Tooling

No tracked `tools/` JS changed. Reused gitignored helpers `build/combine_chunk.js`,
`build/gen_data_index.js`, `build/segs_data43.js`, `build/scan_data43.js`, `build/prof_data43.js`.
New gitignored helpers this run: `build/gen_data_tiling.js` (data-territory tiling generator with a
hidden-code guard), `build/advance_docs.js` (current-state doc advancer), `build/wf_chunks45_47_adv.js`
(adversarial swarm). Pipeline: structural scan (entropy/zero/jr-ra/prologue/pointer) → tiling
generator → `combine_chunk` → `check_boundaries`/`check_splits` → adversarial swarm →
`promote_original_mips` → `split_original_mips_part` → `gen_data_index`.

## Verification

```text
node tools/check_manifest.js                         ALL CHECKS PASS (45=15, 46=17, 47=27)
node tools/check_boundaries.js --splits build/chunk_002D1000-002E1000_splits.json --disasm build/original-mips/rev0/code_002D1000_002E1000.s   PASS (0 code, 15 data)
node tools/check_splits.js     --splits build/chunk_002D1000-002E1000_splits.json --disasm build/original-mips/rev0/code_002D1000_002E1000.s   0 fragments
node tools/check_boundaries.js --splits build/chunk_002E1000-002F1000_splits.json --disasm build/original-mips/rev0/code_002E1000_002F1000.s   PASS (0 code, 17 data)
node tools/check_splits.js     --splits build/chunk_002E1000-002F1000_splits.json --disasm build/original-mips/rev0/code_002E1000_002F1000.s   0 fragments
node tools/check_boundaries.js --splits build/chunk_002F1000-00301000_splits.json --disasm build/original-mips/rev0/code_002F1000_00301000.s   PASS (0 code, 27 data)
node tools/check_splits.js     --splits build/chunk_002F1000-00301000_splits.json --disasm build/original-mips/rev0/code_002F1000_00301000.s   0 fragments
node tools/assemble_original_mips.js                 Exact code-region match: PASS (SHA 40D4E787..B409)
node tools/verify_setup.js                           PASS (48 composites / 5,700 files / 52 fallback)
node tools/audit_code_region.js                      OK (executable extent unchanged; no code edge into tail)
git diff --check                                     clean
```

JSON validity: the 3 new `docs/data-index/rev0/chunk4{5,6,7}-data-region-inventory.json` parse and
match their documented ranges. No data files carry function/true-entry wording (all are `data_`/
`zero_fill_` with data headers). No `docs/patch-workbench/rev0/*.json` created. No root/scratch
artifacts tracked (all helpers under gitignored `build/`).

## Files Changed

- Opening fix (`5683a79`): `docs/REVIEW_2026-06-23_chunks43-44-source-ownership.md`.
- Chunk 45 (`2d8ffa6`): 15 `asm/original/rev0/lib/` parts; `manifest.json`; chunk-45 dossier + data
  index; current-state docs (AGENTS/DECOMP_LOG/NEXT_STEPS/PLATFORM/WORKFLOW).
- Chunk 46 (`0659c74`): 17 `lib/` parts; `manifest.json`; chunk-46 dossier + data index; current-state docs.
- Chunk 47 (`90b98dc`): 27 `lib/` parts; `manifest.json`; chunk-47 dossier + data index; current-state docs.
- Template (`a9417a3`): `docs/templates/chunk-source-ownership-run-prompt.md` (four-chunk data-only default).
- Review handoff (final commit): this document.

## Caveats

- All three chunks are raw-but-classified high-entropy graphics/texture asset data — byte-owned and
  classified, NOT field-decoded. No proven compression/container format (no magic found); the
  "possibly compressed" note and the parent RGBA/CI4 shape hints are hypotheses, not proven schemas.
- The global non-code tail `0x002B89B4..0x0063676C` is NOT reclassified — only the target chunks'
  bytes were owned. A full-tail reclassification remains a separate, larger design.
- Chunk 47 ends mid-object: `data_003002E8` continues into chunk 48 — the next run must own that
  continuation first.
- Static-only data/free-space findings are NOT proven patch space.

## Reviewer Checklist

- Confirm `asm/original/rev0/manifest.json` has contiguous parts for `0x002D1000` (15), `0x002E1000`
  (17), `0x002F1000` (27); total 48 chunks.
- Verify each chunk has 0 `jr $ra` / 0 prologues / 0 pointer words (data territory); zero_fill_ parts
  all-zero; data_ parts high-entropy.
- Spot-check the continuations: `data_002CBA58`→chunk 45, `data_002E0D68`→chunk 46,
  `data_002EF7F8`→chunk 47, `data_003002E8`→chunk 48.
- Spot-check parent evidence: the 3 chunk-46 PI-DMA reads (`0x2e1110`/`14c2`/`1872`), the asset-shape
  hints (4f at chunk-45 start; 4a `0x2e81d8`); confirm all reconciled as hints, not proven formats.
- Confirm the template four-chunk data-only default is restricted to proven data-only tail territory.
- Re-run the verification commands above if touching source ownership.
- Resume at `0x00301000` (chunk 48) — data territory; own the `data_003002E8` continuation first.

## Recommended next run

Chunk **48** (`0x301000..0x311000`) and beyond, in **Data Territory Mode** — and per the updated
template, a coordinator MAY now run **four** data-only chunks (e.g. chunks 48-51) since the frontier
is proven non-code tail. Own the `data_003002E8` continuation first; segment at zero-fill runs; run
the hidden-code scan + adversarial verify each chunk; keep the global-tail reclassification as a
separate, larger design.
