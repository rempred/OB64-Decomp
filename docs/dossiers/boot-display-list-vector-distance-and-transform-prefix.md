# Boot Display-List Vector Distance / Transform Prefix Split

Date: 2026-06-21

## Scope

This dossier records a static source-layout split of the Rev 0 helper following
the color rect packet emitter:

| Source | ROM range | RAM range | Notes |
| --- | --- | --- | --- |
| `asm/original/rev0/boot/boot_display_list_vector_distance_and_transform_prefix.s` | `0x00009428..0x0000954C` | `0x80079028..0x8007914C` | `0x9428` prologue helper plus the parent-recorded `0x953C` fallthrough prefix. |
| `asm/original/rev0/code_0000954C_00011000.s` | `0x0000954C..0x00011000` | `0x8007914C..0x80080C00` | Remainder at this split; now superseded by `code_00009A18_00011000.s` after the transform coefficients and command-stream splits. |

The source name is conservative. It records the observed static vector-distance
shape plus the adjacent transform-like prefix, not final renderer semantics.

## Static Evidence

- Parent function data reports `0x9428` as a valid 292-byte (`0x124`) prologue
  helper with frame size `0x40`.
- The helper is fixed at RAM `0x80079028` in all seven named states and all 21
  snapshots.
- Parent data reports no `jalr`, no indirect jump, no resolved v2 callers, and
  older caller `0x112650`.
- Parent data records secondary entries at `0x9488` and `0x953C`.
- The v2 callgraph leaves RAM targets `0x80098450` and `0x800907E0` unresolved.
- Parent/local xrefs read globals `0x800E9BE0` and `0x800C4C24`.
- Local source shows `0x953C..0x9548` reads those globals and falls through into
  the next `0x954C` body, so the prefix is kept with this split to preserve the
  parent secondary entry.

## Static Shape

- The main helper calls RAM `0x80098450` with zeroed float arguments and stack
  output pointers at `sp+0x20`, `sp+0x24`, and `sp+0x28`.
- It reads vector-like float fields at `[a1+0]`, `[a1+4]`, and `[a1+8]`,
  subtracts the returned output floats, squares the components, sums them, and
  runs `sqrt.s`.
- The alternate sqrt path calls RAM `0x800907E0`.
- The result is divided by incoming `a2` saved as `f20`, scaled with float
  constant `0x477FFE00`, converted through the signed float-to-int boundary
  case, and returned as a 16-bit inverted value.
- The `0x953C` prefix loads pointer-like global `0x800E9BE0` and halfword-like
  global `0x800C4C24` before falling into the `0x954C` body.

## Boundaries

- The split starts at `0x00009428`, the current remainder's first parent
  boundary and a clean prologue.
- The main `0x9428` helper has a normal epilogue at `0x9528..0x9538`.
- The parent-recorded secondary entry at `0x953C` is immediately after that
  epilogue. It is executable fallthrough setup for the next body, so this source
  owns it rather than starting the next remainder there.
- The next tracked remainder at this split started at `0x0000954C`, a clean
  prologue boundary. It is now superseded by
  `asm/original/rev0/code_00009A18_00011000.s`.
- Parent data reports the `0x954C` helper as size `0x240`, frame size `0xA8`,
  fixed in all seven states and all 21 snapshots, with older caller `0x22B0`,
  high-confidence callee `0x28D20` / RAM `0x80098920`, and secondary entry
  `0x9780`.
- Follow-up split `boot_display_list_transform_coefficients_sum_clear.s` now
  owns `0x954C..0x978C`; it kept the unparented compact 16-word sum leaf at
  `0x9758..0x9780` and the `0x9780..0x978C` global-clear tail together.
- Follow-up split `boot_command_stream_dispatch.s` now owns `0x978C..0x9A18`,
  leaving `code_00009A18_00011000.s` as the active remainder.

## Verification

After the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- Full `node tools\verify_setup.js` passed after docs were updated.
- The assembled report shows 1 tracked composite real-asm chunk made from 83
  tracked source files, plus 99 generated fallback chunks.
- The assembled code-region SHA256 remains
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- The rebuilt full-ROM SHA256 remains
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
