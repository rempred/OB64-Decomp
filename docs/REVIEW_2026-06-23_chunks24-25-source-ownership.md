# Review Handoff: 2026-06-23 Chunks 24–25 Source-Ownership (`0x00181000..0x001A1000`)

Self-contained handoff for a fresh reviewer. Static/offline; exact byte-for-byte rebuild
preserved. Per-byte detail: `docs/dossiers/lib-chunk24-181000-191000.md`,
`docs/dossiers/lib-chunk25-191000-1A1000.md`.

## 1. Title
Review Handoff — Chunks 24 & 25 Source-Ownership, ROM z64 `0x00181000..0x001A1000`,
run date 2026-06-23.

## 2. TL;DR
- **Completed:** chunk 24 (`0x181000..0x191000`, MIXED — FP/menu/display code wrapping a large
  ~26.7 KB interior DATA region) + chunk 25 (`0x191000..0x1A1000`, CODE-dominant MIXED —
  char/class/scenario code + a shop-dialogue string pool + inline data islands), plus an opening
  cleanup/tool fix.
- **Both chunks are source-owned as code/data parts** (not "fully split into functions").
- **Chunk 24:** **63 parts** = 40 code + 23 data. Incoming + outgoing FUNCTION straddlers.
- **Chunk 25:** **71 parts** = 59 code + 12 data. Incoming + outgoing FUNCTION straddlers.
- **Tracked source files:** 2,972 → 3,035 (chunk 24) → **3,106** (chunk 25), +134.
- **Generated fallback chunks:** 76 → 75 → **74**.
- **Source-owned bytes:** chunks 0–25 = `0x1000..0x1A1000` = **1,703,936 B = 59.8039 %** of the
  2,849,204-byte evidenced executable extent.
- **Code-only classified:** **1,389,036 B (48.7517 %)** (chunk 24 +38,600 code / +26,936 data;
  chunk 25 +63,168 code / +2,368 data).
- **Exact rebuild preserved:** YES — code SHA `40D4E787…B409`, ROM SHA `571E8339…CC67A`, both
  unchanged.
- **Current frontier:** `0x001A1000` (chunk 26). Working tree clean.
- **Tooling:** fixed `tools/split_original_mips_part.js` (data parts now strip false-function
  labels). No other tool changes.

## 3. Commits (this run, newest first)
| Hash | Category | Purpose |
|---|---|---|
| `3f718c1` | review handoff | Add chunks 24–25 review handoff (this file) |
| `96a2a66` | source + docs | Source-own chunk 25 (71 parts, CODE-dominant MIXED); dossier `lib-chunk25` + data-index inventory + 3 decoded ASCII exports + doc updates |
| `bb6fff9` | source + docs | Source-own chunk 24 (63 parts, MIXED); dossier `lib-chunk24` + data-index inventory + 1 decoded UI-label export + doc updates |
| `e5f1f57` | cleanup + tool | Strip false-function labels from 2 data files (table_00177B44, zero_fill_00145204) + fix split tool to drop code labels in data parts |

## 4. Opening Fixes / Known-Issue Checks
1. **Cleanup (commit `e5f1f57`):** the chunks-22-23 review's "0 data files with function wording"
   used a narrow pattern that missed embedded `/* function boundary candidate: func_X */`
   comments + bogus `func_X:` labels (verbatim parent-disasm artifacts) in two DATA files —
   `table_00177B44.s` (chunk 23; the parent's FALSE `func_00177D20` that is actually a
   `0x80218D00` pointer run) and `zero_fill_00145204.s` (chunk 20). Root cause fixed in
   `split_original_mips_part.js` (`extractRange` now drops code labels + boundary comments for
   `kind:"data"` parts — prevents recurrence); the 2 existing files were cleaned (only
   comment/label lines removed; all `.word` bytes unchanged) and their manifest sha256/textBytes
   updated. Verified byte-exact + manifest clean.
2. **Verified (no edit needed):** review own-rows use real hashes — chunks 22-23 `4fab271`,
   chunks 20-21 `887b444`, chunks 18-19 `e1b54b1`; the chunk-23-done current-state was consistent
   (24 chunks / 2,972 files / 76 fallback / frontier `0x00181000`); `scratch/README.md` is the
   intentional gitignore-keeper (not a scratch artifact); no other root scratch tracked.

