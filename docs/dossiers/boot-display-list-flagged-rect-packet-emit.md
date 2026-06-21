# Boot Display-List Flagged Rect Packet Emit Split

Date: 2026-06-21

## Scope

This dossier records a static source-layout split of the Rev 0 helper following
the transform-wrapper/clamped-rect emitter:

| Source | ROM range | RAM range | Notes |
| --- | --- | --- | --- |
| `asm/original/rev0/boot/boot_display_list_flagged_rect_packet_emit.s` | `0x00008D6C..0x0000906C` | `0x8007896C..0x80078C6C` | Single `0x8D6C` prologue helper, frame size `0x28`, clean return at `0x9064..0x9068`. |
| `asm/original/rev0/code_0000906C_00011000.s` | `0x0000906C..0x00011000` | `0x80078C6C..0x80080C00` | Remainder at this split; now superseded by `code_0000978C_00011000.s` after the later display-list helper splits. |

The source name is conservative. It records the observed static gate,
coordinate clamp, and display-list packet emission shape, not final renderer
semantics.

## Static Evidence

- Parent function data reports `0x8D6C` as a 768-byte valid prologue helper with
  frame size `0x28`.
- The helper is fixed at RAM `0x8007896C` in all seven named states and all 21
  snapshots.
- Parent callgraph data reports high-confidence caller `0x16DAEC`.
- The only v2 unresolved callee is RAM `0x8007338C`; local earlier source
  identifies that as the `0x378C` secondary entry inside
  `boot_resource_buffer_reset_flags.s`.
- Parent top constants are `320` and `240`, matching local clamp limits
  `0x140` and `0xF0`.
- Local source reads display-list pointer global `0x800E9BA0`, reads
  `0x800C4B20` and `0x800E8210`, and advances the display-list pointer through
  a fixed packet span ending at offset `+0xA8`.

## Static Shape

- Incoming `a0..a3` are saved in callee-saved registers and treated as
  coordinate-like values.
- The body first calls RAM `0x8007338C`; if the return is zero it skips packet
  emission and returns.
- The first three coordinate-like values are clamped to `0..0x13F`; the fourth
  is clamped to `0..0xEF`.
- It emits display-list-style packet words through `0x800E9BA0`, including
  repeated `E700` sync words plus `E200001C`, `E3000A01`, `FE00`, `F700`, and
  `F600` command words.
- It packs the clamped bounds into the `F600` words with `0x03FF` masks and
  shifts, and uses `0x800C4B20` / `0x800E8210` as pointer-like payload values
  adjusted by `0x80000000`.

## Boundaries

- The split starts at `0x00008D6C`, the current remainder's first parent
  boundary and a clean prologue.
- The helper ends at `0x0000906C`; local source shows a normal epilogue at
  `0x904C..0x9068`.
- The next parent boundary at `0x0000906C` begins a separate 956-byte prologue
  helper with frame size `0x30`, callers `0xEE8E0` and `0xFAFAC`, and the same
  unresolved RAM target `0x8007338C`. That helper is now promoted as
  `boot_display_list_color_rect_packet_emit.s`; follow-up vector distance and
  transform coefficients splits now leave `code_0000978C_00011000.s` as the
  active remainder.

## Verification

After the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- Full `node tools\verify_setup.js` passed after docs were updated.
- The assembled report shows 1 tracked composite real-asm chunk made from 81
  tracked source files, plus 99 generated fallback chunks.
- The assembled code-region SHA256 remains
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- The rebuilt full-ROM SHA256 remains
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
