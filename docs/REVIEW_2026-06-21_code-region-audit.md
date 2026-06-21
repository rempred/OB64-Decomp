# Review Handoff: Rev 0 Code-Region Extent Audit (2026-06-21)

For the decomp agent to review. This session opened the **full-ROM coverage
track** with one committed step (`cba620f`). It is a parallel track to the boot
function-split work; the split track was **not** advanced (see §4). Everything
here is static/offline; no emulator was run.

## TL;DR

- The configured code region `0x00001000..0x0063676C` is conservative. **Only
  `0x00001000..0x002B89B4` is executable; the trailing 3,661,240 bytes (56.24%)
  are non-code data currently emitted as `.word` `original_mips`.** Hard signal:
  zero `jr $ra` in 915,310 words across that tail.
- Added one read-only tool, `tools/audit_code_region.js`, plus docs. **No
  existing tool, config, `asm/`, or `src/` file was changed.** Rebuild gate stays
  green with identical hashes.
- Did **not** progress MIPS split/naming. The boot split is byte-for-byte where
  it was: still queued at `0xB030`.

## 1. Repo Report (state at handoff)

- Branch `main`, clean tree at `cba620f` (this session) on top of `9652795`.
- Phase: still early. **Two active tracks now:** (a) boot function-split/naming
  (unchanged this session), (b) full-ROM code/data coverage (opened this
  session).
- `node tools/verify_setup.js`: **PASS** (re-run after the change).
  - Whole-ROM coverage: 1,059 spans, 825 LHA archives, **0 unknown bytes**,
    41,943,040 / 41,943,040 bytes.
  - Code SHA256 `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`
    (unchanged).
  - ROM SHA256 `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`
    (unchanged).
- Source mix: 1 tracked composite real-asm chunk (`0x1000..0x11000`) = 102
  tracked source files; 99 generated fallback chunks. 3 tracked non-code owners
  (44,029 bytes) + 1,055 generated fallback owners.
- The full-ROM source manifest is byte-complete and correctly splits code vs
  non-code **at region granularity**; the gap this session found is code-vs-data
  *within* the code region (below).

## 2. Issues Discovered

