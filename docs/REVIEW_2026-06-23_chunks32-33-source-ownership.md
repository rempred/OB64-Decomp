# Review Handoff: Rev 0 Chunks 32-33 Source Ownership

Date: 2026-06-23

Range covered: `0x00201000..0x00221000`

Final frontier: `0x00221000`

Commits in this run:

- `618616b` — `Fix stale current-state wording before chunks 32-33 run` (opening fixes)
- `ee4ac50` — `Add end-of-prompt marker to chunk run-prompt template` (incidental working-tree edit, committed separately)
- `1c8521d` — `Sync coordinator template + runtime-state-catalog doc edits` (incidental external doc edits, committed separately)
- `212aa5d` — `Source-own Rev0 chunk 32`
- `82260e0` — `Source-own Rev0 chunk 33`
- `Add chunks 32-33 review handoff` — this document (final commit of the run)

## Outcome

Chunks 32 and 33 are source-owned as tracked code/data parts. No byte in either
chunk remains only in generated fallback ownership. Both chunks rebuild
byte-exactly.

Current source mix (from `verify_setup` / `assemble_original_mips`):

- 34 tracked real-assembler composite chunks.
- 4,059 tracked original-MIPS source files (177 `boot/` + 3,882 `lib/`).
- 66 generated fallback chunks.
- Source-owned bytes: 2,228,224 (`0x00001000..0x00221000`) = **78.2051%** of the
  evidenced executable MIPS extent (`0x00001000..0x002B89B4`, 2,849,204 bytes).
- Code-only classified bytes: 1,854,108 = **65.0747%** of that extent.
- Cumulative data bytes (chunks 0–33): 374,116 (chunk 32 added 0; chunk 33 added 7,676).

Code-region SHA256
`40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409` (unchanged);
full ROM SHA256
`571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

Next run starts at `0x00221000` (chunk 34) by emitting `func_0021EBBC_chunk34tail`.
`func_0021EBBC` begins in chunk 33 at `0x0021EBBC` (jump-table state machine,
prologue `addiu $sp,-0x2E8`, no preamble), has no `jr $ra` before the chunk
boundary, and continues into chunk 34 (returns `jr $ra`@`0x002213D4`, frame size
0x2E8 matches).

## Opening Fixes

The three concrete review/doc issues were fixed (commit `618616b`):

- `docs/REVIEW_2026-06-23_chunks30-31-source-ownership.md`: the final-commit line
  now cites the real review-handoff hash `f959be2` (was a placeholder-style line).
- `AGENTS.md`: the stale Setup-Complete-Gate current-state paragraph (30 chunks /
  3,544 files / 70 fallback / chunks 0-29 / next chunk 30) was advanced to the
  current state and then to chunks 0-32 during this run.
- `docs/DECOMP_LOG.md`: the stale `## Next Frontier` section (chunks 0-29 / chunk
  30) was rewritten to the current frontier.

Recurring-hygiene confirmations held: no root scratch artifacts (only
`.gitattributes/.gitignore/AGENTS.md/README.md`); no `True entry` /
`read-before-write preamble` / function-boundary wording in DATA files (the only
match was `float_ldexp_d.s`, a libc CODE function whose `float_` is a descriptive
name, not a data prefix); chunk 30 data-index + chunks30-31 patch-workbench JSON
parse; `check_manifest` passes.

## Chunk 32

Range: `0x00201000..0x00211000` — **ALL CODE** (frameless-leaf-dense; both-end
function straddlers).

- Dossier: `docs/dossiers/lib-chunk32-201000-211000.md`
- Split JSON: `build/chunk_00201000-00211000_splits.json`
- No data index (all code).

Classification: **198 parts** = 196 normal code + 2 function straddlers + 0 data.

- Incoming straddler-tail `func_002006E8_chunk32tail` `0x00201000..0x00201108`
  (returns `jr $ra`@`0x00201100`; matches the parent end lead 0x201108).
- Outgoing straddler-head `func_00210C30` `0x00210C30..0x00211000` (prologue
  `addiu $sp,-0xD8`, no preamble; continues into chunk 33, returns
  `jr $ra`@`0x00211020`).
