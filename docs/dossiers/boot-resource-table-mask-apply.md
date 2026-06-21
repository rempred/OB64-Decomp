# Boot Resource Table/Mask Apply Split

Date: 2026-06-21

## Scope

This dossier records a static source-layout split of the Rev 0 permanent boot
helper cluster immediately after the accumulator seed wrapper:

| Source | ROM range | RAM range | Notes |
| --- | --- | --- | --- |
| `asm/original/rev0/boot/boot_resource_table_mask_apply.s` | `0x000065E4..0x000068E0` | `0x800761E4..0x800764E0` | Contains the `0x65E4` table/range apply helper, the `0x6724` gap-register helper, and shared local selector leaf `0x6830`. |
| `asm/original/rev0/code_000068E0_00011000.s` | `0x000068E0..0x00011000` | `0x800764E0..0x80080C00` | Remainder at this split; now superseded by the boot state global reset split. |
| `asm/original/rev0/code_000069D8_00011000.s` | `0x000069D8..0x00011000` | `0x800765D8..0x80080C00` | Remainder after the boot state global reset split; now superseded by the boot state slot callback dispatch split. |
| `asm/original/rev0/code_00006EE8_00011000.s` | `0x00006EE8..0x00011000` | `0x80076AE8..0x80080C00` | Remainder after the boot state slot callback dispatch split; now superseded by the boot state slot render callback walk split. |
| `asm/original/rev0/code_000071C8_00011000.s` | `0x000071C8..0x00011000` | `0x80076DC8..0x80080C00` | Remainder after the boot state slot render callback walk split; now superseded by the boot state slot queue service gate split. |
| `asm/original/rev0/code_00007200_00011000.s` | `0x00007200..0x00011000` | `0x80076E00..0x80080C00` | Remainder after the boot state slot queue service gate split; now superseded by the boot resource global handle release split. |
| `asm/original/rev0/code_0000722C_00011000.s` | `0x0000722C..0x00011000` | `0x80076E2C..0x80080C00` | Current tracked remainder after the boot resource global handle release split. |

The name is conservative. It records the static table/mask/resource-range
shape, not verified runtime resource semantics.

## Static Evidence

- Parent `../scripts/ob64_functions.json` reports `0x65E4` as a 320-byte
  prologue helper with frame size `0x28`, epilogue, no indirect jumps, and next
  function boundary `0x6724`.
- Parent `../scripts/ob64_symbols_v2.json` labels `0x65E4` as
  `dma/resource::resource loader` with rule `resource_loader`.
- Parent `../scripts/ob64_functions.json` reports `0x6724` as a 436-byte
  prologue helper with frame size `0x30`, epilogue, and secondary entry
  `0x6830`.
- Parent symbol data places `0x65E4` and `0x6724` at fixed RAM
  `0x800761E4` and `0x80076324` in all seven named states and all 21 parent RAM
  snapshots.
- Both helpers have high-confidence caller `0x5FC0`, the state dispatch loop
  init helper.
- `0x65E4` has high-confidence callees `0x204C0` / RAM `0x800900C0`,
  `0x20410` / RAM `0x80090010`, `0x2DE50` / RAM `0x8009DA50`, and `0x23780` /
  RAM `0x80093380`.
- `0x6724` has high-confidence callee `resource_arena_register` (`0x1120`) with
  count 2.
- Parent callgraph reports unresolved RAM target `0x80076430` from both
  `0x65E4` and `0x6724`; local source inspection resolves it as the in-range
  selector leaf at ROM `0x6830`.
- Local source inspection shows both prologue helpers index pointer table
  `0x800B86FC` after calling the selector.
- Local source inspection shows per-ID table rows around `0x800B83C0` through
  `0x800B83E4`, with row stride `0x28`.

## Static Shape

- The `0x6830` selector masks incoming `a0` with `0x3FFFFFFF`, scans pointer
  table `0x800B86FC`, and returns the first slot index whose listed bit IDs are
  not already covered by the incoming mask. If no table is present or no slot
  qualifies, it returns zero.
- `0x65E4` calls the selector, uses the returned byte as an index into
  `0x800B86FC`, and walks the selected `0xFF`-terminated byte list.
- For each listed ID whose bit is set in the original incoming mask, `0x65E4`
  computes `id * 0x28` and applies four table range operations:
  `0x800B83D8..0x800B83DC` through `0x800900C0`,
  `0x800B83E0..0x800B83E4` through `0x80090010`,
  `0x800B83C8..0x800B83CC` with source/base pointer `0x800B83C0` through
  `0x8009DA50`, and `0x800B83D0..0x800B83D4` through `0x80093380`.
- `0x6724` calls the same selector/table walk. It starts from base pointer
  `0x800B83C0`, registers a gap through `resource_arena_register` when the
  running pointer is below the selected row's start pointer, updates the running
  pointer to row field `0x800B83C4`, and finally registers the gap up to
  `0x80243DB0` when needed.

## Boundaries

- The split starts at parent prologue boundary `0x000065E4`, immediately after
  `boot_mode_message_accumulator_seed_wrapper.s`.
- The file keeps `0x65E4`, `0x6724`, and local leaf `0x6830` together because
  the two prologue helpers share the same selector and table vocabulary.
- The padding nops at `0x68D8` and `0x68DC` remain in this split.
- The next parent prologue boundary `0x000068E0` is now split into
  `boot_state_global_reset.s`, and `0x000069D8` is now split into
  `boot_state_slot_callback_dispatch.s`; the current active remainder starts at
  `0x00006EE8`.

## Verification

After the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- Full `node tools\verify_setup.js` passed.
- The assembled report shows 1 tracked composite real-asm chunk made from 59
  tracked source files, plus 99 generated fallback chunks.
- The assembled code-region SHA256 remains
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- The rebuilt full-ROM SHA256 remains
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
