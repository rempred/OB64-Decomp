# Review Handoff: Rev 0 Chunks 43-44 Source Ownership

Date: 2026-06-23

Range covered: `0x002B1000..0x002D1000` (two chunks). This run crosses the evidenced
executable-MIPS extent end `0x002B89B4`: chunk 43 is the **code→data transition** chunk, chunk 44
is **pure data territory**.

Final frontier: `0x002D1000` (chunk 45). The evidenced executable MIPS extent
`0x00001000..0x002B89B4` (2,849,204 B) is now **100.0000% source-owned**.

## Commits in this run

- `d4d6aa5` — `Fix chunks40-42 review commit hash + stale current-state docs` (opening fixes).
- `e4cfab5` — `Source-own Rev0 chunk 43 (0x2B1000..0x2C1000) + advance current-state docs`.
- `47e5c4f` — `Source-own Rev0 chunk 44 (0x2C1000..0x2D1000) + advance current-state docs`.
- `Add chunks 43-44 review handoff` — this document, the run's final commit (its own hash is
  recorded in the run's final report / bridge ping, and may be filled in here by the next run).

## Opening Fixes (commit `d4d6aa5`)

1. `docs/REVIEW_2026-06-23_chunks40-42-source-ownership.md`: replaced the placeholder prose
   final-review-handoff commit line with the real hash **`7618139`** (`Add chunks 40-42 review handoff`).
