# Full-ROM Source Manifest

`tools/build_full_source_manifest.js` is the Rev 0 full-ROM source ownership
audit. It does not claim every byte is decoded. It answers the safer question:
which source strategy owns each byte right now?

Run:

```powershell
node tools\build_full_source_manifest.js
```

Generated outputs, both ignored:

- `build/source-manifest/rev0-full-source-manifest.json`
- `build/source-manifest/rev0-full-source-manifest.md`

The command is also part of:

```powershell
node tools\verify_setup.js
```

## Current Result

Current status: PASS.

- Entries: 1,059 contiguous ROM spans.
- ROM bytes covered: 41,943,040 / 41,943,040.
- Unknown bytes: 0.
- Confirmed original-MIPS source bytes: 6,510,444.
- Non-code/raw/data/archive source bytes: 35,432,596.
- Ambiguous bytes preserved explicitly: 2,469,141.

Current source-form byte totals:

| Source form | Bytes | Meaning |
|---|---:|---|
| `original_mips` | 6,510,444 | Configured code region, emitted as byte-exact original MIPS. |
| `raw_header` | 4,096 | N64 header source bytes. |
| `raw_structural_gap` | 24 | Gap between code end and first parsed LHA header. |
| `lha_archive` | 5,041,336 | Parsed LHA archives from the independent scanner. |
| `raw_archive_gap` | 2,429,124 | Bytes inside archive cluster envelopes but outside parsed LHA headers. |
| `raw_audio_data` | 20,065,069 | Audio/custom data envelope. |
| `raw_lzss_region` | 7,188,782 | Raw compressed LZSS region. |
| `raw_tail_data` | 39,909 | Structured tail bytes before final padding. |
| `padding_ff` | 664,256 | Clean trailing `0xFF` padding. |

## Code Evidence

The configured code region is `0x00001000..0x0063676C`. It is currently covered
by `tools/extract_original_mips.js`, assembled by `tools/assemble_original_mips.js`,
and byte-compared against the baserom.

The manifest also imports parent evidence:

- Parent function DB: 3,683 function starts from `../scripts/ob64_functions.json`.
- Overlay source hints from `../ram_snapshots/overlay_sources.json`, all within
  the configured code region.

Important caveat: the original-MIPS source preserves every word in the configured
code region but does not prove every word is executable. Later passes must split
rodata/data away from code when evidence supports it.

## Ambiguity Policy

`raw_archive_gap`, the 108-byte archive/audio overlap, and `raw_tail_data` remain
explicitly ambiguous. They are source-owned and rebuildable, but not decoded.

Do not promote archive-gap bytes as archives, code, or padding until a repeatable
scanner proves the classification. The parent archive catalog has missed whole
sections before, so the independent LHA scan stays in the default gate.

## Next Step

Add a non-code source generator that writes curated binary-include owners under
`data/bin/`, `data/archives/`, or `assets/`, then teach the rebuild path to
consume the full source manifest instead of only `build/segments/rev0/raw/`.
