# Review Handoff: 2026-06-22 Chunk 8 Source-Ownership — straddler/code/data/code mixed (`0x00081000..0x00091000`)

Self-contained handoff for a fresh reviewer. Static/offline; exact byte-for-byte
rebuild preserved. Per-byte detail: `docs/dossiers/lib-chunk8-81000-91000.md`.

## 1. Title
Review Handoff — Chunk 8 Source-Ownership, ROM z64 `0x00081000..0x00091000`
(chunk 9 of the 64 KiB grid; "chunk 8" in 0-based numbering), run date 2026-06-22.

## 2. TL;DR
- **Completed:** source-owned chunk 8 (`0x00081000..0x00091000`, 65,536 B) as code
  and data parts (a three-region MIXED chunk: straddler+code → data → code).
- **Composition:** **87 parts** = **61 code `func_*` + 2 straddler markers + 24 data**.
  - straddler markers: 1 `straddler-tail` (incoming) + 1 `straddler-head` (outgoing).
  - 24 data = **9 `data_` + 4 `rodata_` + 7 `table_` + 4 `zero_fill_`** (0 `jumptable_`/`rsp_ucode_`).
- **Tracked source files:** 1,455 → **1,542** (+87).
- **Generated fallback chunks:** 92 → **91** (−1).
- **Source-owned bytes:** chunks 0–8 = `0x1000..0x91000` = **589,824 B = 20.70 %**
  of the 2,849,204-byte evidenced executable MIPS extent (`0x1000..0x2B89B4`).
- **Code-only classified:** ≈ **459,036 B (16.11 %)** (chunk 8 contributes 58,904 B
  code/straddler vs 6,632 B data; the data block is significant, so code-only is tracked).
- **Exact rebuild preserved:** YES — code SHA `40D4E787…B409`, full ROM SHA
  `571E8339…CC67A`, both unchanged.
- **Current frontier:** `0x00091000` (chunk 9). Working tree clean.
- **No tool changes this chunk** (the chunk-7 `sanitizeComment` fix already covers
  the data-note `*/` hazard; chunk 8 needed no further tooling).

## 3. Commits (this run, newest first)
| Hash | Category | Purpose |
|---|---|---|
| _(this doc)_ | review handoff | Add chunk 8 review handoff doc (final commit) |
| `1dbe673` | source + docs | Source-own chunk 8 (87 parts); dossier `lib-chunk8` + AGENTS/DECOMP_LOG/NEXT_STEPS/PLATFORM/WORKFLOW count updates |

No opening-cleanup commit this run (root tree was already clean; no stale-count or
tool fixes were needed before splitting — only the in-flight doc count sweep, which
is folded into `1dbe673`).

(Prior context, NOT part of this run: `f185640` Codex bridge-template update;
`53e4027`/`1a52020` chunk-7 review handoff; `3cdc52a` chunk-7 source.)

## 4. Opening Fixes (done before chunk-8 splitting)
None required. Before starting, I confirmed: working tree clean at the chunk-7
review HEAD; 0 root scratch artifacts tracked; manifest integrity PASS; no stale
current-state count needed correcting at the *start* of the run. (Two
current-state lines — `docs/DECOMP_LOG.md` "Current Invariants" and
`docs/WORKFLOW.md` line 101 — still pointed at the chunk-7 totals and were updated
as part of the chunk-8 doc sweep in `1dbe673`, not as a separate cleanup commit.)

## 5. Work Completed — chunk 8 (`0x00081000..0x00091000`), MIXED, three ROM-ordered regions

| Region | Range (z64) | Bytes | Class | Parts | Parent DB |
|---|---|---:|---|---:|---|
| STRADDLER+CODE1 | `0x81000..0x85818` | 18,456 | code | 20 (1 straddler-tail + 19 `func_`) | detected |
| DATA | `0x85818..0x87200` | 6,632 | data | 24 | undetected |
| CODE2 | `0x87200..0x91000` | 40,448 | code | 43 (42 `func_` + 1 straddler-head) | mixed (undetected head + detected) |

