# Boot Display-List Finalize/Flip Split

Date: 2026-06-21

## Scope

This dossier records a static source-layout split of the Rev 0 permanent boot
code after the display-list state emit helper:

| Source | ROM range | RAM range | Notes |
| --- | --- | --- | --- |
| `asm/original/rev0/boot/boot_display_list_finalize_flip.s` | `0x00003EE4..0x00003FD0` | `0x80073AE4..0x80073BD0` | 236-byte prologue routine called by the early boot state loop. |
| `asm/original/rev0/code_00003FD0_00011000.s` | `0x00003FD0..0x00011000` | `0x80073BD0..0x80080C00` | Next tracked remainder. |

The name is a conservative source-layout label based on static display-list
finalization and active-buffer flag toggling, not a verified renderer API name.

## Static Evidence

- Parent `../scripts/ob64_functions.json` reports `0x3EE4` as a 236-byte
  prologue function with frame size `0x18`, `jr ra`, no `jalr`, no indirect
  jump, and no secondary entries. The next parent prologue starts at
  `0x00003FD0`.
- Parent `../scripts/ob64_callgraph_v2.json` reports high-confidence caller
  `0x27A0`, one high-confidence callee edge to local helper `0x4048`, and one
  high-confidence callee edge to permanent helper `0x80089804` (`0x00019C04`).
- Parent `../scripts/ob64_symbols_v2.json` locates the routine at fixed RAM
  `0x80073AE4` in all seven named states and all 21 RAM snapshots.
- Xref scan shows read/write access to byte `0x800A81F0`, write access to byte
  `0x800A8213`, reads from `0x800C4808` and `0x800E9BE0`, and read/write
  traffic through shared display-list cursor `0x800E9BA0` / `0x800F9BA0`.
- The static write set covers packet words at `0x800F0000..0x800F0024`,
  matching the same display-list packet area used by the preceding helpers.
- Static code shape: call `0x4048` first, then append two `DE00` display-list
  links pointing at `0x801869C8` and `0x80186E70`, followed by `E700`, `E900`,
  and `DF00` commands. The routine computes the emitted byte span from
  selected-row field `+0x14` to the updated cursor, rounds it down to an
  8-byte multiple, and calls `0x80089804(a0=start, a1=span, a2=0x800C4808,
  a3=1)`.
- After the helper call, it clears pending/display-list flag `0x800A8213` and
  toggles byte `0x800A81F0` with `xori 1`.

## Boundaries

- The split starts at parent function boundary `0x00003EE4`, immediately after
  the previous helper's `jr ra` delay slot at `0x3EE0`.
- The split ends at exclusive `0x00003FD0`, immediately before the next parent
  prologue. Parent data reports `0x3FD0` as a separate 120-byte prologue
  function called by `0x27A0`.
- No secondary entries were reported inside `0x3EE4..0x3FD0`, and the only
  branch target observed in this routine is the final epilogue block.

## Verification

After the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- Full `node tools\verify_setup.js` passed.
- The assembled report shows 1 tracked composite real-asm chunk made from 29
  tracked source files, plus 99 generated fallback chunks.
- The assembled code-region SHA256 remains
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- The rebuilt full-ROM SHA256 remains
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
