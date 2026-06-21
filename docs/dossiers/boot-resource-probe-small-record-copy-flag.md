# Boot Resource Probe Small Record Copy/Flag Split

Date: 2026-06-21

## Scope

This dossier records a static source-layout split of the Rev 0 permanent
boot-code helper immediately after the large-record copy/flag helper:

| Source | ROM range | RAM range | Notes |
| --- | --- | --- | --- |
| `asm/original/rev0/boot/boot_resource_probe_small_record_copy_flag.s` | `0x00005CFC..0x00005D9C` | `0x800758FC..0x8007599C` | Overlapping `0x5CFC` leaf / `0x5D04` prologue helper that copies the `0x10`-byte record at shared-buffer offset `0` into caller scratch and marks the buffer dirty/valid byte. |
| `asm/original/rev0/boot/boot_resource_probe_record_checksum_signature.s` | `0x00005D9C..0x00005FC0` | `0x8007599C..0x80075BC0` | Follow-up split documented separately. |
| `asm/original/rev0/boot/boot_state_dispatch_loop_init.s` | `0x00005FC0..0x000065A4` | `0x80075BC0..0x800761A4` | Follow-up split documented separately. |
| `asm/original/rev0/code_000065A4_00011000.s` | `0x000065A4..0x00011000` | `0x800761A4..0x80080C00` | Current tracked remainder. |

The name is conservative. The static copy/flag shape is clear, but no runtime
trace or controlled mutation has verified final behavior or record semantics.

## Static Evidence

- Parent `../scripts/ob64_symbols_v2.json` reports `0x5CFC` as a 160-byte leaf
  entry and `0x5D04` as an overlapping 152-byte prologue body with frame size
  `0x20`.
- Parent symbol data lists sibling RAM targets `0x800758FC/0x80075904` for this
  helper in all seven named states and all 21 parent RAM snapshots. Its
  `runtime_ram_primary` aliases to the earlier `0x80075858/0x80075860` family,
  so direct RAM target evidence should be preferred for this split.
- Static direct callers are `0x4C5C` and `0x539C`. Local source inspection shows
  call sites `0x4CC8` in `boot_resource_probe_dispatch_prepare.s` and `0x53EC`
  in `boot_resource_probe_id_materialize.s`, both targeting RAM `0x800758FC`.
- Parent `../scripts/ob64_callgraph_v2.json` folds those calls into target ROM
  `0x5C58` with target RAM `0x800758FC`; this is an aliasing artifact of the
  sibling family, not evidence that the bytes belong in the previous helper.
- High-confidence callees are `resource_alloc` (`0x1330`), `0x1A4F0` / RAM
  `0x8008A0F0`, and `0x23460` / RAM `0x80093060`.
- Parent callgraph data reports no unresolved RAM calls for this helper.
- Xref/access evidence reports reads/writes of shared global pointer
  `0x800A83B8` and a byte write to `0x800A83BC`.
- Static code shape: the `0x5CFC` prefix loads `0x800A83B8`, then the `0x5D04`
  prologue body branches on that loaded value.
- If `0x800A83B8` is zero, it allocates `0x8000` bytes through
  `resource_alloc`, stores the pointer globally, and fills the span in
  `0x100`-byte chunks through `0x8008A0F0(offset, buffer + offset, 0x100, 0)`.
- It copies `0x10` bytes from `0x800A83B8 + 0` into caller scratch through
  `0x80093060`.
- It stores byte `1` to `0x800A83BC` before returning.

## Boundaries

- The split starts at parent leaf boundary `0x00005CFC`, immediately after
  `boot_resource_probe_large_record_copy_flag.s`.
- The file keeps `0x5CFC` and `0x5D04` together because the leaf prefix loads
  the shared global pointer used by the prologue body's first branch.
- The routine ends after the `jr ra` delay slot at `0x5D98`.
- The next parent boundary was `0x00005D9C`; the follow-up
  `boot_resource_probe_record_checksum_signature.s` split now covers
  `0x00005D9C..0x00005FC0`.
- The follow-up `boot_state_dispatch_loop_init.s` split now covers
  `0x00005FC0..0x000065A4`; the current active remainder starts at
  `0x000065A4`.

## Verification

After the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- Full `node tools\verify_setup.js` passed.
- The assembled report shows 1 tracked composite real-asm chunk made from 55
  tracked source files, plus 99 generated fallback chunks.
- The assembled code-region SHA256 remains
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- The rebuilt full-ROM SHA256 remains
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
