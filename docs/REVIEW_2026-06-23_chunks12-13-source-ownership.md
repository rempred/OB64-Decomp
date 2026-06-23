# Review Handoff: 2026-06-23 Chunks 12–13 Source-Ownership + Retroactive Audits (`0x000C1000..0x000E1000`)

Self-contained handoff for a fresh reviewer. Static/offline; exact byte-for-byte
rebuild preserved. This run also performed two one-shot retroactive audits of the
already-completed chunks 0–11. Per-byte detail: `docs/dossiers/lib-chunk12-C1000-D1000.md`,
`docs/dossiers/lib-chunk13-D1000-E1000.md`.

## 1. Title
Review Handoff — Chunks 12 & 13 Source-Ownership + retroactive parent/data audits,
ROM z64 `0x000C1000..0x000E1000`, run date 2026-06-23.

## 2. TL;DR
- **Completed:** chunk 12 (`0xC1000..0xD1000`, ALL CODE) + chunk 13 (`0xD1000..0xE1000`,
  MIXED code+data), plus two one-shot retroactive audits of chunks 0–11.
- **Chunk 12:** **74 parts** = 72 code `func_*` + 2 straddler markers + 0 data.
- **Chunk 13:** **67 parts** = 27 code (26 `func_*` + 1 straddler-tail) + 40 data.
  First MIXED chunk since chunk 8.
- **Tracked source files:** 1,802 → 1,876 (chunk 12) → **1,943** (chunk 13), +141.
- **Generated fallback chunks:** 88 → 87 → **86**.
- **Source-owned bytes:** chunks 0–13 = `0x1000..0xE1000` = **917,504 B = 32.2021 %**
  of the 2,849,204-byte evidenced executable extent.
- **Code-only classified:** ≈ **760,884 B (26.70 %)** (chunk 12 all-code +65,536; chunk
  13 code +39,704; chunk 13 added **25,832 data bytes**).
- **Exact rebuild preserved:** YES — code SHA `40D4E787…B409`, ROM SHA `571E8339…CC67A`,
  both unchanged.
- **Current frontier:** `0x000E1000` (chunk 14). Working tree clean.
- **No tool changes** in either chunk.

