# Review Follow-up Handoff: Control-Flow Edge Audit (2026-06-21)

For the decomp agent to review. This is the second step on the full-ROM coverage
track: it addresses the review feedback on the code-region extent audit. One
committed step (`af794d1`), static/offline only, no emulator.

## TL;DR

- All four review items are done. The control-flow prerequisite for
  reclassification is satisfied: **no credible code edge enters the data tail**
  (0 PC-relative branch targets, 0 J/JAL resolving to a known function).
- New tooling: `tools/audit_code_region.js` gained a static control-flow edge
  audit and strict (gate-safe) parent-input handling. No other tool/config/asm/src
  changed; rebuild gate green, hashes unchanged.
- MIPS function split/naming was **not** advanced (still queued at `0xB030`).
  Decomp *analysis* did advance: the audit proves the tail has no incoming code
  edges and pinned a concrete embedded-data finding inside function `0x1A42A4`.

## 1. Task Completed (review items)

The review found the prior audit useful, reproducible, and not rebuild-breaking,
and required four follow-ups before any code-region reclassification:

1. **Static control-flow target audit — DONE.** Before shrinking `codeRegion`,
   scan the executable extent for direct branch/J/JAL targets landing in the
   proposed data tail `0x002B89B4..0x0063676C`. Result:
   - PC-relative branch targets into tail: **0** (overlay-immune, authoritative).
   - J/JAL into tail (linear): **7, none credible** — all from function
     `0x001A42A4`, all `targetKnownFn=false`, targeting non-functions in the
     zero-`jr $ra` tail. They are a data ramp table embedded in that function
     decoding as `jal`.
   - Verdict: **`no-credible-code-edge-into-tail`**.
2. **Harden missing-input behavior — DONE.** Parent JSON is now required by
   default (missing or corrupt = hard error); `--allow-missing-parent-db`
   downgrades a *missing* file to intrinsic-only mode (corrupt always fails loud).
   Replaces the old silent `loadOptionalJson`.
3. **Keep audit as evidence, not final proof — DONE.** No config/segment/
   source-manifest change. The tail stays byte-exact `original_mips`. Nothing was
   reclassified. Docs state J/JAL-through-overlays is not authoritative and the
   exact boundary is still unpinned.
4. **Mirror finding into parent `docs/rom-layout.md` — DONE.** A dated note
   corrects the "MIPS Code Region" table row (executable extent ends ~`0x2B89B4`;
   back 56% is data, not "~46 KB embedded tables"). Outside the git repo, so not
   in the commit.

## 2. New / Changed Tooling

Only `tools/audit_code_region.js` changed (and docs). No new tool file; no change
to any other tool, `config/`, `asm/`, or `src/`.

- **Control-flow edge audit (`controlFlowAudit`).** Scans every instruction word
  inside the valid detected functions of the executable extent. Branch targets
  (opcodes 1,4,5,6,7,0x14–0x17) are PC-relative and resolved exactly in ROM space
  (overlay-immune). J/JAL (opcodes 2,3) are resolved under the linear
  `RAM = ROM + 0x8006FC00` mapping and flagged unreliable for overlay-relocated
  code. Each J/JAL-into-tail hit carries `targetKnownFn` (does the target resolve
  to a known valid function start) and `srcCodeLike` (does the source function
  have any `jr $ra`). New report block `controlFlowAudit` + a "Control-Flow Edge
  Audit" section in the generated markdown.
- **Credibility gating.** The verdict is gated on **target-resolves-to-a-known-
  function**, not on source-code-likeness. This was a deliberate correction: a
  real function can embed a data table (exactly the `0x1A42A4` case), so
  "code-like source" over-reports; "target is a known function" is overlay-robust
  and does not false-alarm on embedded data.
- **Strict parent-input loader (`loadParentJson`).** Missing → hard error unless
  `--allow-missing-parent-db`; corrupt/unreadable → always hard error. Reports
  per-input load status. Makes the tool safe to wire into a gate later.
