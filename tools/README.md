# tools

Repo-local decomp tools belong here.

Initial expected tools:

- ROM byte-order normalization.
- Rev 0 extraction from `config/segments/rev0.yaml`.
- Original MIPS disassembly emission into `asm/original/`.
- Build and compare helpers.
- Function dossier import from the parent workspace.

Tools should be deterministic and should not require ROM binaries to be tracked.

## Matching Workbench

```powershell
node tools/match.js --help
node tools/match.js doctor
```

The matching workbench is an optional, generated research layer over the
accepted US Rev 0 model. It resolves exact target ranges and bytes, remembers
scratch candidates in `build/matching/workbench.sqlite`, compiles through the
authenticated production compiler/toolchain, and reports why a scratch object
differs. It never activates or promotes a target.

Schema 2 keys a candidate by exact target plus exact source text. Separate
observation rows retain each generation path, variant, and portable tool
arguments. Thus identical C is compiled once without discarding how it was
found. Failed compiler attempts remain visible but do not poison the reusable
success cache.

Common commands:

```powershell
node tools/match.js inspect <symbol>
node tools/match.js prepare <symbol>
node tools/match.js watch <symbol> --source <candidate.c>
node tools/match.js history <symbol>
node tools/match.js best <symbol>
node tools/match.js family <symbol>
node tools/match.js context <symbol>
node tools/match.js rank --lane leverage
node tools/match.js probe <symbol> --source <candidate.c>
```

Batch research is bounded and checkpointed after every target:

```powershell
node tools/match.js sweep --set smallest-leaves-200 --variant structured --no-context
node tools/match.js sweep-status
```

Calibrated structured rulesets are available when the ordinary structured
draft is close:

```powershell
node tools/match.js prepare <symbol> --variant structured-abi-gaps --no-context
node tools/match.js prepare <symbol> --variant structured-load-first --no-context
node tools/match.js prepare <symbol> --variant structured-return-flow --no-context
node tools/match.js prepare <symbol> --variant structured-cursor-steps --no-context
node tools/match.js prepare <symbol> --variant structured-masked-local --no-context
```

`structured-abi-gaps` preserves literal missing `arg0`-through-`arg3` integer
or pointer ABI slots. `structured-load-first` tests one narrow three-statement
byte-load/store ordering shape. `structured-return-flow` tests direct returns
and widening of an inferred narrow return temporary. `structured-cursor-steps`
retains explicit byte-cursor advances. `structured-masked-local` retains one
masked value as a separate C temporary. These are versioned post-generation
hypotheses, and candidate provenance records whether a transform actually
applied. They do not rewrite canonical source or replace exact compilation.

These passes form an ensemble, not a contest to select one winner. A ruleset
with unique exact matches remains useful even if another function regresses in
that pass, because the other passes still retain it. A saved sweep records:

- every exact symbol and candidate ID for each ruleset;
- every matching ruleset for each function;
- gains and losses relative to the first ruleset;
- symbols unique to one ruleset; and
- one deduplicated `exactTargetCount` for the ensemble.

The older `exactBytes` counter is retained as the number of exact variant runs,
so it can be larger than the number of exact functions. Identical m2c inputs
share one generator launch, and identical generated source is compiled once per
preparation while separate ruleset observations are preserved. Fixed-corpus
results are recorded in
`docs/matching-c/matching-workbench-calibration-20260823.md` and
`docs/matching-c/matching-workbench-ensemble-20260823.md`.

Use `--include-targets` when complete target rows and complete ruleset
membership are genuinely needed; default output contains counts and
representative rows. Re-running an
interrupted sweep reuses successful exact-input compiles. m2c is authenticated
at the commit and tree in `config/matching-workbench.json`; tracked edits or
untracked executable Python inputs fail closed. Set `OB64_M2C_ROOT` to select a
checkout outside the documented default. Reviewed value annotations
can be added to `config/matching-priorities.json`; value and matchability remain
separate in ranking output.

Family tiers are collision-checked exact representations. Only the exact-byte
tier is byte equality, and even exact clones remain distinct physical targets.
The relocation-normalized tier removes only external `J`/`JAL` target fields;
it does not guess `HI16`/`LO16` intent from raw bytes.
Callsite/type context is structural evidence, not a semantic declaration.
`context --runtime` optionally reads Total Resolver; it does not start capture
or require Project64. `probe` dumps are always research-only. A compiler passed
with `--research-compiler` is structurally confined to `probe` and is never
accepted by build, diff, or verification commands.

Priority annotations use reviewed, explicit records rather than inferred names:

