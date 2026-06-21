# Boot Mode/Flag Helper Split

Date: 2026-06-21

## Scope

This dossier records a static source-layout split of the Rev 0 permanent boot
code after the early boot state loop:

| Source | ROM range | RAM range | Notes |
| --- | --- | --- | --- |
| `asm/original/rev0/boot/boot_mode_message_select.s` | `0x00002B38..0x00002BD8` | `0x80072738..0x800727D8` | Keeps overlapping scanner entries `0x2B38/0x2B40` together. |
| `asm/original/rev0/boot/boot_flag_table_reset.s` | `0x00002BD8..0x00002CBC` | `0x800727D8..0x800728BC` | Keeps the adjacent unlabeled `0x2C4C` flag-adjust block with parent `0x2BD8`. |
| `asm/original/rev0/boot/boot_status_flag_set.s` | `0x00002CBC..0x00002D00` | `0x800728BC..0x80072900` | Sets bit `0x01` in byte `0x800BEF9A`. |
| `asm/original/rev0/boot/boot_status_flag_clear.s` | `0x00002D00..0x00002D44` | `0x80072900..0x80072944` | Masks byte `0x800BEF9A` with `0xFA`. |
| `asm/original/rev0/boot/boot_status_flag_test.s` | `0x00002D44..0x00002D7C` | `0x80072944..0x8007297C` | Returns bit `0x04` from byte `0x800BEF9A`. |

The names are conservative source-layout labels, not final C API names.

## Static Evidence

- Parent symbols report `0x2B38` as a 160-byte leaf and `0x2B40` as an
  overlapping 152-byte prologue. Direct calls target `0x80072738`, not
  `0x80072740`, so this split keeps both entries in one file.
- `boot_mode_message_select.s` reads `0x80000300`, compares that value and the
  incoming `a0` against `1`, `2`, and `9`, selects one of four pointer tables
  at `0x800BB960`, `0x800BB9B0`, `0x800BBA00`, or `0x800BBA50`, then calls
  `0x800955C0`.
- `boot_flag_table_reset.s` clears four rows of 16 halfwords at `0x800BEE90`
  and `0x800BEF10`, then clears `0x18` bytes at `0x800BEE78` through common
  helper `0x80093380`.
- The no-label block at `0x2C4C..0x2CBC` reads status byte `0x800BEF9A` and
  halfword `0x800C4BF0`, then conditionally clears bit `0x02` or sets bits
  `0x02/0x04`. Because parent symbols include this range in `0x2BD8`, it stays
  with the reset file for now.
- The set/clear/test helpers all bracket their byte access with calls to
  `0x8008B820`. Static evidence suggests an interrupt/scheduler guard, but that
  semantic name is not promoted without runtime proof.

## Boundaries

- `0x00002BD8`, `0x00002CBC`, `0x00002D00`, and `0x00002D44` are normal
  prologue starts in the parent function scan.
- `0x00002D7C` starts a larger 1,792-byte routine that touches several tables
  (`0x800F9C08`, `0x800BEE78`, `0x800C6D60`, `0x800C47F0`, `0x800E79BC`,
  `0x800BEE90`, `0x800E79B0`, `0x800F8100`) and calls `0x8008B600`
  (`ROM 0x0001AA00`). It remains the next remainder target.

## Verification

After the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- Full `node tools\verify_setup.js` should remain the required gate before
  committing source-layout work.

