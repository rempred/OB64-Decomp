/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x0001AA40..0x0001AA60 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* function boundary candidate: func_0001AA40, size=32, kind=prologue */
func_0001AA40:
/* 0x0001AA40 0x8008A640 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0001AA44 0x8008A644 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0001AA48 0x8008A648 0x24040103 */ .word 0x24040103 # addiu $a0, $zero, 0x103
/* 0x0001AA4C 0x8008A64C 0x0C02273E */ .word 0x0C02273E # jal 0x80089CF8
/* 0x0001AA50 0x8008A650 0x00002821 */ .word 0x00002821 # move $a1, $zero
/* 0x0001AA54 0x8008A654 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0001AA58 0x8008A658 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0001AA5C 0x8008A65C 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
