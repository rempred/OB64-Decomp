# Review Handoff: 2026-06-22 Chunks 10–11 Source-Ownership — both ALL CODE (`0x000A1000..0x000C1000`)

Self-contained handoff for a fresh reviewer covering a two-chunk run. Static/offline;
exact byte-for-byte rebuild preserved. Per-byte detail:
`docs/dossiers/lib-chunk10-A1000-B1000.md`, `docs/dossiers/lib-chunk11-B1000-C1000.md`.

## 1. Title
Review Handoff — Chunks 10 & 11 Source-Ownership, ROM z64 `0x000A1000..0x000C1000`
(chunks 11 & 12 of the 64 KiB grid; "chunk 10/11" in 0-based numbering), run date 2026-06-22.

## 2. TL;DR
- **Completed:** source-owned chunk 10 (`0xA1000..0xB1000`) and chunk 11
  (`0xB1000..0xC1000`) as code parts. **Both ALL CODE** (no interior data).
- **Chunk 10:** **35 parts** = 33 code `func_*` + 2 straddler markers + 0 data.
- **Chunk 11:** **191 parts** = 189 code `func_*` (112 framed + 77 frameless) + 2
  straddler markers + 0 data. Frameless-leaf-DENSE (parent detected only 112 of 189).
- **Tracked source files:** 1,576 → 1,611 (chunk 10) → **1,802** (chunk 11), +226 total.
- **Generated fallback chunks:** 90 → 89 → **88**.
- **Source-owned bytes:** chunks 0–11 = `0x1000..0xC1000` = **786,432 B = 27.6018 %**
  of the 2,849,204-byte evidenced executable MIPS extent (`0x1000..0x2B89B4`).
- **Code-only classified:** ≈ **655,644 B (23.0115 %)** (both chunks all-code, +131,072 B).
- **Exact rebuild preserved:** YES — code SHA `40D4E787…B409`, full ROM SHA
  `571E8339…CC67A`, both unchanged across both chunks.
- **Current frontier:** `0x000C1000` (chunk 12). Working tree clean.
- **No tool changes** in either chunk.

## 3. Commits (this run, newest first)
| Hash | Category | Purpose |
|---|---|---|
| `6ef38f1` | review handoff | Add chunks 10–11 review handoff doc (this file, final commit) |
| `946a709` | source + docs | Source-own chunk 11 (191 parts); dossier `lib-chunk11` + AGENTS/DECOMP_LOG/NEXT_STEPS/PLATFORM/WORKFLOW updates |
| `9e98f8e` | source + docs + log prune | Source-own chunk 10 (35 parts); dossier `lib-chunk10`; doc count updates; pruned DECOMP_LOG (boot+chunks1–7 narratives → `docs/archive/`) |
| `3746ce1` | doc fix (opening) | Chunk-9 review nit: placeholder `_(this doc's commit)_` → real hash `b162bfd` |

## 4. Opening Fixes (commit `3746ce1`)
1. **`docs/REVIEW_2026-06-22_chunk09-source-ownership.md`** — replaced the commit-table
   placeholder `_(this doc's commit)_` with the real chunk-9 review-handoff hash
   **`b162bfd`**. No count/frontier change.
2. **Verified (no change needed):** working tree clean at `b162bfd`; 0 root scratch
   tracked; 0 data files with function/true-entry wording; all current-state docs read
   12-pending counts consistently (the chunk-9 review's `1,542 → 1,576` lines are
   correct before→after, not stale).
3. **Log prune (in `9e98f8e`):** `docs/DECOMP_LOG.md` had grown to 832 lines; moved the
   boot-subsystem + chunks 1–7 detailed narratives (456 lines) to
   `docs/archive/DECOMP_LOG-2026-06-21-boot-and-chunks1-7.md` with an in-place pointer,
   keeping the current summary/invariants/recent-chunk narratives/frontier.

## 5. Work Completed

### Chunk 10 (`0xA1000..0xB1000`), ALL CODE
| Region | Range | Bytes | Class | Parts |
|---|---|---:|---|---:|
| STRADDLER+CODE | `0xA1000..0xB1000` | 65,536 | code | 35 (1 straddler-tail + 33 `func_` + 1 straddler-head) |
- Same army-mgmt / `character::char-data consumer` / F3DEX display-list family as chunk 9.
- Straddler-in `func_000A0DAC_chunk10tail [0xA1000,0xA118C)` (tail of chunk-9's
  `func_000A0DAC`; ends `jr $ra`@`0xA1184`). Straddler-out `func_000B0BFC_chunk10head
  [0xB0BFC,0xB1000)` → `0x000B1F00` in chunk 11 (return `jr $ra`@`0xB1EF8`).
