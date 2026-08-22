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

Total Resolver R3 is a separate research-tool surface; Phases 0-9 are implemented and the manual
gameplay coverage phase is ready to begin:

```text
python -m tools.total_resolver doctor
python -m tools.total_resolver pj64 health
python -m tools.total_resolver session start --port 64656
python -m tools.total_resolver resolver verify build/total-resolver/products/resolver-r3
python -m tools.total_resolver explain func_00043d1c
python -m tools.total_resolver coverage
```

Project64 is optional and remains outside the exact-ROM build path. See
`tools/total_resolver/README.md` for the bridge, capture, resolver, and live-bundle commands.

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
- `docs/AUDIT.md` — heavyweight structural verification.

Rev 1, toolchain upgrades, segmentation changes, and native/static recomp work
remain separate projects.
