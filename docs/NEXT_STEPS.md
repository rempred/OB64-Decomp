# Next Steps

This is the immediate work queue for the Rev 0 decomp repo. Keep it short and
update it when a task becomes durable, blocked, or complete.

## Setup Complete

The setup phase is complete. The repo can verify Rev 0 identity, whole-ROM
coverage, real GNU MIPS binutils, first tracked chunk real assembly, raw rebuild,
full-ROM source-manifest audit, and assembled-code rebuild with one command.

Current passing commands:

```powershell
node tools/verify_setup.js
```

Current source mix: 1 tracked composite real-assembler chunk
(`0x00001000..0x00011000`) made from 88 tracked source files, plus 99 generated
fallback chunks.

The assembled code-region SHA256 is
`40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`; the full
ROM rebuild SHA256 remains
`571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

Current full-ROM source manifest:

- 1,059 entries.
- 0 unknown bytes.
- 6,510,444 `original_mips` bytes.
- 35,432,596 non-code/raw/data/archive source bytes.
- 2,469,141 ambiguous bytes preserved explicitly.
- 3 tracked non-code source-owner files / 44,029 bytes.
- 1,055 ignored generated non-code source-owner fallback files / 35,388,567
  bytes.
- Source-manifest rebuild exact.

## Active Goal

Expand toward full-ROM no-gap source representation without losing exact rebuild
coverage or overclassifying data as MIPS.

## Ordered Work

1. Promote the next curated tracked non-code source-owner batch.

   The first tracked batch is done under `data/source-owners/rev0/`:
   `raw_header`, `raw_structural_gap`, and ambiguous `raw_tail_data`. Next,
   choose another small batch under `data/` or `assets/`. Keep archive gaps raw
   and explicitly ambiguous unless repeatable scanner evidence improves the
   classification.

2. Keep tracked-owner verification wired into the rebuild path.

   `tools/extract_non_code_sources.js` now prefers verified tracked owners and
   generates fallback owners for the rest. Keep `node tools/verify_setup.js`
   green after every promotion.

3. Continue splitting the first tracked chunk into smaller source files.

   The boot entry, first resource/arena split, allocator/free split,
   validation/realloc/tree-helper split, early loader/state-loop split, boot
   mode/flag-helper split, table/mask reconcile split, boot mode/message
   accumulator split, resource-buffer reset/flag split, resource state reset
   split, resource/display-list update split, display-list state emit split,
   display-list finalize/flip split, display-list sync/modes split, and
   display-list counter-step/counter packet emit splits, resource window cache
   update split, bitstream cursor helper split, bitstream descriptor decode and
   encode splits, resource probe init split, resource probe finalize split, and
   resource probe dispatch-prepare split, resource probe dispatch-apply split,
   resource probe dispatch result-build split, and resource probe global
   cleanup split, resource probe chunk callback-walk split, and resource probe
   global buffer copy split, resource probe global buffer signature-check
   split, resource probe ID materialize split, resource probe dual callback
   materialize split, and resource probe global-buffer dual-callback apply
   split, resource probe ID check/materialize split, and resource probe
   indexed-record check split, resource probe large-record check split, and
   resource probe small-record check split, and resource probe indexed-record
   copy/flag split, resource probe large-record copy/flag split, resource probe
   small-record copy/flag split, resource probe record checksum/signature
   split, boot state dispatch loop init split, boot mode/message accumulator
   seed wrapper split, boot resource table/mask apply split, boot state global
   reset split, boot state slot callback dispatch split, boot state slot render
   callback walk split, boot state slot queue service gate split, boot resource
   global handle release split, boot resource global handle slot record prepare
   split, boot state slot current peer record flag mark split, boot state
   slot target peer record dispatch split, boot state slot flagged
   dispatch/lookup split, boot state slot pool/table helper split, boot state
   slot queue record-step split, boot state slot queue F000 record-step split,
   no-op return-tail split, slot record release/payload helper split, queue
   priority rebuild helper split, render no-op tail split, and `0x58` record
   copy leaf split, display-list transform record emit split, and
   transform-wrapper/clamped-rect emit split, flagged rect packet emit split,
   color rect packet emit split, vector distance/transform-prefix split,
   transform coefficients/sum-clear split, command stream dispatch split,
   command stream resource-node dispatch split, resource-node payload
   materialize split, and resource-node insert/find split are done. Continue
   from `asm/original/rev0/code_00009D50_00011000.s`, beginning with `0x9D50`.
   Parent evidence labels it `dma/resource::resource loader`, with frame size
   `0x50`, command-stream callers, callees to the DMA/cache and allocation
   helpers plus `0xB29C`, `0x9CAC`, and `0xB0B0`, and reads/writes around
   `0x800AF0C4` and `0x800C4BC0`; keep `0x9D50..0x9EFC` together.

4. Keep the setup gate green.

   Re-run `node tools/verify_setup.js` after each split/promotion. Required
   result: PASS.

5. Name functions only from evidence.

   Use parent symbols, trace docs, and clear local labels. Avoid semantic naming
   unless runtime/controlled evidence supports it.

6. Promote more chunks deliberately.

   Use `tools/promote_original_mips.js` in small batches or when a subsystem
   needs that chunk. Do not commit the full generated 125 MB source set at once.

## Watch Items

- The parent archive catalog has missed whole sections in the past. Keep the
  independent LHA scan in the default coverage gate.
- The `archive/audio` overlap at `0x00925483..0x009254EF` is known and should
  remain visible until reconciled.
- Only the early boot region uses the simple `RAM = ROM + 0x8006FC00` mapping.
  Later code is overlay-loaded and needs overlay-aware address handling.
- Generated files under `build/` and `dist/` are local proof artifacts, not
  source files to commit.
