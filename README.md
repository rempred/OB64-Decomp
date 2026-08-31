# OB64 Decomp

This repository is a clean-room decompilation of *Ogre Battle 64: Person of
Lordly Caliber*, US Rev 0.

The project replaces accepted MIPS assembly owners with C source. The current
source must continue to build the exact retail ROM.

This README follows ASD-STE100 Simplified Technical English. It uses short
instructions and one term for each important project concept.

## Project scope

The canonical input is the verified US Rev 0 ROM in z64 byte order. The project
does not currently support US Rev 1.

The project keeps these types of evidence separate:

- Matching evidence shows that the linked bytes are exact.
- Source evidence shows whether a source is C, hybrid C, or assembly.
- Structural evidence shows the accepted boundaries, placement, and owners.
- Semantic evidence shows what a function or field means.

An exact machine-code match does not prove a function name or a gameplay
description.

Do not copy source expression, comments, or configuration from an external
personal decompilation. You can use an external project as a lead. You must
verify each useful fact from the ROM and from project evidence.

## Definition of matching C

A function is matching C only when all these conditions are true:

1. The source class is `PURE_C`.
2. The C object is the only linked owner of the accepted target section.
3. The linked target bytes are equal to the retail target bytes.
4. The complete rebuilt ROM is equal to the retail ROM.

A `.c` file with inline assembly is `HYBRID_C`. An exact `HYBRID_C` function is
useful, but it does not count as matching C.

Run `node tools/status.js` for current counts. Do not copy changing counts into
this README.

## Quick start

Run all commands from the repository root.

1. Put a supported US Rev 0 ROM in `baserom/`. You can instead set
   `OB64_ROM_INPUT`.
2. Copy `config/local-tools.example.json` to the ignored file
   `config/local-tools.json`.
3. Set each required local path in `config/local-tools.json`.
4. Install the authenticated repository toolchains under `.toolchains/`.
5. Run the production build and verifier.

```powershell
node tools/build.js
node tools/verify.js
node tools/status.js
```

The verifier must report `Full ROM ... EXACT`. The canonical normalized ROM
has this SHA-256 value:

```text
571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A
```

## Local tool configuration

Git ignores `config/local-tools.json`. Do not commit machine-specific paths.
The example file defines these values:

| Value | Purpose |
| --- | --- |
| `workRoot` | Stores large production build directories outside the repository. |
| `compiler` | Selects the authenticated KMC GCC 2.7.2 `cc1.exe`. This compiler generates matching code. |
| `powershellRuntimeRoot` | Selects the authenticated Windows PowerShell runtime. Normal commands do not use an unverified ambient runtime. |
| `splatPython` | Selects the Python executable for the pinned Splat installation. |
| `splatSplit` | Selects the pinned Splat `split.py` entry point. |
| `splatSnapshotRoot` | Selects the authenticated Splat source snapshot. |
| `asmDifferRoot` | Selects asm-differ for instruction diagnostics. |
| `phase5aRoot` | Selects retained structural evidence for heavyweight audit work. An ordinary match does not use this value. |
| `romInput` | Selects the local retail ROM. A value in `OB64_ROM_INPUT` can override it. |

The example file also lists one environment-variable override for each value.
`OB64_LOCAL_TOOLS` can select a different local configuration file.

The PowerShell runtime root must contain
`System32/WindowsPowerShell/v1.0/powershell.exe` and its authenticated
`System.Management.Automation.dll` file.

The repository uses these ignored toolchain roots:

```text
.toolchains/gnu-binutils-2.6-mips-kmc-elf-msys2/
.toolchains/gcc-toolchain-mips64-win64/
```

The first root contains the authenticated GNU assembler, linker, `objcopy`,
`objdump`, `nm`, `size`, `strings`, `strip`, and MSYS2 runtime. The second root
contains the authenticated GCC 12.2 preprocessor and its preprocessing engine.
The GCC 12.2 tools classify source only. They do not generate matching code.

See [docs/TOOLCHAIN.md](docs/TOOLCHAIN.md) for tool identities, hashes, flags,
and the reproducible GNU Binutils build.

## Complete production tool path

Node.js runs the project scripts. Node.js does not compile game code. The
project scripts authenticate the required tools before they use them.

| Component | Role |
| --- | --- |
| Node.js | Runs the repository command scripts. |
| Pinned PowerShell | Runs required Windows tool steps in an authenticated host runtime. |
| Splat 0.34.0 | Applies the accepted structural split and produces baseline build inputs. |
| GCC 12.2 preprocessor | Expands source for source-policy classification only. |
| KMC GCC 2.7.2 | Converts accepted C source to retail-compatible MIPS assembly. |
| GNU Binutils 2.6 | Assembles, links, inspects, and extracts the production ROM. |
| asm-differ | Shows instruction differences during development. It does not accept a match. |

