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
- The configured code region `0x1000..0x63676C` is conservative: executable
  MIPS occupies only `0x1000..0x2B89B4`; the 3.66 MB tail is classified
  non-code data still emitted as `.word` pending the reclassification track
  (`docs/CODE_REGION_AUDIT.md`; do not reclassify before the boundary is
  pinned).
- Current state numbers, the per-chunk composition table, and the section map
  live in `docs/PLATFORM.md`; the loop summary lives in
  `docs/FINAL_DATA_OWNERSHIP_REPORT_2026-06-24.md`. Do not clone the chunk
  narrative into this file (AGENTS.md Documentation Policy).
- Gate: `node tools/verify_setup.js` (17 checks incl. `manifestIntegrityAudit`)
  must PASS after every source-layout change. Code SHA `40D4E787...B409`, ROM
  SHA `571E8339...CC67A`.

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
- **2026-07-08 — P6 doc dedupe** (this pass): DECOMP_LOG compacted (full
  version archived as `docs/archive/DECOMP_LOG-full-2026-07-08.md`);
  PLATFORM.md rebuilt around a manifest-generated per-chunk table
  (pre-dedupe snapshot `docs/archive/PLATFORM-full-2026-07-08.md`);
  NEXT_STEPS reduced to the queue (snapshot
  `docs/archive/NEXT_STEPS-full-2026-07-08.md`).

## Dossier Set

139+ dossiers under `docs/dossiers/`: 81 `boot-*` (chunk 0 splits), 47
`lib-chunkNN-*` (one per library chunk), 10 `section-*` data-ownership, 1
survey, plus `docs/subsystems/map-ai-eset-runtime.md`. Machine-readable
inventories: `docs/data-index/rev0/*.json`. Review handoffs: `docs/REVIEW_*.md`.

## Next Frontier

The data-ownership loop is COMPLETE at the configured stop `0x63676C`; no
chunk frontier remains. Active queues: `docs/PLAN_2026-07-08-assessment-fixes.md`
(P3/P4/P6/P7/P8 remaining) and `docs/NEXT_STEPS.md` (reclassification track,
owner promotion, evidence-naming rules, optional decode tracks). Out of scope
without Joe: the structural gap `0x63676C..0x636784` and the LHA region
`0x636784+`.
