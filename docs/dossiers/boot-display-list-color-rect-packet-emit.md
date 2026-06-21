# Boot Display-List Color Rect Packet Emit Split

Date: 2026-06-21

## Scope

This dossier records a static source-layout split of the Rev 0 helper following
the flagged rect packet emitter:

| Source | ROM range | RAM range | Notes |
| --- | --- | --- | --- |
| `asm/original/rev0/boot/boot_display_list_color_rect_packet_emit.s` | `0x0000906C..0x00009428` | `0x80078C6C..0x80079028` | Single `0x906C` prologue helper, frame size `0x30`, clean return at `0x9420..0x9424`. |
| `asm/original/rev0/code_00009428_00011000.s` | `0x00009428..0x00011000` | `0x80079028..0x80080C00` | Remainder at this split; now superseded by `code_00009A18_00011000.s` after later display-list and command-stream splits. |

The source name is conservative. It records the observed static coordinate clamp
and display-list packet shape, plus a color/fill-like incoming word, not final
renderer semantics.

## Static Evidence

- Parent function data reports `0x906C` as a 956-byte valid prologue helper with
  frame size `0x30`.
- The helper is fixed at RAM `0x80078C6C` in all seven named states and all 21
  snapshots.
- Parent data reports no secondary entries, no `jalr`, and a clean exclusive end
  at `0x9428`.
- Older/static callers are `0xEE8E0` and `0xFAFAC`; v2 ranks those as high and
  medium confidence.
- Parent old callee data reports `0x368C`. The v2 callgraph leaves literal RAM
  target `0x8007338C` unresolved; local earlier source identifies that as the
  `0x378C` secondary entry inside `boot_resource_buffer_reset_flags.s`.
- Parent top constants are `320` and `240`, matching local clamp limits
  `0x140` and `0xF0`.
- Local xrefs read display-list pointer global `0x800E9BA0`, payload-like
  globals `0x800C4B20` and `0x800E8210`, and write display-list packet offsets
  from `0x800F0000` through `0x800F0044`.

## Static Shape

- The helper clamps coordinate-like arguments to `0..0x13F` and `0..0xEF`.
- It uses an extra stack argument as the fourth coordinate-like clamp input.
- Incoming `a0` is preserved and later duplicated into both halfwords as a
  color/fill-like word used in the emitted packet stream.
- It emits display-list-style packet words through global `0x800E9BA0`,
  including `E700`, `E200001C`, `E3000A01`, `FE00`, `F700`, and `F600` command
  words.
- The body emits an initial packet run, calls RAM `0x8007338C`, conditionally
  emits a gated packet using `0x800C4B20`, then emits a second packet using
  `0x800E8210` and the duplicated color/fill-like word.

## Boundaries

- The split starts at `0x0000906C`, the current remainder's first parent
  boundary and a clean prologue.
- The helper ends at `0x00009428`; local source shows a normal epilogue at
  `0x9400..0x9424`.
- The next parent boundary at `0x00009428` begins a 292-byte prologue helper
  with frame size `0x40`. Parent data marks it orphaned from v2 callers and
  records secondary entries at `0x9488` and `0x953C`; older data lists caller
  `0x112650` and unresolved callees RAM `0x80098450` and `0x800907E0`.
- The `0x9428..0x954C` family is now promoted as
  `boot_display_list_vector_distance_and_transform_prefix.s`; later transform
  coefficients and command-stream work leave `code_00009A18_00011000.s` as the
  active remainder.

## Verification

After the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- Full `node tools\verify_setup.js` passed after docs were updated.
- The assembled report shows 1 tracked composite real-asm chunk made from 82
  tracked source files, plus 99 generated fallback chunks.
- The assembled code-region SHA256 remains
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- The rebuilt full-ROM SHA256 remains
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
