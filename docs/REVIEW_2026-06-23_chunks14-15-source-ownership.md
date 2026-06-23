# Review Handoff: 2026-06-23 Chunks 14–15 Source-Ownership (`0x000E1000..0x00101000`)

Self-contained handoff for a fresh reviewer. Static/offline; exact byte-for-byte rebuild
preserved. Per-byte detail: `docs/dossiers/lib-chunk14-E1000-F1000.md`,
`docs/dossiers/lib-chunk15-F1000-101000.md`.

## 1. Title
Review Handoff — Chunks 14 & 15 Source-Ownership, ROM z64 `0x000E1000..0x00101000`,
run date 2026-06-23.

## 2. TL;DR
- **Completed:** chunk 14 (`0xE1000..0xF1000`, MIXED, 4 interleaved regions) + chunk 15
  (`0xF1000..0x101000`, MIXED, 5 interleaved regions, code-heavier).
- **Chunk 14:** **94 parts** = 74 code (73 `func_*` + 1 straddler-head) + 20 data.
- **Chunk 15:** **153 parts** = 134 code (incl. 1 incoming straddler-tail) + 19 data.
- **Tracked source files:** 1,943 → 2,037 (chunk 14) → **2,190** (chunk 15), +247.
- **Generated fallback chunks:** 86 → 85 → **84**.
- **Source-owned bytes:** chunks 0–15 = `0x1000..0x101000` = **1,048,576 B = 36.80 %**
  of the 2,849,204-byte evidenced executable extent.
- **Code-only classified:** ≈ **864,164 B (30.33 %)** (chunk 14 code +~47,692; chunk 15
  code +55,588; chunk 14 added 17,828 data bytes, chunk 15 added 9,948 data bytes).
- **Exact rebuild preserved:** YES — code SHA `40D4E787…B409`, ROM SHA `571E8339…CC67A`,
  both unchanged.
- **Current frontier:** `0x00101000` (chunk 16). Working tree clean.
- **No tool changes** in either chunk.

## 3. Commits (this run, newest first)
| Hash | Category | Purpose |
|---|---|---|
| `68d8bfc` | review handoff | Add chunks 14–15 review handoff (this file, final commit) |
| `32b14b6` | source + docs | Source-own chunk 15 (153 parts, MIXED); dossier `lib-chunk15` + data-index inventory + doc updates |
| `5c2459c` | source + docs | Source-own chunk 14 (94 parts, MIXED); dossier `lib-chunk14` + data-index inventory + doc updates |
| `f611ae8` | doc fix (opening) | Chunks 12–13 review nit: placeholder `_(this doc's commit)_` → real hash `f99a9b9` |

## 4. Opening Fixes (commit `f611ae8`)
1. **`docs/REVIEW_2026-06-23_chunks12-13-source-ownership.md`** — replaced the
   commit-table placeholder `_(this doc's commit)_` with the real review-handoff hash
   **`f99a9b9`**.
2. **Stale sweep:** confirmed all current-state docs read 14 chunks / 1,943 files / 86
   fallback / frontier `0x000E1000` before chunk-14 work; no stale text found.
3. **Prior audits confirmed (not redone):** the two retro-audit reports under
   `docs/audit/` and all 10 `docs/data-index/rev0/*.json` (8 retro + chunk-13 + chunk-14)
   parse as valid JSON.

## 5. Work Completed

### Chunk 14 (`0xE1000..0xF1000`), MIXED — 94 parts (74 code + 20 data)
Four ROM-ordered regions: graphics/display-list DATA `0xE1000..0xE48F0` → DL-builder /
char-data CODE `0xE48F0..0xEAEFC` → pointer-table DATA island `0xEAEFC..0xEBBB0` (with
real debug format strings `"speech.c…"`/`"Kao No Error"`) → char-data/FP CODE
`0xEBBB0..0xF1000`. Incoming DATA straddler `data_000e1000_chunk14tail [0xE1000,0xE13D0)`
(continues chunk-13's packed/glyph blob; ends at the first `DF000000` display-list
record). Outgoing FUNCTION straddler-head `func_000F0F64_chunk14head [0xF0F64,0xF1000)`.

### Chunk 15 (`0xF1000..0x101000`), MIXED, code-heavier — 153 parts (134 code + 19 data)
| Region | Range | Bytes | Class | Parts |
|---|---|---:|---|---:|
| incoming straddler-tail | `0xF1000..0xF1354` | 852 | code | 1 |
| CODE R1 | `0xF1354..0xF8550` | 29,180 | code | 60 |
| DATA R1 (floats/ptrs/DL) | `0xF8550..0xF9FF8` | 6,824 | data | 12 |
| CODE R2 | `0xF9FF8..0x1003CC` | 25,556 | code | 73 |
| DATA R2 (records/rodata/tail) | `0x1003CC..0x101000` | 3,124 | data | 7 |

