# Boot Resource Node Recursive Insert/Slot Search Split

Date: 2026-06-21

## Scope

This dossier records a static source-layout split of the recursive node helper
immediately after the overlay-context materialize helper:

| Source | ROM range | RAM range | Notes |
| --- | --- | --- | --- |
| `asm/original/rev0/boot/boot_resource_node_recursive_insert_slot_search.s` | `0x0000A0B4..0x0000A198` | `0x80079CB4..0x80079D98` | Recursive `0x18`-byte node insert/find helper plus secondary slot-search entry. |
| `asm/original/rev0/code_0000A198_00011000.s` | `0x0000A198..0x00011000` | `0x80079D98..0x80080C00` | Remainder produced by this split; now superseded by the cleanup/free split. |

The source name is conservative. It describes the static pointer/key/tree shape
and secondary slot return behavior; runtime ownership and final C API names are
not verified.

## Static Evidence

- Parent function data reports `0xA0B4` as a 228-byte valid prologue helper
  with frame size `0x20`, no `jalr`, no indirect jump, and a fixed body in all
  seven named states and all 21 snapshots.
- Parent function data records a secondary entry at ROM `0xA160` / RAM
  `0x80079D60`, offset `0xAC` from the primary entry.
- Parent old call data reports callers from the command/resource-node family
  (`0x9A18`, `0x9A28`, `0x9D50`, `0x9EFC`, `0x9FD8`) and itself.
- Parent old callee data reports two recursive calls to `0xA0B4` and one call
  to `0x1688` / RAM `0x80071288`
  (`resource_alloc_mode1_wrapper`).
- Parent v2 resolves RAM `0x80079CB4` to the earlier `0x9CAC` same-state
  signature candidate. Treat that as an overlay-map aliasing caveat; local
  source and raw function data identify `0xA0B4` as the actual body at RAM
  `0x80079CB4`.
- Parent xrefs show `0xA0B4` is the only writer of shared context base
  `0x800AF0C4`; readers are in the command/resource-node context materialize
  family.

## Static Shape

- The primary entry accepts a node/root pointer in `a0` and key/source value in
  `a1`.
- If the current node is null, it allocates `0x18` bytes through
  `resource_alloc_mode1_wrapper`, stores the new node to `0x800AF0C4`, writes
  the key to field `+0x00`, and clears fields `+0x04`, `+0x08`, `+0x0C`,
  `+0x10`, and `+0x14`.
- If the current node key matches, it stores the node to `0x800AF0C4` and
  returns it.
- Otherwise it compares keys and recurses through child fields `+0x10` or
  `+0x14`, then writes the returned node back into the selected child field.
- The secondary `0xA160` entry accepts a pointer-to-node slot in `a0` and a key
  in `a1`, walks until the slot is empty or its pointed node key matches, and
  returns the slot pointer in `v0`.
- The secondary search advances through `node+0x18` or `node+0x14` depending on
  the unsigned key comparison.

## Boundaries

- The split starts at `0x0000A0B4`, the next word after
  `boot_resource_node_overlay_context_materialize.s`.
- The primary helper return is `0xA158` with delay-slot stack restore at
  `0xA15C`.
- The secondary entry begins at `0xA160` and returns at `0xA190` with delay-slot
  `move v0, a0` at `0xA194`.
- The next function starts cleanly at `0x0000A198`; it is split separately in
  `boot-resource-node-recursive-cleanup-free.md`.

## Verification

After the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- Full `node tools\verify_setup.js` passed.
- The assembled report shows 1 tracked composite real-asm chunk made from 92
  tracked source files, plus 99 generated fallback chunks.
- The assembled code-region SHA256 remains
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- The rebuilt full-ROM SHA256 remains
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