- 3 preamble-orphans folded (`func_000A4A00`/`func_000AB5EC`/`func_000AEB8C`, all
  read-before-write `lui/lw 0x80196AF8` or `0x801936E0`).
- 7 recovered frameless leaves the parent over-merged/missed: GAP1 `func_000A71C8`
  (float-compare), GAP2 cluster `func_000AE298`/`func_000AE30C`/`func_000AE384`, and
  over-merge un-merges `func_000AB040`, **`func_000AB6D8` (6,944 B switch-body)**,
  `func_000AD6A0`.
- 5 internal `jr$reg` dispatchers (`0xA5768`/`0xA84D0`/`0xAB3D8`/`0xB04E0`/`0xB0C50`),
  tables in `0x801EF998..FA70` relocated RAM. 1 multi-entry `func_000ADA74`.

### Chunk 11 (`0xB1000..0xC1000`), ALL CODE, frameless-leaf-DENSE
| Region | Range | Bytes | Class | Parts |
|---|---|---:|---|---:|
| STRADDLER+CODE | `0xB1000..0xC1000` | 65,536 | code | 191 (1 straddler-tail + 189 `func_` + 1 straddler-head) |
- FP-math region (`~0xB2500..0xB4640`: `cvt.s.w`/`mul.s`/`div.s`/`sqrt.s`, float
  constants built in-stream via `lui+mtc1`) + char-data/display-list code.
- **The parent DB detected only 112 of 189 functions; the swarm recovered 77 frameless
  leaves** (4 gap clusters: gap1 `0xB3B00` 5 leaves, gap3 `0xB8DD8` 4, gap4 `0xBA2B4`
  4, gap2 `0xB86F8`; plus many over-merge un-merges). 99 of 189 code parts carry an
  explicit entry label (frameless/preamble/recovered starts not in the parent DB).
- Straddler-in `func_000B0BFC_chunk11tail [0xB1000,0xB1F00)`. Straddler-out
  `func_000C0EDC_chunk11head [0xC0EDC,0xC1000)` → `0x000C132C` in chunk 12.
- 9 internal `jr$reg` dispatchers (`0xB19D4`/`0xB1ACC`/`0xB232C`/`0xB25B0`/`0xB2F24`/
  `0xB98B4`/`0xBC594`/`0xBD4B8`/`0xC05AC`), tables in `0x801F…` relocated RAM. Smallest
  part: 12-byte frameless getter `func_000bbad0` (`lui/jr $ra/lbu 0x80196AE9`).

## 6. Parent DB / Overlay Contradictions
- **Chunk 10:** parent over-merged frameless leaves into large records (notably the
  7,172-byte `func_000AB5F4` record, which is actually `func_000AB5EC` (236 B) +
  `func_000AB6D8` (6,944 B switch-body) — adversarially confirmed). 3 preamble-orphans.
- **Chunk 11:** the parent DB is heavily under-detecting — only 112 of 189 functions
  (frameless leaves invisible to its prologue scan). 4 gap clusters reported as leading
  gaps were frameless-leaf clusters. 26 boundary-note gaps (22 small preamble/align).
- **Both chunks:** all `jr$reg` are jump-table dispatches reading from `0x801F…`
  relocated overlay RAM (NOT inline ROM, NOT function boundaries); the many
  `j 0x801xxxxx` are overlay tail-jumps (NOT boundaries). The decode-comment RAM column
  is the wrong linear map — overlay-relocated.

## 7. Mistakes Found And Corrected
- **Chunk 10 (adversarial, all KEEP-SPLIT — 0 corrections needed):** the riskiest split
  (the 6,944-B "frameless" `func_000AB6D8`) was independently confirmed genuine
  (`func_000AB5EC` fully returns at `0xAB6D0`; `0xAB6D8` is an externally-called
  frameless entry; the body is one contiguous switch with 1 return + 25 overlay
  tail-jumps). `func_000AB040`/`func_000AD6A0` also confirmed genuine un-merges.
- **Chunk 11 (3 corrections):**
  - **2 delay-slot leaks** (caught by `check_boundaries`): the gap4 analysis agent ended
    `func_000ba790` and `func_000ba8a8` on their `jr $ra` instead of the delay slot;
    boundaries shifted +1 word (`0xBA8A4`→`0xBA8A8`, `0xBA914`→`0xBA918`).
  - **1 under-split** (caught by adversarial): `func_000b86f8` hid a second function at
    `0xB876C` (frameless entry reading `$a2/$a0/$a1` read-before-write, externally
    called). Split → `func_000b86f8 [0xB86F8,0xB876C)` + `func_000b876c [0xB876C,0xB8794)`.
  - **2 missed preamble-orphans** (caught by adversarial): the slice-10 agent described
    the folds in its notes but never moved the boundaries. `func_000bedb8` (was
    `0xBEDC0`) and `func_000bf248` (was `0xBF250`) — each an 8-byte `lui/lw 0x80196AF8`
    read-before-write preamble; boundaries shifted back 8 B.