Incoming straddler-tail `func_000F0F64_chunk15tail [0xF1000,0xF1354)`. CODE R1:
dispatcher `func_000F1354`, two frameless float-lerp clusters, 8 preamble-orphans. CODE
R2: 23 recovered frameless leaves, 2 `jr$reg` dispatchers, 1 dual-entry leaf, 1
preamble-orphan. DATA: float32/float64 tables, 2 large F3DEX display-list blobs, 3
RAM-pointer tables, packed records, the **OB64 opening-prologue narration rodata**
(see §8), and a fixed-stride 0x50-byte float-record table ending in an outgoing DATA
straddler `data_00100fd4_chunk15head [0x100FD4,0x101000)`.

## 6. Parent DB / Overlay Boundaries Corrected
- **Chunk 14 (adversarial, 2 fixes):** (1) the data→code boundary is **`0xE48F0`** NOT
  the parent's first framed fn `0xE4BE0` — 3 frameless DL-builder functions
  (`func_000e48f0`/`4930`/`495c`) precede it; (2) preamble-orphan true entry **`0xEBBB0`**
  NOT `0xEBBC0` (4-word read-before-write `lui/lbu 0x800E7A32`). 0 other disproofs.
- **Chunk 15 (deterministic gate, 6 fixes):** the slice agents correctly *identified* but
  left *unmerged* 5 preamble-orphans (`0xF55CC`/`0xF57C4`/`0xF59BC`/`0xF6258`/`0xF62D0`,
  each merged into the function it feeds) + 1 delay-slot leak (`func_000F2FE4` was missing
  its `jr $ra` delay-slot nop at `0xF3098`). `check_boundaries` flagged all 6 as
  fragments/leak before the adversarial pass.
- **Chunk 15 (adversarial swarm, 3 more fixes):** code-region R1 verifier disproved
  (1) preamble-orphan `0xF286C` (`lui/lw $v0` read at `0xF28AC` before write) wrongly
  attached to `func_000F26DC`'s tail; (2) preamble-orphan `0xF4AFC` (`mtc1 $a1,$f4` read at
  `0xF4B24`) wrongly attached to `func_000F4AA4`'s tail; (3) a missed frameless leaf
  `func_000F8480 [0xF8480,0xF84AC)` (big-endian word-loader, not fall-through-reachable
  from `func_000F8310`). **Code-region R2 and BOTH data regions: 0 disproofs.**
- **Overlay invariants (both chunks):** `jr$reg` are jump-table dispatches reading
  `0x801A…` relocated overlay RAM (NOT boundaries); `j 0x801xxxxx` are overlay tail-jumps.
  FP constants built in-stream (`lui/ori`/`mtc1`), not float-data.

## 7. Straddler Refinements
- **Chunk 13 → 14:** the chunk-13 outgoing packed/glyph blob `data_000e0bd0_chunk13head`
  continues as `data_000e1000_chunk14tail [0xE1000,0xE13D0)`; true end `0xE13D0`
  pinned at the first `DF000000` display-list record (chunk-14 first action).
- **Chunk 14 → 15:** `func_000F0F64`'s tail end is **`0xF1354`**, refined from the
  chunk-14 estimate `0xF135C`. The function returns `jr $ra@0xF134C` + epilogue `@0xF1350`
  and ends at `0xF1354`; the *next* function `func_000F1354` carries a 2-word
  read-before-write preamble at `0xF1354` ahead of its parent-labeled prologue at
  `0xF135C`. The chunk-14 dossier was corrected accordingly.
- **Chunk 15 → 16:** `data_00100fd4_chunk15head [0x100FD4,0x101000)` is a truncated
  fixed-stride 0x50-byte (20-word) float/param record — only 11 of 20 words fit before
  the chunk edge; chunk 16's first word `0x42340000 = 45.0` is record word[11] (stride
  proven by the header marker recurring every `0x50` at `0x100E94→EE4→F34→F84→FD4`).

## 8. Data Classification
- **Chunk 14 — 17,828 B in 20 parts** (`docs/data-index/rev0/chunk14-data-region-inventory.json`).
  By class: packed/record 14,728 B / RAM-pointer-table 3,008 B / zero-fill 92 B. Format
  families: packed/glyph/compressed graphics; F3D/RDP display-list (E7/DF/E3/DE markers);
  4bpp indexed-pixel/glyph blobs; RAM-pointer tables with fill runs; real debug format
  strings.
- **Chunk 15 — 9,948 B in 19 parts** (`docs/data-index/rev0/chunk15-data-region-inventory.json`).
  By class: display-list/graphics 4,148 B · ascii rodata 1,840 B · packed/record 1,488 B
  · float32-table 1,232 B · float-record-table 412 B · float64/pointer-mixed 356 B ·
  packed-byte/color 204 B · ram-pointer-table 176 B · zero-fill 92 B.
