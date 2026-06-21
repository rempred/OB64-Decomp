# Boot Resource Probe Dual Callback Materialize Split

Date: 2026-06-21

## Scope

This dossier records a static source-layout split of the Rev 0 permanent
boot-code helper immediately after the resource probe ID materialize helper:

| Source | ROM range | RAM range | Notes |
| --- | --- | --- | --- |
| `asm/original/rev0/boot/boot_resource_probe_dual_callback_materialize.s` | `0x0000553C..0x00005624` | `0x8007513C..0x80075224` | 232-byte prologue helper with two indirect `jalr` callback calls. |
| `asm/original/rev0/boot/boot_resource_probe_global_buffer_dual_callback_apply.s` | `0x00005624..0x00005760` | `0x80075224..0x80075360` | Follow-up split documented separately. |
| `asm/original/rev0/boot/boot_resource_probe_id_check_materialize.s` | `0x00005760..0x0000581C` | `0x80075360..0x8007541C` | Follow-up split documented separately. |
| `asm/original/rev0/boot/boot_resource_probe_indexed_record_check.s` | `0x0000581C..0x00005978` | `0x8007541C..0x80075578` | Follow-up split documented separately. |
| `asm/original/rev0/boot/boot_resource_probe_large_record_check.s` | `0x00005978..0x00005A88` | `0x80075578..0x80075688` | Follow-up split documented separately. |
| `asm/original/rev0/code_00005A88_00011000.s` | `0x00005A88..0x00011000` | `0x80075688..0x80080C00` | Current tracked remainder. |

The name is conservative. The routine has a clear static shape around two
13-entry callback-table walks and an ID `0x0F` materialization/finalization
path, but no runtime trace or controlled mutation has verified final behavior or
API semantics.

## Static Evidence

- Parent `../scripts/ob64_symbols_v2.json` reports `0x553C` as a 232-byte valid
  prologue with frame size `0x20`, epilogue, two indirect `jalr` calls, and
  next function boundary `0x5624`.
- Parent `../scripts/ob64_symbols_v2.json` locates `0x553C` at fixed RAM
  `0x8007513C` in all seven named states and all 21 parent RAM snapshots.
- Parent callgraph/symbol data reports one high-confidence caller: `0x4C5C`.
- High-confidence callees are `resource_alloc` (`0x1330`), `0x23780` / RAM
  `0x80093380`, `0x5D9C` / RAM `0x8007599C`, `0x5C58` / RAM `0x80075858`,
  and `resource_free` (`0x16C4`).
- Parent unresolved-target data reports no unresolved RAM calls.
- Xref evidence shows reads from `0x800A8254`, `0x800A8258`, `0x800A8260`, and
  `0x800A8264`.
- Static code shape: the routine allocates a `0x4AE8` scratch record and clears
  it through `0x23780`.
- The first 13-iteration stride-`0x1C` loop reads callback pointers from
  `0x800A8254 + stride` and companion offsets from `0x800A8258 + stride`.
  Nonzero callbacks are called through `jalr` with
  `scratch + offset + 0x0C`.
- The second 13-iteration stride-`0x1C` loop reads callback pointers from
  `0x800A8260 + stride` and companion offsets from `0x800A8264 + stride`.
  Nonzero callbacks are called through `jalr` with
  `scratch + offset + 0x1850`.
- After both callback walks, the routine calls nearby helper `0x5D9C` with ID
  `0x0F` and the scratch record, calls helper `0x5C58` with the scratch record,
  frees the scratch record, and returns.

## Boundaries

- The split starts at parent prologue boundary `0x0000553C`, immediately after
  `boot_resource_probe_id_materialize.s`.
- The routine ends after the `jr ra` delay slot at `0x5620`.
- The `0x5624` helper is now documented separately in
  `docs/dossiers/boot-resource-probe-global-buffer-dual-callback-apply.md`.
- Follow-up splits now cover through `0x00005A88`; current active remainder
  starts at `0x00005A88`.

## Verification

After the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- Full `node tools\verify_setup.js` passed.
- The assembled report shows 1 tracked composite real-asm chunk made from 47
  tracked source files, plus 99 generated fallback chunks.
- The assembled code-region SHA256 remains
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- The rebuilt full-ROM SHA256 remains
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
