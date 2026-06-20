# Next Steps

This is the immediate work queue for the Rev 0 decomp repo. Keep it short and
update it when a task becomes durable, blocked, or complete.

## Active Goal

Move from a raw-span exact rebuild to an assembly-backed exact rebuild while
preserving the no-gap rule.

## Ordered Work

1. Pick and document the local MIPS assembler/linker path.

   Requirements: MIPS III, big-endian, no unintended relaxation, stable binary
   extraction, and scripted compare output. A `.word`-only first pass is
   acceptable because the goal is byte preservation before readability.

2. Add an assembler smoke test.

   Assemble a tiny known byte sequence, extract the binary output, and verify it
   matches the expected bytes. Commit the test before depending on the toolchain
   for the ROM.

3. Assemble the current no-gap code region.

   Use the generated original MIPS reference as the source of truth at first.
   The first assembled output can still be `.word` lines plus comments; the key
   milestone is that the assembler can reproduce
   `0x00001000..0x0063676C` exactly.

4. Teach the rebuild loop to substitute assembled code bytes for the raw
   code-region span.

   Keep raw spans for all other regions until their own source forms are ready.
   `tools/rebuild_rom.js` must fail loudly on size mismatch or byte mismatch.

5. Re-run the full current pipeline.

   ```powershell
   node tools/verify_baserom.js
   node tools/build_rom_coverage_ledger.js
   node tools/extract_original_mips.js
   node tools/extract_rom_segments.js
   node tools/rebuild_rom.js
   ```

   Required result: exact byte match with SHA256
   `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

6. Begin function/data splitting only after the assembly-backed rebuild is
   exact.

   Start with low-risk boundaries already supported by parent workspace symbol
   or trace evidence. Keep every byte represented by source, `.word`, or an
   explicitly named data blob.

## Watch Items

- The parent archive catalog has missed whole sections in the past. Keep the
  independent LHA scan in the default coverage gate.
- The `archive/audio` overlap at `0x00925483..0x009254EF` is known and should
  remain visible until reconciled.
- Only the early boot region uses the simple `RAM = ROM + 0x8006FC00` mapping.
  Later code is overlay-loaded and needs overlay-aware address handling.
- Generated files under `build/` and `dist/` are local proof artifacts, not
  source files to commit.
