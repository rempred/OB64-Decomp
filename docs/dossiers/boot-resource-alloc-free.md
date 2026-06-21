# Boot Resource Alloc Free

Static/offline dossier for the third Rev 0 source-layout split.

## Source Files

| Source | ROM range | RAM range | Notes |
|---|---:|---:|---|
| `asm/original/rev0/boot/resource_alloc_alt_scan.s` | `0x000014DC..0x00001688` | `0x800710DC..0x80071288` | Allocator-family scan. Name is conservative; parent has no seed label here. |
| `asm/original/rev0/boot/resource_alloc_mode1_wrapper.s` | `0x00001688..0x000016C4` | `0x80071288..0x800712C4` | Saves/restores `0x800BEDE2`, forces mode `1`, calls seed `resource_alloc`. |
| `asm/original/rev0/boot/resource_free.s` | `0x000016C4..0x000017EC` | `0x800712C4..0x800713EC` | Parent seed label `resource_free`, 427 callers. |
| `asm/original/rev0/boot/resource_largest_free_block.s` | `0x000017EC..0x000018D4` | `0x800713EC..0x800714D4` | Keeps the `0x17EC/0x17F0` flag-load prefix with `func_000017F4`. |

The simple linear mapping is valid here because these ROM offsets are still in
the permanent boot/resource region below roughly `0x0002F000`.

## Parent Evidence

Source: parent `../scripts/ob64_symbols_v2.json` and
`../docs/mips-decode.md`.

- `0x000014DC`: prologue, 64-byte stack frame, 428 bytes, active in all seven
  known states. No parent callers or seed label; it uses the same allocator
  globals as `resource_alloc`.
- `0x00001688`: prologue, 24-byte stack frame, 60 bytes, 15 parent callers,
  calls seed `resource_alloc` at ROM `0x00001330` / RAM `0x80070F30`.
- `0x000016C4`: seed label `resource_free`, prologue, 32-byte stack frame,
  296 bytes, 427 parent callers.
- `0x000017F4`: prologue-like scanner entry, 8-byte stack frame, 224 bytes.
  The two words at `0x17EC/0x17F0` load `0x800BEDE2` and are kept with this
  source file instead of stranded in the previous function.
- `0x000018D4`: next prologue boundary, 368 bytes; this is the next split
  point after the current dossier.

## Static Findings

- `resource_alloc_alt_scan` aligns requested size to 16 bytes, adds the same
  `0x20` byte header/control allowance used by seed `resource_alloc`, consults
  `0x800BEDE2` and `0x800BEDE0`, and scans arena records rooted at
  `0x800BEDB8`.
- `resource_alloc_mode1_wrapper` preserves the old `0x800BEDE2` value, stores
  `1` there for the duration of a `resource_alloc` call, then restores the old
  value before returning the allocator result.
- `resource_free` treats the user pointer as having an allocation header at
  negative offsets (`-0x20`, `-0x1C`, `-0x8`), relinks neighboring records,
  updates free-space fields, reinserts free nodes with `0x800719E8`, and bumps
  `0x800C4818`, wrapping it through helper `0x80071A74` after `0x3FFFF`.
- `resource_largest_free_block` uses the same arena mode/count fields, walks
  free-list nodes via `node+0x10`, compares each node's `+0x18` field, and
  returns the largest value observed.

## Caution

`resource_free` is seed-backed by the parent function database. The other names
are source-layout names inferred from static allocator table behavior and should
not be treated as final C API names until runtime or controlled mutation evidence
locks down exact semantics.

## Verification

- Baseline `node tools\verify_setup.js`: PASS.
- `node tests\binutils_smoke.js`: PASS after split.
- `node tools\assemble_original_mips.js`: PASS after split; code-region SHA256
  remains `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- Full `node tools\verify_setup.js`: PASS after split; source mix is 1 tracked
  composite real-asm chunk made from 9 tracked files plus 99 generated fallback
  chunks, and full ROM SHA256 remains
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
