# Next Steps

This is the immediate work queue for the Rev 0 decomp repo. Keep it short and
update it when a task becomes durable, blocked, or complete.

## Completed Gate

The repo can now move from a raw-span exact rebuild to an assembly-backed exact
rebuild while preserving the no-gap rule.

Current passing commands:

```powershell
node tools/assemble_original_mips.js
node tools/rebuild_rom.js --assembled-code build/assembled/rev0/code.bin --out dist/rebuilt.us_rev0.assembled-code.z64 --report build/rebuild/rev0-assembled-code-rebuild-report.json
```

The assembled code-region SHA256 is
`40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`; the full
ROM rebuild SHA256 remains
`571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

## Active Goal

Move the assembly-backed proof from ignored generated chunks toward tracked
`asm/original/` source without losing exact rebuild coverage.

## Ordered Work

1. Decide the tracked source promotion strategy.

   The current generated `.word` source is ignored under
   `build/original-mips/rev0/`. Choose whether to promote all chunks to
   `asm/original/rev0/` now or start with a manifest-driven subset while the
   rest remains generated.

2. Add a tracked-source input mode to `tools/assemble_original_mips.js`.

   The build should prefer tracked source when present and fail loudly if a
   configured chunk is missing, wrong-sized, or not contiguous.

3. Preserve the exact assembled-code rebuild.

   Re-run:

   ```powershell
   node tools/verify_baserom.js
   node tools/build_rom_coverage_ledger.js
   node tools/extract_original_mips.js
   node tools/assemble_original_mips.js
   node tools/extract_rom_segments.js
   node tools/rebuild_rom.js
   node tools/rebuild_rom.js --assembled-code build/assembled/rev0/code.bin --out dist/rebuilt.us_rev0.assembled-code.z64 --report build/rebuild/rev0-assembled-code-rebuild-report.json
   ```

   Required result: both rebuilds are exact byte matches.

4. Begin function/data splitting only after the tracked-source rebuild is
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
