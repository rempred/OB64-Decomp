# Chunk-24 inline UI labels + pointer mini-table (0x18F044) — decoded strings

- Source owner: `build/original-mips/rev0/code_00181000_00191000.s` (raw bytes preserved; this is a companion decode).
- ROM range (z64): `0x0018F044..0x0018F100` (188 bytes).
- Encoding: ASCII, NUL-terminated, big-endian (z64) byte order; @-prefixed inline control codes left verbatim.
- Strings: 4.
- `@` control codes seen: none.
- Control-code semantics: **UNRESOLVED — @0..@3/@w/@c/@e are inline formatting/control codes; exact runtime meaning not decoded**.
- Confidence: high (printable ASCII text); control-code semantics hypothesis-grade.

Printable ASCII is shown verbatim; `\xHH` = a non-printable byte; NUL terminators/padding are listed as `<NUL×n>`. No control code has been removed or normalized.

| ROM offset | bytes | decoded text (verbatim) |
|---|---:|---|
| `0x0018F044` | 40 | `<NUL×40>` |
| `0x0018F06C` | 7 | Soldier |
| `0x0018F073` | 1 | `<NUL×1>` |
| `0x0018F074` | 16 | \x81\|\x81\|\x81\|\x81\|\x81\|\x81\|\x81\|\x81\| |
| `0x0018F084` | 12 | `<NUL×12>` |
| `0x0018F090` | 6 | Remove |
| `0x0018F096` | 13 | `<NUL×13>` |
| `0x0018F0A4` | 3 | `<NUL×3>` |
| `0x0018F0A8` | 3 | `<NUL×3>` |
| `0x0018F0AC` | 3 | `<NUL×3>` |
| `0x0018F0B0` | 3 | `<NUL×3>` |
| `0x0018F0B4` | 3 | `<NUL×3>` |
| `0x0018F0B8` | 3 | `<NUL×3>` |
| `0x0018F0BC` | 3 | `<NUL×3>` |
| `0x0018F0C0` | 3 | `<NUL×3>` |
| `0x0018F0C4` | 12 | `<NUL×12>` |
| `0x0018F0D0` | 36 | \x80!\x81H\x80!\x818\x80!\x81(\x80!\x81H\x80!\x81H\x80!\x81(\x80!\x86\xE0\x80!\x86\xE0\x80!\x81X |
| `0x0018F0F4` | 12 | `<NUL×12>` |
