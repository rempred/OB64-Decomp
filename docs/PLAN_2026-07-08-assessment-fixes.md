# Plan: Assessment Fixes (2026-07-08)

Source: the 2026-07-08 read-only repo assessment (13-agent verified) plus the
AGENTS.md migration already committed as `d259dca`. This plan covers the
remaining fixes, ordered by value to the parent workspace. Each item lists
scope, deliverables, gates, and effort. Items are independent unless noted.

Status legend: [ ] not started · [x] done · [J] needs Joe's decision.

## P1. Reverse-promote decomp-novel facts to the parent (highest leverage)

The parent's active editor/research line is blind to the decomp's biggest
deliverables. Parent docs contain nothing on the Section A audio-bank decode,
the A/B boundary, the Section B index, or the Section C NJPG pool (verified by
grep 2026-07-08; the Section B block family itself is parent-known via
`cutscene-system.md`, and `rom-layout.md` already has the 0x2B89B4 extent).

- [x] DONE 2026-07-08 (uncommitted in the parent repo, pending Joe review).
  Updated parent domain docs (per parent CLAUDE.md rules, findings go in the
  relevant `docs/` domain doc, not a new silo):
  - `rom-layout.md`: the section map — Section A audio `0x301000..0x4E3140`,
    A/B pin `0x4E3140`, B/C pin `0x594280`, Section C pool `0x5943C8..0x636780`,
    structural gap `0x63676C..0x636784`.
  - Audio domain doc (or a new section in `rom-layout.md`): the decoded
    in-ROM sound-bank format — `N64 PtrTablesV2` codebook @`0x423FF0` (133
    order-2 VADPCM records), `N64 WaveTables` @`0x429CD0`, payload end
    `0x431EF1`; note PtrTablesV2 is a GENERIC container (also graphics
    @`0x2B8BA0`). Flag relevance to the parent's 20MB audio region task
    (pending-tasks #7 covers `0x925483..0x1C4801C` — different region, same
    likely container family; verify before assuming).
  - `cutscene-system.md`: Section B 1,798-record index (shape decoded, `0x64`
    constant flag, payload interpretation open) + Section C = 29-block NJPG
    "HUFF" image pool (18-byte header, `leadU32 == blockSize-4`, 320x240 /
    300 macroblocks, Huffman stage decoded 29/29, render pending), with the
    65-entry directory mapping (entries 2-30 = block starts, 31 = pool end,
    48 = repeat, 32-64 unresolved).
  - `docs/pending-tasks.md`: annotate item 7 with the decomp bank-format lead.
- [x] Added a curated "Current state (updated 2026-07-08)" section to parent
  `docs/OB64Decomp-log.md` (was stale since 2026-06-21): loop complete
  2026-06-24, Section A/B/C results, final report path, repo-hygiene log.
- Every claim cites its decomp artifact (dossier / data-index JSON / FINAL
  report), mirroring the promotion-grade pattern of
  `docs/subsystems/map-ai-eset-runtime.md` in reverse.
- Effort: one focused session. Gate: none (docs-only, parent repo).

## P2. Export function-DB corrections to the parent

The split work accumulated systematic corrections to the parent function DB:
preamble-orphan boundary shifts, over-merge un-merges, ~hundreds of recovered
frameless leaves, data-islands-mislabeled-as-functions (chunks 23/24), and
PARENT-UNDETECTED code regions (chunks 6-7).

- [x] DONE 2026-07-08: `tools/export_function_corrections.js` emits
  `build/corrections/rev0-function-corrections.json/.md` — vs the parent DB
  over the executable extent: 1,279 recovered functions, 714 start corrections
  (646 preamble-orphan folds), 497 over-merges, 79 decomp cluster files
  (informational), 2 data refutes (0x30008, 0x177D20), 3 end-over-extensions
  (0x2E348, 0x1A42A4, 0x1B924C), 1 beyond-extent false positive (0x594A9C).
  Spot-verified against documented ground truth (0xD248/0xD600/0xECF0/0xF22C
  deltas exact; chunk 4 = 212 vs documented ~211; chunks 6-7 = 105 exact).
