# OB64 Decomp

Dedicated clean-room decompilation workspace for *Ogre Battle 64: Person of
Lordly Caliber*, US Rev 0.

The project preserves the original MIPS owners while progressively replacing
accepted ranges with source. A function counts as matching C only when it is
`PURE_C`, is the sole linked owner of its accepted section, matches the retail
target bytes, and preserves the byte-identical complete ROM.

## Current commands

```text
node tools/build.js
node tools/diff.js <symbol>
node tools/verify.js [--target <symbol>] [--require-pure]
node tools/status.js
node tools/audit.js
```

`verify.js` is the normal acceptance gate. `audit.js` retains the heavier ROM,
coverage, overlay, source-ownership, and structural checks for foundational
changes. Run `status.js` for generated counts; this README does not duplicate
them.

The optional matching workbench prepares and compares research candidates,
remembers prior experiments, finds structural relatives and callsite context,
and ranks targets. It never promotes a function or replaces the canonical
linked/full-ROM gates:

```text
node tools/match.js --help
node tools/match.js doctor
node tools/match.js rank --lane leverage
node tools/match.js inspect <symbol>
node tools/match.js prepare <symbol> --variant structured
```

See `tools/README.md` for the complete bounded command surface and ruleset
ensemble behavior.

Total Resolver R3 is a separate research-tool surface. Ordinary querying agents
remain read-only and use the selected knowledge database without Project64:

```text
python -m tools.total_resolver doctor
python -m tools.total_resolver knowledge status
python -m tools.total_resolver knowledge verify
python -m tools.total_resolver session status
python -m tools.total_resolver explain func_00043d1c
python -m tools.total_resolver search --function 00043d1c
python -m tools.total_resolver coverage
```

Project64 is optional and remains outside the exact-ROM build path. See
`tools/total_resolver/AGENTS.md` before using the resolver, then
`tools/total_resolver/README.md` for the complete command reference. Capture, ingestion,
migration, database selection, and product-building commands are reserved for
an explicitly assigned database-building agent; capture additionally requires
Joe to say he is ready for that run.

## Local setup

Place a supported Rev 0 ROM under `baserom/` or configure `OB64_ROM_INPUT`.
Copy `config/local-tools.example.json` to the ignored
`config/local-tools.json` and provide the authenticated local compiler, Splat,
asm-differ, work-root, audit-evidence, and pinned PowerShell-runtime paths. The
PowerShell runtime root must contain `System32/WindowsPowerShell/v1.0/powershell.exe`
and its authenticated `System.Management.Automation.dll`; normal commands select
that copy without depending on the ambient Windows installation. Environment
variables listed by the example configuration may override those values.

ROM binaries, objects, maps, rebuilt ROMs, and generated reports are ignored
and must not be committed.

## Guidance

- `AGENTS.md` — durable project rules.
- `docs/WORKFLOW.md` — normal build, diff, and acceptance loop.
- `docs/SOURCE_POLICY.md` — `PURE_C`, `HYBRID_C`, `ASM`, and `UNKNOWN` rules.
- `docs/NEXT_STEPS.md` — active queue.
- `docs/TOOLCHAIN.md` — authenticated KMC/GNU production toolchain.
- `tools/README.md` — optional matching-workbench and repository-tool reference.
- `docs/AUDIT.md` — heavyweight structural verification.

Rev 1, future toolchain changes, segmentation changes, and native/static recomp
work remain separately scoped projects.