## 8. Data Classification
**None — both chunks have 0 data parts.** The all-code finding is evidenced, not assumed:
- Chunk 10 data-hunter: 16,384/16,384 words decode as MIPS; max pointer-run 1, max
  zero-run 2, max printable-run 1; all 5 dispatcher tables in relocated RAM.
- Chunk 11 data-hunter: max pointer-run 0, max zero-run 3 (one alignment pad @`0xBA2B4`),
  max printable-run 1, **0 bare float-data words** (the FP region builds constants
  in-stream via `lui+mtc1`), 0 undecodable words; all 9 dispatcher tables in relocated RAM.

## 9. Tooling Changes
- **None** in either chunk. Reused tracked tools: `promote_original_mips`,
  `dump_function_context`, `plan_chunk`, `slice_chunk --disasm`, `integrate_chunk`,
  `check_splits`, `check_boundaries`, `check_manifest`, `split_original_mips_part`,
  `assemble_original_mips`, `verify_setup`, `audit_code_region`.
- Swarms run via the **Agent tool** (parallel), each agent reading its slice/region from
  disasm and writing/returning a structured tiling — chosen for deterministic,
  validated `sliceK_final.json` handoff to `integrate_chunk` before the irreversible
  split. Chunk 10: 7 analysis + 5 adversarial agents. Chunk 11: 12 analysis + 5
  adversarial agents.
- **Gitignored scratch (NOT tracked):** `build/scan_chunk.js` (parameterized content
  scanner), `build/chunk_000a1000-000b1000_*` / `build/chunk_000b1000-000c1000_*`
  (splits JSON + slices), `build/original-mips/rev0/code_000A1000_000B1000.s` /
  `code_000B1000_000C1000.s`.

## 10. Verification (commands + key output)
- `node tools/check_manifest.js` → **ALL CHECKS PASS** (12 chunks, 1,802 parts).
- `node tools/check_boundaries.js --splits build/chunk_000a1000-000b1000_splits.json --disasm build/original-mips/rev0/code_000A1000_000B1000.s` → **PASS** (35 parts; 0 fragment/cross/under/leak/straddler/data-island).
- `node tools/check_boundaries.js --splits build/chunk_000b1000-000c1000_splits.json --disasm build/original-mips/rev0/code_000B1000_000C1000.s` → **PASS** (191 parts; 0 of each — after fixing 2 delay-slot leaks).
- `node tools/check_splits.js …` (both chunks) → 0 fragments (chunk 11 has 1 legit 12 B getter stub `func_000bbad0`).
- Adversarial swarms → chunk 10: 0 disproofs; chunk 11: 1 under-split + 2 missed preamble-orphans (all fixed), then clean.
- Full byte-coverage: every byte `0xA1000..0xC1000` assigned to a tracked code part (no gaps/overlaps).
- `node tools/assemble_original_mips.js` → **Exact code-region match: PASS**, code SHA `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- `node tools/verify_setup.js` → **PASS**: 12 tracked composite chunks, **1,802** tracked files, **88** generated fallback chunks; ROM SHA `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
- `node tools/audit_code_region.js` → OK (executable extent `0x1000..0x2B89B4`; no credible code edge into the data tail).
- 0 data files with function/true-entry wording; 0 root scratch tracked.
- `git diff --check` → clean. `git status --short --branch` → `## main`, 0 uncommitted (after the review commit).

Summary numbers: **tracked chunks 12 · tracked files 1,802 · fallback chunks 88 ·
code SHA `40D4E787…B409` · ROM SHA `571E8339…CC67A` · frontier `0x000C1000`.**

## 11. Files Changed
- **Source `.s` (added):** 35 (chunk 10) + 191 (chunk 11) = 226 under `asm/original/rev0/lib/`.
  **Removed:** temp whole-chunk `code_000A1000_000B1000.s` / `code_000B1000_000C1000.s`
  (`--remove-source`; promote-seeded, never committed). **Renamed:** none.