The production path is:

```text
local Rev 0 ROM
  -> tools/verify_baserom.js
  -> normalized canonical z64 ROM
  -> pinned Splat structural split
  -> tracked assembly and data baseline
  -> GNU Binutils 2.6 baseline build
  -> source-policy classification of active C sources
  -> KMC GCC 2.7.2 compiler assembly
  -> reviewed section assignment
  -> GNU Binutils 2.6 assembly and link
  -> current rebuilt ROM
  -> linked target-byte comparison
  -> complete-ROM comparison
```

The following sections explain each part of this path.

### 1. Verify and normalize the ROM

`tools/verify_baserom.js` verifies the supported ROM identity. It converts
`.v64`, `.z64`, or `.n64` input to canonical z64 bytes. It writes the normalized
ROM to `build/baserom.us_rev0.z64`.

You can run this check directly:

```powershell
node tools/verify_baserom.js
```

### 2. Build the accepted structural baseline

`tools/build.js` first checks for a valid cached baseline. If it must make a new
baseline, it uses the pinned Splat configuration and snapshot. Splat applies
the accepted section, segment, overlay, and owner model.

The build then assembles tracked assembly and data with GNU Binutils 2.6. It
links and verifies the baseline against the canonical ROM.

An ordinary function task must not change this structural model. Use
[docs/AUDIT.md](docs/AUDIT.md) for a structural task.

### 3. Classify each active source

The source-policy tool preprocesses active source with the authenticated GCC
12.2 preprocessor. It then classifies the source as `PURE_C`, `HYBRID_C`, `ASM`,
or `UNKNOWN`.

This step detects assembler escape mechanisms. It does not compare machine
code and it does not replace the matching compiler.

```powershell
node tools/source_policy.js
node tools/source_policy.js --target <symbol>
```

### 4. Compile the active C source

The production build sends accepted C source to the authenticated Windows KMC
GCC 2.7.2 `cc1.exe`. The compiler writes `<symbol>.compiler.s`.

The build keeps this compiler assembly unchanged. It normally changes only the
single `.text` section directive to the accepted target-section directive.

A reviewed contract can also assign compiler-generated text regions and one
read-only switch table to accepted output sections. The contract must fix the
bytes, relocations, alignment, placement, and owner. The build does not rewrite
instructions, labels, table entries, or relocations.

### 5. Assemble and link the current source

The pinned GNU Binutils 2.6 assembler converts the compiler assembly to a MIPS
object. The build removes the original assembly owner for each active target.
It then links the C object as the only accepted owner.

The GNU linker and `objcopy` create the current ROM. The project verifies the
accepted placement, section size, relocations, and object identity.

### 6. Compare one target

Use the canonical diff command during development:

```powershell
node tools/diff.js <symbol>
```

The command compiles and links the current candidate. It uses asm-differ to
show instruction differences. It also compares the final linked bytes.

The linked-byte result is authoritative. A scratch-object result is not an
accepted match. Raw `j` and `jal` words can change when the linker resolves
their addresses.

### 7. Verify the target and the complete ROM

Use this command for an exact pure-C target:

```powershell
node tools/verify.js --target <symbol> --require-pure
```

The target option does not make a partial ROM check. The verifier still checks
the complete current build. It checks:

- the baserom identity;
- the authenticated toolchain;
- the source class;
- the only linked owner;
- the address and size;
- the reviewed relocations;
- the exact target bytes;
- a fresh source-to-object build; and
- the complete ROM bytes.

Run `node tools/verify.js` again after integration on the current main branch.

## Normal matching-C task

Use this sequence for one accepted function:

```text
select an accepted target
  -> inspect the target and its context
  -> write or adjust C
  -> run tools/diff.js early
  -> change one source property in response to the diff
  -> run the source-policy check
  -> run the target verifier with --require-pure
  -> run the complete verifier
  -> commit the verified result
```

The normal command loop is:

```powershell
node tools/diff.js <symbol>
node tools/source_policy.js --target <symbol>
node tools/verify.js --target <symbol> --require-pure
node tools/verify.js
git diff --check
git status --short --branch
```

Add an active target to `config/matching-c-targets.json`. Add only the smallest
reviewed relocation or switch-table contract to
`config/matching-c-linkage.json`. Use `config/matching-c-multi-owner.json` only
when one compiled function replaces two or more contiguous accepted executable
owner rows.

