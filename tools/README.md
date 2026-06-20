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