- **Manifest:** `asm/original/rev0/manifest.json` — chunk count 10→12, total parts 1,576→1,802.
- **Tools:** none.
- **Docs:** new `docs/dossiers/lib-chunk10-A1000-B1000.md`, `docs/dossiers/lib-chunk11-B1000-C1000.md`;
  this review; updated `AGENTS.md`, `docs/DECOMP_LOG.md`, `docs/NEXT_STEPS.md`,
  `docs/PLATFORM.md`, `docs/WORKFLOW.md`; new archive
  `docs/archive/DECOMP_LOG-2026-06-21-boot-and-chunks1-7.md`; chunk-9 review hash fix.
- **Generated/scratch (intentionally untracked, gitignored):** `build/scan_chunk.js`,
  `build/chunk_000a1000-000b1000_*`, `build/chunk_000b1000-000c1000_*`,
  the two whole-chunk `build/original-mips/rev0/code_*.s`.

## 12. Current Frontier
- **Next ROM address:** `0x000C1000` (chunk 12, `0xC1000..0xD1000`).
- **First required action:** continue the function straddler — emit
  `func_000C0EDC_chunk12tail` `[0xC1000,0x000C132C)` as chunk 12's first file (tail of
  `func_000C0EDC`, true entry `0xC0EDC`, head `func_000C0EDC_chunk11head` in chunk 11).
- **Expected class:** unknown. Content-scan for data FIRST (chunks 5–8 had data; 9–11
  were all-code). Watch for chunk-11-style frameless-leaf density.
- **Pipeline:** `promote_original_mips --chunk code_000C1000_000D1000.s` →
  `dump_function_context --start 0xC1000 --end 0xD1000` → content-scan → `plan_chunk`
  (`--tail-end 0x000C132C --tail-name func_000C0EDC_chunk12tail`) → `slice_chunk
  --disasm` → analysis swarm → `check_boundaries` → adversarial swarm → split.

## 13. Unresolved Caveats
- **Conservative names:** all 222 new functions are `func_<addr>` address labels.
  Overlay relocation makes RAM/global/callee identity SUSPECT — no semantic behavior
  verified (no runtime trace / mutation evidence).
- **Hypothesis-grade roles:** "army-mgmt / FP-math / display-list builder / char-data
  consumer" are structural + parent-DB inferences, not runtime-proven.
- **Jump-table dispatcher targets** (5 in chunk 10, 9 in chunk 11) read from `0x801EF…/
  0x801F…` relocated overlay RAM — target tables and case destinations not resolved.
- **`func_000AB6D8` (chunk 10, 6,944 B)** is conservatively one `func_*` part: one
  contiguous single-return switch-body, plausibly the case-body of a logical dispatcher
  whose entry is elsewhere (semantics not runtime-proven).
- **Parent DB heavily under-detects frameless leaves** (chunk 11: 77 missed). Downstream
  chunks likely similar — always recover frameless leaves from disasm, never trust the
  parent boundary count.

## 14. Reviewer Checklist
- [ ] `git status --short --branch` → clean `## main`; `git log --oneline -4` shows the
  review-handoff commit, `946a709`, `9e98f8e`, `3746ce1`.
- [ ] `node tools/check_manifest.js` → ALL CHECKS PASS (12 chunks / 1,802 parts).
- [ ] `node tools/assemble_original_mips.js` → byte-exact (code SHA `40D4E787…B409`);
  `node tools/verify_setup.js` → PASS (12 / 1,802 / 88; ROM `571E8339…CC67A`).
- [ ] Spot-check chunk 10: `func_000AB6D8.s` (6,944 B switch-body — single function?);
  `func_000B0BFC_chunk10head.s` (straddler-head, no `jr $ra`).
- [ ] Spot-check chunk 11: `func_000b876c.s` (under-split fix — frameless entry reading
  args); `func_000bedb8.s`/`func_000bf248.s` (preamble-orphan fixes — entry label 8 B
  before the prologue); `func_000ba790.s`/`func_000ba8a8.s` (delay-slot-leak fixes —
  end on the delay slot, not the `jr $ra`); `func_000bbad0.s` (12 B getter stub);
  `func_000C0EDC_chunk11head.s` (straddler-head).
- [ ] Confirm docs/counts match: AGENTS.md / DECOMP_LOG.md / NEXT_STEPS.md /
  PLATFORM.md / WORKFLOW.md all say 12 chunks / 1,802 files / 88 fallback / frontier
  `0x000C1000`.
- [ ] Confirm next frontier `0x000C1000` and the `func_000C0EDC_chunk12tail`
  `[0xC1000,0x000C132C)` first-action.
- [ ] Confirm both chunks classified ALL CODE (0 data parts); dispatcher tables in
  relocated RAM, not inline ROM; 0 root scratch tracked; 0 data files with function wording.
