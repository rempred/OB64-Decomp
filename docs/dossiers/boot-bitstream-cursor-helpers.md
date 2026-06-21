# Boot Bitstream Cursor Helpers Split

Date: 2026-06-21

## Scope

This dossier records a static source-layout split of the Rev 0 permanent boot
code after the resource-window cache helper:

| Source | ROM range | RAM range | Notes |
| --- | --- | --- | --- |
| `asm/original/rev0/boot/boot_bitstream_cursor_helpers.s` | `0x000043D4..0x000046F4` | `0x80073FD4..0x800742F4` | 800-byte prologue routine plus compact local bit cursor helpers. |
| `asm/original/rev0/code_000046F4_00011000.s` | `0x000046F4..0x00011000` | `0x800742F4..0x80080C00` | Historical next tracked remainder; superseded by `boot_bitstream_descriptor_decode.s` plus `code_00004894_00011000.s`. |

The name is a conservative source-layout label. The code clearly manages a
shared bit cursor / bitstream state, but this is not yet a verified runtime API
name.

## Static Evidence

- Parent `../scripts/ob64_functions.json` reports `0x43D4` as an 800-byte valid
  JAL-target prologue routine with frame size `0x18`, fixed start RAM
  `0x80073FD4`, and next function boundary at `0x46F4`.
- Parent `../scripts/ob64_callgraph_v2.json` reports high-confidence caller
  `0x22B0` to `0x43D4` and two unresolved calls to RAM `0x8008B820`.
- Parent `../scripts/ob64_symbols_v2.json` locates `0x43D4` at fixed RAM
  `0x80073FD4` in all seven named states and all 21 parent RAM snapshots.
- Xref evidence shows this split reads pointer table `0x800A8218` and reads or
  writes bit cursor globals `0x800AEFB0`, `0x800AEFB4`, `0x800AEFB8`,
  `0x800AEFBC`, and `0x800AEFC0`.
- The `0x43D4` prologue calls `0x8008B820(a0=1)`, walks seven entries from the
  table at `0x800A8218`, clears per-entry words at offsets `+0x2C`, `+0x30`,
  `+0x34`, `+0x38`, `+0x3C`, `+0x40`, and `+0x4C`, calls `0x8008B820` again,
  and returns.
- Local helper at `0x4450` initializes cursor globals:
  `0x800AEFB0=a0`, `0x800AEFB4=0`, `0x800AEFB8=0`, `0x800AEFBC=8`,
  `0x800AEFC0=0`.
- Local helper at `0x4480` reads one bit, pulling a new source byte from
  `[0x800AEFB0 + 0x800AEFB4]` when `0x800AEFB8` is exhausted.
- Local helper at `0x44F0` reads multiple bits into a return value.
- Local helper at `0x45A8` writes one bit to the cursor byte and flushes when
  the output bit count reaches zero.
- Local helper at `0x462C` writes multiple bits and flushes complete output
  bytes.

## Boundaries

- The split starts at parent function boundary `0x000043D4`, immediately after
  the resource-window cache helper's return delay slot at `0x43D0`.
- The compact no-label helpers after the `0x43D4` prologue return stay in this
  file because they share the same `0x800AEFB0..0x800AEFC0` cursor globals and
  form a contiguous cursor helper cluster.
- The split keeps the `0x46F0` delay slot with the `0x462C` helper and ends at
  exclusive `0x000046F4`.
- Parent data reports `0x46F4` as a separate 416-byte prologue function with
  high-confidence callers `0x42DC4` and `0x42F68`; that is the next active
  source split target.
- Follow-up split `boot_bitstream_descriptor_decode.s` now covers
  `0x000046F4..0x00004894`; the active remainder starts at `0x00004894`.

## Verification

After the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- Full `node tools\verify_setup.js` passed.
- The assembled report shows 1 tracked composite real-asm chunk made from 34
  tracked source files, plus 99 generated fallback chunks.
- The assembled code-region SHA256 remains
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- The rebuilt full-ROM SHA256 remains
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
