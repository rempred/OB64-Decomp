# Boot Resource Window Cache Update Split

Date: 2026-06-21

## Scope

This dossier records a static source-layout split of the Rev 0 permanent boot
code after the display-list counter packet emitter:

| Source | ROM range | RAM range | Notes |
| --- | --- | --- | --- |
| `asm/original/rev0/boot/boot_resource_window_cache_update.s` | `0x000042D8..0x000043D4` | `0x80073ED8..0x80073FD4` | Overlapping `0x42D8` leaf entry, `0x42E0` prologue body, and secondary entry `0x4358`. |
| `asm/original/rev0/code_000043D4_00011000.s` | `0x000043D4..0x00011000` | `0x80073FD4..0x80080C00` | Historical next tracked remainder; superseded by `boot_bitstream_cursor_helpers.s` plus `code_000046F4_00011000.s`. |

The name is a conservative source-layout label for nearby resource/window cache
state. It is not a final semantic API name.

## Static Evidence

- Parent `../scripts/ob64_functions.json` reports `0x42D8` as a 128-byte valid
  JAL-target leaf entry and `0x42E0` as a 244-byte valid prologue body with
  frame size `0x18` and secondary entry at `0x4358`.
- Parent `../scripts/ob64_callgraph_v2.json` reports high-confidence caller
  `0x27A0` to `0x42D8`; both `0x42D8` and `0x42E0` call `0x11D08`
  (`0x80081908`).
- Parent `../scripts/ob64_symbols_v2.json` locates both entries at fixed RAM
  `0x80073ED8` / `0x80073EE0` in all seven named states and all 21 RAM
  snapshots.
- Xref evidence shows reads/writes to `0x800A81F4`, writes/reads to
  `0x800A81F8`, reads of `0x800C4BCC`, and writes to the stride-`0x50` words
  `0x800EB0DC`, `0x800EB12C`, `0x800EB17C`, `0x800EB1CC`, `0x800EB21C`,
  `0x800EB26C`, and `0x800EB2BC`.
- Static code shape: the `0x42D8` prefix loads `0x800A81F4` into `v0`, then
  falls into the `0x42E0` body. If that state word is zero, the body clears the
  seven stride-`0x50` words, calls `0x80081908(a0=3, a1=0x0C)`, reads
  `0x800C4BCC`, stores `0x800A81F4 = 0x0C`, and stores the pointer to
  `0x800A81F8`.
- The `0x4358` secondary entry reads cached pointer/state, compares the cached
  `a1..a1+0x3C` window against current `0x800C4BCC` with wrap-aware branches,
  may clear `0x800A81F4`, and returns the current `0x800A81F4` value.

## Boundaries

- The split starts at parent leaf boundary `0x000042D8`, immediately after the
  counter packet helper's `jr ra` delay slot at `0x42D4`.
- The split keeps `0x42D8` and `0x42E0` together because the `0x42D8` entry
  supplies `v0` for the `0x42E0` body's immediate branch.
- The split keeps the secondary entry at `0x4358` with the same source file
  because parent data marks it as a secondary entry for the `0x42E0` body and it
  shares the `0x800A81F4/0x800A81F8` state.
- The split ends at exclusive `0x000043D4`, immediately before the next parent
  prologue. Parent data reports `0x43D4` as a separate 800-byte prologue
  routine.
- Follow-up split `boot_bitstream_cursor_helpers.s` now covers
  `0x000043D4..0x000046F4`; the active remainder starts at `0x000046F4`.

## Verification

After the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- Full `node tools\verify_setup.js` passed.
- The assembled report shows 1 tracked composite real-asm chunk made from 33
  tracked source files, plus 99 generated fallback chunks.
- The assembled code-region SHA256 remains
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- The rebuilt full-ROM SHA256 remains
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
