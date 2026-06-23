# Review Handoff: Rev 0 Chunks 30-31 Source Ownership

Date: 2026-06-23

Range covered: `0x001E1000..0x00201000`

Final frontier: `0x00201000`

Commits in this run:

- `a84635f` — `Source-own Rev0 chunk 30`
- `69aa39d` — `Source-own Rev0 chunk 31`
- `f959be2` — `Add chunks 30-31 review handoff` (this document)

## Outcome

Chunks 30 and 31 are source-owned as tracked code/data parts. No byte in either
chunk remains only in generated fallback ownership. Both chunks rebuild
byte-exactly.

Current source mix (from `verify_setup` / `assemble_original_mips`):

- 32 tracked real-assembler composite chunks.
- 3,752 tracked original-MIPS source files (177 `boot/` + 3,575 `lib/`).
- 68 generated fallback chunks.
- Source-owned bytes: 2,097,152 (`0x00001000..0x00201000`) = **73.6048%** of the
  evidenced executable MIPS extent (`0x00001000..0x002B89B4`, 2,849,204 bytes).
- Code-only classified bytes: 1,730,712 = **60.7437%** of that extent.
- Cumulative data bytes (chunks 0–31): 366,440 (chunk 30 added 9,404; chunk 31
  added 0).

Code-region SHA256
`40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409` (unchanged);
full ROM SHA256
`571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

Next run starts at `0x00201000` (chunk 32) by emitting
`func_002006E8_chunk32tail`. `func_002006E8` begins in chunk 31 at `0x002006E8`
(clean prologue, no preamble), has no `jr $ra` before the chunk boundary, and
continues past `0x00201000` (parent end `0x00201108`).

## Opening Fixes (verified, no regressions)

The previous run's concrete fixes remained intact at the start of this run (tree
clean at `73e9752`, `check_manifest` passing):

- No stale current-state/frontier/count wording was found needing repair before
  starting; all current-state docs were then advanced to chunks 30/31.
- Root tracked files remain only `.gitattributes`, `.gitignore`, `AGENTS.md`,
  `README.md` — no root scratch artifacts.
- Data-index/data-owner hygiene search found no `True entry`,
  `read-before-write preamble`, `function-boundary`, or `function boundary`
  wording in chunk data indexes or data source owners.
- Prior review-doc commit tables use real commit hashes (no placeholders).
- Patch-workbench caveats from the backfill remain conservative; the baseline
  artifact `patch-workbench-backfill-2026-06-23.json` is unchanged.

## Chunk 30

Range: `0x001E1000..0x001F1000` — **MIXED** (code → interior data → code, both-end
function straddlers).

- Dossier: `docs/dossiers/lib-chunk30-1E1000-1F1000.md`
- Data index: `docs/data-index/rev0/chunk30-data-region-inventory.json`
- Split JSON: `build/chunk_001E1000-001F1000_splits.json`

Classification: **122 parts** = 89 normal code + 31 data + 2 function straddlers
(`check_boundaries` counts 91 code-class because straddlers count with code).

Region/boundary facts:

- Incoming straddler-tail `func_001E0FC8_chunk30tail` `0x001E1000..0x001E120C`
  (returns `jr $ra`@`0x001E1204`, delay `0x001E1208`).
- CODE R1 `0x001E120C..0x001EE574` — FP/RDP display-list world-map / char-data /
  resource code.
- Interior DATA territory `0x001EE574..0x001F0A30` (9,404 bytes) — the Sound-Test
  / "Ogre Battle 64 BGM Selection" screen + staff-credits roll.
- CODE R2 `0x001F0A30..0x001F0F90`.
- Outgoing straddler-head `func_001F0F9C` `0x001F0F90..0x001F1000` (preamble
  `0x001F0F90`, prologue `0x001F0F9C`; continues into chunk 31).

Data accounting (the data-dominant span of this run):

- Data bytes source-owned: **9,404** (31 files).
- Parsed bytes: **2,888** (zero-fill, all string pools, float pools).
- Raw-but-classified bytes: **6,516** (packed graphics/GBI display-list,
  pointer/handler tables, fixed-stride record table).
- Undecoded bytes: **0**.
- Index files added: 1 JSON (with the full 46-string scene-name pool and
  126-string credits pool decoded inline, plus pointer-table and record-table
  inventory and the float constants).
- Known format families: GBI/F3DEX2 display-list + packed graphics; NUL-delimited
  ASCII string pools (scene names, credits, alphabet, printf formats);
  RAM-pointer/handler tables (0x800E/0x801A/0x801B overlay band); a fixed-stride
  record table; IEEE float/double pools (pi, -90.0, 1.1); zero-fill.
- Exact data frontier inside chunk 30: none — all chunk-30 data bytes are owned
  and indexed.

Adversarial result (5 code + 2 data skeptics): 2 high-severity **missed frameless
leaves** found and fixed — former `func_001EA134` held 4 functions (split into
`func_001EA134`/`func_001EA158`/`func_001EA1FC`/`func_001EA2F4`); former
`func_001EAE50` held 2 (split into `func_001EAE50`/`func_001EB030`). 2 LOW
data-typing note nuances corrected (a 1.0 double straddling a soft data seam; a
`0xC0568000_00000000` re-typed consistently as the double -90.0). Both data
verifiers independently confirmed **0 prologues / 0 `jr $ra`** across the data
territory and byte-exact code/data seams at `0x001EE574` and `0x001F0A30`.

## Chunk 31

Range: `0x001F1000..0x00201000` — **ALL CODE** (no data territory; both-end
function straddlers).

- Dossier: `docs/dossiers/lib-chunk31-1F1000-201000.md`
- Split JSON: `build/chunk_001F1000-00201000_splits.json`
- No data index (all code).

Classification: **86 parts** = 84 normal code + 2 function straddlers + 0 data.

Region/boundary facts:

- Incoming straddler-tail `func_001F0F9C_chunk31tail` `0x001F1000..0x001F102C`
  (returns `jr $ra`@`0x001F1024`).
- CODE `0x001F102C..0x002006E8` — FP/GBI display-list builders + attack/queue
  module code (the `0x801CE8BC` owner global threads through both chunks).
- Outgoing straddler-head `func_002006E8` `0x002006E8..0x00201000` (clean
  prologue, no preamble; continues into chunk 32, parent end `0x00201108`).

Code recoveries: parent over-merge un-splits at `0x1F102C`
(`func_001F102C`/`1050`/`10F0`/`114C`) and `0x1FF7EC`
(`func_001FF7EC`/`830`/`868`/`8E0`); the 6-leaf flag-accessor cluster
`0x1F8D70..0x1F8DDC`; frameless leaves `func_001F3AE8`, `func_001F8BDC`;
preamble-orphan folds `func_001F1050`/`3540`/`B1E4`/`DEC8`/`FF8E0`/`FFE80`.

Adversarial result (6 code skeptics): 1 high-severity missed frameless leaf found
and fixed — former `func_001F8A54` held 2 functions (split into `func_001F8A54` +
`func_001F8BDC`, frameless display-list builder leaf at `0x1F8BDC`). 1 med note
correction — `func_001F309C`'s leading 2-word load is a DEAD load, not a
read-before-write preamble; the boundary is kept (re-anchoring to the prologue
`0x1F30A4` would orphan the words as a fragment) and only the header note was
corrected. 4 verifiers clean; the High-Attack cleanup function (`func_001F3540`,
containing `0x1F36F0`) confirmed as one coherent function.

## Parent DB / Overlay Contradictions & Mistakes Corrected

- The parent functions DB **over-merged** functions in both chunks (it only
  detects `addiu $sp,-N` prologues). The analysis + adversarial swarms un-merged
  these and recovered frameless leaves the DB missed (chunk 30: 8+ leaves incl.
  the two adversarial splits; chunk 31: the `0x1F8D70` cluster, `0x1F102C`/
  `0x1FF7EC` un-splits, and one adversarial split).
- The parent DB **role tags** ("character::char-data consumer",
  "dma/resource::resource loader", "promotion::promotion consumer",
  "dispatch::dispatcher/state-machine") were used only as leads; all names stay
  conservative `func_*`.
- Split-tool duplicate-label hazard: parts whose disassembly body already carries
  the parent `function boundary candidate` glabel must NOT also emit that label in
  the split header. 33 chunk-30 parts and 4 chunk-31 parts (those named for a
  parent-detected prologue at the part start, plus the straddler-heads) had their
  header `label` dropped so each symbol is defined exactly once. (Matches the
  `integrate_chunk` rule: `label = null` when `isFuncStartName && embedded`.)

## Parent Workspace Evidence Sweep

Searched parent `C:\Users\Joe\Projects\OgreBattlel64`. Useful matches:

- `docs/rom-layout.md` / `docs/ROM_STATUS.md`: the z64 `~0x1EEB1F`
  "Ogre Battle 64 BGM Selection" Sound-Test string and the sound-test selection
  logic in the MIPS region — **confirms** the chunk-30 data classification.
- `docs/combat-attack-buffer.md` + `scripts/ob64_patch_hook_audit.js`: the Rev 0
  High-Attack streamsplit `resource_free` owner-guard hook at z64 `0x001F36F0`
  (RAM lead 0x801B0260; owner global 0x801CE8BC) — **inside chunk 31**, harvested
  as a patch-workbench candidate (below).
- `scripts/ob64_functions.json` / `ob64_symbols_v2.json`: parent boundary/role
  seeds, reconciled against byte-exact disassembly.

Rejected / false matches:

- `0x8025xxxx`/`0x8026xxxx` linear-map (ROM+0x8006FC00) values — not overlay
  back-maps.
- The `0x801F36D8` RAM token table → ROM `~0x103ED8` (chunk 16), out of range.
- The archive `0x8AE044` sound-test format table — a different table, out of
  range.
- `wiki/battle-turn-queue-trace/rev1-high-attack/*` uses `0x801B/0x801C/0x801D`
  RAM (overlay leads only, not z64 ROM offsets).

## Patch Workbench

One candidate naturally encountered (chunk 31), recorded static-only in
`docs/patch-workbench/rev0/patch-workbench-chunks30-31-2026-06-23.json`:

- **High-Attack streamsplit `resource_free` owner-guard** — hook site z64
  `0x001F36F0` inside `func_001F3540` (`0x1F3540..0x1F3714`). Original words:
  `0x0C01C4B1` (`jal 0x800712C4` resource_free) + delay slot `0x8C84E8BC`
  (`lw $a0,-0x1744($a0)`, `$a0` = owner pointer `[0x801CE8BC]`); the next two
  words clear the owner global. Status **candidate / needs-runtime** — behavior
  and patch safety are NOT proven from source ownership. Hazards: the `$a0` load
  is in the `jal` delay slot (must be preserved/replicated); `$at` is used right
  after to clear the global; overlay-relocated (parent RAM 0x801B0260 is a lead,
  not a z64 back-map). Runtime proof still required (owner-global value/semantics,
  FREE_OWNER 0x8044A820 match, no leak/double-free).

Chunk 30 had no patch-workbench metadata (its data territory is the
Sound-Test/credits screen). The baseline backfill artifact is unchanged. No
static-only finding was upgraded to `proven`.

Unresolved runtime-state requests carried forward (unchanged): High Attack Rev 0
moved-lane gates, raw squad-capacity placement safety, Chaos Frame sub-screen
regression, scenario-main hook timing, overlay mapping/register proof.

## Tooling

No tracked `tools/` JS was changed. The run used the existing pipeline
(`dump_function_context` → `plan_chunk`/`slice_chunk` → analysis swarm →
`build/combine_chunk.js` → `check_boundaries`/`check_splits` → adversarial swarm →
`promote_original_mips` → `split_original_mips_part`). Reusable swarm scripts and
helpers live under gitignored `build/` (`wf_chunk30*.js`, `wf_chunk31*.js`,
`scan_chunk.js`, `region_scan.js`, `blockmap.js`, `win.js`, `decode_strpool.js`,
`validate_finals.js`).

## Verification

```text
node tools/check_manifest.js                         ALL CHECKS PASS (chunk 30=122, chunk 31=86)
node tools/check_boundaries.js --splits build/chunk_001E1000-001F1000_splits.json --disasm build/original-mips/rev0/code_001E1000_001F1000.s   PASS (0 fragment/cross/under/leak/straddler)
node tools/check_splits.js     --splits build/chunk_001E1000-001F1000_splits.json --disasm build/original-mips/rev0/code_001E1000_001F1000.s   0 fragments
node tools/check_boundaries.js --splits build/chunk_001F1000-00201000_splits.json --disasm build/original-mips/rev0/code_001F1000_00201000.s   PASS (0 fragment/cross/under/leak/straddler)
node tools/check_splits.js     --splits build/chunk_001F1000-00201000_splits.json --disasm build/original-mips/rev0/code_001F1000_00201000.s   0 fragments (4 tiny flag-accessor leaves, all with returns)
node tools/assemble_original_mips.js                 Exact code-region match: PASS (SHA 40D4E787..B409)
node tools/verify_setup.js                           PASS
node tools/audit_code_region.js                      OK (executable extent 0x1000..0x2B89B4 unchanged; no code edge into tail)
git diff --check                                     clean
```

JSON validity: `docs/data-index/rev0/chunk30-data-region-inventory.json` and
`docs/patch-workbench/rev0/patch-workbench-chunks30-31-2026-06-23.json` both parse
as valid JSON and match the ranges documented here. No data files carry
function/true-entry wording. No root scratch artifacts are tracked.

## Files Changed

Chunk 30 commit (`a84635f`):

- 122 `asm/original/rev0/lib/` chunk-30 source-owner parts.
- `asm/original/rev0/manifest.json`.
- `docs/dossiers/lib-chunk30-1E1000-1F1000.md`.
- `docs/data-index/rev0/chunk30-data-region-inventory.json`.
- Current-state docs (`AGENTS.md`, `DECOMP_LOG.md`, `NEXT_STEPS.md`,
  `PLATFORM.md`, `WORKFLOW.md`).

Chunk 31 commit:

- 86 `asm/original/rev0/lib/` chunk-31 source-owner parts.
- `asm/original/rev0/manifest.json`.
- `docs/dossiers/lib-chunk31-1F1000-201000.md`.
- `docs/patch-workbench/rev0/patch-workbench-chunks30-31-2026-06-23.json`.
- Current-state docs advanced to chunks 0–31 final counts/frontier.

## Caveats

- Source ownership and byte-exact rebuild are proven; game-behavior names remain
  conservative unless backed by runtime/mutation evidence.
- Parent DB, editor hook, trace, and patch labels are leads only after the low
  resident boot region. Overlay/RAM mapping claims still need runtime proof.
- Chunk 30's packed graphics / GBI display-list blobs and the fixed-stride record
  table are source-owned and classified but not fully semantically decoded (the
  record-table stride/fields are a hypothesis); the string pools, float pools, and
  zero-fill are decoded.
- The High-Attack `0x1F36F0` hook site is a static-only candidate; not proven.

## Reviewer Checklist

- Confirm `asm/original/rev0/manifest.json` has contiguous parts for `0x001E1000`
  (122) and `0x001F1000` (86).
- Spot-check chunk-30 data classifications against
  `docs/data-index/rev0/chunk30-data-region-inventory.json` (BGM scene-name pool,
  credits roll, pointer tables, record-table hypothesis).
- Review the adversarial frameless-leaf splits: chunk 30 `0x1EA134`/`0x1EAE50`,
  chunk 31 `0x1F8A54`→`0x1F8BDC`; and the `func_001F309C` dead-load note.
- Review the patch-workbench candidate at `0x1F36F0` (owner `func_001F3540`); it
  is static-only / needs-runtime.
- Re-run the verification commands above if touching source ownership.
- Resume at `0x00201000` (chunk 32) with `func_002006E8_chunk32tail`; confirm the
  straddler's return/end before splitting the remainder.