- [x] Parent-side delivery 2026-07-08: chose ANNOTATE over regenerate — the
  overlay ships as parent `scripts/ob64_function_corrections_rev0.json`,
  registered in parent `docs/mips-decode.md` (Stage 1b) and pending-tasks #4.
  Wholesale `ob64_functions.json` regeneration is filed as parent
  pending-tasks #16 (2026-07-08): two-tier plan (Stage-1 patcher with
  machine-checkable gates, then offline Stage 2-5 regeneration), keep the
  pre-corrections DB alongside for one cycle; agent-brute-force candidate.
- Effort: tool ~1 session; parent ingestion 1 session. Gate: read-only tool
  (writes `build/` only); parent DB change needs parent-side spot checks
  against known-good functions before adoption.

## P3. NJPG render stage (Section C images)

The hard stage is done (Huffman entropy decode 29/29). Remaining: de-zigzag,
dequantization, IDCT, YUV->RGB.

- [x] DONE 2026-07-08: `tools/render_section_c_njpg.js` — de-zigzag, dequant,
  IDCT, 4:2:0 assembly, BT.601, minimal PNG writer; renders to `build/njpg/`
  with per-variant clip/blockiness metrics.
- [x] Quantizer RESOLVED as FLAT (no embedded table needed): coefficient
  spectrum analysis shows natural frequency decay already present, refuting
  Annex-K-style ramps; `flat1` renders 29/29 blocks at 0% clipping (exact
  flat-scale constant only affects contrast, unpinned).
- [x] Partial success: all 29 render as coherent, distinct 320x240 grainy
  purple-cloud sky stills (block 14 has a tree-silhouette foreground) —
  recognizable scenic content, but NOT proven to be cutscene backgrounds;
  the animation-loop hypothesis was REFUTED by frame-correlation testing.
- [ ] REMAINING: in-game identification (Joe's eyeball vs the running game,
  or trace the in-game consumer of the Section C directory) + chroma
  convention confirmation; then the parent asset-inventory addendum and
  directory entries 32-64.
- Findings recorded in the FINAL report (render-stage update 2026-07-08) and
  DECOMP_LOG.

## P4. Port decoded data to the editor

- [ ] Package the byte-verified table decodes for the LordlyCaliber editor
  using its existing generated-data pattern (`squads-data.js` /
  `tools-data.js`: "generated from the research workspace — do not hand-edit"):
  neutral-encounter table (40x20 @`0x141ED0`), creature-drop table (36x8
  @`0x142258`), weapon/armor type-name table @`0x163FC0`, and the string pools
  already cross-checked against `editor/parsers.js`.
- [ ] Source of truth stays here (`data/decoded/rev0/` + `docs/data-index/rev0/`);
  the editor gets a generated module + provenance header.
- Effort: 1 session. Gate: editor-side round-trip checks (editor repo rules).

## P5. Repo hardening (small, this repo)

- [x] `.gitattributes`: `*.srcbin binary` added (2026-07-08).
- [x] `tools/check_manifest.js` wired into `verify_setup.js` as the
  `manifestIntegrityAudit` check (2026-07-08).
- [x] Disassembler cross-validation DONE (2026-07-08): objdump vs mips.js over
  the executable extent — 0 genuine decode disagreements across 608,395 code
  rows; all differences are pseudo-instruction/field-rendering conventions
  plus 5 generically-rendered COP0 CO-bit ops. Full verdict:
  `docs/DISASM_VALIDATION_2026-07-08.md`; AGENTS.md limitation bullets updated.
- Effort: half a session total. Gate: `node tools/verify_setup.js` PASS after
  each change.

## P6. Documentation dedupe (follows the new AGENTS.md policy)

