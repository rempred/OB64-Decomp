# Boot Display-List Transform Record Emit Split

Date: 2026-06-21

## Scope

This dossier records a static source-layout split of the Rev 0 routine following
the `0x58` record copy leaf:

| Source | ROM range | RAM range | Notes |
| --- | --- | --- | --- |
| `asm/original/rev0/boot/boot_display_list_transform_record_emit.s` | `0x0000874C..0x00008A58` | `0x8007834C..0x80078658` | Two-word `0x874C` leaf prefix plus `0x8754` prologue body, frame size `0x60`, clean epilogue through `0x8A54`. |
| `asm/original/rev0/code_00008A58_00011000.s` | `0x00008A58..0x00011000` | `0x80078658..0x80080C00` | Remainder at this split; now superseded by `code_00008D6C_00011000.s` after the transform-wrapper/clamped-rect split. |

The source name is conservative. It captures the local transform-record and
display-list packet shape, but it does not assert final renderer semantics.

## Static Evidence

- Parent function/symbol data reports `0x874C` as a 780-byte JAL-target leaf
  prefix fixed in all seven named states and all 21 snapshots.
- The first two words load global `0x800F9BE0`, then fall into the `0x8754`
  prologue body with frame size `0x60`.
- Parent evidence reports high-confidence callers `0x8A58` and `0xEE8E0` for
  the `0x874C` entry.
- The `0x8754` body has no separate direct caller entry, but local source shows
  it shares the same body and normal return at `0x8A48..0x8A54`.
- High-confidence callees are `0x228D0` / RAM `0x800924D0`, `0x210C0` / RAM
  `0x80090CC0`, and `0x21DD4` / RAM `0x800919D4`.
- Parent xrefs and local source connect the split to display-list pointer global
  `0x800E9BA0`, descriptor/base global `0x800F9BE0`, counter-like globals
  `0x800C4BE4` and `0x800C4C48`, and writes to `0x800E7A0E` and `0x800C4C24`.

## Static Shape

- Incoming `a0` is treated as a `0x58`-byte transform/record-like source and kept
  in `s0`.
- The helper copies float and word fields from offsets including `+0x00..+0x54`
  into stack/helper arguments.
- It emits display-list-style packet words through `0x800E9BA0`, including
  `DB0E`, `DA38`, `DC08`, and `E700` command words.
- It uses global `0x800F9BE0` as a descriptor/base pointer and uses
  `0x800C4BE4` as a 64-byte-entry counter before updating `0x800C4C48`.
- If the source vector fields at `+0x38`, `+0x3C`, and `+0x40` compare as zero,
  the helper takes the shorter path through `0x80090CC0`.
- Otherwise it takes the larger path through `0x800919D4` and emits the extra
  `DC08`/texture-like packet sequence.

## Boundaries

- The split starts at `0x0000874C` because parent data records a JAL target there
  and the two-word prefix is executable source, not padding.
- The `0x8754` prologue body stays in the same source file because `0x874C`
  falls directly into it and both entries share the same return.
- The split ends at `0x00008A58`, where the next parent function begins. Local
  source shows `0x8A58` is a wrapper that calls `0x874C`, with a secondary entry
  at `0x8A74`. That family is now promoted as
  `boot_display_list_transform_wrapper_clamped_rect_emit.s`; follow-up splits
  now leave `code_0000954C_00011000.s` as the active remainder.

## Verification

After the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- Full `node tools\verify_setup.js` passed after docs were updated.
- The assembled report shows 1 tracked composite real-asm chunk made from 79
  tracked source files, plus 99 generated fallback chunks.
- The assembled code-region SHA256 remains
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- The rebuilt full-ROM SHA256 remains
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
