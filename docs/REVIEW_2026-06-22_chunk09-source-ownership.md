# Review Handoff: 2026-06-22 Chunk 9 Source-Ownership — ALL CODE (`0x00091000..0x000A1000`)

Self-contained handoff for a fresh reviewer. Static/offline; exact byte-for-byte
rebuild preserved. Per-byte detail: `docs/dossiers/lib-chunk9-91000-A1000.md`.

## 1. Title
Review Handoff — Chunk 9 Source-Ownership, ROM z64 `0x00091000..0x000A1000`
(chunk 10 of the 64 KiB grid; "chunk 9" in 0-based numbering), run date 2026-06-22.

## 2. TL;DR
- **Completed:** source-owned chunk 9 (`0x00091000..0x000A1000`, 65,536 B) as code
  parts. **ALL CODE** — the first single-class chunk since chunk 2 (no interior data).
- **Composition:** **34 parts** = **32 code `func_*` + 2 straddler markers + 0 data**
  (1 incoming `straddler-tail` + 1 outgoing `straddler-head`).
- **Tracked source files:** 1,542 → **1,576** (+34).
- **Generated fallback chunks:** 91 → **90** (−1).
- **Source-owned bytes:** chunks 0–9 = `0x1000..0xA1000` = **655,360 B = 23.0015 %**
  of the 2,849,204-byte evidenced executable MIPS extent (`0x1000..0x2B89B4`).
- **Code-only classified:** ≈ **524,572 B (18.41 %)** (chunk 9 contributes 65,536 B,
  all code; cumulative data from chunks 3–8 keeps the code-only metric tracked).
- **Exact rebuild preserved:** YES — code SHA `40D4E787…B409`, full ROM SHA
  `571E8339…CC67A`, both unchanged.
- **Current frontier:** `0x000A1000` (chunk 10). Working tree clean.
- **No tool changes this chunk.**

