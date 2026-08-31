# tools

Repo-local deterministic decomp tools belong here. The canonical matching
surface is `build.js`, `diff.js`, `verify.js`, `status.js`, and `audit.js`.
Generated research tools may accelerate that loop, but cannot accept source.

The repository also contains tools for:

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

The exact target-model identity includes the accepted Phase 7 conventional-build configuration,
including load-slab placement. A structural placement change therefore starts a new model while
retaining earlier experiments as stale history.

An accepted function split across source-part rows remains one workbench target when the model
names the adjacent parts as a `func_XXXXXXXX`/`func_XXXXXXXX_chunkNhead` head followed by the
matching `func_XXXXXXXX_chunkNtail`. The workbench validates contiguous ROM, VRAM, placement, and
source ownership before composing those rows; the tail is not exposed as a separate function.

Scratch compilation may retain compiler-generated read-only `.rodata` and may encode numeric COP1
binary operations deterministically for the pinned assembler. Those allowances are confined to
research candidates. Canonical compilation, `diff`, and verification reject auxiliary sections
unless the active target has a reviewed switch-table contract fixing the exact read-only section,
bytes, relocations, placement, and ownership. A preserved assembly-row remainder must use its own
contracted read-only section rather than `.data` or `.bss`. The scratch allowance is not a
canonical contract.

Common commands:

```powershell
node tools/match.js inspect <symbol>
node tools/match.js history <symbol>
node tools/match.js best <symbol>
node tools/match.js watch <symbol> --source <candidate.c>
node tools/match.js classify <candidate-id>
node tools/match.js compare <candidate-id> <candidate-id>
node tools/match.js case-cfg <candidate-id> --case-map <map.json> \
  --actual-dispatch <offset> --actual-body <offset> \
  --actual-tail <name=offset>
node tools/match.js preserve <candidate-id> --note "why it is worth keeping"
node tools/match.js prepare <symbol> --variant structured
node tools/match.js prepare <symbol>
node tools/match.js family build
node tools/match.js family <symbol>
node tools/match.js family list --tier exact --include-members
node tools/match.js context <symbol>
node tools/match.js rank --lane leverage
node tools/match.js rank --explain <symbol>
node tools/match.js probe <symbol> --source <candidate.c>
node tools/match.js probe compare <left-report.json> <right-report.json>
```

`case-cfg` is a bounded aid for large comparison-driven dispatchers. Its map
declares the accepted command values, retail dispatch range, command register,
registers whose dispatch-time values are statically fixed, and named shared
tails. The command emulator fails closed if a branch condition depends on an
unknown register, a control form is unsupported, or execution escapes the
declared dispatch bounds. The candidate's dispatch/body/tail offsets remain
explicit CLI inputs because they can move while a draft is being reconstructed.

The generated JSON aligns retail and candidate regions at each command entry.
For every command it reports entry offsets, block counts, direct-call symbols,
successor classes, unmatched normalized blocks, and named-tail convergence.
Register names are omitted from block signatures, external calls use relocation
symbols, and section-local `R_MIPS_26` jump addends are normalized before CFG
construction. Region totals can count a shared interior block more than once;
they are per-command coverage totals, not whole-function metrics. Reports stay
under ignored `build/matching/case-cfg/`. This comparison does not establish
semantics, linked ownership, exact bytes, or full-ROM identity.

The matching assembly adapter can insert analysis-only guards before labels
that otherwise occupy an IDO likely-branch/call delay slot. These guards are
not retail instructions and never enter candidate C. The pinned target-specific
regression can be reproduced with:

```text
node tools/reproduce_func_00284288_m2c_delay_slot.js --m2c-root <pinned-m2c-checkout>
```

`prepare --variant structured` requests one baseline draft. With no `--variant`,
`prepare` runs the complete configured ensemble. Repeat `--variant` to select a
subset. Context is generated for inspection by default, passed to m2c only with
`--with-context`, and skipped with `--no-context`. Use `--no-compile` when only
generated sources are wanted.

