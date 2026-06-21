# Boot Table/Mask Reconcile Split

Date: 2026-06-21

## Scope

This dossier records a static source-layout split of the Rev 0 permanent boot
routine at:

- Source: `asm/original/rev0/boot/boot_table_mask_reconcile.s`
- ROM range: `0x00002D7C..0x0000347C`
- RAM range: `0x8007297C..0x8007307C`
- Parent function: `func_00002D7C`

The name is conservative. The routine clearly updates halfword masks and table
state, but this is not a final C API name.

## Boundary Evidence

- Parent `../scripts/ob64_functions.json` reports `0x00002D7C` as a
  1,792-byte prologue function with frame size `0x58`, no indirect jumps, and
  end `0x00003478`.
- The instruction at `0x00003478` is the `jr ra` delay slot
  (`addiu sp, sp, 0x58`), so the source split owns bytes through exclusive end
  `0x0000347C`.
- Parent `../scripts/ob64_callgraph_v2.json` reports two high-confidence
  callers: `0x000022B0` and `0x000027A0`.
- The only high-confidence callee is `0x0001AA00` / RAM `0x8008A600`.
- Parent `../scripts/ob64_function_states.json` and
  `../scripts/ob64_overlay_map.json` locate this function at RAM
  `0x8007297C` in all seven named states and all 21 RAM snapshots, so the simple
  boot mapping still applies.

## Static Shape

- The routine starts from halfwords at `0x800F9C08` and `0x800F9C0A`, combines
  them into a 16-bit threshold/window value, and calls `0x8008A600` with
  `0x800BEE78`.
- It uses count/global tables around:
  - `0x800C6D60`
  - `0x800C47F0`
  - `0x800BEE90`
  - `0x800BEF10`
  - `0x800BEF90`
  - `0x800BEF94`
  - `0x800E797C`
  - `0x800E79B0`
  - `0x800E79BC`
  - `0x800E7A24`
  - `0x800F8100`
- The first main loop normalizes bit fields in record halfwords, mirrors masks
  into `0x800E79BC` / `0x800F8100`, updates `0x800C4BD0`, and clamps signed
  bytes at record offsets `+2` and `+3` into the observed range
  `-0x3D..0x3D`.
- The second main loop reads per-slot selector bytes at `0x800BEF90` and
  `0x800BEF94` and toggles halfword flags including `0x0100`, `0x0200`,
  `0x0400`, and `0x0800` based on signed byte thresholds.
- The final loop copies or swaps six halfword streams between current-state
  tables and saved/mirrored tables, then restores registers and returns.

## Next Boundary

The next remainder starts at `0x0000347C`. Parent symbols report this as a
528-byte prologue with a secondary entry at `0x00003564`; it calls
`0x800955C0`, `0x80095610`, and `0x800957D0`. Keep `0x347C..0x368C` together
next pass unless stronger evidence safely separates the secondary entry.

## Verification

After the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- Full `node tools\verify_setup.js` should remain the required commit gate.

