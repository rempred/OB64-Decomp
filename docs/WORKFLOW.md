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

For the current Rev 0 decomp loop, prefer static/offline evidence first:
ROM/disassembly/archive/savestate-file analysis, xrefs, call graphs, function
boundaries, jump-table scans, and exact rebuild checks. Use Project64 only when a
precise savestate already reaches the target, Joe is actively driving and asks
for passive watch/log support, or the task is specifically to create/catalog a
new savestate for later proof.

## Setup Gate

Before function splitting or C conversion, run:

```powershell
node tools/verify_setup.js
```

This is the canonical setup gate. It verifies Rev 0 identity, whole-ROM coverage,
GNU MIPS binutils smoke tests, first tracked chunk real assembly, raw rebuild,
and assembled-code rebuild.

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

Then run the assembly-backed code-region gate:

```powershell
node tools/assemble_original_mips.js
node tools/rebuild_rom.js --assembled-code build/assembled/rev0/code.bin --out dist/rebuilt.us_rev0.assembled-code.z64 --report build/rebuild/rev0-assembled-code-rebuild-report.json
```

This assembles tracked MIPS chunks with GNU `mips64-elf-as`, falls back to
generated `.word` chunks for ranges not yet promoted, and substitutes the
resulting binary blob for the raw code span. Manifest chunk `parts` are assembled
in order, so a promoted no-gap chunk can be split into named files without losing
coverage. Current expected result: 1 tracked composite real-asm chunk made from 72
tracked source files, plus 99 generated fallback chunks; the assembled
code-region SHA256 is
`40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`, and the
full rebuilt ROM remains byte-identical to the normalized Rev 0 baserom.

Then run the full-ROM source ownership audit:

```powershell
node tools/build_full_source_manifest.js
```

This verifies that the coverage ledger, segment manifest, original-MIPS report,
and assembled-code report agree. It assigns every ROM byte to one current source
strategy: `original_mips` for confirmed code-region bytes, or raw/header/archive/
audio/LZSS/tail/padding source ownership for non-code bytes. Archive gaps and
tail data remain explicitly ambiguous until repeatable scanners decode them.

Then generate and rebuild from source owners:

```powershell
node tools/extract_non_code_sources.js
node tools/rebuild_from_source_manifest.js
```

This verifies tracked non-code owner files under `data/source-owners/rev0/`,
writes ignored fallback owners under `build/source-owners/rev0/` for unpromoted
spans, then rebuilds the ROM from assembled original MIPS plus those owners. It
is the current proof path that non-code bytes are in the rebuild without being
labeled as understood MIPS.

After each loop, update `docs/DECOMP_LOG.md`. If that log approaches roughly
10,000 tokens, condense it and archive the previous full version under
`docs/archive/`.
