# Boot State Slot Queue F000 Record-Step / No-op Tail Split

Date: 2026-06-21

## Scope

This dossier records a static source-layout split of the Rev 0 permanent helper
immediately after the queue record-step helper:

| Source | ROM range | RAM range | Notes |
| --- | --- | --- | --- |
| `asm/original/rev0/boot/boot_state_slot_queue_f000_record_step.s` | `0x00007FF8..0x00008380` | `0x80077BF8..0x80077F80` | Queue-service callable `0x7FF8` prefix plus the `0x8000` prologue helper with frame size `0x30`; normal return at `0x8370..0x837C`. |
| `asm/original/rev0/boot/boot_state_slot_noop_return_tail.s` | `0x00008380..0x00008388` | `0x80077F80..0x80077F88` | Two-instruction `jr ra; nop` tail, matching a previously unresolved RAM call target. |
| `asm/original/rev0/code_00008388_00011000.s` | `0x00008388..0x00011000` | `0x80077F88..0x80080C00` | Remainder at this split; now superseded by `code_0000874C_00011000.s` after the slot record release cluster split. |

The name is conservative. It records the static queue-record update shape and
the `0xF000` record-mask gate, not runtime-verified scheduler semantics.

## Static Evidence

- Parent `../scripts/ob64_functions.json` reports `0x8000` as a 904-byte
  prologue helper with frame size `0x30`.
- Parent symbol data places `0x8000` at fixed RAM `0x80077C00` in all seven
  named states and all 21 snapshots.
- Parent data reports secondary entries at `0x8090` and `0x8380`.
- The queue service gate calls RAM `0x80077BF8`; local source shows ROM
  `0x7FF8..0x8000` is an executable prefix that loads queue count
  `0x800C49D0` into `v0` before falling into the `0x8000` body.
- Parent data reports high-confidence callee `0x8388` / RAM `0x80077F88`.
- Parent/local xrefs connect this unit to queue globals `0x800C49D0` and
  `0x800C4C10`, slot records rooted at corrected base `0x800E82C8`, and bound
  global `0x800E79A0`.
- Local source shows ROM `0x8380..0x8388` is exactly `jr ra; nop`. That matches
  the flagged dispatch/lookup dossier's earlier unresolved RAM target
  `0x80077F80`, so the tail is split as its own explicit source unit.

## Static Shape

- Reads halfword queue count `0x800C49D0` and returns when the count is not
  positive.
- Walks queued slot IDs from halfword list `0x800C4C10`.
- Computes each selected slot record as `0x800E82C8 + slot * 0xA8`.
- Requires record flag high nibble `0xF000` and byte field `+0x03 & 0x02 == 0`.
- Uses word global `0x800E79A0` as a bound/span-like value during endpoint and
  wrap checks.
- Calls `0x8388(slot)` when the record appears to hit terminal endpoint cases.
- If record flag bit `0x0400` is clear on the update path, initializes
  temporary/fraction fields around offsets `+0x28..+0x2E`.
- Updates signed position-like fields around offsets `+0x0A/+0x0C` from fields
  around `+0x04/+0x06/+0x08`, preserving byte/fraction carry state.

## Boundaries

- The split starts at `0x00007FF8`, the queue-service callable prefix left by
  the previous queue record-step split.
- The prefix stays with the `0x8000` body because it loads the queue count used
  by the first branch in the body and has a direct fallthrough.
- The helper returns through `0x8370..0x837C`.
- `0x8380..0x8388` is a separate no-op return tail and not part of the
  preceding prologue helper's normal epilogue.
- The next tracked remainder starts at `0x8388`, the next parent prologue
  boundary and the callee used by this unit and earlier slot helpers. That
  range is now promoted, and later display-list splits have advanced the active
  remainder to `code_0000978C_00011000.s`.

## Verification

After the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- Full `node tools\verify_setup.js` passed after docs were updated.
- The assembled report shows 1 tracked composite real-asm chunk made from 72
  tracked source files, plus 99 generated fallback chunks.
- The assembled code-region SHA256 remains
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- The rebuilt full-ROM SHA256 remains
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
