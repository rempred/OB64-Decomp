# Boot Resource Validation Realloc Trees

Static/offline dossier for the fourth Rev 0 source-layout split.

## Source Files

| Source | ROM range | RAM range | Notes |
|---|---:|---:|---|
| `asm/original/rev0/boot/resource_ptr_validate.s` | `0x000018D4..0x00001A44` | `0x800714D4..0x80071644` | Static allocator header/link validator with debug-print failure paths. |
| `asm/original/rev0/boot/resource_realloc.s` | `0x00001A44..0x00001DE8` | `0x80071644..0x800719E8` | Realloc-like helper; keeps secondary unlink entry `0x1D50`. |
| `asm/original/rev0/boot/resource_tree_insert_find.s` | `0x00001DE8..0x00001E74` | `0x800719E8..0x80071A74` | Keeps recursive insert entry `0x1DE8` and search/fit helper `0x1E3C`. |
| `asm/original/rev0/boot/resource_rebuild_free_trees.s` | `0x00001E74..0x00001F9C` | `0x80071A74..0x80071B9C` | Keeps flag-load prefix `0x1E74` with `func_00001E7C`. |
| `asm/original/rev0/boot/resource_find_arena_index.s` | `0x00001F9C..0x00002004` | `0x80071B9C..0x80071C04` | Keeps count-load prefix `0x1F9C` with `func_00001FA4`. |
| `asm/original/rev0/boot/resource_alloc_tree_scan.s` | `0x00002004..0x000022B0` | `0x80071C04..0x80071EB0` | Allocator-family helper with secondary scan entry `0x2274`. |

The simple linear mapping is valid here because these ROM offsets are still in
the permanent boot/resource region below roughly `0x0002F000`.

## Parent Evidence

Source: parent `../scripts/ob64_symbols_v2.json` and
`../docs/mips-decode.md`.

- `0x000018D4`: prologue, 24-byte stack frame, 368 bytes, active in all seven
  known states, calls helper `0x00001F9C`.
- `0x00001A44`: prologue, 40-byte stack frame, 932 bytes, active in all seven
  known states, secondary entry at `0x00001D50`.
- `0x00001DE8`: prologue, 24-byte stack frame, 140 bytes, 11 parent callers,
  secondary entry at `0x00001E3C`.
- `0x00001E74`: leaf/prefix range, 296 bytes, 2 parent callers.
- `0x00001F9C`: leaf/prefix range, 104 bytes, 3 parent callers.
- `0x00002004`: prologue, 48-byte stack frame, 684 bytes, 27 parent callers,
  secondary entry at `0x00002274`.
- `0x000022B0`: next boundary, parent-labeled
  `dma/resource::resource loader` and `dispatcher/state-machine`.

## Static Findings

- `resource_ptr_validate` checks 16-byte alignment, arena bounds from
  `0x800BEDB0/0x800BEDB4`, allocator header back/forward pointers, and emits
  debug-print calls through `0x80093540` on failure paths. The small helpers at
  `0x1A34` and `0x1A3C` are kept in this source file because the parent scanner
  treats the whole range as one function-sized block.
- `resource_realloc` has realloc-like static behavior: if the size argument is
  zero it frees and returns zero; if the pointer is zero it allocates; otherwise
  it can shrink/split the allocation, allocate a larger replacement, copy the old
  payload through `0x80093060`, then release/relink the old block. The parent
  secondary entry at `0x1D50` performs tree/list unlink work and is called by
  earlier allocator/free code at RAM `0x80071950`.
- `resource_tree_insert_find` inserts nodes into the free-size tree through
  `+0x0C/+0x10` child links and has a secondary search/fit entry at `0x1E3C`.
- `resource_rebuild_free_trees` clears arena free-tree roots and reinserts free
  nodes while walking arena spans.
- `resource_find_arena_index` scans arena start/end records and returns the
  matching arena index for a pointer-like address.
- `resource_alloc_tree_scan` allocates from free-tree candidates and keeps its
  secondary scan entry at `0x2274` in the same source file.

## Caution

The file names are source-layout names inferred from static allocator table,
header, and free-tree behavior. They are not final C API claims until runtime or
controlled mutation evidence confirms exact semantics.

## Verification

- Baseline `node tools\verify_setup.js`: PASS.
- `node tests\binutils_smoke.js`: PASS after split.
- `node tools\assemble_original_mips.js`: PASS after split; code-region SHA256
  remains `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- Full `node tools\verify_setup.js`: PASS after split; source mix is 1 tracked
  composite real-asm chunk made from 15 tracked files plus 99 generated fallback
  chunks, and full ROM SHA256 remains
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
