# tools

Repo-local decomp tools belong here.

Initial expected tools:

- ROM byte-order normalization.
- Rev 0 extraction from `config/segments/rev0.yaml`.
- Original MIPS disassembly emission into `asm/original/`.
- Build and compare helpers.
- Function dossier import from the parent workspace.

Tools should be deterministic and should not require ROM binaries to be tracked.

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
node tests/binutils_smoke.js
```

Verifies the project-local GNU MIPS binutils toolchain configured in
`config/toolchain.json`: `.word` big-endian output, real MIPS instruction output,
`.set noreorder` delay-slot behavior, and the first tracked chunk through
`mips64-elf-as`.