## 3. Commits (this run, newest first)
| Hash | Category | Purpose |
|---|---|---|
| _(this doc's commit)_ | review handoff | Add chunks 12–13 review handoff (final commit) |
| `bb8137b` | source + docs | Source-own chunk 13 (67 parts, MIXED); dossier `lib-chunk13` + data-index inventory + doc updates |
| `2fb03ed` | source + docs | Source-own chunk 12 (74 parts); dossier `lib-chunk12` + doc updates |
| `a7eafdf` | audits | One-shot retroactive audits of chunks 0–11 (parent-evidence + data-inventory); 8 data-index JSONs |
| `5b267f8` | doc fix (opening) | Chunks 10–11 review nit: placeholder `_(this doc's commit)_` → real hash `6ef38f1` |

## 4. Opening Fixes (commit `5b267f8`)
1. **`docs/REVIEW_2026-06-22_chunks10-11-source-ownership.md`** — replaced the
   commit-table placeholder `_(this doc's commit)_` with the real review-handoff hash
   **`6ef38f1`**.
2. **Stale sweep:** confirmed all current-state docs read 12 chunks / 1,802 files / 88
   fallback / frontier `0x000C1000` before chunk-12 work; no stale text found.

## 5. One-shot Retroactive Audits of chunks 0–11 (commit `a7eafdf`, no `.s` changes)
### 5a. Parent-evidence audit — `docs/audit/2026-06-23-parent-evidence-audit-chunks0-11.md`
Reconciled 1,128 parent functions (`scripts/ob64_functions.json` / `ob64_symbols_v2.json`
/ `ob64_xrefs.json`) + `editor/` + `MIPS_Decode.md` references against our 1,802
manifest parts, RAM↔ROM↔Rev-reconciled. Result: **3 CONFIRMED LEADS, 3 REJECTED, 0
CONTRADICTIONS, 0 PROVEN MISTAKES — no `.s`/name/boundary fix required.**
- Confirmed leads (recorded, NOT auto-applied — conservative names retained):
  `0x283C4` = editor squadblob-bootstrap injection block (`editor/squadblob.js`, RAM
  `0x80097FC4`); `0x60988` = combat action table (`MIPS_Decode.md`); `0x23460` =
  `seed::memcpy_like`.
- Two parent "disagreements" VINDICATE our splits: parent fn `0x2E348` (size 548)
  over-runs our clean `jr $ra` epilogue `0x2E448` by 0x11C bytes into RSP vector
  microcode — our `func_0002E348` end `0x2E450` + `data_0002E450_rsp_ucode` are right;
  parent `0x30008..0x30074` "leaf" is a host-disassembler false positive inside that
  ucode blob.
- ~30.4 % of code bytes carry a specific parent name; 0 % contradict ours.

### 5b. Data-inventory audit — `docs/audit/2026-06-23-data-inventory-audit-chunks0-11.md`
130,788 data bytes across 121 parts (parsed 22,408 / raw-but-classified 95,384 /
undecoded 12,996). **8 machine-readable indexes** written under `docs/data-index/rev0/`
(mission/options/element/attack/item/controller-pak string pools + two fixed-stride
record tables), all parse-valid, offsets cross-checked vs manifest.
- 2 mislabel candidates reviewed and **kept as-is** after cross-reference:
  `data_000283C4` is a meaningful reserved injection region (parent evidence), not mere
  padding; `rodata_000613b0` is mixed-class (string sub-range indexed; trailing
  pointer/record data noted) — a follow-up note, not a hard mistake.
- Follow-ups recorded: decode the two parsed record tables' fields; wire string pools
  to their parallel pointer tables; ucode-aware disasm of the chunk-3 undecoded blobs.

## 6. Work Completed

### Chunk 12 (`0xC1000..0xD1000`), ALL CODE — 74 parts
- FP-math + dispatcher-heavy `character::char-data consumer` code (chunk 9–11 family).
- Straddler-in `func_000C0EDC_chunk12tail [0xC1000,0xC132C)`; straddler-out
  `func_000D0B8C_chunk12head [0xD0B8C,0xD1000)` → `0x000D110C` in chunk 13.
- **Deferred-prologue `func_000C132C [0xC132C,0xC1578)`:** the parent labels the start
  at the prologue `0xC1364`, but the function begins with ~56 B of frameless setup (the
  `addiu $sp,-0x10`@`0xC1364` is in a `bne` delay slot); true entry `0xC132C`.
- 12 frameless leaves; ~24 preamble-orphans; **20 internal `jr$reg` dispatchers**
  (`0xC48A4..0xD0FBC`, tables in `0x801EF…/0x801F…` relocated RAM).

### Chunk 13 (`0xD1000..0xE1000`), MIXED — 67 parts (27 code + 40 data)
| Region | Range | Bytes | Class | Parts |
|---|---|---:|---|---:|
| STRADDLER+CODE | `0xD1000..0xDAB18` | 39,704 | code | 27 (1 straddler-tail + 26 `func_`) |
| DATA | `0xDAB18..0xE1000` | 25,832 | data | 40 |
- Straddler-in `func_000D0B8C_chunk13tail [0xD1000,0xD110C)`. Code: 26 fns + tail, 13
  preamble-orphans, 6 frameless leaves, ~17 `jr$reg` dispatchers.
- **Code→data boundary `0xDAB18`** (adversarially confirmed): last fn ends `jr $ra`@
  `0xDAB10`; data begins (`0xDAB20` = ASCII "Type").
- DATA = unit/battle-management UI data (see §8).

## 7. Parent DB / Overlay Contradictions & Mistakes Corrected
- **Chunk 12 (adversarial, 3 fixes):** 3 preamble-orphans `func_000c6bec`/`func_000c71e0`/
  `func_000c7d00` — the analysis agent noted the read-before-write `lui/lw 0x80196AF8`
  fold but left it in the previous function's tail; folded forward (boundaries shifted
  back 8 B). 0 other disproofs across 5 adversarial agents.
- **Chunk 13 (adversarial, 0 fixes):** all boundaries confirmed first time. Code 27 fns
  ↔ 27 `jr $ra` (1:1, no under-split); data 100 % data (0 prologues / 0 `jr $ra`); all
  data classes + boundaries + the straddler confirmed.
- **Overlay invariants (both chunks):** all `jr$reg` are jump-table dispatches reading
  `0x801F…` relocated overlay RAM (NOT inline ROM, NOT boundaries); `j 0x801xxxxx` are
  overlay tail-jumps. FP constants built in-stream (`lui/ori`/`mtc1`), not float-data.

## 8. Data Classification (chunk 13 — the only data this run)
**Total data: 25,832 B in 40 parts** (`docs/data-index/rev0/chunk13-data-region-inventory.json`).
By class: string-pool (`rodata_`) 984 B / RAM-pointer-table (`table_`) 7,548 B /
zero-fill (`zero_fill_`) 216 B / packed-record (`data_`) 17,084 B.
- **State split:** parsed ≈ 216 B (zero-fill); raw-but-classified ≈ 24,544 B (string
  pools + pointer tables + classified records/display-list/floats); undecoded ≈ 1,072 B
  (the packed/glyph straddler + a small packed blob `data_000ddf60`).
