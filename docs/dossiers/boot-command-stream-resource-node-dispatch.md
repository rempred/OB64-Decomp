# Boot Command Stream Resource Node Dispatch Split

Date: 2026-06-21

## Scope

This dossier records a static source-layout split of the Rev 0 helper following
the boot command stream dispatch split:

| Source | ROM range | RAM range | Notes |
| --- | --- | --- | --- |
| `asm/original/rev0/boot/boot_command_stream_resource_node_dispatch.s` | `0x00009A18..0x00009C50` | `0x80079618..0x80079850` | `0x9A18` leaf/prefix plus the `0x9A28` prologue body. |
| `asm/original/rev0/code_00009C50_00011000.s` | `0x00009C50..0x00011000` | `0x80079850..0x80080C00` | Remainder at this split; now superseded by `code_00009CAC_00011000.s` after the payload materialize split. |

The source name is conservative. It captures the observed command/stream
dispatch and node-like pointer/free shape, not verified runtime semantics.

## Static Evidence

- Parent function data reports `0x9A18` as a 568-byte JAL-target leaf/prefix
  helper fixed in all seven named states and all 21 snapshots, with 30 callers.
- The actual prologue body starts at `0x9A28`, uses frame size `0x20`, has no
  direct callers, and shares the same end at `0x9C50`.
- Local source shows no indirect `jr` dispatch inside this range.
- High-confidence resolved callees are `0xA198`, `0xA1F8`, `0xA250`,
  `0xA29C`, `resource_free` `0x16C4`, and `0xA2F4`.
- The unresolved RAM target is `0x80079D60`, which maps to ROM `0x0000A160`
  under the simple boot mapping.
- Parent/local xrefs show writes to `0x800A8740`.

## Static Shape

- The `0x9A18` prefix stores incoming arguments to stack slots, then falls into
  the `0x9A28` body.
- The body dispatches negative opcode-like values `-0x11`, `-0x12`, `-0x13`,
  and `-0x14`.
- It walks aligned command/stream words and reads/writes current context global
  `0x800A8740`.
- It follows the table/pointer at `[node + 4]` for nested stream entries.
- It manipulates node-like fields at `+0x14` and `+0x18`, calls the nearby
  helper/free family, updates pointer slots, and clears or frees nodes.

## Boundaries

- The split starts at `0x00009A18`, the next word after
  `boot_command_stream_dispatch.s`.
- The split includes the normal return at `0x9C48` and the branch delay-slot
  stack restore at `0x9C4C`.
- The next family begins cleanly at `0x00009C50`; do not include that word in
  this source file.
- Follow-up source-layout work now owns `0x9C50..0x9CAC` as
  `boot_resource_node_payload_materialize.s`, leaving
  `code_00009CAC_00011000.s` as the active remainder.

## Verification

After the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- Full `node tools\verify_setup.js` passed after docs were updated.
- At this command-stream checkpoint, the assembled report showed 1 tracked
  composite real-asm chunk using 86 tracked source files, plus 99 generated
  fallback chunks.
- The assembled code-region SHA256 remains
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- The rebuilt full-ROM SHA256 remains
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
