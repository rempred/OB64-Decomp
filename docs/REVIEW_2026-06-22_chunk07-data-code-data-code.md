# Review Handoff: 2026-06-22 Chunk 7 Source-Ownership — data/code/data/code mixed (`0x00071000..0x00081000`)

Self-contained handoff for a fresh reviewer. Static/offline; exact byte-for-byte
rebuild preserved. Per-byte detail: `docs/dossiers/lib-chunk7-71000-81000.md`.

## 1. Title
Review Handoff — Chunk 7 Source-Ownership, ROM z64 `0x00071000..0x00081000`
(chunk 8 of the 64 KiB grid; "chunk 7" in 0-based numbering), run date 2026-06-22.

## 2. TL;DR
- **Completed:** source-owned chunk 7 (`0x00071000..0x00081000`, 65,536 B) as code
  and data parts (a four-region MIXED chunk), plus opening cleanup fixes.
- **Composition:** **103 parts** = **80 code `func_*` + 1 straddler-head + 22 data**
  (22 data = 6 `data_` + 8 `table_` + 8 `rodata_`; 0 `zero_fill_`/`rsp_ucode_`).
- **Tracked source files:** 1,352 → **1,455** (+103).
- **Generated fallback chunks:** 93 → **92** (−1).
- **Source-owned bytes:** chunks 0–7 = `0x1000..0x81000` = **524,288 B = 18.40 %**
  of the 2,849,204-byte evidenced executable MIPS extent (`0x1000..0x2B89B4`).
- **Code-only classified:** ≈ **400,132 B (14.04 %)** (chunk 7 contributes 59,888 B
  code + straddler vs 5,648 B data; significant data, so code-only is tracked).
- **Exact rebuild preserved:** YES — code SHA `40D4E787…B409`, full ROM SHA
  `571E8339…CC67A`, both unchanged.
- **Current frontier:** `0x00081000` (chunk 8). Working tree clean.

## 3. Commits (this run, newest first)
| Hash | Category | Purpose |
|---|---|---|
| `1a52020` | review handoff | Add chunk 7 review handoff doc (this file; will be amended by this audit) |
| `3cdc52a` | source + tooling + docs | Source-own chunk 7 (103 parts); `sanitizeComment` tool fix; dossier + AGENTS/DECOMP_LOG/NEXT_STEPS/PLATFORM/WORKFLOW count updates |
| `5c3e12e` | cleanup + docs | Remove root scratch dumps; fix stale WORKFLOW counts + run-handoff wording |

(Prior context: `c5fa708` chunks 5–6 run handoff, `f05b535` chunk 6, `8a3eaa7`
chunk 5 — not part of this run.)

## 4. Opening Fixes (done before chunk-7 splitting; commit `5c3e12e`)
1. **Root scratch removed** — `regB.json` (370 KB) and `regionA.txt` (27 KB),
   unreferenced chunk-5 analysis dumps accidentally tracked at repo root via
   `git add -A` in `8a3eaa7`. Removed with `git rm`; the data they held is captured
   in the chunk-5 tracked `.s` files + dossier. Root now tracks only
   `.gitattributes`, `.gitignore`, `AGENTS.md`, `README.md`.
2. **`docs/WORKFLOW.md`** count line `5 chunks / 1,186 files / 95 fallback (through
   0x51000)` → `7 / 1,352 / 93 (through 0x71000)` (then `8 / 1,455 / 92` in the
   chunk-7 commit). Why: it lagged 2 chunks behind reality.
3. **`docs/REVIEW_2026-06-22_chunks05-06-run.md`** — replaced the two "working tree
   clean at `f05b535`" claims (HEAD had advanced to `c5fa708`) with unambiguous
   wording naming the chunk commits and deferring to `git log`.
4. **Verified (no change needed):** 0 data files carry "True entry"/function wording
   (re-scan); manifest integrity already PASS.

No manifest/byte change in the cleanup commit (docs + file deletions only); rebuild
unaffected.

## 5. Work Completed — chunk 7 (`0x00071000..0x00081000`), MIXED, four ROM-ordered regions

