# Boot State Slot Current Peer Record Flag Mark Split

Date: 2026-06-21

## Scope

This dossier records a static source-layout split of the compact Rev 0
permanent helper immediately after the boot resource global handle slot record
prepare helper:

| Source | ROM range | RAM range | Notes |
| --- | --- | --- | --- |
| `asm/original/rev0/boot/boot_state_slot_current_peer_record_flag_mark.s` | `0x00007560..0x00007600` | `0x80077160..0x80077200` | Leaf prefix at `0x7560`, `0x7568` prologue body, and final delay slot at `0x75FC`. |
| `asm/original/rev0/code_00007600_00011000.s` | `0x00007600..0x00011000` | `0x80077200..0x80080C00` | Current tracked remainder. |

The name is conservative. It records the static current-slot peer-record scan
and working-record flag mark, not runtime-verified scheduler semantics.

## Static Evidence

- Parent `../scripts/ob64_functions.json` reports `0x7568` as a 152-byte
  prologue helper with frame size `0x20` and clean end `0x7600`.
- The scanner does not report `0x7560` as a standalone function; local source
  inspection shows it is a two-word prefix that loads the active-slot global
  consumed by the `0x7568` body.
- Parent symbol data places `0x7568` at fixed RAM `0x80077168` in all seven
  named states and all 21 snapshots.
- Parent callgraph reports no direct v2 callers for `0x7568`.
- High-confidence callee is `0x8388` / RAM `0x80077F88`.
- Parent/local xrefs show reads of active-slot global `0x800C4C20`, reads of
  slot-record halfword `0x800E82C8`, reads of signed record field
  `0x800E836A`, and read/write access to working-record byte `0x800E7A32`.
- The slot-record base remains the corrected signed address `0x800E82C8`, not
  stale `0x800F82C8`; the source uses `lui 0x800F` with signed negative
  displacements such as `-0x7D38`.

## Static Shape

- The `0x7560` prefix reads `0x800C4C20` into `v0`.
- The `0x7568` body returns immediately when that active slot is negative.
- Otherwise it scans six 0xA8-byte records rooted at `0x800E82C8`.
- It skips the current active slot, then requires record flag bit `0x8000`.
- It reads signed record field `+0xA2` and requires it to equal the active-slot
  global.
- For each matching peer record it calls `0x80077F88(slot)`.
- After the scan, it sets bit `0x02` in working-record byte `0x800E7A32`.

## Boundaries

- The split starts at `0x00007560`, immediately after
  `boot_resource_global_handle_slot_record_prepare.s`.
- The two-word `0x7560` prefix stays with the `0x7568` prologue body because it
  loads the active-slot value tested by the body before any independent entry
  label.
- The helper has a normal epilogue at `0x75EC..0x75FC`.
- The clean exclusive end is `0x7600`, the next parent prologue boundary.
- The next source frontier is the `0x7600` prologue helper, which takes a target
  slot in `a0`, scans the same corrected-base slot-record array, and calls
  `0x80077F88`.

## Verification

After the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- Full `node tools\verify_setup.js` passed after docs were updated.
- The assembled report shows 1 tracked composite real-asm chunk made from 66
  tracked source files, plus 99 generated fallback chunks.
- The assembled code-region SHA256 remains
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- The rebuilt full-ROM SHA256 remains
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
