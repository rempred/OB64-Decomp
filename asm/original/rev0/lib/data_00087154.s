/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00081000_00091000.s
 * z64 range: 0x00087154..0x0008717C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Glyph/encoding word array: 10 words 0x824F0000,0x82500000,..0x82580000 (sequential 0x82xx high halves, low halves zero). Same 0x82xx glyph/encoding family seen at 0x8678C. Value type: glyph/encoding ids, not pointers.. */
/* 0x00087154 0x800F6D54 0x824F0000 */ .word 0x824F0000 # lb $t7, 0x0($s2)
/* 0x00087158 0x800F6D58 0x82500000 */ .word 0x82500000 # lb $s0, 0x0($s2)
/* 0x0008715C 0x800F6D5C 0x82510000 */ .word 0x82510000 # lb $s1, 0x0($s2)
/* 0x00087160 0x800F6D60 0x82520000 */ .word 0x82520000 # lb $s2, 0x0($s2)
/* 0x00087164 0x800F6D64 0x82530000 */ .word 0x82530000 # lb $s3, 0x0($s2)
/* 0x00087168 0x800F6D68 0x82540000 */ .word 0x82540000 # lb $s4, 0x0($s2)
/* 0x0008716C 0x800F6D6C 0x82550000 */ .word 0x82550000 # lb $s5, 0x0($s2)
/* 0x00087170 0x800F6D70 0x82560000 */ .word 0x82560000 # lb $s6, 0x0($s2)
/* 0x00087174 0x800F6D74 0x82570000 */ .word 0x82570000 # lb $s7, 0x0($s2)
/* 0x00087178 0x800F6D78 0x82580000 */ .word 0x82580000 # lb $t8, 0x0($s2)
