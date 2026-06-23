# Review Handoff: 2026-06-23 Chunks 18–19 Source-Ownership (`0x00121000..0x00141000`)

Self-contained handoff for a fresh reviewer. Static/offline; exact byte-for-byte rebuild
preserved. Per-byte detail: `docs/dossiers/lib-chunk18-121000-131000.md`,
`docs/dossiers/lib-chunk19-131000-141000.md`.

## 1. Title
Review Handoff — Chunks 18 & 19 Source-Ownership, ROM z64 `0x00121000..0x00141000`,
run date 2026-06-23.

## 2. TL;DR
- **Completed:** chunk 18 (`0x121000..0x131000`, ALL CODE) + chunk 19 (`0x131000..0x141000`,
  MIXED — encounter/dispatcher code + a trailing scenario data region), plus opening
  doc/log fixes (review-hash nit + DECOMP_LOG compaction).
- **Chunk 18:** **95 parts** = 95 code (1 incoming straddler-tail + 93 fns + 1 outgoing
  straddler-head) + 0 data.
- **Chunk 19:** **80 parts** = 64 code (incl. 1 incoming straddler-tail) + 16 data.
- **Tracked source files:** 2,351 → 2,446 (chunk 18) → **2,526** (chunk 19), +175.
- **Generated fallback chunks:** 82 → 81 → **80**.
- **Source-owned bytes:** chunks 0–19 = `0x1000..0x141000` = **1,310,720 B = 46.0030 %**
  of the 2,849,204-byte evidenced executable extent.
- **Code-only classified:** ≈ **1,103,712 B (38.7376 %)** (chunk 18 all code +65,536;
  chunk 19 code +46,156, data +19,300).
- **Exact rebuild preserved:** YES — code SHA `40D4E787…B409`, ROM SHA `571E8339…CC67A`,
  both unchanged.
- **Current frontier:** `0x00141000` (chunk 20). Working tree clean.
- **No tool changes** (the durable `tools/decode_rodata_strings.js` from the prior run was
  not needed — chunk 19 data has no ASCII text).

## 3. Commits (this run, newest first)
| Hash | Category | Purpose |
|---|---|---|
| `e1b54b1` | review handoff | Add chunks 18–19 review handoff (this file, final commit) |
| `e34016f` | source + docs | Source-own chunk 19 (80 parts, MIXED); dossier `lib-chunk19` + data-index inventory + doc updates |
| `a4d07c5` | source + docs | Source-own chunk 18 (95 parts, ALL CODE); dossier `lib-chunk18` + doc updates |
| `be7a250` | opening fixes | Chunks 16–17 review nit (hash bcb8d67) + stale Next-Frontier sentence fix + DECOMP_LOG compaction (archived 2026-06-21 audits + chunks 8–13) |

## 4. Opening Fixes (commit `be7a250`)
1. **`docs/REVIEW_2026-06-23_chunks16-17-source-ownership.md`** — replaced the
   commit-table placeholder `_(this doc's commit)_` with the real hash **`bcb8d67`**.
2. **Stale Next-Frontier sentence** — the DECOMP_LOG "two active tracks" line said the
   library track continues at `0x111000`/chunk 17; corrected to `0x121000`/chunk 18 (and
   advanced through this run to `0x141000`/chunk 20).
3. **DECOMP_LOG compaction (701 → 410 lines):** archived the 2026-06-21 code-region audit
   entries + the chunk 8–13 detailed split entries to
   `docs/archive/DECOMP_LOG-2026-06-23-audits-and-chunks8-13.md`, leaving the preamble,
   chunks 14–17, and the Next Frontier. Durable facts preserved in the archive, the
   dossiers, and `docs/CODE_REGION_AUDIT.md`. (The log was re-extended with chunks 18–19
   this run.)
4. **Verified** the chunk-15 opening-prologue export still round-trips byte-exact
   (`data/decoded/rev0/dialogue/chunk15-opening-prologue.md`,
   `docs/data-index/rev0/chunk15-opening-prologue-strings.json`,
   `tools/decode_rodata_strings.js`); all 13 (now 14) data-index JSONs parse; no data files
   carry function wording; clean root.

