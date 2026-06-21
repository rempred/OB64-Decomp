# Boot Resource Global Handle Release Split

Date: 2026-06-21

## Scope

This dossier records a static source-layout split of the compact Rev 0 permanent
helper immediately after the boot state slot queue service gate:

| Source | ROM range | RAM range | Notes |
| --- | --- | --- | --- |
| `asm/original/rev0/boot/boot_resource_global_handle_release.s` | `0x00007200..0x0000722C` | `0x80076E00..0x80076E2C` | Leaf prefix at `0x7200` plus `0x7208` prologue body; passes global `0x800AF0B0` to helper `0x80173BA0`, then clears the global. |
| `asm/original/rev0/code_0000722C_00011000.s` | `0x0000722C..0x00011000` | `0x80076E2C..0x80080C00` | Current tracked remainder. |

The name is conservative. It records the static global-handle release-like
shape and its pairing with the following `0x722C` helper, not runtime-verified
ownership semantics.

## Static Evidence

- Parent `../scripts/ob64_functions.json` reports `0x7200` as a 44-byte leaf
  entry that falls through into the `0x7208` prologue body.
- Parent data reports `0x7208` as a 36-byte prologue body with frame size
  `0x18` and clean end `0x722C`.
- Parent symbol data places `0x7200/0x7208` at fixed RAM
  `0x80076E00/0x80076E08` in all seven named states and all 21 snapshots.
- Parent callgraph reports high-confidence callers `0x4EBCC` and `0x4EC3C`
  plus medium-confidence caller `0x1CF960`.
- High-confidence callee is `0x49AA0` / RAM `0x80173BA0`.
- Parent/local xrefs show reads and writes of word global `0x800AF0B0`.
- The following sibling `0x722C` calls paired helper `0x80173B60` and stores the
  return value back to `0x800AF0B0`.

## Static Shape

- The leaf prefix loads `lw a0, [0x800AF0B0]`.
- The body saves `ra`, calls helper `0x80173BA0(a0)`, clears `0x800AF0B0`, then
  restores `ra` and returns.
- Parent/caller source shows this helper used before setup/teardown wrapper
  calls at `0x4EBCC`, `0x4EC3C`, and `0x1CF960`.

## Boundaries

- The split starts at parent leaf boundary `0x00007200`, immediately after
  `boot_state_slot_queue_service_gate.s`.
- The two-word `0x7200` prefix stays with the `0x7208` prologue body because it
  loads the global handle used by the body and falls through directly.
- The helper has a normal epilogue at `0x7220..0x7228`.
- The next clean boundary is `0x0000722C`, a larger sibling helper that starts
  with the same global read and stores a new value to `0x800AF0B0`.

## Verification

After the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- Full `node tools\verify_setup.js` passed after docs were updated.
- The assembled report shows 1 tracked composite real-asm chunk made from 64
  tracked source files, plus 99 generated fallback chunks.
- The assembled code-region SHA256 remains
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- The rebuilt full-ROM SHA256 remains
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
