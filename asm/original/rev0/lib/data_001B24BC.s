/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001B1000_001C1000.s
 * z64 range: 0x001B24BC..0x001B2500 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Packed small-byte parameter table: 02 02 03 04 01 02 02 0A 04 03 04 03 ... 06 05 04 04 ... 04 05 06 05 ... 04 00 FF 00 00 00 00 00 01 00 00 00 00 00 FF 00 00... . Low-magnitude index/flag bytes. Field meaning not inferred.. */
/* 0x001B24BC 0x802220BC 0x02020304 */ .word 0x02020304 # sllv $zero, $v0, $s0
/* 0x001B24C0 0x802220C0 0x0102020A */ .word 0x0102020A # special_0x0A
/* 0x001B24C4 0x802220C4 0x04030403 */ .word 0x04030403 # bgezl $zero, 0x802230D4
/* 0x001B24C8 0x802220C8 0x04030403 */ .word 0x04030403 # bgezl $zero, 0x802230D8
/* 0x001B24CC 0x802220CC 0x04030403 */ .word 0x04030403 # bgezl $zero, 0x802230DC
/* 0x001B24D0 0x802220D0 0x04000000 */ .word 0x04000000 # bltz $zero, 0x802220D4
/* 0x001B24D4 0x802220D4 0x06050404 */ .word 0x06050404 # regimm_0x05 $s0, 0x802230E8
/* 0x001B24D8 0x802220D8 0x04040504 */ .word 0x04040504 # regimm_0x04 $zero, 0x802234EC
/* 0x001B24DC 0x802220DC 0x04050605 */ .word 0x04050605 # regimm_0x05 $zero, 0x802238F4
/* 0x001B24E0 0x802220E0 0x04050605 */ .word 0x04050605 # regimm_0x05 $zero, 0x802238F8
/* 0x001B24E4 0x802220E4 0x04050605 */ .word 0x04050605 # regimm_0x05 $zero, 0x802238FC
/* 0x001B24E8 0x802220E8 0x0400FF00 */ .word 0x0400FF00 # bltz $zero, 0x80221CEC
/* 0x001B24EC 0x802220EC 0x00000000 */ .word 0x00000000 # nop
/* 0x001B24F0 0x802220F0 0x01000000 */ .word 0x01000000 # sll $zero, $zero, 0
/* 0x001B24F4 0x802220F4 0x0000FF00 */ .word 0x0000FF00 # sll $ra, $zero, 28
/* 0x001B24F8 0x802220F8 0x00000000 */ .word 0x00000000 # nop
/* 0x001B24FC 0x802220FC 0x00000000 */ .word 0x00000000 # nop
