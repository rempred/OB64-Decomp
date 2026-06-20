# Rev 0 Scope

This repo targets only US Rev 0 for the initial decomp.

Known identity:

- Game: Ogre Battle 64: Person of Lordly Caliber
- Region: USA
- Revision: 0
- Game ID: `NOBE`
- Country: `C:45`
- Project64 CRC pair: `E6419BC5 / 69011DE3`
- Preferred local input: `.v64`
- Canonical tool byte order: `.z64`

Rev 1 knowledge from the parent workspace is useful background, but Rev 1
support should not be added here until the Rev 0 decomp build and compare loop
is stable.

## Structural Coverage Snapshot

`tools/build_rom_coverage_ledger.js` independently scans the Rev 0 ROM and
builds `build/coverage/rev0-rom-coverage-ledger.json/.md`.

Current result:

- ROM size: 41,943,040 bytes.
- Parsed LHA archives: 825.
- Parent archive-catalog count: 825.
- Parent archive offsets match the independent scan.
- Method-like signatures: 837.
- Rejected/unparsed method-like signatures: 12, all inside known code/LZSS or
  archive-gap regions.
- Unknown bytes: 0.
- Archive-gap bytes: 2,429,124.
- Tail data: `0x0275415B..0x0275DD40`.
- Clean trailing `0xFF` padding: `0x0275DD40..0x02800000`.

The 108-byte `archive/audio` overlap at `0x00925483..0x009254EF` is reported by
the ledger instead of hidden; keep it visible until the cluster-1/audio boundary
is fully reconciled.

## Exact Rebuild Snapshot

The raw ledger-span rebuild loop is:

```powershell
node tools/verify_baserom.js
node tools/build_rom_coverage_ledger.js
node tools/extract_rom_segments.js
node tools/rebuild_rom.js
```

Current result:

- Extracted span segments: 1,059.
- Extracted/rebuilt bytes: 41,943,040.
- Rebuilt output: `dist/rebuilt.us_rev0.z64`.
- Reference: `build/baserom.us_rev0.z64`.
- SHA256: `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
- Exact byte match: pass.
- First diff: none.
