# Boot Display-List Counter-Step Split

Date: 2026-06-21

## Scope

This dossier records a static source-layout split of the Rev 0 permanent boot
code after the display-list sync/modes helper:

| Source | ROM range | RAM range | Notes |
| --- | --- | --- | --- |
| `asm/original/rev0/boot/boot_display_list_counter_step.s` | `0x00004048..0x000040B0` | `0x80073C48..0x80073CB0` | Overlapping 104-byte leaf entry at `0x4048` plus 96-byte prologue entry at `0x4050`. |
| `asm/original/rev0/code_000040B0_00011000.s` | `0x000040B0..0x00011000` | `0x80073CB0..0x80080C00` | Next tracked remainder. |

The name is a conservative source-layout label based on a small byte counter
feeding a display-list helper, not a verified renderer API name.

## Static Evidence

- Parent `../scripts/ob64_functions.json` reports `0x4048` as a 104-byte leaf
  entry and `0x4050` as an overlapping 96-byte prologue function. The next
  parent prologue starts at `0x000040B0`.
- Parent `../scripts/ob64_callgraph_v2.json` reports high-confidence caller
  `0x3EE4` to the `0x4048` entry. It reports no direct callers for `0x4050`;
  both entries share the call site to local helper `0x40B0`.
- Parent `../scripts/ob64_symbols_v2.json` locates both entries at fixed RAM
  `0x80073C48` / `0x80073C50` in all seven named states and all 21 RAM
  snapshots.
- Xref scan shows read/write traffic for byte `0x800AEF99`; the complete xref
  row lists only the early boot state loop (`0x27A0`) and this `0x4048/0x4050`
  helper pair as readers/writers.
- Static code shape: the `0x4048` prefix loads `0x800AEF99` into `v0`, then
  falls into the `0x4050` prologue. The shared body returns early when the byte
  is zero, clamps values above `0x0C` back to `0x0C`, stores the clamped byte,
  computes an 8-bit scaled argument from `value * 0xFF` using multiplier
  `0x2AAAAAAB`, and calls `0x40B0(a0=scaled)`.

## Boundaries

- The split starts at parent leaf boundary `0x00004048`, immediately after the
  previous helper's `jr ra` delay slot at `0x4044`.
- The split keeps the overlapping `0x4048` and `0x4050` entries together because
  `0x4048` supplies the byte load consumed by the `0x4050` body and no direct
  callers for `0x4050` are reported.
- The split ends at exclusive `0x000040B0`, immediately before the next parent
  prologue. Parent data reports `0x40B0` as a separate 552-byte helper with
  secondary entry `0x42C4` and one unresolved call to RAM `0x8016CD30`.

## Verification

After the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- Full `node tools\verify_setup.js` passed.
- The assembled report shows 1 tracked composite real-asm chunk made from 31
  tracked source files, plus 99 generated fallback chunks.
- The assembled code-region SHA256 remains
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- The rebuilt full-ROM SHA256 remains
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
