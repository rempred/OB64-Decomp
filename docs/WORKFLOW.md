# Decomp Workflow

The working loop is:

1. Choose a Rev 0 subsystem or function.
2. Generate or update a static dossier from parent MIPS artifacts.
3. Use overlay-aware addresses before interpreting any runtime RAM target.
4. Trace only narrowed questions with Project64 execute/read/write watches.
5. Ingest trace results into names, structs, jump tables, and m2c context.
6. Replace nonmatching assembly with C only when compare evidence supports it.
7. Promote semantic claims only after runtime trace or controlled mutation proof.

The parent workspace document `docs/mips-decomp-workflow-plan.md` is the
canonical process reference until this repo has its own full toolchain.

## No-Gap Rule

The decomp can tolerate incomplete names, incomplete C, and imperfect function
boundaries. It cannot tolerate missing bytes.

Early extraction must therefore preserve every byte in each configured ROM
segment. For the current Rev 0 code region, `tools/extract_original_mips.js`
emits every 4-byte word as `.word` plus a decode comment. That means a missed
leaf function, jump-table target, or embedded data record does not disappear
from the rebuild path.

Later passes can split this no-gap reference into functions, rodata, binary data,
and C. The compare loop should only get stricter over time.

## Current Tool Loop

```powershell
node tools/verify_baserom.js
node tools/extract_original_mips.js
```

Expected first-pass result:

- Rev 0 header/CRC/game ID/version checks pass.
- `build/baserom.us_rev0.z64` is written as canonical z64.
- `build/original-mips/rev0/` contains chunked original assembly reference.
- `build/original-mips/rev0-report.json` reports 100% coverage for
  `config/roms/us_rev0.json` `codeRegion`.

Then run:

```powershell
node tools/build_rom_coverage_ledger.js
```

The coverage ledger is the whole-ROM safety check. It does not prove every byte's
semantics, but it proves every byte is at least structurally tagged or called out
as padding/unknown before we build a linker plan.

Because prior archive scans missed whole sections, this ledger must not trust the
parent archive catalog by itself. It performs an independent LHA header scan,
compares count and offsets against the parent catalog, records rejected
method-like signatures, and reports overlaps rather than hiding them.

Then run:

```powershell
node tools/extract_rom_segments.js
node tools/rebuild_rom.js
```

This is the first exact rebuild loop. It extracts the ledger's non-overlapping
spans as raw files, concatenates them back into `dist/rebuilt.us_rev0.z64`, and
fails unless the rebuilt ROM is byte-identical to `build/baserom.us_rev0.z64`.
