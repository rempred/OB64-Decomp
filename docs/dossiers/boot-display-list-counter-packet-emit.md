# Boot Display-List Counter Packet Emit Split

Date: 2026-06-21

## Scope

This dossier records a static source-layout split of the Rev 0 permanent boot
code after the display-list counter-step helper:

| Source | ROM range | RAM range | Notes |
| --- | --- | --- | --- |
| `asm/original/rev0/boot/boot_display_list_counter_packet_emit.s` | `0x000040B0..0x000042D8` | `0x80073CB0..0x80073ED8` | 552-byte prologue helper with secondary epilogue entry `0x42C4`. |
| `asm/original/rev0/code_000042D8_00011000.s` | `0x000042D8..0x00011000` | `0x80073ED8..0x80080C00` | Former tracked remainder; superseded by the resource window cache update split. |

The name is a conservative source-layout label based on packet emission through
the shared display-list cursor, not a verified renderer API name.

## Static Evidence

- Parent `../scripts/ob64_functions.json` reports `0x40B0` as a 552-byte
  prologue function with frame size `0x20`, valid boundary data, and a secondary
  entry at ROM `0x42C4`.
- Parent `../scripts/ob64_callgraph_v2.json` reports high-confidence callers
  from `0x4048` and `0x4050`, the two entries kept in
  `boot_display_list_counter_step.s`.
- Parent `../scripts/ob64_symbols_v2.json` locates the routine at fixed RAM
  `0x80073CB0` in all seven named states and all 21 RAM snapshots.
- The routine has one unresolved JAL target at RAM `0x8016CD30`, matching the
  nearby display-list state emit helper's unresolved target family.
- Xref evidence shows read/write traffic through the shared cursor
  `0x800E9BA0` and packet writes to `0x800F0000..0x800F0048`.
- Static code shape: return through the `0x42C4` epilogue if the incoming low
  byte is zero; otherwise append a command packet using constants including
  `E3000A01`, `FCFFFFFF`, `FFFDF6FB`, `E200001C`, `00504340`, `D900`, `FA00`,
  and `E700`. After the unresolved helper returns, emit either an `E450/E100/F100`
  branch packet or two `DE00` links to `0x80186358` and `0x80186610`, then append
  a trailing `E700 00000000`.

## Boundaries

- The split starts at parent prologue boundary `0x000040B0`, immediately after
  the counter-step helper's `jr ra` delay slot at `0x40AC`.
- The split keeps the secondary entry at `0x42C4` inside the same source file
  because it is the shared epilogue targeted by the early zero-input branch.
- The split ends at exclusive `0x000042D8`, immediately before the next parent
  boundary. Parent data reports `0x42D8` as a leaf entry and `0x42E0` as an
  overlapping prologue entry, so the next pass should keep that pair together
  unless new evidence proves a safer separation.

Follow-up split note: `asm/original/rev0/code_000042D8_00011000.s` has since
been split into `asm/original/rev0/boot/boot_resource_window_cache_update.s`
(`0x000042D8..0x000043D4`) and
`asm/original/rev0/code_000043D4_00011000.s`.

## Verification

After the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- Full `node tools\verify_setup.js` passed.
- The assembled report shows 1 tracked composite real-asm chunk made from 32
  tracked source files, plus 99 generated fallback chunks.
- The assembled code-region SHA256 remains
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- The rebuilt full-ROM SHA256 remains
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
