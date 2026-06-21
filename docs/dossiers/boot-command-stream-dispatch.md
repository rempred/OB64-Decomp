# Boot Command Stream Dispatch Split

Date: 2026-06-21

## Scope

This dossier records a static source-layout split of the Rev 0 helper following
the display-list transform coefficients / sum-clear split:

| Source | ROM range | RAM range | Notes |
| --- | --- | --- | --- |
| `asm/original/rev0/boot/boot_command_stream_dispatch.s` | `0x0000978C..0x00009A18` | `0x8007938C..0x80079618` | `0x978C` leaf/prefix plus the `0x97A8` prologue body and jump-table dispatches. |
| `asm/original/rev0/code_00009A18_00011000.s` | `0x00009A18..0x00011000` | `0x80079618..0x80080C00` | Current tracked remainder; starts with the next leaf/prefix family. |

The source name is conservative. It captures the observed command/stream-like
static shape and jump-table dispatches, not verified runtime semantics.

## Static Evidence

- Parent function data reports `0x978C` as a 652-byte (`0x28C`) JAL-target
  leaf/prefix helper fixed in all seven named states and all 21 snapshots.
- Parent data reports 46 callers, indirect-jump behavior, no secondary entries,
  and no unresolved v2 targets for the family.
- The actual prologue body starts at `0x97A8`, uses a frame size of `0x38`, and
  shares the same end at `0x9A18`.
- High-confidence callees are `0x9CAC`, `0x9C50`, `0x9D50`, `0x9EFC`, `0x9FD8`,
  and `resource_free` `0x16C4`.
- Local branch/jump inspection shows three indirect `jr v0` dispatch sites at
  `0x986C`, `0x9950`, and `0x99D8`, with table roots loaded from globals around
  `0x800ADFA8`, `0x800ADFE0`, and `0x800AE008`.

## Static Shape

- The `0x978C` prefix stores incoming arguments to stack slots, loads the
  current context/global from `0x800A8740`, then falls into the `0x97A8` body.
- The body iterates aligned command/stream words from the saved argument/stack
  area and checks negative opcode-like values before dispatching.
- It uses globals `0x800AF0C0` and `0x800AF0C4` as context/state inputs.
- It calls the nearby helper family at `0x9C50`, `0x9CAC`, `0x9D50`,
  `0x9EFC`, and `0x9FD8`, and also calls `resource_free`.
- It writes globals including `0x800A8740` and `0x800C4BC0`.

## Boundaries

- The split starts at `0x0000978C`, the next parent function boundary after the
  display-list transform coefficients / sum-clear helper.
- The split includes the normal return at `0x9A10` and the branch delay-slot
  stack restore at `0x9A14`.
- The next family begins at `0x00009A18`; do not include that word in this
  source file.
- Parent data reports the next `0x9A18` family as a JAL-target leaf/prefix with
  actual prologue body at `0x9A28`, frame size `0x20`, 30 callers, indirect-jump
  behavior, the same helper family as callees, and one unresolved v2 target.
  Local source shows its epilogue at `0x9C48..0x9C4C` and the next clean
  boundary at `0x9C50`, so keep `0x9A18..0x9C50` together unless jump-table
  evidence proves a safer split.

## Verification

After the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- Full `node tools\verify_setup.js` passed after docs were updated.
- The assembled report shows 1 tracked composite real-asm chunk made from 85
  tracked source files, plus 99 generated fallback chunks.
- The assembled code-region SHA256 remains
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- The rebuilt full-ROM SHA256 remains
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
