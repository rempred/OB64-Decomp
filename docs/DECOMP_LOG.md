# OB64 Decomp Log

This is the compact current-state decomp memory. Full historical logs are
archived under `docs/archive/`; the newest full archive before this compaction
is `docs/archive/DECOMP_LOG-full-2026-07-08.md` (through the map-AI/ESET
import), preceded by the 2026-06-21 archives.

Read this after `AGENTS.md`, `docs/PLATFORM.md`, `docs/REV0_SCOPE.md`,
`docs/TOOLCHAIN.md`, and `docs/WORKFLOW.md`. Keep this file focused on durable
session facts, active frontiers, and verification results. If it again grows
toward roughly 10,000 tokens, archive the full version under `docs/archive/`
and replace the active log with a compact current-state summary.

## Current Invariants

- Target: Ogre Battle 64 US Rev 0 only.
- Every configured byte must remain source-owned. The full-ROM source manifest
  covers all 41,943,040 bytes with zero unknown bytes.
- Whole-ROM coverage independently scans for LHA headers; do not trust the
  parent archive catalog by itself.
- Executable extent `0x1000..0x2B89B8` — boundary PINNED and the 3.66 MB tail
  RECLASSIFIED as data (`owned_data_parts`) 2026-07-09, gate-enforced
  (`docs/CODE_REGION_AUDIT.md` closure). `codeRegion` in config is the
  assembly/tiling region only.
- Current state numbers, the per-chunk composition table, and the section map
  live in `docs/PLATFORM.md`; the loop summary lives in
  `docs/FINAL_DATA_OWNERSHIP_REPORT_2026-06-24.md`. Do not clone the chunk
  narrative into this file (AGENTS.md Documentation Policy).
- Gate: `node tools/verify_setup.js` (19 checks incl. `manifestIntegrityAudit`,
  `executableExtentPinned`, `codeDataSplitHonest`) must PASS after every
  source-layout change. Code SHA `40D4E787...B409`, ROM SHA `571E8339...CC67A`.

## Dated Log (compact)

- **2026-06-20..24 — the data-ownership loop** (full detail: the archives + the
  FINAL report): setup, chunk-split pipeline, chunks 0-99 source-owned
  (`0x1000..0x63676C`, 6,181 files, 0 fallback). LOOP-COMPLETE 2026-06-24.
- **2026-06-28 — Section C classified NJPG** (`b245157`): "HUFF" pool = 29
  N64 JPEG/NJPG-style 320x240 blocks; MSB-first JPEG Huffman decode 29/29 to
  230,400-byte coefficient buffers; render stage pending. Final consolidated
  report committed: `docs/FINAL_DATA_OWNERSHIP_REPORT_2026-06-24.md`.
- **2026-07-03 — runtime fact import: map-AI/ESET** (`fd9afc1`):
  `docs/subsystems/map-ai-eset-runtime.md` — 14 evidence-named function
  identities, 16 data labels, struct sketches, three proven overlay VRAM
  deltas beyond the boot linear rule; every claim graded
  ([live]/[edit]/[code+multi]) with parent artifact citations; the
  "Explicitly NOT promoted" list is binding. Naming source for the
  `0x101000..0x130000` overlay + `0x195xxx..0x197xxx` scenario-loader module.
- **2026-07-08 — repo assessment + AGENTS migration** (`d259dca`): 13-agent
  verified read-only assessment; AGENTS.md restored to a thin rulebook (~85
  run-log sections archived verbatim to
  `docs/archive/AGENTS-run-log-archive-2026-07-08.md`); new AGENTS sections
  (What This Repo Is / Definitions / Parent Function DB Hazards / Known Gate
  Limitations / Backup And Remote Status / Documentation Policy /
  Decomp-To-Parent Promotion). Fix plan:
  `docs/PLAN_2026-07-08-assessment-fixes.md`. No git remote by owner decision;
  Joe maintains manual backups.
- **2026-07-08 — P5 hardening** (`1af761a`): `*.srcbin binary` gitattribute;
  `check_manifest.js` wired into `verify_setup.js` (17 checks, PASS); decode
  comments cross-validated against `mips64-elf-objdump` over the executable
  extent — **0 genuine decode disagreements** across 608,395 code rows
  (`docs/DISASM_VALIDATION_2026-07-08.md`; residuals: pseudo-instruction
  rendering variants + 5 COP0 CO-bit ops as `cop0_0x10`).
- **2026-07-08 — P1 reverse-promotion** (parent `9d524c4`): Section A/B/C
  decodes + data-tail map promoted into parent `rom-layout.md`,
  `cutscene-system.md`, `pending-tasks.md` #7, `OB64Decomp-log.md`.