- The parent DB heavily over-merged tiny frameless leaf accessors and missed two
  large parent-gap frameless functions; all recovered (~50+ leaves). Preamble-orphan
  `func_00201108`; jr$v0/jalr$v0 dispatchers internal.

Adversarial result (6 code skeptics): 5 clean, 1 high — `func_0020156C` was
over-extended to `0x201598` with a fabricated return note; corrected to end at its
real `jr $ra` (`0x20157C` → `0x201584`) and split off the frameless leaf
`func_00201584`. Two preamble-orphan boundary corrections (`func_002091F4`,
`func_0020934C` re-anchored to their true preamble entry) were applied before the
adversarial pass.

## Chunk 33

Range: `0x00211000..0x00221000` — **MIXED** (code → interior font/glyph + table
DATA region → code → outgoing state-machine straddler).

- Dossier: `docs/dossiers/lib-chunk33-211000-221000.md`
- Data index: `docs/data-index/rev0/chunk33-data-region-inventory.json`
- Split JSON: `build/chunk_00211000-00221000_splits.json`

Classification: **109 parts** = 82 normal code + 25 data + 2 function straddlers.

Region/boundary facts:

- Incoming straddler-tail `func_00210C30_chunk33tail` `0x00211000..0x00211028`
  (returns `jr $ra`@`0x00211020`).
- CODE R1 `0x00211028..0x00211D14`.
- Interior DATA territory `0x00211D14..0x00213B10` (7,676 bytes) — font/glyph asset
  block + 0x801A/0x801B/0x801C pointer-jump tables + float64/float32 pools.
- CODE R2 `0x00213B10..0x0021EBBC` — FP/display-list + battle code; includes the
  two High-Attack hook functions.
- Outgoing straddler-head `func_0021EBBC` `0x0021EBBC..0x00221000` — a ~21 KB
  return-less jump-table state machine; continues into chunk 34 (returns
  `jr $ra`@`0x002213D4`).

Data accounting (the data-dominant span of this run):

- Data bytes source-owned: **7,676** (25 files).
- Parsed bytes: **876** (zero-fill, rodata strings, float pools).
- Raw-but-classified bytes: **6,800** (glyph remap map, 16-bit remap LUT [1456
  u16], packed graphics blob, the three 0x801x pointer tables).
- Undecoded bytes: **0**.
- Index files added: 1 JSON (with decoded message strings + the glyph/charset
  remap map + pointer-table and float-pool inventory).
- Known format families: NUL-delimited ASCII rodata; glyph/charset codepoint remap
  map; per-glyph width table; dense 16-bit remap LUT; packed graphics blob;
  RAM-pointer/jump tables (0x801A/0x801B/0x801C overlay band); IEEE float64/float32
  constant + record pools; zero-fill.
- Exact data frontier inside chunk 33: none — all chunk-33 data bytes are owned and
  indexed.

Adversarial result (4 code + 2 data + 1 straddler skeptics): 6 clean, 1 high — a
slice-seam preamble-orphan at the A2/A3 boundary (`func_0021181C`: the
`0x21181C` preamble was dead-tailing `func_002114F4`; merged forward). Three more
slice-seam preamble-orphans (`func_00217BA8`, `func_00219A14`, `func_0021CBC4`)
were caught at combine time (agents had mislabeled them as straddler-heads) and
merged forward. LOW data-note corrections applied (glyph remap vs ASCII ramp;
LUT u16 count; float-pool contents). Both data verifiers confirmed 0 prologues/0
returns across the data territory; the straddler verifier confirmed no `jr $ra`
in `func_0021EBBC`.

## Parent DB / Overlay Contradictions & Mistakes Corrected

- The parent functions DB over-merged functions and missed many frameless leaves
  in both chunks (chunk 32 especially); all corrected from byte-exact disassembly.
- **Slice-seam preamble-orphan hazard** (carried-forward lesson): prologue-seeded
  slices put a function's read-before-write preamble (e.g. `lui 0x801D / lw -0x174x`)
  at the END of the previous slice; agents variously left them as dead tails or
  mislabeled them as straddler-heads. Reconciled four of them in chunk 33
  (`func_0021181C/00217BA8/00219A14/0021CBC4`) and two in chunk 32
  (`func_002091F4/0020934C`).
