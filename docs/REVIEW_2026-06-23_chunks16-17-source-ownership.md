# Review Handoff: 2026-06-23 Chunks 16–17 Source-Ownership (`0x00101000..0x00121000`)

Self-contained handoff for a fresh reviewer. Static/offline; exact byte-for-byte rebuild
preserved. Per-byte detail: `docs/dossiers/lib-chunk16-101000-111000.md`,
`docs/dossiers/lib-chunk17-111000-121000.md`.

## 1. Title
Review Handoff — Chunks 16 & 17 Source-Ownership, ROM z64 `0x00101000..0x00121000`,
run date 2026-06-23.

## 2. TL;DR
- **Completed:** chunk 16 (`0x101000..0x111000`, MIXED — leading scenario data + the
  neutral-encounter code path) + chunk 17 (`0x111000..0x121000`, ALL CODE), plus an
  opening doc/data-export pass.
- **Chunk 16:** **95 parts** = 72 code (incl. 1 outgoing straddler-head) + 23 data.
- **Chunk 17:** **66 parts** = 66 code (1 incoming straddler-tail + 64 fns + 1 outgoing
  straddler-head) + 0 data.
- **Tracked source files:** 2,190 → 2,285 (chunk 16) → **2,351** (chunk 17), +161.
- **Generated fallback chunks:** 84 → 83 → **82**.
- **Source-owned bytes:** chunks 0–17 = `0x1000..0x121000` = **1,179,648 B = 41.4027 %**
  of the 2,849,204-byte evidenced executable extent.
- **Code-only classified:** ≈ **991,940 B (34.8146 %)** (chunk 16 code +62,240, chunk 16
  data +3,296; chunk 17 all code +65,536).
- **Exact rebuild preserved:** YES — code SHA `40D4E787…B409`, ROM SHA `571E8339…CC67A`,
  both unchanged.
- **Current frontier:** `0x00121000` (chunk 18). Working tree clean.
- **Tooling:** added `tools/decode_rodata_strings.js` (durable rodata string decoder); no
  changes to the split/assemble pipeline.

## 3. Commits (this run, newest first)
| Hash | Category | Purpose |
|---|---|---|
| `bcb8d67` | review handoff | Add chunks 16–17 review handoff (this file, final commit) |
| `89041c0` | source + docs | Source-own chunk 17 (66 parts, ALL CODE); dossier `lib-chunk17` + doc updates |
| `a9bc553` | source + docs | Source-own chunk 16 (95 parts, MIXED); dossier `lib-chunk16` + data-index inventory + doc updates |
| `d4c98d1` | opening fixes + data export | Chunks 14–15 review nit (hash 68d8bfc) + superseded 0xF135C notes + `tools/decode_rodata_strings.js` + chunk-15 opening-prologue decode/export |

## 4. Opening Fixes (commit `d4c98d1`)
1. **`docs/REVIEW_2026-06-23_chunks14-15-source-ownership.md`** — replaced the
   commit-table placeholder `_(this doc's commit)_` with the real hash **`68d8bfc`**.
2. **Stale 0xF135C sweep:** the durable refined straddler end for `func_000F0F64` is
   `0xF1354`; the only stale (old-estimate) references were two lines in the *historical*
   chunk-14 DECOMP_LOG entry — marked **[superseded: refined to 0xF1354]** rather than
   rewritten (they are dated-log history). All current-state docs already read `0xF1354`.
3. **Chunk-15 opening-prologue decode/export (NEW, the missing human-readable export):**
   - Added durable tool **`tools/decode_rodata_strings.js`** — decodes a rodata `.s` owner
     into a JSON index + a Markdown export, **byte-exactly**, preserving ALL control codes
     verbatim (never normalizes/strips), tallying `@`-prefixed inline codes with semantics
     marked **UNRESOLVED**. Round-trip verified byte-exact against the raw owner.
   - Decoded `rodata_001006f0 [0x1006F0,0x100E20)` (the OB64 opening-prologue narration):
     **16 NUL-terminated ASCII strings** → `docs/data-index/rev0/chunk15-opening-prologue-strings.json`
     + `data/decoded/rev0/dialogue/chunk15-opening-prologue.md`. Control codes found:
     `@0..@3`, `@w`, `@c`, `@e`, `@l` (semantics unresolved). The raw `.s` owner is
     unchanged; this is a companion export, linked from the chunk-15 inventory.