## 3. Commits (this run, newest first)
| Hash | Category | Purpose |
|---|---|---|
| _(this doc's commit)_ | review handoff | Add chunk 9 review handoff doc (final commit) |
| `3bc5e2b` | source + docs | Source-own chunk 9 (34 parts); dossier `lib-chunk9` + AGENTS/DECOMP_LOG/NEXT_STEPS/PLATFORM/WORKFLOW count updates |
| `d86e9f5` | doc fixes | Chunk-8 review nits: placeholder `_(this doc)_`→`da2dd9c`; "chunk-9 head"→"chunk-9 tail file" wording (AGENTS×2, NEXT_STEPS, lib-chunk8) |

(Prior context, NOT this run: `da2dd9c` chunk-8 review handoff; `1dbe673` chunk-8 source.)

## 4. Opening Fixes (coordinator review of chunk 8; commit `d86e9f5`)
1. **`docs/REVIEW_2026-06-22_chunk08-source-ownership.md`** — commit-table placeholder
   `_(this doc)_` → the real review-handoff hash **`da2dd9c`**.
2. **"chunk-9 head" → "chunk-9 tail file"** — the first chunk-9 file is semantically a
   straddler TAIL, not a head. Fixed in `AGENTS.md` (2 spots: lines ~271 and ~2705),
   `docs/NEXT_STEPS.md` (line-wrapped "chunk-9\nhead", caught with a multiline search),
   and `docs/dossiers/lib-chunk8-81000-91000.md`. (The chunk-8 review doc already used
   "first file (tail of …)" wording — no change needed there beyond the hash.)
3. **Stale-count / frontier re-scan after the fix:** all current-state docs read
   **9 chunks / 1,542 files / 91 fallback / frontier `0x00091000`** before chunk-9
   work began (and the two current-state lines updated mid-run for chunk 8 — DECOMP_LOG
   "Current Invariants" and WORKFLOW.md — were already correct at HEAD `da2dd9c`).
4. **Verified (no change needed):** working tree clean at `da2dd9c`; 0 root scratch
   tracked (root = `.gitattributes`, `.gitignore`, `AGENTS.md`, `README.md`); 0 data
   files with function/true-entry header wording (2 false-positive hits in chunk-6/7
   `data_*.s` use "prologue" only as *absence-of-code* evidence).

## 5. Work Completed — chunk 9 (`0x00091000..0x000A1000`), ALL CODE, single region

| Region | Range (z64) | Bytes | Class | Parts |
|---|---|---:|---|---:|
| STRADDLER+CODE | `0x91000..0x000A1000` | 65,536 | code | 34 (1 straddler-tail + 32 `func_` + 1 straddler-head) |

- **Function count:** **32 `func_*`** (`0x912F4..0xA0DAC`) + 2 straddler markers.
- **Data count:** **0.** No interior data region (see §6/§8 for the evidence).
- **Straddler-in:** `func_00090e54_chunk9tail` `[0x91000,0x912F4)` — honest tail of
  `func_00090E54` (true entry `0x90E54` in chunk 8, head `func_00090e54_chunk8head`).
- **Straddler-out:** `func_000A0DAC_chunk9head` `[0xA0DAC,0xA1000)` → continues to
  `0x000A118C` in chunk 10 (true entry `0xA0DAC`).
- **What this code is:** the parent DB names all 33 functions `character::char-data
  consumer` (active states `army_mgmt`/`class_change_transition`/`mission_briefing`).
  The dominant idiom is **F3DEX/RDP display-list construction** — store-heavy code
  assembling graphics command words (`lui/ori` immediate halves → `sw` through a
  running pointer). This explains the **659 out-of-chunk `j` targets** (relocated
  overlay tail-jumps `j 0x801A…/0x801B…`, NOT function boundaries) and the
  store-heavy mix (`sw` 2,982 / `lui` 3,176).
- **Boundary decisions / evidence:**
  - straddler-tail end `0x912F4`: `jr $ra`@`0x912EC` + epilogue `addiu $sp,0x30`@
    `0x912F0`; next prologue `addiu $sp,-0x30`@`0x912F4`. Frame `-0x30` matches the
    chunk-8 parent prologue's `-0x30`. No prologue in `[0x91000,0x912F4)` (first word
    is mid-body `lw $a1,0x18($s2)`).
  - straddler-head `[0xA0DAC,0xA1000)`: prologue `addiu $sp,-0x30`@`0xA0DAC`; **0
    `jr $ra` anywhere in the range**; last word `0xA0FFC` = `bne $v0,$zero,…`
    (`0x14400018`), whose delay slot is the first word of chunk 10. Genuinely spans
    the boundary.
  - 32 framed functions, each single-prologue / single-`jr $ra` (deterministic
    per-part profile: 0 internal returns, 0 inline pointer words across all parts).

## 6. Parent DB / Overlay Map Contradictions
- **No parent-undetected code this chunk** (unlike chunks 6–8). The parent DB detects
  all 33 functions; prologue count (33) = `jr $ra` count (33), so there are no hidden
  frameless leaves ending in `jr $ra`. The adversarial pass additionally confirmed no
  frameless leaf hides inside any function (a leaf would need its own return).
- **One preamble-orphan:** the parent labeled a function start at `0x95260`, but its
  true entry is `0x95258` — an 8-byte read-before-write `lui $v1,0x8019`@`0x95258` +
  `lw $v1,0x6AF8($v1)`@`0x9525C` (global `0x80196AF8`, consumed at `0x952AC addiu
  $s6,$v1,0x1BDA` before any store). Folded forward (see §7).
- **Two internal jump-table dispatchers misread-able as boundaries:** `jr $v0`@`0x96930`
  (in `func_00095258`) and `jr $v0`@`0xA06F0` (in `func_000A0560`) are bound-checked
  computed gotos (`sltiu/sll2/lui 0x801F/addu/lw`), reading targets from `0x801F…`
  **relocated overlay RAM, not inline ROM**. They are NOT function ends; the case code
  after each belongs to the same function.
