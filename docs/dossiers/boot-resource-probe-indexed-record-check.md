# Boot Resource Probe Indexed Record Check Split

Date: 2026-06-21

## Scope

This dossier records a static source-layout split of the Rev 0 permanent
boot-code helper immediately after the resource probe ID check/materialize
wrapper:

| Source | ROM range | RAM range | Notes |
| --- | --- | --- | --- |
| `asm/original/rev0/boot/boot_resource_probe_indexed_record_check.s` | `0x0000581C..0x00005978` | `0x8007541C..0x80075578` | 348-byte prologue helper that checks one indexed 0x1850-byte record from the shared probe buffer. |
| `asm/original/rev0/boot/boot_resource_probe_large_record_check.s` | `0x00005978..0x00005A88` | `0x80075578..0x80075688` | Follow-up split documented separately. |
| `asm/original/rev0/code_00005A88_00011000.s` | `0x00005A88..0x00011000` | `0x80075688..0x80080C00` | Historical remainder at this step; later splits supersede it. |

The name is conservative. The routine has a clear static indexed-record check
shape, but no runtime trace or controlled mutation has verified the final API
semantics or the exact role of the unresolved halfword-return helpers.

## Static Evidence

- Parent `../scripts/ob64_symbols_v2.json` reports `0x581C` as a 348-byte valid
  prologue with frame size `0x30`, epilogue, no indirect calls, and next
  function boundary `0x5978`.
- Parent `../scripts/ob64_symbols_v2.json` reports secondary entry `0x588C` /
  RAM `0x8007548C` inside the allocation/fill loop.
- Parent `../scripts/ob64_symbols_v2.json` locates `0x581C` at fixed RAM
  `0x8007541C` in all seven named states and all 21 parent RAM snapshots.
- Parent callgraph/symbol data reports high-confidence callers `0x4ED4` and
  `0x5760`.
- High-confidence callees are `resource_alloc` (`0x1330`), `0x1A4F0` / RAM
  `0x8008A0F0`, `0x23460` / RAM `0x80093060`, and `0x23350` / RAM
  `0x80092F50`.
- Parent unresolved-target data reports RAM calls to `0x80075A84` and
  `0x80075B00`.
- Xref evidence reports reads/writes of shared global pointer `0x800A83B8`.
- Static code shape: the routine computes `id * 0x1850 + 0x10`, saves that as
  the source offset, and sets `scratchBody = scratch + 0x0C`.
- If `0x800A83B8` is zero, it allocates `0x8000` bytes through
  `resource_alloc`, stores the pointer globally, and fills the span in
  `0x100`-byte chunks through `0x8008A0F0(offset, buffer + offset, 0x100, 0)`.
- It copies `0x1850` bytes from `0x800A83B8 + sourceOffset` into caller scratch
  through `0x80093060`.
- It compares the 8 bytes at `scratch + 4` against the base signature at
  `0x800A8240` through `0x80092F50`; a mismatch returns zero.
- It calls unresolved `0x80075A84(scratchBody, 0x1844, sourceOffset)` and
  compares the low halfword return against `lhu scratch+0`.
- It calls unresolved `0x80075B00(scratchBody, 0x1844, sourceOffset)` and
  compares the low halfword return against `lhu scratch+2`.
- The routine returns `1` only when the signature compare and both halfword
  checks match.

## Boundaries

- The split starts at parent prologue boundary `0x0000581C`, immediately after
  `boot_resource_probe_id_check_materialize.s`.
- The routine ends after the `jr ra` delay slot at `0x5974`.
- Follow-up split `boot_resource_probe_large_record_check.s` now covers the
  overlapping `0x5978/0x5980` pair through `0x00005A88`.
- The next parent boundary is `0x00005A88`; parent data reports it as another
  overlapping leaf/prologue small-record check helper family.

## Verification

After the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- Full `node tools\verify_setup.js` passed.
- The assembled report shows 1 tracked composite real-asm chunk made from 50
  tracked source files, plus 99 generated fallback chunks.
- The assembled code-region SHA256 remains
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- The rebuilt full-ROM SHA256 remains
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