- **Format families found:** unit/battle-management UI string pools (`0x0E/0x0F/0x10`/
  NUL framing — field labels "Type/Stats/Ele./Qty./Cost", weapon/armor/formation names,
  menu help "Returns character to reserves.…"); RAM-pointer tables (`0x801A..0x801E`
  band, with identical-pointer fill runs); IEEE float blocks (40.0/64.0/−32.0; 1.05/1.0
  + double π); an `E7…/DF…`-tagged display-list/command record stream (`data_000de250`,
  monotonic `0x06xxxxxx` offset word); a packed/glyph/compressed blob (the straddler).
- **No field semantics invented** — all hypothesis-grade structure is marked as such.
- **Outgoing data straddler:** `data_000e0bd0_chunk13head [0xE0BD0,0xE1000)` — a
  high-byte-dense (65.3 % ≥0x80, 0 % zero) packed/glyph blob with no terminator,
  continues into chunk 14. **Next data frontier: `data_000e1000_chunk14tail [0xE1000,?)`.**
- **Data files added:** 40 (`rodata_/table_/zero_fill_/data_` under `asm/original/rev0/lib/`).
  **Index files added:** 1 (`chunk13-data-region-inventory.json`) + the 8 from the retro
  data-inventory audit.

## 9. Tooling Changes
- **None** in either chunk. Reused tracked tools (`promote_original_mips`,
  `dump_function_context`, `plan_chunk`, `slice_chunk --disasm`, `integrate_chunk`,
  `check_splits`, `check_boundaries`, `check_manifest`, `split_original_mips_part`,
  `assemble_original_mips`, `verify_setup`, `audit_code_region`).
- Swarms run via the **Agent tool** (parallel). Chunk 12: 8 analysis + 5 adversarial.
  Chunk 13: 3 code-analysis + 4 data-classification + 3 adversarial. Audits: 2
  background research agents.
- **MIXED-chunk handling (chunk 13):** the code sub-region was planned/sliced with a
  narrower `--end 0xDAB18`; the data region was classified by a 4-agent data swarm; the
  code + data splits were combined into one full-chunk splits JSON (a node merge with
  contiguity validation + name dedup) before `split_original_mips_part`.
- **Gitignored scratch (NOT tracked):** `build/scan_chunk.js`, the per-chunk
  `build/chunk_*` splits/slices, `build/chunk13_data{A,B,C,D}_final.json`, and the two
  whole-chunk `build/original-mips/rev0/code_*.s`.

## 10. Verification (commands + key output)
- `node tools/check_manifest.js` → **ALL CHECKS PASS** (14 chunks, 1,943 parts).
- `node tools/check_boundaries.js --splits build/chunk_000c1000-000d1000_splits.json --disasm build/original-mips/rev0/code_000C1000_000D1000.s` → **PASS** (74 parts; 0 of each — after 3 preamble-orphan folds).
- `node tools/check_boundaries.js --splits build/chunk_000d1000-000e1000_splits.json --disasm build/original-mips/rev0/code_000D1000_000E1000.s` → **PASS** (67 parts: 27 code + 40 data; 0 fragment/cross/under/leak/straddler/data-island).
- `node tools/check_splits.js …` (both chunks) → 0 fragments.
- Adversarial: chunk 12 → 0 disproofs after 3 fixes; chunk 13 → 0 disproofs (code+data).
- Every byte `0xC1000..0xE1000` assigned to a tracked code/data part (no gaps/overlaps).
- `node tools/assemble_original_mips.js` → **Exact code-region match: PASS**, code SHA `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- `node tools/verify_setup.js` → **PASS**: 14 tracked composite chunks, **1,943** tracked files, **86** fallback; ROM SHA `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
- `node tools/audit_code_region.js` → OK (no credible code edge into the data tail).
- 0 data files with function/true-entry wording; 0 root scratch tracked; all
  `docs/data-index/rev0/*.json` parse as valid JSON with manifest-matching ranges.
- `git diff --check` → clean. `git status --short --branch` → `## main`, 0 uncommitted.

Summary numbers: **tracked chunks 14 · tracked files 1,943 · fallback 86 · code SHA
`40D4E787…B409` · ROM SHA `571E8339…CC67A` · frontier `0x000E1000`.**

