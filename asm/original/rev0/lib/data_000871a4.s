/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00081000_00091000.s
 * z64 range: 0x000871A4..0x000871C0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Packed byte array data: 0x00010002,0x070B1112,0x14161B1F,0x24270000 (ascending small byte values — likely a threshold/index ramp) then 0x01010202, followed by two 0x00000000 padding words. No RAM pointers.. */
/* 0x000871A4 0x800F6DA4 0x00010002 */ .word 0x00010002 # srl $zero, $at, 0
/* 0x000871A8 0x800F6DA8 0x070B1112 */ .word 0x070B1112 # tltiu $t8, 0x1112
/* 0x000871AC 0x800F6DAC 0x14161B1F */ .word 0x14161B1F # bne $zero, $s6, 0x800FDA2C
/* 0x000871B0 0x800F6DB0 0x24270000 */ .word 0x24270000 # addiu $a3, $at, 0x0
/* 0x000871B4 0x800F6DB4 0x01010202 */ .word 0x01010202 # srl $zero, $at, 8
/* 0x000871B8 0x800F6DB8 0x00000000 */ .word 0x00000000 # nop
/* 0x000871BC 0x800F6DBC 0x00000000 */ .word 0x00000000 # nop
