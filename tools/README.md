# Repository tools

Repository-local deterministic decompilation tools live here. They authenticate
their required inputs and write generated output to ignored paths; ROMs,
objects, maps, compiler output, and reports must not be tracked.

For contributor setup and the ordinary function loop, start with
[the repository README](../README.md) and
[the canonical workflow](../docs/WORKFLOW.md). Executable `--help` output is the
authority for command options.

## Normal matching interface

| Command | Role |
| --- | --- |
| `node tools/build.js` | Build the accepted baseline plus active replacements and require an exact complete ROM. |
| `node tools/diff.js <symbol>` | Compile and link one active target; show instruction diagnostics and linked-byte equality. |
| `node tools/source_policy.js [--target <symbol>]` | Mechanically classify active source. |
| `node tools/verify.js [--target <symbol>] [--require-pure]` | Run the canonical tool, source, ownership, placement, relocation, target-byte, and complete-ROM gate. |
| `node tools/status.js` | Derive progress from accepted configuration and the current valid verification state. |
| `node tools/audit.js` | Run heavyweight structural verification; this is not the ordinary function gate. |

The minimum matching-C completion commands are:

```powershell
node tools/diff.js <symbol>
node tools/verify.js --target <symbol> --require-pure
node tools/verify.js
```

No diagnostic or scratch command replaces them.

## Routine tooling tests

Run the required routine regression manifest with:

```powershell
node tools/test.js
```

Use `node tools/test.js --list` to print the exact suite list. The runner executes
all required routine suites and returns one aggregate failure status; a missing
required suite is a failure, not a skip.

This command needs the normal local-tool configuration, authenticated
source-policy preprocessor, and normalized canonical baserom. It deliberately
does not run a canonical build or verifier, the heavyweight audit, Total
Resolver/native tests, archived tests, or every file under `tests/`. It is a
regression gate for the tooling and does not prove a matching-C contribution.
See [the test index](../tests/README.md) for specialized suites.

## Optional matching workbench

```powershell
node tools/match.js doctor
node tools/match.js --help
```

The workbench generates and compares research candidates under ignored
`build/matching/`. It authenticates its inputs but cannot activate, promote, or
accept source. Read
[the matching workbench reference](../docs/MATCHING_WORKBENCH.md) for candidate
identity, caching, relocation-aware diagnostic limits, m2c variants, sweeps,
families, context, case-CFG analysis, probes, and deliberate candidate
preservation.

## Common research and export tools

| Tool | Purpose |
| --- | --- |
| `tools/dump_function_context.js` | Produce bounded caller, callee, global, and boundary context; parent data remains a lead. |
| `tools/decode_rodata_strings.js` | Decode one tracked read-only data owner while retaining control bytes. |
| `tools/decode_ob64_tables.js` | Reproduce reviewed scenario-table exports. |
| `tools/check_boundaries.js` | Detect common boundary inconsistencies; it does not prove a boundary. |
| `tools/check_splits.js` | Detect common split inconsistencies; it does not prove a split. |
| `tools/export_function_corrections.js` | Report accepted boundary corrections against the parent function database. |
| `tools/export_editor_names.js` | Export byte-verified name data for LordlyCaliber. |

Total Resolver has its own mandatory guide at
`tools/total_resolver/AGENTS.md`. Project64 and runtime capture are not part of
the ordinary build, diff, or verification path.

## ROM and structural maintenance tools

These commands support repository maintenance or structural work. Do not add
them to an ordinary function ritual. Read
[the structural audit](../docs/AUDIT.md) before changing boundaries, segments,
overlays, executable ranges, ownership, linker layout, or toolchain contracts.

| Command | Purpose |
| --- | --- |
| `node tools/verify_baserom.js` | Verify US Rev 0 input, normalize `.v64`/`.z64`/`.n64` to canonical z64, and write the ignored identity report. |
| `node tools/verify_setup.js` | Run the retained historical structural setup/compatibility gate used by `audit.js`; never substitute it for `verify.js`. |
| `node tools/extract_original_mips.js` | Emit a no-gap original-MIPS `.word` reference under `build/original-mips/rev0/`. |
| `node tools/build_rom_coverage_ledger.js` | Build the whole-ROM ownership, archive, padding, and unknown-span ledger. |
| `node tools/extract_rom_segments.js` | Extract coverage-ledger spans to ignored raw segment output. |
| `node tools/rebuild_rom.js` | Rebuild and byte-compare the extracted-segment ROM. |
| `node tools/build_full_source_manifest.js` | Assign every ROM byte a source strategy and audit it against accepted inputs. |
| `node tools/extract_non_code_sources.js` | Verify tracked non-code owners and generate ignored fallbacks. |
| `node tools/rebuild_from_source_manifest.js` | Rebuild from original MIPS plus source-manifest non-code owners. |
| `node tools/promote_non_code_sources.js` | Deliberately promote selected non-code owner files; follow with structural verification. |
| `node tools/split_original_mips_part.js ...` | Split one accepted original-MIPS part while preserving its exact `.word` lines. |
| `node tools/build_gnu_binutils_2_6.js ...` | Reproduce the authenticated GNU Binutils bundle under the contract in `docs/TOOLCHAIN.md`. |

Low-level phase-named scripts are retained implementation and audit components.
They are not the public matching interface. Historical reports can cite those
commands for a fixed commit, but current work should use `build.js`, `diff.js`,
`verify.js`, `status.js`, and `audit.js`.

## Generated output

Normal generated files belong under `build/`, `dist/`, or `scratch/`. In
particular, do not track:

- normalized input or rebuilt ROMs;
- assembly/object/linker outputs and maps;
- diff, verification, coverage, or source-policy reports;
- matching-workbench databases, candidates, sweeps, and probes;
- Total Resolver databases, captures, traces, or screenshots;
- local toolchains; or
- machine-specific paths.
