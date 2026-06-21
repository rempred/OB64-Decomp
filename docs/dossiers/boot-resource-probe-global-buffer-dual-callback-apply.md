# Boot Resource Probe Global Buffer Dual Callback Apply Split

Date: 2026-06-21

## Scope

This dossier records a static source-layout split of the Rev 0 permanent
boot-code helper immediately after the resource probe dual-callback materialize
helper:

| Source | ROM range | RAM range | Notes |
| --- | --- | --- | --- |
| `asm/original/rev0/boot/boot_resource_probe_global_buffer_dual_callback_apply.s` | `0x00005624..0x00005760` | `0x80075224..0x80075360` | 316-byte prologue helper with two indirect `jalr` callback calls. |
| `asm/original/rev0/boot/boot_resource_probe_id_check_materialize.s` | `0x00005760..0x0000581C` | `0x80075360..0x8007541C` | Follow-up split documented separately. |
| `asm/original/rev0/code_0000581C_00011000.s` | `0x0000581C..0x00011000` | `0x8007541C..0x80080C00` | Current tracked remainder. |

The name is conservative. The routine has a clear static shape around ensuring
a shared global buffer, copying a `0x4AE8` record from that buffer, and applying
two callback tables, but no runtime trace or controlled mutation has verified
final behavior or API semantics.

## Static Evidence

- Parent `../scripts/ob64_symbols_v2.json` reports `0x5624` as a 316-byte valid
  prologue with frame size `0x20`, epilogue, two indirect `jalr` calls, and
  next function boundary `0x5760`.
- Parent `../scripts/ob64_symbols_v2.json` locates `0x5624` at fixed RAM
  `0x80075224` in all seven named states and all 21 parent RAM snapshots.
- Parent callgraph/symbol data reports one high-confidence caller: `0x4DC0`.
- High-confidence callees are `resource_alloc` (`0x1330`, called twice),
  `0x1A4F0` / RAM `0x8008A0F0`, `0x23460` / RAM `0x80093060`, and
  `resource_free` (`0x16C4`).
- Parent unresolved-target data reports no unresolved RAM calls.
- Xref evidence shows reads and writes of `0x800A83B8`, reads from
  `0x800A8250`, `0x800A8258`, `0x800A825C`, and `0x800A8264`.
- Static code shape: the routine allocates a `0x4AE8` scratch record.
- If shared global buffer `0x800A83B8` is null, the routine allocates `0x8000`
  bytes, stores it back to `0x800A83B8`, and fills the span in `0x100`-byte
  chunks through `0x8008A0F0(offset, buffer + offset, 0x100, 0)`.
- The routine copies `0x4AE8` bytes from shared-buffer offset `0x30B0` into
  scratch through `0x80093060`.
- If scratch word `+0x00` is zero, the routine skips callback dispatch and frees
  the scratch record.
- The first 13-iteration stride-`0x1C` loop reads callback pointers from
  `0x800A8250 + stride` and companion offsets from `0x800A8258 + stride`.
  Nonzero callbacks are called through `jalr` with
  `scratch + offset + 0x0C`.
- The second 13-iteration stride-`0x1C` loop reads callback pointers from
  `0x800A825C + stride` and companion offsets from `0x800A8264 + stride`.
  Nonzero callbacks are called through `jalr` with
  `scratch + offset + 0x1850`.
- After both optional callback walks, the routine frees the scratch record and
  returns.

## Boundaries

- The split starts at parent prologue boundary `0x00005624`, immediately after
  `boot_resource_probe_dual_callback_materialize.s`.
- The routine ends after the `jr ra` delay slot at `0x575C`.
- The `0x5760` helper is now documented separately in
  `docs/dossiers/boot-resource-probe-id-check-materialize.md`.
- Current active remainder starts at `0x0000581C`.

## Verification

After the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- Full `node tools\verify_setup.js` passed.
- The assembled report shows 1 tracked composite real-asm chunk made from 48
  tracked source files, plus 99 generated fallback chunks.
- The assembled code-region SHA256 remains
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- The rebuilt full-ROM SHA256 remains
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