- **Extra signal.** Reports `returnlessFunctions` (detected "functions" with zero
  `jr $ra` = pure data mis-detected as functions) and surfaces the single
  `valid:false` parent false positive (`end_rom 0x598A9C`) inside the tail.

How it was validated: `node --check`, a `${}`-aware lexer pass, the three review
commands (below), and manual inspection of the 7 J/JAL hits (all trace to the
`0x1A42A4` ramp table: `0F0F0F0F`, `0C0D0E0F`, … near `0x1A4560`). A self-
introduced syntax typo (template literal closed with `'`) was caught by testing
and fixed before commit.

## 3. MIPS Decomp Progress — Did It Advance, and How?

**Function split/naming: NO.** No new `.s` files, no new dossiers, no new named
functions. The boot split track is unchanged: last named function
`boot_resource_loader_callback_register.s` (`0xAFAC..0xB030`); next target still
`0xB030`. 102 tracked `.s` / 79 dossiers, unchanged.

**Decomp analysis/understanding: YES, in two concrete ways.**

1. **Reachability evidence for the code/data boundary.** The audit now shows
   (within static limits) that the suspected data tail `0x2B89B4..0x63676C` has
   **no incoming direct control-flow edges** from the executable code: zero
   reliable (PC-relative) branch targets and zero J/JAL targets that resolve to a
   real function. This is the missing piece the review asked for — it strengthens
   "the tail is data" from density-only evidence to density + no-reachable-edge
   evidence, and is a prerequisite for the eventual reclassification that *will*
   change what the decomp emits (data source forms instead of `.word` code) for
   3.66 MB.
2. **A specific embedded-data finding inside a real function.** Function
   `0x001A42A4..0x001A4C14` (size 2,420; parent-detected, code-like) **embeds a
   data ramp table** around `0x1A4560` (`0F0F0F0F`, `0C0D0E0F`, …) whose bytes
   decode as `jal`/`j`/REGIMM. This is durable, actionable decomp knowledge: when
   that function is eventually split, the embedded table must be carved out as
   data (`.byte`/`.word` data), not disassembled as instructions. It is also a
   concrete example proving the general "data interleaved inside the executable
   extent" caveat (545,844 bytes / 19.16% of the extent).

So this step advanced the decomp's static-analysis capability and evidence base,
and produced one concrete function-level data finding, but did not add to the
named-function source set.

## 4. Verification

- `node tools/audit_code_region.js` → clean; verdict `no-credible-code-edge-into-tail`.
- `node tools/verify_setup.js` → PASS; code SHA256 `40D4E787…B409`, ROM SHA256
  `571E8339…CC67A` (both unchanged).
- `git diff --check` → clean.
- Missing-input behavior tested both ways (hard error without flag; intrinsic-only
  with `--allow-missing-parent-db`).

## 5. Still Gated / Next

- **Do not reclassify `0x2B89B4..0x63676C` yet.** Remaining: pin the exact
  code/data boundary near `0x2B89B4` (first/last `jr $ra`, alignment, structural
  marker). Then reclassify across `config/segments/rev0.yaml` + coverage ledger +
  full-ROM source manifest with the byte-exact gate green, and wire
  `audit_code_region.js` into a coverage gate.
- Split track continues independently at `0xB030`.

## 6. Caveats

- J/JAL static resolution through overlays is **not authoritative** (linear
  mapping is only valid below ~`0x2F000`). The reliable signal is the
  PC-relative branch result (0); the J/JAL result is corroborating, not proof.
- "No credible edge into the tail" uses target-resolves-to-known-function. Since
  there are no functions in the tail by construction, this is a sound *necessary*
  check, not a sufficient proof of non-reachability via indirect jumps (jump
  tables / `jr` through registers are not statically resolved here).
- The committed work is tooling + evidence + docs only; nothing in the rebuild
  path or classification changed.
