# Review Handoff: 20-Chunk Production Run — chunks 5–6 of 5–24 (`0x51000..0x71000`)

For the next decomp agent / reviewer. This is the run-level handoff for one turn
of the chunk 5–24 production loop. **2 of 20 chunks completed** this turn (chunks
5 and 6), plus the reusable tooling the remaining chunks (7–24) need. Static/
offline, byte-exact rebuild preserved throughout. Per-chunk detail lives in the
two chunk review files; this doc is the cross-cutting summary.

## Scope completed

| Chunk | ROM range | Commit | Composition | Per-chunk review |
|---|---|---|---|---|
| 5 | `0x51000..0x61000` | `8a3eaa7` | 76 code `func_*` + 1 straddler-tail + 11 data (MIXED) | `docs/REVIEW_2026-06-22_chunk05-mixed-code-gamedata.md` |
| 6 | `0x61000..0x71000` | `f05b535` | 60 code `func_*` + 18 data (MIXED + parent-undetected) | `docs/REVIEW_2026-06-22_chunk06-data-undetected-code.md` |

Plus opening-correction commit `c1b8822` (`check_splits.js` self-documenting/safe
with no args — was previously crashing on a bare call).

Run end state: **7 tracked chunks / 1,352 files / 93 fallback**; coverage
`0x1000..0x71000` = **16.10 %** of the 2,849,204-byte executable extent; code SHA
`40D4E787…B409` and full ROM SHA `571E8339…CC67A` unchanged; `verify_setup` PASS;
working tree clean at `f05b535`.

## Work completed (per chunk)

- **Chunk 5** — MIXED: overlay code `0x5148C..0x5C208` (frameless-leaf-dense) +
  a ~20 KB game-data tail `0x5C208..0x61000`. The data tail is identifiable game
  data: an F3DEX2 GBI display-list image, AI-behaviour / element / attack name
  string pools, pointer/descriptor/order tables, and two fixed-stride record
  tables (0x48-stride ×165, 0x10-stride straddling into chunk 6).
- **Chunk 6** — three-part MIXED: DATA1 `0x61000..0x66E10` (item/equipment data —
  record-table continuation from chunk 5, a weapon/item name string pool, multiple
  RAM-pointer tables, float consts + a `string_dsp()` debug fragment) → CODE
  `0x66E10..0x70E70` (parent-undetected overlay code, 60 `func_*` + 6 inline
  pointer-table islands) → DATA2 `0x70E70..0x71000` (packed F2/F3 record/offset
  blob, straddles into chunk 7).

## Issues discovered

1. **Parent-detection gap (chunks 6–7).** The parent function DB and the overlay
   map both jump from `0x5C1A8` (chunk 5) straight to `0x79730` (chunk 8): chunks
   6–7 are **entirely parent-undetected** (~41 KB of real code with 0 DB/overlay
   entries). This is why `tools/scan_functions.js` was built (prologue-based seed).
2. **Straddler-tail over-merge (chunk 5).** `func_00050F98` (parent size 1268 →
   claimed end `0x5148C`) actually ends at `0x51400`; the parent over-merged it
   with two frameless leaves (`func_00051400`, `func_00051450`). The chunk-4
   straddler-head file is unchanged/byte-exact; only the recorded end moved.