- **The OB64 opening-prologue narration** `rodata_001006f0 [0x1006F0,0x100E20)` (1,840 B):
  ASCII text `"@0Palatinean Year 238…The Holy Lodis Empire, located on the…western region
  of the continent of Galicia,…"` with `@`-prefixed inline format codes (`@0..@3`, `@w`,
  `@c`, `@e`) and NUL padding. **Verified by byte-level decode.** A data-hunter adversary
  confirmed the text and the fixed-stride record table; a second confirmed DATA R1.
- **No field semantics invented** — float/ascii/zero parsed where literally readable;
  display-list/packed/pointer/float-record kept raw-but-classified.

## 9. Parent-Workspace Evidence Sweep (chunks 14–15)
A background research agent swept the **parent** workspace (`C:\Users\Joe\Projects\OgreBattlel64`,
NOT this subfolder):
- **Code is prior art:** parent `scripts/ob64_symbols_v2.json` / `ob64_symbols.json` /
  `ob64_overlay_map.json` enumerate **140 functions** across the two chunks (48 in chunk
  14, 92 in chunk 15) with sizes, frame sizes, call-graphs, and per-state runtime slots
  across 21 named savestate snapshots — proving these are **scenario/combat overlays**
  that relocate **non-linearly** (static `0x8015…/0x8016…` → runtime up to `~0x80242…`).
  A handful carry heuristic semantic-cluster labels (chunk 15: `resource loader @0xFBC80`,
  `dispatcher/state-machine @0xFBF00`, `char-data consumer @0xF5BC4`). **Recorded as LEADS
  only** — names here stay conservative `func_*` per the overlay-relocated rule.
- **The 0x1006F0 opening narration is NEW territory** — not documented anywhere in the
  parent (parent text dumps / `wiki/` contain "Lodis"/"Palatinean"/"Galicia" only as
  mid-game dialogue place-names, never the opening prologue). This effort's
  `rodata_001006f0.s` + the chunk-15 data inventory are the first index of it.
- `docs/cutscene-system.md` references a live-RAM "shared sprite handler/vtable" at
  `0x80164770` (≈ ROM `0xF4F04`) — a plausible cross-reference, not statically tied.

## 10. Tooling Changes
- **None** in either chunk. Reused tracked tools (`promote_original_mips`,
  `dump_function_context`, `plan_chunk`, `slice_chunk --disasm`, `check_splits`,
  `check_boundaries`, `check_manifest`, `split_original_mips_part`,
  `assemble_original_mips`, `verify_setup`, `audit_code_region`).
- Swarms run via the **Agent tool** (parallel). Chunk 14: 5 analysis + 3 data + 4
  adversarial. Chunk 15: 8 slice-analysis + 2 data + 4 adversarial + 1 background
  parent-evidence sweep.
- **MIXED-chunk handling:** code sub-regions planned/sliced with narrower `--end`s; data
  regions classified by data swarms; code + data combined into one full-chunk splits JSON
  (node merge with contiguity validation + name dedup) before `split_original_mips_part`.
- **Two combine-time mechanics worth noting (chunk 15):** (a) one data agent emitted part
  `start`/`end` as **decimal**, normalized to canonical `0x`-hex in the combine; (b) the
  preamble-orphan `label` field must be the part's **own name** (a symbol at the true
  entry), NOT the inner parent-DB prologue label — the latter is already embedded in the
  body and duplicating it triggers a `symbol already defined` assembler error. Caught at
  the `assemble` gate, fixed, re-split cleanly.
- **Gitignored scratch (NOT tracked):** `build/scan_chunk.js`, the per-chunk `build/chunk_*`
  splits/slices, `build/chunk15_data{A,B}_final.json`, the whole-chunk
  `build/original-mips/rev0/code_*.s`.

## 11. Verification (commands + key output)
- `node tools/check_manifest.js` → **ALL CHECKS PASS** (16 chunks, 2,190 parts).
- `node tools/check_boundaries.js --splits build/chunk_000f1000-00101000_splits.json --disasm build/original-mips/rev0/code_000F1000_00101000.s` → **PASS** (153 parts; 0 fragment/cross/under/leak/straddler/data-island; the 2 `<=12B` files are valid leaves with returns).
- `node tools/check_splits.js …` → 0 fragments.
- Adversarial: chunk 14 → 0 disproofs after 2 fixes; chunk 15 → 3 R1 fixes (after 6
  deterministic-gate fixes), R2 + both data regions 0 disproofs.
