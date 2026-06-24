/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_002A1000_002B1000.s
 * z64 range: 0x002A8924..0x002A8940 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Small packed data: 0x20783200, 0x00000000, 0x20783300, then three zero words. Tag/marker pair plus padding.. */
/* 0x002A8924 0x80318524 0x20783200 */ .word 0x20783200 # addi $t8, $v1, 0x3200
/* 0x002A8928 0x80318528 0x00000000 */ .word 0x00000000 # nop
/* 0x002A892C 0x8031852C 0x20783300 */ .word 0x20783300 # addi $t8, $v1, 0x3300
/* 0x002A8930 0x80318530 0x00000000 */ .word 0x00000000 # nop
/* 0x002A8934 0x80318534 0x00000000 */ .word 0x00000000 # nop
/* 0x002A8938 0x80318538 0x00000000 */ .word 0x00000000 # nop
/* 0x002A893C 0x8031853C 0x00000000 */ .word 0x00000000 # nop