4. **JSON validity:** all 13 `docs/data-index/rev0/*.json` parse (11 prior + the new
   opening-prologue strings index + the chunk-16 inventory).
5. **No data files with function wording** (`True entry` / `read-before-write preamble`):
   confirmed clean for the new chunk-16 data files.
6. **No root scratch tracked** (root = `.gitattributes`, `.gitignore`, `AGENTS.md`,
   `README.md`).

## 5. Work Completed

### Chunk 16 (`0x101000..0x111000`), MIXED — 95 parts (72 code + 23 data)
| Region | Range | Bytes | Class | Parts |
|---|---|---:|---|---:|
| DATA (record tail + packed/pointer) | `0x101000..0x101A40` | 2,624 | data | 11 |
| DATA (0x801A ptr tables + f64 pool) | `0x101A40..0x101CE0` | 672 | data | 12 |
| CODE (neutral-encounter path) | `0x101CE0..0x111000` | 62,240 | code | 72 |

- Incoming DATA straddler `data_00101000_chunk16tail [0x101000,0x101024)` = the 9-word
  completion of the truncated chunk-15 0x50-byte record (word[11]@0x101000=`0x42340000`
  =45.0). The 0x50-stride table then continues for 4 more records and **ends at
  `0x101164`** (adversarially confirmed).
- **Data→code boundary `0x101CE0`** = a parent-MISSED frameless leaf `func_00101CE0`
  (divide-by-3 magic `0xAAAAAAAB`) — the parent's first prologue is `0x101DDC`.
- 23 preamble-orphans + 9 frameless leaves recovered; outgoing straddler-head
  `func_00110160 [0x110160,0x111000)` → `0x111464` in chunk 17.

### Chunk 17 (`0x111000..0x121000`), ALL CODE — 66 parts (66 code + 0 data)
- Incoming straddler-tail `func_00110160_chunk17tail [0x111000,0x111464)`; ~64 functions
  (37 framed + 23 preamble-orphans + 4 frameless leaves); outgoing straddler-head
  `func_00120FC4 [0x120FC4,0x121000)` → `0x1211F8` in chunk 18.
- Content scan found **0 data** (0 pointer-table runs, 0 record-table signatures; the
  small float-const runs are in-stream FP constants = CODE).

## 6. Parent DB / Overlay Findings & Corrections
- **Address-space correction (both chunks):** the parent symbol-DB `ram` field is the
  WRONG linear image `0x8017/0x8018xxxx`; real runtime slots are `0x801A..0x801C`
  (scenario/combat_transition states). The 0x801A pointer/jump tables in chunk 16 are
  STATIC z64 `0x801A` values (pre-baked for the scenario overlay slot, not relocated).
- **Chunk 16 adversarial (5 agents): 0 structural disproofs.** One data-NOTE fix: the
  record-table-end note mis-cited `0x00010002` (which is actually at RAM `0x80171164` =
  z64 `0x101564`); the real word at z64 `0x101164` is `0x00000019` — the boundary
  `0x101164` was already correct. No `.s`/boundary change.
- **Chunk 17 adversarial (3 agents): 0 disproofs.** All straddlers, preamble-orphans
  (name=label=`func_<startaddr>`), frameless leaves, and dispatchers confirmed.
- **Overlay invariants:** `jr $reg` are jump-table dispatches into relocated `0x801E…/
  0x801F…` tables (NOT boundaries); `j 0x801Bxxxx/0x801Cxxxx` are overlay tail-jumps.

## 7. Straddler Refinements
- **Chunk 15 → 16:** `data_00100fd4_chunk15head` continues as `data_00101000_chunk16tail
  [0x101000,0x101024)`; the fixed-stride 0x50-byte table continues past it and ends at
  `0x101164` (proven, not assumed at `0x101024`).
- **Chunk 16 → 17:** `func_00110160` (chunk-16 entry, prologue `addiu $sp,-0x88`)
  continues as `func_00110160_chunk17tail [0x111000,0x111464)`.
- **Chunk 17 → 18:** `func_00120FC4 [0x120FC4,0x121000)` (prologue `addiu $sp,-0x50`, no
  `jr $ra` in range) continues to `0x1211F8` — **chunk-18 first action: emit
  `func_00120FC4_chunk18tail [0x121000,0x1211F8)`.**

