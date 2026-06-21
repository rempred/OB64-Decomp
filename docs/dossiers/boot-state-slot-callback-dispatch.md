# Boot State Slot Callback Dispatch Split

Date: 2026-06-21

## Scope

This dossier records a static source-layout split of the Rev 0 permanent boot
helper immediately after the boot state global reset helper:

| Source | ROM range | RAM range | Notes |
| --- | --- | --- | --- |
| `asm/original/rev0/boot/boot_state_slot_callback_dispatch.s` | `0x000069D8..0x00006EE8` | `0x800765D8..0x80076AE8` | 1,296-byte prologue helper that processes six 0xA8-byte state records and dispatches working-record callbacks. |
| `asm/original/rev0/code_00006EE8_00011000.s` | `0x00006EE8..0x00011000` | `0x80076AE8..0x80080C00` | Remainder at this split; now superseded by the boot state slot render callback walk split. |
| `asm/original/rev0/code_000071C8_00011000.s` | `0x000071C8..0x00011000` | `0x80076DC8..0x80080C00` | Remainder after the boot state slot render callback walk split; now superseded by the boot state slot queue service gate split. |
| `asm/original/rev0/code_00007200_00011000.s` | `0x00007200..0x00011000` | `0x80076E00..0x80080C00` | Current tracked remainder after the boot state slot queue service gate split. |

The name is conservative. It records the static slot/callback dispatch shape,
not runtime-verified state-machine semantics.

## Static Evidence

- Parent `../scripts/ob64_functions.json` reports `0x69D8` as a 1,296-byte
  valid prologue helper with frame size `0x30`, epilogue, `jalr`, no indirect
  jump, and next function boundary `0x6EE8`.
- Parent symbol data places `0x69D8` at fixed RAM `0x800765D8` in all seven
  named states.
- Parent callgraph reports high-confidence caller `0x27A0`.
- Local caller source in `boot_state_service_loop.s` calls `0x6EE8`, `0x71C8`,
  then `0x69D8` in the same service-loop path.
- High-confidence callees are `0x23460` / RAM `0x80093060` count 4,
  `0x49A60` / RAM `0x80173B60`, `0x84D4` / RAM `0x800780D4` count 2,
  `0x8388` / RAM `0x80077F88` count 2, `0x859C` / RAM `0x8007819C` count 2,
  `0x8564` / RAM `0x80078164`, `0x49C14` / RAM `0x80173D14`, `0x49C4C` /
  RAM `0x80173D4C`, `0x2CBCC` / RAM `0x8009C7CC`, and `0x7688` / RAM
  `0x80077288`.
- Parent callgraph leaves unresolved RAM targets `0x80077494` and
  `0x8017C29C`.
- Parent xrefs and local source show the helper reads/writes working record
  `0x800E7A30..0x800E7AC8`, source records rooted at `0x800F82C8`, current
  slot global `0x800C4C20`, counter/current globals `0x800C49D0` and
  `0x800C4C10`, and pointer/list global `0x800BF0B0`.

## Static Shape

- Processes six source records rooted at `0x800F82C8`, each with stride `0xA8`.
- Uses `0x800E7A30` as a working record copy and restores that working record
  back into the source slot after per-slot processing.
- Writes each active slot index to `0x800C4C20`.
- First pass starts from a rotating modulo-six slot, skips records according to
  flag bits in source record halfword `+0x00`, calls callback pointer
  `0x800E7A40`, manages pointer/list state through `0x800E7AC8` and
  `0x800BF0B0`, and calls helper pair `0x800780D4` / `0x80077F88`.
- Second pass walks all six slots and calls helper `0x80078164`, unresolved
  `0x80077494`, callback pointer `0x800E7A44`, and, when flags permit,
  unresolved `0x8017C29C` plus `0x80173D14` and `0x80173D4C`.
- Updates working halfwords `0x800E7A36`, `0x800E7A38`, `0x800E7A3A`, and
  `0x800E7A3C` from pointer fields in the active record/list node.
- Decrements `0x800C49D0`, calls `0x8009C7CC` while the counter remains
  nonzero, calls `0x8007819C`, stores `0x800C4C20 = -1`, calls
  `0x80077288`, and returns.

## Boundaries

- The split starts at parent prologue boundary `0x000069D8`, immediately after
  `boot_state_global_reset.s`.
- The helper has a normal epilogue at `0x6ECC..0x6EE4`.
- The next clean boundary is `0x00006EE8`.
- The `0x6EE8` leaf / `0x6EF0` prologue sibling has since been split as
  `boot_state_slot_render_callback_walk.s`.
- The current active remainder starts at `0x000071C8`.

## Verification

After the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- Full `node tools\verify_setup.js` passed.
- The assembled report shows 1 tracked composite real-asm chunk made from 61
  tracked source files, plus 99 generated fallback chunks.
- The assembled code-region SHA256 remains
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- The rebuilt full-ROM SHA256 remains
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