## 5. Work Completed

### Chunk 24 (`0x181000..0x191000`), MIXED — 63 parts (40 code + 23 data)
| Region | Range | Bytes | Class | Parts |
|---|---|---:|---|---:|
| CODE 1 (FP/menu/display) | `0x181000..0x1822E4` | 4,836 | code | 13 |
| DATA (interior; bitmaps + record tables + pointer tables + float pool) | `0x1822E4..0x188B60` | 26,748 | data | 22 |
| CODE 2 (char/display) + inline island + outgoing straddler | `0x188B60..0x191000` | 33,952 | code+1 island | 28 |
- Incoming FUNCTION straddler-tail `func_0017FF4C_chunk24tail [0x181000,0x181118)` (jr$ra@0x181110;
  combat_transition lead). Outgoing FUNCTION straddler-head `func_0018FB30 [0x18FB30,0x191000)`
  (jr$ra at 0x19116C in chunk 25). The huge `func_00189778` (8788 B) is one prologue + one return
  (the parent's "9028 B orphan"). 15 preamble-orphans incl. a ~15-word hoisted-const preamble
  (`func_0018197C`, adversarially confirmed a single function).
- **Interior DATA region:** font/tile bitmap stream + packed/high-entropy blocks + two
  **fixed-stride record tables** (`data_00185950` 363×0x10, `data_00187000` 177×0x10; invariant
  cols `0xFFFB0000`@+4 / `0xFFFFFFFF`@+0xC) + two `0x8021`-band RAM-pointer tables
  (`table_00187B10` 16 ptrs, `table_001888D8` 140 ptrs) + a 10-double `float_00188B10` pool +
  the inline island `data_0018F044` (UI labels "Soldier"/"Remove" + pointer mini-table).

### Chunk 25 (`0x191000..0x1A1000`), CODE-dominant MIXED — 71 parts (59 code + 12 data)
| Region | Range | Bytes | Class | Parts |
|---|---|---:|---|---:|
| CODE 1 (char/class/scenario; record-builder; dispatcher) | `0x191000..0x19BFF0` | 44,016 | code (+2 inline islands) | 52 |
| DATA (shop-dialogue string pool + handler-pointer tables) | `0x19BFF0..0x19C760` | 1,904 | data | 10 |
| CODE 2 (+ outgoing straddler) | `0x19C760..0x1A1000` | 18,592 | code | 9 |
- Incoming FUNCTION straddler-tail `func_0018FB30_chunk25tail [0x191000,0x191174)` (jr$ra@0x19116C).
  Outgoing FUNCTION straddler-head `func_001A0264 [0x1A0264,0x1A1000)` (parent end ~0x1A11F8).
- **`func_0019554C`** = the parent-documented, **in-game-proven record-builder** (runtime hook at
  `0x195584`, inside the function, builds a 52-byte enemy record from an enemydat template; name
  kept conservative). `func_001960A8` (5,776 B) char/class hub; `func_001977E0` (4,580 B)
  dispatcher (preamble-orphan, internal `jr $v0`).
- **Data:** shop-dialogue string pool (`rodata_0019BFF0`, 47 strings: "What's today's special?"
  etc., with `{T05}` tokens) + six handler/jump-pointer tables (0x8021/0x8016 band, NOT string
  pointers) + two inline islands (`data_001952E8` UI labels; `data_00197738` debug strings "No
  free space on TCharacterEnemyData."/"…EnemySolderData.", sic).

## 6. Parent DB / Overlay Contradictions & Corrections
- **HEADLINE (chunk 24): the parent functions DB again MISSED a large interior data region** —
  `0x1822E4..0x188B60` (~26.7 KB), labeling code throughout. Byte-exact proret scan + 3 adversarial
  data verifiers (each scanning every word) confirm **0 prologues / 0 `jr$ra`**. Same failure mode
  as chunk 19's and chunk 23's data islands. The parent's `func_00189778` "9028 B orphan" is, by
  contrast, genuine code.
- **Chunk 25 contrast:** the parent DB did NOT mislabel large data here — chunk 25 is genuinely
  code-dominant; the data is one string pool + two small inline islands.
- **Address-space:** overlay-relocated; runtime `0x8021/0x8022` band. `symbols_v2 ram=` is the
  WRONG linear back-map. The chunk-25 record-builder `0x19554C` is referenced by raw ROM address
  in parent docs (boot/always-resident-style), not an overlay slot.
- **Parent leads adopted as LEADS only (names stay `func_*`):** `0x181118` (combat_transition
  context); `0x19554C` record-builder (documented + proven in-game; the strongest lead this run);
  `0x1977E8` dispatcher; `0x1960A8`/`0x1A0264` char/class hubs.
- **Adversarial:** chunk 24 → 6 verifiers all CLEAN (only 1 LOW cosmetic note, no re-tiling).
  chunk 25 → 6 verifiers, **0 boundary moves**; LOW fixes only (2 note ASCII transcriptions, a
  stale `file` field, string-pool tables reclassified as handler-pointer arrays).
- **Overlay invariants:** `jr $reg`/`jr $v0` are jump-table dispatch (internal); `j 0x801/0x802`
  are overlay tail-jumps (internal); FP instructions are code.

## 7. Straddler Refinements
- **Chunk 23 → 24:** `func_0017FF4C` continues as `func_0017FF4C_chunk24tail [0x181000,0x181118)`
  (jr$ra@0x181110 + delay `addiu $sp,0x88`, matching the `-0x88` prologue in chunk 23). CODE.
- **Chunk 24 → 25:** `func_0018FB30 [0x18FB30,0x191000)` (prologue `addiu $sp,-0x78`) continues as
  `func_0018FB30_chunk25tail [0x191000,0x191174)` (jr$ra@0x19116C + delay `addiu $sp,0x78`). CODE.
- **Chunk 25 → 26:** `func_001A0264 [0x1A0264,0x1A1000)` (prologue `addiu $sp,-0x88`) — 0 `jr$ra`
  before `0x1A1000`; continues into chunk 26 (parent end ~`0x1A11F8`). **Chunk-26 first action:
  emit `func_001A0264_chunk26tail` and confirm its `jr$ra`.** CODE, not data.
- Note: 4 cross-slice preamble-orphans were folded forward across slice seams this run
  (chunk 24: `func_00181B54`, `func_0018BAB4`, `func_0018DC84`; chunk 25: `func_00191E50`,
  `func_0019AF78`), plus name/label fixes — all because the proret scan flags the inner `addiu $sp`
  prologue while the true entry is a short read-before-write preamble before it.

## 8. Data Classification & Decode/Export Outputs (Data Territory)
- **Chunk 24 — 26,936 B in 23 parts** (`docs/data-index/rev0/chunk24-data-region-inventory.json`).
  By class: packed/record/unknown 24,980 B · RAM-pointer tables 1,824 B · IEEE-754 const 80 B ·
  zero-fill 52 B. **Parsed:** 2 fixed-stride record tables (row count + stride + invariant cols),
  2 `0x8021` pointer tables, the float64 pool, the UI-label rodata. **Raw-but-classified:** font/
  tile bitmap stream + packed/high-entropy blocks (possibly compressed/graphics). **Undecoded:**
  record-table field semantics; bitmap pixel layout; packed-blob contents.
- **Chunk 25 — 2,368 B in 12 parts** (`docs/data-index/rev0/chunk25-data-region-inventory.json`).
  By class: ASCII strings 1,176 B · RAM-pointer tables 632 B · packed/unknown 548 B · zero-fill
  12 B. **Parsed:** all 3 ASCII pools (decoded byte-exact) + the pointer tables (by band).
  **Raw-but-classified:** small value/fill blocks. **Undecoded:** handler-pointer-array targets
  (overlay-relocated).
- **Index files added (5):** `chunk24-data-region-inventory.json`, `chunk24-ui-labels-18F044.json`;
  `chunk25-data-region-inventory.json`, `chunk25-dialogue-pool-19BFF0.json`,
  `chunk25-ui-labels-1952E8.json`, `chunk25-debug-strings-197738.json` (6 total).
- **Decoded ASCII exports added (4):** `data/decoded/rev0/strings/chunk24-ui-labels-18F044.md`,
  `chunk25-dialogue-pool-19BFF0.md`, `chunk25-ui-labels-1952E8.md`, `chunk25-debug-strings-197738.md`.
  All derive byte-exactly from the disasm (control codes preserved, not normalized).
- **Format families found:** font/tile bitmaps; fixed-stride record tables (363×0x10, 177×0x10);
  RAM-pointer / handler-pointer tables (0x8016/0x8021/0x8022 band); IEEE-754 float64 pools; UI-label
  + debug-string + shop-dialogue rodata (with `{C6}`/`{C0}`/`{T05}` tokens); packed/high-entropy
  blobs (possibly compressed).
- **Total data bytes source-owned this run:** 29,304 (26,936 + 2,368). **Exact next data frontier:**
  none pending — the chunk-25→26 straddler is CODE (`func_001A0264`).

## 9. Tooling Changes
- **Fixed** `tools/split_original_mips_part.js`: `extractRange` now drops `/* function boundary
  candidate: */` comments and `name:` labels from the body of `kind:"data"` parts (they are
  false-function artifacts from the verbatim parent disasm). Prevents recurrence of the
  data-file-with-function-wording defect. `node --check` clean.
- Reused `tools/decode_rodata_strings.js` (ASCII pools) + gitignored build helpers
  (`build/combine_chunk.js`, `build/scan_chunk.js`, `build/slice_extract.js`, the
  `wf_chunk2{4,5}_*.js` workflows).

## 10. Verification (commands + key output)
- `node --check tools/split_original_mips_part.js` → clean.
- `node tools/check_manifest.js` → **ALL CHECKS PASS** (26 chunks, 3,106 parts).
- `node tools/check_boundaries.js --splits build/chunk_00181000-00191000_splits.json --disasm build/original-mips/rev0/code_00181000_00191000.s` → **PASS** (63 parts; 0 of each).
- `node tools/check_boundaries.js --splits build/chunk_00191000-001A1000_splits.json --disasm build/original-mips/rev0/code_00191000_001A1000.s` → **PASS** (71 parts; 0 of each).
- `node tools/check_splits.js …` (both chunks) → 0 true fragments (small files are real leaves with returns).
- Adversarial: chunk 24 → 6 verifiers all CLEAN; chunk 25 → 6 verifiers, 0 boundary moves. Both data-island sets confirmed 0 prologues/returns.
- Every byte `0x181000..0x1A1000` assigned to a tracked code/data part (no gaps/overlaps).
- `node tools/rebuild_from_source_manifest.js` → **Exact byte match: PASS** (ROM SHA `571E8339…CC67A`).
- `node tools/assemble_original_mips.js` → **Exact code-region match: PASS**, code SHA `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- `node tools/verify_setup.js` → **PASS**: 26 tracked composite chunks, **3,106** tracked files, **74** fallback; ROM SHA `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
- `node tools/audit_code_region.js` → `no-credible-code-edge-into-tail` (executable extent unchanged).
- 0 data files with function/true-entry/"boundary candidate" wording; 0 root scratch tracked; all `docs/data-index/rev0/*.json` parse.
- `git diff --check` → clean.

Summary numbers: **tracked chunks 26 · tracked files 3,106 · fallback 74 · code SHA
`40D4E787…B409` · ROM SHA `571E8339…CC67A` · frontier `0x001A1000`.**

## 11. Files Changed
- **Source `.s` (added):** 63 (chunk 24) + 71 (chunk 25) = 134 under `asm/original/rev0/lib/`.
  **Removed:** temp whole-chunk `code_00181000_…s` / `code_00191000_…s` (`--remove-source`).
  **Cleaned (opening):** `table_00177B44.s`, `zero_fill_00145204.s`.
- **Manifest:** chunk count 24→26, total parts 2,972→3,106 (+ sha256 fixes for the 2 cleaned files).
- **Tools:** `tools/split_original_mips_part.js` (data-part label stripping).
- **Data indexes:** 6 new under `docs/data-index/rev0/` (2 inventories + 4 decoded-string indexes).
- **Decoded exports:** 4 new under `data/decoded/rev0/strings/`.
- **Docs:** new `docs/dossiers/lib-chunk24-181000-191000.md`, `lib-chunk25-191000-1A1000.md`;
  this review; updated `AGENTS.md`, `docs/DECOMP_LOG.md`, `docs/NEXT_STEPS.md`,
  `docs/PLATFORM.md`, `docs/WORKFLOW.md`.

## 12. Current Frontier
- **Next ROM address:** `0x001A1000` (chunk 26, `0x1A1000..0x1B1000`).
- **First required action:** continue the OUTGOING **FUNCTION** straddler — `func_001A0264`
  `[0x1A0264,0x1A1000)` has its `addiu $sp,-0x88` prologue in chunk 25 and continues into chunk 26
  (parent end ~`0x1A11F8`). Emit `func_001A0264_chunk26tail` first and confirm its `jr$ra`. Then
  content-scan/classify the rest (do NOT assume all code — chunks 24-25 both had interior data).

## 13. Unresolved Caveats
- **Conservative code names:** all new functions are `func_<addr>`; overlay relocation (runtime
  `0x8021/0x8022`) makes RAM/global/callee identity SUSPECT. LEADS recorded (record-builder
  `0x19554C`, dispatcher `0x1977E0`, combat_transition context `0x181118`) but not adopted.
- **Chunk-24 interior data:** font/tile bitmap pixel layout, the two record tables' field
  semantics, and the packed/high-entropy blocks (possibly compressed) are undecoded.
- **Chunk-25 handler-pointer tables:** the `0x8016/0x8021`-band targets are overlay-relocated and
  not back-mappable to ROM here; their dispatch semantics are undecoded.
- **Linear-map fallacy:** any future RAM→ROM mapping from a runtime trace must be validated against
  byte-exact Rev 0 (prologue/return presence), never `ROM = RAM − 0x8006FC00` for overlay code.
  The chunk-24 interior data region is a fresh example of the parent DB getting code/data wrong.

## 14. Bridge Compatibility
The `run_complete` ping for this run **includes `reviewDoc =
'docs/REVIEW_2026-06-23_chunks24-25-source-ownership.md'`** in the payload, fixing the chunks-22-23
omission that forced a `review_complete` recovery handoff. runSlug `chunks24-25-00181000-001A1000`,
frontier `0x001A1000`.

## 15. Reviewer Checklist
- [ ] `git status --short --branch` → clean `## main`; `git log --oneline -6` shows the
  review-handoff commit, `96a2a66`, `bb6fff9`, `e5f1f57`.
- [ ] `node tools/check_manifest.js` → ALL CHECKS PASS (26 chunks / 3,106 parts).
- [ ] `node tools/rebuild_from_source_manifest.js` → byte-exact (ROM `571E8339…CC67A`);
  `node tools/assemble_original_mips.js` → byte-exact (code `40D4E787…B409`);
  `node tools/verify_setup.js` → PASS (26 / 3,106 / 74).
- [ ] Chunk 24 spot-check: `func_0017FF4C_chunk24tail.s` (incoming straddler); confirm the interior
  region `[0x1822E4,0x188B60)` has 0 prologues/returns; `data_00185950.s`/`data_00187000.s` (the
  363×0x10 / 177×0x10 record tables, no function wording); `table_001888D8.s` (140 0x8021D
  pointers); `func_0018FB30.s` (outgoing straddler-head, no `jr$ra`).
- [ ] Chunk 25 spot-check: `func_0018FB30_chunk25tail.s` (incoming straddler-tail); `func_0019554C.s`
  (record-builder, conservative name, hook @0x195584 inside); `rodata_0019BFF0.s` (shop dialogue)
  + its decoded MD; `func_001A0264.s` (outgoing straddler-head, no `jr$ra`, label = own name).
- [ ] Confirm docs/counts: AGENTS / DECOMP_LOG / NEXT_STEPS / PLATFORM / WORKFLOW all say
  26 chunks / 3,106 files / 74 fallback / frontier `0x001A1000`.
- [ ] Confirm the 6 chunk-24/25 data-index JSONs parse; the 4 decoded exports derive from the
  disasm; 0 data files with function wording (incl. the opening cleanup of `table_00177B44.s`).
- [ ] Confirm next frontier `0x001A1000` and the `func_001A0264` CODE-straddler first-action.