Batch research supports explicit bounds and is checkpointed after every target:

```powershell
node tools/match.js sweep --max-size 64 --leaf-only --limit 200
node tools/match.js sweep --set smallest-leaves-200 --variant structured --no-context
node tools/match.js sweep --max-size 256 --variant structured-return-flow --no-context --jobs 8
node tools/match.js sweep-status
node tools/match.js sweep-status --include-targets
```

Bare `sweep` means every currently unsolved ordinary target with the full
configured ensemble; supply a set, size, or limit unless that full run is
intentional. General sweeps omit active matching targets by default. The fixed
`smallest-leaves-200` calibration set includes solved members so historical
runs remain comparable. `--include-solved` opts a general sweep back into active
targets. `--jobs N` parallelizes across targets while keeping the rulesets for
one target together so generation and compilation reuse remain intact. Parallel
sweeps currently require `--no-context`; one coordinator records deterministic,
per-target checkpoints, and changing the worker count does not change sweep
identity. The coordinator runs workers from an authenticated temporary snapshot
of the pinned m2c tree, and ruleset definitions plus target membership are part
of sweep identity. Infrastructure exceptions abort with the current target left
pending for resume. Start with eight workers on a 16-thread host and increase
only after a bounded canary shows that compiler and SQLite traffic remain healthy.

Calibrated structured rulesets are available when the ordinary structured
draft is close:

```powershell
node tools/match.js prepare <symbol> --variant structured-abi-gaps --no-context
node tools/match.js prepare <symbol> --variant structured-load-first --no-context
node tools/match.js prepare <symbol> --variant structured-return-flow --no-context
node tools/match.js prepare <symbol> --variant structured-cursor-steps --no-context
node tools/match.js prepare <symbol> --variant structured-masked-local --no-context
node tools/match.js prepare <symbol> --variant gotos --no-context
node tools/match.js prepare <symbol> --variant stack --no-context
```

`structured` is the baseline structured m2c pass. `gotos` and `stack` expose
m2c's goto-only and stack-structure modes. `structured-abi-gaps` preserves
literal missing `arg0`-through-`arg3` integer or pointer ABI slots.
`structured-load-first` tests one narrow three-statement
byte-load/store ordering shape. `structured-return-flow` tests direct returns
and widening of an inferred narrow return temporary. `structured-cursor-steps`
retains explicit byte-cursor advances. `structured-masked-local` retains one
masked value as a separate C temporary. These are versioned post-generation
hypotheses, and candidate provenance records whether a transform actually
applied. They do not rewrite canonical source or replace exact compilation.

Prepared assembly also supplies canonical overlay jump-table context when a
dispatcher has the accepted bounded `sltiu`/scale-by-four/table-load/`jr`
shape. The workbench maps the live table address through the accepted overlay
descriptor and emits entries only when every canonical ROM word is an aligned
destination inside the same accepted function. Unbounded, out-of-range, or
partially invalid tables fail closed and are not guessed.

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

Routine workbench outputs are ignored and noncanonical. The SQLite database is
intended to persist locally across matching sessions; back up
`build/matching/workbench.sqlite` if local experiment history matters. Preserve
a valuable blocked candidate in tracked source and a dossier only through the
explicit tracked export:

```powershell
node tools/match.js preserve <candidate-id> --note "why this is worth keeping"
```

Canonical acceptance remains `tools/diff.js`, target `tools/verify.js`, sole C
linker ownership, and the exact full-ROM verifier.

Default output is bounded. Use `--include-details`, `--include-source`,
`--include-members`, `--include-context`, or `--include-targets` only when the
complete rows are needed, and `--json` for machine-readable output. The current
option list is always available from `node tools/match.js --help`.

## Other repository tools

```powershell
node tools/verify_setup.js
```

Historical structural setup/compatibility gate used by `tools/audit.js`. It
writes `build/setup/verify-setup-report.json`. Ordinary matching acceptance uses
`tools/verify.js`; do not substitute this setup gate for it.

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
