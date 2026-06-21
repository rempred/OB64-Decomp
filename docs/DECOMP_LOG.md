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
