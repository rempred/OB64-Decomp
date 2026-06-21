# Boot Mode/Message Accumulator Seed Wrapper Split

Date: 2026-06-21

## Scope

This dossier records a static source-layout split of the Rev 0 permanent boot
helper immediately after the state dispatch loop:

| Source | ROM range | RAM range | Notes |
| --- | --- | --- | --- |
| `asm/original/rev0/boot/boot_mode_message_accumulator_seed_wrapper.s` | `0x000065A4..0x000065E4` | `0x800761A4..0x800761E4` | Small wrapper around the `0x3564` accumulator secondary entry. |
| `asm/original/rev0/code_000065E4_00011000.s` | `0x000065E4..0x00011000` | `0x800761E4..0x80080C00` | Remainder at this split; now superseded by the resource table/mask apply split. |
| `asm/original/rev0/code_000068E0_00011000.s` | `0x000068E0..0x00011000` | `0x800764E0..0x80080C00` | Current tracked remainder after the next split. |

The name is conservative. It records the static relationship to the existing
mode/message accumulator helper, not verified runtime semantics for the values
being seeded.

## Static Evidence

- Parent `../scripts/ob64_functions.json` reports `0x65A4` as a 64-byte
  prologue helper with frame size `0x28`, epilogue, no indirect jumps, and next
  function boundary `0x65E4`.
- Parent `../scripts/ob64_symbols_v2.json` places the helper at fixed RAM
  `0x800761A4` in all seven named states and all 21 parent RAM snapshots.
- Parent v2 symbol data reports no direct callers for `0x65A4`.
- Local source inspection shows a single `jal 0x80073164`; in the simple boot
  mapping this is ROM `0x3564`.
- ROM `0x3564` is the secondary entry inside
  `boot_mode_message_accumulator_update.s` (`0x347C..0x368C`).
- Older parent symbol/callee data folds the call to primary target `0x347C`,
  while the v2 callgraph leaves literal target `0x80073164` unresolved because
  it is a secondary entry.
- The `0x3564` secondary accepts six halfword-like values from
  `a1/a2/a3/sp+0x10/sp+0x14/sp+0x18`. With mode `a0 == 0`, nonnegative inputs
  overwrite six globals. With mode `a0 != 0`, the same inputs add to those
  globals.
- The six accumulator globals are `0x800C4C08`, `0x800E7D68`,
  `0x800C4A18`, `0x800E7A1C`, `0x800C4BCA`, and `0x800C4AD8`; both callee
  paths finish by writing byte flag `0x800AEE72 = 2`.

## Static Shape

- Allocates a `0x28`-byte stack frame and saves `ra`.
- Writes stack arguments `sp+0x10 = 1`, `sp+0x14 = 0x100`, and
  `sp+0x18 = 0x2000`.
- Sets register arguments `a0 = 0`, `a1 = 1`, `a2 = 1`, and `a3 = 0x80`.
- Calls `0x80073164`, the accumulator secondary entry at ROM `0x3564`.
- Restores `ra`, releases the stack frame, and returns.

## Boundaries

- The split starts at parent prologue boundary `0x000065A4`, immediately after
  `boot_state_dispatch_loop_init.s`.
- The split ends at the next parent prologue boundary `0x000065E4`.
- The `0x000065E4` follow-up cluster has since been split as
  `boot_resource_table_mask_apply.s`.
- The current active remainder starts at `0x000068E0` with a
  boot state/global reset-style helper called by early boot init.

## Verification

After the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- Full `node tools\verify_setup.js` passed.
- The assembled report shows 1 tracked composite real-asm chunk made from 58
  tracked source files, plus 99 generated fallback chunks.
- The assembled code-region SHA256 remains
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- The rebuilt full-ROM SHA256 remains
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
