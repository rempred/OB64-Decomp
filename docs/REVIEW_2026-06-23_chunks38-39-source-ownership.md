# Review Handoff: Rev 0 Chunks 38-39 Source Ownership

Date: 2026-06-23

Range covered: `0x00261000..0x00281000`

Final frontier: `0x00281000` (clean — chunk 39 ends in data, no outgoing straddler)

## Commits in this run

- `6cbd7b9` — `Fix chunks36-37 review handoff commit table` (opening cleanup fix; doc only)
- `0f7268f` — `Source-own Rev0 chunk 38 (0x261000..0x271000)`
- `ab35613` — `Source-own Rev0 chunk 39 (0x271000..0x281000) + advance current-state docs`
- `Add chunks 38-39 review handoff` — this document, committed as the run's final commit
  (its own hash is recorded in the run's final report / bridge ping).

## Outcome

Chunks 38 and 39 are source-owned as tracked code/data parts. Chunk 38 is **ALL CODE**; chunk 39
is **MIXED** (source-owned as code/data parts — NOT "fully split into functions"). No byte in
either chunk remains in generated fallback ownership. Both chunks rebuild byte-exactly.

Current source mix (from `verify_setup` / `assemble_original_mips`):

- **40** tracked real-assembler composite chunks.
- **5,044** tracked original-MIPS source files (177 `boot/` + 4,867 `lib/`).
- **60** generated fallback chunks.
- Source-owned bytes: **2,621,440** (`0x00001000..0x00281000`) = **92.0060%** of the evidenced
  executable MIPS extent (`0x00001000..0x002B89B4`, 2,849,204 bytes).
- Code-only classified bytes: **2,224,904** = **78.0888%** of that extent.
- Cumulative data bytes (chunks 0–39): 396,536 (chunk 38 added 0; chunk 39 added 7,556).

Code-region SHA256 `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409` (unchanged);
full ROM SHA256 `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

Next run starts at `0x00281000` (chunk 40). There is **no incoming straddler** — chunk 39 ends in
DATA C (tail small-int LUT + zero-fill). First action: classify the start of `0x00281000` (content
scan + return/prologue scan); do not assume code.

## Opening Fixes

- Fixed the chunks36-37 review handoff commit table: replaced the `(this document)` placeholder
  with the real review-handoff hash `950e823` (`6cbd7b9`).
- Confirmed coordinator template commit `05acdfc` (optional three-chunk prompts) is applied; this
  run is intentionally two chunks. Not reverted.
- Confirmed the chunks36-37 outgoing straddler `func_00260F30` before splitting: it begins at z64
  `0x00260F30` in chunk 37, has no `jr $ra` before `0x00261000`, and was emitted first in chunk 38
  as `func_00260F30_chunk38tail` `[0x00261000,0x0026109C)` (returns `jr $ra`@`0x00261094`).
- Did NOT rerun the combat-state one-shot (RSR-014 is satisfied as a static examination); no new
  current-range evidence created a runtime-state request, so `RUNTIME_STATE_ONESHOT` stayed `none`.
- Hygiene reconfirmed: root tracked files are only `.gitattributes/.gitignore/AGENTS.md/README.md`;
  no DATA file carries function-boundary/true-entry wording; new JSON parses. Also corrected stale
  current-state prose in `AGENTS.md` (the "Assembly-Backed Code Rebuild" block still said
  "next is chunk 34" / "fallback chunks: 66" → now chunk 40 / 60).
- Carried-forward caveats from chunks 36-37 remain: overlay/RAM mapping for this mission-briefing/
  combat overlay is runtime-proof work; interior data islands are classified but not fully
  semantically decoded; static-only patch-workbench findings stay `candidate`/`needs-runtime`.

## Chunk 38 — `0x00261000..0x00271000` — ALL CODE

- Dossier: `docs/dossiers/lib-chunk38-261000-271000.md`
- Split JSON: `build/chunk_00261000-00271000_splits.json`
- No data index (all code).

Classification: **232 parts** = 230 normal code + 1 straddler-tail + 1 straddler-head + 0 data.

Region/boundary facts:

- Incoming straddler-tail `func_00260F30_chunk38tail` `0x00261000..0x0026109C` (jr$ra@0x00261094).
- CODE `0x0026109C..0x00270FF0` — ~230 functions: FP/GBI display-list builders (GBI command
  immediates via the `0x800F9BA0` cursor) + mission-briefing/combat dispatchers; frameless-leaf dense.
- Outgoing straddler-head `func_00270FF0` `0x00270FF0..0x00271000` (no `jr $ra` before `0x00271000`;
  continues into chunk 39, returns there `jr $ra`@`0x00271068`).

Content scan + boundary gates confirmed **no data island**. The two large parent "gaps" are
frameless CODE: 288 B@`0x2639D8` (GBI display-list builder `func_002639E0` + preamble-fold
`func_00263AF0`) and 796 B@`0x2664A4` (switch-dispatch leaf `func_002664B0` + `func_00266550`);
also 96 B@`0x264FB4` (`func_00264FC0`).

Adversarial result (6 code skeptics): 3 HIGH fixed, 3 clean. (1) `func_00261C90` over-ran a
read-before-write preamble → split `func_00261D00` (preamble `lui $a0,0x8022`/`lw 0xD58` consumed
live by `jal 0x800712C4`). (2) `func_00263050` was a 4-way over-merge → un-merged into
`func_00263050`/`func_00263074`/`func_002630CC`/`func_00263120` (a `0x8022.0DA0`/`0DA8` slot-table
accessor family). (3) `func_00267038`/`func_00267108` boundary misplaced → moved the 4-word
read-before-write preamble `[0x267108,0x267118)` to `func_00267108`. All verified against raw bytes.

## Chunk 39 — `0x00271000..0x00281000` — MIXED (3 code regions + 3 data islands)

- Dossier: `docs/dossiers/lib-chunk39-271000-281000.md`
- Data index: `docs/data-index/rev0/chunk39-data-region-inventory.json`
- Split JSON: `build/chunk_00271000-00281000_splits.json`

Classification: **155 parts** = 135 normal code + 1 straddler-tail + 0 straddler-head + 19 data.
The most interleaved chunk so far (the parent "gaps" mix DATA and frameless CODE within one gap).

ROM-ordered region map:

- Incoming straddler-tail `func_00270FF0_chunk39tail` `0x00271000..0x00271070` (jr$ra@0x00271068).
- CODE R1 `0x00271070..0x00273FFC` (ends jr$ra@0x00273FF4).
- **DATA A** `0x00273FFC..0x00275850` (6,228 B, 12 parts).
- CODE R2 `0x00275850..0x00279DA8` (frameless band `0x275850..0x275C9C` + dispatchers; ends jr$ra@0x00279DA0).
- **DATA B** `0x00279DA8..0x0027A020` (632 B, 1 part).
- CODE R3 `0x0027A020..0x00280D48` (functions + frameless GBI/FP builders; ends jr$ra@0x00280D40).
- **DATA C** `0x00280D48..0x00281000` (696 B, 6 parts). Chunk ends in data; frontier `0x00281000` clean.

### Data accounting (Data Territory Mode)

Total data: **7,556 bytes** (19 parts). By class: data 4,888 · table 2,072 · jumptable 244 ·
float 64 · zero_fill 288. Parsed/classified bytes: 7,556 (0 undecoded-and-unclassified). Two
packed display-list blobs (`data_00274a90`, `data_00279da8`) are **raw-but-classified** (byte-owned
and typed, not fully field-decoded); the rest (pointer tables, jump table, float64 pool, small-int
LUTs, zero-fill) are parsed. Data files added: 19. Index files added: 1
(`chunk39-data-region-inventory.json`). Next data frontier: `0x00281000` (chunk 40, unknown shape).

Format families found: RAM-pointer tables (`0x8021Fxxx`/`0x8022xxxx`), an overlay handler pointer
table (`0x8020E6A4..0x8020E770`), a 0x20-stride jump table (8 rows, `0x80214xxx..0x8021Exxx`), a
float64 const pool (pi-like double / 3.0 / 180.0 — angle/scale math), a static GBI/F3DEX2
display-list asset (E7/E3/D9/E2/D7/DF command words), small-int LUTs, and 640/480 screen-dimension
records.

Adversarial result (4 code + 3 data skeptics): **all 7 structurally CLEAN** — no boundary/tiling
changes. Only 4 LOW note-text accuracy fixes applied (jump-table row description, float-pool
"pi-like" labeling, a small-int-LUT byte-count, a stale "Slice end." note). check_splits flagged 6
TINY parts (8-12 B), all verified real frameless leaf accessors (0 fragments).

## Parent DB / Overlay Contradictions & Mistakes Corrected

- **Interleaved DATA+CODE in parent gaps (chunk 39):** the parent gap `0x273FFC..0x275C9C` is DATA
  `0x273FFC..0x275850` then frameless CODE; the parent gap `0x279DA8..0x27A06C` is DATA
  `0x279DA8..0x27A020` then frameless CODE. The small parent gaps at `0x27B1B4` (frameless,
  `j 0x80226B54`), `0x27D050` (frameless GBI builder), `0x2804D4` (frameless FP), and `0x275DC4`
  (frameless-leaf cluster) are CODE, not data. All boundaries re-derived from byte-exact disasm.
- **Chunk 38 parent over-merge + missed preambles:** `func_00263050` over-merged 4 functions;
  `func_00261D00` / `func_00267108` preambles were mis-attached to the previous function.
- `build/carve_chunk.js` (already multi-region from chunks 36-37) carved chunk 39's 3 interior data
  islands; its synthetic-leading-entry logic handled the two code regions that begin in frameless
  code (`func_00275850`, `func_0027A020`).

## Parent Workspace Evidence Sweep

Searched parent `C:\Users\Joe\Projects\OgreBattlel64` for `0x261000..0x281000` (z64 + RAM forms +
overlay tail-jump/global targets). Findings (documentation only; names stay `func_*`):

- **Chunk 38:** no specific parent doc leads — consistent with overlay display-list/dispatcher code.
  `scripts/ob64_callgraph.json` lists function offsets in range with no semantic labels.
- **Chunk 39:** ROM `0x0027ADD4` (`docs/neutral-encounter-mips.md`) is a UI/message record builder
  with a duplicate ROM copy at `0x000EC838` (chunk 14), allocating into the `0x800E8350` record
  pool — naming lead only. ROM `0x00278F90` (`ram_snapshots/overlay_sources.json`) is a "combat
  high-slot" overlay source → RAM `0x80224800` (delta `0x7FFAB870`, size `0x3C00`) — a concrete
  overlay-mapping data point for the C3 code, applies only to this span (overlay relocation is NOT
  linear), still `needs-runtime` proof (RSR-001).

Rejected / false matches:

- `0x026261xx` "bounds records" (`docs/enemy-system.md`) — the real address is `0x02626191`
  (~39.9 MB, ROM data tail), NOT `0x0026_2xxx`; out of range.
- Linear-map decode-comment RAM values (`0x802Dxxxx`/`0x802Exxxx`) — not runtime RAM.

## Patch Workbench

**No new hook candidates** were naturally encountered (chunks 38-39 are display-list/dispatcher
code + display-list/table data; no streamsplit/attack-buffer hook sites in range). The carried
combat hook candidates (`0x21CD48`, `0x21BF84`, `0x1F36F0`) are outside this range and unchanged
(`candidate`/`needs-runtime`, RSR-011/RSR-014). No static-only finding was upgraded to `proven`.
No new `docs/patch-workbench/rev0/*.json` artifact was created.

## Runtime-State Catalog / Request Log

No runtime states were loaded or used this run (static source ownership only). The runtime-state
request log `docs/runtime-state-requests.md` is unchanged: no IDs opened, served, or superseded.
RSR-001/RSR-011/RSR-013 remain open runtime-proof requests; RSR-014 stays satisfied (static
examination). The chunk-39 overlay-mapping lead (`0x278F90`→`0x80224800`) is recorded in the
chunk-39 dossier under RSR-001's umbrella but did not require a new request.

## Tooling

No tracked `tools/` JS changed. Reused gitignored helpers `build/carve_chunk.js`,
`build/combine_chunk.js`, `build/gen_data_index.js`. New gitignored per-chunk swarm scripts:
`wf_chunk38.js`/`wf_chunk38_adv.js`/`wf_chunk39.js`/`wf_chunk39_adv.js`. Standard pipeline
(`dump_function_context`/`plan_chunk`/`carve_chunk` → `slice_chunk` → analysis swarm →
`combine_chunk` → `check_boundaries`/`check_splits` → adversarial swarm → `promote_original_mips` →
`split_original_mips_part`).

## Verification

```text
node tools/check_manifest.js                         ALL CHECKS PASS (chunk 38=232, chunk 39=155)
node tools/check_boundaries.js --splits build/chunk_00261000-00271000_splits.json --disasm build/original-mips/rev0/code_00261000_00271000.s   PASS (0 fragment/cross/under/leak/straddler/data-island)
node tools/check_splits.js     --splits build/chunk_00261000-00271000_splits.json --disasm build/original-mips/rev0/code_00261000_00271000.s   0 fragments
node tools/check_boundaries.js --splits build/chunk_00271000-00281000_splits.json --disasm build/original-mips/rev0/code_00271000_00281000.s   PASS (0 fragment/cross/under/leak/straddler/data-island)
node tools/check_splits.js     --splits build/chunk_00271000-00281000_splits.json --disasm build/original-mips/rev0/code_00271000_00281000.s   0 fragments (9 <=12B files, all real leaves)
node tools/assemble_original_mips.js                 Exact code-region match: PASS (SHA 40D4E787..B409)
node tools/verify_setup.js                           PASS (40 composites / 5,044 files / 60 fallback)
node tools/audit_code_region.js                      OK (executable extent unchanged; no code edge into tail)
git diff --check                                     clean
```

JSON validity: `docs/data-index/rev0/chunk39-data-region-inventory.json` parses (19 parts, 7,556
bytes) and matches the ranges documented here. No data files carry function/true-entry wording. No
root scratch artifacts are tracked.

## Files Changed

- Opening cleanup (`6cbd7b9`): `docs/REVIEW_2026-06-23_chunks36-37-source-ownership.md`.
- Chunk 38 (`0f7268f`): 232 `asm/original/rev0/lib/` parts; `manifest.json`;
  `docs/dossiers/lib-chunk38-261000-271000.md`; current-state docs (`AGENTS.md`, `DECOMP_LOG.md`,
  `NEXT_STEPS.md`, `PLATFORM.md`, `WORKFLOW.md`).
- Chunk 39 (`__CHUNK39__`): 155 `asm/original/rev0/lib/` parts; `manifest.json`;
  `docs/dossiers/lib-chunk39-271000-281000.md`; `docs/data-index/rev0/chunk39-data-region-inventory.json`;
  current-state docs (`AGENTS.md`, `DECOMP_LOG.md`, `NEXT_STEPS.md`, `PLATFORM.md`, `WORKFLOW.md`).

## Caveats

- Source ownership and byte-exact rebuild are proven; game-behavior names remain conservative
  `func_*` unless backed by runtime/mutation evidence.
- Overlay/RAM mapping for this mission-briefing/combat overlay still needs runtime proof
  (RSR-001/RSR-013/RSR-014); the chunk-39 `0x278F90`→`0x80224800` overlay mapping is a static
  parent-artifact data point, not runtime-confirmed.
- Chunk 39's packed display-list blobs (`data_00274a90`, `data_00279da8`) are classified but not
  fully field-decoded (raw-but-classified); pointer/jump tables, float pools, LUTs, and zero-fill
  are decoded.
- `func_00270FF0` (chunk 38 outgoing straddler) is owned across the chunk 38/39 boundary as
  `func_00270FF0` (head) + `func_00270FF0_chunk39tail`; its return is at `0x00271068` in chunk 39.

## Reviewer Checklist

- Confirm `asm/original/rev0/manifest.json` has contiguous parts for `0x00261000` (232) and
  `0x00271000` (155).
- Chunk 38: spot-check the 3 adversarial fixes (`func_00263050` un-merge → 4; `func_00261D00` and
  `func_00267108` preamble folds) and the two big parent-gap frameless recoveries (`func_002639E0`,
  `func_002664B0`).
- Chunk 39: spot-check the 3 data islands against the data-index JSON (DATA A pointer/jump/float64
  tables; DATA B GBI blob; DATA C small-int LUTs + 640/480 records) and the frameless-code starts
  of code regions R2 (`func_00275850`) and R3 (`func_0027A020`).
- Re-run the verification commands above if touching source ownership.
- Resume at `0x00281000` (chunk 40). No incoming straddler — classify the start (content +
  return/prologue scan) before splitting; do not assume code.
