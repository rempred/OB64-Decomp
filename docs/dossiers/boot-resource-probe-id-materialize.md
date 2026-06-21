# Boot Resource Probe ID Materialize Split

Date: 2026-06-21

## Scope

This dossier records a static source-layout split of the Rev 0 permanent
boot-code helper immediately after the resource probe global buffer signature
check helper:

| Source | ROM range | RAM range | Notes |
| --- | --- | --- | --- |
| `asm/original/rev0/boot/boot_resource_probe_id_materialize.s` | `0x0000539C..0x0000553C` | `0x80074F9C..0x8007513C` | 416-byte prologue helper with one indirect `jalr`. |
| `asm/original/rev0/boot/boot_resource_probe_dual_callback_materialize.s` | `0x0000553C..0x00005624` | `0x8007513C..0x80075224` | Follow-up split documented separately. |
| `asm/original/rev0/boot/boot_resource_probe_global_buffer_dual_callback_apply.s` | `0x00005624..0x00005760` | `0x80075224..0x80075360` | Follow-up split documented separately. |
| `asm/original/rev0/boot/boot_resource_probe_id_check_materialize.s` | `0x00005760..0x0000581C` | `0x80075360..0x8007541C` | Follow-up split documented separately. |
| `asm/original/rev0/boot/boot_resource_probe_indexed_record_check.s` | `0x0000581C..0x00005978` | `0x8007541C..0x80075578` | Follow-up split documented separately. |
| `asm/original/rev0/code_00005978_00011000.s` | `0x00005978..0x00011000` | `0x80075578..0x80080C00` | Current tracked remainder. |

The name is conservative. The routine has a clear static shape around an
incoming resource/probe ID, special cases for IDs `0x0E` and `0x0F`, scratch
record construction, and callback dispatch, but no runtime trace or controlled
mutation has verified final behavior or API semantics.

## Static Evidence

- Parent `../scripts/ob64_symbols_v2.json` reports `0x539C` as a 416-byte valid
  prologue with frame size `0x38`, epilogue, one `jalr`, and next function
  boundary `0x553C`.
- Parent `../scripts/ob64_symbols_v2.json` locates `0x539C` at fixed RAM
  `0x80074F9C` in all seven named states and all 21 parent RAM snapshots.
- Parent callgraph/symbol data reports high-confidence callers `0x4AC8`,
  `0x4C34`, and `0x5760`.
- High-confidence callees are `resource_alloc` (`0x1330`), `0x23780` / RAM
  `0x80093380`, `0x5D9C`, `0x5C58` via RAM target `0x800758FC`, `0x23460` /
  RAM `0x80093060`, `0x1A4F0` / RAM `0x8008A0F0`, `0x5B8C`, and
  `resource_free` (`0x16C4`).
- Parent unresolved-target data reports one unresolved RAM call:
  `0x8016CD90`.
- Xref evidence shows reads and writes of `0x800A83B8`, a write to
  `0x800A83BC`, and reads from `0x800A824C` and `0x800A8258`.
- Static code shape: the routine dispatches on the incoming ID held in `s3`.
- ID `0x0E` allocates and clears a 0x10-byte record, calls unresolved
  `0x8016CD90` on record `+0x0C`, calls nearby helpers with ID `0x0E` and the
  record pointer, then frees the record.
- ID `0x0F` clears 12 bytes of stack scratch, copies 8 bytes from `0x800A8240`
  into stack scratch at `sp+0x14`, ensures shared global buffer `0x800A83B8`
  exists, copies 12 bytes from global-buffer offset `0x30B0` into `sp+0x10`,
  writes byte `1` to `0x800A83BC`, and returns through the epilogue.
- All other IDs allocate and clear a 0x1850-byte scratch record, then loop over
  13 stride-`0x1C` callback slots.
- Each callback iteration reads a function pointer from `0x800A824C + stride`
  and an offset from `0x800A8258 + stride`; nonzero function pointers are called
  through `jalr` with `scratch + offset + 0x0C`.
- After the callback loop, the routine calls nearby helpers with the input ID
  and scratch record, frees the scratch record, and returns.

## Boundaries

- The split starts at parent prologue boundary `0x0000539C`, immediately after
  `boot_resource_probe_global_buffer_signature_check.s`.
- The routine ends after the `jr ra` delay slot at `0x5538`.
- The next parent boundary is `0x0000553C`; parent data reports it as a
  separate 232-byte prologue helper with frame size `0x20`, caller `0x4C5C`,
  two indirect `jalr` calls, no unresolved calls, and reads from
  `0x800A8254/8258/8260/8264`.
- The `0x553C` helper is now documented separately in
  `docs/dossiers/boot-resource-probe-dual-callback-materialize.md`.
- Follow-up splits now cover through `0x00005978`; current active remainder
  starts at `0x00005978`.

## Verification

After the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- Full `node tools\verify_setup.js` passed.
- The assembled report shows 1 tracked composite real-asm chunk made from 46
  tracked source files, plus 99 generated fallback chunks.
- The assembled code-region SHA256 remains
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- The rebuilt full-ROM SHA256 remains
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
