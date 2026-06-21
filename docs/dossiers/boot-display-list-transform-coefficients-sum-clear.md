# Boot Display-List Transform Coefficients / Sum Clear Split

Date: 2026-06-21

## Scope

This dossier records a static source-layout split of the Rev 0 helper following
the vector distance / transform-prefix split:

| Source | ROM range | RAM range | Notes |
| --- | --- | --- | --- |
| `asm/original/rev0/boot/boot_display_list_transform_coefficients_sum_clear.s` | `0x0000954C..0x0000978C` | `0x8007914C..0x8007938C` | `0x954C` prologue helper plus the adjacent 16-word sum leaf and global-clear tail. |
| `asm/original/rev0/code_0000978C_00011000.s` | `0x0000978C..0x00011000` | `0x8007938C..0x80080C00` | Current tracked remainder; starts with the `0x978C` leaf/prefix family. |

The source name is conservative. It records the observed static float
coefficient/transform-like shape plus the neighboring compact leaves, not final
renderer semantics.

## Static Evidence

- Parent function data reports `0x954C` as a valid 576-byte (`0x240`) prologue
  helper with frame size `0xA8`.
- The helper is fixed at RAM `0x8007914C` in all seven named states and all 21
  snapshots.
- Parent data reports older caller `0x22B0`, high-confidence callee `0x28D20` /
  RAM `0x80098920` called twice, no unresolved v2 targets, and secondary entry
  `0x9780`.
- Parent xrefs read globals `0x800F0008`, `0x800E9BE0`, and `0x800E7A0E`, and
  write `0x800A8740`.
- Local source shows a compact unparented `0x9758..0x9780` 16-word sum leaf
  after the main helper epilogue.
- Local source also shows the `0x9780..0x978C` global-clear tail. Parent
  function data ends at `0x9788`, but `0x9788` is the delay-slot store for the
  `0x9784` `jr ra`, so the source split must include through `0x978C`.

## Static Shape

- The main helper calls RAM `0x80098920` twice with stack output rows rooted at
  `sp+0x20`.
- It treats incoming `f12`, `f14`, and `a2`/`f30` as float coefficients for
  weighted sums from the returned stack rows.
- It reads descriptor/global `0x800E9BE0` and halfword `0x800E7A0E` before the
  second helper call.
- It writes intermediate floats at `sp+0x60`, `sp+0x64`, `sp+0x68`, and
  `sp+0x6C`.
- It scales with float constant `0x467F8000`, divides by a computed float,
  truncates the result, and returns converted value plus `0x3FE0`.
- The `0x9758..0x9780` leaf sums 16 consecutive words from incoming `a0`.
- The `0x9780..0x978C` tail clears word global `0x800A8740`.

## Boundaries

- The split starts at `0x0000954C`, the current remainder's first parent
  boundary and a clean prologue.
- The main helper has a normal epilogue at `0x9734..0x9754`.
- The compact sum leaf has its own `jr ra` at `0x9778..0x977C`.
- The global-clear tail is exactly `0x9780..0x978C`; the store at `0x9788` is a
  branch delay slot and must not be separated from the tail.
- The next tracked remainder starts at `0x0000978C`, the next parent boundary.
- Parent data reports the `0x978C` family as size `0x28C`, with actual prologue
  body at `0x97A8`, fixed in all seven named states and all 21 snapshots, many
  callers, JAL-target and indirect-jump behavior, high-confidence callees
  `0x9CAC`, `0x9C50`, `0x9D50`, `0x9EFC`, `0x9FD8`, and `resource_free`
  `0x16C4`, with no unresolved v2 targets. Keep the next `0x978C..0x9A18`
  family together until the jump/table shape is split safely.

## Verification

After the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- Full `node tools\verify_setup.js` passed after docs were updated.
- The assembled report shows 1 tracked composite real-asm chunk made from 84
  tracked source files, plus 99 generated fallback chunks.
- The assembled code-region SHA256 remains
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- The rebuilt full-ROM SHA256 remains
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
