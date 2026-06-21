# Boot State Slot Target Peer Record Dispatch Split

Date: 2026-06-21

## Scope

This dossier records a static source-layout split of the compact Rev 0
permanent helper immediately after the current peer-record flag mark helper:

| Source | ROM range | RAM range | Notes |
| --- | --- | --- | --- |
| `asm/original/rev0/boot/boot_state_slot_target_peer_record_dispatch.s` | `0x00007600..0x00007688` | `0x80077200..0x80077288` | `0x7600` prologue helper and final delay slot at `0x7684`. |
| `asm/original/rev0/code_00007688_00011000.s` | `0x00007688..0x00011000` | `0x80077288..0x80080C00` | Current tracked remainder. |

The name is conservative. It records the static target-slot peer-record scan
and helper dispatch shape, not runtime-verified scheduler semantics.

## Static Evidence

- Parent `../scripts/ob64_functions.json` reports `0x7600` as a 136-byte
  prologue helper with frame size `0x20` and clean end `0x7688`.
- Parent symbol data places `0x7600` at fixed RAM `0x80077200` in all seven
  named states and all 21 snapshots.
- Parent callgraph reports no direct v2 callers for `0x7600`.
- High-confidence callee is `0x8388` / RAM `0x80077F88`.
- Parent/local xrefs show reads of slot-record halfword `0x800E82C8` and signed
  record field `0x800E836A`.
- The slot-record base remains the corrected signed address `0x800E82C8`, not
  stale `0x800F82C8`; the source uses `lui 0x800F` with signed negative
  displacements such as `-0x7D38`.

## Static Shape

- The helper saves incoming `a0` as the target slot in `s2`.
- It returns immediately when the target slot is negative.
- Otherwise it scans six 0xA8-byte records rooted at `0x800E82C8`.
- It skips the target slot, then requires record flag bit `0x8000`.
- It reads signed record field `+0xA2` and requires it to equal the target slot.
- For each matching peer record it calls `0x80077F88(slot)`.

## Boundaries

- The split starts at parent prologue boundary `0x00007600`, immediately after
  `boot_state_slot_current_peer_record_flag_mark.s`.
- The helper has a normal epilogue at `0x7670..0x7684`.
- The clean exclusive end is `0x7688`, the next parent prologue boundary.
- The next source frontier is the `0x7688` prologue helper, which calls
  `0x80077F80`, checks status `0x800C4C26`, scans the same corrected-base
  slot-record array, calls `0x80077F88`, and includes a secondary entry at
  `0x7714`.

## Verification

After the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- Full `node tools\verify_setup.js` passed after docs were updated.
- The assembled report shows 1 tracked composite real-asm chunk made from 67
  tracked source files, plus 99 generated fallback chunks.
- The assembled code-region SHA256 remains
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- The rebuilt full-ROM SHA256 remains
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
