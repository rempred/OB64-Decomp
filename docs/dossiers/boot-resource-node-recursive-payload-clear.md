# Boot Resource Node Recursive Payload Clear Split

Date: 2026-06-21

## Scope

This dossier records a static source-layout split of the recursive payload-clear
helper immediately after the recursive cleanup/free helper:

| Source | ROM range | RAM range | Notes |
| --- | --- | --- | --- |
| `asm/original/rev0/boot/boot_resource_node_recursive_payload_clear.s` | `0x0000A1F8..0x0000A250` | `0x80079DF8..0x80079E50` | Recursive child walk that conditionally frees/clears field `+0x04`. |
| `asm/original/rev0/code_0000A250_00011000.s` | `0x0000A250..0x00011000` | `0x80079E50..0x80080C00` | Historical remainder after this split; superseded by `boot_resource_node_recursive_field0c_rewrite.s`. |

The source name is conservative. It describes the static recursive/free-and-clear
shape; runtime ownership and final C API names are not verified.

## Static Evidence

- Parent function data reports `0xA1F8` as an 88-byte valid prologue helper with
  frame size `0x18`, no `jalr`, no indirect jump, and a fixed body in all seven
  named states and all 21 snapshots.
- Parent callgraph data reports callers from `0x9A18`, `0x9A28`, and itself.
- Parent callee data reports three self-recursive calls and one call to
  `resource_free` `0x16C4` / RAM `0x800712C4`.
- Local source shows a null-safe recursive walk through child fields `+0x10`,
  `+0x14`, and `+0x18`.
- Local source checks field `+0x0C`; when it is nonzero, the helper frees field
  `+0x04` and clears `+0x04`.
- The next helper at `0xA250` is a separate 76-byte prologue helper with frame
  size `0x18`, three self-recursive calls, and one call to `0xA29C`.

## Static Shape

- The helper accepts a node pointer in `a0` and copies it to `s0`.
- A null node returns through the shared epilogue without writes.
- Non-null nodes recurse through fields `+0x10`, `+0x14`, and `+0x18`.
- It loads field `+0x0C`; if that field is zero, it returns without freeing.
- If field `+0x0C` is nonzero, it calls `resource_free` on field `+0x04`, then
  writes zero to field `+0x04`.

## Boundaries

- The split starts at `0x0000A1F8`, the next word after the recursive
  cleanup/free delay-slot stack restore at `0xA1F4`.
- The promoted helper includes the return at `0xA248` and delay-slot stack
  restore at `0xA24C`.
- The next function starts cleanly at `0x0000A250`; it is now split separately
  as `boot_resource_node_recursive_field0c_rewrite.s`.

## Verification

After the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- Full `node tools\verify_setup.js` passed.
- The assembled report shows 1 tracked composite real-asm chunk made from 94
  tracked source files, plus 99 generated fallback chunks.
- The assembled code-region SHA256 remains
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- The rebuilt full-ROM SHA256 remains
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