- **Relocated overlay tail-jumps:** the 659 `j 0x801A…/0x801B…` are overlay relocations,
  not call/return edges — they do NOT end a function.
- **Five genuine multi-entry functions** (a secondary entry reached only by fallthrough,
  kept as ONE part each): `func_00091FE0`(sec `0x92410`), `func_000934B0`(sec `0x93A28`),
  `func_00093E74`(sec `0x9437C`), `func_0009DB5C`(sec `0x9DC04`), `func_000A02F8`(sec
  `0xA037C`). The parent over-merge / spurious-secondary defect did NOT produce any
  false split here.

## 7. Mistakes Found And Corrected (with before→after ranges)
- **Preamble-orphan fold (the only boundary correction):** the base plan attached the
  8-byte `0x95258..0x95260` preamble to the END of `func_000943A0` (plan cuts at parent
  function starts). Corrected: `func_000943A0` ends `[0x943A0,0x95258)` (its `jr $ra`@
  `0x95250` + epilogue@`0x95254`); the preamble folds into `func_00095258` `[0x95258,
  0x96B74)` (kind `code`, entry label `func_00095258`, note explaining the
  read-before-write `0x80196AF8` load). Caught by `plan_chunk`'s `leadingGap` +
  confirmed by the analysis & adversarial swarms from the disasm.
- **Straddler markers preserved:** incoming tail kept `kind:"straddler-tail"`
  (`func_00090e54_chunk9tail`, no prologue — only the `jr $ra`@`0x912EC` + epilogue);
  outgoing head kept `kind:"straddler-head"` (`func_000A0DAC_chunk9head`, true entry
  `0xA0DAC`, rest in chunk 10).
- **No data forced into `func_*`, no code misread as data:** the all-code claim was
  adversarially challenged (a dedicated data-hunter, §8/§10) and survived.
- **No over-split / no under-split** after the analysis + adversarial passes (0
  disproofs across 5 adversarial agents). All names conservative `func_*`.

## 8. Data Classification
**None — chunk 9 has 0 data parts.** The all-code finding is evidenced, not assumed:
- Deterministic content scan (`build/scan_chunk9.js`, gitignored): **0** pointer-word
  runs (≥4), **0** zero runs (≥3), **0** ASCII runs (≥4 words) over all 16,384 words.
- Per-part profile: **0 inline pointer words** in any of the 34 parts; every function
  single-prologue / single-`jr $ra`.
- `check_boundaries`: **0 data-island** warnings.
- Dedicated adversarial **data-hunter** (whole chunk, quantitative): max consecutive
  `0x80xxxxxx` run = **1 word**, max zero run = **1 word**, max printable run = **3
  words**, **0 of 16,384 words undecodable**; both dispatcher target tables confirmed
  in `0x801F…` relocated RAM (not inline ROM). Verdict: no rodata, no inline pointer/
  jump tables, no constant pools, no zero-fill padding, no strings.

## 9. Tooling Changes
- **None this run.** Reused tracked tools (no change): `promote_original_mips`,
  `dump_function_context`, `plan_chunk`, `slice_chunk --disasm`, `integrate_chunk`,
  `check_splits`, `check_boundaries`, `check_manifest`, `split_original_mips_part`,
  `assemble_original_mips`, `verify_setup`, `audit_code_region`.
- **Swarm method:** the analysis swarm (7 agents, one per slice) and the adversarial
  swarm (5 agents: 4 region refuters + 1 data-hunter) were run via the **Agent tool**
  (parallel), each agent reading its slice/region from disasm and writing/returning a
  structured tiling — chosen over the gitignored `build/wf_*.js` Workflow drivers so the
  byte-exact-critical `sliceK_final.json` handoff to `integrate_chunk` was deterministic
  and validated before the irreversible split.
