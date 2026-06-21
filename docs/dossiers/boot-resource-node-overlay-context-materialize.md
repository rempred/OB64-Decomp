# Boot Resource Node Overlay Context Materialize Split

Date: 2026-06-21

## Scope

This dossier records a static source-layout split of the overlay-helper-backed
resource-loader/context helper immediately after the LZSS-backed context
materialize helper:

| Source | ROM range | RAM range | Notes |
| --- | --- | --- | --- |
| `asm/original/rev0/boot/boot_resource_node_overlay_context_materialize.s` | `0x00009FD8..0x0000A0B4` | `0x80079BD8..0x80079CB4` | Static resource-node context materialize helper that allocates a destination and calls overlay-resident helpers. |
| `asm/original/rev0/code_0000A0B4_00011000.s` | `0x0000A0B4..0x00011000` | `0x80079CB4..0x80080C00` | Remainder at this split; now superseded by `boot_resource_node_recursive_insert_slot_search.s`. |

The source name is conservative. "Overlay" reflects the observed RAM helper
targets outside the permanent boot-linear range, not a verified runtime API
contract.

## Static Evidence

- Parent function data reports `0x9FD8` as a 220-byte valid prologue helper
  with frame size `0x18`, no `jalr`, no indirect jump, and a fixed body in all
  seven named states and all 21 snapshots.
- Parent symbols label it `dma/resource::resource loader`.
- Parent v2 data resolves the overlay target `0x000F84AC` / RAM `0x801AB74C`;
  that target is present in the scenario and combat-transition snapshots.
- Parent v2 leaves the nearby RAM helper `0x801AB720` unresolved.
- Other callees include the node helper through RAM `0x80079CB4`, `0x2DEF4` /
  RAM `0x8009DAF4`, `resource_alloc` `0x1330`, and `0x2DFB8` / RAM
  `0x8009DBB8`.
- Parent xrefs show `0x9FD8` reads shared context field base `0x800AF0C4` and
  writes `0x800C4BC0`.
- The node-helper callee is represented cautiously because parent v2 maps RAM
  `0x80079CB4` to `0x9CAC` due the same-state signature candidate noted in the
  insert/find dossier. Local source keeps the actual next helper at `0xA0B4`.

## Static Shape

- The helper accepts a node-like pointer in `a0`.
- It calls the node helper through RAM `0x80079CB4` with `[node+0x0C]` and
  index `0`, storing the returned node back to `[node+0x0C]`.
- If `[node+0x04]` is empty, it calls the DMA/cache helper at `0x2DEF4`, stores
  the returned size/result to `[node+0x08]`, allocates a payload buffer, stores
  it to `[node+0x04]`, and calls `0x2DFB8` with the allocation plus source key.
- If `[node+0x04]` is already populated, it calls unresolved RAM helper
  `0x801AB720(payload)` and stores the returned value as shared context field
  `+0x08`.
- It allocates a destination, stores it to shared context field `+0x04`, calls
  overlay target `0x801AB74C(dest, [node+0x04])`, and writes shared context
  status `+0x0C = 3`.
- On exit it mirrors shared context field `+0x08` to global `0x800C4BC0`.

## Boundaries

- The split starts at `0x00009FD8`, the next word after
  `boot_resource_node_lzss_context_materialize.s`.
- The split includes the normal return at `0xA0AC` and the branch delay-slot
  stack restore at `0xA0B0`.
- The next function starts cleanly at `0x0000A0B4`; do not include that word in
  this source file.
- Parent evidence for `0xA0B4` includes a secondary entry at `0xA160`; that
  range is now documented in
  `docs/dossiers/boot-resource-node-recursive-insert-slot-search.md`.

## Verification

After the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- Full `node tools\verify_setup.js` passed.
- The assembled report shows 1 tracked composite real-asm chunk made from 91
  tracked source files, plus 99 generated fallback chunks.
- The assembled code-region SHA256 remains
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- The rebuilt full-ROM SHA256 remains
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
