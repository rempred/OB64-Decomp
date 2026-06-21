# Boot Bitstream Descriptor Encode Split

Date: 2026-06-21

## Scope

This dossier records a static source-layout split of the Rev 0 permanent boot
code after the bitstream descriptor decode helper:

| Source | ROM range | RAM range | Notes |
| --- | --- | --- | --- |
| `asm/original/rev0/boot/boot_bitstream_descriptor_encode.s` | `0x00004894..0x00004AC8` | `0x80074494..0x800746C8` | Overlapping `0x4894` leaf / `0x48C8` prologue pair plus trailing no-target return stub. |
| `asm/original/rev0/code_00004AC8_00011000.s` | `0x00004AC8..0x00011000` | `0x800746C8..0x80080C00` | Historical next tracked remainder; superseded by the resource-probe splits through `boot_resource_probe_indexed_record_check.s` and `code_00005978_00011000.s`. |

The name is conservative. The routine appears to pack descriptor-selected bytes
into a shared bit cursor, but the exact data format is not yet verified.

## Static Evidence

- Parent `../scripts/ob64_functions.json` reports `0x4894` as a 548-byte valid
  JAL-target leaf and `0x48C8` as an overlapping 496-byte valid prologue with
  frame size `0x8`.
- Parent `../scripts/ob64_callgraph_v2.json` reports high-confidence callers
  `0x42E64` and `0x43000` to `0x4894`, no direct callers to `0x48C8`, no
  callees, and no unresolved targets for the pair.
- Parent `../scripts/ob64_symbols_v2.json` locates both entries at fixed RAM
  `0x80074494` / `0x800744C8` in all seven named states and all 21 parent RAM
  snapshots.
- Xref evidence shows the pair reads or writes the shared bit cursor globals
  `0x800AEFB0`, `0x800AEFB4`, `0x800AEFB8`, `0x800AEFBC`, and `0x800AEFC0`.
- Static code shape: the `0x4894` prefix initializes the shared cursor from
  `a0`. If the first descriptor row pointer is zero, the branch at `0x48C4`
  jumps to the final flush path at `0x4A1C`.
- `0x48C8` is both a scanner prologue and the delay-slot instruction for the
  `0x48C4` branch, so the prefix and prologue are one physical source unit.
- The prologue body walks descriptor rows from `a1`, reads source bytes from
  row-base plus descriptor offsets, and packs variable-width fields into the
  cursor byte, flushing complete bytes to `[0x800AEFB0 + 0x800AEFB4]`.
- The final path flushes a partial byte when `0x800AEFBC <= 7`.

## Boundaries

- The split starts at parent JAL-target leaf boundary `0x00004894`, immediately
  after the previous decode helper's return delay slot at `0x4890`.
- The split keeps `0x4894` and `0x48C8` together because `0x48C8` is the delay
  slot for the branch at `0x48C4`; splitting them would hide executable
  branch-delay behavior.
- The scanner-sized body ends after the `jr ra` delay slot at `0x4AB4`.
- No parent function, symbol, or callgraph evidence reported a direct target to
  `0x4AC0`. The trailing `0x4AB8..0x4AC4` nop/nop/return/nop shape is kept with
  this file as local return/padding until stronger evidence says otherwise.
- The active remainder at this step started at the next parent prologue boundary
  `0x00004AC8`; follow-up splits now cover `0x00004AC8..0x00005978`, so the
  active remainder starts at `0x00005978`.

## Verification

After the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- Full `node tools\verify_setup.js` passed.
- The assembled report shows 1 tracked composite real-asm chunk made from 36
  tracked source files, plus 99 generated fallback chunks.
- The assembled code-region SHA256 remains
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- The rebuilt full-ROM SHA256 remains
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
