# Boot Resource Node Insert/Find Split

Date: 2026-06-21

## Scope

This dossier records a static source-layout split of the recursive node/tree
helper immediately after the payload materialize helper:

| Source | ROM range | RAM range | Notes |
| --- | --- | --- | --- |
| `asm/original/rev0/boot/boot_resource_node_insert_find.s` | `0x00009CAC..0x00009D50` | `0x800798AC..0x80079950` | Recursive node insert/find helper for key-like field `+0x00`. |
| `asm/original/rev0/code_00009D50_00011000.s` | `0x00009D50..0x00011000` | `0x80079950..0x80080C00` | Historical remainder at this checkpoint; superseded by `boot_resource_node_context_materialize.s`. |

The source name is conservative. It describes the static tree insertion/search
shape, not a verified runtime API contract.

## Static Evidence

- Parent function data reports `0x9CAC` as a 164-byte valid prologue helper
  with frame size `0x20`, no `jalr`, no indirect jump, and no unresolved v2
  targets.
- Parent symbols report primary runtime RAM `0x800798AC` in all seven named
  states and all 21 snapshots. The signature map also reports a second
  same-state candidate at RAM `0x80079CB4`, so this dossier only claims the
  boot-linear primary address for this source split.
- High-confidence callers are `0x978C`, `0x97A8`, `0x9CAC`, `0x9D50`,
  `0x9EFC`, `0x9FD8`, and `0xA0B4`.
- High-confidence callees are itself, `0x1688` / RAM `0x80071288`, and
  `0x23780` / RAM `0x80093380`.
- Parent xrefs show global `0x800AF0C0` is written by this helper and read by
  the command-stream dispatch family.

## Static Shape

- The helper accepts a root/node pointer in `a0` and key/source value in `a1`.
- If the node pointer is nonzero and field `+0x00` equals the key, it stores the
  node to global `0x800AF0C0` and returns the node.
- If the key differs, it uses an unsigned compare and recurses through either
  child field `+0x14` or `+0x18`, storing the recursive result back into that
  child field.
- If the node pointer is null, it allocates `0x1C` bytes with the mode-1
  allocation wrapper at `0x1688`, clears the new node with common helper
  `0x23780`, stores the new node to `0x800AF0C0`, writes the key into field
  `+0x00`, and returns it.

## Boundaries

- The split starts at `0x00009CAC`, the next word after
  `boot_resource_node_payload_materialize.s`.
- The split includes the normal return at `0x9D48` and the branch delay-slot
  stack restore at `0x9D4C`.
- The next family begins cleanly at `0x00009D50`; do not include that word in
  this source file. It is now promoted separately as
  `boot_resource_node_context_materialize.s`.
- Parent data labels `0x9D50` as `dma/resource::resource loader`, with frame
  size `0x50`, high-confidence callers from the command-stream family, callees
  to DMA/cache and allocation helpers plus `0xB29C`, `0x9CAC`, and `0xB0B0`,
  and reads/writes around `0x800AF0C4` and `0x800C4BC0`.

## Verification

After the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- Full `node tools\verify_setup.js` passed after docs were updated.
- The assembled report shows 1 tracked composite real-asm chunk made from 88
  tracked source files, plus 99 generated fallback chunks.
- The assembled code-region SHA256 remains
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- The rebuilt full-ROM SHA256 remains
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
