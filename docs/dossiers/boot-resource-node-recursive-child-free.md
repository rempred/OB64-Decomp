# Boot Resource Node Recursive Child Free Split

Date: 2026-06-21

## Scope

This dossier records a static source-layout split of the recursive child/free
helper immediately after the field-`+0x0C` rewrite helper:

| Source | ROM range | RAM range | Notes |
| --- | --- | --- | --- |
| `asm/original/rev0/boot/boot_resource_node_recursive_child_free.s` | `0x0000A29C..0x0000A2F4` | `0x80079E9C..0x80079EF4` | Recursive child cleanup that frees field `+0x04`, frees the node, and returns zero. |
| `asm/original/rev0/code_0000A2F4_00011000.s` | `0x0000A2F4..0x00011000` | `0x80079EF4..0x80080C00` | Current tracked remainder; starts with a 116-byte recursive key/field clear helper. |

The source name is conservative. It describes the static recursive/free shape;
runtime ownership and final C API names are not verified.

## Static Evidence

- Parent function data reports `0xA29C` as an 88-byte valid prologue helper with
  frame size `0x18`, no `jalr`, no indirect jump, and a fixed body in all seven
  named states and all 21 snapshots.
- Parent callgraph data reports callers from `0x9A18`, `0x9A28`, `0xA198`,
  `0xA250`, and itself.
- Parent callee data reports two self-recursive calls and two calls to
  `resource_free` `0x16C4` / RAM `0x800712C4`.
- Local source shows a null-safe recursive walk through child fields `+0x10`
  and `+0x14`.
- Local source stores returned child values back to fields `+0x10` and `+0x14`,
  frees field `+0x04`, frees the node itself, clears `s0` to zero, and returns
  zero.
- The next helper at `0xA2F4` is a separate 116-byte prologue helper with frame
  size `0x18`, two self-recursive calls, and one call to `resource_free`.

## Static Shape

- The helper accepts a node pointer in `a0` and copies it to `s0`.
- A null node returns zero through the shared epilogue.
- Non-null nodes recurse through fields `+0x10` and `+0x14`.
- The returned child values are written back to fields `+0x10` and `+0x14`.
- It frees field `+0x04`, then frees the node itself.
- It clears `s0` to zero before moving `s0` to `v0`, so the return value is zero.

## Boundaries

- The split starts at `0x0000A29C`, the next word after the field-`+0x0C`
  rewrite helper's delay-slot stack restore at `0xA298`.
- The promoted helper includes the return at `0xA2EC` and delay-slot stack
  restore at `0xA2F0`.
- The next function starts cleanly at `0x0000A2F4`. Parent function data ends
  that body at `0xA368`; two zero padding words at `0xA368..0xA370` sit before
  the next copy-like leaf, so account for them deliberately in the next split.

## Verification

After the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- Full `node tools\verify_setup.js` passed.
- The assembled report shows 1 tracked composite real-asm chunk made from 96
  tracked source files, plus 99 generated fallback chunks.
- The assembled code-region SHA256 remains
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- The rebuilt full-ROM SHA256 remains
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
