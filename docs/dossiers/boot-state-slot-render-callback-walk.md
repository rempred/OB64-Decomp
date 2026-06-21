# Boot State Slot Render Callback Walk Split

Date: 2026-06-21

## Scope

This dossier records a static source-layout split of the Rev 0 permanent helper
immediately after the boot state slot callback dispatch helper:

| Source | ROM range | RAM range | Notes |
| --- | --- | --- | --- |
| `asm/original/rev0/boot/boot_state_slot_render_callback_walk.s` | `0x00006EE8..0x000071C8` | `0x80076AE8..0x80076DC8` | Leaf prefix at `0x6EE8` plus `0x6EF0` prologue body; reverse-walks queued slots, emits display-list packets, and dispatches a working-record callback. |
| `asm/original/rev0/code_000071C8_00011000.s` | `0x000071C8..0x00011000` | `0x80076DC8..0x80080C00` | Remainder at this split; now superseded by the boot state slot queue service gate split. |
| `asm/original/rev0/code_00007200_00011000.s` | `0x00007200..0x00011000` | `0x80076E00..0x80080C00` | Current tracked remainder after the boot state slot queue service gate split. |

The name is conservative. It records the static slot/render/callback walk shape,
not runtime-verified state-machine or graphics semantics.

## Static Evidence

- Parent `../scripts/ob64_functions.json` reports `0x6EE8` as a 736-byte valid
  JAL-target leaf entry with `jr $ra`, `jalr`, no indirect jump, and end
  `0x71C8`.
- The same scanner reports `0x6EF0` as a 728-byte valid prologue body with
  frame size `0x38`, epilogue, `jalr`, and the same end.
- Parent symbol data places `0x6EE8/0x6EF0` at fixed RAM
  `0x80076AE8/0x80076AF0` in all seven named states and all 21 snapshots.
- Parent callgraph reports high-confidence caller `0x27A0` for the `0x6EE8`
  entry. Parent v2 symbol data also reports high-confidence caller `0x102FA8`
  for the `0x6EF0` body.
- High-confidence callees are `0x23460` / RAM `0x80093060` count 2,
  `0x8564` / RAM `0x80078164`, `0x49C84` / RAM `0x80173D84`,
  `0x49CBC` / RAM `0x80173DBC`, and `0x84D4` / RAM `0x800780D4`.
- Parent callgraph leaves unresolved RAM target `0x800782EC`.
- Parent/local xrefs show reads/writes to display-list pointer global
  `0x800E9BA0`, writes to active slot global `0x800C4C20`, reads from queue
  count/list globals `0x800C49D0` and `0x800C4C10`, source slot records rooted
  at `0x800F82C8`, and working record fields around `0x800E7A30..0x800E7AD0`.

## Static Shape

- The leaf prefix reads `0x800C49D0`, and the body starts with
  `s1 = count - 1`; negative count exits immediately.
- Walks the `0x800C4C10` queued slot list backwards, using each slot index to
  compute a 0xA8-byte source record under `0x800F82C8`.
- Stores the current slot index to `0x800C4C20`.
- Skips records that lack the expected flag/pointer state, otherwise copies the
  record into working record `0x800E7A30` through `0x80093060`.
- Calls helper `0x80078164`, then conditionally emits `DE00` display-list
  packets through global pointer `0x800E9BA0` and helpers `0x80173D84` and
  `0x80173DBC`.
- Emits another `DE00` packet before calling the working-record callback pointer
  at local `s3 + 0x18` / `0x800E7A48` through `jalr`.
- Emits an `E700` sync packet after the callback.
- When local flags permit, calls unresolved helper `0x800782EC` with
  halfword-like fields from the working record.
- Calls helper `0x800780D4`, copies the working record back to the source slot,
  then continues the reverse walk.
- On exit, stores `0x800C4C20 = -1` and returns.

## Boundaries

- The split starts at parent leaf boundary `0x00006EE8`, immediately after
  `boot_state_slot_callback_dispatch.s`.
- The `0x6EE8` two-word prefix stays with the `0x6EF0` prologue body because it
  loads the queue count used by the body and falls through directly.
- The helper has a normal epilogue at `0x71A0..0x71C4`.
- The next clean boundary is `0x000071C8`, a compact gate/wrapper helper called
  by `0x27A0`.

## Verification

After the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- Full `node tools\verify_setup.js` passed.
- The assembled report shows 1 tracked composite real-asm chunk made from 62
  tracked source files, plus 99 generated fallback chunks.
- The assembled code-region SHA256 remains
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- The rebuilt full-ROM SHA256 remains
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