- Every byte `0xE1000..0x101000` assigned to a tracked code/data part (no gaps/overlaps).
- `node tools/assemble_original_mips.js` → **Exact code-region match: PASS**, code SHA `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- `node tools/verify_setup.js` → **PASS**: 16 tracked composite chunks, **2,190** tracked files, **84** fallback; ROM SHA `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
- `node tools/audit_code_region.js` → OK (no credible code edge into the data tail).
- 0 data files with function/true-entry wording; 0 root scratch tracked; all
  `docs/data-index/rev0/*.json` parse as valid JSON with manifest-matching ranges.
- `git diff --check` → clean.

Summary numbers: **tracked chunks 16 · tracked files 2,190 · fallback 84 · code SHA
`40D4E787…B409` · ROM SHA `571E8339…CC67A` · frontier `0x00101000`.**

## 12. Files Changed
- **Source `.s` (added):** 94 (chunk 14) + 153 (chunk 15) = 247 under
  `asm/original/rev0/lib/`. **Removed:** temp whole-chunk `code_000E1000_…s` /
  `code_000F1000_…s` (`--remove-source`; promote-seeded, never committed).
- **Manifest:** chunk count 14→16, total parts 1,943→2,190.
- **Tools:** none.
- **Docs:** new `docs/dossiers/lib-chunk14-E1000-F1000.md`, `lib-chunk15-F1000-101000.md`;
  new `docs/data-index/rev0/chunk14-…json`, `chunk15-data-region-inventory.json`; this
  review; updated `AGENTS.md`, `docs/DECOMP_LOG.md`, `docs/NEXT_STEPS.md`,
  `docs/PLATFORM.md`, `docs/WORKFLOW.md`; chunk-14 dossier straddler note (`0xF135C`→`0xF1354`).

## 13. Current Frontier
- **Next ROM address:** `0x00101000` (chunk 16, `0x101000..0x111000`).
- **First required action:** continue the OUTGOING DATA straddler — emit
  `data_00101000_chunk16tail` as chunk 16's first part (the remaining 9 words of the
  truncated 0x50-byte float/param record `data_00100fd4_chunk15head`, beginning with
  `0x42340000 = 45.0` = record word[11]); content-scan for the record-array end.
- **Expected class:** MIXED. Content-scan for DATA first (the tail data continues), then
  resume code; use the MIXED-chunk handling (data swarm + code swarm).

## 14. Unresolved Caveats
- **Conservative code names:** all new functions are `func_<addr>` address labels;
  overlay relocation makes RAM/global/callee identity SUSPECT (no runtime trace). Parent
  symbol-DB semantic labels recorded as leads, not adopted.
- **Dispatcher target tables** read from `0x801A…` relocated overlay RAM — not resolved.
- **Data is conservatively classified** — the F3DEX display-list/command format, the
  packed-record / packed-glyph structure, the pointer-table wiring, and the float-record
  table fields are NOT decoded (follow-up). The `rodata_001006f0` opening narration is the
  most decode-ready datum (clean ASCII + `@`-format codes) — a natural text-table seed.

## 15. Reviewer Checklist
- [ ] `git status --short --branch` → clean `## main`; `git log --oneline -5` shows the
  review-handoff commit, `32b14b6`, `5c2459c`, `f611ae8`.
- [ ] `node tools/check_manifest.js` → ALL CHECKS PASS (16 chunks / 2,190 parts).
- [ ] `node tools/assemble_original_mips.js` → byte-exact (code SHA `40D4E787…B409`);
  `node tools/verify_setup.js` → PASS (16 / 2,190 / 84; ROM `571E8339…CC67A`).
- [ ] Chunk 14 spot-check: `func_000ebbb0.s` (preamble-orphan true entry 0xEBBB0);
  `func_000e48f0.s`/`func_000e4930.s`/`func_000e495c.s` (3 frameless DL builders before
  the parent's first framed fn); `data_000eaf10.s` (debug format strings).
- [ ] Chunk 15 spot-check: `func_000F0F64_chunk15tail.s` (straddler-tail, ends 0xF1354);
  `func_000F286C.s`/`func_000F4AFC.s` (adversarial preamble-orphan fixes);
  `func_000F8480.s` (recovered frameless leaf); `rodata_001006f0.s` (opening narration);
  `data_00100fd4_chunk15head.s` (outgoing data straddler, ends 0x101000).
- [ ] Confirm docs/counts: AGENTS / DECOMP_LOG / NEXT_STEPS / PLATFORM / WORKFLOW all say
  16 chunks / 2,190 files / 84 fallback / frontier `0x00101000`.
- [ ] Confirm next frontier `0x00101000` and the `data_00101000_chunk16tail` first-action
  (data continuation of the truncated float record).
- [ ] Confirm both data-index inventories (`chunk14`, `chunk15`) exist, parse, and match
  the manifest ranges; 0 data files with function/true-entry wording; 0 root scratch.
