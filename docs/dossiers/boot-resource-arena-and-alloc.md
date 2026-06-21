# Boot Resource Arena And Alloc

Static/offline dossier for the second Rev 0 source-layout split.

## Source Files

| Source | ROM range | RAM range | Notes |
|---|---:|---:|---|
| `asm/original/rev0/boot/resource_arena_init.s` | `0x00001060..0x00001120` | `0x80070C60..0x80070D20` | Parent symbol `0x00001060`, prologue, 192 bytes. |
| `asm/original/rev0/boot/resource_arena_register.s` | `0x00001120..0x00001330` | `0x80070D20..0x80070F30` | Keeps the overlapping `0x1120` leaf entry, `0x1128` prologue entry, and `0x1314` secondary entry together. |
| `asm/original/rev0/boot/resource_alloc.s` | `0x00001330..0x000014DC` | `0x80070F30..0x800710DC` | Parent seed label `resource_alloc`, 428 bytes. |

The simple linear mapping is valid here because these ROM offsets are in the
permanent boot/resource region below roughly `0x0002F000`.

## Parent Evidence

Source: parent `../scripts/ob64_symbols_v2.json` and
`../docs/mips-decode.md`.

- `0x00001060`: prologue, 32-byte stack frame, 5 parent callers, all 21 RAM
  snapshots locate it at `0x80070C60`, active in all seven known states.
- `0x00001120`: leaf entry, 500-byte scanner size, 2 parent callers, all 21
  RAM snapshots locate it at `0x80070D20`.
- `0x00001128`: prologue entry inside the same source range, 48-byte frame,
  scanner secondary entry at ROM `0x00001314`.
- `0x00001330`: seed label `resource_alloc`, prologue, 64-byte stack frame,
  314 parent callers, all 21 RAM snapshots locate it at `0x80070F30`.

## Static Findings

- The split block manages a small table rooted around `0x800BEDB0`.
- `resource_arena_init` aligns an input start/end pair to 16-byte boundaries,
  writes the first table record, calls `0x80093380` with a `0x20` byte size,
  calls `0x800719E8`, clears `0x800C4818`, sets count `0x800BEDE0 = 1`, sets
  mode/flags `0x800BEDE2 = 3`, and records an end pointer at `0x800BEDB4`.
- `resource_arena_register` keeps the `0x1120` load-count entry and `0x1128`
  prologue together because the scanner reports overlapping function entries.
  It checks the count against a four-record limit, checks candidate ranges
  against existing table records, and enters debug-print infinite loops on
  invalid count or overlap paths.
- `resource_alloc` aligns requested size to 16 bytes, accounts for a `0x20`
  byte header/control area, consults the arena count/mode fields, and calls
  `0x80071A3C` while scanning candidate records.

## Caution

The file names are conservative source-layout names derived from static table
behavior plus the parent seed label for `resource_alloc`. They are not a final C
API contract. Runtime or controlled mutation evidence is still required before
turning these globals into named structs or claiming exact allocator semantics.

## Verification

- Baseline `node tools\verify_setup.js`: PASS.
- `node tests\binutils_smoke.js`: PASS after split.
- `node tools\assemble_original_mips.js`: PASS after split; code-region SHA256
  remains `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- Full `node tools\verify_setup.js`: PASS after split; full ROM SHA256 remains
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
