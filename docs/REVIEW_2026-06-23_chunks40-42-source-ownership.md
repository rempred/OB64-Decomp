# Review Handoff: Rev 0 Chunks 40-42 Source Ownership

Date: 2026-06-23

Range covered: `0x00281000..0x002B1000` (three chunks)

Final frontier: `0x002B1000` (chunk 42 ends mid-function — outgoing straddler `func_002B0E8C`
continues into chunk 43)

## Commits in this run

- `3d6fc2e` — `Source-own Rev0 chunk 40 (0x281000..0x291000) + advance current-state docs`
  (also carried the opening fixes: chunks38-39 review placeholder fixes `b412d8e`/`ab35613`, and
  3 stale current-state blocks corrected in DECOMP_LOG/AGENTS/PLATFORM left at chunks 0-37/0x261000)
- `1533e7d` — `Source-own Rev0 chunk 41 (0x291000..0x2A1000) + advance current-state docs`
- `fcf18b5` — `Source-own Rev0 chunk 42 (0x2A1000..0x2B1000) + advance current-state docs`
- `Add chunks 40-42 review handoff` — this document, committed as the run's final commit
  (its own hash is recorded in the run's final report / bridge ping)

## Outcome

Chunks 40, 41, and 42 are source-owned as tracked **code/data parts** (all three MIXED — NOT
"fully split into functions"). No byte in any chunk remains in generated fallback ownership. All
three rebuild byte-exactly.

Current source mix (from `verify_setup` / `assemble_original_mips`):

- **43** tracked real-assembler composite chunks.
- **5,534** tracked original-MIPS source files (177 `boot/` + 5,357 `lib/`).
- **57** generated fallback chunks.
- Source-owned bytes: **2,818,048** (`0x00001000..0x002B1000`) = **98.9065%** of the evidenced
  executable MIPS extent (`0x00001000..0x002B89B4`, 2,849,204 bytes).
- Code-only classified bytes: **2,413,388** = **84.7042%** of that extent.
- This run added 8,124 data bytes (chunk 40: 3,404; chunk 41: 1,916; chunk 42: 2,804).

Code-region SHA256 `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409` (unchanged);
full ROM SHA256 `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

## Opening Fixes

- Fixed the chunks38-39 review handoff bookkeeping: replaced the prose review-handoff commit line
  with the real hash `b412d8e`, and the `__CHUNK39__` placeholder in Files Changed with `ab35613`.
- Fixed 3 stale current-state blocks the prior runs missed (Known Issue #7): DECOMP_LOG
  "Current Invariants" tail ("next is chunk 38"/`0x00261000`), DECOMP_LOG "## Next Frontier"
  (chunks 0-37), and AGENTS.md "Current verifier result" (38 composites/4,657/62). Also cleaned two
  deeply stale PLATFORM "Expected current results" snapshots (34 composites/4,059/66).
- Confirmed `RUNTIME_STATE_ONESHOT` stays `none` (RSR-014 satisfied; no new current-range
  runtime-state request). Carried-forward caveats from chunks 38-39 preserved.

## Chunk 40 — `0x00281000..0x00291000` — MIXED (2 data islands)

Dossier: `docs/dossiers/lib-chunk40-281000-291000.md`; data index
`docs/data-index/rev0/chunk40-data-region-inventory.json`; split JSON
`build/chunk_00281000-00291000_splits.json`.

**159 parts = 142 normal code + 1 straddler-head + 0 straddler-tail + 16 data.** No incoming
straddler (starts with data continuing chunk 39's DATA C).

- DATA L `0x281000..0x281860` (2,144 B) — 640/480 records + ~314-word RAM-pointer table + Yes/No
  UI strings + float64 doubles.
- CODE C1 `0x281860..0x2866E4` — incl. dispatcher `func_00284288` (parent-evidenced, 87 callees).
- DATA M `0x2866E4..0x286BD0` (1,260 B) — float32 pool + strings + zero-fill + `0x8022Axxx` ptr table.
- CODE C2 `0x286BD0..0x291000` — ending in outgoing straddler-head `func_00290D50`
  `0x290D50..0x291000` (preamble → prologue 0x290D58 → chunk 41).

Data: 3,404 B (table 1,552 · data 1,380 · float 220 · rodata 184 · zero_fill 68).
Frameless recoveries (128 B@`0x283D94`, 224 B@`0x286444`, 1944 B@`0x28F18C`) proven CODE.
`check_boundaries` caught 1 over-split (`func_0028A7B0`/`func_0028A7E4` merged — `bne`@`0x28A7BC`
is an internal forward branch). Adversarial (4 code + 2 data) **all 6 clean**.

## Chunk 41 — `0x00291000..0x002A1000` — MIXED (1 data island)

Dossier: `docs/dossiers/lib-chunk41-291000-2A1000.md`; data index
`docs/data-index/rev0/chunk41-data-region-inventory.json`; split JSON
`build/chunk_00291000-002A1000_splits.json`.

**160 parts = 134 normal code + 1 straddler-tail + 1 straddler-head + 24 data.**

- Incoming straddler-tail `func_00290D50_chunk41tail` `0x291000..0x2910DC` (jr$ra@0x2910D4).
- CODE C1 `0x2910DC..0x299D44` (FP-heavy).
- DATA D `0x299D44..0x29A4C0` (1,916 B) — zero-fill + RAM-pointer tables + ASCII pools
  ('Palatinean Year', '0123456789', 'Saldian'/'Viragore', element/faction) + 30.0f.
- CODE C2 `0x29A4C0..0x2A1000` (incl. the `func_0029BBD8` delay-slot-prologue recovery) — ending
  in outgoing straddler-head `func_002A0EF0` `0x2A0EF0..0x2A1000` → chunk 42.

Data: 1,916 B (rodata 648 · table 632 · data 520 · zero_fill 84 · float 32). Swarm/gate fixes:
7 spurious `straddler-head` labels → code; 9 preamble-orphan label conflicts; a 4-byte DATA D gap
(string-terminator word) folded into `rodata_00299f80`; a slice-seam preamble fragment
(`func_0029FF74`) merged forward. Adversarial (4 code + 1 data) **all 5 clean** (1 LOW note typo).

## Chunk 42 — `0x002A1000..0x002B1000` — MIXED (2 data islands)

Dossier: `docs/dossiers/lib-chunk42-2A1000-2B1000.md`; data index
`docs/data-index/rev0/chunk42-data-region-inventory.json`; split JSON
`build/chunk_002A1000-002B1000_splits.json`.

**171 parts = 157 normal code + 1 straddler-tail + 1 straddler-head + 12 data.**

- Incoming straddler-tail `func_002A0EF0_chunk42tail` `0x2A1000..0x2A135C` (jr$ra@0x2A1354).
- CODE C1 `0x2A135C..0x2A82B4` (FP; 156 B frameless matrix-transform leaf `func_002A3310`).
- DATA A `0x2A82B4..0x2A8D20` (2,668 B) — zero-fill + concept/emotion string pool (ardor/passion/…)
  + element string pool ('serene water'/'solid earth'/'ragng flame'/'swift wind') + RAM-pointer
  tables + float64 pool (pi ×5) + trailing `0x802376E4` dispatch/jump-table run.
- CODE C2 `0x2A8D20..0x2AE338` (frameless FP preamble `func_002A90EC`; 520 B frameless leaf).
- DATA B `0x2AE338..0x2AE3C0` (136 B) — float64 pool: pi/180/90/160/120/0.5/1.0/0.005 (angle/scale math).
- CODE C3 `0x2AE3C0..0x2B1000` (204 B frameless leaf) — ending in outgoing straddler-head
  `func_002B0E8C` `0x2B0E8C..0x2B1000` (preamble → prologue `addiu $sp,-0x140` 0x2B0E94 → chunk 43).

Data: 2,804 B (rodata 1,540 · float 664 · data 228 · table 204 · jumptable 140 · zero_fill 28).
Fixes: 4 spurious `straddler-head` labels → code; 44 preamble-orphan label conflicts; a
straddler-boundary overlap (`func_002B0D30` end→`0x2B0E8C`); a slice-seam preamble fragment
(`func_002ADF30`) merged forward; 1 MED adversarial preamble fix (`func_002A8F24`/`func_002A90EC`
boundary @`0x2A90EC`). Adversarial (5 code + 2 data) clean after the MED + LOW fixes.

## Data accounting (Data Territory Mode)

Total data this run: **8,124 bytes** across 52 data parts (chunk 40: 16, chunk 41: 24, chunk 42:
12). All parts are `parsed` or `raw-but-classified` (packed display-list/dispatch blobs and some
pointer tables are raw-but-classified; string pools, float64 pools, zero-fill are parsed); **0
bytes undecoded-and-unclassified**. Index files added:
`docs/data-index/rev0/chunk4{0,1,2}-data-region-inventory.json`. Format families found:
RAM-pointer/dispatch tables (`0x8022`/`0x8023`/`0x8024` band), float32/float64 math pools (pi,
180/90/160/120, 0.5/1.0, 0.005/0.15), ASCII string pools (UI Yes/No, calendar/faction names,
concept/emotion + element keyword pools), 640/480 screen-dim records, GBI dispatch-pointer runs.
Next data frontier: `0x002B1000` (chunk 43 — crosses the executable-extent end `0x2B89B4`).

## Parent DB / overlay contradictions & mistakes corrected

- The recurring swarm hazard this run: analysts marked mid-chunk functions ending in overlay
  tail-jumps (`j 0x80xxxxxx`) as `straddler-head` — only the chunk-final function is a straddler.
  11 spurious labels reclassified to `code` across chunks 41-42.
- Slice-seam preamble fragments (a 2-word read-before-write preamble at the boundary between two
  slices) appeared in all three chunks; merged forward (`func_0029FF74`, `func_002ADF30`) or fixed
  via boundary correction (`func_0028A7B0` merge; `func_002B0D30`/`func_002B0E8C` overlap;
  `func_002A8F24`/`func_002A90EC`).
- Frameless leaves in parent gaps (128/224/1944 B in chunk 40; 64 B in chunk 41; 156/56/520/204 B
  in chunk 42) are CODE, not data; genuine data islands are only the ones documented above.

## Parent workspace evidence sweep

Searched parent `C:\Users\Joe\Projects\OgreBattlel64` for `0x281000..0x2B1000` (z64 + RAM forms).
Validated leads (documentation only; names stay `func_*`):

- ROM `0x00284288` (`docs/mips-decode.md`, `scripts/ob64_xrefs.json`): combat/scenario dispatcher,
  87 callees (chunk 40).
- ROM `0x0028CA1C` (parent chaos-frame research log): speculative loader/decoder cluster (chunk 40,
  low confidence).
- `Cutscene Frames/dma_log_all.txt`: DMA "RAWLOW" loads `0x281860..0x2877D0` during cutscene
  rendering (confirms display-list content in range).

Overlay-mapping caveat (RSR-001): `ram_snapshots/overlay_sources.json` documents combat overlay
sources (combat high-slot `0x278F90`→RAM `0x80224800` ending `0x27CC90`; combat main-engine
`0x2637B0`→RAM `0x8020EC00` ending `0x2697B0`). **Both end before `0x281000`**, so chunks 40-42 are
NOT covered by the documented overlay sources — unclaimed-overlay/data; runtime overlay mapping for
this range remains unproven.

Rejected / cautioned: the `scripts/ob64_4a_audit.json` "LZSS block inventory" claiming
`0x28123e..0x290d04` as compressed asset data is inconsistent with byte-exact disassembly (real
prologues/`jr $ra`/FP code present; `audit_code_region` classifies `0x1000..0x2B89B4` as
executable). Treated as a misaligned/false match.

## Patch Workbench

**No new hook candidates** were naturally encountered (chunks 40-42 are FP/display-list/UI code +
table/blob data; no streamsplit/attack-buffer hook sites in range). The carried combat hook
candidates (`0x21CD48`, `0x21BF84`, `0x1F36F0`) are outside this range and unchanged
(`candidate`/`needs-runtime`, RSR-011/RSR-014). No static-only finding upgraded to `proven`. No new
`docs/patch-workbench/rev0/*.json` artifact created.

## Runtime-state catalog / request log

No runtime states were loaded or used this run (static source ownership only). The runtime-state
request log `docs/runtime-state-requests.md` is unchanged: no IDs opened, served, or superseded.
RSR-001/RSR-011/RSR-013 remain open runtime-proof requests; RSR-014 stays satisfied (static). The
chunk-40 overlay-source observations (combat overlay sources end before `0x281000`) are recorded in
the dossier/review under RSR-001's umbrella but did not require a new request.

## Tooling

No tracked `tools/` JS changed. Reused gitignored helpers `build/carve_chunk.js`,
`build/combine_chunk.js`, `build/gen_data_index.js`. New gitignored per-chunk swarm scripts:
`wf_chunk4{0,1,2}.js` / `wf_chunk4{0,1,2}_adv.js`. Standard pipeline (`dump_function_context`/
`plan_chunk`/`carve_chunk` → `slice_chunk` → analysis swarm → `combine_chunk` →
`check_boundaries`/`check_splits` → adversarial swarm → `promote_original_mips` →
`split_original_mips_part`).

## Verification

```text
node tools/check_manifest.js                         ALL CHECKS PASS (40=159, 41=160, 42=171)
node tools/check_boundaries.js --splits build/chunk_00281000-00291000_splits.json --disasm build/original-mips/rev0/code_00281000_00291000.s   PASS
node tools/check_splits.js     --splits build/chunk_00281000-00291000_splits.json --disasm build/original-mips/rev0/code_00281000_00291000.s   0 fragments
node tools/check_boundaries.js --splits build/chunk_00291000-002A1000_splits.json --disasm build/original-mips/rev0/code_00291000_002A1000.s   PASS
node tools/check_splits.js     --splits build/chunk_00291000-002A1000_splits.json --disasm build/original-mips/rev0/code_00291000_002A1000.s   0 fragments
node tools/check_boundaries.js --splits build/chunk_002A1000-002B1000_splits.json --disasm build/original-mips/rev0/code_002A1000_002B1000.s   PASS
node tools/check_splits.js     --splits build/chunk_002A1000-002B1000_splits.json --disasm build/original-mips/rev0/code_002A1000_002B1000.s   0 fragments
node tools/assemble_original_mips.js                 Exact code-region match: PASS (SHA 40D4E787..B409)
node tools/verify_setup.js                           PASS (43 composites / 5,534 files / 57 fallback)
node tools/audit_code_region.js                      OK (executable extent unchanged; no code edge into tail)
git diff --check                                     clean
```

JSON validity: the three new `docs/data-index/rev0/chunk4{0,1,2}-data-region-inventory.json` parse
and match the documented ranges. No data files carry function/true-entry wording. No root scratch
artifacts are tracked.

## Files Changed

- Chunk 40 (`3d6fc2e`): 159 `asm/original/rev0/lib/` parts; `manifest.json`; chunk-40 dossier +
  data index; opening fixes (chunks38-39 review; 3 stale-prose blocks); current-state docs.
- Chunk 41 (`1533e7d`): 160 `lib/` parts; `manifest.json`; chunk-41 dossier + data index;
  current-state docs.
- Chunk 42 (`fcf18b5`): 171 `lib/` parts; `manifest.json`; chunk-42 dossier + data index;
  current-state docs (`AGENTS.md`, `DECOMP_LOG.md`, `NEXT_STEPS.md`, `PLATFORM.md`, `WORKFLOW.md`).

## Caveats

- Source ownership and byte-exact rebuild are proven; game-behavior names remain conservative
  `func_*` unless backed by runtime/mutation evidence.
- Overlay/RAM mapping for chunks 40-42 still needs runtime proof (RSR-001); these chunks are NOT in
  the documented combat overlay sources (which end before `0x281000`).
- The packed display-list/dispatch blobs and some pointer tables are classified but not fully
  field-decoded (raw-but-classified); string pools, float pools, and zero-fill are decoded.
- `func_002B0E8C` (chunk 42 outgoing straddler) is owned as one part spanning into chunk 43; its
  return is past `0x002B1000`.
- Chunk 43 crosses the evidenced executable-extent end `0x002B89B4` — the next run must expect a
  code→data transition and classify the tail honestly (do not reclassify the tail in this run).

## Reviewer Checklist

- Confirm `asm/original/rev0/manifest.json` has contiguous parts for `0x00281000` (159),
  `0x00291000` (160), `0x002A1000` (171).
- Spot-check the data islands against the three data-index JSONs (chunk 40 L/M; chunk 41 D;
  chunk 42 A/B incl. the float64 pi pools and string pools).
- Review the boundary fixes: chunk-40 `func_0028A7B0` merge; chunk-41 7 straddler-head
  reclassifications + the `func_0029FF74` fragment merge; chunk-42 `func_002B0D30`/`func_002B0E8C`
  overlap + the `func_002A8F24`/`func_002A90EC` MED preamble fix.
- Re-run the verification commands above if touching source ownership.
- Resume at `0x002B1000` (chunk 43) with `func_002B0E8C_chunk43tail`; classify the code→data
  transition near `0x002B89B4` honestly.
