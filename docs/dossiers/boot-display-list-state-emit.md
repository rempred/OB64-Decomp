# Boot Display-List State Emit Split

Date: 2026-06-21

## Scope

This dossier records a static source-layout split of the Rev 0 permanent boot
code after the resource/display-list update cluster:

| Source | ROM range | RAM range | Notes |
| --- | --- | --- | --- |
| `asm/original/rev0/boot/boot_display_list_state_emit.s` | `0x00003C2C..0x00003EE4` | `0x8007382C..0x80073AE4` | 696-byte prologue routine called by the preceding resource/display-list update cluster. |
| `asm/original/rev0/code_00003EE4_00011000.s` | `0x00003EE4..0x00011000` | `0x80073AE4..0x80080C00` | Former next tracked remainder, now superseded by `boot_display_list_finalize_flip.s`. |

The name is a conservative source-layout label based on static display-list
command emission and state/global reads, not a final renderer API name.

## Static Evidence

- Parent `../scripts/ob64_functions.json` reports `0x3C2C` as a 696-byte
  prologue function with frame size `0x20`, `jr ra`, no `jalr`, no indirect
  jump, and no secondary entries. The next parent prologue starts at
  `0x00003EE4`.
- Parent `../scripts/ob64_callgraph_v2.json` reports high-confidence callers
  at `0x37F8` and `0x3808`, one high-confidence callee edge to `0x80090780`
  (`0x00020B80`), and one unresolved JAL target at RAM `0x8016CD30`.
- Parent `../scripts/ob64_symbols_v2.json` locates the routine at fixed RAM
  `0x8007382C` in all seven named states and all 21 RAM snapshots.
- Xref scan shows reads from `0x800A8213`, `0x800C4B20`, and `0x800E8210`,
  plus read/write traffic through the heavily used display-list cursor global
  `0x800E9BA0` / `0x800F9BA0`.
- The static write set covers the packet area at `0x800F0000..0x800F005C`,
  matching the same display-list buffer family used by the preceding
  resource/display-list update cluster.
- Static code shape: first call unresolved helper `0x8016CD30` and exit early
  if its low byte is nonzero. If flag `0x800A8213` is set, emit a larger packet
  containing F3DEX-like constants such as `FE00`, `E700`, `E3000A01`,
  `E200001C`, `F700`, `FF10013F`, `FFFCFFFC`, and `F64FC3BC`, using
  `0x800C4B20` as a pointer/source word adjusted out of KSEG0 form.
- The later path always emits another display-list packet based on
  `0x800E8210`, calls `0x80090780`, stores the returned word in the packet, and
  emits a `DE00` command pointing at `0x801869C8`.

## Boundaries

- The split starts at parent function boundary `0x00003C2C`, immediately after
  the previous cluster's `jr ra` delay slot at `0x3C28`.
- The split ends at exclusive `0x00003EE4`, immediately before the next parent
  prologue. Parent data reports `0x3EE4` as a separate 236-byte prologue
  function called by `0x27A0`.
- No secondary entries were reported inside `0x3C2C..0x3EE4`, and the only
  branch targets observed in this routine stay inside the range.
- Later source-layout work split that `0x3EE4` target into
  `asm/original/rev0/boot/boot_display_list_finalize_flip.s`, leaving
  `asm/original/rev0/code_00003FD0_00011000.s` as the next remainder.

## Verification

After the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- Full `node tools\verify_setup.js` passed.
- The assembled report shows 1 tracked composite real-asm chunk made from 28
  tracked source files, plus 99 generated fallback chunks.
- The assembled code-region SHA256 remains
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- The rebuilt full-ROM SHA256 remains
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
