# Review Handoff: Rev 0 Chunks 36-37 Source Ownership

Date: 2026-06-23

Range covered: `0x00241000..0x00261000`

Final frontier: `0x00261000`

## Commits in this run

- `814c3a1` — `Combat-state runtime one-shot (RSR-014) + chunks34-35 review clarification`
  (opening fix + combat-state retrospective; doc/workflow only)
- `f456033` — `Source-own Rev0 chunk 36 (0x241000..0x251000)`
- `755fc9f` — `Source-own Rev0 chunk 37 (0x251000..0x261000) + advance current-state docs`
- `950e823` — `Add chunks 36-37 review handoff` (this document)

## Outcome

Chunks 36 and 37 are source-owned as tracked **code/data parts** (both MIXED — not "fully
split into functions"). No byte in either chunk remains in generated fallback ownership.
Both chunks rebuild byte-exactly.

Current source mix (from `verify_setup` / `assemble_original_mips`):

- **38** tracked real-assembler composite chunks.
- **4,657** tracked original-MIPS source files (177 `boot/` + 4,480 `lib/`).
- **62** generated fallback chunks.
- Source-owned bytes: **2,490,368** (`0x00001000..0x00261000`) = **87.4057%** of the
  evidenced executable MIPS extent (`0x00001000..0x002B89B4`, 2,849,204 bytes).
- Code-only classified bytes: **2,101,388** = **73.7535%** of that extent.
- Cumulative data bytes (chunks 0–37): 388,980 (chunk 36 added 4,380; chunk 37 added 3,028).

Code-region SHA256
`40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409` (unchanged);
full ROM SHA256
`571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

Next run starts at `0x00261000` (chunk 38) by emitting `func_00260F30_chunk38tail`.
`func_00260F30` begins in chunk 37 at `0x00260F30` (prologue `addiu $sp,-0x20`), has no
`jr $ra` before the chunk boundary, and continues into chunk 38.

## Opening Fixes

- chunks34-35 review handoff: confirmed it still accurately records the chunks34-35
  source-ownership work after coordinator commit `82f034d`. Added a dated **SUPERSEDED**
  note clarifying that its RSR-012 "`battle\*` empty" statement is now stale (19 battle
  states were added later); current docs do not repeat the "battle empty" claim.
- Confirmed current-state docs reported chunks 0-35 owned, frontier `0x00241000`,
  36 composites / 4,313 files / 64 fallback, and the runtime-state catalog/request-log
  workflow before this run.
- Hygiene reconfirmed: root tracked files are only `.gitattributes/.gitignore/AGENTS.md/
  README.md`; no DATA file carries function-boundary/true-entry wording; new JSON parses.
- Carried-forward chunks34-35 caveats remain: chunk-35 outgoing `func_00240FF0` ends in
  chunk 36 (handled here as `func_00240FF0_chunk36tail`); overlay/RAM mapping for the
  combat overlay remains runtime-proof work; chunk-34/35 data islands stay
  classified-but-not-fully-decoded.

## Combat-State Runtime One-Shot / Backfill (RSR-014)

Bounded **static** examination of the 19 new vanilla Rev 0 `battle\*` states (7
loading/intro, 2 command_prompt, 4 active, 6 ending/results) against source-owned combat
code (chunks 30-35) + patch-workbench artifacts. **No states were loaded into an emulator,
mutated, moved, or renamed; no emulator sweeps were run.** Read-only directory re-inventory
confirmed the 19 states; the coordinator previously header-verified identity
(`E6419BC5/69011DE3`, country `0x45`, version `0`). Per `TestingWorkFlow.MD`, actual runtime
observation is Joe-driven and was NOT performed this run, so nothing is marked proven.

Each combat target was mapped to its nearest battle state with the exact proof still needed
(full table in `docs/runtime-state-requests.md` → "Combat-State One-Shot" section;
machine-readable in `docs/patch-workbench/rev0/combat-state-oneshot-2026-06-23.json`):

- High-Attack primary insert hook `0x21CD48` → `battle_active`/`battle_command_prompt`.
- High-Attack slot0 zero-return hook `0x21BF84` → `battle_active`.
- High-Attack cleanup owner-free guard `0x1F36F0` → `battle_ending_or_results`.
- RSR-001 (battle overlay/RAM mapping) → all four battle leaves.
- RSR-013 (promotion/level-up overlay+register) → `battle_active` + `core-menus\class_change`.

Request-log changes: **RSR-014 marked satisfied (static examination)** — the mapping ran and
recorded what remains. RSR-001 stays `candidate-state-available`; RSR-011/RSR-013 stay
`needs-runtime`/`candidate`. No patch-workbench classification changed (all hook candidates
remain `candidate`/`needs-runtime`). No new hook candidates were encountered in chunks 36-37.

## Chunk 36 — `0x00241000..0x00251000` — MIXED (2 data islands)

- Dossier: `docs/dossiers/lib-chunk36-241000-251000.md`
- Data index: `docs/data-index/rev0/chunk36-data-region-inventory.json`
- Split JSON: `build/chunk_00241000-00251000_splits.json`

Classification: **164 parts** = 134 normal code + 1 straddler-tail + 1 straddler-head + 28 data.

Region/boundary facts:

- Incoming straddler-tail `func_00240FF0_chunk36tail` `0x00241000..0x002410A0`
  (returns `jr $ra`@`0x00241098`).
- CODE region 1 `0x002410A0..0x00243F14` — GBI/RDP display-list builders + class/promotion code.
- DATA island A `0x00243F14..0x002447A0` (2,188 bytes).
- CODE region 2 `0x002447A0..0x0024B410` — incl. recovered frameless GBI builders
  `func_0024A37C`/`func_0024A638`, dispatcher `func_0024AF04`.
- DATA island C `0x0024B410..0x0024BCA0` (2,192 bytes).
- CODE region 3 `0x0024BCA0..0x00250F9C` — frameless range-check `func_0024BCA0`, a
  frameless divide/scale-helper cluster (`func_0024BD60`..`func_0024BDEC`), display/class code.
- Outgoing straddler-head `func_00250F9C` `0x00250F9C..0x00251000` (continues into chunk 37).

Data accounting: 4,380 bytes (28 files) — data 1,996 · rodata 1,188 · table 684 · float 456 ·
zero_fill 56. 0x801D/0x801E display-list/handler pointer tables, GBI/RDP packed blobs,
float/double pools, and rodata (class/area/format strings). Undecoded bytes: 0.

Adversarial result (5 code + 1 data + straddler skeptics): clean except 1 MED (a
preamble-orphan boundary `func_0024BE1C`/`func_0024BE5C` mis-split — fixed: `func_0024BE1C`
ends at `0x24BE5C`, `func_0024BE5C` starts at the preamble) and 2 LOW data-naming nits (one
no-pointer table renamed `data_00244360`). A delay-slot leak in the divide-helper cluster
was caught by `check_boundaries` and fixed before the adversarial pass.

## Chunk 37 — `0x00251000..0x00261000` — MIXED (1 data island)

- Dossier: `docs/dossiers/lib-chunk37-251000-261000.md`
- Data index: `docs/data-index/rev0/chunk37-data-region-inventory.json`
- Split JSON: `build/chunk_00251000-00261000_splits.json`

Classification: **180 parts** = 170 normal code + 1 straddler-tail + 1 straddler-head + 8 data.

Region/boundary facts:

- Incoming straddler-tail `func_00250F9C_chunk37tail` `0x00251000..0x002510E0`
  (returns `jr $ra`@`0x002510D8`).
- CODE region 1 `0x002510E0..0x0025E2BC` — dense message/command-dispatcher handlers
  (`andi $a0,0xFFFF` selector + `beq`/`slti` + overlay tail-jumps), with heavy parent
  over-merge frameless-leaf recovery.
- DATA island F `0x0025E2BC..0x0025EE90` (3,028 bytes) — mixed 0x80x-band pointer/struct/
  float record table + trailing float32 pool.
- CODE region 2 `0x0025EE90..0x00260F30` — recovered frameless FP/compare leaves + handlers.
- Outgoing straddler-head `func_00260F30` `0x00260F30..0x00261000` (continues into chunk 38).

Data accounting: 3,028 bytes (8 files) — data 2,668 · float 200 · table 148 · zero_fill 12.
Undecoded bytes: 0.

Adversarial result (4 code + 1 data + straddler skeptics): **all clean** (1 LOW
data-note error corrected — a nonexistent "0x800E band" pointer mention removed). The
heavy un-merges (`func_0025B394` → 6 functions; a 20-function un-merge across
`0x25B954..0x25D394`) were all confirmed genuine; the run-prompt's small 4/20/28/40-byte
"gap" leads were proven CODE (frameless FP/compare leaves), not data.

## Parent DB / Overlay Contradictions & Mistakes Corrected

- **Multi-island carve:** chunks 36-37 needed `build/carve_chunk.js` generalized to carve
  multiple interior data islands and to prepend synthetic leading entries where a
  parent-undetected frameless function leads a code region (`func_0024BCA0`).
- **Parent-gap "data leads" were not all data:** chunk-36 `0x24A37C` (frameless GBI
  builders) and `0x24BD60` (frameless divide/scale helpers), and chunk-37 `0x25EEF8`/
  `0x25F6C0`/`0x25F7E8`/`0x25FD90` were proven CODE by byte-exact disassembly. The genuine
  data islands are A/C (chunk 36) and F (chunk 37).
- **Delay-slot leak** in the chunk-36 divide-helper cluster (split ON the `jr $ra` word) —
  fixed so each helper owns its delay slot.
- **Preamble-orphan boundary** `func_0024BE5C` (chunk 36) corrected to the preamble start.
- **Duplicate-label safety:** redundant header labels that duplicated the body's parent
  boundary glabel (both outgoing straddler-heads) were dropped; preamble-orphans are named
  for the PART START, not the prologue address.
- Region C's data ends at `0x24BCA0`; the trailing frameless range-check leaf was carved
  into CODE region 3.

## Parent Workspace Evidence Sweep

Searched parent `C:\Users\Joe\Projects\OgreBattlel64` for `0x241000..0x261000` (z64 + RAM
forms + accessed globals). Leads (validated against byte-exact disassembly; documentation
only, NOT applied as names):

- Chunks 36-37 are a **mission-briefing / combat display-list module**: ~14 functions
  parent-tagged active in `mission_briefing`+`combat`; they build F3DEX/GBI display lists
  (control globals `0x801F0000..0x801F007E`, DL/framebuffer pointers `0x800F9BA0`/`0x800A9E70`)
  from class/promotion/character data (`0x801C`/`0x801D` globals). `func_002447A0` is a
  high-fan-in resource alloc/free helper (10 cross-chunk callers).

Rejected / false matches:

- Linear-map decode-comment values (`0x802Bxxxx`/`0x802Cxxxx`/`0x802Dxxxx`) — not runtime RAM.
- Rev 1.1-only hook offsets — N/A in this range.

## Patch Workbench

**No new hook candidates** were naturally encountered (chunks 36-37 are display-list /
dispatcher code; no streamsplit/attack-buffer hook sites in range). The carried chunk-33
candidates (`0x21CD48`, `0x21BF84`) and chunk-31 `0x1F36F0` are unchanged and remain
`candidate`/`needs-runtime` (RSR-011/RSR-014). The only new patch-workbench artifact is the
combat-state one-shot triage JSON. No static-only finding was upgraded to `proven`.

## Tooling

No tracked `tools/` JS changed. `build/carve_chunk.js` was generalized (gitignored) to
support repeated `--code`/`--data` flags (multiple data islands) and to prepend a synthetic
leading entry for a parent-undetected frameless function at a code-region start. New
gitignored per-chunk swarm scripts: `wf_chunk36.js`/`wf_chunk36_adv.js`/`wf_chunk37.js`/
`wf_chunk37_adv.js`. Standard pipeline otherwise (`dump_function_context` → `plan_chunk`/
`carve_chunk` → `slice_chunk` → analysis swarm → `combine_chunk` → `check_boundaries`/
`check_splits` → adversarial swarm → `promote_original_mips` → `split_original_mips_part`).

## Verification

```text
node --check build/*.js (touched helpers)            OK
node tools/check_manifest.js                         ALL CHECKS PASS (chunk 36=164, chunk 37=180)
node tools/check_boundaries.js --splits build/chunk_00241000-00251000_splits.json --disasm build/original-mips/rev0/code_00241000_00251000.s   PASS (0 fragment/cross/under/leak/straddler)
node tools/check_splits.js     --splits build/chunk_00241000-00251000_splits.json --disasm build/original-mips/rev0/code_00241000_00251000.s   0 fragments
node tools/check_boundaries.js --splits build/chunk_00251000-00261000_splits.json --disasm build/original-mips/rev0/code_00251000_00261000.s   PASS (0 fragment/cross/under/leak/straddler)
node tools/check_splits.js     --splits build/chunk_00251000-00261000_splits.json --disasm build/original-mips/rev0/code_00251000_00261000.s   0 fragments
node tools/assemble_original_mips.js                 Exact code-region match: PASS (SHA 40D4E787..B409)
node tools/verify_setup.js                           PASS (38 composites / 4,657 files / 62 fallback)
node tools/audit_code_region.js                      OK (executable extent unchanged; no code edge into tail)
git diff --check                                     clean
```

JSON validity: both new `docs/data-index/rev0/chunk3{6,7}-data-region-inventory.json` and
`docs/patch-workbench/rev0/combat-state-oneshot-2026-06-23.json` parse and match the ranges
documented here. No data files carry function/true-entry wording. No root scratch artifacts
are tracked.

## Files Changed

- Combat-one-shot commit (`814c3a1`): `docs/REVIEW_2026-06-23_chunks34-35-source-ownership.md`,
  `docs/runtime-state-requests.md`, `docs/patch-workbench/rev0/combat-state-oneshot-2026-06-23.json`.
- Chunk 36 commit (`f456033`): 164 `asm/original/rev0/lib/` parts; `manifest.json`;
  `docs/dossiers/lib-chunk36-241000-251000.md`; `docs/data-index/rev0/chunk36-data-region-inventory.json`.
- Chunk 37 commit: 180 `asm/original/rev0/lib/` parts; `manifest.json`;
  `docs/dossiers/lib-chunk37-251000-261000.md`; `docs/data-index/rev0/chunk37-data-region-inventory.json`;
  current-state docs (`AGENTS.md`, `DECOMP_LOG.md`, `NEXT_STEPS.md`, `PLATFORM.md`, `WORKFLOW.md`).

## Caveats

- Source ownership and byte-exact rebuild are proven; game-behavior names remain
  conservative `func_*` unless backed by runtime/mutation evidence.
- Overlay/RAM mapping for this mission-briefing/combat overlay still needs runtime proof
  (RSR-001/RSR-013/RSR-014); the combat-state one-shot was static.
- The interior data islands' packed GBI/RDP blobs and mixed pointer/struct record tables are
  classified but not fully semantically decoded (raw-but-classified); strings, float pools,
  and zero-fill are decoded.
- `func_00260F30` (chunk 37 outgoing straddler) is owned as one part spanning into chunk 38;
  its return is past `0x00261000`.

## Reviewer Checklist

- Confirm `asm/original/rev0/manifest.json` has contiguous parts for `0x00241000` (164) and
  `0x00251000` (180).
- Spot-check the data classifications against the two data-index JSONs (chunk-36 islands A/C;
  chunk-37 island F).
- Review the chunk-36 frameless recoveries in the parent gaps (`func_0024A37C`/`func_0024A638`
  GBI builders; the `func_0024BD60` divide/scale cluster + its delay-slot fix) and the
  `func_0024BE5C` preamble-orphan fix; and the chunk-37 heavy un-merges (`func_0025B394` → 6).
- Re-run the verification commands above if touching source ownership.
- Resume at `0x00261000` (chunk 38) with `func_00260F30_chunk38tail`; confirm its return in
  chunk 38 before splitting the remainder.
