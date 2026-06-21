# Boot Resource Record Mark-Ready Split

Date: 2026-06-21

## Scope

This dossier records a static source-layout split of the no-name helper after
the parent-labeled LZSS decompressor:

| Source | ROM range | RAM range | Notes |
| --- | --- | --- | --- |
| `asm/original/rev0/boot/boot_resource_record_mark_ready.s` | `0x0000AF7C..0x0000AFAC` | `0x8007AB7C..0x8007ABAC` | Small record flag helper; conservative source-layout name. |
| `asm/original/rev0/boot/boot_resource_loader_callback_register.s` | `0x0000AFAC..0x0000B030` | `0x8007ABAC..0x8007AC30` | Follow-up split; supersedes the old AFAC remainder for this range. |
| `asm/original/rev0/code_0000B030_00011000.s` | `0x0000B030..0x00011000` | `0x8007AC30..0x80080C00` | Current tracked remainder. |

The file name describes the visible static action only. Runtime evidence is
still needed before treating this as a finalized queue/list API.

## Static Evidence

- Parent function data reports `0xAF7C` as a prologue function with size
  `0x30` / 48 bytes, frame size `0x18`, and a normal `jr ra` epilogue.
- Parent runtime-signature data finds this helper at RAM `0x8007AB7C` in all
  seven named states and all 21 RAM snapshots.
- Parent v2 symbols have no label, no rule hits, no v2 callers, and one
  high-confidence callee.
- Parent v2 callgraph records the JAL target as RAM `0x80093810`, resolved to
  target ROM `0x000239A0` with two overlay candidates. Local source preserves
  only the raw JAL target comment until that shared helper is split.
- Parent `docs/overlay-system.md` confirms the simple boot-region mapping is
  valid for this range.
- The adjacent `0xAFAC` helper also uses global `0x800AF320`, while `0xB030` is
  parent-labeled as a resource loader and calls both LZSS decompress and the
  same RAM `0x80093810` helper.

## Static Shape

- Accepts a record pointer in `a0`.
- Moves the record pointer into `a1`.
- Loads `a0 = 0x800AF320` and `a2 = 1`.
- Calls RAM `0x80093810`.
- The JAL delay slot stores byte `1` to `[record+0x08]`.
- Restores `ra` and returns.

## Boundaries

- The split starts at `0x0000AF7C`, immediately after the full parent-sized
  `boot_lzss_decompress.s` range.
- The helper return is at `0xAFA4` with stack restore in the delay slot at
  `0xAFA8`.
- The next formal prologue starts at `0x0000AFAC`; that range is now split out
  as `boot_resource_loader_callback_register.s`, and the current remainder
  starts at `0x0000B030`.

## Verification

After the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- Full `node tools\verify_setup.js` passed.
- The assembled report shows 1 tracked composite real-asm chunk made from 101
  tracked source files, plus 99 generated fallback chunks.
- The assembled code-region SHA256 remains
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- The rebuilt full-ROM SHA256 remains
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
