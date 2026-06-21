# Boot Resource Node LZSS Context Materialize Split

Date: 2026-06-21

## Scope

This dossier records a static source-layout split of the LZSS-backed
resource-loader/context helper immediately after the broader context
materialize helper:

| Source | ROM range | RAM range | Notes |
| --- | --- | --- | --- |
| `asm/original/rev0/boot/boot_resource_node_lzss_context_materialize.s` | `0x00009EFC..0x00009FD8` | `0x80079AFC..0x80079BD8` | Static resource-node context materialize helper that allocates a destination and calls the boot LZSS decompressor. |
| `asm/original/rev0/code_00009FD8_00011000.s` | `0x00009FD8..0x00011000` | `0x80079BD8..0x80080C00` | Current tracked remainder; starts with the sibling resource-loader helper. |

The source name is conservative. It reflects the observed call to the LZSS
decompressor and shared context writes, not a proven runtime API contract.

## Static Evidence

- Parent function data reports `0x9EFC` as a 220-byte valid prologue helper
  with frame size `0x18`, no `jalr`, no indirect jump, and a fixed body in all
  seven named states and all 21 snapshots.
- Parent symbols label it `dma/resource::resource loader`.
- High-confidence callers are the command-stream dispatch family:
  `0x978C` and `0x97A8`.
- Callees include the node helper through RAM `0x80079CB4`, `0x2DEF4` / RAM
  `0x8009DAF4`, `resource_alloc` `0x1330`, `0x2DFB8` / RAM `0x8009DBB8`,
  LZSS decompressor `0xA510` / RAM `0x8007A110`, and unresolved RAM helper
  `0x8007A7E0`.
- Parent xrefs show reads/writes around shared context field base
  `0x800AF0C4` and a write to `0x800C4BC0`.
- The node-helper callee is represented cautiously because parent v2 maps RAM
  `0x80079CB4` to `0x9CAC` due the same-state signature candidate noted in the
  insert/find dossier.

## Static Shape

- The helper accepts a node-like pointer in `a0`.
- It calls the node helper through RAM `0x80079CB4` with `[node+0x0C]` and
  index `0`, storing the returned node back to `[node+0x0C]`.
- If `[node+0x04]` is empty, it calls the DMA/cache helper at `0x2DEF4`, stores
  the returned size/result to `[node+0x08]`, allocates a payload buffer, stores
  it to `[node+0x04]`, and calls `0x2DFB8` with the allocation plus source key.
- If `[node+0x04]` is already populated, it calls unresolved RAM helper
  `0x8007A7E0(payload)` and stores the returned value as shared context field
  `+0x08`.
- It allocates a destination, stores it to shared context field `+0x04`, calls
  LZSS decompressor `0x8007A110(dest, [node+0x04])`, and writes shared context
  status `+0x0C = 2`.
- On exit it mirrors shared context field `+0x08` to global `0x800C4BC0`.

## Boundaries

- The split starts at `0x00009EFC`, the next word after
  `boot_resource_node_context_materialize.s`.
- The split includes the normal return at `0x9FD0` and the branch delay-slot
  stack restore at `0x9FD4`.
- The next function starts cleanly at `0x00009FD8`; do not include that word in
  this source file. Parent evidence suggests the next sibling should stay
  together as `0x9FD8..0xA0B4` until stronger boundary evidence appears.

## Verification

After the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- Full `node tools\verify_setup.js` passed.
- The assembled report shows 1 tracked composite real-asm chunk made from 90
  tracked source files, plus 99 generated fallback chunks.
- The assembled code-region SHA256 remains
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- The rebuilt full-ROM SHA256 remains
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
