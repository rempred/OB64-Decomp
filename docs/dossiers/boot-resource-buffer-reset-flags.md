# Boot Resource-Buffer Reset/Flag Split

Date: 2026-06-21

## Scope

This dossier records a static source-layout split of the Rev 0 permanent boot
code after the boot mode/message accumulator update:

| Source | ROM range | RAM range | Notes |
| --- | --- | --- | --- |
| `asm/original/rev0/boot/boot_resource_buffer_reset_flags.s` | `0x0000368C..0x00003798` | `0x8007328C..0x80073398` | Keeps secondary entries `0x377C/0x378C` with the parent routine. |
| `asm/original/rev0/code_00003798_00011000.s` | `0x00003798..0x00011000` | `0x80073398..0x80080C00` | Superseded by the later resource state reset split. |

The name is a conservative source-layout label, not a final C API name.

## Static Evidence

- Parent `../scripts/ob64_functions.json` reports `0x368C` as a 268-byte
  prologue routine, frame size `0x20`, no indirect jumps, and secondary entries
  at `0x377C` and `0x378C`.
- Parent `../scripts/ob64_callgraph_v2.json` reports one high-confidence caller
  at `0x3798`, six high-confidence static call sites to `resource_free`
  (`0x800712C4`, ROM `0x16C4`), and one high-confidence call to helper
  `0x80093380` (`ROM 0x23780`).
- Parent `../scripts/ob64_symbols_v2.json` locates the routine at fixed RAM
  `0x8007328C` in world map, army management, class-change transition, mission
  briefing, scenario, combat transition, and combat states.
- The primary entry walks two rows with stride `0x18` from computed base
  `0x800A81C0`, using the six static `resource_free` call sites for row pointer
  fields at offsets `+0/+4/+8/+0xC/+0x10/+0x14`.
- It clears the six accumulator halfwords `0x800C4C08`, `0x800E7D68`,
  `0x800C4A18`, `0x800E7A1C`, `0x800C4BCA`, and `0x800C4AD8`, then writes
  byte flag `0x800AEE72 = 2`.
- It calls `0x80093380` with `a0 = 0x800A81C0` and `a1 = 0x30`, then clears
  byte `0x800A81F0`.
- Secondary entry `0x377C` writes `0x800A8213 = 1`; secondary entry `0x378C`
  returns byte `0x800A8213`.

## Parent-Doc Caveat

Parent `docs/enemy-system.md` has used the `0x800A81C0+` resource-buffer row as
a lead while studying live EDAT buffers. The same doc later retracts
EDAT-specific conclusions for shared slot `0x800A81C8`, noting it is a
shared/multiplexed current-buffer register. This split therefore avoids an
EDAT-specific semantic name.

## Boundaries

- The split starts at parent function boundary `0x0000368C`.
- The parent end marker is `0x00003794`; the branch delay slot at `0x3794`
  belongs to this routine, so the source split ends at exclusive `0x00003798`.
- The next routine starts at `0x00003798`; it was later split as
  `boot_resource_state_reset.s`.
- After that, parent symbols report an overlapping `0x37F8/0x3808` cluster that
  should stay together unless stronger evidence proves a safer split.

## Verification

After the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- Full `node tools\verify_setup.js` passed.
- The assembled code-region SHA256 remains
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- The rebuilt full-ROM SHA256 remains
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
