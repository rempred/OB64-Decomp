# Boot LZSS Decompress Split

Date: 2026-06-21

## Scope

This dossier records a static source-layout split of the parent-labeled LZSS
decompressor:

| Source | ROM range | RAM range | Notes |
| --- | --- | --- | --- |
| `asm/original/rev0/boot/boot_lzss_decompress.s` | `0x0000A510..0x0000AF7C` | `0x8007A110..0x8007AB7C` | Parent `seed::lzss_decompress`; includes secondary/internal helper-like regions kept by parent boundary evidence. |
| `asm/original/rev0/code_0000AF7C_00011000.s` | `0x0000AF7C..0x00011000` | `0x8007AB7C..0x80080C00` | Remainder at this split; now superseded by `boot_resource_record_mark_ready.s` and `code_0000AFAC_00011000.s`. |

The file name is a conservative source-layout label inherited from parent seed
symbols and token-format research. It should not be treated as a finalized C
API signature.

## Static Evidence

- Parent function data reports `0xA510` as a prologue function with size
  `0xA6C` / 2,668 bytes, frame size `0x28`, `jr ra` epilogues, and secondary
  entry `0xABE0` / RAM `0x8007A7E0`.
- Parent symbols label `0xA510` as `seed::lzss_decompress` with confidence `1`
  and `dma/resource::resource loader` as an additional domain hint.
- Parent runtime-signature data finds this function at RAM `0x8007A110` in all
  seven named states and all 21 RAM snapshots.
- Parent callgraph data records high-confidence callers including
  `0x9EFC` (resource-node LZSS context materialize), `0xB030`, `0x2E138`,
  `0x2E240`, `0x2E348`, `0x492A0`, `0x4ED60`, `0xED530`, and many later
  overlay/resource callers.
- Parent `docs/overlay-system.md` explicitly lists the LZSS decompressor as a
  permanent boot-region function where `RAM = ROM + 0x8006FC00` is valid.
- Parent `docs/rom-layout.md` records the LZSS token format from the MIPS
  decompressor at ROM `0xA510`.

## Static Shape

- The primary entry saves `s0/s1/ra`, stores destination in `s1`, stores source
  in `s0`, and calls the secondary entry at `0xABE0` to read a 4-byte
  decompressed-length header from the compressed source.
- It advances the source pointer by four bytes and decodes until the output
  byte count reaches the header length.
- Token branches match the parent token-format note:
  short back-references (`0x80..0xFF`), literal runs (`0x40..0x7F`), zero-fill
  (`0x20..0x3F`), extended back-references (`0x10..0x1F`), super
  back-references (`0x00`), `0xFF` fill (`0x01`), `0x00` fill (`0x02`), and
  skip/NOP opcodes (`0x03..0x0F`).
- Copy and fill paths use alignment-aware byte, halfword, and word loops before
  returning the decompressed byte count.
- The secondary entry at `0xABE0` reads four bytes from `a0` as a big-endian
  32-bit value and returns it.
- The local source also contains helper-like internal regions after the main
  epilogue at `0xAB28..0xABDC`, including a table/descriptor-shaped path
  starting at `0xAC0C` and a short value-reader at `0xAF30..0xAF78`. These are
  kept in the LZSS source file because parent function data sizes the
  `0xA510` function through exclusive end `0xAF7C`.

## Boundaries

- The split starts at `0x0000A510`, immediately after
  `boot_byte_fill_aligned_leaf.s`.
- The primary decompressor epilogue is at `0xABC8..0xABDC`, ending with
  `jr ra` and stack restore.
- The secondary length-reader helper at `0xABE0..0xAC08` stays in this file.
- The helper-like tail includes `jr ra` returns at `0xAF28..0xAF2C` and
  `0xAF74..0xAF78`.
- The next formal prologue starts at `0x0000AF7C`; that former remainder
  frontier has since been split into `boot_resource_record_mark_ready.s`.

## Verification

After the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- Full `node tools\verify_setup.js` passed.
- The assembled report shows 1 tracked composite real-asm chunk made from 100
  tracked source files, plus 99 generated fallback chunks.
- The assembled code-region SHA256 remains
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- The rebuilt full-ROM SHA256 remains
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
