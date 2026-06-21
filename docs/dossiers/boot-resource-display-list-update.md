# Boot Resource Display-List Update Split

Date: 2026-06-21

## Scope

This dossier records a static source-layout split of the Rev 0 permanent boot
code after the resource state reset wrapper:

| Source | ROM range | RAM range | Notes |
| --- | --- | --- | --- |
| `asm/original/rev0/boot/boot_resource_display_list_update.s` | `0x000037F8..0x00003C2C` | `0x800733F8..0x8007382C` | Keeps the `0x37F8` prefix, `0x3808` prologue, and `0x3BA0` secondary entry together. |
| `asm/original/rev0/code_00003C2C_00011000.s` | `0x00003C2C..0x00011000` | `0x8007382C..0x80080C00` | Former next tracked remainder, now superseded by `boot_display_list_state_emit.s`. |

The name is a conservative source-layout label based on static resource and
display-list command writes, not a final C API name.

## Static Evidence

- Parent `../scripts/ob64_functions.json` reports `0x37F8` as a 936-byte leaf
  entry and `0x3808` as a 1,060-byte prologue function, frame size `0x40`, with
  secondary entry `0x3BA0`. The `0x3808` parent end marker is `0x3C28`; the
  branch delay slot at `0x3C28` makes the safe source split end exclusive
  `0x00003C2C`.
- The four-instruction `0x37F8` prefix reads bytes `0x800A81F0` and
  `0x800AEE72`, then falls through into the `0x3808` prologue. Keeping the
  prefix and prologue in one file avoids splitting a real entry path away from
  its parent setup.
- Parent `../scripts/ob64_symbols_v2.json` locates `0x37F8` and `0x3808` at
  fixed RAM `0x800733F8` and `0x80073408` in all seven named states.
- Parent `../scripts/ob64_callgraph_v2.json` reports caller `0x27A0` for
  `0x37F8`, high-confidence callee edges to `resource_free` (`0x16C4`),
  `resource_alloc_mode1_wrapper` (`0x1688`), `0x3C2C`, `0x228D0`, and
  `0x210C0`, plus unresolved RAM target `0x800737A0`. The unresolved target is
  the included `0x3BA0` secondary helper.
- Static code shape: select a `0x18`-byte row from base `0x800A81C0` using
  byte `0x800A81F0`, store the selected row to `0x800F9BE0`, refresh row
  pointer fields with repeated free/alloc calls, and use accumulator halfwords
  also touched by the preceding reset helpers.
- The routine touches flag bytes `0x800A8210..0x800A8215`, conditionally
  allocates/frees the large pointer global `0x800AEF9C`, and stores an aligned
  base in `0x800C4B20`.
- The routine and its `0x3BA0` secondary helper emit display-list command words
  through the heavily used display-list pointer global `0x800E9BA0` /
  `0x800F9BA0`, including constants shaped like F3DEX commands (`E700`,
  `DB06`, `DE00`, `DC08`, `DA38`, `DB0E`) and pointer words to
  `0x80186E70`, `0x801869C8`, `0x800BEDF0`, and `0x800BEE30`.

## Boundaries

- The split starts at parent function boundary `0x000037F8`.
- The overlapping `0x3808` prologue and `0x3BA0` secondary entry are kept in the
  same file because `0x37F8` falls into `0x3808`, and `0x3808` calls the
  `0x3BA0` helper by RAM target `0x800737A0`.
- The split ends at exclusive `0x00003C2C`, immediately before the next parent
  prologue. Parent data reports `0x3C2C` as a separate 696-byte prologue routine,
  frame size `0x20`, called by this cluster.
- Later source-layout work split that `0x3C2C` target into
  `asm/original/rev0/boot/boot_display_list_state_emit.s`. That remainder has
  since been superseded again by the display-list finalize/flip split.

## Verification

After the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- Full `node tools\verify_setup.js` passed.
- The assembled report shows 1 tracked composite real-asm chunk made from 27
  tracked source files, plus 99 generated fallback chunks.
- The assembled code-region SHA256 remains
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- The rebuilt full-ROM SHA256 remains
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
