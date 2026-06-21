# Boot Resource Probe Dispatch Prepare Split

Date: 2026-06-21

## Scope

This dossier records a static source-layout split of the Rev 0 permanent boot
code after the compact resource probe finalizer wrapper:

| Source | ROM range | RAM range | Notes |
| --- | --- | --- | --- |
| `asm/original/rev0/boot/boot_resource_probe_dispatch_prepare.s` | `0x00004C5C..0x00004DC0` | `0x8007485C..0x800749C0` | 356-byte JAL-target prologue with one indirect `jalr`. |
| `asm/original/rev0/code_00004DC0_00011000.s` | `0x00004DC0..0x00011000` | `0x800749C0..0x80080C00` | Historical remainder; superseded by the dispatch-apply split. |
| `asm/original/rev0/boot/boot_resource_probe_global_cleanup.s` | `0x00004FF0..0x00005058` | `0x80074BF0..0x80074C58` | Follow-up split documented separately. |
| `asm/original/rev0/code_00005058_00011000.s` | `0x00005058..0x00011000` | `0x80074C58..0x80080C00` | Current tracked remainder after the global cleanup split. |

The name is conservative. The routine prepares resource/probe records and
dispatches through a small callback table in static code, but no runtime trace
or controlled mutation has verified final behavior.

## Static Evidence

- Parent `../scripts/ob64_functions.json` reports `0x4C5C` as a 356-byte valid
  JAL-target prologue routine with frame size `0x28`, epilogue, `jalr`, no
  indirect jump, and next function boundary `0x4DC0`.
- Parent `../scripts/ob64_symbols_v2.json` locates the routine at fixed RAM
  `0x8007485C` in all seven named states and all 21 parent RAM snapshots.
- Parent callgraph/symbol data reports callers `0x4DF6C`, `0x79E84`,
  `0xEC6D4`, `0x1E05B4`, and `0x24AF04`; the last is medium confidence and the
  others are high confidence.
- High-confidence callees are `0x553C`, `resource_alloc` (`0x1330`),
  `0x23780`, `0x5D9C`, `0x5C58` through overlay-ambiguous target RAM
  `0x800758FC`, `resource_free` (`0x16C4`), `0x5B8C`, and `0x4FF0`.
- Parent unresolved-target data reports RAM calls to `0x8016CDF4` and
  `0x80093540`.
- Xref evidence shows reads from `0x800A8254` and `0x800A8258`.
- Static code shape: incoming ID `0x0F` calls helper `0x553C` and then follows
  the common finalizer path.
- ID `0x0E` allocates a 0x10-byte record, clears it via `0x23780`, calls
  unresolved `0x8016CDF4` on record `+0x0C`, then calls local helpers `0x5D9C`
  and `0x5C58` before freeing the record.
- IDs `0` and `1` allocate a 0x1850-byte record, increment word `+0x0C` with
  zero wrapping to `-1`, and loop 13 table entries at stride `0x1C`. Each
  nonzero callback pointer from `0x800A8254 + stride` is invoked through `jalr`
  with `a0` computed from the allocated record plus the companion value read
  from `0x800A8258 + stride` plus `0x0C`.
- Other IDs call unresolved diagnostic-looking `0x80093540(0x800ADF08, id)` and
  enter an infinite loop.
- Valid paths converge on `0x4FF0(0x37081383)`.

## Boundaries

- The split starts at parent prologue boundary `0x00004C5C`, immediately after
  `boot_resource_probe_finalize.s`.
- The routine ends after the `jr ra` delay slot at `0x4DBC`.
- The next parent prologue boundary is `0x00004DC0`; parent data reports it as
  a separate 276-byte JAL-target prologue with frame size `0x20`, one `jalr`,
  unresolved RAM target `0x8016CDCC`, and reads from `0x800A8258/0x800A8250`.
- The `0x4DC0` routine is now documented separately in
  `docs/dossiers/boot-resource-probe-dispatch-apply.md`.

## Verification

After the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- Full `node tools\verify_setup.js` passed.
- The assembled report shows 1 tracked composite real-asm chunk made from 39
  tracked source files, plus 99 generated fallback chunks.
- The assembled code-region SHA256 remains
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- The rebuilt full-ROM SHA256 remains
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
