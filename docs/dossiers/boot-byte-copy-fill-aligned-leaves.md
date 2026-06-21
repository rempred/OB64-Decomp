# Boot Byte Copy/Fill Aligned Leaves Split

Date: 2026-06-21

## Scope

This dossier records a static source-layout split of the two no-frame memory
utility leaves immediately before the parent-labeled LZSS decompressor:

| Source | ROM range | RAM range | Notes |
| --- | --- | --- | --- |
| `asm/original/rev0/boot/boot_byte_copy_aligned_leaf.s` | `0x0000A370..0x0000A470` | `0x80079F70..0x8007A070` | Copy-like leaf that returns original `a0`. |
| `asm/original/rev0/boot/boot_byte_fill_aligned_leaf.s` | `0x0000A470..0x0000A510` | `0x8007A070..0x8007A110` | Fill-like leaf that returns original `a0`. |
| `asm/original/rev0/code_0000A510_00011000.s` | `0x0000A510..0x00011000` | `0x8007A110..0x80080C00` | Current tracked remainder; starts with parent `seed::lzss_decompress`. |

The names are conservative source-layout labels. They describe static copy/fill
shape only; final C library/API names are not verified.

## Static Evidence

- Parent function data does not list formal starts at `0xA370` or `0xA470`.
- Parent symbol/callgraph data does not list callers for `0xA370` or `0xA470`
  as independent function starts.
- Local source shows both helpers are standalone leaves with no stack frame, no
  calls, no external branches, and normal `jr ra` returns.
- Both helpers return original `a0` through the `jr ra` delay slot.
- Parent function/symbol data marks `0xA510` as the next formal function:
  `seed::lzss_decompress`, size `0xA6C` / 2,668 bytes, frame size `0x28`, RAM
  `0x8007A110`, fixed in all states, with a secondary entry at `0xABE0`.
- Parent `docs/rom-layout.md` documents the LZSS token format from the
  `0xA510` decompressor, confirming the next remainder has known semantic
  leads but belongs in a separate split.

## Static Shape

- `0xA370..0xA470` accepts destination `a0`, source `a1`, and byte count `a2`.
- It returns immediately when `a2 == 0`.
- It handles source/destination alignment with byte and halfword copies before a
  word-copy loop.
- It writes trailing halfword/byte fragments after the word loop and returns
  original `a0`.
- `0xA470..0xA510` accepts destination `a0`, fill byte/value `a1`, and byte
  count `a2`.
- It masks `a1` to one byte, expands it into all four bytes of a word, handles
  leading/trailing alignment fragments, loops on word stores, and returns
  original `a0`.

## Boundaries

- The split starts at `0x0000A370`, immediately after the key/field-clear
  split's two zero padding words at `0xA368..0xA370`.
- The copy-like leaf includes its `jr ra` at `0xA468` and delay-slot return
  value move at `0xA46C`.
- The fill-like leaf starts at `0x0000A470`, includes its `jr ra` at `0xA508`
  and delay-slot return value move at `0xA50C`.
- The next helper starts at `0x0000A510` and is the parent-labeled LZSS
  decompressor. Keep that full parent range together in the next source split.

## Verification

After the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- Full `node tools\verify_setup.js` passed.
- The assembled report shows 1 tracked composite real-asm chunk made from 99
  tracked source files, plus 99 generated fallback chunks.
- The assembled code-region SHA256 remains
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- The rebuilt full-ROM SHA256 remains
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
