# Boot Resource Global Handle Slot Record Prepare Split

Date: 2026-06-21

## Scope

This dossier records a static source-layout split of the larger Rev 0 permanent
helper family immediately after the boot resource global handle release helper:

| Source | ROM range | RAM range | Notes |
| --- | --- | --- | --- |
| `asm/original/rev0/boot/boot_resource_global_handle_slot_record_prepare.s` | `0x0000722C..0x00007560` | `0x80076E2C..0x80077160` | Leaf prefix at `0x722C`, `0x7234` prologue body, secondary entries `0x735C` and `0x745C`, and final delay slot at `0x755C`. |
| `asm/original/rev0/code_00007560_00011000.s` | `0x00007560..0x00011000` | `0x80077160..0x80080C00` | Remainder at this split; now superseded by the current-peer-record flag mark split. |
| `asm/original/rev0/code_00007600_00011000.s` | `0x00007600..0x00011000` | `0x80077200..0x80080C00` | Remainder after the current-peer-record flag mark split; now superseded by the target peer-record dispatch split. |

The name is conservative. It records a static global-handle refresh plus
slot-record preparation/insertion shape, not runtime-verified ownership or
scheduler semantics.

## Static Evidence

- Parent `../scripts/ob64_functions.json` reports `0x722C` as a 44-byte leaf
  entry that falls through into the `0x7234` prologue body.
- Parent data reports `0x7234` as an 812-byte prologue helper with frame size
  `0x18`, epilogue, no `jalr`, no indirect jump, and secondary entries at
  `0x735C` and `0x745C`.
- Parent symbol data places `0x722C/0x7234` at fixed RAM
  `0x80076E2C/0x80076E34` in all seven named states and all 21 snapshots.
- Parent callgraph reports high-confidence callers `0x4EC10` and `0x4EC3C`
  for `0x722C`, plus medium-confidence caller `0x1CF9C0`.
- High-confidence callee is `0x49A60` / RAM `0x80173B60`.
- Parent xrefs and local source show reads/writes of word global `0x800AF0B0`,
  reads of `0x800C4C20` and `0x800E810E`, reads/writes of slot-record
  halfword `0x800E82C8`, and writes to nearby record fields
  `0x800E82CE..0x800E82D8` and `0x800E836A..0x800E836C`.
- Address correction: the slot records are rooted at `0x800E82C8`, not
  `0x800F82C8`; the source uses `lui 0x800F` with signed negative
  displacements such as `-0x7D38`.

## Static Shape

- The `0x722C` leaf prefix loads `a0 = [0x800AF0B0]`.
- The `0x7234` body calls `0x80173B60(a0)`, stores the return value back to
  `0x800AF0B0`, restores `ra`, and returns.
- Internal scan code walks six 0xA8-byte slot records, checking flag bit
  `0x8000` in record halfword `+0x00`.
- The `0x735C` secondary entry saves incoming `a0/a1` and stack halfwords, then
  searches forward for a free record and writes one slot.
- The `0x745C` secondary entry saves the same inputs, searches backward from
  slot 4 for an occupied record, then writes the neighboring slot.
- Record writes store incoming fields at `+0x00`, word `+0x10`, and halfwords
  `+0x06/+0x08/+0x0A/+0x0C/+0x0E`.
- The write path also stamps halfwords `+0xA2` and `+0xA4` from active-slot
  globals `0x800C4C20` and `0x800E810E`.

## Boundaries

- The split starts at parent leaf boundary `0x0000722C`, immediately after
  `boot_resource_global_handle_release.s`.
- The two-word `0x722C` prefix stays with the `0x7234` prologue body because it
  loads the global handle consumed by the body and falls through directly.
- The internal secondary entries at `0x735C` and `0x745C` stay in this file
  because they share the same slot-record writer and parent function body.
- The previous active log's "clean end at `0x7558`" wording is corrected:
  `0x7558` is `jr ra`, `0x755C` is the delay-slot store, and the clean
  exclusive end is `0x7560`.
- The old `0x7560` frontier is now split into
  `boot_state_slot_current_peer_record_flag_mark.s`; the next source frontier is
  the `0x7600` prologue helper, which scans the same corrected-base slot-record
  array and calls `0x80077F88`.

## Verification

After the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- Full `node tools\verify_setup.js` passed after docs were updated.
- The assembled report shows 1 tracked composite real-asm chunk made from 65
  tracked source files, plus 99 generated fallback chunks.
- The assembled code-region SHA256 remains
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- The rebuilt full-ROM SHA256 remains
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
