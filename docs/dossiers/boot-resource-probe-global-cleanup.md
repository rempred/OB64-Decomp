# Boot Resource Probe Global Cleanup Split

Date: 2026-06-21

## Scope

This dossier records a static source-layout split of the overlapping Rev 0
permanent boot-code helper immediately after the resource probe dispatch
result-builder:

| Source | ROM range | RAM range | Notes |
| --- | --- | --- | --- |
| `asm/original/rev0/boot/boot_resource_probe_global_cleanup.s` | `0x00004FF0..0x00005058` | `0x80074BF0..0x80074C58` | Overlapping `0x4FF0` leaf entry plus `0x4FF8` prologue body. |
| `asm/original/rev0/code_00005058_00011000.s` | `0x00005058..0x00011000` | `0x80074C58..0x80080C00` | Historical remainder; superseded by the chunk callback-walk split. |
| `asm/original/rev0/boot/boot_resource_probe_chunk_callback_walk.s` | `0x00005058..0x000050F0` | `0x80074C58..0x80074CF0` | Follow-up split documented separately. |
| `asm/original/rev0/code_000050F0_00011000.s` | `0x000050F0..0x00011000` | `0x80074CF0..0x80080C00` | Historical remainder; superseded by the global buffer copy split. |
| `asm/original/rev0/boot/boot_resource_probe_global_buffer_copy.s` | `0x000050F0..0x000051A0` | `0x80074CF0..0x80074DA0` | Follow-up split documented separately. |
| `asm/original/rev0/boot/boot_resource_probe_global_buffer_signature_check.s` | `0x000051A0..0x0000539C` | `0x80074DA0..0x80074F9C` | Follow-up split documented separately. |
| `asm/original/rev0/boot/boot_resource_probe_id_materialize.s` | `0x0000539C..0x0000553C` | `0x80074F9C..0x8007513C` | Follow-up split documented separately. |
| `asm/original/rev0/code_0000553C_00011000.s` | `0x0000553C..0x00011000` | `0x8007513C..0x80080C00` | Current tracked remainder. |

The name is conservative. The routine has a clear static clear/free shape around
resource-probe globals, but no runtime trace or controlled mutation has verified
final behavior or API semantics.

## Static Evidence

- Parent `../scripts/ob64_functions.json` reports `0x4FF0` as a 104-byte valid
  JAL-target leaf entry. It reports `0x4FF8` as the overlapping 96-byte prologue
  body with frame size `0x18`, epilogue, no `jalr`, no indirect jump, and the
  same `jr ra` return sequence.
- Parent `../scripts/ob64_symbols_v2.json` locates `0x4FF0/0x4FF8` at fixed RAM
  `0x80074BF0/0x80074BF8` in all seven named states and all 21 parent RAM
  snapshots.
- Parent callgraph/symbol data reports high-confidence callers to `0x4FF0` from
  `0x4AC8`, `0x4C34`, `0x4C5C`, `0x4DC0`, and `0x4ED4`.
- No direct callers to `0x4FF8` were reported, so the split keeps `0x4FF0` and
  its fallthrough prologue body together.
- High-confidence callees are `0x5058` and `resource_free` (`0x16C4`).
- Parent unresolved-target data reports no unresolved RAM calls.
- Xref evidence shows reads and writes of `0x800A83B8` and `0x800A83BC`.
- Static code shape: `0x4FF0` reads byte `0x800A83BC` and falls through into
  the `0x4FF8` stack-frame body.
- If the state byte is `1` and incoming `a0` equals magic value `0x37081383`,
  the routine loads the word at `0x800A83B8` and calls helper `0x5058`.
- It clears byte `0x800A83BC`, loads the word at `0x800A83B8`, calls
  `resource_free` when that word is nonzero, then clears `0x800A83B8` before
  returning.

## Boundaries

- The split starts at parent leaf/JAL-target boundary `0x00004FF0`, immediately
  after `boot_resource_probe_dispatch_result_build.s`.
- The routine ends after the `jr ra` delay slot at `0x5054`.
- The next parent boundary is `0x00005058`; parent data reports it as a
  separate 152-byte JAL-target prologue with frame size `0x28`, one indirect
  `jalr`, callers from `0x4FF0/0x4FF8`, callees `resource_alloc` and
  `resource_free`, and a read from `0x800C4800`.
- The `0x5058` helper is now documented separately in
  `docs/dossiers/boot-resource-probe-chunk-callback-walk.md`.
- The `0x50F0/0x50F8` helper pair is now documented separately in
  `docs/dossiers/boot-resource-probe-global-buffer-copy.md`.

## Verification

After the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- Full `node tools\verify_setup.js` passed.
- The assembled report shows 1 tracked composite real-asm chunk made from 42
  tracked source files, plus 99 generated fallback chunks.
- The assembled code-region SHA256 remains
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- The rebuilt full-ROM SHA256 remains
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