## 5. Work Completed

### Chunk 18 (`0x121000..0x131000`), ALL CODE — 95 parts (95 code + 0 data)
- Incoming straddler-tail `func_00120FC4_chunk18tail [0x121000,0x1211F8)` (FP-heavy
  0x50-frame fn, float consts from out-of-chunk `0x801F` rodata); ~93 functions (62 framed
  + 8 preamble-orphans + 23 frameless leaves); outgoing straddler-head `func_00130E60
  [0x130E60,0x131000)` → `0x131050` in chunk 19.
- `jr $v0` jump-table dispatchers (`0x124888`/`0x124AB0`/`0x12680C`/`0x12E238`) and
  `j 0x801Cxxxx/0x801Dxxxx` overlay tail-jumps kept internal; FP instructions are CODE; **no
  inline float pool**.

### Chunk 19 (`0x131000..0x141000`), MIXED — 80 parts (64 code + 16 data)
| Region | Range | Bytes | Class | Parts |
|---|---|---:|---|---:|
| incoming straddler-tail | `0x131000..0x131050` | 80 | code | 1 |
| CODE (encounter/dispatcher) | `0x131050..0x13C49C` | 46,156 | code | 63 |
| DATA (trailing) | `0x13C49C..0x141000` | 19,300 | data | 16 |
- Dispatcher-heavy encounter code; parent over-merge `func_00131388` split into 5 fns; 9
  preamble-orphans + 9 frameless leaves. **Last code fn `func_0013C060 [0x13C060,0x13C49C)`
  = the parent-documented `neutralEncounterDispatcher`** (name kept conservative).
- DATA: bit-pattern LUT → three `0x801E`-band RAM-pointer tables → a fixed-stride
  record/script table `[0x13C550,0x13D824)` (16-byte rows, monotonic index field; fields
  not decoded) → packed-fill/high-byte blocks → packed-byte tail. **Outgoing DATA straddler
  `data_00140EA0_chunk19head [0x140EA0,0x141000)`** continues into chunk 20.

## 6. Parent DB / Overlay Contradictions & Corrections
- **CHUNK-19 LINEAR-MAP FALLACY CORRECTED (the headline finding):** the parent sweep
  flagged "live combat code" at ROM `0x13DD74`/`0x13EE90`/`0x140180` in the
  `0x13C498..0x141ED0` "gap" (a wiki battle-turn-queue trace mapping RAM `0x801AFD80` →
  ROM `0x140180` by the discredited linear `ROM = RAM − 0x8006FC00`). **DISPROVEN** by
  byte-exact Rev 0 AND **independently refuted by the adversarial data-hunter**: the region
  `[0x13C49C,0x141000)` has **0 `addiu $sp,-N` prologues, 0 `jr $ra` (0x03E00008), 0
  `sw $ra`** — no function is possible; the bytes are packed DATA (`0x13DD74=0x5B875B09`;
  `0x140180=0x294B2109`). The region is classified ALL DATA.
- **Chunk 18 adversarial (3 agents, 1 fix):** a missed frameless leaf — `func_0012EC6C`
  contained two `jr $ra`; split off `func_0012ECDC` at `0x12ECDC`. code-A/B: 0 disproofs.
- **Chunk 19 adversarial (4 agents, 0 disproofs):** all code boundaries, the 5-way
  `func_00131388` split, the preamble-orphans, `func_0013C060`, and every data sub-boundary
  + the straddler confirmed.
- **Overlay invariants:** `jr $reg` are jump-table dispatches into relocated `0x801E…/
  0x801F…` tables (NOT boundaries); `j 0x801Cxxxx/0x801Dxxxx/0x801Exxxx` are overlay
  tail-jumps. Runtime slots: chunk 18 → `0x801D` band, chunk 19 → `0x801E` band.

## 7. Straddler Refinements
- **Chunk 17 → 18:** `func_00120FC4` continues as `func_00120FC4_chunk18tail
  [0x121000,0x1211F8)`.
- **Chunk 18 → 19:** `func_00130E60` (prologue `addiu $sp,-0x18`) continues as
  `func_00130E60_chunk19tail [0x131000,0x131050)`.
