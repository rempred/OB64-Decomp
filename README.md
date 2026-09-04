# OB64 Decomp

Clean-room decompilation of *Ogre Battle 64: Person of Lordly Caliber*, US
Rev 0. The matching baseline replaces accepted MIPS assembly owners with C while
continuing to rebuild the normalized retail ROM byte-for-byte. US Rev 1 is out
of scope.

## Start here

Run commands from the repository root. The repository does **not** include an
installer or download the required ROM and toolchains. Before the first build,
provide the authenticated local dependencies described below.

1. Put a legally obtained US Rev 0 ROM in `baserom/`. An external path can
   instead be selected with `romInput`, but the standalone normalization command
   must receive that path explicitly as described below.
2. If it does not already exist, copy `config/local-tools.example.json` to the
   ignored `config/local-tools.json`, then replace its normal-work placeholder
   paths. Keep an existing local configuration.
3. Provision the pinned local tools and m2c checkout; the configuration files
   authenticate them but do not install them.
4. Normalize the ROM, check the matching workbench, and build the exact current
   baseline.

```powershell
if (-not (Test-Path config/local-tools.json)) {
  Copy-Item config/local-tools.example.json config/local-tools.json
}
# If copied above, replace its normal-work placeholders before continuing.
node tools/verify_baserom.js
node tools/match.js doctor
node tools/build.js
```

The command above assumes exactly one ROM is present in `baserom/`. If the ROM
exists only at the external `romInput` path, use
`node tools/verify_baserom.js --input <rom>` for the normalization step. The
standalone normalizer does not read `config/local-tools.json`; later build and
verification commands do.

`doctor` needs the normalized ROM, the production compiler/assembler chain, and
the pinned m2c checkout. m2c is optional for `build`, `diff`, and `verify`, but it
is part of the recommended matching setup check.

For one assigned, accepted target, write or adjust its C source and use this
loop:

```powershell
node tools/diff.js <symbol>
node tools/verify.js --target <symbol> --require-pure
```

After integration, verify all active replacements and inspect generated status:

```powershell
node tools/verify.js
node tools/status.js
```

The target verifier still checks the complete ROM. A successful matching-C
result requires exact linked target bytes, sole C-object ownership, `PURE_C`
source, and an exact complete ROM.

Read [the canonical workflow](docs/WORKFLOW.md) before changing a target. It
explains target selection, activation, relocation review, iteration, and stop
conditions.

## Local prerequisites

The tracked contracts pin exact versions, hashes, flags, and host identities.
The normal matching setup needs:

- the Windows and Node.js host described by
  `config/phase7/conventional-build.json`;
- an authenticated Windows KMC GCC 2.7.2 `cc1.exe`;
- an authenticated Windows PowerShell runtime root;
- pinned Splat 0.34.0 Python, entry point, and source snapshot;
- asm-differ;
- the GNU Binutils 2.6/MSYS2 bundle under
  `.toolchains/gnu-binutils-2.6-mips-kmc-elf-msys2/`;
- the GCC 12.2 preprocessing bundle under
  `.toolchains/gcc-toolchain-mips64-win64/`; and
- for `match.js doctor` and candidate generation, m2c at the commit and tree in
  `config/matching-workbench.json` (normally `../tools/m2c`, or selected with
  `OB64_M2C_ROOT` or `--m2c-root`).

`config/local-tools.json` also selects an external `workRoot`; it must be outside
the repository. Every setting has an environment override listed in the example
file. `OB64_LOCAL_TOOLS` selects a different local configuration file.
`phase5aRoot` is needed only for structural audit work. `romInput` is optional
when the ROM is present in `baserom/`.

See [the toolchain reference](docs/TOOLCHAIN.md) for exact identities and the
reproducible GNU Binutils build. It documents authentication, not a complete
bootstrap installer.

## What counts as matching C

A function counts as matching C only when all of these are true:

1. The source-policy result is `PURE_C`.
2. The original assembly target is excluded and the C object is the sole linked
   owner.
3. Address, size, and reviewed load-relevant relocations satisfy the accepted
   contract.
4. The linked target bytes equal the baserom bytes.
5. The complete rebuilt ROM equals the baserom.

A `.c` file with inline assembly or another assembler escape hatch is
`HYBRID_C`. It may be exact, but it does not count as matching C. Read
[the source policy](docs/SOURCE_POLICY.md) for the mechanical classifications.
Run `node tools/status.js` for current generated counts; prose documentation is
not a status source.

Matching, structural, and semantic evidence remain separate. Exact machine code
does not prove a descriptive function name, field name, or gameplay explanation.

## Pick the right workflow

- **Ordinary matching:** keep the accepted owner, boundary, placement, linker
  rules, and pinned toolchain unchanged; follow
  [docs/WORKFLOW.md](docs/WORKFLOW.md).
- **Structural work:** boundaries, segments, overlays, executable extent,
  ownership, linker layout, and toolchain-contract changes require
  [docs/AUDIT.md](docs/AUDIT.md).
- **Semantic research:** establish names or behavior with evidence appropriate
  to the claim. Semantic uncertainty does not block a byte match.
- **Modified-game work:** preserve a known-exact retail baseline, then validate
  intentional differences with changed-byte, layout, and runtime tests.
- **Total Resolver work:** first read
  `tools/total_resolver/AGENTS.md`; Project64 is not required by the normal
  build or verifier.

## Main commands

| Command | Purpose |
| --- | --- |
| `node tools/build.js` | Build the current source tree and require an exact complete ROM. |
| `node tools/diff.js <symbol>` | Compile and link one active target; report instruction diagnostics and authoritative linked-byte equality. |
| `node tools/source_policy.js --target <symbol>` | Classify one active source; classification alone does not prove a match. |
| `node tools/verify.js --target <symbol> --require-pure` | Run the normal exact target, ownership, source-policy, and complete-ROM gate. |
| `node tools/verify.js` | Verify all active replacements and the complete ROM after integration. |
| `node tools/status.js` | Derive current exact-source counts from accepted generated state. |
| `node tools/test.js` | Run the required routine tooling regression manifest; this does not replace canonical verification. |
| `node tools/audit.js` | Run heavyweight structural verification for structural tasks. |

`tools/match.js` is an optional candidate-generation and diagnostic workbench.
Its exact-looking scratch results are never acceptance. See
[the matching workbench reference](docs/MATCHING_WORKBENCH.md) and
`node tools/match.js --help`.

## Repository hygiene

ROMs, rebuilt ROMs, objects, maps, compiler output, generated reports,
workbench databases, local toolchains, runtime captures, and machine-specific
configuration remain untracked. Routine generated output belongs under
`build/`, `dist/`, or `scratch/`.

Keep the clean-room boundary: external decompilations can supply leads to verify
independently, but do not copy their source expression, comments,
configuration, or documentation into this repository.

## Documentation map

Read only what the task needs:

1. [AGENTS.md](AGENTS.md) — durable project rules.
2. [docs/WORKFLOW.md](docs/WORKFLOW.md) — the normal matching loop.
3. [docs/SOURCE_POLICY.md](docs/SOURCE_POLICY.md) — source classifications.
4. [docs/NEXT_STEPS.md](docs/NEXT_STEPS.md) — active priorities.
5. The relevant subsystem, dossier, toolchain, or research document.

Useful optional references are
[docs/MATCHING_WORKBENCH.md](docs/MATCHING_WORKBENCH.md) for candidate research,
[docs/KMC_GCC_MATCHING_NOTES.md](docs/KMC_GCC_MATCHING_NOTES.md) for reproduced
compiler-matching observations, [tools/README.md](tools/README.md) for the tool
index, and
[the one-function agent prompt guide](docs/templates/matching-c-agent-prompt-guide.md)
for assigned matching work.
