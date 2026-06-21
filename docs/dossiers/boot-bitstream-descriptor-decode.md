# Boot Bitstream Descriptor Decode Split

Date: 2026-06-21

## Scope

This dossier records a static source-layout split of the Rev 0 permanent boot
code after the bitstream cursor helper cluster:

| Source | ROM range | RAM range | Notes |
| --- | --- | --- | --- |
| `asm/original/rev0/boot/boot_bitstream_descriptor_decode.s` | `0x000046F4..0x00004894` | `0x800742F4..0x80074494` | 416-byte prologue routine that decodes descriptor-driven bitstream fields. |
| `asm/original/rev0/code_00004894_00011000.s` | `0x00004894..0x00011000` | `0x80074494..0x80080C00` | Historical next tracked remainder; superseded by `boot_bitstream_descriptor_encode.s` plus `code_00004AC8_00011000.s`. |

The name is conservative. The routine uses the shared bit cursor globals and
descriptor-like rows, but the exact compression/data format is not yet verified.

## Static Evidence

- Parent `../scripts/ob64_functions.json` reports `0x46F4` as a 416-byte valid
  JAL-target prologue routine with frame size `0x10`.
- Parent `../scripts/ob64_callgraph_v2.json` reports high-confidence callers
  `0x42DC4` and `0x42F68`, no callees, and no unresolved targets.
- Parent `../scripts/ob64_symbols_v2.json` locates `0x46F4` at fixed RAM
  `0x800742F4` in all seven named states and all 21 parent RAM snapshots.
- Xref evidence shows reads/writes to bit cursor globals `0x800AEFB0`,
  `0x800AEFB4`, `0x800AEFB8`, `0x800AEFBC`, and `0x800AEFC0`. These globals
  are shared with the previous `0x43D4` cursor helper cluster and the following
  `0x4894` / `0x48C8` helper pair.
- Static code shape: entry stores `a0` to `0x800AEFB0`, clears cursor counters
  `0x800AEFB4` and `0x800AEFB8`, sets output bit count `0x800AEFBC = 8`, and
  clears `0x800AEFC0`.
- The outer loop walks rows from `a1` until the row's first word is zero. The
  row uses word fields at `+0x0`, `+0x4`, `+0x8`, and `+0xC` as base, stride,
  record pointer, and count-like inputs.
- The inner loop reads compact 3-byte records, consumes variable-width values
  from the shared bit cursor, handles a high-bit signed/fill case, and writes
  decoded bytes at row-base plus per-record offsets.

## Boundaries

- The split starts at parent function boundary `0x000046F4`, immediately after
  the previous helper's `jr ra` delay slot at `0x46F0`.
- The split ends at exclusive `0x00004894`, after the `0x46F4` routine's `jr ra`
  delay slot at `0x4890`.
- Parent data marks `0x4894` as a JAL-target leaf and `0x48C8` as an
  overlapping prologue. The instruction at `0x48C8` is also the branch delay
  slot for the `0x48C4` branch in the `0x4894` leaf prefix, so those entries
  should stay together in the next split.
- The next audit should also account for the trailing `0x4AB8..0x4AC4`
  return/padding shape before the following `0x4AC8` prologue boundary.
- Follow-up split `boot_bitstream_descriptor_encode.s` now covers
  `0x00004894..0x00004AC8`; the active remainder starts at `0x00004AC8`.

## Verification

After the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- Full `node tools\verify_setup.js` passed.
- The assembled report shows 1 tracked composite real-asm chunk made from 35
  tracked source files, plus 99 generated fallback chunks.
- The assembled code-region SHA256 remains
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- The rebuilt full-ROM SHA256 remains
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
