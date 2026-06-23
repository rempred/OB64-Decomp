# Review Handoff: Rev 0 Chunks 34-35 Source Ownership

Date: 2026-06-23

Range covered: `0x00221000..0x00241000`

Final frontier: `0x00241000`

## Commits in this run

- `345b5e4` — `Fix chunks32-33 review commits + runtime-state backfill one-shot`
  (opening fixes + RSR-012 retrospective)
- `4d33a2c` — `Source-own Rev0 chunk 34 (0x221000..0x231000)`
- `7073753` — `Source-own Rev0 chunk 35 (0x231000..0x241000) + advance current-state docs`
- (this document) — `Add chunks 34-35 review handoff`

(The two chunk commits and the docs/handoff commits are the source-ownership
changes; the opening-fixes commit is workflow/doc-only.)

## Outcome

Chunks 34 and 35 are source-owned as tracked **code/data parts** (not "fully split
into functions" — both are MIXED). No byte in either chunk remains in generated
fallback ownership. Both chunks rebuild byte-exactly.

Current source mix (from `verify_setup` / `assemble_original_mips`):

- **36** tracked real-assembler composite chunks.
- **4,313** tracked original-MIPS source files (177 `boot/` + 4,136 `lib/`).
- **64** generated fallback chunks.
- Source-owned bytes: **2,359,296** (`0x00001000..0x00241000`) = **82.8054%** of the
  evidenced executable MIPS extent (`0x00001000..0x002B89B4`, 2,849,204 bytes).
- Code-only classified bytes: **1,977,724** = **69.4132%** of that extent.
- Cumulative data bytes (chunks 0–35): 381,572 (chunk 34 added 5,396; chunk 35 added 2,060).

Code-region SHA256
`40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409` (unchanged);
full ROM SHA256
`571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

Next run starts at `0x00241000` (chunk 36) by emitting `func_00240FF0_chunk36tail`.
`func_00240FF0` begins in chunk 35 at `0x00240FF0` (prologue `addiu $sp,-0x20`, then
`lui $s0,0x801F / lw`), has no `jr $ra` before the chunk boundary, and continues into
chunk 36.

## Opening Fixes

- `docs/REVIEW_2026-06-23_chunks32-33-source-ownership.md`: the commits section now
  cites the real review-handoff commit `34a668b` and lists the coordinator workflow
  follow-ups `2ad2e14` / `959a836` as post-handoff (NOT source-ownership) edits.
- Confirmed current-state docs reported chunks 0-33 owned, frontier `0x00221000`,
  34 composites / 4,059 files / 66 fallback, and the runtime-state catalog/request
  workflow before this run started.
- Hygiene reconfirmed: root tracked files are only `.gitattributes/.gitignore/
  AGENTS.md/README.md`; no DATA file carries function-boundary/true-entry wording
  (the only `float_*` match, `float_ldexp_d.s`, is a libc CODE function); new JSON
  artifacts parse.

## Runtime-State One-Shot / Backfill (RSR-012)

Bounded static retrospective over already source-owned work (chunks 0-33) and current
patch-workbench artifacts, triaged against the curated vanilla Rev 0 Project64 catalog.
**No runtime states were loaded, captured, or mutated; no emulator sweeps were run.**
The catalog directory was re-inventoried read-only and matches the documented snapshot
(79 `.pj.zip`; `battle\*` and `data-coverage\*` leaves all empty).

Triage (full table in `docs/runtime-state-requests.md` → "Backfill Triage" section;
machine-readable in `docs/patch-workbench/rev0/runtime-state-backfill-triage-2026-06-23.json`):

- still-needs-capture: RSR-001 (battle), RSR-002/003/004/005/006 (data-coverage),
  RSR-008 (post-battle/scenario-complete) — all blocked by empty catalog leaves.
- served-by-existing-state (broad) / needs-runtime for proof: RSR-007 (Army Mgmt /
  Chaos Frame), RSR-009 (scenario-map), RSR-010 (dialogue/cutscene).
- needs-runtime (standing): RSR-011 (High-Attack hooks `0x21CD48`/`0x21BF84` +
  `0x1F36F0` cleanup-guard remain unproven — they need active-battle states, empty).

Request-log changes: **opened RSR-013** (chunks 34-35 promotion/level-up/class-def
overlay+register proof; nearest broad states `core-menus\class_change` +
`army_management`; static-only this run); **marked RSR-012 satisfied**. No request was
upgraded to `satisfied`-via-runtime because the run was static-only by instruction.

## Chunk 34 — `0x00221000..0x00231000` — MIXED

- Dossier: `docs/dossiers/lib-chunk34-221000-231000.md`
- Data index: `docs/data-index/rev0/chunk34-data-region-inventory.json`
- Split JSON: `build/chunk_00221000-00231000_splits.json`

Classification: **120 parts** = 89 normal code + 1 straddler-tail + 1 straddler-head
+ 29 data.

Region/boundary facts:

- Incoming straddler-tail `func_0021EBBC_chunk34tail` `0x00221000..0x002213DC`
  (classChangeStateMachine tail; returns `jr $ra`@`0x002213D4`).
- CODE region A `0x002213DC..0x00228D6C`.
- Interior DATA island `0x00228D6C..0x0022A280` (5,396 bytes) — combat-overlay data:
  0x801D/0x801E handler/jump pointer tables, packed GBI/RDP display-list blobs, IEEE
  float/double constant pools, and ASCII message-string pools.
- CODE region B `0x0022A280..0x00230A9C` (incl. dispatcher `func_0022D14C` and
  `func_0022F580`).
- Outgoing straddler-head `func_00230A9C` `0x00230A9C..0x00231000` (continues into
  chunk 35; returns `jr $ra`@`0x002317C0`).

Data accounting: 5,396 bytes (29 files) — table 2,284 · float 1,472 · data 1,460 ·
rodata 176 · zero_fill 4. Decoded message strings include `"%s cannot be used."`,
`"%s joined the battalion."`, `"%s was not persuaded."`, `"%s became %s."`,
`"%s fled."`, `"%s has regenerated."`, plus an `"AddTimeTable:"` label and a `"NULL"`
sentinel; one packed blob also contains a `(%d)\n` fragment and a Shift-JIS debug
string. Undecoded bytes: 0 (every part classified).

Adversarial result (3 code + 2 data + 1 straddler skeptics): **6/6 clean**. Confirmed:
the incoming-tail single return; all preamble-orphans genuine read-before-write folds;
all recovered frameless leaves genuine; the data island has zero prologues / zero
`jr $ra` (no hidden code); the outgoing straddler has no `jr $ra`. One LOW nit (a data
note omitted a Shift-JIS string) — no tiling change.

## Chunk 35 — `0x00231000..0x00241000` — MIXED

- Dossier: `docs/dossiers/lib-chunk35-231000-241000.md`
- Data index: `docs/data-index/rev0/chunk35-data-region-inventory.json`
- Split JSON: `build/chunk_00231000-00241000_splits.json`

Classification: **134 parts** = 127 normal code + 1 straddler-tail + 1 straddler-head
+ 5 data.

Region/boundary facts:

- Incoming straddler-tail `func_00230A9C_chunk35tail` `0x00231000..0x002317C8`
  (returns `jr $ra`@`0x002317C0`; frame `0x160` matches the chunk-34 prologue).
- CODE region A `0x002317C8..0x00239B94`.
- Interior DATA island `0x00239B94..0x0023A3A0` (2,060 bytes) — float32 ramp pool
  (0.6→4.0), a packed parameter/record blob, and an 0x801F-band pointer/IEEE-double
  record table.
- CODE region B `0x0023A3A0..0x00240FF0` (incl. command dispatcher `func_0023C114`).
- Outgoing straddler-head `func_00240FF0` `0x00240FF0..0x00241000` (continues into
  chunk 36).

Data accounting: 2,060 bytes (5 files) — table 1,360 · data 636 · float 48 ·
zero_fill 16. Undecoded bytes: 0.

Adversarial result (3 code + 1 data + 1 region-B-leaf + 1 straddler skeptics): **5
clean + 1 HIGH fixed**. The HIGH was a slice-seam preamble-orphan at `0x00240D20`
backward-folded into `func_00240964`'s tail; the `lui $v1,0x800F / lw -0x6460($v1)`
(`*0x800F9BA0`, the RDP/GBI display-list pointer) feeds the next function (reads `$v1`
at `0x240D40`/`0x240D50` before writing). Corrected: `func_00240964` ends at
`0x240D20`; the next part is `func_00240D20` (preamble + prologue @`0x240D28`).
Re-combine + re-check PASS.

## Parent DB / Overlay Contradictions & Mistakes Corrected

- Parent DB over-merged tiny frameless leaves and missed many; recovered in both
  chunks (e.g. chunk 34 `func_002247CC` and the `0x2265xx`/`0x2258xx` clusters;
  chunk 35 `func_00234544` jump-table dispatcher, `func_0023683C`, `func_00237E18`,
  `func_00239B74`/`func_00239B84`, the tiny return-stub cluster
  `func_0023B220/0023B234/0023B23C/0023B244`, range-check `func_0023B680`).
- **Preamble-orphan name/label mismatch (assemble hazard, fixed):** the chunk-34
  slice-A6 agent named two preamble-orphans for their prologue address
  (`func_00228A90`, `func_00228B44`) while starting the part at the preamble
  (`0x228A88`/`0x228B3C`), so the synthesized header glabel collided with the body's
  parent boundary-candidate glabel. Renamed to `func_00228A88` / `func_00228B3C`.
- **Duplicate-label drops:** the chunk-34 outgoing straddler-head `func_00230A9C` and
  two chunk-35 parts (`func_00240964`, the `func_00240FF0` straddler-head) had a
  redundant header label that duplicated the body's parent boundary glabel; the header
  label was dropped (body glabel provides the symbol). 21 genuine
  frameless-leaf / preamble-orphan labels in chunk 35 were kept (no collision).
- **The run-prompt "data gap" leads at chunk-35 `0x23B210` (60 B) and `0x23B678`
  (76 B) are CODE, not data** — align nops + recovered frameless leaves, proven from
  byte-exact disassembly. The genuine data islands are the 5,396 B (chunk 34) and
  2,060 B (chunk 35) pointer/float/string regions.
- Role tags from the parent DB (`promotion consumer`, `class-def consumer`,
  `character::char-data consumer`) used only as leads; names stay `func_*`.

## Parent Workspace Evidence Sweep

Searched parent `C:\Users\Joe\Projects\OgreBattlel64` for `0x221000..0x241000` (z64 +
plausible RAM forms + accessed globals). Useful leads (validated against byte-exact
Rev 0 disassembly; applied as documentation only, NOT as names):

- `docs/promotion-system.md`, `growth-system.md`, `combat-function-notes.md`: the
  incoming straddler `func_0021EBBC` is the parent-named **classChangeStateMachine**
  (combat-overlay runtime RAM `0x801DB8EC`); `levelUpMain` is at `0x21C140` (chunk 33);
  this code runs in the **combat overlay** (runtime band `0x801D0000..0x801FFFFF`).
- `docs/overlay-system.md`: the chunk-34 `0x801x` pointer tables are combat-overlay
  handler / display-list pointer tables; `0x8022A974` ("Master Combat Struct") is
  actually an F3DEX2 display-list buffer.

Rejected / false matches:

- Linear-map decode-comment values (`0x8029xxxx`/`0x802Axxxx`/`0x802Bxxxx`) — NOT
  runtime RAM for this overlay code.
- Rev 1.1-only hook offsets `0x21CD18` / `0x21BF54` — different Rev 0 instructions.

## Patch Workbench

No new candidate hook sites were naturally encountered in chunks 34-35 (promotion /
level-up / class-change code; the High-Attack streamsplit sites live in chunk 33). The
carried chunk-33 candidates (`0x21CD48`, `0x21BF84`) and chunk-31 `0x1F36F0`
cleanup-guard are unchanged and remain `candidate`/`needs-runtime` (see RSR-011). The
only new patch-workbench artifact this run is the backfill-triage JSON. No static-only
finding was upgraded to `proven`.

## Tooling

No tracked `tools/` JS changed. New gitignored `build/` helpers: `carve_chunk.js`
(splits a full-chunk base plan into code sub-regions around an interior data island +
extracts the data-region disasm), `gen_data_index.js` (builds the data-index JSON from
the combined splits + data-final notes), and the per-chunk swarm scripts
`wf_chunk34.js`/`wf_chunk34_adv.js`/`wf_chunk35.js`/`wf_chunk35_adv.js`. The run used
the standard pipeline (`dump_function_context` → `plan_chunk`/`carve_chunk` →
`slice_chunk` → analysis swarm → `combine_chunk` → `check_boundaries`/`check_splits` →
adversarial swarm → `promote_original_mips` → `split_original_mips_part`).

## Verification

```text
node --check build/*.js (touched helpers)            OK
node tools/check_manifest.js                         ALL CHECKS PASS (chunk 34=120, chunk 35=134)
node tools/check_boundaries.js --splits build/chunk_00221000-00231000_splits.json --disasm build/original-mips/rev0/code_00221000_00231000.s   PASS (0 fragment/cross/under/leak/straddler)
node tools/check_splits.js     --splits build/chunk_00221000-00231000_splits.json --disasm build/original-mips/rev0/code_00221000_00231000.s   0 fragments
node tools/check_boundaries.js --splits build/chunk_00231000-00241000_splits.json --disasm build/original-mips/rev0/code_00231000_00241000.s   PASS (0 fragment/cross/under/leak/straddler)
node tools/check_splits.js     --splits build/chunk_00231000-00241000_splits.json --disasm build/original-mips/rev0/code_00231000_00241000.s   0 fragments (4 informational TINY return-stub leaves, each has jr$ra)
node tools/assemble_original_mips.js                 Exact code-region match: PASS (SHA 40D4E787..B409)
node tools/verify_setup.js                           PASS (36 composites / 4,313 files / 64 fallback)
node tools/audit_code_region.js                      OK (executable extent unchanged; no code edge into tail)
git diff --check                                     clean
```

JSON validity: both new `docs/data-index/rev0/chunk3{4,5}-data-region-inventory.json`
and `docs/patch-workbench/rev0/runtime-state-backfill-triage-2026-06-23.json` parse and
match the ranges documented here. No data files carry function/true-entry wording. No
root scratch artifacts are tracked.

## Files Changed

- Opening-fixes commit (`345b5e4`): `docs/REVIEW_2026-06-23_chunks32-33-source-ownership.md`,
  `docs/runtime-state-requests.md`, `docs/patch-workbench/rev0/runtime-state-backfill-triage-2026-06-23.json`.
- Chunk 34 commit (`4d33a2c`): 120 `asm/original/rev0/lib/` parts; `manifest.json`;
  `docs/dossiers/lib-chunk34-221000-231000.md`; `docs/data-index/rev0/chunk34-data-region-inventory.json`.
- Chunk 35 commit: 134 `asm/original/rev0/lib/` parts; `manifest.json`;
  `docs/dossiers/lib-chunk35-231000-241000.md`; `docs/data-index/rev0/chunk35-data-region-inventory.json`;
  current-state docs (`AGENTS.md`, `DECOMP_LOG.md`, `NEXT_STEPS.md`, `PLATFORM.md`, `WORKFLOW.md`).

## Caveats

- Source ownership and byte-exact rebuild are proven; game-behavior names remain
  conservative `func_*` unless backed by runtime/mutation evidence.
- Parent DB / editor-hook / trace labels are leads only; overlay/RAM mapping for this
  combat overlay still needs runtime proof (RSR-013).
- The interior data islands' packed blobs (chunk 34 GBI/RDP display-list data; chunk 35
  parameter/record blob) and the 0x801x/0x801F pointer tables are classified but not
  fully semantically decoded (raw-but-classified); strings, float pools, and zero-fill
  are decoded.
- `func_00240FF0` (chunk 35 outgoing straddler) is owned as one part spanning into
  chunk 36; its return is past `0x00241000`.

## Reviewer Checklist

- Confirm `asm/original/rev0/manifest.json` has contiguous parts for `0x00221000`
  (120) and `0x00231000` (134).
- Spot-check the data classifications against the two data-index JSONs (chunk-34
  combat-overlay pointer tables + message strings; chunk-35 float ramp + 0x801F record
  table).
- Review the chunk-35 `0x240D20` preamble-orphan fix and the chunk-34 preamble-orphan
  renames (`func_00228A88`/`func_00228B3C`).
- Re-run the verification commands above if touching source ownership.
- Resume at `0x00241000` (chunk 36) with `func_00240FF0_chunk36tail`; confirm the
  straddler's return in chunk 36 before splitting the remainder.
