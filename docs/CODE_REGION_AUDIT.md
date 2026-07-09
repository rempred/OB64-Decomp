# Rev 0 Code-Region Audit

`tools/audit_code_region.js` is a read-only audit of the configured Rev 0 code
region. The configured region `0x00001000..0x0063676C`
(`config/roms/us_rev0.json` `codeRegion`) is the assembly/tiling region. Until
2026-07-09 it was emitted in full as byte-exact `.word` `original_mips` source;
the reclassification (CLOSURE section at the end) now splits it into the pinned
executable extent (`original_mips`) and the `owned_data_parts` data tail. This audit produces repeatable evidence for where
executable MIPS actually lives versus where the configured region holds non-code
data emitted as instructions.

Run:

```powershell
node tools/audit_code_region.js
```

Generated reports (ignored):

- `build/coverage/rev0-code-region-audit.json`
- `build/coverage/rev0-code-region-audit.md`

The audit is read-only: it changes nothing in the rebuild path, so the
byte-exact rebuild and `node tools/verify_setup.js` gate are unaffected.

Parent JSON inputs (`scripts/ob64_functions.json`,
`ram_snapshots/overlay_sources.json`) are **required by default**: a missing or
corrupt parent file is a hard error, so the tool is safe to wire into a gate.
Pass `--allow-missing-parent-db` to downgrade a *missing* parent file to
intrinsic-only mode (a corrupt/unreadable file always fails loudly).

## Headline Finding (2026-06-21)

The configured code region is conservative. Executable code occupies only the
first ~44% of it:

| Region | Range (z64) | Bytes | Verdict |
|---|---|---:|---|
| Executable extent | `0x00001000..0x002B89B4` | 2,849,204 | code-evidenced |
| Suspected non-code tail | `0x002B89B4..0x0063676C` | 3,661,240 (56.24%) | data-evidenced |

Evidence:

- **Executable extent** `0x00001000..0x002B89B4`: 96.75% common-opcode words,
  5,065 `jr $ra` returns (1.82/KB), and all 13 parent overlay anchors
  (`ram_snapshots/overlay_sources.json`) contained inside it. It still holds
  545,844 bytes (19.16%) of interleaved gap/rodata between detected functions
  (alignment, embedded tables, indirect-only leaves), so "executable extent"
  means code-bearing, not 100% code.
- **Suspected non-code tail** `0x002B89B4..0x0063676C`: **zero `jr $ra` across
  915,310 words**, ~52–64% opcode-word density (≈ chance for random/data),
  ~35% ASCII byte density, near-zero RAM-pointer density. Real MIPS cannot span
  3.66 MB with no function return, so this region is non-code data currently
  emitted as `.word` `original_mips`.
- The last valid parent-detected function ends at `0x002B89B4`; no valid
  function starts beyond it. The parent function DB contains a single
  `valid:false` false-positive reaching `0x00598A9C` inside this tail; it is
  excluded from the executable extent (and explains why the raw max `end_rom` of
  the DB exceeds the valid boundary).

This is consistent with the parent function scan masking 32 data ranges inside
the code region and with the 9 `-lz*-`/`-lh*-` rejected "method-like" string hits
at `0x0003E460` (embedded LHA method-name rodata inside the executable extent).

## Control-Flow Edge Audit (2026-06-21)

Density alone does not prove the tail is unreachable, so the audit scans every
instruction word inside the valid detected functions of the executable extent for
direct control-flow targets that land in the tail `0x002B89B4..0x0063676C`:

- **PC-relative branch targets into tail: 0.** Branch targets are position-
  independent in ROM space (overlay-immune), so this is the authoritative signal:
  no real branch edge enters the tail.
- **J/JAL targets into tail (linear mapping): 7, none credible.** J/JAL are
  region-absolute and resolved here under the linear `RAM = ROM + 0x8006FC00`
  mapping, which is unreliable for overlay-relocated code. All 7 hits come from a
  single source (`0x001A42A4`), have `targetKnownFn=false` (they do not resolve
  to any known function start), and point into the zero-`jr $ra` tail — so they
  are not real calls. They are bytes of a **data table embedded inside that
  function** (a ramp table near `0x1A4560`: `0F0F0F0F`, `0C0D0E0F`, …) that
  happen to decode as `jal`. This is also why "code-like source" is not a
  sufficient filter — a real function can embed data; the robust credibility test
  is whether the *target* resolves to a known function.
