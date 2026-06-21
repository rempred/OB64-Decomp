# Boot State Slot Pool/Table Helpers Split

Date: 2026-06-21

## Scope

This dossier records a static source-layout split of the Rev 0 permanent helper
cluster immediately after the status-gated slot dispatch/lookup helper:

| Source | ROM range | RAM range | Notes |
| --- | --- | --- | --- |
| `asm/original/rev0/boot/boot_state_slot_pool_table_helpers.s` | `0x00007768..0x000079EC` | `0x80077368..0x800775EC` | `0x7768` prologue helper, ten-entry pool scan leaves, pointer-table install helper, and final delay slot at `0x79E8`. |
| `asm/original/rev0/code_000079EC_00011000.s` | `0x000079EC..0x00011000` | `0x800775EC..0x80080C00` | Remainder at this split; superseded by `code_00007FF8_00011000.s`. |

The name is conservative. It records the static ten-entry slot-pool scans and
pointer-table install shape, not runtime-verified scheduler semantics.

## Static Evidence

- Parent `../scripts/ob64_functions.json` reports `0x7768` as a 644-byte
  prologue helper with frame size `0x18`.
- Parent symbol data places `0x7768` at fixed RAM `0x80077368` in all seven
  named states and all 21 snapshots.
- Older parent symbol data reports callers `0x69D8`, `0xEBBC0`, and `0xED530`.
  The overlay-aware v2 callgraph currently has no resolved callers for this
  helper.
- Parent records secondary entries at `0x77D4`, `0x789C`, and `0x7924`; local
  source also shows clean scan-leaf entries at `0x780C` and `0x785C`, plus the
  pointer-table install entry shape beginning at `0x7894`.
- Parent old call data folds the callee to `0x23908`; parent v2 leaves literal
  target `0x80093540` unresolved. Local search shows `0x80093540` is an
  interior entry inside the shared diagnostic/assert helper whose prologue is
  ROM `0x23908` / RAM `0x80093508`.
- Local source confirms the clean exclusive end is `0x79EC`: `0x79E4` is
  `jr ra`, `0x79E8` is the delay-slot store, and `0x79EC` is the next prologue.

## Static Shape

- The `0x7768` primary entry computes `a0 * 0xA8`, scans ten words beginning at
  computed base `0x800E8300`, and returns the first zero index.
- If the computed `0x800E8300 + a0 * 0xA8` ten-entry pool has no zero word, the
  helper calls `0x80093540(0x800ADF88)` and then parks in a self-loop.
- The `0x77D4` leaf scans ten words rooted at `0x800E7A68` and returns the
  first empty index or `-1`.
- The `0x780C` leaf computes `a0 * 0xA8`, scans ten words rooted at
  `0x800E8328 + a0 * 0xA8`, and returns the first empty index or `-1`.
- The `0x785C` leaf scans ten words rooted at `0x800E7A90` and returns the
  first empty index or `-1`.
- The trailing helper loads halfword global `0x800C4C10`, compares it with
  incoming `a0`, then installs one of two pointer-table sets into globals around
  `0x800C48xx..0x800C4Cxx`, `0x800E79xx..0x800E7Dxx`, and
  `0x800F81xx..0x800F9Bxx`.

## Boundaries

- The split starts at parent prologue boundary `0x00007768`, immediately after
  `boot_state_slot_flagged_dispatch_lookup.s`.
- Local scan leaves at `0x77D4`, `0x780C`, and `0x785C` each end with a normal
  `jr ra`.
- The pointer-table install helper uses two branches that join at `0x79E0`,
  then returns via `jr ra` at `0x79E4` with delay-slot store at `0x79E8`.
- The clean exclusive end is `0x79EC`, the next parent prologue boundary.
- Parent `functions.json` displays the range awkwardly around `0x79E8`, but the
  delay-slot store must remain in this split for exact source ownership.

## Verification

After the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- Full `node tools\verify_setup.js` passed after docs were updated.
- The assembled report shows 1 tracked composite real-asm chunk made from 69
  tracked source files, plus 99 generated fallback chunks.
- The assembled code-region SHA256 remains
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- The rebuilt full-ROM SHA256 remains
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
