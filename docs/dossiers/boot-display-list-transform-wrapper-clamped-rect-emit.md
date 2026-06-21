# Boot Display-List Transform Wrapper / Clamped Rect Emit Split

Date: 2026-06-21

## Scope

This dossier records a static source-layout split of the Rev 0 helper family
after the transform-record emitter:

| Source | ROM range | RAM range | Notes |
| --- | --- | --- | --- |
| `asm/original/rev0/boot/boot_display_list_transform_wrapper_clamped_rect_emit.s` | `0x00008A58..0x00008D6C` | `0x80078658..0x8007896C` | `0x8A58` wrapper plus `0x8A74` secondary leaf/body, frame size `0x18` on the wrapper, clean return at `0x8D64..0x8D68`. |
| `asm/original/rev0/code_00008D6C_00011000.s` | `0x00008D6C..0x00011000` | `0x8007896C..0x80080C00` | Remainder at this split; now superseded by `code_00009A18_00011000.s` after later display-list and command-stream splits. |

The source name is conservative. It records a static wrapper plus clamped
rectangle/display-list record shape, not final renderer semantics.

## Static Evidence

- Parent function data reports `0x8A58` as a 788-byte valid prologue function
  with frame size `0x18`, fixed at RAM `0x80078658` in all seven named states
  and all 21 snapshots.
- Parent data records secondary entry `0x8A74` / RAM `0x80078674`; local source
  shows the wrapper at `0x8A58..0x8A70` returns before that secondary body.
- Parent symbols list older static callers `0xE65FC`, `0xE6D98` count 2,
  `0xEC598`, `0xEE8E0`, `0xF82DC`, `0xFAFAC`, and `0x2825BC`; v2 callgraph
  does not resolve overlay-aware callers for this function.
- The only high-confidence callee is `0x874C` / RAM `0x8007834C`, the preceding
  transform-record emitter. There are no unresolved v2 targets in this split.
- Parent/global xrefs and local source connect the body to display-list pointer
  global `0x800E9BA0`, descriptor/base global `0x800E9BE0`, and counter-like
  global `0x800C4BE4`.
- Parent top constants are `320` and `240`, matching local coordinate clamp
  limits of `0x140` and `0xF0`.

## Static Shape

- The `0x8A58` wrapper saves `ra`, calls `0x8007834C(a0)`, restores `ra`, and
  returns.
- The `0x8A74` secondary entry accepts four coordinate-like arguments, clamps the
  first and third to `0..0x13F`, and clamps the second and fourth to `0..0xEF`.
- The secondary body reads descriptor/base global `0x800E9BE0`, uses
  `0x800C4BE4` as a 64-byte-entry index, writes halfword fields at offsets
  `+0x00..+0x0E`, and increments the counter.
- It emits display-list-style packets through `0x800E9BA0`, including `E700`,
  `DC080008`, and `ED00` command words.
- Coordinate fields are converted through a `* 4.0`, truncate, and `0x0FFF`
  packing path before being ORed into the `ED00`-style words.

## Boundaries

- The split starts at `0x00008A58`, the current remainder's first parent
  boundary.
- The secondary entry at `0x8A74` stays with the wrapper because parent function
  data records it as an entry inside the `0x8A58` family and the next clean
  parent boundary is `0x8D6C`.
- The split ends at `0x00008D6C`, where parent data records the next valid
  prologue function. That next helper calls RAM `0x8007338C`, which local
  earlier source identifies as the `0x378C` secondary entry inside
  `boot_resource_buffer_reset_flags.s`. That helper is now promoted as
  `boot_display_list_flagged_rect_packet_emit.s`; follow-up color rect, vector
  distance, and transform coefficients splits now leave
  `code_00009A18_00011000.s` as the active remainder after the command-stream
  split.

## Verification

After the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- Full `node tools\verify_setup.js` passed after docs were updated.
- The assembled report shows 1 tracked composite real-asm chunk made from 80
  tracked source files, plus 99 generated fallback chunks.
- The assembled code-region SHA256 remains
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- The rebuilt full-ROM SHA256 remains
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