- **Function count:** 19 (CODE1) + 42 (CODE2) = **61 `func_*`** + 2 straddler markers.
- **Data count:** 24 (all in the DATA region): **9 `data_` + 4 `rodata_` + 7 `table_`
  + 4 `zero_fill_`**.
- **Straddler-in:** `func_0007ffac_chunk8tail` `[0x81000,0x810DC)` — honest tail of
  `func_0007FFAC` (true entry `0x7FFAC`, head `func_0007ffac_chunk7head` in chunk 7).
- **Straddler-out:** `func_00090e54_chunk8head` `[0x90E54,0x91000)` → continues to
  `0x912F4` in chunk 9 (true entry `0x90E54`).
- **Boundary decisions / evidence:**
  - code→data `0x85818`: the function at `0x85684` returns `jr $ra` at `0x85810`
    (+ delay `0x85814`), then `0x85818` is 8 B of `nop` lead-in followed by a packed
    blob; below `0x85818` there are 0 prologues and 0 `jr $ra` until `0x87200`.
  - data→code `0x87200`: a **frameless display-list builder** begins
    (`move $t4,$a1; lui $…,0x800F; … E700`); the last data pointer table ends at
    `0x871FC`. DATA evidence = length-prefixed/NUL string pools + RAM-pointer tables
    + packed bytecode records, 0 returns/prologues/overlay-fns.
  - `func_00083C5C` `[0x83C5C,0x851D0)` (5,492 B) is ONE display-list builder with an
    internal indirect jump and a single `jr $ra`; the coarse window scan misreads its
    interior as "data" — NOT trusted. The parent **over-merged** two trailing
    frameless leaves (`func_000851D0` float-const setup, `func_00085450`) into it;
    un-merged (see §7).
  - CODE2 opens with a **parent-undetected** frameless cluster `0x87200..0x88024`
    (7+ display-list builders). The many `j 0x8019xxxx` inside are **relocated overlay
    tail-jumps, NOT function boundaries**; the real returns are at
    `0x87398/0x87544/0x876DC/0x87900/…`.

## 6. Parent DB / Overlay Map Contradictions
- **Parent-undetected code (CODE2 head):** `0x87200..0x88024` (~3.6 KB) has 0 entries
  in `../scripts/ob64_functions.json` and the overlay map. Recovered by prologue/return
  structure + the analysis swarm as frameless display-list builders. (Chunk 8 is
  otherwise the first mostly **parent-detected** chunk since chunk 5: ~43 parent fns
  + ~43 overlay fns cover most of CODE1/CODE2.)
- **Parent over-merge:** large parent records hid trailing frameless leaves.
  - CODE1: `func_00083C5C` (idx, 5,492 B) hid `func_000851D0` (float-const setup) and
    `func_00085450`. Un-merged — each leaf begins after a `jr $ra`+delay and ends with
    its own `jr $ra`.
  - CODE2: parent files 1/2/6/8 (by slice order) each hid a trailing frameless leaf;
    un-merged from disasm.
- **Multi-entry function:** `func_00083610` is genuine multi-entry — a frameless
  table-setup entry at `0x83610` falls through into the `addiu $sp,-0x8` body at
  `0x83644`. Kept as ONE function (entry `0x83610`), not split at the prologue.
- **Preamble-orphans (both code regions):** many functions are preceded by an 8-byte
  `lui/lw $vN,0x7AF8`-style read-before-write global load; the parent labels the
  prologue, not the true entry. Folded forward (see §7).
- **Relocated overlay tail-jumps misread as boundaries:** `j 0x8019xxxx` targets in
  the CODE2 frameless cluster are overlay relocations, not call/return edges — they do
  NOT end a function. Verified against the real `jr $ra` returns.
- No false-positive data-as-function labels found (the parent DB omits the
  parent-undetected ranges rather than mislabeling data as code).

## 7. Mistakes Found And Corrected (with before→after ranges)
- **Parent over-merge un-merges (CODE1):** `func_00083C5C` originally absorbed
  `[0x851D0,0x85684)`. Split: `func_00083C5C [0x83C5C,0x851D0)`,
  `func_000851D0 [0x851D0,0x85450)`, `func_00085450 [0x85450,0x85684)`. Each new entry
  starts after a `jr $ra`+delay slot.
