# Next Steps

This is the immediate work queue for the Rev 0 decomp repo. Keep it short and
update it when a task becomes durable, blocked, or complete. Per the AGENTS.md
Documentation Policy, this file holds the QUEUE only — current-state numbers
live in `docs/PLATFORM.md`, the loop summary in
`docs/FINAL_DATA_OWNERSHIP_REPORT_2026-06-24.md`, and run history in
`docs/DECOMP_LOG.md`. (The pre-dedupe narrative version of this file is
archived as `docs/archive/NEXT_STEPS-full-2026-07-08.md`.)

## Status

Setup complete; data-ownership loop COMPLETE (2026-06-24) — the entire
configured code region `0x1000..0x63676C` is source-owned (100 composites /
6,181 files / 0 fallback), gate green:

```powershell
node tools/verify_setup.js
```

## Active Goal

Convert the completed byte-exact atlas into parent-repo value (editor/patch
research) without losing exact rebuild coverage. The overall mission and the
foundation-first rationale are recorded in the parent plan reconciliation item
below.

## Ordered Work

1. **Assessment fix plan** — `docs/PLAN_2026-07-08-assessment-fixes.md` is the
   active queue. Done: P5 hardening, P1 reverse-promotion, P2 function-DB
   corrections (parent Stage 1b + pending-tasks #16), P6 doc dedupe, P3 NJPG
   render, P4 editor data ports + attack-name decode, P7 reclassification,
   P8 plan-of-record reconciliation. Phase-1 workbench M1 dossiers and M2 trace
   ingestion and cutscene M4 are complete parent-side (2026-07-09); both
   opcode `0x84` and `0x90` have runtime entry proof, and the evidence-graded
   closure is `docs/subsystems/cutscene-animation-vm-runtime.md`. Remaining
   cutscene research (not a Phase-1 milestone blocker): pose-entry bytes
   `[1..6]`, controlled operand-semantic edits, and renderer/thumbnail naming.
   Also queued: runtime/swarm tracks (parent pending-tasks #16/#17, Section C
   consumer trace).

2. **Code/data boundary reclassification track — COMPLETE 2026-07-09** (plan
   P7 done; boundary pinned `0x2B89B8`, tail reclassified `owned_data_parts`,
   audit wired into the 19-check gate; `docs/CODE_REGION_AUDIT.md` closure).
   Original scope for reference: `tools/audit_code_region.js` bounds executable MIPS to
   `0x1000..0x2B89B4`; the control-flow edge audit found no credible code edge
   into the 3.66 MB tail (the 7 raw J/JAL hits are the `0x1A42A4` data ramp).
   Steps, each keeping `verify_setup` green: (a) pin the exact boundary byte
   near `0x2B89B4` (chunk-43 dossier places the transition at `0x2B89B8`);
   (b) reclassify the tail out of `original_mips` across
   `config/segments/rev0.yaml`, the ledger, and the source manifest — ROM
   SHA256 must stay `571E8339...CC67A`; (c) wire the audit into the coverage
   gate. Do NOT reclassify before the boundary is pinned.

3. **Non-code owner promotion.** First tracked batch done
   (`raw_header`, `raw_structural_gap`, ambiguous `raw_tail_data` under
   `data/source-owners/rev0/`). Promote further batches deliberately; keep
   archive gaps raw and explicitly ambiguous unless repeatable scanner
   evidence improves the classification.

4. **Evidence-based naming only.** Use parent symbols, trace docs, and clear
   local labels; no semantic names without runtime/controlled evidence. The
   curated promotion-grade import `docs/subsystems/map-ai-eset-runtime.md`
   (2026-07-03) is the naming source for the `0x101000..0x130000` overlay and
   the `0x195xxx..0x197xxx` scenario-loader module; its "Explicitly NOT
   promoted" list is binding until new evidence.

5. **Optional decode tracks** (from the FINAL report): NJPG render stage for
   Section C (= plan P3); Section C directory entries 32-64; Section B
   index/payload semantics; Section A sample addressing. Out of scope without
   Joe: the structural gap `0x63676C..0x636784` and the LHA region `0x636784+`.

## Watch Items

- The parent archive catalog has missed whole sections in the past. Keep the
  independent LHA scan in the default coverage gate.
- The `archive/audio` overlap at `0x00925483..0x009254EF` is known and should
  remain visible until reconciled.
- Only the early boot region uses the simple `RAM = ROM + 0x8006FC00` mapping.
  Later code is overlay-loaded and needs overlay-aware address handling.
- Generated files under `build/` and `dist/` are local proof artifacts, not
  source files to commit.
- Patch-workbench candidates on file: chunk-33 `0x21CD48`/`0x21BF84` and
  chunk-31 `0x1F36F0` (`candidate`/`needs-runtime`, RSR-011/RSR-014;
  `docs/patch-workbench/rev0/`).
