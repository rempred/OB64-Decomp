# Boot Mode/Message Accumulator Split

Date: 2026-06-21

## Scope

This dossier records a static source-layout split of the Rev 0 permanent boot
code after the table/mask reconcile routine:

| Source | ROM range | RAM range | Notes |
| --- | --- | --- | --- |
| `asm/original/rev0/boot/boot_mode_message_accumulator_update.s` | `0x0000347C..0x0000368C` | `0x8007307C..0x8007328C` | Keeps parent secondary entry `0x3564` with the primary entry. |
| `asm/original/rev0/code_0000368C_00011000.s` | `0x0000368C..0x00011000` | `0x8007328C..0x80080C00` | Superseded by the resource-buffer reset split. |

The name is a conservative source-layout label, not a final C API name.

## Static Evidence

- Parent `../scripts/ob64_functions.json` reports `0x347C` as a 528-byte
  prologue routine, frame size `0x20`, no indirect jumps, no direct static
  callers, and a secondary entry at `0x3564`.
- Parent `../scripts/ob64_callgraph_v2.json` reports high-confidence callees
  `0x800955C0` (`ROM 0x259C0`), `0x80095610` (`ROM 0x25A10`), and
  `0x800957D0` (`ROM 0x25BD0`), plus one unresolved JAL target at RAM
  `0x8016CD3C`.
- Parent `../scripts/ob64_symbols_v2.json` locates the routine at fixed RAM
  `0x8007307C` in world map, army management, class-change transition, mission
  briefing, scenario, combat transition, and combat states.
- The primary entry stores `[a0+0xC]` to `0x800C4BB8`, calls unresolved target
  `0x8016CD3C`, then uses the low return byte and `0x80000300` to select one
  of four computed pointer-table addresses:
  `0x800AB9B0`, `0x800ABA50`, `0x800AB960`, or `0x800ABA00`.
- After table selection, the primary entry calls `0x800955C0`; if the low
  return byte from the unresolved helper is nonzero, it calls `0x80095610` with
  argument `0x5A`; it then calls `0x800957D0` with `[a0+0xC]`.
- The secondary entry at `0x3564` accepts six halfword-like values from
  `a1/a2/a3/sp+0x10/sp+0x14/sp+0x18`. With mode `a0 == 0`, nonnegative values
  overwrite six globals. With mode `a0 != 0`, the same inputs are added to the
  existing globals.
- The six halfword globals are `0x800C4C08`, `0x800E7D68`, `0x800C4A18`,
  `0x800E7A1C`, `0x800C4BCA`, and `0x800C4AD8`; both paths finish by writing
  byte flag `0x800AEE72 = 2`.

## Boundaries

- The split starts at parent function boundary `0x0000347C`.
- The parent end marker is `0x00003688`; the branch delay slot at `0x3688`
  belongs to this routine, so the source split ends at exclusive `0x0000368C`.
- The next routine starts at `0x0000368C`, has secondary entries at `0x377C` and
  `0x378C`, and was later split intact as
  `boot_resource_buffer_reset_flags.s`.

## Verification

After the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- Full `node tools\verify_setup.js` passed.
- The assembled code-region SHA256 remains
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- The rebuilt full-ROM SHA256 remains
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
