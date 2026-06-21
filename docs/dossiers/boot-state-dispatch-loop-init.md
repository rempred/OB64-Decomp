# Boot State Dispatch Loop Init Split

Date: 2026-06-21

## Scope

This dossier records a static source-layout split of the Rev 0 permanent
boot-code helper immediately after the resource probe record checksum/signature
cluster:

| Source | ROM range | RAM range | Notes |
| --- | --- | --- | --- |
| `asm/original/rev0/boot/boot_state_dispatch_loop_init.s` | `0x00005FC0..0x000065A4` | `0x80075BC0..0x800761A4` | Large dispatch loop/table initializer with local secondary entry `0x6550`. |
| `asm/original/rev0/code_000065A4_00011000.s` | `0x000065A4..0x00011000` | `0x800761A4..0x80080C00` | Remainder at this split; now superseded by the accumulator seed wrapper split. |
| `asm/original/rev0/code_000065E4_00011000.s` | `0x000065E4..0x00011000` | `0x800761E4..0x80080C00` | Remainder after the accumulator seed wrapper split; now superseded by the resource table/mask apply split. |
| `asm/original/rev0/code_000068E0_00011000.s` | `0x000068E0..0x00011000` | `0x800764E0..0x80080C00` | Remainder after the table/mask split; now superseded by the boot state global reset split. |
| `asm/original/rev0/code_000069D8_00011000.s` | `0x000069D8..0x00011000` | `0x800765D8..0x80080C00` | Remainder after the boot state global reset split; now superseded by the boot state slot callback dispatch split. |
| `asm/original/rev0/code_00006EE8_00011000.s` | `0x00006EE8..0x00011000` | `0x80076AE8..0x80080C00` | Remainder after the boot state slot callback dispatch split; now superseded by the boot state slot render callback walk split. |
| `asm/original/rev0/code_000071C8_00011000.s` | `0x000071C8..0x00011000` | `0x80076DC8..0x80080C00` | Current tracked remainder after the boot state slot render callback walk split. |

The name is conservative. The static dispatch-loop and task/status shape is
clear, but no controlled runtime trace in this dossier verifies a complete
state-machine model or final gameplay semantics.

## Static Evidence

- Parent `../scripts/ob64_functions.json` reports `0x5FC0` as a 1508-byte
  prologue helper with frame size `0x28`, epilogue, `jalr`, and indirect jump.
- Parent symbol data places the helper at fixed RAM `0x80075BC0` in all seven
  named states and all 21 parent RAM snapshots.
- Parent symbol data reports a secondary entry at `0x6550`
  (`0x80076150`), offset `0x590` from the main entry.
- The high-confidence caller is `0x22B0`; older parent caller data also shows a
  self/family edge.
- High-confidence callees include `0x23780`, `0x25A10`, `0x65E4`, `0x6724`,
  `0x19D90`, `0x1120`, `0x2D44`, `0x19FC0`, `0x19E30`, and `0x3798`.
- Parent callgraph unresolved target `0x80076150` is the local secondary entry
  `0x6550`, not an outside helper.
- Other unresolved RAM calls/targets visible in the parent callgraph remain
  `0x80089A10`, `0x80089C50`, and `0x80070F14`.
- Local source inspection shows callback table writes across
  `0x800AF028..0x800AF088`.
- Local source inspection also shows task/status traffic at `0x800AF020`,
  `0x800C4BBC`, `0x800C4C26`, `0x800E810E`, and `0x800E8294`.
- The local secondary entry dispatches through jump table `0x800ADF30`.

## Static Shape

- The main entry initializes `s0 = 0x800AEFE0`, then writes a 25-entry callback
  or function-pointer table to `0x800AF028..0x800AF088`.
- It initializes task depth byte `0x800AF020 = 1`, current task head
  `0x800C4BBC = 0x800AEFE0`, clears the initial 8-byte task record through
  `0x80093380`, and copies current halfword state from `0x800E8214`.
- The loop compares the current task halfword against `0x800E8214`; when it
  changes, it resets depth/head state and clears the current task record again.
- The selected task value is masked to zero when it is outside `0..0x1E`, stored
  to `0x800E810E`, and used as an index into the callback table before a `jalr`
  dispatch.
- The callback return pointer is stored to `0x800E8294`.
- The routine calls the local `0x6550` selector helper and neighboring helpers
  `0x65E4` and `0x6724` before status handling.
- It writes wait/status sentinels through `0x800C4C26`, calls optional callback
  slots from the callback result structure, and polls while `0x800C4C26` is
  `0xFFFF` or `0xFFFD`.
- Status `0xFFFE` pops the current task record from the task stack and restores
  the previous task status.
- Status values with high bit `0x8000` clear that bit and update the current
  task's halfword state.
- Other status values push a new 8-byte task record, increment `0x800AF020`,
  link the previous current task at record `+0`, copy the status at record `+4`,
  and continue the loop.
- The local `0x6550` secondary entry subtracts `3` from the selected callback
  index and dispatches through jump table `0x800ADF30`.
- Local `0x6550` cases return `0`, `1`, or `0x800A872C`; one case writes
  `0xFFFE` to `0x800C4C26` before returning.

## Boundaries

- The split starts at parent prologue boundary `0x00005FC0`, immediately after
  `boot_resource_probe_record_checksum_signature.s`.
- The parent-reported `0x6550` secondary entry stays in this file because the
  main loop calls it directly and it uses the same dispatch/status globals.
- The split ends at the next parent prologue boundary `0x000065A4`.
- The `0x000065A4` follow-up wrapper has since been split as
  `boot_mode_message_accumulator_seed_wrapper.s`.
- The `0x000065E4..0x000068E0` follow-up cluster has since been split as
  `boot_resource_table_mask_apply.s`.
- The current active remainder starts at `0x000068E0`.

## Verification

After the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- Full `node tools\verify_setup.js` passed.
- The assembled report shows 1 tracked composite real-asm chunk made from 57
  tracked source files, plus 99 generated fallback chunks.
- The assembled code-region SHA256 remains
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- The rebuilt full-ROM SHA256 remains
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
