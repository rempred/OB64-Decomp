# Boot Resource Probe Indexed Record Copy/Flag Split

Date: 2026-06-21

## Scope

This dossier records a static source-layout split of the Rev 0 permanent
boot-code helper immediately after the small-record check helper:

| Source | ROM range | RAM range | Notes |
| --- | --- | --- | --- |
| `asm/original/rev0/boot/boot_resource_probe_indexed_record_copy_flag.s` | `0x00005B8C..0x00005C58` | `0x8007578C..0x80075858` | Prologue helper that copies one `0x1850`-byte indexed record from the shared probe buffer into caller scratch and marks the buffer dirty/valid byte. |
| `asm/original/rev0/boot/boot_resource_probe_large_record_copy_flag.s` | `0x00005C58..0x00005CFC` | `0x80075858..0x800758FC` | Follow-up split documented separately. |
| `asm/original/rev0/boot/boot_resource_probe_small_record_copy_flag.s` | `0x00005CFC..0x00005D9C` | `0x800758FC..0x8007599C` | Follow-up split documented separately. |
| `asm/original/rev0/boot/boot_resource_probe_record_checksum_signature.s` | `0x00005D9C..0x00005FC0` | `0x8007599C..0x80075BC0` | Follow-up split documented separately. |
| `asm/original/rev0/boot/boot_state_dispatch_loop_init.s` | `0x00005FC0..0x000065A4` | `0x80075BC0..0x800761A4` | Follow-up split documented separately. |
| `asm/original/rev0/code_000065A4_00011000.s` | `0x000065A4..0x00011000` | `0x800761A4..0x80080C00` | Later remainder at this split; now superseded by later source splits. |

The name is conservative. The static copy/flag shape is clear, but no runtime
trace or controlled mutation has verified final behavior or record semantics.

## Static Evidence

- Parent `../scripts/ob64_symbols_v2.json` reports `0x5B8C` as a 204-byte
  prologue helper with frame size `0x28`.
- Parent snapshot data places the helper at fixed RAM `0x8007578C` in all seven
  named states and all 21 parent RAM snapshots.
- Parent static callers are `0x4C5C` and `0x539C`.
- High-confidence callees are `resource_alloc` (`0x1330`), `0x1A4F0` / RAM
  `0x8008A0F0`, and `0x23460` / RAM `0x80093060`.
- Parent callgraph data reports no unresolved RAM calls for this helper.
- Xref/access evidence reports reads/writes of shared global pointer
  `0x800A83B8` and a byte write to `0x800A83BC`.
- Static code shape computes an indexed record offset:
  `id * 0x1850 + 0x10`.
- If `0x800A83B8` is zero, it allocates `0x8000` bytes through
  `resource_alloc`, stores the pointer globally, and fills the span in
  `0x100`-byte chunks through `0x8008A0F0(offset, buffer + offset, 0x100, 0)`.
- It copies `0x1850` bytes from `0x800A83B8 + computedOffset` into caller
  scratch through `0x80093060`.
- It stores byte `1` to `0x800A83BC` before returning.

## Boundaries

- The split starts at parent prologue boundary `0x00005B8C`, immediately after
  `boot_resource_probe_small_record_check.s`.
- The routine ends after the `jr ra` delay slot at `0x5C54`.
- The next parent boundary was `0x00005C58`; follow-up splits now cover
  `0x00005C58..0x00005FC0`.
- Follow-up splits now cover through `boot_state_dispatch_loop_init.s`
  (`0x00005FC0..0x000065A4`); the current active remainder starts at
  `0x000065A4`.

## Verification

After the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- Full `node tools\verify_setup.js` passed.
- The assembled report shows 1 tracked composite real-asm chunk made from 53
  tracked source files, plus 99 generated fallback chunks.
- The assembled code-region SHA256 remains
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- The rebuilt full-ROM SHA256 remains
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
