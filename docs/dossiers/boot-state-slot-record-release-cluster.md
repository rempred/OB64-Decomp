# Boot State Slot Record Release / Payload / Queue Rebuild Cluster Split

Date: 2026-06-21

## Scope

This dossier records a static source-layout split of the Rev 0 permanent helper
cluster immediately after the queue F000 record-step helper:

| Source | ROM range | RAM range | Notes |
| --- | --- | --- | --- |
| `asm/original/rev0/boot/boot_state_slot_record_release_recursive.s` | `0x00008388..0x000084D4` | `0x80077F88..0x800780D4` | `0x8388` prologue helper, recursive slot-record release/cleanup shape, frame size `0x20`. |
| `asm/original/rev0/boot/boot_state_slot_payload_alloc_copy.s` | `0x000084D4..0x00008564` | `0x800780D4..0x80078164` | `0x84D4` prologue helper, allocates and copies a length-prefixed payload, frame size `0x28`. |
| `asm/original/rev0/boot/boot_state_slot_payload_copy_free.s` | `0x00008564..0x0000859C` | `0x80078164..0x8007819C` | `0x8564` prologue helper, copies payload bytes out of a non-null buffer then frees it. |
| `asm/original/rev0/boot/boot_state_slot_queue_rebuild_priority_order.s` | `0x0000859C..0x000086EC` | `0x8007819C..0x800782EC` | `0x859C` prologue helper, rebuilds queue globals from active slot records by a halfword order field. |
| `asm/original/rev0/boot/boot_state_slot_render_noop_tail.s` | `0x000086EC..0x00008700` | `0x800782EC..0x80078300` | `jr ra; nop` target plus trailing nop padding; resolves prior render-walk unresolved target `0x800782EC`. |
| `asm/original/rev0/boot/boot_state_record_copy_58_leaf.s` | `0x00008700..0x0000874C` | `0x80078300..0x8007834C` | No-prologue leaf that copies `0x58` bytes from `a1` to `a0`. |
| `asm/original/rev0/code_0000874C_00011000.s` | `0x0000874C..0x00011000` | `0x8007834C..0x80080C00` | Remainder at this split; now superseded by `code_00008A58_00011000.s` after the transform-record split. |

Names are conservative static labels. They describe local source shape and
known utility calls; they do not prove runtime scheduler or renderer semantics.

## Static Evidence

- Parent symbol/callgraph data reports `0x8388` as a 332-byte permanent
  prologue helper with frame size `0x20`, fixed RAM `0x80077F88` in all seven
  named states and all 21 snapshots.
- High-confidence callers of `0x8388` are `0x69D8`, `0x7568`, `0x7600`,
  `0x7688`, `0x8000`, and itself. High-confidence callees are `0x8388`,
  `resource_free` (`0x16C4`, count 2), and common helper `0x23780`.
- Parent xrefs and local source connect `0x8388` to slot-record base
  `0x800E82C8`, byte `+0x03` (`0x800E82CB`), word callback/pointer field
  `+0x1C` (`0x800E82E4`), ten-entry pointer area `+0x38`, word field `+0x24`,
  and provenance-like halfword `+0xA2` (`0x800E836A`).
- Parent data reports `0x84D4`, `0x8564`, and `0x859C` as permanent prologue
  helpers fixed in all seven named states and all 21 snapshots, with no
  unresolved v2 targets.
- `0x84D4` is called by the slot callback dispatch and render callback walk
  helpers; it calls `resource_alloc_mode1_wrapper` (`0x1688`) and copy helper
  `0x23460`.
- `0x8564` is called by the same slot callback/render helpers; it calls copy
  helper `0x23460` and `resource_free` (`0x16C4`).
- `0x859C` is called by global reset, slot callback dispatch, and queue service
  gate; parent xrefs show it writes queue count `0x800C49D0` and reads/writes
  queue list `0x800C4C10` plus record order field `0x800E82D6`.
- The earlier render callback walk had unresolved RAM target `0x800782EC`.
  Local source resolves ROM `0x86EC..0x8700` to a no-op return target and
  trailing nop padding.
- ROM `0x8700..0x874C` has no parent symbol entry, but local source shows a
  clean no-prologue leaf: it copies five 16-byte blocks plus two final words and
  returns at `0x8744..0x8748`.

## Static Shape

- `0x8388` computes `slot * 0xA8`, checks record byte `+0x03` bit `0x08`, and
  recursively releases peer records whose active flag is set and whose `+0xA2`
  field points back to the target slot.
- The same helper dispatches an optional record callback/pointer at `+0x1C`,
  frees non-null entries in a ten-word area at record `+0x38`, frees the word at
  record `+0x24`, then calls `0x23780(record, 0xA8)` to clear or reset the
  record bytes.
- `0x84D4` treats a zero length as a null output pointer. Otherwise, if the low
  bit of its first argument is clear, it allocates `length + 6`, stores a tag
  byte and duplicate halfword lengths in the header, copies payload bytes into
  `buffer + 6`, and stores the allocated pointer through its output argument.
- `0x8564` accepts a possibly null payload pointer; when non-null, it copies
  `length = [ptr + 2]` bytes from `ptr + 6` to the caller buffer and frees the
  payload pointer.
- `0x859C` clears queue count `0x800C49D0`, scans six slot records for active
  flag bit `0x8000`, inserts slot IDs into `0x800C4C10` according to halfword
  order field `+0x0E`, increments the count, then rewrites nonzero order fields
  into a compact descending sequence.
- `0x86EC` is intentionally a no-op target.
- `0x8700` copies exactly `0x58` bytes from source pointer `a1` to destination
  pointer `a0`.

## Boundaries

- The split starts at `0x00008388`, the current remainder's first parent
  prologue boundary.
- `0x8388`, `0x84D4`, `0x8564`, and `0x859C` each have parent symbol/callgraph
  evidence and normal returns at their exclusive ends.
- `0x86EC` is split separately because an earlier helper calls RAM
  `0x800782EC` directly.
- `0x8700` is split separately because it is a compact self-contained copy leaf
  before the next parent boundary.
- The next tracked remainder at this split started at `0x874C`, where parent
  data records an overlapping `0x874C` leaf and `0x8754` prologue body. That
  leaf/body pair is now promoted as
  `asm/original/rev0/boot/boot_display_list_transform_record_emit.s`;
  subsequent display-list splits now leave `code_0000906C_00011000.s` as the
  active remainder.

## Verification

After the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- Full `node tools\verify_setup.js` passed after docs were updated.
- The assembled report shows 1 tracked composite real-asm chunk made from 78
  tracked source files, plus 99 generated fallback chunks.
- The assembled code-region SHA256 remains
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- The rebuilt full-ROM SHA256 remains
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