- **Parent over-merge un-merges (CODE2):** four trailing frameless leaves split out of
  parent files 1/2/6/8 (caught by `check_boundaries` prologue-after-return /
  under-split check; confirmed from disasm).
- **Preamble-orphan folds:** several 8-byte `lui/lw $vN,0x7AF8` read-before-write
  preambles were left on the *previous* function's tail by per-slice agents; folded
  forward so the global load belongs to the function that consumes it (boundary moved
  back 8 bytes, name updated to the preamble address). All flagged by the
  `check_boundaries` straddler-position / preamble checks.
- **Straddler markers preserved:** the incoming tail kept `kind:"straddler-tail"`
  (`func_0007ffac_chunk8tail`, NOT promoted to an independent function — it has no
  prologue, only the `jr $ra` at `0x810D4` + epilogue `addiu $sp,0x50` at `0x810D8`);
  the outgoing head kept `kind:"straddler-head"` (`func_00090e54_chunk8head`, true
  entry `0x90E54`, the rest in chunk 9).
- **Data not forced into `func_*`:** the `0x85818..0x87200` block disassembles into
  plausible MIPS (dsra32/sd/j/regimm decode comments) but is data — kept as 24
  `kind:"data"` parts, not code. Proven by the absence of any return/prologue between
  the `0x85810` return and the `0x87200` resume, plus pointer/ASCII/zero density.
- **No over-split data / no under-split functions** remained after the adversarial pass
  (**6/6 regions clean, 0 issues**). No names needed downgrading — all code is already
  conservative `func_*`.

## 8. Data Classification (24 parts; full per-part map in the dossier)
All parts are `kind:"data"` (data-region headers, no function/true-entry wording).
**Decode comments in every data part show MIPS-looking ops (dsra32/sd/j/regimm/lw) —
IGNORE them; this is data** (0 `jr $ra`, 0 prologues, 0 overlay-loaded functions in
the entire `0x85818..0x87200` range; the words are length-prefixed strings, NUL
strings, RAM pointers, packed bytecode records, and zero fill).

DATA `0x85818..0x87200` (game data: mission/location names + options menu):
- **`rodata_` (4):**
  - `rodata_00085960` `[0x85960,0x85C60)` — **length-prefixed mission/location-name
    string pool** (1 length byte + ASCII + `0x0F` separator): Castro Canyon, Zenobian
    Border, Crenel Canyon, Volmus Mine, Tenne Plains, … Fort Romulus.
  - `rodata_00085c60` `[0x85C60,0x85EA8)` — **NUL-terminated UI/options-menu pool**:
    Message/Cursor/Game speed, Sound settings, Mono/Stereo, Restore defaults, …,
    Prologue/Chapter:One.., No Data, + elemental names Deus/Tierra/Agua/…/Raio.
  - plus two further small string/glyph pools in the `0x85E…/0x86…` range.
- **`table_` (7):** RAM-pointer / record tables, e.g. `table_000864a0`
  `[0x864A0,0x86728)` stride-8 records `{small index, RAM pointer 0x801A6xxx}`;
  `table_00086728`/`table_00086828` RAM-pointer tables (`0x801A6Dxx/0x801A6Exx`);
  others hold `0x801Axxxx` overlay-RAM pointers.
- **`data_` (9):** packed delta/offset/index blobs (`0x02–0x27` values, `0xFF` group
  delimiters) at `0x85820`/`0x858E4`; animation/display-bytecode records
  (`0xE2/0xE3/0xE7/0xDF` lead bytes); small-value / coordinate record blocks.
- **`zero_fill_` (4):** `0x85818` (8 B nop lead-in), `0x858BC` (40 B), `0x86864`,
  `0x86954`.
- **Straddles:** none through the data block (CODE1 precedes, CODE2 follows; both
  region edges are in-chunk).
- **Unknowns:** the record/bytecode field semantics and the pointer-table → string-pool
  index wiring are not decoded; the `0x801Axxxx` pointers are runtime overlay RAM
  (NOT a linear ROM back-map).

