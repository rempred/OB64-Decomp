# Boot Resource Probe Dispatch Result Build Split

Date: 2026-06-21

## Scope

This dossier records a static source-layout split of the Rev 0 permanent boot
code after the resource probe dispatch-apply helper:

| Source | ROM range | RAM range | Notes |
| --- | --- | --- | --- |
| `asm/original/rev0/boot/boot_resource_probe_dispatch_result_build.s` | `0x00004ED4..0x00004FF0` | `0x80074AD4..0x80074BF0` | 284-byte JAL-target prologue with no indirect calls. |
| `asm/original/rev0/code_00004FF0_00011000.s` | `0x00004FF0..0x00011000` | `0x80074BF0..0x80080C00` | Historical remainder; superseded by the global cleanup split. |
| `asm/original/rev0/boot/boot_resource_probe_global_cleanup.s` | `0x00004FF0..0x00005058` | `0x80074BF0..0x80074C58` | Follow-up split documented separately. |
| `asm/original/rev0/boot/boot_resource_probe_chunk_callback_walk.s` | `0x00005058..0x000050F0` | `0x80074C58..0x80074CF0` | Follow-up split documented separately. |
| `asm/original/rev0/code_000050F0_00011000.s` | `0x000050F0..0x00011000` | `0x80074CF0..0x80080C00` | Current tracked remainder. |

The name is conservative. The routine appears to build or extract a small
result buffer after dispatching resource/probe records, but no runtime trace or
controlled mutation has verified final behavior.

## Static Evidence

- Parent `../scripts/ob64_functions.json` reports `0x4ED4` as a 284-byte valid
  JAL-target prologue routine with frame size `0x28`, epilogue, no `jalr`, no
  indirect jump, and next function boundary `0x4FF0`.
- Parent `../scripts/ob64_symbols_v2.json` locates the routine at fixed RAM
  `0x80074AD4` in all seven named states and all 21 parent RAM snapshots.
- Parent callgraph/symbol data reports high-confidence callers `0x79E84` and
  `0x1DF5F4`, plus medium-confidence callers `0x1D17E0` and `0x24AE88`.
- High-confidence callees are `resource_alloc` (`0x1330`), `0x5978`, `0x50F0`,
  `0x581C`, `0x4FF0`, `0x23460`, and `resource_free` (`0x16C4`).
- Parent unresolved-target data reports no unresolved RAM calls.
- Xref evidence shows a read from `0x800A8258`.
- Static code shape: incoming ID `0x0F` allocates a 0x4AE8-byte scratch record,
  calls helper `0x5978`, and, if that helper succeeds, materializes data through
  `0x50F0(a0=record, a1=0x30B0, a2=0x4AE8)`.
- Other IDs allocate a 0x1850-byte scratch record, call `0x581C(id, record)`,
  and, if that helper succeeds, materialize data through
  `0x50F0(a0=record, a1=id * 0x1850 + 0x10, a2=0x1850)`.
- The ID `0x0F` path uses scratch word `+0x00` as an optional marker; the other
  ID path uses scratch word `+0x0C`.
- When the marker is nonzero, the routine reads offset data from `0x800A8258`,
  derives a scratch source pointer, allocates a 0x1A-byte output buffer, copies
  0x1A bytes through `0x23460`, frees the scratch record, and returns the
  output buffer.
- When the marker is zero or the helper fails, the routine still calls
  `0x4FF0(0x37081383)`, frees the scratch record, and returns zero.

## Boundaries

- The split starts at parent prologue boundary `0x00004ED4`, immediately after
  `boot_resource_probe_dispatch_apply.s`.
- The routine ends after the `jr ra` delay slot at `0x4FEC`.
- The next parent boundary is `0x00004FF0`; parent data reports it as a
  104-byte JAL-target leaf entry with overlapping prologue body `0x4FF8`.
- The `0x4FF0/0x4FF8` helper pair is now documented separately in
  `docs/dossiers/boot-resource-probe-global-cleanup.md`.

## Verification

After the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- Full `node tools\verify_setup.js` passed.
- The assembled report shows 1 tracked composite real-asm chunk made from 41
  tracked source files, plus 99 generated fallback chunks.
- The assembled code-region SHA256 remains
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- The rebuilt full-ROM SHA256 remains
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
