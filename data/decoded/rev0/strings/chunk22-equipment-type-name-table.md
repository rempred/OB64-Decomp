# Chunk-22 weapon/armor equipment-type name table (0x163FC0) — decoded strings

- Source owner: `build/original-mips/rev0/code_00161000_00171000.s` (raw bytes preserved; this is a companion decode).
- ROM range (z64): `0x00163FC0..0x001641C4` (516 bytes).
- Encoding: ASCII, NUL-terminated, big-endian (z64) byte order; @-prefixed inline control codes left verbatim.
- Strings: 46.
- `@` control codes seen: none.
- Control-code semantics: **UNRESOLVED — @0..@3/@w/@c/@e are inline formatting/control codes; exact runtime meaning not decoded**.
- Confidence: high (printable ASCII text); control-code semantics hypothesis-grade.

Printable ASCII is shown verbatim; `\xHH` = a non-printable byte; NUL terminators/padding are listed as `<NUL×n>`. No control code has been removed or normalized.

| ROM offset | bytes | decoded text (verbatim) |
|---|---:|---|
| `0x00163FC0` | 5 | Sword |
| `0x00163FC5` | 3 | `<NUL×3>` |
| `0x00163FC8` | 10 | Greatsword |
| `0x00163FD2` | 2 | `<NUL×2>` |
| `0x00163FD4` | 15 | Thrusting Sword |
| `0x00163FE3` | 1 | `<NUL×1>` |
| `0x00163FE4` | 22 | \x0E1-Handed\x10cAxe/Hammer\x0F |
| `0x00163FFA` | 2 | `<NUL×2>` |
| `0x00163FFC` | 22 | \x0E2-Handed\x10cAxe/Hammer\x0F |
| `0x00164012` | 2 | `<NUL×2>` |
| `0x00164014` | 11 | Short Spear |
| `0x0016401F` | 1 | `<NUL×1>` |
| `0x00164020` | 5 | Spear |
| `0x00164025` | 3 | `<NUL×3>` |
| `0x00164028` | 4 | Whip |
| `0x0016402C` | 4 | `<NUL×4>` |
| `0x00164030` | 4 | Claw |
| `0x00164034` | 4 | `<NUL×4>` |
| `0x00164038` | 3 | Bow |
| `0x0016403B` | 1 | `<NUL×1>` |
| `0x0016403C` | 4 | Mace |
| `0x00164040` | 4 | `<NUL×4>` |
| `0x00164044` | 5 | Staff |
| `0x00164049` | 3 | `<NUL×3>` |
| `0x0016404C` | 4 | Doll |
| `0x00164050` | 4 | `<NUL×4>` |
| `0x00164054` | 12 | Small Shield |
| `0x00164060` | 4 | `<NUL×4>` |
| `0x00164064` | 6 | Shield |
| `0x0016406A` | 2 | `<NUL×2>` |
| `0x0016406C` | 11 | Light Armor |
| `0x00164077` | 1 | `<NUL×1>` |
| `0x00164078` | 5 | Armor |
| `0x0016407D` | 3 | `<NUL×3>` |
| `0x00164080` | 15 | Full Body Armor |
| `0x0016408F` | 1 | `<NUL×1>` |
| `0x00164090` | 4 | Robe |
| `0x00164094` | 4 | `<NUL×4>` |
| `0x00164098` | 7 | Garment |
| `0x0016409F` | 1 | `<NUL×1>` |
| `0x001640A0` | 4 | Helm |
| `0x001640A4` | 4 | `<NUL×4>` |
| `0x001640A8` | 8 | Headgear |
| `0x001640B0` | 4 | `<NUL×4>` |
| `0x001640B4` | 9 | Spellbook |
| `0x001640BD` | 3 | `<NUL×3>` |
| `0x001640C0` | 3 | Fan |
| `0x001640C3` | 1 | `<NUL×1>` |
| `0x001640C4` | 9 | Accessory |
| `0x001640CD` | 3 | `<NUL×3>` |
| `0x001640D0` | 11 | Expendable: |
| `0x001640DB` | 1 | `<NUL×1>` |
| `0x001640DC` | 9 | Valuable: |
| `0x001640E5` | 3 | `<NUL×3>` |
| `0x001640E8` | 8 | Curative |
| `0x001640F0` | 4 | `<NUL×4>` |
| `0x001640F4` | 10 | Supplement |
| `0x001640FE` | 2 | `<NUL×2>` |
| `0x00164100` | 5 | Other |
| `0x00164105` | 3 | `<NUL×3>` |
| `0x00164108` | 8 | Portable |
| `0x00164110` | 4 | `<NUL×4>` |
| `0x00164114` | 8 | Treasure |
| `0x0016411C` | 4 | `<NUL×4>` |
| `0x00164121` | 3 | `<NUL×3>` |
| `0x00164124` | 9 | Character |
| `0x0016412D` | 3 | `<NUL×3>` |
| `0x00164130` | 4 | Unit |
| `0x00164134` | 4 | `<NUL×4>` |
| `0x00164138` | 10 | Enemy Unit |
| `0x00164142` | 2 | `<NUL×2>` |
| `0x00164144` | 5 | Sleep |
| `0x00164149` | 3 | `<NUL×3>` |
| `0x0016414C` | 8 | Paralyze |
| `0x00164154` | 4 | `<NUL×4>` |
| `0x00164158` | 7 | Petrify |
| `0x0016415F` | 1 | `<NUL×1>` |
| `0x00164160` | 11 | Mobile Wall |
| `0x0016416B` | 1 | `<NUL×1>` |
| `0x0016416C` | 11 | Right Ahead |
| `0x00164177` | 1 | `<NUL×1>` |
| `0x00164178` | 10 | Left Ahead |
| `0x00164182` | 2 | `<NUL×2>` |
| `0x00164184` | 11 | Grand Arrow |
| `0x0016418F` | 1 | `<NUL×1>` |
| `0x00164190` | 11 | Wedge Shift |
| `0x0016419B` | 1 | `<NUL×1>` |
| `0x0016419C` | 10 | Dual Wedge |
| `0x001641A6` | 2 | `<NUL×2>` |
| `0x001641A8` | 12 | Funnel Shift |
| `0x001641B4` | 4 | `<NUL×4>` |
| `0x001641B8` | 10 | Wing Shift |
| `0x001641C2` | 2 | `<NUL×2>` |
