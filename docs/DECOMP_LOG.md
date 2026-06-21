# Decomp Log

This is the running memory file for the nested Rev 0 decomp repo. Keep it short
enough for future agents to read every session. When it approaches roughly
10,000 tokens, condense the current state here and archive the previous full log
under `docs/archive/`.

## 2026-06-21 - Loop 1, Boot Entry Split

Target:

- ROM `0x00001000..0x00001060`.
- RAM `0x80070C00..0x80070C60`.
- Named source: `asm/original/rev0/boot/boot_entry_clear_bss.s`.
- Dossier: `docs/dossiers/boot-entry-clear-bss.md`.

Baseline:

- `node tools\verify_setup.js` passed before edits.
- Rev 0 CRC `E6419BC5/69011DE3`.
- Coverage ledger: 825 archives, zero unknown bytes, 108 visible overlap bytes.
- Code-region SHA256:
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- Full ROM SHA256:
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

Source-layout change:

- The tracked first chunk `0x00001000..0x00011000` is now represented by
  ordered manifest parts.
- Part 1: `boot_entry_clear_bss_and_jump`,
  `asm/original/rev0/boot/boot_entry_clear_bss.s`,
  `0x00001000..0x00001060`, 96 bytes.
- Part 2: `code_00001060_00011000_remainder`,
  `asm/original/rev0/code_00001060_00011000.s`,
  `0x00001060..0x00011000`, 65,440 bytes.

Tooling change:

- `tools/assemble_original_mips.js` now understands `manifest.json` chunk
  `parts`, assembles each tracked part through GNU MIPS binutils, verifies each
  part size, then concatenates them back into the original no-gap chunk.
- `tests/binutils_smoke.js` now verifies all parts of the first tracked chunk,
  not just a single monolithic source file.

Static findings:

- ROM header entry point is `0x80070C00`.
- The early boot mapping gives ROM `0x00001000` -> RAM `0x80070C00`.
- The stub clears `0x3AE70` bytes from `0x800AEDB0` through exclusive end
  `0x800E9C20`.
- The stub sets `sp = 0x800C6D60` in a branch delay slot and jumps to
  `0x8007F880`.
- There is no stack frame and no `jal` call in the target range.

Verification:

- `node tests\binutils_smoke.js` passed after the split.
- `node tools\assemble_original_mips.js` passed after the split.
- Full `node tools\verify_setup.js` passed after the split.
- Final source mix: 1 tracked real-asm chunk, represented as 1 manifest
  composite with 2 tracked source files, plus 99 generated fallback chunks.
- Final code-region SHA256:
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- Final full-ROM SHA256:
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

## 2026-06-21 - Phase 2, Full-ROM Source Manifest

Target:

- Expand from code-region original-MIPS proof toward full-ROM no-gap source
  ownership.
- Keep non-code bytes represented as raw/archive/compressed/audio/padding source
  strategies instead of disassembling data as instructions.

Baseline:

- `node tools\verify_setup.js` passed before edits.
- Baseline source mix stayed 1 tracked composite real-asm chunk, 2 tracked source
  files, and 99 generated fallback chunks.
- Baseline code SHA256:
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- Baseline full-ROM SHA256:
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

Tooling change:

- Added `tools/build_full_source_manifest.js`.
- `tools/verify_setup.js` now runs that tool and requires
  `fullSourceManifestNoGap` plus `fullSourceManifestNoUnknownBytes`.
- Generated reports are ignored:
  `build/source-manifest/rev0-full-source-manifest.json/.md`.

Current source ownership:

- Entries: 1,059 contiguous ROM spans.
- ROM bytes covered: 41,943,040 / 41,943,040.
- Unknown bytes: 0.
- `original_mips`: 6,510,444 bytes.
- Non-code/raw/data/archive source forms: 35,432,596 bytes.
- Ambiguous bytes preserved explicitly: 2,469,141.

Source-form byte totals:

- `raw_header`: 4,096.
- `original_mips`: 6,510,444.
- `raw_structural_gap`: 24.
- `lha_archive`: 5,041,336.
- `raw_archive_gap`: 2,429,124.
- `raw_audio_data`: 20,065,069.
- `raw_lzss_region`: 7,188,782.
- `raw_tail_data`: 39,909.
- `padding_ff`: 664,256.

Code-bearing evidence:

- Configured code region remains `0x00001000..0x0063676C`.
- Parent function DB count: 3,683.
- Parent overlay source hints from `../ram_snapshots/overlay_sources.json` are
  recorded in the generated manifest and all sit inside the configured code
  region.

Open ambiguities:

- 524 `raw_archive_gap` spans / 2,429,124 bytes.
- Known 108-byte archive/audio overlap.
- `raw_tail_data` at `0x0275415B..0x0275DD40`.

Next recommended target:

- Add a non-code source generator under `data/bin/`, `data/archives/`, or
  `assets/`, then teach the rebuild path to consume the full source manifest
  rather than only `build/segments/rev0/raw/`.