| Region | Range (z64) | Bytes | Class | Parts | Parent DB |
|---|---|---:|---|---:|---|
| DATA1 | `0x71000..0x71280` | 640 | data | 2 | undetected |
| CODE1 | `0x71280..0x783A0` | 28,960 | code | 45 | **undetected** |
| DATA2 | `0x783A0..0x79730` | 5,008 | data | 20 | undetected |
| CODE2 | `0x79730..0x81000` | 30,928 | code | 36 (35 `func_` + 1 straddler-head) | detected (27 fns) |

- **Function count:** 45 (CODE1) + 35 (CODE2) = **80 `func_*`** + 1 straddler-head.
- **Data count:** 22 (2 DATA1 + 20 DATA2): **6 `data_` + 8 `table_` + 8 `rodata_`**.
- **Straddler-in:** `data_00071000` continues chunk-6 `data_00070e70` (data blob).
- **Straddler-out:** `func_0007ffac_chunk7head` `[0x7FFAC,0x81000)` →`0x810DC` (chunk 8).
- **Boundary decisions / evidence:**
  - blob→code `0x71280`: first frameless string-search fn (`lhu`/compare) begins;
    everything below has 0 returns/prologues (packed-load blob).
  - code→data `0x783A0`: a function returns `jr $ra` at `0x78394` (+ delay `0x78398`
    + nop `0x7839C`); `0x783A0` = `001F1C1F` small-index bytes, then pointer tables.
  - data→code `0x79730`: first parent-detected prologue; DATA2 evidence = ~618
    RAM-pointer words + dense ASCII string pools, 0 returns/prologues/overlay-fns.
  - CODE2 confirmed code by parent overlay map (27 loaded fns `0x79730..0x7FFB4`)
    and prologue/return structure. The coarse window scan was NOT trusted (it
    misreads large-function interiors as "data" — e.g. the 11 KB `func_00079E7C`).
  - `func_00079E7C` `[0x79E7C,0x7CA04)` (11,144 B) is ONE switch-dispatcher: its
    four `jr $v0` (`0x79ED4/0x7A8E4/0x7B098/0x7BB50`) are bound-checked jump-table
    dispatches (sltiu+sll2+lui/addu+lw-table+jr), single `jr $ra` at `0x7C9FC`.

## 6. Parent DB / Overlay Map Contradictions
- **Parent-undetected code:** CODE1 `0x71280..0x783A0` (~29 KB) has 0 entries in
  `../scripts/ob64_functions.json` and the overlay map. This continues the parent
  gap that began at chunk 6 (the parent DB's last fn before here is `0x5C1A8` in
  chunk 5; its next is `0x79730` in chunk 7). Proven by `tools/scan_functions.js`
  (prologue scan found 33 framed fns) + the analysis swarm (45 after frameless-leaf
  recovery), all with real `addiu $sp` prologues and `jr $ra` returns.
- **Parent over-merge (CODE2):** large parent records hid trailing frameless leaves
  — record at `0x7D450` (idx14, 1404 B) hid leaves at `0x7D834/0x7D90C/0x7D960/
  0x7D994`; record at `0x7D9CC` (idx15) hid a 2-word `jr;nop` stub at `0x7DC00` and
  more. Proven from disasm: each leaf begins after a `jr $ra`+delay and ends with
  its own `jr $ra`.
- **Preamble-orphans (both code regions):** many functions are preceded by a 2-word
  `lui/lw $vN,…7AF8`-style read-before-write global load (the parent labels the
  prologue, not the true entry). Folded forward (see §7).
- No false-positive data-as-function labels found in chunk 7 (the parent DB simply
  omits CODE1 rather than mislabeling data there).

## 7. Mistakes Found And Corrected (with before→after ranges)
- **Delay-slot leak (1):** `func_00071280` ended on its `jr $ra` (`0x712D4`),
  leaking the delay slot. Fixed: `[0x71280,0x712D8)` → `[0x71280,0x712DC)`; next
  part `func_000712d8` → `func_000712dc` `[0x712DC,…)`. Caught by `check_boundaries`.
