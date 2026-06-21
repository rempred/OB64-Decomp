# Boot Resource Probe Finalize Split

Date: 2026-06-21

## Scope

This dossier records a static source-layout split of the compact Rev 0 permanent
boot-code wrapper after the resource probe init helper:

| Source | ROM range | RAM range | Notes |
| --- | --- | --- | --- |
| `asm/original/rev0/boot/boot_resource_probe_finalize.s` | `0x00004C34..0x00004C5C` | `0x80074834..0x8007485C` | JAL-target prologue called from `0x1E0024`. |
| `asm/original/rev0/code_00004C5C_00011000.s` | `0x00004C5C..0x00011000` | `0x8007485C..0x80080C00` | Historical remainder; superseded by the dispatch-prepare split. |
| `asm/original/rev0/code_00004DC0_00011000.s` | `0x00004DC0..0x00011000` | `0x800749C0..0x80080C00` | Historical remainder; superseded by the dispatch-apply split. |
| `asm/original/rev0/boot/boot_resource_probe_global_cleanup.s` | `0x00004FF0..0x00005058` | `0x80074BF0..0x80074C58` | Follow-up split documented separately. |
| `asm/original/rev0/code_00005058_00011000.s` | `0x00005058..0x00011000` | `0x80074C58..0x80080C00` | Current tracked remainder after the global cleanup split. |

The name is conservative. The routine has a static finalizer-wrapper shape in
the nearby resource/probe helper family, but no runtime trace or controlled
mutation has verified final behavior.

## Static Evidence

- Parent `../scripts/ob64_functions.json` reports `0x4C34` as a 40-byte valid
  JAL-target prologue routine with frame size `0x18`, epilogue, no `jalr`, and
  no indirect jump.
- Parent `../scripts/ob64_symbols_v2.json` locates the routine at fixed RAM
  `0x80074834` in all seven named states and all 21 parent RAM snapshots.
- Parent callgraph/symbol data reports high-confidence caller `0x1E0024` and
  high-confidence callees `0x539C` and `0x4FF0`.
- The same data reports no unresolved targets and no global memory xrefs for
  this routine.
- Static code shape: the entry saves `ra`, calls `0x539C` with the incoming
  `a0`, then calls `0x4FF0` with magic value `0x37081383` before restoring `ra`
  and returning.

## Boundaries

- The split starts at parent prologue boundary `0x00004C34`, immediately after
  `boot_resource_probe_init.s`.
- The routine ends after the `jr ra` delay slot at `0x4C58`.
- The next parent prologue boundary is `0x00004C5C`; parent data reports it as a
  separate 356-byte JAL-target prologue with frame size `0x28`.
- The `0x4C5C` routine has multiple callers/callees, two unresolved calls, one
  `jalr`, and reads from `0x800A8254/0x800A8258`; it is now documented
  separately in `docs/dossiers/boot-resource-probe-dispatch-prepare.md`.
- The following `0x4DC0` routine is now documented separately in
  `docs/dossiers/boot-resource-probe-dispatch-apply.md`.
- The following `0x4FF0/0x4FF8` helper pair is now documented separately in
  `docs/dossiers/boot-resource-probe-global-cleanup.md`.

## Verification

After the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- Full `node tools\verify_setup.js` passed.
- The assembled report shows 1 tracked composite real-asm chunk made from 38
  tracked source files, plus 99 generated fallback chunks.
- The assembled code-region SHA256 remains
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- The rebuilt full-ROM SHA256 remains
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
