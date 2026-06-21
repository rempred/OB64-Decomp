# Boot Resource Probe Chunk Callback Walk Split

Date: 2026-06-21

## Scope

This dossier records a static source-layout split of the Rev 0 permanent
boot-code helper immediately after the resource probe global cleanup helper:

| Source | ROM range | RAM range | Notes |
| --- | --- | --- | --- |
| `asm/original/rev0/boot/boot_resource_probe_chunk_callback_walk.s` | `0x00005058..0x000050F0` | `0x80074C58..0x80074CF0` | 152-byte JAL-target prologue with one indirect `jalr`. |
| `asm/original/rev0/code_000050F0_00011000.s` | `0x000050F0..0x00011000` | `0x80074CF0..0x80080C00` | Historical remainder; superseded by the global buffer copy split. |
| `asm/original/rev0/boot/boot_resource_probe_global_buffer_copy.s` | `0x000050F0..0x000051A0` | `0x80074CF0..0x80074DA0` | Follow-up split documented separately. |
| `asm/original/rev0/boot/boot_resource_probe_global_buffer_signature_check.s` | `0x000051A0..0x0000539C` | `0x80074DA0..0x80074F9C` | Follow-up split documented separately. |
| `asm/original/rev0/boot/boot_resource_probe_id_materialize.s` | `0x0000539C..0x0000553C` | `0x80074F9C..0x8007513C` | Follow-up split documented separately. |
| `asm/original/rev0/code_0000553C_00011000.s` | `0x0000553C..0x00011000` | `0x8007513C..0x80080C00` | Historical remainder; superseded by the dual-callback materialize split. |

The name is conservative. The routine has a clear static 0x100-byte chunk walk
through a callback pointer, but no runtime trace or controlled mutation has
verified final resource/probe semantics.

## Static Evidence

- Parent `../scripts/ob64_symbols_v2.json` reports `0x5058` as a 152-byte valid
  JAL-target prologue routine with frame size `0x28`, epilogue, one indirect
  `jalr`, no secondary entries, and next function boundary `0x50F0`.
- Parent `../scripts/ob64_symbols_v2.json` locates the routine at fixed RAM
  `0x80074C58` in all seven named states and all 21 parent RAM snapshots.
- Parent callgraph/symbol data reports high-confidence callers `0x4FF0` and
  `0x4FF8`.
- High-confidence callees are `resource_alloc` (`0x1330`) and `resource_free`
  (`0x16C4`).
- Parent unresolved-target data reports no unresolved RAM calls.
- Xref evidence shows a read from `0x800C4800`.
- Static code shape: the routine saves the incoming buffer pointer, allocates a
  0x10-byte scratch record, stores callback pointer `0x8008A0F0` into scratch
  word `+0x00`, and reads byte `0x800C4800`.
- If `0x800C4800` is nonzero, it skips the callback loop and frees the scratch
  record.
- If `0x800C4800` is zero, it walks an 0x8000-byte span in 0x100-byte chunks.
  Each iteration calls the scratch callback through `jalr` with
  `(offset, buffer + offset, 0x100, 1)`.
- It frees the scratch record through `resource_free` before returning.

## Boundaries

- The split starts at parent prologue/JAL-target boundary `0x00005058`,
  immediately after `boot_resource_probe_global_cleanup.s`.
- The routine ends after the `jr ra` delay slot at `0x50EC`.
- The next parent boundary is `0x000050F0`; parent data reports it as a
  176-byte JAL-target leaf entry with overlapping prologue body `0x50F8`.
- The `0x50F0/0x50F8` helper pair is now documented separately in
  `docs/dossiers/boot-resource-probe-global-buffer-copy.md`; the follow-up
  `0x51A0` helper is documented in
  `docs/dossiers/boot-resource-probe-global-buffer-signature-check.md`, and the
  follow-up `0x539C` helper is documented in
  `docs/dossiers/boot-resource-probe-id-materialize.md`; the follow-up
  `0x553C` helper is documented in
  `docs/dossiers/boot-resource-probe-dual-callback-materialize.md`; the
  follow-up `0x5624` helper is documented in
  `docs/dossiers/boot-resource-probe-global-buffer-dual-callback-apply.md`;
  the follow-up `0x5760` helper is documented in
  `docs/dossiers/boot-resource-probe-id-check-materialize.md`; the active
  remainder starts at `0x0000581C`.

## Verification

After the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- Full `node tools\verify_setup.js` passed.
- The assembled report shows 1 tracked composite real-asm chunk made from 43
  tracked source files, plus 99 generated fallback chunks.
- The assembled code-region SHA256 remains
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- The rebuilt full-ROM SHA256 remains
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
