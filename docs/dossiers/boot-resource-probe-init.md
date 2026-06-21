# Boot Resource Probe Init Split

Date: 2026-06-21

## Scope

This dossier records a static source-layout split of the Rev 0 permanent boot
code after the bitstream descriptor encode helper:

| Source | ROM range | RAM range | Notes |
| --- | --- | --- | --- |
| `asm/original/rev0/boot/boot_resource_probe_init.s` | `0x00004AC8..0x00004C34` | `0x800746C8..0x80074834` | JAL-target prologue called by the early boot resource loader. |
| `asm/original/rev0/code_00004C34_00011000.s` | `0x00004C34..0x00011000` | `0x80074834..0x80080C00` | Historical remainder; superseded by the resource probe finalize split. |
| `asm/original/rev0/code_00004C5C_00011000.s` | `0x00004C5C..0x00011000` | `0x8007485C..0x80080C00` | Historical remainder; superseded by the resource probe dispatch-prepare split. |
| `asm/original/rev0/code_00004DC0_00011000.s` | `0x00004DC0..0x00011000` | `0x800749C0..0x80080C00` | Historical remainder; superseded by the dispatch-apply split. |
| `asm/original/rev0/boot/boot_resource_probe_global_cleanup.s` | `0x00004FF0..0x00005058` | `0x80074BF0..0x80074C58` | Follow-up split documented separately. |
| `asm/original/rev0/boot/boot_resource_probe_chunk_callback_walk.s` | `0x00005058..0x000050F0` | `0x80074C58..0x80074CF0` | Follow-up split documented separately. |
| `asm/original/rev0/boot/boot_resource_probe_global_buffer_copy.s` | `0x000050F0..0x000051A0` | `0x80074CF0..0x80074DA0` | Follow-up split documented separately. |
| `asm/original/rev0/boot/boot_resource_probe_global_buffer_signature_check.s` | `0x000051A0..0x0000539C` | `0x80074DA0..0x80074F9C` | Follow-up split documented separately. |
| `asm/original/rev0/boot/boot_resource_probe_id_materialize.s` | `0x0000539C..0x0000553C` | `0x80074F9C..0x8007513C` | Follow-up split documented separately. |
| `asm/original/rev0/code_0000553C_00011000.s` | `0x0000553C..0x00011000` | `0x8007513C..0x80080C00` | Current tracked remainder. |

The name is conservative. The routine has a static resource/probe initialization
shape, but no runtime trace or controlled mutation has verified final behavior.

## Static Evidence

- Parent `../scripts/ob64_functions.json` reports `0x4AC8` as a 364-byte valid
  JAL-target prologue routine with frame size `0x20`, epilogue, and no indirect
  calls.
- Parent `../scripts/ob64_symbols_v2.json` locates the routine at fixed RAM
  `0x800746C8` in all seven named states and all 21 parent RAM snapshots.
- Parent callgraph/symbol data reports high-confidence caller `0x22B0` and
  high-confidence callees `0x51A0`, `0x539C`, `0x5760`, and `0x4FF0`.
- The same data reports four unresolved calls to RAM `0x80093540`; this RAM
  target is used by many functions and remains unresolved in the parent graph.
- Xref evidence shows this routine writes `0x800A83B8`, `0x800A83BC`,
  `0x800AEFD0`, and `0x800AEFD2`. Current xrefs show `0x800AEFD0` and
  `0x800AEFD2` are only written by `0x4AC8`.
- Static code shape: the entry clears `0x800A83B8/83BC`, initializes three bytes
  at `0x800AEFD0..0x800AEFD2` to `0xFF`, then calls `0x51A0`.
- If `0x51A0` returns nonzero, the routine calls unresolved `0x80093540` with a
  pointer near `0x800ADE78`, probes IDs `0`, `1`, `0x0F`, and `0x0E` through
  `0x539C`, and jumps to the finalizer path.
- If `0x51A0` returns zero, the routine tests IDs `0` and `1` through `0x5760`,
  records missing IDs into the `0x800AEFD0` byte list, optionally records
  missing IDs `0x0F` and `0x0E`, and emits unresolved diagnostic-looking calls
  with pointers near `0x800ADEA4`, `0x800ADEC8`, and `0x800ADEE8`.
- Both paths call `0x4FF0` with magic value `0x37081383`. The return value is
  zero when no missing IDs were recorded, otherwise pointer `0x800AEFD0`.

## Boundaries

- The split starts at parent prologue boundary `0x00004AC8`, immediately after
  the descriptor encode helper's trailing return/padding shape.
- The routine ends after the `jr ra` delay slot at `0x4C30`.
- The next parent prologue boundary is `0x00004C34`; parent data reports it as a
  separate 40-byte JAL-target prologue with frame size `0x18`. That routine is
  now documented separately in `docs/dossiers/boot-resource-probe-finalize.md`.
- The following `0x00004C5C..0x00004DC0` helper is now documented separately in
  `docs/dossiers/boot-resource-probe-dispatch-prepare.md`.
- The following `0x00004DC0..0x00004ED4` helper is now documented separately in
  `docs/dossiers/boot-resource-probe-dispatch-apply.md`.

## Verification

After the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- Full `node tools\verify_setup.js` passed.
- The assembled report shows 1 tracked composite real-asm chunk made from 37
  tracked source files, plus 99 generated fallback chunks.
- The assembled code-region SHA256 remains
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- The rebuilt full-ROM SHA256 remains
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
