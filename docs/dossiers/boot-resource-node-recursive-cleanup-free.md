# Boot Resource Node Recursive Cleanup/Free Split

Date: 2026-06-21

## Scope

This dossier records a static source-layout split of the recursive cleanup
helper immediately after the recursive insert/slot-search helper:

| Source | ROM range | RAM range | Notes |
| --- | --- | --- | --- |
| `asm/original/rev0/boot/boot_resource_node_recursive_cleanup_free.s` | `0x0000A198..0x0000A1F8` | `0x80079D98..0x80079DF8` | Recursive node cleanup/free helper. |
| `asm/original/rev0/code_0000A1F8_00011000.s` | `0x0000A1F8..0x00011000` | `0x80079DF8..0x80080C00` | Current tracked remainder; starts with an 88-byte recursive child/payload clear helper. |

The source name is conservative. It describes the static recursive/free shape;
runtime ownership and final C API names are not verified.

## Static Evidence

- Parent function data reports `0xA198` as a 96-byte valid prologue helper with
  frame size `0x18`, no `jalr`, no indirect jump, and a fixed body in all seven
  named states and all 21 snapshots.
- Parent callgraph data reports callers from `0x9A18`, `0x9A28`, and itself.
- Parent callee data reports three self-recursive calls, one call to `0xA29C` /
  RAM `0x80079E9C`, and two calls to `resource_free` `0x16C4` / RAM
  `0x800712C4`.
- Local source shows a null-safe recursive walk through child fields `+0x10`,
  `+0x14`, and `+0x18`, followed by substructure cleanup and two frees.
- The next helper at `0xA1F8` is a separate 88-byte prologue helper with frame
  size `0x18`, three self-recursive calls, and one `resource_free` call.

## Static Shape

- The helper accepts a node pointer in `a0` and copies it to `s0`.
- A null node returns zero through the shared epilogue.
- Non-null nodes recurse through fields `+0x10`, `+0x14`, and `+0x18`.
- After child cleanup, it calls `0xA29C` on field `+0x0C`.
- It calls `resource_free` on field `+0x04`, then calls `resource_free` on the
  node itself.
- Before returning it clears `s0`, so `v0` is zero on the normal cleanup path.

## Boundaries

- The split starts at `0x0000A198`, the next word after the recursive
  insert/slot-search secondary-entry delay slot at `0xA194`.
- The promoted helper includes the return at `0xA1F0` and delay-slot stack
  restore at `0xA1F4`.
- The next function starts cleanly at `0x0000A1F8`; keep `0xA1F8..0xA250`
  together as the next recursive child/payload clear helper.

## Verification

After the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- Full `node tools\verify_setup.js` passed.
- The assembled report shows 1 tracked composite real-asm chunk made from 93
  tracked source files, plus 99 generated fallback chunks.
- The assembled code-region SHA256 remains
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- The rebuilt full-ROM SHA256 remains
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
