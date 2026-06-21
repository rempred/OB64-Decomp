# Boot Resource Node Recursive Key/Field Clear Split

Date: 2026-06-21

## Scope

This dossier records a static source-layout split of the recursive key/field
clear helper immediately after the recursive child/free helper:

| Source | ROM range | RAM range | Notes |
| --- | --- | --- | --- |
| `asm/original/rev0/boot/boot_resource_node_recursive_key_field_clear.s` | `0x0000A2F4..0x0000A370` | `0x80079EF4..0x80079F70` | Recursive key compare helper that clears node payload fields on a matching key; includes two padding words after the parent body. |
| `asm/original/rev0/code_0000A370_00011000.s` | `0x0000A370..0x00011000` | `0x80079F70..0x80080C00` | Remainder at this split; now superseded by `code_0000A510_00011000.s` after the byte copy/fill leaf split. |

The source name is conservative. It describes the static recursive key/field
clear shape; runtime ownership and final C API names are not verified.

## Static Evidence

- Parent function data reports `0xA2F4` as a 116-byte valid prologue helper with
  frame size `0x18`, no `jalr`, no indirect jump, and a fixed body in all seven
  named states and all 21 snapshots.
- Parent callgraph data reports callers from `0x9A18`, `0x9A28`, and itself.
- Parent callee data reports two self-recursive calls and one call to
  `resource_free` `0x16C4` / RAM `0x800712C4`.
- Local source shows a null-safe recursive walk based on comparing incoming
  `a1` to node field `+0x00`.
- Local source recurses through field `+0x10` when `a1 < key` and field
  `+0x14` when `key < a1`.
- On equality, local source frees field `+0x04` and clears fields
  `+0x04/+0x08/+0x0C`.
- Parent function data ends the body at `0xA368`; local source shows two zero
  padding words at `0xA368..0xA370`.

## Static Shape

- The helper accepts a node pointer in `a0` and a key-like value in `a1`.
- A null node returns zero through the shared epilogue.
- Non-null nodes compare field `+0x00` against incoming `a1`.
- Less-than and greater-than cases recurse into child fields `+0x10` and
  `+0x14`, respectively, storing returned nodes back to the same fields.
- The equality case frees field `+0x04` and clears fields `+0x04`, `+0x08`,
  and `+0x0C`.
- The helper returns the node pointer after any recursive rewrite or field clear.

## Boundaries

- The split starts at `0x0000A2F4`, the next word after the recursive
  child/free helper's delay-slot stack restore at `0xA2F0`.
- The parent function body return is at `0xA360` with delay-slot stack restore
  at `0xA364`.
- The promoted source deliberately includes the two zero padding words at
  `0xA368..0xA370`.
- Follow-up split `docs/dossiers/boot-byte-copy-fill-aligned-leaves.md` now
  owns the copy-like no-frame leaf at `0xA370..0xA470` and the fill-like
  no-frame leaf at `0xA470..0xA510`. Parent function data marks the next formal
  helper at `0xA510`.

## Verification

After the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- Full `node tools\verify_setup.js` passed.
- The assembled report shows 1 tracked composite real-asm chunk made from 97
  tracked source files, plus 99 generated fallback chunks.
- The assembled code-region SHA256 remains
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- The rebuilt full-ROM SHA256 remains
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
