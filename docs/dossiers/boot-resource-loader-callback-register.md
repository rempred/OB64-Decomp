# Boot Resource Loader Callback Register Split

Date: 2026-06-21

## Scope

This dossier records a static source-layout split of the compact no-name helper
between the record mark-ready helper and the parent-labeled resource loader:

| Source | ROM range | RAM range | Notes |
| --- | --- | --- | --- |
| `asm/original/rev0/boot/boot_resource_loader_callback_register.s` | `0x0000AFAC..0x0000B030` | `0x8007ABAC..0x8007AC30` | Initializes a small global pair, registers/passes `0x8007AC30` as a callback-like pointer, then finalizes the context. |
| `asm/original/rev0/code_0000B030_00011000.s` | `0x0000B030..0x00011000` | `0x8007AC30..0x80080C00` | Current tracked remainder. |

The file name describes the visible static registration shape only. Runtime
evidence is still needed before treating this as a finalized task/list API.

## Static Evidence

- Parent function data reports `0xAFAC` as a prologue function with size
  `0x84` / 132 bytes, frame size `0x28`, and a normal `jr ra` epilogue.
- Parent runtime-signature data finds this helper at RAM `0x8007ABAC` in all
  seven named states and all 21 RAM snapshots.
- Parent v2 symbols have no label and no v2 callers for this helper.
- Parent v2 callgraph records high-confidence JAL targets at RAM `0x80093570`,
  `0x80094860`, and `0x80094A20`.
- Parent `docs/overlay-system.md` confirms the simple boot-region mapping is
  valid for this range.
- The adjacent `0xB030` helper is parent-labeled as a resource-loader/LZSS
  caller and is loaded into `a2` before the `0x80094860` call.

## Static Shape

- Preserves incoming `a0` in `s1` and incoming `a1` in `s2`.
- Calls `0x80093570(0x800AF320, 0x800AF300, 8)`.
- Loads `s0 = 0x800AF0D0`.
- Calls `0x80094860(0x800AF0D0, s1, 0x8007AC30, 0, 0x800AF300, s2)`, with the
  last two arguments passed on the stack.
- Calls `0x80094A20(0x800AF0D0)`.
- Restores `ra/s2/s1/s0` and returns.

## Boundaries

- The split starts at `0x0000AFAC`, immediately after
  `boot_resource_record_mark_ready.s`.
- The helper return is at `0xB028` with stack restore in the delay slot at
  `0xB02C`.
- The next formal prologue starts at `0x0000B030`; parent labels that helper as
  a resource-loader routine.

## Verification

After the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- Full `node tools\verify_setup.js` passed.
- The assembled report shows 1 tracked composite real-asm chunk made from 102
  tracked source files, plus 99 generated fallback chunks.
- The assembled code-region SHA256 remains
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- The rebuilt full-ROM SHA256 remains
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