1. **The configured code region over-claims code by ~3.66 MB (primary finding).**
   `config/roms/us_rev0.json` / `config/segments/rev0.yaml` define
   `code = 0x1000..0x63676C` (the segment scaffold explicitly says it "starts
   conservative"). Evidence shows executable MIPS ends at `0x2B89B4`:

   | Region | Range (z64) | Bytes | Verdict |
   |---|---|---:|---|
   | Executable extent | `0x1000..0x2B89B4` | 2,849,204 | code-evidenced |
   | Non-code tail | `0x2B89B4..0x63676C` | 3,661,240 (56.24%) | data-evidenced |

   - Executable extent: 96.75% opcode words, **5,065 `jr $ra`** (1.82/KB), all 13
     parent overlay anchors contained inside it.
   - Non-code tail: **0 `jr $ra` across 915,310 words**, ~52–64% opcode-word
     density (≈ chance), ~35% ASCII, near-zero RAM-pointer density. 3.66 MB of
     real MIPS cannot exist with no function return → this is data emitted as
     code.

   Consequence: `build_full_source_manifest.js` currently counts all 6,510,444
   code-region bytes as `original_mips`, so ~3.66 MB of data is labeled code (the
   manifest already caveats "does not prove every word is executable"; this
   quantifies it).

2. **Parent function DB max `end_rom` is misleading.** `scripts/ob64_functions.json`
   `meta` lists `function_count: 3683` and a raw max `end_rom` of `0x598A9C`, but
   that single entry is `valid:false` (a scanner false positive sitting inside
   the data tail). The valid boundary is `0x2B89B4`. A recon agent reading the
   raw JSON reported `0x598A9C`; the audit tool filters `valid !== false` and
   surfaces the false positive explicitly so this does not bite again.

3. **Embedded data inside the executable extent is real but not isolated.**
   `meta.data_ranges_masked: 32` (locations not enumerated in the DB), plus
   545,844 bytes (19.16%) of inter-function gap/rodata inside `0x1000..0x2B89B4`,
   plus the 9 `-lz*-`/`-lh*-` rejected "method-like" strings at `0x3E460`
   (LHA method-name rodata). So even the executable extent is code-bearing, not
   100% code. Lower priority than issue 1.

4. **Promoting large non-code owners as literal `.srcbin` would be a bulk
   commit.** Tracked owners are literal byte files. The repo's stated "promote
   next non-code owner batch" step is cleanest for tiny regions; the trailing
   `padding_ff` (664,256 bytes of `0xFF`) and the big audio/LZSS regions would
   need a compact descriptor (fill/run-length) owner format before they should be
   tracked. Flagged for a future tooling decision; not actioned this session.

5. **Stale doc text:** `build_full_source_manifest.js`'s `nextRecommendedTarget`
   string ("teach the rebuild path to consume the full source manifest…") is
   already done (`rebuild_from_source_manifest.js` is in the gate). Cosmetic; not
   changed.

## 3. Tooling Changed

- **Added (new):** `tools/audit_code_region.js` — read-only. Unions valid parent
  function `[start_rom,end_rom)` intervals with an intrinsic per-256 KiB scan
  (`jr $ra` density, common-opcode density, RAM-pointer density, zero density,
  ASCII density) and reports the executable extent vs the suspected non-code
  tail with conservative `code-evidenced` / `data-evidenced` / `unproven`
  verdicts. Writes only gitignored `build/coverage/rev0-code-region-audit.json`
  and `.md`. Graceful if the parent function DB is absent (intrinsic scan only).
  Run: `node tools/audit_code_region.js`.
- **Modified existing tools:** none. `build_full_source_manifest.js`,
  `extract_original_mips.js`, `assemble_original_mips.js`, the rebuild tools, the
  promote/extract owner tools, and `verify_setup.js` are untouched. The new tool
  is **not** wired into `verify_setup` yet (deliberate — avoids changing gate
  behavior before the boundary is pinned).
- **Config/asm/src:** untouched. The rebuild path and byte-exact gate are
  unchanged.
- **Docs:** added `docs/CODE_REGION_AUDIT.md` (curated evidence + method + next
  steps); updated `AGENTS.md` (new "Code Region Extent" invariant),
  `docs/DECOMP_LOG.md` (dated entry + invariant + dual-track frontier),
  `docs/NEXT_STEPS.md` (new coverage track), `docs/PLATFORM.md` (tool role +
  structural snapshot). Also appended a finding entry to the **parent**
  `../AGENTS.md` (untracked, so outside the commit).

## 4. MIPS Split / Naming Progress

**None this session.** The boot original-MIPS split/naming track is exactly where
it was:

- Last named function: `boot_resource_loader_callback_register.s`
  (`0xAFAC..0xB030`); current remainder `asm/original/rev0/code_0000B030_00011000.s`.
- Next split target (unchanged): the parent-labeled resource-loader helper at
  `0xB030..0xB0B0` (frame `0x20`, RAM `0x8007AC30`; calls RAM `0x800936E0`, LZSS
  `0x8007A110`, RAM `0x80093810`, unresolved RAM `0x80093540`).
- 102 tracked `.s` files / 79 dossiers, unchanged.

This session intentionally worked the coverage track instead, because the audit
showed a structural question (is the back half of the "code region" even code?)
that should be answered before more of that region is promoted/named.

## 5. What Was Committed + Verification

- Commit `cba620f` "Add Rev 0 code-region extent audit (executable extent vs
  data tail)" — 6 files, +630 lines: `tools/audit_code_region.js`,
  `docs/CODE_REGION_AUDIT.md` (new); `AGENTS.md`, `docs/DECOMP_LOG.md`,
  `docs/NEXT_STEPS.md`, `docs/PLATFORM.md` (edited). No `build/`/`dist/`/`scratch/`
  leakage.
- Verification: `node tools/audit_code_region.js` runs clean; `node
  tools/verify_setup.js` PASS before and after with identical code/ROM SHA256.
- (This review doc is a separate follow-up commit.)

## 6. Recommended Next Steps

Coverage track (priority):

1. **Pin the exact code/data boundary near `0x2B89B4`** with a finer scan (first
   data byte after the last `jr $ra`, alignment padding, any structural marker).
   Treat the boundary byte as unproven until pinned.
2. **Reclassify `0x2B89B4..0x63676C` from code to a data source form** across
   `config/segments/rev0.yaml` + the coverage ledger + the full-ROM source
   manifest. The original-MIPS extract/assemble range shrinks to the executable
   extent; the tail becomes a data owner. **ROM SHA256 must stay
   `571E8339…CC67A`.** This is the larger, gated change — do it as its own step.
3. Once the boundary is final, wire `audit_code_region.js` into a coverage gate
   so "no proven code outside the executable extent" stays enforced.

Split track (independent): continue at `0xB030` as already queued.

## 7. Caveats / Things to Double-Check

- Verdicts are **evidence, not proof.** The `jr $ra == 0` signal over 3.66 MB is
  very strong, but confirm the boundary and spot-check a few tail windows before
  reclassifying.
- The tail is data of unknown kind (compressed/text/tables); it is **not** decoded
  here, only shown to be non-executable. Classifying it as `code` is wrong;
  classifying it as a *specific* data format still needs evidence.
- Nothing was reclassified or promoted this session — the region remains
  byte-exact `original_mips` and rebuilds identically. The change is evidence +
  docs only.
- The parent `../AGENTS.md` edit is not under version control (parent is not a
  git repo); mirror it into parent `docs/rom-layout.md` if you want it tracked.