## 11. Files Changed
- **Source `.s` (added):** 74 (chunk 12) + 67 (chunk 13: 27 `func_/straddler` + 40 data)
  = 141 under `asm/original/rev0/lib/`. **Removed:** temp whole-chunk `code_000C1000_…s`
  / `code_000D1000_…s` (`--remove-source`; promote-seeded, never committed).
- **Manifest:** chunk count 12→14, total parts 1,802→1,943.
- **Tools:** none.
- **Docs:** new `docs/dossiers/lib-chunk12-C1000-D1000.md`, `lib-chunk13-D1000-E1000.md`;
  new audits `docs/audit/2026-06-23-parent-evidence-audit-chunks0-11.md`,
  `…-data-inventory-audit-chunks0-11.md`; 9 new `docs/data-index/rev0/*.json` (8 audit +
  1 chunk-13 inventory); this review; updated `AGENTS.md`, `docs/DECOMP_LOG.md`,
  `docs/NEXT_STEPS.md`, `docs/PLATFORM.md`, `docs/WORKFLOW.md`; chunks-10–11 review hash fix.
- **Confirmed:** no root scratch tracked (root = `.gitattributes`, `.gitignore`,
  `AGENTS.md`, `README.md`).

## 12. Current Frontier
- **Next ROM address:** `0x000E1000` (chunk 14, `0xE1000..0xF1000`).
- **First required action:** continue the OUTGOING DATA straddler — emit
  `data_000e1000_chunk14tail [0xE1000,?)` as chunk 14's first part (the continuation of
  the packed/glyph blob `data_000e0bd0_chunk13head`); determine its end from the
  chunk-14 bytes (high-byte-dense packed/glyph/compressed data, no terminator).
- **Expected class:** unknown. Chunk 13 ended data-heavy — chunk 14 may continue as data
  or resume code. **Content-scan for DATA first.** Use the MIXED-chunk handling (data
  swarm + code swarm) if mixed.

## 13. Unresolved Caveats
- **Conservative code names:** all new functions are `func_<addr>` address labels;
  overlay relocation makes RAM/global/callee identity SUSPECT (no runtime trace).
- **Dispatcher target tables** (20 in chunk 12, 17 in chunk 13) read from `0x801F…`
  relocated overlay RAM — not resolved.
- **Chunk-13 data is conservatively classified** — the display-list/command record
  format, the packed/glyph blob structure, the `0x0E/0x0F/0x10` string-framing control
  bytes, and the pointer-table → string/handler wiring are NOT decoded (follow-up work).
- **Retro-audit follow-ups** (recorded, not done this run): decode the chunk-5/6 record
  tables' fields; wire string pools to pointer tables; ucode-aware disasm of chunk-3
  undecoded blobs; adopt confirmed parent names only with stronger evidence.

## 14. Reviewer Checklist
- [ ] `git status --short --branch` → clean `## main`; `git log --oneline -5` shows the
  review-handoff commit, `bb8137b`, `2fb03ed`, `a7eafdf`, `5b267f8`.
- [ ] `node tools/check_manifest.js` → ALL CHECKS PASS (14 chunks / 1,943 parts).
- [ ] `node tools/assemble_original_mips.js` → byte-exact (code SHA `40D4E787…B409`);
  `node tools/verify_setup.js` → PASS (14 / 1,943 / 86; ROM `571E8339…CC67A`).
- [ ] Chunk 12 spot-check: `func_000C132C.s` (deferred-prologue — entry 56 B before the
  `addiu $sp,-0x10`); `func_000c6bec.s`/`func_000c71e0.s`/`func_000c7d00.s` (preamble
  folds — entry label 8 B before the prologue).
- [ ] Chunk 13 spot-check: `func_000D0B8C_chunk13tail.s` (straddler-tail); confirm the
  code→data boundary (last `func_` ends `0xDAB18`, first `rodata_000dab18.s` is strings);
  `data_000de250.s` (display-list/command stream); `data_000e0bd0_chunk13head.s`
  (outgoing data straddler, ends `0xE1000`).
- [ ] Confirm docs/counts: AGENTS / DECOMP_LOG / NEXT_STEPS / PLATFORM / WORKFLOW all say
  14 chunks / 1,943 files / 86 fallback / frontier `0x000E1000`.
- [ ] Confirm next frontier `0x000E1000` and the `data_000e1000_chunk14tail [0xE1000,?)`
  first-action (data continuation).
- [ ] Confirm the two audit reports (`docs/audit/`) and 9 `docs/data-index/rev0/*.json`
  exist, parse, and that no `.s` file was churned by the audits.
- [ ] Confirm 0 root scratch tracked; 0 data files with function/true-entry wording.
