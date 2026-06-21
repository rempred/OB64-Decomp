# Boot State Slot Queue Service Gate Split

Date: 2026-06-21

## Scope

This dossier records a static source-layout split of the compact Rev 0 permanent
helper immediately after the boot state slot render callback walk helper:

| Source | ROM range | RAM range | Notes |
| --- | --- | --- | --- |
| `asm/original/rev0/boot/boot_state_slot_queue_service_gate.s` | `0x000071C8..0x00007200` | `0x80076DC8..0x80076E00` | Leaf prefix at `0x71C8` plus `0x71D0` prologue body; gates a three-call service chain on halfword global `0x800C49D0`. |
| `asm/original/rev0/code_00007200_00011000.s` | `0x00007200..0x00011000` | `0x80076E00..0x80080C00` | Remainder at this split; now superseded by the boot resource global handle release split. |
| `asm/original/rev0/code_0000722C_00011000.s` | `0x0000722C..0x00011000` | `0x80076E2C..0x80080C00` | Remainder after the boot resource global handle release split; now superseded by the boot resource global handle slot record prepare split. |
| `asm/original/rev0/code_00007560_00011000.s` | `0x00007560..0x00011000` | `0x80077160..0x80080C00` | Remainder after the boot resource global handle slot record prepare split; now superseded by the current-peer-record flag mark split. |

The name is conservative. It records the static queue/service gate shape, not
runtime-verified scheduler semantics.

## Static Evidence

- Parent `../scripts/ob64_functions.json` reports `0x71C8` as a 56-byte leaf
  entry that falls through into the `0x71D0` prologue body.
- Parent data reports `0x71D0` as a 48-byte prologue body with frame size
  `0x18` and clean end `0x7200`.
- Parent symbol data places `0x71C8/0x71D0` at fixed RAM
  `0x80076DC8/0x80076DD0` in all seven named states and all 21 snapshots.
- Parent callgraph reports high-confidence caller `0x27A0` for the `0x71C8`
  entry.
- High-confidence callees are `0x79EC` / RAM `0x800775EC` and `0x859C` / RAM
  `0x8007819C`.
- Parent callgraph leaves unresolved RAM target `0x80077BF8`.
- Parent/local xrefs show the only direct global access in this split is a read
  of halfword `0x800C49D0`.

## Static Shape

- The leaf prefix loads `lhu [0x800C49D0]` into `v0`.
- The body saves `ra` and returns immediately when the halfword is zero.
- If nonzero, it calls `0x800775EC`, unresolved `0x80077BF8`, and
  `0x8007819C`, each with an explicit `nop` delay slot.
- The epilogue restores `ra` from `sp + 0x10` and returns.

## Boundaries

- The split starts at parent leaf boundary `0x000071C8`, immediately after
  `boot_state_slot_render_callback_walk.s`.
- The two-word `0x71C8` prefix stays with the `0x71D0` prologue body because it
  loads the gate value used by the body and falls through directly.
- The helper has a normal epilogue at `0x71F4..0x71FC`.
- The next clean boundary is `0x00007200`, a compact utility pair that starts by
  reading word global `0x800AF0B0`.

## Verification

After the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- Full `node tools\verify_setup.js` passed after docs were updated.
- The assembled report shows 1 tracked composite real-asm chunk made from 63
  tracked source files, plus 99 generated fallback chunks.
- The assembled code-region SHA256 remains
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- The rebuilt full-ROM SHA256 remains
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