- [x] DONE 2026-07-08: `docs/DECOMP_LOG.md` compacted 105KB -> ~7KB (full
  version archived as `docs/archive/DECOMP_LOG-full-2026-07-08.md`); compact
  dated log now covers the loop, NJPG classification, map-AI import, and the
  2026-07-08 P-plan passes with commit hashes.
- [x] DONE 2026-07-08: `docs/PLATFORM.md` rebuilt 641 -> 385 lines around a
  manifest-GENERATED 100-row per-chunk composition table (reconciles to 6,181
  parts) + a section-family map; run-on narratives replaced with pointers
  (snapshot archived as `docs/archive/PLATFORM-full-2026-07-08.md`). Root
  README.md stale "first chunk" coverage claim also fixed.
- [x] DONE 2026-07-08: `docs/NEXT_STEPS.md`: dropped the duplicated chunk narrative; kept only the
  active queue.
- Effort: 1 session. Gate: no facts deleted — anything unique goes to
  `docs/archive/` first (same method as the AGENTS.md migration, `d259dca`).

## P7. Code/data boundary reclassification track (already opened in NEXT_STEPS)

The declared-but-unexecuted track: pin the exact boundary near `0x2B89B4`
(control-flow prerequisite already satisfied), shrink the configured code
region to the executable extent, re-own the 3.66MB tail as data source forms,
and wire `audit_code_region.js` into the coverage gate.

- [ ] Step 1: pin the boundary byte (last `jr $ra` + delay slot + alignment
  padding evidence; chunk-43 dossier places the transition at `0x2B89B8`).
- [ ] Step 2: reclassify across `config/segments/rev0.yaml`, the coverage
  ledger, and the source manifest; ROM SHA must stay `571E8339...CC67A`.
- [ ] Step 3: add the audit as a gate check ("no proven code outside the
  executable extent").
- Effort: 1-2 sessions; touches the config/gate path, so run
  `node tools/verify_setup.js` before AND after each step.

## P8. [J] Reconcile the plan-of-record / decide the next phase

Parent `docs/mips-decomp-workflow-plan.md` (2026-06-20) defines the decomp
goal as an m2c-based, trace-driven subsystem-C workbench (Milestones 1-4) in
service of the parent's editor/patch research. Joe's framing (2026-07-08): the
mission is unchanged — the byte-ownership sprint was a DELIBERATE
foundation-first detour to verify the substrate (parent-DB boundary defects,
the 3.66MB code-region over-claim) before building the workbench on it, not a
pivot. The milestones themselves have not started. Two options:

- Option A (update the plan): rewrite the parent plan doc to record the atlas
  as the completed "Phase 0: foundation verification" (deliberate, not drift)
  and re-scope the workbench milestones on top of the now-validated
  boundaries. Also archive the plan doc's own accreted boot-split chronicle
  (~250 lines) the same way AGENTS.md was migrated (`d259dca`).
- Option B (start the workbench): pick one editor-relevant subsystem from the
  plan's original packet (shop allow-list, neutral-encounter level source,
  deployment AI, high-attack scheduler — the last two already have decomp/
  parent groundwork) and run Milestone-style semantic decomp on it: m2c +
  asm-differ adoption, struct headers into `include/`, first matched C into
  `src/`.
- Either way the plan doc stops being stale. Decision is Joe's: A is an hour;
  B opens the C-conversion phase this repo was scaffolded for.

## Suggested order

P5 (cheap hardening) -> P1 (reverse promotion) -> P2 (DB corrections) ->
P6 (doc dedupe) -> P3 (NJPG render) -> P4 (editor port) -> P7
(reclassification) -> P8 (Joe's phase decision, any time).

P1/P2 unblock the parent immediately; P3/P4 create new editor capability;
P5-P7 pay down risk. This file is a working plan, not a log — check items off
or strike them as they complete, and delete the file when everything has
landed in the proper domain docs.