```json
{
  "subsystems": [{ "id": "reviewed-subsystem", "value": 20 }],
  "targets": [{ "symbol": "func_XXXXXXXX", "subsystem": "reviewed-subsystem", "value": 5, "runtimeReach": 3 }]
}
```

`value` is an additive reviewed priority. `runtimeReach` is a reviewed session
or context count; missing runtime evidence is displayed and is not scored as a
negative.

All workbench outputs are ignored and noncanonical. The SQLite database is
intended to persist locally across matching sessions; back up
`build/matching/workbench.sqlite` if local experiment history matters. Preserve
a valuable blocked candidate in tracked source and a dossier explicitly with:

```powershell
node tools/match.js preserve <candidate-id> --note "why this is worth keeping"
```

Canonical acceptance remains `tools/diff.js`, target `tools/verify.js`, sole C
linker ownership, and the exact full-ROM verifier.

## Current Tools

```powershell
node tools/verify_setup.js
```

Canonical setup-complete verifier. Runs the full setup gate and writes
`build/setup/verify-setup-report.json`.

```powershell
node tools/verify_baserom.js
```

Verifies the US Rev 0 input ROM, normalizes `.v64/.z64/.n64` input to canonical
z64 bytes at `build/baserom.us_rev0.z64`, and writes
`build/baserom.us_rev0.report.json`.

```powershell
node tools/extract_original_mips.js
```

Emits a no-gap original MIPS reference for the configured Rev 0 code region into
`build/original-mips/rev0/` and writes `build/original-mips/rev0-report.json`.
Each 4-byte word is emitted as `.word` with a decode comment. This preserves the
bytes even where function detection, labels, or code/data classification are not
yet perfect.

```powershell
node tools/build_rom_coverage_ledger.js
```

Builds a whole-ROM Rev 0 byte coverage ledger at
`build/coverage/rev0-rom-coverage-ledger.json` and `.md`. The ledger tags known
structural ranges and all LHA archives, classifies untagged spans as padding or
unknown, and gives unknown spans a small MIPS-risk summary. It also performs an
independent LHA scan and reports all rejected method-like signatures so a missed
archive section is visible.

```powershell
node tools/extract_rom_segments.js
node tools/rebuild_rom.js
```

Extracts each coverage-ledger span to `build/segments/rev0/raw/`, writes
`build/segments/rev0/manifest.json`, rebuilds `dist/rebuilt.us_rev0.z64`, and
byte-compares it against `build/baserom.us_rev0.z64`.

The rebuild report is written to `build/rebuild/rev0-rebuild-report.json`.

```powershell
node tools/build_full_source_manifest.js
```

Builds `build/source-manifest/rev0-full-source-manifest.json` and `.md`. This
audits the coverage ledger against the segment manifest and original-MIPS report,
then assigns every ROM byte a source strategy: original MIPS for confirmed code
region bytes, or raw/header/archive/audio/LZSS/tail/padding source ownership for
non-code bytes. Ambiguous archive gaps remain explicitly ambiguous.

```powershell
node tools/extract_non_code_sources.js
node tools/rebuild_from_source_manifest.js
```

Verifies tracked non-code source-owner files under
`data/source-owners/rev0/`, writes byte-exact generated fallback owners under
`build/source-owners/rev0/` for unpromoted spans, then rebuilds
`dist/rebuilt.us_rev0.source-manifest.z64` from assembled original MIPS plus
those owner files. This proves non-code bytes participate in the rebuild path
without being treated as decoded MIPS.

```powershell
node tools/promote_non_code_sources.js
```

Promotes selected non-code source-manifest entries into tracked
`data/source-owners/rev0/` files and updates
`data/source-owners/rev0/manifest.json`. With no arguments it promotes the small
default batch: `raw_header`, `raw_structural_gap`, and `raw_tail_data`. Use
`--source-form <form>` or `--index <n>` for later deliberate batches, then run
`node tools/verify_setup.js`.

```powershell
node tools/split_original_mips_part.js --part <asm-file> --split <name>:<start>:<end>:<out-file> --remainder <name>:<out-file>
```

Splits one tracked `asm/original/rev0/manifest.json` part into smaller
contiguous source files while preserving the original `.word` lines and decode
comments for each z64 range. Use this for source-layout cleanup after a chunk has
already been promoted into tracked original MIPS.

```powershell
node tests/binutils_smoke.js
```

Verifies the project-local GNU MIPS binutils toolchain configured in
`config/toolchain.json`: complete GNU 2.6 executable/runner identity, big-endian MIPS3/O32 output,
delay slots, historical moves, COP1 and call grammar, custom sections, linker LMA/`PT_LOAD`
behavior, exact binary extraction, an exact tracked assembly chunk, inactive p3066, and absence
of retired production dependencies.
