# Boot Resource Probe Global Buffer Signature Check Split

Date: 2026-06-21

## Scope

This dossier records a static source-layout split of the Rev 0 permanent
boot-code helper immediately after the resource probe global buffer copy helper:

| Source | ROM range | RAM range | Notes |
| --- | --- | --- | --- |
| `asm/original/rev0/boot/boot_resource_probe_global_buffer_signature_check.s` | `0x000051A0..0x0000539C` | `0x80074DA0..0x80074F9C` | 508-byte prologue helper called by resource probe init. |
| `asm/original/rev0/code_0000539C_00011000.s` | `0x0000539C..0x00011000` | `0x80074F9C..0x80080C00` | Historical remainder; superseded by the ID materialize split. |
| `asm/original/rev0/boot/boot_resource_probe_id_materialize.s` | `0x0000539C..0x0000553C` | `0x80074F9C..0x8007513C` | Follow-up split documented separately. |
| `asm/original/rev0/code_0000553C_00011000.s` | `0x0000553C..0x00011000` | `0x8007513C..0x80080C00` | Historical remainder; superseded by the dual-callback materialize split. |

The name is conservative. The routine has a clear static shape around checking
8-byte records copied from the shared resource-probe buffer against an 8-byte
base at `0x800A8240`, but no runtime trace or controlled mutation has verified
final behavior or API semantics.

## Static Evidence

- Parent `../scripts/ob64_symbols_v2.json` reports `0x51A0` as a 508-byte valid
  JAL-target prologue with frame size `0x38`, epilogue, no `jalr`, no indirect
  jump, and next function boundary `0x539C`.
- Parent `../scripts/ob64_symbols_v2.json` locates `0x51A0` at fixed RAM
  `0x80074DA0` in all seven named states and all 21 parent RAM snapshots.
- Parent callgraph/symbol data reports high-confidence caller `0x4AC8`.
- High-confidence callees are `resource_alloc` (`0x1330`), `0x1A4F0` / RAM
  `0x8008A0F0`, `0x23460` / RAM `0x80093060`, and `0x23350` / RAM
  `0x80092F50`.
- Parent unresolved-target data reports no unresolved RAM calls.
- Xref evidence shows reads and writes of `0x800A83B8`.
- Static code shape: the routine repeatedly ensures shared global buffer
  `0x800A83B8` exists before reading records from it.
- If the global buffer pointer is zero, the routine allocates `0x8000` bytes,
  stores the result to `0x800A83B8`, and walks offsets `0..0x7FFF` in `0x100`
  byte chunks.
- Each chunk-fill iteration calls `0x8008A0F0(offset, global + offset, 0x100,
  0)`.
- The first loop copies two 8-byte records from global-buffer offsets `0x14`
  and `0x1864` into stack scratch and compares them against `0x800A8240`.
- If both first-loop comparisons are nonzero, the routine also checks 8-byte
  records from offsets `0x30B4` and `0x0004`.
- Each record copy uses `0x80093060`; each comparison uses `0x80092F50` with
  length `8`.
- Equal comparison returns zero through the early-exit path. The final return
  normalizes the last nonzero comparison result with `sltu v0, zero, v0`.

## Boundaries

- The split starts at parent prologue/JAL-target boundary `0x000051A0`,
  immediately after `boot_resource_probe_global_buffer_copy.s`.
- The routine ends after the `jr ra` delay slot at `0x5398`.
- The next parent boundary is `0x0000539C`; parent data reports it as a
  separate 416-byte prologue helper with frame size `0x38`, callers `0x4AC8`,
  `0x4C34`, and `0x5760`, one `jalr`, unresolved target `0x8016CD90`, and
  shared `0x800A83B8/83BC` global-buffer traffic.
- The `0x539C` helper is now documented separately in
  `docs/dossiers/boot-resource-probe-id-materialize.md`; the follow-up
  `0x553C` helper is documented in
  `docs/dossiers/boot-resource-probe-dual-callback-materialize.md`; the
  follow-up `0x5624` helper is documented in
  `docs/dossiers/boot-resource-probe-global-buffer-dual-callback-apply.md`;
  the active remainder starts at `0x00005760`.

## Verification

After the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- Full `node tools\verify_setup.js` passed.
- The assembled report shows 1 tracked composite real-asm chunk made from 45
  tracked source files, plus 99 generated fallback chunks.
- The assembled code-region SHA256 remains
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- The rebuilt full-ROM SHA256 remains
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