## 9. Tooling Changes
- **None this run.** The chunk-7 `sanitizeComment(text)` addition to
  `tools/split_original_mips_part.js` (replaces `*/`→`* /` and `/*`→`/ *` in
  `note`/`label`) already neutralizes the data-note hazard; chunk 8's notes assembled
  without issue.
- **Reused tracked tools (no change):** `dump_function_context`, `plan_chunk`,
  `slice_chunk --disasm`, `integrate_chunk` (context optional), `check_splits`,
  `check_boundaries`, `check_manifest`, `split_original_mips_part`,
  `assemble_original_mips`, `verify_setup`, `audit_code_region`. (`scan_functions`
  was available for the parent-undetected CODE2 head; the analysis swarm recovered
  that cluster directly from the sliced disasm.)
- **Gitignored scratch (NOT tracked):** `build/wf_analyze.js`, `build/wf_data.js`,
  `build/wf_adversarial.js` (per-chunk swarm drivers; edited the DATA BLOCK and
  re-invoked via `scriptPath` — note: the `args` global does not reach Workflow
  scripts, so per-region config is inlined), and `build/chunk_*` intermediates.

## 10. Verification (commands + key output)
- `node tools/check_manifest.js` → **ALL CHECKS PASS** (9 chunks, 1,542 parts).
- `node tools/check_boundaries.js --splits build/chunk_00081000-00091000_splits.json --disasm build/original-mips/rev0/code_00081000_00091000.s` → **BOUNDARY CHECK PASS** (0 fragment / 0 cross-boundary branch / 0 under-split / 0 delay-slot leak / 0 straddler-position / 0 data-island).
- `node tools/check_splits.js --splits build/chunk_00081000-00091000_splits.json --disasm build/original-mips/rev0/code_00081000_00091000.s` → 87 splits, **0 fragments**.
- Adversarial review swarm (`build/wf_adversarial.js`, 6 regions) → **6/6 CLEAN, 0 issues**.
- Data-header / function-wording scan over chunk-8 `data_/rodata_/table_/zero_fill_`
  `.s` files → **0** files with function/true-entry wording.
- `node tools/assemble_original_mips.js` → **Exact code-region match: PASS**, code SHA `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- `node tools/verify_setup.js` → **PASS**: 9 tracked composite chunks, **1,542** tracked files, **91** generated fallback chunks; ROM SHA `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
- `node tools/audit_code_region.js` → OK (executable extent `0x1000..0x2B89B4`; control-flow into tail: 0 branches, 0 J/JAL to known fn; verdict = no-credible-code-edge-into-tail).
- `git diff --check` → clean. `git status --short --branch` → `## main`, 0 uncommitted (after the review commit).

Summary numbers: **tracked chunks 9 · tracked files 1,542 · fallback chunks 91 ·
code SHA `40D4E787…B409` · ROM SHA `571E8339…CC67A` · frontier `0x00091000`.**

## 11. Files Changed
- **Source `.s` (added):** 87 under `asm/original/rev0/lib/` (chunk 8: 61 `func_*`,
  `func_0007ffac_chunk8tail` straddler-tail, `func_00090e54_chunk8head` straddler-head,
  24 `data_/rodata_/table_/zero_fill_`). **Removed:** temp whole-chunk
  `asm/original/rev0/code_00081000_00091000.s` (`--remove-source`). **Renamed:** none.
- **Manifest:** `asm/original/rev0/manifest.json` — chunk 8 seeded then split to
  87 parts (chunk count 8→9, total parts 1,455→1,542).
- **Tools:** none.
- **Docs:** new `docs/dossiers/lib-chunk8-81000-91000.md`; this review; updated
  `AGENTS.md`, `docs/DECOMP_LOG.md`, `docs/NEXT_STEPS.md`, `docs/PLATFORM.md`,
  `docs/WORKFLOW.md` (all to 9 chunks / 1,542 files / 91 fallback / frontier
  `0x00091000`).
- **Generated/scratch (intentionally untracked, gitignored):**
  `build/chunk_00081000-00091000_splits.json`, `build/chunk_*_slices/`,
  `build/wf_*.js`, `build/original-mips/rev0/code_00081000_00091000.s`.