- **2026-07-08 — P2 function-DB corrections** (`acd9bfc`; parent `7edf0f9`):
  `tools/export_function_corrections.js` diffs the manifest parts against
  parent `scripts/ob64_functions.json` over the executable extent — 1,279
  recovered functions, 714 start corrections (646 preamble-orphan folds), 497
  over-merges, 2 data refutes, 3 end-over-extensions, 1 tail false positive
  (`0x594A9C`). Spot-verified vs documented ground truth (0xD248 family exact;
  chunks 6-7 = 105 exact). Delivered as parent
  `scripts/ob64_function_corrections_rev0.json` (mips-decode.md Stage 1b);
  wholesale regeneration filed as parent pending-tasks #16.
- **2026-07-08 — P6 doc dedupe** (`5e67bbf`): DECOMP_LOG compacted (full
  version archived as `docs/archive/DECOMP_LOG-full-2026-07-08.md`);
  PLATFORM.md rebuilt around a manifest-generated per-chunk table
  (pre-dedupe snapshot `docs/archive/PLATFORM-full-2026-07-08.md`);
  NEXT_STEPS reduced to the queue (snapshot
  `docs/archive/NEXT_STEPS-full-2026-07-08.md`).
- **2026-07-08 — P3 NJPG render stage**: `tools/render_section_c_njpg.js`
  renders the Section C pool (de-zigzag, FLAT dequant — spectrum analysis
  refuted Annex-K ramps — IDCT, 4:2:0, BT.601) to PNGs under `build/njpg/`.
  All 29 blocks render at 0% clip. Animation-loop hypothesis REFUTED. Joe's
  eyeball pass: tentative ID = **battle backgrounds**, grouped in **~14
  chroma-signature-confirmed PAIRS + 1**; chroma appears stored NEGATED vs
  standard JPEG (`--chroma neg` turns the pink cast into green/olive painted
  terrain washes; chroma is near-DC-only = flat washes). `--scale` option
  added for review (`*_neg_2x.png`). Open: prove the negation from the
  in-game decoder, pair semantics, flat-scale constant, in-game consumer
  trace. Details in `docs/FINAL_DATA_OWNERSHIP_REPORT_2026-06-24.md`.

- **2026-07-09 — P4 editor data port + attack-name decode**: new generator
  `tools/export_editor_names.js` -> editor `rom-names-data.js`. Solved the
  combat action ID -> name mapping STATICALLY: action table @0x60980 (158 x
  0x10), name pointer at +0xC, overlay RAM delta `0x8012A100`
  (anchor-verified); 149/158 resolve to exact name-pool entries
  (`0x5D560-0x5DAD4`), 9 caster actions (IDs 45-48/51-54/145) share the
  dynamic-name slot RAM `0x8018FEB8` / ROM `0x65DB8` (element-composed at
  runtime). **REFUTED the parent hard rule "attack names are runtime-only"**
  (linear-mapping fallacy; corrected in parent CLAUDE/AGENTS/platform/
  rom-layout). Also fixed the editor's shifted `SPELL_NAMES` (6 skipped
  multi-line entries, 82 wrong keys, no consumers) and ported mission +
  equipment-type name pools with per-entry ROM offsets. Editor wiring:
  B43/B45/B47 tooltips show resolved names; browser smoke test clean.

- **2026-07-09 — P7 executable-extent reclassification (gate-enforced)**:
  boundary PINNED at `0x2B89B8` (last `jr $ra` @0x2B89B0 + delay slot =
  func_002B88C8 end; next part zero_fill_002B89B8). Ledger splits the old
  code span into `code` + `code_region_data_tail`; manifest maps the tail to
  new source form `owned_data_parts` (DATA, assembled-blob-backed, same
  tracked parts; 3,661,236 B) leaving `original_mips` = the extent
  (2,849,208 B); manifest 1,060 entries. `rebuild_rom --assembled-code`
  slices across split segments; tracked owners matched by ROM range.
  `verify_setup` now 19 checks incl. `executableExtentPinned` +
  `codeDataSplitHonest` (audit runs every gate). Both SHAs unchanged.
  Closure: `docs/CODE_REGION_AUDIT.md`.

## Dossier Set

139+ dossiers under `docs/dossiers/`: 81 `boot-*` (chunk 0 splits), 47
`lib-chunkNN-*` (one per library chunk), 10 `section-*` data-ownership, 1
survey, plus `docs/subsystems/map-ai-eset-runtime.md`. Machine-readable
inventories: `docs/data-index/rev0/*.json`. Review handoffs: `docs/REVIEW_*.md`.

## Next Frontier

The data-ownership loop is COMPLETE at the configured stop `0x63676C`; no
chunk frontier remains. The assessment fix plan (P1-P8) is COMPLETE as of 2026-07-09. Active queues:
Phase 1 workbench (parent `docs/mips-decomp-workflow-plan.md`; first M4 target
= cutscene animation actors/programs) and `docs/NEXT_STEPS.md` (owner
promotion, evidence-naming rules, optional decode tracks). Out of scope
without Joe: the structural gap `0x63676C..0x636784` and the LHA region
`0x636784+`.
