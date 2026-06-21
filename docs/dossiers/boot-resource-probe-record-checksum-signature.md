# Boot Resource Probe Record Checksum/Signature Split

Date: 2026-06-21

## Scope

This dossier records a static source-layout split of the Rev 0 permanent
boot-code helper immediately after the small-record copy/flag helper:

| Source | ROM range | RAM range | Notes |
| --- | --- | --- | --- |
| `asm/original/rev0/boot/boot_resource_probe_record_checksum_signature.s` | `0x00005D9C..0x00005FC0` | `0x8007599C..0x80075BC0` | Prologue helper cluster that writes record header halfwords and copies the base signature into the record. |
| `asm/original/rev0/boot/boot_state_dispatch_loop_init.s` | `0x00005FC0..0x000065A4` | `0x80075BC0..0x800761A4` | Follow-up split documented separately. |
| `asm/original/rev0/code_000065A4_00011000.s` | `0x000065A4..0x00011000` | `0x800761A4..0x80080C00` | Later remainder at this split; now superseded by later source splits. |

The name is conservative. The static checksum/signature shape is clear, but no
runtime trace or controlled mutation has verified final behavior or record
semantics.

## Static Evidence

- Parent `../scripts/ob64_symbols_v2.json` reports `0x5D9C` as a 544-byte
  prologue helper with frame size `0x20`.
- Parent symbol data places the helper at fixed RAM `0x8007599C` in all seven
  named states and all 21 parent RAM snapshots.
- Parent symbol data reports secondary entries at `0x5E84` and `0x5F00`.
- Local source inspection also shows sibling zero-seed entries at `0x5EC4` and
  `0x5F60`, so this split keeps all four local helper entries together.
- Static callers include `0x4C5C`, `0x539C`, and `0x553C`; adjacent
  record-check helpers also call the secondary entries inside this range.
- Parent `../scripts/ob64_callgraph_v2.json` reports the only high-confidence
  external callee as `0x23460` / RAM `0x80093060`.
- Parent callgraph unresolved targets `0x80075A84` and `0x80075B00` are local
  entries inside this same source range.
- Parent xref data does not report global traffic for this helper, but local
  source inspection shows a direct 8-byte copy from `0x800A8240` to record `+4`
  through `0x80093060`.

## Static Shape

- The main `0x5D9C` entry dispatches on incoming ID.
- ID `0x0E` uses record payload `record + 0x0C`, length `4`, and seed/offset
  `0`.
- ID `0x0F` uses record payload `record + 0x0C`, length `0x4ADC`, and
  seed/offset `0x30B0`.
- Other IDs compute `id * 0x1850 + 0x10`, then use record payload
  `record + 0x0C`, length `0x1844`, and that computed seed/offset.
- The first helper result is stored as a low halfword at record `+0`.
- The second helper result is stored as a low halfword at record `+2`.
- The 8-byte base signature at `0x800A8240` is copied to record `+4`.
- `0x5E84` byte-sums `a0[0..a1)` and adds `a2`, returning the low 16 bits.
- `0x5EC4` is the same byte-sum helper with zero seed.
- `0x5F00` bit-counts `a0[0..a1)` and adds `a2`, returning the low 16 bits.
- `0x5F60` is the same bit-count helper with zero seed.

## Boundaries

- The split starts at parent prologue boundary `0x00005D9C`, immediately after
  `boot_resource_probe_small_record_copy_flag.s`.
- The file keeps parent secondary entries `0x5E84` and `0x5F00` plus local
  sibling entries `0x5EC4` and `0x5F60` together because the main entry calls
  into this local helper cluster and the entries share the same checksum/count
  role.
- The padding `nop` at `0x5FBC` remains in this file.
- The next parent prologue boundary `0x00005FC0` is now split separately as
  `boot_state_dispatch_loop_init.s`; the current active remainder starts at
  `0x000065A4`.

## Verification

After the split:

- `node tests\binutils_smoke.js` passed.
- `node tools\assemble_original_mips.js` passed.
- Full `node tools\verify_setup.js` passed.
- The assembled report shows 1 tracked composite real-asm chunk made from 56
  tracked source files, plus 99 generated fallback chunks.
- The assembled code-region SHA256 remains
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- The rebuilt full-ROM SHA256 remains
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