Do not change a function boundary, overlay descriptor, segment, linker rule, or
compiler identity during an ordinary match. Stop and define a structural task
if the accepted owner is not valid.

During the match, check whether static evidence supports a
`SUPPORTED_ALIAS`. Do not replace the build symbol unless the name is
`CANONICAL`. The project uses only these three naming classes:

1. `CANDIDATE` is an external lead. Do not use it as a canonical name.
2. `SUPPORTED_ALIAS` has independent static support.
3. `CANONICAL` has runtime, controlled-mutation, or recognized library proof.

Insufficient naming evidence does not block the machine-code match.

## Canonical command tools

| Command | Function |
| --- | --- |
| `node tools/build.js` | Builds the accepted baseline and the current ROM. It requires exact complete-ROM output. |
| `node tools/diff.js <symbol>` | Compiles and links one active target. It reports instruction and linked-byte differences. |
| `node tools/source_policy.js [--target <symbol>]` | Classifies active source. It does not prove a match. |
| `node tools/verify.js [--target <symbol>] [--require-pure]` | Verifies tool identity, source identity, linked ownership, placement, relocations, target bytes, and complete-ROM bytes. |
| `node tools/status.js` | Reports generated exact-source counts and remaining owners. It reports exact counts only for a valid current verification state. |
| `node tools/audit.js` | Runs heavyweight structural and coverage checks. Use it for structural work, not as the normal function gate. |

## Optional matching workbench

`tools/match.js` is a research tool. It can create first-draft C, compile scratch
candidates, compare experiments, and preserve useful blocked candidates. It
stores normal output in the ignored `build/matching/` directory.

The workbench cannot activate a target and cannot accept a match.

Start with these commands:

```powershell
node tools/match.js --help
node tools/match.js doctor
node tools/match.js inspect <symbol>
node tools/match.js prepare <symbol> --variant structured
node tools/match.js history <symbol>
node tools/match.js best <symbol>
node tools/match.js watch <symbol> --source <candidate.c>
```

The `prepare` command uses the pinned m2c checkout to generate candidate C. The
default checkout is `../tools/m2c`. `OB64_M2C_ROOT` can select another checkout.
The workbench authenticates the configured m2c commit and tree before use.

m2c is a draft generator. Its output usually needs human reconstruction and
diff-guided changes. m2c does not replace KMC GCC, the linker, or the verifier.

If you omit `--variant`, `prepare` runs the complete configured ensemble. The
ensemble includes structured, ABI-gap, load-first, return-flow, cursor-step,
masked-local, goto, and stack variants. Each special variant tests a small
source-shape hypothesis. It is not a general compiler rule.

Use the other workbench commands for these tasks:

| Command | Function |
| --- | --- |
| `family` | Finds exact or relocation-normalized structural relatives. It does not prove that two functions have the same meaning. |
| `context` | Shows bounded callers, callees, fields, and optional read-only Total Resolver context. |
| `rank` | Ranks targets with reviewed value and matchability data. |
| `classify` | Reopens one stored candidate and its last compile result. |
| `compare` | Compares two compiled candidates for the same target. |
| `case-cfg` | Compares command cases and shared tails in a large dispatcher. It does not prove exact bytes. |
| `probe` | Tests a specific compiler-pass hypothesis. A research compiler is never part of acceptance. |
| `sweep` | Runs a bounded candidate-generation experiment across multiple targets. Use an explicit set, size, or limit. |
| `preserve` | Copies one selected blocked candidate and its dossier into tracked archive files. This command does not activate the candidate. |

See [tools/README.md](tools/README.md) for all workbench options and limits. See
[docs/KMC_GCC_MATCHING_NOTES.md](docs/KMC_GCC_MATCHING_NOTES.md) for verified,
scoped compiler-output techniques.

## Supplementary research tools

Supplementary tools can explain a target or improve a candidate. They do not
change the acceptance rules.

### Total Resolver R3

Total Resolver combines static placement evidence with selected runtime
evidence. An ordinary query does not require Project64.

Read `tools/total_resolver/AGENTS.md` before you use or change Total Resolver.
Then use the read-only commands:

```powershell
python -m tools.total_resolver doctor
python -m tools.total_resolver knowledge status
python -m tools.total_resolver knowledge verify
python -m tools.total_resolver session status
python -m tools.total_resolver explain func_00043d1c
python -m tools.total_resolver search --function 00043d1c
python -m tools.total_resolver coverage
```

Project64 is an optional external runtime. It is not part of the build, diff,
or verification path. A capture task needs explicit authorization. Database
selection, capture, ingestion, migration, and product-building commands belong
to an assigned database-building task.

### Large-dispatcher aids