- **Chunk 19 → 20:** `data_00140EA0_chunk19head [0x140EA0,0x141000)` (a packed-byte
  structure, values ≤`0x0C`, no terminator) continues into chunk 20 — **chunk-20 first
  action: emit `data_00141000_chunk20tail` and prove its end.** The documented
  `neutral_encounter_table` (`0x141ED0`, 40×20 B) + `creature_drop_table` (`0x142258`,
  36×8 B) are early in chunk 20.

## 8. Data Classification & Decode/Export Outputs
- **Chunk 18 — 0 data bytes** (all code). No inventory.
- **Chunk 19 — 19,300 B in 16 parts** (`docs/data-index/rev0/chunk19-data-region-inventory.json`).
  By class: packed-highbyte 12,108 B · fixed-stride record/script table 4,848 B ·
  packed-fill 1,592 B · outgoing straddler-head 352 B · packed-markers 156 B · bit-pattern
  LUT 128 B · ram-pointer table 108 B · zero-fill 8 B. Format families: a single-bit-set
  LUT, `0x801E`-band RAM-pointer tables, a fixed-stride 16-byte record/script table, packed
  fill/byte blocks. No invented field names.
- **No ASCII/text in chunk 19 data → no human-readable string export needed** (the
  `decode_rodata_strings.js` tool exists from the prior run for when text appears).
- **Data totals this run:** raw data bytes source-owned = 0 (chunk 18) + 19,300 (chunk 19);
  parsed/indexed = 19,300 (all classified); human-readable exported = 0 (no text);
  undecoded spans = none left unclassified (record-table/LUT/pointer fields are classified
  but their internal semantics are explicitly hypothesis-grade).

## 9. Tooling Changes
- **None.** Reused tracked tools (`promote_original_mips`, `dump_function_context`,
  `plan_chunk`, `slice_chunk`, `check_splits`, `check_boundaries`, `check_manifest`,
  `split_original_mips_part`, `assemble_original_mips`, `verify_setup`, `audit_code_region`).
- Build helpers (gitignored): `build/combine_chunk.js`, `build/wf_chunk18_analyze.js`,
  `build/wf_chunk19_analyze.js`, `build/scan_chunk.js`.

## 10. Verification (commands + key output)
- `node tools/check_manifest.js` → **ALL CHECKS PASS** (20 chunks, 2,526 parts).
- `node tools/check_boundaries.js --splits build/chunk_00121000-00131000_splits.json --disasm build/original-mips/rev0/code_00121000_00131000.s` → **PASS** (95 parts; 0 of each).
- `node tools/check_boundaries.js --splits build/chunk_00131000-00141000_splits.json --disasm build/original-mips/rev0/code_00131000_00141000.s` → **PASS** (80 parts; 0 of each).
- `node tools/check_splits.js …` (both chunks) → 0 fragments.
- Adversarial: chunk 18 → 1 missed-leaf fix; chunk 19 → 0 disproofs (data-hunter refuted the parent code-in-gap claim).
- Every byte `0x121000..0x141000` assigned to a tracked code/data part (no gaps/overlaps).
- `node tools/assemble_original_mips.js` → **Exact code-region match: PASS**, code SHA `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- `node tools/verify_setup.js` → **PASS**: 20 tracked composite chunks, **2,526** tracked files, **80** fallback; ROM SHA `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
- `node tools/audit_code_region.js` → OK (executable extent unchanged).
- 0 data files with function/true-entry wording; 0 root scratch tracked; all
  `docs/data-index/rev0/*.json` parse; chunk-15 prologue export still round-trips byte-exact.
- `git diff --check` → clean.

Summary numbers: **tracked chunks 20 · tracked files 2,526 · fallback 80 · code SHA
`40D4E787…B409` · ROM SHA `571E8339…CC67A` · frontier `0x00141000`.**

## 11. Files Changed
- **Source `.s` (added):** 95 (chunk 18: all code) + 80 (chunk 19: 64 code + 16 data) = 175
  under `asm/original/rev0/lib/`. **Removed:** temp whole-chunk `code_00121000_…s` /
  `code_00131000_…s` (`--remove-source`; promote-seeded, never committed).