- **Duplicate-label hazard**: parts named for a parent-detected prologue (or whose
  body already carries the `function boundary candidate` glabel) had their header
  `label` dropped so each symbol is defined exactly once (4 in chunk 32, 1 in chunk
  33).
- Role tags from `ob64_symbols_v2.json` used only as leads; names stay `func_*`.

## Parent Workspace Evidence Sweep

Searched parent `C:\Users\Joe\Projects\OgreBattlel64`. Useful matches:

- `tools/build_high_attack_stream_shift_rom.py` + `docs/combat-attack-buffer.md` +
  `scripts/ob64_patch_hook_audit.js`: the two Rev 0 High-Attack streamsplit hook
  sites — primary insert hook z64 `0x0021CD48` (in `func_0021CBC4`) and slot0
  zero-return/source hook z64 `0x0021BF84` (in `func_0021B894`) — both in chunk 33;
  harvested as patch-workbench candidates (below).
- `scripts/ob64_functions.json` / `ob64_symbols_v2.json`: parent boundary/role
  seeds, reconciled against byte-exact disassembly.

Rejected / false matches:

- Rev 1.1 near-equivalent hook offsets `0x0021CD18` / `0x0021BF54` — Rev 0
  byte-exact disassembly shows different instructions there (`bne`, `ori/sb`); they
  are Rev 1.1-specific and rejected for Rev 0.
- `0x8025/0x8026/0x8028/0x8029` linear-map decode-comment values — not overlay
  back-maps.

## Patch Workbench

Two candidates naturally encountered (chunk 33), recorded static-only in
`docs/patch-workbench/rev0/patch-workbench-chunks32-33-2026-06-23.json`:

- **High-Attack primary insert hook** — z64 `0x0021CD48` in `func_0021CBC4`.
  Original words `lui $v0,0x801D` / `lw $v0,-0x1740($v0)` (global fetch after a
  x3 scale-accumulate into `$s3`); displaces the lui/lw pair; resume `0x21CD50`;
  hazard: the displaced `lw` defines `$v0` read at `0x21CD54`. Status
  **candidate / needs-runtime**.
- **High-Attack slot0 zero-return/source hook** — z64 `0x0021BF84` in
  `func_0021B894`. Original word `beq $s3,$zero` + delay `move $v0,$s3`; a
  PC-relative branch guard; hazards: delay slot must be preserved, branch target
  relocation-sensitive. Status **candidate / needs-runtime**.

Chunk 32 yielded no patch-workbench metadata. The chunk 30-31 artifact (0x1F36F0
cleanup-guard) and the backfill baseline are unchanged. No static-only finding was
upgraded to `proven`.

Carried-forward unresolved runtime requests (unchanged): High Attack Rev 0
moved-lane gates, the 0x1F36F0 cleanup owner-free guard proof, raw squad-capacity
placement safety, Chaos Frame sub-screen regression, scenario-main hook timing,
overlay mapping/register proof.

## Tooling

No tracked `tools/` JS was changed. The run used the existing pipeline
(`dump_function_context` → `plan_chunk`/`scan_functions`/`slice_chunk` → analysis
swarm → `build/combine_chunk.js` → `check_boundaries`/`check_splits` → adversarial
swarm → `promote_original_mips` → `split_original_mips_part`). A read-only scout
agent mapped chunk 33's data region, the return-less tail straddler, and the hook
sites. Reusable swarm/helper scripts live under gitignored `build/`
(`wf_chunk32*.js`, `wf_chunk33*.js`, `scan_chunk.js`, `region_scan.js`,
`blockmap.js`, `win.js`, `decode_strpool.js`, `validate_finals.js`,
`chunk33_scout_report.md`).

## Verification