- **Slice-seam preamble straddler-head mislabels (3):** per-slice agents at a slice
  boundary marked a trailing read-before-write preamble as `straddler-head` (cannot
  fold into the next agent's slice). Folded forward — e.g. CODE2 `func_0007CDD4`
  `[0x7CDD4,0x7CDE4)` folded into `func_0007cde4` → `func_0007cdd4 [0x7CDD4,0x7D064)`.
  All flagged by `check_boundaries` straddler-position check.
- **Adversarial preamble-orphan fold (1):** `0x7E148..0x7E150` (lui/lw $v0,…7AF8,
  consumed at `0x7E168`) was orphaned on `func_0007dea8`'s tail; moved boundary
  `0x7E150`→`0x7E148`, `func_0007e150` → `func_0007e148`.
- **Straddler-out true entry:** the chunk-8 straddler's true entry is the 2-word
  preamble at `0x7FFAC` (parent labeled `0x7FFB4`). Final part:
  `func_0007ffac_chunk7head [0x7FFAC,0x81000)` (kind `straddler-head`). NB: my
  inline slice-seam fold helper demoted this to `code` when it folded the preamble
  in; corrected by hand. Future automation: keep `straddler-head` kind when the fold
  target is the region-end straddler-head.
- **Tool bug — `*/` in a comment broke the assembler:** the data note for
  `rodata_000785c8` contained a charset string `+-*/=`; the `*/` closed the C-style
  header comment and `mips64-elf-as` errored ("junk at end of line, first
  unrecognized character is `=`"). Fixed in `split_original_mips_part.js` (§9) and
  the chunk was **re-split** (source restored from the gitignored generated chunk
  `build/original-mips/rev0/code_00071000_00081000.s`; manifest chunk-7 reset to a
  single seeded part; re-split). Byte-exact unaffected (comment-only change).
- No over-split data / no under-split functions remained after the adversarial pass
  (5/6 regions clean; the 1 issue was the `0x7E148` fold above). No names needed
  downgrading — all code is already conservative `func_*`.

## 8. Data Classification (22 parts; full per-part map in the dossier)
All parts are `kind:"data"` (data-region headers, no function/true-entry wording).
**Decode comments in every data part show MIPS-looking ops (lw/lb/scd/j/sdc1) — IGNORE
them; this is data** (0 `jr $ra`, 0 prologues, 0 overlay-loaded functions in all
data ranges; the words are packed bytes / RAM pointers / ASCII).

**DATA1 `0x71000..0x71280` (straddles in from chunk 6):**
- `data_00071000` `[0x71000,0x71258)` — tail of chunk-6 `data_00070e70` packed
  record/offset blob (0x8x/0x9x/0xF1/0xF8 lead-byte words, garbage offsets).
- `table_00071258` `[0x71258,0x71280)` — 10-word RAM-pointer table (`0x80197Cxx`).

**DATA2 `0x783A0..0x79730` (Controller-Pak / save-data menu data):**
- `rodata_*` (8): "Reset Control Deck." (`0x783F8`); chapter labels Prologue…Final
  Chapter (`0x784A8`); glyph/charset + debug names Magnus/Mario/DEL_DATA/MUSIC_ON
  (`0x785C8`); `EB`/`NOBE` save magic (`0x78898`); month abbreviations Jan.…Dec.
  (`0x78F68`); element/zodiac name pool Deus/Tierra/Agua/… (`0x79018`); UI/menu +
  format strings Controller Pak Menu / Erase/Load/Save / "OGREBATTLE64 %d" / `{C0}`…
  (`0x790CC`, `0x79394`).
- `table_*` (7): RAM-pointer tables of `0x801Axxx/0x8019xxx/0x8017xxx` pointers
  (18-word `0x783B0`; ~55-word `0x784EC`; 128-word `0x78698`; ~424-word `0x788A8`;
  12-word `0x78FC8`; 15-word `0x79090`; `0x791B8`). Several have default-fill slots
  + interior single zero words kept inline.
- `data_*` (4 in DATA2): small byte/index arrays and a UI rectangle/layout record
  block (`0x78410`), `0x78680`, `0x78F48`, `0x78FF8`.
- **Straddles:** DATA1 in (from chunk 6). No DATA2 straddle out (CODE2 follows).
- **Unknowns:** the pointer-table → string-pool index wiring is not decoded; the
  `data_*` record/layout field semantics are not decoded.

## 9. Tooling Changes
- **`tools/split_original_mips_part.js`** (tracked, durable; modified `3cdc52a`):
  added `sanitizeComment(text)` — replaces `*/`→`* /` and `/*`→`/ *` in any
  `note`/`label` embedded in a header comment, so a charset/string note can't break
  the C-comment / assembler. Byte (`.word`) output unchanged. Example:
  `node tools/split_original_mips_part.js --part <chunk.s> --splits-file <json> --remove-source`.
  Limitation: only sanitizes `note`/`label`; the decode comments in the body come
  from the generated reference and are already safe.
- **`tools/scan_functions.js`** (tracked, durable; used, not modified this run):
  prologue-based function-start seed for parent-undetected code. Example:
  `node tools/scan_functions.js --start 0x71280 --end 0x783A0 --disasm build/original-mips/rev0/code_00071000_00081000.s`.
- Reused tracked tools (no change): `dump_function_context`, `plan_chunk`,
  `slice_chunk --disasm`, `integrate_chunk` (context optional), `check_splits`,
  `check_boundaries`, `check_manifest`, `assemble_original_mips`, `verify_setup`.
- **Gitignored scratch (NOT tracked):** `build/wf_analyze.js`, `build/wf_data.js`,
  `build/wf_adversarial.js` (per-chunk swarm drivers; edit the DATA BLOCK and
  re-invoke via `scriptPath`), and `build/chunk_*` intermediates.

## 10. Verification (commands + key output)
- `node --check tools/split_original_mips_part.js` → OK.
- `node tools/check_manifest.js` → **ALL CHECKS PASS** (8 chunks, 1,455 parts).
- `node tools/check_boundaries.js --splits build/chunk_00071000-00081000_splits.json --disasm build/original-mips/rev0/code_00071000_00081000.s` → **BOUNDARY CHECK PASS** (0 fragment / 0 cross-boundary branch / 0 under-split / 0 delay-slot leak / 0 straddler-position / 0 data-island).
- `node tools/check_splits.js --splits build/chunk_00071000-00081000_splits.json --disasm build/original-mips/rev0/code_00071000_00081000.s` → 103 splits, **0 fragments** (1 legit 8-byte `jr;nop` stub `func_0007dc00`).
- Data-header / function-wording scan over `data_/rodata_/table_` `.s` files → **0** files with function/true-entry wording.
- Root scratch scan (`git ls-files | grep -v / | grep -i regB|regionA|.tmp`) → **none**.
- `node tools/assemble_original_mips.js` → **Exact code-region match: PASS**, code SHA `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- `node tools/verify_setup.js` → **PASS**: 8 tracked composite chunks, **1,455** tracked files, **92** generated fallback chunks; ROM SHA `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
- `node tools/audit_code_region.js` → OK (executable extent `0x1000..0x2B89B4`; no credible code edge into the data tail).
- `git diff --check` → clean. `git status --short --branch` → `## main`, 0 uncommitted.

Summary numbers: **tracked chunks 8 · tracked files 1,455 · fallback chunks 92 ·
code SHA `40D4E787…B409` · ROM SHA `571E8339…CC67A` · frontier `0x00081000`.**

## 11. Files Changed
- **Source `.s` (added):** 103 under `asm/original/rev0/lib/` (chunk 7: 80 `func_*`,
  1 `func_0007ffac_chunk7head`, 22 `data_/table_/rodata_`). **Removed:** temp
  whole-chunk `asm/original/rev0/code_00071000_00081000.s` (`--remove-source`);
  root `regB.json`, `regionA.txt`. **Renamed:** none.
- **Manifest:** `asm/original/rev0/manifest.json` — chunk 7 seeded then split to
  103 parts (chunk count 7→8, total parts 1,352→1,455).
- **Tools:** `tools/split_original_mips_part.js` (`sanitizeComment`).
- **Docs:** new `docs/dossiers/lib-chunk7-71000-81000.md`; this review; updated
  `AGENTS.md`, `docs/DECOMP_LOG.md`, `docs/NEXT_STEPS.md`, `docs/PLATFORM.md`,
  `docs/WORKFLOW.md`, and the chunks 5–6 run handoff (wording).
- **Generated/scratch (intentionally untracked, gitignored):**
  `build/chunk_00071000-00081000_splits.json`, `build/chunk_*_slices/`,
  `build/wf_*.js`, `build/original-mips/rev0/code_00071000_00081000.s`.
- **Confirmed:** no unintended root-level scratch artifacts are tracked (root =
  `.gitattributes`, `.gitignore`, `AGENTS.md`, `README.md` only).

## 12. Current Frontier
- **Next ROM address:** `0x00081000` (chunk 8, `0x81000..0x91000`).
- **First required action:** emit the straddler tail `func_0007ffac_chunk8tail`
  `[0x81000,0x810DC)` as chunk 8's first file (tail of `func_0007FFAC`, head in
  chunk 7).
- **Expected class:** MIXED is likely (chunks 5–7 each had interior data), so
  **content-scan first** (return/prologue + pointer/ASCII density). Chunk 8 is the
  first largely **parent-DETECTED** region in a while — the `0x79730`+ parent run
  extends past `0x81000` — so `plan_chunk` + `dump_function_context` should seed
  most code; use `scan_functions` only for any parent-undetected sub-region.
- **Pipeline to start with:** `dump_function_context --start 0x81000 --end 0x91000`
  → `plan_chunk` → `slice_chunk --disasm` → analysis swarm (+ `wf_data` for any data
  region) → `check_boundaries` → adversarial swarm → `split_original_mips_part`.

## 13. Unresolved Caveats
- **Conservative names:** all 80 chunk-7 functions are `func_<addr>` address labels.
  Overlay relocation makes RAM/global/callee identity SUSPECT — the decode-comment
  RAM column (`0x800Exxx`) is the wrong linear map; no semantic behavior is verified
  (no runtime trace / mutation evidence).
- **Data fields not decoded:** Controller-Pak menu pointer-table→string wiring; the
  `data_*` record/layout/index field semantics; DATA1's packed blob format.
- **Jump tables in relocated RAM:** CODE1's two switch dispatchers and
  `func_00079E7C` read their target tables from relocated RAM, not inline ROM —
  targets not resolved.
- **Parent DB unreliable zones:** parent-undetected for `0x5C208..0x79730`
  (chunks 6–7); over-merges/preamble-orphans throughout. Treat parent boundaries as
  leads, validate from disasm.
- **Hypothesis-grade:** the "switch-dispatcher" / "queue accessor" / "Controller-Pak
  menu" role descriptions are structural inferences, not runtime-proven.
- **Checks not re-run this audit (unchanged since `1a52020`, tree clean):**
  `assemble_original_mips` and `verify_setup` were run in the chunk-7 commit turn
  (results cited above) and not re-run in this doc-audit (no source/manifest change
  since); `check_manifest`/`check_boundaries`/`git diff`/scratch+wording scans WERE
  re-run here and PASS.

## 14. Reviewer Checklist
- [ ] `git status --short --branch` → clean `## main`; `git log --oneline -3` shows
  `1a52020`/`3cdc52a`/`5c3e12e`.
- [ ] `node tools/check_manifest.js` → ALL CHECKS PASS (8 chunks / 1,455 parts).
- [ ] `node tools/check_boundaries.js --splits build/chunk_00071000-00081000_splits.json --disasm build/original-mips/rev0/code_00071000_00081000.s` → PASS.
- [ ] `node tools/assemble_original_mips.js` → byte-exact (code SHA `40D4E787…B409`);
  `node tools/verify_setup.js` → PASS (8 / 1,455 / 92; ROM `571E8339…CC67A`).
- [ ] Spot-check suspicious files: `func_0007dc00.s` (8-byte `jr;nop` stub — is it a
  real call target?); `func_0007ffac_chunk7head.s` (straddler-head, kind correct?);
  `rodata_000785c8.s` line 11 (sanitized `+-* /=` comment, assembles?).
- [ ] Confirm docs/counts match: AGENTS.md / DECOMP_LOG.md / NEXT_STEPS.md /
  PLATFORM.md / WORKFLOW.md all say 8 chunks / 1,455 files / 92 fallback / frontier
  `0x00081000`.
- [ ] Confirm next frontier `0x00081000` and the `func_0007ffac_chunk8tail`
  `[0x81000,0x810DC)` first-action.
- [ ] Confirm 0 root scratch tracked and 0 data files with function wording.
