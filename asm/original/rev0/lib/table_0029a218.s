/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00291000_002A1000.s
 * z64 range: 0x0029A218..0x0029A244 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Small index/pointer table, 11 words: 0x81460000 then 0x8258..0x824F0000 descending (low-half pointers/index pairs), type tentatively pointer/index.. */
/* 0x0029A218 0x80309E18 0x81460000 */ .word 0x81460000 # lb $a2, 0x0($t2)
/* 0x0029A21C 0x80309E1C 0x82580000 */ .word 0x82580000 # lb $t8, 0x0($s2)
/* 0x0029A220 0x80309E20 0x82570000 */ .word 0x82570000 # lb $s7, 0x0($s2)
/* 0x0029A224 0x80309E24 0x82560000 */ .word 0x82560000 # lb $s6, 0x0($s2)
/* 0x0029A228 0x80309E28 0x82550000 */ .word 0x82550000 # lb $s5, 0x0($s2)
/* 0x0029A22C 0x80309E2C 0x82540000 */ .word 0x82540000 # lb $s4, 0x0($s2)
/* 0x0029A230 0x80309E30 0x82530000 */ .word 0x82530000 # lb $s3, 0x0($s2)
/* 0x0029A234 0x80309E34 0x82520000 */ .word 0x82520000 # lb $s2, 0x0($s2)
/* 0x0029A238 0x80309E38 0x82510000 */ .word 0x82510000 # lb $s1, 0x0($s2)
/* 0x0029A23C 0x80309E3C 0x82500000 */ .word 0x82500000 # lb $s0, 0x0($s2)
/* 0x0029A240 0x80309E40 0x824F0000 */ .word 0x824F0000 # lb $t7, 0x0($s2)
