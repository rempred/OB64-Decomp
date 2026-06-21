# Boot State Global Reset Split

Date: 2026-06-21

## Scope

This dossier records a static source-layout split of the Rev 0 permanent boot
helper immediately after the resource table/mask apply cluster:

| Source | ROM range | RAM range | Notes |
| --- | --- | --- | --- |
| `asm/original/rev0/boot/boot_state_global_reset.s` | `0x000068E0..0x000069D8` | `0x800764E0..0x800765D8` | 248-byte prologue helper with a global reset/init shape. |
| `asm/original/rev0/code_000069D8_00011000.s` | `0x000069D8..0x00011000` | `0x800765D8..0x80080C00` | Remainder at this split; now superseded by the boot state slot callback dispatch split. |
| `asm/original/rev0/code_00006EE8_00011000.s` | `0x00006EE8..0x00011000` | `0x80076AE8..0x80080C00` | Remainder after the boot state slot callback dispatch split; now superseded by the boot state slot render callback walk split. |
| `asm/original/rev0/code_000071C8_00011000.s` | `0x000071C8..0x00011000` | `0x80076DC8..0x80080C00` | Remainder after the boot state slot render callback walk split; now superseded by the boot state slot queue service gate split. |
| `asm/original/rev0/code_00007200_00011000.s` | `0x00007200..0x00011000` | `0x80076E00..0x80080C00` | Remainder after the boot state slot queue service gate split; now superseded by the boot resource global handle release split. |
| `asm/original/rev0/code_0000722C_00011000.s` | `0x0000722C..0x00011000` | `0x80076E2C..0x80080C00` | Current tracked remainder after the boot resource global handle release split. |

The name is conservative. It records the static global reset/init shape, not
runtime-verified system semantics.

## Static Evidence

- Parent `../scripts/ob64_functions.json` reports `0x68E0` as a 248-byte valid
  prologue helper with frame size `0x18`, epilogue, no `jalr`, no indirect
  jump, and next function boundary `0x69D8`.
- Parent symbol data places `0x68E0` at fixed RAM `0x800764E0` in all seven
  named states.
- Parent callgraph reports high-confidence caller `0x22B0`.
- High-confidence callees are `0x25090` / RAM `0x80094C90` twice,
  `0x23780` / RAM `0x80093380` twice, `0x49A60` / RAM `0x80173B60`, and
  `0x859C` / RAM `0x8007819C`.
- Parent callgraph leaves one unresolved RAM target, `0x8009C7C0`.
- Parent xrefs expose writes to `0x800C4C20`, `0x800E79A0`,
  `0x800C49D0`, `0x800BF0B0`, and byte writes around
  `0x800BF0A2..0x800BF0A4`.
- Local source inspection also shows memclear bases at `0x800F82C8` and
  `0x800C4C10`, plus four-slot initialization around
  `0x800BF090/0x800BF0A6`.

## Static Shape

- Calls `0x80094C90`.
- Clears `0x800F82C8` length `0x3F0` through `0x80093380`.
- Clears `0x800C4C10` length `0x0C` through `0x80093380`.
- Sets `0x800C4C20 = 1` and `0x800E79A0 = 8`.
- Clears halfword `0x800C49D0`, word `0x800BF0B0`, halfword `0x800BF0A0`,
  and bytes `0x800BF0A2`, `0x800BF0A3`, and `0x800BF0A4`.
- Loops across four slots, clearing halfwords at `0x800BF0A6 + 2*i` and
  storing pointer `0x800BF0A0` into words at `0x800BF090 + 4*i`.
- Calls `0x80094C90` again.
- Calls unresolved target `0x8009C7C0` with the last loop cursor address still
  live in `a0`.
- Calls `0x80173B60([0x800BF0B0])`, stores the return value back to
  `0x800BF0B0`, then calls `0x8007819C`.

## Boundaries

- The split starts at parent prologue boundary `0x000068E0`, immediately after
  `boot_resource_table_mask_apply.s`.
- The helper has a normal epilogue at `0x69D0..0x69D4`.
- The next clean prologue boundary `0x000069D8` is now split into
  `boot_state_slot_callback_dispatch.s`; the current active remainder starts at
  `0x00006EE8`.

## Verification

After the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- Full `node tools\verify_setup.js` passed.
- The assembled report shows 1 tracked composite real-asm chunk made from 60
  tracked source files, plus 99 generated fallback chunks.
- The assembled code-region SHA256 remains
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- The rebuilt full-ROM SHA256 remains
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
