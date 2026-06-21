# Boot Resource Node Context Materialize Split

Date: 2026-06-21

## Scope

This dossier records a static source-layout split of the larger
resource-loader/context helper immediately after the recursive node insert/find
helper:

| Source | ROM range | RAM range | Notes |
| --- | --- | --- | --- |
| `asm/original/rev0/boot/boot_resource_node_context_materialize.s` | `0x00009D50..0x00009EFC` | `0x80079950..0x80079AFC` | Static resource-node context materialize/update helper. |
| `asm/original/rev0/code_00009EFC_00011000.s` | `0x00009EFC..0x00011000` | `0x80079AFC..0x80080C00` | Current tracked remainder; starts with the related LZSS-backed loader helper. |

The source name is conservative. It describes the local control-flow shape and
shared context writes, not a verified runtime API contract.

## Static Evidence

- Parent function data reports `0x9D50` as a 428-byte valid prologue helper
  with frame size `0x50`, no `jalr`, no indirect jump, and no unresolved v2
  targets.
- Parent symbols label it `dma/resource::resource loader`, fixed at primary RAM
  `0x80079950` in all seven named states and all 21 snapshots.
- High-confidence callers are the command-stream dispatch family:
  `0x978C` and `0x97A8`.
- High-confidence callees are `0x2DEF4` / RAM `0x8009DAF4`, `resource_alloc`
  `0x1330`, `0x2DFB8` / RAM `0x8009DBB8`, `0xB29C` / RAM `0x8007AE9C`,
  node helper RAM `0x80079CB4`, and `0xB0B0` / RAM `0x8007ACB0`.
- Parent xrefs show reads/writes around context fields at `0x800AF0C4`,
  `0x800AF0C8`, and `0x800AF0CC`, plus a write to `0x800C4BC0`.
- The node-helper callee is represented cautiously because parent v2 maps RAM
  `0x80079CB4` to `0x9CAC` due the same-state signature candidate noted in the
  insert/find dossier.

## Static Shape

- The helper accepts a node-like pointer in `a0` and an index/mode-like value in
  `a1`.
- It preserves incoming node payload/size fields to stack slots and has a
  special `-0x16` path that can walk a range reported by `0x8007AE9C`.
- If node field `+0x04` is missing, it calls the DMA/cache helper at
  `0x2DEF4`, stores the returned size/result to field `+0x08`, allocates a
  payload buffer, stores it to field `+0x04`, and calls `0x2DFB8` with the
  allocation plus source key.
- For each selected index, it calls the node insert/find helper through RAM
  `0x80079CB4` with field `+0x0C` and the current index, storing the returned
  node back to `+0x0C`.
- When the shared context field `+0x04` is empty, it calls `0x8007ACB0` with
  stack-backed descriptors, then writes the resulting pointer fields to
  `[context+0x04]`, `[context+0x08]`, and status `[context+0x0C] = 1`.
- On exit it mirrors `[context+0x08]` to global `0x800C4BC0`.

## Boundaries

- The split starts at `0x00009D50`, the next word after
  `boot_resource_node_insert_find.s`.
- The split includes the normal return at `0x9EF4` and the branch delay-slot
  stack restore at `0x9EF8`.
- The next function starts cleanly at `0x00009EFC`; do not include that word in
  this source file.

## Verification

After the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- Full `node tools\verify_setup.js` passed after docs were updated.
- The assembled report shows 1 tracked composite real-asm chunk made from 89
  tracked source files, plus 99 generated fallback chunks.
- The assembled code-region SHA256 remains
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- The rebuilt full-ROM SHA256 remains
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