- **Verdict: `no-credible-code-edge-into-tail`** (0 branch edges, 0 J/JAL edges to
  a known function).

J/JAL static resolution through overlays is inherently not authoritative, so this
is strong evidence, not absolute proof — it removes the "code edge into the tail"
risk for the reliable (branch) signal and shows the J/JAL hits are explainable
false positives. The exact boundary must still be pinned before reclassifying.

## Method

- **Detected-function coverage**: union of valid parent function
  `[start_rom,end_rom)` intervals (`scripts/ob64_functions.json`) inside the
  configured code region.
- **Intrinsic evidence per 256 KiB window**: `jr $ra` (`0x03E00008`) density,
  common-opcode density, RAM-pointer-word density (`0x80000000..0x80800000`),
  zero-word density, and ASCII byte density.
- **Verdict**: `code-evidenced` if a window has any detected coverage or
  >= 0.25 `jr $ra`/KB; `data-evidenced` if it has zero `jr $ra`, zero detected
  coverage, and < 75% opcode words; otherwise `unproven`. Thresholds are
  conservative; the verdict is evidence, not proof.

The window table that demonstrates the clean transition at `0x002B89B4` is in the
generated `build/coverage/rev0-code-region-audit.md`.

## Why this is not yet reclassified

Per the repo no-gap and evidence rules, an ambiguous region is preserved
byte-exactly and classified explicitly with repeatable scanner evidence before
being promoted as code or data. This audit is that evidence step. The tail
remained byte-exact `original_mips` until the 2026-07-09 reclassification;
reclassification is a separate, gated step.

## Next Step

The control-flow prerequisite is satisfied (no credible code edge enters the
tail). Remaining before reclassification:

1. Refine the exact code/data boundary near `0x002B89B4` with a finer-grained
   scan (look for the first/last `jr $ra`, alignment padding, and any structural
   marker just past the last detected function). The boundary byte is still
   unproven.
2. Reclassify `0x002B89B4..0x0063676C` from `code`/`original_mips` to a data
   source form across `config/segments/rev0.yaml`, the coverage ledger, and the
   full-ROM source manifest, keeping the byte-exact rebuild and `verify_setup`
   gate green. The original-MIPS extraction/assembly range would then shrink to
   the executable extent and the tail would become a tracked/generated data
   owner.
3. Once the boundary is final, wire `audit_code_region.js` into a coverage gate
   so the executable extent and "no code outside it" stay enforced.

---

## CLOSURE — boundary pinned + reclassification executed (2026-07-09)

The track this document opened is complete:

1. **Boundary PINNED at `0x002B89B8`** (exclusive): the last executable
   instruction is `jr $ra` @`0x2B89B0` with its delay slot @`0x2B89B4` — the
   end of `func_002B88C8` (chunk 43); the next tracked part is
   `zero_fill_002B89B8`. The audit's jr-ra extent (`0x2B89B4`) plus the final
   return's 4-byte delay slot equals the pin. Recorded in
   `config/roms/us_rev0.json` `executableExtent`.
2. **Reclassification executed:** the coverage ledger splits the old code
   span into `code` (`0x1000..0x2B89B8`) and `code_region_data_tail`
   (`0x2B89B8..0x63676C`); the full-ROM source manifest maps the tail to the
   new source form `owned_data_parts` (data, assembled-blob-backed — the
   same tracked `.word` parts remain the byte owners; `codeRegion` in config
   is now explicitly the assembly/tiling region). Manifest: 1,060 entries;
   `original_mips` = 2,849,208 bytes; `owned_data_parts` = 3,661,236 bytes.
   `rebuild_rom --assembled-code` now slices the blob across the split
   segments and asserts full code-region coverage. Tracked non-code owners
   are matched by ROM range (indexes shift when spans split).
3. **Gate wired:** `verify_setup.js` (19 checks) runs this audit every time
   and asserts `executableExtentPinned` + `codeDataSplitHonest`.

Both SHA256 gates unchanged throughout: code
`40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`, ROM
`571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