- **Manifest:** chunk count 18→20, total parts 2,351→2,526.
- **Tools:** none.
- **Data indexes:** new `docs/data-index/rev0/chunk19-data-region-inventory.json`.
- **Archive:** new `docs/archive/DECOMP_LOG-2026-06-23-audits-and-chunks8-13.md`.
- **Docs:** new `docs/dossiers/lib-chunk18-121000-131000.md`,
  `lib-chunk19-131000-141000.md`; this review; updated `AGENTS.md`, `docs/DECOMP_LOG.md`
  (compacted + extended), `docs/NEXT_STEPS.md`, `docs/PLATFORM.md`, `docs/WORKFLOW.md`;
  chunks-16-17 review hash fix.

## 12. Current Frontier
- **Next ROM address:** `0x00141000` (chunk 20, `0x141000..0x151000`).
- **First required action:** continue the OUTGOING DATA straddler — emit
  `data_00141000_chunk20tail` as chunk 20's first part (the continuation of the packed-byte
  structure `data_00140EA0_chunk19head`); prove its end, then content-scan. The documented
  `neutral_encounter_table` (`0x141ED0`) + `creature_drop_table` (`0x142258`) are early in
  chunk 20 — a good decode/index/export target (40×20 B and 36×8 B fixed-stride tables).

## 13. Unresolved Caveats
- **Conservative code names:** all new functions are `func_<addr>` labels; overlay
  relocation makes RAM/global/callee identity SUSPECT. The `neutralEncounterDispatcher`
  identity (`func_0013C060` @`0x13C068`) and the chunk-18 role tags (text-VM consumers,
  Chaos-Frame stat fn) are recorded as LEADS, not adopted.
- **Chunk-19 data conservatively classified:** the record/script-table fields, the bit-LUT
  meaning, and the pointer-table wiring are NOT decoded (follow-up).
- **The linear-map fallacy recurs in parent artifacts** — any future "RAM → ROM" mapping
  from a runtime trace must be validated against the byte-exact Rev 0 disassembly (prologue/
  return presence), never trusted as `ROM = RAM − 0x8006FC00` for overlay code.

## 14. Reviewer Checklist
- [ ] `git status --short --branch` → clean `## main`; `git log --oneline -5` shows the
  review-handoff commit, `e34016f`, `a4d07c5`, `be7a250`.
- [ ] `node tools/check_manifest.js` → ALL CHECKS PASS (20 chunks / 2,526 parts).
- [ ] `node tools/assemble_original_mips.js` → byte-exact (code SHA `40D4E787…B409`);
  `node tools/verify_setup.js` → PASS (20 / 2,526 / 80; ROM `571E8339…CC67A`).
- [ ] Chunk 18 spot-check: `func_00120FC4_chunk18tail.s` (incoming straddler-tail);
  `func_0012EC6C.s` + `func_0012ECDC.s` (the adversarial leaf split); `func_00130E60.s`
  (outgoing straddler-head, no `jr $ra`).
- [ ] Chunk 19 spot-check: `func_00130E60_chunk19tail.s` (incoming straddler-tail);
  `func_0013C060.s` (the neutralEncounterDispatcher, conservative name); a `table_0013*.s`
  data file (0x801E pointers, no function wording); `data_00140EA0_chunk19head.s` (outgoing
  data straddler). Confirm `[0x13C49C,0x141000)` has 0 prologues/returns (the disproof).
- [ ] Confirm docs/counts: AGENTS / DECOMP_LOG / NEXT_STEPS / PLATFORM / WORKFLOW all say
  20 chunks / 2,526 files / 80 fallback / frontier `0x00141000`.
- [ ] Confirm the DECOMP_LOG compaction archive
  (`docs/archive/DECOMP_LOG-2026-06-23-audits-and-chunks8-13.md`) exists and the active log
  is lean with the current frontier unmissable.
- [ ] Confirm the chunk-19 data-index JSON parses and matches manifest ranges; 0 data files
  with function/true-entry wording; 0 root scratch tracked.
- [ ] Confirm next frontier `0x00141000` and the `data_00141000_chunk20tail` first-action.
