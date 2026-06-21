# Boot Resource Probe Dispatch Apply Split

Date: 2026-06-21

## Scope

This dossier records a static source-layout split of the Rev 0 permanent boot
code after the resource probe dispatch-prepare helper:

| Source | ROM range | RAM range | Notes |
| --- | --- | --- | --- |
| `asm/original/rev0/boot/boot_resource_probe_dispatch_apply.s` | `0x00004DC0..0x00004ED4` | `0x800749C0..0x80074AD4` | 276-byte JAL-target prologue with one indirect `jalr`. |
| `asm/original/rev0/code_00004ED4_00011000.s` | `0x00004ED4..0x00011000` | `0x80074AD4..0x80080C00` | Historical next tracked remainder; superseded by the result-build split. |
| `asm/original/rev0/boot/boot_resource_probe_dispatch_result_build.s` | `0x00004ED4..0x00004FF0` | `0x80074AD4..0x80074BF0` | Follow-up split documented separately. |
| `asm/original/rev0/boot/boot_resource_probe_global_cleanup.s` | `0x00004FF0..0x00005058` | `0x80074BF0..0x80074C58` | Follow-up split documented separately. |
| `asm/original/rev0/boot/boot_resource_probe_chunk_callback_walk.s` | `0x00005058..0x000050F0` | `0x80074C58..0x80074CF0` | Follow-up split documented separately. |
| `asm/original/rev0/boot/boot_resource_probe_global_buffer_copy.s` | `0x000050F0..0x000051A0` | `0x80074CF0..0x80074DA0` | Follow-up split documented separately. |
| `asm/original/rev0/boot/boot_resource_probe_global_buffer_signature_check.s` | `0x000051A0..0x0000539C` | `0x80074DA0..0x80074F9C` | Follow-up split documented separately. |
| `asm/original/rev0/code_0000539C_00011000.s` | `0x0000539C..0x00011000` | `0x80074F9C..0x80080C00` | Current tracked remainder. |

The name is conservative. The routine appears to materialize a resource/probe
record and apply callback-table handlers for selected IDs, but no runtime trace
or controlled mutation has verified final behavior.

## Static Evidence

- Parent `../scripts/ob64_functions.json` reports `0x4DC0` as a 276-byte valid
  JAL-target prologue routine with frame size `0x20`, epilogue, `jalr`, no
  indirect jump, and next function boundary `0x4ED4`.
- Parent `../scripts/ob64_symbols_v2.json` locates the routine at fixed RAM
  `0x800749C0` in all seven named states and all 21 parent RAM snapshots.
- Parent callgraph/symbol data reports high-confidence callers `0x22B0`,
  `0x79E84`, `0x1DF788`, and `0x1E0024`, plus medium-confidence caller
  `0x24AE88`.
- High-confidence callees are `0x5624`, `resource_alloc` (`0x1330`), `0x50F0`,
  `resource_free` (`0x16C4`), and `0x4FF0`.
- Parent unresolved-target data reports one RAM call to `0x8016CDCC`.
- Xref evidence shows reads from `0x800A8258` and `0x800A8250`.
- Static code shape: incoming ID `0x0F` calls helper `0x5624` and then follows
  the common finalizer path.
- ID `0x0E` allocates a 0x10-byte scratch record, calls
  `0x50F0(a0=record, a1=0, a2=0x10)`, calls unresolved `0x8016CDCC` on record
  `+0x0C`, frees the record, and finalizes.
- Other IDs allocate a 0x1850-byte scratch record, compute slot offset
  `id * 0x1850 + 0x10`, call `0x50F0(a0=record, a1=offset, a2=0x1850)`, and
  loop 13 table entries at stride `0x1C`. Each nonzero callback pointer from
  `0x800A8250 + stride` is invoked through `jalr` with `a0` computed from the
  allocated record plus the companion value read from `0x800A8258 + stride`
  plus `0x0C`.
- Valid paths converge on `0x4FF0(0x37081383)`.

## Boundaries

- The split starts at parent prologue boundary `0x00004DC0`, immediately after
  `boot_resource_probe_dispatch_prepare.s`.
- The routine ends after the `jr ra` delay slot at `0x4ED0`.
- The next parent prologue boundary is `0x00004ED4`; parent data reports it as
  a separate 284-byte JAL-target prologue with frame size `0x28`, no `jalr`, no
  unresolved targets, and a read from `0x800A8258`.
- The `0x4ED4` routine is now documented separately in
  `boot-resource-probe-dispatch-result-build.md`.

## Verification

After the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- Full `node tools\verify_setup.js` passed.
- The assembled report shows 1 tracked composite real-asm chunk made from 40
  tracked source files, plus 99 generated fallback chunks.
- The assembled code-region SHA256 remains
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- The rebuilt full-ROM SHA256 remains
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
