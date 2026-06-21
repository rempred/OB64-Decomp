# Boot Resource Node Payload Materialize Split

Date: 2026-06-21

## Scope

This dossier records a static source-layout split of the small resource-loader
helper following the command-stream resource-node dispatch family:

| Source | ROM range | RAM range | Notes |
| --- | --- | --- | --- |
| `asm/original/rev0/boot/boot_resource_node_payload_materialize.s` | `0x00009C50..0x00009CAC` | `0x80079850..0x800798AC` | Parent-labeled resource-loader helper that fills a node payload pointer when needed. |
| `asm/original/rev0/code_00009CAC_00011000.s` | `0x00009CAC..0x00011000` | `0x800798AC..0x80080C00` | Remainder at this checkpoint; superseded by the insert/find split. |

The source name is conservative. It describes the static pointer/materialize
shape, not a verified runtime API contract.

## Static Evidence

- Parent symbol data labels `0x9C50` as `dma/resource::resource loader`.
- Parent data reports size `0x5C`, frame size `0x18`, fixed RAM
  `0x80079850` in all seven named states and all 21 snapshots, and no
  unresolved targets.
- High-confidence callers are the command-stream dispatch entries `0x978C` and
  `0x97A8`, each with count 3.
- High-confidence callees are `0x2DEF4` / RAM `0x8009DAF4`, `resource_alloc`
  `0x1330` / RAM `0x80070F30`, and `0x2DFB8` / RAM `0x8009DBB8`.
- Parent `docs/rom-layout.md` names `0x2DEF4` as DMA with cache.

## Static Shape

- The helper accepts a node-like pointer in `a0` and preserves it in `s0`.
- If field `+0x04` is already nonzero, it returns the node pointer unchanged.
- Otherwise it reads source/key field `+0x00` and calls the DMA/cache helper.
- When that helper returns nonzero, the result is stored to field `+0x08` and
  used as the size passed to `resource_alloc`.
- The allocated payload pointer is stored to field `+0x04`.
- The helper then calls `0x2DFB8` with the allocation plus the original
  source/key field before returning the node pointer.

## Boundaries

- The split starts at `0x00009C50`, the next word after
  `boot_command_stream_resource_node_dispatch.s`.
- The split includes the normal return at `0x9CA4` and the branch delay-slot
  stack restore at `0x9CA8`.
- The next family begins cleanly at `0x00009CAC`; do not include that word in
  this source file.
- Parent data reports `0x9CAC` as a 164-byte recursive prologue helper with
  frame size `0x20`, fixed in all states, callers from the command-stream
  family and later loader helpers, and callees to itself, `0x1688`, and
  `0x23780`.
- Local source shows `0x9CAC` allocates and clears `0x1C`-byte nodes, compares
  keys, writes global `0x800AF0C0`, and recurses through child fields
  `+0x14/+0x18`; that follow-up is now promoted as
  `boot_resource_node_insert_find.s`.

## Verification

After the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- Full `node tools\verify_setup.js` passed after docs were updated.
- At this checkpoint, the assembled report showed 1 tracked composite real-asm
  chunk using 87 tracked source files, plus 99 generated fallback chunks.
- The assembled code-region SHA256 remains
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- The rebuilt full-ROM SHA256 remains
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