- **Gitignored scratch (NOT tracked):** `build/scan_chunk9.js` (content scanner),
  `build/chunk_00091000-000a1000_splits.json`, `build/chunk_00091000-000a1000_slices/`
  (slice `.s` + `sliceK_final.json`), `build/original-mips/rev0/code_00091000_000A1000.s`.

## 10. Verification (commands + key output)
- `node tools/check_manifest.js` → **ALL CHECKS PASS** (10 chunks, 1,576 parts).
- `node tools/check_boundaries.js --splits build/chunk_00091000-000a1000_splits.json --disasm build/original-mips/rev0/code_00091000_000A1000.s` → **BOUNDARY CHECK PASS** (34 parts; 0 fragment / 0 cross-boundary branch / 0 under-split / 0 delay-slot leak / 0 straddler-position / 0 data-island).
- `node tools/check_splits.js --splits build/chunk_00091000-000a1000_splits.json --disasm build/original-mips/rev0/code_00091000_000A1000.s` → 34 splits, **0 fragments**, 0 tiny files.
- Adversarial swarm (4 region refuters + 1 data-hunter) → **0 disproofs**; all boundaries + the all-code claim confirmed.
- Full byte-coverage check: every byte `0x91000..0xA1000` assigned to a tracked part (no gaps/overlaps); data-header / function-wording scan over chunk-9 files → 0 (chunk 9 has no data files).
- `node tools/assemble_original_mips.js` → **Exact code-region match: PASS**, code SHA `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- `node tools/verify_setup.js` → **PASS**: 10 tracked composite chunks, **1,576** tracked files, **90** generated fallback chunks; ROM SHA `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
- `node tools/audit_code_region.js` → OK (executable extent `0x1000..0x2B89B4`; control-flow into tail: 0 branches, 0 J/JAL to known fn; verdict = no-credible-code-edge-into-tail).
- `git diff --check` → clean. `git status --short --branch` → `## main`, 0 uncommitted (after the review commit).
- (No tracked JS tools were modified, so `node --check` had nothing new to check; `build/scan_chunk9.js` is gitignored scratch.)

Summary numbers: **tracked chunks 10 · tracked files 1,576 · fallback chunks 90 ·
code SHA `40D4E787…B409` · ROM SHA `571E8339…CC67A` · frontier `0x000A1000`.**

## 11. Files Changed
- **Source `.s` (added):** 34 under `asm/original/rev0/lib/` (chunk 9: 32 `func_*`,
  `func_00090e54_chunk9tail` straddler-tail, `func_000A0DAC_chunk9head` straddler-head).
  **Removed:** temp whole-chunk `asm/original/rev0/code_00091000_000A1000.s`
  (`--remove-source`; was promote-seeded, never committed). **Renamed:** none.
- **Manifest:** `asm/original/rev0/manifest.json` — chunk 9 seeded then split to 34
  parts (chunk count 9→10, total parts 1,542→1,576).
- **Tools:** none.
- **Docs:** new `docs/dossiers/lib-chunk9-91000-A1000.md`; this review; updated
  `AGENTS.md`, `docs/DECOMP_LOG.md`, `docs/NEXT_STEPS.md`, `docs/PLATFORM.md`,
  `docs/WORKFLOW.md` (all to 10 chunks / 1,576 files / 90 fallback / frontier
  `0x000A1000`); chunk-8 review/dossier wording fixes in `d86e9f5`.
- **Generated/scratch (intentionally untracked, gitignored):** `build/scan_chunk9.js`,
  `build/chunk_00091000-000a1000_splits.json`, `build/chunk_00091000-000a1000_slices/`,
  `build/original-mips/rev0/code_00091000_000A1000.s`.
- **Confirmed:** no unintended root-level scratch artifacts tracked.

## 12. Current Frontier
- **Next ROM address:** `0x000A1000` (chunk 10, `0xA1000..0xB1000`).
- **First required action:** continue the function straddler — emit
  `func_000A0DAC_chunk10tail` `[0xA1000,0x000A118C)` as chunk 10's first file (tail of
  `func_000A0DAC`, true entry `0xA0DAC`, head `func_000A0DAC_chunk9head` in chunk 9).
