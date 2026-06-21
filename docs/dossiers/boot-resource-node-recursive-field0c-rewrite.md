# Boot Resource Node Recursive Field +0x0C Rewrite Split

Date: 2026-06-21

## Scope

This dossier records a static source-layout split of the recursive helper that
rewrites node field `+0x0C` through the following `0xA29C` helper:

| Source | ROM range | RAM range | Notes |
| --- | --- | --- | --- |
| `asm/original/rev0/boot/boot_resource_node_recursive_field0c_rewrite.s` | `0x0000A250..0x0000A29C` | `0x80079E50..0x80079E9C` | Recursive child walk that rewrites field `+0x0C` with the result from `0xA29C`. |
| `asm/original/rev0/code_0000A29C_00011000.s` | `0x0000A29C..0x00011000` | `0x80079E9C..0x80080C00` | Current tracked remainder; starts with an 88-byte recursive child/free helper. |

The source name is conservative. It describes the static field rewrite shape;
runtime ownership and final C API names are not verified.

## Static Evidence

- Parent function data reports `0xA250` as a 76-byte valid prologue helper with
  frame size `0x18`, no `jalr`, no indirect jump, and a fixed body in all seven
  named states and all 21 snapshots.
- Parent callgraph data reports callers from `0x9A18`, `0x9A28`, and itself.
- Parent callee data reports three self-recursive calls and one call to
  `0xA29C` / RAM `0x80079E9C`.
- Local source shows a null-safe recursive walk through child fields `+0x10`,
  `+0x14`, and `+0x18`.
- Local source calls `0xA29C` on field `+0x0C` and stores the returned value back
  to field `+0x0C`.
- The next helper at `0xA29C` is a separate 88-byte prologue helper with frame
  size `0x18`, two self-recursive calls, and two calls to `resource_free`
  `0x16C4` / RAM `0x800712C4`.

## Static Shape

- The helper accepts a node pointer in `a0` and copies it to `s0`.
- A null node returns through the shared epilogue without writes.
- Non-null nodes recurse through fields `+0x10`, `+0x14`, and `+0x18`.
- It loads field `+0x0C`, calls `0xA29C`, and writes the returned value back to
  field `+0x0C`.

## Boundaries

- The split starts at `0x0000A250`, the next word after the payload-clear
  delay-slot stack restore at `0xA24C`.
- The promoted helper includes the return at `0xA294` and delay-slot stack
  restore at `0xA298`.
- The next function starts cleanly at `0x0000A29C`; keep `0xA29C..0xA2F4`
  together as the next recursive child/free helper.

## Verification

After the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- Full `node tools\verify_setup.js` passed.
- The assembled report shows 1 tracked composite real-asm chunk made from 95
  tracked source files, plus 99 generated fallback chunks.
- The assembled code-region SHA256 remains
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- The rebuilt full-ROM SHA256 remains
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
