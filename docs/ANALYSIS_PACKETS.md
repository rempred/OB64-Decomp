# Kuna and m2c analysis packets

The standalone packet command prepares both default decompiler outputs for a difficult accepted function. m2c remains the primary matching-C generator.
Both outputs are hypotheses. They do not prove original types, array sizes, variable lifetimes, callee effects, semantic equivalence or matching acceptance.
Implementation `5d57f140` passed [independent Material review](Plans/task-logs/analysis-packets-review-r1.md) at `4f4ce3d6`. This command is outside the normal compile, linked diff and verifier paths.

## Local configuration

Use Node.js and existing local Kuna, compiled Sleigh specs, Python and m2c installations. No download, installation or PATH discovery occurs.
Create an explicit machine-local configuration under ignored `build/`:

```powershell
node tools/analysis_packet/cli.js configure --output build/analysis-packets/local-tools.json --kuna C:/YOUR/KUNA/kuna.exe --specs C:/YOUR/KUNA/specs --python C:/YOUR/PYTHON/python.exe --m2c-root C:/YOUR/m2c
```

Replace these example installation paths. The output file must not already exist.
Configuration records executable hashes, reported versions, the complete specs-tree hash and the m2c-tree hash.
It records your explicitly selected installation; it does not certify the vendor or silently approve a changed binary.
Compare installation identities with the accepted project tool trial before normal use. Reconfiguration requires a new local file.

The tree identity includes regular files except `.git`, `__pycache__`, `.pytest_cache` and `.mypy_cache` directories.
Symlinks and nonregular tool-tree entries reject. Keep the m2c installation separate from generated outputs and virtual environments.
An omitted tool is recorded as unavailable. An executable or tree that differs from its configuration is never executed.
Python runs in isolated mode without writing bytecode. The packet records imported-file hashes and checks them again before cache reuse.
Executable, script/spec, environment and imported-module identities are cache evidence; they are not a complete operating-system or dynamic-library audit.

## Prepare a packet

```powershell
node tools/analysis_packet/cli.js prepare func_001F6098 --config build/analysis-packets/local-tools.json --out build/analysis-packets/cache
```

The command reads the accepted structural model and authenticates the canonical normalized retail ROM.
It does not read the current candidate C as a decompiler oracle. It never compiles or adopts either output.
The supported code input has one unambiguous executable owner, one contiguous runtime mapping, and its primary entry at offset zero.
RSP/data owners, nonzero entry prefixes, secondary aliases, multiple slices and members of multi-owner logical functions reject.
A compilation-group member may use its own accepted retail owner interval. The packet records its grouping without loading compiler-produced group bytes.

An analysis-only ELF32 big-endian MIPS III/O32 file maps only the exact selected code bytes.
Its entry, extent and neutral function symbol are supplied metadata. The ELF headers and alignment gaps are not executable padding.
Kuna's default automatic target uses its MIPS32 big-endian model. Full VR4300, FCSR, hardware and live-overlay behavior remain outside this static interpretation.
The packet checks every returned disassembly address and instruction byte. Failed, unsupported or partial readback remains visible.

The raw m2c input uses existing generic project disassembly and direct-address labels, without prototypes or a context header.
The adapter omits synthetic m2c likely-branch guard instructions from this raw analysis copy and records each omitted line.
This does not change the existing matching wrapper. Guard omission may expose m2c limitations; inspect any affected likely-branch region directly.

## Explicit supplied jump table

```powershell
node tools/analysis_packet/cli.js prepare func_001F197C --config build/analysis-packets/local-tools.json --out build/analysis-packets/cache --table 0x002131D8:88
```

Version1 supports one explicitly named ROM interval containing a bounded same-owner jump table.
The interval must be aligned, contain8–4096 bytes, and lie within one accepted nonexecutable data slice in the same overlay.
The existing bounded MIPS switch recognizer must identify exactly that interval and destinations inside the selected owner.
Both tools receive the same literal table bytes and accepted mapping. m2c also receives labels for the recognized targets.
No table size, destination or missing byte is invented. A supplied table is assistance, not a discovery by Kuna or m2c.
Other tables, external destinations, arbitrary data and caller-supplied types are unsupported in this version.
Without table assistance, indirect dispatch may remain incomplete even when both tools produce text.

## Alternate interpretation

Defaults always run first. Request one additional Kuna transformation only for a specific ambiguity:

```powershell
node tools/analysis_packet/cli.js prepare func_001F3C00 --config build/analysis-packets/local-tools.json --out build/analysis-packets/cache --kuna-option regionstructure=off --reason "Compare the shared packet tail with the alternate structurer."
```

There is no default sweep or automatic processor fallback. Unknown or unsupported options remain failed tool results.
The alternate output supplements the default; it never silently replaces it.

## Results and cache

The command prints the packet directory, cache result and generation status.

- Exit0: both default hypotheses were produced and complete Kuna byte readback passed. A requested alternate also produced text.
- Exit2: a packet exists with missing tools, tool failures, timeouts or failed readback. Inspect `packet.json` and the retained stderr.
- Exit1: input, configuration, unsupported shape or cache integrity rejected; no successful packet is claimed.

`produced-hypotheses` means generation succeeded. It does not mean the printed program is complete or correct.
`packet.json` includes warnings, actual commands, exit status, timing and relative output locations.
`identity.json` binds code/mapping/ROM, supplied metadata, tool/configuration, adapter/project-reader, Node and environment identities.
`input.json` records accepted ownership, runtime placement and assistance. `input.elf`, `input.s` and literal byte files retain exact inputs.
`kuna/code.c` and `m2c/code.c` are separate outputs. Each tool's raw stdout/stderr and command record remain beside them.

Cache names derive from authenticated identities and options. Before reuse, the command reauthenticates current tools and accepted inputs.
It checks the exact artifact census, hashes, packet identity and imported Python files. Changed or missing artifacts reject.
Incomplete directories are never treated as cache hits. Exclusive directory creation prevents two invocations writing one packet.
Use `--fresh` to retain an old failed/corrupt packet while generating a separate result. The command never deletes old evidence.
Failed tool packets may be reused only under the same authenticated conditions; use `--fresh` to retry a transient failure.
`--timeout-ms N` changes the bounded per-process limit, up to60000 milliseconds, and changes cache identity.
Cache manifests detect drift in a trusted local evidence store; they are not cryptographic signatures against an attacker rewriting all evidence.

## Validation and boundaries

```powershell
node tools/analysis_packet/test.js build/analysis-packets/local-tools.json build/analysis-packets/tests
node tools/test.js
```

The targeted checks exercise accepted solved/hard owners, supplied tables, negative input shapes, tool failures and cache integrity.
Frozen packet comparison checks use the returned Kuna JSON code field, avoiding an older display artifact's added terminal CRLF.
The test currently requires the retained project trial/R4 reference packets. This is an explicit local validation dependency.
The routine tooling manifest is separate from a canonical build or full-ROM verifier. Its existing baseline failures must remain reported.
No command modifies production sources, headers, configuration, accepted mapping, compiler flags, linker ownership or verification rules.
Tooling acceptance does not complete the unfinished fourteen-target W8 wave or add an ordinary source-review gate.
