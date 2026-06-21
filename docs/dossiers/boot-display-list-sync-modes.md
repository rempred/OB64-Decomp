# Boot Display-List Sync/Modes Split

Date: 2026-06-21

## Scope

This dossier records a static source-layout split of the Rev 0 permanent boot
code after the display-list finalize/flip helper:

| Source | ROM range | RAM range | Notes |
| --- | --- | --- | --- |
| `asm/original/rev0/boot/boot_display_list_sync_modes.s` | `0x00003FD0..0x00004048` | `0x80073BD0..0x80073C48` | 120-byte prologue routine called by the early boot state loop. |
| `asm/original/rev0/code_00004048_00011000.s` | `0x00004048..0x00011000` | `0x80073C48..0x80080C00` | Former next tracked remainder; superseded by the display-list counter-step split. |

The name is a conservative source-layout label based on static display-list
sync and RDP mode command emission, not a verified renderer API name.

## Static Evidence

- Parent `../scripts/ob64_functions.json` reports `0x3FD0` as a 120-byte
  prologue function with frame size `0x18`, `jr ra`, no `jalr`, no indirect
  jump, and no secondary entries. The next parent candidate starts at
  `0x00004048`.
- Parent `../scripts/ob64_callgraph_v2.json` reports high-confidence caller
  `0x27A0` and one high-confidence callee edge to permanent helper
  `0x80095610` (`0x00025A10`).
- Parent `../scripts/ob64_symbols_v2.json` locates the routine at fixed RAM
  `0x80073BD0` in all seven named states and all 21 RAM snapshots.
- Xref scan shows read/write traffic through shared display-list cursor
  `0x800E9BA0` / `0x800F9BA0` and writes to packet words
  `0x800F0000..0x800F0014`.
- Static code shape: call `0x80095610` with `a0=0x5A`, then append three
  display-list packet slots through the cursor:
  `E700 00000000`, `E3001801 00000000`, and `E3001A01 00000030`.

## Boundaries

- The split starts at parent function boundary `0x00003FD0`, immediately after
  the previous helper's `jr ra` delay slot at `0x3FCC`.
- The split ends at exclusive `0x00004048`, immediately before the next parent
  candidate. Parent data reports a 104-byte leaf entry at `0x4048` and an
  overlapping 96-byte prologue entry at `0x4050`; those entries remain together
  in the next tracked remainder until their relationship is documented.
- No secondary entries were reported inside `0x3FD0..0x4048`, and no local
  branch targets were observed inside the routine.

## Verification

After the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- Full `node tools\verify_setup.js` passed.
- The assembled report shows 1 tracked composite real-asm chunk made from 30
  tracked source files, plus 99 generated fallback chunks.
- The assembled code-region SHA256 remains
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- The rebuilt full-ROM SHA256 remains
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

Follow-up split:

- `asm/original/rev0/code_00004048_00011000.s` was later split into
  `asm/original/rev0/boot/boot_display_list_counter_step.s`
  (`0x00004048..0x000040B0`) and
  `asm/original/rev0/code_000040B0_00011000.s`.
