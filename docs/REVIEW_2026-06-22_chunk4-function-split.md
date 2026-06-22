# Review Handoff: Chunk 4 Source-Ownership / Function Split (`0x41000..0x51000`)

For the next decomp agent / reviewer. One commit (`9326e68`), static/offline,
byte-exact rebuild preserved. Chunk 4 was handled as an **overlay-relocated
function split** (contrast chunk 3's data-classification pass).

## TL;DR

- Source-owned chunk 4 (`0x00041000..0x00051000`) as **376 byte-exact parts**:
  **374 conservative code `func_*`** + **2 straddler markers**, **0 data**.
  Tracked source files **809 → 1,186**; fallback chunks 96 → 95; code SHA
  `40D4E787…B409` / ROM SHA `571E8339…CC67A` unchanged. Coverage `0x1000..0x51000`
  = 327,680 B = **11.50 %** of the evidenced executable extent — the **10 % target
  `0x000468F8` is surpassed** (was 9.20 % after chunk 3).
- Chunk 4 is **CODE-DOMINANT and OVERLAY-RELOCATED** (RAM `0x8016B198+`; the linear
  decode-comment RAM column is WRONG). All names are conservative `func_<addr>`.
- The dominant work was **frameless-leaf recovery**: the parent DB found only 165
  base functions; the swarm recovered **~211 frameless leaves** the parent DB
  hides (no `addiu $sp` prologue), including four "gap" clusters that were code,
  not data.
- MAIN goal met. Chunk 5 (`0x51000`) is the next frontier with an exact restart
  point (a `func_00050F98` straddler).

## 1. Opening corrections (required before extending)

1. **AGENTS.md** generated-fallback count `98 → 96` (a stale value; the rest of
   the file already said 96). Verified no contradictory count remained.
2. **`split_original_mips_part.js`** help text now documents `--splits-file`
   `kind`/`note`. Added honest **`straddler-head`/`straddler-tail`** header kinds
   for cross-chunk continuation parts, and a code-part **`note`** now takes
   precedence over the preamble-orphan boilerplate (the boilerplate only applies
   when a true entry precedes a parent-DB label inside the body). This removed the
   misleading "read-before-write preamble" wording that would otherwise have
   landed on every recovered frameless leaf.
3. **Build-helper decision (gitignored `build/` helpers/indexes):** PROMOTED the
   generic chunk-split pipeline to tracked tools — `tools/plan_chunk.js`,
   `tools/slice_chunk.js`, `tools/integrate_chunk.js`, `tools/check_splits.js`,
   and the manifest auditor `tools/check_manifest.js`. The chunk-specific indexers
   (`classify_chunk3.js`, `final_index_chunk3.js`, …) stay gitignored **scratch**;
   the chunk-3 dossier wording was corrected so `build/chunk3_index.json` is no
   longer presented as a durable artifact (the dossier table + tracked `.s` +
   manifest are the durable record).
4. **Recent `.s` recheck:** found and fixed a real straddler over-merge (§4) and
   neutralized a parent-DB false-positive `func_00030008:` label inside the
   chunk-2 RSP-ucode data file (`data_0002E450_rsp_ucode.s`) — byte-neutral
   comment/label change, manifest hash resynced. 0 data files now carry
   function/`true entry` wording.

## 2. Work completed — the split

Code/data oracle = the parent **overlay map** (`scripts/ob64_overlay_map.json`):
**164 loaded functions** in `0x41000..0x51000` (first `0x41098`→RAM `0x8016B198`,
last `0x50F98`→`0x8017B098`) — real RAM snapshots, so this is overlay CODE, not
data. An independent scan found **0 inline pointer-table data islands**, so the
four indirect-`jr` jump tables (`0x41098`, `0x466F4`, `0x46854`, `0x50F98`) read
their target tables from relocated RAM, not inline ROM (no `data_`/`jumptable_`
parts needed).

Pipeline: `dump_function_context` (164 records, 49 named, 13 hazards, 18 gaps) →
`plan_chunk` (165 base files) → `slice_chunk` (12 slices) → **12-agent analysis
swarm** (boundary refinement + overlay-conservative naming, validate+retry per
slice) → `integrate_chunk` (376 parts) → `check_splits` → **8-region adversarial
refutation swarm** → `split_original_mips_part`.

Composition: **374 conservative `func_*`** (overlay RAM makes any descriptive
name unverifiable) + **2 straddler markers** (see §below).

Full per-part rationale lives in each file's header `note` (e.g. "frameless leaf,
jr $ra at 0x…", "un-merged from parent 0x41098", "parent prologue fn") and in
`docs/dossiers/lib-chunk4-41000-51000.md`.

### Straddlers (both ends, handled honestly)
- **From chunk 3:** `func_00040ff4_chunk4tail` `[0x41000,0x41098)` (kind
  `straddler-tail`) is the tail of `func_00040FF4` (head `func_00040ff4_chunk3head`
  in chunk 3). First chunk-4 part.
- **Into chunk 5:** `func_00050f98_chunk4head` `[0x50F98,0x51000)` (kind
  `straddler-head`) is the head of `func_00050F98` (parent size 1268 → ends
  `0x5148C`). Last chunk-4 part; its tail (`func_00050f98_chunk5tail`
  `[0x51000,0x5148C)`) is the chunk-5 head file.

## 3. Tooling changes

- `tools/split_original_mips_part.js`: `--splits-file` documents `kind`/`note`;
  new `straddler-head`/`straddler-tail` header kinds; code `note` precedence over
  the preamble boilerplate.
- Promoted to tracked tools (were gitignored `build/` scratch): `plan_chunk.js`
  (base partition), `slice_chunk.js` (per-slice inputs for the swarm; RAM comment
  made overlay-aware), `integrate_chunk.js` (merge per-slice results into a
  validated `--splits-file`; now also propagates `kind:data`/straddler + `note`,
  and tolerates a no-straddler chunk), `check_splits.js` (adversarial fragment
  check), `check_manifest.js` (manifest integrity audit).
- Chunk-specific indexers remain gitignored scratch (re-derivable on top of the
  two tracked tools `dump_function_context.js` + `split_original_mips_part.js`).

## 4. Issues discovered

- **Chunk-3 straddler was a parent-DB OVER-MERGE.** The prior
  `func_00040f88_chunk3head` `[0x40F88,0x41000)` implied the whole span was one
  function. Disasm proves `func_00040F88` `[0x40F88,0x40FF4)` is a COMPLETE leaf
  (jr $ra `0x40FEC`, epilogue `0x40FF0`); a SEPARATE function `func_00040FF4`
  `[0x40FF4,0x41098)` is the real straddler. Re-split chunk 3 into `func_00040f88`
  + `func_00040ff4_chunk3head`; chunk 3 is now **67 parts (23 code + 44 data)**.
- **Frameless-leaf clusters masquerading as "gaps".** The four large base-partition
  gaps were NOT data — they are dense clusters of frameless leaves the parent DB
  missed: `0x420C8..0x4271C`, `0x430F4..0x43FD8` (3812 B, ~40 leaves),
  `0x4555C..0x45AE0` (25 `jr_ra`), `0x45CA8..0x45F30`. Lesson (again): the parent
  DB only detects `addiu $sp` prologues; an explicit frameless-leaf pass is
  mandatory for overlay code.
- **Delay-slot mis-cut (adversarial fix).** Region-5 reviewer caught
  `func_000484b4` ending right at its `jr $ra` `0x484B8`, **orphaning the delay
  slot `0x484BC`** (`sh $a0,0x7B08($at)`) into the next part, which then wrongly
  started on that delay slot instead of the true entry `0x484C0`. Fixed: extend
  `func_000484b4`→`0x484C0`, rename next part `func_000484bc`→`func_000484c0`.
  My deterministic checks missed it (both halves still had returns); I then added
  a **literal-last-word delay-slot-leak** check that now confirms 0 remaining.
- **Function wording inside a data file.** The chunk-2 RSP-ucode data file carried
  a parent false-positive `func_00030008:` label + "function boundary candidate"
  comment. Neutralized to an honest data-region note (byte-neutral).

## 5. Verification

Deterministic, over all 376 parts (overlay-immune where noted):
- `tools/check_splits.js` → **0 fragments** (every code part returns/jumps).
- **0 prologue-after-return under-splits** (no two prologue functions left merged).
- **0 cross-boundary PC-relative branches** (every intra-function branch stays
  inside its part — the strongest structural invariant; no function split mid-body
  and none wrongly merged).
- **0 true delay-slot leaks** (no part's last word is an un-followed
  return/branch/`j`).
- **0 inline pointer-table data islands**.

Gates:
- `node tools/check_manifest.js` → ALL CHECKS PASS (1,186 parts).
- `node tools/assemble_original_mips.js` → byte-exact (`40D4E787…B409`).
- `node tools/verify_setup.js` → **PASS** (5 composite chunks / 1,186 files / 95
  fallback; ROM SHA `571E8339…CC67A`).
- `node tools/audit_code_region.js` → OK; `git diff --check` → clean;
  `node --check` on all 6 touched tools → OK.

## 6. Files updated

- **Source:** `asm/original/rev0/manifest.json`; 376 new `asm/original/rev0/lib/*.s`
  (chunk 4); 2 new chunk-3 lib files (`func_00040f88.s`,
  `func_00040ff4_chunk3head.s`) + 1 removed (`func_00040f88_chunk3head.s`); 1
  modified chunk-2 data file; temp `code_00041000_00051000.s` promoted then removed.
- **Tools:** `split_original_mips_part.js` (modified); promoted `plan_chunk.js`,
  `slice_chunk.js`, `integrate_chunk.js`, `check_splits.js`, `check_manifest.js`.
- **Docs:** new dossier `docs/dossiers/lib-chunk4-41000-51000.md`; updated
  `docs/DECOMP_LOG.md`, `AGENTS.md`, `docs/NEXT_STEPS.md`, `docs/PLATFORM.md`,
  `docs/WORKFLOW.md`, `docs/dossiers/lib-chunk3-31000-41000.md`, and a superseded
  note on `docs/REVIEW_2026-06-21_chunk3-data-classification.md`.

## 7. Next steps

**Chunk 5 (`0x51000..0x61000`) — frontier.** FIRST continue the straddler:
`func_00050f98_chunk4head` `[0x50F98,0x51000)` continues to `0x5148C`, so the
chunk-5 head file is `func_00050f98_chunk5tail` `[0x51000,0x5148C)`. Then classify
chunk 5's code/data mix via the overlay map (code/data oracle) +
`dump_function_context --start 0x51000 --end 0x61000`; run the tracked
`plan_chunk`/`slice_chunk`/`integrate_chunk`/`check_splits` pipeline with analysis
+ adversarial swarms (conservative `func_*` for overlay code). Add a chunk-5
dossier.

Separately, the full-ROM coverage track can still reclassify the proven non-code
tail `0x002B89B4..0x0063676C` to a data source form (independent of chunk
splitting).
