# Boot Resource Probe Small Record Check Split

Date: 2026-06-21

## Scope

This dossier records a static source-layout split of the Rev 0 permanent
boot-code helper immediately after the large-record check helper:

| Source | ROM range | RAM range | Notes |
| --- | --- | --- | --- |
| `asm/original/rev0/boot/boot_resource_probe_small_record_check.s` | `0x00005A88..0x00005B8C` | `0x80075688..0x8007578C` | Overlapping `0x5A88` leaf / `0x5A90` prologue helper that checks the 16-byte record at shared-buffer offset `0`. |
| `asm/original/rev0/boot/boot_resource_probe_indexed_record_copy_flag.s` | `0x00005B8C..0x00005C58` | `0x8007578C..0x80075858` | Follow-up split documented separately. |
| `asm/original/rev0/code_00005C58_00011000.s` | `0x00005C58..0x00011000` | `0x80075858..0x80080C00` | Current tracked remainder. |

The name is conservative. The routine has a clear static small-record check
shape, but no runtime trace or controlled mutation has verified final behavior
or the exact role of the unresolved halfword-return helpers.

## Static Evidence

- Parent `../scripts/ob64_symbols_v2.json` reports `0x5A88` as a 260-byte leaf
  entry and `0x5A90` as an overlapping 252-byte valid prologue with frame size
  `0x28`.
- Parent `../scripts/ob64_symbols_v2.json` aliases the family with primary RAM
  `0x80075578/0x80075580`, with matching code also appearing at
  `0x80075688/0x80075690` in all seven named states and all 21 parent RAM
  snapshots.
- Parent callgraph data records no direct callers on the specific
  `0x00005A88/0x00005A90` entries, but the preceding ID check/materialize
  wrapper targets sibling RAM `0x80075688`; the v2 map folds that target into
  the nearby record-check family.
- High-confidence callees are `resource_alloc` (`0x1330`), `0x1A4F0` / RAM
  `0x8008A0F0`, `0x23460` / RAM `0x80093060`, and `0x23350` / RAM
  `0x80092F50`.
- Parent unresolved-target data reports RAM calls to `0x80075A84` and
  `0x80075B00`.
- Xref evidence reports reads/writes of shared global pointer `0x800A83B8`.
- Static code shape: the `0x5A88` prefix loads `0x800A83B8`, then the `0x5A90`
  prologue body branches on that loaded value.
- If `0x800A83B8` is zero, it allocates `0x8000` bytes through
  `resource_alloc`, stores the pointer globally, and fills the span in
  `0x100`-byte chunks through `0x8008A0F0(offset, buffer + offset, 0x100, 0)`.
- It copies `0x10` bytes from `0x800A83B8 + 0` into caller scratch through
  `0x80093060`.
- It compares the 8 bytes at `scratch + 4` against the base signature at
  `0x800A8240` through `0x80092F50`; a mismatch returns zero.
- It calls unresolved `0x80075A84(scratch + 0x0C, 4, 0)` and compares the low
  halfword return against `lhu scratch+0`.
- It then calls unresolved `0x80075B00(scratch + 0x0C, 4, 0)` and compares the
  low halfword return against `lhu scratch+2`.
- The routine returns `1` only when the signature compare and both halfword
  checks match.

## Boundaries

- The split starts at parent leaf boundary `0x00005A88`, immediately after
  `boot_resource_probe_large_record_check.s`.
- The file keeps `0x5A88` and `0x5A90` together because the leaf prefix loads
  the shared global pointer used by the prologue body's first branch.
- The routine ends after the `jr ra` delay slot at `0x5B88`.
- The next parent boundary was `0x00005B8C`; the follow-up split now covers
  `0x00005B8C..0x00005C58`.
- The active remainder starts at `0x00005C58`, an overlapping leaf/prologue
  helper family that should be inspected before the next split.

## Verification

After the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- Full `node tools\verify_setup.js` passed.
- The assembled report shows 1 tracked composite real-asm chunk made from 52
  tracked source files, plus 99 generated fallback chunks.
- The assembled code-region SHA256 remains
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- The rebuilt full-ROM SHA256 remains
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