The repository has bounded aids for `func_00284288`:

```powershell
node tools/reproduce_func_00284288_case_cfg.js --actual-dispatch 0x80 --actual-body 0x8A0 --actual-tail post-command=0x1EC8
node tools/reproduce_func_00284288_m2c_delay_slot.js --m2c-root <pinned-m2c-checkout>
```

The first command reproduces a reviewed case-aware control-flow comparison.
The second command tests the m2c adapter for a label at a likely-branch or call
delay slot. These commands produce research evidence only.

### Toolchain tests

Use the focused tests when you change the production toolchain or its contract:

```powershell
node tests/binutils_smoke.js
node tests/active_targets.js
node tests/multi_owner_text.js
node tests/compiler_text_functions.js
node tests/local_tools.js
node tests/source_policy.js
node tests/matching_workbench.js
```

These tests authenticate tool identities and test the expected MIPS, section,
relocation, and source-policy behavior. They do not replace the complete-ROM
verifier. See [tests/README.md](tests/README.md) for the complete test list and
for tests that require generated build artifacts.

### Other analysis and export aids

Use these tools only when the task needs their evidence or output:

| Tool | Function |
| --- | --- |
| `tools/dump_function_context.js` | Makes a bounded caller, callee, global, and boundary report. Parent data is a lead and is not accepted truth. |
| `tools/decode_rodata_strings.js` | Decodes one tracked read-only data owner without removing control bytes. |
| `tools/decode_ob64_tables.js` | Reproduces the reviewed scenario-table exports. |
| `tools/build_rom_coverage_ledger.js` | Classifies ownership and unknown spans across the complete ROM. |
| `tools/check_boundaries.js` and `tools/check_splits.js` | Detect common structural split errors. They do not prove a boundary. |
| `tools/export_function_corrections.js` | Reports accepted boundary corrections against the parent function database. |
| `tools/export_editor_names.js` | Exports byte-verified name data for the LordlyCaliber editor. |

These tools write generated reports or downstream exports. They do not replace
the canonical diff or verifier.

### Structural and extraction tools

The `tools/` directory also contains low-level commands for ROM extraction,
coverage, source manifests, original-MIPS owners, Splat, overlay configuration,
and historical build stages. These commands support structural work and
repository maintenance. They are not part of an ordinary function match.

Read [docs/AUDIT.md](docs/AUDIT.md) before you change boundaries, segments,
overlays, executable ranges, source ownership, linker layout, or the toolchain
contract. `tools/verify_setup.js` is a retained structural compatibility gate.
Do not use it as a substitute for `tools/verify.js`.

## Generated files

Git ignores these files by default:

- ROM inputs and rebuilt ROMs;
- objects, maps, and compiler output;
- generated verification and diff reports;
- matching-workbench databases and candidates;
- Total Resolver databases, captures, traces, and screenshots;
- local toolchains; and
- machine-specific configuration.

Generated files normally belong under `build/`, `dist/`, or `scratch/`. Do not
commit ROM binaries or local runtime evidence.

## Documentation

Read only the documents that the task needs:

1. [AGENTS.md](AGENTS.md) contains durable project rules.
2. [docs/WORKFLOW.md](docs/WORKFLOW.md) contains the normal build, diff, and
   acceptance workflow.
3. [docs/SOURCE_POLICY.md](docs/SOURCE_POLICY.md) defines the source classes.
4. [docs/NEXT_STEPS.md](docs/NEXT_STEPS.md) contains the active work queue.
5. Read the relevant subsystem, toolchain, dossier, or research document.

Read [docs/AUDIT.md](docs/AUDIT.md) only for structural work or when the task
requires it. Read `tools/total_resolver/AGENTS.md` before Total Resolver work.

The most useful supplementary documents are:

- [docs/TOOLCHAIN.md](docs/TOOLCHAIN.md) for the authenticated production tools;
- [tools/README.md](tools/README.md) for the matching workbench and low-level tools;
- [docs/KMC_GCC_MATCHING_NOTES.md](docs/KMC_GCC_MATCHING_NOTES.md) for tested matching techniques; and
- [docs/templates/matching-c-agent-prompt-guide.md](docs/templates/matching-c-agent-prompt-guide.md) for one-function task prompts.

Historical plans and reports describe fixed commits. They do not define the
current command surface or the current progress count.

## Separate projects

Treat these subjects as separate scoped projects:

- US Rev 1;
- a different compiler or toolchain;
- a new segmentation or overlay model;
- native or static recompilation; and
- modified-game acceptance.

A modified ROM is expected to differ from retail. Preserve an exact retail
baseline before you start modified-game work.