```text
node tools/check_manifest.js                         ALL CHECKS PASS (chunk 32=198, chunk 33=109)
node tools/check_boundaries.js --splits build/chunk_00201000-00211000_splits.json --disasm build/original-mips/rev0/code_00201000_00211000.s   PASS (0 fragment/cross/under/leak/straddler)
node tools/check_splits.js     --splits build/chunk_00201000-00211000_splits.json --disasm build/original-mips/rev0/code_00201000_00211000.s   0 fragments
node tools/check_boundaries.js --splits build/chunk_00211000-00221000_splits.json --disasm build/original-mips/rev0/code_00211000_00221000.s   PASS (0 fragment/cross/under/leak/straddler)
node tools/check_splits.js     --splits build/chunk_00211000-00221000_splits.json --disasm build/original-mips/rev0/code_00211000_00221000.s   0 fragments
node tools/assemble_original_mips.js                 Exact code-region match: PASS (SHA 40D4E787..B409)
node tools/verify_setup.js                           PASS
node tools/audit_code_region.js                      OK (executable extent 0x1000..0x2B89B4 unchanged; no code edge into tail)
git diff --check                                     clean
```

JSON validity: `docs/data-index/rev0/chunk33-data-region-inventory.json` and
`docs/patch-workbench/rev0/patch-workbench-chunks32-33-2026-06-23.json` both parse
as valid JSON and match the ranges documented here. No data files carry
function/true-entry wording. No root scratch artifacts are tracked.

## Files Changed

Opening-fixes commit (`618616b`): `AGENTS.md`, `docs/DECOMP_LOG.md`,
`docs/REVIEW_2026-06-23_chunks30-31-source-ownership.md`.

Chunk 32 commit (`212aa5d`): 198 `asm/original/rev0/lib/` parts;
`asm/original/rev0/manifest.json`; `docs/dossiers/lib-chunk32-201000-211000.md`;
current-state docs (`AGENTS.md`, `DECOMP_LOG.md`, `NEXT_STEPS.md`, `PLATFORM.md`,
`WORKFLOW.md`).

Chunk 33 commit: 109 `asm/original/rev0/lib/` parts;
`asm/original/rev0/manifest.json`; `docs/dossiers/lib-chunk33-211000-221000.md`;
`docs/data-index/rev0/chunk33-data-region-inventory.json`;
`docs/patch-workbench/rev0/patch-workbench-chunks32-33-2026-06-23.json`;
current-state docs advanced to chunks 0-33 final counts/frontier.

## Caveats

- Source ownership and byte-exact rebuild are proven; game-behavior names remain
  conservative `func_*` unless backed by runtime/mutation evidence.
- Parent DB, editor hook, trace, and patch labels are leads only; overlay/RAM
  mapping claims still need runtime proof.
- Chunk 33's glyph remap map, 16-bit LUT, packed graphics blob, and the three
  0x801x pointer tables are source-owned and classified but not fully semantically
  decoded (raw-but-classified); the strings, float pools, and zero-fill are decoded.
- The two High-Attack hook sites are static-only candidates; not proven.
- Chunk 33's outgoing straddler `func_0021EBBC` is a large return-less jump-table
  state machine whose internal case entries dispatch via relocated runtime tables
  (not statically resolvable); it is owned as one part spanning into chunk 34.

## Reviewer Checklist

- Confirm `asm/original/rev0/manifest.json` has contiguous parts for `0x00201000`
  (198) and `0x00211000` (109).
- Spot-check chunk-33 data classifications against
  `docs/data-index/rev0/chunk33-data-region-inventory.json` (font/glyph block,
  three 0x801x pointer tables, float pools).
- Review the adversarial frameless-leaf split (chunk 32 `func_00201584`) and the
  slice-seam preamble-orphan merges (chunk 32 `func_002091F4`/`func_0020934C`;
  chunk 33 `func_0021181C`/`func_00217BA8`/`func_00219A14`/`func_0021CBC4`).
- Review the patch-workbench candidates at `0x21CD48` (func_0021CBC4) and
  `0x21BF84` (func_0021B894); both static-only / needs-runtime.
- Re-run the verification commands above if touching source ownership.
- Resume at `0x00221000` (chunk 34) with `func_0021EBBC_chunk34tail`; confirm the
  straddler's return (`0x002213D4`) before splitting the remainder.