## 8. Data Classification & Decode/Export Outputs
- **Chunk 16 — 3,296 B in 23 parts** (`docs/data-index/rev0/chunk16-data-region-inventory.json`).
  By class: fixed-stride record table 2,140 B · ram-pointer table 760 B · indexed-float
  ramp 160 B · packed/record 116 B · float64 const pool 60 B · incoming straddler-tail
  36 B · zero-fill 24 B. Format families: a fixed-stride 0x50-byte record table (continued
  from chunk 15); 0x801A/0x801B RAM-pointer/jump tables (incl. a ~100-entry `0x801AEAEC`
  default-fill table — per parent evidence, scenario-state jump tables feeding the
  `0x102FA8` dispatcher, LEAD not decoded); two embedded ASCII format strings
  `"{P%03d,%03d}"`/`"{C12}"`; a float64 const pool (1.0/180.0/pi/pi-half/2.5). No field
  names invented.
- **Chunk 17 — 0 data bytes** (all code). No inventory file (consistent with the all-code
  chunks 9–12).
- **Decode/export (chunk-15 opening prologue, this run):** raw bytes source-owned (the
  `.s` owner, byte-exact); human-readable export
  `data/decoded/rev0/dialogue/chunk15-opening-prologue.md` (16 strings, all control codes
  preserved verbatim, `@`-code semantics marked UNRESOLVED) + JSON index
  `docs/data-index/rev0/chunk15-opening-prologue-strings.json`; round-trip byte-exact.
- **Data totals this run:** raw data bytes source-owned = 3,296 (chunk 16) + 0 (chunk 17);
  parsed/indexed = 3,296 (all classified); human-readable exported = the chunk-15 prologue
  (1,840 B / 16 items, exported as an opening fix); undecoded spans = none left
  unclassified (record-table fields and pointer-table wiring are classified but their
  internal field semantics are explicitly hypothesis-grade / not decoded).

## 9. Tooling Changes
- **Added** `tools/decode_rodata_strings.js` (durable, byte-exact, control-code-preserving
  rodata string decoder → JSON index + Markdown export). `node --check` clean.
- Build helpers (gitignored): `build/combine_chunk.js` (ROM-ordered splits combiner with
  decimal→hex normalization + label-conflict guard), `build/wf_chunk17_analyze.js`,
  `build/scan_chunk.js`.
- No changes to `split_original_mips_part`, `assemble_original_mips`, `check_*`,
  `plan_chunk`, `slice_chunk`, `dump_function_context`, `scan_functions`,
  `promote_original_mips`.

## 10. Verification (commands + key output)
- `node tools/check_manifest.js` → **ALL CHECKS PASS** (18 chunks, 2,351 parts).
- `node tools/check_boundaries.js --splits build/chunk_00101000-00111000_splits.json --disasm build/original-mips/rev0/code_00101000_00111000.s` → **PASS** (95 parts; 0 fragment/cross/under/leak/straddler/data-island).
- `node tools/check_boundaries.js --splits build/chunk_00111000-00121000_splits.json --disasm build/original-mips/rev0/code_00111000_00121000.s` → **PASS** (66 parts; 0 of each).
- `node tools/check_splits.js …` (both chunks) → 0 fragments.
- Adversarial: chunk 16 → 0 structural disproofs (1 data-note fix); chunk 17 → 0 disproofs.
- Every byte `0x101000..0x121000` assigned to a tracked code/data part (no gaps/overlaps).
- `node tools/assemble_original_mips.js` → **Exact code-region match: PASS**, code SHA `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- `node tools/verify_setup.js` → **PASS**: 18 tracked composite chunks, **2,351** tracked files, **82** fallback; ROM SHA `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
- `node tools/audit_code_region.js` → OK (executable extent unchanged; no credible code edge into the data tail).
- `node --check tools/decode_rodata_strings.js` → clean.
- 0 data files with function/true-entry wording; 0 root scratch tracked; all
  `docs/data-index/rev0/*.json` parse; the chunk-15 prologue export round-trips byte-exact.
- `git diff --check` → clean.

Summary numbers: **tracked chunks 18 · tracked files 2,351 · fallback 82 · code SHA
`40D4E787…B409` · ROM SHA `571E8339…CC67A` · frontier `0x00121000`.**

## 11. Files Changed
- **Source `.s` (added):** 95 (chunk 16: 72 code + 23 data) + 66 (chunk 17: all code) =
  161 under `asm/original/rev0/lib/`. **Removed:** temp whole-chunk `code_00101000_…s` /
  `code_00111000_…s` (`--remove-source`; promote-seeded, never committed).