- **Expected class:** chunk 10 should remain largely **parent-DETECTED** (the parent
  run extends past `0xA1000`), but **content-scan first** — chunks 5–8 each held an
  interior data region; chunk 9 had none. Do not assume either way. Use `scan_functions`
  only for any parent-undetected sub-region.
- **Pipeline to start with:** `promote_original_mips --chunk code_000A1000_000B1000.s`
  → `dump_function_context --start 0xA1000 --end 0xB1000` → content-scan → `plan_chunk`
  (`--tail-end 0x000A118C --tail-name func_000A0DAC_chunk10tail`) → `slice_chunk
  --disasm` → analysis swarm → `check_boundaries` → adversarial swarm →
  `split_original_mips_part`.

## 13. Unresolved Caveats
- **Conservative names:** all 32 chunk-9 functions are `func_<addr>` address labels.
  Overlay relocation makes RAM/global/callee identity SUSPECT — the decode-comment RAM
  column is the wrong linear map; no semantic behavior is verified (no runtime trace /
  mutation evidence).
- **Hypothesis-grade roles:** the "army-management / F3DEX display-list builder /
  character-data consumer" descriptions are structural + parent-DB inferences, not
  runtime-proven.
- **Jump-table dispatcher targets** (`func_00095258`@`0x96930` 9-case;
  `func_000A0560`@`0xA06F0` 7-case) read from `0x801F…` relocated overlay RAM — the
  target tables and case destinations are not resolved.
- **Parent DB caveats still apply downstream:** over-merges and preamble-orphans recur
  in other chunks; treat parent boundaries as leads, validate from disasm. (Chunk 9
  itself was unusually clean — 1 preamble-orphan, 0 over-merges.)

## 14. Reviewer Checklist
- [ ] `git status --short --branch` → clean `## main`; `git log --oneline -3` shows the
  review-handoff commit, `3bc5e2b`, `d86e9f5`.
- [ ] `node tools/check_manifest.js` → ALL CHECKS PASS (10 chunks / 1,576 parts).
- [ ] `node tools/check_boundaries.js --splits build/chunk_00091000-000a1000_splits.json --disasm build/original-mips/rev0/code_00091000_000A1000.s` → PASS (re-run requires the gitignored splits+disasm; regenerate via the pipeline if absent).
- [ ] `node tools/assemble_original_mips.js` → byte-exact (code SHA `40D4E787…B409`);
  `node tools/verify_setup.js` → PASS (10 / 1,576 / 90; ROM `571E8339…CC67A`).
- [ ] Spot-check suspicious files: `func_00090e54_chunk9tail.s` (straddler-tail, no
  prologue, ends `jr $ra`@`0x912EC`); `func_000A0DAC_chunk9head.s` (straddler-head, true
  entry `0xA0DAC`, no `jr $ra`, last word `bne`); `func_00095258.s` (preamble-orphan —
  header note + entry label at `0x95258`, contains the `jr $v0`@`0x96930` dispatch);
  `func_000a0560.s` (`jr $v0`@`0xA06F0` dispatch, single function).
- [ ] Confirm docs/counts match: AGENTS.md / DECOMP_LOG.md / NEXT_STEPS.md /
  PLATFORM.md / WORKFLOW.md all say 10 chunks / 1,576 files / 90 fallback / frontier
  `0x000A1000`.
- [ ] Confirm next frontier `0x000A1000` and the `func_000A0DAC_chunk10tail`
  `[0xA1000,0x000A118C)` first-action.
- [ ] Confirm chunk 9 is classified ALL CODE (0 data parts) and that the two
  jump-table dispatchers' target tables are in relocated RAM, not inline ROM.
- [ ] Confirm 0 root scratch tracked and 0 data files with function wording.