3. **Slice-seam preamble mislabels.** Per-slice agents at a slice boundary mark a
   trailing read-before-write preamble as a `straddler-head` (they can't fold
   forward into the next agent's slice). Seen in both chunks (3 total); folded
   deterministically. `check_boundaries.js` now auto-flags any straddler-head not
   ending at the chunk end / straddler-tail not at the chunk start.
4. **Delay-slot leaks.** Agents occasionally end a function on its `jr $ra`,
   leaking the delay slot into the next part (2 in chunk 6). `check_boundaries.js`
   catches these (literal-last-word-is-a-control-transfer); fixed by a +4 shift.
5. **Data classification subtleties (adversarial pass).** chunk 5: an 8-byte order
   table mis-included as string pad. chunk 6: a `data_` pointer table that should
   be `table_`, a frameless leaf (`0x6E660`) swallowed into a data part's tail, and
   an over-split data sub-block. All corrected.
6. **Recurring preamble-orphans.** Chunk 6's code is dense with 2-word global-load
   preambles before prologues; the analysis swarm folded several, the adversarial
   pass found 3 more. Always validate the boundary just above a prologue.

## Tooling changes (this run)

- **NEW `tools/check_boundaries.js`** — read-only deterministic boundary gate run
  every chunk: fragment / cross-boundary PC-relative branch / prologue-after-return
  under-split / delay-slot leak / straddler-position / inline-data-island. Overlay-
  immune. Caught real bugs in both chunks.
- **NEW `tools/scan_functions.js`** — prologue-based function-start seed for
  parent-undetected code regions (emits a `slice_chunk`-compatible plan).
- `tools/slice_chunk.js` — `--disasm` override (slice a code sub-region of a MIXED
  chunk from the full-chunk disasm).
- `tools/integrate_chunk.js` — context now optional (parent-undetected regions
  have no context file); also propagates `kind:data`/straddler + `note`.
- `tools/check_splits.js` — self-documenting + safe with missing args (`c1b8822`).
- Reusable swarm scripts under gitignored `build/`: `wf_analyze.js` (code
  function-finding; per-chunk DATA BLOCK + inline-island hints), `wf_data.js` (data
  classification), `wf_adversarial.js` (region refutation). Edit the DATA BLOCK and
  re-invoke via `scriptPath` per chunk.

## Per-chunk pipeline (now stable for MIXED + parent-undetected chunks)

1. Promote chunk; recon code/data split (overlay map + content scan: 0 jr_ra + 0
   prologues + pointer/ASCII density ⇒ data).
2. CODE region: `scan_functions` (parent-undetected) or `dump_function_context`+
   `plan_chunk` (parent-detected) → `slice_chunk --disasm` → code analysis swarm.
3. DATA region(s): data-classification swarm (`wf_data.js`).
4. Combine code + data into one full-chunk splits JSON (ROM order); `check_boundaries`.
5. Adversarial swarm (`wf_adversarial.js`) → apply fixes → re-`check_boundaries`.
6. `split_original_mips_part --remove-source`; `check_manifest`; `assemble`
   byte-exact; `verify_setup`; `audit_code_region`; `git diff --check`.
7. Dossier + per-chunk review + count updates (AGENTS/DECOMP_LOG/NEXT_STEPS/
   PLATFORM); commit.

## Verification (both chunks)

`check_manifest` ALL PASS; `check_boundaries` PASS (0 fragment/cross/under/leak/
straddler); `check_splits` 0 fragments; `assemble_original_mips` byte-exact;
`verify_setup` PASS; `audit_code_region` OK; `git diff --check` clean; 0 data files
with function/true-entry wording.

## Current frontier & what remains

- **Frontier `0x00071000` (chunk 7).** First action: `data_00070e70` straddles in
  from chunk 6 — verify whether `0x71000+` continues that packed blob or is code.
  Chunk 7 is parent-undetected → use `scan_functions.js`.
- **18 chunks remain (7–24)** to reach the run's target frontier `0x00191000`.
- Resumption is fully documented in `AGENTS.md`, `DECOMP_LOG.md` (Next Frontier),
  `NEXT_STEPS.md`, and the latest dossier/review; the repo is clean at `f05b535`.

## Unresolved caveats

- All code names are conservative overlay address labels (RAM-suspect).
- Game-data field semantics (record-table fields, name→index wiring) and the
  chunk-6 DATA2 packed-blob format are identified-but-not-decoded.
- Each remaining chunk is a substantial multi-swarm effort; expect ~2–3 chunks per
  fresh-context turn at this rigor.