- **Manifest:** chunk count 16→18, total parts 2,190→2,351.
- **Tools:** new `tools/decode_rodata_strings.js`.
- **Decoded exports:** new `data/decoded/rev0/dialogue/chunk15-opening-prologue.md`.
- **Data indexes:** new `docs/data-index/rev0/chunk16-data-region-inventory.json`,
  `docs/data-index/rev0/chunk15-opening-prologue-strings.json`; updated
  `chunk15-data-region-inventory.json` (export links).
- **Docs:** new `docs/dossiers/lib-chunk16-101000-111000.md`,
  `lib-chunk17-111000-121000.md`; this review; updated `AGENTS.md`, `docs/DECOMP_LOG.md`,
  `docs/NEXT_STEPS.md`, `docs/PLATFORM.md`, `docs/WORKFLOW.md`; chunks-14-15 review hash
  fix; superseded chunk-14 log straddler notes.

## 12. Current Frontier
- **Next ROM address:** `0x00121000` (chunk 18, `0x121000..0x131000`).
- **First required action:** continue the OUTGOING FUNCTION straddler — emit
  `func_00120FC4_chunk18tail [0x121000,0x1211F8)` as chunk 18's first part (the
  continuation of `func_00120FC4`, whose entry `0x120FC4` is in chunk 17). Then content-
  scan and classify the rest (MIXED handling if data appears).

## 13. Unresolved Caveats
- **Conservative code names:** all new functions are `func_<addr>` labels; overlay
  relocation makes RAM/global/callee identity SUSPECT. Parent symbol-DB semantic tags
  (0x102FA8 scenario dispatcher, 0x105CC8 text_renderer, 0x10D484/0x10DDBC spawn helpers,
  0x115440 bitfield helpers) recorded as LEADS, not adopted.
- **Chunk-16 data conservatively classified:** the 0x50-byte record-table fields, the
  0x801A scenario jump-table wiring, and the packed blocks are NOT decoded (follow-up).
- **`@`-control-code semantics UNRESOLVED** for the opening-prologue narration (export
  preserves them verbatim; runtime meaning not decoded).
- **DECOMP_LOG.md** is ~705 lines and approaching the ~10k-token condense threshold —
  consider archiving the oldest detailed entries before the next chunk.

## 14. Reviewer Checklist
- [ ] `git status --short --branch` → clean `## main`; `git log --oneline -5` shows the
  review-handoff commit, `89041c0`, `a9bc553`, `d4c98d1`.
- [ ] `node tools/check_manifest.js` → ALL CHECKS PASS (18 chunks / 2,351 parts).
- [ ] `node tools/assemble_original_mips.js` → byte-exact (code SHA `40D4E787…B409`);
  `node tools/verify_setup.js` → PASS (18 / 2,351 / 82; ROM `571E8339…CC67A`).
- [ ] Chunk 16 spot-check: `data_00101000_chunk16tail.s` (incoming straddler, 9 words);
  `func_00101CE0.s` (parent-missed frameless leaf at the data→code boundary);
  `func_00110160.s` (outgoing straddler-head, no `jr $ra`); a `table_*` data file (0x801A
  pointers, no function wording).
- [ ] Chunk 17 spot-check: `func_00110160_chunk17tail.s` (incoming straddler-tail, ends
  0x111464); `func_00120FC4.s` (outgoing straddler-head, no `jr $ra`); a preamble-orphan
  (`func_<startaddr>` with `label`=name).
- [ ] Confirm docs/counts: AGENTS / DECOMP_LOG / NEXT_STEPS / PLATFORM / WORKFLOW all say
  18 chunks / 2,351 files / 82 fallback / frontier `0x00121000`.
- [ ] Confirm the chunk-15 opening-prologue export
  (`data/decoded/rev0/dialogue/chunk15-opening-prologue.md`) round-trips the raw bytes and
  preserves all `@` control codes; its JSON index parses.
- [ ] Confirm next frontier `0x00121000` and the `func_00120FC4_chunk18tail [0x121000,
  0x1211F8)` first-action (function continuation).
- [ ] Confirm 0 data files with function/true-entry wording; 0 root scratch tracked;
  chunk-16 data-index JSON parses and matches manifest ranges.
