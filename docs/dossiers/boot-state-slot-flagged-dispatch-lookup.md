# Boot State Slot Flagged Dispatch/Lookup Split

Date: 2026-06-21

## Scope

This dossier records a static source-layout split of the Rev 0 permanent helper
immediately after the target peer-record dispatch helper:

| Source | ROM range | RAM range | Notes |
| --- | --- | --- | --- |
| `asm/original/rev0/boot/boot_state_slot_flagged_dispatch_lookup.s` | `0x00007688..0x00007768` | `0x80077288..0x80077368` | `0x7688` prologue helper, secondary entry `0x7714`, and final delay slot at `0x7764`. |
| `asm/original/rev0/code_00007768_00011000.s` | `0x00007768..0x00011000` | `0x80077368..0x80080C00` | Remainder at this split; superseded by `code_000079EC_00011000.s`. |

The name is conservative. It records the static status-gated slot flag dispatch
and record lookup shape, not runtime-verified scheduler semantics.

## Static Evidence

- Parent `../scripts/ob64_functions.json` reports `0x7688` as a 224-byte
  prologue helper with frame size `0x20`, clean end `0x7768`, and secondary
  entry `0x7714`.
- Parent symbol data places `0x7688` at fixed RAM `0x80077288` in all seven
  named states and all 21 snapshots.
- High-confidence v2 caller is `0x69D8`, the earlier slot callback dispatch
  helper.
- High-confidence callee is `0x8388` / RAM `0x80077F88`.
- Parent v2 leaves call target `0x80077F80` unresolved. Local source inspection
  resolves it to ROM `0x8380..0x8388`, a two-instruction `jr ra; nop` secondary
  tail immediately before the `0x8388` prologue helper.
- Parent/local xrefs show reads of status halfword `0x800C4C26`, slot-record
  halfword `0x800E82C8`, slot-record byte `0x800E82CB`, and slot-record word
  `0x800E82D8`.
- Local source search found no direct local source call to the `0x7714`
  secondary leaf; keep it with the parent `0x7688` helper until stronger
  evidence argues for a separate source file.
- The slot-record base remains the corrected signed address `0x800E82C8`, not
  stale `0x800F82C8`; the source uses `lui 0x800F` with signed negative
  displacements such as `-0x7D38`.

## Static Shape

- The primary entry first calls the no-op-style `0x80077F80` secondary tail.
- It reads status halfword `0x800C4C26` and returns without scanning when the
  value is `0xFFFF`.
- Otherwise it scans six 0xA8-byte records rooted at `0x800E82C8`.
- For each record, it requires flag bit `0x8000`.
- It then requires byte field `+0x03` bit `0x04`.
- For each matching flagged record it calls `0x80077F88(slot)`.
- The `0x7714` secondary leaf scans the same six records for word field
  `+0x10` matching incoming `a0`, returning the matching slot index or `-1`.

## Boundaries

- The split starts at parent prologue boundary `0x00007688`, immediately after
  `boot_state_slot_target_peer_record_dispatch.s`.
- The primary entry has a normal epilogue at `0x7700..0x7710`.
- The `0x7714` secondary leaf has a normal `jr ra` at `0x7760` with delay-slot
  `nop` at `0x7764`.
- The clean exclusive end is `0x7768`, the next parent prologue boundary.
- The next source frontier at that time was the `0x7768` prologue helper. It is
  now promoted as `boot_state_slot_pool_table_helpers.s`, and the active
  remainder starts at `code_000079EC_00011000.s`.

## Verification

After the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- Full `node tools\verify_setup.js` passed after docs were updated.
- The assembled report shows 1 tracked composite real-asm chunk made from 68
  tracked source files, plus 99 generated fallback chunks.
- The assembled code-region SHA256 remains
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- The rebuilt full-ROM SHA256 remains
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