- **Confirmed:** no unintended root-level scratch artifacts are tracked (root =
  `.gitattributes`, `.gitignore`, `AGENTS.md`, `README.md` only).

## 12. Current Frontier
- **Next ROM address:** `0x00091000` (chunk 9, `0x91000..0xA1000`).
- **First required action:** continue the function straddler — emit
  `func_00090e54_chunk9tail` `[0x91000,0x912F4)` as chunk 9's first file (tail of
  `func_00090E54`, true entry `0x90E54`, head `func_00090e54_chunk8head` in chunk 8).
- **Expected class:** chunk 9 should remain largely **parent-DETECTED** (the parent
  run extends past `0x91000`), but **content-scan first** — chunks 5–8 each held an
  interior data region. Use `scan_functions` only for any parent-undetected
  sub-region.
- **Pipeline to start with:** `dump_function_context --start 0x91000 --end 0xA1000`
  → `plan_chunk` (`--tail-end 0x912F4 --tail-name func_00090e54_chunk9tail`) →
  `slice_chunk --disasm` → analysis swarm (+ `wf_data` for any data region) →
  `check_boundaries` → adversarial swarm → `split_original_mips_part`.

## 13. Unresolved Caveats
- **Conservative names:** all 61 chunk-8 functions are `func_<addr>` address labels.
  Overlay relocation makes RAM/global/callee identity SUSPECT — the decode-comment
  RAM column is the wrong linear map; no semantic behavior is verified (no runtime
  trace / mutation evidence).
- **Data fields not decoded:** mission/location-name → record wiring; options-menu
  pointer-table → string mapping; the `data_*` animation/display-bytecode record
  formats; the `0x801Axxxx` overlay-RAM pointer destinations.
- **Jump targets in relocated RAM:** `func_00083C5C` and the CODE2 frameless builders
  read indirect-jump targets and emit `j 0x8019xxxx` overlay tail-jumps into relocated
  RAM, not inline ROM — targets not resolved.
- **Parent DB still partial:** parent-undetected for `0x87200..0x88024`; over-merges
  and preamble-orphans throughout CODE1/CODE2. Treat parent boundaries as leads,
  validate from disasm.
- **Hypothesis-grade:** the "display-list builder" / "options menu" / "mission-name
  pool" role descriptions are structural inferences, not runtime-proven.

## 14. Reviewer Checklist
- [ ] `git status --short --branch` → clean `## main`; `git log --oneline -2` shows the
  review-handoff commit then `1dbe673`.
- [ ] `node tools/check_manifest.js` → ALL CHECKS PASS (9 chunks / 1,542 parts).
- [ ] `node tools/check_boundaries.js --splits build/chunk_00081000-00091000_splits.json --disasm build/original-mips/rev0/code_00081000_00091000.s` → PASS.
- [ ] `node tools/assemble_original_mips.js` → byte-exact (code SHA `40D4E787…B409`);
  `node tools/verify_setup.js` → PASS (9 / 1,542 / 91; ROM `571E8339…CC67A`).
- [ ] Spot-check suspicious files: `func_0007ffac_chunk8tail.s` (straddler-tail, no
  prologue, ends `jr $ra`@`0x810D4`); `func_00090e54_chunk8head.s` (straddler-head,
  true entry `0x90E54`); `func_00083610.s` (multi-entry — entry `0x83610` falls through
  to body `0x83644`); `rodata_00085960.s` (length-prefixed mission-name pool, assembles?).
- [ ] Confirm docs/counts match: AGENTS.md / DECOMP_LOG.md / NEXT_STEPS.md /
  PLATFORM.md / WORKFLOW.md all say 9 chunks / 1,542 files / 91 fallback / frontier
  `0x00091000`.
- [ ] Confirm next frontier `0x00091000` and the `func_00090e54_chunk9tail`
  `[0x91000,0x912F4)` first-action.
- [ ] Confirm 0 root scratch tracked and 0 data files with function wording.
- [ ] Confirm the DATA block `0x85818..0x87200` is classified data, not code (decode
  comments look like MIPS — they are coincidental; 0 returns/prologues in-region).
