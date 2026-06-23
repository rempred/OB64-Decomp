# Chunk-22 terrain-name + battle/legion/item UI message pool (0x1650A0) — decoded strings

- Source owner: `build/original-mips/rev0/code_00161000_00171000.s` (raw bytes preserved; this is a companion decode).
- ROM range (z64): `0x001650A0..0x00165BD4` (2868 bytes).
- Encoding: ASCII, NUL-terminated, big-endian (z64) byte order; @-prefixed inline control codes left verbatim.
- Strings: 106.
- `@` control codes seen: none.
- Control-code semantics: **UNRESOLVED — @0..@3/@w/@c/@e are inline formatting/control codes; exact runtime meaning not decoded**.
- Confidence: high (printable ASCII text); control-code semantics hypothesis-grade.

Printable ASCII is shown verbatim; `\xHH` = a non-printable byte; NUL terminators/padding are listed as `<NUL×n>`. No control code has been removed or normalized.

| ROM offset | bytes | decoded text (verbatim) |
|---|---:|---|
| `0x001650A0` | 7 | Highway |
| `0x001650A7` | 1 | `<NUL×1>` |
| `0x001650A8` | 6 | Bridge |
| `0x001650AE` | 2 | `<NUL×2>` |
| `0x001650B0` | 5 | Plain |
| `0x001650B5` | 3 | `<NUL×3>` |
| `0x001650B8` | 7 | Barrens |
| `0x001650BF` | 1 | `<NUL×1>` |
| `0x001650C0` | 6 | Forest |
| `0x001650C6` | 2 | `<NUL×2>` |
| `0x001650C8` | 5 | Marsh |
| `0x001650CD` | 3 | `<NUL×3>` |
| `0x001650D0` | 9 | Highlands |
| `0x001650D9` | 3 | `<NUL×3>` |
| `0x001650DC` | 5 | River |
| `0x001650E1` | 3 | `<NUL×3>` |
| `0x001650E4` | 13 | Snowy Highway |
| `0x001650F1` | 3 | `<NUL×3>` |
| `0x001650F4` | 12 | Snowy Bridge |
| `0x00165100` | 4 | `<NUL×4>` |
| `0x00165104` | 11 | Snowy Plain |
| `0x0016510F` | 1 | `<NUL×1>` |
| `0x00165110` | 13 | Snowy Barrens |
| `0x0016511D` | 3 | `<NUL×3>` |
| `0x00165120` | 12 | Snowy Forest |
| `0x0016512C` | 4 | `<NUL×4>` |
| `0x00165130` | 15 | Snowy Highlands |
| `0x0016513F` | 1 | `<NUL×1>` |
| `0x00165140` | 10 | Stronghold |
| `0x0016514A` | 2 | `<NUL×2>` |
| `0x0016514C` | 11 | Castle Wall |
| `0x00165157` | 1 | `<NUL×1>` |
| `0x00165158` | 11 | Castle Gate |
| `0x00165163` | 1 | `<NUL×1>` |
| `0x00165164` | 11 | Castle Gate |
| `0x0016516F` | 1 | `<NUL×1>` |
| `0x00165170` | 6 | Castle |
| `0x00165176` | 2 | `<NUL×2>` |
| `0x00165178` | 18 | Within Castle Wall |
| `0x0016518A` | 2 | `<NUL×2>` |
| `0x0016518C` | 18 | Within Castle Wall |
| `0x0016519E` | 2 | `<NUL×2>` |
| `0x001651A0` | 18 | Within Castle Wall |
| `0x001651B2` | 2 | `<NUL×2>` |
| `0x001651B4` | 6 | Bridge |
| `0x001651BA` | 2 | `<NUL×2>` |
| `0x001651BC` | 13 | Malefic Woods |
| `0x001651C9` | 3 | `<NUL×3>` |
| `0x001651CC` | 9 | Generator |
| `0x001651D5` | 3 | `<NUL×3>` |
| `0x001651D8` | 8 | Building |
| `0x001651E0` | 4 | `<NUL×4>` |
| `0x001651E4` | 22 | Before the Castle Gate |
| `0x001651FA` | 2 | `<NUL×2>` |
| `0x001651FC` | 27 | Before the Castle Gate(Air) |
| `0x00165217` | 1 | `<NUL×1>` |
| `0x00165218` | 37 | No usable items are in the inventory. |
| `0x0016523D` | 3 | `<NUL×3>` |
| `0x00165240` | 33 | No enemy units with the character |
| `0x00165261` | 3 | `<NUL×3>` |
| `0x00165264` | 35 | information ascertained were found. |
| `0x00165287` | 1 | `<NUL×1>` |
| `0x00165288` | 40 | You cannot enlist any more characters to |
| `0x001652B0` | 4 | `<NUL×4>` |
| `0x001652B4` | 40 | the battalion. Please remove a character |
| `0x001652DC` | 4 | `<NUL×4>` |
| `0x001652E0` | 42 | from the battalion in the Organize Screen. |
| `0x0016530A` | 2 | `<NUL×2>` |
| `0x0016530C` | 31 | This cannot be used on the unit |
| `0x0016532B` | 1 | `<NUL×1>` |
| `0x0016532C` | 26 | which belongs to a legion. |
| `0x00165346` | 2 | `<NUL×2>` |
| `0x00165348` | 24 | On hich character do you |
| `0x00165360` | 4 | `<NUL×4>` |
| `0x00165364` | 21 | want to use the item? |
| `0x00165379` | 3 | `<NUL×3>` |
| `0x0016537C` | 24 | You are about to use %s. |
| `0x00165394` | 4 | `<NUL×4>` |
| `0x00165398` | 8 | Proceed? |
| `0x001653A0` | 4 | `<NUL×4>` |
| `0x001653A4` | 45 | Relocation of Legion Leader is not permitted. |
| `0x001653D1` | 3 | `<NUL×3>` |
| `0x001653D4` | 44 | Relocation is not permitted because the link |
| `0x00165400` | 4 | `<NUL×4>` |
| `0x00165404` | 41 | to the Legion Core cannot be established. |
| `0x0016542D` | 3 | `<NUL×3>` |
| `0x00165430` | 44 | Relocation is not permitted because the link |
| `0x0016545C` | 4 | `<NUL×4>` |
| `0x00165460` | 35 | to the Legion Core will be cut off. |
| `0x00165483` | 1 | `<NUL×1>` |
| `0x00165484` | 28 | The group will start moving. |
| `0x001654A0` | 4 | `<NUL×4>` |
| `0x001654A4` | 37 | The group will stop at this location. |
| `0x001654C9` | 3 | `<NUL×3>` |
| `0x001654CC` | 13 | %s was found. |
| `0x001654D9` | 3 | `<NUL×3>` |
| `0x001654DC` | 22 | No items were located. |
| `0x001654F2` | 2 | `<NUL×2>` |
| `0x001654F4` | 16 | %s was persuaded |
| `0x00165504` | 4 | `<NUL×4>` |
| `0x00165508` | 23 | to join your battalion. |
| `0x0016551F` | 1 | `<NUL×1>` |
| `0x00165520` | 43 | The enemy was unstirred by your persuasion. |
| `0x0016554B` | 1 | `<NUL×1>` |
| `0x0016554C` | 31 | Cannot be used in this mission. |
| `0x0016556B` | 1 | `<NUL×1>` |
| `0x0016556C` | 23 |  joined your battalion. |
| `0x00165583` | 1 | `<NUL×1>` |
| `0x00165584` | 11 |  was found. |
| `0x0016558F` | 1 | `<NUL×1>` |
| `0x00165590` | 22 |  has been brought back |
| `0x001655A6` | 2 | `<NUL×2>` |
| `0x001655A8` | 27 | to life as an Angel Knight. |
| `0x001655C3` | 1 | `<NUL×1>` |
| `0x001655C4` | 21 | turned into a zombie. |
| `0x001655D9` | 3 | `<NUL×3>` |
| `0x001655DC` | 29 | You cannot add any more units |
| `0x001655F9` | 3 | `<NUL×3>` |
| `0x001655FC` | 15 | to this legion. |
| `0x0016560B` | 1 | `<NUL×1>` |
| `0x0016560C` | 32 | This character is not capable of |
| `0x0016562C` | 4 | `<NUL×4>` |
| `0x00165630` | 30 | becoming a leader of the unit. |
| `0x0016564E` | 2 | `<NUL×2>` |
| `0x00165650` | 32 | This character is not capable of |
| `0x00165670` | 4 | `<NUL×4>` |
| `0x00165674` | 22 | commanding the legion. |
| `0x0016568A` | 2 | `<NUL×2>` |
| `0x0016568C` | 30 | You have an insufficient fund. |
| `0x001656AA` | 2 | `<NUL×2>` |
| `0x001656AC` | 42 | You cannot purchase any more of this item. |
| `0x001656D6` | 2 | `<NUL×2>` |
| `0x001656D8` | 35 | The inventory of this unit is full. |
| `0x001656FB` | 1 | `<NUL×1>` |
| `0x001656FC` | 35 | The item will be sent to the depot. |
| `0x0016571F` | 1 | `<NUL×1>` |
| `0x00165720` | 19 | Will the unit of %s |
| `0x00165733` | 1 | `<NUL×1>` |
| `0x00165734` | 9 | equip %s? |
| `0x0016573D` | 3 | `<NUL×3>` |
| `0x00165740` | 33 | Legion Leader cannot be replaced. |
| `0x00165761` | 3 | `<NUL×3>` |
| `0x00165764` | 45 | Replacement is not permitted because the link |
| `0x00165791` | 3 | `<NUL×3>` |
| `0x00165794` | 38 | to the Legion Core is not established. |
| `0x001657BA` | 2 | `<NUL×2>` |
| `0x001657BC` | 45 | Replacement is not permitted because the link |
| `0x001657E9` | 3 | `<NUL×3>` |
| `0x001657EC` | 35 | to the Legion Core will be cut off. |
| `0x0016580F` | 1 | `<NUL×1>` |
| `0x00165810` | 22 | Which unit do you want |
| `0x00165826` | 2 | `<NUL×2>` |
| `0x00165828` | 21 | to add to the legion? |
| `0x0016583D` | 3 | `<NUL×3>` |
| `0x00165840` | 25 | This unit will be removed |
| `0x00165859` | 3 | `<NUL×3>` |
| `0x0016585C` | 16 | from the legion. |
| `0x0016586C` | 4 | `<NUL×4>` |
| `0x00165870` | 33 | You are about to purchase %s x%d. |
| `0x00165891` | 3 | `<NUL×3>` |
| `0x00165894` | 8 | Proceed? |
| `0x0016589C` | 4 | `<NUL×4>` |
| `0x001658A0` | 45 | The commander of battalion cannot be changed. |
| `0x001658CD` | 3 | `<NUL×3>` |
| `0x001658D0` | 29 | %s will be sent to the depot. |
| `0x001658ED` | 3 | `<NUL×3>` |
| `0x001658F0` | 20 | %s will be equipped. |
| `0x00165904` | 4 | `<NUL×4>` |
| `0x00165908` | 26 | Leader cannot be replaced. |
| `0x00165922` | 2 | `<NUL×2>` |
| `0x00165924` | 34 | Dead character cannot be replaced. |
| `0x00165946` | 2 | `<NUL×2>` |
| `0x00165948` | 39 | Petrified character cannot be replaced. |
| `0x0016596F` | 1 | `<NUL×1>` |
| `0x00165970` | 36 | This soldier is required to maintain |
| `0x00165994` | 4 | `<NUL×4>` |
| `0x00165998` | 45 | the legion, and therefore cannot be replaced. |
| `0x001659C5` | 3 | `<NUL×3>` |
| `0x001659C8` | 32 | The maximum number of items that |
| `0x001659E8` | 4 | `<NUL×4>` |
| `0x001659EC` | 31 | the unit can carry will change. |
| `0x00165A0B` | 1 | `<NUL×1>` |
| `0x00165A0C` | 43 | A character needs to be assigned to a unit. |
| `0x00165A37` | 1 | `<NUL×1>` |
| `0x00165A38` | 27 | Select the unit to exchange |
| `0x00165A53` | 1 | `<NUL×1>` |
| `0x00165A54` | 19 | the character with. |
| `0x00165A67` | 1 | `<NUL×1>` |
| `0x00165A68` | 48 | You cannot add any more characters to this unit. |
| `0x00165A98` | 4 | `<NUL×4>` |
| `0x00165A9C` | 29 | There is not enough space for |
| `0x00165AB9` | 3 | `<NUL×3>` |
| `0x00165ABC` | 30 | L-sized character to be added. |
| `0x00165ADA` | 2 | `<NUL×2>` |
| `0x00165ADC` | 28 | You cannot place a character |
| `0x00165AF8` | 4 | `<NUL×4>` |
| `0x00165AFC` | 36 | right next to the L-sized character. |
| `0x00165B20` | 4 | `<NUL×4>` |
| `0x00165B24` | 21 | Unit Leader cannot be |
| `0x00165B39` | 3 | `<NUL×3>` |
| `0x00165B3C` | 22 | removed from the unit. |
| `0x00165B52` | 2 | `<NUL×2>` |
| `0x00165B54` | 35 | This character is already selected. |
| `0x00165B77` | 1 | `<NUL×1>` |
| `0x00165B78` | 41 | If this soldier is removed, a unit within |
| `0x00165BA1` | 3 | `<NUL×3>` |
| `0x00165BA4` | 34 | the legion will not be maintained. |
| `0x00165BC6` | 2 | `<NUL×2>` |
| `0x00165BC8` | 3 | Yes |
| `0x00165BCB` | 1 | `<NUL×1>` |
| `0x00165BCC` | 2 | No |
| `0x00165BCE` | 2 | `<NUL×2>` |
| `0x00165BD1` | 3 | `<NUL×3>` |
