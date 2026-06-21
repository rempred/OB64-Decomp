# Boot Resource State Reset Split

Date: 2026-06-21

## Scope

This dossier records a static source-layout split of the Rev 0 permanent boot
code after the resource-buffer reset/flag helper:

| Source | ROM range | RAM range | Notes |
| --- | --- | --- | --- |
| `asm/original/rev0/boot/boot_resource_state_reset.s` | `0x00003798..0x000037F8` | `0x80073398..0x800733F8` | Compact 96-byte prologue wrapper. |
| `asm/original/rev0/code_000037F8_00011000.s` | `0x000037F8..0x00011000` | `0x800733F8..0x80080C00` | Next tracked remainder. |

The name is a conservative source-layout label, not a final C API name.

## Static Evidence

- Parent `../scripts/ob64_functions.json` reports `0x3798` as a 96-byte
  prologue routine, frame size `0x18`, no indirect jumps, and no secondary
  entries.
- Parent `../scripts/ob64_callgraph_v2.json` reports high-confidence callers at
  ROM `0x00005FC0` and `0x0004EBCC`, medium-confidence callers at
  `0x001CF960` and `0x001CF9C0`, and high-confidence callees
  `0x8007328C` (`boot_resource_buffer_reset_flags`, ROM `0x368C`) and
  `0x800712C4` (`resource_free`, ROM `0x16C4`).
- The same callgraph leaves `0x80089A10` unresolved, so the wrapper's broader
  role is not yet named semantically.
- Parent `../scripts/ob64_symbols_v2.json` locates the routine at fixed RAM
  `0x80073398` in world map, army management, class-change transition, mission
  briefing, scenario, combat transition, and combat states.
- Static code shape: call unresolved `0x80089A10`, call the previous
  resource-buffer reset helper, clear bytes `0x800A8210`, `0x800A8211`,
  `0x800A8212`, and `0x800A8213`, call `resource_free` on the pointer loaded
  from `0x800AEF9C`, write the returned pointer back to `0x800AEF9C`, and clear
  word `0x800C4B20`.

## Boundaries

- The split starts at parent function boundary `0x00003798`.
- The parent end marker is `0x000037F4`; the branch delay slot at `0x37F4`
  belongs to this routine, so the source split ends at exclusive `0x000037F8`.
- The next tracked cluster starts at `0x000037F8`; parent symbols report an
  overlapping `0x37F8/0x3808` cluster. Keep that cluster together, likely
  through exclusive `0x00003C2C`, unless stronger evidence proves a safer split.

## Verification

After the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- Full `node tools\verify_setup.js` passed.
- The assembled report shows 1 tracked composite real-asm chunk made from 26
  tracked source files, plus 99 generated fallback chunks.
- The assembled code-region SHA256 remains
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- The rebuilt full-ROM SHA256 remains
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
