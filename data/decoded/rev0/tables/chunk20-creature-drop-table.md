# creature_drop_table — decoded (chunk 20)

- ROM range (z64): `0x00142258..0x00142378` (288 bytes). Raw owner is authoritative; this is a companion decode.
- 36 records × 0x8-byte stride, indexed by class id. Layout: record (8B): [0]=u8 pad(0x00); [1]=u8 class_id; [2-3]=u16BE drop slot1; [4-5]=slot2; [6-7]=slot3. Drop slot: bit15(0x8000)=equipment flag, bits0-14=item id (index into item_stat_table @ ROM 0x62310). Indexed by class id; record 35 = all-zero sentinel.
- Confidence: HIGH (docs/drop-table.md + editor/parsers.js:566-610 + table_map.json size 288=36x8; byte-verified e.g. Hawkman class 0x27 -> 80 31/80 9B/80 E8). Runtime RAM copy: 0x801EDB18 (scenario state; overlay-relocated).

Drop columns: `E:itemid` = equipment flag set; `i:itemid` = non-equip; `.` = empty. itemid is the raw 15-bit field (index into item_stat_table @ ROM 0x62310).

| rec | ROM | class | drop1 | drop2 | drop3 |
|---:|---|---|---|---|---|
| 0 | `0x00142258` | `0x27` | E:0031 | E:009B | E:00E8 |
| 1 | `0x00142260` | `0x28` | E:0032 | E:009C | E:00E9 |
| 2 | `0x00142268` | `0x29` | E:0033 | E:009C | E:00DE |
| 3 | `0x00142270` | `0x2F` | E:0031 | E:00BE | E:00BE |
| 4 | `0x00142278` | `0x30` | E:00BE | E:00BE | E:00BE |
| 5 | `0x00142280` | `0x31` | E:0069 | i:0006 | i:0017 |
| 6 | `0x00142288` | `0x32` | i:0016 | i:0001 | i:0002 |
| 7 | `0x00142290` | `0x33` | i:0015 | i:0001 | i:0002 |
| 8 | `0x00142298` | `0x34` | i:0008 | i:0001 | i:0002 |
| 9 | `0x001422A0` | `0x35` | i:0001 | E:0001 | E:00A8 |
| 10 | `0x001422A8` | `0x37` | E:0026 | E:003D | E:009B |
| 11 | `0x001422B0` | `0x38` | i:0002 | i:0002 | i:0002 |
| 12 | `0x001422B8` | `0x39` | E:0006 | i:0002 | i:0002 |
| 13 | `0x001422C0` | `0x3A` | E:0008 | i:0002 | i:0002 |
| 14 | `0x001422C8` | `0x3B` | E:0037 | i:0002 | i:0002 |
| 15 | `0x001422D0` | `0x3C` | E:0063 | i:0002 | i:0002 |
| 16 | `0x001422D8` | `0x3D` | E:006F | i:0002 | i:0002 |
| 17 | `0x001422E0` | `0x3E` | E:007C | i:0002 | i:0002 |
| 18 | `0x001422E8` | `0x3F` | E:0100 | i:000D | i:0003 |
| 19 | `0x001422F0` | `0x40` | E:0101 | i:000B | i:0003 |
| 20 | `0x001422F8` | `0x41` | E:0102 | i:000C | i:0003 |
| 21 | `0x00142300` | `0x42` | E:0103 | i:000E | i:0003 |
| 22 | `0x00142308` | `0x43` | i:0013 | i:0011 | i:0005 |
| 23 | `0x00142310` | `0x44` | i:0013 | i:0012 | i:0005 |
| 24 | `0x00142318` | `0x45` | i:0004 | i:0004 | i:0004 |
| 25 | `0x00142320` | `0x46` | i:0009 | i:000A | i:0005 |
| 26 | `0x00142328` | `0x47` | i:0004 | i:0004 | i:0004 |
| 27 | `0x00142330` | `0x48` | i:000F | i:0010 | i:0005 |
| 28 | `0x00142338` | `0x49` | i:0011 | i:0006 | i:0006 |
| 29 | `0x00142340` | `0x4A` | i:0007 | i:0005 | i:0005 |
| 30 | `0x00142348` | `0x4B` | i:0002 | i:0004 | i:0004 |
| 31 | `0x00142350` | `0x4C` | i:0013 | i:0014 | i:0005 |
| 32 | `0x00142358` | `0x4E` | i:0001 | i:0004 | i:0004 |
| 33 | `0x00142360` | `0x4F` | E:008E | E:00A8 | E:00DE |
| 34 | `0x00142368` | `0x50` | E:0091 | E:00B2 | E:00DF |
| 35 | `0x00142370` | `0x00` (sentinel) | . | . | . |
