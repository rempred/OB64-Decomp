# Boot Resource Probe ID Check Materialize Split

Date: 2026-06-21

## Scope

This dossier records a static source-layout split of the Rev 0 permanent
boot-code helper immediately after the resource probe global-buffer
dual-callback apply helper:

| Source | ROM range | RAM range | Notes |
| --- | --- | --- | --- |
| `asm/original/rev0/boot/boot_resource_probe_id_check_materialize.s` | `0x00005760..0x0000581C` | `0x80075360..0x8007541C` | 188-byte prologue helper with ID-specific scratch allocation and fallback materialize call. |
| `asm/original/rev0/code_0000581C_00011000.s` | `0x0000581C..0x00011000` | `0x8007541C..0x80080C00` | Current tracked remainder. |

The name is conservative. The routine has a clear static shape around checking
one resource/probe ID path and falling back to the `0x539C` materialize helper
when the check fails, but no runtime trace or controlled mutation has verified
final behavior or API semantics.

## Static Evidence

- Parent `../scripts/ob64_symbols_v2.json` reports `0x5760` as a 188-byte valid
  prologue with frame size `0x20`, epilogue, no indirect calls, and next
  function boundary `0x581C`.
- Parent `../scripts/ob64_symbols_v2.json` locates `0x5760` at fixed RAM
  `0x80075360` in all seven named states and all 21 parent RAM snapshots.
- Parent callgraph/symbol data reports one high-confidence caller: `0x4AC8`.
- High-confidence callees are `resource_alloc` (`0x1330`, called three times),
  `0x5978` via RAM targets `0x80075688` and `0x80075578`, `0x581C`,
  `resource_free` (`0x16C4`), and `0x539C`.
- Parent unresolved-target data reports no unresolved RAM calls.
- Xref evidence reports no global reads or writes for this helper.
- Static code shape: the routine dispatches on the incoming ID held in `s2`.
- ID `0x0E` allocates a 0x10-byte scratch record and calls target RAM
  `0x80075688` with the scratch pointer.
- ID `0x0F` allocates a 0x4AE8-byte scratch record and calls target RAM
  `0x80075578` with the scratch pointer.
- Other IDs allocate a 0x1850-byte scratch record and call `0x581C(id,
  scratch)`.
- The checker return is normalized to a boolean-like `s1`; every path frees the
  scratch record through `resource_free`.
- If the checker return was nonzero, the routine returns `1`.
- If the checker return was zero, the routine calls `0x539C(id)` and returns
  `0`.

## Boundaries

- The split starts at parent prologue boundary `0x00005760`, immediately after
  `boot_resource_probe_global_buffer_dual_callback_apply.s`.
- The routine ends after the `jr ra` delay slot at `0x5818`.
- The next parent boundary is `0x0000581C`; parent data reports it as a
  separate 348-byte prologue helper with frame size `0x30`, callers `0x4ED4`
  and `0x5760`, secondary entry `0x588C`, reads/writes `0x800A83B8`, and
  unresolved RAM calls to `0x80075A84` and `0x80075B00`.
- Keep the `0x581C` helper as the next dedicated evidence pass instead of
  merging it into this ID check/materialize wrapper.

## Verification

After the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- Full `node tools\verify_setup.js` passed.
- The assembled report shows 1 tracked composite real-asm chunk made from 49
  tracked source files, plus 99 generated fallback chunks.
- The assembled code-region SHA256 remains
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- The rebuilt full-ROM SHA256 remains
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
