# Boot Resource Probe Global Buffer Copy Split

Date: 2026-06-21

## Scope

This dossier records a static source-layout split of the overlapping Rev 0
permanent boot-code helper immediately after the resource probe chunk
callback-walk helper:

| Source | ROM range | RAM range | Notes |
| --- | --- | --- | --- |
| `asm/original/rev0/boot/boot_resource_probe_global_buffer_copy.s` | `0x000050F0..0x000051A0` | `0x80074CF0..0x80074DA0` | Overlapping `0x50F0` leaf entry plus `0x50F8` prologue body. |
| `asm/original/rev0/code_000051A0_00011000.s` | `0x000051A0..0x00011000` | `0x80074DA0..0x80080C00` | Historical remainder; superseded by the signature-check split. |
| `asm/original/rev0/boot/boot_resource_probe_global_buffer_signature_check.s` | `0x000051A0..0x0000539C` | `0x80074DA0..0x80074F9C` | Follow-up split documented separately. |
| `asm/original/rev0/boot/boot_resource_probe_id_materialize.s` | `0x0000539C..0x0000553C` | `0x80074F9C..0x8007513C` | Follow-up split documented separately. |
| `asm/original/rev0/code_0000553C_00011000.s` | `0x0000553C..0x00011000` | `0x8007513C..0x80080C00` | Historical remainder; superseded by the dual-callback materialize split. |

The name is conservative. The routine has a clear static shape around a shared
resource-probe buffer and a caller-provided copy, but no runtime trace or
controlled mutation has verified final behavior or API semantics.

## Static Evidence

- Parent `../scripts/ob64_symbols_v2.json` reports `0x50F0` as a 176-byte valid
  JAL-target leaf entry and `0x50F8` as an overlapping 168-byte prologue body
  with frame size `0x28`, epilogue, no `jalr`, no indirect jump, and the same
  `jr ra` return sequence.
- Parent `../scripts/ob64_symbols_v2.json` locates `0x50F0/0x50F8` at fixed RAM
  `0x80074CF0/0x80074CF8` in all seven named states and all 21 parent RAM
  snapshots.
- Parent callgraph/symbol data reports high-confidence callers to `0x50F0` from
  `0x4DC0` and `0x4ED4`.
- No direct callers to `0x50F8` were reported, so the split keeps `0x50F0` and
  its fallthrough prologue body together.
- High-confidence callees are `resource_alloc` (`0x1330`), `0x1A4F0` / RAM
  `0x8008A0F0`, and `0x23460` / RAM `0x80093060`.
- Parent unresolved-target data reports no unresolved RAM calls.
- Xref evidence shows reads and writes of `0x800A83B8`.
- Static code shape: `0x50F0` reads word `0x800A83B8` and falls through into
  the `0x50F8` stack-frame body.
- If the global buffer pointer is zero, the routine allocates `0x8000` bytes,
  stores the result to `0x800A83B8`, and walks offsets `0..0x7FFF` in `0x100`
  byte chunks.
- Each chunk-fill iteration calls `0x8008A0F0(offset, global + offset, 0x100,
  0)`.
- After the shared buffer exists, the routine calls `0x80093060` with
  destination `global + incoming a1`, source `incoming a0`, and length
  `incoming a2`.

## Boundaries

- The split starts at parent leaf/JAL-target boundary `0x000050F0`, immediately
  after `boot_resource_probe_chunk_callback_walk.s`.
- The `0x50F0` prefix is only two instructions, but it loads the shared global
  value used by the fallthrough body; splitting it away from `0x50F8` would hide
  the callable entry shape.
- The routine ends after the `jr ra` delay slot at `0x519C`.
- The next parent boundary is `0x000051A0`; parent data reports it as a
  separate 508-byte JAL-target prologue with frame size `0x38`, caller `0x4AC8`,
  callees `resource_alloc`, `0x1A4F0`, `0x23460`, and `0x23350`, and the same
  `0x800A83B8` global-buffer traffic.
- The `0x51A0` helper is now documented separately in
  `docs/dossiers/boot-resource-probe-global-buffer-signature-check.md`, and the
  follow-up `0x539C` helper is documented in
  `docs/dossiers/boot-resource-probe-id-materialize.md`; the follow-up
  `0x553C` helper is documented in
  `docs/dossiers/boot-resource-probe-dual-callback-materialize.md`; the
  follow-up `0x5624` helper is documented in
  `docs/dossiers/boot-resource-probe-global-buffer-dual-callback-apply.md`;
  the follow-up `0x5760` helper is documented in
  `docs/dossiers/boot-resource-probe-id-check-materialize.md`; the active
  remainder starts at `0x00005978`.

## Verification

After the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- Full `node tools\verify_setup.js` passed.
- The assembled report shows 1 tracked composite real-asm chunk made from 44
  tracked source files, plus 99 generated fallback chunks.
- The assembled code-region SHA256 remains
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- The rebuilt full-ROM SHA256 remains
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
