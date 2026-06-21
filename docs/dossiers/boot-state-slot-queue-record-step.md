# Boot State Slot Queue Record Step Split

Date: 2026-06-21

## Scope

This dossier records a static source-layout split of the Rev 0 permanent helper
immediately after the slot pool/table helper cluster:

| Source | ROM range | RAM range | Notes |
| --- | --- | --- | --- |
| `asm/original/rev0/boot/boot_state_slot_queue_record_step.s` | `0x000079EC..0x00007FF8` | `0x800775EC..0x80077BF8` | `0x79EC` prologue helper with frame size `0x68`; normal return at `0x7FEC..0x7FF4`. |
| `asm/original/rev0/code_00007FF8_00011000.s` | `0x00007FF8..0x00011000` | `0x80077BF8..0x80080C00` | Current tracked remainder; starts with the two-word prefix called by the queue service gate before `func_00008000`. |

The name is conservative. It records the static queue-record update shape, not
runtime-verified scheduler semantics.

## Static Evidence

- Parent `../scripts/ob64_functions.json` reports `0x79EC` as a prologue helper
  with frame size `0x68`.
- Parent symbol data places `0x79EC` at fixed RAM `0x800775EC` in all seven
  named states and all 21 snapshots.
- Parent callgraph reports the `0x71C8/0x71D0` queue service gate as the direct
  caller of `0x79EC`.
- Parent data reports secondary entries at `0x7F2C` and `0x7FF8`; local source
  shows `0x7F2C` is an internal branch target.
- The queue service gate also calls RAM `0x80077BF8`. Local source shows ROM
  `0x7FF8..0x8000` is an executable prefix that loads queue count
  `0x800C49D0` into `v0` before the `0x8000` prologue body, so this split leaves
  that prefix in the next remainder.

## Static Shape

- Reads halfword queue count `0x800C49D0` and returns when the count is not
  positive.
- Walks queued slot IDs from halfword list `0x800C4C10`.
- Computes each selected slot record as `0x800E82C8 + slot * 0xA8`.
- Requires record flag mask `0xE800` and byte field `+0x03 & 0x02 == 0`.
- If record flag bit `0x0400` is clear, sets it and zeros the record halfword at
  offset `+0x2C`.
- Adjusts one signed axis using fields near `+0x06/+0x0A/+0x28/+0x2D` and bound
  `0x140`.
- Adjusts a second signed axis using fields near `+0x08/+0x0C/+0x2A/+0x2C` and
  bound `0xF0`.
- Packs two low-byte values into the record halfword at offset `+0x2C`.
- If both axis paths complete in the same pass, clears record flag bits with
  mask `0xF3FF`.

## Boundaries

- The split starts at parent prologue boundary `0x000079EC`, immediately after
  `boot_state_slot_pool_table_helpers.s`.
- The helper loops back from `0x7FE4` to `0x7A18` while walking queued slots.
- `0x7F2C` is an internal branch target reached during the second axis update,
  not a separate source-layout entry.
- The helper returns through `0x7FEC..0x7FF4`.
- The next tracked remainder starts at `0x7FF8` because the queue service gate
  calls RAM `0x80077BF8`; those two prefix instructions feed the `0x8000`
  prologue body.

## Verification

After the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- Full `node tools\verify_setup.js` passed after docs were updated.
- The assembled report shows 1 tracked composite real-asm chunk made from 70
  tracked source files, plus 99 generated fallback chunks.
- The assembled code-region SHA256 remains
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- The rebuilt full-ROM SHA256 remains
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