2. Corrected stale current-state ranges/counts that lagged chunk 42 (Known Issue #2):
   - `AGENTS.md`: source-owned prose `0-39`/`0x281000` → `0-42`/`0x2B1000`; verifier-result block
     `5,044` files → `5,534` and `0x281000` → `0x2B1000`.
   - `docs/DECOMP_LOG.md` current invariants: `0-39`/`0x281000` → `0-42`/`0x2B1000`.
   - `docs/NEXT_STEPS.md` current source-mix range: `0x281000` → `0x2B1000`.
   - `docs/WORKFLOW.md` expected-setup range: `0x281000` → `0x2B1000`.
   - `docs/PLATFORM.md`: `0-40` → `0-42`; `0-39`/`0x281000` → `0-42`/`0x2B1000` with lib count
     `4,867` → `5,357`; stale split frontier `0x221000`/chunk34 → `0x2B1000`/chunk43; fixed a
     contradictory historical-snapshot note to current totals.
3. `RUNTIME_STATE_ONESHOT` stays `none` (RSR-014 satisfied; no new current-range request).
4. The parent `scripts/ob64_4a_audit.json` LZSS/sprite-block leads in this range stay **rejected**
   (scanner false positives over real code/data; see below). No old scanner false positive overruled
   byte-exact disassembly.

## Outcome

Chunk 43 is source-owned as tracked **code/data parts** (MIXED — NOT "fully split into functions":
code parts to `0x2B89B8`, data parts after). Chunk 44 is source-owned as tracked **data parts**
(DATA TERRITORY — no code). Every byte in `0x2B1000..0x2D1000` is owned; **0 bytes remain in
generated fallback ownership** for the target range. Both chunks rebuild byte-exactly.

Current source mix (`verify_setup` / `assemble_original_mips`):

- **45** tracked real-assembler composite chunks (was 43).
- **5,641** tracked original-MIPS source files (177 `boot/` + 5,464 `lib/`); +107 this run
  (chunk 43: 90, chunk 44: 17).
- **55** generated fallback chunks (was 57).
- Source-owned executable-MIPS bytes: **2,849,204** = **100.0000%** of the evidenced extent
  (`0x00001000..0x002B89B4`).
- Total source-owned bytes `0x1000..0x2D1000` (code+data): **2,949,116**.
- Code-only classified bytes: **2,444,548** = **85.7977%** of the extent (chunk 43 added 31,160 B
  code; chunk 44 added 0 code).

Code-region SHA256 `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409` (unchanged);
full ROM SHA256 `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A` (unchanged).

## Chunk 43 — `0x002B1000..0x002C1000` — MIXED (code → data transition)

Dossier `docs/dossiers/lib-chunk43-2B1000-2C1000.md`; data index
`docs/data-index/rev0/chunk43-data-region-inventory.json`; split JSON
`build/chunk_002B1000-002C1000_splits.json`.

**90 parts = 80 normal code + 1 incoming straddler-tail + 8 data.** (1 + 80 + 1 = 82 code parts
total in `check_boundaries` terms; 8 data parts.)

- Incoming FUNCTION straddler-tail `func_002B0E8C_chunk43tail` `0x2B1000..0x2B1014` (continues
  `func_002B0E8C` from chunk 42; epilogue `lw $s2/$s1/$s0`, `jr $ra`@`0x2B100C` + delay
  `addiu $sp,0x140`@`0x2B1010`).
- CODE region `0x2B1014..0x2B89B8` — the **mission-briefing / scenario-overview overlay** (runtime
  RAM ~`0x8023Cxxx`/`0x8024xxxx` per `scripts/ob64_overlay_map.json`, NOT the linear `0x80320Cxx`
  decode map). 62 parent functions + recovered frameless leaves + forward-folded read-before-write
  preambles. FP/double geometry + F3DEX2 display-list builders + DMA/resource loaders. All 4
  parent-DB code-region gaps proven frameless CODE (`func_002B6F40` FP-distance leaf, `func_002B730C`,
  `func_002B7B40`, `func_002B82E4`). Last function `func_002B88C8` `0x2B88C8..0x2B89B8`.
- **CODE→DATA boundary at `0x2B89B8`** (evidence): `func_002B88C8` returns `jr $ra`@`0x2B89B0` +
  delay `addiu $sp,0x40`@`0x2B89B4`; `0x2B89B8`/`0x2B89BC` are `0x00000000`; `0x2B89C0` begins an
  F3DEX2 display list (`E7…`). `audit_code_region` extent ends `0x2B89B4` (its last `jr $ra`); the
  +delay-slot end is `0x2B89B8`. `[0x2B89B8,0x2C1000)` has **0 valid functions / 0 `jr $ra` /
  0 prologues**. The 4-byte gap to the audit's `0x2B89B4` marker is exactly the final delay slot,
  correctly owned as code.
- DATA tail `0x2B89B8..0x2C1000` (34,376 B, 8 parts: 4 `zero_fill` + 4 `data`) — F3DEX2 display
  lists + IEEE float/double pools (π `0x400921FB54442D18`, 90.0, 60.0f, 0.5) + embedded ASCII
  `N64 PtrTablesV2\0`@`0x2B8BA0` + a small offset/size table + trailing high-entropy texture-tile
  data. **No `0x80xxxxxx` pointer tables** (so no `table_`/`jumptable_`). raw-but-classified.
  No outgoing straddler (chunk ends in data, continues into chunk 44).

Fixes: 3 slice-seam read-before-write preamble folds (`func_002B1F78`, `func_002B529C`,
`func_002B616C` — 2 had been mislabeled `straddler-tail`); 1 intra-slice preamble fold
(`func_002B1028` → `func_002B1030`, caught as a 2-word fragment by `check_boundaries`); label
normalization (5 redundant parent-boundary labels removed, 31 set to part-start name). Adversarial
swarm (6 skeptics: boundary, straddler+head, data-tail, code-s5, code-s7, code-s2s3): **5 clean +
1 real find** — code-s2s3 caught an under-split (`func_002B22A4` swallowed the frameless leaf
`func_002B24F0`@`0x2B24F0`, a signed-div-by-2 routine; the deterministic checker missed it because
the leaf has no prologue). Split applied and byte-verified; re-gated clean.

## Chunk 44 — `0x002C1000..0x002D1000` — DATA TERRITORY (no code)

Dossier `docs/dossiers/lib-chunk44-2C1000-2D1000.md`; data index
`docs/data-index/rev0/chunk44-data-region-inventory.json`; split JSON
`build/chunk_002C1000-002D1000_splits.json`.

**17 parts = 9 data + 8 zero_fill (0 code).** No incoming/outgoing straddler (data continuation
from chunk 43's `data_002BF118`). The entire 64 KiB is non-code high-entropy graphics/texture asset
data, PAST the evidenced executable extent.

Proof of non-code (across all 16,384 words): **0 `jr $ra`, 0 stack prologues
(`0x27BD8xxx..0x27BDFxxx`), 0 `0x80xxxxxx` RAM-pointer words**; no real ASCII strings (coincidental
printable bytes only); no archive/LZSS/MIO0 magic at `0x2C1000`. Entropy ~6.7–7.2 bits/byte.
Segmented at 8 real zero-fill runs (16–28 B) separating texture/graphics objects into 9 `data_`
blobs. Hypothesis (not decoded): some blocks lead with a small `0x00xxxxxx` word, plausibly a
length prefix of a compressed block. raw-but-classified.

Adversarial swarm (4 skeptics: 3 region hidden-code+structure scans + 1 tiling/classification):
**ALL clean** (hiddenCode=false, missedStructure=false across all four).

## Data accounting (Data Territory Mode)

Total data this run: **99,912 bytes** across **25 data parts** (chunk 43: 8, chunk 44: 17).
- **parsed**: 336 B (all `zero_fill` spans).
- **raw-but-classified**: 99,576 B (F3DEX2 display-list / float-double pools / high-entropy
  texture-graphics asset blobs).
- **undecoded-and-unclassified: 0 bytes.**

Index files added: 2 (`docs/data-index/rev0/chunk4{3,4}-data-region-inventory.json`). Data files
added: 25 (`asm/original/rev0/lib/{data,zero_fill}_*.s`). Format families found: F3DEX2 display
lists (GBI E7/E2/FC/D9/DF + vertex/matrix args), IEEE float32/float64 constant pools (π, 90.0,
60.0f, 0.5), embedded ASCII signature `N64 PtrTablesV2`, high-entropy texture/graphics asset data
(possibly compressed; length-prefix hypothesis), zero-fill alignment. **Exact code/data boundary:
`0x002B89B8`** (last function epilogue end; audit extent marker `0x2B89B4` = last `jr $ra`).
Next data frontier: `0x002D1000` (chunk 45).

Note: the target-range data total is **99,912 B** (`0x2B89B8..0x2D1000`), 4 B less than the
prompt's `0x2B89B4..0x2D1000 = 99,916` estimate — the 4-byte difference is the final code delay
slot at `0x2B89B4`, correctly owned as code (part of `func_002B88C8`), not data.

## Parent DB / overlay contradictions & mistakes corrected

- **`scripts/ob64_4a_audit.json` sprite-blocks REJECTED**: blocks `block_2943_0x2b13ee
  …block_2961_0x2b860e` (RGBA32/CI4) sit INSIDE byte-exact MIPS code `0x2B1030..0x2B89B4` (62 valid
  functions, `jr $ra`-dense) — scanner false positives, same family rejected for chunks 40-42 (the
  old `0x28123E`/`0x290D04` offsets recur). First plausibly-real block `block_2962_0x2b8a14` is just
  past the boundary, consistent with chunk-43/44 texture data.
- **Linear-boot RAM `0x80320Cxx` for this range REJECTED**: overlay-relocated; runtime RAM is
  ~`0x8023Cxxx` (`ob64_overlay_map.json` mission-briefing snapshots 08/09).
- **Adversarial-caught under-split** (`func_002B24F0`): a frameless leaf the analysis swarm merged
  into `func_002B22A4`; the deterministic checker can't catch a prologue-less leaf under-split, so
  the adversarial pass is load-bearing here.
- The parent function DB has **0 functions** past `0x2B89B4` in this range (the `0x594A9C` false
  positive is far outside); confirms no missed code in the tail.

## Parent workspace evidence sweep (`0x2B1000..0x2D1000`, z64 + RAM forms)

Validated leads (documentation only; names stay `func_*`): 62 valid functions `0x2B1030..0x2B89B4`
(`ob64_functions.json`, no symbolic names — structural only); mission-briefing/scenario-overview
overlay identity + runtime RAM ~`0x8023Cxxx` (`ob64_overlay_map.json`); `0x800F0000` graphics-global
table + GBI immediates accessed by in-range code (`ob64_xrefs.json`); data-tail = F3DEX2 display
lists + π/trig constants + texture tiles (direct ROM decode). Rejected: the 4a-audit sprite-blocks,
the linear `0x803xxxxx` back-map, and `ob64_nuclear_results.txt` `0x8023Cxxx` stat-byte slot-reuse
noise. Overlay caveat (RSR-001): the combat overlay sources end before `0x281000`, so chunks 43-44
are NOT covered by documented combat overlay sources; the mission-briefing overlay mapping is from
snapshots, not a linear back-map. (Full sweep report folded into the chunk-43 dossier.)

## Patch Workbench

**No new hook candidates** encountered (chunk 43 is FP/display-list overlay code + display-list/
texture data; chunk 44 is texture/asset data). The carried candidates (`0x21CD48`/`0x21BF84`,
`0x1F36F0`, RSR-011/RSR-014) are outside this range and unchanged. The code→data boundary and the
data/zero-fill spans are **static-only** — NOT proven patch space (no loader/runtime proof). No new
`docs/patch-workbench/rev0/*.json` artifact created.

## Runtime-state catalog / request log

**No runtime states were loaded or used** this run (static source ownership only).
`docs/runtime-state-requests.md` is unchanged: no IDs opened, served, or superseded. RSR-001/
RSR-011/RSR-013 remain open; RSR-014 stays satisfied (static). `RUNTIME_STATE_ONESHOT` stays `none`.

## Tooling

No tracked `tools/` JS changed. Reused gitignored helpers `build/carve_chunk.js`,
`build/combine_chunk.js`, `build/gen_data_index.js`. New gitignored helpers this run:
`build/scan_data43.js`, `build/segs_data43.js`, `build/prof_data43.js` (data structural scanners),
`build/wf_chunk43.js` (code analysis swarm), `build/wf_chunk43_adv.js` / `build/wf_chunk44_adv.js`
(adversarial swarms), `build/chunk43_data_final.json` / `build/chunk44_data_final.json` (data
tilings). Standard pipeline: `dump_function_context` → `plan_chunk` → `carve_chunk` (code 43 only)
→ `slice_chunk` → analysis swarm → `combine_chunk` → `check_boundaries`/`check_splits` → adversarial
swarm → `promote_original_mips` → `split_original_mips_part` → `gen_data_index`.

## Verification

```text
node tools/check_manifest.js                         ALL CHECKS PASS (chunk 43 = 90, chunk 44 = 17)
node tools/check_boundaries.js --splits build/chunk_002B1000-002C1000_splits.json --disasm build/original-mips/rev0/code_002B1000_002C1000.s   PASS
node tools/check_splits.js     --splits build/chunk_002B1000-002C1000_splits.json --disasm build/original-mips/rev0/code_002B1000_002C1000.s   0 fragments
node tools/check_boundaries.js --splits build/chunk_002C1000-002D1000_splits.json --disasm build/original-mips/rev0/code_002C1000_002D1000.s   PASS (0 code, 17 data)
node tools/check_splits.js     --splits build/chunk_002C1000-002D1000_splits.json --disasm build/original-mips/rev0/code_002C1000_002D1000.s   0 fragments
node tools/assemble_original_mips.js                 Exact code-region match: PASS (SHA 40D4E787..B409)
node tools/verify_setup.js                           PASS (45 composites / 5,641 files / 55 fallback)
node tools/audit_code_region.js                      OK (executable extent unchanged; no code edge into tail)
git diff --check                                     clean
```

JSON validity: the 2 new `docs/data-index/rev0/chunk4{3,4}-data-region-inventory.json` parse and
match their documented ranges. No data files carry function/true-entry wording. No
`docs/patch-workbench/rev0/*.json` created. No root/scratch artifacts are tracked (all helpers live
under gitignored `build/`).

## Files Changed

- Opening fixes (`d4d6aa5`): `AGENTS.md`, `docs/DECOMP_LOG.md`, `docs/NEXT_STEPS.md`,
  `docs/PLATFORM.md`, `docs/WORKFLOW.md`, `docs/REVIEW_2026-06-23_chunks40-42-source-ownership.md`.
- Chunk 43 (`e4cfab5`): 90 `asm/original/rev0/lib/` parts; `manifest.json`; chunk-43 dossier + data
  index; current-state docs (AGENTS/DECOMP_LOG/NEXT_STEPS/PLATFORM/WORKFLOW).
- Chunk 44 (`47e5c4f`): 17 `lib/` parts; `manifest.json`; chunk-44 dossier + data index; current-state docs.
- Review handoff (final commit): this document.

## Caveats

- Source ownership and byte-exact rebuild are proven; game-behavior names stay conservative `func_*`.
- Overlay/RAM mapping for chunk 43 (~`0x8023Cxxx` mission-briefing) is from `ob64_overlay_map.json`
  snapshots, not runtime-proven this run; chunks 43-44 are NOT in the documented combat overlay
  sources (RSR-001).
- Chunk-43 data tail and all of chunk 44 are raw-but-classified (display-list/texture/asset blobs +
  constant pools) — owned and classified, not field-decoded. The chunk-44 length-prefix is a
  hypothesis, not a proven field.
- The global non-code tail `0x002B89B4..0x0063676C` is NOT reclassified — only the target chunks'
  bytes were owned. A full-tail reclassification remains a separate, larger design.
- Static-only data/free-space findings are NOT proven patch space (no loader/runtime proof).

## Reviewer Checklist

- Confirm `asm/original/rev0/manifest.json` has contiguous parts for `0x002B1000` (90) and
  `0x002C1000` (17), total 45 chunks.
- Verify the code/data boundary: `func_002B88C8` ends `jr $ra`@`0x2B89B0`+delay@`0x2B89B4`
  (end `0x2B89B8`); `0x2B89B8` onward is data; `[0x2B89B8,0x2D1000)` has 0 `jr $ra`/0 prologues.
- Spot-check the chunk-43 data island against the index (display list @`0x2B89C0`, π pool, the
  `N64 PtrTablesV2` signature @`0x2B8BA0`, the high-entropy tail @`0x2BF118`).
- Spot-check chunk 44: all-zero `zero_fill_` parts at the 8 gaps; high-entropy `data_` parts; no
  hidden code/pointers/strings.
- Review the chunk-43 fixes: the 3 slice-seam folds, the `func_002B1028` merge, and especially the
  adversarial-caught `func_002B24F0` under-split.
- Re-run the verification commands above if touching source ownership.
- Resume at `0x002D1000` (chunk 45) — data territory; own the `data_002CBA58` continuation first.
